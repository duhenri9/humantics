import { pgTable, text, serial, integer, boolean, timestamp, uuid, bigint, pgEnum } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Enums
export const userRoleEnum = pgEnum("user_role", ["admin", "client"]);
export const planEnum = pgEnum("plan", ["essencial", "agenda", "conversao"]);
export const stripeSubscriptionStatusEnum = pgEnum("stripe_subscription_status", [
  "active", "canceled", "incomplete", "incomplete_expired", 
  "past_due", "trialing", "unpaid", "not_started"
]);

export const paymentPhaseEnum = pgEnum("payment_phase", ["phase1", "phase2", "monthly"]);
export const paymentStatusEnum = pgEnum("payment_status", ["pending", "paid", "failed", "cancelled"]);
export const leadStatusEnum = pgEnum("lead_status", ["new", "contacted", "qualified", "converted", "lost"]);
export const agentTypeEnum = pgEnum("agent_type", ["essencial", "agenda", "conversao"]);
export const blogStatusEnum = pgEnum("blog_status", ["draft", "published", "archived"]);
export const blogCategoryEnum = pgEnum("blog_category", ["ia-automacao", "casos-uso", "tutoriais", "mercado-tendencias"]);

// Users table with authentication and profile data (consolidated with client data)
export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  fullName: text("full_name"),
  role: userRoleEnum("role").notNull().default("client"),
  plan: planEnum("plan"), // Optional - admins don't need plans
  createdAt: timestamp("created_at").defaultNow(),
  lastSignInAt: timestamp("last_sign_in_at"),
  // Password reset fields
  resetToken: text("reset_token"),
  resetTokenExpires: timestamp("reset_token_expires"),
  // Email confirmation fields
  emailConfirmationToken: text("email_confirmation_token"),
  emailConfirmed: boolean("email_confirmed").default(false),
  // Client-specific fields (consolidated from clientData)
  nomeEmpresa: text("nome_empresa"),
  whatsapp: text("whatsapp"),
  objetivo: text("objetivo"),
  statusProposta: text("status_proposta").default("pending"),
  statusContrato: text("status_contrato").default("pending"),
  statusPagamento: text("status_pagamento").default("pending"),
  statusAtivacao: text("status_ativacao").default("pending"),
});

// Leads table - for prospects who haven't converted to customers yet (TTL: 7 days)
export const leads = pgTable("leads", {
  id: uuid("id").primaryKey().defaultRandom(),
  nomeCompleto: text("nome_completo"), // Nome real da pessoa responsável
  nomeNegocio: text("nome_negocio").notNull(),
  diferencial: text("diferencial").notNull(),
  email: text("email"),
  whatsapp: text("whatsapp"),
  mcpAgentId: text("mcp_agent_id"), // Link to test agent
  testUrl: text("test_url"), // URL for agent testing
  status: leadStatusEnum("status").notNull().default("new"),
  emailConfirmed: boolean("email_confirmed").default(false),
  confirmationToken: text("confirmation_token"),
  confirmationTokenExpires: timestamp("confirmation_token_expires"),
  createdAt: timestamp("created_at").defaultNow(),
  expiresAt: timestamp("expires_at").notNull(), // Auto-deletion after 7 days (LGPD compliance)
  convertedAt: timestamp("converted_at"), // When they became a customer
  userId: uuid("user_id").references(() => users.id), // If they convert to customer
  
  // Extended agent customization fields
  businessType: text("business_type"), // Tipo de negócio
  mainServices: text("main_services").array().default([]), // Principais serviços
  workingHours: text("working_hours"), // Horário de funcionamento
  location: text("location"), // Localização
  targetAudience: text("target_audience"), // Público-alvo
  tone: text("tone").default("friendly"), // Tom do agente
  greeting: text("greeting"), // Saudação personalizada
  knowledgeBase: text("knowledge_base"), // Base de conhecimento
  agentName: text("agent_name"), // Nome do agente
});

