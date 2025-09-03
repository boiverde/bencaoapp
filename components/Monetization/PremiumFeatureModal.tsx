import { StyleSheet, View, Text, Modal, TouchableOpacity } from 'react-native';
import { X, Crown, Zap, Heart, Shield, Eye, Users } from 'lucide-react-native';
import Theme from '@/constants/Theme';
import { LinearGradient } from 'expo-linear-gradient';

interface PremiumFeatureModalProps {
  visible: boolean;
  onClose: () => void;
  onSubscribe: () => void;
  featureName: string;
  featureDescription: string;
  featureIcon?: string;
}

export default function PremiumFeatureModal({
  visible,
  onClose,
  onSubscribe,
  featureName,
  featureDescription,
  featureIcon = 'crown'
}: PremiumFeatureModalProps) {
  const getFeatureIcon = () => {
    const iconProps = { size: 32, color: Theme.colors.primary.gold };
    
    switch (featureIcon) {
      case 'zap':
        return <Zap {...iconProps} />;
      case 'heart':
        return <Heart {...iconProps} />;
      case 'shield':
        return <Shield {...iconProps} />;
      case 'eye':
        return <Eye {...iconProps} />;
      case 'users':
        return <Users {...iconProps} />;
      default:
        return <Crown {...iconProps} />;
    }
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <X size={24} color={Theme.colors.text.dark} />
          </TouchableOpacity>
          
          <LinearGradient
            colors={[Theme.colors.primary.blue + '30', Theme.colors.primary.pink + '30']}
            style={styles.gradient}
          >
            <View style={styles.iconContainer}>
              {getFeatureIcon()}
            </View>
            
            <Text style={styles.title}>{featureName}</Text>
            <Text style={styles.description}>{featureDescription}</Text>
            
            <View style={styles.featuresContainer}>
              <Text style={styles.featuresTitle}>Com o Plano Abençoado você também tem:</Text>
              
              <View style={styles.featureItem}>
                <Heart size={16} color={Theme.colors.primary.pink} />
                <Text style={styles.featureText}>Conexões ilimitadas</Text>
              </View>
              
              <View style={styles.featureItem}>
                <Eye size={16} color={Theme.colors.primary.blue} />
                <Text style={styles.featureText}>Veja quem curtiu seu perfil</Text>
              </View>
              
              <View style={styles.featureItem}>
                <Shield size={16} color={Theme.colors.primary.lilac} />
                <Text style={styles.featureText}>Verificação prioritária</Text>
              </View>
              
              <View style={styles.featureItem}>
                <Users size={16} color={Theme.colors.primary.gold} />
                <Text style={styles.featureText}>Círculos de oração exclusivos</Text>
              </View>
            </View>
            
            <TouchableOpacity 
              style={styles.subscribeButton}
              onPress={onSubscribe}
            >
              <Crown size={20} color={Theme.colors.background.white} />
              <Text style={styles.subscribeButtonText}>Assinar Plano Abençoado</Text>
            </TouchableOpacity>
            
            <Text style={styles.priceText}>
              A partir de R$ 29,90/mês
            </Text>
            
            <View style={styles.verseContainer}>
              <Text style={styles.verseText}>
                "Melhor é serem dois do que um, porque têm melhor paga do seu trabalho." - Eclesiastes 4:9
              </Text>
            </View>
          </LinearGradient>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '90%',
    maxWidth: 400,
    borderRadius: Theme.borderRadius.lg,
    overflow: 'hidden',
    ...Theme.shadows.large,
  },
  closeButton: {
    position: 'absolute',
    top: Theme.spacing.sm,
    right: Theme.spacing.sm,
    zIndex: 10,
    backgroundColor: Theme.colors.background.white + '80',
    borderRadius: Theme.borderRadius.circle,
    padding: Theme.spacing.xs,
  },
  gradient: {
    padding: Theme.spacing.lg,
    alignItems: 'center',
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: Theme.borderRadius.circle,
    backgroundColor: Theme.colors.background.white + '80',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Theme.spacing.md,
  },
  title: {
    fontFamily: Theme.typography.fontFamily.heading,
    fontSize: Theme.typography.fontSize.xl,
    color: Theme.colors.text.dark,
    marginBottom: Theme.spacing.sm,
    textAlign: 'center',
  },
  description: {
    fontFamily: Theme.typography.fontFamily.body,
    fontSize: Theme.typography.fontSize.md,
    color: Theme.colors.text.dark,
    textAlign: 'center',
    marginBottom: Theme.spacing.lg,
    lineHeight: 22,
  },
  featuresContainer: {
    width: '100%',
    backgroundColor: Theme.colors.background.white + '80',
    borderRadius: Theme.borderRadius.md,
    padding: Theme.spacing.md,
    marginBottom: Theme.spacing.lg,
  },
  featuresTitle: {
    fontFamily: Theme.typography.fontFamily.subheading,
    fontSize: Theme.typography.fontSize.md,
    color: Theme.colors.text.dark,
    marginBottom: Theme.spacing.md,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Theme.spacing.sm,
  },
  featureText: {
    fontFamily: Theme.typography.fontFamily.body,
    fontSize: Theme.typography.fontSize.sm,
    color: Theme.colors.text.dark,
    marginLeft: Theme.spacing.sm,
  },
  subscribeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Theme.colors.primary.blue,
    borderRadius: Theme.borderRadius.md,
    paddingHorizontal: Theme.spacing.lg,
    paddingVertical: Theme.spacing.md,
    marginBottom: Theme.spacing.sm,
  },
  subscribeButtonText: {
    fontFamily: Theme.typography.fontFamily.subheading,
    fontSize: Theme.typography.fontSize.md,
    color: Theme.colors.background.white,
    marginLeft: Theme.spacing.sm,
  },
  priceText: {
    fontFamily: Theme.typography.fontFamily.body,
    fontSize: Theme.typography.fontSize.sm,
    color: Theme.colors.text.medium,
    marginBottom: Theme.spacing.md,
  },
  verseContainer: {
    backgroundColor: Theme.colors.background.white + '50',
    borderRadius: Theme.borderRadius.md,
    padding: Theme.spacing.sm,
  },
  verseText: {
    fontFamily: Theme.typography.fontFamily.verse,
    fontSize: Theme.typography.fontSize.sm,
    color: Theme.colors.text.dark,
    textAlign: 'center',
    fontStyle: 'italic',
  },
});