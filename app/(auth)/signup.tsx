import { StyleSheet, View, Text, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import Theme from '@/constants/Theme';
import { Link, useRouter } from 'expo-router';
import { Mail, Lock, User, Calendar, ChevronRight } from 'lucide-react-native';
import { useAuth } from '@/hooks/useAuth';
import { useState } from 'react';

export default function SignupScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { signUp } = useAuth();
  const router = useRouter();

  const handleSignup = async () => {
    if (!name || !email || !password || !confirmPassword) return;
    if (password !== confirmPassword) return;
    
    setIsLoading(true);
    const success = await signUp(email, password, name);
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
        <Text style={styles.logoSubtext}>Comece sua jornada abençoada</Text>
      </View>
      
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Criar Conta</Text>
          <Text style={styles.cardSubtitle}>Preencha seus dados para começar</Text>
          
          <View style={styles.inputContainer}>
            <User size={20} color={Theme.colors.text.medium} />
            <TextInput
              style={styles.input}
              placeholder="Nome completo"
              placeholderTextColor={Theme.colors.text.medium}
              autoCapitalize="words"
              value={name}
              onChangeText={setName}
            />
          </View>
          
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
          
          <View style={styles.inputContainer}>
            <Lock size={20} color={Theme.colors.text.medium} />
            <TextInput
              style={styles.input}
              placeholder="Confirmar senha"
              placeholderTextColor={Theme.colors.text.medium}
              secureTextEntry
              value={confirmPassword}
              onChangeText={setConfirmPassword}
            />
          </View>
          
          <TouchableOpacity 
            style={[styles.signupButton, isLoading && styles.signupButtonDisabled]}
            onPress={handleSignup}
            disabled={isLoading}
          >
            <Text style={styles.signupButtonText}>
              {isLoading ? 'Criando...' : 'Criar conta'}
            </Text>
            {!isLoading && <ChevronRight size={20} color="#fff" />}
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
            <Link href="/(auth)/login" asChild>
              <TouchableOpacity>
                <Text style={styles.loginLink}>Entrar</Text>
              </TouchableOpacity>
            </Link>
          </View>
        </View>
      </ScrollView>
      
      <Text style={styles.verseText}>"Entrega o teu caminho ao Senhor; confia nele, e ele tudo fará." Salmos 37:5</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  scrollContent: {
    flexGrow: 1,
    alignItems: 'center',
    paddingVertical: Theme.spacing.xl,
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: Theme.spacing.xl,
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
  signupButton: {
    flexDirection: 'row',
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
    marginRight: Theme.spacing.sm,
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
    marginTop: Theme.spacing.md,
    marginBottom: Theme.spacing.xl,
    paddingHorizontal: Theme.spacing.lg,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
});