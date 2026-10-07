import { useState } from 'react';
import { CircuitBoard, Power, RotateCcw, ShieldCheck } from 'lucide-react';
import { ControlPanel } from './ControlPanel';
import { CustomLabSidebar } from './CustomLabSidebar';
import { Workspace } from './Workspace';
import { useGameStore } from '../../store/useGameStore';

/** Dedicated installation workspace; the circuit engine is shared with the electronics bench. */
export default function AccessControlLab() {
  const [controlsOpen, setControlsOpen] = useState(true);
  const loadExample = useGameStore(state => state.loadAccessControllerExample);
  const isRunning = useGameStore(state => state.isRunning);
  const toggleSimulation = useGameStore(state => state.toggleSimulation);
  return <div className="relative flex h-dvh flex-col overflow-hidden bg-[#080b12] font-sans text-slate-200">
    {controlsOpen ? <ControlPanel onHide={() => setControlsOpen(false)} title="Access control lab" subtitle="Readers · REX · door contacts · locks" />
      : <button onClick={() => setControlsOpen(true)} className="absolute right-3 top-2 z-50 rounded-lg border border-white/15 bg-[#101722] px-3 py-2 text-xs">Show controls</button>}
    <div className="flex shrink-0 flex-wrap items-center justify-between gap-3 border-b border-teal-400/15 bg-gradient-to-r from-teal-400/[0.06] to-[#0b111b] px-4 py-3 sm:px-5">
      <div className="flex min-w-0 items-center gap-3">
        <span className="hidden h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-teal-300/20 bg-teal-300/10 text-teal-200 sm:flex"><ShieldCheck size={18} /></span>
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-100"><CircuitBoard size={14} className="text-teal-300" />Access installation bench</div>
          <p className="mt-1 text-[11px] text-slate-400">Select the controller to program it. Scan a card or press REX to test a door.</p>
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <button type="button" onClick={loadExample} className="inline-flex min-h-9 items-center gap-2 rounded-lg border border-white/10 bg-white/[0.025] px-3 text-[11px] font-semibold text-slate-300 transition hover:border-teal-300/30 hover:text-teal-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-300"><RotateCcw size={13} />Load wired AC-2 example</button>
        <button type="button" onClick={toggleSimulation} aria-label={`Turn access simulation power ${isRunning ? 'off' : 'on'}`} aria-pressed={isRunning} className={`inline-flex min-h-9 items-center gap-2 rounded-lg border px-3.5 text-xs font-bold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-200 ${isRunning ? 'border-teal-300/25 bg-teal-300/10 text-teal-200 hover:bg-teal-300/15' : 'border-teal-300 bg-teal-300 text-slate-950 hover:bg-teal-200'}`}><Power size={14} />{isRunning ? 'Simulation running' : 'Start simulation'}</button>
      </div>
    </div>
    <div className="relative flex min-h-0 flex-1 flex-col overflow-hidden md:flex-row">
      <CustomLabSidebar workspaceKind="access" />
      <div className="relative flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden"><Workspace /></div>
    </div>
  </div>;
}
