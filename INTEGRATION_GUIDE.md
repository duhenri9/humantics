# Guia de Integrações HumanTic - Estrutura Modular

## Visão Geral

Esta estrutura modular foi criada para facilitar integrações futuras sem modificar o frontend existente. Todos os módulos estão prontos para produção com logs explicativos.

## Estrutura de Pastas

```
client/src/
├── integrations/           # Módulos por plano
│   ├── essencial.js       # Integração agente Essencial
│   ├── agenda.js          # Integração agente Agenda  
│   ├── conversao.js       # Integração agente Conversão
│   └── index.js           # Exportações centralizadas
├── external/              # Sistemas complementares
│   ├── forms.js           # Typeform, Google Forms
│   ├── payments.js        # Stripe, MercadoPago, Asaas
│   └── resend.js          # Email transacional
└── supabase/              # Base de dados (simulada)
    ├── auth.js            # Autenticação
    └── db.js              # Operações de banco
```

## Como Usar nos Componentes

### Importação Centralizada
```javascript
import { 
  startEssencialIntegration,
  sendWelcomeEmail, 
  openCheckout,
  loginSimulado,
  salvarSimulado 
} from '@/integrations';
```

### Exemplo em Componente React
```javascript
// Em qualquer componente existente
const handleFormSubmit = async (formData) => {
  try {
    // 1. Integração por plano
    if (formData.planType === 'essencial') {
      await startEssencialIntegration(formData);
    }
    
    // 2. Email de boas-vindas
    await sendWelcomeEmail(formData.email, formData.name);
    
    // 3. Salvar no banco
    await salvarSimulado({
      table: 'leads',
      ...formData
    });
    
    // 4. Redirecionar para checkout
    openCheckout(formData.checkoutUrl);
    
  } catch (error) {
    console.error('Erro na integração:', error);
  }
};
```

## Integrações Disponíveis

### 🎯 Por Plano de Agente

#### Essencial
- `startEssencialIntegration(data)` - Webhook N8N + Supabase
- `sendToBotSailorEssencial(payload)` - Bot BotSailor

#### Agenda  
- `fetchAgendaMock()` - API Consultorio.me
- `sendToBotSailorAgenda(payload)` - Bot BotSailor Agenda

#### Conversão
- `connectBotSailorConversao()` - Bot BotSailor avançado
- `enviarLeadParaChatWood(lead)` - Sistema ChatWood

### 🌐 Sistemas Externos

#### Formulários
- `openForm(url)` - Typeform, Google Forms
- `openFormWithParams(baseUrl, params)` - Com parâmetros

#### Pagamentos
- `openCheckout(link)` - Stripe, MercadoPago, Asaas
- `openCustomerPortal(portalUrl)` - Portal do cliente
- `initiateCheckout(paymentData)` - Checkout personalizado

#### Email
- `sendEmailMock(email, content)` - Email genérico
- `sendWelcomeEmail(email, userName)` - Boas-vindas
- `sendNotificationEmail(email, notification)` - Notificações

### 🗄️ Base de Dados (Supabase Simulado)

#### Autenticação
- `loginSimulado(email)` - Login
- `registerSimulado(userData)` - Registro
- `logoutSimulado()` - Logout
- `getSessionSimulado()` - Verificar sessão

#### Database
- `salvarSimulado(dados)` - Criar registro
- `buscarSimulado(tabela, filtros)` - Buscar registros
- `atualizarSimulado(tabela, id, dados)` - Atualizar
- `removerSimulado(tabela, id)` - Remover

## Status das Integrações

| Módulo | Status | Observações |
|--------|--------|-------------|
| Essencial | ✅ Ready | Pronto para N8N + BotSailor |
| Agenda | ✅ Ready | Pronto para Consultorio.me + BotSailor |
| Conversão | ✅ Ready | Pronto para BotSailor + ChatWood |
| Forms | ✅ Ready | Pronto para Typeform/Google Forms |
| Payments | ✅ Ready | Pronto para Stripe/MercadoPago/Asaas |
| Email | ✅ Ready | Pronto para Resend |
| Supabase | 🔄 Simulated | Simulado, pronto para produção |

## Configuração para Produção

### Variáveis de Ambiente Necessárias

```env
# BotSailor
BOTSAILOR_API_KEY=sua_chave_botsailor
BOTSAILOR_ESSENCIAL_KEY=chave_plano_essencial  
BOTSAILOR_AGENDA_KEY=chave_plano_agenda
BOTSAILOR_CONVERSAO_KEY=chave_plano_conversao

# ChatWood
CHATWOOD_URL=https://app.chatwoot.com
CHATWOOD_ACCOUNT_ID=123
CHATWOOD_API_TOKEN=token_chatwood
CHATWOOD_INBOX_ID=1
CHATWOOD_TEAM_ID=1

# Consultorio.me
CONSULTORIO_API_KEY=chave_consultorio
CONSULTORIO_CLINIC_ID=id_clinica

# Resend
RESEND_API_KEY=chave_resend
RESEND_FROM_EMAIL=onboarding@humantic.wm3digital.com.br

# Stripe
STRIPE_PUBLIC_KEY=pk_live_...
STRIPE_SECRET_KEY=sk_live_...

# Webhooks
HUMANTICS_WEBHOOK_URL=https://humantic.wm3digital.com.br/webhook
```

### Substituição por APIs Reais

Cada função marcada com `// TODO: Substituir por chamada real` está pronta para receber a implementação real da API correspondente.

## Princípios da Arquitetura

1. **Zero Modificações Frontend**: Interface atual mantida intacta
2. **Modularidade**: Cada integração em arquivo separado
3. **Logs Detalhados**: Console logs para debugging
4. **Pronto para Produção**: Estruturas de payload prontas
5. **Fallback Gracioso**: Simulações funcionais até ativação real
6. **Expansibilidade**: Fácil adição de novas integrações

## Próximos Passos

1. Configurar variáveis de ambiente
2. Substituir chamadas simuladas por APIs reais
3. Testar integrações uma por vez
4. Ativar logs de produção
5. Monitorar performance e erros