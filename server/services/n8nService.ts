// Serviço básico para integração com N8N (pode ser expandido para triggers, execuções, etc)
import axios from 'axios';

const N8N_BASE_URL = process.env.N8N_BASE_URL || 'http://n8n:5678';
const N8N_API_KEY = process.env.N8N_API_KEY || '';

export async function triggerN8NWorkflow(workflowId: string, data: any) {
  const url = `${N8N_BASE_URL}/api/v1/workflows/${workflowId}/execute`;
  const headers: any = { 'Content-Type': 'application/json' };
  if (N8N_API_KEY) headers['X-N8N-API-KEY'] = N8N_API_KEY;
  const response = await axios.post(url, { data }, { headers });
  return response.data;
}
