# N8N Configuração Definitiva - HumanTic Agent

## URL PÚBLICA CONFIRMADA ✅
```
https://1f35dcaf-7e96-4df7-b402-2f3030c64013-00-3p314y6gwn25r.worf.replit.dev/
```

## CONFIGURAÇÃO N8N COMPLETA

### Nó HTTP Request:
```
Method: POST
URL: https://1f35dcaf-7e96-4df7-b402-2f3030c64013-00-3p314y6gwn25r.worf.replit.dev/api/mcp/agent/mcp_personalizado_1751833568572/message
```

### Headers:
```
Content-Type: application/json
Accept: application/json
```

### Body (JSON):
```json
{
  "message": "{{ $json.message || $json.Body || $json.text || 'Olá!' }}",
  "user_id": "whatsapp_{{ $json.phone || $json.From || 'user' }}"
}
```

## TESTE IMEDIATO NO N8N

### Execute com este payload:
```json
{
  "message": "Quero saber sobre o plano Agenda",
  "phone": "5511999999999"
}
```

### Resposta esperada:
```json
{
  "success": true,
  "response": "Olá! O plano Agenda custa R$ 1.289 (ativação) + R$ 325/mês e inclui tudo do Essencial + agendamento automático Google Calendar, reduz no-shows em 70%, confirmações e lembretes automáticos..."
}
```

## WORKFLOW COMPLETO N8N

### 1. Webhook Trigger
- Path: `whatsapp-humantic`
- Method: POST

### 2. HTTP Request (HumanTic Agent)
- URL: `https://1f35dcaf-7e96-4df7-b402-2f3030c64013-00-3p314y6gwn25r.worf.replit.dev/api/mcp/agent/mcp_personalizado_1751833568572/message`
- Method: POST
- Body: JSON com message e user_id

### 3. Respond to Webhook
- Response: `{{ $json.response }}`

## INTEGRAÇÃO WHATSAPP

### Após N8N funcionar, integre com:

#### Z-API (Brasileiro):
```
POST https://api.z-api.io/instances/SUA_INSTANCIA/token/SEU_TOKEN/send-text
{
  "phone": "{{ $json.phone }}",
  "message": "{{ $json.response }}"
}
```

#### Chat-API:
```
POST https://api.chat-api.com/instance/SUA_INSTANCIA/sendMessage
{
  "chatId": "{{ $json.phone }}@c.us",
  "body": "{{ $json.response }}"
}
```

## RESULTADO FINAL

**Input WhatsApp:**
```
"Preciso de informações sobre agentes de IA"
```

**Output Agente HumanTic:**
```
"Olá! Temos 3 planos para automatizar seu atendimento:
🔵 Essencial - R$ 835 + R$ 195/mês
🟣 Agenda - R$ 1.289 + R$ 325/mês  
🟢 Conversão - R$ 1.769 + R$ 498/mês
Qual seu tipo de negócio?"
```

## PRÓXIMO PASSO

1. Configure o HTTP Request no N8N com a URL acima
2. Teste com o payload fornecido
3. Confirme que recebe resposta do agente HumanTic
4. Integre com sua API WhatsApp preferida

**Sistema 100% operacional e pronto para automação WhatsApp!**