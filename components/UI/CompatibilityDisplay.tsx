import { StyleSheet, View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Theme from '@/constants/Theme';
import { Heart, Users, Church, Star, Chrome as Home, Settings, ChevronRight, Info } from 'lucide-react-native';
import { CompatibilityScore, CompatibilityAlgorithm } from '@/utils/compatibilityAlgorithm';

interface CompatibilityDisplayProps {
  score: CompatibilityScore;
  onViewDetails?: () => void;
  compact?: boolean;
}

export default function CompatibilityDisplay({ 
  score, 
  onViewDetails, 
  compact = false 
}: CompatibilityDisplayProps) {
  const compatibilityLevel = CompatibilityAlgorithm.getCompatibilityLevel(score.overall);
  const compatibilityColor = CompatibilityAlgorithm.getCompatibilityColor(score.overall);

  const categoryIcons = {
    demographic: Home,
    religious: Church,
    personality: Star,
    values: Heart,
    lifestyle: Settings,
    preferences: Users,
  };

  const categoryNames = {
    demographic: 'Demografia',
    religious: 'Religioso',
    personality: 'Personalidade',
    values: 'Valores',
    lifestyle: 'Estilo de Vida',
    preferences: 'Preferências',
  };

  const renderProgressBar = (value: number, color: string = compatibilityColor) => (
    <View style={styles.progressBarContainer}>
      <View style={styles.progressBarBackground}>
        <View 
          style={[
            styles.progressBarFill, 
            { width: `${value}%`, backgroundColor: color }
          ]} 
        />
      </View>
      <Text style={[styles.progressBarText, { color }]}>
        {value}%
      </Text>
    </View>
  );

  if (compact) {
    return (
      <View style={styles.compactContainer}>
        <View style={styles.compactHeader}>
          <View style={styles.compactScoreContainer}>
            <Text style={[styles.compactScore, { color: compatibilityColor }]}>
              {score.overall}%
            </Text>
            <Text style={styles.compactLevel}>{compatibilityLevel}</Text>
          </View>
          <Heart size={20} color={compatibilityColor} fill={compatibilityColor} />
        </View>
        {renderProgressBar(score.overall)}
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[compatibilityColor + '20', compatibilityColor + '10']}
        style={styles.headerGradient}
      >
        <View style={styles.header}>
          <View style={styles.scoreContainer}>
            <Text style={[styles.overallScore, { color: compatibilityColor }]}>
              {score.overall}%
            </Text>
            <Text style={styles.compatibilityLevel}>{compatibilityLevel}</Text>
            <Text style={styles.compatibilitySubtitle}>Compatibilidade</Text>
          </View>
          <View style={styles.heartContainer}>
            <Heart size={40} color={compatibilityColor} fill={compatibilityColor} />
          </View>
        </View>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.breakdownSection}>
          <Text style={styles.sectionTitle}>Análise Detalhada</Text>
          
          {Object.entries(score.breakdown).map(([category, value]) => {
            const IconComponent = categoryIcons[category];
            const categoryColor = CompatibilityAlgorithm.getCompatibilityColor(value);
            
            return (
              <View key={category} style={styles.categoryRow}>
                <View style={styles.categoryHeader}>
                  <View style={styles.categoryIcon}>
                    <IconComponent size={18} color={categoryColor} />
                  </View>
                  <Text style={styles.categoryName}>
                    {categoryNames[category]}
                  </Text>
                </View>
                {renderProgressBar(value, categoryColor)}
              </View>
            );
          })}
        </View>

        {score.reasons.length > 0 && (
          <View style={styles.reasonsSection}>
            <Text style={styles.sectionTitle}>Pontos Positivos</Text>
            {score.reasons.map((reason, index) => (
              <View key={index} style={styles.reasonItem}>
                <View style={[styles.reasonDot, { backgroundColor: compatibilityColor }]} />
                <Text style={styles.reasonText}>{reason}</Text>
              </View>
            ))}
          </View>
        )}

        {score.concerns.length > 0 && (
          <View style={styles.concernsSection}>
            <Text style={styles.sectionTitle}>Pontos de Atenção</Text>
            {score.concerns.map((concern, index) => (
              <View key={index} style={styles.concernItem}>
                <View style={styles.concernDot} />
                <Text style={styles.concernText}>{concern}</Text>
              </View>
            ))}
          </View>
        )}

        <View style={styles.interpretationSection}>
          <View style={styles.interpretationHeader}>
            <Info size={20} color={Theme.colors.primary.blue} />
            <Text style={styles.interpretationTitle}>Como Interpretar</Text>
          </View>
          <Text style={styles.interpretationText}>
            A compatibilidade é calculada com base em múltiplos fatores incluindo valores religiosos, 
            personalidade, estilo de vida e preferências. Uma alta compatibilidade indica maior 
            potencial para uma conexão duradoura e abençoada.
          </Text>
        </View>

        {onViewDetails && (
          <TouchableOpacity style={styles.detailsButton} onPress={onViewDetails}>
            <Text style={styles.detailsButtonText}>Ver Análise Completa</Text>
            <ChevronRight size={20} color={Theme.colors.primary.blue} />
          </TouchableOpacity>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Theme.colors.background.white,
    borderRadius: Theme.borderRadius.lg,
    overflow: 'hidden',
    ...Theme.shadows.medium,
  },
  compactContainer: {
    backgroundColor: Theme.colors.background.white,
    borderRadius: Theme.borderRadius.md,
    padding: Theme.spacing.md,
    ...Theme.shadows.small,
  },
  compactHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Theme.spacing.sm,
  },
  compactScoreContainer: {
    alignItems: 'flex-start',
  },
  compactScore: {
    fontFamily: Theme.typography.fontFamily.heading,
    fontSize: Theme.typography.fontSize.xl,
  },
  compactLevel: {
    fontFamily: Theme.typography.fontFamily.body,
    fontSize: Theme.typography.fontSize.sm,
    color: Theme.colors.text.medium,
  },
  headerGradient: {
    paddingVertical: Theme.spacing.lg,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Theme.spacing.lg,
  },
  scoreContainer: {
    alignItems: 'flex-start',
  },
  overallScore: {
    fontFamily: Theme.typography.fontFamily.heading,
    fontSize: 48,
    lineHeight: 56,
  },
  compatibilityLevel: {
    fontFamily: Theme.typography.fontFamily.subheading,
    fontSize: Theme.typography.fontSize.lg,
    color: Theme.colors.text.dark,
    marginTop: -Theme.spacing.xs,
  },
  compatibilitySubtitle: {
    fontFamily: Theme.typography.fontFamily.body,
    fontSize: Theme.typography.fontSize.sm,
    color: Theme.colors.text.medium,
  },
  heartContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    maxHeight: 400,
  },
  breakdownSection: {
    padding: Theme.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: Theme.colors.ui.border,
  },
  sectionTitle: {
    fontFamily: Theme.typography.fontFamily.subheading,
    fontSize: Theme.typography.fontSize.lg,
    color: Theme.colors.text.dark,
    marginBottom: Theme.spacing.md,
  },
  categoryRow: {
    marginBottom: Theme.spacing.md,
  },
  categoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Theme.spacing.sm,
  },
  categoryIcon: {
    width: 32,
    height: 32,
    borderRadius: Theme.borderRadius.circle,
    backgroundColor: Theme.colors.background.light,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Theme.spacing.sm,
  },
  categoryName: {
    fontFamily: Theme.typography.fontFamily.subheading,
    fontSize: Theme.typography.fontSize.md,
    color: Theme.colors.text.dark,
  },
  progressBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  progressBarBackground: {
    flex: 1,
    height: 8,
    backgroundColor: Theme.colors.ui.disabled,
    borderRadius: Theme.borderRadius.sm,
    marginRight: Theme.spacing.sm,
  },
  progressBarFill: {
    height: '100%',
    borderRadius: Theme.borderRadius.sm,
  },
  progressBarText: {
    fontFamily: Theme.typography.fontFamily.subheading,
    fontSize: Theme.typography.fontSize.sm,
    minWidth: 35,
    textAlign: 'right',
  },
  reasonsSection: {
    padding: Theme.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: Theme.colors.ui.border,
  },
  reasonItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: Theme.spacing.sm,
  },
  reasonDot: {
    width: 6,
    height: 6,
    borderRadius: Theme.borderRadius.circle,
    marginTop: 6,
    marginRight: Theme.spacing.sm,
  },
  reasonText: {
    flex: 1,
    fontFamily: Theme.typography.fontFamily.body,
    fontSize: Theme.typography.fontSize.sm,
    color: Theme.colors.text.dark,
    lineHeight: 18,
  },
  concernsSection: {
    padding: Theme.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: Theme.colors.ui.border,
  },
  concernItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: Theme.spacing.sm,
  },
  concernDot: {
    width: 6,
    height: 6,
    borderRadius: Theme.borderRadius.circle,
    backgroundColor: Theme.colors.status.warning,
    marginTop: 6,
    marginRight: Theme.spacing.sm,
  },
  concernText: {
    flex: 1,
    fontFamily: Theme.typography.fontFamily.body,
    fontSize: Theme.typography.fontSize.sm,
    color: Theme.colors.text.dark,
    lineHeight: 18,
  },
  interpretationSection: {
    padding: Theme.spacing.lg,
    backgroundColor: Theme.colors.background.lilac,
  },
  interpretationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Theme.spacing.sm,
  },
  interpretationTitle: {
    fontFamily: Theme.typography.fontFamily.subheading,
    fontSize: Theme.typography.fontSize.md,
    color: Theme.colors.text.dark,
    marginLeft: Theme.spacing.sm,
  },
  interpretationText: {
    fontFamily: Theme.typography.fontFamily.body,
    fontSize: Theme.typography.fontSize.sm,
    color: Theme.colors.text.dark,
    lineHeight: 20,
  },
  detailsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: Theme.spacing.md,
    borderTopWidth: 1,
    borderTopColor: Theme.colors.ui.border,
  },
  detailsButtonText: {
    fontFamily: Theme.typography.fontFamily.subheading,
    fontSize: Theme.typography.fontSize.md,
    color: Theme.colors.primary.blue,
    marginRight: Theme.spacing.sm,
  },
});