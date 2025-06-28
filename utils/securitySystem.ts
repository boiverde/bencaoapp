export interface SecurityProfile {
  userId: string;
  verificationLevel: 'unverified' | 'basic' | 'enhanced' | 'premium' | 'blessed';
  verifications: {
    email: boolean;
    phone: boolean;
    identity: boolean;
    church: boolean;
    pastor: boolean;
    community: boolean;
    background: boolean;
  };
  trustScore: number;
  safetyRating: 'low' | 'medium' | 'high' | 'excellent';
  reportHistory: SecurityReport[];
  blockedUsers: string[];
  privacySettings: PrivacySettings;
  securitySettings: SecuritySettings;
  lastSecurityCheck: number;
  riskFactors: RiskFactor[];
  blessings: SecurityBlessing[];
}

export interface SecurityReport {
  id: string;
  reporterId: string;
  reportedUserId: string;
  type: 'inappropriate_content' | 'fake_profile' | 'harassment' | 'spam' | 'scam' | 'false_testimony' | 'doctrinal_concern';
  category: 'behavior' | 'content' | 'identity' | 'spiritual';
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  evidence: ReportEvidence[];
  status: 'pending' | 'investigating' | 'resolved' | 'dismissed';
  createdAt: number;
  resolvedAt?: number;
  moderatorNotes?: string;
  action?: SecurityAction;
}

export interface ReportEvidence {
  type: 'screenshot' | 'message' | 'profile' | 'witness' | 'document';
  content: string;
  timestamp: number;
  verified: boolean;
}

export interface SecurityAction {
  type: 'warning' | 'temporary_restriction' | 'permanent_ban' | 'profile_review' | 'spiritual_guidance';
  duration?: number;
  restrictions: string[];
  reason: string;
  appealable: boolean;
  spiritualSupport?: boolean;
}

export interface PrivacySettings {
  profileVisibility: 'public' | 'members_only' | 'connections_only' | 'private';
  locationSharing: 'precise' | 'city_only' | 'state_only' | 'hidden';
  churchInfoVisible: boolean;
  denominationVisible: boolean;
  contactInfoVisible: 'all' | 'verified_only' | 'connections_only' | 'hidden';
  prayerRequestsVisible: 'public' | 'community_only' | 'private';
  testimonySharing: boolean;
  photoAccess: 'public' | 'verified_only' | 'connections_only' | 'private';
  messageFiltering: 'none' | 'basic' | 'strict' | 'blessed_only';
  blockUnverified: boolean;
  requireVerificationForContact: boolean;
}

export interface SecuritySettings {
  twoFactorAuth: boolean;
  loginNotifications: boolean;
  deviceTracking: boolean;
  suspiciousActivityAlerts: boolean;
  passwordStrength: 'weak' | 'medium' | 'strong' | 'excellent';
  sessionTimeout: number;
  biometricAuth: boolean;
  encryptedMessages: boolean;
  autoLogout: boolean;
  secureMode: boolean;
  spiritualAccountability: boolean;
  communityModeration: boolean;
}

export interface RiskFactor {
  type: 'new_account' | 'unverified_info' | 'suspicious_activity' | 'multiple_reports' | 'fake_profile_indicators';
  severity: 'low' | 'medium' | 'high';
  description: string;
  detectedAt: number;
  resolved: boolean;
}

export interface SecurityBlessing {
  id: string;
  type: 'verified_believer' | 'trusted_member' | 'community_leader' | 'spiritual_mentor' | 'blessed_connection';
  grantedBy: string;
  grantedAt: number;
  description: string;
  verse?: string;
  expires?: number;
}

export interface VerificationRequest {
  id: string;
  userId: string;
  type: 'identity' | 'church' | 'pastor' | 'community';
  status: 'pending' | 'approved' | 'rejected' | 'needs_review';
  documents: VerificationDocument[];
  submittedAt: number;
  reviewedAt?: number;
  reviewedBy?: string;
  notes?: string;
  requirements: VerificationRequirement[];
}

export interface VerificationDocument {
  id: string;
  type: 'id_card' | 'passport' | 'church_letter' | 'pastor_reference' | 'baptism_certificate' | 'membership_proof';
  url: string;
  verified: boolean;
  uploadedAt: number;
  expiresAt?: number;
}

