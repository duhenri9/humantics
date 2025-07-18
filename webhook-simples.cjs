const http = require('http');
const url = require('url');

function parseBody(req) {
  return new Promise((resolve) => {
    let body = '';
    req.on('data', chunk => body += chunk.toString());
    req.on('end', () => {
      try {
        resolve(JSON.parse(body));
      } catch {
        resolve({});
      }
    });
  });
}

const server = http.createServer(async (req, res) => {
  const parsedUrl = url.parse(req.url, true);
  
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }
  
  console.log(`📡 [${new Date().toLocaleTimeString()}] ${req.method} ${req.url}`);
  
  if (parsedUrl.pathname === '/webhook' && req.method === 'POST') {
    try {
      const body = await parseBody(req);
      console.log('📥 Body:', JSON.stringify(body, null, 2));
      
      const message = body?.Body || body?.message || body?.text || 'Como posso ajudar?';
      
      const response = {
        success: true,
        response_text: `🤖 HumanTic - Automatização WhatsApp

📋 Nossos Planos:
• Essencial: R$ 835 (ativação) + R$ 195/mês
• Agenda: R$ 1.289 (ativação) + R$ 325/mês  
• Conversão: R$ 1.769 (ativação) + R$ 498/mês

💬 WhatsApp: +55 11 950377457
✉️ Email: humantic@wm3digital.com.br

Sua pergunta: "${message}"`,
        input_message: message,
        timestamp: new Date().toISOString(),
        status: 'processed'
      };
      
      console.log('✅ Enviando resposta HumanTic');
      
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(response));
      
    } catch (error) {
      console.error('❌ Erro:', error);
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: false, error: error.message }));
    }
  } else if (parsedUrl.pathname === '/status') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      status: 'online',
      message: 'Servidor webhook HumanTic funcionando',
      timestamp: new Date().toISOString()
    }));
  } else {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Endpoint não encontrado' }));
  }
});

const PORT = 3001;
server.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Servidor webhook HumanTic rodando na porta ${PORT}`);
  console.log(`📡 URL para n8n: http://localhost:${PORT}/webhook`);
  console.log(`🔧 Status: http://localhost:${PORT}/status`);
});

server.on('error', (error) => {
  console.error('❌ Erro no servidor:', error);
});