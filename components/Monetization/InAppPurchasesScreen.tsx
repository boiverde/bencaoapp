import { useState } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity, 
  ActivityIndicator 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { 
  ChevronLeft, 
  Zap, 
  Heart, 
  RotateCcw, 
  Shield, 
  Star, 
  Gift, 
  Info,
  Clock
} from 'lucide-react-native';
import Theme from '@/constants/Theme';
import { useMonetization } from '@/hooks/useMonetization';
import { InAppPurchase } from '@/utils/monetizationSystem';
import { LinearGradient } from 'expo-linear-gradient';

interface InAppPurchasesScreenProps {
  onBack: () => void;
}

export default function InAppPurchasesScreen({ onBack }: InAppPurchasesScreenProps) {
  const [selectedCategory, setSelectedCategory] = useState<InAppPurchase['category'] | 'all'>('all');
  
  const { 
    availablePurchases, 
    isLoading, 
    isPurchasing, 
    purchaseProduct 
  } = useMonetization();

  const handlePurchase = async (productId: string) => {
    await purchaseProduct(productId);
  };

  const getPurchaseIcon = (purchase: InAppPurchase) => {
    const iconProps = { size: 24, color: Theme.colors.primary.blue };
    
    switch (purchase.icon) {
      case 'zap':
        return <Zap {...iconProps} />;
      case 'heart':
        return <Heart {...iconProps} />;
      case 'rotate-ccw':
        return <RotateCcw {...iconProps} />;
      case 'shield':
        return <Shield {...iconProps} />;
      default:
        return <Gift {...iconProps} />;
    }
  };

  const getCategoryName = (category: InAppPurchase['category']) => {
    switch (category) {
      case 'boost':
        return 'Impulsos';
      case 'feature':
        return 'Recursos';
      case 'blessing':
        return 'Bênçãos';
      default:
        return 'Todos';
    }
  };

  const filteredPurchases = selectedCategory === 'all'
    ? availablePurchases
    : availablePurchases.filter(purchase => purchase.category === selectedCategory);

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={onBack}>
            <ChevronLeft size={24} color={Theme.colors.text.dark} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Loja de Recursos</Text>
          <View style={styles.placeholder} />
        </View>
        
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Theme.colors.primary.blue} />
          <Text style={styles.loadingText}>Carregando produtos...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <ChevronLeft size={24} color={Theme.colors.text.dark} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Loja de Recursos</Text>
        <View style={styles.placeholder} />
      </View>
      
      <View style={styles.categoriesContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <TouchableOpacity
            style={[
              styles.categoryButton,
              selectedCategory === 'all' && styles.activeCategoryButton
            ]}
            onPress={() => setSelectedCategory('all')}
          >
            <Gift 
              size={16} 
              color={selectedCategory === 'all' ? Theme.colors.background.white : Theme.colors.text.medium} 
            />
            <Text style={[
              styles.categoryButtonText,
              selectedCategory === 'all' && styles.activeCategoryButtonText
            ]}>
              Todos
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[
              styles.categoryButton,
              selectedCategory === 'boost' && styles.activeCategoryButton
            ]}
            onPress={() => setSelectedCategory('boost')}
          >
            <Zap 
              size={16} 
              color={selectedCategory === 'boost' ? Theme.colors.background.white : Theme.colors.text.medium} 
            />
            <Text style={[
              styles.categoryButtonText,
              selectedCategory === 'boost' && styles.activeCategoryButtonText
            ]}>
              Impulsos
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[
              styles.categoryButton,
              selectedCategory === 'feature' && styles.activeCategoryButton
            ]}
            onPress={() => setSelectedCategory('feature')}
          >
            <Star 
              size={16} 
              color={selectedCategory === 'feature' ? Theme.colors.background.white : Theme.colors.text.medium} 
            />
            <Text style={[
              styles.categoryButtonText,
              selectedCategory === 'feature' && styles.activeCategoryButtonText
            ]}>
              Recursos
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[
              styles.categoryButton,
              selectedCategory === 'blessing' && styles.activeCategoryButton
            ]}
            onPress={() => setSelectedCategory('blessing')}
          >
            <Shield 
              size={16} 
              color={selectedCategory === 'blessing' ? Theme.colors.background.white : Theme.colors.text.medium} 
            />
            <Text style={[
              styles.categoryButtonText,
              selectedCategory === 'blessing' && styles.activeCategoryButtonText
            ]}>
              Bênçãos
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
      
      <ScrollView style={styles.content}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>
            {selectedCategory === 'all' 
              ? 'Recursos Disponíveis' 
              : getCategoryName(selectedCategory)}
          </Text>
          <Text style={styles.subtitle}>
            {selectedCategory === 'boost' 
              ? 'Aumente sua visibilidade e encontre mais conexões'
              : selectedCategory === 'feature'
              ? 'Recursos especiais para melhorar sua experiência'
              : selectedCategory === 'blessing'
              ? 'Bênçãos exclusivas para sua jornada espiritual'
              : 'Escolha entre nossos recursos especiais'}
          </Text>
        </View>
        
        {filteredPurchases.map(purchase => (
          <View key={purchase.id} style={styles.purchaseCard}>
            <View style={styles.purchaseHeader}>
              <View style={styles.purchaseIconContainer}>
                {getPurchaseIcon(purchase)}
              </View>
              <View style={styles.purchaseInfo}>
                <Text style={styles.purchaseName}>{purchase.name}</Text>
                <Text style={styles.purchasePrice}>
                  R$ {purchase.price.toFixed(2).replace('.', ',')}
                </Text>
              </View>
            </View>
            
            <Text style={styles.purchaseDescription}>{purchase.description}</Text>
            
            {purchase.duration && (
              <View style={styles.durationBadge}>
                <Clock size={14} color={Theme.colors.primary.blue} />
                <Text style={styles.durationText}>
                  Válido por {purchase.duration} dias
                </Text>
              </View>
            )}
            
            <TouchableOpacity 
              style={[
                styles.purchaseButton,
                isPurchasing && styles.disabledButton
              ]}
              onPress={() => handlePurchase(purchase.id)}
              disabled={isPurchasing}
            >
              {isPurchasing ? (
                <ActivityIndicator size="small" color={Theme.colors.background.white} />
              ) : (
                <Text style={styles.purchaseButtonText}>Comprar</Text>
              )}
            </TouchableOpacity>
          </View>
        ))}
        
        <View style={styles.infoContainer}>
          <View style={styles.infoHeader}>
            <Info size={20} color={Theme.colors.primary.blue} />
            <Text style={styles.infoTitle}>Informações Importantes</Text>
          </View>
          
          <Text style={styles.infoText}>
            • Os impulsos aumentam sua visibilidade no feed de descoberta
          </Text>
          <Text style={styles.infoText}>
            • Super curtidas destacam seu perfil para outros usuários
          </Text>
          <Text style={styles.infoText}>
            • A função "Voltar Perfil" permite recuperar perfis que você passou
          </Text>
          <Text style={styles.infoText}>
            • A verificação prioritária acelera o processo de obtenção do selo verificado
          </Text>
        </View>
        
        <View style={styles.subscriptionPromo}>
          <LinearGradient
            colors={[Theme.colors.primary.blue + '30', Theme.colors.primary.pink + '30']}
            style={styles.promoGradient}
          >
            <Star size={24} color={Theme.colors.primary.gold} />
            <Text style={styles.promoTitle}>Economize com uma Assinatura</Text>
            <Text style={styles.promoText}>
              Assine o Plano Abençoado e tenha acesso a todos os recursos premium por um preço mensal fixo.
            </Text>
            <TouchableOpacity 
              style={styles.promoButton}
              onPress={() => {
                // Navigate to subscription plans
                onBack();
                // In a real app, this would navigate to the subscription screen
              }}
            >
              <Text style={styles.promoButtonText}>Ver Planos</Text>
            </TouchableOpacity>
          </LinearGradient>
        </View>
        
        <View style={styles.termsContainer}>
          <Text style={styles.termsText}>
            Todas as compras são processadas através da sua conta na App Store ou Google Play e estão sujeitas aos termos de serviço dessas plataformas.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.colors.background.light,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Theme.spacing.md,
    paddingVertical: Theme.spacing.md,
    backgroundColor: Theme.colors.background.white,
    borderBottomWidth: 1,
    borderBottomColor: Theme.colors.ui.border,
  },
  backButton: {
    padding: Theme.spacing.xs,
  },
  headerTitle: {
    fontFamily: Theme.typography.fontFamily.subheading,
    fontSize: Theme.typography.fontSize.lg,
    color: Theme.colors.text.dark,
  },
  placeholder: {
    width: 24,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Theme.spacing.xl,
  },
  loadingText: {
    fontFamily: Theme.typography.fontFamily.body,
    fontSize: Theme.typography.fontSize.md,
    color: Theme.colors.text.medium,
    marginTop: Theme.spacing.md,
  },
  categoriesContainer: {
    backgroundColor: Theme.colors.background.white,
    paddingVertical: Theme.spacing.sm,
    paddingHorizontal: Theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Theme.colors.ui.border,
  },
  categoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Theme.colors.background.light,
    borderRadius: Theme.spacing.md,
    paddingHorizontal: Theme.spacing.md,
    paddingVertical: Theme.spacing.sm,
    marginRight: Theme.spacing.sm,
  },
  activeCategoryButton: {
    backgroundColor: Theme.colors.primary.blue,
  },
  categoryButtonText: {
    fontFamily: Theme.typography.fontFamily.body,
    fontSize: Theme.typography.fontSize.sm,
    color: Theme.colors.text.medium,
    marginLeft: Theme.spacing.xs,
  },
  activeCategoryButtonText: {
    color: Theme.colors.background.white,
  },
  content: {
    padding: Theme.spacing.md,
  },
  titleContainer: {
    marginBottom: Theme.spacing.lg,
  },
  title: {
    fontFamily: Theme.typography.fontFamily.heading,
    fontSize: Theme.typography.fontSize.xl,
    color: Theme.colors.text.dark,
    marginBottom: Theme.spacing.sm,
  },
  subtitle: {
    fontFamily: Theme.typography.fontFamily.body,
    fontSize: Theme.typography.fontSize.md,
    color: Theme.colors.text.medium,
  },
  purchaseCard: {
    backgroundColor: Theme.colors.background.white,
    borderRadius: Theme.borderRadius.lg,
    padding: Theme.spacing.lg,
    marginBottom: Theme.spacing.md,
    ...Theme.shadows.small,
  },
  purchaseHeader: {
    flexDirection: 'row',
    marginBottom: Theme.spacing.md,
  },
  purchaseIconContainer: {
    width: 48,
    height: 48,
    borderRadius: Theme.borderRadius.circle,
    backgroundColor: Theme.colors.primary.blue + '20',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Theme.spacing.md,
  },
  purchaseInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  purchaseName: {
    fontFamily: Theme.typography.fontFamily.subheading,
    fontSize: Theme.typography.fontSize.md,
    color: Theme.colors.text.dark,
    marginBottom: Theme.spacing.xs,
  },
  purchasePrice: {
    fontFamily: Theme.typography.fontFamily.heading,
    fontSize: Theme.typography.fontSize.md,
    color: Theme.colors.primary.blue,
  },
  purchaseDescription: {
    fontFamily: Theme.typography.fontFamily.body,
    fontSize: Theme.typography.fontSize.sm,
    color: Theme.colors.text.medium,
    marginBottom: Theme.spacing.md,
    lineHeight: 20,
  },
  durationBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Theme.colors.primary.blue + '10',
    alignSelf: 'flex-start',
    borderRadius: Theme.borderRadius.md,
    paddingHorizontal: Theme.spacing.sm,
    paddingVertical: Theme.spacing.xs,
    marginBottom: Theme.spacing.md,
  },
  durationText: {
    fontFamily: Theme.typography.fontFamily.body,
    fontSize: Theme.typography.fontSize.xs,
    color: Theme.colors.primary.blue,
    marginLeft: Theme.spacing.xs,
  },
  purchaseButton: {
    backgroundColor: Theme.colors.primary.blue,
    borderRadius: Theme.borderRadius.md,
    paddingVertical: Theme.spacing.md,
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: Theme.colors.ui.disabled,
  },
  purchaseButtonText: {
    fontFamily: Theme.typography.fontFamily.subheading,
    fontSize: Theme.typography.fontSize.md,
    color: Theme.colors.background.white,
  },
  infoContainer: {
    backgroundColor: Theme.colors.background.white,
    borderRadius: Theme.borderRadius.lg,
    padding: Theme.spacing.lg,
    marginBottom: Theme.spacing.lg,
    ...Theme.shadows.small,
  },
  infoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Theme.spacing.md,
  },
  infoTitle: {
    fontFamily: Theme.typography.fontFamily.subheading,
    fontSize: Theme.typography.fontSize.md,
    color: Theme.colors.text.dark,
    marginLeft: Theme.spacing.sm,
  },
  infoText: {
    fontFamily: Theme.typography.fontFamily.body,
    fontSize: Theme.typography.fontSize.sm,
    color: Theme.colors.text.medium,
    marginBottom: Theme.spacing.sm,
    lineHeight: 20,
  },
  subscriptionPromo: {
    marginBottom: Theme.spacing.lg,
  },
  promoGradient: {
    borderRadius: Theme.borderRadius.lg,
    padding: Theme.spacing.lg,
    alignItems: 'center',
    ...Theme.shadows.small,
  },
  promoTitle: {
    fontFamily: Theme.typography.fontFamily.subheading,
    fontSize: Theme.typography.fontSize.lg,
    color: Theme.colors.text.dark,
    marginTop: Theme.spacing.sm,
    marginBottom: Theme.spacing.sm,
  },
  promoText: {
    fontFamily: Theme.typography.fontFamily.body,
    fontSize: Theme.typography.fontSize.md,
    color: Theme.colors.text.dark,
    textAlign: 'center',
    marginBottom: Theme.spacing.md,
    lineHeight: 22,
  },
  promoButton: {
    backgroundColor: Theme.colors.primary.blue,
    borderRadius: Theme.borderRadius.md,
    paddingHorizontal: Theme.spacing.lg,
    paddingVertical: Theme.spacing.md,
  },
  promoButtonText: {
    fontFamily: Theme.typography.fontFamily.subheading,
    fontSize: Theme.typography.fontSize.md,
    color: Theme.colors.background.white,
  },
  termsContainer: {
    marginBottom: Theme.spacing.xl,
  },
  termsText: {
    fontFamily: Theme.typography.fontFamily.body,
    fontSize: Theme.typography.fontSize.xs,
    color: Theme.colors.text.light,
    textAlign: 'center',
    lineHeight: 16,
  },
});