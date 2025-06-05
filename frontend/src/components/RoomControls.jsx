import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Plus, LogIn, Copy, Check, Users, Shield, Zap } from 'lucide-react'
import toast from 'react-hot-toast'

const RoomControls = ({ onCreateRoom, onJoinRoom, isLoading }) => {
  const [roomId, setRoomId] = useState('')
  const [roomKey, setRoomKey] = useState('')
  const [copied, setCopied] = useState(false)

  const handleCreateRoom = async () => {
    try {
      const room = await onCreateRoom()
      if (room) {
        toast.success('Room created successfully!')
      }
    } catch (error) {
      toast.error('Failed to create room')
    }
  }

  const handleJoinRoom = async (e) => {
    e.preventDefault()
    if (!roomId.trim() || !roomKey.trim()) {
      toast.error('Please enter both Room ID and Room Key')
      return
    }

    try {
      await onJoinRoom(roomId.trim(), roomKey.trim())
      toast.success('Joining room...')
    } catch (error) {
      toast.error('Failed to join room')
    }
  }

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    toast.success('Copied to clipboard!')
    setTimeout(() => setCopied(false), 2000)
  }

  const features = [
    {
      icon: Shield,
      title: 'Secure Rooms',
      description: 'End-to-end encrypted video calls with unique room keys'
    },
    {
      icon: Users,
      title: 'Multi-participant',
      description: 'Connect with multiple people in the same room'
    },
    {
      icon: Zap,
      title: 'Real-time',
      description: 'Low-latency WebRTC technology for smooth communication'
    }
  ]

  return (
    <div className="max-w-6xl mx-auto">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-12"
      >
        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
          Connect with anyone,{' '}
          <span className="text-gradient">anywhere</span>
        </h2>
        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Start a secure video call in seconds. Create a room or join an existing one
          with your unique room credentials.
        </p>
      </motion.div>

      {/* Features */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="grid md:grid-cols-3 gap-6 mb-12"
      >
        {features.map((feature, index) => (
          <motion.div
            key={feature.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
            className="card text-center group hover:shadow-2xl transition-all duration-300"
          >
            <div className="relative mb-4">
              <div className="absolute inset-0 bg-primary-500/20 rounded-full blur-xl group-hover:blur-2xl transition-all duration-300" />
              <div className="relative bg-primary-100 dark:bg-primary-900/30 p-4 rounded-full w-fit mx-auto">
                <feature.icon className="w-8 h-8 text-primary-600 dark:text-primary-400" />
              </div>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              {feature.title}
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              {feature.description}
            </p>
          </motion.div>
        ))}
      </motion.div>

      {/* Room Controls */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto"
      >
        {/* Create Room */}
        <div className="card-strong">
          <div className="text-center mb-6">
            <div className="relative mb-4">
              <div className="absolute inset-0 bg-success-500/20 rounded-full blur-xl" />
              <div className="relative bg-success-100 dark:bg-success-900/30 p-4 rounded-full w-fit mx-auto">
                <Plus className="w-8 h-8 text-success-600 dark:text-success-400" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Create Room
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Start a new video call and invite others
            </p>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleCreateRoom}
            disabled={isLoading}
            className="btn-success w-full text-lg py-4"
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Creating...
              </div>
            ) : (
              <>
                <Plus className="w-5 h-5" />
                Create New Room
              </>
            )}
          </motion.button>
        </div>

        {/* Join Room */}
        <div className="card-strong">
          <div className="text-center mb-6">
            <div className="relative mb-4">
              <div className="absolute inset-0 bg-primary-500/20 rounded-full blur-xl" />
              <div className="relative bg-primary-100 dark:bg-primary-900/30 p-4 rounded-full w-fit mx-auto">
                <LogIn className="w-8 h-8 text-primary-600 dark:text-primary-400" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Join Room
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Enter room credentials to join an existing call
            </p>
          </div>

          <form onSubmit={handleJoinRoom} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Room ID
              </label>
              <input
                type="text"
                value={roomId}
                onChange={(e) => setRoomId(e.target.value)}
                placeholder="Enter room ID"
                className="input-field"
                disabled={isLoading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Room Key
              </label>
              <input
                type="password"
                value={roomKey}
                onChange={(e) => setRoomKey(e.target.value)}
                placeholder="Enter room key"
                className="input-field"
                disabled={isLoading}
              />
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isLoading || !roomId.trim() || !roomKey.trim()}
              className="btn-primary w-full text-lg py-4"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Joining...
                </div>
              ) : (
                <>
                  <LogIn className="w-5 h-5" />
                  Join Room
                </>
              )}
            </motion.button>
          </form>
        </div>
      </motion.div>

      {/* Help Text */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.6 }}
        className="text-center mt-8"
      >
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Your video calls are encrypted and secure. Room credentials are required to join.
        </p>
      </motion.div>
    </div>
  )
}

export default RoomControls