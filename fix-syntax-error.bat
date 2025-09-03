@echo off
echo 🔧 CORRIGINDO ERRO DE SINTAXE
echo ============================

echo 📝 Restaurando _layout.tsx das tabs...

echo import { Tabs } from 'expo-router'; > "app\(tabs)\_layout.tsx"
echo import { StyleSheet } from 'react-native'; >> "app\(tabs)\_layout.tsx"
echo import Colors from '@/constants/Colors'; >> "app\(tabs)\_layout.tsx"
echo import { Heart, MessageSquare, Calendar, User, Search, Users, Shield } from 'lucide-react-native'; >> "app\(tabs)\_layout.tsx"
echo. >> "app\(tabs)\_layout.tsx"
echo export default function TabLayout() { >> "app\(tabs)\_layout.tsx"
echo   return ( >> "app\(tabs)\_layout.tsx"
echo     ^<Tabs screenOptions={{headerShown: false}}^> >> "app\(tabs)\_layout.tsx"
echo       ^<Tabs.Screen name="index" options={{ title: 'Descobrir' }} /^> >> "app\(tabs)\_layout.tsx"
echo       ^<Tabs.Screen name="matches" options={{ title: 'Conexoes' }} /^> >> "app\(tabs)\_layout.tsx"
echo       ^<Tabs.Screen name="chat" options={{ title: 'Chat' }} /^> >> "app\(tabs)\_layout.tsx"
echo       ^<Tabs.Screen name="community" options={{ title: 'Comunidade' }} /^> >> "app\(tabs)\_layout.tsx"
echo       ^<Tabs.Screen name="events" options={{ title: 'Eventos' }} /^> >> "app\(tabs)\_layout.tsx"
echo       ^<Tabs.Screen name="profile" options={{ title: 'Perfil' }} /^> >> "app\(tabs)\_layout.tsx"
echo     ^</Tabs^> >> "app\(tabs)\_layout.tsx"
echo   ); >> "app\(tabs)\_layout.tsx"
echo } >> "app\(tabs)\_layout.tsx"

echo ✅ Arquivo corrigido!

echo.
echo 🚀 TESTE AGORA:
echo npx expo start --tunnel --clear
echo.
pause