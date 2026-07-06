import React from 'react';
import type { CircuitComponent } from '../../../types/game';


interface TimerRelayProps {
  component: CircuitComponent;
  isEnergized: boolean; // Is the coil powered
}

export const TimerRelay: React.FC<TimerRelayProps> = ({ component, isEnergized }) => {
  const timeLeft = component.state.timeLeft || '2.0s';
  const isDelayedActive = component.state.delayedActive || false;

  // Knob pointer rotation angle (sweeps dynamically based on time remaining)
  const numericTime = parseFloat(timeLeft);
  const percentLeft = Math.min(100, Math.max(0, (numericTime / 2.0) * 100));
  // Map 0-100% to 280deg down to 100deg (clockwise rotation)
  const angle = 100 + (percentLeft / 100) * 180;

  return (
    <g>
      {/* 1. Deep Blue Altronix PCB Board */}
      <rect
        x="-52"
        y="-65"
        width="104"
        height="130"
        rx="6"
        fill="#0f598c"
        stroke="#0c4a75"
        strokeWidth="3.5"
        filter="drop-shadow(0 4px 8px rgba(0,0,0,0.4))"
      />

      {/* Gold plated circular mounting holes in 4 corners */}
      <circle cx="-45" cy="-58" r="3.5" fill="#facc15" stroke="#b45309" strokeWidth="0.8" />
      <circle cx="-45" cy="-58" r="1.8" fill="#1e293b" />
      <circle cx="45" cy="-58" r="3.5" fill="#facc15" stroke="#b45309" strokeWidth="0.8" />
      <circle cx="45" cy="-58" r="1.8" fill="#1e293b" />
      
      <circle cx="-45" cy="28" r="3.5" fill="#facc15" stroke="#b45309" strokeWidth="0.8" />
      <circle cx="-45" cy="28" r="1.8" fill="#1e293b" />
      <circle cx="45" cy="28" r="3.5" fill="#facc15" stroke="#b45309" strokeWidth="0.8" />
      <circle cx="45" cy="28" r="1.8" fill="#1e293b" />

      {/* Silkscreen text header: ALTRONIX CORP. & MADE IN U.S.A. */}
      <text x="24" y="-48" fill="#ffffff" fontSize="5.5" fontWeight="900" textAnchor="middle" fontFamily="sans-serif" opacity="0.9">
        MADE IN U.S.A.
      </text>
      <text x="24" y="-42" fill="#e2e8f0" fontSize="4.5" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif" opacity="0.8">
        BKLYN,NY 11220
      </text>

      <text x="0" y="38" fill="#ffffff" fontSize="7.5" fontWeight="950" textAnchor="middle" fontFamily="sans-serif" letterSpacing="0.05em">
        ALTRONIX CORP.
      </text>

      {/* Model Name */}
      <text x="-26" y="16" fill="#ffffff" fontSize="9" fontWeight="950" fontFamily="sans-serif">
        6062
      </text>
      <text x="-26" y="27" fill="#ffffff" fontSize="7.5" fontWeight="950" fontFamily="sans-serif" letterSpacing="0.02em">
        TIMER
      </text>

      {/* 2. Potentiometer Time Adjustment Dial (Left side) */}
      <g transform="translate(-26, -15)">
        {/* Dial Scale Tickmarks */}
        <text x="0" y="-19" fill="#cbd5e1" fontSize="5" fontWeight="black" textAnchor="middle" fontFamily="monospace">45</text>
        <text x="18" y="-10" fill="#cbd5e1" fontSize="5" fontWeight="black" textAnchor="middle" fontFamily="monospace">60</text>
        <text x="-16" y="14" fill="#cbd5e1" fontSize="5" fontWeight="black" textAnchor="middle" fontFamily="monospace">15</text>
        <text x="16" y="14" fill="#cbd5e1" fontSize="5" fontWeight="black" textAnchor="middle" fontFamily="monospace">1</text>
        
        {/* Scale bracket lines */}
        <path d="M-12 -12 A16 16 0 1 1 12 12" fill="none" stroke="#e2e8f0" strokeWidth="0.8" opacity="0.75" />

        {/* Outer White Cogwheel dial body */}
        <circle cx="0" cy="0" r="14" fill="#f8fafc" stroke="#94a3b8" strokeWidth="1" />
        {/* Gear notches/teeth around edge */}
        {[0, 20, 40, 60, 80, 100, 120, 140, 160, 180, 200, 220, 240, 260, 280, 300, 320, 340].map(deg => (
          <rect
            key={deg}
            x="-1.5"
            y="-15"
            width="3"
            height="1.5"
            fill="#e2e8f0"
            stroke="#cbd5e1"
            strokeWidth="0.3"
            transform={`rotate(${deg})`}
          />
        ))}
        {/* Inner core cap */}
        <circle cx="0" cy="0" r="10" fill="#ffffff" stroke="#cbd5e1" strokeWidth="0.8" />
        <rect x="-1" y="-8" width="2" height="16" fill="#cbd5e1" rx="0.5" />
        
        {/* Arrow / Line pointer */}
        <line
          x1="0"
          y1="0"
          x2="0"
          y2="-10"
          stroke="#0f598c"
          strokeWidth="2"
          strokeLinecap="round"
          transform={`rotate(${angle})`}
        />
      </g>

      {/* 3. Blue DIP Switch Box (Right side) */}
      <g transform="translate(14, -28)">
        <rect x="0" y="0" width="22" height="28" fill="#1d4ed8" rx="2" stroke="#172554" strokeWidth="1" />
        
        {/* 4 small white switch sliders */}
        {[0, 1, 2, 3].map(idx => {
          const switchY = 3.5 + idx * 6;
          return (
            <g key={idx}>
              {/* Slot */}
              <rect x="3" y={switchY} width="16" height="3" fill="#1e293b" rx="0.5" />
              {/* White slider - switches 1, 2, and 4 are ON (left), 3 is OFF (right) */}
              <rect
                x={idx === 2 ? '11' : '4'}
                y={switchY - 0.8}
                width="7"
                height="4.6"
                rx="1"
                fill="#ffffff"
                stroke="#94a3b8"
                strokeWidth="0.5"
              />
            </g>
          );
        })}
        {/* Switch numeric markers */}
        <g fill="#ffffff" fontSize="4.5" fontWeight="bold" fontFamily="monospace" opacity="0.8">
          <text x="-4" y="6">4</text>
          <text x="-4" y="12">3</text>
          <text x="-4" y="18">2</text>
          <text x="-4" y="24">1</text>
        </g>
        <text x="3" y="34" fill="#ffffff" fontSize="4.2" fontWeight="bold" fontFamily="monospace">ON</text>
        <text x="18" y="34" fill="#ffffff" fontSize="4.2" fontWeight="bold" fontFamily="monospace">OFF</text>
      </g>

      {/* 4. Trigger Control / DIP Labels */}
      <text x="14" y="10" fill="#ffffff" fontSize="4" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif" opacity="0.9">
        TRIG CONTROL
      </text>
      <text x="14" y="15" fill="#ffffff" fontSize="3.8" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif" opacity="0.8">
        12V / 24V
      </text>
      <text x="14" y="20" fill="#ffffff" fontSize="3.8" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif" opacity="0.8">
        SEC / MIN
      </text>
      <text x="14" y="25" fill="#ffffff" fontSize="4" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif" opacity="0.9">
        RELAY CONTROL
      </text>

      {/* 5. Red LED Indicator Lens (Right Edge) */}
      <g transform="translate(38, -12)">
        {/* LED Outer base ring */}
        <circle cx="0" cy="0" r="5" fill="#475569" stroke="#334155" strokeWidth="0.8" />
        {/* Red light bulb */}
        <circle
          cx="0"
          cy="0"
          r="3.8"
          fill={isEnergized ? '#ef4444' : '#7f1d1d'}
          stroke={isEnergized ? '#fca5a5' : '#450a0a'}
          strokeWidth="0.8"
          className={isEnergized ? 'animate-pulse' : ''}
          style={{ filter: isEnergized ? 'drop-shadow(0 0 5px #ef4444)' : 'none' }}
        />
        {/* LED light reflection flare */}
        <circle cx="-1" cy="-1" r="1.2" fill="#ffffff" opacity="0.4" />
      </g>

      {/* 6. Digital Countdown / Status Display */}
      <g transform="translate(0, -52)">
        <rect
          x="-24"
          y="-6"
          width="48"
          height="12"
          rx="2.5"
          fill="#020617"
          stroke="#1e293b"
          strokeWidth="1"
        />
        <text
          x="0"
          y="3"
          textAnchor="middle"
          fill={isDelayedActive ? '#10b981' : isEnergized ? '#fbbf24' : '#64748b'}
          fontSize="8.2"
          fontWeight="bold"
          fontFamily="monospace"
        >
          {isDelayedActive ? 'TRIP' : isEnergized ? `${timeLeft}` : 'READY'}
        </text>
      </g>

      {/* 7. Altronix 6062 Premium Terminal Blocks Block (Bottom Side) */}
      <g transform="translate(0, 48)">
        {/* Main black casing base */}
        <rect x="-48" y="-4" width="96" height="16" fill="#18181b" stroke="#27272a" strokeWidth="1" rx="1.5" />
        
        {/* 6 separate terminal partitions with screws */}
        {[-40, -24, -8, 8, 24, 40].map((xOffset, idx) => (
          <g key={idx} transform={`translate(${xOffset}, 4)`}>
            {/* Cell divider borders */}
            <line x1="-8" y1="-8" x2="-8" y2="8" stroke="#3f3f46" strokeWidth="0.8" />
            <line x1="8" y1="-8" x2="8" y2="8" stroke="#3f3f46" strokeWidth="0.8" />
            
            {/* Terminal screw */}
            <circle cx="0" cy="0" r="4.5" fill="url(#screwSilverGrad)" stroke="#52525b" strokeWidth="0.5" />
            {/* Screw thread slot */}
            <line x1="-3" y1="-1" x2="3" y2="1" stroke="#27272a" strokeWidth="1" />
          </g>
        ))}

        {/* Silkscreen text labels directly under the screw blocks */}
        <g fill="#ffffff" fontSize="6.2" fontWeight="black" textAnchor="middle" fontFamily="monospace" opacity="0.95">
          <text x="-40" y="-8">TRG</text>
          <text x="-24" y="-8">-</text>
          <text x="-8" y="-8">+</text>
          <text x="8" y="-8">NO</text>
          <text x="24" y="-8">C</text>
          <text x="40" y="-8">NC</text>
        </g>
      </g>

      {/* Definitions for screw gradient */}
      <defs>
        <linearGradient id="screwSilverGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#d4d4d8" />
          <stop offset="40%" stopColor="#e4e4e7" />
          <stop offset="70%" stopColor="#a1a1aa" />
          <stop offset="100%" stopColor="#71717a" />
        </linearGradient>
      </defs>
    </g>
  );
};
export default TimerRelay;
