export interface Achievement {
  id: string;
  title: string;
  description: string;
  category: 'prayer' | 'reading' | 'community' | 'service' | 'growth' | 'connection';
  type: 'milestone' | 'streak' | 'challenge' | 'special';
  icon: string;
  color: string;
  points: number;
  requirement: {
    type: 'count' | 'streak' | 'time' | 'special';
    target: number;
    timeframe?: 'daily' | 'weekly' | 'monthly' | 'yearly';
  };
  unlocked: boolean;
  unlockedAt?: number;
  progress: number;
  verse?: string;
  blessing?: string;
}

export interface Level {
  level: number;
  title: string;
  description: string;
  minPoints: number;
  maxPoints: number;
  icon: string;
  color: string;
  blessings: string[];
  verse: string;
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  category: 'daily' | 'weekly' | 'monthly' | 'seasonal' | 'special';
  difficulty: 'easy' | 'medium' | 'hard' | 'legendary';
  startDate: number;
  endDate: number;
  tasks: ChallengeTask[];
  rewards: Reward[];
  participants: number;
  completed: boolean;
  progress: number;
  verse: string;
}

export interface ChallengeTask {
  id: string;
  title: string;
  description: string;
  type: 'prayer' | 'reading' | 'service' | 'connection' | 'sharing';
  target: number;
  progress: number;
  completed: boolean;
}

export interface Reward {
  type: 'points' | 'badge' | 'title' | 'blessing' | 'feature';
  value: string | number;
  description: string;
}

export interface UserStats {
  totalPoints: number;
  currentLevel: number;
  prayerMinutes: number;
  versesRead: number;
  connectionsHelped: number;
  challengesCompleted: number;
  streaks: {
    prayer: number;
    reading: number;
    community: number;
  };
  achievements: string[];
  titles: string[];
  currentTitle?: string;
}

export class GamificationSystem {
  private static readonly LEVELS: Level[] = [
    {
      level: 1,
      title: 'Novo Convertido',
      description: 'Iniciando sua jornada de fé',
      minPoints: 0,
      maxPoints: 99,
      icon: 'seedling',
      color: '#27AE60',
      blessings: ['Acesso ao sistema de oração', 'Versículo diário personalizado'],
      verse: 'Portanto, se alguém está em Cristo, é nova criação. 2 Coríntios 5:17'
    },
    {
      level: 2,
      title: 'Discípulo Dedicado',
      description: 'Crescendo em conhecimento e fé',
      minPoints: 100,
      maxPoints: 299,
      icon: 'book-open',
      color: '#6BBBDD',
      blessings: ['Desafios semanais desbloqueados', 'Histórico de orações'],
      verse: 'Lâmpada para os meus pés é a tua palavra e luz para os meus caminhos. Salmos 119:105'
    },
    {
      level: 3,
      title: 'Servo Fiel',
      description: 'Servindo com amor e dedicação',
      minPoints: 300,
      maxPoints: 599,
      icon: 'heart',
      color: '#F498B6',
      blessings: ['Grupos de oração', 'Mentoria espiritual'],
      verse: 'Servi uns aos outros mediante o dom que cada um recebeu. 1 Pedro 4:10'
    },
    {
      level: 4,
      title: 'Intercessor Poderoso',
      description: 'Guerreiro de oração e intercessão',
      minPoints: 600,
      maxPoints: 999,
      icon: 'shield',
      color: '#B8A0D9',
      blessings: ['Círculo de intercessão', 'Orações especiais'],
      verse: 'A oração do justo é poderosa e eficaz. Tiago 5:16'
    },
    {
      level: 5,
      title: 'Líder Espiritual',
      description: 'Guiando outros no caminho da fé',
      minPoints: 1000,
      maxPoints: 1999,
      icon: 'crown',
      color: '#E6C78C',
      blessings: ['Criação de grupos', 'Eventos especiais'],
      verse: 'Sede meus imitadores, como também eu sou de Cristo. 1 Coríntios 11:1'
    },
    {
      level: 6,
      title: 'Embaixador de Cristo',
      description: 'Representando Cristo em todas as áreas',
      minPoints: 2000,
      maxPoints: 4999,
      icon: 'globe',
      color: '#F39C12',
      blessings: ['Missões especiais', 'Acesso VIP'],
      verse: 'Somos embaixadores de Cristo. 2 Coríntios 5:20'
    },
    {
      level: 7,
      title: 'Ancião Sábio',
      description: 'Maturidade espiritual e sabedoria',
      minPoints: 5000,
      maxPoints: 9999,
      icon: 'tree',
      color: '#8E44AD',
      blessings: ['Conselho espiritual', 'Biblioteca premium'],
      verse: 'A coroa dos velhos são os cabelos brancos. Provérbios 16:31'
    },
    {
      level: 8,
      title: 'Apóstolo Moderno',
      description: 'Plantando igrejas e fazendo discípulos',
      minPoints: 10000,
      maxPoints: 19999,
      icon: 'users',
      color: '#E74C3C',
      blessings: ['Rede apostólica', 'Recursos exclusivos'],
      verse: 'Ide, portanto, fazei discípulos de todas as nações. Mateus 28:19'
    },
    {
      level: 9,
      title: 'Profeta do Altíssimo',
      description: 'Voz profética para esta geração',
      minPoints: 20000,
      maxPoints: 49999,
      icon: 'zap',
      color: '#9B59B6',
      blessings: ['Palavra profética', 'Revelações especiais'],
      verse: 'Não desprezeis as profecias. 1 Tessalonicenses 5:20'
    },
    {
      level: 10,
      title: 'Santo do Altíssimo',
      description: 'Santidade e comunhão íntima com Deus',
      minPoints: 50000,
      maxPoints: Infinity,
      icon: 'star',
      color: '#FFD700',
      blessings: ['Todas as bênçãos desbloqueadas', 'Legado eterno'],
      verse: 'Sede santos, porque eu sou santo. 1 Pedro 1:16'
    }
  ];

