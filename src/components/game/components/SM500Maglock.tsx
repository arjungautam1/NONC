import React from 'react';
import type { CircuitComponent } from '../../../types/game';
import { SM500_PINS } from './sm500Pinout';

interface SM500MaglockProps {
  component: CircuitComponent;
  isEnergized: boolean;
}

/**
 * CDVI SM500 — 500kg (1,100 lb) surface-mount maglock. Fail-safe only (locks
 * while powered, releases on power loss — no failSecure option on this
 * product). The built-in PCB's holding-force sensor is a dry contact that
 * reports NO when the lock is closed and driven at full force, NC at rest.
 */
export const SM500Maglock: React.FC<SM500MaglockProps> = ({ component, isEnergized }) => {
  const isLocked = isEnergized;

  return (
    <g className="select-none">
      <defs>
        <linearGradient id="sm500-body" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#eef1f4" />
          <stop offset="22%" stopColor="#c7ccd3" />
          <stop offset="50%" stopColor="#9aa0a8" />
          <stop offset="78%" stopColor="#c7ccd3" />
          <stop offset="100%" stopColor="#eef1f4" />
        </linearGradient>
        <linearGradient id="sm500-slat" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#3a3f47" />
          <stop offset="45%" stopColor="#828a94" />
          <stop offset="55%" stopColor="#828a94" />
          <stop offset="100%" stopColor="#3a3f47" />
        </linearGradient>
        <radialGradient id="sm500-screw" cx="35%" cy="30%" r="75%">
          <stop offset="0%" stopColor="#f8fafc" />
          <stop offset="55%" stopColor="#a8b1bb" />
          <stop offset="100%" stopColor="#5b6373" />
        </radialGradient>
      </defs>

      {/* ---- Outboard vertical terminal strip, wired via a short lead run to the body ---- */}
      <rect x="-58" y="-54" width="24" height="108" rx="1.5" fill="#181b20" stroke="#3a4048" strokeWidth="0.8" />
      {SM500_PINS.map(({ id, label, y }) => (
        <g key={id}>
          <rect x="-58" y={y - 9} width="24" height="18" rx="1" fill="#1f242b" stroke="#454c56" strokeWidth="0.5" />
          <rect x="-54.5" y={y - 6} width="17" height="12" rx="0.8" fill="#8f97a6" />
          <circle cx="-46" cy={y} r="5" fill="#c3cad6" stroke="#5b6373" strokeWidth="0.6" />
          <path d={`M -49.5 ${y} L -42.5 ${y}`} stroke="#4a5262" strokeWidth="1.4" strokeLinecap="round" />
          <path d={`M -46 ${y - 3.5} L -46 ${y + 3.5}`} stroke="#4a5262" strokeWidth="1.4" strokeLinecap="round" />
          <text x="-63" y={y + 2.4} fill="#e2e8f0" fontSize="6.4" fontWeight="800" fontFamily="sans-serif" textAnchor="end">
            {label}
          </text>
          <path d={`M -34 ${y} H -20`} stroke="#5b6373" strokeWidth="1" strokeDasharray="2,1.5" opacity="0.55" />
        </g>
      ))}

      {/* ---- Brushed-aluminum maglock body ---- */}
      <rect x="-20" y="-82" width="44" height="164" rx="4" fill="url(#sm500-body)" stroke="#6b7280" strokeWidth="1" filter="drop-shadow(2px 4px 8px rgba(0,0,0,0.45))" />
      {/* Left edge bevel seam, as seen on the real extrusion. */}
      <line x1="-13" y1="-80" x2="-13" y2="80" stroke="#6b7280" strokeWidth="0.6" opacity="0.6" />

      {/* Top mounting cap */}
      <circle cx="2" cy="-70" r="4.2" fill="url(#sm500-screw)" stroke="#4b5563" strokeWidth="0.6" />
      <line x1="-0.5" y1="-70" x2="4.5" y2="-70" stroke="#334155" strokeWidth="0.8" />

      {/* Faint CDVI diamond watermark, matching the embossed logo on the cap. */}
      <g transform="translate(2, -56)" opacity="0.28" stroke="#475569" strokeWidth="0.9" fill="none">
        <path d="M 0 -6 L 6 0 L 0 6 L -6 0 Z" />
        <path d="M -3.2 0 L 3.2 0" />
      </g>

      {/* Divider band between the cap and the magnet body. */}
      <rect x="-20" y="-46" width="44" height="5" fill="#111318" />

      {/* Holding-force sensor LED, only lit once the lock is driven and closed. */}
      <circle cx="2" cy="-43.5" r="1.7" fill={isLocked ? '#22c55e' : '#3f3f46'} style={{ filter: isLocked ? 'drop-shadow(0 0 2.5px #22c55e)' : 'none' }} />

      {/* Three-slat magnet core, recessed in a dark housing panel. */}
      <rect x="-16" y="-40" width="36" height="112" rx="1.5" fill="#0d0f13" />
      {[-11, 2, 15].map(slatX => (
        <rect key={slatX} x={slatX - 4.5} y="-36" width="9" height="104" rx="1" fill="url(#sm500-slat)" />
      ))}

      {/* Bottom mounting cap */}
      <circle cx="2" cy="74" r="4.2" fill="url(#sm500-screw)" stroke="#4b5563" strokeWidth="0.6" />
      <line x1="-0.5" y1="74" x2="4.5" y2="74" stroke="#334155" strokeWidth="0.8" />

      {/* Lock-state pill */}
      <g transform="translate(2, -96)" pointerEvents="none">
        <rect x="-24" y="-8" width="48" height="14" rx="4" fill={isLocked ? '#14532d' : '#3f3f46'} stroke={isLocked ? '#22c55e' : '#6b7280'} strokeWidth="0.8" />
        <text x="0" y="2" fill={isLocked ? '#86efac' : '#d1d5db'} fontSize="6" fontWeight="800" fontFamily="monospace" textAnchor="middle" letterSpacing="0.3">
          {isLocked ? 'LOCKED' : 'UNLOCKED'}
        </text>
      </g>

      <g transform="translate(2, 96)" pointerEvents="none">
        <rect x="-45" y="-9" width="90" height="18" rx="5" fill="#070b13" fillOpacity="0.96" stroke="#334155" strokeWidth="1" />
        <text
          x="0"
          y="3"
          fill="#f1f5f9"
          fontSize={component.label.length > 16 ? 7.2 : 8.5}
          fontWeight="800"
          textAnchor="middle"
          fontFamily="monospace"
        >
          {component.label}
        </text>
      </g>
    </g>
  );
};

export default SM500Maglock;
