import { UserProfile } from './compatibilityAlgorithm';
import { PrayerRequest } from './spiritualContent';
import { SecurityProfile } from './securitySystem';

export interface AnalyticsData {
  userId: string;
  timestamp: number;
  sessionId: string;
  eventType: string;
  eventData: any;
  platform: 'ios' | 'android' | 'web';
  appVersion: string;
}

export interface UserInsight {
  id: string;
  userId: string;
  type: 'compatibility' | 'spiritual' | 'activity' | 'community' | 'security';
  title: string;
  description: string;
  data: any;
  recommendations: string[];
  verse?: string;
  createdAt: number;
  expiresAt?: number;
  priority: 'low' | 'medium' | 'high';
  isRead: boolean;
}

export interface AnalyticsDashboard {
  connectionStats: {
    totalConnections: number;
    newConnectionsThisWeek: number;
    connectionRate: number;
    topDenominations: Array<{name: string, count: number}>;
    connectionsByAge: Array<{range: string, count: number}>;
  };
  spiritualStats: {
    prayerMinutes: number;
    versesRead: number;
    prayerRequests: number;
    answeredPrayers: number;
    communityPrayers: number;
  };
  activityStats: {
    dailyActiveStreak: number;
    messagesExchanged: number;
    eventsAttended: number;
    profileViews: number;
    averageResponseTime: number;
  };
  communityStats: {
    communityRank: number;
    helpfulnessScore: number;
    testimoniesShared: number;
    prayerCircles: number;
  };
}

export interface ConnectionAnalytics {
  connectionId: string;
  users: [string, string];
  compatibilityScore: number;
  startDate: number;
  messageCount: number;
  callMinutes: number;
  prayersTogether: number;
  lastInteraction: number;
  status: 'active' | 'inactive' | 'blessed' | 'ended';
  healthScore: number;
  insights: UserInsight[];
}

export interface CommunityAnalytics {
  totalUsers: number;
  activeUsers: {
    daily: number;
    weekly: number;
    monthly: number;
  };
  demographics: {
    ageGroups: Array<{range: string, percentage: number}>;
    genderDistribution: Array<{gender: string, percentage: number}>;
    topDenominations: Array<{name: string, percentage: number}>;
    topLocations: Array<{location: string, percentage: number}>;
  };
  engagement: {
    averageSessionDuration: number;
    averageSessionsPerUser: number;
    retentionRate: number;
    churnRate: number;
  };
  spiritual: {
    totalPrayerMinutes: number;
    totalPrayerRequests: number;
    answeredPrayerPercentage: number;
    averageDailyVerseReads: number;
  };
}

