import { UserProfile } from './compatibilityAlgorithm';
import { PrayerRequest } from './spiritualContent';

export interface SocialPost {
  id: string;
  userId: string;
  content: string;
  mediaUrls?: string[];
  type: 'testimony' | 'prayer' | 'verse' | 'event' | 'general';
  visibility: 'public' | 'connections' | 'private';
  tags: string[];
  location?: {
    name: string;
    coordinates?: {
      latitude: number;
      longitude: number;
    }
  };
  likes: string[];
  comments: SocialComment[];
  shares: number;
  prayerCount: number;
  createdAt: number;
  updatedAt?: number;
  verse?: {
    text: string;
    reference: string;
  };
  eventDetails?: {
    title: string;
    date: number;
    location: string;
    description: string;
  };
}

export interface SocialComment {
  id: string;
  userId: string;
  content: string;
  likes: string[];
  createdAt: number;
  updatedAt?: number;
  replyTo?: string;
  isBlessed?: boolean;
}

export interface SocialGroup {
  id: string;
  name: string;
  description: string;
  type: 'prayer' | 'study' | 'interest' | 'church' | 'event';
  privacy: 'public' | 'private' | 'secret';
  coverImage?: string;
  adminIds: string[];
  memberIds: string[];
  pendingMemberIds: string[];
  posts: string[];
  createdAt: number;
  updatedAt?: number;
  rules?: string[];
  tags: string[];
  churchDetails?: {
    denomination: string;
    location: string;
    website?: string;
    pastorName?: string;
  };
  studyDetails?: {
    topic: string;
    schedule: string;
    materials?: string[];
  };
  eventDetails?: {
    date: number;
    location: string;
    recurring?: boolean;
    frequency?: 'daily' | 'weekly' | 'monthly';
  };
}

export interface SocialEvent {
  id: string;
  title: string;
  description: string;
  type: 'worship' | 'conference' | 'study' | 'outreach' | 'fellowship' | 'prayer';
  startDate: number;
  endDate: number;
  location: {
    name: string;
    address?: string;
    coordinates?: {
      latitude: number;
      longitude: number;
    }
  };
  organizerId: string;
  coverImage?: string;
  attendeeIds: string[];
  interestedIds: string[];
  invitedIds: string[];
  visibility: 'public' | 'connections' | 'private' | 'group';
  groupId?: string;
  tags: string[];
  createdAt: number;
  updatedAt?: number;
  recurring?: boolean;
  frequency?: 'daily' | 'weekly' | 'monthly';
  prayerRequests?: string[];
  testimonies?: string[];
}

export interface SocialProfile {
  userId: string;
  displayName: string;
  bio: string;
  profilePicture?: string;
  coverImage?: string;
  denomination: string;
  church?: string;
  location: {
    city: string;
    state: string;
  };
  interests: string[];
  favoriteVerse?: {
    text: string;
    reference: string;
  };
  testimonySummary?: string;
  ministries?: string[];
  spiritualGifts?: string[];
  followersCount: number;
  followingCount: number;
  postsCount: number;
  groupsCount: number;
  eventsCount: number;
  prayerCount: number;
  isVerified: boolean;
  isBaptized?: boolean;
  baptismDate?: number;
  conversionDate?: number;
  privacySettings: {
    showFollowers: boolean;
    showFollowing: boolean;
    showGroups: boolean;
    showEvents: boolean;
    showPrayerRequests: boolean;
    showTestimonies: boolean;
  };
}

export interface SocialNotification {
  id: string;
  userId: string;
  type: 'like' | 'comment' | 'follow' | 'prayer' | 'event' | 'group' | 'testimony' | 'mention';
  sourceId: string;
  sourceType: 'post' | 'comment' | 'profile' | 'event' | 'group' | 'prayer';
  actorId: string;
  content: string;
  read: boolean;
  createdAt: number;
  data?: any;
}

export interface SocialFeed {
  posts: SocialPost[];
  hasMore: boolean;
  nextCursor?: string;
}

