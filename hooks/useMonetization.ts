import { useState, useEffect } from 'react';
import { Platform, Alert } from 'react-native';
import { 
  MonetizationSystem, 
  SubscriptionPlan, 
  InAppPurchase, 
  UserSubscription 
} from '@/utils/monetizationSystem';
import { useNotifications } from './useNotifications';
import { useGamification } from './useGamification';

export function useMonetization() {
  const [userSubscription, setUserSubscription] = useState<UserSubscription | null>(null);
  const [purchaseHistory, setPurchaseHistory] = useState<any[]>([]);
  const [availablePlans, setAvailablePlans] = useState<SubscriptionPlan[]>([]);
  const [availablePurchases, setAvailablePurchases] = useState<InAppPurchase[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isPurchasing, setIsPurchasing] = useState(false);
  const [isRestoring, setIsRestoring] = useState(false);
  
  const { sendLocalNotification } = useNotifications();
  const { addPoints } = useGamification();

  // Initialize monetization data
  useEffect(() => {
    loadSubscriptionData();
    loadPurchaseHistory();
    loadAvailablePlans();
    loadAvailablePurchases();
  }, []);

  const loadSubscriptionData = async () => {
    setIsLoading(true);
    try {
      // In a real app, this would fetch from an API or RevenueCat
      // For now, we'll use mock data
      const mockSubscription: UserSubscription | null = null;
      
      setUserSubscription(mockSubscription);
    } catch (error) {
      console.error('Error loading subscription data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadPurchaseHistory = async () => {
    try {
      // In a real app, this would fetch from an API or RevenueCat
      // For now, we'll use mock data
      const mockPurchaseHistory: any[] = [];
      
      setPurchaseHistory(mockPurchaseHistory);
    } catch (error) {
      console.error('Error loading purchase history:', error);
    }
  };

  const loadAvailablePlans = async () => {
    try {
      // In a real app, this would fetch from an API or RevenueCat
      // For now, we'll use the static data from MonetizationSystem
      const plans = MonetizationSystem.getAvailablePlans();
      setAvailablePlans(plans);
    } catch (error) {
      console.error('Error loading available plans:', error);
    }
  };

  const loadAvailablePurchases = async () => {
    try {
      // In a real app, this would fetch from an API or RevenueCat
      // For now, we'll use the static data from MonetizationSystem
      const purchases = MonetizationSystem.getAvailablePurchases();
      setAvailablePurchases(purchases);
    } catch (error) {
      console.error('Error loading available purchases:', error);
    }
  };

  const purchaseSubscription = async (planId: string): Promise<boolean> => {
    if (isPurchasing) return false;
    
    setIsPurchasing(true);
    try {
      // In a real app, this would initiate a purchase through RevenueCat
      // For now, we'll simulate a successful purchase
      
      // Find the plan
      const plan = MonetizationSystem.getSubscriptionPlan(planId);
      if (!plan) {
        throw new Error('Plan not found');
      }
      
      // Simulate purchase flow
      if (Platform.OS === 'web') {
        Alert.alert(
          'Compra Simulada',
          `Esta é uma simulação de compra do plano ${plan.name} por ${MonetizationSystem.formatPrice(plan.price, plan.currency)}/${plan.interval}.`,
          [
            { text: 'Cancelar', style: 'cancel' },
            { 
              text: 'Comprar', 
              onPress: () => {
                // Create mock subscription
                const now = Date.now();
                const endDate = plan.interval === 'month' 
                  ? now + (30 * 24 * 60 * 60 * 1000) // 30 days
                  : now + (365 * 24 * 60 * 60 * 1000); // 365 days
                
                const newSubscription: UserSubscription = {
                  userId: 'current_user',
                  planId: plan.id,
                  status: 'active',
                  startDate: now,
                  endDate: endDate,
                  autoRenew: true,
                  platform: Platform.OS as 'ios' | 'android' | 'web',
                  features: plan.features.map(f => f.toLowerCase().replace(/\s+/g, '_'))
                };
                
                setUserSubscription(newSubscription);
                
                // Add gamification points for subscribing
                addPoints('subscription_purchase', 10);
                
                // Send notification
                sendLocalNotification(
                  'Assinatura Ativada',
                  `Seu plano ${plan.name} foi ativado com sucesso!`,
                  'like'
                );
              }
            }
          ]
        );
        
        return true;
      } else {
        // For mobile, we would use RevenueCat here
        // Since we can't actually implement that in this environment,
        // we'll show a message about exporting the project
        Alert.alert(
          'Implementação RevenueCat Necessária',
          'Para implementar compras reais, você precisará exportar este projeto e instalar o SDK do RevenueCat. Consulte a documentação em https://www.revenuecat.com/docs/getting-started/installation/expo',
          [{ text: 'OK' }]
        );
        
        return false;
      }
    } catch (error) {
      console.error('Error purchasing subscription:', error);
      Alert.alert('Erro', 'Não foi possível processar sua compra. Tente novamente.');
      return false;
    } finally {
      setIsPurchasing(false);
    }
  };

  const purchaseProduct = async (productId: string): Promise<boolean> => {
    if (isPurchasing) return false;
    
    setIsPurchasing(true);
    try {
      // In a real app, this would initiate a purchase through RevenueCat
      // For now, we'll simulate a successful purchase
      
      // Find the product
      const product = MonetizationSystem.getInAppPurchase(productId);
      if (!product) {
        throw new Error('Product not found');
      }
      
      // Simulate purchase flow
      if (Platform.OS === 'web') {
        Alert.alert(
          'Compra Simulada',
          `Esta é uma simulação de compra do produto ${product.name} por ${MonetizationSystem.formatPrice(product.price, product.currency)}.`,
          [
            { text: 'Cancelar', style: 'cancel' },
            { 
              text: 'Comprar', 
              onPress: () => {
                // Add to purchase history
                const now = Date.now();
                const newPurchase = {
                  id: `purchase_${now}`,
                  productId: product.id,
                  purchaseDate: now,
                  expiryDate: product.duration ? now + (product.duration * 24 * 60 * 60 * 1000) : undefined,
                  platform: Platform.OS as 'ios' | 'android' | 'web',
                  status: 'completed'
                };
                
                setPurchaseHistory(prev => [...prev, newPurchase]);
                
                // Add gamification points for purchasing
                addPoints('in_app_purchase', 5);
                
                // Send notification
                sendLocalNotification(
                  'Compra Realizada',
                  `Sua compra de ${product.name} foi concluída com sucesso!`,
                  'like'
                );
              }
            }
          ]
        );
        
        return true;
      } else {
        // For mobile, we would use RevenueCat here
        // Since we can't actually implement that in this environment,
        // we'll show a message about exporting the project
        Alert.alert(
          'Implementação RevenueCat Necessária',
          'Para implementar compras reais, você precisará exportar este projeto e instalar o SDK do RevenueCat. Consulte a documentação em https://www.revenuecat.com/docs/getting-started/installation/expo',
          [{ text: 'OK' }]
        );
        
        return false;
      }
    } catch (error) {
      console.error('Error purchasing product:', error);
      Alert.alert('Erro', 'Não foi possível processar sua compra. Tente novamente.');
      return false;
    } finally {
      setIsPurchasing(false);
    }
  };

  const cancelSubscription = async (): Promise<boolean> => {
    if (!userSubscription) return false;
    
    try {
      // In a real app, this would cancel the subscription through RevenueCat
      // For now, we'll simulate a successful cancellation
      
      Alert.alert(
        'Cancelar Assinatura',
        'Tem certeza que deseja cancelar sua assinatura? Você continuará tendo acesso até o final do período atual.',
        [
          { text: 'Não', style: 'cancel' },
          { 
            text: 'Sim, Cancelar', 
            style: 'destructive',
            onPress: () => {
              // Update subscription status
              setUserSubscription(prev => prev ? {
                ...prev,
                status: 'canceled',
                autoRenew: false
              } : null);
              
              // Send notification
              sendLocalNotification(
                'Assinatura Cancelada',
                'Sua assinatura foi cancelada com sucesso. Você terá acesso até o final do período atual.',
                'like'
              );
            }
          }
        ]
      );
      
      return true;
    } catch (error) {
      console.error('Error canceling subscription:', error);
      Alert.alert('Erro', 'Não foi possível cancelar sua assinatura. Tente novamente.');
      return false;
    }
  };

  const restorePurchases = async (): Promise<boolean> => {
    if (isRestoring) return false;
    
    setIsRestoring(true);
    try {
      // In a real app, this would restore purchases through RevenueCat
      // For now, we'll simulate a successful restoration
      
      Alert.alert(
        'Restaurar Compras',
        'Esta é uma simulação de restauração de compras. Em um app real, isso restauraria suas compras anteriores.',
        [{ text: 'OK' }]
      );
      
      return true;
    } catch (error) {
      console.error('Error restoring purchases:', error);
      Alert.alert('Erro', 'Não foi possível restaurar suas compras. Tente novamente.');
      return false;
    } finally {
      setIsRestoring(false);
    }
  };

  const hasFeatureAccess = (feature: string): boolean => {
    return MonetizationSystem.getFeatureAccess('current_user', userSubscription, feature);
  };

  const isSubscribed = (): boolean => {
    return MonetizationSystem.isSubscriptionActive(userSubscription);
  };

  const getCurrentPlan = (): SubscriptionPlan | null => {
    if (!userSubscription) return null;
    
    const plan = MonetizationSystem.getSubscriptionPlan(userSubscription.planId);
    return plan || null;
  };

  const getRemainingDays = (): number => {
    if (!userSubscription) return 0;
    
    return MonetizationSystem.getRemainingDays(userSubscription);
  };

  const getActivePurchases = (): any[] => {
    const now = Date.now();
    return purchaseHistory.filter(purchase => 
      purchase.status === 'completed' && 
      (!purchase.expiryDate || purchase.expiryDate > now)
    );
  };

  return {
    userSubscription,
    purchaseHistory,
    availablePlans,
    availablePurchases,
    isLoading,
    isPurchasing,
    isRestoring,
    purchaseSubscription,
    purchaseProduct,
    cancelSubscription,
    restorePurchases,
    hasFeatureAccess,
    isSubscribed,
    getCurrentPlan,
    getRemainingDays,
    getActivePurchases,
    refreshSubscription: loadSubscriptionData
  };
}