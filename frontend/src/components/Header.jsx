import React from 'react'
import { motion } from 'framer-motion'
import { Video, Sun, Moon } from 'lucide-react'

const Header = ({ theme, onToggleTheme }) => {
  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="sticky top-0 z-50 glass border-b border-white/10 dark:border-gray-800/10"
    >
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="flex items-center gap-3"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-primary-500 rounded-xl blur-lg opacity-30 animate-pulse-glow" />
              <div className="relative bg-primary-500 p-3 rounded-xl">
                <Video className="w-6 h-6 text-white" />
              </div>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gradient">VideoCall</h1>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Secure video meetings
              </p>
            </div>
          </motion.div>

          {/* Theme Toggle */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onToggleTheme}
            className="p-3 rounded-xl glass hover:bg-white/20 dark:hover:bg-gray-800/20 transition-all duration-200"
            aria-label="Toggle theme"
          >
            <motion.div
              initial={false}
              animate={{ rotate: theme === 'dark' ? 180 : 0 }}
              transition={{ duration: 0.3 }}
            >
              {theme === 'dark' ? (
                <Sun className="w-5 h-5 text-yellow-500" />
              ) : (
                <Moon className="w-5 h-5 text-gray-600" />
              )}
            </motion.div>
          </motion.button>
        </div>
      </div>
    </motion.header>
  )
}

export default Header 