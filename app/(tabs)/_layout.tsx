import { Tabs } from 'expo-router';
import { StyleSheet } from 'react-native';
import Colors from '@/constants/Colors';
import { Heart, MessageSquare, Calendar, User, Search, Users, Shield } from 'lucide-react-native';
import { useAuth } from '@/hooks/useAuth';
import { Redirect } from 'expo-router';

export default function TabLayout() {
  const { isAuthenticated } = useAuth();

  // If the user is not authenticated, redirect to the login screen
  if (!isAuthenticated) {
    return <Redirect href="/(auth)/login" />;
  }

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors.primary.blue,
        tabBarInactiveTintColor: Colors.text.medium,
        tabBarStyle: styles.tabBar,
        tabBarLabelStyle: styles.tabBarLabel,
        headerShown: false,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Descobrir',
          tabBarIcon: ({ color, size }) => (
            <Heart size={size} color={color} />
          ),
          tabBarAccessibilityLabel: "Descobrir perfis",
        }}
      />
      <Tabs.Screen
        name="matches"
        options={{
          title: 'Conexões',
          tabBarIcon: ({ color, size }) => (
            <Search size={size} color={color} />
          ),
          tabBarAccessibilityLabel: "Ver conexões",
        }}
      />
      <Tabs.Screen
        name="chat"
        options={{
          title: 'Chat',
          tabBarIcon: ({ color, size }) => (
            <MessageSquare size={size} color={color} />
          ),
          tabBarAccessibilityLabel: "Mensagens",
        }}
      />
      <Tabs.Screen
        name="community"
        options={{
          title: 'Comunidade',
          tabBarIcon: ({ color, size }) => (
            <Users size={size} color={color} />
          ),
          tabBarAccessibilityLabel: "Comunidade",
        }}
      />
      <Tabs.Screen
        name="events"
        options={{
          title: 'Eventos',
          tabBarIcon: ({ color, size }) => (
            <Calendar size={size} color={color} />
          ),
          tabBarAccessibilityLabel: "Eventos",
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Perfil',
          tabBarIcon: ({ color, size }) => (
            <User size={size} color={color} />
          ),
          tabBarAccessibilityLabel: "Meu perfil",
        }}
      />
      <Tabs.Screen
        name="admin-dashboard"
        options={{
          title: 'Admin',
          tabBarIcon: ({ color, size }) => (
            <Shield size={size} color={color} />
          ),
          tabBarAccessibilityLabel: "Painel de Administrador",
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: Colors.background.white,
    borderTopWidth: 1,
    borderTopColor: Colors.ui.border,
    height: 60,
    paddingBottom: 8,
    paddingTop: 8,
  },
  tabBarLabel: {
    fontFamily: 'Montserrat-SemiBold',
    fontSize: 12,
  },
});