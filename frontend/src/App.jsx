import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Toaster } from 'react-hot-toast'
import Header from './components/Header'
import RoomControls from './components/RoomControls'
import VideoCall from './components/VideoCall'
import { useVideoCall } from './hooks/useVideoCall'
import { useTheme } from './hooks/useTheme'

function App() {
  const { theme, toggleTheme } = useTheme()
  const {
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
  } = useVideoCall()

  useEffect(() => {
    // Apply theme to document
    if (theme === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [theme])

  return (
    <div className="min-h-screen gradient-bg">
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: theme === 'dark' ? '#1e293b' : '#ffffff',
            color: theme === 'dark' ? '#f1f5f9' : '#1e293b',
            border: `1px solid ${theme === 'dark' ? '#334155' : '#e2e8f0'}`,
            borderRadius: '12px',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
          },
        }}
      />
      
      <Header theme={theme} onToggleTheme={toggleTheme} />
      
      <main className="container mx-auto px-4 py-8">
        <AnimatePresence mode="wait">
          {!currentRoom ? (
            <motion.div
              key="room-controls"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
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
            >
              <VideoCall
                room={currentRoom}
                isConnected={isConnected}
                participants={participants}
                localStream={localStream}
                remoteStreams={remoteStreams}
                isMuted={isMuted}
                isVideoOff={isVideoOff}
                onLeaveRoom={leaveRoom}
                onToggleMute={toggleMute}
                onToggleVideo={toggleVideo}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>
      
      {/* Background decorations */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-success-500/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
        <div className="absolute top-3/4 left-1/2 w-96 h-96 bg-warning-500/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '4s' }} />
      </div>
    </div>
  )
}

export default App 