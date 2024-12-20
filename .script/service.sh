#!/bin/bash

# Exit the script immediately if any command fails
set -e

#function to update git version
update_git_version() {
  echo "Updating NEXT_PUBLIC_GIT_VERSION_ID in .env file..."

  if [ ! -f .env ]; then
    cp .env.example .env
    echo ".env file not found. Copied from .env.example."
  fi

  GIT_VERSION_ID="$(git rev-parse --short HEAD)-$(date +"%y%m%d:%H%M%S")"
  if grep -q "NEXT_PUBLIC_GIT_VERSION_ID" .env; then
    sed -i.bak "s/NEXT_PUBLIC_GIT_VERSION_ID=.*/NEXT_PUBLIC_GIT_VERSION_ID=$GIT_VERSION_ID/" .env
  else
    echo "NEXT_PUBLIC_GIT_VERSION_ID=$GIT_VERSION_ID" >> .env
  fi
}

# Pull the latest changes from the Git repository
echo "Pulling latest changes from Git..."
git pull || { echo "Git pull failed"; exit 1; }

# Add git-hash and timestamp to the .env file
update_git_version

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