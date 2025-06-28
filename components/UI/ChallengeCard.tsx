import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Target, Clock, Users, Trophy, CircleCheck as CheckCircle, Play, Calendar, Zap, Star, Gift } from 'lucide-react-native';
import Theme from '@/constants/Theme';
import { Challenge } from '@/utils/gamificationSystem';

interface ChallengeCardProps {
  challenge: Challenge;
  onStart?: () => void;
  onViewDetails?: () => void;
  compact?: boolean;
}

export default function ChallengeCard({ 
  challenge, 
  onStart, 
  onViewDetails, 
  compact = false 
}: ChallengeCardProps) {
  
  const getDifficultyColor = (difficulty: Challenge['difficulty']) => {
    const colors = {
      easy: Theme.colors.status.success,
      medium: Theme.colors.status.warning,
      hard: Theme.colors.status.error,
      legendary: Theme.colors.primary.gold
    };
    return colors[difficulty];
  };

  const getCategoryIcon = (category: Challenge['category']) => {
    const iconProps = { size: compact ? 16 : 20, color: Theme.colors.background.white };
    
    switch (category) {
      case 'daily':
        return <Calendar {...iconProps} />;
      case 'weekly':
        return <Target {...iconProps} />;
      case 'monthly':
        return <Star {...iconProps} />;
      case 'seasonal':
        return <Gift {...iconProps} />;
      case 'special':
        return <Zap {...iconProps} />;
      default:
        return <Target {...iconProps} />;
    }
  };

  const formatTimeRemaining = () => {
    const now = Date.now();
    const timeLeft = challenge.endDate - now;
    
    if (timeLeft <= 0) return 'Expirado';
    
    const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    if (days > 0) return `${days}d ${hours}h`;
    return `${hours}h`;
  };

  const completedTasks = challenge.tasks.filter(task => task.completed).length;
  const totalTasks = challenge.tasks.length;

  if (compact) {
    return (
      <TouchableOpacity style={styles.compactContainer} onPress={onViewDetails}>
        <View style={[
          styles.compactIcon, 
          { backgroundColor: getDifficultyColor(challenge.difficulty) }
        ]}>
          {getCategoryIcon(challenge.category)}
        </View>
        <View style={styles.compactInfo}>
          <Text style={styles.compactTitle} numberOfLines={1}>
            {challenge.title}
          </Text>
          <Text style={styles.compactProgress}>
            {completedTasks}/{totalTasks} tarefas • {formatTimeRemaining()}
          </Text>
        </View>
        <View style={styles.compactProgress}>
          <Text style={styles.compactPercentage}>{Math.round(challenge.progress)}%</Text>
        </View>
      </TouchableOpacity>
    );
  }

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[getDifficultyColor(challenge.difficulty) + '20', getDifficultyColor(challenge.difficulty) + '10']}
        style={styles.gradient}
      >
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <View style={[
              styles.iconContainer,
              { backgroundColor: getDifficultyColor(challenge.difficulty) }
            ]}>
              {getCategoryIcon(challenge.category)}
            </View>
            <View style={styles.headerInfo}>
              <Text style={styles.title}>{challenge.title}</Text>
              <View style={styles.metaInfo}>
                <Text style={[
                  styles.difficulty,
                  { color: getDifficultyColor(challenge.difficulty) }
                ]}>
                  {challenge.difficulty.charAt(0).toUpperCase() + challenge.difficulty.slice(1)}
                </Text>
                <Text style={styles.category}>
                  • {challenge.category.charAt(0).toUpperCase() + challenge.category.slice(1)}
                </Text>
              </View>
            </View>
          </View>
          
          <View style={styles.timeContainer}>
            <Clock size={14} color={Theme.colors.text.medium} />
            <Text style={styles.timeText}>{formatTimeRemaining()}</Text>
          </View>
        </View>

        <Text style={styles.description}>{challenge.description}</Text>

        <View style={styles.progressSection}>
          <View style={styles.progressHeader}>
            <Text style={styles.progressTitle}>
              Progresso ({completedTasks}/{totalTasks} tarefas)
            </Text>
            <Text style={styles.progressPercentage}>{Math.round(challenge.progress)}%</Text>
          </View>
          
          <View style={styles.progressBar}>
            <View 
              style={[
                styles.progressFill, 
                { 
                  width: `${challenge.progress}%`, 
                  backgroundColor: getDifficultyColor(challenge.difficulty) 
                }
              ]} 
            />
          </View>
        </View>

        <View style={styles.tasksPreview}>
          <Text style={styles.tasksTitle}>Tarefas:</Text>
          {challenge.tasks.slice(0, 2).map((task, index) => (
            <View key={task.id} style={styles.taskItem}>
              <CheckCircle 
                size={16} 
                color={task.completed ? Theme.colors.status.success : Theme.colors.text.light} 
              />
              <Text style={[
                styles.taskText,
                task.completed && styles.completedTask
              ]}>
                {task.title} ({task.progress}/{task.target})
              </Text>
            </View>
          ))}
          {challenge.tasks.length > 2 && (
            <Text style={styles.moreTasks}>
              +{challenge.tasks.length - 2} tarefas adicionais
            </Text>
          )}
        </View>

        <View style={styles.rewardsSection}>
          <Text style={styles.rewardsTitle}>Recompensas:</Text>
          <View style={styles.rewardsList}>
            {challenge.rewards.map((reward, index) => (
              <View key={index} style={styles.rewardItem}>
                <Trophy size={14} color={Theme.colors.primary.gold} />
                <Text style={styles.rewardText}>{reward.description}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.footer}>
          <View style={styles.participantsContainer}>
            <Users size={16} color={Theme.colors.text.medium} />
            <Text style={styles.participantsText}>
              {challenge.participants.toLocaleString()} participantes
            </Text>
          </View>
          
          {!challenge.completed && (
            <TouchableOpacity style={styles.startButton} onPress={onStart}>
              <Play size={16} color={Theme.colors.background.white} />
              <Text style={styles.startButtonText}>
                {challenge.progress > 0 ? 'Continuar' : 'Iniciar'}
              </Text>
            </TouchableOpacity>
          )}
          
          {challenge.completed && (
            <View style={styles.completedBadge}>
              <CheckCircle size={16} color={Theme.colors.status.success} />
              <Text style={styles.completedText}>Concluído</Text>
            </View>
          )}
        </View>

        <View style={styles.verseContainer}>
          <Text style={styles.verse}>"{challenge.verse}"</Text>
        </View>
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
  compactInfo: {
    flex: 1,
  },
  compactTitle: {
    fontFamily: Theme.typography.fontFamily.subheading,
    fontSize: Theme.typography.fontSize.sm,
    color: Theme.colors.text.dark,
  },
  compactProgress: {
    fontFamily: Theme.typography.fontFamily.body,
    fontSize: Theme.typography.fontSize.xs,
    color: Theme.colors.text.medium,
  },
  compactPercentage: {
    fontFamily: Theme.typography.fontFamily.subheading,
    fontSize: Theme.typography.fontSize.sm,
    color: Theme.colors.text.dark,
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
    marginBottom: Theme.spacing.xs,
  },
  metaInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  difficulty: {
    fontFamily: Theme.typography.fontFamily.subheading,
    fontSize: Theme.typography.fontSize.sm,
    textTransform: 'capitalize',
  },
  category: {
    fontFamily: Theme.typography.fontFamily.body,
    fontSize: Theme.typography.fontSize.sm,
    color: Theme.colors.text.medium,
    textTransform: 'capitalize',
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Theme.colors.background.white + '80',
    paddingHorizontal: Theme.spacing.sm,
    paddingVertical: Theme.spacing.xs,
    borderRadius: Theme.borderRadius.md,
  },
  timeText: {
    fontFamily: Theme.typography.fontFamily.subheading,
    fontSize: Theme.typography.fontSize.sm,
    color: Theme.colors.text.dark,
    marginLeft: Theme.spacing.xs,
  },
  description: {
    fontFamily: Theme.typography.fontFamily.body,
    fontSize: Theme.typography.fontSize.sm,
    color: Theme.colors.text.dark,
    lineHeight: 20,
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
  progressPercentage: {
    fontFamily: Theme.typography.fontFamily.subheading,
    fontSize: Theme.typography.fontSize.sm,
    color: Theme.colors.text.dark,
  },
  progressBar: {
    height: 8,
    backgroundColor: Theme.colors.background.white + '50',
    borderRadius: Theme.borderRadius.sm,
  },
  progressFill: {
    height: '100%',
    borderRadius: Theme.borderRadius.sm,
  },
  tasksPreview: {
    marginBottom: Theme.spacing.md,
  },
  tasksTitle: {
    fontFamily: Theme.typography.fontFamily.subheading,
    fontSize: Theme.typography.fontSize.sm,
    color: Theme.colors.text.dark,
    marginBottom: Theme.spacing.sm,
  },
  taskItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Theme.spacing.xs,
  },
  taskText: {
    fontFamily: Theme.typography.fontFamily.body,
    fontSize: Theme.typography.fontSize.sm,
    color: Theme.colors.text.dark,
    marginLeft: Theme.spacing.sm,
  },
  completedTask: {
    textDecorationLine: 'line-through',
    color: Theme.colors.text.medium,
  },
  moreTasks: {
    fontFamily: Theme.typography.fontFamily.body,
    fontSize: Theme.typography.fontSize.xs,
    color: Theme.colors.text.medium,
    marginTop: Theme.spacing.xs,
    marginLeft: Theme.spacing.lg,
  },
  rewardsSection: {
    marginBottom: Theme.spacing.md,
  },
  rewardsTitle: {
    fontFamily: Theme.typography.fontFamily.subheading,
    fontSize: Theme.typography.fontSize.sm,
    color: Theme.colors.text.dark,
    marginBottom: Theme.spacing.sm,
  },
  rewardsList: {
    backgroundColor: Theme.colors.background.white + '50',
    borderRadius: Theme.borderRadius.md,
    padding: Theme.spacing.sm,
  },
  rewardItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Theme.spacing.xs,
  },
  rewardText: {
    fontFamily: Theme.typography.fontFamily.body,
    fontSize: Theme.typography.fontSize.sm,
    color: Theme.colors.text.dark,
    marginLeft: Theme.spacing.sm,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Theme.spacing.md,
  },
  participantsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  participantsText: {
    fontFamily: Theme.typography.fontFamily.body,
    fontSize: Theme.typography.fontSize.sm,
    color: Theme.colors.text.medium,
    marginLeft: Theme.spacing.xs,
  },
  startButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Theme.colors.primary.blue,
    paddingHorizontal: Theme.spacing.md,
    paddingVertical: Theme.spacing.sm,
    borderRadius: Theme.borderRadius.md,
  },
  startButtonText: {
    fontFamily: Theme.typography.fontFamily.subheading,
    fontSize: Theme.typography.fontSize.sm,
    color: Theme.colors.background.white,
    marginLeft: Theme.spacing.xs,
  },
  completedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Theme.colors.status.success + '20',
    paddingHorizontal: Theme.spacing.md,
    paddingVertical: Theme.spacing.sm,
    borderRadius: Theme.borderRadius.md,
  },
  completedText: {
    fontFamily: Theme.typography.fontFamily.subheading,
    fontSize: Theme.typography.fontSize.sm,
    color: Theme.colors.status.success,
    marginLeft: Theme.spacing.xs,
  },
  verseContainer: {
    backgroundColor: Theme.colors.background.white + '50',
    borderRadius: Theme.borderRadius.md,
    padding: Theme.spacing.sm,
  },
  verse: {
    fontFamily: Theme.typography.fontFamily.verse,
    fontSize: Theme.typography.fontSize.sm,
    color: Theme.colors.text.dark,
    lineHeight: 18,
    textAlign: 'center',
  },
});