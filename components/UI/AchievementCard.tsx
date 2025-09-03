import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Trophy, Star, Lock, CircleCheck as CheckCircle, Target, Calendar, Zap, Gift } from 'lucide-react-native';
import Theme from '@/constants/Theme';
import { Achievement } from '@/utils/gamificationSystem';

interface AchievementCardProps {
  achievement: Achievement;
  progress?: number;
  onPress?: () => void;
  compact?: boolean;
}

export default function AchievementCard({ 
  achievement, 
  progress = 0, 
  onPress, 
  compact = false 
}: AchievementCardProps) {
  
  const getTypeIcon = (type: Achievement['type']) => {
    const iconProps = { size: compact ? 16 : 20, color: Theme.colors.background.white };
    
    switch (type) {
      case 'milestone':
        return <Target {...iconProps} />;
      case 'streak':
        return <Calendar {...iconProps} />;
      case 'challenge':
        return <Zap {...iconProps} />;
      case 'special':
        return <Gift {...iconProps} />;
      default:
        return <Star {...iconProps} />;
    }
  };

  const getCategoryColor = (category: Achievement['category']) => {
    const colors = {
      prayer: Theme.colors.primary.blue,
      reading: Theme.colors.primary.lilac,
      community: Theme.colors.primary.pink,
      service: Theme.colors.primary.gold,
      growth: Theme.colors.status.success,
      connection: Theme.colors.status.error
    };
    return colors[category] || Theme.colors.text.medium;
  };

  const renderProgressBar = () => {
    if (achievement.unlocked || progress === 0) return null;
    
    return (
      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <View 
            style={[
              styles.progressFill, 
              { 
                width: `${progress}%`, 
                backgroundColor: getCategoryColor(achievement.category) 
              }
            ]} 
          />
        </View>
        <Text style={styles.progressText}>{Math.round(progress)}%</Text>
      </View>
    );
  };

  if (compact) {
    return (
      <TouchableOpacity style={styles.compactContainer} onPress={onPress}>
        <View style={[
          styles.compactIcon, 
          { backgroundColor: getCategoryColor(achievement.category) },
          !achievement.unlocked && styles.lockedIcon
        ]}>
          {achievement.unlocked ? (
            <CheckCircle size={20} color={Theme.colors.background.white} />
          ) : (
            <Lock size={20} color={Theme.colors.text.light} />
          )}
        </View>
        <View style={styles.compactInfo}>
          <Text style={[
            styles.compactTitle,
            !achievement.unlocked && styles.lockedText
          ]}>
            {achievement.title}
          </Text>
          <Text style={styles.compactPoints}>+{achievement.points} pts</Text>
        </View>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <LinearGradient
        colors={achievement.unlocked 
          ? [getCategoryColor(achievement.category) + '20', getCategoryColor(achievement.category) + '10']
          : [Theme.colors.ui.disabled + '20', Theme.colors.ui.disabled + '10']
        }
        style={styles.gradient}
      >
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <View style={[
              styles.iconContainer,
              { backgroundColor: achievement.unlocked ? getCategoryColor(achievement.category) : Theme.colors.ui.disabled }
            ]}>
              {achievement.unlocked ? (
                getTypeIcon(achievement.type)
              ) : (
                <Lock size={20} color={Theme.colors.text.light} />
              )}
            </View>
            <View style={styles.headerInfo}>
              <Text style={[
                styles.title,
                !achievement.unlocked && styles.lockedText
              ]}>
                {achievement.title}
              </Text>
              <Text style={styles.category}>
                {achievement.category.charAt(0).toUpperCase() + achievement.category.slice(1)}
              </Text>
            </View>
          </View>
          
          <View style={styles.pointsContainer}>
            <Trophy size={16} color={Theme.colors.primary.gold} />
            <Text style={styles.points}>+{achievement.points}</Text>
          </View>
        </View>

        <Text style={[
          styles.description,
          !achievement.unlocked && styles.lockedText
        ]}>
          {achievement.description}
        </Text>

        {renderProgressBar()}

        {achievement.verse && (
          <View style={styles.verseContainer}>
            <Text style={styles.verse}>"{achievement.verse}"</Text>
          </View>
        )}

        {achievement.unlocked && achievement.unlockedAt && (
          <View style={styles.unlockedContainer}>
            <CheckCircle size={16} color={Theme.colors.status.success} />
            <Text style={styles.unlockedText}>
              Desbloqueado em {new Date(achievement.unlockedAt).toLocaleDateString()}
            </Text>
          </View>
        )}

        {achievement.blessing && achievement.unlocked && (
          <View style={styles.blessingContainer}>
            <Text style={styles.blessingTitle}>Bênção:</Text>
            <Text style={styles.blessing}>{achievement.blessing}</Text>
          </View>
        )}
      </LinearGradient>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: Theme.spacing.md,
    marginVertical: Theme.spacing.sm,
    borderRadius: Theme.borderRadius.lg,
    overflow: 'hidden',
    ...Theme.shadows.small,
  },
  compactContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Theme.colors.background.white,
    borderRadius: Theme.borderRadius.md,
    padding: Theme.spacing.sm,
    marginHorizontal: Theme.spacing.xs,
    marginVertical: Theme.spacing.xs,
    ...Theme.shadows.small,
  },
  compactIcon: {
    width: 40,
    height: 40,
    borderRadius: Theme.borderRadius.circle,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Theme.spacing.sm,
  },
  lockedIcon: {
    backgroundColor: Theme.colors.ui.disabled,
  },
  compactInfo: {
    flex: 1,
  },
  compactTitle: {
    fontFamily: Theme.typography.fontFamily.subheading,
    fontSize: Theme.typography.fontSize.sm,
    color: Theme.colors.text.dark,
  },
  compactPoints: {
    fontFamily: Theme.typography.fontFamily.body,
    fontSize: Theme.typography.fontSize.xs,
    color: Theme.colors.primary.gold,
  },
  gradient: {
    padding: Theme.spacing.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Theme.spacing.sm,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: Theme.borderRadius.circle,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Theme.spacing.md,
  },
  headerInfo: {
    flex: 1,
  },
  title: {
    fontFamily: Theme.typography.fontFamily.subheading,
    fontSize: Theme.typography.fontSize.lg,
    color: Theme.colors.text.dark,
  },
  category: {
    fontFamily: Theme.typography.fontFamily.body,
    fontSize: Theme.typography.fontSize.sm,
    color: Theme.colors.text.medium,
    textTransform: 'capitalize',
  },
  pointsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Theme.colors.background.white + '80',
    paddingHorizontal: Theme.spacing.sm,
    paddingVertical: Theme.spacing.xs,
    borderRadius: Theme.borderRadius.md,
  },
  points: {
    fontFamily: Theme.typography.fontFamily.subheading,
    fontSize: Theme.typography.fontSize.sm,
    color: Theme.colors.primary.gold,
    marginLeft: Theme.spacing.xs,
  },
  description: {
    fontFamily: Theme.typography.fontFamily.body,
    fontSize: Theme.typography.fontSize.sm,
    color: Theme.colors.text.dark,
    lineHeight: 20,
    marginBottom: Theme.spacing.sm,
  },
  lockedText: {
    color: Theme.colors.text.light,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Theme.spacing.sm,
  },
  progressBar: {
    flex: 1,
    height: 6,
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
    fontSize: Theme.typography.fontSize.xs,
    color: Theme.colors.text.dark,
    minWidth: 35,
    textAlign: 'right',
  },
  verseContainer: {
    backgroundColor: Theme.colors.background.white + '50',
    borderRadius: Theme.borderRadius.md,
    padding: Theme.spacing.sm,
    marginBottom: Theme.spacing.sm,
  },
  verse: {
    fontFamily: Theme.typography.fontFamily.verse,
    fontSize: Theme.typography.fontSize.sm,
    color: Theme.colors.text.dark,
    lineHeight: 18,
    textAlign: 'center',
  },
  unlockedContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Theme.spacing.sm,
  },
  unlockedText: {
    fontFamily: Theme.typography.fontFamily.body,
    fontSize: Theme.typography.fontSize.xs,
    color: Theme.colors.status.success,
    marginLeft: Theme.spacing.xs,
  },
  blessingContainer: {
    backgroundColor: Theme.colors.primary.gold + '20',
    borderRadius: Theme.borderRadius.md,
    padding: Theme.spacing.sm,
    borderLeftWidth: 3,
    borderLeftColor: Theme.colors.primary.gold,
  },
  blessingTitle: {
    fontFamily: Theme.typography.fontFamily.subheading,
    fontSize: Theme.typography.fontSize.sm,
    color: Theme.colors.primary.gold,
    marginBottom: Theme.spacing.xs,
  },
  blessing: {
    fontFamily: Theme.typography.fontFamily.verse,
    fontSize: Theme.typography.fontSize.sm,
    color: Theme.colors.text.dark,
    lineHeight: 18,
  },
});