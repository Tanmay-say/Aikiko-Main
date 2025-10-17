import { createClient as createSupabaseClient, SupabaseClient } from '@supabase/supabase-js';

// Validate and extract environment variables
function getEnvVar(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(
      `Missing ${name} environment variable. ` +
      'Please set it in your .env.local file or deployment environment.'
    );
  }
  return value;
}

// Get validated environment variables
const supabaseUrl = getEnvVar('NEXT_PUBLIC_SUPABASE_URL');
const supabaseAnonKey = getEnvVar('NEXT_PUBLIC_SUPABASE_ANON_KEY');

// Create singleton client
let supabaseClient: SupabaseClient | null = null;

export function createClient(): SupabaseClient {
  if (!supabaseClient) {
    try {
      supabaseClient = createSupabaseClient(supabaseUrl, supabaseAnonKey, {
        auth: {
          autoRefreshToken: true,
          persistSession: true,
          detectSessionInUrl: true,
          flowType: 'pkce',
        },
      });
    } catch (error) {
      throw new Error(`Failed to create Supabase client: ${error}`);
    }
  }
  return supabaseClient;
}
