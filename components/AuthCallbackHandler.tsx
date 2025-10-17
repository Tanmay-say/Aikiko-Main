'use client';

import { useEffect } from 'react';
import { createClient } from '@/lib/supabase-client';

export function AuthCallbackHandler() {
  useEffect(() => {
    const handleRedirect = async () => {
      if (window.location.href.includes('code=')) {
        console.log('🔄 Processing Supabase OAuth redirect...');
        console.log('📍 Current URL:', window.location.href);
        
        try {
          const supabase = createClient();
          
          // Use the new exchangeCodeForSession method (Supabase v2)
          const { data, error } = await supabase.auth.exchangeCodeForSession(window.location.href);
          
          if (error) {
            console.error('❌ OAuth Error:', error);
            console.error('❌ Error details:', error.message);
          } else {
            console.log('✅ Session stored successfully:', data);
            
            // Clean URL after successful auth
            const cleanUrl = window.location.origin + window.location.pathname;
            window.history.replaceState({}, '', cleanUrl);
            console.log('🧹 URL cleaned after successful auth');
          }
        } catch (error) {
          console.error('❌ Unexpected OAuth error:', error);
        }
      }
    };

    handleRedirect();
  }, []);

  // This component doesn't render anything - it just handles the OAuth callback
  return null;
}
