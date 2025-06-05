import React, { useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { User, Mic, MicOff, Video, VideoOff } from 'lucide-react'

const VideoTile = ({ stream, participant, isLocal = false, isVideoOff = false }) => {
  const videoRef = useRef(null)

  useEffect(() => {
    if (videoRef.current && stream && !isVideoOff) {
      videoRef.current.srcObject = stream
    }
  }, [stream, isVideoOff])

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="relative bg-gray-800 rounded-2xl overflow-hidden shadow-2xl group"
    >
      {/* Video Element */}
      {stream && !isVideoOff ? (
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted={isLocal}
          className="w-full h-full object-cover"
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-700 to-gray-800">
          <div className="text-center">
            <div className="w-20 h-20 bg-gray-600 rounded-full flex items-center justify-center mb-4 mx-auto">
              <User className="w-10 h-10 text-gray-300" />
            </div>
            <p className="text-white font-medium">
              {participant?.name || (isLocal ? 'You' : 'Participant')}
            </p>
            {isVideoOff && (
              <p className="text-gray-400 text-sm mt-1">Camera off</p>
            )}
          </div>
        </div>
      )}

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200" />

      {/* Participant Info */}
      <div className="absolute bottom-4 left-4 right-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-white font-medium text-sm bg-black/50 px-2 py-1 rounded-lg backdrop-blur-sm">
              {participant?.name || (isLocal ? 'You' : 'Participant')}
              {isLocal && ' (You)'}
            </span>
          </div>
          
          <div className="flex items-center gap-2">
            {participant?.isMuted !== undefined && (
              <div className={`p-1.5 rounded-full ${participant.isMuted ? 'bg-red-500' : 'bg-green-500'}`}>
                {participant.isMuted ? (
                  <MicOff className="w-3 h-3 text-white" />
                ) : (
                  <Mic className="w-3 h-3 text-white" />
                )}
              </div>
            )}
            
            {(isVideoOff || participant?.isVideoOff) && (
              <div className="p-1.5 rounded-full bg-red-500">
                <VideoOff className="w-3 h-3 text-white" />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Connection Status */}
      {participant?.connectionStatus && (
        <div className="absolute top-4 right-4">
          <div className={`w-3 h-3 rounded-full ${
            participant.connectionStatus === 'connected' ? 'bg-green-500' :
            participant.connectionStatus === 'connecting' ? 'bg-yellow-500' :
            'bg-red-500'
          } animate-pulse`} />
        </div>
      )}
    </motion.div>
  )
}

const VideoGrid = ({ localStream, remoteStreams, participants, isVideoOff }) => {
  const totalParticipants = 1 + (remoteStreams?.length || 0)
  
  // Calculate grid layout
  const getGridCols = (count) => {
    if (count === 1) return 'grid-cols-1'
    if (count === 2) return 'grid-cols-1 lg:grid-cols-2'
    if (count <= 4) return 'grid-cols-2'
    if (count <= 6) return 'grid-cols-2 lg:grid-cols-3'
    return 'grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
  }

  const getAspectRatio = (count) => {
    if (count === 1) return 'aspect-video'
    if (count === 2) return 'aspect-video'
    return 'aspect-square lg:aspect-video'
  }

  return (
    <div className="h-full flex items-center justify-center p-4">
      <div className={`grid gap-4 w-full h-full ${getGridCols(totalParticipants)}`}>
        {/* Local Video */}
        <div className={`${getAspectRatio(totalParticipants)} min-h-0`}>
          <VideoTile
            stream={localStream}
            participant={{ name: 'You', isMuted: false }}
            isLocal={true}
            isVideoOff={isVideoOff}
          />
        </div>

        {/* Remote Videos */}
        {remoteStreams?.map((streamData, index) => (
          <div key={streamData.participantId || index} className={`${getAspectRatio(totalParticipants)} min-h-0`}>
            <VideoTile
              stream={streamData.stream}
              participant={participants.find(p => p.id === streamData.participantId) || {
                name: `Participant ${index + 1}`,
                isMuted: false,
                isVideoOff: false,
                connectionStatus: 'connected'
              }}
            />
          </div>
        ))}
      </div>

      {/* Empty State */}
      {totalParticipants === 1 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        >
          <div className="bg-gray-800/80 backdrop-blur-xl rounded-2xl px-6 py-4 text-center">
            <p className="text-white font-medium mb-1">Waiting for others to join</p>
            <p className="text-gray-400 text-sm">Share the room credentials to invite participants</p>
          </div>
        </motion.div>
      )}
    </div>
  )
}

export default VideoGrid 