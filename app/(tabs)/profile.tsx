import { useState } from 'react';
import { StyleSheet, View, Text, Image, ScrollView, TouchableOpacity, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Theme from '@/constants/Theme';
import { Settings, Heart, LogOut, CreditCard as Edit, Church, Globe, Book, MapPin, Trophy, Target, Zap, Shield, ChartBar as BarChart2, Lightbulb, MessageSquare, Users, Calendar } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useGamification } from '@/hooks/useGamification';
import { useSecurity } from '@/hooks/useSecurity';
import { useAnalytics } from '@/hooks/useAnalytics';
import { useSocial } from '@/hooks/useSocial';
import { useMonetization } from '@/hooks/useMonetization';
import LevelProgressCard from '@/components/UI/LevelProgressCard';
import AchievementCard from '@/components/UI/AchievementCard';
import ChallengeCard from '@/components/UI/ChallengeCard';
import SecurityDashboard from '@/components/UI/SecurityDashboard';
import AnalyticsDashboard from '@/components/Analytics/AnalyticsDashboard';
import InsightsScreen from '@/components/Analytics/InsightsScreen';
import InsightCard from '@/components/Analytics/InsightCard';
import SocialFeed from '@/components/Social/SocialFeed';
import SocialProfileHeader from '@/components/Social/SocialProfileHeader';
import SocialGroupCard from '@/components/Social/SocialGroupCard';
import SocialEventCard from '@/components/Social/SocialEventCard';
import SubscriptionBanner from '@/components/Monetization/SubscriptionBanner';
import RevenueCatInfo from '@/components/Monetization/RevenueCatInfo';

// Mock user data
const USER = {
  id: '1',
  name: 'Ana Clara',
  age: 27,
  location: 'São Paulo, Brasil',
  denomination: 'Batista',
  church: 'Igreja Batista Central',
  languages: ['Português', 'Inglês', 'Espanhol'],
  verse: 'Mas buscai primeiro o Reino de Deus, e a sua justiça, e todas as coisas vos serão acrescentadas. Mateus 6:33',
  bio: 'Amo música, viagens e servir ao Senhor. Sou professora, gosto de ler e estou em busca de alguém que compartilhe da mesma fé e valores.',
  image: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
  photos: [
    'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    'https://images.pexels.com/photos/1181690/pexels-photo-1181690.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    'https://images.pexels.com/photos/1181673/pexels-photo-1181673.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
  ],
  interests: ['Música', 'Viagens', 'Leitura', 'Ensino', 'Evangelismo', 'Voluntariado'],
};

