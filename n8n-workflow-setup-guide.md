# Guia Definitivo: Workflow N8N para HumanTic MCP

## 🎯 Objetivo
Criar um workflow n8n que processe mensagens via WhatsApp e responda usando o agente HumanTic MCP.

## 📋 Pré-requisitos
- N8N instalado e rodando
- HumanTic MCP Server rodando em `localhost:5000`
- WhatsApp Business API ou Venom-Bot configurado

## 🔧 Configuração Passo a Passo

### Passo 1: Criar Novo Workflow
1. Abra o n8n
2. Clique em "New Workflow"
3. Nome: "HumanTic WhatsApp Assistant"

### Passo 2: Adicionar Webhook (Entrada)
1. Busque e adicione node "Webhook"
2. Configurações:
   - **HTTP Method**: `POST`
   - **Path**: `whatsapp-humanatic`
   - **Response Mode**: `Using 'Respond to Webhook' Node`
   - **Authentication**: `None`

### Passo 3: Configurar HTTP Request (MCP)
1. Adicione node "HTTP Request"
2. Conecte ao Webhook
3. Configurações:
   - **Method**: `POST`
   - **URL**: `http://localhost:5000/api/webhook/n8n-test`
   - **Authentication**: `None`
   - **Send Body**: `Yes`
   - **Body Content Type**: `JSON`
   - **Specify Body**: `Using Fields Below`

4. **Body Parameters**:
   ```json
   {
     "message": "{{ $json.Body || $json.message || 'Olá! Preciso de ajuda' }}"
   }
   ```

### Passo 4: Processar Resposta MCP
1. Adicione node "Set"
2. Conecte ao HTTP Request
3. Configurações:
   - **Keep Only Set**: `Yes`
   - **Values to Set**:
     - **Name**: `response_text`
     - **Value**: `{{ $json.mcp_response || 'Erro no processamento' }}`
     - **Name**: `original_message`
     - **Value**: `{{ $json.input_message }}`
     - **Name**: `status`
     - **Value**: `{{ $json.status }}`

### Passo 5: Responder ao WhatsApp
1. Adicione node "Respond to Webhook"
2. Conecte ao Set
3. Configurações:
   - **Response Code**: `200`
   - **Response Body**: 
   ```json
   {
     "status": "success",
     "response": "{{ $json.response_text }}",
     "original_message": "{{ $json.original_message }}"
   }
   ```

## 🧪 Teste do Workflow

### Teste 1: Ativar Webhook
1. Clique em "Listen for Test Event" no node Webhook
2. Copie a URL gerada (ex: `http://localhost:5678/webhook-test/whatsapp-humanatic`)

### Teste 2: Enviar Requisição de Teste
```bash
curl -X POST "http://localhost:5678/webhook-test/whatsapp-humanatic" \
  -H "Content-Type: application/json" \
  -d '{"message": "Quais são os planos disponíveis?"}'
```

### Teste 3: Verificar Resposta
Você deve receber:
```json
{
  "status": "success",
  "response": "Olá! Sou o assistente da HumanTic 🤖\n\nTemos 3 planos...",
  "original_message": "Quais são os planos disponíveis?"
}
```

## 🔍 Troubleshooting

### Problema: "Webhook not registered for GET"
- **Solução**: Certifique-se que o método está configurado como POST

### Problema: "Connection refused"
- **Solução**: Verifique se o HumanTic MCP está rodando em `localhost:5000`

### Problema: "mcp_response undefined"
- **Solução**: Verifique se o body está sendo enviado corretamente

## 📱 Integração WhatsApp

### Para WhatsApp Business API:
```json
{
  "messaging_product": "whatsapp",
  "to": "{{ $json.from }}",
  "type": "text",
  "text": {
    "body": "{{ $json.response_text }}"
  }
}
```

### Para Venom-Bot:
```json
{
  "chatId": "{{ $json.from }}",
  "message": "{{ $json.response_text }}"
}
```

## ✅ Validação Final

Execute estes testes para confirmar que tudo funciona:

1. **Teste de Planos**: "Quais são os planos?"
2. **Teste de Agendamento**: "Como funciona o agendamento?"
3. **Teste de Contato**: "Quero falar com um humano"
4. **Teste de Preços**: "Quanto custa o plano Essencial?"

## 🚀 Produção

### URL de Produção:
- Desenvolvimento: `http://localhost:5000/api/webhook/n8n-test`
- Produção: `https://seu-dominio.com/api/webhook/n8n-test`

### Monitoramento:
- Logs do HumanTic: Console do servidor Express
- Logs do N8N: Executions tab
- Performance: Tempo de resposta < 100ms

## 🔧 Configuração Avançada

### Adicionar Timeout:
- No HTTP Request: `Timeout: 5000ms`

### Adicionar Retry:
- `Retry on Fail: Yes`
- `Max Retries: 3`

### Adicionar Logging:
```json
{
  "timestamp": "{{ new Date().toISOString() }}",
  "webhook_id": "{{ $json.webhook_id }}",
  "message": "{{ $json.message }}",
  "response_length": "{{ $json.response_text.length }}"
}
```

---

**💡 Dica**: Comece com este workflow básico e adicione funcionalidades conforme necessário. O sistema MCP está funcionando perfeitamente - o problema era apenas a configuração do n8n.