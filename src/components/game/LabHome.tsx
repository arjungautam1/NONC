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
  Search
} from 'lucide-react';
import { useGameStore } from '../../store/useGameStore';
import { 
  customLabCategories,
  getWorkspaceOptions
} from '../../customLab/componentCatalog';
import { LAB_PRESETS, type LabPreset } from '../../customLab/presets';
import { Logo } from './components/Logo';
import { BenchPreview } from './BenchPreview';
import { soundManager } from '../../audio/soundManager';

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
  const [pendingLaunch, setPendingLaunch] = useState<{ action: () => void } | null>(null);

  const hasBench = workspaceKind === 'electronics' && isCustomLab && benchComponents.length > 0;
  const deviceCount = benchComponents.length;

  const requestLaunch = (action: () => void) => {
    soundManager.playButton();
    setPendingLaunch({ action });
  };

  const confirmLaunch = () => {
    const action = pendingLaunch?.action;
    setPendingLaunch(null);
    action?.();
  };

  const openLab = () => requestLaunch(() => useGameStore.getState().openElectronicsWorkspace());

  const handleLaunchPreset = (preset: LabPreset) => {
    if (preset.accessControllerExample) {
      requestLaunch(() => useGameStore.getState().loadAccessControllerExample());
    } else if (preset.cx12ExampleId) {
      requestLaunch(() => {
        loadCX12Example(preset.cx12ExampleId!, preset.category === 'Access Control' ? 'access' : 'electronics');
      });
    } else {
      requestLaunch(() => startCustomLab(preset.deviceCatalogIds, preset.category === 'Access Control' ? 'access' : 'electronics'));
    }
  };

  const handleAddDeviceAndOpen = (optionId: string) => {
    requestLaunch(() => startCustomLab([optionId]));
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
                <p className="text-sm font-semibold text-white tracking-tight">Circuit Lab</p>
                <span className="rounded bg-sky-500/10 px-2 py-0.5 text-[10px] font-mono font-semibold text-sky-400 border border-sky-400/20">
                  v2.0
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">Industrial Low-Voltage Simulation Workbench</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {hasBench && (
              <div className="hidden md:flex items-center gap-2 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-1.5 text-xs text-emerald-300 font-medium">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>Active Bench: {deviceCount} {deviceCount === 1 ? 'device' : 'devices'}</span>
              </div>
            )}
            
            <button 
              onClick={openLab}
              className="inline-flex h-10 items-center gap-2 rounded-xl bg-sky-400 px-4 text-xs font-semibold text-slate-950 transition hover:bg-sky-300 shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300"
            >
              <span>{hasBench ? 'Resume Workbench' : 'Enter Electronics Lab'}</span>
              <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-[1360px] px-6 pb-20 lg:px-10">
        
        {/* HERO SECTION */}
        <section className="grid items-center gap-12 pb-16 pt-12 md:pt-16 lg:grid-cols-[0.95fr_1.05fr] lg:gap-14 lg:pb-24 lg:pt-20">
          <div>
            {/* Tagline Badge */}
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-sky-400/25 bg-sky-400/[0.08] px-3.5 py-1.5 text-xs font-medium text-sky-300 backdrop-blur-md">
              <span className="h-2 w-2 rounded-full bg-sky-400 animate-pulse" />
              <span>Full Custom Workbench · Zero Restrictions</span>
            </div>

            {/* Main Headline */}
            <h1 className="max-w-xl text-[clamp(2.6rem,5.2vw,4.6rem)] font-extrabold leading-[1.05] tracking-tight text-white">
              Your circuit.<br />
              <span className="bg-gradient-to-r from-sky-400 via-teal-300 to-indigo-400 bg-clip-text text-transparent">
                Your way.
              </span>
            </h1>

            {/* Subheading */}
            <p className="mt-6 max-w-[480px] text-base leading-relaxed text-slate-300">
              Build, wire, and test real-world low-voltage circuits with complete freedom. Place industrial relays, timers, and motors on an interactive workbench powered by a real Kirchhoff electrical engine.
            </p>

            {/* CTA Group */}
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <button onClick={openLab} className={buttonClass}>
                <span>{hasBench ? 'Resume Your Workbench' : 'Open Custom Lab'}</span>
                <ArrowRight size={18} />
              </button>
              
              <a 
                href="#presets" 
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/[0.04] px-5 text-sm font-semibold text-slate-200 transition hover:bg-white/10 hover:text-white"
              >
                <span>Browse Presets</span>
                <Sliders size={16} />
              </a>
            </div>

            {/* Status note */}
            <p className="mt-4 text-xs text-slate-400 flex items-center gap-2">
              <Check size={14} className="text-emerald-400" />
              <span>
                {hasBench 
                  ? `Your workbench with ${deviceCount} devices is ready to continue in this session.` 
                  : 'Starting fresh gives you a 120V/24V Transformer and 24V Regulated Supply.'}
              </span>
            </p>

            {/* Feature Highlights Pills */}
            <div className="mt-9 flex flex-wrap gap-x-6 gap-y-3 border-t border-white/[0.08] pt-6 text-xs text-slate-400">
              <span className="flex items-center gap-2">
                <Copy size={15} className="text-sky-400" /> 
                <span>Repeat any device up to 32x</span>
              </span>
              <span className="flex items-center gap-2">
                <Gauge size={15} className="text-amber-400" /> 
                <span>Dual-probe live multimeter</span>
              </span>
              <span className="flex items-center gap-2">
                <Undo2 size={15} className="text-emerald-400" /> 
                <span>Instant undo & redo</span>
              </span>
            </div>
          </div>

          {/* Interactive Bench Preview Showcase (Hero visual) */}
          <BenchPreview />
        </section>

        <section id="access-control" className="mb-14 rounded-2xl border border-teal-400/25 bg-teal-400/[0.05] p-6 sm:p-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-teal-300">Separate installation workspace</p>
              <h2 className="mt-2 text-2xl font-bold text-white">Access control lab</h2>
              <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-300">Wire readers, request-to-exit devices, door contacts and locks. Program the DELMI AC-2 training controller using the shared concepts of Atrium and RBH UNC100.</p>
              <p className="mt-2 text-xs text-slate-400">Your access and electronics benches keep separate devices, wiring and Undo history.</p>
            </div>
            <button onClick={() => requestLaunch(() => useGameStore.getState().openAccessWorkspace())} className="min-h-11 rounded-xl bg-teal-300 px-5 py-3 text-sm font-bold text-slate-950 hover:bg-teal-200">Open access control lab</button>
          </div>
          <div className="mt-6 grid gap-3 md:grid-cols-3">
            {LAB_PRESETS.filter(preset => preset.category === 'Access Control').map(preset => <button key={preset.id} onClick={() => handleLaunchPreset(preset)} className="rounded-xl border border-white/10 bg-[#0b121e] p-4 text-left hover:border-teal-300/40">
              <span className="text-sm font-semibold text-white">{preset.title}</span>
              <span className="mt-2 block text-xs leading-relaxed text-slate-400">{preset.description}</span>
              <span className="mt-3 block text-xs font-semibold text-teal-300">Load in access lab →</span>
            </button>)}
          </div>
        </section>

        {/* SECTION 1: QUICK START PRESETS */}
        <section id="presets" className="scroll-mt-20 border-t border-white/[0.08] pt-14 pb-14">
          <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
            <div>
              <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] text-sky-400">
                <Sliders size={14} />
                <span>Electronics & relays bench</span>
              </div>
              <h2 className="mt-2 text-2xl font-bold tracking-tight text-white sm:text-3xl">
                Start with a curated template or blank slate.
              </h2>
            </div>
            <p className="text-xs text-slate-400 max-w-sm">
              Click any template to immediately open the custom lab with those devices placed and ready to wire.
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
                    <span>Launch on Bench</span>
                    <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* SECTION 2: DEVICE CATALOG & COMPONENT EXPLORER */}
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
              Engineered for precision wiring & diagnostics
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
                  <h4 className="text-sm font-bold text-white">Wire Nuts & Splice Connectors</h4>
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

        {/* SECTION 5: FINAL CALL TO ACTION BANNER */}
        <section className="mt-8 flex flex-col justify-between gap-6 rounded-3xl border border-sky-400/25 bg-gradient-to-r from-sky-500/10 via-[#0d1624] to-indigo-500/10 p-8 sm:flex-row sm:items-center sm:p-10 shadow-2xl">
          <div>
            <div className="flex items-center gap-2 text-sky-400 text-xs font-semibold mb-2">
              <Sparkles size={16} />
              <span>DELMI Virtual Workbench</span>
            </div>
            <h2 className="text-2xl font-extrabold text-white sm:text-3xl tracking-tight">
              Ready to wire your next circuit?
            </h2>
            <p className="mt-2 text-sm text-slate-300 max-w-xl">
              Open your workbench now. The 120V/24V Transformer and 24V Regulated Supply are waiting for your connections.
            </p>
          </div>

          <button onClick={openLab} className={`${buttonClass} shrink-0`}>
            <span>{hasBench ? 'Resume Your Bench' : 'Launch Custom Lab'}</span>
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
              <p className="text-[11px] text-slate-400">Low-Voltage Systems & Security Automation Workbench</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-6 text-[11px] text-slate-400">
            <span>Real-time Kirchhoff Engine</span>
            <span>·</span>
            <span>Up to 32 Modular Devices</span>
            <span>·</span>
            <span>Full Multimeter Diagnostics</span>
          </div>
        </div>
      </footer>

      {pendingLaunch && (
        <div className="fixed inset-0 z-[100] grid place-items-center bg-black/75 px-4 backdrop-blur-sm" role="dialog" aria-modal="true" aria-labelledby="lab-warning-title">
          <div className="w-full max-w-md rounded-2xl border border-amber-400/25 bg-[#101722] p-6 shadow-2xl">
            <div className="flex items-center gap-3 text-amber-300">
              <ShieldCheck className="h-6 w-6 shrink-0" />
              <h2 id="lab-warning-title" className="text-lg font-semibold text-white">Before you enter the lab</h2>
            </div>
            <p className="mt-4 text-sm leading-6 text-slate-300">
              This simulator is still in development and can make mistakes. Always verify against the manufacturer&apos;s documentation before wiring real equipment.
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <button type="button" onClick={() => setPendingLaunch(null)} className="h-10 rounded-xl px-4 text-sm font-medium text-slate-300 hover:bg-white/10 hover:text-white">Cancel</button>
              <button type="button" onClick={confirmLaunch} autoFocus className="h-10 rounded-xl bg-amber-400 px-4 text-sm font-semibold text-slate-950 hover:bg-amber-300">I understand — enter lab</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default LabHome;
