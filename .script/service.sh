#!/bin/bash

# Exit the script immediately if any command fails
set -e

# Pull the latest changes from the Git repository
echo "Pulling latest changes from Git..."
git pull

# Build the Docker images without cache
echo "Building Docker images"
docker compose build --no-cache

# Start the containers in detached mode
echo "Starting containers in detached mode..."
docker compose up -d

# Clean up unused Docker resources
echo "Removing unused Docker resources..."
docker image prune -f
docker container prune -f

echo "Process completed successfully!"


exit 0