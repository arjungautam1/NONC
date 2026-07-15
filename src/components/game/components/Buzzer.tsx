import React from 'react';
import type { CircuitComponent } from '../../../types/game';

interface ComponentProps {
  component: CircuitComponent;
  isEnergized: boolean;
}

export const Buzzer: React.FC<ComponentProps> = ({ component, isEnergized }) => {
  return (
    <g className={isEnergized ? 'animate-vibrate' : ''} style={{ transformOrigin: '0px -15px' }}>
      {/* Sound waves emitted when energized */}
      {isEnergized && (
        <g stroke="#f87171" strokeWidth="2.5" fill="none" strokeLinecap="round" className="animate-pulse">
          <circle cx="0" cy="-15" r="42" strokeDasharray="12,12" opacity="0.6" />
          <circle cx="0" cy="-15" r="54" strokeDasharray="16,16" opacity="0.3" />
        </g>
      )}

      {/* Mounting screw holes / brackets (Left & Right) */}
      <path d="M -58 15 C -58 5, -34 -5, -30 -10 L -30 20 Z" fill="#1e293b" stroke="#0f172a" strokeWidth="1.5" />
      <circle cx="-50" cy="15" r="4.5" fill="#475569" stroke="#1e293b" strokeWidth="1" />
      
      <path d="M 58 15 C 58 5, 34 -5, 30 -10 L 30 20 Z" fill="#1e293b" stroke="#0f172a" strokeWidth="1.5" />
      <circle cx="50" cy="15" r="4.5" fill="#475569" stroke="#1e293b" strokeWidth="1" />

      {/* Wire Leads coming from bottom of the siren body to the terminal studs */}
      {/* Red Lead (+) on left */}
      <path d="M -6 16 C -6 26, -50 26, -50 15" fill="none" stroke="#ef4444" strokeWidth="3.5" strokeLinecap="round" />
      <path d="M -6 16 C -6 26, -50 26, -50 15" fill="none" stroke="#b91c1c" strokeWidth="1.5" strokeLinecap="round" opacity="0.4" />

      {/* Black Lead (-) on right */}
      <path d="M 6 16 C 6 26, 50 26, 50 15" fill="none" stroke="#1f2937" strokeWidth="3.5" strokeLinecap="round" />
      <path d="M 6 16 C 6 26, 50 26, 50 15" fill="none" stroke="#111827" strokeWidth="1.5" strokeLinecap="round" opacity="0.4" />

      {/* Main Piezo Siren Cylinder Body */}
      <circle cx="0" cy="-15" r="32" fill="url(#sirenBodyGrad)" stroke="#0f172a" strokeWidth="2.5" filter="drop-shadow(0 4px 8px rgba(0,0,0,0.5))" />
      
      {/* Concentric Ridges/Rings (Glossy Plastic highlights) */}
      <circle cx="0" cy="-15" r="26" fill="none" stroke="#4b5563" strokeWidth="1.2" opacity="0.5" />
      <circle cx="0" cy="-15" r="22" fill="none" stroke="#1f2937" strokeWidth="1.8" />
      <circle cx="0" cy="-15" r="18" fill="none" stroke="#4b5563" strokeWidth="1" opacity="0.5" />
      <circle cx="0" cy="-15" r="14" fill="none" stroke="#111827" strokeWidth="2" />

      {/* Central Sound Opening */}
      <circle cx="0" cy="-15" r="9.5" fill="#111827" stroke="#374151" strokeWidth="1" />
      
      {/* Golden Piezo Ceramic Disk showing inside the hole */}
      <circle cx="0" cy="-15" r="6" fill="url(#piezoGoldGrad)" />

      {/* Center hole shading */}
      <circle cx="0" cy="-15" r="6" fill="none" stroke="#000000" strokeWidth="1.5" opacity="0.6" />

      <text x="0" y="44" fill="#cbd5e1" fontSize="9" fontWeight="black" textAnchor="middle" filter="drop-shadow(0 1px 2px rgba(0,0,0,0.8))">
        {component.label || 'SIREN'}
      </text>

      <defs>
        {/* Shiny plastic cylinder gradient */}
        <radialGradient id="sirenBodyGrad" cx="30%" cy="30%" r="70%">
          <stop offset="0%" stopColor="#4b5563" />
          <stop offset="50%" stopColor="#1f2937" />
          <stop offset="100%" stopColor="#0f172a" />
        </radialGradient>
        
        {/* Metallic golden piezo disk gradient */}
        <linearGradient id="piezoGoldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ca8a04" />
          <stop offset="40%" stopColor="#eab308" />
          <stop offset="70%" stopColor="#fef08a" />
          <stop offset="100%" stopColor="#854d0e" />
        </linearGradient>
      </defs>
    </g>
  );
};
