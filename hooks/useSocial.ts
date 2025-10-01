import { create } from 'zustand';
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

// Função de conversão que aceita o mapa de usuários
const fromSupabasePost = (data: any, users: { [key: string]: string }): SocialPost => {
  return {
    id: data.id,
    userId: data.user_id,
    content: data.content,
    createdAt: new Date(data.created_at).getTime(),
    likes: [], // Will be loaded separately
    comments: [], // Will be loaded separately
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

export const useSocial = create<SocialState>((set, get) => ({
  feed: [],
  groups: [],
  events: [],
  socialNotifications: [],
  following: [],
  error: null,
  isLoading: true,
  
  initializeSocial: async (userId: string) => {
    set({ isLoading: true, error: null });
    try {
      // 1. Buscar publicações
      const { data: feedData, error: feedError } = await supabase
        .from('posts')
        .select('*')
        .order('created_at', { ascending: false });

      if (feedError) throw new Error(`Feed Error: ${feedError.message}`);

      // 2. Buscar grupos (mock data por enquanto)
      const mockGroups: SocialGroup[] = [];
      
      // 3. Buscar eventos
      const { data: eventsData, error: eventsError } = await supabase
        .from('events')
        .select('*')
        .order('start_date', { ascending: true });
      
      if (eventsError) console.warn('Events Error:', eventsError.message);

      // 4. Criar mapa de usuários (mock por enquanto)
      const usersMap = {};
      
      // 5. Mapear os posts
      const mappedPosts = feedData ? feedData.map(post => fromSupabasePost(post, usersMap)) : [];
      
      // 6. Mock notifications
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
      
      set({ 
        feed: mappedPosts,
        groups: mockGroups,
        events: eventsData || [],
        socialNotifications: mockNotifications,
        isLoading: false 
      });

    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      console.error("Error initializing social data:", error);
    }
  },
  
  createPost: async (post) => {
    set({ error: null });
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

      const { data, error } = await supabase.from('posts').insert(postForDb);

      if (error) {
        console.error("Supabase error:", error);
        throw new Error(`Error creating post: ${error.message}`);
      }
      
      await get().refreshFeed();

    } catch (error: any) {
      set({ error: error.message });
      throw error;
    }
  },

  likePost: async (postId: string) => {
    try {
      // Implementar like no banco de dados
      const { error } = await supabase
        .from('post_likes')
        .upsert({ post_id: postId, user_id: 'current_user' });
      
      if (error) throw error;
      await get().refreshFeed();
    } catch (error: any) {
      console.error('Error liking post:', error);
    }
  },

  commentOnPost: async (postId: string, content: string) => {
    try {
      const { error } = await supabase
        .from('comments')
        .insert({ post_id: postId, user_id: 'current_user', content });
      
      if (error) throw error;
      await get().refreshFeed();
    } catch (error: any) {
      console.error('Error commenting on post:', error);
    }
  },

  prayForPost: async (postId: string) => {
    try {
      // Incrementar prayer count
      const { error } = await supabase
        .from('posts')
        .update({ prayer_count: supabase.sql`prayer_count + 1` })
        .eq('id', postId);
      
      if (error) throw error;
      await get().refreshFeed();
    } catch (error: any) {
      console.error('Error praying for post:', error);
    }
  },

  sharePost: async (postId: string) => {
    try {
      // Incrementar share count
      const { error } = await supabase
        .from('posts')
        .update({ shares: supabase.sql`shares + 1` })
        .eq('id', postId);
      
      if (error) throw error;
      await get().refreshFeed();
    } catch (error: any) {
      console.error('Error sharing post:', error);
    }
  },

  joinGroup: async (groupId: string) => {
    // Mock implementation
    console.log('Joining group:', groupId);
  },

  attendEvent: async (eventId: string) => {
    try {
      const { error } = await supabase
        .from('events')
        .update({ 
          attendees: supabase.sql`array_append(attendees, '${supabase.auth.getUser().data.user?.id}')` 
        })
        .eq('id', eventId);
      
      if (error) throw error;
    } catch (error: any) {
      console.error('Error attending event:', error);
    }
  },

  markInterestedInEvent: async (eventId: string) => {
    console.log('Marking interested in event:', eventId);
  },

  markNotificationAsRead: (notificationId: string) => {
    set(state => ({
      socialNotifications: state.socialNotifications.map(notif =>
        notif.id === notificationId ? { ...notif, read: true } : notif
      )
    }));
  },

  markAllNotificationsAsRead: () => {
    set(state => ({
      socialNotifications: state.socialNotifications.map(notif => ({ ...notif, read: true }))
    }));
  },

  getUnreadNotificationsCount: () => {
    const state = get();
    return state.socialNotifications.filter(notif => !notif.read).length;
  },
  refreshFeed: async () => {
    const session = await supabase.auth.getSession();
    const userId = session?.data?.session?.user.id;
    if (userId) {
      await get().initializeSocial(userId);
    }
  },

  filterFeed: (filters: any) => {},
}));
