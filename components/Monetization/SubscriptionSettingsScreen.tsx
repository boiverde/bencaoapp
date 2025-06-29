import { useState } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity, 
  Switch, 
  Alert 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { 
  ChevronLeft, 
  CreditCard, 
  Calendar, 
  RefreshCw, 
  Bell, 
  LogOut, 
  Crown, 
  Shield, 
  Info 
} from 'lucide-react-native';
import Theme from '@/constants/Theme';
import { useMonetization } from '@/hooks/useMonetization';
import { MonetizationSystem } from '@/utils/monetizationSystem';

interface SubscriptionSettingsScreenProps {
  onBack: () => void;
  onViewPlans: () => void;
}

export default function SubscriptionSettingsScreen({ 
  onBack,
  onViewPlans
}: SubscriptionSettingsScreenProps) {
  const [autoRenew, setAutoRenew] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);
  
  const { 
    isSubscribed, 
    getCurrentPlan, 
    getRemainingDays, 
    cancelSubscription,
    restorePurchases,
    userSubscription
  } = useMonetization();

  const currentPlan = getCurrentPlan();
  const remainingDays = getRemainingDays();

  const handleToggleAutoRenew = () => {
    Alert.alert(
      autoRenew ? 'Desativar Renovação Automática' : 'Ativar Renovação Automática',
      autoRenew 
        ? 'Sua assinatura não será renovada automaticamente ao final do período atual. Você perderá o acesso aos recursos premium após o término da assinatura.'
        : 'Sua assinatura será renovada automaticamente ao final de cada período para evitar interrupção dos recursos premium.',
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: autoRenew ? 'Desativar' : 'Ativar', 
          onPress: () => setAutoRenew(!autoRenew)
        }
      ]
    );
  };

  const handleCancelSubscription = () => {
    cancelSubscription();
  };

  const handleRestorePurchases = () => {
    restorePurchases();
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString();
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <ChevronLeft size={24} color={Theme.colors.text.dark} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Gerenciar Assinatura</Text>
        <View style={styles.placeholder} />
      </View>
      
      <ScrollView style={styles.content}>
        {isSubscribed() && currentPlan ? (
          <View style={styles.subscriptionCard}>
            <View style={styles.subscriptionHeader}>
              <Crown size={24} color={Theme.colors.primary.gold} />
              <Text style={styles.subscriptionTitle}>{currentPlan.name}</Text>
            </View>
            
            <View style={styles.subscriptionDetails}>
              <View style={styles.detailItem}>
                <CreditCard size={16} color={Theme.colors.text.medium} />
                <Text style={styles.detailText}>
                  {MonetizationSystem.formatPrice(currentPlan.price, currentPlan.currency)}/{currentPlan.interval === 'month' ? 'mês' : 'ano'}
                </Text>
              </View>
              
              <View style={styles.detailItem}>
                <Calendar size={16} color={Theme.colors.text.medium} />
                <Text style={styles.detailText}>
                  Próxima cobrança: {userSubscription ? formatDate(userSubscription.endDate) : 'N/A'}
                </Text>
              </View>
              
              <View style={styles.detailItem}>
                <Shield size={16} color={Theme.colors.text.medium} />
                <Text style={styles.detailText}>
                  Status: {userSubscription?.status === 'active' ? 'Ativo' : 'Inativo'}
                </Text>
              </View>
            </View>
            
            <View style={styles.remainingDaysContainer}>
              <Text style={styles.remainingDaysText}>
                {remainingDays} dias restantes
              </Text>
            </View>
          </View>
        ) : (
          <View style={styles.noSubscriptionCard}>
            <View style={styles.noSubscriptionHeader}>
              <Info size={24} color={Theme.colors.primary.blue} />
              <Text style={styles.noSubscriptionTitle}>Sem Assinatura Ativa</Text>
            </View>
            
            <Text style={styles.noSubscriptionText}>
              Você não possui uma assinatura ativa no momento. Assine o Plano Abençoado para desbloquear recursos premium.
            </Text>
            
            <TouchableOpacity 
              style={styles.viewPlansButton}
              onPress={onViewPlans}
            >
              <Crown size={16} color={Theme.colors.background.white} />
              <Text style={styles.viewPlansButtonText}>Ver Planos</Text>
            </TouchableOpacity>
          </View>
        )}
        
        <View style={styles.settingsSection}>
          <Text style={styles.sectionTitle}>Configurações de Pagamento</Text>
          
          {isSubscribed() && (
            <View style={styles.settingItem}>
              <View style={styles.settingLeft}>
                <RefreshCw size={20} color={Theme.colors.primary.blue} />
                <View style={styles.settingInfo}>
                  <Text style={styles.settingTitle}>Renovação Automática</Text>
                  <Text style={styles.settingDescription}>
                    Renovar automaticamente ao final do período
                  </Text>
                </View>
              </View>
              <Switch
                value={autoRenew}
                onValueChange={handleToggleAutoRenew}
                trackColor={{ 
                  false: Theme.colors.ui.disabled, 
                  true: Theme.colors.primary.blue + '40' 
                }}
                thumbColor={autoRenew ? Theme.colors.primary.blue : '#f4f3f4'}
              />
            </View>
          )}
          
          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Bell size={20} color={Theme.colors.primary.blue} />
              <View style={styles.settingInfo}>
                <Text style={styles.settingTitle}>Notificações por Email</Text>
                <Text style={styles.settingDescription}>
                  Receber emails sobre assinatura e pagamentos
                </Text>
              </View>
            </View>
            <Switch
              value={emailNotifications}
              onValueChange={setEmailNotifications}
              trackColor={{ 
                false: Theme.colors.ui.disabled, 
                true: Theme.colors.primary.blue + '40' 
              }}
              thumbColor={emailNotifications ? Theme.colors.primary.blue : '#f4f3f4'}
            />
          </View>
        </View>
        
        <View style={styles.actionsSection}>
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={handleRestorePurchases}
          >
            <RefreshCw size={20} color={Theme.colors.primary.blue} />
            <Text style={styles.actionButtonText}>Restaurar Compras</Text>
          </TouchableOpacity>
          
          {isSubscribed() && (
            <TouchableOpacity 
              style={[styles.actionButton, styles.dangerButton]}
              onPress={handleCancelSubscription}
            >
              <LogOut size={20} color={Theme.colors.status.error} />
              <Text style={[styles.actionButtonText, styles.dangerButtonText]}>
                Cancelar Assinatura
              </Text>
            </TouchableOpacity>
          )}
        </View>
        
        <View style={styles.infoSection}>
          <Text style={styles.infoTitle}>Informações Importantes</Text>
          
          <Text style={styles.infoText}>
            • A cobrança será feita através da sua conta na App Store ou Google Play
          </Text>
          <Text style={styles.infoText}>
            • A assinatura será renovada automaticamente, a menos que a renovação automática seja desativada pelo menos 24 horas antes do final do período atual
          </Text>
          <Text style={styles.infoText}>
            • O cancelamento entrará em vigor ao final do período atual
          </Text>
          <Text style={styles.infoText}>
            • Você pode gerenciar suas assinaturas nas configurações da sua conta na App Store ou Google Play
          </Text>
        </View>
        
        <View style={styles.supportSection}>
          <Text style={styles.supportTitle}>Precisa de Ajuda?</Text>
          <TouchableOpacity style={styles.supportButton}>
            <Text style={styles.supportButtonText}>Contatar Suporte</Text>
          </TouchableOpacity>
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
    padding: Theme.spacing.md,
  },
  subscriptionCard: {
    backgroundColor: Theme.colors.background.white,
    borderRadius: Theme.borderRadius.lg,
    padding: Theme.spacing.lg,
    marginBottom: Theme.spacing.lg,
    ...Theme.shadows.small,
  },
  subscriptionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Theme.spacing.md,
  },
  subscriptionTitle: {
    fontFamily: Theme.typography.fontFamily.subheading,
    fontSize: Theme.typography.fontSize.lg,
    color: Theme.colors.text.dark,
    marginLeft: Theme.spacing.sm,
  },
  subscriptionDetails: {
    marginBottom: Theme.spacing.md,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Theme.spacing.sm,
  },
  detailText: {
    fontFamily: Theme.typography.fontFamily.body,
    fontSize: Theme.typography.fontSize.md,
    color: Theme.colors.text.dark,
    marginLeft: Theme.spacing.sm,
  },
  remainingDaysContainer: {
    backgroundColor: Theme.colors.primary.gold + '20',
    borderRadius: Theme.borderRadius.md,
    paddingVertical: Theme.spacing.sm,
    paddingHorizontal: Theme.spacing.md,
    alignSelf: 'flex-start',
  },
  remainingDaysText: {
    fontFamily: Theme.typography.fontFamily.subheading,
    fontSize: Theme.typography.fontSize.sm,
    color: Theme.colors.primary.gold,
  },
  noSubscriptionCard: {
    backgroundColor: Theme.colors.background.white,
    borderRadius: Theme.borderRadius.lg,
    padding: Theme.spacing.lg,
    marginBottom: Theme.spacing.lg,
    ...Theme.shadows.small,
  },
  noSubscriptionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Theme.spacing.md,
  },
  noSubscriptionTitle: {
    fontFamily: Theme.typography.fontFamily.subheading,
    fontSize: Theme.typography.fontSize.lg,
    color: Theme.colors.text.dark,
    marginLeft: Theme.spacing.sm,
  },
  noSubscriptionText: {
    fontFamily: Theme.typography.fontFamily.body,
    fontSize: Theme.typography.fontSize.md,
    color: Theme.colors.text.medium,
    marginBottom: Theme.spacing.md,
    lineHeight: 22,
  },
  viewPlansButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Theme.colors.primary.blue,
    borderRadius: Theme.borderRadius.md,
    paddingVertical: Theme.spacing.md,
  },
  viewPlansButtonText: {
    fontFamily: Theme.typography.fontFamily.subheading,
    fontSize: Theme.typography.fontSize.md,
    color: Theme.colors.background.white,
    marginLeft: Theme.spacing.sm,
  },
  settingsSection: {
    backgroundColor: Theme.colors.background.white,
    borderRadius: Theme.borderRadius.lg,
    padding: Theme.spacing.md,
    marginBottom: Theme.spacing.lg,
    ...Theme.shadows.small,
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
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: Theme.spacing.md,
  },
  settingInfo: {
    marginLeft: Theme.spacing.md,
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
  },
  actionsSection: {
    backgroundColor: Theme.colors.background.white,
    borderRadius: Theme.borderRadius.lg,
    padding: Theme.spacing.md,
    marginBottom: Theme.spacing.lg,
    ...Theme.shadows.small,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Theme.colors.ui.border,
  },
  actionButtonText: {
    fontFamily: Theme.typography.fontFamily.body,
    fontSize: Theme.typography.fontSize.md,
    color: Theme.colors.primary.blue,
    marginLeft: Theme.spacing.md,
  },
  dangerButton: {
    borderBottomWidth: 0,
  },
  dangerButtonText: {
    color: Theme.colors.status.error,
  },
  infoSection: {
    backgroundColor: Theme.colors.background.white,
    borderRadius: Theme.borderRadius.lg,
    padding: Theme.spacing.md,
    marginBottom: Theme.spacing.lg,
    ...Theme.shadows.small,
  },
  infoTitle: {
    fontFamily: Theme.typography.fontFamily.subheading,
    fontSize: Theme.typography.fontSize.md,
    color: Theme.colors.text.dark,
    marginBottom: Theme.spacing.md,
  },
  infoText: {
    fontFamily: Theme.typography.fontFamily.body,
    fontSize: Theme.typography.fontSize.sm,
    color: Theme.colors.text.medium,
    marginBottom: Theme.spacing.sm,
    lineHeight: 18,
  },
  supportSection: {
    backgroundColor: Theme.colors.background.white,
    borderRadius: Theme.borderRadius.lg,
    padding: Theme.spacing.md,
    marginBottom: Theme.spacing.xl,
    alignItems: 'center',
    ...Theme.shadows.small,
  },
  supportTitle: {
    fontFamily: Theme.typography.fontFamily.subheading,
    fontSize: Theme.typography.fontSize.md,
    color: Theme.colors.text.dark,
    marginBottom: Theme.spacing.md,
  },
  supportButton: {
    backgroundColor: Theme.colors.background.light,
    borderRadius: Theme.borderRadius.md,
    paddingHorizontal: Theme.spacing.lg,
    paddingVertical: Theme.spacing.md,
  },
  supportButtonText: {
    fontFamily: Theme.typography.fontFamily.body,
    fontSize: Theme.typography.fontSize.md,
    color: Theme.colors.primary.blue,
  },
});