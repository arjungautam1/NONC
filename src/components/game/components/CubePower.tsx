import React from 'react';
import type { CircuitComponent } from '../../../types/game';
import { useGameStore } from '../../../store/useGameStore';
import { CUBE_POWER_PINS } from './cubePowerPinout';

interface CubePowerProps {
  component: CircuitComponent;
  isEnergized: boolean;
}

/**
 * CDVI CUBE POWER — Bluetooth stand-alone 1-relay wireless receiver.
 * `isEnergized` reflects board power on 0V/12-24V (drives the green LED, per
 * the manual's "Steady GREEN = Power ON"). The relay itself is switched
 * wirelessly by a paired transmitter or the UserCUBE app, not by a wired
 * input, so the simulator represents that with a manual trigger pad that
 * toggles `state.relayTriggered` (Latch mode) — only live once powered.
 */
export const CubePower: React.FC<CubePowerProps> = ({ component, isEnergized }) => {
  const setComponentState = useGameStore(state => state.setComponentState);
  const isTriggered = Boolean(component.state.relayTriggered);

  const handlePointerDown = (e: React.PointerEvent) => {
    e.stopPropagation();
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    e.stopPropagation();
    if (!isEnergized) return;
    setComponentState(component.id, 'relayTriggered', !isTriggered);
  };

  const ledColor = !isEnergized ? '#3f3f46' : isTriggered ? '#f97316' : '#22c55e';
  const ledGlow = isEnergized ? `drop-shadow(0 0 4px ${isTriggered ? '#f97316' : '#22c55e'})` : 'none';

  return (
    <g className="select-none">
      {/* ---- Vertical 5-pole screw terminal strip on the left edge ---- */}
      <rect x="-58" y="-54" width="24" height="108" rx="1.5" fill="#0e1a12" stroke="#22331f" strokeWidth="0.8" />
      {CUBE_POWER_PINS.map(({ id, label, y }) => (
        <g key={id}>
          <rect x="-58" y={y - 9} width="24" height="18" rx="1" fill="#16281a" stroke="#3a5a34" strokeWidth="0.5" />
          <rect x="-54.5" y={y - 6} width="17" height="12" rx="0.8" fill="#8f97a6" />
          <circle cx="-46" cy={y} r="5" fill="#c3cad6" stroke="#5b6373" strokeWidth="0.6" />
          <path d={`M -49.5 ${y} L -42.5 ${y}`} stroke="#4a5262" strokeWidth="1.4" strokeLinecap="round" />
          <path d={`M -46 ${y - 3.5} L -46 ${y + 3.5}`} stroke="#4a5262" strokeWidth="1.4" strokeLinecap="round" />
          {/* Legend printed outboard, to the left of the strip — clear of both the
              screw circles and the enclosure so it never overlaps neighboring rows. */}
          <text x="-63" y={y + 2.4} fill="#e2e8f0" fontSize="6.4" fontWeight="800" fontFamily="sans-serif" textAnchor="end">
            {label}
          </text>
        </g>
      ))}

      {/* ---- Black plastic enclosure ---- */}
      <rect x="-34" y="-62" width="78" height="124" rx="6" fill="#1c1c1f" stroke="#000000" strokeWidth="1.4" filter="drop-shadow(1px 3px 5px rgba(0,0,0,0.4))" />
      <rect x="-30" y="-58" width="70" height="116" rx="4" fill="#232326" opacity="0.6" />

      {/* Mounting ears */}
      <g>
        <rect x="-38" y="-70" width="14" height="12" rx="2" fill="#1c1c1f" stroke="#000" strokeWidth="1" />
        <circle cx="-31" cy="-64" r="2.6" fill="#0a0a0a" stroke="#3f3f46" strokeWidth="0.5" />
        <rect x="24" y="58" width="14" height="12" rx="2" fill="#1c1c1f" stroke="#000" strokeWidth="1" />
        <circle cx="31" cy="64" r="2.6" fill="#0a0a0a" stroke="#3f3f46" strokeWidth="0.5" />
      </g>

      {/* ---- Branding ---- */}
      <text x="3" y="-38" fill="#f4f4f5" fontSize="9.5" fontWeight="900" fontFamily="sans-serif" textAnchor="middle">CUBE</text>
      <text x="3" y="-27" fill="#60a5fa" fontSize="7" fontWeight="800" fontFamily="sans-serif" textAnchor="middle" letterSpacing="0.5">POWER</text>
      <text x="3" y="-17" fill="#6b7280" fontSize="4" fontWeight="600" fontFamily="monospace" textAnchor="middle">CDVI · BLE</text>

      {/* Bluetooth glyph */}
      <g transform="translate(28, -47)" opacity="0.85">
        <path
          d="M 0 -6 L 3.4 -3 L 0 0 L 3.4 3 L 0 6 L 0 -6 M 0 0 L -3.4 -3 M 0 0 L -3.4 3"
          fill="none"
          stroke="#3b82f6"
          strokeWidth="1"
          strokeLinejoin="round"
          strokeLinecap="round"
        />
      </g>

      {/* ---- Status LED ---- */}
      <circle cx="-14" cy="8" r="4.4" fill="#0a0a0a" stroke="#000" strokeWidth="0.6" />
      <circle
        cx="-14"
        cy="8"
        r="3.1"
        fill={ledColor}
        style={{ filter: ledGlow, transition: 'fill 150ms ease' }}
        className={isEnergized && isTriggered ? 'animate-pulse' : ''}
      />
      <text x="-14" y="17" fill="#9ca3af" fontSize="3.6" fontWeight="700" fontFamily="monospace" textAnchor="middle">LED</text>

      {/* ---- Relay contact schematic (NC / C / NO) mirroring the moulded diagram ---- */}
      <g transform="translate(14, 40)" stroke="#52525b" strokeWidth="1" fill="none">
        <line x1="-14" y1="-10" x2="-14" y2="10" />
        <line x1="14" y1="-10" x2="14" y2="10" />
        <line x1="-14" y1="-10" x2="0" y2="-10" />
        <line x1="-14" y1="10" x2="0" y2="10" />
        <line
          x1="0"
          y1="0"
          x2={isTriggered ? 12 : -12}
          y2={isTriggered ? -8 : -8}
          stroke={isEnergized ? (isTriggered ? '#f97316' : '#52525b') : '#3f3f46'}
          strokeWidth="1.3"
        />
        <circle cx="0" cy="0" r="1.4" fill="#a1a1aa" />
      </g>

      {/* ---- Trigger pad: simulates a paired transmitter button / UserCUBE tap ---- */}
      <g
        className={isEnergized ? 'cursor-pointer' : 'cursor-not-allowed'}
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
      >
        <rect
          x="2"
          y="0"
          width="26"
          height="16"
          rx="3"
          fill={isEnergized ? (isTriggered ? '#7c2d12' : '#27272a') : '#1a1a1c'}
          stroke={isEnergized ? '#f97316' : '#3f3f46'}
          strokeWidth="0.8"
        />
        <text
          x="15"
          y="10.5"
          fill={isEnergized ? '#fdba74' : '#52525b'}
          fontSize="4.6"
          fontWeight="800"
          fontFamily="monospace"
          textAnchor="middle"
        >
          TAP
        </text>
      </g>

      <g transform="translate(3, 78)" pointerEvents="none">
        <rect x="-45" y="-9" width="90" height="18" rx="5" fill="#070b13" fillOpacity="0.96" stroke="#334155" strokeWidth="1" />
        <text
          x="0"
          y="3"
          fill="#f1f5f9"
          fontSize={component.label.length > 16 ? 7.2 : 8.5}
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

export default CubePower;
