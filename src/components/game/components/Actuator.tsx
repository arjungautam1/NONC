import React from 'react';
import type { CircuitComponent } from '../../../types/game';
import { useGameStore } from '../../../store/useGameStore';

interface ActuatorProps {
  component: CircuitComponent;
  isEnergized: boolean;
}

export const Actuator: React.FC<ActuatorProps> = ({ component, isEnergized: _isEnergized }) => {
  const travel = component.state.travel || 0; // 0 to 100
  const nodeVoltages = useGameStore(state => state.simulation.nodeVoltages);

  const vPos = nodeVoltages[`${component.id}:pos`] || 0;
  const vNeg = nodeVoltages[`${component.id}:neg`] || 0;

  // Calculate pixel translation for the piston shaft (travel is 0% to 100%)
  // Casing ends at X=40. Max extension is 60px to the right.
  const shaftExtension = (travel / 100) * 60;
  
  // Direction indicator
  let motionState: 'extending' | 'retracting' | 'stopped' = 'stopped';
  if (vPos > vNeg) motionState = 'extending';
  else if (vNeg > vPos) motionState = 'retracting';

  return (
    <g>
      {/* Background shadow for realistic depth */}
      <rect x="-60" y="-20" width="130" height="40" rx="3" fill="rgba(0,0,0,0.3)" filter="blur(4px)" />

      {/* Main Cylinder Body Housing */}
      <rect
        x="-55"
        y="-22"
        width="95"
        height="38"
        rx="4"
        fill="url(#casing-grad)"
        stroke="#475569"
        strokeWidth="2"
      />
      
      {/* Front Mount Collar */}
      <rect
        x="33"
        y="-15"
        width="10"
        height="24"
        rx="2"
        fill="url(#collar-grad)"
        stroke="#334155"
        strokeWidth="1.5"
      />

      {/* Rear Clevis Mount Bracket (Left end) */}
      <rect
        x="-65"
        y="-10"
        width="12"
        height="14"
        rx="2"
        fill="#334155"
        stroke="#1e293b"
        strokeWidth="1"
      />
      <circle cx="-59" cy="-3" r="3.5" fill="#0f172a" stroke="#475569" strokeWidth="1" />

      {/* Steel Piston Rod - drawn outside translation group to extend from casing collar continuously */}
      <rect
        x="35"
        y="-8"
        width={65 + shaftExtension}
        height="12"
        fill="url(#shaft-grad)"
        stroke="#475569"
        strokeWidth="1.5"
        strokeLinecap="round"
      />

      {/* Extensible Rod End eyelet connector (Moves horizontally based on travel) */}
      <g transform={`translate(${shaftExtension}, 0)`}>
        <circle cx="100" cy="-2" r="8" fill="url(#collar-grad)" stroke="#334155" strokeWidth="1.5" />
        <circle cx="100" cy="-2" r="3.5" fill="#0f172a" stroke="#475569" strokeWidth="1" />
      </g>

      {/* Brand logo & Technical Spec engraving on casing */}
      <text x="-8" y="-7" fill="#64748b" fontSize="6" fontWeight="extrabold" fontFamily="sans-serif">
        DELMI-ACT
      </text>
      <text x="-8" y="1" fill="#475569" fontSize="4.5" fontWeight="bold" fontFamily="monospace">
        STROKE: 150mm | 24VDC
      </text>
      <text x="-8" y="9" fill="#3b82f6" fontSize="5.5" fontWeight="bold" fontFamily="monospace">
        {travel.toFixed(0)}% EXTENDED
      </text>

      {/* Active Motion Arrows (Visual feedback of travel direction) */}
      {motionState === 'extending' && (
        <g className="animate-pulse" fill="#22c55e">
          <polygon points="12,-18 20,-18 24,-15 20,-12 12,-12 16,-15" />
          <polygon points="22,-18 30,-18 34,-15 30,-12 22,-12 26,-15" />
        </g>
      )}
      {motionState === 'retracting' && (
        <g className="animate-pulse" fill="#ef4444">
          <polygon points="24,-18 16,-18 12,-15 16,-12 24,-12 20,-15" />
          <polygon points="14,-18 6,-18 2,-15 6,-12 14,-12 10,-15" />
        </g>
      )}

      {/* Gradients Definition for Cylinder highlights */}
      <defs>
        {/* Dark casing cylindrical gradient */}
        <linearGradient id="casing-grad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#1e293b" />
          <stop offset="35%" stopColor="#334155" />
          <stop offset="50%" stopColor="#1e293b" />
          <stop offset="85%" stopColor="#0f172a" />
          <stop offset="100%" stopColor="#020617" />
        </linearGradient>

        {/* Shiny Steel Shaft cylindrical gradient */}
        <linearGradient id="shaft-grad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#94a3b8" />
          <stop offset="30%" stopColor="#f1f5f9" />
          <stop offset="50%" stopColor="#cbd5e1" />
          <stop offset="80%" stopColor="#64748b" />
          <stop offset="100%" stopColor="#475569" />
        </linearGradient>

        {/* Collar block metal gradient */}
        <linearGradient id="collar-grad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#475569" />
          <stop offset="40%" stopColor="#94a3b8" />
          <stop offset="70%" stopColor="#334155" />
          <stop offset="100%" stopColor="#1e293b" />
        </linearGradient>
      </defs>
    </g>
  );
};
