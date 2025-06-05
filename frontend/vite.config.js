import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  // Load environment variables
  const backendUrl = process.env.VITE_BACKEND_URL || 'http://backend:8000'
  const wsUrl = process.env.VITE_WS_URL || 'ws://backend:8000'
  
  return {
    plugins: [react()],
    server: {
      host: '0.0.0.0',
      port: 3000,
      proxy: {
        '/api': {
          target: backendUrl,
          changeOrigin: true,
          secure: false,
        },
        '/ws': {
          target: wsUrl,
          ws: true,
          changeOrigin: true,
        },
      },
    },
    build: {
      outDir: 'dist',
      sourcemap: true,
    },
    preview: {
      host: '0.0.0.0',
      port: 3000,
    },
    define: {
      // Make environment variables available at build time
      __BACKEND_URL__: JSON.stringify(process.env.VITE_BACKEND_URL || 'http://localhost:8000'),
      __WS_URL__: JSON.stringify(process.env.VITE_WS_URL || 'ws://localhost:8000'),
    },
  }
}) 