import React, { useEffect } from 'react';
import { useGameStore } from '../../store/useGameStore';
import { levels } from '../../levels/levelData';
import {
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Award,
  Activity,
  Briefcase,
  ChevronRight,
  ChevronDown,
  X
} from 'lucide-react';
import { soundManager } from '../../audio/soundManager';
import { RealWorldVisual } from './components/RealWorldVisual';

const getRealWorldApplication = (levelId: number) => {
  switch (levelId) {
    case 1:
      return {
        title: "Low-Voltage Task Light",
        desc: "A DC power supply sends current through a lamp and back on the return conductor. Both paths must be complete for the lamp to turn on."
      };
    case 2:
      return {
        title: "Lighting-Circuit Troubleshooting",
        desc: "A technician locates an open return conductor, repairs the break, and verifies that current can flow through the lamp again."
      };
    case 3:
      return {
        title: "Doorbell System",
        desc: "A momentary normally open button completes the circuit only while pressed, so the doorbell rings only while someone holds the button."
      };
    case 4:
      return {
        title: "Refrigerator Door Light",
        desc: "A momentary normally closed switch carries current at rest. Closing the door presses the switch and opens the circuit, turning the light off."
      };
    case 5:
      return {
        title: "Control-Panel Relay",
        desc: "A low-current switch energizes a relay coil. The relay then transfers its common contact from NC to NO to control a separate circuit."
      };
    case 6:
      return {
        title: "Car Horn Relay Control",
        desc: "A low-current horn button energizes a relay coil, and the relay's normally open contact switches power to the higher-current horn load."
      };
    case 7:
      return {
        title: "Normally-On Warning Circuit",
        desc: "A relay's normally closed contact powers an indicator while the coil is off. Energizing the relay opens that path and turns the indicator off."
      };
    case 8:
      return {
        title: "Industrial E-Stop Safety Loop",
        desc: "A normally closed emergency-stop contact sits in series with the motor-control path. Pressing it opens the loop and stops the motor immediately."
      };
    case 9:
      return {
        title: "Secure Office Badge Entry",
        desc: "A valid card energizes an isolation relay. Its NC contact opens, removing power from the fail-safe maglock so the door can be opened."
      };
    case 10:
      return {
        title: "Red/Green Status Control",
        desc: "A three-position momentary switch commands a relay to transfer indication between red and green, with a neutral center position."
      };
    case 11:
      return {
        title: "Grounded Lighting Branch",
        desc: "The switch interrupts the hot conductor, neutral provides the normal return path, and protective earth bonds exposed metal for safety."
      };
    case 12:
      return {
        title: "Machinery Start/Stop Station",
        desc: "START energizes the motor relay, and an auxiliary contact seals the circuit in. STOP opens the control path and drops the relay out."
      };
    case 13:
      return {
        title: "Delayed Ventilation Start",
        desc: "A timer begins when the control switch closes, then energizes the fan after a short delay to sequence equipment safely."
      };
    case 14:
      return {
        title: "Elevator Safety Limit Switch",
        desc: "An NC upper-limit switch opens when the car reaches its safe travel limit, breaking the hoist control circuit and stopping the motor."
      };
    case 15:
      return {
        title: "Reversing Linear Actuator",
        desc: "Two interlocked relay paths reverse DC polarity at the actuator, producing controlled extend and retract movement."
      };
    case 16:
      return {
        title: "Access-Control Power Cabinet",
        desc: "A low-voltage AC transformer feeds an Altronix board, which provides DC power for the card reader, relay, and fail-safe maglock."
      };
    case 17:
      return {
        title: "Relay-Controlled Cabinet Fan",
        desc: "A momentary control switch energizes an isolation relay, whose NO contact powers a separate cooling-fan circuit only while the switch is held."
      };
    case 18:
      return {
        title: "Automatic Parking Gate",
        desc: "A card reader starts the timed OPEN branch. After the vehicle passes, a loop detector starts the timed CLOSE branch to lower the barrier."
      };
    case 19:
      return {
        title: "Smart Parking Barrier",
        desc: "An integrated gate cabinet combines credential entry, vehicle detection, timed relay latches, and separate opening and closing commands."
      };
    case 20:
      return {
        title: "Door Release and Alarm Controller",
        desc: "A DPDT relay coordinates red/green status, a fail-secure lock, and an alarm path selected by momentary release and maintained override switches."
      };
    case 21:
      return {
        title: "Request-to-Exit Door Control",
        desc: "A momentary exit switch releases the fail-safe maglock while held. A maintained service switch keeps the door released for supervised access or maintenance."
      };
    case 22:
      return {
        title: "Motorized Sliding Entrance Gate",
        desc: "Two contactor relays reverse a 24 VDC gate motor, while normally closed OPEN and CLOSE limit switches stop travel at each end."
      };
    case 23:
      return {
        title: "Emergency Pull-Station Release",
        desc: "A normally closed pull station holds the relay energized in normal operation. Pulling it drops the relay, releases the fail-safe lock, and changes status from green to red."
      };
    case 24:
      return {
        title: "Maintained Actuator Control",
        desc: "A maintained key switch controls a cross-wired DPDT relay. The relay reverses polarity to extend or retract a 24 VDC linear actuator."
      };
    default:
      return {
        title: "Industrial Control Circuit",
        desc: "Applying relays, switches, and load logic to safely manage electricity in commercial applications."
      };
  }
};

