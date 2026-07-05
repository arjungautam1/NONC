import React from 'react';
import type { CircuitComponent } from '../../../types/game';
import { useGameStore } from '../../../store/useGameStore';
import { getTerminalKey } from '../../../simulation/circuitSolver';

interface LimitSwitchProps {
  component: CircuitComponent;
}

export const LimitSwitch: React.FC<LimitSwitchProps> = ({ component }) => {
  const nodeVoltages = useGameStore(state => state.simulation.nodeVoltages);
  const isRunning = useGameStore(state => state.isRunning);

  const isPressed = component.state.pressed || false;

  const inKey = getTerminalKey(component.id, 'in');
  const outKey = getTerminalKey(component.id, 'out');
  
  const vIn = isRunning ? (nodeVoltages[inKey] || 0) : 0;
  const vOut = isRunning ? (nodeVoltages[outKey] || 0) : 0;
  
  // Voltage is present on either side
  const hasVoltage = vIn > 0 || vOut > 0;
  // If pressed, NC contact opens. So if there is voltage on one side, it will be blocked.
  const isBlocked = isPressed && hasVoltage && (vIn === 0 || vOut === 0);

  return (
    <g>
      {/* Outer switch block housing */}
      <rect
        x="-30"
        y="-20"
        width="60"
        height="36"
        rx="3"
        fill="#1e222b"
        stroke="#475569"
        strokeWidth="2"
        filter="drop-shadow(0 3px 6px rgba(0,0,0,0.35))"
      />
      
      {/* Brand & Technical label */}
      <rect x="-24" y="-14" width="48" height="12" rx="1.5" fill="#ef4444" opacity="0.85" />
      <text x="0" y="-6" textAnchor="middle" fill="#ffffff" fontSize="6.5" fontWeight="bold" fontFamily="monospace">
        NC LIMIT SW
      </text>

      {/* Internal Schematic Traces (Visual helper inside the box) */}
      <line x1="-30" y1="6" x2="-14" y2="6" stroke="#475569" strokeWidth="1.5" />
      <line x1="14" y1="6" x2="30" y2="6" stroke="#475569" strokeWidth="1.5" />

      {/* NC Arm Contact:
          If NOT pressed (normal state), contact arm is straight down bridging the terminals.
          If pressed, contact arm is pushed open (tilted down/away). */}
      {isPressed ? (
        // Open NC bridge arm (tilted down)
        <line
          x1="-14"
          y1="6"
          x2="10"
          y2="14"
          stroke={hasVoltage ? '#eab308' : '#64748b'}
          strokeWidth="2"
          strokeLinecap="round"
        />
      ) : (
        // Closed NC bridge arm (straight horizontal connection)
        <line
          x1="-14"
          y1="6"
          x2="14"
          y2="6"
          stroke={hasVoltage ? '#22c55e' : '#64748b'}
          strokeWidth="2.5"
          strokeLinecap="round"
        />
      )}

      {/* Small contact terminals inside schematics */}
      <circle cx="-14" cy="6" r="2" fill="#475569" />
      <circle cx="14" cy="6" r="2" fill="#475569" />

      {/* Plunger shaft and roller wheel:
          If NOT pressed: Plunger extends up (Y=-32). Roller at Y=-35.
          If pressed: Plunger compressed down (Y=-24). Roller at Y=-27. */}
      <g transform={isPressed ? 'translate(0, 8)' : 'translate(0, 0)'} style={{ transition: 'transform 0.15s ease-out' }}>
        {/* Metal shaft piston */}
        <rect x="-5" y="-30" width="10" height="12" fill="#94a3b8" stroke="#475569" strokeWidth="1" />
        {/* Plunger spring coils wrapped around shaft */}
        <path d="M -5 -27 L 5 -25 M -5 -24 L 5 -22 M -5 -21 L 5 -19" stroke="#334155" strokeWidth="1.2" />
        {/* Plunger head bracket */}
        <path d="M -7 -30 L 7 -30 L 5 -34 L -5 -34 Z" fill="#64748b" />
        {/* Plunger Roller Wheel */}
        <circle cx="0" cy="-35" r="4.5" fill="#475569" stroke="#94a3b8" strokeWidth="1" />
        <circle cx="0" cy="-35" r="1.5" fill="#1e293b" />
      </g>

      {/* Highlight glow if active voltage blocked */}
      {isBlocked && (
        <circle cx="0" cy="6" r="12" fill="#facc15" opacity="0.12" filter="blur(3px)" />
      )}
    </g>
  );
};
