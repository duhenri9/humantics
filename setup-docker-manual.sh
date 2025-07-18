#!/bin/bash

echo "🚀 Setup HumanTic com Docker (sem compose)"

# Criar rede Docker
echo "📡 Criando rede Docker..."
docker network create humantics-network 2>/dev/null || echo "Rede já existe"

# Criar volumes
echo "💾 Criando volumes..."
docker volume create n8n_data 2>/dev/null || echo "Volume n8n_data já existe"
docker volume create venom_sessions 2>/dev/null || echo "Volume venom_sessions já existe"

# Executar N8N
echo "🔧 Iniciando N8N..."
docker run -d \
  --name n8n \
  --network humantics-network \
  -p 5678:5678 \
  -e N8N_HOST=localhost \
  -e N8N_PORT=5678 \
  -e N8N_PROTOCOL=http \
  -e WEBHOOK_URL=http://localhost:5678 \
  -e GENERIC_TIMEZONE=America/Sao_Paulo \
  -v n8n_data:/home/node/.n8n \
  n8nio/n8n:latest

echo "⏳ Aguardando N8N inicializar..."
sleep 15

# Verificar se N8N está rodando
if curl -s http://localhost:5678/healthz > /dev/null; then
    echo "✅ N8N iniciado com sucesso!"
    echo "🌐 Acesse: http://localhost:5678"
else
    echo "❌ Erro ao iniciar N8N"
    docker logs n8n
fi

echo ""
echo "📋 Próximos passos:"
echo "1. Acesse http://localhost:5678"
echo "2. Crie conta no N8N"
echo "3. Importe workflow: n8n-workflow-humantics-complete.json"
echo "4. Ative o workflow"
echo "5. Copie URL webhook gerada"
echo ""
echo "📱 Para Venom-Bot:"
echo "Execute: bash setup-venom-manual.sh"