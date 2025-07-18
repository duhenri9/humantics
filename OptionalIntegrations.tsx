import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Database, 
  Calendar, 
  Users, 
  Zap, 
  Send, 
  CheckCircle,
  ExternalLink,
  Settings,
  Smartphone,
  Mail,
  Globe,
  BarChart3,
  CreditCard
} from 'lucide-react';
import { useClient } from '../../context/ClientContext';
import { showSuccess, showError } from '../../utils/toast';
import { getWebhookUrl } from '../../utils/deployConfig';

const OptionalIntegrations = () => {
  const { clienteId, clientData } = useClient();
  const [selectedIntegrations, setSelectedIntegrations] = useState<string[]>([]);
  const [selectedPaymentGateway, setSelectedPaymentGateway] = useState<'stripe' | 'asaas' | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const integrationOptions = [
    {
      id: 'google-sheets',
      name: 'Google Sheets',
      description: 'Sincronizar dados de conversas e leads com planilhas',
      icon: Database,
      features: ['Exportação automática de leads', 'Relatórios em tempo real', 'Backup de conversas'],
      complexity: 'Simples',
      timeToImplement: '1-2 dias',
      availableFor: ['essencial', 'agenda', 'conversao'],
      popular: false
    },
    {
      id: 'google-calendar',
      name: 'Google Calendar',
      description: 'Integração completa com agenda para agendamentos',
      icon: Calendar,
      features: ['Agendamento automático', 'Sincronização bidirecional', 'Lembretes automáticos'],
      complexity: 'Médio',
      timeToImplement: '2-3 dias',
      availableFor: ['agenda', 'conversao'],
      popular: true
    },
    {
      id: 'crm-hubspot',
      name: 'CRM (HubSpot)',
      description: 'Conectar com HubSpot para gestão de leads',
      icon: Users,
      features: ['Criação automática de contatos', 'Histórico de conversas', 'Pipeline de vendas'],
      complexity: 'Avançado',
      timeToImplement: '3-5 dias',
      availableFor: ['conversao'],
      popular: true
    },
    {
      id: 'crm-pipedrive',
      name: 'CRM (Pipedrive)',
      description: 'Integração com Pipedrive para vendas',
      icon: Users,
      features: ['Gestão de pipeline', 'Automação de follow-up', 'Relatórios de conversão'],
      complexity: 'Avançado',
      timeToImplement: '3-5 dias',
      availableFor: ['conversao'],
      popular: false
    },
    {
      id: 'zapier',
      name: 'Zapier',
      description: 'Conectar com milhares de aplicativos via Zapier',
      icon: Zap,
      features: ['Automações personalizadas', '3000+ integrações', 'Workflows complexos'],
      complexity: 'Avançado',
      timeToImplement: '2-4 dias',
      availableFor: ['essencial', 'agenda', 'conversao'],
      popular: false
    },
    {
      id: 'email-marketing',
      name: 'Email Marketing',
      description: 'Integração com Mailchimp, RD Station, etc.',
      icon: Mail,
      features: ['Captura de leads', 'Automação de email', 'Segmentação'],
      complexity: 'Médio',
      timeToImplement: '2-3 dias',
      availableFor: ['agenda', 'conversao'],
      popular: false
    },
    {
      id: 'analytics',
      name: 'Google Analytics',
      description: 'Rastreamento avançado de conversões',
      icon: BarChart3,
      features: ['Eventos personalizados', 'Funil de conversão', 'ROI tracking'],
      complexity: 'Médio',
      timeToImplement: '1-2 dias',
      availableFor: ['essencial', 'agenda', 'conversao'],
      popular: false
    },
    {
      id: 'website',
      name: 'Website/Landing Page',
      description: 'Embed do chat no seu site',
      icon: Globe,
      features: ['Widget responsivo', 'Customização visual', 'Múltiplas páginas'],
      complexity: 'Simples',
      timeToImplement: '1 dia',
      availableFor: ['essencial', 'agenda', 'conversao'],
      popular: true
    }
  ];

  const paymentGateways = [
    {
      id: 'stripe',
      name: 'Stripe',
      description: 'Processamento de pagamentos internacionais',
      icon: CreditCard,
      features: ['Cartão de crédito internacional', 'Assinaturas recorrentes', 'Dashboard completo'],
      complexity: 'Médio',
      timeToImplement: '2-3 dias'
    },
    {
      id: 'asaas',
      name: 'Asaas',
      description: 'Processamento de pagamentos nacionais',
      icon: CreditCard,
      features: ['Boleto bancário', 'PIX', 'Cartão de crédito nacional', 'Carnês'],
      complexity: 'Médio',
      timeToImplement: '2-3 dias'
    }
  ];

  const handleIntegrationToggle = (integrationId: string) => {
    setSelectedIntegrations(prev => 
      prev.includes(integrationId)
        ? prev.filter(id => id !== integrationId)
        : [...prev, integrationId]
    );
  };

  const handlePaymentGatewaySelect = (gateway: 'stripe' | 'asaas') => {
    setSelectedPaymentGateway(gateway);
  };

  const handleSubmit = async () => {
    if (selectedIntegrations.length === 0 && !selectedPaymentGateway) {
      showError('Selecione pelo menos uma integração ou gateway de pagamento');
      return;
    }

    if (!clienteId) {
      showError('ID do cliente não encontrado. Faça login novamente.');
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        cliente_id: clienteId,
        integracoes: selectedIntegrations,
        gateway_pagamento: selectedPaymentGateway
      };

      // Obter URL do webhook
      const webhookUrl = getWebhookUrl('SOLICITACAO_INTEGRACAO');
      
      // Enviar dados para o webhook
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        showSuccess('Solicitação de integração enviada com sucesso! Nossa equipe entrará em contato para os próximos passos.');
        setSelectedIntegrations([]);
        setSelectedPaymentGateway(null);
      } else {
        throw new Error('Erro ao solicitar integração');
      }
    } catch (error) {
      showError('Erro ao solicitar integração. Tente novamente.');
      console.error('Error submitting integration request:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getComplexityColor = (complexity: string) => {
    switch (complexity) {
      case 'Simples':
        return 'bg-green-100 text-green-800';
      case 'Médio':
        return 'bg-yellow-100 text-yellow-800';
      case 'Avançado':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const availableIntegrations = integrationOptions.filter(integration => 
    clientData ? integration.availableFor.includes(clientData.plano) : true
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-6xl mx-auto space-y-8"
    >
      {/* Header */}
      <div className="bg-white rounded-xl border border-gray-200 p-8">
        <div className="mb-6">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Integrações Opcionais</h2>
          <p className="text-gray-600 text-lg">Conecte seu agente com outras ferramentas para potencializar seus resultados</p>
        </div>

        {clientData && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <div className="flex items-center gap-2 mb-2">
              <Settings className="h-5 w-5 text-blue-600" />
              <span className="font-semibold text-blue-900">Plano Atual: {clientData.plano}</span>
            </div>
            <p className="text-sm text-blue-700">
              As integrações disponíveis são baseadas no seu plano atual. 
              Algumas integrações podem ter custos adicionais.
            </p>
          </div>
        )}

        {/* Payment Gateway Integration */}
        <div className="mb-8">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Gateways de Pagamento</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {paymentGateways.map((gateway) => (
              <motion.div
                key={gateway.id}
                onClick={() => handlePaymentGatewaySelect(gateway.id as 'stripe' | 'asaas')}
                className={`relative p-6 border-2 rounded-xl cursor-pointer transition-all hover:shadow-lg ${
                  selectedPaymentGateway === gateway.id
                    ? gateway.id === 'stripe' ? 'border-blue-500 bg-blue-50' : 'border-green-500 bg-green-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className={`p-3 rounded-xl ${
                    gateway.id === 'stripe' ? 'bg-blue-100' : 'bg-green-100'
                  }`}>
                    <gateway.icon className={`h-6 w-6 ${
                      gateway.id === 'stripe' ? 'text-blue-600' : 'text-green-600'
                    }`} />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-900">{gateway.name}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getComplexityColor(gateway.complexity)}`}>
                        {gateway.complexity}
                      </span>
                      <span className="text-xs text-gray-500">{gateway.timeToImplement}</span>
                    </div>
                  </div>
                </div>

                <p className="text-sm text-gray-600 mb-4">{gateway.description}</p>

                <div className="space-y-2 mb-4">
                  <h4 className="text-sm font-semibold text-gray-900">Recursos:</h4>
                  {gateway.features.map((feature, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <CheckCircle className="h-3 w-3 text-green-500 flex-shrink-0" />
                      <span className="text-xs text-gray-600">{feature}</span>
                    </div>
                  ))}
                </div>

                {selectedPaymentGateway === gateway.id && (
                  <div className="absolute top-4 right-4">
                    <CheckCircle className={`h-6 w-6 ${
                      gateway.id === 'stripe' ? 'text-blue-600' : 'text-green-600'
                    }`} />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>

        {/* Other Integration Grid */}
        <div>
          <h3 className="text-xl font-bold text-gray-900 mb-4">Outras Integrações</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {availableIntegrations.map((integration) => (
              <motion.div
                key={integration.id}
                onClick={() => handleIntegrationToggle(integration.id)}
                className={`relative p-6 border-2 rounded-xl cursor-pointer transition-all hover:shadow-lg ${
                  selectedIntegrations.includes(integration.id)
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {integration.popular && (
                  <div className="absolute -top-2 -right-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-3 py-1 rounded-full text-xs font-bold">
                    Popular
                  </div>
                )}

                <div className="flex items-center gap-3 mb-4">
                  <div className={`p-3 rounded-xl ${
                    selectedIntegrations.includes(integration.id) ? 'bg-blue-100' : 'bg-gray-100'
                  }`}>
                    <integration.icon className={`h-6 w-6 ${
                      selectedIntegrations.includes(integration.id) ? 'text-blue-600' : 'text-gray-600'
                    }`} />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-900">{integration.name}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getComplexityColor(integration.complexity)}`}>
                        {integration.complexity}
                      </span>
                      <span className="text-xs text-gray-500">{integration.timeToImplement}</span>
                    </div>
                  </div>
                </div>

                <p className="text-sm text-gray-600 mb-4">{integration.description}</p>

                <div className="space-y-2 mb-4">
                  <h4 className="text-sm font-semibold text-gray-900">Recursos:</h4>
                  {integration.features.map((feature, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <CheckCircle className="h-3 w-3 text-green-500 flex-shrink-0" />
                      <span className="text-xs text-gray-600">{feature}</span>
                    </div>
                  ))}
                </div>

                {selectedIntegrations.includes(integration.id) && (
                  <div className="absolute top-4 right-4">
                    <CheckCircle className="h-6 w-6 text-blue-600" />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>

        {/* Selected Integrations Summary */}
        {(selectedIntegrations.length > 0 || selectedPaymentGateway) && (
          <div className="bg-gray-50 rounded-xl p-6 mb-6">
            <h3 className="font-semibold text-gray-900 mb-4">
              Seleções ({selectedIntegrations.length + (selectedPaymentGateway ? 1 : 0)})
            </h3>
            
            {selectedPaymentGateway && (
              <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Gateway de Pagamento:</h4>
                <div className={`flex items-center gap-3 p-3 rounded-lg ${
                  selectedPaymentGateway === 'stripe' ? 'bg-blue-50 border border-blue-200' : 'bg-green-50 border border-green-200'
                }`}>
                  {selectedPaymentGateway === 'stripe' ? (
                    <CreditCard className="h-5 w-5 text-blue-600" />
                  ) : (
                    <ExternalLink className="h-5 w-5 text-green-600" />
                  )}
                  <div className="flex-1">
                    <span className="font-medium text-gray-900">
                      {selectedPaymentGateway === 'stripe' ? 'Stripe' : 'Asaas'}
                    </span>
                    <div className="text-xs text-gray-500">
                      {selectedPaymentGateway === 'stripe' ? 'Pagamentos internacionais' : 'Pagamentos nacionais (Boleto, PIX)'}
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedPaymentGateway(null)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
            )}
            
            {selectedIntegrations.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">Outras Integrações:</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  {selectedIntegrations.map(integrationId => {
                    const integration = integrationOptions.find(i => i.id === integrationId);
                    return integration ? (
                      <div key={integrationId} className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-200">
                        <integration.icon className="h-5 w-5 text-blue-600" />
                        <div className="flex-1">
                          <span className="font-medium text-gray-900">{integration.name}</span>
                          <div className="text-xs text-gray-500">{integration.timeToImplement}</div>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleIntegrationToggle(integrationId);
                          }}
                          className="text-red-500 hover:text-red-700"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    ) : null;
                  })}
                </div>
              </div>
            )}
            
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-semibold text-blue-900 mb-2">Próximos Passos:</h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Nossa equipe analisará suas integrações selecionadas</li>
                <li>• Você receberá um orçamento detalhado (se aplicável)</li>
                <li>• Agendaremos uma reunião para configuração</li>
                <li>• Implementação será feita em ordem de complexidade</li>
              </ul>
            </div>
          </div>
        )}

        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            onClick={handleSubmit}
            disabled={isSubmitting || (selectedIntegrations.length === 0 && !selectedPaymentGateway)}
            className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Enviando...
              </>
            ) : (
              <>
                <Send className="h-4 w-4" />
                Solicitar Integrações ({selectedIntegrations.length + (selectedPaymentGateway ? 1 : 0)})
              </>
            )}
          </button>
        </div>
      </div>

      {/* Information Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-green-50 border border-green-200 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-3">
            <CheckCircle className="h-6 w-6 text-green-600" />
            <h3 className="font-semibold text-green-900">Incluído no Plano</h3>
          </div>
          <p className="text-sm text-green-800 mb-3">
            Algumas integrações básicas já estão incluídas no seu plano mensal.
          </p>
          <ul className="text-xs text-green-700 space-y-1">
            <li>• WhatsApp Business API</li>
            <li>• Webhook básico</li>
            <li>• Exportação de dados</li>
          </ul>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-3">
            <ExternalLink className="h-6 w-6 text-yellow-600" />
            <h3 className="font-semibold text-yellow-900">Custos Adicionais</h3>
          </div>
          <p className="text-sm text-yellow-800 mb-3">
            Integrações avançadas podem ter custos de implementação.
          </p>
          <ul className="text-xs text-yellow-700 space-y-1">
            <li>• CRM: R$ 200-500 setup</li>
            <li>• Zapier: R$ 150-300 setup</li>
            <li>• Customizações: Sob consulta</li>
          </ul>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-3">
            <Settings className="h-6 w-6 text-blue-600" />
            <h3 className="font-semibold text-blue-900">Suporte Técnico</h3>
          </div>
          <p className="text-sm text-blue-800 mb-3">
            Nossa equipe cuida de toda a configuração para você.
          </p>
          <ul className="text-xs text-blue-700 space-y-1">
            <li>• Configuração completa</li>
            <li>• Testes de funcionamento</li>
            <li>• Documentação detalhada</li>
          </ul>
        </div>
      </div>
    </motion.div>
  );
};

export default OptionalIntegrations;