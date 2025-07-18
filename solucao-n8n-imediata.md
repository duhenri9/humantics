# Solução N8N Imediata - Sem Instalação

## SITUAÇÃO ATUAL
- Mac sem permissões administrativas
- HumanTic rodando na porta 5000 ✅
- Agente MCP funcionando perfeitamente ✅
- Precisa conectar N8N ao agente

## SOLUÇÃO: N8N CLOUD + TÚNEL

### PASSO 1: Abrir N8N Cloud
1. Acesse: `https://app.n8n.cloud`
2. Clique "Sign up for free"
3. Use email corporativo ou pessoal
4. Confirme email e faça login

### PASSO 2: Expor HumanTic via Túnel
Execute no terminal do Mac:
```bash
npx localtunnel --port 5000
```

**Resultado esperado:**
```
your url is: https://abc123.loca.lt
```

**Copie essa URL!** (será algo como `https://abc123.loca.lt`)

### PASSO 3: Configurar Workflow N8N

#### Node 1: Webhook
- Arraste "Webhook" para canvas
- Configure:
  - Method: POST
  - Path: `humantic-support`
- Salve

#### Node 2: HTTP Request
- Arraste "HTTP Request" 
- Configure:
  - **URL:** `https://[SUA_URL_TUNNEL]/api/mcp/agent/mcp_personalizado_1751833568572/message`
  - **Method:** POST
  - **Headers:**
    ```json
    {
      "Content-Type": "application/json"
    }
    ```
  - **Body:**
    ```json
    {
      "message": "{{ $json.message }}",
      "user_id": "{{ $json.phone || 'n8n' }}",
      "context": {
        "source": "n8n_cloud",
        "phone": "{{ $json.phone }}"
      }
    }
    ```

#### Node 3: Respond to Webhook
- Arraste "Respond to Webhook"
- Configure:
  - Response Code: 200
  - Body: `{{ $('HTTP Request').item.json.response }}`

### PASSO 4: Testar
1. Ative workflow (botão "Test workflow")
2. Copie URL do webhook gerada
3. Teste com curl:
```bash
curl -X POST [URL_WEBHOOK_N8N] \
  -H "Content-Type: application/json" \
  -d '{"message": "Quais são os planos?"}'
```

## VANTAGENS DESTA SOLUÇÃO

✅ **Zero instalação** no Mac
✅ **Sem permissões admin** necessárias
✅ **Interface completa** N8N
✅ **Conectividade garantida** via túnel
✅ **Pronto para WhatsApp** Business API

## SE TÚNEL CAIR

Execute novamente:
```bash
npx localtunnel --port 5000
```

Atualize URL no HTTP Request do N8N.

---

**Esta é a solução mais rápida sem instalar nada no seu Mac!**