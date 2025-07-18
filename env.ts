import { z } from "zod";

// Simple environment schema for the migrated application
const envSchema = z.object({
  VITE_API_URL: z.string().optional().default(""),
});

// Parse environment variables safely
const validatedEnv = envSchema.parse(import.meta.env);

// App configuration
export const config = {
  // API configuration
  apiUrl: validatedEnv.VITE_API_URL || (typeof window !== 'undefined' ? window.location.origin : ''),
  
  // Base URL for redirects
  baseUrl: typeof window !== 'undefined' ? window.location.origin : '',
  
  // API timeouts
  apiTimeouts: {
    default: 10000, // 10 seconds
    auth: 15000     // 15 seconds for auth operations
  },
  
  // Environment settings (migrated from Supabase)
  emailConfirmation: false, // Disabled for Express.js auth
  autoSignIn: false,
  debugLogging: import.meta.env.DEV,
  mockServices: false
};

// Export appConfig as an alias for backward compatibility
export const appConfig = config;

// Export current environment
export const currentEnvironment = import.meta.env.MODE || 'development';

// Legacy exports for compatibility - these will be removed
export const env = {
  SUPABASE_URL: '',
  SUPABASE_ANON_KEY: '',
};

export const isSupabaseConfigured = false;