export interface VerificationRequirement {
  type: string;
  description: string;
  required: boolean;
  completed: boolean;
  evidence?: string;
}

export interface SecurityAlert {
  id: string;
  userId: string;
  type: 'login_attempt' | 'password_change' | 'profile_access' | 'suspicious_activity' | 'security_breach';
  severity: 'info' | 'warning' | 'critical';
  message: string;
  timestamp: number;
  location?: string;
  device?: string;
  resolved: boolean;
  action?: string;
}

export interface ContentFilter {
  id: string;
  type: 'profanity' | 'inappropriate' | 'spam' | 'scam' | 'false_doctrine' | 'harmful_content';
  patterns: string[];
  severity: 'low' | 'medium' | 'high';
  action: 'warn' | 'filter' | 'block' | 'report';
  spiritualGuidance?: string;
}

export class SecuritySystem {
  private static readonly VERIFICATION_LEVELS = {
    unverified: {
      level: 0,
      name: 'Não Verificado',
      color: '#E74C3C',
      icon: 'alert-circle',
      description: 'Perfil não verificado',
      restrictions: ['limited_messaging', 'no_prayer_circles', 'profile_warning']
    },
    basic: {
      level: 1,
      name: 'Verificação Básica',
      color: '#F39C12',
      icon: 'check-circle',
      description: 'Email e telefone verificados',
      restrictions: ['limited_group_access']
    },
    enhanced: {
      level: 2,
      name: 'Verificação Aprimorada',
      color: '#3498DB',
      icon: 'shield-check',
      description: 'Identidade e igreja verificadas',
      restrictions: []
    },
    premium: {
      level: 3,
      name: 'Membro Confiável',
      color: '#9B59B6',
      icon: 'award',
      description: 'Verificação completa com referências',
      restrictions: []
    },
    blessed: {
      level: 4,
      name: 'Membro Abençoado',
      color: '#E6C78C',
      icon: 'star',
      description: 'Verificado pela comunidade cristã',
      restrictions: []
    }
  };

  private static readonly CONTENT_FILTERS: ContentFilter[] = [
    {
      id: 'profanity_filter',
      type: 'profanity',
      patterns: ['palavrão1', 'palavrão2', 'ofensa1'],
      severity: 'medium',
      action: 'filter',
      spiritualGuidance: 'Lembre-se: "Não saia da vossa boca nenhuma palavra torpe" - Efésios 4:29'
    },
    {
      id: 'scam_filter',
      type: 'scam',
      patterns: ['dinheiro fácil', 'investimento garantido', 'milagre financeiro'],
      severity: 'high',
      action: 'block',
      spiritualGuidance: 'Cuidado com falsas promessas. "O amor ao dinheiro é raiz de todos os males" - 1 Timóteo 6:10'
    },
    {
      id: 'false_doctrine_filter',
      type: 'false_doctrine',
      patterns: ['prosperidade garantida', 'salvação por obras'],
      severity: 'high',
      action: 'report',
      spiritualGuidance: 'Examine tudo à luz das Escrituras. "Examinai tudo. Retende o bem" - 1 Tessalonicenses 5:21'
    }
  ];

  private static readonly TRUST_SCORE_FACTORS = {
    email_verified: 10,
    phone_verified: 15,
    identity_verified: 25,
    church_verified: 20,
    pastor_reference: 30,
    community_endorsement: 20,
    clean_history: 15,
    active_participation: 10,
    spiritual_maturity: 25,
    consistent_behavior: 15
  };

