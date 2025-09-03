import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { Eye, Volume2, Vibrate as Vibration, Clock, Moon, Zap, Info } from 'lucide-react-native';
import Theme from '@/constants/Theme';
import { useTranslation } from '@/utils/i18n';

interface AccessibilityInfoProps {
  onClose?: () => void;
}

export default function AccessibilityInfo({ onClose }: AccessibilityInfoProps) {
  const { t } = useTranslation();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Info size={24} color={Theme.colors.primary.blue} />
        <Text style={styles.title}>Recursos de Acessibilidade</Text>
      </View>
      
      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <View style={styles.featureItem}>
            <View style={styles.featureIcon}>
              <Eye size={24} color={Theme.colors.primary.blue} />
            </View>
            <View style={styles.featureContent}>
              <Text style={styles.featureTitle}>Alto Contraste</Text>
              <Text style={styles.featureDescription}>
                Melhora a legibilidade com maior contraste entre texto e fundo.
              </Text>
              <Text style={styles.featureInstructions}>
                Ative nas configurações de acessibilidade.
              </Text>
            </View>
          </View>
          
          <View style={styles.featureItem}>
            <View style={styles.featureIcon}>
              <Eye size={24} color={Theme.colors.primary.blue} />
            </View>
            <View style={styles.featureContent}>
              <Text style={styles.featureTitle}>Texto Grande</Text>
              <Text style={styles.featureDescription}>
                Aumenta o tamanho do texto para facilitar a leitura.
              </Text>
              <Text style={styles.featureInstructions}>
                Ative nas configurações de acessibilidade ou use as configurações do sistema.
              </Text>
            </View>
          </View>
          
          <View style={styles.featureItem}>
            <View style={styles.featureIcon}>
              <Clock size={24} color={Theme.colors.primary.blue} />
            </View>
            <View style={styles.featureContent}>
              <Text style={styles.featureTitle}>Reduzir Movimento</Text>
              <Text style={styles.featureDescription}>
                Diminui ou remove animações e efeitos de movimento.
              </Text>
              <Text style={styles.featureInstructions}>
                Ideal para pessoas com sensibilidade a movimentos.
              </Text>
            </View>
          </View>
          
          <View style={styles.featureItem}>
            <View style={styles.featureIcon}>
              <Volume2 size={24} color={Theme.colors.primary.blue} />
            </View>
            <View style={styles.featureContent}>
              <Text style={styles.featureTitle}>Compatibilidade com Leitores de Tela</Text>
              <Text style={styles.featureDescription}>
                Suporte completo para VoiceOver (iOS) e TalkBack (Android).
              </Text>
              <Text style={styles.featureInstructions}>
                Todos os elementos têm rótulos e dicas de acessibilidade.
              </Text>
            </View>
          </View>
          
          <View style={styles.featureItem}>
            <View style={styles.featureIcon}>
              <Moon size={24} color={Theme.colors.primary.blue} />
            </View>
            <View style={styles.featureContent}>
              <Text style={styles.featureTitle}>Modo Escuro</Text>
              <Text style={styles.featureDescription}>
                Tema escuro para reduzir o cansaço visual, especialmente em ambientes com pouca luz.
              </Text>
            </View>
          </View>
          
          <View style={styles.featureItem}>
            <View style={styles.featureIcon}>
              <Vibration size={24} color={Theme.colors.primary.blue} />
            </View>
            <View style={styles.featureContent}>
              <Text style={styles.featureTitle}>Feedback Tátil</Text>
              <Text style={styles.featureDescription}>
                Vibração ao interagir com elementos importantes.
              </Text>
              <Text style={styles.featureInstructions}>
                Pode ser desativado nas configurações.
              </Text>
            </View>
          </View>
          
          <View style={styles.featureItem}>
            <View style={styles.featureIcon}>
              <Zap size={24} color={Theme.colors.primary.blue} />
            </View>
            <View style={styles.featureContent}>
              <Text style={styles.featureTitle}>Modo de Dados Reduzidos</Text>
              <Text style={styles.featureDescription}>
                Carrega imagens em menor qualidade para economizar dados e melhorar a performance.
              </Text>
            </View>
          </View>
        </View>
        
        <View style={styles.infoBox}>
          <Text style={styles.infoTitle}>Compromisso com Acessibilidade</Text>
          <Text style={styles.infoText}>
            O Bênção Match está comprometido em proporcionar uma experiência inclusiva para todos os usuários.
            Estamos constantemente trabalhando para melhorar a acessibilidade do aplicativo.
          </Text>
          <Text style={styles.infoText}>
            Se você tiver sugestões ou encontrar problemas de acessibilidade, por favor entre em contato conosco.
          </Text>
        </View>
        
        <View style={styles.verseContainer}>
          <Text style={styles.verse}>
            "Assim resplandeça a vossa luz diante dos homens, para que vejam as vossas boas obras e glorifiquem a vosso Pai, que está nos céus." - Mateus 5:16
          </Text>
        </View>
      </ScrollView>
      
      {onClose && (
        <View style={styles.footer}>
          <TouchableOpacity 
            style={styles.closeButton}
            onPress={onClose}
            accessibilityLabel="Fechar informações de acessibilidade"
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Theme.colors.background.white,
    padding: Theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Theme.colors.ui.border,
  },
  title: {
    fontFamily: Theme.typography.fontFamily.heading,
    fontSize: Theme.typography.fontSize.lg,
    color: Theme.colors.text.dark,
    marginLeft: Theme.spacing.sm,
  },
  content: {
    flex: 1,
  },
  section: {
    backgroundColor: Theme.colors.background.white,
    margin: Theme.spacing.md,
    borderRadius: Theme.borderRadius.lg,
    padding: Theme.spacing.md,
    ...Theme.shadows.small,
  },
  featureItem: {
    flexDirection: 'row',
    marginBottom: Theme.spacing.lg,
  },
  featureIcon: {
    width: 48,
    height: 48,
    borderRadius: Theme.borderRadius.circle,
    backgroundColor: Theme.colors.primary.blue + '20',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Theme.spacing.md,
  },
  featureContent: {
    flex: 1,
  },
  featureTitle: {
    fontFamily: Theme.typography.fontFamily.subheading,
    fontSize: Theme.typography.fontSize.md,
    color: Theme.colors.text.dark,
    marginBottom: Theme.spacing.xs,
  },
  featureDescription: {
    fontFamily: Theme.typography.fontFamily.body,
    fontSize: Theme.typography.fontSize.sm,
    color: Theme.colors.text.medium,
    marginBottom: Theme.spacing.xs,
    lineHeight: 20,
  },
  featureInstructions: {
    fontFamily: Theme.typography.fontFamily.body,
    fontSize: Theme.typography.fontSize.sm,
    color: Theme.colors.primary.blue,
    fontStyle: 'italic',
  },
  infoBox: {
    backgroundColor: Theme.colors.background.lilac,
    margin: Theme.spacing.md,
    borderRadius: Theme.borderRadius.lg,
    padding: Theme.spacing.md,
  },
  infoTitle: {
    fontFamily: Theme.typography.fontFamily.subheading,
    fontSize: Theme.typography.fontSize.md,
    color: Theme.colors.text.dark,
    marginBottom: Theme.spacing.sm,
    textAlign: 'center',
  },
  infoText: {
    fontFamily: Theme.typography.fontFamily.body,
    fontSize: Theme.typography.fontSize.sm,
    color: Theme.colors.text.dark,
    marginBottom: Theme.spacing.sm,
    lineHeight: 20,
    textAlign: 'center',
  },
  verseContainer: {
    margin: Theme.spacing.md,
    marginBottom: Theme.spacing.xl,
  },
  verse: {
    fontFamily: Theme.typography.fontFamily.verse,
    fontSize: Theme.typography.fontSize.sm,
    color: Theme.colors.text.dark,
    textAlign: 'center',
    lineHeight: 20,
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