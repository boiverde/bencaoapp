import { useEffect, useRef } from 'react';
import { StyleSheet, View, Text, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import Theme from '@/constants/Theme';
import { Heart } from 'lucide-react-native';

export default function SplashScreen() {
  const router = useRouter();
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();

    // IR SEMPRE PARA LOGIN apos 2 segundos
    const timer = setTimeout(() => {
      console.log('Redirecionando para login..');
      router.replace('/(auth)/login');
    }, 2000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[Theme.colors.primary.blue, Theme.colors.primary.lilac, Theme.colors.primary.pink]}
        style={styles.background}
      />
      <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
        <Heart size={60} color={Theme.colors.primary.gold} fill={Theme.colors.primary.gold} />
        <Text style={styles.appName}>Bencao Match</Text>
        <Text style={styles.tagline}>Conexoes abencoadass</Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  background: { position: 'absolute', left: 0, right: 0, top: 0, bottom: 0 },
  content: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  appName: { fontSize: 42, color: 'white', textAlign: 'center', marginTop: 20 },
  tagline: { fontSize: 18, color: 'white', textAlign: 'center', marginTop: 10 }
});
