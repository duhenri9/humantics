# COMANDOS PARA EXECUTAR NO DIRETÓRIO humantics-automation

## 1. Criar docker-compose.yml

```bash
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
```

## 2. Criar Dockerfile.venom

```bash
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
```

## 3. Criar package.json

```bash
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
```

## 4. Criar venom-bot-server.js

```bash
cat > venom-bot-server.js << 'EOF'
const venom = require('venom-bot');
const express = require('express');
const axios = require('axios');

const app = express();
app.use(express.json());

let venomClient = null;

const N8N_WEBHOOK_URL = process.env.N8N_WEBHOOK_URL || 'http://n8n:5678/webhook/whatsapp-humantics';
const HUMANTICS_API_URL = process.env.HUMANTICS_API_URL || 'https://1f35dcaf-7e96-4df7-b402-2f3030c64013-00-3p314y6gwn25r.worf.replit.dev';

console.log('🚀 Iniciando Venom-Bot Server...');

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
    ]
  })
  .then((client) => {
    venomClient = client;
    console.log('✅ Venom-Bot conectado com sucesso!');
    startMessageListener();
  })
  .catch((erro) => {
    console.log('❌ Erro ao conectar Venom-Bot:', erro);
  });

function startMessageListener() {
  venomClient.onMessage(async (message) => {
    try {
      if (message.fromMe) return;
      if (message.chatId.includes('@g.us')) return;

      console.log('📱 Nova mensagem:', message.body);

      if (message.type === 'chat' && message.body) {
        await processMessage(message);
      }
    } catch (error) {
      console.error('❌ Erro ao processar mensagem:', error);
    }
  });
}

async function processMessage(message) {
  try {
    const messageData = {
      message: message.body,
      phone: message.from.replace('@c.us', ''),
      from: message.from,
      chatId: message.chatId,
      timestamp: new Date().toISOString(),
      type: 'whatsapp'
    };

    console.log('🔄 Enviando para N8N:', messageData);

    const n8nResponse = await axios.post(N8N_WEBHOOK_URL, messageData, {
      headers: { 'Content-Type': 'application/json' },
      timeout: 10000
    });

    let response = '';
    if (n8nResponse.data && n8nResponse.data.response) {
      response = n8nResponse.data.response;
    } else {
      response = 'Olá! Recebi sua mensagem. Para informações imediatas: +55 11 950377457';
    }

    await venomClient.sendText(message.from, response);
    console.log('📤 Resposta enviada via WhatsApp');

  } catch (error) {
    console.error('❌ Erro ao processar via N8N:', error.message);
    
    try {
      const fallbackResponse = await callHumanTicDirect(message.body, message.from);
      await venomClient.sendText(message.from, fallbackResponse);
      console.log('📤 Resposta fallback enviada');
    } catch (fallbackError) {
      console.error('❌ Erro no fallback:', fallbackError.message);
    }
  }
}

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

app.get('/status', (req, res) => {
  res.json({
    status: venomClient ? 'connected' : 'disconnected',
    service: 'venom-bot-humantics',
    timestamp: new Date().toISOString()
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🌐 Venom-Bot Server rodando na porta ${PORT}`);
});
EOF
```

## 5. Executar o sistema

```bash
# Iniciar containers
docker-compose up -d

# Ver logs do Venom-Bot (para QR Code)
docker-compose logs -f venom-bot

# Ver logs do N8N
docker-compose logs -f n8n
```

## 6. Acessar interfaces

- **N8N**: http://localhost:5678
- **Venom-Bot Status**: http://localhost:3000/status

## 7. Importar workflow no N8N

1. Acesse http://localhost:5678
2. Clique em "Import workflow"
3. Cole o JSON do workflow (n8n-workflow-humantics.json)
4. Ative o workflow

## 8. Workflow N8N (importar este JSON)

```json
{
  "name": "WhatsApp HumanTic Agent",
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
        "jsonHeaders": "{\"Content-Type\": \"application/json\"}",
        "sendBody": true,
        "specifyBody": "json",
        "jsonBody": "={\"message\": \"{{ $json.message }}\", \"user_id\": \"whatsapp_{{ $json.phone }}\"}"
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
        "responseBody": "={\"response\": \"{{ $json.response }}\"}"
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
  }
}
```

## RESULTADO FINAL

✅ **WhatsApp** → **Venom-Bot** → **N8N** → **HumanTic Agent (com LGPD)** → **Resposta automática**

O sistema completo estará funcionando com:
- Agente HumanTic com conformidade LGPD
- Respostas automáticas sobre planos (R$ 835, R$ 1.289, R$ 1.769)
- Integração WhatsApp gratuita via Venom-Bot
- Orquestração via N8N para controle total