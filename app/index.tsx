import { Redirect } from 'expo-router';

export default function Home() {
  // Redirect to the login screen
  return <Redirect href="/(auth)/login" />;
}