  static calculateTrustScore(profile: SecurityProfile): number {
    let score = 0;
    
    // Verification bonuses
    if (profile.verifications.email) score += this.TRUST_SCORE_FACTORS.email_verified;
    if (profile.verifications.phone) score += this.TRUST_SCORE_FACTORS.phone_verified;
    if (profile.verifications.identity) score += this.TRUST_SCORE_FACTORS.identity_verified;
    if (profile.verifications.church) score += this.TRUST_SCORE_FACTORS.church_verified;
    if (profile.verifications.pastor) score += this.TRUST_SCORE_FACTORS.pastor_reference;
    if (profile.verifications.community) score += this.TRUST_SCORE_FACTORS.community_endorsement;
    
    // History penalties
    const recentReports = profile.reportHistory.filter(
      report => Date.now() - report.createdAt < 30 * 24 * 60 * 60 * 1000
    );
    score -= recentReports.length * 10;
    
    // Risk factor penalties
    profile.riskFactors.forEach(factor => {
      switch (factor.severity) {
        case 'low': score -= 5; break;
        case 'medium': score -= 15; break;
        case 'high': score -= 30; break;
      }
    });
    
    // Blessing bonuses
    profile.blessings.forEach(blessing => {
      switch (blessing.type) {
        case 'verified_believer': score += 15; break;
        case 'trusted_member': score += 20; break;
        case 'community_leader': score += 30; break;
        case 'spiritual_mentor': score += 35; break;
        case 'blessed_connection': score += 10; break;
      }
    });
    
    return Math.max(0, Math.min(100, score));
  }

  static getSafetyRating(trustScore: number): SecurityProfile['safetyRating'] {
    if (trustScore >= 80) return 'excellent';
    if (trustScore >= 60) return 'high';
    if (trustScore >= 40) return 'medium';
    return 'low';
  }

  static getVerificationLevel(verifications: SecurityProfile['verifications']): SecurityProfile['verificationLevel'] {
    if (verifications.pastor && verifications.community && verifications.background) {
      return 'blessed';
    }
    if (verifications.identity && verifications.church && verifications.phone && verifications.email) {
      return 'premium';
    }
    if (verifications.identity && verifications.church) {
      return 'enhanced';
    }
    if (verifications.email && verifications.phone) {
      return 'basic';
    }
    return 'unverified';
  }

  static createSecurityReport(
    reporterId: string,
    reportedUserId: string,
    type: SecurityReport['type'],
    description: string,
    evidence: ReportEvidence[] = []
  ): SecurityReport {
    return {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      reporterId,
      reportedUserId,
      type,
      category: this.getReportCategory(type),
      severity: this.getReportSeverity(type),
      description,
      evidence,
      status: 'pending',
      createdAt: Date.now()
    };
  }

  private static getReportCategory(type: SecurityReport['type']): SecurityReport['category'] {
    const categoryMap = {
      inappropriate_content: 'content',
      fake_profile: 'identity',
      harassment: 'behavior',
      spam: 'content',
      scam: 'behavior',
      false_testimony: 'spiritual',
      doctrinal_concern: 'spiritual'
    };
    return categoryMap[type] || 'behavior';
  }

  private static getReportSeverity(type: SecurityReport['type']): SecurityReport['severity'] {
    const severityMap = {
      inappropriate_content: 'medium',
      fake_profile: 'high',
      harassment: 'high',
      spam: 'low',
      scam: 'critical',
      false_testimony: 'medium',
      doctrinal_concern: 'medium'
    };
    return severityMap[type] || 'medium';
  }

  static filterContent(content: string): {
    filtered: string;
    flagged: boolean;
    filters: ContentFilter[];
    guidance?: string;
  } {
    let filtered = content;
    let flagged = false;
    const triggeredFilters: ContentFilter[] = [];
    let guidance: string | undefined;

    this.CONTENT_FILTERS.forEach(filter => {
      filter.patterns.forEach(pattern => {
        if (content.toLowerCase().includes(pattern.toLowerCase())) {
          flagged = true;
          triggeredFilters.push(filter);
          
          if (filter.action === 'filter') {
            filtered = filtered.replace(new RegExp(pattern, 'gi'), '***');
          }
          
          if (filter.spiritualGuidance && !guidance) {
            guidance = filter.spiritualGuidance;
          }
        }
      });
    });

    return { filtered, flagged, filters: triggeredFilters, guidance };
  }

