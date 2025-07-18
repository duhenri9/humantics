const venom = require('venom-bot');
const express = require('express');
const axios = require('axios');

const app = express();
app.use(express.json());
let venomClient = null;

const N8N_WEBHOOK_URL = process.env.N8N_WEBHOOK_URL || 'http://n8n:5678/webhook/whatsapp-humantics';
const HUMANTICS_API_URL = process.env.HUMANTICS_API_URL || 'https://1f35dcaf-7e96-4df7-b402-2f3030c64013-00-3p314y6gwn25r.worf.replit.dev';

console.log('Starting Venom-Bot Server...');

venom.create({
  session: 'humantics-session',
  multidevice: true,
  folderNameToken: 'sessions',
  headless: true,
  logQR: true,
  browserArgs: ['--no-sandbox', '--disable-setuid-sandbox']
}).then((client) => {
  venomClient = client;
  console.log('Venom-Bot connected!');
  
  client.onMessage(async (message) => {
    if (message.fromMe || message.chatId.includes('@g.us')) return;
    
    try {
      const response = await axios.post(HUMANTICS_API_URL + '/api/mcp/agent/mcp_personalizado_1751833568572/message', {
        message: message.body,
        user_id: 'whatsapp_' + message.from.replace('@c.us', '')
      });
      
      await client.sendText(message.from, response.data.response || 'Olá!');
    } catch (error) {
      await client.sendText(message.from, 'Olá! Entre em contato: +55 11 950377457');
    }
  });
}).catch(console.error);

app.get('/status', (req, res) => {
  res.json({ status: venomClient ? 'connected' : 'disconnected' });
});

app.listen(3000, () => console.log('Server running on port 3000'));