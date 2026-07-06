import React from 'react';
import { useGameStore } from '../../store/useGameStore';
import { levels } from '../../levels/levelData';
import { RealWorldVisual } from './components/RealWorldVisual';
import {
  Zap,
  CheckCircle2,
  Trophy,
  CircuitBoard,
  BarChart3,
} from 'lucide-react';

/* ── Animated number counter ── */
const AnimatedNumber: React.FC<{ value: number; suffix?: string }> = ({ value, suffix = '' }) => {
  const [display, setDisplay] = React.useState(0);
  React.useEffect(() => {
    let start = 0;
    const step = Math.ceil(value / 30);
    const id = setInterval(() => {
      start += step;
      if (start >= value) { setDisplay(value); clearInterval(id); }
      else setDisplay(start);
    }, 25);
    return () => clearInterval(id);
  }, [value]);
  return <>{display}{suffix}</>;
};

export const LevelDashboard: React.FC = () => {
  const { initLevel, currentLevelIndex, achievements } = useGameStore();
  const [hoveredId, setHoveredId] = React.useState<number | null>(null);
  const [filter, setFilter] = React.useState<'all' | 'completed' | 'available'>('all');

  const completedCount = currentLevelIndex;
  const totalLevels = levels.length;
  const percentComplete = Math.round((completedCount / totalLevels) * 100);
  const unlockedCount = achievements.filter(a => a.unlocked).length;

  const filteredLevels = levels.filter(lvl => {
    const idx = levels.indexOf(lvl);
    if (filter === 'completed') return idx < completedCount;
    if (filter === 'available') return idx >= completedCount;
    return true;
  });

  return (
    <div className="min-h-screen bg-[#070a0f] text-slate-100 flex flex-col select-none font-sans overflow-y-auto relative">

      {/* ── Ambient background glows ── */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute inset-0 workspace-grid opacity-[0.035]" />
      </div>

      {/* ══════════════════════════════════════════════
          HERO HEADER
      ══════════════════════════════════════════════ */}
      <header className="relative z-10 px-4 sm:px-8 pt-6 sm:pt-8 pb-7 max-w-7xl mx-auto w-full">

        {/* Top bar — logo + badge */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-4">
            {/* Delmi logo pill */}
            <div className="relative flex items-center justify-center w-11 h-11 rounded-lg overflow-hidden bg-white shadow-[0_0_0_1px_rgba(255,255,255,0.16)]">
              <Zap className="w-6 h-6 text-slate-950 fill-slate-950" />
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <h1 className="text-lg font-semibold text-white tracking-wide">
                  Delmi Electronics Lab
                </h1>
                <span className="text-[9px] font-semibold bg-white/[0.06] text-slate-400 border border-white/10 px-2 py-0.5 rounded-md tracking-wide uppercase">
                  v2.0
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium tracking-wide mt-0.5">
                Virtual Electronics Training · {totalLevels} Modules
              </p>
            </div>
          </div>

          {/* Live stats chips */}
          <div className="hidden md:flex items-center gap-3">
            <div className="flex items-center gap-2 bg-white/[0.05] border border-white/10 rounded-md px-3.5 py-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-slate-400" />
              <span className="text-[11px] font-semibold text-slate-300">{completedCount} Solved</span>
            </div>
            <div className="flex items-center gap-2 bg-white/[0.05] border border-white/10 rounded-md px-3.5 py-1.5">
              <Trophy className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-[11px] font-semibold text-slate-300">{unlockedCount} Badges</span>
            </div>
          </div>
        </div>

        {/* Hero headline */}
        <div className="mb-7">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-white leading-tight tracking-tight mb-3">
            Master Electronics
            <br />
            <span className="text-slate-300">
              Circuit Design.
            </span>
          </h2>
          <p className="text-slate-400 text-sm leading-relaxed max-w-lg font-medium">
            Build real-world wiring skills through hands-on simulation. From basic circuits to advanced industrial control systems.
          </p>
        </div>

        {/* ── Stats row ── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-7">
          {[
            { label: 'Modules', value: totalLevels, suffix: '', icon: CircuitBoard, color: '#2563eb' },
            { label: 'Completed', value: completedCount, suffix: '', icon: CheckCircle2, color: '#10b981' },
            { label: 'Progress', value: percentComplete, suffix: '%', icon: BarChart3, color: '#8b5cf6' },
          ].map(stat => (
            <div key={stat.label}
              className="rounded-lg border border-white/10 bg-white/[0.035] p-4 flex items-center gap-3 relative overflow-hidden shadow-[0_12px_30px_rgba(0,0,0,0.12)]">
              <div className="w-9 h-9 rounded-md flex items-center justify-center shrink-0 bg-white/[0.06] border border-white/10">
                <stat.icon className="w-4.5 h-4.5 text-slate-400" />
              </div>
              <div>
                <div className="text-xl font-semibold text-white tabular-nums">
                  <AnimatedNumber value={stat.value} suffix={stat.suffix} />
                </div>
                <div className="text-[10px] text-slate-500 font-medium uppercase tracking-wide">{stat.label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Progress bar full-width */}
        <div className="rounded h-1.5 overflow-hidden" style={{ background: 'rgba(255,255,255,0.05)' }}>
          <div
            className="h-full rounded transition-all duration-1000"
            style={{ width: `${percentComplete}%`, background: '#94a3b8' }}
          />
        </div>
        <div className="flex justify-between text-[10px] text-slate-600 mt-1.5 font-medium">
          <span>START</span>
          <span>{completedCount}/{totalLevels} MODULES COMPLETE</span>
          <span>MASTER</span>
        </div>
      </header>

      {/* ══════════════════════════════════════════════
          LEVEL GRID
      ══════════════════════════════════════════════ */}
      <main className="relative z-10 px-4 sm:px-8 pb-16 max-w-7xl mx-auto w-full flex-grow">

        {/* Filter tabs */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
          <div className="flex items-center gap-1.5 p-1 rounded-lg overflow-x-auto max-w-full" style={{ background: 'rgba(15,23,42,0.72)', border: '1px solid rgba(255,255,255,0.08)' }}>
            {(['all', 'completed', 'available'] as const).map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className="px-3 sm:px-4 py-1.5 rounded-md text-[11px] font-semibold uppercase tracking-wide transition-all cursor-pointer whitespace-nowrap"
                style={filter === f
                  ? { background: '#e2e8f0', color: '#0f172a' }
                  : { color: '#64748b' }}
              >
                {f === 'all' ? `All (${totalLevels})` : f === 'completed' ? `Solved (${completedCount})` : `Available (${totalLevels - completedCount})`}
              </button>
            ))}
          </div>
          <div className="text-[10px] text-slate-600 font-mono font-bold uppercase tracking-widest hidden md:block">
            Click any card to enter the lab →
          </div>
        </div>

        {/* Level cards grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredLevels.map((lvl) => {
            const index = levels.indexOf(lvl);
            const isCompleted = index < completedCount;
            const isActive    = index === completedCount;
            const isHovered   = hoveredId === lvl.id;

            return (
              <div
                key={lvl.id}
                onClick={() => initLevel(index)}
                onMouseEnter={() => setHoveredId(lvl.id)}
                onMouseLeave={() => setHoveredId(null)}
                className="relative rounded-xl cursor-pointer flex flex-col overflow-hidden transition-all duration-300 group"
                style={{
                  background: 'rgba(10,15,30,0.48)',
                  border: isCompleted
                    ? `1px solid ${isHovered ? 'rgba(16,185,129,0.45)' : 'rgba(16,185,129,0.12)'}`
                    : isActive
                    ? `1px solid ${isHovered ? 'rgba(59,130,246,0.6)' : 'rgba(59,130,246,0.25)'}`
                    : `1px solid ${isHovered ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.03)'}`,
                  transform: isHovered ? 'translateY(-4px)' : 'none',
                  boxShadow: isHovered ? '0 12px 30px rgba(0,0,0,0.4)' : 'none'
                }}
              >
                {/* Visual Thumbnail Area */}
                <div className="h-32 w-full bg-slate-950/40 relative overflow-hidden flex items-center justify-center p-4 border-b border-white/[0.04] transition-all group-hover:bg-slate-950/20">
                  <div className="w-20 h-20 transform group-hover:scale-105 transition-transform duration-300">
                    <RealWorldVisual levelId={lvl.id} isActive={isCompleted || isActive || isHovered} />
                  </div>
                  {/* Completed Checkmark Overlay */}
                  {isCompleted && (
                    <div className="absolute top-2.5 right-2.5 w-5 h-5 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    </div>
                  )}
                  {/* Active/Next Ribbon */}
                  {isActive && (
                    <div className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-blue-400 animate-pulse shadow-[0_0_8px_#60a5fa]" />
                  )}
                  {/* Level Number Indicator */}
                  <div className="absolute bottom-2.5 left-2.5 px-1.5 py-0.5 rounded bg-black/40 border border-white/5 font-mono text-[9px] font-bold text-slate-500 group-hover:text-slate-300 transition-colors">
                    LVL {lvl.id.toString().padStart(2, '0')}
                  </div>
                </div>

                {/* Card Title Section */}
                <div className="p-3 flex flex-col justify-center min-h-[50px]">
                  <h3 
                    className="text-xs font-semibold leading-snug group-hover:text-white transition-colors"
                    style={{
                      color: isCompleted ? '#34d399' : isActive ? '#60a5fa' : '#94a3b8'
                    }}
                  >
                    {lvl.title}
                  </h3>
                </div>
              </div>
            );
          })}
        </div>

        {/* Empty filter state */}
        {filteredLevels.length === 0 && (
          <div className="text-center py-24 text-slate-600">
            <CircuitBoard className="w-10 h-10 mx-auto mb-3 opacity-30" />
            <p className="text-sm font-bold">No levels in this filter.</p>
          </div>
        )}
      </main>

      {/* ── Footer ── */}
      <footer className="relative z-10 border-t px-8 py-5 flex items-center justify-between"
        style={{ borderColor: 'rgba(255,255,255,0.05)', background: 'rgba(6,11,24,0.8)' }}>
        <span className="text-[10px] text-slate-600 font-semibold uppercase tracking-wide">
          Delmi Electronics Corp · Virtual Simulator Suite
        </span>
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[10px] text-slate-600 font-semibold">All systems online</span>
        </div>
      </footer>
    </div>
  );
};
export default LevelDashboard;