  static validatePasswordStrength(password: string): {
    strength: SecuritySettings['passwordStrength'];
    score: number;
    suggestions: string[];
  } {
    let score = 0;
    const suggestions: string[] = [];

    // Length check
    if (password.length >= 12) score += 25;
    else if (password.length >= 8) score += 15;
    else suggestions.push('Use pelo menos 8 caracteres');

    // Character variety
    if (/[a-z]/.test(password)) score += 10;
    else suggestions.push('Inclua letras minúsculas');

    if (/[A-Z]/.test(password)) score += 10;
    else suggestions.push('Inclua letras maiúsculas');

    if (/[0-9]/.test(password)) score += 10;
    else suggestions.push('Inclua números');

    if (/[^a-zA-Z0-9]/.test(password)) score += 15;
    else suggestions.push('Inclua símbolos especiais');

    // Common patterns
    if (!/(.)\1{2,}/.test(password)) score += 10;
    else suggestions.push('Evite repetir caracteres');

    if (!/123|abc|qwe|password|admin/i.test(password)) score += 10;
    else suggestions.push('Evite sequências comuns');

    // Spiritual bonus
    if (/jesus|cristo|deus|faith|prayer/i.test(password)) score += 10;

    let strength: SecuritySettings['passwordStrength'];
    if (score >= 80) strength = 'excellent';
    else if (score >= 60) strength = 'strong';
    else if (score >= 40) strength = 'medium';
    else strength = 'weak';

    return { strength, score, suggestions };
  }

  static detectSuspiciousActivity(
    userId: string,
    activity: {
      type: string;
      timestamp: number;
      location?: string;
      device?: string;
      metadata?: any;
    }
  ): SecurityAlert[] {
    const alerts: SecurityAlert[] = [];

    // Multiple login attempts
    if (activity.type === 'login_attempt' && activity.metadata?.failed) {
      alerts.push({
        id: Date.now().toString(),
        userId,
        type: 'login_attempt',
        severity: 'warning',
        message: 'Múltiplas tentativas de login falharam',
        timestamp: activity.timestamp,
        location: activity.location,
        device: activity.device,
        resolved: false
      });
    }

    // Unusual location
    if (activity.location && activity.metadata?.unusualLocation) {
      alerts.push({
        id: Date.now().toString(),
        userId,
        type: 'suspicious_activity',
        severity: 'warning',
        message: 'Login de localização incomum detectado',
        timestamp: activity.timestamp,
        location: activity.location,
        device: activity.device,
        resolved: false
      });
    }

    return alerts;
  }

  static generateVerificationRequirements(type: VerificationRequest['type']): VerificationRequirement[] {
    const requirements: { [key: string]: VerificationRequirement[] } = {
      identity: [
        {
          type: 'government_id',
          description: 'Documento de identidade oficial com foto',
          required: true,
          completed: false
        },
        {
          type: 'selfie_verification',
          description: 'Selfie segurando o documento',
          required: true,
          completed: false
        }
      ],
      church: [
        {
          type: 'membership_letter',
          description: 'Carta de membro da igreja',
          required: true,
          completed: false
        },
        {
          type: 'pastor_contact',
          description: 'Contato do pastor para verificação',
          required: true,
          completed: false
        },
        {
          type: 'attendance_proof',
          description: 'Comprovante de frequência (opcional)',
          required: false,
          completed: false
        }
      ],
      pastor: [
        {
          type: 'ordination_certificate',
          description: 'Certificado de ordenação',
          required: true,
          completed: false
        },
        {
          type: 'church_authorization',
          description: 'Autorização da igreja',
          required: true,
          completed: false
        },
        {
          type: 'denomination_verification',
          description: 'Verificação da denominação',
          required: true,
          completed: false
        }
      ],
      community: [
        {
          type: 'community_references',
          description: 'Três referências de membros verificados',
          required: true,
          completed: false
        },
        {
          type: 'testimony_verification',
          description: 'Testemunho de conversão verificado',
          required: false,
          completed: false
        }
      ]
    };

    return requirements[type] || [];
  }

  static createSecurityBlessing(
    type: SecurityBlessing['type'],
    grantedBy: string,
    description: string,
    verse?: string
  ): SecurityBlessing {
    return {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      type,
      grantedBy,
      grantedAt: Date.now(),
      description,
      verse
    };
  }

