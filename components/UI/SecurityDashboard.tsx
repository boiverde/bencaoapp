import { useState } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Shield, ShieldCheck, TriangleAlert as AlertTriangle, Lock, Eye, Settings, Award, TrendingUp, CircleCheck as CheckCircle, Circle as XCircle, Star, Users, Bell, Smartphone } from 'lucide-react-native';
import Theme from '@/constants/Theme';
import { useSecurity } from '@/hooks/useSecurity';
import SecurityScoreCard from './SecurityScoreCard';
import VerificationStatusCard from './VerificationStatusCard';
import PrivacySettingsCard from './PrivacySettingsCard';
import SecurityAlertsCard from './SecurityAlertsCard';

interface SecurityDashboardProps {
  onNavigateToSettings?: () => void;
  onNavigateToVerification?: () => void;
  onNavigateToReports?: () => void;
}

export default function SecurityDashboard({
  onNavigateToSettings,
  onNavigateToVerification,
  onNavigateToReports
}: SecurityDashboardProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'privacy' | 'alerts' | 'verification'>('overview');
  
  const {
    securityProfile,
    securityAlerts,
    isSecureMode,
    getTrustScore,
    getSafetyRating,
    getVerificationLevel,
    getSecurityRecommendations,
    performSecurityCheck
  } = useSecurity();

  if (!securityProfile) {
    return (
      <View style={styles.loadingContainer}>
        <Shield size={48} color={Theme.colors.text.light} />
        <Text style={styles.loadingText}>Carregando perfil de segurança...</Text>
      </View>
    );
  }

  const trustScore = getTrustScore();
  const safetyRating = getSafetyRating();
  const verificationLevel = getVerificationLevel();
  const recommendations = getSecurityRecommendations();
  const unreadAlerts = securityAlerts.filter(alert => !alert.resolved).length;

  const getSecurityColor = () => {
    if (trustScore >= 80) return Theme.colors.status.success;
    if (trustScore >= 60) return Theme.colors.status.warning;
    return Theme.colors.status.error;
  };

  const renderOverviewTab = () => (
    <ScrollView style={styles.tabContent} showsVerticalScrollIndicator={false}>
      <SecurityScoreCard
        trustScore={trustScore}
        safetyRating={safetyRating}
        verificationLevel={verificationLevel}
        onImprove={() => setActiveTab('verification')}
      />

      <View style={styles.quickStatsGrid}>
        <View style={styles.quickStatCard}>
          <ShieldCheck size={24} color={Theme.colors.status.success} />
          <Text style={styles.quickStatNumber}>
            {Object.values(securityProfile.verifications).filter(Boolean).length}
          </Text>
          <Text style={styles.quickStatLabel}>Verificações</Text>
        </View>
        
        <View style={styles.quickStatCard}>
          <Award size={24} color={Theme.colors.primary.gold} />
          <Text style={styles.quickStatNumber}>{securityProfile.blessings.length}</Text>
          <Text style={styles.quickStatLabel}>Bênçãos</Text>
        </View>
        
        <View style={styles.quickStatCard}>
          <Users size={24} color={Theme.colors.primary.blue} />
          <Text style={styles.quickStatNumber}>{securityProfile.blockedUsers.length}</Text>
          <Text style={styles.quickStatLabel}>Bloqueados</Text>
        </View>
        
        <View style={styles.quickStatCard}>
          <Bell size={24} color={unreadAlerts > 0 ? Theme.colors.status.error : Theme.colors.text.medium} />
          <Text style={styles.quickStatNumber}>{unreadAlerts}</Text>
          <Text style={styles.quickStatLabel}>Alertas</Text>
        </View>
      </View>

      {recommendations.recommendations.length > 0 && (
        <View style={styles.recommendationsCard}>
          <View style={styles.recommendationsHeader}>
            <TrendingUp size={20} color={getSecurityColor()} />
            <Text style={styles.recommendationsTitle}>Recomendações de Segurança</Text>
          </View>
          {recommendations.recommendations.map((recommendation, index) => (
            <View key={index} style={styles.recommendationItem}>
              <View style={[styles.priorityDot, { backgroundColor: getSecurityColor() }]} />
              <Text style={styles.recommendationText}>{recommendation}</Text>
            </View>
          ))}
          {recommendations.spiritualGuidance && (
            <View style={styles.spiritualGuidanceContainer}>
              <Text style={styles.spiritualGuidance}>{recommendations.spiritualGuidance}</Text>
            </View>
          )}
        </View>
      )}

      <View style={styles.securityFeaturesGrid}>
        <TouchableOpacity style={styles.featureCard} onPress={onNavigateToSettings}>
          <Settings size={24} color={Theme.colors.primary.blue} />
          <Text style={styles.featureTitle}>Configurações</Text>
          <Text style={styles.featureDescription}>Gerencie suas configurações de segurança</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.featureCard} onPress={onNavigateToVerification}>
          <Award size={24} color={Theme.colors.primary.gold} />
          <Text style={styles.featureTitle}>Verificação</Text>
          <Text style={styles.featureDescription}>Complete suas verificações</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.featureCard} onPress={onNavigateToReports}>
          <Shield size={24} color={Theme.colors.status.error} />
          <Text style={styles.featureTitle}>Denúncias</Text>
          <Text style={styles.featureDescription}>Reporte comportamentos inadequados</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.featureCard} onPress={performSecurityCheck}>
          <CheckCircle size={24} color={Theme.colors.status.success} />
          <Text style={styles.featureTitle}>Verificação</Text>
          <Text style={styles.featureDescription}>Execute verificação de segurança</Text>
        </TouchableOpacity>
      </View>

      {securityProfile.blessings.length > 0 && (
        <View style={styles.blessingsSection}>
          <Text style={styles.sectionTitle}>Suas Bênçãos de Segurança</Text>
          {securityProfile.blessings.map((blessing, index) => (
            <View key={blessing.id} style={styles.blessingCard}>
              <Star size={20} color={Theme.colors.primary.gold} />
              <View style={styles.blessingInfo}>
                <Text style={styles.blessingTitle}>{blessing.description}</Text>
                <Text style={styles.blessingDate}>
                  {new Date(blessing.grantedAt).toLocaleDateString()}
                </Text>
                {blessing.verse && (
                  <Text style={styles.blessingVerse}>"{blessing.verse}"</Text>
                )}
              </View>
            </View>
          ))}
        </View>
      )}
    </ScrollView>
  );

  const renderPrivacyTab = () => (
    <ScrollView style={styles.tabContent} showsVerticalScrollIndicator={false}>
      <PrivacySettingsCard profile={securityProfile} />
    </ScrollView>
  );

  const renderAlertsTab = () => (
    <ScrollView style={styles.tabContent} showsVerticalScrollIndicator={false}>
      <SecurityAlertsCard alerts={securityAlerts} />
    </ScrollView>
  );

  const renderVerificationTab = () => (
    <ScrollView style={styles.tabContent} showsVerticalScrollIndicator={false}>
      <VerificationStatusCard profile={securityProfile} />
    </ScrollView>
  );

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[getSecurityColor() + '20', getSecurityColor() + '10']}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <View style={styles.headerLeft}>
            <View style={[styles.securityIcon, { backgroundColor: getSecurityColor() }]}>
              {isSecureMode ? (
                <ShieldCheck size={24} color={Theme.colors.background.white} />
              ) : (
                <Shield size={24} color={Theme.colors.background.white} />
              )}
            </View>
            <View>
              <Text style={styles.headerTitle}>Segurança</Text>
              <Text style={styles.headerSubtitle}>
                {isSecureMode ? 'Modo Seguro Ativo' : 'Proteção Padrão'}
              </Text>
            </View>
          </View>
          
          <View style={styles.trustScoreContainer}>
            <Text style={[styles.trustScore, { color: getSecurityColor() }]}>
              {trustScore}
            </Text>
            <Text style={styles.trustScoreLabel}>Score</Text>
          </View>
        </View>
      </LinearGradient>

      <View style={styles.tabsContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'overview' && styles.activeTab]}
          onPress={() => setActiveTab('overview')}
        >
          <Text style={[styles.tabText, activeTab === 'overview' && styles.activeTabText]}>
            Visão Geral
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.tab, activeTab === 'privacy' && styles.activeTab]}
          onPress={() => setActiveTab('privacy')}
        >
          <Text style={[styles.tabText, activeTab === 'privacy' && styles.activeTabText]}>
            Privacidade
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.tab, activeTab === 'alerts' && styles.activeTab]}
          onPress={() => setActiveTab('alerts')}
        >
          <View style={styles.tabWithBadge}>
            <Text style={[styles.tabText, activeTab === 'alerts' && styles.activeTabText]}>
              Alertas
            </Text>
            {unreadAlerts > 0 && (
              <View style={styles.alertBadge}>
                <Text style={styles.alertBadgeText}>{unreadAlerts}</Text>
              </View>
            )}
          </View>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.tab, activeTab === 'verification' && styles.activeTab]}
          onPress={() => setActiveTab('verification')}
        >
          <Text style={[styles.tabText, activeTab === 'verification' && styles.activeTabText]}>
            Verificação
          </Text>
        </TouchableOpacity>
      </View>

      {activeTab === 'overview' && renderOverviewTab()}
      {activeTab === 'privacy' && renderPrivacyTab()}
      {activeTab === 'alerts' && renderAlertsTab()}
      {activeTab === 'verification' && renderVerificationTab()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.colors.background.light,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Theme.spacing.xl,
  },
  loadingText: {
    fontFamily: Theme.typography.fontFamily.body,
    fontSize: Theme.typography.fontSize.md,
    color: Theme.colors.text.medium,
    marginTop: Theme.spacing.md,
  },
  header: {
    paddingHorizontal: Theme.spacing.md,
    paddingVertical: Theme.spacing.lg,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  securityIcon: {
    width: 48,
    height: 48,
    borderRadius: Theme.borderRadius.circle,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Theme.spacing.md,
  },
  headerTitle: {
    fontFamily: Theme.typography.fontFamily.heading,
    fontSize: Theme.typography.fontSize.xl,
    color: Theme.colors.text.dark,
  },
  headerSubtitle: {
    fontFamily: Theme.typography.fontFamily.body,
    fontSize: Theme.typography.fontSize.sm,
    color: Theme.colors.text.medium,
  },
  trustScoreContainer: {
    alignItems: 'center',
  },
  trustScore: {
    fontFamily: Theme.typography.fontFamily.heading,
    fontSize: Theme.typography.fontSize.xxl,
  },
  trustScoreLabel: {
    fontFamily: Theme.typography.fontFamily.body,
    fontSize: Theme.typography.fontSize.xs,
    color: Theme.colors.text.medium,
  },
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: Theme.colors.background.white,
    borderBottomWidth: 1,
    borderBottomColor: Theme.colors.ui.border,
  },
  tab: {
    flex: 1,
    paddingVertical: Theme.spacing.md,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: Theme.colors.primary.blue,
  },
  tabText: {
    fontFamily: Theme.typography.fontFamily.body,
    fontSize: Theme.typography.fontSize.sm,
    color: Theme.colors.text.medium,
  },
  activeTabText: {
    fontFamily: Theme.typography.fontFamily.subheading,
    color: Theme.colors.primary.blue,
  },
  tabWithBadge: {
    position: 'relative',
    alignItems: 'center',
  },
  alertBadge: {
    position: 'absolute',
    top: -8,
    right: -12,
    backgroundColor: Theme.colors.status.error,
    borderRadius: Theme.borderRadius.circle,
    minWidth: 16,
    height: 16,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  alertBadgeText: {
    fontFamily: Theme.typography.fontFamily.subheading,
    fontSize: 10,
    color: Theme.colors.background.white,
  },
  tabContent: {
    flex: 1,
    padding: Theme.spacing.md,
  },
  quickStatsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: Theme.spacing.lg,
  },
  quickStatCard: {
    width: '48%',
    backgroundColor: Theme.colors.background.white,
    borderRadius: Theme.borderRadius.md,
    padding: Theme.spacing.md,
    alignItems: 'center',
    marginRight: '2%',
    marginBottom: Theme.spacing.sm,
    ...Theme.shadows.small,
  },
  quickStatNumber: {
    fontFamily: Theme.typography.fontFamily.heading,
    fontSize: Theme.typography.fontSize.xl,
    color: Theme.colors.text.dark,
    marginVertical: Theme.spacing.xs,
  },
  quickStatLabel: {
    fontFamily: Theme.typography.fontFamily.body,
    fontSize: Theme.typography.fontSize.sm,
    color: Theme.colors.text.medium,
  },
  recommendationsCard: {
    backgroundColor: Theme.colors.background.white,
    borderRadius: Theme.borderRadius.lg,
    padding: Theme.spacing.md,
    marginBottom: Theme.spacing.lg,
    ...Theme.shadows.small,
  },
  recommendationsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Theme.spacing.md,
  },
  recommendationsTitle: {
    fontFamily: Theme.typography.fontFamily.subheading,
    fontSize: Theme.typography.fontSize.md,
    color: Theme.colors.text.dark,
    marginLeft: Theme.spacing.sm,
  },
  recommendationItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: Theme.spacing.sm,
  },
  priorityDot: {
    width: 6,
    height: 6,
    borderRadius: Theme.borderRadius.circle,
    marginTop: 6,
    marginRight: Theme.spacing.sm,
  },
  recommendationText: {
    flex: 1,
    fontFamily: Theme.typography.fontFamily.body,
    fontSize: Theme.typography.fontSize.sm,
    color: Theme.colors.text.dark,
    lineHeight: 18,
  },
  spiritualGuidanceContainer: {
    backgroundColor: Theme.colors.background.lilac,
    borderRadius: Theme.borderRadius.md,
    padding: Theme.spacing.sm,
    marginTop: Theme.spacing.sm,
  },
  spiritualGuidance: {
    fontFamily: Theme.typography.fontFamily.verse,
    fontSize: Theme.typography.fontSize.sm,
    color: Theme.colors.text.dark,
    lineHeight: 18,
    textAlign: 'center',
  },
  securityFeaturesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: Theme.spacing.lg,
  },
  featureCard: {
    width: '48%',
    backgroundColor: Theme.colors.background.white,
    borderRadius: Theme.borderRadius.md,
    padding: Theme.spacing.md,
    marginRight: '2%',
    marginBottom: Theme.spacing.sm,
    ...Theme.shadows.small,
  },
  featureTitle: {
    fontFamily: Theme.typography.fontFamily.subheading,
    fontSize: Theme.typography.fontSize.md,
    color: Theme.colors.text.dark,
    marginTop: Theme.spacing.sm,
    marginBottom: Theme.spacing.xs,
  },
  featureDescription: {
    fontFamily: Theme.typography.fontFamily.body,
    fontSize: Theme.typography.fontSize.sm,
    color: Theme.colors.text.medium,
    lineHeight: 18,
  },
  blessingsSection: {
    marginBottom: Theme.spacing.lg,
  },
  sectionTitle: {
    fontFamily: Theme.typography.fontFamily.subheading,
    fontSize: Theme.typography.fontSize.lg,
    color: Theme.colors.text.dark,
    marginBottom: Theme.spacing.md,
  },
  blessingCard: {
    flexDirection: 'row',
    backgroundColor: Theme.colors.background.white,
    borderRadius: Theme.borderRadius.md,
    padding: Theme.spacing.md,
    marginBottom: Theme.spacing.sm,
    ...Theme.shadows.small,
  },
  blessingInfo: {
    flex: 1,
    marginLeft: Theme.spacing.sm,
  },
  blessingTitle: {
    fontFamily: Theme.typography.fontFamily.subheading,
    fontSize: Theme.typography.fontSize.sm,
    color: Theme.colors.text.dark,
    marginBottom: Theme.spacing.xs,
  },
  blessingDate: {
    fontFamily: Theme.typography.fontFamily.body,
    fontSize: Theme.typography.fontSize.xs,
    color: Theme.colors.text.medium,
    marginBottom: Theme.spacing.xs,
  },
  blessingVerse: {
    fontFamily: Theme.typography.fontFamily.verse,
    fontSize: Theme.typography.fontSize.sm,
    color: Theme.colors.primary.gold,
    lineHeight: 18,
  },
});