import React from 'react';
import { useGameStore } from '../../store/useGameStore';
import { Logo } from './components/Logo';
import { levels } from '../../levels/levelData';
import { RealWorldVisual } from './components/RealWorldVisual';
import {
  ArrowRight,
  BarChart3,
  Check,
  CheckCircle2,
  ChevronRight,
  CircuitBoard,
  Clock3,
  Gauge,
  LayoutGrid,
  Play,
  Search,
  ShieldCheck,
  Sparkles,
  Trophy,
  Wrench,
  X,
  Zap,
} from 'lucide-react';

type ModuleTrack = 'all' | 'fundamentals' | 'control' | 'applied';

const moduleTracks: { id: ModuleTrack; label: string }[] = [
  { id: 'all', label: 'All modules' },
  { id: 'fundamentals', label: 'Fundamentals' },
  { id: 'control', label: 'Control circuits' },
  { id: 'applied', label: 'Applied systems' },
];

const getModuleTrack = (levelId: number): Exclude<ModuleTrack, 'all'> => {
  if (levelId <= 4) return 'fundamentals';
  if (levelId <= 13) return 'control';
  return 'applied';
};

const getModuleTrackLabel = (levelId: number) => {
  const track = getModuleTrack(levelId);
  return moduleTracks.find(item => item.id === track)?.label ?? 'Training';
};

const AnimatedNumber: React.FC<{ value: number; suffix?: string }> = ({ value, suffix = '' }) => {
  const [display, setDisplay] = React.useState(0);

  React.useEffect(() => {
    if (value === 0) {
      setDisplay(0);
      return;
    }

    let current = 0;
    const step = Math.max(1, Math.ceil(value / 24));
    const id = window.setInterval(() => {
      current = Math.min(value, current + step);
      setDisplay(current);
      if (current === value) window.clearInterval(id);
    }, 28);

    return () => window.clearInterval(id);
  }, [value]);

  return <>{display}{suffix}</>;
};

