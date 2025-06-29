import { Platform } from 'react-native';
import Colors from '@/constants/Colors';

export interface SubscriptionPlan {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  interval: 'month' | 'year';
  features: string[];
  popularFeature?: string;
  isPopular?: boolean;
  storeProductId: {
    ios?: string;
    android?: string;
  };
  color: string;
  blessings: string[];
  verse?: string;
}

export interface InAppPurchase {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  storeProductId: {
    ios?: string;
    android?: string;
  };
  category: 'boost' | 'feature' | 'blessing';
  icon: string;
  duration?: number; // in days, if applicable
}

export interface UserSubscription {
  userId: string;
  planId: string;
  status: 'active' | 'canceled' | 'expired' | 'trial';
  startDate: number;
  endDate: number;
  autoRenew: boolean;
  platform: 'ios' | 'android' | 'web';
  receiptData?: string;
  features: string[];
}

export interface PurchaseHistory {
  userId: string;
  purchases: {
    id: string;
    productId: string;
    purchaseDate: number;
    expiryDate?: number;
    platform: 'ios' | 'android' | 'web';
    receiptData?: string;
    status: 'completed' | 'refunded' | 'pending';
  }[];
}

export class MonetizationSystem {
  static readonly SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
    {
      id: 'basic',
      name: 'Plano Básico',
      description: 'Ideal para quem está começando sua jornada',
      price: 0,
      currency: 'BRL',
      interval: 'month',
      features: [
        'Até 10 conexões por dia',
        'Acesso a eventos comunitários',
        'Pedidos de oração ilimitados',
        'Versículo diário personalizado'
      ],
      storeProductId: {},
      color: Colors.primary.blue,
      blessings: [
        'Acesso à comunidade cristã'
      ]
    },
    {
      id: 'blessed',
      name: 'Plano Abençoado',
      description: 'Para quem busca conexões mais profundas',
      price: 29.90,
      currency: 'BRL',
      interval: 'month',
      features: [
        'Conexões ilimitadas',
        'Filtros avançados de compatibilidade',
        'Visualização de quem curtiu seu perfil',
        'Modo incógnito para visualizar perfis',
        'Prioridade nas sugestões de conexão',
        'Sem anúncios'
      ],
      popularFeature: 'Visualização de quem curtiu seu perfil',
      isPopular: true,
      storeProductId: {
        ios: 'com.bencaomatch.blessed.monthly',
        android: 'com.bencaomatch.blessed.monthly'
      },
      color: Colors.primary.pink,
      blessings: [
        'Acesso a círculos de oração exclusivos',
        'Mentoria espiritual personalizada'
      ],
      verse: 'Melhor é serem dois do que um, porque têm melhor paga do seu trabalho. Eclesiastes 4:9'
    },
    {
      id: 'blessed_annual',
      name: 'Plano Abençoado Anual',
      description: 'Economize 30% com o plano anual',
      price: 249.90,
      currency: 'BRL',
      interval: 'year',
      features: [
        'Todos os benefícios do Plano Abençoado',
        'Economia de 30% em relação ao plano mensal',
        'Acesso a eventos exclusivos',
        'Verificação prioritária de perfil',
        'Suporte dedicado'
      ],
      storeProductId: {
        ios: 'com.bencaomatch.blessed.yearly',
        android: 'com.bencaomatch.blessed.yearly'
      },
      color: Colors.primary.gold,
      blessings: [
        'Acesso a círculos de oração exclusivos',
        'Mentoria espiritual personalizada',
        'Retiros virtuais exclusivos'
      ],
      verse: 'Entrega o teu caminho ao Senhor; confia nele, e ele tudo fará. Salmos 37:5'
    }
  ];

  static readonly IN_APP_PURCHASES: InAppPurchase[] = [
    {
      id: 'boost_7days',
      name: 'Impulso de 7 dias',
      description: 'Aumente sua visibilidade por 7 dias',
      price: 19.90,
      currency: 'BRL',
      storeProductId: {
        ios: 'com.bencaomatch.boost.7days',
        android: 'com.bencaomatch.boost.7days'
      },
      category: 'boost',
      icon: 'zap',
      duration: 7
    },
    {
      id: 'boost_30days',
      name: 'Impulso de 30 dias',
      description: 'Aumente sua visibilidade por 30 dias',
      price: 49.90,
      currency: 'BRL',
      storeProductId: {
        ios: 'com.bencaomatch.boost.30days',
        android: 'com.bencaomatch.boost.30days'
      },
      category: 'boost',
      icon: 'zap',
      duration: 30
    },
    {
      id: 'feature_superlike',
      name: 'Super Curtidas (5)',
      description: 'Destaque-se com 5 super curtidas',
      price: 14.90,
      currency: 'BRL',
      storeProductId: {
        ios: 'com.bencaomatch.superlike.5',
        android: 'com.bencaomatch.superlike.5'
      },
      category: 'feature',
      icon: 'heart'
    },
    {
      id: 'feature_rewind',
      name: 'Voltar Perfil (3)',
      description: 'Volte para perfis que você passou',
      price: 9.90,
      currency: 'BRL',
      storeProductId: {
        ios: 'com.bencaomatch.rewind.3',
        android: 'com.bencaomatch.rewind.3'
      },
      category: 'feature',
      icon: 'rotate-ccw'
    },
    {
      id: 'blessing_verification',
      name: 'Verificação Prioritária',
      description: 'Obtenha o selo de verificação mais rápido',
      price: 29.90,
      currency: 'BRL',
      storeProductId: {
        ios: 'com.bencaomatch.verification',
        android: 'com.bencaomatch.verification'
      },
      category: 'blessing',
      icon: 'shield'
    }
  ];

  static getSubscriptionPlan(planId: string): SubscriptionPlan | undefined {
    return this.SUBSCRIPTION_PLANS.find(plan => plan.id === planId);
  }

  static getInAppPurchase(purchaseId: string): InAppPurchase | undefined {
    return this.IN_APP_PURCHASES.find(purchase => purchase.id === purchaseId);
  }

  static getAvailablePlans(): SubscriptionPlan[] {
    return this.SUBSCRIPTION_PLANS;
  }

  static getAvailablePurchases(): InAppPurchase[] {
    return this.IN_APP_PURCHASES;
  }

  static getStoreProductId(product: SubscriptionPlan | InAppPurchase): string | undefined {
    if (Platform.OS === 'ios') {
      return product.storeProductId.ios;
    } else if (Platform.OS === 'android') {
      return product.storeProductId.android;
    }
    return undefined;
  }

  static formatPrice(price: number, currency: string): string {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: currency
    }).format(price);
  }

  static calculateSavings(monthlyPlan: SubscriptionPlan, annualPlan: SubscriptionPlan): number {
    const monthlyCostForYear = monthlyPlan.price * 12;
    const annualCost = annualPlan.price;
    
    return Math.round(((monthlyCostForYear - annualCost) / monthlyCostForYear) * 100);
  }

  static isSubscriptionActive(subscription: UserSubscription | null): boolean {
    if (!subscription) return false;
    
    const now = Date.now();
    return subscription.status === 'active' && subscription.endDate > now;
  }

  static getRemainingDays(subscription: UserSubscription): number {
    const now = Date.now();
    const diffTime = subscription.endDate - now;
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  static getFeatureAccess(userId: string, subscription: UserSubscription | null, feature: string): boolean {
    // Free features available to all users
    const freeFeatures = [
      'basic_matching',
      'prayer_requests',
      'daily_verse',
      'community_access'
    ];
    
    if (freeFeatures.includes(feature)) {
      return true;
    }
    
    // Check if user has an active subscription with this feature
    if (subscription && this.isSubscriptionActive(subscription)) {
      return subscription.features.includes(feature);
    }
    
    return false;
  }

  static getPremiumFeatures(): string[] {
    return [
      'unlimited_connections',
      'advanced_filters',
      'see_likes',
      'incognito_mode',
      'priority_matching',
      'no_ads',
      'exclusive_prayer_circles',
      'spiritual_mentoring',
      'exclusive_events',
      'priority_verification',
      'dedicated_support'
    ];
  }

  static getFeatureDescription(feature: string): string {
    const descriptions = {
      'unlimited_connections': 'Conexões ilimitadas com outros cristãos',
      'advanced_filters': 'Filtros avançados de compatibilidade',
      'see_likes': 'Veja quem curtiu seu perfil',
      'incognito_mode': 'Navegue perfis sem ser visto',
      'priority_matching': 'Prioridade nas sugestões de conexão',
      'no_ads': 'Experiência sem anúncios',
      'exclusive_prayer_circles': 'Acesso a círculos de oração exclusivos',
      'spiritual_mentoring': 'Mentoria espiritual personalizada',
      'exclusive_events': 'Acesso a eventos exclusivos',
      'priority_verification': 'Verificação prioritária de perfil',
      'dedicated_support': 'Suporte dedicado'
    };
    
    return descriptions[feature] || feature;
  }
}