export const HelpOverlay: React.FC = () => {
  const {
    currentLevelIndex,
    successFeedback,
    simulation,
    components,
    isRunning,
    score,
    recentAchievement,
    dismissAchievement,
    multimeter,
    setMultimeterMode,
    setProbe,
    setProbeMode,
    sidebarOpen,
    bottomPanelOpen,
    toggleBottomPanel,
    useHint,
    shortCircuitPopup,
    dismissShortCircuitPopup
  } = useGameStore();

  const level = levels[currentLevelIndex];
  const multimeterModeLabel =
    multimeter.mode === 'VOLTAGE' ? 'V' :
      multimeter.mode === 'CONTINUITY' ? 'CONT' :
        multimeter.mode === 'RESISTANCE' ? 'OHM' :
          'OFF';

  // Auto-dismiss achievement notifications after 4 seconds
  useEffect(() => {
    if (recentAchievement) {
      const timer = setTimeout(() => {
        dismissAchievement();
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [recentAchievement, dismissAchievement]);

  // Determine current diagnostic message based on electrical solver
  const getDiagnosticMessage = () => {
    if (!isRunning) {
      return {
        title: 'Simulator Inactive',
        detail: 'The electrical simulator is turned OFF. Turn on circuit power to test your wiring paths.',
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
        <div className="fixed bottom-6 right-6 w-80 max-w-[calc(100vw-2rem)] bg-[#0b1018]/96 border border-white/10 rounded-lg p-4 shadow-2xl z-50 pointer-events-auto flex items-start gap-3 animate-fade-in backdrop-blur-xl">
          <div className="w-10 h-10 rounded-md bg-white/[0.06] text-slate-200 border border-white/10 flex items-center justify-center shrink-0">
            <Award className="w-5 h-5" />
          </div>
          <div className="flex-1 min-w-0">
            <span className="text-[9px] font-semibold tracking-wide text-slate-400 uppercase">
              Badge unlocked
            </span>
            <h4 className="text-xs font-semibold text-white mt-0.5">{recentAchievement.title}</h4>
            <p className="text-[10px] text-slate-400 leading-tight mt-1 font-medium">
              {recentAchievement.description}
            </p>
          </div>
          <button
            onClick={dismissAchievement}
            className="text-slate-500 hover:text-white cursor-pointer p-1 rounded hover:bg-white/10 transition-colors"
            title="Dismiss"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* 2. Interactive Diagnostic Console (Panel) */}
      {bottomPanelOpen ? (
      <div className={`fixed bottom-0 left-0 ${sidebarOpen ? 'md:left-[320px]' : 'md:left-0'} right-0 h-44 md:h-40 bg-[#090d14]/94 border-t border-white/10 flex flex-col md:flex-row p-2 md:p-2.5 gap-2 md:gap-3 pointer-events-auto z-10 transition-all duration-300 ease-in-out backdrop-blur-xl shadow-[0_-18px_40px_rgba(0,0,0,0.26)] overflow-y-auto md:overflow-hidden`}>
        <button
          onClick={toggleBottomPanel}
          className="absolute right-2 top-2 z-20 h-7 px-2 rounded border border-white/10 bg-slate-950/80 hover:bg-slate-900 text-[9px] font-bold uppercase text-slate-400 hover:text-white cursor-pointer transition-all flex items-center gap-1"
          title="Hide multimeter and bottom panel"
        >
          Hide
          <ChevronDown className="w-3 h-3" />
        </button>

        {/* Diagnostic Status Box */}
        <div className="hidden xl:flex w-72 border border-white/10 bg-white/[0.035] rounded-md p-3 flex-col gap-2">
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
        <div className="w-full md:w-[360px] xl:w-[390px] h-auto md:h-full border border-white/10 bg-white/[0.035] rounded-md p-2 flex gap-3 select-none shrink-0 overflow-hidden">
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
                    className={`h-[18px] rounded border font-bold cursor-pointer uppercase transition-all flex items-center justify-center whitespace-nowrap px-0.5 text-[7px] tracking-tight ${active
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
                  onClick={() => setProbeMode(multimeter.blackProbe ? null : 'black')}
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
                  onClick={() => setProbeMode(multimeter.redProbe ? null : 'red')}
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

          {/* Dynamic DMM Hints Container */}
          <div className="hidden sm:flex flex-1 flex-col justify-between min-w-0 overflow-hidden py-0.5 select-none">
            <div className="flex items-center justify-between shrink-0">
              <div className="flex items-center gap-1">
                <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wide font-mono">💡 Level Hints</span>
              </div>
              {level.hints && level.hints.length > 0 && (
                <span className="text-[8px] font-mono text-slate-500 font-bold">
                  {Math.min(score.hintsUsed, level.hints.length)}/{level.hints.length}
                </span>
              )}
            </div>
            
            {level.hints && level.hints.length > 0 ? (
              <div className="flex-1 flex flex-col justify-between min-h-0 mt-1">
                {/* Hints text area */}
                <div className="flex-1 overflow-y-auto pr-1 text-[9.5px] leading-relaxed font-semibold text-slate-300 min-h-0 custom-scrollbar mb-1">
                  {score.hintsUsed === 0 ? (
                    <p className="text-slate-500 italic font-medium">Stuck? Click below to reveal step-by-step diagnostic hints.</p>
                  ) : (() => {
                    const activeHintIdx = (score.hintsUsed - 1) % level.hints.length;
                    const hintText = level.hints[activeHintIdx];
                    return (
                      <p className="bg-amber-500/[0.03] border border-amber-500/10 rounded px-2 py-1 text-amber-200/90 font-medium">
                        <span className="text-amber-400 font-bold mr-1">Hint {activeHintIdx + 1}:</span>
                        {hintText}
                      </p>
                    );
                  })()}
                </div>

                {/* Reveal button */}
                <button
                  onClick={useHint}
                  className="w-full py-1 rounded bg-amber-500/10 hover:bg-amber-500/15 border border-amber-500/20 hover:border-amber-500/35 text-amber-400 text-[9px] font-bold uppercase cursor-pointer transition-all flex items-center justify-center gap-1"
                >
                  <span>{score.hintsUsed < level.hints.length ? 'Reveal Hint' : 'Next Hint (Cycle)'}</span>
                  <ChevronRight className="w-3 h-3" />
                </button>
              </div>
            ) : (
              <p className="text-[9.5px] text-slate-500 font-medium mt-1">No hints available for this training module.</p>
            )}
          </div>
        </div>

        {/* Dynamic Hints & Real World Application Panel */}
        <div className="flex-1 border border-white/10 bg-white/[0.035] rounded-md p-2.5 flex flex-col justify-center min-w-0">
          {/* Lower Section: Real-World Application with SVG visual */}
          {(() => {
            const app = getRealWorldApplication(level.id);
            const visualActive = level.id === 21
              ? simulation.energizedComponents.has('lab21_relay')
              : level.id === 22
                ? (components.find(component => component.id === 'sliding_gate_1')?.state.travel || 0) >= 50
                : level.id === 23
                  ? Boolean(components.find(component => component.id === 'pull_station_1')?.state.toggled)
                  : level.id === 24
                    ? (components.find(component => component.id === 'reference_actuator')?.state.travel || 0) >= 50
                    : isRunning;
            return (
              <div className="h-full shrink-0 flex gap-3 text-left items-center justify-between">
                <div className="flex-grow min-w-0 flex flex-col gap-1 justify-center">
                  <div className="flex items-center justify-between text-slate-300">
                    <div className="flex items-center gap-1.5">
                      <Briefcase className="w-3.5 h-3.5" />
                      <span className="text-[10px] font-semibold tracking-wide uppercase">
                        Real-world: {app.title}
                      </span>
                    </div>
                  </div>
                  <p className="text-[10.5px] text-slate-400 leading-normal font-medium overflow-y-auto max-h-[80px] pr-1">
                    {app.desc}
                  </p>
                </div>
                {/* SVG Visual illustration of equivalent application - scaled to 56px */}
                <div className="shrink-0 w-16 h-16 real-world-visual-container bg-black/25 rounded-md border border-white/5 p-1 flex items-center justify-center">
                  <RealWorldVisual levelId={level.id} isActive={visualActive} />
                </div>
              </div>
            );
          })()}
        </div>
      </div>
      ) : (
        <button
          onClick={toggleBottomPanel}
          className={`fixed bottom-3 ${sidebarOpen ? 'left-3 md:left-[332px]' : 'left-3 md:left-10'} z-20 pointer-events-auto h-9 px-3 rounded-md border border-white/10 bg-[#090d14]/94 hover:bg-[#111827] text-slate-300 hover:text-white shadow-lg backdrop-blur-xl text-[10px] font-bold uppercase tracking-wide cursor-pointer transition-all flex items-center gap-2`}
          title="Show multimeter"
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
