# VideoCall - Modern Video Conferencing App

A modern, responsive video calling application built with FastAPI backend and vanilla JavaScript frontend, featuring WebRTC for peer-to-peer video communication.

## Features

- 🎥 **Real-time Video Calls** - WebRTC-based peer-to-peer video communication
- 🔒 **Secure Rooms** - Room-based access with unique IDs and keys
- 📱 **Responsive Design** - Modern UI that works on desktop and mobile
- 🌙 **Dark/Light Theme** - Toggle between themes with persistent preference
- 🎛️ **Media Controls** - Mute/unmute audio and toggle video
- ⌨️ **Keyboard Shortcuts** - Ctrl+M (mute), Ctrl+E (video toggle)
- 🔄 **Auto-reconnection** - Robust WebSocket connection handling
- 📋 **Copy to Clipboard** - Easy sharing of room credentials
- 🏥 **Health Monitoring** - Built-in health checks and monitoring

## Architecture

The application is split into two main components:

- **Backend** (`/backend`) - FastAPI-based API server handling room management and WebSocket connections
- **Frontend** (`/frontend`) - Static files served by nginx with modern responsive UI

## Quick Start

### Using Docker Compose (Recommended)

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd video-call
   ```

2. **Start the application**
   ```bash
   docker-compose up --build
   ```

3. **Access the application**
   - Open your browser to `http://localhost:3000`
   - The frontend will automatically proxy API calls to the backend

### Development Setup

#### Backend Development

1. **Navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Install dependencies**
   ```bash
   pip install uv
   uv sync
   ```

3. **Run the backend server**
   ```bash
   python main.py
   ```
   
   The backend will be available at `http://localhost:8000`

#### Frontend Development

1. **Navigate to frontend directory**
   ```bash
   cd frontend
   ```

2. **Serve static files** (using any static file server)
   ```bash
   # Using Python
   python -m http.server 3000 --directory static
   
   # Using Node.js
   npx serve static -p 3000
   
   # Using nginx (if installed)
   nginx -c $(pwd)/nginx-frontend.conf
   ```

   The frontend will be available at `http://localhost:3000`

## Production Deployment

### With SSL/TLS (Recommended)

1. **Generate SSL certificates**
   ```bash
   mkdir ssl
   # Add your SSL certificate files:
   # ssl/cert.pem
   # ssl/key.pem
   ```

2. **Deploy with production profile**
   ```bash
   docker-compose --profile production up --build
   ```

   This will:
   - Start the backend service
   - Start the frontend service  
   - Start nginx reverse proxy with SSL termination
   - Redirect HTTP to HTTPS
   - Apply security headers and rate limiting

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PYTHONUNBUFFERED` | Python output buffering | `1` |
| `HOST` | Backend host | `0.0.0.0` |
| `PORT` | Backend port | `8000` |

## API Documentation

### Endpoints

- `POST /api/rooms/create` - Create a new room
- `GET /api/rooms/verify/{room_id}?room_key={key}` - Verify room credentials
- `GET /api/health` - Health check endpoint
- `WebSocket /ws/{room_id}?key={room_key}` - WebSocket connection for video calls

### WebSocket Messages

#### Client to Server
```json
{
  "type": "offer|answer|candidate|leave",
  "offer": "...",      // For offer type
  "answer": "...",     // For answer type  
  "candidate": "...",  // For candidate type
  "target_id": "..."   // Participant ID to send to
}
```

#### Server to Client
```json
{
  "type": "participant_joined|participant_left|offer|answer|candidate",
  "participant_id": "...",
  "participant_count": 0,
  "sender_id": "...",
  "offer": "...",
  "answer": "...",
  "candidate": "..."
}
```

## Browser Support

- Chrome 80+
- Firefox 75+
- Safari 13+
- Edge 80+

**Note**: WebRTC requires HTTPS in production environments.

## Security Features

- **CORS Protection** - Configurable CORS policies
- **Rate Limiting** - API and WebSocket rate limiting
- **Security Headers** - XSS, CSRF, and clickjacking protection
- **Input Validation** - Server-side validation of all inputs
- **Room Isolation** - Secure room-based access control

## Performance Optimizations

### Backend
- **Async/Await** - Non-blocking I/O operations
- **Connection Pooling** - Efficient WebSocket management
- **Health Checks** - Automatic service monitoring
- **Logging** - Structured logging for debugging

### Frontend
- **Lazy Loading** - Components loaded on demand
- **Caching** - Aggressive caching of static assets
- **Compression** - Gzip compression for all text assets
- **CDN Ready** - Optimized for CDN deployment

## Monitoring

### Health Checks

- Backend: `GET /api/health`
- Frontend: `GET /` (nginx health check)

### Metrics

The application provides the following metrics:
- Active room count
- Connection status
- Service uptime
- Error rates

## Troubleshooting

### Common Issues

1. **Camera/Microphone not working**
   - Ensure HTTPS is used (required for WebRTC)
   - Check browser permissions
   - Verify device availability

2. **WebSocket connection fails**
   - Check network connectivity
   - Verify room credentials
   - Check browser console for errors

3. **Video not displaying**
   - Check WebRTC compatibility
   - Verify STUN server accessibility
   - Check firewall settings

### Debug Mode

Enable debug logging by setting log level to DEBUG in the backend:

```python
logging.basicConfig(level=logging.DEBUG)
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support and questions:
- Create an issue on GitHub
- Check the troubleshooting section
- Review browser console logs for errors 