export const LevelDashboard: React.FC = () => {
  const { initLevel, currentLevelIndex, achievements, isCustomLab, setViewMode, startCustomLab } = useGameStore();
  const [searchQuery, setSearchQuery] = React.useState('');
  const [activeTrack, setActiveTrack] = React.useState<ModuleTrack>('all');
  const moduleSectionRef = React.useRef<HTMLElement | null>(null);

  const totalLevels = levels.length;
  const activeModuleIndex = Math.min(Math.max(currentLevelIndex, 0), totalLevels - 1);
  const completedCount = Math.min(activeModuleIndex, totalLevels);
  const percentComplete = Math.round((completedCount / totalLevels) * 100);
  const unlockedCount = achievements.filter(achievement => achievement.unlocked).length;
  const activeModule = levels[activeModuleIndex];

  const visibleLevels = React.useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();

    return levels.filter(level => {
      const matchesTrack = activeTrack === 'all' || getModuleTrack(level.id) === activeTrack;
      const matchesQuery = !normalizedQuery ||
        level.title.toLowerCase().includes(normalizedQuery) ||
        level.description.toLowerCase().includes(normalizedQuery);

      return matchesTrack && matchesQuery;
    });
  }, [activeTrack, searchQuery]);

  const scrollToModules = () => {
    moduleSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const openCustomLab = () => {
    if (isCustomLab) {
      setViewMode('lab');
      return;
    }
    startCustomLab([]);
  };

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[#05080f] font-sans text-slate-100 selection:bg-blue-500/30">
      <div className="pointer-events-none fixed inset-0 overflow-hidden" aria-hidden="true">
        <div className="absolute inset-0 dashboard-grid opacity-70" />
        <div className="absolute -left-48 -top-64 h-[620px] w-[620px] rounded-full bg-blue-600/[0.14] blur-[150px]" />
        <div className="absolute -right-44 top-48 h-[460px] w-[460px] rounded-full bg-cyan-500/[0.07] blur-[150px]" />
      </div>

      <header className="relative z-20 border-b border-white/[0.07] bg-[#05080f]/80 backdrop-blur-2xl">
        <div className="mx-auto flex min-h-[92px] max-w-[1440px] items-center justify-between gap-5 px-4 sm:px-6 lg:px-10">
          <div className="flex min-w-0 items-center gap-4 sm:gap-6">
            <Logo variant="horizontal" size="md" />
            <div className="hidden h-9 w-px bg-white/10 sm:block" />
            <div className="hidden min-w-0 sm:block">
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-blue-300">Electronics Lab</p>
              <p className="mt-1 text-xs text-slate-500">Interactive technician training</p>
            </div>
          </div>

          <nav className="flex shrink-0 items-center rounded-xl border border-white/[0.08] bg-white/[0.035] p-1" aria-label="Lab sections">
            <button
              type="button"
              className="rounded-lg border border-blue-400/20 bg-blue-500/15 px-2.5 py-2 text-[10px] font-semibold text-blue-200 shadow-sm sm:px-4 sm:text-[11px]"
              aria-current="page"
            >
              Training <span className="hidden lg:inline">modules</span>
            </button>
            <button
              type="button"
              onClick={openCustomLab}
              className="flex items-center gap-1.5 rounded-lg px-2.5 py-2 text-[10px] font-semibold text-slate-500 transition hover:bg-white/[0.05] hover:text-slate-200 sm:px-4 sm:text-[11px]"
            >
              <Wrench className="h-3.5 w-3.5" />
              Custom <span className="hidden sm:inline">lab</span>
            </button>
          </nav>

          <div className="flex items-center gap-2.5">
            <div className="hidden items-center gap-2 rounded-full border border-emerald-400/15 bg-emerald-400/[0.06] px-3 py-1.5 md:flex">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-40" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
              </span>
              <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-emerald-300">Lab online</span>
            </div>
            <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5">
              <Trophy className="h-3.5 w-3.5 text-amber-300" />
              <span className="text-[11px] font-semibold text-slate-300">{unlockedCount}/{achievements.length}</span>
              <span className="hidden text-[10px] text-slate-500 sm:inline">badges</span>
            </div>
          </div>
        </div>
      </header>

      <main className="relative z-10">
        <section className="mx-auto max-w-[1440px] px-4 pb-12 pt-12 sm:px-6 sm:pb-16 sm:pt-16 lg:px-10 lg:pt-20">
          <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,1.15fr)_430px] lg:gap-16">
            <div className="dashboard-rise">
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-blue-400/15 bg-blue-400/[0.07] px-3 py-1.5">
                <Sparkles className="h-3.5 w-3.5 text-blue-300" />
                <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-blue-200">Hands-on learning, built for technicians</span>
              </div>

              <h1 className="max-w-3xl text-4xl font-semibold leading-[1.05] tracking-[-0.045em] text-white sm:text-5xl lg:text-[64px]">
                Learn the circuit.
                <span className="block bg-gradient-to-r from-blue-300 via-blue-400 to-cyan-300 bg-clip-text text-transparent">
                  Master the system.
                </span>
              </h1>

              <p className="mt-6 max-w-2xl text-[15px] leading-7 text-slate-400 sm:text-base">
                Build practical wiring confidence through guided simulations—from electrical fundamentals to real-world access control and industrial automation.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <button
                  type="button"
                  onClick={() => initLevel(activeModuleIndex)}
                  className="group inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 text-sm font-semibold text-white shadow-[0_12px_35px_rgba(37,99,235,0.28)] transition-all hover:-translate-y-0.5 hover:bg-blue-500 hover:shadow-[0_16px_42px_rgba(37,99,235,0.38)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-300"
                >
                  <Play className="h-4 w-4 fill-current" />
                  {activeModuleIndex === 0 ? 'Start training' : 'Continue training'}
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </button>
                <button
                  type="button"
                  onClick={scrollToModules}
                  className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-5 text-sm font-semibold text-slate-200 transition-all hover:border-white/20 hover:bg-white/[0.08] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-300"
                >
                  <LayoutGrid className="h-4 w-4 text-slate-400" />
                  Browse modules
                </button>
              </div>

              <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-xs text-slate-500">
                {[
                  { icon: Zap, label: 'Live circuit simulation' },
                  { icon: Gauge, label: 'Instant diagnostics' },
                  { icon: ShieldCheck, label: 'Real safety scenarios' },
                ].map(item => (
                  <span key={item.label} className="inline-flex items-center gap-2">
                    <item.icon className="h-3.5 w-3.5 text-blue-400" />
                    {item.label}
                  </span>
                ))}
              </div>
            </div>

            <button
              type="button"
              onClick={() => initLevel(activeModuleIndex)}
              className="group dashboard-rise dashboard-rise-delay relative overflow-hidden rounded-[26px] border border-white/10 bg-[#0b111d]/90 p-2 text-left shadow-[0_35px_80px_rgba(0,0,0,0.35)] transition-all hover:-translate-y-1 hover:border-blue-400/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-300"
            >
              <div className="absolute inset-x-12 top-0 h-px bg-gradient-to-r from-transparent via-blue-400/80 to-transparent" />
              <div className="relative overflow-hidden rounded-[20px] border border-white/[0.06] bg-gradient-to-br from-blue-500/[0.13] via-[#0a111d] to-cyan-400/[0.04] p-5 sm:p-6">
                <div className="mb-5 flex items-center justify-between gap-3">
                  <span className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.18em] text-blue-300">
                    <span className="h-1.5 w-1.5 rounded-full bg-blue-400 shadow-[0_0_10px_#60a5fa]" />
                    Up next
                  </span>
                  <span className="rounded-full border border-white/10 bg-black/20 px-2.5 py-1 font-mono text-[10px] font-semibold text-slate-400">
                    {String(activeModule.id).padStart(2, '0')} / {totalLevels}
                  </span>
                </div>

                <div className="flex min-h-[150px] items-center gap-5">
                  <div className="relative flex h-32 w-32 shrink-0 items-center justify-center rounded-2xl border border-white/[0.08] bg-[#060a12]/70 p-5 shadow-inner sm:h-36 sm:w-36">
                    <div className="absolute inset-3 rounded-xl border border-blue-400/[0.08]" />
                    <div className="relative h-full w-full transition-transform duration-500 group-hover:scale-105">
                      <RealWorldVisual levelId={activeModule.id} isActive />
                    </div>
                  </div>
                  <div className="min-w-0 py-2">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-500">
                      {getModuleTrackLabel(activeModule.id)}
                    </p>
                    <h2 className="mt-2 text-lg font-semibold leading-snug tracking-tight text-white sm:text-xl">
                      {activeModule.title}
                    </h2>
                    <p className="mt-2 line-clamp-3 text-xs leading-5 text-slate-400">
                      {activeModule.description}
                    </p>
                  </div>
                </div>

                <div className="mt-6 border-t border-white/[0.07] pt-5">
                  <div className="mb-2.5 flex items-center justify-between text-[10px] font-semibold uppercase tracking-[0.12em]">
                    <span className="text-slate-500">Course progress</span>
                    <span className="text-slate-300">{percentComplete}%</span>
                  </div>
                  <div className="h-1.5 overflow-hidden rounded-full bg-white/[0.06]">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-blue-600 to-cyan-400 transition-all duration-1000"
                      style={{ width: `${Math.max(percentComplete, 3)}%` }}
                    />
                  </div>
                  <div className="mt-5 flex items-center justify-between">
                    <span className="inline-flex items-center gap-2 text-xs text-slate-500">
                      <Clock3 className="h-3.5 w-3.5" /> Guided simulation
                    </span>
                    <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-300">
                      Open module
                      <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                    </span>
                  </div>
                </div>
              </div>
            </button>
          </div>

          <div className="mt-12 grid grid-cols-2 overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.025] sm:grid-cols-4 lg:mt-16">
            {[
              { label: 'Training modules', value: totalLevels, suffix: '', icon: CircuitBoard },
              { label: 'Modules completed', value: completedCount, suffix: '', icon: CheckCircle2 },
              { label: 'Course progress', value: percentComplete, suffix: '%', icon: BarChart3 },
              { label: 'Badges earned', value: unlockedCount, suffix: '', icon: Trophy },
            ].map((stat, index) => (
              <div
                key={stat.label}
                className={`flex items-center gap-3 px-4 py-5 sm:px-5 ${index % 2 === 1 ? 'border-l border-white/[0.07]' : ''} ${index > 1 ? 'border-t border-white/[0.07] sm:border-t-0 sm:border-l' : ''}`}
              >
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-blue-400/10 bg-blue-400/[0.07]">
                  <stat.icon className="h-4 w-4 text-blue-300" />
                </div>
                <div className="min-w-0">
                  <p className="text-xl font-semibold tabular-nums text-white">
                    <AnimatedNumber value={stat.value} suffix={stat.suffix} />
                  </p>
                  <p className="truncate text-[10px] font-semibold uppercase tracking-[0.1em] text-slate-500">{stat.label}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section
          ref={moduleSectionRef}
          className="scroll-mt-6 border-t border-white/[0.06] bg-[#070b13]/75"
        >
          <div className="mx-auto max-w-[1440px] px-4 py-14 sm:px-6 sm:py-16 lg:px-10 lg:py-20">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <div className="mb-3 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.18em] text-blue-300">
                  <CircuitBoard className="h-3.5 w-3.5" />
                  Training library
                </div>
                <h2 className="text-3xl font-semibold tracking-[-0.03em] text-white sm:text-4xl">Choose your next module</h2>
                <p className="mt-3 max-w-xl text-sm leading-6 text-slate-400">
                  Work through the full path or jump directly to the system you want to practise.
                </p>
              </div>

              <div className="relative w-full lg:w-[360px]">
                <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                <input
                  type="search"
                  value={searchQuery}
                  onChange={event => setSearchQuery(event.target.value)}
                  placeholder="Search modules"
                  aria-label="Search training modules"
                  className="h-12 w-full rounded-xl border border-white/10 bg-white/[0.04] pl-11 pr-11 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-blue-400/40 focus:bg-white/[0.06] focus:ring-4 focus:ring-blue-500/10"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    aria-label="Clear search"
                    className="absolute right-3 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-md text-slate-500 transition hover:bg-white/10 hover:text-white"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>

            <div className="mt-8 flex flex-col gap-4 border-b border-white/[0.07] pb-5 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex max-w-full gap-2 overflow-x-auto pb-1">
                {moduleTracks.map(track => (
                  <button
                    key={track.id}
                    type="button"
                    onClick={() => setActiveTrack(track.id)}
                    className={`shrink-0 rounded-lg border px-3.5 py-2 text-xs font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-300 ${
                      activeTrack === track.id
                        ? 'border-blue-400/30 bg-blue-500/15 text-blue-200'
                        : 'border-white/[0.07] bg-white/[0.025] text-slate-500 hover:border-white/15 hover:text-slate-300'
                    }`}
                  >
                    {track.label}
                  </button>
                ))}
              </div>
              <p className="shrink-0 text-xs text-slate-500">
                <span className="font-semibold text-slate-300">{visibleLevels.length}</span> modules available
              </p>
            </div>

            {visibleLevels.length > 0 ? (
              <div className="mt-7 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {visibleLevels.map(level => {
                  const index = levels.indexOf(level);
                  const isCompleted = index < completedCount;
                  const isActive = index === activeModuleIndex;

                  return (
                    <button
                      key={level.id}
                      type="button"
                      onClick={() => initLevel(index)}
                      className={`group relative flex min-h-[340px] flex-col overflow-hidden rounded-2xl border bg-[#0a101b] text-left transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_24px_50px_rgba(0,0,0,0.28)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-300 ${
                        isActive
                          ? 'border-blue-400/35 shadow-[0_0_0_1px_rgba(59,130,246,0.08),0_20px_50px_rgba(0,0,0,0.2)]'
                          : 'border-white/[0.07] hover:border-white/[0.16]'
                      }`}
                    >
                      {isActive && <div className="absolute inset-x-8 top-0 z-10 h-px bg-gradient-to-r from-transparent via-blue-400 to-transparent" />}

                      <div className="relative flex h-[158px] w-full items-center justify-center overflow-hidden border-b border-white/[0.06] bg-gradient-to-br from-white/[0.035] to-transparent p-6">
                        <div className="absolute inset-0 dashboard-card-grid opacity-50 transition-opacity group-hover:opacity-80" />
                        <div className="absolute left-4 top-4 z-10 rounded-md border border-white/[0.08] bg-[#050810]/70 px-2 py-1 font-mono text-[9px] font-bold tracking-wider text-slate-500 backdrop-blur">
                          MODULE {String(level.id).padStart(2, '0')}
                        </div>
                        <div className="absolute right-4 top-4 z-10">
                          {isCompleted ? (
                            <span className="inline-flex items-center gap-1 rounded-full border border-emerald-400/15 bg-emerald-400/[0.08] px-2 py-1 text-[9px] font-bold uppercase tracking-wider text-emerald-300">
                              <Check className="h-3 w-3" /> Complete
                            </span>
                          ) : isActive ? (
                            <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-400/20 bg-blue-400/[0.1] px-2 py-1 text-[9px] font-bold uppercase tracking-wider text-blue-300">
                              <span className="h-1.5 w-1.5 rounded-full bg-blue-400" /> Current
                            </span>
                          ) : (
                            <span className="rounded-full border border-white/[0.08] bg-white/[0.035] px-2 py-1 text-[9px] font-bold uppercase tracking-wider text-slate-500">
                              Available
                            </span>
                          )}
                        </div>

                        <div className="relative h-24 w-24 transition-transform duration-500 group-hover:scale-110">
                          <RealWorldVisual levelId={level.id} isActive={isCompleted || isActive} />
                        </div>
                      </div>

                      <div className="flex flex-1 flex-col p-5">
                        <div className="mb-3 flex items-center gap-2">
                          <span className="text-[9px] font-bold uppercase tracking-[0.14em] text-blue-300/80">
                            {getModuleTrackLabel(level.id)}
                          </span>
                          <span className="h-1 w-1 rounded-full bg-slate-700" />
                          <span className="text-[10px] text-slate-600">Interactive lab</span>
                        </div>
                        <h3 className="text-[15px] font-semibold leading-snug tracking-tight text-slate-100 transition-colors group-hover:text-white">
                          {level.title}
                        </h3>
                        <p className="mt-2 line-clamp-2 text-xs leading-5 text-slate-500">
                          {level.description}
                        </p>

                        <div className="mt-auto flex items-center justify-between border-t border-white/[0.06] pt-4">
                          <span className="inline-flex items-center gap-1.5 text-[10px] text-slate-600">
                            <Clock3 className="h-3.5 w-3.5" /> Self-paced
                          </span>
                          <span className="inline-flex items-center gap-1 text-xs font-semibold text-slate-400 transition-colors group-hover:text-blue-300">
                            {isActive ? 'Continue' : isCompleted ? 'Review' : 'Start'}
                            <ChevronRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                          </span>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="mt-7 flex min-h-[280px] flex-col items-center justify-center rounded-2xl border border-dashed border-white/10 bg-white/[0.02] px-6 text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04]">
                  <Search className="h-5 w-5 text-slate-500" />
                </div>
                <h3 className="mt-4 text-sm font-semibold text-slate-300">No modules found</h3>
                <p className="mt-2 max-w-sm text-xs leading-5 text-slate-500">Try another search term or select a different training track.</p>
                <button
                  type="button"
                  onClick={() => { setSearchQuery(''); setActiveTrack('all'); }}
                  className="mt-5 rounded-lg border border-white/10 bg-white/[0.04] px-4 py-2 text-xs font-semibold text-slate-300 transition hover:bg-white/[0.08] hover:text-white"
                >
                  Reset filters
                </button>
              </div>
            )}
          </div>
        </section>
      </main>

      <footer className="relative z-10 border-t border-white/[0.07] bg-[#05080f]">
        <div className="mx-auto flex max-w-[1440px] flex-col gap-3 px-4 py-6 text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-600 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-10">
          <span>DELMI Training Institute · Electronics Lab</span>
          <span className="inline-flex items-center gap-2 normal-case tracking-normal text-slate-500">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            Simulation systems ready
          </span>
        </div>
      </footer>
    </div>
  );
};

export default LevelDashboard;
