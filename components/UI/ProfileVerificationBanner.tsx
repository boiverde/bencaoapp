import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { Shield, ShieldCheck, Award, CircleAlert as AlertCircle } from 'lucide-react-native';
import Theme from '@/constants/Theme';
import { useSecurity } from '@/hooks/useSecurity';

interface ProfileVerificationBannerProps {
  onVerify?: () => void;
}

export default function ProfileVerificationBanner({ onVerify }: ProfileVerificationBannerProps) {
  const { getVerificationLevel, getVerificationBadge } = useSecurity();
  
  const verificationLevel = getVerificationLevel();
  const badge = getVerificationBadge();

  if (!badge) return null;

  const getVerificationIcon = () => {
    switch (verificationLevel) {
      case 'blessed':
      case 'premium':
        return <Award size={20} color={badge.color} />;
      case 'enhanced':
        return <ShieldCheck size={20} color={badge.color} />;
      case 'basic':
        return <Shield size={20} color={badge.color} />;
      case 'unverified':
        return <AlertCircle size={20} color={badge.color} />;
      default:
        return <Shield size={20} color={badge.color} />;
    }
  };

  const getVerificationMessage = () => {
    switch (verificationLevel) {
      case 'blessed':
        return 'Seu perfil tem o nível máximo de verificação. Você é um membro abençoado da comunidade!';
      case 'premium':
        return 'Seu perfil tem um alto nível de verificação. Você é um membro confiável!';
      case 'enhanced':
        return 'Seu perfil tem verificação aprimorada. Aumente sua confiança com mais verificações!';
      case 'basic':
        return 'Seu perfil tem verificação básica. Complete mais etapas para aumentar sua confiança!';
      case 'unverified':
        return 'Seu perfil não está verificado. Verifique-se para aumentar sua confiança e segurança!';
      default:
        return 'Verifique seu perfil para aumentar sua confiança e segurança!';
    }
  };

  const needsVerification = verificationLevel === 'unverified' || verificationLevel === 'basic';

  return (
    <View style={[
      styles.container,
      { backgroundColor: badge.color + '20', borderColor: badge.color + '40' }
    ]}>
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          {getVerificationIcon()}
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.title}>{badge.name}</Text>
          <Text style={styles.message}>{getVerificationMessage()}</Text>
        </View>
      </View>
      
      {needsVerification && onVerify && (
        <TouchableOpacity 
          style={[styles.verifyButton, { backgroundColor: badge.color }]}
          onPress={onVerify}
        >
          <Text style={styles.verifyButtonText}>Verificar Agora</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: Theme.borderRadius.md,
    borderWidth: 1,
    padding: Theme.spacing.md,
    marginHorizontal: Theme.spacing.md,
    marginVertical: Theme.spacing.sm,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    marginRight: Theme.spacing.md,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontFamily: Theme.typography.fontFamily.subheading,
    fontSize: Theme.typography.fontSize.md,
    color: Theme.colors.text.dark,
    marginBottom: Theme.spacing.xs,
  },
  message: {
    fontFamily: Theme.typography.fontFamily.body,
    fontSize: Theme.typography.fontSize.sm,
    color: Theme.colors.text.medium,
    lineHeight: 18,
  },
  verifyButton: {
    alignSelf: 'flex-end',
    paddingHorizontal: Theme.spacing.md,
    paddingVertical: Theme.spacing.sm,
    borderRadius: Theme.borderRadius.md,
    marginTop: Theme.spacing.sm,
  },
  verifyButtonText: {
    fontFamily: Theme.typography.fontFamily.subheading,
    fontSize: Theme.typography.fontSize.sm,
    color: Theme.colors.background.white,
  },
});