import { supabase } from '../lib/supabase';

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
      const requiredBuckets = ['avatars', 'profile-photos', 'gallery-photos', 'chat-media'];
      const bucketTests = await Promise.all(
        requiredBuckets.map(async (bucketName) => {
          try {
            const { data, error } = await supabase.storage
              .from(bucketName)
              .list('', { limit: 1 });
            return { bucket: bucketName, exists: !error };
          } catch {
            return { bucket: bucketName, exists: false };
          }
        })
      );

      const foundBuckets = bucketTests.filter(t => t.exists).map(t => t.bucket);
      const missingBuckets = bucketTests.filter(t => !t.exists).map(t => t.bucket);
      const allBucketsExist = missingBuckets.length === 0;

      results.push({
        component: 'File Storage',
        status: allBucketsExist ? 'working' : 'partial',
        message: allBucketsExist
          ? `Storage configurado (${requiredBuckets.length}/${requiredBuckets.length} buckets)`
          : `${foundBuckets.length}/${requiredBuckets.length} buckets acessíveis`,
        details: missingBuckets.length > 0
          ? `Sem acesso: ${missingBuckets.join(', ')}`
          : `Buckets OK: ${foundBuckets.join(', ')}`,
        lastChecked: Date.now()
      });
    } catch (error: any) {
      results.push({
        component: 'File Storage',
        status: 'broken',
        message: 'Erro ao verificar storage',
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
      const timestamp = Date.now();
      const testEmail = `test${timestamp}@bencao.app`;
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