export class SocialSystem {
  static createPost(
    userId: string,
    content: string,
    type: SocialPost['type'] = 'general',
    visibility: SocialPost['visibility'] = 'public',
    tags: string[] = [],
    mediaUrls: string[] = [],
    location?: SocialPost['location'],
    verse?: SocialPost['verse'],
    eventDetails?: SocialPost['eventDetails']
  ): SocialPost {
    return {
      id: `post_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
      userId,
      content,
      mediaUrls,
      type,
      visibility,
      tags,
      location,
      likes: [],
      comments: [],
      shares: 0,
      prayerCount: 0,
      createdAt: Date.now(),
      verse,
      eventDetails
    };
  }

  static createComment(
    userId: string,
    postId: string,
    content: string,
    replyTo?: string
  ): SocialComment {
    return {
      id: `comment_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
      userId,
      content,
      likes: [],
      createdAt: Date.now(),
      replyTo
    };
  }

  static createGroup(
    name: string,
    description: string,
    type: SocialGroup['type'],
    privacy: SocialGroup['privacy'],
    adminIds: string[],
    tags: string[] = [],
    coverImage?: string,
    churchDetails?: SocialGroup['churchDetails'],
    studyDetails?: SocialGroup['studyDetails'],
    eventDetails?: SocialGroup['eventDetails']
  ): SocialGroup {
    return {
      id: `group_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
      name,
      description,
      type,
      privacy,
      coverImage,
      adminIds,
      memberIds: [...adminIds],
      pendingMemberIds: [],
      posts: [],
      createdAt: Date.now(),
      tags,
      churchDetails,
      studyDetails,
      eventDetails
    };
  }

  static createEvent(
    title: string,
    description: string,
    type: SocialEvent['type'],
    startDate: number,
    endDate: number,
    location: SocialEvent['location'],
    organizerId: string,
    visibility: SocialEvent['visibility'] = 'public',
    tags: string[] = [],
    coverImage?: string,
    groupId?: string,
    recurring?: boolean,
    frequency?: SocialEvent['frequency']
  ): SocialEvent {
    return {
      id: `event_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
      title,
      description,
      type,
      startDate,
      endDate,
      location,
      organizerId,
      coverImage,
      attendeeIds: [organizerId],
      interestedIds: [],
      invitedIds: [],
      visibility,
      groupId,
      tags,
      createdAt: Date.now(),
      recurring,
      frequency
    };
  }

  static createSocialProfile(
    userId: string,
    userProfile: UserProfile
  ): SocialProfile {
    return {
      userId,
      displayName: userProfile.name,
      bio: userProfile.aboutMe,
      denomination: userProfile.denomination,
      location: {
        city: userProfile.location.city,
        state: userProfile.location.state
      },
      interests: userProfile.interests,
      favoriteVerse: userProfile.verse ? {
        text: userProfile.verse.split(' - ')[0],
        reference: userProfile.verse.split(' - ')[1] || ''
      } : undefined,
      followersCount: 0,
      followingCount: 0,
      postsCount: 0,
      groupsCount: 0,
      eventsCount: 0,
      prayerCount: 0,
      isVerified: false,
      privacySettings: {
        showFollowers: true,
        showFollowing: true,
        showGroups: true,
        showEvents: true,
        showPrayerRequests: true,
        showTestimonies: true
      }
    };
  }

