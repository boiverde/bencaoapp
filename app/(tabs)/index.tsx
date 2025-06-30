import { useRef, useState, useCallback, useMemo } from 'react';
import { StyleSheet, View, Text, Animated, PanResponder } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import Theme from '@/constants/Theme';
import { Heart, X, MapPin, Globe, Church, Star, Trophy, Target } from 'lucide-react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import NotificationBell from '@/components/UI/NotificationBell';
import NotificationModal from '@/components/UI/NotificationModal';
import { useNotifications } from '@/hooks/useNotifications';
import { useGamification } from '@/hooks/useGamification';
import CompatibilityDisplay from '@/components/UI/CompatibilityDisplay';
import { CompatibilityAlgorithm, UserProfile } from '@/utils/compatibilityAlgorithm';
import OptimizedImage from '@/components/UI/OptimizedImage';

// Mock data
const PROFILES = [
  {
    id: '1',
    name: 'Mariana',
    age: 28,
    denomination: 'Batista',
    location: {
      state: 'São Paulo',
      city: 'São Paulo',
      coordinates: { latitude: -23.5505, longitude: -46.6333 }
    },
    languages: ['Português', 'Inglês'],
    interests: ['Música', 'Viagens', 'Leitura', 'Ensino', 'Evangelismo'],
    education: 'Graduação',
    churchFrequency: 2,
    children: 0,
    height: 165,
    zodiacSign: 'Virgem',
    favoriteWorship: 'Deus é Deus - Delino Marçal',
    aboutMe: 'Amo música, viagens e servir ao Senhor. Sou professora, gosto de ler e estou em busca de alguém que compartilhe da mesma fé e valores.',
    verse: 'O amor é paciente, o amor é bondoso. Não inveja, não se vangloria, não se orgulha. 1 Coríntios 13:4',
    image: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    photos: ['https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg'],
    preferences: {
      ageRange: [25, 35] as [number, number],
      maxDistance: 50,
      denominations: ['Batista', 'Presbiteriana'],
      education: ['Graduação', 'Pós-graduação'],
      children: 'no-preference',
      languages: ['Português']
    },
    personality: {
      extroversion: 7,
      agreeableness: 8,
      conscientiousness: 9,
      spirituality: 9,
      familyOriented: 8
    },
    values: {
      marriageImportance: 9,
      familyImportance: 9,
      careerImportance: 7,
      faithImportance: 10,
      communityImportance: 8
    },
    lifestyle: {
      smokingTolerance: 'never' as const,
      drinkingTolerance: 'socially' as const,
      exerciseFrequency: 3,
      socialLevel: 6
    }
  },
  {
    id: '2',
    name: 'João',
    age: 30,
    denomination: 'Católico',
    location: {
      state: 'Rio de Janeiro',
      city: 'Rio de Janeiro',
      coordinates: { latitude: -22.9068, longitude: -43.1729 }
    },
    languages: ['Português', 'Espanhol'],
    interests: ['Música', 'Esportes', 'Evangelismo', 'Voluntariado'],
    education: 'Pós-graduação',
    churchFrequency: 2,
    children: 0,
    height: 180,
    zodiacSign: 'Leão',
    favoriteWorship: 'Reckless Love - Cory Asbury',
    aboutMe: 'Engenheiro apaixonado por servir a Deus e ajudar o próximo.',
    verse: 'Porque Deus amou o mundo de tal maneira que deu o seu Filho unigênito, para que todo aquele que nele crê não pereça, mas tenha a vida eterna. João 3:16',
    image: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    photos: ['https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg'],
    preferences: {
      ageRange: [24, 32] as [number, number],
      maxDistance: 100,
      denominations: ['Batista', 'Presbiteriana'],
      education: ['Graduação', 'Pós-graduação'],
      children: 'no-preference',
      languages: ['Português']
    },
    personality: {
      extroversion: 6,
      agreeableness: 9,
      conscientiousness: 8,
      spirituality: 9,
      familyOriented: 9
    },
    values: {
      marriageImportance: 9,
      familyImportance: 10,
      careerImportance: 8,
      faithImportance: 10,
      communityImportance: 9
    },
    lifestyle: {
      smokingTolerance: 'never' as const,
      drinkingTolerance: 'never' as const,
      exerciseFrequency: 4,
      socialLevel: 7
    }
  }
];

