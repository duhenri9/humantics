import React, { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  User, 
  TrendingUp, 
  Play, 
  Settings, 
  Wrench, 
  BarChart3,
  Home,
  LogOut
} from 'lucide-react';
import { useClient } from '../context/ClientContext';
import Logo from '../components/Logo';

const ClientArea = () => {
  const location = useLocation();
  const { clientData, clearClient } = useClient();

  const navigationItems = [
    { id: 'entry-form', label: 'Cadastro', path: '/client-area/entry-form', icon: User },
    { id: 'journey', label: 'Jornada', path: '/client-area/journey', icon: TrendingUp },
    { id: 'agent-test', label: 'Teste do Agente', path: '/client-area/agent-test', icon: Play },
    { id: 'adjustments', label: 'Ajustes', path: '/client-area/adjustments', icon: Settings },
    { id: 'integrations', label: 'Integrações', path: '/client-area/integrations', icon: Wrench },
    { id: 'reports', label: 'Relatórios', path: '/client-area/reports', icon: BarChart3 }
  ];

  const isActive = (path: string) => location.pathname === path;

  const planoFeatures = {
    essencial: { name: 'Agente Essencial', color: 'bg-blue-100 text-blue-800' },
    agenda: { name: 'Agente de Agenda', color: 'bg-purple-100 text-purple-800' },
    conversao: { name: 'Agente de Conversão', color: 'bg-green-100 text-green-800' }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
        {/* Logo */}
        <div className="p-6 border-b border-gray-200">
          <Link to="/">
            <Logo size="md" />
          </Link>
        </div>

        {/* Client Info */}
        {clientData && (
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                <User className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="font-medium text-gray-900">{clientData.nome_cliente}</p>
                <p className="text-sm text-gray-500">{clientData.nome_empresa}</p>
              </div>
            </div>
            <div className={`px-3 py-1 rounded-full text-xs font-medium ${planoFeatures[clientData.plano].color}`}>
              {planoFeatures[clientData.plano].name}
            </div>
          </div>
        )}

        {/* Navigation */}
        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            {navigationItems.map((item) => (
              <li key={item.id}>
                <Link
                  to={item.path}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive(item.path)
                      ? 'bg-blue-50 text-blue-600 border border-blue-200'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <item.icon className="h-5 w-5" />
                  <span className="font-medium">{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Bottom Actions */}
        <div className="p-4 border-t border-gray-200">
          <Link
            to="/"
            className="flex items-center space-x-3 px-4 py-3 text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-lg transition-colors w-full mb-2"
          >
            <Home className="h-5 w-5" />
            <span className="font-medium">Voltar ao Site</span>
          </Link>
          <button
            onClick={clearClient}
            className="flex items-center space-x-3 px-4 py-3 text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-lg transition-colors w-full"
          >
            <LogOut className="h-5 w-5" />
            <span className="font-medium">Sair</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Portal do Cliente</h1>
              {clientData && (
                <p className="text-gray-600">Olá, {clientData.nome_cliente}!</p>
              )}
            </div>
            <div className="flex items-center space-x-4">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-gray-600">Sistema Online</span>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto p-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Outlet />
          </motion.div>
        </main>
      </div>
    </div>
  );
};

export default ClientArea;