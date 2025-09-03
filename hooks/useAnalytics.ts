import { useState, useEffect } from 'react';
import { Platform } from 'react-native';
import { 
  AnalyticsSystem, 
  AnalyticsData, 
  UserInsight, 
  AnalyticsDashboard,
  ConnectionAnalytics,
  CommunityAnalytics
} from '@/utils/analyticsSystem';
import { useCompatibility } from './useCompatibility';
import { useSecurity } from './useSecurity';
import { useSpiritual } from './useSpiritual';
import { useCommunication } from './useCommunication';
import { useGamification } from './useGamification';
import Constants from 'expo-constants';

export function useAnalytics() {
  const [insights, setInsights] = useState<UserInsight[]>([]);
  const [dashboard, setDashboard] = useState<AnalyticsDashboard | null>(null);
  const [connectionAnalytics, setConnectionAnalytics] = useState<ConnectionAnalytics[]>([]);
  const [communityAnalytics, setCommunityAnalytics] = useState<CommunityAnalytics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [sessionId, setSessionId] = useState<string>('');
  
  const { currentUser, potentialMatches, getCompatibilityMatches } = useCompatibility();
  const { securityProfile } = useSecurity();
  const { spiritualStats, prayerRequests } = useSpiritual();
  const { conversations, messages } = useCommunication();
  const { userStats } = useGamification();

  // Initialize analytics
  useEffect(() => {
    initializeAnalytics();
    loadInsights();
    loadDashboard();
    loadConnectionAnalytics();
    loadCommunityAnalytics();
  }, [currentUser, securityProfile]);

  const initializeAnalytics = () => {
    if (!currentUser) return;
    
    const userId = currentUser.id;
    const platform = Platform.OS as 'ios' | 'android' | 'web';
    const appVersion = Constants.expoConfig?.version || '1.0.0';
    
    // Track app open event
    const event = AnalyticsSystem.trackEvent(
      userId,
      'app_open',
      { screen: 'initial' },
      platform,
      appVersion
    );
    
    setSessionId(event.sessionId);
  };

  const trackEvent = (eventType: string, eventData: any) => {
    if (!currentUser) return;
    
    const userId = currentUser.id;
    const platform = Platform.OS as 'ios' | 'android' | 'web';
    const appVersion = Constants.expoConfig?.version || '1.0.0';
    
    return AnalyticsSystem.trackEvent(
      userId,
      eventType,
      eventData,
      platform,
      appVersion
    );
  };

  const trackScreenView = (screenName: string, params?: any) => {
    return trackEvent('screen_view', { screen: screenName, params });
  };

  const trackUserAction = (action: string, details?: any) => {
    return trackEvent('user_action', { action, details });
  };

  const trackError = (errorCode: string, errorMessage: string, context?: any) => {
    return trackEvent('error', { errorCode, errorMessage, context });
  };

  const loadInsights = async () => {
    if (!currentUser || !securityProfile) return;
    
    setIsLoading(true);
    
    try {
      // In a real app, this would fetch insights from an API
      // For now, we'll generate mock insights
      
      // Get data for insights generation
      const connections = getCompatibilityMatches;
      
      // Mock prayer activity
      const prayerActivity = Array(10).fill(0).map((_, i) => ({
        type: 'prayer_session',
        timestamp: Date.now() - (i * 24 * 60 * 60 * 1000),
        duration: Math.floor(Math.random() * 15) + 5
      }));
      
      // Mock verse activity
      const verseActivity = Array(15).fill(0).map((_, i) => ({
        type: 'verse_read',
        timestamp: Date.now() - (i * 12 * 60 * 60 * 1000),
        category: ['comfort', 'strength', 'love', 'peace', 'wisdom', 'faith'][Math.floor(Math.random() * 6)]
      }));
      
      // Generate insights
      const userInsights = AnalyticsSystem.generateUserInsights(
        currentUser.id,
        currentUser,
        securityProfile,
        connections,
        prayerActivity,
        messages.get('conv_1') || []
      );
      
      // Generate spiritual insights
      const spiritualInsights = AnalyticsSystem.generateSpiritualInsights(
        prayerActivity,
        verseActivity,
        prayerRequests
      );
      
      setInsights([...userInsights, ...spiritualInsights]);
    } catch (error) {
      console.error('Error loading insights:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadDashboard = async () => {
    if (!currentUser) return;
    
    setIsLoading(true);
    
    try {
      // Mock connections
      const connections = getCompatibilityMatches.map(match => ({
        id: match.user.id,
        name: match.user.name,
        compatibilityScore: match.score.overall,
        startDate: Date.now() - (Math.random() * 30 * 24 * 60 * 60 * 1000),
        lastInteraction: Date.now() - (Math.random() * 7 * 24 * 60 * 60 * 1000),
        messageCount: Math.floor(Math.random() * 100),
        prayersTogether: Math.floor(Math.random() * 10)
      }));
      
      // Mock spiritual activity
      const spiritualActivity = [
        ...Array(spiritualStats.prayerMinutes).fill(0).map(() => ({ type: 'prayer_minute' })),
        ...Array(spiritualStats.versesRead).fill(0).map(() => ({ type: 'verse_read' })),
        ...Array(prayerRequests.length).fill(0).map(() => ({ type: 'prayer_request' })),
        ...Array(spiritualStats.requestsAnswered).fill(0).map(() => ({ type: 'prayer_answered' })),
        ...Array(spiritualStats.communityPrayers).fill(0).map(() => ({ type: 'community_prayer' }))
      ];
      
      // Mock message activity
      const messageActivity = Array(conversations.length * 20).fill(0).map((_, i) => ({
        id: `msg_${i}`,
        senderId: i % 2 === 0 ? currentUser.id : `user_${i % 5 + 1}`,
        timestamp: Date.now() - (i * 3 * 60 * 60 * 1000)
      }));
      
      // Mock community activity
      const communityActivity = [
        ...Array(10).fill(0).map(() => ({ type: 'event_attended' })),
        ...Array(20).fill(0).map(() => ({ type: 'profile_viewed' })),
        ...Array(5).fill(0).map(() => ({ type: 'testimony_shared' })),
        ...Array(3).fill(0).map(() => ({ type: 'prayer_circle' })),
        ...Array(15).fill(0).map(() => ({ type: 'encouragement_sent' }))
      ];
      
      const userDashboard = AnalyticsSystem.generateUserDashboard(
        currentUser.id,
        connections,
        spiritualActivity,
        messageActivity,
        communityActivity
      );
      
      setDashboard(userDashboard);
    } catch (error) {
      console.error('Error loading dashboard:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadConnectionAnalytics = async () => {
    if (!currentUser) return;
    
    try {
      // Mock connection analytics
      const mockConnectionAnalytics: ConnectionAnalytics[] = getCompatibilityMatches.map(match => ({
        connectionId: `conn_${match.user.id}`,
        users: [currentUser.id, match.user.id],
        compatibilityScore: match.score.overall,
        startDate: Date.now() - (Math.random() * 30 * 24 * 60 * 60 * 1000),
        messageCount: Math.floor(Math.random() * 100),
        callMinutes: Math.floor(Math.random() * 60),
        prayersTogether: Math.floor(Math.random() * 10),
        lastInteraction: Date.now() - (Math.random() * 7 * 24 * 60 * 60 * 1000),
        status: Math.random() > 0.2 ? 'active' : 'inactive',
        healthScore: Math.floor(Math.random() * 100),
        insights: []
      }));
      
      // Generate insights for each connection
      mockConnectionAnalytics.forEach(connection => {
        connection.insights = AnalyticsSystem.generateConnectionInsights(connection);
      });
      
      setConnectionAnalytics(mockConnectionAnalytics);
    } catch (error) {
      console.error('Error loading connection analytics:', error);
    }
  };

  const loadCommunityAnalytics = async () => {
    try {
      const analytics = AnalyticsSystem.generateCommunityAnalytics();
      setCommunityAnalytics(analytics);
    } catch (error) {
      console.error('Error loading community analytics:', error);
    }
  };

  const getUnreadInsightsCount = (): number => {
    return insights.filter(insight => !insight.isRead).length;
  };

  const markInsightAsRead = (insightId: string) => {
    setInsights(prev => prev.map(insight => 
      insight.id === insightId ? { ...insight, isRead: true } : insight
    ));
  };

  const markAllInsightsAsRead = () => {
    setInsights(prev => prev.map(insight => ({ ...insight, isRead: true })));
  };

  const getInsightsByType = (type: UserInsight['type']): UserInsight[] => {
    return insights.filter(insight => insight.type === type);
  };

  const getInsightsByPriority = (priority: UserInsight['priority']): UserInsight[] => {
    return insights.filter(insight => insight.priority === priority);
  };

  const getConnectionRecommendations = () => {
    if (!currentUser) return [];
    
    return AnalyticsSystem.generateConnectionRecommendations(
      currentUser,
      connectionAnalytics.map(conn => ({
        id: conn.connectionId,
        name: potentialMatches.find(m => m.id === conn.users[1])?.name || 'Conexão',
        compatibilityScore: conn.compatibilityScore,
        lastInteraction: conn.lastInteraction,
        messageCount: conn.messageCount,
        prayersTogether: conn.prayersTogether
      })),
      insights
    );
  };

  const getPrayerAnalytics = () => {
    return AnalyticsSystem.generatePrayerAnalytics(prayerRequests);
  };

  return {
    insights,
    dashboard,
    connectionAnalytics,
    communityAnalytics,
    isLoading,
    sessionId,
    trackEvent,
    trackScreenView,
    trackUserAction,
    trackError,
    getUnreadInsightsCount,
    markInsightAsRead,
    markAllInsightsAsRead,
    getInsightsByType,
    getInsightsByPriority,
    getConnectionRecommendations,
    getPrayerAnalytics,
    refreshInsights: loadInsights,
    refreshDashboard: loadDashboard
  };
}