  private static readonly ACHIEVEMENTS: Achievement[] = [
    // Prayer Achievements
    {
      id: 'first_prayer',
      title: 'Primeira Oração',
      description: 'Complete sua primeira sessão de oração',
      category: 'prayer',
      type: 'milestone',
      icon: 'praying-hands',
      color: '#6BBBDD',
      points: 10,
      requirement: { type: 'count', target: 1 },
      unlocked: false,
      progress: 0,
      verse: 'Orai sem cessar. 1 Tessalonicenses 5:17',
      blessing: 'Que suas orações sejam como incenso diante do Senhor'
    },
    {
      id: 'prayer_warrior',
      title: 'Guerreiro de Oração',
      description: 'Complete 100 minutos de oração',
      category: 'prayer',
      type: 'milestone',
      icon: 'shield',
      color: '#B8A0D9',
      points: 50,
      requirement: { type: 'time', target: 100 },
      unlocked: false,
      progress: 0,
      verse: 'A oração do justo é poderosa e eficaz. Tiago 5:16'
    },
    {
      id: 'prayer_streak_7',
      title: 'Semana de Oração',
      description: 'Ore por 7 dias consecutivos',
      category: 'prayer',
      type: 'streak',
      icon: 'calendar',
      color: '#27AE60',
      points: 30,
      requirement: { type: 'streak', target: 7, timeframe: 'daily' },
      unlocked: false,
      progress: 0,
      verse: 'Perseverai na oração. Colossenses 4:2'
    },
    
    // Reading Achievements
    {
      id: 'first_verse',
      title: 'Primeira Leitura',
      description: 'Leia seu primeiro versículo do dia',
      category: 'reading',
      type: 'milestone',
      icon: 'book',
      color: '#F498B6',
      points: 10,
      requirement: { type: 'count', target: 1 },
      unlocked: false,
      progress: 0,
      verse: 'Lâmpada para os meus pés é a tua palavra. Salmos 119:105'
    },
    {
      id: 'verse_collector',
      title: 'Colecionador de Versículos',
      description: 'Leia 50 versículos',
      category: 'reading',
      type: 'milestone',
      icon: 'library',
      color: '#E6C78C',
      points: 40,
      requirement: { type: 'count', target: 50 },
      unlocked: false,
      progress: 0,
      verse: 'Escondi a tua palavra no meu coração. Salmos 119:11'
    },
    
    // Community Achievements
    {
      id: 'first_connection',
      title: 'Primeira Conexão',
      description: 'Faça sua primeira conexão abençoada',
      category: 'connection',
      type: 'milestone',
      icon: 'heart',
      color: '#F498B6',
      points: 20,
      requirement: { type: 'count', target: 1 },
      unlocked: false,
      progress: 0,
      verse: 'Melhor é serem dois do que um. Eclesiastes 4:9'
    },
    {
      id: 'community_helper',
      title: 'Ajudador da Comunidade',
      description: 'Ore por 10 pedidos da comunidade',
      category: 'community',
      type: 'milestone',
      icon: 'users',
      color: '#27AE60',
      points: 35,
      requirement: { type: 'count', target: 10 },
      unlocked: false,
      progress: 0,
      verse: 'Levai as cargas uns dos outros. Gálatas 6:2'
    },
    
    // Service Achievements
    {
      id: 'servant_heart',
      title: 'Coração de Servo',
      description: 'Complete 5 atos de serviço',
      category: 'service',
      type: 'milestone',
      icon: 'hand-heart',
      color: '#E74C3C',
      points: 25,
      requirement: { type: 'count', target: 5 },
      unlocked: false,
      progress: 0,
      verse: 'Servi uns aos outros. 1 Pedro 4:10'
    },
    
    // Growth Achievements
    {
      id: 'level_up',
      title: 'Crescimento Espiritual',
      description: 'Alcance o nível 2',
      category: 'growth',
      type: 'milestone',
      icon: 'trending-up',
      color: '#9B59B6',
      points: 0,
      requirement: { type: 'special', target: 2 },
      unlocked: false,
      progress: 0,
      verse: 'Crescei na graça e no conhecimento. 2 Pedro 3:18'
    },
    
    // Special Achievements
    {
      id: 'christmas_blessing',
      title: 'Bênção de Natal',
      description: 'Participe do evento especial de Natal',
      category: 'growth',
      type: 'special',
      icon: 'gift',
      color: '#E74C3C',
      points: 100,
      requirement: { type: 'special', target: 1 },
      unlocked: false,
      progress: 0,
      verse: 'Porque nos nasceu um menino. Isaías 9:6'
    }
  ];

