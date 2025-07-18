import { Brain, BarChart3, BookOpen, TrendingUp, Bot, Users, Calendar, MessageCircle } from 'lucide-react';

interface BlogImageProps {
  articleId: string;
  title: string;
  category: string;
  className?: string;
}

const BlogImage = ({ articleId, title, category, className = "" }: BlogImageProps) => {
  const getThemeConfig = (id: string, cat: string) => {
    switch (id) {
      case 'futuro-agentes-humanizados':
        return {
          icon: Brain,
          gradient: 'from-purple-400 to-indigo-600',
          bg: 'bg-gradient-to-br from-purple-50 to-indigo-100',
          iconColor: 'text-white'
        };
      case 'clinicas-transformacao-digital':
        return {
          icon: Calendar,
          gradient: 'from-blue-400 to-cyan-600',
          bg: 'bg-gradient-to-br from-blue-50 to-cyan-100',
          iconColor: 'text-white'
        };
      case 'configurar-agente-vendas':
        return {
          icon: Users,
          gradient: 'from-green-400 to-emerald-600',
          bg: 'bg-gradient-to-br from-green-50 to-emerald-100',
          iconColor: 'text-white'
        };
      case 'mercado-agentes-brasil-2024':
        return {
          icon: TrendingUp,
          gradient: 'from-orange-400 to-red-600',
          bg: 'bg-gradient-to-br from-orange-50 to-red-100',
          iconColor: 'text-white'
        };
      case 'roi-agentes-empresariais':
        return {
          icon: BarChart3,
          gradient: 'from-indigo-400 to-purple-600',
          bg: 'bg-gradient-to-br from-indigo-50 to-purple-100',
          iconColor: 'text-white'
        };
      default:
        return {
          icon: Bot,
          gradient: 'from-gray-400 to-gray-600',
          bg: 'bg-gradient-to-br from-gray-50 to-gray-100',
          iconColor: 'text-white'
        };
    }
  };

  const theme = getThemeConfig(articleId, category);
  const Icon = theme.icon;

  return (
    <div className={`${theme.bg} ${className} flex items-center justify-center relative overflow-hidden`}>
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent"></div>
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-4 left-4 w-2 h-2 bg-white/30 rounded-full"></div>
          <div className="absolute top-8 right-8 w-1 h-1 bg-white/40 rounded-full"></div>
          <div className="absolute bottom-6 left-8 w-1.5 h-1.5 bg-white/30 rounded-full"></div>
          <div className="absolute bottom-4 right-4 w-2 h-2 bg-white/40 rounded-full"></div>
        </div>
      </div>

      {/* Main Icon */}
      <div className={`bg-gradient-to-br ${theme.gradient} rounded-full p-6 shadow-lg`}>
        <Icon className={`h-16 w-16 ${theme.iconColor}`} />
      </div>

      {/* Secondary Icons */}
      <div className="absolute top-4 right-4 opacity-20">
        <MessageCircle className="h-6 w-6 text-gray-600" />
      </div>
      <div className="absolute bottom-4 left-4 opacity-20">
        <Brain className="h-4 w-4 text-gray-600" />
      </div>

      {/* HumanTic Branding */}
      <div className="absolute bottom-2 right-2 text-xs font-medium text-gray-400 opacity-60">
        HumanTic
      </div>
    </div>
  );
};

export default BlogImage;