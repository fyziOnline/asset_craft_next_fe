#!/bin/bash

# Exit the script immediately if any command fails
set -e

# Change from .scripts to previous directory
cd ..

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
    echo "" >> .env
    echo "NEXT_PUBLIC_GIT_VERSION_ID=$GIT_VERSION_ID" >> .env
  fi
}

# Determine environment based on git branch
BRANCH=$(git rev-parse --abbrev-ref HEAD)
if [ "$BRANCH" = "main" ]; then
    COMPOSE_FILE="docker-compose.prod.yml"
    ENV="production"
    echo "Deploying to PRODUCTION environment"
else
    COMPOSE_FILE="docker-compose.yml"
    ENV="staging"
    echo "Deploying to STAGING environment"
fi

# Pull the latest changes from the Git repository
echo "Pulling latest changes from Git..."
git pull || { echo "Git pull failed"; exit 1; }

# Add git-hash and timestamp to the .env file
update_git_version

# Build the Docker images without cache
echo "Building Docker images"
docker compose -f $COMPOSE_FILE build

# Start the containers in detached mode
echo "Starting containers in detached mode..."
docker compose -f $COMPOSE_FILE up -d

# Clean up unused Docker resources specific to the environment
echo "Removing unused Docker resources..."
docker image prune -f --filter "label=environment=$ENV"
docker container prune -f --filter "label=environment=$ENV"

echo "Process completed successfully!"

exit 0