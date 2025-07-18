# Configuração N8N para Agente HumanTic Support (MCP)

## 1. AGENTE DISPONÍVEL
**Agente:** HumanTic Support Agent (mcp_personalizado_1751833568572)
**Endpoint:** `/api/mcp/agent/mcp_personalizado_1751833568572/message`
**URL Completa:** `http://localhost:5000/api/mcp/agent/mcp_personalizado_1751833568572/message`

### Endpoints Alternativos (caso localhost não funcione):
- `http://127.0.0.1:5000/api/mcp/agent/mcp_personalizado_1751833568572/message`
- `http://host.docker.internal:5000/api/mcp/agent/mcp_personalizado_1751833568572/message`

## 2. CONFIGURAÇÃO DO WORKFLOW N8N

### Node 1: HTTP Request Trigger
```json
{
  "httpMethod": "POST",
  "path": "humantic-support",
  "responseMode": "responseNode",
  "options": {}
}
```

### Node 2: HTTP Request (para Agente HumanTic)
**URL:** `http://localhost:5000/api/mcp/agent/mcp_personalizado_1751833568572/message`
**Método:** `POST`
**Headers:**
```json
{
  "Content-Type": "application/json",
  "Accept": "application/json"
}
```

**Body (JSON):**
```json
{
  "message": "{{ $json.message }}",
  "user_id": "{{ $json.user_id || 'whatsapp_user' }}",
  "context": {
    "source": "whatsapp",
    "phone": "{{ $json.phone }}",
    "name": "{{ $json.name }}"
  }
}
```

### Node 3: Response (Resposta ao Cliente)
**Response Code:** `200`
**Response Body:**
```json
{
  "status": "success",
  "response": "{{ $('HTTP Request').item.json.response }}",
  "agent": "HumanTic Support",
  "timestamp": "{{ new Date().toISOString() }}"
}
```

## 3. EXEMPLO DE TESTE MANUAL

### Payload de Teste (para enviar ao n8n):
```json
{
  "message": "Olá! Gostaria de saber sobre os planos da HumanTic",
  "phone": "+5511999887766",
  "name": "João Silva",
  "user_id": "whatsapp_joao_silva"
}
```

### Resposta Esperada do Agente HumanTic:
```json
{
  "status": "success",
  "response": "Olá João! 😊 Que ótimo saber do seu interesse na HumanTic! \n\nTemos 3 planos incríveis:\n\n🔹 **Essencial** - R$ 835 (ideal para começar)\n🔹 **Agenda** - R$ 1.289 (agendamento automático)\n🔹 **Conversão** - R$ 1.769 (vendas avançadas)\n\nTodos com 50% de sinal + 50% após aprovação.\n\nQual tipo de negócio você tem? Assim posso recomendar o melhor plano! 📞 +55 11 950377457",
  "agent_id": "mcp_personalizado_1751833568572",
  "timestamp": "2025-01-07T08:00:00.000Z"
}
```

## 4. CAPACIDADES DO AGENTE HUMANTIG SUPPORT

### Técnicas de Vendas Integradas:
- ✅ **Consultiva:** Faz perguntas sobre o negócio
- ✅ **Urgência:** Demonstra valor imediato 
- ✅ **Benefícios:** Destaca ROI e automação
- ✅ **Objeções:** Responde dúvidas sobre preços/funcionalidades
- ✅ **Fechamento:** Direciona para contato direto

### Conhecimento dos Planos:
- **Essencial:** R$ 835 (captura de leads)
- **Agenda:** R$ 1.289 (agendamento automático) 
- **Conversão:** R$ 1.769 (vendas avançadas)
- **Pagamento:** 50% sinal + 50% após aprovação

## 5. DEBUGGING

### Para testar o agente diretamente:
```bash
curl -X POST http://localhost:5000/api/mcp/agent/mcp_personalizado_1751833568572/message \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Preciso de automação para minha clínica",
    "user_id": "teste_curl",
    "context": {"source": "teste"}
  }'
```

### Response esperado:
```json
{
  "status": "success", 
  "response": "Que excelente escolha! Para clínicas, recomendo o plano **Agenda** (R$ 1.289) que automatiza agendamentos e confirmações. Isso elimina 80% do trabalho manual da recepção! Qual o volume mensal de consultas da sua clínica?",
  "agent_id": "mcp_personalizado_1751833568572"
}
```

## 6. CONFIGURAÇÃO DE CONECTIVIDADE

### Se localhost não funcionar, tente:

1. **Host alternativo:**
   ```
   http://host.docker.internal:5000/api/mcp/agent/mcp_personalizado_1751833568572/message
   ```

2. **Expor porta do Replit publicamente:**
   - Vá em "Webview" → "New Tab" 
   - Use a URL pública + `/api/mcp/agent/mcp_personalizado_1751833568572/message`

## 7. MAPEAMENTO DE CAMPOS WHATSAPP → MCP

| Campo WhatsApp | Campo MCP | Função |
|----------------|-----------|---------|
| message | message | ✅ Pergunta/mensagem do cliente |
| phone | context.phone | ✅ Número para identificação |
| name | context.name | ✅ Nome para personalização |
| user_id | user_id | ✅ ID único da conversa |

## 8. FLUXO COMPLETO

```
WhatsApp → N8N Webhook → Agente HumanTic Support → Resposta com Técnicas de Vendas → N8N → WhatsApp
```

**Vantagem:** Agente já treinado com conhecimento completo dos planos e técnicas de vendas consultivas.

## 9. CONFIGURAÇÃO PRONTA PARA COPIAR

**URL N8N:** Webhook que você criar no n8n
**URL HumanTic:** `http://localhost:5000/api/mcp/agent/mcp_personalizado_1751833568572/message`
**Método:** POST  
**Content-Type:** application/json

**Body Template:**
```json
{
  "message": "{{ $json.message }}",
  "user_id": "{{ $json.user_id || $json.phone }}",
  "context": {
    "source": "whatsapp_n8n",
    "phone": "{{ $json.phone }}",
    "name": "{{ $json.name }}"
  }
}
```

---

**Status Agente:** ✅ 100% Operacional com Técnicas de Vendas
**Tempo de Resposta:** ~1-3ms  
**ID do Agente:** mcp_personalizado_1751833568572