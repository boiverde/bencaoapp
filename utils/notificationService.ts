import { Platform } from 'react-native';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import Constants from 'expo-constants';
import { supabase, isSupabaseConfigured } from './supabase';

export interface NotificationData {
  title: string;
  body: string;
  data?: any;
  sound?: boolean;
  badge?: number;
}

export class NotificationService {
  private static token: string | null = null;

  /**
   * Initialize push notifications
   */
  static async initialize(): Promise<{ token: string | null; error: string | null }> {
    try {
      if (Platform.OS === 'web') {
        return { token: 'web-mock-token', error: null };
      }

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

      // Save token to database if Supabase is configured
      if (token && isSupabaseConfigured) {
        await this.saveTokenToDatabase(token);
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
  }

  /**
   * Save push token to database
   */
  private static async saveTokenToDatabase(token: string): Promise<void> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        await supabase
          .from('user_push_tokens')
          .upsert({
            user_id: user.id,
            token: token,
            platform: Platform.OS,
            updated_at: new Date().toISOString()
          });
      }
    } catch (error) {
      console.error('Error saving push token:', error);
    }
  }

  /**
   * Send local notification
   */
  static async sendLocalNotification(notification: NotificationData): Promise<{ error: string | null }> {
    try {
      if (Platform.OS === 'web') {
        // For web, use browser notifications if available
        if ('Notification' in window && Notification.permission === 'granted') {
          new Notification(notification.title, {
            body: notification.body,
            icon: '/favicon.png',
          });
        }
        return { error: null };
      }

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
   * Send push notification to specific user
   */
  static async sendPushNotification(
    userId: string,
    notification: NotificationData
  ): Promise<{ error: string | null }> {
    try {
      if (!isSupabaseConfigured) {
        return { error: 'Supabase não configurado' };
      }

      // Get user's push tokens
      const { data: tokens, error } = await supabase
        .from('user_push_tokens')
        .select('token')
        .eq('user_id', userId);

      if (error || !tokens || tokens.length === 0) {
        return { error: 'Token de push não encontrado' };
      }

      // Send notification to all user's devices
      const promises = tokens.map(tokenData => 
        this.sendToExpoPushService(tokenData.token, notification)
      );

      await Promise.all(promises);
      return { error: null };
    } catch (error) {
      console.error('Send push notification error:', error);
      return { error: 'Erro ao enviar notificação push' };
    }
  }

  /**
   * Send notification via Expo Push Service
   */
  private static async sendToExpoPushService(
    token: string,
    notification: NotificationData
  ): Promise<void> {
    const message = {
      to: token,
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

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.details?.error || 'Push notification failed');
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
      if (Platform.OS !== 'web') {
        await Notifications.setBadgeCountAsync(0);
      }
    } catch (error) {
      console.error('Clear badge error:', error);
    }
  }
}