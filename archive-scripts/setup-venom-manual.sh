#!/bin/bash

echo "📱 Setup Venom-Bot manual"

# Verificar se N8N está rodando
if ! curl -s http://localhost:5678/healthz > /dev/null; then
    echo "❌ N8N não está rodando. Execute primeiro: bash setup-docker-manual.sh"
    exit 1
fi

# Criar Dockerfile para Venom-Bot
cat > Dockerfile.venom-simple << 'EOF'
FROM node:18-alpine

WORKDIR /app

# Instalar dependências para Puppeteer
RUN apk add --no-cache chromium nss freetype freetype-dev harfbuzz ca-certificates ttf-freefont

# Configurar Puppeteer
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser

# Criar package.json
RUN echo '{"name":"venom-bot-simple","version":"1.0.0","dependencies":{"venom-bot":"^5.0.16","axios":"^1.6.0"}}' > package.json

# Instalar dependências
RUN npm install

# Criar servidor simples
RUN cat > index.js << 'VENOMEOF'
const venom = require('venom-bot');
const axios = require('axios');

let client = null;
const N8N_WEBHOOK = process.env.N8N_WEBHOOK || 'http://n8n:5678/webhook/whatsapp-humantics';

console.log('Iniciando Venom-Bot...');
console.log('N8N Webhook:', N8N_WEBHOOK);

venom.create({
  session: 'humantics',
  multidevice: true,
  headless: true,
  debug: false,
  logQR: true,
  browserArgs: ['--no-sandbox', '--disable-setuid-sandbox']
}).then((venomClient) => {
  client = venomClient;
  console.log('✅ Venom-Bot conectado!');
  
  client.onMessage(async (message) => {
    if (message.fromMe || !message.body) return;
    
    console.log('📨 Mensagem:', message.body, 'De:', message.from);
    
    try {
      const response = await axios.post(N8N_WEBHOOK, {
        message: message.body,
        phone: message.from.replace('@c.us', ''),
        from: message.from
      });
      
      if (response.data && response.data.response) {
        await client.sendText(message.from, response.data.response);
        console.log('✅ Resposta enviada');
      }
    } catch (error) {
      console.error('❌ Erro:', error.message);
      await client.sendText(message.from, 'Olá! Entre em contato: +55 11 950377457');
    }
  });
}).catch(console.error);
VENOMEOF

EXPOSE 3000
CMD ["node", "index.js"]
EOF

# Construir imagem Venom-Bot
echo "🔨 Construindo imagem Venom-Bot..."
docker build -t venom-bot-humantics -f Dockerfile.venom-simple .

# Executar Venom-Bot
echo "📱 Iniciando Venom-Bot..."
docker run -d \
  --name venom-bot \
  --network humantics-network \
  -e N8N_WEBHOOK=http://n8n:5678/webhook/whatsapp-humantics \
  venom-bot-humantics

echo "⏳ Aguardando Venom-Bot conectar..."
sleep 10

# Mostrar QR Code
echo "📱 QR Code para WhatsApp:"
docker logs venom-bot

echo ""
echo "✅ Sistema completo iniciado!"
echo "📋 Status:"
docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"

echo ""
echo "🔍 Para ver QR Code novamente:"
echo "docker logs venom-bot"