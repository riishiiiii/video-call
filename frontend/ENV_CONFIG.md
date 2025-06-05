# Frontend Environment Configuration

This document explains how to configure the frontend for different deployment environments.

## Environment Variables

The frontend uses the following environment variables:

### Required Variables

- `VITE_BACKEND_URL` - The URL of the backend API server
- `VITE_WS_URL` - The WebSocket URL for real-time communication
- `VITE_NODE_ENV` - The environment mode (development, production)

### Default Values

If environment variables are not set, the application will use intelligent defaults:

- **Development**: `http://localhost:8000` (backend), `ws://localhost:8000` (websocket)
- **Production**: Auto-detected based on current hostname and protocol

## Configuration Files

### Environment Files

1. `env.development` - Development environment settings
2. `env.production` - Production environment settings  
3. `env.docker` - Docker container settings

### Usage

Copy the appropriate environment file to `.env` in the frontend directory:

```bash
# For development
cp env.development .env

# For production
cp env.production .env

# For Docker
cp env.docker .env
```

## Deployment Scenarios

### 1. Local Development

```bash
# Frontend runs on http://localhost:3000
# Backend runs on http://localhost:8000
VITE_BACKEND_URL=http://localhost:8000
VITE_WS_URL=ws://localhost:8000
VITE_NODE_ENV=development
```

### 2. Docker Compose

```bash
# Frontend and backend in same Docker network
VITE_BACKEND_URL=http://backend:8000
VITE_WS_URL=ws://backend:8000
VITE_NODE_ENV=production
```

### 3. Production with Reverse Proxy

```bash
# Both frontend and backend behind nginx
VITE_BACKEND_URL=https://yourdomain.com
VITE_WS_URL=wss://yourdomain.com
VITE_NODE_ENV=production
```

### 4. Separate Deployments

```bash
# Frontend and backend on different servers
VITE_BACKEND_URL=https://api.yourdomain.com
VITE_WS_URL=wss://api.yourdomain.com
VITE_NODE_ENV=production
```

## Build Commands

### Development Build
```bash
npm run build:dev
```

### Production Build
```bash
npm run build:prod
```

### Docker Build with Environment
```bash
docker build \
  --build-arg VITE_BACKEND_URL=http://backend:8000 \
  --build-arg VITE_WS_URL=ws://backend:8000 \
  --build-arg VITE_NODE_ENV=production \
  -t videocall-frontend .
```

## Makefile Commands

```bash
# Start development servers
make dev-frontend
make dev-backend

# Build for different environments
make build-frontend      # Production build
make build-frontend-dev  # Development build

# Docker operations
make up-build           # Build and start with Docker
make prod              # Start production environment
```

## Auto-Detection

The frontend includes intelligent URL detection:

1. **Development Mode**: Uses Vite proxy for API calls
2. **Production Mode**: Auto-detects hostname and protocol
3. **Docker Mode**: Uses service names for internal communication

## Troubleshooting

### Common Issues

1. **CORS Errors**: Ensure backend URL is correctly configured
2. **WebSocket Connection Failed**: Check WS URL and firewall settings
3. **API Not Found**: Verify backend is running and accessible

### Debug Mode

Set `VITE_NODE_ENV=development` to enable:
- Console logging
- Detailed error messages
- Development tools

### Environment Verification

The application logs the current configuration on startup:
- Check browser console for environment settings
- Verify API and WebSocket URLs are correct
- Confirm backend connectivity

## Security Notes

- Never commit `.env` files to version control
- Use HTTPS/WSS in production
- Validate all environment variables
- Use different credentials for each environment 