// Stripe customers table
export const stripeCustomers = pgTable("stripe_customers", {
  id: serial("id").primaryKey(),
  userId: uuid("user_id").notNull().references(() => users.id),
  customerId: text("customer_id").notNull().unique(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  deletedAt: timestamp("deleted_at"),
});

// Stripe subscriptions table
export const stripeSubscriptions = pgTable("stripe_subscriptions", {
  id: serial("id").primaryKey(),
  customerId: text("customer_id").notNull().references(() => stripeCustomers.customerId),
  subscriptionId: text("subscription_id"),
  priceId: text("price_id"),
  currentPeriodStart: bigint("current_period_start", { mode: "number" }),
  currentPeriodEnd: bigint("current_period_end", { mode: "number" }),
  cancelAtPeriodEnd: boolean("cancel_at_period_end").default(false),
  paymentMethodBrand: text("payment_method_brand"),
  paymentMethodLast4: text("payment_method_last4"),
  status: stripeSubscriptionStatusEnum("status").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  deletedAt: timestamp("deleted_at"),
});

// Payment tracking table for 2-phase billing management
export const paymentTracking = pgTable("payment_tracking", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").notNull().references(() => users.id),
  planType: planEnum("plan_type").notNull(), // essencial, agenda, conversao
  phase: paymentPhaseEnum("phase").notNull(), // phase1, phase2, monthly
  status: paymentStatusEnum("status").notNull().default("pending"), // pending, paid, failed, cancelled
  amount: integer("amount").notNull(), // amount in cents
  currency: text("currency").notNull().default("BRL"),
  stripePaymentIntentId: text("stripe_payment_intent_id"),
  stripeSessionId: text("stripe_session_id"),
  dueDate: timestamp("due_date"), // When payment is due
  paidAt: timestamp("paid_at"), // When payment was completed
  nextBillingDate: timestamp("next_billing_date"), // For monthly billing cycle
  adminSetDueDate: timestamp("admin_set_due_date"), // Admin-controlled due date for phase2
  activationDate: timestamp("activation_date"), // When service was activated (phase2 completion)
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Client requests/tickets table for support and feature requests
export const clientRequests = pgTable("client_requests", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").notNull().references(() => users.id),
  type: text("type").notNull(), // 'support', 'feature', 'bug', 'billing', 'integration'
  priority: text("priority").notNull().default("medium"), // 'low', 'medium', 'high', 'urgent'
  status: text("status").notNull().default("open"), // 'open', 'in_progress', 'resolved', 'closed'
  title: text("title").notNull(),
  description: text("description").notNull(),
  agentType: planEnum("agent_type"), // Which agent this relates to (optional)
  attachments: text("attachments").array(), // File URLs or references
  adminNotes: text("admin_notes"), // Internal admin notes
  assignedTo: uuid("assigned_to").references(() => users.id), // Which admin is handling
  resolutionNotes: text("resolution_notes"), // Final resolution details
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  resolvedAt: timestamp("resolved_at"),
});

// MCP Agents table for persistent agent storage
export const mcpAgents = pgTable("mcp_agents", {
  id: uuid("id").primaryKey().defaultRandom(),
  mcpId: text("mcp_id").notNull().unique(), // mcp_personalizado_timestamp
  accountId: text("account_id").notNull(), // Used for external reference
  name: text("name").notNull(), // Agent display name
  business: text("business").notNull(), // Business name
  whatsapp: text("whatsapp"),
  agentType: agentTypeEnum("agent_type").notNull().default("essencial"),
  prompt: text("prompt").notNull(), // Full agent prompt
  knowledgeBase: text("knowledge_base").array(), // Array of knowledge strings
  testUrl: text("test_url").notNull(), // URL for testing the agent
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Blog Authors table
export const blogAuthors = pgTable("blog_authors", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  role: text("role").notNull(), // "Especialista em IA", "Gerente de Produto"
  bio: text("bio"),
  avatar: text("avatar"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Blog Categories table
export const blogCategories = pgTable("blog_categories", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description"),
  color: text("color").notNull().default("#6D7AFF"),
  articleCount: integer("article_count").default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

// Blog Posts table
export const blogPosts = pgTable("blog_posts", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  excerpt: text("excerpt"),
  content: text("content").notNull(),
  featuredImage: text("featured_image"),
  category: blogCategoryEnum("category").notNull(),
  tags: text("tags").array(),
  authorId: uuid("author_id").references(() => blogAuthors.id),
  status: blogStatusEnum("status").notNull().default("published"),
  readingTime: integer("reading_time"),
  seoTitle: text("seo_title"),
  seoDescription: text("seo_description"),
  internalLinks: text("internal_links").array(), // Links internos para /dashboard, /planos, etc.
  viewCount: integer("view_count").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  publishedAt: timestamp("published_at"),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).extend({
  password: z.string().min(6, "Senha deve ter pelo menos 6 caracteres"),
}).omit({
  id: true,
  createdAt: true,
  resetToken: true,
  resetTokenExpires: true,
  emailConfirmationToken: true,
});

export const insertStripeCustomerSchema = createInsertSchema(stripeCustomers).pick({
  userId: true,
  customerId: true,
});

export const insertStripeSubscriptionSchema = createInsertSchema(stripeSubscriptions).pick({
  customerId: true,
  subscriptionId: true,
  priceId: true,
  currentPeriodStart: true,
  currentPeriodEnd: true,
  cancelAtPeriodEnd: true,
  paymentMethodBrand: true,
  paymentMethodLast4: true,
  status: true,
});

export const insertPaymentTrackingSchema = createInsertSchema(paymentTracking).extend({
  id: z.string().uuid(),
  planType: z.enum(["essencial", "agenda", "conversao"]),
  phase: z.enum(["phase1", "phase2", "monthly"]),
  status: z.enum(["pending", "paid", "failed", "cancelled"]).default("pending"),
  amount: z.number().positive("Valor deve ser positivo"),
  currency: z.string().default("BRL"),
}).pick({
  id: true,
  userId: true,
  planType: true,
  phase: true,
  status: true,
  amount: true,
  currency: true,
  stripePaymentIntentId: true,
  stripeSessionId: true,
  dueDate: true,
  paidAt: true,
  nextBillingDate: true,
  adminSetDueDate: true,
  activationDate: true,
});

// Leads schemas
export const insertLeadSchema = createInsertSchema(leads).extend({
  id: z.string().uuid(),
  nomeCompleto: z.string().min(2, "Nome completo deve ter pelo menos 2 caracteres"),
  nomeNegocio: z.string().min(2, "Nome do negócio deve ter pelo menos 2 caracteres"),
  diferencial: z.string().min(10, "Diferencial deve ter pelo menos 10 caracteres"),
  status: z.enum(["new", "contacted", "qualified", "converted", "lost"]).default("new"),
}).pick({
  id: true,
  nomeCompleto: true,
  nomeNegocio: true,
  diferencial: true,
  email: true,
  whatsapp: true,
  mcpAgentId: true,
  testUrl: true,
  status: true,
  emailConfirmed: true,
  confirmationToken: true,
  confirmationTokenExpires: true,
});

export const insertClientRequestSchema = createInsertSchema(clientRequests).extend({
  id: z.string().uuid(),
  type: z.enum(["support", "feature", "bug", "billing", "integration"]),
  priority: z.enum(["low", "medium", "high", "urgent"]).default("medium"),
  status: z.enum(["open", "in_progress", "resolved", "closed"]).default("open"),
  title: z.string().min(5, "Título deve ter pelo menos 5 caracteres"),
  description: z.string().min(10, "Descrição deve ter pelo menos 10 caracteres"),
}).pick({
  id: true,
  userId: true,
  type: true,
  priority: true,
  status: true,
  title: true,
  description: true,
  agentType: true,
  attachments: true,
});

export const insertMcpAgentSchema = createInsertSchema(mcpAgents).extend({
  mcpId: z.string().min(1, "ID MCP é obrigatório"),
  accountId: z.string().min(1, "ID da conta é obrigatório"),
  name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  business: z.string().min(2, "Nome do negócio deve ter pelo menos 2 caracteres"),
  agentType: z.enum(["essencial", "agenda", "conversao"]).default("essencial"),
  prompt: z.string().min(50, "Prompt deve ser mais detalhado"),
  knowledgeBase: z.array(z.string()).default([]),
  testUrl: z.string().url("URL de teste deve ser válida"),
}).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Blog schemas
export const insertBlogPostSchema = createInsertSchema(blogPosts).extend({
  title: z.string().min(10, "Título deve ter pelo menos 10 caracteres"),
  slug: z.string().min(5, "Slug deve ter pelo menos 5 caracteres"),
  content: z.string().min(100, "Conteúdo deve ter pelo menos 100 caracteres"),
  category: z.enum(["ia-automacao", "casos-uso", "tutoriais", "mercado-tendencias"]),
  status: z.enum(["draft", "published", "archived"]).default("published"),
}).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  publishedAt: true,
  viewCount: true,
});

export const insertBlogAuthorSchema = createInsertSchema(blogAuthors).extend({
  name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  role: z.string().min(5, "Cargo deve ter pelo menos 5 caracteres"),
}).omit({
  id: true,
  createdAt: true,
});

export const insertBlogCategorySchema = createInsertSchema(blogCategories).extend({
  name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  slug: z.string().min(2, "Slug deve ter pelo menos 2 caracteres"),
}).omit({
  id: true,
  createdAt: true,
  articleCount: true,
});

// Auth schemas
export const loginSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(1, "Senha é obrigatória"),
});

export const signupSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "Senha deve ter pelo menos 6 caracteres"),
  fullName: z.string().min(2, "Nome deve ter pelo menos 2 caracteres").optional(),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email("Email inválido"),
});

