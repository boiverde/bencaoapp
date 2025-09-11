
import { StyleSheet, View, Text, Image, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState, useEffect, useCallback } from 'react';
import { useFocusEffect } from 'expo-router';
import Theme from '@/constants/Theme';
import { Settings, LogOut, CreditCard as Edit, Church, Globe, Book, MapPin } from 'lucide-react-native';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/utils/supabase';

// A interface Profile agora representa a estrutura da sua tabela 'profiles'
interface Profile {
  id: string;
  updated_at: string;
  full_name: string;
  avatar_url: string | null;
  age: number | null;
  location: string | null;
  denomination: string | null;
  church: string | null;
  languages: string[] | null;
  verse: string | null;
  bio: string | null;
  photos: string[] | null;
  interests: string[] | null;
}

// Stats podem ser calculados ou obtidos de outras tabelas no futuro
interface Stats {
  matches: number;
  likes: number;
  prayers: number;
}

export default function ProfileScreen() {
  const { user, signOut, session } = useAuth(); // Obtém o utilizador e a função signOut do hook de autenticação
  const [profile, setProfile] = useState<Profile | null>(null);
  const [stats, setStats] = useState<Stats>({ matches: 0, likes: 0, prayers: 0 });
  const [loading, setLoading] = useState(true);

  const fetchProfile = async () => {
    if (!user) return;

    setLoading(true);
    try {
      // Vai buscar os dados do perfil à tabela 'profiles'
      const { data, error } = await supabase
        .from('profiles')
        .select('*') // Seleciona todas as colunas
        .eq('id', user.id)
        .single(); // Espera um único resultado

      if (error) {
        console.error("Erro ao buscar perfil:", error);
        throw error;
      }
      if (data) {
        setProfile(data);
      }
    } catch (error) {
      // Tratar o erro (ex: mostrar uma mensagem ao utilizador)
    } finally {
      setLoading(false);
    }
  };

  // useFocusEffect para recarregar os dados sempre que o ecrã fica em foco
  useFocusEffect(
    useCallback(() => {
      fetchProfile();
      // Aqui, você também pode ir buscar os stats
      // Ex: fetchStats();
    }, [user])
  );

  if (loading || !profile) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator style={{ flex: 1 }} size="large" color={Theme.colors.primary.blue} />
      </SafeAreaView>
    );
  }

  // Agora, usamos os dados de `profile` e `user` para preencher o ecrã
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.header}>
           <View style={styles.headerActions}>
            <TouchableOpacity style={styles.iconButton}>
              <Settings size={24} color={Theme.colors.text.dark} />
            </TouchableOpacity>
            <TouchableOpacity onPress={signOut} style={styles.iconButton}>
              <LogOut size={24} color={Theme.colors.text.dark} />
            </TouchableOpacity>
          </View>
          
          <View style={styles.profileHeader}>
            <View style={styles.profileImageContainer}>
              <Image source={{ uri: profile.avatar_url || 'https://exemplo.com/avatar_padrao.png' }} style={styles.profileImage} />
              <TouchableOpacity style={styles.editButton}>
                <Edit size={16} color="#fff" />
              </TouchableOpacity>
            </View>
            <Text style={styles.profileName}>{profile.full_name}{profile.age ? `, ${profile.age}` : ''}</Text>
            {profile.location && (
              <View style={styles.locationContainer}>
                <MapPin size={16} color={Theme.colors.text.medium} />
                <Text style={styles.locationText}>{profile.location}</Text>
              </View>
            )}
          </View>
          
          <View style={styles.statsContainer}>
            {/* ... stats ... */}
          </View>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Informações Religiosas</Text>
          {profile.denomination && <InfoRow icon={Church} label="Denominação" value={profile.denomination} />}
          {profile.church && <InfoRow icon={MapPin} label="Igreja" value={profile.church} />}
          {profile.languages && <InfoRow icon={Globe} label="Idiomas" value={profile.languages.join(', ')} />}
          {profile.verse && 
            <View style={styles.verseContainer}>
              <Book size={18} color={Theme.colors.primary.lilac} />
              <Text style={styles.verseText}>"{profile.verse}"</Text>
            </View>
          }
        </View>
        
        {profile.bio &&
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Sobre Mim</Text>
            <Text style={styles.bioText}>{profile.bio}</Text>
          </View>
        }
        
        {profile.photos && profile.photos.length > 0 &&
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Minhas Fotos</Text>
             {/* ... implementação da grelha de fotos ... */}
          </View>
        }
        
        {profile.interests && profile.interests.length > 0 &&
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Interesses</Text>
            {/* ... implementação das tags de interesse ... */}
          </View>
        }

      </ScrollView>
    </SafeAreaView>
  );
}

// Componente auxiliar para evitar repetição
const InfoRow = ({ icon: Icon, label, value }) => (
  <View style={styles.infoRow}>
    <Icon size={18} color={Theme.colors.primary.blue} />
    <View>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  </View>
);


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
});