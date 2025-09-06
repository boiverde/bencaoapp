import { Redirect } from 'expo-router';
import { useAuth } from '@/hooks/useAuth';

export default function Home() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return null; // Show splash screen while loading
  }

  if (isAuthenticated) {
    return <Redirect href="/(tabs)" />;
  }

  return <Redirect href="/(auth)/login" />;
}