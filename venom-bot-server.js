const venom = require('venom-bot');
const express = require('express');
const axios = require('axios');

const app = express();
app.use(express.json());
let venomClient = null;

const HUMANTICS_API_URL = 'https://1f35dcaf-7e96-4df7-b402-2f3030c64013-00-3p314y6gwn25r.worf.replit.dev';

console.log('🚀 Starting Venom-Bot Server...');
console.log('🤖 HumanTic API:', HUMANTICS_API_URL);

venom.create({
  session: 'humantics-session',
  multidevice: true,
  folderNameToken: 'sessions',
  headless: true,
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
  console.log('✅ Venom-Bot connected successfully!');
  
  client.onMessage(async (message) => {
    if (message.fromMe || message.chatId.includes('@g.us')) return;
    
    console.log('📱 New WhatsApp message:', message.body);
    
    try {
      const response = await axios.post(HUMANTICS_API_URL + '/api/mcp/agent/mcp_personalizado_1751833568572/message', {
        message: message.body,
        user_id: 'whatsapp_' + message.from.replace('@c.us', '')
      }, {
        headers: { 'Content-Type': 'application/json' },
        timeout: 5000
      });
      
      const reply = response.data.response || 'Olá! Como posso ajudar você?';
      await client.sendText(message.from, reply);
      console.log('📤 Response sent via WhatsApp');
      
    } catch (error) {
      console.error('❌ Error processing message:', error.message);
      await client.sendText(message.from, 'Olá! Entre em contato conosco: +55 11 950377457');
    }
  });
  
}).catch((error) => {
  console.error('❌ Error creating Venom-Bot:', error);
});

app.get('/status', (req, res) => {
  res.json({
    status: venomClient ? 'connected' : 'disconnected',
    service: 'venom-bot-humantics',
    timestamp: new Date().toISOString()
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🌐 Venom-Bot Server running on port ${PORT}`);
  console.log(`📊 Status: http://localhost:${PORT}/status`);
});