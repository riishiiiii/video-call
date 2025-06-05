#!/bin/bash

# VideoCall Frontend Environment Setup Script

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🚀 VideoCall Frontend Environment Setup${NC}"
echo ""

# Function to create .env file
create_env_file() {
    local env_type=$1
    local source_file="env.${env_type}"
    
    if [ -f "$source_file" ]; then
        cp "$source_file" .env
        echo -e "${GREEN}✓ Created .env from ${source_file}${NC}"
    else
        echo -e "${RED}✗ Source file ${source_file} not found${NC}"
        return 1
    fi
}

# Function to prompt for custom configuration
setup_custom_env() {
    echo -e "${YELLOW}Setting up custom environment...${NC}"
    
    read -p "Backend URL (default: http://localhost:8000): " backend_url
    backend_url=${backend_url:-http://localhost:8000}
    
    read -p "WebSocket URL (default: ws://localhost:8000): " ws_url
    ws_url=${ws_url:-ws://localhost:8000}
    
    read -p "Environment (development/production, default: development): " node_env
    node_env=${node_env:-development}
    
    cat > .env << EOF
# Custom environment configuration
VITE_BACKEND_URL=${backend_url}
VITE_WS_URL=${ws_url}
VITE_NODE_ENV=${node_env}
EOF
    
    echo -e "${GREEN}✓ Created custom .env file${NC}"
}

# Check if .env already exists
if [ -f ".env" ]; then
    echo -e "${YELLOW}⚠️  .env file already exists${NC}"
    read -p "Do you want to overwrite it? (y/N): " overwrite
    if [[ ! $overwrite =~ ^[Yy]$ ]]; then
        echo -e "${BLUE}Keeping existing .env file${NC}"
        exit 0
    fi
fi

# Main menu
echo "Please choose your environment setup:"
echo "1) Development (localhost:8000)"
echo "2) Production (backend:8000 - for Docker)"
echo "3) Docker (backend:8000 - for Docker Compose)"
echo "4) Custom configuration"
echo ""

read -p "Enter your choice (1-4): " choice

case $choice in
    1)
        create_env_file "development"
        ;;
    2)
        create_env_file "production"
        ;;
    3)
        create_env_file "docker"
        ;;
    4)
        setup_custom_env
        ;;
    *)
        echo -e "${RED}Invalid choice. Exiting.${NC}"
        exit 1
        ;;
esac

echo ""
echo -e "${GREEN}🎉 Environment setup complete!${NC}"
echo ""
echo "Current configuration:"
echo -e "${BLUE}$(cat .env)${NC}"
echo ""
echo "Next steps:"
echo "1. Review the .env file and adjust if needed"
echo "2. Run 'npm run dev' to start development server"
echo "3. Or run 'npm run build' to build for production"
echo ""
echo -e "${YELLOW}Note: Never commit .env files to version control!${NC}" 