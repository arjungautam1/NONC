import React from 'react';
import type { CircuitComponent } from '../../../types/game';

interface ACSourceProps {
  component: CircuitComponent;
}

export const ACSource: React.FC<ACSourceProps> = ({ component: _component }) => {
  return (
    <g>
      {/* Outlet Faceplate */}
      <rect
        x="-30"
        y="-30"
        width="60"
        height="60"
        rx="6"
        fill="#2d3748"
        stroke="#4a5568"
        strokeWidth="2.5"
        filter="drop-shadow(0 3px 6px rgba(0,0,0,0.35))"
      />

      {/* Main socket outline */}
      <rect x="-18" y="-18" width="36" height="36" rx="18" fill="#1a202c" stroke="#2d3748" strokeWidth="1.5" />

      {/* Screw Terminals L & N */}
      <g transform="translate(0, 10)">
        {/* Line Terminal (L) */}
        <circle cx="-15" cy="0" r="4.5" fill="#475569" stroke="#94a3b8" strokeWidth="1" />
        <circle cx="-15" cy="0" r="1.5" fill="#1e293b" />
        <text x="-15" y="-8" textAnchor="middle" fill="#ef4444" fontSize="5.5" fontWeight="bold" fontFamily="monospace">L (AC)</text>

        {/* Neutral Terminal (N) */}
        <circle cx="15" cy="0" r="4.5" fill="#475569" stroke="#94a3b8" strokeWidth="1" />
        <circle cx="15" cy="0" r="1.5" fill="#1e293b" />
        <text x="15" y="-8" textAnchor="middle" fill="#60a5fa" fontSize="5.5" fontWeight="bold" fontFamily="monospace">N (AC)</text>
      </g>

      {/* High-Voltage Flash warning icon */}
      <path
        d="M 0 -14 L 3 -7 L -2 -7 L 1 0 L -2 0 L 0 5 L -1 0 L 2 0 L -1 -7 L 2 -7 Z"
        fill="#facc15"
        opacity="0.85"
      />

      {/* Casing Label */}
      <text x="0" y="24" textAnchor="middle" fill="#cbd5e1" fontSize="6.5" fontWeight="bold" fontFamily="monospace">
        120VAC MAINS
      </text>
    </g>
  );
};
