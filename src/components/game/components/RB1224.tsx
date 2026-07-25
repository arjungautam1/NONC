import React from 'react';
import type { CircuitComponent } from '../../../types/game';
import { useGameStore } from '../../../store/useGameStore';
import { RB1224_PINS, rb1224CoilVoltage } from './rb1224Pinout';

interface RB1224Props {
  component: CircuitComponent;
}

/**
 * Altronix RB1224 Relay Module — blue PCB sub-assembly with two barrier
 * terminal blocks. SW1 is live: OFF selects 24VDC operation, ON selects 12VDC,
 * and the coil only pulls in on the selected rail (see circuitSolver).
 */
export const RB1224: React.FC<RB1224Props> = ({ component }) => {
  const setComponentState = useGameStore(state => state.setComponentState);
  const isRunning = useGameStore(state => state.isRunning);
  const isEnergized = Boolean(component.state.energized);
  const is12V = Boolean(component.state.dip12v);
  const coilVoltage = rb1224CoilVoltage(component.state);

  // SW1 is a hardware selection, so it is only settable with the bench powered down.
  const toggleDip = (event: React.MouseEvent<SVGGElement>) => {
    event.stopPropagation();
    if (isRunning) return;
    setComponentState(component.id, 'dip12v', !is12V);
  };

  const terminalBlock = (topEdge: number) => (
    <g>
      <rect x="-52" y={topEdge} width="104" height="20" rx="1.5" fill="#12151b" stroke="#2b3240" strokeWidth="0.8" />
      {[-39, -13, 13, 39].map(x => (
        <g key={x}>
          {/* Moulded barrier housing */}
          <rect x={x - 12} y={topEdge + 1.2} width="24" height="17.6" rx="1.2" fill="#1b1f27" stroke="#3a4252" strokeWidth="0.6" />
          {/* Plated screw with its clamp plate */}
          <rect x={x - 8.5} y={topEdge + 4} width="17" height="12" rx="1" fill="#8f97a6" />
          <circle cx={x} cy={topEdge + 10} r="5.6" fill="#c3cad6" stroke="#5b6373" strokeWidth="0.7" />
          <path d={`M ${x - 3.9} ${topEdge + 10} L ${x + 3.9} ${topEdge + 10}`} stroke="#4a5262" strokeWidth="1.6" strokeLinecap="round" />
          <path d={`M ${x} ${topEdge + 6.1} L ${x} ${topEdge + 13.9}`} stroke="#4a5262" strokeWidth="1.6" strokeLinecap="round" />
        </g>
      ))}
    </g>
  );

  return (
    <g className="select-none">
      {/* ---- Blue PCB ---- */}
      <rect x="-55" y="-58" width="110" height="116" rx="2" fill="#1d4ed8" stroke="#0f2570" strokeWidth="1.4" />
      <rect x="-55" y="-58" width="110" height="116" rx="2" fill="#1e3a8a" fillOpacity="0.25" />
      {/* Mounting holes */}
      <circle cx="-48" cy="-51" r="2.4" fill="#0b1220" stroke="#93c5fd" strokeWidth="0.6" />
      <circle cx="48" cy="51" r="2.4" fill="#0b1220" stroke="#93c5fd" strokeWidth="0.6" />

      {/* ---- Silkscreen terminal legends, printed outboard of each block ---- */}
      {RB1224_PINS.map(({ id, label, x, y }) => (
        <text
          key={id}
          x={x}
          y={y < 0 ? -49 : 53}
          fill="#ffffff"
          fontSize="6.4"
          fontWeight="900"
          fontFamily="sans-serif"
          textAnchor="middle"
        >
          {label}
        </text>
      ))}

      {/* ---- Barrier terminal blocks ---- */}
      {terminalBlock(-45)}
      {terminalBlock(25)}

      {/* ---- Component side ---- */}
      {/* Relay can with its printed part label */}
      <rect x="-44" y="-16" width="46" height="22" rx="1" fill="#0b1220" stroke="#1e3a8a" strokeWidth="0.7" />
      <rect x="-42" y="-14" width="42" height="18" rx="0.8" fill="#f8fafc" stroke="#94a3b8" strokeWidth="0.6" />
      <text x="-21" y="-6.5" fill="#0b1220" fontSize="8" fontWeight="900" fontFamily="sans-serif" textAnchor="middle">
        RB1224
      </text>
      <text x="-21" y="1.5" fill="#0b1220" fontSize="5.6" fontWeight="700" fontFamily="sans-serif" textAnchor="middle">
        {is12V ? 'ON - 12VDC' : 'OFF - 24VDC'}
      </text>

      {/* Trigger LED D1 — lit whenever the relay is actually pulled in */}
      <circle
        cx="34"
        cy="-9"
        r="5"
        fill={isEnergized ? '#ef4444' : '#7f1d1d'}
        stroke={isEnergized ? '#fecaca' : '#450a0a'}
        strokeWidth="0.8"
        style={{ filter: isEnergized ? 'drop-shadow(0 0 5px #ef4444)' : 'none' }}
      />
      <text x="24" y="-7" fill="#dbeafe" fontSize="4.4" fontWeight="700" fontFamily="monospace" textAnchor="middle">D1</text>

      {/* Current-limiting resistors */}
      <g>
        <line x1="44" y1="-18" x2="44" y2="2" stroke="#cbd5e1" strokeWidth="1" />
        <rect x="40.5" y="-13" width="7" height="10" rx="2" fill="#e7d5a8" stroke="#a1854c" strokeWidth="0.5" />
        <line x1="40.5" y1="-10.5" x2="47.5" y2="-10.5" stroke="#7f1d1d" strokeWidth="1.1" />
        <line x1="40.5" y1="-8" x2="47.5" y2="-8" stroke="#111827" strokeWidth="1.1" />
        <line x1="40.5" y1="-5.5" x2="47.5" y2="-5.5" stroke="#b45309" strokeWidth="1.1" />
      </g>
      <g>
        <line x1="-14" y1="15" x2="14" y2="15" stroke="#cbd5e1" strokeWidth="1" />
        <rect x="-9" y="11" width="18" height="8" rx="2.5" fill="#e7d5a8" stroke="#a1854c" strokeWidth="0.5" />
        <line x1="-5.5" y1="11" x2="-5.5" y2="19" stroke="#7f1d1d" strokeWidth="1.3" />
        <line x1="-2" y1="11" x2="-2" y2="19" stroke="#111827" strokeWidth="1.3" />
        <line x1="1.5" y1="11" x2="1.5" y2="19" stroke="#b45309" strokeWidth="1.3" />
      </g>

      {/* SW1 voltage-select DIP — OFF = 24VDC, ON = 12VDC */}
      <g className={`device-control ${isRunning ? 'cursor-not-allowed' : 'cursor-pointer'}`} onClick={toggleDip}>
        <text x="-4" y="7.5" fill="#dbeafe" fontSize="4.2" fontWeight="700" fontFamily="monospace" textAnchor="middle">R2</text>
        <text x="10" y="7.5" fill="#dbeafe" fontSize="4.2" fontWeight="700" fontFamily="monospace" textAnchor="middle">SW1</text>
        <rect x="5" y="9" width="11" height="18" rx="1" fill="#dc2626" stroke="#7f1d1d" strokeWidth="0.7" />
        <text x="10.5" y="13" fill="#fee2e2" fontSize="3.4" fontWeight="700" fontFamily="monospace" textAnchor="middle">ON</text>
        {/* Actuator: up = ON (12VDC), down = OFF (24VDC) */}
        <rect
          x="7.4"
          y={is12V ? 13.6 : 19.4}
          width="6.2"
          height="6"
          rx="0.8"
          fill="#f8fafc"
          stroke="#7f1d1d"
          strokeWidth="0.5"
          style={{ transition: 'y 120ms cubic-bezier(0.2, 0.9, 0.3, 1)' }}
        />
        <text x="10.5" y="26.4" fill="#fee2e2" fontSize="3.4" fontWeight="700" fontFamily="monospace" textAnchor="middle">1</text>
      </g>

      {/* Board silkscreen */}
      <text x="-38" y="17" fill="#ffffff" fontSize="7" fontWeight="900" fontFamily="sans-serif" textAnchor="middle" opacity="0.9">RB5</text>
      <text
        x="51"
        y="14"
        fill="#dbeafe"
        fontSize="4"
        fontWeight="700"
        fontFamily="sans-serif"
        textAnchor="middle"
        transform="rotate(90, 51, 14)"
        opacity="0.85"
      >
        ALTRONIX CORP. BKLYN NY
      </text>
      <text
        x="51"
        y="-30"
        fill="#dbeafe"
        fontSize="4"
        fontWeight="700"
        fontFamily="sans-serif"
        textAnchor="middle"
        transform="rotate(90, 51, -30)"
        opacity="0.85"
      >
        RoHS
      </text>

      {/* Selected coil rating, so the DIP position is readable at a glance */}
      <text
        x="-21"
        y="-19"
        fill={is12V ? '#fbbf24' : '#86efac'}
        fontSize="5"
        fontWeight="900"
        fontFamily="monospace"
        textAnchor="middle"
      >
        SW1 {is12V ? 'ON' : 'OFF'} · {coilVoltage}VDC
      </text>

      <g transform="translate(0, 72)" pointerEvents="none">
        <rect x="-55" y="-9" width="110" height="18" rx="5" fill="#070b13" fillOpacity="0.96" stroke="#334155" strokeWidth="1" />
        <text
          x="0"
          y="3"
          fill="#f1f5f9"
          fontSize={component.label.length > 18 ? 7.2 : 8.5}
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
