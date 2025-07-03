import { useState } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, Image, ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import { Mail, Lock, ArrowRight, Eye, EyeOff } from 'lucide-react-native';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const router = useRouter();

  const handleLogin = async () => {
    if (!email || !password) {
      setError('Por favor, preencha todos os campos');
      return;
    }
    
    setIsLoading(true);
    setError('');
    
    // Simulando uma chamada de API
    setTimeout(() => {
      // Credenciais de teste para login
      if ((email === 'demo@example.com' && password === 'password') || 
          (email === 'aguiar.neves@hotmail.com' && password === '12345678')) {
        // Login bem-sucedido
        router.replace('/(tabs)');
      } else {
        // Login falhou
        setError('Email ou senha inválidos');
        setIsLoading(false);
      }
    }, 1500);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 50 : 0}
    >
      <StatusBar style="light" />
      <LinearGradient
        colors={['#6BBBDD', '#B8A0D9', '#F498B6']}
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
          <Text style={styles.logoSubtext}>Conexões abençoadas</Text>
        </View>
        
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Cliente de Teste</Text>
          <Text style={styles.cardSubtitle}>Use as credenciais abaixo para testar o aplicativo</Text>
          
          <View style={styles.testCredentials}>
            <Text style={styles.credentialLabel}>Email: <Text style={styles.credentialValue}>demo@example.com</Text></Text>
            <Text style={styles.credentialLabel}>Senha: <Text style={styles.credentialValue}>password</Text></Text>
          </View>
          
          {error && (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}
          
          <View style={styles.inputContainer}>
            <Mail size={20} color="#636E72" />
            <TextInput
              style={styles.input}
              placeholder="Email"
              placeholderTextColor="#636E72"
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
              editable={!isLoading}
              accessibilityLabel="Email"
              accessibilityHint="Digite seu email de login"
            />
          </View>
          
          <View style={styles.inputContainer}>
            <Lock size={20} color="#636E72" />
            <TextInput
              style={styles.input}
              placeholder="Senha"
              placeholderTextColor="#636E72"
              secureTextEntry={!showPassword}
              value={password}
              onChangeText={setPassword}
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
                <EyeOff size={20} color="#636E72" />
              ) : (
                <Eye size={20} color="#636E72" />
              )}
            </TouchableOpacity>
          </View>
          
          <TouchableOpacity 
            style={[styles.loginButton, isLoading && styles.loginButtonDisabled]}
            onPress={handleLogin}
            disabled={isLoading}
            accessibilityLabel="Entrar"
            accessibilityRole="button"
            accessibilityHint="Toque para fazer login"
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
          
          <View style={styles.adminSection}>
            <Text style={styles.adminText}>Credenciais de Administrador:</Text>
            <Text style={styles.credentialLabel}>Email: <Text style={styles.credentialValue}>aguiar.neves@hotmail.com</Text></Text>
            <Text style={styles.credentialLabel}>Senha: <Text style={styles.credentialValue}>12345678</Text></Text>
          </View>
        </View>
        
        <Text style={styles.verseText}>"Quem encontra uma esposa encontra algo excelente; recebeu uma bênção do Senhor." Provérbios 18:22</Text>
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
    paddingVertical: 32,
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
    marginBottom: 32,
  },
  logoText: {
    fontFamily: 'Montserrat-Bold',
    fontSize: 30,
    color: '#FFFFFF',
    textShadowColor: 'rgba(0, 0, 0, 0.15)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  logoSubtext: {
    fontFamily: 'PlayfairDisplay-Italic',
    fontSize: 16,
    color: '#FFFFFF',
    textShadowColor: 'rgba(0, 0, 0, 0.15)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  card: {
    width: '85%',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  cardTitle: {
    fontFamily: 'Montserrat-Bold',
    fontSize: 20,
    color: '#2D3436',
    marginBottom: 4,
  },
  cardSubtitle: {
    fontFamily: 'OpenSans-Regular',
    fontSize: 16,
    color: '#636E72',
    marginBottom: 16,
  },
  testCredentials: {
    backgroundColor: '#F5F8FA',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  credentialLabel: {
    fontFamily: 'OpenSans-Regular',
    fontSize: 14,
    color: '#636E72',
    marginBottom: 4,
  },
  credentialValue: {
    fontFamily: 'OpenSans-SemiBold',
    color: '#6BBBDD',
  },
  errorContainer: {
    backgroundColor: '#EB5757' + '20',
    borderRadius: 8,
    padding: 8,
    marginBottom: 16,
  },
  errorText: {
    fontFamily: 'OpenSans-Regular',
    fontSize: 14,
    color: '#EB5757',
    textAlign: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F8FA',
    borderRadius: 8,
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  input: {
    flex: 1,
    fontFamily: 'OpenSans-Regular',
    fontSize: 16,
    paddingVertical: 16,
    marginLeft: 8,
    color: '#2D3436',
  },
  loginButton: {
    flexDirection: 'row',
    backgroundColor: '#6BBBDD',
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  loginButtonDisabled: {
    backgroundColor: '#EAEAEA',
  },
  loginButtonText: {
    fontFamily: 'Montserrat-SemiBold',
    fontSize: 16,
    color: '#FFFFFF',
    marginRight: 8,
  },
  adminSection: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#DFE6E9',
  },
  adminText: {
    fontFamily: 'OpenSans-SemiBold',
    fontSize: 14,
    color: '#2D3436',
    marginBottom: 8,
  },
  verseText: {
    fontFamily: 'PlayfairDisplay-Italic',
    fontSize: 14,
    color: '#FFFFFF',
    textAlign: 'center',
    marginTop: 32,
    paddingHorizontal: 24,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
});