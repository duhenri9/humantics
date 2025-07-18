import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import { useAuth } from '../context/AuthContext';
import { 
  CreditCard, 
  AlertCircle, 
  CheckCircle, 
  X, 
  ArrowUpRight, 
  ArrowDownRight, 
  Star, 
  Calendar, 
  Download, 
  Settings,
  FileText,
  BarChart3,
  ExternalLink,
  Brain,
  Database,
  Users,
  UserCog,
  Target,
  Zap,
  Shield,
  Clock,
  Award,
  Plus,
  MessageSquare
} from 'lucide-react';
import SubscriptionStatus from '../components/SubscriptionStatus';
import PaymentCheckout from '../components/PaymentCheckout';
import SubscriptionManager from '../components/SubscriptionManager';
import { 
  products, 
  getProductsByCategoryAndGateway, 
  getUpgradeOptions,
  Product 
} from '../payment-config';

const Billing = () => {
  const { userProfile } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedGateway, setSelectedGateway] = useState<'stripe' | 'asaas' | null>(null);
  const [mockSubscription, setMockSubscription] = useState<any>(null);

  useEffect(() => {
    // Create mock subscription data based on user profile
    if (userProfile) {
      setMockSubscription({
        id: 'sub_mock_' + Date.now(),
        status: 'active',
        plan: userProfile.plan || 'essencial',
        current_period_end: Date.now() + 30 * 24 * 60 * 60 * 1000, // 30 days from now
        payment_method: {
          brand: 'visa',
          last4: '4242'
        },
        gateway: selectedGateway || 'stripe'
      });
    }
  }, [userProfile, selectedGateway]);

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

  const tabs = [
    { id: 'overview', label: 'Visão Geral', icon: BarChart3 },
    { id: 'products', label: 'Produtos', icon: Star },
    { id: 'manage', label: 'Gerenciar', icon: Settings },
    { id: 'history', label: 'Histórico', icon: FileText }
  ];

  // Get activation products for both gateways (nova estrutura HumanTic)
  const stripeActivationProducts = getProductsByCategoryAndGateway('activation', 'stripe');
  const asaasActivationProducts = getProductsByCategoryAndGateway('activation', 'asaas');
  
  // Get subscription products for both gateways (mensalidades)
  const stripeSubscriptionProducts = getProductsByCategoryAndGateway('subscription', 'stripe');
  const asaasSubscriptionProducts = getProductsByCategoryAndGateway('subscription', 'asaas');
  
  // Get upgrade options based on current user plan
  const currentPlan = userProfile?.plan || null;
  const upgradeOptions = getUpgradeOptions(currentPlan);

  const handleSubscriptionUpdate = () => {
    // Refresh subscription data
    if (userProfile) {
      setMockSubscription({
        ...mockSubscription,
        updated_at: new Date().toISOString()
      });
    }
  };

  // Format price helper
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(price);
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        
        <main className="flex-1 overflow-y-auto p-6">
          <motion.div
            initial="initial"
            animate="animate"
            variants={staggerChildren}
          >
            {/* Header */}
            <motion.div className="mb-8" variants={fadeInUp}>
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">Planos e Cobrança</h1>
                  <p className="text-gray-600">Gerencie suas assinaturas e histórico de pagamentos</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    Sistema Ativo
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Tabs */}
            <motion.div className="mb-8" variants={fadeInUp}>
              <div className="border-b border-gray-200">
                <nav className="flex space-x-8">
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
                </nav>
              </div>
            </motion.div>

            {/* Tab Content */}
            {activeTab === 'overview' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-8"
              >
                {/* Subscription Status */}
                <SubscriptionStatus gateway="both" />

                {/* Quick Actions */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-all group">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="bg-blue-100 p-3 rounded-xl group-hover:bg-blue-200 transition-colors">
                        <Plus className="h-6 w-6 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">Ativar Agente</h3>
                        <p className="text-sm text-gray-600">Configure um novo agente</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setActiveTab('products')}
                      className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Ver Produtos
                    </button>
                  </div>

                  <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-all group">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="bg-green-100 p-3 rounded-xl group-hover:bg-green-200 transition-colors">
                        <Download className="h-6 w-6 text-green-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">Baixar Fatura</h3>
                        <p className="text-sm text-gray-600">Última fatura disponível</p>
                      </div>
                    </div>
                    <button className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition-colors">
                      Download PDF
                    </button>
                  </div>

                  <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-all group">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="bg-purple-100 p-3 rounded-xl group-hover:bg-purple-200 transition-colors">
                        <Settings className="h-6 w-6 text-purple-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">Gerenciar Assinatura</h3>
                        <p className="text-sm text-gray-600">Alterar plano ou cancelar</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => setActiveTab('manage')}
                      className="w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition-colors"
                    >
                      Gerenciar
                    </button>
                  </div>
                </div>

                {/* Payment Gateways */}
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Gateways de Pagamento</h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="bg-blue-100 p-2 rounded-lg">
                          <CreditCard className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900">Stripe</h4>
                          <p className="text-sm text-gray-600">Pagamentos internacionais</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span>Integrado e ativo</span>
                      </div>
                    </div>

                    <div className="border border-gray-200 rounded-lg p-4 hover:border-green-300 transition-colors">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="bg-green-100 p-2 rounded-lg">
                          <ExternalLink className="h-5 w-5 text-green-600" />
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900">Asaas</h4>
                          <p className="text-sm text-gray-600">Pagamentos nacionais</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span>Integrado e ativo</span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'products' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-8"
              >
                {/* Gateway Selection */}
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Selecione o Gateway de Pagamento</h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    <button 
                      onClick={() => setSelectedGateway('stripe')}
                      className={`p-4 rounded-lg border transition-colors flex items-center gap-3 ${
                        selectedGateway === 'stripe' 
                          ? 'border-blue-500 bg-blue-50' 
                          : 'border-gray-200 hover:border-blue-300'
                      }`}
                    >
                      <div className="bg-blue-100 p-2 rounded-lg">
                        <CreditCard className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">Stripe</h4>
                        <p className="text-sm text-gray-600">Cartão de crédito internacional</p>
                      </div>
                      {selectedGateway === 'stripe' && (
                        <CheckCircle className="h-5 w-5 text-blue-600 ml-auto" />
                      )}
                    </button>

                    <button 
                      onClick={() => setSelectedGateway('asaas')}
                      className={`p-4 rounded-lg border transition-colors flex items-center gap-3 ${
                        selectedGateway === 'asaas' 
                          ? 'border-green-500 bg-green-50' 
                          : 'border-gray-200 hover:border-green-300'
                      }`}
                    >
                      <div className="bg-green-100 p-2 rounded-lg">
                        <ExternalLink className="h-5 w-5 text-green-600" />
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">Asaas</h4>
                        <p className="text-sm text-gray-600">Boleto, PIX e cartão nacional</p>
                      </div>
                      {selectedGateway === 'asaas' && (
                        <CheckCircle className="h-5 w-5 text-green-600 ml-auto" />
                      )}
                    </button>
                  </div>
                </div>

                {selectedGateway && (
                  <>
                    {/* Current Plan Status */}
                    {currentPlan && (
                      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-200 p-6 mb-8">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="bg-blue-100 p-3 rounded-xl">
                            <Award className="h-6 w-6 text-blue-600" />
                          </div>
                          <div>
                            <h3 className="text-lg font-bold text-gray-900">Seu Plano Atual</h3>
                            <p className="text-blue-600 font-medium capitalize">{currentPlan}</p>
                          </div>
                        </div>
                        <p className="text-gray-600">
                          Seu plano inclui ativação personalizada + manutenção mensal integrada.
                        </p>
                      </div>
                    )}

                    {/* Upgrade Options */}
                    {upgradeOptions.length > 0 && (
                      <div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">
                          {currentPlan ? 'Opções de Upgrade' : 'Planos Disponíveis'}
                        </h2>
                        <p className="text-gray-600 mb-6">
                          Cada plano inclui ativação personalizada + manutenção mensal integrada
                        </p>
                        <div className="grid md:grid-cols-3 gap-6 mb-8">
                          {upgradeOptions
                            .filter(product => product.gateway === selectedGateway)
                            .map((product) => (
                            <div key={product.id} className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-all relative">
                              {/* Recommended Badge */}
                              {currentPlan === 'agenda' && product.agentType === 'essencial' && (
                                <div className="absolute -top-3 left-6 bg-green-600 text-white px-3 py-1 rounded-full text-xs font-medium">
                                  Recomendado
                                </div>
                              )}
                              
                              <div className="flex items-center gap-3 mb-4">
                                <div className={`p-3 rounded-xl ${
                                  product.agentType === 'essencial' ? 'bg-blue-100' :
                                  product.agentType === 'agenda' ? 'bg-purple-100' :
                                  'bg-green-100'
                                }`}>
                                  {product.agentType === 'essencial' ? <UserCog className="h-6 w-6 text-blue-600" /> :
                                   product.agentType === 'agenda' ? <Calendar className="h-6 w-6 text-purple-600" /> :
                                   <Target className="h-6 w-6 text-green-600" />}
                                </div>
                                <div>
                                  <h3 className="font-bold text-gray-900">{product.name}</h3>
                                  <p className="text-lg font-bold text-blue-600">
                                    {formatPrice(product.price)} (sinal 50%)
                                  </p>
                                  <p className="text-sm text-gray-600">
                                    Total: {formatPrice(product.totalValue || 0)} (2 fases)
                                  </p>
                                </div>
                              </div>
                              
                              <p className="text-sm text-gray-600 mb-4">{product.description}</p>
                              
                              {/* Features based on agent type */}
                              <div className="mb-4 space-y-2">
                                {product.agentType === 'essencial' && (
                                  <>
                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                      <CheckCircle className="h-4 w-4 text-green-600" />
                                      <span>Atendimento automatizado</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                      <CheckCircle className="h-4 w-4 text-green-600" />
                                      <span>Respostas personalizadas</span>
                                    </div>
                                  </>
                                )}
                                {product.agentType === 'agenda' && (
                                  <>
                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                      <CheckCircle className="h-4 w-4 text-green-600" />
                                      <span>Agendamento inteligente</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                      <CheckCircle className="h-4 w-4 text-green-600" />
                                      <span>Integração com calendário</span>
                                    </div>
                                  </>
                                )}
                                {product.agentType === 'conversao' && (
                                  <>
                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                      <CheckCircle className="h-4 w-4 text-green-600" />
                                      <span>Leads qualificados</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                      <CheckCircle className="h-4 w-4 text-green-600" />
                                      <span>Conversão avançada</span>
                                    </div>
                                  </>
                                )}
                              </div>
                              
                              <PaymentCheckout product={product} />
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* All Available Plans */}
                    {!currentPlan && (
                      <div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">Todos os Planos</h2>
                        <p className="text-gray-600 mb-6">
                          Ativação + Manutenção Mensal Integrada
                        </p>
                        <div className="grid md:grid-cols-3 gap-6">
                          {(selectedGateway === 'stripe' ? stripeActivationProducts : asaasActivationProducts).map((product) => (
                            <div key={product.id} className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-all">
                              <div className="flex items-center gap-3 mb-4">
                                <div className={`p-3 rounded-xl ${
                                  product.agentType === 'essencial' ? 'bg-blue-100' :
                                  product.agentType === 'agenda' ? 'bg-purple-100' :
                                  'bg-green-100'
                                }`}>
                                  {product.agentType === 'essencial' ? <UserCog className="h-6 w-6 text-blue-600" /> :
                                   product.agentType === 'agenda' ? <Calendar className="h-6 w-6 text-purple-600" /> :
                                   <Target className="h-6 w-6 text-green-600" />}
                                </div>
                                <div>
                                  <h3 className="font-bold text-gray-900">{product.name}</h3>
                                  <p className="text-lg font-bold text-blue-600">{formatPrice(product.price)}</p>
                                </div>
                              </div>
                              <p className="text-sm text-gray-600 mb-4">{product.description}</p>
                              <PaymentCheckout product={product} />
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* No Upgrade Available */}
                    {currentPlan === 'conversao' && (
                      <div className="bg-green-50 border border-green-200 rounded-xl p-6 text-center">
                        <Award className="h-12 w-12 text-green-600 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">Plano Premium Ativo</h3>
                        <p className="text-gray-600">
                          Você já possui o plano mais avançado da HumanTic! Aproveite todos os recursos de conversão avançada.
                        </p>
                      </div>
                    )}
                  </>
                )}

                {!selectedGateway && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 text-center">
                    <AlertCircle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Selecione um Gateway de Pagamento</h3>
                    <p className="text-gray-600 mb-4">
                      Por favor, selecione Stripe ou Asaas para visualizar os produtos disponíveis.
                    </p>
                  </div>
                )}
              </motion.div>
            )}

            {activeTab === 'manage' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                {/* Gateway Selection */}
                <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Selecione o Gateway de Pagamento</h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    <button 
                      onClick={() => setSelectedGateway('stripe')}
                      className={`p-4 rounded-lg border transition-colors flex items-center gap-3 ${
                        selectedGateway === 'stripe' 
                          ? 'border-blue-500 bg-blue-50' 
                          : 'border-gray-200 hover:border-blue-300'
                      }`}
                    >
                      <div className="bg-blue-100 p-2 rounded-lg">
                        <CreditCard className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">Stripe</h4>
                        <p className="text-sm text-gray-600">Cartão de crédito internacional</p>
                      </div>
                      {selectedGateway === 'stripe' && (
                        <CheckCircle className="h-5 w-5 text-blue-600 ml-auto" />
                      )}
                    </button>

                    <button 
                      onClick={() => setSelectedGateway('asaas')}
                      className={`p-4 rounded-lg border transition-colors flex items-center gap-3 ${
                        selectedGateway === 'asaas' 
                          ? 'border-green-500 bg-green-50' 
                          : 'border-gray-200 hover:border-green-300'
                      }`}
                    >
                      <div className="bg-green-100 p-2 rounded-lg">
                        <ExternalLink className="h-5 w-5 text-green-600" />
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">Asaas</h4>
                        <p className="text-sm text-gray-600">Boleto, PIX e cartão nacional</p>
                      </div>
                      {selectedGateway === 'asaas' && (
                        <CheckCircle className="h-5 w-5 text-green-600 ml-auto" />
                      )}
                    </button>
                  </div>
                </div>

                {selectedGateway && mockSubscription ? (
                  <SubscriptionManager 
                    subscription={{...mockSubscription, gateway: selectedGateway}} 
                    onUpdate={handleSubscriptionUpdate} 
                  />
                ) : (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 text-center">
                    <AlertCircle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Selecione um Gateway de Pagamento</h3>
                    <p className="text-gray-600 mb-4">
                      Por favor, selecione Stripe ou Asaas para gerenciar sua assinatura.
                    </p>
                  </div>
                )}
              </motion.div>
            )}

            {activeTab === 'history' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                {/* Gateway Selection */}
                <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Selecione o Gateway de Pagamento</h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    <button 
                      onClick={() => setSelectedGateway('stripe')}
                      className={`p-4 rounded-lg border transition-colors flex items-center gap-3 ${
                        selectedGateway === 'stripe' 
                          ? 'border-blue-500 bg-blue-50' 
                          : 'border-gray-200 hover:border-blue-300'
                      }`}
                    >
                      <div className="bg-blue-100 p-2 rounded-lg">
                        <CreditCard className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">Stripe</h4>
                        <p className="text-sm text-gray-600">Histórico de pagamentos via Stripe</p>
                      </div>
                      {selectedGateway === 'stripe' && (
                        <CheckCircle className="h-5 w-5 text-blue-600 ml-auto" />
                      )}
                    </button>

                    <button 
                      onClick={() => setSelectedGateway('asaas')}
                      className={`p-4 rounded-lg border transition-colors flex items-center gap-3 ${
                        selectedGateway === 'asaas' 
                          ? 'border-green-500 bg-green-50' 
                          : 'border-gray-200 hover:border-green-300'
                      }`}
                    >
                      <div className="bg-green-100 p-2 rounded-lg">
                        <ExternalLink className="h-5 w-5 text-green-600" />
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">Asaas</h4>
                        <p className="text-sm text-gray-600">Histórico de pagamentos via Asaas</p>
                      </div>
                      {selectedGateway === 'asaas' && (
                        <CheckCircle className="h-5 w-5 text-green-600 ml-auto" />
                      )}
                    </button>
                  </div>
                </div>

                {selectedGateway ? (
                  <div className="bg-white rounded-xl border border-gray-200">
                    <div className="p-6 border-b border-gray-200">
                      <h2 className="text-xl font-bold text-gray-900">
                        Histórico de Pedidos ({selectedGateway === 'stripe' ? 'Stripe' : 'Asaas'})
                      </h2>
                    </div>
                    
                    <div className="p-6 text-center">
                      <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">Nenhum pedido encontrado</h3>
                      <p className="text-gray-600">Você ainda não fez nenhuma compra via {selectedGateway === 'stripe' ? 'Stripe' : 'Asaas'}.</p>
                    </div>
                  </div>
                ) : (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 text-center">
                    <AlertCircle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Selecione um Gateway de Pagamento</h3>
                    <p className="text-gray-600 mb-4">
                      Por favor, selecione Stripe ou Asaas para visualizar seu histórico de pedidos.
                    </p>
                  </div>
                )}
              </motion.div>
            )}
          </motion.div>
        </main>
      </div>
    </div>
  );
};

export default Billing;