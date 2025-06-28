import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { 
  HandHelping as PrayingHands, 
  Clock, 
  Play, 
  Pause, 
  Square,
  Heart,
  Users,
  MessageCircle,
  Star,
  Brain
} from 'lucide-react-native';
import Theme from '@/constants/Theme';
import { PrayerMoment } from '@/utils/spiritualContent';

interface PrayerMomentCardProps {
  moment: PrayerMoment;
  onStart: () => void;
  onPause?: () => void;
  onResume?: () => void;
  onStop?: () => void;
  isActive?: boolean;
  isPaused?: boolean;
  timeRemaining?: number;
  progress?: number;
}

export default function PrayerMomentCard({
  moment,
  onStart,
  onPause,
  onResume,
  onStop,
  isActive = false,
  isPaused = false,
  timeRemaining = 0,
  progress = 0
}: PrayerMomentCardProps) {
  
  const getTypeIcon = (type: PrayerMoment['type']) => {
    const iconProps = { size: 20, color: Theme.colors.background.white };
    
    switch (type) {
      case 'gratitude':
        return <Heart {...iconProps} />;
      case 'intercession':
        return <Users {...iconProps} />;
      case 'confession':
        return <MessageCircle {...iconProps} />;
      case 'petition':
        return <Star {...iconProps} />;
      case 'meditation':
        return <Brain {...iconProps} />;
      default:
        return <PrayingHands {...iconProps} />;
    }
  };

  const getTypeColor = (type: PrayerMoment['type']) => {
    switch (type) {
      case 'gratitude':
        return Theme.colors.primary.gold;
      case 'intercession':
        return Theme.colors.primary.blue;
      case 'confession':
        return Theme.colors.primary.lilac;
      case 'petition':
        return Theme.colors.primary.pink;
      case 'meditation':
        return Theme.colors.status.success;
      default:
        return Theme.colors.primary.blue;
    }
  };

  const getTypeName = (type: PrayerMoment['type']) => {
    const names = {
      gratitude: 'Gratidão',
      intercession: 'Intercessão',
      confession: 'Confissão',
      petition: 'Petição',
      meditation: 'Meditação'
    };
    return names[type] || 'Oração';
  };

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const typeColor = getTypeColor(moment.type);

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[typeColor + '20', typeColor + '10']}
        style={styles.gradient}
      >
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <View style={[styles.iconContainer, { backgroundColor: typeColor }]}>
              {getTypeIcon(moment.type)}
            </View>
            <View style={styles.headerText}>
              <Text style={styles.title}>{moment.title}</Text>
              <Text style={styles.type}>{getTypeName(moment.type)}</Text>
            </View>
          </View>
          <View style={styles.duration}>
            <Clock size={16} color={Theme.colors.text.medium} />
            <Text style={styles.durationText}>
              {isActive ? formatTime(timeRemaining) : `${moment.duration}min`}
            </Text>
          </View>
        </View>

        {isActive && (
          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <View 
                style={[
                  styles.progressFill, 
                  { width: `${progress}%`, backgroundColor: typeColor }
                ]} 
              />
            </View>
            <Text style={styles.progressText}>{Math.round(progress)}%</Text>
          </View>
        )}

        <View style={styles.guideContainer}>
          <Text style={styles.guideTitle}>Guia de Oração:</Text>
          {moment.guide.slice(0, 3).map((step, index) => (
            <View key={index} style={styles.guideStep}>
              <View style={[styles.stepDot, { backgroundColor: typeColor }]} />
              <Text style={styles.stepText}>{step}</Text>
            </View>
          ))}
          {moment.guide.length > 3 && (
            <Text style={styles.moreSteps}>
              +{moment.guide.length - 3} passos adicionais
            </Text>
          )}
        </View>

        {moment.verses && moment.verses.length > 0 && (
          <View style={styles.verseContainer}>
            <Text style={styles.verseTitle}>Versículo de apoio:</Text>
            <Text style={styles.verse}>"{moment.verses[0]}"</Text>
          </View>
        )}

        <View style={styles.actions}>
          {!isActive ? (
            <TouchableOpacity style={[styles.actionButton, styles.startButton]} onPress={onStart}>
              <Play size={20} color="#fff" />
              <Text style={styles.actionButtonText}>Iniciar Oração</Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.activeActions}>
              {isPaused ? (
                <TouchableOpacity 
                  style={[styles.actionButton, styles.resumeButton]} 
                  onPress={onResume}
                >
                  <Play size={20} color="#fff" />
                  <Text style={styles.actionButtonText}>Continuar</Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity 
                  style={[styles.actionButton, styles.pauseButton]} 
                  onPress={onPause}
                >
                  <Pause size={20} color="#fff" />
                  <Text style={styles.actionButtonText}>Pausar</Text>
                </TouchableOpacity>
              )}
              
              <TouchableOpacity 
                style={[styles.actionButton, styles.stopButton]} 
                onPress={onStop}
              >
                <Square size={20} color="#fff" />
                <Text style={styles.actionButtonText}>Parar</Text>
              </TouchableOpacity>
            </View>
          )}
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
  gradient: {
    padding: Theme.spacing.lg,
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
    flex: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: Theme.borderRadius.circle,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Theme.spacing.md,
  },
  headerText: {
    flex: 1,
  },
  title: {
    fontFamily: Theme.typography.fontFamily.subheading,
    fontSize: Theme.typography.fontSize.lg,
    color: Theme.colors.text.dark,
  },
  type: {
    fontFamily: Theme.typography.fontFamily.body,
    fontSize: Theme.typography.fontSize.sm,
    color: Theme.colors.text.medium,
  },
  duration: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Theme.colors.background.white + '80',
    paddingHorizontal: Theme.spacing.sm,
    paddingVertical: Theme.spacing.xs,
    borderRadius: Theme.borderRadius.md,
  },
  durationText: {
    fontFamily: Theme.typography.fontFamily.subheading,
    fontSize: Theme.typography.fontSize.sm,
    color: Theme.colors.text.dark,
    marginLeft: Theme.spacing.xs,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Theme.spacing.md,
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
    minWidth: 35,
    textAlign: 'right',
  },
  guideContainer: {
    marginBottom: Theme.spacing.md,
  },
  guideTitle: {
    fontFamily: Theme.typography.fontFamily.subheading,
    fontSize: Theme.typography.fontSize.sm,
    color: Theme.colors.text.dark,
    marginBottom: Theme.spacing.sm,
  },
  guideStep: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: Theme.spacing.xs,
  },
  stepDot: {
    width: 6,
    height: 6,
    borderRadius: Theme.borderRadius.circle,
    marginTop: 6,
    marginRight: Theme.spacing.sm,
  },
  stepText: {
    flex: 1,
    fontFamily: Theme.typography.fontFamily.body,
    fontSize: Theme.typography.fontSize.sm,
    color: Theme.colors.text.dark,
    lineHeight: 18,
  },
  moreSteps: {
    fontFamily: Theme.typography.fontFamily.body,
    fontSize: Theme.typography.fontSize.xs,
    color: Theme.colors.text.medium,
    marginTop: Theme.spacing.xs,
    marginLeft: Theme.spacing.lg,
  },
  verseContainer: {
    backgroundColor: Theme.colors.background.white + '50',
    borderRadius: Theme.borderRadius.md,
    padding: Theme.spacing.md,
    marginBottom: Theme.spacing.md,
  },
  verseTitle: {
    fontFamily: Theme.typography.fontFamily.subheading,
    fontSize: Theme.typography.fontSize.sm,
    color: Theme.colors.text.dark,
    marginBottom: Theme.spacing.xs,
  },
  verse: {
    fontFamily: Theme.typography.fontFamily.verse,
    fontSize: Theme.typography.fontSize.sm,
    color: Theme.colors.text.dark,
    lineHeight: 20,
  },
  actions: {
    alignItems: 'center',
  },
  activeActions: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Theme.spacing.md,
    paddingHorizontal: Theme.spacing.lg,
    borderRadius: Theme.borderRadius.md,
    marginHorizontal: Theme.spacing.xs,
  },
  startButton: {
    backgroundColor: Theme.colors.primary.blue,
    minWidth: 150,
  },
  resumeButton: {
    backgroundColor: Theme.colors.status.success,
  },
  pauseButton: {
    backgroundColor: Theme.colors.status.warning,
  },
  stopButton: {
    backgroundColor: Theme.colors.status.error,
  },
  actionButtonText: {
    fontFamily: Theme.typography.fontFamily.subheading,
    fontSize: Theme.typography.fontSize.sm,
    color: Theme.colors.background.white,
    marginLeft: Theme.spacing.xs,
  },
});