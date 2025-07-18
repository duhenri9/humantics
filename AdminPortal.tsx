import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  DollarSign, 
  Users, 
  CreditCard, 
  TrendingUp, 
  AlertCircle,
  ExternalLink,
  RefreshCw,
  Calendar,
  Mail,
  BarChart3
} from 'lucide-react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import { useAuth } from '../context/AuthContext';
// import { apiRequest } from '../lib/queryClient';

interface AdminStats {
  totalRevenue: number;
  activeSubscriptions: number;
  failedPayments: number;
  monthlyRecurring: number;
  customerLifetimeValue: number;
  churnRate: number;
}

interface RecentEvent {
  id: string;
  type: 'payment_success' | 'payment_failed' | 'subscription_created' | 'subscription_cancelled';
  customerEmail: string;
  amount: number;
  timestamp: string;
  plan: string;
}

const AdminPortal = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<AdminStats>({
    totalRevenue: 0,
    activeSubscriptions: 0,
    failedPayments: 0,
    monthlyRecurring: 0,
    customerLifetimeValue: 0,
    churnRate: 0
  });
  const [recentEvents, setRecentEvents] = useState<RecentEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user?.role === 'admin') {
      loadAdminData();
    }
  }, [user]);

  const loadAdminData = async () => {
    try {
      setIsLoading(true);
      
      // In production, these would fetch real Stripe data
      // For now, showing realistic sample data structure
      setStats({
        totalRevenue: 45670.50,
        activeSubscriptions: 127,
        failedPayments: 3,
        monthlyRecurring: 8950.00,
        customerLifetimeValue: 359.45,
        churnRate: 4.2
      });

      setRecentEvents([
        {
          id: '1',
          type: 'payment_success',
          customerEmail: 'cliente@exemplo.com',
          amount: 9700,
          timestamp: new Date().toISOString(),
          plan: 'Conversão'
        },
        {
          id: '2',
          type: 'subscription_created',
          customerEmail: 'novo@cliente.com',
          amount: 4700,
          timestamp: new Date(Date.now() - 3600000).toISOString(),
          plan: 'Agenda'
        }
      ]);
    } catch (error) {
      console.error('Failed to load admin data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const openStripePortal = () => {
    // Direct link to Stripe Dashboard - much more efficient than rebuilding everything
    window.open('https://dashboard.stripe.com', '_blank');
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(amount / 100);
  };

  const getEventIcon = (type: RecentEvent['type']) => {
    switch (type) {
      case 'payment_success': return <DollarSign className="w-4 h-4 text-green-600" />;
      case 'payment_failed': return <AlertCircle className="w-4 h-4 text-red-600" />;
      case 'subscription_created': return <Users className="w-4 h-4 text-blue-600" />;
      case 'subscription_cancelled': return <CreditCard className="w-4 h-4 text-orange-600" />;
    }
  };

  const getEventText = (event: RecentEvent) => {
    switch (event.type) {
      case 'payment_success': 
        return `Pagamento confirmado - ${event.plan}`;
      case 'payment_failed': 
        return `Falha no pagamento - ${event.plan}`;
      case 'subscription_created': 
        return `Nova assinatura - ${event.plan}`;
      case 'subscription_cancelled': 
        return `Assinatura cancelada - ${event.plan}`;
    }
  };

  if (user?.role !== 'admin') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Acesso Negado</h1>
          <p className="text-gray-600">Apenas administradores podem acessar esta área.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        
        <div className="flex-1 overflow-y-auto p-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-7xl mx-auto"
          >
            {/* Header Section */}
            <div className="flex justify-between items-center mb-8">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Portal Administrativo</h1>
                <p className="text-gray-600 mt-2">Visão geral financeira e operacional</p>
              </div>
              
              <div className="flex gap-3">
                <button
                  onClick={loadAdminData}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  <RefreshCw className="w-4 h-4" />
                  Atualizar
                </button>
                
                <button
                  onClick={openStripePortal}
                  className="flex items-center gap-2 px-4 py-2 bg-[#6D7AFF] text-white rounded-lg hover:bg-[#5A67E8] transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                  Stripe Dashboard
                </button>
              </div>
            </div>

            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#6D7AFF]"></div>
              </div>
            ) : (
              <>
                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-white p-6 rounded-xl shadow-sm border border-gray-200"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600 mb-1">Receita Total</p>
                        <p className="text-2xl font-bold text-gray-900">
                          {formatCurrency(stats.totalRevenue * 100)}
                        </p>
                      </div>
                      <div className="p-3 bg-green-100 rounded-lg">
                        <DollarSign className="w-6 h-6 text-green-600" />
                      </div>
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-white p-6 rounded-xl shadow-sm border border-gray-200"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600 mb-1">Assinaturas Ativas</p>
                        <p className="text-2xl font-bold text-gray-900">{stats.activeSubscriptions}</p>
                      </div>
                      <div className="p-3 bg-blue-100 rounded-lg">
                        <Users className="w-6 h-6 text-blue-600" />
                      </div>
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="bg-white p-6 rounded-xl shadow-sm border border-gray-200"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600 mb-1">MRR</p>
                        <p className="text-2xl font-bold text-gray-900">
                          {formatCurrency(stats.monthlyRecurring * 100)}
                        </p>
                      </div>
                      <div className="p-3 bg-purple-100 rounded-lg">
                        <TrendingUp className="w-6 h-6 text-purple-600" />
                      </div>
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="bg-white p-6 rounded-xl shadow-sm border border-gray-200"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600 mb-1">Pagamentos Falharam</p>
                        <p className="text-2xl font-bold text-gray-900">{stats.failedPayments}</p>
                      </div>
                      <div className="p-3 bg-red-100 rounded-lg">
                        <AlertCircle className="w-6 h-6 text-red-600" />
                      </div>
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="bg-white p-6 rounded-xl shadow-sm border border-gray-200"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600 mb-1">LTV Médio</p>
                        <p className="text-2xl font-bold text-gray-900">
                          {formatCurrency(stats.customerLifetimeValue * 100)}
                        </p>
                      </div>
                      <div className="p-3 bg-orange-100 rounded-lg">
                        <BarChart3 className="w-6 h-6 text-orange-600" />
                      </div>
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="bg-white p-6 rounded-xl shadow-sm border border-gray-200"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600 mb-1">Taxa de Churn</p>
                        <p className="text-2xl font-bold text-gray-900">{stats.churnRate}%</p>
                      </div>
                      <div className="p-3 bg-yellow-100 rounded-lg">
                        <TrendingUp className="w-6 h-6 text-yellow-600" />
                      </div>
                    </div>
                  </motion.div>
                </div>

                {/* Recent Events */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                  className="bg-white rounded-xl shadow-sm border border-gray-200"
                >
                  <div className="p-6 border-b border-gray-200">
                    <h2 className="text-lg font-semibold text-gray-900">Atividade Recente</h2>
                    <p className="text-sm text-gray-600 mt-1">Últimos eventos de pagamento e assinatura</p>
                  </div>
                  
                  <div className="p-6">
                    {recentEvents.length > 0 ? (
                      <div className="space-y-4">
                        {recentEvents.map((event) => (
                          <div key={event.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                            <div className="flex items-center gap-3">
                              {getEventIcon(event.type)}
                              <div>
                                <p className="font-medium text-gray-900">{getEventText(event)}</p>
                                <p className="text-sm text-gray-600">{event.customerEmail}</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="font-medium text-gray-900">{formatCurrency(event.amount)}</p>
                              <p className="text-sm text-gray-600">
                                {new Date(event.timestamp).toLocaleString('pt-BR')}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-center text-gray-500 py-8">Nenhuma atividade recente</p>
                    )}
                  </div>
                </motion.div>

                {/* Quick Actions */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 }}
                  className="mt-8 bg-gradient-to-r from-[#6D7AFF] to-[#8B5CF6] rounded-xl p-6"
                >
                  <div className="text-white">
                    <h3 className="text-lg font-semibold mb-2">Acesso Completo ao Stripe</h3>
                    <p className="text-blue-100 mb-4">
                      Para análises detalhadas, relatórios avançados e configurações, acesse diretamente o dashboard do Stripe.
                    </p>
                    <button
                      onClick={openStripePortal}
                      className="flex items-center gap-2 px-4 py-2 bg-white text-[#6D7AFF] rounded-lg hover:bg-gray-100 transition-colors font-medium"
                    >
                      <ExternalLink className="w-4 h-4" />
                      Abrir Stripe Dashboard
                    </button>
                  </div>
                </motion.div>
              </>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default AdminPortal;