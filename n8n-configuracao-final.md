# N8N Configuração Final - URL Correta

## PROBLEMA ATUAL
A URL que você está usando não está acessível. Precisamos da URL pública correta do Replit.

## COMO ENCONTRAR A URL CORRETA

### 1. **No Replit, clique no ícone de "compartilhar" ou "share"**
### 2. **Ou clique em "Open in new tab"** 
### 3. **A URL será algo como:**
```
https://rest-express.replit.app
```
**OU**
```
https://xxxxx.replit.dev
```

## CONFIGURAÇÃO N8N COMPLETA

### HTTP Request Node:
```
Method: POST
URL: https://SUA_URL_REPLIT.replit.app/api/mcp/agent/mcp_personalizado_1751833568572/message
```

### Headers:
Clique em "Add Header":
- **Name:** Content-Type
- **Value:** application/json

### Body:
Selecione "JSON" e cole:
```json
{
  "message": "{{ $json.message || $json.Body || 'Olá!' }}",
  "user_id": "whatsapp_{{ $json.phone || $json.From || 'user' }}"
}
```

## TESTE RÁPIDO

### Depois de configurar, teste no N8N com:
```json
{
  "message": "Quero saber sobre os planos",
  "phone": "5511999999999"
}
```

### Resposta esperada:
```json
{
  "success": true,
  "response": "Olá! Temos 3 planos para automatizar seu atendimento: 🔵 Essencial - R$ 835..."
}
```

## ALTERNATIVA: TESTE DIRETO LOCAL

### Se você quiser testar localmente primeiro:
```bash
# Na sua máquina, teste o agente via localhost
curl -X POST "http://localhost:5000/api/mcp/agent/mcp_personalizado_1751833568572/message" \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Teste local",
    "user_id": "test"
  }'
```

### E configure N8N para:
```
URL: http://host.docker.internal:5000/api/mcp/agent/mcp_personalizado_1751833568572/message
```

## PRÓXIMO PASSO

**Me envie a URL que aparece quando você abre o Replit em nova aba.** 

Assim posso confirmar a URL correta e finalizar a configuração do N8N.