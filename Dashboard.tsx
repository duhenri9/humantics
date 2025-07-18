import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import AgentCard from '../components/AgentCard';
import SubscriptionStatus from '../components/SubscriptionStatus';
import { useAuth } from '../context/AuthContext';
import { 
  Plus, 
  TrendingUp, 
  Users, 
  MessageSquare, 
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  UserCog,
  Calendar,
  Target,
  Sparkles,
  Mail,
  MailOpen,
  Zap,
  Award,
  Activity,
  Eye,
  Settings
} from 'lucide-react';

interface Agent {
  id: string;
  name: string;
  type: 'essencial' | 'agenda' | 'conversao';
  status: 'active' | 'paused' | 'draft';
  lastUpdated: string;
}

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [agents, setAgents] = useState<Agent[]>([]);
  const [stats, setStats] = useState({
    totalRevenue: 45670.50,
    activeSubscriptions: 127,
    monthlyRecurring: 8950.00,
    totalUsers: 127
  });
  const [recentActivity, setRecentActivity] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 }
  };

  const staggerChildren = {
    animate: {
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);
      
      // Mock agents data for demonstration
      const mockAgents: Agent[] = [
        {
          id: '1',
          name: 'Agente Atendimento',
          type: 'essencial',
          status: 'active',
          lastUpdated: '2 horas atrás'
        },
        {
          id: '2',
          name: 'Agente Agendamento',
          type: 'agenda',
          status: 'active',
          lastUpdated: '1 hora atrás'
        },
        {
          id: '3',
          name: 'Agente Vendas',
          type: 'conversao',
          status: 'active',
          lastUpdated: '30 min atrás'
        }
      ];
      
      setAgents(mockAgents);

      // Mock recent activity - focused on financial and CRM activities
      const mockActivity = [
        { id: 1, type: 'payment', message: 'Nova assinatura ativada - R$ 97,00', time: '5 min' },
        { id: 2, type: 'user', message: 'Novo usuário registrado', time: '15 min' },
        { id: 3, type: 'subscription', message: 'Assinatura renovada - Plano Conversão', time: '1 hora' }
      ];
      
      setRecentActivity(mockActivity);

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Removed agent-related functions - admin dashboard focused on CRM and financial metrics

  const statCards = user?.role === 'admin' ? [
    {
      title: 'Receita Total',
      value: `R$ ${stats.totalRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
      change: '+18%',
      positive: true,
      icon: TrendingUp,
      color: 'green'
    },
    {
      title: 'Assinaturas Ativas',
      value: stats.activeSubscriptions,
      change: '+12',
      positive: true,
      icon: Users,
      color: 'blue'
    },
    {
      title: 'MRR',
      value: `R$ ${stats.monthlyRecurring.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
      change: '+8%',
      positive: true,
      icon: Target,
      color: 'purple'
    },
    {
      title: 'Total de Usuários',
      value: stats.totalUsers,
      change: '+7',
      positive: true,
      icon: UserCog,
      color: 'orange'
    }
  ] : [];

  // getAgentTemplates function removed - admin dashboard focused on CRM and financial metrics

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-6">
          <motion.div
            initial="initial"
            animate="animate"
            variants={staggerChildren}
            className="max-w-7xl mx-auto"
          >
            {/* Header Section */}
            <motion.div variants={fadeInUp} className="mb-8">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">Dashboard {user?.role === 'admin' ? 'Administrativo' : ''}</h1>
                  <p className="text-gray-600 mt-1">{user?.role === 'admin' ? 'Métricas financeiras e gestão de usuários' : 'Gerencie sua conta e configurações'}</p>
                </div>
                <div className="flex items-center space-x-4">
                  <SubscriptionStatus />
                  {user?.role === 'admin' && (
                    <button
                      onClick={() => navigate('/admin/portal')}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-blue-700 transition-colors"
                    >
                      <TrendingUp className="h-4 w-4" />
                      <span>Portal Financeiro</span>
                    </button>
                  )}
                </div>
              </div>
            </motion.div>

            {/* Stats Cards */}
            <motion.div variants={fadeInUp} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {statCards.map((stat, index) => (
                <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                      <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                      <div className="flex items-center mt-2">
                        {stat.positive ? (
                          <ArrowUpRight className="h-4 w-4 text-green-500" />
                        ) : (
                          <ArrowDownRight className="h-4 w-4 text-red-500" />
                        )}
                        <span className={`text-sm ml-1 ${stat.positive ? 'text-green-600' : 'text-red-600'}`}>
                          {stat.change}
                        </span>
                      </div>
                    </div>
                    <div className={`p-3 rounded-lg bg-${stat.color}-100`}>
                      <stat.icon className={`h-6 w-6 text-${stat.color}-600`} />
                    </div>
                  </div>
                </div>
              ))}
            </motion.div>

            {user?.role === 'admin' && (
              /* Admin Quick Actions */
              <motion.div variants={fadeInUp} className="mb-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">Ações Rápidas</h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <button
                    onClick={() => navigate('/admin/portal')}
                    className="p-6 bg-white rounded-xl border border-gray-200 hover:border-blue-300 transition-colors text-left"
                  >
                    <TrendingUp className="h-8 w-8 text-blue-600 mb-3" />
                    <h3 className="font-semibold text-gray-900 mb-2">Portal Stripe</h3>
                    <p className="text-gray-600 text-sm">Métricas detalhadas e dashboard Stripe</p>
                  </button>
                  
                  <button
                    onClick={() => navigate('/admin/users')}
                    className="p-6 bg-white rounded-xl border border-gray-200 hover:border-green-300 transition-colors text-left"
                  >
                    <Users className="h-8 w-8 text-green-600 mb-3" />
                    <h3 className="font-semibold text-gray-900 mb-2">Gestão de Usuários</h3>
                    <p className="text-gray-600 text-sm">Administrar contas e permissões</p>
                  </button>
                  
                  <button
                    onClick={() => navigate('/billing')}
                    className="p-6 bg-white rounded-xl border border-gray-200 hover:border-purple-300 transition-colors text-left"
                  >
                    <Target className="h-8 w-8 text-purple-600 mb-3" />
                    <h3 className="font-semibold text-gray-900 mb-2">Planos</h3>
                    <p className="text-gray-600 text-sm">Configurar preços e assinaturas</p>
                  </button>
                </div>
              </motion.div>
            )}



            {/* Recent Financial Activity */}
            <motion.div variants={fadeInUp}>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Atividade Financeira Recente</h2>
                <button 
                  onClick={() => navigate('/admin/portal')}
                  className="text-blue-600 hover:text-blue-700 flex items-center space-x-1"
                >
                  <span>Ver detalhes</span>
                  <TrendingUp className="h-4 w-4" />
                </button>
              </div>
              
              <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                {recentActivity.length > 0 ? (
                  <div className="divide-y divide-gray-200">
                    {recentActivity.map((activity) => (
                      <div key={activity.id} className="p-6 flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="h-2 w-2 bg-blue-500 rounded-full mr-4"></div>
                          <div>
                            <p className="text-gray-900 font-medium">{activity.message}</p>
                            <p className="text-gray-500 text-sm">há {activity.time}</p>
                          </div>
                        </div>
                        <div className="text-gray-400">
                          <Clock className="h-4 w-4" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-6 text-center">
                    <Activity className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">Nenhuma atividade recente</p>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;