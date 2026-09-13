import React, { useState, useMemo } from 'react';
import { ProficiencyLevel } from '../types/game';
import { Sparkles, Award, Brain, ArrowRight, X } from 'lucide-react';
import { soundEffects } from '../services/soundEffects';

interface PlacementModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCompletePlacement: (level: ProficiencyLevel, focusCategory?: string) => void;
}

interface RawOption {
  label: string;
  isCorrect: boolean;
  explanation: string;
}

interface RawQuestion {
  id: number;
  category: 'CONVERSATION' | 'FOOD' | 'NUMBERS' | 'TIME' | 'GRAMMAR';
  questionText: string;
  options: RawOption[];
}

const RAW_DIAGNOSTIC_QUESTIONS: RawQuestion[] = [
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
    id: 3,
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
    id: 4,
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
    id: 5,
    category: 'TIME',
    questionText: "What time is 'Le sette e un quarto'?",
    options: [
      { label: "7:15", isCorrect: true, explanation: "7 (sette) and a quarter (un quarto) = 7:15." },
      { label: "7:30", isCorrect: false, explanation: "7:30 is 'Le sette e mezza'." },
      { label: "7:45", isCorrect: false, explanation: "7:45 is 'Le otto meno un quarto'." },
      { label: "6:45", isCorrect: false, explanation: "6:45 is 'Le sette meno un quarto'." },
    ]
  }
];

