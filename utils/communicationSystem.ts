export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  conversationId: string;
  content: string;
  type: 'text' | 'voice' | 'image' | 'verse' | 'prayer' | 'location' | 'sticker';
  timestamp: number;
  status: 'sending' | 'sent' | 'delivered' | 'read';
  metadata?: {
    originalLanguage?: string;
    translatedContent?: string;
    voiceDuration?: number;
    imageUrl?: string;
    verseReference?: string;
    prayerCategory?: string;
    location?: {
      latitude: number;
      longitude: number;
      address: string;
    };
    stickerPack?: string;
    stickerId?: string;
  };
  reactions?: MessageReaction[];
  replyTo?: string;
  edited?: boolean;
  editedAt?: number;
}

export interface MessageReaction {
  userId: string;
  emoji: string;
  timestamp: number;
}

export interface Conversation {
  id: string;
  participants: string[];
  type: 'direct' | 'group' | 'prayer_circle';
  title?: string;
  description?: string;
  avatar?: string;
  lastMessage?: Message;
  lastActivity: number;
  unreadCount: number;
  isArchived: boolean;
  isMuted: boolean;
  settings: ConversationSettings;
  metadata?: {
    prayerTopic?: string;
    denomination?: string;
    language?: string;
    isBlessed?: boolean;
  };
}

export interface ConversationSettings {
  autoTranslate: boolean;
  targetLanguage: string;
  verseSharing: boolean;
  prayerRequests: boolean;
  voiceMessages: boolean;
  readReceipts: boolean;
  typing: boolean;
  notifications: boolean;
}

export interface VoiceCall {
  id: string;
  conversationId: string;
  participants: string[];
  type: 'voice' | 'video';
  status: 'ringing' | 'active' | 'ended' | 'missed' | 'declined';
  startTime: number;
  endTime?: number;
  duration?: number;
  quality: 'poor' | 'fair' | 'good' | 'excellent';
  prayerMode?: boolean;
}

export interface SpiritualSticker {
  id: string;
  packId: string;
  packName: string;
  category: 'blessing' | 'prayer' | 'worship' | 'encouragement' | 'celebration';
  imageUrl: string;
  keywords: string[];
  verse?: string;
}

export interface TranslationService {
  translate(text: string, targetLanguage: string, sourceLanguage?: string): Promise<string>;
  detectLanguage(text: string): Promise<string>;
  getSupportedLanguages(): string[];
}

export interface PrayerRequest {
  id: string;
  requesterId: string;
  title: string;
  description: string;
  category: 'personal' | 'family' | 'health' | 'work' | 'relationship' | 'community';
  urgency: 'low' | 'medium' | 'high' | 'urgent';
  isPrivate: boolean;
  prayedBy: string[];
  answeredBy?: string;
  answeredAt?: number;
  testimony?: string;
  createdAt: number;
  expiresAt?: number;
}

