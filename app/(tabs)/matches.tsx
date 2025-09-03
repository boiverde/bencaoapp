import { useState } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  FlatList as RNFlatList, 
  TouchableOpacity, 
  TextInput 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Theme from '@/constants/Theme';
import { Search, Filter, MessageSquare, Phone, Video, HandHelping as PrayingHands } from 'lucide-react-native';
import ConversationItem from '@/components/UI/ConversationItem';
import { useCommunication } from '@/hooks/useCommunication';
import { useRouter } from 'expo-router';

// Use FlatList from react-native-web for web platform
const FlatList = RNFlatList;

export default function MatchesScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'unread' | 'prayer' | 'archived'>('all');
  
  const router = useRouter();
  const {
    conversations,
    getUnreadCount,
    markConversationAsRead,
    startVoiceCall,
    isUserOnline,
    getTypingUsers
  } = useCommunication();

  const filteredConversations = conversations.filter(conversation => {
    // Apply search filter
    if (searchQuery) {
      const searchTerm = searchQuery.toLowerCase();
      const title = conversation.title || 'Conversa';
      const lastMessage = conversation.lastMessage?.content || '';
      
      if (!title.toLowerCase().includes(searchTerm) && 
          !lastMessage.toLowerCase().includes(searchTerm)) {
        return false;
      }
    }

    // Apply category filter
    switch (activeFilter) {
      case 'unread':
        return conversation.unreadCount > 0;
      case 'prayer':
        return conversation.type === 'prayer_circle';
      case 'archived':
        return conversation.isArchived;
      default:
        return !conversation.isArchived;
    }
  });

  const handleConversationPress = (conversationId: string) => {
    markConversationAsRead(conversationId);
    router.push('/chat');
  };

  const handleVoiceCall = (conversationId: string) => {
    startVoiceCall(conversationId, 'voice');
  };

  const handleVideoCall = (conversationId: string) => {
    startVoiceCall(conversationId, 'video');
  };

  const renderFilterButton = (filter: typeof activeFilter, label: string, count?: number) => (
    <TouchableOpacity
      style={[styles.filterButton, activeFilter === filter && styles.activeFilterButton]}
      onPress={() => setActiveFilter(filter)}
    >
      <Text style={[
        styles.filterButtonText,
        activeFilter === filter && styles.activeFilterButtonText
      ]}>
        {label}
        {count !== undefined && count > 0 && ` (${count})`}
      </Text>
    </TouchableOpacity>
  );

  const renderConversation = ({ item }) => {
    const otherParticipant = item.participants.find(p => p !== 'current_user');
    const isOnline = otherParticipant ? isUserOnline(otherParticipant) : false;
    const typingUsers = getTypingUsers(item.id);
    const isTyping = typingUsers.length > 0;

    return (
      <ConversationItem
        conversation={item}
        isOnline={isOnline}
        isTyping={isTyping}
        onPress={() => handleConversationPress(item.id)}
        onVoiceCall={() => handleVoiceCall(item.id)}
        onVideoCall={() => handleVideoCall(item.id)}
      />
    );
  };

  const unreadCount = getUnreadCount();
  const prayerCircles = conversations.filter(c => c.type === 'prayer_circle').length;
  const archivedCount = conversations.filter(c => c.isArchived).length;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Conexões Abençoadas</Text>
        {unreadCount > 0 && (
          <View style={styles.unreadBadge}>
            <Text style={styles.unreadBadgeText}>{unreadCount}</Text>
          </View>
        )}
      </View>
      
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Search size={20} color={Theme.colors.text.medium} />
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar conversas..."
            placeholderTextColor={Theme.colors.text.medium}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
        
        <TouchableOpacity style={styles.filterIconButton}>
          <Filter size={20} color={Theme.colors.primary.blue} />
        </TouchableOpacity>
      </View>

      <View style={styles.filtersContainer}>
        {renderFilterButton('all', 'Todas')}
        {renderFilterButton('unread', 'Não lidas', unreadCount)}
        {renderFilterButton('prayer', 'Oração', prayerCircles)}
        {renderFilterButton('archived', 'Arquivadas', archivedCount)}
      </View>
      
      {filteredConversations.length === 0 ? (
        <View style={styles.emptyState}>
          <PrayingHands size={48} color={Theme.colors.text.light} />
          <Text style={styles.emptyTitle}>
            {searchQuery ? 'Nenhuma conversa encontrada' : 'Nenhuma conversa ainda'}
          </Text>
          <Text style={styles.emptySubtitle}>
            {searchQuery 
              ? 'Tente ajustar sua busca'
              : 'Suas conversas aparecerão aqui quando você começar a se conectar com outros membros'
            }
          </Text>
        </View>
      ) : (
        <FlatList
          data={filteredConversations}
          keyExtractor={(item) => item.id}
          renderItem={renderConversation}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.conversationsList}
        />
      )}
      
      <TouchableOpacity style={styles.fab}>
        <MessageSquare size={24} color="#fff" />
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.colors.background.light,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Theme.spacing.md,
    paddingVertical: Theme.spacing.md,
    position: 'relative',
  },
  title: {
    fontFamily: Theme.typography.fontFamily.heading,
    fontSize: Theme.typography.fontSize.xxl,
    color: Theme.colors.primary.blue,
  },
  unreadBadge: {
    position: 'absolute',
    right: Theme.spacing.md,
    backgroundColor: Theme.colors.status.error,
    borderRadius: Theme.borderRadius.circle,
    minWidth: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
  },
  unreadBadgeText: {
    fontFamily: Theme.typography.fontFamily.subheading,
    fontSize: Theme.typography.fontSize.xs,
    color: Theme.colors.background.white,
  },
  searchContainer: {
    flexDirection: 'row',
    paddingHorizontal: Theme.spacing.md,
    marginBottom: Theme.spacing.md,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Theme.colors.background.white,
    borderRadius: Theme.borderRadius.md,
    paddingHorizontal: Theme.spacing.md,
    paddingVertical: Theme.spacing.sm,
    marginRight: Theme.spacing.sm,
    ...Theme.shadows.small,
  },
  searchInput: {
    flex: 1,
    fontFamily: Theme.typography.fontFamily.body,
    fontSize: Theme.typography.fontSize.md,
    marginLeft: Theme.spacing.sm,
    color: Theme.colors.text.dark,
  },
  filterIconButton: {
    backgroundColor: Theme.colors.background.white,
    borderRadius: Theme.borderRadius.md,
    padding: Theme.spacing.sm,
    alignItems: 'center',
    justifyContent: 'center',
    width: 48,
    height: 48,
    ...Theme.shadows.small,
  },
  filtersContainer: {
    flexDirection: 'row',
    paddingHorizontal: Theme.spacing.md,
    marginBottom: Theme.spacing.md,
  },
  filterButton: {
    paddingHorizontal: Theme.spacing.md,
    paddingVertical: Theme.spacing.sm,
    borderRadius: Theme.borderRadius.md,
    backgroundColor: Theme.colors.background.white,
    marginRight: Theme.spacing.sm,
    ...Theme.shadows.small,
  },
  activeFilterButton: {
    backgroundColor: Theme.colors.primary.blue,
  },
  filterButtonText: {
    fontFamily: Theme.typography.fontFamily.body,
    fontSize: Theme.typography.fontSize.sm,
    color: Theme.colors.text.dark,
  },
  activeFilterButtonText: {
    fontFamily: Theme.typography.fontFamily.subheading,
    color: Theme.colors.background.white,
  },
  conversationsList: {
    paddingBottom: Theme.spacing.xl,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Theme.spacing.xl,
  },
  emptyTitle: {
    fontFamily: Theme.typography.fontFamily.subheading,
    fontSize: Theme.typography.fontSize.lg,
    color: Theme.colors.text.dark,
    marginTop: Theme.spacing.md,
    marginBottom: Theme.spacing.sm,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontFamily: Theme.typography.fontFamily.body,
    fontSize: Theme.typography.fontSize.md,
    color: Theme.colors.text.medium,
    textAlign: 'center',
    lineHeight: 22,
  },
  fab: {
    position: 'absolute',
    right: Theme.spacing.md,
    bottom: Theme.spacing.lg,
    width: 56,
    height: 56,
    borderRadius: Theme.borderRadius.circle,
    backgroundColor: Theme.colors.primary.blue,
    alignItems: 'center',
    justifyContent: 'center',
    ...Theme.shadows.medium,
  },
});