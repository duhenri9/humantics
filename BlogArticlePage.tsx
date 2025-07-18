import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Calendar, Clock, Share2, BookOpen, CheckCircle } from 'lucide-react';
import Logo from '../components/Logo';
import BlogImage from '../components/BlogImage';

const BlogArticlePage = () => {
  const { slug } = useParams<{ slug: string }>();

  // Scroll para o topo quando a página carrega
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Artigo sobre Agentes Avançados Humanizados
  const article = {
    title: 'Agentes Avançados Humanizados: O Futuro da Automação Empresarial',
    subtitle: 'Descubra como os agentes avançados humanizados estão revolucionando o atendimento ao cliente e otimizando processos empresariais',
    publishedAt: '2024-07-15',
    readingTime: 8,
    category: 'IA & Automação',
    author: 'WM3 Digital',
    content: `
      <p>No cenário empresarial brasileiro de 2024, uma revolução silenciosa está transformando a forma como as empresas se relacionam com seus clientes e otimizam seus processos internos. <strong>Os agentes avançados humanizados</strong> representam a próxima geração da automação empresarial, combinando inteligência artificial sofisticada com a capacidade de manter conversas naturais e empáticas.</p>

      <h2>O que são Agentes Avançados Humanizados?</h2>
      
      <p>Diferentemente dos chatbots tradicionais que seguem scripts rígidos, os agentes avançados humanizados são sistemas de inteligência artificial que:</p>
      
      <ul>
        <li><strong>Compreendem contexto</strong>: Interpretam não apenas palavras, mas intenções e nuances</li>
        <li><strong>Mantêm personalidade consistente</strong>: Cada agente desenvolve uma identidade única alinhada com a marca</li>
        <li><strong>Aprendem continuamente</strong>: Melhoram suas respostas com base em cada interação</li>
        <li><strong>Integram-se profundamente</strong>: Conectam-se com sistemas empresariais existentes</li>
      </ul>

      <h2>Por que "Humanizados"?</h2>
      
      <p>A humanização vai além da programação de respostas cordiais. Estes agentes são projetados para:</p>
      
      <blockquote>
        <p>"Não apenas responder perguntas, mas entender necessidades, demonstrar empatia e criar conexões genuínas com cada cliente."</p>
      </blockquote>
      
      <p>Essa abordagem resulta em:</p>
      
      <ul>
        <li><strong>85% de satisfação do cliente</strong> em implementações reais</li>
        <li><strong>Redução de 70% no tempo de resposta</strong> comparado ao atendimento tradicional</li>
        <li><strong>Aumento de 40% na conversão</strong> de leads qualificados</li>
      </ul>

      <h2>Aplicações Práticas no Mercado Brasileiro</h2>
      
      <h3>1. Clínicas e Consultórios Médicos</h3>
      <p>Agentes especializados em saúde que:</p>
      <ul>
        <li>Agendam consultas considerando preferências do paciente</li>
        <li>Enviam lembretes personalizados com orientações pré-consulta</li>
        <li>Respondem dúvidas sobre procedimentos de forma empática</li>
      </ul>
      
      <h3>2. Escritórios de Advocacia</h3>
      <p>Agentes jurídicos que:</p>
      <ul>
        <li>Qualificam leads com base na área de especialização</li>
        <li>Explicam processos complexos em linguagem acessível</li>
        <li>Agendam consultas considerando urgência e complexidade</li>
      </ul>
      
      <h3>3. Consultórios Contábeis</h3>
      <p>Agentes financeiros que:</p>
      <ul>
        <li>Orientam sobre obrigações fiscais de forma didática</li>
        <li>Agendam reuniões estratégicas baseadas no perfil da empresa</li>
        <li>Automatizam coleta de documentos com lembretes inteligentes</li>
      </ul>

      <h2>Diferencial dos Agentes Empresariais <span style={{ color: '#6D7AFF' }}>Human</span><span className="text-gray-900">Tic</span></h2>
      
      <p>Nossa abordagem única combina:</p>
      
      <div class="feature-grid">
        <div class="feature-item">
          <h4>Inteligência Contextual</h4>
          <p>Cada agente compreende profundamente o negócio do cliente, suas particularidades e desafios específicos.</p>
        </div>
        
        <div class="feature-item">
          <h4>Implementação Rápida</h4>
          <p>Setup completo em até 24 horas, com treinamento personalizado para cada área de atuação.</p>
        </div>
        
        <div class="feature-item">
          <h4>Suporte Humanizado</h4>
          <p>Nossa equipe oferece suporte contínuo para otimização e ajustes conforme necessário.</p>
        </div>
      </div>

      <h2>O Futuro dos Agentes Empresariais</h2>
      
      <p>As próximas evoluções incluem:</p>
      
      <ul>
        <li><strong>Análise de Sentimentos em Tempo Real</strong>: Detectar frustração ou satisfação durante conversas</li>
        <li><strong>Integração com IA Generativa</strong>: Criar conteúdo personalizado instantaneamente</li>
        <li><strong>Análise Preditiva</strong>: Antecipar necessidades do cliente antes mesmo da solicitação</li>
      </ul>

      <h2>Começando sua Jornada de Transformação</h2>
      
      <p>Implementar agentes avançados humanizados em seu negócio é mais simples do que parece:</p>
      
      <ol>
        <li><strong>Avaliação Personalizada</strong>: Análise das necessidades específicas do seu negócio</li>
        <li><strong>Desenvolvimento Customizado</strong>: Criação de agentes alinhados com sua marca</li>
        <li><strong>Implementação Gradual</strong>: Início com processos menos críticos</li>
        <li><strong>Otimização Contínua</strong>: Ajustes baseados em dados reais de performance</li>
      </ol>
      
      <p>O futuro dos negócios é automatizado, mas não robotizado. É <strong>humanizado</strong>.</p>
      
      <div class="cta-box">
        <h3>Pronto para Transformar seu Atendimento?</h3>
        <p>Converse com nossos especialistas e descubra como os agentes avançados humanizados podem revolucionar seu negócio.</p>
      </div>
    `,
    relatedArticles: [
      {
        title: 'Clínicas e Consultórios: Transformação Digital',
        slug: 'clinicas-consultórios-transformacao-digital-agentes-empresariais',
        category: 'Casos de Uso'
      },
      {
        title: 'Como Configurar Seu Primeiro Agente de Vendas',
        slug: 'como-configurar-primeiro-agente-vendas-5-passos',
        category: 'Tutoriais'
      },
      {
        title: 'ROI de Agentes Empresariais: Métricas que Importam',
        slug: 'roi-agentes-empresariais-metricas-que-importam',
        category: 'IA & Automação'
      }
    ]
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
              <Link to="/blog" className="text-gray-600 hover:text-primary transition-colors font-medium">
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

      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link 
            to="/blog"
            className="inline-flex items-center text-sm text-gray-500 hover:text-primary transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar ao Blog
          </Link>
        </div>
      </div>

      {/* Article */}
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <header className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <span className="inline-block px-3 py-1 rounded-full text-sm font-medium text-white bg-primary">
              {article.category}
            </span>
            <span className="text-sm text-gray-500">•</span>
            <span className="text-sm text-gray-500">
              {article.readingTime} min de leitura
            </span>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 leading-tight">
            {article.title}
          </h1>
          
          <p className="text-xl text-gray-600 mb-6 leading-relaxed">
            {article.subtitle}
          </p>
          
          <div className="flex items-center justify-between border-t border-gray-200 pt-6">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Calendar className="h-4 w-4" />
                <span>15 de julho, 2024</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Clock className="h-4 w-4" />
                <span>{article.readingTime} min</span>
              </div>
            </div>
            <button className="flex items-center gap-2 text-gray-500 hover:text-primary transition-colors">
              <Share2 className="h-4 w-4" />
              <span className="text-sm">Compartilhar</span>
            </button>
          </div>
        </header>

        {/* Hero Image */}
        <div className="mb-8">
          <BlogImage 
            articleId="futuro-agentes-humanizados"
            title={article.title}
            category="ia-automacao"
            className="w-full h-64 md:h-80 rounded-xl"
          />
        </div>

        {/* Content */}
        <div className="prose prose-lg max-w-none">
          <div dangerouslySetInnerHTML={{ __html: article.content }} />
        </div>

        {/* CTA Section */}
        <div className="mt-12 bg-gradient-to-r from-primary to-purple-600 rounded-2xl p-8 text-white text-center">
          <h3 className="text-2xl font-bold mb-4">
            Pronto para Implementar Agentes Avançados Humanizados?
          </h3>
          <p className="text-lg text-blue-100 mb-6">
            Teste nossa plataforma gratuitamente e veja como os agentes empresariais 
            podem transformar seu negócio em apenas 24 horas.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/personalizar-agente"
              className="bg-white text-primary px-8 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
            >
              Desbloquear Agente Teste
            </Link>
            <Link 
              to="/dashboard"
              className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-primary transition-colors"
            >
              Acessar Dashboard
            </Link>
          </div>
        </div>
      </article>

      {/* Related Articles */}
      <section className="bg-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Artigos Relacionados</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {article.relatedArticles.map((relatedArticle, index) => (
              <div key={index} className="bg-gray-50 rounded-xl p-6 hover:shadow-lg transition-shadow">
                <span className="inline-block px-3 py-1 rounded-full text-sm font-medium text-white bg-primary mb-3">
                  {relatedArticle.category}
                </span>
                <h3 className="text-lg font-semibold text-gray-900 mb-3 hover:text-primary transition-colors cursor-pointer">
                  {relatedArticle.title}
                </h3>
                <Link 
                  to={`/blog/${relatedArticle.slug}`}
                  className="text-primary hover:text-primary/80 transition-colors font-medium text-sm"
                >
                  Ler artigo
                </Link>
              </div>
            ))}
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

export default BlogArticlePage;