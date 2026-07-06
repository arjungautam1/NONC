import React from 'react';
import type { CircuitComponent } from '../../../types/game';

interface ComponentProps {
  component: CircuitComponent;
  isEnergized: boolean;
}

export const RolandFan: React.FC<ComponentProps> = ({ component, isEnergized }) => {
  return (
    <g transform="translate(0, 0)">
      <defs>
        <clipPath id="rolandClip">
          <rect x="-55" y="-55" width="110" height="110" rx="8" />
        </clipPath>

        {/* Neon electric blue glow filter */}
        <filter id="neonElectricGlow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="3.5" result="blur" />
          <feComponentTransfer in="blur" result="glow">
            <feFuncA type="linear" slope="2.5" />
          </feComponentTransfer>
          <feMerge>
            <feMergeNode in="glow" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        {/* Quantum core central gradient */}
        <radialGradient id="coreGrad" cx="35%" cy="35%" r="65%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="30%" stopColor="#22d3ee" />
          <stop offset="70%" stopColor="#0891b2" />
          <stop offset="100%" stopColor="#0f172a" />
        </radialGradient>

        {/* Electric lightning bolt gradient */}
        <linearGradient id="lightningGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#e0f2fe" />
          <stop offset="40%" stopColor="#38bdf8" />
          <stop offset="100%" stopColor="#0284c7" />
        </linearGradient>
      </defs>

      {/* Background Frame / Card with Neon border when energized */}
      <rect 
        x="-60" 
        y="-80" 
        width="120" 
        height="160" 
        rx="10" 
        fill="#0f172a" 
        stroke={isEnergized ? '#22d3ee' : '#334155'} 
        strokeWidth="3.5" 
        filter={isEnergized ? 'url(#neonElectricGlow) drop-shadow(0 8px 12px rgba(6,182,212,0.4))' : 'drop-shadow(0 6px 8px rgba(0,0,0,0.4))'}
        className="transition-all duration-300"
      />

      {/* Roland Portrait */}
      <image 
        href="/roland.png" 
        x="-55" 
        y="-55" 
        width="110" 
        height="110" 
        preserveAspectRatio="xMidYMid meet" 
        clipPath="url(#rolandClip)" 
        className={isEnergized ? 'brightness-110 contrast-105 transition-all duration-300' : 'transition-all duration-300'}
      />

      {/* Superhuman Title: Relay Master */}
      <text 
        x="0" 
        y="-88" 
        fill={isEnergized ? '#22d3ee' : '#facc15'} 
        fontSize="9.5" 
        fontWeight="900" 
        textAnchor="middle" 
        filter={isEnergized ? 'url(#neonElectricGlow)' : ''}
        className="font-mono tracking-widest animate-pulse"
      >
        ★ RELAY MASTER ★
      </text>

      {/* Energized Electric Aura (glowing ring around his portrait when energized) */}
      {isEnergized && (
        <circle 
          cx="0" 
          cy="0" 
          r="52" 
          fill="none" 
          stroke="#22d3ee" 
          strokeWidth="1.5" 
          strokeDasharray="4,8"
          opacity="0.8"
          filter="url(#neonElectricGlow)"
          className="animate-spin"
          style={{ animationDuration: '6s' }}
        />
      )}

      {/* Rotating Superhuman Beanie Propeller sitting exactly on the top button of his red cap */}
      <g transform="translate(-1.5, -43)">
        {/* Electric static orbit ring when energized */}
        {isEnergized && (
          <circle 
            cx="0" 
            cy="0" 
            r="24" 
            fill="none" 
            stroke="#38bdf8" 
            strokeWidth="1" 
            strokeDasharray="2,6" 
            opacity="0.6" 
            filter="url(#neonElectricGlow)"
            className="animate-pulse"
          />
        )}

        <g 
          className={isEnergized ? 'animate-motor-spin' : ''}
          style={{ transformOrigin: '0px 0px' }}
        >
          {/* 3 Neon Lightning Bolt blades */}
          <g transform="rotate(0)">
            <path 
              d="M 0 0 L 3 -7 L 9 -7 L 2 -24 L -4 -24 L -1 -13 L -7 -13 Z" 
              fill={isEnergized ? 'url(#lightningGrad)' : '#94a3b8'} 
              stroke={isEnergized ? '#0284c7' : '#475569'} 
              strokeWidth="0.8" 
              filter={isEnergized ? 'url(#neonElectricGlow)' : ''}
            />
          </g>
          
          <g transform="rotate(120)">
            <path 
              d="M 0 0 L 3 -7 L 9 -7 L 2 -24 L -4 -24 L -1 -13 L -7 -13 Z" 
              fill={isEnergized ? 'url(#lightningGrad)' : '#94a3b8'} 
              stroke={isEnergized ? '#0284c7' : '#475569'} 
              strokeWidth="0.8" 
              filter={isEnergized ? 'url(#neonElectricGlow)' : ''}
            />
          </g>

          <g transform="rotate(240)">
            <path 
              d="M 0 0 L 3 -7 L 9 -7 L 2 -24 L -4 -24 L -1 -13 L -7 -13 Z" 
              fill={isEnergized ? 'url(#lightningGrad)' : '#94a3b8'} 
              stroke={isEnergized ? '#0284c7' : '#475569'} 
              strokeWidth="0.8" 
              filter={isEnergized ? 'url(#neonElectricGlow)' : ''}
            />
          </g>

          {/* Central Reactor Power Core */}
          <circle 
            cx="0" 
            cy="0" 
            r="6" 
            fill="url(#coreGrad)" 
            stroke={isEnergized ? '#22d3ee' : '#475569'} 
            strokeWidth="1.2" 
            filter={isEnergized ? 'url(#neonElectricGlow)' : ''}
          />
          <circle cx="0" cy="0" r="2.2" fill="#ffffff" />
        </g>
      </g>

      {/* Connection Terminal Box at bottom */}
      <rect x="-48" y="60" width="96" height="16" rx="3" fill="#0f172a" stroke="#1e293b" strokeWidth="1" />
      
      {/* Terminal labels and hitboxes positions */}
      <text x="-32" y="71" fill="#64748b" fontSize="8" fontWeight="bold" textAnchor="middle">IN</text>
      <text x="32" y="71" fill="#64748b" fontSize="8" fontWeight="bold" textAnchor="middle">OUT</text>

      {/* Component Name Label */}
      <text 
        x="0" 
        y="94" 
        fill="#cbd5e1" 
        fontSize="9.5" 
        fontWeight="bold" 
        textAnchor="middle"
      >
        {component.label}
      </text>
    </g>
  );
};
