import { StyleSheet, View, Text, TextInput, TouchableOpacity, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import Theme from '@/constants/Theme';
import { Link, useRouter } from 'expo-router';
import { Mail, Lock, ArrowRight } from 'lucide-react-native';
import { useAuth } from '@/hooks/useAuth';
import { useState } from 'react';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { signIn } = useAuth();
  const router = useRouter();

  const handleLogin = async () => {
    if (!email || !password) return;
    
    setIsLoading(true);
    const success = await signIn(email, password);
    setIsLoading(false);
    
    if (success) {
      router.replace('/(tabs)');
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <LinearGradient
        colors={[Theme.colors.primary.blue, Theme.colors.primary.lilac, Theme.colors.primary.pink]}
        style={styles.background}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />
      
      <View style={styles.logoContainer}>
        <Text style={styles.logoText}>Bênção Match</Text>
        <Text style={styles.logoSubtext}>Conexões abençoadas</Text>
      </View>
      
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Bem-vindo de volta!</Text>
        <Text style={styles.cardSubtitle}>Entre para encontrar sua conexão abençoada</Text>
        
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
          />
        </View>
        
        <View style={styles.inputContainer}>
          <Lock size={20} color={Theme.colors.text.medium} />
          <TextInput
            style={styles.input}
            placeholder="Senha"
            placeholderTextColor={Theme.colors.text.medium}
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
        </View>
        
        <TouchableOpacity>
          <Text style={styles.forgotPassword}>Esqueceu a senha?</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.loginButton, isLoading && styles.loginButtonDisabled]}
          onPress={handleLogin}
          disabled={isLoading}
        >
          <Text style={styles.loginButtonText}>
            {isLoading ? 'Entrando...' : 'Entrar'}
          </Text>
          {!isLoading && <ArrowRight size={20} color="#fff" />}
        </TouchableOpacity>
        
        <Text style={styles.orText}>ou entre com</Text>
        
        <View style={styles.socialButtonsContainer}>
          <TouchableOpacity style={styles.socialButton}>
            <Text style={styles.socialButtonText}>Google</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.socialButton}>
            <Text style={styles.socialButtonText}>Facebook</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.signupContainer}>
          <Text style={styles.signupText}>Não tem uma conta?</Text>
          <Link href="/(auth)/signup" asChild>
            <TouchableOpacity>
              <Text style={styles.signupLink}>Cadastre-se</Text>
            </TouchableOpacity>
          </Link>
        </View>
      </View>
      
      <Text style={styles.verseText}>"Quem encontra uma esposa encontra algo excelente; recebeu uma bênção do Senhor." Provérbios 18:22</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
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
  forgotPassword: {
    fontFamily: Theme.typography.fontFamily.body,
    fontSize: Theme.typography.fontSize.sm,
    color: Theme.colors.primary.blue,
    textAlign: 'right',
    marginBottom: Theme.spacing.lg,
  },
  loginButton: {
    flexDirection: 'row',
    backgroundColor: Theme.colors.primary.blue,
    borderRadius: Theme.borderRadius.md,
    paddingVertical: Theme.spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Theme.spacing.lg,
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
  orText: {
    fontFamily: Theme.typography.fontFamily.body,
    fontSize: Theme.typography.fontSize.sm,
    color: Theme.colors.text.medium,
    textAlign: 'center',
    marginBottom: Theme.spacing.md,
  },
  socialButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Theme.spacing.lg,
  },
  socialButton: {
    flex: 0.48,
    backgroundColor: Theme.colors.background.light,
    borderRadius: Theme.borderRadius.md,
    paddingVertical: Theme.spacing.sm,
    alignItems: 'center',
  },
  socialButtonText: {
    fontFamily: Theme.typography.fontFamily.subheading,
    fontSize: Theme.typography.fontSize.sm,
    color: Theme.colors.text.dark,
  },
  signupContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  signupText: {
    fontFamily: Theme.typography.fontFamily.body,
    fontSize: Theme.typography.fontSize.sm,
    color: Theme.colors.text.medium,
  },
  signupLink: {
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