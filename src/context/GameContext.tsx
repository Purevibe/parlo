import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Turn, Category, TelemetryPoint, GeminiEvaluationResponse, ProficiencyLevel, LessonNode } from '../types/game';
import { evaluateTurnWithGemini } from '../services/gemini';
import { speechService } from '../services/speech';
import { soundEffects } from '../services/soundEffects';
import { useAuth } from './AuthContext';
import { fetchUserProgress, saveUserProgress } from '../services/supabase';

interface GameContextType {
  hearts: number;
  xp: number;
  streak: number;
  comboMultiplier: number;
  currentCategory: Category;
  proficiencyLevel: ProficiencyLevel;
  completedLessons: string[];
  activeView: 'hub' | 'arena';
  turnTimer: number; // 0 to 45
  isTimerRunning: boolean;
  isEvaluating: boolean;
  isSpeaking: boolean;
  isDefibrillatorOpen: boolean;
  isTelemetryOpen: boolean;
  isPlacementOpen: boolean;
  currentTurn: Turn | null;
  currentLesson: LessonNode | null;
  history: Turn[];
  telemetryData: TelemetryPoint[];
  
  // Actions
  setCategory: (cat: Category) => void;
  setProficiencyLevel: (lvl: ProficiencyLevel) => void;
  startLesson: (lesson: LessonNode) => void;
  returnToHub: () => void;
  submitTurn: (userInput: string) => Promise<void>;
  handleTimerTimeout: () => Promise<void>;
  toggleTelemetryDrawer: () => void;
  openPlacementModal: () => void;
  closePlacementModal: () => void;
  onDefibrillatorSuccess: () => void;
  resetRun: () => void;
  speakLatestResponse: () => void;
  stopSpeaking: () => void;
}

const TURN_TIME_LIMIT = 45; // seconds

