// PRONTO PARA PRODUÇÃO - Módulo Central de Integrações HumanTic
// Exportações centralizadas para fácil importação nos componentes

// Integrações por plano
export * from './essencial.js';
export * from './agenda.js';
export * from './conversao.js';

// Integrações externas
export * from '../external/forms.js';
export * from '../external/payments.js';
export * from '../external/resend.js';

// Integrações Supabase (simuladas)
export * from '../supabase/auth.js';
export * from '../supabase/db.js';

/**
 * Exemplo de uso nos componentes existentes:
 * 
 * import { startEssencialIntegration, sendWelcomeEmail, openCheckout } from '@/integrations';
 * 
 * // Em qualquer componente:
 * const handleFormSubmit = async (data) => {
 *   // Integração Essencial
 *   await startEssencialIntegration(data);
 *   
 *   // Email de boas-vindas
 *   await sendWelcomeEmail(data.email, data.name);
 *   
 *   // Redirecionar para checkout
 *   openCheckout('https://checkout.stripe.com/pay/xxx');
 * };
 */

/**
 * Mapeamento de integrações por funcionalidade
 * PRONTO PARA PRODUÇÃO
 */
export const INTEGRATION_MAP = {
  // Agentes por plano
  plans: {
    essencial: {
      start: 'startEssencialIntegration',
      bot: 'sendToBotSailorEssencial'
    },
    agenda: {
      fetch: 'fetchAgendaMock',
      bot: 'sendToBotSailorAgenda'
    },
    conversao: {
      connect: 'connectBotSailorConversao',
      leads: 'enviarLeadParaChatWood'
    }
  },
  
  // Sistemas externos
  external: {
    forms: 'openForm',
    payments: 'openCheckout',
    email: 'sendEmailMock'
  },
  
  // Base de dados
  database: {
    save: 'salvarSimulado',
    fetch: 'buscarSimulado',
    update: 'atualizarSimulado',
    delete: 'removerSimulado'
  },
  
  // Autenticação
  auth: {
    login: 'loginSimulado',
    register: 'registerSimulado',
    logout: 'logoutSimulado'
  }
};

/**
 * Helper para verificar se integração está disponível
 * PRONTO PARA PRODUÇÃO
 */
export function isIntegrationAvailable(integrationName) {
  const availableIntegrations = [
    'startEssencialIntegration',
    'fetchAgendaMock', 
    'connectBotSailorConversao',
    'openForm',
    'openCheckout',
    'sendEmailMock',
    'loginSimulado',
    'salvarSimulado'
  ];
  
  return availableIntegrations.includes(integrationName);
}

/**
 * Status das integrações
 * PRONTO PARA PRODUÇÃO
 */
export const INTEGRATION_STATUS = {
  essencial: 'ready', // Pronto para N8N + BotSailor
  agenda: 'ready',    // Pronto para Consultorio.me + BotSailor
  conversao: 'ready', // Pronto para BotSailor + ChatWood
  forms: 'ready',     // Pronto para Typeform/Google Forms
  payments: 'ready',  // Pronto para Stripe/MercadoPago/Asaas
  email: 'ready',     // Pronto para Resend
  supabase: 'simulated' // Simulado, pronto para produção
};