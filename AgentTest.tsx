import React, { useState, useEffect, useRef } from 'react';
import { Send, Bot, User, MessageCircle, Clock, CheckCircle, Loader } from 'lucide-react';
// Simple toast replacement
const useToast = () => ({
  toast: ({ title, description, variant }: { title: string; description: string; variant?: string }) => {
    console.log(`[${variant || 'info'}] ${title}: ${description}`);
    alert(`${title}\n${description}`);
  }
});
import { useLocation } from 'wouter';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

// Simple Badge component
const Badge = ({ children, variant = "default", className = "" }: { 
  children: React.ReactNode; 
  variant?: "default" | "secondary" | "outline"; 
  className?: string;
}) => {
  const baseClasses = "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium";
  const variantClasses = {
    default: "bg-gray-100 text-gray-800",
    secondary: "bg-blue-100 text-blue-800", 
    outline: "border border-gray-200 text-gray-700"
  };
  
  return (
    <span className={`${baseClasses} ${variantClasses[variant]} ${className}`}>
      {children}
    </span>
  );
};

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

export default function AgentTest() {
  // Extract id from URL pathname
  const id = window.location.pathname.split('/').pop();
  const { toast } = useToast();
  const [location, navigate] = useLocation();
  
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
        toast({
          title: "Agente não encontrado",
          description: "Este link de teste pode ter expirado ou não existe.",
          variant: "destructive",
        });
        navigate('/');
      }
    } catch (error) {
      console.error('Error loading agent:', error);
      toast({
        title: "Erro ao carregar agente",
        description: "Tente novamente em alguns momentos.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const initializeChat = () => {
    const welcomeMessage: Message = {
      id: 'welcome',
      content: `Olá! Sou seu assistente virtual da ${agent?.business || 'empresa'}. Estou aqui para ajudá-lo com informações, agendamentos e dúvidas. Como posso ajudá-lo hoje?`,
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
      // Use the correct agent ID for HumanTic support agent
      const response = await fetch(`/api/mcp/agent/mcp_personalizado_1751833568572/message`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: newMessage
        })
      });

      const data = await response.json();
      
      if (data.success && data.response) {
        // Simular delay de digitação para parecer mais natural
        await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));
        
        const botMessage: Message = {
          id: (Date.now() + 1).toString(),
          content: data.response,
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
          <Loader className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
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
              <div className="bg-primary/10 p-2 rounded-full">
                <Bot className="h-6 w-6 text-primary" />
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
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                <CheckCircle className="h-3 w-3 mr-1" />
                Online
              </Badge>
              <Badge variant="outline">
                <Clock className="h-3 w-3 mr-1" />
                Teste Ativo
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Chat Area */}
          <div className="lg:col-span-2">
            <Card className="h-[600px] flex flex-col">
              <CardHeader className="bg-gray-50 border-b">
                <CardTitle className="text-lg flex items-center">
                  <MessageCircle className="h-5 w-5 mr-2" />
                  Chat de Teste
                </CardTitle>
              </CardHeader>
              
              <CardContent className="flex-1 p-0 overflow-hidden">
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
                            ? 'bg-primary text-white'
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
                              message.sender === 'user' ? 'text-blue-100' : 'text-gray-500'
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
                    <Input
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Digite sua mensagem..."
                      disabled={isSending}
                      className="flex-1"
                    />
                    <Button 
                      onClick={sendMessage} 
                      disabled={!newMessage.trim() || isSending}
                      className="px-4"
                    >
                      {isSending ? (
                        <Loader className="h-4 w-4 animate-spin" />
                      ) : (
                        <Send className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Agent Info */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Sobre o Agente</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
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
              </CardContent>
            </Card>

            {/* Suggestions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Sugestões de Teste</CardTitle>
              </CardHeader>
              <CardContent>
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
              </CardContent>
            </Card>

            {/* CTA */}
            <Card className="bg-primary/5">
              <CardContent className="p-6 text-center">
                <h3 className="font-semibold text-primary mb-2">
                  Gostou do teste?
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  Implemente seu agente personalizado e comece a automatizar seu atendimento hoje mesmo.
                </p>
                <Button 
                  onClick={() => navigate('/personalizar-agente')}
                  className="w-full"
                >
                  Desbloquear Agente Teste
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}