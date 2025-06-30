import { useEffect, useRef } from 'react';
import { StyleSheet, View, Text, Animated, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import Theme from '@/constants/Theme';
import { Heart, Sparkles } from 'lucide-react-native';
import { useAuth } from '@/hooks/useAuth';

export default function SplashScreen() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const sparkleAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Start animations
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
      Animated.loop(
        Animated.sequence([
          Animated.timing(sparkleAnim, {
            toValue: 1,
            duration: 1500,
            useNativeDriver: true,
          }),
          Animated.timing(sparkleAnim, {
            toValue: 0,
            duration: 1500,
            useNativeDriver: true,
          }),
        ])
      ),
    ]).start();

    // Navigate after 3 seconds
    const timer = setTimeout(() => {
      if (isAuthenticated) {
        router.replace('/(tabs)');
      } else {
        router.replace('/(auth)/login');
      }
    }, 3000);

    return () => clearTimeout(timer);
  }, [fadeAnim, scaleAnim, sparkleAnim, router, isAuthenticated]);

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[Theme.colors.primary.blue, Theme.colors.primary.lilac, Theme.colors.primary.pink]}
        style={styles.background}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />
      
      <Animated.View 
        style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }]
          }
        ]}
      >
        <View style={styles.logoContainer}>
          <Animated.View 
            style={[
              styles.heartContainer,
              {
                opacity: sparkleAnim,
                transform: [{
                  rotate: sparkleAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: ['0deg', '360deg']
                  })
                }]
              }
            ]}
          >
            <Heart size={60} color={Theme.colors.primary.gold} fill={Theme.colors.primary.gold} />
          </Animated.View>
          
          <Text style={styles.appName}>Bênção Match</Text>
          <Text style={styles.tagline}>Conexões abençoadas</Text>
          
          {Platform.OS !== 'web' && (
            <Animated.View 
              style={[
                styles.sparklesContainer,
                { opacity: sparkleAnim }
              ]}
            >
              <Sparkles size={24} color={Theme.colors.background.white} style={styles.sparkle1} />
              <Sparkles size={18} color={Theme.colors.primary.gold} style={styles.sparkle2} />
              <Sparkles size={20} color={Theme.colors.background.white} style={styles.sparkle3} />
            </Animated.View>
          )}
        </View>
        
        <View style={styles.verseContainer}>
          <Text style={styles.verseText}>
            "Quem encontra uma esposa encontra algo excelente; recebeu uma bênção do Senhor."
          </Text>
          <Text style={styles.verseReference}>Provérbios 18:22</Text>
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  background: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Theme.spacing.lg,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: Theme.spacing.xxl,
    position: 'relative',
  },
  heartContainer: {
    marginBottom: Theme.spacing.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  appName: {
    fontFamily: Theme.typography.fontFamily.heading,
    fontSize: 42,
    color: Theme.colors.background.white,
    textAlign: 'center',
    marginBottom: Theme.spacing.sm,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 3 },
    textShadowRadius: 6,
    letterSpacing: 1,
  },
  tagline: {
    fontFamily: Theme.typography.fontFamily.verse,
    fontSize: Theme.typography.fontSize.lg,
    color: Theme.colors.background.white,
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
    opacity: 0.9,
  },
  sparklesContainer: {
    position: 'absolute',
    width: 200,
    height: 200,
    top: -50,
  },
  sparkle1: {
    position: 'absolute',
    top: 20,
    right: 30,
  },
  sparkle2: {
    position: 'absolute',
    bottom: 40,
    left: 20,
  },
  sparkle3: {
    position: 'absolute',
    top: 60,
    left: 40,
  },
  verseContainer: {
    alignItems: 'center',
    paddingHorizontal: Theme.spacing.md,
    position: 'absolute',
    bottom: Theme.spacing.xxl,
  },
  verseText: {
    fontFamily: Theme.typography.fontFamily.verse,
    fontSize: Theme.typography.fontSize.md,
    color: Theme.colors.background.white,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: Theme.spacing.xs,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  verseReference: {
    fontFamily: Theme.typography.fontFamily.subheading,
    fontSize: Theme.typography.fontSize.sm,
    color: Theme.colors.primary.gold,
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
});