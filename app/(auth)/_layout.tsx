import { Stack } from 'expo-router';

export default function AuthLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen 
        name="login" 
        options={{ 
          animation: 'none',
          presentation: 'card' 
        }} 
      />
      <Stack.Screen 
        name="signup" 
        options={{ 
          animation: 'none',
          presentation: 'card' 
        }} 
      />
    </Stack>
  );
}