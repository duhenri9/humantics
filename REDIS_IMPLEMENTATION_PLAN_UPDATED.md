# PLANO DE IMPLEMENTAÇÃO REDIS - VERSÃO ATUALIZADA

**Data**: 18 de Julho, 2025  
**Objetivo**: Migrar funcionalidades críticas para Redis, excluindo sistema de leads removido

## FUNCIONALIDADES ATUAL DA PLATAFORMA (Baseado em replit.md)

### ✅ Funcionalidades Operacionais (Sem BD)
- **Landing Page**: Funcionando completamente
- **Blog System**: Interface funcional (dados estáticos)
- **WhatsApp Bot**: Sistema demo operacional
- **Email Service**: Configurado e testado
- **Stripe Checkout**: Dynamic checkout sessions funcionando
- **MCP Agents**: Funcionando com storage em memória
- **Form de Personalização**: Envia email para agenteteste@wm3digital.com.br

### ❌ REMOVIDAS da Plataforma (Não migrar para Redis)
- ~~Sistema de Leads com TTL 7 dias~~ → **REMOVIDO**
- ~~Confirmação de email de leads~~ → **REMOVIDO**  
- ~~WhatsApp simulation~~ → **REMOVIDO**
- ~~Temporary storage de 7 dias~~ → **REMOVIDO**

## FUNCIONALIDADES A MIGRAR PARA REDIS (18 funcionalidades)

### 1. **SISTEMA DE AUTENTICAÇÃO** (Prioridade CRÍTICA)
```javascript
// Estruturas Redis
users:email:{email} → {user_data}
users:id:{id} → {user_data}
sessions:{session_id} → {user_id, expires_at}
password_resets:{token} → {user_id, expires_at} // TTL: 1 hora
```

**Funcionalidades:**
- ✅ Login/logout com sessões
- ✅ Registro de novos usuários
- ✅ Reset de senha com token (TTL automático)
- ✅ Verificação de sessão (`/api/auth/me`)

### 2. **GESTÃO DE USUÁRIOS** (Prioridade CRÍTICA)
```javascript
// Admin user management
admin:users:all → [user_ids] // Sorted set
admin:users:by_role:{role} → [user_ids]
```

**Funcionalidades:**
- ✅ Listagem de usuários (admin)
- ✅ Criação/edição/exclusão de usuários
- ✅ Gestão de roles e permissões

### 3. **SISTEMA DE PAGAMENTOS** (Prioridade ALTA)
```javascript
// Payment tracking
payments:user:{user_id} → [payment_history]
payments:pending_phase2 → {sorted_set by due_date}
payments:tracking:{payment_id} → {payment_data}
stripe:customers:{user_id} → {stripe_customer_data}
stripe:subscriptions:{customer_id} → {subscription_data}
```

**Funcionalidades:**
- ✅ Payment tracking (phase1, phase2, monthly)
- ✅ Webhooks Stripe (save payment data)
- ✅ Histórico de pagamentos
- ✅ Admin payment management

### 4. **SISTEMA DE SUPORTE** (Prioridade ALTA)
```javascript
// Client requests/tickets
tickets:id:{ticket_id} → {ticket_data}
tickets:user:{user_id} → [ticket_ids]
tickets:status:{status} → [ticket_ids]
tickets:priority:{priority} → [ticket_ids]
```

**Funcionalidades:**
- ✅ Criação de tickets de suporte
- ✅ Listagem por usuário/admin
- ✅ Gestão de status e prioridades

### 5. **MCP AGENTS PERSISTÊNCIA** (Prioridade MÉDIA)
```javascript
// MCP agents persistent storage
mcp:agents:{mcp_id} → {agent_data}
mcp:agents:active → [active_agent_ids]
mcp:agents:user:{user_id} → [agent_ids]
mcp:conversations:{mcp_id} → [message_history]
```

**Funcionalidades:**
- ✅ Persistência de agentes MCP
- ✅ Histórico de conversas
- ✅ Load agents on server restart

