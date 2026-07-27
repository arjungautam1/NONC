import React from 'react';
import { useGameStore } from '../../store/useGameStore';
import { levels } from '../../levels/levelData';
import { 
  RotateCcw, 
  ChevronLeft, 
  ChevronRight, 
  ChevronDown,
  CheckCircle2,
  Clock,
  BookOpen,
  Compass,
  Eye,
  EyeOff,
  Rocket,
  ShieldAlert,
  CircleDot
} from 'lucide-react';

const RocketMissionPanel: React.FC = () => {
  const { components, simulation, isRunning } = useGameStore();
  const relay = components.find(component => component.id === 'rocket_relay');
  const eStop = components.find(component => component.id === 'rocket_estop');
  const launch = components.find(component => component.id === 'rocket_launch');

  const standbyVerified = Boolean(relay?.state.standbyVerified);
  const launchVerified = Boolean(relay?.state.launchVerified);
  const emergencyVerified = Boolean(relay?.state.emergencyVerified);
  const relayLive = simulation.energizedComponents.has('rocket_relay');
  const eStopPressed = Boolean(eStop?.state.pressed);
  const launchPressed = Boolean(launch?.state.pressed);
  const missionComplete = standbyVerified && launchVerified && emergencyVerified;

  const status = missionComplete
    ? 'Mission complete'
    : !isRunning
      ? 'Awaiting system power'
      : eStopPressed
        ? 'E-STOP active'
        : relayLive && launchPressed
          ? 'Launch sequence live'
          : standbyVerified
            ? 'Launch is armed'
            : 'Build the circuit';

  const steps = [
    { label: 'STANDBY', detail: 'Red lamp only', done: standbyVerified },
    { label: 'LAUNCH', detail: 'Relay transfers', done: launchVerified },
    { label: 'E-STOP', detail: 'Launch loads drop', done: emergencyVerified }
  ];

  return (
    <section className="shrink-0 border-b border-violet-400/20 bg-[radial-gradient(circle_at_85%_0%,rgba(168,85,247,0.16),transparent_42%),linear-gradient(135deg,rgba(30,27,75,0.48),rgba(8,12,23,0.62))] p-3">
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-2">
          <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border ${missionComplete ? 'border-emerald-400/35 bg-emerald-400/10 text-emerald-300' : 'border-violet-400/30 bg-violet-400/10 text-violet-300'}`}>
            <Rocket className={`h-4 w-4 ${relayLive ? 'animate-bounce' : ''}`} />
          </span>
          <div className="min-w-0">
            <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-violet-300">Arcade mission</p>
            <h3 className="truncate text-[12px] font-semibold text-white">Rocket Relay</h3>
          </div>
        </div>
        <span className={`inline-flex shrink-0 items-center gap-1 rounded-full border px-2 py-1 text-[8px] font-bold uppercase tracking-wide ${
          missionComplete
            ? 'border-emerald-400/25 bg-emerald-400/10 text-emerald-300'
            : eStopPressed
              ? 'border-rose-400/25 bg-rose-400/10 text-rose-300'
              : 'border-white/10 bg-black/20 text-slate-400'
        }`}>
          {eStopPressed && !missionComplete ? <ShieldAlert className="h-3 w-3" /> : <CircleDot className="h-3 w-3" />}
          {status}
        </span>
      </div>

      <div className="mt-3 grid grid-cols-3 gap-1.5">
        {steps.map((step, index) => (
          <div key={step.label} className={`rounded-lg border p-2 transition ${step.done ? 'border-emerald-400/20 bg-emerald-400/[0.07]' : 'border-white/[0.07] bg-black/15'}`}>
            <div className="flex items-center justify-between gap-1">
              <span className={`text-[9px] font-bold ${step.done ? 'text-emerald-300' : 'text-slate-400'}`}>{String(index + 1).padStart(2, '0')}</span>
              <span className={`h-1.5 w-1.5 rounded-full ${step.done ? 'bg-emerald-400 shadow-[0_0_7px_rgba(52,211,153,0.9)]' : 'bg-slate-700'}`} />
            </div>
            <p className="mt-1 text-[9px] font-bold text-slate-200">{step.label}</p>
            <p className="mt-0.5 text-[8px] leading-tight text-slate-500">{step.detail}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export const Sidebar: React.FC = () => {
  const {
    currentLevelIndex,
    initLevel,
    levelCompleted,
    timeElapsed,
    isRunning,
    toggleSimulation,
    resetLevel,
    simulation,
    sidebarOpen,
    toggleSidebar,
    score,
    useHint
  } = useGameStore();

  const level = levels[currentLevelIndex];
  const [guideHidden, setGuideHidden] = React.useState(false);
  const [hintsHidden, setHintsHidden] = React.useState(false);

  // Helper to format timer
  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remaining = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${remaining.toString().padStart(2, '0')}`;
  };

  const splitInstruction = (instruction: string) => {
    const match = instruction.match(/^([^:]{2,28}):\s+(.+)$/);
    const content = match?.[2] ?? '';
    return match
      ? { label: match[1], content: `${content.charAt(0).toUpperCase()}${content.slice(1)}` }
      : { label: null, content: instruction };
  };

  const handlePrevLevel = () => {
    if (currentLevelIndex > 0) initLevel(currentLevelIndex - 1);
  };

  const handleNextLevel = () => {
    if (currentLevelIndex < levels.length - 1) initLevel(currentLevelIndex + 1);
  };

  const checkGoalReached = (goalIndex: number) => {
    if (levelCompleted) return true;
    
    // Check individual goal requirements
    if (currentLevelIndex === 0) { // Level 1
      if (goalIndex === 0) return simulation.nodeVoltages['bulb1:in'] > 0;
      if (goalIndex === 1) return simulation.nodeVoltages['bulb1:out'] === 0 && simulation.energizedComponents.has('bulb1');
      if (goalIndex === 2) return simulation.energizedComponents.has('bulb1');
    }
    if (currentLevelIndex === 1) { // Level 2
      if (goalIndex === 0) return simulation.nodeVoltages['bulb1:in'] > 0;
      if (goalIndex === 1) return simulation.nodeVoltages['bulb1:out'] === 0 && simulation.energizedComponents.has('bulb1');
      if (goalIndex === 2) return simulation.energizedComponents.has('bulb1');
    }
    if (currentLevelIndex === 2) { // Level 3
      const btn = useGameStore.getState().components.find(c => c.id === 'btn1');
      if (goalIndex === 0) return simulation.nodeVoltages['btn1:in'] > 0;
      if (goalIndex === 1) return btn?.state.pressed;
      if (goalIndex === 2) return simulation.energizedComponents.has('bulb1');
    }
    if (currentLevelIndex === 3) { // Level 4
      const btn = useGameStore.getState().components.find(c => c.id === 'btn1');
      if (goalIndex === 0) return simulation.nodeVoltages['btn1:in'] > 0;
      if (goalIndex === 1) return simulation.energizedComponents.has('bulb1') && !btn?.state.pressed;
      if (goalIndex === 2) return btn?.state.pressed && !simulation.energizedComponents.has('bulb1');
    }
    if (currentLevelIndex === 4) { // Level 5
      const btn = useGameStore.getState().components.find(c => c.id === 'btn1');
      if (goalIndex === 0) return simulation.nodeVoltages['relay1:coil_a'] > 0 || btn?.state.pressed;
      if (goalIndex === 1) return simulation.energizedComponents.has('relay1');
      if (goalIndex === 2) return simulation.energizedComponents.has('relay1');
    }
    if (currentLevelIndex === 5) { // Level 6
      if (goalIndex === 0) return simulation.energizedComponents.has('relay1');
      if (goalIndex === 1) return simulation.nodeVoltages['relay1:com'] > 0 && simulation.nodeVoltages['bulb1:in'] > 0;
      if (goalIndex === 2) return simulation.energizedComponents.has('bulb1');
    }
    if (currentLevelIndex === 16) { // Level 17
      const btn = useGameStore.getState().components.find(c => c.id === 'btn1');
      if (goalIndex === 0) return simulation.nodeVoltages['relay1:coil_a'] > 0 || btn?.state.pressed;
      if (goalIndex === 1) return simulation.nodeVoltages['roland1:in'] > 0;
      if (goalIndex === 2) return btn?.state.pressed && simulation.energizedComponents.has('roland1');
    }
    if (currentLevelIndex === 17 || currentLevelIndex === 18) { // Level 18 & 19
      const btn = useGameStore.getState().components.find(c => c.id === 'btn2');
      if (goalIndex === 0) return simulation.nodeVoltages['relay_open:coil_a'] > 0 || simulation.nodeVoltages['timer_open:coil_a'] > 0;
      if (goalIndex === 1) return simulation.nodeVoltages['timer_open:com'] > 0 && simulation.nodeVoltages['relay_open:com'] > 0;
      if (goalIndex === 2) return btn?.state.pressed || simulation.nodeVoltages['relay_close:coil_a'] > 0 || simulation.nodeVoltages['timer_close:coil_a'] > 0;
      if (goalIndex === 3) return simulation.nodeVoltages['timer_close:com'] > 0 && simulation.nodeVoltages['relay_close:com'] > 0;
    }
    if (currentLevelIndex === 19) { // Level 20
      if (goalIndex === 0) return simulation.nodeVoltages['relay1:coil_a'] > 0 || simulation.energizedComponents.has('relay1');
      if (goalIndex === 1) return simulation.energizedComponents.has('led_red') || simulation.energizedComponents.has('led_green');
      if (goalIndex === 2) return simulation.energizedComponents.has('lock1');
      if (goalIndex === 3) return simulation.energizedComponents.has('siren1');
    }
    if (currentLevelIndex === 20) { // Level 21
      const components = useGameStore.getState().components;
      const powerSupply = components.find(c => c.id === 'lab21_psu');
      const service = components.find(c => c.id === 'lab21_service');
      if (goalIndex === 0) return Boolean(powerSupply?.state.active);
      if (goalIndex === 1) return Boolean(service?.state.idleVerified);
      if (goalIndex === 2) return Boolean(service?.state.momentaryVerified);
      if (goalIndex === 3) return Boolean(service?.state.returnVerified);
      if (goalIndex === 4) return Boolean(service?.state.maintainedVerified);
    }
    if (level.id === 26) {
      const components = useGameStore.getState().components;
      const relay = components.find(component => component.id === 'rocket_relay');
      if (goalIndex === 0) return simulation.nodeVoltages['rocket_launch:in'] > 0;
      if (goalIndex === 1) return Boolean(relay?.state.standbyVerified);
      if (goalIndex === 2) return Boolean(relay?.state.launchVerified);
      if (goalIndex === 3) return Boolean(relay?.state.emergencyVerified);
    }
    
    return false;
  };

  return (
    <div className={`relative transition-all duration-300 ease-in-out shrink-0 flex ${
      sidebarOpen ? 'w-full md:w-[320px] h-[255px] md:h-full' : 'w-full md:w-[48px] h-12 md:h-full'
    } overflow-hidden`}>

      {/* ── Edge tab (visible when the guide is closed) ── */}
      <button
        onClick={toggleSidebar}
        title="Show guide"
        aria-label="Show guide"
        className={`w-full md:w-[48px] h-12 md:h-full bg-[#080d19] border-b md:border-b-0 md:border-r border-white/10 flex md:flex-col items-center justify-center gap-2.5 cursor-pointer hover:bg-blue-400/[0.07] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-300 transition-all duration-300 group shrink-0 ${
          sidebarOpen ? 'pointer-events-none opacity-0 w-0 md:w-0 md:h-0 overflow-hidden border-none p-0 m-0' : 'opacity-100'
        }`}
        style={{ pointerEvents: sidebarOpen ? 'none' : 'auto' }}
      >
        <span className="h-1 w-10 rounded-full bg-blue-500/50 shadow-[0_0_8px_rgba(59,130,246,0.45)] transition group-hover:bg-blue-300 md:h-12 md:w-1" />
        <ChevronRight className="h-4 w-4 text-blue-300 transition-transform group-hover:translate-x-0.5 group-hover:text-white" />
        <span className="text-[9px] font-black uppercase tracking-[0.16em] text-slate-400 transition group-hover:text-white md:[writing-mode:vertical-rl] md:rotate-180">Show guide</span>
      </button>

      {/* Main Sidebar Panel */}
      <div
        className={`w-full md:w-[320px] bg-[#070b13] border-b md:border-b-0 md:border-r border-white/10 flex flex-col h-full overflow-hidden shrink-0 transition-all duration-300 ${sidebarOpen ? '' : 'hidden'}`}
        aria-hidden={!sidebarOpen}
        style={{
          opacity: sidebarOpen ? 1 : 0,
          transform: sidebarOpen ? 'translateX(0)' : 'translateX(-20px)',
          pointerEvents: sidebarOpen ? 'auto' : 'none'
        }}
      >
        
        {/* 1. Level Selector Header */}
        <div className="p-3 border-b border-white/10 bg-white/[0.015] flex flex-col gap-2 shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <Compass className="w-3.5 h-3.5 text-indigo-400" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Training Module</span>
            </div>
            
            <div className="flex items-center gap-2">
              {/* Digital Timer */}
              <div className="bg-slate-900/60 border border-white/5 rounded-full px-2.5 py-0.5 flex items-center gap-1.5 text-[10px] font-mono font-semibold text-slate-400">
                <Clock className="w-3 h-3 text-slate-500" />
                <span className="tabular-nums">{formatTime(timeElapsed)}</span>
              </div>

              {/* Collapse sidebar button */}
              <button
                onClick={toggleSidebar}
                title="Hide guide"
                aria-label="Hide guide"
                className="flex h-7 items-center gap-1 rounded-md border border-white/[0.07] bg-white/[0.025] px-1.5 text-slate-400 hover:bg-white/[0.08] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-300 transition-all"
              >
                <ChevronLeft className="w-4 h-4" />
                <span className="hidden text-[9px] font-bold uppercase tracking-wide lg:inline">Hide</span>
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between mt-1.5 gap-1.5">
            <button 
              onClick={handlePrevLevel} 
              disabled={currentLevelIndex === 0}
              className="p-1.5 rounded-lg border border-white/5 bg-white/[0.02] hover:bg-white/[0.06] disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-colors"
              title="Previous Module"
            >
              <ChevronLeft className="w-4 h-4 text-white" />
            </button>
            
            {/* Modern Level Jump Dropdown Selector */}
            <div className="flex-1 relative group">
              <select
                value={currentLevelIndex}
                onChange={(e) => initLevel(parseInt(e.target.value))}
                title={level.title}
                className="w-full bg-white/[0.02] hover:bg-white/[0.05] text-slate-200 text-[11px] font-semibold pl-3 pr-8 py-2 rounded-lg border border-white/10 cursor-pointer hover:border-white/20 focus:outline-none focus:ring-1 focus:ring-indigo-500/50 appearance-none transition-all text-center"
                style={{ textAlignLast: 'center' }}
              >
                {levels.map((lvl, index) => (
                  <option key={lvl.id} value={index} className="bg-[#070b13] text-slate-200 font-sans font-semibold text-[11px] py-2 text-left">
                    LVL {lvl.id}: {lvl.title}
                  </option>
                ))}
              </select>
              <div className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 group-hover:text-white transition-colors">
                <ChevronDown className="w-3.5 h-3.5" />
              </div>
            </div>

            <button 
              onClick={handleNextLevel} 
              disabled={currentLevelIndex === levels.length - 1}
              className="p-1.5 rounded-lg border border-white/5 bg-white/[0.02] hover:bg-white/[0.06] disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-colors"
              title="Next Module"
            >
              <ChevronRight className="w-4 h-4 text-white" />
            </button>
          </div>

          <div className="text-[11px] text-slate-400 font-semibold mt-1 truncate w-full text-center px-1">
            {level.title}
          </div>
        </div>

        {/* 2. Simulator Power Controls */}
        <div className="p-3 border-b border-white/10 flex items-center justify-between gap-2.5 shrink-0 bg-white/[0.005]">
          <button
            onClick={toggleSimulation}
            className={`flex-grow py-2 px-4 rounded-lg font-bold text-xs tracking-wide flex items-center justify-center gap-2 cursor-pointer transition-all duration-300 border uppercase ${
              isRunning 
                ? 'bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border-emerald-500/30 shadow-[0_0_12px_rgba(16,185,129,0.12)]' 
                : 'bg-white/[0.02] hover:bg-white/[0.06] text-slate-400 hover:text-white border-white/10'
            }`}
          >
            <div className="relative flex items-center justify-center">
              <span className={`w-2 h-2 rounded-full absolute ${isRunning ? 'bg-emerald-400 animate-ping' : 'bg-slate-600'}`} />
              <span className={`w-2 h-2 rounded-full relative ${isRunning ? 'bg-emerald-400' : 'bg-slate-600'}`} />
            </div>
            <span>Power: {isRunning ? 'ON' : 'OFF'}</span>
          </button>

          <button
            onClick={resetLevel}
            className="p-2 bg-white/[0.02] hover:bg-white/[0.08] hover:text-red-400 border border-white/10 rounded-lg text-slate-400 cursor-pointer transition-all group"
            title="Reset Circuit Layout"
          >
            <RotateCcw className="w-4 h-4 group-hover:rotate-180 transition-transform duration-300" />
          </button>
        </div>

        {level.id === 26 && <RocketMissionPanel />}

        {/* 3. Objectives / Goals */}
        <div className="p-3 border-b border-white/10 bg-white/[0.01] shrink-0">
          <h3 className="text-[9px] font-bold tracking-widest text-slate-500 mb-2.5 uppercase">
            Module Objectives
          </h3>
          <div className="bg-[#0d1220]/60 rounded-xl p-2.5 border border-white/[0.04] flex flex-col gap-2">
            {level.goals.map((goal, idx) => {
              const isMet = checkGoalReached(idx);
              return (
                <div 
                  key={idx}
                  className={`flex items-start gap-2 text-[11px] font-medium leading-relaxed ${
                    isMet ? 'text-emerald-400/90' : 'text-slate-300'
                  }`}
                >
                  <CheckCircle2 className={`w-3.5 h-3.5 mt-0.5 shrink-0 transition-all ${
                    isMet 
                      ? 'text-emerald-400 fill-emerald-500/10' 
                      : 'text-slate-600'
                  }`} />
                  <span className={isMet ? 'line-through opacity-60 text-emerald-500' : ''}>{goal}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* 4. Instructions list (Independent scrollable area) */}
        {!guideHidden ? (
        <div className="p-3 flex-1 flex flex-col min-h-0">
          <div className="flex items-center justify-between gap-2 mb-2.5 shrink-0">
            <div className="flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-indigo-400" />
              <h3 className="text-[9px] font-bold tracking-widest text-slate-500 uppercase">
                Step-by-Step Guide
              </h3>
            </div>
            <button
              onClick={() => setGuideHidden(true)}
              className="h-6 px-2 rounded border border-white/10 bg-white/[0.02] hover:bg-white/[0.07] text-[9px] font-bold uppercase text-slate-400 hover:text-white cursor-pointer transition-all flex items-center gap-1"
              title="Hide guide"
            >
              <EyeOff className="w-3 h-3" />
              Hide
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto pr-1 flex flex-col gap-2 min-h-0 custom-scrollbar">
            {level.instructions.map((inst, index) => {
              const { label, content } = splitInstruction(inst);
              const containsWiringPath = content.includes('→');

              return (
                <div
                  key={index}
                  className="flex items-start gap-2.5 rounded-lg border border-white/[0.04] bg-white/[0.015] p-2.5 text-[11px] font-medium leading-relaxed text-slate-300 transition-all duration-200 hover:border-white/[0.08] hover:bg-white/[0.035]"
                >
                  <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded border border-indigo-500/20 bg-indigo-500/15 font-mono text-[9px] font-bold text-indigo-300">
                    {(index + 1).toString().padStart(2, '0')}
                  </span>
                  <div className="min-w-0 flex-1">
                    {label && (
                      <span className="mb-1 inline-flex rounded border border-blue-400/15 bg-blue-400/[0.07] px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-[0.12em] text-blue-300">
                        {label}
                      </span>
                    )}
                    <p className={`break-words ${
                      containsWiringPath
                        ? 'font-mono text-[9.5px] leading-[1.55] text-slate-200'
                        : 'text-[10.5px] leading-[1.55] text-slate-300'
                    }`}>
                      {content}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        ) : (
          <div className="p-3 flex-1 flex items-center justify-center min-h-0">
            <button
              onClick={() => setGuideHidden(false)}
              className="w-full py-2 rounded-lg border border-indigo-500/20 bg-indigo-500/10 hover:bg-indigo-500/15 text-indigo-300 text-[10px] font-bold uppercase cursor-pointer transition-all flex items-center justify-center gap-1.5"
            >
              <Eye className="w-3.5 h-3.5" />
              Show Guide
            </button>
          </div>
        )}

        {/* 4.5. Level Hints Section */}
        {level.hints && level.hints.length > 0 && !hintsHidden && (
          <div className="p-3 border-t border-white/10 bg-slate-950/20 flex flex-col gap-2 shrink-0 select-none">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span className="text-[9px] font-bold uppercase tracking-widest text-amber-400 font-mono">💡 Level Hints</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[9px] font-mono text-slate-500 font-bold">
                  {Math.min(score.hintsUsed, level.hints.length)} / {level.hints.length}
                </span>
                <button
                  onClick={() => setHintsHidden(true)}
                  className="p-1 rounded hover:bg-white/10 text-slate-500 hover:text-white cursor-pointer transition-all"
                  title="Hide hints"
                >
                  <EyeOff className="w-3 h-3" />
                </button>
              </div>
            </div>

            {/* Revealed Active Hint */}
            {score.hintsUsed > 0 && (() => {
              const activeHintIdx = (score.hintsUsed - 1) % level.hints.length;
              const hintText = level.hints[activeHintIdx];
              return (
                <div className="p-2 rounded bg-amber-500/5 border border-amber-500/10 text-[10px] text-amber-200/90 leading-relaxed font-medium">
                  <span className="font-bold text-amber-400 mr-1">Hint {activeHintIdx + 1}:</span>
                  {hintText}
                </div>
              );
            })()}

            {/* Reveal/Cycle Button */}
            <button
              onClick={useHint}
              className="w-full py-1.5 rounded bg-amber-500/10 hover:bg-amber-500/15 border border-amber-500/20 hover:border-amber-500/35 text-amber-400 text-[9px] font-bold uppercase cursor-pointer transition-all flex items-center justify-center gap-1.5"
            >
              <span>{score.hintsUsed < level.hints.length ? 'Reveal Next Hint' : 'Next Hint (Cycle)'}</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {level.hints && level.hints.length > 0 && hintsHidden && (
          <div className="p-2.5 border-t border-white/10 bg-slate-950/20 shrink-0">
            <button
              onClick={() => setHintsHidden(false)}
              className="w-full py-1.5 rounded bg-amber-500/10 hover:bg-amber-500/15 border border-amber-500/20 text-amber-400 text-[9px] font-bold uppercase cursor-pointer transition-all flex items-center justify-center gap-1.5"
            >
              <Eye className="w-3.5 h-3.5" />
              Show Hints
            </button>
          </div>
        )}

        {/* 5. Attribution Footer */}
        <div className="p-2.5 bg-black/10 border-t border-white/5 text-center select-none shrink-0 mt-auto">
          <span className="text-[9px] tracking-wider text-slate-600 uppercase font-bold font-mono">
            Delmi Electronics Lab
          </span>
        </div>
      </div>
    </div>
  );
};
export default Sidebar;
