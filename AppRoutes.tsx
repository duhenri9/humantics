import { lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from '../components/ProtectedRoute';

// Lazy load main pages for better performance
const LandingPage = lazy(() => import('../pages/LandingPage'));
const ClientDashboard = lazy(() => import('../pages/ClientDashboard'));
const Dashboard = lazy(() => import('../pages/Dashboard'));
const AgentBuilder = lazy(() => import('../pages/AgentBuilder'));
const Analytics = lazy(() => import('../pages/Analytics'));
const Settings = lazy(() => import('../pages/Settings'));
const Billing = lazy(() => import('../pages/Billing'));
const AdminUserManagement = lazy(() => import('../pages/AdminUserManagement'));
const AdminPortal = lazy(() => import('../pages/AdminPortal'));
const AdminLibrary = lazy(() => import('../pages/AdminLibrary'));
const ClientRequests = lazy(() => import('../pages/admin/ClientRequests'));
const PaymentManagement = lazy(() => import('../pages/admin/PaymentManagement'));
const Support = lazy(() => import('../pages/Support'));
const PaymentHistory = lazy(() => import('../pages/PaymentHistory'));
const AgentTestBasic = lazy(() => import('../pages/AgentTestBasic'));
const AgentCustomization = lazy(() => import('../pages/AgentCustomization'));

const EmailConfirmation = lazy(() => import('../pages/EmailConfirmation'));
const TestAgent = lazy(() => import('../pages/TestAgent'));
const WhatsAppAtendimento = lazy(() => import('../pages/WhatsAppAtendimento'));
const WhatsAppQRCode = lazy(() => import('../pages/WhatsAppQRCode'));
const BlogPage = lazy(() => import('../pages/BlogPage'));
const BlogArticlePage = lazy(() => import('../pages/BlogArticlePage'));

// Lazy load client components
const ClientArea = lazy(() => import('../components/client/ClientArea'));
const EntryForm = lazy(() => import('../components/client/EntryForm'));
const JourneyDashboard = lazy(() => import('../components/client/JourneyDashboard'));
const AdjustmentsForm = lazy(() => import('../components/client/AdjustmentsForm'));
const OptionalIntegrations = lazy(() => import('../components/client/OptionalIntegrations'));
const MonthlyReport = lazy(() => import('../components/client/MonthlyReport'));

// Lazy load auth components
const LoginPage = lazy(() => import('../components/auth/LoginPage'));
const SignupPage = lazy(() => import('../components/auth/SignupPage'));
const ForgotPasswordPage = lazy(() => import('../components/auth/ForgotPasswordPage'));
const ResetPasswordPage = lazy(() => import('../components/auth/ResetPasswordPage'));

// Test page removed for production optimization

// 404 Page
const NotFound = lazy(() => import('../pages/NotFound'));

export default function AppRoutes() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/blog" element={<BlogPage />} />
      <Route path="/blog/:slug" element={<BlogArticlePage />} />
      <Route path="/personalizar-agente" element={<AgentCustomization />} />

      <Route path="/agent/teste/:id" element={<AgentTestBasic />} />
      <Route path="/confirmar-email/:token" element={<EmailConfirmation />} />
      <Route path="/test-agent" element={<TestAgent />} />
      
      {/* Test Route - Accessible to everyone for testing */}
      {/* Test route removed for production optimization */}
      
      {/* Auth Routes */}
      <Route path="/auth/login" element={<LoginPage />} />
      <Route path="/auth/signup" element={<SignupPage />} />
      <Route path="/auth/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/auth/reset-password" element={<ResetPasswordPage />} />
      
      {/* Client Routes - Protected */}
      <Route element={<ProtectedRoute allowedRoles={['client']} redirectTo="/auth/login" />}>
        <Route path="/dashboard" element={<ClientDashboard />} />
        <Route path="/billing" element={<Billing />} />
        <Route path="/payment-history" element={<PaymentHistory />} />
        <Route path="/support" element={<Support />} />
        <Route path="/settings" element={<Settings />} />
      </Route>

      {/* Admin Routes - Protected */}
      <Route element={<ProtectedRoute allowedRoles={['admin']} redirectTo="/auth/login" />}>
        <Route path="/admin/dashboard" element={<Dashboard />} />
        <Route path="/builder" element={<AgentBuilder />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/admin/users" element={<AdminUserManagement />} />
        <Route path="/admin/requests" element={<ClientRequests />} />
        <Route path="/admin/payments" element={<PaymentManagement />} />
        <Route path="/admin/portal" element={<AdminPortal />} />
        <Route path="/admin/library" element={<AdminLibrary />} />
        <Route path="/whatsapp-atendimento" element={<WhatsAppAtendimento />} />
        <Route path="/whatsapp-qr" element={<WhatsAppQRCode />} />
      </Route>
      
      {/* Client Area Routes - Protected for clients and admins */}
      <Route element={<ProtectedRoute allowedRoles={['client', 'admin']} redirectTo="/auth/login" />}>
        <Route path="/client-area" element={<ClientArea />}>
          <Route index element={<JourneyDashboard />} />
          <Route path="journey" element={<JourneyDashboard />} />
          <Route path="agent-test" element={<div>Agent Test - Em desenvolvimento</div>} />
          <Route path="adjustments" element={<AdjustmentsForm />} />
          <Route path="integrations" element={<OptionalIntegrations />} />
          <Route path="reports" element={<MonthlyReport />} />
        </Route>
      </Route>

      {/* Entry Form - Accessible to guests and existing users */}
      <Route path="/client-area/entry-form" element={<EntryForm />} />
      
      {/* 404 Route */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}