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
  Briefcase,
  ChevronRight,
  X
} from 'lucide-react';
import { soundManager } from '../../audio/soundManager';
import { RealWorldVisual } from './components/RealWorldVisual';

const getRealWorldApplication = (levelId: number) => {
  switch (levelId) {
    case 1:
      return {
        title: "Basic Flashlight",
        desc: "A battery supplying continuous current to a bulb through wires, simulating a simple handheld torch."
      };
    case 2:
      return {
        title: "Home Light Switch",
        desc: "A manual switch closing and opening a single hot path to turn a ceiling light bulb on or off."
      };
    case 3:
      return {
        title: "Doorbell System",
        desc: "A Normally Open push button. Pressing it closes the circuit momentarily, sending current to ring the doorbell chime."
      };
    case 4:
      return {
        title: "Refrigerator Door Light",
        desc: "A Normally Closed push button switch. When the door is closed, it pushes the button open, turning off the light to save energy."
      };
    case 5:
      return {
        title: "Low-Voltage Lighting Relay",
        desc: "Using a safe, low-voltage control circuit switch to magnetically close a relay contact, switching high-voltage lights."
      };
    case 6:
      return {
        title: "Car Horn Relay Control",
        desc: "Using a low-current horn button on the steering wheel to energize a relay, closing contacts to power the loud, high-current horn."
      };
    case 7:
      return {
        title: "Security Wire Cut-off Alarm",
        desc: "A Normally Closed circuit. If an intruder cuts the window sensor wire, the relay coil drops, opening the circuit to sound the alarm siren."
      };
    case 8:
      return {
        title: "Industrial E-Stop Safety Loop",
        desc: "A safety emergency-stop button connected in series with a fuse to instantly kill power to the machine if pulled/pressed."
      };
    case 9:
      return {
        title: "Secure Office Badge Entry",
        desc: "An RFID reader. Scanning a valid badge triggers a relay to break power to the magnetic lock (Maglock), letting you open the door."
      };
    case 10:
      return {
        title: "Traffic Light Switcher",
        desc: "A selector switch alternating control signals between red and green road lamps to safely direct traffic lanes."
      };
    case 11:
      return {
        title: "Bathroom GFCI Ground Protection",
        desc: "A grounded electrical outlet. If current leaks to the ground loop, it immediately trips the circuit protection to prevent shock."
      };
    case 12:
      return {
        title: "Machinery Start/Stop Station",
        desc: "A latching control circuit. The START button triggers a relay coil which seals itself ON. The STOP button breaks the latch."
      };
    case 13:
      return {
        title: "HVAC Fan Time-Delay",
        desc: "A time-delay relay. When the heating system switches on, it waits 2 seconds for the furnace to warm up before starting the fan."
      };
    case 14:
      return {
        title: "Elevator Safety Limit Switch",
        desc: "An NC roller limit switch. If the elevator cabin travels too high, it physically pushes the limit switch open, cutting the hoist motor."
      };
    case 15:
      return {
        title: "Automatic Driveway Gate / Car Window",
        desc: "An H-bridge motor reverser. Powering Relay 1 drives the gate open, and powering Relay 2 reverses voltage polarity to drive it closed."
      };
    case 16:
      return {
        title: "Integrated Access Control System",
        desc: "A complete security cabinet stepping down high AC voltage to 12V DC power to safely run card readers and maglocks."
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
    levelCompleted,
    successFeedback,
    simulation,
    isRunning,
    timeElapsed,
    score,
    nextLevel,
    recentAchievement,
    dismissAchievement,
    multimeter,
    setMultimeterMode,
    setProbe,
    setProbeMode,
    sidebarOpen,
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

  const [isDismissed, setIsDismissed] = React.useState(false);

  useEffect(() => {
    setIsDismissed(false);
  }, [currentLevelIndex]);



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
      <div className={`fixed bottom-0 left-0 ${sidebarOpen ? 'md:left-[320px]' : 'md:left-0'} right-0 h-44 md:h-40 bg-[#090d14]/94 border-t border-white/10 flex flex-col md:flex-row p-2 md:p-2.5 gap-2 md:gap-3 pointer-events-auto z-10 transition-all duration-300 ease-in-out backdrop-blur-xl shadow-[0_-18px_40px_rgba(0,0,0,0.26)] overflow-y-auto md:overflow-hidden`}>

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
                  <RealWorldVisual levelId={level.id} isActive={isRunning} />
                </div>
              </div>
            );
          })()}
        </div>
      </div>

      {/* 3. Level Complete Floating Notification Card */}
      {levelCompleted && !isDismissed && (
        <div className="fixed bottom-6 right-6 z-50 pointer-events-auto">
          <div className="relative w-[360px] max-w-[calc(100vw-2rem)] bg-[#0b1018]/96 border border-white/10 rounded-lg shadow-2xl p-5 flex flex-col items-center text-center animate-fade-in backdrop-blur-xl">
            
            {/* Close / Dismiss button */}
            <button
              onClick={() => setIsDismissed(true)}
              className="absolute top-3 right-3 p-1 rounded-md flex items-center justify-center text-slate-500 hover:text-white hover:bg-white/10 transition-all cursor-pointer"
              title="Dismiss Notification"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Success icon */}
            <div className="w-12 h-12 rounded-md bg-emerald-500/10 border border-emerald-500/25 text-emerald-300 flex items-center justify-center mb-3">
              <CheckCircle2 className="w-7 h-7" />
            </div>

            <span className="text-[9px] font-semibold tracking-wide text-emerald-300 uppercase">
              Module complete
            </span>
            <h2 className="text-lg font-semibold text-white mt-0.5">{level.title}</h2>
            <p className="text-[10px] text-slate-400 mt-1 px-2 leading-normal font-medium">
              Circuit verified. Your wiring meets the module criteria.
            </p>

            {/* Stars evaluation rating */}
            <div className="flex gap-2 my-3">
              {[1, 2, 3].map(num => (
                <Star
                  key={num}
                  className={`w-6 h-6 ${num <= stars
                      ? 'text-slate-100 fill-slate-100'
                      : 'text-zinc-700'
                    }`}
                />
              ))}
            </div>

            {/* Statistics */}
            <div className="grid grid-cols-2 gap-2 w-full border-t border-b border-white/10 py-2.5 my-1 text-[11px]">
              <div className="text-left pl-3 border-r border-white/10">
                <span className="text-[8px] text-slate-500 block uppercase font-semibold tracking-wide">Time</span>
                <span className="text-white font-semibold text-sm">{formatTime(timeElapsed)}</span>
              </div>
              <div className="text-left pl-3">
                <span className="text-[8px] text-slate-500 block uppercase font-semibold tracking-wide">Hints</span>
                <span className="text-white font-semibold text-sm">{score.hintsUsed}</span>
              </div>
            </div>

            {/* Next Level CTA button */}
            <button
              onClick={() => {
                soundManager.playButton();
                nextLevel();
              }}
              className="mt-4 w-full py-2.5 bg-white text-slate-950 hover:bg-slate-200 rounded-md font-semibold text-xs tracking-wide flex items-center justify-center gap-2 cursor-pointer transition-all uppercase"
            >
              <span>Next Training Module</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
      {/* 4. Funny Short Circuit Modal Pop-up */}
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
