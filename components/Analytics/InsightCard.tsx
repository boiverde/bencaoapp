import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { 
  Heart, 
  Book, 
  MessageSquare, 
  Users, 
  Shield, 
  TrendingUp, 
  Lightbulb, 
  ChevronRight 
} from 'lucide-react-native';
import Theme from '@/constants/Theme';
import { UserInsight } from '@/utils/analyticsSystem';

interface InsightCardProps {
  insight: UserInsight;
  onPress?: () => void;
  onMarkAsRead?: () => void;
  compact?: boolean;
}

export default function InsightCard({ 
  insight, 
  onPress, 
  onMarkAsRead,
  compact = false 
}: InsightCardProps) {
  
  const getInsightIcon = () => {
    const iconProps = { size: compact ? 16 : 24, color: getInsightColor() };
    
    switch (insight.type) {
      case 'compatibility':
        return <Heart {...iconProps} />;
      case 'spiritual':
        return <Book {...iconProps} />;
      case 'activity':
        return <MessageSquare {...iconProps} />;
      case 'community':
        return <Users {...iconProps} />;
      case 'security':
        return <Shield {...iconProps} />;
      default:
        return <Lightbulb {...iconProps} />;
    }
  };

  const getInsightColor = () => {
    switch (insight.type) {
      case 'compatibility':
        return Theme.colors.primary.pink;
      case 'spiritual':
        return Theme.colors.primary.lilac;
      case 'activity':
        return Theme.colors.primary.blue;
      case 'community':
        return Theme.colors.status.success;
      case 'security':
        return Theme.colors.status.warning;
      default:
        return Theme.colors.primary.gold;
    }
  };

  const getPriorityColor = () => {
    switch (insight.priority) {
      case 'high':
        return Theme.colors.status.error;
      case 'medium':
        return Theme.colors.status.warning;
      case 'low':
        return Theme.colors.primary.blue;
      default:
        return Theme.colors.text.medium;
    }
  };

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString();
  };

  if (compact) {
    return (
      <TouchableOpacity 
        style={[
          styles.compactContainer,
          !insight.isRead && styles.unreadCompactContainer
        ]} 
        onPress={onPress}
      >
        <View style={[styles.compactIconContainer, { backgroundColor: getInsightColor() + '20' }]}>
          {getInsightIcon()}
        </View>
        <View style={styles.compactContent}>
          <Text style={styles.compactTitle} numberOfLines={1}>
            {insight.title}
          </Text>
          <Text style={styles.compactDescription} numberOfLines={2}>
            {insight.description}
          </Text>
        </View>
        <ChevronRight size={16} color={Theme.colors.text.medium} />
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity 
      style={styles.container} 
      onPress={onPress}
      activeOpacity={0.8}
    >
      <LinearGradient
        colors={[getInsightColor() + '20', getInsightColor() + '05']}
        style={styles.gradient}
      >
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <View style={[styles.iconContainer, { backgroundColor: getInsightColor() }]}>
              {getInsightIcon()}
            </View>
            <View style={styles.headerInfo}>
              <Text style={styles.title}>{insight.title}</Text>
              <View style={styles.metaInfo}>
                <View style={[styles.priorityBadge, { backgroundColor: getPriorityColor() }]}>
                  <Text style={styles.priorityText}>
                    {insight.priority === 'high' ? 'Alta' : 
                     insight.priority === 'medium' ? 'Média' : 'Baixa'}
                  </Text>
                </View>
                <Text style={styles.date}>{formatDate(insight.createdAt)}</Text>
              </View>
            </View>
          </View>
          
          {!insight.isRead && (
            <View style={styles.unreadIndicator} />
          )}
        </View>

        <Text style={styles.description}>{insight.description}</Text>

        {insight.recommendations && insight.recommendations.length > 0 && (
          <View style={styles.recommendationsContainer}>
            <Text style={styles.recommendationsTitle}>Recomendações:</Text>
            {insight.recommendations.map((recommendation, index) => (
              <View key={index} style={styles.recommendationItem}>
                <View style={[styles.recommendationDot, { backgroundColor: getInsightColor() }]} />
                <Text style={styles.recommendationText}>{recommendation}</Text>
              </View>
            ))}
          </View>
        )}

        {insight.verse && (
          <View style={styles.verseContainer}>
            <Text style={styles.verse}>"{insight.verse}"</Text>
          </View>
        )}

        <View style={styles.footer}>
          <View style={styles.footerLeft}>
            <TrendingUp size={16} color={getInsightColor()} />
            <Text style={[styles.insightType, { color: getInsightColor() }]}>
              {insight.type === 'compatibility' ? 'Compatibilidade' :
               insight.type === 'spiritual' ? 'Espiritual' :
               insight.type === 'activity' ? 'Atividade' :
               insight.type === 'community' ? 'Comunidade' : 'Segurança'}
            </Text>
          </View>
          
          {!insight.isRead && onMarkAsRead && (
            <TouchableOpacity 
              style={styles.markReadButton}
              onPress={(e) => {
                e.stopPropagation();
                onMarkAsRead();
              }}
            >
              <Text style={styles.markReadText}>Marcar como lido</Text>
            </TouchableOpacity>
          )}
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: Theme.borderRadius.lg,
    overflow: 'hidden',
    marginBottom: Theme.spacing.md,
    ...Theme.shadows.small,
  },
  compactContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Theme.colors.background.white,
    borderRadius: Theme.borderRadius.md,
    padding: Theme.spacing.sm,
    marginBottom: Theme.spacing.sm,
    ...Theme.shadows.small,
  },
  unreadCompactContainer: {
    borderLeftWidth: 3,
    borderLeftColor: Theme.colors.primary.blue,
  },
  compactIconContainer: {
    width: 36,
    height: 36,
    borderRadius: Theme.borderRadius.circle,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Theme.spacing.sm,
  },
  compactContent: {
    flex: 1,
    marginRight: Theme.spacing.sm,
  },
  compactTitle: {
    fontFamily: Theme.typography.fontFamily.subheading,
    fontSize: Theme.typography.fontSize.sm,
    color: Theme.colors.text.dark,
    marginBottom: Theme.spacing.xs,
  },
  compactDescription: {
    fontFamily: Theme.typography.fontFamily.body,
    fontSize: Theme.typography.fontSize.xs,
    color: Theme.colors.text.medium,
  },
  gradient: {
    padding: Theme.spacing.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Theme.spacing.md,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'flex-start',
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
  priorityBadge: {
    paddingHorizontal: Theme.spacing.sm,
    paddingVertical: 2,
    borderRadius: Theme.borderRadius.sm,
    marginRight: Theme.spacing.sm,
  },
  priorityText: {
    fontFamily: Theme.typography.fontFamily.body,
    fontSize: Theme.typography.fontSize.xs,
    color: Theme.colors.background.white,
  },
  date: {
    fontFamily: Theme.typography.fontFamily.body,
    fontSize: Theme.typography.fontSize.xs,
    color: Theme.colors.text.medium,
  },
  unreadIndicator: {
    width: 10,
    height: 10,
    borderRadius: Theme.borderRadius.circle,
    backgroundColor: Theme.colors.primary.blue,
    marginTop: Theme.spacing.xs,
  },
  description: {
    fontFamily: Theme.typography.fontFamily.body,
    fontSize: Theme.typography.fontSize.md,
    color: Theme.colors.text.dark,
    lineHeight: 22,
    marginBottom: Theme.spacing.md,
  },
  recommendationsContainer: {
    marginBottom: Theme.spacing.md,
  },
  recommendationsTitle: {
    fontFamily: Theme.typography.fontFamily.subheading,
    fontSize: Theme.typography.fontSize.sm,
    color: Theme.colors.text.dark,
    marginBottom: Theme.spacing.sm,
  },
  recommendationItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: Theme.spacing.xs,
  },
  recommendationDot: {
    width: 6,
    height: 6,
    borderRadius: Theme.borderRadius.circle,
    marginTop: 6,
    marginRight: Theme.spacing.sm,
  },
  recommendationText: {
    flex: 1,
    fontFamily: Theme.typography.fontFamily.body,
    fontSize: Theme.typography.fontSize.sm,
    color: Theme.colors.text.dark,
    lineHeight: 18,
  },
  verseContainer: {
    backgroundColor: Theme.colors.background.white + '50',
    borderRadius: Theme.borderRadius.md,
    padding: Theme.spacing.md,
    marginBottom: Theme.spacing.md,
  },
  verse: {
    fontFamily: Theme.typography.fontFamily.verse,
    fontSize: Theme.typography.fontSize.sm,
    color: Theme.colors.text.dark,
    lineHeight: 18,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  footerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  insightType: {
    fontFamily: Theme.typography.fontFamily.body,
    fontSize: Theme.typography.fontSize.xs,
    marginLeft: Theme.spacing.xs,
  },
  markReadButton: {
    paddingHorizontal: Theme.spacing.sm,
    paddingVertical: Theme.spacing.xs,
    borderRadius: Theme.borderRadius.sm,
    backgroundColor: Theme.colors.background.white + '50',
  },
  markReadText: {
    fontFamily: Theme.typography.fontFamily.body,
    fontSize: Theme.typography.fontSize.xs,
    color: Theme.colors.primary.blue,
  },
});