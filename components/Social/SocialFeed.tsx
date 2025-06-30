import { useState, useRef } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  FlatList as RNFlatList, 
  RefreshControl, 
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  ScrollView
} from 'react-native';
import { 
  Filter, 
  Search, 
  Plus, 
  Book, 
  HandHelping as PrayingHands, 
  Calendar, 
  MessageSquare 
} from 'lucide-react-native';
import Theme from '@/constants/Theme';
import { useSocial } from '@/hooks/useSocial';
import { SocialPost } from '@/utils/socialSystem';
import SocialPostCard from './SocialPostCard';
import CreatePostModal from './CreatePostModal';
import FeedFilterModal from './FeedFilterModal';

// Use FlatList from react-native-web for web platform
const FlatList = RNFlatList;

interface SocialFeedProps {
  showCreatePost?: boolean;
  initialFilter?: SocialPost['type'];
  showFilters?: boolean;
  onPostPress?: (post: SocialPost) => void;
}

export default function SocialFeed({ 
  showCreatePost = true,
  initialFilter,
  showFilters = true,
  onPostPress
}: SocialFeedProps) {
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [createPostModalVisible, setCreatePostModalVisible] = useState(false);
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [activeFilter, setActiveFilter] = useState<SocialPost['type'] | 'all'>(initialFilter || 'all');
  
  const { feed, isLoading, refreshFeed, filterFeed } = useSocial();
  
  const flatListRef = useRef<RNFlatList>(null);

  const onRefresh = async () => {
    setRefreshing(true);
    await refreshFeed();
    setRefreshing(false);
  };

  const handleCreatePost = () => {
    setCreatePostModalVisible(true);
  };

  const handlePostCreated = () => {
    setCreatePostModalVisible(false);
    refreshFeed();
    
    // Scroll to top to show the new post
    if (flatListRef.current) {
      flatListRef.current.scrollToOffset({ offset: 0, animated: true });
    }
  };

  const handleFilterPress = (filter: SocialPost['type'] | 'all') => {
    setActiveFilter(filter);
    
    if (filter === 'all') {
      filterFeed({});
    } else {
      filterFeed({ contentType: [filter] });
    }
  };

  const handleSearch = (text: string) => {
    setSearchQuery(text);
    // In a real app, this would trigger a search API call
    // For now, we'll just simulate filtering locally
  };

  const filteredFeed = searchQuery
    ? feed.filter(post => 
        post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : feed;

  const renderFilterButton = (filter: SocialPost['type'] | 'all', label: string, icon: any) => {
    const Icon = icon;
    const isActive = activeFilter === filter;
    
    return (
      <TouchableOpacity
        style={[styles.filterButton, isActive && styles.activeFilterButton]}
        onPress={() => handleFilterPress(filter)}
      >
        <Icon 
          size={16} 
          color={isActive ? Theme.colors.background.white : Theme.colors.text.medium} 
        />
        <Text style={[
          styles.filterButtonText,
          isActive && styles.activeFilterButtonText
        ]}>
          {label}
        </Text>
      </TouchableOpacity>
    );
  };

  const renderEmptyComponent = () => (
    <View style={styles.emptyContainer}>
      <MessageSquare size={48} color={Theme.colors.text.light} />
      <Text style={styles.emptyTitle}>Nenhuma publicação encontrada</Text>
      <Text style={styles.emptySubtitle}>
        {searchQuery 
          ? 'Tente ajustar sua busca ou filtros'
          : 'Seja o primeiro a compartilhar algo com a comunidade'}
      </Text>
      {showCreatePost && (
        <TouchableOpacity 
          style={styles.createFirstPostButton}
          onPress={handleCreatePost}
        >
          <Text style={styles.createFirstPostText}>Criar Publicação</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Search size={20} color={Theme.colors.text.medium} />
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar publicações..."
            placeholderTextColor={Theme.colors.text.medium}
            value={searchQuery}
            onChangeText={handleSearch}
          />
        </View>
        
        {showFilters && (
          <TouchableOpacity 
            style={styles.filterIconButton}
            onPress={() => setFilterModalVisible(true)}
          >
            <Filter size={20} color={Theme.colors.primary.blue} />
          </TouchableOpacity>
        )}
      </View>

      {showFilters && (
        <View style={styles.filtersContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {renderFilterButton('all', 'Todos', MessageSquare)}
            {renderFilterButton('prayer', 'Orações', PrayingHands)}
            {renderFilterButton('verse', 'Versículos', Book)}
            {renderFilterButton('testimony', 'Testemunhos', MessageSquare)}
            {renderFilterButton('event', 'Eventos', Calendar)}
          </ScrollView>
        </View>
      )}

      {isLoading && filteredFeed.length === 0 ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Theme.colors.primary.blue} />
          <Text style={styles.loadingText}>Carregando publicações...</Text>
        </View>
      ) : (
        <FlatList
          ref={flatListRef}
          data={filteredFeed}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <SocialPostCard 
              post={item} 
              onPress={() => onPostPress && onPostPress(item)}
            />
          )}
          contentContainerStyle={styles.feedContent}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={[Theme.colors.primary.blue]}
              tintColor={Theme.colors.primary.blue}
            />
          }
          ListEmptyComponent={renderEmptyComponent}
        />
      )}

      {showCreatePost && (
        <TouchableOpacity 
          style={styles.createPostButton}
          onPress={handleCreatePost}
        >
          <Plus size={24} color="#fff" />
        </TouchableOpacity>
      )}

      <CreatePostModal
        visible={createPostModalVisible}
        onClose={() => setCreatePostModalVisible(false)}
        onPostCreated={handlePostCreated}
      />

      <FeedFilterModal
        visible={filterModalVisible}
        onClose={() => setFilterModalVisible(false)}
        onApplyFilters={(filters) => {
          filterFeed(filters);
          setFilterModalVisible(false);
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.colors.background.light,
  },
  searchContainer: {
    flexDirection: 'row',
    paddingHorizontal: Theme.spacing.md,
    paddingVertical: Theme.spacing.sm,
    backgroundColor: Theme.colors.background.white,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Theme.colors.background.light,
    borderRadius: Theme.borderRadius.md,
    paddingHorizontal: Theme.spacing.md,
    marginRight: Theme.spacing.sm,
  },
  searchInput: {
    flex: 1,
    fontFamily: Theme.typography.fontFamily.body,
    fontSize: Theme.typography.fontSize.md,
    paddingVertical: Theme.spacing.sm,
    marginLeft: Theme.spacing.sm,
    color: Theme.colors.text.dark,
  },
  filterIconButton: {
    width: 40,
    height: 40,
    borderRadius: Theme.borderRadius.circle,
    backgroundColor: Theme.colors.background.light,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filtersContainer: {
    paddingVertical: Theme.spacing.sm,
    backgroundColor: Theme.colors.background.white,
    borderBottomWidth: 1,
    borderBottomColor: Theme.colors.ui.border,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Theme.spacing.md,
    paddingVertical: Theme.spacing.sm,
    backgroundColor: Theme.colors.background.light,
    borderRadius: Theme.borderRadius.md,
    marginHorizontal: Theme.spacing.xs,
  },
  activeFilterButton: {
    backgroundColor: Theme.colors.primary.blue,
  },
  filterButtonText: {
    fontFamily: Theme.typography.fontFamily.body,
    fontSize: Theme.typography.fontSize.sm,
    color: Theme.colors.text.medium,
    marginLeft: Theme.spacing.xs,
  },
  activeFilterButtonText: {
    color: Theme.colors.background.white,
  },
  feedContent: {
    padding: Theme.spacing.md,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Theme.spacing.xl,
  },
  loadingText: {
    fontFamily: Theme.typography.fontFamily.body,
    fontSize: Theme.typography.fontSize.md,
    color: Theme.colors.text.medium,
    marginTop: Theme.spacing.md,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Theme.spacing.xl,
    minHeight: 300,
  },
  emptyTitle: {
    fontFamily: Theme.typography.fontFamily.subheading,
    fontSize: Theme.typography.fontSize.lg,
    color: Theme.colors.text.dark,
    marginTop: Theme.spacing.md,
    marginBottom: Theme.spacing.sm,
  },
  emptySubtitle: {
    fontFamily: Theme.typography.fontFamily.body,
    fontSize: Theme.typography.fontSize.md,
    color: Theme.colors.text.medium,
    textAlign: 'center',
    marginBottom: Theme.spacing.lg,
  },
  createFirstPostButton: {
    backgroundColor: Theme.colors.primary.blue,
    paddingHorizontal: Theme.spacing.lg,
    paddingVertical: Theme.spacing.md,
    borderRadius: Theme.borderRadius.md,
  },
  createFirstPostText: {
    fontFamily: Theme.typography.fontFamily.subheading,
    fontSize: Theme.typography.fontSize.md,
    color: Theme.colors.background.white,
  },
  createPostButton: {
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