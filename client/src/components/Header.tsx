import React from 'react';
import { Link } from 'react-router-dom';

interface HeaderProps {
  showNavigation?: boolean;
}

export const Header: React.FC<HeaderProps> = ({ showNavigation = true }) => {
  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-[#6D7AFF] rounded flex items-center justify-center">
              <span className="text-white font-bold text-lg">H</span>
            </div>
            <div className="text-xl font-bold">
              <span className="text-[#6D7AFF]">Human</span>
              <span className="text-gray-900">Tic</span>
            </div>
          </Link>
          
          {showNavigation && (
            <nav className="hidden md:flex space-x-6">
              <Link to="/blog" className="text-gray-600 hover:text-[#6D7AFF] transition-colors">
                Blog
              </Link>
              <Link to="/login" className="text-gray-600 hover:text-[#6D7AFF] transition-colors">
                Login
              </Link>
              <Link 
                to="/signup" 
                className="bg-[#6D7AFF] text-white px-4 py-2 rounded-lg hover:opacity-90 transition-opacity"
              >
                Teste por 7 dias
              </Link>
            </nav>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