### 6. **BLOG SYSTEM** (Prioridade BAIXA - Opcional)
```javascript
// Blog data (if needed for admin)
blog:posts:{post_id} → {post_data}
blog:categories → [category_data]
blog:authors → [author_data]
```

## ESTRUTURA DE IMPLEMENTAÇÃO

### Fase 1: Setup Redis (15 min)
```bash
# Instalar Redis client
npm install redis @types/redis

# Configurar conexão Redis
REDIS_URL=redis://username:password@host:port
```

### Fase 2: RedisStorage Implementation (30 min)
```typescript
// server/storage/RedisStorage.ts
export class RedisStorage implements IStorage {
  private redis: RedisClient;
  
  async healthCheck(): Promise<boolean>
  async getUser(id: string): Promise<User | undefined>
  async getUserByEmail(email: string): Promise<User | undefined>
  async createUser(user: InsertUser): Promise<User>
  async updateUser(id: string, updates: Partial<User>): Promise<User>
  // ... todos os métodos do IStorage
}
```

### Fase 3: Migração Transparente (20 min)
```typescript
// server/storage.ts - substituir apenas uma linha
import { RedisStorage } from './storage/RedisStorage.js';
export const storage = new RedisStorage(); // Era: new DatabaseStorage()
```

### Fase 4: Otimizações Redis (25 min)
- TTL automático para password resets (1 hora)
- Índices para consultas frequentes
- Pub/Sub para notificações real-time
- Cache inteligente para dashboard metrics

## VANTAGENS DO REDIS vs PostgreSQL

### ✅ Performance
- **10x mais rápido** para reads/writes
- **Estruturas nativas** (sorted sets, hashes, lists)
- **TTL automático** (password resets)
- **Pub/Sub integrado** (notificações)

### ✅ Simplicidade
- **Zero migrations** - estruturas flexíveis
- **JSON nativo** - sem mapeamento ORM
- **Atomic operations** - contadores, locks
- **Backup simples** - dump/restore Redis

### ✅ Confiabilidade
- **Sem dependência** de endpoints Replit/Neon
- **Controle total** da sua instância Redis
- **Dados persistentes** (diferente de memória atual)
- **Replication ready** para alta disponibilidade

## DADOS PRESERVADOS vs REMOVIDOS

### ✅ **PRESERVAR** (Migrar para Redis)
- **Users** - todos os dados de usuários e auth
- **Payment Tracking** - histórico e status de pagamentos
- **Client Requests** - tickets de suporte
- **MCP Agents** - agentes persistentes
- **Stripe Integration** - customers e subscriptions
- **Sessions** - autenticação de usuários

### ❌ **NÃO MIGRAR** (Funcionalidades removidas)
- ~~Leads table~~ - Removido da plataforma
- ~~Email confirmations~~ - Agora apenas email direto
- ~~Temporary storage~~ - Não existe mais
- ~~WhatsApp simulation~~ - Removido completamente

## ESTIMATIVA ATUALIZADA

### Tempo Total: **1h30min**
| Fase | Tempo | Funcionalidades |
|------|-------|----------------|
| Setup Redis | 15 min | Conexão e configuração |
| RedisStorage | 30 min | Implementar interface completa |
| Migração | 20 min | Trocar storage transparentemente |
| Otimizações | 25 min | TTL, cache, pub/sub |

### Funcionalidades Recuperadas: **18 críticas**
- ✅ Authentication (4 funcionalidades)
- ✅ User Management (3 funcionalidades) 
- ✅ Payment System (4 funcionalidades)
- ✅ Support System (3 funcionalidades)
- ✅ MCP Persistence (2 funcionalidades)
- ✅ Stripe Integration (2 funcionalidades)

## DECISÃO REQUERIDA

**Opção 1: Redis Cloud** (Recomendado)
- Setup mais rápido (5 min)
- Managed service
- Alta disponibilidade

**Opção 2: Redis Local**
- Mais controle
- Configuração manual

**Posso começar imediatamente?** A migração será transparente - todas as funcionalidades voltarão a funcionar, mas com performance superior e sem problemas de conectividade.