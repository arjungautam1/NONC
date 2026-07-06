import React from 'react';
import type { CircuitComponent } from '../../../types/game';

interface ComponentProps {
  component: CircuitComponent;
  isEnergized: boolean;
}

export const RolandFan: React.FC<ComponentProps> = ({ component, isEnergized }) => {
  return (
    <g transform="translate(0, 0)">
      {/* Clip path for the portrait to show full square body */}
      <defs>
        <clipPath id="rolandClip">
          <rect x="-55" y="-55" width="110" height="110" rx="8" />
        </clipPath>
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

      {/* Roland Portrait (Full 1:1 Aspect Ratio to show arms crossed and boxes) */}
      <image 
        href="/roland.jpg" 
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

      {/* Rotating Cap/Fan overlay positioned exactly on his red cap */}
      <g transform="translate(-1, -37)">
        <g 
          className={isEnergized ? 'animate-motor-spin' : ''}
          style={{ transformOrigin: '0px 0px' }}
        >
          {/* Fan blades styled like red cap bills */}
          <path d="M-3 -3 L-12 -22 C-6 -26, 6 -26, 12 -22 L3 -3 Z" fill="#ef4444" stroke="#991b1b" strokeWidth="1" />
          <path d="M3 3 L22 12 C26 6, 26 -6, 22 -12 L3 -3 Z" fill="#ef4444" stroke="#991b1b" strokeWidth="1" />
          <path d="M-3 3 L-22 12 C-26 6, -26 -6, -22 -12 L-3 -3 Z" fill="#ef4444" stroke="#991b1b" strokeWidth="1" />
          
          {/* Central Cap Hub */}
          <circle cx="0" cy="0" r="9" fill="#dc2626" stroke="#991b1b" strokeWidth="1.5" />
          <text 
            x="0" 
            y="3.5" 
            fill="white" 
            fontSize="10" 
            fontWeight="900" 
            textAnchor="middle" 
            fontFamily="sans-serif"
          >
            D
          </text>
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
