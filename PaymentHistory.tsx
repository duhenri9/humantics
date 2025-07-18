import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import { useAuth } from '../context/AuthContext';
import { 
  CreditCard, 
  Download, 
  Search, 
  Filter, 
  Calendar, 
  CheckCircle, 
  XCircle, 
  Clock, 
  AlertTriangle,
  FileText,
  RefreshCw,
  DollarSign,
  Receipt
} from 'lucide-react';
import { showError, showSuccess } from '../utils/toast';

interface PaymentRecord {
  id: string;
  userId: string;
  planType: 'essencial' | 'agenda' | 'conversao';
  phase: 'phase1' | 'phase2' | 'monthly';
  status: 'pending' | 'paid' | 'failed' | 'cancelled';
  amount: number;
  currency: string;
  dueDate: string | null;
  paidAt: string | null;
  paymentMethod?: string;
  stripePaymentId?: string;
  description?: string;
  createdAt: string;
}

const PaymentHistory = () => {
  const { user } = useAuth();
  const [payments, setPayments] = useState<PaymentRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterPhase, setFilterPhase] = useState<string>('all');

  useEffect(() => {
    fetchPaymentHistory();
  }, []);

  const fetchPaymentHistory = async () => {
    try {
      setIsLoading(true);
      if (!user?.id) return;
      
      const response = await fetch(`/api/payments/user/${user.id}`);
      if (response.ok) {
        const data = await response.json();
        setPayments(data);
      } else {
        throw new Error('Erro ao carregar histórico de pagamentos');
      }
    } catch (error: any) {
      showError(error.message || 'Erro ao carregar histórico de pagamentos');
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const badges = {
      pending: { color: 'bg-yellow-100 text-yellow-800', icon: Clock, text: 'Pendente' },
      paid: { color: 'bg-green-100 text-green-800', icon: CheckCircle, text: 'Pago' },
      failed: { color: 'bg-red-100 text-red-800', icon: XCircle, text: 'Falhou' },
      cancelled: { color: 'bg-gray-100 text-gray-800', icon: XCircle, text: 'Cancelado' }
    };
    const badge = badges[status as keyof typeof badges];
    const Icon = badge.icon;
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${badge.color}`}>
        <Icon className="w-3 h-3 mr-1" />
        {badge.text}
      </span>
    );
  };

  const getPhaseBadge = (phase: string) => {
    const badges = {
      phase1: { color: 'bg-blue-100 text-blue-800', text: 'Fase 1 (50%)' },
      phase2: { color: 'bg-purple-100 text-purple-800', text: 'Fase 2 (50%)' },
      monthly: { color: 'bg-green-100 text-green-800', text: 'Manutenção Mensal' }
    };
    const badge = badges[phase as keyof typeof badges];
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${badge.color}`}>
        {badge.text}
      </span>
    );
  };

  const formatPrice = (amount: number, currency: string = 'BRL') => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: currency,
    }).format(amount / 100);
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('pt-BR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const filteredPayments = payments.filter(payment => {
    const matchesSearch = !searchTerm || 
      payment.planType.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.phase.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || payment.status === filterStatus;
    const matchesPhase = filterPhase === 'all' || payment.phase === filterPhase;
    
    return matchesSearch && matchesStatus && matchesPhase;
  });

  const totalPaid = payments
    .filter(p => p.status === 'paid')
    .reduce((sum, p) => sum + p.amount, 0);

  const totalPending = payments
    .filter(p => p.status === 'pending')
    .reduce((sum, p) => sum + p.amount, 0);

  const handleDownloadReceipt = (payment: PaymentRecord) => {
    showSuccess('Funcionalidade de download de recibo será implementada em breve');
  };

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
                <h1 className="text-3xl font-bold text-gray-900">Histórico de Pagamentos</h1>
                <p className="text-gray-600 mt-2">Acompanhe todos os seus pagamentos e faturas</p>
              </div>
              
              <button
                onClick={fetchPaymentHistory}
                className="flex items-center gap-2 px-4 py-2 bg-[#6D7AFF] text-white rounded-lg hover:bg-[#5A67E8] transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                Atualizar
              </button>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white rounded-lg p-6 border border-gray-200">
                <div className="flex items-center gap-3 mb-2">
                  <div className="bg-green-100 p-2 rounded-lg">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900">Total Pago</h3>
                </div>
                <p className="text-2xl font-bold text-green-600">
                  {formatPrice(totalPaid)}
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  {payments.filter(p => p.status === 'paid').length} pagamentos
                </p>
              </div>

              <div className="bg-white rounded-lg p-6 border border-gray-200">
                <div className="flex items-center gap-3 mb-2">
                  <div className="bg-yellow-100 p-2 rounded-lg">
                    <Clock className="w-5 h-5 text-yellow-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900">Pendente</h3>
                </div>
                <p className="text-2xl font-bold text-yellow-600">
                  {formatPrice(totalPending)}
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  {payments.filter(p => p.status === 'pending').length} pagamentos
                </p>
              </div>

              <div className="bg-white rounded-lg p-6 border border-gray-200">
                <div className="flex items-center gap-3 mb-2">
                  <div className="bg-blue-100 p-2 rounded-lg">
                    <FileText className="w-5 h-5 text-blue-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900">Total de Transações</h3>
                </div>
                <p className="text-2xl font-bold text-blue-600">
                  {payments.length}
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  Todas as transações
                </p>
              </div>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-lg shadow p-6 mb-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Buscar pagamentos..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6D7AFF] focus:border-transparent"
                  />
                </div>
                
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6D7AFF] focus:border-transparent"
                >
                  <option value="all">Todos os Status</option>
                  <option value="paid">Pago</option>
                  <option value="pending">Pendente</option>
                  <option value="failed">Falhou</option>
                  <option value="cancelled">Cancelado</option>
                </select>
                
                <select
                  value={filterPhase}
                  onChange={(e) => setFilterPhase(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6D7AFF] focus:border-transparent"
                >
                  <option value="all">Todas as Fases</option>
                  <option value="phase1">Fase 1 (50%)</option>
                  <option value="phase2">Fase 2 (50%)</option>
                  <option value="monthly">Manutenção Mensal</option>
                </select>
                
                <div className="text-sm text-gray-600 flex items-center">
                  <DollarSign className="w-4 h-4 mr-2" />
                  {filteredPayments.length} transações
                </div>
              </div>
            </div>

            {/* Payments Table */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
              {isLoading ? (
                <div className="p-8 text-center">
                  <div className="animate-spin w-8 h-8 border-4 border-[#6D7AFF] border-t-transparent rounded-full mx-auto mb-4"></div>
                  <p className="text-gray-600">Carregando histórico de pagamentos...</p>
                </div>
              ) : filteredPayments.length === 0 ? (
                <div className="p-8 text-center">
                  <Receipt className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">Nenhum pagamento encontrado</p>
                  <p className="text-sm text-gray-500 mt-2">
                    Seus pagamentos aparecerão aqui conforme forem processados
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Plano / Fase
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Valor
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Data de Vencimento
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Data de Pagamento
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Ações
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredPayments.map((payment) => (
                        <tr key={payment.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div>
                              <div className="text-sm font-medium text-gray-900 capitalize">
                                {payment.planType}
                              </div>
                              <div className="mt-1">
                                {getPhaseBadge(payment.phase)}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">
                              {formatPrice(payment.amount, payment.currency)}
                            </div>
                            {payment.paymentMethod && (
                              <div className="text-sm text-gray-500">
                                {payment.paymentMethod}
                              </div>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {getStatusBadge(payment.status)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {formatDate(payment.dueDate)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {formatDate(payment.paidAt)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            {payment.status === 'paid' && (
                              <button
                                onClick={() => handleDownloadReceipt(payment)}
                                className="text-[#6D7AFF] hover:text-[#5A67E8] flex items-center gap-1"
                              >
                                <Download className="w-4 h-4" />
                                Recibo
                              </button>
                            )}
                            {payment.status === 'pending' && payment.dueDate && new Date(payment.dueDate) < new Date() && (
                              <span className="text-red-600 text-xs">
                                Em atraso
                              </span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Next Payment Info */}
            {payments.some(p => p.status === 'pending') && (
              <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-6">
                <div className="flex items-center gap-3 mb-2">
                  <AlertTriangle className="w-5 h-5 text-blue-600" />
                  <h3 className="font-semibold text-blue-900">Próximos Pagamentos</h3>
                </div>
                <p className="text-blue-800 text-sm">
                  Você tem pagamentos pendentes. Para manter seu serviço ativo, 
                  certifique-se de quitar os pagamentos em aberto.
                </p>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default PaymentHistory;