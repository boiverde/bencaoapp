import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { Bell } from 'lucide-react-native';
import Theme from '@/constants/Theme';
import { useNotifications } from '@/hooks/useNotifications';

interface NotificationBellProps {
  onPress: () => void;
  size?: number;
  color?: string;
}

export default function NotificationBell({ 
  onPress, 
  size = 24, 
  color = Theme.colors.text.dark 
}: NotificationBellProps) {
  const { unreadCount } = useNotifications();

  return (
    <TouchableOpacity 
      style={styles.container} 
      onPress={onPress}
      accessible={true}
      accessibilityLabel={`Notificações${unreadCount > 0 ? `, ${unreadCount} não lidas` : ''}`}
      accessibilityRole="button"
      accessibilityHint="Toque para ver suas notificações"
    >
      <Bell size={size} color={color} />
      {unreadCount > 0 && (
        <View style={styles.badge}>
          <Text style={styles.badgeText} accessibilityLabel={`${unreadCount} notificações não lidas`}>
            {unreadCount > 99 ? '99+' : unreadCount.toString()}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    padding: Theme.spacing.xs,
  },
  badge: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: Theme.colors.status.error,
    borderRadius: Theme.borderRadius.circle,
    minWidth: 18,
    height: 18,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
    borderWidth: 2,
    borderColor: Theme.colors.background.white,
  },
  badgeText: {
    fontFamily: Theme.typography.fontFamily.subheading,
    fontSize: 10,
    color: Theme.colors.background.white,
    textAlign: 'center',
  },
});