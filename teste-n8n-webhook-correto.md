# Teste N8N Webhook - Configuração Correta

## PROBLEMA IDENTIFICADO
O webhook está funcionando, mas você está testando com GET em vez de POST.

## CORREÇÃO IMEDIATA

### 1. Teste Correto via cURL (sua máquina):
```bash
# Use POST em vez de GET
curl -X POST "SUA_URL_WEBHOOK_N8N_AQUI" \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Quais planos vocês têm?",
    "phone": "5511999999999"
  }'
```

### 2. URL do HumanTic para N8N:
```
https://41292b265e1927dbce8df8dc4e7b61825edde82a713d6192a247e75d6e655b82-5000.csb.app/api/mcp/agent/mcp_personalizado_1751833568572/message
```

### 3. Configuração N8N HTTP Request Node:
```
Method: POST
URL: https://41292b265e1927dbce8df8dc4e7b61825edde82a713d6192a247e75d6e655b82-5000.csb.app/api/mcp/agent/mcp_personalizado_1751833568572/message
Headers: {"Content-Type": "application/json"}
Body: {"message": "{{ $json.message }}", "user_id": "whatsapp_{{ $json.phone }}"}
```

## TESTE COMPLETO

### 1. Primeiro teste o agente HumanTic diretamente:
```bash
curl -X POST "https://41292b265e1927dbce8df8dc4e7b61825edde82a713d6192a247e75d6e655b82-5000.csb.app/api/mcp/agent/mcp_personalizado_1751833568572/message" \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Quero saber sobre o plano Essencial",
    "user_id": "test_user"
  }'
```

### 2. Depois teste o webhook N8N:
```bash
curl -X POST "SUA_URL_WEBHOOK_N8N" \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Quero saber sobre o plano Essencial",
    "phone": "5511999999999"
  }'
```

## RESPOSTA ESPERADA

O agente HumanTic deve responder algo como:
```json
{
  "success": true,
  "response": "Olá! O plano Essencial custa R$ 835 (ativação) + R$ 195/mês e inclui atendimento 24/7 via WhatsApp, respostas automáticas inteligentes e suporte contínuo...",
  "agent_info": {
    "name": "HumanTic Assistant",
    "type": "support"
  }
}
```

## NEXT STEPS

1. Configure o HTTP Request no N8N com a URL correta
2. Teste com POST (não GET)
3. Verifique se recebe resposta do agente HumanTic
4. Integre com sua API WhatsApp preferida

O sistema está funcionando - só precisa da configuração correta!