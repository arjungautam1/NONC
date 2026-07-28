import React from 'react';
import type { CircuitComponent } from '../../../types/game';
import { useGameStore } from '../../../store/useGameStore';

interface ComponentProps {
  component: CircuitComponent;
  isEnergized?: boolean;
}

export const SecoLarmSirenStrobe: React.FC<ComponentProps> = ({ component, isEnergized }) => {
  const nodeVoltages = useGameStore(state => state.simulation.nodeVoltages);
  const isRunning = useGameStore(state => state.isRunning);

  // Check terminal keys for individual mode activation (Red = Siren+Strobe, Green = Strobe Only, Black = Neg)
  const redKey = `${component.id}:red`;
  const greenKey = `${component.id}:green`;
  const blackKey = `${component.id}:black`;

  // Fallback for 2-wire (+) and (-) terminal configuration
  const posKey = `${component.id}:pos`;
  const negKey = `${component.id}:neg`;

  const redVoltage = nodeVoltages[redKey] ?? nodeVoltages[posKey] ?? 0;
  const greenVoltage = nodeVoltages[greenKey] ?? 0;
  const blackVoltage = nodeVoltages[blackKey] ?? nodeVoltages[negKey] ?? 0;

  // Active state evaluation
  const hasRedPower = isRunning && redVoltage > 4 && blackVoltage === 0;
  const hasGreenPower = isRunning && greenVoltage > 4 && blackVoltage === 0;

  // Siren sounds on Red terminal (+), Strobe flashes on Red or Green (+)
  const sirenActive = hasRedPower || Boolean(component.state.sirenActive);
  const strobeActive = hasRedPower || hasGreenPower || Boolean(component.state.strobeActive) || Boolean(isEnergized);

  const lensGradId = `secoLensGrad-${component.id}`;
  const strobeGlowId = `secoStrobeGlow-${component.id}`;

  return (
    <g transform="translate(-45, -70)" className="select-none">
      <defs>
        {/* White glossy housing gradient */}
        <linearGradient id="secoHousingGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="60%" stopColor="#f1f5f9" />
          <stop offset="100%" stopColor="#cbd5e1" />
        </linearGradient>

        {/* Translucent Red Fresnel Lens Gradient */}
        <linearGradient id={lensGradId} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#ef4444" stopOpacity="0.95" />
          <stop offset="50%" stopColor="#dc2626" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#991b1b" stopOpacity="0.98" />
        </linearGradient>

        {/* Active Strobe Light Glow Gradient */}
        <radialGradient id={strobeGlowId} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="1" />
          <stop offset="35%" stopColor="#fca5a5" stopOpacity="0.9" />
          <stop offset="70%" stopColor="#ef4444" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#dc2626" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Main Base Shadow */}
      <rect x="3" y="3" width="84" height="134" rx="10" fill="#090d16" opacity="0.3" filter="blur(3px)" />

      {/* Main White High-Impact Housing Frame */}
      <rect
        x="5"
        y="5"
        width="80"
        height="130"
        rx="8"
        fill="url(#secoHousingGrad)"
        stroke="#cbd5e1"
        strokeWidth="1.5"
        filter="drop-shadow(0 4px 8px rgba(0,0,0,0.3))"
      />

      {/* Top Center Recessed Screw Mounting Hole */}
      <circle cx="45" cy="22" r="5.5" fill="#334155" stroke="#94a3b8" strokeWidth="1" />
      <circle cx="45" cy="22" r="3.5" fill="#0f172a" />
      <line x1="43" y1="22" x2="47" y2="22" stroke="#475569" strokeWidth="1.2" />

      {/* Brand Header */}
      <text x="45" y="38" fill="#1e293b" fontSize="6.5" fontWeight="900" fontFamily="sans-serif" textAnchor="middle" letterSpacing="0.8">
        SECO-LARM
      </text>
      <text x="45" y="45" fill="#64748b" fontSize="5" fontWeight="700" fontFamily="monospace" textAnchor="middle">
        MINI STROBE SIREN
      </text>

      {/* Model Spec Badge */}
      <rect x="18" y="50" width="54" height="14" rx="2" fill="#ffffff" stroke="#cbd5e1" strokeWidth="0.8" />
      <text x="45" y="59" fill="#0f172a" fontSize="5.5" fontWeight="800" fontFamily="monospace" textAnchor="middle">
        SL-1312-SA/R
      </text>
      <text x="45" y="68" fill="#64748b" fontSize="4.2" fontWeight="700" fontFamily="sans-serif" textAnchor="middle">
        12VDC · 60mA · 100dB
      </text>

      {/* ---- Translucent Red Optic Lens Assembly ---- */}
      <g transform="translate(0, 5)">
        {/* Lens Back Housing Chamber */}
        <rect x="9" y="70" width="72" height="52" rx="6" fill="#450a0a" stroke="#7f1d1d" strokeWidth="1" />

        {/* 4 Strobe LED Reflectors inside lens */}
        <circle cx="25" cy="84" r="5" fill="#fef08a" stroke="#ca8a04" strokeWidth="0.8" />
        <circle cx="65" cy="84" r="5" fill="#fef08a" stroke="#ca8a04" strokeWidth="0.8" />
        <circle cx="25" cy="106" r="5" fill="#fef08a" stroke="#ca8a04" strokeWidth="0.8" />
        <circle cx="65" cy="106" r="5" fill="#fef08a" stroke="#ca8a04" strokeWidth="0.8" />

        {/* Piezo Siren Horn element centered inside lens chamber */}
        <circle cx="45" cy="95" r="11" fill="#1e293b" stroke="#475569" strokeWidth="1" />
        <circle cx="45" cy="95" r="7" fill="#0f172a" />
        <circle cx="45" cy="95" r="3" fill="#334155" />

        {/* Main Red Optic Lens Body with curved top lip */}
        <path
          d="M 9 82 Q 45 74 81 82 L 81 116 Q 81 122 75 122 L 15 122 Q 9 122 9 116 Z"
          fill={`url(#${lensGradId})`}
          stroke="#b91c1c"
          strokeWidth="1.2"
        />

        {/* Fresnel Lens Optics Grooves */}
        <line x1="12" y1="92" x2="78" y2="92" stroke="#fca5a5" strokeWidth="0.6" opacity="0.4" />
        <line x1="12" y1="100" x2="78" y2="100" stroke="#fca5a5" strokeWidth="0.6" opacity="0.4" />
        <line x1="12" y1="108" x2="78" y2="108" stroke="#fca5a5" strokeWidth="0.6" opacity="0.4" />
        <line x1="30" y1="80" x2="30" y2="118" stroke="#fca5a5" strokeWidth="0.6" opacity="0.3" />
        <line x1="60" y1="80" x2="60" y2="118" stroke="#fca5a5" strokeWidth="0.6" opacity="0.3" />
      </g>

      {/* Realistic 400 FPM (0.15s pulse) High-Speed Strobe & Siren CSS Animations */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes secoStrobeBurst {
          0% {
            opacity: 1;
            filter: drop-shadow(0 0 35px #ef4444) drop-shadow(0 0 15px #ffffff);
            transform: scale(1.06);
          }
          12% {
            opacity: 0.95;
            filter: drop-shadow(0 0 25px #ef4444);
            transform: scale(1.03);
          }
          25% {
            opacity: 0.05;
            filter: drop-shadow(0 0 2px #ef4444);
            transform: scale(1.0);
          }
          100% {
            opacity: 0.05;
            filter: drop-shadow(0 0 2px #ef4444);
            transform: scale(1.0);
          }
        }
        @keyframes secoLedFlash {
          0% {
            opacity: 1;
            fill: #ffffff;
            filter: drop-shadow(0 0 12px #ffffff) drop-shadow(0 0 20px #ef4444);
          }
          15% {
            opacity: 0.15;
            fill: #fca5a5;
            filter: none;
          }
          100% {
            opacity: 0.15;
            fill: #fca5a5;
            filter: none;
          }
        }
        @keyframes secoAmbientFlash {
          0% {
            opacity: 0.85;
            transform: scale(1.15);
          }
          20% {
            opacity: 0.08;
            transform: scale(1.0);
          }
          100% {
            opacity: 0.08;
            transform: scale(1.0);
          }
        }
        @keyframes secoSirenWaves {
          0% {
            opacity: 0.2;
            stroke-width: 1.8px;
          }
          50% {
            opacity: 1.0;
            stroke-width: 3.8px;
          }
          100% {
            opacity: 0.2;
            stroke-width: 1.8px;
          }
        }
        .seco-strobe-active {
          animation: secoStrobeBurst 0.15s infinite linear;
          transform-origin: 45px 98px;
        }
        .seco-led-flash {
          animation: secoLedFlash 0.15s infinite linear;
        }
        .seco-ambient-flash {
          animation: secoAmbientFlash 0.15s infinite linear;
          transform-origin: 45px 98px;
        }
        .seco-siren-wave {
          animation: secoSirenWaves 0.25s infinite ease-in-out;
        }
      ` }} />

      {/* Strobe Active Flashing Light Effect */}
      {strobeActive && (
        <g pointerEvents="none">
          {/* Ambient Room/Wall Strobe Flash Aura */}
          <circle cx="45" cy="98" r="62" fill="url(#secoStrobeGlow)" className="seco-ambient-flash" />
          {/* Intense Lens Strobe Burst */}
          <circle cx="45" cy="98" r="48" fill={`url(#${strobeGlowId})`} className="seco-strobe-active" />
          {/* Synchronized 4-LED Flash Hotspots */}
          <circle cx="25" cy="89" r="8" className="seco-led-flash" />
          <circle cx="65" cy="89" r="8" className="seco-led-flash" />
          <circle cx="25" cy="111" r="8" className="seco-led-flash" />
          <circle cx="65" cy="111" r="8" className="seco-led-flash" />
        </g>
      )}

      {/* Siren Sound Wave Pulses (when Red (+) energized) */}
      {sirenActive && (
        <g className="seco-siren-wave" pointerEvents="none">
          <path d="M 2 -5 A 50 50 0 0 0 2 135" fill="none" stroke="#ef4444" strokeWidth="3" strokeLinecap="round" opacity="0.9" />
          <path d="M -8 -15 A 65 65 0 0 0 -8 145" fill="none" stroke="#f87171" strokeWidth="2" strokeLinecap="round" opacity="0.7" />
          <path d="M 88 -5 A 50 50 0 0 1 88 135" fill="none" stroke="#ef4444" strokeWidth="3" strokeLinecap="round" opacity="0.9" />
          <path d="M 98 -15 A 65 65 0 0 1 98 145" fill="none" stroke="#f87171" strokeWidth="2" strokeLinecap="round" opacity="0.7" />
        </g>
      )}

      {/* Terminal Screw Plate Base */}
      <rect x="12" y="125" width="66" height="15" rx="3" fill="#0f172a" stroke="#334155" strokeWidth="1" />

      {/* 3 Terminals: Red (+ Siren/Strobe), Green (+ Strobe Only), Black (- Negative) */}
      {component.terminals.length === 2 ? (
        // Standard 2-Wire Red / Black Configuration
        <>
          <g transform="translate(25, 132.5)">
            <circle cx="0" cy="0" r="4.5" fill="#ef4444" stroke="#991b1b" strokeWidth="0.8" />
            <line x1="-2.5" y1="0" x2="2.5" y2="0" stroke="#ffffff" strokeWidth="1" />
            <line x1="0" y1="-2.5" x2="0" y2="2.5" stroke="#ffffff" strokeWidth="1" />
            <text x="0" y="11" fill="#f87171" fontSize="5.5" fontWeight="900" fontFamily="monospace" textAnchor="middle">RED(+)</text>
          </g>
          <g transform="translate(65, 132.5)">
            <circle cx="0" cy="0" r="4.5" fill="#1e293b" stroke="#475569" strokeWidth="0.8" />
            <line x1="-2.5" y1="0" x2="2.5" y2="0" stroke="#ffffff" strokeWidth="1" />
            <text x="0" y="11" fill="#cbd5e1" fontSize="5.5" fontWeight="900" fontFamily="monospace" textAnchor="middle">BLK(-)</text>
          </g>
        </>
      ) : (
        // Full 3-Wire Panel Configuration (Red = Siren/Strobe, Green = Strobe Only, Black = Neg)
        <>
          <g transform="translate(23, 132.5)">
            <circle cx="0" cy="0" r="4" fill="#ef4444" stroke="#991b1b" strokeWidth="0.8" />
            <line x1="-2" y1="0" x2="2" y2="0" stroke="#ffffff" strokeWidth="1" />
            <line x1="0" y1="-2" x2="0" y2="2" stroke="#ffffff" strokeWidth="1" />
            <text x="0" y="11" fill="#f87171" fontSize="4.8" fontWeight="900" fontFamily="monospace" textAnchor="middle">RED</text>
          </g>
          <g transform="translate(45, 132.5)">
            <circle cx="0" cy="0" r="4" fill="#22c55e" stroke="#15803d" strokeWidth="0.8" />
            <line x1="-2" y1="0" x2="2" y2="0" stroke="#ffffff" strokeWidth="1" />
            <line x1="0" y1="-2" x2="0" y2="2" stroke="#ffffff" strokeWidth="1" />
            <text x="0" y="11" fill="#4ade80" fontSize="4.8" fontWeight="900" fontFamily="monospace" textAnchor="middle">GRN</text>
          </g>
          <g transform="translate(67, 132.5)">
            <circle cx="0" cy="0" r="4" fill="#1e293b" stroke="#475569" strokeWidth="0.8" />
            <line x1="-2" y1="0" x2="2" y2="0" stroke="#ffffff" strokeWidth="1" />
            <text x="0" y="11" fill="#cbd5e1" fontSize="4.8" fontWeight="900" fontFamily="monospace" textAnchor="middle">BLK</text>
          </g>
        </>
      )}

      {/* Component Label Badge */}
      <g transform="translate(45, 154)" pointerEvents="none">
        <rect x="-42" y="-8" width="84" height="16" rx="4" fill="#070b13" fillOpacity="0.95" stroke="#334155" strokeWidth="1" />
        <text
          x="0"
          y="3"
          fill="#f1f5f9"
          fontSize="7.5"
          fontWeight="800"
          textAnchor="middle"
          fontFamily="monospace"
        >
          {component.label}
        </text>
      </g>
    </g>
  );
};

export default SecoLarmSirenStrobe;
