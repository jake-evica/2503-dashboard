#!/bin/bash

# Copy the updated configuration files to the server
echo "Copying configuration files to server..."
scp frontend/nginx.conf root@66.228.44.155:/root/app/frontend/
scp frontend/.env root@66.228.44.155:/root/app/frontend/

# SSH into the server and rebuild/restart the containers
echo "Connecting to server to rebuild and restart containers..."
ssh root@66.228.44.155 << 'EOF'
cd /root/app
docker compose down
docker compose up -d --build frontend proxy
EOF

echo "Deployment update completed!" 