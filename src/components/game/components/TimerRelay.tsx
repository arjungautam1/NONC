import React from 'react';
import type { CircuitComponent } from '../../../types/game';
import { useGameStore } from '../../../store/useGameStore';

interface TimerRelayProps {
  component: CircuitComponent;
  isEnergized: boolean; // Is the coil powered
}

export const TimerRelay: React.FC<TimerRelayProps> = ({ component, isEnergized }) => {
  const timeLeft = component.state.timeLeft || '2.0s';
  const isDelayedActive = component.state.delayedActive || false;
  const nodeVoltages = useGameStore(state => state.simulation.nodeVoltages);
  
  const vCom = nodeVoltages[`${component.id}:com`] || 0;

  return (
    <g>
      {/* Outer DIN-Rail Casing */}
      <rect
        x="-50"
        y="-65"
        width="100"
        height="130"
        rx="6"
        fill="#1e222b"
        stroke="#3c4456"
        strokeWidth="2.5"
        filter="drop-shadow(0 4px 8px rgba(0,0,0,0.4))"
      />
      
      {/* DIN Rail metal attachment groove top & bottom */}
      <rect x="-42" y="-69" width="84" height="4" fill="#334155" rx="1" />
      <rect x="-42" y="-65" width="84" height="1" fill="#475569" />
      <rect x="-42" y="65" width="84" height="4" fill="#334155" rx="1" />
      <rect x="-42" y="64" width="84" height="1" fill="#475569" />

      {/* Industrial Front Faceplate */}
      <rect
        x="-42"
        y="-55"
        width="84"
        height="110"
        rx="4"
        fill="#13161c"
        stroke="#272f3d"
        strokeWidth="1.5"
      />

      {/* Technical Labels */}
      <text
        x="0"
        y="-44"
        textAnchor="middle"
        fill="#94a3b8"
        fontSize="7"
        fontWeight="bold"
        letterSpacing="0.05em"
        fontFamily="monospace"
      >
        TIME-DELAY RELAY
      </text>

      {/* LEDs panel */}
      <g transform="translate(-25, -28)">
        {/* Power LED */}
        <circle
          cx="0"
          cy="0"
          r="3.5"
          fill={isEnergized ? '#22c55e' : '#1e293b'}
          stroke={isEnergized ? '#4ade80' : '#475569'}
          strokeWidth="1"
          className={isEnergized ? 'animate-pulse' : ''}
          style={{ filter: isEnergized ? 'drop-shadow(0 0 4px #22c55e)' : 'none' }}
        />
        <text x="6" y="2.5" fill="#64748b" fontSize="5" fontWeight="bold" fontFamily="monospace">
          PWR
        </text>

        {/* Output Active LED */}
        <circle
          cx="28"
          cy="0"
          r="3.5"
          fill={isDelayedActive ? '#f97316' : '#1e293b'}
          stroke={isDelayedActive ? '#fdba74' : '#475569'}
          strokeWidth="1"
          style={{ filter: isDelayedActive ? 'drop-shadow(0 0 4px #f97316)' : 'none' }}
        />
        <text x="34" y="2.5" fill="#64748b" fontSize="5" fontWeight="bold" fontFamily="monospace">
          OUT
        </text>
      </g>

      {/* Circular Dial Knob */}
      <g transform="translate(0, 5)">
        <circle cx="0" cy="0" r="16" fill="#1e222b" stroke="#334155" strokeWidth="2" />
        <circle cx="0" cy="0" r="13" fill="#0f1115" />
        
        {/* Dial increments */}
        {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((angle) => (
          <line
            key={angle}
            x1="0"
            y1="-11"
            x2="0"
            y2="-13"
            transform={`rotate(${angle})`}
            stroke="#475569"
            strokeWidth="1"
          />
        ))}

        {/* Knob center and pointer arm */}
        <circle cx="0" cy="0" r="6" fill="#2d3748" stroke="#4a5568" strokeWidth="1" />
        {/* Pointer sweeps dynamically based on time remaining */}
        <line
          x1="0"
          y1="0"
          x2="0"
          y2="-12"
          stroke="#f59e0b"
          strokeWidth="2.5"
          strokeLinecap="round"
          transform={isEnergized && !isDelayedActive ? `rotate(120)` : `rotate(280)`}
          style={{ transition: 'transform 2s linear' }}
        />
      </g>

      {/* Digital Countdown Box */}
      <g transform="translate(0, -12)">
        <rect
          x="-26"
          y="-6"
          width="52"
          height="12"
          rx="2"
          fill="#0c0e12"
          stroke="#1e293b"
          strokeWidth="1"
        />
        <text
          x="0"
          y="3"
          textAnchor="middle"
          fill={isDelayedActive ? '#10b981' : isEnergized ? '#fbbf24' : '#64748b'}
          fontSize="8"
          fontWeight="bold"
          fontFamily="monospace"
          letterSpacing="0.02em"
        >
          {isDelayedActive ? 'TRIP' : isEnergized ? `T-${timeLeft}` : 'READY'}
        </text>
      </g>

      {/* Connection Leads Visualizer (Internal contacts) */}
      <g opacity="0.35" stroke="#475569" strokeWidth="1.5" strokeLinecap="round">
        {/* Com to NC line */}
        <path d="M 20 -30 L 20 -15" />
        <path d="M 20 0 L 20 15" />
        {/* Swapping contact pole arm */}
        {isDelayedActive ? (
          // Connect to NO (right arm)
          <line x1="20" y1="-15" x2="30" y2="15" stroke={vCom > 0 ? '#f59e0b' : '#475569'} strokeWidth="2" />
        ) : (
          // Connect to NC (left arm)
          <line x1="20" y1="-15" x2="20" y2="0" stroke={vCom > 0 ? '#f59e0b' : '#475569'} strokeWidth="2" />
        )}
      </g>

      {/* Labels on front faceplate for terminals */}
      <g fontSize="6" fontWeight="bold" fill="#475569" fontFamily="monospace">
        <text x="-40" y="-38" textAnchor="start">A1</text>
        <text x="-40" y="42" textAnchor="start">A2</text>
        <text x="40" y="-38" textAnchor="end">15 (COM)</text>
        <text x="40" y="4" textAnchor="end">16 (NC)</text>
        <text x="40" y="42" textAnchor="end">18 (NO)</text>
      </g>
    </g>
  );
};
