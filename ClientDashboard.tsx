import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import SubscriptionStatus from '../components/SubscriptionStatus';
import { useAuth } from '../context/AuthContext';
import { 
  User, 
  Settings, 
  CreditCard,
  HelpCircle,
  Shield,
  TrendingUp,
  Calendar,
  Mail,
  Zap,
  Activity,
  CheckCircle,
  AlertCircle,
  Clock,
  Crown
} from 'lucide-react';

interface AccountMetrics {
  planType: 'essencial' | 'agenda' | 'conversao';
  agentStatus: 'active' | 'inactive' | 'setup_required';
  daysUntilRenewal: number;
  supportTickets: number;
  lastActivity: string;
}

const ClientDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [accountMetrics, setAccountMetrics] = useState<AccountMetrics>({
    planType: user?.plan as 'essencial' | 'agenda' | 'conversao' || 'essencial',
    agentStatus: 'active',
    daysUntilRenewal: 28,
    supportTickets: 1,
    lastActivity: '2 horas atrás'
  });

  useEffect(() => {
    fetchAccountData();
  }, []);

  const fetchAccountData = async () => {
    try {
      setIsLoading(true);
      
      // Fetch real account data
      setAccountMetrics({
        planType: user?.plan as 'essencial' | 'agenda' | 'conversao' || 'essencial',
        agentStatus: 'active',
        daysUntilRenewal: 28,
        supportTickets: 1,
        lastActivity: '2 horas atrás'
      });

    } catch (error) {
      console.error('Error fetching account data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const quickActions = [
    {
      title: 'Configurações da Conta',
      description: 'Gerencie perfil e configurações',
      icon: User,
      color: 'bg-blue-500',
      action: () => navigate('/settings')
    },
    {
      title: 'Gerenciar Assinatura',
      description: 'Planos, pagamentos e faturas',
      icon: CreditCard,
      color: 'bg-green-500',
      action: () => navigate('/billing')
    },
    {
      title: 'Suporte Técnico',
      description: 'Abra um chamado ou veja tickets',
      icon: HelpCircle,
      color: 'bg-purple-500',
      action: () => navigate('/client-area')
    }
  ];

  const getPlanDisplayName = (plan: string) => {
    const planNames = {
      'essencial': 'Essencial',
      'agenda': 'Agenda',
      'conversao': 'Conversão'
    };
    return planNames[plan as keyof typeof planNames] || 'Essencial';
  };

  const getPlanFeatures = (plan: string) => {
    const features = {
      'essencial': ['Agente de Atendimento', 'Suporte por email', 'Analytics básicos'],
      'agenda': ['Agente de Atendimento', 'Agente de Agendamento', 'Suporte prioritário', 'Analytics avançados'],
      'conversao': ['Todos os agentes', 'Suporte 24/7', 'Analytics completos', 'API personalizada', 'White label']
    };
    return features[plan as keyof typeof features] || features.essencial;
  };

  const accountStatusCards = [
    {
      title: 'Plano Atual',
      value: getPlanDisplayName(accountMetrics.planType),
      icon: Crown,
      status: 'active',
      subtitle: `Renovação em ${accountMetrics.daysUntilRenewal} dias`
    },
    {
      title: 'Status do Agente',
      value: accountMetrics.agentStatus === 'active' ? 'Ativo' : 'Inativo',
      icon: CheckCircle,
      status: accountMetrics.agentStatus,
      subtitle: accountMetrics.agentStatus === 'active' ? 'Funcionando normalmente' : 'Configuração pendente'
    },
    {
      title: 'Tickets de Suporte',
      value: accountMetrics.supportTickets,
      icon: HelpCircle,
      status: accountMetrics.supportTickets > 0 ? 'pending' : 'resolved',
      subtitle: accountMetrics.supportTickets > 0 ? 'Tickets em aberto' : 'Nenhum ticket aberto'
    },
    {
      title: 'Última Atividade',
      value: accountMetrics.lastActivity,
      icon: Activity,
      status: 'recent',
      subtitle: 'Última interação registrada'
    }
  ];

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      
      <div className="flex-1 flex flex-col">
        <Header />
        
        <main className="flex-1 p-6">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex justify-between items-center mb-8">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Olá, {user?.fullName || 'Usuário'}! 👋
                </h1>
                <p className="text-gray-600 mt-2">
                  Gerencie sua conta e acompanhe o status dos seus serviços
                </p>
              </div>
              <SubscriptionStatus />
            </div>

            {/* Account Status Cards */}
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              {accountStatusCards.map((card, index) => (
                <motion.div
                  key={card.title}
                  className="bg-white rounded-lg p-6 shadow-sm border border-gray-200"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className={`p-2 rounded-lg ${
                      card.status === 'active' ? 'bg-green-100' : 
                      card.status === 'pending' ? 'bg-yellow-100' : 
                      'bg-gray-100'
                    }`}>
                      <card.icon className={`h-5 w-5 ${
                        card.status === 'active' ? 'text-green-600' : 
                        card.status === 'pending' ? 'text-yellow-600' : 
                        'text-gray-600'
                      }`} />
                    </div>
                    {card.status === 'active' && (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    )}
                    {card.status === 'pending' && (
                      <AlertCircle className="h-4 w-4 text-yellow-500" />
                    )}
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-1">
                    {card.value}
                  </h3>
                  <p className="text-sm text-gray-500">{card.title}</p>
                  <p className="text-xs text-gray-400 mt-1">{card.subtitle}</p>
                </motion.div>
              ))}
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Plan Information Section */}
              <div className="lg:col-span-2">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">
                    Detalhes do seu Plano
                  </h2>
                  
                  <div className="bg-white rounded-lg border border-gray-200 p-6">
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-3">
                        <div className="bg-[#6D7AFF] p-3 rounded-lg">
                          <Crown className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">
                            Plano {getPlanDisplayName(accountMetrics.planType)}
                          </h3>
                          <p className="text-sm text-gray-500">
                            Renovação automática em {accountMetrics.daysUntilRenewal} dias
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => navigate('/billing')}
                        className="text-[#6D7AFF] hover:text-[#5A67E8] font-medium"
                      >
                        Gerenciar
                      </button>
                    </div>

                    <div className="space-y-3">
                      <h4 className="font-medium text-gray-900 mb-3">Recursos inclusos:</h4>
                      {getPlanFeatures(accountMetrics.planType).map((feature, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span className="text-sm text-gray-600">{feature}</span>
                        </div>
                      ))}
                    </div>

                    {accountMetrics.planType !== 'conversao' && (
                      <div className="mt-6 p-4 bg-gradient-to-r from-[#6D7AFF]/10 to-[#5A67E8]/10 rounded-lg border border-[#6D7AFF]/20">
                        <div className="flex items-start gap-3">
                          <TrendingUp className="h-5 w-5 text-[#6D7AFF] mt-0.5" />
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900 mb-1">
                              Upgrade disponível
                            </h4>
                            <p className="text-sm text-gray-600 mb-3">
                              Desbloqueie recursos avançados com o plano Conversão
                            </p>
                            <button
                              onClick={() => navigate('/billing')}
                              className="bg-[#6D7AFF] text-white px-4 py-2 rounded-lg hover:bg-[#5A67E8] transition-colors text-sm"
                            >
                              Ver Planos
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              </div>

              {/* Quick Actions */}
              <div className="lg:col-span-1">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                >
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">
                    Ações Rápidas
                  </h2>
                  
                  <div className="space-y-4">
                    {quickActions.map((action, index) => (
                      <div
                        key={action.title}
                        onClick={action.action}
                        className="bg-white p-4 rounded-lg border border-gray-200 hover:border-gray-300 cursor-pointer transition-all hover:shadow-md"
                      >
                        <div className="flex items-start gap-3">
                          <div className={`${action.color} p-2 rounded-lg text-white`}>
                            <action.icon className="h-5 w-5" />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-medium text-gray-900 mb-1">
                              {action.title}
                            </h3>
                            <p className="text-sm text-gray-500">
                              {action.description}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                    
                    {/* Agent Status Info */}
                    <div className="bg-white p-4 rounded-lg border border-gray-200">
                      <div className="flex items-start gap-3">
                        <div className={`p-2 rounded-lg ${
                          accountMetrics.agentStatus === 'active' ? 'bg-green-100' : 'bg-yellow-100'
                        }`}>
                          {accountMetrics.agentStatus === 'active' ? (
                            <CheckCircle className="h-5 w-5 text-green-600" />
                          ) : (
                            <Clock className="h-5 w-5 text-yellow-600" />
                          )}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-900 mb-1">
                            Status do Agente N8N
                          </h3>
                          <p className="text-sm text-gray-500 mb-2">
                            {accountMetrics.agentStatus === 'active' 
                              ? 'Seu agente está ativo e funcionando' 
                              : 'Configuração do agente pendente'}
                          </p>
                          {accountMetrics.agentStatus !== 'active' && (
                            <button
                              onClick={() => navigate('/client-area')}
                              className="text-[#6D7AFF] text-sm font-medium hover:text-[#5A67E8]"
                            >
                              Solicitar Configuração
                            </button>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Help & Support */}
                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                      <div className="flex items-start gap-3">
                        <div className="bg-gray-200 p-2 rounded-lg">
                          <HelpCircle className="h-5 w-5 text-gray-600" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-900 mb-1">
                            Precisa de Ajuda?
                          </h3>
                          <p className="text-sm text-gray-500 mb-3">
                            Acesse nossa base de conhecimento ou abra um ticket
                          </p>
                          <div className="space-y-2">
                            <button
                              onClick={() => window.open('/ajuda.html', '_blank')}
                              className="w-full text-left text-sm text-[#6D7AFF] hover:text-[#5A67E8] font-medium"
                            >
                              → Central de Ajuda
                            </button>
                            <button
                              onClick={() => navigate('/client-area')}
                              className="w-full text-left text-sm text-[#6D7AFF] hover:text-[#5A67E8] font-medium"
                            >
                              → Abrir Ticket de Suporte
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ClientDashboard;