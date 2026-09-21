import React from 'react';
import { useGameStore } from '../../store/useGameStore';
import { CheckCircle2, AlertCircle, HelpCircle, Activity, ChevronDown, X } from 'lucide-react';
import { soundManager } from '../../audio/soundManager';

export const HelpOverlay: React.FC = () => {
  const {
    simulation,
    isRunning,
    multimeter,
    setMultimeterMode,
    setProbe,
    setProbeMode,
    sidebarOpen,
    bottomPanelOpen,
    toggleBottomPanel,
    shortCircuitPopup,
    dismissShortCircuitPopup,
  } = useGameStore();

  const multimeterModeLabel =
    multimeter.mode === 'VOLTAGE' ? 'V' :
      multimeter.mode === 'CONTINUITY' ? 'CONT' :
        multimeter.mode === 'RESISTANCE' ? 'OHM' :
          'OFF';

  // Determine current diagnostic message based on electrical solver
  const getDiagnosticMessage = () => {
    if (simulation.shortCircuit) {
      return {
        title: 'Direct Short Circuit Detected!',
        detail: 'Electricity is flowing directly from the Positive terminal to the Negative terminal without passing through a resistance load. This creates infinite current, which has either blown a fuse or would melt wires. Remove the direct connection path.',
        type: 'danger'
      };
    }

    if (!isRunning) {
      return {
        title: 'Simulator Inactive',
        detail: 'The electrical simulator is turned OFF. Turn on circuit power to test your wiring paths.',
        type: 'info'
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

    return {
      title: 'Current Flowing Correctly!',
      detail: 'The electrical loop is complete. Electrons are flowing through the loads and performing work. Use the multimeter to inspect voltage and continuity across your connections.',
      type: 'success'
    };
  };

  const diag = getDiagnosticMessage();

  return (
    <div className="select-none pointer-events-none">

      {/* 2. Interactive Diagnostic Console (Panel) */}
      {bottomPanelOpen ? (
      <div className={`fixed bottom-0 left-0 ${sidebarOpen ? 'md:left-[380px]' : 'md:left-12'} right-0 h-44 md:h-40 bg-[#090d14]/94 border-t border-white/10 flex flex-col md:flex-row p-2 md:p-2.5 gap-2 md:gap-3 pointer-events-auto z-10 transition-all duration-300 ease-in-out backdrop-blur-xl shadow-[0_-18px_40px_rgba(0,0,0,0.26)] overflow-y-auto md:overflow-hidden`}>
        <button
          onClick={toggleBottomPanel}
          className="absolute right-2 top-2 z-20 h-7 px-2 rounded border border-white/10 bg-slate-950/80 hover:bg-slate-900 text-[9px] font-bold uppercase text-slate-400 hover:text-white cursor-pointer transition-all flex items-center gap-1"
          title="Hide multimeter and bottom panel"
        >
          Hide
          <ChevronDown className="w-3 h-3" />
        </button>

        {/* Diagnostic Status Box */}
        <div className="hidden lg:flex w-72 border border-white/10 bg-white/[0.035] rounded-md p-3 flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-semibold tracking-wide text-slate-400 uppercase">
              Diagnostics
            </span>
            <Activity className={`w-4 h-4 ${isRunning ? 'text-emerald-400 animate-pulse' : 'text-industrial-gray-500'}`} />
          </div>

          <div className="flex-1 flex flex-col justify-center">
            <div className="flex items-center gap-2">
              {diag.type === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
              {diag.type === 'warning' && <AlertCircle className="w-4 h-4 text-yellow-400" />}
              {diag.type === 'danger' && <AlertCircle className="w-4 h-4 text-red-500" />}
              {diag.type === 'info' && <HelpCircle className="w-4 h-4 text-sky-400" />}
              <span className={`text-xs font-semibold ${diag.type === 'success' ? 'text-emerald-400' :
                  diag.type === 'danger' ? 'text-red-500 animate-pulse' :
                    diag.type === 'warning' ? 'text-yellow-400' :
                      'text-sky-400'
                }`}>
                {diag.title}
              </span>
            </div>
            <p className="text-[10px] text-slate-300 font-medium leading-relaxed mt-1.5 line-clamp-3">
              {diag.detail}
            </p>
          </div>
        </div>

        {/* 3. DMM Troubleshooting Multimeter Panel */}
        <div className={`h-auto md:h-full border border-white/10 bg-white/[0.035] rounded-md p-2 flex gap-3 select-none shrink-0 overflow-hidden w-full md:w-[420px] mx-auto justify-center`}>
          {/* DMM Yellow Housing */}
          <div className="w-[164px] h-full min-h-[122px] bg-[#fcc419] p-1.5 rounded-md border border-[#ca8a04] shadow-[inset_0_1px_0_rgba(255,255,255,0.4),0_8px_18px_rgba(0,0,0,0.25)] flex flex-col gap-1 shrink-0 justify-between">
            {/* LCD Screen */}
            <div className="bg-[#d7eadf] border border-[#a16207] px-2 py-0.5 rounded-sm shadow-inner font-mono text-slate-900">
              <div className="flex items-center justify-between leading-none">
                <span className="text-[7px] font-bold text-slate-600 tracking-wider">DMM-40</span>
                <span className="text-[7px] font-bold text-slate-500">{multimeterModeLabel}</span>
              </div>
              <div className={`mt-0.5 text-right text-[15px] leading-none font-black tracking-wide tabular-nums ${multimeter.mode === 'OFF' ? 'text-slate-500' :
                  multimeter.reading === '---' ? 'text-slate-600' :
                    'text-emerald-800'
                }`}>
                {multimeter.mode === 'OFF' ? 'OFF' : multimeter.reading}
              </div>
            </div>

            {/* Mode Buttons */}
            <div className="grid grid-cols-4 gap-0.5 font-bold shrink-0">
              {(['OFF', 'VOLTAGE', 'CONTINUITY', 'RESISTANCE'] as const).map(mode => {
                const label = mode === 'VOLTAGE' ? 'V' : mode === 'CONTINUITY' ? 'CONT' : mode === 'RESISTANCE' ? 'OHM' : 'OFF';
                const active = multimeter.mode === mode;
                return (
                  <button
                    key={mode}
                    onClick={() => setMultimeterMode(mode)}
                    aria-label={`Multimeter ${mode.toLowerCase()}`}
                    aria-pressed={active}
                    className={`h-6 rounded border font-bold cursor-pointer uppercase transition-all flex items-center justify-center whitespace-nowrap px-0.5 text-[8px] tracking-tight ${active
                        ? 'bg-slate-950 text-[#fcc419] border-slate-950 shadow-inner'
                        : 'bg-[#d99f0e] text-slate-950 border-[#b88506] hover:bg-[#ebb11a]'
                      }`}
                  >
                    {label}
                  </button>
                );
              })}
            </div>

            {/* Probe Attach Sockets (COM / VΩ) */}
            <div className="flex justify-around items-center border-t border-[#9b7a24]/60 pt-1 shrink-0 pb-0.5">
              {/* COM Socket (Black) */}
              <div className="flex flex-col items-center">
                <button
                  id="dmm-black-port"
                  onClick={() => setProbeMode('black')}
                  className={`w-7 h-7 rounded-full flex items-center justify-center border-2 transition-all cursor-pointer shadow-md ${
                    multimeter.blackProbe
                      ? 'bg-slate-950 border-slate-400 ring-2 ring-slate-400/40 scale-95'
                      : 'bg-slate-950 hover:bg-slate-900 border-slate-800 hover:border-slate-700'
                  }`}
                  title="Black Probe (COM) - Click to place"
                >
                  <span className={`w-3 h-3 rounded-full border transition-all ${
                    multimeter.blackProbe 
                      ? 'bg-[#18181b] border-slate-500 shadow-inner' 
                      : 'bg-[#cbd5e1] border-[#64748b]'
                  }`} />
                </button>
                <span className="text-[6.5px] font-black text-slate-800 tracking-wider mt-0.5">COM</span>
              </div>

              {/* V/Ohm Socket (Red) */}
              <div className="flex flex-col items-center">
                <button
                  id="dmm-red-port"
                  onClick={() => setProbeMode('red')}
                  className={`w-7 h-7 rounded-full flex items-center justify-center border-2 transition-all cursor-pointer shadow-md ${
                    multimeter.redProbe
                      ? 'bg-red-600 border-red-300 ring-2 ring-red-400/40 scale-95'
                      : 'bg-red-750 hover:bg-red-600 border-red-900 hover:border-red-800'
                  }`}
                  title="Red Probe (V/Ω) - Click to place"
                >
                  <span className={`w-3 h-3 rounded-full border transition-all ${
                    multimeter.redProbe 
                      ? 'bg-[#ef4444] border-red-400 shadow-inner' 
                      : 'bg-[#cbd5e1] border-[#64748b]'
                  }`} />
                </button>
                <span className="text-[6.5px] font-black text-slate-800 tracking-wider mt-0.5">V Ω</span>
              </div>
            </div>

            {(multimeter.redProbe || multimeter.blackProbe) && (
              <button
                onClick={() => { setProbe('red', null); setProbe('black', null); }}
                className="w-full h-[15px] rounded bg-slate-950/80 hover:bg-slate-950 text-slate-200 hover:text-white border border-slate-950 transition-all text-[7px] font-extrabold uppercase cursor-pointer flex items-center justify-center shrink-0 shadow-sm"
              >
                Clear Probes
              </button>
            )}
          </div>

          <div className="min-w-0 flex-1 self-center pr-5 text-xs leading-relaxed text-slate-400">
            <p className="font-semibold text-slate-200">Check your connections</p>
            <p className="mt-2">Choose a measurement, then select a probe and a terminal to attach it.</p>
          </div>
        </div>
      </div>
      ) : (
        <button
          onClick={toggleBottomPanel}
          className="fixed bottom-3 right-4 z-20 pointer-events-auto h-9 px-3 rounded-md border border-white/10 bg-[#090d14]/94 hover:bg-[#111827] text-slate-300 hover:text-white shadow-lg backdrop-blur-xl text-[10px] font-bold uppercase tracking-wide cursor-pointer transition-all flex items-center gap-2"
          title="Show multimeter & diagnostics panel"
        >
          <Activity className="w-3.5 h-3.5 text-emerald-400" />
          Show Multimeter
        </button>
      )}

      {/* 3. Funny Short Circuit Modal Pop-up */}
      {shortCircuitPopup?.show && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-sm pointer-events-auto animate-fade-in">
          <div className="relative w-[340px] max-w-[calc(100vw-2rem)] bg-[#0f0a0a]/98 border border-red-500/20 rounded-lg shadow-2xl shadow-red-950/30 p-5 flex flex-col items-center text-center animate-scale-in">
            
            {/* Close button */}
            <button
              onClick={() => {
                soundManager.playButton();
                dismissShortCircuitPopup();
              }}
              className="absolute top-3 right-3 p-1 rounded-md flex items-center justify-center text-red-400 hover:text-red-200 hover:bg-red-500/10 transition-all cursor-pointer"
              title="Close Popup"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Glowing Explosion icon */}
            <div className="w-12 h-12 rounded-md bg-red-500/10 border border-red-500/25 text-red-400 flex items-center justify-center mb-3 shadow-lg shadow-red-500/5 animate-pulse">
              <AlertCircle className="w-7 h-7" />
            </div>

            <span className="text-[9px] font-semibold tracking-wider text-red-400 uppercase font-mono">
              💥 Breaker Tripped!
            </span>
            <h2 className="text-base font-bold text-white mt-1">Short Circuit Detected</h2>
            
            <div className="my-3.5 p-3 rounded bg-red-500/[0.03] border border-red-500/10 text-[11px] text-red-200/90 leading-relaxed font-semibold italic">
              {shortCircuitPopup.quote}
            </div>

            <p className="text-[10px] text-slate-400 leading-normal font-medium px-1">
              Current flowed directly from Positive to Negative without passing through a load, triggering the safety breaker. Fix your path loops and try powering on again!
            </p>

            {/* Dismiss CTA button */}
            <button
              onClick={() => {
                soundManager.playButton();
                dismissShortCircuitPopup();
              }}
              className="mt-4 w-full py-2 bg-red-600 hover:bg-red-500 text-white rounded-md font-semibold text-xs tracking-wide flex items-center justify-center cursor-pointer transition-all uppercase shadow-md shadow-red-900/30 hover:shadow-red-800/40"
            >
              Okay, I'll Fix It!
            </button>
          </div>
        </div>
      )}


    </div>
  );
};
export default HelpOverlay;
