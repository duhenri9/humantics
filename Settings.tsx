import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import BetaVersionManager from '../components/BetaVersionManager';
import { useAuth } from '../context/AuthContext';
// Remove Supabase import and use direct API calls
import { showSuccess, showError } from '../utils/toast';

// API function to update user
const updateUser = async (userId: string, updates: { full_name: string; plan?: string }) => {
  const response = await fetch(`/api/users/${userId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(updates),
  });
  
  if (!response.ok) {
    throw new Error('Erro ao atualizar perfil');
  }
  
  return response.json();
};
import { 
  User, 
  Bell, 
  Shield, 
  CreditCard, 
  Webhook, 
  Key,
  Save,
  Eye,
  EyeOff,
  Building,
  Mail,
  FileCheck
} from 'lucide-react';

const Settings = () => {
  const { userProfile, refreshProfile } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [showApiKey, setShowApiKey] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [profileData, setProfileData] = useState({
    full_name: '',
    email: '',
    plan: 'essencial' as 'essencial' | 'agenda' | 'conversao'
  });

  // Notification preferences state
  const [emailNotifications, setEmailNotifications] = useState({
    newConversations: true,
    weeklyReports: true,
    systemAlerts: true,
    productUpdates: false
  });

  const [pushNotifications, setPushNotifications] = useState({
    realTimeConversations: false,
    performanceAlerts: true,
    maintenanceReminders: true
  });

  useEffect(() => {
    if (userProfile) {
      setProfileData({
        full_name: userProfile.fullName || '',
        email: userProfile.email || '',
        plan: userProfile.plan || 'essencial'
      });
    }
  }, [userProfile]);

  // Define tabs based on user role
  const tabs = userProfile?.role === 'admin' ? [
    { id: 'profile', label: 'Perfil', icon: User },
    { id: 'security', label: 'Segurança', icon: Shield },
    { id: 'api', label: 'API & Webhooks', icon: Webhook },
    { id: 'version', label: 'Versão Beta', icon: FileCheck }
  ] : [
    { id: 'profile', label: 'Perfil', icon: User },
    { id: 'notifications', label: 'Notificações', icon: Bell },
    { id: 'security', label: 'Segurança', icon: Shield },
    { id: 'billing', label: 'Cobrança', icon: CreditCard }
  ];

  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 }
  };

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userProfile) return;

    setIsLoading(true);
    try {
      await updateUser(userProfile.id, {
        full_name: profileData.full_name,
        plan: profileData.plan
      });
      
      await refreshProfile();
      showSuccess('Perfil atualizado com sucesso!');
    } catch (error: any) {
      showError(error.message || 'Erro ao atualizar perfil');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setProfileData(prev => ({ ...prev, [field]: value }));
  };

  const handleEmailNotificationToggle = (key: keyof typeof emailNotifications) => {
    setEmailNotifications(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
    
    // In a real app, you would save this to the backend
    showSuccess(`Preferência de notificação atualizada`);
  };

  const handlePushNotificationToggle = (key: keyof typeof pushNotifications) => {
    setPushNotifications(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
    
    // In a real app, you would save this to the backend
    showSuccess(`Preferência de notificação atualizada`);
  };

  const ToggleButton = ({ enabled, onToggle }: { enabled: boolean; onToggle: () => void }) => (
    <button 
      onClick={onToggle}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
        enabled ? 'bg-blue-600' : 'bg-gray-200'
      }`}
    >
      <span 
        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
          enabled ? 'translate-x-6' : 'translate-x-1'
        }`} 
      />
    </button>
  );

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        
        <main className="flex-1 overflow-y-auto p-6">
          <motion.div
            initial="initial"
            animate="animate"
            variants={fadeInUp}
          >
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Configurações</h1>
              <p className="text-gray-600">Gerencie suas preferências e configurações da conta</p>
            </div>

            <div className="flex">
              {/* Sidebar */}
              <div className="w-64 mr-8">
                <nav className="space-y-2">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                        activeTab === tab.id
                          ? 'bg-blue-50 text-blue-600 border border-blue-200'
                          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      }`}
                    >
                      <tab.icon className="h-5 w-5" />
                      <span className="font-medium">{tab.label}</span>
                    </button>
                  ))}
                </nav>
              </div>

              {/* Content */}
              <div className="flex-1 max-w-4xl">
                {activeTab === 'profile' && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-xl border border-gray-200 p-6"
                  >
                    <h2 className="text-xl font-semibold text-gray-900 mb-6">Informações do Perfil</h2>
                    
                    <form onSubmit={handleProfileUpdate} className="space-y-6">
                      <div className="flex items-center space-x-6">
                        <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center">
                          <User className="h-10 w-10 text-white" />
                        </div>
                        <div>
                          <button 
                            type="button"
                            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                          >
                            Alterar Foto
                          </button>
                          <p className="text-sm text-gray-500 mt-1">JPG, GIF ou PNG. Máximo 1MB.</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Nome Completo
                          </label>
                          <div className="relative">
                            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                            <input
                              type="text"
                              value={profileData.full_name}
                              onChange={(e) => handleInputChange('full_name', e.target.value)}
                              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              placeholder="Seu nome completo"
                            />
                          </div>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Email
                          </label>
                          <div className="relative">
                            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                            <input
                              type="email"
                              value={profileData.email}
                              disabled
                              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
                              placeholder="seu@email.com"
                            />
                          </div>
                          <p className="text-xs text-gray-500 mt-1">O email não pode ser alterado</p>
                        </div>
                      </div>

                      {/* Plan selection - only admins can change plans */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Plano Atual
                        </label>
                        {userProfile?.role === 'admin' ? (
                          <select
                            value={profileData.plan}
                            onChange={(e) => handleInputChange('plan', e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          >
                            <option value="essencial">Agente Essencial</option>
                            <option value="agenda">Agente de Agenda</option>
                            <option value="conversao">Agente de Conversão</option>
                          </select>
                        ) : (
                          <div className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-500">
                            {profileData.plan === 'essencial' && 'Agente Essencial'}
                            {profileData.plan === 'agenda' && 'Agente de Agenda'}
                            {profileData.plan === 'conversao' && 'Agente de Conversão'}
                            {!profileData.plan && 'Sem plano definido'}
                          </div>
                        )}
                        {userProfile?.role !== 'admin' && (
                          <p className="text-xs text-gray-500 mt-1">
                            Entre em contato com o suporte para alterar seu plano
                          </p>
                        )}
                      </div>

                      <div className="flex justify-end">
                        <button 
                          type="submit"
                          disabled={isLoading}
                          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {isLoading ? (
                            <>
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                              Salvando...
                            </>
                          ) : (
                            <>
                              <Save className="h-4 w-4" />
                              Salvar Alterações
                            </>
                          )}
                        </button>
                      </div>
                    </form>
                  </motion.div>
                )}

                {activeTab === 'notifications' && userProfile?.role === 'client' && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-xl border border-gray-200 p-6"
                  >
                    <h2 className="text-xl font-semibold text-gray-900 mb-6">Preferências de Notificação</h2>
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                      <p className="text-blue-800 text-sm">
                        <strong>Acesso de Cliente:</strong> Configure suas preferências de notificação sobre atividade dos agentes.
                      </p>
                    </div>
                    
                    <div className="space-y-6">
                      <div>
                        <h3 className="font-medium text-gray-900 mb-4">Notificações por Email</h3>
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium text-gray-900">Novas conversas</p>
                              <p className="text-sm text-gray-500">Receber email quando um agente iniciar nova conversa</p>
                            </div>
                            <ToggleButton 
                              enabled={emailNotifications.newConversations}
                              onToggle={() => handleEmailNotificationToggle('newConversations')}
                            />
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium text-gray-900">Relatórios semanais</p>
                              <p className="text-sm text-gray-500">Resumo semanal da performance dos agentes</p>
                            </div>
                            <ToggleButton 
                              enabled={emailNotifications.weeklyReports}
                              onToggle={() => handleEmailNotificationToggle('weeklyReports')}
                            />
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium text-gray-900">Alertas de sistema</p>
                              <p className="text-sm text-gray-500">Notificações sobre problemas técnicos</p>
                            </div>
                            <ToggleButton 
                              enabled={emailNotifications.systemAlerts}
                              onToggle={() => handleEmailNotificationToggle('systemAlerts')}
                            />
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium text-gray-900">Atualizações de produto</p>
                              <p className="text-sm text-gray-500">Novos recursos e melhorias da plataforma</p>
                            </div>
                            <ToggleButton 
                              enabled={emailNotifications.productUpdates}
                              onToggle={() => handleEmailNotificationToggle('productUpdates')}
                            />
                          </div>
                        </div>
                      </div>

                      <div>
                        <h3 className="font-medium text-gray-900 mb-4">Notificações Push</h3>
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium text-gray-900">Conversas em tempo real</p>
                              <p className="text-sm text-gray-500">Notificações instantâneas de novas mensagens</p>
                            </div>
                            <ToggleButton 
                              enabled={pushNotifications.realTimeConversations}
                              onToggle={() => handlePushNotificationToggle('realTimeConversations')}
                            />
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium text-gray-900">Alertas de performance</p>
                              <p className="text-sm text-gray-500">Quando um agente apresenta baixa performance</p>
                            </div>
                            <ToggleButton 
                              enabled={pushNotifications.performanceAlerts}
                              onToggle={() => handlePushNotificationToggle('performanceAlerts')}
                            />
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium text-gray-900">Lembretes de manutenção</p>
                              <p className="text-sm text-gray-500">Lembretes para atualizar e treinar agentes</p>
                            </div>
                            <ToggleButton 
                              enabled={pushNotifications.maintenanceReminders}
                              onToggle={() => handlePushNotificationToggle('maintenanceReminders')}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {activeTab === 'api' && userProfile?.role === 'admin' && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-6"
                  >
                    {/* API Keys */}
                    <div className="bg-white rounded-xl border border-gray-200 p-6">
                      <h2 className="text-xl font-semibold text-gray-900 mb-6">Chaves de API</h2>
                      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
                        <p className="text-amber-800 text-sm">
                          <strong>Acesso Administrativo:</strong> Esta seção é visível apenas para administradores do sistema.
                        </p>
                      </div>
                      
                      <div className="space-y-4">
                        <div className="border border-gray-200 rounded-lg p-4">
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="font-medium text-gray-900">Chave de Produção</h3>
                            <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                              Ativa
                            </span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <code className="flex-1 bg-gray-50 px-3 py-2 rounded text-sm font-mono">
                              {showApiKey ? 'hmt_prod_1234567890abcdef' : '••••••••••••••••••••••••'}
                            </code>
                            <button
                              onClick={() => setShowApiKey(!showApiKey)}
                              className="p-2 hover:bg-gray-100 rounded transition-colors"
                            >
                              {showApiKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </button>
                          </div>
                          <p className="text-sm text-gray-500 mt-2">
                            Criada em 15 de Janeiro, 2024 • Último uso: há 2 horas
                          </p>
                        </div>

                        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
                          <Key className="h-4 w-4" />
                          Gerar Nova Chave
                        </button>
                      </div>
                    </div>

                    {/* Webhooks */}
                    <div className="bg-white rounded-xl border border-gray-200 p-6">
                      <h2 className="text-xl font-semibold text-gray-900 mb-6">Webhooks</h2>
                      
                      <div className="space-y-4">
                        <div className="border border-gray-200 rounded-lg p-4">
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="font-medium text-gray-900">Webhook Principal</h3>
                            <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                              Ativo
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">
                            https://api.exemplo.com/webhooks/humantic
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {['message.received', 'conversation.ended', 'agent.error'].map((event) => (
                              <span key={event} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded">
                                {event}
                              </span>
                            ))}
                          </div>
                        </div>

                        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
                          <Webhook className="h-4 w-4" />
                          Adicionar Webhook
                        </button>
                      </div>
                    </div>

                    {/* API Documentation */}
                    <div className="bg-white rounded-xl border border-gray-200 p-6">
                      <h2 className="text-xl font-semibold text-gray-900 mb-4">Documentação da API</h2>
                      <p className="text-gray-600 mb-4">
                        Acesse nossa documentação completa para integrar a HumanTic com seus sistemas.
                      </p>
                      <div className="flex space-x-4">
                        <button className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors">
                          Ver Documentação
                        </button>
                        <button className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors">
                          Exemplos de Código
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}

                {activeTab === 'billing' && userProfile?.role === 'client' && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-6"
                  >
                    {/* Current Plan */}
                    <div className="bg-white rounded-xl border border-gray-200 p-6">
                      <h2 className="text-xl font-semibold text-gray-900 mb-6">Plano Atual</h2>
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                        <p className="text-blue-800 text-sm">
                          <strong>Acesso de Cliente:</strong> Esta seção é visível apenas para clientes da plataforma.
                        </p>
                      </div>
                      
                      <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                        <div>
                          <h3 className="font-semibold text-gray-900">
                            {profileData.plan === 'essencial' && 'Agente Essencial'}
                            {profileData.plan === 'agenda' && 'Agente de Agenda'}
                            {profileData.plan === 'conversao' && 'Agente de Conversão'}
                            {!profileData.plan && 'Sem plano ativo'}
                          </h3>
                          <p className="text-sm text-gray-500">Plano ativo desde Janeiro 2024</p>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-semibold text-gray-900">R$ 835,00/mês</p>
                          <p className="text-sm text-gray-500">Próxima cobrança: 15/02/2024</p>
                        </div>
                      </div>
                    </div>

                    {/* Payment History */}
                    <div className="bg-white rounded-xl border border-gray-200 p-6">
                      <h2 className="text-xl font-semibold text-gray-900 mb-6">Histórico de Pagamentos</h2>
                      
                      <div className="space-y-3">
                        {[
                          { date: '15/01/2024', amount: 'R$ 835,00', status: 'Pago', method: 'Cartão •••• 4242' },
                          { date: '15/12/2023', amount: 'R$ 835,00', status: 'Pago', method: 'Cartão •••• 4242' },
                          { date: '15/11/2023', amount: 'R$ 835,00', status: 'Pago', method: 'Cartão •••• 4242' }
                        ].map((payment, index) => (
                          <div key={index} className="flex items-center justify-between p-3 border border-gray-100 rounded-lg">
                            <div>
                              <p className="font-medium text-gray-900">{payment.date}</p>
                              <p className="text-sm text-gray-500">{payment.method}</p>
                            </div>
                            <div className="text-right">
                              <p className="font-medium text-gray-900">{payment.amount}</p>
                              <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                                {payment.status}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Billing Actions */}
                    <div className="bg-white rounded-xl border border-gray-200 p-6">
                      <h2 className="text-xl font-semibold text-gray-900 mb-6">Ações de Cobrança</h2>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left">
                          <div className="flex items-center gap-3">
                            <CreditCard className="h-5 w-5 text-blue-600" />
                            <div>
                              <p className="font-medium text-gray-900">Atualizar Cartão</p>
                              <p className="text-sm text-gray-500">Alterar método de pagamento</p>
                            </div>
                          </div>
                        </button>
                        
                        <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left">
                          <div className="flex items-center gap-3">
                            <Building className="h-5 w-5 text-green-600" />
                            <div>
                              <p className="font-medium text-gray-900">Alterar Plano</p>
                              <p className="text-sm text-gray-500">Upgrade ou downgrade</p>
                            </div>
                          </div>
                        </button>
                      </div>
                      
                      <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <p className="text-sm text-yellow-800">
                          Para alterações de plano ou problemas de cobrança, entre em contato com nosso suporte.
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}

                {activeTab === 'security' && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-6"
                  >
                    {/* Password Security */}
                    <div className="bg-white rounded-xl border border-gray-200 p-6">
                      <h2 className="text-xl font-semibold text-gray-900 mb-6">Segurança da Conta</h2>
                      
                      <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                          <div>
                            <h3 className="font-medium text-gray-900">Senha</h3>
                            <p className="text-sm text-gray-500">Última alteração há 3 meses</p>
                          </div>
                          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                            Alterar Senha
                          </button>
                        </div>
                        
                        <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                          <div>
                            <h3 className="font-medium text-gray-900">Verificação em Duas Etapas</h3>
                            <p className="text-sm text-gray-500">Adicione uma camada extra de segurança</p>
                          </div>
                          <button className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors">
                            Ativar
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Session Management */}
                    <div className="bg-white rounded-xl border border-gray-200 p-6">
                      <h2 className="text-xl font-semibold text-gray-900 mb-6">Sessões Ativas</h2>
                      
                      <div className="space-y-3">
                        {[
                          { device: 'Chrome no Windows', location: 'São Paulo, Brasil', current: true, lastActive: 'Agora' },
                          { device: 'Safari no iPhone', location: 'São Paulo, Brasil', current: false, lastActive: 'há 2 horas' },
                          { device: 'Firefox no Linux', location: 'Rio de Janeiro, Brasil', current: false, lastActive: 'há 1 dia' }
                        ].map((session, index) => (
                          <div key={index} className="flex items-center justify-between p-3 border border-gray-100 rounded-lg">
                            <div>
                              <p className="font-medium text-gray-900 flex items-center gap-2">
                                {session.device}
                                {session.current && (
                                  <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                                    Atual
                                  </span>
                                )}
                              </p>
                              <p className="text-sm text-gray-500">{session.location} • {session.lastActive}</p>
                            </div>
                            {!session.current && (
                              <button className="text-red-600 hover:text-red-700 text-sm font-medium">
                                Revogar
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Admin-only Security Features */}
                    {userProfile?.role === 'admin' && (
                      <div className="bg-white rounded-xl border border-gray-200 p-6">
                        <h2 className="text-xl font-semibold text-gray-900 mb-6">Configurações Administrativas</h2>
                        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
                          <p className="text-amber-800 text-sm">
                            <strong>Acesso Administrativo:</strong> Estas configurações afetam a segurança de todo o sistema.
                          </p>
                        </div>
                        
                        <div className="space-y-4">
                          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                            <div>
                              <h3 className="font-medium text-gray-900">Logs de Auditoria</h3>
                              <p className="text-sm text-gray-500">Monitorar ações administrativas</p>
                            </div>
                            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                              Ver Logs
                            </button>
                          </div>
                          
                          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                            <div>
                              <h3 className="font-medium text-gray-900">Políticas de Senha</h3>
                              <p className="text-sm text-gray-500">Configurar requisitos de senha para usuários</p>
                            </div>
                            <button className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors">
                              Configurar
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </motion.div>
                )}

                {activeTab === 'version' && userProfile?.role === 'admin' && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
                      <p className="text-amber-800 text-sm">
                        <strong>Acesso Administrativo:</strong> Gerenciamento de versões beta apenas para administradores.
                      </p>
                    </div>
                    <BetaVersionManager />
                  </motion.div>
                )}
              </div>
            </div>
          </motion.div>
        </main>
      </div>
    </div>
  );
};

export default Settings;