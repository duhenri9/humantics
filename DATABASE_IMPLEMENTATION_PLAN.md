# PLANO DE IMPLEMENTAÇÃO - RESOLUÇÃO DO BANCO DE DADOS

**Data**: 18 de Julho, 2025  
**Objetivo**: Restaurar funcionalidades dependentes do PostgreSQL e garantir operação completa da plataforma

## FASE 1: DIAGNÓSTICO E CONECTIVIDADE (15 min)

### 1.1 Verificação de Status
- [ ] **Verificar status do banco no Replit**
  - Confirmar se DATABASE_URL está configurado
  - Testar conectividade básica com `psql`
  - Verificar se o endpoint PostgreSQL está ativo

- [ ] **Análise de Logs de Erro**
  - Investigar "Control plane request failed: endpoint is disabled"
  - Verificar se é problema temporário do Neon/Replit
  - Confirmar configurações de rede

### 1.2 Testes de Conectividade
```bash
# Comandos de verificação
echo $DATABASE_URL
npm run db:push
psql $DATABASE_URL -c "SELECT version();"
```

**Resultado Esperado**: Conexão estabelecida ou identificação clara do problema

## FASE 2: RECUPERAÇÃO DO BANCO DE DADOS (30 min)

### 2.1 Criação/Reativação do Banco
- [ ] **Se banco não existir**: Criar novo PostgreSQL via Replit
- [ ] **Se banco existir**: Reativar endpoint desabilitado
- [ ] **Configurar variáveis de ambiente**
  - DATABASE_URL
  - PGHOST, PGPORT, PGUSER, PGPASSWORD, PGDATABASE

### 2.2 Deploy do Schema
```bash
# Aplicar schema completo
npm run db:push

# Verificar estrutura criada
psql $DATABASE_URL -c "\dt"
```

**Tabelas a serem criadas (8 tabelas)**:
- ✅ `users` - Sistema de autenticação
- ✅ `leads` - Gestão de prospects
- ✅ `stripe_customers` - Integração Stripe
- ✅ `stripe_subscriptions` - Assinaturas Stripe
- ✅ `payment_tracking` - Controle de pagamentos
- ✅ `client_requests` - Sistema de suporte
- ✅ `mcp_agents` - Persistência de agentes
- ✅ `blog_posts` - Sistema de blog

### 2.3 Verificação de Integridade
- [ ] **Confirmar criação de todas as tabelas**
- [ ] **Testar operações básicas CRUD**
- [ ] **Validar constraints e relacionamentos**

## FASE 3: RESTAURAÇÃO DA AUTENTICAÇÃO (20 min)

### 3.1 Testes de Login Sistema
- [ ] **Criar usuário admin de teste**
```sql
INSERT INTO users (email, password, full_name, role) 
VALUES ('admin@wm3digital.com.br', '$2b$10$hash...', 'Admin WM3', 'admin');
```

- [ ] **Testar endpoints de auth**
```bash
# Teste de login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "admin@wm3digital.com.br", "password": "test123"}'

# Teste de sessão
curl -X GET http://localhost:5000/api/auth/me -H "Cookie: sessionId=..."
```

### 3.2 Sistema de Recuperação de Senha
- [ ] **Testar forgot password**
- [ ] **Validar envio de email**  
- [ ] **Confirmar reset password com token**

**Resultado Esperado**: Sistema de auth 100% operacional

## FASE 4: RESTAURAÇÃO DE FUNCIONALIDADES CRÍTICAS (30 min)

### 4.1 Sistema de Leads
- [ ] **Testar captura de leads**
```bash
curl -X POST http://localhost:5000/api/leads/with-email \
  -H "Content-Type: application/json" \
  -d '{
    "nomeCompleto": "João Teste",
    "nomeNegocio": "Empresa Teste",
    "diferencial": "Diferencial único",
    "email": "joao@teste.com"
  }'
```

- [ ] **Validar confirmação por email**
- [ ] **Testar redirecionamento para personalização**

### 4.2 Sistema de Pagamentos
- [ ] **Validar webhooks do Stripe**
```bash
# Simular webhook de pagamento
curl -X POST http://localhost:5000/api/webhooks/stripe \
  -H "Content-Type: application/json" \
  -d '{"type": "payment_intent.succeeded", "data": {...}}'
```