export class CommunicationSystem {
  private static readonly SPIRITUAL_STICKERS: SpiritualSticker[] = [
    {
      id: 'blessing_1',
      packId: 'blessings',
      packName: 'Bênçãos',
      category: 'blessing',
      imageUrl: 'https://images.pexels.com/photos/1671325/pexels-photo-1671325.jpeg',
      keywords: ['bênção', 'blessing', 'graça', 'favor'],
      verse: 'O Senhor te abençoe e te guarde. Números 6:24'
    },
    {
      id: 'prayer_1',
      packId: 'prayers',
      packName: 'Orações',
      category: 'prayer',
      imageUrl: 'https://images.pexels.com/photos/1671325/pexels-photo-1671325.jpeg',
      keywords: ['oração', 'prayer', 'intercessão', 'súplica'],
      verse: 'Orai sem cessar. 1 Tessalonicenses 5:17'
    },
    {
      id: 'worship_1',
      packId: 'worship',
      packName: 'Adoração',
      category: 'worship',
      imageUrl: 'https://images.pexels.com/photos/1671325/pexels-photo-1671325.jpeg',
      keywords: ['adoração', 'worship', 'louvor', 'praise'],
      verse: 'Cantai ao Senhor um cântico novo. Salmos 96:1'
    },
    {
      id: 'encouragement_1',
      packId: 'encouragement',
      packName: 'Encorajamento',
      category: 'encouragement',
      imageUrl: 'https://images.pexels.com/photos/1671325/pexels-photo-1671325.jpeg',
      keywords: ['encorajamento', 'encouragement', 'força', 'ânimo'],
      verse: 'Tudo posso naquele que me fortalece. Filipenses 4:13'
    },
    {
      id: 'celebration_1',
      packId: 'celebration',
      packName: 'Celebração',
      category: 'celebration',
      imageUrl: 'https://images.pexels.com/photos/1671325/pexels-photo-1671325.jpeg',
      keywords: ['celebração', 'celebration', 'alegria', 'vitória'],
      verse: 'Este é o dia que fez o Senhor; regozijemo-nos. Salmos 118:24'
    }
  ];

  private static readonly SUPPORTED_LANGUAGES = [
    'pt', 'en', 'es', 'fr', 'de', 'it', 'zh', 'ja', 'ko', 'ar', 'hi', 'ru'
  ];

  private static readonly VERSE_TEMPLATES = [
    {
      category: 'comfort',
      verses: [
        'Vinde a mim, todos os que estais cansados e oprimidos, e eu vos aliviarei. Mateus 11:28',
        'O Senhor é o meu pastor; nada me faltará. Salmos 23:1',
        'Não temas, porque eu sou contigo. Isaías 41:10'
      ]
    },
    {
      category: 'strength',
      verses: [
        'Tudo posso naquele que me fortalece. Filipenses 4:13',
        'O Senhor é a minha força e o meu escudo. Salmos 28:7',
        'Mas os que esperam no Senhor renovarão as suas forças. Isaías 40:31'
      ]
    },
    {
      category: 'love',
      verses: [
        'O amor é paciente, o amor é bondoso. 1 Coríntios 13:4',
        'Nisto conhecemos o amor: que Cristo deu a sua vida por nós. 1 João 3:16',
        'Amai-vos uns aos outros como eu vos amei. João 15:12'
      ]
    },
    {
      category: 'peace',
      verses: [
        'A paz vos deixo, a minha paz vos dou. João 14:27',
        'E a paz de Deus guardará os vossos corações. Filipenses 4:7',
        'Bem-aventurados os pacificadores. Mateus 5:9'
      ]
    }
  ];

  static createMessage(
    senderId: string,
    receiverId: string,
    conversationId: string,
    content: string,
    type: Message['type'] = 'text',
    metadata?: Message['metadata']
  ): Message {
    return {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      senderId,
      receiverId,
      conversationId,
      content,
      type,
      timestamp: Date.now(),
      status: 'sending',
      metadata,
      reactions: [],
      edited: false
    };
  }

  static createConversation(
    participants: string[],
    type: Conversation['type'] = 'direct',
    title?: string,
    metadata?: Conversation['metadata']
  ): Conversation {
    return {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      participants,
      type,
      title,
      lastActivity: Date.now(),
      unreadCount: 0,
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
      metadata
    };
  }

  static createVoiceCall(
    conversationId: string,
    participants: string[],
    type: VoiceCall['type'] = 'voice',
    prayerMode: boolean = false
  ): VoiceCall {
    return {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      conversationId,
      participants,
      type,
      status: 'ringing',
      startTime: Date.now(),
      quality: 'good',
      prayerMode
    };
  }

