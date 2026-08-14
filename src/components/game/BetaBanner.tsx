import React from 'react';
import { FlaskConical } from 'lucide-react';

/**
 * Sitewide notice that the simulator is pre-release. Shown above both the
 * dashboard and the lab so it is the first thing read on any screen.
 */
export const BetaBanner: React.FC = () => (
  <div
    role="status"
    className="relative z-50 shrink-0 flex items-center justify-center gap-2 px-4 py-1.5 text-center border-b border-amber-400/25 bg-amber-400/[0.08] backdrop-blur-sm"
  >
    <FlaskConical className="h-3.5 w-3.5 shrink-0 text-amber-400" />
    <p className="min-w-0 max-w-5xl text-[11px] font-semibold leading-tight text-amber-200/90">
      <span className="font-black uppercase tracking-widest text-amber-400">Beta</span>
      <span className="mx-1.5 text-amber-400/40">·</span>
      This simulator is still in development and can make mistakes. Always verify against the
      manufacturer&apos;s documentation before wiring real equipment.
    </p>
  </div>
);

export default BetaBanner;
