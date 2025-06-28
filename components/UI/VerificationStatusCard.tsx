import { StyleSheet, View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { CircleCheck as CheckCircle, Circle as XCircle, Clock, Mail, Phone, User, Church, Users, Shield, Award, ChevronRight } from 'lucide-react-native';
import Theme from '@/constants/Theme';
import { SecurityProfile } from '@/utils/securitySystem';

interface VerificationStatusCardProps {
  profile: SecurityProfile;
  onRequestVerification?: (type: string) => void;
}

export default function VerificationStatusCard({ 
  profile, 
  onRequestVerification 
}: VerificationStatusCardProps) {
  
  const verificationItems = [
    {
      key: 'email',
      title: 'Email',
      description: 'Confirme seu endereço de email',
      icon: Mail,
      verified: profile.verifications.email,
      required: true,
      points: 10
    },
    {
      key: 'phone',
      title: 'Telefone',
      description: 'Verifique seu número de telefone',
      icon: Phone,
      verified: profile.verifications.phone,
      required: true,
      points: 15
    },
    {
      key: 'identity',
      title: 'Identidade',
      description: 'Confirme sua identidade com documento oficial',
      icon: User,
      verified: profile.verifications.identity,
      required: false,
      points: 25
    },
    {
      key: 'church',
      title: 'Igreja',
      description: 'Verifique sua participação na igreja',
      icon: Church,
      verified: profile.verifications.church,
      required: false,
      points: 20
    },
    {
      key: 'pastor',
      title: 'Referência Pastoral',
      description: 'Obtenha referência do seu pastor',
      icon: Shield,
      verified: profile.verifications.pastor,
      required: false,
      points: 30
    },
    {
      key: 'community',
      title: 'Comunidade',
      description: 'Seja endossado pela comunidade cristã',
      icon: Users,
      verified: profile.verifications.community,
      required: false,
      points: 20
    }
  ];

  const completedVerifications = verificationItems.filter(item => item.verified).length;
  const totalVerifications = verificationItems.length;
  const completionPercentage = (completedVerifications / totalVerifications) * 100;

  const getVerificationIcon = (verified: boolean, required: boolean) => {
    if (verified) return CheckCircle;
    if (required) return XCircle;
    return Clock;
  };

  const getVerificationColor = (verified: boolean, required: boolean) => {
    if (verified) return Theme.colors.status.success;
    if (required) return Theme.colors.status.error;
    return Theme.colors.status.warning;
  };

  const handleRequestVerification = (type: string) => {
    if (onRequestVerification) {
      onRequestVerification(type);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Award size={24} color={Theme.colors.primary.gold} />
          <Text style={styles.title}>Status de Verificação</Text>
        </View>
        <View style={styles.progressContainer}>
          <Text style={styles.progressText}>
            {completedVerifications}/{totalVerifications}
          </Text>
        </View>
      </View>

      <View style={styles.progressBarContainer}>
        <View style={styles.progressBar}>
          <View 
            style={[
              styles.progressFill, 
              { width: `${completionPercentage}%` }
            ]} 
          />
        </View>
        <Text style={styles.progressPercentage}>
          {Math.round(completionPercentage)}%
        </Text>
      </View>

      <ScrollView style={styles.verificationsList} showsVerticalScrollIndicator={false}>
        {verificationItems.map((item) => {
          const IconComponent = getVerificationIcon(item.verified, item.required);
          const iconColor = getVerificationColor(item.verified, item.required);
          
          return (
            <TouchableOpacity
              key={item.key}
              style={[
                styles.verificationItem,
                item.verified && styles.verifiedItem
              ]}
              onPress={() => !item.verified && handleRequestVerification(item.key)}
              disabled={item.verified}
            >
              <View style={styles.verificationLeft}>
                <View style={[styles.verificationIcon, { backgroundColor: iconColor + '20' }]}>
                  <item.icon size={20} color={iconColor} />
                </View>
                <View style={styles.verificationInfo}>
                  <View style={styles.verificationHeader}>
                    <Text style={styles.verificationTitle}>{item.title}</Text>
                    {item.required && !item.verified && (
                      <Text style={styles.requiredBadge}>Obrigatório</Text>
                    )}
                  </View>
                  <Text style={styles.verificationDescription}>
                    {item.description}
                  </Text>
                  <View style={styles.pointsContainer}>
                    <Text style={styles.pointsText}>+{item.points} pontos</Text>
                  </View>
                </View>
              </View>
              
              <View style={styles.verificationRight}>
                <IconComponent size={24} color={iconColor} />
                {!item.verified && (
                  <ChevronRight size={16} color={Theme.colors.text.light} />
                )}
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      <View style={styles.benefitsSection}>
        <Text style={styles.benefitsTitle}>Benefícios da Verificação</Text>
        <View style={styles.benefitsList}>
          <View style={styles.benefitItem}>
            <CheckCircle size={16} color={Theme.colors.status.success} />
            <Text style={styles.benefitText}>Maior confiança da comunidade</Text>
          </View>
          <View style={styles.benefitItem}>
            <CheckCircle size={16} color={Theme.colors.status.success} />
            <Text style={styles.benefitText}>Acesso a recursos exclusivos</Text>
          </View>
          <View style={styles.benefitItem}>
            <CheckCircle size={16} color={Theme.colors.status.success} />
            <Text style={styles.benefitText}>Prioridade em conexões</Text>
          </View>
          <View style={styles.benefitItem}>
            <CheckCircle size={16} color={Theme.colors.status.success} />
            <Text style={styles.benefitText}>Proteção contra perfis falsos</Text>
          </View>
        </View>
      </View>

      <View style={styles.spiritualMessage}>
        <Text style={styles.spiritualText}>
          "Examinai tudo. Retende o bem." - 1 Tessalonicenses 5:21
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Theme.colors.background.white,
    borderRadius: Theme.borderRadius.lg,
    padding: Theme.spacing.md,
    ...Theme.shadows.small,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Theme.spacing.md,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontFamily: Theme.typography.fontFamily.subheading,
    fontSize: Theme.typography.fontSize.lg,
    color: Theme.colors.text.dark,
    marginLeft: Theme.spacing.sm,
  },
  progressContainer: {
    backgroundColor: Theme.colors.primary.gold + '20',
    paddingHorizontal: Theme.spacing.sm,
    paddingVertical: Theme.spacing.xs,
    borderRadius: Theme.borderRadius.md,
  },
  progressText: {
    fontFamily: Theme.typography.fontFamily.subheading,
    fontSize: Theme.typography.fontSize.sm,
    color: Theme.colors.primary.gold,
  },
  progressBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Theme.spacing.lg,
  },
  progressBar: {
    flex: 1,
    height: 8,
    backgroundColor: Theme.colors.ui.disabled,
    borderRadius: Theme.borderRadius.sm,
    marginRight: Theme.spacing.sm,
  },
  progressFill: {
    height: '100%',
    backgroundColor: Theme.colors.primary.gold,
    borderRadius: Theme.borderRadius.sm,
  },
  progressPercentage: {
    fontFamily: Theme.typography.fontFamily.subheading,
    fontSize: Theme.typography.fontSize.sm,
    color: Theme.colors.text.dark,
    minWidth: 40,
    textAlign: 'right',
  },
  verificationsList: {
    maxHeight: 400,
    marginBottom: Theme.spacing.lg,
  },
  verificationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Theme.spacing.md,
    paddingHorizontal: Theme.spacing.sm,
    borderRadius: Theme.borderRadius.md,
    marginBottom: Theme.spacing.sm,
    backgroundColor: Theme.colors.background.light,
  },
  verifiedItem: {
    backgroundColor: Theme.colors.status.success + '10',
    borderWidth: 1,
    borderColor: Theme.colors.status.success + '30',
  },
  verificationLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  verificationIcon: {
    width: 40,
    height: 40,
    borderRadius: Theme.borderRadius.circle,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Theme.spacing.md,
  },
  verificationInfo: {
    flex: 1,
  },
  verificationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Theme.spacing.xs,
  },
  verificationTitle: {
    fontFamily: Theme.typography.fontFamily.subheading,
    fontSize: Theme.typography.fontSize.md,
    color: Theme.colors.text.dark,
  },
  requiredBadge: {
    fontFamily: Theme.typography.fontFamily.body,
    fontSize: Theme.typography.fontSize.xs,
    color: Theme.colors.status.error,
    backgroundColor: Theme.colors.status.error + '20',
    paddingHorizontal: Theme.spacing.xs,
    paddingVertical: 2,
    borderRadius: Theme.borderRadius.sm,
    marginLeft: Theme.spacing.sm,
  },
  verificationDescription: {
    fontFamily: Theme.typography.fontFamily.body,
    fontSize: Theme.typography.fontSize.sm,
    color: Theme.colors.text.medium,
    marginBottom: Theme.spacing.xs,
  },
  pointsContainer: {
    alignSelf: 'flex-start',
  },
  pointsText: {
    fontFamily: Theme.typography.fontFamily.body,
    fontSize: Theme.typography.fontSize.xs,
    color: Theme.colors.primary.gold,
    backgroundColor: Theme.colors.primary.gold + '20',
    paddingHorizontal: Theme.spacing.xs,
    paddingVertical: 2,
    borderRadius: Theme.borderRadius.sm,
  },
  verificationRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  benefitsSection: {
    marginBottom: Theme.spacing.lg,
  },
  benefitsTitle: {
    fontFamily: Theme.typography.fontFamily.subheading,
    fontSize: Theme.typography.fontSize.md,
    color: Theme.colors.text.dark,
    marginBottom: Theme.spacing.md,
  },
  benefitsList: {
    backgroundColor: Theme.colors.background.light,
    borderRadius: Theme.borderRadius.md,
    padding: Theme.spacing.md,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Theme.spacing.sm,
  },
  benefitText: {
    fontFamily: Theme.typography.fontFamily.body,
    fontSize: Theme.typography.fontSize.sm,
    color: Theme.colors.text.dark,
    marginLeft: Theme.spacing.sm,
  },
  spiritualMessage: {
    backgroundColor: Theme.colors.background.lilac,
    borderRadius: Theme.borderRadius.md,
    padding: Theme.spacing.sm,
  },
  spiritualText: {
    fontFamily: Theme.typography.fontFamily.verse,
    fontSize: Theme.typography.fontSize.sm,
    color: Theme.colors.text.dark,
    textAlign: 'center',
    lineHeight: 18,
  },
});