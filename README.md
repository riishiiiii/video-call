# VideoCall - Modern Video Conferencing App

A modern, responsive video calling application built with FastAPI backend and React frontend, featuring WebRTC for peer-to-peer video communication with a beautiful, professional UI.

## ✨ Features

### 🎥 **Video Communication**
- **Real-time Video Calls** - WebRTC-based peer-to-peer communication
- **Multi-participant Support** - Connect multiple people in the same room
- **Audio/Video Controls** - Mute/unmute and camera toggle with visual feedback
- **Screen Sharing** - Share your screen with participants (coming soon)
- **Connection Quality** - Real-time connection status indicators

### 🔒 **Security & Privacy**
- **Secure Rooms** - Room-based access with unique IDs and keys
- **End-to-end Encryption** - WebRTC encrypted communication
- **Room Isolation** - Secure room-based access control
- **Input Validation** - Server-side validation of all inputs

### 🎨 **Modern UI/UX**
- **Beautiful Design** - Glassmorphism UI with smooth animations
- **Dark/Light Theme** - Auto-detection with manual toggle
- **Responsive Layout** - Works perfectly on desktop, tablet, and mobile
- **Smooth Animations** - Framer Motion powered transitions
- **Professional Controls** - Zoom-like interface with modern design patterns

### 🛠️ **Developer Experience**
- **Environment Configuration** - Flexible deployment options
- **Docker Support** - Full containerization with Docker Compose
- **Health Monitoring** - Built-in health checks and monitoring
- **Cross-platform** - Works on Linux, macOS, and Windows
- **Comprehensive Documentation** - Detailed setup and deployment guides

## 🏗️ Architecture

The application follows a modern microservices architecture:

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   React Frontend │    │  FastAPI Backend │    │  Nginx Proxy    │
│   (Port 3000)   │◄──►│   (Port 8000)   │◄──►│  (Port 80/443)  │
│                 │    │                 │    │                 │
│ • Modern UI     │    │ • WebSocket     │    │ • SSL/TLS       │
│ • WebRTC Client │    │ • Room Mgmt     │    │ • Load Balancing│
│ • State Mgmt    │    │ • API Endpoints │    │ • Security      │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### Components
- **Frontend** (`/frontend`) - React application with Vite build system
- **Backend** (`/backend`) - FastAPI server with WebSocket support
- **Proxy** (`nginx.conf`) - Production reverse proxy with SSL

## 🚀 Quick Start

### Using Docker Compose (Recommended)

1. **Clone and start**
   ```bash
   git clone <repository-url>
   cd video-call
   make up-build
   ```

2. **Access the application**
   - Frontend: `http://localhost:3000`
   - Backend API: `http://localhost:8000`
   - API Docs: `http://localhost:8000/docs`

### Using Makefile Commands

```bash
# Development
make dev              # Start all services
make dev-frontend     # Start only React dev server
make dev-backend      # Start only FastAPI server

# Production
make prod             # Start with SSL/TLS
make prod-build       # Build and start production

# Management
make logs             # View logs
make health           # Check service health
make clean            # Clean up containers
```

## ⚙️ Environment Configuration

The frontend supports flexible environment configuration for different deployment scenarios.

### Quick Setup

```bash
cd frontend
./setup-env.sh        # Interactive environment setup
```

### Manual Configuration

Create a `.env` file in the frontend directory:

```bash
# Development
VITE_BACKEND_URL=http://localhost:8000
VITE_WS_URL=ws://localhost:8000
VITE_NODE_ENV=development

# Production
VITE_BACKEND_URL=https://yourdomain.com
VITE_WS_URL=wss://yourdomain.com
VITE_NODE_ENV=production

# Docker
VITE_BACKEND_URL=http://backend:8000
VITE_WS_URL=ws://backend:8000
VITE_NODE_ENV=production
```

### Deployment Scenarios

| Scenario | Frontend | Backend | Configuration |
|----------|----------|---------|---------------|
| **Local Dev** | localhost:3000 | localhost:8000 | `env.development` |
| **Docker** | Container | Container | `env.docker` |
| **Production** | CDN/Server | Server | `env.production` |
| **Ngrok/Tunnel** | localhost:3000 | tunnel.ngrok.io | Custom `.env` |

## 🔧 Development Setup

### Prerequisites

- **Node.js 18+** (for frontend)
- **Python 3.12+** (for backend)
- **Docker & Docker Compose** (for containerized setup)

### Frontend Development

```bash
cd frontend

# Install dependencies
npm install

# Setup environment
./setup-env.sh

# Start development server
npm run dev
# or
make dev-frontend
```

### Backend Development

```bash
cd backend

# Install dependencies
pip install uv
uv sync

# Start development server
python main.py
# or
make dev-backend
```

### Full Stack Development

```bash
# Start both frontend and backend
make dev

# Or start separately in different terminals
make dev-frontend    # Terminal 1
make dev-backend     # Terminal 2
```

## 🌐 Production Deployment

### Docker Compose with SSL

1. **Generate SSL certificates**
   ```bash
   make ssl-cert        # Self-signed for development
   # Or add your own certificates to ./ssl/
   ```

2. **Deploy with production profile**
   ```bash
   make prod-build
   ```

3. **Access your application**
   - HTTP: `http://localhost` (redirects to HTTPS)
   - HTTPS: `https://localhost`

### Custom Domain Deployment

