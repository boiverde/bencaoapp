import { useEffect, useState, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import { Session, User } from '@supabase/supabase-js';
import { router } from 'expo-router';

export function useAuth() {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const isMounted = useRef(true);

  useEffect(() => {
    // Set up mounted ref
    isMounted.current = true;

    // Safe setState function that checks if component is mounted
    const safeSetState = (callback: () => void) => {
      if (isMounted.current) {
        callback();
      }
    };

    // Get initial session
    let subscription: { unsubscribe: () => void } | null = null;

    const initAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        safeSetState(() => {
          setSession(session);
          setUser(session?.user ?? null);
          setLoading(false);
        });

        // Listen for auth changes only after initial session is handled
        const { data: { subscription: sub } } = supabase.auth.onAuthStateChange((_event, session) => {
          if (isMounted.current) {
            setSession(session);
            setUser(session?.user ?? null);
            
            // Redirect based on auth state
            if (session) {
              router.replace('/(tabs)');
            } else {
              router.replace('/(auth)/login');
            }
          }
        });
        
        subscription = sub;
      } catch (error) {
        console.error('Auth initialization error:', error);
        safeSetState(() => setLoading(false));
      }
    };

    initAuth();

    // Cleanup function
    return () => {
      isMounted.current = false;
      if (subscription) {
        subscription.unsubscribe();
      }
    };
  }, []);

  return {
    session,
    user,
    loading,
  };
}