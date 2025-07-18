# SETUP MANUAL HUMANTICS - SEM DOCKER-COMPOSE

## 1. Criar os arquivos manualmente

### A. Criar docker-compose.yml
```yaml
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
```

### B. Criar Dockerfile.venom
```dockerfile
FROM node:18-alpine

WORKDIR /app

RUN apk add --no-cache chromium nss freetype freetype-dev harfbuzz ca-certificates ttf-freefont && rm -rf /var/cache/apk/*

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser

COPY package.json .
RUN npm install
COPY venom-bot-server.js index.js
RUN mkdir -p sessions

EXPOSE 3000
CMD ["node", "index.js"]
```

### C. Criar package.json
```json
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
```

### D. Criar venom-bot-server.js
```javascript
const venom = require('venom-bot');
const express = require('express');
const axios = require('axios');

const app = express();
app.use(express.json());

let venomClient = null;

const N8N_WEBHOOK_URL = process.env.N8N_WEBHOOK_URL || 'http://n8n:5678/webhook/whatsapp-humantics';
const HUMANTICS_API_URL = process.env.HUMANTICS_API_URL || 'https://1f35dcaf-7e96-4df7-b402-2f3030c64013-00-3p314y6gwn25r.worf.replit.dev';

console.log('🚀 Iniciando Venom-Bot Server...');

venom.create({
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
}).then((client) => {
  venomClient = client;
  console.log('✅ Venom-Bot conectado com sucesso!');
  startMessageListener();
}).catch((erro) => {
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
      response = 'Olá! Recebi sua mensagem. Para informações: +55 11 950377457';
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
```

## 2. COMANDOS DOCKER (SEM docker-compose)

### Instalar Docker Desktop primeiro:
1. Baixe: https://www.docker.com/products/docker-desktop/
2. Instale o Docker Desktop
3. Inicie o Docker Desktop

### Depois execute estes comandos:

```bash
# Criar rede
docker network create humantics_network

# Criar volumes
docker volume create n8n_data
docker volume create venom_sessions

# Iniciar N8N
docker run -d \
  --name n8n \
  --network humantics_network \
  -p 5678:5678 \
  -e N8N_HOST=localhost \
  -e N8N_PORT=5678 \
  -e N8N_PROTOCOL=http \
  -e WEBHOOK_URL=http://localhost:5678 \
  -e GENERIC_TIMEZONE=America/Sao_Paulo \
  -v n8n_data:/home/node/.n8n \
  n8nio/n8n:latest

# Construir imagem Venom-Bot
docker build -f Dockerfile.venom -t venom-bot-humantics .

# Iniciar Venom-Bot
docker run -d \
  --name venom-bot \
  --network humantics_network \
  -p 3000:3000 \
  -e N8N_WEBHOOK_URL=http://n8n:5678/webhook/whatsapp-humantics \
  -e HUMANTICS_API_URL=https://1f35dcaf-7e96-4df7-b402-2f3030c64013-00-3p314y6gwn25r.worf.replit.dev \
  -v venom_sessions:/app/sessions \
  venom-bot-humantics

# Ver QR Code do WhatsApp
docker logs -f venom-bot
```

## 3. Acessar interfaces
- N8N: http://localhost:5678
- Venom-Bot Status: http://localhost:3000/status

## 4. Workflow N8N (importar via interface)
- Acesse http://localhost:5678
- Clique em "Import workflow"
- Cole o JSON do arquivo n8n-workflow-humantics.json
- Ative o workflow

## RESULTADO FINAL
WhatsApp → Venom-Bot → N8N → HumanTic Agent (com LGPD) → Resposta automática

O agente responderá sobre planos (R$ 835, R$ 1.289, R$ 1.769) e aplicará LGPD quando necessário.