const GameContext = createContext<GameContextType | null>(null);

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  
  const [hearts, setHearts] = useState<number>(3);
  const [xp, setXp] = useState<number>(0);
  const [streak, setStreak] = useState<number>(0);
  const [currentCategory, setCurrentCategory] = useState<Category>("FOOD_ORDERING");
  const [proficiencyLevel, setProficiencyLevelState] = useState<ProficiencyLevel>("A1_BEGINNER");
  const [completedLessons, setCompletedLessons] = useState<string[]>([]);
  const [activeView, setActiveView] = useState<'hub' | 'arena'>('hub');
  
  const [turnTimer, setTurnTimer] = useState<number>(TURN_TIME_LIMIT);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);
  const [isEvaluating, setIsEvaluating] = useState<boolean>(false);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [isDefibrillatorOpen, setIsDefibrillatorOpen] = useState<boolean>(false);
  const [isTelemetryOpen, setIsTelemetryOpen] = useState<boolean>(false);
  const [isPlacementOpen, setIsPlacementOpen] = useState<boolean>(false);
  
  const [history, setHistory] = useState<Turn[]>([]);
  const [currentTurn, setCurrentTurn] = useState<Turn | null>(null);
  const [currentLesson, setCurrentLesson] = useState<LessonNode | null>(null);
  const [telemetryData, setTelemetryData] = useState<TelemetryPoint[]>([]);

  // Calculate Combo Multiplier:
  // 3-4 consecutive correct turns: 2x (Fiamma Mode)
  // 5+ consecutive correct turns: 3x (Campione Mode)
  const comboMultiplier = streak >= 5 ? 3 : streak >= 3 ? 2 : 1;

  // Restore progress from Supabase or LocalStorage
  useEffect(() => {
    if (user?.id) {
      fetchUserProgress(user.id).then(prog => {
        if (prog) {
          setXp(prog.xp);
          setHearts(prog.hearts > 0 ? prog.hearts : 3);
          setStreak(prog.streak);
          if (prog.proficiencyLevel) setProficiencyLevelState(prog.proficiencyLevel);
          if (prog.completedLessons) setCompletedLessons(prog.completedLessons);
        } else {
          // New user -> open placement quiz automatically
          setIsPlacementOpen(true);
        }
      });
    } else {
      const local = localStorage.getItem('maestro_marco_progress');
      if (local) {
        try {
          const parsed = JSON.parse(local);
          setXp(parsed.xp || 0);
          setHearts(parsed.hearts || 3);
          setStreak(parsed.streak || 0);
          if (parsed.proficiencyLevel) setProficiencyLevelState(parsed.proficiencyLevel);
          if (parsed.completedLessons) setCompletedLessons(parsed.completedLessons);
        } catch (e) {}
      } else {
        // First session -> open diagnostic placement quiz automatically!
        setIsPlacementOpen(true);
      }
    }
  }, [user]);

  // Save progress changes
  useEffect(() => {
    const progData = { 
      xp, 
      hearts, 
      streak, 
      max_streak: streak, 
      total_turns: history.length, 
      correct_turns: history.filter(h => h.evaluation.isCorrect).length, 
      proficiencyLevel,
      completedLessons,
      category_stats: {} as any 
    };
    if (user?.id) {
      saveUserProgress({ ...progData, user_id: user.id });
    } else {
      localStorage.setItem('maestro_marco_progress', JSON.stringify(progData));
    }
  }, [xp, hearts, streak, history, proficiencyLevel, completedLessons, user]);

  // Turn Timer countdown effect
  useEffect(() => {
    let interval: any = null;
    if (isTimerRunning && activeView === 'arena' && turnTimer > 0 && !isEvaluating && !isDefibrillatorOpen) {
      interval = setInterval(() => {
        setTurnTimer(prev => prev - 1);
      }, 1000);
    } else if (turnTimer === 0 && isTimerRunning && activeView === 'arena' && !isEvaluating) {
      setIsTimerRunning(false);
      handleTimerTimeout();
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTimerRunning, activeView, turnTimer, isEvaluating, isDefibrillatorOpen]);

  // Speak Maestro Marco's response automatically
  const speakResponse = useCallback((text: string) => {
    setIsSpeaking(true);
    speechService.speakItalian(text, () => {
      setIsSpeaking(false);
    });
  }, []);

  const stopSpeaking = useCallback(() => {
    speechService.stopSpeaking();
    setIsSpeaking(false);
  }, []);

  const speakLatestResponse = useCallback(() => {
    if (currentTurn?.evaluation.italianResponse) {
      speakResponse(currentTurn.evaluation.italianResponse);
    }
  }, [currentTurn, speakResponse]);

  const setProficiencyLevel = (lvl: ProficiencyLevel) => {
    setProficiencyLevelState(lvl);
  };

  const startLesson = (lesson: LessonNode) => {
    setCurrentLesson(lesson);
    setCurrentCategory(lesson.category);
    setActiveView('arena');
    setHearts(3);
    setStreak(0);
    setTurnTimer(TURN_TIME_LIMIT);

    // Initial greeting tailored to lesson title & category
    const initialGreeting = lesson.category === 'FOOD_ORDERING'
      ? "Ciao! Benvenuto al bar di Napoli. Cosa desideri ordinare oggi?"
      : lesson.category === 'NUMBERS'
      ? "Ciao! Vediamo quanti euro hai in tasca. Quanto fa venticinque più quindici?"
      : lesson.category === 'DATES_CALENDAR'
      ? "Ciao! Dimmi, qual è la tua data di nascita o il tuo giorno preferito?"
      : lesson.category === 'DIRECTIONS'
      ? "Scusi! Mi siamo persi a Napoli. Come arriviamo in Piazza del Plebiscito?"
      : "Ciao! Parliamo un po' di italiano oggi. Come stai?";

    const initialTranslation = lesson.category === 'FOOD_ORDERING'
      ? "Hello! Welcome to the bar in Naples. What would you like to order today?"
      : lesson.category === 'NUMBERS'
      ? "Hello! Let's see how many euros you have. How much is twenty-five plus fifteen?"
      : lesson.category === 'DATES_CALENDAR'
      ? "Hello! Tell me, what is your date of birth or your favorite day?"
      : lesson.category === 'DIRECTIONS'
      ? "Excuse me! We are lost in Naples. How do we get to Piazza del Plebiscito?"
      : "Hello! Let's chat a bit in Italian today. How are you?";

    const initialTurn: Turn = {
      id: `lesson-init-${Date.now()}`,
      timestamp: Date.now(),
      userInput: '',
      evaluation: {
        italianResponse: initialGreeting,
        englishTranslation: initialTranslation,
        isCorrect: true,
        heartsDeducted: 0,
        corrections: [],
        idiomsAndTooltips: [
          {
            phrase: "Chi ben comincia è a metà dell'opera",
            literalMeaning: "Who begins well is half through the work",
            contextualMeaning: "A good start is half the battle"
          }
        ],
        analytics: {
          xpEarned: 0,
          category: lesson.category,
          accuracyPercentage: 100
        }
      },
      comboMultiplier: 1,
      heartsRemaining: 3
    };

    setCurrentTurn(initialTurn);
    setHistory([initialTurn]);
    setIsTimerRunning(true);
    speakResponse(initialGreeting);
  };

  const returnToHub = () => {
    stopSpeaking();
    setIsTimerRunning(false);
    setActiveView('hub');
  };

  const handleTimerTimeout = async () => {
    soundEffects.playHeartLost();
    const newHearts = Math.max(0, hearts - 1);
    setHearts(newHearts);
    setStreak(0);

    const timeoutTurn: Turn = {
      id: `turn-timeout-${Date.now()}`,
      timestamp: Date.now(),
      userInput: "[TIME EXPIRED / TEMPO SCADUTO]",
      evaluation: {
        italianResponse: "Tempo scaduto! In Italia il tempo vola e la conversazione non aspetta. Hai perso un cuore!",
        englishTranslation: "Time expired! In Italy time flies and conversation doesn't wait. You lost a heart!",
        isCorrect: false,
        heartsDeducted: 1,
        corrections: [
          {
            userMistake: "45s Timer Expired",
            suggestedFix: "Answer quickly!",
            explanation: "The 45-second turn timer expired before you sent a response."
          }
        ],
        idiomsAndTooltips: [
          {
            phrase: "Chi dorme non piglia pesci",
            literalMeaning: "Who sleeps catches no fish",
            contextualMeaning: "You snooze, you lose"
          }
        ],
        analytics: {
          xpEarned: 0,
          category: currentCategory,
          accuracyPercentage: 0
        }
      },
      comboMultiplier: 1,
      heartsRemaining: newHearts
    };

    setCurrentTurn(timeoutTurn);
    setHistory(prev => [timeoutTurn, ...prev]);
    speakResponse(timeoutTurn.evaluation.italianResponse);

    if (newHearts === 0) {
      soundEffects.playGameOver();
      setIsDefibrillatorOpen(true);
      setIsTimerRunning(false);
    } else {
      setTurnTimer(TURN_TIME_LIMIT);
      setIsTimerRunning(true);
    }
  };

  const submitTurn = async (userInput: string) => {
    if (!userInput.trim() || isEvaluating || hearts === 0) return;
    
    setIsTimerRunning(false);
    setIsEvaluating(true);
    stopSpeaking();

    const conversationContext = history.slice(0, 5).map(t => [
      { role: 'user' as const, text: t.userInput },
      { role: 'model' as const, text: t.evaluation.italianResponse }
    ]).flat();

    try {
      const evaluation: GeminiEvaluationResponse = await evaluateTurnWithGemini(
        userInput,
        currentCategory,
        conversationContext
      );

      let newHearts = hearts;
      let newStreak = streak;

      if (evaluation.isCorrect) {
        soundEffects.playCorrectAnswer();
        newStreak += 1;
        const currentMult = newStreak >= 5 ? 3 : newStreak >= 3 ? 2 : 1;
        
        if (newStreak === 3 || newStreak === 5) {
          soundEffects.playComboUp(currentMult);
        }

        const earnedXP = Math.round(evaluation.analytics.xpEarned * currentMult);
        setXp(prev => prev + earnedXP);
        setStreak(newStreak);

        // Mark lesson completed if 3 correct streak in lesson
        if (currentLesson && newStreak >= 3 && !completedLessons.includes(currentLesson.id)) {
          setCompletedLessons(prev => [...prev, currentLesson.id]);
        }
      } else {
        soundEffects.playHeartLost();
        newHearts = Math.max(0, hearts - evaluation.heartsDeducted);
        newStreak = 0;
        setHearts(newHearts);
        setStreak(0);
      }

      const turnRecord: Turn = {
        id: `turn-${Date.now()}`,
        timestamp: Date.now(),
        userInput,
        evaluation,
        comboMultiplier: newStreak >= 5 ? 3 : newStreak >= 3 ? 2 : 1,
        heartsRemaining: newHearts
      };

      setCurrentTurn(turnRecord);
      setHistory(prev => [turnRecord, ...prev]);

      // Telemetry updates
      const totalTurnsCount = history.length + 1;
      const correctTurnsCount = history.filter(h => h.evaluation.isCorrect).length + (evaluation.isCorrect ? 1 : 0);
      const rollingAccuracy = Math.round((correctTurnsCount / totalTurnsCount) * 100);

      setTelemetryData(prev => [
        ...prev,
        {
          turnIndex: totalTurnsCount,
          accuracy: rollingAccuracy,
          xpVelocity: evaluation.analytics.xpEarned * (newStreak >= 5 ? 3 : newStreak >= 3 ? 2 : 1),
          category: currentCategory,
          timestamp: Date.now()
        }
      ]);

      speakResponse(evaluation.italianResponse);

      if (newHearts === 0) {
        soundEffects.playGameOver();
        setIsDefibrillatorOpen(true);
      } else {
        setTurnTimer(TURN_TIME_LIMIT);
        setIsTimerRunning(true);
      }

    } catch (error) {
      console.error("Turn submission error:", error);
    } finally {
      setIsEvaluating(false);
    }
  };

  const setCategory = (cat: Category) => {
    setCurrentCategory(cat);
  };

  const toggleTelemetryDrawer = () => {
    setIsTelemetryOpen(prev => !prev);
  };

  const openPlacementModal = () => {
    setIsPlacementOpen(true);
  };

  const closePlacementModal = () => {
    setIsPlacementOpen(false);
  };

  const onDefibrillatorSuccess = () => {
    soundEffects.playDefibrillatorRevive();
    setHearts(2);
    setIsDefibrillatorOpen(false);
    setTurnTimer(TURN_TIME_LIMIT);
    setIsTimerRunning(true);
  };

  const resetRun = () => {
    setHearts(3);
    setStreak(0);
    setTurnTimer(TURN_TIME_LIMIT);
    setIsDefibrillatorOpen(false);
    setIsTimerRunning(true);
  };

  return (
    <GameContext.Provider
      value={{
        hearts,
        xp,
        streak,
        comboMultiplier,
        currentCategory,
        proficiencyLevel,
        completedLessons,
        activeView,
        turnTimer,
        isTimerRunning,
        isEvaluating,
        isSpeaking,
        isDefibrillatorOpen,
        isTelemetryOpen,
        isPlacementOpen,
        currentTurn,
        currentLesson,
        history,
        telemetryData,
        setCategory,
        setProficiencyLevel,
        startLesson,
        returnToHub,
        submitTurn,
        handleTimerTimeout,
        toggleTelemetryDrawer,
        openPlacementModal,
        closePlacementModal,
        onDefibrillatorSuccess,
        resetRun,
        speakLatestResponse,
        stopSpeaking
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error("useGame must be used within GameProvider");
  return ctx;
};
