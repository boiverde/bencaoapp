import { StyleSheet, View, Text, Image, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Theme from '@/constants/Theme';
import { Settings, Heart, LogOut, CreditCard as Edit, Church, Globe, Book, MapPin } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

// Mock user data
const USER = {
  id: '1',
  name: 'Ana Clara',
  age: 27,
  location: 'São Paulo, Brasil',
  denomination: 'Batista',
  church: 'Igreja Batista Central',
  languages: ['Português', 'Inglês', 'Espanhol'],
  verse: 'Mas buscai primeiro o Reino de Deus, e a sua justiça, e todas as coisas vos serão acrescentadas. Mateus 6:33',
  bio: 'Amo música, viagens e servir ao Senhor. Sou professora, gosto de ler e estou em busca de alguém que compartilhe da mesma fé e valores.',
  image: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
  photos: [
    'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    'https://images.pexels.com/photos/1181690/pexels-photo-1181690.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    'https://images.pexels.com/photos/1181673/pexels-photo-1181673.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
  ],
  interests: ['Música', 'Viagens', 'Leitura', 'Ensino', 'Evangelismo', 'Voluntariado'],
  stats: {
    matches: 15,
    likes: 32,
    prayers: 8,
  }
};

export default function ProfileScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.header}>
          <View style={styles.headerActions}>
            <TouchableOpacity style={styles.iconButton}>
              <Settings size={24} color={Theme.colors.text.dark} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconButton}>
              <LogOut size={24} color={Theme.colors.text.dark} />
            </TouchableOpacity>
          </View>
          
          <View style={styles.profileHeader}>
            <View style={styles.profileImageContainer}>
              <Image source={{ uri: USER.image }} style={styles.profileImage} />
              <TouchableOpacity style={styles.editButton}>
                <Edit size={16} color="#fff" />
              </TouchableOpacity>
            </View>
            <Text style={styles.profileName}>{USER.name}, {USER.age}</Text>
            <View style={styles.locationContainer}>
              <MapPin size={16} color={Theme.colors.text.medium} />
              <Text style={styles.locationText}>{USER.location}</Text>
            </View>
          </View>
          
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{USER.stats.matches}</Text>
              <Text style={styles.statLabel}>Conexões</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{USER.stats.likes}</Text>
              <Text style={styles.statLabel}>Curtidas</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{USER.stats.prayers}</Text>
              <Text style={styles.statLabel}>Orações</Text>
            </View>
          </View>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Informações Religiosas</Text>
          <View style={styles.infoRow}>
            <Church size={18} color={Theme.colors.primary.blue} />
            <View>
              <Text style={styles.infoLabel}>Denominação</Text>
              <Text style={styles.infoValue}>{USER.denomination}</Text>
            </View>
          </View>
          <View style={styles.infoRow}>
            <MapPin size={18} color={Theme.colors.primary.blue} />
            <View>
              <Text style={styles.infoLabel}>Igreja</Text>
              <Text style={styles.infoValue}>{USER.church}</Text>
            </View>
          </View>
          <View style={styles.infoRow}>
            <Globe size={18} color={Theme.colors.primary.blue} />
            <View>
              <Text style={styles.infoLabel}>Idiomas</Text>
              <Text style={styles.infoValue}>{USER.languages.join(', ')}</Text>
            </View>
          </View>
          <View style={styles.verseContainer}>
            <Book size={18} color={Theme.colors.primary.lilac} />
            <Text style={styles.verseText}>"{USER.verse}"</Text>
          </View>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Sobre Mim</Text>
          <Text style={styles.bioText}>{USER.bio}</Text>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Minhas Fotos</Text>
          <View style={styles.photosGrid}>
            {USER.photos.map((photo, index) => (
              <View key={index} style={styles.photoContainer}>
                <Image source={{ uri: photo }} style={styles.photo} />
              </View>
            ))}
            <TouchableOpacity style={styles.addPhotoButton}>
              <Text style={styles.addPhotoText}>+</Text>
            </TouchableOpacity>
          </View>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Interesses</Text>
          <View style={styles.interestsContainer}>
            {USER.interests.map((interest, index) => (
              <View key={index} style={styles.interestTag}>
                <Text style={styles.interestText}>{interest}</Text>
              </View>
            ))}
          </View>
        </View>
        
        <TouchableOpacity style={styles.editProfileButton}>
          <Text style={styles.editProfileText}>Editar Perfil</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.colors.background.light,
  },
  header: {
    backgroundColor: Theme.colors.background.white,
    borderBottomLeftRadius: Theme.borderRadius.lg,
    borderBottomRightRadius: Theme.borderRadius.lg,
    paddingBottom: Theme.spacing.lg,
    marginBottom: Theme.spacing.lg,
    ...Theme.shadows.small,
  },
  headerActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: Theme.spacing.md,
    paddingVertical: Theme.spacing.md,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: Theme.borderRadius.circle,
    backgroundColor: Theme.colors.background.light,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileHeader: {
    alignItems: 'center',
    marginVertical: Theme.spacing.md,
  },
  profileImageContainer: {
    width: 100,
    height: 100,
    borderRadius: Theme.borderRadius.circle,
    marginBottom: Theme.spacing.md,
  },
  profileImage: {
    width: '100%',
    height: '100%',
    borderRadius: Theme.borderRadius.circle,
    borderWidth: 3,
    borderColor: Theme.colors.primary.pink,
  },
  editButton: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    width: 32,
    height: 32,
    borderRadius: Theme.borderRadius.circle,
    backgroundColor: Theme.colors.primary.blue,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: Theme.colors.background.white,
  },
  profileName: {
    fontFamily: Theme.typography.fontFamily.heading,
    fontSize: Theme.typography.fontSize.xl,
    color: Theme.colors.text.dark,
    marginBottom: Theme.spacing.xs,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationText: {
    fontFamily: Theme.typography.fontFamily.body,
    fontSize: Theme.typography.fontSize.sm,
    color: Theme.colors.text.medium,
    marginLeft: Theme.spacing.xs,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: Theme.spacing.md,
    marginTop: Theme.spacing.md,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontFamily: Theme.typography.fontFamily.heading,
    fontSize: Theme.typography.fontSize.xl,
    color: Theme.colors.primary.blue,
  },
  statLabel: {
    fontFamily: Theme.typography.fontFamily.body,
    fontSize: Theme.typography.fontSize.sm,
    color: Theme.colors.text.medium,
  },
  statDivider: {
    width: 1,
    height: '70%',
    backgroundColor: Theme.colors.ui.border,
    alignSelf: 'center',
  },
  section: {
    backgroundColor: Theme.colors.background.white,
    borderRadius: Theme.borderRadius.lg,
    padding: Theme.spacing.md,
    marginBottom: Theme.spacing.md,
    marginHorizontal: Theme.spacing.md,
    ...Theme.shadows.small,
  },
  sectionTitle: {
    fontFamily: Theme.typography.fontFamily.subheading,
    fontSize: Theme.typography.fontSize.lg,
    color: Theme.colors.text.dark,
    marginBottom: Theme.spacing.md,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Theme.spacing.md,
  },
  infoLabel: {
    fontFamily: Theme.typography.fontFamily.body,
    fontSize: Theme.typography.fontSize.sm,
    color: Theme.colors.text.medium,
    marginLeft: Theme.spacing.md,
  },
  infoValue: {
    fontFamily: Theme.typography.fontFamily.subheading,
    fontSize: Theme.typography.fontSize.md,
    color: Theme.colors.text.dark,
    marginLeft: Theme.spacing.md,
  },
  verseContainer: {
    flexDirection: 'row',
    backgroundColor: Theme.colors.background.lilac,
    padding: Theme.spacing.md,
    borderRadius: Theme.borderRadius.md,
    borderLeftWidth: 3,
    borderLeftColor: Theme.colors.primary.lilac,
    alignItems: 'flex-start',
  },
  verseText: {
    fontFamily: Theme.typography.fontFamily.verse,
    fontSize: Theme.typography.fontSize.md,
    color: Theme.colors.text.dark,
    marginLeft: Theme.spacing.md,
    flex: 1,
  },
  bioText: {
    fontFamily: Theme.typography.fontFamily.body,
    fontSize: Theme.typography.fontSize.md,
    color: Theme.colors.text.dark,
    lineHeight: 24,
  },
  photosGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  photoContainer: {
    width: '31%',
    aspectRatio: 1,
    marginBottom: Theme.spacing.sm,
    borderRadius: Theme.borderRadius.md,
    overflow: 'hidden',
  },
  photo: {
    width: '100%',
    height: '100%',
  },
  addPhotoButton: {
    width: '31%',
    aspectRatio: 1,
    borderRadius: Theme.borderRadius.md,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: Theme.colors.ui.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addPhotoText: {
    fontFamily: Theme.typography.fontFamily.heading,
    fontSize: 24,
    color: Theme.colors.text.medium,
  },
  interestsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  interestTag: {
    backgroundColor: Theme.colors.background.lilac,
    paddingVertical: Theme.spacing.xs,
    paddingHorizontal: Theme.spacing.md,
    borderRadius: Theme.borderRadius.md,
    marginRight: Theme.spacing.sm,
    marginBottom: Theme.spacing.sm,
  },
  interestText: {
    fontFamily: Theme.typography.fontFamily.body,
    fontSize: Theme.typography.fontSize.sm,
    color: Theme.colors.primary.blue,
  },
  editProfileButton: {
    backgroundColor: Theme.colors.primary.blue,
    borderRadius: Theme.borderRadius.md,
    paddingVertical: Theme.spacing.md,
    marginHorizontal: Theme.spacing.md,
    marginBottom: Theme.spacing.xl,
    alignItems: 'center',
  },
  editProfileText: {
    fontFamily: Theme.typography.fontFamily.subheading,
    fontSize: Theme.typography.fontSize.md,
    color: Theme.colors.background.white,
  },
});