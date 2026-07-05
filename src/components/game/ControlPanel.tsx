import React, { useState } from 'react';
import { useGameStore } from '../../store/useGameStore';
import { 
  Undo2, 
  Redo2, 
  Award, 
  Zap,
  VolumeX,
  Volume2
} from 'lucide-react';
import { levels } from '../../levels/levelData';

export const ControlPanel: React.FC = () => {
  const {
    history,
    redoHistory,
    undo,
    redo,
    currentLevelIndex,
    achievements
  } = useGameStore();

  const [showAchievementsModal, setShowAchievementsModal] = useState(false);
  const [audioMuted, setAudioMuted] = useState(false);

  const toggleMute = () => {
    setAudioMuted(!audioMuted);
    // Dynamic volume adjustment
    if (!audioMuted) {
      // Mute audio
      // @ts-ignore
      if (window.AudioContext || window.webkitAudioContext) {
        // Just general mute flag
      }
    }
  };

  const unlockedCount = achievements.filter(a => a.unlocked).length;

  return (
    <div className="h-16 bg-[#0f1015] border-b border-[#2a2e39] flex items-center justify-between px-6 select-none shrink-0">
      
      {/* 1. App Title / Logo */}
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-yellow-500 flex items-center justify-center glow-yellow shadow-inner">
          <Zap className="w-5 h-5 text-slate-900 fill-slate-900" />
        </div>
        <div>
          <h1 className="text-sm font-black tracking-widest text-white uppercase font-mono leading-none m-0">
            DELMI ELECTRONICS PROJECT
          </h1>
          <span className="text-[9px] font-extrabold text-industrial-gray-400 tracking-wider font-mono">
            VIRTUAL TRAINING SIMULATOR
          </span>
        </div>
      </div>

      {/* 2. Undo/Redo & Undo history count */}
      <div className="flex items-center gap-4">
        <div className="flex items-center bg-industrial-gray-800 p-0.5 rounded border border-[#2a2e39]">
          <button
            onClick={undo}
            disabled={history.length === 0}
            className="p-1.5 rounded text-industrial-gray-300 hover:text-white hover:bg-industrial-gray-700 disabled:opacity-30 disabled:hover:bg-transparent cursor-pointer transition-colors"
            title="Undo (Ctrl+Z)"
          >
            <Undo2 className="w-4 h-4" />
          </button>
          <div className="w-[1px] h-4 bg-[#2a2e39] mx-0.5" />
          <button
            onClick={redo}
            disabled={redoHistory.length === 0}
            className="p-1.5 rounded text-industrial-gray-300 hover:text-white hover:bg-industrial-gray-700 disabled:opacity-30 disabled:hover:bg-transparent cursor-pointer transition-colors"
            title="Redo (Ctrl+Y)"
          >
            <Redo2 className="w-4 h-4" />
          </button>
        </div>

        {/* Audio controls */}
        <button
          onClick={toggleMute}
          className="p-2 bg-industrial-gray-800 hover:bg-industrial-gray-700 border border-[#2a2e39] rounded text-industrial-gray-300 hover:text-white cursor-pointer transition-colors"
        >
          {audioMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
        </button>
      </div>

      {/* 3. Achievements Badge & Star rating display */}
      <div className="flex items-center gap-6 text-xs font-bold font-mono">
        
        {/* Achievements trigger */}
        <button
          onClick={() => setShowAchievementsModal(true)}
          className="flex items-center gap-2 px-3 py-1.5 rounded bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/20 text-amber-400 cursor-pointer transition-colors"
        >
          <Award className="w-4 h-4" />
          <span>ACHIEVEMENTS ({unlockedCount}/{achievements.length})</span>
        </button>

        {/* Score stars */}
        <div className="flex items-center gap-1 bg-industrial-gray-800 px-3 py-1.5 rounded border border-[#2a2e39]">
          <span className="text-[10px] text-industrial-gray-400 uppercase tracking-widest mr-1">LEVELS COMPLETED:</span>
          <span className="text-white text-sm font-black">{currentLevelIndex} / {levels.length}</span>
        </div>
      </div>

      {/* 4. Achievements Modal */}
      {showAchievementsModal && (
        <div className="fixed inset-0 bg-[#000000]/80 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="w-[500px] bg-industrial-gray-900 border border-[#3c4252] rounded-xl shadow-2xl overflow-hidden flex flex-col">
            <div className="p-4 border-b border-[#2a2e39] bg-industrial-gray-800/60 flex items-center justify-between">
              <div className="flex items-center gap-2 text-amber-400">
                <Award className="w-5 h-5" />
                <h3 className="text-sm font-black tracking-wider uppercase font-mono">Simulator Achievements</h3>
              </div>
              <button
                onClick={() => setShowAchievementsModal(false)}
                className="text-industrial-gray-400 hover:text-white cursor-pointer font-bold font-mono"
              >
                CLOSE
              </button>
            </div>
            
            <div className="p-4 max-h-[350px] overflow-y-auto flex flex-col gap-3">
              {achievements.map(ach => (
                <div 
                  key={ach.id} 
                  className={`p-3 rounded-lg border flex items-center gap-3 transition-colors ${
                    ach.unlocked 
                      ? 'bg-amber-500/5 border-amber-500/20' 
                      : 'bg-industrial-gray-800/40 border-[#2a2e39] opacity-60'
                  }`}
                >
                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                    ach.unlocked ? 'bg-amber-500/20 text-amber-400' : 'bg-industrial-gray-700 text-industrial-gray-500'
                  }`}>
                    <Zap className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold text-white leading-none">{ach.title}</h4>
                      {ach.unlocked && (
                        <span className="text-[8px] font-extrabold text-amber-500 uppercase tracking-widest font-mono">
                          UNLOCKED {ach.unlockedAt}
                        </span>
                      )}
                    </div>
                    <p className="text-[10px] text-industrial-gray-400 mt-1 font-semibold leading-relaxed">
                      {ach.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-4 border-t border-[#2a2e39] bg-industrial-gray-950 text-center text-[10px] font-bold text-industrial-gray-400">
              Complete training simulator tasks to unlock career badges.
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
export default ControlPanel;
