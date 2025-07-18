import React, { useState, useEffect } from 'react';
import { 
  MessageSquare, 
  Bot, 
  CheckCircle, 
  Clock, 
  AlertCircle, 
  Phone,
  Mail,
  User,
  Settings,
  ExternalLink
} from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';

interface ClientData {
  id: string;
  nomeCompleto: string;
  nomeNegocio: string;
  email: string;
  telefone?: string;
  status: 'pending' | 'active' | 'suspended';
  chatwootId?: string;
  botsailorId?: string;
  createdAt: string;
}

export const ClientPortal: React.FC = () => {
  const [clientData, setClientData] = useState<ClientData | null>(null);
  const [loading, setLoading] = useState(true);
  const [accessCode, setAccessCode] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState('');

  const handleAccessSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/client/access', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ accessCode }),
      });

      const data = await response.json();

      if (response.ok) {
        setClientData(data.client);
        setIsAuthenticated(true);
        localStorage.setItem('clientAccessCode', accessCode);
      } else {
        setError(data.message || 'Código de acesso inválido');
      }
    } catch (error) {
      setError('Erro de conexão. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const savedCode = localStorage.getItem('clientAccessCode');
    if (savedCode) {
      setAccessCode(savedCode);
      // Auto authenticate with saved code
      handleAccessSubmit({ preventDefault: () => {} } as React.FormEvent);
    } else {
      setLoading(false);
    }
  }, []);

  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'active':
        return {
          icon: <CheckCircle className="h-6 w-6 text-green-600" />,
          text: 'Chatbot Ativo',
          description: 'Seu chatbot está funcionando e respondendo automaticamente',
          color: 'green'
        };
      case 'pending':
        return {
          icon: <Clock className="h-6 w-6 text-yellow-600" />,
          text: 'Em Configuração',
          description: 'Nossa equipe está configurando seu chatbot personalizado',
          color: 'yellow'
        };
      case 'suspended':
        return {
          icon: <AlertCircle className="h-6 w-6 text-red-600" />,
          text: 'Temporariamente Suspenso',
          description: 'Entre em contato conosco para reativar seu chatbot',
          color: 'red'
        };
      default:
        return {
          icon: <Clock className="h-6 w-6 text-gray-600" />,
          text: 'Status Indefinido',
          description: 'Status não identificado',
          color: 'gray'
        };
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#6D7AFF]"></div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        
        <div className="flex items-center justify-center py-12 px-4">
          <div className="max-w-md w-full">
            <div className="text-center mb-8">
              <div className="mx-auto h-16 w-16 bg-[#6D7AFF] bg-opacity-10 rounded-full flex items-center justify-center">
                <User className="h-8 w-8 text-[#6D7AFF]" />
              </div>
              <h2 className="mt-6 text-3xl font-bold text-gray-900">
                Portal do Cliente
              </h2>
              <p className="mt-2 text-sm text-gray-600">
                Digite seu código de acesso para ver o status do seu chatbot
              </p>
            </div>
            
            <div className="bg-white rounded-lg shadow-lg p-8">
              {error && (
                <div className="mb-4 p-3 bg-red-100 border border-red-300 text-red-700 rounded-md text-sm">
                  {error}
                </div>
              )}
              
              <form onSubmit={handleAccessSubmit} className="space-y-6">
                <div>
                  <label htmlFor="accessCode" className="block text-sm font-medium text-gray-700">
                    Código de Acesso
                  </label>
                  <input
                    type="text"
                    id="accessCode"
                    value={accessCode}
                    onChange={(e) => setAccessCode(e.target.value)}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#6D7AFF] focus:border-transparent"
                    placeholder="Ex: HT-123456"
                    required
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    Código enviado por email após contratação
                  </p>
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#6D7AFF] text-white py-3 px-4 rounded-md font-medium hover:opacity-90 transition-opacity"
                >
                  Acessar Portal
                </button>
              </form>

              <div className="mt-6 text-center text-sm text-gray-500">
                <p>Não possui um código de acesso?</p>
                <a href="mailto:contato@humantics.com" className="text-[#6D7AFF] hover:underline">
                  Entre em contato conosco
                </a>
              </div>
            </div>
          </div>
        </div>
        
        <Footer />
      </div>
    );
  }

  const statusInfo = getStatusInfo(clientData?.status || 'pending');

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Portal do Cliente</h1>
          <p className="text-gray-600 mt-2">Acompanhe o status do seu chatbot</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Status Card */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex items-center mb-6">
                {statusInfo.icon}
                <div className="ml-3">
                  <h2 className="text-xl font-semibold text-gray-900">
                    {statusInfo.text}
                  </h2>
                  <p className="text-gray-600">{statusInfo.description}</p>
                </div>
              </div>

              {clientData?.status === 'active' && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                  <h3 className="font-medium text-green-800 mb-2">
                    🎉 Seu chatbot está funcionando!
                  </h3>
                  <p className="text-green-700 text-sm">
                    Agora seu WhatsApp está respondendo automaticamente 24/7. 
                    Os clientes receberão respostas instantâneas mesmo quando você estiver ocupado.
                  </p>
                </div>
              )}

              {clientData?.status === 'pending' && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                  <h3 className="font-medium text-yellow-800 mb-2">
                    ⏱️ Configuração em andamento
                  </h3>
                  <p className="text-yellow-700 text-sm">
                    Nossa equipe está personalizando seu chatbot com as informações do seu negócio. 
                    Você receberá um email quando estiver pronto!
                  </p>
                </div>
              )}

              {/* Integration Status */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-gray-900">Chatwoot CRM</h4>
                      <p className="text-sm text-gray-600">Gestão de conversas</p>
                    </div>
                    {clientData?.chatwootId ? (
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    ) : (
                      <Clock className="h-5 w-5 text-yellow-600" />
                    )}
                  </div>
                </div>

                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-gray-900">BotSailor</h4>
                      <p className="text-sm text-gray-600">Chatbot WhatsApp</p>
                    </div>
                    {clientData?.botsailorId ? (
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    ) : (
                      <Clock className="h-5 w-5 text-yellow-600" />
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Client Info */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Informações da Conta
              </h3>
              
              <div className="space-y-3">
                <div className="flex items-center">
                  <User className="h-5 w-5 text-gray-400 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {clientData?.nomeCompleto}
                    </p>
                    <p className="text-xs text-gray-500">Nome do responsável</p>
                  </div>
                </div>

                <div className="flex items-center">
                  <Bot className="h-5 w-5 text-gray-400 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {clientData?.nomeNegocio}
                    </p>
                    <p className="text-xs text-gray-500">Nome do negócio</p>
                  </div>
                </div>

                <div className="flex items-center">
                  <Mail className="h-5 w-5 text-gray-400 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {clientData?.email}
                    </p>
                    <p className="text-xs text-gray-500">Email de contato</p>
                  </div>
                </div>

                {clientData?.telefone && (
                  <div className="flex items-center">
                    <Phone className="h-5 w-5 text-gray-400 mr-3" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {clientData.telefone}
                      </p>
                      <p className="text-xs text-gray-500">Telefone</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Support */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Precisa de Ajuda?
              </h3>
              
              <div className="space-y-3">
                <a
                  href="mailto:suporte@humantics.com"
                  className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <Mail className="h-5 w-5 text-[#6D7AFF] mr-3" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Email</p>
                    <p className="text-xs text-gray-500">suporte@humantics.com</p>
                  </div>
                </a>

                <a
                  href="https://wa.me/5511950377457"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <MessageSquare className="h-5 w-5 text-green-600 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">WhatsApp</p>
                    <p className="text-xs text-gray-500">+55 11 95037-7457</p>
                  </div>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};
