import React, { useState, useEffect } from 'react';
import { 
  Zap, 
  Power, 
  RotateCw, 
  Gauge, 
  Activity, 
  CheckCircle2, 
  Layers, 
  Sparkles,
  Info,
  Radio
} from 'lucide-react';
import { soundManager } from '../../audio/soundManager';

interface HotspotInfo {
  id: 'psu' | 'relay' | 'fan' | 'multimeter';
  name: string;
  badge: string;
  description: string;
  specs: string[];
  x: string; // percentage
  y: string; // percentage
}

const HOTSPOTS: HotspotInfo[] = [
  {
    id: 'psu',
    name: '24V DC Industrial Power Supply',
    badge: 'Altronix Regulated Rail',
    description: 'Provides filtered, short-circuit protected 24V DC power to system devices and control relays.',
    specs: ['Input: 24V AC from Step-down Transformer', 'Output: 24V DC @ 3.5A Regulated', 'Built-in auto-reset thermal fuse'],
    x: '24%',
    y: '34%'
  },
  {
    id: 'relay',
    name: 'Ice-Cube DPDT Control Relay',
    badge: 'Dual Form-C Contacts',
    description: 'Electromagnetic isolation relay. Energizing the 24V coil switches two independent dry contact circuits.',
    specs: ['Coil: 24V DC nominal (960Ω)', 'Contacts: 2x Form-C (COM, NO, NC)', '10A / 250VAC contact rating'],
    x: '38%',
    y: '58%'
  },
  {
    id: 'fan',
    name: 'Roland High-Output DC Fan',
    badge: 'Inductive Load',
    description: 'Brushless 24V cooling fan simulating high-amperage motor loads and inductive back-EMF.',
    specs: ['Operating Voltage: 12V - 24V DC', 'Speed: 2,850 RPM continuous', 'Back-EMF suppression diode supported'],
    x: '61%',
    y: '44%'
  },
  {
    id: 'multimeter',
    name: 'Digital True-RMS Multimeter',
    badge: 'Diagnostics',
    description: 'Dual-probe diagnostic meter measuring live circuit potential, continuity, and voltage drops across any two terminals.',
    specs: ['Modes: DC Volts, AC Volts, Continuity, Ohms', 'CAT III 600V safety rated', '0.01V digital resolution'],
    x: '82%',
    y: '42%'
  }
];

