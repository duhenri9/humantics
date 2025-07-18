import { useState, useEffect } from 'react';
import { MessageCircle, X, Phone, Clock, CheckCircle, Bot } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface WhatsAppStatus {
  isReady: boolean;
  hasQR: boolean;
  phone: string;
  message: string;
}

export default function WhatsAppFloatingButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [status, setStatus] = useState<WhatsAppStatus | null>(null);
  const [loading, setLoading] = useState(true);

  // Debug removed for production

  useEffect(() => {
    checkWhatsAppStatus();
    const interval = setInterval(checkWhatsAppStatus, 10000); // Check every 10 seconds
    return () => clearInterval(interval);
  }, []);

  const checkWhatsAppStatus = async () => {
    try {
      const response = await fetch('/api/whatsapp/status');
      const data = await response.json();
      
      if (data.status === 'success') {
        setStatus(data.whatsapp);
      }
    } catch (error) {
      console.error('Error checking WhatsApp status:', error);
    } finally {
      setLoading(false);
    }
  };

  const openWhatsApp = () => {
    const phone = '5511950377457';
    const message = encodeURIComponent('Olá! Vim do site da HumanTic e gostaria de saber mais sobre os agentes de IA. Podem me ajudar?');
    const whatsappUrl = `https://wa.me/${phone}?text=${message}`;
    window.open(whatsappUrl, '_blank');
  };

  const getStatusIcon = () => {
    if (loading) return <Clock className="h-4 w-4 animate-spin" />;
    if (status?.isReady) return <CheckCircle className="h-4 w-4 text-green-500" />;
    return <Clock className="h-4 w-4 text-yellow-500" />;
  };

  const getStatusText = () => {
    if (loading) return 'Verificando...';
    if (status?.isReady) return 'Online agora';
    return status?.message || 'Preparando...';
  };

  return (
    <>
      {/* Floating Button */}
      <motion.div
        className="fixed bottom-6 right-6 z-[9999]"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0 }}
      >
        <motion.button
          onClick={() => setIsOpen(!isOpen)}
          className="bg-gradient-to-r from-[#6D7AFF] to-[#5A67F0] hover:from-[#5A67F0] hover:to-[#4854E0] text-white rounded-full p-4 shadow-xl transition-all duration-300 group relative"
          style={{
            boxShadow: '0 8px 32px rgba(109, 122, 255, 0.3), 0 4px 16px rgba(0, 0, 0, 0.1)'
          }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <MessageCircle className="h-6 w-6" />
          
          {/* Status indicator */}
          <div className="absolute -top-1 -right-1 h-4 w-4 rounded-full border-2 border-white flex items-center justify-center">
            {status?.isReady ? (
              <div className="h-2 w-2 bg-green-400 rounded-full animate-pulse" />
            ) : (
              <div className="h-2 w-2 bg-yellow-400 rounded-full" />
            )}
          </div>

          {/* Pulse animation when ready */}
          {status?.isReady && (
            <div className="absolute inset-0 rounded-full bg-[#6D7AFF] animate-ping opacity-30" />
          )}
        </motion.button>
      </motion.div>

      {/* Popup Card */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed bottom-24 right-6 z-50 bg-white rounded-2xl shadow-2xl border border-gray-200 p-6 w-80"
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ duration: 0.2 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="bg-gradient-to-r from-[#6D7AFF]/10 to-[#5A67F0]/10 p-3 rounded-xl border border-[#6D7AFF]/20">
                  <MessageCircle className="h-6 w-6 text-[#6D7AFF]" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">HumanTic</h3>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    {getStatusIcon()}
                    <span>{getStatusText()}</span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Minimalist Content */}
            <div className="mb-4">
              <div className="bg-gradient-to-r from-[#6D7AFF]/10 to-[#5A67F0]/10 border border-[#6D7AFF]/20 rounded-xl p-4">
                <div className="flex items-center gap-2 text-[#6D7AFF] text-sm font-semibold">
                  <CheckCircle className="h-4 w-4" />
                  Agente Disponível
                </div>
              </div>
            </div>

            {/* Single Action Button */}
            <div className="mb-4">
              <motion.button
                onClick={openWhatsApp}
                className="w-full py-4 px-4 rounded-xl font-bold transition-all duration-200 flex items-center justify-center gap-2 bg-gradient-to-r from-[#6D7AFF] to-[#5A67F0] hover:from-[#5A67F0] hover:to-[#4854E0] text-white shadow-lg hover:shadow-xl"
                style={{
                  boxShadow: '0 4px 20px rgba(109, 122, 255, 0.3)'
                }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <MessageCircle className="h-4 w-4" />
                Conversar no WhatsApp
              </motion.button>
            </div>

            {/* Modern Minimalist Footer */}
            <div className="text-center pt-2 border-t border-gray-100">
              <p className="text-xs text-gray-400 font-medium">
                Assistente com tecnologia de IA
              </p>
              <p className="text-xs text-gray-300 mt-1 leading-relaxed">
                Criado com o Humantic Essencial.<br />
                AI-powered assistant Created with<br />
                HumanTic Agentes como Serviço (AaaS) da WM3 Digital.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}