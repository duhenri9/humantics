#!/bin/bash

# Script de deploy para containers separados
echo "🚀 HumanTic Docker Deploy - Containers Separados"
echo "=============================================="

# Cores para output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

# Verificar Docker
if ! command -v docker &> /dev/null; then
    echo -e "${RED}❌ Docker não está instalado!${NC}"
    exit 1
fi

if ! command -v docker-compose &> /dev/null; then
    echo -e "${RED}❌ Docker Compose não está instalado!${NC}"
    exit 1
fi

# Menu de opções
echo "Escolha uma opção:"
echo "1) Build containers"
echo "2) Start containers"
echo "3) Stop containers"
echo "4) Restart containers"
echo "5) Ver logs"
echo "6) Status dos containers"
echo "7) Deploy completo (build + start)"

read -p "Opção: " option

case $option in
    1)
        echo -e "${YELLOW}🔨 Building containers...${NC}"
        docker-compose -f docker-compose-separated.yml build
        ;;
    2)
        echo -e "${GREEN}▶️  Starting containers...${NC}"
        docker-compose -f docker-compose-separated.yml up -d
        echo -e "${GREEN}✅ Containers iniciados!${NC}"
        echo ""
        echo "URLs de acesso:"
        echo "- Frontend: http://localhost:8080"
        echo "- Backend API: http://localhost:5000"
        echo "- Chatwoot: http://localhost:3001"
        echo "- N8N: http://localhost:5678"
        echo "- Proxy: http://localhost"
        ;;
    3)
        echo -e "${YELLOW}⏹️  Stopping containers...${NC}"
        docker-compose -f docker-compose-separated.yml down
        ;;
    4)
        echo -e "${YELLOW}🔄 Restarting containers...${NC}"
        docker-compose -f docker-compose-separated.yml restart
        ;;
    5)
        echo "Ver logs de qual container?"
        echo "1) Todos"
        echo "2) Frontend"
        echo "3) Backend"
        echo "4) Redis"
        echo "5) Chatwoot"
        echo "6) N8N"
        read -p "Opção: " log_option
        
        case $log_option in
            1) docker-compose -f docker-compose-separated.yml logs -f ;;
            2) docker-compose -f docker-compose-separated.yml logs -f humantic-frontend ;;
            3) docker-compose -f docker-compose-separated.yml logs -f humantic-backend ;;
            4) docker-compose -f docker-compose-separated.yml logs -f redis ;;
            5) docker-compose -f docker-compose-separated.yml logs -f chatwoot-app ;;
            6) docker-compose -f docker-compose-separated.yml logs -f n8n ;;
        esac
        ;;
    6)
        echo -e "${YELLOW}📊 Status dos containers:${NC}"
        docker-compose -f docker-compose-separated.yml ps
        ;;
    7)
        echo -e "${GREEN}🚀 Deploy completo...${NC}"
        
        # Build
        echo -e "${YELLOW}🔨 Building containers...${NC}"
        docker-compose -f docker-compose-separated.yml build
        
        # Start
        echo -e "${GREEN}▶️  Starting containers...${NC}"
        docker-compose -f docker-compose-separated.yml up -d
        
        # Wait for services
        echo -e "${YELLOW}⏳ Aguardando serviços...${NC}"
        sleep 10
        
        # Check status
        echo -e "${GREEN}📊 Status:${NC}"
        docker-compose -f docker-compose-separated.yml ps
        
        echo -e "${GREEN}✅ Deploy completo!${NC}"
        echo ""
        echo "URLs de acesso:"
        echo "- Frontend: http://localhost:8080"
        echo "- Backend API: http://localhost:5000"
        echo "- Chatwoot: http://localhost:3001"
        echo "- N8N: http://localhost:5678"
        echo "- Proxy: http://localhost"
        ;;
esac