import { useState, useEffect, useMemo } from 'react';
import { UserProfile, CompatibilityScore, CompatibilityAlgorithm } from '@/utils/compatibilityAlgorithm';

export interface CompatibilityMatch {
  user: UserProfile;
  score: CompatibilityScore;
  lastCalculated: number;
}

export function useCompatibility() {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [potentialMatches, setPotentialMatches] = useState<UserProfile[]>([]);
  const [compatibilityCache, setCompatibilityCache] = useState<Map<string, CompatibilityScore>>(new Map());
  const [isCalculating, setIsCalculating] = useState(false);

  // Mock current user data - in a real app, this would come from authentication
  useEffect(() => {
    const mockCurrentUser: UserProfile = {
      id: 'current-user',
      name: 'Ana Clara',
      age: 27,
      denomination: 'Batista',
      location: {
        state: 'São Paulo',
        city: 'São Paulo',
        coordinates: { latitude: -23.5505, longitude: -46.6333 }
      },
      languages: ['Português', 'Inglês'],
      interests: ['Música', 'Viagens', 'Leitura', 'Ensino', 'Evangelismo'],
      education: 'Graduação',
      churchFrequency: 2,
      children: 0,
      height: 165,
      zodiacSign: 'Virgem',
      favoriteWorship: 'Deus é Deus - Delino Marçal',
      aboutMe: 'Amo música, viagens e servir ao Senhor. Sou professora, gosto de ler e estou em busca de alguém que compartilhe da mesma fé e valores.',
      verse: 'Mas buscai primeiro o Reino de Deus, e a sua justiça, e todas as coisas vos serão acrescentadas. Mateus 6:33',
      photos: ['https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg'],
      preferences: {
        ageRange: [25, 35],
        maxDistance: 50,
        denominations: ['Batista', 'Presbiteriana'],
        education: ['Graduação', 'Pós-graduação'],
        children: 'no-preference',
        languages: ['Português']
      },
      personality: {
        extroversion: 7,
        agreeableness: 8,
        conscientiousness: 9,
        spirituality: 9,
        familyOriented: 8
      },
      values: {
        marriageImportance: 9,
        familyImportance: 9,
        careerImportance: 7,
        faithImportance: 10,
        communityImportance: 8
      },
      lifestyle: {
        smokingTolerance: 'never',
        drinkingTolerance: 'socially',
        exerciseFrequency: 3,
        socialLevel: 6
      }
    };

    setCurrentUser(mockCurrentUser);
  }, []);

  // Mock potential matches - in a real app, this would come from an API
  useEffect(() => {
    const mockMatches: UserProfile[] = [
      {
        id: '1',
        name: 'João',
        age: 30,
        denomination: 'Batista',
        location: {
          state: 'São Paulo',
          city: 'Campinas',
          coordinates: { latitude: -22.9056, longitude: -47.0608 }
        },
        languages: ['Português', 'Inglês'],
        interests: ['Música', 'Esportes', 'Evangelismo', 'Voluntariado'],
        education: 'Pós-graduação',
        churchFrequency: 2,
        children: 0,
        height: 180,
        zodiacSign: 'Leão',
        favoriteWorship: 'Reckless Love - Cory Asbury',
        aboutMe: 'Engenheiro apaixonado por servir a Deus e ajudar o próximo.',
        verse: 'Porque Deus amou o mundo de tal maneira que deu o seu Filho unigênito. João 3:16',
        photos: ['https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg'],
        preferences: {
          ageRange: [24, 32],
          maxDistance: 100,
          denominations: ['Batista', 'Presbiteriana'],
          education: ['Graduação', 'Pós-graduação'],
          children: 'no-preference',
          languages: ['Português']
        },
        personality: {
          extroversion: 6,
          agreeableness: 9,
          conscientiousness: 8,
          spirituality: 9,
          familyOriented: 9
        },
        values: {
          marriageImportance: 9,
          familyImportance: 10,
          careerImportance: 8,
          faithImportance: 10,
          communityImportance: 9
        },
        lifestyle: {
          smokingTolerance: 'never',
          drinkingTolerance: 'never',
          exerciseFrequency: 4,
          socialLevel: 7
        }
      },
      {
        id: '2',
        name: 'Mariana',
        age: 28,
        denomination: 'Presbiteriana',
        location: {
          state: 'São Paulo',
          city: 'São Paulo',
          coordinates: { latitude: -23.5505, longitude: -46.6333 }
        },
        languages: ['Português', 'Espanhol'],
        interests: ['Arte', 'Música', 'Leitura', 'Missões'],
        education: 'Graduação',
        churchFrequency: 3,
        children: 0,
        height: 160,
        zodiacSign: 'Peixes',
        favoriteWorship: 'Oceans - Hillsong United',
        aboutMe: 'Artista e missionária, busco alguém para compartilhar a jornada da fé.',
        verse: 'Entrega o teu caminho ao Senhor; confia nele, e ele tudo fará. Salmos 37:5',
        photos: ['https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg'],
        preferences: {
          ageRange: [26, 34],
          maxDistance: 30,
          denominations: ['Presbiteriana', 'Batista'],
          education: ['Graduação', 'Pós-graduação'],
          children: 'no-preference',
          languages: ['Português']
        },
        personality: {
          extroversion: 5,
          agreeableness: 9,
          conscientiousness: 7,
          spirituality: 10,
          familyOriented: 8
        },
        values: {
          marriageImportance: 8,
          familyImportance: 9,
          careerImportance: 6,
          faithImportance: 10,
          communityImportance: 9
        },
        lifestyle: {
          smokingTolerance: 'never',
          drinkingTolerance: 'socially',
          exerciseFrequency: 2,
          socialLevel: 5
        }
      }
    ];

    setPotentialMatches(mockMatches);
  }, []);

  const calculateCompatibility = async (user1: UserProfile, user2: UserProfile): Promise<CompatibilityScore> => {
    const cacheKey = `${user1.id}-${user2.id}`;
    
    // Check cache first
    if (compatibilityCache.has(cacheKey)) {
      return compatibilityCache.get(cacheKey)!;
    }

    setIsCalculating(true);
    
    // Simulate API delay for realistic UX
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const score = CompatibilityAlgorithm.calculateCompatibility(user1, user2);
    
    // Cache the result
    setCompatibilityCache(prev => new Map(prev.set(cacheKey, score)));
    
    setIsCalculating(false);
    return score;
  };

  const getCompatibilityMatches = useMemo((): CompatibilityMatch[] => {
    if (!currentUser) return [];

    return potentialMatches
      .map(user => {
        const cacheKey = `${currentUser.id}-${user.id}`;
        const cachedScore = compatibilityCache.get(cacheKey);
        
        if (cachedScore) {
          return {
            user,
            score: cachedScore,
            lastCalculated: Date.now()
          };
        }
        
        return null;
      })
      .filter(Boolean) as CompatibilityMatch[];
  }, [currentUser, potentialMatches, compatibilityCache]);

  const getSortedMatches = useMemo((): CompatibilityMatch[] => {
    return getCompatibilityMatches.sort((a, b) => b.score.overall - a.score.overall);
  }, [getCompatibilityMatches]);

  const getTopMatches = (limit: number = 10): CompatibilityMatch[] => {
    return getSortedMatches.slice(0, limit);
  };

  const getMatchesByCompatibilityLevel = (level: string): CompatibilityMatch[] => {
    return getSortedMatches.filter(match => 
      CompatibilityAlgorithm.getCompatibilityLevel(match.score.overall) === level
    );
  };

  const calculateAllCompatibilities = async (): Promise<void> => {
    if (!currentUser) return;

    setIsCalculating(true);
    
    for (const user of potentialMatches) {
      await calculateCompatibility(currentUser, user);
    }
    
    setIsCalculating(false);
  };

  const getCompatibilityInsights = (): {
    averageScore: number;
    topCategory: string;
    improvementAreas: string[];
  } => {
    const matches = getCompatibilityMatches;
    
    if (matches.length === 0) {
      return {
        averageScore: 0,
        topCategory: '',
        improvementAreas: []
      };
    }

    const averageScore = Math.round(
      matches.reduce((sum, match) => sum + match.score.overall, 0) / matches.length
    );

    // Find the category with highest average score
    const categoryAverages = {
      demographic: 0,
      religious: 0,
      personality: 0,
      values: 0,
      lifestyle: 0,
      preferences: 0
    };

    matches.forEach(match => {
      Object.keys(categoryAverages).forEach(category => {
        categoryAverages[category] += match.score.breakdown[category];
      });
    });

    Object.keys(categoryAverages).forEach(category => {
      categoryAverages[category] = categoryAverages[category] / matches.length;
    });

    const topCategory = Object.entries(categoryAverages)
      .sort(([,a], [,b]) => b - a)[0][0];

    // Find improvement areas (categories with lowest scores)
    const improvementAreas = Object.entries(categoryAverages)
      .filter(([, score]) => score < 70)
      .sort(([,a], [,b]) => a - b)
      .slice(0, 2)
      .map(([category]) => category);

    return {
      averageScore,
      topCategory,
      improvementAreas
    };
  };

  return {
    currentUser,
    potentialMatches,
    isCalculating,
    calculateCompatibility,
    getCompatibilityMatches,
    getSortedMatches,
    getTopMatches,
    getMatchesByCompatibilityLevel,
    calculateAllCompatibilities,
    getCompatibilityInsights
  };
}