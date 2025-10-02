import { useEffect } from 'react';
import { Stack, SplashScreen, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFonts } from 'expo-font';
import { Montserrat_400Regular, Montserrat_600SemiBold, Montserrat_700Bold } from '@expo-google-fonts/montserrat';
import { OpenSans_400Regular, OpenSans_600SemiBold } from '@expo-google-fonts/open-sans';
import { PlayfairDisplay_400Regular_Italic } from '@expo-google-fonts/playfair-display';

import { AuthProvider, useAuth } from '@/hooks/useAuth';
import { SocialProvider } from '@/hooks/useSocial';
import { ErrorBoundary } from '@/utils/errorBoundary';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';

SplashScreen.preventAutoHideAsync();

function RootLayoutNav() {
  const { isAuthenticated, isLoading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useFrameworkReady();

  const [fontsLoaded, fontError] = useFonts({
    'Montserrat-Regular': Montserrat_400Regular,
    'Montserrat-SemiBold': Montserrat_600SemiBold,
    'Montserrat-Bold': Montserrat_700Bold,
    'OpenSans-Regular': OpenSans_400Regular,
    'OpenSans-SemiBold': OpenSans_600SemiBold,
    'PlayfairDisplay-Italic': PlayfairDisplay_400Regular_Italic
  });

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  useEffect(() => {
    // Espera que a autenticação e as fontes estejam carregadas
    if (isLoading || !fontsLoaded) return;

    const inAuthGroup = segments[0] === '(auth)';

    if (isAuthenticated && inAuthGroup) {
      // Se o utilizador está autenticado e na rota de autenticação, redireciona para a app
      router.replace('/(tabs)');
    } else if (!isAuthenticated && !inAuthGroup) {
      // Se o utilizador não está autenticado e fora da rota de autenticação, redireciona para o login
      router.replace('/(auth)/login');
    }
  }, [isAuthenticated, isLoading, fontsLoaded, segments, router]);

  if (!fontsLoaded && !fontError) {
    return null; // Mantém o ecrã de splash visível
  }

  return (
      <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="(auth)" />
          <Stack.Screen name="+not-found" />
      </Stack>
  );
}

// O componente exportado principal agora envolve tudo no AuthProvider
export default function RootLayout() {
  useFrameworkReady();
  return (
    <>
      <ErrorBoundary>
        <AuthProvider>
          <SocialProvider>
            <RootLayoutNav />
          </SocialProvider>
        </AuthProvider>
      </ErrorBoundary>
      <StatusBar style="auto" />
    </>
  );
}
