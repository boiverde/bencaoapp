import { useState, useEffect, useCallback } from 'react';
import { Platform } from 'react-native';
import { useGlobalState } from '@/utils/stateManager';
import { SecureStorage } from '@/utils/secureStorage';
import { RealAuthService } from '@/utils/realAuthService';
import { supabase } from '@/utils/supabase';
// FORÇAR LOGOUT PARA DEBUG
const FORCE_LOGOUT = false;
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

// Toggle between mock and real auth
const USE_REAL_AUTH = process.env.EXPO_PUBLIC_SUPABASE_URL && process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

export function useAuth() {
  const [authState, setAuthState] = useGlobalState<AuthState>('auth', {
    user: null,
    isLoading: true,
    isAuthenticated: false,
    error: null
  }, { key: 'auth_state' });

  // Initialize auth state from storage
  useEffect(() => {
    const initAuth = async () => {
      try {
        if (USE_REAL_AUTH) {
          // Use real Supabase auth
          const { user, error } = await RealAuthService.getCurrentSession();
          
          if (user) {
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
              error: error
            });
          }
        } else {
          // Use mock auth for development
          const token = await SecureStorage.getItem('auth_token');
          
          if (token) {
            const userData = await SecureStorage.getItem('auth_user');
            
            if (userData) {
              const user = JSON.parse(userData);
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
            setAuthState({
              user: null,
              isLoading: false,
              isAuthenticated: false,
              error: null
            });
          }
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
        setAuthState({
          user: null,
          isLoading: false,
          isAuthenticated: false,
          error: 'Falha ao inicializar autenticação'
        });
      }
    };
    
    initAuth();
  }, []);

  const signIn = useCallback(async (email: string, password: string): Promise<boolean> => {
    try {
      setAuthState({
        ...authState,
        isLoading: true,
        error: null
      });
      
      if (USE_REAL_AUTH) {
        // Use real Supabase auth
        const { user, error } = await RealAuthService.signIn(email, password);
        
        if (user) {
          setAuthState({
            user,
            isLoading: false,
            isAuthenticated: true,
            error: null
          });
          return true;
        } else {
          setAuthState({
            ...authState,
            isLoading: false,
            error: error || 'Erro ao fazer login'
          });
          return false;
        }
      } else {
        // Mock auth for development
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        if ((email === 'aguiar.neves@hotmail.com' && password === '12345678') || 
            (email === 'demo@example.com' && password === 'password')) {
          const mockUser: User = {
            id: 'user_1',
            email: email,
            name: email === 'aguiar.neves@hotmail.com' ? 'Admin User' : 'Ana Clara',
            photoUrl: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg',
            emailVerified: true,
            phoneVerified: true,
            createdAt: Date.now() - (30 * 24 * 60 * 60 * 1000)
          };
          
          await SecureStorage.saveItem('auth_user', JSON.stringify(mockUser));
          await SecureStorage.saveItem('auth_token', 'mock_token');
          
          setAuthState({
            user: mockUser,
            isLoading: false,
            isAuthenticated: true,
            error: null
          });
          
          return true;
        } else {
          setAuthState({
            ...authState,
            isLoading: false,
            error: 'Email ou senha inválidos'
          });
          return false;
        }
      }
    } catch (error) {
      console.error('Sign in error:', error);
      setAuthState({
        ...authState,
        isLoading: false,
        error: 'Erro ao fazer login. Tente novamente.'
      });
      return false;
    }
  }, [authState, setAuthState]);

  const signUp = useCallback(async (
    email: string, 
    password: string, 
    name: string
  ): Promise<boolean> => {
    try {
      setAuthState({
        ...authState,
        isLoading: true,
        error: null
      });
      
      if (USE_REAL_AUTH) {
        // Use real Supabase auth
        const { user, error } = await RealAuthService.signUp(email, password, name);
        
        if (user) {
          setAuthState({
            user,
            isLoading: false,
            isAuthenticated: true,
            error: null
          });
          return true;
        } else {
          setAuthState({
            ...authState,
            isLoading: false,
            error: error || 'Erro ao criar conta'
          });
          return false;
        }
      } else {
        // Mock auth for development
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        const mockUser: User = {
          id: 'user_' + Date.now(),
          email,
          name,
          emailVerified: false,
          phoneVerified: false,
          createdAt: Date.now()
        };
        
        await SecureStorage.saveItem('auth_user', JSON.stringify(mockUser));
        await SecureStorage.saveItem('auth_token', 'mock_token');
        
        setAuthState({
          user: mockUser,
          isLoading: false,
          isAuthenticated: true,
          error: null
        });
        
        return true;
      }
    } catch (error) {
      console.error('Sign up error:', error);
      setAuthState({
        ...authState,
        isLoading: false,
        error: 'Erro ao criar conta. Tente novamente.'
      });
      return false;
    }
  }, [authState, setAuthState]);

  const signOut = useCallback(async (): Promise<void> => {
    try {
      if (USE_REAL_AUTH) {
        // Use real Supabase auth
        const { error } = await RealAuthService.signOut();
        if (error) {
          setAuthState({
            ...authState,
            error: error
          });
          return;
        }
      } else {
        // Mock auth cleanup
        await SecureStorage.deleteItem('auth_user');
        await SecureStorage.deleteItem('auth_token');
      }
      
      setAuthState({
        user: null,
        isLoading: false,
        isAuthenticated: false,
        error: null
      });
    } catch (error) {
      console.error('Sign out error:', error);
      setAuthState({
        ...authState,
        error: 'Erro ao sair. Tente novamente.'
      });
    }
  }, [authState, setAuthState]);

  const updateUser = useCallback(async (userData: Partial<User>): Promise<boolean> => {
    try {
      if (!authState.user) {
        return false;
      }
      
      // Update user data
      const updatedUser = {
        ...authState.user,
        ...userData
      };
      
      // Save updated user data
      await SecureStorage.saveItem('auth_user', JSON.stringify(updatedUser));
      
      setAuthState({
        ...authState,
        user: updatedUser
      });
      
      return true;
    } catch (error) {
      console.error('Update user error:', error);
      setAuthState({
        ...authState,
        error: 'Erro ao atualizar perfil. Tente novamente.'
      });
      return false;
    }
  }, [authState, setAuthState]);

  const resetPassword = useCallback(async (email: string): Promise<boolean> => {
    try {
      setAuthState({
        ...authState,
        isLoading: true,
        error: null
      });
      
      if (USE_REAL_AUTH) {
        // Use real Supabase auth
        const { error } = await RealAuthService.resetPassword(email);
        
        setAuthState({
          ...authState,
          isLoading: false,
          error: error
        });
        
        return !error;
      } else {
        // Mock password reset
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        setAuthState({
          ...authState,
          isLoading: false
        });
        
        return true;
      }
    } catch (error) {
      console.error('Reset password error:', error);
      setAuthState({
        ...authState,
        isLoading: false,
        error: 'Erro ao redefinir senha. Tente novamente.'
      });
      return false;
    }
  }, [authState, setAuthState]);

  const verifyEmail = useCallback(async (): Promise<boolean> => {
    try {
      if (!authState.user) {
        return false;
      }
      
      setAuthState({
        ...authState,
        isLoading: true,
        error: null
      });
      
      // In a real app, this would call an API
      // For now, we'll simulate sending a verification email
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setAuthState({
        ...authState,
        isLoading: false
      });
      
      return true;
    } catch (error) {
      console.error('Verify email error:', error);
      setAuthState({
        ...authState,
        isLoading: false,
        error: 'Erro ao enviar email de verificação. Tente novamente.'
      });
      return false;
    }
  }, [authState, setAuthState]);

  const verifyPhone = useCallback(async (phoneNumber: string): Promise<boolean> => {
    try {
      if (!authState.user) {
        return false;
      }
      
      setAuthState({
        ...authState,
        isLoading: true,
        error: null
      });
      
      // In a real app, this would call an API
      // For now, we'll simulate sending a verification code
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setAuthState({
        ...authState,
        isLoading: false
      });
      
      return true;
    } catch (error) {
      console.error('Verify phone error:', error);
      setAuthState({
        ...authState,
        isLoading: false,
        error: 'Erro ao enviar código de verificação. Tente novamente.'
      });
      return false;
    }
  }, [authState, setAuthState]);

  const signInAsAdmin = useCallback(async (isAdmin: boolean): Promise<void> => {
    // This is for admin functionality - keep as mock for now
    try {
      await SecureStorage.saveItem('is_admin', isAdmin.toString());
    } catch (error) {
      console.error('Error setting admin status:', error);
    }
  }, []);

  // Listen to auth state changes (only for real auth)
  useEffect(() => {
    if (USE_REAL_AUTH) {
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

  return {
    user: authState.user,
    isLoading: authState.isLoading,
    isAuthenticated: authState.isAuthenticated,
    error: authState.error,
    signIn,
    signUp,
    signOut,
    updateUser,
    resetPassword,
    verifyEmail,
    verifyPhone,
    signInAsAdmin
  };
}
