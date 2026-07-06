import React from 'react';
import { useGameStore } from '../../store/useGameStore';
import { levels } from '../../levels/levelData';
import { 
  Play, 
  RotateCcw, 
  ChevronLeft, 
  ChevronRight, 
  ChevronDown,
  CheckCircle2,
  HelpCircle
} from 'lucide-react';
import { soundManager } from '../../audio/soundManager';

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

  // Helper to format timer
  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remaining = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${remaining.toString().padStart(2, '0')}`;
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
      if (goalIndex === 0) return simulation.nodeVoltages['relay_open:coil_a'] > 0;
      if (goalIndex === 1) return simulation.nodeVoltages['limit_top:in'] > 0 && simulation.nodeVoltages['limit_bottom:in'] > 0;
      if (goalIndex === 2) return btn?.state.pressed || simulation.nodeVoltages['relay_close:coil_a'] > 0;
    }
    
    return false;
  };

  // Determine which hints to show (at least the first hint is always visible, and others unlock with hintsUsed)
  const maxHintIndex = Math.min(score.hintsUsed, level.hints.length - 1);
  const unlockedHints = level.hints.slice(0, maxHintIndex + 1);

  return (
    <div className={`relative h-full transition-all duration-300 ease-in-out shrink-0 flex`}
      style={{ width: sidebarOpen ? 380 : 28 }}>

      {/* ── Slim Edge Tab (visible when closed) ── */}
      {!sidebarOpen && (
        <button
          onClick={toggleSidebar}
          title="Open Sidebar"
          className="w-[28px] h-full bg-[#0d1424] border-r border-[#1e3a5f] flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-[#1a2a45] transition-all group shrink-0"
          style={{ pointerEvents: 'auto' }}
        >
          {/* Glow pill indicator */}
          <span className="w-1 h-10 rounded-full bg-[#1a4a8a] group-hover:bg-[#2563eb] transition-colors shadow-[0_0_8px_rgba(37,99,235,0.5)]" />
          <ChevronRight className="w-3.5 h-3.5 text-[#2563eb] group-hover:text-white transition-colors" />
          <span
            className="text-[9px] font-extrabold text-[#2563eb] group-hover:text-white tracking-widest uppercase font-mono"
            style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}
          >
            GUIDE
          </span>
        </button>
      )}

      {/* Main Sidebar Panel */}
      {sidebarOpen && (
      <div className="w-[380px] bg-industrial-gray-900 border-r border-[#2a2e39] flex flex-col h-full overflow-hidden shrink-0">
        
        {/* 1. Level Selector Header (shrink-0) */}
        <div className="p-4 border-b border-[#2a2e39] bg-industrial-gray-800/50 flex flex-col gap-2 shrink-0">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-extrabold tracking-widest text-yellow-500">TRAINING MODULE</span>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-industrial-gray-400 font-mono">{formatTime(timeElapsed)}</span>
              {/* Collapse sidebar button */}
              <button
                onClick={toggleSidebar}
                title="Collapse Sidebar"
                className="p-1 rounded hover:bg-industrial-gray-700 cursor-pointer text-slate-500 hover:text-white transition-all"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
            </div>
          </div>
          <div className="flex items-center justify-between mt-1">
            <button 
              onClick={handlePrevLevel} 
              disabled={currentLevelIndex === 0}
              className="p-1.5 rounded hover:bg-industrial-gray-700 disabled:opacity-40 cursor-pointer"
            >
              <ChevronLeft className="w-5 h-5 text-white" />
            </button>
            
            {/* Modern Level Jump Dropdown Selector */}
            <div className="relative flex flex-col items-center">
              <div className="relative group">
                <select
                  value={currentLevelIndex}
                  onChange={(e) => initLevel(parseInt(e.target.value))}
                  className="bg-industrial-gray-950 text-yellow-500 font-mono text-[11px] font-extrabold uppercase tracking-wider pl-4 pr-8 py-1.5 rounded border border-[#2a2e39] cursor-pointer hover:border-yellow-500/50 hover:bg-industrial-gray-900 focus:outline-none focus:ring-1 focus:ring-yellow-500/50 appearance-none text-center shadow-inner"
                  style={{ textAlignLast: 'center' }}
                >
                  {levels.map((lvl, index) => (
                    <option key={lvl.id} value={index} className="bg-industrial-gray-950 text-slate-200 font-sans font-bold text-xs py-2 text-left">
                      LVL {lvl.id}: {lvl.title}
                    </option>
                  ))}
                </select>
                <div className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-yellow-500 group-hover:text-yellow-400">
                  <ChevronDown className="w-3.5 h-3.5" />
                </div>
              </div>
              <div className="text-[10px] text-zinc-300 font-extrabold mt-1 truncate max-w-[210px] text-center font-mono">
                {level.title}
              </div>
            </div>

            <button 
              onClick={handleNextLevel} 
              disabled={currentLevelIndex === levels.length - 1}
              className="p-1.5 rounded hover:bg-industrial-gray-700 disabled:opacity-40 cursor-pointer"
            >
              <ChevronRight className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>

        {/* 2. Simulator Power Controls (shrink-0) */}
        <div className="p-4 border-b border-[#2a2e39] flex items-center justify-between gap-3 shrink-0">
          <button
            onClick={toggleSimulation}
            className={`flex-1 py-3 px-4 rounded font-extrabold text-xs tracking-wider flex items-center justify-center gap-2 cursor-pointer transition-all uppercase ${
              isRunning 
                ? 'bg-red-600 hover:bg-red-700 text-white glow-red' 
                : 'bg-emerald-600 hover:bg-emerald-700 text-white'
            }`}
          >
            <Play className={`w-4 h-4 ${isRunning ? 'fill-white animate-pulse' : ''}`} />
            {isRunning ? 'Power Circuit [ON]' : 'Power Circuit [OFF]'}
          </button>
          <button
            onClick={resetLevel}
            className="p-3 bg-industrial-gray-800 hover:bg-industrial-gray-700 border border-[#3c4252] rounded text-white cursor-pointer transition-all"
            title="Reset Circuit"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>

        {/* 3. Objectives / Goals (shrink-0) */}
        <div className="p-4 border-b border-[#2a2e39] bg-industrial-gray-800/20 shrink-0">
          <h3 className="text-[10px] font-extrabold tracking-wider text-industrial-gray-400 mb-3 uppercase">
            Module Objectives
          </h3>
          <ul className="flex flex-col gap-2">
            {level.goals.map((goal, idx) => {
              const isMet = checkGoalReached(idx);
              return (
                <li 
                  key={idx}
                  className={`flex items-start gap-2.5 text-xs font-bold ${
                    isMet ? 'text-emerald-400' : 'text-industrial-gray-300'
                  }`}
                >
                  <CheckCircle2 className={`w-4 h-4 mt-0.5 shrink-0 ${isMet ? 'text-emerald-500 fill-emerald-500/20' : 'text-industrial-gray-600'}`} />
                  <span className={isMet ? 'line-through opacity-80' : ''}>{goal}</span>
                </li>
              );
            })}
          </ul>
        </div>

        {/* 4. Instructions list (Independent scrollable flex area) */}
        <div className="p-4 border-b border-[#2a2e39] flex-1 flex flex-col min-h-0">
          <h3 className="text-[10px] font-extrabold tracking-wider text-industrial-gray-400 mb-2 uppercase shrink-0">
            Step-by-Step Guide
          </h3>
          <div className="flex-1 overflow-y-auto pr-1 flex flex-col gap-2.5 min-h-0">
            {level.instructions.map((inst, index) => (
              <p key={index} className="flex gap-2.5 items-start bg-industrial-gray-800/25 p-2.5 rounded border border-[#2a2e39]/40 text-xs text-industrial-gray-300 leading-relaxed font-semibold">
                <span className="bg-industrial-gray-700 text-yellow-500 w-5 h-5 rounded-full flex items-center justify-center font-mono text-[9px] font-extrabold shrink-0 mt-0.5">
                  {index + 1}
                </span>
                <span>{inst}</span>
              </p>
            ))}
          </div>
        </div>

        {/* 5. Collapsible / Scrollable Hints List (Always displays all unlocked hints side by side) */}
        <div className="p-4 border-b border-[#2a2e39] bg-industrial-gray-950/15 shrink-0 flex flex-col max-h-[190px]">
          <div className="flex items-center justify-between mb-2 shrink-0">
            <h3 className="text-[10px] font-extrabold tracking-wider text-industrial-gray-400 uppercase flex items-center gap-1.5">
              <HelpCircle className="w-3.5 h-3.5 text-yellow-500" />
              <span>Level Hints ({score.hintsUsed} Unlocked)</span>
            </h3>
            <button
              onClick={() => {
                soundManager.playClick();
                useHint();
              }}
              className="text-[9px] font-extrabold text-yellow-500 hover:text-yellow-400 bg-yellow-500/10 px-2.5 py-0.5 rounded border border-yellow-500/20 cursor-pointer uppercase transition-all tracking-wide"
            >
              Get Hint
            </button>
          </div>
          <div className="flex-grow overflow-y-auto pr-1 flex flex-col gap-2 min-h-0">
            {unlockedHints.map((hint, idx) => (
              <div key={idx} className="bg-yellow-500/5 p-2.5 rounded border border-yellow-500/15 text-[11px] font-semibold text-zinc-300 leading-normal animate-fade-in">
                <span className="text-yellow-500 font-black block text-[9px] uppercase tracking-wider font-mono mb-1">
                  Hint {idx + 1} of {level.hints.length}:
                </span>
                {hint}
              </div>
            ))}
          </div>
        </div>

        {/* 6. Attribution Footer (shrink-0) */}
        <div className="p-3 bg-industrial-gray-950/40 border-t border-[#2a2e39]/30 text-center select-none shrink-0 mt-auto">
          <span className="text-[10px] font-mono tracking-wider text-industrial-gray-500 font-extrabold uppercase">
            Made with <span className="text-red-500">❤️</span> by Arjun
          </span>
        </div>
      </div>
      )}
    </div>
  );
};
export default Sidebar;
