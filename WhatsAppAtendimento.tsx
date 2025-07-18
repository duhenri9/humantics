import React, { useState, useEffect } from 'react';
import { MessageCircle, Send, Phone, Clock, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { showSuccess, showError } from '../utils/toast';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';

interface WhatsAppMessage {
  id: string;
  phone: string;
  message: string;
  timestamp: string;
  status: 'received' | 'responded' | 'pending';
  name?: string;
}

const respostasProntas = [
  {
    titulo: 'Planos Disponíveis',
    texto: `🤖 HumanTic - Automatização WhatsApp

📋 Nossos Planos:
• Essencial: R$ 835 (ativação) + R$ 195/mês
• Agenda: R$ 1.289 (ativação) + R$ 325/mês  
• Conversão: R$ 1.769 (ativação) + R$ 498/mês

💬 WhatsApp: +55 11 950377457
✉️ Email: humantic@wm3digital.com.br

Como posso ajudar com mais detalhes?`
  },
  {
    titulo: 'Plano Essencial',
    texto: `🔵 Plano Essencial - R$ 835 + R$ 195/mês

✅ Incluso:
• Atendimento 24/7 via WhatsApp
• Respostas automáticas inteligentes
• Suporte contínuo
• Integração com seu negócio

💰 Pagamento: 50% na contratação + 50% após aprovação
📞 Quer agendar uma demonstração?`
  },
  {
    titulo: 'Plano Agenda',
    texto: `🟣 Plano Agenda - R$ 1.289 + R$ 325/mês

✅ Tudo do Essencial +
• Agendamento automático Google Calendar
• Reduz no-shows em 70%
• Confirmações e lembretes automáticos
• Sincronização total com sua agenda

💰 Pagamento: 50% na contratação + 50% após aprovação
📅 Perfeito para clínicas, escritórios e prestadores de serviço!`
  },
  {
    titulo: 'Plano Conversão',
    texto: `🟢 Plano Conversão - R$ 1.769 + R$ 498/mês

✅ Solução Completa:
• Tudo dos planos anteriores
• Qualificação automática de leads
• CRM integrado
• Relatórios de performance detalhados
• Máxima conversão de leads em vendas

💰 Pagamento: 50% na contratação + 50% após aprovação
🚀 Ideal para empresas focadas em crescimento!`
  },
  {
    titulo: 'Agendar Demonstração',
    texto: `📅 Demonstração HumanTic

Adoraria mostrar como nosso sistema pode transformar seu atendimento!

🕐 Disponibilidade:
• Segunda a Sexta: 9h às 18h
• Demonstração: 15-20 minutos
• Online via Google Meet

📞 Para agendar:
• WhatsApp: +55 11 950377457
• Email: humantic@wm3digital.com.br

Qual horário prefere esta semana?`
  },
  {
    titulo: 'Informações Gerais',
    texto: `ℹ️ HumanTic - Automatização Inteligente

🤖 O que fazemos:
• Automatizamos seu atendimento WhatsApp
• Reduzimos 80% das perguntas repetitivas
• Aumentamos conversão de leads
• Melhoramos experiência do cliente

💼 Ideal para:
• Clínicas e consultórios
• Escritórios (advocacia, contabilidade)
• E-commerce e lojas
• Prestadores de serviços

📞 Fale conosco: +55 11 950377457`
  }
];

export default function WhatsAppAtendimento() {
  const { user } = useAuth();
  const [selectedMessage, setSelectedMessage] = useState<WhatsAppMessage | null>(null);
  const [customMessage, setCustomMessage] = useState('');
  const [messages, setMessages] = useState<WhatsAppMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Verificar se é admin
  if (!user || user.role !== 'admin') {
    return (
      <div className="flex h-screen bg-gray-100">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header />
          <main className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Acesso Restrito</h2>
              <p className="text-gray-600">Esta página é exclusiva para administradores.</p>
            </div>
          </main>
        </div>
      </div>
    );
  }

  useEffect(() => {
    fetchMessages();
    const interval = setInterval(fetchMessages, 5000);
    return () => clearInterval(interval);
  }, []);

  const fetchMessages = async () => {
    try {
      const response = await fetch('/api/whatsapp/messages');
      const data = await response.json();
      setMessages(data || []);
    } catch (error) {
      console.error('Error fetching messages:', error);
      // Dados mock para demonstração
      setMessages([
        {
          id: '1',
          phone: '+5511999887766',
          name: 'Maria Silva',
          message: 'Olá! Gostaria de saber mais sobre os planos de automação WhatsApp.',
          timestamp: new Date().toISOString(),
          status: 'pending'
        },
        {
          id: '2', 
          phone: '+5511988776655',
          name: 'João Santos',
          message: 'Preciso de um orçamento para agendamento automático. Quantos leads vocês conseguem capturar por mês?',
          timestamp: new Date(Date.now() - 1800000).toISOString(),
          status: 'pending'
        },
        {
          id: '3',
          phone: '+5511977665544',
          name: 'Ana Costa',
          message: 'Vi o site de vocês. O plano Conversão funciona para e-commerce? Tenho uma loja virtual.',
          timestamp: new Date(Date.now() - 3600000).toISOString(),
          status: 'pending'
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRespostaPronta = async (texto: string) => {
    if (!selectedMessage) return;
    
    try {
      const response = await fetch('/api/whatsapp/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: selectedMessage.phone,
          message: texto
        })
      });

      if (response.ok) {
        showSuccess('Mensagem enviada com sucesso via WhatsApp');
        setSelectedMessage(null);
        fetchMessages();
      } else {
        throw new Error('Falha no envio');
      }
    } catch (error) {
      showError('Erro ao enviar mensagem');
    }
  };

  const handleCustomMessage = async () => {
    if (!selectedMessage || !customMessage.trim()) return;
    
    try {
      const response = await fetch('/api/whatsapp/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: selectedMessage.phone,
          message: customMessage
        })
      });

      if (response.ok) {
        showSuccess('Mensagem personalizada enviada');
        setCustomMessage('');
        setSelectedMessage(null);
        fetchMessages();
      } else {
        throw new Error('Falha no envio');
      }
    } catch (error) {
      showError('Erro ao enviar mensagem');
    }
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-6">
          <div className="max-w-7xl mx-auto">
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <MessageCircle className="w-6 h-6 text-[#6D7AFF]" />
                Atendimento WhatsApp
              </h1>
              <p className="text-gray-600 mt-1">
                Monitor e responda mensagens WhatsApp em tempo real
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Lista de Mensagens */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-lg shadow">
                  <div className="p-4 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">Mensagens Recebidas</span>
                      <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-sm">
                        {messages.length}
                      </span>
                    </div>
                  </div>
                  <div className="max-h-[500px] overflow-y-auto">
                    {isLoading ? (
                      <div className="p-4 text-center text-gray-500">
                        Carregando mensagens...
                      </div>
                    ) : messages.length === 0 ? (
                      <div className="p-4 text-center text-gray-500">
                        Nenhuma mensagem pendente
                      </div>
                    ) : (
                      messages.map((message) => (
                        <div
                          key={message.id}
                          className={`p-4 border-b cursor-pointer hover:bg-gray-50 ${
                            selectedMessage?.id === message.id ? 'bg-[#6D7AFF]/10 border-l-4 border-l-[#6D7AFF]' : ''
                          }`}
                          onClick={() => setSelectedMessage(message)}
                        >
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <User className="w-4 h-4 text-gray-500" />
                              <span className="font-medium text-sm">
                                {message.name || message.phone}
                              </span>
                            </div>
                            <span className={`px-2 py-1 rounded text-xs ${
                              message.status === 'pending' 
                                ? 'bg-red-100 text-red-800' 
                                : 'bg-green-100 text-green-800'
                            }`}>
                              {message.status === 'pending' ? 'Pendente' : 'Respondido'}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                            {message.message}
                          </p>
                          <div className="flex items-center gap-1 text-xs text-gray-500">
                            <Clock className="w-3 h-3" />
                            {formatTime(message.timestamp)}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>

              {/* Área de Resposta */}
              <div className="lg:col-span-2">
                {selectedMessage ? (
                  <div className="space-y-6">
                    {/* Detalhes da Mensagem */}
                    <div className="bg-white rounded-lg shadow">
                      <div className="p-4 border-b border-gray-200">
                        <div className="flex items-center gap-2">
                          <Phone className="w-5 h-5 text-[#6D7AFF]" />
                          <span className="font-medium">
                            {selectedMessage.name || selectedMessage.phone}
                          </span>
                        </div>
                      </div>
                      <div className="p-4">
                        <div className="bg-gray-50 p-4 rounded-lg mb-4">
                          <p className="text-gray-900">{selectedMessage.message}</p>
                          <p className="text-sm text-gray-500 mt-2">
                            Recebido às {formatTime(selectedMessage.timestamp)}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Respostas Prontas */}
                    <div className="bg-white rounded-lg shadow">
                      <div className="p-4 border-b border-gray-200">
                        <h3 className="font-medium">Respostas Prontas</h3>
                      </div>
                      <div className="p-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {respostasProntas.map((resposta, index) => (
                            <button
                              key={index}
                              className="p-3 border border-gray-200 rounded-lg text-left hover:bg-gray-50 transition-colors"
                              onClick={() => handleRespostaPronta(resposta.texto)}
                            >
                              <div className="font-medium text-sm">{resposta.titulo}</div>
                              <div className="text-xs text-gray-500 mt-1">
                                {resposta.texto.substring(0, 60)}...
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Mensagem Personalizada */}
                    <div className="bg-white rounded-lg shadow">
                      <div className="p-4 border-b border-gray-200">
                        <h3 className="font-medium">Mensagem Personalizada</h3>
                      </div>
                      <div className="p-4">
                        <div className="space-y-4">
                          <textarea
                            className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-[#6D7AFF] focus:border-transparent"
                            placeholder="Digite sua resposta personalizada..."
                            value={customMessage}
                            onChange={(e) => setCustomMessage(e.target.value)}
                            rows={4}
                          />
                          <button
                            onClick={handleCustomMessage}
                            disabled={!customMessage.trim()}
                            className="bg-[#6D7AFF] hover:bg-[#5A67E6] text-white px-4 py-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                          >
                            <Send className="w-4 h-4" />
                            Enviar Resposta
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="bg-white rounded-lg shadow h-[500px] flex items-center justify-center">
                    <div className="text-center">
                      <MessageCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-500 mb-2">
                        Selecione uma mensagem
                      </h3>
                      <p className="text-gray-400">
                        Escolha uma mensagem da lista para responder
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}