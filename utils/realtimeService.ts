import { supabase, isSupabaseConfigured } from './supabase';
import { RealtimeChannel } from '@supabase/supabase-js';

export interface RealtimeMessage {
  id: string;
  conversation_id: string;
  sender_id: string;
  content: string;
  type: 'text' | 'voice' | 'image' | 'verse' | 'prayer';
  metadata?: any;
  created_at: string;
}

export interface RealtimeTyping {
  user_id: string;
  conversation_id: string;
  is_typing: boolean;
  timestamp: string;
}

export class RealtimeService {
  private static channels: Map<string, RealtimeChannel> = new Map();
  private static messageListeners: Map<string, (message: RealtimeMessage) => void> = new Map();
  private static typingListeners: Map<string, (typing: RealtimeTyping) => void> = new Map();

  /**
   * Subscribe to real-time messages for a conversation
   */
  static subscribeToMessages(
    conversationId: string,
    onMessage: (message: RealtimeMessage) => void
  ): () => void {
    if (!isSupabaseConfigured) {
      console.warn('Supabase not configured, skipping real-time subscription');
      return () => {};
    }

    const channelName = `conversation:${conversationId}`;
    
    // Remove existing subscription if any
    this.unsubscribeFromMessages(conversationId);

    // Create new channel
    const channel = supabase
      .channel(channelName)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `conversation_id=eq.${conversationId}`
        },
        (payload) => {
          const message = payload.new as RealtimeMessage;
          onMessage(message);
        }
      )
      .subscribe();

    // Store channel and listener
    this.channels.set(conversationId, channel);
    this.messageListeners.set(conversationId, onMessage);

    // Return unsubscribe function
    return () => this.unsubscribeFromMessages(conversationId);
  }

  /**
   * Unsubscribe from messages for a conversation
   */
  static unsubscribeFromMessages(conversationId: string): void {
    const channel = this.channels.get(conversationId);
    if (channel) {
      supabase.removeChannel(channel);
      this.channels.delete(conversationId);
      this.messageListeners.delete(conversationId);
    }
  }

  /**
   * Subscribe to typing indicators
   */
  static subscribeToTyping(
    conversationId: string,
    onTyping: (typing: RealtimeTyping) => void
  ): () => void {
    if (!isSupabaseConfigured) {
      return () => {};
    }

    const channelName = `typing:${conversationId}`;
    
    const channel = supabase
      .channel(channelName)
      .on('broadcast', { event: 'typing' }, (payload) => {
        onTyping(payload.payload as RealtimeTyping);
      })
      .subscribe();

    this.typingListeners.set(conversationId, onTyping);

    return () => {
      supabase.removeChannel(channel);
      this.typingListeners.delete(conversationId);
    };
  }

  /**
   * Send typing indicator
   */
  static sendTypingIndicator(
    conversationId: string,
    userId: string,
    isTyping: boolean
  ): void {
    if (!isSupabaseConfigured) return;

    const channelName = `typing:${conversationId}`;
    const channel = this.channels.get(conversationId) || supabase.channel(channelName);
    
    channel.send({
      type: 'broadcast',
      event: 'typing',
      payload: {
        user_id: userId,
        conversation_id: conversationId,
        is_typing: isTyping,
        timestamp: new Date().toISOString()
      }
    });
  }

  /**
   * Subscribe to user presence
   */
  static subscribeToPresence(
    userId: string,
    onPresenceChange: (users: any[]) => void
  ): () => void {
    if (!isSupabaseConfigured) {
      return () => {};
    }

    const channel = supabase
      .channel('online-users')
      .on('presence', { event: 'sync' }, () => {
        const state = channel.presenceState();
        const users = Object.values(state).flat();
        onPresenceChange(users);
      })
      .on('presence', { event: 'join' }, ({ key, newPresences }) => {
        console.log('User joined:', key, newPresences);
      })
      .on('presence', { event: 'leave' }, ({ key, leftPresences }) => {
        console.log('User left:', key, leftPresences);
      })
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          await channel.track({
            user_id: userId,
            online_at: new Date().toISOString(),
          });
        }
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }

  /**
   * Clean up all subscriptions
   */
  static cleanup(): void {
    // Unsubscribe from all channels
    for (const [conversationId] of this.channels) {
      this.unsubscribeFromMessages(conversationId);
    }
    
    // Clear all listeners
    this.messageListeners.clear();
    this.typingListeners.clear();
  }
}