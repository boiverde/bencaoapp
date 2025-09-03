import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, Switch, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import Theme from '@/constants/Theme';
import { Settings as SettingsIcon, ChevronLeft, Bell, Shield, Eye, Globe, Moon, Volume2, Smartphone, CircleHelp as HelpCircle, LogOut, ChevronRight } from 'lucide-react-native';
import { useAuth } from '@/hooks/useAuth';
import LanguageSwitcher from '@/components/UI/LanguageSwitcher';
import AccessibilitySettings from '@/components/UI/AccessibilitySettings';
import { useTranslation } from '@/utils/i18n';
import { useGlobalState } from '@/utils/stateManager';

export default function SettingsScreen() {
  const router = useRouter();
  const { signOut } = useAuth();
  const { t } = useTranslation();
  
  const [showAccessibilitySettings, setShowAccessibilitySettings] = useState(false);
  
  // Settings state
  const [notifications, setNotifications] = useGlobalState<boolean>(
    'settings_notifications', 
    true,
    { key: 'settings_notifications' }
  );
  
  const [darkMode, setDarkMode] = useGlobalState<boolean>(
    'accessibility_dark_mode', 
    false,
    { key: 'accessibility_dark_mode' }
  );
  
  const [soundEffects, setSoundEffects] = useGlobalState<boolean>(
    'settings_sound_effects', 
    true,
    { key: 'settings_sound_effects' }
  );

  const handleBack = () => {
    router.back();
  };

  const handleLogout = () => {
    Alert.alert(
      'Sair',
      'Tem certeza que deseja sair?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Sair', 
          style: 'destructive',
          onPress: async () => {
            await signOut();
            router.replace('/(auth)/login');
          }
        }
      ]
    );
  };

  if (showAccessibilitySettings) {
    return (
      <SafeAreaView style={styles.container}>
        <AccessibilitySettings 
          onClose={() => setShowAccessibilitySettings(false)} 
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={handleBack}
          accessibilityLabel="Voltar"
          accessibilityRole="button"
        >
          <ChevronLeft size={24} color={Theme.colors.text.dark} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Configurações</Text>
        <View style={styles.placeholder} />
      </View>
      
      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Preferências</Text>
          
          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Bell size={20} color={Theme.colors.primary.blue} />
              <Text style={styles.settingText}>Notificações</Text>
            </View>
            <Switch
              value={notifications}
              onValueChange={setNotifications}
              trackColor={{ 
                false: Theme.colors.ui.disabled, 
                true: Theme.colors.primary.blue + '40' 
              }}
              thumbColor={notifications ? Theme.colors.primary.blue : '#f4f3f4'}
              accessibilityLabel="Notificações"
              accessibilityRole="switch"
              accessibilityState={{ checked: notifications }}
            />
          </View>
          
          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Moon size={20} color={Theme.colors.primary.blue} />
              <Text style={styles.settingText}>Modo Escuro</Text>
            </View>
            <Switch
              value={darkMode}
              onValueChange={setDarkMode}
              trackColor={{ 
                false: Theme.colors.ui.disabled, 
                true: Theme.colors.primary.blue + '40' 
              }}
              thumbColor={darkMode ? Theme.colors.primary.blue : '#f4f3f4'}
              accessibilityLabel="Modo Escuro"
              accessibilityRole="switch"
              accessibilityState={{ checked: darkMode }}
            />
          </View>
          
          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Volume2 size={20} color={Theme.colors.primary.blue} />
              <Text style={styles.settingText}>Sons</Text>
            </View>
            <Switch
              value={soundEffects}
              onValueChange={setSoundEffects}
              trackColor={{ 
                false: Theme.colors.ui.disabled, 
                true: Theme.colors.primary.blue + '40' 
              }}
              thumbColor={soundEffects ? Theme.colors.primary.blue : '#f4f3f4'}
              accessibilityLabel="Sons"
              accessibilityRole="switch"
              accessibilityState={{ checked: soundEffects }}
            />
          </View>
          
          <TouchableOpacity 
            style={styles.settingItem}
            onPress={() => setShowAccessibilitySettings(true)}
            accessibilityLabel="Acessibilidade"
            accessibilityRole="button"
            accessibilityHint="Abrir configurações de acessibilidade"
          >
            <View style={styles.settingLeft}>
              <Eye size={20} color={Theme.colors.primary.blue} />
              <Text style={styles.settingText}>Acessibilidade</Text>
            </View>
            <ChevronRight size={20} color={Theme.colors.text.medium} />
          </TouchableOpacity>
          
          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Globe size={20} color={Theme.colors.primary.blue} />
              <Text style={styles.settingText}>Idioma</Text>
            </View>
            <LanguageSwitcher compact />
          </View>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Segurança</Text>
          
          <TouchableOpacity 
            style={styles.settingItem}
            accessibilityLabel="Privacidade"
            accessibilityRole="button"
          >
            <View style={styles.settingLeft}>
              <Shield size={20} color={Theme.colors.primary.blue} />
              <Text style={styles.settingText}>Privacidade</Text>
            </View>
            <ChevronRight size={20} color={Theme.colors.text.medium} />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.settingItem}
            accessibilityLabel="Dispositivos Conectados"
            accessibilityRole="button"
          >
            <View style={styles.settingLeft}>
              <Smartphone size={20} color={Theme.colors.primary.blue} />
              <Text style={styles.settingText}>Dispositivos Conectados</Text>
            </View>
            <ChevronRight size={20} color={Theme.colors.text.medium} />
          </TouchableOpacity>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Suporte</Text>
          
          <TouchableOpacity 
            style={styles.settingItem}
            accessibilityLabel="Ajuda e Suporte"
            accessibilityRole="button"
          >
            <View style={styles.settingLeft}>
              <HelpCircle size={20} color={Theme.colors.primary.blue} />
              <Text style={styles.settingText}>Ajuda e Suporte</Text>
            </View>
            <ChevronRight size={20} color={Theme.colors.text.medium} />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.settingItem}
            accessibilityLabel="Sobre o Aplicativo"
            accessibilityRole="button"
          >
            <View style={styles.settingLeft}>
              <SettingsIcon size={20} color={Theme.colors.primary.blue} />
              <Text style={styles.settingText}>Sobre o Aplicativo</Text>
            </View>
            <ChevronRight size={20} color={Theme.colors.text.medium} />
          </TouchableOpacity>
        </View>
        
        <TouchableOpacity 
          style={styles.logoutButton}
          onPress={handleLogout}
          accessibilityLabel="Sair"
          accessibilityRole="button"
          accessibilityHint="Sair da sua conta"
        >
          <LogOut size={20} color={Theme.colors.status.error} />
          <Text style={styles.logoutText}>Sair</Text>
        </TouchableOpacity>
        
        <View style={styles.versionContainer}>
          <Text style={styles.versionText}>Versão 1.0.0</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.colors.background.light,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Theme.spacing.md,
    paddingVertical: Theme.spacing.md,
    backgroundColor: Theme.colors.background.white,
    borderBottomWidth: 1,
    borderBottomColor: Theme.colors.ui.border,
  },
  backButton: {
    padding: Theme.spacing.xs,
  },
  headerTitle: {
    fontFamily: Theme.typography.fontFamily.subheading,
    fontSize: Theme.typography.fontSize.lg,
    color: Theme.colors.text.dark,
  },
  placeholder: {
    width: 24,
  },
  content: {
    flex: 1,
  },
  section: {
    backgroundColor: Theme.colors.background.white,
    marginVertical: Theme.spacing.sm,
    paddingVertical: Theme.spacing.sm,
  },
  sectionTitle: {
    fontFamily: Theme.typography.fontFamily.subheading,
    fontSize: Theme.typography.fontSize.md,
    color: Theme.colors.text.dark,
    paddingHorizontal: Theme.spacing.md,
    paddingVertical: Theme.spacing.sm,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Theme.spacing.md,
    paddingVertical: Theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Theme.colors.ui.border,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingText: {
    fontFamily: Theme.typography.fontFamily.body,
    fontSize: Theme.typography.fontSize.md,
    color: Theme.colors.text.dark,
    marginLeft: Theme.spacing.md,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Theme.colors.background.white,
    marginVertical: Theme.spacing.md,
    paddingVertical: Theme.spacing.md,
  },
  logoutText: {
    fontFamily: Theme.typography.fontFamily.subheading,
    fontSize: Theme.typography.fontSize.md,
    color: Theme.colors.status.error,
    marginLeft: Theme.spacing.sm,
  },
  versionContainer: {
    alignItems: 'center',
    marginBottom: Theme.spacing.xl,
  },
  versionText: {
    fontFamily: Theme.typography.fontFamily.body,
    fontSize: Theme.typography.fontSize.sm,
    color: Theme.colors.text.light,
  },
});