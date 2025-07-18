# N8N Setup Completo para sua Máquina Local

## SETUP N8N COM DOCKER (NA SUA MÁQUINA)

### 1. Execute N8N via Docker
```bash
# Execute este comando no terminal da sua máquina
docker run -it --rm \
  --name n8n \
  -p 5678:5678 \
  -e WEBHOOK_URL=http://localhost:5678 \
  -e N8N_HOST=localhost \
  -e N8N_PORT=5678 \
  -e N8N_PROTOCOL=http \
  -v ~/.n8n:/home/node/.n8n \
  n8nio/n8n
```

### 2. Acesse N8N
- URL: `http://localhost:5678`
- Crie conta (primeira vez)
- Interface completa N8N disponível

### 3. Configurar Túnel para HumanTic (EM REPLIT)
```bash
# Execute no terminal Replit (deixe rodando)
npx localtunnel --port 5000 --subdomain humantic-demo
```

**Isso vai gerar uma URL como:**
```
https://humantic-demo.loca.lt
```

## CONFIGURAÇÃO WORKFLOW N8N

### Workflow: WhatsApp → HumanTic Agent → Resposta

#### Nó 1: Webhook Trigger
```json
{
  "httpMethod": "POST",
  "path": "whatsapp-humantic",
  "responseMode": "responseNode"
}
```

#### Nó 2: Code - Processar WhatsApp
```javascript
// Extrair dados WhatsApp
const message = $json.message || $json.text || '';
const phone = $json.phone || $json.from || '';

// Preparar para HumanTic MCP
return [{
  message: message,
  phone: phone,
  timestamp: new Date().toISOString()
}];
```

#### Nó 3: HTTP Request - HumanTic MCP
```json
{
  "method": "POST",
  "url": "https://humantic-demo.loca.lt/api/mcp/agent/mcp_personalizado_1751833568572/message",
  "headers": {
    "Content-Type": "application/json"
  },
  "body": {
    "message": "={{ $json.message }}",
    "user_id": "whatsapp_{{ $json.phone }}"
  }
}
```

#### Nó 4: Code - Formatar Resposta
```javascript
// Pegar resposta do agente HumanTic
const response = $json.response;

return [{
  text: response,
  phone: $('Webhook').item.json.phone,
  message_type: "text"
}];
```

#### Nó 5: HTTP Request - Enviar WhatsApp
```json
{
  "method": "POST",
  "url": "SUA_API_WHATSAPP_AQUI",
  "headers": {
    "Content-Type": "application/json",
    "Authorization": "Bearer SEU_TOKEN_AQUI"
  },
  "body": {
    "to": "={{ $json.phone }}",
    "text": "={{ $json.text }}"
  }
}
```

#### Nó 6: Respond to Webhook
```json
{
  "statusCode": 200,
  "body": {
    "status": "success",
    "message": "Mensagem processada"
  }
}
```

## TESTE DO SISTEMA

### 1. Testar Agente HumanTic Diretamente
```bash
# Execute no terminal (sua máquina)
curl -X POST https://humantic-demo.loca.lt/api/mcp/agent/mcp_personalizado_1751833568572/message \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Olá, quais são os planos disponíveis?",
    "user_id": "test_user"
  }'
```

**Resposta esperada:**
```json
{
  "response": "Olá! Temos 3 planos de agentes de IA: Essencial (R$ 835), Agenda (R$ 1.289) e Conversão (R$ 1.769). Cada plano..."
}
```

### 2. Testar Webhook N8N
```bash
# URL webhook N8N (após criar workflow)
curl -X POST http://localhost:5678/webhook/whatsapp-humantic \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Preciso de informações sobre agentes",
    "phone": "+5511999999999"
  }'
```

## INTEGRAÇÃO WHATSAPP

### Opções de API WhatsApp:

#### 1. WhatsApp Business API (Meta)
- URL: `https://graph.facebook.com/v18.0/PHONE_NUMBER_ID/messages`
- Token: Meta Business token

#### 2. Z-API (Brasileiro)
- URL: `https://api.z-api.io/instances/SUA_INSTANCIA/token/SEU_TOKEN/send-text`
- Documentação: https://z-api.io

#### 3. Chat-API
- URL: `https://api.chat-api.com/instance/SUA_INSTANCIA/sendMessage`
- Token: Chat-API token

## STATUS DO SISTEMA

### Agente HumanTic ✅
- **ID:** `mcp_personalizado_1751833568572`
- **Conhecimento:** Todos os 3 planos (R$ 835, R$ 1.289, R$ 1.769)
- **Técnicas:** Vendas, qualificação, agendamento
- **Status:** 100% operacional

### URL Teste Direto:
```
https://humantic-demo.loca.lt/api/mcp/agent/mcp_personalizado_1751833568572/message
```

## PRÓXIMOS PASSOS

1. **Execute N8N** na sua máquina: `docker run -it --rm --name n8n -p 5678:5678 n8nio/n8n`
2. **Execute túnel** no Replit: `npx localtunnel --port 5000`
3. **Configure workflow** no N8N com as instruções acima
4. **Teste agente** HumanTic diretamente
5. **Integre WhatsApp** API da sua preferência

**Resultado:** Sistema completo de automação WhatsApp com agente HumanTic inteligente funcionando!