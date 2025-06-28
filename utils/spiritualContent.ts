export interface DailyVerse {
  id: string;
  verse: string;
  reference: string;
  theme: string;
  date: string;
  reflection?: string;
  tags: string[];
}

export interface PrayerRequest {
  id: string;
  title: string;
  description: string;
  category: 'personal' | 'family' | 'health' | 'work' | 'relationship' | 'community' | 'world';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  isPrivate: boolean;
  requestedBy: string;
  requestedAt: number;
  prayedBy: string[];
  answered?: boolean;
  answeredAt?: number;
  testimony?: string;
}

export interface PrayerMoment {
  id: string;
  title: string;
  duration: number; // in minutes
  type: 'gratitude' | 'intercession' | 'confession' | 'petition' | 'meditation';
  guide: string[];
  verses?: string[];
  backgroundMusic?: string;
}

export class SpiritualContentManager {
  private static readonly DAILY_VERSES: DailyVerse[] = [
    {
      id: '1',
      verse: 'Porque Deus amou o mundo de tal maneira que deu o seu Filho unigênito, para que todo aquele que nele crê não pereça, mas tenha a vida eterna.',
      reference: 'João 3:16',
      theme: 'Amor de Deus',
      date: '2025-01-01',
      reflection: 'O amor incondicional de Deus é a base de toda nossa fé e esperança.',
      tags: ['amor', 'salvação', 'vida eterna']
    },
    {
      id: '2',
      verse: 'O amor é paciente, o amor é bondoso. Não inveja, não se vangloria, não se orgulha.',
      reference: '1 Coríntios 13:4',
      theme: 'Amor Verdadeiro',
      date: '2025-01-02',
      reflection: 'O amor verdadeiro se manifesta através de ações concretas de paciência e bondade.',
      tags: ['amor', 'relacionamentos', 'caráter']
    },
    {
      id: '3',
      verse: 'Entrega o teu caminho ao Senhor; confia nele, e ele tudo fará.',
      reference: 'Salmos 37:5',
      theme: 'Confiança',
      date: '2025-01-03',
      reflection: 'Quando entregamos nossos planos a Deus, Ele dirige nossos passos.',
      tags: ['confiança', 'direção', 'entrega']
    },
    {
      id: '4',
      verse: 'Mas buscai primeiro o Reino de Deus, e a sua justiça, e todas as coisas vos serão acrescentadas.',
      reference: 'Mateus 6:33',
      theme: 'Prioridades',
      date: '2025-01-04',
      reflection: 'Quando colocamos Deus em primeiro lugar, Ele cuida de todas as nossas necessidades.',
      tags: ['prioridades', 'reino de deus', 'provisão']
    },
    {
      id: '5',
      verse: 'Quem encontra uma esposa encontra algo excelente; recebeu uma bênção do Senhor.',
      reference: 'Provérbios 18:22',
      theme: 'Relacionamentos',
      date: '2025-01-05',
      reflection: 'O casamento é uma bênção divina que deve ser valorizada e cuidada.',
      tags: ['casamento', 'bênção', 'relacionamentos']
    }
  ];

  private static readonly PRAYER_MOMENTS: PrayerMoment[] = [
    {
      id: '1',
      title: 'Oração Matinal',
      duration: 5,
      type: 'gratitude',
      guide: [
        'Comece agradecendo a Deus por mais um dia de vida',
        'Agradeça pelas bênçãos recebidas ontem',
        'Peça direção para as atividades do dia',
        'Ore por suas conexões e relacionamentos',
        'Termine com uma declaração de fé'
      ],
      verses: [
        'Este é o dia que fez o Senhor; regozijemo-nos e alegremo-nos nele. - Salmos 118:24',
        'As misericórdias do Senhor são a causa de não sermos consumidos, porque as suas misericórdias não têm fim. - Lamentações 3:22'
      ]
    },
    {
      id: '2',
      title: 'Oração pelos Relacionamentos',
      duration: 10,
      type: 'intercession',
      guide: [
        'Ore por sabedoria nos relacionamentos',
        'Peça por conexões abençoadas e saudáveis',
        'Interceda por aqueles que ainda buscam um companheiro',
        'Ore pelos casais da sua comunidade',
        'Peça por restauração onde há conflitos',
        'Agradeça pelas amizades e família'
      ],
      verses: [
        'Melhor é serem dois do que um, porque têm melhor paga do seu trabalho. - Eclesiastes 4:9',
        'O que Deus uniu, o homem não separa. - Mateus 19:6'
      ]
    },
    {
      id: '3',
      title: 'Momento de Gratidão',
      duration: 3,
      type: 'gratitude',
      guide: [
        'Liste três coisas pelas quais você é grato hoje',
        'Agradeça por uma pessoa especial em sua vida',
        'Reconheça a bondade de Deus em situações difíceis',
        'Termine com um louvor ao Senhor'
      ],
      verses: [
        'Em tudo dai graças, porque esta é a vontade de Deus em Cristo Jesus para convosco. - 1 Tessalonicenses 5:18'
      ]
    }
  ];

