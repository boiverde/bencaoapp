import React, { createContext, useContext, useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { SocialPost, SocialComment, SocialGroup, SocialEvent, SocialNotification } from '@/utils/socialSystem';

interface SocialState {
  feed: SocialPost[];
  groups: SocialGroup[];
  events: SocialEvent[];
  socialNotifications: SocialNotification[];
  following: string[];
  error: string | null;
  isLoading: boolean;
}

interface SocialContextType extends SocialState {
  initializeSocial: (userId: string) => Promise<void>;
  refreshFeed: () => Promise<void>;
  createPost: (post: Omit<SocialPost, 'id' | 'createdAt' | 'likes' | 'comments' | 'shares' | 'prayerCount'>) => Promise<void>;
  likePost: (postId: string) => Promise<void>;
  commentOnPost: (postId: string, content: string) => Promise<void>;
  prayForPost: (postId: string) => Promise<void>;
  sharePost: (postId: string) => Promise<void>;
  joinGroup: (groupId: string) => Promise<void>;
  attendEvent: (eventId: string) => Promise<void>;
  markInterestedInEvent: (eventId: string) => Promise<void>;
  markNotificationAsRead: (notificationId: string) => void;
  markAllNotificationsAsRead: () => void;
  getUnreadNotificationsCount: () => number;
  filterFeed: (filters: any) => void;
}

const SocialContext = createContext<SocialContextType | undefined>(undefined);

const fromSupabasePost = (data: any, users: { [key: string]: string }): SocialPost => {
  return {
    id: data.id,
    userId: data.user_id,
    content: data.content,
    createdAt: new Date(data.created_at).getTime(),
    likes: [],
    comments: [],
    shares: data.shares || 0,
    tags: data.tags || [],
    type: data.type || 'verse',
    mediaUrls: data.media_urls || [],
    visibility: data.visibility || 'public',
    location: data.location,
    verse: data.verse,
    eventDetails: data.event_details,
    prayerCount: data.prayer_count || 0,
  };
};

export const SocialProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<SocialState>({
    feed: [],
    groups: [],
    events: [],
    socialNotifications: [],
    following: [],
    error: null,
    isLoading: true,
  });

  const initializeSocial = useCallback(async (userId: string) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    try {
      const { data: feedData, error: feedError } = await supabase
        .from('posts')
        .select('*')
        .order('created_at', { ascending: false });

      if (feedError) throw new Error(`Feed Error: ${feedError.message}`);

      const mockGroups: SocialGroup[] = [];

      const { data: eventsData, error: eventsError } = await supabase
        .from('events')
        .select('*')
        .order('start_date', { ascending: true });

      if (eventsError) console.warn('Events Error:', eventsError.message);

      const usersMap = {};
      const mappedPosts = feedData ? feedData.map(post => fromSupabasePost(post, usersMap)) : [];

      const mockNotifications: SocialNotification[] = [
        {
          id: 'notif_1',
          userId: userId,
          type: 'like',
          sourceId: 'post_1',
          sourceType: 'post',
          actorId: 'user_2',
          content: 'João curtiu sua publicação',
          read: false,
          createdAt: Date.now() - 3600000
        }
      ];

      setState(prev => ({
        ...prev,
        feed: mappedPosts,
        groups: mockGroups,
        events: eventsData || [],
        socialNotifications: mockNotifications,
        isLoading: false
      }));

    } catch (error: any) {
      setState(prev => ({ ...prev, error: error.message, isLoading: false }));
      console.error("Error initializing social data:", error);
    }
  }, []);

  const createPost = useCallback(async (post: Omit<SocialPost, 'id' | 'createdAt' | 'likes' | 'comments' | 'shares' | 'prayerCount'>) => {
    setState(prev => ({ ...prev, error: null }));
    try {
      const postForDb = {
        user_id: post.userId,
        content: post.content,
        type: post.type,
        visibility: post.visibility,
        tags: post.tags,
        media_urls: post.mediaUrls,
        location: post.location,
        event_details: post.eventDetails,
        verse: post.type === 'verse' ? post.verse : null,
      };

      const { error } = await supabase.from('posts').insert(postForDb);

      if (error) {
        console.error("Supabase error:", error);
        throw new Error(`Error creating post: ${error.message}`);
      }

      await refreshFeed();

    } catch (error: any) {
      setState(prev => ({ ...prev, error: error.message }));
      throw error;
    }
  }, []);

  const likePost = useCallback(async (postId: string) => {
    try {
      const { error } = await supabase
        .from('post_likes')
        .upsert({ post_id: postId, user_id: 'current_user' });

      if (error) throw error;
      await refreshFeed();
    } catch (error: any) {
      console.error('Error liking post:', error);
    }
  }, []);

  const commentOnPost = useCallback(async (postId: string, content: string) => {
    try {
      const { error } = await supabase
        .from('comments')
        .insert({ post_id: postId, user_id: 'current_user', content });

      if (error) throw error;
      await refreshFeed();
    } catch (error: any) {
      console.error('Error commenting on post:', error);
    }
  }, []);

  const prayForPost = useCallback(async (postId: string) => {
    try {
      const { error } = await supabase.rpc('increment_prayer_count', { post_id: postId });

      if (error) throw error;
      await refreshFeed();
    } catch (error: any) {
      console.error('Error praying for post:', error);
    }
  }, []);

  const sharePost = useCallback(async (postId: string) => {
    try {
      const { error } = await supabase.rpc('increment_share_count', { post_id: postId });

      if (error) throw error;
      await refreshFeed();
    } catch (error: any) {
      console.error('Error sharing post:', error);
    }
  }, []);

  const joinGroup = useCallback(async (groupId: string) => {
    console.log('Joining group:', groupId);
  }, []);

  const attendEvent = useCallback(async (eventId: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase
        .from('event_attendees')
        .insert({ event_id: eventId, user_id: user.id });

      if (error) throw error;
    } catch (error: any) {
      console.error('Error attending event:', error);
    }
  }, []);

  const markInterestedInEvent = useCallback(async (eventId: string) => {
    console.log('Marking interested in event:', eventId);
  }, []);

  const markNotificationAsRead = useCallback((notificationId: string) => {
    setState(prev => ({
      ...prev,
      socialNotifications: prev.socialNotifications.map(notif =>
        notif.id === notificationId ? { ...notif, read: true } : notif
      )
    }));
  }, []);

  const markAllNotificationsAsRead = useCallback(() => {
    setState(prev => ({
      ...prev,
      socialNotifications: prev.socialNotifications.map(notif => ({ ...notif, read: true }))
    }));
  }, []);

  const getUnreadNotificationsCount = useCallback(() => {
    return state.socialNotifications.filter(notif => !notif.read).length;
  }, [state.socialNotifications]);

  const refreshFeed = useCallback(async () => {
    const session = await supabase.auth.getSession();
    const userId = session?.data?.session?.user.id;
    if (userId) {
      await initializeSocial(userId);
    }
  }, [initializeSocial]);

  const filterFeed = useCallback((filters: any) => {}, []);

  const value: SocialContextType = {
    ...state,
    initializeSocial,
    refreshFeed,
    createPost,
    likePost,
    commentOnPost,
    prayForPost,
    sharePost,
    joinGroup,
    attendEvent,
    markInterestedInEvent,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    getUnreadNotificationsCount,
    filterFeed,
  };

  return (
    <SocialContext.Provider value={value}>
      {children}
    </SocialContext.Provider>
  );
};

export const useSocial = () => {
  const context = useContext(SocialContext);
  if (context === undefined) {
    throw new Error('useSocial must be used within a SocialProvider');
  }
  return context;
};
