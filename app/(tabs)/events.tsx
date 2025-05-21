import { StyleSheet, View, Text, FlatList, Image, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Theme from '@/constants/Theme';
import { Calendar, MapPin, Users, Clock, ChevronRight } from 'lucide-react-native';

// Mock data
const EVENTS = [
  {
    id: '1',
    title: 'Encontro de Jovens Cristãos',
    date: '15 de Maio, 2025',
    time: '19:00',
    location: 'Igreja Batista Central',
    distance: '5km',
    attendees: 58,
    image: 'https://images.pexels.com/photos/2014775/pexels-photo-2014775.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    type: 'featured',
  },
  {
    id: '2',
    title: 'Workshop: Relacionamentos à Luz da Bíblia',
    date: '22 de Maio, 2025',
    time: '14:00',
    location: 'Centro de Eventos Cristãos',
    distance: '8km',
    attendees: 32,
    image: 'https://images.pexels.com/photos/5831711/pexels-photo-5831711.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    type: 'workshop',
  },
  {
    id: '3',
    title: 'Retiro para Solteiros',
    date: '05-07 de Junho, 2025',
    time: 'Todo o dia',
    location: 'Acampamento Águas Vivas',
    distance: '25km',
    attendees: 120,
    image: 'https://images.pexels.com/photos/754769/pexels-photo-754769.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    type: 'retreat',
  },
  {
    id: '4',
    title: 'Culto Especial para Casais',
    date: '10 de Junho, 2025',
    time: '19:30',
    location: 'Igreja Presbiteriana Central',
    distance: '7km',
    attendees: 85,
    image: 'https://images.pexels.com/photos/8463998/pexels-photo-8463998.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    type: 'service',
  },
];

const EVENT_CATEGORIES = [
  { id: 'all', name: 'Todos' },
  { id: 'featured', name: 'Destaques' },
  { id: 'workshop', name: 'Workshops' },
  { id: 'retreat', name: 'Retiros' },
  { id: 'service', name: 'Cultos' },
];

export default function EventsScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Eventos Cristãos</Text>
      </View>
      
      <View style={styles.categories}>
        <FlatList
          horizontal
          data={EVENT_CATEGORIES}
          keyExtractor={(item) => item.id}
          renderItem={({ item, index }) => (
            <TouchableOpacity 
              style={[
                styles.categoryButton,
                index === 0 && styles.categoryButtonActive
              ]}
            >
              <Text 
                style={[
                  styles.categoryText,
                  index === 0 && styles.categoryTextActive
                ]}
              >
                {item.name}
              </Text>
            </TouchableOpacity>
          )}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesList}
        />
      </View>
      
      <View style={styles.featuredSection}>
        <Text style={styles.sectionTitle}>Eventos em Destaque</Text>
        <FlatList
          horizontal
          data={EVENTS.filter(event => event.type === 'featured')}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.featuredCard}>
              <Image source={{ uri: item.image }} style={styles.featuredImage} />
              <View style={styles.featuredContent}>
                <Text style={styles.featuredTitle}>{item.title}</Text>
                <View style={styles.featuredInfo}>
                  <View style={styles.infoRow}>
                    <Calendar size={16} color={Theme.colors.primary.blue} />
                    <Text style={styles.infoText}>{item.date}</Text>
                  </View>
                  <View style={styles.infoRow}>
                    <MapPin size={16} color={Theme.colors.primary.blue} />
                    <Text style={styles.infoText}>{item.location}</Text>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          )}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.featuredList}
        />
      </View>
      
      <View style={styles.upcomingSection}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Próximos Eventos</Text>
          <TouchableOpacity>
            <Text style={styles.seeAllText}>Ver todos</Text>
          </TouchableOpacity>
        </View>
        
        <FlatList
          data={EVENTS}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.eventCard}>
              <Image source={{ uri: item.image }} style={styles.eventImage} />
              <View style={styles.eventContent}>
                <Text style={styles.eventTitle} numberOfLines={1}>{item.title}</Text>
                <View style={styles.eventDetails}>
                  <View style={styles.eventInfo}>
                    <Clock size={14} color={Theme.colors.text.medium} />
                    <Text style={styles.eventInfoText}>{item.date} • {item.time}</Text>
                  </View>
                  <View style={styles.eventInfo}>
                    <MapPin size={14} color={Theme.colors.text.medium} />
                    <Text style={styles.eventInfoText}>{item.location} ({item.distance})</Text>
                  </View>
                  <View style={styles.eventInfo}>
                    <Users size={14} color={Theme.colors.text.medium} />
                    <Text style={styles.eventInfoText}>{item.attendees} participantes</Text>
                  </View>
                </View>
              </View>
              <View style={styles.eventArrow}>
                <ChevronRight size={20} color={Theme.colors.text.medium} />
              </View>
            </TouchableOpacity>
          )}
          contentContainerStyle={styles.eventsList}
        />
      </View>
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
  categories: {
    marginBottom: Theme.spacing.md,
  },
  categoriesList: {
    paddingHorizontal: Theme.spacing.md,
  },
  categoryButton: {
    paddingHorizontal: Theme.spacing.md,
    paddingVertical: Theme.spacing.sm,
    borderRadius: Theme.borderRadius.md,
    marginRight: Theme.spacing.sm,
    backgroundColor: Theme.colors.background.white,
  },
  categoryButtonActive: {
    backgroundColor: Theme.colors.primary.blue,
  },
  categoryText: {
    fontFamily: Theme.typography.fontFamily.subheading,
    fontSize: Theme.typography.fontSize.sm,
    color: Theme.colors.text.dark,
  },
  categoryTextActive: {
    color: Theme.colors.background.white,
  },
  featuredSection: {
    marginBottom: Theme.spacing.lg,
  },
  sectionTitle: {
    fontFamily: Theme.typography.fontFamily.subheading,
    fontSize: Theme.typography.fontSize.lg,
    color: Theme.colors.text.dark,
    paddingHorizontal: Theme.spacing.md,
    marginBottom: Theme.spacing.md,
  },
  featuredList: {
    paddingLeft: Theme.spacing.md,
  },
  featuredCard: {
    width: 280,
    borderRadius: Theme.borderRadius.lg,
    backgroundColor: Theme.colors.background.white,
    overflow: 'hidden',
    marginRight: Theme.spacing.md,
    ...Theme.shadows.medium,
  },
  featuredImage: {
    width: '100%',
    height: 150,
  },
  featuredContent: {
    padding: Theme.spacing.md,
  },
  featuredTitle: {
    fontFamily: Theme.typography.fontFamily.subheading,
    fontSize: Theme.typography.fontSize.md,
    color: Theme.colors.text.dark,
    marginBottom: Theme.spacing.sm,
  },
  featuredInfo: {
    gap: Theme.spacing.xs,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoText: {
    fontFamily: Theme.typography.fontFamily.body,
    fontSize: Theme.typography.fontSize.sm,
    color: Theme.colors.text.medium,
    marginLeft: Theme.spacing.xs,
  },
  upcomingSection: {
    flex: 1,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingRight: Theme.spacing.md,
    marginBottom: Theme.spacing.md,
  },
  seeAllText: {
    fontFamily: Theme.typography.fontFamily.subheading,
    fontSize: Theme.typography.fontSize.sm,
    color: Theme.colors.primary.blue,
  },
  eventsList: {
    paddingHorizontal: Theme.spacing.md,
    paddingBottom: Theme.spacing.xl,
  },
  eventCard: {
    flexDirection: 'row',
    borderRadius: Theme.borderRadius.md,
    backgroundColor: Theme.colors.background.white,
    marginBottom: Theme.spacing.md,
    overflow: 'hidden',
    ...Theme.shadows.small,
  },
  eventImage: {
    width: 80,
    height: 80,
  },
  eventContent: {
    flex: 1,
    padding: Theme.spacing.md,
  },
  eventTitle: {
    fontFamily: Theme.typography.fontFamily.subheading,
    fontSize: Theme.typography.fontSize.md,
    color: Theme.colors.text.dark,
    marginBottom: Theme.spacing.xs,
  },
  eventDetails: {
    gap: Theme.spacing.xs,
  },
  eventInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  eventInfoText: {
    fontFamily: Theme.typography.fontFamily.body,
    fontSize: Theme.typography.fontSize.xs,
    color: Theme.colors.text.medium,
    marginLeft: Theme.spacing.xs,
  },
  eventArrow: {
    justifyContent: 'center',
    paddingRight: Theme.spacing.sm,
  },
});