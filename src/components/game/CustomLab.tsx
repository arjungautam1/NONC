import { useState } from 'react';
import { ChevronDown, Lock, ArrowLeft, KeyRound, ArrowRight } from 'lucide-react';
import { ControlPanel } from './ControlPanel';
import { Workspace } from './Workspace';
import { HelpOverlay } from './HelpOverlay';
import { CustomLabSidebar } from './CustomLabSidebar';
import { useGameStore } from '../../store/useGameStore';
import { isLabUnlocked, verifyCode } from '../../utils/betaAuth';
import { soundManager } from '../../audio/soundManager';

export default function CustomLab() {
  const [controlsOpen, setControlsOpen] = useState(true);
  const [unlocked, setUnlocked] = useState(() => isLabUnlocked());
  const [code, setCode] = useState('');
  const [codeError, setCodeError] = useState<string | null>(null);
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
        <div className="w-full max-w-md rounded-2xl border border-sky-500/30 bg-[#0d1522] p-6 shadow-2xl sm:p-8">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-sky-400/30 bg-sky-400/10 text-sky-300">
              <Lock size={24} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="rounded bg-sky-400/15 px-2 py-0.5 text-[10px] font-mono font-bold tracking-wider text-sky-400 border border-sky-400/30">
                  ELECTRONICS BENCH
                </span>
              </div>
              <h1 className="mt-1 text-xl font-bold text-white">Electronics Lab</h1>
            </div>
          </div>

          <p className="mt-4 text-xs leading-relaxed text-slate-300">
            Please enter your access code to open the lab.
          </p>

          <form onSubmit={handleUnlock} className="mt-6 space-y-4">
            <div>
              <label htmlFor="custom-lab-code" className="block text-xs font-semibold text-slate-300 mb-1.5">
                Access Code
              </label>
              <div className="relative">
                <KeyRound size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  id="custom-lab-code"
                  type="password"
                  value={code}
                  onChange={(e) => {
                    setCode(e.target.value);
                    if (codeError) setCodeError(null);
                  }}
                  autoFocus
                  placeholder="Enter access code"
                  className="w-full rounded-xl border border-white/15 bg-white/[0.05] py-2.5 pl-10 pr-4 font-mono text-sm tracking-wider text-white placeholder:text-slate-500 placeholder:tracking-normal focus:border-sky-400 focus:bg-white/[0.08] focus:outline-none"
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
                className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-sky-400 px-5 text-xs font-bold text-slate-950 shadow-[0_4px_20px_-5px_rgba(56,189,248,0.5)] transition hover:bg-sky-300 active:translate-y-0.5"
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
        <ControlPanel onHide={() => setControlsOpen(false)} />
      ) : (
        <button
          type="button"
          onClick={() => setControlsOpen(true)}
          className="absolute right-3 top-2 z-50 flex h-9 items-center gap-1.5 rounded-lg border border-white/15 bg-[#101722]/95 px-3 text-xs font-semibold text-slate-200 shadow-lg backdrop-blur hover:bg-[#182231] hover:text-white"
          title="Show top controls"
          aria-label="Show top controls"
        >
          <ChevronDown className="h-4 w-4" /> Show controls
        </button>
      )}
      <div className="relative flex min-h-0 flex-1 flex-col overflow-hidden md:flex-row">
        <CustomLabSidebar />
        <div className="relative flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
          <Workspace />
          <HelpOverlay />
        </div>
      </div>
    </div>
  );
}
