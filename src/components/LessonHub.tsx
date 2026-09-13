import React, { useState } from 'react';
import { LessonNode, ProficiencyLevel } from '../types/game';
import { LESSON_NODES } from '../data/lessons';
import { Coffee, Hash, Calendar, Compass, MessageSquare, Play, Lock, CheckCircle2, Sparkles, HelpCircle, Award, Brain, X, ArrowRight } from 'lucide-react';

interface LessonHubProps {
  proficiencyLevel: ProficiencyLevel;
  completedLessons: string[];
  onSelectLesson: (lesson: LessonNode) => void;
  onOpenPlacementModal: () => void;
}

export const LessonHub: React.FC<LessonHubProps> = ({
  proficiencyLevel,
  completedLessons,
  onSelectLesson,
  onOpenPlacementModal,
}) => {
  const [activeModalLesson, setActiveModalLesson] = useState<LessonNode | null>(null);
  const [showHowToPlay, setShowHowToPlay] = useState<boolean>(false);

  const renderIcon = (iconName: string, className: string) => {
    switch (iconName) {
      case 'Coffee': return <Coffee className={className} />;
      case 'Hash': return <Hash className={className} />;
      case 'Calendar': return <Calendar className={className} />;
      case 'Compass': return <Compass className={className} />;
      case 'MessageSquare': return <MessageSquare className={className} />;
      default: return <Sparkles className={className} />;
    }
  };

  const getLevelLabel = (lvl: ProficiencyLevel) => {
    switch (lvl) {
      case 'A1_BEGINNER': return 'A1 Beginner';
      case 'A2_ELEMENTARY': return 'A2 Elementary';
      case 'B1_INTERMEDIATE': return 'B1 Intermediate';
      case 'B2_ADVANCED': return 'B2 Advanced';
    }
  };

  const handleNodeClick = (lesson: LessonNode, isUnlocked: boolean) => {
    if (!isUnlocked) return;
    // Show clean lesson preview modal for immediate launch
    setActiveModalLesson(lesson);
  };

  const handleStartDirectly = (lesson: LessonNode) => {
    setActiveModalLesson(null);
    onSelectLesson(lesson);
  };

  return (
    <div className="flex-1 max-w-md mx-auto w-full px-4 py-4 space-y-5 overflow-y-auto pb-28">
      
      {/* Top Banner: Placement & Level Status */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-slate-950 p-4 rounded-3xl border border-slate-800 shadow-xl space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Your Level</p>
              <h2 className="text-sm font-extrabold text-slate-100 font-display">
                {getLevelLabel(proficiencyLevel)}
              </h2>
            </div>
          </div>

          <button
            onClick={onOpenPlacementModal}
            className="flex items-center space-x-1 text-xs bg-slate-800 hover:bg-slate-700 text-amber-300 px-3 py-1.5 rounded-xl border border-amber-500/30 transition-all font-semibold"
          >
            <Brain className="w-3.5 h-3.5" />
            <span>Placement Test</span>
          </button>
        </div>

        {/* How To Play Toggle */}
        <button
          onClick={() => setShowHowToPlay(!showHowToPlay)}
          className="w-full flex items-center justify-between text-xs text-slate-300 bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/80 hover:border-slate-700 transition-colors"
        >
          <div className="flex items-center space-x-1.5 text-emerald-400 font-medium">
            <HelpCircle className="w-4 h-4" />
            <span>How Maestro Marco Works (Game Rules)</span>
          </div>
          <span className="text-slate-500 font-bold">{showHowToPlay ? 'Hide' : 'Show'}</span>
        </button>

        {showHowToPlay && (
          <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 text-xs text-slate-300 space-y-2 text-left animate-in fade-in duration-200">
            <div className="flex items-center space-x-2 text-rose-400 font-bold">
              <span>❤️ 3 Hearts Survival</span>
            </div>
            <p className="text-[11px] text-slate-400">
              You start each run with 3 Hearts. Grammar errors, number/time fumbles, or letting the 45s timer expire deduct 1 Heart. Reach 0 Hearts to trigger the sudden-death <strong>Caffè Defibrillator Drill</strong>!
            </p>
            <div className="flex items-center space-x-2 text-amber-400 font-bold pt-1">
              <span>🔥 Fiamma & Campione Combos</span>
            </div>
            <p className="text-[11px] text-slate-400">
              3 correct turns activates <strong>Fiamma Mode (2x XP)</strong>. 5 correct turns hits <strong>Campione Mode (3x XP)</strong>!
            </p>
          </div>
        )}
      </div>

      {/* Visual Duolingo-Style Lesson Roadmap Path */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 font-display">
            Tap a Lesson Node to Start
          </h3>
          <span className="text-[10px] text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/40 font-mono">
            {completedLessons.length} / {LESSON_NODES.length} Completed
          </span>
        </div>

        {/* Stepping Path Nodes */}
        <div className="relative flex flex-col items-center space-y-7 py-4">
          
          {/* Vertical Connecting Path Line */}
          <div className="absolute top-6 bottom-6 w-1.5 bg-slate-800 left-1/2 -translate-x-1/2 -z-0 rounded-full" />

          {LESSON_NODES.map((lesson, idx) => {
            const isCompleted = completedLessons.includes(lesson.id);
            const isUnlocked = lesson.unlocked || idx === 0 || completedLessons.includes(LESSON_NODES[idx - 1]?.id);

            // Alternating offset for Duolingo path feel
            const offsetClass = idx % 2 === 0 ? '-translate-x-6' : 'translate-x-6';

            return (
              <div
                key={lesson.id}
                className={`relative z-10 flex items-center space-x-3 transition-transform ${offsetClass}`}
              >
                <button
                  onClick={() => handleNodeClick(lesson, isUnlocked)}
                  disabled={!isUnlocked}
                  className={`w-16 h-16 rounded-full border-4 flex items-center justify-center shadow-xl transition-all duration-300 ${
                    isCompleted
                      ? 'border-amber-400 bg-amber-500/20 text-amber-300 hover:scale-105'
                      : isUnlocked
                      ? 'border-emerald-400 bg-emerald-500 text-slate-950 hover:scale-110 ring-4 ring-emerald-500/30 shadow-[0_0_20px_rgba(16,185,129,0.5)]'
                      : 'border-slate-800 bg-slate-950 text-slate-600 opacity-50 cursor-not-allowed'
                  }`}
                >
                  {isCompleted ? (
                    <CheckCircle2 className="w-8 h-8 text-amber-400" />
                  ) : !isUnlocked ? (
                    <Lock className="w-6 h-6" />
                  ) : (
                    renderIcon(lesson.iconName, "w-7 h-7")
                  )}
                </button>

                {/* Node Title Badge */}
                <div 
                  onClick={() => handleNodeClick(lesson, isUnlocked)}
                  className={`p-3 rounded-2xl border text-left max-w-[170px] shadow-lg cursor-pointer transition-all ${
                    isUnlocked 
                      ? 'bg-slate-900 border-slate-700 hover:border-emerald-500/60' 
                      : 'bg-slate-950/80 border-slate-800 opacity-60'
                  }`}
                >
                  <p className="text-xs font-bold text-slate-100 line-clamp-1">{lesson.title}</p>
                  <p className="text-[10px] text-slate-400 line-clamp-1">{lesson.subtitle}</p>
                </div>
              </div>
            );
          })}

        </div>
      </div>

      {/* Immediate Lesson Preview Modal Sheet */}
      {activeModalLesson && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-end sm:items-center justify-center p-4">
          <div className="max-w-md w-full bg-slate-900 border-2 border-emerald-500/60 rounded-3xl p-6 shadow-2xl space-y-4 relative animate-in fade-in slide-in-from-bottom-6 duration-200">
            
            <button
              onClick={() => setActiveModalLesson(null)}
              className="absolute top-4 right-4 p-1.5 rounded-full bg-slate-800 text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="space-y-1">
              <div className="inline-flex items-center space-x-1.5 bg-emerald-950/80 border border-emerald-500/30 text-emerald-400 text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider mb-1">
                {renderIcon(activeModalLesson.iconName, "w-3 h-3")}
                <span>{activeModalLesson.difficulty} • +{activeModalLesson.xpReward} XP</span>
              </div>
              <h3 className="text-2xl font-black text-slate-100 font-display">
                {activeModalLesson.title}
              </h3>
              <p className="text-xs text-emerald-400 font-medium">
                {activeModalLesson.subtitle}
              </p>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed bg-slate-950 p-3.5 rounded-2xl border border-slate-800">
              {activeModalLesson.description}
            </p>

            {/* Target Vocabulary */}
            <div className="space-y-1.5">
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Target Vocabulary:</p>
              <div className="flex flex-wrap gap-1.5">
                {activeModalLesson.samplePhrases.map((phrase, i) => (
                  <span key={i} className="text-[11px] bg-slate-950 text-slate-200 border border-slate-800 px-2.5 py-1 rounded-xl">
                    "{phrase}"
                  </span>
                ))}
              </div>
            </div>

            {/* Big Launch Button */}
            <button
              onClick={() => handleStartDirectly(activeModalLesson)}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-sm uppercase tracking-wider transition-all duration-300 shadow-[0_0_20px_rgba(16,185,129,0.4)] flex items-center justify-center space-x-2"
            >
              <Play className="w-5 h-5 fill-slate-950" />
              <span>Start Survival Lesson Now</span>
            </button>

          </div>
        </div>
      )}

    </div>
  );
};
