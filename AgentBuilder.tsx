import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import { 
  Save, 
  Play, 
  Settings, 
  MessageSquare, 
  Zap, 
  Plus,
  ArrowRight,
  UserCog,
  Calendar,
  Target,
  ChevronDown,
  Code,
  TestTube,
  ExternalLink,
  ArrowLeft,
  CheckCircle,
  XCircle,
  AlertTriangle,
  RefreshCw,
  FileCheck,
  CheckSquare,
  Shield,
  Database
} from 'lucide-react';
import { showSuccess, showError } from '../utils/toast';
// Define Agent interface locally
interface Agent {
  id: string;
  name: string;
  type: 'essencial' | 'agenda' | 'conversao';
  status: 'active' | 'paused' | 'draft';
  lastUpdated: string;
}
import { getAgentChecklistStatus, runAgentChecklist, ChecklistItem, AgentChecklistResult } from '../services/mcpService';
import { useAuth } from '../context/AuthContext';

const AgentBuilder = () => {
  const navigate = useNavigate();
  const { userProfile } = useAuth();
  const [selectedTemplate, setSelectedTemplate] = useState('essencial');
  const [activeTab, setActiveTab] = useState('checklist');
  const [agentName, setAgentName] = useState('');
  const [agentDescription, setAgentDescription] = useState('');
  const [agents, setAgents] = useState<Agent[]>([]);
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [checklistResult, setChecklistResult] = useState<AgentChecklistResult | null>(null);
  const [isRunningChecklist, setIsRunningChecklist] = useState(false);

  useEffect(() => {
    fetchAgents();
  }, []);

  const fetchAgents = async () => {
    try {
      setIsLoading(true);
      const agentsData = await getAgents(userProfile?.id);
      setAgents(agentsData);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching agents:', error);
      showError('Erro ao carregar agentes');
      setIsLoading(false);
    }
  };

  const templates = [
    {
      id: 'essencial',
      name: 'Agente Essencial',
      description: 'Atendimento automatizado com personalização',
      icon: UserCog,
      color: 'blue'
    },
    {
      id: 'agenda',
      name: 'Agente de Agenda',
      description: 'Organização de agendamentos e lembretes',
      icon: Calendar,
      color: 'purple'
    },
    {
      id: 'conversao',
      name: 'Agente de Conversão',
      description: 'Qualificação de leads e vendas',
      icon: Target,
      color: 'green'
    }
  ];

  const tabs = [
    { id: 'checklist', label: 'Checklist', icon: FileCheck },
    { id: 'details', label: 'Detalhes', icon: TestTube }
  ];

  const handleSave = () => {
    if (!agentName.trim()) {
      showError('Por favor, insira um nome para o agente');
      return;
    }
    showSuccess('Agente salvo com sucesso!');
  };

  const handleTest = () => {
    if (!agentName.trim()) {
      showError('Por favor, salve o agente antes de testá-lo');
      return;
    }
    showSuccess('Iniciando teste do agente...');
  };

  const handleCancel = () => {
    navigate('/dashboard');
  };

  const handleAgentSelect = (agentId: string) => {
    const agent = agents.find(a => a.id === agentId);
    if (agent) {
      setSelectedAgent(agent);
      // Limpar resultado anterior do checklist
      setChecklistResult(null);
    }
  };

  const handleRunChecklist = async () => {
    if (!selectedAgent) {
      showError('Por favor, selecione um agente para executar o checklist');
      return;
    }

    setIsRunningChecklist(true);
    try {
      const result = await runAgentChecklist(selectedAgent.id);
      if (result) {
        setChecklistResult(result);
        showSuccess('Checklist concluído com sucesso!');
      } else {
        showError('Erro ao executar checklist');
      }
    } catch (error) {
      console.error('Error running checklist:', error);
      showError('Erro ao executar checklist');
    } finally {
      setIsRunningChecklist(false);
    }
  };

  const getStatusIcon = (status: ChecklistItem['status']) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'failed':
        return <XCircle className="h-5 w-5 text-red-600" />;
      case 'running':
        return <RefreshCw className="h-5 w-5 text-blue-600 animate-spin" />;
      default:
        return <CheckSquare className="h-5 w-5 text-gray-400" />;
    }
  };

  const getStatusColor = (status: ChecklistItem['status']) => {
    switch (status) {
      case 'success':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'failed':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'running':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        
        <main className="flex-1 overflow-y-auto">
          {/* Builder Header */}
          <div className="bg-white border-b border-gray-200 px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button
                  onClick={handleCancel}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <ArrowLeft className="h-5 w-5 text-gray-600" />
                </button>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">CheckList Agente</h1>
                  <p className="text-gray-600">Verifique a configuração e o status do agente antes da entrega ao cliente</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <button 
                  onClick={handleCancel}
                  className="px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors"
                >
                  Cancelar
                </button>
                <button 
                  onClick={handleRunChecklist}
                  disabled={!selectedAgent || isRunningChecklist}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isRunningChecklist ? (
                    <>
                      <RefreshCw className="h-4 w-4 animate-spin" />
                      Executando...
                    </>
                  ) : (
                    <>
                      <Play className="h-4 w-4" />
                      Executar Checklist
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          <div className="flex">
            {/* Left Panel - Agent Selection */}
            <div className="w-80 bg-white border-r border-gray-200 h-full">
              {/* Agent Selection */}
              <div className="p-6 border-b border-gray-200">
                <h3 className="font-semibold text-gray-900 mb-4">Selecionar Agente</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Agente para Verificação
                    </label>
                    <select
                      value={selectedAgent?.id || ''}
                      onChange={(e) => handleAgentSelect(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Selecione um agente</option>
                      {agents.map((agent) => (
                        <option key={agent.id} value={agent.id}>
                          {agent.name} ({agent.type})
                        </option>
                      ))}
                    </select>
                  </div>

                  {selectedAgent && (
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-medium text-gray-900 mb-2">Detalhes do Agente</h4>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-gray-700">Nome:</span>
                          <span className="text-sm text-gray-600">{selectedAgent.name}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-gray-700">Tipo:</span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            selectedAgent.type === 'essencial' ? 'bg-blue-100 text-blue-800' :
                            selectedAgent.type === 'agenda' ? 'bg-purple-100 text-purple-800' :
                            'bg-green-100 text-green-800'
                          }`}>
                            {selectedAgent.type === 'essencial' ? 'Essencial' :
                             selectedAgent.type === 'agenda' ? 'Agenda' : 'Conversão'}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-gray-700">Status:</span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            selectedAgent.status === 'active' ? 'bg-green-100 text-green-800' :
                            selectedAgent.status === 'paused' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {selectedAgent.status === 'active' ? 'Ativo' :
                             selectedAgent.status === 'paused' ? 'Pausado' : 'Rascunho'}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-gray-700">Atualizado:</span>
                          <span className="text-sm text-gray-600">
                            {new Date(selectedAgent.last_updated).toLocaleDateString('pt-BR')}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Checklist Summary */}
              {checklistResult && (
                <div className="p-6">
                  <h3 className="font-semibold text-gray-900 mb-4">Resumo do Checklist</h3>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-green-50 p-3 rounded-lg text-center">
                        <div className="text-2xl font-bold text-green-600">{checklistResult.summary.success}</div>
                        <div className="text-sm text-green-800">Aprovados</div>
                      </div>
                      <div className="bg-red-50 p-3 rounded-lg text-center">
                        <div className="text-2xl font-bold text-red-600">{checklistResult.summary.failed}</div>
                        <div className="text-sm text-red-800">Falhas</div>
                      </div>
                    </div>
                    <div className="bg-blue-50 p-3 rounded-lg text-center">
                      <div className="text-lg font-bold text-blue-600">
                        {Math.round((checklistResult.summary.success / checklistResult.summary.total) * 100)}%
                      </div>
                      <div className="text-sm text-blue-800">Taxa de Aprovação</div>
                    </div>
                    <div className="mt-4">
                      <div className="text-sm font-medium text-gray-700 mb-2">Progresso</div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div 
                          className="bg-blue-600 h-2.5 rounded-full"
                          style={{ width: `${(checklistResult.summary.success / checklistResult.summary.total) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col">
              {/* Tabs */}
              <div className="bg-white border-b border-gray-200">
                <div className="flex space-x-8 px-6">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center space-x-2 py-4 border-b-2 transition-colors ${
                        activeTab === tab.id
                          ? 'border-blue-500 text-blue-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      <tab.icon className="h-4 w-4" />
                      <span className="font-medium">{tab.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Tab Content */}
              <div className="flex-1 p-6">
                {activeTab === 'checklist' && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="max-w-4xl"
                  >
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-xl font-bold text-gray-900">Checklist de Verificação</h2>
                      {selectedAgent && !isRunningChecklist && !checklistResult && (
                        <button
                          onClick={handleRunChecklist}
                          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                        >
                          <Play className="h-4 w-4" />
                          Iniciar Verificação
                        </button>
                      )}
                    </div>

                    {!selectedAgent && (
                      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
                        <AlertTriangle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Nenhum Agente Selecionado</h3>
                        <p className="text-gray-600 mb-4">
                          Selecione um agente no painel lateral para executar o checklist de verificação.
                        </p>
                      </div>
                    )}

                    {selectedAgent && !checklistResult && !isRunningChecklist && (
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                        <div className="flex items-center gap-3 mb-4">
                          <FileCheck className="h-6 w-6 text-blue-600" />
                          <h3 className="font-semibold text-blue-900">Checklist Pronto para Execução</h3>
                        </div>
                        <p className="text-blue-700 mb-4">
                          O checklist verificará se o agente <strong>{selectedAgent.name}</strong> está configurado corretamente 
                          de acordo com o protocolo MCP e pronto para ser entregue ao cliente.
                        </p>
                        <div className="bg-white p-4 rounded-lg border border-blue-100 mb-4">
                          <h4 className="font-medium text-gray-900 mb-2">O que será verificado:</h4>
                          <ul className="space-y-2 text-sm text-gray-600">
                            <li className="flex items-center gap-2">
                              <CheckSquare className="h-4 w-4 text-blue-500" />
                              Protocolo MCP para processamento de mensagens
                            </li>
                            <li className="flex items-center gap-2">
                              <CheckSquare className="h-4 w-4 text-blue-500" />
                              Integração com sistema de memória da Anthropic
                            </li>
                            <li className="flex items-center gap-2">
                              <CheckSquare className="h-4 w-4 text-blue-500" />
                              Fluxos de conversa e reconhecimento de intenções
                            </li>
                            <li className="flex items-center gap-2">
                              <CheckSquare className="h-4 w-4 text-blue-500" />
                              Integrações (WhatsApp, Calendário, CRM)
                            </li>
                            <li className="flex items-center gap-2">
                              <CheckSquare className="h-4 w-4 text-blue-500" />
                              Performance e tratamento de erros
                            </li>
                          </ul>
                        </div>
                        <button
                          onClick={handleRunChecklist}
                          className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 font-semibold"
                        >
                          <Play className="h-4 w-4" />
                          Executar Checklist
                        </button>
                      </div>
                    )}

                    {isRunningChecklist && (
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
                        <RefreshCw className="h-12 w-12 text-blue-600 mx-auto mb-4 animate-spin" />
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Executando Checklist</h3>
                        <p className="text-gray-600 mb-4">
                          Verificando a configuração do agente <strong>{selectedAgent?.name}</strong>. 
                          Isso pode levar alguns instantes...
                        </p>
                        <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
                          <div className="bg-blue-600 h-2.5 rounded-full animate-pulse" style={{ width: '60%' }}></div>
                        </div>
                      </div>
                    )}

                    {checklistResult && (
                      <div className="space-y-6">
                        <div className="flex items-center justify-between">
                          <h3 className="font-semibold text-gray-900">Resultados do Checklist</h3>
                          <button
                            onClick={handleRunChecklist}
                            className="bg-gray-100 text-gray-700 px-3 py-1 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-1 text-sm"
                          >
                            <RefreshCw className="h-3 w-3" />
                            Executar Novamente
                          </button>
                        </div>

                        <div className="space-y-4">
                          {checklistResult.items.map((item) => (
                            <div 
                              key={item.id} 
                              className={`p-4 rounded-lg border ${
                                item.status === 'success' ? 'border-green-200 bg-green-50' :
                                item.status === 'failed' ? 'border-red-200 bg-red-50' :
                                'border-gray-200 bg-gray-50'
                              }`}
                            >
                              <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-3">
                                  {getStatusIcon(item.status)}
                                  <h4 className="font-medium text-gray-900">{item.name}</h4>
                                </div>
                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
                                  {item.status === 'success' ? 'Aprovado' :
                                   item.status === 'failed' ? 'Falha' :
                                   item.status === 'running' ? 'Executando' : 'Pendente'}
                                </span>
                              </div>
                              <p className="text-sm text-gray-600 mb-2">{item.description}</p>
                              {item.message && (
                                <div className={`p-3 rounded-lg text-sm ${
                                  item.status === 'success' ? 'bg-green-100 text-green-800' :
                                  item.status === 'failed' ? 'bg-red-100 text-red-800' :
                                  'bg-gray-100 text-gray-800'
                                }`}>
                                  {item.message}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>

                        {checklistResult.summary.failed > 0 && (
                          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                            <div className="flex items-center gap-2 mb-2">
                              <AlertTriangle className="h-5 w-5 text-red-600" />
                              <h4 className="font-medium text-red-900">Atenção: Falhas Encontradas</h4>
                            </div>
                            <p className="text-sm text-red-700">
                              Foram encontradas {checklistResult.summary.failed} falhas no checklist. 
                              Por favor, corrija os problemas antes de entregar o agente ao cliente.
                            </p>
                          </div>
                        )}

                        {checklistResult.summary.failed === 0 && (
                          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                            <div className="flex items-center gap-2 mb-2">
                              <CheckCircle className="h-5 w-5 text-green-600" />
                              <h4 className="font-medium text-green-900">Agente Aprovado</h4>
                            </div>
                            <p className="text-sm text-green-700">
                              Todas as verificações foram aprovadas! O agente está pronto para ser entregue ao cliente.
                            </p>
                          </div>
                        )}
                      </div>
                    )}
                  </motion.div>
                )}

                {activeTab === 'details' && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <h2 className="text-xl font-bold text-gray-900 mb-6">Detalhes do Protocolo MCP</h2>
                    
                    <div className="space-y-6">
                      <div className="bg-white border border-gray-200 rounded-lg p-6">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="bg-blue-100 p-3 rounded-lg">
                            <Shield className="h-6 w-6 text-blue-600" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900">Protocolo MCP</h3>
                            <p className="text-sm text-gray-600">Memory, Context, Personalization</p>
                          </div>
                        </div>
                        <p className="text-gray-700 mb-4">
                          O protocolo MCP é um conjunto de práticas e configurações para garantir que os agentes 
                          de IA mantenham contexto, memória e personalização consistentes durante as interações.
                        </p>
                        <div className="space-y-4">
                          <div className="bg-gray-50 p-4 rounded-lg">
                            <h4 className="font-medium text-gray-900 mb-2">Memória (Memory)</h4>
                            <p className="text-sm text-gray-600">
                              Utiliza o sistema de memória da Anthropic para manter contexto de longo prazo, 
                              permitindo que o agente se lembre de interações anteriores e informações relevantes 
                              sobre o usuário.
                            </p>
                          </div>
                          <div className="bg-gray-50 p-4 rounded-lg">
                            <h4 className="font-medium text-gray-900 mb-2">Contexto (Context)</h4>
                            <p className="text-sm text-gray-600">
                              Mantém o contexto da conversa atual, incluindo o histórico recente de mensagens, 
                              intenções detectadas e entidades extraídas, permitindo respostas coerentes.
                            </p>
                          </div>
                          <div className="bg-gray-50 p-4 rounded-lg">
                            <h4 className="font-medium text-gray-900 mb-2">Personalização (Personalization)</h4>
                            <p className="text-sm text-gray-600">
                              Adapta as respostas com base no perfil do usuário, preferências detectadas e 
                              comportamentos anteriores, criando uma experiência personalizada.
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="bg-white border border-gray-200 rounded-lg p-6">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="bg-purple-100 p-3 rounded-lg">
                            <Database className="h-6 w-6 text-purple-600" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900">Integração Anthropic</h3>
                            <p className="text-sm text-gray-600">Sistema de Memória Adquirida</p>
                          </div>
                        </div>
                        <p className="text-gray-700 mb-4">
                          A integração com o sistema de memória da Anthropic permite que o agente mantenha 
                          contexto de longo prazo, criando uma experiência mais natural e personalizada.
                        </p>
                        <div className="space-y-3">
                          <div className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-green-600" />
                            <span className="text-sm text-gray-700">Memória de longo prazo para contexto persistente</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-green-600" />
                            <span className="text-sm text-gray-700">Armazenamento seguro e criptografado de dados</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-green-600" />
                            <span className="text-sm text-gray-700">Recuperação inteligente de informações relevantes</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-green-600" />
                            <span className="text-sm text-gray-700">Esquecimento programado de informações obsoletas</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-green-600" />
                            <span className="text-sm text-gray-700">Conformidade com LGPD e políticas de privacidade</span>
                          </div>
                        </div>
                      </div>

                      <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-lg p-6 text-white">
                        <h3 className="font-semibold mb-4">Requisitos Específicos por Tipo de Agente</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="bg-white/10 p-4 rounded-lg">
                            <h4 className="font-medium mb-2 text-blue-300">Agente Essencial</h4>
                            <ul className="space-y-1 text-sm text-gray-300">
                              <li>• Memória básica de contexto</li>
                              <li>• Integração WhatsApp</li>
                              <li>• Respostas personalizadas</li>
                            </ul>
                          </div>
                          <div className="bg-white/10 p-4 rounded-lg">
                            <h4 className="font-medium mb-2 text-purple-300">Agente Agenda</h4>
                            <ul className="space-y-1 text-sm text-gray-300">
                              <li>• Memória avançada</li>
                              <li>• Integração Google Calendar</li>
                              <li>• Lembretes automáticos</li>
                              <li>• Confirmações de agendamento</li>
                            </ul>
                          </div>
                          <div className="bg-white/10 p-4 rounded-lg">
                            <h4 className="font-medium mb-2 text-green-300">Agente Conversão</h4>
                            <ul className="space-y-1 text-sm text-gray-300">
                              <li>• Memória premium</li>
                              <li>• Integração CRM</li>
                              <li>• Pontuação de leads</li>
                              <li>• Análise de sentimento</li>
                              <li>• Transferência inteligente</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AgentBuilder;