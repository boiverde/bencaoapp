export interface UserProfile {
  id: string;
  name: string;
  age: number;
  denomination: string;
  location: {
    state: string;
    city: string;
    coordinates?: {
      latitude: number;
      longitude: number;
    };
  };
  languages: string[];
  interests: string[];
  education: string;
  churchFrequency: number;
  children: number;
  height: number;
  zodiacSign: string;
  favoriteWorship: string;
  aboutMe: string;
  verse: string;
  photos: string[];
  preferences: {
    ageRange: [number, number];
    maxDistance: number;
    denominations: string[];
    education: string[];
    children: string;
    languages: string[];
  };
  personality: {
    extroversion: number; // 1-10
    agreeableness: number; // 1-10
    conscientiousness: number; // 1-10
    spirituality: number; // 1-10
    familyOriented: number; // 1-10
  };
  values: {
    marriageImportance: number; // 1-10
    familyImportance: number; // 1-10
    careerImportance: number; // 1-10
    faithImportance: number; // 1-10
    communityImportance: number; // 1-10
  };
  lifestyle: {
    smokingTolerance: 'never' | 'socially' | 'regularly' | 'no-preference';
    drinkingTolerance: 'never' | 'socially' | 'regularly' | 'no-preference';
    exerciseFrequency: number; // 1-7 days per week
    socialLevel: number; // 1-10
  };
}

export interface CompatibilityScore {
  overall: number;
  breakdown: {
    demographic: number;
    religious: number;
    personality: number;
    values: number;
    lifestyle: number;
    preferences: number;
  };
  reasons: string[];
  concerns: string[];
}

export class CompatibilityAlgorithm {
  private static readonly WEIGHTS = {
    demographic: 0.15,
    religious: 0.25,
    personality: 0.20,
    values: 0.25,
    lifestyle: 0.10,
    preferences: 0.05,
  };

  static calculateCompatibility(user1: UserProfile, user2: UserProfile): CompatibilityScore {
    const demographic = this.calculateDemographicCompatibility(user1, user2);
    const religious = this.calculateReligiousCompatibility(user1, user2);
    const personality = this.calculatePersonalityCompatibility(user1, user2);
    const values = this.calculateValuesCompatibility(user1, user2);
    const lifestyle = this.calculateLifestyleCompatibility(user1, user2);
    const preferences = this.calculatePreferencesCompatibility(user1, user2);

    const overall = Math.round(
      demographic * this.WEIGHTS.demographic +
      religious * this.WEIGHTS.religious +
      personality * this.WEIGHTS.personality +
      values * this.WEIGHTS.values +
      lifestyle * this.WEIGHTS.lifestyle +
      preferences * this.WEIGHTS.preferences
    );

    const reasons = this.generateReasons(user1, user2, {
      demographic,
      religious,
      personality,
      values,
      lifestyle,
      preferences,
    });

    const concerns = this.generateConcerns(user1, user2, {
      demographic,
      religious,
      personality,
      values,
      lifestyle,
      preferences,
    });

    return {
      overall,
      breakdown: {
        demographic,
        religious,
        personality,
        values,
        lifestyle,
        preferences,
      },
      reasons,
      concerns,
    };
  }

  private static calculateDemographicCompatibility(user1: UserProfile, user2: UserProfile): number {
    let score = 0;
    let factors = 0;

    // Age compatibility
    const ageDiff = Math.abs(user1.age - user2.age);
    if (ageDiff <= 2) score += 100;
    else if (ageDiff <= 5) score += 80;
    else if (ageDiff <= 10) score += 60;
    else if (ageDiff <= 15) score += 40;
    else score += 20;
    factors++;

    // Location compatibility
    if (user1.location.city === user2.location.city) {
      score += 100;
    } else if (user1.location.state === user2.location.state) {
      score += 70;
    } else {
      score += 30;
    }
    factors++;

    // Education compatibility
    const educationLevels = [
      'Ensino Fundamental',
      'Ensino Médio',
      'Ensino Técnico',
      'Graduação',
      'Pós-graduação',
      'Mestrado',
      'Doutorado'
    ];
    
    const user1EducIndex = educationLevels.indexOf(user1.education);
    const user2EducIndex = educationLevels.indexOf(user2.education);
    const educDiff = Math.abs(user1EducIndex - user2EducIndex);
    
    if (educDiff === 0) score += 100;
    else if (educDiff === 1) score += 80;
    else if (educDiff === 2) score += 60;
    else score += 40;
    factors++;

    // Language compatibility
    const commonLanguages = user1.languages.filter(lang => 
      user2.languages.includes(lang)
    );
    const languageScore = Math.min(100, (commonLanguages.length / Math.max(user1.languages.length, user2.languages.length)) * 100);
    score += languageScore;
    factors++;

    return Math.round(score / factors);
  }

