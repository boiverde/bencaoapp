import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Shield, TrendingUp, Award, TriangleAlert as AlertTriangle } from 'lucide-react-native';
import Theme from '@/constants/Theme';
import { SecurityProfile } from '@/utils/securitySystem';

interface SecurityScoreCardProps {
  trustScore: number;
  safetyRating: SecurityProfile['safetyRating'];
  verificationLevel: SecurityProfile['verificationLevel'];
  onImprove?: () => void;
}

export default function SecurityScoreCard({
  trustScore,
  safetyRating,
  verificationLevel,
  onImprove
}: SecurityScoreCardProps) {
  
  const getScoreColor = () => {
    if (trustScore >= 80) return Theme.colors.status.success;
    if (trustScore >= 60) return Theme.colors.status.warning;
    return Theme.colors.status.error;
  };

  const getScoreIcon = () => {
    if (trustScore >= 80) return Shield;
    if (trustScore >= 60) return Award;
    return AlertTriangle;
  };

  const getScoreDescription = () => {
    if (trustScore >= 80) return 'Excelente! Seu perfil é altamente confiável';
    if (trustScore >= 60) return 'Bom! Algumas melhorias podem aumentar sua segurança';
    return 'Atenção! Seu perfil precisa de melhorias de segurança';
  };

  const getVerificationLevelName = () => {
    const levels = {
      unverified: 'Não Verificado',
      basic: 'Verificação Básica',
      enhanced: 'Verificação Aprimorada',
      premium: 'Membro Confiável',
      blessed: 'Membro Abençoado'
    };
    return levels[verificationLevel];
  };

  const getVerificationLevelColor = () => {
    const colors = {
      unverified: Theme.colors.status.error,
      basic: Theme.colors.status.warning,
      enhanced: Theme.colors.primary.blue,
      premium: Theme.colors.primary.lilac,
      blessed: Theme.colors.primary.gold
    };
    return colors[verificationLevel];
  };

  const getSafetyRatingName = () => {
    const ratings = {
      low: 'Baixa',
      medium: 'Média',
      high: 'Alta',
      excellent: 'Excelente'
    };
    return ratings[safetyRating];
  };

  const ScoreIcon = getScoreIcon();
  const scoreColor = getScoreColor();

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[scoreColor + '20', scoreColor + '10']}
        style={styles.gradient}
      >
        <View style={styles.header}>
          <View style={styles.scoreContainer}>
            <View style={[styles.scoreIcon, { backgroundColor: scoreColor }]}>
              <ScoreIcon size={32} color={Theme.colors.background.white} />
            </View>
            <View style={styles.scoreInfo}>
              <Text style={[styles.scoreValue, { color: scoreColor }]}>
                {trustScore}
              </Text>
              <Text style={styles.scoreLabel}>Score de Confiança</Text>
            </View>
          </View>
          
          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <View 
                style={[
                  styles.progressFill, 
                  { width: `${trustScore}%`, backgroundColor: scoreColor }
                ]} 
              />
            </View>
            <Text style={styles.progressText}>{trustScore}%</Text>
          </View>
        </View>

        <Text style={styles.description}>{getScoreDescription()}</Text>

        <View style={styles.metricsContainer}>
          <View style={styles.metric}>
            <Text style={styles.metricLabel}>Nível de Verificação</Text>
            <View style={styles.metricValue}>
              <View style={[
                styles.verificationBadge, 
                { backgroundColor: getVerificationLevelColor() }
              ]}>
                <Text style={styles.verificationText}>
                  {getVerificationLevelName()}
                </Text>
              </View>
            </View>
          </View>
          
          <View style={styles.metric}>
            <Text style={styles.metricLabel}>Classificação de Segurança</Text>
            <Text style={[styles.metricValueText, { color: scoreColor }]}>
              {getSafetyRatingName()}
            </Text>
          </View>
        </View>

        {trustScore < 80 && onImprove && (
          <TouchableOpacity style={styles.improveButton} onPress={onImprove}>
            <TrendingUp size={16} color={Theme.colors.primary.blue} />
            <Text style={styles.improveButtonText}>Melhorar Segurança</Text>
          </TouchableOpacity>
        )}

        <View style={styles.spiritualMessage}>
          <Text style={styles.spiritualText}>
            "Sede prudentes como as serpentes e simples como as pombas" - Mateus 10:16
          </Text>
        </View>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: Theme.spacing.lg,
    borderRadius: Theme.borderRadius.lg,
    overflow: 'hidden',
    ...Theme.shadows.medium,
  },
  gradient: {
    padding: Theme.spacing.lg,
  },
  header: {
    marginBottom: Theme.spacing.md,
  },
  scoreContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Theme.spacing.md,
  },
  scoreIcon: {
    width: 64,
    height: 64,
    borderRadius: Theme.borderRadius.circle,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Theme.spacing.md,
  },
  scoreInfo: {
    flex: 1,
  },
  scoreValue: {
    fontFamily: Theme.typography.fontFamily.heading,
    fontSize: 48,
    lineHeight: 56,
  },
  scoreLabel: {
    fontFamily: Theme.typography.fontFamily.body,
    fontSize: Theme.typography.fontSize.md,
    color: Theme.colors.text.medium,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  progressBar: {
    flex: 1,
    height: 8,
    backgroundColor: Theme.colors.background.white + '50',
    borderRadius: Theme.borderRadius.sm,
    marginRight: Theme.spacing.sm,
  },
  progressFill: {
    height: '100%',
    borderRadius: Theme.borderRadius.sm,
  },
  progressText: {
    fontFamily: Theme.typography.fontFamily.subheading,
    fontSize: Theme.typography.fontSize.sm,
    color: Theme.colors.text.dark,
    minWidth: 40,
    textAlign: 'right',
  },
  description: {
    fontFamily: Theme.typography.fontFamily.body,
    fontSize: Theme.typography.fontSize.md,
    color: Theme.colors.text.dark,
    lineHeight: 22,
    marginBottom: Theme.spacing.lg,
  },
  metricsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Theme.spacing.lg,
  },
  metric: {
    flex: 1,
    marginHorizontal: Theme.spacing.xs,
  },
  metricLabel: {
    fontFamily: Theme.typography.fontFamily.body,
    fontSize: Theme.typography.fontSize.sm,
    color: Theme.colors.text.medium,
    marginBottom: Theme.spacing.xs,
  },
  metricValue: {
    alignItems: 'flex-start',
  },
  verificationBadge: {
    paddingHorizontal: Theme.spacing.sm,
    paddingVertical: Theme.spacing.xs,
    borderRadius: Theme.borderRadius.md,
  },
  verificationText: {
    fontFamily: Theme.typography.fontFamily.subheading,
    fontSize: Theme.typography.fontSize.sm,
    color: Theme.colors.background.white,
  },
  metricValueText: {
    fontFamily: Theme.typography.fontFamily.subheading,
    fontSize: Theme.typography.fontSize.md,
  },
  improveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Theme.colors.background.white + '80',
    paddingVertical: Theme.spacing.sm,
    borderRadius: Theme.borderRadius.md,
    marginBottom: Theme.spacing.md,
  },
  improveButtonText: {
    fontFamily: Theme.typography.fontFamily.subheading,
    fontSize: Theme.typography.fontSize.sm,
    color: Theme.colors.primary.blue,
    marginLeft: Theme.spacing.xs,
  },
  spiritualMessage: {
    backgroundColor: Theme.colors.background.white + '50',
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