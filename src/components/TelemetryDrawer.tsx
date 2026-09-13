import React, { useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { useGame } from '../context/GameContext';
import { TrendingUp, Award, Target, X } from 'lucide-react';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export const TelemetryDrawer: React.FC = () => {
  const { telemetryData, isTelemetryOpen, toggleTelemetryDrawer, history, xp } = useGame();
  const [metricMode, setMetricMode] = useState<'accuracy' | 'velocity'>('accuracy');

  if (!isTelemetryOpen) return null;

  const labels = telemetryData.length > 0 
    ? telemetryData.map((d, i) => `Turn ${d.turnIndex}`)
    : ['Turn 1', 'Turn 2', 'Turn 3', 'Turn 4', 'Turn 5'];

  const accuracyValues = telemetryData.length > 0
    ? telemetryData.map(d => d.accuracy)
    : [100, 100, 66, 75, 80];

  const velocityValues = telemetryData.length > 0
    ? telemetryData.map(d => d.xpVelocity)
    : [100, 100, 0, 100, 200];

  const chartData = {
    labels,
    datasets: [
      {
        label: metricMode === 'accuracy' ? 'Accuracy Rate (%)' : 'XP Velocity',
        data: metricMode === 'accuracy' ? accuracyValues : velocityValues,
        borderColor: metricMode === 'accuracy' ? '#10B981' : '#F59E0B',
        backgroundColor: metricMode === 'accuracy' 
          ? 'rgba(16, 185, 129, 0.15)' 
          : 'rgba(245, 158, 11, 0.15)',
        fill: true,
        tension: 0.4,
        pointBackgroundColor: metricMode === 'accuracy' ? '#10B981' : '#F59E0B',
        pointBorderColor: '#0F172A',
        pointRadius: 5,
        pointHoverRadius: 7,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: '#1E293B',
        titleColor: '#F8FAFC',
        bodyColor: '#34D399',
        borderColor: '#334155',
        borderWidth: 1,
        padding: 10,
        displayColors: false,
      },
    },
    scales: {
      x: {
        grid: {
          color: 'rgba(51, 65, 85, 0.3)',
        },
        ticks: {
          color: '#94A3B8',
          font: { size: 10 },
        },
      },
      y: {
        grid: {
          color: 'rgba(51, 65, 85, 0.3)',
        },
        ticks: {
          color: '#94A3B8',
          font: { size: 10 },
        },
        min: 0,
        max: metricMode === 'accuracy' ? 100 : undefined,
      },
    },
  };

  const totalTurns = history.length;
  const correctTurns = history.filter(h => h.evaluation.isCorrect).length;
  const accuracyOverall = totalTurns > 0 ? Math.round((correctTurns / totalTurns) * 100) : 100;

  return (
    <div className="bg-slate-900 border-b border-slate-800 px-4 py-4 transition-all duration-300 shadow-2xl">
      <div className="max-w-md mx-auto space-y-3">
        
        {/* Header & Close */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <TrendingUp className="w-4 h-4 text-emerald-400" />
            <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wider">
              Telemetry & Performance
            </h3>
          </div>
          <button
            onClick={toggleTelemetryDrawer}
            className="p-1 rounded text-slate-400 hover:text-slate-200 hover:bg-slate-800"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Quick KPI Cards */}
        <div className="grid grid-cols-3 gap-2">
          <div className="bg-slate-950/70 p-2.5 rounded-lg border border-slate-800 text-center">
            <p className="text-[10px] text-slate-400 uppercase font-medium">Overall Acc</p>
            <p className="text-lg font-black text-emerald-400 font-mono">{accuracyOverall}%</p>
          </div>
          <div className="bg-slate-950/70 p-2.5 rounded-lg border border-slate-800 text-center">
            <p className="text-[10px] text-slate-400 uppercase font-medium">Total Turns</p>
            <p className="text-lg font-black text-slate-200 font-mono">{totalTurns}</p>
          </div>
          <div className="bg-slate-950/70 p-2.5 rounded-lg border border-slate-800 text-center">
            <p className="text-[10px] text-slate-400 uppercase font-medium">Total XP</p>
            <p className="text-lg font-black text-amber-400 font-mono">{xp}</p>
          </div>
        </div>

        {/* Toggle Controls */}
        <div className="flex bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs font-semibold">
          <button
            onClick={() => setMetricMode('accuracy')}
            className={`flex-1 py-1.5 rounded-md flex items-center justify-center space-x-1.5 transition-all ${
              metricMode === 'accuracy'
                ? 'bg-emerald-600 text-white shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Target className="w-3.5 h-3.5" />
            <span>Rolling Accuracy (%)</span>
          </button>
          <button
            onClick={() => setMetricMode('velocity')}
            className={`flex-1 py-1.5 rounded-md flex items-center justify-center space-x-1.5 transition-all ${
              metricMode === 'velocity'
                ? 'bg-amber-600 text-white shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Award className="w-3.5 h-3.5" />
            <span>XP Velocity</span>
          </button>
        </div>

        {/* Chart Canvas Container */}
        <div className="h-44 bg-slate-950/50 p-2 rounded-xl border border-slate-800/80">
          <Line data={chartData} options={chartOptions} />
        </div>

      </div>
    </div>
  );
};
