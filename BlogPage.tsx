import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, ArrowRight, BookOpen, TrendingUp, Lightbulb, Target } from 'lucide-react';
import { motion } from 'framer-motion';
import Logo from '../components/Logo';
import BlogImage from '../components/BlogImage';

const BlogPage = () => {
  // Scroll para o topo quando a página carrega
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Categorias do blog
  const categories = [
    {
      id: 'ia-automacao',
      name: 'IA & Automação',
      description: 'Tendências e inovações em inteligência artificial',
      icon: Lightbulb,
      color: '#6D7AFF',
      count: 2
    },
    {
      id: 'casos-uso',
      name: 'Casos de Uso',
      description: 'Exemplos práticos de implementação',
      icon: Target,
      color: '#10B981',
      count: 1
    },
    {
      id: 'tutoriais',
      name: 'Tutoriais',
      description: 'Guias passo a passo para otimizar seus agentes',
      icon: BookOpen,
      color: '#F59E0B',
      count: 1
    },
    {
      id: 'mercado-tendencias',
      name: 'Mercado & Tendências',
      description: 'Análises do mercado e perspectivas futuras',
      icon: TrendingUp,
      color: '#EF4444',
      count: 1
    }
  ];

  // Artigos principais (5 artigos estratégicos)
  const featuredArticles = [
    {
      id: 'agentes-avancados-humanizados',
      title: 'Agentes Avançados Humanizados: O Futuro da Automação Empresarial',
      slug: 'agentes-avancados-humanizados-futuro-automacao-empresarial',
      excerpt: 'Descubra como os agentes avançados humanizados estão revolucionando o atendimento ao cliente e otimizando processos empresariais com inteligência artificial conversacional.',
      category: 'ia-automacao',
      readingTime: 8,
      publishedAt: '2024-07-15',
      image: '/api/placeholder/600/400',
      author: 'WM3 Digital',
      featured: true
    },
    {
      id: 'clinicas-transformacao-digital',
      title: 'Clínicas e Consultórios: Transformação Digital com Agentes Empresariais',
      slug: 'clinicas-consultórios-transformacao-digital-agentes-empresariais',
      excerpt: 'Como clínicas médicas e consultórios estão utilizando agentes empresariais para automatizar agendamentos, confirmar consultas e melhorar a experiência do paciente.',
      category: 'casos-uso',
      readingTime: 6,
      publishedAt: '2024-07-10',
      image: '/api/placeholder/600/400',
      author: 'WM3 Digital',
      featured: true
    },
    {
      id: 'configurar-agente-vendas',
      title: 'Como Configurar Seu Primeiro Agente de Vendas em 5 Passos',
      slug: 'como-configurar-primeiro-agente-vendas-5-passos',
      excerpt: 'Tutorial completo para configurar um agente de vendas eficiente que qualifica leads, responde dúvidas e agenda reuniões automaticamente.',
      category: 'tutoriais',
      readingTime: 10,
      publishedAt: '2024-07-05',
      image: '/api/placeholder/600/400',
      author: 'WM3 Digital',
      featured: true
    },
    {
      id: 'mercado-agentes-brasil-2024',
      title: 'O Mercado de Agentes de IA no Brasil: Análise 2024',
      slug: 'mercado-agentes-ia-brasil-analise-2024',
      excerpt: 'Análise completa do crescimento do mercado de agentes de IA no Brasil, tendências, oportunidades e perspectivas para 2024-2025.',
      category: 'mercado-tendencias',
      readingTime: 12,
      publishedAt: '2024-07-01',
      image: '/api/placeholder/600/400',
      author: 'WM3 Digital',
      featured: true
    },
    {
      id: 'roi-agentes-empresariais',
      title: 'ROI de Agentes Empresariais: Métricas que Importam',
      slug: 'roi-agentes-empresariais-metricas-que-importam',
      excerpt: 'Descubra como medir o retorno sobre investimento dos agentes empresariais e quais métricas são essenciais para avaliar o sucesso da implementação.',
      category: 'ia-automacao',
      readingTime: 9,
      publishedAt: '2024-06-25',
      image: '/api/placeholder/600/400',
      author: 'WM3 Digital',
      featured: true
    }
  ];

  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  const staggerChildren = {
    animate: { transition: { staggerChildren: 0.1 } }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/">
              <Logo size="md" />
            </Link>
            <nav className="hidden md:flex items-center space-x-8">
              <Link to="/" className="text-gray-600 hover:text-primary transition-colors font-medium">
                Home
              </Link>
              <Link to="/blog" className="text-primary font-medium">
                Blog
              </Link>
              <Link to="/auth/login" className="text-gray-600 hover:text-primary transition-colors font-medium">
                Login
              </Link>
              <Link 
                to="/personalizar-agente"
                className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors"
              >
                Começar agora com a HumanTic
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary/5 to-purple-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center"
            initial="initial"
            animate="animate"
            variants={staggerChildren}
          >
            <motion.h1 
              className="text-4xl md:text-6xl font-bold text-gray-900 mb-6"
              variants={fadeInUp}
            >
              Blog <span style={{ color: '#6D7AFF' }}>Human</span><span className="text-gray-900">Tic</span>
            </motion.h1>
            <motion.p 
              className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto"
              variants={fadeInUp}
            >
              Insights, tutoriais e tendências sobre agentes avançados humanizados 
              e como eles estão transformando empresas brasileiras.
            </motion.p>
            <motion.div 
              className="flex justify-center items-center gap-4 text-sm text-gray-500"
              variants={fadeInUp}
            >
              <div className="flex items-center gap-2">
                <BookOpen className="h-4 w-4" />
                <span>5 Artigos Estratégicos</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span>Leitura média: 8 min</span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Categorias</h2>
            <p className="text-gray-600">Explore nossos conteúdos por área de interesse</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((category) => (
              <div
                key={category.id}
                className="bg-gray-50 rounded-xl p-6 hover:shadow-lg transition-all duration-300 cursor-pointer group"
              >
                <div className="flex items-center justify-between mb-4">
                  <div 
                    className="w-12 h-12 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: `${category.color}20` }}
                  >
                    <category.icon className="h-6 w-6" style={{ color: category.color }} />
                  </div>
                  <span className="text-sm text-gray-500 bg-white px-2 py-1 rounded-full">
                    {category.count} artigo{category.count > 1 ? 's' : ''}
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-primary transition-colors">
                  {category.name}
                </h3>
                <p className="text-gray-600 text-sm">{category.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Articles */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Artigos em Destaque</h2>
            <p className="text-gray-600">Conteúdos essenciais sobre agentes avançados humanizados</p>
          </div>
          
          {/* First Article - Large Featured */}
          <div className="mb-12">
            <div className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="md:flex">
                <div className="md:w-1/2">
                  <BlogImage 
                    articleId={featuredArticles[0].id}
                    title={featuredArticles[0].title}
                    category={featuredArticles[0].category}
                    className="w-full h-64 md:h-full"
                  />
                </div>
                <div className="md:w-1/2 p-8">
                  <div className="flex items-center gap-2 mb-4">
                    <span 
                      className="inline-block px-3 py-1 rounded-full text-sm font-medium text-white"
                      style={{ backgroundColor: '#6D7AFF' }}
                    >
                      IA & Automação
                    </span>
                    <span className="text-sm text-gray-500">•</span>
                    <span className="text-sm text-gray-500">
                      {featuredArticles[0].readingTime} min de leitura
                    </span>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4 hover:text-primary transition-colors cursor-pointer">
                    {featuredArticles[0].title}
                  </h3>
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    {featuredArticles[0].excerpt}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Calendar className="h-4 w-4" />
                      <span>15 de julho, 2024</span>
                    </div>
                    <Link 
                      to={`/blog/${featuredArticles[0].slug}`}
                      className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors font-medium"
                    >
                      Ler mais
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Other Articles - Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {featuredArticles.slice(1).map((article, index) => (
              <div key={article.id} className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
                <BlogImage 
                  articleId={article.id}
                  title={article.title}
                  category={article.category}
                  className="w-full h-48"
                />
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <span 
                      className="inline-block px-3 py-1 rounded-full text-sm font-medium text-white"
                      style={{ 
                        backgroundColor: article.category === 'casos-uso' ? '#10B981' : 
                                        article.category === 'tutoriais' ? '#F59E0B' : 
                                        article.category === 'mercado-tendencias' ? '#EF4444' : '#6D7AFF'
                      }}
                    >
                      {categories.find(c => c.id === article.category)?.name}
                    </span>
                    <span className="text-sm text-gray-500">•</span>
                    <span className="text-sm text-gray-500">
                      {article.readingTime} min de leitura
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3 hover:text-primary transition-colors cursor-pointer">
                    {article.title}
                  </h3>
                  <p className="text-gray-600 mb-4 leading-relaxed">
                    {article.excerpt}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Calendar className="h-4 w-4" />
                      <span>
                        {new Date(article.publishedAt).toLocaleDateString('pt-BR', { 
                          day: 'numeric', 
                          month: 'long', 
                          year: 'numeric' 
                        })}
                      </span>
                    </div>
                    <Link 
                      to={`/blog/${article.slug}`}
                      className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors font-medium"
                    >
                      Ler mais
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Pronto para implementar agentes avançados humanizados?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Teste nossa plataforma gratuitamente e veja como os agentes empresariais 
            podem transformar seu negócio.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/personalizar-agente"
              className="bg-white text-primary px-8 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
            >
              Começar agora com a HumanTic
            </Link>
            <Link 
              to="/dashboard"
              className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-primary transition-colors"
            >
              Acessar Dashboard
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <Logo size="sm" className="mb-4" darkMode={true} />
              <p className="text-gray-400 leading-relaxed">
                Agentes avançados humanizados para profissionais que valorizam 
                tempo e qualidade no atendimento.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Produto</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link to="/#recursos" className="hover:text-white transition-colors">Recursos</Link></li>
                <li><Link to="/#planos" className="hover:text-white transition-colors">Planos</Link></li>
                <li><Link to="/#casos" className="hover:text-white transition-colors">Casos de Uso</Link></li>
                <li><Link to="/blog" className="hover:text-white transition-colors">Blog</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Suporte</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link to="/ajuda" className="hover:text-white transition-colors">Central de Ajuda</Link></li>
                <li><Link to="/dashboard" className="hover:text-white transition-colors">Dashboard</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Empresa</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="https://wm3digital.com.br" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">WM3 Digital</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 mt-8 text-center text-gray-400">
            <p>&copy; 2024 <span style={{ color: '#6D7AFF' }}>Human</span><span className="text-white font-bold">Tic</span>. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default BlogPage;