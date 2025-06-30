import { useState, useEffect, useCallback } from 'react';
import { Platform } from 'react-native';
import { useGlobalState } from '@/utils/stateManager';
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

const AUTH_STORAGE_KEY = 'auth_user';
const TOKEN_STORAGE_KEY = 'auth_token';

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
        // Try to get the auth token
        const token = await SecureStorage.getItem(TOKEN_STORAGE_KEY);
        
        if (token) {
          // If we have a token, get the user data
          const userData = await SecureStorage.getItem(AUTH_STORAGE_KEY);
          
          if (userData) {
            const user = JSON.parse(userData);
            setAuthState({
              user,
              isLoading: false,
              isAuthenticated: true,
              error: null
            });
          } else {
            // Token exists but no user data
            setAuthState({
              user: null,
              isLoading: false,
              isAuthenticated: false,
              error: null
            });
          }
        } else {
          // No token, not authenticated
          setAuthState({
              user: null,
              isLoading: false,
              isAuthenticated: false,
              error: null
          });
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
      
      // In a real app, this would call an API
      // For now, we'll simulate a successful login with mock data
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Check credentials (mock validation)
      // Added support for the admin user
      if ((email === 'demo@example.com' && password === 'password') || 
          (email === 'aguiar.neves@hotmail.com' && password === '12345678')) {
        
        const mockUser: User = {
          id: 'user_1',
          email: email,
          name: email === 'aguiar.neves@hotmail.com' ? 'Admin User' : 'Ana Clara',
          photoUrl: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg',
          emailVerified: true,
          phoneVerified: true,
          createdAt: Date.now() - (30 * 24 * 60 * 60 * 1000) // 30 days ago
        };
        
        const mockToken = 'mock_jwt_token_' + Date.now();
        
        // Save user data and token
        await SecureStorage.saveItem(AUTH_STORAGE_KEY, JSON.stringify(mockUser));
        await SecureStorage.saveItem(TOKEN_STORAGE_KEY, mockToken);
        
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
      
      // In a real app, this would call an API
      // For now, we'll simulate a successful registration
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Create mock user
      const mockUser: User = {
        id: 'user_' + Date.now(),
        email,
        name,
        emailVerified: false,
        phoneVerified: false,
        createdAt: Date.now()
      };
      
      const mockToken = 'mock_jwt_token_' + Date.now();
      
      // Save user data and token
      await SecureStorage.saveItem(AUTH_STORAGE_KEY, JSON.stringify(mockUser));
      await SecureStorage.saveItem(TOKEN_STORAGE_KEY, mockToken);
      
      setAuthState({
        user: mockUser,
        isLoading: false,
        isAuthenticated: true,
        error: null
      });
      
      return true;
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
      // Clear auth data
      await SecureStorage.deleteItem(AUTH_STORAGE_KEY);
      await SecureStorage.deleteItem(TOKEN_STORAGE_KEY);
      
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
      await SecureStorage.saveItem(AUTH_STORAGE_KEY, JSON.stringify(updatedUser));
      
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
      
      // In a real app, this would call an API
      // For now, we'll simulate a successful password reset
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setAuthState({
        ...authState,
        isLoading: false
      });
      
      return true;
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
    verifyPhone
  };
}