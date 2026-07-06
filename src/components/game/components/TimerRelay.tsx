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
      <circle cx="-45" cy="-55" r="1.4" fill="#0f172a" />
      
      <circle cx="45" cy="55" r="2.8" fill="#eab308" stroke="#ca8a04" strokeWidth="0.5" />
      <circle cx="45" cy="55" r="1.4" fill="#0f172a" />

      {/* 2. Top-Center Jumpers J1 and J2 */}
      <g transform="translate(10, -50)">
        {/* Texts */}
        <text x="-2" y="-3" fill="#ffffff" fontSize="3" fontFamily="monospace" textAnchor="end">CUT J1 FOR REPEAT</text>
        <text x="18" y="-3" fill="#ffffff" fontSize="3" fontFamily="monospace">J1</text>
        <text x="-2" y="5" fill="#ffffff" fontSize="3" fontFamily="monospace" textAnchor="end">CUT J2 FOR DELAYED PULS</text>
        <text x="18" y="5" fill="#ffffff" fontSize="3" fontFamily="monospace">J2</text>
        
        {/* Resistors (J1 & J2) */}
        <line x1="0" y1="-4" x2="16" y2="-4" stroke="#d1d5db" strokeWidth="0.6" />
        <rect x="4" y="-5.5" width="8" height="3" fill="#d97706" rx="0.5" />
        <line x1="6.5" y1="-5.5" x2="6.5" y2="-2.5" stroke="#f59e0b" strokeWidth="0.5" />
        
        <line x1="0" y1="4" x2="16" y2="4" stroke="#d1d5db" strokeWidth="0.6" />
        <rect x="4" y="2.5" width="8" height="3" fill="#d97706" rx="0.5" />
        <line x1="6.5" y1="2.5" x2="6.5" y2="5.5" stroke="#f59e0b" strokeWidth="0.5" />
      </g>

      {/* 3. Altronix Logo & Location (Top Right) */}
      <g transform="translate(36, -38)">
        {/* Logo Icon */}
        <circle cx="0" cy="0" r="6.5" fill="none" stroke="#ffffff" strokeWidth="0.8" />
        <circle cx="0" cy="0" r="3.5" fill="none" stroke="#ffffff" strokeWidth="0.6" />
        <line x1="0" y1="-6.5" x2="0" y2="6.5" stroke="#ffffff" strokeWidth="0.6" />
        
        <text x="-10" y="-1" fill="#ffffff" fontSize="4.2" fontWeight="bold" textAnchor="end" fontFamily="sans-serif">MADE IN U.S.A.</text>
        <text x="-10" y="4" fill="#ffffff" fontSize="3.8" textAnchor="end" fontFamily="sans-serif">BKLYN,NY 11220</text>
      </g>

      {/* 4. Red LED (Top Right) */}
      <g transform="translate(38, -20)">
        {/* LED base black block */}
        <rect x="-3.5" y="-3" width="7" height="6" fill="#18181b" rx="0.5" />
        {/* Red LED dome */}
        <circle cx="0" cy="0" r="3" fill={isEnergized ? '#ef4444' : '#7f1d1d'} stroke={isEnergized ? '#fca5a5' : '#450a0a'} strokeWidth="0.5" />
        <circle cx="-0.8" cy="-0.8" r="0.8" fill="#ffffff" opacity="0.6" />
      </g>

      {/* 5. DIP Switch Block (Middle Right) */}
      <g transform="translate(20, -10)">
        <rect x="0" y="0" width="16" height="20" fill="#1d4ed8" rx="1" stroke="#172554" strokeWidth="0.8" />
        
        {/* DIP slide switches */}
        {[0, 1, 2, 3].map(idx => {
          const switchY = 2.5 + idx * 4.2;
          return (
            <g key={idx}>
              <rect x="2" y={switchY} width="12" height="2" fill="#0f172a" />
              {/* Toggle switch (white) */}
              <rect x={idx === 2 ? "8" : "3"} y={switchY - 0.6} width="5" height="3.2" fill="#ffffff" rx="0.3" stroke="#94a3b8" strokeWidth="0.3" />
            </g>
          );
        })}
        {/* Switch Numbers 1-4 */}
        <g fill="#ffffff" fontSize="3" fontFamily="monospace" textAnchor="end" opacity="0.8">
          <text x="-2" y="4.5">4</text>
          <text x="-2" y="8.7">3</text>
          <text x="-2" y="12.9">2</text>
          <text x="-2" y="17.1">1</text>
        </g>
        {/* ON / OFF labels */}
        <text x="2" y="24" fill="#ffffff" fontSize="3.2" fontFamily="sans-serif">ON</text>
        <text x="14" y="24" fill="#ffffff" fontSize="3.2" fontFamily="sans-serif" textAnchor="end">OFF</text>
      </g>

      {/* 6. Switch control labels (Middle Center) */}
      <g transform="translate(1, -6)" fill="#ffffff" fontSize="3.2" fontFamily="sans-serif" textAnchor="middle">
        <text x="0" y="-12" fontWeight="bold">TRIG CONTROL</text>
        <text x="0" y="-7.5">12V / 24V</text>
        <text x="0" y="-3">SEC / MIN</text>
        <text x="0" y="1.5" fontWeight="bold">RELAY CONTROL</text>
      </g>

      {/* 7. Capacitor C3 (Top center blue cylinder) */}
      <g transform="translate(6, -26)">
        <circle cx="0" cy="0" r="5" fill="#2563eb" stroke="#1d4ed8" strokeWidth="0.5" />
        <circle cx="0" cy="0" r="4.2" fill="#93c5fd" />
        <line x1="-3" y1="0" x2="3" y2="0" stroke="#1e293b" strokeWidth="0.8" />
        <line x1="0" y1="-3" x2="0" y2="3" stroke="#1e293b" strokeWidth="0.8" />
      </g>

      {/* 8. Jumper J3 (Middle Center-Left) */}
      <g transform="translate(-10, 10)">
        <text x="0" y="-3" fill="#ffffff" fontSize="3" fontFamily="monospace" textAnchor="middle">CUT J3 FOR RESET ON POWER-UP</text>
        <line x1="-12" y1="1" x2="12" y2="1" stroke="#d1d5db" strokeWidth="0.5" />
        <rect x="-4" y="-0.5" width="8" height="2" fill="#d97706" rx="0.5" />
        <text x="16" y="2" fill="#ffffff" fontSize="3.2" fontFamily="monospace">J3</text>
      </g>

      {/* 9. Potentiometer Adjuster (Middle Left) */}
      <g transform="translate(-28, -20)">
        {/* Scale labels */}
        <text x="0" y="-11" fill="#ffffff" fontSize="4" fontFamily="monospace" textAnchor="middle">45</text>
        <text x="12" y="-4" fill="#ffffff" fontSize="4" fontFamily="monospace">60</text>
        <text x="-12" y="14" fill="#ffffff" fontSize="4" fontFamily="monospace" textAnchor="middle">15</text>
        <text x="10" y="14" fill="#ffffff" fontSize="4" fontFamily="monospace" textAnchor="middle">1</text>
        
        {/* Silver metal bracket clip */}
        <rect x="-8" y="-8" width="16" height="16" fill="none" stroke="#d1d5db" strokeWidth="0.8" />
        <circle cx="0" cy="0" r="10" fill="#f1f5f9" stroke="#94a3b8" strokeWidth="0.5" />
        {/* Cogwheel teeth */}
        {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map(deg => (
          <rect key={deg} x="-0.8" y="-11" width="1.6" height="1.5" fill="#cbd5e1" transform={`rotate(${deg})`} />
        ))}
        {/* Inside rotor slot */}
        <circle cx="0" cy="0" r="7.5" fill="#ffffff" stroke="#cbd5e1" strokeWidth="0.5" />
        <line x1="-5" y1="0" x2="5" y2="0" stroke="#94a3b8" strokeWidth="1.2" />
        
        {/* Dynamic Pointer slot indicator */}
        <line
          x1="0"
          y1="0"
          x2="0"
          y2="-7"
          stroke="#1e6091"
          strokeWidth="1.8"
          strokeLinecap="round"
          transform={`rotate(${angle})`}
        />
      </g>

      {/* 10. Capacitor C4 (Bottom Left) */}
      <g transform="translate(-28, 20)">
        <circle cx="0" cy="0" r="5" fill="#2563eb" stroke="#1d4ed8" strokeWidth="0.5" />
        <circle cx="0" cy="0" r="4.2" fill="#93c5fd" />
        <line x1="-3" y1="0" x2="3" y2="0" stroke="#1e293b" strokeWidth="0.8" />
        <line x1="0" y1="-3" x2="0" y2="3" stroke="#1e293b" strokeWidth="0.8" />
      </g>


      {/* 11. Text branding */}
      <text x="-28" y="32" fill="#ffffff" fontSize="8" fontWeight="bold" fontFamily="sans-serif">6062</text>
      <text x="-28" y="39" fill="#ffffff" fontSize="6.5" fontWeight="bold" fontFamily="sans-serif">TIMER</text>
      <text x="0" y="46" fill="#ffffff" fontSize="6.5" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif" letterSpacing="0.05em">ALTRONIX CORP.</text>

      {/* 12. Stetron White Relay Box (Bottom Right) */}
      <g transform="translate(24, 25)" filter={isEnergized ? "drop-shadow(0 0 6px rgba(59,130,246,0.65))" : "none"}>
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
        <text x="0" y="-10" fill="#ef4444" fontSize="3" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">STETRON</text>
        <text x="0" y="-5" fill="#000000" fontSize="2.5" textAnchor="middle" fontFamily="sans-serif">SR11CS12DC12SR</text>
        <text x="0" y="0" fill="#000000" fontSize="2.5" textAnchor="middle" fontFamily="sans-serif">12A/12VDC</text>
        <text x="0" y="5" fill="#ef4444" fontSize="2.2" textAnchor="middle" fontFamily="sans-serif">MADE IN CHINA</text>
        
        {/* Dynamic Countdown Text overlayed cleanly inside relay box */}
        <rect x="-11" y="9" width="22" height="7" fill="#090d16" rx="1" />
        <text
          x="0"
          y="14"
          textAnchor="middle"
          fill={isDelayedActive ? '#10b981' : isEnergized ? '#eab308' : '#64748b'}
          fontSize="4.8"
          fontWeight="bold"
          fontFamily="monospace"
        >
          {isDelayedActive ? 'TRIP' : isEnergized ? `${timeLeft}` : 'READY'}
        </text>
      </g>

      {/* 13. Terminal Strip casing at the bottom */}
      <g transform="translate(0, 52)">
        {/* Black partitions base */}
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

        {/* Outer casing base outline */}
        <rect x="-48" y="-6" width="96" height="12" fill="none" stroke="#000000" strokeWidth="0.4" />

        {/* Clean white text labels below screws */}
        <g fill="#ffffff" fontSize="5" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">
          <text x="-40" y="-8">TRG</text>
          <text x="-24" y="-8">-</text>
          <text x="-8" y="-8">+</text>
          <text x="8" y="-8">NO</text>
          <text x="24" y="-8">C</text>
          <text x="40" y="-8">NC</text>
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