export class AnalyticsSystem {
  private static readonly INSIGHT_TEMPLATES = {
    compatibility: [
      {
        title: 'Compatibilidade Espiritual',
        description: 'Suas conexões mostram forte alinhamento em valores espirituais',
        recommendations: [
          'Continue priorizando a fé em seus relacionamentos',
          'Compartilhe mais sobre sua jornada espiritual',
          'Participe de eventos religiosos com suas conexões'
        ],
        verse: 'Melhor é serem dois do que um, porque têm melhor paga do seu trabalho. Eclesiastes 4:9'
      },
      {
        title: 'Oportunidade de Crescimento',
        description: 'Suas conexões têm diferentes perspectivas denominacionais',
        recommendations: [
          'Aprenda mais sobre outras denominações cristãs',
          'Foque nos valores fundamentais compartilhados',
          'Participe de discussões teológicas respeitosas'
        ],
        verse: 'Examinai tudo. Retende o bem. 1 Tessalonicenses 5:21'
      }
    ],
    spiritual: [
      {
        title: 'Crescimento na Oração',
        description: 'Seu tempo de oração aumentou significativamente',
        recommendations: [
          'Experimente diferentes tipos de oração',
          'Convide conexões para momentos de oração conjunta',
          'Compartilhe testemunhos de orações respondidas'
        ],
        verse: 'Orai sem cessar. 1 Tessalonicenses 5:17'
      },
      {
        title: 'Aprofundamento na Palavra',
        description: 'Você tem sido consistente na leitura da Palavra',
        recommendations: [
          'Compartilhe versículos favoritos com suas conexões',
          'Participe de estudos bíblicos em grupo',
          'Aplique os ensinamentos em suas conversas'
        ],
        verse: 'Lâmpada para os meus pés é a tua palavra. Salmos 119:105'
      }
    ],
    activity: [
      {
        title: 'Padrão de Comunicação',
        description: 'Você tende a ser mais ativo nas conversas durante a noite',
        recommendations: [
          'Verifique se suas conexões preferem horários similares',
          'Considere diversificar seus horários de comunicação',
          'Use recursos de mensagens programadas quando apropriado'
        ],
        verse: 'Para tudo há um tempo determinado. Eclesiastes 3:1'
      },
      {
        title: 'Engajamento Consistente',
        description: 'Você mantém conversas regulares com suas conexões',
        recommendations: [
          'Continue cultivando relacionamentos significativos',
          'Aprofunde conversas com perguntas sobre fé e valores',
          'Considere chamadas de vídeo para fortalecer conexões'
        ],
        verse: 'O ferro com o ferro se afia; assim, o homem afia o rosto do seu amigo. Provérbios 27:17'
      }
    ],
    community: [
      {
        title: 'Impacto na Comunidade',
        description: 'Suas orações têm ajudado muitos membros da comunidade',
        recommendations: [
          'Continue intercedendo pelos pedidos da comunidade',
          'Considere iniciar um círculo de oração',
          'Compartilhe testemunhos para encorajar outros'
        ],
        verse: 'Levai as cargas uns dos outros. Gálatas 6:2'
      },
      {
        title: 'Oportunidade de Liderança',
        description: 'Seu perfil mostra potencial para liderança comunitária',
        recommendations: [
          'Considere organizar eventos virtuais',
          'Ofereça mentoria espiritual para novos membros',
          'Compartilhe recursos e estudos com a comunidade'
        ],
        verse: 'Apascenta as minhas ovelhas. João 21:17'
      }
    ],
    security: [
      {
        title: 'Perfil Confiável',
        description: 'Seu perfil demonstra alto nível de confiabilidade',
        recommendations: [
          'Continue mantendo práticas seguras',
          'Considere verificações adicionais',
          'Ajude outros a entenderem a importância da segurança'
        ],
        verse: 'O homem de bem tira o bem do bom tesouro do seu coração. Lucas 6:45'
      },
      {
        title: 'Oportunidade de Verificação',
        description: 'Verificações adicionais podem aumentar sua credibilidade',
        recommendations: [
          'Complete a verificação de igreja',
          'Obtenha referências da comunidade',
          'Mantenha suas informações atualizadas'
        ],
        verse: 'Tudo o que é verdadeiro, tudo o que é honesto, tudo o que é justo, tudo o que é puro, tudo o que é amável, tudo o que é de boa fama, se há alguma virtude, e se há algum louvor, nisso pensai. Filipenses 4:8'
      }
    ]
  };

  static trackEvent(
    userId: string,
    eventType: string,
    eventData: any,
    platform: 'ios' | 'android' | 'web',
    appVersion: string
  ): AnalyticsData {
    const event: AnalyticsData = {
      userId,
      timestamp: Date.now(),
      sessionId: this.generateSessionId(userId),
      eventType,
      eventData,
      platform,
      appVersion
    };

    // In a real implementation, this would send the event to an analytics service
    console.log('Tracking event:', event);
    
    return event;
  }

