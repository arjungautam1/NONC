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
  Gauge,
  Briefcase,
  Download
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
    useHint,
    multimeter,
    setMultimeterMode,
    setProbe,
    setProbeMode,
    sidebarOpen
  } = useGameStore();

  const level = levels[currentLevelIndex];
  const currentHintIndex = score.hintsUsed % level.hints.length;
  const multimeterModeLabel =
    multimeter.mode === 'VOLTAGE' ? 'V' :
      multimeter.mode === 'CONTINUITY' ? 'CONT' :
        multimeter.mode === 'RESISTANCE' ? 'OHM' :
          'OFF';

  const [isDismissed, setIsDismissed] = React.useState(false);

  useEffect(() => {
    setIsDismissed(false);
  }, [currentLevelIndex]);

  const handleDownloadVisual = () => {
    const svgEl = document.querySelector('.real-world-visual-container svg');
    if (!svgEl) return;
    const serializer = new XMLSerializer();
    let source = serializer.serializeToString(svgEl);
    if (!source.match(/^<svg[^>]+xmlns="http:\/\/www\.w3\.org\/2000\/svg"/)) {
      source = source.replace(/^<svg/, '<svg xmlns="http://www.w3.org/2000/svg"');
    }
    if (!source.match(/^<svg[^>]+xmlns:xlink="http:\/\/www\.w3\.org\/1999\/xlink"/)) {
      source = source.replace(/^<svg/, '<svg xmlns:xlink="http://www.w3.org/1999/xlink"');
    }

    // Inject a solid dark background rect as the first element inside <svg ...>
    const svgTagMatch = source.match(/^<svg[^>]*>/);
    if (svgTagMatch) {
      const svgTag = svgTagMatch[0];
      const bgRect = '<rect width="100%" height="100%" fill="#18181b" />';
      const styleNode = '<style>text { font-family: monospace, sans-serif; }</style>';
      source = source.replace(svgTag, `${svgTag}\n${bgRect}\n${styleNode}`);
    }

    source = '<?xml version="1.0" encoding="utf-8"?>\n' + source;
    const url = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(source);
    const link = document.createElement('a');
    link.href = url;
    link.download = `real_world_layout_level_${currentLevelIndex + 1}.svg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

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
      <div className={`fixed bottom-0 left-0 ${sidebarOpen ? 'md:left-[320px]' : 'md:left-0'} right-0 h-44 md:h-40 bg-[#0d1118]/95 border-t border-white/10 flex flex-col md:flex-row p-2 md:p-2.5 gap-2 md:gap-3 pointer-events-auto z-10 transition-all duration-300 ease-in-out backdrop-blur overflow-y-auto md:overflow-hidden`}>

        {/* Diagnostic Status Box */}
        <div className="hidden xl:flex w-72 border border-white/10 bg-white/[0.03] rounded-md p-3 flex-col gap-2">
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
              <span className={`text-xs font-black ${diag.type === 'success' ? 'text-emerald-400' :
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
        <div className="w-full md:w-[360px] xl:w-[390px] h-auto md:h-full border border-white/10 bg-white/[0.03] rounded-md p-2 flex gap-3 select-none shrink-0 overflow-hidden">
          {/* DMM Yellow Housing */}
          <div className="w-[152px] h-full min-h-[122px] bg-[#d6b24a] p-2 rounded-md border border-[#9b7a24] shadow-[inset_0_1px_0_rgba(255,255,255,0.28),0_8px_18px_rgba(0,0,0,0.22)] flex flex-col gap-1.5 shrink-0">
            {/* LCD Screen */}
            <div className="bg-[#d7eadf] border border-[#80651e] px-2 py-1 rounded-sm shadow-inner font-mono text-slate-900">
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
            <div className="grid grid-cols-4 gap-1 text-[7px] font-bold">
              {(['OFF', 'VOLTAGE', 'CONTINUITY', 'RESISTANCE'] as const).map(mode => {
                const label = mode === 'VOLTAGE' ? 'V' : mode === 'CONTINUITY' ? 'CONT' : mode === 'RESISTANCE' ? 'OHM' : 'OFF';
                const active = multimeter.mode === mode;
                return (
                  <button
                    key={mode}
                    onClick={() => setMultimeterMode(mode)}
                    className={`h-6 rounded-sm border font-bold cursor-pointer uppercase transition-all ${active
                        ? 'bg-slate-900 text-white border-slate-700 shadow-inner'
                        : 'bg-[#bd9830] text-slate-950 border-[#8f711f] hover:bg-[#e0bd55]'
                      }`}
                  >
                    {label}
                  </button>
                );
              })}
            </div>

            {/* Probe Attach Buttons */}
            <div className="grid grid-cols-2 gap-1 border-t border-[#9b7a24]/60 pt-1.5">
              <button
                onClick={() => setProbeMode(multimeter.redProbe ? null : 'red')}
                className={`h-7 rounded-sm text-[8px] font-bold uppercase cursor-pointer transition-all flex items-center justify-center gap-1 border ${multimeter.redProbe
                    ? 'bg-red-700 text-white border-red-400'
                    : 'bg-red-500 hover:bg-red-400 text-white border-red-700'
                  }`}
              >
                <span className="w-2 h-2 rounded-full bg-red-200 shadow-inner" />
                {multimeter.redProbe ? 'RED ON' : 'RED'}
              </button>
              <button
                onClick={() => setProbeMode(multimeter.blackProbe ? null : 'black')}
                className={`h-7 rounded-sm text-[8px] font-bold uppercase cursor-pointer transition-all flex items-center justify-center gap-1 border ${multimeter.blackProbe
                    ? 'bg-slate-900 text-white border-slate-400'
                    : 'bg-slate-600 hover:bg-slate-500 text-white border-slate-800'
                  }`}
              >
                <span className="w-2 h-2 rounded-full bg-slate-200 shadow-inner" />
                {multimeter.blackProbe ? 'BLK ON' : 'BLACK'}
              </button>
              {(multimeter.redProbe || multimeter.blackProbe) && (
                <button
                  onClick={() => { setProbe('red', null); setProbe('black', null); }}
                  className="col-span-2 h-5 rounded-sm text-[7px] font-bold uppercase cursor-pointer bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-all"
                >
                  Clear probes
                </button>
              )}
            </div>
          </div>

          {/* DMM Guide Instructions */}
          <div className="hidden sm:flex flex-1 flex-col justify-between min-w-0 overflow-hidden py-0.5">
            <div className="flex items-center gap-1">
              <Gauge className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-[10px] font-semibold text-slate-300 tracking-wide">
                Multimeter
              </span>
            </div>
            <div className="mt-1 grid grid-cols-1 gap-1.5 text-[9px] text-slate-300 font-medium leading-snug">
              <p><b className="text-slate-100">1.</b> Pick V, CONT, or OHM.</p>
              <p><b className="text-red-300">RED</b> and <b className="text-slate-100">BLACK</b> attach to circuit terminals.</p>
              <p>The screen updates once both probes are connected.</p>
            </div>
          </div>
        </div>

        {/* Dynamic Hints & Real World Application Panel */}
        <div className="flex-1 border border-white/10 bg-white/[0.03] rounded-md p-2.5 flex flex-col gap-2 min-w-0">
          {/* Upper Section: Hints */}
          <div className="flex-1 flex flex-col gap-1 min-h-0">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-semibold tracking-wide text-slate-400 uppercase">
                Hints
              </span>
              <span className="text-[9px] font-semibold text-slate-400 bg-black/20 px-1.5 py-0.5 rounded border border-white/10 uppercase">
                Hint {currentHintIndex + 1} of {level.hints.length}
              </span>
            </div>
            
            <div className="flex-grow overflow-y-auto pr-1 min-h-[30px] pt-1">
              <div key={`${currentLevelIndex}-${currentHintIndex}`} className="text-[10px] text-slate-200 leading-normal font-medium animate-fade-in">
                <span className="text-slate-400 font-semibold text-[9px] uppercase tracking-wide">Hint {currentHintIndex + 1}: </span>
                {level.hints[currentHintIndex]}
              </div>
            </div>

            <button
              onClick={() => {
                soundManager.playClick();
                useHint();
              }}
              className="self-end text-[8px] font-semibold text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 px-2 py-0.5 rounded border border-white/10 cursor-pointer transition-colors uppercase tracking-wide"
            >
              NEXT HINT
            </button>
          </div>

          {/* Divider */}
          <div className="border-t border-white/10 my-0.5" />

          {/* Lower Section: Real-World Application with SVG visual */}
          {(() => {
            const app = getRealWorldApplication(level.id);
            return (
              <div className="h-12 shrink-0 flex gap-3 text-left items-center justify-between">
                <div className="flex-grow min-w-0 flex flex-col gap-0.5">
                  <div className="flex items-center justify-between text-slate-300">
                    <div className="flex items-center gap-1.5">
                      <Briefcase className="w-3.5 h-3.5" />
                      <span className="text-[9px] font-semibold tracking-wide uppercase">
                        Real-world: {app.title}
                      </span>
                    </div>
                    {/* Download SVG button */}
                    <button
                      onClick={handleDownloadVisual}
                      className="text-[8px] font-semibold text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 px-2 py-0.5 rounded border border-white/10 cursor-pointer transition-colors uppercase tracking-wide flex items-center gap-1"
                      title="Download Vector SVG Diagram"
                    >
                      <Download className="w-2.5 h-2.5" />
                      <span>SVG</span>
                    </button>
                  </div>
                  <p className="text-[10px] text-slate-400 leading-normal font-medium overflow-y-auto max-h-[32px] pr-1">
                    {app.desc}
                  </p>
                </div>
                {/* SVG Visual illustration of equivalent application - scaled to 56px */}
                <div className="shrink-0 w-11 h-11 real-world-visual-container">
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
          <div className="relative w-[360px] bg-industrial-gray-950/95 border-2 border-emerald-500 rounded-2xl shadow-2xl p-5 flex flex-col items-center text-center animate-fade-in backdrop-blur-md">
            
            {/* Close / Dismiss button */}
            <button
              onClick={() => setIsDismissed(true)}
              className="absolute top-3.5 right-3.5 w-6 h-6 rounded-full flex items-center justify-center text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/40 transition-all cursor-pointer font-bold text-xs"
              title="Dismiss Notification"
            >
              ✕
            </button>

            {/* Success icon */}
            <div className="w-12 h-12 rounded-full bg-emerald-500/20 border-2 border-emerald-500 text-emerald-400 flex items-center justify-center glow-green mb-3">
              <CheckCircle2 className="w-7 h-7" />
            </div>

            <span className="text-[9px] font-extrabold tracking-widest text-emerald-400 uppercase font-mono">
              TRAINING MODULE CLEARED
            </span>
            <h2 className="text-lg font-black text-white mt-0.5 uppercase font-mono">{level.title}</h2>
            <p className="text-[10px] text-zinc-400 mt-1 px-2 leading-normal font-medium">
              Excellent! You have successfully wired this circuit and met all engineering criteria.
            </p>

            {/* Stars evaluation rating */}
            <div className="flex gap-2 my-3">
              {[1, 2, 3].map(num => (
                <Star
                  key={num}
                  className={`w-6 h-6 ${num <= stars
                      ? 'text-yellow-400 fill-yellow-400 drop-shadow(0 0 3px rgba(250,204,21,0.5))'
                      : 'text-zinc-700'
                    }`}
                />
              ))}
            </div>

            {/* Statistics */}
            <div className="grid grid-cols-2 gap-2 w-full border-t border-b border-[#2a2e39]/60 py-2.5 my-1 text-[11px] font-mono">
              <div className="text-left pl-3 border-r border-[#2a2e39]/60">
                <span className="text-[8px] text-zinc-500 block uppercase font-bold">Time Taken:</span>
                <span className="text-white font-extrabold text-sm">{formatTime(timeElapsed)}</span>
              </div>
              <div className="text-left pl-3">
                <span className="text-[8px] text-zinc-500 block uppercase font-bold">Hints Used:</span>
                <span className="text-white font-extrabold text-sm">{score.hintsUsed}</span>
              </div>
            </div>

            {/* Next Level CTA button */}
            <button
              onClick={() => {
                soundManager.playButton();
                nextLevel();
              }}
              className="mt-4 w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-black text-xs tracking-wider flex items-center justify-center gap-2 cursor-pointer transition-all uppercase hover:glow-green"
            >
              <span>Next Training Module</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}


    </div>
  );
};
export default HelpOverlay;
