#!/bin/bash

echo "Updating server configuration..."

# Create necessary directories on the server
ssh root@66.228.44.155 "mkdir -p /root/app/nginx/conf.d"

# Copy nginx configuration files
echo "Copying nginx configuration files..."
scp nginx/conf.d/10-app.conf root@66.228.44.155:/root/app/nginx/conf.d/
scp nginx/conf.d/20-api.conf root@66.228.44.155:/root/app/nginx/conf.d/
scp nginx/conf.d/30-adminer.conf root@66.228.44.155:/root/app/nginx/conf.d/

# Copy frontend configuration
echo "Copying frontend configuration..."
scp frontend/nginx.conf root@66.228.44.155:/root/app/frontend/
scp frontend/.env root@66.228.44.155:/root/app/frontend/

# SSH into the server and restart services
echo "Restarting services..."
ssh root@66.228.44.155 << 'EOF'
cd /root/app
docker compose down
docker compose up -d
EOF

echo "Server update completed!" 