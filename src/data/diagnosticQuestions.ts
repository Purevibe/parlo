export interface RawOption {
  label: string;
  isCorrect: boolean;
  explanation: string;
  translation?: string; // English translation of this specific option
}

export interface RawQuestion {
  id: number;
  category: 'CONVERSATION' | 'FOOD' | 'NUMBERS' | 'TIME' | 'DIRECTIONS' | 'GRAMMAR';
  questionText: string;
  correctTranslation?: string;
  options: RawOption[];
}

export const DIAGNOSTIC_QUESTION_POOL: RawQuestion[] = [
  // Conversation & Greetings
  {
    id: 1,
    category: 'CONVERSATION',
    questionText: "Choose the most natural way to say 'Pleased to meet you' in Italian:",
    correctTranslation: "Piacere di conoscerti = Pleased to meet you",
    options: [
      { label: "Piacere di conoscerti", isCorrect: true, translation: "Pleased to meet you", explanation: "Standard polite greeting used throughout Italy." },
      { label: "Molto bene grazie", isCorrect: false, translation: "Very well, thank you", explanation: "Means 'Very well, thank you'." },
      { label: "Come ti chiami?", isCorrect: false, translation: "What is your name?", explanation: "Means 'What is your name?'." },
      { label: "Per favore ciao", isCorrect: false, translation: "Please bye", explanation: "Literal translation mashup." },
    ]
  },
  {
    id: 2,
    category: 'CONVERSATION',
    questionText: "How do you ask 'How are you?' informally to a friend in Italian?",
    correctTranslation: "Come stai? = How are you? (informal)",
    options: [
      { label: "Come stai?", isCorrect: true, translation: "How are you? (informal)", explanation: "'Come stai?' is informal; 'Come sta?' is formal." },
      { label: "Di dove sei?", isCorrect: false, translation: "Where are you from?", explanation: "Means 'Where are you from?'." },
      { label: "Quanti anni hai?", isCorrect: false, translation: "How old are you?", explanation: "Means 'How old are you?'." },
      { label: "Buonasera a tutti", isCorrect: false, translation: "Good evening everyone", explanation: "Means 'Good evening everyone'." },
    ]
  },
  {
    id: 3,
    category: 'CONVERSATION',
    questionText: "What does the common phrase 'Ci vediamo dopo!' mean?",
    correctTranslation: "Ci vediamo dopo! = See you later!",
    options: [
      { label: "See you later!", isCorrect: true, translation: "See you later!", explanation: "'Dopo' means later; 'Ci vediamo' means we'll see each other." },
      { label: "Nice to meet you!", isCorrect: false, translation: "Nice to meet you!", explanation: "That would be 'Piacere'." },
      { label: "Where is the bathroom?", isCorrect: false, translation: "Where is the bathroom?", explanation: "That would be 'Dov'è il bagno?'." },
      { label: "Good morning!", isCorrect: false, translation: "Good morning!", explanation: "That is 'Buongiorno'." },
    ]
  },
  {
    id: 4,
    category: 'CONVERSATION',
    questionText: "How do you respond politely when someone says 'Grazie'?",
    correctTranslation: "Prego! = You're welcome!",
    options: [
      { label: "Prego!", isCorrect: true, translation: "You're welcome!", explanation: "'Prego!' is the standard response for 'You're welcome'." },
      { label: "Scusa!", isCorrect: false, translation: "Sorry!", explanation: "Means 'Sorry!'." },
      { label: "Per favore", isCorrect: false, translation: "Please", explanation: "Means 'Please'." },
      { label: "Arrivederci", isCorrect: false, translation: "Goodbye", explanation: "Means 'Goodbye'." },
    ]
  },
  {
    id: 5,
    category: 'CONVERSATION',
    questionText: "Which Italian phrase means 'See you tomorrow'?",
    correctTranslation: "A domani = See you tomorrow",
    options: [
      { label: "A domani", isCorrect: true, translation: "See you tomorrow", explanation: "'Domani' means tomorrow." },
      { label: "A stasera", isCorrect: false, translation: "See you tonight", explanation: "Means 'See you tonight'." },
      { label: "A presto", isCorrect: false, translation: "See you soon", explanation: "Means 'See you soon'." },
      { label: "Buon viaggio", isCorrect: false, translation: "Have a good trip", explanation: "Means 'Have a good trip'." },
    ]
  },

  // Food & Coffee Bar Etiquette
  {
    id: 6,
    category: 'FOOD',
    questionText: "How do you politely order an espresso and a croissant at a Neapolitan bar?",
    correctTranslation: "Vorrei un espresso e un cornetto, per favore = I would like an espresso and a croissant, please",
    options: [
      { label: "Vorrei un espresso e un cornetto, per favore", isCorrect: true, translation: "I would like an espresso and a croissant, please", explanation: "Correct conditional form 'Vorrei' (I would like)." },
      { label: "Dammi un caffè adesso!", isCorrect: false, translation: "Give me a coffee right now!", explanation: "Too blunt ('Give me a coffee right now!')." },
      { label: "Io prendere caffè", isCorrect: false, translation: "I to take coffee", explanation: "Incorrect infinitive verb usage." },
      { label: "Caffè con zucchero subito", isCorrect: false, translation: "Coffee with sugar immediately", explanation: "Commanding phrasing." },
    ]
  },
  {
    id: 7,
    category: 'FOOD',
    questionText: "How do you ask for the bill at a restaurant in Italy?",
    correctTranslation: "Il conto, per favore = The check/bill, please",
    options: [
      { label: "Il conto, per favore", isCorrect: true, translation: "The check/bill, please", explanation: "'Il conto' means the check/bill." },
      { label: "Il prezzo del cibo", isCorrect: false, translation: "The price of the food", explanation: "Means 'The price of the food'." },
      { label: "Vorrei mangiare ancora", isCorrect: false, translation: "I would like to eat more", explanation: "Means 'I would like to eat more'." },
      { label: "Dov'è la cucina?", isCorrect: false, translation: "Where is the kitchen?", explanation: "Means 'Where is the kitchen?'." },
    ]
  },
  {
    id: 8,
    category: 'FOOD',
    questionText: "What is a 'caffè macchiato' in Italian bar culture?",
    correctTranslation: "Caffè macchiato = Espresso with a spot of milk",
    options: [
      { label: "An espresso with a drop ('spot') of milk", isCorrect: true, translation: "Espresso with a spot of milk", explanation: "'Macchiato' means stained/spotted with milk." },
      { label: "A large glass of cold milk", isCorrect: false, translation: "A glass of milk", explanation: "That is a latte macchiato or latte." },
      { label: "Decaf coffee with lemon", isCorrect: false, translation: "Decaf with lemon", explanation: "Not a traditional macchiato." },
      { label: "Black filter coffee", isCorrect: false, translation: "Americano coffee", explanation: "That would be a caffè americano." },
    ]
  },
  {
    id: 9,
    category: 'FOOD',
    questionText: "Translate: 'A table for two people, please.'",
    correctTranslation: "Un tavolo per due persone, per favore = A table for two people, please",
    options: [
      { label: "Un tavolo per due persone, per favore", isCorrect: true, translation: "A table for two people, please", explanation: "Accurate Italian translation." },
      { label: "Due sedie per me", isCorrect: false, translation: "Two chairs for me", explanation: "Means 'Two chairs for me'." },
      { label: "Vorrei mangiare per due ore", isCorrect: false, translation: "I'd like to eat for two hours", explanation: "Means 'I'd like to eat for two hours'." },
      { label: "Un ristorante per due", isCorrect: false, translation: "A restaurant for two", explanation: "Means 'A restaurant for two'." },
    ]
  },
  {
    id: 10,
    category: 'FOOD',
    questionText: "What does 'Senza lattosio' mean on a food menu?",
    correctTranslation: "Senza lattosio = Lactose-free",
    options: [
      { label: "Lactose-free", isCorrect: true, translation: "Lactose-free", explanation: "'Senza' means without; 'lattosio' means lactose." },
      { label: "Gluten-free", isCorrect: false, translation: "Gluten-free", explanation: "Gluten-free is 'Senza glutine'." },
      { label: "Sugar-free", isCorrect: false, translation: "Sugar-free", explanation: "Sugar-free is 'Senza zucchero'." },
      { label: "Extra cheese", isCorrect: false, translation: "Extra cheese", explanation: "Extra cheese would be 'Con formaggio extra'." },
    ]
  },

  // Cardinal Numbers
  {
    id: 11,
    category: 'NUMBERS',
    questionText: "What number is 'Centoventinove' in digits?",
    correctTranslation: "Centoventinove = 129 (One hundred twenty-nine)",
    options: [
      { label: "129", isCorrect: true, translation: "129 (One hundred twenty-nine)", explanation: "Cento (100) + venti (20) + nove (9) = 129." },
      { label: "119", isCorrect: false, translation: "119 (One hundred nineteen)", explanation: "119 is 'Centodiciannove'." },
      { label: "149", isCorrect: false, translation: "149 (One hundred forty-nine)", explanation: "149 is 'Centoquarantanove'." },
      { label: "229", isCorrect: false, translation: "229 (Two hundred twenty-nine)", explanation: "229 is 'Duecentoventinove'." },
    ]
  },
  {
    id: 12,
    category: 'NUMBERS',
    questionText: "Write 'Quattrocentocinquantadue' in numerical digits:",
    correctTranslation: "Quattrocentocinquantadue = 452 (Four hundred fifty-two)",
    options: [
      { label: "452", isCorrect: true, translation: "452 (Four hundred fifty-two)", explanation: "Quattrocento (400) + cinquantadue (52) = 452." },
      { label: "425", isCorrect: false, translation: "425 (Four hundred twenty-five)", explanation: "425 is 'Quattrocentoventicinque'." },
      { label: "542", isCorrect: false, translation: "542 (Five hundred forty-two)", explanation: "542 is 'Cinquecentoquarantadue'." },
      { label: "462", isCorrect: false, translation: "462 (Four hundred sixty-two)", explanation: "462 is 'Quattrocentosessantadue'." },
    ]
  },
  {
    id: 13,
    category: 'NUMBERS',
    questionText: "What is the Italian word for the number 78?",
    correctTranslation: "Settantotto = 78 (Seventy-eight)",
    options: [
      { label: "Settantotto", isCorrect: true, translation: "Seventy-eight", explanation: "Settanta + otto drops the vowel -> Settantotto." },
      { label: "Sessantotto", isCorrect: false, translation: "Sixty-eight", explanation: "Sessantotto is 68." },
      { label: "Ottantasette", isCorrect: false, translation: "Eighty-seven", explanation: "Ottantasette is 87." },
      { label: "Novantotto", isCorrect: false, translation: "Ninety-eight", explanation: "Novantotto is 98." },
    ]
  },
  {
    id: 14,
    category: 'NUMBERS',
    questionText: "How do you write '1,500' in written Italian?",
    correctTranslation: "Millecinquecento = 1,500 (One thousand five hundred)",
    options: [
      { label: "Millecinquecento", isCorrect: true, translation: "One thousand five hundred", explanation: "Mille (1000) + cinquecento (500) = Millecinquecento." },
      { label: "Un mila cinque", isCorrect: false, translation: "Incorrect phrase", explanation: "Incorrect grammar construct." },
      { label: "Cinquecentomila", isCorrect: false, translation: "Five hundred thousand", explanation: "Cinquecentomila is 500,000!" },
      { label: "Quindicicento", isCorrect: false, translation: "Fifteen hundred (invalid)", explanation: "Italian does not use 'fifteen hundred'." },
    ]
  },
  {
    id: 15,
    category: 'NUMBERS',
    questionText: "Calculate the total price: 'Cinquanta più trentacinque euro'",
    correctTranslation: "Cinquanta (50) + trentacinque (35) = 85 € (Ottantacinque euro)",
    options: [
      { label: "85 €", isCorrect: true, translation: "85 € (Eighty-five euros)", explanation: "50 (cinquanta) + 35 (trentacinque) = 85 €." },
      { label: "75 €", isCorrect: false, translation: "75 € (Seventy-five euros)", explanation: "75 is 'settantacinque'." },
      { label: "65 €", isCorrect: false, translation: "65 € (Sixty-five euros)", explanation: "65 is 'sessantacinque'." },
      { label: "95 €", isCorrect: false, translation: "95 € (Ninety-five euros)", explanation: "95 is 'novantacinque'." },
    ]
  },
  {
    id: 16,
    category: 'NUMBERS',
    questionText: "What is the result of 'Sessantasei più ventisette'?",
    correctTranslation: "Sessantasei (66) + ventisette (27) = 93 (Novantatre)",
    options: [
      { label: "93", isCorrect: true, translation: "93 (Ninety-three)", explanation: "66 + 27 = 93 (Novantatre)." },
      { label: "83", isCorrect: false, translation: "83 (Eighty-three)", explanation: "83 is 'Ottantatre'." },
      { label: "97", isCorrect: false, translation: "97 (Ninety-seven)", explanation: "97 is 'Novantasette'." },
      { label: "87", isCorrect: false, translation: "87 (Eighty-seven)", explanation: "87 is 'Ottantasette'." },
    ]
  },
  {
    id: 17,
    category: 'NUMBERS',
    questionText: "What number is 'Trecentosessanta' in digits?",
    correctTranslation: "Trecentosessanta = 360 (Three hundred sixty)",
    options: [
      { label: "360", isCorrect: true, translation: "360 (Three hundred sixty)", explanation: "Trecento (300) + sessanta (60) = 360." },
      { label: "306", isCorrect: false, translation: "306 (Three hundred six)", explanation: "306 is 'Trecentosei'." },
      { label: "630", isCorrect: false, translation: "630 (Six hundred thirty)", explanation: "630 is 'Seicentotrenta'." },
      { label: "316", isCorrect: false, translation: "316 (Three hundred sixteen)", explanation: "316 is 'Trecentosedici'." },
    ]
  },

  // Time & Dates
  {
    id: 18,
    category: 'TIME',
    questionText: "What time is 'Le sette e un quarto'?",
    correctTranslation: "Le sette e un quarto = 7:15 (Quarter past seven)",
    options: [
      { label: "7:15", isCorrect: true, translation: "7:15 (Quarter past seven)", explanation: "7 (sette) and a quarter (un quarto) = 7:15." },
      { label: "7:30", isCorrect: false, translation: "7:30 (Half past seven)", explanation: "7:30 is 'Le sette e mezza'." },
      { label: "7:45", isCorrect: false, translation: "7:45 (Quarter to eight)", explanation: "7:45 is 'Le otto meno un quarto'." },
      { label: "6:45", isCorrect: false, translation: "6:45 (Quarter to seven)", explanation: "6:45 is 'Le sette meno un quarto'." },
    ]
  },
  {
    id: 19,
    category: 'TIME',
    questionText: "How do you say 'It is 8:30' in Italian?",
    correctTranslation: "Sono le otto e mezza = It is half past eight (8:30)",
    options: [
      { label: "Sono le otto e mezza", isCorrect: true, translation: "It is 8:30 (half past eight)", explanation: "'Mezza' means half past." },
      { label: "Sono otto trenta ore", isCorrect: false, translation: "They are eight thirty hours", explanation: "Unnatural phrasing." },
      { label: "Fa otto e mezzo", isCorrect: false, translation: "It makes eight and half", explanation: "Improper verb selection." },
      { label: "Le otto e quaranta", isCorrect: false, translation: "8:40", explanation: "That is 8:40." },
    ]
  },
  {
    id: 20,
    category: 'TIME',
    questionText: "What time is 'Le nove meno venti'?",
    correctTranslation: "Le nove meno venti = 8:40 (Twenty to nine)",
    options: [
      { label: "8:40", isCorrect: true, translation: "8:40 (Twenty to nine)", explanation: "Twenty minutes to nine = 8:40." },
      { label: "9:20", isCorrect: false, translation: "9:20 (Twenty past nine)", explanation: "9:20 is 'Le nove e venti'." },
      { label: "8:20", isCorrect: false, translation: "8:20 (Twenty past eight)", explanation: "8:20 is 'Le otto e venti'." },
      { label: "9:40", isCorrect: false, translation: "9:40 (Twenty to ten)", explanation: "9:40 is 'Le dieci meno venti'." },
    ]
  },
  {
    id: 21,
    category: 'TIME',
    questionText: "What day of the week is 'Giovedì' in Italian?",
    correctTranslation: "Giovedì = Thursday",
    options: [
      { label: "Thursday", isCorrect: true, translation: "Thursday", explanation: "Lunedì (Mon), Martedì (Tue), Mercoledì (Wed), Giovedì (Thu)." },
      { label: "Friday", isCorrect: false, translation: "Friday", explanation: "Friday is 'Venerdì'." },
      { label: "Tuesday", isCorrect: false, translation: "Tuesday", explanation: "Tuesday is 'Martedì'." },
      { label: "Saturday", isCorrect: false, translation: "Saturday", explanation: "Saturday is 'Sabato'." },
    ]
  },
  {
    id: 22,
    category: 'TIME',
    questionText: "How do you write the date 'August 14th' in Italian?",
    correctTranslation: "Il quattordici agosto = August 14th",
    options: [
      { label: "Il quattordici agosto", isCorrect: true, translation: "August 14th", explanation: "Italian places the number before the month name (lowercase)." },
      { label: "Agosto quattordici", isCorrect: false, translation: "August fourteen", explanation: "English style word order." },
      { label: "Il quattordicesimo agosto", isCorrect: false, translation: "The fourteenth August", explanation: "Ordinal numbers aren't used for dates (except 1st: il primo)." },
      { label: "Il 14 d'Agosto", isCorrect: false, translation: "The 14 of August", explanation: "Capitalizing months is discouraged in Italian." },
    ]
  },

  // Directions & Navigation
  {
    id: 23,
    category: 'DIRECTIONS',
    questionText: "What does 'Girare a destra' mean when asking for directions?",
    correctTranslation: "Girare a destra = Turn right",
    options: [
      { label: "Turn right", isCorrect: true, translation: "Turn right", explanation: "'Destra' is right; 'Sinistra' is left." },
      { label: "Turn left", isCorrect: false, translation: "Turn left", explanation: "Turn left is 'Girare a sinistra'." },
      { label: "Go straight ahead", isCorrect: false, translation: "Go straight", explanation: "Go straight is 'Andare dritto'." },
      { label: "Stop here", isCorrect: false, translation: "Stop here", explanation: "Stop here is 'Fermati qui'." },
    ]
  },
  {
    id: 24,
    category: 'DIRECTIONS',
    questionText: "How do you ask 'Where is the train station?' in Italian?",
    correctTranslation: "Dov'è la stazione ferroviaria? = Where is the train station?",
    options: [
      { label: "Dov'è la stazione ferroviaria?", isCorrect: true, translation: "Where is the train station?", explanation: "'Dov'è' = Where is; 'stazione ferroviaria' = train station." },
      { label: "Dov'è la fermata dell'autobus?", isCorrect: false, translation: "Where is the bus stop?", explanation: "Means bus stop." },
      { label: "Quanto dista il centro?", isCorrect: false, translation: "How far is city center?", explanation: "Means how far is city center." },
      { label: "Come vado in aeroporto?", isCorrect: false, translation: "How do I get to airport?", explanation: "Means how do I get to airport." },
    ]
  },
  {
    id: 25,
    category: 'DIRECTIONS',
    questionText: "What does 'Andare sempre dritto' mean?",
    correctTranslation: "Andare sempre dritto = Go straight ahead continuously",
    options: [
      { label: "Go straight ahead continuously", isCorrect: true, translation: "Go straight ahead", explanation: "'Sempre dritto' means straight ahead." },
      { label: "Turn right at the light", isCorrect: false, translation: "Turn right at light", explanation: "That would use 'a destra'." },
      { label: "Go back to the start", isCorrect: false, translation: "Go back to start", explanation: "That would use 'tornare indietro'." },
      { label: "Cross the bridge", isCorrect: false, translation: "Cross the bridge", explanation: "That would use 'attraversare il ponte'." },
    ]
  },

  // Grammar & Verbs
  {
    id: 26,
    category: 'GRAMMAR',
    questionText: "Choose the correct form of the verb 'essere' (to be) for 'Noi' (We):",
    correctTranslation: "Noi siamo = We are",
    options: [
      { label: "Noi siamo", isCorrect: true, translation: "We are", explanation: "Io sono, tu sei, lui/lei è, noi siamo, voi siete, loro sono." },
      { label: "Noi avete", isCorrect: false, translation: "We have (invalid)", explanation: "Avete is from avere (You all have)." },
      { label: "Noi siete", isCorrect: false, translation: "We are (invalid)", explanation: "Siete is for Voi (You all are)." },
      { label: "Noi sono", isCorrect: false, translation: "We are (invalid)", explanation: "Sono is for Io (I am) or Loro (They are)." },
    ]
  },
  {
    id: 27,
    category: 'GRAMMAR',
    questionText: "Fill in the blank: 'Io _____ una macchina nuova' (I have a new car)",
    correctTranslation: "Io ho una macchina nuova = I have a new car",
    options: [
      { label: "ho", isCorrect: true, translation: "I have", explanation: "Io ho (I have) from verb Avere." },
      { label: "hai", isCorrect: false, translation: "You have", explanation: "Tu hai (You have)." },
      { label: "ha", isCorrect: false, translation: "He/She has", explanation: "Lui/Lei ha (He/She has)." },
      { label: "hanno", isCorrect: false, translation: "They have", explanation: "Loro hanno (They have)." },
    ]
  },
  {
    id: 28,
    category: 'GRAMMAR',
    questionText: "Which article is used before singular masculine nouns starting with 'z' or 'gn' (e.g. zaino, gnocco)?",
    correctTranslation: "Lo zaino = The backpack",
    options: [
      { label: "Lo", isCorrect: true, translation: "The (masculine special)", explanation: "'Lo zaino', 'Lo gnocco'." },
      { label: "Il", isCorrect: false, translation: "The (standard masculine)", explanation: "'Il' is used before consonant sounds except z, s+consonant, gn, etc." },
      { label: "La", isCorrect: false, translation: "The (feminine)", explanation: "'La' is feminine singular." },
      { label: "L'", isCorrect: false, translation: "The (vowel prefix)", explanation: "'L'' is used before vowels." },
    ]
  },
  {
    id: 29,
    category: 'GRAMMAR',
    questionText: "How do you make the word 'il libro' plural in Italian?",
    correctTranslation: "Il libro (The book) -> I libri (The books)",
    options: [
      { label: "I libri", isCorrect: true, translation: "The books", explanation: "'Il' becomes 'i', '-o' ending becomes '-i'." },
      { label: "Le libri", isCorrect: false, translation: "The books (feminine invalid)", explanation: "'Le' is feminine plural." },
      { label: "Gli libros", isCorrect: false, translation: "The books (Spanish invalid)", explanation: "Italian does not add 's' for plurals." },
      { label: "I libroni", isCorrect: false, translation: "The big books", explanation: "'Libroni' means big books." },
    ]
  },
  {
    id: 30,
    category: 'GRAMMAR',
    questionText: "What is the past participle of the verb 'fare' (to do/make)?",
    correctTranslation: "Fatto = Done / Made",
    options: [
      { label: "Fatto", isCorrect: true, translation: "Done / Made", explanation: "'Fare' is irregular; its past participle is 'fatto'." },
      { label: "Farato", isCorrect: false, translation: "Invalid word", explanation: "Not a real Italian word." },
      { label: "Facuto", isCorrect: false, translation: "Invalid verb form", explanation: "Incorrect irregular formation." },
      { label: "Fattoio", isCorrect: false, translation: "Invalid word", explanation: "Not a valid verb form." },
    ]
  }
];