  static createPrayerRequest(
    requesterId: string,
    title: string,
    description: string,
    category: PrayerRequest['category'],
    urgency: PrayerRequest['urgency'] = 'medium',
    isPrivate: boolean = false
  ): PrayerRequest {
    return {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      requesterId,
      title,
      description,
      category,
      urgency,
      isPrivate,
      prayedBy: [],
      createdAt: Date.now(),
      expiresAt: Date.now() + (30 * 24 * 60 * 60 * 1000) // 30 days
    };
  }

  static getSpiritualStickers(category?: SpiritualSticker['category']): SpiritualSticker[] {
    if (category) {
      return this.SPIRITUAL_STICKERS.filter(sticker => sticker.category === category);
    }
    return this.SPIRITUAL_STICKERS;
  }

  static searchStickers(query: string): SpiritualSticker[] {
    const searchTerm = query.toLowerCase();
    return this.SPIRITUAL_STICKERS.filter(sticker =>
      sticker.keywords.some(keyword => keyword.toLowerCase().includes(searchTerm)) ||
      sticker.packName.toLowerCase().includes(searchTerm) ||
      (sticker.verse && sticker.verse.toLowerCase().includes(searchTerm))
    );
  }

  static getVerseByCategory(category: string): string {
    const template = this.VERSE_TEMPLATES.find(t => t.category === category);
    if (!template) return '';
    
    const randomIndex = Math.floor(Math.random() * template.verses.length);
    return template.verses[randomIndex];
  }

  static getRandomVerse(): string {
    const allVerses = this.VERSE_TEMPLATES.flatMap(template => template.verses);
    const randomIndex = Math.floor(Math.random() * allVerses.length);
    return allVerses[randomIndex];
  }

  static formatMessageTime(timestamp: number): string {
    const now = Date.now();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Agora';
    if (minutes < 60) return `${minutes}min`;
    if (hours < 24) return `${hours}h`;
    if (days < 7) return `${days}d`;
    
    return new Date(timestamp).toLocaleDateString();
  }

  static formatCallDuration(duration: number): string {
    const hours = Math.floor(duration / 3600);
    const minutes = Math.floor((duration % 3600) / 60);
    const seconds = duration % 60;

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }

  static validateMessage(message: Partial<Message>): boolean {
    return !!(
      message.senderId &&
      message.receiverId &&
      message.conversationId &&
      message.content &&
      message.type
    );
  }

