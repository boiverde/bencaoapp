import { Platform, NativeModules } from 'react-native';
import { useGlobalState } from './stateManager';

// Define available languages
export type Language = 'pt-BR' | 'en-US' | 'es-ES';

// Define translation structure
export interface Translations {
  [key: string]: {
    [key: string]: string;
  };
}

// Get device language
const getDeviceLanguage = (): Language => {
  let deviceLanguage: string;
  
  if (Platform.OS === 'ios') {
    deviceLanguage = NativeModules.SettingsManager.settings.AppleLocale || 
                     NativeModules.SettingsManager.settings.AppleLanguages[0];
  } else if (Platform.OS === 'android') {
    deviceLanguage = NativeModules.I18nManager.localeIdentifier;
  } else {
    // Web
    deviceLanguage = navigator.language;
  }
  
  // Map device language to supported languages
  if (deviceLanguage.startsWith('pt')) {
    return 'pt-BR';
  } else if (deviceLanguage.startsWith('es')) {
    return 'es-ES';
  } else {
    return 'en-US'; // Default to English
  }
};

// Translations
const translations: Translations = {
  // Authentication
  'auth.login.title': {
    'pt-BR': 'Bem-vindo de volta!',
    'en-US': 'Welcome back!',
    'es-ES': '¡Bienvenido de nuevo!'
  },
  'auth.login.subtitle': {
    'pt-BR': 'Entre para encontrar sua conexão abençoada',
    'en-US': 'Sign in to find your blessed connection',
    'es-ES': 'Inicia sesión para encontrar tu conexión bendecida'
  },
  'auth.login.email': {
    'pt-BR': 'Email',
    'en-US': 'Email',
    'es-ES': 'Correo electrónico'
  },
  'auth.login.password': {
    'pt-BR': 'Senha',
    'en-US': 'Password',
    'es-ES': 'Contraseña'
  },
  'auth.login.forgotPassword': {
    'pt-BR': 'Esqueceu a senha?',
    'en-US': 'Forgot password?',
    'es-ES': '¿Olvidaste tu contraseña?'
  },
  'auth.login.button': {
    'pt-BR': 'Entrar',
    'en-US': 'Sign In',
    'es-ES': 'Iniciar sesión'
  },
  'auth.login.or': {
    'pt-BR': 'ou entre com',
    'en-US': 'or sign in with',
    'es-ES': 'o inicia sesión con'
  },
  'auth.login.noAccount': {
    'pt-BR': 'Não tem uma conta?',
    'en-US': 'Don\'t have an account?',
    'es-ES': '¿No tienes una cuenta?'
  },
  'auth.login.signUp': {
    'pt-BR': 'Cadastre-se',
    'en-US': 'Sign Up',
    'es-ES': 'Regístrate'
  },
  
  // Signup
  'auth.signup.title': {
    'pt-BR': 'Criar Conta',
    'en-US': 'Create Account',
    'es-ES': 'Crear Cuenta'
  },
  'auth.signup.subtitle': {
    'pt-BR': 'Preencha seus dados para começar',
    'en-US': 'Fill in your details to get started',
    'es-ES': 'Completa tus datos para comenzar'
  },
  'auth.signup.name': {
    'pt-BR': 'Nome completo',
    'en-US': 'Full name',
    'es-ES': 'Nombre completo'
  },
  'auth.signup.confirmPassword': {
    'pt-BR': 'Confirmar senha',
    'en-US': 'Confirm password',
    'es-ES': 'Confirmar contraseña'
  },
  'auth.signup.button': {
    'pt-BR': 'Criar conta',
    'en-US': 'Create account',
    'es-ES': 'Crear cuenta'
  },
  'auth.signup.terms': {
    'pt-BR': 'Ao criar uma conta, você concorda com nossos Termos de Uso e Política de Privacidade',
    'en-US': 'By creating an account, you agree to our Terms of Use and Privacy Policy',
    'es-ES': 'Al crear una cuenta, aceptas nuestros Términos de uso y Política de privacidad'
  },
  'auth.signup.hasAccount': {
    'pt-BR': 'Já tem uma conta?',
    'en-US': 'Already have an account?',
    'es-ES': '¿Ya tienes una cuenta?'
  },
  'auth.signup.login': {
    'pt-BR': 'Entrar',
    'en-US': 'Sign In',
    'es-ES': 'Iniciar sesión'
  },
  
  // Forgot Password
  'auth.forgotPassword.title': {
    'pt-BR': 'Esqueceu sua senha?',
    'en-US': 'Forgot your password?',
    'es-ES': '¿Olvidaste tu contraseña?'
  },
  'auth.forgotPassword.subtitle': {
    'pt-BR': 'Digite seu email e enviaremos instruções para redefinir sua senha',
    'en-US': 'Enter your email and we\'ll send instructions to reset your password',
    'es-ES': 'Ingresa tu correo electrónico y te enviaremos instrucciones para restablecer tu contraseña'
  },
  'auth.forgotPassword.button': {
    'pt-BR': 'Enviar instruções',
    'en-US': 'Send instructions',
    'es-ES': 'Enviar instrucciones'
  },
  
  // Tabs
  'tabs.discover': {
    'pt-BR': 'Descobrir',
    'en-US': 'Discover',
    'es-ES': 'Descubrir'
  },
  'tabs.connections': {
    'pt-BR': 'Conexões',
    'en-US': 'Connections',
    'es-ES': 'Conexiones'
  },
  'tabs.chat': {
    'pt-BR': 'Chat',
    'en-US': 'Chat',
    'es-ES': 'Chat'
  },
  'tabs.community': {
    'pt-BR': 'Comunidade',
    'en-US': 'Community',
    'es-ES': 'Comunidad'
  },
  'tabs.events': {
    'pt-BR': 'Eventos',
    'en-US': 'Events',
    'es-ES': 'Eventos'
  },
  'tabs.profile': {
    'pt-BR': 'Perfil',
    'en-US': 'Profile',
    'es-ES': 'Perfil'
  },
  
  // Discover
  'discover.title': {
    'pt-BR': 'Bênção Match',
    'en-US': 'Blessing Match',
    'es-ES': 'Bendición Match'
  },
  'discover.noMoreProfiles': {
    'pt-BR': 'Não há mais perfis disponíveis.',
    'en-US': 'No more profiles available.',
    'es-ES': 'No hay más perfiles disponibles.'
  },
  'discover.tryAgain': {
    'pt-BR': 'Tente novamente mais tarde ou ajuste seus filtros.',
    'en-US': 'Try again later or adjust your filters.',
    'es-ES': 'Inténtalo de nuevo más tarde o ajusta tus filtros.'
  },
  
  // Common
  'common.loading': {
    'pt-BR': 'Carregando...',
    'en-US': 'Loading...',
    'es-ES': 'Cargando...'
  },
  'common.error': {
    'pt-BR': 'Erro',
    'en-US': 'Error',
    'es-ES': 'Error'
  },
  'common.success': {
    'pt-BR': 'Sucesso',
    'en-US': 'Success',
    'es-ES': 'Éxito'
  },
  'common.cancel': {
    'pt-BR': 'Cancelar',
    'en-US': 'Cancel',
    'es-ES': 'Cancelar'
  },
  'common.confirm': {
    'pt-BR': 'Confirmar',
    'en-US': 'Confirm',
    'es-ES': 'Confirmar'
  },
  'common.save': {
    'pt-BR': 'Salvar',
    'en-US': 'Save',
    'es-ES': 'Guardar'
  },
  'common.delete': {
    'pt-BR': 'Excluir',
    'en-US': 'Delete',
    'es-ES': 'Eliminar'
  },
  'common.edit': {
    'pt-BR': 'Editar',
    'en-US': 'Edit',
    'es-ES': 'Editar'
  },
  'common.back': {
    'pt-BR': 'Voltar',
    'en-US': 'Back',
    'es-ES': 'Volver'
  },
  'common.next': {
    'pt-BR': 'Próximo',
    'en-US': 'Next',
    'es-ES': 'Siguiente'
  },
  'common.done': {
    'pt-BR': 'Concluído',
    'en-US': 'Done',
    'es-ES': 'Hecho'
  },
  'common.yes': {
    'pt-BR': 'Sim',
    'en-US': 'Yes',
    'es-ES': 'Sí'
  },
  'common.no': {
    'pt-BR': 'Não',
    'en-US': 'No',
    'es-ES': 'No'
  },
  
  // Validation errors
  'validation.required': {
    'pt-BR': 'Este campo é obrigatório',
    'en-US': 'This field is required',
    'es-ES': 'Este campo es obligatorio'
  },
  'validation.email': {
    'pt-BR': 'Email inválido',
    'en-US': 'Invalid email',
    'es-ES': 'Correo electrónico inválido'
  },
  'validation.minLength': {
    'pt-BR': 'Deve ter pelo menos {0} caracteres',
    'en-US': 'Must have at least {0} characters',
    'es-ES': 'Debe tener al menos {0} caracteres'
  },
  'validation.passwordsMatch': {
    'pt-BR': 'Senhas não coincidem',
    'en-US': 'Passwords do not match',
    'es-ES': 'Las contraseñas no coinciden'
  }
};

