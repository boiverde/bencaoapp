import { useEffect } from 'react';
import { StyleSheet, View, Text, Animated } from 'react-native';
import { useRouter } from 'expo-router';
import Theme from '@/constants/Theme';
import { LinearGradient } from 'expo-linear-gradient';

export default function SplashScreen() {
  const router = useRouter();
  const fadeAnim = new Animated.Value(0);

  useEffect(() => {
    Animated.sequence([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.delay(1500),
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start(() => {
      router.replace('/(auth)/login');
    });
  }, []);

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[Theme.colors.primary.blue, Theme.colors.primary.lilac, Theme.colors.primary.pink]}
        style={styles.background}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />
      
      <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
        <Animated.Image 
          source={{ uri: 'https://raw.githubusercontent.com/stackblitz/bencao-match/main/logo.png' }}
          style={[styles.logo, { opacity: fadeAnim }]}
          resizeMode="contain"
        />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  background: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  content: {
    alignItems: 'center',
  },
  logo: {
    width: 200,
    height: 200,
  },
});