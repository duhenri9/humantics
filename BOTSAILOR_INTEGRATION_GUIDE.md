# Guia de Integração BotSailor + HumanTic + Chatwoot

## Arquitetura Admin-First

### Fluxo de Criação de Cliente

```
1. Admin acessa HumanTic → /admin/clients/new
2. Admin preenche dados do cliente
3. Sistema cria automaticamente no Chatwoot
4. Admin cria manualmente no BotSailor (limite 15)
5. Admin vincula BotSailor ID no HumanTic
6. Cliente recebe credenciais prontas
```

## Interface Admin para Gerenciar Clientes

### 1. Criar Novo Cliente
```
/admin/clients/new

- Nome completo
- Email corporativo
- Empresa
- Telefone WhatsApp
- Plano contratado
```

### 2. Integração BotSailor
```
/admin/clients/:id/integrations

- Chatwoot ID (automático)
- BotSailor ID (manual)
- BotSailor API Key
- Webhook URL
- Status: Pending → Active
```

## Processo Manual BotSailor

### Passo 1: Criar usuário no BotSailor
1. Acessar painel BotSailor
2. Criar novo usuário whitelabel
3. Configurar limites e permissões
4. Gerar API Key

### Passo 2: Configurar Webhook
```
Webhook URL: https://humantic-api.railway.app/webhook/botsailor
Method: POST
Events: message.received, message.sent
```

### Passo 3: Sincronizar no HumanTic
1. Copiar BotSailor ID e API Key
2. Colar no painel HumanTic
3. Testar conexão
4. Ativar integração

## Campos Customizados Chatwoot

### Adicionar no Chatwoot:
```ruby
# Custom attributes
botsailor_id: string
botsailor_status: enum ['pending', 'active', 'suspended']
botsailor_api_key: encrypted_string
humantic_client_id: string
```

## API Endpoints

### Admin - Criar Cliente
```javascript
POST /api/admin/clients
{
  "fullName": "João Silva",
  "email": "joao@empresa.com",
  "company": "Empresa XYZ",
  "phone": "+5511999999999",
  "plan": "essencial"
}
```

### Admin - Integrar BotSailor
```javascript
PATCH /api/admin/clients/:id/botsailor
{
  "botsailor_id": "bot_xyz789",
  "botsailor_api_key": "key_abc123",
  "webhook_url": "https://..."
}
```

### Webhook - Receber Mensagens
```javascript
POST /webhook/botsailor
{
  "event": "message.received",
  "botsailor_id": "bot_xyz789",
  "from": "+5511999999999",
  "message": "Olá, preciso de ajuda"
}
```

## Dashboard Admin

### Lista de Clientes
```
┌────────────────────────────────────────────┐
│ Clientes HumanTic                          │
├────────────────────────────────────────────┤
│ Nome          | Chatwoot | BotSailor | Ação│
│ João Silva    | ✓        | Pendente  | [+] │
│ Maria Santos  | ✓        | bot_abc   | [✓] │
│ Pedro Lima    | ✓        | bot_xyz   | [✓] │
├────────────────────────────────────────────┤
│ Slots BotSailor: 3/15 usados              │
└────────────────────────────────────────────┘
```

## Monitoramento

### Métricas Importantes
- Total de clientes ativos
- Slots BotSailor usados (X/15)
- Mensagens processadas/dia
- Taxa de resposta do agente

### Alertas
- Próximo do limite BotSailor (13/15)
- Cliente sem atividade há 7 dias
- Falha na conexão BotSailor

## Segurança

### Criptografia
- API Keys armazenadas criptografadas
- Conexão HTTPS obrigatória
- Validação de origem webhook

### Permissões
- Apenas admin cria clientes
- Cliente vê apenas seus dados
- Logs de todas operações

## Troubleshooting

### BotSailor não conecta
1. Verificar API Key
2. Confirmar webhook URL
3. Testar com Postman
4. Ver logs no BotSailor

### Mensagens não chegam
1. Verificar status do cliente
2. Confirmar número WhatsApp
3. Testar webhook manualmente
4. Verificar rate limits