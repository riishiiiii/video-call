import React from 'react'
import { motion } from 'framer-motion'
import { X, User, Mic, MicOff, Video, VideoOff, Crown, MoreVertical } from 'lucide-react'

const ParticipantsList = ({ participants, onClose }) => {
  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-700/50">
        <h3 className="text-white font-semibold">
          Participants ({participants.length})
        </h3>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={onClose}
          className="p-1 rounded-lg hover:bg-gray-700/50 text-gray-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </motion.button>
      </div>

      {/* Participants List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {participants.map((participant, index) => (
          <motion.div
            key={participant.id || index}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-center gap-3 p-3 rounded-xl bg-gray-700/30 hover:bg-gray-700/50 transition-colors group"
          >
            {/* Avatar */}
            <div className="relative">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-white" />
              </div>
              
              {/* Connection Status */}
              <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-gray-800 ${
                participant.connectionStatus === 'connected' ? 'bg-green-500' :
                participant.connectionStatus === 'connecting' ? 'bg-yellow-500' :
                'bg-red-500'
              }`} />
            </div>

            {/* Participant Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <p className="text-white font-medium truncate">
                  {participant.name || `Participant ${index + 1}`}
                </p>
                {participant.isHost && (
                  <Crown className="w-4 h-4 text-yellow-500" />
                )}
                {participant.isYou && (
                  <span className="text-xs bg-primary-500 text-white px-2 py-0.5 rounded-full">
                    You
                  </span>
                )}
              </div>
              
              <p className="text-gray-400 text-sm">
                {participant.connectionStatus === 'connected' ? 'Connected' :
                 participant.connectionStatus === 'connecting' ? 'Connecting...' :
                 'Disconnected'}
              </p>
            </div>

            {/* Status Icons */}
            <div className="flex items-center gap-2">
              {/* Microphone Status */}
              <div className={`p-1.5 rounded-full ${
                participant.isMuted ? 'bg-red-500/20 text-red-400' : 'bg-green-500/20 text-green-400'
              }`}>
                {participant.isMuted ? (
                  <MicOff className="w-3 h-3" />
                ) : (
                  <Mic className="w-3 h-3" />
                )}
              </div>

              {/* Video Status */}
              <div className={`p-1.5 rounded-full ${
                participant.isVideoOff ? 'bg-red-500/20 text-red-400' : 'bg-green-500/20 text-green-400'
              }`}>
                {participant.isVideoOff ? (
                  <VideoOff className="w-3 h-3" />
                ) : (
                  <Video className="w-3 h-3" />
                )}
              </div>

              {/* More Options */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="p-1.5 rounded-full hover:bg-gray-600/50 text-gray-400 hover:text-white transition-colors opacity-0 group-hover:opacity-100"
              >
                <MoreVertical className="w-3 h-3" />
              </motion.button>
            </div>
          </motion.div>
        ))}

        {/* Empty State */}
        {participants.length === 0 && (
          <div className="text-center py-8">
            <User className="w-12 h-12 text-gray-600 mx-auto mb-3" />
            <p className="text-gray-400">No participants yet</p>
            <p className="text-gray-500 text-sm mt-1">
              Share the room credentials to invite others
            </p>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-700/50">
        <div className="text-center">
          <p className="text-gray-400 text-sm">
            Room capacity: {participants.length}/10
          </p>
        </div>
      </div>
    </div>
  )
}

export default ParticipantsList