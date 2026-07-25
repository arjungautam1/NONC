import React from 'react';
import type { CircuitComponent } from '../../../types/game';
import { RBSNTTL_PINS } from './rbsnttlPinout';

interface RBSNTTLProps {
  component: CircuitComponent;
}

/**
 * Altronix RBSNTTL Ultra Sensitive Relay Module — blue PCB with two five-pole
 * barrier strips, an opto-isolator on the trigger side and a Zettler DPDT relay.
 */
export const RBSNTTL: React.FC<RBSNTTLProps> = ({ component }) => {
  const isEnergized = Boolean(component.state.energized);
  const boardPowered = Boolean(component.state.boardPowered);
  const triggerPresent = Boolean(component.state.triggerPresent);

  const status = isEnergized
    ? { text: 'TRIGGERED', fill: '#86efac' }
    : boardPowered
      ? { text: 'STANDBY', fill: '#fbbf24' }
      : { text: 'NO POWER', fill: '#94a3b8' };

  // Screws sit 9.5 below each strip's top edge, so the strips bracket y = ∓38.
  const terminalStrip = (topEdge: number) => (
    <g>
      <rect x="-60" y={topEdge} width="120" height="19" rx="1.5" fill="#12151b" stroke="#2b3240" strokeWidth="0.8" />
      {RBSNTTL_PINS.filter(p => (topEdge < 0 ? p.y < 0 : p.y > 0)).map(({ id, x }) => (
        <g key={id}>
          <rect x={x - 11} y={topEdge + 1} width="22" height="17" rx="1.2" fill="#1b1f27" stroke="#3a4252" strokeWidth="0.6" />
          <rect x={x - 8} y={topEdge + 3.5} width="16" height="12" rx="1" fill="#8f97a6" />
          <circle cx={x} cy={topEdge + 9.5} r="5.2" fill="#c3cad6" stroke="#5b6373" strokeWidth="0.7" />
          <path d={`M ${x - 3.6} ${topEdge + 9.5} L ${x + 3.6} ${topEdge + 9.5}`} stroke="#4a5262" strokeWidth="1.5" strokeLinecap="round" />
          <path d={`M ${x} ${topEdge + 5.9} L ${x} ${topEdge + 13.1}`} stroke="#4a5262" strokeWidth="1.5" strokeLinecap="round" />
        </g>
      ))}
    </g>
  );

  return (
    <g className="select-none">
      {/* ---- Blue PCB ---- */}
      <rect x="-64" y="-62" width="128" height="124" rx="2" fill="#1d4ed8" stroke="#0f2570" strokeWidth="1.4" />
      <rect x="-64" y="-62" width="128" height="124" rx="2" fill="#1e3a8a" fillOpacity="0.25" />

      {/* ---- Silkscreen terminal legends, printed outboard of each strip ---- */}
      {RBSNTTL_PINS.map(({ id, label, x, y }) => (
        <text
          key={id}
          x={x}
          y={y < 0 ? -52 : 57}
          fill="#ffffff"
          fontSize="5.8"
          fontWeight="900"
          fontFamily="sans-serif"
          textAnchor="middle"
        >
          {label}
        </text>
      ))}

      {/* ---- Barrier strips ---- */}
      {terminalStrip(-48)}
      {terminalStrip(28)}

      {/* ---- Board silkscreen ---- */}
      <text x="-14" y="-21" fill="#ffffff" fontSize="7" fontWeight="900" fontFamily="sans-serif" textAnchor="middle" opacity="0.92">
        ALTRONIX CORP.
      </text>
      <text x="-18" y="-13" fill="#ffffff" fontSize="5.6" fontWeight="700" fontFamily="sans-serif" textAnchor="middle" opacity="0.85">
        BKLYN, NY 11220
      </text>
      {/* Part number sits below the relay can so nothing overlaps it */}
      <text x="12" y="25" fill="#ffffff" fontSize="8" fontWeight="900" fontFamily="sans-serif" textAnchor="middle">
        RBSNTTL
      </text>
      <text x="59" y="-14" fill="#dbeafe" fontSize="4" fontWeight="700" textAnchor="middle" transform="rotate(90, 59, -14)" opacity="0.8">RoHS</text>
      <text x="47" y="-24" fill="#dbeafe" fontSize="4" fontWeight="700" textAnchor="middle" opacity="0.75">USA</text>

      {/* Altronix "A" logo mark */}
      <g opacity="0.7" transform="translate(-16, 22)">
        <rect x="-6" y="-6" width="12" height="12" rx="1.5" fill="none" stroke="#bfdbfe" strokeWidth="0.8" />
        <path d="M -3 3 L 0 -3.5 L 3 3" fill="none" stroke="#bfdbfe" strokeWidth="1.1" strokeLinejoin="round" />
        <path d="M -1.8 0.8 L 1.8 0.8" stroke="#bfdbfe" strokeWidth="0.9" />
      </g>

      {/* ---- Opto-isolator: the isolated trigger front end ---- */}
      <g>
        <rect x="-58" y="-5" width="24" height="15" rx="1.2" fill="#e8e6df" stroke="#9ca3af" strokeWidth="0.6" />
        {[-53, -49, -45, -41].map(x => (
          <React.Fragment key={x}>
            <rect x={x - 1} y="-7.4" width="2" height="2.6" fill="#94a3b8" />
            <rect x={x - 1} y="10" width="2" height="2.6" fill="#94a3b8" />
          </React.Fragment>
        ))}
        <circle cx="-55.5" cy="-2" r="1" fill="#6b7280" />
        <text x="-46" y="7.5" fill="#4b5563" fontSize="3.8" fontWeight="700" fontFamily="monospace" textAnchor="middle">
          CNY17F-2
        </text>
        {/* The opto LED glows while trigger current is flowing */}
        <circle
          cx="-46"
          cy="0.5"
          r="2.4"
          fill={triggerPresent ? '#f87171' : '#cbd5e1'}
          style={{ filter: triggerPresent ? 'drop-shadow(0 0 4px #ef4444)' : 'none', transition: 'fill 0.12s ease' }}
        />
      </g>

      {/* ---- Zettler DPDT relay can ---- */}
      <g>
        <rect x="-22" y="-8" width="58" height="21" rx="1" fill="#f5f5f4" stroke="#a8a29e" strokeWidth="0.7" />
        <text x="7" y="-1" fill="#1c1917" fontSize="5.4" fontWeight="900" fontFamily="sans-serif" textAnchor="middle">
          ZETTLER
        </text>
        <text x="7" y="4.5" fill="#1c1917" fontSize="3.6" fontWeight="700" fontFamily="monospace" textAnchor="middle">
          AZ8222-2C-12DSSE
        </text>
        <text x="7" y="10" fill="#1c1917" fontSize="3.5" fontWeight="700" fontFamily="monospace" textAnchor="middle">
          2A 30VDC · 1A 125VAC
        </text>
        {/* Armature indicator travels across the can when the relay pulls in */}
        <rect
          x={isEnergized ? 28 : -20}
          y="-7"
          width="6"
          height="19"
          rx="0.8"
          fill={isEnergized ? '#34d399' : '#d6d3d1'}
          opacity="0.85"
          style={{ transition: 'x 90ms cubic-bezier(0.25, 1, 0.5, 1), fill 90ms ease' }}
        />
      </g>

      {/* ---- Status readout ---- */}
      <rect x="-60" y="18" width="34" height="10" rx="1.5" fill="#0b1220" fillOpacity="0.75" />
      <text x="-43" y="25.2" fill={status.fill} fontSize="5" fontWeight="900" fontFamily="monospace" textAnchor="middle">
        {status.text}
      </text>

      <g transform="translate(0, 78)" pointerEvents="none">
        <rect x="-58" y="-9" width="116" height="18" rx="5" fill="#070b13" fillOpacity="0.96" stroke="#334155" strokeWidth="1" />
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
