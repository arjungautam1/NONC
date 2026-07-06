import React from 'react';
import { useGameStore } from '../../store/useGameStore';
import { levels } from '../../levels/levelData';
import { 
  Play, 
  RotateCcw, 
  ChevronLeft, 
  ChevronRight, 
  ChevronDown,
  CheckCircle2
} from 'lucide-react';


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
    toggleSidebar
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
      if (goalIndex === 0) return simulation.nodeVoltages['relay_open:coil_a'] > 0 || simulation.nodeVoltages['timer_open:coil_a'] > 0;
      if (goalIndex === 1) return simulation.nodeVoltages['timer_open:com'] > 0 && simulation.nodeVoltages['relay_open:com'] > 0;
      if (goalIndex === 2) return btn?.state.pressed || simulation.nodeVoltages['relay_close:coil_a'] > 0 || simulation.nodeVoltages['timer_close:coil_a'] > 0;
      if (goalIndex === 3) return simulation.nodeVoltages['timer_close:com'] > 0 && simulation.nodeVoltages['relay_close:com'] > 0;
    }
    
    return false;
  };


  return (
    <div className={`relative transition-all duration-300 ease-in-out shrink-0 flex ${
      sidebarOpen ? 'w-full md:w-[320px] h-[255px] md:h-full' : 'w-full md:w-[28px] h-10 md:h-full'
    }`}>

      {/* ── Slim Edge Tab (visible when closed) ── */}
      {!sidebarOpen && (
        <button
          onClick={toggleSidebar}
          title="Open Sidebar"
          className="w-full md:w-[28px] h-10 md:h-full bg-[#0d1424] border-b md:border-b-0 md:border-r border-[#1e3a5f] flex md:flex-col items-center justify-center gap-2 cursor-pointer hover:bg-[#1a2a45] transition-all group shrink-0"
          style={{ pointerEvents: 'auto' }}
        >
          {/* Glow pill indicator */}
          <span className="h-1 w-10 md:w-1 md:h-10 rounded-full bg-[#1a4a8a] group-hover:bg-[#2563eb] transition-colors shadow-[0_0_8px_rgba(37,99,235,0.5)]" />
          <ChevronRight className="w-3.5 h-3.5 text-[#2563eb] group-hover:text-white transition-colors" />
          <span
            className="text-[9px] font-extrabold text-[#2563eb] group-hover:text-white tracking-widest uppercase font-mono"
            style={{ writingMode: 'horizontal-tb' }}
          >
            GUIDE
          </span>
        </button>
      )}

      {/* Main Sidebar Panel */}
      {sidebarOpen && (
      <div className="w-full md:w-[320px] bg-[#0d1118] border-b md:border-b-0 md:border-r border-white/10 flex flex-col h-full overflow-hidden shrink-0">
        
        {/* 1. Level Selector Header (shrink-0) */}
        <div className="p-3 border-b border-white/10 bg-white/[0.02] flex flex-col gap-2 shrink-0">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-semibold tracking-wide text-slate-400">Training module</span>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-400 tabular-nums">{formatTime(timeElapsed)}</span>
              {/* Collapse sidebar button */}
              <button
                onClick={toggleSidebar}
                title="Collapse Sidebar"
                className="p-1 rounded hover:bg-white/10 cursor-pointer text-slate-500 hover:text-white transition-all"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
            </div>
          </div>
          <div className="flex items-center justify-between mt-1">
              <button 
              onClick={handlePrevLevel} 
              disabled={currentLevelIndex === 0}
              className="p-1.5 rounded hover:bg-white/10 disabled:opacity-40 cursor-pointer"
            >
              <ChevronLeft className="w-5 h-5 text-white" />
            </button>
            
            {/* Modern Level Jump Dropdown Selector */}
            <div className="relative flex flex-col items-center">
              <div className="relative group">
                <select
                  value={currentLevelIndex}
                  onChange={(e) => initLevel(parseInt(e.target.value))}
                  className="bg-black/20 text-slate-200 text-[11px] font-semibold tracking-wide pl-3 pr-8 py-1.5 rounded-md border border-white/10 cursor-pointer hover:border-white/20 hover:bg-white/[0.04] focus:outline-none focus:ring-1 focus:ring-slate-500/50 appearance-none text-center"
                  style={{ textAlignLast: 'center' }}
                >
                  {levels.map((lvl, index) => (
                    <option key={lvl.id} value={index} className="bg-[#0d1118] text-slate-200 font-sans font-semibold text-xs py-2 text-left">
                      LVL {lvl.id}: {lvl.title}
                    </option>
                  ))}
                </select>
                <div className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 group-hover:text-white">
                  <ChevronDown className="w-3.5 h-3.5" />
                </div>
              </div>
              <div className="text-[11px] text-slate-300 font-medium mt-1 truncate max-w-[210px] text-center">
                {level.title}
              </div>
            </div>

            <button 
              onClick={handleNextLevel} 
              disabled={currentLevelIndex === levels.length - 1}
              className="p-1.5 rounded hover:bg-white/10 disabled:opacity-40 cursor-pointer"
            >
              <ChevronRight className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>

        {/* 2. Simulator Power Controls (shrink-0) */}
        <div className="p-3 border-b border-white/10 flex items-center justify-between gap-2 shrink-0">
          <button
            onClick={toggleSimulation}
            className={`flex-1 py-2.5 px-3 rounded-md font-semibold text-xs tracking-wide flex items-center justify-center gap-2 cursor-pointer transition-all ${
              isRunning 
                ? 'bg-red-500/90 hover:bg-red-500 text-white' 
                : 'bg-emerald-500/90 hover:bg-emerald-500 text-slate-950'
            }`}
          >
            <Play className={`w-4 h-4 ${isRunning ? 'fill-white animate-pulse' : ''}`} />
            {isRunning ? 'Power Circuit [ON]' : 'Power Circuit [OFF]'}
          </button>
          <button
            onClick={resetLevel}
            className="p-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-md text-slate-300 cursor-pointer transition-all"
            title="Reset Circuit"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>

        {/* 3. Objectives / Goals (shrink-0) */}
        <div className="p-3 border-b border-white/10 bg-white/[0.02] shrink-0">
          <h3 className="text-[10px] font-semibold tracking-wide text-slate-400 mb-3 uppercase">
            Module Objectives
          </h3>
          <ul className="flex flex-col gap-2">
            {level.goals.map((goal, idx) => {
              const isMet = checkGoalReached(idx);
              return (
                <li 
                  key={idx}
                  className={`flex items-start gap-2.5 text-xs font-medium ${
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
        <div className="p-3 border-b border-white/10 flex-1 flex flex-col min-h-0">
          <h3 className="text-[10px] font-semibold tracking-wide text-slate-400 mb-2 uppercase shrink-0">
            Step-by-Step Guide
          </h3>
          <div className="flex-1 overflow-y-auto pr-1 flex flex-col gap-2.5 min-h-0">
            {level.instructions.map((inst, index) => (
              <p key={index} className="flex gap-2.5 items-start bg-white/[0.03] p-2.5 rounded-md border border-white/10 text-xs text-slate-300 leading-relaxed font-medium">
                <span className="bg-white/10 text-slate-300 w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-semibold shrink-0 mt-0.5">
                  {index + 1}
                </span>
                <span>{inst}</span>
              </p>
            ))}
          </div>
        </div>


        {/* 6. Attribution Footer (shrink-0) */}
        <div className="p-2.5 bg-black/20 border-t border-white/10 text-center select-none shrink-0 mt-auto">
          <span className="text-[10px] tracking-wide text-slate-500 font-medium">
            Made by Arjun
          </span>
        </div>
      </div>
      )}
    </div>
  );
};
export default Sidebar;
