import React, { useState } from 'react';

export const AgentBuilder: React.FC = () => {
  const [formData, setFormData] = useState({
    agentName: '',
    businessType: '',
    targetAudience: '',
    goals: '',
    tone: 'friendly',
    plan: 'essencial',
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Simular envio para o email
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      alert('Solicitação enviada! Nossa equipe entrará em contato em até 24 horas para desenvolver seu agente personalizado.');
      
      // Reset form
      setFormData({
        agentName: '',
        businessType: '',
        targetAudience: '',
        goals: '',
        tone: 'friendly',
        plan: 'essencial',
      });
    } catch (error) {
      alert('Erro ao enviar solicitação. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <h1 className="text-2xl font-bold">
              <span className="text-purple-600">Human</span>
              <span className="text-gray-900">Tic</span>
            </h1>
            <a href="/dashboard" className="text-gray-600 hover:text-gray-800">
              ← Voltar ao Dashboard
            </a>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Personalizar Agente
          </h2>
          <p className="text-gray-600">
            Configure seu agente de IA personalizado para atendimento automatizado
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="agentName" className="block text-sm font-medium text-gray-700 mb-2">
                Nome do Agente
              </label>
              <input
                type="text"
                id="agentName"
                name="agentName"
                value={formData.agentName}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                placeholder="Ex: Atendente Virtual Loja ABC"
                required
              />
            </div>

            <div>
              <label htmlFor="businessType" className="block text-sm font-medium text-gray-700 mb-2">
                Tipo de Negócio
              </label>
              <input
                type="text"
                id="businessType"
                name="businessType"
                value={formData.businessType}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                placeholder="Ex: E-commerce, Consultório, Restaurante"
                required
              />
            </div>

            <div>
              <label htmlFor="targetAudience" className="block text-sm font-medium text-gray-700 mb-2">
                Público-Alvo
              </label>
              <input
                type="text"
                id="targetAudience"
                name="targetAudience"
                value={formData.targetAudience}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                placeholder="Ex: Jovens de 18-35 anos interessados em tecnologia"
                required
              />
            </div>

            <div>
              <label htmlFor="goals" className="block text-sm font-medium text-gray-700 mb-2">
                Objetivos do Agente
              </label>
              <textarea
                id="goals"
                name="goals"
                value={formData.goals}
                onChange={handleChange}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                placeholder="Descreva o que você espera que o agente faça (ex: responder dúvidas, agendar consultas, gerar leads)"
                required
              />
            </div>

            <div>
              <label htmlFor="tone" className="block text-sm font-medium text-gray-700 mb-2">
                Tom de Comunicação
              </label>
              <select
                id="tone"
                name="tone"
                value={formData.tone}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
              >
                <option value="friendly">Amigável</option>
                <option value="professional">Profissional</option>
                <option value="casual">Casual</option>
                <option value="formal">Formal</option>
              </select>
            </div>

            <div>
              <label htmlFor="plan" className="block text-sm font-medium text-gray-700 mb-2">
                Plano
              </label>
              <select
                id="plan"
                name="plan"
                value={formData.plan}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
              >
                <option value="essencial">Essencial - R$ 835</option>
                <option value="agenda">Agenda - R$ 1.289</option>
                <option value="conversao">Conversão - R$ 1.660</option>
              </select>
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={loading}
                style={{ backgroundColor: '#6D7AFF' }}
                className="w-full text-white py-3 px-4 rounded-md font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                {loading ? 'Enviando...' : 'Solicitar Desenvolvimento do Agente'}
              </button>
            </div>
          </form>

          <div className="mt-6 p-4 bg-purple-50 rounded-md">
            <p className="text-sm text-purple-800">
              <strong>Próximos passos:</strong> Após o envio, nossa equipe técnica analisará suas necessidades 
              e entrará em contato em até 24 horas para desenvolver seu agente personalizado.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
