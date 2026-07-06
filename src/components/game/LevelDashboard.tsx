import React from 'react';
import { useGameStore } from '../../store/useGameStore';
import { levels } from '../../levels/levelData';
import {
  Zap,
  CheckCircle2,
  Trophy,
  Star,
  ArrowRight,
  CircuitBoard,
  Lock,
  Play,
  ChevronRight,
  Cpu,
  Radio,
  BarChart3,
} from 'lucide-react';

/* ── Difficulty config ── */
const getDifficulty = (id: number) => {
  if (id <= 5)  return { label: 'Starter',      color: '#10b981', bg: 'rgba(16,185,129,0.08)',  border: 'rgba(16,185,129,0.25)' };
  if (id <= 12) return { label: 'Intermediate', color: '#f59e0b', bg: 'rgba(245,158,11,0.08)',  border: 'rgba(245,158,11,0.25)' };
  return         { label: 'Expert',             color: '#2563eb', bg: 'rgba(37,99,235,0.10)',   border: 'rgba(37,99,235,0.30)' };
};

/* ── Category grouping ── */
const getCategory = (id: number) => {
  if (id <= 4)  return { icon: Zap,          label: 'Fundamentals',     accent: '#2563eb' };
  if (id <= 8)  return { icon: CircuitBoard, label: 'Relay Control',    accent: '#8b5cf6' };
  if (id <= 13) return { icon: Cpu,          label: 'Advanced Circuits', accent: '#f59e0b' };
  if (id <= 17) return { icon: Radio,        label: 'Motion & Timing',  accent: '#10b981' };
  return         { icon: BarChart3,          label: 'Master Series',    accent: '#ef4444' };
};

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
    <div className="min-h-screen bg-[#060b18] text-slate-100 flex flex-col select-none font-sans overflow-y-auto relative">

      {/* ── Ambient background glows ── */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-200px] left-[-100px] w-[700px] h-[700px] rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(37,99,235,0.06) 0%, transparent 70%)' }} />
        <div className="absolute bottom-[-150px] right-[-100px] w-[600px] h-[600px] rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(139,92,246,0.05) 0%, transparent 70%)' }} />
        {/* Subtle grid overlay */}
        <div className="absolute inset-0 workspace-grid opacity-5" />
      </div>

      {/* ══════════════════════════════════════════════
          HERO HEADER
      ══════════════════════════════════════════════ */}
      <header className="relative z-10 px-8 pt-12 pb-10 max-w-7xl mx-auto w-full">

        {/* Top bar — logo + badge */}
        <div className="flex items-center justify-between mb-10">
          <div className="flex items-center gap-4">
            {/* Delmi logo pill */}
            <div className="relative flex items-center justify-center w-12 h-12 rounded-2xl overflow-hidden"
              style={{ background: 'linear-gradient(135deg, #1d4ed8 0%, #2563eb 60%, #3b82f6 100%)', boxShadow: '0 0 30px rgba(37,99,235,0.35)' }}>
              <Zap className="w-6 h-6 text-white fill-white" />
              <div className="absolute inset-0 rounded-2xl" style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.15) 0%, transparent 60%)' }} />
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <h1 className="text-lg font-black text-white tracking-wide font-mono uppercase">
                  Delmi Electronics Lab
                </h1>
                <span className="text-[9px] font-bold bg-blue-600/20 text-blue-400 border border-blue-500/30 px-2 py-0.5 rounded-full tracking-widest uppercase">
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
            <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-3.5 py-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[11px] font-bold text-emerald-400">{completedCount} Solved</span>
            </div>
            <div className="flex items-center gap-2 bg-amber-500/10 border border-amber-500/20 rounded-full px-3.5 py-1.5">
              <Trophy className="w-3.5 h-3.5 text-amber-400" />
              <span className="text-[11px] font-bold text-amber-400">{unlockedCount} Badges</span>
            </div>
          </div>
        </div>

        {/* Hero headline */}
        <div className="mb-8">
          <h2 className="text-4xl md:text-5xl font-black text-white leading-tight tracking-tight mb-3">
            Master Electronics
            <br />
            <span style={{ background: 'linear-gradient(90deg, #2563eb, #60a5fa, #818cf8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Circuit Design.
            </span>
          </h2>
          <p className="text-slate-400 text-sm leading-relaxed max-w-lg font-medium">
            Build real-world wiring skills through hands-on simulation. From basic circuits to advanced industrial control systems.
          </p>
        </div>

        {/* ── Stats row ── */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { label: 'Modules', value: totalLevels, suffix: '', icon: CircuitBoard, color: '#2563eb' },
            { label: 'Completed', value: completedCount, suffix: '', icon: CheckCircle2, color: '#10b981' },
            { label: 'Progress', value: percentComplete, suffix: '%', icon: BarChart3, color: '#8b5cf6' },
          ].map(stat => (
            <div key={stat.label}
              className="rounded-2xl border p-4 flex items-center gap-3 relative overflow-hidden"
              style={{ background: 'rgba(15,23,42,0.6)', borderColor: 'rgba(255,255,255,0.06)', backdropFilter: 'blur(8px)' }}>
              <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                style={{ background: `${stat.color}18`, border: `1px solid ${stat.color}35` }}>
                <stat.icon className="w-4.5 h-4.5" style={{ color: stat.color }} />
              </div>
              <div>
                <div className="text-xl font-black text-white font-mono">
                  <AnimatedNumber value={stat.value} suffix={stat.suffix} />
                </div>
                <div className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">{stat.label}</div>
              </div>
              {/* Subtle color glow */}
              <div className="absolute right-0 top-0 w-16 h-full opacity-30 blur-xl"
                style={{ background: stat.color }} />
            </div>
          ))}
        </div>

        {/* Progress bar full-width */}
        <div className="rounded-full h-1.5 overflow-hidden" style={{ background: 'rgba(255,255,255,0.05)' }}>
          <div
            className="h-full rounded-full transition-all duration-1000"
            style={{ width: `${percentComplete}%`, background: 'linear-gradient(90deg, #1d4ed8, #3b82f6, #818cf8)' }}
          />
        </div>
        <div className="flex justify-between text-[10px] text-slate-600 font-mono mt-1.5 font-bold">
          <span>START</span>
          <span>{completedCount}/{totalLevels} MODULES COMPLETE</span>
          <span>MASTER</span>
        </div>
      </header>

      {/* ══════════════════════════════════════════════
          LEVEL GRID
      ══════════════════════════════════════════════ */}
      <main className="relative z-10 px-8 pb-16 max-w-7xl mx-auto w-full flex-grow">

        {/* Filter tabs */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-1.5 p-1 rounded-xl" style={{ background: 'rgba(15,23,42,0.7)', border: '1px solid rgba(255,255,255,0.06)' }}>
            {(['all', 'completed', 'available'] as const).map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className="px-4 py-1.5 rounded-lg text-[11px] font-extrabold uppercase tracking-wider transition-all cursor-pointer font-mono"
                style={filter === f
                  ? { background: '#1d4ed8', color: 'white', boxShadow: '0 0 12px rgba(37,99,235,0.4)' }
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
            const isLocked    = index > completedCount;
            const diff        = getDifficulty(lvl.id);
            const cat         = getCategory(lvl.id);
            const isHovered   = hoveredId === lvl.id;

            return (
              <div
                key={lvl.id}
                onClick={() => initLevel(index)}
                onMouseEnter={() => setHoveredId(lvl.id)}
                onMouseLeave={() => setHoveredId(null)}
                className="relative rounded-2xl cursor-pointer flex flex-col overflow-hidden transition-all duration-200"
                style={{
                  background: isCompleted
                    ? 'rgba(16,185,129,0.04)'
                    : isActive
                    ? 'rgba(37,99,235,0.07)'
                    : 'rgba(15,23,42,0.50)',
                  border: isCompleted
                    ? `1px solid ${isHovered ? 'rgba(16,185,129,0.5)' : 'rgba(16,185,129,0.18)'}`
                    : isActive
                    ? `1px solid ${isHovered ? 'rgba(59,130,246,0.7)' : 'rgba(59,130,246,0.35)'}`
                    : `1px solid ${isHovered ? 'rgba(255,255,255,0.10)' : 'rgba(255,255,255,0.05)'}`,
                  transform: isHovered && !isLocked ? 'translateY(-3px)' : 'none',
                  opacity: isLocked ? 0.5 : 1,
                  boxShadow: isActive && isHovered
                    ? '0 8px 32px rgba(37,99,235,0.20)'
                    : isCompleted && isHovered
                    ? '0 8px 32px rgba(16,185,129,0.12)'
                    : 'none',
                }}
              >
                {/* Active "current" glow border */}
                {isActive && (
                  <div className="absolute inset-0 rounded-2xl pointer-events-none animate-pulse"
                    style={{ boxShadow: 'inset 0 0 0 1px rgba(59,130,246,0.3)' }} />
                )}

                {/* Category accent bar top */}
                <div className="h-0.5 w-full shrink-0"
                  style={{ background: isCompleted ? '#10b981' : isActive ? '#2563eb' : 'transparent' }} />

                {/* Card body */}
                <div className="p-4 flex flex-col gap-3 flex-grow">

                  {/* Top row — level number + status */}
                  <div className="flex items-start justify-between">
                    {/* Level number */}
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 font-mono font-black text-sm"
                        style={{
                          background: isCompleted ? 'rgba(16,185,129,0.15)' : isActive ? 'rgba(37,99,235,0.15)' : 'rgba(255,255,255,0.05)',
                          color: isCompleted ? '#10b981' : isActive ? '#60a5fa' : '#475569',
                        }}>
                        {lvl.id.toString().padStart(2,'0')}
                      </div>
                      {/* Category label */}
                      <div className="flex items-center gap-1 opacity-60">
                        <cat.icon className="w-3 h-3" style={{ color: cat.accent }} />
                      </div>
                    </div>

                    {/* Status badge */}
                    {isCompleted ? (
                      <div className="flex items-center gap-1 rounded-full px-2 py-0.5"
                        style={{ background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.25)' }}>
                        <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                        <span className="text-[9px] font-black text-emerald-400 uppercase tracking-wider font-mono">Done</span>
                      </div>
                    ) : isActive ? (
                      <div className="flex items-center gap-1 rounded-full px-2 py-0.5"
                        style={{ background: 'rgba(37,99,235,0.15)', border: '1px solid rgba(59,130,246,0.30)' }}>
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
                        <span className="text-[9px] font-black text-blue-400 uppercase tracking-wider font-mono">Next</span>
                      </div>
                    ) : isLocked ? (
                      <Lock className="w-3.5 h-3.5 text-slate-600" />
                    ) : null}
                  </div>

                  {/* Title & description */}
                  <div className="flex-grow">
                    <h3 className="text-sm font-black text-white leading-snug mb-1.5 transition-colors"
                      style={{ color: isHovered && isActive ? '#93c5fd' : isHovered && isCompleted ? '#6ee7b7' : 'white' }}>
                      {lvl.title}
                    </h3>
                    <p className="text-[11px] text-slate-500 leading-relaxed font-medium line-clamp-2">
                      {lvl.description}
                    </p>
                  </div>

                  {/* Bottom row — difficulty + enter */}
                  <div className="flex items-center justify-between pt-2.5"
                    style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                    {/* Difficulty pip */}
                    <span className="text-[9px] font-extrabold tracking-wider uppercase rounded-full px-2 py-0.5 font-mono"
                      style={{ background: diff.bg, color: diff.color, border: `1px solid ${diff.border}` }}>
                      {diff.label}
                    </span>

                    {/* Stars or enter arrow */}
                    {isCompleted ? (
                      <div className="flex gap-0.5">
                        {[1,2,3].map(n => (
                          <Star key={n} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        ))}
                      </div>
                    ) : (
                      <button
                        className="flex items-center gap-1 text-[10px] font-black uppercase font-mono transition-all"
                        style={{
                          color: isActive ? '#60a5fa' : '#334155',
                          transform: isHovered && !isLocked ? 'translateX(3px)' : 'none'
                        }}>
                        {isActive ? (
                          <>
                            <Play className="w-3 h-3 fill-current" />
                            <span>Enter Lab</span>
                          </>
                        ) : isLocked ? (
                          <ChevronRight className="w-3.5 h-3.5" />
                        ) : (
                          <ArrowRight className="w-3.5 h-3.5" />
                        )}
                      </button>
                    )}
                  </div>
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
        <span className="text-[10px] text-slate-600 font-mono font-bold uppercase tracking-widest">
          Delmi Electronics Corp · Virtual Simulator Suite
        </span>
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[10px] text-slate-600 font-mono font-bold">All systems online</span>
        </div>
      </footer>
    </div>
  );
};
export default LevelDashboard;
