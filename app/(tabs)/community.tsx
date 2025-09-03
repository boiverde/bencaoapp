import { useState, useRef } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  TouchableOpacity, 
  TextInput, 
  FlatList as RNFlatList 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Theme from '@/constants/Theme';
import { Search, Filter, Bell, Users, Calendar, Book, Heart } from 'lucide-react-native';
import { useSocial } from '@/hooks/useSocial';
import SocialFeed from '@/components/Social/SocialFeed';
import SocialGroupCard from '@/components/Social/SocialGroupCard';
import SocialEventCard from '@/components/Social/SocialEventCard';
import SocialNotificationsList from '@/components/Social/SocialNotificationsList';
import { SocialPost, SocialGroup, SocialEvent } from '@/utils/socialSystem';

// Use FlatList from react-native-web for web platform
const FlatList = RNFlatList;

export default function CommunityScreen() {
  const [activeTab, setActiveTab] = useState<'feed' | 'groups' | 'events' | 'notifications'>('feed');
  const [searchQuery, setSearchQuery] = useState('');
  
  const { 
    feed, 
    groups, 
    events, 
    joinGroup, 
    attendEvent, 
    markInterestedInEvent,
    getUnreadNotificationsCount
  } = useSocial();

  const handleJoinGroup = async (groupId: string) => {
    await joinGroup(groupId);
  };

  const handleAttendEvent = async (eventId: string) => {
    await attendEvent(eventId);
  };

  const handleInterestedInEvent = async (eventId: string) => {
    await markInterestedInEvent(eventId);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'feed':
        return (
          <SocialFeed 
            showCreatePost={true}
            showFilters={true}
          />
        );
      
      case 'groups':
        return (
          <FlatList
            data={groups}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <SocialGroupCard 
                group={item}
                onJoin={() => handleJoinGroup(item.id)}
                isMember={item.memberIds.includes('current_user')}
              />
            )}
            contentContainerStyle={styles.listContent}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Users size={48} color={Theme.colors.text.light} />
                <Text style={styles.emptyTitle}>Nenhum grupo encontrado</Text>
                <Text style={styles.emptySubtitle}>
                  Crie ou participe de grupos para compartilhar sua fé
                </Text>
              </View>
            }
          />
        );
      
      case 'events':
        return (
          <FlatList
            data={events}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <SocialEventCard 
                event={item}
                onAttend={() => handleAttendEvent(item.id)}
                onInterested={() => handleInterestedInEvent(item.id)}
                isAttending={item.attendeeIds.includes('current_user')}
                isInterested={item.interestedIds.includes('current_user')}
              />
            )}
            contentContainerStyle={styles.listContent}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Calendar size={48} color={Theme.colors.text.light} />
                <Text style={styles.emptyTitle}>Nenhum evento encontrado</Text>
                <Text style={styles.emptySubtitle}>
                  Crie ou participe de eventos para se conectar com a comunidade
                </Text>
              </View>
            }
          />
        );
      
      case 'notifications':
        return <SocialNotificationsList />;
      
      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Comunidade Abençoada</Text>
        <TouchableOpacity 
          style={styles.notificationButton}
          onPress={() => setActiveTab('notifications')}
        >
          <Bell size={24} color={Theme.colors.text.dark} />
          {getUnreadNotificationsCount() > 0 && (
            <View style={styles.notificationBadge}>
              <Text style={styles.notificationBadgeText}>
                {getUnreadNotificationsCount()}
              </Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Search size={20} color={Theme.colors.text.medium} />
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar na comunidade..."
            placeholderTextColor={Theme.colors.text.medium}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
        <TouchableOpacity style={styles.filterButton}>
          <Filter size={20} color={Theme.colors.primary.blue} />
        </TouchableOpacity>
      </View>

      <View style={styles.tabsContainer}>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'feed' && styles.activeTab]}
          onPress={() => setActiveTab('feed')}
        >
          <Heart 
            size={20} 
            color={activeTab === 'feed' ? Theme.colors.primary.blue : Theme.colors.text.medium} 
          />
          <Text style={[
            styles.tabText,
            activeTab === 'feed' && styles.activeTabText
          ]}>
            Feed
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'groups' && styles.activeTab]}
          onPress={() => setActiveTab('groups')}
        >
          <Users 
            size={20} 
            color={activeTab === 'groups' ? Theme.colors.primary.blue : Theme.colors.text.medium} 
          />
          <Text style={[
            styles.tabText,
            activeTab === 'groups' && styles.activeTabText
          ]}>
            Grupos
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'events' && styles.activeTab]}
          onPress={() => setActiveTab('events')}
        >
          <Calendar 
            size={20} 
            color={activeTab === 'events' ? Theme.colors.primary.blue : Theme.colors.text.medium} 
          />
          <Text style={[
            styles.tabText,
            activeTab === 'events' && styles.activeTabText
          ]}>
            Eventos
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'notifications' && styles.activeTab]}
          onPress={() => setActiveTab('notifications')}
        >
          <Bell 
            size={20} 
            color={activeTab === 'notifications' ? Theme.colors.primary.blue : Theme.colors.text.medium} 
          />
          <Text style={[
            styles.tabText,
            activeTab === 'notifications' && styles.activeTabText
          ]}>
            Notificações
          </Text>
          {getUnreadNotificationsCount() > 0 && activeTab !== 'notifications' && (
            <View style={styles.tabBadge}>
              <Text style={styles.tabBadgeText}>{getUnreadNotificationsCount()}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      {renderTabContent()}
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Theme.spacing.md,
    paddingVertical: Theme.spacing.md,
    backgroundColor: Theme.colors.background.white,
  },
  title: {
    fontFamily: Theme.typography.fontFamily.heading,
    fontSize: Theme.typography.fontSize.xxl,
    color: Theme.colors.primary.blue,
  },
  notificationButton: {
    position: 'relative',
    padding: Theme.spacing.xs,
  },
  notificationBadge: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: Theme.colors.status.error,
    borderRadius: Theme.borderRadius.circle,
    minWidth: 18,
    height: 18,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  notificationBadgeText: {
    fontFamily: Theme.typography.fontFamily.subheading,
    fontSize: 10,
    color: Theme.colors.background.white,
  },
  searchContainer: {
    flexDirection: 'row',
    paddingHorizontal: Theme.spacing.md,
    paddingVertical: Theme.spacing.sm,
    backgroundColor: Theme.colors.background.white,
    borderBottomWidth: 1,
    borderBottomColor: Theme.colors.ui.border,
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
  filterButton: {
    width: 40,
    height: 40,
    borderRadius: Theme.borderRadius.circle,
    backgroundColor: Theme.colors.background.light,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: Theme.colors.background.white,
    borderBottomWidth: 1,
    borderBottomColor: Theme.colors.ui.border,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Theme.spacing.md,
    position: 'relative',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: Theme.colors.primary.blue,
  },
  tabText: {
    fontFamily: Theme.typography.fontFamily.body,
    fontSize: Theme.typography.fontSize.sm,
    color: Theme.colors.text.medium,
    marginLeft: Theme.spacing.xs,
  },
  activeTabText: {
    fontFamily: Theme.typography.fontFamily.subheading,
    color: Theme.colors.primary.blue,
  },
  tabBadge: {
    position: 'absolute',
    top: 8,
    right: 15,
    backgroundColor: Theme.colors.status.error,
    borderRadius: Theme.borderRadius.circle,
    minWidth: 16,
    height: 16,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 3,
  },
  tabBadgeText: {
    fontFamily: Theme.typography.fontFamily.subheading,
    fontSize: 8,
    color: Theme.colors.background.white,
  },
  listContent: {
    padding: Theme.spacing.md,
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
  },
});