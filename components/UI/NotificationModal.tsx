import { useState } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  Modal, 
  TouchableOpacity, 
  ScrollView, 
  Image,
  Alert
} from 'react-native';
import { 
  X, 
  Heart, 
  MessageSquare, 
  Calendar, 
  HandHelping as PrayingHands, 
  Star,
  UserPlus,
  Trash2,
  CheckCheck
} from 'lucide-react-native';
import Theme from '@/constants/Theme';
import { useNotifications, NotificationData } from '@/hooks/useNotifications';

interface NotificationModalProps {
  visible: boolean;
  onClose: () => void;
}

export default function NotificationModal({ visible, onClose }: NotificationModalProps) {
  const { 
    notifications, 
    unreadCount, 
    markAsRead, 
    markAllAsRead, 
    deleteNotification, 
    clearAllNotifications 
  } = useNotifications();

  const getNotificationIcon = (type: NotificationData['type']) => {
    const iconProps = { size: 20, color: Theme.colors.background.white };
    
    switch (type) {
      case 'match':
        return <Heart {...iconProps} fill={Theme.colors.background.white} />;
      case 'message':
        return <MessageSquare {...iconProps} />;
      case 'event':
        return <Calendar {...iconProps} />;
      case 'prayer':
        return <PrayingHands {...iconProps} />;
      case 'like':
        return <Heart {...iconProps} />;
      case 'follow':
        return <UserPlus {...iconProps} />;
      default:
        return <Star {...iconProps} />;
    }
  };

  const getNotificationColor = (type: NotificationData['type']) => {
    switch (type) {
      case 'match':
        return Theme.colors.primary.pink;
      case 'message':
        return Theme.colors.primary.blue;
      case 'event':
        return Theme.colors.primary.lilac;
      case 'prayer':
        return Theme.colors.primary.gold;
      case 'like':
        return Theme.colors.status.error;
      case 'follow':
        return Theme.colors.status.success;
      default:
        return Theme.colors.text.medium;
    }
  };

  const formatTime = (timestamp: number) => {
    const now = Date.now();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Agora';
    if (minutes < 60) return `${minutes}m`;
    if (hours < 24) return `${hours}h`;
    return `${days}d`;
  };

  const handleNotificationPress = (notification: NotificationData) => {
    if (!notification.read) {
      markAsRead(notification.id);
    }
    // Here you would handle navigation based on notification type
    onClose();
  };

  const handleDeleteNotification = (notificationId: string, event: any) => {
    event.stopPropagation();
    Alert.alert(
      'Excluir Notificação',
      'Tem certeza que deseja excluir esta notificação?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Excluir', 
          style: 'destructive',
          onPress: () => deleteNotification(notificationId)
        }
      ]
    );
  };

  const handleClearAll = () => {
    Alert.alert(
      'Limpar Todas',
      'Tem certeza que deseja excluir todas as notificações?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Limpar Todas', 
          style: 'destructive',
          onPress: clearAllNotifications
        }
      ]
    );
  };

  return (
    <Modal
      transparent={true}
      visible={visible}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>
              Notificações {unreadCount > 0 && `(${unreadCount})`}
            </Text>
            <View style={styles.headerActions}>
              {unreadCount > 0 && (
                <TouchableOpacity 
                  style={styles.markAllButton}
                  onPress={markAllAsRead}
                >
                  <CheckCheck size={20} color={Theme.colors.primary.blue} />
                </TouchableOpacity>
              )}
              <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                <X size={24} color={Theme.colors.text.dark} />
              </TouchableOpacity>
            </View>
          </View>

          {notifications.length === 0 ? (
            <View style={styles.emptyState}>
              <PrayingHands size={48} color={Theme.colors.text.light} />
              <Text style={styles.emptyTitle}>Nenhuma notificação</Text>
              <Text style={styles.emptySubtitle}>
                Você receberá notificações sobre matches, mensagens e eventos aqui.
              </Text>
            </View>
          ) : (
            <>
              <ScrollView style={styles.notificationsList}>
                {notifications.map((notification) => (
                  <TouchableOpacity
                    key={notification.id}
                    style={[
                      styles.notificationItem,
                      !notification.read && styles.unreadNotification
                    ]}
                    onPress={() => handleNotificationPress(notification)}
                  >
                    <View style={[
                      styles.iconContainer,
                      { backgroundColor: getNotificationColor(notification.type) }
                    ]}>
                      {getNotificationIcon(notification.type)}
                    </View>
                    
                    <View style={styles.notificationContent}>
                      <Text style={[
                        styles.notificationTitle,
                        !notification.read && styles.unreadText
                      ]}>
                        {notification.title}
                      </Text>
                      <Text style={styles.notificationBody} numberOfLines={2}>
                        {notification.body}
                      </Text>
                      <Text style={styles.notificationTime}>
                        {formatTime(notification.timestamp)}
                      </Text>
                    </View>

                    {!notification.read && (
                      <View style={styles.unreadDot} />
                    )}

                    <TouchableOpacity
                      style={styles.deleteButton}
                      onPress={(event) => handleDeleteNotification(notification.id, event)}
                    >
                      <Trash2 size={16} color={Theme.colors.text.light} />
                    </TouchableOpacity>
                  </TouchableOpacity>
                ))}
              </ScrollView>

              {notifications.length > 0 && (
                <View style={styles.footer}>
                  <TouchableOpacity 
                    style={styles.clearAllButton}
                    onPress={handleClearAll}
                  >
                    <Text style={styles.clearAllText}>Limpar Todas</Text>
                  </TouchableOpacity>
                </View>
              )}
            </>
          )}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: Theme.colors.background.white,
    borderTopLeftRadius: Theme.borderRadius.lg,
    borderTopRightRadius: Theme.borderRadius.lg,
    maxHeight: '80%',
    minHeight: '50%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Theme.colors.ui.border,
  },
  headerTitle: {
    fontFamily: Theme.typography.fontFamily.subheading,
    fontSize: Theme.typography.fontSize.lg,
    color: Theme.colors.text.dark,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  markAllButton: {
    padding: Theme.spacing.xs,
    marginRight: Theme.spacing.sm,
  },
  closeButton: {
    padding: Theme.spacing.xs,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Theme.spacing.xl,
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
    lineHeight: 22,
  },
  notificationsList: {
    flex: 1,
  },
  notificationItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: Theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Theme.colors.ui.border,
  },
  unreadNotification: {
    backgroundColor: Theme.colors.background.lilac,
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
  },
  notificationTitle: {
    fontFamily: Theme.typography.fontFamily.body,
    fontSize: Theme.typography.fontSize.md,
    color: Theme.colors.text.dark,
    marginBottom: Theme.spacing.xs,
  },
  unreadText: {
    fontFamily: Theme.typography.fontFamily.subheading,
  },
  notificationBody: {
    fontFamily: Theme.typography.fontFamily.body,
    fontSize: Theme.typography.fontSize.sm,
    color: Theme.colors.text.medium,
    marginBottom: Theme.spacing.xs,
    lineHeight: 18,
  },
  notificationTime: {
    fontFamily: Theme.typography.fontFamily.body,
    fontSize: Theme.typography.fontSize.xs,
    color: Theme.colors.text.light,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: Theme.borderRadius.circle,
    backgroundColor: Theme.colors.primary.blue,
    marginTop: Theme.spacing.xs,
    marginRight: Theme.spacing.sm,
  },
  deleteButton: {
    padding: Theme.spacing.xs,
  },
  footer: {
    padding: Theme.spacing.md,
    borderTopWidth: 1,
    borderTopColor: Theme.colors.ui.border,
  },
  clearAllButton: {
    alignItems: 'center',
    paddingVertical: Theme.spacing.sm,
  },
  clearAllText: {
    fontFamily: Theme.typography.fontFamily.body,
    fontSize: Theme.typography.fontSize.sm,
    color: Theme.colors.status.error,
  },
});