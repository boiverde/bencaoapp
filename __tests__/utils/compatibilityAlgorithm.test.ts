import { CompatibilityAlgorithm, UserProfile } from '@/utils/compatibilityAlgorithm';

describe('CompatibilityAlgorithm', () => {
  // Create mock user profiles for testing
  const user1: UserProfile = {
    id: 'user1',
    name: 'Ana',
    age: 28,
    denomination: 'Batista',
    location: {
      state: 'São Paulo',
      city: 'São Paulo',
      coordinates: { latitude: -23.5505, longitude: -46.6333 }
    },
    languages: ['Português', 'Inglês'],
    interests: ['Música', 'Viagens', 'Leitura'],
    education: 'Graduação',
    churchFrequency: 2,
    children: 0,
    height: 165,
    zodiacSign: 'Virgem',
    favoriteWorship: 'Deus é Deus - Delino Marçal',
    aboutMe: 'Amo música e servir ao Senhor',
    verse: 'João 3:16',
    photos: ['photo1.jpg'],
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
  
  const user2: UserProfile = {
    id: 'user2',
    name: 'João',
    age: 30,
    denomination: 'Batista',
    location: {
      state: 'São Paulo',
      city: 'São Paulo',
      coordinates: { latitude: -23.5505, longitude: -46.6333 }
    },
    languages: ['Português', 'Espanhol'],
    interests: ['Música', 'Esportes', 'Evangelismo'],
    education: 'Pós-graduação',
    churchFrequency: 2,
    children: 0,
    height: 180,
    zodiacSign: 'Leão',
    favoriteWorship: 'Reckless Love - Cory Asbury',
    aboutMe: 'Engenheiro apaixonado por servir a Deus',
    verse: 'Romanos 8:28',
    photos: ['photo2.jpg'],
    preferences: {
      ageRange: [25, 35],
      maxDistance: 50,
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
  };
  
  // Create a user with different values for testing lower compatibility
  const user3: UserProfile = {
    ...user1,
    id: 'user3',
    age: 40,
    denomination: 'Católica',
    location: {
      state: 'Rio de Janeiro',
      city: 'Rio de Janeiro',
      coordinates: { latitude: -22.9068, longitude: -43.1729 }
    },
    churchFrequency: 1,
    personality: {
      extroversion: 3,
      agreeableness: 5,
      conscientiousness: 6,
      spirituality: 6,
      familyOriented: 5
    },
    values: {
      marriageImportance: 5,
      familyImportance: 6,
      careerImportance: 9,
      faithImportance: 7,
      communityImportance: 5
    },
    lifestyle: {
      smokingTolerance: 'socially',
      drinkingTolerance: 'regularly',
      exerciseFrequency: 1,
      socialLevel: 9
    }
  };
  
  describe('calculateCompatibility', () => {
    it('calculates high compatibility for similar users', () => {
      const result = CompatibilityAlgorithm.calculateCompatibility(user1, user2);
      
      // Overall score should be high (>= 80)
      expect(result.overall).toBeGreaterThanOrEqual(80);
      
      // Check that all breakdown categories are present
      expect(result.breakdown).toHaveProperty('demographic');
      expect(result.breakdown).toHaveProperty('religious');
      expect(result.breakdown).toHaveProperty('personality');
      expect(result.breakdown).toHaveProperty('values');
      expect(result.breakdown).toHaveProperty('lifestyle');
      expect(result.breakdown).toHaveProperty('preferences');
      
      // Should have reasons for high compatibility
      expect(result.reasons.length).toBeGreaterThan(0);
      
      // Should have few or no concerns
      expect(result.concerns.length).toBeLessThan(3);
    });
    
    it('calculates lower compatibility for different users', () => {
      const result = CompatibilityAlgorithm.calculateCompatibility(user1, user3);
      
      // Overall score should be lower
      expect(result.overall).toBeLessThan(80);
      
      // Should have concerns
      expect(result.concerns.length).toBeGreaterThan(0);
    });
    
    it('calculates symmetric compatibility (A to B equals B to A)', () => {
      const result1 = CompatibilityAlgorithm.calculateCompatibility(user1, user2);
      const result2 = CompatibilityAlgorithm.calculateCompatibility(user2, user1);
      
      expect(result1.overall).toEqual(result2.overall);
      
      // Check that all breakdown categories have the same scores
      Object.keys(result1.breakdown).forEach(key => {
        expect(result1.breakdown[key]).toEqual(result2.breakdown[key]);
      });
    });
  });
  
  describe('getCompatibilityLevel', () => {
    it('returns "Excepcional" for scores >= 90', () => {
      expect(CompatibilityAlgorithm.getCompatibilityLevel(90)).toBe('Excepcional');
      expect(CompatibilityAlgorithm.getCompatibilityLevel(95)).toBe('Excepcional');
      expect(CompatibilityAlgorithm.getCompatibilityLevel(100)).toBe('Excepcional');
    });
    
    it('returns "Muito Alta" for scores >= 80 and < 90', () => {
      expect(CompatibilityAlgorithm.getCompatibilityLevel(80)).toBe('Muito Alta');
      expect(CompatibilityAlgorithm.getCompatibilityLevel(85)).toBe('Muito Alta');
      expect(CompatibilityAlgorithm.getCompatibilityLevel(89)).toBe('Muito Alta');
    });
    
    it('returns "Alta" for scores >= 70 and < 80', () => {
      expect(CompatibilityAlgorithm.getCompatibilityLevel(70)).toBe('Alta');
      expect(CompatibilityAlgorithm.getCompatibilityLevel(75)).toBe('Alta');
      expect(CompatibilityAlgorithm.getCompatibilityLevel(79)).toBe('Alta');
    });
    
    it('returns "Boa" for scores >= 60 and < 70', () => {
      expect(CompatibilityAlgorithm.getCompatibilityLevel(60)).toBe('Boa');
      expect(CompatibilityAlgorithm.getCompatibilityLevel(65)).toBe('Boa');
      expect(CompatibilityAlgorithm.getCompatibilityLevel(69)).toBe('Boa');
    });
    
    it('returns "Moderada" for scores >= 50 and < 60', () => {
      expect(CompatibilityAlgorithm.getCompatibilityLevel(50)).toBe('Moderada');
      expect(CompatibilityAlgorithm.getCompatibilityLevel(55)).toBe('Moderada');
      expect(CompatibilityAlgorithm.getCompatibilityLevel(59)).toBe('Moderada');
    });
    
    it('returns "Baixa" for scores < 50', () => {
      expect(CompatibilityAlgorithm.getCompatibilityLevel(0)).toBe('Baixa');
      expect(CompatibilityAlgorithm.getCompatibilityLevel(25)).toBe('Baixa');
      expect(CompatibilityAlgorithm.getCompatibilityLevel(49)).toBe('Baixa');
    });
  });
  
  describe('getCompatibilityColor', () => {
    it('returns green for high scores', () => {
      expect(CompatibilityAlgorithm.getCompatibilityColor(85)).toBe('#27AE60');
    });
    
    it('returns yellow for medium scores', () => {
      expect(CompatibilityAlgorithm.getCompatibilityColor(75)).toBe('#F2C94C');
    });
    
    it('returns orange for lower medium scores', () => {
      expect(CompatibilityAlgorithm.getCompatibilityColor(65)).toBe('#F39C12');
    });
    
    it('returns red for low scores', () => {
      expect(CompatibilityAlgorithm.getCompatibilityColor(45)).toBe('#EB5757');
    });
  });
});