import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import { useAuth } from '../context/AuthContext';
import { 
  MessageSquare, 
  Send, 
  Plus, 
  Search, 
  Filter, 
  Clock, 
  CheckCircle, 
  AlertTriangle,
  User,
  Calendar,
  Tag,
  FileText,
  RefreshCw
} from 'lucide-react';
import { showError, showSuccess } from '../utils/toast';

interface ClientRequest {
  id: string;
  userId: string;
  type: 'support' | 'feature' | 'bug' | 'billing' | 'integration';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  title: string;
  description: string;
  agentType?: 'essencial' | 'agenda' | 'conversao';
  attachments: string[];
  createdAt: string;
  updatedAt: string;
}

const Support = () => {
  const { user } = useAuth();
  const [requests, setRequests] = useState<ClientRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showNewRequestForm, setShowNewRequestForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [newRequest, setNewRequest] = useState({
    type: 'support' as 'support' | 'feature' | 'bug' | 'billing' | 'integration',
    priority: 'medium' as 'low' | 'medium' | 'high' | 'urgent',
    title: '',
    description: '',
    agentType: user?.plan as 'essencial' | 'agenda' | 'conversao' | undefined
  });

  useEffect(() => {
    fetchMyRequests();
  }, []);

  const fetchMyRequests = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/client-requests');
      if (response.ok) {
        const data = await response.json();
        // Filter only current user's requests
        const myRequests = data.filter((req: ClientRequest) => req.userId === user?.id);
        setRequests(myRequests);
      } else {
        throw new Error('Erro ao carregar suas solicitações');
      }
    } catch (error: any) {
      showError(error.message || 'Erro ao carregar solicitações');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newRequest.title.trim() || !newRequest.description.trim()) {
      showError('Por favor, preencha título e descrição');
      return;
    }

    try {
      const response = await fetch('/api/client-requests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...newRequest,
          attachments: []
        })
      });

      if (response.ok) {
        showSuccess('Solicitação enviada com sucesso! Nossa equipe entrará em contato.');
        setNewRequest({
          type: 'support',
          priority: 'medium',
          title: '',
          description: '',
          agentType: user?.plan as 'essencial' | 'agenda' | 'conversao' | undefined
        });
        setShowNewRequestForm(false);
        await fetchMyRequests();
      } else {
        throw new Error('Erro ao enviar solicitação');
      }
    } catch (error: any) {
      showError(error.message || 'Erro ao enviar solicitação');
    }
  };

  const getStatusBadge = (status: string) => {
    const badges = {
      open: { color: 'bg-blue-100 text-blue-800', icon: Clock, text: 'Aberto' },
      in_progress: { color: 'bg-yellow-100 text-yellow-800', icon: Clock, text: 'Em Andamento' },
      resolved: { color: 'bg-green-100 text-green-800', icon: CheckCircle, text: 'Resolvido' },
      closed: { color: 'bg-gray-100 text-gray-800', icon: CheckCircle, text: 'Fechado' }
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

  const getPriorityBadge = (priority: string) => {
    const badges = {
      low: { color: 'bg-gray-100 text-gray-800', text: 'Baixa' },
      medium: { color: 'bg-blue-100 text-blue-800', text: 'Média' },
      high: { color: 'bg-orange-100 text-orange-800', text: 'Alta' },
      urgent: { color: 'bg-red-100 text-red-800', text: 'Urgente' }
    };
    const badge = badges[priority as keyof typeof badges];
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${badge.color}`}>
        {badge.text}
      </span>
    );
  };

  const getTypeBadge = (type: string) => {
    const badges = {
      support: { color: 'bg-purple-100 text-purple-800', text: 'Suporte' },
      feature: { color: 'bg-green-100 text-green-800', text: 'Funcionalidade' },
      bug: { color: 'bg-red-100 text-red-800', text: 'Bug' },
      billing: { color: 'bg-yellow-100 text-yellow-800', text: 'Cobrança' },
      integration: { color: 'bg-blue-100 text-blue-800', text: 'Integração' }
    };
    const badge = badges[type as keyof typeof badges];
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${badge.color}`}>
        {badge.text}
      </span>
    );
  };

  const filteredRequests = requests.filter(request => {
    const matchesSearch = !searchTerm || 
      request.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || request.status === filterStatus;
    
    return matchesSearch && matchesStatus;
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
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
            className="max-w-6xl mx-auto"
          >
            {/* Header Section */}
            <div className="flex justify-between items-center mb-8">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Central de Suporte</h1>
                <p className="text-gray-600 mt-2">Solicite ajuda e acompanhe suas solicitações</p>
              </div>
              
              <div className="flex gap-3">
                <button
                  onClick={fetchMyRequests}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  <RefreshCw className="w-4 h-4" />
                  Atualizar
                </button>
                
                <button
                  onClick={() => setShowNewRequestForm(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-[#6D7AFF] text-white rounded-lg hover:bg-[#5A67E8] transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  Nova Solicitação
                </button>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white rounded-lg p-6 border border-gray-200 hover:shadow-lg transition-shadow">
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-blue-100 p-3 rounded-lg">
                    <MessageSquare className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Suporte Técnico</h3>
                    <p className="text-sm text-gray-600">Problemas técnicos</p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setNewRequest(prev => ({ ...prev, type: 'support' }));
                    setShowNewRequestForm(true);
                  }}
                  className="w-full px-4 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors"
                >
                  Solicitar Suporte
                </button>
              </div>

              <div className="bg-white rounded-lg p-6 border border-gray-200 hover:shadow-lg transition-shadow">
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-yellow-100 p-3 rounded-lg">
                    <FileText className="w-6 h-6 text-yellow-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Questões Financeiras</h3>
                    <p className="text-sm text-gray-600">Pagamentos e faturas</p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setNewRequest(prev => ({ ...prev, type: 'billing' }));
                    setShowNewRequestForm(true);
                  }}
                  className="w-full px-4 py-2 bg-yellow-50 text-yellow-700 rounded-lg hover:bg-yellow-100 transition-colors"
                >
                  Questão Financeira
                </button>
              </div>

              <div className="bg-white rounded-lg p-6 border border-gray-200 hover:shadow-lg transition-shadow">
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-green-100 p-3 rounded-lg">
                    <Plus className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Sugestão</h3>
                    <p className="text-sm text-gray-600">Melhorias e funcionalidades</p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setNewRequest(prev => ({ ...prev, type: 'feature' }));
                    setShowNewRequestForm(true);
                  }}
                  className="w-full px-4 py-2 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors"
                >
                  Dar Sugestão
                </button>
              </div>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-lg shadow p-6 mb-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Buscar suas solicitações..."
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
                  <option value="open">Aberto</option>
                  <option value="in_progress">Em Andamento</option>
                  <option value="resolved">Resolvido</option>
                  <option value="closed">Fechado</option>
                </select>
                
                <div className="text-sm text-gray-600 flex items-center">
                  <MessageSquare className="w-4 h-4 mr-2" />
                  {filteredRequests.length} solicitações
                </div>
              </div>
            </div>

            {/* Requests List */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
              {isLoading ? (
                <div className="p-8 text-center">
                  <div className="animate-spin w-8 h-8 border-4 border-[#6D7AFF] border-t-transparent rounded-full mx-auto mb-4"></div>
                  <p className="text-gray-600">Carregando suas solicitações...</p>
                </div>
              ) : filteredRequests.length === 0 ? (
                <div className="p-8 text-center">
                  <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">Nenhuma solicitação encontrada</p>
                  <p className="text-sm text-gray-500 mt-2">
                    Clique em "Nova Solicitação" para enviar sua primeira solicitação
                  </p>
                </div>
              ) : (
                <div className="space-y-4 p-6">
                  {filteredRequests.map((request) => (
                    <div key={request.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="font-semibold text-gray-900">{request.title}</h3>
                          <div className="flex items-center gap-2 mt-2">
                            {getTypeBadge(request.type)}
                            {getPriorityBadge(request.priority)}
                            {getStatusBadge(request.status)}
                          </div>
                        </div>
                        <div className="text-sm text-gray-500 flex items-center">
                          <Calendar className="w-4 h-4 mr-1" />
                          {formatDate(request.createdAt)}
                        </div>
                      </div>
                      
                      <p className="text-gray-700 text-sm mb-3">
                        {request.description}
                      </p>
                      
                      {request.agentType && (
                        <div className="flex items-center gap-2">
                          <Tag className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-600 capitalize">
                            Agente: {request.agentType}
                          </span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>

      {/* New Request Modal */}
      {showNewRequestForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto"
          >
            <form onSubmit={handleSubmitRequest}>
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Nova Solicitação</h3>
                <p className="text-gray-600 mt-1">Descreva sua solicitação e nossa equipe entrará em contato</p>
              </div>

              <div className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tipo de Solicitação
                    </label>
                    <select
                      value={newRequest.type}
                      onChange={(e) => setNewRequest(prev => ({ ...prev, type: e.target.value as any }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6D7AFF] focus:border-transparent"
                    >
                      <option value="support">Suporte Técnico</option>
                      <option value="billing">Questão Financeira</option>
                      <option value="feature">Sugestão de Funcionalidade</option>
                      <option value="bug">Relatar Bug</option>
                      <option value="integration">Integração</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Prioridade
                    </label>
                    <select
                      value={newRequest.priority}
                      onChange={(e) => setNewRequest(prev => ({ ...prev, priority: e.target.value as any }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6D7AFF] focus:border-transparent"
                    >
                      <option value="low">Baixa</option>
                      <option value="medium">Média</option>
                      <option value="high">Alta</option>
                      <option value="urgent">Urgente</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Título da Solicitação
                  </label>
                  <input
                    type="text"
                    value={newRequest.title}
                    onChange={(e) => setNewRequest(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Descreva brevemente sua solicitação"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6D7AFF] focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Descrição Detalhada
                  </label>
                  <textarea
                    value={newRequest.description}
                    onChange={(e) => setNewRequest(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Descreva detalhadamente sua solicitação, incluindo passos para reproduzir o problema (se aplicável)"
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6D7AFF] focus:border-transparent"
                    required
                  />
                </div>

                {user?.plan && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Relacionado ao Agente
                    </label>
                    <select
                      value={newRequest.agentType || ''}
                      onChange={(e) => setNewRequest(prev => ({ ...prev, agentType: e.target.value as any || undefined }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6D7AFF] focus:border-transparent"
                    >
                      <option value="">Não se aplica</option>
                      <option value="essencial">Agente Essencial</option>
                      <option value="agenda">Agente de Agenda</option>
                      <option value="conversao">Agente de Conversão</option>
                    </select>
                  </div>
                )}
              </div>

              <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowNewRequestForm(false)}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-2 px-4 py-2 bg-[#6D7AFF] text-white rounded-lg hover:bg-[#5A67E8] transition-colors"
                >
                  <Send className="w-4 h-4" />
                  Enviar Solicitação
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Support;