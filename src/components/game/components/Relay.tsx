import React from 'react';
import type { CircuitComponent } from '../../../types/game';
import { useGameStore } from '../../../store/useGameStore';
import { getTerminalKey } from '../../../simulation/circuitSolver';

interface ComponentProps {
  component: CircuitComponent;
}

export const Relay: React.FC<ComponentProps> = ({ component }) => {
  const nodeVoltages = useGameStore(state => state.simulation.nodeVoltages);
  const isRunning = useGameStore(state => state.isRunning);
  
  const isEnergized = component.state.energized || false;

  // Determine if power reaches COM terminal
  const comKey = getTerminalKey(component.id, 'com');
  const hasVoltage = isRunning && nodeVoltages[comKey] > 0;

  return (
    <g transform="translate(-50, -60)">
      {/* Relay enclosure */}
      <rect
        x="0"
        y="0"
        width="100"
        height="120"
        rx="8"
        fill="url(#relayCaseGrad)"
        stroke="#3f3f46"
        strokeWidth="2.5"
        filter="drop-shadow(0 6px 12px rgba(0,0,0,0.5))"
      />

      {/* Clear transparent lid view border */}
      <rect
        x="6"
        y="6"
        width="88"
        height="108"
        rx="6"
        fill="none"
        stroke="#ffffff"
        strokeWidth="1"
        opacity="0.1"
      />

      {/* 1. Electromagnetic Coil Representation */}
      <g transform="translate(25, 60)">
        {/* Core core bar */}
        <rect x="-10" y="-30" width="20" height="60" rx="3" fill="#52525b" stroke="#27272a" strokeWidth="1.5" />
        
        {/* Wound wire lines */}
        <path
          d="M -10 -20 C 10 -20, 10 -15, -10 -15 
             C 10 -15, 10 -10, -10 -10 
             C 10 -10, 10 -5,  -10 -5 
             C 10 -5,  10 0,   -10 0 
             C 10 0,   10 5,   -10 5 
             C 10 5,   10 10,  -10 10 
             C 10 10,  10 15,  -10 15 
             C 10 15,  10 20,  -10 20"
          fill="none"
          stroke={isEnergized ? '#fbbf24' : '#b45309'}
          strokeWidth="3.5"
          filter={isEnergized ? 'drop-shadow(0 0 5px rgba(250, 204, 21, 0.8))' : 'none'}
          style={{ transition: 'stroke 0.2s ease' }}
        />

        {/* Magnetic Field rings pulsing when energized */}
        {isEnergized && (
          <g className="animate-pulse-magnetic">
            <ellipse cx="0" cy="0" rx="25" ry="38" fill="none" stroke="#facc15" strokeWidth="1.5" strokeDasharray="4,4" />
            <ellipse cx="0" cy="0" rx="18" ry="28" fill="none" stroke="#facc15" strokeWidth="1" opacity="0.6" strokeDasharray="3,3" />
          </g>
        )}

        <text x="0" y="5" fill="#f8fafc" fontSize="8" fontWeight="bold" textAnchor="middle" opacity={isEnergized ? 0.9 : 0.6}>
          COIL
        </text>
      </g>

      {/* 2. Mechanical Armature & Contacts */}
      <g transform="translate(65, 0)">
        {/* Terminal labels inside enclosure */}
        <text x="15" y="33" fill="#a1a1aa" fontSize="7" fontWeight="bold" textAnchor="middle">COM</text>
        <text x="15" y="63" fill="#a1a1aa" fontSize="7" fontWeight="bold" textAnchor="middle">NC</text>
        <text x="15" y="93" fill="#a1a1aa" fontSize="7" fontWeight="bold" textAnchor="middle">NO</text>

        {/* NC Contact Point (stationary) and internal trace */}
        <circle cx="15" cy="60" r="3" fill="#94a3b8" stroke="#475569" strokeWidth="1" />
        <line x1="15" y1="60" x2="25" y2="60" stroke="#cbd5e1" strokeWidth="2.5" strokeLinecap="round" />

        {/* NO Contact Point (stationary) and internal trace */}
        <circle cx="15" cy="90" r="3" fill="#94a3b8" stroke="#475569" strokeWidth="1" />
        <line x1="15" y1="90" x2="25" y2="90" stroke="#cbd5e1" strokeWidth="2.5" strokeLinecap="round" />

        {/* COM Anchor Point and internal trace */}
        <circle cx="15" cy="30" r="3" fill="#94a3b8" stroke="#475569" strokeWidth="1" />
        <line x1="15" y1="30" x2="25" y2="30" stroke="#cbd5e1" strokeWidth="2.5" strokeLinecap="round" />
        
        {/* Dotted paths showing open/blocked channels inside the device */}
        {isEnergized ? (
          // Energized: NC contact is open
          <line
            x1="15"
            y1="30"
            x2="15"
            y2="60"
            stroke={hasVoltage ? "#fbbf24" : "#4b5563"}
            strokeWidth={hasVoltage ? 2.5 : 1.5}
            strokeDasharray="2,3"
            filter={hasVoltage ? "url(#yellow-glow)" : "none"}
            opacity={hasVoltage ? 0.95 : 0.4}
          />
        ) : (
          // De-energized: NO contact is open
          <line
            x1="15"
            y1="30"
            x2="15"
            y2="90"
            stroke={hasVoltage ? "#fbbf24" : "#4b5563"}
            strokeWidth={hasVoltage ? 2.5 : 1.5}
            strokeDasharray="2,3"
            filter={hasVoltage ? "url(#yellow-glow)" : "none"}
            opacity={hasVoltage ? 0.95 : 0.4}
          />
        )}

        {/* Armature - Snapping Metal Spring */}
        {/* Swings between NC (60px Y) and NO (90px Y) */}
        <line
          x1="15"
          y1="30"
          x2="15"
          y2={isEnergized ? 90 : 60}
          stroke={isEnergized ? "#22c55e" : "#cbd5e1"}
          strokeWidth="3.5"
          strokeLinecap="round"
          filter="drop-shadow(0 2px 3px rgba(0,0,0,0.3))"
          style={{ transition: 'y2 0.08s cubic-bezier(0.25, 1, 0.5, 1), stroke 0.08s ease' }}
        />

        {/* Contact Pad on Armature */}
        <circle
          cx="15"
          cy={isEnergized ? 89 : 60}
          r="4"
          fill="#e2e8f0"
          stroke="#78829a"
          strokeWidth="1"
          style={{ transition: 'cy 0.08s cubic-bezier(0.25, 1, 0.5, 1)' }}
        />

        {/* Small magnetic linkage bar from coil to armature */}
        <line
          x1="-15"
          y1="60"
          x2="15"
          y2={isEnergized ? 90 : 60}
          stroke="#71717a"
          strokeWidth="1.5"
          strokeDasharray="2,2"
          style={{ transition: 'y2 0.08s ease' }}
        />
      </g>

      {/* Outer Label text */}
      <text x="50" y="134" fill="#cbd5e1" fontSize="10" fontWeight="bold" textAnchor="middle">
        {component.label}
      </text>

      <defs>
        <linearGradient id="relayCaseGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#1e1b4b" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#0f172a" stopOpacity="0.8" />
        </linearGradient>
      </defs>
    </g>
  );
};
