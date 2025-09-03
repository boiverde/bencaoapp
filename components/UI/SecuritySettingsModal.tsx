import { useState } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  Modal, 
  TouchableOpacity, 
  ScrollView,
  Switch,
  Alert
} from 'react-native';
import { 
  X, 
  Lock, 
  Bell, 
  Smartphone, 
  Clock, 
  Fingerprint, 
  MessageSquare,
  LogOut,
  Shield,
  Users,
  Info
} from 'lucide-react-native';
import Theme from '@/constants/Theme';
import { useSecurity } from '@/hooks/useSecurity';
import { SecurityProfile } from '@/utils/securitySystem';

interface SecuritySettingsModalProps {
  visible: boolean;
  onClose: () => void;
}

export default function SecuritySettingsModal({
  visible,
  onClose
}: SecuritySettingsModalProps) {
  const { 
    securityProfile, 
    updateSecuritySettings, 
    enableTwoFactorAuth,
    enableBiometricAuth,
    biometricAvailable,
    validatePassword
  } = useSecurity();

  const [settings, setSettings] = useState<SecurityProfile['securitySettings'] | null>(
    securityProfile?.securitySettings || null
  );

  const [isEnabling2FA, setIsEnabling2FA] = useState(false);

  if (!settings) {
    return null;
  }

  const handleSettingChange = (key: keyof SecurityProfile['securitySettings'], value: any) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    updateSecuritySettings({ [key]: value });
  };

  const handleEnable2FA = async () => {
    setIsEnabling2FA(true);
    try {
      const success = await enableTwoFactorAuth('sms');
      if (success) {
        handleSettingChange('twoFactorAuth', true);
      }
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível ativar a autenticação de dois fatores');
    } finally {
      setIsEnabling2FA(false);
    }
  };

  const handleEnableBiometric = async () => {
    if (!biometricAvailable) {
      Alert.alert('Indisponível', 'Autenticação biométrica não está disponível neste dispositivo');
      return;
    }

    try {
      const success = await enableBiometricAuth();
      if (success) {
        handleSettingChange('biometricAuth', true);
      }
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível ativar a autenticação biométrica');
    }
  };

  const handlePasswordStrengthCheck = () => {
    Alert.prompt(
      'Verificar Senha',
      'Digite sua senha para verificar sua força',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Verificar',
          onPress: (password) => {
            if (password) {
              const result = validatePassword(password);
              Alert.alert(
                'Força da Senha',
                `Sua senha é ${result.strength}.\n\n${result.suggestions.join('\n')}`
              );
            }
          }
        }
      ],
      'secure-text'
    );
  };

  const securityOptions = [
    {
      key: 'twoFactorAuth',
      title: 'Autenticação de Dois Fatores',
      description: 'Adicione uma camada extra de segurança',
      icon: Shield,
      type: 'boolean',
      customHandler: !settings.twoFactorAuth ? handleEnable2FA : undefined,
      loading: isEnabling2FA
    },
    {
      key: 'loginNotifications',
      title: 'Notificações de Login',
      description: 'Receba alertas de novos logins',
      icon: Bell,
      type: 'boolean'
    },
    {
      key: 'deviceTracking',
      title: 'Rastreamento de Dispositivos',
      description: 'Monitore dispositivos conectados',
      icon: Smartphone,
      type: 'boolean'
    },
    {
      key: 'suspiciousActivityAlerts',
      title: 'Alertas de Atividade Suspeita',
      description: 'Seja notificado sobre atividades incomuns',
      icon: Bell,
      type: 'boolean'
    },
    {
      key: 'passwordStrength',
      title: 'Força da Senha',
      description: 'Verifique e melhore a segurança da sua senha',
      icon: Lock,
      type: 'custom',
      value: settings.passwordStrength,
      customHandler: handlePasswordStrengthCheck
    },
    {
      key: 'sessionTimeout',
      title: 'Tempo Limite de Sessão',
      description: 'Minutos até o logout automático',
      icon: Clock,
      type: 'select',
      options: [
        { value: 15, label: '15 minutos' },
        { value: 30, label: '30 minutos' },
        { value: 60, label: '1 hora' },
        { value: 120, label: '2 horas' }
      ]
    },
    {
      key: 'biometricAuth',
      title: 'Autenticação Biométrica',
      description: 'Use impressão digital ou Face ID',
      icon: Fingerprint,
      type: 'boolean',
      customHandler: !settings.biometricAuth ? handleEnableBiometric : undefined,
      disabled: !biometricAvailable
    },
    {
      key: 'encryptedMessages',
      title: 'Mensagens Criptografadas',
      description: 'Proteja suas conversas com criptografia',
      icon: MessageSquare,
      type: 'boolean'
    },
    {
      key: 'autoLogout',
      title: 'Logout Automático',
      description: 'Sair automaticamente após inatividade',
      icon: LogOut,
      type: 'boolean'
    },
    {
      key: 'spiritualAccountability',
      title: 'Prestação de Contas Espiritual',
      description: 'Compartilhe atividades com mentores espirituais',
      icon: Church,
      type: 'boolean'
    },
    {
      key: 'communityModeration',
      title: 'Moderação Comunitária',
      description: 'Participe da moderação da comunidade',
      icon: Users,
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
      {option.customHandler ? (
        <TouchableOpacity 
          style={styles.enableButton}
          onPress={option.customHandler}
          disabled={option.loading || option.disabled}
        >
          <Text style={styles.enableButtonText}>
            {option.loading ? 'Ativando...' : 'Ativar'}
          </Text>
        </TouchableOpacity>
      ) : (
        <Switch
          value={settings[option.key]}
          onValueChange={(value) => handleSettingChange(option.key, value)}
          trackColor={{ 
            false: Theme.colors.ui.disabled, 
            true: Theme.colors.primary.blue + '40' 
          }}
          thumbColor={settings[option.key] ? Theme.colors.primary.blue : '#f4f3f4'}
          disabled={option.disabled}
        />
      )}
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

  const renderCustomSetting = (option: any) => (
    <View key={option.key} style={styles.settingItem}>
      <View style={styles.settingLeft}>
        <View style={styles.settingIcon}>
          <option.icon size={20} color={Theme.colors.primary.blue} />
        </View>
        <View style={styles.settingInfo}>
          <Text style={styles.settingTitle}>{option.title}</Text>
          <Text style={styles.settingDescription}>{option.description}</Text>
          {option.value && (
            <View style={[
              styles.strengthBadge,
              option.value === 'weak' && styles.weakBadge,
              option.value === 'medium' && styles.mediumBadge,
              option.value === 'strong' && styles.strongBadge,
              option.value === 'excellent' && styles.excellentBadge
            ]}>
              <Text style={styles.strengthText}>
                {option.value === 'weak' ? 'Fraca' : 
                 option.value === 'medium' ? 'Média' : 
                 option.value === 'strong' ? 'Forte' : 'Excelente'}
              </Text>
            </View>
          )}
        </View>
      </View>
      <TouchableOpacity 
        style={styles.checkButton}
        onPress={option.customHandler}
      >
        <Text style={styles.checkButtonText}>Verificar</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Configurações de Segurança</Text>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <X size={24} color={Theme.colors.text.dark} />
            </TouchableOpacity>
          </View>

          <Text style={styles.description}>
            Proteja sua conta e mantenha suas informações seguras com estas configurações.
          </Text>

          <ScrollView style={styles.settingsList} showsVerticalScrollIndicator={false}>
            {securityOptions.map((option) => {
              if (option.type === 'boolean') {
                return renderBooleanSetting(option);
              } else if (option.type === 'select') {
                return renderSelectSetting(option);
              } else if (option.type === 'custom') {
                return renderCustomSetting(option);
              }
              return null;
            })}
          </ScrollView>

          <View style={styles.securityTips}>
            <Text style={styles.tipsTitle}>Dicas de Segurança</Text>
            <View style={styles.tipsList}>
              <Text style={styles.tipItem}>
                • Use senhas fortes e únicas para cada conta
              </Text>
              <Text style={styles.tipItem}>
                • Ative a autenticação de dois fatores sempre que possível
              </Text>
              <Text style={styles.tipItem}>
                • Verifique regularmente as atividades da sua conta
              </Text>
              <Text style={styles.tipItem}>
                • Nunca compartilhe suas credenciais com ninguém
              </Text>
            </View>
          </View>

          <View style={styles.spiritualMessage}>
            <Text style={styles.spiritualText}>
              "Vigiai, estai firmes na fé, portai-vos varonilmente, e fortalecei-vos." - 1 Coríntios 16:13
            </Text>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: Theme.colors.background.white,
    borderTopLeftRadius: Theme.borderRadius.lg,
    borderTopRightRadius: Theme.borderRadius.lg,
    maxHeight: '90%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Theme.colors.ui.border,
  },
  headerTitle: {
    fontFamily: Theme.typography.fontFamily.subheading,
    fontSize: Theme.typography.fontSize.lg,
    color: Theme.colors.text.dark,
  },
  closeButton: {
    padding: Theme.spacing.xs,
  },
  description: {
    fontFamily: Theme.typography.fontFamily.body,
    fontSize: Theme.typography.fontSize.sm,
    color: Theme.colors.text.medium,
    lineHeight: 20,
    padding: Theme.spacing.md,
  },
  settingsList: {
    padding: Theme.spacing.md,
    maxHeight: 400,
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
  strengthBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: Theme.spacing.sm,
    paddingVertical: Theme.spacing.xs,
    borderRadius: Theme.borderRadius.sm,
    marginTop: Theme.spacing.xs,
  },
  weakBadge: {
    backgroundColor: Theme.colors.status.error + '20',
  },
  mediumBadge: {
    backgroundColor: Theme.colors.status.warning + '20',
  },
  strongBadge: {
    backgroundColor: Theme.colors.status.success + '20',
  },
  excellentBadge: {
    backgroundColor: Theme.colors.primary.gold + '20',
  },
  strengthText: {
    fontFamily: Theme.typography.fontFamily.body,
    fontSize: Theme.typography.fontSize.xs,
  },
  enableButton: {
    backgroundColor: Theme.colors.primary.blue,
    paddingHorizontal: Theme.spacing.md,
    paddingVertical: Theme.spacing.xs,
    borderRadius: Theme.borderRadius.md,
  },
  enableButtonText: {
    fontFamily: Theme.typography.fontFamily.subheading,
    fontSize: Theme.typography.fontSize.sm,
    color: Theme.colors.background.white,
  },
  checkButton: {
    backgroundColor: Theme.colors.primary.blue + '20',
    paddingHorizontal: Theme.spacing.md,
    paddingVertical: Theme.spacing.xs,
    borderRadius: Theme.borderRadius.md,
  },
  checkButtonText: {
    fontFamily: Theme.typography.fontFamily.subheading,
    fontSize: Theme.typography.fontSize.sm,
    color: Theme.colors.primary.blue,
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
  securityTips: {
    backgroundColor: Theme.colors.background.light,
    margin: Theme.spacing.md,
    borderRadius: Theme.borderRadius.md,
    padding: Theme.spacing.md,
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
    margin: Theme.spacing.md,
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