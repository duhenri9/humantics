import React, { useState, useRef, useEffect } from 'react';
import { UserCog, Calendar, TrendingUp, MoreVertical, Play, Pause, Settings, Activity, Users, Edit, Trash2, Copy, BarChart3 } from 'lucide-react';

interface AgentCardProps {
  agent: {
    id: string;
    name: string;
    type: 'essencial' | 'agenda' | 'conversao';
    status: 'active' | 'paused' | 'draft';
    lastUpdated: string;
  };
}

const AgentCard: React.FC<AgentCardProps> = ({ agent }) => {
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getTypeIcon = () => {
    switch (agent.type) {
      case 'essencial':
        return <UserCog className="h-5 w-5" />;
      case 'agenda':
        return <Calendar className="h-5 w-5" />;
      case 'conversao':
        return <TrendingUp className="h-5 w-5" />;
      default:
        return <UserCog className="h-5 w-5" />;
    }
  };

  const getTypeColor = () => {
    switch (agent.type) {
      case 'essencial':
        return 'bg-primary text-white';
      case 'agenda':
        return 'bg-accent text-white';
      case 'conversao':
        return 'bg-green-600 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  const getStatusColor = () => {
    switch (agent.status) {
      case 'active':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'paused':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'draft':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusText = () => {
    switch (agent.status) {
      case 'active':
        return 'Ativo';
      case 'paused':
        return 'Pausado';
      case 'draft':
        return 'Rascunho';
      default:
        return 'Desconhecido';
    }
  };

  const getTypeLabel = () => {
    switch (agent.type) {
      case 'essencial':
        return 'Essencial';
      case 'agenda':
        return 'Agenda';
      case 'conversao':
        return 'Conversão';
      default:
        return 'Agente';
    }
  };

  const handleMenuAction = (action: string) => {
    setShowMenu(false);
    
    switch (action) {
      case 'edit':
        console.log(`Editando agente ${agent.name}`);
        // Navigate to edit page or open edit modal
        break;
      case 'duplicate':
        console.log(`Duplicando agente ${agent.name}`);
        // Duplicate agent logic
        break;
      case 'analytics':
        console.log(`Visualizando analytics do agente ${agent.name}`);
        // Navigate to analytics page
        break;
      case 'settings':
        console.log(`Configurações do agente ${agent.name}`);
        // Open settings modal or navigate to settings
        break;
      case 'delete':
        if (window.confirm(`Tem certeza que deseja excluir o agente "${agent.name}"?`)) {
          console.log(`Excluindo agente ${agent.name}`);
          // Delete agent logic
        }
        break;
      default:
        break;
    }
  };

  const handleStatusToggle = () => {
    const newStatus = agent.status === 'active' ? 'paused' : 'active';
    console.log(`Alterando status do agente ${agent.name} para ${newStatus}`);
    // Update agent status logic
  };

  const menuItems = [
    {
      id: 'edit',
      label: 'Editar Agente',
      icon: Edit,
      color: 'text-gray-700 hover:text-blue-600 hover:bg-blue-50'
    },
    {
      id: 'duplicate',
      label: 'Duplicar Agente',
      icon: Copy,
      color: 'text-gray-700 hover:text-green-600 hover:bg-green-50'
    },
    {
      id: 'analytics',
      label: 'Ver Analytics',
      icon: BarChart3,
      color: 'text-gray-700 hover:text-purple-600 hover:bg-purple-50'
    },
    {
      id: 'settings',
      label: 'Configurações',
      icon: Settings,
      color: 'text-gray-700 hover:text-gray-600 hover:bg-gray-50'
    },
    {
      id: 'delete',
      label: 'Excluir Agente',
      icon: Trash2,
      color: 'text-red-600 hover:text-red-700 hover:bg-red-50',
      separator: true
    }
  ];

  // Determinar se o agente tem relatórios do MCP (apenas agenda e conversão)
  const hasMCPReports = agent.type === 'agenda' || agent.type === 'conversao';

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6 hover:shadow-xl transition-all duration-300 group">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className={`p-3 rounded-2xl ${getTypeColor()} group-hover:scale-110 transition-transform`}>
            {getTypeIcon()}
            <div className="text-xs font-bold mt-1">{getTypeLabel()}</div>
          </div>
          <div>
            <h3 className="font-bold text-gray-900 text-lg">{agent.name}</h3>
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor()}`}>
              <div className={`w-2 h-2 rounded-full mr-2 ${
                agent.status === 'active' ? 'bg-green-500 animate-pulse' :
                agent.status === 'paused' ? 'bg-yellow-500' : 'bg-gray-500'
              }`}></div>
              {getStatusText()}
            </span>
          </div>
        </div>
        <div className="relative" ref={menuRef}>
          <button 
            onClick={() => setShowMenu(!showMenu)}
            className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
          >
            <MoreVertical className="h-4 w-4 text-gray-400" />
          </button>

          {/* Dropdown Menu */}
          {showMenu && (
            <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
              <div className="py-2">
                {menuItems.map((item) => (
                  <div key={item.id}>
                    {item.separator && <hr className="my-1" />}
                    <button
                      onClick={() => handleMenuAction(item.id)}
                      className={`w-full text-left px-4 py-2 text-sm transition-colors flex items-center gap-2 ${item.color}`}
                    >
                      <item.icon className="h-4 w-4" />
                      {item.label}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Informações do Agente */}
      <div className="grid grid-cols-1 gap-4 mb-6">
        {hasMCPReports ? (
          <div className="bg-blue-50 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <BarChart3 className="h-4 w-4 text-blue-600" />
              <p className="text-sm text-blue-700 font-medium">Relatórios Semanais</p>
            </div>
            <p className="text-sm text-blue-600">
              Relatórios gerados toda sexta-feira pelo MCP
            </p>
          </div>
        ) : (
          <div className="bg-gray-50 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <Activity className="h-4 w-4 text-gray-500" />
              <p className="text-sm text-gray-500 font-medium">Agente Básico</p>
            </div>
            <p className="text-sm text-gray-500">
              Sem relatórios avançados disponíveis
            </p>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between">
        <p className="text-xs text-gray-500 flex items-center gap-1">
          <div className="w-2 h-2 bg-primary rounded-full"></div>
          Atualizado {agent.lastUpdated}
        </p>
        <div className="flex items-center space-x-2">
          <button 
            onClick={handleStatusToggle}
            className="p-2 hover:bg-gray-100 rounded-xl transition-colors group/btn"
            title={agent.status === 'active' ? 'Pausar agente' : 'Ativar agente'}
          >
            {agent.status === 'active' ? (
              <Pause className="h-4 w-4 text-gray-600 group-hover/btn:text-yellow-600" />
            ) : (
              <Play className="h-4 w-4 text-gray-600 group-hover/btn:text-green-600" />
            )}
          </button>
          <button 
            onClick={() => handleMenuAction('settings')}
            className="p-2 hover:bg-gray-100 rounded-xl transition-colors group/btn"
            title="Configurações do agente"
          >
            <Settings className="h-4 w-4 text-gray-600 group-hover/btn:text-primary" />
          </button>
        </div>
      </div>

      {/* Status do Agente */}
      <div className="mt-4 pt-4 border-t border-gray-100">
        <div className="flex items-center justify-between text-xs">
          <span className="text-gray-500">Status</span>
          <span className={`font-medium ${
            agent.status === 'active' ? 'text-green-600' :
            agent.status === 'paused' ? 'text-yellow-600' : 'text-gray-600'
          }`}>
            {agent.status === 'active' ? 'Em operação' :
             agent.status === 'paused' ? 'Pausado' : 'Em desenvolvimento'}
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
          <div 
            className={`h-2 rounded-full transition-all ${
              agent.status === 'active' ? 'bg-green-500' :
              agent.status === 'paused' ? 'bg-yellow-500' : 'bg-gray-500'
            }`}
            style={{ width: agent.status === 'active' ? '100%' : agent.status === 'paused' ? '50%' : '25%' }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default AgentCard;