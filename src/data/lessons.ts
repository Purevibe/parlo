import { LessonNode } from '../types/game';

export const LESSON_NODES: LessonNode[] = [
  {
    id: 'lesson-1',
    category: 'FOOD_ORDERING',
    title: 'Un Caffè a Napoli',
    subtitle: 'Ordering Coffee & Pastries',
    description: 'Master polite bar greetings, ordering espresso, cornetto, and paying at the counter in Naples.',
    level: 'A1_BEGINNER',
    difficulty: 'Easy',
    iconName: 'Coffee',
    xpReward: 150,
    unlocked: true,
    completed: false,
    samplePhrases: ['Vorrei un espresso, per favore.', 'Un cornetto alla crema.', 'Quanto costa?']
  },
  {
    id: 'lesson-2',
    category: 'NUMBERS',
    title: 'I Numeri e il Conto',
    subtitle: 'Prices & Cardinal Numbers',
    description: 'Learn cardinal numbers from 1 to 1000, calculating prices, euro amounts, and change.',
    level: 'A1_BEGINNER',
    difficulty: 'Easy',
    iconName: 'Hash',
    xpReward: 200,
    unlocked: true,
    completed: false,
    samplePhrases: ['Sono dieci euro.', 'Venticinque', 'Centoquarantacinque euro']
  },
  {
    id: 'lesson-3',
    category: 'DATES_CALENDAR',
    title: 'Che Ora È?',
    subtitle: 'Time, Days & Calendar',
    description: 'Practice telling the time, days of the week, scheduling appointments, and train departures.',
    level: 'A2_ELEMENTARY',
    difficulty: 'Medium',
    iconName: 'Calendar',
    xpReward: 250,
    unlocked: true,
    completed: false,
    samplePhrases: ['Sono le otto e mezza.', 'A domani alle quattro!', 'Il quattordici agosto']
  },
  {
    id: 'lesson-4',
    category: 'DIRECTIONS',
    title: 'Per la Strada',
    subtitle: 'Asking & Giving Directions',
    description: 'Navigate Neapolitan streets, ask locals for landmarks, turn left/right, and find the piazza.',
    level: 'B1_INTERMEDIATE',
    difficulty: 'Medium',
    iconName: 'Compass',
    xpReward: 300,
    unlocked: false,
    completed: false,
    samplePhrases: ['Dov’è la Piazza del Plebiscito?', 'Giri a destra dopo la chiesa.', 'Vada sempre dritto.']
  },
  {
    id: 'lesson-5',
    category: 'GENERAL_BANTER',
    title: 'Chiacchierata al Bar',
    subtitle: 'Expressing Opinions & Neapolitan Idioms',
    description: 'Engage in lively Italian dialogue, express personal preferences, and use authentic Neapolitan idioms (*modi di dire*).',
    level: 'B2_ADVANCED',
    difficulty: 'Hard',
    iconName: 'MessageSquare',
    xpReward: 400,
    unlocked: false,
    completed: false,
    samplePhrases: ['Secondo me la pizza margherita è imbattibile!', 'Mettici un punto e a capo.', 'Che bella giornata!']
  }
];
