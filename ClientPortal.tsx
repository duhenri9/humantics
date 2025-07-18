import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  User, 
  Building, 
  Mail, 
  Phone, 
  Target,
  CheckCircle,
  Clock,
  AlertCircle,
  FileText,
  CreditCard,
  Zap,
  MessageSquare,
  ExternalLink,
  Settings,
  BarChart3,
  Calendar,
  Smartphone,
  Globe,
  Database,
  Wrench,
  Play,
  CheckSquare,
  ArrowRight,
  Send,
  Star,
  TrendingUp
} from 'lucide-react';
import { useClient } from '../context/ClientContext';
import toast from 'react-hot-toast';

const ClientPortal = () => {
  const { clienteId, clientData, setClientData } = useClient();
  const [activeSection, setActiveSection] = useState('entrada');
  const [journeyStatus, setJourneyStatus] = useState({
    proposta: 'pending' as 'pending' | 'approved' | 'rejected',
    contrato: 'pending' as 'pending' | 'signed' | 'waiting',
    pagamento: 'pending' as 'pending' | 'paid' | 'overdue',
    ativacao: 'pending' as 'pending' | 'active' | 'inactive'
  });

  // Form states
  const [entradaForm, setEntradaForm] = useState({
    nome_cliente: '',
    nome_empresa: '',
    email: '',
    whatsapp: '',
    plano: 'essencial' as 'essencial' | 'agenda' | 'conversao',
    objetivo: ''
  });

  const [ajusteForm, setAjusteForm] = useState({
    tipo_ajuste: '',
    mensagem: '',
    prioridade: 'media' as 'baixa' | 'media' | 'alta'
  });

  const [selectedIntegrations, setSelectedIntegrations] = useState<string[]>([]);

  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 }
  };

  // Load client status
  useEffect(() => {
    if (clienteId) {
      fetchClientStatus();
    }
  }, [clienteId]);

  const fetchClientStatus = async () => {
    try {
      const response = await fetch(`/api/status?cliente_id=${clienteId}`);
      if (response.ok) {
        const status = await response.json();
        setJourneyStatus(status);
      }
    } catch (error) {
      console.error('Error fetching client status:', error);
    }
  };

  const handleEntradaSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const response = await fetch('/webhook/entrada-cliente', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(entradaForm),
      });

      if (response.ok) {
        const result = await response.json();
        const newClientData = {
          id: result.cliente_id || Date.now().toString(),
          ...entradaForm
        };
        
        setClientData(newClientData);
        toast.success('Dados enviados com sucesso! Você receberá nossa proposta em breve.');
        setActiveSection('jornada');
      } else {
        throw new Error('Erro ao enviar dados');
      }
    } catch (error) {
      toast.error('Erro ao enviar dados. Tente novamente.');
      console.error('Error submitting entrada form:', error);
    }
  };

  const handleAjusteSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const response = await fetch('/webhook/followup-ajuste', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          cliente_id: clienteId,
          ...ajusteForm
        }),
      });

      if (response.ok) {
        toast.success('Solicitação de ajuste enviada com sucesso!');
        setAjusteForm({ tipo_ajuste: '', mensagem: '', prioridade: 'media' });
      } else {
        throw new Error('Erro ao enviar ajuste');
      }
    } catch (error) {
      toast.error('Erro ao enviar solicitação. Tente novamente.');
      console.error('Error submitting ajuste form:', error);
    }
  };

  const handleIntegrationSubmit = async () => {
    if (selectedIntegrations.length === 0) {
      toast.error('Selecione pelo menos uma integração');
      return;
    }

    try {
      const response = await fetch('/webhook/solicitacao-integracao', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          cliente_id: clienteId,
          integracoes: selectedIntegrations
        }),
      });

      if (response.ok) {
        toast.success('Solicitação de integração enviada com sucesso!');
        setSelectedIntegrations([]);
      } else {
        throw new Error('Erro ao solicitar integração');
      }
    } catch (error) {
      toast.error('Erro ao solicitar integração. Tente novamente.');
      console.error('Error submitting integration request:', error);
    }
  };

  const handleRevisaoAgente = async () => {
    try {
      const response = await fetch('/webhook/revisao-agente', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          cliente_id: clienteId
        }),
      });

      if (response.ok) {
        toast.success('Solicitação de revisão enviada com sucesso!');
      } else {
        throw new Error('Erro ao solicitar revisão');
      }
    } catch (error) {
      toast.error('Erro ao solicitar revisão. Tente novamente.');
      console.error('Error requesting agent review:', error);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
      case 'signed':
      case 'paid':
      case 'active':
        return <CheckCircle className="h-6 w-6 text-green-600" />;
      case 'pending':
      case 'waiting':
        return <Clock className="h-6 w-6 text-yellow-600" />;
      case 'rejected':
      case 'overdue':
      case 'inactive':
        return <AlertCircle className="h-6 w-6 text-red-600" />;
      default:
        return <Clock className="h-6 w-6 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
      case 'signed':
      case 'paid':
      case 'active':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'pending':
      case 'waiting':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'rejected':
      case 'overdue':
      case 'inactive':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusText = (step: string, status: string) => {
    const statusMap: Record<string, Record<string, string>> = {
      proposta: {
        pending: 'Aguardando análise',
        approved: 'Proposta aprovada',
        rejected: 'Proposta rejeitada'
      },
      contrato: {
        pending: 'Aguardando assinatura',
        signed: 'Contrato assinado',
        waiting: 'Aguardando documentos'
      },
      pagamento: {
        pending: 'Aguardando pagamento',
        paid: 'Pagamento confirmado',
        overdue: 'Pagamento em atraso'
      },
      ativacao: {
        pending: 'Aguardando ativação',
        active: 'Agente ativo',
        inactive: 'Agente inativo'
      }
    };
    
    return statusMap[step]?.[status] || 'Status desconhecido';
  };

  const planoFeatures = {
    essencial: {
      name: 'Agente Essencial',
      color: 'primary',
      features: ['Atendimento 24/7', 'WhatsApp', 'Dashboard básico']
    },
    agenda: {
      name: 'Agente de Agenda',
      color: 'accent',
      features: ['Agendamentos', 'Google Calendar', 'Lembretes', 'Pré-triagem']
    },
    conversao: {
      name: 'Agente de Conversão',
      color: 'green',
      features: ['Qualificação de leads', 'CRM', 'Analytics avançado', 'Scoring']
    }
  };

  const integrationOptions = [
    { id: 'google-sheets', name: 'Google Sheets', icon: Database, description: 'Sincronizar dados com planilhas' },
    { id: 'google-calendar', name: 'Google Calendar', icon: Calendar, description: 'Integração com agenda' },
    { id: 'crm', name: 'CRM', icon: Users, description: 'Conectar com seu CRM' },
    { id: 'zapier', name: 'Zapier', icon: Zap, description: 'Automações avançadas' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Portal do Cliente</h1>
            {clientData && (
              <p className="text-gray-600">Olá, {clientData.nome_cliente}!</p>
            )}
          </div>
          <div className="flex items-center space-x-4">
            {clientData && (
              <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                clientData.plano === 'essencial' ? 'bg-blue-100 text-blue-800' :
                clientData.plano === 'agenda' ? 'bg-purple-100 text-purple-800' :
                'bg-green-100 text-green-800'
              }`}>
                {planoFeatures[clientData.plano].name}
              </div>
            )}
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation */}
        <div className="mb-8">
          <nav className="flex space-x-8">
            {[
              { id: 'entrada', label: 'Cadastro', icon: User },
              { id: 'jornada', label: 'Jornada', icon: TrendingUp },
              { id: 'teste', label: 'Teste do Agente', icon: Play },
              { id: 'ajustes', label: 'Ajustes', icon: Settings },
              { id: 'integracoes', label: 'Integrações', icon: Wrench },
              { id: 'relatorio', label: 'Relatórios', icon: BarChart3 }
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                  activeSection === item.id
                    ? 'bg-blue-100 text-blue-600 border border-blue-200'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`}
              >
                <item.icon className="h-4 w-4" />
                <span className="font-medium">{item.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <motion.div
          key={activeSection}
          initial="initial"
          animate="animate"
          variants={fadeInUp}
        >
          {/* Formulário de Entrada */}
          {activeSection === 'entrada' && (
            <div className="bg-white rounded-xl border border-gray-200 p-8">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Cadastro Inicial</h2>
                <p className="text-gray-600">Preencha seus dados para começar sua jornada com a HumanTic</p>
              </div>

              <form onSubmit={handleEntradaSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nome Completo *
                    </label>
                    <input
                      type="text"
                      required
                      value={entradaForm.nome_cliente}
                      onChange={(e) => setEntradaForm({...entradaForm, nome_cliente: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Seu nome completo"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nome da Empresa *
                    </label>
                    <input
                      type="text"
                      required
                      value={entradaForm.nome_empresa}
                      onChange={(e) => setEntradaForm({...entradaForm, nome_empresa: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Nome da sua empresa"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      E-mail *
                    </label>
                    <input
                      type="email"
                      required
                      value={entradaForm.email}
                      onChange={(e) => setEntradaForm({...entradaForm, email: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="seu@email.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      WhatsApp *
                    </label>
                    <input
                      type="tel"
                      required
                      value={entradaForm.whatsapp}
                      onChange={(e) => setEntradaForm({...entradaForm, whatsapp: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="+55 11 99999-9999"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Plano Escolhido *
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {Object.entries(planoFeatures).map(([key, plano]) => (
                      <div
                        key={key}
                        onClick={() => setEntradaForm({...entradaForm, plano: key as any})}
                        className={`p-4 border rounded-lg cursor-pointer transition-all ${
                          entradaForm.plano === key
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <h3 className="font-semibold text-gray-900 mb-2">{plano.name}</h3>
                        <ul className="text-sm text-gray-600 space-y-1">
                          {plano.features.map((feature, idx) => (
                            <li key={idx} className="flex items-center gap-2">
                              <CheckCircle className="h-3 w-3 text-green-500" />
                              {feature}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Objetivo Principal *
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={entradaForm.objetivo}
                    onChange={(e) => setEntradaForm({...entradaForm, objetivo: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Descreva qual é o seu principal objetivo com o agente digital..."
                  />
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 font-semibold"
                  >
                    <Send className="h-4 w-4" />
                    Enviar Cadastro
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Painel da Jornada */}
          {activeSection === 'jornada' && (
            <div className="space-y-8">
              <div className="bg-white rounded-xl border border-gray-200 p-8">
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Sua Jornada</h2>
                  <p className="text-gray-600">Acompanhe o progresso da implementação do seu agente</p>
                </div>

                {/* Timeline */}
                <div className="relative">
                  <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gray-200"></div>
                  
                  <div className="space-y-8">
                    {[
                      { key: 'proposta', title: 'Proposta', icon: FileText, description: 'Análise e elaboração da proposta personalizada' },
                      { key: 'contrato', title: 'Contrato', icon: CheckSquare, description: 'Assinatura do contrato e documentação' },
                      { key: 'pagamento', title: 'Pagamento', icon: CreditCard, description: 'Processamento do pagamento e ativação' },
                      { key: 'ativacao', title: 'Ativação', icon: Zap, description: 'Configuração e ativação do seu agente' }
                    ].map((step, index) => (
                      <div key={step.key} className="relative flex items-start">
                        <div className={`relative z-10 flex items-center justify-center w-16 h-16 rounded-full border-4 ${
                          journeyStatus[step.key as keyof typeof journeyStatus] === 'approved' ||
                          journeyStatus[step.key as keyof typeof journeyStatus] === 'signed' ||
                          journeyStatus[step.key as keyof typeof journeyStatus] === 'paid' ||
                          journeyStatus[step.key as keyof typeof journeyStatus] === 'active'
                            ? 'bg-green-100 border-green-500'
                            : journeyStatus[step.key as keyof typeof journeyStatus] === 'pending' ||
                              journeyStatus[step.key as keyof typeof journeyStatus] === 'waiting'
                            ? 'bg-yellow-100 border-yellow-500'
                            : 'bg-gray-100 border-gray-300'
                        }`}>
                          {getStatusIcon(journeyStatus[step.key as keyof typeof journeyStatus])}
                        </div>
                        
                        <div className="ml-6 flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="text-lg font-semibold text-gray-900">{step.title}</h3>
                            <span className={`px-3 py-1 rounded-full text-sm font-medium border ${
                              getStatusColor(journeyStatus[step.key as keyof typeof journeyStatus])
                            }`}>
                              {getStatusText(step.key, journeyStatus[step.key as keyof typeof journeyStatus])}
                            </span>
                          </div>
                          <p className="text-gray-600">{step.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Teste do Agente */}
          {activeSection === 'teste' && (
            <div className="space-y-6">
              <div className="bg-white rounded-xl border border-gray-200 p-8">
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Teste seu Agente</h2>
                  <p className="text-gray-600">Experimente seu agente digital em ação</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <div className="p-6 border border-gray-200 rounded-lg">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="bg-blue-100 p-2 rounded-lg">
                        <Globe className="h-6 w-6 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">Webchat</h3>
                        <p className="text-sm text-gray-600">Teste no navegador</p>
                      </div>
                    </div>
                    <button className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2">
                      <ExternalLink className="h-4 w-4" />
                      Abrir Webchat
                    </button>
                  </div>

                  <div className="p-6 border border-gray-200 rounded-lg">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="bg-green-100 p-2 rounded-lg">
                        <Smartphone className="h-6 w-6 text-green-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">WhatsApp</h3>
                        <p className="text-sm text-gray-600">Teste no WhatsApp</p>
                      </div>
                    </div>
                    <button className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2">
                      <ExternalLink className="h-4 w-4" />
                      Abrir WhatsApp
                    </button>
                  </div>
                </div>

                {/* Tutorial e Checklist */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="p-6 bg-gray-50 rounded-lg">
                    <h3 className="font-semibold text-gray-900 mb-4">Vídeo Tutorial</h3>
                    <div className="aspect-video bg-gray-200 rounded-lg flex items-center justify-center mb-4">
                      <Play className="h-12 w-12 text-gray-400" />
                    </div>
                    <button className="w-full bg-gray-800 text-white py-2 rounded-lg hover:bg-gray-900 transition-colors">
                      Assistir Tutorial
                    </button>
                  </div>

                  <div className="p-6 bg-gray-50 rounded-lg">
                    <h3 className="font-semibold text-gray-900 mb-4">Checklist de Testes</h3>
                    <div className="space-y-3 mb-4">
                      {[
                        'Teste de saudação inicial',
                        'Verificar respostas automáticas',
                        'Testar transferência para humano',
                        'Validar integração WhatsApp',
                        'Confirmar horário de funcionamento'
                      ].map((item, index) => (
                        <div key={index} className="flex items-center gap-3">
                          <CheckSquare className="h-4 w-4 text-gray-400" />
                          <span className="text-sm text-gray-700">{item}</span>
                        </div>
                      ))}
                    </div>
                    <button className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors">
                      Abrir Checklist Completo
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Formulário de Ajustes */}
          {activeSection === 'ajustes' && (
            <div className="bg-white rounded-xl border border-gray-200 p-8">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Solicitar Ajustes</h2>
                <p className="text-gray-600">Precisa de algum ajuste no seu agente? Nos conte aqui!</p>
              </div>

              <form onSubmit={handleAjusteSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tipo de Ajuste *
                  </label>
                  <select
                    required
                    value={ajusteForm.tipo_ajuste}
                    onChange={(e) => setAjusteForm({...ajusteForm, tipo_ajuste: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Selecione o tipo de ajuste</option>
                    <option value="personalidade">Personalidade do agente</option>
                    <option value="respostas">Respostas automáticas</option>
                    <option value="fluxo">Fluxo de conversa</option>
                    <option value="integracao">Integração</option>
                    <option value="horario">Horário de funcionamento</option>
                    <option value="outro">Outro</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Descrição do Ajuste *
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={ajusteForm.mensagem}
                    onChange={(e) => setAjusteForm({...ajusteForm, mensagem: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Descreva detalhadamente o ajuste que você gostaria de fazer..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Prioridade
                  </label>
                  <div className="flex space-x-4">
                    {[
                      { value: 'baixa', label: 'Baixa', color: 'green' },
                      { value: 'media', label: 'Média', color: 'yellow' },
                      { value: 'alta', label: 'Alta', color: 'red' }
                    ].map((priority) => (
                      <label key={priority.value} className="flex items-center">
                        <input
                          type="radio"
                          name="prioridade"
                          value={priority.value}
                          checked={ajusteForm.prioridade === priority.value}
                          onChange={(e) => setAjusteForm({...ajusteForm, prioridade: e.target.value as any})}
                          className="mr-2"
                        />
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                          priority.color === 'green' ? 'bg-green-100 text-green-800' :
                          priority.color === 'yellow' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {priority.label}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 font-semibold"
                  >
                    <Send className="h-4 w-4" />
                    Enviar Solicitação
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Integrações */}
          {activeSection === 'integracoes' && (
            <div className="bg-white rounded-xl border border-gray-200 p-8">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Integrações Opcionais</h2>
                <p className="text-gray-600">Conecte seu agente com outras ferramentas</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {integrationOptions.map((integration) => (
                  <div
                    key={integration.id}
                    onClick={() => {
                      if (selectedIntegrations.includes(integration.id)) {
                        setSelectedIntegrations(selectedIntegrations.filter(id => id !== integration.id));
                      } else {
                        setSelectedIntegrations([...selectedIntegrations, integration.id]);
                      }
                    }}
                    className={`p-6 border rounded-lg cursor-pointer transition-all ${
                      selectedIntegrations.includes(integration.id)
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className="bg-gray-100 p-2 rounded-lg">
                        <integration.icon className="h-6 w-6 text-gray-600" />
                      </div>
                      <h3 className="font-semibold text-gray-900">{integration.name}</h3>
                    </div>
                    <p className="text-sm text-gray-600">{integration.description}</p>
                  </div>
                ))}
              </div>

              <div className="flex justify-end">
                <button
                  onClick={handleIntegrationSubmit}
                  disabled={selectedIntegrations.length === 0}
                  className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="h-4 w-4" />
                  Solicitar Integrações ({selectedIntegrations.length})
                </button>
              </div>
            </div>
          )}

          {/* Relatórios */}
          {activeSection === 'relatorio' && (
            <div className="space-y-6">
              <div className="bg-white rounded-xl border border-gray-200 p-8">
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Relatórios e Analytics</h2>
                  <p className="text-gray-600">Acompanhe a performance do seu agente</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-6 border border-gray-200 rounded-lg">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="bg-blue-100 p-2 rounded-lg">
                        <BarChart3 className="h-6 w-6 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">Dashboard Metabase</h3>
                        <p className="text-sm text-gray-600">Relatórios detalhados</p>
                      </div>
                    </div>
                    <button className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2">
                      <ExternalLink className="h-4 w-4" />
                      Abrir Dashboard
                    </button>
                  </div>

                  <div className="p-6 border border-gray-200 rounded-lg">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="bg-purple-100 p-2 rounded-lg">
                        <Settings className="h-6 w-6 text-purple-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">Revisão de Comportamento</h3>
                        <p className="text-sm text-gray-600">Otimização mensal</p>
                      </div>
                    </div>
                    <button
                      onClick={handleRevisaoAgente}
                      className="w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center gap-2"
                    >
                      <Star className="h-4 w-4" />
                      Solicitar Revisão
                    </button>
                  </div>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {[
                  { label: 'Conversas este mês', value: '1,247', icon: MessageSquare, color: 'blue' },
                  { label: 'Taxa de resolução', value: '94%', icon: CheckCircle, color: 'green' },
                  { label: 'Tempo médio', value: '2.3min', icon: Clock, color: 'yellow' },
                  { label: 'Satisfação', value: '4.8/5', icon: Star, color: 'purple' }
                ].map((stat, index) => (
                  <div key={index} className="bg-white p-6 rounded-lg border border-gray-200">
                    <div className={`inline-flex p-2 rounded-lg mb-3 ${
                      stat.color === 'blue' ? 'bg-blue-100' :
                      stat.color === 'green' ? 'bg-green-100' :
                      stat.color === 'yellow' ? 'bg-yellow-100' :
                      'bg-purple-100'
                    }`}>
                      <stat.icon className={`h-5 w-5 ${
                        stat.color === 'blue' ? 'text-blue-600' :
                        stat.color === 'green' ? 'text-green-600' :
                        stat.color === 'yellow' ? 'text-yellow-600' :
                        'text-purple-600'
                      }`} />
                    </div>
                    <p className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</p>
                    <p className="text-sm text-gray-600">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default ClientPortal;