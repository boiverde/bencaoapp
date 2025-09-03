import { useState } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import Theme from '@/constants/Theme';
import { Link, useRouter } from 'expo-router';
import { Mail, Lock, User, ArrowLeft, Eye, EyeOff } from 'lucide-react-native';
import { useAuth } from '@/hooks/useAuth';
import { Performance } from '@/utils/performance';
import PhotoUpload from '@/components/UI/PhotoUpload';
import { ImageUploadService } from '@/utils/imageUploadService';

export default function SignupScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [photo, setPhoto] = useState<string>();
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  
  const [nameError, setNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  
  const { signUp, isLoading, error } = useAuth();
  const router = useRouter();

  // Debounced validation functions
  const validateName = Performance.debounce((text: string) => {
    if (!text) {
      setNameError('Nome é obrigatório');
    } else if (text.length < 3) {
      setNameError('Nome deve ter pelo menos 3 caracteres');
    } else {
      setNameError('');
    }
  }, 300);

  const validateEmail = Performance.debounce((text: string) => {
    if (!text) {
      setEmailError('Email é obrigatório');
    } else if (!/\S+@\S+\.\S+/.test(text)) {
      setEmailError('Email inválido');
    } else {
      setEmailError('');
    }
  }, 300);

  const validatePassword = Performance.debounce((text: string) => {
    if (!text) {
      setPasswordError('Senha é obrigatória');
    } else if (text.length < 6) {
      setPasswordError('Senha deve ter pelo menos 6 caracteres');
    } else {
      setPasswordError('');
    }
    
    // Also validate confirm password if it's not empty
    if (confirmPassword) {
      validateConfirmPassword(confirmPassword, text);
    }
  }, 300);

  const validateConfirmPassword = Performance.debounce((text: string, pass: string = password) => {
    if (!text) {
      setConfirmPasswordError('Confirmação de senha é obrigatória');
    } else if (text !== pass) {
      setConfirmPasswordError('Senhas não coincidem');
    } else {
      setConfirmPasswordError('');
    }
  }, 300);

  const handleNameChange = (text: string) => {
    setName(text);
    validateName(text);
  };

  const handleEmailChange = (text: string) => {
    setEmail(text);
    validateEmail(text);
  };

  const handlePasswordChange = (text: string) => {
    setPassword(text);
    validatePassword(text);
  };

  const handleConfirmPasswordChange = (text: string) => {
    setConfirmPassword(text);
    validateConfirmPassword(text);
  };

  const handleSignup = async () => {
    // Validate all inputs
    validateName(name);
    validateEmail(email);
    validatePassword(password);
    validateConfirmPassword(confirmPassword);
    
    if (!name || !email || !password || !confirmPassword || 
        nameError || emailError || passwordError || confirmPasswordError) {
      return;
    }
    
    const success = await signUp(email, password, name);
    if (success) {
      router.replace('/(tabs)');
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handleBack = () => {
    router.back();
  };

  const handlePhotoSelected = async (uri: string) => {
    setIsUploadingPhoto(true);
    try {
      // In a real implementation, you would upload to Cloudinary or Supabase Storage
      // For now, we'll just set the local URI
      setPhoto(uri);
    } catch (error) {
      console.error('Error handling photo:', error);
    } finally {
      setIsUploadingPhoto(false);
    }
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
          <Text style={styles.logoSubtext}>Comece sua jornada abençoada</Text>
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
          
          <Text style={styles.cardTitle}>Criar Conta</Text>
          <Text style={styles.cardSubtitle}>Preencha seus dados para começar</Text>
          
          {error && (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}
          
          <PhotoUpload 
            photo={photo} 
            onPhotoSelected={handlePhotoSelected}
            isUploading={isUploadingPhoto}
            label="Adicionar foto de perfil"
          />
          
          <View style={styles.inputContainer}>
            <User size={20} color={Theme.colors.text.medium} />
            <TextInput
              style={styles.input}
              placeholder="Nome completo"
              placeholderTextColor={Theme.colors.text.medium}
              autoCapitalize="words"
              value={name}
              onChangeText={handleNameChange}
              editable={!isLoading}
              accessibilityLabel="Nome completo"
              accessibilityHint="Digite seu nome completo"
            />
          </View>
          {nameError ? <Text style={styles.fieldError}>{nameError}</Text> : null}
          
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
              accessibilityHint="Digite seu email"
            />
          </View>
          {emailError ? <Text style={styles.fieldError}>{emailError}</Text> : null}
          
          <View style={styles.inputContainer}>
            <Lock size={20} color={Theme.colors.text.medium} />
            <TextInput
              style={styles.input}
              placeholder="Senha"
              placeholderTextColor={Theme.colors.text.medium}
              secureTextEntry={!showPassword}
              value={password}
              onChangeText={handlePasswordChange}
              editable={!isLoading}
              accessibilityLabel="Senha"
              accessibilityHint="Digite sua senha"
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
          {passwordError ? <Text style={styles.fieldError}>{passwordError}</Text> : null}
          
          <View style={styles.inputContainer}>
            <Lock size={20} color={Theme.colors.text.medium} />
            <TextInput
              style={styles.input}
              placeholder="Confirmar senha"
              placeholderTextColor={Theme.colors.text.medium}
              secureTextEntry={!showConfirmPassword}
              value={confirmPassword}
              onChangeText={handleConfirmPasswordChange}
              editable={!isLoading}
              accessibilityLabel="Confirmar senha"
              accessibilityHint="Digite sua senha novamente"
            />
            <TouchableOpacity 
              onPress={toggleConfirmPasswordVisibility}
              accessibilityLabel={showConfirmPassword ? "Ocultar confirmação de senha" : "Mostrar confirmação de senha"}
              accessibilityRole="button"
            >
              {showConfirmPassword ? (
                <EyeOff size={20} color={Theme.colors.text.medium} />
              ) : (
                <Eye size={20} color={Theme.colors.text.medium} />
              )}
            </TouchableOpacity>
          </View>
          {confirmPasswordError ? <Text style={styles.fieldError}>{confirmPasswordError}</Text> : null}
          
          <TouchableOpacity 
            style={[styles.signupButton, isLoading && styles.signupButtonDisabled]}
            onPress={handleSignup}
            disabled={isLoading}
            accessibilityLabel="Criar conta"
            accessibilityRole="button"
            accessibilityHint="Toque para criar sua conta"
          >
            {isLoading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={styles.signupButtonText}>Criar conta</Text>
            )}
          </TouchableOpacity>
          
          <View style={styles.termsContainer}>
            <Text style={styles.termsText}>
              Ao criar uma conta, você concorda com nossos{' '}
              <Text style={styles.termsLink}>Termos de Uso</Text> e{' '}
              <Text style={styles.termsLink}>Política de Privacidade</Text>
            </Text>
          </View>
          
          <View style={styles.loginContainer}>
            <Text style={styles.loginText}>Já tem uma conta?</Text>
            <Link href="/login" asChild>
              <TouchableOpacity accessibilityRole="link" accessibilityHint="Ir para a tela de login">
                <Text style={styles.loginLink}>Entrar</Text>
              </TouchableOpacity>
            </Link>
          </View>
        </View>
        
        <Text style={styles.verseText}>"Entrega o teu caminho ao Senhor; confia nele, e ele tudo fará." Salmos 37:5</Text>
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
  signupButton: {
    backgroundColor: Theme.colors.primary.blue,
    borderRadius: Theme.borderRadius.md,
    paddingVertical: Theme.spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: Theme.spacing.md,
    marginBottom: Theme.spacing.md,
  },
  signupButtonDisabled: {
    backgroundColor: Theme.colors.ui.disabled,
  },
  signupButtonText: {
    fontFamily: Theme.typography.fontFamily.subheading,
    fontSize: Theme.typography.fontSize.md,
    color: Theme.colors.background.white,
  },
  termsContainer: {
    marginBottom: Theme.spacing.lg,
  },
  termsText: {
    fontFamily: Theme.typography.fontFamily.body,
    fontSize: Theme.typography.fontSize.sm,
    color: Theme.colors.text.medium,
    textAlign: 'center',
    lineHeight: 20,
  },
  termsLink: {
    color: Theme.colors.primary.blue,
    textDecorationLine: 'underline',
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginText: {
    fontFamily: Theme.typography.fontFamily.body,
    fontSize: Theme.typography.fontSize.sm,
    color: Theme.colors.text.medium,
  },
  loginLink: {
    fontFamily: Theme.typography.fontFamily.subheading,
    fontSize: Theme.typography.fontSize.sm,
    color: Theme.colors.primary.pink,
    marginLeft: Theme.spacing.xs,
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