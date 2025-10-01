import { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Theme from '@/constants/Theme';
import { 
  Bug, 
  Database, 
  User, 
  MessageSquare, 
  RefreshCw, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  Settings
} from 'lucide-react-native';
import { SystemDiagnostics, SystemStatus } from '@/utils/systemDiagnostics';
import { useAuth } from '@/hooks/useAuth';

export default function DebugScreen() {
  const [diagnostics, setDiagnostics] = useState<SystemStatus[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [testResults, setTestResults] = useState<{ [key: string]: string }>({});
  
  const { user } = useAuth();

  useEffect(() => {
    runDiagnostics();
  }, []);

  const runDiagnostics = async () => {
    setIsRunning(true);
    try {
      const results = await SystemDiagnostics.runFullDiagnostic();
      setDiagnostics(results);
    } catch (error) {
      console.error('Diagnostic error:', error);
    } finally {
      setIsRunning(false);
    }
  };

  const testCreateUser = async () => {
    setTestResults({ ...testResults, createUser: 'Testando...' });
    const result = await SystemDiagnostics.testCreateUser();
    setTestResults({ 
      ...testResults, 
      createUser: result.success ? `✅ ${result.message}` : `❌ ${result.message}` 
    });
  };

  const testCreatePost = async () => {
    setTestResults({ ...testResults, createPost: 'Testando...' });
    const result = await SystemDiagnostics.testCreatePost();
    setTestResults({ 
      ...testResults, 
      createPost: result.success ? `✅ ${result.message}` : `❌ ${result.message}` 
    });
  };

  const getStatusIcon = (status: SystemStatus['status']) => {
    const iconProps = { size: 20 };
    
    switch (status) {
      case 'working':
        return <CheckCircle {...iconProps} color={Theme.colors.status.success} />;
      case 'partial':
        return <AlertTriangle {...iconProps} color={Theme.colors.status.warning} />;
      case 'broken':
        return <XCircle {...iconProps} color={Theme.colors.status.error} />;
      case 'not_implemented':
        return <Settings {...iconProps} color={Theme.colors.text.medium} />;
    }
  };

  const getStatusColor = (status: SystemStatus['status']) => {
    switch (status) {
      case 'working':
        return Theme.colors.status.success;
      case 'partial':
        return Theme.colors.status.warning;
      case 'broken':
        return Theme.colors.status.error;
      case 'not_implemented':
        return Theme.colors.text.medium;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Bug size={24} color={Theme.colors.primary.blue} />
        <Text style={styles.title}>Sistema de Debug</Text>
        <TouchableOpacity 
          style={styles.refreshButton}
          onPress={runDiagnostics}
          disabled={isRunning}
        >
          <RefreshCw size={20} color={Theme.colors.primary.blue} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.userInfo}>
          <User size={20} color={Theme.colors.primary.blue} />
          <Text style={styles.userInfoText}>
            {user ? `Logado como: ${user.email}` : 'Não autenticado'}
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Status dos Componentes</Text>
          
          {isRunning ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={Theme.colors.primary.blue} />
              <Text style={styles.loadingText}>Executando diagnósticos...</Text>
            </View>
          ) : (
            diagnostics.map((item, index) => (
              <View key={index} style={styles.diagnosticItem}>
                <View style={styles.diagnosticHeader}>
                  {getStatusIcon(item.status)}
                  <Text style={styles.diagnosticComponent}>{item.component}</Text>
                </View>
                <Text style={[
                  styles.diagnosticMessage,
                  { color: getStatusColor(item.status) }
                ]}>
                  {item.message}
                </Text>
                {item.details && (
                  <Text style={styles.diagnosticDetails}>{item.details}</Text>
                )}
                <Text style={styles.diagnosticTime}>
                  Verificado: {new Date(item.lastChecked).toLocaleTimeString()}
                </Text>
              </View>
            ))
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Testes Funcionais</Text>
          
          <TouchableOpacity 
            style={styles.testButton}
            onPress={testCreateUser}
          >
            <Database size={20} color={Theme.colors.primary.blue} />
            <Text style={styles.testButtonText}>Testar Criação de Usuário</Text>
          </TouchableOpacity>
          {testResults.createUser && (
            <Text style={styles.testResult}>{testResults.createUser}</Text>
          )}

          <TouchableOpacity 
            style={styles.testButton}
            onPress={testCreatePost}
          >
            <MessageSquare size={20} color={Theme.colors.primary.blue} />
            <Text style={styles.testButtonText}>Testar Criação de Post</Text>
          </TouchableOpacity>
          {testResults.createPost && (
            <Text style={styles.testResult}>{testResults.createPost}</Text>
          )}
        </View>

        <View style={styles.infoBox}>
          <Text style={styles.infoTitle}>Informações do Sistema</Text>
          <Text style={styles.infoText}>• Expo SDK: 53.0.0</Text>
          <Text style={styles.infoText}>• React Native: 0.79.1</Text>
          <Text style={styles.infoText}>• Supabase: Configurado</Text>
          <Text style={styles.infoText}>• Ambiente: Desenvolvimento</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.colors.background.light,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Theme.spacing.md,
    paddingVertical: Theme.spacing.md,
    backgroundColor: Theme.colors.background.white,
    borderBottomWidth: 1,
    borderBottomColor: Theme.colors.ui.border,
  },
  title: {
    fontFamily: Theme.typography.fontFamily.heading,
    fontSize: Theme.typography.fontSize.lg,
    color: Theme.colors.primary.blue,
  },
  refreshButton: {
    padding: Theme.spacing.xs,
  },
  content: {
    padding: Theme.spacing.md,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Theme.colors.background.white,
    borderRadius: Theme.borderRadius.md,
    padding: Theme.spacing.md,
    marginBottom: Theme.spacing.md,
    ...Theme.shadows.small,
  },
  userInfoText: {
    fontFamily: Theme.typography.fontFamily.body,
    fontSize: Theme.typography.fontSize.md,
    color: Theme.colors.text.dark,
    marginLeft: Theme.spacing.sm,
  },
  section: {
    backgroundColor: Theme.colors.background.white,
    borderRadius: Theme.borderRadius.md,
    padding: Theme.spacing.md,
    marginBottom: Theme.spacing.md,
    ...Theme.shadows.small,
  },
  sectionTitle: {
    fontFamily: Theme.typography.fontFamily.subheading,
    fontSize: Theme.typography.fontSize.md,
    color: Theme.colors.text.dark,
    marginBottom: Theme.spacing.md,
  },
  loadingContainer: {
    alignItems: 'center',
    padding: Theme.spacing.lg,
  },
  loadingText: {
    fontFamily: Theme.typography.fontFamily.body,
    fontSize: Theme.typography.fontSize.sm,
    color: Theme.colors.text.medium,
    marginTop: Theme.spacing.sm,
  },
  diagnosticItem: {
    marginBottom: Theme.spacing.md,
    paddingBottom: Theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Theme.colors.ui.border,
  },
  diagnosticHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Theme.spacing.xs,
  },
  diagnosticComponent: {
    fontFamily: Theme.typography.fontFamily.subheading,
    fontSize: Theme.typography.fontSize.md,
    color: Theme.colors.text.dark,
    marginLeft: Theme.spacing.sm,
  },
  diagnosticMessage: {
    fontFamily: Theme.typography.fontFamily.body,
    fontSize: Theme.typography.fontSize.sm,
    marginBottom: Theme.spacing.xs,
  },
  diagnosticDetails: {
    fontFamily: Theme.typography.fontFamily.body,
    fontSize: Theme.typography.fontSize.xs,
    color: Theme.colors.text.light,
    marginBottom: Theme.spacing.xs,
  },
  diagnosticTime: {
    fontFamily: Theme.typography.fontFamily.body,
    fontSize: Theme.typography.fontSize.xs,
    color: Theme.colors.text.light,
  },
  testButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Theme.colors.background.light,
    borderRadius: Theme.borderRadius.md,
    padding: Theme.spacing.md,
    marginBottom: Theme.spacing.sm,
  },
  testButtonText: {
    fontFamily: Theme.typography.fontFamily.body,
    fontSize: Theme.typography.fontSize.md,
    color: Theme.colors.primary.blue,
    marginLeft: Theme.spacing.sm,
  },
  testResult: {
    fontFamily: Theme.typography.fontFamily.body,
    fontSize: Theme.typography.fontSize.sm,
    color: Theme.colors.text.dark,
    marginBottom: Theme.spacing.md,
    paddingLeft: Theme.spacing.lg,
  },
  infoBox: {
    backgroundColor: Theme.colors.background.lilac,
    borderRadius: Theme.borderRadius.md,
    padding: Theme.spacing.md,
  },
  infoTitle: {
    fontFamily: Theme.typography.fontFamily.subheading,
    fontSize: Theme.typography.fontSize.md,
    color: Theme.colors.text.dark,
    marginBottom: Theme.spacing.sm,
  },
  infoText: {
    fontFamily: Theme.typography.fontFamily.body,
    fontSize: Theme.typography.fontSize.sm,
    color: Theme.colors.text.dark,
    marginBottom: Theme.spacing.xs,
  },
});