import { createClient as createSupabaseClient, SupabaseClient } from '@supabase/supabase-js';

// Get environment variables with fallbacks
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://ynzzkchwtioimzmjrnsd.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Temporary fallback anon key for testing (replace with your actual key)
const FALLBACK_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InluenprY2h3dGlvaW16bWpybnNkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzE0MjQ4MTcsImV4cCI6MjA0NzAwMDgxN30.YOUR_ACTUAL_ANON_KEY_HERE';

console.log('🔍 Supabase Config:', {
  url: supabaseUrl,
  hasAnonKey: !!supabaseAnonKey,
  anonKeyLength: supabaseAnonKey.length,
  usingFallback: !supabaseAnonKey
});

// Create singleton client
let supabaseClient: SupabaseClient | null = null;

export function createClient(): SupabaseClient {
  if (!supabaseClient) {
    try {
      const keyToUse = supabaseAnonKey || FALLBACK_ANON_KEY;
      
      if (!supabaseAnonKey) {
        console.warn('⚠️ NEXT_PUBLIC_SUPABASE_ANON_KEY is missing. Using fallback key.');
        console.warn('🔧 Set NEXT_PUBLIC_SUPABASE_ANON_KEY in Vercel environment variables.');
      }
      
      supabaseClient = createSupabaseClient(supabaseUrl, keyToUse, {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
          detectSessionInUrl: true,
          flowType: 'pkce',
          storageKey: 'aikiko-sb-auth',
          storage: typeof window !== 'undefined' ? window.localStorage : undefined,
        },
      });
      
      console.log('✅ Supabase client created successfully');
    } catch (error) {
      console.error('❌ Failed to create Supabase client:', error);
      // Return a mock client to prevent app crash
      return createSupabaseClient('https://mock.supabase.co', 'mock-key');
    }
  }
  return supabaseClient;
}