// Mock current user for compatibility calculation
const CURRENT_USER: UserProfile = {
  id: 'current-user',
  name: 'Ana Clara',
  age: 27,
  denomination: 'Batista',
  location: {
    state: 'São Paulo',
    city: 'São Paulo',
    coordinates: { latitude: -23.5505, longitude: -46.6333 }
  },
  languages: ['Português', 'Inglês'],
  interests: ['Música', 'Viagens', 'Leitura', 'Ensino', 'Evangelismo'],
  education: 'Graduação',
  churchFrequency: 2,
  children: 0,
  height: 165,
  zodiacSign: 'Virgem',
  favoriteWorship: 'Deus é Deus - Delino Marçal',
  aboutMe: 'Amo música, viagens e servir ao Senhor. Sou professora, gosto de ler e estou em busca de alguém que compartilhe da mesma fé e valores.',
  verse: 'Mas buscai primeiro o Reino de Deus, e a sua justiça, e todas as coisas vos serão acrescentadas. Mateus 6:33',
  photos: ['https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg'],
  preferences: {
    ageRange: [25, 35],
    maxDistance: 50,
    denominations: ['Batista', 'Presbiteriana'],
    education: ['Graduação', 'Pós-graduação'],
    children: 'no-preference',
    languages: ['Português']
  },
  personality: {
    extroversion: 7,
    agreeableness: 8,
    conscientiousness: 9,
    spirituality: 9,
    familyOriented: 8
  },
  values: {
    marriageImportance: 9,
    familyImportance: 9,
    careerImportance: 7,
    faithImportance: 10,
    communityImportance: 8
  },
  lifestyle: {
    smokingTolerance: 'never',
    drinkingTolerance: 'socially',
    exerciseFrequency: 3,
    socialLevel: 6
  }
};