  private static readonly CHALLENGES: Challenge[] = [
    {
      id: 'daily_devotion',
      title: 'Devoção Diária',
      description: 'Complete sua devoção por 7 dias seguidos',
      category: 'daily',
      difficulty: 'easy',
      startDate: Date.now(),
      endDate: Date.now() + (7 * 24 * 60 * 60 * 1000),
      tasks: [
        {
          id: 'read_verse',
          title: 'Ler Versículo',
          description: 'Leia o versículo do dia',
          type: 'reading',
          target: 7,
          progress: 0,
          completed: false
        },
        {
          id: 'pray_5min',
          title: 'Orar 5 Minutos',
          description: 'Dedique 5 minutos à oração',
          type: 'prayer',
          target: 7,
          progress: 0,
          completed: false
        }
      ],
      rewards: [
        { type: 'points', value: 50, description: '50 pontos de experiência' },
        { type: 'badge', value: 'devotion_master', description: 'Distintivo Mestre da Devoção' }
      ],
      participants: 1247,
      completed: false,
      progress: 0,
      verse: 'Buscai primeiro o Reino de Deus. Mateus 6:33'
    },
    {
      id: 'prayer_week',
      title: 'Semana de Oração',
      description: 'Dedique 30 minutos de oração esta semana',
      category: 'weekly',
      difficulty: 'medium',
      startDate: Date.now(),
      endDate: Date.now() + (7 * 24 * 60 * 60 * 1000),
      tasks: [
        {
          id: 'prayer_30min',
          title: 'Oração Profunda',
          description: 'Complete 30 minutos de oração',
          type: 'prayer',
          target: 30,
          progress: 0,
          completed: false
        }
      ],
      rewards: [
        { type: 'points', value: 75, description: '75 pontos de experiência' },
        { type: 'title', value: 'Intercessor', description: 'Título: Intercessor' }
      ],
      participants: 892,
      completed: false,
      progress: 0,
      verse: 'Orai uns pelos outros. Tiago 5:16'
    },
    {
      id: 'community_love',
      title: 'Amor Comunitário',
      description: 'Ajude 5 pessoas da comunidade esta semana',
      category: 'weekly',
      difficulty: 'medium',
      startDate: Date.now(),
      endDate: Date.now() + (7 * 24 * 60 * 60 * 1000),
      tasks: [
        {
          id: 'pray_for_others',
          title: 'Orar por Outros',
          description: 'Ore por 5 pedidos da comunidade',
          type: 'service',
          target: 5,
          progress: 0,
          completed: false
        },
        {
          id: 'encourage_others',
          title: 'Encorajar',
          description: 'Envie mensagens de encorajamento',
          type: 'connection',
          target: 3,
          progress: 0,
          completed: false
        }
      ],
      rewards: [
        { type: 'points', value: 100, description: '100 pontos de experiência' },
        { type: 'blessing', value: 'community_heart', description: 'Bênção do Coração Comunitário' }
      ],
      participants: 634,
      completed: false,
      progress: 0,
      verse: 'Amai-vos uns aos outros. João 13:34'
    }
  ];

