import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { X, Copy, Check, Eye, EyeOff, Share, QrCode, Clock, Shield } from 'lucide-react'
import toast from 'react-hot-toast'

const RoomInfo = ({ room, onClose, onCopyCredentials }) => {
  const [showKey, setShowKey] = useState(false)
  const [copiedField, setCopiedField] = useState(null)

  const copyToClipboard = async (text, field) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedField(field)
      toast.success(`${field} copied!`)
      setTimeout(() => setCopiedField(null), 2000)
    } catch (error) {
      toast.error('Failed to copy')
    }
  }

  const shareRoom = async () => {
    const shareData = {
      title: 'Join my video call',
      text: `Join my secure video call!\n\nRoom ID: ${room.id}\nRoom Key: ${room.key}`,
      url: window.location.href
    }

    if (navigator.share) {
      try {
        await navigator.share(shareData)
      } catch (error) {
        // Fallback to clipboard
        copyToClipboard(shareData.text, 'Room credentials')
      }
    } else {
      copyToClipboard(shareData.text, 'Room credentials')
    }
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-700/50">
        <h3 className="text-white font-semibold">Room Information</h3>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={onClose}
          className="p-1 rounded-lg hover:bg-gray-700/50 text-gray-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </motion.button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* Room Status */}
        <div className="bg-gray-700/30 rounded-xl p-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
            <span className="text-white font-medium">Room Active</span>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between text-gray-400">
              <span>Created:</span>
              <span>{new Date(room.createdAt || Date.now()).toLocaleTimeString()}</span>
            </div>
            <div className="flex justify-between text-gray-400">
              <span>Duration:</span>
              <span>
                <Clock className="w-4 h-4 inline mr-1" />
                {Math.floor((Date.now() - (room.createdAt || Date.now())) / 60000)} min
              </span>
            </div>
          </div>
        </div>

        {/* Room Credentials */}
        <div className="space-y-4">
          <h4 className="text-white font-medium flex items-center gap-2">
            <Shield className="w-4 h-4" />
            Room Credentials
          </h4>

          {/* Room ID */}
          <div className="bg-gray-700/30 rounded-xl p-4">
            <label className="block text-gray-400 text-sm mb-2">Room ID</label>
            <div className="flex items-center gap-2">
              <code className="flex-1 bg-gray-800/50 px-3 py-2 rounded-lg text-white font-mono text-sm">
                {room.id}
              </code>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => copyToClipboard(room.id, 'Room ID')}
                className="p-2 rounded-lg bg-gray-600/50 hover:bg-gray-600 text-white transition-colors"
              >
                {copiedField === 'Room ID' ? (
                  <Check className="w-4 h-4 text-green-400" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </motion.button>
            </div>
          </div>

          {/* Room Key */}
          <div className="bg-gray-700/30 rounded-xl p-4">
            <label className="block text-gray-400 text-sm mb-2">Room Key</label>
            <div className="flex items-center gap-2">
              <code className="flex-1 bg-gray-800/50 px-3 py-2 rounded-lg text-white font-mono text-sm">
                {showKey ? room.key : '•'.repeat(room.key?.length || 8)}
              </code>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowKey(!showKey)}
                className="p-2 rounded-lg bg-gray-600/50 hover:bg-gray-600 text-white transition-colors"
              >
                {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => copyToClipboard(room.key, 'Room Key')}
                className="p-2 rounded-lg bg-gray-600/50 hover:bg-gray-600 text-white transition-colors"
              >
                {copiedField === 'Room Key' ? (
                  <Check className="w-4 h-4 text-green-400" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </motion.button>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="space-y-3">
          <h4 className="text-white font-medium">Quick Actions</h4>
          
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onCopyCredentials}
            className="w-full flex items-center gap-3 p-3 bg-primary-500/20 hover:bg-primary-500/30 rounded-xl text-primary-400 hover:text-primary-300 transition-colors"
          >
            <Copy className="w-5 h-5" />
            <span>Copy All Credentials</span>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={shareRoom}
            className="w-full flex items-center gap-3 p-3 bg-green-500/20 hover:bg-green-500/30 rounded-xl text-green-400 hover:text-green-300 transition-colors"
          >
            <Share className="w-5 h-5" />
            <span>Share Room</span>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full flex items-center gap-3 p-3 bg-gray-700/30 hover:bg-gray-700/50 rounded-xl text-gray-400 hover:text-gray-300 transition-colors"
            disabled
          >
            <QrCode className="w-5 h-5" />
            <span>Generate QR Code</span>
            <span className="ml-auto text-xs bg-gray-600 px-2 py-1 rounded">Soon</span>
          </motion.button>
        </div>

        {/* Security Info */}
        <div className="bg-gray-700/20 rounded-xl p-4 border border-gray-600/30">
          <div className="flex items-center gap-2 mb-2">
            <Shield className="w-4 h-4 text-green-400" />
            <span className="text-green-400 font-medium text-sm">Secure Connection</span>
          </div>
          <p className="text-gray-400 text-xs leading-relaxed">
            Your video call is protected with end-to-end encryption. 
            Only participants with the correct room credentials can join.
          </p>
        </div>
      </div>
    </div>
  )
}

export default RoomInfo 