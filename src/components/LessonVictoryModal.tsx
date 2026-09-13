import React from 'react';
import { LessonNode } from '../types/game';
import confetti from 'canvas-confetti';
import { Award, Trophy, Compass, Sparkles, CheckCircle2 } from 'lucide-react';

interface LessonVictoryModalProps {
  isOpen: boolean;
  lesson: LessonNode | null;
  xpEarned: number;
  accuracy: number;
  onReturnToMap: () => void;
}

export const LessonVictoryModal: React.FC<LessonVictoryModalProps> = ({
  isOpen,
  lesson,
  xpEarned,
  accuracy,
  onReturnToMap,
}) => {
  if (!isOpen || !lesson) return null;

  // Trigger confetti on render
  confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } });

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-lg flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-slate-900 border-2 border-emerald-500 rounded-3xl p-6 shadow-[0_0_50px_rgba(16,185,129,0.4)] text-center space-y-5 relative overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Glow Header Accent */}
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-emerald-400 via-amber-400 to-emerald-400" />

        <div className="inline-flex p-4 rounded-3xl bg-emerald-500/10 border border-emerald-500/40 text-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.3)]">
          <Trophy className="w-12 h-12 text-amber-400 animate-bounce" />
        </div>

        <div className="space-y-1">
          <div className="inline-flex items-center space-x-1 bg-amber-500/20 text-amber-300 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border border-amber-500/30">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Lesson Completed!</span>
          </div>
          <h2 className="text-2xl font-black text-slate-100 font-display">
            {lesson.title}
          </h2>
          <p className="text-xs text-emerald-400 font-medium">
            You successfully completed all {lesson.targetTurns || 5} turns!
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3 bg-slate-950 p-4 rounded-2xl border border-slate-800">
          <div className="text-center p-2 rounded-xl bg-slate-900 border border-slate-800">
            <p className="text-[10px] text-slate-400 uppercase font-bold">XP Bonus Earned</p>
            <p className="text-xl font-black text-amber-400 font-mono">+{xpEarned + lesson.xpReward} XP</p>
          </div>
          <div className="text-center p-2 rounded-xl bg-slate-900 border border-slate-800">
            <p className="text-[10px] text-slate-400 uppercase font-bold">Accuracy Score</p>
            <p className="text-xl font-black text-emerald-400 font-mono">{accuracy}%</p>
          </div>
        </div>

        <button
          onClick={onReturnToMap}
          className="w-full py-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-sm uppercase tracking-wider transition-all duration-300 shadow-[0_0_20px_rgba(16,185,129,0.4)] flex items-center justify-center space-x-2"
        >
          <Compass className="w-5 h-5" />
          <span>Return to Roadmap Map</span>
        </button>

      </div>
    </div>
  );
};
