import React, { useState, useEffect } from 'react';
import { useGame } from '../context/GameContext';
import { soundEffects } from '../services/soundEffects';
import confetti from 'canvas-confetti';
import { Zap, Coffee, ShieldAlert, CheckCircle2, ArrowRight } from 'lucide-react';

interface Question {
  prompt: string;
  expectedAnswer: string;
  alternatives: string[];
}

const DRILL_QUESTIONS: Question[] = [
  { prompt: 'Write in digits the Italian number "Centoquarantacinque"', expectedAnswer: '145', alternatives: ['145'] },
  { prompt: 'Write in digits the Italian number "Trecentosessanta"', expectedAnswer: '360', alternatives: ['360'] },
  { prompt: 'Write in digits the time "Le otto e tre quarti"', expectedAnswer: '8:45', alternatives: ['8:45', '20:45', '8.45', '20.45'] },
  { prompt: 'Write in digits the Italian number "Ottantotto"', expectedAnswer: '88', alternatives: ['88'] },
  { prompt: 'Write in digits the Italian number "Millecinquecento"', expectedAnswer: '1500', alternatives: ['1500', '1.500'] },
];

export const DefibrillatorModal: React.FC = () => {
  const { isDefibrillatorOpen, onDefibrillatorSuccess } = useGame();
  
  const [currentIdx, setCurrentIdx] = useState<number>(0);
  const [userAns, setUserAns] = useState<string>('');
  const [score, setScore] = useState<number>(0);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (isDefibrillatorOpen) {
      setCurrentIdx(0);
      setScore(0);
      setUserAns('');
      setErrorMsg(null);
    }
  }, [isDefibrillatorOpen]);

  if (!isDefibrillatorOpen) return null;

  const currentQ = DRILL_QUESTIONS[currentIdx];

  const handleCheck = () => {
    if (!userAns.trim()) return;
    const clean = userAns.trim().toLowerCase();

    const isMatch = currentQ.alternatives.some(a => a.toLowerCase() === clean);

    if (isMatch) {
      soundEffects.playCorrectAnswer();
      const nextScore = score + 1;
      setScore(nextScore);
      setUserAns('');
      setErrorMsg(null);

      if (currentIdx + 1 >= DRILL_QUESTIONS.length) {
        // Victory!
        confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
        onDefibrillatorSuccess();
      } else {
        setCurrentIdx(prev => prev + 1);
      }
    } else {
      soundEffects.playHeartLost();
      setErrorMsg(`Wrong! The correct answer was "${currentQ.expectedAnswer}". Try again!`);
      setUserAns('');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/95 backdrop-blur-md flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-slate-900 border-2 border-rose-600/80 rounded-3xl p-6 shadow-[0_0_50px_rgba(225,29,72,0.4)] space-y-5 relative overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Glow Top Accent */}
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-amber-500 via-rose-600 to-amber-500" />

        {/* Modal Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center space-x-2 bg-rose-950/80 border border-rose-600/60 px-3 py-1.5 rounded-full text-rose-400 font-mono text-xs font-bold uppercase tracking-wider animate-pulse">
            <Zap className="w-4 h-4 fill-rose-400" />
            <span>Caffè Defibrillator Drill</span>
          </div>
          
          <h2 className="text-2xl font-black text-slate-100 tracking-tight font-display flex items-center justify-center space-x-2">
            <Coffee className="w-6 h-6 text-amber-400" />
            <span>Sudden Death Revival</span>
          </h2>

          <p className="text-xs text-slate-300">
            0 Hearts remaining! Answer <strong className="text-amber-400">5 rapid-fire number questions</strong> to recharge the coffee pot and revive your run!
          </p>
        </div>

        {/* Progress Tracker Bar */}
        <div className="flex items-center space-x-1.5 justify-center">
          {DRILL_QUESTIONS.map((_, i) => (
            <div
              key={i}
              className={`h-2 flex-1 rounded-full transition-all duration-300 ${
                i < score
                  ? 'bg-emerald-400 shadow-[0_0_8px_rgba(16,185,129,0.8)]'
                  : i === currentIdx
                  ? 'bg-rose-500 animate-pulse'
                  : 'bg-slate-800'
              }`}
            />
          ))}
        </div>

        {/* Question Box */}
        <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-3">
          <p className="text-xs text-amber-400 uppercase font-bold tracking-wider">
            Question {currentIdx + 1} of 5:
          </p>
          <p className="text-base font-bold text-slate-100 font-sans">
            {currentQ.prompt}
          </p>

          <input
            type="text"
            value={userAns}
            onChange={(e) => setUserAns(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleCheck()}
            autoFocus
            placeholder="Type your answer here..."
            className="w-full bg-slate-900 border border-slate-700 focus:border-rose-500 text-slate-100 text-center font-mono font-bold text-lg rounded-xl py-3 px-4 outline-none transition-all"
          />

          {errorMsg && (
            <p className="text-xs text-rose-400 bg-rose-950/80 p-2 rounded-lg border border-rose-900 font-medium">
              {errorMsg}
            </p>
          )}
        </div>

        {/* Action Button */}
        <button
          onClick={handleCheck}
          disabled={!userAns.trim()}
          className="w-full py-4 rounded-2xl bg-gradient-to-r from-rose-600 to-amber-600 hover:from-rose-500 hover:to-amber-500 text-slate-950 font-black text-sm uppercase tracking-wider transition-all duration-300 shadow-[0_0_20px_rgba(225,29,72,0.4)] disabled:opacity-40 flex items-center justify-center space-x-2"
        >
          <span>Confirm & Revive</span>
          <ArrowRight className="w-4 h-4" />
        </button>

      </div>
    </div>
  );
};
