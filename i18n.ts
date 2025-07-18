import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  pt: {
    translation: {
      // Navigation
      'nav.dashboard': 'Dashboard',
      'nav.agents': 'Meus Agentes',
      'nav.builder': 'Construtor',
      'nav.analytics': 'Analytics',
      'nav.team': 'Equipe',
      'nav.billing': 'Planos',
      'nav.settings': 'Configurações',
      'nav.help': 'Ajuda',
      'nav.logout': 'Sair',
      
      // Dashboard
      'dashboard.welcome': 'Bem-vindo de volta, {{name}}!',
      'dashboard.subtitle': 'Aqui está um resumo dos seus agentes e performance hoje.',
      'dashboard.systemsOperational': 'Todos os sistemas operacionais',
      'dashboard.totalConversations': 'Total de Conversas',
      'dashboard.activeAgents': 'Agentes Ativos',
      'dashboard.satisfactionRate': 'Taxa de Satisfação',
      'dashboard.averageTime': 'Tempo Médio',
      'dashboard.createNewAgent': 'Criar Novo Agente',
      'dashboard.recentActivity': 'Atividade Recente',
      'dashboard.performanceToday': 'Performance Hoje',
      'dashboard.myAgents': 'Meus Agentes',
      'dashboard.newAgent': 'Novo Agente',
      
      // Agent Types
      'agent.essential': 'Agente Essencial',
      'agent.agenda': 'Agente de Agenda',
      'agent.conversion': 'Agente de Conversão',
      'agent.status.active': 'Ativo',
      'agent.status.paused': 'Pausado',
      'agent.status.draft': 'Rascunho',
      
      // Common
      'common.conversations': 'Conversas',
      'common.satisfaction': 'Satisfação',
      'common.performance': 'Performance',
      'common.excellent': 'Excelente',
      'common.good': 'Bom',
      'common.needsAttention': 'Precisa Atenção',
      'common.create': 'Criar',
      'common.start': 'Começar',
      'common.save': 'Salvar',
      'common.cancel': 'Cancelar',
      'common.search': 'Buscar',
    }
  },
  en: {
    translation: {
      // Navigation
      'nav.dashboard': 'Dashboard',
      'nav.agents': 'My Agents',
      'nav.builder': 'Builder',
      'nav.analytics': 'Analytics',
      'nav.team': 'Team',
      'nav.billing': 'Plans',
      'nav.settings': 'Settings',
      'nav.help': 'Help',
      'nav.logout': 'Logout',
      
      // Dashboard
      'dashboard.welcome': 'Welcome back, {{name}}!',
      'dashboard.subtitle': 'Here\'s a summary of your agents and performance today.',
      'dashboard.systemsOperational': 'All systems operational',
      'dashboard.totalConversations': 'Total Conversations',
      'dashboard.activeAgents': 'Active Agents',
      'dashboard.satisfactionRate': 'Satisfaction Rate',
      'dashboard.averageTime': 'Average Time',
      'dashboard.createNewAgent': 'Create New Agent',
      'dashboard.recentActivity': 'Recent Activity',
      'dashboard.performanceToday': 'Performance Today',
      'dashboard.myAgents': 'My Agents',
      'dashboard.newAgent': 'New Agent',
      
      // Agent Types
      'agent.essential': 'Essential Agent',
      'agent.agenda': 'Agenda Agent',
      'agent.conversion': 'Conversion Agent',
      'agent.status.active': 'Active',
      'agent.status.paused': 'Paused',
      'agent.status.draft': 'Draft',
      
      // Common
      'common.conversations': 'Conversations',
      'common.satisfaction': 'Satisfaction',
      'common.performance': 'Performance',
      'common.excellent': 'Excellent',
      'common.good': 'Good',
      'common.needsAttention': 'Needs Attention',
      'common.create': 'Create',
      'common.start': 'Start',
      'common.save': 'Save',
      'common.cancel': 'Cancel',
      'common.search': 'Search',
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'pt',
    fallbackLng: 'pt',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;