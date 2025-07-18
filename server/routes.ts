
import express from 'express';
import { triggerN8NWorkflow } from './services/n8nService';
import { createLeadInChatwoot, updateLeadWithBotSailor } from './integrations/chatwoot';
import { syncBotSailorStatus } from './integrations/botsailor';
import { register, login, authenticateJWT } from './services/authService';
import { createPaymentIntent, retrievePaymentIntent } from './services/stripeService';


const router = express.Router();

// --- Stripe Payment Endpoints (JWT Protected) ---
router.post('/payments/intent', authenticateJWT, async (req, res) => {
  try {
    const { amount, currency } = req.body;
    if (!amount) return res.status(400).json({ error: 'amount obrigatório' });
    const intent = await createPaymentIntent(amount, currency);
    res.json({ clientSecret: intent.client_secret, id: intent.id });
  } catch (err) {
    res.status(500).json({ error: 'Erro ao criar PaymentIntent', details: (err as any).message });
  }
});

router.get('/payments/intent/:id', authenticateJWT, async (req, res) => {
  try {
    const { id } = req.params;
    const intent = await retrievePaymentIntent(id);
    res.json(intent);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao consultar PaymentIntent', details: (err as any).message });
  }
});
// --- JWT Auth Endpoints ---
router.post('/auth/register', register);
router.post('/auth/login', login);

// --- Protected Routes (JWT) ---
router.post('/leads', authenticateJWT, async (req, res) => {
  try {
    const { name, email, phone } = req.body;
    const result = await createLeadInChatwoot({ name, email, phone });
    res.json(result.data);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao criar lead no Chatwoot' });
  }
});

// --- N8N Integration Endpoint (JWT Protected) ---
router.post('/integrations/n8n/trigger', authenticateJWT, async (req, res) => {
  try {
    const { workflowId, data } = req.body;
    if (!workflowId) return res.status(400).json({ error: 'workflowId obrigatório' });
    const result = await triggerN8NWorkflow(workflowId, data || {});
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao disparar workflow N8N', details: (err as any).message });
  }
});

// --- Webhooks Endpoint (JWT Protected) ---
router.post('/webhooks/:source', authenticateJWT, async (req, res) => {
  const { source } = req.params;
  const event = req.body;
  // Aqui você pode rotear para handlers específicos por origem
  // Exemplo: if (source === 'stripe') { ... }
  res.status(200).json({ received: true, source, event });
});

router.patch('/leads/:chatwootId', authenticateJWT, async (req, res) => {
  try {
    const { botsailor_id, botsailor_status } = req.body;
    const { chatwootId } = req.params;
    const result = await updateLeadWithBotSailor(chatwootId, botsailor_id, botsailor_status);
    res.json(result.data);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao atualizar lead com BotSailor' });
  }
});

router.post('/integrations/botsailor/sync', authenticateJWT, async (req, res) => {
  try {
    const { chatwoot_id, botsailor_id } = req.body;
    const status = await syncBotSailorStatus(chatwoot_id, botsailor_id);
    res.json({ status });
  } catch (err) {
    res.status(500).json({ error: 'Erro ao sincronizar status BotSailor' });
  }
});

// --- WhatsApp Status Endpoint (Public) ---
router.get('/whatsapp/status', async (req, res) => {
  try {
    // Mock status for development
    const whatsappStatus = {
      isReady: true,
      hasQR: false,
      phone: '5511950377457',
      message: 'WhatsApp conectado e pronto'
    };
    
    res.json({ 
      status: 'success', 
      whatsapp: whatsappStatus 
    });
  } catch (err) {
    res.status(500).json({ error: 'Erro ao verificar status WhatsApp' });
  }
});

export default router;
