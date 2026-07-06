import React from 'react';
import { useGameStore } from '../../store/useGameStore';
import { levels } from '../../levels/levelData';
import { 
  Zap, 
  CheckCircle2, 
  Trophy, 
  Star, 
  ArrowRight,
  Sparkles,
  CircuitBoard
} from 'lucide-react';

export const LevelDashboard: React.FC = () => {
  const { initLevel, currentLevelIndex, achievements } = useGameStore();

  const completedCount = currentLevelIndex; // Completed up to current level
  const totalLevels = levels.length;
  const percentComplete = Math.round((completedCount / totalLevels) * 100);

  // Helper to determine difficulty badge
  const getDifficulty = (levelId: number) => {
    if (levelId <= 5) return { label: 'STARTER', color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' };
    if (levelId <= 12) return { label: 'INTERMEDIATE', color: 'bg-amber-500/10 text-amber-400 border-amber-500/20' };
    return { label: 'EXPERT', color: 'bg-blue-500/10 text-blue-400 border-blue-500/20' };
  };

  const unlockedCount = achievements.filter(a => a.unlocked).length;

  return (
    <div className="min-h-screen bg-[#080d1a] text-slate-100 flex flex-col relative select-none font-sans overflow-y-auto">
      {/* Decorative dynamic circuit lines grid background */}
      <div className="absolute inset-0 workspace-grid opacity-10 pointer-events-none" />

      {/* Floating neon accent glows */}
      <div className="absolute top-[-100px] left-1/4 w-[400px] h-[400px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-100px] right-1/4 w-[500px] h-[500px] bg-indigo-700/10 rounded-full blur-[140px] pointer-events-none" />

      {/* 1. Dashboard Header Banner */}
      <header className="relative border-b border-[#1e293b] bg-[#0f172a]/60 backdrop-blur-md px-8 py-8 shrink-0 flex flex-col md:flex-row items-center justify-between gap-6 z-10">
        <div className="flex items-center gap-4">
          {/* Delmi Logo Emblem */}
          <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-yellow-400 to-amber-500 p-0.5 shadow-lg shadow-amber-500/10 flex items-center justify-center relative overflow-hidden group">
            <div className="absolute inset-0 bg-blue-600 opacity-0 group-hover:opacity-10 transition-opacity" />
            <Zap className="w-8 h-8 text-slate-950 fill-slate-950 animate-pulse" />
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-black tracking-wider text-white font-mono uppercase flex items-center gap-2">
              DELMI ELECTRONICS LAB
              <span className="text-xs bg-blue-600/20 text-blue-400 border border-blue-500/30 px-2 py-0.5 rounded font-bold font-sans">
                CORE SYSTEM
              </span>
            </h1>
            <p className="text-xs text-blue-300/70 font-semibold tracking-wide font-mono mt-1 flex items-center gap-1.5">
              <CircuitBoard className="w-3.5 h-3.5 text-blue-400" />
              <span>VIRTUAL TRAINING & SCHEMATIC DEVELOPMENT SUITE</span>
            </p>
          </div>
        </div>

        {/* Global Progress Dashboard Stats */}
        <div className="flex flex-col md:flex-row gap-4 items-stretch w-full md:w-auto">
          {/* Progress Tracker Card */}
          <div className="bg-[#0b0f19] border border-[#1e293b] rounded-xl px-5 py-3.5 flex flex-col justify-between gap-2.5 min-w-[200px] shadow-inner">
            <div className="flex items-center justify-between text-[10px] font-black text-blue-400 uppercase tracking-widest font-mono">
              <span>MODULE PROGRESS</span>
              <span>{percentComplete}%</span>
            </div>
            {/* Progress bar */}
            <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden border border-slate-700/50">
              <div 
                className="h-full bg-gradient-to-r from-blue-600 to-blue-400 rounded-full transition-all duration-500 glow-blue"
                style={{ width: `${percentComplete}%` }}
              />
            </div>
            <span className="text-xs font-bold text-slate-300">
              {completedCount} of {totalLevels} Levels Solved
            </span>
          </div>

          {/* Career Badges Card */}
          <div className="bg-[#0b0f19] border border-[#1e293b] rounded-xl px-5 py-3.5 flex items-center gap-4 min-w-[180px]">
            <div className="w-10 h-10 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center border border-amber-500/25 shrink-0">
              <Trophy className="w-5.5 h-5.5" />
            </div>
            <div>
              <span className="text-[9px] font-black text-amber-500 block uppercase tracking-widest font-mono">CAREER BADGES</span>
              <span className="text-sm font-black text-white">{unlockedCount} / {achievements.length}</span>
              <span className="text-[10px] text-slate-400 block font-semibold">Achievements Unlocked</span>
            </div>
          </div>
        </div>
      </header>

      {/* 2. Grid of Level Cards */}
      <main className="flex-grow p-8 max-w-7xl mx-auto w-full z-10">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-blue-400" />
            <h2 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
              Select a Training Module
            </h2>
          </div>
          <span className="text-[10px] text-blue-400 font-extrabold tracking-widest font-mono uppercase bg-blue-500/5 border border-blue-500/15 px-3 py-1 rounded">
            Click Card to Enter Simulation Lab
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {levels.map((lvl, index) => {
            const isCompleted = index < completedCount;
            const isActive = index === completedCount;
            const diff = getDifficulty(lvl.id);

            return (
              <div
                key={lvl.id}
                onClick={() => initLevel(index)}
                className={`group cursor-pointer rounded-xl border p-5 flex flex-col gap-4 relative overflow-hidden transition-all duration-300 select-none ${
                  isCompleted 
                    ? 'bg-[#0f172a]/45 border-emerald-500/25 hover:border-emerald-500/60 shadow-lg shadow-emerald-500/5'
                    : isActive 
                    ? 'bg-blue-950/20 border-blue-500/40 hover:border-blue-400 shadow-lg shadow-blue-500/5 scale-[1.01]'
                    : 'bg-[#0f172a]/20 border-slate-800/60 opacity-60 hover:opacity-100 hover:border-slate-700'
                }`}
              >
                {/* Visual grid highlight glow on hover */}
                <div className="absolute inset-0 bg-blue-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                {/* Corner status badges */}
                <div className="flex items-start justify-between z-10">
                  <span className={`text-[9px] font-extrabold tracking-wider font-mono px-2 py-0.5 rounded border ${diff.color}`}>
                    {diff.label}
                  </span>
                  
                  {isCompleted ? (
                    <div className="flex items-center gap-1 text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded text-[9px] font-extrabold font-mono uppercase">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>SOLVED</span>
                    </div>
                  ) : isActive ? (
                    <span className="text-[9px] font-extrabold text-blue-400 bg-blue-500/10 border border-blue-500/20 px-2 py-0.5 rounded font-mono uppercase tracking-wider">
                      CURRENT TASK
                    </span>
                  ) : null}
                </div>

                {/* Level Title & Details */}
                <div className="flex-grow z-10 flex flex-col gap-1.5 mt-1">
                  <span className="text-[10px] font-bold text-blue-400 font-mono tracking-widest uppercase">
                    LEVEL {lvl.id.toString().padStart(2, '0')}
                  </span>
                  <h3 className="text-base font-black text-white leading-tight uppercase group-hover:text-blue-300 transition-colors">
                    {lvl.title}
                  </h3>
                  <p className="text-xs text-slate-300/80 leading-relaxed font-medium line-clamp-3 mt-1.5">
                    {lvl.description}
                  </p>
                </div>

                {/* Lower Card Action / Star Rating */}
                <div className="border-t border-slate-800/60 pt-3.5 flex items-center justify-between z-10 mt-2 shrink-0">
                  {/* Star review for solved levels */}
                  {isCompleted ? (
                    <div className="flex gap-0.5">
                      {[1, 2, 3].map(n => (
                        <Star key={n} className="w-4 h-4 fill-yellow-400 text-yellow-500" />
                      ))}
                    </div>
                  ) : (
                    <div className="flex gap-0.5">
                      {[1, 2, 3].map(n => (
                        <Star key={n} className="w-4 h-4 text-slate-700" />
                      ))}
                    </div>
                  )}

                  {/* Play Simulation Button */}
                  <button className="flex items-center gap-1.5 text-[10px] font-black tracking-widest text-blue-400 uppercase font-mono group-hover:text-blue-300 group-hover:translate-x-1 transition-all">
                    <span>ENTER LAB</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </main>

      {/* Footer */}
      <footer className="p-6 border-t border-[#1e293b] bg-[#090e1a]/80 text-center z-10">
        <span className="text-[10px] font-mono tracking-wider text-slate-500 font-extrabold uppercase">
          DELMI ELECTRONICS CORP • ALL VIRTUAL SIMULATORS CALIBRATED & SECURED
        </span>
      </footer>
    </div>
  );
};
export default LevelDashboard;
