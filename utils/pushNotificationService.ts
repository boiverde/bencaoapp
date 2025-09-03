import { Platform } from 'react-native';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import Constants from 'expo-constants';

export interface PushNotificationData {
  title: string;
  body: string;
  data?: any;
  sound?: boolean;
  badge?: number;
}

export class PushNotificationService {
  private static token: string | null = null;

  /**
   * Initialize push notifications
   */
  static async initialize(): Promise<{ token: string | null; error: string | null }> {
    try {
      // Configure notification behavior
      Notifications.setNotificationHandler({
        handleNotification: async () => ({
          shouldShowAlert: true,
          shouldPlaySound: true,
          shouldSetBadge: true,
        }),
      });

      // Register for push notifications
      const token = await this.registerForPushNotifications();
      this.token = token;

      // Set up notification channels for Android
      if (Platform.OS === 'android') {
        await this.setupAndroidChannels();
      }

      return { token, error: null };
    } catch (error) {
      console.error('Push notification initialization error:', error);
      return { token: null, error: 'Erro ao inicializar notificações' };
    }
  }

  /**
   * Register for push notifications
   */
  private static async registerForPushNotifications(): Promise<string | null> {
    if (Platform.OS === 'web') {
      return 'web-mock-token';
    }

    if (!Device.isDevice) {
      console.log('Must use physical device for Push Notifications');
      return null;
    }

    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      console.log('Failed to get push token for push notification!');
      return null;
    }

    try {
      const projectId = Constants.expoConfig?.extra?.eas?.projectId || process.env.EXPO_PUBLIC_EAS_PROJECT_ID;
      
      if (!projectId) {
        console.log('Project ID not found');
        return null;
      }

      const token = await Notifications.getExpoPushTokenAsync({
        projectId,
      });

      return token.data;
    } catch (error) {
      console.error('Error getting push token:', error);
      return null;
    }
  }

  /**
   * Setup Android notification channels
   */
  private static async setupAndroidChannels(): Promise<void> {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'Notificações Gerais',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#6BBBDD',
      sound: 'default',
    });

    await Notifications.setNotificationChannelAsync('matches', {
      name: 'Novos Matches',
      importance: Notifications.AndroidImportance.HIGH,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#F498B6',
      sound: 'default',
    });

    await Notifications.setNotificationChannelAsync('messages', {
      name: 'Mensagens',
      importance: Notifications.AndroidImportance.HIGH,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#6BBBDD',
      sound: 'default',
    });

    await Notifications.setNotificationChannelAsync('prayers', {
      name: 'Momentos de Oração',
      importance: Notifications.AndroidImportance.DEFAULT,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#E6C78C',
      sound: 'default',
    });
  }

  /**
   * Send local notification
   */
  static async sendLocalNotification(notification: PushNotificationData): Promise<{ error: string | null }> {
    try {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: notification.title,
          body: notification.body,
          data: notification.data || {},
          sound: notification.sound !== false ? 'default' : undefined,
          badge: notification.badge,
        },
        trigger: null, // Send immediately
      });

      return { error: null };
    } catch (error) {
      console.error('Send local notification error:', error);
      return { error: 'Erro ao enviar notificação' };
    }
  }

  /**
   * Send push notification to specific user (server-side)
   */
  static async sendPushNotification(
    userToken: string, 
    notification: PushNotificationData
  ): Promise<{ error: string | null }> {
    try {
      const message = {
        to: userToken,
        sound: notification.sound !== false ? 'default' : undefined,
        title: notification.title,
        body: notification.body,
        data: notification.data || {},
        badge: notification.badge,
      };

      const response = await fetch('https://exp.host/--/api/v2/push/send', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Accept-encoding': 'gzip, deflate',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(message),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.details?.error || 'Push notification failed');
      }

      return { error: null };
    } catch (error) {
      console.error('Send push notification error:', error);
      return { error: 'Erro ao enviar notificação push' };
    }
  }

  /**
   * Get current push token
   */
  static getCurrentToken(): string | null {
    return this.token;
  }

  /**
   * Clear badge count
   */
  static async clearBadge(): Promise<void> {
    try {
      await Notifications.setBadgeCountAsync(0);
    } catch (error) {
      console.error('Clear badge error:', error);
    }
  }

  /**
   * Cancel all notifications
   */
  static async cancelAllNotifications(): Promise<void> {
    try {
      await Notifications.cancelAllScheduledNotificationsAsync();
    } catch (error) {
      console.error('Cancel notifications error:', error);
    }
  }
}