import { supabase } from './supabase';
import { SecureStorage } from './secureStorage';
import { User } from '@/hooks/useAuth';

export interface SupabaseUser {
  id: string;
  email: string;
  name: string;
  age?: number;
  denomination?: string;
  location?: any;
  bio?: string;
  photos?: string[];
  preferences?: any;
  personality?: any;
  values?: any;
  lifestyle?: any;
  created_at: string;
  updated_at: string;
}

export class RealAuthService {
  /**
   * Sign in with email and password
   */
  static async signIn(email: string, password: string): Promise<{ user: User | null; error: string | null }> {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        return { user: null, error: this.translateError(error.message) };
      }

      if (data.user) {
        // Get user profile data
        const { data: profile, error: profileError } = await supabase
          .from('users')
          .select('*')
          .eq('id', data.user.id)
          .single();

        if (profileError) {
          console.error('Error fetching user profile:', profileError);
          return { user: null, error: 'Erro ao carregar perfil do usuário' };
        }

        const user: User = {
          id: data.user.id,
          email: data.user.email!,
          name: profile?.name || data.user.user_metadata?.name || '',
          photoUrl: profile?.photos?.[0],
          emailVerified: data.user.email_confirmed_at !== null,
          phoneVerified: data.user.phone_confirmed_at !== null,
          createdAt: new Date(data.user.created_at).getTime()
        };

        // Save session data
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
  static async signUp(email: string, password: string, name: string): Promise<{ user: User | null; error: string | null }> {
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
        return { user: null, error: this.translateError(error.message) };
      }

      if (data.user) {
        // Create user profile
        const { error: profileError } = await supabase
          .from('users')
          .insert([
            {
              id: data.user.id,
              email: data.user.email!,
              name: name,
              created_at: new Date().toISOString(),
            },
          ]);

        if (profileError) {
          console.error('Profile creation error:', profileError);
          return { user: null, error: 'Erro ao criar perfil do usuário' };
        }

        const user: User = {
          id: data.user.id,
          email: data.user.email!,
          name: name,
          emailVerified: false,
          phoneVerified: false,
          createdAt: new Date(data.user.created_at).getTime()
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
        return { error: this.translateError(error.message) };
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
        redirectTo: `${process.env.EXPO_PUBLIC_WEBSITE_URL}/reset-password`,
      });

      if (error) {
        return { error: this.translateError(error.message) };
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
  static async getCurrentSession(): Promise<{ user: User | null; error: string | null }> {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();

      if (error) {
        return { user: null, error: this.translateError(error.message) };
      }

      if (session?.user) {
        // Get user profile data
        const { data: profile, error: profileError } = await supabase
          .from('users')
          .select('*')
          .eq('id', session.user.id)
          .single();

        if (profileError) {
          console.error('Error fetching user profile:', profileError);
          return { user: null, error: 'Erro ao carregar perfil do usuário' };
        }

        const user: User = {
          id: session.user.id,
          email: session.user.email!,
          name: profile?.name || session.user.user_metadata?.name || '',
          photoUrl: profile?.photos?.[0],
          emailVerified: session.user.email_confirmed_at !== null,
          phoneVerified: session.user.phone_confirmed_at !== null,
          createdAt: new Date(session.user.created_at).getTime()
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
  static async updateProfile(userId: string, updates: Partial<SupabaseUser>): Promise<{ error: string | null }> {
    try {
      const { error } = await supabase
        .from('users')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId);

      if (error) {
        return { error: this.translateError(error.message) };
      }

      return { error: null };
    } catch (error) {
      console.error('Update profile error:', error);
      return { error: 'Erro ao atualizar perfil' };
    }
  }

  /**
   * Upload profile photo to Supabase Storage
   */
  static async uploadPhoto(userId: string, photoUri: string): Promise<{ url: string | null; error: string | null }> {
    try {
      // Convert URI to blob for upload
      const response = await fetch(photoUri);
      const blob = await response.blob();
      
      const fileName = `${userId}/${Date.now()}.jpg`;
      
      const { data, error } = await supabase.storage
        .from('profile-photos')
        .upload(fileName, blob, {
          contentType: 'image/jpeg',
          upsert: false
        });

      if (error) {
        return { url: null, error: this.translateError(error.message) };
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

  /**
   * Get potential matches for a user
   */
  static async getPotentialMatches(userId: string, limit: number = 10): Promise<{ users: SupabaseUser[]; error: string | null }> {
    try {
      // Get users that are not already connected
      const { data: existingConnections } = await supabase
        .from('connections')
        .select('user1_id, user2_id')
        .or(`user1_id.eq.${userId},user2_id.eq.${userId}`);

      const connectedUserIds = existingConnections?.flatMap(conn => 
        [conn.user1_id, conn.user2_id]
      ).filter(id => id !== userId) || [];

      // Get potential matches
      const { data: users, error } = await supabase
        .from('users')
        .select('*')
        .neq('id', userId)
        .not('id', 'in', `(${connectedUserIds.join(',')})`)
        .limit(limit);

      if (error) {
        return { users: [], error: this.translateError(error.message) };
      }

      return { users: users || [], error: null };
    } catch (error) {
      console.error('Get potential matches error:', error);
      return { users: [], error: 'Erro ao buscar perfis' };
    }
  }

  /**
   * Create a connection between two users
   */
  static async createConnection(user1Id: string, user2Id: string, compatibilityScore?: number): Promise<{ error: string | null }> {
    try {
      const { error } = await supabase
        .from('connections')
        .insert([
          {
            user1_id: user1Id,
            user2_id: user2Id,
            status: 'pending',
            compatibility_score: compatibilityScore
          }
        ]);

      if (error) {
        return { error: this.translateError(error.message) };
      }

      return { error: null };
    } catch (error) {
      console.error('Create connection error:', error);
      return { error: 'Erro ao criar conexão' };
    }
  }

  /**
   * Translate Supabase errors to Portuguese
   */
  private static translateError(errorMessage: string): string {
    const errorMap: { [key: string]: string } = {
      'Invalid login credentials': 'Email ou senha inválidos',
      'Email not confirmed': 'Email não confirmado. Verifique sua caixa de entrada.',
      'User already registered': 'Este email já está cadastrado',
      'Password should be at least 6 characters': 'A senha deve ter pelo menos 6 caracteres',
      'Invalid email': 'Email inválido',
      'Network request failed': 'Erro de conexão. Verifique sua internet.',
      'Too many requests': 'Muitas tentativas. Tente novamente em alguns minutos.',
    };

    return errorMap[errorMessage] || errorMessage;
  }

  /**
   * Listen to auth state changes
   */
  static onAuthStateChange(callback: (user: User | null) => void) {
    return supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        // Get user profile
        const { data: profile } = await supabase
          .from('users')
          .select('*')
          .eq('id', session.user.id)
          .single();

        const user: User = {
          id: session.user.id,
          email: session.user.email!,
          name: profile?.name || session.user.user_metadata?.name || '',
          photoUrl: profile?.photos?.[0],
          emailVerified: session.user.email_confirmed_at !== null,
          phoneVerified: session.user.phone_confirmed_at !== null,
          createdAt: new Date(session.user.created_at).getTime()
        };

        callback(user);
      } else {
        callback(null);
      }
    });
  }
}