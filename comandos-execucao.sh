#!/bin/bash

# Comandos para executar o sistema HumanTic completo
echo "🚀 Iniciando sistema HumanTic completo..."

# Verificar se está no diretório correto
echo "📁 Diretório atual: $(pwd)"

# Executar docker-compose
echo "🐳 Iniciando containers Docker..."
docker-compose -f docker-compose-n8n-venom.yml up -d

# Aguardar containers iniciarem
echo "⏳ Aguardando containers iniciarem..."
sleep 10

# Verificar status
echo "📊 Status dos containers:"
docker-compose -f docker-compose-n8n-venom.yml ps

# Mostrar logs do Venom-Bot para QR Code
echo "📱 Logs do Venom-Bot (para QR Code):"
docker-compose -f docker-compose-n8n-venom.yml logs venom-bot

echo ""
echo "✅ Sistema iniciado!"
echo "🌐 N8N: http://localhost:5678"
echo "📱 Venom-Bot Status: http://localhost:3000/status"
echo ""
echo "📋 Próximos passos:"
echo "1. Acesse http://localhost:5678 e configure N8N"
echo "2. Importe o workflow n8n-workflow-humantics-complete.json"
echo "3. Escaneie o QR Code do WhatsApp nos logs acima"
echo "4. Teste enviando mensagem WhatsApp"