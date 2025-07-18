import React, { useEffect, useState } from 'react';

interface User {
  id: string;
  email: string;
  fullName: string;
  role: string;
}

export const Dashboard: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          window.location.href = '/login';
          return;
        }

        const response = await fetch('/api/auth/me', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const userData = await response.json();
          setUser(userData);
        } else {
          localStorage.removeItem('token');
          window.location.href = '/login';
        }
      } catch (error) {
        console.error('Erro ao carregar usuário:', error);
        localStorage.removeItem('token');
        window.location.href = '/login';
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <h1 className="text-2xl font-bold">
              <span className="text-purple-600">Human</span>
              <span className="text-gray-900">Tic</span>
            </h1>
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">Olá, {user?.fullName}</span>
              <button
                onClick={handleLogout}
                className="text-gray-500 hover:text-gray-700"
              >
                Sair
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h2>
          <p className="text-gray-600">Gerencie seus agentes de IA e acompanhe o desempenho</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Personalizar Agente</h3>
            <p className="text-gray-600 mb-4">Configure seu agente de IA personalizado</p>
            <button
              onClick={() => window.location.href = '/personalizar-agente'}
              style={{ backgroundColor: '#6D7AFF' }}
              className="w-full text-white py-2 px-4 rounded-md hover:opacity-90 transition-opacity"
            >
              Começar
            </button>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Blog</h3>
            <p className="text-gray-600 mb-4">Acesse nosso blog com dicas e novidades</p>
            <button
              onClick={() => window.location.href = '/blog'}
              className="w-full border border-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-50 transition-colors"
            >
              Ver Blog
            </button>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Suporte</h3>
            <p className="text-gray-600 mb-4">Precisa de ajuda? Entre em contato</p>
            <button
              onClick={() => window.open('https://wa.me/5511950377457', '_blank')}
              className="w-full border border-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-50 transition-colors"
            >
              WhatsApp
            </button>
          </div>
        </div>

        {user?.role === 'admin' && (
          <div className="mt-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Painel Administrativo</h3>
            <div className="bg-white rounded-lg shadow-sm p-6">
              <p className="text-gray-600 mb-4">Acesso exclusivo para administradores</p>
              <div className="space-y-2">
                <p><strong>Email:</strong> {user.email}</p>
                <p><strong>Role:</strong> {user.role}</p>
                <p><strong>ID:</strong> {user.id}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
