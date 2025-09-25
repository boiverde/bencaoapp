import { create } from 'zustand';
import { supabase } from '@/lib/supabase';
import { SocialPost as SocialPostType, SocialComment, SocialGroup, SocialEvent } from '@/utils/socialSystem';

export interface SocialPost extends SocialPostType {
  author_name?: string;
}

interface SocialState {
  feed: SocialPost[];
  groups: SocialGroup[];
  events: SocialEvent[];
  following: string[];
  error: string | null;
  isLoading: boolean;
  initializeSocial: (userId: string) => Promise<void>;
  refreshFeed: () => Promise<void>;
  createPost: (post: Omit<SocialPost, 'id' | 'createdAt' | 'likes' | 'comments' | 'shares' | 'prayerCount' | 'author_name'>) => Promise<void>;
  filterFeed: (filters: any) => void;
}

// Função de conversão que aceita o mapa de utilizadores
const fromSupabasePost = (data: any, users: { [key: string]: string }): SocialPost => {
  return {
    id: data.id,
    userId: data.user_id,
    content: data.content,
    createdAt: new Date(data.created_at).getTime(),
    author_name: users[data.user_id] || 'Utilizador Desconhecido', // Usa o mapa
    likes: data.likes || [],
    comments: data.comments || [],
    prayers: data.prayers || [],
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
  following: [],
  error: null,
  isLoading: true,
  
  getUnreadNotificationsCount: () => 0,

  initializeSocial: async (userId: string) => {
    set({ isLoading: true, error: null });
    try {
      // 1. Buscar as publicações
      const { data: feedData, error: feedError } = await supabase
        .from('posts')
        .select('*')
        .order('created_at', { ascending: false });

      if (feedError) throw new Error(`Feed Error: ${feedError.message}`);

      const userIds = [...new Set(feedData.map(p => p.user_id))];
      
      // 2. Tentar buscar os nomes dos utilizadores usando a coluna 'name'
      const { data: usersData, error: usersError } = await supabase
        .from('users')
        .select('id, name') // TENTATIVA: usar a coluna 'name'
        .in('id', userIds);
      
      if (usersError) throw new Error(`Users Error: ${usersError.message}`);

      // 3. Criar mapa de ID -> Nome
      const usersMap = usersData.reduce((acc, user) => {
        acc[user.id] = user.name; // TENTATIVA: usar user.name
        return acc;
      }, {} as { [key: string]: string });
      
      // 4. Mapear os posts com os nomes dos autores, se encontrados
      set({ feed: feedData.map(post => fromSupabasePost(post, usersMap)), isLoading: false });

    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      console.error("Error initializing social data:", error.message);
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
        group_id: post.groupId,
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

  refreshFeed: async () => {
    const session = await supabase.auth.getSession();
    const userId = session?.data?.session?.user.id;
    if (userId) {
      await get().initializeSocial(userId);
    }
  },

  filterFeed: (filters: any) => {},
}));
