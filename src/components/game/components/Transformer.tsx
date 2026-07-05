import React from 'react';
import type { CircuitComponent } from '../../../types/game';

interface TransformerProps {
  component: CircuitComponent;
  isEnergized: boolean;
}

export const Transformer: React.FC<TransformerProps> = ({ component }) => {
  const isActive = component.state.active || false;

  return (
    <g>
      {/* Outer Metal Chassis */}
      <rect
        x="-45"
        y="-35"
        width="90"
        height="70"
        rx="5"
        fill="url(#transf-casing)"
        stroke="#475569"
        strokeWidth="2.5"
        filter="drop-shadow(0 4px 8px rgba(0,0,0,0.4))"
      />

      {/* Cooling Vent Slits */}
      <g stroke="#0f172a" strokeWidth="1.5" opacity="0.8">
        <line x1="-20" y1="-25" x2="-20" y2="25" />
        <line x1="-15" y1="-25" x2="-15" y2="25" />
        <line x1="-10" y1="-25" x2="-10" y2="25" />
        <line x1="10" y1="-25" x2="10" y2="25" />
        <line x1="15" y1="-25" x2="15" y2="25" />
        <line x1="20" y1="-25" x2="20" y2="25" />
      </g>

      {/* Center Spec Plate */}
      <rect x="-26" y="-20" width="52" height="40" rx="2" fill="#0f172a" stroke="#1e293b" strokeWidth="1" />

      {/* Schematic symbol (AC to DC conversion) */}
      <text x="-12" y="-5" fill="#64748b" fontSize="9" fontWeight="bold" textAnchor="middle" fontFamily="monospace">~</text>
      <path d="M -6 -2 L 6 -2" stroke="#475569" strokeWidth="1" strokeLinecap="round" />
      <path d="M 0 -8 L 0 4 L 4 0" fill="none" stroke="#475569" strokeWidth="1" />
      <text x="12" y="-5" fill="#64748b" fontSize="9" fontWeight="bold" textAnchor="middle" fontFamily="monospace">⎓</text>

      {/* Green Power LED */}
      <circle
        cx="0"
        cy="12"
        r="3"
        fill={isActive ? '#22c55e' : '#1e293b'}
        stroke={isActive ? '#4ade80' : '#475569'}
        strokeWidth="0.8"
        className={isActive ? 'animate-pulse' : ''}
        style={{ filter: isActive ? 'drop-shadow(0 0 3px #22c55e)' : 'none' }}
      />
      <text x="0" y="21" textAnchor="middle" fill="#64748b" fontSize="4.5" fontWeight="bold" fontFamily="monospace">
        DC OK
      </text>

      {/* Casing labels for terminals */}
      <g fontSize="5.5" fontWeight="black" fill="#cbd5e1" fontFamily="monospace">
        <text x="-40" y="-12" textAnchor="start">AC (L)</text>
        <text x="-40" y="18" textAnchor="start">AC (N)</text>
        <text x="40" y="-12" textAnchor="end">24V (+)</text>
        <text x="40" y="18" textAnchor="end">GND (-)</text>
      </g>

      {/* Product identification */}
      <text x="0" y="-38" textAnchor="middle" fill="#94a3b8" fontSize="7" fontWeight="black" letterSpacing="0.05em" fontFamily="sans-serif">
        DELMI POWER CONVERTER
      </text>

      {/* Gradients */}
      <defs>
        <linearGradient id="transf-casing" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#334155" />
          <stop offset="30%" stopColor="#1e293b" />
          <stop offset="70%" stopColor="#1e293b" />
          <stop offset="100%" stopColor="#0f172a" />
        </linearGradient>
      </defs>
    </g>
  );
};
