import { StyleSheet, View, Text, TouchableOpacity, Linking } from 'react-native';
import { ExternalLink, Info } from 'lucide-react-native';
import Theme from '@/constants/Theme';

export default function RevenueCatInfo() {
  const handleOpenDocs = () => {
    Linking.openURL('https://www.revenuecat.com/docs/getting-started/installation/expo');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Info size={24} color={Theme.colors.primary.blue} />
        <Text style={styles.title}>Implementação de Pagamentos</Text>
      </View>
      
      <Text style={styles.description}>
        Para implementar compras in-app e assinaturas neste aplicativo, você precisará:
      </Text>
      
      <View style={styles.steps}>
        <View style={styles.step}>
          <View style={styles.stepNumber}>
            <Text style={styles.stepNumberText}>1</Text>
          </View>
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>Exportar o projeto</Text>
            <Text style={styles.stepDescription}>
              Exporte este projeto do Bolt para seu ambiente local (Cursor, VS Code, etc.)
            </Text>
          </View>
        </View>
        
        <View style={styles.step}>
          <View style={styles.stepNumber}>
            <Text style={styles.stepNumberText}>2</Text>
          </View>
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>Instalar o SDK do RevenueCat</Text>
            <Text style={styles.stepDescription}>
              Execute o comando: npx expo install react-native-purchases expo-dev-client
            </Text>
          </View>
        </View>
        
        <View style={styles.step}>
          <View style={styles.stepNumber}>
            <Text style={styles.stepNumberText}>3</Text>
          </View>
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>Configurar o SDK</Text>
            <Text style={styles.stepDescription}>
              Siga a documentação oficial do RevenueCat para configurar o SDK e conectar às lojas de aplicativos
            </Text>
          </View>
        </View>
        
        <View style={styles.step}>
          <View style={styles.stepNumber}>
            <Text style={styles.stepNumberText}>4</Text>
          </View>
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>Criar build de desenvolvimento</Text>
            <Text style={styles.stepDescription}>
              Use o Expo Dev Client para testar as compras em um dispositivo real
            </Text>
          </View>
        </View>
      </View>
      
      <TouchableOpacity style={styles.docsButton} onPress={handleOpenDocs}>
        <Text style={styles.docsButtonText}>Acessar Documentação</Text>
        <ExternalLink size={16} color={Theme.colors.background.white} />
      </TouchableOpacity>
      
      <Text style={styles.note}>
        Nota: O RevenueCat é a solução recomendada para implementar compras in-app e assinaturas em aplicativos Expo. Ele gerencia a complexidade das compras nas plataformas iOS e Android.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Theme.colors.background.white,
    borderRadius: Theme.borderRadius.lg,
    padding: Theme.spacing.lg,
    marginHorizontal: Theme.spacing.md,
    marginVertical: Theme.spacing.lg,
    ...Theme.shadows.medium,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Theme.spacing.md,
  },
  title: {
    fontFamily: Theme.typography.fontFamily.heading,
    fontSize: Theme.typography.fontSize.lg,
    color: Theme.colors.text.dark,
    marginLeft: Theme.spacing.sm,
  },
  description: {
    fontFamily: Theme.typography.fontFamily.body,
    fontSize: Theme.typography.fontSize.md,
    color: Theme.colors.text.medium,
    marginBottom: Theme.spacing.lg,
    lineHeight: 22,
  },
  steps: {
    marginBottom: Theme.spacing.lg,
  },
  step: {
    flexDirection: 'row',
    marginBottom: Theme.spacing.md,
  },
  stepNumber: {
    width: 28,
    height: 28,
    borderRadius: Theme.borderRadius.circle,
    backgroundColor: Theme.colors.primary.blue,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Theme.spacing.sm,
    marginTop: 2,
  },
  stepNumberText: {
    fontFamily: Theme.typography.fontFamily.subheading,
    fontSize: Theme.typography.fontSize.sm,
    color: Theme.colors.background.white,
  },
  stepContent: {
    flex: 1,
  },
  stepTitle: {
    fontFamily: Theme.typography.fontFamily.subheading,
    fontSize: Theme.typography.fontSize.md,
    color: Theme.colors.text.dark,
    marginBottom: Theme.spacing.xs,
  },
  stepDescription: {
    fontFamily: Theme.typography.fontFamily.body,
    fontSize: Theme.typography.fontSize.sm,
    color: Theme.colors.text.medium,
    lineHeight: 20,
  },
  docsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Theme.colors.primary.blue,
    borderRadius: Theme.borderRadius.md,
    paddingVertical: Theme.spacing.md,
    marginBottom: Theme.spacing.lg,
  },
  docsButtonText: {
    fontFamily: Theme.typography.fontFamily.subheading,
    fontSize: Theme.typography.fontSize.md,
    color: Theme.colors.background.white,
    marginRight: Theme.spacing.sm,
  },
  note: {
    fontFamily: Theme.typography.fontFamily.body,
    fontSize: Theme.typography.fontSize.sm,
    color: Theme.colors.text.medium,
    fontStyle: 'italic',
    lineHeight: 20,
  },
});