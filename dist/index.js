// server/index.ts
import express2 from "express";
import path from "path";
import { fileURLToPath } from "url";

// server/routes.ts
import express from "express";

// server/services/n8nService.ts
import axios from "axios";
var N8N_BASE_URL = process.env.N8N_BASE_URL || "http://n8n:5678";
var N8N_API_KEY = process.env.N8N_API_KEY || "";
async function triggerN8NWorkflow(workflowId, data) {
  const url = `${N8N_BASE_URL}/api/v1/workflows/${workflowId}/execute`;
  const headers = { "Content-Type": "application/json" };
  if (N8N_API_KEY) headers["X-N8N-API-KEY"] = N8N_API_KEY;
  const response = await axios.post(url, { data }, { headers });
  return response.data;
}

// server/integrations/chatwoot.ts
import axios2 from "axios";
var CHATWOOT_URL = process.env.CHATWOOT_URL || "http://chatwoot-app:3000";
var CHATWOOT_API_TOKEN = process.env.CHATWOOT_API_TOKEN || "";
async function createLeadInChatwoot(lead) {
  return axios2.post(
    `${CHATWOOT_URL}/api/v1/contacts`,
    {
      name: lead.name,
      email: lead.email,
      phone_number: lead.phone,
      custom_attributes: {}
    },
    {
      headers: { "api_access_token": CHATWOOT_API_TOKEN }
    }
  );
}
async function updateLeadWithBotSailor(chatwootId, botsailorId, status) {
  return axios2.put(
    `${CHATWOOT_URL}/api/v1/contacts/${chatwootId}`,
    {
      custom_attributes: {
        botsailor_id: botsailorId,
        botsailor_status: status
      }
    },
    {
      headers: { "api_access_token": CHATWOOT_API_TOKEN }
    }
  );
}

// server/integrations/botsailor.ts
import axios3 from "axios";
var BOTSAILOR_API_URL = process.env.BOTSAILOR_API_URL || "";
var BOTSAILOR_API_KEY = process.env.BOTSAILOR_API_KEY || "";
async function syncBotSailorStatus(chatwootId, botsailorId) {
  const status = await axios3.get(`${BOTSAILOR_API_URL}/status/${botsailorId}`, {
    headers: { "Authorization": `Bearer ${BOTSAILOR_API_KEY}` }
  });
  return status.data;
}

// server/services/authService.ts
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

// RedisStorage.ts
import Redis from "ioredis";
var RedisStorage = class {
  redis;
  constructor(redisUrl) {
    this.redis = new Redis(redisUrl || process.env.REDIS_URL || "redis://redis:6379");
  }
  async healthCheck() {
    try {
      await this.redis.ping();
      return true;
    } catch {
      return false;
    }
  }
  async getUser(id) {
    const data = await this.redis.get(`user:${id}`);
    return data ? JSON.parse(data) : void 0;
  }
  async getUserByEmail(email) {
    const id = await this.redis.get(`user:email:${email}`);
    if (!id) return void 0;
    return this.getUser(id);
  }
  async createUser(user) {
    const id = user.id || String(Date.now());
    await this.redis.set(`user:${id}`, JSON.stringify(user));
    if (user.email) {
      await this.redis.set(`user:email:${user.email}`, id);
    }
    return { ...user, id };
  }
  async updateUser(id, updates) {
    const user = await this.getUser(id);
    if (!user) throw new Error("User not found");
    const updated = { ...user, ...updates };
    await this.redis.set(`user:${id}`, JSON.stringify(updated));
    return updated;
  }
  // ...implementar métodos para pagamentos, suporte, MCP, etc.
};

// MockStorage.ts
var MockStorage = class {
  data = /* @__PURE__ */ new Map();
  emailToId = /* @__PURE__ */ new Map();
  async healthCheck() {
    return true;
  }
  async getUser(id) {
    return this.data.get(id);
  }
  async getUserByEmail(email) {
    const id = this.emailToId.get(email);
    if (!id) return void 0;
    return this.data.get(id);
  }
  async createUser(user) {
    const id = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const userData = { ...user, id, createdAt: (/* @__PURE__ */ new Date()).toISOString() };
    this.data.set(id, userData);
    if (user.email) {
      this.emailToId.set(user.email, id);
    }
    return userData;
  }
  async updateUser(id, updates) {
    const existing = this.data.get(id);
    if (!existing) {
      throw new Error("User not found");
    }
    const updated = { ...existing, ...updates, updatedAt: (/* @__PURE__ */ new Date()).toISOString() };
    this.data.set(id, updated);
    return updated;
  }
};

// server/storage.ts
var storage = process.env.NODE_ENV === "development" ? new MockStorage() : new RedisStorage();

// server/services/authService.ts
var JWT_SECRET = process.env.JWT_SECRET || "changeme";
var JWT_EXPIRES_IN = "2h";
async function register(req, res) {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: "Email e senha obrigat\xF3rios" });
  const existing = await storage.getUserByEmail(email);
  if (existing) return res.status(409).json({ error: "Usu\xE1rio j\xE1 existe" });
  const passwordHash = await bcrypt.hash(password, 10);
  const user = { id: Date.now().toString(), email, passwordHash };
  await storage.createUser(user);
  res.status(201).json({ message: "Usu\xE1rio registrado com sucesso" });
}
async function login(req, res) {
  const { email, password } = req.body;
  const user = await storage.getUserByEmail(email);
  if (!user) return res.status(401).json({ error: "Credenciais inv\xE1lidas" });
  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) return res.status(401).json({ error: "Credenciais inv\xE1lidas" });
  const token = jwt.sign({ sub: user.id, email: user.email }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
  res.json({ token });
}
function authenticateJWT(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) return res.status(401).json({ error: "Token ausente" });
  const token = authHeader.split(" ")[1];
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = payload;
    next();
  } catch {
    res.status(401).json({ error: "Token inv\xE1lido ou expirado" });
  }
}

