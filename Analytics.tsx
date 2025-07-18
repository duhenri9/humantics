import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import { 
  TrendingUp, 
  TrendingDown, 
  MessageSquare, 
  Clock, 
  Users, 
  Target,
  Calendar,
  Filter,
  Download,
  RefreshCw,
  CheckCircle
} from 'lucide-react';
// Define Agent interface locally
interface Agent {
  id: string;
  name: string;
  type: 'essencial' | 'agenda' | 'conversao';
  status: 'active' | 'paused' | 'draft';
  lastUpdated: string;
}
import { getUserReports } from '../services/mcpService';
import { useAuth } from '../context/AuthContext';

const Analytics = () => {
  const { userProfile } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [agents, setAgents] = useState<Agent[]>([]);
  const [reports, setReports] = useState<any[]>([]);
  const [selectedWeek, setSelectedWeek] = useState<number | null>(null);
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());

  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 }
  };

  useEffect(() => {
    if (userProfile) {
      fetchData();
    }
  }, [userProfile]);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      // Fetch agents
      const agentsData = await getAgents(userProfile?.id);
      setAgents(agentsData);

      // Fetch MCP reports
      if (userProfile?.id) {
        const reportsData = await getUserReports(userProfile.id);
        setReports(reportsData);
        
        // Set default selected week to the most recent report
        if (reportsData.length > 0) {
          const latestReport = reportsData.reduce((latest, current) => 
            new Date(current.report_date) > new Date(latest.report_date) ? current : latest
          );
          setSelectedWeek(latestReport.week_number);
          setSelectedYear(latestReport.year);
        }
      }
    } catch (error) {
      console.error('Error fetching analytics data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Calcular métricas agregadas de todos os relatórios da semana selecionada
  const getAggregatedMetrics = () => {
    if (!selectedWeek) return null;
    
    const weekReports = reports.filter(r => r.week_number === selectedWeek && r.year === selectedYear);
    
    if (weekReports.length === 0) return null;
    
    const totalConversations = weekReports.reduce((sum, r) => sum + r.metrics.conversations_count, 0);
    const avgSatisfaction = weekReports.reduce((sum, r) => sum + r.metrics.satisfaction_rate, 0) / weekReports.length;
    const avgResolution = weekReports.reduce((sum, r) => sum + r.metrics.resolution_rate, 0) / weekReports.length;
    const avgResponseTime = weekReports.reduce((sum, r) => sum + r.metrics.average_response_time, 0) / weekReports.length;
    
    return {
      totalConversations,
      avgSatisfaction,
      avgResolution,
      avgResponseTime
    };
  };

  const metrics = getAggregatedMetrics();

  // Obter lista de semanas disponíveis nos relatórios
  const availableWeeks = [...new Set(reports.map(r => r.week_number))].sort((a, b) => b - a);
  
  // Obter lista de anos disponíveis nos relatórios
  const availableYears = [...new Set(reports.map(r => r.year))].sort((a, b) => b - a);

  // Filtrar agentes com base no tipo (apenas agenda e conversão têm relatórios)
  const agentsWithReports = agents.filter(agent => 
    agent.type === 'agenda' || agent.type === 'conversao'
  );

  // Obter relatórios para a semana selecionada
  const selectedWeekReports = selectedWeek 
    ? reports.filter(r => r.week_number === selectedWeek && r.year === selectedYear)
    : [];

  // Verificar se o usuário é admin
  if (userProfile?.role !== 'admin') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Acesso Negado</h1>
          <p className="text-gray-600 mb-6">Você não tem permissão para acessar esta página.</p>
          <button
            onClick={() => window.location.href = '/'}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Voltar ao Início
          </button>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex h-screen bg-gray-50">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header />
          <main className="flex-1 overflow-y-auto p-6">
            <div className="animate-pulse space-y-6">
              <div className="h-8 bg-gray-200 rounded w-1/3"></div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="h-32 bg-gray-200 rounded-xl"></div>
                ))}
              </div>
              <div className="h-64 bg-gray-200 rounded-xl"></div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        
        <main className="flex-1 overflow-y-auto p-6">
          <motion.div
            initial="initial"
            animate="animate"
            variants={{
              animate: {
                transition: {
                  staggerChildren: 0.1
                }
              }
            }}
          >
            {/* Header */}
            <motion.div className="flex items-center justify-between mb-8" variants={fadeInUp}>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Analytics</h1>
                <p className="text-gray-600">Relatórios semanais gerados pelo MCP para agentes avançados</p>
              </div>
              <div className="flex items-center space-x-3">
                <button 
                  onClick={fetchData}
                  className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <RefreshCw className="h-4 w-4" />
                  Atualizar
                </button>
                <div className="flex items-center gap-2">
                  <select 
                    className="px-4 py-2 border border-gray-300 rounded-lg"
                    value={selectedYear || ''}
                    onChange={(e) => setSelectedYear(Number(e.target.value))}
                  >
                    {availableYears.map(year => (
                      <option key={year} value={year}>{year}</option>
                    ))}
                  </select>
                  <select 
                    className="px-4 py-2 border border-gray-300 rounded-lg"
                    value={selectedWeek || ''}
                    onChange={(e) => setSelectedWeek(Number(e.target.value))}
                  >
                    <option value="">Selecione a semana</option>
                    {availableWeeks.map(week => (
                      <option key={week} value={week}>Semana {week}</option>
                    ))}
                  </select>
                </div>
                <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                  <Download className="h-4 w-4" />
                  Exportar
                </button>
              </div>
            </motion.div>

            {reports.length === 0 ? (
              <motion.div 
                className="bg-white rounded-xl p-8 text-center border border-gray-200"
                variants={fadeInUp}
              >
                <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Nenhum Relatório Disponível</h2>
                <p className="text-gray-600 mb-6 max-w-lg mx-auto">
                  Os relatórios semanais são gerados pelo MCP toda sexta-feira para agentes do tipo Agenda e Conversão.
                </p>
                <div className="flex justify-center gap-4">
                  <button 
                    onClick={fetchData}
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Verificar Novamente
                  </button>
                  <button 
                    onClick={() => window.location.href = '/builder'}
                    className="bg-gray-100 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Criar Agente Avançado
                  </button>
                </div>
              </motion.div>
            ) : !selectedWeek ? (
              <motion.div 
                className="bg-white rounded-xl p-8 text-center border border-gray-200"
                variants={fadeInUp}
              >
                <Calendar className="h-16 w-16 text-blue-500 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Selecione uma Semana</h2>
                <p className="text-gray-600 mb-6 max-w-lg mx-auto">
                  Escolha uma semana no seletor acima para visualizar os relatórios correspondentes.
                </p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
                  {availableWeeks.slice(0, 4).map(week => (
                    <button 
                      key={week}
                      onClick={() => setSelectedWeek(week)}
                      className="bg-blue-50 hover:bg-blue-100 text-blue-700 px-4 py-3 rounded-lg transition-colors"
                    >
                      Semana {week}
                    </button>
                  ))}
                </div>
              </motion.div>
            ) : (
              <>
                {/* Key Metrics */}
                {metrics && (
                  <motion.div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8" variants={fadeInUp}>
                    {[
                      {
                        title: 'Total de Conversas',
                        value: metrics.totalConversations.toLocaleString(),
                        icon: MessageSquare,
                        color: 'blue'
                      },
                      {
                        title: 'Satisfação Média',
                        value: `${metrics.avgSatisfaction.toFixed(1)}%`,
                        icon: CheckCircle,
                        color: 'green'
                      },
                      {
                        title: 'Taxa de Resolução',
                        value: `${metrics.avgResolution.toFixed(1)}%`,
                        icon: Target,
                        color: 'purple'
                      },
                      {
                        title: 'Tempo de Resposta',
                        value: `${metrics.avgResponseTime.toFixed(1)}s`,
                        icon: Clock,
                        color: 'orange'
                      }
                    ].map((metric, index) => (
                      <div key={index} className="bg-white rounded-xl p-6 border border-gray-200">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-sm font-medium text-gray-500">{metric.title}</h3>
                          <div className={`p-2 rounded-lg ${
                            metric.color === 'blue' ? 'bg-blue-100' :
                            metric.color === 'green' ? 'bg-green-100' :
                            metric.color === 'purple' ? 'bg-purple-100' :
                            'bg-orange-100'
                          }`}>
                            <metric.icon className={`h-4 w-4 ${
                              metric.color === 'blue' ? 'text-blue-600' :
                              metric.color === 'green' ? 'text-green-600' :
                              metric.color === 'purple' ? 'text-purple-600' :
                              'text-orange-600'
                            }`} />
                          </div>
                        </div>
                        <div>
                          <p className="text-3xl font-bold text-gray-900 mb-1">{metric.value}</p>
                          <p className="text-sm text-gray-500">Semana {selectedWeek}, {selectedYear}</p>
                        </div>
                      </div>
                    ))}
                  </motion.div>
                )}

                {/* Agent Performance Table */}
                <motion.div className="bg-white rounded-xl border border-gray-200 mb-8" variants={fadeInUp}>
                  <div className="p-6 border-b border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900">Performance dos Agentes - Semana {selectedWeek}</h3>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Agente
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Tipo
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Conversas
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Satisfação
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Resolução
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Tempo Resp.
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {selectedWeekReports.map((report) => (
                          <tr key={report.agent_id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                                  <MessageSquare className="h-5 w-5 text-blue-600" />
                                </div>
                                <div>
                                  <p className="font-medium text-gray-900">{report.agent_name}</p>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                report.agent_type === 'agenda' 
                                  ? 'bg-purple-100 text-purple-800'
                                  : 'bg-green-100 text-green-800'
                              }`}>
                                {report.agent_type === 'agenda' ? 'Agenda' : 'Conversão'}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <p className="text-gray-900">{report.metrics.conversations_count.toLocaleString()}</p>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <span className="text-gray-900 mr-2">{report.metrics.satisfaction_rate}%</span>
                                <div className="w-16 bg-gray-200 rounded-full h-2">
                                  <div 
                                    className="bg-green-600 h-2 rounded-full"
                                    style={{ width: `${report.metrics.satisfaction_rate}%` }}
                                  ></div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <span className="text-gray-900 mr-2">{report.metrics.resolution_rate}%</span>
                                <div className="w-16 bg-gray-200 rounded-full h-2">
                                  <div 
                                    className="bg-blue-600 h-2 rounded-full"
                                    style={{ width: `${report.metrics.resolution_rate}%` }}
                                  ></div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <p className="text-gray-900">{report.metrics.average_response_time.toFixed(1)}s</p>
                            </td>
                          </tr>
                        ))}
                        {selectedWeekReports.length === 0 && (
                          <tr>
                            <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                              Nenhum relatório disponível para a semana {selectedWeek}
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </motion.div>

                {/* Insights Grid */}
                {selectedWeekReports.length > 0 && (
                  <motion.div className="grid grid-cols-1 lg:grid-cols-2 gap-6" variants={fadeInUp}>
                    {/* Positive Points */}
                    <div className="bg-white rounded-xl border border-gray-200 p-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <CheckCircle className="h-5 w-5 text-green-600" />
                        Pontos Positivos
                      </h3>
                      <div className="space-y-3">
                        {selectedWeekReports.flatMap(r => r.insights.positive_points)
                          .filter((point, index, self) => self.indexOf(point) === index) // Remove duplicates
                          .map((point, index) => (
                            <div key={index} className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
                              <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                              <p className="text-sm text-green-800">{point}</p>
                            </div>
                          ))
                        }
                      </div>
                    </div>

                    {/* Improvement Areas */}
                    <div className="bg-white rounded-xl border border-gray-200 p-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <TrendingUp className="h-5 w-5 text-blue-600" />
                        Áreas de Melhoria
                      </h3>
                      <div className="space-y-3">
                        {selectedWeekReports.flatMap(r => r.insights.improvement_areas)
                          .filter((area, index, self) => self.indexOf(area) === index) // Remove duplicates
                          .map((area, index) => (
                            <div key={index} className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                              <TrendingUp className="h-4 w-4 text-blue-600 mt-0.5" />
                              <p className="text-sm text-blue-800">{area}</p>
                            </div>
                          ))
                        }
                      </div>
                    </div>
                  </motion.div>
                )}
              </>
            )}
          </motion.div>
        </main>
      </div>
    </div>
  );
};

export default Analytics;