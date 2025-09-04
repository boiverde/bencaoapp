import { useState, useEffect, useCallback } from 'react';
import { useGlobalState } from '@/utils/stateManager';
import { supabase, isSupabaseConfigured } from '@/utils/supabase';
import { SecureStorage } from '@/utils/secureStorage';

export interface User {
  id: string;
  email: string;
  name: string;
  photoUrl?: string;
  emailVerified: boolean;
  phoneVerified: boolean;
  createdAt: number;
}

export interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | null;
}

// USUARIOS MOCK para teste
const MOCK_USERS = [
  {
    email: 'demo@example.com',
    password: 'password',
    user: {
      id: '1',
      email: 'demo@example.com',
      name: 'Usuario Demo',
      emailVerified: true,
      phoneVerified: false,
      createdAt: Date.now()
    }
  },
  {
    email: 'teste@gmail.com',
    password: '123456',
    user: {
      id: '2',
      email: 'teste@gmail.com',
      name: 'Usuario Teste',
      emailVerified: true,
      phoneVerified: false,
      createdAt: Date.now()
    }
  }
];

export function useAuth() {
  const [authState, setAuthState] = useGlobalState<AuthState>('auth', {
    user: null,
    isLoading: true,
    isAuthenticated: false,
    error: null
  });

  // Initialize auth state
  useEffect(() => {
    initializeAuth();
  }, []);

  const initializeAuth = async () => {
    try {
      if (isSupabaseConfigured) {
        // Use real Supabase auth
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (session?.user) {
          // Get user profile
          const { data: profile } = await supabase
            .from('users')
            .select('*')
            .eq('id', session.user.id)
            .single();

          const user: User = {
            id: session.user.id,
            email: session.user.email!,
            name: profile?.name || session.user.user_metadata?.name || '',
            photoUrl: profile?.photos?.[0],
            emailVerified: session.user.email_confirmed_at !== null,
            phoneVerified: session.user.phone_confirmed_at !== null,
            createdAt: new Date(session.user.created_at).getTime()
          };

          setAuthState({
            user,
            isLoading: false,
            isAuthenticated: true,
            error: null
          });
        } else {
          setAuthState({
            user: null,
            isLoading: false,
            isAuthenticated: false,
            error: null
          });
        }
      } else {
        // Check for stored mock session
        const storedUser = await SecureStorage.getItem('mock_user');
        if (storedUser) {
          const user = JSON.parse(storedUser);
          setAuthState({
            user,
            isLoading: false,
            isAuthenticated: true,
            error: null
          });
        } else {
          setAuthState({
            user: null,
            isLoading: false,
            isAuthenticated: false,
            error: null
          });
        }
      }
    } catch (error) {
      console.error('Auth initialization error:', error);
      setAuthState({
        user: null,
        isLoading: false,
        isAuthenticated: false,
        error: 'Erro ao inicializar autenticação'
      });
    }
  };

  const signIn = useCallback(async (email: string, password: string): Promise<boolean> => {
    setAuthState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      if (isSupabaseConfigured) {
        // Use real Supabase auth
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) {
          setAuthState(prev => ({
            ...prev,
            isLoading: false,
            error: translateError(error.message)
          }));
          return false;
        }

        if (data.user) {
          // Get user profile
          const { data: profile } = await supabase
            .from('users')
            .select('*')
            .eq('id', data.user.id)
            .single();

          const user: User = {
            id: data.user.id,
            email: data.user.email!,
            name: profile?.name || data.user.user_metadata?.name || '',
            photoUrl: profile?.photos?.[0],
            emailVerified: data.user.email_confirmed_at !== null,
            phoneVerified: data.user.phone_confirmed_at !== null,
            createdAt: new Date(data.user.created_at).getTime()
          };

          setAuthState({
            user,
            isLoading: false,
            isAuthenticated: true,
            error: null
          });
          return true;
        }
      } else {
        // Use mock auth
        await new Promise(resolve => setTimeout(resolve, 1000));
        const mockUser = MOCK_USERS.find(u => u.email === email && u.password === password);
        
        if (mockUser) {
          await SecureStorage.saveItem('mock_user', JSON.stringify(mockUser.user));
          setAuthState({
            user: mockUser.user,
            isLoading: false,
            isAuthenticated: true,
            error: null
          });
          return true;
        } else {
          setAuthState(prev => ({
            ...prev,
            isLoading: false,
            error: 'Email ou senha incorretos'
          }));
          return false;
        }
      }
    } catch (error) {
      console.error('Sign in error:', error);
      setAuthState(prev => ({
        ...prev,
        isLoading: false,
        error: 'Erro interno. Tente novamente.'
      }));
      return false;
    }
    
    return false;
  }, [setAuthState]);

  const signUp = useCallback(async (email: string, password: string, name: string): Promise<boolean> => {
    setAuthState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      if (isSupabaseConfigured) {
        // Use real Supabase auth
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              name: name,
            },
          },
        });

        if (error) {
          setAuthState(prev => ({
            ...prev,
            isLoading: false,
            error: translateError(error.message)
          }));
          return false;
        }

        if (data.user) {
          // Create user profile
          const { error: profileError } = await supabase
            .from('users')
            .insert([
              {
                id: data.user.id,
                email: data.user.email!,
                name: name,
                created_at: new Date().toISOString(),
              },
            ]);

          if (profileError) {
            console.error('Profile creation error:', profileError);
          }

          const user: User = {
            id: data.user.id,
            email: data.user.email!,
            name: name,
            emailVerified: false,
            phoneVerified: false,
            createdAt: new Date(data.user.created_at).getTime()
          };

          setAuthState({
            user,
            isLoading: false,
            isAuthenticated: true,
            error: null
          });
          return true;
        }
      } else {
        // Use mock auth
        await new Promise(resolve => setTimeout(resolve, 1000));
        const newUser: User = {
          id: Date.now().toString(),
          email,
          name,
          emailVerified: false,
          phoneVerified: false,
          createdAt: Date.now()
        };
        
        await SecureStorage.saveItem('mock_user', JSON.stringify(newUser));
        setAuthState({
          user: newUser,
          isLoading: false,
          isAuthenticated: true,
          error: null
        });
        return true;
      }
    } catch (error) {
      console.error('Sign up error:', error);
      setAuthState(prev => ({
        ...prev,
        isLoading: false,
        error: 'Erro ao criar conta. Tente novamente.'
      }));
      return false;
    }
    
    return false;
  }, [setAuthState]);

  const signOut = useCallback(async (): Promise<void> => {
    try {
      if (isSupabaseConfigured) {
        await supabase.auth.signOut();
      } else {
        await SecureStorage.deleteItem('mock_user');
      }
    } catch (error) {
      console.error('Sign out error:', error);
    }
    
    setAuthState({
      user: null,
      isLoading: false,
      isAuthenticated: false,
      error: null
    });
  }, [setAuthState]);

  const resetPassword = useCallback(async (email: string): Promise<boolean> => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true, error: null }));
      
      if (isSupabaseConfigured) {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${process.env.EXPO_PUBLIC_WEBSITE_URL}/reset-password`,
        });

        setAuthState(prev => ({
          ...prev,
          isLoading: false,
          error: error ? translateError(error.message) : null
        }));
        
        return !error;
      } else {
        // Mock password reset
        await new Promise(resolve => setTimeout(resolve, 1000));
        setAuthState(prev => ({ ...prev, isLoading: false }));
        return true;
      }
    } catch (error) {
      console.error('Reset password error:', error);
      setAuthState(prev => ({
        ...prev,
        isLoading: false,
        error: 'Erro ao redefinir senha. Tente novamente.'
      }));
      return false;
    }
  }, [setAuthState]);

  const signInAsAdmin = useCallback(async (isAdmin: boolean): Promise<void> => {
    try {
      await SecureStorage.saveItem('is_admin', isAdmin.toString());
    } catch (error) {
      console.error('Error setting admin status:', error);
    }
  }, []);

  // Listen to auth state changes (only for real auth)
  useEffect(() => {
    if (isSupabaseConfigured) {
      const { data: { subscription } } = supabase.auth.onAuthStateChange(
        async (event, session) => {
          if (event === 'SIGNED_IN' && session?.user) {
            // User signed in
            const { data: profile } = await supabase
              .from('users')
              .select('*')
              .eq('id', session.user.id)
              .single();

            const user: User = {
              id: session.user.id,
              email: session.user.email!,
              name: profile?.name || session.user.user_metadata?.name || '',
              photoUrl: profile?.photos?.[0],
              emailVerified: session.user.email_confirmed_at !== null,
              phoneVerified: session.user.phone_confirmed_at !== null,
              createdAt: new Date(session.user.created_at).getTime()
            };

            setAuthState({
              user,
              isLoading: false,
              isAuthenticated: true,
              error: null
            });
          } else if (event === 'SIGNED_OUT') {
            // User signed out
            setAuthState({
              user: null,
              isLoading: false,
              isAuthenticated: false,
              error: null
            });
          }
        }
      );

      return () => {
        subscription.unsubscribe();
      };
    }
  }, [setAuthState]);

  const translateError = (errorMessage: string): string => {
    const errorMap: { [key: string]: string } = {
      'Invalid login credentials': 'Email ou senha inválidos',
      'Email not confirmed': 'Email não confirmado. Verifique sua caixa de entrada.',
      'User already registered': 'Este email já está cadastrado',
      'Password should be at least 6 characters': 'A senha deve ter pelo menos 6 caracteres',
      'Invalid email': 'Email inválido',
      'Network request failed': 'Erro de conexão. Verifique sua internet.',
      'Too many requests': 'Muitas tentativas. Tente novamente em alguns minutos.',
    };

    return errorMap[errorMessage] || errorMessage;
  };

  return {
    user: authState.user,
    isLoading: authState.isLoading,
    isAuthenticated: authState.isAuthenticated,
    error: authState.error,
    signIn,
    signUp,
    signOut,
    resetPassword,
    signInAsAdmin
  };
}