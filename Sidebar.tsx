import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  UserCog, 
  LayoutDashboard, 
  Wrench, 
  BarChart3, 
  Settings, 
  Users, 
  CreditCard,
  DollarSign,
  HelpCircle,
  LogOut,
  UserPlus,
  Server,
  BookOpen,
  MessageSquare,
  FileText,
  HeadphonesIcon,
  Receipt,
  MessageCircle,
  Edit
} from 'lucide-react';
import Logo from './Logo';
import { useAuth } from '../context/AuthContext';
import { currentEnvironment } from '../lib/env';

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { signOut, user } = useAuth();
  
  // Filtrar itens de menu com base na role do usuário
  const menuItems = user?.role === 'admin' ? [
    // Menu simplificado para admin: apenas métricas financeiras e gestão de usuários
    { icon: LayoutDashboard, label: 'Dashboard', path: '/admin/dashboard', roles: ['admin'] },
    { icon: DollarSign, label: 'Métricas Financeiras', path: '/admin/portal', roles: ['admin'] },
    { icon: Users, label: 'Gestão de Usuários', path: '/admin/users', roles: ['admin'] },
    { icon: MessageCircle, label: 'WhatsApp', path: '/whatsapp-atendimento', roles: ['admin'] },
    { icon: MessageSquare, label: 'Solicitações', path: '/admin/requests', roles: ['admin'] },
    { icon: FileText, label: 'Pagamentos', path: '/admin/payments', roles: ['admin'] },
    { icon: BookOpen, label: 'Biblioteca', path: '/admin/library', roles: ['admin'] },
    { icon: Edit, label: 'Blog', path: '/blog', roles: ['admin'] },
    { icon: MessageSquare, label: 'WhatsApp Auto', path: '/whatsapp-qr-code', roles: ['admin'], external: true },
  ] : [
    // Menu para clientes: foco em conta e suporte
    { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard', roles: ['client'] },
    { icon: CreditCard, label: 'Planos', path: '/billing', roles: ['client'] },
    { icon: Receipt, label: 'Pagamentos', path: '/payment-history', roles: ['client'] },
    { icon: HeadphonesIcon, label: 'Suporte', path: '/support', roles: ['client'] },
    { icon: Settings, label: 'Configurações', path: '/settings', roles: ['client'] },
  ];

  // Menu de ambiente removido - funcionalidades consolidadas em Gestão de Usuários e Métricas Financeiras

  // Filtrar itens com base na role do usuário
  const filteredMenuItems = menuItems.filter(item => 
    item.roles.includes(user?.role || 'client')
  );

  const isActive = (path: string) => location.pathname === path;

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <div className="w-64 bg-white border-r border-gray-200 h-screen flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-gray-200">
        <Link to="/dashboard">
          <Logo size="md" />
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {filteredMenuItems.map((item) => (
            <li key={item.path}>
              {item.external ? (
                <button
                  onClick={() => window.open(item.path, '_blank')}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors w-full text-left ${
                    isActive(item.path)
                      ? 'bg-primary/10 text-primary border border-primary/20'
                      : 'text-secondary hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <item.icon className="h-5 w-5" />
                  <span className="font-medium">{item.label}</span>
                </button>
              ) : (
                <Link
                  to={item.path}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive(item.path)
                      ? 'bg-primary/10 text-primary border border-primary/20'
                      : 'text-secondary hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <item.icon className="h-5 w-5" />
                  <span className="font-medium">{item.label}</span>
                </Link>
              )}
            </li>
          ))}
        </ul>
      </nav>

      {/* Bottom Actions */}
      <div className="p-4 border-t border-gray-200">
        <button 
          onClick={() => window.open('/ajuda.html', '_blank')}
          className="flex items-center space-x-3 px-4 py-3 text-secondary hover:bg-gray-50 hover:text-gray-900 rounded-lg transition-colors w-full mb-2"
        >
          <HelpCircle className="h-5 w-5" />
          <span className="font-medium">Ajuda</span>
        </button>
        <button 
          onClick={handleLogout}
          className="flex items-center space-x-3 px-4 py-3 text-secondary hover:bg-gray-50 hover:text-gray-900 rounded-lg transition-colors w-full"
        >
          <LogOut className="h-5 w-5" />
          <span className="font-medium">Sair</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;