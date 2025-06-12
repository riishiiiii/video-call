import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Plus, LogIn, Copy, Check, Users, Shield, Zap, Sparkles } from 'lucide-react'
import toast from 'react-hot-toast'

const RoomControls = ({ onCreateRoom, onJoinRoom, isLoading }) => {
  const [roomId, setRoomId] = useState('')
  const [roomKey, setRoomKey] = useState('')
  const [copied, setCopied] = useState(false)

  const handleCreateRoom = async () => {
    try {
      const room = await onCreateRoom()
      if (room) {
        toast.success('Room created! 🎉')
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
      toast.success('Joining room... 🚀')
    } catch (error) {
      toast.error('Failed to join room')
    }
  }

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    toast.success('Copied! ✨')
    setTimeout(() => setCopied(false), 2000)
  }

  const features = [
    {
      icon: Shield,
      title: 'Secure',
      description: 'End-to-end encrypted calls',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: Users,
      title: 'Social',
      description: 'Connect with friends instantly',
      color: 'from-purple-500 to-pink-500'
    },
    {
      icon: Zap,
      title: 'Fast',
      description: 'Real-time HD video calls',
      color: 'from-yellow-500 to-orange-500'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <motion.div
            className="inline-flex items-center gap-2 mb-6"
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            <Sparkles className="w-8 h-8 text-blue-400" />
            <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              VideoCall
            </h1>
            <Sparkles className="w-8 h-8 text-pink-400" />
          </motion.div>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Connect with anyone, anywhere. 
            <span className="text-blue-400 font-medium"> Drag, resize & arrange</span> your video calls like never before.
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
              whileHover={{ scale: 1.05, y: -5 }}
              className="bg-gray-800/50 backdrop-blur-xl rounded-2xl p-6 border border-gray-700/30 hover:border-gray-600/50 transition-all duration-300"
            >
              <div className={`w-12 h-12 rounded-2xl bg-gradient-to-r ${feature.color} p-3 mb-4`}>
                <feature.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-white font-semibold text-lg mb-2">{feature.title}</h3>
              <p className="text-gray-400 text-sm">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Action Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="grid md:grid-cols-2 gap-8"
        >
          {/* Create Room */}
          <motion.div
            whileHover={{ scale: 1.02, y: -5 }}
            className="bg-gray-800/50 backdrop-blur-xl rounded-3xl p-8 border border-gray-700/30 hover:border-blue-500/30 transition-all duration-300"
          >
            <div className="text-center mb-6">
              <motion.div 
                className="relative mb-4"
                whileHover={{ rotate: 5 }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl blur-xl opacity-30" />
                <div className="relative bg-gradient-to-r from-blue-500 to-cyan-500 p-4 rounded-2xl w-fit mx-auto">
                  <Plus className="w-8 h-8 text-white" />
                </div>
              </motion.div>
              <h3 className="text-2xl font-bold text-white mb-2">
                Create Room
              </h3>
              <p className="text-gray-400">
                Start a new video call instantly
              </p>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleCreateRoom}
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-semibold py-4 px-6 rounded-2xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Creating...
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2">
                  <Plus className="w-5 h-5" />
                  Create New Room
                </div>
              )}
            </motion.button>
          </motion.div>

          {/* Join Room */}
          <motion.div
            whileHover={{ scale: 1.02, y: -5 }}
            className="bg-gray-800/50 backdrop-blur-xl rounded-3xl p-8 border border-gray-700/30 hover:border-purple-500/30 transition-all duration-300"
          >
            <div className="text-center mb-6">
              <motion.div 
                className="relative mb-4"
                whileHover={{ rotate: -5 }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl blur-xl opacity-30" />
                <div className="relative bg-gradient-to-r from-purple-500 to-pink-500 p-4 rounded-2xl w-fit mx-auto">
                  <LogIn className="w-8 h-8 text-white" />
                </div>
              </motion.div>
              <h3 className="text-2xl font-bold text-white mb-2">
                Join Room
              </h3>
              <p className="text-gray-400">
                Enter room credentials to join
              </p>
            </div>

            <form onSubmit={handleJoinRoom} className="space-y-4">
              <div>
                <input
                  type="text"
                  value={roomId}
                  onChange={(e) => setRoomId(e.target.value)}
                  placeholder="Room ID"
                  className="w-full bg-gray-700/50 border border-gray-600/50 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all duration-200"
                  disabled={isLoading}
                />
              </div>

              <div>
                <input
                  type="password"
                  value={roomKey}
                  onChange={(e) => setRoomKey(e.target.value)}
                  placeholder="Room Key"
                  className="w-full bg-gray-700/50 border border-gray-600/50 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all duration-200"
                  disabled={isLoading}
                />
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={isLoading || !roomId.trim() || !roomKey.trim()}
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold py-4 px-6 rounded-2xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Joining...
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-2">
                    <LogIn className="w-5 h-5" />
                    Join Room
                  </div>
                )}
              </motion.button>
            </form>
          </motion.div>
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="text-center mt-12"
        >
          <p className="text-gray-500 text-sm">
            🔒 Your video calls are encrypted and secure • Made for Gen Z
          </p>
        </motion.div>
      </div>
    </div>
  )
}

export default RoomControls