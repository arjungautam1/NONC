import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { ControlPanel } from './ControlPanel';
import { Workspace } from './Workspace';
import { HelpOverlay } from './HelpOverlay';
import { CustomLabSidebar } from './CustomLabSidebar';

export default function CustomLab() {
  const [controlsOpen, setControlsOpen] = useState(true);

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
