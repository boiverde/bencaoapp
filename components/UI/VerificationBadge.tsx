import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { Shield, ShieldCheck, ShieldAlert, Award, Star } from 'lucide-react-native';
import Theme from '@/constants/Theme';
import { SecurityProfile } from '@/utils/securitySystem';
import { useSecurity } from '@/hooks/useSecurity';

interface VerificationBadgeProps {
  level?: SecurityProfile['verificationLevel'];
  size?: 'small' | 'medium' | 'large';
  showLabel?: boolean;
  onPress?: () => void;
}

export default function VerificationBadge({
  level,
  size = 'medium',
  showLabel = false,
  onPress
}: VerificationBadgeProps) {
  const { getVerificationLevel, getVerificationBadge } = useSecurity();
  
  const verificationLevel = level || getVerificationLevel();
  const badge = getVerificationBadge();

  if (!badge) return null;

  const getBadgeIcon = () => {
    const iconSize = size === 'small' ? 12 : size === 'medium' ? 16 : 24;
    const iconColor = Theme.colors.background.white;
    
    switch (verificationLevel) {
      case 'blessed':
        return <Star size={iconSize} color={iconColor} />;
      case 'premium':
        return <Award size={iconSize} color={iconColor} />;
      case 'enhanced':
        return <ShieldCheck size={iconSize} color={iconColor} />;
      case 'basic':
        return <Shield size={iconSize} color={iconColor} />;
      case 'unverified':
        return <ShieldAlert size={iconSize} color={iconColor} />;
      default:
        return <Shield size={iconSize} color={iconColor} />;
    }
  };

  const getBadgeSize = () => {
    switch (size) {
      case 'small':
        return { width: 20, height: 20 };
      case 'medium':
        return { width: 28, height: 28 };
      case 'large':
        return { width: 40, height: 40 };
      default:
        return { width: 28, height: 28 };
    }
  };

  const badgeSize = getBadgeSize();

  const renderBadge = () => (
    <View style={[
      styles.badge,
      { backgroundColor: badge.color },
      badgeSize
    ]}>
      {getBadgeIcon()}
    </View>
  );

  if (showLabel) {
    return (
      <TouchableOpacity 
        style={styles.container}
        onPress={onPress}
        disabled={!onPress}
      >
        {renderBadge()}
        <Text style={styles.label}>{badge.name}</Text>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity 
      onPress={onPress}
      disabled={!onPress}
    >
      {renderBadge()}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  badge: {
    borderRadius: Theme.borderRadius.circle,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: Theme.colors.background.white,
  },
  label: {
    fontFamily: Theme.typography.fontFamily.subheading,
    fontSize: Theme.typography.fontSize.sm,
    color: Theme.colors.text.dark,
    marginLeft: Theme.spacing.xs,
  },
});