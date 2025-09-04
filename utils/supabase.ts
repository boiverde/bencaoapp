import { createClient } from '@supabase/supabase-js';

// Configuração do Supabase
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('⚠️ Supabase não configurado. Usando modo mock.');
}

export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder-key',
  {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false,
      storage: typeof window !== 'undefined' ? window.localStorage : undefined,
    },
  }
);

export const isSupabaseConfigured = !!(supabaseUrl && supabaseAnonKey);

// Database types
export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          name: string;
          age: number | null;
          denomination: string | null;
          location: any | null;
          bio: string | null;
          photos: string[] | null;
          preferences: any | null;
          personality: any | null;
          values: any | null;
          lifestyle: any | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          email: string;
          name: string;
          age?: number | null;
          denomination?: string | null;
          location?: any | null;
          bio?: string | null;
          photos?: string[] | null;
          preferences?: any | null;
          personality?: any | null;
          values?: any | null;
          lifestyle?: any | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          name?: string;
          age?: number | null;
          denomination?: string | null;
          location?: any | null;
          bio?: string | null;
          photos?: string[] | null;
          preferences?: any | null;
          personality?: any | null;
          values?: any | null;
          lifestyle?: any | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      connections: {
        Row: {
          id: string;
          user1_id: string;
          user2_id: string;
          status: 'pending' | 'matched' | 'blocked';
          compatibility_score: number | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user1_id: string;
          user2_id: string;
          status?: 'pending' | 'matched' | 'blocked';
          compatibility_score?: number | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user1_id?: string;
          user2_id?: string;
          status?: 'pending' | 'matched' | 'blocked';
          compatibility_score?: number | null;
          created_at?: string;
        };
      };
      conversations: {
        Row: {
          id: string;
          participants: string[];
          type: 'direct' | 'group' | 'prayer_circle';
          title: string | null;
          last_activity: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          participants: string[];
          type?: 'direct' | 'group' | 'prayer_circle';
          title?: string | null;
          last_activity?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          participants?: string[];
          type?: 'direct' | 'group' | 'prayer_circle';
          title?: string | null;
          last_activity?: string;
          created_at?: string;
        };
      };
      messages: {
        Row: {
          id: string;
          conversation_id: string;
          sender_id: string;
          content: string;
          type: 'text' | 'voice' | 'image' | 'verse' | 'prayer';
          metadata: any | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          conversation_id: string;
          sender_id: string;
          content: string;
          type?: 'text' | 'voice' | 'image' | 'verse' | 'prayer';
          metadata?: any | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          conversation_id?: string;
          sender_id?: string;
          content?: string;
          type?: 'text' | 'voice' | 'image' | 'verse' | 'prayer';
          metadata?: any | null;
          created_at?: string;
        };
      };
      events: {
        Row: {
          id: string;
          title: string;
          description: string | null;
          type: string | null;
          start_date: string;
          end_date: string;
          location: any | null;
          organizer_id: string;
          attendees: string[] | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          description?: string | null;
          type?: string | null;
          start_date: string;
          end_date: string;
          location?: any | null;
          organizer_id: string;
          attendees?: string[] | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          description?: string | null;
          type?: string | null;
          start_date?: string;
          end_date?: string;
          location?: any | null;
          organizer_id?: string;
          attendees?: string[] | null;
          created_at?: string;
        };
      };
      prayer_requests: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          description: string;
          category: string | null;
          priority: string | null;
          is_private: boolean;
          prayed_by: string[] | null;
          answered: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          title: string;
          description: string;
          category?: string | null;
          priority?: string | null;
          is_private?: boolean;
          prayed_by?: string[] | null;
          answered?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          title?: string;
          description?: string;
          category?: string | null;
          priority?: string | null;
          is_private?: boolean;
          prayed_by?: string[] | null;
          answered?: boolean;
          created_at?: string;
        };
      };
      notifications: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          body: string;
          type: string;
          data: any | null;
          read: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          title: string;
          body: string;
          type: string;
          data?: any | null;
          read?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          title?: string;
          body?: string;
          type?: string;
          data?: any | null;
          read?: boolean;
          created_at?: string;
        };
      };
    };
  };
}