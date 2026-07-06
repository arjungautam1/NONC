import React, { useState } from 'react';
import { useGameStore } from '../../store/useGameStore';
import { 
  Undo2, 
  Redo2, 
  Award, 
  Zap,
  VolumeX,
  Volume2,
  LayoutGrid
} from 'lucide-react';
import { levels } from '../../levels/levelData';
import { soundManager } from '../../audio/soundManager';

export const ControlPanel: React.FC = () => {
  const {
    history,
    redoHistory,
    undo,
    redo,
    currentLevelIndex,
    achievements,
    setViewMode
  } = useGameStore();

  const [showAchievementsModal, setShowAchievementsModal] = useState(false);
  const [audioMuted, setAudioMuted] = useState(false);

  const toggleMute = () => {
    const nextMuted = !audioMuted;
    soundManager.setMuted(nextMuted);
    setAudioMuted(nextMuted);
  };

  const unlockedCount = achievements.filter(a => a.unlocked).length;

  return (
    <div className="min-h-14 bg-[#090d14]/92 border-b border-white/10 flex flex-wrap items-center justify-between gap-2 px-3 sm:px-5 py-2 select-none shrink-0 relative z-20 shadow-[0_10px_30px_rgba(0,0,0,0.22)] backdrop-blur-xl">
      
      {/* 1. App Title / Logo & Back to Dashboard */}
      <div className="flex items-center gap-3 sm:gap-5 min-w-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-md bg-white flex items-center justify-center shadow-[0_0_0_1px_rgba(255,255,255,0.18)]">
            <Zap className="w-5 h-5 text-[#090d14] fill-[#090d14]" />
          </div>
          <div>
            <h1 className="text-xs sm:text-sm font-semibold tracking-wide text-white leading-none m-0 truncate normal-case">
              DELMI ELECTRONICS LAB
            </h1>
            <span className="hidden sm:inline text-[10px] font-medium text-slate-400 tracking-wide">
              VIRTUAL TRAINING SIMULATOR
            </span>
          </div>
        </div>

        <button
          onClick={() => {
            soundManager.playButton();
            setViewMode('levels');
          }}
          className="px-3 py-1.5 rounded-md bg-white/[0.06] hover:bg-white/[0.11] border border-white/10 text-slate-300 hover:text-white font-semibold text-[11px] cursor-pointer transition-all flex items-center gap-1.5"
          title="Return to Levels Selection"
        >
          <LayoutGrid className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Dashboard</span>
        </button>
      </div>

      {/* 2. Undo/Redo & Undo history count */}
      <div className="flex items-center gap-2 sm:gap-4">
        <div className="flex items-center bg-white/[0.04] p-0.5 rounded-md border border-white/10">
          <button
            onClick={undo}
            disabled={history.length === 0}
            className="p-1.5 rounded text-slate-400 hover:text-white hover:bg-white/10 disabled:opacity-30 disabled:hover:bg-transparent cursor-pointer transition-colors"
            title="Undo (Ctrl+Z)"
          >
            <Undo2 className="w-4 h-4" />
          </button>
          <div className="w-[1px] h-4 bg-white/10 mx-0.5" />
          <button
            onClick={redo}
            disabled={redoHistory.length === 0}
            className="p-1.5 rounded text-slate-400 hover:text-white hover:bg-white/10 disabled:opacity-30 disabled:hover:bg-transparent cursor-pointer transition-colors"
            title="Redo (Ctrl+Y)"
          >
            <Redo2 className="w-4 h-4" />
          </button>
        </div>

        {/* Audio controls */}
        <button
          onClick={toggleMute}
          className="p-2 bg-white/[0.04] hover:bg-white/10 border border-white/10 rounded-md text-slate-400 hover:text-white cursor-pointer transition-colors"
        >
          {audioMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
        </button>
      </div>

      {/* 3. Achievements Badge & Star rating display */}
      <div className="flex items-center gap-2 sm:gap-4 text-xs font-semibold">
        
        {/* Achievements trigger */}
        <button
          onClick={() => setShowAchievementsModal(true)}
          className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-white/[0.06] hover:bg-white/[0.11] border border-white/10 text-slate-300 cursor-pointer transition-colors"
        >
          <Award className="w-4 h-4" />
          <span>Badges {unlockedCount}/{achievements.length}</span>
        </button>

        {/* Score stars */}
        <div className="flex items-center gap-1 bg-white/[0.04] px-3 py-1.5 rounded-md border border-white/10">
          <span className="hidden sm:inline text-[10px] text-slate-400 uppercase tracking-wide mr-1">Solved</span>
          <span className="text-white text-sm font-black">{currentLevelIndex} / {levels.length}</span>
        </div>
      </div>

      {/* 4. Achievements Modal */}
      {showAchievementsModal && (
        <div className="fixed inset-0 bg-[#000000]/80 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="w-[500px] max-w-full bg-[#0b1018] border border-white/10 rounded-lg shadow-2xl overflow-hidden flex flex-col">
            <div className="p-4 border-b border-white/10 bg-white/[0.04] flex items-center justify-between">
              <div className="flex items-center gap-2 text-slate-200">
                <Award className="w-5 h-5" />
                <h3 className="text-sm font-semibold tracking-wide">Simulator Achievements</h3>
              </div>
              <button
                onClick={() => setShowAchievementsModal(false)}
                className="text-slate-400 hover:text-white cursor-pointer font-semibold text-xs"
              >
                CLOSE
              </button>
            </div>
            
            <div className="p-4 max-h-[350px] overflow-y-auto flex flex-col gap-3">
              {achievements.map(ach => (
                <div 
                  key={ach.id} 
                  className={`p-3 rounded-md border flex items-center gap-3 transition-colors ${
                    ach.unlocked 
                      ? 'bg-amber-500/5 border-amber-500/20' 
                      : 'bg-industrial-gray-800/40 border-[#2a2e39] opacity-60'
                  }`}
                >
                  <div className={`w-9 h-9 rounded-md flex items-center justify-center shrink-0 ${
                    ach.unlocked ? 'bg-amber-500/20 text-amber-400' : 'bg-industrial-gray-700 text-industrial-gray-500'
                  }`}>
                    <Zap className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold text-white leading-none">{ach.title}</h4>
                      {ach.unlocked && (
                        <span className="text-[8px] font-semibold text-amber-400 uppercase tracking-wide">
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

            <div className="p-4 border-t border-white/10 bg-black/20 text-center text-[10px] font-semibold text-slate-500">
              Complete training simulator tasks to unlock career badges.
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
export default ControlPanel;
