import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import { 
  BookOpen, 
  UserCog, 
  Calendar, 
  Target, 
  CheckSquare, 
  Settings, 
  Code, 
  Database, 
  MessageSquare, 
  Zap,
  FileText,
  Info,
  ChevronRight,
  ChevronDown,
  Shield,
  Network,
  Brain,
  Clock,
  AlertTriangle,
  CheckCircle,
  ExternalLink
} from 'lucide-react';

interface LibrarySection {
  id: string;
  title: string;
  icon: React.ComponentType<any>;
  description: string;
  content: React.ReactNode;
}

interface AgentChecklist {
  id: string;
  name: string;
  description: string;
  items: string[];
}

export default function AdminLibrary() {
  const [activeSection, setActiveSection] = useState<string>('overview');
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['overview']));

  const toggleSection = (sectionId: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(sectionId)) {
      newExpanded.delete(sectionId);
    } else {
      newExpanded.add(sectionId);
    }
    setExpandedSections(newExpanded);
    setActiveSection(sectionId);
  };

  const agentChecklists: Record<string, AgentChecklist> = {
    essencial: {
      id: 'essencial',
      name: 'Agente Essencial',
      description: 'Checklist para criação e manutenção do Agente Essencial',
      items: [
        'Configurar protocolo MCP básico',
        'Implementar fluxos de conversa padrão',
        'Configurar reconhecimento de intenções básicas',
        'Integrar com WhatsApp Business API',
        'Definir tempo de resposta (< 2s)',
        'Implementar tratamento de erros básico',
        'Testar cenários de uso comum',
        'Configurar fallback para atendimento humano'
      ]
    },
    agenda: {
      id: 'agenda',
      name: 'Agente Agenda',
      description: 'Checklist para criação e manutenção do Agente de Agenda',
      items: [
        'Configurar protocolo MCP básico',
        'Implementar fluxos de conversa para agendamento',
        'Configurar reconhecimento de intenções de agenda',
        'Integrar com WhatsApp Business API',
        'Integrar com Google Calendar API',
        'Configurar fusos horários',
        'Implementar validação de datas/horários',
        'Configurar notificações e lembretes',
        'Testar cenários de agendamento complexos',
        'Implementar cancelamento e reagendamento'
      ]
    },
    conversao: {
      id: 'conversao',
      name: 'Agente Conversão',
      description: 'Checklist para criação e manutenção do Agente de Conversão',
      items: [
        'Configurar protocolo MCP básico',
        'Implementar fluxos de conversa para vendas',
        'Configurar reconhecimento de intenções de conversão',
        'Integrar com WhatsApp Business API',
        'Integrar com Google Calendar API',
        'Integrar com sistema CRM',
        'Implementar sistema de pontuação de leads',
        'Configurar qualificação automática',
        'Implementar follow-up automatizado',
        'Configurar métricas de conversão',
        'Testar funis de vendas',
        'Implementar handoff para vendedores'
      ]
    }
  };

  const sections: LibrarySection[] = [
    {
      id: 'overview',
      title: 'Visão Geral',
      icon: BookOpen,
      description: 'Arquitetura geral do sistema de agentes HumanTic',
      content: (
        <div className="space-y-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-blue-900 mb-3">Arquitetura do Sistema</h3>
            <p className="text-blue-800 mb-4">
              O sistema HumanTic utiliza três tipos de agentes conversacionais baseados no protocolo MCP 
              (Message Control Protocol) com integração Anthropic para processamento de linguagem natural.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white rounded-lg p-4 border border-blue-200">
                <UserCog className="h-8 w-8 text-blue-600 mb-2" />
                <h4 className="font-semibold text-blue-900">Agente Essencial</h4>
                <p className="text-sm text-blue-700">Atendimento automatizado básico</p>
              </div>
              <div className="bg-white rounded-lg p-4 border border-blue-200">
                <Calendar className="h-8 w-8 text-purple-600 mb-2" />
                <h4 className="font-semibold text-blue-900">Agente Agenda</h4>
                <p className="text-sm text-blue-700">Gestão de agendamentos</p>
              </div>
              <div className="bg-white rounded-lg p-4 border border-blue-200">
                <Target className="h-8 w-8 text-green-600 mb-2" />
                <h4 className="font-semibold text-blue-900">Agente Conversão</h4>
                <p className="text-sm text-blue-700">Qualificação e vendas</p>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Componentes Principais</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Network className="h-5 w-5 text-gray-600" />
                <span><strong>Protocolo MCP:</strong> Model Context Protocol da Anthropic</span>
              </div>
              <div className="flex items-center space-x-3">
                <Brain className="h-5 w-5 text-gray-600" />
                <span><strong>Memória Anthropic:</strong> Sistema de contexto de longo prazo</span>
              </div>
              <div className="flex items-center space-x-3">
                <MessageSquare className="h-5 w-5 text-gray-600" />
                <span><strong>WhatsApp API:</strong> Integração para mensagens</span>
              </div>
              <div className="flex items-center space-x-3">
                <Database className="h-5 w-5 text-gray-600" />
                <span><strong>PostgreSQL:</strong> Armazenamento de dados e configurações</span>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'mcp-protocol',
      title: 'Biblioteca Técnica de Agentes (MCP)',
      icon: Network,
      description: 'Documentação completa do Model Context Protocol da Anthropic e configuração de agentes via n8n - ATUALIZADO',
      content: (
        <div className="space-y-6">
          {/* Introdução ao Protocolo MCP - Seção Revisada */}
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-purple-900 mb-3">🔄 Model Context Protocol (MCP) - Introdução ATUALIZADA</h3>
            <p className="text-purple-800 mb-4">
              ⚡ <strong>NOVO:</strong> O MCP é um protocolo aberto da Anthropic que padroniza a comunicação entre aplicações de IA e ferramentas/dados externos. 
              Funciona como um "USB-C para IA" - um conector universal que permite integração padronizada.
            </p>
            
            <div className="space-y-4">
              <div className="bg-white rounded-lg p-4 border border-purple-200">
                <h4 className="font-semibold text-purple-900 mb-2">SDKs Oficiais e Adoção</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h5 className="font-medium text-purple-800 mb-2">SDKs Disponíveis:</h5>
                    <ul className="space-y-1 text-sm text-purple-700">
                      <li>• TypeScript/JavaScript (oficial)</li>
                      <li>• Python (oficial)</li>
                      <li>• Rust (comunidade)</li>
                      <li>• Go (comunidade)</li>
                    </ul>
                  </div>
                  <div>
                    <h5 className="font-medium text-purple-800 mb-2">Plataformas que Adotaram:</h5>
                    <ul className="space-y-1 text-sm text-purple-700">
                      <li>• Replit (integração nativa)</li>
                      <li>• OpenAI (suporte experimental)</li>
                      <li>• Google (desenvolvimento ativo)</li>
                      <li>• Claude Desktop (suporte oficial)</li>
                    </ul>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg p-4 border border-purple-200">
                <h4 className="font-semibold text-purple-900 mb-2">Arquitetura MCP</h4>
                <div className="space-y-3">
                  <div><strong>MCP Hosts:</strong> Aplicações como Claude Desktop, IDEs ou ferramentas AI</div>
                  <div><strong>MCP Clients:</strong> Clientes do protocolo mantendo conexões 1:1 com servidores</div>
                  <div><strong>MCP Servers:</strong> Expõem fontes de dados, ferramentas e capacidades</div>
                  <div><strong>Fundação:</strong> JSON-RPC 2.0 para comunicação padronizada</div>
                </div>
              </div>
            </div>
          </div>

          {/* Configurar Servidor MCP no n8n */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-blue-900 mb-3">Configurar Servidor MCP no n8n</h3>
            
            <div className="space-y-4">
              <div className="bg-white rounded-lg p-4 border border-blue-200">
                <h4 className="font-semibold text-blue-900 mb-3">Passo 1: Webhook Principal</h4>
                <p className="text-blue-800 mb-3">Criar webhook geral para entrada do MCP:</p>
                <div className="bg-gray-900 text-green-400 p-3 rounded font-mono text-sm overflow-x-auto">
                  <div>URL: https://n8n.humantic.com.br/webhook/mcp/entrada</div>
                  <div>Método: POST</div>
                  <div>Content-Type: application/json</div>
                </div>
              </div>

              <div className="bg-white rounded-lg p-4 border border-blue-200">
                <h4 className="font-semibold text-blue-900 mb-3">Passo 2: Padrão Switch para Roteamento</h4>
                <p className="text-blue-800 mb-3">Configurar nó Switch no n8n para rotear por tipo de agente:</p>
                <div className="bg-gray-900 text-green-400 p-3 rounded font-mono text-sm overflow-x-auto">
{`{
  "rules": [
    {
      "condition": "{{ $json.agent_type === 'essencial' }}",
      "output": "mcp_essencial"
    },
    {
      "condition": "{{ $json.agent_type === 'inteligente' }}",
      "output": "mcp_inteligente"
    },
    {
      "condition": "{{ $json.agent_type === 'conversao' }}",
      "output": "mcp_conversao"
    }
  ]
}`}
                </div>
              </div>

              <div className="bg-white rounded-lg p-4 border border-blue-200">
                <h4 className="font-semibold text-blue-900 mb-3">Passo 3: MCP Connector</h4>
                <p className="text-blue-800 mb-3">Habilitar conexão entre n8n e Claude/MCP client:</p>
                <div className="bg-gray-100 p-3 rounded text-sm">
                  <p><strong>Instalar pacote MCP:</strong> <code>npm install @modelcontextprotocol/sdk</code></p>
                  <p><strong>Configurar endpoint:</strong> Expor servidor MCP na porta 3001</p>
                  <p><strong>Autenticação:</strong> Usar token JWT para segurança</p>
                </div>
              </div>
            </div>
          </div>

          {/* Fluxos MCP por Tipo de Agente */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-green-900 mb-3">Fluxos MCP por Tipo de Agente</h3>
            
            <div className="space-y-4">
              <div className="bg-white rounded-lg p-4 border border-green-200">
                <h4 className="font-semibold text-green-900 mb-3">A) Servidor MCP Geral</h4>
                <div className="bg-gray-900 text-green-400 p-3 rounded font-mono text-sm overflow-x-auto">
{`// Estrutura JSON-RPC 2.0
{
  "jsonrpc": "2.0",
  "method": "tools/call",
  "params": {
    "name": "process_message",
    "arguments": {
      "agent_type": "essencial|inteligente|conversao",
      "message": "Mensagem do usuário",
      "context": {
        "client_id": "uuid",
        "session_id": "uuid",
        "metadata": {}
      }
    }
  },
  "id": 1
}`}
                </div>
              </div>

              <div className="bg-white rounded-lg p-4 border border-green-200">
                <h4 className="font-semibold text-green-900 mb-3">B) Fluxos Específicos</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="border border-green-300 rounded p-3">
                    <h5 className="font-medium text-green-800 mb-2">/mcp_essencial</h5>
                    <ul className="text-sm text-green-700 space-y-1">
                      <li>• Atendimento básico</li>
                      <li>• FAQ automático</li>
                      <li>• Escalação simples</li>
                    </ul>
                  </div>
                  <div className="border border-green-300 rounded p-3">
                    <h5 className="font-medium text-green-800 mb-2">/mcp_inteligente</h5>
                    <ul className="text-sm text-green-700 space-y-1">
                      <li>• Descoberta dinâmica</li>
                      <li>• Contexto avançado</li>
                      <li>• Ferramentas externas</li>
                    </ul>
                  </div>
                  <div className="border border-green-300 rounded p-3">
                    <h5 className="font-medium text-green-800 mb-2">/mcp_conversao</h5>
                    <ul className="text-sm text-green-700 space-y-1">
                      <li>• Qualificação leads</li>
                      <li>• Pontuação dinâmica</li>
                      <li>• CRM integration</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg p-4 border border-green-200">
                <h4 className="font-semibold text-green-900 mb-3">C) Validação de Payload</h4>
                <div className="bg-gray-900 text-green-400 p-3 rounded font-mono text-sm overflow-x-auto">
{`// Validação no n8n
const validateMCPPayload = (payload) => {
  const required = ['jsonrpc', 'method', 'params', 'id'];
  const missing = required.filter(field => !payload[field]);
  
  if (missing.length > 0) {
    throw new Error(\`Campos obrigatórios: \${missing.join(', ')}\`);
  }
  
  if (payload.jsonrpc !== '2.0') {
    throw new Error('Versão JSON-RPC deve ser 2.0');
  }
  
  return true;
};`}
                </div>
              </div>

              <div className="bg-white rounded-lg p-4 border border-green-200">
                <h4 className="font-semibold text-green-900 mb-3">D) Conexão Dinâmica com Dados do Cliente</h4>
                <div className="bg-gray-900 text-green-400 p-3 rounded font-mono text-sm overflow-x-auto">
{`// Configuração dinâmica por cliente
{
  "client_config": {
    "database_connection": "{{ $env.SUPABASE_URL }}",
    "custom_prompts": "{{ $json.client_data.prompts }}",
    "integrations": {
      "whatsapp": "{{ $json.client_data.whatsapp_token }}",
      "calendar": "{{ $json.client_data.calendar_api }}",
      "crm": "{{ $json.client_data.crm_endpoint }}"
    }
  }
}`}
                </div>
              </div>
            </div>
          </div>

          {/* Agente Inteligente e Conversão Avançado */}
          <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-indigo-900 mb-3">Agente Inteligente e Conversão Avançado</h3>
            
            <div className="space-y-4">
              <div className="bg-white rounded-lg p-4 border border-indigo-200">
                <h4 className="font-semibold text-indigo-900 mb-3">MCP Connector para Ferramentas Externas</h4>
                <p className="text-indigo-800 mb-3">Como usar o MCP connector para invocar ferramentas externas e buscar contexto:</p>
                <div className="bg-gray-900 text-green-400 p-3 rounded font-mono text-sm overflow-x-auto">
{`// Descoberta dinâmica de ferramentas
{
  "method": "tools/list",
  "params": {},
  "response": {
    "tools": [
      {
        "name": "search_knowledge_base",
        "description": "Buscar na base de conhecimento",
        "inputSchema": {
          "type": "object",
          "properties": {
            "query": {"type": "string"},
            "client_id": {"type": "string"}
          }
        }
      },
      {
        "name": "qualify_lead",
        "description": "Qualificar lead automaticamente",
        "inputSchema": {
          "type": "object",
          "properties": {
            "contact_data": {"type": "object"},
            "interaction_history": {"type": "array"}
          }
        }
      }
    ]
  }
}`}
                </div>
              </div>

              <div className="bg-white rounded-lg p-4 border border-indigo-200">
                <h4 className="font-semibold text-indigo-900 mb-3">Workflows com Fallback e Roteamento</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h5 className="font-medium text-indigo-800 mb-2">Padrão Fallback:</h5>
                    <div className="bg-gray-100 p-3 rounded text-sm">
                      <p>1. Tentativa primária via MCP</p>
                      <p>2. Fallback para API direta</p>
                      <p>3. Resposta padrão se falhar</p>
                      <p>4. Log de erro para análise</p>
                    </div>
                  </div>
                  <div>
                    <h5 className="font-medium text-indigo-800 mb-2">Roteamento Inteligente:</h5>
                    <div className="bg-gray-100 p-3 rounded text-sm">
                      <p>1. Análise da intenção do usuário</p>
                      <p>2. Seleção da ferramenta adequada</p>
                      <p>3. Execução via MCP connector</p>
                      <p>4. Validação da resposta</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg p-4 border border-indigo-200">
                <h4 className="font-semibold text-indigo-900 mb-3">Supersets para Busca de Contexto</h4>
                <div className="bg-gray-900 text-green-400 p-3 rounded font-mono text-sm overflow-x-auto">
{`// Superset de contexto para agentes avançados
{
  "context_superset": {
    "client_knowledge": {
      "products": "{{ $json.client_data.products }}",
      "services": "{{ $json.client_data.services }}",
      "policies": "{{ $json.client_data.policies }}"
    },
    "interaction_history": {
      "recent_conversations": "{{ $json.history.recent }}",
      "user_preferences": "{{ $json.user.preferences }}",
      "behavioral_patterns": "{{ $json.analytics.patterns }}"
    },
    "external_context": {
      "calendar_availability": "MCP:calendar/check_availability",
      "crm_lead_score": "MCP:crm/get_lead_score",
      "knowledge_search": "MCP:kb/semantic_search"
    }
  }
}`}
                </div>
              </div>
            </div>
          </div>

          {/* Boas Práticas e Segurança */}
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-red-900 mb-3">Boas Práticas & Segurança</h3>
            
            <div className="space-y-4">
              <div className="bg-white rounded-lg p-4 border border-red-200">
                <h4 className="font-semibold text-red-900 mb-3">Segurança MCP</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h5 className="font-medium text-red-800 mb-2">Prevenção de Prompt Injection:</h5>
                    <ul className="space-y-1 text-sm text-red-700">
                      <li>• Sanitizar inputs do usuário</li>
                      <li>• Validar estrutura JSON-RPC</li>
                      <li>• Limitar escopo de ferramentas</li>
                      <li>• Implementar rate limiting</li>
                    </ul>
                  </div>
                  <div>
                    <h5 className="font-medium text-red-800 mb-2">Controle de Acesso:</h5>
                    <ul className="space-y-1 text-sm text-red-700">
                      <li>• Autenticação por token JWT</li>
                      <li>• Autorização por cliente</li>
                      <li>• Logs de auditoria</li>
                      <li>• Criptografia de dados sensíveis</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg p-4 border border-red-200">
                <h4 className="font-semibold text-red-900 mb-3">Modularidade e Escalabilidade</h4>
                <div className="space-y-3">
                  <div><strong>Padrão Mediator:</strong> Coordenação central de agentes via MCP hub</div>
                  <div><strong>Padrão Broker:</strong> Roteamento inteligente de mensagens entre serviços</div>
                  <div><strong>Publish-Subscribe:</strong> Eventos assíncronos para notificações</div>
                  <div><strong>Microservices:</strong> Separação de responsabilidades por domínio</div>
                </div>
              </div>

              <div className="bg-white rounded-lg p-4 border border-red-200">
                <h4 className="font-semibold text-red-900 mb-3">Monitoramento e Logs</h4>
                <div className="bg-gray-900 text-green-400 p-3 rounded font-mono text-sm overflow-x-auto">
{`// Implementação de logs no Supabase
const logMCPInteraction = async (interaction) => {
  await supabase.from('mcp_logs').insert({
    client_id: interaction.client_id,
    agent_type: interaction.agent_type,
    method: interaction.method,
    success: interaction.success,
    response_time: interaction.response_time,
    error_message: interaction.error_message,
    timestamp: new Date().toISOString()
  });
};`}
                </div>
              </div>

              <div className="bg-white rounded-lg p-4 border border-red-200">
                <h4 className="font-semibold text-red-900 mb-3">Descoberta Dinâmica de Ferramentas</h4>
                <p className="text-red-800 mb-3">Implementar descoberta automática para máxima flexibilidade:</p>
                <div className="bg-gray-100 p-3 rounded text-sm">
                  <p><strong>Registry Pattern:</strong> Registro automático de ferramentas</p>
                  <p><strong>Health Checks:</strong> Verificação de disponibilidade</p>
                  <p><strong>Versioning:</strong> Suporte a múltiplas versões de API</p>
                  <p><strong>Auto-configuration:</strong> Configuração automática baseada em cliente</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'whatsapp-automation',
      title: 'Exemplo de Automação: WhatsApp',
      icon: MessageSquare,
      description: 'Envio de link de teste do Agente Essencial via WhatsApp usando n8n',
      content: (
        <div className="space-y-6">
          <div className="bg-green-50 border border-green-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-green-900 mb-3">📲 Envio de link de teste do Agente Essencial via WhatsApp (usando n8n)</h3>
            <p className="text-green-800 mb-4">
              Essa automação serve para enviar automaticamente ao cliente o link de teste do seu agente (criado via servidor MCP) pelo WhatsApp. 
              Ideal para fase de MVP/Testes com Agente Essencial.
            </p>
            
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-4">
              <div className="flex items-center mb-2">
                <AlertTriangle className="h-5 w-5 text-amber-600 mr-2" />
                <h4 className="font-semibold text-amber-900">Observações Importantes</h4>
              </div>
              <ul className="space-y-1 text-amber-800 text-sm">
                <li>• A automação funciona com qualquer agente Essencial que tenha test_url gerado pelo Replit</li>
                <li>• Essa lógica pode ser replicada para enviar por e-mail ou outros canais</li>
                <li>• Ideal para uso em campanhas de pré-venda, beta testers ou provas de conceito com leads qualificados</li>
              </ul>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-blue-900 mb-4">🔧 Passo a passo no n8n</h3>
            
            <div className="space-y-6">
              {/* Step 1 */}
              <div className="bg-white rounded-lg p-4 border border-blue-200">
                <h4 className="font-semibold text-blue-900 mb-3 flex items-center">
                  <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm mr-2">1</span>
                  Trigger HTTP
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-blue-800 mb-2"><strong>Configuração:</strong></p>
                    <ul className="space-y-1 text-sm text-blue-700">
                      <li>• <strong>Tipo:</strong> Webhook</li>
                      <li>• <strong>Método:</strong> POST</li>
                      <li>• <strong>Endpoint:</strong> /api/teste-agente</li>
                    </ul>
                  </div>
                  <div>
                    <p className="text-blue-800 mb-2"><strong>Campos esperados no body:</strong></p>
                    <div className="bg-gray-900 text-green-400 p-3 rounded text-xs font-mono">
{`{
  "nome": "João",
  "id_conta": "abc123", 
  "negocio": "Clínica XYZ",
  "whatsapp": "+5511999999999"
}`}
                    </div>
                  </div>
                </div>
              </div>

              {/* Step 2 */}
              <div className="bg-white rounded-lg p-4 border border-blue-200">
                <h4 className="font-semibold text-blue-900 mb-3 flex items-center">
                  <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm mr-2">2</span>
                  Node HTTP Request (chamar o servidor MCP)
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <ul className="space-y-1 text-sm text-blue-700">
                      <li>• <strong>Método:</strong> POST</li>
                      <li>• <strong>URL:</strong> https://&lt;seu-replit&gt;.repl.co/mcp/essencial/teste</li>
                      <li>• <strong>Headers:</strong> Content-Type: application/json</li>
                      <li>• <strong>Body:</strong> JSON com os dados do usuário</li>
                      <li>• <strong>Salvar saída como:</strong> mcp_response</li>
                    </ul>
                  </div>
                  <div className="bg-gray-100 p-3 rounded text-xs">
                    <p className="text-gray-700 mb-1">Este node faz a chamada para o servidor MCP que cria o agente de teste e retorna o test_url.</p>
                  </div>
                </div>
              </div>

              {/* Step 3 */}
              <div className="bg-white rounded-lg p-4 border border-blue-200">
                <h4 className="font-semibold text-blue-900 mb-3 flex items-center">
                  <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm mr-2">3</span>
                  Node Function (gerar mensagem personalizada)
                </h4>
                <div className="bg-gray-900 text-green-400 p-3 rounded text-sm font-mono overflow-x-auto">
{`return [{
  json: {
    mensagem: \`Olá \${$json["nome"]}, seu agente de teste está pronto!

Acesse agora: \${$node["HTTP Request"].json["test_url"]}\`
  }
}];`}
                </div>
              </div>

              {/* Step 4 */}
              <div className="bg-white rounded-lg p-4 border border-blue-200">
                <h4 className="font-semibold text-blue-900 mb-3 flex items-center">
                  <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm mr-2">4</span>
                  Node WhatsApp (via API externa)
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-blue-800 mb-2"><strong>Configuração:</strong></p>
                    <ul className="space-y-1 text-sm text-blue-700">
                      <li>• <strong>URL:</strong> da API do provedor</li>
                      <li>• <strong>Método:</strong> POST</li>
                      <li>• <strong>Provedores:</strong> Z-API, UltraMsg, 360Dialog</li>
                    </ul>
                  </div>
                  <div>
                    <p className="text-blue-800 mb-2"><strong>Payload exemplo:</strong></p>
                    <div className="bg-gray-900 text-green-400 p-3 rounded text-xs font-mono">
{`{
  "phone": "{{ $json["whatsapp"] }}",
  "message": "{{ $json["mensagem"] }}"
}`}
                    </div>
                    <p className="text-xs text-blue-600 mt-1">Obs: Adaptar conforme o provedor de WhatsApp usado</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-purple-900 mb-3">🔗 Integração com Sistema HumanTic</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white rounded-lg p-4 border border-purple-200">
                <h4 className="font-semibold text-purple-900 mb-3">Endpoint Replit Disponível</h4>
                <div className="bg-gray-900 text-green-400 p-3 rounded text-sm font-mono">
                  POST /api/webhook/ativar-agente-teste
                </div>
                <p className="text-purple-800 text-sm mt-2">
                  Este endpoint já está configurado no sistema HumanTic e automaticamente:
                </p>
                <ul className="space-y-1 text-sm text-purple-700 mt-2">
                  <li>• Cria o agente no servidor MCP</li>
                  <li>• Gera o test_url único</li>
                  <li>• Repassa os dados para n8n</li>
                </ul>
              </div>
              
              <div className="bg-white rounded-lg p-4 border border-purple-200">
                <h4 className="font-semibold text-purple-900 mb-3">Fluxo Integrado</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-purple-600 rounded-full"></div>
                    <span className="text-purple-800">Usuário preenche formulário na landing page</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-purple-600 rounded-full"></div>
                    <span className="text-purple-800">Sistema cria agente MCP automaticamente</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-purple-600 rounded-full"></div>
                    <span className="text-purple-800">n8n recebe webhook e envia WhatsApp</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-purple-600 rounded-full"></div>
                    <span className="text-purple-800">Cliente recebe link de teste personalizado</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'agent-essencial',
      title: 'Agente Essencial',
      icon: UserCog,
      description: 'Documentação específica do Agente Essencial',
      content: (
        <div className="space-y-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-blue-900 mb-3">Agente Essencial - Documentação</h3>
            <p className="text-blue-800 mb-4">
              O Agente Essencial é projetado para atendimento automatizado básico com personalização.
              Ideal para empresas que precisam de um primeiro contato automatizado eficiente.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white rounded-lg p-4 border border-blue-200">
                <h4 className="font-semibold text-blue-900 mb-3">Funcionalidades</h4>
                <ul className="space-y-2 text-blue-800">
                  <li>• Atendimento 24/7 automatizado</li>
                  <li>• Reconhecimento de intenções básicas</li>
                  <li>• Respostas personalizadas</li>
                  <li>• Escalação para atendimento humano</li>
                  <li>• Histórico de conversas</li>
                  <li>• Métricas básicas de satisfação</li>
                </ul>
              </div>
              
              <div className="bg-white rounded-lg p-4 border border-blue-200">
                <h4 className="font-semibold text-blue-900 mb-3">Configurações Técnicas</h4>
                <ul className="space-y-2 text-blue-800">
                  <li>• Tempo de resposta: menor que 2s</li>
                  <li>• Integração: WhatsApp Business</li>
                  <li>• Memória: Contexto de sessão</li>
                  <li>• Fallback: Atendente humano</li>
                  <li>• Idiomas: Português (BR)</li>
                  <li>• Horário: 24/7</li>
                </ul>
              </div>
            </div>
          </div>
          
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
              <CheckSquare className="h-5 w-5 mr-2" />
              Checklist de Implementação
            </h4>
            <div className="space-y-2">
              {agentChecklists.essencial.items.map((item, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-gray-700">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'agent-agenda',
      title: 'Agente Agenda',
      icon: Calendar,
      description: 'Documentação específica do Agente de Agenda',
      content: (
        <div className="space-y-6">
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-purple-900 mb-3">Agente Agenda - Documentação</h3>
            <p className="text-purple-800 mb-4">
              O Agente de Agenda especializa-se em organização de agendamentos e lembretes.
              Inclui todas as funcionalidades do Agente Essencial mais gestão de calendário.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white rounded-lg p-4 border border-purple-200">
                <h4 className="font-semibold text-purple-900 mb-3">Funcionalidades Adicionais</h4>
                <ul className="space-y-2 text-purple-800">
                  <li>• Agendamento automático</li>
                  <li>• Integração Google Calendar</li>
                  <li>• Lembretes automáticos</li>
                  <li>• Gestão de disponibilidade</li>
                  <li>• Reagendamento inteligente</li>
                  <li>• Notificações via WhatsApp</li>
                </ul>
              </div>
              
              <div className="bg-white rounded-lg p-4 border border-purple-200">
                <h4 className="font-semibold text-purple-900 mb-3">APIs Integradas</h4>
                <ul className="space-y-2 text-purple-800">
                  <li>• Google Calendar API v3</li>
                  <li>• WhatsApp Business API</li>
                  <li>• Timezone API</li>
                  <li>• Webhook Notifications</li>
                  <li>• SMS Fallback (opcional)</li>
                  <li>• Email Notifications</li>
                </ul>
              </div>
            </div>
          </div>
          
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
              <CheckSquare className="h-5 w-5 mr-2" />
              Checklist de Implementação
            </h4>
            <div className="space-y-2">
              {agentChecklists.agenda.items.map((item, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-gray-700">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'agent-conversao',
      title: 'Agente Conversão',
      icon: Target,
      description: 'Documentação específica do Agente de Conversão',
      content: (
        <div className="space-y-6">
          <div className="bg-green-50 border border-green-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-green-900 mb-3">Agente Conversão - Documentação</h3>
            <p className="text-green-800 mb-4">
              O Agente de Conversão é o mais avançado, incluindo qualificação de leads e vendas.
              Combina todas as funcionalidades dos agentes anteriores com recursos de CRM.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white rounded-lg p-4 border border-green-200">
                <h4 className="font-semibold text-green-900 mb-3">Funcionalidades Avançadas</h4>
                <ul className="space-y-2 text-green-800">
                  <li>• Qualificação automática de leads</li>
                  <li>• Sistema de pontuação (lead scoring)</li>
                  <li>• Funis de conversão personalizados</li>
                  <li>• Follow-up automatizado</li>
                  <li>• Integração com CRM</li>
                  <li>• Analytics de conversão</li>
                </ul>
              </div>
              
              <div className="bg-white rounded-lg p-4 border border-green-200">
                <h4 className="font-semibold text-green-900 mb-3">Métricas Avançadas</h4>
                <ul className="space-y-2 text-green-800">
                  <li>• Taxa de conversão por etapa</li>
                  <li>• ROI por campanha</li>
                  <li>• Tempo médio de conversão</li>
                  <li>• Valor médio por lead</li>
                  <li>• Churn rate prediction</li>
                  <li>• LTV (Lifetime Value)</li>
                </ul>
              </div>
            </div>
          </div>
          
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
              <CheckSquare className="h-5 w-5 mr-2" />
              Checklist de Implementação
            </h4>
            <div className="space-y-2">
              {agentChecklists.conversao.items.map((item, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-gray-700">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'development-guide',
      title: 'Guia de Desenvolvimento',
      icon: Code,
      description: 'Orientações técnicas para desenvolvimento e manutenção',
      content: (
        <div className="space-y-6">
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-orange-900 mb-3">Guia de Desenvolvimento MCP</h3>
            
            <div className="space-y-4">
              <div className="bg-white rounded-lg p-4 border border-orange-200">
                <h4 className="font-semibold text-orange-900 mb-3">Estrutura de Arquivos</h4>
                <div className="bg-gray-100 rounded p-3 font-mono text-sm">
{`/client/src/services/mcpService.ts    # Serviço principal MCP
/client/src/pages/AgentBuilder.tsx     # Interface de criação
/shared/schema.ts                      # Schemas do banco
/server/routes.ts                      # Rotas da API`}
                </div>
              </div>
              
              <div className="bg-white rounded-lg p-4 border border-orange-200">
                <h4 className="font-semibold text-orange-900 mb-3">Variáveis de Ambiente</h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <code className="bg-gray-100 px-2 py-1 rounded">VITE_MCP_API_KEY</code>
                    <span className="text-sm text-gray-600">Chave da API MCP</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <code className="bg-gray-100 px-2 py-1 rounded">VITE_MCP_API_URL</code>
                    <span className="text-sm text-gray-600">URL base do MCP</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <code className="bg-gray-100 px-2 py-1 rounded">DATABASE_URL</code>
                    <span className="text-sm text-gray-600">PostgreSQL connection</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg p-4 border border-orange-200">
                <h4 className="font-semibold text-orange-900 mb-3">Comandos Úteis</h4>
                <div className="space-y-2">
                  <div className="bg-gray-100 rounded p-2 font-mono text-sm">
                    npm run dev # Iniciar desenvolvimento
                  </div>
                  <div className="bg-gray-100 rounded p-2 font-mono text-sm">
                    npm run db:push # Sincronizar schema
                  </div>
                  <div className="bg-gray-100 rounded p-2 font-mono text-sm">
                    npm run build # Build de produção
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    }
  ];

  const currentSection = sections.find(section => section.id === activeSection);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-6 ml-64">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <div className="flex items-center space-x-3 mb-2">
                <BookOpen className="h-8 w-8 text-purple-600" />
                <h1 className="text-3xl font-bold text-gray-900">Biblioteca de Conhecimento</h1>
              </div>
              <p className="text-gray-600">
                Base de conhecimento completa sobre agentes, MCP e orientações de desenvolvimento
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              {/* Sidebar de navegação */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                  <h3 className="font-semibold text-gray-900 mb-4">Seções</h3>
                  <nav className="space-y-2">
                    {sections.map((section) => {
                      const Icon = section.icon;
                      const isActive = activeSection === section.id;
                      return (
                        <button
                          key={section.id}
                          onClick={() => toggleSection(section.id)}
                          className={`w-full flex items-center space-x-3 p-3 rounded-lg text-left transition-colors ${
                            isActive 
                              ? 'bg-purple-100 text-purple-900 border border-purple-200' 
                              : 'hover:bg-gray-100 text-gray-700'
                          }`}
                        >
                          <Icon className="h-5 w-5" />
                          <span className="font-medium">{section.title}</span>
                        </button>
                      );
                    })}
                  </nav>
                </div>
              </div>

              {/* Conteúdo principal */}
              <div className="lg:col-span-3">
                {currentSection && (
                  <motion.div
                    key={currentSection.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
                  >
                    <div className="mb-6">
                      <div className="flex items-center space-x-3 mb-2">
                        <currentSection.icon className="h-6 w-6 text-purple-600" />
                        <h2 className="text-2xl font-bold text-gray-900">{currentSection.title}</h2>
                      </div>
                      <p className="text-gray-600">{currentSection.description}</p>
                    </div>
                    
                    <div className="prose max-w-none">
                      {currentSection.content}
                    </div>
                  </motion.div>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}