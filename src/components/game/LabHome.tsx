import { useState } from 'react';
import { 
  ArrowRight, 
  Cable, 
  Check, 
  Copy, 
  Cpu, 
  Gauge, 
  Plus, 
  Undo2, 
  Zap, 
  Layers, 
  ShieldCheck, 
  Sparkles, 
  Sliders, 
  Search,
  Lock,
  Unlock,
  KeyRound,
  FlaskConical
} from 'lucide-react';
import { useGameStore } from '../../store/useGameStore';
import { 
  customLabCategories,
  getWorkspaceOptions
} from '../../customLab/componentCatalog';
import { LAB_PRESETS, type LabPreset } from '../../customLab/presets';
import { Logo } from './components/Logo';
import { soundManager } from '../../audio/soundManager';
import { 
  isLabUnlocked, 
  lockLabs 
} from '../../utils/betaAuth';
import { BetaAccessModal } from './BetaAccessModal';

const workflowSteps = [
  {
    number: '01',
    icon: Plus,
    title: 'Select & Duplicate Devices',
    text: 'Start with an industrial transformer and 24V regulated DC supply. Add switches, ice-cube relays, timer modules, sirens, or cooling fans—place up to 32 devices on a single bench.'
  },
  {
    number: '02',
    icon: Cable,
    title: 'Magnetic Terminal Wiring',
    text: 'Drag devices anywhere on the bench. Click or drag between terminal screws to draw wires. Terminals automatically snap within magnetic range, and wires can be color-coded and spliced with wire nuts.'
  },
  {
    number: '03',
    icon: Zap,
    title: 'Simulate with True Physics',
    text: 'Switch on power and operate your controls. The real-time Kirchhoff solver calculates node voltages, detects short circuits, pops fuses when overloaded, and drives real loads.'
  },
  {
    number: '04',
    icon: Gauge,
    title: 'True-RMS Multimeter Diagnostics',
    text: 'Clip red and black probe leads to any two points on your circuit. Measure live DC/AC voltages, trace voltage drops across relay contacts, and check continuity through switches.'
  }
];

