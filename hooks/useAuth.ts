
import { useEffect, useCallback } from 'react';
import { useGlobalState } from '@/utils/stateManager';
import { Session, User as SupabaseUser } from '@supabase/supabase-js';
import { supabase } from '@/utils/supabase';

// Define a nossa própria interface de Utilizador para desacoplar da implementação do Supabase
export interface User {
  id: string;
  email?: string;
  name?: string;
  photoUrl?: string;
}

export interface AuthState {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | null;
}

// Mapeia o utilizador do Supabase para o nosso modelo de Utilizador interno
const mapSupabaseUserToUser = (supabaseUser: SupabaseUser, profile: any = {}): User => {
  return {
    id: supabaseUser.id,
    email: supabaseUser.email,
    name: profile.full_name || supabaseUser.email, // Usa o nome do perfil, senão o email
    photoUrl: profile.avatar_url,
  };
};

export function useAuth() {
  const [authState, setAuthState] = useGlobalState<AuthState>('auth', {
    user: null,
    session: null,
    isLoading: true, // Começa como true para verificar a sessão existente
    isAuthenticated: false,
    error: null,
  });

  // Efeito para verificar e restaurar a sessão no arranque da aplicação
  useEffect(() => {
    const fetchSession = async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error) {
        setAuthState(prev => ({ ...prev, error: error.message, isLoading: false }));
        return;
      }

      if (session) {
        // Se há uma sessão, procura o perfil
        const { data: profile } = await supabase
          .from('profiles')
          .select('full_name, avatar_url')
          .eq('id', session.user.id)
          .single();
        
        const currentUser = mapSupabaseUserToUser(session.user, profile);
        setAuthState({ user: currentUser, session, isAuthenticated: true, isLoading: false, error: null });
      } else {
        setAuthState(prev => ({ ...prev, isLoading: false }));
      }
    };

    fetchSession();

    // Ouve as mudanças no estado de autenticação
    const { data: authListener } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('full_name, avatar_url')
          .eq('id', session.user.id)
          .single();

        const currentUser = mapSupabaseUserToUser(session.user, profile);
        setAuthState({ user: currentUser, session, isAuthenticated: true, isLoading: false, error: null });
      } else {
        setAuthState({ user: null, session: null, isAuthenticated: false, isLoading: false, error: null });
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [setAuthState]);

  // Função de Login REAL
  const signIn = useCallback(async (email: string, password: string) => {
    setAuthState(prev => ({ ...prev, isLoading: true, error: null }));
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setAuthState(prev => ({ ...prev, isLoading: false, error: error.message }));
      return false;
    }
    
    if (data.session) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('full_name, avatar_url')
        .eq('id', data.user.id)
        .single();
      
      const currentUser = mapSupabaseUserToUser(data.user, profile);
      setAuthState({ user: currentUser, session: data.session, isAuthenticated: true, isLoading: false, error: null });
      return true;
    }
    
    return false;
  }, [setAuthState]);

  // Função de Registo REAL
  const signUp = useCallback(async (email: string, password: string, name: string) => {
    setAuthState(prev => ({ ...prev, isLoading: true, error: null }));
    
    // 1. Cria o utilizador na autenticação
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (authError) {
      setAuthState(prev => ({ ...prev, isLoading: false, error: authError.message }));
      return false;
    }

    if (!authData.user) {
        setAuthState(prev => ({ ...prev, isLoading: false, error: "Registo falhou, utilizador não criado." }));
        return false;
    }

    // 2. Cria o perfil na base de dados
    const { error: profileError } = await supabase
      .from('profiles')
      .insert([
        { id: authData.user.id, full_name: name, updated_at: new Date().toISOString() },
      ]);
      
    if (profileError) {
        // O ideal aqui seria apagar o utilizador recém-criado para consistência,
        // mas por agora, apenas reportamos o erro.
        setAuthState(prev => ({ ...prev, isLoading: false, error: `Utilizador criado, mas falha ao criar perfil: ${profileError.message}` }));
        return false;
    }

    // 3. Atualiza o estado da aplicação com os novos dados
    const currentUser = mapSupabaseUserToUser(authData.user, { full_name: name });
    setAuthState({ user: currentUser, session: authData.session, isAuthenticated: true, isLoading: false, error: null });
    
    return true;
  }, [setAuthState]);

  // Função de Logout REAL
  const signOut = useCallback(async () => {
    setAuthState(prev => ({ ...prev, isLoading: true }));
    const { error } = await supabase.auth.signOut();
    if (error) {
      // Mesmo que o logout falhe, limpamos o estado local
       setAuthState({ user: null, session: null, isAuthenticated: false, isLoading: false, error: error.message });
    } else {
       setAuthState({ user: null, session: null, isAuthenticated: false, isLoading: false, error: null });
    }
  }, [setAuthState]);

  return { ...authState, signIn, signUp, signOut };
}
