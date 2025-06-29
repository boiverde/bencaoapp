import { ReactNode } from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { Lock, Crown } from 'lucide-react-native';
import Colors from '@/constants/Colors';
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
        <Lock size={32} color={Colors.primary.blue} />
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
          <Crown size={16} color={Colors.background.white} />
          <Text style={styles.upgradeButtonText}>Assinar Agora</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.background.white,
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  lockIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: Colors.primary.blue + '20',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  title: {
    fontFamily: 'Montserrat-SemiBold',
    fontSize: 18,
    color: Colors.text.dark,
    marginBottom: 8,
  },
  description: {
    fontFamily: 'OpenSans-Regular',
    fontSize: 16,
    color: Colors.text.medium,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 22,
  },
  upgradeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary.blue,
    borderRadius: 8,
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  upgradeButtonText: {
    fontFamily: 'Montserrat-SemiBold',
    fontSize: 16,
    color: Colors.background.white,
    marginLeft: 8,
  },
});