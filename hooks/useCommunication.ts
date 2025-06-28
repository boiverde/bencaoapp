import { useState, useEffect, useRef } from 'react';
import { Platform } from 'react-native';
import {
  Message,
  Conversation,
  VoiceCall,
  PrayerRequest,
  SpiritualSticker,
  CommunicationSystem,
  MockTranslationService,
  TranslationService
} from '@/utils/communicationSystem';
import { useNotifications } from './useNotifications';

export interface TypingIndicator {
  userId: string;
  conversationId: string;
  timestamp: number;
}

export interface OnlineStatus {
  userId: string;
  isOnline: boolean;
  lastSeen: number;
}

export function useCommunication() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [messages, setMessages] = useState<Map<string, Message[]>>(new Map());
  const [activeCall, setActiveCall] = useState<VoiceCall | null>(null);
  const [typingIndicators, setTypingIndicators] = useState<TypingIndicator[]>([]);
  const [onlineStatuses, setOnlineStatuses] = useState<Map<string, OnlineStatus>>(new Map());
  const [prayerRequests, setPrayerRequests] = useState<PrayerRequest[]>([]);
  const [isConnected, setIsConnected] = useState(true);
  const [translationService] = useState<TranslationService>(new MockTranslationService());
  
  const { sendMessageNotification } = useNotifications();
  const typingTimeoutRef = useRef<Map<string, NodeJS.Timeout>>(new Map());

  useEffect(() => {
    loadConversations();
    loadPrayerRequests();
    simulateOnlineStatuses();
  }, []);

  const loadConversations = async () => {
    // Mock conversations data
    const mockConversations: Conversation[] = [
      {
        id: 'conv_1',
        participants: ['user_1', 'current_user'],
        type: 'direct',
        lastActivity: Date.now() - 3600000,
        unreadCount: 2,
        isArchived: false,
        isMuted: false,
        settings: {
          autoTranslate: false,
          targetLanguage: 'pt',
          verseSharing: true,
          prayerRequests: true,
          voiceMessages: true,
          readReceipts: true,
          typing: true,
          notifications: true
        },
        lastMessage: {
          id: 'msg_1',
          senderId: 'user_1',
          receiverId: 'current_user',
          conversationId: 'conv_1',
          content: 'Oi! Como você está? Espero que Deus esteja abençoando sua semana!',
          type: 'text',
          timestamp: Date.now() - 3600000,
          status: 'delivered'
        }
      },
      {
        id: 'conv_2',
        participants: ['user_2', 'current_user'],
        type: 'direct',
        lastActivity: Date.now() - 7200000,
        unreadCount: 0,
        isArchived: false,
        isMuted: false,
        settings: {
          autoTranslate: true,
          targetLanguage: 'pt',
          verseSharing: true,
          prayerRequests: true,
          voiceMessages: true,
          readReceipts: true,
          typing: true,
          notifications: true
        },
        lastMessage: {
          id: 'msg_2',
          senderId: 'current_user',
          receiverId: 'user_2',
          conversationId: 'conv_2',
          content: 'Amém! Que Deus continue te abençoando também! 🙏',
          type: 'text',
          timestamp: Date.now() - 7200000,
          status: 'read'
        }
      },
      {
        id: 'conv_3',
        participants: ['user_3', 'user_4', 'user_5', 'current_user'],
        type: 'prayer_circle',
        title: 'Círculo de Oração - Família',
        lastActivity: Date.now() - 1800000,
        unreadCount: 5,
        isArchived: false,
        isMuted: false,
        settings: {
          autoTranslate: false,
          targetLanguage: 'pt',
          verseSharing: true,
          prayerRequests: true,
          voiceMessages: true,
          readReceipts: false,
          typing: true,
          notifications: true
        },
        metadata: {
          prayerTopic: 'Família e Relacionamentos',
          denomination: 'Batista'
        }
      }
    ];

    setConversations(mockConversations);
    
    // Load messages for each conversation
    mockConversations.forEach(conv => {
      loadMessagesForConversation(conv.id);
    });
  };

  const loadMessagesForConversation = async (conversationId: string) => {
    // Mock messages data
    const mockMessages: Message[] = [
      {
        id: 'msg_1',
        senderId: 'user_1',
        receiverId: 'current_user',
        conversationId,
        content: 'Oi! Como você está?',
        type: 'text',
        timestamp: Date.now() - 7200000,
        status: 'read'
      },
      {
        id: 'msg_2',
        senderId: 'current_user',
        receiverId: 'user_1',
        conversationId,
        content: 'Oi! Estou bem, obrigada! E você?',
        type: 'text',
        timestamp: Date.now() - 7000000,
        status: 'read'
      },
      {
        id: 'msg_3',
        senderId: 'user_1',
        receiverId: 'current_user',
        conversationId,
        content: 'Também estou bem! Deus tem sido muito bom comigo.',
        type: 'text',
        timestamp: Date.now() - 6800000,
        status: 'read'
      },
      {
        id: 'msg_4',
        senderId: 'user_1',
        receiverId: 'current_user',
        conversationId,
        content: 'O amor é paciente, o amor é bondoso. Não inveja, não se vangloria, não se orgulha.',
        type: 'verse',
        timestamp: Date.now() - 6600000,
        status: 'read',
        metadata: {
          verseReference: '1 Coríntios 13:4'
        }
      },
      {
        id: 'msg_5',
        senderId: 'current_user',
        receiverId: 'user_1',
        conversationId,
        content: 'Que versículo lindo! Muito obrigada por compartilhar! ❤️',
        type: 'text',
        timestamp: Date.now() - 6400000,
        status: 'read',
        reactions: [
          { userId: 'user_1', emoji: '❤️', timestamp: Date.now() - 6300000 }
        ]
      },
      {
        id: 'msg_6',
        senderId: 'user_1',
        receiverId: 'current_user',
        conversationId,
        content: 'Oi! Como você está? Espero que Deus esteja abençoando sua semana!',
        type: 'text',
        timestamp: Date.now() - 3600000,
        status: 'delivered'
      }
    ];

    setMessages(prev => new Map(prev.set(conversationId, mockMessages)));
  };

  const loadPrayerRequests = async () => {
    const mockPrayerRequests: PrayerRequest[] = [
      {
        id: 'prayer_1',
        requesterId: 'user_1',
        title: 'Oração pela Família',
        description: 'Peço orações pela saúde da minha mãe que está passando por um tratamento.',
        category: 'family',
        urgency: 'high',
        isPrivate: false,
        prayedBy: ['current_user', 'user_2'],
        createdAt: Date.now() - 86400000
      },
      {
        id: 'prayer_2',
        requesterId: 'current_user',
        title: 'Direção Profissional',
        description: 'Busco direção de Deus para uma importante decisão de carreira.',
        category: 'work',
        urgency: 'medium',
        isPrivate: true,
        prayedBy: [],
        createdAt: Date.now() - 172800000
      }
    ];

    setPrayerRequests(mockPrayerRequests);
  };

  const simulateOnlineStatuses = () => {
    const mockStatuses = new Map<string, OnlineStatus>([
      ['user_1', { userId: 'user_1', isOnline: true, lastSeen: Date.now() }],
      ['user_2', { userId: 'user_2', isOnline: false, lastSeen: Date.now() - 1800000 }],
      ['user_3', { userId: 'user_3', isOnline: true, lastSeen: Date.now() }],
      ['user_4', { userId: 'user_4', isOnline: false, lastSeen: Date.now() - 3600000 }],
      ['user_5', { userId: 'user_5', isOnline: true, lastSeen: Date.now() }]
    ]);

    setOnlineStatuses(mockStatuses);
  };

  const sendMessage = async (
    conversationId: string,
    content: string,
    type: Message['type'] = 'text',
    metadata?: Message['metadata']
  ): Promise<Message> => {
    const conversation = conversations.find(c => c.id === conversationId);
    if (!conversation) throw new Error('Conversation not found');

    const receiverId = conversation.participants.find(p => p !== 'current_user') || '';
    
    const message = CommunicationSystem.createMessage(
      'current_user',
      receiverId,
      conversationId,
      content,
      type,
      metadata
    );

    // Add message to local state
    setMessages(prev => {
      const conversationMessages = prev.get(conversationId) || [];
      return new Map(prev.set(conversationId, [...conversationMessages, message]));
    });

    // Update conversation last message and activity
    setConversations(prev => prev.map(conv => 
      conv.id === conversationId 
        ? { ...conv, lastMessage: message, lastActivity: Date.now() }
        : conv
    ));

    // Simulate message delivery
    setTimeout(() => {
      updateMessageStatus(message.id, 'sent');
      setTimeout(() => updateMessageStatus(message.id, 'delivered'), 1000);
      setTimeout(() => updateMessageStatus(message.id, 'read'), 3000);
    }, 500);

    // Auto-translate if enabled
    if (conversation.settings.autoTranslate && conversation.settings.targetLanguage !== 'pt') {
      try {
        const translatedContent = await translationService.translate(
          content,
          conversation.settings.targetLanguage,
          'pt'
        );
        
        if (translatedContent !== content) {
          updateMessage(message.id, {
            metadata: {
              ...message.metadata,
              originalLanguage: 'pt',
              translatedContent
            }
          });
        }
      } catch (error) {
        console.error('Translation failed:', error);
      }
    }

    return message;
  };

  const updateMessage = (messageId: string, updates: Partial<Message>) => {
    setMessages(prev => {
      const newMessages = new Map(prev);
      for (const [conversationId, conversationMessages] of newMessages.entries()) {
        const messageIndex = conversationMessages.findIndex(m => m.id === messageId);
        if (messageIndex !== -1) {
          const updatedMessages = [...conversationMessages];
          updatedMessages[messageIndex] = { ...updatedMessages[messageIndex], ...updates };
          newMessages.set(conversationId, updatedMessages);
          break;
        }
      }
      return newMessages;
    });
  };

  const updateMessageStatus = (messageId: string, status: Message['status']) => {
    updateMessage(messageId, { status });
  };

  const addReaction = (messageId: string, emoji: string) => {
    setMessages(prev => {
      const newMessages = new Map(prev);
      for (const [conversationId, conversationMessages] of newMessages.entries()) {
        const messageIndex = conversationMessages.findIndex(m => m.id === messageId);
        if (messageIndex !== -1) {
          const message = conversationMessages[messageIndex];
          const existingReaction = message.reactions?.find(r => r.userId === 'current_user');
          
          let newReactions = message.reactions || [];
          
          if (existingReaction) {
            if (existingReaction.emoji === emoji) {
              // Remove reaction
              newReactions = newReactions.filter(r => r.userId !== 'current_user');
            } else {
              // Update reaction
              newReactions = newReactions.map(r => 
                r.userId === 'current_user' 
                  ? { ...r, emoji, timestamp: Date.now() }
                  : r
              );
            }
          } else {
            // Add new reaction
            newReactions.push({
              userId: 'current_user',
              emoji,
              timestamp: Date.now()
            });
          }
          
          const updatedMessages = [...conversationMessages];
          updatedMessages[messageIndex] = { ...message, reactions: newReactions };
          newMessages.set(conversationId, updatedMessages);
          break;
        }
      }
      return newMessages;
    });
  };

  const deleteMessage = (messageId: string) => {
    setMessages(prev => {
      const newMessages = new Map(prev);
      for (const [conversationId, conversationMessages] of newMessages.entries()) {
        const filteredMessages = conversationMessages.filter(m => m.id !== messageId);
        if (filteredMessages.length !== conversationMessages.length) {
          newMessages.set(conversationId, filteredMessages);
          break;
        }
      }
      return newMessages;
    });
  };

  const editMessage = (messageId: string, newContent: string) => {
    updateMessage(messageId, {
      content: newContent,
      edited: true,
      editedAt: Date.now()
    });
  };

  const startTyping = (conversationId: string) => {
    const indicator: TypingIndicator = {
      userId: 'current_user',
      conversationId,
      timestamp: Date.now()
    };

    setTypingIndicators(prev => {
      const filtered = prev.filter(t => !(t.userId === 'current_user' && t.conversationId === conversationId));
      return [...filtered, indicator];
    });

    // Clear existing timeout
    const timeoutKey = `${conversationId}_current_user`;
    const existingTimeout = typingTimeoutRef.current.get(timeoutKey);
    if (existingTimeout) {
      clearTimeout(existingTimeout);
    }

    // Set new timeout
    const timeout = setTimeout(() => {
      stopTyping(conversationId);
    }, 3000);
    
    typingTimeoutRef.current.set(timeoutKey, timeout);
  };

  const stopTyping = (conversationId: string) => {
    setTypingIndicators(prev => 
      prev.filter(t => !(t.userId === 'current_user' && t.conversationId === conversationId))
    );

    const timeoutKey = `${conversationId}_current_user`;
    const existingTimeout = typingTimeoutRef.current.get(timeoutKey);
    if (existingTimeout) {
      clearTimeout(existingTimeout);
      typingTimeoutRef.current.delete(timeoutKey);
    }
  };

  const startVoiceCall = (conversationId: string, type: VoiceCall['type'] = 'voice', prayerMode: boolean = false) => {
    const conversation = conversations.find(c => c.id === conversationId);
    if (!conversation) return null;

    const call = CommunicationSystem.createVoiceCall(
      conversationId,
      conversation.participants,
      type,
      prayerMode
    );

    setActiveCall(call);
    return call;
  };

  const endVoiceCall = () => {
    if (activeCall) {
      const endTime = Date.now();
      const duration = Math.floor((endTime - activeCall.startTime) / 1000);
      
      setActiveCall(prev => prev ? {
        ...prev,
        status: 'ended',
        endTime,
        duration
      } : null);

      // Clear call after a short delay
      setTimeout(() => setActiveCall(null), 2000);
    }
  };

  const answerCall = () => {
    if (activeCall) {
      setActiveCall(prev => prev ? { ...prev, status: 'active' } : null);
    }
  };

  const declineCall = () => {
    if (activeCall) {
      setActiveCall(prev => prev ? { ...prev, status: 'declined' } : null);
      setTimeout(() => setActiveCall(null), 1000);
    }
  };

  const createPrayerRequest = (
    title: string,
    description: string,
    category: PrayerRequest['category'],
    urgency: PrayerRequest['urgency'] = 'medium',
    isPrivate: boolean = false
  ) => {
    const request = CommunicationSystem.createPrayerRequest(
      'current_user',
      title,
      description,
      category,
      urgency,
      isPrivate
    );

    setPrayerRequests(prev => [request, ...prev]);
    return request;
  };

  const prayForRequest = (requestId: string) => {
    setPrayerRequests(prev => prev.map(request => 
      request.id === requestId && !request.prayedBy.includes('current_user')
        ? { ...request, prayedBy: [...request.prayedBy, 'current_user'] }
        : request
    ));
  };

  const markRequestAnswered = (requestId: string, testimony?: string) => {
    setPrayerRequests(prev => prev.map(request => 
      request.id === requestId
        ? { 
            ...request, 
            answeredBy: 'current_user',
            answeredAt: Date.now(),
            testimony 
          }
        : request
    ));
  };

  const sendVerse = async (conversationId: string, category?: string) => {
    const verse = category 
      ? CommunicationSystem.getVerseByCategory(category)
      : CommunicationSystem.getRandomVerse();
    
    if (verse) {
      const [content, reference] = verse.split(' - ');
      return await sendMessage(conversationId, content, 'verse', { verseReference: reference });
    }
  };

  const sendSticker = async (conversationId: string, sticker: SpiritualSticker) => {
    return await sendMessage(conversationId, sticker.packName, 'sticker', {
      stickerPack: sticker.packId,
      stickerId: sticker.id,
      imageUrl: sticker.imageUrl
    });
  };

  const translateMessage = async (messageId: string, targetLanguage: string) => {
    const message = findMessageById(messageId);
    if (!message) return;

    try {
      const translatedContent = await translationService.translate(
        message.content,
        targetLanguage
      );
      
      updateMessage(messageId, {
        metadata: {
          ...message.metadata,
          originalLanguage: 'pt',
          translatedContent
        }
      });
    } catch (error) {
      console.error('Translation failed:', error);
    }
  };

  const findMessageById = (messageId: string): Message | undefined => {
    for (const conversationMessages of messages.values()) {
      const message = conversationMessages.find(m => m.id === messageId);
      if (message) return message;
    }
    return undefined;
  };

  const getConversationMessages = (conversationId: string): Message[] => {
    return messages.get(conversationId) || [];
  };

  const getUnreadCount = (): number => {
    return conversations.reduce((total, conv) => total + conv.unreadCount, 0);
  };

  const markConversationAsRead = (conversationId: string) => {
    setConversations(prev => prev.map(conv => 
      conv.id === conversationId ? { ...conv, unreadCount: 0 } : conv
    ));
  };

  const archiveConversation = (conversationId: string) => {
    setConversations(prev => prev.map(conv => 
      conv.id === conversationId ? { ...conv, isArchived: true } : conv
    ));
  };

  const muteConversation = (conversationId: string, mute: boolean = true) => {
    setConversations(prev => prev.map(conv => 
      conv.id === conversationId ? { ...conv, isMuted: mute } : conv
    ));
  };

  const updateConversationSettings = (conversationId: string, settings: Partial<Conversation['settings']>) => {
    setConversations(prev => prev.map(conv => 
      conv.id === conversationId 
        ? { ...conv, settings: { ...conv.settings, ...settings } }
        : conv
    ));
  };

  const searchMessages = (query: string, conversationId?: string): Message[] => {
    const searchTerm = query.toLowerCase();
    const messagesToSearch = conversationId 
      ? [messages.get(conversationId) || []]
      : Array.from(messages.values());

    return messagesToSearch
      .flat()
      .filter(message => 
        message.content.toLowerCase().includes(searchTerm) ||
        (message.metadata?.verseReference && message.metadata.verseReference.toLowerCase().includes(searchTerm))
      );
  };

  const getTypingUsers = (conversationId: string): string[] => {
    return typingIndicators
      .filter(t => t.conversationId === conversationId && t.userId !== 'current_user')
      .map(t => t.userId);
  };

  const isUserOnline = (userId: string): boolean => {
    const status = onlineStatuses.get(userId);
    return status?.isOnline || false;
  };

  const getUserLastSeen = (userId: string): number => {
    const status = onlineStatuses.get(userId);
    return status?.lastSeen || 0;
  };

  return {
    // State
    conversations,
    messages,
    activeCall,
    typingIndicators,
    prayerRequests,
    isConnected,

    // Message functions
    sendMessage,
    updateMessage,
    updateMessageStatus,
    addReaction,
    deleteMessage,
    editMessage,
    getConversationMessages,
    searchMessages,
    translateMessage,

    // Typing functions
    startTyping,
    stopTyping,
    getTypingUsers,

    // Call functions
    startVoiceCall,
    endVoiceCall,
    answerCall,
    declineCall,

    // Prayer functions
    createPrayerRequest,
    prayForRequest,
    markRequestAnswered,

    // Spiritual content
    sendVerse,
    sendSticker,

    // Conversation management
    getUnreadCount,
    markConversationAsRead,
    archiveConversation,
    muteConversation,
    updateConversationSettings,

    // User status
    isUserOnline,
    getUserLastSeen,

    // Utility
    translationService
  };
}