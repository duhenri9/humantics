import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, CheckCircle, AlertCircle, Smartphone, RefreshCw } from 'lucide-react';

export default function WhatsAppQRCode() {
  const [qrCodeData, setQrCodeData] = useState<string>('');
  const [status, setStatus] = useState<'loading' | 'ready' | 'connected' | 'error'>('loading');
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  const checkVenomStatus = async () => {
    try {
      const response = await fetch('/api/venom/status');
      const data = await response.json();
      
      if (data.isConnected) {
        setStatus('connected');
        setQrCodeData('');
      } else if (data.qrCode) {
        setStatus('ready');
        setQrCodeData(data.qrCode);
      } else {
        setStatus('loading');
      }
      
      setLastUpdate(new Date());
    } catch (error) {
      console.error('Error checking Venom status:', error);
      setStatus('error');
    }
  };

  useEffect(() => {
    // Check status immediately
    checkVenomStatus();
    
    // Check status every 3 seconds
    const interval = setInterval(checkVenomStatus, 3000);
    
    return () => clearInterval(interval);
  }, []);

  const testConnection = async () => {
    try {
      const response = await fetch('/api/venom/simulate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: 'Teste de conexão - WhatsApp Business funcionando!',
          from: 'test@business.us'
        })
      });
      
      const result = await response.json();
      if (result.success) {
        alert(`✅ Teste realizado com sucesso!\n\nResposta do agente:\n${result.response.substring(0, 200)}...`);
      }
    } catch (error) {
      alert('❌ Erro no teste de conexão');
    }
  };

  const getStatusBadge = () => {
    switch (status) {
      case 'loading':
        return <Badge variant="secondary"><Loader2 className="w-3 h-3 mr-1 animate-spin" />Inicializando</Badge>;
      case 'ready':
        return <Badge variant="outline"><Smartphone className="w-3 h-3 mr-1" />Aguardando Scan</Badge>;
      case 'connected':
        return <Badge variant="default" className="bg-green-500"><CheckCircle className="w-3 h-3 mr-1" />Conectado</Badge>;
      case 'error':
        return <Badge variant="destructive"><AlertCircle className="w-3 h-3 mr-1" />Erro</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
      <div className="max-w-2xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            WhatsApp Business Web
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Conecte sua conta WhatsApp Business ao sistema HumanTic
          </p>
          <div className="flex justify-center items-center gap-2">
            {getStatusBadge()}
            <span className="text-xs text-gray-500">
              Última atualização: {lastUpdate.toLocaleTimeString()}
            </span>
          </div>
        </div>

        {/* QR Code Card */}
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Smartphone className="w-5 h-5 text-purple-600" />
              Conexão WhatsApp Business
            </CardTitle>
            <CardDescription>
              Escaneie o QR Code com seu WhatsApp Business para conectar
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            
            {status === 'loading' && (
              <div className="flex flex-col items-center justify-center py-12 space-y-4">
                <Loader2 className="w-12 h-12 animate-spin text-purple-600" />
                <p className="text-gray-600 dark:text-gray-400">Inicializando WhatsApp Business Web...</p>
                <p className="text-sm text-gray-500">Isso pode levar alguns segundos</p>
              </div>
            )}

            {status === 'ready' && qrCodeData && (
              <div className="flex flex-col items-center space-y-4">
                <div className="bg-white p-4 rounded-lg shadow-lg">
                  <pre className="text-xs leading-3 font-mono whitespace-pre">
                    {qrCodeData}
                  </pre>
                </div>
                <div className="text-center space-y-2">
                  <p className="font-medium text-gray-900 dark:text-white">
                    Abra o WhatsApp Business no seu celular
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Vá em Menu → Dispositivos conectados → Conectar dispositivo
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Escaneie este QR Code
                  </p>
                </div>
              </div>
            )}

            {status === 'connected' && (
              <div className="flex flex-col items-center justify-center py-12 space-y-4">
                <CheckCircle className="w-12 h-12 text-green-500" />
                <p className="text-lg font-medium text-gray-900 dark:text-white">
                  WhatsApp Business Conectado!
                </p>
                <p className="text-gray-600 dark:text-gray-400 text-center">
                  Seu WhatsApp Business está conectado e pronto para receber mensagens automatizadas
                </p>
                <Button onClick={testConnection} className="mt-4">
                  Testar Integração
                </Button>
              </div>
            )}

            {status === 'error' && (
              <div className="flex flex-col items-center justify-center py-12 space-y-4">
                <AlertCircle className="w-12 h-12 text-red-500" />
                <p className="text-lg font-medium text-gray-900 dark:text-white">
                  Erro na Conexão
                </p>
                <p className="text-gray-600 dark:text-gray-400 text-center">
                  Houve um problema ao conectar com o WhatsApp Business
                </p>
                <Button onClick={checkVenomStatus} variant="outline" className="mt-4">
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Tentar Novamente
                </Button>
              </div>
            )}

          </CardContent>
        </Card>

        {/* Instructions Card */}
        <Card>
          <CardHeader>
            <CardTitle>Como Funciona</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-400 rounded-full w-6 h-6 flex items-center justify-center text-sm font-medium">1</div>
              <p className="text-sm text-gray-600 dark:text-gray-400">O sistema gera um QR Code específico para WhatsApp Business Web</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-400 rounded-full w-6 h-6 flex items-center justify-center text-sm font-medium">2</div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Você escaneia com seu celular e conecta sua conta business</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-400 rounded-full w-6 h-6 flex items-center justify-center text-sm font-medium">3</div>
              <p className="text-sm text-gray-600 dark:text-gray-400">O HumanTic Agent responde automaticamente às mensagens dos clientes</p>
            </div>
          </CardContent>
        </Card>

        {/* Back Button */}
        <div className="text-center">
          <Button 
            variant="outline" 
            onClick={() => window.history.back()}
          >
            Voltar ao Dashboard
          </Button>
        </div>

      </div>
    </div>
  );
}