  private static calculateReligiousCompatibility(user1: UserProfile, user2: UserProfile): number {
    let score = 0;
    let factors = 0;

    // Denomination compatibility
    if (user1.denomination === user2.denomination) {
      score += 100;
    } else {
      // Check if denominations are compatible (e.g., both Protestant)
      const protestantDenominations = ['Batista', 'Presbiteriana', 'Metodista', 'Pentecostal', 'Assembleia de Deus'];
      const user1Protestant = protestantDenominations.includes(user1.denomination);
      const user2Protestant = protestantDenominations.includes(user2.denomination);
      
      if (user1Protestant && user2Protestant) {
        score += 80;
      } else {
        score += 40;
      }
    }
    factors++;

    // Church frequency compatibility
    const frequencyDiff = Math.abs(user1.churchFrequency - user2.churchFrequency);
    if (frequencyDiff === 0) score += 100;
    else if (frequencyDiff === 1) score += 80;
    else if (frequencyDiff === 2) score += 60;
    else score += 40;
    factors++;

    // Faith importance compatibility
    const faithDiff = Math.abs(user1.values.faithImportance - user2.values.faithImportance);
    score += Math.max(0, 100 - (faithDiff * 10));
    factors++;

    return Math.round(score / factors);
  }

  private static calculatePersonalityCompatibility(user1: UserProfile, user2: UserProfile): number {
    let score = 0;
    let factors = 0;

    // Complementary vs similar personality traits
    const traits = ['extroversion', 'agreeableness', 'conscientiousness', 'spirituality', 'familyOriented'];
    
    traits.forEach(trait => {
      const diff = Math.abs(user1.personality[trait] - user2.personality[trait]);
      
      // For some traits, similarity is better (spirituality, conscientiousness)
      if (trait === 'spirituality' || trait === 'conscientiousness' || trait === 'familyOriented') {
        score += Math.max(0, 100 - (diff * 10));
      } else {
        // For others, moderate difference can be good (complementary)
        if (diff <= 2) score += 100;
        else if (diff <= 4) score += 80;
        else if (diff <= 6) score += 60;
        else score += 40;
      }
      factors++;
    });

    return Math.round(score / factors);
  }

  private static calculateValuesCompatibility(user1: UserProfile, user2: UserProfile): number {
    let score = 0;
    let factors = 0;

    const values = ['marriageImportance', 'familyImportance', 'careerImportance', 'faithImportance', 'communityImportance'];
    
    values.forEach(value => {
      const diff = Math.abs(user1.values[value] - user2.values[value]);
      score += Math.max(0, 100 - (diff * 10));
      factors++;
    });

    return Math.round(score / factors);
  }

  private static calculateLifestyleCompatibility(user1: UserProfile, user2: UserProfile): number {
    let score = 0;
    let factors = 0;

    // Smoking tolerance
    if (user1.lifestyle.smokingTolerance === user2.lifestyle.smokingTolerance) {
      score += 100;
    } else if (
      (user1.lifestyle.smokingTolerance === 'no-preference') ||
      (user2.lifestyle.smokingTolerance === 'no-preference')
    ) {
      score += 70;
    } else {
      score += 30;
    }
    factors++;

    // Drinking tolerance
    if (user1.lifestyle.drinkingTolerance === user2.lifestyle.drinkingTolerance) {
      score += 100;
    } else if (
      (user1.lifestyle.drinkingTolerance === 'no-preference') ||
      (user2.lifestyle.drinkingTolerance === 'no-preference')
    ) {
      score += 70;
    } else {
      score += 30;
    }
    factors++;

    // Exercise frequency
    const exerciseDiff = Math.abs(user1.lifestyle.exerciseFrequency - user2.lifestyle.exerciseFrequency);
    if (exerciseDiff <= 1) score += 100;
    else if (exerciseDiff <= 2) score += 80;
    else if (exerciseDiff <= 3) score += 60;
    else score += 40;
    factors++;

    // Social level
    const socialDiff = Math.abs(user1.lifestyle.socialLevel - user2.lifestyle.socialLevel);
    score += Math.max(0, 100 - (socialDiff * 10));
    factors++;

    return Math.round(score / factors);
  }

