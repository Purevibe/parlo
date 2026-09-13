import React, { useState } from 'react';
import { LessonNode, Category, ProficiencyLevel } from '../types/game';
import { LESSON_NODES } from '../data/lessons';
import { Coffee, Hash, Calendar, Compass, MessageSquare, Play, Lock, CheckCircle2, Sparkles, HelpCircle, Award, Brain } from 'lucide-react';

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
  const [selectedLesson, setSelectedLesson] = useState<LessonNode>(LESSON_NODES[0]);
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
              <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Your Assigned Level</p>
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
            Learning Roadmap & Levels
          </h3>
          <span className="text-[10px] text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/40 font-mono">
            {completedLessons.length} / {LESSON_NODES.length} Completed
          </span>
        </div>

        {/* Stepping Path Nodes */}
        <div className="relative flex flex-col items-center space-y-6 py-2">
          
          {/* Vertical Connecting Path Line */}
          <div className="absolute top-6 bottom-6 w-1 bg-slate-800 left-1/2 -translate-x-1/2 -z-0" />

          {LESSON_NODES.map((lesson, idx) => {
            const isSelected = selectedLesson.id === lesson.id;
            const isCompleted = completedLessons.includes(lesson.id);
            const isUnlocked = lesson.unlocked || idx === 0 || completedLessons.includes(LESSON_NODES[idx - 1]?.id);

            // Zigzag alignment for Duolingo feel
            const offsetClass = idx % 2 === 0 ? '-translate-x-4' : 'translate-x-4';

            return (
              <div
                key={lesson.id}
                className={`relative z-10 flex items-center space-x-3 transition-transform ${offsetClass}`}
              >
                <button
                  onClick={() => setSelectedLesson(lesson)}
                  className={`w-16 h-16 rounded-full border-4 flex items-center justify-center shadow-xl transition-all duration-300 ${
                    isSelected
                      ? 'border-emerald-400 bg-emerald-500 text-slate-950 scale-110 ring-4 ring-emerald-500/30 shadow-[0_0_25px_rgba(16,185,129,0.6)]'
                      : isCompleted
                      ? 'border-amber-400 bg-amber-500/20 text-amber-300'
                      : isUnlocked
                      ? 'border-slate-700 bg-slate-800 text-slate-200 hover:border-emerald-500/50'
                      : 'border-slate-800 bg-slate-950 text-slate-600 opacity-60'
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

                {/* Quick Tooltip Badge */}
                <div className={`p-2.5 rounded-2xl border text-left max-w-[180px] shadow-lg ${
                  isSelected 
                    ? 'bg-slate-900 border-emerald-500/50' 
                    : 'bg-slate-950/80 border-slate-800'
                }`}>
                  <p className="text-xs font-bold text-slate-100 line-clamp-1">{lesson.title}</p>
                  <p className="text-[10px] text-slate-400 line-clamp-1">{lesson.subtitle}</p>
                </div>
              </div>
            );
          })}

        </div>
      </div>

      {/* Selected Lesson Focus Card & CTA */}
      <div className="bg-slate-900 border-2 border-emerald-500/40 rounded-3xl p-5 shadow-2xl space-y-4">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <div className="inline-flex items-center space-x-1.5 bg-emerald-950/80 border border-emerald-500/30 text-emerald-400 text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
              {renderIcon(selectedLesson.iconName, "w-3 h-3")}
              <span>{selectedLesson.difficulty} • +{selectedLesson.xpReward} XP</span>
            </div>
            <h3 className="text-xl font-extrabold text-slate-100 font-display">
              {selectedLesson.title}
            </h3>
            <p className="text-xs text-emerald-400 font-medium">
              {selectedLesson.subtitle}
            </p>
          </div>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/70 p-3 rounded-2xl border border-slate-800">
          {selectedLesson.description}
        </p>

        {/* Sample Target Phrases */}
        <div className="space-y-1.5">
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Target Phrases & Vocabulary:</p>
          <div className="flex flex-wrap gap-1.5">
            {selectedLesson.samplePhrases.map((phrase, i) => (
              <span key={i} className="text-[11px] bg-slate-950 text-slate-200 border border-slate-800 px-2.5 py-1 rounded-xl">
                "{phrase}"
              </span>
            ))}
          </div>
        </div>

        {/* Start Lesson Button */}
        <button
          onClick={() => onSelectLesson(selectedLesson)}
          className="w-full py-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-sm uppercase tracking-wider transition-all duration-300 shadow-[0_0_20px_rgba(16,185,129,0.4)] flex items-center justify-center space-x-2"
        >
          <Play className="w-5 h-5 fill-slate-950" />
          <span>Start Survival Lesson</span>
        </button>
      </div>

    </div>
  );
};