export default function DiscoverScreen() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [notificationModalVisible, setNotificationModalVisible] = useState(false);
  const [showCompatibility, setShowCompatibility] = useState(false);
  const swipe = useRef(new Animated.ValueXY()).current;
  const { sendMatchNotification } = useNotifications();
  const { handleConnectionMade, userStats, getCurrentLevel } = useGamification();
  
  const rotation = swipe.x.interpolate({
    inputRange: [-100, 0, 100],
    outputRange: ['-8deg', '0deg', '8deg'],
    extrapolate: 'clamp',
  });

  const panResponder = useMemo(() => PanResponder.create({
    onMoveShouldSetPanResponder: () => true,
    onPanResponderMove: (_, gesture) => {
      swipe.setValue({ x: gesture.dx, y: gesture.dy });
    },
    onPanResponderRelease: (_, gesture) => {
      const swipeDirection = gesture.dx > 100 ? 'right' : gesture.dx < -100 ? 'left' : 'none';
      
      if (swipeDirection === 'right') {
        Animated.spring(swipe, {
          toValue: { x: 500, y: gesture.dy },
          useNativeDriver: true,
        }).start(() => {
          // Send match notification and add gamification points
          const profile = PROFILES[currentIndex];
          if (profile) {
            sendMatchNotification(profile.name);
            handleConnectionMade();
          }
          setCurrentIndex(prevIndex => prevIndex + 1);
          swipe.setValue({ x: 0, y: 0 });
        });
      } else if (swipeDirection === 'left') {
        Animated.spring(swipe, {
          toValue: { x: -500, y: gesture.dy },
          useNativeDriver: true,
        }).start(() => {
          setCurrentIndex(prevIndex => prevIndex + 1);
          swipe.setValue({ x: 0, y: 0 });
        });
      } else {
        Animated.spring(swipe, {
          toValue: { x: 0, y: 0 },
          friction: 5,
          useNativeDriver: true,
        }).start();
      }
    },
  }), [swipe, currentIndex, sendMatchNotification, handleConnectionMade]);

  const handleLike = useCallback(() => {
    Animated.spring(swipe, {
      toValue: { x: 500, y: 0 },
      useNativeDriver: true,
    }).start(() => {
      // Send match notification and add gamification points
      const profile = PROFILES[currentIndex];
      if (profile) {
        sendMatchNotification(profile.name);
        handleConnectionMade();
      }
      setCurrentIndex(prevIndex => prevIndex + 1);
      swipe.setValue({ x: 0, y: 0 });
    });
  }, [swipe, currentIndex, sendMatchNotification, handleConnectionMade]);

  const handlePass = useCallback(() => {
    Animated.spring(swipe, {
      toValue: { x: -500, y: 0 },
      useNativeDriver: true,
    }).start(() => {
      setCurrentIndex(prevIndex => prevIndex + 1);
      swipe.setValue({ x: 0, y: 0 });
    });
  }, [swipe]);

  const handleFollow = useCallback(() => {
    // Here you would implement the follow functionality
    // For now, we'll just show a visual feedback
    const profile = PROFILES[currentIndex];
    console.log(`Following ${profile.name}`);
  }, [currentIndex]);

  const compatibilityScore = useMemo(() => {
    if (currentIndex >= PROFILES.length) return null;
    return CompatibilityAlgorithm.calculateCompatibility(CURRENT_USER, PROFILES[currentIndex]);
  }, [currentIndex]);

  if (currentIndex >= PROFILES.length) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Bênção Match</Text>
          <View style={styles.headerRight}>
            <View style={styles.levelBadge}>
              <Trophy size={16} color={Theme.colors.primary.gold} />
              <Text style={styles.levelText}>{getCurrentLevel().level}</Text>
            </View>
            <NotificationBell 
              onPress={() => setNotificationModalVisible(true)}
              color={Theme.colors.primary.blue}
            />
          </View>
        </View>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Não há mais perfis disponíveis.</Text>
          <Text style={styles.emptySubtext}>Tente novamente mais tarde ou ajuste seus filtros.</Text>
        </View>
        <NotificationModal
          visible={notificationModalVisible}
          onClose={() => setNotificationModalVisible(false)}
        />
      </SafeAreaView>
    );
  }

  const profile = PROFILES[currentIndex];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Bênção Match</Text>
        <View style={styles.headerRight}>
          <TouchableOpacity 
            style={styles.pointsBadge}
            onPress={() => setShowCompatibility(!showCompatibility)}
            accessible={true}
            accessibilityLabel={`Compatibilidade ${compatibilityScore?.overall}%`}
            accessibilityRole="button"
            accessibilityHint="Toque para ver detalhes de compatibilidade"
          >
            <Target size={16} color={Theme.colors.primary.blue} />
            <Text style={styles.pointsText}>{compatibilityScore?.overall}%</Text>
          </TouchableOpacity>
          <View style={styles.levelBadge}>
            <Trophy size={16} color={Theme.colors.primary.gold} />
            <Text style={styles.levelText}>{getCurrentLevel().level}</Text>
          </View>
          <NotificationBell 
            onPress={() => setNotificationModalVisible(true)}
            color={Theme.colors.primary.blue}
          />
        </View>
      </View>

      {showCompatibility && compatibilityScore && (
        <View style={styles.compatibilityContainer}>
          <CompatibilityDisplay 
            score={compatibilityScore} 
            compact 
          />
        </View>
      )}
      
      <View style={styles.cardContainer}>
        <Animated.View
          {...panResponder.panHandlers}
          style={[
            styles.card,
            {
              transform: [
                { translateX: swipe.x },
                { translateY: swipe.y },
                { rotate: rotation }
              ]
            }
          ]}
          accessible={true}
          accessibilityLabel={`Perfil de ${profile.name}, ${profile.age} anos, ${profile.denomination}`}
          accessibilityHint="Arraste para a direita para curtir, ou para a esquerda para passar"
        >
          <OptimizedImage 
            source={{ uri: profile.image }} 
            style={styles.image}
            width={400}
            height={600}
            quality={85}
            format="webp"
            accessibilityLabel={`Foto de ${profile.name}`}
          />
          
          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.8)']}
            style={styles.gradient}
          >
            <View style={styles.profileInfo}>
              <Text style={styles.nameAge}>{profile.name}, {profile.age}</Text>
              <View style={styles.denomContainer}>
                <Church size={16} color={Theme.colors.primary.lilac} />
                <Text style={styles.denomination}>{profile.denomination}</Text>
              </View>
              
              <View style={styles.infoRow}>
                <View style={styles.infoItem}>
                  <MapPin size={16} color={Theme.colors.text.light} />
                  <Text style={styles.infoText}>{profile.location.city}, {profile.location.state}</Text>
                </View>
                <View style={styles.infoItem}>
                  <Globe size={16} color={Theme.colors.text.light} />
                  <Text style={styles.infoText}>{profile.languages.join(', ')}</Text>
                </View>
              </View>
              
              <Text style={styles.verse}>"{profile.verse}"</Text>
            </View>
          </LinearGradient>
        </Animated.View>
      </View>
      
      <View style={styles.actionsContainer}>
        <TouchableOpacity 
          style={[styles.actionButton, styles.passButton]} 
          onPress={handlePass}
          accessible={true}
          accessibilityLabel="Passar"
          accessibilityRole="button"
          accessibilityHint="Toque para passar este perfil"
        >
          <X size={30} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.actionButton, styles.followButton]} 
          onPress={handleFollow}
          accessible={true}
          accessibilityLabel="Favoritar"
          accessibilityRole="button"
          accessibilityHint="Toque para favoritar este perfil"
        >
          <Star size={30} color="#fff" fill="#fff" />
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.actionButton, styles.likeButton]} 
          onPress={handleLike}
          accessible={true}
          accessibilityLabel="Curtir"
          accessibilityRole="button"
          accessibilityHint="Toque para curtir este perfil"
        >
          <Heart size={30} color="#fff" fill="#fff" />
        </TouchableOpacity>
      </View>

      <NotificationModal
        visible={notificationModalVisible}
        onClose={() => setNotificationModalVisible(false)}
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Theme.spacing.md,
    paddingVertical: Theme.spacing.md,
  },
  title: {
    fontFamily: Theme.typography.fontFamily.heading,
    fontSize: Theme.typography.fontSize.xxl,
    color: Theme.colors.primary.blue,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  pointsBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Theme.colors.background.white,
    paddingHorizontal: Theme.spacing.sm,
    paddingVertical: Theme.spacing.xs,
    borderRadius: Theme.borderRadius.md,
    marginRight: Theme.spacing.sm,
    ...Theme.shadows.small,
  },
  pointsText: {
    fontFamily: Theme.typography.fontFamily.subheading,
    fontSize: Theme.typography.fontSize.sm,
    color: Theme.colors.primary.blue,
    marginLeft: Theme.spacing.xs,
  },
  levelBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Theme.colors.background.white,
    paddingHorizontal: Theme.spacing.sm,
    paddingVertical: Theme.spacing.xs,
    borderRadius: Theme.borderRadius.md,
    marginRight: Theme.spacing.sm,
    ...Theme.shadows.small,
  },
  levelText: {
    fontFamily: Theme.typography.fontFamily.subheading,
    fontSize: Theme.typography.fontSize.sm,
    color: Theme.colors.primary.gold,
    marginLeft: Theme.spacing.xs,
  },
  compatibilityContainer: {
    marginHorizontal: Theme.spacing.md,
    marginBottom: Theme.spacing.sm,
  },
  cardContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Theme.spacing.md,
  },
  card: {
    width: '100%',
    height: '85%',
    borderRadius: Theme.borderRadius.lg,
    overflow: 'hidden',
    ...Theme.shadows.medium,
  },
  image: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  gradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: '40%',
    paddingHorizontal: Theme.spacing.md,
    paddingBottom: Theme.spacing.lg,
  },
  profileInfo: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  nameAge: {
    fontFamily: Theme.typography.fontFamily.heading,
    fontSize: Theme.typography.fontSize.xxl,
    color: Theme.colors.background.white,
    marginBottom: Theme.spacing.xs,
  },
  denomContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Theme.spacing.md,
  },
  denomination: {
    fontFamily: Theme.typography.fontFamily.subheading,
    fontSize: Theme.typography.fontSize.md,
    color: Theme.colors.primary.lilac,
    marginLeft: Theme.spacing.xs,
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: Theme.spacing.md,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: Theme.spacing.md,
  },
  infoText: {
    fontFamily: Theme.typography.fontFamily.body,
    fontSize: Theme.typography.fontSize.sm,
    color: Theme.colors.text.light,
    marginLeft: Theme.spacing.xs,
  },
  verse: {
    fontFamily: Theme.typography.fontFamily.verse,
    fontSize: Theme.typography.fontSize.md,
    color: Theme.colors.background.white,
    marginTop: Theme.spacing.xs,
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: Theme.spacing.lg,
    paddingHorizontal: Theme.spacing.md,
  },
  actionButton: {
    width: 64,
    height: 64,
    borderRadius: Theme.borderRadius.circle,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: Theme.spacing.sm,
    ...Theme.shadows.small,
  },
  passButton: {
    backgroundColor: Theme.colors.status.error,
  },
  followButton: {
    backgroundColor: Theme.colors.primary.gold,
  },
  likeButton: {
    backgroundColor: Theme.colors.primary.pink,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Theme.spacing.lg,
  },
  emptyText: {
    fontFamily: Theme.typography.fontFamily.heading,
    fontSize: Theme.typography.fontSize.xl,
    color: Theme.colors.text.dark,
    textAlign: 'center',
    marginBottom: Theme.spacing.md,
  },
  emptySubtext: {
    fontFamily: Theme.typography.fontFamily.body,
    fontSize: Theme.typography.fontSize.md,
    color: Theme.colors.text.medium,
    textAlign: 'center',
  },
});