  static sanitizeMessage(content: string): string {
    // Remove potentially harmful content
    return content
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/javascript:/gi, '')
      .trim();
  }

  static detectMessageIntent(content: string): {
    isPrayerRequest: boolean;
    isEncouragement: boolean;
    isQuestion: boolean;
    isTestimony: boolean;
    suggestedResponse?: string;
  } {
    const lowerContent = content.toLowerCase();
    
    const prayerKeywords = ['ore', 'oração', 'pray', 'prayer', 'interceda', 'preciso de oração'];
    const encouragementKeywords = ['triste', 'difícil', 'problema', 'ajuda', 'desanimado'];
    const questionKeywords = ['?', 'como', 'quando', 'onde', 'por que', 'qual'];
    const testimonyKeywords = ['deus respondeu', 'milagre', 'testemunho', 'benção', 'vitória'];

    const isPrayerRequest = prayerKeywords.some(keyword => lowerContent.includes(keyword));
    const isEncouragement = encouragementKeywords.some(keyword => lowerContent.includes(keyword));
    const isQuestion = questionKeywords.some(keyword => lowerContent.includes(keyword));
    const isTestimony = testimonyKeywords.some(keyword => lowerContent.includes(keyword));

    let suggestedResponse;
    if (isPrayerRequest) {
      suggestedResponse = 'Estarei orando por você! 🙏';
    } else if (isEncouragement) {
      suggestedResponse = 'Deus tem o melhor para você! Confie nEle. ❤️';
    } else if (isTestimony) {
      suggestedResponse = 'Glória a Deus! Que testemunho maravilhoso! 🙌';
    }

    return {
      isPrayerRequest,
      isEncouragement,
      isQuestion,
      isTestimony,
      suggestedResponse
    };
  }

  static generateConversationSummary(messages: Message[]): string {
    if (messages.length === 0) return 'Nenhuma mensagem';
    
    const recentMessages = messages.slice(-10);
    const prayerCount = recentMessages.filter(m => m.type === 'prayer').length;
    const verseCount = recentMessages.filter(m => m.type === 'verse').length;
    
    let summary = `${messages.length} mensagens`;
    if (prayerCount > 0) summary += `, ${prayerCount} orações`;
    if (verseCount > 0) summary += `, ${verseCount} versículos`;
    
    return summary;
  }

  static getSupportedLanguages(): string[] {
    return this.SUPPORTED_LANGUAGES;
  }

  static getLanguageName(code: string): string {
    const languages = {
      'pt': 'Português',
      'en': 'English',
      'es': 'Español',
      'fr': 'Français',
      'de': 'Deutsch',
      'it': 'Italiano',
      'zh': '中文',
      'ja': '日本語',
      'ko': '한국어',
      'ar': 'العربية',
      'hi': 'हिन्दी',
      'ru': 'Русский'
    };
    return languages[code] || code;
  }

  static createSystemMessage(
    conversationId: string,
    content: string,
    type: 'join' | 'leave' | 'prayer_answered' | 'blessing' | 'reminder'
  ): Message {
    return {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      senderId: 'system',
      receiverId: '',
      conversationId,
      content,
      type: 'text',
      timestamp: Date.now(),
      status: 'sent',
      metadata: { systemMessageType: type }
    };
  }

  static calculateMessagePriority(message: Message): 'low' | 'medium' | 'high' | 'urgent' {
    if (message.type === 'prayer') return 'high';
    if (message.metadata?.prayerCategory === 'urgent') return 'urgent';
    if (message.type === 'verse') return 'medium';
    
    const intent = this.detectMessageIntent(message.content);
    if (intent.isPrayerRequest) return 'high';
    if (intent.isEncouragement) return 'medium';
    
    return 'low';
  }
}

// Mock Translation Service Implementation
export class MockTranslationService implements TranslationService {
  private static readonly MOCK_TRANSLATIONS = {
    'pt-en': {
      'Olá': 'Hello',
      'Como você está?': 'How are you?',
      'Deus te abençoe': 'God bless you',
      'Estarei orando por você': 'I will pray for you',
      'Paz do Senhor': 'Peace of the Lord'
    },
    'en-pt': {
      'Hello': 'Olá',
      'How are you?': 'Como você está?',
      'God bless you': 'Deus te abençoe',
      'I will pray for you': 'Estarei orando por você',
      'Peace of the Lord': 'Paz do Senhor'
    }
  };

  async translate(text: string, targetLanguage: string, sourceLanguage: string = 'pt'): Promise<string> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const translationKey = `${sourceLanguage}-${targetLanguage}`;
    const translations = MockTranslationService.MOCK_TRANSLATIONS[translationKey];
    
    if (translations && translations[text]) {
      return translations[text];
    }
    
    // Return original text if no translation found
    return text;
  }

  async detectLanguage(text: string): Promise<string> {
    // Simple language detection based on common words
    const portugueseWords = ['o', 'a', 'de', 'que', 'e', 'do', 'da', 'em', 'um', 'para', 'é', 'com', 'não', 'uma', 'os'];
    const englishWords = ['the', 'of', 'and', 'a', 'to', 'in', 'is', 'you', 'that', 'it', 'he', 'was', 'for', 'on', 'are'];
    
    const words = text.toLowerCase().split(/\s+/);
    const portugueseMatches = words.filter(word => portugueseWords.includes(word)).length;
    const englishMatches = words.filter(word => englishWords.includes(word)).length;
    
    return portugueseMatches > englishMatches ? 'pt' : 'en';
  }

  getSupportedLanguages(): string[] {
    return CommunicationSystem.getSupportedLanguages();
  }
}