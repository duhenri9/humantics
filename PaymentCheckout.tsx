import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CreditCard, ExternalLink } from 'lucide-react';
import { formatPrice, Product } from '../payment-config';
import { showSuccess, showError } from '../utils/toast';
import { createCheckoutSession } from '../lib/stripe';

interface PaymentCheckoutProps {
  product: Product;
  onSuccess?: () => void;
  onCancel?: () => void;
  className?: string;
  children?: React.ReactNode;
}

const PaymentCheckout: React.FC<PaymentCheckoutProps> = ({
  product,
  onSuccess,
  onCancel,
  className = '',
  children
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleCheckout = async () => {
    setIsLoading(true);

    try {
      if (product.gateway === 'stripe') {
        // Para Stripe, usamos a integração real com redirecionamento
        const checkoutUrl = await createCheckoutSession(
          product, 
          product.category === 'maintenance' ? 'subscription' : 'payment'
        );
        
        if (checkoutUrl) {
          // Redirecionar para o checkout do Stripe
          window.location.href = checkoutUrl;
          return; // Importante: não continuar a execução
        } else {
          throw new Error('Não foi possível criar a sessão de checkout');
        }
      } else {
        // Para Asaas, simulamos o processo por enquanto
        // Em produção, isso seria substituído por um redirecionamento para o Asaas
        await new Promise(resolve => setTimeout(resolve, 1000));
        showSuccess(`Solicitação enviada via Asaas com sucesso! Nossa equipe entrará em contato em breve.`);
        onSuccess?.();
      }
    } catch (error: any) {
      console.error('Checkout error:', error);
      showError(error.message || 'Erro ao processar solicitação');
    } finally {
      setIsLoading(false);
    }
  };

  const getGatewayIcon = () => {
    if (product.gateway === 'stripe') {
      return <CreditCard className="h-4 w-4" />;
    } else {
      return <ExternalLink className="h-4 w-4" />;
    }
  };

  const getGatewayColor = () => {
    return product.gateway === 'stripe' 
      ? 'bg-blue-600 hover:bg-blue-700' 
      : 'bg-green-600 hover:bg-green-700';
  };

  const defaultButton = (
    <button
      onClick={handleCheckout}
      disabled={isLoading}
      className={`${getGatewayColor()} text-white px-6 py-3 rounded-lg transition-colors flex items-center justify-center gap-2 font-semibold disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
    >
      {isLoading ? (
        <>
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
          Processando...
        </>
      ) : (
        <>
          {getGatewayIcon()}
          Solicitar via {product.gateway === 'stripe' ? 'Stripe' : 'Asaas'} {formatPrice(product.price, product.currency)}
        </>
      )}
    </button>
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="payment-checkout"
    >
      {children ? (
        <div onClick={handleCheckout} className={isLoading ? 'pointer-events-none opacity-50' : 'cursor-pointer'}>
          {children}
        </div>
      ) : (
        defaultButton
      )}
    </motion.div>
  );
};

export default PaymentCheckout;