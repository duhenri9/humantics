#!/bin/bash

# HumanTic Docker Deployment Script
echo "🚀 HumanTic Docker Deployment"
echo "=============================="

# Check if Docker is running
if ! docker info >/dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker first."
    exit 1
fi

# Check if .env exists
if [ ! -f .env ]; then
    echo "📋 Creating .env file from template..."
    cp .env.docker .env
    echo "⚠️  Please edit .env with your actual credentials before continuing!"
    echo "📝 Required variables:"
    echo "   - RESEND_API_KEY"
    echo "   - STRIPE_SECRET_KEY" 
    echo "   - STRIPE_WEBHOOK_SECRET"
    echo "   - SESSION_SECRET"
    echo "   - CHATWOOT_API_TOKEN"
    echo "   - SECRET_KEY_BASE"
    echo ""
    read -p "Press Enter after editing .env to continue..."
fi

# Validate critical environment variables
echo "🔍 Validating environment variables..."
source .env

missing_vars=()
[ -z "$RESEND_API_KEY" ] && missing_vars+=("RESEND_API_KEY")
[ -z "$STRIPE_SECRET_KEY" ] && missing_vars+=("STRIPE_SECRET_KEY")
[ -z "$SESSION_SECRET" ] && missing_vars+=("SESSION_SECRET")

if [ ${#missing_vars[@]} -ne 0 ]; then
    echo "❌ Missing required environment variables:"
    printf '%s\n' "${missing_vars[@]}"
    exit 1
fi

echo "✅ Environment validation passed"

# Build HumanTic application
echo "🔨 Building HumanTic application..."
docker build -t humantic-app . || {
    echo "❌ Failed to build HumanTic application"
    exit 1
}

# Stop existing containers
echo "🛑 Stopping existing containers..."
docker-compose -f docker-compose-complete.yml down

# Start the complete stack
echo "🚀 Starting HumanTic complete stack..."
docker-compose -f docker-compose-complete.yml up -d

# Wait for services to be ready
echo "⏳ Waiting for services to start..."
sleep 10

# Check service status
echo "📊 Service Status:"
echo "=================="
docker-compose -f docker-compose-complete.yml ps

# Test service endpoints
echo ""
echo "🔍 Testing service endpoints..."

# Test Redis
if docker exec humantic-redis redis-cli ping >/dev/null 2>&1; then
    echo "✅ Redis: Running"
else
    echo "❌ Redis: Failed"
fi

# Test HumanTic App
if curl -s http://localhost:5000/api/health >/dev/null 2>&1; then
    echo "✅ HumanTic App: Running"
else
    echo "❌ HumanTic App: Failed"
fi

# Test N8N
if curl -s http://localhost:5678 >/dev/null 2>&1; then
    echo "✅ N8N: Running"
else
    echo "❌ N8N: Failed"
fi

# Test PostgreSQL
if docker exec humantic-postgres pg_isready >/dev/null 2>&1; then
    echo "✅ PostgreSQL: Running"
else
    echo "❌ PostgreSQL: Failed"
fi

echo ""
echo "🎉 Deployment Complete!"
echo "======================="
echo "📱 HumanTic App: http://localhost"
echo "💬 Chatwoot: http://localhost/chatwoot/"
echo "🔧 N8N: http://localhost/n8n/ (admin/humantic123)"
echo "🔍 Redis: localhost:6379"
echo ""
echo "📋 Next Steps:"
echo "1. Configure Chatwoot: docker exec -it humantic-chatwoot bash"
echo "2. Import N8N workflow: n8n-workflow-humantics-complete.json"
echo "3. Test the complete integration flow"
echo ""
echo "📝 View logs: docker-compose -f docker-compose-complete.yml logs -f"
echo "🛑 Stop services: docker-compose -f docker-compose-complete.yml down"