import React from 'react';
import { useGameStore } from '../../store/useGameStore';
import { levels } from '../../levels/levelData';
import { 
  Play, 
  RotateCcw, 
  ChevronLeft, 
  ChevronRight, 
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
    simulation
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
    if (currentLevelIndex === 17) { // Level 18
      const btn = useGameStore.getState().components.find(c => c.id === 'btn2');
      if (goalIndex === 0) return simulation.nodeVoltages['relay_open:coil_a'] > 0;
      if (goalIndex === 1) return simulation.nodeVoltages['limit_top:in'] > 0 && simulation.nodeVoltages['limit_bottom:in'] > 0;
      if (goalIndex === 2) return btn?.state.pressed || simulation.nodeVoltages['relay_close:coil_a'] > 0;
    }
    
    return false;
  };

  return (
    <div className="w-[380px] bg-industrial-gray-900 border-r border-[#2a2e39] flex flex-col h-full overflow-y-auto">
      
      {/* 1. Level Selector Header */}
      <div className="p-4 border-b border-[#2a2e39] bg-industrial-gray-800/50 flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-extrabold tracking-widest text-yellow-500">TRAINING MODULE</span>
          <span className="text-xs font-bold text-industrial-gray-400 font-mono">{formatTime(timeElapsed)}</span>
        </div>
        <div className="flex items-center justify-between mt-1">
          <button 
            onClick={handlePrevLevel} 
            disabled={currentLevelIndex === 0}
            className="p-1.5 rounded hover:bg-industrial-gray-700 disabled:opacity-40 cursor-pointer"
          >
            <ChevronLeft className="w-5 h-5 text-white" />
          </button>
          <div className="text-center">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
              LEVEL {level.id} OF {levels.length}
            </h2>
            <div className="text-xs text-industrial-gray-300 font-bold mt-0.5 truncate max-w-[200px]">
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

      {/* 2. Simulator Power Controls */}
      <div className="p-4 border-b border-[#2a2e39] flex items-center justify-between gap-3">
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

      {/* 3. Objectives / Goals */}
      <div className="p-4 border-b border-[#2a2e39] bg-industrial-gray-800/20">
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

      {/* 4. Instructions list */}
      <div className="p-4 border-b border-[#2a2e39] flex-1">
        <h3 className="text-[10px] font-extrabold tracking-wider text-industrial-gray-400 mb-3 uppercase">
          Step-by-Step Guide
        </h3>
        <div className="text-xs text-industrial-gray-300 leading-relaxed font-semibold flex flex-col gap-3">
          {level.instructions.map((inst, index) => (
            <p key={index} className="flex gap-2 items-start bg-industrial-gray-800/30 p-2.5 rounded border border-[#2a2e39]/50">
              <span className="bg-industrial-gray-700 text-yellow-500 w-5 h-5 rounded-full flex items-center justify-center font-mono text-[9px] font-extrabold shrink-0 mt-0.5">
                {index + 1}
              </span>
              <span>{inst}</span>
            </p>
          ))}
        </div>
      </div>

      {/* 5. Attribution Footer */}
      <div className="p-3 bg-industrial-gray-950/40 border-t border-[#2a2e39]/30 text-center select-none shrink-0 mt-auto">
        <span className="text-[10px] font-mono tracking-wider text-industrial-gray-500 font-extrabold uppercase">
          Made with <span className="text-red-500">❤️</span> by Arjun
        </span>
      </div>
    </div>
  );
};
export default Sidebar;
