import React from 'react';
import { Link } from 'react-router-dom';
import { Bot, MessageSquare, Settings } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import WhatsAppFloatingButton from '../components/WhatsAppFloatingButton';

export const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      {/* Hero Section - Ultra Simples */}
      <section className="py-20 bg-gradient-to-br from-[#6D7AFF] to-purple-600">
        <div className="container mx-auto px-4 text-center text-white">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            <span className="text-white">Human</span>
            <span className="text-yellow-300">Tic</span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto opacity-90">
            Plataforma Administrativa para Gestão de Chatbots WhatsApp
          </p>
          <div className="space-y-4 md:space-y-0 md:space-x-4 md:flex md:justify-center">
            <Link 
              to="/admin/login" 
              className="inline-block bg-white text-[#6D7AFF] px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              <Settings className="inline h-5 w-5 mr-2" />
              Painel Administrativo
            </Link>
            <Link 
              to="/client/portal" 
              className="inline-block border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-[#6D7AFF] transition-colors"
            >
              <MessageSquare className="inline h-5 w-5 mr-2" />
              Portal do Cliente
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section - Simplificado */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Gestão Centralizada
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Sistema administrativo para gerenciar clientes, integrações BotSailor e Chatwoot
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-[#6D7AFF] bg-opacity-10 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Settings className="h-8 w-8 text-[#6D7AFF]" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Admin Dashboard</h3>
              <p className="text-gray-600">Cadastro e gestão completa de clientes</p>
            </div>
            
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Bot className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">BotSailor Integration</h3>
              <p className="text-gray-600">Conexão manual com controle de limite</p>
            </div>
            
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <MessageSquare className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Chatwoot Hub</h3>
              <p className="text-gray-600">CRM centralizado para todos os clientes</p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
      <WhatsAppFloatingButton />
    </div>
  );
};
