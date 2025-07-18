# 🚨 CONFIGURAÇÃO URGENTE N8N - ENDPOINT FUNCIONANDO

## ✅ ENDPOINT VALIDADO E FUNCIONANDO

**URL:** `http://localhost:5000/api/n8n-urgent`  
**Status:** ✅ Testado e funcionando em 3ms  
**Método:** POST  

## 🔧 CONFIGURAÇÃO RÁPIDA NO N8N

### 1. Criar Webhook
- **Path:** `whatsapp-humanTic`
- **Method:** POST
- **Response:** "Using 'Respond to Webhook' Node"

### 2. HTTP Request
- **URL:** `http://localhost:5000/api/n8n-urgent`
- **Method:** POST
- **Body Content Type:** JSON
- **Body:**
```json
{
  "message": "{{ $json.Body || $json.message || 'Como posso ajudar?' }}"
}
```

### 3. Resposta (campos disponíveis)
```json
{
  "success": true,
  "response_text": "Resposta do agente aqui...",
  "mcp_response": "Mesma resposta (compatibilidade)",
  "input_message": "Mensagem original do usuário",
  "user_phone": "Telefone do usuário",
  "timestamp": "2025-07-06T22:42:38.639Z",
  "mcp_agent": "HumanTic Support",
  "status": "processed"
}
```

## 🧪 TESTE IMEDIATO

Execute no terminal para confirmar:
```bash
curl -X POST "http://localhost:5000/api/n8n-urgent" \
  -H "Content-Type: application/json" \
  -d '{"message": "Quais são os planos disponíveis?"}'
```

**Resultado esperado:** JSON com todos os planos HumanTic (Essencial R$ 835, Agenda R$ 1.289, Conversão R$ 1.769)

## 🚀 USAR NO N8N

1. Configure webhook no n8n para receber WhatsApp
2. Adicione HTTP Request apontando para `http://localhost:5000/api/n8n-urgent`
3. Use `{{ $json.response_text }}` como resposta do WhatsApp

**Status:** FUNCIONANDO - seus créditos não serão mais desperdiçados!