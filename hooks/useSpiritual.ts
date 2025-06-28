import { useState, useEffect } from 'react';
import { Platform } from 'react-native';
import { 
  DailyVerse, 
  PrayerRequest, 
  PrayerMoment, 
  SpiritualContentManager 
} from '@/utils/spiritualContent';
import { useNotifications } from './useNotifications';

export interface SpiritualStats {
  versesRead: number;
  prayerMinutes: number;
  prayerStreak: number;
  requestsAnswered: number;
  communityPrayers: number;
}

export function useSpiritual() {
  const [dailyVerse, setDailyVerse] = useState<DailyVerse | null>(null);
  const [prayerRequests, setPrayerRequests] = useState<PrayerRequest[]>([]);
  const [myPrayerRequests, setMyPrayerRequests] = useState<PrayerRequest[]>([]);
  const [activePrayerMoment, setActivePrayerMoment] = useState<PrayerMoment | null>(null);
  const [prayerTimer, setPrayerTimer] = useState<number>(0);
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [spiritualStats, setSpiritualStats] = useState<SpiritualStats>({
    versesRead: 0,
    prayerMinutes: 0,
    prayerStreak: 0,
    requestsAnswered: 0,
    communityPrayers: 0
  });
  const [hasReadTodaysVerse, setHasReadTodaysVerse] = useState(false);
  
  const { sendPrayerNotification } = useNotifications();

  // Load daily verse
  useEffect(() => {
    const verse = SpiritualContentManager.getDailyVerse();
    setDailyVerse(verse);
    loadSpiritualData();
  }, []);

  // Prayer timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isTimerActive && prayerTimer > 0) {
      interval = setInterval(() => {
        setPrayerTimer(prev => {
          if (prev <= 1) {
            setIsTimerActive(false);
            handlePrayerComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTimerActive, prayerTimer]);

  const loadSpiritualData = async () => {
    // In a real app, load from AsyncStorage or API
    const mockPrayerRequests: PrayerRequest[] = [
      {
        id: '1',
        title: 'Oração pela Família',
        description: 'Peço orações pela saúde da minha mãe que está passando por um tratamento.',
        category: 'family',
        priority: 'high',
        isPrivate: false,
        requestedBy: 'Maria Silva',
        requestedAt: Date.now() - 86400000,
        prayedBy: ['João', 'Ana', 'Pedro'],
        answered: false
      },
      {
        id: '2',
        title: 'Direção Profissional',
        description: 'Busco direção de Deus para uma importante decisão de carreira.',
        category: 'work',
        priority: 'medium',
        isPrivate: false,
        requestedBy: 'Carlos Santos',
        requestedAt: Date.now() - 172800000,
        prayedBy: ['Ana', 'Mariana'],
        answered: false
      }
    ];

    const mockMyRequests: PrayerRequest[] = [
      {
        id: '3',
        title: 'Relacionamento Abençoado',
        description: 'Oro por um relacionamento que honre a Deus e seja baseado em Seus princípios.',
        category: 'relationship',
        priority: 'medium',
        isPrivate: true,
        requestedBy: 'Eu',
        requestedAt: Date.now() - 259200000,
        prayedBy: [],
        answered: false
      }
    ];

    setPrayerRequests(mockPrayerRequests);
    setMyPrayerRequests(mockMyRequests);

    // Load stats from storage
    const mockStats: SpiritualStats = {
      versesRead: 15,
      prayerMinutes: 120,
      prayerStreak: 7,
      requestsAnswered: 3,
      communityPrayers: 25
    };
    setSpiritualStats(mockStats);
  };

  const markVerseAsRead = () => {
    if (!hasReadTodaysVerse) {
      setHasReadTodaysVerse(true);
      setSpiritualStats(prev => ({
        ...prev,
        versesRead: prev.versesRead + 1
      }));
      
      // In a real app, save to AsyncStorage
      console.log('Verse marked as read');
    }
  };

  const startPrayerMoment = (moment: PrayerMoment) => {
    setActivePrayerMoment(moment);
    setPrayerTimer(moment.duration * 60); // Convert minutes to seconds
    setIsTimerActive(true);
  };

  const pausePrayerMoment = () => {
    setIsTimerActive(false);
  };

  const resumePrayerMoment = () => {
    if (prayerTimer > 0) {
      setIsTimerActive(true);
    }
  };

  const stopPrayerMoment = () => {
    setIsTimerActive(false);
    setPrayerTimer(0);
    setActivePrayerMoment(null);
  };

  const handlePrayerComplete = () => {
    if (activePrayerMoment) {
      const minutesCompleted = activePrayerMoment.duration;
      setSpiritualStats(prev => ({
        ...prev,
        prayerMinutes: prev.prayerMinutes + minutesCompleted
      }));

      sendPrayerNotification(
        `Parabéns! Você completou ${minutesCompleted} minutos de oração. 🙏`
      );

      setActivePrayerMoment(null);
    }
  };

  const addPrayerRequest = (
    title: string,
    description: string,
    category: PrayerRequest['category'],
    priority: PrayerRequest['priority'] = 'medium',
    isPrivate: boolean = false
  ) => {
    const newRequest = SpiritualContentManager.generatePrayerRequest(
      title,
      description,
      category,
      priority,
      isPrivate,
      'Eu' // In a real app, use actual user name
    );

    if (isPrivate) {
      setMyPrayerRequests(prev => [newRequest, ...prev]);
    } else {
      setPrayerRequests(prev => [newRequest, ...prev]);
    }

    return newRequest;
  };

  const prayForRequest = (requestId: string) => {
    const updateRequest = (request: PrayerRequest) => {
      if (request.id === requestId && !request.prayedBy.includes('Eu')) {
        return {
          ...request,
          prayedBy: [...request.prayedBy, 'Eu']
        };
      }
      return request;
    };

    setPrayerRequests(prev => prev.map(updateRequest));
    setMyPrayerRequests(prev => prev.map(updateRequest));

    setSpiritualStats(prev => ({
      ...prev,
      communityPrayers: prev.communityPrayers + 1
    }));

    sendPrayerNotification('Obrigado por orar! Sua intercessão faz a diferença. 💕');
  };

  const markRequestAsAnswered = (requestId: string, testimony?: string) => {
    const updateRequest = (request: PrayerRequest) => {
      if (request.id === requestId) {
        return {
          ...request,
          answered: true,
          answeredAt: Date.now(),
          testimony
        };
      }
      return request;
    };

    setPrayerRequests(prev => prev.map(updateRequest));
    setMyPrayerRequests(prev => prev.map(updateRequest));

    setSpiritualStats(prev => ({
      ...prev,
      requestsAnswered: prev.requestsAnswered + 1
    }));

    sendPrayerNotification('Glória a Deus! Uma oração foi respondida! 🎉');
  };

  const getVersesByTheme = (theme: string) => {
    return SpiritualContentManager.getVersesByTheme(theme);
  };

  const searchVerses = (query: string) => {
    return SpiritualContentManager.searchVerses(query);
  };

  const getPrayerMoments = () => {
    return SpiritualContentManager.getPrayerMoments();
  };

  const getRandomVerse = () => {
    return SpiritualContentManager.getRandomVerse();
  };

  const formatPrayerTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const getPrayerProgress = (): number => {
    if (!activePrayerMoment) return 0;
    const totalSeconds = activePrayerMoment.duration * 60;
    const elapsedSeconds = totalSeconds - prayerTimer;
    return (elapsedSeconds / totalSeconds) * 100;
  };

  const getCommunityPrayerRequests = () => {
    return prayerRequests.filter(request => !request.isPrivate);
  };

  const getMyPrayerRequests = () => {
    return myPrayerRequests;
  };

  const getPrayerRequestsByCategory = (category: PrayerRequest['category']) => {
    return prayerRequests.filter(request => request.category === category);
  };

  const getAnsweredPrayers = () => {
    return [...prayerRequests, ...myPrayerRequests].filter(request => request.answered);
  };

  return {
    // Verses
    dailyVerse,
    hasReadTodaysVerse,
    markVerseAsRead,
    getVersesByTheme,
    searchVerses,
    getRandomVerse,

    // Prayer Moments
    activePrayerMoment,
    prayerTimer,
    isTimerActive,
    startPrayerMoment,
    pausePrayerMoment,
    resumePrayerMoment,
    stopPrayerMoment,
    formatPrayerTime,
    getPrayerProgress,
    getPrayerMoments,

    // Prayer Requests
    prayerRequests,
    myPrayerRequests,
    addPrayerRequest,
    prayForRequest,
    markRequestAsAnswered,
    getCommunityPrayerRequests,
    getMyPrayerRequests,
    getPrayerRequestsByCategory,
    getAnsweredPrayers,

    // Stats
    spiritualStats
  };
}