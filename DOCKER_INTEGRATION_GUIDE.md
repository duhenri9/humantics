# HumanTic Docker Integration Guide

## Overview

Este guia explica como integrar o projeto HumanTic atual com seu ambiente Docker que já possui Redis e Chatwoot configurados.

## Arquitetura Docker Completa

### Serviços Incluídos
- **HumanTic App**: Frontend React + Backend Express.js
- **Redis**: Base de dados em memória (já existente)
- **Chatwoot**: Sistema de atendimento (já existente)
- **N8N**: Automação de workflows
- **Venom-Bot**: Integração WhatsApp
- **Nginx**: Reverse proxy e load balancer
- **PostgreSQL**: Database para Chatwoot

## Passos de Instalação

### 1. Preparar Arquivos de Configuração

```bash
# Copiar o arquivo de ambiente
cp .env.docker .env

# Editar as variáveis necessárias
nano .env
```

### 2. Configurar Variáveis de Ambiente

Edite o arquivo `.env` com suas credenciais:

```bash
# EMAIL
RESEND_API_KEY=re_seu_api_key_aqui

# STRIPE
STRIPE_SECRET_KEY=sk_live_seu_stripe_key_aqui
STRIPE_WEBHOOK_SECRET=whsec_seu_webhook_secret_aqui

# SESSIONS
SESSION_SECRET=sua_chave_secreta_super_forte_aqui

# CHATWOOT
CHATWOOT_API_TOKEN=seu_chatwoot_api_token_aqui
SECRET_KEY_BASE=sua_chatwoot_secret_key_base_aqui
```

### 3. Build e Deploy

```bash
# Build da aplicação HumanTic
docker build -t humantic-app .

# Deploy do stack completo
docker-compose -f docker-compose-complete.yml up -d

# Verificar status dos containers
docker-compose -f docker-compose-complete.yml ps
```

### 4. Configuração Inicial do Chatwoot

```bash
# Acessar container do Chatwoot
docker exec -it humantic-chatwoot bash

# Rodar migrações
rails db:create
rails db:migrate

# Criar conta admin
rails c
# No console Rails:
# user = User.create!(name: 'Admin', email: 'admin@wm3digital.com.br', password: 'admin123')
# account = Account.create!(name: 'HumanTic')
# AccountUser.create!(user: user, account: account, role: 'administrator')
```

### 5. Configuração do N8N

1. Acesse: http://localhost:5678
2. Login: admin / humantic123
3. Importe o workflow: `n8n-workflow-humantics-complete.json`
4. Configure webhook URL: `http://humantic-app:5000/api/webhook/n8n-test`

## Integração com Redis Existente

### Configuração do Storage

O sistema agora usa Redis como storage principal com as seguintes configurações:

```typescript
// server/config/redis.ts
const redisConfig = {
  host: process.env.REDIS_HOST || 'redis',
  port: parseInt(process.env.REDIS_PORT || '6379'),
  url: process.env.REDIS_URL || 'redis://redis:6379'
};
```

### Storage Interface

```typescript
// server/simple-redis-storage.ts - Já configurado para Redis
class SimpleRedisStorage implements IStorage {
  private redis: Redis;
  
  constructor(redis: Redis) {
    this.redis = redis;
  }
  
  // Métodos para usuários, leads, agentes MCP, etc.
}
```

## Integração com Chatwoot Existente

### Service de Integração

```typescript
// server/integrations/chatwoot.ts
class ChatwootService {
  // Criar leads automaticamente no Chatwoot
  async createLeadFromHumantic(leadData) {
    // Implementação completa disponível
  }
  
  // Atualizar conversões
  async updateContactConversion(contactId, conversionData) {
    // Implementação completa disponível  
  }
}
```

### Fluxo de Integração

1. **Lead criado no HumanTic** → Automaticamente criado no Chatwoot
2. **Conversão de pagamento** → Atualizado no Chatwoot com dados do plano
3. **Mensagens WhatsApp** → Sincronizadas via N8N

## URLs de Acesso

Após o deploy, os serviços estarão disponíveis em:

- **HumanTic App**: http://localhost (porta 80)
- **Chatwoot**: http://localhost/chatwoot/
- **N8N**: http://localhost/n8n/ (admin/humantic123)
- **Redis**: localhost:6379
- **Venom-Bot**: localhost:3002

## Monitoramento e Logs

```bash
# Ver logs de todos os serviços
docker-compose -f docker-compose-complete.yml logs -f

# Ver logs específicos
docker-compose -f docker-compose-complete.yml logs -f humantic-app
docker-compose -f docker-compose-complete.yml logs -f chatwoot-web
docker-compose -f docker-compose-complete.yml logs -f redis

# Verificar saúde dos containers
docker-compose -f docker-compose-complete.yml ps
```

## Backup e Restore

### Redis Backup
```bash
# Backup Redis
docker exec humantic-redis redis-cli BGSAVE
docker cp humantic-redis:/data/dump.rdb ./backup/

# Restore Redis  
docker cp ./backup/dump.rdb humantic-redis:/data/
docker restart humantic-redis
```

### PostgreSQL Backup (Chatwoot)
```bash
# Backup PostgreSQL
docker exec humantic-postgres pg_dump -U chatwoot chatwoot > backup/chatwoot.sql

# Restore PostgreSQL
docker exec -i humantic-postgres psql -U chatwoot -d chatwoot < backup/chatwoot.sql
```

## Segurança

### Configuração SSL

1. Adicione certificados na pasta `./ssl/`
2. Descomente seção SSL no `nginx.conf`
3. Reinicie o Nginx: `docker restart humantic-nginx`

### Autenticação N8N

- Basic Auth configurado no Nginx
- Usuário: admin
- Senha: humantic123

## Troubleshooting

### Container não inicia
```bash
# Verificar logs
docker logs humantic-app

# Verificar configuração
docker exec -it humantic-app env | grep REDIS
```

### Redis não conecta
```bash
# Testar conexão Redis
docker exec -it humantic-redis redis-cli ping

# Verificar rede
docker network ls
docker network inspect humantic_humantic_network
```

### Chatwoot não acessa
```bash
# Verificar status PostgreSQL
docker exec humantic-postgres pg_isready

# Verificar logs Chatwoot
docker logs humantic-chatwoot
```

## Próximos Passos

1. Configure as variáveis de ambiente com suas credenciais reais
2. Execute o deploy: `docker-compose -f docker-compose-complete.yml up -d`
3. Configure o Chatwoot conforme instruções acima
4. Importe o workflow N8N
5. Teste o fluxo completo: Lead → Chatwoot → Conversão

O sistema estará totalmente integrado com seu Redis e Chatwoot existentes, mantendo toda a funcionalidade do HumanTic operacional.