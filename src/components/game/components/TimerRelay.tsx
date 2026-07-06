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
      {/* 1. Altronix Blue PCB Board */}
      <rect
        x="-50"
        y="-60"
        width="100"
        height="120"
        rx="2"
        fill="#1e6091"
        stroke="#104f7a"
        strokeWidth="2"
        filter="drop-shadow(0 3px 6px rgba(0,0,0,0.35))"
      />

      {/* Gold-plated circular mounting holes in 4 corners */}
      <circle cx="-45" cy="-55" r="2.8" fill="#eab308" stroke="#ca8a04" strokeWidth="0.5" />
      <circle cx="-45" cy="-55" r="1.4" fill="#0f172a" />
      
      <circle cx="45" cy="-55" r="2.8" fill="#eab308" stroke="#ca8a04" strokeWidth="0.5" />
      <circle cx="45" cy="-55" r="1.4" fill="#0f172a" />
      
      <circle cx="-45" cy="55" r="2.8" fill="#eab308" stroke="#ca8a04" strokeWidth="0.5" />
      <circle cx="-45" cy="55" r="1.4" fill="#0f172a" />
      
      <circle cx="45" cy="55" r="2.8" fill="#eab308" stroke="#ca8a04" strokeWidth="0.5" />
      <circle cx="45" cy="55" r="1.4" fill="#0f172a" />

      {/* 2. Top-Center Jumpers J1 and J2 */}
      <g transform="translate(6, -48)">
        {/* Texts */}
        <text x="-4" y="-3" fill="#ffffff" fontSize="2.8" fontFamily="monospace" textAnchor="end">J1 REPEAT MODE</text>
        <text x="18" y="-3" fill="#ffffff" fontSize="2.8" fontFamily="monospace">J1</text>
        <text x="-4" y="5" fill="#ffffff" fontSize="2.8" fontFamily="monospace" textAnchor="end">J2 DELAY PULSE</text>
        <text x="18" y="5" fill="#ffffff" fontSize="2.8" fontFamily="monospace">J2</text>
        
        {/* Resistors (J1 & J2) */}
        <line x1="0" y1="-4" x2="16" y2="-4" stroke="#d1d5db" strokeWidth="0.5" />
        <rect x="4" y="-5.5" width="8" height="3" fill="#d97706" rx="0.5" />
        <line x1="6.5" y1="-5.5" x2="6.5" y2="-2.5" stroke="#f59e0b" strokeWidth="0.5" />
        
        <line x1="0" y1="4" x2="16" y2="4" stroke="#d1d5db" strokeWidth="0.5" />
        <rect x="4" y="2.5" width="8" height="3" fill="#d97706" rx="0.5" />
        <line x1="6.5" y1="2.5" x2="6.5" y2="5.5" stroke="#f59e0b" strokeWidth="0.5" />
      </g>

      {/* 3. Altronix Logo & Location (Top Right) */}
      <g transform="translate(36, -38)">
        {/* Logo Icon */}
        <circle cx="0" cy="0" r="5" fill="none" stroke="#ffffff" strokeWidth="0.6" />
        <circle cx="0" cy="0" r="2.8" fill="none" stroke="#ffffff" strokeWidth="0.4" />
        <line x1="0" y1="-5" x2="0" y2="5" stroke="#ffffff" strokeWidth="0.4" />
        
        <text x="-8" y="-1" fill="#ffffff" fontSize="3.5" fontWeight="bold" textAnchor="end" fontFamily="sans-serif">MADE IN U.S.A.</text>
        <text x="-8" y="3" fill="#ffffff" fontSize="3.2" textAnchor="end" fontFamily="sans-serif">BKLYN,NY 11220</text>
      </g>

      {/* 4. Red LED (Top Right) */}
      <g transform="translate(38, -24)">
        {/* LED base black block */}
        <rect x="-3" y="-2.5" width="6" height="5" fill="#18181b" rx="0.5" />
        {/* Red LED dome */}
        <circle cx="0" cy="0" r="2.5" fill={isEnergized ? '#ef4444' : '#7f1d1d'} stroke={isEnergized ? '#fca5a5' : '#450a0a'} strokeWidth="0.4" />
        <circle cx="-0.6" cy="-0.6" r="0.6" fill="#ffffff" opacity="0.6" />
      </g>

      {/* 5. DIP Switch Block (Middle Right) */}
      <g transform="translate(18, -18)">
        <rect x="0" y="0" width="14" height="18" fill="#1d4ed8" rx="1" stroke="#172554" strokeWidth="0.6" />
        
        {/* DIP slide switches */}
        {[0, 1, 2, 3].map(idx => {
          const switchY = 2.2 + idx * 3.8;
          return (
            <g key={idx}>
              <rect x="1.5" y={switchY} width="11" height="1.8" fill="#0f172a" />
              {/* Toggle switch (white) */}
              <rect x={idx === 2 ? "7" : "2.5"} y={switchY - 0.5} width="4.5" height="2.8" fill="#ffffff" rx="0.3" stroke="#94a3b8" strokeWidth="0.3" />
            </g>
          );
        })}
        {/* Switch Numbers 1-4 */}
        <g fill="#ffffff" fontSize="2.8" fontFamily="monospace" textAnchor="end" opacity="0.8">
          <text x="-2" y="3.8">4</text>
          <text x="-2" y="7.6">3</text>
          <text x="-2" y="11.4">2</text>
          <text x="-2" y="15.2">1</text>
        </g>
        {/* ON / OFF labels */}
        <text x="1.5" y="22" fill="#ffffff" fontSize="3" fontFamily="sans-serif">ON</text>
        <text x="12.5" y="22" fill="#ffffff" fontSize="3" fontFamily="sans-serif" textAnchor="end">OFF</text>
      </g>

      {/* 6. Switch control labels (Middle Center) */}
      <g transform="translate(1, -12)" fill="#ffffff" fontSize="2.8" fontFamily="sans-serif" textAnchor="middle">
        <text x="0" y="-10" fontWeight="bold">TRIG CONTROL</text>
        <text x="0" y="-6">12V / 24V</text>
        <text x="0" y="-2">SEC / MIN</text>
        <text x="0" y="2" fontWeight="bold">RELAY CONTROL</text>
      </g>

      {/* 7. Capacitor C3 (Top center blue cylinder) */}
      <g transform="translate(4, -30)">
        <circle cx="0" cy="0" r="4.2" fill="#2563eb" stroke="#1d4ed8" strokeWidth="0.4" />
        <circle cx="0" cy="0" r="3.5" fill="#93c5fd" />
        <line x1="-2.5" y1="0" x2="2.5" y2="0" stroke="#1e293b" strokeWidth="0.6" />
        <line x1="0" y1="-2.5" x2="0" y2="2.5" stroke="#1e293b" strokeWidth="0.6" />
      </g>

      {/* 8. Jumper J3 (Middle Center-Left) */}
      <g transform="translate(-10, 4)">
        <text x="0" y="-3" fill="#ffffff" fontSize="2.8" fontFamily="monospace" textAnchor="middle">CUT J3 FOR RESET ON POWER-UP</text>
        <line x1="-12" y1="1" x2="12" y2="1" stroke="#d1d5db" strokeWidth="0.5" />
        <rect x="-4" y="-0.5" width="8" height="2" fill="#d97706" rx="0.5" />
        <text x="16" y="2" fill="#ffffff" fontSize="3" fontFamily="monospace">J3</text>
      </g>

      {/* 9. Potentiometer Adjuster (Middle Left) */}
      <g transform="translate(-28, -26)">
        {/* Scale labels */}
        <text x="0" y="-10" fill="#ffffff" fontSize="3.5" fontFamily="monospace" textAnchor="middle">45</text>
        <text x="10" y="-4" fill="#ffffff" fontSize="3.5" fontFamily="monospace">60</text>
        <text x="-10" y="12" fill="#ffffff" fontSize="3.5" fontFamily="monospace" textAnchor="middle">15</text>
        <text x="8" y="12" fill="#ffffff" fontSize="3.5" fontFamily="monospace" textAnchor="middle">1</text>
        
        {/* Silver metal bracket clip */}
        <rect x="-7" y="-7" width="14" height="14" fill="none" stroke="#d1d5db" strokeWidth="0.6" />
        <circle cx="0" cy="0" r="8.5" fill="#f1f5f9" stroke="#94a3b8" strokeWidth="0.4" />
        {/* Cogwheel teeth */}
        {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map(deg => (
          <rect key={deg} x="-0.6" y="-9.5" width="1.2" height="1.2" fill="#cbd5e1" transform={`rotate(${deg})`} />
        ))}
        {/* Inside rotor slot */}
        <circle cx="0" cy="0" r="6" fill="#ffffff" stroke="#cbd5e1" strokeWidth="0.4" />
        <line x1="-4" y1="0" x2="4" y2="0" stroke="#94a3b8" strokeWidth="1" />
        
        {/* Dynamic Pointer slot indicator */}
        <line
          x1="0"
          y1="0"
          x2="0"
          y2="-6"
          stroke="#1e6091"
          strokeWidth="1.5"
          strokeLinecap="round"
          transform={`rotate(${angle})`}
        />
      </g>

      {/* 10. Capacitor C4 (Bottom Left) */}
      <g transform="translate(-14, 22)">
        <circle cx="0" cy="0" r="4.2" fill="#2563eb" stroke="#1d4ed8" strokeWidth="0.4" />
        <circle cx="0" cy="0" r="3.5" fill="#93c5fd" />
        <line x1="-2.5" y1="0" x2="2.5" y2="0" stroke="#1e293b" strokeWidth="0.6" />
        <line x1="0" y1="-2.5" x2="0" y2="2.5" stroke="#1e293b" strokeWidth="0.6" />
      </g>

      {/* 11. Text branding */}
      <text x="-40" y="18" fill="#ffffff" fontSize="7" fontWeight="bold" fontFamily="sans-serif">6062</text>
      <text x="-40" y="24" fill="#ffffff" fontSize="5.5" fontWeight="bold" fontFamily="sans-serif">TIMER</text>
      <text x="0" y="31" fill="#ffffff" fontSize="5.5" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif" letterSpacing="0.04em">ALTRONIX CORP.</text>

      {/* 12. Stetron White Relay Box (Bottom Right) */}
      <g transform="translate(25, 16)" filter={isEnergized ? "drop-shadow(0 0 6px rgba(59,130,246,0.65))" : "none"}>
        <rect
          x="-15"
          y="-18"
          width="30"
          height="36"
          rx="1"
          fill="#ffffff"
          stroke={isEnergized ? "#60a5fa" : "#e2e8f0"}
          strokeWidth="1.2"
        />
        {/* Red branding texts matching real STETRON box */}
        <text x="0" y="-12" fill="#ef4444" fontSize="2.8" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">STETRON</text>
        <text x="0" y="-7" fill="#000000" fontSize="2.2" textAnchor="middle" fontFamily="sans-serif">SR11CS12DC12SR</text>
        <text x="0" y="-2" fill="#000000" fontSize="2.2" textAnchor="middle" fontFamily="sans-serif">12A/12VDC</text>
        <text x="0" y="3" fill="#ef4444" fontSize="2" textAnchor="middle" fontFamily="sans-serif">MADE IN CHINA</text>
        
        {/* Dynamic Countdown Text overlayed cleanly inside relay box */}
        <rect x="-11" y="7" width="22" height="7" fill="#090d16" rx="1" />
        <text
          x="0"
          y="12"
          textAnchor="middle"
          fill={isDelayedActive ? '#10b981' : isEnergized ? '#eab308' : '#64748b'}
          fontSize="4.5"
          fontWeight="bold"
          fontFamily="monospace"
        >
          {isDelayedActive ? 'TRIP' : isEnergized ? `${timeLeft}` : 'READY'}
        </text>
      </g>

      {/* 13. Terminal Strip casing at the bottom (aligned to y=40) */}
      <g transform="translate(0, 40)">
        {/* Black casing partitions */}
        <rect x="-48" y="-6" width="96" height="12" fill="#1c1917" stroke="#292524" strokeWidth="0.8" rx="0.5" />
        
        {/* 6 separate terminal cells with dividers & metal screws */}
        {[-40, -24, -8, 8, 24, 40].map((xOffset, idx) => (
          <g key={idx} transform={`translate(${xOffset}, 0)`}>
            {/* Divider lines */}
            <line x1="-8" y1="-6" x2="-8" y2="6" stroke="#44403c" strokeWidth="0.8" />
            <line x1="8" y1="-6" x2="8" y2="6" stroke="#44403c" strokeWidth="0.8" />
            
            {/* Screw terminal metal pad */}
            <circle cx="0" cy="0" r="3.2" fill="url(#screwGrad)" stroke="#57534e" strokeWidth="0.4" />
            <line x1="-2.2" y1="-0.8" x2="2.2" y2="0.8" stroke="#292524" strokeWidth="0.8" />
          </g>
        ))}

        {/* Outer casing outline */}
        <rect x="-48" y="-6" width="96" height="12" fill="none" stroke="#000000" strokeWidth="0.4" />

        {/* Clean white text labels printed directly on the blue board below the casing (at y=53 relative to center) */}
        <g fill="#ffffff" fontSize="4.8" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif" transform="translate(0, 13)">
          <text x="-40" y="0">TRIG</text>
          <text x="-24" y="0">-</text>
          <text x="-8" y="0">+</text>
          <text x="8" y="0">NO</text>
          <text x="24" y="0">C</text>
          <text x="40" y="0">NC</text>
        </g>
      </g>

      {/* Silver gradient for screw heads */}
      <defs>
        <linearGradient id="screwGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#e5e5e5" />
          <stop offset="50%" stopColor="#a3a3a3" />
          <stop offset="100%" stopColor="#525252" />
        </linearGradient>
      </defs>
    </g>
  );
};
export default TimerRelay;
