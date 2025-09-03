import { createClient } from '@supabase/supabase-js';
import { SecureStorage } from './secureStorage';

// Configuração do Supabase (substitua pelos seus valores reais)
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || 'https://your-project.supabase.co';
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || 'your-anon-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface RealUser {
  id: string;
  email: string;
  name: string;
  photoUrl?: string;
  emailVerified: boolean;
  phoneVerified: boolean;
  createdAt: string;
  profile?: {
    age?: number;
    denomination?: string;
    location?: any;
    bio?: string;
    photos?: string[];
    preferences?: any;
    personality?: any;
    values?: any;
    lifestyle?: any;
  };
}

/**
 * Real authentication service using Supabase
 * Replace the mock authentication in useAuth.ts with this implementation
 */
export class RealAuthService {
  /**
   * Sign in with email and password
   */
  static async signIn(email: string, password: string): Promise<{ user: RealUser | null; error: string | null }> {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        return { user: null, error: error.message };
      }

      if (data.user) {
        // Get user profile data
        const { data: profile, error: profileError } = await supabase
          .from('users')
          .select('*')
          .eq('id', data.user.id)
          .single();

        const user: RealUser = {
          id: data.user.id,
          email: data.user.email!,
          name: profile?.name || data.user.user_metadata?.name || '',
          photoUrl: profile?.photos?.[0],
          emailVerified: data.user.email_confirmed_at !== null,
          phoneVerified: data.user.phone_confirmed_at !== null,
          createdAt: data.user.created_at,
          profile: profile || undefined
        };

        // Save session
        await SecureStorage.saveItem('auth_session', JSON.stringify(data.session));
        await SecureStorage.saveItem('auth_user', JSON.stringify(user));

        return { user, error: null };
      }

      return { user: null, error: 'Falha na autenticação' };
    } catch (error) {
      console.error('Sign in error:', error);
      return { user: null, error: 'Erro interno. Tente novamente.' };
    }
  }

  /**
   * Sign up with email and password
   */
  static async signUp(email: string, password: string, name: string): Promise<{ user: RealUser | null; error: string | null }> {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name: name,
          },
        },
      });

      if (error) {
        return { user: null, error: error.message };
      }

      if (data.user) {
        // Create user profile
        const { error: profileError } = await supabase
          .from('users')
          .insert([
            {
              id: data.user.id,
              email: data.user.email,
              name: name,
              created_at: new Date().toISOString(),
            },
          ]);

        if (profileError) {
          console.error('Profile creation error:', profileError);
        }

        const user: RealUser = {
          id: data.user.id,
          email: data.user.email!,
          name: name,
          emailVerified: false,
          phoneVerified: false,
          createdAt: data.user.created_at,
        };

        return { user, error: null };
      }

      return { user: null, error: 'Falha no cadastro' };
    } catch (error) {
      console.error('Sign up error:', error);
      return { user: null, error: 'Erro interno. Tente novamente.' };
    }
  }

  /**
   * Sign out
   */
  static async signOut(): Promise<{ error: string | null }> {
    try {
      const { error } = await supabase.auth.signOut();
      
      // Clear local storage
      await SecureStorage.deleteItem('auth_session');
      await SecureStorage.deleteItem('auth_user');

      if (error) {
        return { error: error.message };
      }

      return { error: null };
    } catch (error) {
      console.error('Sign out error:', error);
      return { error: 'Erro ao sair. Tente novamente.' };
    }
  }

  /**
   * Reset password
   */
  static async resetPassword(email: string): Promise<{ error: string | null }> {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: 'https://bencaomatch.com/reset-password',
      });

      if (error) {
        return { error: error.message };
      }

      return { error: null };
    } catch (error) {
      console.error('Reset password error:', error);
      return { error: 'Erro ao enviar email. Tente novamente.' };
    }
  }

  /**
   * Get current session
   */
  static async getCurrentSession(): Promise<{ user: RealUser | null; error: string | null }> {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();

      if (error) {
        return { user: null, error: error.message };
      }

      if (session?.user) {
        // Get user profile data
        const { data: profile, error: profileError } = await supabase
          .from('users')
          .select('*')
          .eq('id', session.user.id)
          .single();

        const user: RealUser = {
          id: session.user.id,
          email: session.user.email!,
          name: profile?.name || session.user.user_metadata?.name || '',
          photoUrl: profile?.photos?.[0],
          emailVerified: session.user.email_confirmed_at !== null,
          phoneVerified: session.user.phone_confirmed_at !== null,
          createdAt: session.user.created_at,
          profile: profile || undefined
        };

        return { user, error: null };
      }

      return { user: null, error: null };
    } catch (error) {
      console.error('Get session error:', error);
      return { user: null, error: 'Erro ao verificar sessão' };
    }
  }

  /**
   * Update user profile
   */
  static async updateProfile(userId: string, updates: Partial<RealUser['profile']>): Promise<{ error: string | null }> {
    try {
      const { error } = await supabase
        .from('users')
        .update(updates)
        .eq('id', userId);

      if (error) {
        return { error: error.message };
      }

      return { error: null };
    } catch (error) {
      console.error('Update profile error:', error);
      return { error: 'Erro ao atualizar perfil' };
    }
  }

  /**
   * Upload profile photo
   */
  static async uploadPhoto(userId: string, photoUri: string): Promise<{ url: string | null; error: string | null }> {
    try {
      // Convert URI to blob for upload
      const response = await fetch(photoUri);
      const blob = await response.blob();
      
      const fileName = `${userId}/${Date.now()}.jpg`;
      
      const { data, error } = await supabase.storage
        .from('profile-photos')
        .upload(fileName, blob);

      if (error) {
        return { url: null, error: error.message };
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('profile-photos')
        .getPublicUrl(fileName);

      return { url: publicUrl, error: null };
    } catch (error) {
      console.error('Upload photo error:', error);
      return { url: null, error: 'Erro ao enviar foto' };
    }
  }
}