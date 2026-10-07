import React, { useState } from 'react';
import { useGameStore } from '../../store/useGameStore';
import { Logo } from './components/Logo';
import { 
  Undo2,
  Redo2,
  RotateCcw,
  Eraser,
  VolumeX,
  Volume2,
  LayoutGrid,
  ChevronUp
} from 'lucide-react';
import { soundManager } from '../../audio/soundManager';

interface ControlPanelProps {
  onHide: () => void;
  title?: string;
  subtitle?: string;
}

export const ControlPanel: React.FC<ControlPanelProps> = ({ onHide, title = 'Electronics & relays lab', subtitle = 'Build your own circuit' }) => {
  const canUndo = useGameStore(state => state.history.length > 0);
  const canRedo = useGameStore(state => state.redoHistory.length > 0);
  const undo = useGameStore(state => state.undo);
  const redo = useGameStore(state => state.redo);
  const setViewMode = useGameStore(state => state.setViewMode);
  const hasBenchContents = useGameStore(state => state.components.length > 2 || state.wires.length > 0);
  const isRunning = useGameStore(state => state.isRunning);
  const toggleSimulation = useGameStore(state => state.toggleSimulation);
  const stopTimer = useGameStore(state => state.stopTimer);
  const resetLab = useGameStore(state => state.resetLab);
  const clearCustomLabBench = useGameStore(state => state.clearCustomLabBench);

  const [audioMuted, setAudioMuted] = useState(false);

  const toggleMute = () => {
    const nextMuted = !audioMuted;
    soundManager.setMuted(nextMuted);
    setAudioMuted(nextMuted);
  };

  const toolClass = 'min-h-9 inline-flex items-center justify-center gap-1.5 sm:gap-2 rounded-lg px-2 sm:px-2.5 text-xs font-semibold text-slate-300 hover:text-white hover:bg-white/10 disabled:opacity-30 disabled:hover:bg-transparent disabled:cursor-not-allowed cursor-pointer transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400';

  return (
    <div className="min-h-16 bg-[#090d14]/95 border-b border-white/10 flex flex-wrap items-center justify-between gap-x-4 gap-y-2 px-3 sm:px-5 py-2.5 select-none shrink-0 relative z-20 shadow-[0_10px_30px_rgba(0,0,0,0.22)] backdrop-blur-xl">
      
      {/* 1. App Title / Logo & Back to Dashboard */}
      <div className="flex items-center gap-3 sm:gap-5 min-w-0">
        <div className="flex items-center gap-5">
          <Logo variant="horizontal" size="sm" />
          <div className="border-l border-white/10 pl-4 hidden lg:block">
            <h2 className="text-sm font-semibold text-white">
              {title}
            </h2>
            <span className="text-[11px] text-slate-400">
              {subtitle}
            </span>
          </div>
        </div>

        <button
          onClick={() => {
            soundManager.playButton();
            if (isRunning) toggleSimulation();
            stopTimer();
            setViewMode('home');
          }}
          className={`${toolClass} border border-white/10 bg-white/[0.04]`}
          title="Back to home"
          aria-label="Back to home"
        >
          <LayoutGrid className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Home</span>
        </button>
      </div>

      {/* 2. Undo/Redo & Undo history count */}
      <div className="flex flex-wrap items-center gap-2 order-3 w-full sm:order-none sm:w-auto">
        <div className="flex flex-wrap items-center bg-white/[0.035] p-0.5 rounded-xl border border-white/10 max-w-full">
          <button
            onClick={undo}
            disabled={!canUndo}
            className={toolClass}
            title="Undo (Ctrl/Cmd + Z)"
            aria-label="Undo last change"
          >
            <Undo2 className="w-4 h-4" />
            <span>Undo</span>
          </button>
          <div className="w-[1px] h-4 bg-white/10 mx-0.5" />
          <button
            onClick={redo}
            disabled={!canRedo}
            className={toolClass}
            title="Redo (Ctrl/Cmd + Shift + Z or Ctrl/Cmd + Y)"
            aria-label="Redo last change"
          >
            <Redo2 className="w-4 h-4" />
            <span className="hidden sm:inline">Redo</span>
          </button>
          <div className="w-[1px] h-4 bg-white/10 mx-0.5" />
          <button
            onClick={resetLab}
            className={`${toolClass} hover:!text-amber-200`}
            title="Reset devices and clear wiring"
            aria-label="Reset lab devices and clear wiring"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reset<span className="hidden sm:inline"> lab</span></span>
          </button>
          <>
              <div className="w-[1px] h-4 bg-white/10 mx-0.5" />
              <button
                onClick={clearCustomLabBench}
                disabled={!hasBenchContents}
                className={`${toolClass} hover:!text-red-300`}
                title="Clear bench — remove every device and wire, keeping only the transformer and power supply"
                aria-label="Clear bench devices and wiring"
              >
                <Eraser className="w-4 h-4" />
                <span>Clear<span className="hidden sm:inline"> bench</span></span>
              </button>
          </>
        </div>

        {/* Audio controls */}
        <button
          onClick={toggleMute}
          className={`${toolClass} border border-white/10 bg-white/[0.04] ml-auto sm:ml-0`}
          title={audioMuted ? 'Turn sound on' : 'Mute sound'}
          aria-label={audioMuted ? 'Turn sound on' : 'Mute sound'}
          aria-pressed={audioMuted}
        >
          {audioMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
        </button>
      </div>

      <button onClick={onHide} className={`${toolClass} border border-white/10 bg-white/[0.04]`} title="Hide top controls" aria-label="Hide top controls">
        <ChevronUp className="h-4 w-4" />
        <span className="hidden sm:inline">Hide controls</span>
      </button>
    </div>
  );
};
export default ControlPanel;
