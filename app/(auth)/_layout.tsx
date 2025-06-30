import { Stack } from 'expo-router';
import { useAuth } from '@/hooks/useAuth';
import { Redirect } from 'expo-router';
import { useEffect } from 'react';

export default function AuthLayout() {
  const { isAuthenticated } = useAuth();

  // If the user is authenticated, redirect to the main app
  useEffect(() => {
    if (isAuthenticated) {
      // Use effect to handle the redirect to avoid rendering issues
      const redirectTimer = setTimeout(() => {
        // This timeout helps ensure the redirect happens after the component is fully mounted
      }, 0);
      
      return () => clearTimeout(redirectTimer);
    }
  }, [isAuthenticated]);

  if (isAuthenticated) {
    return <Redirect href="/(tabs)" />;
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="login" />
      <Stack.Screen name="signup" />
      <Stack.Screen name="forgot-password" />
    </Stack>
  );
}