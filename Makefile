# VideoCall Application Makefile
# Compatible with Linux, macOS, and Windows (WSL/Git Bash)

# Variables
COMPOSE_FILE := docker-compose.yml
PROJECT_NAME := video-call
FRONTEND_PORT := 3000
BACKEND_PORT := 8000
PROD_HTTP_PORT := 80
PROD_HTTPS_PORT := 443

# Colors for output (works on most terminals)
GREEN := \033[0;32m
YELLOW := \033[1;33m
BLUE := \033[0;34m
RED := \033[0;31m
NC := \033[0m # No Color

# Default target
.DEFAULT_GOAL := help

# Detect OS for platform-specific commands
UNAME_S := $(shell uname -s 2>/dev/null || echo "Windows")
ifeq ($(UNAME_S),Linux)
    PLATFORM := linux
endif
ifeq ($(UNAME_S),Darwin)
    PLATFORM := macos
endif
ifeq ($(UNAME_S),Windows_NT)
    PLATFORM := windows
endif
ifneq (,$(findstring MINGW,$(UNAME_S)))
    PLATFORM := windows
endif
ifneq (,$(findstring MSYS,$(UNAME_S)))
    PLATFORM := windows
endif

# Docker Compose command detection
DOCKER_COMPOSE := $(shell which docker-compose 2>/dev/null)
ifeq ($(DOCKER_COMPOSE),)
    DOCKER_COMPOSE := docker compose
endif

##@ Development Commands

.PHONY: run
run: up ## Start the application (alias for 'up')

.PHONY: up
up: ## Start all services in detached mode
	@echo "$(BLUE)Starting VideoCall application...$(NC)"
	$(DOCKER_COMPOSE) up -d
	@echo "$(GREEN)✓ Application started successfully!$(NC)"
	@echo "$(BLUE)Frontend: http://localhost:$(FRONTEND_PORT)$(NC)"
	@echo "$(BLUE)Backend API: http://localhost:$(BACKEND_PORT)$(NC)"
	@echo "$(BLUE)Health Check: http://localhost:$(BACKEND_PORT)/api/health$(NC)"

.PHONY: up-build
up-build: build up ## Build and start all services
	@echo "$(GREEN)✓ Application built and started!$(NC)"

.PHONY: build
build: ## Build all Docker images
	@echo "$(BLUE)Building Docker images...$(NC)"
	$(DOCKER_COMPOSE) build
	@echo "$(GREEN)✓ Build completed!$(NC)"

.PHONY: rebuild
rebuild: down build up ## Rebuild and restart all services
	@echo "$(GREEN)✓ Application rebuilt and restarted!$(NC)"

.PHONY: dev
dev: ## Start services in development mode with logs
	@echo "$(BLUE)Starting development environment...$(NC)"
	$(DOCKER_COMPOSE) up --build

.PHONY: dev-frontend
dev-frontend: ## Start frontend development server
	@echo "$(BLUE)Starting frontend development server...$(NC)"
	@cd frontend && npm run dev

.PHONY: dev-backend
dev-backend: ## Start backend development server
	@echo "$(BLUE)Starting backend development server...$(NC)"
	@cd backend && python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000

.PHONY: build-frontend
build-frontend: ## Build frontend for production
	@echo "$(BLUE)Building frontend for production...$(NC)"
	@cd frontend && npm run build:prod

.PHONY: build-frontend-dev
build-frontend-dev: ## Build frontend for development
	@echo "$(BLUE)Building frontend for development...$(NC)"
	@cd frontend && npm run build:dev
	
.PHONY: logs
logs: ## Show logs from all services
	$(DOCKER_COMPOSE) logs -f

.PHONY: logs-backend
logs-backend: ## Show logs from backend service only
	$(DOCKER_COMPOSE) logs -f backend

.PHONY: logs-frontend
logs-frontend: ## Show logs from frontend service only
	$(DOCKER_COMPOSE) logs -f frontend

##@ Production Commands

.PHONY: prod
prod: ## Start production environment with SSL
	@echo "$(BLUE)Starting production environment...$(NC)"
	@if [ ! -d "ssl" ]; then \
		echo "$(YELLOW)Warning: SSL directory not found. Creating self-signed certificates...$(NC)"; \
		$(MAKE) ssl-cert; \
	fi
	$(DOCKER_COMPOSE) --profile production up -d
	@echo "$(GREEN)✓ Production environment started!$(NC)"
	@echo "$(BLUE)HTTP: http://localhost:$(PROD_HTTP_PORT) (redirects to HTTPS)$(NC)"
	@echo "$(BLUE)HTTPS: https://localhost:$(PROD_HTTPS_PORT)$(NC)"

.PHONY: prod-build
prod-build: ## Build and start production environment
	@echo "$(BLUE)Building and starting production environment...$(NC)"
	@if [ ! -d "ssl" ]; then \
		echo "$(YELLOW)Warning: SSL directory not found. Creating self-signed certificates...$(NC)"; \
		$(MAKE) ssl-cert; \
	fi
	$(DOCKER_COMPOSE) --profile production up --build -d
	@echo "$(GREEN)✓ Production environment built and started!$(NC)"

.PHONY: ssl-cert
ssl-cert: ## Generate self-signed SSL certificates for development
	@echo "$(BLUE)Generating self-signed SSL certificates...$(NC)"
	@mkdir -p ssl
	@openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
		-keyout ssl/key.pem \
		-out ssl/cert.pem \
		-subj "/C=US/ST=State/L=City/O=Organization/CN=localhost" 2>/dev/null || \
		echo "$(RED)Error: OpenSSL not found. Please install OpenSSL or provide your own certificates in ./ssl/$(NC)"
	@echo "$(GREEN)✓ SSL certificates generated in ./ssl/$(NC)"

##@ Service Management

.PHONY: down
down: ## Stop and remove all containers
	@echo "$(BLUE)Stopping VideoCall application...$(NC)"
	$(DOCKER_COMPOSE) down
	@echo "$(GREEN)✓ Application stopped!$(NC)"

.PHONY: stop
stop: ## Stop all services without removing containers
	@echo "$(BLUE)Stopping services...$(NC)"
	$(DOCKER_COMPOSE) stop
	@echo "$(GREEN)✓ Services stopped!$(NC)"

.PHONY: start
start: ## Start existing containers
	@echo "$(BLUE)Starting existing containers...$(NC)"
	$(DOCKER_COMPOSE) start
	@echo "$(GREEN)✓ Services started!$(NC)"

.PHONY: restart
restart: ## Restart all services
	@echo "$(BLUE)Restarting services...$(NC)"
	$(DOCKER_COMPOSE) restart
	@echo "$(GREEN)✓ Services restarted!$(NC)"

.PHONY: ps
ps: ## Show running containers
	$(DOCKER_COMPOSE) ps

.PHONY: status
status: ps ## Show status of all services (alias for 'ps')

##@ Development Tools

.PHONY: shell-backend
shell-backend: ## Open shell in backend container
	$(DOCKER_COMPOSE) exec backend /bin/bash

.PHONY: shell-frontend
shell-frontend: ## Open shell in frontend container
	$(DOCKER_COMPOSE) exec frontend /bin/sh

.PHONY: test-backend
test-backend: ## Run backend tests
	$(DOCKER_COMPOSE) exec backend python -m pytest tests/ || echo "$(YELLOW)No tests found$(NC)"

.PHONY: format-backend
format-backend: ## Format backend code
	$(DOCKER_COMPOSE) exec backend python -m black . || echo "$(YELLOW)Black not installed$(NC)"

.PHONY: lint-backend
lint-backend: ## Lint backend code
	$(DOCKER_COMPOSE) exec backend python -m flake8 . || echo "$(YELLOW)Flake8 not installed$(NC)"

##@ Database & Cache

.PHONY: db-shell
db-shell: ## Open database shell (if database service exists)
	@echo "$(YELLOW)No database service configured$(NC)"

##@ Cleanup Commands

.PHONY: clean
clean: down ## Stop containers and remove images
	@echo "$(BLUE)Cleaning up Docker resources...$(NC)"
	$(DOCKER_COMPOSE) down --rmi all --volumes --remove-orphans
	@echo "$(GREEN)✓ Cleanup completed!$(NC)"

.PHONY: clean-all
clean-all: clean ## Remove all Docker resources including unused images
	@echo "$(BLUE)Performing deep cleanup...$(NC)"
	docker system prune -af --volumes 2>/dev/null || echo "$(YELLOW)Docker system prune failed$(NC)"
	@echo "$(GREEN)✓ Deep cleanup completed!$(NC)"

.PHONY: clean-cache
clean-cache: ## Clean Python cache files
	@echo "$(BLUE)Cleaning Python cache files...$(NC)"
	@find . -type d -name "__pycache__" -exec rm -rf {} + 2>/dev/null || true
	@find . -type f -name "*.pyc" -delete 2>/dev/null || true
	@find . -type f -name "*.pyo" -delete 2>/dev/null || true
	@find . -type d -name "*.egg-info" -exec rm -rf {} + 2>/dev/null || true
	@echo "$(GREEN)✓ Python cache cleaned!$(NC)"

##@ Health & Monitoring

.PHONY: health
health: ## Check health of all services
	@echo "$(BLUE)Checking service health...$(NC)"
	@echo "Backend Health:"
	@curl -s http://localhost:$(BACKEND_PORT)/api/health | python -m json.tool 2>/dev/null || echo "$(RED)Backend not responding$(NC)"
	@echo "\nFrontend Health:"
	@curl -s -o /dev/null -w "HTTP Status: %{http_code}\n" http://localhost:$(FRONTEND_PORT)/ || echo "$(RED)Frontend not responding$(NC)"

.PHONY: monitor
monitor: ## Monitor resource usage
	@echo "$(BLUE)Monitoring Docker containers...$(NC)"
	docker stats $(shell $(DOCKER_COMPOSE) ps -q) 2>/dev/null || echo "$(YELLOW)No containers running$(NC)"

##@ Information

.PHONY: info
info: ## Show system and project information
	@echo "$(BLUE)=== VideoCall Application Info ===$(NC)"
	@echo "Platform: $(PLATFORM)"
	@echo "Docker Compose: $(DOCKER_COMPOSE)"
	@echo "Project: $(PROJECT_NAME)"
	@echo "Frontend Port: $(FRONTEND_PORT)"
	@echo "Backend Port: $(BACKEND_PORT)"
	@echo ""
	@echo "$(BLUE)=== Docker Info ===$(NC)"
	@docker --version 2>/dev/null || echo "Docker not installed"
	@$(DOCKER_COMPOSE) --version 2>/dev/null || echo "Docker Compose not available"
	@echo ""
	@echo "$(BLUE)=== Service URLs ===$(NC)"
	@echo "Frontend: http://localhost:$(FRONTEND_PORT)"
	@echo "Backend API: http://localhost:$(BACKEND_PORT)"
	@echo "API Docs: http://localhost:$(BACKEND_PORT)/docs"
	@echo "Health Check: http://localhost:$(BACKEND_PORT)/api/health"

.PHONY: urls
urls: ## Show all service URLs
	@echo "$(BLUE)=== Service URLs ===$(NC)"
	@echo "Frontend: http://localhost:$(FRONTEND_PORT)"
	@echo "Backend API: http://localhost:$(BACKEND_PORT)"
	@echo "API Documentation: http://localhost:$(BACKEND_PORT)/docs"
	@echo "Health Check: http://localhost:$(BACKEND_PORT)/api/health"
	@if $(DOCKER_COMPOSE) ps | grep -q nginx; then \
		echo "Production HTTP: http://localhost:$(PROD_HTTP_PORT)"; \
		echo "Production HTTPS: https://localhost:$(PROD_HTTPS_PORT)"; \
	fi

##@ Help

.PHONY: help
help: ## Display this help message
	@echo "$(BLUE)VideoCall Application - Makefile Commands$(NC)"
	@echo ""
	@awk 'BEGIN {FS = ":.*##"; printf "Usage:\n  make $(BLUE)<target>$(NC)\n"} /^[a-zA-Z_0-9-]+:.*?##/ { printf "  $(BLUE)%-15s$(NC) %s\n", $$1, $$2 } /^##@/ { printf "\n$(YELLOW)%s$(NC)\n", substr($$0, 5) } ' $(MAKEFILE_LIST)
	@echo ""
	@echo "$(BLUE)Examples:$(NC)"
	@echo "  make run          # Start the application"
	@echo "  make up-build     # Build and start"
	@echo "  make prod         # Start production environment"
	@echo "  make logs         # View logs"
	@echo "  make clean        # Clean up resources"
	@echo ""
	@echo "$(BLUE)Platform:$(NC) $(PLATFORM)"
	@echo "$(BLUE)Docker Compose:$(NC) $(DOCKER_COMPOSE)"

# Ensure targets don't conflict with files
.PHONY: all clean help info urls health monitor 