  static createNotification(
    userId: string,
    type: SocialNotification['type'],
    sourceId: string,
    sourceType: SocialNotification['sourceType'],
    actorId: string,
    content: string,
    data?: any
  ): SocialNotification {
    return {
      id: `notification_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
      userId,
      type,
      sourceId,
      sourceType,
      actorId,
      content,
      read: false,
      createdAt: Date.now(),
      data
    };
  }

  static likePost(post: SocialPost, userId: string): SocialPost {
    if (post.likes.includes(userId)) {
      // Unlike
      return {
        ...post,
        likes: post.likes.filter(id => id !== userId)
      };
    } else {
      // Like
      return {
        ...post,
        likes: [...post.likes, userId]
      };
    }
  }

  static addComment(post: SocialPost, comment: SocialComment): SocialPost {
    return {
      ...post,
      comments: [...post.comments, comment]
    };
  }

  static prayForPost(post: SocialPost): SocialPost {
    return {
      ...post,
      prayerCount: post.prayerCount + 1
    };
  }

  static sharePost(post: SocialPost): SocialPost {
    return {
      ...post,
      shares: post.shares + 1
    };
  }

  static joinGroup(group: SocialGroup, userId: string, requiresApproval: boolean = false): SocialGroup {
    if (group.memberIds.includes(userId)) {
      return group;
    }

    if (requiresApproval) {
      return {
        ...group,
        pendingMemberIds: [...group.pendingMemberIds, userId]
      };
    } else {
      return {
        ...group,
        memberIds: [...group.memberIds, userId]
      };
    }
  }

  static leaveGroup(group: SocialGroup, userId: string): SocialGroup {
    return {
      ...group,
      memberIds: group.memberIds.filter(id => id !== userId),
      adminIds: group.adminIds.filter(id => id !== userId)
    };
  }

  static approveGroupMember(group: SocialGroup, userId: string): SocialGroup {
    if (!group.pendingMemberIds.includes(userId)) {
      return group;
    }

    return {
      ...group,
      memberIds: [...group.memberIds, userId],
      pendingMemberIds: group.pendingMemberIds.filter(id => id !== userId)
    };
  }

  static attendEvent(event: SocialEvent, userId: string): SocialEvent {
    if (event.attendeeIds.includes(userId)) {
      return event;
    }

    return {
      ...group,
      attendeeIds: [...event.attendeeIds, userId],
      interestedIds: event.interestedIds.filter(id => id !== userId)
    };
  }

  static markInterestedInEvent(event: SocialEvent, userId: string): SocialEvent {
    if (event.interestedIds.includes(userId) || event.attendeeIds.includes(userId)) {
      return event;
    }

    return {
      ...event,
      interestedIds: [...event.interestedIds, userId]
    };
  }

  static inviteToEvent(event: SocialEvent, userIds: string[]): SocialEvent {
    const newInvitedIds = userIds.filter(id => 
      !event.invitedIds.includes(id) && 
      !event.attendeeIds.includes(id) &&
      !event.interestedIds.includes(id)
    );

    return {
      ...event,
      invitedIds: [...event.invitedIds, ...newInvitedIds]
    };
  }

  static followUser(profile: SocialProfile, followerId: string): SocialProfile {
    return {
      ...profile,
      followersCount: profile.followersCount + 1
    };
  }

  static unfollowUser(profile: SocialProfile, followerId: string): SocialProfile {
    return {
      ...profile,
      followersCount: Math.max(0, profile.followersCount - 1)
    };
  }

  static createPrayerRequestPost(
    userId: string,
    prayerRequest: PrayerRequest,
    visibility: SocialPost['visibility'] = 'public'
  ): SocialPost {
    return this.createPost(
      userId,
      prayerRequest.description,
      'prayer',
      visibility,
      [prayerRequest.category],
      [],
      undefined,
      undefined,
      undefined
    );
  }

  static createTestimonyPost(
    userId: string,
    testimony: string,
    verse?: {text: string, reference: string},
    visibility: SocialPost['visibility'] = 'public'
  ): SocialPost {
    return this.createPost(
      userId,
      testimony,
      'testimony',
      visibility,
      ['testimony', 'blessing'],
      [],
      undefined,
      verse,
      undefined
    );
  }

  static createEventPost(
    userId: string,
    event: SocialEvent,
    content: string,
    visibility: SocialPost['visibility'] = 'public'
  ): SocialPost {
    return this.createPost(
      userId,
      content,
      'event',
      visibility,
      ['event', ...event.tags],
      event.coverImage ? [event.coverImage] : [],
      event.location,
      undefined,
      {
        title: event.title,
        date: event.startDate,
        location: event.location.name,
        description: event.description
      }
    );
  }

  static createVersePost(
    userId: string,
    verse: {text: string, reference: string},
    content: string = '',
    visibility: SocialPost['visibility'] = 'public'
  ): SocialPost {
    return this.createPost(
      userId,
      content,
      'verse',
      visibility,
      ['verse', 'bible'],
      [],
      undefined,
      verse,
      undefined
    );
  }

  static filterFeedByPreferences(
    posts: SocialPost[],
    preferences: {
      denominationFilter?: string[],
      contentTypeFilter?: SocialPost['type'][],
      hideFromUsers?: string[]
    }
  ): SocialPost[] {
    return posts.filter(post => {
      // Filter by denomination if specified
      if (preferences.denominationFilter && preferences.denominationFilter.length > 0) {
        // This would require user data to be joined with posts
        // For now, we'll skip this filter in the mock implementation
      }

      // Filter by content type if specified
      if (preferences.contentTypeFilter && preferences.contentTypeFilter.length > 0) {
        if (!preferences.contentTypeFilter.includes(post.type)) {
          return false;
        }
      }

      // Hide posts from blocked/muted users
      if (preferences.hideFromUsers && preferences.hideFromUsers.includes(post.userId)) {
        return false;
      }

      return true;
    });
  }

  static sortFeedByRelevance(posts: SocialPost[], userId: string): SocialPost[] {
    return [...posts].sort((a, b) => {
      // Calculate relevance score for each post
      const scoreA = this.calculatePostRelevance(a, userId);
      const scoreB = this.calculatePostRelevance(b, userId);
      
      // Sort by relevance score (higher first)
      return scoreB - scoreA;
    });
  }

  private static calculatePostRelevance(post: SocialPost, userId: string): number {
    let score = 0;
    
    // Recency factor (newer posts get higher score)
    const ageInHours = (Date.now() - post.createdAt) / (1000 * 60 * 60);
    score += Math.max(0, 100 - ageInHours); // Decay over time
    
    // Engagement factor
    score += post.likes.length * 2;
    score += post.comments.length * 3;
    score += post.shares * 5;
    score += post.prayerCount * 4;
    
    // Personal relevance
    if (post.likes.includes(userId)) score += 10;
    if (post.comments.some(c => c.userId === userId)) score += 15;
    
    // Content type relevance
    if (post.type === 'prayer') score += 5;
    if (post.type === 'testimony') score += 8;
    
    return score;
  }

  static generateMockFeed(userCount: number, postsPerUser: number): SocialPost[] {
    const posts: SocialPost[] = [];
    
    const postTypes: SocialPost['type'][] = ['general', 'prayer', 'verse', 'testimony', 'event'];
    const visibilityTypes: SocialPost['visibility'][] = ['public', 'connections', 'private'];
    
    for (let i = 1; i <= userCount; i++) {
      const userId = `user_${i}`;
      
      for (let j = 1; j <= postsPerUser; j++) {
        const type = postTypes[Math.floor(Math.random() * postTypes.length)];
        const visibility = visibilityTypes[Math.floor(Math.random() * visibilityTypes.length)];
        
        let content = '';
        let verse;
        let eventDetails;
        
        switch (type) {
          case 'general':
            content = `Postagem geral #${j} do usuário ${i}. Louvado seja Deus por mais um dia de bênçãos!`;
            break;
          case 'prayer':
            content = `Por favor, orem por mim e minha família. Estamos passando por um momento difícil, mas confiamos no Senhor.`;
            break;
          case 'verse':
            content = 'Este versículo tem me fortalecido muito ultimamente.';
            verse = {
              text: 'O Senhor é o meu pastor; nada me faltará.',
              reference: 'Salmos 23:1'
            };
            break;
          case 'testimony':
            content = 'Quero compartilhar um testemunho incrível de como Deus tem agido em minha vida. Recentemente, enfrentei um grande desafio, mas o Senhor me deu força e sabedoria para superá-lo.';
            break;
          case 'event':
            content = 'Venham participar deste evento especial em nossa igreja!';
            eventDetails = {
              title: 'Encontro de Jovens',
              date: Date.now() + (7 * 24 * 60 * 60 * 1000), // 7 days from now
              location: 'Igreja Central',
              description: 'Um tempo especial de comunhão e adoração para jovens cristãos.'
            };
            break;
        }
        
        const post = this.createPost(
          userId,
          content,
          type,
          visibility,
          ['tag1', 'tag2'],
          [],
          type === 'event' ? { name: 'Igreja Central' } : undefined,
          verse,
          eventDetails
        );
        
        // Add some random likes
        const likeCount = Math.floor(Math.random() * 20);
        for (let k = 0; k < likeCount; k++) {
          const likeUserId = `user_${Math.floor(Math.random() * userCount) + 1}`;
          if (!post.likes.includes(likeUserId)) {
            post.likes.push(likeUserId);
          }
        }
        
        // Add some random comments
        const commentCount = Math.floor(Math.random() * 5);
        for (let k = 0; k < commentCount; k++) {
          const commentUserId = `user_${Math.floor(Math.random() * userCount) + 1}`;
          post.comments.push({
            id: `comment_${Date.now()}_${k}`,
            userId: commentUserId,
            content: `Comentário ${k + 1} na postagem. Deus abençoe!`,
            likes: [],
            createdAt: post.createdAt + (k * 60000) // Add some minutes
          });
        }
        
        // Add some random shares and prayers
        post.shares = Math.floor(Math.random() * 10);
        post.prayerCount = Math.floor(Math.random() * 15);
        
        posts.push(post);
      }
    }
    
    // Sort by creation date (newest first)
    return posts.sort((a, b) => b.createdAt - a.createdAt);
  }

  static generateMockGroups(count: number): SocialGroup[] {
    const groups: SocialGroup[] = [];
    
    const groupTypes: SocialGroup['type'][] = ['prayer', 'study', 'interest', 'church', 'event'];
    const privacyTypes: SocialGroup['privacy'][] = ['public', 'private', 'secret'];
    
    for (let i = 1; i <= count; i++) {
      const type = groupTypes[Math.floor(Math.random() * groupTypes.length)];
      const privacy = privacyTypes[Math.floor(Math.random() * privacyTypes.length)];
      
      let name = '';
      let description = '';
      let tags: string[] = [];
      let churchDetails;
      let studyDetails;
      let eventDetails;
      
      switch (type) {
        case 'prayer':
          name = `Círculo de Oração ${i}`;
          description = 'Um grupo dedicado à intercessão e oração uns pelos outros.';
          tags = ['oração', 'intercessão', 'fé'];
          break;
        case 'study':
          name = `Estudo Bíblico ${i}`;
          description = 'Aprofundando o conhecimento da Palavra de Deus juntos.';
          tags = ['estudo', 'bíblia', 'conhecimento'];
          studyDetails = {
            topic: 'Livro de Romanos',
            schedule: 'Terças, 19h30',
            materials: ['Bíblia', 'Comentário de Romanos']
          };
          break;
        case 'interest':
          name = `Cristãos e Música ${i}`;
          description = 'Para amantes de música cristã e adoração.';
          tags = ['música', 'adoração', 'louvor'];
          break;
        case 'church':
          name = `Igreja Batista Central ${i}`;
          description = 'Grupo oficial da Igreja Batista Central.';
          tags = ['igreja', 'batista', 'comunidade'];
          churchDetails = {
            denomination: 'Batista',
            location: 'São Paulo, SP',
            website: 'www.igrejabatistacentral.com.br',
            pastorName: 'Pr. João Silva'
          };
          break;
        case 'event':
          name = `Retiro de Jovens ${i}`;
          description = 'Organizando o próximo retiro de jovens.';
          tags = ['retiro', 'jovens', 'evento'];
          eventDetails = {
            date: Date.now() + (30 * 24 * 60 * 60 * 1000), // 30 days from now
            location: 'Acampamento Águas Vivas',
            recurring: false
          };
          break;
      }
      
      const adminIds = [`user_${Math.floor(Math.random() * 5) + 1}`];
      const memberCount = Math.floor(Math.random() * 50) + 10;
      const memberIds = [...adminIds];
      
      for (let j = 0; j < memberCount; j++) {
        const memberId = `user_${Math.floor(Math.random() * 20) + 1}`;
        if (!memberIds.includes(memberId)) {
          memberIds.push(memberId);
        }
      }
      
      const group = this.createGroup(
        name,
        description,
        type,
        privacy,
        adminIds,
        tags,
        undefined,
        churchDetails,
        studyDetails,
        eventDetails
      );
      
      group.memberIds = memberIds;
      groups.push(group);
    }
    
    return groups;
  }

  static generateMockEvents(count: number): SocialEvent[] {
    const events: SocialEvent[] = [];
    
    const eventTypes: SocialEvent['type'][] = ['worship', 'conference', 'study', 'outreach', 'fellowship', 'prayer'];
    const visibilityTypes: SocialEvent['visibility'][] = ['public', 'connections', 'private', 'group'];
    
    for (let i = 1; i <= count; i++) {
      const type = eventTypes[Math.floor(Math.random() * eventTypes.length)];
      const visibility = visibilityTypes[Math.floor(Math.random() * visibilityTypes.length)];
      
      let title = '';
      let description = '';
      let tags: string[] = [];
      let location = {
        name: '',
        address: ''
      };
      
      switch (type) {
        case 'worship':
          title = `Noite de Louvor ${i}`;
          description = 'Uma noite especial de adoração e louvor a Deus.';
          tags = ['louvor', 'adoração', 'música'];
          location = {
            name: 'Igreja Central',
            address: 'Av. Principal, 123'
          };
          break;
        case 'conference':
          title = `Conferência Vida Cristã ${i}`;
          description = 'Palestrantes renomados compartilhando sobre vida cristã e família.';
          tags = ['conferência', 'ensino', 'família'];
          location = {
            name: 'Centro de Convenções',
            address: 'Rua das Palmeiras, 500'
          };
          break;
        case 'study':
          title = `Estudo Bíblico Especial ${i}`;
          description = 'Aprofundando o conhecimento nas Escrituras.';
          tags = ['estudo', 'bíblia', 'conhecimento'];
          location = {
            name: 'Sala de Estudos',
            address: 'Rua da Sabedoria, 45'
          };
          break;
        case 'outreach':
          title = `Ação Social ${i}`;
          description = 'Servindo à comunidade com amor cristão.';
          tags = ['ação social', 'serviço', 'comunidade'];
          location = {
            name: 'Comunidade Esperança',
            address: 'Rua da Bondade, 78'
          };
          break;
        case 'fellowship':
          title = `Encontro de Jovens ${i}`;
          description = 'Momento de comunhão e diversão para jovens cristãos.';
          tags = ['jovens', 'comunhão', 'diversão'];
          location = {
            name: 'Espaço Juventude',
            address: 'Av. da Amizade, 230'
          };
          break;
        case 'prayer':
          title = `Vigília de Oração ${i}`;
          description = 'Uma noite dedicada à oração e intercessão.';
          tags = ['oração', 'vigília', 'intercessão'];
          location = {
            name: 'Templo de Oração',
            address: 'Rua da Fé, 77'
          };
          break;
      }
      
      const organizerId = `user_${Math.floor(Math.random() * 5) + 1}`;
      const startDate = Date.now() + ((Math.floor(Math.random() * 30) + 1) * 24 * 60 * 60 * 1000);
      const endDate = startDate + (3 * 60 * 60 * 1000); // 3 hours later
      
      const attendeeCount = Math.floor(Math.random() * 30) + 5;
      const attendeeIds = [organizerId];
      
      for (let j = 0; j < attendeeCount; j++) {
        const attendeeId = `user_${Math.floor(Math.random() * 20) + 1}`;
        if (!attendeeIds.includes(attendeeId)) {
          attendeeIds.push(attendeeId);
        }
      }
      
      const interestedCount = Math.floor(Math.random() * 20) + 10;
      const interestedIds: string[] = [];
      
      for (let j = 0; j < interestedCount; j++) {
        const interestedId = `user_${Math.floor(Math.random() * 20) + 1}`;
        if (!attendeeIds.includes(interestedId) && !interestedIds.includes(interestedId)) {
          interestedIds.push(interestedId);
        }
      }
      
      const event = this.createEvent(
        title,
        description,
        type,
        startDate,
        endDate,
        location,
        organizerId,
        visibility,
        tags
      );
      
      event.attendeeIds = attendeeIds;
      event.interestedIds = interestedIds;
      events.push(event);
    }
    
    // Sort by start date (soonest first)
    return events.sort((a, b) => a.startDate - b.startDate);
  }
}