  static getLevelByPoints(points: number): Level {
    return this.LEVELS.find(level => 
      points >= level.minPoints && points <= level.maxPoints
    ) || this.LEVELS[0];
  }

  static getNextLevel(currentLevel: number): Level | null {
    return this.LEVELS.find(level => level.level === currentLevel + 1) || null;
  }

  static getProgressToNextLevel(points: number, currentLevel: number): number {
    const nextLevel = this.getNextLevel(currentLevel);
    if (!nextLevel) return 100;
    
    const currentLevelData = this.LEVELS.find(l => l.level === currentLevel);
    if (!currentLevelData) return 0;
    
    const pointsInCurrentLevel = points - currentLevelData.minPoints;
    const pointsNeededForNext = nextLevel.minPoints - currentLevelData.minPoints;
    
    return Math.min(100, (pointsInCurrentLevel / pointsNeededForNext) * 100);
  }

  static calculatePoints(action: string, value: number = 1): number {
    const pointsMap = {
      'prayer_minute': 2,
      'verse_read': 5,
      'prayer_request': 10,
      'community_prayer': 8,
      'challenge_complete': 25,
      'daily_streak': 15,
      'connection_made': 20,
      'event_attend': 30,
      'testimony_share': 40,
      'mentor_session': 50
    };
    
    return (pointsMap[action] || 1) * value;
  }

  static checkAchievements(userStats: UserStats, action: string, value: number = 1): Achievement[] {
    const unlockedAchievements: Achievement[] = [];
    
    this.ACHIEVEMENTS.forEach(achievement => {
      if (achievement.unlocked) return;
      
      let shouldUnlock = false;
      
      switch (achievement.id) {
        case 'first_prayer':
          shouldUnlock = action === 'prayer_complete' && value >= 1;
          break;
        case 'prayer_warrior':
          shouldUnlock = userStats.prayerMinutes >= 100;
          break;
        case 'prayer_streak_7':
          shouldUnlock = userStats.streaks.prayer >= 7;
          break;
        case 'first_verse':
          shouldUnlock = action === 'verse_read' && value >= 1;
          break;
        case 'verse_collector':
          shouldUnlock = userStats.versesRead >= 50;
          break;
        case 'first_connection':
          shouldUnlock = action === 'connection_made' && value >= 1;
          break;
        case 'community_helper':
          shouldUnlock = userStats.connectionsHelped >= 10;
          break;
        case 'servant_heart':
          shouldUnlock = action === 'service_complete' && userStats.connectionsHelped >= 5;
          break;
        case 'level_up':
          shouldUnlock = userStats.currentLevel >= 2;
          break;
      }
      
      if (shouldUnlock) {
        achievement.unlocked = true;
        achievement.unlockedAt = Date.now();
        achievement.progress = 100;
        unlockedAchievements.push(achievement);
      }
    });
    
    return unlockedAchievements;
  }

