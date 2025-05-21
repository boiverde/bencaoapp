import { StyleSheet, View, Text, FlatList, Image, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Theme from '@/constants/Theme';
import { Search, MessageSquare, Filter } from 'lucide-react-native';
import { TextInput } from 'react-native-gesture-handler';

// Mock data
const MATCHES = [
  {
    id: '1',
    name: 'Mariana',
    age: 28,
    lastActive: 'Agora',
    message: 'Oi! Tudo bem com você?',
    image: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    unread: true,
  },
  {
    id: '2',
    name: 'João',
    age: 30,
    lastActive: '5 min',
    message: 'Qual sua igreja? 🙏',
    image: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    unread: false,
  },
  {
    id: '3',
    name: 'Gabriela',
    age: 26,
    lastActive: '2 dias',
    message: 'Você vai ao evento no domingo?',
    image: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    unread: false,
  },
  {
    id: '4',
    name: 'Lucas',
    age: 32,
    lastActive: '1 hora',
    message: 'Amém! Concordo totalmente.',
    image: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    unread: true,
  },
];

export default function MatchesScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Conexões Abençoadas</Text>
      </View>
      
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Search size={20} color={Theme.colors.text.medium} />
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar conexões..."
            placeholderTextColor={Theme.colors.text.medium}
          />
        </View>
        <TouchableOpacity style={styles.filterButton}>
          <Filter size={20} color={Theme.colors.primary.blue} />
        </TouchableOpacity>
      </View>
      
      <View style={styles.newMatchesSection}>
        <Text style={styles.sectionTitle}>Novos Matches</Text>
        <FlatList
          horizontal
          data={MATCHES.slice(0, 2)}
          keyExtractor={(item) => item.id}
          showsHorizontalScrollIndicator={false}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.newMatchCard}>
              <View style={styles.matchImageContainer}>
                <Image source={{ uri: item.image }} style={styles.matchImage} />
              </View>
              <Text style={styles.newMatchName}>{item.name}</Text>
            </TouchableOpacity>
          )}
          contentContainerStyle={styles.newMatchesList}
        />
      </View>
      
      <View style={styles.messagesSection}>
        <Text style={styles.sectionTitle}>Mensagens</Text>
        <FlatList
          data={MATCHES}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.messageRow}>
              <View style={styles.messageImageContainer}>
                <Image source={{ uri: item.image }} style={styles.messageImage} />
                {item.lastActive === 'Agora' && (
                  <View style={styles.onlineIndicator} />
                )}
              </View>
              <View style={styles.messageContent}>
                <View style={styles.messageHeader}>
                  <Text style={styles.messageName}>{item.name}, {item.age}</Text>
                  <Text style={styles.messageTime}>{item.lastActive}</Text>
                </View>
                <View style={styles.messagePreview}>
                  <Text 
                    style={[
                      styles.messageText,
                      item.unread && styles.messageUnread
                    ]}
                    numberOfLines={1}
                  >
                    {item.message}
                  </Text>
                  {item.unread && (
                    <View style={styles.unreadBadge}>
                      <Text style={styles.unreadText}>1</Text>
                    </View>
                  )}
                </View>
              </View>
            </TouchableOpacity>
          )}
          contentContainerStyle={styles.messagesList}
        />
      </View>
      
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
    paddingHorizontal: Theme.spacing.md,
    paddingVertical: Theme.spacing.md,
    alignItems: 'center',
  },
  title: {
    fontFamily: Theme.typography.fontFamily.heading,
    fontSize: Theme.typography.fontSize.xxl,
    color: Theme.colors.primary.blue,
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
  filterButton: {
    backgroundColor: Theme.colors.background.white,
    borderRadius: Theme.borderRadius.md,
    padding: Theme.spacing.sm,
    alignItems: 'center',
    justifyContent: 'center',
    width: 48,
    height: 48,
    ...Theme.shadows.small,
  },
  newMatchesSection: {
    paddingHorizontal: Theme.spacing.md,
    marginBottom: Theme.spacing.lg,
  },
  sectionTitle: {
    fontFamily: Theme.typography.fontFamily.subheading,
    fontSize: Theme.typography.fontSize.lg,
    color: Theme.colors.text.dark,
    marginBottom: Theme.spacing.md,
  },
  newMatchesList: {
    paddingRight: Theme.spacing.md,
  },
  newMatchCard: {
    alignItems: 'center',
    marginRight: Theme.spacing.md,
  },
  matchImageContainer: {
    width: 80,
    height: 80,
    borderRadius: Theme.borderRadius.circle,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: Theme.colors.primary.pink,
    marginBottom: Theme.spacing.sm,
  },
  matchImage: {
    width: '100%',
    height: '100%',
  },
  newMatchName: {
    fontFamily: Theme.typography.fontFamily.subheading,
    fontSize: Theme.typography.fontSize.sm,
    color: Theme.colors.text.dark,
  },
  messagesSection: {
    flex: 1,
    paddingHorizontal: Theme.spacing.md,
  },
  messagesList: {
    paddingBottom: Theme.spacing.lg,
  },
  messageRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Theme.colors.ui.border,
  },
  messageImageContainer: {
    width: 60,
    height: 60,
    borderRadius: Theme.borderRadius.circle,
    overflow: 'hidden',
    marginRight: Theme.spacing.md,
  },
  messageImage: {
    width: '100%',
    height: '100%',
  },
  onlineIndicator: {
    width: 12,
    height: 12,
    borderRadius: Theme.borderRadius.circle,
    backgroundColor: Theme.colors.status.success,
    borderWidth: 2,
    borderColor: Theme.colors.background.white,
    position: 'absolute',
    bottom: 0,
    right: 0,
  },
  messageContent: {
    flex: 1,
  },
  messageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Theme.spacing.xs,
  },
  messageName: {
    fontFamily: Theme.typography.fontFamily.subheading,
    fontSize: Theme.typography.fontSize.md,
    color: Theme.colors.text.dark,
  },
  messageTime: {
    fontFamily: Theme.typography.fontFamily.body,
    fontSize: Theme.typography.fontSize.xs,
    color: Theme.colors.text.medium,
  },
  messagePreview: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  messageText: {
    flex: 1,
    fontFamily: Theme.typography.fontFamily.body,
    fontSize: Theme.typography.fontSize.sm,
    color: Theme.colors.text.medium,
  },
  messageUnread: {
    fontFamily: Theme.typography.fontFamily.bodyBold,
    color: Theme.colors.text.dark,
  },
  unreadBadge: {
    backgroundColor: Theme.colors.primary.pink,
    borderRadius: Theme.borderRadius.circle,
    width: 22,
    height: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: Theme.spacing.sm,
  },
  unreadText: {
    fontFamily: Theme.typography.fontFamily.subheading,
    fontSize: Theme.typography.fontSize.xs,
    color: Theme.colors.background.white,
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