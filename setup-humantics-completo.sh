#!/bin/bash

echo "🚀 Setup HumanTic Completo - Docker + N8N + Venom-Bot"

# Criar diretório se não existir
mkdir -p humantics-automation
cd humantics-automation

# Criar docker-compose.yml
cat > docker-compose.yml << 'EOF'
version: '3.8'

services:
  n8n:
    image: n8nio/n8n:latest
    container_name: n8n
    ports:
      - "5678:5678"
    environment:
      - N8N_HOST=localhost
      - N8N_PORT=5678
      - N8N_PROTOCOL=http
      - WEBHOOK_URL=http://localhost:5678
      - N8N_EDITOR_BASE_URL=http://localhost:5678
      - GENERIC_TIMEZONE=America/Sao_Paulo
    volumes:
      - n8n_data:/home/node/.n8n
    networks:
      - humantics_network

  venom-bot:
    build:
      context: .
      dockerfile: Dockerfile.venom
    container_name: venom-bot
    ports:
      - "3000:3000"
    environment:
      - N8N_WEBHOOK_URL=http://n8n:5678/webhook/whatsapp-humantics
      - HUMANTICS_API_URL=https://1f35dcaf-7e96-4df7-b402-2f3030c64013-00-3p314y6gwn25r.worf.replit.dev
    volumes:
      - venom_sessions:/app/sessions
    depends_on:
      - n8n
    networks:
      - humantics_network

volumes:
  n8n_data:
  venom_sessions:

networks:
  humantics_network:
    driver: bridge
EOF

# Criar Dockerfile para Venom-Bot
cat > Dockerfile.venom << 'EOF'
FROM node:18-alpine

WORKDIR /app

