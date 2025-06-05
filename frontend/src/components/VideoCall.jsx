import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  Phone,
  Copy,
  Users,
  Settings,
  Monitor,
  MessageSquare,
  MoreVertical
} from 'lucide-react'
import toast from 'react-hot-toast'
import VideoGrid from './VideoGrid'
import ParticipantsList from './ParticipantsList'
import RoomInfo from './RoomInfo'

const VideoCall = ({
  room,
  isConnected,
  participants,
  localStream,
  remoteStreams,
  isMuted,
  isVideoOff,
  onLeaveRoom,
  onToggleMute,
  onToggleVideo,
}) => {
  const [showParticipants, setShowParticipants] = useState(false)
  const [showRoomInfo, setShowRoomInfo] = useState(false)
  const [showSettings, setShowSettings] = useState(false)

  const copyRoomCredentials = () => {
    const credentials = `Room ID: ${room.id}\nRoom Key: ${room.key}`
    navigator.clipboard.writeText(credentials)
    toast.success('Room credentials copied!')
  }

  const handleLeaveRoom = () => {
    if (window.confirm('Are you sure you want to leave the room?')) {
      onLeaveRoom()
      toast.success('Left the room')
    }
  }

  return (
    <div className="h-screen flex flex-col bg-gray-900">
      {/* Header */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="flex items-center justify-between p-4 bg-gray-800/50 backdrop-blur-xl border-b border-gray-700/50"
      >
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'} animate-pulse`} />
            <span className="text-white font-medium">
              {isConnected ? 'Connected' : 'Connecting...'}
            </span>
          </div>
          <div className="text-gray-400 text-sm">
            Room: {room.id}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowParticipants(!showParticipants)}
            className="p-2 rounded-lg bg-gray-700/50 hover:bg-gray-600/50 text-white transition-colors"
          >
            <Users className="w-5 h-5" />
            <span className="ml-2 text-sm">{participants.length}</span>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowRoomInfo(!showRoomInfo)}
            className="p-2 rounded-lg bg-gray-700/50 hover:bg-gray-600/50 text-white transition-colors"
          >
            <Copy className="w-5 h-5" />
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowSettings(!showSettings)}
            className="p-2 rounded-lg bg-gray-700/50 hover:bg-gray-600/50 text-white transition-colors"
          >
            <MoreVertical className="w-5 h-5" />
          </motion.button>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="flex-1 flex relative">
        {/* Video Grid */}
        <div className="flex-1 p-4">
          <VideoGrid
            localStream={localStream}
            remoteStreams={remoteStreams}
            participants={participants}
            isVideoOff={isVideoOff}
          />
        </div>

        {/* Side Panels */}
        <AnimatePresence>
          {showParticipants && (
            <motion.div
              initial={{ x: 300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 300, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="w-80 bg-gray-800/90 backdrop-blur-xl border-l border-gray-700/50"
            >
              <ParticipantsList
                participants={participants}
                onClose={() => setShowParticipants(false)}
              />
            </motion.div>
          )}

          {showRoomInfo && (
            <motion.div
              initial={{ x: 300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 300, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="w-80 bg-gray-800/90 backdrop-blur-xl border-l border-gray-700/50"
            >
              <RoomInfo
                room={room}
                onClose={() => setShowRoomInfo(false)}
                onCopyCredentials={copyRoomCredentials}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Controls Bar */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="p-6 bg-gray-800/50 backdrop-blur-xl border-t border-gray-700/50"
      >
        <div className="flex items-center justify-center gap-4">
          {/* Mute Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onToggleMute}
            className={`p-4 rounded-full transition-all duration-200 ${
              isMuted
                ? 'bg-red-500 hover:bg-red-600 shadow-lg shadow-red-500/25'
                : 'bg-gray-700 hover:bg-gray-600'
            }`}
          >
            {isMuted ? (
              <MicOff className="w-6 h-6 text-white" />
            ) : (
              <Mic className="w-6 h-6 text-white" />
            )}
          </motion.button>

          {/* Video Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onToggleVideo}
            className={`p-4 rounded-full transition-all duration-200 ${
              isVideoOff
                ? 'bg-red-500 hover:bg-red-600 shadow-lg shadow-red-500/25'
                : 'bg-gray-700 hover:bg-gray-600'
            }`}
          >
            {isVideoOff ? (
              <VideoOff className="w-6 h-6 text-white" />
            ) : (
              <Video className="w-6 h-6 text-white" />
            )}
          </motion.button>

          {/* Screen Share Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="p-4 rounded-full bg-gray-700 hover:bg-gray-600 transition-all duration-200"
          >
            <Monitor className="w-6 h-6 text-white" />
          </motion.button>

          {/* Chat Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="p-4 rounded-full bg-gray-700 hover:bg-gray-600 transition-all duration-200"
          >
            <MessageSquare className="w-6 h-6 text-white" />
          </motion.button>

          {/* Leave Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleLeaveRoom}
            className="p-4 rounded-full bg-red-500 hover:bg-red-600 transition-all duration-200 shadow-lg shadow-red-500/25 ml-4"
          >
            <Phone className="w-6 h-6 text-white rotate-[135deg]" />
          </motion.button>
        </div>

        {/* Status Text */}
        <div className="text-center mt-4">
          <p className="text-gray-400 text-sm">
            {participants.length} participant{participants.length !== 1 ? 's' : ''} in the room
          </p>
        </div>
      </motion.div>
    </div>
  )
}

export default VideoCall 