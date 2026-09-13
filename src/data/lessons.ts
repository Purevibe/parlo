import { LessonNode } from '../types/game';

export const LESSON_NODES: LessonNode[] = [
  {
    id: 'lesson-1',
    category: 'FOOD_ORDERING',
    title: 'Un Caffè a Napoli',
    subtitle: 'Ordering Coffee & Pastries',
    description: 'Complete 5 rapid turns: order coffee, pick pastries, specify sugar, request water, and pay the bill.',
    level: 'A1_BEGINNER',
    difficulty: 'Easy',
    iconName: 'Coffee',
    xpReward: 150,
    targetTurns: 5,
    unlocked: true,
    completed: false,
    samplePhrases: ['Vorrei un espresso, per favore.', 'Un cornetto alla crema.', 'Il conto, per favore.'],
    prompts: [
      "Benvenuto al bar di Napoli! Cosa desideri prendere da bere oggi?",
      "Ottima scelta! Desideri anche qualcosa da mangiare, come un cornetto fresco?",
      "Perfetto! E per il caffè, lo desideri amaro o con lo zucchero?",
      "Ecco a lei! Desidera anche un bicchiere d'acqua naturale?",
      "Fantastico! Ecco tutto. Vuole pagare in contanti o con la carta?"
    ]
  },
  {
    id: 'lesson-2',
    category: 'NUMBERS',
    title: 'I Numeri e il Conto',
    subtitle: 'Prices & Cardinal Numbers',
    description: 'Complete 5 numerical turns: calculate prices, count euros, calculate change, and tell quantities.',
    level: 'A1_BEGINNER',
    difficulty: 'Easy',
    iconName: 'Hash',
    xpReward: 200,
    targetTurns: 5,
    unlocked: true,
    completed: false,
    samplePhrases: ['Sono dieci euro.', 'Venticinque', 'Centoquarantacinque euro'],
    prompts: [
      "Ciao! Iniziamo con i numeri. Quanto fa venticinque più quindici?",
      "Bravissimo! E se compri due pizze da otto euro ciascuna, quanto spendi in totale?",
      "Molto bene! Mi dici in italiano che numero è '145'?",
      "Perfetto! Se mi dai una banconota da cinquanta euro per un conto di trentacinque, quanto resto ti devo?",
      "Eccellente! E per finire: come si dice il numero 1000 in italiano?"
    ]
  },
  {
    id: 'lesson-3',
    category: 'DATES_CALENDAR',
    title: 'Che Ora È?',
    subtitle: 'Time, Days & Calendar',
    description: 'Complete 5 time turns: tell current hours, schedule meetings, state your birth date, and days of week.',
    level: 'A2_ELEMENTARY',
    difficulty: 'Medium',
    iconName: 'Calendar',
    xpReward: 250,
    targetTurns: 5,
    unlocked: true,
    completed: false,
    samplePhrases: ['Sono le otto e mezza.', 'A domani alle quattro!', 'Il quattordici agosto'],
    prompts: [
      "Ciao! Sai dirmi in italiano che ora è adesso se l'orologio segna le 8:30?",
      "Molto bene! Qual è il tuo giorno della settimana preferito e perché?",
      "Perfetto! Se ci vediamo alle 'nove meno venti', a che ora in cifre è il nostro appuntamento?",
      "Bravissimo! In che mese è la tua festa di compleanno?",
      "Eccellente! Che giorno viene subito dopo il giovedì?"
    ]
  },
  {
    id: 'lesson-4',
    category: 'DIRECTIONS',
    title: 'Per la Strada',
    subtitle: 'Asking & Giving Directions',
    description: 'Complete 5 navigation turns: ask for landmarks, turn left/right, find the station, and walk straight.',
    level: 'B1_INTERMEDIATE',
    difficulty: 'Medium',
    iconName: 'Compass',
    xpReward: 300,
    targetTurns: 5,
    unlocked: false,
    completed: false,
    samplePhrases: ['Dov’è la Piazza del Plebiscito?', 'Giri a destra dopo la chiesa.', 'Vada sempre dritto.'],
    prompts: [
      "Scusi! Ci siamo persi nel centro di Napoli. Come arriviamo in Piazza del Plebiscito?",
      "Grazie! E dopo la chiesa dobbiamo girare a destra o a sinistra?",
      "Perfetto! Saprebbe indicarmi dov'è la stazione ferroviaria più vicina?",
      "Molto chiaro! Dobbiamo andare sempre dritto o attraversare la strada?",
      "Grazie mille per l'aiuto! Come si dice 'Have a nice day' in italiano per salutare?"
    ]
  },
  {
    id: 'lesson-5',
    category: 'GENERAL_BANTER',
    title: 'Chiacchierata al Bar',
    subtitle: 'Expressing Opinions & Neapolitan Idioms',
    description: 'Complete 5 banter turns: express opinions, discuss hobbies, use Neapolitan idioms, and joke.',
    level: 'B2_ADVANCED',
    difficulty: 'Hard',
    iconName: 'MessageSquare',
    xpReward: 400,
    targetTurns: 5,
    unlocked: false,
    completed: false,
    samplePhrases: ['Secondo me la pizza margherita è imbattibile!', 'Mettici un punto e a capo.', 'Che bella giornata!'],
    prompts: [
      "Che bella giornata a Napoli! Cosa ami fare durante il tuo tempo libero?",
      "Ah fantastico! E qual è il tuo piatto preferito della cucina italiana?",
      "Concordo in pieno! Hai mai sentito l'espressione neapolitana 'Prendere la vita con filosofia'?",
      "Esatto! Se dovessi descrivere l'Italia in tre parole, quali sceglieresti?",
      "Che bella chiacchierata! Come diciamo in italiano per salutare un caro amico?"
    ]
  }
];
