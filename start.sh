#!/bin/bash

# NSE Bhavcopy - Quick Start Script for Server Deployment

set -e

echo "🚀 Starting NSE Bhavcopy Deployment..."

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first."
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

# Check if .env file exists
if [ ! -f .env ]; then
    echo "⚠️  .env file not found!"
    echo "📝 Creating .env from .env.example..."
    if [ -f .env.example ]; then
        cp .env.example .env
        echo "✅ .env file created. Please edit it with your actual SMTP credentials."
        echo "   Run: nano .env"
        exit 0
    else
        echo "❌ .env.example not found. Please create .env manually."
        exit 1
    fi
fi

# Create required directories
echo "📁 Creating required directories..."
mkdir -p downloads logs

# Pull the latest image
echo "📥 Pulling Docker image..."
docker pull ghcr.io/bhargavagonugunta/nse_bhavcopy:sha-b53af59

# Stop any existing containers
echo "🛑 Stopping existing containers (if any)..."
docker-compose down 2>/dev/null || true

# Start the service
echo "▶️  Starting NSE Bhavcopy service..."
docker-compose up -d

# Wait a few seconds for the container to start
echo "⏳ Waiting for container to start..."
sleep 5

# Check container status
echo ""
echo "📊 Container Status:"
docker-compose ps

echo ""
echo "✅ Deployment complete!"
echo ""
echo "📝 Useful commands:"
echo "   - View logs:          docker-compose logs -f"
echo "   - Stop service:       docker-compose stop"
echo "   - Restart service:    docker-compose restart"
echo "   - Check status:       docker-compose ps"
echo "   - View downloads:     ls -lah downloads/"
echo ""
