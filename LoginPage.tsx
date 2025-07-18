import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, ArrowRight, AlertCircle, RefreshCw } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Logo from '../Logo';

const LoginPage = () => {
  const navigate = useNavigate();
  const { user, isLoading, signIn } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [systemStatus, setSystemStatus] = useState<'checking' | 'online' | 'offline' | 'degraded'>('checking');
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  // Check system status on mount
  useEffect(() => {
    const checkSystemStatus = async () => {
      try {
        // Simple connectivity test to our API
        const response = await fetch('/api/auth/me', {
          method: 'HEAD'
        });
        
        if (response.ok || response.status === 401) {
          // 401 is expected when not logged in, means API is working
          setSystemStatus('online');
        } else if (response.status >= 500) {
          setSystemStatus('offline');
        } else {
          setSystemStatus('degraded');
        }
      } catch (error) {
        console.error('System status check failed:', error);
        setSystemStatus('offline');
      }
    };

    checkSystemStatus();
  }, []);

  // Monitor auth state and redirect when ready
  useEffect(() => {
    console.log('LoginPage: Auth state changed', { 
      user: user?.email, 
      role: user?.role, 
      isLoading 
    });

    // Only redirect when we have user loaded
    if (!isLoading && user) {
      console.log('LoginPage: Redirecting user based on role:', user.role);
      
      if (user.role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/dashboard');
      }
    }
  }, [user, isLoading, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('LoginPage: Login attempt for:', formData.email);
    
    // Check if system is offline
    if (systemStatus === 'offline') {
      alert('Sistema temporariamente indisponível. Tente novamente em alguns minutos.');
      return;
    }
    
    setIsSubmitting(true);

    try {
      const success = await signIn(formData.email, formData.password);

      if (success) {
        console.log('LoginPage: Login successful for:', formData.email);
        // Navigation will be handled by the useEffect hook above
      } else {
        alert('Email ou senha incorretos. Tente novamente.');
      }
    } catch (error: any) {
      console.error('LoginPage: Login error:', error);
      alert('Erro inesperado no login. Tente novamente.');
      
      // Update system status if we detect backend issues
      setSystemStatus('offline');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleRetryConnection = () => {
    setSystemStatus('checking');
    window.location.reload();
  };

  const getStatusColor = () => {
    switch (systemStatus) {
      case 'online': return 'text-green-600';
      case 'offline': return 'text-red-600';
      case 'degraded': return 'text-yellow-600';
      default: return 'text-gray-600';
    }
  };

  const getStatusText = () => {
    switch (systemStatus) {
      case 'online': return 'Sistema Online';
      case 'offline': return 'Sistema Indisponível';
      case 'degraded': return 'Sistema com Problemas';
      case 'checking': return 'Verificando Sistema...';
      default: return 'Status Desconhecido';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
          {/* Logo */}
          <div className="text-center mb-8">
            <Link to="/">
              <Logo size="lg" className="mx-auto mb-4" />
            </Link>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Bem-vindo de volta</h1>
            <p className="text-gray-600">Entre na sua conta para continuar</p>
          </div>

          {/* System Status */}
          <div className="mb-6 p-3 bg-gray-50 border border-gray-200 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${
                  systemStatus === 'online' ? 'bg-green-500' :
                  systemStatus === 'offline' ? 'bg-red-500' :
                  systemStatus === 'degraded' ? 'bg-yellow-500' :
                  'bg-gray-400'
                }`}></div>
                <span className={`text-sm font-medium ${getStatusColor()}`}>
                  {getStatusText()}
                </span>
              </div>
              {systemStatus === 'offline' && (
                <button
                  onClick={handleRetryConnection}
                  className="text-blue-600 hover:text-blue-700 p-1"
                  title="Tentar novamente"
                >
                  <RefreshCw className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>

          {/* System Offline Warning */}
          {systemStatus === 'offline' && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <AlertCircle className="h-4 w-4 text-red-600" />
                <span className="text-sm font-medium text-red-900">Sistema Temporariamente Indisponível</span>
              </div>
              <p className="text-sm text-red-800">
                Estamos enfrentando problemas técnicos. Nossa equipe foi notificada e está trabalhando na solução.
              </p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors disabled:opacity-50"
                  placeholder="seu@email.com"
                  disabled={systemStatus === 'offline'}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Senha
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors disabled:opacity-50"
                  placeholder="Sua senha"
                  disabled={systemStatus === 'offline'}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 disabled:opacity-50"
                  disabled={systemStatus === 'offline'}
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <div className="text-right">
              <Link
                to="/auth/forgot-password"
                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                Esqueceu sua senha?
              </Link>
            </div>

            <button
              type="submit"
              disabled={isSubmitting || systemStatus === 'offline'}
              className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Entrando...
                </>
              ) : (
                <>
                  Entrar
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>

          {/* Links */}
          <div className="mt-6 text-center space-y-4">
            <Link
              to="/personalizar-agente"
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              Não tem uma conta? Cadastre-se
            </Link>
            
            <div className="border-t border-gray-200 pt-4">
              <Link
                to="/"
                className="text-gray-600 hover:text-gray-900 text-sm"
              >
                ← Voltar ao site
              </Link>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage;