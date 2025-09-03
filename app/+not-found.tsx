import { Link, Stack } from 'expo-router';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import Theme from '@/constants/Theme';
import { Chrome as Home, RefreshCw } from 'lucide-react-native';
import { useTranslation } from '@/utils/i18n';

export default function NotFoundScreen() {
  const { t } = useTranslation();
  
  return (
    <>
      <Stack.Screen options={{ title: 'Oops!' }} />
      <View style={styles.container}>
        <Text style={styles.errorCode}>404</Text>
        <Text style={styles.title}>Página não encontrada</Text>
        <Text style={styles.message}>
          Desculpe, não conseguimos encontrar a página que você está procurando.
        </Text>
        
        <View style={styles.buttonsContainer}>
          <Link href="/" asChild>
            <TouchableOpacity 
              style={styles.button}
              accessibilityLabel="Ir para a página inicial"
              accessibilityRole="button"
            >
              <Home size={20} color={Theme.colors.background.white} />
              <Text style={styles.buttonText}>Página Inicial</Text>
            </TouchableOpacity>
          </Link>
          
          <TouchableOpacity 
            style={[styles.button, styles.secondaryButton]}
            onPress={() => window.location.reload()}
            accessibilityLabel="Tentar novamente"
            accessibilityRole="button"
          >
            <RefreshCw size={20} color={Theme.colors.primary.blue} />
            <Text style={[styles.buttonText, styles.secondaryButtonText]}>Tentar Novamente</Text>
          </TouchableOpacity>
        </View>
        
        <Text style={styles.verse}>
          "Não temas, porque eu sou contigo; não te assombres, porque eu sou teu Deus; eu te fortaleço, e te ajudo, e te sustento com a destra da minha justiça." - Isaías 41:10
        </Text>
      </View>
    </>
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
  errorCode: {
    fontFamily: Theme.typography.fontFamily.heading,
    fontSize: 80,
    color: Theme.colors.primary.blue,
    marginBottom: Theme.spacing.md,
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