// Tipos compartilhados entre frontend e backend
// NOTA: Esta é uma versão simplificada. A pasta shared/ original foi perdida na exportação do Replit.

export interface User {
  id: string;
  email: string;
  fullName?: string;
  role: 'admin' | 'client';
  plan?: 'essencial' | 'agenda' | 'conversao';
  createdAt?: string;
  updatedAt?: string;
}

export interface Agent {
  id: string;
  name: string;
  type: 'essencial' | 'agenda' | 'conversao';
  status: 'active' | 'inactive' | 'draft';
  userId: string;
  lastUpdated?: string;
  description?: string;
}

export interface Lead {
  id: string;
  name: string;
  email: string;
  phone?: string;
  status: 'new' | 'contacted' | 'qualified' | 'converted' | 'lost';
  agentId?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface PaymentIntent {
  id: string;
  amount: number;
  currency: string;
  status: 'requires_payment_method' | 'requires_confirmation' | 'succeeded' | 'canceled';
  clientSecret?: string;
  userId: string;
  createdAt: string;
}

export interface Subscription {
  id: string;
  userId: string;
  plan: 'essencial' | 'agenda' | 'conversao';
  status: 'active' | 'canceled' | 'past_due' | 'incomplete';
  currentPeriodStart: number;
  currentPeriodEnd: number;
  gateway: 'stripe';
  paymentMethod?: {
    brand: string;
    last4: string;
  };
}

export interface MCPReport {
  id: string;
  agentId: string;
  agentName: string;
  agentType: 'agenda' | 'conversao';
  weekNumber: number;
  year: number;
  reportDate: string;
  metrics: {
    conversationsCount: number;
    resolutionRate: number;
    averageResponseTime: number;
    satisfactionRate: number;
    topIntents: Array<{
      intent: string;
      count: number;
      percentage: number;
    }>;
    weeklyTrend: Array<{
      day: string;
      conversations: number;
      satisfaction: number;
    }>;
  };
  insights: {
    positivePoints: string[];
    improvementAreas: string[];
    recommendations: string[];
  };
}

export interface ClientRequest {
  id: string;
  userId: string;
  type: 'support' | 'billing' | 'feature' | 'bug' | 'integration';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  title: string;
  description: string;
  createdAt: string;
  updatedAt?: string;
}

// Tipos de resposta da API
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

// Tipos de configuração
export interface AppConfig {
  apiUrl: string;
  stripePublicKey: string;
  environment: 'development' | 'production';
}

// Tipos de webhook
export interface WebhookPayload {
  type: string;
  data: any;
  timestamp: string;
}
