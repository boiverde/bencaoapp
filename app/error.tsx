import { useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import Theme from '@/constants/Theme';
import { RefreshCw, Chrome as Home, TriangleAlert as AlertTriangle } from 'lucide-react-native';
import { useTranslation } from '@/utils/i18n';

export default function ErrorScreen(props: { error: Error; reset: () => void }) {
  const { error, reset } = props;
  const router = useRouter();
  const { t } = useTranslation();
  
  // Log the error to console
  useEffect(() => {
    console.error('Application error:', error);
  }, [error]);

  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <AlertTriangle size={64} color={Theme.colors.status.error} />
      </View>
      
      <Text style={styles.title}>Algo deu errado</Text>
      <Text style={styles.message}>
        Desculpe, ocorreu um erro inesperado. Nossa equipe foi notificada.
      </Text>
      
      <View style={styles.errorDetails}>
        <Text style={styles.errorTitle}>{error.name}</Text>
        <Text style={styles.errorMessage}>{error.message}</Text>
      </View>
      
      <View style={styles.buttonsContainer}>
        <TouchableOpacity 
          style={styles.button}
          onPress={reset}
          accessibilityLabel="Tentar novamente"
          accessibilityRole="button"
        >
          <RefreshCw size={20} color={Theme.colors.background.white} />
          <Text style={styles.buttonText}>Tentar Novamente</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.button, styles.secondaryButton]}
          onPress={() => router.replace('/')}
          accessibilityLabel="Ir para a página inicial"
          accessibilityRole="button"
        >
          <Home size={20} color={Theme.colors.primary.blue} />
          <Text style={[styles.buttonText, styles.secondaryButtonText]}>Página Inicial</Text>
        </TouchableOpacity>
      </View>
      
      <Text style={styles.verse}>
        "Não andeis ansiosos por coisa alguma; antes em tudo sejam os vossos pedidos conhecidos diante de Deus pela oração e súplica com ações de graças." - Filipenses 4:6
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: Theme.colors.background.light,
  },
  iconContainer: {
    marginBottom: Theme.spacing.lg,
  },
  title: {
    fontFamily: Theme.typography.fontFamily.heading,
    fontSize: Theme.typography.fontSize.xl,
    color: Theme.colors.text.dark,
    marginBottom: Theme.spacing.md,
  },
  message: {
    fontFamily: Theme.typography.fontFamily.body,
    fontSize: Theme.typography.fontSize.md,
    color: Theme.colors.text.medium,
    textAlign: 'center',
    marginBottom: Theme.spacing.xl,
    maxWidth: 300,
  },
  errorDetails: {
    backgroundColor: Theme.colors.background.white,
    borderRadius: Theme.borderRadius.md,
    padding: Theme.spacing.md,
    width: '100%',
    marginBottom: Theme.spacing.xl,
    ...Theme.shadows.small,
  },
  errorTitle: {
    fontFamily: Theme.typography.fontFamily.subheading,
    fontSize: Theme.typography.fontSize.md,
    color: Theme.colors.status.error,
    marginBottom: Theme.spacing.xs,
  },
  errorMessage: {
    fontFamily: Theme.typography.fontFamily.body,
    fontSize: Theme.typography.fontSize.sm,
    color: Theme.colors.text.dark,
  },
  buttonsContainer: {
    flexDirection: 'row',
    marginBottom: Theme.spacing.xl,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Theme.colors.primary.blue,
    paddingVertical: Theme.spacing.md,
    paddingHorizontal: Theme.spacing.lg,
    borderRadius: Theme.borderRadius.md,
    marginHorizontal: Theme.spacing.sm,
  },
  secondaryButton: {
    backgroundColor: Theme.colors.background.white,
    borderWidth: 1,
    borderColor: Theme.colors.primary.blue,
  },
  buttonText: {
    fontFamily: Theme.typography.fontFamily.subheading,
    fontSize: Theme.typography.fontSize.md,
    color: Theme.colors.background.white,
    marginLeft: Theme.spacing.sm,
  },
  secondaryButtonText: {
    color: Theme.colors.primary.blue,
  },
  verse: {
    fontFamily: Theme.typography.fontFamily.verse,
    fontSize: Theme.typography.fontSize.sm,
    color: Theme.colors.text.medium,
    textAlign: 'center',
    paddingHorizontal: Theme.spacing.xl,
    lineHeight: 22,
  },
});