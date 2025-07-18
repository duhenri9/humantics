# Configuração Detalhada: Webhook WhatsApp no N8N

## 🎯 Objetivo
Configurar um webhook no n8n que receba mensagens do WhatsApp e processe com o agente HumanTic.

## 📋 Passo 1: Criar o Webhook (DETALHADO)

### 1.1 Adicionar Node Webhook
1. No n8n, clique no botão **"+"** para adicionar um novo node
2. Na busca, digite **"Webhook"**
3. Clique em **"Webhook"** (ícone de gancho)
4. O node aparecerá na tela

### 1.2 Configurar o Webhook - Aba "Parameters"
Clique no node Webhook e configure:

**HTTP Method:**
- Clique no dropdown
- Selecione **"POST"** (muito importante!)

**Path:**
- Digite: `whatsapp-humanTic`
- Resultado: `http://localhost:5678/webhook/whatsapp-humanTic`

**Authentication:**
- Deixe em **"None"**

**Response:**
- Selecione **"Using 'Respond to Webhook' Node"**

### 1.3 Testar o Webhook
1. Clique em **"Listen for Test Event"** no node Webhook
2. O n8n mostrará uma URL como:
   ```
   http://localhost:5678/webhook-test/whatsapp-humanTic
   ```
3. **COPIE ESTA URL** - vamos usar para testar

### 1.4 Teste Manual do Webhook
Abra o terminal e execute:
```bash
curl -X POST "http://localhost:5678/webhook-test/whatsapp-humanTic" \
  -H "Content-Type: application/json" \
  -d '{
    "Body": "Olá! Preciso de informações sobre os planos",
    "From": "5511999999999",
    "MessageSid": "test123"
  }'
```

**Resultado esperado:**
- O node Webhook deve capturar esta requisição
- Você verá os dados na aba "Executions"

## 📱 Passo 2: Simular Mensagem WhatsApp

### 2.1 Formato de Dados WhatsApp
O webhook receberá dados neste formato:
```json
{
  "Body": "Mensagem do usuário",
  "From": "whatsapp:+5511999999999",
  "MessageSid": "SM1234567890",
  "ProfileName": "João Silva",
  "WaId": "5511999999999"
}
```

### 2.2 Teste com Dados Reais WhatsApp
```bash
curl -X POST "http://localhost:5678/webhook-test/whatsapp-humanTic" \
  -H "Content-Type: application/json" \
  -d '{
    "Body": "Quais são os planos disponíveis?",
    "From": "whatsapp:+5511987654321",
    "MessageSid": "SM9876543210abcdef",
    "ProfileName": "Maria Santos",
    "WaId": "5511987654321",
    "AccountSid": "AC1234567890",
    "MessagingServiceSid": "MG1234567890",
    "NumMedia": "0",
    "MediaContentType0": "",
    "MediaUrl0": "",
    "SmsMessageSid": "SM9876543210abcdef",
    "SmsStatus": "received",
    "ApiVersion": "2010-04-01"
  }'
```

## 🔧 Passo 3: Configurar Node HTTP Request

### 3.1 Adicionar HTTP Request Node
1. Clique em **"+"** novamente
2. Busque por **"HTTP Request"**
3. Adicione o node
4. **Conecte o Webhook ao HTTP Request** (arraste a linha)

### 3.2 Configurar HTTP Request - Detalhado

**Method:**
- Selecione **"POST"**

**URL:**
- Digite: `http://localhost:5000/api/webhook/n8n-test`

**Authentication:**
- Deixe em **"None"**

**Send Body:**
- Marque **"Yes"**

**Body Content Type:**
- Selecione **"JSON"**

**Specify Body:**
- Selecione **"Using Fields Below"**

**JSON Body:**
Clique em **"Add Field"** e configure:
- **Name:** `message`
- **Value:** `{{ $json.Body || $json.message || 'Olá! Como posso ajudar?' }}`

### 3.3 Explicação da Expressão
```javascript
{{ $json.Body || $json.message || 'Olá! Como posso ajudar?' }}
```

**Significado:**
- `$json.Body`: Mensagem vinda do WhatsApp Business API
- `$json.message`: Mensagem vinda de outros sistemas
- `'Olá! Como posso ajudar?'`: Mensagem padrão se nenhuma for encontrada

## 🎯 Passo 4: Processar Resposta

### 4.1 Adicionar Node Set
1. Adicione node **"Set"**
2. Conecte HTTP Request → Set

### 4.2 Configurar Set Node

**Keep Only Set:**
- Marque **"Yes"** (remove outros campos)

**Values to Set:**
Clique **"Add Value"** 3 vezes:

**Value 1:**
- **Name:** `response_text`
- **Value:** `{{ $json.mcp_response }}`

**Value 2:**
- **Name:** `user_phone`
- **Value:** `{{ $json.From || 'unknown' }}`

**Value 3:**
- **Name:** `original_message`
- **Value:** `{{ $json.input_message }}`

## 📤 Passo 5: Responder ao WhatsApp

### 5.1 Adicionar Respond to Webhook
1. Adicione node **"Respond to Webhook"**
2. Conecte Set → Respond to Webhook

### 5.2 Configurar Resposta

**Response Code:**
- Digite: `200`

**Response Body:**
```json
{
  "status": "success",
  "message": "{{ $json.response_text }}",
  "to": "{{ $json.user_phone }}",
  "timestamp": "{{ new Date().toISOString() }}"
}
```

## 🧪 Teste Completo

### Teste 1: Executar Workflow
1. Clique em **"Execute Workflow"** no canto superior direito
2. O workflow deve processar sem erros

### Teste 2: Testar com Curl
```bash
curl -X POST "http://localhost:5678/webhook-test/whatsapp-humanTic" \
  -H "Content-Type: application/json" \
  -d '{
    "Body": "Preciso saber sobre o plano Agenda",
    "From": "whatsapp:+5511987654321",
    "ProfileName": "Teste Usuario"
  }'
```

### Resultado Esperado:
```json
{
  "status": "success",
  "message": "📅 **Plano Agenda** - Automação de Agendamentos...",
  "to": "whatsapp:+5511987654321",
  "timestamp": "2025-07-06T22:30:00.000Z"
}
```

## 🔍 Troubleshooting

### Erro: "Webhook not found"
- Verifique se clicou em "Listen for Test Event"
- Use a URL exata mostrada pelo n8n

### Erro: "Connection refused"
- Confirme que o HumanTic está rodando em `localhost:5000`
- Teste o endpoint MCP diretamente

### Erro: "mcp_response undefined"
- Verifique se o JSON body está correto no HTTP Request
- Confirme que o campo "message" está sendo enviado

## 📱 Conectar WhatsApp Real

### Para Twilio WhatsApp:
- Webhook URL: `http://seu-ngrok.io/webhook/whatsapp-humanTic`
- Método: POST

### Para Venom-Bot:
```javascript
// No seu código Venom-Bot
const webhookUrl = 'http://localhost:5678/webhook/whatsapp-humanTic';

client.onMessage(async (message) => {
  const response = await fetch(webhookUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      Body: message.body,
      From: message.from,
      ProfileName: message.sender.name
    })
  });
  
  const result = await response.json();
  await client.sendText(message.from, result.message);
});
```

## ✅ Validação Final

Seu workflow está correto quando:
1. ✅ Webhook recebe POST requests
2. ✅ HTTP Request chama o MCP corretamente  
3. ✅ Set extrai a resposta MCP
4. ✅ Respond to Webhook retorna a resposta

**O sistema MCP já está funcionando perfeitamente. O problema era apenas a configuração do n8n!**