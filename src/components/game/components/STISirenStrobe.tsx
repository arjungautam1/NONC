import React from 'react';
import type { CircuitComponent } from '../../../types/game';

interface ComponentProps {
  component: CircuitComponent;
}

export const STISirenStrobe: React.FC<ComponentProps> = ({ component }) => {
  const strobeActive = Boolean(component.state.strobeActive);
  const sirenActive = Boolean(component.state.sirenActive);
  const isRed = component.state.lensColor === 'red' || component.label?.toLowerCase().includes('red');

  const lensGradId = isRed ? `redLensGrad-${component.id}` : `blueLensGrad-${component.id}`;
  const strobeGradId = isRed ? `strobeActiveGradRed-${component.id}` : `strobeActiveGrad-${component.id}`;
  const screwGradId = `screwGrad-${component.id}`;

  const theme = isRed
    ? {
        lensStroke: '#dc2626',
        ringStroke: '#f87171',
        ribStroke: '#b91c1c',
        glowColor: '#ef4444',
        dropShadow: 'drop-shadow(0 0 18px #ef4444)',
        lensGrad: {
          stop1: '#8f2d2d',
          stop2: '#6f1b1b',
          stop3: '#440f0f'
        },
        strobeGrad: {
          stop2: '#fca5a5',
          stop3: '#ef4444'
        },
        soundWave: '#ef4444'
      }
    : {
        lensStroke: '#1d4ed8',
        ringStroke: '#60a5fa',
        ribStroke: '#1d4ed8',
        glowColor: '#60a5fa',
        dropShadow: 'drop-shadow(0 0 18px #3b82f6)',
        lensGrad: {
          stop1: '#31588f',
          stop2: '#1e3a6f',
          stop3: '#111f46'
        },
        strobeGrad: {
          stop2: '#93c5fd',
          stop3: '#3b82f6'
        },
        soundWave: '#3b82f6'
      };

  return (
    <g style={{ transformOrigin: '0px 0px' }}>

      {/* Black round mounting base */}
      <circle cx="0" cy="0" r="36" fill="#1e222b" stroke="#334155" strokeWidth="2" filter="drop-shadow(0 4px 10px rgba(0,0,0,0.4))" />

      {/* Strobe lens base */}
      <circle cx="0" cy="0" r="31" fill={`url(#${lensGradId})`} stroke={theme.lensStroke} strokeWidth="1.5" />

      {/* Concentric rings/ribs inside the lens */}
      <circle cx="0" cy="0" r="27" fill="none" stroke={theme.ringStroke} strokeWidth="0.8" opacity="0.3" />
      <circle cx="0" cy="0" r="23" fill="none" stroke={theme.ringStroke} strokeWidth="0.8" opacity="0.3" />
      <circle cx="0" cy="0" r="19" fill="none" stroke={theme.ringStroke} strokeWidth="0.8" opacity="0.3" />
      <circle cx="0" cy="0" r="15" fill="none" stroke={theme.ringStroke} strokeWidth="0.8" opacity="0.3" />
      <circle cx="0" cy="0" r="11" fill="none" stroke={theme.ringStroke} strokeWidth="0.8" opacity="0.3" />
      <circle cx="0" cy="0" r="7" fill="none" stroke={theme.ringStroke} strokeWidth="0.8" opacity="0.3" />

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
            stroke={theme.ribStroke}
            strokeWidth="1.2"
            transform={`rotate(${angle})`}
            opacity="0.5"
          />
        );
      })}

      {/* Strobe active flashing glow and hotspot */}
      {strobeActive && (
        <g className="sti-strobe-flashing" pointerEvents="none">
          <circle cx="0" cy="0" r="39" fill={theme.glowColor} opacity="0.25" style={{ filter: 'blur(4px)' }} />
          <circle cx="0" cy="0" r="31" fill={`url(#${strobeGradId})`} style={{ filter: theme.dropShadow }} />
          <circle cx="0" cy="0" r="15" fill="#ffffff" style={{ filter: 'drop-shadow(0 0 10px #ffffff)' }} />
          <circle cx="-5" cy="-6" r="5" fill="#ffffff" />
        </g>
      )}

      {/* Siren active sound wave pulses */}
      {sirenActive && (
        <g className="animate-pulse" pointerEvents="none">
          <path d="M -38 -14 A 40 40 0 0 0 -38 14" fill="none" stroke={theme.soundWave} strokeWidth="2.5" strokeLinecap="round" opacity="0.85" />
          <path d="M 38 -14 A 40 40 0 0 1 38 14" fill="none" stroke={theme.soundWave} strokeWidth="2.5" strokeLinecap="round" opacity="0.85" />
        </g>
      )}

      {/* Labeled base at the bottom for terminals */}
      <rect x="-30" y="30" width="60" height="18" rx="2" fill="#0f172a" stroke="#334155" strokeWidth="1" />

      {/* Screw Terminals (+ and -) */}
      {[-20, 20].map(x => (
        <g key={x} transform={`translate(${x}, 44)`}>
          <circle cx="0" cy="0" r="4.5" fill={`url(#${screwGradId})`} stroke="#475569" strokeWidth="0.8" />
          <line x1="-2.5" y1="-2.5" x2="2.5" y2="2.5" stroke="#475569" strokeWidth="0.8" />
        </g>
      ))}

      {/* Component Nameplate Label below */}
      <text x="0" y="61" fill="#cbd5e1" fontSize="8.5" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">
        {component.label || (isRed ? 'RED STROBE' : 'STROBE')}
      </text>

      <defs>
        {/* Lens gradient */}
        <radialGradient id={lensGradId} cx="35%" cy="35%" r="70%">
          <stop offset="0%" stopColor={theme.lensGrad.stop1} />
          <stop offset="70%" stopColor={theme.lensGrad.stop2} />
          <stop offset="100%" stopColor={theme.lensGrad.stop3} />
        </radialGradient>

        {/* Strobe active gradient */}
        <radialGradient id={strobeGradId} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="25%" stopColor={theme.strobeGrad.stop2} stopOpacity="0.85" />
          <stop offset="100%" stopColor={theme.strobeGrad.stop3} stopOpacity="0" />
        </radialGradient>

        {/* Screw slot/shading gradient */}
        <linearGradient id={screwGradId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#94a3b8" />
          <stop offset="50%" stopColor="#cbd5e1" />
          <stop offset="100%" stopColor="#475569" />
        </linearGradient>
      </defs>
    </g>
  );
};
