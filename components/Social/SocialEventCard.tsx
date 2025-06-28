import { StyleSheet, View, Text, TouchableOpacity, Image } from 'react-native';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Users, 
  ChevronRight, 
  Heart, 
  Check, 
  Star, 
  Church, 
  Music, 
  Book, 
  HandHelping as PrayingHands, 
  Users as UsersIcon 
} from 'lucide-react-native';
import Theme from '@/constants/Theme';
import { SocialEvent } from '@/utils/socialSystem';

interface SocialEventCardProps {
  event: SocialEvent;
  onPress?: () => void;
  onAttend?: () => void;
  onInterested?: () => void;
  isAttending?: boolean;
  isInterested?: boolean;
  compact?: boolean;
}

export default function SocialEventCard({
  event,
  onPress,
  onAttend,
  onInterested,
  isAttending = false,
  isInterested = false,
  compact = false
}: SocialEventCardProps) {
  const getEventTypeIcon = () => {
    const iconProps = { size: compact ? 16 : 20, color: getEventTypeColor() };
    
    switch (event.type) {
      case 'worship':
        return <Music {...iconProps} />;
      case 'conference':
        return <Church {...iconProps} />;
      case 'study':
        return <Book {...iconProps} />;
      case 'outreach':
        return <Heart {...iconProps} />;
      case 'fellowship':
        return <UsersIcon {...iconProps} />;
      case 'prayer':
        return <PrayingHands {...iconProps} />;
      default:
        return <Calendar {...iconProps} />;
    }
  };

  const getEventTypeColor = () => {
    switch (event.type) {
      case 'worship':
        return Theme.colors.primary.pink;
      case 'conference':
        return Theme.colors.primary.blue;
      case 'study':
        return Theme.colors.primary.lilac;
      case 'outreach':
        return Theme.colors.status.success;
      case 'fellowship':
        return Theme.colors.primary.gold;
      case 'prayer':
        return Theme.colors.primary.blue;
      default:
        return Theme.colors.text.medium;
    }
  };

  const getEventTypeName = () => {
    switch (event.type) {
      case 'worship':
        return 'Louvor';
      case 'conference':
        return 'Conferência';
      case 'study':
        return 'Estudo';
      case 'outreach':
        return 'Evangelismo';
      case 'fellowship':
        return 'Comunhão';
      case 'prayer':
        return 'Oração';
      default:
        return 'Evento';
    }
  };

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString();
  };

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
  };

  const getDaysUntil = () => {
    const now = Date.now();
    const diff = event.startDate - now;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days < 0) return 'Evento passado';
    if (days === 0) return 'Hoje';
    if (days === 1) return 'Amanhã';
    return `Em ${days} dias`;
  };

  if (compact) {
    return (
      <TouchableOpacity 
        style={styles.compactContainer}
        onPress={onPress}
        activeOpacity={0.8}
      >
        <View style={[
          styles.compactIconContainer,
          { backgroundColor: getEventTypeColor() + '20' }
        ]}>
          {getEventTypeIcon()}
        </View>
        
        <View style={styles.compactContent}>
          <Text style={styles.compactTitle} numberOfLines={1}>{event.title}</Text>
          <View style={styles.compactMeta}>
            <Text style={styles.compactDate}>{formatDate(event.startDate)}</Text>
            <View style={styles.compactAttendees}>
              <Users size={12} color={Theme.colors.text.medium} />
              <Text style={styles.compactAttendeesText}>{event.attendeeIds.length}</Text>
            </View>
          </View>
        </View>
        
        <View style={styles.compactStatus}>
          <Text style={[
            styles.compactStatusText,
            { color: getEventTypeColor() }
          ]}>
            {getDaysUntil()}
          </Text>
        </View>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity 
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={styles.header}>
        <View style={[
          styles.typeContainer,
          { backgroundColor: getEventTypeColor() + '20' }
        ]}>
          {getEventTypeIcon()}
          <Text style={[styles.typeName, { color: getEventTypeColor() }]}>
            {getEventTypeName()}
          </Text>
        </View>
        
        <View style={styles.dateContainer}>
          <Calendar size={16} color={Theme.colors.text.medium} />
          <Text style={styles.dateText}>{formatDate(event.startDate)}</Text>
        </View>
      </View>
      
      {event.coverImage && (
        <Image 
          source={{ uri: event.coverImage }}
          style={styles.coverImage}
          resizeMode="cover"
        />
      )}
      
      <View style={styles.content}>
        <Text style={styles.title}>{event.title}</Text>
        <Text style={styles.description} numberOfLines={2}>{event.description}</Text>
        
        <View style={styles.details}>
          <View style={styles.detailItem}>
            <Clock size={16} color={Theme.colors.text.medium} />
            <Text style={styles.detailText}>{formatTime(event.startDate)}</Text>
          </View>
          
          <View style={styles.detailItem}>
            <MapPin size={16} color={Theme.colors.text.medium} />
            <Text style={styles.detailText}>{event.location.name}</Text>
          </View>
          
          <View style={styles.detailItem}>
            <Users size={16} color={Theme.colors.text.medium} />
            <Text style={styles.detailText}>
              {event.attendeeIds.length} participantes • {event.interestedIds.length} interessados
            </Text>
          </View>
        </View>
        
        {event.tags.length > 0 && (
          <View style={styles.tagsContainer}>
            {event.tags.slice(0, 3).map((tag, index) => (
              <View key={index} style={styles.tag}>
                <Text style={styles.tagText}>#{tag}</Text>
              </View>
            ))}
            {event.tags.length > 3 && (
              <Text style={styles.moreTagsText}>+{event.tags.length - 3}</Text>
            )}
          </View>
        )}
      </View>
      
      <View style={styles.footer}>
        <View style={styles.statusContainer}>
          <Text style={[
            styles.statusText,
            { color: getEventTypeColor() }
          ]}>
            {getDaysUntil()}
          </Text>
        </View>
        
        <View style={styles.actions}>
          {isAttending ? (
            <View style={styles.attendingBadge}>
              <Check size={16} color={Theme.colors.status.success} />
              <Text style={styles.attendingText}>Participando</Text>
            </View>
          ) : isInterested ? (
            <View style={styles.interestedBadge}>
              <Star size={16} color={Theme.colors.primary.gold} />
              <Text style={styles.interestedText}>Interessado</Text>
            </View>
          ) : (
            <View style={styles.actionButtons}>
              <TouchableOpacity 
                style={styles.interestedButton}
                onPress={onInterested}
              >
                <Star size={16} color={Theme.colors.primary.gold} />
                <Text style={styles.interestedButtonText}>Interessado</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.attendButton}
                onPress={onAttend}
              >
                <Check size={16} color={Theme.colors.background.white} />
                <Text style={styles.attendButtonText}>Participar</Text>
              </TouchableOpacity>
            </View>
          )}
          
          <TouchableOpacity 
            style={styles.viewButton}
            onPress={onPress}
          >
            <Text style={styles.viewButtonText}>Detalhes</Text>
            <ChevronRight size={16} color={Theme.colors.primary.blue} />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Theme.colors.background.white,
    borderRadius: Theme.borderRadius.lg,
    marginBottom: Theme.spacing.md,
    overflow: 'hidden',
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
  compactIconContainer: {
    width: 40,
    height: 40,
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
  compactMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  compactDate: {
    fontFamily: Theme.typography.fontFamily.body,
    fontSize: Theme.typography.fontSize.xs,
    color: Theme.colors.text.medium,
  },
  compactAttendees: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  compactAttendeesText: {
    fontFamily: Theme.typography.fontFamily.body,
    fontSize: Theme.typography.fontSize.xs,
    color: Theme.colors.text.medium,
    marginLeft: Theme.spacing.xs,
  },
  compactStatus: {
    marginLeft: Theme.spacing.sm,
  },
  compactStatusText: {
    fontFamily: Theme.typography.fontFamily.subheading,
    fontSize: Theme.typography.fontSize.xs,
  },
  compactTypeBadge: {
    paddingHorizontal: Theme.spacing.sm,
    paddingVertical: 2,
    borderRadius: Theme.borderRadius.sm,
    backgroundColor: Theme.colors.background.light,
  },
  compactTypeText: {
    fontFamily: Theme.typography.fontFamily.body,
    fontSize: 10,
    color: Theme.colors.text.medium,
  },
  prayerBadge: {
    backgroundColor: Theme.colors.primary.gold + '30',
  },
  verseBadge: {
    backgroundColor: Theme.colors.primary.lilac + '30',
  },
  testimonyBadge: {
    backgroundColor: Theme.colors.primary.pink + '30',
  },
  eventBadge: {
    backgroundColor: Theme.colors.primary.blue + '30',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Theme.spacing.md,
  },
  typeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: Theme.borderRadius.md,
    paddingHorizontal: Theme.spacing.sm,
    paddingVertical: Theme.spacing.xs,
  },
  typeName: {
    fontFamily: Theme.typography.fontFamily.subheading,
    fontSize: Theme.typography.fontSize.sm,
    marginLeft: Theme.spacing.xs,
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateText: {
    fontFamily: Theme.typography.fontFamily.body,
    fontSize: Theme.typography.fontSize.sm,
    color: Theme.colors.text.medium,
    marginLeft: Theme.spacing.xs,
  },
  coverImage: {
    width: '100%',
    height: 150,
  },
  content: {
    padding: Theme.spacing.md,
  },
  title: {
    fontFamily: Theme.typography.fontFamily.subheading,
    fontSize: Theme.typography.fontSize.lg,
    color: Theme.colors.text.dark,
    marginBottom: Theme.spacing.xs,
  },
  description: {
    fontFamily: Theme.typography.fontFamily.body,
    fontSize: Theme.typography.fontSize.sm,
    color: Theme.colors.text.medium,
    marginBottom: Theme.spacing.md,
    lineHeight: 20,
  },
  details: {
    marginBottom: Theme.spacing.md,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Theme.spacing.xs,
  },
  detailText: {
    fontFamily: Theme.typography.fontFamily.body,
    fontSize: Theme.typography.fontSize.sm,
    color: Theme.colors.text.medium,
    marginLeft: Theme.spacing.sm,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
  },
  tag: {
    backgroundColor: Theme.colors.background.light,
    borderRadius: Theme.borderRadius.sm,
    paddingHorizontal: Theme.spacing.sm,
    paddingVertical: Theme.spacing.xs,
    marginRight: Theme.spacing.xs,
  },
  tagText: {
    fontFamily: Theme.typography.fontFamily.body,
    fontSize: Theme.typography.fontSize.xs,
    color: Theme.colors.text.medium,
  },
  moreTagsText: {
    fontFamily: Theme.typography.fontFamily.body,
    fontSize: Theme.typography.fontSize.xs,
    color: Theme.colors.text.medium,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Theme.spacing.md,
    borderTopWidth: 1,
    borderTopColor: Theme.colors.ui.border,
  },
  statusContainer: {
    flex: 1,
  },
  statusText: {
    fontFamily: Theme.typography.fontFamily.subheading,
    fontSize: Theme.typography.fontSize.sm,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  attendingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Theme.colors.status.success + '20',
    borderRadius: Theme.borderRadius.md,
    paddingHorizontal: Theme.spacing.md,
    paddingVertical: Theme.spacing.sm,
    marginRight: Theme.spacing.sm,
  },
  attendingText: {
    fontFamily: Theme.typography.fontFamily.subheading,
    fontSize: Theme.typography.fontSize.sm,
    color: Theme.colors.status.success,
    marginLeft: Theme.spacing.xs,
  },
  interestedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Theme.colors.primary.gold + '20',
    borderRadius: Theme.borderRadius.md,
    paddingHorizontal: Theme.spacing.md,
    paddingVertical: Theme.spacing.sm,
    marginRight: Theme.spacing.sm,
  },
  interestedText: {
    fontFamily: Theme.typography.fontFamily.subheading,
    fontSize: Theme.typography.fontSize.sm,
    color: Theme.colors.primary.gold,
    marginLeft: Theme.spacing.xs,
  },
  actionButtons: {
    flexDirection: 'row',
    marginRight: Theme.spacing.sm,
  },
  interestedButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Theme.colors.primary.gold + '20',
    borderRadius: Theme.borderRadius.md,
    paddingHorizontal: Theme.spacing.sm,
    paddingVertical: Theme.spacing.xs,
    marginRight: Theme.spacing.xs,
  },
  interestedButtonText: {
    fontFamily: Theme.typography.fontFamily.body,
    fontSize: Theme.typography.fontSize.xs,
    color: Theme.colors.primary.gold,
    marginLeft: Theme.spacing.xs,
  },
  attendButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Theme.colors.primary.blue,
    borderRadius: Theme.borderRadius.md,
    paddingHorizontal: Theme.spacing.sm,
    paddingVertical: Theme.spacing.xs,
  },
  attendButtonText: {
    fontFamily: Theme.typography.fontFamily.body,
    fontSize: Theme.typography.fontSize.xs,
    color: Theme.colors.background.white,
    marginLeft: Theme.spacing.xs,
  },
  viewButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Theme.colors.background.light,
    borderRadius: Theme.borderRadius.md,
    paddingHorizontal: Theme.spacing.md,
    paddingVertical: Theme.spacing.sm,
  },
  viewButtonText: {
    fontFamily: Theme.typography.fontFamily.body,
    fontSize: Theme.typography.fontSize.sm,
    color: Theme.colors.primary.blue,
    marginRight: Theme.spacing.xs,
  },
});