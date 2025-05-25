import { Stack } from 'expo-router';

export default function AuthLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen 
        name="login" 
        options={{ 
          animation: 'fade',
          presentation: 'card' 
        }} 
      />
      <Stack.Screen 
        name="signup" 
        options={{ 
          animation: 'slide-from-right',
          presentation: 'card' 
        }} 
      />
    </Stack>
  );
}