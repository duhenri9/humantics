# HumanTic - AI Agent Management Platform

> Plataforma SaaS para gestão de agentes de IA conversacionais com integração WhatsApp, sistema de pagamentos Stripe e fluxo completo de onboarding de clientes.

## 🚀 Status Atual (18 Julho 2025)

**Operacional:** 70% | **Frontend:** 100% | **Backend:** Storage temporário

### ✅ Funcionalidades Ativas
- Landing page com Stripe checkout dinâmico
- Sistema de blog completo
- Interface de personalização de agentes
- Email service (Resend) configurado
- WhatsApp demo mode
- MCP Agents (memória temporária)

### ⚠️ Temporariamente Indisponível
- Sistema de autenticação (login/signup)
- Gestão de usuários e pagamentos
- Persistência de dados

**Causa:** PostgreSQL endpoint desabilitado  
**Solução:** Migração para Redis em andamento

## 🏗️ Arquitetura

### Stack Principal
- **Frontend:** React 18 + TypeScript + Vite
- **Backend:** Express.js + TypeScript
- **Styling:** Tailwind CSS + shadcn/ui
- **Database:** PostgreSQL (migrando para Redis)
- **Auth:** Sistema customizado com sessões
- **Payments:** Stripe (checkout dinâmico)
- **Email:** Resend com domínio personalizado

### Estrutura do Projeto
```
├── client/                 # Frontend React
│   ├── src/
│   │   ├── components/    # Componentes reutilizáveis
│   │   ├── pages/         # Páginas da aplicação
│   │   ├── services/      # APIs e integrações
│   │   └── context/       # Estado global
├── server/                # Backend Express.js
│   ├── routes.ts         # Rotas da API
│   ├── storage.ts        # Interface de dados
│   └── services/         # Serviços externos
├── shared/               # Schemas compartilhados
└── docs/                 # Documentação
```

## 🔧 Setup de Desenvolvimento

### Pré-requisitos
- Node.js 18+
- NPM ou Yarn
- Conta Stripe
- Conta Resend

### Instalação
```bash
# Clone o repositório
git clone [repository-url]
cd humantics

# Instale dependências
npm install

# Configure variáveis de ambiente
cp .env.example .env

# Inicie o desenvolvimento
npm run dev
```

### Variáveis de Ambiente
```env
# Stripe
STRIPE_PUBLIC_KEY=pk_live_...
STRIPE_SECRET_KEY=sk_live_...

# Email
RESEND_API_KEY=re_...

# Database (Redis migration in progress)
REDIS_URL=redis://username:password@host:port

# App
NODE_ENV=development
```

## 📱 Funcionalidades

### Para Clientes
- **Personalização de Agentes:** Configuração business-specific
- **Dashboard:** Gestão de conta e configurações
- **Sistema de Suporte:** Tickets e solicitações
- **Histórico de Pagamentos:** Transparência financeira completa

### Para Administradores
- **Gestão de Usuários:** CRUD completo de clientes
- **Portal Financeiro:** Métricas de receita e MRR
- **Gestão de Agentes:** Biblioteca técnica MCP
- **Sistema de Suporte:** Atendimento e resolução

### Integrações
- **Stripe:** Pagamentos em 2 fases (50% + 50%)
- **WhatsApp Business:** Automação de conversas
- **Resend:** Sistema de emails transacionais
- **MCP Protocol:** Agentes inteligentes

## 💳 Modelo de Negócio

### Planos Disponíveis
- **Essencial:** R$ 835 (2x R$ 417,50)
- **Agenda:** R$ 1.289 (2x R$ 644,50)  
- **Conversão:** R$ 1.660 (2x R$ 830)

### Fluxo de Pagamento
1. **Fase 1 (50%):** Pagamento inicial via Stripe
2. **Desenvolvimento:** Criação e teste do agente
3. **Fase 2 (50%):** Aprovação e pagamento final
4. **Manutenção:** Billing mensal automático

## 🔒 Segurança e Compliance

### LGPD
- Dados de teste com TTL automático
- Consentimento explícito para coleta
- Política de privacidade transparente

### Segurança
- Autenticação baseada em sessões
- Hashing de senhas com bcrypt
- Validação de entrada com Zod
- Rate limiting nas APIs

## 📖 Documentação

### Arquivos Principais
- [`replit.md`](./replit.md) - Arquitetura completa e changelog
- [`DATABASE_AUDIT_REPORT.md`](./DATABASE_AUDIT_REPORT.md) - Análise de dependências
- [`REDIS_IMPLEMENTATION_PLAN.md`](./REDIS_IMPLEMENTATION_PLAN_UPDATED.md) - Plano de migração
- [`CURRENT_STATUS.md`](./CURRENT_STATUS.md) - Status detalhado

### APIs Principais
```typescript
// Autenticação
POST /api/auth/login
POST /api/auth/signup
POST /api/auth/forgot-password
POST /api/auth/reset-password

// Stripe
POST /api/stripe/create-checkout
POST /api/webhooks/stripe

// Agentes MCP
POST /api/mcp/essencial/teste
POST /api/mcp/agent/:id/message
```

## 🚀 Deploy

### Replit (Atual)
```bash
# O projeto roda automaticamente no Replit
# Workflow: "Start application" executa npm run dev
```

### Produção (Futuro)
- Vercel/Netlify para frontend
- Railway/Render para backend
- Redis Cloud para database
- Stripe webhooks configurados

## 🤝 Contribuição

### Workflow de Desenvolvimento
1. Crie branch feature/nome-funcionalidade
2. Implemente mudanças com testes
3. Atualize documentação relevante
4. Crie PR com descrição detalhada

### Padrões de Código
- TypeScript strict mode
- ESLint + Prettier
- Componentes funcionais React
- Nomenclatura descritiva

## 📞 Suporte

### Contatos
- **Email Técnico:** agenteteste@wm3digital.com.br
- **Email Admin:** info@wm3digital.com.br
- **WhatsApp:** +55 11 950377457

### Links Úteis
- [Portal do Cliente](https://humantic.wm3digital.com.br)
- [Centro de Ajuda](https://humantic.wm3digital.com.br/ajuda)
- [Status da API](https://humantic.wm3digital.com.br/status)

---

**Desenvolvido por:** WM3 Digital  
**Última atualização:** Julho 2025  
**Versão:** 2.1.0