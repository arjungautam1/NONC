import React from 'react';
import type { CircuitComponent } from '../../../types/game';

interface ComponentProps {
  component: CircuitComponent;
  isEnergized: boolean;
}

export const Bulb: React.FC<ComponentProps> = ({ component, isEnergized }) => {
  return (
    <g transform="translate(-45, -45)">
      {/* Light rays when glowing */}
      {isEnergized && (
        <g opacity="0.8">
          <line x1="45" y1="5" x2="45" y2="15" stroke="#facc15" strokeWidth="3" strokeLinecap="round" />
          <line x1="45" y1="75" x2="45" y2="85" stroke="#facc15" strokeWidth="3" strokeLinecap="round" />
          <line x1="10" y1="40" x2="20" y2="40" stroke="#facc15" strokeWidth="3" strokeLinecap="round" />
          <line x1="70" y1="40" x2="80" y2="40" stroke="#facc15" strokeWidth="3" strokeLinecap="round" />
          
          <line x1="20" y1="15" x2="28" y2="23" stroke="#facc15" strokeWidth="3" strokeLinecap="round" />
          <line x1="62" y1="23" x2="70" y2="15" stroke="#facc15" strokeWidth="3" strokeLinecap="round" />
          <line x1="20" y1="65" x2="28" y2="57" stroke="#facc15" strokeWidth="3" strokeLinecap="round" />
          <line x1="62" y1="57" x2="70" y2="65" stroke="#facc15" strokeWidth="3" strokeLinecap="round" />

          {/* Large circular background glow */}
          <circle cx="45" cy="40" r="30" fill="#facc15" opacity="0.25" className="animate-pulse" />
        </g>
      )}

      {/* Ceramic Screw Base */}
      <rect x="33" y="65" width="24" height="15" fill="#94a3b8" stroke="#475569" strokeWidth="1.5" rx="1" />
      <line x1="33" y1="70" x2="57" y2="70" stroke="#475569" strokeWidth="1.5" />
      <line x1="33" y1="75" x2="57" y2="75" stroke="#475569" strokeWidth="1.5" />
      
      {/* Bottom contact pin */}
      <path d="M39 80 L51 80 L45 84 Z" fill="#334155" />

      {/* Glass bulb sphere */}
      <circle
        cx="45"
        cy="40"
        r="26"
        fill={isEnergized ? '#fef08a' : 'url(#glassGrad)'}
        stroke={isEnergized ? '#facc15' : '#64748b'}
        strokeWidth="3"
        filter={isEnergized ? 'drop-shadow(0 0 10px rgba(250, 204, 21, 0.8))' : 'none'}
      />

      {/* Filament */}
      <path
        d="M35 55 L40 32 L45 37 L50 32 L55 55"
        fill="none"
        stroke={isEnergized ? '#e11d48' : '#475569'}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Reflection highlight on glass */}
      <path
        d="M25 30 A18 18 0 0 1 45 22"
        fill="none"
        stroke="#ffffff"
        strokeWidth="2"
        strokeLinecap="round"
        opacity={isEnergized ? 0.8 : 0.3}
      />

      <text x="45" y="98" fill="#cbd5e1" fontSize="10" fontWeight="bold" textAnchor="middle">
        {component.label}
      </text>

      <defs>
        <radialGradient id="glassGrad" cx="30%" cy="30%" r="70%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.4" />
          <stop offset="70%" stopColor="#e2e8f0" stopOpacity="0.1" />
          <stop offset="100%" stopColor="#94a3b8" stopOpacity="0.2" />
        </radialGradient>
      </defs>
    </g>
  );
};

