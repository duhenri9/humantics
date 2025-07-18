#!/bin/bash

# Deploy Script para duhenri415

echo "🚀 Iniciando deploy para Docker Hub (duhenri415)..."

# Build das imagens
echo "📦 Building Frontend..."
docker build -f Dockerfile.frontend -t duhenri415/humantics-frontend:latest .

echo "📦 Building Backend..."
docker build -f Dockerfile.backend -t duhenri415/humantics-backend:latest .

# Push para Docker Hub
echo "☁️ Pushing Frontend para Docker Hub..."
docker push duhenri415/humantics-frontend:latest

echo "☁️ Pushing Backend para Docker Hub..."
docker push duhenri415/humantics-backend:latest

echo "✅ Deploy concluído! Imagens disponíveis em:"
echo "   - duhenri415/humantics-frontend:latest"
echo "   - duhenri415/humantics-backend:latest"