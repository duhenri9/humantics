import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Save, 
  FileCheck, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  RefreshCw,
  FileText,
  Database,
  Shield
} from 'lucide-react';
import { saveBetaVersion, isBetaVersionSaved, getBetaVersionStats } from '../utils/betaVersioning';
import { versionControl } from '../utils/versionControl';
import { showSuccess, showError } from '../utils/toast';

interface BetaVersionManagerProps {
  onClose?: () => void;
}

const BetaVersionManager: React.FC<BetaVersionManagerProps> = ({ onClose }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [stats, setStats] = useState({ totalFiles: 0, totalVersions: 0 });
  const [recentFiles, setRecentFiles] = useState<string[]>([]);

  useEffect(() => {
    // Verificar se a versão beta já foi salva
    setIsSaved(isBetaVersionSaved());
    setStats(getBetaVersionStats());
    
    // Obter lista de arquivos recentes
    const allFiles = versionControl.listFiles();
    setRecentFiles(allFiles.slice(0, 5)); // Mostrar apenas os 5 primeiros
  }, []);

  const handleSaveBeta = async () => {
    setIsLoading(true);
    
    try {
      const success = await saveBetaVersion();
      
      if (success) {
        showSuccess('Versão Beta salva com sucesso!');
        setIsSaved(true);
        setStats(getBetaVersionStats());
        
        // Atualizar lista de arquivos recentes
        const allFiles = versionControl.listFiles();
        setRecentFiles(allFiles.slice(0, 5));
      } else {
        showError('Erro ao salvar versão Beta');
      }
    } catch (error) {
      console.error('Erro ao salvar versão Beta:', error);
      showError('Erro ao salvar versão Beta');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-lg">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="bg-blue-100 p-2 rounded-lg">
            <FileCheck className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Gerenciador de Versão Beta</h2>
            <p className="text-sm text-gray-600">Salve o estado atual como versão Beta</p>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {/* Status da Versão */}
        <div className={`p-4 rounded-lg border ${
          isSaved ? 'bg-green-50 border-green-200' : 'bg-yellow-50 border-yellow-200'
        }`}>
          <div className="flex items-center gap-3 mb-2">
            {isSaved ? (
              <CheckCircle className="h-5 w-5 text-green-600" />
            ) : (
              <AlertTriangle className="h-5 w-5 text-yellow-600" />
            )}
            <h3 className="font-medium text-gray-900">
              {isSaved ? 'Versão Beta Salva' : 'Versão Beta Não Salva'}
            </h3>
          </div>
          <p className="text-sm text-gray-600">
            {isSaved 
              ? `${stats.totalFiles} arquivos e ${stats.totalVersions} versões salvas no total.` 
              : 'Nenhuma versão beta foi salva ainda. Clique no botão abaixo para salvar o estado atual do projeto.'}
          </p>
        </div>

        {/* Arquivos Recentes */}
        {isSaved && recentFiles.length > 0 && (
          <div className="border border-gray-200 rounded-lg p-4">
            <h3 className="font-medium text-gray-900 mb-3">Arquivos Versionados Recentes</h3>
            <ul className="space-y-2">
              {recentFiles.map((file, index) => (
                <li key={index} className="text-sm text-gray-600 flex items-center gap-2">
                  <FileText className="h-4 w-4 text-gray-400" />
                  {file}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Informações de Segurança */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Database className="h-4 w-4 text-blue-600" />
              <h3 className="font-medium text-blue-900">Banco de Dados</h3>
            </div>
            <p className="text-sm text-blue-700">
              As migrações do banco de dados foram otimizadas para melhor performance e segurança.
            </p>
          </div>
          
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Shield className="h-4 w-4 text-purple-600" />
              <h3 className="font-medium text-purple-900">Segurança</h3>
            </div>
            <p className="text-sm text-purple-700">
              Políticas RLS otimizadas para melhor performance e proteção de dados.
            </p>
          </div>
        </div>

        {/* Botão de Ação */}
        <div className="flex justify-end">
          <button
            onClick={handleSaveBeta}
            disabled={isLoading}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <RefreshCw className="h-4 w-4 animate-spin" />
                Salvando...
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                {isSaved ? 'Atualizar Versão Beta' : 'Salvar Versão Beta'}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default BetaVersionManager;