
import "react-native-url-polyfill/auto";
import { createClient, SupabaseClient } from "@supabase/supabase-js";

let supabaseClient: SupabaseClient | null = null;

const initializeSupabase = () => {
  if (supabaseClient) {
    return supabaseClient;
  }

  const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn(
      "Supabase URL or Anon Key is missing. Using placeholder values. " +
      "Make sure to set EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_ANON_KEY in your .env file."
    );
    supabaseClient = createClient(
      "https://placeholder.supabase.co",
      "placeholder-key"
    );
  } else {
    supabaseClient = createClient(supabaseUrl, supabaseAnonKey);
  }

  return supabaseClient;
};

export const supabase = initializeSupabase();