  private static generateSessionId(userId: string): string {
    return `${userId}_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  }

  static generateUserInsights(
    userId: string,
    profile: UserProfile,
    securityProfile: SecurityProfile,
    connections: any[],
    prayerActivity: any[],
    messageActivity: any[]
  ): UserInsight[] {
    const insights: UserInsight[] = [];
    
    // Generate compatibility insights
    if (connections.length > 0) {
      const compatibilityTemplate = this.INSIGHT_TEMPLATES.compatibility[
        Math.floor(Math.random() * this.INSIGHT_TEMPLATES.compatibility.length)
      ];
      
      insights.push({
        id: `compatibility_${Date.now()}`,
        userId,
        type: 'compatibility',
        title: compatibilityTemplate.title,
        description: compatibilityTemplate.description,
        data: {
          connections: connections.length,
          averageCompatibility: this.calculateAverageCompatibility(connections)
        },
        recommendations: compatibilityTemplate.recommendations,
        verse: compatibilityTemplate.verse,
        createdAt: Date.now(),
        priority: 'medium',
        isRead: false
      });
    }
    
    // Generate spiritual insights
    if (prayerActivity.length > 0) {
      const spiritualTemplate = this.INSIGHT_TEMPLATES.spiritual[
        Math.floor(Math.random() * this.INSIGHT_TEMPLATES.spiritual.length)
      ];
      
      insights.push({
        id: `spiritual_${Date.now()}`,
        userId,
        type: 'spiritual',
        title: spiritualTemplate.title,
        description: spiritualTemplate.description,
        data: {
          prayerMinutes: this.calculateTotalPrayerMinutes(prayerActivity),
          prayerRequests: prayerActivity.filter(a => a.type === 'prayer_request').length
        },
        recommendations: spiritualTemplate.recommendations,
        verse: spiritualTemplate.verse,
        createdAt: Date.now(),
        priority: 'high',
        isRead: false
      });
    }
    
    // Generate activity insights
    if (messageActivity.length > 0) {
      const activityTemplate = this.INSIGHT_TEMPLATES.activity[
        Math.floor(Math.random() * this.INSIGHT_TEMPLATES.activity.length)
      ];
      
      insights.push({
        id: `activity_${Date.now()}`,
        userId,
        type: 'activity',
        title: activityTemplate.title,
        description: activityTemplate.description,
        data: {
          messageCount: messageActivity.length,
          responseTime: this.calculateAverageResponseTime(messageActivity)
        },
        recommendations: activityTemplate.recommendations,
        verse: activityTemplate.verse,
        createdAt: Date.now(),
        priority: 'low',
        isRead: false
      });
    }
    
    // Generate security insights
    const securityTemplate = this.INSIGHT_TEMPLATES.security[
      securityProfile.trustScore > 70 ? 0 : 1
    ];
    
    insights.push({
      id: `security_${Date.now()}`,
      userId,
      type: 'security',
      title: securityTemplate.title,
      description: securityTemplate.description,
      data: {
        trustScore: securityProfile.trustScore,
        verificationLevel: securityProfile.verificationLevel
      },
      recommendations: securityTemplate.recommendations,
      verse: securityTemplate.verse,
      createdAt: Date.now(),
      priority: securityProfile.trustScore < 50 ? 'high' : 'medium',
      isRead: false
    });
    
    return insights;
  }

  private static calculateAverageCompatibility(connections: any[]): number {
    if (connections.length === 0) return 0;
    
    const sum = connections.reduce((total, conn) => total + (conn.compatibilityScore || 0), 0);
    return Math.round(sum / connections.length);
  }

  private static calculateTotalPrayerMinutes(prayerActivity: any[]): number {
    return prayerActivity.reduce((total, activity) => {
      if (activity.type === 'prayer_session') {
        return total + (activity.duration || 0);
      }
      return total;
    }, 0);
  }

  private static calculateAverageResponseTime(messageActivity: any[]): number {
    const responseTimes: number[] = [];
    
    for (let i = 1; i < messageActivity.length; i++) {
      const current = messageActivity[i];
      const previous = messageActivity[i - 1];
      
      if (current.senderId !== previous.senderId) {
        responseTimes.push(current.timestamp - previous.timestamp);
      }
    }
    
    if (responseTimes.length === 0) return 0;
    
    const sum = responseTimes.reduce((total, time) => total + time, 0);
    return Math.round(sum / responseTimes.length / 1000 / 60); // Convert to minutes
  }

  static generateUserDashboard(
    userId: string,
    connections: any[],
    spiritualActivity: any[],
    messageActivity: any[],
    communityActivity: any[]
  ): AnalyticsDashboard {
    // Connection stats
    const connectionStats = {
      totalConnections: connections.length,
      newConnectionsThisWeek: connections.filter(c => 
        (Date.now() - c.startDate) < 7 * 24 * 60 * 60 * 1000
      ).length,
      connectionRate: this.calculateConnectionRate(connections),
      topDenominations: this.getTopDenominations(connections),
      connectionsByAge: this.getConnectionsByAge(connections)
    };
    
    // Spiritual stats
    const spiritualStats = {
      prayerMinutes: this.calculateTotalPrayerMinutes(spiritualActivity),
      versesRead: spiritualActivity.filter(a => a.type === 'verse_read').length,
      prayerRequests: spiritualActivity.filter(a => a.type === 'prayer_request').length,
      answeredPrayers: spiritualActivity.filter(a => a.type === 'prayer_answered').length,
      communityPrayers: spiritualActivity.filter(a => a.type === 'community_prayer').length
    };
    
    // Activity stats
    const activityStats = {
      dailyActiveStreak: this.calculateActiveStreak(messageActivity),
      messagesExchanged: messageActivity.length,
      eventsAttended: communityActivity.filter(a => a.type === 'event_attended').length,
      profileViews: communityActivity.filter(a => a.type === 'profile_viewed').length,
      averageResponseTime: this.calculateAverageResponseTime(messageActivity)
    };
    
    // Community stats
    const communityStats = {
      communityRank: this.calculateCommunityRank(communityActivity),
      helpfulnessScore: this.calculateHelpfulnessScore(communityActivity),
      testimoniesShared: communityActivity.filter(a => a.type === 'testimony_shared').length,
      prayerCircles: communityActivity.filter(a => a.type === 'prayer_circle').length
    };
    
    return {
      connectionStats,
      spiritualStats,
      activityStats,
      communityStats
    };
  }

  private static calculateConnectionRate(connections: any[]): number {
    // In a real implementation, this would calculate the rate of successful connections
    // out of total profile views or interactions
    return Math.round(Math.random() * 50 + 30); // Mock: 30-80%
  }

  private static getTopDenominations(connections: any[]): Array<{name: string, count: number}> {
    const denominations = connections.map(c => c.denomination);
    const counts = {};
    
    denominations.forEach(d => {
      counts[d] = (counts[d] || 0) + 1;
    });
    
    return Object.entries(counts)
      .map(([name, count]) => ({ name, count: count as number }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  }

  private static getConnectionsByAge(connections: any[]): Array<{range: string, count: number}> {
    const ageRanges = {
      '18-24': 0,
      '25-30': 0,
      '31-40': 0,
      '41-50': 0,
      '51+': 0
    };
    
    connections.forEach(c => {
      const age = c.age || 30; // Default to 30 if age is not available
      
      if (age <= 24) ageRanges['18-24']++;
      else if (age <= 30) ageRanges['25-30']++;
      else if (age <= 40) ageRanges['31-40']++;
      else if (age <= 50) ageRanges['41-50']++;
      else ageRanges['51+']++;
    });
    
    return Object.entries(ageRanges)
      .map(([range, count]) => ({ range, count }));
  }

  private static calculateActiveStreak(messageActivity: any[]): number {
    if (messageActivity.length === 0) return 0;
    
    // Group messages by day
    const messagesByDay = {};
    messageActivity.forEach(msg => {
      const date = new Date(msg.timestamp).toDateString();
      messagesByDay[date] = true;
    });
    
    // Calculate streak
    let streak = 0;
    const today = new Date().toDateString();
    let currentDate = new Date();
    
    while (messagesByDay[currentDate.toDateString()]) {
      streak++;
      currentDate.setDate(currentDate.getDate() - 1);
      
      // Limit to reasonable number to prevent infinite loops
      if (streak > 365) break;
    }
    
    return streak;
  }

  private static calculateCommunityRank(communityActivity: any[]): number {
    // In a real implementation, this would calculate rank based on activity and impact
    // For now, we'll use a simple algorithm based on activity count and types
    
    const activityPoints = communityActivity.reduce((total, activity) => {
      switch (activity.type) {
        case 'prayer_circle': return total + 5;
        case 'testimony_shared': return total + 3;
        case 'event_attended': return total + 2;
        case 'community_prayer': return total + 1;
        default: return total;
      }
    }, 0);
    
    // Rank from 1-100
    return Math.min(100, Math.max(1, Math.round(activityPoints / 2)));
  }

  private static calculateHelpfulnessScore(communityActivity: any[]): number {
    // Calculate helpfulness based on prayers, encouragements, and other supportive actions
    
    const helpfulActions = communityActivity.filter(a => 
      ['community_prayer', 'encouragement_sent', 'testimony_shared', 'prayer_circle'].includes(a.type)
    ).length;
    
    // Score from 0-100
    return Math.min(100, Math.round(helpfulActions * 5));
  }

  static generateConnectionInsights(connection: ConnectionAnalytics): UserInsight[] {
    const insights: UserInsight[] = [];
    
    // Health score insight
    if (connection.healthScore < 50) {
      insights.push({
        id: `connection_health_${Date.now()}`,
        userId: connection.users[0], // Primary user
        type: 'activity',
        title: 'Oportunidade de Fortalecimento',
        description: 'Esta conexão pode se beneficiar de mais interação e comunicação',
        data: {
          connectionId: connection.connectionId,
          healthScore: connection.healthScore,
          lastInteraction: connection.lastInteraction
        },
        recommendations: [
          'Inicie uma conversa significativa sobre fé',
          'Compartilhe um versículo que tenha impactado você recentemente',
          'Convide para um momento de oração conjunto'
        ],
        verse: 'O ferro com o ferro se afia; assim, o homem afia o rosto do seu amigo. Provérbios 27:17',
        createdAt: Date.now(),
        priority: 'high',
        isRead: false
      });
    }
    
    // Prayer insight
    if (connection.prayersTogether < 3 && connection.messageCount > 20) {
      insights.push({
        id: `connection_prayer_${Date.now()}`,
        userId: connection.users[0], // Primary user
        type: 'spiritual',
        title: 'Oportunidade de Oração',
        description: 'Fortaleça esta conexão através da oração conjunta',
        data: {
          connectionId: connection.connectionId,
          prayersTogether: connection.prayersTogether
        },
        recommendations: [
          'Inicie uma chamada de oração',
          'Compartilhe um pedido de oração pessoal',
          'Crie um círculo de oração com esta conexão'
        ],
        verse: 'Onde estiverem dois ou três reunidos em meu nome, ali estou no meio deles. Mateus 18:20',
        createdAt: Date.now(),
        priority: 'medium',
        isRead: false
      });
    }
    
    return insights;
  }

  static generateCommunityAnalytics(): CommunityAnalytics {
    // In a real implementation, this would analyze actual community data
    // For now, we'll generate mock data
    
    return {
      totalUsers: 5842,
      activeUsers: {
        daily: 1245,
        weekly: 3421,
        monthly: 4876
      },
      demographics: {
        ageGroups: [
          { range: '18-24', percentage: 22 },
          { range: '25-34', percentage: 38 },
          { range: '35-44', percentage: 25 },
          { range: '45-54', percentage: 10 },
          { range: '55+', percentage: 5 }
        ],
        genderDistribution: [
          { gender: 'Feminino', percentage: 58 },
          { gender: 'Masculino', percentage: 42 }
        ],
        topDenominations: [
          { name: 'Batista', percentage: 28 },
          { name: 'Católica', percentage: 22 },
          { name: 'Presbiteriana', percentage: 15 },
          { name: 'Pentecostal', percentage: 12 },
          { name: 'Adventista', percentage: 8 }
        ],
        topLocations: [
          { location: 'São Paulo', percentage: 25 },
          { location: 'Rio de Janeiro', percentage: 18 },
          { location: 'Belo Horizonte', percentage: 12 },
          { location: 'Brasília', percentage: 8 },
          { location: 'Salvador', percentage: 7 }
        ]
      },
      engagement: {
        averageSessionDuration: 12.5, // minutes
        averageSessionsPerUser: 4.2, // per week
        retentionRate: 68, // percentage
        churnRate: 32 // percentage
      },
      spiritual: {
        totalPrayerMinutes: 128450,
        totalPrayerRequests: 3842,
        answeredPrayerPercentage: 62,
        averageDailyVerseReads: 2.3
      }
    };
  }

  static generatePrayerAnalytics(prayerRequests: PrayerRequest[]): {
    totalRequests: number;
    answeredRequests: number;
    answeredPercentage: number;
    averagePrayerCount: number;
    topCategories: Array<{category: string, count: number}>;
    prayerTrends: Array<{date: string, count: number}>;
    testimonies: number;
  } {
    // Calculate prayer statistics
    const totalRequests = prayerRequests.length;
    const answeredRequests = prayerRequests.filter(req => req.answered).length;
    const answeredPercentage = totalRequests > 0 ? Math.round((answeredRequests / totalRequests) * 100) : 0;
    
    const totalPrayers = prayerRequests.reduce((sum, req) => sum + req.prayedBy.length, 0);
    const averagePrayerCount = totalRequests > 0 ? Math.round(totalPrayers / totalRequests) : 0;
    
    // Get top categories
    const categories = {};
    prayerRequests.forEach(req => {
      categories[req.category] = (categories[req.category] || 0) + 1;
    });
    
    const topCategories = Object.entries(categories)
      .map(([category, count]) => ({ category, count: count as number }))
      .sort((a, b) => b.count - a.count);
    
    // Generate prayer trends (last 7 days)
    const prayerTrends = [];
    const now = Date.now();
    for (let i = 6; i >= 0; i--) {
      const date = new Date(now - (i * 24 * 60 * 60 * 1000));
      const dateString = date.toISOString().split('T')[0];
      
      const count = prayerRequests.filter(req => {
        const reqDate = new Date(req.requestedAt).toISOString().split('T')[0];
        return reqDate === dateString;
      }).length;
      
      prayerTrends.push({ date: dateString, count });
    }
    
    // Count testimonies
    const testimonies = prayerRequests.filter(req => req.answered && req.testimony).length;
    
    return {
      totalRequests,
      answeredRequests,
      answeredPercentage,
      averagePrayerCount,
      topCategories,
      prayerTrends,
      testimonies
    };
  }

  static generateConnectionRecommendations(
    userProfile: UserProfile,
    connections: any[],
    insights: UserInsight[]
  ): {
    title: string;
    description: string;
    actionType: 'message' | 'prayer' | 'verse' | 'call';
    priority: 'low' | 'medium' | 'high';
    connectionId: string;
    verse?: string;
  }[] {
    const recommendations = [];
    
    // Find connections that need attention
    const inactiveConnections = connections.filter(c => 
      Date.now() - c.lastInteraction > 7 * 24 * 60 * 60 * 1000
    );
    
    if (inactiveConnections.length > 0) {
      const connection = inactiveConnections[0];
      recommendations.push({
        title: 'Reconectar',
        description: `Faz uma semana desde sua última conversa com ${connection.name}`,
        actionType: 'message',
        priority: 'medium',
        connectionId: connection.id,
        verse: 'Não deixemos de congregar-nos, como é costume de alguns. Hebreus 10:25'
      });
    }
    
    // Find connections with low prayer count
    const lowPrayerConnections = connections.filter(c => c.prayersTogether < 2 && c.messageCount > 15);
    
    if (lowPrayerConnections.length > 0) {
      const connection = lowPrayerConnections[0];
      recommendations.push({
        title: 'Momento de Oração',
        description: `Fortaleça sua conexão com ${connection.name} através da oração`,
        actionType: 'prayer',
        priority: 'high',
        connectionId: connection.id,
        verse: 'Orai uns pelos outros. Tiago 5:16'
      });
    }
    
    // Find connections with high compatibility but low interaction
    const highCompatibilityConnections = connections.filter(c => 
      c.compatibilityScore > 80 && c.messageCount < 10
    );
    
    if (highCompatibilityConnections.length > 0) {
      const connection = highCompatibilityConnections[0];
      recommendations.push({
        title: 'Conexão Promissora',
        description: `Você e ${connection.name} têm ${connection.compatibilityScore}% de compatibilidade`,
        actionType: 'call',
        priority: 'high',
        connectionId: connection.id,
        verse: 'O amor nunca falha. 1 Coríntios 13:8'
      });
    }
    
    return recommendations;
  }

  static generateSpiritualInsights(
    prayerActivity: any[],
    verseActivity: any[],
    prayerRequests: PrayerRequest[]
  ): UserInsight[] {
    const insights: UserInsight[] = [];
    
    // Prayer pattern insights
    const prayerTimes = prayerActivity.map(a => new Date(a.timestamp).getHours());
    const morningPrayers = prayerTimes.filter(hour => hour >= 5 && hour < 12).length;
    const eveningPrayers = prayerTimes.filter(hour => hour >= 18 && hour < 22).length;
    
    const preferredTime = morningPrayers > eveningPrayers ? 'manhã' : 'noite';
    
    insights.push({
      id: `prayer_pattern_${Date.now()}`,
      userId: 'current_user',
      type: 'spiritual',
      title: 'Seu Padrão de Oração',
      description: `Você tende a orar mais durante a ${preferredTime}`,
      data: {
        morningPrayers,
        eveningPrayers,
        totalPrayers: prayerActivity.length
      },
      recommendations: [
        'Experimente orar em diferentes momentos do dia',
        'Crie lembretes para momentos de oração',
        'Considere um diário de oração para acompanhar seu progresso'
      ],
      verse: 'De tarde, e de manhã, e ao meio-dia orarei; e clamarei, e ele ouvirá a minha voz. Salmos 55:17',
      createdAt: Date.now(),
      priority: 'medium',
      isRead: false
    });
    
    // Verse reading insights
    if (verseActivity.length > 0) {
      const verseCategories = verseActivity.map(a => a.category);
      const categoryCounts = {};
      
      verseCategories.forEach(category => {
        categoryCounts[category] = (categoryCounts[category] || 0) + 1;
      });
      
      const topCategory = Object.entries(categoryCounts)
        .sort(([,a], [,b]) => (b as number) - (a as number))[0][0];
      
      const categoryNames = {
        'comfort': 'conforto',
        'strength': 'força',
        'love': 'amor',
        'peace': 'paz',
        'wisdom': 'sabedoria',
        'faith': 'fé'
      };
      
      insights.push({
        id: `verse_preference_${Date.now()}`,
        userId: 'current_user',
        type: 'spiritual',
        title: 'Sua Preferência Bíblica',
        description: `Você tem buscado mais versículos sobre ${categoryNames[topCategory] || topCategory}`,
        data: {
          topCategory,
          readCount: verseActivity.length
        },
        recommendations: [
          'Explore versículos de outras categorias para crescimento equilibrado',
          'Compartilhe versículos favoritos com suas conexões',
          'Considere um estudo bíblico focado em sua área de interesse'
        ],
        verse: 'Toda Escritura é divinamente inspirada e proveitosa. 2 Timóteo 3:16',
        createdAt: Date.now(),
        priority: 'low',
        isRead: false
      });
    }
    
    // Prayer request insights
    if (prayerRequests.length > 0) {
      const answeredCount = prayerRequests.filter(req => req.answered).length;
      const answeredPercentage = Math.round((answeredCount / prayerRequests.length) * 100);
      
      if (answeredCount > 0) {
        insights.push({
          id: `prayer_testimony_${Date.now()}`,
          userId: 'current_user',
          type: 'spiritual',
          title: 'Testemunho de Orações',
          description: `${answeredPercentage}% de suas orações foram respondidas`,
          data: {
            totalRequests: prayerRequests.length,
            answeredRequests: answeredCount,
            answeredPercentage
          },
          recommendations: [
            'Compartilhe testemunhos de orações respondidas',
            'Agradeça a Deus pelas respostas recebidas',
            'Continue perseverando em oração pelos pedidos pendentes'
          ],
          verse: 'E tudo quanto pedirdes em oração, crendo, recebereis. Mateus 21:22',
          createdAt: Date.now(),
          priority: 'high',
          isRead: false
        });
      }
    }
    
    return insights;
  }
}