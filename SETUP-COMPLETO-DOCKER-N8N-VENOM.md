# SETUP COMPLETO: Docker + N8N + Venom-Bot + HumanTic

## ARQUIVOS CRIADOS PARA VOCÊ

✅ `docker-compose-n8n-venom.yml` - Orquestração completa
✅ `Dockerfile.venom` - Container Venom-Bot
✅ `package-venom.json` - Dependências Venom
✅ `venom-bot-server.js` - Servidor Venom integrado
✅ `n8n-workflow-humantics-complete.json` - Workflow N8N completo

## EXECUÇÃO NA SUA MÁQUINA

### 1. **Criar estrutura de diretório:**
```bash
mkdir humantics-automation
cd humantics-automation

# Copiar todos os arquivos criados para este diretório
```

### 2. **Executar sistema completo:**
```bash
# Iniciar todos os serviços
docker-compose -f docker-compose-n8n-venom.yml up -d

# Verificar status
docker-compose -f docker-compose-n8n-venom.yml ps
```

### 3. **Acessar interfaces:**

**N8N Interface:**
```
http://localhost:5678
```

**Venom-Bot Status:**
```
http://localhost:3000/status
```

### 4. **Configurar N8N:**

1. Acesse `http://localhost:5678`
2. Crie conta/faça login
3. Importe workflow: copie conteúdo de `n8n-workflow-humantics-complete.json`
4. Ative o workflow
5. Copie URL webhook gerada

### 5. **QR Code WhatsApp:**

```bash
# Ver logs do Venom-Bot para escanear QR Code
docker-compose -f docker-compose-n8n-venom.yml logs venom-bot
```

## FLUXO COMPLETO FUNCIONANDO

### Venom-Bot recebe WhatsApp:
```
Mensagem: "Quero saber sobre os planos"
De: +5511999999999
```

### Venom-Bot → N8N Webhook:
```json
{
  "message": "Quero saber sobre os planos",
  "phone": "5511999999999",
  "from": "+5511999999999@c.us",
  "type": "whatsapp"
}
```

### N8N → HumanTic Agent:
```
POST https://1f35dcaf-7e96-4df7-b402-2f3030c64013-00-3p314y6gwn25r.worf.replit.dev/api/mcp/agent/mcp_personalizado_1751833568572/message
```

### HumanTic Agent Response:
```json
{
  "success": true,
  "response": "Olá! Temos 3 planos para automatizar seu atendimento: 🔵 Essencial - R$ 835..."
}
```

### N8N → Venom-Bot → WhatsApp:
```
Resposta enviada via WhatsApp com todos os detalhes dos planos
```

## MONITORAMENTO

### Logs em tempo real:
```bash
# Todos os serviços
docker-compose -f docker-compose-n8n-venom.yml logs -f

# Apenas Venom-Bot
docker-compose -f docker-compose-n8n-venom.yml logs -f venom-bot

# Apenas N8N
docker-compose -f docker-compose-n8n-venom.yml logs -f n8n
```

### Status endpoints:
```bash
# Venom-Bot status
curl http://localhost:3000/status

# N8N health
curl http://localhost:5678/healthz
```

## TESTE MANUAL

### Enviar mensagem via API:
```bash
curl -X POST http://localhost:3000/send \
  -H "Content-Type: application/json" \
  -d '{
    "phone": "5511999999999",
    "message": "Mensagem de teste da API"
  }'
```

### Testar webhook N8N diretamente:
```bash
curl -X POST "http://localhost:5678/webhook/whatsapp-humantics" \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Teste direto N8N",
    "phone": "5511999999999"
  }'
```

## RESOLUÇÃO DE PROBLEMAS

### Venom-Bot não conecta:
```bash
# Limpar sessões
docker-compose -f docker-compose-n8n-venom.yml down -v
docker-compose -f docker-compose-n8n-venom.yml up -d
```

### N8N não recebe webhooks:
1. Verificar se workflow está ativo
2. Testar URL webhook manualmente
3. Verificar logs do container

### HumanTic Agent não responde:
1. Testar URL diretamente via curl
2. Verificar conectividade container → internet
3. Usar fallback direto no Venom-Bot

## RESULTADO FINAL

**Sistema 100% automatizado:**
- WhatsApp recebe mensagem
- Venom-Bot processa
- N8N orquestra
- HumanTic Agent responde inteligentemente
- Resposta volta via WhatsApp

**Agente HumanTic conhece:**
- Todos os 3 planos (R$ 835, R$ 1.289, R$ 1.769)
- Técnicas de vendas
- Informações de contato
- Qualificação de leads

**Pronto para produção com Docker, N8N, Venom-Bot e agente HumanTic real!**