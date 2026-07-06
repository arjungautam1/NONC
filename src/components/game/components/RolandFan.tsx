import React from 'react';
import type { CircuitComponent } from '../../../types/game';

interface ComponentProps {
  component: CircuitComponent;
  isEnergized: boolean;
}

export const RolandFan: React.FC<ComponentProps> = ({ component, isEnergized }) => {
  return (
    <g transform="translate(0, 0)">
      {/* Clip path for the portrait and premium cap gradients */}
      <defs>
        <clipPath id="rolandClip">
          <rect x="-55" y="-55" width="110" height="110" rx="8" />
        </clipPath>

        {/* Shiny yellow fan blade gradient */}
        <linearGradient id="fanBladeGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#fef08a" />
          <stop offset="50%" stopColor="#eab308" />
          <stop offset="100%" stopColor="#a16207" />
        </linearGradient>

        {/* Central hub gradient */}
        <radialGradient id="hubGrad" cx="35%" cy="35%" r="65%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="60%" stopColor="#cbd5e1" />
          <stop offset="100%" stopColor="#475569" />
        </radialGradient>
      </defs>

      {/* Background Frame / Card (Vertical layout to show full body) */}
      <rect 
        x="-60" 
        y="-80" 
        width="120" 
        height="160" 
        rx="10" 
        fill="#1e293b" 
        stroke={isEnergized ? '#facc15' : '#334155'} 
        strokeWidth="3.5" 
        filter="drop-shadow(0 6px 8px rgba(0,0,0,0.4))"
        className="transition-colors duration-300"
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
      />

      {/* Relay Master Crown Text */}
      <text 
        x="0" 
        y="-88" 
        fill="#facc15" 
        fontSize="9" 
        fontWeight="900" 
        textAnchor="middle" 
        className="font-mono tracking-wider animate-pulse"
      >
        ★ RELAY MASTER ★
      </text>

      {/* Rotating Beanie Propeller sitting exactly on the top button of his red cap */}
      <g transform="translate(-1.5, -43)" filter="drop-shadow(0 3px 5px rgba(0,0,0,0.6))">
        <g 
          className={isEnergized ? 'animate-motor-spin' : ''}
          style={{ transformOrigin: '0px 0px' }}
        >
          {/* 3 detailed aerodynamic fan blades */}
          <g transform="rotate(0)">
            <path d="M-2 -2 L-6 -22 C-3 -24, 3 -24, 6 -22 L2 -2 Z" fill="url(#fanBladeGrad)" stroke="#78350f" strokeWidth="0.8" />
            <path d="M-4 -8 C-4 -18, 4 -18, 4 -8" fill="none" stroke="#fef08a" strokeWidth="0.5" strokeDasharray="1,1" opacity="0.6" />
          </g>
          
          <g transform="rotate(120)">
            <path d="M-2 -2 L-6 -22 C-3 -24, 3 -24, 6 -22 L2 -2 Z" fill="url(#fanBladeGrad)" stroke="#78350f" strokeWidth="0.8" />
            <path d="M-4 -8 C-4 -18, 4 -18, 4 -8" fill="none" stroke="#fef08a" strokeWidth="0.5" strokeDasharray="1,1" opacity="0.6" />
          </g>

          <g transform="rotate(240)">
            <path d="M-2 -2 L-6 -22 C-3 -24, 3 -24, 6 -22 L2 -2 Z" fill="url(#fanBladeGrad)" stroke="#78350f" strokeWidth="0.8" />
            <path d="M-4 -8 C-4 -18, 4 -18, 4 -8" fill="none" stroke="#fef08a" strokeWidth="0.5" strokeDasharray="1,1" opacity="0.6" />
          </g>

          {/* Central Mounting Hub */}
          <circle cx="0" cy="0" r="5" fill="url(#hubGrad)" stroke="#475569" strokeWidth="1.2" />
          <circle cx="0" cy="0" r="1.5" fill="#1e293b" />
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
