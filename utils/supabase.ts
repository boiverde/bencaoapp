import { createClient } from '@supabase/supabase-js';

// Configuracao segura para React Native
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || '';

// Cliente Supabase SEM localStorage problemático
export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co', 
  supabaseAnonKey || 'placeholder-key',
  {
    auth: {
      autoRefreshToken: true,
      persistSession: false, // Desabilitar para evitar localStorage
      detectSessionInUrl: false,
      storage: undefined // SEM localStorage
    },
  }
);

export const isSupabaseConfigured = !!(supabaseUrl && supabaseAnonKey);
console.log('Supabase configurado:', isSupabaseConfigured);
