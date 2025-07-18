import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  FileText, 
  CheckSquare, 
  CreditCard, 
  Zap,
  CheckCircle,
  Clock,
  AlertCircle,
  ArrowRight
} from 'lucide-react';
import { useClient } from '../../context/ClientContext';
import { getApiUrl } from '../../utils/deployConfig';

const JourneyDashboard = () => {
  const { clienteId } = useClient();
  const [journeyStatus, setJourneyStatus] = useState({
    proposta: 'pending' as 'pending' | 'approved' | 'rejected',
    contrato: 'pending' as 'pending' | 'signed' | 'waiting',
    pagamento: 'pending' as 'pending' | 'paid' | 'overdue',
    ativacao: 'pending' as 'pending' | 'active' | 'inactive'
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchJourneyStatus();
  }, [clienteId]);

  const fetchJourneyStatus = async () => {
    try {
      // Obter URL da API de status
      const statusUrl = `${getApiUrl('STATUS')}?cliente_id=${clienteId || 'demo'}`;
      
      // Fazer a requisição
      const response = await fetch(statusUrl).catch(() => {
        // Fallback mock response apenas em desenvolvimento
        if (import.meta.env.DEV) {
          return {
            ok: true,
            json: () => Promise.resolve({
              proposta: 'pending',
              contrato: 'pending',
              pagamento: 'pending',
              ativacao: 'pending'
            })
          };
        }
        throw new Error('Erro na conexão com o servidor');
      });

      if (response.ok) {
        try {
          const status = await response.json();
          setJourneyStatus(status);
        } catch (error) {
          // Fallback apenas em desenvolvimento
          if (import.meta.env.DEV) {
            setJourneyStatus({
              proposta: 'pending',
              contrato: 'pending',
              pagamento: 'pending',
              ativacao: 'pending'
            });
          } else {
            throw new Error('Resposta inválida do servidor');
          }
        }
      } else {
        throw new Error(`Erro ao buscar status: ${response.status}`);
      }
    } catch (error) {
      console.error('Error fetching journey status:', error);
      // Em produção, não usamos fallback para manter a integridade dos dados
      if (import.meta.env.DEV) {
        setJourneyStatus({
          proposta: 'pending',
          contrato: 'pending',
          pagamento: 'pending',
          ativacao: 'pending'
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const journeySteps = [
    {
      key: 'proposta',
      title: 'Proposta',
      icon: FileText,
      description: 'Análise e elaboração da proposta personalizada',
      details: 'Nossa equipe está analisando suas necessidades e preparando uma proposta customizada para seu negócio.'
    },
    {
      key: 'contrato',
      title: 'Contrato',
      icon: CheckSquare,
      description: 'Assinatura do contrato e documentação',
      details: 'Após aprovação da proposta, você receberá o contrato para assinatura digital.'
    },
    {
      key: 'pagamento',
      title: 'Pagamento',
      icon: CreditCard,
      description: 'Processamento do pagamento e ativação',
      details: 'Processamento do pagamento de setup e primeira mensalidade para iniciar o desenvolvimento.'
    },
    {
      key: 'ativacao',
      title: 'Ativação',
      icon: Zap,
      description: 'Configuração e ativação do seu agente',
      details: 'Desenvolvimento, configuração e ativação do seu agente digital personalizado.'
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
      case 'signed':
      case 'paid':
      case 'active':
        return <CheckCircle className="h-6 w-6 text-green-600" />;
      case 'pending':
      case 'waiting':
        return <Clock className="h-6 w-6 text-yellow-600" />;
      case 'rejected':
      case 'overdue':
      case 'inactive':
        return <AlertCircle className="h-6 w-6 text-red-600" />;
      default:
        return <Clock className="h-6 w-6 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
      case 'signed':
      case 'paid':
      case 'active':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'pending':
      case 'waiting':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'rejected':
      case 'overdue':
      case 'inactive':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusText = (step: string, status: string) => {
    const statusMap: Record<string, Record<string, string>> = {
      proposta: {
        pending: 'Aguardando análise',
        approved: 'Proposta aprovada',
        rejected: 'Proposta rejeitada'
      },
      contrato: {
        pending: 'Aguardando assinatura',
        signed: 'Contrato assinado',
        waiting: 'Aguardando documentos'
      },
      pagamento: {
        pending: 'Aguardando pagamento',
        paid: 'Pagamento confirmado',
        overdue: 'Pagamento em atraso'
      },
      ativacao: {
        pending: 'Aguardando ativação',
        active: 'Agente ativo',
        inactive: 'Agente inativo'
      }
    };
    
    return statusMap[step]?.[status] || 'Status desconhecido';
  };

  const getStepProgress = () => {
    const steps = ['proposta', 'contrato', 'pagamento', 'ativacao'];
    let completed = 0;
    
    for (const step of steps) {
      const status = journeyStatus[step as keyof typeof journeyStatus];
      if (status === 'approved' || status === 'signed' || status === 'paid' || status === 'active') {
        completed++;
      } else {
        break;
      }
    }
    
    return (completed / steps.length) * 100;
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl border border-gray-200 p-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3 mb-8"></div>
            <div className="space-y-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-gray-200 rounded-full"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto space-y-8"
    >
      {/* Header */}
      <div className="bg-white rounded-xl border border-gray-200 p-8">
        <div className="mb-6">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Sua Jornada</h2>
          <p className="text-gray-600 text-lg">Acompanhe o progresso da implementação do seu agente</p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Progresso</span>
            <span>{Math.round(getStepProgress())}% concluído</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div 
              className="bg-gradient-to-r from-blue-600 to-purple-600 h-3 rounded-full transition-all duration-500"
              style={{ width: `${getStepProgress()}%` }}
            ></div>
          </div>
        </div>

        {/* Timeline */}
        <div className="relative">
          <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gray-200"></div>
          
          <div className="space-y-8">
            {journeySteps.map((step, index) => {
              const status = journeyStatus[step.key as keyof typeof journeyStatus];
              const isCompleted = status === 'approved' || status === 'signed' || status === 'paid' || status === 'active';
              const isCurrent = !isCompleted && (index === 0 || 
                journeyStatus[journeySteps[index - 1]?.key as keyof typeof journeyStatus] === 'approved' ||
                journeyStatus[journeySteps[index - 1]?.key as keyof typeof journeyStatus] === 'signed' ||
                journeyStatus[journeySteps[index - 1]?.key as keyof typeof journeyStatus] === 'paid' ||
                journeyStatus[journeySteps[index - 1]?.key as keyof typeof journeyStatus] === 'active'
              );

              return (
                <motion.div 
                  key={step.key} 
                  className="relative flex items-start"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className={`relative z-10 flex items-center justify-center w-16 h-16 rounded-full border-4 transition-all ${
                    isCompleted
                      ? 'bg-green-100 border-green-500 shadow-lg'
                      : isCurrent
                      ? 'bg-blue-100 border-blue-500 shadow-lg animate-pulse'
                      : 'bg-gray-100 border-gray-300'
                  }`}>
                    {isCompleted ? (
                      <CheckCircle className="h-8 w-8 text-green-600" />
                    ) : isCurrent ? (
                      <step.icon className="h-8 w-8 text-blue-600" />
                    ) : (
                      <step.icon className="h-8 w-8 text-gray-400" />
                    )}
                  </div>
                  
                  <div className="ml-6 flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-xl font-bold text-gray-900">{step.title}</h3>
                      <span className={`px-4 py-2 rounded-full text-sm font-medium border ${getStatusColor(status)}`}>
                        {getStatusText(step.key, status)}
                      </span>
                    </div>
                    <p className="text-gray-600 mb-2">{step.description}</p>
                    <p className="text-sm text-gray-500">{step.details}</p>
                    
                    {isCurrent && (
                      <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                        <div className="flex items-center gap-2 text-blue-800">
                          <Clock className="h-4 w-4" />
                          <span className="font-medium">Etapa atual</span>
                        </div>
                        <p className="text-sm text-blue-700 mt-1">
                          Nossa equipe está trabalhando nesta etapa. Você será notificado assim que for concluída.
                        </p>
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Next Steps */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-200 p-8">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Próximos Passos</h3>
        <div className="space-y-3">
          {getStepProgress() < 100 ? (
            <>
              <div className="flex items-center gap-3">
                <ArrowRight className="h-4 w-4 text-blue-600" />
                <span className="text-gray-700">Aguarde nossa equipe concluir a etapa atual</span>
              </div>
              <div className="flex items-center gap-3">
                <ArrowRight className="h-4 w-4 text-blue-600" />
                <span className="text-gray-700">Você receberá notificações por email sobre o progresso</span>
              </div>
              <div className="flex items-center gap-3">
                <ArrowRight className="h-4 w-4 text-blue-600" />
                <span className="text-gray-700">Em caso de dúvidas, entre em contato conosco</span>
              </div>
            </>
          ) : (
            <div className="text-center py-4">
              <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-3" />
              <h4 className="text-lg font-bold text-gray-900 mb-2">Parabéns! Seu agente está ativo!</h4>
              <p className="text-gray-600">Agora você pode testar e começar a usar seu agente digital.</p>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default JourneyDashboard;