# Instalar dependências do sistema para Puppeteer
RUN apk add --no-cache \
    chromium \
    nss \
    freetype \
    freetype-dev \
    harfbuzz \
    ca-certificates \
    ttf-freefont \
    && rm -rf /var/cache/apk/*

# Configurar Puppeteer para usar Chromium instalado
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser

# Copiar package.json
COPY package.json .

# Instalar dependências
RUN npm install

# Copiar código fonte
COPY venom-bot-server.js index.js

# Criar diretório para sessões
RUN mkdir -p sessions

EXPOSE 3000

CMD ["node", "index.js"]
EOF

# Criar package.json
cat > package.json << 'EOF'
{
  "name": "venom-bot-humantics",
  "version": "1.0.0",
  "description": "Venom-Bot integrado com HumanTic Agent via N8N",
  "main": "index.js",
  "scripts": {
    "start": "node index.js"
  },
  "dependencies": {
    "venom-bot": "^5.0.16",
    "express": "^4.18.2",
    "axios": "^1.6.0",
    "qrcode-terminal": "^0.12.0"
  },
  "engines": {
    "node": ">=16.0.0"
  }
}
EOF

# Criar servidor Venom-Bot
cat > venom-bot-server.js << 'EOF'
const venom = require('venom-bot');
const express = require('express');
const axios = require('axios');

const app = express();
app.use(express.json());

let venomClient = null;

// URLs de configuração
const N8N_WEBHOOK_URL = process.env.N8N_WEBHOOK_URL || 'http://n8n:5678/webhook/whatsapp-humantics';
const HUMANTICS_API_URL = process.env.HUMANTICS_API_URL || 'https://1f35dcaf-7e96-4df7-b402-2f3030c64013-00-3p314y6gwn25r.worf.replit.dev';

console.log('🚀 Iniciando Venom-Bot Server...');
console.log('📡 N8N Webhook:', N8N_WEBHOOK_URL);
console.log('🤖 HumanTic API:', HUMANTICS_API_URL);

// Inicializar Venom-Bot
venom
  .create({
    session: 'humantics-session',
    multidevice: true,
    folderNameToken: 'sessions',
    headless: true,
    devtools: false,
    useChrome: true,
    debug: false,
    logQR: true,
    browserArgs: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-accelerated-2d-canvas',
      '--no-first-run',
      '--no-zygote',
      '--disable-gpu'
    ],
    disableWelcome: false,
    updatesLog: true,
    autoClose: 60000,
    createPathFileToken: true,
  })
  .then((client) => {
    venomClient = client;
    console.log('✅ Venom-Bot conectado com sucesso!');
    startMessageListener();
  })
  .catch((erro) => {
    console.log('❌ Erro ao conectar Venom-Bot:', erro);
  });

// Listener de mensagens
function startMessageListener() {
  venomClient.onMessage(async (message) => {
    try {
      // Ignorar mensagens próprias
      if (message.fromMe) return;
      
      // Ignorar mensagens de grupos (opcional)
      if (message.chatId.includes('@g.us')) return;

      console.log('📱 Nova mensagem recebida:', {
        from: message.from,
        body: message.body,
        type: message.type
      });

      // Processar apenas mensagens de texto
      if (message.type === 'chat' && message.body) {
        await processMessage(message);
      }
    } catch (error) {
      console.error('❌ Erro ao processar mensagem:', error);
    }
  });
}

// Processar mensagem via N8N → HumanTic
async function processMessage(message) {
  try {
    // Preparar dados para N8N
    const messageData = {
      message: message.body,
      phone: message.from.replace('@c.us', ''),
      from: message.from,
      chatId: message.chatId,
      timestamp: new Date().toISOString(),
      type: 'whatsapp'
    };

    console.log('🔄 Enviando para N8N:', messageData);

    // Enviar para N8N
    const n8nResponse = await axios.post(N8N_WEBHOOK_URL, messageData, {
      headers: { 'Content-Type': 'application/json' },
      timeout: 10000
    });

    console.log('✅ Resposta do N8N:', n8nResponse.data);

    // Extrair resposta
    let response = '';
    if (n8nResponse.data && n8nResponse.data.response) {
      response = n8nResponse.data.response;
    } else if (n8nResponse.data && typeof n8nResponse.data === 'string') {
      response = n8nResponse.data;
    } else {
      response = 'Olá! Recebi sua mensagem e em breve retornarei. Para informações imediatas, ligue: +55 11 950377457';
    }

    // Enviar resposta via WhatsApp
    await venomClient.sendText(message.from, response);
    console.log('📤 Resposta enviada via WhatsApp');

  } catch (error) {
    console.error('❌ Erro ao processar via N8N:', error.message);
    
    // Fallback: chamar HumanTic diretamente
    try {
      const fallbackResponse = await callHumanTicDirect(message.body, message.from);
      await venomClient.sendText(message.from, fallbackResponse);
      console.log('📤 Resposta fallback enviada');
    } catch (fallbackError) {
      console.error('❌ Erro no fallback:', fallbackError.message);
      await venomClient.sendText(message.from, 
        'Olá! Estamos com dificuldades técnicas momentâneas. Por favor, entre em contato via: +55 11 950377457'
      );
    }
  }
}

// Fallback direto para HumanTic
async function callHumanTicDirect(message, from) {
  const response = await axios.post(
    `${HUMANTICS_API_URL}/api/mcp/agent/mcp_personalizado_1751833568572/message`,
    {
      message: message,
      user_id: `whatsapp_${from.replace('@c.us', '')}`
    },
    {
      headers: { 'Content-Type': 'application/json' },
      timeout: 5000
    }
  );

  return response.data.response || 'Olá! Como posso ajudar você hoje?';
}

// Endpoint para status
app.get('/status', (req, res) => {
  res.json({
    status: venomClient ? 'connected' : 'disconnected',
    service: 'venom-bot-humantics',
    timestamp: new Date().toISOString(),
    n8n_webhook: N8N_WEBHOOK_URL,
    humantics_api: HUMANTICS_API_URL
  });
});

// Endpoint para enviar mensagem manualmente
app.post('/send', async (req, res) => {
  try {
    const { phone, message } = req.body;
    
    if (!venomClient) {
      return res.status(503).json({ error: 'WhatsApp não conectado' });
    }

    const chatId = phone.includes('@c.us') ? phone : `${phone}@c.us`;
    await venomClient.sendText(chatId, message);
    
    res.json({ success: true, message: 'Mensagem enviada' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Iniciar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🌐 Venom-Bot Server rodando na porta ${PORT}`);
  console.log(`📊 Status: http://localhost:${PORT}/status`);
  console.log(`📤 Send: http://localhost:${PORT}/send`);
});

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('🛑 Encerrando Venom-Bot...');
  if (venomClient) {
    await venomClient.close();
  }
  process.exit(0);
});
EOF

# Criar workflow N8N
cat > n8n-workflow-humantics.json << 'EOF'
{
  "name": "WhatsApp → HumanTic Agent → Venom-Bot",
  "nodes": [
    {
      "parameters": {
        "path": "whatsapp-humantics",
        "responseMode": "responseNode",
        "options": {}
      },
      "type": "n8n-nodes-base.webhook",
      "typeVersion": 2,
      "position": [240, 300],
      "id": "webhook-whatsapp",
      "name": "WhatsApp Webhook"
    },
    {
      "parameters": {
        "method": "POST",
        "url": "https://1f35dcaf-7e96-4df7-b402-2f3030c64013-00-3p314y6gwn25r.worf.replit.dev/api/mcp/agent/mcp_personalizado_1751833568572/message",
        "sendHeaders": true,
        "specifyHeaders": "json",
        "jsonHeaders": "{\"Content-Type\": \"application/json\", \"Accept\": \"application/json\"}",
        "sendBody": true,
        "specifyBody": "json",
        "jsonBody": "={\"message\": \"{{ $json.message || $json.body || $json.Body || 'Olá!' }}\", \"user_id\": \"whatsapp_{{ $json.phone || $json.from || 'user' }}\"}",
        "options": {
          "timeout": 10000,
          "response": {
            "response": {
              "neverError": true,
              "responseFormat": "json"
            }
          }
        }
      },
      "type": "n8n-nodes-base.httpRequest",
      "typeVersion": 4.2,
      "position": [460, 300],
      "id": "humantics-agent",
      "name": "HumanTic Agent"
    },
    {
      "parameters": {
        "respondWith": "json",
        "responseBody": "={\n  \"status\": \"success\",\n  \"response\": \"{{ $json.response }}\",\n  \"phone\": \"{{ $json.phone }}\",\n  \"agent\": \"HumanTic Assistant\",\n  \"timestamp\": \"{{ new Date().toISOString() }}\"\n}",
        "options": {}
      },
      "type": "n8n-nodes-base.respondToWebhook",
      "typeVersion": 1.4,
      "position": [680, 300],
      "id": "respond-webhook",
      "name": "Respond Webhook"
    }
  ],
  "connections": {
    "WhatsApp Webhook": {
      "main": [
        [
          {
            "node": "HumanTic Agent",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "HumanTic Agent": {
      "main": [
        [
          {
            "node": "Respond Webhook",
            "type": "main",
            "index": 0
          }
        ]
      ]
    }
  },
  "pinData": {},
  "settings": {
    "executionOrder": "v1"
  },
  "static_data": null,
  "tags": [],
  "triggerCount": 0,
  "updatedAt": "2025-07-07T11:00:00.000Z",
  "versionId": "1"
}
EOF

echo ""
echo "✅ Todos os arquivos criados em: $(pwd)"
echo ""
echo "📋 Próximos passos:"
echo "1. Execute: docker-compose up -d"
echo "2. Acesse N8N: http://localhost:5678"
echo "3. Importe workflow: n8n-workflow-humantics.json"
echo "4. Veja QR Code: docker-compose logs venom-bot"
echo ""
echo "🚀 Sistema completo: Docker + N8N + Venom-Bot + HumanTic Agent!"