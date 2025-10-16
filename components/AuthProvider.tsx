'use client';

import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { createClient } from '@supabase/supabase-js';

type AuthContextValue = {
  user: any | null;
  supabase: any; // keep loose to avoid generic incompatibilities across versions
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const supabase = useMemo(
    () => createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!),
    []
  );
  const [user, setUser] = useState<any | null>(null);
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    // If redirected back with hash (/#access_token=...), let Supabase parse it
    const handleHashSession = async () => {
      try {
        if (typeof window !== 'undefined' && window.location.hash && window.location.hash.includes('access_token')) {
          await supabase.auth.getSession();
          // Clean URL to remove tokens
          const url = new URL(window.location.href);
          window.history.replaceState({}, '', url.origin + url.pathname);
        }
      } catch (e) {
        console.error('Auth hash handling error:', e);
      }
    };

    handleHashSession().finally(async () => {
      const { data } = await supabase.auth.getSession();
      setUser(data.session?.user ?? null);
      setInitializing(false);
    });
    const { data: sub } = supabase.auth.onAuthStateChange(async (event, session) => {
      setUser(session?.user ?? null);
      if (typeof window !== 'undefined' && (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED')) {
        const url = new URL(window.location.href);
        if (url.hash) {
          window.history.replaceState({}, '', url.origin + url.pathname);
        }
      }
    });
    return () => {
      sub.subscription.unsubscribe();
    };
  }, [supabase]);

  return (
    <AuthContext.Provider value={{ user, supabase }}>{children}</AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}


