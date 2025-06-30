import { useState, useEffect, useCallback, useMemo } from 'react';
import { 
  Achievement, 
  Level, 
  Challenge, 
  UserStats, 
  GamificationSystem 
} from '@/utils/gamificationSystem';
import { useNotifications } from './useNotifications';

export function useGamification() {
  const [userStats, setUserStats] = useState<UserStats>({
    totalPoints: 0,
    currentLevel: 1,
    prayerMinutes: 0,
    versesRead: 0,
    connectionsHelped: 0,
    challengesCompleted: 0,
    streaks: {
      prayer: 0,
      reading: 0,
      community: 0
    },
    achievements: [],
    titles: [],
    currentTitle: undefined
  });

  const [recentAchievements, setRecentAchievements] = useState<Achievement[]>([]);
  const [activeChallenge, setActiveChallenge] = useState<Challenge | null>(null);
  const [dailyChallenge, setDailyChallenge] = useState<Challenge | null>(null);
  const [levelProgress, setLevelProgress] = useState(0);
  
  const { sendLocalNotification } = useNotifications();

  useEffect(() => {
    loadUserStats();
    loadActiveChallenge();
    generateDailyChallenge();
  }, []);

  useEffect(() => {
    updateLevelProgress();
  }, [userStats.totalPoints, userStats.currentLevel]);

  const loadUserStats = async () => {
    // In a real app, load from AsyncStorage or API
    const mockStats: UserStats = {
      totalPoints: 245,
      currentLevel: 2,
      prayerMinutes: 45,
      versesRead: 12,
      connectionsHelped: 3,
      challengesCompleted: 2,
      streaks: {
        prayer: 5,
        reading: 3,
        community: 1
      },
      achievements: ['first_prayer', 'first_verse', 'first_connection'],
      titles: ['Novo Convertido', 'Discípulo Dedicado'],
      currentTitle: 'Discípulo Dedicado'
    };
    
    setUserStats(mockStats);
  };

  const loadActiveChallenge = () => {
    const challenge = GamificationSystem.getActiveChallenge();
    setActiveChallenge(challenge);
  };

  const generateDailyChallenge = () => {
    const challenge = GamificationSystem.generateDailyChallenge();
    setDailyChallenge(challenge);
  };

  const updateLevelProgress = () => {
    const progress = GamificationSystem.getProgressToNextLevel(
      userStats.totalPoints, 
      userStats.currentLevel
    );
    setLevelProgress(progress);
  };

  const addPoints = useCallback((action: string, value: number = 1) => {
    const points = GamificationSystem.calculatePoints(action, value);
    const newTotalPoints = userStats.totalPoints + points;
    
    // Check for level up
    const currentLevelData = GamificationSystem.getLevelByPoints(userStats.totalPoints);
    const newLevelData = GamificationSystem.getLevelByPoints(newTotalPoints);
    
    const leveledUp = newLevelData.level > currentLevelData.level;
    
    setUserStats(prev => ({
      ...prev,
      totalPoints: newTotalPoints,
      currentLevel: newLevelData.level
    }));

    // Check for new achievements
    const newAchievements = GamificationSystem.checkAchievements(
      { ...userStats, totalPoints: newTotalPoints },
      action,
      value
    );

    if (newAchievements.length > 0) {
      setRecentAchievements(prev => [...newAchievements, ...prev].slice(0, 5));
      
      newAchievements.forEach(achievement => {
        sendLocalNotification(
          'Nova Conquista! 🏆',
          `Você desbloqueou: ${achievement.title}`,
          'like',
          { achievementId: achievement.id }
        );
      });

      setUserStats(prev => ({
        ...prev,
        achievements: [...prev.achievements, ...newAchievements.map(a => a.id)]
      }));
    }

    if (leveledUp) {
      sendLocalNotification(
        'Nível Alcançado! ⭐',
        `Parabéns! Você alcançou o nível ${newLevelData.level}: ${newLevelData.title}`,
        'like',
        { level: newLevelData.level }
      );

      setUserStats(prev => ({
        ...prev,
        titles: [...prev.titles, newLevelData.title],
        currentTitle: newLevelData.title
      }));
    }

    return { points, leveledUp, newAchievements };
  }, [userStats, sendLocalNotification]);

  const updateStreak = useCallback((type: 'prayer' | 'reading' | 'community', increment: boolean = true) => {
    setUserStats(prev => ({
      ...prev,
      streaks: {
        ...prev.streaks,
        [type]: increment ? prev.streaks[type] + 1 : 0
      }
    }));
  }, []);

  const updateStat = useCallback((stat: keyof UserStats, value: number) => {
    if (typeof userStats[stat] === 'number') {
      setUserStats(prev => ({
        ...prev,
        [stat]: (prev[stat] as number) + value
      }));
    }
  }, [userStats]);

  const completeChallenge = useCallback((challengeId: string) => {
    const challenge = activeChallenge || dailyChallenge;
    if (!challenge || challenge.id !== challengeId) return false;

    challenge.completed = true;
    challenge.progress = 100;

    // Award points and rewards
    let totalPoints = 0;
    challenge.rewards.forEach(reward => {
      if (reward.type === 'points') {
        totalPoints += reward.value as number;
      }
    });

    if (totalPoints > 0) {
      addPoints('challenge_complete', totalPoints / GamificationSystem.calculatePoints('challenge_complete'));
    }

    setUserStats(prev => ({
      ...prev,
      challengesCompleted: prev.challengesCompleted + 1
    }));

    sendLocalNotification(
      'Desafio Concluído! 🎉',
      `Parabéns! Você completou: ${challenge.title}`,
      'like',
      { challengeId }
    );

    return true;
  }, [activeChallenge, dailyChallenge, addPoints, sendLocalNotification]);

  const updateChallengeProgress = useCallback((challengeId: string, taskId: string, progress: number) => {
    const completed = GamificationSystem.updateChallengeProgress(challengeId, taskId, progress);
    
    if (completed) {
      completeChallenge(challengeId);
    }

    // Update local state
    if (activeChallenge?.id === challengeId) {
      setActiveChallenge({ ...activeChallenge });
    }
    if (dailyChallenge?.id === challengeId) {
      setDailyChallenge({ ...dailyChallenge });
    }

    return completed;
  }, [activeChallenge, dailyChallenge, completeChallenge]);

  const getCurrentLevel = useCallback((): Level => {
    return GamificationSystem.getLevelByPoints(userStats.totalPoints);
  }, [userStats.totalPoints]);

  const getNextLevel = useCallback((currentLevel: number): Level | null => {
    return GamificationSystem.getNextLevel(currentLevel);
  }, []);

  const getAchievementsByCategory = useCallback((category: Achievement['category']) => {
    return GamificationSystem.getAchievementsByCategory(category);
  }, []);

  const getUnlockedAchievements = useMemo(() => {
    const allAchievements = GamificationSystem.getAllAchievements();
    return allAchievements.filter(achievement => 
      userStats.achievements.includes(achievement.id)
    );
  }, [userStats.achievements]);

  const getLockedAchievements = useMemo(() => {
    const allAchievements = GamificationSystem.getAllAchievements();
    return allAchievements.filter(achievement => 
      !userStats.achievements.includes(achievement.id)
    );
  }, [userStats.achievements]);

  const getAchievementProgress = useCallback((achievementId: string): number => {
    const achievement = GamificationSystem.getAllAchievements().find(a => a.id === achievementId);
    if (!achievement) return 0;

    switch (achievementId) {
      case 'prayer_warrior':
        return Math.min(100, (userStats.prayerMinutes / 100) * 100);
      case 'verse_collector':
        return Math.min(100, (userStats.versesRead / 50) * 100);
      case 'community_helper':
        return Math.min(100, (userStats.connectionsHelped / 10) * 100);
      case 'prayer_streak_7':
        return Math.min(100, (userStats.streaks.prayer / 7) * 100);
      default:
        return userStats.achievements.includes(achievementId) ? 100 : 0;
    }
  }, [userStats]);

  const setCurrentTitle = useCallback((title: string) => {
    if (userStats.titles.includes(title)) {
      setUserStats(prev => ({
        ...prev,
        currentTitle: title
      }));
    }
  }, [userStats.titles]);

  // Action handlers for different activities
  const handlePrayerComplete = useCallback((minutes: number) => {
    updateStat('prayerMinutes', minutes);
    updateStreak('prayer');
    return addPoints('prayer_minute', minutes);
  }, [updateStat, updateStreak, addPoints]);

  const handleVerseRead = useCallback(() => {
    updateStat('versesRead', 1);
    updateStreak('reading');
    return addPoints('verse_read');
  }, [updateStat, updateStreak, addPoints]);

  const handleCommunityPrayer = useCallback(() => {
    updateStat('connectionsHelped', 1);
    updateStreak('community');
    return addPoints('community_prayer');
  }, [updateStat, updateStreak, addPoints]);

  const handleConnectionMade = useCallback(() => {
    return addPoints('connection_made');
  }, [addPoints]);

  const handleEventAttend = useCallback(() => {
    return addPoints('event_attend');
  }, [addPoints]);

  const handleTestimonyShare = useCallback(() => {
    return addPoints('testimony_share');
  }, [addPoints]);

  return {
    // State
    userStats,
    recentAchievements,
    activeChallenge,
    dailyChallenge,
    levelProgress,
    
    // Level functions
    getCurrentLevel,
    getNextLevel,
    
    // Achievement functions
    getAchievementsByCategory,
    getUnlockedAchievements,
    getLockedAchievements,
    getAchievementProgress,

    // Challenge functions
    updateChallengeProgress,
    completeChallenge,

    // User actions
    addPoints,
    updateStreak,
    updateStat,
    setCurrentTitle,

    // Activity handlers
    handlePrayerComplete,
    handleVerseRead,
    handleCommunityPrayer,
    handleConnectionMade,
    handleEventAttend,
    handleTestimonyShare,

    // Utility
    generateDailyChallenge
  };
}