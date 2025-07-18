const venom = require('venom-bot');
const express = require('express');
const axios = require('axios');

const app = express();
app.use(express.json());
let venomClient = null;

const HUMANTICS_API = 'https://1f35dcaf-7e96-4df7-b402-2f3030c64013-00-3p314y6gwn25r.worf.replit.dev';

console.log('🚀 Starting Venom-Bot Server...');

venom.create({
  session: 'humantics-session',
  multidevice: true,
  folderNameToken: 'sessions',
  headless: true,
  logQR: true,
  browserArgs: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
}).then((client) => {
  venomClient = client;
  console.log('✅ WhatsApp connected successfully!');
  
  client.onMessage(async (message) => {
    if (message.fromMe || message.chatId.includes('@g.us')) return;
    
    console.log('📱 Message:', message.body);
    
    try {
      const response = await axios.post(HUMANTICS_API + '/api/mcp/agent/mcp_personalizado_1751833568572/message', {
        message: message.body,
        user_id: 'whatsapp_' + message.from.replace('@c.us', '')
      }, { timeout: 5000 });
      
      const reply = response.data.response || 'Olá! Como posso ajudar?';
      await client.sendText(message.from, reply);
      console.log('📤 Response sent');
      
    } catch (error) {
      console.error('❌ Error:', error.message);
      await client.sendText(message.from, 'Olá! Entre em contato: +55 11 950377457');
    }
  });
  
}).catch((error) => {
  console.error('❌ Venom-Bot error:', error);
});

app.get('/status', (req, res) => {
  res.json({
    status: venomClient ? 'connected' : 'disconnected',
    service: 'venom-bot-humantics'
  });
});

app.listen(3000, () => {
  console.log('🌐 Server running on port 3000');
});