import { useEffect, useRef } from 'react'; 
import { StyleSheet, View, Text, Animated, Platform } from 'react-native'; 
import { LinearGradient } from 'expo-linear-gradient'; 
import { useRouter } from 'expo-router'; 
import Theme from '@/constants/Theme'; 
import { Heart, Sparkles } from 'lucide-react-native'; 
 
export default function SplashScreen() { 
  const router = useRouter(); 
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
    ]).start(); 
 
    // FORCAR IR SEMPRE PARA LOGIN 
    const timer = setTimeout(() => { 
      console.log('Redirecionando para login...'); 
      router.replace('/(auth)/login'); 
    }, 2000); 
 
    return () => clearTimeout(timer); 
  }, [router]); 
 
  return ( 
    <View style={styles.container}> 
      <LinearGradient 
        colors={[Theme.colors.primary.blue, Theme.colors.primary.lilac, Theme.colors.primary.pink]} 
        style={styles.background} 
        start={{ x: 0, y: 0 }} 
        end={{ x: 1, y: 1 }} 
      /> 
      <Animated.View style={[styles.content, { opacity: fadeAnim, transform: [{ scale: scaleAnim }] }]}> 
        <View style={styles.logoContainer}> 
          <Heart size={60} color={Theme.colors.primary.gold} fill={Theme.colors.primary.gold} /> 
          <Text style={styles.appName}>Bencao Match</Text> 
          <Text style={styles.tagline}>Conexoes abencoadass</Text> 
        </View> 
      </Animated.View> 
    </View> 
  ); 
} 
 
const styles = StyleSheet.create({ 
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' }, 
  background: { position: 'absolute', left: 0, right: 0, top: 0, bottom: 0 }, 
  content: { flex: 1, justifyContent: 'center', alignItems: 'center' }, 
  logoContainer: { alignItems: 'center', marginBottom: 50 }, 
  appName: { fontSize: 42, color: 'white', textAlign: 'center', marginBottom: 10 }, 
  tagline: { fontSize: 18, color: 'white', textAlign: 'center' } 
}); 
