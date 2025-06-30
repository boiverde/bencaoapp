import { useState } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import Theme from '@/constants/Theme';
import { useRouter } from 'expo-router';
import { Mail, ArrowLeft, Send } from 'lucide-react-native';
import { useAuth } from '@/hooks/useAuth';
import { Performance } from '@/utils/performance';

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [resetSent, setResetSent] = useState(false);
  
  const { resetPassword, isLoading, error } = useAuth();
  const router = useRouter();

  // Debounced validation function
  const validateEmail = Performance.debounce((text: string) => {
    if (!text) {
      setEmailError('Email é obrigatório');
    } else if (!/\S+@\S+\.\S+/.test(text)) {
      setEmailError('Email inválido');
    } else {
      setEmailError('');
    }
  }, 300);

  const handleEmailChange = (text: string) => {
    setEmail(text);
    validateEmail(text);
  };

  const handleResetPassword = async () => {
    // Validate email
    validateEmail(email);
    
    if (!email || emailError) {
      return;
    }
    
    const success = await resetPassword(email);
    if (success) {
      setResetSent(true);
    }
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
          <Text style={styles.logoText}>Bênção Match</Text>
          <Text style={styles.logoSubtext}>Recuperação de Senha</Text>
        </View>
        
        <View style={styles.card}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={handleBack}
            accessibilityLabel="Voltar"
            accessibilityRole="button"
          >
            <ArrowLeft size={20} color={Theme.colors.text.dark} />
          </TouchableOpacity>
          
          <Text style={styles.cardTitle}>Esqueceu sua senha?</Text>
          <Text style={styles.cardSubtitle}>
            Digite seu email e enviaremos instruções para redefinir sua senha
          </Text>
          
          {error && (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}
          
          {resetSent ? (
            <View style={styles.successContainer}>
              <Text style={styles.successTitle}>Email enviado!</Text>
              <Text style={styles.successText}>
                Verifique sua caixa de entrada e siga as instruções para redefinir sua senha.
              </Text>
              <TouchableOpacity 
                style={styles.backToLoginButton}
                onPress={handleBack}
                accessibilityLabel="Voltar para o login"
                accessibilityRole="button"
              >
                <Text style={styles.backToLoginText}>Voltar para o login</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <>
              <View style={styles.inputContainer}>
                <Mail size={20} color={Theme.colors.text.medium} />
                <TextInput
                  style={styles.input}
                  placeholder="Email"
                  placeholderTextColor={Theme.colors.text.medium}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={email}
                  onChangeText={handleEmailChange}
                  editable={!isLoading}
                  accessibilityLabel="Email"
                  accessibilityHint="Digite o email associado à sua conta"
                />
              </View>
              {emailError ? <Text style={styles.fieldError}>{emailError}</Text> : null}
              
              <TouchableOpacity 
                style={[styles.resetButton, isLoading && styles.resetButtonDisabled]}
                onPress={handleResetPassword}
                disabled={isLoading}
                accessibilityLabel="Enviar instruções"
                accessibilityRole="button"
                accessibilityHint="Toque para enviar instruções de redefinição de senha"
              >
                {isLoading ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <>
                    <Text style={styles.resetButtonText}>Enviar instruções</Text>
                    <Send size={20} color="#fff" />
                  </>
                )}
              </TouchableOpacity>
            </>
          )}
        </View>
        
        <Text style={styles.verseText}>"O Senhor é o meu pastor, nada me faltará." Salmos 23:1</Text>
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
  backButton: {
    alignSelf: 'flex-start',
    marginBottom: Theme.spacing.md,
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
    marginBottom: Theme.spacing.xs,
  },
  input: {
    flex: 1,
    fontFamily: Theme.typography.fontFamily.body,
    fontSize: Theme.typography.fontSize.md,
    paddingVertical: Theme.spacing.md,
    marginLeft: Theme.spacing.sm,
    color: Theme.colors.text.dark,
  },
  fieldError: {
    fontFamily: Theme.typography.fontFamily.body,
    fontSize: Theme.typography.fontSize.sm,
    color: Theme.colors.status.error,
    marginBottom: Theme.spacing.md,
    marginLeft: Theme.spacing.sm,
  },
  resetButton: {
    flexDirection: 'row',
    backgroundColor: Theme.colors.primary.blue,
    borderRadius: Theme.borderRadius.md,
    paddingVertical: Theme.spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: Theme.spacing.md,
  },
  resetButtonDisabled: {
    backgroundColor: Theme.colors.ui.disabled,
  },
  resetButtonText: {
    fontFamily: Theme.typography.fontFamily.subheading,
    fontSize: Theme.typography.fontSize.md,
    color: Theme.colors.background.white,
    marginRight: Theme.spacing.sm,
  },
  successContainer: {
    alignItems: 'center',
    padding: Theme.spacing.md,
  },
  successTitle: {
    fontFamily: Theme.typography.fontFamily.subheading,
    fontSize: Theme.typography.fontSize.lg,
    color: Theme.colors.status.success,
    marginBottom: Theme.spacing.sm,
  },
  successText: {
    fontFamily: Theme.typography.fontFamily.body,
    fontSize: Theme.typography.fontSize.md,
    color: Theme.colors.text.dark,
    textAlign: 'center',
    marginBottom: Theme.spacing.lg,
  },
  backToLoginButton: {
    backgroundColor: Theme.colors.primary.blue,
    borderRadius: Theme.borderRadius.md,
    paddingVertical: Theme.spacing.md,
    paddingHorizontal: Theme.spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backToLoginText: {
    fontFamily: Theme.typography.fontFamily.subheading,
    fontSize: Theme.typography.fontSize.md,
    color: Theme.colors.background.white,
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