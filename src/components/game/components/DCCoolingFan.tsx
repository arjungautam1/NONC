import React from 'react';
import type { CircuitComponent } from '../../../types/game';

interface ComponentProps {
  component: CircuitComponent;
  isEnergized: boolean;
}

export const DCCoolingFan: React.FC<ComponentProps> = ({ component, isEnergized }) => {
  return (
    <g transform="translate(0, 0)">
      <style>{`
        @keyframes dcfan-spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .dcfan-blades-spinning {
          animation: dcfan-spin 0.35s linear infinite;
        }
      `}</style>

      {/* Outer Square Plastic Housing */}
      <rect x="-40" y="-40" width="80" height="80" rx="5" fill="#1e222b" stroke="#0f172a" strokeWidth="2.5" filter="drop-shadow(0 4px 8px rgba(0,0,0,0.4))" />

      {/* Shroud / Corner structural cutouts */}
      <circle cx="-33" cy="-33" r="3.2" fill="#0f172a" />
      <circle cx="33" cy="-33" r="3.2" fill="#0f172a" />
      <circle cx="-33" cy="33" r="3.2" fill="#0f172a" />
      <circle cx="33" cy="33" r="3.2" fill="#0f172a" />

      {/* Frame inner circular shroud */}
      <circle cx="0" cy="0" r="34" fill="#0f172a" stroke="#334155" strokeWidth="1.5" />

      {/* Rotor & Blades group (animates spin) */}
      <g className={isEnergized ? 'dcfan-blades-spinning' : ''} style={{ transformOrigin: '0px 0px' }}>
        {/* 7 curved impeller blades */}
        {Array.from({ length: 7 }).map((_, i) => {
          const angle = (i * 360) / 7;
          return (
            <path
              key={i}
              d="M 0 0 C 8 -10, 22 -22, 10 -28 C 0 -30, -5 -15, 0 0"
              fill="#2e3545"
              stroke="#0f172a"
              strokeWidth="0.8"
              transform={`rotate(${angle})`}
            />
          );
        })}
        {/* Hub centerpiece */}
        <circle cx="0" cy="0" r="11" fill="#1e222b" stroke="#334155" strokeWidth="1" />
        <circle cx="0" cy="0" r="4" fill="#2e3545" />
      </g>

      {/* Stationary fan struts (behind/in front of the blades) */}
      <line x1="-34" y1="0" x2="-11" y2="0" stroke="#1e222b" strokeWidth="2.5" opacity="0.6" />
      <line x1="34" y1="0" x2="11" y2="0" stroke="#1e222b" strokeWidth="2.5" opacity="0.6" />
      <line x1="0" y1="-34" x2="0" y2="-11" stroke="#1e222b" strokeWidth="2.5" opacity="0.6" />

      {/* Labeled screw terminal connections at the bottom */}
      {[
        { id: 'pos', x: -20, label: '+', color: '#ef4444' },
        { id: 'neg', x: 20, label: '-', color: '#94a3b8' }
      ].map(term => (
        <g key={term.id} transform={`translate(${term.x}, 40)`}>
          {/* Metal bracket tab */}
          <rect x="-8" y="-4" width="16" height="8" rx="1.5" fill="#334155" stroke="#1e293b" strokeWidth="0.8" />
          {/* Terminal Screw */}
          <circle cx="0" cy="0" r="3" fill="url(#fanScrewGrad)" stroke="#111827" strokeWidth="0.6" />
          <line x1="-1.8" y1="-1.8" x2="1.8" y2="1.8" stroke="#111827" strokeWidth="0.6" />
          {/* Label sign */}
          <text x="0" y="11" fill={term.color} fontSize="7.5" fontWeight="900" textAnchor="middle" fontFamily="sans-serif">
            {term.label}
          </text>
        </g>
      ))}

      {/* Unit label identifier */}
      <text x="0" y="-45" fill="#cbd5e1" fontSize="9.5" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">
        {component.label || 'DC Fan'}
      </text>

      <defs>
        {/* Screw grading */}
        <linearGradient id="fanScrewGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#94a3b8" />
          <stop offset="50%" stopColor="#cbd5e1" />
          <stop offset="100%" stopColor="#475569" />
        </linearGradient>
      </defs>
    </g>
  );
};
