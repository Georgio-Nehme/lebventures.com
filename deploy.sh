#!/bin/bash
set -e

# === CONFIGURATION ===
ECR_REGISTRY="242618236763.dkr.ecr.eu-central-1.amazonaws.com"
REGION="eu-central-1"
COMPOSE_FILE="docker-compose.prod.yml"
ENV_FILE=".env.prod"

echo "🚀 Starting LebVentures deployment"

# === STEP 1: Authenticate with ECR ===
echo "🔐 Authenticating to ECR..."
aws ecr get-login-password --region $REGION | \
  docker login --username AWS --password-stdin $ECR_REGISTRY

# === STEP 2: Pull latest images ===
echo "📥 Pulling latest images..."
docker compose -f $COMPOSE_FILE --env-file $ENV_FILE pull

# === STEP 3: Restart services with new images ===
echo "♻️  Restarting services..."
docker compose -f $COMPOSE_FILE --env-file $ENV_FILE up -d --remove-orphans

# === STEP 4: Clean up old unused images ===
echo "🧹 Cleaning up old images..."
docker image prune -f

echo "✅ Deployment complete."
docker compose -f $COMPOSE_FILE --env-file $ENV_FILE ps
