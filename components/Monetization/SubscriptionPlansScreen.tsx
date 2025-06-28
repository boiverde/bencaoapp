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
  Check, 
  Star, 
  Shield, 
  Zap, 
  Heart, 
  Users, 
  Eye, 
  Bell, 
  HandHelping as PrayingHands, 
  Book, 
  Calendar, 
  MessageSquare 
} from 'lucide-react-native';
import Theme from '@/constants/Theme';
import { useMonetization } from '@/hooks/useMonetization';
import { SubscriptionPlan } from '@/utils/monetizationSystem';
import { LinearGradient } from 'expo-linear-gradient';

interface SubscriptionPlansScreenProps {
  onBack: () => void;
}

export default function SubscriptionPlansScreen({ onBack }: SubscriptionPlansScreenProps) {
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);
  
  const { 
    availablePlans, 
    userSubscription, 
    isLoading, 
    isPurchasing, 
    purchaseSubscription,
    isSubscribed,
    getCurrentPlan
  } = useMonetization();

  const handleSelectPlan = (planId: string) => {
    setSelectedPlanId(planId);
  };

  const handlePurchase = async () => {
    if (!selectedPlanId) return;
    
    const success = await purchaseSubscription(selectedPlanId);
    if (success) {
      // In a real app, this would be handled by the purchase flow
      // For now, we'll just go back
      onBack();
    }
  };

  const getFeatureIcon = (feature: string) => {
    if (feature.includes('conexões')) return Users;
    if (feature.includes('filtros')) return Shield;
    if (feature.includes('curtiu')) return Heart;
    if (feature.includes('incógnito')) return Eye;
    if (feature.includes('prioridade')) return Zap;
    if (feature.includes('anúncios')) return Bell;
    if (feature.includes('oração')) return PrayingHands;
    if (feature.includes('mentoria')) return Book;
    if (feature.includes('eventos')) return Calendar;
    if (feature.includes('verificação')) return Shield;
    if (feature.includes('suporte')) return MessageSquare;
    
    return Check;
  };

  const renderPlanCard = (plan: SubscriptionPlan) => {
    const isCurrentPlan = getCurrentPlan()?.id === plan.id;
    const isFreePlan = plan.price === 0;
    
    return (
      <TouchableOpacity
        key={plan.id}
        style={[
          styles.planCard,
          selectedPlanId === plan.id && styles.selectedPlanCard,
          isCurrentPlan && styles.currentPlanCard
        ]}
        onPress={() => handleSelectPlan(plan.id)}
        disabled={isCurrentPlan}
        activeOpacity={0.8}
      >
        {plan.isPopular && (
          <View style={styles.popularBadge}>
            <Star size={12} color={Theme.colors.background.white} />
            <Text style={styles.popularBadgeText}>Mais Popular</Text>
          </View>
        )}
        
        <View style={styles.planHeader}>
          <Text style={styles.planName}>{plan.name}</Text>
          <View style={styles.priceContainer}>
            {isFreePlan ? (
              <Text style={styles.freeText}>Grátis</Text>
            ) : (
              <>
                <Text style={styles.planPrice}>
                  R$ {plan.price.toFixed(2).replace('.', ',')}
                </Text>
                <Text style={styles.planInterval}>
                  /{plan.interval === 'month' ? 'mês' : 'ano'}
                </Text>
              </>
            )}
          </View>
        </View>
        
        <Text style={styles.planDescription}>{plan.description}</Text>
        
        <View style={styles.featuresContainer}>
          {plan.features.map((feature, index) => {
            const FeatureIcon = getFeatureIcon(feature);
            const isPopularFeature = plan.popularFeature === feature;
            
            return (
              <View 
                key={index} 
                style={[
                  styles.featureItem,
                  isPopularFeature && styles.popularFeature
                ]}
              >
                <FeatureIcon 
                  size={16} 
                  color={isPopularFeature ? Theme.colors.primary.gold : Theme.colors.primary.blue} 
                />
                <Text style={[
                  styles.featureText,
                  isPopularFeature && styles.popularFeatureText
                ]}>
                  {feature}
                  {isPopularFeature && ' ✨'}
                </Text>
              </View>
            );
          })}
        </View>
        
        {plan.verse && (
          <View style={styles.verseContainer}>
            <Text style={styles.verseText}>"{plan.verse}"</Text>
          </View>
        )}
        
        {isCurrentPlan ? (
          <View style={styles.currentPlanButton}>
            <Check size={16} color={Theme.colors.background.white} />
            <Text style={styles.currentPlanButtonText}>Plano Atual</Text>
          </View>
        ) : (
          <View style={[
            styles.selectButton,
            selectedPlanId === plan.id && { backgroundColor: plan.color }
          ]}>
            <Text style={[
              styles.selectButtonText,
              selectedPlanId === plan.id && { color: Theme.colors.background.white }
            ]}>
              {selectedPlanId === plan.id ? 'Selecionado' : 'Selecionar'}
            </Text>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={onBack}>
            <ChevronLeft size={24} color={Theme.colors.text.dark} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Planos de Assinatura</Text>
          <View style={styles.placeholder} />
        </View>
        
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Theme.colors.primary.blue} />
          <Text style={styles.loadingText}>Carregando planos...</Text>
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
        <Text style={styles.headerTitle}>Planos de Assinatura</Text>
        <View style={styles.placeholder} />
      </View>
      
      <ScrollView style={styles.content}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Escolha seu Plano Abençoado</Text>
          <Text style={styles.subtitle}>
            Desbloqueie recursos premium para encontrar sua conexão abençoada
          </Text>
        </View>
        
        {availablePlans.map(renderPlanCard)}
        
        <View style={styles.benefitsContainer}>
          <Text style={styles.benefitsTitle}>Benefícios da Assinatura</Text>
          
          <View style={styles.benefitItem}>
            <Heart size={20} color={Theme.colors.primary.pink} />
            <View style={styles.benefitContent}>
              <Text style={styles.benefitTitle}>Conexões Ilimitadas</Text>
              <Text style={styles.benefitDescription}>
                Conheça mais pessoas que compartilham sua fé e valores
              </Text>
            </View>
          </View>
          
          <View style={styles.benefitItem}>
            <Eye size={20} color={Theme.colors.primary.blue} />
            <View style={styles.benefitContent}>
              <Text style={styles.benefitTitle}>Veja Quem Curtiu Você</Text>
              <Text style={styles.benefitDescription}>
                Descubra quem já demonstrou interesse no seu perfil
              </Text>
            </View>
          </View>
          
          <View style={styles.benefitItem}>
            <PrayingHands size={20} color={Theme.colors.primary.gold} />
            <View style={styles.benefitContent}>
              <Text style={styles.benefitTitle}>Círculos de Oração Exclusivos</Text>
              <Text style={styles.benefitDescription}>
                Participe de grupos de oração dedicados e receba suporte espiritual
              </Text>
            </View>
          </View>
          
          <View style={styles.benefitItem}>
            <Shield size={20} color={Theme.colors.status.success} />
            <View style={styles.benefitContent}>
              <Text style={styles.benefitTitle}>Verificação Prioritária</Text>
              <Text style={styles.benefitDescription}>
                Obtenha o selo de verificação mais rapidamente
              </Text>
            </View>
          </View>
        </View>
        
        <View style={styles.testimonialContainer}>
          <LinearGradient
            colors={[Theme.colors.primary.blue + '30', Theme.colors.primary.lilac + '30']}
            style={styles.testimonialGradient}
          >
            <Text style={styles.testimonialText}>
              "Graças ao Bênção Match Premium, encontrei minha esposa! A verificação de perfil e os filtros avançados fizeram toda a diferença."
            </Text>
            <Text style={styles.testimonialAuthor}>João, 32 anos</Text>
          </LinearGradient>
        </View>
        
        <View style={styles.faqContainer}>
          <Text style={styles.faqTitle}>Perguntas Frequentes</Text>
          
          <View style={styles.faqItem}>
            <Text style={styles.faqQuestion}>Como funciona a cobrança?</Text>
            <Text style={styles.faqAnswer}>
              A cobrança é feita automaticamente através da sua conta na App Store ou Google Play. Você pode cancelar a qualquer momento nas configurações da sua conta.
            </Text>
          </View>
          
          <View style={styles.faqItem}>
            <Text style={styles.faqQuestion}>Posso cancelar minha assinatura?</Text>
            <Text style={styles.faqAnswer}>
              Sim, você pode cancelar sua assinatura a qualquer momento. Você continuará tendo acesso aos recursos premium até o final do período atual.
            </Text>
          </View>
          
          <View style={styles.faqItem}>
            <Text style={styles.faqQuestion}>Como restaurar minhas compras?</Text>
            <Text style={styles.faqAnswer}>
              Você pode restaurar suas compras anteriores na tela de configurações do aplicativo, clicando em "Restaurar Compras".
            </Text>
          </View>
        </View>
        
        <View style={styles.spiritualMessage}>
          <Text style={styles.spiritualText}>
            "Melhor é serem dois do que um, porque têm melhor paga do seu trabalho. Porque se um cair, o outro levanta o seu companheiro." - Eclesiastes 4:9-10
          </Text>
        </View>
      </ScrollView>
      
      <View style={styles.footer}>
        <TouchableOpacity 
          style={[
            styles.purchaseButton,
            (!selectedPlanId || isPurchasing) && styles.disabledButton
          ]}
          onPress={handlePurchase}
          disabled={!selectedPlanId || isPurchasing}
        >
          {isPurchasing ? (
            <ActivityIndicator size="small" color={Theme.colors.background.white} />
          ) : (
            <Text style={styles.purchaseButtonText}>
              {isSubscribed() ? 'Alterar Plano' : 'Assinar Agora'}
            </Text>
          )}
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.restoreButton}
          onPress={onBack}
        >
          <Text style={styles.restoreButtonText}>Voltar</Text>
        </TouchableOpacity>
      </View>
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
  content: {
    padding: Theme.spacing.md,
  },
  titleContainer: {
    alignItems: 'center',
    marginBottom: Theme.spacing.lg,
  },
  title: {
    fontFamily: Theme.typography.fontFamily.heading,
    fontSize: Theme.typography.fontSize.xl,
    color: Theme.colors.text.dark,
    marginBottom: Theme.spacing.sm,
    textAlign: 'center',
  },
  subtitle: {
    fontFamily: Theme.typography.fontFamily.body,
    fontSize: Theme.typography.fontSize.md,
    color: Theme.colors.text.medium,
    textAlign: 'center',
    paddingHorizontal: Theme.spacing.lg,
  },
  planCard: {
    backgroundColor: Theme.colors.background.white,
    borderRadius: Theme.borderRadius.lg,
    padding: Theme.spacing.lg,
    marginBottom: Theme.spacing.md,
    ...Theme.shadows.small,
    position: 'relative',
    overflow: 'hidden',
  },
  selectedPlanCard: {
    borderWidth: 2,
    borderColor: Theme.colors.primary.blue,
  },
  currentPlanCard: {
    borderWidth: 2,
    borderColor: Theme.colors.status.success,
  },
  popularBadge: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: Theme.colors.primary.gold,
    paddingHorizontal: Theme.spacing.md,
    paddingVertical: Theme.spacing.xs,
    borderBottomLeftRadius: Theme.borderRadius.md,
    flexDirection: 'row',
    alignItems: 'center',
  },
  popularBadgeText: {
    fontFamily: Theme.typography.fontFamily.subheading,
    fontSize: Theme.typography.fontSize.xs,
    color: Theme.colors.background.white,
    marginLeft: Theme.spacing.xs,
  },
  planHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Theme.spacing.md,
  },
  planName: {
    fontFamily: Theme.typography.fontFamily.subheading,
    fontSize: Theme.typography.fontSize.lg,
    color: Theme.colors.text.dark,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  planPrice: {
    fontFamily: Theme.typography.fontFamily.heading,
    fontSize: Theme.typography.fontSize.xl,
    color: Theme.colors.primary.blue,
  },
  planInterval: {
    fontFamily: Theme.typography.fontFamily.body,
    fontSize: Theme.typography.fontSize.sm,
    color: Theme.colors.text.medium,
  },
  freeText: {
    fontFamily: Theme.typography.fontFamily.heading,
    fontSize: Theme.typography.fontSize.xl,
    color: Theme.colors.status.success,
  },
  planDescription: {
    fontFamily: Theme.typography.fontFamily.body,
    fontSize: Theme.typography.fontSize.sm,
    color: Theme.colors.text.medium,
    marginBottom: Theme.spacing.md,
  },
  featuresContainer: {
    marginBottom: Theme.spacing.md,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Theme.spacing.sm,
  },
  popularFeature: {
    backgroundColor: Theme.colors.primary.gold + '10',
    padding: Theme.spacing.sm,
    borderRadius: Theme.borderRadius.md,
    marginLeft: -Theme.spacing.sm,
    marginRight: -Theme.spacing.sm,
  },
  featureText: {
    fontFamily: Theme.typography.fontFamily.body,
    fontSize: Theme.typography.fontSize.sm,
    color: Theme.colors.text.dark,
    marginLeft: Theme.spacing.sm,
    flex: 1,
  },
  popularFeatureText: {
    fontFamily: Theme.typography.fontFamily.subheading,
    color: Theme.colors.primary.gold,
  },
  verseContainer: {
    backgroundColor: Theme.colors.background.lilac,
    borderRadius: Theme.borderRadius.md,
    padding: Theme.spacing.md,
    marginBottom: Theme.spacing.md,
  },
  verseText: {
    fontFamily: Theme.typography.fontFamily.verse,
    fontSize: Theme.typography.fontSize.sm,
    color: Theme.colors.text.dark,
    fontStyle: 'italic',
    textAlign: 'center',
  },
  selectButton: {
    backgroundColor: Theme.colors.background.light,
    borderRadius: Theme.borderRadius.md,
    paddingVertical: Theme.spacing.md,
    alignItems: 'center',
  },
  selectButtonText: {
    fontFamily: Theme.typography.fontFamily.subheading,
    fontSize: Theme.typography.fontSize.md,
    color: Theme.colors.text.dark,
  },
  currentPlanButton: {
    backgroundColor: Theme.colors.status.success,
    borderRadius: Theme.borderRadius.md,
    paddingVertical: Theme.spacing.md,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  currentPlanButtonText: {
    fontFamily: Theme.typography.fontFamily.subheading,
    fontSize: Theme.typography.fontSize.md,
    color: Theme.colors.background.white,
    marginLeft: Theme.spacing.sm,
  },
  benefitsContainer: {
    backgroundColor: Theme.colors.background.white,
    borderRadius: Theme.borderRadius.lg,
    padding: Theme.spacing.lg,
    marginBottom: Theme.spacing.lg,
    ...Theme.shadows.small,
  },
  benefitsTitle: {
    fontFamily: Theme.typography.fontFamily.subheading,
    fontSize: Theme.typography.fontSize.lg,
    color: Theme.colors.text.dark,
    marginBottom: Theme.spacing.md,
  },
  benefitItem: {
    flexDirection: 'row',
    marginBottom: Theme.spacing.md,
  },
  benefitContent: {
    flex: 1,
    marginLeft: Theme.spacing.md,
  },
  benefitTitle: {
    fontFamily: Theme.typography.fontFamily.subheading,
    fontSize: Theme.typography.fontSize.md,
    color: Theme.colors.text.dark,
    marginBottom: Theme.spacing.xs,
  },
  benefitDescription: {
    fontFamily: Theme.typography.fontFamily.body,
    fontSize: Theme.typography.fontSize.sm,
    color: Theme.colors.text.medium,
    lineHeight: 18,
  },
  testimonialContainer: {
    marginBottom: Theme.spacing.lg,
  },
  testimonialGradient: {
    borderRadius: Theme.borderRadius.lg,
    padding: Theme.spacing.lg,
    ...Theme.shadows.small,
  },
  testimonialText: {
    fontFamily: Theme.typography.fontFamily.verse,
    fontSize: Theme.typography.fontSize.md,
    color: Theme.colors.text.dark,
    fontStyle: 'italic',
    marginBottom: Theme.spacing.md,
    lineHeight: 24,
  },
  testimonialAuthor: {
    fontFamily: Theme.typography.fontFamily.subheading,
    fontSize: Theme.typography.fontSize.sm,
    color: Theme.colors.primary.blue,
    textAlign: 'right',
  },
  faqContainer: {
    backgroundColor: Theme.colors.background.white,
    borderRadius: Theme.borderRadius.lg,
    padding: Theme.spacing.lg,
    marginBottom: Theme.spacing.lg,
    ...Theme.shadows.small,
  },
  faqTitle: {
    fontFamily: Theme.typography.fontFamily.subheading,
    fontSize: Theme.typography.fontSize.lg,
    color: Theme.colors.text.dark,
    marginBottom: Theme.spacing.md,
  },
  faqItem: {
    marginBottom: Theme.spacing.md,
  },
  faqQuestion: {
    fontFamily: Theme.typography.fontFamily.subheading,
    fontSize: Theme.typography.fontSize.md,
    color: Theme.colors.text.dark,
    marginBottom: Theme.spacing.xs,
  },
  faqAnswer: {
    fontFamily: Theme.typography.fontFamily.body,
    fontSize: Theme.typography.fontSize.sm,
    color: Theme.colors.text.medium,
    lineHeight: 20,
  },
  spiritualMessage: {
    backgroundColor: Theme.colors.background.lilac,
    borderRadius: Theme.borderRadius.lg,
    padding: Theme.spacing.md,
    marginBottom: Theme.spacing.xl,
  },
  spiritualText: {
    fontFamily: Theme.typography.fontFamily.verse,
    fontSize: Theme.typography.fontSize.sm,
    color: Theme.colors.text.dark,
    textAlign: 'center',
    lineHeight: 20,
  },
  footer: {
    padding: Theme.spacing.md,
    backgroundColor: Theme.colors.background.white,
    borderTopWidth: 1,
    borderTopColor: Theme.colors.ui.border,
  },
  purchaseButton: {
    backgroundColor: Theme.colors.primary.blue,
    borderRadius: Theme.borderRadius.md,
    paddingVertical: Theme.spacing.md,
    alignItems: 'center',
    marginBottom: Theme.spacing.sm,
  },
  disabledButton: {
    backgroundColor: Theme.colors.ui.disabled,
  },
  purchaseButtonText: {
    fontFamily: Theme.typography.fontFamily.subheading,
    fontSize: Theme.typography.fontSize.md,
    color: Theme.colors.background.white,
  },
  restoreButton: {
    alignItems: 'center',
  },
  restoreButtonText: {
    fontFamily: Theme.typography.fontFamily.body,
    fontSize: Theme.typography.fontSize.sm,
    color: Theme.colors.primary.blue,
  },
});