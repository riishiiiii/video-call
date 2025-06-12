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
  MoreVertical,
  FlipHorizontal,
  ChevronDown,
  ChevronUp
} from 'lucide-react'
import toast from 'react-hot-toast'
import FloatingVideoGrid from './FloatingVideoGrid'
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
  isMirrorMode,
  onLeaveRoom,
  onToggleMute,
  onToggleVideo,
  onToggleMirrorMode,
}) => {
  const [showParticipants, setShowParticipants] = useState(false)
  const [showRoomInfo, setShowRoomInfo] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [isControlsMinimized, setIsControlsMinimized] = useState(false)

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
    <div className="h-screen flex flex-col bg-gray-900 overflow-hidden">
      {/* Minimalistic Header */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="flex items-center justify-between px-6 py-3 bg-gray-900/95 backdrop-blur-xl border-b border-gray-800/50"
      >
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <motion.div 
              className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-400' : 'bg-red-400'}`}
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <span className="text-white font-medium text-sm">
              {isConnected ? 'Connected' : 'Connecting...'}
            </span>
          </div>
          <div className="text-gray-400 text-xs bg-gray-800/50 px-2 py-1 rounded-lg">
            {room.id}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowParticipants(!showParticipants)}
            className="p-2 rounded-xl bg-gray-800/50 hover:bg-gray-700/50 text-white transition-all duration-200 flex items-center gap-2"
          >
            <Users className="w-4 h-4" />
            <span className="text-sm font-medium">{participants.length + 1}</span>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowRoomInfo(!showRoomInfo)}
            className="p-2 rounded-xl bg-gray-800/50 hover:bg-gray-700/50 text-white transition-all duration-200"
          >
            <Copy className="w-4 h-4" />
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowSettings(!showSettings)}
            className="p-2 rounded-xl bg-gray-800/50 hover:bg-gray-700/50 text-white transition-all duration-200"
          >
            <MoreVertical className="w-4 h-4" />
          </motion.button>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="flex-1 flex relative min-h-0">
        {/* Floating Video Grid */}
        <div className="flex-1">
          <FloatingVideoGrid
            localStream={localStream}
            remoteStreams={remoteStreams}
            participants={participants}
            isVideoOff={isVideoOff}
            isMirrorMode={isMirrorMode}
          />
        </div>

        {/* Side Panels */}
        <AnimatePresence>
          {showParticipants && (
            <motion.div
              initial={{ x: 320, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 320, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="w-80 bg-gray-900/95 backdrop-blur-xl border-l border-gray-800/50"
            >
              <ParticipantsList
                participants={participants}
                onClose={() => setShowParticipants(false)}
              />
            </motion.div>
          )}

          {showRoomInfo && (
            <motion.div
              initial={{ x: 320, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 320, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="w-80 bg-gray-900/95 backdrop-blur-xl border-l border-gray-800/50"
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

      {/* Minimalistic Controls Bar */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="relative"
      >
        {/* Minimize/Expand Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsControlsMinimized(!isControlsMinimized)}
          className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 p-2 rounded-full bg-gray-800/90 backdrop-blur-xl border border-gray-700/50 text-white hover:bg-gray-700/90 transition-all duration-200 z-10"
        >
          {isControlsMinimized ? (
            <ChevronUp className="w-4 h-4" />
          ) : (
            <ChevronDown className="w-4 h-4" />
          )}
        </motion.button>

        <AnimatePresence>
          {!isControlsMinimized && (
            <motion.div
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 100, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="p-4 bg-gray-900/95 backdrop-blur-xl border-t border-gray-800/50"
            >
              <div className="flex items-center justify-center gap-3">
                {/* Mute Button */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={onToggleMute}
                  className={`p-3 rounded-2xl transition-all duration-200 ${
                    isMuted
                      ? 'bg-red-500/90 hover:bg-red-500 shadow-lg shadow-red-500/25'
                      : 'bg-gray-800/80 hover:bg-gray-700/80'
                  }`}
                >
                  {isMuted ? (
                    <MicOff className="w-5 h-5 text-white" />
                  ) : (
                    <Mic className="w-5 h-5 text-white" />
                  )}
                </motion.button>

                {/* Video Button */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={onToggleVideo}
                  className={`p-3 rounded-2xl transition-all duration-200 ${
                    isVideoOff
                      ? 'bg-red-500/90 hover:bg-red-500 shadow-lg shadow-red-500/25'
                      : 'bg-gray-800/80 hover:bg-gray-700/80'
                  }`}
                >
                  {isVideoOff ? (
                    <VideoOff className="w-5 h-5 text-white" />
                  ) : (
                    <Video className="w-5 h-5 text-white" />
                  )}
                </motion.button>

                {/* Screen Share Button */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-3 rounded-2xl bg-gray-800/80 hover:bg-gray-700/80 transition-all duration-200"
                >
                  <Monitor className="w-5 h-5 text-white" />
                </motion.button>

                {/* Mirror Mode Button */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={onToggleMirrorMode}
                  className={`p-3 rounded-2xl transition-all duration-200 ${
                    isMirrorMode
                      ? 'bg-blue-500/90 hover:bg-blue-500 shadow-lg shadow-blue-500/25'
                      : 'bg-gray-800/80 hover:bg-gray-700/80'
                  }`}
                >
                  <FlipHorizontal className="w-5 h-5 text-white" />
                </motion.button>

                {/* Chat Button */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-3 rounded-2xl bg-gray-800/80 hover:bg-gray-700/80 transition-all duration-200"
                >
                  <MessageSquare className="w-5 h-5 text-white" />
                </motion.button>

                {/* Leave Button */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleLeaveRoom}
                  className="p-3 rounded-2xl bg-red-500/90 hover:bg-red-500 transition-all duration-200 shadow-lg shadow-red-500/25 ml-2"
                >
                  <Phone className="w-5 h-5 text-white rotate-[135deg]" />
                </motion.button>
              </div>

              {/* Status Text */}
              <motion.div 
                className="text-center mt-3"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <p className="text-gray-400 text-xs">
                  {participants.length + 1} participant{participants.length !== 0 ? 's' : ''} • Room {room.id}
                </p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Minimized Controls */}
        <AnimatePresence>
          {isControlsMinimized && (
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 50, opacity: 0 }}
              className="p-2 bg-gray-900/95 backdrop-blur-xl border-t border-gray-800/50"
            >
              <div className="flex items-center justify-center gap-2">
                {/* Essential controls only */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={onToggleMute}
                  className={`p-2 rounded-xl transition-all duration-200 ${
                    isMuted ? 'bg-red-500/90' : 'bg-gray-800/80'
                  }`}
                >
                  {isMuted ? (
                    <MicOff className="w-4 h-4 text-white" />
                  ) : (
                    <Mic className="w-4 h-4 text-white" />
                  )}
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={onToggleVideo}
                  className={`p-2 rounded-xl transition-all duration-200 ${
                    isVideoOff ? 'bg-red-500/90' : 'bg-gray-800/80'
                  }`}
                >
                  {isVideoOff ? (
                    <VideoOff className="w-4 h-4 text-white" />
                  ) : (
                    <Video className="w-4 h-4 text-white" />
                  )}
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleLeaveRoom}
                  className="p-2 rounded-xl bg-red-500/90 hover:bg-red-500 transition-all duration-200"
                >
                  <Phone className="w-4 h-4 text-white rotate-[135deg]" />
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  )
}

export default VideoCall 