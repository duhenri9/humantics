import React from 'react';
import { Link } from 'react-router-dom';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-[#6D7AFF] rounded flex items-center justify-center">
                <span className="text-white font-bold text-lg">H</span>
              </div>
              <div className="text-xl font-bold">
                <span className="text-[#6D7AFF]">Human</span>
                <span className="text-white">Tic</span>
              </div>
            </div>
            <p className="text-gray-300 text-sm">
              Agentes como Serviço (AaaS) da WM3 Digital.<br />
              Automatização inteligente para WhatsApp Business.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Produto</h4>
            <ul className="space-y-2 text-sm text-gray-300">
              <li><Link to="/blog" className="hover:text-[#6D7AFF] transition-colors">Como Funciona</Link></li>
              <li><a href="#" className="hover:text-[#6D7AFF] transition-colors">Integrações</a></li>
              <li><a href="#" className="hover:text-[#6D7AFF] transition-colors">API</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Empresa</h4>
            <ul className="space-y-2 text-sm text-gray-300">
              <li><Link to="/blog" className="hover:text-[#6D7AFF] transition-colors">Blog</Link></li>
              <li><a href="#" className="hover:text-[#6D7AFF] transition-colors">Sobre</a></li>
              <li><a href="#" className="hover:text-[#6D7AFF] transition-colors">Contato</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Suporte</h4>
            <ul className="space-y-2 text-sm text-gray-300">
              <li><a href="#" className="hover:text-[#6D7AFF] transition-colors">Central de Ajuda</a></li>
              <li><a href="mailto:humantic@wm3digital.com.br" className="hover:text-[#6D7AFF] transition-colors">humantic@wm3digital.com.br</a></li>
              <li><a href="https://wa.me/5511950377457" className="hover:text-[#6D7AFF] transition-colors">WhatsApp: +55 11 95037-7457</a></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © 2025 HumanTic by WM3 Digital. Todos os direitos reservados.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="hover:text-[#6D7AFF] transition-colors">Privacidade</a>
              <a href="#" className="hover:text-[#6D7AFF] transition-colors">Termos</a>
              <a href="#" className="hover:text-[#6D7AFF] transition-colors">Cookies</a>
              <a href="#" className="hover:text-[#6D7AFF] transition-colors">LGPD</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
