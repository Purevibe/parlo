import React, { useState, useEffect, useRef } from 'react';
import { useGame } from '../context/GameContext';
import { speechService } from '../services/speech';
import { Category } from '../types/game';
import { Mic, MicOff, Send, MessageSquare, Compass, Utensils, Hash, Calendar } from 'lucide-react';

const CATEGORIES: { id: Category; label: string; icon: React.ReactNode }[] = [
  { id: 'FOOD_ORDERING', label: 'Food & Coffee', icon: <Utensils className="w-3 h-3" /> },
  { id: 'NUMBERS', label: 'Numbers', icon: <Hash className="w-3 h-3" /> },
  { id: 'DATES_CALENDAR', label: 'Dates & Time', icon: <Calendar className="w-3 h-3" /> },
  { id: 'DIRECTIONS', label: 'Directions', icon: <Compass className="w-3 h-3" /> },
  { id: 'GENERAL_BANTER', label: 'General Banter', icon: <MessageSquare className="w-3 h-3" /> },
];

export const InputDock: React.FC = () => {
  const { currentCategory, setCategory, submitTurn, isEvaluating, hearts } = useGame();
  
  const [inputText, setInputText] = useState<string>('');
  const [isListening, setIsListening] = useState<boolean>(false);
  const [audioLevel, setAudioLevel] = useState<number>(0);
  const [micError, setMicError] = useState<string | null>(null);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Render Real-time Speech Waveform on Canvas
  useEffect(() => {
    if (!isListening || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let phase = 0;

    const renderWave = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const width = canvas.width;
      const height = canvas.height;
      const centerY = height / 2;

      ctx.beginPath();
      ctx.lineWidth = 2;
      ctx.strokeStyle = '#10b981'; // Emerald wave

      for (let x = 0; x < width; x++) {
        const freq = 0.05;
        const amp = (audioLevel * 14 + 3) * Math.sin(x * 0.03 + phase);
        const y = centerY + Math.sin(x * freq + phase) * amp;
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      phase += 0.15;
      animId = requestAnimationFrame(renderWave);
    };

    renderWave();

    return () => {
      cancelAnimationFrame(animId);
    };
  }, [isListening, audioLevel]);

  const handleMicToggle = () => {
    if (isListening) {
      speechService.stopListening();
      setIsListening(false);
    } else {
      setMicError(null);
      setIsListening(true);
      speechService.startListening({
        onResult: (transcript, isFinal) => {
          setInputText(transcript);
          if (isFinal) {
            setIsListening(false);
          }
        },
        onError: (err) => {
          setMicError(err);
          setIsListening(false);
        },
        onEnd: () => {
          setIsListening(false);
        },
        onAudioLevel: (lvl) => {
          setAudioLevel(lvl);
        }
      });
    }
  };

  const handleSend = () => {
    if (!inputText.trim() || isEvaluating || hearts === 0) return;
    if (isListening) {
      speechService.stopListening();
      setIsListening(false);
    }
    const textToSend = inputText;
    setInputText('');
    submitTurn(textToSend);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-20 bg-slate-950/90 backdrop-blur-xl border-t border-slate-800/90 px-4 py-3 pb-safe shadow-2xl">
      <div className="max-w-md mx-auto space-y-2.5">
        
        {/* Category Pill Tag Selector */}
        <div className="flex space-x-1.5 overflow-x-auto no-scrollbar py-0.5">
          {CATEGORIES.map((cat) => {
            const isSelected = currentCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setCategory(cat.id)}
                className={`flex items-center space-x-1 px-3 py-1 rounded-full text-[11px] font-bold whitespace-nowrap transition-all ${
                  isSelected
                    ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-slate-950 shadow-[0_0_12px_rgba(16,185,129,0.4)]'
                    : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-slate-200'
                }`}
              >
                {cat.icon}
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>

        {/* Real-time Waveform Indicator when Listening */}
        {isListening && (
          <div className="relative bg-slate-900/90 border border-emerald-500/50 rounded-xl p-2 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span className="text-xs text-emerald-400 font-bold font-mono">Listening to your voice...</span>
            </div>
            <canvas ref={canvasRef} width={120} height={20} className="w-28 h-5" />
          </div>
        )}

        {/* Mic Error Notice */}
        {micError && (
          <p className="text-[10px] text-rose-400 bg-rose-950/60 px-2 py-1 rounded border border-rose-900/50">
            {micError}
          </p>
        )}

        {/* Input Bar Dock */}
        <div className="flex items-center space-x-2">
          
          {/* Tap-to-Speak Mic Button */}
          <button
            onClick={handleMicToggle}
            disabled={isEvaluating || hearts === 0}
            className={`p-3.5 rounded-2xl border transition-all duration-300 shrink-0 ${
              isListening
                ? 'bg-rose-600 text-white border-rose-400 shadow-[0_0_16px_rgba(225,29,72,0.8)] animate-pulse'
                : 'bg-slate-900 text-slate-300 border-slate-800 hover:border-emerald-500/50 hover:text-emerald-400'
            } disabled:opacity-40`}
            title={isListening ? "Stop listening" : "Tap to speak Italian"}
          >
            {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
          </button>

          {/* Fallback Text Input */}
          <div className="relative flex-1">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isEvaluating || hearts === 0}
              placeholder={isListening ? "Speak Italian now..." : "Type in Italian for Maestro Marco..."}
              className="w-full bg-slate-900 border border-slate-800 focus:border-emerald-500 text-slate-100 placeholder-slate-500 text-sm rounded-2xl px-4 py-3.5 outline-none transition-all disabled:opacity-50 font-sans shadow-inner"
            />
          </div>

          {/* Send Button */}
          <button
            onClick={handleSend}
            disabled={!inputText.trim() || isEvaluating || hearts === 0}
            className="p-3.5 rounded-2xl bg-emerald-500 text-slate-950 font-extrabold hover:bg-emerald-400 border border-emerald-400 transition-all duration-300 shadow-[0_0_12px_rgba(16,185,129,0.3)] disabled:opacity-40 shrink-0"
            title="Send Italian response"
          >
            <Send className="w-5 h-5" />
          </button>

        </div>

      </div>
    </div>
  );
};