// server/services/stripeService.ts
import Stripe from "stripe";
var STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY || "";
if (!STRIPE_SECRET_KEY) {
  throw new Error("STRIPE_SECRET_KEY n\xE3o definido nas vari\xE1veis de ambiente");
}
var stripe = new Stripe(STRIPE_SECRET_KEY, {
  apiVersion: "2025-06-30.basil"
});
async function createPaymentIntent(amount, currency = "brl") {
  return stripe.paymentIntents.create({
    amount,
    currency,
    payment_method_types: ["card"]
  });
}
async function retrievePaymentIntent(id) {
  return stripe.paymentIntents.retrieve(id);
}

// server/routes.ts
var router = express.Router();
router.post("/payments/intent", authenticateJWT, async (req, res) => {
  try {
    const { amount, currency } = req.body;
    if (!amount) return res.status(400).json({ error: "amount obrigat\xF3rio" });
    const intent = await createPaymentIntent(amount, currency);
    res.json({ clientSecret: intent.client_secret, id: intent.id });
  } catch (err) {
    res.status(500).json({ error: "Erro ao criar PaymentIntent", details: err.message });
  }
});
router.get("/payments/intent/:id", authenticateJWT, async (req, res) => {
  try {
    const { id } = req.params;
    const intent = await retrievePaymentIntent(id);
    res.json(intent);
  } catch (err) {
    res.status(500).json({ error: "Erro ao consultar PaymentIntent", details: err.message });
  }
});
router.post("/auth/register", register);
router.post("/auth/login", login);
router.post("/leads", authenticateJWT, async (req, res) => {
  try {
    const { name, email, phone } = req.body;
    const result = await createLeadInChatwoot({ name, email, phone });
    res.json(result.data);
  } catch (err) {
    res.status(500).json({ error: "Erro ao criar lead no Chatwoot" });
  }
});
router.post("/integrations/n8n/trigger", authenticateJWT, async (req, res) => {
  try {
    const { workflowId, data } = req.body;
    if (!workflowId) return res.status(400).json({ error: "workflowId obrigat\xF3rio" });
    const result = await triggerN8NWorkflow(workflowId, data || {});
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: "Erro ao disparar workflow N8N", details: err.message });
  }
});
router.post("/webhooks/:source", authenticateJWT, async (req, res) => {
  const { source } = req.params;
  const event = req.body;
  res.status(200).json({ received: true, source, event });
});
router.patch("/leads/:chatwootId", authenticateJWT, async (req, res) => {
  try {
    const { botsailor_id, botsailor_status } = req.body;
    const { chatwootId } = req.params;
    const result = await updateLeadWithBotSailor(chatwootId, botsailor_id, botsailor_status);
    res.json(result.data);
  } catch (err) {
    res.status(500).json({ error: "Erro ao atualizar lead com BotSailor" });
  }
});
router.post("/integrations/botsailor/sync", authenticateJWT, async (req, res) => {
  try {
    const { chatwoot_id, botsailor_id } = req.body;
    const status = await syncBotSailorStatus(chatwoot_id, botsailor_id);
    res.json({ status });
  } catch (err) {
    res.status(500).json({ error: "Erro ao sincronizar status BotSailor" });
  }
});
router.get("/whatsapp/status", async (req, res) => {
  try {
    const whatsappStatus = {
      isReady: true,
      hasQR: false,
      phone: "5511950377457",
      message: "WhatsApp conectado e pronto"
    };
    res.json({
      status: "success",
      whatsapp: whatsappStatus
    });
  } catch (err) {
    res.status(500).json({ error: "Erro ao verificar status WhatsApp" });
  }
});
var routes_default = router;

// server/index.ts
var __filename = fileURLToPath(import.meta.url);
var __dirname = path.dirname(__filename);
var app = express2();
var PORT = process.env.PORT || 5e3;
app.use(express2.json());
app.use(express2.urlencoded({ extended: true }));
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  if (req.method === "OPTIONS") {
    res.sendStatus(200);
  } else {
    next();
  }
});
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    timestamp: (/* @__PURE__ */ new Date()).toISOString(),
    service: "humantics-api"
  });
});
app.use("/api", routes_default);
var publicPath = process.env.NODE_ENV === "production" ? path.join(__dirname, "../dist/public") : path.join(process.cwd(), "dist/public");
app.use(express2.static(publicPath));
app.get("*", (req, res) => {
  if (req.path.startsWith("/api") || req.path.startsWith("/health")) {
    return;
  }
  const indexPath = path.join(publicPath, "index.html");
  res.sendFile(indexPath);
});
app.use((err, req, res, next) => {
  console.error("Global error handler:", err);
  res.status(500).json({
    error: "Internal server error",
    message: process.env.NODE_ENV === "development" ? err.message : "Something went wrong"
  });
});
app.use((req, res) => {
  res.status(404).json({
    error: "Not found",
    message: `Route ${req.method} ${req.path} not found`
  });
});
app.listen(PORT, () => {
  console.log(`\u{1F680} Server running on port ${PORT}`);
  console.log(`\u{1F4CD} Health check: http://localhost:${PORT}/health`);
  console.log(`\u{1F4CD} API base URL: http://localhost:${PORT}/api`);
});
var index_default = app;
export {
  index_default as default
};
