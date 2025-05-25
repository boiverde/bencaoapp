import { StyleSheet, View, Text, FlatList, Image, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Theme from '@/constants/Theme';
import { Search, Filter, Heart, MessageSquare, Church } from 'lucide-react-native';
import { TextInput } from 'react-native-gesture-handler';

// Mock data
const FOLLOWING = [
  {
    id: '1',
    name: 'Mariana',
    age: 28,
    denomination: 'Batista',
    distance: '5km',
    image: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    isOnline: true,
    lastActive: 'Agora',
    mutualConnections: 12,
  },
  {
    id: '2',
    name: 'João',
    age: 30,
    denomination: 'Católico',
    distance: '8km',
    image: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    isOnline: false,
    lastActive: '2h atrás',
    mutualConnections: 8,
  },
  {
    id: '3',
    name: 'Gabriela',
    age: 26,
    denomination: 'Presbiteriana',
    distance: '3km',
    image: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    isOnline: true,
    lastActive: 'Agora',
    mutualConnections: 15,
  },
];

export default function CommunityScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Comunidade Abençoada</Text>
        <Text style={styles.subtitle}>Pessoas que você segue</Text>
      </View>

      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Search size={20} color={Theme.colors.text.medium} />
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar na comunidade..."
            placeholderTextColor={Theme.colors.text.medium}
          />
        </View>
        <TouchableOpacity style={styles.filterButton}>
          <Filter size={20} color={Theme.colors.primary.blue} />
        </TouchableOpacity>
      </View>

      <FlatList
        data={FOLLOWING}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <View style={styles.userInfo}>
                <View style={styles.avatarContainer}>
                  <Image source={{ uri: item.image }} style={styles.avatar} />
                  {item.isOnline && <View style={styles.onlineIndicator} />}
                </View>
                <View>
                  <Text style={styles.name}>{item.name}, {item.age}</Text>
                  <View style={styles.denominationContainer}>
                    <Church size={14} color={Theme.colors.primary.lilac} />
                    <Text style={styles.denomination}>{item.denomination}</Text>
                  </View>
                </View>
              </View>
              <Text style={styles.distance}>{item.distance}</Text>
            </View>

            <View style={styles.cardFooter}>
              <View style={styles.mutualConnections}>
                <Text style={styles.mutualText}>
                  {item.mutualConnections} conexões em comum
                </Text>
              </View>
              <View style={styles.actions}>
                <TouchableOpacity style={styles.actionButton}>
                  <MessageSquare size={20} color={Theme.colors.primary.blue} />
                </TouchableOpacity>
                <TouchableOpacity style={[styles.actionButton, styles.likeButton]}>
                  <Heart size={20} color="#fff" fill="#fff" />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
        contentContainerStyle={styles.list}
      />
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
    marginBottom: Theme.spacing.xs,
  },
  subtitle: {
    fontFamily: Theme.typography.fontFamily.body,
    fontSize: Theme.typography.fontSize.md,
    color: Theme.colors.text.medium,
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
  list: {
    padding: Theme.spacing.md,
  },
  card: {
    backgroundColor: Theme.colors.background.white,
    borderRadius: Theme.borderRadius.lg,
    padding: Theme.spacing.md,
    marginBottom: Theme.spacing.md,
    ...Theme.shadows.small,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Theme.spacing.md,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarContainer: {
    width: 60,
    height: 60,
    borderRadius: Theme.borderRadius.circle,
    marginRight: Theme.spacing.md,
  },
  avatar: {
    width: '100%',
    height: '100%',
    borderRadius: Theme.borderRadius.circle,
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
  name: {
    fontFamily: Theme.typography.fontFamily.subheading,
    fontSize: Theme.typography.fontSize.lg,
    color: Theme.colors.text.dark,
    marginBottom: Theme.spacing.xs,
  },
  denominationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  denomination: {
    fontFamily: Theme.typography.fontFamily.body,
    fontSize: Theme.typography.fontSize.sm,
    color: Theme.colors.primary.lilac,
    marginLeft: Theme.spacing.xs,
  },
  distance: {
    fontFamily: Theme.typography.fontFamily.body,
    fontSize: Theme.typography.fontSize.sm,
    color: Theme.colors.text.medium,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: Theme.spacing.md,
    borderTopWidth: 1,
    borderTopColor: Theme.colors.ui.border,
  },
  mutualConnections: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  mutualText: {
    fontFamily: Theme.typography.fontFamily.body,
    fontSize: Theme.typography.fontSize.sm,
    color: Theme.colors.text.medium,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    width: 40,
    height: 40,
    borderRadius: Theme.borderRadius.circle,
    backgroundColor: Theme.colors.background.light,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: Theme.spacing.sm,
  },
  likeButton: {
    backgroundColor: Theme.colors.primary.pink,
  },
});