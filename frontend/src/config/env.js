// Environment configuration
const getDefaultUrls = () => {
  // In browser environment, detect if we're in Docker or local development
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname
    const protocol = window.location.protocol
    const isSecure = protocol === 'https:'
    
    // If running in Docker (backend service name) or production
    if (hostname === 'localhost' && window.location.port === '3000') {
      // Development mode - proxy will handle routing
      return {
        backend: '',  // Use relative URLs, proxy will handle
        ws: isSecure ? 'wss:' : 'ws:' + '//' + hostname + ':8000'  // Always use port 8000 for WebSocket
      }
    } else {
      // Production or Docker mode
      return {
        backend: protocol + '//' + hostname + (window.location.port && window.location.port !== '80' && window.location.port !== '443' ? ':' + window.location.port : ''),
        ws: (isSecure ? 'wss:' : 'ws:') + '//' + hostname + (window.location.port && window.location.port !== '80' && window.location.port !== '443' ? ':' + window.location.port : '')
      }
    }
  }
  
  // Fallback for SSR or build time
  return {
    backend: 'http://localhost:8000',
    ws: 'ws://localhost:8000'
  }
}

const defaults = getDefaultUrls()

const config = {
  // Backend API URL
  BACKEND_URL: import.meta.env.VITE_BACKEND_URL || defaults.backend,
  
  // WebSocket URL  
  WS_URL: import.meta.env.VITE_WS_URL || defaults.ws,
  
  // Environment
  NODE_ENV: import.meta.env.VITE_NODE_ENV || import.meta.env.MODE || 'development',
  
  // API endpoints
  API: {
    BASE: import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000',
    ROOMS: '/api/rooms/create',
    HEALTH: '/api/health',
  },
  
  // WebSocket endpoints
  WS: {
    BASE: import.meta.env.VITE_WS_URL || 'ws://localhost:8000',
  },
  
  // Development helpers
  isDevelopment: () => config.NODE_ENV === 'development',
  isProduction: () => config.NODE_ENV === 'production',
  
  // Get full API URL
  getApiUrl: (endpoint) => `${config.API.BASE}${endpoint}`,
  
  // Get full WebSocket URL
  getWsUrl: (endpoint) => `${config.WS.BASE}${endpoint}`,
  
  // Debug helper
  logConfig: () => {
    if (config.isDevelopment()) {
      console.group('🔧 VideoCall Environment Configuration')
      console.log('Environment:', config.NODE_ENV)
      console.log('Backend URL:', config.BACKEND_URL)
      console.log('WebSocket URL:', config.WS_URL)
      console.log('API Base:', config.API.BASE)
      console.log('WS Base:', config.WS.BASE)
      console.groupEnd()
    }
  },
}

// Log configuration in development
if (typeof window !== 'undefined' && config.isDevelopment()) {
  config.logConfig()
}

export default config 