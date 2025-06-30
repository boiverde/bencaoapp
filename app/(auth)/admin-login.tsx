import { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import Theme from '@/constants/Theme';
import { useRouter } from 'expo-router';
import { Mail, Lock, ArrowRight, Eye, EyeOff, ShieldCheck } from 'lucide-react-native';
import { AdminAuth } from '@/utils/adminAuth';
import { useAuth } from '@/hooks/useAuth';

export default function AdminLoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const router = useRouter();
  const { signInAsAdmin } = useAuth();

  useEffect(() => {
    // Initialize admin credentials
    AdminAuth.initializeAdminCredentials();
  }, []);

  const handleLogin = async () => {
    if (!email || !password) {
      setError('Por favor, preencha todos os campos');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      const isAdmin = await AdminAuth.verifyAdminCredentials(email, password);
      
      if (isAdmin) {
        // Set admin status
        await signInAsAdmin(true);
        
        // Navigate to admin dashboard
        router.replace('/(tabs)/admin-dashboard');
        Alert.alert('Sucesso', 'Login de administrador realizado com sucesso!');
      } else {
        setError('Credenciais de administrador inválidas');
      }
    } catch (error) {
      console.error('Error during admin login:', error);
      setError('Erro ao realizar login. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 50 : 0}
    >
      <StatusBar style="light" />
      <LinearGradient
        colors={[Theme.colors.primary.blue, Theme.colors.primary.lilac, Theme.colors.primary.pink]}
        style={styles.background}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />
      
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.logoContainer}>
          <ShieldCheck size={60} color={Theme.colors.background.white} />
          <Text style={styles.logoText}>Bênção Match</Text>
          <Text style={styles.logoSubtext}>Painel de Administrador</Text>
        </View>
        
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Acesso Administrativo</Text>
          <Text style={styles.cardSubtitle}>Entre com suas credenciais de administrador</Text>
          
          {error && (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}
          
          <View style={styles.inputContainer}>
            <Mail size={20} color={Theme.colors.text.medium} />
            <TextInput
              style={styles.input}
              placeholder="Email"
              placeholderTextColor={Theme.colors.text.medium}
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
              editable={!isLoading}
              accessibilityLabel="Email"
              accessibilityHint="Digite seu email de administrador"
            />
          </View>
          
          <View style={styles.inputContainer}>
            <Lock size={20} color={Theme.colors.text.medium} />
            <TextInput
              style={styles.input}
              placeholder="Senha"
              placeholderTextColor={Theme.colors.text.medium}
              secureTextEntry={!showPassword}
              value={password}
              onChangeText={setPassword}
              editable={!isLoading}
              accessibilityLabel="Senha"
              accessibilityHint="Digite sua senha de administrador"
            />
            <TouchableOpacity 
              onPress={togglePasswordVisibility}
              accessibilityLabel={showPassword ? "Ocultar senha" : "Mostrar senha"}
              accessibilityRole="button"
            >
              {showPassword ? (
                <EyeOff size={20} color={Theme.colors.text.medium} />
              ) : (
                <Eye size={20} color={Theme.colors.text.medium} />
              )}
            </TouchableOpacity>
          </View>
          
          <TouchableOpacity 
            style={[styles.loginButton, isLoading && styles.loginButtonDisabled]}
            onPress={handleLogin}
            disabled={isLoading}
            accessibilityLabel="Entrar como administrador"
            accessibilityRole="button"
            accessibilityHint="Toque para fazer login como administrador"
          >
            {isLoading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <>
                <Text style={styles.loginButtonText}>Entrar</Text>
                <ArrowRight size={20} color="#fff" />
              </>
            )}
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.backButton}
            onPress={handleBack}
            accessibilityLabel="Voltar para login normal"
            accessibilityRole="button"
          >
            <Text style={styles.backButtonText}>Voltar para login normal</Text>
          </TouchableOpacity>
        </View>
        
        <Text style={styles.verseText}>"Aquele que é fiel no pouco, também é fiel no muito." Lucas 16:10</Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Theme.spacing.xl,
  },
  background: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: Theme.spacing.xl,
  },
  logoText: {
    fontFamily: Theme.typography.fontFamily.heading,
    fontSize: Theme.typography.fontSize.xxxl,
    color: Theme.colors.background.white,
    textShadowColor: 'rgba(0, 0, 0, 0.15)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
    marginTop: Theme.spacing.sm,
  },
  logoSubtext: {
    fontFamily: Theme.typography.fontFamily.verse,
    fontSize: Theme.typography.fontSize.md,
    color: Theme.colors.background.white,
    textShadowColor: 'rgba(0, 0, 0, 0.15)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  card: {
    width: '85%',
    backgroundColor: Theme.colors.background.white,
    borderRadius: Theme.borderRadius.lg,
    padding: Theme.spacing.lg,
    ...Theme.shadows.medium,
  },
  cardTitle: {
    fontFamily: Theme.typography.fontFamily.heading,
    fontSize: Theme.typography.fontSize.xl,
    color: Theme.colors.text.dark,
    marginBottom: Theme.spacing.xs,
  },
  cardSubtitle: {
    fontFamily: Theme.typography.fontFamily.body,
    fontSize: Theme.typography.fontSize.md,
    color: Theme.colors.text.medium,
    marginBottom: Theme.spacing.lg,
  },
  errorContainer: {
    backgroundColor: Theme.colors.status.error + '20',
    borderRadius: Theme.borderRadius.md,
    padding: Theme.spacing.sm,
    marginBottom: Theme.spacing.md,
  },
  errorText: {
    fontFamily: Theme.typography.fontFamily.body,
    fontSize: Theme.typography.fontSize.sm,
    color: Theme.colors.status.error,
    textAlign: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Theme.colors.background.light,
    borderRadius: Theme.borderRadius.md,
    paddingHorizontal: Theme.spacing.md,
    marginBottom: Theme.spacing.md,
  },
  input: {
    flex: 1,
    fontFamily: Theme.typography.fontFamily.body,
    fontSize: Theme.typography.fontSize.md,
    paddingVertical: Theme.spacing.md,
    marginLeft: Theme.spacing.sm,
    color: Theme.colors.text.dark,
  },
  loginButton: {
    flexDirection: 'row',
    backgroundColor: Theme.colors.primary.blue,
    borderRadius: Theme.borderRadius.md,
    paddingVertical: Theme.spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: Theme.spacing.md,
  },
  loginButtonDisabled: {
    backgroundColor: Theme.colors.ui.disabled,
  },
  loginButtonText: {
    fontFamily: Theme.typography.fontFamily.subheading,
    fontSize: Theme.typography.fontSize.md,
    color: Theme.colors.background.white,
    marginRight: Theme.spacing.sm,
  },
  backButton: {
    alignItems: 'center',
    marginTop: Theme.spacing.md,
  },
  backButtonText: {
    fontFamily: Theme.typography.fontFamily.body,
    fontSize: Theme.typography.fontSize.sm,
    color: Theme.colors.primary.blue,
    textDecorationLine: 'underline',
  },
  verseText: {
    fontFamily: Theme.typography.fontFamily.verse,
    fontSize: Theme.typography.fontSize.sm,
    color: Theme.colors.background.white,
    textAlign: 'center',
    marginTop: Theme.spacing.xl,
    paddingHorizontal: Theme.spacing.lg,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
});