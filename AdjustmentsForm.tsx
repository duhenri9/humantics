import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Settings, 
  Send, 
  AlertCircle, 
  CheckCircle,
  MessageSquare,
  Clock,
  User,
  Zap
} from 'lucide-react';
import { useClient } from '../../context/ClientContext';
import { showSuccess, showError } from '../../utils/toast';
import { getWebhookUrl } from '../../utils/deployConfig';

const AdjustmentsForm = () => {
  const { clienteId } = useClient();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    tipo_ajuste: '',
    mensagem: '',
    prioridade: 'media' as 'baixa' | 'media' | 'alta'
  });

  const adjustmentTypes = [
    {
      value: 'personalidade',
      label: 'Personalidade do Agente',
      description: 'Tom de voz, estilo de comunicação, formalidade',
      icon: User,
      examples: ['Mais formal', 'Mais amigável', 'Linguagem técnica']
    },
    {
      value: 'respostas',
      label: 'Respostas Automáticas',
      description: 'Conteúdo das mensagens automáticas',
      icon: MessageSquare,
      examples: ['Saudação', 'Despedida', 'Mensagens de erro']
    },
    {
      value: 'fluxo',
      label: 'Fluxo de Conversa',
      description: 'Sequência e lógica das interações',
      icon: Zap,
      examples: ['Ordem das perguntas', 'Condições de transferência']
    },
    {
      value: 'integracao',
      label: 'Integração',
      description: 'Conexões com sistemas externos',
      icon: Settings,
      examples: ['WhatsApp', 'CRM', 'Google Calendar']
    },
    {
      value: 'horario',
      label: 'Horário de Funcionamento',
      description: 'Quando o agente deve estar ativo',
      icon: Clock,
      examples: ['Horário comercial', 'Finais de semana', 'Feriados']
    }
  ];

  const priorityOptions = [
    {
      value: 'baixa',
      label: 'Baixa',
      description: 'Pode aguardar próxima manutenção',
      color: 'green',
      icon: '🟢'
    },
    {
      value: 'media',
      label: 'Média',
      description: 'Importante, mas não urgente',
      color: 'yellow',
      icon: '🟡'
    },
    {
      value: 'alta',
      label: 'Alta',
      description: 'Precisa ser resolvido rapidamente',
      color: 'red',
      icon: '🔴'
    }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!clienteId) {
      showError('ID do cliente não encontrado. Faça login novamente.');
      return;
    }

    setIsSubmitting(true);

    try {
      // Obter URL do webhook
      const webhookUrl = getWebhookUrl('FOLLOWUP_AJUSTE');
      
      // Enviar dados para o webhook
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          cliente_id: clienteId,
          ...formData
        }),
      });

      if (response.ok) {
        showSuccess('Solicitação de ajuste enviada com sucesso! Nossa equipe entrará em contato em breve.');
        setFormData({ tipo_ajuste: '', mensagem: '', prioridade: 'media' });
      } else {
        throw new Error('Erro ao enviar ajuste');
      }
    } catch (error) {
      showError('Erro ao enviar solicitação. Tente novamente.');
      console.error('Error submitting ajuste form:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const selectedAdjustmentType = adjustmentTypes.find(type => type.value === formData.tipo_ajuste);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto space-y-8"
    >
      {/* Header */}
      <div className="bg-white rounded-xl border border-gray-200 p-8">
        <div className="mb-6">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Solicitar Ajustes</h2>
          <p className="text-gray-600 text-lg">Precisa de algum ajuste no seu agente? Nos conte aqui!</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Tipo de Ajuste */}
          <div>
            <label className="block text-lg font-semibold text-gray-900 mb-4">
              Tipo de Ajuste *
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {adjustmentTypes.map((type) => (
                <motion.div
                  key={type.value}
                  onClick={() => handleInputChange('tipo_ajuste', type.value)}
                  className={`p-4 border-2 rounded-xl cursor-pointer transition-all hover:shadow-md ${
                    formData.tipo_ajuste === type.value
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`p-2 rounded-lg ${
                      formData.tipo_ajuste === type.value ? 'bg-blue-100' : 'bg-gray-100'
                    }`}>
                      <type.icon className={`h-5 w-5 ${
                        formData.tipo_ajuste === type.value ? 'text-blue-600' : 'text-gray-600'
                      }`} />
                    </div>
                    <h3 className="font-semibold text-gray-900">{type.label}</h3>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">{type.description}</p>
                  <div className="space-y-1">
                    <p className="text-xs font-medium text-gray-500">Exemplos:</p>
                    {type.examples.map((example, idx) => (
                      <p key={idx} className="text-xs text-gray-500">• {example}</p>
                    ))}
                  </div>
                  {formData.tipo_ajuste === type.value && (
                    <div className="absolute top-3 right-3">
                      <CheckCircle className="h-5 w-5 text-blue-600" />
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>

          {/* Descrição Detalhada */}
          <div>
            <label className="block text-lg font-semibold text-gray-900 mb-4">
              Descrição do Ajuste *
            </label>
            {selectedAdjustmentType && (
              <div className="mb-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-center gap-2 mb-2">
                  <selectedAdjustmentType.icon className="h-4 w-4 text-blue-600" />
                  <span className="font-medium text-blue-900">{selectedAdjustmentType.label}</span>
                </div>
                <p className="text-sm text-blue-700">
                  Descreva detalhadamente o que você gostaria de ajustar em relação a {selectedAdjustmentType.label.toLowerCase()}.
                </p>
              </div>
            )}
            <textarea
              required
              rows={6}
              value={formData.mensagem}
              onChange={(e) => handleInputChange('mensagem', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              placeholder={
                selectedAdjustmentType
                  ? `Descreva o ajuste necessário para ${selectedAdjustmentType.label.toLowerCase()}...`
                  : 'Descreva detalhadamente o ajuste que você gostaria de fazer...'
              }
            />
            <div className="mt-2 text-sm text-gray-500">
              💡 <strong>Dica:</strong> Seja específico! Quanto mais detalhes você fornecer, melhor poderemos atender sua solicitação.
            </div>
          </div>

          {/* Prioridade */}
          <div>
            <label className="block text-lg font-semibold text-gray-900 mb-4">
              Prioridade
            </label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {priorityOptions.map((priority) => (
                <motion.div
                  key={priority.value}
                  onClick={() => handleInputChange('prioridade', priority.value)}
                  className={`p-4 border-2 rounded-xl cursor-pointer transition-all ${
                    formData.prioridade === priority.value
                      ? `border-${priority.color}-500 bg-${priority.color}-50`
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-xl">{priority.icon}</span>
                    <h3 className="font-semibold text-gray-900">{priority.label}</h3>
                  </div>
                  <p className="text-sm text-gray-600">{priority.description}</p>
                  {formData.prioridade === priority.value && (
                    <div className="absolute top-3 right-3">
                      <CheckCircle className={`h-5 w-5 text-${priority.color}-600`} />
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end pt-6 border-t border-gray-200">
            <button
              type="submit"
              disabled={isSubmitting || !formData.tipo_ajuste || !formData.mensagem}
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
                  Enviar Solicitação
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Information Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-green-50 border border-green-200 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-3">
            <CheckCircle className="h-6 w-6 text-green-600" />
            <h3 className="font-semibold text-green-900">Tempo de Resposta</h3>
          </div>
          <ul className="space-y-2 text-sm text-green-800">
            <li>• <strong>Baixa prioridade:</strong> 3-5 dias úteis</li>
            <li>• <strong>Média prioridade:</strong> 1-2 dias úteis</li>
            <li>• <strong>Alta prioridade:</strong> Até 24 horas</li>
          </ul>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-3">
            <AlertCircle className="h-6 w-6 text-blue-600" />
            <h3 className="font-semibold text-blue-900">Processo de Ajuste</h3>
          </div>
          <ul className="space-y-2 text-sm text-blue-800">
            <li>• Nossa equipe analisa sua solicitação</li>
            <li>• Implementamos o ajuste solicitado</li>
            <li>• Você recebe notificação para testar</li>
            <li>• Validamos se está conforme esperado</li>
          </ul>
        </div>
      </div>
    </motion.div>
  );
};

export default AdjustmentsForm;