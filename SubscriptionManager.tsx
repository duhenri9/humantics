import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  AlertCircle, 
  CheckCircle,
  X, 
  ArrowUpRight, 
  ArrowDownRight, 
  CreditCard,
  ExternalLink
} from 'lucide-react';
import { showSuccess, showError } from '../utils/toast';
import { createCustomerPortalSession, manageSubscription } from '../lib/stripe';

interface Subscription {
  id: string;
  status: string;
  plan: 'essencial' | 'agenda' | 'conversao';
  current_period_end?: number;
  payment_method?: {
    brand: string;
    last4: string;
  };
  gateway: 'stripe' | 'asaas';
}

interface SubscriptionManagerProps {
  subscription: Subscription;
  onUpdate: () => void;
}

const SubscriptionManager: React.FC<SubscriptionManagerProps> = ({ subscription, onUpdate }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);

  // Mock product data
  const currentProduct = {
    name: subscription?.plan === 'essencial' ? 'Agente Essencial' :
          subscription?.plan === 'agenda' ? 'Agente de Agenda' :
          'Agente de Conversão',
    price: subscription?.plan === 'essencial' ? 195 :
           subscription?.plan === 'agenda' ? 325 : 498
  };

  // Mock available products
  const availableProducts = [
    { id: 'essencial', name: 'Agente Essencial', price: 195 },
    { id: 'agenda', name: 'Agente de Agenda', price: 325 },
    { id: 'conversao', name: 'Agente de Conversão', price: 498 }
  ].filter(p => p.id !== subscription?.plan);

  const handleUpgrade = async (newPlanId: string) => {
    setIsLoading(true);
    try {
      if (subscription.gateway === 'stripe') {
        // Para Stripe, redirecionamos para o portal do cliente
        const portalUrl = await createCustomerPortalSession();
        if (portalUrl) {
          window.location.href = portalUrl;
          return;
        } else {
          throw new Error('Não foi possível acessar o portal do cliente');
        }
      } else {
        // Para Asaas, simulamos o processo por enquanto
        await new Promise(resolve => setTimeout(resolve, 1000));
        const gatewayName = subscription.gateway === 'stripe' ? 'Stripe' : 'Asaas';
        showSuccess(`Solicitação de alteração via ${gatewayName} enviada com sucesso! Nossa equipe entrará em contato em breve.`);
        onUpdate();
      }
    } catch (error: any) {
      showError(error.message || 'Erro ao atualizar assinatura');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = async () => {
    setIsLoading(true);
    try {
      if (subscription.gateway === 'stripe') {
        // Para Stripe, usamos a API para cancelar a assinatura
        const success = await manageSubscription('cancel');
        if (success) {
          showSuccess('Sua assinatura será cancelada ao final do período atual');
          setShowCancelModal(false);
          onUpdate();
        } else {
          throw new Error('Não foi possível cancelar a assinatura');
        }
      } else {
        // Para Asaas, simulamos o processo por enquanto
        await new Promise(resolve => setTimeout(resolve, 1000));
        const gatewayName = subscription.gateway === 'stripe' ? 'Stripe' : 'Asaas';
        showSuccess(`Solicitação de cancelamento via ${gatewayName} enviada. Nossa equipe entrará em contato em breve.`);
        setShowCancelModal(false);
        onUpdate();
      }
    } catch (error: any) {
      showError(error.message || 'Erro ao cancelar assinatura');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdatePaymentMethod = async () => {
    try {
      if (subscription.gateway === 'stripe') {
        // Para Stripe, redirecionamos para o portal do cliente
        const portalUrl = await createCustomerPortalSession();
        if (portalUrl) {
          window.location.href = portalUrl;
        } else {
          throw new Error('Não foi possível acessar o portal do cliente');
        }
      } else {
        // Para Asaas, mostramos uma mensagem
        const gatewayName = subscription.gateway === 'stripe' ? 'Stripe' : 'Asaas';
        showSuccess(`Nossa equipe entrará em contato para atualizar seus dados de pagamento via ${gatewayName}.`);
      }
    } catch (error: any) {
      showError(error.message || 'Erro ao processar solicitação');
    }
  };

  const getGatewayIcon = () => {
    return subscription.gateway === 'stripe' 
      ? <CreditCard className="h-4 w-4" />
      : <ExternalLink className="h-4 w-4" />;
  };

  const getGatewayColor = () => {
    return subscription.gateway === 'stripe' 
      ? 'bg-blue-600 hover:bg-blue-700' 
      : 'bg-green-600 hover:bg-green-700';
  };

  const getGatewayName = () => {
    return subscription.gateway === 'stripe' ? 'Stripe' : 'Asaas';
  };

  if (!subscription || !currentProduct) {
    return null;
  }

  // Format price helper
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(price);
  };

  return (
    <div className="space-y-6">
      {/* Current Plan */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Gerenciar Assinatura ({getGatewayName()})
        </h3>
        
        <div className="flex items-center justify-between mb-6">
          <div>
            <h4 className="font-medium text-gray-900">{currentProduct.name}</h4>
            <p className="text-sm text-gray-600">{formatPrice(currentProduct.price)}/mês</p>
          </div>
          <span className="px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
            Ativo
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={handleUpdatePaymentMethod}
            className={`${getGatewayColor()} text-white px-4 py-2 rounded-lg transition-colors flex items-center justify-center gap-2`}
          >
            {getGatewayIcon()}
            Atualizar Pagamento
          </button>
          
          <button
            onClick={() => setShowCancelModal(true)}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
          >
            Cancelar Assinatura
          </button>
          
          <button
            onClick={handleUpdatePaymentMethod}
            className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Falar com Suporte
          </button>
        </div>
      </div>

      {/* Upgrade/Downgrade Options */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Alterar Plano</h3>
        
        <div className="grid gap-4">
          {availableProducts.map((product) => {
            const isUpgrade = product.price > currentProduct.price;
            
            return (
              <div key={product.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-gray-900">{product.name}</h4>
                    <p className="text-sm text-gray-600">{formatPrice(product.price)}/mês</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className={`flex items-center gap-1 text-sm ${
                      isUpgrade ? 'text-green-600' : 'text-blue-600'
                    }`}>
                      {isUpgrade ? (
                        <ArrowUpRight className="h-4 w-4" />
                      ) : (
                        <ArrowDownRight className="h-4 w-4" />
                      )}
                      {isUpgrade ? 'Upgrade' : 'Downgrade'}
                    </div>
                    <button
                      onClick={() => handleUpgrade(product.id)}
                      disabled={isLoading}
                      className={`px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50 ${
                        isUpgrade 
                          ? 'bg-green-600 text-white hover:bg-green-700'
                          : 'bg-blue-600 text-white hover:bg-blue-700'
                      }`}
                    >
                      {isLoading ? 'Processando...' : 'Solicitar'}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Cancel Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl p-6 max-w-md w-full mx-4"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-red-100 p-2 rounded-lg">
                <AlertCircle className="h-6 w-6 text-red-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Cancelar Assinatura</h3>
            </div>
            
            <p className="text-gray-600 mb-6">
              Tem certeza que deseja cancelar sua assinatura via {getGatewayName()}? Você continuará tendo acesso até o final do período atual.
            </p>
            
            <div className="flex gap-3">
              <button
                onClick={() => setShowCancelModal(false)}
                className="flex-1 bg-gray-100 text-gray-700 py-2 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Manter Assinatura
              </button>
              <button
                onClick={handleCancel}
                disabled={isLoading}
                className="flex-1 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
              >
                {isLoading ? 'Processando...' : 'Confirmar Cancelamento'}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default SubscriptionManager;