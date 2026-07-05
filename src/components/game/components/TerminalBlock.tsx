import React from 'react';
import type { CircuitComponent } from '../../../types/game';

interface ComponentProps {
  component: CircuitComponent;
}

export const TerminalBlock: React.FC<ComponentProps> = ({ component }) => {
  return (
    <g transform="translate(-40, -40)">
      {/* Base mounting */}
      <rect x="0" y="5" width="80" height="70" rx="4" fill="#1b1e25" stroke="#2d303a" strokeWidth="2.5" />
      <rect x="5" y="1" width="70" height="4" fill="#78829a" opacity="0.6" />
      <rect x="5" y="75" width="70" height="4" fill="#78829a" opacity="0.6" />

      {/* Terminal divisions */}
      {/* Division 1: T1-T2 */}
      <rect x="8" y="10" width="64" height="24" rx="2" fill="#2d303a" stroke="#3c4252" strokeWidth="1.5" />
      <line x1="40" y1="10" x2="40" y2="34" stroke="#1f2028" strokeWidth="1.5" />
      <text x="18" y="24" fill="#a4b0cb" fontSize="7" fontWeight="bold">T1</text>
      <text x="56" y="24" fill="#a4b0cb" fontSize="7" fontWeight="bold">T2</text>
      {/* Metal link bar internally connecting T1 and T2 */}
      <line x1="28" y1="22" x2="52" y2="22" stroke="#fbbf24" strokeWidth="1.5" opacity="0.8" />

      {/* Division 2: T3-T4 */}
      <rect x="8" y="42" width="64" height="24" rx="2" fill="#2d303a" stroke="#3c4252" strokeWidth="1.5" />
      <line x1="40" y1="42" x2="40" y2="66" stroke="#1f2028" strokeWidth="1.5" />
      <text x="18" y="56" fill="#a4b0cb" fontSize="7" fontWeight="bold">T3</text>
      <text x="56" y="56" fill="#a4b0cb" fontSize="7" fontWeight="bold">T4</text>
      {/* Metal link bar internally connecting T3 and T4 */}
      <line x1="28" y1="54" x2="52" y2="54" stroke="#fbbf24" strokeWidth="1.5" opacity="0.8" />

      <text x="40" y="93" fill="#cbd5e1" fontSize="10" fontWeight="bold" textAnchor="middle">
        {component.label}
      </text>
    </g>
  );
};
