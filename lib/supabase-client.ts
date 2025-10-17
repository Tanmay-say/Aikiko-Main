import { createClient as createSupabaseClient, SupabaseClient } from '@supabase/supabase-js';

// Get environment variables with fallbacks
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://ynzzkchwtioimzmjrnsd.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Create singleton client
let supabaseClient: SupabaseClient | null = null;

export function createClient(): SupabaseClient {
  if (!supabaseClient) {
    try {
      if (!supabaseAnonKey) {
        console.warn('⚠️ NEXT_PUBLIC_SUPABASE_ANON_KEY is missing. Auth will not work.');
      }
      
      supabaseClient = createSupabaseClient(supabaseUrl, supabaseAnonKey, {
        auth: {
          autoRefreshToken: true,
          persistSession: true,
          detectSessionInUrl: true,
          flowType: 'pkce',
        },
      });
    } catch (error) {
      console.error('❌ Failed to create Supabase client:', error);
      // Return a mock client to prevent app crash
      return createSupabaseClient('https://mock.supabase.co', 'mock-key');
    }
  }
  return supabaseClient;
}
