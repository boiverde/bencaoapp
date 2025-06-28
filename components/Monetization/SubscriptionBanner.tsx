import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { Crown, Zap, Heart, Shield, Star } from 'lucide-react-native';
import Theme from '@/constants/Theme';
import { useMonetization } from '@/hooks/useMonetization';
import { LinearGradient } from 'expo-linear-gradient';

interface SubscriptionBannerProps {
  onPress: () => void;
  compact?: boolean;
}

export default function SubscriptionBanner({ 
  onPress,
  compact = false 
}: SubscriptionBannerProps) {
  const { isSubscribed, getCurrentPlan, getRemainingDays } = useMonetization();
  
  // If user is already subscribed, show a different banner
  if (isSubscribed()) {
    const currentPlan = getCurrentPlan();
    const remainingDays = getRemainingDays();
    
    if (compact) {
      return (
        <TouchableOpacity 
          style={styles.compactSubscribedContainer}
          onPress={onPress}
        >
          <Crown size={16} color={Theme.colors.primary.gold} />
          <Text style={styles.compactSubscribedText}>
            {currentPlan?.name} • {remainingDays} dias restantes
          </Text>
        </TouchableOpacity>
      );
    }
    
    return (
      <TouchableOpacity 
        style={styles.subscribedContainer}
        onPress={onPress}
      >
        <LinearGradient
          colors={[Theme.colors.primary.gold + '30', Theme.colors.primary.gold + '10']}
          style={styles.subscribedGradient}
        >
          <View style={styles.subscribedHeader}>
            <Crown size={24} color={Theme.colors.primary.gold} />
            <Text style={styles.subscribedTitle}>{currentPlan?.name}</Text>
          </View>
          
          <Text style={styles.subscribedText}>
            Sua assinatura está ativa. Você tem acesso a todos os recursos premium.
          </Text>
          
          <View style={styles.remainingDaysContainer}>
            <Text style={styles.remainingDaysText}>
              {remainingDays} dias restantes
            </Text>
          </View>
        </LinearGradient>
      </TouchableOpacity>
    );
  }

  if (compact) {
    return (
      <TouchableOpacity 
        style={styles.compactContainer}
        onPress={onPress}
      >
        <Crown size={16} color={Theme.colors.primary.pink} />
        <Text style={styles.compactText}>Assine o Plano Abençoado</Text>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity 
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.9}
    >
      <LinearGradient
        colors={[Theme.colors.primary.blue + '40', Theme.colors.primary.pink + '40']}
        style={styles.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
      >
        <View style={styles.content}>
          <View style={styles.header}>
            <Crown size={24} color={Theme.colors.primary.gold} />
            <Text style={styles.title}>Plano Abençoado</Text>
          </View>
          
          <Text style={styles.description}>
            Desbloqueie recursos premium e encontre sua conexão abençoada
          </Text>
          
          <View style={styles.featuresContainer}>
            <View style={styles.featureItem}>
              <Zap size={16} color={Theme.colors.primary.gold} />
              <Text style={styles.featureText}>Conexões ilimitadas</Text>
            </View>
            
            <View style={styles.featureItem}>
              <Heart size={16} color={Theme.colors.primary.gold} />
              <Text style={styles.featureText}>Veja quem curtiu você</Text>
            </View>
            
            <View style={styles.featureItem}>
              <Shield size={16} color={Theme.colors.primary.gold} />
              <Text style={styles.featureText}>Verificação prioritária</Text>
            </View>
          </View>
          
          <View style={styles.ctaButton}>
            <Star size={16} color={Theme.colors.background.white} />
            <Text style={styles.ctaButtonText}>Assinar Agora</Text>
          </View>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: Theme.spacing.md,
    marginVertical: Theme.spacing.md,
    borderRadius: Theme.borderRadius.lg,
    overflow: 'hidden',
    ...Theme.shadows.medium,
  },
  compactContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Theme.colors.primary.pink + '20',
    borderRadius: Theme.borderRadius.md,
    paddingHorizontal: Theme.spacing.md,
    paddingVertical: Theme.spacing.sm,
  },
  compactText: {
    fontFamily: Theme.typography.fontFamily.subheading,
    fontSize: Theme.typography.fontSize.sm,
    color: Theme.colors.primary.pink,
    marginLeft: Theme.spacing.xs,
  },
  gradient: {
    padding: Theme.spacing.md,
  },
  content: {
    backgroundColor: Theme.colors.background.white + '90',
    borderRadius: Theme.borderRadius.md,
    padding: Theme.spacing.md,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Theme.spacing.sm,
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
    color: Theme.colors.text.dark,
    marginBottom: Theme.spacing.md,
  },
  featuresContainer: {
    marginBottom: Theme.spacing.md,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Theme.spacing.xs,
  },
  featureText: {
    fontFamily: Theme.typography.fontFamily.body,
    fontSize: Theme.typography.fontSize.sm,
    color: Theme.colors.text.dark,
    marginLeft: Theme.spacing.sm,
  },
  ctaButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Theme.colors.primary.blue,
    borderRadius: Theme.borderRadius.md,
    paddingVertical: Theme.spacing.sm,
  },
  ctaButtonText: {
    fontFamily: Theme.typography.fontFamily.subheading,
    fontSize: Theme.typography.fontSize.md,
    color: Theme.colors.background.white,
    marginLeft: Theme.spacing.sm,
  },
  subscribedContainer: {
    marginHorizontal: Theme.spacing.md,
    marginVertical: Theme.spacing.md,
    borderRadius: Theme.borderRadius.lg,
    overflow: 'hidden',
    ...Theme.shadows.medium,
  },
  compactSubscribedContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Theme.colors.primary.gold + '20',
    borderRadius: Theme.borderRadius.md,
    paddingHorizontal: Theme.spacing.md,
    paddingVertical: Theme.spacing.sm,
  },
  compactSubscribedText: {
    fontFamily: Theme.typography.fontFamily.subheading,
    fontSize: Theme.typography.fontSize.sm,
    color: Theme.colors.primary.gold,
    marginLeft: Theme.spacing.xs,
  },
  subscribedGradient: {
    padding: Theme.spacing.md,
  },
  subscribedHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Theme.spacing.sm,
  },
  subscribedTitle: {
    fontFamily: Theme.typography.fontFamily.heading,
    fontSize: Theme.typography.fontSize.lg,
    color: Theme.colors.primary.gold,
    marginLeft: Theme.spacing.sm,
  },
  subscribedText: {
    fontFamily: Theme.typography.fontFamily.body,
    fontSize: Theme.typography.fontSize.md,
    color: Theme.colors.text.dark,
    marginBottom: Theme.spacing.md,
  },
  remainingDaysContainer: {
    backgroundColor: Theme.colors.primary.gold + '20',
    borderRadius: Theme.borderRadius.md,
    paddingVertical: Theme.spacing.xs,
    paddingHorizontal: Theme.spacing.sm,
    alignSelf: 'flex-start',
  },
  remainingDaysText: {
    fontFamily: Theme.typography.fontFamily.subheading,
    fontSize: Theme.typography.fontSize.sm,
    color: Theme.colors.primary.gold,
  },
});