/**
 * Internationalization utility
 */
export class I18n {
  /**
   * Get translation for a key
   * @param key Translation key
   * @param language Target language
   * @param params Optional parameters for string interpolation
   * @returns Translated string
   */
  static translate(key: string, language: Language, params?: string[]): string {
    const translation = translations[key]?.[language];
    
    if (!translation) {
      console.warn(`Translation missing for key: ${key} in language: ${language}`);
      return key;
    }
    
    if (params && params.length > 0) {
      return params.reduce((str, param, index) => {
        return str.replace(`{${index}}`, param);
      }, translation);
    }
    
    return translation;
  }

  /**
   * Get current device language
   * @returns Device language code
   */
  static getDeviceLanguage(): Language {
    return getDeviceLanguage();
  }

  /**
   * Format date according to locale
   * @param date Date to format
   * @param language Target language
   * @param options Formatting options
   * @returns Formatted date string
   */
  static formatDate(date: Date, language: Language, options?: Intl.DateTimeFormatOptions): string {
    const locale = language.replace('-', '_');
    return new Intl.DateTimeFormat(locale, options).format(date);
  }

  /**
   * Format number according to locale
   * @param number Number to format
   * @param language Target language
   * @param options Formatting options
   * @returns Formatted number string
   */
  static formatNumber(number: number, language: Language, options?: Intl.NumberFormatOptions): string {
    const locale = language.replace('-', '_');
    return new Intl.NumberFormat(locale, options).format(number);
  }
}

/**
 * Hook for using translations in components
 */
export function useTranslation() {
  const [language, setLanguage] = useGlobalState<Language>(
    'app_language', 
    I18n.getDeviceLanguage(),
    { key: 'app_language' }
  );

  const t = (key: string, params?: string[]): string => {
    return I18n.translate(key, language, params);
  };

  const formatDate = (date: Date, options?: Intl.DateTimeFormatOptions): string => {
    return I18n.formatDate(date, language, options);
  };

  const formatNumber = (number: number, options?: Intl.NumberFormatOptions): string => {
    return I18n.formatNumber(number, language, options);
  };

  return {
    t,
    language,
    setLanguage,
    formatDate,
    formatNumber
  };
}