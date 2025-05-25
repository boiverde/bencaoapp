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
    supabase.auth.getSession().then(({ data: { session } }) => {
      safeSetState(() => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      });
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      safeSetState(() => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);

        // Redirect based on auth state
        if (session) {
          router.replace('/(tabs)');
        } else {
          router.replace('/(auth)/login');
        }
      });
    });

    // Cleanup function
    return () => {
      isMounted.current = false;
      subscription.unsubscribe();
    };
  }, []);

  return {
    session,
    user,
    loading,
  };
}