export function LabHome() {
  const workspaceKind = useGameStore(state => state.workspaceKind);
  const electronicsOptions = getWorkspaceOptions('electronics');
  const isCustomLab = useGameStore(state => state.isCustomLab);
  const benchComponents = useGameStore(state => state.components);
  const startCustomLab = useGameStore(state => state.startCustomLab);
  const loadCX12Example = useGameStore(state => state.loadCX12Example);
  
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Access Auth State for both labs
  const [unlocked, setUnlocked] = useState(() => isLabUnlocked());
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState('Enter Access Code');
  const [pendingAction, setPendingAction] = useState<(() => void) | null>(null);

  const hasBench = workspaceKind === 'electronics' && isCustomLab && benchComponents.length > 0;

  // Gated execution helper: both labs require code
  const executeGatedAction = (action: () => void, title = 'Enter Access Code') => {
    if (isLabUnlocked()) {
      soundManager.playButton();
      setUnlocked(true);
      action();
    } else {
      soundManager.playButton();
      setModalTitle(title);
      setPendingAction(() => action);
      setAuthModalOpen(true);
    }
  };

  const openLab = () => {
    executeGatedAction(() => {
      useGameStore.getState().openElectronicsWorkspace();
    }, 'Electronics Lab');
  };

  const openAccessLab = () => {
    executeGatedAction(() => {
      useGameStore.getState().openAccessWorkspace();
    }, 'Access Control Lab (Beta)');
  };

  const handleLock = () => {
    soundManager.playButton();
    lockLabs();
    setUnlocked(false);
  };

  const handleLaunchPreset = (preset: LabPreset) => {
    const isAccess = preset.category === 'Access Control' || preset.accessControllerExample;
    executeGatedAction(() => {
      if (isAccess) {
        if (preset.accessControllerExample) {
          useGameStore.getState().loadAccessControllerExample();
        } else if (preset.cx12ExampleId) {
          loadCX12Example(preset.cx12ExampleId!, 'access');
        } else {
          startCustomLab(preset.deviceCatalogIds, 'access');
        }
      } else {
        if (preset.cx12ExampleId) {
          loadCX12Example(preset.cx12ExampleId!, 'electronics');
        } else {
          startCustomLab(preset.deviceCatalogIds, 'electronics');
        }
      }
    }, isAccess ? 'Access Control Lab (Beta)' : 'Electronics Lab');
  };

  const handleAddDeviceAndOpen = (optionId: string) => {
    executeGatedAction(() => {
      startCustomLab([optionId]);
    }, 'Electronics Lab');
  };

  const filteredDevices = electronicsOptions.filter(device => {
    const matchesCategory = activeCategory === 'all' || device.category === activeCategory;
    const matchesSearch = !searchQuery || 
      device.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      device.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      device.terminalSummary.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const buttonClass = 'inline-flex min-h-12 items-center justify-center gap-3 rounded-xl bg-sky-400 px-7 text-sm font-semibold text-slate-950 shadow-[0_6px_30px_-10px_rgba(56,189,248,0.5)] transition-all hover:bg-sky-300 hover:shadow-[0_8px_35px_-8px_rgba(56,189,248,0.65)] hover:-translate-y-0.5 active:translate-y-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-200 focus-visible:ring-offset-4 focus-visible:ring-offset-[#080e18]';

  return (
    <div className="min-h-screen bg-[#070b13] text-slate-200 selection:bg-sky-500 selection:text-slate-950 font-sans">
      
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-40 border-b border-white/[0.08] bg-[#070b13]/85 backdrop-blur-xl">
        <div className="mx-auto flex max-w-[1360px] items-center justify-between gap-4 px-6 py-3.5 lg:px-10">
          <div className="flex items-center gap-4">
            <Logo size="sm" />
            <div className="border-l border-white/10 pl-4">
              <div className="flex items-center gap-2">
                <p className="text-sm font-semibold text-white tracking-tight">Training Labs</p>
                <span className="rounded bg-sky-500/10 px-2 py-0.5 text-[10px] font-mono font-semibold text-sky-400 border border-sky-400/20">
                  v2.0
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">Electronics &amp; Access Control</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {unlocked ? (
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1 text-[11px] font-mono text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20">
                  <Unlock size={12} />
                  <span>Unlocked</span>
                </span>
                <button
                  type="button"
                  onClick={handleLock}
                  className="rounded-lg border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs text-slate-400 hover:text-white transition"
                  title="Lock access"
                >
                  Lock
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => {
                  soundManager.playButton();
                  setModalTitle('Enter Access Code');
                  setAuthModalOpen(true);
                }}
                className="inline-flex items-center gap-1.5 rounded-lg border border-white/15 bg-white/[0.05] px-3 py-1.5 text-xs text-slate-300 hover:text-white transition"
              >
                <KeyRound size={13} />
                <span>Enter Code</span>
              </button>
            )}

            <button 
              type="button"
              onClick={openLab}
              className="inline-flex h-10 shrink-0 items-center gap-2 rounded-xl bg-sky-400 px-4 text-xs font-bold text-slate-950 transition hover:bg-sky-300 shadow-[0_4px_16px_-4px_rgba(56,189,248,0.4)]"
            >
              <span>Launch Electronics Lab</span>
              <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-[1360px] px-6 pb-20 lg:px-10">
        
        {/* LAB SELECTION HERO SECTION: ELECTRONICS LAB AT TOP */}
        <section id="labs" className="scroll-mt-24 pb-8 pt-8 sm:pb-10 sm:pt-10" aria-labelledby="labs-title">
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-sky-400">DELMI virtual training</p>
          <h1 id="labs-title" className="mt-2 text-3xl font-extrabold tracking-tight text-white sm:text-4xl">Choose your lab</h1>
          <p className="mt-2.5 max-w-2xl text-sm leading-relaxed text-slate-300">
            Build circuits in the primary <span className="text-sky-300 font-semibold">Electronics Lab</span>, or practice installations in the <span className="text-amber-400 font-semibold">Access Control Lab (Beta)</span> below.
          </p>

          {/* 1. PRIMARY LAB AT TOP: ELECTRONICS LAB (PROMINENT, GLOWING, EASY ACCESS) */}
          <div className="mt-6">
            <article className="relative overflow-hidden rounded-3xl border-2 border-sky-400/40 bg-gradient-to-br from-sky-500/[0.12] via-[#0b1322] to-[#070b13] p-6 sm:p-8 shadow-[0_12px_45px_-10px_rgba(56,189,248,0.3)] transition hover:border-sky-400/60" aria-labelledby="electronics-lab-title">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div className="max-w-3xl">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-sky-400/15 px-3 py-1 text-[11px] font-semibold text-sky-300 border border-sky-400/30">
                      <Sparkles size={13} />
                      PRIMARY WORKBENCH · READY TO WIRE
                    </span>
                    <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400">
                      Circuits &amp; Diagnostics
                    </span>
                  </div>

                  <div className="mt-3.5 flex items-center gap-3.5">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-sky-300/30 bg-sky-400/15 text-sky-300 shadow-inner">
                      <Cpu size={26} />
                    </div>
                    <div>
                      <h2 id="electronics-lab-title" className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
                        Electronics Lab
                      </h2>
                    </div>
                  </div>

                  <p className="mt-3 text-sm leading-relaxed text-slate-300 max-w-2xl">
                    Build, wire and test low-voltage circuits with transformers, 24V regulated DC power supplies, ice-cube relays, timers and sirens. Features real-time Kirchhoff physics and True-RMS multimeter diagnostics.
                  </p>

                  <div className="mt-5 grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs text-slate-300">
                    <div className="flex items-center gap-2 rounded-xl bg-white/[0.035] border border-white/5 px-3 py-2">
                      <Check size={15} className="shrink-0 text-sky-300" />
                      <span>Supplies, switches &amp; relays</span>
                    </div>
                    <div className="flex items-center gap-2 rounded-xl bg-white/[0.035] border border-white/5 px-3 py-2">
                      <Check size={15} className="shrink-0 text-sky-300" />
                      <span>Timers, motors &amp; sirens</span>
                    </div>
                    <div className="flex items-center gap-2 rounded-xl bg-white/[0.035] border border-white/5 px-3 py-2">
                      <Check size={15} className="shrink-0 text-sky-300" />
                      <span>Live simulation &amp; multimeter</span>
                    </div>
                  </div>
                </div>

                {/* Action Button */}
                <div className="flex flex-col sm:flex-row lg:flex-col items-stretch lg:items-end justify-center gap-3 shrink-0 lg:pl-6 lg:border-l lg:border-white/10">
                  <button
                    type="button"
                    onClick={openLab}
                    className="inline-flex min-h-14 items-center justify-center gap-3 rounded-2xl bg-sky-400 px-8 text-base font-bold text-slate-950 shadow-[0_8px_35px_-8px_rgba(56,189,248,0.6)] transition-all hover:bg-sky-300 hover:shadow-[0_12px_45px_-6px_rgba(56,189,248,0.75)] hover:-translate-y-0.5 active:translate-y-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-200"
                  >
                    {!unlocked && <Lock size={18} />}
                    <span>{hasBench ? 'Resume Electronics Lab' : 'Open Electronics Lab'}</span>
                    <ArrowRight size={20} />
                  </button>
                </div>
              </div>
            </article>
          </div>

          {/* 2. PUT DOWN: ACCESS CONTROL LAB (BETA ONLY) */}
          <div className="mt-5">
            <article className="relative overflow-hidden rounded-2xl border border-amber-400/30 bg-gradient-to-br from-amber-500/[0.06] via-[#0c1422] to-[#090e18] p-5 sm:p-6 transition hover:border-amber-400/50" aria-labelledby="access-lab-title">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
                <div className="flex items-start sm:items-center gap-3.5">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-amber-400/30 bg-amber-400/10 text-amber-300">
                    {unlocked ? <ShieldCheck size={22} className="text-teal-300" /> : <Lock size={22} />}
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded bg-amber-400/15 px-2 py-0.5 text-[10px] font-mono font-bold tracking-wider text-amber-400 border border-amber-400/30">
                        BETA ONLY
                      </span>
                      <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                        Readers &amp; Doors
                      </span>
                    </div>
                    <h2 id="access-lab-title" className="mt-1 text-xl font-bold text-white flex items-center gap-2">
                      <span>Access Control Lab</span>
                      <span className="text-xs font-normal text-amber-300/80">(Private Beta)</span>
                    </h2>
                    <p className="mt-1 text-xs text-slate-300 max-w-xl">
                      Wire and program a two-door installation bench with DELMI AC-2 controller, readers, REX, door contacts and magnetic locks.
                    </p>
                  </div>
                </div>

                {/* Action button */}
                <div className="flex items-center gap-2.5 shrink-0 pt-2 md:pt-0">
                  <button
                    type="button"
                    onClick={openAccessLab}
                    className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-teal-300 px-5 text-xs font-bold text-slate-950 shadow-[0_4px_20px_-5px_rgba(94,234,212,0.4)] transition hover:bg-teal-200 hover:-translate-y-0.5"
                  >
                    {!unlocked && <Lock size={14} />}
                    <span>Open Access Control Lab (Beta)</span>
                    <ArrowRight size={16} />
                  </button>
                </div>
              </div>
            </article>
          </div>

          <p className="mt-4 flex items-start gap-2 text-xs leading-relaxed text-slate-400">
            <Layers size={15} className="mt-0.5 shrink-0 text-slate-500" />
            <span>Each lab keeps its own devices, wiring and Undo history. Switch labs and continue where you left off.</span>
          </p>
        </section>

        {/* SECTION 1: ELECTRONICS LAB TEMPLATES */}
        <section id="presets" className="scroll-mt-20 border-t border-white/[0.08] pt-14 pb-14">
          <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
            <div>
              <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] text-sky-400">
                <Sliders size={14} />
                <span>Electronics Lab templates</span>
              </div>
              <h2 className="mt-2 text-2xl font-bold tracking-tight text-white sm:text-3xl">
                Start with a curated template or blank slate.
              </h2>
            </div>
            <p className="text-xs text-slate-400 max-w-sm">
              Choose a template to open Electronics Lab with its devices placed and ready to wire.
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {LAB_PRESETS.filter(preset => preset.category !== 'Access Control').map((preset) => (
              <div 
                key={preset.id}
                className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0c1320] p-6 transition-all duration-300 hover:border-sky-400/40 hover:bg-[#0e1727] hover:shadow-[0_12px_40px_-15px_rgba(56,189,248,0.25)] hover:-translate-y-1"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <span className="rounded-md border border-sky-400/20 bg-sky-400/10 px-2.5 py-1 text-[10px] font-semibold text-sky-300 font-mono uppercase">
                      {preset.badge}
                    </span>
                    <span className="text-[11px] font-mono text-slate-400">
                      {preset.componentsCount} devices
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-white group-hover:text-sky-300 transition-colors">
                    {preset.title}
                  </h3>
                  
                  <p className="mt-2.5 text-xs text-slate-400 leading-relaxed">
                    {preset.description}
                  </p>

                  <ul className="mt-4 space-y-1.5 border-t border-white/[0.06] pt-4 text-[11px] text-slate-300">
                    {preset.features.map((feat, idx) => (
                      <li key={idx} className="flex items-center gap-2">
                        <span className="h-1.5 w-1.5 rounded-full bg-sky-400" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-6 pt-2">
                  <button
                    onClick={() => handleLaunchPreset(preset)}
                    className="w-full inline-flex items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/[0.05] py-2.5 px-4 text-xs font-semibold text-white transition-all group-hover:border-sky-400 group-hover:bg-sky-400 group-hover:text-slate-950"
                  >
                    <span>Load in Electronics Lab</span>
                    <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* SECTION 2: MODULAR DEVICE CATALOG */}
        <section id="components" className="scroll-mt-20 border-t border-white/[0.08] pt-14 pb-14">
          <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
            <div>
              <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] text-sky-400">
                <Cpu size={14} />
                <span>Modular Device Catalog</span>
              </div>
              <h2 className="mt-2 text-2xl font-bold tracking-tight text-white sm:text-3xl">
                {electronicsOptions.length} electronics components ready to place.
              </h2>
            </div>
            
            {/* Search input */}
            <div className="relative min-w-[260px]">
              <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search relays, timers, motors..."
                className="w-full rounded-xl border border-white/10 bg-white/[0.04] py-2 pl-9 pr-4 text-xs text-white placeholder-slate-500 focus:border-sky-400 focus:bg-white/[0.07] focus:outline-none"
              />
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center gap-2 mb-6">
            <button
              onClick={() => setActiveCategory('all')}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                activeCategory === 'all'
                  ? 'bg-sky-400 text-slate-950 shadow-sm'
                  : 'border border-white/10 bg-white/[0.03] text-slate-400 hover:text-white'
              }`}
            >
              All Devices ({electronicsOptions.length})
            </button>
            {customLabCategories.map((cat) => {
              const count = electronicsOptions.filter(d => d.category === cat.id).length;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                    activeCategory === cat.id
                      ? 'bg-sky-400 text-slate-950 shadow-sm'
                      : 'border border-white/10 bg-white/[0.03] text-slate-400 hover:text-white'
                  }`}
                >
                  {cat.label} ({count})
                </button>
              );
            })}
          </div>

          {/* Device Cards Grid */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredDevices.map((device) => (
              <div
                key={device.id}
                className="flex flex-col justify-between rounded-xl border border-white/[0.07] bg-[#0b121e] p-4 transition-all hover:border-sky-400/30 hover:bg-[#0e1727]"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2.5">
                    <span className="rounded bg-sky-500/10 px-2 py-0.5 text-[9px] font-mono font-semibold uppercase text-sky-300">
                      {device.category}
                    </span>
                    <span className="text-[10px] font-mono text-slate-400 truncate max-w-[140px]" title={device.terminalSummary}>
                      {device.terminalSummary}
                    </span>
                  </div>

                  <h4 className="text-sm font-bold text-white leading-snug">
                    {device.name}
                  </h4>

                  <p className="mt-2 text-xs text-slate-400 line-clamp-3 leading-relaxed">
                    {device.description}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-white/[0.05] flex items-center justify-between gap-2">
                  <span className="text-[11px] font-mono text-slate-400">
                    {device.template.terminals.length} terminals
                  </span>
                  <button
                    onClick={() => handleAddDeviceAndOpen(device.id)}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-sky-400/30 bg-sky-400/10 px-2.5 py-1 text-xs font-semibold text-sky-300 transition hover:bg-sky-400 hover:text-slate-950"
                  >
                    <span>Add to Bench</span>
                    <Plus size={12} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* SECTION 3: HOW IT WORKS & WORKFLOW */}
        <section id="how-it-works" className="scroll-mt-20 border-t border-white/[0.08] pt-14 pb-14">
          <div className="flex flex-wrap items-end justify-between gap-4 mb-10">
            <div>
              <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] text-sky-400">
                <Layers size={14} />
                <span>The Engineering Workflow</span>
              </div>
              <h2 className="mt-2 text-2xl font-bold tracking-tight text-white sm:text-3xl">
                From idea to running low-voltage circuit.
              </h2>
            </div>
            <span className="text-xs text-slate-400 font-mono">
              Engineered for precision wiring &amp; diagnostics
            </span>
          </div>

          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {workflowSteps.map(({ number, icon: Icon, title, text }) => (
              <article 
                key={number} 
                className="relative overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0c1421] p-6 transition hover:border-white/15"
              >
                <div className="flex items-center justify-between mb-5">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-sky-400/30 bg-sky-400/10 text-sky-300">
                    <Icon size={20} />
                  </div>
                  <span className="font-mono text-xs font-bold text-slate-400">{number}</span>
                </div>
                <h3 className="text-base font-bold text-white">{title}</h3>
                <p className="mt-3 text-xs leading-relaxed text-slate-400">{text}</p>
              </article>
            ))}
          </div>
        </section>

        {/* SECTION 4: ENGINE FEATURES GRID */}
        <section className="border-t border-white/[0.08] pt-14 pb-14">
          <div className="rounded-3xl border border-sky-400/20 bg-gradient-to-br from-sky-950/20 via-[#0a121e] to-indigo-950/20 p-8 lg:p-12">
            <div className="max-w-2xl mb-10">
              <span className="rounded-full bg-sky-400/10 px-3 py-1 text-xs font-semibold text-sky-300 border border-sky-400/25">
                Engine Capabilities
              </span>
              <h2 className="mt-4 text-2xl font-bold tracking-tight text-white sm:text-3xl">
                A professional test bench in your web browser.
              </h2>
              <p className="mt-3 text-sm text-slate-300 leading-relaxed">
                Designed from the ground up for low-voltage technicians, security installers, and electrical students.
              </p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-5">
                <div className="flex items-center gap-3 text-sky-300 mb-3">
                  <Zap size={18} />
                  <h4 className="text-sm font-bold text-white">Full Kirchhoff DC/AC Solver</h4>
                </div>
                <p className="text-xs leading-relaxed text-slate-400">
                  Calculates exact node potentials, branch currents, and series/parallel drops. Identifies direct shorts and blows protective fuses accurately.
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-5">
                <div className="flex items-center gap-3 text-amber-300 mb-3">
                  <Gauge size={18} />
                  <h4 className="text-sm font-bold text-white">Interactive Fluke Multimeter</h4>
                </div>
                <p className="text-xs leading-relaxed text-slate-400">
                  Select Volts, Continuity, or Resistance. Place independent red and black probes to trace faults, check open contacts, and measure drop across coils.
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-5">
                <div className="flex items-center gap-3 text-emerald-300 mb-3">
                  <Cable size={18} />
                  <h4 className="text-sm font-bold text-white">Wire Nuts &amp; Splice Connectors</h4>
                </div>
                <p className="text-xs leading-relaxed text-slate-400">
                  Splice into any existing wire mid-run with wire nuts. Route complex branch circuits, parallel loads, and daisy-chained switches cleanly.
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-5">
                <div className="flex items-center gap-3 text-purple-300 mb-3">
                  <Copy size={18} />
                  <h4 className="text-sm font-bold text-white">Instant Device Duplication</h4>
                </div>
                <p className="text-xs leading-relaxed text-slate-400">
                  Need 4 relays or 6 indicator lights? Duplicate any placed device with a single click. Configurations, timers, and state replicate cleanly.
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-5">
                <div className="flex items-center gap-3 text-cyan-300 mb-3">
                  <Undo2 size={18} />
                  <h4 className="text-sm font-bold text-white">Robust 30-Step Undo / Redo</h4>
                </div>
                <p className="text-xs leading-relaxed text-slate-400">
                  Never lose work. Every wire connection, device relocation, deletion, and parameter adjustment is tracked with keyboard shortcuts (Ctrl/Cmd+Z).
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-5">
                <div className="flex items-center gap-3 text-pink-300 mb-3">
                  <ShieldCheck size={18} />
                  <h4 className="text-sm font-bold text-white">Zero Hardware Risk</h4>
                </div>
                <p className="text-xs leading-relaxed text-slate-400">
                  Experiment safely with high current loops, reverse polarities, and latching relay logic without the risk of melted wires or destroyed equipment.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 5: ACCESS CONTROL LAB (BETA ONLY) TEMPLATES - PUT DOWN */}
        <section id="access-control" className="scroll-mt-24 border-t border-amber-400/20 pb-14 pt-12">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-2">
            <div className="flex items-center gap-2">
              <span className="flex h-6 items-center gap-1.5 rounded-full bg-amber-400/15 px-2.5 text-[10px] font-mono font-bold uppercase tracking-wider text-amber-400 border border-amber-400/30">
                <FlaskConical size={12} />
                Beta Lab Only
              </span>
            </div>
          </div>
          <h2 className="mt-1 text-2xl font-bold text-white sm:text-3xl">Access Control Lab Templates</h2>
          <p className="mt-2 text-xs leading-relaxed text-slate-300 max-w-xl">
            Pre-wired door access boards with readers, request-to-exit (REX) buttons, and maglock/strike hardware.
          </p>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {LAB_PRESETS.filter(preset => preset.category === 'Access Control').map(preset => (
              <button 
                key={preset.id} 
                onClick={() => handleLaunchPreset(preset)} 
                className="group relative flex flex-col justify-between rounded-2xl border border-white/10 bg-[#0b121e] p-5 text-left transition hover:border-amber-400/40 hover:bg-[#0e1727]"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="rounded bg-amber-400/10 px-2 py-0.5 text-[10px] font-mono font-semibold uppercase text-amber-400 border border-amber-400/20">
                      Beta
                    </span>
                    {!unlocked && (
                      <span className="flex items-center gap-1 text-[10px] font-mono text-slate-400">
                        <Lock size={11} className="text-amber-400/80" />
                      </span>
                    )}
                  </div>
                  <span className="text-sm font-bold text-white group-hover:text-amber-300 transition-colors">
                    {preset.title}
                  </span>
                  <span className="mt-2 block text-xs leading-relaxed text-slate-400">
                    {preset.description}
                  </span>
                </div>
                <span className="mt-4 flex items-center gap-1.5 text-xs font-semibold text-amber-300 group-hover:text-amber-200">
                  <span>Load in Access Control Lab</span>
                  <ArrowRight size={13} />
                </span>
              </button>
            ))}
          </div>
        </section>

        {/* SECTION 6: FINAL CALL TO ACTION BANNER */}
        <section className="mt-6 flex flex-col justify-between gap-6 rounded-3xl border border-sky-400/25 bg-gradient-to-r from-sky-500/10 via-[#0d1624] to-indigo-500/10 p-8 sm:flex-row sm:items-center sm:p-10 shadow-2xl">
          <div>
            <div className="flex items-center gap-2 text-sky-400 text-xs font-semibold mb-2">
              <Sparkles size={16} />
              <span>Electronics Lab</span>
            </div>
            <h2 className="text-2xl font-extrabold text-white sm:text-3xl tracking-tight">
              Ready to wire your next circuit?
            </h2>
            <p className="mt-2 text-sm text-slate-300 max-w-xl">
              Open your electronics bench with a 120V/24V transformer and regulated supply, then add devices and start wiring.
            </p>
          </div>

          <button onClick={openLab} className={`${buttonClass} shrink-0`}>
            {!unlocked && <Lock size={18} />}
            <span>{hasBench ? 'Resume Electronics Bench' : 'Open Electronics Bench'}</span>
            <ArrowRight size={18} />
          </button>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="border-t border-white/[0.08] bg-[#05080e] py-8 text-xs text-slate-400">
        <div className="mx-auto flex max-w-[1360px] flex-wrap items-center justify-between gap-4 px-6 lg:px-10">
          <div className="flex items-center gap-3">
            <Logo size="sm" variant="icon-only" />
            <div>
              <p className="font-semibold text-slate-300">DELMI Circuit Lab</p>
              <p className="text-[11px] text-slate-400">Low-Voltage Systems &amp; Security Automation Workbench</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-6 text-[11px] text-slate-400">
            <span>Real-time Kirchhoff Engine</span>
            <span>·</span>
            <span>Modular Device Catalog</span>
            <span>·</span>
            <span>Full Multimeter Diagnostics</span>
          </div>
        </div>
      </footer>

      {/* Access Code Login Modal */}
      <BetaAccessModal
        isOpen={authModalOpen}
        onClose={() => {
          setAuthModalOpen(false);
          setPendingAction(null);
        }}
        onSuccess={() => {
          setUnlocked(true);
          setAuthModalOpen(false);
          if (pendingAction) {
            const action = pendingAction;
            setPendingAction(null);
            action();
          } else {
            useGameStore.getState().openElectronicsWorkspace();
          }
        }}
        title={modalTitle}
        description="Please enter your access code to open the lab."
      />
    </div>
  );
}

export default LabHome;
