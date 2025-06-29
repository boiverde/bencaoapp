import { useEffect, useRef, useState } from 'react';
import { Platform } from 'react-native';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';

export interface NotificationData {
  id: string;
  title: string;
  body: string;
  type: 'match' | 'message' | 'event' | 'prayer' | 'like' | 'follow';
  data?: any;
  timestamp: number;
  read: boolean;
}

// Configure notification behavior
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export function useNotifications() {
  const [expoPushToken, setExpoPushToken] = useState<string>('');
  const [notifications, setNotifications] = useState<NotificationData[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const notificationListener = useRef<Notifications.Subscription>();
  const responseListener = useRef<Notifications.Subscription>();
  const isMounted = useRef(true);

  useEffect(() => {
    isMounted.current = true;
    
    const initializeNotifications = async () => {
      try {
        const token = await registerForPushNotificationsAsync();
        if (token && isMounted.current) {
          setExpoPushToken(token);
        }
        
        // Listen for incoming notifications
        notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
          if (!isMounted.current) return;
          
          const notificationData: NotificationData = {
            id: notification.request.identifier,
            title: notification.request.content.title || '',
            body: notification.request.content.body || '',
            type: notification.request.content.data?.type || 'message',
            data: notification.request.content.data,
            timestamp: Date.now(),
            read: false,
          };
          
          setNotifications(prev => [notificationData, ...prev]);
          setUnreadCount(prev => prev + 1);
        });

        // Listen for notification responses (when user taps notification)
        responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
          if (!isMounted.current) return;
          
          const notificationId = response.notification.request.identifier;
          markAsRead(notificationId);
          
          // Handle navigation based on notification type
          const type = response.notification.request.content.data?.type;
          handleNotificationNavigation(type, response.notification.request.content.data);
        });

        // Load existing notifications from storage
        loadNotifications();
      } catch (error) {
        console.error("Error initializing notifications:", error);
      }
    };

    initializeNotifications();

    return () => {
      isMounted.current = false;
      if (notificationListener.current) {
        Notifications.removeNotificationSubscription(notificationListener.current);
      }
      if (responseListener.current) {
        Notifications.removeNotificationSubscription(responseListener.current);
      }
    };
  }, []);

  const registerForPushNotificationsAsync = async (): Promise<string | null> => {
    let token = null;

    if (Platform.OS === 'web') {
      // For web, we'll use a mock token or implement web push notifications
      return 'web-mock-token';
    }

    if (Device.isDevice) {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      
      if (finalStatus !== 'granted') {
        alert('Falha ao obter permissão para notificações push!');
        return null;
      }
      
      try {
        const projectId = ''; // Add your Expo project ID here
        token = (await Notifications.getExpoPushTokenAsync({ projectId })).data;
      } catch (error) {
        console.log('Error getting push token:', error);
      }
    } else {
      alert('Deve usar um dispositivo físico para notificações push');
    }

    if (Platform.OS === 'android') {
      Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#6BBBDD',
      });
    }

    return token;
  };

  const loadNotifications = async () => {
    // In a real app, load from AsyncStorage or API
    const mockNotifications: NotificationData[] = [
      {
        id: '1',
        title: 'Nova Conexão!',
        body: 'Você e Mariana se conectaram! 💕',
        type: 'match',
        timestamp: Date.now() - 3600000,
        read: false,
      },
      {
        id: '2',
        title: 'Nova Mensagem',
        body: 'João enviou uma mensagem para você',
        type: 'message',
        timestamp: Date.now() - 7200000,
        read: false,
      },
      {
        id: '3',
        title: 'Evento Próximo',
        body: 'Encontro de Jovens Cristãos amanhã às 19h',
        type: 'event',
        timestamp: Date.now() - 10800000,
        read: true,
      },
    ];
    
    if (isMounted.current) {
      setNotifications(mockNotifications);
      setUnreadCount(mockNotifications.filter(n => !n.read).length);
    }
  };

  const handleNotificationNavigation = (type: string, data: any) => {
    // This would be implemented with your navigation system
    console.log('Navigate to:', type, data);
  };

  const sendLocalNotification = async (
    title: string,
    body: string,
    type: NotificationData['type'],
    data?: any
  ) => {
    await Notifications.scheduleNotificationAsync({
      content: {
        title,
        body,
        data: { type, ...data },
        sound: Platform.OS === 'web' ? undefined : 'default',
      },
      trigger: null, // Send immediately
    });
  };

  const markAsRead = (notificationId: string) => {
    if (isMounted.current) {
      setNotifications(prev => 
        prev.map(notification => 
          notification.id === notificationId 
            ? { ...notification, read: true }
            : notification
        )
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    }
  };

  const markAllAsRead = () => {
    if (isMounted.current) {
      setNotifications(prev => 
        prev.map(notification => ({ ...notification, read: true }))
      );
      setUnreadCount(0);
    }
  };

  const deleteNotification = (notificationId: string) => {
    if (isMounted.current) {
      setNotifications(prev => {
        const notification = prev.find(n => n.id === notificationId);
        if (notification && !notification.read) {
          setUnreadCount(count => Math.max(0, count - 1));
        }
        return prev.filter(n => n.id !== notificationId);
      });
    }
  };

  const clearAllNotifications = () => {
    if (isMounted.current) {
      setNotifications([]);
      setUnreadCount(0);
    }
  };

  // Predefined notification templates
  const sendMatchNotification = (matchName: string) => {
    sendLocalNotification(
      'Nova Conexão Abençoada! 💕',
      `Você e ${matchName} se conectaram! Que Deus abençoe esta nova amizade.`,
      'match',
      { matchName }
    );
  };

  const sendMessageNotification = (senderName: string, preview: string) => {
    sendLocalNotification(
      'Nova Mensagem',
      `${senderName}: ${preview}`,
      'message',
      { senderName, preview }
    );
  };

  const sendEventNotification = (eventTitle: string, eventTime: string) => {
    sendLocalNotification(
      'Evento Próximo 📅',
      `${eventTitle} - ${eventTime}`,
      'event',
      { eventTitle, eventTime }
    );
  };

  const sendPrayerNotification = (message: string) => {
    sendLocalNotification(
      'Momento de Oração 🙏',
      message,
      'prayer'
    );
  };

  const sendLikeNotification = (likerName: string) => {
    sendLocalNotification(
      'Nova Curtida ❤️',
      `${likerName} curtiu sua publicação`,
      'like',
      { likerName }
    );
  };

  const sendFollowNotification = (followerName: string) => {
    sendLocalNotification(
      'Novo Seguidor ⭐',
      `${followerName} começou a te seguir`,
      'follow',
      { followerName }
    );
  };

  return {
    expoPushToken,
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearAllNotifications,
    sendLocalNotification,
    sendMatchNotification,
    sendMessageNotification,
    sendEventNotification,
    sendPrayerNotification,
    sendLikeNotification,
    sendFollowNotification,
  };
}