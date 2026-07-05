import React from 'react';
import type { CircuitComponent } from '../../../types/game';

interface ComponentProps {
  component: CircuitComponent;
  isEnergized: boolean;
}

export const Buzzer: React.FC<ComponentProps> = ({ component, isEnergized }) => {
  return (
    <g transform="translate(-40, -35)">
      {/* Sound waves emitted when buzzing */}
      {isEnergized && (
        <g stroke="#f87171" strokeWidth="2.5" fill="none" strokeLinecap="round" className="animate-pulse">
          {/* Left waves */}
          <path d="M-10 15 A25 25 0 0 0 -10 55" />
          <path d="M-18 8 A35 35 0 0 0 -18 62" strokeWidth="1.5" opacity="0.6" />
          {/* Right waves */}
          <path d="M90 15 A25 25 0 0 1 90 55" />
          <path d="M98 8 A35 35 0 0 1 98 62" strokeWidth="1.5" opacity="0.6" />
        </g>
      )}

      {/* Main buzzer structure, which vibrates when energized */}
      <g className={isEnergized ? 'animate-vibrate' : ''} transform-origin="center">
        {/* Mount flanges */}
        <rect x="0" y="45" width="80" height="15" rx="3" fill="#3f3f46" stroke="#27272a" strokeWidth="1.5" />
        <circle cx="10" cy="52" r="3.5" fill="#18181b" />
        <circle cx="70" cy="52" r="3.5" fill="#18181b" />

        {/* Outer speaker cone housing */}
        <path
          d="M15 45 L15 15 L25 15 L32 25 L48 25 L55 15 L65 15 L65 45 Z"
          fill="url(#buzzerBody)"
          stroke="#1e293b"
          strokeWidth="2.5"
          filter="drop-shadow(0 4px 6px rgba(0,0,0,0.3))"
        />

        {/* Metal grille front */}
        <rect x="30" y="25" width="20" height="12" fill="#52525b" stroke="#3f3f46" strokeWidth="1" />
        <line x1="34" y1="25" x2="34" y2="37" stroke="#18181b" strokeWidth="1.5" />
        <line x1="40" y1="25" x2="40" y2="37" stroke="#18181b" strokeWidth="1.5" />
        <line x1="46" y1="25" x2="46" y2="37" stroke="#18181b" strokeWidth="1.5" />
      </g>

      <text x="40" y="80" fill="#cbd5e1" fontSize="10" fontWeight="bold" textAnchor="middle">
        {component.label}
      </text>

      <defs>
        <linearGradient id="buzzerBody" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#4b5563" />
          <stop offset="60%" stopColor="#374151" />
          <stop offset="100%" stopColor="#1f2937" />
        </linearGradient>
      </defs>
    </g>
  );
};
