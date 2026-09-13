import React from 'react';
import { GeminiEvaluationResponse } from '../types/game';
import { AlertTriangle, CheckCircle2, Sparkles, Languages } from 'lucide-react';

interface FeedbackCardProps {
  evaluation: GeminiEvaluationResponse;
}

export const FeedbackCard: React.FC<FeedbackCardProps> = ({ evaluation }) => {
  const { isCorrect, corrections, idiomsAndTooltips } = evaluation;

  return (
    <div className="space-y-3 transition-all duration-300">
      
      {/* Grammar & Mistake Breakdown */}
      {corrections && corrections.length > 0 && (
        <div className="bg-slate-900/95 border border-rose-900/60 rounded-2xl p-4 shadow-xl space-y-3">
          <div className="flex items-center space-x-2 text-rose-400">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <h4 className="text-xs font-bold uppercase tracking-wider font-display">
              Grammar Breakdown & Correction
            </h4>
          </div>

          <div className="space-y-2.5">
            {corrections.map((corr, idx) => (
              <div key={idx} className="bg-slate-950 p-3.5 rounded-xl border border-rose-900/40 text-xs space-y-2">
                
                {/* Mistake vs Fix */}
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="text-rose-400 font-semibold line-through">
                      "{corr.userMistake}"
                    </span>
                    <span className="text-slate-500">➔</span>
                    <span className="text-emerald-400 font-bold bg-emerald-950/70 px-2.5 py-0.5 rounded border border-emerald-800/50">
                      "{corr.suggestedFix}"
                    </span>
                  </div>

                  {/* English Translation of Correct Fix */}
                  <div className="flex items-center space-x-1.5 text-[11px] text-amber-300 italic pt-0.5">
                    <Languages className="w-3.5 h-3.5 text-amber-400 shrink-0 not-italic" />
                    <span>Translation: "{corr.suggestedFixTranslation || "I would like an espresso, please."}"</span>
                  </div>
                </div>

                {/* Explanation */}
                <p className="text-slate-300 leading-relaxed text-[11px] bg-slate-900/80 p-2 rounded-lg border border-slate-800">
                  {corr.explanation}
                </p>

              </div>
            ))}
          </div>
        </div>
      )}

      {/* Success Badge if Correct */}
      {isCorrect && (!corrections || corrections.length === 0) && (
        <div className="bg-emerald-950/30 border border-emerald-500/30 rounded-2xl p-3.5 flex items-center space-x-3 text-emerald-300 shadow-md">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <div>
            <p className="text-xs font-bold">Perfect Grammar!</p>
            <p className="text-[11px] text-emerald-400/80">Maestro Marco approves of your phrase composition.</p>
          </div>
        </div>
      )}

      {/* Campania Idioms & Modi di Dire Sidecar Card */}
      {idiomsAndTooltips && idiomsAndTooltips.length > 0 && (
        <div className="bg-gradient-to-br from-amber-950/40 to-slate-900 border border-amber-500/30 rounded-2xl p-4 shadow-xl space-y-3">
          <div className="flex items-center justify-between text-amber-400">
            <div className="flex items-center space-x-2">
              <Sparkles className="w-4 h-4" />
              <h4 className="text-xs font-bold uppercase tracking-wider font-display">
                Campania Idiom (*Modi di Dire*)
              </h4>
            </div>
            <span className="text-[10px] bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-full font-mono border border-amber-500/30">
              Napoli Culture
            </span>
          </div>

          <div className="space-y-2">
            {idiomsAndTooltips.map((idiom, idx) => (
              <div key={idx} className="bg-slate-950/80 rounded-xl p-3 border border-amber-500/20 text-xs space-y-1">
                <p className="text-amber-300 font-extrabold text-sm tracking-wide">
                  "{idiom.phrase}"
                </p>
                <div className="text-[11px] space-y-0.5">
                  <p className="text-slate-400 italic">
                    <span className="text-slate-500 not-italic">Literal: </span>
                    {idiom.literalMeaning}
                  </p>
                  <p className="text-slate-200 font-medium">
                    <span className="text-amber-500/80">Contextual: </span>
                    {idiom.contextualMeaning}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
