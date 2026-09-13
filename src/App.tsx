import React, { useState } from 'react';
import { AuthProvider } from './context/AuthContext';
import { GameProvider, useGame } from './context/GameContext';
import { Header } from './components/Header';
import { TelemetryDrawer } from './components/TelemetryDrawer';
import { LessonHub } from './components/LessonHub';
import { MainArena } from './components/MainArena';
import { InputDock } from './components/InputDock';
import { DefibrillatorModal } from './components/DefibrillatorModal';
import { PlacementModal } from './components/PlacementModal';
import { LessonVictoryModal } from './components/LessonVictoryModal';
import { AuthModal } from './components/AuthModal';

const AppContent: React.FC = () => {
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const {
    activeView,
    proficiencyLevel,
    completedLessons,
    startLesson,
    setProficiencyLevel,
    isPlacementOpen,
    openPlacementModal,
    closePlacementModal,
    isVictoryOpen,
    closeVictoryModal,
    currentLesson,
    xp,
    telemetryData
  } = useGame();

  const lastAccuracy = telemetryData.length > 0 ? telemetryData[telemetryData.length - 1].accuracy : 100;

  return (
    <div className="flex flex-col h-screen w-full bg-slate-950 text-slate-100 overflow-hidden font-sans selection:bg-emerald-500 selection:text-slate-950">
      
      {/* Sticky Header with Hearts, Combo Flame, XP & Auth */}
      <Header onOpenAuth={() => setIsAuthOpen(true)} />

      {/* Top Deck: Chart.js Telemetry Drawer */}
      <TelemetryDrawer />

      {/* Main Content: Duolingo-style Lesson Roadmap Hub OR Survival Arena */}
      <main className="flex-1 flex flex-col overflow-hidden relative">
        {activeView === 'hub' ? (
          <LessonHub
            proficiencyLevel={proficiencyLevel}
            completedLessons={completedLessons}
            onSelectLesson={startLesson}
            onOpenPlacementModal={openPlacementModal}
          />
        ) : (
          <MainArena />
        )}
      </main>

      {/* Floating Bottom Input Dock only visible during active Arena drill */}
      {activeView === 'arena' && <InputDock />}

      {/* 0 Hearts Sudden-Death Rapid Number Revival Modal */}
      <DefibrillatorModal />

      {/* Diagnostic Placement Test Modal */}
      <PlacementModal
        isOpen={isPlacementOpen}
        onClose={closePlacementModal}
        onCompletePlacement={(level) => setProficiencyLevel(level)}
      />

      {/* Lesson Victory Completion Modal */}
      <LessonVictoryModal
        isOpen={isVictoryOpen}
        lesson={currentLesson}
        xpEarned={xp}
        accuracy={lastAccuracy}
        onReturnToMap={closeVictoryModal}
      />

      {/* Auth Modal for Supabase Sync */}
      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />

    </div>
  );
};

export function App() {
  return (
    <AuthProvider>
      <GameProvider>
        <AppContent />
      </GameProvider>
    </AuthProvider>
  );
}

export default App;
