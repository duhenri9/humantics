# HumanTic - Documentação Consolidada

## Visão Geral
Plataforma SaaS para gestão de agentes de IA conversacionais, integração WhatsApp, Chatwoot (CRM), BotSailor e pagamentos Stripe.

---

## Arquitetura Final

### Local (Docker)
- humantic-frontend:80 (React + Nginx)
- humantic-backend:5000 (Express.js)
- redis:6379 (Storage)
- chatwoot-app:3001 (CRM)
- postgres:5432 (Chatwoot DB)
- nginx-proxy:80 (Load balancer)

### Produção
- Frontend: humantic.wm3digital.com.br (Hostinger)
- Backend: humantic-api.railway.app (Railway)
- Redis: Redis Cloud (gratuito)
- Chatwoot: Chatwoot API

---

## Fluxo de Integração (Lead → Chatwoot → BotSailor)
1. Admin faz cadastro no HumanTic
2. Lead criado automaticamente no Chatwoot (ID único)
3. Admin recebe notificação no Chatwoot
4. Admin cria manualmente usuário no BotSailor
5. Admin atualiza Chatwoot com ID BotSailor
6. Sistema sincroniza automaticamente

---

## Setup e Deploy

### Pré-requisitos
- Node.js 18+
- Docker
- Conta Stripe, Resend, Chatwoot, BotSailor

### Setup Local
```bash
# Instalar dependências
npm install
# Subir containers
sudo docker-compose up -d
```

### Deploy Produção
- Frontend: build estático para Hostinger
- Backend: deploy Railway
- Redis: Redis Cloud
- Chatwoot: SaaS/API

---

## Endpoints REST - Integração Chatwoot/BotSailor

### Criar Lead no Chatwoot
POST /api/leads
```json
{
  "name": "Nome do Lead",
  "email": "lead@email.com",
  "phone": "+5511999999999"
}
```

### Atualizar Lead com BotSailor ID
PATCH /api/leads/:chatwootId
```json
{
  "botsailor_id": "id_gerado_botsailor",
  "botsailor_status": "active"
}
```

### Sincronizar Status BotSailor
POST /api/integrations/botsailor/sync
```json
{
  "chatwoot_id": "123456",
  "botsailor_id": "id_gerado_botsailor"
}
```

---

## Estrutura Recomendada de Pastas
```
client/           # Frontend React
  src/
    components/
    pages/
    services/
    context/
server/           # Backend Express.js
  routes.ts
  storage.ts
  integrations/
    chatwoot.ts
    botsailor.ts
  services/
shared/           # Schemas compartilhados
```

---

## Observações
- Consolidar guias e remover arquivos/documentação duplicada.
- Manter apenas uma implementação por funcionalidade.
- Atualizar variáveis de ambiente conforme ambiente (local/prod).
