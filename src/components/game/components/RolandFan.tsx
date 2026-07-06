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

        {/* Spherical crown gradient */}
        <radialGradient id="capCrownGrad" cx="35%" cy="35%" r="65%">
          <stop offset="0%" stopColor="#fca5a5" />
          <stop offset="35%" stopColor="#ef4444" />
          <stop offset="85%" stopColor="#b91c1c" />
          <stop offset="100%" stopColor="#7f1d1d" />
        </radialGradient>

        {/* Visor gradient */}
        <linearGradient id="capBrimGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#f87171" />
          <stop offset="30%" stopColor="#ef4444" />
          <stop offset="100%" stopColor="#991b1b" />
        </linearGradient>

        {/* Squatchee button gradient */}
        <radialGradient id="capButtonGrad" cx="30%" cy="30%" r="70%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="40%" stopColor="#ef4444" />
          <stop offset="100%" stopColor="#7f1d1d" />
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

      {/* Roland Portrait (Full 1:1 Aspect Ratio to show arms crossed and boxes) */}
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

      {/* Rotating High-Fidelity Cap/Fan overlay positioned exactly on his red cap */}
      <g transform="translate(-1, -37)" filter="drop-shadow(0 4px 6px rgba(0,0,0,0.5))">
        <g 
          className={isEnergized ? 'animate-motor-spin' : ''}
          style={{ transformOrigin: '0px 0px' }}
        >
          {/* 3 Stitched Visor / Brim blades */}
          <g transform="rotate(0)">
            <path d="M-12 -8 C-12 -28, 12 -28, 12 -8 Z" fill="url(#capBrimGrad)" stroke="#7f1d1d" strokeWidth="1.2" />
            <path d="M-9 -12 C-9 -24, 9 -24, 9 -12" fill="none" stroke="#fee2e2" strokeWidth="0.8" strokeDasharray="1.5,1.5" />
            <path d="M-6 -15 C-6 -20, 6 -20, 6 -15" fill="none" stroke="#fee2e2" strokeWidth="0.8" strokeDasharray="1.5,1.5" />
          </g>
          
          <g transform="rotate(120)">
            <path d="M-12 -8 C-12 -28, 12 -28, 12 -8 Z" fill="url(#capBrimGrad)" stroke="#7f1d1d" strokeWidth="1.2" />
            <path d="M-9 -12 C-9 -24, 9 -24, 9 -12" fill="none" stroke="#fee2e2" strokeWidth="0.8" strokeDasharray="1.5,1.5" />
            <path d="M-6 -15 C-6 -20, 6 -20, 6 -15" fill="none" stroke="#fee2e2" strokeWidth="0.8" strokeDasharray="1.5,1.5" />
          </g>

          <g transform="rotate(240)">
            <path d="M-12 -8 C-12 -28, 12 -28, 12 -8 Z" fill="url(#capBrimGrad)" stroke="#7f1d1d" strokeWidth="1.2" />
            <path d="M-9 -12 C-9 -24, 9 -24, 9 -12" fill="none" stroke="#fee2e2" strokeWidth="0.8" strokeDasharray="1.5,1.5" />
            <path d="M-6 -15 C-6 -20, 6 -20, 6 -15" fill="none" stroke="#fee2e2" strokeWidth="0.8" strokeDasharray="1.5,1.5" />
          </g>

          {/* Central Cap Dome / Crown */}
          <circle cx="0" cy="0" r="14" fill="url(#capCrownGrad)" stroke="#7f1d1d" strokeWidth="1.5" />

          {/* Seam / Stitching Lines of Cap Panels */}
          <line x1="0" y1="0" x2="0" y2="-14" stroke="#7f1d1d" strokeWidth="0.8" />
          <line x1="0" y1="0" x2="12.1" y2="-7" stroke="#7f1d1d" strokeWidth="0.8" />
          <line x1="0" y1="0" x2="12.1" y2="7" stroke="#7f1d1d" strokeWidth="0.8" />
          <line x1="0" y1="0" x2="0" y2="14" stroke="#7f1d1d" strokeWidth="0.8" />
          <line x1="0" y1="0" x2="-12.1" y2="7" stroke="#7f1d1d" strokeWidth="0.8" />
          <line x1="0" y1="0" x2="-12.1" y2="-7" stroke="#7f1d1d" strokeWidth="0.8" />

          {/* Cap Panel Stitching Highlights */}
          <circle cx="0" cy="0" r="11" fill="none" stroke="#fee2e2" strokeWidth="0.6" strokeDasharray="1,2" opacity="0.6" />

          {/* Red/White 'D' Delmi Logo circle in center */}
          <circle cx="0" cy="0" r="7" fill="#b91c1c" stroke="white" strokeWidth="0.8" />
          <text 
            x="0" 
            y="2.8" 
            fill="white" 
            fontSize="8.2" 
            fontWeight="900" 
            textAnchor="middle" 
            fontFamily="sans-serif"
          >
            D
          </text>

          {/* Central Top Button (Squatchee) */}
          <circle cx="0" cy="0" r="3" fill="url(#capButtonGrad)" stroke="#7f1d1d" strokeWidth="0.8" />
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
