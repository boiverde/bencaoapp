import { createClient } from '@supabase/supabase-js';
import { Platform } from 'react-native';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please check your .env file.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: (typeof window !== 'undefined' && window.localStorage) ? window.localStorage : undefined,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

// Database types (will be generated from Supabase)
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
    };
  };
}
