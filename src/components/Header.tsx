import React from 'react';
import { Heart, Flame, Activity, User, LogOut, Compass } from 'lucide-react';
import { useGame } from '../context/GameContext';
import { useAuth } from '../context/AuthContext';

interface HeaderProps {
  onOpenAuth: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenAuth }) => {
  const { hearts, xp, streak, comboMultiplier, toggleTelemetryDrawer, isTelemetryOpen, activeView, returnToHub } = useGame();
  const { user, signOut } = useAuth();

  return (
    <header className="sticky top-0 z-30 bg-slate-950/80 backdrop-blur-md border-b border-slate-800/80 px-4 py-3 transition-all duration-300">
      <div className="max-w-md mx-auto flex items-center justify-between">
        
        {/* App Title & View Navigation */}
        <div className="flex items-center space-x-2">
          {activeView === 'arena' ? (
            <button
              onClick={returnToHub}
              className="flex items-center space-x-1 bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 text-xs px-2.5 py-1 rounded-xl transition-all font-semibold"
              title="Return to Lesson Roadmap"
            >
              <Compass className="w-3.5 h-3.5 text-emerald-400" />
              <span>Map</span>
            </button>
          ) : (
            <div className="flex space-x-1 h-5 w-2 items-center rounded overflow-hidden">
              <span className="bg-[#009246] w-1/3 h-full"></span>
              <span className="bg-[#F4F5F0] w-1/3 h-full"></span>
              <span className="bg-[#CE2B37] w-1/3 h-full"></span>
            </div>
          )}
          
          <h1 className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-emerald-400 via-amber-300 to-rose-400 bg-clip-text text-transparent font-display">
            Parlo
          </h1>
        </div>

        {/* Center: Hearts & Combo Flame */}
        <div className="flex items-center space-x-3">
          
          {/* Hearts Display */}
          <div className="flex items-center space-x-1 bg-slate-900/90 px-2.5 py-1.5 rounded-full border border-rose-900/40 shadow-inner">
            {[1, 2, 3].map((index) => {
              const isActive = index <= hearts;
              return (
                <Heart
                  key={index}
                  className={`w-4 h-4 transition-all duration-500 ${
                    isActive 
                      ? 'fill-rose-500 text-rose-500 drop-shadow-[0_0_8px_rgba(244,63,94,0.7)] animate-heart-beat' 
                      : 'text-slate-700 fill-slate-800/50'
                  }`}
                />
              );
            })}
          </div>

          {/* Combo Flame Multiplier Badge */}
          {comboMultiplier > 1 && (
            <div className={`flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-black tracking-wider uppercase shadow-md animate-flame-glow border ${
              comboMultiplier >= 3 
                ? 'bg-gradient-to-r from-amber-500 to-rose-600 text-white border-amber-300' 
                : 'bg-gradient-to-r from-amber-500/80 to-amber-600/80 text-amber-100 border-amber-400/50'
            }`}>
              <Flame className="w-3.5 h-3.5 fill-amber-300 text-amber-200 animate-bounce" />
              <span>{comboMultiplier >= 3 ? 'Campione 3x' : 'Fiamma 2x'}</span>
            </div>
          )}

          {/* XP Counter */}
          <div className="flex items-center space-x-1 bg-amber-950/40 border border-amber-500/30 text-amber-400 px-2.5 py-1 rounded-full text-xs font-bold font-mono">
            <span>{xp}</span>
            <span className="text-[10px] text-amber-500/70">XP</span>
          </div>

        </div>

        {/* Right: Telemetry & Auth */}
        <div className="flex items-center space-x-2">
          
          {/* Telemetry Button */}
          <button
            onClick={toggleTelemetryDrawer}
            title="Performance Telemetry"
            className={`p-2 rounded-full border transition-all ${
              isTelemetryOpen
                ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/50 shadow-[0_0_12px_rgba(16,185,129,0.3)]'
                : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200 hover:border-slate-700'
            }`}
          >
            <Activity className="w-4 h-4" />
          </button>

          {/* Auth Button */}
          {user ? (
            <button
              onClick={() => signOut()}
              title={`Logged in as ${user.email}`}
              className="p-2 rounded-full bg-slate-900 border border-slate-800 text-slate-400 hover:text-rose-400 hover:border-rose-900/50 transition-all"
            >
              <LogOut className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={onOpenAuth}
              title="Sign in / Sync Progress"
              className="p-2 rounded-full bg-emerald-600/20 border border-emerald-500/40 text-emerald-400 hover:bg-emerald-600/30 transition-all"
            >
              <User className="w-4 h-4" />
            </button>
          )}

        </div>

      </div>
    </header>
  );
};