  static getActiveChallenge(): Challenge | null {
    const now = Date.now();
    return this.CHALLENGES.find(challenge => 
      challenge.startDate <= now && 
      challenge.endDate >= now && 
      !challenge.completed
    ) || null;
  }

  static updateChallengeProgress(challengeId: string, taskId: string, progress: number): boolean {
    const challenge = this.CHALLENGES.find(c => c.id === challengeId);
    if (!challenge) return false;
    
    const task = challenge.tasks.find(t => t.id === taskId);
    if (!task) return false;
    
    task.progress = Math.min(task.target, task.progress + progress);
    task.completed = task.progress >= task.target;
    
    // Update overall challenge progress
    const totalTasks = challenge.tasks.length;
    const completedTasks = challenge.tasks.filter(t => t.completed).length;
    challenge.progress = (completedTasks / totalTasks) * 100;
    challenge.completed = completedTasks === totalTasks;
    
    return challenge.completed;
  }

  static getAchievementsByCategory(category: Achievement['category']): Achievement[] {
    return this.ACHIEVEMENTS.filter(achievement => achievement.category === category);
  }

  static getUnlockedAchievements(): Achievement[] {
    return this.ACHIEVEMENTS.filter(achievement => achievement.unlocked);
  }

  static getChallengesByDifficulty(difficulty: Challenge['difficulty']): Challenge[] {
    return this.CHALLENGES.filter(challenge => challenge.difficulty === difficulty);
  }

  static generateDailyChallenge(): Challenge {
    const dailyChallenges = [
      {
        title: 'Momento de Gratidão',
        description: 'Liste 3 coisas pelas quais você é grato hoje',
        tasks: [
          {
            id: 'gratitude_prayer',
            title: 'Oração de Gratidão',
            description: 'Dedique 3 minutos agradecendo a Deus',
            type: 'prayer' as const,
            target: 3,
            progress: 0,
            completed: false
          }
        ],
        verse: 'Em tudo dai graças. 1 Tessalonicenses 5:18'
      },
      {
        title: 'Palavra de Encorajamento',
        description: 'Envie uma mensagem de encorajamento para alguém',
        tasks: [
          {
            id: 'encourage_someone',
            title: 'Encorajar Alguém',
            description: 'Envie uma mensagem positiva',
            type: 'connection' as const,
            target: 1,
            progress: 0,
            completed: false
          }
        ],
        verse: 'Encorajai-vos uns aos outros. 1 Tessalonicenses 5:11'
      }
    ];
    
    const randomChallenge = dailyChallenges[Math.floor(Math.random() * dailyChallenges.length)];
    
    return {
      id: `daily_${Date.now()}`,
      category: 'daily',
      difficulty: 'easy',
      startDate: Date.now(),
      endDate: Date.now() + (24 * 60 * 60 * 1000),
      rewards: [
        { type: 'points', value: 25, description: '25 pontos de experiência' }
      ],
      participants: Math.floor(Math.random() * 500) + 100,
      completed: false,
      progress: 0,
      ...randomChallenge
    };
  }

  static getAllLevels(): Level[] {
    return this.LEVELS;
  }

  static getAllAchievements(): Achievement[] {
    return this.ACHIEVEMENTS;
  }

  static getAllChallenges(): Challenge[] {
    return this.CHALLENGES;
  }
}