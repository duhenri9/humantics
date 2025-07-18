import React, { useState, useEffect, useRef } from 'react';
import { Send, Bot, User, Loader } from 'lucide-react';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

interface Agent {
  mcp_id: string;
  name: string;
  business: string;
  agent_type: string;
  test_url: string;
  created_at: string;
}

export default function AgentTestBasic() {
  // Extract id from URL pathname
  const id = window.location.pathname.split('/').pop();
  
  const [agent, setAgent] = useState<Agent | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadAgent();
  }, [id]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const loadAgent = async () => {
    try {
      const response = await fetch(`/api/mcp/agent/mcp_essencial_${id}`);
      const data = await response.json();
      
      if (data.status === 'ok') {
        setAgent(data.agent);
        initializeChat();
      } else {
        console.error('Agent not found');
        window.location.href = '/';
      }
    } catch (error) {
      console.error('Error loading agent:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const initializeChat = () => {
    if (!agent) return;
    
    const welcomeMessage: Message = {
      id: 'welcome',
      content: `Olá! 😊 Seja muito bem-vindo(a) ao ${agent.business}! 

Sou o assistente virtual inteligente e estou aqui 24 horas por dia para ajudá-lo. Posso auxiliar com:

• Informações sobre nossos serviços
• Agendamentos e disponibilidade  
• Dúvidas gerais e orientações
• Direcionamento para especialistas

Como posso tornar seu dia melhor hoje?`,
      sender: 'bot',
      timestamp: new Date()
    };
    setMessages([welcomeMessage]);
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || isSending) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: newMessage,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setNewMessage('');
    setIsSending(true);
    setIsTyping(true);

    try {
      const response = await fetch(`/api/mcp/agent/mcp_essencial_${id}/message`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: newMessage,
          context: {
            id: Date.now(),
            conversation_history: messages.slice(-5)
          }
        })
      });

      const data = await response.json();
      
      if (data.result) {
        // Simular delay de digitação
        await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));
        
        const botMessage: Message = {
          id: (Date.now() + 1).toString(),
          content: data.result.content,
          sender: 'bot',
          timestamp: new Date()
        };
        
        setMessages(prev => [...prev, botMessage]);
      } else {
        throw new Error('Resposta inválida do agente');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: 'Desculpe, houve um problema técnico. Tente novamente em alguns momentos.',
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsSending(false);
      setIsTyping(false);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader className="h-8 w-8 animate-spin text-purple-600 mx-auto mb-4" />
          <p className="text-gray-600">Carregando seu agente de teste...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="bg-purple-100 p-2 rounded-full">
                <Bot className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">
                  Teste Gratuito - {agent?.business}
                </h1>
                <p className="text-sm text-gray-600">
                  Agente Essencial • Desbloquear Agente Teste
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                <span className="w-2 h-2 bg-green-400 rounded-full mr-1"></span>
                Online
              </span>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                Teste Ativo
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Chat Area */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow h-[600px] flex flex-col">
              <div className="bg-gray-50 border-b px-4 py-3 rounded-t-lg">
                <h3 className="text-lg font-semibold flex items-center">
                  <Bot className="h-5 w-5 mr-2" />
                  Chat de Teste
                </h3>
              </div>
              
              <div className="flex-1 overflow-hidden">
                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4 h-[450px]">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                          message.sender === 'user'
                            ? 'bg-purple-600 text-white'
                            : 'bg-gray-100 text-gray-900'
                        }`}
                      >
                        <div className="flex items-start space-x-2">
                          {message.sender === 'bot' && (
                            <Bot className="h-4 w-4 mt-0.5 flex-shrink-0" />
                          )}
                          {message.sender === 'user' && (
                            <User className="h-4 w-4 mt-0.5 flex-shrink-0" />
                          )}
                          <div>
                            <p className="text-sm">{message.content}</p>
                            <p className={`text-xs mt-1 ${
                              message.sender === 'user' ? 'text-purple-100' : 'text-gray-500'
                            }`}>
                              {message.timestamp.toLocaleTimeString()}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {/* Typing indicator */}
                  {isTyping && (
                    <div className="flex justify-start">
                      <div className="bg-gray-100 px-4 py-2 rounded-lg">
                        <div className="flex items-center space-x-2">
                          <Bot className="h-4 w-4" />
                          <div className="flex space-x-1">
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <div ref={messagesEndRef} />
                </div>
                
                {/* Input */}
                <div className="border-t p-4">
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Digite sua mensagem..."
                      disabled={isSending}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                    <button 
                      onClick={sendMessage} 
                      disabled={!newMessage.trim() || isSending}
                      className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                    >
                      {isSending ? (
                        <Loader className="h-4 w-4 animate-spin" />
                      ) : (
                        <Send className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Agent Info */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold mb-4">Sobre o Agente</h3>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-600">Negócio</p>
                  <p className="font-medium">{agent?.business}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Tipo</p>
                  <p className="font-medium">Agente Essencial</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Recursos</p>
                  <ul className="text-sm text-gray-700 space-y-1 mt-1">
                    <li>• Atendimento 24/7</li>
                    <li>• Respostas inteligentes</li>
                    <li>• Integração WhatsApp</li>
                    <li>• Personalização completa</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Suggestions */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold mb-4">Sugestões de Teste</h3>
              <div className="space-y-2">
                <button
                  onClick={() => setNewMessage('Quais são os horários de funcionamento?')}
                  className="w-full text-left p-2 text-sm bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  "Quais são os horários de funcionamento?"
                </button>
                <button
                  onClick={() => setNewMessage('Como posso agendar um horário?')}
                  className="w-full text-left p-2 text-sm bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  "Como posso agendar um horário?"
                </button>
                <button
                  onClick={() => setNewMessage('Quais serviços vocês oferecem?')}
                  className="w-full text-left p-2 text-sm bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  "Quais serviços vocês oferecem?"
                </button>
                <button
                  onClick={() => setNewMessage('Onde vocês estão localizados?')}
                  className="w-full text-left p-2 text-sm bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  "Onde vocês estão localizados?"
                </button>
              </div>
            </div>

            {/* CTA */}
            <div className="bg-purple-50 rounded-lg shadow p-6 text-center">
              <h3 className="font-semibold text-purple-800 mb-2">
                Gostou do teste?
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                Implemente seu agente personalizado e comece a automatizar seu atendimento hoje mesmo.
              </p>
              <button 
                onClick={() => window.location.href = '/personalizar-agente'}
                className="w-full bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 transition-colors"
              >
                Desbloquear Agente Teste
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}