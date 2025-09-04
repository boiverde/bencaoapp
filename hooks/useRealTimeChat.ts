import { useState, useEffect, useCallback } from 'react';
import { supabase, isSupabaseConfigured } from '@/utils/supabase';
import { RealtimeService } from '@/utils/realtimeService';
import { useAuth } from './useAuth';

export interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  content: string;
  type: 'text' | 'voice' | 'image' | 'verse' | 'prayer';
  metadata?: any;
  created_at: string;
}

export interface Conversation {
  id: string;
  participants: string[];
  type: 'direct' | 'group' | 'prayer_circle';
  title?: string;
  last_activity: string;
  created_at: string;
}

export function useRealTimeChat() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [messages, setMessages] = useState<Map<string, Message[]>>(new Map());
  const [typingUsers, setTypingUsers] = useState<Map<string, string[]>>(new Map());
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const { user } = useAuth();

  // Load conversations
  useEffect(() => {
    if (user && isSupabaseConfigured) {
      loadConversations();
    } else {
      // Load mock conversations
      loadMockConversations();
    }
  }, [user]);

  const loadConversations = async () => {
    if (!user || !isSupabaseConfigured) return;

    try {
      setIsLoading(true);
      
      const { data, error } = await supabase
        .from('conversations')
        .select('*')
        .contains('participants', [user.id])
        .order('last_activity', { ascending: false });

      if (error) {
        console.error('Error loading conversations:', error);
        return;
      }

      setConversations(data || []);
      
      // Load messages for each conversation
      for (const conversation of data || []) {
        await loadMessagesForConversation(conversation.id);
      }
    } catch (error) {
      console.error('Error loading conversations:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadMockConversations = () => {
    // Mock data for development
    const mockConversations: Conversation[] = [
      {
        id: 'conv_1',
        participants: ['user_1', 'current_user'],
        type: 'direct',
        last_activity: new Date().toISOString(),
        created_at: new Date().toISOString()
      }
    ];
    
    setConversations(mockConversations);
    setIsLoading(false);
  };

  const loadMessagesForConversation = async (conversationId: string) => {
    if (!isSupabaseConfigured) {
      // Load mock messages
      const mockMessages: Message[] = [
        {
          id: 'msg_1',
          conversation_id: conversationId,
          sender_id: 'user_1',
          content: 'Olá! Como você está?',
          type: 'text',
          created_at: new Date().toISOString()
        }
      ];
      
      setMessages(prev => new Map(prev.set(conversationId, mockMessages)));
      return;
    }

    try {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error loading messages:', error);
        return;
      }

      setMessages(prev => new Map(prev.set(conversationId, data || [])));
      
      // Subscribe to real-time updates
      RealtimeService.subscribeToMessages(conversationId, (newMessage) => {
        setMessages(prev => {
          const conversationMessages = prev.get(conversationId) || [];
          return new Map(prev.set(conversationId, [...conversationMessages, newMessage]));
        });
      });
    } catch (error) {
      console.error('Error loading messages:', error);
    }
  };

  const sendMessage = useCallback(async (
    conversationId: string,
    content: string,
    type: Message['type'] = 'text',
    metadata?: any
  ): Promise<Message | null> => {
    if (!user) return null;

    const tempMessage: Message = {
      id: `temp_${Date.now()}`,
      conversation_id: conversationId,
      sender_id: user.id,
      content,
      type,
      metadata,
      created_at: new Date().toISOString()
    };

    // Add message optimistically
    setMessages(prev => {
      const conversationMessages = prev.get(conversationId) || [];
      return new Map(prev.set(conversationId, [...conversationMessages, tempMessage]));
    });

    try {
      if (isSupabaseConfigured) {
        // Send to real database
        const { data, error } = await supabase
          .from('messages')
          .insert({
            conversation_id: conversationId,
            sender_id: user.id,
            content,
            type,
            metadata
          })
          .select()
          .single();

        if (error) {
          console.error('Error sending message:', error);
          // Remove optimistic message on error
          setMessages(prev => {
            const conversationMessages = prev.get(conversationId) || [];
            return new Map(prev.set(conversationId, 
              conversationMessages.filter(m => m.id !== tempMessage.id)
            ));
          });
          return null;
        }

        // Replace temp message with real message
        setMessages(prev => {
          const conversationMessages = prev.get(conversationId) || [];
          const updatedMessages = conversationMessages.map(m => 
            m.id === tempMessage.id ? data : m
          );
          return new Map(prev.set(conversationId, updatedMessages));
        });

        // Update conversation last activity
        await supabase
          .from('conversations')
          .update({ last_activity: new Date().toISOString() })
          .eq('id', conversationId);

        return data;
      } else {
        // Mock mode - just return the temp message with a real ID
        const realMessage = { ...tempMessage, id: `msg_${Date.now()}` };
        
        setMessages(prev => {
          const conversationMessages = prev.get(conversationId) || [];
          const updatedMessages = conversationMessages.map(m => 
            m.id === tempMessage.id ? realMessage : m
          );
          return new Map(prev.set(conversationId, updatedMessages));
        });
        
        return realMessage;
      }
    } catch (error) {
      console.error('Error sending message:', error);
      return null;
    }
  }, [user]);

  const createConversation = useCallback(async (
    participantIds: string[],
    type: Conversation['type'] = 'direct',
    title?: string
  ): Promise<Conversation | null> => {
    if (!user) return null;

    try {
      if (isSupabaseConfigured) {
        const { data, error } = await supabase
          .from('conversations')
          .insert({
            participants: participantIds,
            type,
            title,
            last_activity: new Date().toISOString()
          })
          .select()
          .single();

        if (error) {
          console.error('Error creating conversation:', error);
          return null;
        }

        setConversations(prev => [data, ...prev]);
        return data;
      } else {
        // Mock conversation
        const mockConversation: Conversation = {
          id: `conv_${Date.now()}`,
          participants: participantIds,
          type,
          title,
          last_activity: new Date().toISOString(),
          created_at: new Date().toISOString()
        };
        
        setConversations(prev => [mockConversation, ...prev]);
        return mockConversation;
      }
    } catch (error) {
      console.error('Error creating conversation:', error);
      return null;
    }
  }, [user]);

  const startTyping = useCallback((conversationId: string) => {
    if (!user) return;
    
    RealtimeService.sendTypingIndicator(conversationId, user.id, true);
  }, [user]);

  const stopTyping = useCallback((conversationId: string) => {
    if (!user) return;
    
    RealtimeService.sendTypingIndicator(conversationId, user.id, false);
  }, [user]);

  return {
    conversations,
    messages,
    typingUsers,
    onlineUsers,
    isLoading,
    sendMessage,
    createConversation,
    startTyping,
    stopTyping,
    getConversationMessages: (conversationId: string) => messages.get(conversationId) || []
  };
}