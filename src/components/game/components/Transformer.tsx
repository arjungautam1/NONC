import React from 'react';
import type { CircuitComponent } from '../../../types/game';

interface TransformerProps {
  component: CircuitComponent;
  isEnergized: boolean;
}

export const Transformer: React.FC<TransformerProps> = ({ component }) => {
  const isActive = component.state.active || false;

  return (
    <g transform="translate(0, -5)">
      {/* Wall Adapter Body Casing (Beige/White glossy plastic) */}
      <rect
        x="-38"
        y="-55"
        width="76"
        height="110"
        rx="16"
        fill="url(#transf-casing)"
        stroke="#d8d8d8"
        strokeWidth="1.8"
        filter="drop-shadow(0 6px 12px rgba(0,0,0,0.35))"
      />
      
      {/* White face overlay */}
      <rect
        x="-34"
        y="-51"
        width="68"
        height="102"
        rx="13"
        fill="#f8fafc"
        opacity="0.95"
      />

      {/* Top securing tab with mounting screw */}
      <path d="M -12 -55 L -12 -64 C -12 -67, 12 -67, 12 -64 L 12 -55 Z" fill="#f8fafc" stroke="#d8d8d8" strokeWidth="1" />
      <circle cx="0" cy="-61" r="5" fill="#ef4444" opacity="0.85" /> {/* Red washer */}
      <circle cx="0" cy="-61" r="2.5" fill="url(#silverGrad)" stroke="#64748b" strokeWidth="0.5" /> {/* Silver screw */}

      {/* Plug blades on the back (upper middle of front panel, drawn with metallic reflection) */}
      <g opacity="0.2" transform="translate(0, -25)">
        <rect x="-15" y="-12" width="6" height="20" rx="1.5" fill="url(#silverGrad)" stroke="#475569" strokeWidth="0.8" />
        <circle cx="-12" cy="2" r="1.5" fill="#0f172a" />
        <rect x="9" y="-12" width="6" height="20" rx="1.5" fill="url(#silverGrad)" stroke="#475569" strokeWidth="0.8" />
        <circle cx="12" cy="2" r="1.5" fill="#0f172a" />
        <circle cx="0" cy="14" r="3.5" fill="#94a3b8" stroke="#475569" strokeWidth="0.8" /> {/* Ground pin */}
      </g>

      {/* Sticker Label in the middle */}
      <rect x="-30" y="-12" width="60" height="42" rx="2" fill="#ffffff" stroke="#cbd5e1" strokeWidth="0.8" />
      
      <g textAnchor="middle" fontFamily="sans-serif">
        <text x="0" y="-4" fill="#0f172a" fontSize="6.5" fontWeight="900" letterSpacing="0.05em">WUYELIN</text>
        <text x="0" y="3" fill="#1e293b" fontSize="5.5" fontWeight="bold">AC/AC ADAPTER</text>
        
        <g fill="#475569" fontSize="3.8" fontWeight="600" fontFamily="monospace">
          <text x="0" y="9.5">MODEL: PS-AC1640</text>
          <text x="0" y="14.5">INPUT: 120V - 60Hz 60VA</text>
          <text x="0" y="19.5">OUTPUT: 16.5V - 40VA</text>
        </g>

        {/* UL listed circle and icons */}
        <g transform="translate(-16, 23) scale(0.7)">
          <circle cx="0" cy="4" r="5.5" fill="none" stroke="#0f172a" strokeWidth="0.8" />
          <text x="0" y="6" fill="#0f172a" fontSize="6.5" fontWeight="bold" fontFamily="sans-serif">UL</text>
        </g>
        <g transform="translate(16, 23) scale(0.7)" fill="none" stroke="#0f172a" strokeWidth="0.8">
          {/* House icon */}
          <path d="M -5 6 L -5 1 L 0 -3 L 5 1 L 5 6 Z" />
          <rect x="-1.5" y="3" width="3" height="3" />
        </g>
      </g>

      {/* Green Power LED (Output healthy) */}
      <circle
        cx="0"
        cy="-40"
        r="3"
        fill={isActive ? '#22c55e' : '#64748b'}
        stroke={isActive ? '#4ade80' : '#475569'}
        strokeWidth="0.6"
        className={isActive ? 'animate-pulse' : ''}
        style={{ filter: isActive ? 'drop-shadow(0 0 3px #22c55e)' : 'none' }}
      />
      <text x="0" y="-33" textAnchor="middle" fill="#64748b" fontSize="4.5" fontWeight="bold" fontFamily="monospace">
        16.5V AC
      </text>

      {/* Bottom screw terminal blocks for outputs */}
      <g transform="translate(0, 43)">
        {/* Recessed grey pocket */}
        <rect x="-30" y="-8" width="60" height="15" rx="2" fill="#e2e8f0" stroke="#cbd5e1" strokeWidth="0.8" />
        
        {/* 3 Screw heads */}
        {[-20, 0, 20].map((slotX, idx) => (
          <g key={idx} transform={`translate(${slotX}, -1)`}>
            <circle cx="0" cy="0" r="5" fill="url(#silverGrad)" stroke="#64748b" strokeWidth="0.6" />
            <line x1="-3.5" y1="-1" x2="3.5" y2="1" stroke="#334155" strokeWidth="1" />
            <line x1="-1" y1="-3.5" x2="1" y2="3.5" stroke="#334155" strokeWidth="1" />
          </g>
        ))}

        {/* Labels below screws */}
        <g fontSize="5.5" fontWeight="black" fill="#475569" fontFamily="monospace" textAnchor="middle">
          <text x="-20" y="11">16.5V</text>
          <text x="0" y="11">GND</text>
          <text x="20" y="11">0V</text>
        </g>
      </g>

      <defs>
        {/* Shiny plastic cylinder/body gradient */}
        <linearGradient id="transf-casing" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#fefefe" />
          <stop offset="60%" stopColor="#f1f5f9" />
          <stop offset="100%" stopColor="#cbd5e1" />
        </linearGradient>

        {/* Silver screw gradient */}
        <linearGradient id="silverGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#cbd5e1" />
          <stop offset="50%" stopColor="#f8fafc" />
          <stop offset="100%" stopColor="#64748b" />
        </linearGradient>
      </defs>
    </g>
  );
};
