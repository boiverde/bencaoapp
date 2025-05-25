import { createClient } from '@supabase/supabase-js';
import Constants from 'expo-constants';

// Create a single supabase client for interacting with your database
export const supabase = createClient(
  Constants.expoConfig?.extra?.supabaseUrl || '',
  Constants.expoConfig?.extra?.supabaseAnonKey || ''
);

// Auth helper functions
export const signUpWithEmail = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });
  return { data, error };
};

export const signInWithEmail = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  return { data, error };
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  return { error };
};