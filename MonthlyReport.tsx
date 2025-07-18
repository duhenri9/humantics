import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart3, 
  ExternalLink, 
  Star, 
  TrendingUp, 
  MessageSquare, 
  Clock, 
  Users,
  CheckCircle,
  Calendar,
  Download,
  Settings,
  AlertCircle,
  RefreshCw
} from 'lucide-react';
import { useClient } from '../../context/ClientContext';
import { showSuccess, showError } from '../../utils/toast';
import { getLatestAgentReport, getUserReports } from '../../services/mcpService';
// Define MCPReport interface locally since it's no longer in supabase lib
interface MCPReport {
  id: string;
  agentType: 'essencial' | 'agenda' | 'conversao';
  reportMonth: string;
  metricsData: any;
  generatedAt: string;
  userId: string;
}
import { getWebhookUrl } from '../../utils/deployConfig';

const MonthlyReport = () => {
  const { clienteId, clientData } = useClient();
  const [isLoading, setIsLoading] = useState(true);
  const [reports, setReports] = useState<MCPReport[]>([]);
  const [selectedReport, setSelectedReport] = useState<MCPReport | null>(null);

  useEffect(() => {
    fetchReports();
  }, [clienteId]);

  const fetchReports = async () => {
    setIsLoading(true);
    try {
      if (clienteId) {
        const userReports = await getUserReports(clienteId);
        setReports(userReports);
        
        if (userReports.length > 0) {
          setSelectedReport(userReports[0]);
        }
      }
    } catch (error) {
      console.error('Error fetching reports:', error);
      showError('Erro ao carregar relatórios. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRevisaoAgente = async () => {
    if (!clienteId) {
      showError('ID do cliente não encontrado. Faça login novamente.');
      return;
    }

    try {
      // Obter URL do webhook
      const webhookUrl = getWebhookUrl('REVISAO_AGENTE');
      
      // Enviar dados para o webhook
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          cliente_id: clienteId
        }),
      }).catch(() => {
        // Fallback apenas em desenvolvimento
        if (import.meta.env.DEV) {
          return { ok: true };
        }
        throw new Error('Erro na conexão com o servidor');
      });

      if (response.ok) {
        showSuccess('Solicitação de revisão enviada com sucesso! Nossa equipe entrará em contato para agendar a análise.');
      } else {
        throw new Error('Erro ao solicitar revisão');
      }
    } catch (error) {
      showError('Erro ao solicitar revisão. Tente novamente.');
      console.error('Error requesting agent review:', error);
    }
  };

  const handleExportReport = () => {
    if (!selectedReport) {
      showError('Nenhum relatório selecionado para exportar.');
      return;
    }
    
    // Simular export de relatório
    showSuccess('Relatório exportado com sucesso! O download iniciará em breve.');
    
    // Criar conteúdo CSV
    const metrics = selectedReport.metrics;
    const csvContent = `data:text/csv;charset=utf-8,
Métrica,Valor,Período
Conversas Iniciadas,${metrics.conversations_count},Semana ${selectedReport.week_number}
Taxa de Resolução,${metrics.resolution_rate}%,Semana ${selectedReport.week_number}
Tempo Médio de Resposta,${metrics.average_response_time}s,Semana ${selectedReport.week_number}
Satisfação do Cliente,${metrics.satisfaction_rate}%,Semana ${selectedReport.week_number}`;

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `relatorio-agente-semana-${selectedReport.week_number}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleScheduleMeeting = () => {
    // Abrir calendário para agendamento
    window.open('https://calendly.com/humantic/revisao-agente', '_blank', 'noopener,noreferrer');
  };

  const handleConfigureAlerts = () => {
    showSuccess('Funcionalidade de alertas personalizados será implementada em breve!');
  };

  const handleRefreshReports = () => {
    fetchReports();
  };

  // Verificar se o cliente tem agentes elegíveis para relatórios (agenda ou conversão)
  const hasEligibleAgents = clientData && (clientData.plano === 'agenda' || clientData.plano === 'conversao');

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="bg-white rounded-xl border border-gray-200 p-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Relatórios e Analytics</h2>
              <p className="text-gray-600 text-lg">Carregando dados...</p>
            </div>
          </div>
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!hasEligibleAgents) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-6xl mx-auto space-y-8"
      >
        <div className="bg-white rounded-xl border border-gray-200 p-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Relatórios e Analytics</h2>
              <p className="text-gray-600 text-lg">Acompanhe a performance do seu agente em detalhes</p>
            </div>
          </div>
          
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 text-center">
            <AlertCircle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Relatórios Não Disponíveis</h3>
            <p className="text-gray-600 mb-4">
              Os relatórios semanais estão disponíveis apenas para os planos Agenda e Conversão.
              Seu plano atual é <strong>{clientData?.plano}</strong>.
            </p>
            <div className="mt-4">
              <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                Fazer Upgrade de Plano
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  if (reports.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-6xl mx-auto space-y-8"
      >
        <div className="bg-white rounded-xl border border-gray-200 p-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Relatórios e Analytics</h2>
              <p className="text-gray-600 text-lg">Acompanhe a performance do seu agente em detalhes</p>
            </div>
            <button 
              onClick={handleRefreshReports}
              className="flex items-center gap-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors"
            >
              <RefreshCw className="h-4 w-4" />
              Atualizar
            </button>
          </div>
          
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 text-center">
            <Calendar className="h-12 w-12 text-blue-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Nenhum Relatório Disponível</h3>
            <p className="text-gray-600 mb-4">
              Os relatórios semanais são gerados toda sexta-feira pelo MCP.
              Ainda não temos relatórios disponíveis para seus agentes.
            </p>
            <p className="text-sm text-gray-500">
              O primeiro relatório será gerado na próxima sexta-feira.
            </p>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-6xl mx-auto space-y-8"
    >
      {/* Header */}
      <div className="bg-white rounded-xl border border-gray-200 p-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Relatórios e Analytics</h2>
            <p className="text-gray-600 text-lg">Acompanhe a performance do seu agente em detalhes</p>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={handleRefreshReports}
              className="flex items-center gap-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors"
            >
              <RefreshCw className="h-4 w-4" />
              Atualizar
            </button>
            <div className="text-right">
              <p className="text-sm text-gray-500">Último update</p>
              <p className="font-semibold text-gray-900">
                {selectedReport ? new Date(selectedReport.report_date).toLocaleDateString('pt-BR') : 'N/A'}
              </p>
            </div>
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
          </div>
        </div>

        {/* Seletor de Relatório */}
        {reports.length > 1 && (
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Selecionar Relatório
            </label>
            <select 
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={selectedReport?.agent_id || ''}
              onChange={(e) => {
                const selected = reports.find(r => r.agent_id === e.target.value);
                if (selected) setSelectedReport(selected);
              }}
            >
              {reports.map((report) => (
                <option key={report.agent_id} value={report.agent_id}>
                  {report.agent_name} - Semana {report.week_number} ({new Date(report.report_date).toLocaleDateString('pt-BR')})
                </option>
              ))}
            </select>
          </div>
        )}

        {selectedReport && (
          <>
            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {[
                { 
                  label: 'Conversas Iniciadas', 
                  value: selectedReport.metrics.conversations_count.toLocaleString(), 
                  icon: MessageSquare, 
                  color: 'blue', 
                  change: '+12%' 
                },
                { 
                  label: 'Taxa de Resolução', 
                  value: `${selectedReport.metrics.resolution_rate}%`, 
                  icon: CheckCircle, 
                  color: 'green', 
                  change: '+3%' 
                },
                { 
                  label: 'Tempo Médio de Resposta', 
                  value: `${selectedReport.metrics.average_response_time.toFixed(1)}s`, 
                  icon: Clock, 
                  color: 'purple', 
                  change: '-0.2s',
                  context: 'Excelente performance!'
                },
                { 
                  label: 'Satisfação do Cliente', 
                  value: `${selectedReport.metrics.satisfaction_rate}%`, 
                  icon: Star, 
                  color: 'yellow', 
                  change: '+0.1' 
                }
              ].map((stat, index) => (
                <motion.div
                  key={index}
                  className="p-6 bg-gray-50 rounded-xl border border-gray-100"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className={`p-2 rounded-lg ${
                      stat.color === 'blue' ? 'bg-blue-100' :
                      stat.color === 'green' ? 'bg-green-100' :
                      stat.color === 'purple' ? 'bg-purple-100' :
                      'bg-yellow-100'
                    }`}>
                      <stat.icon className={`h-5 w-5 ${
                        stat.color === 'blue' ? 'text-blue-600' :
                        stat.color === 'green' ? 'text-green-600' :
                        stat.color === 'purple' ? 'text-purple-600' :
                        'text-yellow-600'
                      }`} />
                    </div>
                    <span className={`text-sm font-medium ${
                      stat.change.startsWith('+') ? 'text-green-600' : 
                      stat.change.startsWith('-') && stat.label.includes('Tempo') ? 'text-green-600' :
                      'text-red-600'
                    }`}>
                      {stat.change}
                    </span>
                  </div>
                  <p className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</p>
                  <p className="text-sm text-gray-600">{stat.label}</p>
                  {stat.context && (
                    <p className="text-xs text-green-600 font-medium mt-1">{stat.context}</p>
                  )}
                </motion.div>
              ))}
            </div>

            {/* Dashboard Access */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-6 border border-gray-200 rounded-xl hover:shadow-lg transition-all group">
                <div className="flex items-center gap-4 mb-4">
                  <div className="bg-blue-100 p-3 rounded-xl group-hover:bg-blue-200 transition-colors">
                    <BarChart3 className="h-8 w-8 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">Dashboard Completo</h3>
                    <p className="text-gray-600">Metabase Analytics</p>
                  </div>
                </div>
                <p className="text-sm text-gray-500 mb-4">
                  Acesse relatórios detalhados, gráficos interativos e análises avançadas da performance do seu agente.
                </p>
                <p className="text-sm text-gray-600 mb-4 leading-relaxed">
                  O dashboard do Metabase oferece visualizações interativas com filtros personalizáveis, 
                  comparações históricas e métricas em tempo real. Você pode criar seus próprios relatórios 
                  e acompanhar tendências específicas do seu negócio.
                </p>
                <button
                  onClick={() => window.open(`https://metabase.humantic.com.br/dashboard/cliente/${clienteId}`, '_blank', 'noopener,noreferrer')}
                  className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 font-semibold"
                >
                  <ExternalLink className="h-4 w-4" />
                  Abrir Dashboard
                </button>
              </div>

              <div className="p-6 border border-gray-200 rounded-xl hover:shadow-lg transition-all group">
                <div className="flex items-center gap-4 mb-4">
                  <div className="bg-purple-100 p-3 rounded-xl group-hover:bg-purple-200 transition-colors">
                    <Settings className="h-8 w-8 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">Revisão Mensal</h3>
                    <p className="text-gray-600">Otimização de Performance</p>
                  </div>
                </div>
                <p className="text-sm text-gray-500 mb-4">
                  Solicite uma análise detalhada do comportamento do seu agente e receba sugestões de melhorias.
                </p>
                <button
                  onClick={handleRevisaoAgente}
                  className="w-full bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center gap-2 font-semibold"
                >
                  <Star className="h-4 w-4" />
                  Solicitar Revisão
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {selectedReport && (
        <>
          {/* Performance Overview */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Weekly Trend Chart */}
            <div className="bg-white rounded-xl border border-gray-200 p-8">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Tendência Semanal</h3>
              
              {/* Chart */}
              <div className="mb-6">
                <div className="h-64 flex items-end justify-between gap-4">
                  {selectedReport.metrics.weekly_trend.map((day, index) => (
                    <div key={index} className="flex-1 flex flex-col items-center">
                      <div className="w-full flex gap-1 items-end h-48">
                        {/* Conversations Bar */}
                        <div className="flex-1 flex flex-col items-center">
                          <div 
                            className="w-full bg-blue-600 rounded-t-lg transition-all hover:bg-blue-700 relative group"
                            style={{ 
                              height: `${(day.conversations / Math.max(...selectedReport.metrics.weekly_trend.map(d => d.conversations))) * 100}%`,
                              minHeight: '8px'
                            }}
                          >
                            <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                              {day.conversations}
                            </div>
                          </div>
                        </div>
                        
                        {/* Satisfaction Bar */}
                        <div className="flex-1 flex flex-col items-center">
                          <div 
                            className="w-full bg-green-600 rounded-t-lg transition-all hover:bg-green-700 relative group"
                            style={{ 
                              height: `${(day.satisfaction / 5) * 100}%`,
                              minHeight: '8px'
                            }}
                          >
                            <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                              {day.satisfaction.toFixed(1)}/5
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <span className="text-xs text-gray-500 mt-2 font-medium">{day.day}</span>
                    </div>
                  ))}
                </div>
                
                {/* Legend */}
                <div className="flex justify-center gap-6 mt-4">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-blue-600 rounded"></div>
                    <span className="text-sm text-gray-600">Conversas</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-600 rounded"></div>
                    <span className="text-sm text-gray-600">Satisfação</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Top Intents */}
            <div className="bg-white rounded-xl border border-gray-200 p-8">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Principais Intenções</h3>
              <div className="space-y-4">
                {selectedReport.metrics.top_intents.map((item, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                        <MessageSquare className="h-4 w-4 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{item.intent}</p>
                        <p className="text-sm text-gray-500">{item.count} conversas</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-20 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full transition-all"
                          style={{ width: `${item.percentage}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium text-gray-900 w-12 text-right">
                        {item.percentage.toFixed(1)}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Additional Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <Download className="h-6 w-6 text-green-600" />
                <h3 className="font-semibold text-green-900">Exportar Dados</h3>
              </div>
              <p className="text-sm text-green-800 mb-4">
                Baixe relatórios em CSV ou PDF para análises offline.
              </p>
              <button 
                onClick={handleExportReport}
                className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
              >
                Exportar Relatório
              </button>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <Calendar className="h-6 w-6 text-blue-600" />
                <h3 className="font-semibold text-blue-900">Agendar Reunião</h3>
              </div>
              <p className="text-sm text-blue-800 mb-4">
                Agende uma reunião para discutir os resultados.
              </p>
              <button 
                onClick={handleScheduleMeeting}
                className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
              >
                Agendar Reunião
              </button>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <AlertCircle className="h-6 w-6 text-purple-600" />
                <h3 className="font-semibold text-purple-900">Alertas Personalizados</h3>
              </div>
              <p className="text-sm text-purple-800 mb-4">
                Configure alertas para métricas importantes.
              </p>
              <button 
                onClick={handleConfigureAlerts}
                className="w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium"
              >
                Configurar Alertas
              </button>
            </div>
          </div>

          {/* Insights */}
          <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-xl p-8 text-white">
            <h3 className="text-2xl font-bold mb-4">Insights da Semana</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-2 text-green-400">✅ Pontos Positivos</h4>
                <ul className="space-y-2 text-sm text-gray-300">
                  {selectedReport.insights.positive_points.map((point, index) => (
                    <li key={index}>• {point}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2 text-yellow-400">⚠️ Oportunidades de Melhoria</h4>
                <ul className="space-y-2 text-sm text-gray-300">
                  {selectedReport.insights.improvement_areas.map((area, index) => (
                    <li key={index}>• {area}</li>
                  ))}
                </ul>
              </div>
            </div>
            
            <div className="mt-6 pt-6 border-t border-gray-700">
              <h4 className="font-semibold mb-2 text-blue-400">💡 Recomendações</h4>
              <ul className="space-y-2 text-sm text-gray-300">
                {selectedReport.insights.recommendations.map((rec, index) => (
                  <li key={index}>• {rec}</li>
                ))}
              </ul>
            </div>
          </div>
        </>
      )}
    </motion.div>
  );
};

export default MonthlyReport;