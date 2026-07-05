import React from 'react';
import type { CircuitComponent } from '../../../types/game';

interface ComponentProps {
  component: CircuitComponent;
  isEnergized: boolean;
}

export const Motor: React.FC<ComponentProps> = ({ component, isEnergized }) => {
  return (
    <g transform="translate(-40, -45)">
      {/* Heavy cast metal mounts */}
      <rect x="0" y="70" width="80" height="12" rx="2" fill="#3f3f46" stroke="#27272a" strokeWidth="1.5" />
      <rect x="15" y="70" width="10" height="12" fill="#18181b" />
      <rect x="55" y="70" width="10" height="12" fill="#18181b" />

      {/* Main cylindrical motor frame */}
      <rect
        x="10"
        y="15"
        width="60"
        height="56"
        rx="6"
        fill="url(#motorFrameGrad)"
        stroke="#27272a"
        strokeWidth="2.5"
        filter="drop-shadow(0 4px 6px rgba(0,0,0,0.3))"
      />

      {/* Cooling fins */}
      <line x1="20" y1="20" x2="20" y2="65" stroke="#18181b" strokeWidth="2.5" />
      <line x1="30" y1="20" x2="30" y2="65" stroke="#18181b" strokeWidth="2.5" />
      <line x1="40" y1="20" x2="40" y2="65" stroke="#18181b" strokeWidth="2.5" />
      <line x1="50" y1="20" x2="50" y2="65" stroke="#18181b" strokeWidth="2.5" />
      <line x1="60" y1="20" x2="60" y2="65" stroke="#18181b" strokeWidth="2.5" />

      {/* Shaft extension */}
      <rect x="35" y="0" width="10" height="16" fill="url(#metalShaft)" stroke="#374151" strokeWidth="1" />

      {/* Rotating Fan Propeller */}
      <g transform="translate(40, 2)">
        <g 
          className={isEnergized ? 'animate-motor-spin' : ''}
        >
          {/* Propeller central hub */}
          <circle cx="0" cy="0" r="5" fill="#e2e8f0" stroke="#475569" strokeWidth="1" />
          
          {/* Fan blades */}
          <path d="M-3 -4 L-15 -18 L3 -18 L0 -4 Z" fill="#94a3b8" stroke="#475569" strokeWidth="1" />
          <path d="M3 4 L15 18 L-3 18 L0 4 Z" fill="#94a3b8" stroke="#475569" strokeWidth="1" />
          <path d="M4 -3 L18 -15 L18 3 L4 0 Z" fill="#94a3b8" stroke="#475569" strokeWidth="1" />
          <path d="M-4 3 L-18 18 L-18 -3 L-4 0 Z" fill="#94a3b8" stroke="#475569" strokeWidth="1" />
        </g>
      </g>

      {/* Electric connection box */}
      <rect x="25" y="40" width="30" height="16" rx="2" fill="#52525b" stroke="#3f3f46" strokeWidth="1.5" />
      <circle cx="33" cy="48" r="2.5" fill="#facc15" />
      <circle cx="47" cy="48" r="2.5" fill="#facc15" />

      {/* Label */}
      <text x="40" y="96" fill="#cbd5e1" fontSize="10" fontWeight="bold" textAnchor="middle">
        {component.label}
      </text>

      <defs>
        <linearGradient id="motorFrameGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#1e3a8a" /> {/* Industrial blue motor */}
          <stop offset="40%" stopColor="#2563eb" />
          <stop offset="100%" stopColor="#172554" />
        </linearGradient>
        <linearGradient id="metalShaft" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#cbd5e1" />
          <stop offset="50%" stopColor="#f1f5f9" />
          <stop offset="100%" stopColor="#64748b" />
        </linearGradient>
      </defs>
    </g>
  );
};
