#!/bin/bash

# Development script for VideoCall app
# This script helps you run the frontend and backend services for development

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Function to start backend
start_backend() {
    print_status "Starting backend service..."
    cd backend
    
    if [ ! -d ".venv" ]; then
        print_status "Setting up Python virtual environment..."
        if command_exists uv; then
            uv sync
        else
            print_warning "uv not found, using pip..."
            python -m venv .venv
            source .venv/bin/activate
            pip install -r requirements.txt 2>/dev/null || pip install fastapi uvicorn websockets
        fi
    fi
    
    print_status "Activating virtual environment and starting server..."
    if [ -f ".venv/bin/activate" ]; then
        source .venv/bin/activate
    fi
    
    python main.py &
    BACKEND_PID=$!
    print_success "Backend started on http://localhost:8000 (PID: $BACKEND_PID)"
    cd ..
}

# Function to start frontend
start_frontend() {
    print_status "Starting frontend service..."
    cd frontend
    
    if command_exists python3; then
        python3 -m http.server 3000 --directory static &
        FRONTEND_PID=$!
        print_success "Frontend started on http://localhost:3000 (PID: $FRONTEND_PID)"
    elif command_exists python; then
        python -m http.server 3000 --directory static &
        FRONTEND_PID=$!
        print_success "Frontend started on http://localhost:3000 (PID: $FRONTEND_PID)"
    elif command_exists npx; then
        npx serve static -p 3000 &
        FRONTEND_PID=$!
        print_success "Frontend started on http://localhost:3000 (PID: $FRONTEND_PID)"
    else
        print_error "No suitable HTTP server found. Please install Python or Node.js"
        exit 1
    fi
    cd ..
}

# Function to stop services
stop_services() {
    print_status "Stopping services..."
    if [ ! -z "$BACKEND_PID" ]; then
        kill $BACKEND_PID 2>/dev/null || true
        print_success "Backend stopped"
    fi
    if [ ! -z "$FRONTEND_PID" ]; then
        kill $FRONTEND_PID 2>/dev/null || true
        print_success "Frontend stopped"
    fi
    exit 0
}

# Function to show help
show_help() {
    echo "VideoCall Development Script"
    echo ""
    echo "Usage: $0 [COMMAND]"
    echo ""
    echo "Commands:"
    echo "  start     Start both frontend and backend services"
    echo "  backend   Start only the backend service"
    echo "  frontend  Start only the frontend service"
    echo "  docker    Start services using Docker Compose"
    echo "  clean     Clean up build artifacts and caches"
    echo "  help      Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0 start          # Start both services"
    echo "  $0 backend        # Start only backend"
    echo "  $0 docker         # Use Docker Compose"
    echo ""
}

# Function to start with Docker
start_docker() {
    print_status "Starting services with Docker Compose..."
    if command_exists docker-compose; then
        docker-compose up --build
    elif command_exists docker && docker compose version >/dev/null 2>&1; then
        docker compose up --build
    else
        print_error "Docker Compose not found. Please install Docker and Docker Compose"
        exit 1
    fi
}

# Function to clean up
clean_up() {
    print_status "Cleaning up..."
    
    # Clean Python cache
    find . -type d -name "__pycache__" -exec rm -rf {} + 2>/dev/null || true
    find . -type f -name "*.pyc" -delete 2>/dev/null || true
    
    # Clean Docker
    if command_exists docker; then
        docker system prune -f >/dev/null 2>&1 || true
    fi
    
    print_success "Cleanup completed"
}

# Trap to handle script interruption
trap stop_services INT TERM

# Main script logic
case "${1:-start}" in
    "start")
        print_status "Starting VideoCall development environment..."
        start_backend
        sleep 2
        start_frontend
        print_success "All services started successfully!"
        print_status "Frontend: http://localhost:3000"
        print_status "Backend API: http://localhost:8000"
        print_status "Backend Health: http://localhost:8000/api/health"
        print_status "Press Ctrl+C to stop all services"
        wait
        ;;
    "backend")
        start_backend
        print_status "Press Ctrl+C to stop the backend service"
        wait
        ;;
    "frontend")
        start_frontend
        print_status "Press Ctrl+C to stop the frontend service"
        wait
        ;;
    "docker")
        start_docker
        ;;
    "clean")
        clean_up
        ;;
    "help"|"-h"|"--help")
        show_help
        ;;
    *)
        print_error "Unknown command: $1"
        show_help
        exit 1
        ;;
esac 