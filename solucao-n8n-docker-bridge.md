# Solução N8N + HumanTic via Docker Bridge

## PROBLEMA ATUAL
- N8N na sua máquina (localhost:5678)
- HumanTic no Replit (sem localhost access)
- Túneis instáveis

## SOLUÇÃO: Docker Network Bridge

### 1. **Execute N8N com Network Bridge**
```bash
# Pare o N8N atual se estiver rodando
docker stop n8n

# Execute N8N com host network
docker run -it --rm \
  --name n8n \
  --network host \
  -p 5678:5678 \
  -e WEBHOOK_URL=http://host.docker.internal:5678 \
  -v ~/.n8n:/home/node/.n8n \
  n8nio/n8n
```

### 2. **Configure URL no N8N HTTP Request**

**No nó "HTTP Request", use uma destas URLs:**

#### Opção A - IP Público Replit:
```
https://41292b265e1927dbce8df8dc4e7b61825edde82a713d6192a247e75d6e655b82-5000.csb.app/api/mcp/agent/mcp_personalizado_1751833568572/message
```

#### Opção B - Ngrok (se você tiver):
```bash
# No terminal separado (sua máquina)
ngrok http https://41292b265e1927dbce8df8dc4e7b61825edde82a713d6192a247e75d6e655b82-5000.csb.app
```

#### Opção C - Replit Public URL:
```
https://humantic-test.replit.dev/api/mcp/agent/mcp_personalizado_1751833568572/message
```

### 3. **JSON Body Correto**
```json
{
  "message": "{{ $json.Body || $json.message || $json.text || 'Olá!' }}",
  "user_id": "whatsapp_{{ $json.From || $json.phone || 'user' }}"
}
```

### 4. **Headers Necessários**
```json
{
  "Content-Type": "application/json",
  "Accept": "application/json"
}
```

## TESTE DIRETO VIA REPLIT URL

### Encontrar URL Pública do Replit:
1. No Replit, clique em "Open in new tab"
2. Copie a URL (algo como `https://xxx-5000.csb.app`)
3. Use essa URL + `/api/mcp/agent/mcp_personalizado_1751833568572/message`

### Teste Manual:
```bash
# Substitua XXX pela sua URL Replit
curl -X POST https://XXX-5000.csb.app/api/mcp/agent/mcp_personalizado_1751833568572/message \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Quais são os planos?",
    "user_id": "test_user"
  }'
```

## WORKFLOW N8N COMPLETO

### Nó 1: Webhook
- Path: `whatsapp-humantic`
- Response Mode: Response Node

### Nó 2: HTTP Request
- Method: POST
- URL: `https://SUA_URL_REPLIT/api/mcp/agent/mcp_personalizado_1751833568572/message`
- Headers: `{"Content-Type": "application/json"}`
- Body: `{"message": "{{ $json.message }}", "user_id": "whatsapp_{{ $json.phone }}"}`

### Nó 3: Respond to Webhook
- Response: `{{ $json.response }}`

## RESULTADO ESPERADO

**Input:**
```json
{
  "message": "Quero saber sobre planos",
  "phone": "5511999999999"
}
```

**Output:**
```json
{
  "success": true,
  "response": "Olá! Temos 3 planos para automatizar seu atendimento: 🔵 Essencial - R$ 835..."
}
```

**VANTAGEM:** Conexão direta, sem túneis instáveis, usando URL pública do Replit!