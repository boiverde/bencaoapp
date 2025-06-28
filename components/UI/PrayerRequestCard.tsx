import { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Alert } from 'react-native';
import { HandHelping as PrayingHands, User, Users, Heart, Briefcase, Chrome as Home, Globe, Clock, Check, MoveVertical as MoreVertical } from 'lucide-react-native';
import Theme from '@/constants/Theme';
import { PrayerRequest, SpiritualContentManager } from '@/utils/spiritualContent';

interface PrayerRequestCardProps {
  request: PrayerRequest;
  onPray: () => void;
  onMarkAnswered?: () => void;
  showActions?: boolean;
  compact?: boolean;
}

export default function PrayerRequestCard({
  request,
  onPray,
  onMarkAnswered,
  showActions = true,
  compact = false
}: PrayerRequestCardProps) {
  const [hasPrayed, setHasPrayed] = useState(
    request.prayedBy.includes('Eu')
  );

  const getCategoryIcon = (category: PrayerRequest['category']) => {
    const iconProps = { size: 16, color: Theme.colors.background.white };
    
    switch (category) {
      case 'personal':
        return <User {...iconProps} />;
      case 'family':
        return <Users {...iconProps} />;
      case 'health':
        return <Heart {...iconProps} />;
      case 'work':
        return <Briefcase {...iconProps} />;
      case 'relationship':
        return <Heart {...iconProps} />;
      case 'community':
        return <Home {...iconProps} />;
      case 'world':
        return <Globe {...iconProps} />;
      default:
        return <PrayingHands {...iconProps} />;
    }
  };

  const getCategoryName = (category: PrayerRequest['category']) => {
    const names = {
      personal: 'Pessoal',
      family: 'Família',
      health: 'Saúde',
      work: 'Trabalho',
      relationship: 'Relacionamento',
      community: 'Comunidade',
      world: 'Mundial'
    };
    return names[category] || 'Geral';
  };

  const formatTimeAgo = (timestamp: number) => {
    const now = Date.now();
    const diff = now - timestamp;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor(diff / (1000 * 60));

    if (days > 0) return `${days}d atrás`;
    if (hours > 0) return `${hours}h atrás`;
    if (minutes > 0) return `${minutes}min atrás`;
    return 'Agora';
  };

  const handlePray = () => {
    if (!hasPrayed) {
      setHasPrayed(true);
      onPray();
    }
  };

  const handleMarkAnswered = () => {
    if (onMarkAnswered) {
      Alert.alert(
        'Marcar como Respondida',
        'Esta oração foi respondida por Deus?',
        [
          { text: 'Cancelar', style: 'cancel' },
          { 
            text: 'Sim, foi respondida!', 
            onPress: onMarkAnswered,
            style: 'default'
          }
        ]
      );
    }
  };

  const categoryColor = SpiritualContentManager.getPrayerCategoryColor(request.category);
  const priorityColor = SpiritualContentManager.getPriorityColor(request.priority);

  if (compact) {
    return (
      <View style={styles.compactContainer}>
        <View style={styles.compactHeader}>
          <View style={[styles.compactCategoryIcon, { backgroundColor: categoryColor }]}>
            {getCategoryIcon(request.category)}
          </View>
          <View style={styles.compactInfo}>
            <Text style={styles.compactTitle} numberOfLines={1}>
              {request.title}
            </Text>
            <Text style={styles.compactMeta}>
              {getCategoryName(request.category)} • {formatTimeAgo(request.requestedAt)}
            </Text>
          </View>
          {request.answered && (
            <View style={styles.answeredBadge}>
              <Check size={12} color={Theme.colors.background.white} />
            </View>
          )}
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, request.answered && styles.answeredContainer]}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={[styles.categoryIcon, { backgroundColor: categoryColor }]}>
            {getCategoryIcon(request.category)}
          </View>
          <View style={styles.headerInfo}>
            <Text style={styles.title}>{request.title}</Text>
            <View style={styles.meta}>
              <Text style={styles.category}>{getCategoryName(request.category)}</Text>
              <View style={[styles.priorityDot, { backgroundColor: priorityColor }]} />
              <Text style={styles.requestedBy}>por {request.requestedBy}</Text>
            </View>
          </View>
        </View>
        
        {request.answered && (
          <View style={styles.answeredIcon}>
            <Check size={20} color={Theme.colors.status.success} />
          </View>
        )}
      </View>

      <Text style={styles.description} numberOfLines={3}>
        {request.description}
      </Text>

      {request.answered && request.testimony && (
        <View style={styles.testimonyContainer}>
          <Text style={styles.testimonyTitle}>Testemunho:</Text>
          <Text style={styles.testimony}>{request.testimony}</Text>
        </View>
      )}

      <View style={styles.footer}>
        <View style={styles.stats}>
          <View style={styles.statItem}>
            <PrayingHands size={14} color={Theme.colors.text.medium} />
            <Text style={styles.statText}>
              {request.prayedBy.length} {request.prayedBy.length === 1 ? 'pessoa orou' : 'pessoas oraram'}
            </Text>
          </View>
          <View style={styles.statItem}>
            <Clock size={14} color={Theme.colors.text.medium} />
            <Text style={styles.statText}>{formatTimeAgo(request.requestedAt)}</Text>
          </View>
        </View>

        {showActions && !request.answered && (
          <View style={styles.actions}>
            <TouchableOpacity 
              style={[
                styles.prayButton, 
                hasPrayed && styles.prayedButton
              ]} 
              onPress={handlePray}
              disabled={hasPrayed}
            >
              <PrayingHands 
                size={16} 
                color={hasPrayed ? Theme.colors.status.success : Theme.colors.background.white} 
              />
              <Text style={[
                styles.prayButtonText,
                hasPrayed && styles.prayedButtonText
              ]}>
                {hasPrayed ? 'Orei' : 'Orar'}
              </Text>
            </TouchableOpacity>

            {onMarkAnswered && request.requestedBy === 'Eu' && (
              <TouchableOpacity style={styles.answeredButton} onPress={handleMarkAnswered}>
                <Check size={16} color={Theme.colors.status.success} />
                <Text style={styles.answeredButtonText}>Respondida</Text>
              </TouchableOpacity>
            )}
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Theme.colors.background.white,
    borderRadius: Theme.borderRadius.lg,
    padding: Theme.spacing.md,
    marginHorizontal: Theme.spacing.md,
    marginVertical: Theme.spacing.sm,
    ...Theme.shadows.small,
  },
  answeredContainer: {
    backgroundColor: Theme.colors.status.success + '10',
    borderWidth: 1,
    borderColor: Theme.colors.status.success + '30',
  },
  compactContainer: {
    backgroundColor: Theme.colors.background.white,
    borderRadius: Theme.borderRadius.md,
    padding: Theme.spacing.sm,
    marginHorizontal: Theme.spacing.md,
    marginVertical: Theme.spacing.xs,
    ...Theme.shadows.small,
  },
  compactHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  compactCategoryIcon: {
    width: 32,
    height: 32,
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
  compactMeta: {
    fontFamily: Theme.typography.fontFamily.body,
    fontSize: Theme.typography.fontSize.xs,
    color: Theme.colors.text.medium,
  },
  answeredBadge: {
    width: 20,
    height: 20,
    borderRadius: Theme.borderRadius.circle,
    backgroundColor: Theme.colors.status.success,
    alignItems: 'center',
    justifyContent: 'center',
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
  categoryIcon: {
    width: 40,
    height: 40,
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
    fontSize: Theme.typography.fontSize.md,
    color: Theme.colors.text.dark,
    marginBottom: Theme.spacing.xs,
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  category: {
    fontFamily: Theme.typography.fontFamily.body,
    fontSize: Theme.typography.fontSize.xs,
    color: Theme.colors.text.medium,
  },
  priorityDot: {
    width: 6,
    height: 6,
    borderRadius: Theme.borderRadius.circle,
    marginHorizontal: Theme.spacing.xs,
  },
  requestedBy: {
    fontFamily: Theme.typography.fontFamily.body,
    fontSize: Theme.typography.fontSize.xs,
    color: Theme.colors.text.medium,
  },
  answeredIcon: {
    marginLeft: Theme.spacing.sm,
  },
  description: {
    fontFamily: Theme.typography.fontFamily.body,
    fontSize: Theme.typography.fontSize.sm,
    color: Theme.colors.text.dark,
    lineHeight: 20,
    marginBottom: Theme.spacing.md,
  },
  testimonyContainer: {
    backgroundColor: Theme.colors.status.success + '10',
    borderRadius: Theme.borderRadius.md,
    padding: Theme.spacing.sm,
    marginBottom: Theme.spacing.md,
    borderLeftWidth: 3,
    borderLeftColor: Theme.colors.status.success,
  },
  testimonyTitle: {
    fontFamily: Theme.typography.fontFamily.subheading,
    fontSize: Theme.typography.fontSize.sm,
    color: Theme.colors.status.success,
    marginBottom: Theme.spacing.xs,
  },
  testimony: {
    fontFamily: Theme.typography.fontFamily.body,
    fontSize: Theme.typography.fontSize.sm,
    color: Theme.colors.text.dark,
    lineHeight: 18,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  stats: {
    flex: 1,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Theme.spacing.xs,
  },
  statText: {
    fontFamily: Theme.typography.fontFamily.body,
    fontSize: Theme.typography.fontSize.xs,
    color: Theme.colors.text.medium,
    marginLeft: Theme.spacing.xs,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  prayButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Theme.colors.primary.blue,
    paddingVertical: Theme.spacing.sm,
    paddingHorizontal: Theme.spacing.md,
    borderRadius: Theme.borderRadius.md,
    marginLeft: Theme.spacing.sm,
  },
  prayedButton: {
    backgroundColor: Theme.colors.status.success + '20',
    borderWidth: 1,
    borderColor: Theme.colors.status.success,
  },
  prayButtonText: {
    fontFamily: Theme.typography.fontFamily.subheading,
    fontSize: Theme.typography.fontSize.sm,
    color: Theme.colors.background.white,
    marginLeft: Theme.spacing.xs,
  },
  prayedButtonText: {
    color: Theme.colors.status.success,
  },
  answeredButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Theme.colors.status.success + '20',
    paddingVertical: Theme.spacing.sm,
    paddingHorizontal: Theme.spacing.md,
    borderRadius: Theme.borderRadius.md,
    marginLeft: Theme.spacing.sm,
    borderWidth: 1,
    borderColor: Theme.colors.status.success,
  },
  answeredButtonText: {
    fontFamily: Theme.typography.fontFamily.subheading,
    fontSize: Theme.typography.fontSize.sm,
    color: Theme.colors.status.success,
    marginLeft: Theme.spacing.xs,
  },
});