import { useState, useEffect } from 'react';
import { formatPrice } from '@/payment-config';

interface PaymentTracking {
  id: string;
  userId: string;
  planType: 'essencial' | 'agenda' | 'conversao';
  phase: 'phase1' | 'phase2' | 'monthly';
  status: 'pending' | 'paid' | 'failed' | 'cancelled';
  amount: number;
  currency: string;
  dueDate: string | null;
  paidAt: string | null;
  adminSetDueDate: string | null;
  activationDate: string | null;
  nextBillingDate: string | null;
  createdAt: string;
}

export default function PaymentManagement() {
  const [pendingPhase2, setPendingPhase2] = useState<PaymentTracking[]>([]);
  const [overduePayments, setOverduePayments] = useState<PaymentTracking[]>([]);
  const [selectedPayment, setSelectedPayment] = useState<string | null>(null);
  const [newDueDate, setNewDueDate] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPaymentData();
  }, []);

  const loadPaymentData = async () => {
    try {
      setLoading(true);
      
      // Load pending phase 2 payments
      const pendingResponse = await fetch('/api/admin/payments/pending-phase2');
      if (pendingResponse.ok) {
        const pendingData = await pendingResponse.json();
        setPendingPhase2(pendingData);
      }

      // Load overdue payments
      const overdueResponse = await fetch('/api/admin/payments/overdue');
      if (overdueResponse.ok) {
        const overdueData = await overdueResponse.json();
        setOverduePayments(overdueData);
      }
    } catch (error) {
      console.error('Error loading payment data:', error);
    } finally {
      setLoading(false);
    }
  };

  const setDueDate = async (paymentId: string, dueDate: string) => {
    try {
      const response = await fetch(`/api/admin/payments/${paymentId}/set-due-date`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ dueDate }),
      });

      if (response.ok) {
        await loadPaymentData();
        setSelectedPayment(null);
        setNewDueDate('');
      }
    } catch (error) {
      console.error('Error setting due date:', error);
    }
  };

  const getStatusBadge = (status: string) => {
    const className = status === 'paid' ? 'bg-green-100 text-green-800' :
                     status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                     status === 'failed' ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800';
    
    return <span className={`px-2 py-1 rounded-full text-xs font-medium ${className}`}>{status}</span>;
  };

  const getPhaseBadge = (phase: string) => {
    const label = phase === 'phase1' ? 'Fase 1 (Sinal 50%)' :
                  phase === 'phase2' ? 'Fase 2 (Final 50%)' :
                  phase === 'monthly' ? 'Mensalidade' : phase;
    
    return <span className="px-2 py-1 rounded border text-xs font-medium">{label}</span>;
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Não definido';
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Gestão de Pagamentos HumanTic</h1>
          <p className="text-gray-600 mt-2">Controle de pagamentos em 2 fases e ciclo de cobrança mensal</p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Fase 2 Pendentes</p>
                <p className="text-2xl font-bold text-gray-900">{pendingPhase2.length}</p>
                <p className="text-xs text-gray-500">aguardando finalização</p>
              </div>
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                💰
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Em Atraso</p>
                <p className="text-2xl font-bold text-red-600">{overduePayments.length}</p>
                <p className="text-xs text-gray-500">precisam de atenção</p>
              </div>
              <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                ⚠️
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Valor Pendente</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatPrice(pendingPhase2.reduce((total, payment) => total + payment.amount, 0) / 100)}
                </p>
                <p className="text-xs text-gray-500">total a receber</p>
              </div>
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                💵
              </div>
            </div>
          </div>
        </div>

        {/* Pending Phase 2 Payments */}
        <div className="bg-white rounded-lg shadow mb-8">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">💰 Pagamentos Fase 2 Pendentes</h2>
            <p className="text-gray-600">Clientes que pagaram o sinal (Fase 1) e aguardam finalização do desenvolvimento</p>
          </div>
          <div className="p-6">
            {pendingPhase2.length === 0 ? (
              <p className="text-gray-500 text-center py-8">Nenhum pagamento fase 2 pendente</p>
            ) : (
              <div className="space-y-4">
                {pendingPhase2.map((payment) => (
                  <div key={payment.id} className="border rounded-lg p-4 space-y-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold text-lg">{payment.planType.charAt(0).toUpperCase() + payment.planType.slice(1)}</h3>
                          {getPhaseBadge(payment.phase)}
                          {getStatusBadge(payment.status)}
                        </div>
                        <p className="text-sm text-gray-600">ID do Cliente: {payment.userId}</p>
                        <p className="text-sm text-gray-600">Valor: {formatPrice(payment.amount / 100)}</p>
                        <p className="text-sm text-gray-600">Vencimento: {formatDate(payment.dueDate)}</p>
                        {payment.adminSetDueDate && (
                          <p className="text-sm text-blue-600">Data definida pelo admin: {formatDate(payment.adminSetDueDate)}</p>
                        )}
                      </div>
                      <div className="flex flex-col gap-2">
                        <button
                          className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50"
                          onClick={() => setSelectedPayment(payment.id)}
                        >
                          Definir Prazo
                        </button>
                      </div>
                    </div>
                    
                    {selectedPayment === payment.id && (
                      <div className="border-t pt-3 space-y-3">
                        <div>
                          <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700">Nova Data de Vencimento</label>
                          <input
                            id="dueDate"
                            type="date"
                            value={newDueDate}
                            onChange={(e) => setNewDueDate(e.target.value)}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                        <div className="flex gap-2">
                          <button
                            className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
                            onClick={() => setDueDate(payment.id, newDueDate)}
                            disabled={!newDueDate}
                          >
                            Confirmar
                          </button>
                          <button
                            className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50"
                            onClick={() => {
                              setSelectedPayment(null);
                              setNewDueDate('');
                            }}
                          >
                            Cancelar
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Overdue Payments */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">⚠️ Pagamentos em Atraso</h2>
            <p className="text-gray-600">Pagamentos que passaram da data de vencimento</p>
          </div>
          <div className="p-6">
            {overduePayments.length === 0 ? (
              <p className="text-gray-500 text-center py-8">Nenhum pagamento em atraso</p>
            ) : (
              <div className="space-y-4">
                {overduePayments.map((payment) => (
                  <div key={payment.id} className="border border-red-200 rounded-lg p-4 bg-red-50">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold text-lg">{payment.planType.charAt(0).toUpperCase() + payment.planType.slice(1)}</h3>
                          {getPhaseBadge(payment.phase)}
                          {getStatusBadge(payment.status)}
                        </div>
                        <p className="text-sm text-gray-600">ID do Cliente: {payment.userId}</p>
                        <p className="text-sm text-gray-600">Valor: {formatPrice(payment.amount / 100)}</p>
                        <p className="text-sm text-red-600 font-medium">
                          Venceu em: {formatDate(payment.dueDate)}
                        </p>
                        <p className="text-sm text-gray-600">
                          Dias em atraso: {payment.dueDate ? Math.ceil((Date.now() - new Date(payment.dueDate).getTime()) / (1000 * 60 * 60 * 24)) : 0}
                        </p>
                      </div>
                      <div className="flex flex-col gap-2">
                        <button className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700">
                          Enviar Cobrança
                        </button>
                        <button className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50">
                          Contatar Cliente
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}