1. **Update environment variables**
   ```bash
   # In docker-compose.yml
   VITE_BACKEND_URL=https://yourdomain.com
   VITE_WS_URL=wss://yourdomain.com
   ```

2. **Configure nginx**
   ```bash
   # Update nginx.conf with your domain
   server_name yourdomain.com;
   ```

3. **Deploy**
   ```bash
   make prod-build
   ```

### Cloud Deployment

For cloud platforms (AWS, GCP, Azure):

1. **Build images**
   ```bash
   docker build -t videocall-frontend ./frontend
   docker build -t videocall-backend ./backend
   ```

2. **Push to registry**
   ```bash
   docker tag videocall-frontend your-registry/videocall-frontend
   docker push your-registry/videocall-frontend
   ```

3. **Deploy with your cloud provider's container service**

## 📡 API Documentation

### REST Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/rooms` | Create a new room |
| `GET` | `/api/health` | Health check |
| `WebSocket` | `/ws/{room_id}?key={key}` | Video call connection |

### WebSocket Protocol

#### Client Messages
```json
{
  "type": "offer|answer|ice_candidate|participant_update",
  "offer": "...",           // WebRTC offer
  "answer": "...",          // WebRTC answer  
  "candidate": "...",       // ICE candidate
  "to": "participant_id",   // Target participant
  "data": {...}             // Update data
}
```

#### Server Messages
```json
{
  "type": "room_joined|participant_joined|participant_left|offer|answer|ice_candidate",
  "participants": [...],    // Current participants
  "participant": {...},     // Participant data
  "from": "participant_id", // Sender ID
  "offer": "...",          // WebRTC offer
  "answer": "...",         // WebRTC answer
  "candidate": "..."       // ICE candidate
}
```

## 🌍 Browser Support

| Browser | Version | WebRTC | Notes |
|---------|---------|--------|-------|
| **Chrome** | 80+ | ✅ | Full support |
| **Firefox** | 75+ | ✅ | Full support |
| **Safari** | 13+ | ✅ | Requires HTTPS |
| **Edge** | 80+ | ✅ | Full support |
| **Mobile Safari** | 13+ | ✅ | iOS support |
| **Chrome Mobile** | 80+ | ✅ | Android support |

**⚠️ Important**: WebRTC requires HTTPS in production environments.

## 🔒 Security Features

### Backend Security
- **CORS Protection** - Configurable cross-origin policies
- **Rate Limiting** - API and WebSocket rate limiting
- **Input Validation** - Comprehensive request validation
- **Health Checks** - Service monitoring and alerting

### Frontend Security
- **CSP Headers** - Content Security Policy
- **XSS Protection** - Cross-site scripting prevention
- **Secure Cookies** - HTTPOnly and Secure flags
- **Environment Isolation** - Separate configs per environment

### Network Security
- **SSL/TLS Encryption** - End-to-end encryption
- **WebRTC Security** - DTLS-SRTP for media streams
- **Firewall Ready** - Configurable ports and protocols

## 📊 Monitoring & Health Checks

### Health Endpoints

```bash
# Backend health
curl http://localhost:8000/api/health

# Frontend health  
curl http://localhost:3000/health

# Full system check
make health
```

### Monitoring Commands

```bash
make monitor          # Resource usage
make logs            # View all logs
make logs-frontend   # Frontend logs only
make logs-backend    # Backend logs only
```

### Metrics Available

- **Connection Status** - WebSocket connection health
- **Room Statistics** - Active rooms and participants
- **Performance** - Response times and throughput
- **Error Rates** - Failed requests and connections

## 🛠️ Troubleshooting

### Common Issues

#### 🎥 Camera/Microphone Issues
```bash
# Check browser permissions
# Ensure HTTPS is used (required for WebRTC)
# Verify device availability in browser settings
```

#### 🔌 Connection Issues
```bash
# Check environment configuration
make health

# Verify backend connectivity
curl http://localhost:8000/api/health

# Check WebSocket connection
# Open browser dev tools → Network → WS tab
```

#### 🐳 Docker Issues
```bash
# Rebuild containers
make clean && make up-build

# Check container logs
make logs

# Verify environment variables
docker-compose config
```

### Debug Mode

Enable detailed logging:

```bash
# Frontend (browser console)
localStorage.setItem('debug', 'videocall:*')

# Backend (environment variable)
export LOG_LEVEL=DEBUG
```

### Environment Verification

```bash
# Check frontend configuration
cd frontend && npm run dev
# Look for environment config in browser console

# Verify Docker environment
docker-compose config
```

## 🤝 Contributing

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Make your changes**
4. **Test thoroughly**
   ```bash
   make test-backend
   npm test --prefix frontend
   ```
5. **Submit a pull request**

### Development Guidelines

- Follow existing code style
- Add tests for new features
- Update documentation
- Test in multiple browsers
- Verify Docker builds work

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

### Getting Help

- 📖 **Documentation**: Check this README and `frontend/ENV_CONFIG.md`
- 🐛 **Issues**: Create an issue on GitHub
- 💬 **Discussions**: Use GitHub Discussions for questions
- 🔍 **Debugging**: Check browser console and container logs

### Useful Commands

```bash
make help            # Show all available commands
make info            # System and project information
make urls            # Show all service URLs
make clean-all       # Complete cleanup
```

---

**Built with ❤️ using React, FastAPI, and WebRTC** 