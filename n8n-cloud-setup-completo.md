# N8N Cloud + HumanTic - Configuração Completa

## 1. ACESSAR N8N CLOUD

### Passos:
1. Acesse: `https://app.n8n.cloud`
2. Crie conta gratuita
3. Confirme email
4. Entre na interface do N8N

## 2. EXPOR HUMANTIG PUBLICAMENTE

Como N8N Cloud precisa acessar seu localhost, vamos usar um túnel:

### Opção A: Usando npx (sem instalação):
```bash
npx localtunnel --port 5000
```

### Opção B: Se tiver npm global:
```bash
npm install -g localtunnel
lt --port 5000
```

**IMPORTANTE:** Anote a URL que aparecer (ex: `https://abc123.loca.lt`)

## 3. CONFIGURAR WORKFLOW NO N8N CLOUD

### Node 1: Webhook Trigger
1. Arraste "Webhook" para o canvas
2. Configure:
   - **HTTP Method:** POST
   - **Path:** `humantic-support`
   - Salve

### Node 2: HTTP Request
1. Arraste "HTTP Request" para o canvas
2. Configure:
   - **URL:** `https://[SUA_URL_TUNNEL]/api/mcp/agent/mcp_personalizado_1751833568572/message`
   - **Method:** POST
   - **Headers:** 
     ```json
     {
       "Content-Type": "application/json"
     }
     ```
   - **Body (JSON):**
     ```json
     {
       "message": "{{ $json.message || $json.Body || 'Como posso ajudar?' }}",
       "user_id": "{{ $json.phone || $json.From || 'n8n_user' }}",
       "context": {
         "source": "n8n_cloud",
         "phone": "{{ $json.phone || $json.From }}",
         "name": "{{ $json.name || 'Cliente' }}"
       }
     }
     ```

### Node 3: Respond to Webhook
1. Arraste "Respond to Webhook" para o canvas
2. Configure:
   - **Response Code:** 200
   - **Response Body:**
     ```json
     {
       "success": true,
       "response": "{{ $('HTTP Request').item.json.response }}",
       "agent": "HumanTic Support"
     }
     ```

## 4. TESTAR CONFIGURAÇÃO

### Teste 1: Ativar Workflow
1. Clique em "Test workflow"
2. Ative o webhook
3. Anote a URL do webhook gerada pelo N8N

### Teste 2: Teste Manual
Use esta requisição para testar:
```bash
curl -X POST [URL_DO_WEBHOOK_N8N] \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Quais são os planos da HumanTic?",
    "phone": "+5511999999999",
    "name": "Teste Usuario"
  }'
```

## 5. MONITORAMENTO

### Logs HumanTic:
- Verifique console do Replit para confirmar requisições

### Logs N8N:
- Vá em "Executions" no N8N Cloud
- Veja logs detalhados de cada execução

## 6. INTEGRAÇÃO WHATSAPP

### Webhook URL para WhatsApp:
Use a URL do webhook N8N como endpoint do WhatsApp Business API ou Twilio.

### Formato de entrada esperado:
```json
{
  "message": "pergunta do cliente",
  "phone": "+5511999999999", 
  "name": "Nome do Cliente"
}
```

## 7. TROUBLESHOOTING

### Se túnel cair:
1. Execute novamente: `npx localtunnel --port 5000`
2. Atualize URL no HTTP Request do N8N
3. Teste novamente

### Se não conectar:
1. Verifique se HumanTic está rodando (porta 5000)
2. Teste túnel: `curl https://[SUA_URL]/api/mcp/agent/mcp_personalizado_1751833568572/message`
3. Verifique logs N8N Cloud

## 8. VANTAGENS DESTA CONFIGURAÇÃO

✅ **Sem instalação** no Mac
✅ **Interface completa** N8N Cloud  
✅ **Conectividade** via túnel público
✅ **Monitoramento** completo
✅ **Integração WhatsApp** pronta

---

**Próximos passos:**
1. Acesse `https://app.n8n.cloud`
2. Execute `npx localtunnel --port 5000`
3. Configure workflow com URL do túnel