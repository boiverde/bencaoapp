import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { 
  Heart, 
  MessageSquare, 
  Phone, 
  HandHelping as PrayingHands, 
  Clock, 
  TrendingUp, 
  TrendingDown,
  ChevronRight
} from 'lucide-react-native';
import Theme from '@/constants/Theme';
import { ConnectionAnalytics } from '@/utils/analyticsSystem';

interface ConnectionAnalyticsCardProps {
  connection: ConnectionAnalytics;
  userName: string;
  onPress?: () => void;
}

export default function ConnectionAnalyticsCard({
  connection,
  userName,
  onPress
}: ConnectionAnalyticsCardProps) {
  const getHealthColor = () => {
    if (connection.healthScore >= 80) return Theme.colors.status.success;
    if (connection.healthScore >= 60) return Theme.colors.status.warning;
    return Theme.colors.status.error;
  };

  const getStatusText = () => {
    switch (connection.status) {
      case 'active': return 'Ativa';
      case 'inactive': return 'Inativa';
      case 'blessed': return 'Abençoada';
      case 'ended': return 'Encerrada';
    }
  };

  const getStatusColor = () => {
    switch (connection.status) {
      case 'active': return Theme.colors.status.success;
      case 'inactive': return Theme.colors.status.warning;
      case 'blessed': return Theme.colors.primary.gold;
      case 'ended': return Theme.colors.status.error;
    }
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString();
  };

  const formatLastInteraction = (timestamp: number) => {
    const now = Date.now();
    const diff = now - timestamp;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days === 0) return 'Hoje';
    if (days === 1) return 'Ontem';
    if (days < 7) return `${days} dias atrás`;
    if (days < 30) return `${Math.floor(days / 7)} semanas atrás`;
    return `${Math.floor(days / 30)} meses atrás`;
  };

  const getHealthTrend = () => {
    // In a real app, this would compare current health to previous period
    return Math.random() > 0.5 ? 'up' : 'down';
  };

  const healthTrend = getHealthTrend();

  return (
    <TouchableOpacity 
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <LinearGradient
        colors={[getHealthColor() + '20', getHealthColor() + '05']}
        style={styles.gradient}
      >
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <View style={[styles.healthScoreContainer, { borderColor: getHealthColor() }]}>
              <Text style={[styles.healthScore, { color: getHealthColor() }]}>
                {connection.healthScore}
              </Text>
            </View>
            <View style={styles.headerInfo}>
              <Text style={styles.title}>Conexão com {userName}</Text>
              <View style={styles.statusContainer}>
                <View style={[styles.statusDot, { backgroundColor: getStatusColor() }]} />
                <Text style={styles.statusText}>{getStatusText()}</Text>
                <Text style={styles.startDate}>desde {formatDate(connection.startDate)}</Text>
              </View>
            </View>
          </View>
          
          <View style={styles.healthTrend}>
            {healthTrend === 'up' ? (
              <TrendingUp size={16} color={Theme.colors.status.success} />
            ) : (
              <TrendingDown size={16} color={Theme.colors.status.error} />
            )}
          </View>
        </View>

        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <MessageSquare size={16} color={Theme.colors.primary.blue} />
            <Text style={styles.statValue}>{connection.messageCount}</Text>
            <Text style={styles.statLabel}>Mensagens</Text>
          </View>
          
          <View style={styles.statItem}>
            <Phone size={16} color={Theme.colors.primary.lilac} />
            <Text style={styles.statValue}>{connection.callMinutes}min</Text>
            <Text style={styles.statLabel}>Chamadas</Text>
          </View>
          
          <View style={styles.statItem}>
            <PrayingHands size={16} color={Theme.colors.primary.gold} />
            <Text style={styles.statValue}>{connection.prayersTogether}</Text>
            <Text style={styles.statLabel}>Orações</Text>
          </View>
          
          <View style={styles.statItem}>
            <Heart size={16} color={Theme.colors.primary.pink} />
            <Text style={styles.statValue}>{connection.compatibilityScore}%</Text>
            <Text style={styles.statLabel}>Compatibilidade</Text>
          </View>
        </View>

        <View style={styles.lastInteraction}>
          <Clock size={14} color={Theme.colors.text.medium} />
          <Text style={styles.lastInteractionText}>
            Última interação: {formatLastInteraction(connection.lastInteraction)}
          </Text>
        </View>

        {connection.insights.length > 0 && (
          <View style={styles.insightsPreview}>
            <Text style={styles.insightsTitle}>
              {connection.insights.length} insights disponíveis
            </Text>
            <ChevronRight size={16} color={Theme.colors.text.medium} />
          </View>
        )}
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
    alignItems: 'center',
    flex: 1,
  },
  healthScoreContainer: {
    width: 48,
    height: 48,
    borderRadius: Theme.borderRadius.circle,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Theme.spacing.md,
  },
  healthScore: {
    fontFamily: Theme.typography.fontFamily.heading,
    fontSize: Theme.typography.fontSize.lg,
  },
  headerInfo: {
    flex: 1,
  },
  title: {
    fontFamily: Theme.typography.fontFamily.subheading,
    fontSize: Theme.typography.fontSize.md,
    color: Theme.colors.text.dark,
    marginBottom: Theme.spacing.xs,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: Theme.borderRadius.circle,
    marginRight: Theme.spacing.xs,
  },
  statusText: {
    fontFamily: Theme.typography.fontFamily.body,
    fontSize: Theme.typography.fontSize.sm,
    color: Theme.colors.text.medium,
    marginRight: Theme.spacing.sm,
  },
  startDate: {
    fontFamily: Theme.typography.fontFamily.body,
    fontSize: Theme.typography.fontSize.xs,
    color: Theme.colors.text.light,
  },
  healthTrend: {
    padding: Theme.spacing.xs,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: Theme.colors.background.white + '50',
    borderRadius: Theme.borderRadius.md,
    padding: Theme.spacing.md,
    marginBottom: Theme.spacing.md,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontFamily: Theme.typography.fontFamily.subheading,
    fontSize: Theme.typography.fontSize.md,
    color: Theme.colors.text.dark,
    marginVertical: Theme.spacing.xs,
  },
  statLabel: {
    fontFamily: Theme.typography.fontFamily.body,
    fontSize: Theme.typography.fontSize.xs,
    color: Theme.colors.text.medium,
  },
  lastInteraction: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Theme.spacing.md,
  },
  lastInteractionText: {
    fontFamily: Theme.typography.fontFamily.body,
    fontSize: Theme.typography.fontSize.sm,
    color: Theme.colors.text.medium,
    marginLeft: Theme.spacing.xs,
  },
  insightsPreview: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Theme.colors.background.white + '80',
    borderRadius: Theme.borderRadius.md,
    padding: Theme.spacing.sm,
  },
  insightsTitle: {
    fontFamily: Theme.typography.fontFamily.body,
    fontSize: Theme.typography.fontSize.sm,
    color: Theme.colors.text.dark,
  },
});