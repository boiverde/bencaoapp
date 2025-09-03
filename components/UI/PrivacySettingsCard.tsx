import { useState } from 'react';
import { StyleSheet, View, Text, Switch, TouchableOpacity, ScrollView } from 'react-native';
import { Eye, EyeOff, MapPin, Church, Phone, MessageSquare, Camera, Shield } from 'lucide-react-native';
import Theme from '@/constants/Theme';
import { SecurityProfile } from '@/utils/securitySystem';
import { useSecurity } from '@/hooks/useSecurity';

interface PrivacySettingsCardProps {
  profile: SecurityProfile;
}

export default function PrivacySettingsCard({ profile }: PrivacySettingsCardProps) {
  const { updatePrivacySettings } = useSecurity();
  const [settings, setSettings] = useState(profile.privacySettings);

  const handleSettingChange = (key: keyof SecurityProfile['privacySettings'], value: any) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    updatePrivacySettings({ [key]: value });
  };

  const privacyOptions = [
    {
      key: 'profileVisibility',
      title: 'Visibilidade do Perfil',
      description: 'Quem pode ver seu perfil completo',
      icon: Eye,
      type: 'select',
      options: [
        { value: 'public', label: 'Público' },
        { value: 'members_only', label: 'Apenas Membros' },
        { value: 'connections_only', label: 'Apenas Conexões' },
        { value: 'private', label: 'Privado' }
      ]
    },
    {
      key: 'locationSharing',
      title: 'Compartilhamento de Localização',
      description: 'Nível de detalhe da sua localização',
      icon: MapPin,
      type: 'select',
      options: [
        { value: 'precise', label: 'Localização Precisa' },
        { value: 'city_only', label: 'Apenas Cidade' },
        { value: 'state_only', label: 'Apenas Estado' },
        { value: 'hidden', label: 'Oculto' }
      ]
    },
    {
      key: 'churchInfoVisible',
      title: 'Informações da Igreja',
      description: 'Mostrar sua igreja e denominação',
      icon: Church,
      type: 'boolean'
    },
    {
      key: 'contactInfoVisible',
      title: 'Informações de Contato',
      description: 'Quem pode ver suas informações de contato',
      icon: Phone,
      type: 'select',
      options: [
        { value: 'all', label: 'Todos' },
        { value: 'verified_only', label: 'Apenas Verificados' },
        { value: 'connections_only', label: 'Apenas Conexões' },
        { value: 'hidden', label: 'Oculto' }
      ]
    },
    {
      key: 'messageFiltering',
      title: 'Filtro de Mensagens',
      description: 'Nível de filtragem para mensagens recebidas',
      icon: MessageSquare,
      type: 'select',
      options: [
        { value: 'none', label: 'Sem Filtro' },
        { value: 'basic', label: 'Filtro Básico' },
        { value: 'strict', label: 'Filtro Rigoroso' },
        { value: 'blessed_only', label: 'Apenas Membros Abençoados' }
      ]
    },
    {
      key: 'photoAccess',
      title: 'Acesso às Fotos',
      description: 'Quem pode ver suas fotos',
      icon: Camera,
      type: 'select',
      options: [
        { value: 'public', label: 'Público' },
        { value: 'verified_only', label: 'Apenas Verificados' },
        { value: 'connections_only', label: 'Apenas Conexões' },
        { value: 'private', label: 'Privado' }
      ]
    },
    {
      key: 'blockUnverified',
      title: 'Bloquear Não Verificados',
      description: 'Impedir contato de perfis não verificados',
      icon: Shield,
      type: 'boolean'
    }
  ];

  const renderBooleanSetting = (option: any) => (
    <View key={option.key} style={styles.settingItem}>
      <View style={styles.settingLeft}>
        <View style={styles.settingIcon}>
          <option.icon size={20} color={Theme.colors.primary.blue} />
        </View>
        <View style={styles.settingInfo}>
          <Text style={styles.settingTitle}>{option.title}</Text>
          <Text style={styles.settingDescription}>{option.description}</Text>
        </View>
      </View>
      <Switch
        value={settings[option.key]}
        onValueChange={(value) => handleSettingChange(option.key, value)}
        trackColor={{ 
          false: Theme.colors.ui.disabled, 
          true: Theme.colors.primary.blue + '40' 
        }}
        thumbColor={settings[option.key] ? Theme.colors.primary.blue : '#f4f3f4'}
      />
    </View>
  );

  const renderSelectSetting = (option: any) => {
    const currentOption = option.options.find(opt => opt.value === settings[option.key]);
    
    return (
      <View key={option.key} style={styles.settingItem}>
        <View style={styles.settingLeft}>
          <View style={styles.settingIcon}>
            <option.icon size={20} color={Theme.colors.primary.blue} />
          </View>
          <View style={styles.settingInfo}>
            <Text style={styles.settingTitle}>{option.title}</Text>
            <Text style={styles.settingDescription}>{option.description}</Text>
            <Text style={styles.currentValue}>
              Atual: {currentOption?.label || 'Não definido'}
            </Text>
          </View>
        </View>
        <View style={styles.selectOptions}>
          {option.options.map((opt: any) => (
            <TouchableOpacity
              key={opt.value}
              style={[
                styles.optionButton,
                settings[option.key] === opt.value && styles.selectedOption
              ]}
              onPress={() => handleSettingChange(option.key, opt.value)}
            >
              <Text style={[
                styles.optionText,
                settings[option.key] === opt.value && styles.selectedOptionText
              ]}>
                {opt.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <EyeOff size={24} color={Theme.colors.primary.blue} />
        <Text style={styles.title}>Configurações de Privacidade</Text>
      </View>

      <Text style={styles.description}>
        Controle quem pode ver suas informações e como você interage na comunidade cristã.
      </Text>

      <ScrollView style={styles.settingsList} showsVerticalScrollIndicator={false}>
        {privacyOptions.map((option) => (
          option.type === 'boolean' 
            ? renderBooleanSetting(option)
            : renderSelectSetting(option)
        ))}
      </ScrollView>

      <View style={styles.privacyTips}>
        <Text style={styles.tipsTitle}>Dicas de Privacidade</Text>
        <View style={styles.tipsList}>
          <Text style={styles.tipItem}>
            • Mantenha informações pessoais protegidas até estabelecer confiança
          </Text>
          <Text style={styles.tipItem}>
            • Use filtros de mensagem para evitar conteúdo inadequado
          </Text>
          <Text style={styles.tipItem}>
            • Compartilhe localização apenas com conexões verificadas
          </Text>
          <Text style={styles.tipItem}>
            • Revise regularmente suas configurações de privacidade
          </Text>
        </View>
      </View>

      <View style={styles.spiritualMessage}>
        <Text style={styles.spiritualText}>
          "Acima de tudo, guarda o teu coração, porque dele procedem as fontes da vida." - Provérbios 4:23
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Theme.colors.background.white,
    borderRadius: Theme.borderRadius.lg,
    padding: Theme.spacing.md,
    ...Theme.shadows.small,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Theme.spacing.md,
  },
  title: {
    fontFamily: Theme.typography.fontFamily.subheading,
    fontSize: Theme.typography.fontSize.lg,
    color: Theme.colors.text.dark,
    marginLeft: Theme.spacing.sm,
  },
  description: {
    fontFamily: Theme.typography.fontFamily.body,
    fontSize: Theme.typography.fontSize.sm,
    color: Theme.colors.text.medium,
    lineHeight: 20,
    marginBottom: Theme.spacing.lg,
  },
  settingsList: {
    maxHeight: 500,
    marginBottom: Theme.spacing.lg,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingVertical: Theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Theme.colors.ui.border,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    flex: 1,
    marginRight: Theme.spacing.md,
  },
  settingIcon: {
    width: 40,
    height: 40,
    borderRadius: Theme.borderRadius.circle,
    backgroundColor: Theme.colors.primary.blue + '20',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Theme.spacing.md,
  },
  settingInfo: {
    flex: 1,
  },
  settingTitle: {
    fontFamily: Theme.typography.fontFamily.subheading,
    fontSize: Theme.typography.fontSize.md,
    color: Theme.colors.text.dark,
    marginBottom: Theme.spacing.xs,
  },
  settingDescription: {
    fontFamily: Theme.typography.fontFamily.body,
    fontSize: Theme.typography.fontSize.sm,
    color: Theme.colors.text.medium,
    lineHeight: 18,
  },
  currentValue: {
    fontFamily: Theme.typography.fontFamily.body,
    fontSize: Theme.typography.fontSize.xs,
    color: Theme.colors.primary.blue,
    marginTop: Theme.spacing.xs,
  },
  selectOptions: {
    flexDirection: 'column',
    alignItems: 'flex-end',
  },
  optionButton: {
    paddingHorizontal: Theme.spacing.sm,
    paddingVertical: Theme.spacing.xs,
    borderRadius: Theme.borderRadius.sm,
    marginBottom: Theme.spacing.xs,
    backgroundColor: Theme.colors.background.light,
  },
  selectedOption: {
    backgroundColor: Theme.colors.primary.blue,
  },
  optionText: {
    fontFamily: Theme.typography.fontFamily.body,
    fontSize: Theme.typography.fontSize.xs,
    color: Theme.colors.text.dark,
  },
  selectedOptionText: {
    color: Theme.colors.background.white,
  },
  privacyTips: {
    backgroundColor: Theme.colors.background.light,
    borderRadius: Theme.borderRadius.md,
    padding: Theme.spacing.md,
    marginBottom: Theme.spacing.md,
  },
  tipsTitle: {
    fontFamily: Theme.typography.fontFamily.subheading,
    fontSize: Theme.typography.fontSize.md,
    color: Theme.colors.text.dark,
    marginBottom: Theme.spacing.sm,
  },
  tipsList: {
    marginLeft: Theme.spacing.sm,
  },
  tipItem: {
    fontFamily: Theme.typography.fontFamily.body,
    fontSize: Theme.typography.fontSize.sm,
    color: Theme.colors.text.medium,
    lineHeight: 20,
    marginBottom: Theme.spacing.xs,
  },
  spiritualMessage: {
    backgroundColor: Theme.colors.background.lilac,
    borderRadius: Theme.borderRadius.md,
    padding: Theme.spacing.sm,
  },
  spiritualText: {
    fontFamily: Theme.typography.fontFamily.verse,
    fontSize: Theme.typography.fontSize.sm,
    color: Theme.colors.text.dark,
    textAlign: 'center',
    lineHeight: 18,
  },
});