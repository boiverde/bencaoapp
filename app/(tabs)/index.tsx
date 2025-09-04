import { useRef, useState } from 'react';
import { StyleSheet, View, Text, Image, Animated, PanResponder } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import Theme from '@/constants/Theme';
import { Heart, X, MapPin, Globe, Church } from 'lucide-react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';

// Mock data
const PROFILES = [
  {
    id: '1',
    name: 'Mariana',
    age: 28,
    denomination: 'Batista',
    distance: 5,
    location: 'São Paulo',
    languages: ['Português', 'Inglês'],
    verse: 'O amor é paciente, o amor é bondoso. Não inveja, não se vangloria, não se orgulha. 1 Coríntios 13:4',
    image: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
  },
  {
    id: '2',
    name: 'João',
    age: 30,
    denomination: 'Católico',
    distance: 8,
    location: 'Rio de Janeiro',
    languages: ['Português', 'Espanhol'],
    verse: 'Porque Deus amou o mundo de tal maneira que deu o seu Filho unigênito, para que todo aquele que nele crê não pereça, mas tenha a vida eterna. João 3:16',
    image: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
  },
];

export default function DiscoverScreen() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const swipe = useRef(new Animated.ValueXY()).current;
  const rotation = swipe.x.interpolate({
    inputRange: [-100, 0, 100],
    outputRange: ['-8deg', '0deg', '8deg'],
    extrapolate: 'clamp',
  });

  const panResponder = PanResponder.create({
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
  });

  const handleLike = () => {
    Animated.spring(swipe, {
      toValue: { x: 500, y: 0 },
      useNativeDriver: true,
    }).start(() => {
      setCurrentIndex(prevIndex => prevIndex + 1);
      swipe.setValue({ x: 0, y: 0 });
    });
  };

  const handlePass = () => {
    Animated.spring(swipe, {
      toValue: { x: -500, y: 0 },
      useNativeDriver: true,
    }).start(() => {
      setCurrentIndex(prevIndex => prevIndex + 1);
      swipe.setValue({ x: 0, y: 0 });
    });
  };

  if (currentIndex >= PROFILES.length) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Não há mais perfis disponíveis.</Text>
          <Text style={styles.emptySubtext}>Tente novamente mais tarde ou ajuste seus filtros.</Text>
        </View>
      </SafeAreaView>
    );
  }

  const profile = PROFILES[currentIndex];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Bênção Match</Text>
      </View>
      
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
        >
          <Image source={{ uri: profile.image }} style={styles.image} />
          
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
                  <Text style={styles.infoText}>{profile.distance} km • {profile.location}</Text>
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
        <TouchableOpacity style={[styles.actionButton, styles.passButton]} onPress={handlePass}>
          <X size={30} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity style={[styles.actionButton, styles.likeButton]} onPress={handleLike}>
          <Heart size={30} color="#fff" fill="#fff" />
        </TouchableOpacity>
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
    marginHorizontal: Theme.spacing.md,
    ...Theme.shadows.small,
  },
  passButton: {
    backgroundColor: Theme.colors.status.error,
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