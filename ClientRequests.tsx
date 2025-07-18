import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Sidebar from '../../components/Sidebar';
import Header from '../../components/Header';
import { 
  MessageSquare, 
  Search, 
  Filter, 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  RefreshCw,
  Eye,
  Edit,
  User,
  Calendar,
  Tag
} from 'lucide-react';
import { showError, showSuccess } from '../../utils/toast';

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

interface UserData {
  id: string;
  email: string;
  fullName: string;
  plan?: 'essencial' | 'agenda' | 'conversao';
}

const ClientRequests = () => {
  const [requests, setRequests] = useState<ClientRequest[]>([]);
  const [users, setUsers] = useState<{ [key: string]: UserData }>({});
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterType, setFilterType] = useState<string>('all');
  const [selectedRequest, setSelectedRequest] = useState<ClientRequest | null>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchRequests();
    fetchUsers();
  }, []);

  const fetchRequests = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/client-requests');
      if (response.ok) {
        const data = await response.json();
        setRequests(data);
      } else {
        throw new Error('Erro ao carregar solicitações');
      }
    } catch (error: any) {
      showError(error.message || 'Erro ao carregar solicitações');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/admin/users');
      if (response.ok) {
        const data = await response.json();
        const usersMap = data.reduce((acc: any, user: any) => {
          acc[user.id] = user;
          return acc;
        }, {});
        setUsers(usersMap);
      }
    } catch (error) {
      console.error('Erro ao carregar usuários:', error);
    }
  };

  const updateRequestStatus = async (requestId: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/client-requests/${requestId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (response.ok) {
        await fetchRequests();
        showSuccess('Status atualizado com sucesso!');
        setShowModal(false);
      } else {
        throw new Error('Erro ao atualizar status');
      }
    } catch (error: any) {
      showError(error.message || 'Erro ao atualizar status');
    }
  };

  const getStatusBadge = (status: string) => {
    const badges = {
      open: { color: 'bg-blue-100 text-blue-800', icon: Clock, text: 'Aberto' },
      in_progress: { color: 'bg-yellow-100 text-yellow-800', icon: Clock, text: 'Em Andamento' },
      resolved: { color: 'bg-green-100 text-green-800', icon: CheckCircle, text: 'Resolvido' },
      closed: { color: 'bg-gray-100 text-gray-800', icon: XCircle, text: 'Fechado' }
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
    const user = users[request.userId];
    const matchesSearch = !searchTerm || 
      request.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user && user.email.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = filterStatus === 'all' || request.status === filterStatus;
    const matchesType = filterType === 'all' || request.type === filterType;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  const handleViewRequest = (request: ClientRequest) => {
    setSelectedRequest(request);
    setShowModal(true);
  };

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
            className="max-w-7xl mx-auto"
          >
            {/* Header Section */}
            <div className="flex justify-between items-center mb-8">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Solicitações de Clientes</h1>
                <p className="text-gray-600 mt-2">Gerencie tickets e solicitações de suporte</p>
              </div>
              
              <button
                onClick={fetchRequests}
                className="flex items-center gap-2 px-4 py-2 bg-[#6D7AFF] text-white rounded-lg hover:bg-[#5A67E8] transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                Atualizar
              </button>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-lg shadow p-6 mb-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Buscar solicitações..."
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
                
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6D7AFF] focus:border-transparent"
                >
                  <option value="all">Todos os Tipos</option>
                  <option value="support">Suporte</option>
                  <option value="feature">Funcionalidade</option>
                  <option value="bug">Bug</option>
                  <option value="billing">Cobrança</option>
                  <option value="integration">Integração</option>
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
                  <p className="text-gray-600">Carregando solicitações...</p>
                </div>
              ) : filteredRequests.length === 0 ? (
                <div className="p-8 text-center">
                  <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">Nenhuma solicitação encontrada</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Cliente
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Solicitação
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Tipo
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Prioridade
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Data
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Ações
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredRequests.map((request) => {
                        const user = users[request.userId];
                        return (
                          <tr key={request.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <User className="w-8 h-8 text-gray-400 mr-3" />
                                <div>
                                  <div className="text-sm font-medium text-gray-900">
                                    {user?.fullName || 'Usuário'}
                                  </div>
                                  <div className="text-sm text-gray-500">
                                    {user?.email || request.userId}
                                  </div>
                                  {user?.plan && (
                                    <div className="text-xs text-blue-600 capitalize">
                                      {user.plan}
                                    </div>
                                  )}
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="text-sm font-medium text-gray-900">
                                {request.title}
                              </div>
                              <div className="text-sm text-gray-500 truncate max-w-xs">
                                {request.description}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              {getTypeBadge(request.type)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              {getPriorityBadge(request.priority)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              {getStatusBadge(request.status)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              <div className="flex items-center">
                                <Calendar className="w-4 h-4 mr-1" />
                                {formatDate(request.createdAt)}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              <button
                                onClick={() => handleViewRequest(request)}
                                className="text-[#6D7AFF] hover:text-[#5A67E8] mr-3"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Request Detail Modal */}
      {showModal && selectedRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {selectedRequest.title}
                  </h3>
                  <div className="flex items-center gap-2 mt-2">
                    {getTypeBadge(selectedRequest.type)}
                    {getPriorityBadge(selectedRequest.priority)}
                    {getStatusBadge(selectedRequest.status)}
                  </div>
                </div>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XCircle className="w-6 h-6" />
                </button>
              </div>
            </div>

            <div className="p-6">
              <div className="mb-6">
                <h4 className="text-sm font-medium text-gray-900 mb-2">Cliente:</h4>
                <div className="flex items-center">
                  <User className="w-5 h-5 text-gray-400 mr-2" />
                  <div>
                    <div className="text-sm font-medium">
                      {users[selectedRequest.userId]?.fullName || 'Usuário'}
                    </div>
                    <div className="text-sm text-gray-500">
                      {users[selectedRequest.userId]?.email || selectedRequest.userId}
                    </div>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <h4 className="text-sm font-medium text-gray-900 mb-2">Descrição:</h4>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-700 whitespace-pre-wrap">
                    {selectedRequest.description}
                  </p>
                </div>
              </div>

              {selectedRequest.agentType && (
                <div className="mb-6">
                  <h4 className="text-sm font-medium text-gray-900 mb-2">Tipo de Agente:</h4>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 capitalize">
                    {selectedRequest.agentType}
                  </span>
                </div>
              )}

              <div className="mb-6">
                <h4 className="text-sm font-medium text-gray-900 mb-2">Datas:</h4>
                <div className="text-sm text-gray-600 space-y-1">
                  <div>Criado em: {formatDate(selectedRequest.createdAt)}</div>
                  <div>Atualizado em: {formatDate(selectedRequest.updatedAt)}</div>
                </div>
              </div>

              <div className="flex gap-3">
                <select
                  onChange={(e) => updateRequestStatus(selectedRequest.id, e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6D7AFF] focus:border-transparent"
                  defaultValue={selectedRequest.status}
                >
                  <option value="open">Aberto</option>
                  <option value="in_progress">Em Andamento</option>
                  <option value="resolved">Resolvido</option>
                  <option value="closed">Fechado</option>
                </select>
                <button
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Fechar
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default ClientRequests;