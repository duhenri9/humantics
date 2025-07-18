// Integração com Chatwoot (exemplo simplificado)
import axios from 'axios';

const CHATWOOT_URL = process.env.CHATWOOT_URL || 'http://chatwoot-app:3000';
const CHATWOOT_API_TOKEN = process.env.CHATWOOT_API_TOKEN || '';

export async function createLeadInChatwoot(lead: { name: string; email: string; phone: string }) {
  return axios.post(
    `${CHATWOOT_URL}/api/v1/contacts`,
    {
      name: lead.name,
      email: lead.email,
      phone_number: lead.phone,
      custom_attributes: {}
    },
    {
      headers: { 'api_access_token': CHATWOOT_API_TOKEN }
    }
  );
}

export async function updateLeadWithBotSailor(chatwootId: string, botsailorId: string, status: string) {
  return axios.put(
    `${CHATWOOT_URL}/api/v1/contacts/${chatwootId}`,
    {
      custom_attributes: {
        botsailor_id: botsailorId,
        botsailor_status: status
      }
    },
    {
      headers: { 'api_access_token': CHATWOOT_API_TOKEN }
    }
  );
}
