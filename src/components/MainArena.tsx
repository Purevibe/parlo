import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { FeedbackCard } from './FeedbackCard';
import { Volume2, VolumeX, ChevronDown, ChevronUp, Clock, Sparkles } from 'lucide-react';

export const MainArena: React.FC = () => {
  const {
    currentTurn,
    turnTimer,
    isTimerRunning,
    isEvaluating,
    isSpeaking,
    speakLatestResponse,
    stopSpeaking,
    hearts
  } = useGame();

  const [showTranslation, setShowTranslation] = useState<boolean>(false);

  // Timer Percentage for progress ring/bar (45s max)
  const timerPercentage = Math.max(0, Math.min(100, (turnTimer / 45) * 100));
  const isTimerLow = turnTimer <= 10;

  const evaluation = currentTurn?.evaluation;

  return (
    <div className="flex-1 max-w-md mx-auto w-full px-4 py-3 space-y-4 overflow-y-auto pb-32">
      
      {/* 45-Second Turn Timer Bar */}
      <div className="bg-slate-950/80 p-2.5 rounded-2xl border border-slate-800 shadow-md space-y-1.5">
        <div className="flex items-center justify-between text-xs px-1 font-mono">
          <div className="flex items-center space-x-1.5 text-slate-300">
            <Clock className={`w-3.5 h-3.5 ${isTimerLow ? 'text-rose-500 animate-bounce' : 'text-emerald-400'}`} />
            <span className="font-bold">Turn Timer</span>
          </div>
          <span className={`font-black text-sm ${
            isTimerLow ? 'text-rose-500 animate-pulse-fast' : 'text-slate-100'
          }`}>
            {turnTimer}s
          </span>
        </div>

        {/* Circular / Bar Progress */}
        <div className="h-2 w-full bg-slate-900 rounded-full overflow-hidden p-0.5 border border-slate-800">
          <div
            className={`h-full rounded-full transition-all duration-1000 ${
              isTimerLow 
                ? 'bg-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.8)]' 
                : turnTimer <= 20 
                ? 'bg-amber-500' 
                : 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]'
            }`}
            style={{ width: `${timerPercentage}%` }}
          />
        </div>
      </div>

      {/* Maestro Marco Avatar & Speech Arena */}
      <div className="relative bg-gradient-to-b from-slate-900 to-slate-950 rounded-3xl border border-slate-800 p-5 shadow-2xl space-y-4 overflow-hidden">
        
        {/* Glow ambient background behind avatar */}
        <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Top: Avatar & Audio Control */}
        <div className="flex items-start space-x-4">
          
          {/* Animated Maestro Marco SVG Avatar */}
          <div className="relative shrink-0">
            <div className={`w-16 h-16 rounded-2xl bg-slate-800 border-2 flex items-center justify-center shadow-lg transition-all duration-300 ${
              isSpeaking 
                ? 'border-emerald-400 ring-4 ring-emerald-500/20 scale-105' 
                : evaluation?.isCorrect === false
                ? 'border-rose-500 ring-4 ring-rose-500/20'
                : 'border-slate-700'
            }`}>
              {/* Dynamic Maestro Marco SVG */}
              <svg className="w-12 h-12" viewBox="0 0 100 100">
                {/* Italian Beret / Hat */}
                <ellipse cx="50" cy="22" rx="32" ry="10" fill="#0f172a" />
                <path d="M 22 22 Q 50 8 78 22 Z" fill="#1e293b" stroke="#009246" strokeWidth="3" />
                <circle cx="50" cy="10" r="4" fill="#CE2B37" />

                {/* Face */}
                <circle cx="50" cy="48" r="24" fill="#FED7AA" />

                {/* Eyes */}
                {evaluation?.isCorrect === false ? (
                  <>
                    <path d="M 38 42 L 44 46" stroke="#451a03" strokeWidth="2.5" strokeLinecap="round" />
                    <path d="M 56 46 L 62 42" stroke="#451a03" strokeWidth="2.5" strokeLinecap="round" />
                  </>
                ) : (
                  <>
                    <circle cx="41" cy="44" r="3" fill="#451a03" />
                    <circle cx="59" cy="44" r="3" fill="#451a03" />
                  </>
                )}

                {/* Expressive Mustache */}
                <path d="M 32 54 Q 50 62 68 54 Q 50 50 32 54 Z" fill="#292524" />

                {/* Mouth / Spoken animation */}
                {isSpeaking ? (
                  <ellipse cx="50" cy="62" rx="5" ry="4" fill="#991b1b" className="animate-pulse" />
                ) : (
                  <path d="M 44 61 Q 50 65 56 61" stroke="#991b1b" strokeWidth="2" fill="none" />
                )}

                {/* Neapolitan Scarf Accent */}
                <path d="M 32 68 Q 50 78 68 68 L 65 88 L 35 88 Z" fill="#009246" />
                <path d="M 44 68 L 56 68 L 56 88 L 44 88 Z" fill="#F4F5F0" />
                <path d="M 50 68 L 68 68 L 65 88 L 50 88 Z" fill="#CE2B37" />
              </svg>
            </div>

            {/* Status Dot */}
            <span className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-slate-900 ${
              isSpeaking ? 'bg-emerald-400 animate-ping' : 'bg-emerald-500'
            }`} />
          </div>

          {/* Name & Title */}
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <h2 className="font-extrabold text-base text-slate-100 font-display">
                Maestro Marco
              </h2>
              <button
                onClick={() => isSpeaking ? stopSpeaking() : speakLatestResponse()}
                className={`p-2 rounded-xl border transition-all ${
                  isSpeaking
                    ? 'bg-emerald-500 text-slate-950 border-emerald-400 animate-pulse'
                    : 'bg-slate-800 text-slate-300 border-slate-700 hover:text-white hover:bg-slate-700'
                }`}
                title={isSpeaking ? "Mute Voice" : "Listen to Voice"}
              >
                {isSpeaking ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </button>
            </div>
            <p className="text-xs text-emerald-400 font-medium flex items-center space-x-1 mt-0.5">
              <Sparkles className="w-3 h-3 text-amber-400" />
              <span>Neapolitan Language & Culture Master</span>
            </p>
          </div>

        </div>

        {/* Spoken Speech Balloon in Italian */}
        <div className="relative bg-slate-800/90 border border-slate-700/80 rounded-2xl p-4 shadow-lg">
          {/* Speech Bubble Arrow */}
          <div className="absolute -top-2 left-8 w-4 h-4 bg-slate-800 border-t border-l border-slate-700/80 rotate-45" />

          {isEvaluating ? (
            <div className="flex items-center space-x-3 text-amber-400 text-sm font-medium py-2">
              <div className="w-4 h-4 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
              <span>Maestro Marco is analyzing your Italian grammar...</span>
            </div>
          ) : (
            <p className="text-sm md:text-base font-medium text-slate-100 leading-relaxed font-sans">
              "{evaluation?.italianResponse || "Ready for your next sentence?"}"
            </p>
          )}

          {/* Accordion Toggle for English Translation */}
          {evaluation?.englishTranslation && !isEvaluating && (
            <div className="mt-3 pt-3 border-t border-slate-700/60">
              <button
                onClick={() => setShowTranslation(prev => !prev)}
                className="flex items-center space-x-1.5 text-xs text-slate-400 hover:text-amber-300 font-medium transition-colors"
              >
                <span>{showTranslation ? "Hide Translation" : "Show English Translation"}</span>
                {showTranslation ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              </button>

              {showTranslation && (
                <p className="mt-2 text-xs text-slate-300 italic bg-slate-900/60 p-2.5 rounded-xl border border-slate-800">
                  "{evaluation.englishTranslation}"
                </p>
              )}
            </div>
          )}
        </div>

      </div>

      {/* Sidecar Feedback Card */}
      {evaluation && !isEvaluating && (
        <FeedbackCard evaluation={evaluation} />
      )}

    </div>
  );
};
