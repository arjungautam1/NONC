import React from 'react';
import type { CircuitComponent } from '../../../types/game';
import { useGameStore } from '../../../store/useGameStore';

interface ElevatorCabinProps {
  component: CircuitComponent;
  isEnergized: boolean;
}

export const ElevatorCabin: React.FC<ElevatorCabinProps> = ({ component, isEnergized }) => {
  const travel = component.state.travel || 0; // 0 to 100%
  const nodeVoltages = useGameStore(state => state.simulation.nodeVoltages);

  const vPos = nodeVoltages[`${component.id}:pos`] || 0;
  const vNeg = nodeVoltages[`${component.id}:neg`] || 0;

  // Y coordinate of the cabin box.
  // travel=0 -> Y=45 (Ground floor). travel=100 -> Y=-45 (Top floor).
  const cabinY = 45 - (travel / 100) * 90;

  const isUpActive = vPos > vNeg;
  const isDownActive = vNeg > vPos;

  return (
    <g>
      {/* Background Hoistway Frame */}
      <rect
        x="-45"
        y="-70"
        width="90"
        height="140"
        rx="4"
        fill="#0f172a"
        stroke="#334155"
        strokeWidth="2.5"
      />

      {/* Guide Rails (Vertical lines) */}
      <line x1="-32" y1="-65" x2="-32" y2="65" stroke="#475569" strokeWidth="2.5" strokeDasharray="4,4" />
      <line x1="32" y1="-65" x2="32" y2="65" stroke="#475569" strokeWidth="2.5" strokeDasharray="4,4" />

      {/* Hoisting Cable (Pulley cable) */}
      <line
        x1="0"
        y1="-65"
        x2="0"
        y2={cabinY - 15}
        stroke="#94a3b8"
        strokeWidth="1.8"
      />

      {/* Pulley Wheel at Top */}
      <circle cx="0" cy="-65" r="8" fill="#1e293b" stroke="#64748b" strokeWidth="1.5" />
      <circle cx="0" cy="-65" r="3.5" fill="#475569" />

      {/* Top Limit Switch Visual Roller (Y=-55) */}
      <g transform="translate(-20, -56)">
        {/* Switch Body */}
        <rect x="-8" y="-6" width="16" height="12" rx="1.5" fill="#ef4444" stroke="#7f1d1d" strokeWidth="1" />
        {/* Roller lever arm */}
        {travel >= 100 ? (
          // Pushed/bent state when elevator cabin hits it
          <path d="M 0 6 Q 6 12 12 12" fill="none" stroke="#e2e8f0" strokeWidth="1.5" strokeLinecap="round" />
        ) : (
          // Extended state
          <path d="M 0 6 Q 6 14 14 16" fill="none" stroke="#e2e8f0" strokeWidth="1.5" strokeLinecap="round" />
        )}
        {/* Little roller wheel at end of lever */}
        <circle cx={travel >= 100 ? 12 : 14} cy={travel >= 100 ? 12 : 16} r="2.5" fill="#475569" stroke="#94a3b8" strokeWidth="0.5" />
        <text x="-7" y="14" fill="#ef4444" fontSize="4.5" fontWeight="bold" fontFamily="monospace">LIMIT</text>
      </g>

      {/* Floors Floor labels on background */}
      <text x="38" y="-45" textAnchor="end" fill="#64748b" fontSize="7" fontWeight="bold" fontFamily="monospace">
        2F (TOP)
      </text>
      <line x1="18" y1="-42" x2="38" y2="-42" stroke="#1e293b" strokeWidth="1" />

      <text x="38" y="48" textAnchor="end" fill="#64748b" fontSize="7" fontWeight="bold" fontFamily="monospace">
        1F (GND)
      </text>
      <line x1="18" y1="51" x2="38" y2="51" stroke="#1e293b" strokeWidth="1" />

      {/* Moving Elevator Cabin Container */}
      <g transform={`translate(0, ${cabinY})`}>
        {/* Cabin outer shell */}
        <rect
          x="-22"
          y="-15"
          width="44"
          height="30"
          rx="3"
          fill="url(#cabin-grad)"
          stroke="#94a3b8"
          strokeWidth="2.5"
          filter="drop-shadow(0 2px 5px rgba(0,0,0,0.6))"
        />

        {/* Inner Glass Window highlight */}
        <rect
          x="-14"
          y="-9"
          width="28"
          height="14"
          rx="1"
          fill="#0c4a6e"
          stroke="#0284c7"
          strokeWidth="1.2"
          opacity="0.85"
        />

        {/* Diagonal reflection stripe across window */}
        <line x1="-12" y1="-2" x2="1" y2="-9" stroke="#ffffff" strokeWidth="1" opacity="0.15" strokeLinecap="round" />

        {/* Cabin internal light glowing yellow if motor running */}
        {isEnergized && (
          <circle cx="0" cy="-1" r="5" fill="#fef08a" opacity="0.3" filter="blur(2px)" />
        )}

        {/* Direction indicators on Cabin Header */}
        <g transform="translate(0, -11)" fontSize="5.5" fontWeight="black" fontFamily="monospace">
          {isUpActive && <text x="0" y="0" textAnchor="middle" fill="#22c55e" className="animate-pulse">▲ UP</text>}
          {isDownActive && <text x="0" y="0" textAnchor="middle" fill="#ef4444" className="animate-pulse">▼ DN</text>}
          {!isUpActive && !isDownActive && <text x="0" y="0" textAnchor="middle" fill="#64748b">STOP</text>}
        </g>
      </g>

      {/* Brand logo label */}
      <text x="0" y="-74" textAnchor="middle" fill="#94a3b8" fontSize="7.5" fontWeight="black" letterSpacing="0.05em" fontFamily="sans-serif">
        DELMI ELEVATOR
      </text>

      {/* Terminal strip at bottom */}
      <rect x="-38" y="70" width="76" height="15" fill="#1e222b" stroke="#334155" strokeWidth="1.5" />
      {/* Screw Terminals */}
      <circle cx="-30" cy="77" r="4.5" fill="#475569" stroke="#94a3b8" strokeWidth="1" />
      <circle cx="-30" cy="77" r="1.5" fill="#1e293b" />
      <text x="-22" y="81" textAnchor="start" fill="#64748b" fontSize="5.5" fontWeight="bold" fontFamily="monospace">UP</text>

      <circle cx="30" cy="77" r="4.5" fill="#475569" stroke="#94a3b8" strokeWidth="1" />
      <circle cx="30" cy="77" r="1.5" fill="#1e293b" />
      <text x="22" y="81" textAnchor="end" fill="#64748b" fontSize="5.5" fontWeight="bold" fontFamily="monospace">DN</text>

      {/* Gradients */}
      <defs>
        <linearGradient id="cabin-grad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#334155" />
          <stop offset="40%" stopColor="#475569" />
          <stop offset="60%" stopColor="#334155" />
          <stop offset="100%" stopColor="#1e293b" />
        </linearGradient>
      </defs>
    </g>
  );
};