- [ ] **Testar tracking de payments**
- [ ] **Confirmar histórico de pagamentos**

### 4.3 Gestão de Usuários Admin
- [ ] **Testar listagem de usuários**
- [ ] **Validar criação de novos usuários**
- [ ] **Confirmar edição de perfis**

## FASE 5: MIGRAÇÃO DE DADOS EM MEMÓRIA (15 min)

### 5.1 Agentes MCP
- [ ] **Migrar agentes da memória para BD**
```javascript
// Executar no console do servidor
await mcpServer.migrateInMemoryAgentsToDatabase();
```

- [ ] **Verificar persistência após restart**
- [ ] **Confirmar URLs de teste funcionando**

### 5.2 Dados de Configuração
- [ ] **Migrar configurações temporárias**
- [ ] **Backup de dados importantes**
- [ ] **Validar integridade dos dados migrados**

## FASE 6: TESTES INTEGRADOS (20 min)

### 6.1 Fluxo Completo de Lead
1. **Acesso à landing page** → ✅
2. **Preenchimento do formulário** → 🧪 Testar
3. **Confirmação por email** → 🧪 Testar  
4. **Personalização do agente** → 🧪 Testar
5. **Criação do agente MCP** → 🧪 Testar
6. **Teste do agente** → 🧪 Testar

### 6.2 Fluxo de Pagamento
1. **Seleção de plano** → ✅
2. **Stripe checkout** → ✅
3. **Webhook de confirmação** → 🧪 Testar
4. **Tracking no admin** → 🧪 Testar
5. **Email de confirmação** → 🧪 Testar

### 6.3 Fluxo de Suporte  
1. **Criação de ticket** → 🧪 Testar
2. **Email de notificação** → 🧪 Testar
3. **Gestão pelo admin** → 🧪 Testar
4. **Atualização de status** → 🧪 Testar

## CRITÉRIOS DE SUCESSO

### ✅ Funcionalidades Restauradas
- [ ] **Autenticação completa** (login, signup, forgot/reset password)
- [ ] **Gestão de usuários** (admin CRUD operations)  
- [ ] **Sistema de leads** (captura, confirmação, conversão)
- [ ] **Tracking de pagamentos** (webhooks, histórico, admin)
- [ ] **Sistema de suporte** (tickets, notificações)
- [ ] **Persistência MCP** (agentes salvos no BD)
- [ ] **Integração Stripe** (customers, subscriptions)

### ✅ Métricas de Performance
- [ ] **Tempo de resposta < 200ms** para consultas simples
- [ ] **Zero data loss** na migração
- [ ] **100% uptime** após implementação
- [ ] **Emails funcionando** (confirmação, reset, suporte)

### ✅ Validação End-to-End
- [ ] **Lead → Cliente → Pagamento** (fluxo completo)
- [ ] **Admin → Gestão → Relatórios** (operações admin)
- [ ] **Cliente → Suporte → Resolução** (atendimento)

## CONTINGÊNCIAS

### Se Banco Não Restaurar (Plano B)
1. **Migrar para PostgreSQL local temporário**
2. **Configurar backup automático**
3. **Implementar sincronização manual**

### Se Problemas de Performance
1. **Implementar índices otimizados**
2. **Cache em Redis para queries frequentes**
3. **Paginação em listagens grandes**

### Se Falha na Migração
1. **Manter storage em memória como fallback**
2. **Export/import manual de dados críticos**
3. **Documentar dependências para futuro**

## ESTIMATIVA TOTAL: 2h30min

| Fase | Tempo | Prioridade |
|------|-------|------------|
| Diagnóstico | 15 min | 🔴 Crítico |
| Recuperação BD | 30 min | 🔴 Crítico |
| Autenticação | 20 min | 🔴 Crítico |
| Funcionalidades | 30 min | 🟡 Alto |
| Migração Dados | 15 min | 🟡 Médio |
| Testes Integrados | 20 min | 🟡 Médio |

---

**PRÓXIMO PASSO**: Aguardar aprovação para iniciar Fase 1 - Diagnóstico e Conectividade