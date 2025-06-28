import { ReactNode } from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { Lock, Crown } from 'lucide-react-native';
import Theme from '@/constants/Theme';
import { useMonetization } from '@/hooks/useMonetization';

interface FeatureGateProps {
  feature: string;
  fallback?: ReactNode;
  children: ReactNode;
  onUpgrade?: () => void;
}

export default function FeatureGate({ 
  feature, 
  fallback, 
  children, 
  onUpgrade 
}: FeatureGateProps) {
  const { hasFeatureAccess } = useMonetization();
  
  const hasAccess = hasFeatureAccess(feature);
  
  if (hasAccess) {
    return <>{children}</>;
  }
  
  if (fallback) {
    return <>{fallback}</>;
  }
  
  return (
    <View style={styles.container}>
      <View style={styles.lockIconContainer}>
        <Lock size={32} color={Theme.colors.primary.blue} />
      </View>
      
      <Text style={styles.title}>Recurso Premium</Text>
      <Text style={styles.description}>
        Este recurso está disponível apenas para assinantes do Plano Abençoado.
      </Text>
      
      {onUpgrade && (
        <TouchableOpacity 
          style={styles.upgradeButton}
          onPress={onUpgrade}
        >
          <Crown size={16} color={Theme.colors.background.white} />
          <Text style={styles.upgradeButtonText}>Assinar Agora</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Theme.colors.background.white,
    borderRadius: Theme.borderRadius.lg,
    padding: Theme.spacing.lg,
    alignItems: 'center',
    ...Theme.shadows.small,
  },
  lockIconContainer: {
    width: 64,
    height: 64,
    borderRadius: Theme.borderRadius.circle,
    backgroundColor: Theme.colors.primary.blue + '20',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Theme.spacing.md,
  },
  title: {
    fontFamily: Theme.typography.fontFamily.subheading,
    fontSize: Theme.typography.fontSize.lg,
    color: Theme.colors.text.dark,
    marginBottom: Theme.spacing.sm,
  },
  description: {
    fontFamily: Theme.typography.fontFamily.body,
    fontSize: Theme.typography.fontSize.md,
    color: Theme.colors.text.medium,
    textAlign: 'center',
    marginBottom: Theme.spacing.lg,
    lineHeight: 22,
  },
  upgradeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Theme.colors.primary.blue,
    borderRadius: Theme.borderRadius.md,
    paddingHorizontal: Theme.spacing.lg,
    paddingVertical: Theme.spacing.md,
  },
  upgradeButtonText: {
    fontFamily: Theme.typography.fontFamily.subheading,
    fontSize: Theme.typography.fontSize.md,
    color: Theme.colors.background.white,
    marginLeft: Theme.spacing.sm,
  },
});