  private static calculatePreferencesCompatibility(user1: UserProfile, user2: UserProfile): number {
    let score = 0;
    let factors = 0;

    // Age preference match
    const user1InUser2Range = user1.age >= user2.preferences.ageRange[0] && user1.age <= user2.preferences.ageRange[1];
    const user2InUser1Range = user2.age >= user1.preferences.ageRange[0] && user2.age <= user1.preferences.ageRange[1];
    
    if (user1InUser2Range && user2InUser1Range) score += 100;
    else if (user1InUser2Range || user2InUser1Range) score += 70;
    else score += 30;
    factors++;

    // Denomination preference match
    const user1DenomMatch = user2.preferences.denominations.includes('Todas') || 
                           user2.preferences.denominations.includes(user1.denomination);
    const user2DenomMatch = user1.preferences.denominations.includes('Todas') || 
                           user1.preferences.denominations.includes(user2.denomination);
    
    if (user1DenomMatch && user2DenomMatch) score += 100;
    else if (user1DenomMatch || user2DenomMatch) score += 70;
    else score += 30;
    factors++;

    return Math.round(score / factors);
  }

  private static generateReasons(user1: UserProfile, user2: UserProfile, scores: any): string[] {
    const reasons: string[] = [];

    if (scores.religious >= 80) {
      if (user1.denomination === user2.denomination) {
        reasons.push(`Vocês compartilham a mesma denominação: ${user1.denomination}`);
      }
      if (Math.abs(user1.churchFrequency - user2.churchFrequency) <= 1) {
        reasons.push('Frequência similar na igreja');
      }
    }

    if (scores.values >= 80) {
      reasons.push('Valores de vida muito alinhados');
    }

    if (scores.demographic >= 80) {
      if (user1.location.city === user2.location.city) {
        reasons.push(`Vocês moram na mesma cidade: ${user1.location.city}`);
      }
      const commonLanguages = user1.languages.filter(lang => user2.languages.includes(lang));
      if (commonLanguages.length > 1) {
        reasons.push(`Idiomas em comum: ${commonLanguages.join(', ')}`);
      }
    }

    if (scores.personality >= 80) {
      reasons.push('Personalidades complementares');
    }

    const commonInterests = user1.interests.filter(interest => user2.interests.includes(interest));
    if (commonInterests.length >= 3) {
      reasons.push(`Interesses em comum: ${commonInterests.slice(0, 3).join(', ')}`);
    }

    return reasons;
  }

  private static generateConcerns(user1: UserProfile, user2: UserProfile, scores: any): string[] {
    const concerns: string[] = [];

    if (scores.religious < 60) {
      if (user1.denomination !== user2.denomination) {
        concerns.push('Denominações diferentes podem gerar desafios');
      }
    }

    if (scores.values < 60) {
      concerns.push('Diferenças significativas nos valores de vida');
    }

    const ageDiff = Math.abs(user1.age - user2.age);
    if (ageDiff > 10) {
      concerns.push(`Diferença de idade considerável: ${ageDiff} anos`);
    }

    if (user1.location.state !== user2.location.state) {
      concerns.push('Distância geográfica pode ser um desafio');
    }

    if (scores.lifestyle < 60) {
      concerns.push('Estilos de vida diferentes');
    }

    return concerns;
  }

  static getCompatibilityLevel(score: number): string {
    if (score >= 90) return 'Excepcional';
    if (score >= 80) return 'Muito Alta';
    if (score >= 70) return 'Alta';
    if (score >= 60) return 'Boa';
    if (score >= 50) return 'Moderada';
    return 'Baixa';
  }

  static getCompatibilityColor(score: number): string {
    if (score >= 80) return '#27AE60'; // Green
    if (score >= 70) return '#F2C94C'; // Yellow
    if (score >= 60) return '#F39C12'; // Orange
    return '#EB5757'; // Red
  }
}