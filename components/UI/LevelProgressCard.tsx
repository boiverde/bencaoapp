import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Crown, Star, TrendingUp, Gift } from 'lucide-react-native';
import Theme from '@/constants/Theme';
import { Level } from '@/utils/gamificationSystem';

interface LevelProgressCardProps {
  currentLevel: Level;
  nextLevel: Level | null;
  progress: number;
  totalPoints: number;
  onViewBlessings?: () => void;
}

export default function LevelProgressCard({
  currentLevel,
  nextLevel,
  progress,
  totalPoints,
  onViewBlessings
}: LevelProgressCardProps) {
  
  const pointsToNext = nextLevel ? nextLevel.minPoints - totalPoints : 0;

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[currentLevel.color + '20', currentLevel.color + '10']}
        style={styles.gradient}
      >
        <View style={styles.header}>
          <View style={styles.levelInfo}>
            <View style={[styles.levelIcon, { backgroundColor: currentLevel.color }]}>
              <Crown size={24} color={Theme.colors.background.white} />
            </View>
            <View style={styles.levelText}>
              <Text style={styles.levelNumber}>Nível {currentLevel.level}</Text>
              <Text style={styles.levelTitle}>{currentLevel.title}</Text>
            </View>
          </View>
          
          <View style={styles.pointsContainer}>
            <Star size={16} color={Theme.colors.primary.gold} />
            <Text style={styles.points}>{totalPoints.toLocaleString()}</Text>
          </View>
        </View>

        <Text style={styles.description}>{currentLevel.description}</Text>

        {nextLevel && (
          <View style={styles.progressSection}>
            <View style={styles.progressHeader}>
              <Text style={styles.progressTitle}>Progresso para {nextLevel.title}</Text>
              <Text style={styles.progressPoints}>
                {pointsToNext.toLocaleString()} pontos restantes
              </Text>
            </View>
            
            <View style={styles.progressBarContainer}>
              <View style={styles.progressBar}>
                <View 
                  style={[
                    styles.progressFill, 
                    { width: `${progress}%`, backgroundColor: currentLevel.color }
                  ]} 
                />
              </View>
              <Text style={styles.progressPercentage}>{Math.round(progress)}%</Text>
            </View>
          </View>
        )}

        {!nextLevel && (
          <View style={styles.maxLevelContainer}>
            <TrendingUp size={20} color={Theme.colors.primary.gold} />
            <Text style={styles.maxLevelText}>Nível Máximo Alcançado!</Text>
          </View>
        )}

        <View style={styles.verseContainer}>
          <Text style={styles.verse}>"{currentLevel.verse}"</Text>
        </View>

        {currentLevel.blessings.length > 0 && (
          <TouchableOpacity style={styles.blessingsButton} onPress={onViewBlessings}>
            <Gift size={16} color={currentLevel.color} />
            <Text style={[styles.blessingsText, { color: currentLevel.color }]}>
              Ver Bênçãos ({currentLevel.blessings.length})
            </Text>
          </TouchableOpacity>
        )}
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: Theme.spacing.md,
    marginVertical: Theme.spacing.sm,
    borderRadius: Theme.borderRadius.lg,
    overflow: 'hidden',
    ...Theme.shadows.medium,
  },
  gradient: {
    padding: Theme.spacing.lg,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Theme.spacing.md,
  },
  levelInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  levelIcon: {
    width: 56,
    height: 56,
    borderRadius: Theme.borderRadius.circle,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Theme.spacing.md,
    ...Theme.shadows.small,
  },
  levelText: {
    flex: 1,
  },
  levelNumber: {
    fontFamily: Theme.typography.fontFamily.heading,
    fontSize: Theme.typography.fontSize.xl,
    color: Theme.colors.text.dark,
  },
  levelTitle: {
    fontFamily: Theme.typography.fontFamily.subheading,
    fontSize: Theme.typography.fontSize.md,
    color: Theme.colors.text.medium,
  },
  pointsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Theme.colors.background.white + '80',
    paddingHorizontal: Theme.spacing.md,
    paddingVertical: Theme.spacing.sm,
    borderRadius: Theme.borderRadius.md,
  },
  points: {
    fontFamily: Theme.typography.fontFamily.heading,
    fontSize: Theme.typography.fontSize.lg,
    color: Theme.colors.primary.gold,
    marginLeft: Theme.spacing.xs,
  },
  description: {
    fontFamily: Theme.typography.fontFamily.body,
    fontSize: Theme.typography.fontSize.md,
    color: Theme.colors.text.dark,
    lineHeight: 22,
    marginBottom: Theme.spacing.md,
  },
  progressSection: {
    marginBottom: Theme.spacing.md,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Theme.spacing.sm,
  },
  progressTitle: {
    fontFamily: Theme.typography.fontFamily.subheading,
    fontSize: Theme.typography.fontSize.sm,
    color: Theme.colors.text.dark,
  },
  progressPoints: {
    fontFamily: Theme.typography.fontFamily.body,
    fontSize: Theme.typography.fontSize.xs,
    color: Theme.colors.text.medium,
  },
  progressBarContainer: {
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
  progressPercentage: {
    fontFamily: Theme.typography.fontFamily.subheading,
    fontSize: Theme.typography.fontSize.sm,
    color: Theme.colors.text.dark,
    minWidth: 40,
    textAlign: 'right',
  },
  maxLevelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Theme.colors.primary.gold + '20',
    paddingVertical: Theme.spacing.md,
    borderRadius: Theme.borderRadius.md,
    marginBottom: Theme.spacing.md,
  },
  maxLevelText: {
    fontFamily: Theme.typography.fontFamily.subheading,
    fontSize: Theme.typography.fontSize.md,
    color: Theme.colors.primary.gold,
    marginLeft: Theme.spacing.sm,
  },
  verseContainer: {
    backgroundColor: Theme.colors.background.white + '50',
    borderRadius: Theme.borderRadius.md,
    padding: Theme.spacing.md,
    marginBottom: Theme.spacing.md,
  },
  verse: {
    fontFamily: Theme.typography.fontFamily.verse,
    fontSize: Theme.typography.fontSize.md,
    color: Theme.colors.text.dark,
    lineHeight: 22,
    textAlign: 'center',
  },
  blessingsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Theme.colors.background.white + '80',
    paddingVertical: Theme.spacing.sm,
    borderRadius: Theme.borderRadius.md,
  },
  blessingsText: {
    fontFamily: Theme.typography.fontFamily.subheading,
    fontSize: Theme.typography.fontSize.sm,
    marginLeft: Theme.spacing.xs,
  },
});