export const BenchPreview: React.FC = () => {
  const [isPowered, setIsPowered] = useState(true);
  const [isButtonPressed, setIsButtonPressed] = useState(false);
  const [viewMode, setViewMode] = useState<'studio' | 'schematic'>('studio');
  const [activeHotspot, setActiveHotspot] = useState<HotspotInfo | null>(null);
  const [voltageDisplay, setVoltageDisplay] = useState('24.15');

  // Slight realistic voltage fluctuation when powered
  useEffect(() => {
    if (!isPowered) {
      setVoltageDisplay('00.00');
      return;
    }
    const interval = setInterval(() => {
      const jitter = (Math.random() * 0.04 - 0.02).toFixed(2);
      setVoltageDisplay((24.15 + parseFloat(jitter)).toFixed(2));
    }, 1200);
    return () => clearInterval(interval);
  }, [isPowered]);

  const togglePower = () => {
    soundManager.playClick();
    setIsPowered(prev => !prev);
  };

  const handleButtonToggle = () => {
    soundManager.playClick();
    setIsButtonPressed(prev => !prev);
  };

  const isRelayEnergized = isPowered && (!isButtonPressed); // Normally energized unless button cuts it, or button powers it
  const isFanRunning = isPowered && isRelayEnergized;

  return (
    <div className="relative mx-auto w-full max-w-[720px] select-none" aria-label="Interactive circuit workbench preview">
      {/* Background Ambient Glow */}
      <div className={`absolute -inset-6 rounded-3xl blur-3xl transition-opacity duration-700 pointer-events-none ${
        isPowered ? 'bg-sky-500/20 opacity-100' : 'bg-slate-700/10 opacity-40'
      }`} />

      {/* Main Glassmorphic Workbench Window */}
      <div className="relative overflow-hidden rounded-2xl border border-slate-700/80 bg-[#0a0f18] shadow-[0_30px_100px_-25px_rgba(0,0,0,0.85)] transition-all duration-300 hover:border-slate-600">
        
        {/* Top Header / Status Bar */}
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/[0.08] bg-[#0d1522]/90 px-4 py-3 backdrop-blur-md">
          {/* Left: Circuit Status & Mode */}
          <div className="flex items-center gap-2.5">
            <span className="relative flex h-2.5 w-2.5">
              {isPowered && (
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              )}
              <span className={`relative inline-flex h-2.5 w-2.5 rounded-full transition-colors ${
                isPowered ? 'bg-emerald-400 shadow-[0_0_8px_#34d399]' : 'bg-amber-600'
              }`} />
            </span>
            <span className="text-xs font-semibold tracking-wide text-slate-200">
              {isPowered ? '24V DC BENCH SIMULATION' : 'BENCH DE-ENERGIZED'}
            </span>
            <span className="hidden sm:inline-block rounded border border-white/10 bg-white/[0.05] px-1.5 py-0.5 text-[10px] font-mono text-slate-400">
              {isPowered ? `${voltageDisplay} V` : 'STANDBY'}
            </span>
          </div>

          {/* Right: Studio / Schematic View Tabs & Quick Power Button */}
          <div className="flex items-center gap-2">
            <div className="flex rounded-lg border border-white/10 bg-white/[0.03] p-0.5 text-[11px]">
              <button
                type="button"
                onClick={() => {
                  soundManager.playClick();
                  setViewMode('studio');
                }}
                className={`flex items-center gap-1.5 rounded-md px-2.5 py-1 font-medium transition-all ${
                  viewMode === 'studio'
                    ? 'bg-sky-500 text-slate-950 font-semibold shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
                aria-label="View 3D Studio"
              >
                <Layers size={13} />
                <span>Studio</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  soundManager.playClick();
                  setViewMode('schematic');
                }}
                className={`flex items-center gap-1.5 rounded-md px-2.5 py-1 font-medium transition-all ${
                  viewMode === 'schematic'
                    ? 'bg-sky-500 text-slate-950 font-semibold shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
                aria-label="View Interactive Schematic"
              >
                <Activity size={13} />
                <span>Schematic</span>
              </button>
            </div>

            {/* Quick Toggle Power Switch */}
            <button
              type="button"
              onClick={togglePower}
              className={`flex items-center gap-1.5 rounded-lg border px-3 py-1 text-xs font-semibold transition-all ${
                isPowered
                  ? 'border-emerald-500/50 bg-emerald-500/15 text-emerald-300 hover:bg-emerald-500/25 shadow-[0_0_15px_-3px_rgba(16,185,129,0.3)]'
                  : 'border-slate-700 bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white'
              }`}
              title={isPowered ? 'Click to cut circuit power' : 'Click to turn on 24V power'}
            >
              <Power size={13} className={isPowered ? 'text-emerald-400' : 'text-slate-500'} />
              <span>{isPowered ? 'ON' : 'OFF'}</span>
            </button>
          </div>
        </div>

        {/* Studio View (Photorealistic Workbench with Live Dynamic HUD) */}
        {viewMode === 'studio' && (
          <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-950">
            {/* Photorealistic Render */}
            <img 
              src="/circuit-lab-hero.jpg" 
              alt="Industrial low-voltage electronics workbench with Altronix power supply, DPDT relay, Roland fan and Fluke multimeter" 
              className={`h-full w-full object-cover transition-all duration-700 ${
                isPowered ? 'brightness-105 contrast-[1.03]' : 'brightness-75 contrast-95 saturate-75'
              }`}
            />

            {/* Dark Vignette and PCB Grid Overlay */}
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#0a0f18]/90 via-transparent to-black/30" />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[#0a0f18]/40 via-transparent to-[#0a0f18]/40" />

            {/* Live Electrical Current Wave Overlay (when powered) */}
            {isPowered && (
              <svg className="pointer-events-none absolute inset-0 h-full w-full opacity-60" viewBox="0 0 800 500" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="current-pulse" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#38bdf8" stopOpacity="0" />
                    <stop offset="50%" stopColor="#38bdf8" stopOpacity="0.8" />
                    <stop offset="100%" stopColor="#34d399" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <path 
                  d="M 230,220 C 260,240 280,270 320,280" 
                  fill="none" 
                  stroke="url(#current-pulse)" 
                  strokeWidth="3" 
                  strokeDasharray="8 6" 
                  className="animate-pulse"
                />
                <path 
                  d="M 370,300 C 440,310 470,260 520,240" 
                  fill="none" 
                  stroke="url(#current-pulse)" 
                  strokeWidth="3" 
                  strokeDasharray="8 6" 
                  className="animate-pulse"
                />
              </svg>
            )}

            {/* Interactive Hotspot Markers */}
            {HOTSPOTS.map((hotspot) => {
              const isSelected = activeHotspot?.id === hotspot.id;
              return (
                <button
                  key={hotspot.id}
                  type="button"
                  onClick={() => {
                    soundManager.playClick();
                    setActiveHotspot(isSelected ? null : hotspot);
                  }}
                  style={{ left: hotspot.x, top: hotspot.y }}
                  className="group absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer focus:outline-none"
                  aria-label={`Inspect ${hotspot.name}`}
                >
                  <span className="relative flex h-7 w-7 items-center justify-center">
                    <span className={`absolute inline-flex h-full w-full rounded-full transition-all duration-300 ${
                      isSelected 
                        ? 'bg-sky-400/40 animate-ping' 
                        : isPowered 
                          ? 'bg-sky-400/20 group-hover:scale-125' 
                          : 'bg-slate-500/20'
                    }`} />
                    <span className={`relative flex h-5 w-5 items-center justify-center rounded-full border shadow-lg transition-all duration-200 ${
                      isSelected
                        ? 'border-white bg-sky-400 text-slate-950 scale-110'
                        : isPowered
                          ? 'border-sky-300/80 bg-slate-900/90 text-sky-300 group-hover:border-sky-300 group-hover:bg-sky-400 group-hover:text-slate-950'
                          : 'border-slate-600 bg-slate-900 text-slate-400'
                    }`}>
                      <Info size={11} className="stroke-[2.5]" />
                    </span>
                  </span>

                  {/* Hover tooltip label */}
                  <span className="pointer-events-none absolute left-1/2 top-full mt-1.5 -translate-x-1/2 whitespace-nowrap rounded-md border border-white/10 bg-slate-950/90 px-2 py-0.5 text-[10px] font-semibold text-slate-200 shadow-xl opacity-0 transition-opacity group-hover:opacity-100">
                    {hotspot.name}
                  </span>
                </button>
              );
            })}

            {/* Floating Live Telemetry HUD: Multimeter Digital Readout */}
            <div className="absolute bottom-4 right-4 max-w-[210px] rounded-xl border border-amber-500/30 bg-slate-950/90 p-3 shadow-2xl backdrop-blur-md">
              <div className="flex items-center justify-between text-[10px] text-amber-400/80">
                <span className="flex items-center gap-1 font-mono uppercase tracking-wider font-semibold">
                  <Gauge size={12} className="text-amber-400" /> True-RMS
                </span>
                <span className="font-mono text-[9px] text-slate-400">CAT III 600V</span>
              </div>
              <div className="mt-1 flex items-baseline justify-between">
                <div className="font-mono text-2xl font-bold tracking-tight text-amber-300 drop-shadow-[0_0_10px_rgba(251,191,36,0.35)]">
                  {voltageDisplay}
                </div>
                <span className="font-mono text-xs font-semibold text-amber-400/90">V DC</span>
              </div>
              <div className="mt-1.5 flex items-center justify-between border-t border-white/10 pt-1.5 text-[9px] text-slate-400 font-mono">
                <span>RIPPLE: {isPowered ? '12mV' : '0mV'}</span>
                <span className={isPowered ? 'text-emerald-400 font-semibold' : 'text-slate-500'}>
                  {isPowered ? '● CONTINUITY' : '○ OPEN'}
                </span>
              </div>
            </div>

            {/* Floating Live Telemetry HUD: Load / Fan Activity */}
            <div className="absolute top-4 left-4 rounded-xl border border-white/10 bg-slate-950/85 px-3 py-2 text-xs backdrop-blur-md shadow-xl">
              <div className="flex items-center gap-2">
                <RotateCw 
                  size={14} 
                  className={`transition-colors ${
                    isFanRunning 
                      ? 'animate-spin text-sky-400 duration-500' 
                      : 'text-slate-600'
                  }`} 
                />
                <div>
                  <p className="text-[11px] font-semibold text-white">
                    {isFanRunning ? 'Roland DC Fan: Active' : 'Roland DC Fan: Idle'}
                  </p>
                  <p className="text-[10px] text-slate-400 font-mono">
                    {isFanRunning ? 'Speed: 2,850 RPM · Load: 0.85A' : 'Speed: 0 RPM · Load: 0.00A'}
                  </p>
                </div>
              </div>
            </div>

            {/* Active Hotspot Inspector Card Modal */}
            {activeHotspot && (
              <div className="absolute inset-x-4 bottom-4 z-20 rounded-xl border border-sky-400/30 bg-[#09111e]/95 p-4 shadow-2xl backdrop-blur-xl animate-in fade-in slide-in-from-bottom-2 duration-200">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="rounded bg-sky-500/15 px-2 py-0.5 text-[10px] font-semibold text-sky-300 border border-sky-400/20">
                        {activeHotspot.badge}
                      </span>
                      <h4 className="text-sm font-semibold text-white">{activeHotspot.name}</h4>
                    </div>
                    <p className="mt-1.5 text-xs text-slate-300 leading-relaxed max-w-xl">
                      {activeHotspot.description}
                    </p>
                    <div className="mt-2.5 flex flex-wrap gap-2">
                      {activeHotspot.specs.map((spec, i) => (
                        <span key={i} className="rounded bg-white/[0.05] px-2 py-0.5 text-[10px] text-slate-400 font-mono">
                          {spec}
                        </span>
                      ))}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setActiveHotspot(null)}
                    className="rounded-lg p-1.5 text-slate-400 hover:bg-white/10 hover:text-white"
                  >
                    ✕
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Schematic View (Dynamic Animated Vector Schematic) */}
        {viewMode === 'schematic' && (
          <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#070d17] p-3">
            <svg viewBox="0 0 680 420" className="h-full w-full" role="img" aria-label="Schematic diagram showing 24V supply, control switch, relay, and motor">
              <defs>
                {/* Blueprint grid pattern */}
                <pattern id="schematic-grid" width="24" height="24" patternUnits="userSpaceOnUse">
                  <circle cx="2" cy="2" r="0.75" fill="#334155" opacity="0.5" />
                </pattern>
                {/* Flow glow filter */}
                <filter id="wire-glow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="3" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              <rect width="680" height="420" fill="url(#schematic-grid)" />

              {/* Wiring paths with dynamic electric current dash animation */}
              <g fill="none" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                {/* Positive Rail: 24V PSU (+) -> Switch */}
                <path 
                  d="M 170 160 L 250 160" 
                  stroke={isPowered ? '#38bdf8' : '#475569'} 
                  strokeDasharray={isPowered ? '6 4' : 'none'}
                  className={isPowered ? 'animate-pulse' : ''}
                />

                {/* Switch -> Relay Coil (+) */}
                <path 
                  d="M 330 160 L 390 160" 
                  stroke={isRelayEnergized ? '#38bdf8' : '#475569'} 
                  strokeDasharray={isRelayEnergized ? '6 4' : 'none'}
                />

                {/* Positive Rail Branch to Relay Common (COM) */}
                <path 
                  d="M 210 160 L 210 270 L 390 270" 
                  stroke={isPowered ? '#38bdf8' : '#475569'} 
                />

                {/* Relay NO Contact -> Roland Fan Motor */}
                <path 
                  d="M 470 270 L 540 270 L 540 215" 
                  stroke={isFanRunning ? '#34d399' : '#475569'} 
                  strokeDasharray={isFanRunning ? '6 4' : 'none'}
                />

                {/* Common Negative Ground Return: Fan (-) & Relay Coil (-) -> PSU (-) */}
                <path 
                  d="M 540 145 L 540 90 L 170 90" 
                  stroke={isPowered ? '#64748b' : '#334155'} 
                  strokeDasharray={isPowered ? '4 4' : 'none'}
                />
                <path 
                  d="M 430 140 L 430 90" 
                  stroke={isPowered ? '#64748b' : '#334155'} 
                />

                {/* Multimeter Probe Leads (measuring across fan terminals) */}
                <path d="M 560 170 C 600 170, 610 320, 590 340" stroke="#f87171" strokeWidth="2" strokeDasharray="3 3" />
                <path d="M 520 170 C 490 170, 480 320, 530 350" stroke="#94a3b8" strokeWidth="2" strokeDasharray="3 3" />
              </g>

              {/* Component: 24V DC Power Supply Box */}
              <g transform="translate(60, 70)">
                <rect width="110" height="130" rx="10" fill="#0f172a" stroke="#38bdf8" strokeWidth="1.5" />
                <rect x="10" y="12" width="90" height="26" rx="4" fill="#1e293b" />
                <text x="55" y="29" fill="#38bdf8" fontSize="11" fontWeight="bold" textAnchor="middle">24V DC PSU</text>
                <circle cx="25" cy="55" r="4" fill={isPowered ? '#34d399' : '#475569'} />
                <text x="35" y="58" fill="#cbd5e1" fontSize="9">DC OK</text>
                {/* Terminals */}
                <circle cx="110" cy="20" r="5" fill="#0f172a" stroke="#64748b" strokeWidth="2" />
                <text x="96" y="24" fill="#94a3b8" fontSize="10" fontWeight="bold">- (GND)</text>
                <circle cx="110" cy="90" r="5" fill="#0f172a" stroke="#38bdf8" strokeWidth="2" />
                <text x="94" y="94" fill="#38bdf8" fontSize="10" fontWeight="bold">+24V</text>
              </g>

              {/* Component: Momentary Push Switch (Interactive) */}
              <g 
                transform="translate(250, 125)" 
                className="cursor-pointer"
                onClick={handleButtonToggle}
              >
                <rect width="80" height="70" rx="8" fill="#111c2d" stroke="#475569" strokeWidth="1.5" />
                <text x="40" y="20" fill="#94a3b8" fontSize="9" fontWeight="bold" textAnchor="middle">CONTROL SW</text>
                {/* Switch Contacts */}
                <circle cx="10" cy="35" r="4" fill="#38bdf8" />
                <circle cx="70" cy="35" r="4" fill={isRelayEnergized ? '#38bdf8' : '#64748b'} />
                {/* Switch Armature Line */}
                <line 
                  x1="10" 
                  y1="35" 
                  x2="68" 
                  y2={isRelayEnergized ? 35 : 18} 
                  stroke={isRelayEnergized ? '#34d399' : '#f59e0b'} 
                  strokeWidth="3" 
                  strokeLinecap="round" 
                />
                <rect x="25" y="46" width="30" height="15" rx="3" fill="#1e293b" />
                <text x="40" y="57" fill="#38bdf8" fontSize="8" textAnchor="middle">CLICK</text>
              </g>

              {/* Component: Industrial Relay (Coil & Contacts) */}
              <g transform="translate(390, 110)">
                <rect width="80" height="190" rx="8" fill="#101927" stroke="#38bdf8" strokeWidth="1.5" />
                <text x="40" y="20" fill="#38bdf8" fontSize="9" fontWeight="bold" textAnchor="middle">DPDT RELAY</text>
                
                {/* Coil Section */}
                <rect x="15" y="30" width="50" height="35" rx="4" fill="#1e293b" stroke={isRelayEnergized ? '#34d399' : '#334155'} />
                <path d="M 22 47 Q 27 38 32 47 Q 37 38 42 47 Q 47 38 52 47 Q 57 38 62 47" fill="none" stroke="#f59e0b" strokeWidth="2" />
                <text x="40" y="60" fill="#94a3b8" fontSize="7" textAnchor="middle">COIL (24V)</text>

                {/* Contact Section */}
                <text x="15" y="105" fill="#cbd5e1" fontSize="8">COM</text>
                <circle cx="0" cy="160" r="4" fill="#38bdf8" />
                <text x="65" y="105" fill={isFanRunning ? '#34d399' : '#64748b'} fontSize="8" textAnchor="end">NO</text>
                <circle cx="80" cy="160" r="4" fill={isFanRunning ? '#34d399' : '#64748b'} />
                
                {/* Armature contact switch */}
                <line 
                  x1="10" 
                  y1="160" 
                  x2="72" 
                  y2={isRelayEnergized ? 160 : 135} 
                  stroke={isFanRunning ? '#34d399' : '#64748b'} 
                  strokeWidth="3" 
                  strokeLinecap="round" 
                />
              </g>

              {/* Component: Roland DC Motor / Fan */}
              <g transform="translate(540, 180)">
                <circle r="42" fill="#0f172a" stroke={isFanRunning ? '#38bdf8' : '#475569'} strokeWidth="2" />
                <circle r="14" fill="#1e293b" stroke="#38bdf8" strokeWidth="1.5" />
                <text y="4" fill="#e2e8f0" fontSize="9" fontWeight="bold" textAnchor="middle">FAN</text>
                {/* Spinning blades animation */}
                <g className={isFanRunning ? 'animate-spin origin-center' : ''} style={{ transformOrigin: '0px 0px' }}>
                  <path d="M 0 -14 C 12 -28 20 -28 14 -38 C 4 -32 -6 -24 0 -14" fill="#38bdf8" opacity="0.8" />
                  <path d="M 0 14 C -12 28 -20 28 -14 38 C -4 32 6 24 0 14" fill="#38bdf8" opacity="0.8" />
                  <path d="M -14 0 C -28 -12 -28 -20 -38 -14 C -32 -4 -24 6 -14 0" fill="#38bdf8" opacity="0.8" />
                  <path d="M 14 0 C 28 12 28 20 38 14 C 32 4 24 -6 14 0" fill="#38bdf8" opacity="0.8" />
                </g>
                <text y="60" fill={isFanRunning ? '#34d399' : '#64748b'} fontSize="10" fontWeight="bold" textAnchor="middle">
                  {isFanRunning ? '● RUNNING' : '○ IDLE'}
                </text>
              </g>

              {/* Component: Digital Multimeter */}
              <g transform="translate(540, 330)">
                <rect width="100" height="60" rx="8" fill="#172554" stroke="#f59e0b" strokeWidth="2" />
                <rect x="8" y="10" width="84" height="24" rx="3" fill="#020617" />
                <text x="50" y="27" fill="#fbbf24" fontSize="13" fontFamily="monospace" fontWeight="bold" textAnchor="middle">
                  {isFanRunning ? voltageDisplay : '00.00'} V
                </text>
                <text x="50" y="48" fill="#cbd5e1" fontSize="8" textAnchor="middle">DMM: ACROSS LOAD</text>
              </g>
            </svg>
          </div>
        )}

        {/* Bottom Interactive Control & Telemetry Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-white/[0.08] bg-[#0c1420] px-4 py-3 text-xs">
          {/* Interactive controls */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleButtonToggle}
              className={`flex items-center gap-2 rounded-lg border px-3 py-1.5 font-medium transition-all ${
                isButtonPressed
                  ? 'border-amber-400/50 bg-amber-400/20 text-amber-200'
                  : 'border-white/15 bg-white/[0.04] text-slate-200 hover:bg-white/10'
              }`}
            >
              <Radio size={13} className={isButtonPressed ? 'text-amber-400 animate-pulse' : 'text-slate-400'} />
              <span>{isButtonPressed ? 'Contact: OPEN (Held)' : 'Contact: CLOSED'}</span>
            </button>

            <span className="hidden sm:inline-block text-[11px] text-slate-400">
              {isFanRunning 
                ? 'Circuit energized · Current flowing freely' 
                : 'Circuit de-energized · Contacts open'}
            </span>
          </div>

          {/* Quick Stats */}
          <div className="flex items-center gap-4 text-[11px] font-mono text-slate-400">
            <span className="flex items-center gap-1.5">
              <Activity size={12} className="text-sky-400" />
              <span>{isFanRunning ? '0.85 A' : '0.00 A'}</span>
            </span>
            <span className="flex items-center gap-1.5">
              <Zap size={12} className="text-amber-400" />
              <span>{isFanRunning ? '20.4 W' : '0.0 W'}</span>
            </span>
            <span className="flex items-center gap-1 text-emerald-400">
              <CheckCircle2 size={12} />
              <span>{isPowered ? 'Solver OK' : 'Standby'}</span>
            </span>
          </div>
        </div>
      </div>

      {/* Floating Info Pill under the card */}
      <div className="mt-3 flex flex-wrap items-center justify-between gap-2 px-2 text-xs text-slate-400">
        <span className="flex items-center gap-1.5">
          <Sparkles size={13} className="text-sky-400" />
          <span>Interactive simulator: click <strong>Studio / Schematic</strong>, <strong>Power</strong>, or probe hotspots.</span>
        </span>
        <span className="text-slate-500 font-mono text-[11px]">Kirchhoff v2.4</span>
      </div>
    </div>
  );
};
export default BenchPreview;
