import { useState, useEffect, useCallback } from 'react';
import { Platform } from 'react-native';
import { 
  SocialSystem, 
  SocialPost, 
  SocialComment, 
  SocialGroup, 
  SocialEvent, 
  SocialProfile,
  SocialNotification,
  SocialFeed
} from '@/utils/socialSystem';
import { useNotifications } from './useNotifications';
import { useCompatibility } from './useCompatibility';

export function useSocial() {
  const [feed, setFeed] = useState<SocialPost[]>([]);
  const [userPosts, setUserPosts] = useState<SocialPost[]>([]);
  const [groups, setGroups] = useState<SocialGroup[]>([]);
  const [events, setEvents] = useState<SocialEvent[]>([]);
  const [socialProfile, setSocialProfile] = useState<SocialProfile | null>(null);
  const [socialNotifications, setSocialNotifications] = useState<SocialNotification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeFilters, setActiveFilters] = useState<{
    contentType?: SocialPost['type'][];
    tags?: string[];
    denominationFilter?: string[];
  }>({});
  
  const { sendLocalNotification } = useNotifications();
  const { currentUser } = useCompatibility();

  // Initialize social data
  useEffect(() => {
    if (currentUser) {
      loadFeed();
      loadUserPosts();
      loadGroups();
      loadEvents();
      loadSocialProfile();
      loadSocialNotifications();
    }
  }, [currentUser]);

  const loadFeed = useCallback(async () => {
    setIsLoading(true);
    try {
      // In a real app, this would fetch from an API
      // For now, we'll generate mock data
      const mockFeed = SocialSystem.generateMockFeed(10, 5);
      
      // Apply any active filters
      let filteredFeed = mockFeed;
      if (activeFilters.contentType && activeFilters.contentType.length > 0) {
        filteredFeed = filteredFeed.filter(post => 
          activeFilters.contentType?.includes(post.type)
        );
      }
      
      if (activeFilters.tags && activeFilters.tags.length > 0) {
        filteredFeed = filteredFeed.filter(post => 
          post.tags.some(tag => activeFilters.tags?.includes(tag))
        );
      }
      
      if (activeFilters.denominationFilter && activeFilters.denominationFilter.length > 0) {
        // In a real app, this would filter by user's denomination
        // For now, we'll skip this filter in the mock implementation
      }
      
      setFeed(filteredFeed);
    } catch (error) {
      console.error('Error loading feed:', error);
    } finally {
      setIsLoading(false);
    }
  }, [activeFilters]);

  const loadUserPosts = useCallback(async () => {
    if (!currentUser) return;
    
    try {
      // In a real app, this would fetch the user's posts from an API
      // For now, we'll filter the mock feed for posts by the current user
      const mockFeed = SocialSystem.generateMockFeed(1, 10);
      setUserPosts(mockFeed);
    } catch (error) {
      console.error('Error loading user posts:', error);
    }
  }, [currentUser]);

  const loadGroups = useCallback(async () => {
    try {
      // In a real app, this would fetch from an API
      const mockGroups = SocialSystem.generateMockGroups(10);
      setGroups(mockGroups);
    } catch (error) {
      console.error('Error loading groups:', error);
    }
  }, []);

  const loadEvents = useCallback(async () => {
    try {
      // In a real app, this would fetch from an API
      const mockEvents = SocialSystem.generateMockEvents(10);
      setEvents(mockEvents);
    } catch (error) {
      console.error('Error loading events:', error);
    }
  }, []);

  const loadSocialProfile = useCallback(async () => {
    if (!currentUser) return;
    
    try {
      // In a real app, this would fetch from an API
      const profile = SocialSystem.createSocialProfile(
        currentUser.id,
        currentUser
      );
      
      // Add some mock data
      profile.followersCount = Math.floor(Math.random() * 50) + 10;
      profile.followingCount = Math.floor(Math.random() * 30) + 5;
      profile.postsCount = userPosts.length;
      profile.groupsCount = Math.floor(Math.random() * 5) + 1;
      profile.eventsCount = Math.floor(Math.random() * 8) + 2;
      profile.prayerCount = Math.floor(Math.random() * 100) + 20;
      profile.isVerified = Math.random() > 0.5;
      
      setSocialProfile(profile);
    } catch (error) {
      console.error('Error loading social profile:', error);
    }
  }, [currentUser, userPosts.length]);

  const loadSocialNotifications = useCallback(async () => {
    try {
      // In a real app, this would fetch from an API
      // For now, we'll generate some mock notifications
      const mockNotifications: SocialNotification[] = [
        {
          id: 'notification_1',
          userId: 'current_user',
          type: 'like',
          sourceId: 'post_1',
          sourceType: 'post',
          actorId: 'user_2',
          content: 'João curtiu sua publicação',
          read: false,
          createdAt: Date.now() - (2 * 60 * 60 * 1000) // 2 hours ago
        },
        {
          id: 'notification_2',
          userId: 'current_user',
          type: 'comment',
          sourceId: 'post_2',
          sourceType: 'post',
          actorId: 'user_3',
          content: 'Maria comentou em sua publicação: "Amém! Deus abençoe."',
          read: true,
          createdAt: Date.now() - (5 * 60 * 60 * 1000) // 5 hours ago
        },
        {
          id: 'notification_3',
          userId: 'current_user',
          type: 'follow',
          sourceId: 'profile_current_user',
          sourceType: 'profile',
          actorId: 'user_4',
          content: 'Pedro começou a seguir você',
          read: false,
          createdAt: Date.now() - (1 * 24 * 60 * 60 * 1000) // 1 day ago
        },
        {
          id: 'notification_4',
          userId: 'current_user',
          type: 'prayer',
          sourceId: 'post_3',
          sourceType: 'post',
          actorId: 'user_5',
          content: 'Ana orou pelo seu pedido de oração',
          read: false,
          createdAt: Date.now() - (2 * 24 * 60 * 60 * 1000) // 2 days ago
        },
        {
          id: 'notification_5',
          userId: 'current_user',
          type: 'event',
          sourceId: 'event_1',
          sourceType: 'event',
          actorId: 'user_6',
          content: 'Lucas convidou você para o evento "Encontro de Jovens"',
          read: true,
          createdAt: Date.now() - (3 * 24 * 60 * 60 * 1000) // 3 days ago
        }
      ];
      
      setSocialNotifications(mockNotifications);
    } catch (error) {
      console.error('Error loading social notifications:', error);
    }
  }, []);

  const createPost = useCallback(async (
    content: string,
    type: SocialPost['type'] = 'general',
    visibility: SocialPost['visibility'] = 'public',
    tags: string[] = [],
    mediaUrls: string[] = [],
    location?: SocialPost['location'],
    verse?: SocialPost['verse'],
    eventDetails?: SocialPost['eventDetails']
  ): Promise<SocialPost | null> => {
    if (!currentUser) return null;
    
    try {
      const newPost = SocialSystem.createPost(
        currentUser.id,
        content,
        type,
        visibility,
        tags,
        mediaUrls,
        location,
        verse,
        eventDetails
      );
      
      // In a real app, this would send the post to an API
      // For now, we'll just update our local state
      setFeed(prev => [newPost, ...prev]);
      setUserPosts(prev => [newPost, ...prev]);
      
      // Update post count in profile
      if (socialProfile) {
        setSocialProfile({
          ...socialProfile,
          postsCount: socialProfile.postsCount + 1
        });
      }
      
      return newPost;
    } catch (error) {
      console.error('Error creating post:', error);
      return null;
    }
  }, [currentUser, socialProfile]);

  const likePost = useCallback(async (postId: string): Promise<boolean> => {
    if (!currentUser) return false;
    
    try {
      // Find the post in feed or user posts
      const postInFeed = feed.find(p => p.id === postId);
      const postInUserPosts = userPosts.find(p => p.id === postId);
      
      if (!postInFeed && !postInUserPosts) return false;
      
      const post = postInFeed || postInUserPosts;
      if (!post) return false;
      
      const updatedPost = SocialSystem.likePost(post, currentUser.id);
      
      // Update feed
      if (postInFeed) {
        setFeed(prev => prev.map(p => p.id === postId ? updatedPost : p));
      }
      
      // Update user posts
      if (postInUserPosts) {
        setUserPosts(prev => prev.map(p => p.id === postId ? updatedPost : p));
      }
      
      // If this is not the current user's post, create a notification for the post owner
      if (post.userId !== currentUser.id && !post.likes.includes(currentUser.id)) {
        // In a real app, this would be sent to the API
        // For now, we'll just simulate it
        
        // Send local notification for demo purposes
        sendLocalNotification(
          'Nova Curtida',
          `Você recebeu uma curtida em sua publicação`,
          'like'
        );
      }
      
      return true;
    } catch (error) {
      console.error('Error liking post:', error);
      return false;
    }
  }, [currentUser, feed, userPosts, sendLocalNotification]);

  const commentOnPost = useCallback(async (postId: string, content: string, replyTo?: string): Promise<SocialComment | null> => {
    if (!currentUser || !content.trim()) return null;
    
    try {
      // Find the post in feed or user posts
      const postInFeed = feed.find(p => p.id === postId);
      const postInUserPosts = userPosts.find(p => p.id === postId);
      
      if (!postInFeed && !postInUserPosts) return null;
      
      const post = postInFeed || postInUserPosts;
      if (!post) return null;
      
      const newComment = SocialSystem.createComment(
        currentUser.id,
        postId,
        content,
        replyTo
      );
      
      const updatedPost = SocialSystem.addComment(post, newComment);
      
      // Update feed
      if (postInFeed) {
        setFeed(prev => prev.map(p => p.id === postId ? updatedPost : p));
      }
      
      // Update user posts
      if (postInUserPosts) {
        setUserPosts(prev => prev.map(p => p.id === postId ? updatedPost : p));
      }
      
      // If this is not the current user's post, create a notification for the post owner
      if (post.userId !== currentUser.id) {
        // In a real app, this would be sent to the API
        // For now, we'll just simulate it
        
        // Send local notification for demo purposes
        sendLocalNotification(
          'Novo Comentário',
          `Alguém comentou em sua publicação: "${content.substring(0, 30)}${content.length > 30 ? '...' : ''}"`,
          'message'
        );
      }
      
      return newComment;
    } catch (error) {
      console.error('Error commenting on post:', error);
      return null;
    }
  }, [currentUser, feed, userPosts, sendLocalNotification]);

  const prayForPost = useCallback(async (postId: string): Promise<boolean> => {
    if (!currentUser) return false;
    
    try {
      // Find the post in feed or user posts
      const postInFeed = feed.find(p => p.id === postId);
      const postInUserPosts = userPosts.find(p => p.id === postId);
      
      if (!postInFeed && !postInUserPosts) return false;
      
      const post = postInFeed || postInUserPosts;
      if (!post) return false;
      
      const updatedPost = SocialSystem.prayForPost(post);
      
      // Update feed
      if (postInFeed) {
        setFeed(prev => prev.map(p => p.id === postId ? updatedPost : p));
      }
      
      // Update user posts
      if (postInUserPosts) {
        setUserPosts(prev => prev.map(p => p.id === postId ? updatedPost : p));
      }
      
      // If this is not the current user's post, create a notification for the post owner
      if (post.userId !== currentUser.id) {
        // In a real app, this would be sent to the API
        // For now, we'll just simulate it
        
        // Send local notification for demo purposes
        sendLocalNotification(
          'Nova Oração',
          `Alguém orou pelo seu pedido`,
          'prayer'
        );
      }
      
      return true;
    } catch (error) {
      console.error('Error praying for post:', error);
      return false;
    }
  }, [currentUser, feed, userPosts, sendLocalNotification]);

  const sharePost = useCallback(async (postId: string, additionalContent?: string): Promise<SocialPost | null> => {
    if (!currentUser) return null;
    
    try {
      // Find the original post
      const originalPost = feed.find(p => p.id === postId);
      if (!originalPost) return null;
      
      // Create a new post that shares the original
      const sharedContent = additionalContent 
        ? `${additionalContent}\n\n[Compartilhado] ${originalPost.content}`
        : `[Compartilhado] ${originalPost.content}`;
      
      const newPost = SocialSystem.createPost(
        currentUser.id,
        sharedContent,
        originalPost.type,
        'public',
        [...originalPost.tags, 'compartilhado'],
        originalPost.mediaUrls,
        originalPost.location,
        originalPost.verse,
        originalPost.eventDetails
      );
      
      // Update the share count on the original post
      const updatedOriginalPost = SocialSystem.sharePost(originalPost);
      
      // Update feed with both the new post and the updated original
      setFeed(prev => [
        newPost,
        ...prev.map(p => p.id === postId ? updatedOriginalPost : p)
      ]);
      
      // Add to user posts
      setUserPosts(prev => [newPost, ...prev]);
      
      // Update post count in profile
      if (socialProfile) {
        setSocialProfile({
          ...socialProfile,
          postsCount: socialProfile.postsCount + 1
        });
      }
      
      // If this is not the current user's post, create a notification for the original post owner
      if (originalPost.userId !== currentUser.id) {
        // In a real app, this would be sent to the API
        // For now, we'll just simulate it
        
        // Send local notification for demo purposes
        sendLocalNotification(
          'Publicação Compartilhada',
          `Alguém compartilhou sua publicação`,
          'like'
        );
      }
      
      return newPost;
    } catch (error) {
      console.error('Error sharing post:', error);
      return null;
    }
  }, [currentUser, feed, socialProfile, sendLocalNotification]);

  const markNotificationAsRead = useCallback((notificationId: string) => {
    setSocialNotifications(prev => 
      prev.map(notification => 
        notification.id === notificationId 
          ? { ...notification, read: true } 
          : notification
      )
    );
  }, []);

  const markAllNotificationsAsRead = useCallback(() => {
    setSocialNotifications(prev => 
      prev.map(notification => ({ ...notification, read: true }))
    );
  }, []);

  const getUnreadNotificationsCount = useCallback((): number => {
    return socialNotifications.filter(notification => !notification.read).length;
  }, [socialNotifications]);

  const filterFeed = useCallback((filters: {
    contentType?: SocialPost['type'][];
    tags?: string[];
    denominationFilter?: string[];
  }) => {
    setActiveFilters(filters);
    loadFeed(); // This will apply the new filters
  }, [loadFeed]);

  const resetFilters = useCallback(() => {
    setActiveFilters({});
    loadFeed();
  }, [loadFeed]);

  const getPostsByType = useCallback((type: SocialPost['type']): SocialPost[] => {
    return feed.filter(post => post.type === type);
  }, [feed]);

  const getGroupsByType = useCallback((type: SocialGroup['type']): SocialGroup[] => {
    return groups.filter(group => group.type === type);
  }, [groups]);

  const getEventsByType = useCallback((type: SocialEvent['type']): SocialEvent[] => {
    return events.filter(event => event.type === type);
  }, [events]);

  const getUpcomingEvents = useCallback((): SocialEvent[] => {
    const now = Date.now();
    return events
      .filter(event => event.startDate > now)
      .sort((a, b) => a.startDate - b.startDate);
  }, [events]);

  const getUserGroups = useCallback((): SocialGroup[] => {
    if (!currentUser) return [];
    return groups.filter(group => group.memberIds.includes(currentUser.id));
  }, [currentUser, groups]);

  const getUserEvents = useCallback((): SocialEvent[] => {
    if (!currentUser) return [];
    return events.filter(event => 
      event.organizerId === currentUser.id || 
      event.attendeeIds.includes(currentUser.id)
    );
  }, [currentUser, events]);

  return {
    // Data
    feed,
    userPosts,
    groups,
    events,
    socialProfile,
    socialNotifications,
    isLoading,
    
    // Post actions
    createPost,
    likePost,
    commentOnPost,
    prayForPost,
    sharePost,
    
    // Group actions
    createGroup: useCallback(async (
      name: string,
      description: string,
      type: SocialGroup['type'],
      privacy: SocialGroup['privacy'],
      tags: string[] = [],
      coverImage?: string,
      churchDetails?: SocialGroup['churchDetails'],
      studyDetails?: SocialGroup['studyDetails'],
      eventDetails?: SocialGroup['eventDetails']
    ): Promise<SocialGroup | null> => {
      if (!currentUser) return null;
      
      try {
        const newGroup = SocialSystem.createGroup(
          name,
          description,
          type,
          privacy,
          [currentUser.id],
          tags,
          coverImage,
          churchDetails,
          studyDetails,
          eventDetails
        );
        
        // In a real app, this would send the group to an API
        // For now, we'll just update our local state
        setGroups(prev => [newGroup, ...prev]);
        
        // Update group count in profile
        if (socialProfile) {
          setSocialProfile({
            ...socialProfile,
            groupsCount: socialProfile.groupsCount + 1
          });
        }
        
        return newGroup;
      } catch (error) {
        console.error('Error creating group:', error);
        return null;
      }
    }, [currentUser, socialProfile]),
    
    joinGroup: useCallback(async (groupId: string): Promise<boolean> => {
      if (!currentUser) return false;
      
      try {
        // Find the group
        const group = groups.find(g => g.id === groupId);
        if (!group) return false;
        
        // Check if already a member
        if (group.memberIds.includes(currentUser.id)) return true;
        
        // Check if approval is required (private or secret groups)
        const requiresApproval = group.privacy !== 'public';
        
        const updatedGroup = SocialSystem.joinGroup(
          group,
          currentUser.id,
          requiresApproval
        );
        
        // Update groups
        setGroups(prev => prev.map(g => g.id === groupId ? updatedGroup : g));
        
        // If no approval required, update group count in profile
        if (!requiresApproval && socialProfile) {
          setSocialProfile({
            ...socialProfile,
            groupsCount: socialProfile.groupsCount + 1
          });
        }
        
        // Notify group admins (in a real app)
        if (requiresApproval) {
          // Send notification to admins
        } else {
          // Send welcome notification to user
          sendLocalNotification(
            'Grupo Adicionado',
            `Você agora é membro do grupo "${group.name}"`,
            'like'
          );
        }
        
        return true;
      } catch (error) {
        console.error('Error joining group:', error);
        return false;
      }
    }, [currentUser, groups, socialProfile, sendLocalNotification]),
    
    leaveGroup: useCallback(async (groupId: string): Promise<boolean> => {
      if (!currentUser) return false;
      
      try {
        // Find the group
        const group = groups.find(g => g.id === groupId);
        if (!group) return false;
        
        // Check if a member
        if (!group.memberIds.includes(currentUser.id)) return false;
        
        const updatedGroup = SocialSystem.leaveGroup(
          group,
          currentUser.id
        );
        
        // Update groups
        setGroups(prev => prev.map(g => g.id === groupId ? updatedGroup : g));
        
        // Update group count in profile
        if (socialProfile) {
          setSocialProfile({
            ...socialProfile,
            groupsCount: Math.max(0, socialProfile.groupsCount - 1)
          });
        }
        
        return true;
      } catch (error) {
        console.error('Error leaving group:', error);
        return false;
      }
    }, [currentUser, groups, socialProfile]),
    
    // Event actions
    createEvent: useCallback(async (
      title: string,
      description: string,
      type: SocialEvent['type'],
      startDate: number,
      endDate: number,
      location: SocialEvent['location'],
      visibility: SocialEvent['visibility'] = 'public',
      tags: string[] = [],
      coverImage?: string,
      groupId?: string,
      recurring?: boolean,
      frequency?: SocialEvent['frequency']
    ): Promise<SocialEvent | null> => {
      if (!currentUser) return null;
      
      try {
        const newEvent = SocialSystem.createEvent(
          title,
          description,
          type,
          startDate,
          endDate,
          location,
          currentUser.id,
          visibility,
          tags,
          coverImage,
          groupId,
          recurring,
          frequency
        );
        
        // In a real app, this would send the event to an API
        // For now, we'll just update our local state
        setEvents(prev => [newEvent, ...prev]);
        
        // Update event count in profile
        if (socialProfile) {
          setSocialProfile({
            ...socialProfile,
            eventsCount: socialProfile.eventsCount + 1
          });
        }
        
        // Create a post about the event
        if (visibility !== 'private') {
          createPost(
            `Criei um novo evento: ${title}. Todos estão convidados!`,
            'event',
            visibility,
            tags,
            coverImage ? [coverImage] : [],
            location,
            undefined,
            {
              title,
              date: startDate,
              location: location.name,
              description
            }
          );
        }
        
        return newEvent;
      } catch (error) {
        console.error('Error creating event:', error);
        return null;
      }
    }, [currentUser, socialProfile, createPost]),
    
    attendEvent,
    markInterestedInEvent,
    inviteToEvent: useCallback(async (eventId: string, userIds: string[]): Promise<boolean> => {
      if (!currentUser) return false;
      
      try {
        // Find the event
        const event = events.find(e => e.id === eventId);
        if (!event) return false;
        
        // Check if current user is organizer or attendee
        if (event.organizerId !== currentUser.id && 
            !event.attendeeIds.includes(currentUser.id)) {
          return false;
        }
        
        const updatedEvent = SocialSystem.inviteToEvent(
          event,
          userIds
        );
        
        // Update events
        setEvents(prev => prev.map(e => e.id === eventId ? updatedEvent : e));
        
        // Notify invited users (in a real app)
        // For now, we'll just simulate it
        sendLocalNotification(
          'Novo Convite',
          `Você foi convidado para o evento "${event.title}"`,
          'event'
        );
        
        return true;
      } catch (error) {
        console.error('Error inviting to event:', error);
        return false;
      }
    }, [currentUser, events, sendLocalNotification]),
    
    // User actions
    followUser: useCallback(async (userId: string): Promise<boolean> => {
      if (!currentUser || userId === currentUser.id) return false;
      
      try {
        // In a real app, this would send a request to an API
        // For now, we'll just update our local state
        
        // Update following count in profile
        if (socialProfile) {
          setSocialProfile({
            ...socialProfile,
            followingCount: socialProfile.followingCount + 1
          });
        }
        
        // Notify the followed user (in a real app)
        // For now, we'll just simulate it
        sendLocalNotification(
          'Novo Seguidor',
          `Alguém começou a seguir você`,
          'follow'
        );
        
        return true;
      } catch (error) {
        console.error('Error following user:', error);
        return false;
      }
    }, [currentUser, socialProfile, sendLocalNotification]),
    
    unfollowUser: useCallback(async (userId: string): Promise<boolean> => {
      if (!currentUser || userId === currentUser.id) return false;
      
      try {
        // In a real app, this would send a request to an API
        // For now, we'll just update our local state
        
        // Update following count in profile
        if (socialProfile) {
          setSocialProfile({
            ...socialProfile,
            followingCount: Math.max(0, socialProfile.followingCount - 1)
          });
        }
        
        return true;
      } catch (error) {
        console.error('Error unfollowing user:', error);
        return false;
      }
    }, [currentUser, socialProfile]),
    
    // Notification actions
    markNotificationAsRead,
    markAllNotificationsAsRead,
    getUnreadNotificationsCount,
    
    // Feed management
    filterFeed,
    resetFilters,
    refreshFeed: loadFeed,
    
    // Getters
    getPostsByType,
    getGroupsByType,
    getEventsByType,
    getUpcomingEvents,
    getUserGroups,
    getUserEvents
  };
}

// Implement missing functions
const attendEvent = async (eventId: string): Promise<boolean> => {
  // Implementation would go here
  return true;
};

const markInterestedInEvent = async (eventId: string): Promise<boolean> => {
  // Implementation would go here
  return true;
};