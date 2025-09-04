import { useState, useEffect, useCallback } from 'react';
import { useGlobalState } from '@/utils/stateManager';

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

// MOCK USERS para teste
const MOCK_USERS = [
  {
    email: 'demo@example.com',
    password: 'password',
    user: {
      id: '1',
      email: 'demo@example.com',
      name: 'Usuário Demo',
      photoUrl: undefined,
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
      name: 'Usuário Teste',
      photoUrl: undefined,
      emailVerified: true,
      phoneVerified: false,
      createdAt: Date.now()
    }
  }
];

export function useAuth() {
  const [authState, setAuthState] = useGlobalState<AuthState>('auth', {
    user: null,
    isLoading: false,
    isAuthenticated: false,
    error: null
  });

  // Simulate login
  const login = useCallback(async (email: string, password: string) => {
    setAuthState(prev => ({ ...prev, isLoading: true, error: null }));
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const mockUser = MOCK_USERS.find(u => u.email === email && u.password === password);
    
    if (mockUser) {
      setAuthState({
        user: mockUser.user,
        isLoading: false,
        isAuthenticated: true,
        error: null
      });
      return { user: mockUser.user, error: null };
    } else {
      setAuthState(prev => ({
        ...prev,
        isLoading: false,
        error: 'Email ou senha incorretos'
      }));
      return { user: null, error: 'Email ou senha incorretos' };
    }
  }, [setAuthState]);

  // Simulate signup
  const signUp = useCallback(async (email: string, password: string, name: string) => {
    setAuthState(prev => ({ ...prev, isLoading: true, error: null }));
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const newUser: User = {
      id: Date.now().toString(),
      email,
      name,
      emailVerified: false,
      phoneVerified: false,
      createdAt: Date.now()
    };
    
    setAuthState({
      user: newUser,
      isLoading: false,
      isAuthenticated: true,
      error: null
    });
    
    return { user: newUser, error: null };
  }, [setAuthState]);

  // Logout
  const logout = useCallback(async () => {
    setAuthState({
      user: null,
      isLoading: false,
      isAuthenticated: false,
      error: null
    });
  }, [setAuthState]);

  return {
    ...authState,
    login,
    signUp,
    logout
  };
}
