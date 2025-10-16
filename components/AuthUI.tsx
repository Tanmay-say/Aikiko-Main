'use client';

import { useState } from 'react';
import { useAuth } from './AuthProvider';
import { Mail, LogOut, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

function GoogleIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" width="1em" height="1em" aria-hidden="true" {...props}>
      <path fill="#EA4335" d="M12 10.2v3.92h5.45c-.24 1.27-1.46 3.72-5.45 3.72-3.28 0-5.95-2.71-5.95-6.06S8.72 5.72 12 5.72c1.87 0 3.13.8 3.85 1.49l2.62-2.53C17.12 3.17 14.8 2.2 12 2.2 6.98 2.2 2.9 6.28 2.9 11.3s4.08 9.1 9.1 9.1c5.26 0 8.74-3.7 8.74-8.92 0-.6-.06-1.06-.14-1.53H12z"/>
    </svg>
  );
}

export default function AuthUI() {
  const { supabase } = useAuth();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const signInWithGoogle = async () => {
    setLoading(true);
    setError('');
    try {
      await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: { redirectTo: typeof window !== 'undefined' ? window.location.origin : undefined },
      });
    } catch (err: any) {
      setError(err.message || 'Google sign-in failed');
    } finally {
      setLoading(false);
    }
  };

  const signInMagic = async () => {
    if (!email) return;
    setLoading(true);
    setError('');
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: { emailRedirectTo: typeof window !== 'undefined' ? window.location.origin : undefined },
      });
      if (error) throw error;
      setSent(true);
    } catch (err: any) {
      setError(err.message || 'Magic link failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-[#D65A31] to-[#FFB800] flex items-center justify-center">
          <User className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-foreground mb-2">Welcome to Aikiko</h2>
        <p className="text-foreground/60">Sign in to start monitoring with AI agents</p>
      </div>

      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-red-500/10 border border-red-500/20 rounded-xl p-3 text-red-500 text-sm"
          >
            {error}
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileTap={{ scale: 0.98 }}
        whileHover={{ scale: 1.02 }}
        onClick={signInWithGoogle}
        disabled={loading}
        className="w-full bg-white text-black dark:bg-background dark:text-foreground border border-border py-4 rounded-2xl font-semibold flex items-center justify-center gap-3 shadow-lg hover:shadow-xl transition-all"
      >
        <GoogleIcon className="w-5 h-5" /> 
        {loading ? 'Connecting...' : 'Continue with Google'}
      </motion.button>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-border"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-background text-foreground/60">or</span>
        </div>
      </div>

      <div className="space-y-3">
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          className="w-full bg-card border border-border px-4 py-4 rounded-2xl text-foreground placeholder:text-foreground/40 focus:border-[#D65A31] focus:ring-2 focus:ring-[#D65A31]/20 outline-none transition-all"
        />
        <motion.button
          whileTap={{ scale: 0.98 }}
          whileHover={{ scale: 1.02 }}
          onClick={signInMagic}
          disabled={loading || !email}
          className="w-full bg-[#D65A31] text-white py-4 rounded-2xl font-semibold flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transition-all disabled:opacity-50"
        >
          <Mail size={18} />
          {loading ? 'Sending...' : 'Send Magic Link'}
        </motion.button>
      </div>

      <AnimatePresence>
        {sent && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-green-500/10 border border-green-500/20 rounded-xl p-3 text-green-500 text-sm text-center"
          >
            ✨ Magic link sent! Check your inbox and click the link to sign in.
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function AuthUserMenu() {
  const { user, supabase } = useAuth();
  
  if (!user) return null;

  return (
    <div className="flex items-center gap-3">
      {user.user_metadata?.avatar_url && (
        <img 
          src={user.user_metadata.avatar_url} 
          alt={user.user_metadata.full_name || 'Avatar'} 
          className="w-8 h-8 rounded-full border border-border" 
        />
      )}
      <span className="text-foreground font-medium">{user.user_metadata?.full_name || user.email}</span>
      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={() => supabase.auth.signOut()}
        className="p-2 rounded-xl border border-border text-foreground/60 hover:text-foreground hover:border-[#D65A31] transition-colors"
        title="Sign out"
      >
        <LogOut size={16} />
      </motion.button>
    </div>
  );
}


