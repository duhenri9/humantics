import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Bot, 
  Calendar, 
  TrendingUp, 
  Zap, 
  Shield, 
  Users, 
  MessageSquare, 
  BarChart3,
  CheckCircle,
  ArrowRight,
  Play,
  Star,
  Clock,
  Target,
  Smartphone,
  Mail,
  Database,
  Globe,
  Headphones,
  Award,
  BatteryCharging,
  Heart,
  Scale,
  Home,
  Sparkles,
  UserCog,
  Handshake,
  CheckSquare,
  Settings,
  Phone,
  Loader
} from 'lucide-react';
import { Link } from 'react-router-dom';
import Logo from '../components/Logo';
import WhatsAppFloatingButton from '../components/WhatsAppFloatingButton';

const LandingPage = () => {
  const [formData, setFormData] = useState({
    nome_completo: '',
    nome_negocio: '',
    diferencial: '',
    email: ''
  });
  const [testMode, setTestMode] = useState('quick'); // 'quick' or 'personalized'
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [testUrl, setTestUrl] = useState('');
  const [errors, setErrors] = useState<{[key: string]: string}>({});

  const fadeInUp = {
    initial: { opacity: 0, y: 60 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  const staggerChildren = {
    animate: {
      transition: {
        staggerChildren: 0.1
      }
    }
  };



  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prev: any) => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if ((errors as any)[name]) {
      setErrors((prev: any) => ({
        ...prev,
        [name]: ''
      }));
    }
  };



  const handleStripeCheckout = async (planName: string, priceId: string) => {
    try {
      // Create checkout session
      const response = await fetch('/api/stripe/create-checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          priceId: priceId,
          planName: planName
        })
      });
      
      const data = await response.json();
      
      if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
      } else {
        console.error('No checkout URL received:', data);
        alert('Erro ao criar sessão de pagamento. Por favor, tente novamente.');
      }
    } catch (error) {
      console.error('Error creating checkout session:', error);
      alert('Erro ao processar pagamento. Por favor, tente novamente.');
    }
  };

  const validateForm = () => {
    const newErrors: any = {};
    
    // Only validate email if provided (not required now)
    if ((formData as any).email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test((formData as any).email)) {
      newErrors.email = 'Email inválido';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // If user provided information, save as lead
      if ((formData as any).nome_completo || (formData as any).nome_negocio || (formData as any).diferencial || (formData as any).email) {
        const response = await fetch('/api/leads/with-email', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            nomeCompleto: (formData as any).nome_completo || '',
            nomeNegocio: (formData as any).nome_negocio || '',
            diferencial: (formData as any).diferencial || '',
            email: (formData as any).email || ''
          })
        });
        
        if (response.ok) {
          const result = await response.json();
          console.log('Lead created:', result);
        }
      }
      
      // Always redirect to AgentCustomization page
      window.location.href = '/personalizar-agente';
    } catch (error) {
      console.error('Error submitting form:', error);
      // Even if there's an error, redirect to AgentCustomization
      window.location.href = '/personalizar-agente';
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="fixed top-0 w-full bg-white/95 backdrop-blur-sm border-b border-gray-100 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Logo size="md" />
            <nav className="hidden md:flex items-center space-x-8">
              <a href="#recursos" className="text-secondary hover:text-primary transition-colors font-medium">Recursos</a>
              <a href="#como-funciona" className="text-secondary hover:text-primary transition-colors font-medium">Como Funciona</a>
              <a href="#planos" className="text-secondary hover:text-primary transition-colors font-medium">Planos</a>
              <a href="#casos" className="text-secondary hover:text-primary transition-colors font-medium">Casos de Uso</a>
              <Link to="/blog" className="text-secondary hover:text-primary transition-colors font-medium">Blog</Link>
              <div className="flex items-center space-x-3">
                <Link 
                  to="/auth/login"
                  className="text-secondary hover:text-primary transition-colors font-medium"
                >
                  Login
                </Link>
                <button 
                  onClick={() => {
                    document.getElementById('planos')?.scrollIntoView({ 
                      behavior: 'smooth',
                      block: 'start'
                    });
                  }}
                  className="bg-primary text-white px-6 py-2 rounded-full hover:bg-primary/90 transition-all transform hover:scale-105 shadow-lg hover:shadow-xl"
                >
                  Ativar meu Agente HumanTic
                </button>
              </div>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section Enhanced */}
      <section className="pt-24 pb-20 bg-gradient-to-br from-blue-50 via-white to-purple-50 relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/20 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-accent/20 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
          <div className="absolute top-40 left-40 w-80 h-80 bg-pink-400/20 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <motion.div 
            className="text-center"
            initial="initial"
            animate="animate"
            variants={staggerChildren}
          >
            <motion.div 
              className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6"
              variants={fadeInUp}
            >
              <BatteryCharging className="h-4 w-4" />
              Agentes como Serviço (AaaS) da WM3 Digital
            </motion.div>

            <motion.h1 
              className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight"
              variants={fadeInUp}
            >
              Você atende como um
              <span className="block gradient-text">
                profissional
              </span>
              <span className="block text-4xl md:text-5xl text-gray-700 mt-2">
                Agora é sua vez de automatizar como um
              </span>
            </motion.h1>

            <motion.p 
              className="text-xl md:text-2xl text-secondary mb-8 max-w-4xl mx-auto leading-relaxed"
              variants={fadeInUp}
            >
              <span className="font-semibold text-gray-800">
                Aumente sua produtividade, economize tempo e eleve o seu atendimento
              </span>
              <span className="block mt-2">
                — sem perder o toque humano.
              </span>
            </motion.p>

            <motion.div 
              className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12"
              variants={fadeInUp}
            >
              <button 
                onClick={() => {
                  document.getElementById('planos')?.scrollIntoView({ 
                    behavior: 'smooth',
                    block: 'start'
                  });
                }}
                className="bg-primary text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-primary/90 hover:shadow-xl transition-all transform hover:scale-105 flex items-center gap-2 shadow-lg"
              >
                Ativar meu Agente HumanTic
                <ArrowRight className="h-5 w-5" />
              </button>
              <button className="flex items-center gap-2 text-gray-700 hover:text-primary transition-colors px-6 py-3 rounded-xl border border-gray-200 hover:border-primary/20 hover:bg-primary/5">
                <Play className="h-5 w-5" />
                HumanTic (Vídeo)
              </button>
            </motion.div>

            {/* Trust Indicators */}
            <motion.div 
              className="flex flex-wrap justify-center items-center gap-8 text-sm text-secondary"
              variants={fadeInUp}
            >
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-green-500" />
                <span>100% Seguro</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" style={{ color: '#6D7AFF' }} />
                <span>Setup em 24h</span>
              </div>
              <div className="flex items-center gap-2">
                <Handshake className="h-4 w-4 text-accent" />
                <span>Suporte Humanizado</span>
              </div>
              <div className="flex items-center gap-2">
                <Award className="h-4 w-4 text-yellow-500" />
                <span>Garantia 30 dias</span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Agent Types Section Enhanced */}
      <section id="planos" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-16"
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Agentes Verticais Especializados
            </h2>
            <p className="text-xl text-secondary max-w-4xl mx-auto leading-relaxed">
              <span className="font-semibold text-gray-800">Inteligência real para quem não tem tempo a perder.</span>
              <br />
              Você não compra apenas uma IA. Contrata um especialista digital que evolue com você.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {/* Agente Essencial */}
            <motion.div 
              className="relative bg-gradient-to-br from-primary/5 to-primary/10 p-8 rounded-3xl border border-primary/20 hover:shadow-2xl transition-all duration-300 group"
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              variants={fadeInUp}
            >
              <div className="absolute top-4 right-4 bg-primary text-white px-3 py-1 rounded-full text-xs font-medium">
                Essencial
              </div>
              <div className="bg-primary w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <MessageSquare className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Agente Essencial</h3>
              <p className="text-secondary mb-6 leading-relaxed">
                Automatize o atendimento com personalização e suporte contínuo. 
                Ideal para profissionais que desejam dar o primeiro passo em IA conversacional.
              </p>
              <div className="space-y-3 mb-8">
                {[
                  'Atendimento automatizado 24/7',
                  'Ajuste de tom do agente conforme a necessidade do seu negócio',
                  'Suporte contínuo e atualizações',
                  'Integração WhatsApp nativa',
                  'Relatórios simples para acompanhar interações com clareza'
                ].map((feature, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" />
                    <span className="text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>
              <div className="border-t border-primary/20 pt-6">
                <div className="text-sm text-secondary mb-2">Ativação: R$ 835,00 (50% sinal + 50% após aprovação)</div>
                <div className="text-3xl font-bold text-primary mb-4">R$ 195,00<span className="text-lg text-secondary">/mês</span></div>
                <button
                  onClick={() => handleStripeCheckout('Essencial', 'price_1Rhtzz2NWKxBO6v2iMGFulln')}
                  className="w-full bg-primary text-white py-3 rounded-xl font-semibold hover:bg-primary/90 transition-colors block text-center"
                >
                  Ativar meu Agente HumanTic
                </button>
              </div>
            </motion.div>

            {/* Agente Agenda Inteligente */}
            <motion.div 
              className="relative bg-gradient-to-br from-accent/5 to-accent/10 p-8 rounded-3xl border border-accent/20 hover:shadow-2xl transition-all duration-300 group transform scale-105 z-10"
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              variants={fadeInUp}
            >
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-accent to-pink-600 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg">
                🔥 Mais Popular
              </div>
              <div className="bg-accent w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Calendar className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Agente Agenda Inteligente</h3>
              <p className="text-secondary mb-6 leading-relaxed">
                Organize sua agenda com inteligência, reduza faltas e integre com o Google Calendar de forma fluida.
              </p>
              <div className="space-y-3 mb-8">
                {[
                  'Organização inteligente de agenda',
                  'Redução de no-shows em 70%',
                  'Integração Google Calendar',
                  'Pré-triagem automática',
                  'Lembretes personalizados',
                  'Reagendamento automático'
                ].map((feature, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-accent flex-shrink-0" />
                    <span className="text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>
              <div className="border-t border-accent/20 pt-6">
                <div className="text-sm text-secondary mb-2">Ativação: R$ 1.289,00 (50% sinal + 50% após aprovação)</div>
                <div className="text-3xl font-bold text-accent mb-4">R$ 325,00<span className="text-lg text-secondary">/mês</span></div>
                <button
                  onClick={() => handleStripeCheckout('Agenda', 'price_1Rhu002NWKxBO6v24yLkT6fm')}
                  className="w-full bg-gradient-to-r from-accent to-pink-600 text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-all transform hover:scale-105 block text-center"
                >
                  Ativar meu Agente HumanTic
                </button>
              </div>
            </motion.div>

            {/* Agente de Conversão Avançado */}
            <motion.div 
              className="relative bg-gradient-to-br from-green-50 to-green-100 p-8 rounded-3xl border border-green-200 hover:shadow-2xl transition-all duration-300 group"
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              variants={fadeInUp}
            >
              <div className="absolute top-4 right-4 bg-green-600 text-white px-3 py-1 rounded-full text-xs font-medium">
                Avançado
              </div>
              <div className="bg-green-600 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <TrendingUp className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Agente de Conversão Avançado</h3>
              <p className="text-secondary mb-6 leading-relaxed">
                Qualificação automática de leads, integração com CRMs e evolução contínua via dados. 
                Foco total em performance, vendas e geração de valor.
              </p>
              <div className="space-y-3 mb-8">
                {[
                  'Qualificação automática de leads',
                  'Integração CRM completa',
                  'Melhoria contínua com base em dados coletados nas interações',
                  'Monitoramento contínuo do agente e suas conversas',
                  'Avaliação automatizada de leads para identificar oportunidades reais',
                  'Relatórios de desempenho para acompanhar seus resultados'
                ].map((feature, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                    <span className="text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>
              <div className="border-t border-green-200 pt-6">
                <div className="text-sm text-secondary mb-2">Ativação: R$ 1.769,00 (50% sinal + 50% após aprovação)</div>
                <div className="text-3xl font-bold text-green-600 mb-4">R$ 498,00<span className="text-lg text-secondary">/mês</span></div>
                <button
                  onClick={() => handleStripeCheckout('Conversao', 'price_1Rhu002NWKxBO6v2LPiaqyXa')}
                  className="w-full bg-green-600 text-white py-3 rounded-xl font-semibold hover:bg-green-700 transition-colors block text-center"
                >
                  Ativar meu Agente HumanTic
                </button>
              </div>
            </motion.div>
          </div>

          {/* Value Proposition */}
          <motion.div 
            className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-3xl p-8 md:p-12 text-center text-white"
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <h3 className="text-2xl md:text-3xl font-bold mb-4">
              O que é um Agente Vertical no modelo AaaS?
            </h3>
            <p className="text-xl text-gray-300 mb-6 max-w-4xl mx-auto leading-relaxed">
              <span className="text-white font-semibold">Especialista digital sob demanda:</span> 
              Agente de IA especializado no seu nicho (saúde, jurídico, arquitetura etc.), 
              entregue como serviço contínuo com infraestrutura, treinamento, evolução e suporte humanizado.
            </p>
            <div className="grid md:grid-cols-3 gap-6 mt-8">
              <div className="text-center">
                <div className="bg-primary w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <Zap className="h-6 w-6" />
                </div>
                <h4 className="font-semibold mb-2">Setup Rápido</h4>
                <p className="text-gray-400 text-sm">Agente operacional em 24h</p>
              </div>
              <div className="text-center">
                <div className="bg-accent w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <BarChart3 className="h-6 w-6" />
                </div>
                <h4 className="font-semibold mb-2">Evolução Contínua</h4>
                <p className="text-gray-400 text-sm">Melhoria constante via dados</p>
              </div>
              <div className="text-center">
                <div className="bg-green-600 w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <Handshake className="h-6 w-6" />
                </div>
                <h4 className="font-semibold mb-2">Suporte Humanizado</h4>
                <p className="text-gray-400 text-sm">Time especializado sempre disponível</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Target Audience Section Enhanced */}
      <section id="casos" className="py-20 bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-16"
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Ideal Para Profissionais Especializados
            </h2>
            <p className="text-xl text-secondary max-w-4xl mx-auto leading-relaxed">
              Especialistas que valorizam tempo, produtividade e atendimento personalizado
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                title: "Saúde & Bem-estar",
                icon: Heart,
                professionals: ["Médicos", "Dentistas", "Psicólogos", "Fisioterapeutas", "Nutricionistas"],
                color: "primary"
              },
              {
                title: "Direito & Consultoria",
                icon: Scale,
                professionals: ["Advogados", "Tabeliães", "Cartórios", "Consultores", "Contadores"],
                color: "accent"
              },
              {
                title: "Arquitetura & Engenharia",
                icon: Home,
                professionals: ["Arquitetos", "Engenheiros", "Designers", "Consultores", "Urbanistas"],
                color: "green"
              },
              {
                title: "Estética & Terapias",
                icon: Sparkles,
                professionals: ["Esteticistas", "Terapeutas", "Coaches", "Massoterapeutas", "Podólogos"],
                color: "orange"
              }
            ].map((category, index) => (
              <motion.div 
                key={index}
                className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-300 group"
                initial="initial"
                whileInView="animate"
                viewport={{ once: true }}
                variants={fadeInUp}
                transition={{ delay: index * 0.1 }}
              >
                <div className={`${
                  category.color === 'primary' ? 'bg-primary' :
                  category.color === 'accent' ? 'bg-accent' :
                  category.color === 'green' ? 'bg-green-600' :
                  'bg-orange-600'
                } w-12 h-12 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <category.icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">{category.title}</h3>
                <ul className="space-y-2">
                  {category.professionals.map((prof, idx) => (
                    <li key={idx} className="text-secondary flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${
                        category.color === 'primary' ? 'bg-primary' :
                        category.color === 'accent' ? 'bg-accent' :
                        category.color === 'green' ? 'bg-green-600' :
                        'bg-orange-600'
                      }`}></div>
                      {prof}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section Enhanced */}
      <section id="como-funciona" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-16"
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Como Funciona</h2>
            <p className="text-xl text-secondary max-w-4xl mx-auto leading-relaxed">
              Do cadastro ao monitoramento, um processo simples e eficiente para criar seu agente digital
            </p>
          </motion.div>

          <div className="grid md:grid-cols-4 gap-8 mb-16">
            {[
              {
                icon: Users,
                title: "Cadastro & Onboarding",
                description: "Escolha seu plano e inicie com o onboarding personalizado",
                step: "01",
                color: "primary"
              },
              {
                icon: UserCog,
                title: "Criação do Agente",
                description: "Criação do Agente com tecnologia Avançada do MCP de forma simples e intuitiva",
                step: "02",
                color: "accent"
              },
              {
                icon: CheckSquare,
                title: "Validação e Testes",
                description: "Valide seu Agente em um ambiente de testes com cenários reais antes do lançamento",
                step: "03",
                color: "green"
              },
              {
                icon: Settings,
                title: "Ativação e Melhoria Contínua",
                description: "Ative o seu Agente e melhore sempre garantindo um atendimento cada vez mais eficiente e humanizado",
                step: "04",
                color: "orange"
              }
            ].map((item, index) => (
              <motion.div 
                key={index}
                className="text-center group"
                initial="initial"
                whileInView="animate"
                viewport={{ once: true }}
                variants={fadeInUp}
                transition={{ delay: index * 0.1 }}
              >
                <div className="relative mb-6">
                  <div className={`${
                    item.color === 'primary' ? 'bg-primary' :
                    item.color === 'accent' ? 'bg-accent' :
                    item.color === 'green' ? 'bg-green-600' :
                    'bg-orange-600'
                  } w-20 h-20 rounded-3xl flex items-center justify-center mx-auto group-hover:scale-110 transition-transform shadow-lg`}>
                    <item.icon className="h-10 w-10 text-white" />
                  </div>
                  <div className={`absolute -top-2 -right-2 ${
                    item.color === 'primary' ? 'bg-primary/10 text-primary' :
                    item.color === 'accent' ? 'bg-accent/10 text-accent' :
                    item.color === 'green' ? 'bg-green-100 text-green-700' :
                    'bg-orange-100 text-orange-700'
                  } w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border-2 border-white`}>
                    {item.step}
                  </div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{item.title}</h3>
                <p className="text-secondary leading-relaxed">{item.description}</p>
              </motion.div>
            ))}
          </div>

          {/* Process Flow Visualization */}
          <motion.div 
            className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-3xl p-8 md:p-12"
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Processo Completo AaaS</h3>
              <p className="text-secondary">Acompanhamento contínuo para máxima eficiência</p>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="bg-primary w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <BatteryCharging className="h-8 w-8 text-white" />
                </div>
                <h4 className="font-bold text-gray-900 mb-2">Setup Inicial</h4>
                <p className="text-secondary text-sm">Configuração personalizada em 24h</p>
              </div>
              <div className="text-center">
                <div className="bg-accent w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <BarChart3 className="h-8 w-8 text-white" />
                </div>
                <h4 className="font-bold text-gray-900 mb-2">Manutenção Mensal</h4>
                <p className="text-secondary text-sm">Evolução contínua e otimizações</p>
              </div>
              <div className="text-center">
                <div className="bg-green-600 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Award className="h-8 w-8 text-white" />
                </div>
                <h4 className="font-bold text-gray-900 mb-2">Suporte Especializado</h4>
                <p className="text-secondary text-sm">Time dedicado ao seu sucesso</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section Enhanced */}
      <section id="recursos" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-16"
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Recursos Avançados</h2>
            <p className="text-xl text-secondary max-w-4xl mx-auto leading-relaxed">
              Tudo que você precisa para criar, gerenciar e otimizar seus agentes digitais
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {[
              {
                icon: Globe,
                title: "Integrações Nativas",
                description: "Conecte seus canais, ferramentas e agendas em um só lugar com integrações simples e diretas.",
                features: ["WhatsApp Business API", "Integração com CRMs populares", "APIs abertas para conectar seus sistemas", "Webhooks para notificações automáticas", "Google Calendar", "Automação com N8N"],
                color: "primary"
              },
              {
                icon: Shield,
                title: "Segurança & Controle",
                description: "Controle total sobre suas configurações com permissões detalhadas, histórico de alterações e proteção dos dados do seu negócio.",
                features: ["Histórico de alterações", "Backup automático", "Permissões detalhadas por nível de acesso", "Registros de atividade em tempo real", "Auditoria de ações e acessos", "Conformidade com a LGPD na gestão dos dados"],
                color: "accent"
              },
              {
                icon: BarChart3,
                title: "Revisão de Desempenho",
                description: "Acompanhe a qualidade das respostas do agente em tempo real e receba insights estratégicos para otimização contínua.",
                features: ["Relatórios de desempenho", "Solicitação para melhorias do Agente", "Identificação de padrões e oportunidades de melhorias", "Histórico de conversas centralizado", "Resumo de performance semanal ou mensal", "Alertas proativos de desempenho atípico", "Insights orientados por dados reais de uso"],
                color: "green"
              }
            ].map((feature, index) => (
              <motion.div 
                key={index}
                className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-300 group"
                initial="initial"
                whileInView="animate"
                viewport={{ once: true }}
                variants={fadeInUp}
                transition={{ delay: index * 0.1 }}
              >
                <div className={`${
                  feature.color === 'primary' ? 'bg-primary' :
                  feature.color === 'accent' ? 'bg-accent' :
                  'bg-green-600'
                } w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                  <feature.icon className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">{feature.title}</h3>
                <p className="text-secondary mb-6 leading-relaxed">{feature.description}</p>
                <ul className="space-y-3">
                  {feature.features.map((item, idx) => (
                    <li key={idx} className="flex items-center gap-3">
                      <CheckCircle className={`h-4 w-4 ${
                        feature.color === 'primary' ? 'text-primary' :
                        feature.color === 'accent' ? 'text-accent' :
                        'text-green-600'
                      } flex-shrink-0`} />
                      <span className="text-gray-700 text-sm">{item}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>

          {/* Additional Features Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Smartphone, title: "Multi-canal", desc: "WhatsApp, Web, Email, SMS" },
              { icon: Database, title: "IA Avançada", desc: "GPT-4, Claude, modelos customizados" },
              { icon: Clock, title: "24/7 Disponível", desc: "Atendimento ininterrupto" },
              { icon: Shield, title: "Certificações e Conformidade", desc: "Confiança e segurança desde o primeiro clique. Estamos em conformidade com os principais padrões internacionais de segurança e proteção de dados, incluindo ISO 27001, LGPD e SOC 2, garantindo que suas informações e as de seus clientes estejam sempre protegidas." }
            ].map((item, index) => (
              <motion.div 
                key={index}
                className="bg-white p-6 rounded-2xl border border-gray-100 text-center hover:shadow-lg transition-all group"
                initial="initial"
                whileInView="animate"
                viewport={{ once: true }}
                variants={fadeInUp}
                transition={{ delay: index * 0.05 }}
              >
                <div className="bg-gray-100 w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/10 transition-colors">
                  <item.icon className="h-6 w-6 text-secondary group-hover:text-primary" />
                </div>
                <h4 className="font-bold text-gray-900 mb-2">{item.title}</h4>
                <p className="text-secondary text-sm">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section Enhanced */}
      <section className="py-20 bg-gradient-to-r from-gray-900 via-primary to-accent relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <h2 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
              Pronto para Automatizar
              <span className="block gradient-text">
                seu Atendimento?
              </span>
            </h2>
            <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-4xl mx-auto leading-relaxed">
              Junte-se a <span className="text-white font-bold">centenas de profissionais</span> que já transformaram 
              seu atendimento com a HumanTic
            </p>
            
            {!showSuccess ? (
              <div className="max-w-2xl mx-auto mb-12">
                <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-8">
                  <h3 className="text-2xl font-bold text-white mb-6 text-center">
                    Começar agora com a HumanTic
                  </h3>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-white/90 text-sm font-medium mb-2">
                          Seu Nome Completo *
                        </label>
                        <input
                          type="text"
                          name="nome_completo"
                          value={(formData as any).nome_completo}
                          onChange={handleInputChange}
                          placeholder="Ex: João Silva Santos"
                          className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent"
                        />
                        {(errors as any).nome_completo && (
                          <p className="text-red-300 text-sm mt-1">{(errors as any).nome_completo}</p>
                        )}
                      </div>
                      
                      <div>
                        <label className="block text-white/90 text-sm font-medium mb-2">
                          Nome do Negócio *
                        </label>
                        <input
                          type="text"
                          name="nome_negocio"
                          value={(formData as any).nome_negocio}
                          onChange={handleInputChange}
                          placeholder="Ex: Clínica Dr. Silva"
                          className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent"
                        />
                        {(errors as any).nome_negocio && (
                          <p className="text-red-300 text-sm mt-1">{(errors as any).nome_negocio}</p>
                        )}
                      </div>
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-white/90 text-sm font-medium mb-2">
                          Seu Email *
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={(formData as any).email}
                          onChange={handleInputChange}
                          placeholder="Ex: contato@clinicasilva.com.br"
                          className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent"
                        />
                        {(errors as any).email && (
                          <p className="text-red-300 text-sm mt-1">{(errors as any).email}</p>
                        )}
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-white/90 text-sm font-medium mb-2">
                        Principal Diferencial do seu Negócio *
                      </label>
                      <textarea
                        name="diferencial"
                        value={formData.diferencial}
                        onChange={handleInputChange}
                        placeholder="Ex: Atendimento humanizado com 20 anos de experiência em cardiologia"
                        rows={3}
                        className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent resize-none"
                      />
                      {errors.diferencial && (
                        <p className="text-red-300 text-sm mt-1">{errors.diferencial}</p>
                      )}
                    </div>
                    
                    {errors.submit && (
                      <p className="text-red-300 text-sm text-center">{errors.submit}</p>
                    )}
                    
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-white text-primary px-8 py-4 rounded-xl text-lg font-semibold hover:shadow-2xl transition-all transform hover:scale-105 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader className="h-5 w-5 animate-spin" />
                          Criando seu agente...
                        </>
                      ) : (
                        <>
                          Começar agora com a HumanTic
                          <ArrowRight className="h-5 w-5" />
                        </>
                      )}
                    </button>
                  </form>
                  
                  <p className="text-white/70 text-xs text-center mt-4">
                    7 dias para testar • Simule para depois Aprimorar • Dados excluídos após Teste (garantindo LGPD e sua Privacidade)
                  </p>
                  
                  {/* Advanced Customization Option */}
                  <div className="mt-6 pt-6 border-t border-white/20">
                    <div className="text-center">
                      <p className="text-white/80 text-sm mb-3">
                        Quer um teste mais personalizado?
                      </p>
                      <Link
                        to="/personalizar-agente"
                        className="inline-flex items-center gap-2 text-white/90 hover:text-white border border-white/30 hover:border-white/50 px-4 py-2 rounded-lg text-sm transition-colors hover:bg-white/10"
                      >
                        <Settings className="h-4 w-4" />
                        Personalizar com detalhes do meu negócio
                      </Link>
                      <p className="text-white/60 text-xs mt-2">
                        Configure serviços, horários, público-alvo e personalidade do agente
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="max-w-2xl mx-auto mb-12">
                <div className="bg-green-500/20 backdrop-blur-sm border border-green-400/30 rounded-2xl p-8 text-center">
                  {testUrl === 'email_confirmation' ? (
                    <>
                      <Mail className="h-16 w-16 text-green-400 mx-auto mb-4" />
                      <h3 className="text-2xl font-bold text-white mb-4">
                        Email Enviado!
                      </h3>
                      <p className="text-white/90 text-lg mb-6">
                        Enviamos um email de confirmação para você. Verifique sua caixa de entrada (e pasta de spam) e clique no link para personalizar seu agente.
                      </p>
                      <div className="bg-white/10 rounded-lg p-4 mb-6">
                        <p className="text-white/80 text-sm">
                          📧 <strong>Próximos passos:</strong><br/>
                          1. Confirme seu email<br/>
                          2. Personalize seu agente<br/>
                          3. Teste gratuitamente por 7 dias
                        </p>
                      </div>
                    </>
                  ) : (
                    <>
                      <CheckCircle className="h-16 w-16 text-green-400 mx-auto mb-4" />
                      <h3 className="text-2xl font-bold text-white mb-4">
                        Agente Criado com Sucesso!
                      </h3>
                      <p className="text-white/90 text-lg mb-6">
                        Seu agente personalizado foi criado com sucesso! Clique no botão abaixo para iniciar o teste gratuito imediatamente.
                      </p>
                    </>
                  )}
                  <div className="mb-6">
                    <a
                      href={testUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 bg-white text-primary px-8 py-4 rounded-xl text-lg font-semibold hover:shadow-2xl transition-all transform hover:scale-105"
                    >
                      <MessageSquare className="h-5 w-5" />
                      Desbloquear Agente Teste
                    </a>
                  </div>
                  <button
                    onClick={() => setShowSuccess(false)}
                    className="bg-white/20 text-white px-6 py-3 rounded-xl hover:bg-white/30 transition-colors"
                  >
                    Criar Outro Teste
                  </button>
                </div>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <Link 
                to="/personalizar-agente"
                className="flex flex-col items-center gap-1 text-white hover:text-primary/80 transition-colors px-8 py-4 rounded-xl border border-white/20 hover:border-white/40 hover:bg-white/5"
              >
                <span className="flex items-center gap-2 text-lg font-semibold">
                  <UserCog className="h-5 w-5" />
                  Ative seu Agente Inteligente
                </span>
                <span className="text-sm text-white/70">
                  Começar Agora com a HumanTic
                </span>
              </Link>
            </div>

            {/* Social Proof */}
            <div className="grid md:grid-cols-3 gap-8 text-center">
              <div>
                <div className="text-3xl font-bold text-white mb-2">70+</div>
                <div className="text-gray-400">Horas economizadas por cliente por mês</div>
                <div className="text-sm text-gray-300 mt-1">Redução significativa de tempo operacional com automações conversacionais.</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-white mb-2">60%</div>
                <div className="text-gray-400">Redução nos custos com atendimento</div>
                <div className="text-sm text-gray-300 mt-1">Ao substituir processos manuais por agentes inteligentes.</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-white mb-2">92%</div>
                <div className="text-gray-400">Aprovação média nas interações</div>
                <div className="text-sm text-gray-300 mt-1">Ainda durante a fase early-stage.</div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer Enhanced */}
      <footer className="bg-white border-t border-gray-200 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-5 gap-8 mb-12">
            <div className="md:col-span-2">
              <Logo size="md" className="mb-4" />
              <p className="text-secondary mb-6 leading-relaxed">
                Agentes digitais especializados para profissionais que valorizam tempo e qualidade. 
                Transforme seu atendimento sem perder o toque humano.
              </p>
              <div className="flex space-x-4">
                <a href="https://wm3digital.com.br" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center hover:bg-primary/10 hover:text-primary transition-colors">
                  <Globe className="h-5 w-5" />
                </a>
                <Link to="/blog" className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center hover:bg-primary/10 hover:text-primary transition-colors">
                  <Globe className="h-5 w-5" />
                </Link>
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">Produto</h3>
              <ul className="space-y-3 text-secondary">
                <li><a href="#recursos" className="hover:text-primary transition-colors">Recursos</a></li>
                <li><a href="#como-funciona" className="hover:text-primary transition-colors">Como Funciona</a></li>
                <li><a href="#planos" className="hover:text-primary transition-colors">Planos</a></li>
                <li><a href="#casos" className="hover:text-primary transition-colors">Casos de Uso</a></li>
                <li><Link to="/blog" className="hover:text-primary transition-colors">Blog</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">Suporte</h3>
              <ul className="space-y-3 text-secondary">
                <li><a href="#" className="hover:text-primary transition-colors">FAQ</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Contato</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">Empresa</h3>
              <ul className="space-y-3 text-secondary">
                <li><a href="#" className="hover:text-primary transition-colors">Sobre</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-200 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-secondary mb-4 md:mb-0">
              &copy; 2024 HumanTic. Todos os direitos reservados.
            </p>
            <div className="flex space-x-6 text-sm text-secondary">
              <a href="#" className="hover:text-primary transition-colors">Privacidade</a>
              <a href="#" className="hover:text-primary transition-colors">Termos</a>
              <a href="#" className="hover:text-primary transition-colors">Cookies</a>
              <a href="#" className="hover:text-primary transition-colors">LGPD</a>
            </div>
          </div>
        </div>
      </footer>

      {/* WhatsApp Floating Button */}
      <WhatsAppFloatingButton />
    </div>
  );
};

export default LandingPage;