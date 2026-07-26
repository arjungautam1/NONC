import React from 'react';
import type { CircuitComponent } from '../../../types/game';
import { useGameStore } from '../../../store/useGameStore';
import { CX12PLUS_PINS, getCX12PlusConfig, getCX12PlusMode } from './cx12plusPinout';

interface CX12PlusProps {
  component: CircuitComponent;
  isEnergized: boolean;
}

const potAngle = (value: number) => -135 + Math.min(1, Math.max(0, (value - 1) / 29)) * 270;

const Pot: React.FC<{ x: number; y: number; label: string; value: number }> = ({ x, y, label, value }) => (
  <g transform={`translate(${x}, ${y})`}>
    <circle r="9" fill="#1c1c1f" stroke="#3f3f46" strokeWidth="1" />
    <circle r="7" fill="#2b2b30" />
    <line
      x1="0"
      y1="0"
      x2={Math.sin((potAngle(value) * Math.PI) / 180) * 6}
      y2={-Math.cos((potAngle(value) * Math.PI) / 180) * 6}
      stroke="#d4d4d8"
      strokeWidth="1.3"
      strokeLinecap="round"
    />
    <text x="0" y="16" fill="#3f3f46" fontSize="3.6" fontWeight="800" fontFamily="sans-serif" textAnchor="middle">
      {label}
    </text>
  </g>
);

/**
 * Camden CX-12 PLUS Door Interface Relay. Board power is 12/24V AC/DC on
 * terminals 1-2. The simulator models the core, mode-agnostic behavior
 * shared by every DIP setting: Wet1/Dry1 pulses Relay 1 (lock) for
 * D.O.R.RL1 seconds and, after D.O.O.RL2 seconds, auto-chains a Relay 2
 * (operator) pulse for D.O.R.RL2 seconds — the "Standard Timer Mode"
 * (Diagram 1); Wet2/Dry2 also pulses Relay 2 directly, covering the
 * Access-Control-style wiring (Diagram 2a). The DIP switch is fully
 * interactive and its mode readout is accurate, but all 8 modes share this
 * one timing engine rather than 8 distinct state machines.
 */