  static getDailyVerse(date?: string): DailyVerse {
    const today = date || new Date().toISOString().split('T')[0];
    const dayOfYear = this.getDayOfYear(today);
    const verseIndex = (dayOfYear - 1) % this.DAILY_VERSES.length;
    
    return {
      ...this.DAILY_VERSES[verseIndex],
      date: today
    };
  }

  static getVersesByTheme(theme: string): DailyVerse[] {
    return this.DAILY_VERSES.filter(verse => 
      verse.theme.toLowerCase().includes(theme.toLowerCase()) ||
      verse.tags.some(tag => tag.toLowerCase().includes(theme.toLowerCase()))
    );
  }

  static getVersesByTag(tag: string): DailyVerse[] {
    return this.DAILY_VERSES.filter(verse => 
      verse.tags.some(t => t.toLowerCase().includes(tag.toLowerCase()))
    );
  }

  static getPrayerMoments(): PrayerMoment[] {
    return this.PRAYER_MOMENTS;
  }

  static getPrayerMomentById(id: string): PrayerMoment | undefined {
    return this.PRAYER_MOMENTS.find(moment => moment.id === id);
  }

  static getPrayerMomentsByType(type: PrayerMoment['type']): PrayerMoment[] {
    return this.PRAYER_MOMENTS.filter(moment => moment.type === type);
  }

  static getRandomVerse(): DailyVerse {
    const randomIndex = Math.floor(Math.random() * this.DAILY_VERSES.length);
    return this.DAILY_VERSES[randomIndex];
  }

  static searchVerses(query: string): DailyVerse[] {
    const searchTerm = query.toLowerCase();
    return this.DAILY_VERSES.filter(verse =>
      verse.verse.toLowerCase().includes(searchTerm) ||
      verse.reference.toLowerCase().includes(searchTerm) ||
      verse.theme.toLowerCase().includes(searchTerm) ||
      verse.tags.some(tag => tag.toLowerCase().includes(searchTerm)) ||
      (verse.reflection && verse.reflection.toLowerCase().includes(searchTerm))
    );
  }

  private static getDayOfYear(dateString: string): number {
    const date = new Date(dateString);
    const start = new Date(date.getFullYear(), 0, 0);
    const diff = date.getTime() - start.getTime();
    return Math.floor(diff / (1000 * 60 * 60 * 24));
  }

  static generatePrayerRequest(
    title: string,
    description: string,
    category: PrayerRequest['category'],
    priority: PrayerRequest['priority'] = 'medium',
    isPrivate: boolean = false,
    requestedBy: string
  ): PrayerRequest {
    return {
      id: Date.now().toString(),
      title,
      description,
      category,
      priority,
      isPrivate,
      requestedBy,
      requestedAt: Date.now(),
      prayedBy: [],
      answered: false
    };
  }

  static getPrayerCategoryIcon(category: PrayerRequest['category']): string {
    const icons = {
      personal: 'user',
      family: 'users',
      health: 'heart',
      work: 'briefcase',
      relationship: 'heart',
      community: 'home',
      world: 'globe'
    };
    return icons[category] || 'star';
  }

  static getPrayerCategoryColor(category: PrayerRequest['category']): string {
    const colors = {
      personal: '#6BBBDD',
      family: '#F498B6',
      health: '#27AE60',
      work: '#F39C12',
      relationship: '#E74C3C',
      community: '#B8A0D9',
      world: '#E6C78C'
    };
    return colors[category] || '#636E72';
  }

  static getPriorityColor(priority: PrayerRequest['priority']): string {
    const colors = {
      low: '#27AE60',
      medium: '#F2C94C',
      high: '#F39C12',
      urgent: '#E74C3C'
    };
    return colors[priority];
  }
}