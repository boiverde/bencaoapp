import { createClient } from '@supabase/supabase-js';
import Constants from 'expo-constants';

if (!Constants.expoConfig?.extra?.supabaseUrl) {
  throw new Error('supabaseUrl is required in app.json extra config');
}

if (!Constants.expoConfig?.extra?.supabaseAnonKey) {
  throw new Error('supabaseAnonKey is required in app.json extra config');
}

// Create a single supabase client for interacting with your database
export const supabase = createClient(
  Constants.expoConfig.extra.supabaseUrl,
  Constants.expoConfig.extra.supabaseAnonKey
);