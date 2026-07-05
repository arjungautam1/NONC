import React, { useEffect } from 'react';
import { useGameStore } from '../../store/useGameStore';
import { levels } from '../../levels/levelData';
import { 
  CheckCircle2, 
  AlertCircle, 
  HelpCircle,
  ArrowRight, 
  Award,
  Star,
  Activity,
  Gauge
} from 'lucide-react';
import { soundManager } from '../../audio/soundManager';

export const HelpOverlay: React.FC = () => {
  const {
    currentLevelIndex,
    levelCompleted,
    successFeedback,
    simulation,
    isRunning,
    timeElapsed,
    score,
    nextLevel,
    recentAchievement,
    dismissAchievement,
    useHint,
    multimeter,
    setMultimeterMode,
    setProbe,
    setProbeMode
  } = useGameStore();

  const level = levels[currentLevelIndex];

  // Auto-dismiss achievement notifications after 4 seconds
  useEffect(() => {
    if (recentAchievement) {
      const timer = setTimeout(() => {
        dismissAchievement();
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [recentAchievement, dismissAchievement]);

  // Calculate stars earned based on performance
  const calculateStars = () => {
    // 3 stars: no hints used, completed in under 90 seconds
    // 2 stars: under 3 hints, completed under 3 minutes
    // 1 star: default
    const hints = score.hintsUsed;
    if (hints === 0 && timeElapsed < 90) return 3;
    if (hints <= 2 && timeElapsed < 180) return 2;
    return 1;
  };

  const stars = calculateStars();

  // Helper to format timer
  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remaining = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${remaining.toString().padStart(2, '0')}`;
  };

  // Determine current diagnostic message based on electrical solver
  const getDiagnosticMessage = () => {
    if (!isRunning) {
      return {
        title: 'Simulator Inactive',
        detail: 'The electrical simulator is turned OFF. Click the green "Power Circuit" switch to test your wiring paths.',
        type: 'info'
      };
    }

    if (simulation.shortCircuit) {
      return {
        title: 'Direct Short Circuit Detected!',
        detail: 'Electricity is flowing directly from the Positive terminal to the Negative terminal without passing through a resistance load. This creates infinite current, which has either blown a fuse or would melt wires. Remove the direct connection path.',
        type: 'danger'
      };
    }

    if (simulation.fuseBlownIds.length > 0) {
      return {
        title: 'Protection Fuse Blown',
        detail: `The fuse has blown to prevent short-circuit damage. Inspect your connection branches, fix the short path, and press Reset to replace the fuse.`,
        type: 'warning'
      };
    }

    if (simulation.energizedComponents.size === 0) {
      // Find open contacts
      if (simulation.faultLocation) {
        const [cId] = simulation.faultLocation.split(':');
        const comp = useGameStore.getState().components.find(c => c.id === cId);
        
        if (comp) {
          let reason = `Current reached [${comp.label}] but stopped because the contact is open.`;
          let fix = 'Make sure the button is pressed or switches are closed to complete the path.';
          
          if (comp.type === 'button_no') {
            reason = `Current reached [${comp.label}] COM/IN terminal but is blocked because Normally Open contacts are open at rest.`;
            fix = 'Hold down the green push button to close the contact and let current flow.';
          } else if (comp.type === 'button_nc') {
            reason = `Current reached [${comp.label}] but is blocked. Did you press the button? NC contacts open when pressed.`;
            fix = 'Release the red button to close the contact at rest.';
          } else if (comp.type === 'relay') {
            reason = `Current reached the Relay contacts, but the coil is not energized, so the NO contact is open.`;
            fix = 'Energize the relay coil first using a push button.';
          }

          return {
            title: `Electrical Path Blocked at ${comp.label}`,
            detail: `${reason} ${fix}`,
            type: 'warning'
          };
        }
      }

      return {
        title: 'Open Loop Path',
        detail: 'The circuit is incomplete. Electrons must start at the Positive terminal (+), pass through a load (such as a bulb), and return to the Negative terminal (-) to flow.',
        type: 'info'
      };
    }

    if (successFeedback) {
      return {
        title: 'Circuit Powered but Goal Incomplete',
        detail: successFeedback,
        type: 'warning'
      };
    }

    return {
      title: 'Current Flowing Correctly!',
      detail: 'The electrical loop is complete. Electrons are flowing through the loads and performing work. Verify the level objective is fully met.',
      type: 'success'
    };
  };

  const diag = getDiagnosticMessage();

  return (
    <div className="select-none pointer-events-none">
      
      {/* 1. Career Achievement Unlock Alert (Bottom-Right Slide-in) */}
      {recentAchievement && (
        <div className="fixed bottom-6 right-6 w-80 bg-industrial-gray-900 border-2 border-amber-500 rounded-xl p-4 shadow-2xl z-50 pointer-events-auto flex items-start gap-3 animate-bounce">
          <div className="w-10 h-10 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
            <Award className="w-6 h-6" />
          </div>
          <div className="flex-1 min-w-0">
            <span className="text-[9px] font-extrabold tracking-wider text-amber-500 uppercase font-mono">
              ACHIEVEMENT UNLOCKED!
            </span>
            <h4 className="text-xs font-black text-white mt-0.5">{recentAchievement.title}</h4>
            <p className="text-[10px] text-industrial-gray-400 leading-tight mt-1 font-semibold">
              {recentAchievement.description}
            </p>
          </div>
          <button
            onClick={dismissAchievement}
            className="text-industrial-gray-400 hover:text-white cursor-pointer font-bold text-xs"
          >
            ×
          </button>
        </div>
      )}

      {/* 2. Interactive Diagnostic Console (Panel) */}
      <div className="fixed bottom-0 left-[380px] right-0 h-44 bg-industrial-gray-950 border-t border-[#2a2e39] flex p-4 gap-6 pointer-events-auto z-10">
        
        {/* Diagnostic Status Box */}
        <div className="w-80 border border-[#2a2e39] bg-industrial-gray-900/50 rounded-lg p-3.5 flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-extrabold tracking-wider text-industrial-gray-400 uppercase font-mono">
              DIAGNOSTIC CONSOLE
            </span>
            <Activity className={`w-4 h-4 ${isRunning ? 'text-emerald-400 animate-pulse' : 'text-industrial-gray-500'}`} />
          </div>
          
          <div className="flex-1 flex flex-col justify-center">
            <div className="flex items-center gap-2">
              {diag.type === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
              {diag.type === 'warning' && <AlertCircle className="w-4 h-4 text-yellow-400" />}
              {diag.type === 'danger' && <AlertCircle className="w-4 h-4 text-red-500" />}
              {diag.type === 'info' && <HelpCircle className="w-4 h-4 text-sky-400" />}
              <span className={`text-xs font-black ${
                diag.type === 'success' ? 'text-emerald-400' :
                diag.type === 'danger' ? 'text-red-500 animate-pulse' :
                diag.type === 'warning' ? 'text-yellow-400' :
                'text-sky-400'
              }`}>
                {diag.title}
              </span>
            </div>
            <p className="text-[10px] text-industrial-gray-300 font-semibold leading-relaxed mt-1.5 line-clamp-3">
              {diag.detail}
            </p>
          </div>
        </div>

        {/* 3. DMM Troubleshooting Multimeter Panel */}
        <div className="w-[400px] border border-[#2a2e39] bg-industrial-gray-900/50 rounded-lg p-3.5 flex gap-3 select-none shrink-0">
          {/* DMM Yellow Housing */}
          <div className="w-[150px] bg-yellow-500 p-2 rounded border-2 border-yellow-600 shadow-md flex flex-col gap-1.5 shrink-0">
            {/* LCD Screen */}
            <div className="bg-[#c7f7e5] border-2 border-yellow-700 px-1.5 py-1 rounded shadow-inner flex items-center justify-between font-mono text-slate-900">
              <span className="text-[7px] font-bold text-slate-600 tracking-wider">DMM-40</span>
              <span className={`text-[11px] font-black tracking-wider px-1 rounded ${
                multimeter.mode === 'OFF' ? 'text-slate-500' :
                multimeter.reading === '---' ? 'text-slate-600' :
                'text-emerald-700 bg-emerald-100/50'
              }`}>
                {multimeter.mode === 'OFF' ? 'OFF' : multimeter.reading}
              </span>
            </div>

            {/* Mode Buttons */}
            <div className="grid grid-cols-2 gap-1 text-[7px] font-extrabold">
              {(['OFF', 'VOLTAGE', 'CONTINUITY', 'RESISTANCE'] as const).map(mode => {
                const label = mode === 'VOLTAGE' ? 'V' : mode === 'CONTINUITY' ? 'CONT' : mode === 'RESISTANCE' ? 'OHM' : 'OFF';
                const active = multimeter.mode === mode;
                return (
                  <button
                    key={mode}
                    onClick={() => setMultimeterMode(mode)}
                    className={`py-1 rounded border font-black cursor-pointer uppercase transition-all ${
                      active 
                        ? 'bg-slate-900 text-yellow-300 border-slate-700 shadow-inner' 
                        : 'bg-yellow-600 text-slate-950 border-yellow-700 hover:bg-yellow-400'
                    }`}
                  >
                    {label}
                  </button>
                );
              })}
            </div>

            {/* Probe Attach Buttons */}
            <div className="flex flex-col gap-1 border-t border-yellow-600/40 pt-1.5">
              <button
                onClick={() => setProbeMode(multimeter.redProbe ? null : 'red')}
                className={`w-full py-1 rounded text-[8px] font-black uppercase cursor-pointer transition-all flex items-center justify-center gap-1 ${
                  multimeter.redProbe
                    ? 'bg-red-700 text-white border border-red-500'
                    : 'bg-red-500 hover:bg-red-400 text-white border border-red-700'
                }`}
              >
                🔴 {multimeter.redProbe ? '✔ RED ON' : 'ATTACH RED'}
              </button>
              <button
                onClick={() => setProbeMode(multimeter.blackProbe ? null : 'black')}
                className={`w-full py-1 rounded text-[8px] font-black uppercase cursor-pointer transition-all flex items-center justify-center gap-1 ${
                  multimeter.blackProbe
                    ? 'bg-slate-600 text-white border border-slate-400'
                    : 'bg-slate-500 hover:bg-slate-400 text-white border border-slate-700'
                }`}
              >
                ⚫ {multimeter.blackProbe ? '✔ BLK ON' : 'ATTACH BLK'}
              </button>
              {(multimeter.redProbe || multimeter.blackProbe) && (
                <button
                  onClick={() => { setProbe('red', null); setProbe('black', null); }}
                  className="w-full py-0.5 rounded text-[7px] font-black uppercase cursor-pointer bg-zinc-700 hover:bg-zinc-600 text-zinc-300 border border-zinc-600 transition-all"
                >
                  ✕ Clear
                </button>
              )}
            </div>
          </div>

          {/* DMM Guide Instructions */}
          <div className="flex-1 flex flex-col justify-between min-w-0">
            <div className="flex items-center gap-1">
              <Gauge className="w-3.5 h-3.5 text-yellow-500" />
              <span className="text-[10px] font-extrabold text-industrial-gray-400 tracking-wider font-mono">
                HOW TO USE DMM
              </span>
            </div>
            <ol className="text-[9px] text-zinc-300 font-semibold pl-3 list-decimal leading-relaxed mt-1 flex-grow">
              <li>Pick a mode: <b>V</b>=Voltage, <b>OHM</b>=Resistance, <b>CONT</b>=Continuity.</li>
              <li>Click <b>ATTACH RED</b> — then click any terminal on the canvas.</li>
              <li>Click <b>ATTACH BLK</b> — click another terminal.</li>
              <li>LCD shows live reading between both probes!</li>
            </ol>
          </div>
        </div>

        {/* Dynamic Hints Panel */}
        <div className="flex-1 border border-[#2a2e39] bg-industrial-gray-900/60 rounded-lg p-4 flex flex-col gap-2.5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-extrabold tracking-widest text-yellow-500 uppercase font-mono">
              HINTS & DIAGRAMS
            </span>
            <span className="text-[9px] font-bold text-industrial-gray-400 bg-industrial-gray-800 px-1.5 py-0.5 rounded border border-[#2a2e39] uppercase font-mono">
              Hint {score.hintsUsed % level.hints.length + 1} of {level.hints.length}
            </span>
          </div>
          
          <div className="flex-grow overflow-y-auto pr-1 flex items-center">
            <p className="text-xs text-zinc-100 leading-relaxed font-medium">
              {level.hints[score.hintsUsed % level.hints.length]}
            </p>
          </div>

          <button
            onClick={() => {
              soundManager.playClick();
              useHint();
            }}
            className="self-end text-[9px] font-extrabold text-yellow-500 hover:text-yellow-400 bg-yellow-500/10 hover:bg-yellow-500/20 px-3 py-1 rounded border border-yellow-500/30 cursor-pointer transition-colors"
          >
            NEXT HINT
          </button>
        </div>
      </div>

      {/* 3. Level Complete Modal Overlay */}
      {levelCompleted && (
        <div className="fixed inset-0 bg-[#000000]/85 z-50 flex items-center justify-center p-4 backdrop-blur-sm pointer-events-auto">
          <div className="w-[450px] bg-industrial-gray-900 border-2 border-emerald-500 rounded-2xl shadow-2xl p-6 flex flex-col items-center text-center animate-fade-in">
            
            {/* Crown/Success icon */}
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 border-2 border-emerald-500 text-emerald-400 flex items-center justify-center glow-green mb-4">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <span className="text-[10px] font-extrabold tracking-widest text-emerald-400 uppercase font-mono">
              TRAINING MODULE CLEARED
            </span>
            <h2 className="text-xl font-black text-white mt-1 uppercase font-mono">{level.title}</h2>
            <p className="text-[11px] text-industrial-gray-300 mt-2 px-4 leading-relaxed font-semibold">
              Excellent! You have successfully wired this circuit and met all engineering criteria.
            </p>

            {/* Stars evaluation rating */}
            <div className="flex gap-2.5 my-5">
              {[1, 2, 3].map(num => (
                <Star
                  key={num}
                  className={`w-7 h-7 ${
                    num <= stars 
                      ? 'text-yellow-400 fill-yellow-400 drop-shadow(0 0 4px rgba(250,204,21,0.5))' 
                      : 'text-industrial-gray-700'
                  }`}
                />
              ))}
            </div>

            {/* Statistics */}
            <div className="grid grid-cols-2 gap-3 w-full border-t border-b border-[#2a2e39] py-3.5 my-2 text-xs font-mono">
              <div className="text-left pl-4 border-r border-[#2a2e39]">
                <span className="text-[9px] text-industrial-gray-400 block uppercase font-bold">Time Taken:</span>
                <span className="text-white font-extrabold text-sm">{formatTime(timeElapsed)}</span>
              </div>
              <div className="text-left pl-4">
                <span className="text-[9px] text-industrial-gray-400 block uppercase font-bold">Hints Consulted:</span>
                <span className="text-white font-extrabold text-sm">{score.hintsUsed}</span>
              </div>
            </div>

            {/* Next Level CTA button */}
            <button
              onClick={() => {
                soundManager.playButton();
                nextLevel();
              }}
              className="mt-6 w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-black text-xs tracking-wider flex items-center justify-center gap-2 cursor-pointer transition-all uppercase hover:glow-green"
            >
              <span>Next Training Module</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
export default HelpOverlay;
