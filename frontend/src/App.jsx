import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Toaster } from 'react-hot-toast'
import RoomControls from './components/RoomControls'
import VideoCall from './components/VideoCall'
import { useVideoCall } from './hooks/useVideoCall'

function App() {
  const {
    currentRoom,
    isConnected,
    participants,
    localStream,
    remoteStreams,
    isMuted,
    isVideoOff,
    isMirrorMode,
    isLoading,
    createRoom,
    joinRoom,
    leaveRoom,
    toggleMute,
    toggleVideo,
    toggleMirrorMode,
  } = useVideoCall()

  return (
    <div className="min-h-screen bg-gray-900">
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#1f2937',
            color: '#f9fafb',
            border: '1px solid #374151',
            borderRadius: '12px',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
            fontSize: '14px',
            fontWeight: '500',
          },
          success: {
            iconTheme: {
              primary: '#10b981',
              secondary: '#f9fafb',
            },
          },
          error: {
            iconTheme: {
              primary: '#ef4444',
              secondary: '#f9fafb',
            },
          },
        }}
      />
      
      <AnimatePresence mode="wait">
        {!currentRoom ? (
          <motion.div
            key="room-controls"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
          >
            <RoomControls
              onCreateRoom={createRoom}
              onJoinRoom={joinRoom}
              isLoading={isLoading}
            />
          </motion.div>
        ) : (
          <motion.div
            key="video-call"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className="h-screen"
          >
            <VideoCall
              room={currentRoom}
              isConnected={isConnected}
              participants={participants}
              localStream={localStream}
              remoteStreams={remoteStreams}
              isMuted={isMuted}
              isVideoOff={isVideoOff}
              isMirrorMode={isMirrorMode}
              onLeaveRoom={leaveRoom}
              onToggleMute={toggleMute}
              onToggleVideo={toggleVideo}
              onToggleMirrorMode={toggleMirrorMode}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default App 