import { useState, useEffect, useRef, useCallback } from 'react'
import toast from 'react-hot-toast'
import config from '../config/env'

const STUN_SERVERS = [
  { urls: 'stun:stun.l.google.com:19302' },
  { urls: 'stun:stun1.l.google.com:19302' },
  { urls: 'stun:stun2.l.google.com:19302' },
]

export const useVideoCall = () => {
  // State
  const [currentRoom, setCurrentRoom] = useState(null)
  const [isConnected, setIsConnected] = useState(false)
  const [participants, setParticipants] = useState([])
  const [localStream, setLocalStream] = useState(null)
  const [remoteStreams, setRemoteStreams] = useState([])
  const [isMuted, setIsMuted] = useState(false)
  const [isVideoOff, setIsVideoOff] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  // Refs
  const wsRef = useRef(null)
  const peerConnectionsRef = useRef(new Map())
  const localStreamRef = useRef(null)

  // WebSocket connection
  const connectWebSocket = useCallback((roomId, roomKey) => {
    if (!roomId || !roomKey) {
      console.error('Invalid WebSocket connection parameters:', { roomId, roomKey })
      return
    }

    // Use environment config for WebSocket URL
    const wsUrl = `${config.WS.BASE}/ws/${roomId}?key=${roomKey}`
    console.log('Connecting to WebSocket:', {
      base: config.WS.BASE,
      roomId,
      roomKey,
      fullUrl: wsUrl
    })
    
    wsRef.current = new WebSocket(wsUrl)
    
    wsRef.current.onopen = () => {
      console.log('WebSocket connected successfully')
      setIsConnected(true)
    }
    
    wsRef.current.onmessage = async (event) => {
      try {
        const data = JSON.parse(event.data)
        console.log('WebSocket message received:', data)
        await handleWebSocketMessage(data)
      } catch (error) {
        console.error('Error handling WebSocket message:', error)
      }
    }
    
    wsRef.current.onclose = (event) => {
      console.log('WebSocket disconnected:', {
        code: event.code,
        reason: event.reason,
        wasClean: event.wasClean
      })
      setIsConnected(false)
    }
    
    wsRef.current.onerror = (error) => {
      console.error('WebSocket error:', error)
      toast.error('Connection error')
      setIsConnected(false)
    }
  }, [])

  // Handle WebSocket messages
  const handleWebSocketMessage = useCallback(async (data) => {
    switch (data.type) {
      case 'room_joined':
        setParticipants(data.participants || [])
        break
        
      case 'participant_joined':
        setParticipants(prev => [...prev, data.participant])
        toast.success(`${data.participant.name || 'Someone'} joined the room`)
        break
        
      case 'participant_left':
        setParticipants(prev => prev.filter(p => p.id !== data.participant_id))
        // Clean up peer connection
        if (peerConnectionsRef.current.has(data.participant_id)) {
          peerConnectionsRef.current.get(data.participant_id).close()
          peerConnectionsRef.current.delete(data.participant_id)
        }
        // Remove remote stream
        setRemoteStreams(prev => prev.filter(s => s.participantId !== data.participant_id))
        break
        
      case 'offer':
        await handleOffer(data.offer, data.from)
        break
        
      case 'answer':
        await handleAnswer(data.answer, data.from)
        break
        
      case 'ice_candidate':
        await handleIceCandidate(data.candidate, data.from)
        break
        
      case 'participant_updated':
        setParticipants(prev => 
          prev.map(p => p.id === data.participant.id ? { ...p, ...data.participant } : p)
        )
        break
        
      default:
        console.log('Unknown message type:', data.type)
    }
  }, [])

  // Create peer connection
  const createPeerConnection = useCallback((participantId) => {
    const peerConnection = new RTCPeerConnection({
      iceServers: STUN_SERVERS
    })

    // Add local stream tracks
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach(track => {
        peerConnection.addTrack(track, localStreamRef.current)
      })
    }

    // Handle remote stream
    peerConnection.ontrack = (event) => {
      console.log('Received remote stream from:', participantId)
      setRemoteStreams(prev => {
        const existing = prev.find(s => s.participantId === participantId)
        if (existing) {
          return prev.map(s => 
            s.participantId === participantId 
              ? { ...s, stream: event.streams[0] }
              : s
          )
        }
        return [...prev, { participantId, stream: event.streams[0] }]
      })
    }

    // Handle ICE candidates
    peerConnection.onicecandidate = (event) => {
      if (event.candidate && wsRef.current?.readyState === WebSocket.OPEN) {
        wsRef.current.send(JSON.stringify({
          type: 'ice_candidate',
          candidate: event.candidate,
          to: participantId
        }))
      }
    }

    // Handle connection state changes
    peerConnection.onconnectionstatechange = () => {
      console.log(`Peer connection state with ${participantId}:`, peerConnection.connectionState)
      
      if (peerConnection.connectionState === 'failed') {
        // Attempt to restart ICE
        peerConnection.restartIce()
      }
    }

    peerConnectionsRef.current.set(participantId, peerConnection)
    return peerConnection
  }, [])

  // Handle WebRTC offer
  const handleOffer = useCallback(async (offer, fromParticipant) => {
    try {
      const peerConnection = createPeerConnection(fromParticipant)
      await peerConnection.setRemoteDescription(offer)
      
      const answer = await peerConnection.createAnswer()
      await peerConnection.setLocalDescription(answer)
      
      if (wsRef.current?.readyState === WebSocket.OPEN) {
        wsRef.current.send(JSON.stringify({
          type: 'answer',
          answer: answer,
          to: fromParticipant
        }))
      }
    } catch (error) {
      console.error('Error handling offer:', error)
    }
  }, [createPeerConnection])

  // Handle WebRTC answer
  const handleAnswer = useCallback(async (answer, fromParticipant) => {
    try {
      const peerConnection = peerConnectionsRef.current.get(fromParticipant)
      if (peerConnection) {
        await peerConnection.setRemoteDescription(answer)
      }
    } catch (error) {
      console.error('Error handling answer:', error)
    }
  }, [])

  // Handle ICE candidate
  const handleIceCandidate = useCallback(async (candidate, fromParticipant) => {
    try {
      const peerConnection = peerConnectionsRef.current.get(fromParticipant)
      if (peerConnection) {
        await peerConnection.addIceCandidate(candidate)
      }
    } catch (error) {
      console.error('Error handling ICE candidate:', error)
    }
  }, [])

  // Get user media
  const getUserMedia = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 1280, height: 720 },
        audio: { echoCancellation: true, noiseSuppression: true }
      })
      
      setLocalStream(stream)
      localStreamRef.current = stream
      return stream
    } catch (error) {
      console.error('Error accessing media devices:', error)
      toast.error('Could not access camera/microphone')
      throw error
    }
  }, [])

  // Create room
  const createRoom = useCallback(async () => {
    setIsLoading(true)
    try {
      console.log('Creating room...') // Debug log
      const response = await fetch(config.getApiUrl(config.API.ROOMS), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      })
      
      if (!response.ok) {
        throw new Error('Failed to create room')
      }
      
      const room = await response.json()
      console.log('Room creation response:', JSON.stringify(room, null, 2)) // Debug log
      
      if (!room.room_id || !room.room_key) {
        console.error('Invalid room response:', room)
        throw new Error('Invalid room response')
      }
      
      // Get user media first
      await getUserMedia()
      
      // Set current room before connecting to WebSocket
      setCurrentRoom(room)
      
      // Connect to WebSocket with room credentials
      console.log('Connecting to WebSocket with:', { roomId: room.room_id, roomKey: room.room_key }) // Debug log
      connectWebSocket(room.room_id, room.room_key)
      
      return room
    } catch (error) {
      console.error('Error creating room:', error)
      toast.error('Failed to create room')
      throw error
    } finally {
      setIsLoading(false)
    }
  }, [getUserMedia, connectWebSocket])

  // Join room
  const joinRoom = useCallback(async (roomId, roomKey) => {
    setIsLoading(true)
    try {
      // Get user media first
      await getUserMedia()
      
      // Connect to WebSocket
      connectWebSocket(roomId, roomKey)
      
      setCurrentRoom({ id: roomId, key: roomKey })
    } catch (error) {
      console.error('Error joining room:', error)
      toast.error('Failed to join room')
      throw error
    } finally {
      setIsLoading(false)
    }
  }, [getUserMedia, connectWebSocket])

  // Leave room
  const leaveRoom = useCallback(() => {
    // Close WebSocket
    if (wsRef.current) {
      wsRef.current.close()
      wsRef.current = null
    }
    
    // Close all peer connections
    peerConnectionsRef.current.forEach(pc => pc.close())
    peerConnectionsRef.current.clear()
    
    // Stop local stream
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach(track => track.stop())
      localStreamRef.current = null
    }
    
    // Reset state
    setCurrentRoom(null)
    setIsConnected(false)
    setParticipants([])
    setLocalStream(null)
    setRemoteStreams([])
    setIsMuted(false)
    setIsVideoOff(false)
  }, [])

  // Toggle mute
  const toggleMute = useCallback(() => {
    if (localStreamRef.current) {
      const audioTrack = localStreamRef.current.getAudioTracks()[0]
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled
        setIsMuted(!audioTrack.enabled)
        
        // Notify other participants
        if (wsRef.current?.readyState === WebSocket.OPEN) {
          wsRef.current.send(JSON.stringify({
            type: 'participant_update',
            data: { isMuted: !audioTrack.enabled }
          }))
        }
      }
    }
  }, [])

  // Toggle video
  const toggleVideo = useCallback(() => {
    if (localStreamRef.current) {
      const videoTrack = localStreamRef.current.getVideoTracks()[0]
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled
        setIsVideoOff(!videoTrack.enabled)
        
        // Notify other participants
        if (wsRef.current?.readyState === WebSocket.OPEN) {
          wsRef.current.send(JSON.stringify({
            type: 'participant_update',
            data: { isVideoOff: !videoTrack.enabled }
          }))
        }
      }
    }
  }, [])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      leaveRoom()
    }
  }, [leaveRoom])

  return {
    currentRoom,
    isConnected,
    participants,
    localStream,
    remoteStreams,
    isMuted,
    isVideoOff,
    isLoading,
    createRoom,
    joinRoom,
    leaveRoom,
    toggleMute,
    toggleVideo,
  }
} 