
import { useEffect, useCallback } from 'react';
import { useGlobalState } from '@/utils/stateManager';
import { Session } from '@supabase/supabase-js';

// Simplified User interface
export interface User {
  id: string;
  email: string;
  name: string;
  photoUrl?: string;
}

export interface AuthState {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | null;
}

// --- MOCK IMPLEMENTATION --- 
const MOCK_USER: User = {
    id: 'mock-user-123',
    name: 'Test User',
    email: 'test@test.com',
    photoUrl: 'https://i.pravatar.cc/150?u=a042581f4e29026704d' // A random avatar
};

export function useAuth() {
  const [authState, setAuthState] = useGlobalState<AuthState>('auth', {
    user: null,
    session: null,
    isLoading: true,
    isAuthenticated: false,
    error: null
  });

  // Simulate loading and authentication
  useEffect(() => {
    const timer = setTimeout(() => {
        setAuthState({
            user: MOCK_USER,
            session: {} as Session, // Mock session object
            isAuthenticated: true,
            isLoading: false,
            error: null,
        });
    }, 1500); // Simulate a network delay

    return () => clearTimeout(timer);
  }, [setAuthState]);

  const signIn = useCallback(async (email: string, password: string) => {
    setAuthState(prev => ({ ...prev, isLoading: true, error: null }));
    console.log('Mock Sign In with:', email);
    // Immediately simulate success
    setTimeout(() => {
        setAuthState({
            user: MOCK_USER,
            session: {} as Session,
            isAuthenticated: true,
            isLoading: false,
            error: null,
        });
    }, 1000);
  }, [setAuthState]);

  const signUp = useCallback(async (email: string, password: string, name: string) => {
    setAuthState(prev => ({ ...prev, isLoading: true, error: null }));
    console.log('Mock Sign Up with:', email, name);
    // Immediately simulate success
     setTimeout(() => {
        const newUser = { ...MOCK_USER, email, name };
        setAuthState({
            user: newUser,
            session: {} as Session, 
            isAuthenticated: true, 
            isLoading: false, 
            error: null
        });
    }, 1000);
  }, [setAuthState]);

  const signOut = useCallback(async () => {
    setAuthState(prev => ({ ...prev, isLoading: true }));
     // Immediately simulate sign out
    setTimeout(() => {
        setAuthState({
            user: null,
            session: null,
            isAuthenticated: false,
            isLoading: false,
            error: null
        });
    }, 500);
  }, [setAuthState]);

  return { ...authState, signIn, signUp, signOut };
}
