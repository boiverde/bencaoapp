import { createClient } from '@supabase/supabase-js';
import Constants from 'expo-constants';

// Create a single supabase client for interacting with your database
export const supabase = createClient(
  Constants.expoConfig?.extra?.supabaseUrl || '',
  Constants.expoConfig?.extra?.supabaseAnonKey || ''
);