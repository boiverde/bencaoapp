import { useState, useEffect } from 'react';
import { Platform } from 'react-native';
import {
  SecurityProfile,
  SecurityReport,
  SecurityAlert,
  VerificationRequest,
  SecurityBlessing,
  SecuritySystem
} from '@/utils/securitySystem';
import { useNotifications } from './useNotifications';

export function useSecurity() {
  const [securityProfile, setSecurityProfile] = useState<SecurityProfile | null>(null);
  const [securityAlerts, setSecurityAlerts] = useState<SecurityAlert[]>([]);
  const [verificationRequests, setVerificationRequests] = useState<VerificationRequest[]>([]);
  const [isSecureMode, setIsSecureMode] = useState(false);
  const [biometricAvailable, setBiometricAvailable] = useState(false);
  const [encryptionEnabled, setEncryptionEnabled] = useState(false);
  
  const { sendLocalNotification } = useNotifications();

  useEffect(() => {
    loadSecurityProfile();
    checkBiometricAvailability();
    loadSecurityAlerts();
    loadVerificationRequests();
  }, []);

  const loadSecurityProfile = async () => {
    // Mock security profile - in real app, load from secure storage
    const mockProfile: SecurityProfile = {
      userId: 'current_user',
      verificationLevel: 'enhanced',
      verifications: {
        email: true,
        phone: true,
        identity: true,
        church: true,
        pastor: false,
        community: false,
        background: false
      },
      trustScore: 75,
      safetyRating: 'high',
      reportHistory: [],
      blockedUsers: [],
      privacySettings: {
        profileVisibility: 'members_only',
        locationSharing: 'city_only',
        churchInfoVisible: true,
        denominationVisible: true,
        contactInfoVisible: 'verified_only',
        prayerRequestsVisible: 'community_only',
        testimonySharing: true,
        photoAccess: 'verified_only',
        messageFiltering: 'basic',
        blockUnverified: false,
        requireVerificationForContact: true
      },
      securitySettings: {
        twoFactorAuth: true,
        loginNotifications: true,
        deviceTracking: true,
        suspiciousActivityAlerts: true,
        passwordStrength: 'strong',
        sessionTimeout: 30,
        biometricAuth: false,
        encryptedMessages: true,
        autoLogout: true,
        secureMode: false,
        spiritualAccountability: true,
        communityModeration: true
      },
      lastSecurityCheck: Date.now() - 86400000,
      riskFactors: [],
      blessings: [
        {
          id: 'blessing_1',
          type: 'verified_believer',
          grantedBy: 'pastor_john',
          grantedAt: Date.now() - 2592000000,
          description: 'Verificado como membro fiel da comunidade',
          verse: 'Bem-aventurados os que não viram e creram. João 20:29'
        }
      ]
    };

    // Calculate current trust score
    mockProfile.trustScore = SecuritySystem.calculateTrustScore(mockProfile);
    mockProfile.safetyRating = SecuritySystem.getSafetyRating(mockProfile.trustScore);
    mockProfile.verificationLevel = SecuritySystem.getVerificationLevel(mockProfile.verifications);

    setSecurityProfile(mockProfile);
  };

  const checkBiometricAvailability = async () => {
    // Check if biometric authentication is available
    if (Platform.OS !== 'web') {
      // In a real app, use expo-local-authentication
      setBiometricAvailable(true);
    }
  };

  const loadSecurityAlerts = async () => {
    // Mock security alerts
    const mockAlerts: SecurityAlert[] = [
      {
        id: 'alert_1',
        userId: 'current_user',
        type: 'login_attempt',
        severity: 'info',
        message: 'Login realizado com sucesso de São Paulo, SP',
        timestamp: Date.now() - 3600000,
        location: 'São Paulo, SP',
        device: 'iPhone 13',
        resolved: true
      }
    ];

    setSecurityAlerts(mockAlerts);
  };

  const loadVerificationRequests = async () => {
    // Mock verification requests
    const mockRequests: VerificationRequest[] = [];
    setVerificationRequests(mockRequests);
  };

  const updatePrivacySettings = (settings: Partial<SecurityProfile['privacySettings']>) => {
    if (!securityProfile) return;

    setSecurityProfile(prev => prev ? {
      ...prev,
      privacySettings: { ...prev.privacySettings, ...settings }
    } : null);

    sendLocalNotification(
      'Configurações Atualizadas',
      'Suas configurações de privacidade foram atualizadas com sucesso',
      'like'
    );
  };

  const updateSecuritySettings = (settings: Partial<SecurityProfile['securitySettings']>) => {
    if (!securityProfile) return;

    setSecurityProfile(prev => prev ? {
      ...prev,
      securitySettings: { ...prev.securitySettings, ...settings }
    } : null);

    // Enable secure mode if critical security features are enabled
    if (settings.twoFactorAuth || settings.encryptedMessages) {
      setIsSecureMode(true);
    }

    sendLocalNotification(
      'Segurança Atualizada',
      'Suas configurações de segurança foram atualizadas',
      'like'
    );
  };

  const enableTwoFactorAuth = async (method: 'sms' | 'email' | 'app') => {
    if (!securityProfile) return false;

    try {
      // Simulate 2FA setup
      await new Promise(resolve => setTimeout(resolve, 2000));

      updateSecuritySettings({ twoFactorAuth: true });

      sendLocalNotification(
        'Autenticação de Dois Fatores Ativada',
        'Sua conta agora está mais segura com 2FA',
        'like'
      );

      return true;
    } catch (error) {
      console.error('Failed to enable 2FA:', error);
      return false;
    }
  };

  const enableBiometricAuth = async () => {
    if (!biometricAvailable || !securityProfile) return false;

    try {
      // In a real app, use expo-local-authentication
      updateSecuritySettings({ biometricAuth: true });

      sendLocalNotification(
        'Autenticação Biométrica Ativada',
        'Você pode agora usar sua impressão digital ou Face ID',
        'like'
      );

      return true;
    } catch (error) {
      console.error('Failed to enable biometric auth:', error);
      return false;
    }
  };

  const reportUser = async (
    reportedUserId: string,
    type: SecurityReport['type'],
    description: string,
    evidence: any[] = []
  ) => {
    if (!securityProfile) return null;

    const report = SecuritySystem.createSecurityReport(
      securityProfile.userId,
      reportedUserId,
      type,
      description,
      evidence
    );

    // Add to user's report history
    setSecurityProfile(prev => prev ? {
      ...prev,
      reportHistory: [...prev.reportHistory, report]
    } : null);

    sendLocalNotification(
      'Denúncia Enviada',
      'Sua denúncia foi recebida e será analisada pela equipe de moderação',
      'like'
    );

    return report;
  };

  const blockUser = (userId: string) => {
    if (!securityProfile) return;

    setSecurityProfile(prev => prev ? {
      ...prev,
      blockedUsers: [...prev.blockedUsers, userId]
    } : null);

    sendLocalNotification(
      'Usuário Bloqueado',
      'O usuário foi bloqueado e não poderá mais entrar em contato',
      'like'
    );
  };

  const unblockUser = (userId: string) => {
    if (!securityProfile) return;

    setSecurityProfile(prev => prev ? {
      ...prev,
      blockedUsers: prev.blockedUsers.filter(id => id !== userId)
    } : null);

    sendLocalNotification(
      'Usuário Desbloqueado',
      'O usuário foi desbloqueado e pode entrar em contato novamente',
      'like'
    );
  };

  const requestVerification = async (type: VerificationRequest['type'], documents: any[]) => {
    if (!securityProfile) return null;

    const requirements = SecuritySystem.generateVerificationRequirements(type);
    
    const request: VerificationRequest = {
      id: Date.now().toString(),
      userId: securityProfile.userId,
      type,
      status: 'pending',
      documents,
      submittedAt: Date.now(),
      requirements
    };

    setVerificationRequests(prev => [...prev, request]);

    sendLocalNotification(
      'Verificação Solicitada',
      `Sua solicitação de verificação ${type} foi enviada para análise`,
      'like'
    );

    return request;
  };

  const validatePassword = (password: string) => {
    return SecuritySystem.validatePasswordStrength(password);
  };

  const filterContent = (content: string) => {
    return SecuritySystem.filterContent(content);
  };

  const checkInteractionPermission = (
    targetUserId: string,
    interactionType: 'message' | 'call' | 'prayer_request' | 'connection'
  ) => {
    if (!securityProfile) return { allowed: false, reason: 'Profile not loaded' };

    // Mock target profile for demo
    const mockTargetProfile: SecurityProfile = {
      userId: targetUserId,
      verificationLevel: 'basic',
      verifications: {
        email: true,
        phone: true,
        identity: false,
        church: false,
        pastor: false,
        community: false,
        background: false
      },
      trustScore: 60,
      safetyRating: 'medium',
      reportHistory: [],
      blockedUsers: [],
      privacySettings: {
        profileVisibility: 'members_only',
        locationSharing: 'city_only',
        churchInfoVisible: true,
        denominationVisible: true,
        contactInfoVisible: 'verified_only',
        prayerRequestsVisible: 'community_only',
        testimonySharing: true,
        photoAccess: 'verified_only',
        messageFiltering: 'basic',
        blockUnverified: false,
        requireVerificationForContact: false
      },
      securitySettings: {
        twoFactorAuth: false,
        loginNotifications: true,
        deviceTracking: false,
        suspiciousActivityAlerts: true,
        passwordStrength: 'medium',
        sessionTimeout: 60,
        biometricAuth: false,
        encryptedMessages: false,
        autoLogout: false,
        secureMode: false,
        spiritualAccountability: false,
        communityModeration: true
      },
      lastSecurityCheck: Date.now(),
      riskFactors: [],
      blessings: []
    };

    return SecuritySystem.shouldAllowInteraction(
      securityProfile,
      mockTargetProfile,
      interactionType
    );
  };

  const getSecurityRecommendations = () => {
    if (!securityProfile) return { priority: 'low' as const, recommendations: [] };
    return SecuritySystem.getSecurityRecommendations(securityProfile);
  };

  const addSecurityBlessing = (
    type: SecurityBlessing['type'],
    grantedBy: string,
    description: string,
    verse?: string
  ) => {
    if (!securityProfile) return;

    const blessing = SecuritySystem.createSecurityBlessing(type, grantedBy, description, verse);
    
    setSecurityProfile(prev => prev ? {
      ...prev,
      blessings: [...prev.blessings, blessing]
    } : null);

    sendLocalNotification(
      'Nova Bênção Recebida! ✨',
      `Você recebeu uma bênção: ${description}`,
      'like'
    );
  };

  const performSecurityCheck = async () => {
    if (!securityProfile) return;

    // Simulate security check
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Update last security check
    setSecurityProfile(prev => prev ? {
      ...prev,
      lastSecurityCheck: Date.now()
    } : null);

    // Check for new alerts
    const newAlerts = SecuritySystem.detectSuspiciousActivity(
      securityProfile.userId,
      {
        type: 'security_check',
        timestamp: Date.now()
      }
    );

    if (newAlerts.length > 0) {
      setSecurityAlerts(prev => [...newAlerts, ...prev]);
    }

    sendLocalNotification(
      'Verificação de Segurança Concluída',
      'Sua conta foi verificada e está segura',
      'like'
    );
  };

  const enableSecureMode = () => {
    setIsSecureMode(true);
    updateSecuritySettings({ secureMode: true });
    
    sendLocalNotification(
      'Modo Seguro Ativado',
      'Proteção adicional ativada para sua conta',
      'like'
    );
  };

  const disableSecureMode = () => {
    setIsSecureMode(false);
    updateSecuritySettings({ secureMode: false });
  };

  const clearSecurityAlerts = () => {
    setSecurityAlerts([]);
  };

  const resolveSecurityAlert = (alertId: string) => {
    setSecurityAlerts(prev => prev.map(alert => 
      alert.id === alertId ? { ...alert, resolved: true } : alert
    ));
  };

  const getVerificationBadge = () => {
    if (!securityProfile) return null;
    return SecuritySystem.getVerificationBadge(securityProfile.verificationLevel);
  };

  const isUserBlocked = (userId: string): boolean => {
    return securityProfile?.blockedUsers.includes(userId) || false;
  };

  const getTrustScore = (): number => {
    return securityProfile?.trustScore || 0;
  };

  const getSafetyRating = (): SecurityProfile['safetyRating'] => {
    return securityProfile?.safetyRating || 'low';
  };

  const getVerificationLevel = (): SecurityProfile['verificationLevel'] => {
    return securityProfile?.verificationLevel || 'unverified';
  };

  return {
    // State
    securityProfile,
    securityAlerts,
    verificationRequests,
    isSecureMode,
    biometricAvailable,
    encryptionEnabled,

    // Settings
    updatePrivacySettings,
    updateSecuritySettings,

    // Authentication
    enableTwoFactorAuth,
    enableBiometricAuth,
    validatePassword,

    // User Safety
    reportUser,
    blockUser,
    unblockUser,
    checkInteractionPermission,

    // Verification
    requestVerification,
    getVerificationBadge,

    // Content Safety
    filterContent,

    // Security Management
    performSecurityCheck,
    enableSecureMode,
    disableSecureMode,
    getSecurityRecommendations,

    // Alerts
    clearSecurityAlerts,
    resolveSecurityAlert,

    // Blessings
    addSecurityBlessing,

    // Utility
    isUserBlocked,
    getTrustScore,
    getSafetyRating,
    getVerificationLevel
  };
}