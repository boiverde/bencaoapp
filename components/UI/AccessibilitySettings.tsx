import React, { useState } from 'react';
import { StyleSheet, View, Text, Switch, TouchableOpacity, ScrollView } from 'react-native';
import { Eye, Volume2, Vibrate as Vibration, Clock, Moon, Zap } from 'lucide-react-native';
import Theme from '@/constants/Theme';
import { useGlobalState } from '@/utils/stateManager';
import { useTranslation } from '@/utils/i18n';

interface AccessibilitySettingsProps {
  onClose?: () => void;
}

export default function AccessibilitySettings({ onClose }: AccessibilitySettingsProps) {
  const { t } = useTranslation();
  
  // Accessibility settings
  const [highContrast, setHighContrast] = useGlobalState<boolean>(
    'accessibility_high_contrast', 
    false,
    { key: 'accessibility_high_contrast' }
  );
  
  const [largeText, setLargeText] = useGlobalState<boolean>(
    'accessibility_large_text', 
    false,
    { key: 'accessibility_large_text' }
  );
  
  const [reduceMotion, setReduceMotion] = useGlobalState<boolean>(
    'accessibility_reduce_motion', 
    false,
    { key: 'accessibility_reduce_motion' }
  );
  
  const [screenReader, setScreenReader] = useGlobalState<boolean>(
    'accessibility_screen_reader', 
    false,
    { key: 'accessibility_screen_reader' }
  );
  
  const [soundEffects, setSoundEffects] = useGlobalState<boolean>(
    'accessibility_sound_effects', 
    true,
    { key: 'accessibility_sound_effects' }
  );
  
  const [hapticFeedback, setHapticFeedback] = useGlobalState<boolean>(
    'accessibility_haptic_feedback', 
    true,
    { key: 'accessibility_haptic_feedback' }
  );
  
  const [autoplayMedia, setAutoplayMedia] = useGlobalState<boolean>(
    'accessibility_autoplay_media', 
    true,
    { key: 'accessibility_autoplay_media' }
  );
  
  const [darkMode, setDarkMode] = useGlobalState<boolean>(
    'accessibility_dark_mode', 
    false,
    { key: 'accessibility_dark_mode' }
  );
  
  const [reducedData, setReducedData] = useGlobalState<boolean>(
    'accessibility_reduced_data', 
    false,
    { key: 'accessibility_reduced_data' }
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Configurações de Acessibilidade</Text>
      </View>
      
      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Exibição</Text>
          
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <View style={styles.settingHeader}>
                <Eye size={20} color={Theme.colors.primary.blue} />
                <Text style={styles.settingTitle}>Alto Contraste</Text>
              </View>
              <Text style={styles.settingDescription}>
                Aumenta o contraste para melhor visibilidade
              </Text>
            </View>
            <Switch
              value={highContrast}
              onValueChange={setHighContrast}
              trackColor={{ 
                false: Theme.colors.ui.disabled, 
                true: Theme.colors.primary.blue + '40' 
              }}
              thumbColor={highContrast ? Theme.colors.primary.blue : '#f4f3f4'}
              accessibilityLabel="Alto Contraste"
              accessibilityRole="switch"
              accessibilityState={{ checked: highContrast }}
            />
          </View>
          
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <View style={styles.settingHeader}>
                <Eye size={20} color={Theme.colors.primary.blue} />
                <Text style={styles.settingTitle}>Texto Grande</Text>
              </View>
              <Text style={styles.settingDescription}>
                Aumenta o tamanho do texto para melhor leitura
              </Text>
            </View>
            <Switch
              value={largeText}
              onValueChange={setLargeText}
              trackColor={{ 
                false: Theme.colors.ui.disabled, 
                true: Theme.colors.primary.blue + '40' 
              }}
              thumbColor={largeText ? Theme.colors.primary.blue : '#f4f3f4'}
              accessibilityLabel="Texto Grande"
              accessibilityRole="switch"
              accessibilityState={{ checked: largeText }}
            />
          </View>
          
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <View style={styles.settingHeader}>
                <Moon size={20} color={Theme.colors.primary.blue} />
                <Text style={styles.settingTitle}>Modo Escuro</Text>
              </View>
              <Text style={styles.settingDescription}>
                Tema escuro para reduzir o cansaço visual
              </Text>
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
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Movimento e Animações</Text>
          
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <View style={styles.settingHeader}>
                <Clock size={20} color={Theme.colors.primary.blue} />
                <Text style={styles.settingTitle}>Reduzir Movimento</Text>
              </View>
              <Text style={styles.settingDescription}>
                Diminui ou remove animações e efeitos de movimento
              </Text>
            </View>
            <Switch
              value={reduceMotion}
              onValueChange={setReduceMotion}
              trackColor={{ 
                false: Theme.colors.ui.disabled, 
                true: Theme.colors.primary.blue + '40' 
              }}
              thumbColor={reduceMotion ? Theme.colors.primary.blue : '#f4f3f4'}
              accessibilityLabel="Reduzir Movimento"
              accessibilityRole="switch"
              accessibilityState={{ checked: reduceMotion }}
            />
          </View>
          
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <View style={styles.settingHeader}>
                <Eye size={20} color={Theme.colors.primary.blue} />
                <Text style={styles.settingTitle}>Autoplay de Mídia</Text>
              </View>
              <Text style={styles.settingDescription}>
                Reproduz automaticamente vídeos e animações
              </Text>
            </View>
            <Switch
              value={autoplayMedia}
              onValueChange={setAutoplayMedia}
              trackColor={{ 
                false: Theme.colors.ui.disabled, 
                true: Theme.colors.primary.blue + '40' 
              }}
              thumbColor={autoplayMedia ? Theme.colors.primary.blue : '#f4f3f4'}
              accessibilityLabel="Autoplay de Mídia"
              accessibilityRole="switch"
              accessibilityState={{ checked: autoplayMedia }}
            />
          </View>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Áudio e Toque</Text>
          
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <View style={styles.settingHeader}>
                <Volume2 size={20} color={Theme.colors.primary.blue} />
                <Text style={styles.settingTitle}>Efeitos Sonoros</Text>
              </View>
              <Text style={styles.settingDescription}>
                Sons de feedback e notificações
              </Text>
            </View>
            <Switch
              value={soundEffects}
              onValueChange={setSoundEffects}
              trackColor={{ 
                false: Theme.colors.ui.disabled, 
                true: Theme.colors.primary.blue + '40' 
              }}
              thumbColor={soundEffects ? Theme.colors.primary.blue : '#f4f3f4'}
              accessibilityLabel="Efeitos Sonoros"
              accessibilityRole="switch"
              accessibilityState={{ checked: soundEffects }}
            />
          </View>
          
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <View style={styles.settingHeader}>
                <Vibration size={20} color={Theme.colors.primary.blue} />
                <Text style={styles.settingTitle}>Feedback Tátil</Text>
              </View>
              <Text style={styles.settingDescription}>
                Vibração ao interagir com elementos
              </Text>
            </View>
            <Switch
              value={hapticFeedback}
              onValueChange={setHapticFeedback}
              trackColor={{ 
                false: Theme.colors.ui.disabled, 
                true: Theme.colors.primary.blue + '40' 
              }}
              thumbColor={hapticFeedback ? Theme.colors.primary.blue : '#f4f3f4'}
              accessibilityLabel="Feedback Tátil"
              accessibilityRole="switch"
              accessibilityState={{ checked: hapticFeedback }}
            />
          </View>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Leitores de Tela</Text>
          
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <View style={styles.settingHeader}>
                <Volume2 size={20} color={Theme.colors.primary.blue} />
                <Text style={styles.settingTitle}>Otimizar para Leitores de Tela</Text>
              </View>
              <Text style={styles.settingDescription}>
                Melhora a experiência para usuários de leitores de tela
              </Text>
            </View>
            <Switch
              value={screenReader}
              onValueChange={setScreenReader}
              trackColor={{ 
                false: Theme.colors.ui.disabled, 
                true: Theme.colors.primary.blue + '40' 
              }}
              thumbColor={screenReader ? Theme.colors.primary.blue : '#f4f3f4'}
              accessibilityLabel="Otimizar para Leitores de Tela"
              accessibilityRole="switch"
              accessibilityState={{ checked: screenReader }}
            />
          </View>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Dados e Performance</Text>
          
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <View style={styles.settingHeader}>
                <Zap size={20} color={Theme.colors.primary.blue} />
                <Text style={styles.settingTitle}>Modo de Dados Reduzidos</Text>
              </View>
              <Text style={styles.settingDescription}>
                Carrega imagens em menor qualidade para economizar dados
              </Text>
            </View>
            <Switch
              value={reducedData}
              onValueChange={setReducedData}
              trackColor={{ 
                false: Theme.colors.ui.disabled, 
                true: Theme.colors.primary.blue + '40' 
              }}
              thumbColor={reducedData ? Theme.colors.primary.blue : '#f4f3f4'}
              accessibilityLabel="Modo de Dados Reduzidos"
              accessibilityRole="switch"
              accessibilityState={{ checked: reducedData }}
            />
          </View>
        </View>
        
        <View style={styles.infoBox}>
          <Text style={styles.infoText}>
            Estas configurações ajudam a tornar o aplicativo mais acessível para todos os usuários.
            Algumas alterações podem exigir reiniciar o aplicativo para ter efeito completo.
          </Text>
        </View>
      </ScrollView>
      
      {onClose && (
        <View style={styles.footer}>
          <TouchableOpacity 
            style={styles.closeButton}
            onPress={onClose}
            accessibilityLabel="Fechar configurações de acessibilidade"
            accessibilityRole="button"
          >
            <Text style={styles.closeButtonText}>Fechar</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.colors.background.light,
  },
  header: {
    backgroundColor: Theme.colors.background.white,
    padding: Theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Theme.colors.ui.border,
  },
  title: {
    fontFamily: Theme.typography.fontFamily.heading,
    fontSize: Theme.typography.fontSize.lg,
    color: Theme.colors.text.dark,
    textAlign: 'center',
  },
  content: {
    flex: 1,
  },
  section: {
    backgroundColor: Theme.colors.background.white,
    marginVertical: Theme.spacing.sm,
    paddingVertical: Theme.spacing.md,
    paddingHorizontal: Theme.spacing.md,
  },
  sectionTitle: {
    fontFamily: Theme.typography.fontFamily.subheading,
    fontSize: Theme.typography.fontSize.md,
    color: Theme.colors.text.dark,
    marginBottom: Theme.spacing.md,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Theme.colors.ui.border,
  },
  settingInfo: {
    flex: 1,
    marginRight: Theme.spacing.md,
  },
  settingHeader: {
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
    marginLeft: Theme.spacing.lg,
  },
  infoBox: {
    backgroundColor: Theme.colors.background.lilac,
    margin: Theme.spacing.md,
    padding: Theme.spacing.md,
    borderRadius: Theme.borderRadius.md,
  },
  infoText: {
    fontFamily: Theme.typography.fontFamily.body,
    fontSize: Theme.typography.fontSize.sm,
    color: Theme.colors.text.dark,
    lineHeight: 20,
    textAlign: 'center',
  },
  footer: {
    padding: Theme.spacing.md,
    backgroundColor: Theme.colors.background.white,
    borderTopWidth: 1,
    borderTopColor: Theme.colors.ui.border,
  },
  closeButton: {
    backgroundColor: Theme.colors.primary.blue,
    borderRadius: Theme.borderRadius.md,
    paddingVertical: Theme.spacing.md,
    alignItems: 'center',
  },
  closeButtonText: {
    fontFamily: Theme.typography.fontFamily.subheading,
    fontSize: Theme.typography.fontSize.md,
    color: Theme.colors.background.white,
  },
});