export const resetPasswordSchema = z.object({
  token: z.string().min(1, "Token é obrigatório"),
  password: z.string().min(6, "Senha deve ter pelo menos 6 caracteres"),
});

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertStripeCustomer = z.infer<typeof insertStripeCustomerSchema>;
export type StripeCustomer = typeof stripeCustomers.$inferSelect;
export type InsertStripeSubscription = z.infer<typeof insertStripeSubscriptionSchema>;
export type StripeSubscription = typeof stripeSubscriptions.$inferSelect;
export type InsertPaymentTracking = z.infer<typeof insertPaymentTrackingSchema>;
export type PaymentTracking = typeof paymentTracking.$inferSelect;
export type InsertLead = z.infer<typeof insertLeadSchema>;
export type Lead = typeof leads.$inferSelect;
export type InsertClientRequest = z.infer<typeof insertClientRequestSchema>;
export type ClientRequest = typeof clientRequests.$inferSelect;
export type InsertMcpAgent = z.infer<typeof insertMcpAgentSchema>;
export type McpAgent = typeof mcpAgents.$inferSelect;

// Blog types
export type BlogPost = typeof blogPosts.$inferSelect;
export type InsertBlogPost = z.infer<typeof insertBlogPostSchema>;
export type BlogAuthor = typeof blogAuthors.$inferSelect;
export type InsertBlogAuthor = z.infer<typeof insertBlogAuthorSchema>;
export type BlogCategory = typeof blogCategories.$inferSelect;
export type InsertBlogCategory = z.infer<typeof insertBlogCategorySchema>;

// Auth types
export type LoginInput = z.infer<typeof loginSchema>;
export type SignupInput = z.infer<typeof signupSchema>;
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
