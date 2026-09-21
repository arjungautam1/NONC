import { ControlPanel } from './ControlPanel';
import { Workspace } from './Workspace';
import { HelpOverlay } from './HelpOverlay';
import { CustomLabSidebar } from './CustomLabSidebar';
import { BetaBanner } from './BetaBanner';

export default function CustomLab() {
  return (
    <div className="flex h-dvh flex-col overflow-hidden bg-[#080b12] font-sans text-slate-200">
      <BetaBanner />
      <ControlPanel />
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