export const CX12Plus: React.FC<CX12PlusProps> = ({ component, isEnergized }) => {
  const configureCX12Plus = useGameStore(state => state.configureCX12Plus);
  const isRunning = useGameStore(state => state.isRunning);
  const config = getCX12PlusConfig(component);
  const activeMode = getCX12PlusMode(config.sw);
  const relay1Active = Boolean(component.state.relay1Active);
  const relay2Active = Boolean(component.state.relay2Active);

  const toggleSwitch = (index: 0 | 1 | 2) => (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isRunning) return;
    const sw: [boolean, boolean, boolean] = [...config.sw];
    sw[index] = !sw[index];
    configureCX12Plus(component.id, { sw });
  };

  const groupLegend = (fromIdx: number, toIdx: number, text: string) => {
    const x1 = CX12PLUS_PINS[fromIdx].x;
    const x2 = CX12PLUS_PINS[toIdx].x;
    return (
      <g key={text}>
        <line x1={x1 - 6} y1="82" x2={x2 + 6} y2="82" stroke="#8fb59a" strokeWidth="0.6" />
        <text x={(x1 + x2) / 2} y="89" fill="#d7ead9" fontSize="4.6" fontWeight="800" fontFamily="sans-serif" textAnchor="middle">
          {text}
        </text>
      </g>
    );
  };

  return (
    <g className="select-none">
      <defs>
        <linearGradient id="cx12-housing" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#fbfbf8" />
          <stop offset="100%" stopColor="#e3e1d6" />
        </linearGradient>
      </defs>

      {/* ---- Cream plastic housing ---- */}
      <rect x="-125" y="-62" width="250" height="100" rx="6" fill="url(#cx12-housing)" stroke="#b8b6a9" strokeWidth="1.2" filter="drop-shadow(1px 4px 8px rgba(0,0,0,0.35))" />

      {/* Relay status LEDs */}
      <text x="-104" y="-44" fill="#57534e" fontSize="5" fontWeight="800" fontFamily="sans-serif" textAnchor="middle">RL1</text>
      <circle cx="-104" cy="-34" r="4" fill="#141414" />
      <circle cx="-104" cy="-34" r="2.6" fill={relay1Active ? '#f59e0b' : '#3a3a3a'} style={{ filter: relay1Active ? 'drop-shadow(0 0 3px #f59e0b)' : 'none' }} />

      <text x="-86" y="-44" fill="#57534e" fontSize="5" fontWeight="800" fontFamily="sans-serif" textAnchor="middle">RL2</text>
      <circle cx="-86" cy="-34" r="4" fill="#141414" />
      <circle cx="-86" cy="-34" r="2.6" fill={relay2Active ? '#f59e0b' : '#3a3a3a'} style={{ filter: relay2Active ? 'drop-shadow(0 0 3px #f59e0b)' : 'none' }} />

      {/* Potentiometers */}
      <Pot x={-55} y={-34} label="DOR RL1" value={config.dorRl1} />
      <Pot x={-22} y={-34} label="DOO RL2" value={config.dooRl2} />
      <Pot x={11} y={-34} label="DOR RL2" value={config.dorRl2} />

      {/* DIP switch SW1/SW2/SW3 */}
      <g transform="translate(48, -50)">
        <text x="18" y="-3" fill="#57534e" fontSize="4.2" fontWeight="800" fontFamily="sans-serif" textAnchor="middle">OFF · ON</text>
        <rect x="0" y="0" width="36" height="34" rx="1.5" fill="#18181b" stroke="#3f3f46" strokeWidth="0.8" />
        {[0, 1, 2].map(i => (
          <g
            key={i}
            className={isRunning ? 'cursor-not-allowed' : 'cursor-pointer'}
            onClick={toggleSwitch(i as 0 | 1 | 2)}
          >
            <rect x="4" y={4 + i * 10} width="28" height="7" rx="1" fill="#050505" stroke="#3f3f46" strokeWidth="0.4" />
            <rect
              x={config.sw[i] ? 20 : 6}
              y={4.8 + i * 10}
              width="10"
              height="5.4"
              rx="0.8"
              fill="#e4e4e7"
              stroke="#71717a"
              strokeWidth="0.4"
              style={{ transition: 'x 100ms ease' }}
            />
            <text x="-3" y={9 + i * 10} fill="#a1a1aa" fontSize="4" fontWeight="700" fontFamily="monospace" textAnchor="end">{i + 1}</text>
          </g>
        ))}
      </g>

      {/* Branding */}
      <text x="-105" y="5" fill="#292524" fontSize="13" fontWeight="900" fontFamily="sans-serif" fontStyle="italic">CX-12 PLUS</text>
      <text x="-105" y="16" fill="#57534e" fontSize="6" fontWeight="700" fontFamily="sans-serif">Door Interface Relay</text>
      <g transform="translate(80, 0)">
        <rect x="0" y="-9" width="10" height="12" rx="1" fill="none" stroke="#1d4ed8" strokeWidth="1.1" />
        <circle cx="7.2" cy="-3" r="0.8" fill="#1d4ed8" />
        <text x="14" y="-3" fill="#1d4ed8" fontSize="6" fontWeight="900" fontFamily="sans-serif">CAMDEN</text>
        <text x="14" y="3" fill="#57534e" fontSize="3.6" fontWeight="700" fontFamily="sans-serif">DOOR CONTROLS</text>
      </g>
      <text x="-105" y="27" fill="#78716c" fontSize="4.6" fontWeight="700" fontFamily="monospace">
        MODE {activeMode.mode} · {activeMode.label.toUpperCase()}
      </text>

      {/* ---- Green terminal PCB strip ---- */}
      <rect x="-125" y="38" width="250" height="46" rx="3" fill="#1e5631" stroke="#123d21" strokeWidth="1" />
      {CX12PLUS_PINS.map(({ id, label, name, x, y }) => (
        <g key={id}>
          <rect x={x - 6.5} y={y - 8} width="13" height="16" rx="1" fill="#164028" stroke="#0d2b19" strokeWidth="0.4" />
          <circle cx={x} cy={y} r="4.3" fill="#c3cad6" stroke="#5b6373" strokeWidth="0.5" />
          <path d={`M ${x - 2.6} ${y} L ${x + 2.6} ${y}`} stroke="#4a5262" strokeWidth="1.1" strokeLinecap="round" />
          <path d={`M ${x} ${y - 2.6} L ${x} ${y + 2.6}`} stroke="#4a5262" strokeWidth="1.1" strokeLinecap="round" />
          <text x={x} y={y - 11} fill="#e7f5eb" fontSize="4" fontWeight="800" fontFamily="monospace" textAnchor="middle">{name}</text>
          <text x={x} y={y + 13.5} fill="#a8d8b6" fontSize="3.4" fontWeight="700" fontFamily="sans-serif" textAnchor="middle">{label}</text>
        </g>
      ))}
      {groupLegend(0, 1, 'POWER')}
      {groupLegend(2, 4, 'RELAY 1')}
      {groupLegend(5, 7, 'RELAY 2')}
      {groupLegend(8, 9, 'WET1')}
      {groupLegend(10, 11, 'DRY1')}
      {groupLegend(12, 13, 'WET2')}
      {groupLegend(14, 15, 'DRY2')}

      <g transform="translate(0, 104)" pointerEvents="none">
        <rect x="-50" y="-9" width="100" height="18" rx="5" fill="#070b13" fillOpacity="0.96" stroke="#334155" strokeWidth="1" />
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
      {!isEnergized && (
        <text x="0" y="-68" fill="#94a3b8" fontSize="4.6" fontWeight="700" fontFamily="monospace" textAnchor="middle" opacity="0.85">
          NO POWER
        </text>
      )}
    </g>
  );
};

export default CX12Plus;
