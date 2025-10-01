import { useState } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  FlatList as RNFlatList, 
  TouchableOpacity, 
  RefreshControl 
} from 'react-native';
import { 
  Heart, 
  MessageSquare, 
  UserPlus, 
  HandHelping as PrayingHands, 
  Calendar, 
  Users, 
  MessageCircle, 
  AtSign, 
  CheckCheck 
} from 'lucide-react-native';
import Theme from '@/constants/Theme';
import { useSocial } from '@/hooks/useSocial';
import { SocialNotification } from '@/utils/socialSystem';

// Use FlatList from react-native-web for web platform
const FlatList = RNFlatList;

interface SocialNotificationsListProps {
  onNotificationPress?: (notification: SocialNotification) => void;
}

export default function SocialNotificationsList({
  onNotificationPress
}: SocialNotificationsListProps) {
  const [refreshing, setRefreshing] = useState(false);
  
  const { 
    socialNotifications, 
    markNotificationAsRead, 
    markAllNotificationsAsRead,
    getUnreadNotificationsCount
  } = useSocial();

  const onRefresh = async () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  const handleNotificationPress = (notification: SocialNotification) => {
    if (!notification.read) {
      markNotificationAsRead(notification.id);
    }
    
    if (onNotificationPress) {
      onNotificationPress(notification);
    }
  };

  const getNotificationIcon = (type: SocialNotification['type']) => {
    const iconProps = { size: 20, color: Theme.colors.background.white };
    
    switch (type) {
      case 'like':
        return <Heart {...iconProps} />;
      case 'comment':
        return <MessageSquare {...iconProps} />;
      case 'follow':
        return <UserPlus {...iconProps} />;
      case 'prayer':
        return <PrayingHands {...iconProps} />;
      case 'event':
        return <Calendar {...iconProps} />;
      case 'group':
        return <Users {...iconProps} />;
      case 'testimony':
        return <MessageCircle {...iconProps} />;
      case 'mention':
        return <AtSign {...iconProps} />;
      default:
        return <MessageSquare {...iconProps} />;
    }
  };

  const getNotificationColor = (type: SocialNotification['type']) => {
    switch (type) {
      case 'like':
        return Theme.colors.primary.pink;
      case 'comment':
        return Theme.colors.primary.blue;
      case 'follow':
        return Theme.colors.status.success;
      case 'prayer':
        return Theme.colors.primary.gold;
      case 'event':
        return Theme.colors.primary.lilac;
      case 'group':
        return Theme.colors.primary.blue;
      case 'testimony':
        return Theme.colors.status.success;
      case 'mention':
        return Theme.colors.primary.pink;
      default:
        return Theme.colors.text.medium;
    }
  };

  const formatTimestamp = (timestamp: number): string => {
    const now = Date.now();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 60) return `${minutes}m`;
    if (hours < 24) return `${hours}h`;
    if (days < 7) return `${days}d`;
    
    return new Date(timestamp).toLocaleDateString();
  };

  const renderNotificationItem = ({ item }: { item: SocialNotification }) => (
    <TouchableOpacity 
      style={[
        styles.notificationItem,
        !item.read && styles.unreadNotification
      ]}
      onPress={() => handleNotificationPress(item)}
    >
      <View style={[
        styles.iconContainer,
        { backgroundColor: getNotificationColor(item.type) }
      ]}>
        {getNotificationIcon(item.type)}
      </View>
      
      <View style={styles.notificationContent}>
        <Text style={[
          styles.notificationText,
          !item.read && styles.unreadNotificationText
        ]}>
          {item.content}
        </Text>
        <Text style={styles.timestamp}>{formatTimestamp(item.createdAt)}</Text>
      </View>
      
      {!item.read && (
        <View style={styles.unreadDot} />
      )}
    </TouchableOpacity>
  );

  const renderHeader = () => (
    <View style={styles.header}>
      <Text style={styles.headerTitle}>Notificações</Text>
      
      {getUnreadNotificationsCount() > 0 && (
        <TouchableOpacity 
          style={styles.markAllReadButton}
          onPress={markAllNotificationsAsRead}
        >
          <CheckCheck size={20} color={Theme.colors.primary.blue} />
          <Text style={styles.markAllReadText}>Marcar todas como lidas</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  const renderEmptyComponent = () => (
    <View style={styles.emptyContainer}>
      <MessageSquare size={48} color={Theme.colors.text.light} />
      <Text style={styles.emptyTitle}>Nenhuma notificação</Text>
      <Text style={styles.emptySubtitle}>
        Suas notificações aparecerão aqui
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {renderHeader()}
      
      <FlatList
        data={socialNotifications}
        keyExtractor={(item) => item.id}
        renderItem={renderNotificationItem}
        contentContainerStyle={styles.notificationsList}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[Theme.colors.primary.blue]}
            tintColor={Theme.colors.primary.blue}
          />
        }
        ListEmptyComponent={renderEmptyComponent}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.colors.background.light,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Theme.spacing.md,
    backgroundColor: Theme.colors.background.white,
    borderBottomWidth: 1,
    borderBottomColor: Theme.colors.ui.border,
  },
  headerTitle: {
    fontFamily: Theme.typography.fontFamily.subheading,
    fontSize: Theme.typography.fontSize.lg,
    color: Theme.colors.text.dark,
  },
  markAllReadButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  markAllReadText: {
    fontFamily: Theme.typography.fontFamily.body,
    fontSize: Theme.typography.fontSize.sm,
    color: Theme.colors.primary.blue,
    marginLeft: Theme.spacing.xs,
  },
  notificationsList: {
    padding: Theme.spacing.md,
  },
  notificationItem: {
    flexDirection: 'row',
    backgroundColor: Theme.colors.background.white,
    borderRadius: Theme.borderRadius.md,
    padding: Theme.spacing.md,
    marginBottom: Theme.spacing.md,
    ...Theme.shadows.small,
  },
  unreadNotification: {
    borderLeftWidth: 3,
    borderLeftColor: Theme.colors.primary.blue,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: Theme.borderRadius.circle,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Theme.spacing.md,
  },
  notificationContent: {
    flex: 1,
    marginRight: Theme.spacing.sm,
  },
  notificationText: {
    fontFamily: Theme.typography.fontFamily.body,
    fontSize: Theme.typography.fontSize.md,
    color: Theme.colors.text.dark,
    marginBottom: Theme.spacing.xs,
  },
  unreadNotificationText: {
    fontFamily: Theme.typography.fontFamily.subheading,
  },
  timestamp: {
    fontFamily: Theme.typography.fontFamily.body,
    fontSize: Theme.typography.fontSize.xs,
    color: Theme.colors.text.medium,
  },
  unreadDot: {
    width: 10,
    height: 10,
    borderRadius: Theme.borderRadius.circle,
    backgroundColor: Theme.colors.primary.blue,
    marginTop: Theme.spacing.xs,
    marginRight: Theme.spacing.sm,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Theme.spacing.xl,
    minHeight: 300,
  },
  emptyTitle: {
    fontFamily: Theme.typography.fontFamily.subheading,
    fontSize: Theme.typography.fontSize.lg,
    color: Theme.colors.text.dark,
    marginTop: Theme.spacing.md,
    marginBottom: Theme.spacing.sm,
  },
  emptySubtitle: {
    fontFamily: Theme.typography.fontFamily.body,
    fontSize: Theme.typography.fontSize.md,
    color: Theme.colors.text.medium,
    textAlign: 'center',
  },
});