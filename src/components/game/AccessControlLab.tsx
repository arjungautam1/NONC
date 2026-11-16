import { useState } from 'react';
import { CircuitBoard, Power, RotateCcw, ShieldCheck, Lock, ArrowLeft, KeyRound, ArrowRight } from 'lucide-react';
import { ControlPanel } from './ControlPanel';
import { CustomLabSidebar } from './CustomLabSidebar';
import { Workspace } from './Workspace';
import { useGameStore } from '../../store/useGameStore';
import { isLabUnlocked, verifyCode } from '../../utils/betaAuth';
import { soundManager } from '../../audio/soundManager';

/** Dedicated installation workspace; the circuit engine is shared with the electronics bench. */
export default function AccessControlLab() {
  const [controlsOpen, setControlsOpen] = useState(true);
  const [unlocked, setUnlocked] = useState(() => isLabUnlocked());
  const [code, setCode] = useState('');
  const [codeError, setCodeError] = useState<string | null>(null);

  const loadExample = useGameStore(state => state.loadAccessControllerExample);
  const isRunning = useGameStore(state => state.isRunning);
  const toggleSimulation = useGameStore(state => state.toggleSimulation);
  const setViewMode = useGameStore(state => state.setViewMode);

  if (!unlocked) {
    const handleUnlock = (e: React.FormEvent) => {
      e.preventDefault();
      if (verifyCode(code)) {
        soundManager.playSuccess();
        setCodeError(null);
        setUnlocked(true);
      } else {
        soundManager.playFailure();
        setCodeError('Incorrect access code. Please try again.');
      }
    };

    return (
      <div className="flex min-h-screen items-center justify-center bg-[#080b12] p-4 font-sans text-slate-200">
        <div className="w-full max-w-md rounded-2xl border border-teal-500/30 bg-[#0d1522] p-6 shadow-2xl sm:p-8">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-teal-400/30 bg-teal-400/10 text-teal-300">
              <Lock size={24} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="rounded bg-amber-400/15 px-2 py-0.5 text-[10px] font-mono font-bold tracking-wider text-amber-400 border border-amber-400/30">
                  BETA ONLY
                </span>
              </div>
              <h1 className="mt-1 text-xl font-bold text-white">Access Control Lab</h1>
            </div>
          </div>

          <p className="mt-4 text-xs leading-relaxed text-slate-300">
            Please enter your access code to open the lab.
          </p>

          <form onSubmit={handleUnlock} className="mt-6 space-y-4">
            <div>
              <label htmlFor="gate-code" className="block text-xs font-semibold text-slate-300 mb-1.5">
                Access Code
              </label>
              <div className="relative">
                <KeyRound size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  id="gate-code"
                  type="password"
                  value={code}
                  onChange={(e) => {
                    setCode(e.target.value);
                    if (codeError) setCodeError(null);
                  }}
                  autoFocus
                  placeholder="Enter access code"
                  className="w-full rounded-xl border border-white/15 bg-white/[0.05] py-2.5 pl-10 pr-4 font-mono text-sm tracking-wider text-white placeholder:text-slate-500 placeholder:tracking-normal focus:border-teal-400 focus:bg-white/[0.08] focus:outline-none"
                />
              </div>
              {codeError && (
                <p className="mt-2 text-xs text-rose-400 font-medium">
                  {codeError}
                </p>
              )}
            </div>

            <div className="mt-6 flex items-center justify-between gap-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  soundManager.playButton();
                  setViewMode('home');
                }}
                className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition"
              >
                <ArrowLeft size={14} />
                <span>Back to Home</span>
              </button>
              <button
                type="submit"
                className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-teal-400 px-5 text-xs font-bold text-slate-950 shadow-[0_4px_20px_-5px_rgba(45,212,191,0.5)] transition hover:bg-teal-300 active:translate-y-0.5"
              >
                <span>Enter Lab</span>
                <ArrowRight size={14} />
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex h-dvh flex-col overflow-hidden bg-[#080b12] font-sans text-slate-200">
      {controlsOpen ? (
        <ControlPanel
          onHide={() => setControlsOpen(false)}
          title="Access Control Lab (Beta)"
          subtitle="Readers · REX · door contacts · locks"
        />
      ) : (
        <button
          onClick={() => setControlsOpen(true)}
          className="absolute right-3 top-2 z-50 rounded-lg border border-white/15 bg-[#101722] px-3 py-2 text-xs"
        >
          Show controls
        </button>
      )}
      <div className="flex shrink-0 flex-wrap items-center justify-between gap-3 border-b border-teal-400/15 bg-gradient-to-r from-teal-400/[0.06] to-[#0b111b] px-4 py-3 sm:px-5">
        <div className="flex min-w-0 items-center gap-3">
          <span className="hidden h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-teal-300/20 bg-teal-300/10 text-teal-200 sm:flex">
            <ShieldCheck size={18} />
          </span>
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-100">
              <CircuitBoard size={14} className="text-teal-300" />
              <span>Access installation bench</span>
              <span className="rounded bg-amber-400/15 px-2 py-0.5 text-[10px] font-mono font-bold uppercase tracking-wider text-amber-400 border border-amber-400/30">
                Beta
              </span>
            </div>
            <p className="mt-1 text-[11px] text-slate-400">
              Select the controller to program it. Scan a card or press REX to test a door.
            </p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={loadExample}
            className="inline-flex min-h-9 items-center gap-2 rounded-lg border border-white/10 bg-white/[0.025] px-3 text-[11px] font-semibold text-slate-300 transition hover:border-teal-300/30 hover:text-teal-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-300"
          >
            <RotateCcw size={13} />
            <span>Load wired AC-2 example</span>
          </button>
          <button
            type="button"
            onClick={toggleSimulation}
            aria-label={`Turn access simulation power ${isRunning ? 'off' : 'on'}`}
            aria-pressed={isRunning}
            className={`inline-flex min-h-9 items-center gap-2 rounded-lg border px-3.5 text-xs font-bold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-200 ${
              isRunning
                ? 'border-teal-300/25 bg-teal-300/10 text-teal-200 hover:bg-teal-300/15'
                : 'border-teal-300 bg-teal-300 text-slate-950 hover:bg-teal-200'
            }`}
          >
            <Power size={14} />
            <span>{isRunning ? 'Simulation running' : 'Start simulation'}</span>
          </button>
        </div>
      </div>
      <div className="relative flex min-h-0 flex-1 flex-col overflow-hidden md:flex-row">
        <CustomLabSidebar workspaceKind="access" />
        <div className="relative flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
          <Workspace />
        </div>
      </div>
    </div>
  );
}