  static getSecurityRecommendations(profile: SecurityProfile): {
    priority: 'low' | 'medium' | 'high' | 'critical';
    recommendations: string[];
    spiritualGuidance?: string;
  } {
    const recommendations: string[] = [];
    let priority: 'low' | 'medium' | 'high' | 'critical' = 'low';

    // Verification recommendations
    if (!profile.verifications.email) {
      recommendations.push('Verifique seu email para maior segurança');
      priority = 'medium';
    }

    if (!profile.verifications.phone) {
      recommendations.push('Adicione verificação por telefone');
      priority = 'medium';
    }

    if (!profile.verifications.church) {
      recommendations.push('Verifique sua igreja para construir confiança na comunidade');
      priority = 'medium';
    }

    // Security settings
    if (!profile.securitySettings.twoFactorAuth) {
      recommendations.push('Ative a autenticação de dois fatores');
      priority = 'high';
    }

    if (profile.securitySettings.passwordStrength === 'weak') {
      recommendations.push('Fortaleça sua senha');
      priority = 'critical';
    }

    // Risk factors
    if (profile.riskFactors.length > 0) {
      recommendations.push('Resolva os fatores de risco identificados');
      priority = 'high';
    }

    // Trust score
    if (profile.trustScore < 50) {
      recommendations.push('Melhore seu perfil de confiança completando verificações');
      priority = 'high';
    }

    const spiritualGuidance = priority === 'critical' 
      ? 'A segurança é importante para proteger a comunidade. "Sede prudentes como as serpentes e simples como as pombas" - Mateus 10:16'
      : undefined;

    return { priority, recommendations, spiritualGuidance };
  }

  static shouldAllowInteraction(
    userProfile: SecurityProfile,
    targetProfile: SecurityProfile,
    interactionType: 'message' | 'call' | 'prayer_request' | 'connection'
  ): {
    allowed: boolean;
    reason?: string;
    requirements?: string[];
  } {
    const requirements: string[] = [];

    // Check if user is blocked
    if (targetProfile.blockedUsers.includes(userProfile.userId)) {
      return {
        allowed: false,
        reason: 'Você foi bloqueado por este usuário'
      };
    }

    // Check privacy settings
    if (targetProfile.privacySettings.blockUnverified && userProfile.verificationLevel === 'unverified') {
      return {
        allowed: false,
        reason: 'Este usuário só aceita contato de perfis verificados',
        requirements: ['Verifique seu perfil para entrar em contato']
      };
    }

    // Message filtering
    if (interactionType === 'message') {
      switch (targetProfile.privacySettings.messageFiltering) {
        case 'blessed_only':
          if (userProfile.verificationLevel !== 'blessed') {
            requirements.push('Seja um membro abençoado da comunidade');
          }
          break;
        case 'strict':
          if (userProfile.trustScore < 70) {
            requirements.push('Melhore seu score de confiança');
          }
          break;
      }
    }

    // Prayer request access
    if (interactionType === 'prayer_request') {
      if (targetProfile.privacySettings.prayerRequestsVisible === 'private') {
        return {
          allowed: false,
          reason: 'Pedidos de oração são privados'
        };
      }
    }

    return {
      allowed: requirements.length === 0,
      requirements: requirements.length > 0 ? requirements : undefined
    };
  }

  static getVerificationBadge(level: SecurityProfile['verificationLevel']): {
    name: string;
    color: string;
    icon: string;
    description: string;
  } {
    return this.VERIFICATION_LEVELS[level];
  }

  static generateSecurityHash(data: string): string {
    // Simple hash function for demo purposes
    // In production, use proper cryptographic hashing
    let hash = 0;
    for (let i = 0; i < data.length; i++) {
      const char = data.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash).toString(36);
  }

  static encryptSensitiveData(data: string, key: string): string {
    // Simple encryption for demo purposes
    // In production, use proper encryption libraries
    let encrypted = '';
    for (let i = 0; i < data.length; i++) {
      encrypted += String.fromCharCode(
        data.charCodeAt(i) ^ key.charCodeAt(i % key.length)
      );
    }
    return btoa(encrypted);
  }

  static decryptSensitiveData(encryptedData: string, key: string): string {
    // Simple decryption for demo purposes
    const encrypted = atob(encryptedData);
    let decrypted = '';
    for (let i = 0; i < encrypted.length; i++) {
      decrypted += String.fromCharCode(
        encrypted.charCodeAt(i) ^ key.charCodeAt(i % key.length)
      );
    }
    return decrypted;
  }
}