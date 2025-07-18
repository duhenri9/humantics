# N8N - Configuração Passo a Passo HumanTic

## ✅ SOLUÇÃO CONFIRMADA FUNCIONANDO

URL testada e aprovada: `http://localhost:5000/api/webhook/n8n-test`

---

## 📋 CONFIGURAÇÃO NO N8N

### 1. HTTP Request Node (Primeira caixa)

**Configurações básicas:**
- **Method:** POST
- **URL:** `http://localhost:5000/api/webhook/n8n-test`

**Headers (Cabeçalhos):**
Na seção "Headers", clique em "+ Add Header":
- **Name:** Content-Type
- **Value:** application/json

**Body (Corpo da requisição):**
Na seção "Body" escolha "JSON" e cole este conteúdo:
```json
{
  "message": "{{ $json.Body || $json.message || 'Como posso ajudar?' }}"
}
```

### 2. Respond to Webhook Node (Segunda caixa)

**Body da resposta:**
Na seção "Response Body", coloque:
```
{{ $json.mcp_response }}
```

---

## 🔧 CONFIGURAÇÃO VISUAL NO N8N

### Headers (onde aplicar Content-Type):

1. No HTTP Request Node
2. Procure por "Headers" ou "Cabeçalhos"
3. Clique em "+ Add Header" ou "Adicionar Cabeçalho"
4. Campo 1 (Name/Nome): `Content-Type`
5. Campo 2 (Value/Valor): `application/json`

### Body JSON (onde aplicar o JSON):

1. No HTTP Request Node
2. Procure por "Body" ou "Corpo"
3. Selecione tipo "JSON"
4. Cole o código JSON acima

---

## 📤 EXEMPLO DE RESPOSTA

Quando funcionar, você receberá algo assim:
```json
{
  "status": "success",
  "method": "POST",
  "message": "Webhook com MCP funcionando",
  "input_message": "Quais são os planos da HumanTic?",
  "mcp_response": "Olá! Sou o assistente da HumanTic 🤖\n\nTemos 3 planos para automatizar seu atendimento:\n\n🔵 **Essencial** - R$ 835 (ativação) + R$ 195/mês\n• Atendimento 24/7 via WhatsApp...",
  "timestamp": "2025-07-06T23:01:27.398Z"
}
```

---

## ✅ TESTE RÁPIDO

Antes de configurar o WhatsApp, teste apenas o HTTP Request:

1. Configure apenas o HTTP Request Node
2. Execute o teste
3. Deve retornar informações dos planos HumanTic
4. Se funcionar, adicione o Respond to Webhook

---

## 🚨 TROUBLESHOOTING

Se não funcionar:
1. Verifique se a URL está exata: `http://localhost:5000/api/webhook/n8n-test`
2. Confirme que o Header Content-Type está como `application/json`
3. Verifique se o Body está em formato JSON
4. Teste apenas o HTTP Request primeiro

---

## 🎯 RESULTADO ESPERADO

Quando configurado corretamente:
- N8N recebe mensagem do WhatsApp
- Envia para HumanTic
- Recebe resposta inteligente sobre planos
- Responde automaticamente no WhatsApp

**Status:** Sistema 100% testado e funcionando!