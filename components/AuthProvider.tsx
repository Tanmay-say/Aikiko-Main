'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase-client';
import { User, SupabaseClient } from '@supabase/supabase-js';

type AuthContextValue = {
  user: User | null;
  supabase: SupabaseClient;
  loading: boolean;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const supabase = createClient();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    
    const initializeAuth = async () => {
      try {
        // Handle OAuth redirect with code parameter
        if (typeof window !== 'undefined') {
          const urlParams = new URLSearchParams(window.location.search);
          const hashParams = new URLSearchParams(window.location.hash.substring(1));
          
          // Check for authorization code in URL params
          if (urlParams.has('code') || hashParams.has('access_token') || hashParams.has('refresh_token')) {
            console.log('🔄 Processing OAuth redirect...');
            
            // Let Supabase handle the session from URL
            const { data: { session }, error } = await supabase.auth.getSession();
            
            if (error) {
              console.error('❌ Session error:', error);
            } else if (session) {
              console.log('✅ Session established:', session.user.email);
            }
            
            // Clean URL after processing
            const cleanUrl = window.location.origin + window.location.pathname;
            window.history.replaceState({}, '', cleanUrl);
          }
        }

        // Get initial session
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) {
          console.error('Error getting session:', error);
        }
        
        if (mounted) {
          setUser(session?.user ?? null);
          setLoading(false);
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        if (mounted) {
          setLoading(false);
        }
      }
    };

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!mounted) return;
        
        console.log('🔄 Auth state change:', event, session?.user?.email);
        setUser(session?.user ?? null);
        
        // Clean URL on successful auth
        if (typeof window !== 'undefined' && 
            (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') && 
            (window.location.search || window.location.hash)) {
          const cleanUrl = window.location.origin + window.location.pathname;
          window.history.replaceState({}, '', cleanUrl);
          console.log('🧹 Cleaned URL after auth');
        }
      }
    );

    initializeAuth();

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [supabase]);

  return (
    <AuthContext.Provider value={{ user, supabase, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return ctx;
}