export const LED: React.FC<ComponentProps> = ({ component, isEnergized }) => {
  return (
    <g transform="translate(-35, -45)">
      {/* Glowing aura */}
      {isEnergized && (
        <circle cx="35" cy="35" r="25" fill="#ef4444" opacity="0.3" className="animate-pulse" />
      )}

      {/* Lead legs */}
      <line x1="25" y1="50" x2="25" y2="70" stroke="#94a3b8" strokeWidth="2.5" />
      <line x1="45" y1="50" x2="45" y2="70" stroke="#94a3b8" strokeWidth="2.5" />

      {/* Flat bottom led rim */}
      <path d="M15 50 L55 50" stroke="#475569" strokeWidth="2.5" strokeLinecap="round" />

      {/* LED epoxy head */}
      <path
        d="M17 50 L17 32 A18 18 0 0 1 53 32 L53 50 Z"
        fill={isEnergized ? '#f87171' : 'url(#ledOffGrad)'}
        stroke={isEnergized ? '#ef4444' : '#64748b'}
        strokeWidth="2.5"
        filter={isEnergized ? 'drop-shadow(0 0 8px rgba(239, 68, 68, 0.8))' : 'none'}
      />

      {/* Reflector cup inside */}
      <path d="M28 45 L32 38 L38 38 L42 45 Z" fill="#cbd5e1" stroke="#94a3b8" strokeWidth="1" />
      
      {/* Diode chip wire */}
      <line x1="33" y1="38" x2="37" y2="35" stroke={isEnergized ? '#ef4444' : '#64748b'} strokeWidth="1.5" />

      <text x="35" y="85" fill="#cbd5e1" fontSize="10" fontWeight="bold" textAnchor="middle">
        {component.label}
      </text>

      <defs>
        <linearGradient id="ledOffGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#fca5a5" stopOpacity="0.2" />
          <stop offset="100%" stopColor="#7f1d1d" stopOpacity="0.4" />
        </linearGradient>
      </defs>
    </g>
  );
};

export const IndicatorLamp: React.FC<ComponentProps> = ({ component, isEnergized }) => {
  const color = component.state.color || 'yellow';
  
  // Dynamic color settings
  let colorGlow = 'rgba(250, 204, 21, 0.8)';
  let colorFillOn = '#fde047';
  let colorFillOff = '#713f12';
  let lensStroke = '#ca8a04';

  if (color === 'red') {
    colorGlow = 'rgba(239, 68, 68, 0.8)';
    colorFillOn = '#f87171';
    colorFillOff = '#7f1d1d';
    lensStroke = '#b91c1c';
  } else if (color === 'green') {
    colorGlow = 'rgba(34, 197, 94, 0.8)';
    colorFillOn = '#4ade80';
    colorFillOff = '#14532d';
    lensStroke = '#15803d';
  }

  return (
    <g transform="translate(-35, -35)">
      {/* Heavy industrial bezel */}
      <rect
        x="0"
        y="0"
        width="70"
        height="70"
        rx="10"
        fill="#27272a"
        stroke="#18181b"
        strokeWidth="2.5"
        filter="drop-shadow(0 4px 6px rgba(0,0,0,0.4))"
      />

      {/* Chrome retaining ring */}
      <circle cx="35" cy="35" r="23" fill="url(#metalRing)" stroke="#71717a" strokeWidth="1.5" />

      {/* Glowing indicator lens */}
      <circle
        cx="35"
        cy="35"
        r="17"
        fill={isEnergized ? colorFillOn : colorFillOff}
        stroke={lensStroke}
        strokeWidth="2.5"
        filter={isEnergized ? `drop-shadow(0 0 10px ${colorGlow})` : 'none'}
      />

      {/* Facet highlights on indicator lens */}
      <path d="M24 28 A13 13 0 0 1 42 22" fill="none" stroke="#ffffff" strokeWidth="2" opacity="0.4" />
      <path d="M28 42 A13 13 0 0 0 46 36" fill="none" stroke="#000000" strokeWidth="1.5" opacity="0.3" />

      {/* Tag name */}
      <rect x="15" y="4" width="40" height="10" fill="#09090b" rx="2" stroke="#3f3f46" strokeWidth="1" />
      <text x="35" y="12" fill="#d4d4d8" fontSize="7" fontWeight="bold" textAnchor="middle" fontFamily="monospace">
        {color.toUpperCase()}
      </text>

      <text x="35" y="85" fill="#cbd5e1" fontSize="10" fontWeight="bold" textAnchor="middle">
        {component.label}
      </text>

      <defs>
        <linearGradient id="metalRing" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#e4e4e7" />
          <stop offset="35%" stopColor="#a1a1aa" />
          <stop offset="50%" stopColor="#f4f4f5" />
          <stop offset="75%" stopColor="#71717a" />
          <stop offset="100%" stopColor="#e4e4e7" />
        </linearGradient>
      </defs>
    </g>
  );
};
