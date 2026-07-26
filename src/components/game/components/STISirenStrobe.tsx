import React from 'react';
import type { CircuitComponent } from '../../../types/game';

interface ComponentProps {
  component: CircuitComponent;
}

export const STISirenStrobe: React.FC<ComponentProps> = ({ component }) => {
  const strobeActive = Boolean(component.state.strobeActive);
  const sirenActive = Boolean(component.state.sirenActive);

  return (
    <g className={sirenActive ? 'animate-vibrate' : ''} style={{ transformOrigin: '0px 0px' }}>
      <style>{`
        @keyframes strobe-double-flash {
          0%, 6% { opacity: 1; }
          12%, 18% { opacity: 0; }
          24%, 30% { opacity: 1; }
          36%, 100% { opacity: 0; }
        }
        .strobe-flashing {
          animation: strobe-double-flash 1.0s infinite;
        }
      `}</style>

      {/* Sound waves emitted when siren is active */}
      {sirenActive && (
        <g stroke="#3b82f6" strokeWidth="2.5" fill="none" strokeLinecap="round" className="animate-pulse">
          <circle cx="0" cy="0" r="48" strokeDasharray="12,12" opacity="0.6" />
          <circle cx="0" cy="0" r="60" strokeDasharray="16,16" opacity="0.3" />
        </g>
      )}

      {/* Black round mounting base */}
      <circle cx="0" cy="0" r="36" fill="#1e222b" stroke="#334155" strokeWidth="2" filter="drop-shadow(0 4px 10px rgba(0,0,0,0.4))" />

      {/* Blue strobe lens base */}
      <circle cx="0" cy="0" r="31" fill="url(#blueLensGrad)" stroke="#1d4ed8" strokeWidth="1.5" />

      {/* Concentric rings/ribs inside the lens */}
      <circle cx="0" cy="0" r="27" fill="none" stroke="#60a5fa" strokeWidth="0.8" opacity="0.3" />
      <circle cx="0" cy="0" r="23" fill="none" stroke="#60a5fa" strokeWidth="0.8" opacity="0.3" />
      <circle cx="0" cy="0" r="19" fill="none" stroke="#60a5fa" strokeWidth="0.8" opacity="0.3" />
      <circle cx="0" cy="0" r="15" fill="none" stroke="#60a5fa" strokeWidth="0.8" opacity="0.3" />
      <circle cx="0" cy="0" r="11" fill="none" stroke="#60a5fa" strokeWidth="0.8" opacity="0.3" />
      <circle cx="0" cy="0" r="7" fill="none" stroke="#60a5fa" strokeWidth="0.8" opacity="0.3" />

      {/* Radial ribs around the lens perimeter */}
      {Array.from({ length: 24 }).map((_, i) => {
        const angle = (i * 360) / 24;
        return (
          <line
            key={i}
            x1="0"
            y1="-31"
            x2="0"
            y2="-26"
            stroke="#1d4ed8"
            strokeWidth="1.2"
            transform={`rotate(${angle})`}
            opacity="0.5"
          />
        );
      })}

      {/* Strobe active flashing glow and hotspot */}
      {strobeActive && (
        <g className="strobe-flashing">
          <circle cx="0" cy="0" r="31" fill="url(#strobeActiveGrad)" opacity="0.95" style={{ filter: 'drop-shadow(0 0 16px #60a5fa)' }} />
          <circle cx="0" cy="0" r="14" fill="#ffffff" opacity="0.95" style={{ filter: 'drop-shadow(0 0 8px #ffffff)' }} />
        </g>
      )}

      {/* Labeled base at the bottom for terminals */}
      <rect x="-40" y="30" width="80" height="18" rx="2" fill="#0f172a" stroke="#334155" strokeWidth="1" />

      {/* Screw Terminals */}
      {[
        { x: -30, color: '#ef4444', label: 'RED' },
        { x: -10, color: '#94a3b8', label: 'BLK' },
        { x: 10, color: '#eab308', label: 'YEL' },
        { x: 30, color: '#3b82f6', label: 'BLU' }
      ].map(term => (
        <g key={term.x} transform={`translate(${term.x}, 39)`}>
          <circle cx="0" cy="0" r="4.5" fill="url(#screwGrad)" stroke="#475569" strokeWidth="0.8" />
          <line x1="-2.5" y1="-2.5" x2="2.5" y2="2.5" stroke="#475569" strokeWidth="0.8" />
          <text x="0" y="-8" fill={term.color} fontSize="5.5" fontWeight="900" textAnchor="middle" fontFamily="monospace">
            {term.label}
          </text>
        </g>
      ))}

      {/* Component Nameplate Label below */}
      <text x="0" y="61" fill="#cbd5e1" fontSize="8.5" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">
        {component.label || 'STROBE'}
      </text>

      <defs>
        {/* Blue lens gradient */}
        <radialGradient id="blueLensGrad" cx="35%" cy="35%" r="70%">
          <stop offset="0%" stopColor="#3b82f6" />
          <stop offset="70%" stopColor="#1d4ed8" />
          <stop offset="100%" stopColor="#1e3a8a" />
        </radialGradient>

        {/* Strobe active gradient */}
        <radialGradient id="strobeActiveGrad" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="25%" stopColor="#93c5fd" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
        </radialGradient>

        {/* Screw slot/shading gradient */}
        <linearGradient id="screwGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#94a3b8" />
          <stop offset="50%" stopColor="#cbd5e1" />
          <stop offset="100%" stopColor="#475569" />
        </linearGradient>
      </defs>
    </g>
  );
};
