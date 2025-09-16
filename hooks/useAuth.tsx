import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Session, User } from '@supabase/supabase-js';

// Tipagem para o contexto de autenticação
interface AuthContextType {
  user: User | null;
  session: Session | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  signUp: (email: string, password, fullName: string) => Promise<boolean>;
  signIn: (email: string, password) => Promise<boolean>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Componente Provider com a tipagem correta para aceitar JSX
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setIsLoading(false);
    }).catch(err => {
      console.error("Erro ao obter sessão inicial:", err);
      setIsLoading(false);
    });

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      console.log("[useAuth] Auth state changed, event:", _event);
      setSession(session);
      setUser(session?.user ?? null);
      if (_event === 'SIGNED_OUT') {
        setError(null);
      }
    });

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  const signUp = async (email, password, fullName) => {
    console.log("[useAuth] Starting sign-up process...");
    setIsLoading(true);
    setError(null);
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    });

    if (error) {
      console.error("[useAuth] Supabase sign-up error:", error.message);
      setError(error.message);
      setIsLoading(false);
      return false;
    }
    
    console.log("[useAuth] Supabase sign-up successful. Data:", data);
    setIsLoading(false);
    return true;
  };

  const signIn = async (email, password) => {
    console.log("[useAuth] Starting sign-in process...");
    setIsLoading(true);
    setError(null);
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error("[useAuth] Supabase sign-in error:", error.message);
      setError(error.message);
      setIsLoading(false);
      console.log("[useAuth] Sign-in failed.");
      return false;
    }
    
    console.log("[useAuth] Supabase sign-in successful. Data:", data);
    setIsLoading(false);
    console.log("[useAuth] Sign-in process finished, returning true.");
    return true;
  };

  const signOut = async () => {
    console.log("[useAuth] Signing out...");
    setIsLoading(true);
    await supabase.auth.signOut();
    // O onAuthStateChange tratará de limpar o user e a session.
    setIsLoading(false);
    console.log("[useAuth] Signed out successfully.");
  };

  const value: AuthContextType = {
    user,
    session,
    isAuthenticated: !!user,
    isLoading,
    error,
    signUp,
    signIn,
    signOut,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
