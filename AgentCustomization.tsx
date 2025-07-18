import React, { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { showSuccess, showError } from "../utils/toast";
import { Loader2, ArrowRight, User, Building, Clock, MapPin, Target, Smile } from 'lucide-react';

const AgentCustomization = () => {
  const [, setLocation] = useLocation();
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    businessName: '',
    businessType: '',
    mainServices: [] as string[],
    workingHours: '',
    location: '',
    targetAudience: '',
    tone: 'friendly',
    greeting: '',
    knowledgeBase: '',
    agentName: ''
  });

  const businessTypes = [
    { value: 'clinica', label: 'Clínica/Consultório' },
    { value: 'escritorio', label: 'Escritório de Advocacia' },
    { value: 'contabilidade', label: 'Escritório de Contabilidade' },
    { value: 'consultoria', label: 'Consultoria' },
    { value: 'ecommerce', label: 'E-commerce' },
    { value: 'restaurante', label: 'Restaurante' },
    { value: 'academia', label: 'Academia' },
    { value: 'imobiliaria', label: 'Imobiliária' },
    { value: 'pet', label: 'Pet Shop/Veterinária' },
    { value: 'beleza', label: 'Salão de Beleza' },
    { value: 'educacao', label: 'Escola/Curso' },
    { value: 'servicos', label: 'Prestação de Serviços' },
    { value: 'outro', label: 'Outro' }
  ];

  const commonServices = [
    'Consultas', 'Análises', 'Atendimento', 'Vendas', 'Suporte',
    'Diagnósticos', 'Tratamentos', 'Procedimentos', 'Orientações',
    'Agendamentos', 'Reservas', 'Orçamentos', 'Contratos'
  ];

  const toneOptions = [
    { value: 'formal', label: 'Formal - Profissional e respeitoso' },
    { value: 'friendly', label: 'Amigável - Próximo e acolhedor' },
    { value: 'informal', label: 'Informal - Descontraído e casual' }
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleServiceToggle = (service: string) => {
    setFormData(prev => ({
      ...prev,
      mainServices: prev.mainServices.includes(service)
        ? prev.mainServices.filter(s => s !== service)
        : [...prev.mainServices, service]
    }));
  };

  const generateGreeting = () => {
    const businessName = formData.businessName || 'nossa empresa';
    const agentName = formData.agentName || 'Assistente Virtual';
    
    let greeting = '';
    
    switch (formData.tone) {
      case 'formal':
        greeting = `Olá! Sou ${agentName}, assistente virtual da ${businessName}. Como posso ajudá-lo hoje?`;
        break;
      case 'friendly':
        greeting = `Oi! Eu sou ${agentName}, o assistente virtual da ${businessName}. Como posso te ajudar hoje? 😊`;
        break;
      case 'informal':
        greeting = `E aí! Sou ${agentName}, assistente da ${businessName}. No que posso te ajudar?`;
        break;
      default:
        greeting = `Olá! Sou ${agentName}, assistente virtual da ${businessName}. Como posso ajudá-lo hoje?`;
    }
    
    setFormData(prev => ({
      ...prev,
      greeting
    }));
  };

  const generateKnowledgeBase = () => {
    const services = formData.mainServices.join(', ');
    const location = formData.location || 'nossa região';
    const hours = formData.workingHours || 'horário comercial';
    
    const knowledgeBase = `
Informações sobre ${formData.businessName}:

SERVIÇOS PRINCIPAIS:
${services}

HORÁRIO DE FUNCIONAMENTO:
${hours}

LOCALIZAÇÃO:
${location}

PÚBLICO-ALVO:
${formData.targetAudience}

INSTRUÇÕES ESPECIAIS:
- Sempre manter tom ${formData.tone === 'formal' ? 'profissional' : formData.tone === 'friendly' ? 'amigável' : 'descontraído'}
- Priorizar agendamentos e conversões
- Fornecer informações precisas sobre nossos serviços
- Direcionar para contato humano quando necessário
    `.trim();
    
    setFormData(prev => ({
      ...prev,
      knowledgeBase
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch('/api/agent-customization/email-only', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Erro ao enviar dados de personalização');
      }

      const result = await response.json();
      
      showSuccess("Dados recebidos! Configuração inicial salva e enviada para nossa equipe técnica. Em breve um membro do nosso time entrará em contato com você sobre os próximos passos para essa parceria com a HumanTic.");

      // Wait for user to read the message (6 seconds)
      setTimeout(() => {
        setLocation('/');
      }, 6000);

    } catch (error) {
      console.error('Error:', error);
      showError("Não foi possível enviar os dados de personalização. Tente novamente.");
      // Redirect to home page after error
      setTimeout(() => {
        setLocation('/');
      }, 3000);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (formData.businessName && formData.agentName && formData.tone) {
      generateGreeting();
    }
  }, [formData.businessName, formData.agentName, formData.tone]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
            Personalize seu Agente de IA
          </h1>
          <p className="text-gray-600 text-lg">
            Crie um agente único para seu negócio em apenas alguns minutos
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Dados Pessoais */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Seus Dados
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="fullName">Nome Completo</Label>
                  <Input
                    id="fullName"
                    value={formData.fullName}
                    onChange={(e) => handleInputChange('fullName', e.target.value)}
                    placeholder="Seu nome completo"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    placeholder="seu@email.com"
                    required
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="phone">Telefone/WhatsApp</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  placeholder="(11) 99999-9999"
                />
              </div>
            </CardContent>
          </Card>

          {/* Dados do Negócio */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building className="h-5 w-5" />
                Informações do Negócio
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="businessName">Nome do Negócio</Label>
                  <Input
                    id="businessName"
                    value={formData.businessName}
                    onChange={(e) => handleInputChange('businessName', e.target.value)}
                    placeholder="Nome da sua empresa"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="businessType">Tipo de Negócio</Label>
                  <Select
                    value={formData.businessType}
                    onValueChange={(value) => handleInputChange('businessType', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      {businessTypes.map(type => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label>Principais Serviços</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
                  {commonServices.map(service => (
                    <div key={service} className="flex items-center space-x-2">
                      <Checkbox
                        id={service}
                        checked={formData.mainServices.includes(service)}
                        onCheckedChange={() => handleServiceToggle(service)}
                      />
                      <Label htmlFor={service} className="text-sm">
                        {service}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="workingHours" className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    Horário de Funcionamento
                  </Label>
                  <Input
                    id="workingHours"
                    value={formData.workingHours}
                    onChange={(e) => handleInputChange('workingHours', e.target.value)}
                    placeholder="Ex: 08:00 às 18:00"
                  />
                </div>
                <div>
                  <Label htmlFor="location" className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    Localização
                  </Label>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) => handleInputChange('location', e.target.value)}
                    placeholder="Ex: São Paulo, SP"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="targetAudience" className="flex items-center gap-2">
                  <Target className="h-4 w-4" />
                  Público-Alvo
                </Label>
                <Input
                  id="targetAudience"
                  value={formData.targetAudience}
                  onChange={(e) => handleInputChange('targetAudience', e.target.value)}
                  placeholder="Ex: Pessoas de 25 a 45 anos, profissionais liberais"
                />
              </div>
            </CardContent>
          </Card>

          {/* Personalização do Agente */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Smile className="h-5 w-5" />
                Personalização do Agente
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="agentName">Nome do Agente</Label>
                  <Input
                    id="agentName"
                    value={formData.agentName}
                    onChange={(e) => handleInputChange('agentName', e.target.value)}
                    placeholder="Ex: Assistente Virtual, Ana, João"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="tone">Tom de Atendimento</Label>
                  <Select
                    value={formData.tone}
                    onValueChange={(value) => handleInputChange('tone', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {toneOptions.map(option => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="greeting">Saudação Personalizada</Label>
                <div className="flex gap-2 mb-2">
                  <Button
                    type="button"
                    onClick={generateGreeting}
                    variant="outline"
                    size="sm"
                  >
                    Gerar Automaticamente
                  </Button>
                </div>
                <Textarea
                  id="greeting"
                  value={formData.greeting}
                  onChange={(e) => handleInputChange('greeting', e.target.value)}
                  placeholder="Como o agente cumprimentará os clientes"
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="knowledgeBase">Base de Conhecimento</Label>
                <div className="flex gap-2 mb-2">
                  <Button
                    type="button"
                    onClick={generateKnowledgeBase}
                    variant="outline"
                    size="sm"
                  >
                    Gerar Automaticamente
                  </Button>
                </div>
                <Textarea
                  id="knowledgeBase"
                  value={formData.knowledgeBase}
                  onChange={(e) => handleInputChange('knowledgeBase', e.target.value)}
                  placeholder="Informações que o agente deve conhecer sobre seu negócio"
                  rows={8}
                />
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-center">
            <Button
              type="submit"
              disabled={isLoading}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 text-lg"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Criando Agente...
                </>
              ) : (
                <>
                  Criar Agente Personalizado
                  <ArrowRight className="ml-2 h-5 w-5" />
                </>
              )}
            </Button>
          </div>
        </form>

        <div className="mt-8 text-center text-sm text-gray-500">
          <p>🔒 Seus dados serão mantidos seguros e removidos automaticamente após 7 dias (LGPD)</p>
        </div>
      </div>
    </div>
  );
};

export default AgentCustomization;