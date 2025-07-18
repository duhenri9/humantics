#!/usr/bin/env node

const express = require('express');
const cors = require('cors');
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Log todas as requisições
app.use((req, res, next) => {
  console.log(`📡 [${new Date().toLocaleTimeString()}] ${req.method} ${req.url}`);
  console.log('📥 Body:', JSON.stringify(req.body, null, 2));
  next();
});

// Endpoint para n8n
app.all('/webhook', (req, res) => {
  try {
    const message = req.body?.Body || req.body?.message || req.body?.text || 'Olá! Como posso ajudar?';
    
    // Resposta HumanTic simplificada para teste
    const response = {
      success: true,
      response_text: `🤖 HumanTic - Automatização WhatsApp

📋 Nossos Planos:
• Essencial: R$ 835 + R$ 195/mês
• Agenda: R$ 1.289 + R$ 325/mês  
• Conversão: R$ 1.769 + R$ 498/mês

💬 WhatsApp: +55 11 950377457
✉️ Email: humantic@wm3digital.com.br

Pergunta recebida: "${message}"`,
      input_message: message,
      timestamp: new Date().toISOString(),
      status: 'processed'
    };
    
    console.log('✅ Respondendo com:', response.response_text.substring(0, 100) + '...');
    res.json(response);
    
  } catch (error) {
    console.error('❌ Erro:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Endpoint de teste
app.get('/status', (req, res) => {
  res.json({
    status: 'online',
    message: 'Servidor n8n funcionando',
    timestamp: new Date().toISOString(),
    endpoints: {
      'POST /webhook': 'Endpoint principal para n8n',
      'GET /status': 'Status do servidor'
    }
  });
});

const PORT = 3001;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Servidor n8n rodando na porta ${PORT}`);
  console.log(`📡 URL para n8n: http://localhost:${PORT}/webhook`);
  console.log(`🔧 Status: http://localhost:${PORT}/status`);
  console.log(`💡 Teste: curl -X POST http://localhost:${PORT}/webhook -H "Content-Type: application/json" -d '{"message":"teste"}'`);
});

// Tratamento de erros
process.on('uncaughtException', (error) => {
  console.error('❌ Erro não capturado:', error);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Promise rejeitada:', reason);
});