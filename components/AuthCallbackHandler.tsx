'use client';

import { useEffect } from 'react';
import { createClient } from '@/lib/supabase-client';

export function AuthCallbackHandler() {
  useEffect(() => {
    async function handleOAuthRedirect() {
      // Only run if URL has OAuth parameters
      if (window.location.href.includes('code=') || 
          window.location.href.includes('access_token=') ||
          window.location.href.includes('refresh_token=')) {
        
        console.log('🔄 AuthCallbackHandler: Processing OAuth redirect...');
        console.log('📍 Current URL:', window.location.href);
        
        try {
          const supabase = createClient();
          
          // Get session from URL - this exchanges the OAuth code for tokens
          const { data: { session }, error } = await supabase.auth.getSession();
          
          if (error) {
            console.error('❌ AuthCallbackHandler OAuth Error:', error);
            console.error('❌ Error details:', error.message);
          } else if (session) {
            console.log('✅ AuthCallbackHandler: OAuth session established:', session.user.email);
            
            // Clean URL after successful auth
            const cleanUrl = window.location.origin + window.location.pathname;
            window.history.replaceState({}, '', cleanUrl);
            console.log('🧹 AuthCallbackHandler: URL cleaned');
          } else {
            console.log('⚠️ AuthCallbackHandler: No session found after OAuth redirect');
          }
        } catch (error) {
          console.error('❌ AuthCallbackHandler: Unexpected error:', error);
        }
      }
    }

    handleOAuthRedirect();
  }, []);

  // This component doesn't render anything - it just handles the OAuth callback
  return null;
}
