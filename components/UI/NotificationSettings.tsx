import { useState } from 'react';
import { StyleSheet, View, Text, Switch, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Theme from '@/constants/Theme';
import { 
  Bell, 
  Heart, 
  MessageSquare, 
  Calendar, 
  HandHelping as PrayingHands,
  Star,
  UserPlus,
  ChevronLeft
} from 'lucide-react-native';

interface NotificationSettingsProps {
  onBack: () => void;
}

export default function NotificationSettings({ onBack }: NotificationSettingsProps) {
  const [settings, setSettings] = useState({
    pushNotifications: true,
    matches: true,
    messages: true,
    events: true,
    prayers: true,
    likes: false,
    follows: true,
    soundEnabled: true,
    vibrationEnabled: true,
    quietHours: false,
    quietStart: '22:00',
    quietEnd: '08:00',
  });

  const toggleSetting = (key: string) => {
    setSettings(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const notificationTypes = [
    {
      key: 'matches',
      title: 'Novos Matches',
      description: 'Quando alguém corresponde ao seu interesse',
      icon: Heart,
      color: Theme.colors.primary.pink,
    },
    {
      key: 'messages',
      title: 'Mensagens',
      description: 'Novas mensagens de suas conexões',
      icon: MessageSquare,
      color: Theme.colors.primary.blue,
    },
    {
      key: 'events',
      title: 'Eventos',
      description: 'Lembretes de eventos próximos',
      icon: Calendar,
      color: Theme.colors.primary.lilac,
    },
    {
      key: 'prayers',
      title: 'Momentos de Oração',
      description: 'Lembretes para orar por suas conexões',
      icon: PrayingHands,
      color: Theme.colors.primary.gold,
    },
    {
      key: 'likes',
      title: 'Curtidas',
      description: 'Quando alguém curte suas publicações',
      icon: Heart,
      color: Theme.colors.status.error,
    },
    {
      key: 'follows',
      title: 'Novos Seguidores',
      description: 'Quando alguém começa a te seguir',
      icon: UserPlus,
      color: Theme.colors.status.success,
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <ChevronLeft size={24} color={Theme.colors.text.dark} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Configurações de Notificação</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Bell size={20} color={Theme.colors.primary.blue} />
            <Text style={styles.sectionTitle}>Notificações Gerais</Text>
          </View>
          
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingTitle}>Notificações Push</Text>
              <Text style={styles.settingDescription}>
                Receber notificações no dispositivo
              </Text>
            </View>
            <Switch
              value={settings.pushNotifications}
              onValueChange={() => toggleSetting('pushNotifications')}
              trackColor={{ 
                false: Theme.colors.ui.disabled, 
                true: Theme.colors.primary.blue + '40' 
              }}
              thumbColor={settings.pushNotifications ? Theme.colors.primary.blue : '#f4f3f4'}
            />
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingTitle}>Som</Text>
              <Text style={styles.settingDescription}>
                Reproduzir som nas notificações
              </Text>
            </View>
            <Switch
              value={settings.soundEnabled}
              onValueChange={() => toggleSetting('soundEnabled')}
              disabled={!settings.pushNotifications}
              trackColor={{ 
                false: Theme.colors.ui.disabled, 
                true: Theme.colors.primary.blue + '40' 
              }}
              thumbColor={settings.soundEnabled ? Theme.colors.primary.blue : '#f4f3f4'}
            />
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingTitle}>Vibração</Text>
              <Text style={styles.settingDescription}>
                Vibrar ao receber notificações
              </Text>
            </View>
            <Switch
              value={settings.vibrationEnabled}
              onValueChange={() => toggleSetting('vibrationEnabled')}
              disabled={!settings.pushNotifications}
              trackColor={{ 
                false: Theme.colors.ui.disabled, 
                true: Theme.colors.primary.blue + '40' 
              }}
              thumbColor={settings.vibrationEnabled ? Theme.colors.primary.blue : '#f4f3f4'}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Tipos de Notificação</Text>
          
          {notificationTypes.map((type) => {
            const IconComponent = type.icon;
            return (
              <View key={type.key} style={styles.settingItem}>
                <View style={styles.settingInfo}>
                  <View style={styles.settingTitleRow}>
                    <IconComponent size={18} color={type.color} />
                    <Text style={styles.settingTitle}>{type.title}</Text>
                  </View>
                  <Text style={styles.settingDescription}>
                    {type.description}
                  </Text>
                </View>
                <Switch
                  value={settings[type.key]}
                  onValueChange={() => toggleSetting(type.key)}
                  disabled={!settings.pushNotifications}
                  trackColor={{ 
                    false: Theme.colors.ui.disabled, 
                    true: type.color + '40' 
                  }}
                  thumbColor={settings[type.key] ? type.color : '#f4f3f4'}
                />
              </View>
            );
          })}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Horário Silencioso</Text>
          
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingTitle}>Ativar Modo Silencioso</Text>
              <Text style={styles.settingDescription}>
                Não receber notificações durante determinado período
              </Text>
            </View>
            <Switch
              value={settings.quietHours}
              onValueChange={() => toggleSetting('quietHours')}
              disabled={!settings.pushNotifications}
              trackColor={{ 
                false: Theme.colors.ui.disabled, 
                true: Theme.colors.primary.blue + '40' 
              }}
              thumbColor={settings.quietHours ? Theme.colors.primary.blue : '#f4f3f4'}
            />
          </View>

          {settings.quietHours && (
            <View style={styles.quietHoursContainer}>
              <View style={styles.timeRow}>
                <Text style={styles.timeLabel}>Das:</Text>
                <TouchableOpacity style={styles.timeButton}>
                  <Text style={styles.timeText}>{settings.quietStart}</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.timeRow}>
                <Text style={styles.timeLabel}>Até:</Text>
                <TouchableOpacity style={styles.timeButton}>
                  <Text style={styles.timeText}>{settings.quietEnd}</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            As configurações de notificação ajudam você a manter o foco na sua jornada espiritual 
            enquanto permanece conectado com sua comunidade abençoada.
          </Text>
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
    width: 40,
  },
  content: {
    flex: 1,
  },
  section: {
    backgroundColor: Theme.colors.background.white,
    marginBottom: Theme.spacing.md,
    paddingVertical: Theme.spacing.md,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Theme.spacing.md,
    marginBottom: Theme.spacing.md,
  },
  sectionTitle: {
    fontFamily: Theme.typography.fontFamily.subheading,
    fontSize: Theme.typography.fontSize.md,
    color: Theme.colors.text.dark,
    marginLeft: Theme.spacing.sm,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Theme.spacing.md,
    paddingVertical: Theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Theme.colors.ui.border,
  },
  settingInfo: {
    flex: 1,
    marginRight: Theme.spacing.md,
  },
  settingTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Theme.spacing.xs,
  },
  settingTitle: {
    fontFamily: Theme.typography.fontFamily.subheading,
    fontSize: Theme.typography.fontSize.md,
    color: Theme.colors.text.dark,
    marginLeft: Theme.spacing.sm,
  },
  settingDescription: {
    fontFamily: Theme.typography.fontFamily.body,
    fontSize: Theme.typography.fontSize.sm,
    color: Theme.colors.text.medium,
    lineHeight: 18,
  },
  quietHoursContainer: {
    paddingHorizontal: Theme.spacing.md,
    paddingTop: Theme.spacing.md,
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Theme.spacing.sm,
  },
  timeLabel: {
    fontFamily: Theme.typography.fontFamily.body,
    fontSize: Theme.typography.fontSize.md,
    color: Theme.colors.text.dark,
    width: 40,
  },
  timeButton: {
    backgroundColor: Theme.colors.background.light,
    paddingHorizontal: Theme.spacing.md,
    paddingVertical: Theme.spacing.sm,
    borderRadius: Theme.borderRadius.md,
    marginLeft: Theme.spacing.sm,
  },
  timeText: {
    fontFamily: Theme.typography.fontFamily.subheading,
    fontSize: Theme.typography.fontSize.md,
    color: Theme.colors.primary.blue,
  },
  footer: {
    padding: Theme.spacing.md,
    backgroundColor: Theme.colors.background.lilac,
    margin: Theme.spacing.md,
    borderRadius: Theme.borderRadius.md,
  },
  footerText: {
    fontFamily: Theme.typography.fontFamily.verse,
    fontSize: Theme.typography.fontSize.sm,
    color: Theme.colors.text.dark,
    textAlign: 'center',
    lineHeight: 20,
  },
});