import { useState, useEffect } from 'react';
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
  const [nextLevel, setNextLevel] = useState<Level | null>(null);
  
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
    
    const next = GamificationSystem.getNextLevel(userStats.currentLevel);
    setNextLevel(next);
  };

  const addPoints = (action: string, value: number = 1) => {
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
  };

  const updateStreak = (type: 'prayer' | 'reading' | 'community', increment: boolean = true) => {
    setUserStats(prev => ({
      ...prev,
      streaks: {
        ...prev.streaks,
        [type]: increment ? prev.streaks[type] + 1 : 0
      }
    }));
  };

  const updateStat = (stat: keyof UserStats, value: number) => {
    if (typeof userStats[stat] === 'number') {
      setUserStats(prev => ({
        ...prev,
        [stat]: (prev[stat] as number) + value
      }));
    }
  };

  const completeChallenge = (challengeId: string) => {
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
  };

  const updateChallengeProgress = (challengeId: string, taskId: string, progress: number) => {
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
  };

  const getCurrentLevel = (): Level => {
    return GamificationSystem.getLevelByPoints(userStats.totalPoints);
  };

  const getAchievementsByCategory = (category: Achievement['category']) => {
    return GamificationSystem.getAchievementsByCategory(category);
  };

  const getUnlockedAchievements = () => {
    const allAchievements = GamificationSystem.getAllAchievements();
    return allAchievements.filter(achievement => 
      userStats.achievements.includes(achievement.id)
    );
  };

  const getLockedAchievements = () => {
    const allAchievements = GamificationSystem.getAllAchievements();
    return allAchievements.filter(achievement => 
      !userStats.achievements.includes(achievement.id)
    );
  };

  const getAchievementProgress = (achievementId: string): number => {
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
  };

  const setCurrentTitle = (title: string) => {
    if (userStats.titles.includes(title)) {
      setUserStats(prev => ({
        ...prev,
        currentTitle: title
      }));
    }
  };

  // Action handlers for different activities
  const handlePrayerComplete = (minutes: number) => {
    updateStat('prayerMinutes', minutes);
    updateStreak('prayer');
    return addPoints('prayer_minute', minutes);
  };

  const handleVerseRead = () => {
    updateStat('versesRead', 1);
    updateStreak('reading');
    return addPoints('verse_read');
  };

  const handleCommunityPrayer = () => {
    updateStat('connectionsHelped', 1);
    updateStreak('community');
    return addPoints('community_prayer');
  };

  const handleConnectionMade = () => {
    return addPoints('connection_made');
  };

  const handleEventAttend = () => {
    return addPoints('event_attend');
  };

  const handleTestimonyShare = () => {
    return addPoints('testimony_share');
  };

  return {
    // State
    userStats,
    recentAchievements,
    activeChallenge,
    dailyChallenge,
    levelProgress,
    nextLevel,

    // Level functions
    getCurrentLevel,
    
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