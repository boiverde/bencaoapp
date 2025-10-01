import { supabase } from './supabase';

export interface SystemStatus {
  component: string;
  status: 'working' | 'partial' | 'broken' | 'not_implemented';
  message: string;
  details?: string;
  lastChecked: number;
}

export class SystemDiagnostics {
  static async runFullDiagnostic(): Promise<SystemStatus[]> {
    const results: SystemStatus[] = [];
    
    // Test Supabase Connection
    try {
      const { data, error } = await supabase.from('profiles').select('count').limit(1);
      if (error) {
        results.push({
          component: 'Supabase Database',
          status: 'broken',
          message: 'Erro de conexão com banco de dados',
          details: error.message,
          lastChecked: Date.now()
        });
      } else {
        results.push({
          component: 'Supabase Database',
          status: 'working',
          message: 'Conectado com sucesso',
          lastChecked: Date.now()
        });
      }
    } catch (error: any) {
      results.push({
        component: 'Supabase Database',
        status: 'broken',
        message: 'Falha na conexão',
        details: error.message,
        lastChecked: Date.now()
      });
    }

    // Test Authentication
    try {
      const { data: { session } } = await supabase.auth.getSession();
      results.push({
        component: 'Authentication',
        status: session ? 'working' : 'partial',
        message: session ? 'Usuário autenticado' : 'Nenhum usuário logado',
        lastChecked: Date.now()
      });
    } catch (error: any) {
      results.push({
        component: 'Authentication',
        status: 'broken',
        message: 'Erro no sistema de autenticação',
        details: error.message,
        lastChecked: Date.now()
      });
    }

    // Test Posts Table
    try {
      const { data, error } = await supabase.from('posts').select('count').limit(1);
      if (error) {
        results.push({
          component: 'Posts System',
          status: 'broken',
          message: 'Tabela de posts não encontrada',
          details: error.message,
          lastChecked: Date.now()
        });
      } else {
        results.push({
          component: 'Posts System',
          status: 'working',
          message: 'Sistema de posts funcionando',
          lastChecked: Date.now()
        });
      }
    } catch (error: any) {
      results.push({
        component: 'Posts System',
        status: 'broken',
        message: 'Erro no sistema de posts',
        details: error.message,
        lastChecked: Date.now()
      });
    }

    // Test Storage
    try {
      const { data, error } = await supabase.storage.listBuckets();
      if (error) {
        results.push({
          component: 'File Storage',
          status: 'broken',
          message: 'Storage não configurado',
          details: error.message,
          lastChecked: Date.now()
        });
      } else {
        const hasAvatarsBucket = data.some(bucket => bucket.name === 'avatars');
        results.push({
          component: 'File Storage',
          status: hasAvatarsBucket ? 'working' : 'partial',
          message: hasAvatarsBucket ? 'Storage configurado' : 'Buckets faltando',
          lastChecked: Date.now()
        });
      }
    } catch (error: any) {
      results.push({
        component: 'File Storage',
        status: 'broken',
        message: 'Erro no storage',
        details: error.message,
        lastChecked: Date.now()
      });
    }

    // Check Environment Variables
    const hasSupabaseUrl = !!process.env.EXPO_PUBLIC_SUPABASE_URL;
    const hasSupabaseKey = !!process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;
    
    results.push({
      component: 'Environment Variables',
      status: hasSupabaseUrl && hasSupabaseKey ? 'working' : 'broken',
      message: hasSupabaseUrl && hasSupabaseKey ? 'Variáveis configuradas' : 'Variáveis faltando',
      details: `URL: ${hasSupabaseUrl ? '✓' : '✗'}, Key: ${hasSupabaseKey ? '✓' : '✗'}`,
      lastChecked: Date.now()
    });

    return results;
  }

  static async testCreateUser(): Promise<{ success: boolean; message: string }> {
    try {
      const testEmail = `test_${Date.now()}@example.com`;
      const testPassword = 'TestPassword123!';
      
      const { data, error } = await supabase.auth.signUp({
        email: testEmail,
        password: testPassword,
        options: {
          data: {
            full_name: 'Usuário Teste'
          }
        }
      });

      if (error) {
        return { success: false, message: `Erro: ${error.message}` };
      }

      return { success: true, message: 'Usuário criado com sucesso!' };
    } catch (error: any) {
      return { success: false, message: `Erro: ${error.message}` };
    }
  }

  static async testCreatePost(): Promise<{ success: boolean; message: string }> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        return { success: false, message: 'Usuário não autenticado' };
      }

      const { data, error } = await supabase.from('posts').insert({
        user_id: user.id,
        content: 'Post de teste criado em ' + new Date().toLocaleString(),
        type: 'general',
        visibility: 'public'
      });

      if (error) {
        return { success: false, message: `Erro: ${error.message}` };
      }

      return { success: true, message: 'Post criado com sucesso!' };
    } catch (error: any) {
      return { success: false, message: `Erro: ${error.message}` };
    }
  }
}