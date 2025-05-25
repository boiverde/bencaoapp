import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import { useFonts } from 'expo-font';
import {
  Montserrat_400Regular,
  Montserrat_600SemiBold,
  Montserrat_700Bold
} from '@expo-google-fonts/montserrat';
import {
  OpenSans_400Regular,
  OpenSans_600SemiBold
} from '@expo-google-fonts/open-sans';
import { PlayfairDisplay_400Regular_Italic } from '@expo-google-fonts/playfair-display';
import { SplashScreen } from 'expo-router';
import { useAuth } from '@/hooks/useAuth';

// Prevent splash screen from auto-hiding
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  useFrameworkReady();
  const { loading: authLoading } = useAuth();

  const [fontsLoaded, fontError] = useFonts({
    'Montserrat-Regular': Montserrat_400Regular,
    'Montserrat-SemiBold': Montserrat_600SemiBold,
    'Montserrat-Bold': Montserrat_700Bold,
    'OpenSans-Regular': OpenSans_400Regular,
    'OpenSans-SemiBold': OpenSans_600SemiBold,
    'PlayfairDisplay-Italic': PlayfairDisplay_400Regular_Italic
  });

  useEffect(() => {
    if ((fontsLoaded || fontError) && !authLoading) {
      // Hide splash screen after fonts are loaded and auth is checked
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError, authLoading]);

  // Return null to keep splash screen visible while loading
  if (!fontsLoaded && !fontError && authLoading) {
    return null;
  }

  return (
    <>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="auto" />
    </>
  );
}