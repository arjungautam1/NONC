import { useState } from 'react';
import { ControlPanel } from './ControlPanel';
import { CustomLabSidebar } from './CustomLabSidebar';
import { Workspace } from './Workspace';
import { useGameStore } from '../../store/useGameStore';

/** Dedicated installation workspace; the circuit engine is shared with the electronics bench. */
export default function AccessControlLab() {
  const [controlsOpen, setControlsOpen] = useState(true);
  const loadExample = useGameStore(state => state.loadAccessControllerExample);
  return <div className="relative flex h-dvh flex-col overflow-hidden bg-[#080b12] font-sans text-slate-200">
    {controlsOpen ? <ControlPanel onHide={() => setControlsOpen(false)} title="Access control lab" subtitle="Readers · REX · door contacts · locks" />
      : <button onClick={() => setControlsOpen(true)} className="absolute right-3 top-2 z-50 rounded-lg border border-white/15 bg-[#101722] px-3 py-2 text-xs">Show controls</button>}
    <div className="flex shrink-0 flex-wrap items-center justify-between gap-2 border-b border-teal-400/15 bg-teal-400/[0.05] px-4 py-2 text-xs">
      <span className="text-teal-200">Access installation bench <span className="ml-2 text-slate-400">Select the board for programming. Turn on power, then scan a reader or press REX.</span></span>
      <button onClick={loadExample} className="rounded-lg border border-teal-400/25 px-3 py-1.5 font-semibold text-teal-200 hover:bg-teal-400/10">Load wired AC-2 example</button>
    </div>
    <div className="relative flex min-h-0 flex-1 flex-col overflow-hidden md:flex-row">
      <CustomLabSidebar workspaceKind="access" />
      <div className="relative flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden"><Workspace /></div>
    </div>
  </div>;
}
