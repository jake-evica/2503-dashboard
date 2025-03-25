#!/bin/bash

# Exit on error
set -e

# Check if running on a remote server
if [ "$(whoami)" != "root" ]; then
  echo "=============================================="
  echo "ERROR: This script must be run on your remote server as root"
  echo "=============================================="
  echo "This deployment script is intended for server use only."
  echo "To deploy to your server, follow these steps:"
  echo
  echo "1. Copy your project files to your server:"
  echo "   rsync -avz --exclude 'node_modules' --exclude '__pycache__' --exclude 'venv' --exclude '.git' ./ root@${DOMAIN}:/root/app/"
  echo
  echo "2. SSH into your server:"
  echo "   ssh root@${DOMAIN}"
  echo
  echo "3. Run this script on your server:"
  echo "   cd /root/app"
  echo "   chmod +x deploy.sh"
  echo "   ./deploy.sh"
  echo "=============================================="
  exit 1
fi

echo "=============================================="
echo "STARTING PRODUCTION DEPLOYMENT"
echo "=============================================="

# Step 1: Setup Traefik (only needed once)
echo "Setting up Traefik..."
mkdir -p /root/code/traefik-public/

# Copy Traefik Docker Compose file to the directory
cp docker-compose.traefik.prod.yml /root/code/traefik-public/docker-compose.yml

# Create Docker network if it doesn't exist
if ! docker network inspect traefik-public >/dev/null 2>&1; then
  echo "Creating traefik-public network..."
  docker network create traefik-public
else
  echo "Network traefik-public already exists."
fi

# Set environment variables for Traefik
echo "Setting up environment variables for Traefik..."
export USERNAME=admin
# Prompt for Traefik dashboard password
read -sp "Enter password for Traefik dashboard: " PASSWORD
echo
export PASSWORD
export HASHED_PASSWORD=$(openssl passwd -apr1 $PASSWORD)
export DOMAIN=${DOMAIN:-gosystemslabs.com}
export EMAIL=jake@gosystemslab.com
export FRONTEND_HOST=${FRONTEND_HOST:-https://app.${DOMAIN}}

# Copy middleware configurations for Traefik
echo "Copying Traefik middleware configurations..."
mkdir -p /root/code/traefik-public/config
cp -r traefik/* /root/code/traefik-public/config/

# Start Traefik
echo "Starting Traefik..."
cd /root/code/traefik-public/
docker compose up -d
cd -

# Wait for Traefik to be ready
echo "Waiting for Traefik to be ready..."
sleep 10

# Step 2: Deploy FastAPI Project
echo "Deploying FastAPI project..."
export ENVIRONMENT=production
export DOMAIN=${DOMAIN:-gosystemslabs.com}
export FRONTEND_HOST=${FRONTEND_HOST:-https://app.${DOMAIN}}

# Tag Docker images with current timestamp
export TAG=$(date +%Y%m%d%H%M%S)

# Make sure we stop any existing containers to avoid conflicts
echo "Stopping any existing containers..."
docker compose -f docker-compose.yml down || true

# Start the database first
echo "Starting database container first..."
docker compose -f docker-compose.yml up -d db

# Wait for database to be healthy
echo "Waiting for database to be ready..."
until docker compose -f docker-compose.yml ps -q db &>/dev/null && docker compose -f docker-compose.yml exec db pg_isready -U postgres; do
  echo "Waiting for database to be ready..."
  sleep 5
done

# Run the prestart script separately to make sure database is initialized
echo "Running database initialization..."
docker compose -f docker-compose.yml up prestart

# Build and deploy the rest of the services
echo "Building and deploying remaining services..."
docker compose -f docker-compose.yml up -d

echo "=============================================="
echo "Deployment completed successfully!"
echo "=============================================="
echo
echo "Your application is now available at:"
echo "Frontend: https://app.${DOMAIN}"
echo "Backend API: https://api.${DOMAIN}"
echo "API Documentation: https://api.${DOMAIN}/docs"
echo "Adminer: https://adminer.${DOMAIN}"
echo "Traefik Dashboard: https://traefik.${DOMAIN} (login with username 'admin' and the password you provided)"
echo 
echo "To check logs, use: docker compose logs [service]"
echo "To check status, use: docker compose ps"

echo "Commands to run manually in development:"
echo "   # To sync files to remote server:"
echo "   rsync -avz --exclude 'node_modules' --exclude '__pycache__' --exclude 'venv' --exclude '.git' ./ root@${DOMAIN}:/root/app/"
echo
echo "   # To connect to remote server:"
echo "   ssh root@${DOMAIN}" 