import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, ArrowLeft } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';

export const BlogPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <div className="w-16 h-16 bg-[#6D7AFF] bg-opacity-10 rounded-xl flex items-center justify-center mx-auto mb-6">
            <BookOpen className="h-8 w-8 text-[#6D7AFF]" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Blog em Construção
          </h1>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Em breve você encontrará aqui artigos sobre automação, chatbots e melhores práticas para seu negócio.
          </p>
          <Link 
            to="/"
            className="inline-flex items-center gap-2 bg-[#6D7AFF] text-white px-6 py-3 rounded-lg font-medium hover:opacity-90 transition-opacity"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar ao Início
          </Link>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};
