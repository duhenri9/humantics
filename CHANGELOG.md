# Changelog - HumanTic Platform

Todas as mudanças importantes do projeto serão documentadas neste arquivo.

## [2.1.0] - 2025-07-18

### Adicionado
- Auditoria completa do banco de dados com mapeamento de 25+ funcionalidades críticas
- Plano de implementação Redis para migração de storage
- Sistema de documentação técnica melhorado
- Status detalhado do projeto em CURRENT_STATUS.md

### Modificado
- Login redirect para `/personalizar-agente` conforme solicitado
- Sistema de recuperação de senha com fallback para email direto
- Documentação atualizada com estado atual da plataforma
- Remoção confirmada do sistema de leads TTL de 7 dias

### Problemas Identificados
- PostgreSQL endpoint desabilitado causando falhas em funcionalidades críticas
- Sistema de autenticação temporariamente indisponível
- Gestão de usuários e pagamentos sem persistência
- MCP Agents funcionando apenas em memória

### Correções em Andamento
- Migração para Redis Cloud/local para resolver persistência
- Implementação transparente via interface IStorage existente
- Manutenção de todas as funcionalidades atuais

## [2.0.0] - 2025-07-18

### Mudanças Principais
- Remoção completa do sistema de leads com TTL 7 dias
- Simplificação para email-only workflow (agenteteste@wm3digital.com.br)
- Remoção da simulação WhatsApp
- Eliminação do storage temporário de 7 dias

### Stripe Integration
- Checkout dinâmico implementado substituindo Payment Links estáticos
- Endpoint `/api/stripe/create-checkout` criado para confiabilidade
- Todos os produtos validados no Stripe (financeiro@wm3digital.com.br)
- Correção do plano "Conversão Avançado" removendo acentos

### Interface Updates
- Mudança de CTAs: "Desbloquear Agente Teste" → "Começar Agora com a HumanTic"
- Hero button: "Ativar meu Agente HumanTic"
- Redirecionamento direto para seção de planos
- Blog styling atualizado com "Tic" em branco

## [1.5.0] - 2025-07-02 a 2025-07-06

### Sistema de Email Completo
- Resend integration com domínio personalizado humantic.wm3digital.com.br
- 8 tipos de email: welcome, payment success/failed, trial expiring, etc.
- Admin oversight automático para info@wm3digital.com.br
- HTML templates responsivos com branding HumanTic

### Sistema de Autenticação
- Migração completa de Supabase para Express.js
- Password hashing com bcrypt
- Sistema de sessões seguro
- Password reset com tokens temporários

### MCP Agents System
- Persistência de agentes no banco de dados
- Sistema de conversas inteligentes
- API endpoints para criação e gestão
- Integração com WhatsApp Business

### Sistema de Pagamentos
- Payment tracking em 2 fases (50% + 50%)
- Webhooks Stripe completos
- Admin management de pagamentos
- Billing automático mensal

## [1.0.0] - 2025-07-02

### Lançamento Inicial
- Migração completa de Bolt para Replit
- Stack: React + Express.js + PostgreSQL + Drizzle ORM
- Interface completa com shadcn/ui
- Sistema de roles (admin/client)
- Integração básica Stripe
- Landing page e blog system

### Arquitetura Base
- Frontend: React 18 + TypeScript + Vite
- Backend: Express.js + TypeScript
- Database: PostgreSQL com Drizzle ORM
- Styling: Tailwind CSS + shadcn/ui
- Branding: Cor oficial #6D7AFF

---

## Tipos de Mudanças
- **Adicionado** para novas funcionalidades
- **Modificado** para mudanças em funcionalidades existentes
- **Removido** para funcionalidades removidas
- **Correções** para bug fixes
- **Segurança** para vulnerabilidades corrigidas