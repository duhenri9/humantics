# 🚨 SOLUÇÃO ALTERNATIVA N8N - WEBHOOK PÚBLICO

## Problema Identificado
- HumanTic na porta 5000 está funcionando 100%
- N8N não consegue conectar em localhost:5000
- Erro de conectividade entre n8n e HumanTic

## ✅ SOLUÇÃO: Usar Webhook Público

### Opção 1: Ngrok (Recomendado)
```bash
# Instalar ngrok
npm install -g ngrok

# Expor porta 5000 publicamente
ngrok http 5000
```

Isso vai gerar uma URL pública como:
`https://abc123.ngrok.io`

**URL para n8n:** `https://abc123.ngrok.io/api/webhook/n8n-test`

### Opção 2: Usar IP da máquina
Em vez de `localhost`, tente:
- `http://127.0.0.1:5000/api/webhook/n8n-test`
- `http://0.0.0.0:5000/api/webhook/n8n-test`

### Opção 3: N8N Local
Se o n8n estiver em container Docker:
- `http://host.docker.internal:5000/api/webhook/n8n-test`

## 🔧 CONFIGURAÇÃO N8N (com URL pública)

**HTTP Request Node:**
- URL: `https://SUA-URL-NGROK.ngrok.io/api/webhook/n8n-test`
- Method: POST
- Headers: `{"Content-Type": "application/json"}`
- Body: `{"message": "{{ $json.Body || $json.message || 'teste' }}"}`

**Respond to Webhook:**
- Body: `{{ $json.mcp_response }}`

## ✅ TESTE IMEDIATO

1. Configure ngrok ou use IP direto
2. Teste a nova URL no n8n
3. Deve funcionar instantaneamente

O problema não é no código, é na conectividade localhost do n8n!