export default function ProfileScreen() {
  const [activeTab, setActiveTab] = useState<'overview' | 'achievements' | 'challenges' | 'security' | 'analytics' | 'insights' | 'social' | 'subscription'>('overview');
  const [socialSubTab, setSocialSubTab] = useState<'posts' | 'groups' | 'events'>('posts');
  
  const {
    userStats,
    getCurrentLevel,
    getUnlockedAchievements,
    getLockedAchievements,
    activeChallenge,
    dailyChallenge,
    levelProgress
  } = useGamification();

  const {
    getTrustScore,
    getSafetyRating,
    getVerificationLevel,
    getVerificationBadge
  } = useSecurity();

  const {
    insights,
    getUnreadInsightsCount
  } = useAnalytics();

  const {
    socialProfile,
    userPosts,
    getUserGroups,
    getUserEvents
  } = useSocial();
  
  const {
    isSubscribed
  } = useMonetization();

  const currentLevel = getCurrentLevel();
  const unlockedAchievements = getUnlockedAchievements();
  const lockedAchievements = getLockedAchievements();
  const trustScore = getTrustScore();
  const safetyRating = getSafetyRating();
  const verificationLevel = getVerificationLevel();
  const verificationBadge = getVerificationBadge();
  const unreadInsightsCount = getUnreadInsightsCount();
  const userGroups = getUserGroups();
  const userEvents = getUserEvents();
  
  // Get the next level from the useGamification hook
  const nextLevelData = useGamification().getNextLevel(currentLevel.level);
  
  const handleSubscriptionPress = () => {
    setActiveTab('subscription');
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <View>
            <SubscriptionBanner onPress={handleSubscriptionPress} compact />
            
            <LevelProgressCard
              currentLevel={currentLevel}
              nextLevel={nextLevelData}
              progress={levelProgress}
              totalPoints={userStats.totalPoints}
            />
            
            <View style={styles.statsGrid}>
              <View style={styles.statCard}>
                <Trophy size={24} color={Theme.colors.primary.gold} />
                <Text style={styles.statNumber}>{userStats.totalPoints}</Text>
                <Text style={styles.statLabel}>Pontos</Text>
              </View>
              <View style={styles.statCard}>
                <Target size={24} color={Theme.colors.primary.blue} />
                <Text style={styles.statNumber}>{unlockedAchievements.length}</Text>
                <Text style={styles.statLabel}>Conquistas</Text>
              </View>
              <View style={styles.statCard}>
                <Zap size={24} color={Theme.colors.primary.pink} />
                <Text style={styles.statNumber}>{userStats.challengesCompleted}</Text>
                <Text style={styles.statLabel}>Desafios</Text>
              </View>
              <View style={styles.statCard}>
                <Shield size={24} color={verificationBadge?.color || Theme.colors.text.medium} />
                <Text style={styles.statNumber}>{trustScore}</Text>
                <Text style={styles.statLabel}>Segurança</Text>
              </View>
            </View>

            {insights.length > 0 && (
              <View style={styles.insightsPreview}>
                <View style={styles.insightsHeader}>
                  <Text style={styles.sectionTitle}>Insights</Text>
                  {unreadInsightsCount > 0 && (
                    <View style={styles.insightsBadge}>
                      <Text style={styles.insightsBadgeText}>{unreadInsightsCount}</Text>
                    </View>
                  )}
                </View>
                
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  {insights.slice(0, 3).map(insight => (
                    <View key={insight.id} style={styles.insightCardContainer}>
                      <InsightCard
                        insight={insight}
                        compact
                        onPress={() => setActiveTab('insights')}
                      />
                    </View>
                  ))}
                  <TouchableOpacity 
                    style={styles.viewAllInsights}
                    onPress={() => setActiveTab('insights')}
                  >
                    <Lightbulb size={24} color={Theme.colors.primary.gold} />
                    <Text style={styles.viewAllInsightsText}>Ver Todos</Text>
                  </TouchableOpacity>
                </ScrollView>
              </View>
            )}

            <View style={styles.streaksSection}>
              <Text style={styles.sectionTitle}>Sequências Ativas</Text>
              <View style={styles.streaksGrid}>
                <View style={styles.streakCard}>
                  <Text style={styles.streakNumber}>{userStats.streaks.prayer}</Text>
                  <Text style={styles.streakLabel}>Dias de Oração</Text>
                </View>
                <View style={styles.streakCard}>
                  <Text style={styles.streakNumber}>{userStats.streaks.reading}</Text>
                  <Text style={styles.streakLabel}>Dias de Leitura</Text>
                </View>
                <View style={styles.streakCard}>
                  <Text style={styles.streakNumber}>{userStats.streaks.community}</Text>
                  <Text style={styles.streakLabel}>Dias Comunitários</Text>
                </View>
              </View>
            </View>

            {unlockedAchievements.length > 0 && (
              <View style={styles.recentAchievements}>
                <Text style={styles.sectionTitle}>Conquistas Recentes</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  {unlockedAchievements.slice(0, 3).map(achievement => (
                    <AchievementCard
                      key={achievement.id}
                      achievement={achievement}
                      compact
                    />
                  ))}
                </ScrollView>
              </View>
            )}
          </View>
        );

      case 'achievements':
        return (
          <View>
            {unlockedAchievements.length > 0 && (
              <View style={styles.achievementsSection}>
                <Text style={styles.sectionTitle}>Desbloqueadas ({unlockedAchievements.length})</Text>
                {unlockedAchievements.map(achievement => (
                  <AchievementCard
                    key={achievement.id}
                    achievement={achievement}
                  />
                ))}
              </View>
            )}

            {lockedAchievements.length > 0 && (
              <View style={styles.achievementsSection}>
                <Text style={styles.sectionTitle}>Bloqueadas ({lockedAchievements.length})</Text>
                {lockedAchievements.slice(0, 5).map(achievement => (
                  <AchievementCard
                    key={achievement.id}
                    achievement={achievement}
                  />
                ))}
              </View>
            )}
          </View>
        );

      case 'challenges':
        return (
          <View>
            {dailyChallenge && (
              <View style={styles.challengesSection}>
                <Text style={styles.sectionTitle}>Desafio Diário</Text>
                <ChallengeCard challenge={dailyChallenge} />
              </View>
            )}

            {activeChallenge && (
              <View style={styles.challengesSection}>
                <Text style={styles.sectionTitle}>Desafio Ativo</Text>
                <ChallengeCard challenge={activeChallenge} />
              </View>
            )}
          </View>
        );

      case 'security':
        return <SecurityDashboard onBack={() => setActiveTab('overview')} />;

      case 'analytics':
        return <AnalyticsDashboard onBack={() => setActiveTab('overview')} />;

      case 'insights':
        return <InsightsScreen onBack={() => setActiveTab('overview')} />;

      case 'social':
        return (
          <View style={styles.socialContainer}>
            {socialProfile && (
              <SocialProfileHeader 
                profile={socialProfile}
                isCurrentUser={true}
                onEdit={() => {}}
              />
            )}
            
            <View style={styles.socialTabsContainer}>
              <TouchableOpacity 
                style={[styles.socialTab, socialSubTab === 'posts' && styles.activeSocialTab]}
                onPress={() => setSocialSubTab('posts')}
              >
                <MessageSquare 
                  size={20} 
                  color={socialSubTab === 'posts' ? Theme.colors.primary.blue : Theme.colors.text.medium} 
                />
                <Text style={[
                  styles.socialTabText,
                  socialSubTab === 'posts' && styles.activeSocialTabText
                ]}>
                  Publicações
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.socialTab, socialSubTab === 'groups' && styles.activeSocialTab]}
                onPress={() => setSocialSubTab('groups')}
              >
                <Users 
                  size={20} 
                  color={socialSubTab === 'groups' ? Theme.colors.primary.blue : Theme.colors.text.medium} 
                />
                <Text style={[
                  styles.socialTabText,
                  socialSubTab === 'groups' && styles.activeSocialTabText
                ]}>
                  Grupos
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.socialTab, socialSubTab === 'events' && styles.activeSocialTab]}
                onPress={() => setSocialSubTab('events')}
              >
                <Calendar 
                  size={20} 
                  color={socialSubTab === 'events' ? Theme.colors.primary.blue : Theme.colors.text.medium} 
                />
                <Text style={[
                  styles.socialTabText,
                  socialSubTab === 'events' && styles.activeSocialTabText
                ]}>
                  Eventos
                </Text>
              </TouchableOpacity>
            </View>
            
            {socialSubTab === 'posts' && (
              <SocialFeed 
                showCreatePost={true}
                showFilters={false}
              />
            )}
            
            {socialSubTab === 'groups' && (
              <FlatList
                data={userGroups}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                  <SocialGroupCard 
                    group={item}
                    isMember={true}
                  />
                )}
                contentContainerStyle={styles.socialListContent}
                ListEmptyComponent={
                  <View style={styles.emptyContainer}>
                    <Users size={48} color={Theme.colors.text.light} />
                    <Text style={styles.emptyTitle}>Nenhum grupo encontrado</Text>
                    <Text style={styles.emptySubtitle}>
                      Você ainda não participa de nenhum grupo
                    </Text>
                  </View>
                }
              />
            )}
            
            {socialSubTab === 'events' && (
              <FlatList
                data={userEvents}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                  <SocialEventCard 
                    event={item}
                    isAttending={item.attendeeIds.includes('current_user')}
                  />
                )}
                contentContainerStyle={styles.socialListContent}
                ListEmptyComponent={
                  <View style={styles.emptyContainer}>
                    <Calendar size={48} color={Theme.colors.text.light} />
                    <Text style={styles.emptyTitle}>Nenhum evento encontrado</Text>
                    <Text style={styles.emptySubtitle}>
                      Você ainda não está participando de nenhum evento
                    </Text>
                  </View>
                }
              />
            )}
          </View>
        );
        
      case 'subscription':
        return (
          <View style={styles.subscriptionContainer}>
            <Text style={styles.subscriptionTitle}>Assinaturas e Compras</Text>
            
            {isSubscribed() ? (
              <View style={styles.activeSubscriptionContainer}>
                <Text style={styles.activeSubscriptionTitle}>Assinatura Ativa</Text>
                <Text style={styles.activeSubscriptionDetails}>
                  Você tem uma assinatura ativa do Plano Abençoado.
                </Text>
                
                <TouchableOpacity style={styles.manageSubscriptionButton}>
                  <Text style={styles.manageSubscriptionText}>Gerenciar Assinatura</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <SubscriptionBanner onPress={() => {}} />
            )}
            
            <RevenueCatInfo />
          </View>
        );

      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.header}>
          <View style={styles.headerActions}>
            <TouchableOpacity style={styles.iconButton}>
              <Settings size={24} color={Theme.colors.text.dark} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconButton}>
              <LogOut size={24} color={Theme.colors.text.dark} />
            </TouchableOpacity>
          </View>
          
          <View style={styles.profileHeader}>
            <View style={styles.profileImageContainer}>
              <Image source={{ uri: USER.image }} style={styles.profileImage} />
              <TouchableOpacity style={styles.editButton}>
                <Edit size={16} color="#fff" />
              </TouchableOpacity>
              
              {/* Level Badge */}
              <View style={[styles.levelBadge, { backgroundColor: currentLevel.color }]}>
                <Text style={styles.levelBadgeText}>{currentLevel.level}</Text>
              </View>
              
              {/* Verification Badge */}
              {verificationBadge && (
                <View style={[styles.verificationBadge, { backgroundColor: verificationBadge.color }]}>
                  <Shield size={12} color={Theme.colors.background.white} />
                </View>
              )}
            </View>
            
            <Text style={styles.profileName}>{USER.name}, {USER.age}</Text>
            <Text style={styles.profileTitle}>{userStats.currentTitle}</Text>
            
            <View style={styles.locationContainer}>
              <MapPin size={16} color={Theme.colors.text.medium} />
              <Text style={styles.locationText}>{USER.location}</Text>
            </View>
          </View>
        </View>

        {/* Profile Tabs */}
        <View style={styles.tabsContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <TouchableOpacity
              style={[styles.tab, activeTab === 'overview' && styles.activeTab]}
              onPress={() => setActiveTab('overview')}
            >
              <Text style={[styles.tabText, activeTab === 'overview' && styles.activeTabText]}>
                Visão Geral
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tab, activeTab === 'achievements' && styles.activeTab]}
              onPress={() => setActiveTab('achievements')}
            >
              <Text style={[styles.tabText, activeTab === 'achievements' && styles.activeTabText]}>
                Conquistas
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tab, activeTab === 'challenges' && styles.activeTab]}
              onPress={() => setActiveTab('challenges')}
            >
              <Text style={[styles.tabText, activeTab === 'challenges' && styles.activeTabText]}>
                Desafios
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tab, activeTab === 'security' && styles.activeTab]}
              onPress={() => setActiveTab('security')}
            >
              <Text style={[styles.tabText, activeTab === 'security' && styles.activeTabText]}>
                Segurança
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tab, activeTab === 'analytics' && styles.activeTab]}
              onPress={() => setActiveTab('analytics')}
            >
              <Text style={[styles.tabText, activeTab === 'analytics' && styles.activeTabText]}>
                Análises
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tab, activeTab === 'insights' && styles.activeTab]}
              onPress={() => setActiveTab('insights')}
            >
              <View style={styles.tabWithBadge}>
                <Text style={[styles.tabText, activeTab === 'insights' && styles.activeTabText]}>
                  Insights
                </Text>
                {unreadInsightsCount > 0 && (
                  <View style={styles.tabBadge}>
                    <Text style={styles.tabBadgeText}>{unreadInsightsCount}</Text>
                  </View>
                )}
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tab, activeTab === 'social' && styles.activeTab]}
              onPress={() => setActiveTab('social')}
            >
              <Text style={[styles.tabText, activeTab === 'social' && styles.activeTabText]}>
                Social
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tab, activeTab === 'subscription' && styles.activeTab]}
              onPress={() => setActiveTab('subscription')}
            >
              <Text style={[styles.tabText, activeTab === 'subscription' && styles.activeTabText]}>
                Assinatura
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </View>

        {renderTabContent()}

        {/* Original Profile Sections */}
        {['overview', 'achievements', 'challenges'].includes(activeTab) && (
          <>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Informações Religiosas</Text>
              <View style={styles.infoRow}>
                <Church size={18} color={Theme.colors.primary.blue} />
                <View>
                  <Text style={styles.infoLabel}>Denominação</Text>
                  <Text style={styles.infoValue}>{USER.denomination}</Text>
                </View>
              </View>
              <View style={styles.infoRow}>
                <MapPin size={18} color={Theme.colors.primary.blue} />
                <View>
                  <Text style={styles.infoLabel}>Igreja</Text>
                  <Text style={styles.infoValue}>{USER.church}</Text>
                </View>
              </View>
              <View style={styles.infoRow}>
                <Globe size={18} color={Theme.colors.primary.blue} />
                <View>
                  <Text style={styles.infoLabel}>Idiomas</Text>
                  <Text style={styles.infoValue}>{USER.languages.join(', ')}</Text>
                </View>
              </View>
              <View style={styles.verseContainer}>
                <Book size={18} color={Theme.colors.primary.lilac} />
                <Text style={styles.verseText}>"{USER.verse}"</Text>
              </View>
            </View>
            
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Sobre Mim</Text>
              <Text style={styles.bioText}>{USER.bio}</Text>
            </View>
            
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Minhas Fotos</Text>
              <View style={styles.photosGrid}>
                {USER.photos.map((photo, index) => (
                  <View key={index} style={styles.photoContainer}>
                    <Image source={{ uri: photo }} style={styles.photo} />
                  </View>
                ))}
                <TouchableOpacity style={styles.addPhotoButton}>
                  <Text style={styles.addPhotoText}>+</Text>
                </TouchableOpacity>
              </View>
            </View>
            
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Interesses</Text>
              <View style={styles.interestsContainer}>
                {USER.interests.map((interest, index) => (
                  <View key={index} style={styles.interestTag}>
                    <Text style={styles.interestText}>{interest}</Text>
                  </View>
                ))}
              </View>
            </View>
            
            <TouchableOpacity style={styles.editProfileButton}>
              <Text style={styles.editProfileText}>Editar Perfil</Text>
            </TouchableOpacity>
          </>
        )}
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
    backgroundColor: Theme.colors.background.white,
    borderBottomLeftRadius: Theme.borderRadius.lg,
    borderBottomRightRadius: Theme.borderRadius.lg,
    paddingBottom: Theme.spacing.lg,
    marginBottom: Theme.spacing.lg,
    ...Theme.shadows.small,
  },
  headerActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: Theme.spacing.md,
    paddingVertical: Theme.spacing.md,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: Theme.borderRadius.circle,
    backgroundColor: Theme.colors.background.light,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileHeader: {
    alignItems: 'center',
    marginVertical: Theme.spacing.md,
  },
  profileImageContainer: {
    width: 100,
    height: 100,
    borderRadius: Theme.borderRadius.circle,
    marginBottom: Theme.spacing.md,
    position: 'relative',
  },
  profileImage: {
    width: '100%',
    height: '100%',
    borderRadius: Theme.borderRadius.circle,
    borderWidth: 3,
    borderColor: Theme.colors.primary.pink,
  },
  editButton: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    width: 32,
    height: 32,
    borderRadius: Theme.borderRadius.circle,
    backgroundColor: Theme.colors.primary.blue,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: Theme.colors.background.white,
  },
  levelBadge: {
    position: 'absolute',
    top: -5,
    left: -5,
    width: 28,
    height: 28,
    borderRadius: Theme.borderRadius.circle,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: Theme.colors.background.white,
  },
  levelBadgeText: {
    fontFamily: Theme.typography.fontFamily.heading,
    fontSize: Theme.typography.fontSize.sm,
    color: Theme.colors.background.white,
  },
  verificationBadge: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: 24,
    height: 24,
    borderRadius: Theme.borderRadius.circle,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: Theme.colors.background.white,
  },
  profileName: {
    fontFamily: Theme.typography.fontFamily.heading,
    fontSize: Theme.typography.fontSize.xl,
    color: Theme.colors.text.dark,
    marginBottom: Theme.spacing.xs,
  },
  profileTitle: {
    fontFamily: Theme.typography.fontFamily.subheading,
    fontSize: Theme.typography.fontSize.md,
    color: Theme.colors.primary.blue,
    marginBottom: Theme.spacing.xs,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationText: {
    fontFamily: Theme.typography.fontFamily.body,
    fontSize: Theme.typography.fontSize.sm,
    color: Theme.colors.text.medium,
    marginLeft: Theme.spacing.xs,
  },
  tabsContainer: {
    backgroundColor: Theme.colors.background.white,
    marginHorizontal: Theme.spacing.md,
    borderRadius: Theme.borderRadius.md,
    marginBottom: Theme.spacing.md,
    ...Theme.shadows.small,
  },
  tab: {
    paddingVertical: Theme.spacing.md,
    paddingHorizontal: Theme.spacing.md,
    alignItems: 'center',
    borderRadius: Theme.borderRadius.md,
  },
  activeTab: {
    backgroundColor: Theme.colors.primary.blue,
  },
  tabText: {
    fontFamily: Theme.typography.fontFamily.body,
    fontSize: Theme.typography.fontSize.sm,
    color: Theme.colors.text.medium,
  },
  activeTabText: {
    fontFamily: Theme.typography.fontFamily.subheading,
    color: Theme.colors.background.white,
  },
  tabWithBadge: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  tabBadge: {
    backgroundColor: Theme.colors.status.error,
    borderRadius: Theme.borderRadius.circle,
    minWidth: 16,
    height: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: Theme.spacing.xs,
    paddingHorizontal: 3,
  },
  tabBadgeText: {
    fontFamily: Theme.typography.fontFamily.subheading,
    fontSize: 8,
    color: Theme.colors.background.white,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: Theme.spacing.md,
    marginBottom: Theme.spacing.lg,
  },
  statCard: {
    width: '23%',
    backgroundColor: Theme.colors.background.white,
    borderRadius: Theme.borderRadius.md,
    padding: Theme.spacing.sm,
    alignItems: 'center',
    marginHorizontal: '1%',
    ...Theme.shadows.small,
  },
  statNumber: {
    fontFamily: Theme.typography.fontFamily.heading,
    fontSize: Theme.typography.fontSize.lg,
    color: Theme.colors.text.dark,
    marginVertical: Theme.spacing.xs,
  },
  statLabel: {
    fontFamily: Theme.typography.fontFamily.body,
    fontSize: Theme.typography.fontSize.xs,
    color: Theme.colors.text.medium,
  },
  insightsPreview: {
    marginBottom: Theme.spacing.lg,
  },
  insightsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: Theme.spacing.md,
    marginBottom: Theme.spacing.sm,
  },
  insightsBadge: {
    backgroundColor: Theme.colors.status.error,
    borderRadius: Theme.borderRadius.circle,
    minWidth: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: Theme.spacing.sm,
  },
  insightsBadgeText: {
    fontFamily: Theme.typography.fontFamily.subheading,
    fontSize: Theme.typography.fontSize.xs,
    color: Theme.colors.background.white,
    paddingHorizontal: 4,
  },
  insightCardContainer: {
    width: 250,
    marginRight: Theme.spacing.sm,
    marginLeft: Theme.spacing.md,
  },
  viewAllInsights: {
    width: 100,
    backgroundColor: Theme.colors.background.white,
    borderRadius: Theme.borderRadius.md,
    padding: Theme.spacing.sm,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Theme.spacing.md,
    ...Theme.shadows.small,
  },
  viewAllInsightsText: {
    fontFamily: Theme.typography.fontFamily.body,
    fontSize: Theme.typography.fontSize.sm,
    color: Theme.colors.primary.gold,
    marginTop: Theme.spacing.xs,
  },
  streaksSection: {
    marginBottom: Theme.spacing.lg,
  },
  sectionTitle: {
    fontFamily: Theme.typography.fontFamily.subheading,
    fontSize: Theme.typography.fontSize.lg,
    color: Theme.colors.text.dark,
    marginHorizontal: Theme.spacing.md,
    marginBottom: Theme.spacing.md,
  },
  streaksGrid: {
    flexDirection: 'row',
    marginHorizontal: Theme.spacing.md,
  },
  streakCard: {
    flex: 1,
    backgroundColor: Theme.colors.background.white,
    borderRadius: Theme.borderRadius.md,
    padding: Theme.spacing.md,
    alignItems: 'center',
    marginHorizontal: Theme.spacing.xs,
    ...Theme.shadows.small,
  },
  streakNumber: {
    fontFamily: Theme.typography.fontFamily.heading,
    fontSize: Theme.typography.fontSize.xxl,
    color: Theme.colors.primary.blue,
  },
  streakLabel: {
    fontFamily: Theme.typography.fontFamily.body,
    fontSize: Theme.typography.fontSize.xs,
    color: Theme.colors.text.medium,
    textAlign: 'center',
  },
  recentAchievements: {
    marginBottom: Theme.spacing.lg,
  },
  achievementsSection: {
    marginBottom: Theme.spacing.lg,
  },
  challengesSection: {
    marginBottom: Theme.spacing.lg,
  },
  section: {
    backgroundColor: Theme.colors.background.white,
    borderRadius: Theme.borderRadius.lg,
    padding: Theme.spacing.md,
    marginBottom: Theme.spacing.md,
    marginHorizontal: Theme.spacing.md,
    ...Theme.shadows.small,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Theme.spacing.md,
  },
  infoLabel: {
    fontFamily: Theme.typography.fontFamily.body,
    fontSize: Theme.typography.fontSize.sm,
    color: Theme.colors.text.medium,
    marginLeft: Theme.spacing.md,
  },
  infoValue: {
    fontFamily: Theme.typography.fontFamily.subheading,
    fontSize: Theme.typography.fontSize.md,
    color: Theme.colors.text.dark,
    marginLeft: Theme.spacing.md,
  },
  verseContainer: {
    flexDirection: 'row',
    backgroundColor: Theme.colors.background.lilac,
    padding: Theme.spacing.md,
    borderRadius: Theme.borderRadius.md,
    borderLeftWidth: 3,
    borderLeftColor: Theme.colors.primary.lilac,
    alignItems: 'flex-start',
  },
  verseText: {
    fontFamily: Theme.typography.fontFamily.verse,
    fontSize: Theme.typography.fontSize.md,
    color: Theme.colors.text.dark,
    marginLeft: Theme.spacing.md,
    flex: 1,
  },
  bioText: {
    fontFamily: Theme.typography.fontFamily.body,
    fontSize: Theme.typography.fontSize.md,
    color: Theme.colors.text.dark,
    lineHeight: 24,
  },
  photosGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  photoContainer: {
    width: '31%',
    aspectRatio: 1,
    marginBottom: Theme.spacing.sm,
    borderRadius: Theme.borderRadius.md,
    overflow: 'hidden',
  },
  photo: {
    width: '100%',
    height: '100%',
  },
  addPhotoButton: {
    width: '31%',
    aspectRatio: 1,
    borderRadius: Theme.borderRadius.md,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: Theme.colors.ui.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addPhotoText: {
    fontFamily: Theme.typography.fontFamily.heading,
    fontSize: 24,
    color: Theme.colors.text.medium,
  },
  interestsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  interestTag: {
    backgroundColor: Theme.colors.background.lilac,
    paddingVertical: Theme.spacing.xs,
    paddingHorizontal: Theme.spacing.md,
    borderRadius: Theme.borderRadius.md,
    marginRight: Theme.spacing.sm,
    marginBottom: Theme.spacing.sm,
  },
  interestText: {
    fontFamily: Theme.typography.fontFamily.body,
    fontSize: Theme.typography.fontSize.sm,
    color: Theme.colors.primary.blue,
  },
  editProfileButton: {
    backgroundColor: Theme.colors.primary.blue,
    borderRadius: Theme.borderRadius.md,
    paddingVertical: Theme.spacing.md,
    marginHorizontal: Theme.spacing.md,
    marginBottom: Theme.spacing.xl,
    alignItems: 'center',
  },
  editProfileText: {
    fontFamily: Theme.typography.fontFamily.subheading,
    fontSize: Theme.typography.fontSize.md,
    color: Theme.colors.background.white,
  },
  socialContainer: {
    flex: 1,
  },
  socialTabsContainer: {
    flexDirection: 'row',
    backgroundColor: Theme.colors.background.white,
    borderBottomWidth: 1,
    borderBottomColor: Theme.colors.ui.border,
  },
  socialTab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Theme.spacing.md,
  },
  activeSocialTab: {
    borderBottomWidth: 2,
    borderBottomColor: Theme.colors.primary.blue,
  },
  socialTabText: {
    fontFamily: Theme.typography.fontFamily.body,
    fontSize: Theme.typography.fontSize.sm,
    color: Theme.colors.text.medium,
    marginLeft: Theme.spacing.xs,
  },
  activeSocialTabText: {
    fontFamily: Theme.typography.fontFamily.subheading,
    color: Theme.colors.primary.blue,
  },
  socialListContent: {
    padding: Theme.spacing.md,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Theme.spacing.xl,
    minHeight: 300,
  },
  emptyTitle: {
    fontFamily: Theme.typography.fontFamily.subheading,
    fontSize: Theme.typography.fontSize.lg,
    color: Theme.colors.text.dark,
    marginTop: Theme.spacing.md,
    marginBottom: Theme.spacing.sm,
  },
  emptySubtitle: {
    fontFamily: Theme.typography.fontFamily.body,
    fontSize: Theme.typography.fontSize.md,
    color: Theme.colors.text.medium,
    textAlign: 'center',
  },
  subscriptionContainer: {
    padding: Theme.spacing.md,
  },
  subscriptionTitle: {
    fontFamily: Theme.typography.fontFamily.heading,
    fontSize: Theme.typography.fontSize.xl,
    color: Theme.colors.text.dark,
    marginBottom: Theme.spacing.lg,
  },
  activeSubscriptionContainer: {
    backgroundColor: Theme.colors.background.white,
    borderRadius: Theme.borderRadius.lg,
    padding: Theme.spacing.lg,
    marginBottom: Theme.spacing.lg,
    ...Theme.shadows.medium,
  },
  activeSubscriptionTitle: {
    fontFamily: Theme.typography.fontFamily.subheading,
    fontSize: Theme.typography.fontSize.lg,
    color: Theme.colors.primary.gold,
    marginBottom: Theme.spacing.md,
  },
  activeSubscriptionDetails: {
    fontFamily: Theme.typography.fontFamily.body,
    fontSize: Theme.typography.fontSize.md,
    color: Theme.colors.text.dark,
    marginBottom: Theme.spacing.lg,
    lineHeight: 22,
  },
  manageSubscriptionButton: {
    backgroundColor: Theme.colors.primary.blue,
    borderRadius: Theme.borderRadius.md,
    paddingVertical: Theme.spacing.md,
    alignItems: 'center',
  },
  manageSubscriptionText: {
    fontFamily: Theme.typography.fontFamily.subheading,
    fontSize: Theme.typography.fontSize.md,
    color: Theme.colors.background.white,
  },
});