// Helper to shuffle array randomly
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export const PlacementModal: React.FC<PlacementModalProps> = ({
  isOpen,
  onClose,
  onCompletePlacement,
}) => {
  const [currentIdx, setCurrentIdx] = useState<number>(0);
  const [selectedOptionIdx, setSelectedOptionIdx] = useState<number | null>(null);
  const [answers, setAnswers] = useState<{ category: string; isCorrect: boolean }[]>([]);
  const [isFinished, setIsFinished] = useState<boolean>(false);
  const [feedbackMsg, setFeedbackMsg] = useState<{ isCorrect: boolean; text: string } | null>(null);

  // Shuffle question options every time modal opens or resets
  const questions = useMemo(() => {
    return RAW_DIAGNOSTIC_QUESTIONS.map(q => ({
      ...q,
      options: shuffleArray(q.options)
    }));
  }, [isOpen]);

  if (!isOpen) return null;

  const currentQ = questions[currentIdx];

  const handleSelectOption = (idx: number) => {
    if (selectedOptionIdx !== null) return;
    setSelectedOptionIdx(idx);
    
    const chosen = currentQ.options[idx];
    const isCorrect = chosen.isCorrect;

    if (isCorrect) {
      soundEffects.playCorrectAnswer();
    } else {
      soundEffects.playHeartLost();
    }

    setFeedbackMsg({
      isCorrect,
      text: isCorrect ? `Correct! ${chosen.explanation}` : `Incorrect. ${chosen.explanation}`
    });
  };

  const handleNext = () => {
    if (selectedOptionIdx === null) return;

    const chosen = currentQ.options[selectedOptionIdx];
    const newAnswers = [...answers, { category: currentQ.category, isCorrect: chosen.isCorrect }];
    setAnswers(newAnswers);

    setSelectedOptionIdx(null);
    setFeedbackMsg(null);

    if (currentIdx + 1 < questions.length) {
      setCurrentIdx(prev => prev + 1);
    } else {
      setIsFinished(true);
    }
  };

  // Calculate diagnostic result
  const totalCorrect = answers.filter(a => a.isCorrect).length;
  const numbersCorrect = answers.filter(a => a.category === 'NUMBERS' && a.isCorrect).length;
  const conversationCorrect = answers.filter(a => (a.category === 'CONVERSATION' || a.category === 'FOOD') && a.isCorrect).length;

  let assignedLevel: ProficiencyLevel = 'A1_BEGINNER';
  let focusRecommendation = '';

  if (totalCorrect >= 4) {
    assignedLevel = 'B1_INTERMEDIATE';
  } else if (totalCorrect >= 2) {
    assignedLevel = 'A2_ELEMENTARY';
  } else {
    assignedLevel = 'A1_BEGINNER';
  }

  if (numbersCorrect < 2) {
    focusRecommendation = 'NUMBERS';
  }

  const handleComplete = () => {
    onCompletePlacement(assignedLevel, focusRecommendation);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-lg flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-5 relative overflow-hidden">
        
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full bg-slate-800 text-slate-400 hover:text-white"
        >
          <X className="w-4 h-4" />
        </button>

        {!isFinished ? (
          <div className="space-y-4">
            
            {/* Header */}
            <div className="text-center space-y-1">
              <div className="inline-flex p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 mb-1">
                <Brain className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-black text-slate-100 font-display">
                Italian Placement Diagnostic
              </h3>
              <p className="text-xs text-slate-400">
                Question {currentIdx + 1} of {questions.length}: Test your real skills
              </p>
            </div>

            {/* Progress Bar */}
            <div className="h-1.5 w-full bg-slate-950 rounded-full overflow-hidden border border-slate-800">
              <div
                className="h-full bg-emerald-500 transition-all duration-300"
                style={{ width: `${((currentIdx + 1) / questions.length) * 100}%` }}
              />
            </div>

            {/* Diagnostic Question Card */}
            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-3">
              <p className="text-sm font-bold text-slate-100 font-sans leading-relaxed">
                {currentQ.questionText}
              </p>

              <div className="space-y-2">
                {currentQ.options.map((opt, idx) => {
                  const isSelected = selectedOptionIdx === idx;
                  let borderStyle = "border-slate-800 bg-slate-900 text-slate-200 hover:border-slate-700";

                  if (selectedOptionIdx !== null) {
                    if (opt.isCorrect) {
                      borderStyle = "border-emerald-500 bg-emerald-950/60 text-emerald-300 font-bold";
                    } else if (isSelected) {
                      borderStyle = "border-rose-500 bg-rose-950/60 text-rose-300 font-bold";
                    } else {
                      borderStyle = "border-slate-800 bg-slate-950 text-slate-600 opacity-50";
                    }
                  }

                  return (
                    <button
                      key={idx}
                      disabled={selectedOptionIdx !== null}
                      onClick={() => handleSelectOption(idx)}
                      className={`w-full text-left p-3.5 rounded-xl border text-xs transition-all ${borderStyle}`}
                    >
                      {opt.label}
                    </button>
                  );
                })}
              </div>

              {/* Instant Feedback Message */}
              {feedbackMsg && (
                <div className={`p-3 rounded-xl text-xs font-medium ${
                  feedbackMsg.isCorrect 
                    ? 'bg-emerald-950/80 border border-emerald-800 text-emerald-300'
                    : 'bg-rose-950/80 border border-rose-900 text-rose-300'
                }`}>
                  {feedbackMsg.text}
                </div>
              )}
            </div>

            {/* Next Question Button */}
            {selectedOptionIdx !== null && (
              <button
                onClick={handleNext}
                className="w-full py-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs uppercase tracking-wider transition-all duration-300 shadow-[0_0_15px_rgba(16,185,129,0.3)] flex items-center justify-center space-x-2 animate-in fade-in"
              >
                <span>{currentIdx + 1 === questions.length ? "View My Assessment Results" : "Next Question"}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}

          </div>
        ) : (
          /* Diagnostic Results Breakdown */
          <div className="text-center space-y-4 py-2 animate-in fade-in zoom-in-95 duration-200">
            <div className="inline-flex p-4 rounded-3xl bg-emerald-500/10 border border-emerald-500/40 text-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.3)]">
              <Award className="w-10 h-10" />
            </div>

            <div className="space-y-1">
              <h3 className="text-2xl font-black text-slate-100 font-display">
                Diagnostic Complete!
              </h3>
              <p className="text-xs text-slate-300">
                You scored <strong className="text-emerald-400 font-mono text-sm">{totalCorrect} / {questions.length}</strong> correct.
              </p>
            </div>

            {/* Skill Breakdown */}
            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 text-xs space-y-2 text-left">
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Skill Diagnosis:</p>
              
              <div className="flex items-center justify-between p-2 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-slate-200">Conversation & Food Etiquette</span>
                <span className={`font-bold ${conversationCorrect >= 1 ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {conversationCorrect >= 1 ? 'Solid (Passed)' : 'Needs Practice'}
                </span>
              </div>

              <div className="flex items-center justify-between p-2 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-slate-200">Italian Numbers & Math</span>
                <span className={`font-bold ${numbersCorrect >= 2 ? 'text-emerald-400' : 'text-amber-400 font-mono'}`}>
                  {numbersCorrect >= 2 ? 'Mastered' : 'Needs Practice!'}
                </span>
              </div>
            </div>

            {/* Customized Recommendation */}
            <div className="bg-gradient-to-r from-amber-950/40 to-slate-900 border border-amber-500/40 p-3.5 rounded-2xl text-left space-y-1 text-xs">
              <div className="flex items-center space-x-1.5 text-amber-300 font-bold">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>Personalized Starting Level:</span>
              </div>
              <p className="text-slate-200 font-medium">
                Assigned to <strong className="text-emerald-400">Level 2: I Numeri e il Conto</strong> to sharpen your Italian numbers & prices!
              </p>
            </div>

            <button
              onClick={handleComplete}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-sm uppercase tracking-wider transition-all duration-300 shadow-[0_0_20px_rgba(16,185,129,0.4)] flex items-center justify-center space-x-2"
            >
              <span>Unlock My Customized Path</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
