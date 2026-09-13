export interface RawOption {
  label: string;
  isCorrect: boolean;
  explanation: string;
}

export interface RawQuestion {
  id: number;
  category: 'CONVERSATION' | 'FOOD' | 'NUMBERS' | 'TIME' | 'DIRECTIONS' | 'GRAMMAR';
  questionText: string;
  options: RawOption[];
}

export const DIAGNOSTIC_QUESTION_POOL: RawQuestion[] = [
  // Conversation & Greetings
  {
    id: 1,
    category: 'CONVERSATION',
    questionText: "Choose the most natural way to say 'Pleased to meet you' in Italian:",
    options: [
      { label: "Piacere di conoscerti", isCorrect: true, explanation: "Standard polite greeting used throughout Italy." },
      { label: "Molto bene grazie", isCorrect: false, explanation: "Means 'Very well, thank you'." },
      { label: "Come ti chiami?", isCorrect: false, explanation: "Means 'What is your name?'." },
      { label: "Per favore ciao", isCorrect: false, explanation: "Literal translation mashup." },
    ]
  },
  {
    id: 2,
    category: 'CONVERSATION',
    questionText: "How do you ask 'How are you?' informally to a friend in Italian?",
    options: [
      { label: "Come stai?", isCorrect: true, explanation: "'Come stai?' is informal; 'Come sta?' is formal." },
      { label: "Di dove sei?", isCorrect: false, explanation: "Means 'Where are you from?'." },
      { label: "Quanti anni hai?", isCorrect: false, explanation: "Means 'How old are you?'." },
      { label: "Buonasera a tutti", isCorrect: false, explanation: "Means 'Good evening everyone'." },
    ]
  },
  {
    id: 3,
    category: 'CONVERSATION',
    questionText: "What does the common phrase 'Ci vediamo dopo!' mean?",
    options: [
      { label: "See you later!", isCorrect: true, explanation: "'Dopo' means later; 'Ci vediamo' means we'll see each other." },
      { label: "Nice to meet you!", isCorrect: false, explanation: "That would be 'Piacere'." },
      { label: "Where is the bathroom?", isCorrect: false, explanation: "That would be 'Dov'è il bagno?'." },
      { label: "Good morning!", isCorrect: false, explanation: "That is 'Buongiorno'." },
    ]
  },
  {
    id: 4,
    category: 'CONVERSATION',
    questionText: "How do you respond politely when someone says 'Grazie'?",
    options: [
      { label: "Prego!", isCorrect: true, explanation: "'Prego!' is the standard response for 'You're welcome'." },
      { label: "Scusa!", isCorrect: false, explanation: "Means 'Sorry!'." },
      { label: "Per favore", isCorrect: false, explanation: "Means 'Please'." },
      { label: "Arrivederci", isCorrect: false, explanation: "Means 'Goodbye'." },
    ]
  },
  {
    id: 5,
    category: 'CONVERSATION',
    questionText: "Which Italian phrase means 'See you tomorrow'?",
    options: [
      { label: "A domani", isCorrect: true, explanation: "'Domani' means tomorrow." },
      { label: "A stasera", isCorrect: false, explanation: "Means 'See you tonight'." },
      { label: "A presto", isCorrect: false, explanation: "Means 'See you soon'." },
      { label: "Buon viaggio", isCorrect: false, explanation: "Means 'Have a good trip'." },
    ]
  },

  // Food & Coffee Bar Etiquette
  {
    id: 6,
    category: 'FOOD',
    questionText: "How do you politely order an espresso and a croissant at a Neapolitan bar?",
    options: [
      { label: "Vorrei un espresso e un cornetto, per favore", isCorrect: true, explanation: "Correct conditional form 'Vorrei' (I would like)." },
      { label: "Dammi un caffè adesso!", isCorrect: false, explanation: "Too blunt ('Give me a coffee right now!')." },
      { label: "Io prendere caffè", isCorrect: false, explanation: "Incorrect infinitive verb usage." },
      { label: "Caffè con zucchero subito", isCorrect: false, explanation: "Commanding phrasing." },
    ]
  },
  {
    id: 7,
    category: 'FOOD',
    questionText: "How do you ask for the bill at a restaurant in Italy?",
    options: [
      { label: "Il conto, per favore", isCorrect: true, explanation: "'Il conto' means the check/bill." },
      { label: "Il prezzo del cibo", isCorrect: false, explanation: "Means 'The price of the food'." },
      { label: "Vorrei mangiare ancora", isCorrect: false, explanation: "Means 'I would like to eat more'." },
      { label: "Dov'è la cucina?", isCorrect: false, explanation: "Means 'Where is the kitchen?'." },
    ]
  },
  {
    id: 8,
    category: 'FOOD',
    questionText: "What is a 'caffè macchiato' in Italian bar culture?",
    options: [
      { label: "An espresso with a drop ('spot') of milk", isCorrect: true, explanation: "'Macchiato' means stained/spotted with milk." },
      { label: "A large glass of cold milk", isCorrect: false, explanation: "That is a latte macchiato or latte." },
      { label: "Decaf coffee with lemon", isCorrect: false, explanation: "Not a traditional macchiato." },
      { label: "Black filter coffee", isCorrect: false, explanation: "That would be a caffè americano." },
    ]
  },
  {
    id: 9,
    category: 'FOOD',
    questionText: "Translate: 'A table for two people, please.'",
    options: [
      { label: "Un tavolo per due persone, per favore", isCorrect: true, explanation: "Accurate Italian translation." },
      { label: "Due sedie per me", isCorrect: false, explanation: "Means 'Two chairs for me'." },
      { label: "Vorrei mangiare per due ore", isCorrect: false, explanation: "Means 'I'd like to eat for two hours'." },
      { label: "Un ristorante per due", isCorrect: false, explanation: "Means 'A restaurant for two'." },
    ]
  },
  {
    id: 10,
    category: 'FOOD',
    questionText: "What does 'Senza lattosio' mean on a food menu?",
    options: [
      { label: "Lactose-free", isCorrect: true, explanation: "'Senza' means without; 'lattosio' means lactose." },
      { label: "Gluten-free", isCorrect: false, explanation: "Gluten-free is 'Senza glutine'." },
      { label: "Sugar-free", isCorrect: false, explanation: "Sugar-free is 'Senza zucchero'." },
      { label: "Extra cheese", isCorrect: false, explanation: "Extra cheese would be 'Con formaggio extra'." },
    ]
  },

  // Cardinal Numbers
  {
    id: 11,
    category: 'NUMBERS',
    questionText: "What number is 'Centoventinove' in digits?",
    options: [
      { label: "129", isCorrect: true, explanation: "Cento (100) + venti (20) + nove (9) = 129." },
      { label: "119", isCorrect: false, explanation: "119 is 'Centodiciannove'." },
      { label: "149", isCorrect: false, explanation: "149 is 'Centoquarantanove'." },
      { label: "229", isCorrect: false, explanation: "229 is 'Duecentoventinove'." },
    ]
  },
  {
    id: 12,
    category: 'NUMBERS',
    questionText: "Write 'Quattrocentocinquantadue' in numerical digits:",
    options: [
      { label: "452", isCorrect: true, explanation: "Quattrocento (400) + cinquantadue (52) = 452." },
      { label: "425", isCorrect: false, explanation: "425 is 'Quattrocentoventicinque'." },
      { label: "542", isCorrect: false, explanation: "542 is 'Cinquecentoquarantadue'." },
      { label: "462", isCorrect: false, explanation: "462 is 'Quattrocentosessantadue'." },
    ]
  },
  {
    id: 13,
    category: 'NUMBERS',
    questionText: "What is the Italian word for the number 78?",
    options: [
      { label: "Settantotto", isCorrect: true, explanation: "Settanta + otto drops the vowel -> Settantotto." },
      { label: "Sessantotto", isCorrect: false, explanation: "Sessantotto is 68." },
      { label: "Ottantasette", isCorrect: false, explanation: "Ottantasette is 87." },
      { label: "Novantotto", isCorrect: false, explanation: "Novantotto is 98." },
    ]
  },
  {
    id: 14,
    category: 'NUMBERS',
    questionText: "How do you write '1,500' in written Italian?",
    options: [
      { label: "Millecinquecento", isCorrect: true, explanation: "Mille (1000) + cinquecento (500) = Millecinquecento." },
      { label: "Un mila cinque", isCorrect: false, explanation: "Incorrect grammar construct." },
      { label: "Cinquecentomila", isCorrect: false, explanation: "Cinquecentomila is 500,000!" },
      { label: "Quindicicento", isCorrect: false, explanation: "Italian does not use 'fifteen hundred'." },
    ]
  },
  {
    id: 15,
    category: 'NUMBERS',
    questionText: "Calculate the total price: 'Cinquanta più trentacinque euro'",
    options: [
      { label: "85 €", isCorrect: true, explanation: "50 (cinquanta) + 35 (trentacinque) = 85 €." },
      { label: "75 €", isCorrect: false, explanation: "75 is 'settantacinque'." },
      { label: "65 €", isCorrect: false, explanation: "65 is 'sessantacinque'." },
      { label: "95 €", isCorrect: false, explanation: "95 is 'novantacinque'." },
    ]
  },
  {
    id: 16,
    category: 'NUMBERS',
    questionText: "What is the result of 'Sessantasei più ventisette'?",
    options: [
      { label: "93", isCorrect: true, explanation: "66 + 27 = 93 (Novantatre)." },
      { label: "83", isCorrect: false, explanation: "83 is 'Ottantatre'." },
      { label: "97", isCorrect: false, explanation: "97 is 'Novantasette'." },
      { label: "87", isCorrect: false, explanation: "87 is 'Ottantasette'." },
    ]
  },
  {
    id: 17,
    category: 'NUMBERS',
    questionText: "What number is 'Trecentosessanta' in digits?",
    options: [
      { label: "360", isCorrect: true, explanation: "Trecento (300) + sessanta (60) = 360." },
      { label: "306", isCorrect: false, explanation: "306 is 'Trecentosei'." },
      { label: "630", isCorrect: false, explanation: "630 is 'Seicentotrenta'." },
      { label: "316", isCorrect: false, explanation: "316 is 'Trecentosedici'." },
    ]
  },

  // Time & Dates
  {
    id: 18,
    category: 'TIME',
    questionText: "What time is 'Le sette e un quarto'?",
    options: [
      { label: "7:15", isCorrect: true, explanation: "7 (sette) and a quarter (un quarto) = 7:15." },
      { label: "7:30", isCorrect: false, explanation: "7:30 is 'Le sette e mezza'." },
      { label: "7:45", isCorrect: false, explanation: "7:45 is 'Le otto meno un quarto'." },
      { label: "6:45", isCorrect: false, explanation: "6:45 is 'Le sette meno un quarto'." },
    ]
  },
  {
    id: 19,
    category: 'TIME',
    questionText: "How do you say 'It is 8:30' in Italian?",
    options: [
      { label: "Sono le otto e mezza", isCorrect: true, explanation: "'Mezza' means half past." },
      { label: "Sono otto trenta ore", isCorrect: false, explanation: "Unnatural phrasing." },
      { label: "Fa otto e mezzo", isCorrect: false, explanation: "Improper verb selection." },
      { label: "Le otto e quaranta", isCorrect: false, explanation: "That is 8:40." },
    ]
  },
  {
    id: 20,
    category: 'TIME',
    questionText: "What time is 'Le nove meno venti'?",
    options: [
      { label: "8:40", isCorrect: true, explanation: "Twenty minutes to nine = 8:40." },
      { label: "9:20", isCorrect: false, explanation: "9:20 is 'Le nove e venti'." },
      { label: "8:20", isCorrect: false, explanation: "8:20 is 'Le otto e venti'." },
      { label: "9:40", isCorrect: false, explanation: "9:40 is 'Le dieci meno venti'." },
    ]
  },
  {
    id: 21,
    category: 'TIME',
    questionText: "What day of the week is 'Giovedì' in Italian?",
    options: [
      { label: "Thursday", isCorrect: true, explanation: "Lunedì (Mon), Martedì (Tue), Mercoledì (Wed), Giovedì (Thu)." },
      { label: "Friday", isCorrect: false, explanation: "Friday is 'Venerdì'." },
      { label: "Tuesday", isCorrect: false, explanation: "Tuesday is 'Martedì'." },
      { label: "Saturday", isCorrect: false, explanation: "Saturday is 'Sabato'." },
    ]
  },
  {
    id: 22,
    category: 'TIME',
    questionText: "How do you write the date 'August 14th' in Italian?",
    options: [
      { label: "Il quattordici agosto", isCorrect: true, explanation: "Italian places the number before the month name (lowercase)." },
      { label: "Agosto quattordici", isCorrect: false, explanation: "English style word order." },
      { label: "Il quattordicesimo agosto", isCorrect: false, explanation: "Ordinal numbers aren't used for dates (except 1st: il primo)." },
      { label: "Il 14 d'Agosto", isCorrect: false, explanation: "Capitalizing months is discouraged in Italian." },
    ]
  },

  // Directions & Navigation
  {
    id: 23,
    category: 'DIRECTIONS',
    questionText: "What does 'Girare a destra' mean when asking for directions?",
    options: [
      { label: "Turn right", isCorrect: true, explanation: "'Destra' is right; 'Sinistra' is left." },
      { label: "Turn left", isCorrect: false, explanation: "Turn left is 'Girare a sinistra'." },
      { label: "Go straight ahead", isCorrect: false, explanation: "Go straight is 'Andare dritto'." },
      { label: "Stop here", isCorrect: false, explanation: "Stop here is 'Fermati qui'." },
    ]
  },
  {
    id: 24,
    category: 'DIRECTIONS',
    questionText: "How do you ask 'Where is the train station?' in Italian?",
    options: [
      { label: "Dov'è la stazione ferroviaria?", isCorrect: true, explanation: "'Dov'è' = Where is; 'stazione ferroviaria' = train station." },
      { label: "Dov'è la fermata dell'autobus?", isCorrect: false, explanation: "Means bus stop." },
      { label: "Quanto dista il centro?", isCorrect: false, explanation: "Means how far is city center." },
      { label: "Come vado in aeroporto?", isCorrect: false, explanation: "Means how do I get to airport." },
    ]
  },
  {
    id: 25,
    category: 'DIRECTIONS',
    questionText: "What does 'Andare sempre dritto' mean?",
    options: [
      { label: "Go straight ahead continuously", isCorrect: true, explanation: "'Sempre dritto' means straight ahead." },
      { label: "Turn right at the light", isCorrect: false, explanation: "That would use 'a destra'." },
      { label: "Go back to the start", isCorrect: false, explanation: "That would use 'tornare indietro'." },
      { label: "Cross the bridge", isCorrect: false, explanation: "That would use 'attraversare il ponte'." },
    ]
  },

  // Grammar & Verbs
  {
    id: 26,
    category: 'GRAMMAR',
    questionText: "Choose the correct form of the verb 'essere' (to be) for 'Noi' (We):",
    options: [
      { label: "Noi siamo", isCorrect: true, explanation: "Io sono, tu sei, lui/lei è, noi siamo, voi siete, loro sono." },
      { label: "Noi avete", isCorrect: false, explanation: "Avete is from avere (You all have)." },
      { label: "Noi siete", isCorrect: false, explanation: "Siete is for Voi (You all are)." },
      { label: "Noi sono", isCorrect: false, explanation: "Sono is for Io (I am) or Loro (They are)." },
    ]
  },
  {
    id: 27,
    category: 'GRAMMAR',
    questionText: "Fill in the blank: 'Io _____ una macchina nuova' (I have a new car)",
    options: [
      { label: "ho", isCorrect: true, explanation: "Io ho (I have) from verb Avere." },
      { label: "hai", isCorrect: false, explanation: "Tu hai (You have)." },
      { label: "ha", isCorrect: false, explanation: "Lui/Lei ha (He/She has)." },
      { label: "hanno", isCorrect: false, explanation: "Loro hanno (They have)." },
    ]
  },
  {
    id: 28,
    category: 'GRAMMAR',
    questionText: "Which article is used before singular masculine nouns starting with 'z' or 'gn' (e.g. zaino, gnocco)?",
    options: [
      { label: "Lo", isCorrect: true, explanation: "'Lo zaino', 'Lo gnocco'." },
      { label: "Il", isCorrect: false, explanation: "'Il' is used before consonant sounds except z, s+consonant, gn, etc." },
      { label: "La", isCorrect: false, explanation: "'La' is feminine singular." },
      { label: "L'", isCorrect: false, explanation: "'L'' is used before vowels." },
    ]
  },
  {
    id: 29,
    category: 'GRAMMAR',
    questionText: "How do you make the word 'il libro' plural in Italian?",
    options: [
      { label: "I libri", isCorrect: true, explanation: "'Il' becomes 'i', '-o' ending becomes '-i'." },
      { label: "Le libri", isCorrect: false, explanation: "'Le' is feminine plural." },
      { label: "Gli libros", isCorrect: false, explanation: "Italian does not add 's' for plurals." },
      { label: "I libroni", isCorrect: false, explanation: "'Libroni' means big books." },
    ]
  },
  {
    id: 30,
    category: 'GRAMMAR',
    questionText: "What is the past participle of the verb 'fare' (to do/make)?",
    options: [
      { label: "Fatto", isCorrect: true, explanation: "'Fare' is irregular; its past participle is 'fatto'." },
      { label: "Farato", isCorrect: false, explanation: "Not a real Italian word." },
      { label: "Facuto", isCorrect: false, explanation: "Incorrect irregular formation." },
      { label: "Fattoio", isCorrect: false, explanation: "Not a valid verb form." },
    ]
  }
];
