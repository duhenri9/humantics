import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  User, 
  Building, 
  Mail, 
  Phone, 
  Target,
  CheckCircle,
  Send
} from 'lucide-react';
import { useClient } from '../../context/ClientContext';
import { showSuccess, showError } from '../../utils/toast';
import { getWebhookUrl } from '../../utils/deployConfig';

const EntryForm = () => {
  const navigate = useNavigate();
  const { setClientData, loginAsClient } = useClient();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    nome_cliente: '',
    nome_empresa: '',
    email: '',
    whatsapp: '',
    plano: 'essencial' as 'essencial' | 'agenda' | 'conversao',
    objetivo: ''
  });

  const planoOptions = [
    {
      id: 'essencial',
      name: 'Agente Essencial',
      price: 'R$ 195/mês',
      setup: 'R$ 835 setup',
      features: ['Atendimento 24/7', 'WhatsApp nativo', 'Dashboard básico', 'Suporte contínuo'],
      color: 'blue'
    },
    {
      id: 'agenda',
      name: 'Agente de Agenda',
      price: 'R$ 325/mês',
      setup: 'R$ 1.289 setup',
      features: ['Agendamentos inteligentes', 'Google Calendar', 'Lembretes automáticos', 'Pré-triagem'],
      color: 'purple',
      popular: true
    },
    {
      id: 'conversao',
      name: 'Agente de Conversão',
      price: 'R$ 498/mês',
      setup: 'R$ 1.769 setup',
      features: ['Qualificação de leads', 'CRM integrado', 'Analytics avançado', 'Scoring inteligente'],
      color: 'green'
    }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Obter URL do webhook de produção ou desenvolvimento
      const webhookUrl = getWebhookUrl('ENTRADA_CLIENTE');
      
      // Enviar dados para o webhook
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      }).catch(() => {
        // Fallback mock response apenas em desenvolvimento
        if (import.meta.env.DEV) {
          return {
            ok: true,
            json: () => Promise.resolve({
              success: true,
              cliente_id: Date.now().toString(),
              message: 'Cliente cadastrado com sucesso'
            })
          };
        }
        throw new Error('Erro na conexão com o servidor');
      });

      let result;
      if (response.ok) {
        try {
          result = await response.json();
        } catch (error) {
          // Se JSON parsing falhar em desenvolvimento, criar resultado simulado
          if (import.meta.env.DEV) {
            result = {
              success: true,
              cliente_id: Date.now().toString(),
              message: 'Cliente cadastrado com sucesso'
            };
          } else {
            throw new Error('Resposta inválida do servidor');
          }
        }
        
        const newClientData = {
          id: result.cliente_id || Date.now().toString(),
          ...formData
        };
        
        // Login as client and set client data
        loginAsClient(newClientData);
        showSuccess('Dados enviados com sucesso! Você receberá nossa proposta em breve.');
        navigate('/client-area/journey');
      } else {
        throw new Error('Erro ao enviar dados');
      }
    } catch (error) {
      showError('Erro ao enviar dados. Tente novamente.');
      console.error('Error submitting entrada form:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl border border-gray-200 p-8"
        >
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Cadastro Inicial</h2>
            <p className="text-gray-600 text-lg">Preencha seus dados para começar sua jornada com a HumanTic</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Informações Pessoais */}
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <User className="h-5 w-5 text-blue-600" />
                Informações Pessoais
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nome Completo *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.nome_cliente}
                    onChange={(e) => handleInputChange('nome_cliente', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
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
                    value={formData.nome_empresa}
                    onChange={(e) => handleInputChange('nome_empresa', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
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
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
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
                    value={formData.whatsapp}
                    onChange={(e) => handleInputChange('whatsapp', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    placeholder="+55 11 99999-9999"
                  />
                </div>
              </div>
            </div>

            {/* Seleção de Plano */}
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Target className="h-5 w-5 text-blue-600" />
                Escolha seu Plano
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {planoOptions.map((plano) => (
                  <div
                    key={plano.id}
                    onClick={() => handleInputChange('plano', plano.id)}
                    className={`relative p-6 border-2 rounded-xl cursor-pointer transition-all hover:shadow-lg ${
                      formData.plano === plano.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    {plano.popular && (
                      <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-1 rounded-full text-sm font-bold">
                        🔥 Mais Popular
                      </div>
                    )}
                    
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${
                      plano.color === 'blue' ? 'bg-blue-100' :
                      plano.color === 'purple' ? 'bg-purple-100' :
                      'bg-green-100'
                    }`}>
                      <div className={`w-6 h-6 rounded-full ${
                        plano.color === 'blue' ? 'bg-blue-600' :
                        plano.color === 'purple' ? 'bg-purple-600' :
                        'bg-green-600'
                      }`}></div>
                    </div>
                    
                    <h4 className="text-lg font-bold text-gray-900 mb-2">{plano.name}</h4>
                    <div className="mb-4">
                      <div className="text-sm text-gray-500">{plano.setup}</div>
                      <div className="text-xl font-bold text-gray-900">{plano.price}</div>
                    </div>
                    
                    <ul className="space-y-2">
                      {plano.features.map((feature, idx) => (
                        <li key={idx} className="flex items-center gap-2 text-sm text-gray-600">
                          <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                    
                    {formData.plano === plano.id && (
                      <div className="absolute top-4 right-4">
                        <CheckCircle className="h-6 w-6 text-blue-600" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Objetivo */}
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Target className="h-5 w-5 text-blue-600" />
                Seu Objetivo
              </h3>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Objetivo Principal *
                </label>
                <textarea
                  required
                  rows={4}
                  value={formData.objetivo}
                  onChange={(e) => handleInputChange('objetivo', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  placeholder="Descreva qual é o seu principal objetivo com o agente digital. Por exemplo: automatizar agendamentos, melhorar atendimento ao cliente, qualificar leads, etc."
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end pt-6 border-t border-gray-200">
              <button
                type="submit"
                disabled={isSubmitting}
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
                    Enviar Cadastro
                  </>
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default EntryForm;