import React, { useState, useEffect } from 'react';
import { useLocation, useRoute } from 'wouter';
import { CheckCircle, Mail, AlertCircle, ArrowRight } from 'lucide-react';
import { Link } from 'wouter';

interface ConfirmationState {
  status: 'loading' | 'success' | 'error' | 'expired';
  message: string;
  leadId?: string;
}

const EmailConfirmation: React.FC = () => {
  const [location] = useLocation();
  const [match, params] = useRoute('/confirmar-email/:token');
  const [confirmationState, setConfirmationState] = useState<ConfirmationState>({
    status: 'loading',
    message: 'Verificando seu email...'
  });

  useEffect(() => {
    if (match && params?.token) {
      confirmEmail(params.token);
    }
  }, [match, params]);

  const confirmEmail = async (token: string) => {
    try {
      const response = await fetch('/api/leads/confirm-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token }),
      });

      const result = await response.json();

      if (response.ok && result.status === 'ok') {
        setConfirmationState({
          status: 'success',
          message: 'Email confirmado com sucesso!',
          leadId: result.leadId
        });
      } else {
        setConfirmationState({
          status: result.error?.includes('expired') ? 'expired' : 'error',
          message: result.error || 'Erro ao confirmar email'
        });
      }
    } catch (error) {
      console.error('Confirmation error:', error);
      setConfirmationState({
        status: 'error',
        message: 'Erro de conexão. Tente novamente.'
      });
    }
  };

  const getStatusColor = () => {
    switch (confirmationState.status) {
      case 'success':
        return 'bg-green-500/20 border-green-400/30 text-green-400';
      case 'error':
      case 'expired':
        return 'bg-red-500/20 border-red-400/30 text-red-400';
      default:
        return 'bg-blue-500/20 border-blue-400/30 text-blue-400';
    }
  };

  const getStatusIcon = () => {
    switch (confirmationState.status) {
      case 'success':
        return <CheckCircle className="h-16 w-16 text-green-400" />;
      case 'error':
      case 'expired':
        return <AlertCircle className="h-16 w-16 text-red-400" />;
      default:
        return <Mail className="h-16 w-16 text-blue-400" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className={`${getStatusColor()} backdrop-blur-sm rounded-2xl p-8 text-center`}>
          <div className="mb-6">
            {getStatusIcon()}
          </div>
          
          <h1 className="text-2xl font-bold text-white mb-4">
            {confirmationState.status === 'success' ? 'Email Confirmado!' : 
             confirmationState.status === 'loading' ? 'Confirmando...' : 
             'Erro na Confirmação'}
          </h1>
          
          <p className="text-white/90 mb-8">
            {confirmationState.message}
          </p>
          
          {confirmationState.status === 'success' && (
            <div className="space-y-4">
              <div className="bg-white/10 rounded-lg p-4">
                <p className="text-white/80 text-sm">
                  🎉 <strong>Próximo passo:</strong><br/>
                  Agora você pode personalizar seu agente com os detalhes do seu negócio!
                </p>
              </div>
              
              <Link
                to={`/personalizar-agente?leadId=${confirmationState.leadId}`}
                className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 transform hover:scale-105"
              >
                Personalizar meu agente
                <ArrowRight className="h-5 w-5" />
              </Link>
            </div>
          )}
          
          {confirmationState.status === 'expired' && (
            <div className="space-y-4">
              <div className="bg-white/10 rounded-lg p-4">
                <p className="text-white/80 text-sm">
                  ⏰ <strong>Link expirado</strong><br/>
                  Solicite um novo link de confirmação
                </p>
              </div>
              
              <Link
                to="/"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 transform hover:scale-105"
              >
                Solicitar novo teste
                <ArrowRight className="h-5 w-5" />
              </Link>
            </div>
          )}
          
          {confirmationState.status === 'error' && (
            <div className="space-y-4">
              <div className="bg-white/10 rounded-lg p-4">
                <p className="text-white/80 text-sm">
                  ❌ <strong>Erro na confirmação</strong><br/>
                  Entre em contato conosco se o problema persistir
                </p>
              </div>
              
              <div className="flex flex-col gap-2">
                <Link
                  to="/"
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 transform hover:scale-105"
                >
                  Voltar ao início
                  <ArrowRight className="h-5 w-5" />
                </Link>
                
                <p className="text-white/60 text-sm">
                  Precisa de ajuda? <br/>
                  📧 humantic@wm3digital.com.br
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmailConfirmation;