#!/bin/bash

# Exit on error
set -e

echo "=============================================="
echo "RUNNING LOCAL DEVELOPMENT DEPLOYMENT"
echo "=============================================="

# Set environment variables for local deployment
export ENVIRONMENT=local
export DOMAIN=localhost
export POSTGRES_PASSWORD=postgres_secure_password123

# Ensure docker network exists
if ! docker network inspect traefik-public >/dev/null 2>&1; then
  echo "Creating traefik-public network..."
  docker network create traefik-public
else
  echo "Network traefik-public already exists."
fi

# Start the database first
echo "Starting database container..."
docker compose up -d db

# Wait for database to be ready
echo "Waiting for database to be ready..."
sleep 10

# Start the rest of the services
echo "Starting all services..."
docker compose up -d

echo "Local deployment completed!"
echo "Your application is now available at:"
echo "Frontend: http://localhost:5174"
echo "Backend API: http://localhost:8000"
echo "API Documentation: http://localhost:8000/docs"
echo "Adminer (DB Admin): http://localhost:8081"

echo "You can check logs with: docker compose logs [service]"
echo "For example: docker compose logs backend" 