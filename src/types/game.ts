export type Category = 
  | "NUMBERS" 
  | "DATES_CALENDAR" 
  | "FOOD_ORDERING" 
  | "DIRECTIONS" 
  | "GENERAL_BANTER";

export type ProficiencyLevel = "A1_BEGINNER" | "A2_ELEMENTARY" | "B1_INTERMEDIATE" | "B2_ADVANCED";

export interface LessonNode {
  id: string;
  category: Category;
  title: string;
  subtitle: string;
  description: string;
  level: ProficiencyLevel;
  difficulty: "Easy" | "Medium" | "Hard" | "Expert";
  iconName: string;
  xpReward: number;
  unlocked: boolean;
  completed: boolean;
  targetTurns: number; // Default 5 turns to complete
  samplePhrases: string[];
  prompts: string[]; // Dynamic sequence of 5 initial prompt scenarios
}

export interface Correction {
  userMistake: string;
  suggestedFix: string;
  explanation: string;
}

export interface Idiom {
  phrase: string;
  literalMeaning: string;
  contextualMeaning: string;
}

export interface GeminiAnalytics {
  xpEarned: number;
  category: Category;
  accuracyPercentage: number;
}

/**
 * Strict JSON output contract matching user specification
 */
export interface GeminiEvaluationResponse {
  italianResponse: string;
  englishTranslation: string;
  isCorrect: boolean;
  heartsDeducted: number; // 0 if correct, 1 if flawed
  corrections: Correction[];
  idiomsAndTooltips: Idiom[];
  analytics: GeminiAnalytics;
}

export interface Turn {
  id: string;
  timestamp: number;
  userInput: string;
  evaluation: GeminiEvaluationResponse;
  comboMultiplier: number;
  heartsRemaining: number;
}

export interface TelemetryPoint {
  turnIndex: number;
  accuracy: number;
  xpVelocity: number;
  category: Category;
  timestamp: number;
}

export interface UserProgress {
  id?: string;
  user_id?: string;
  xp: number;
  hearts: number;
  streak: number;
  max_streak: number;
  total_turns: number;
  correct_turns: number;
  proficiencyLevel: ProficiencyLevel;
  completedLessons: string[];
  category_stats: Record<Category, { correct: number; total: number }>;
  updated_at?: string;
}
