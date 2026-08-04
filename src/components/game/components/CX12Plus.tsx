import React, { useRef, useState } from 'react';
import type { CircuitComponent } from '../../../types/game';
import { useGameStore } from '../../../store/useGameStore';
import { CX12PLUS_PINS, getCX12PlusConfig, getCX12PlusMode } from './cx12plusPinout';

interface CX12PlusProps {
  component: CircuitComponent;
  isEnergized: boolean;
}

/** Datasheet: every time delay is adjustable 1-30 seconds. */
const POT_MIN = 1;
const POT_MAX = 30;

const potAngle = (value: number) =>
  -135 + Math.min(1, Math.max(0, (value - POT_MIN) / (POT_MAX - POT_MIN))) * 270;

const clampPot = (value: number) => Math.min(POT_MAX, Math.max(POT_MIN, Math.round(value)));

/**
 * A trimpot screw. Drag it up/down to run the delay across its 1-30s range;
 * the knob tracks live while dragging and the new value is committed once on
 * release, so a single adjustment is a single undo step.
 */
const Pot: React.FC<{
  x: number;
  y: number;
  label: string;
  value: number;
  onCommit: (next: number) => void;
}> = ({ x, y, label, value, onCommit }) => {
  const drag = useRef<{ startY: number; startValue: number } | null>(null);
  const [preview, setPreview] = useState<number | null>(null);
  const shown = preview ?? value;

  const handlePointerDown = (e: React.PointerEvent) => {
    e.stopPropagation();
    drag.current = { startY: e.clientY, startValue: value };
    setPreview(value);
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!drag.current) return;
    e.stopPropagation();
    // Up increases. 4px per second gives the full sweep in ~120px of travel.
    const delta = (drag.current.startY - e.clientY) / 4;
    setPreview(clampPot(drag.current.startValue + delta));
  };

  const endDrag = (e: React.PointerEvent) => {
    if (!drag.current) return;
    e.stopPropagation();
    const next = preview ?? value;
    drag.current = null;
    setPreview(null);
    try { e.currentTarget.releasePointerCapture(e.pointerId); } catch { /* pointer already gone */ }
    if (next !== value) onCommit(next);
  };

  return (
    <g
      transform={`translate(${x}, ${y})`}
      className="device-control cursor-ns-resize"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
    >
      {/* Generous invisible grab area — the knob itself is only 9px across */}
      <circle r="15" fill="transparent" />
      <circle r="9" fill="#1c1c1f" stroke={preview !== null ? '#60a5fa' : '#3f3f46'} strokeWidth={preview !== null ? 1.4 : 1} />
      <circle r="7" fill="#2b2b30" />
      <line
        x1="0"
        y1="0"
        x2={Math.sin((potAngle(shown) * Math.PI) / 180) * 6}
        y2={-Math.cos((potAngle(shown) * Math.PI) / 180) * 6}
        stroke={preview !== null ? '#93c5fd' : '#d4d4d8'}
        strokeWidth="1.3"
        strokeLinecap="round"
      />
      <text x="0" y="16" fill="#3f3f46" fontSize="3.6" fontWeight="800" fontFamily="sans-serif" textAnchor="middle">
        {label}
      </text>
      <text
        x="0"
        y="21.5"
        fill={preview !== null ? '#2563eb' : '#57534e'}
        fontSize="4.4"
        fontWeight="900"
        fontFamily="monospace"
        textAnchor="middle"
      >
        {shown}s
      </text>
    </g>
  );
};

/**
 * Camden CX-12 PLUS Door Interface Relay. Board power is 12/24V AC/DC on
 * terminals 1-2. The DIP switch (SW1-SW3) selects one of the 8 factory
 * operating modes from the installation manual, and the mode engine in
 * useGameStore's runSimulation implements each as its own state machine:
 *   1. Standard Timer / Momentary Apartment — Wet1/Dry1 pulses Relay1 then
 *      auto-chains a Relay2 pulse after D.O.O.RL2; Wet2/Dry2 is a courtesy
 *      switch that fires Relay2 immediately while Relay1 is energized.
 *   2. Access Control (Maintained) — Wet1 mirrors Relay1 directly; Dry1/Wet2
 *      always unlocks and opens; Dry2 opens only while the strike is on.
 *   3. Smoke Evac. — Wet2/Dry1 pulses the strike then holds the operator on
 *      as a maintained mirror until the input releases.
 *   4. Latching/Ratchet — Wet1/Dry1 toggles a delayed Relay2 latch; Wet2/Dry2
 *      toggles both relays latched together.
 *   5/6. Bi-Directional Sequencer (Momentary/Maintained) — either side fires
 *      its near relay and chains the far relay after D.O.O.RL2, fixed-pulse
 *      in Mode 5 or switch-held in Mode 6.
 *   7/8. Restroom Control (Normally Unlocked/Locked) — a small lock/unlock
 *      state machine using Wet1 exterior/access, Dry1 push-to-lock, Wet2
 *      interior, Dry2 magnetic door contact.
 * All three potentiometers (D.O.R.RL1, D.O.O.RL2, D.O.R.RL2) are wired into
 * every mode exactly as the manual specifies for that mode.
 */
export const CX12Plus: React.FC<CX12PlusProps> = ({ component, isEnergized }) => {
  const configureCX12Plus = useGameStore(state => state.configureCX12Plus);
  const config = getCX12PlusConfig(component);
  const activeMode = getCX12PlusMode(config.sw);
  const relay1Active = Boolean(component.state.relay1Active);
  const relay2Active = Boolean(component.state.relay2Active);

  const toggleSwitch = (index: 0 | 1 | 2) => (e: React.MouseEvent) => {
    e.stopPropagation();
    const sw: [boolean, boolean, boolean] = [...config.sw];
    sw[index] = !sw[index];
    configureCX12Plus(component.id, { sw });
  };

  const groupLegend = (fromIdx: number, toIdx: number, text: string) => {
    const x1 = CX12PLUS_PINS[fromIdx].x;
    const x2 = CX12PLUS_PINS[toIdx].x;
    return (
      <g key={text}>
        <line x1={x1 - 6} y1="83" x2={x2 + 6} y2="83" stroke="#ffffff" strokeWidth="1" opacity="0.8" />
        <text x={(x1 + x2) / 2} y="92" fill="#ffffff" fontSize="6.5" fontWeight="900" fontFamily="sans-serif" textAnchor="middle">
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

      {/* Potentiometers — drag vertically to set each delay (1-30s) */}
      <Pot
        x={-55}
        y={-34}
        label="DOR RL1"
        value={config.dorRl1}
        onCommit={next => configureCX12Plus(component.id, { dorRl1: next })}
      />
      <Pot
        x={-22}
        y={-34}
        label="DOO RL2"
        value={config.dooRl2}
        onCommit={next => configureCX12Plus(component.id, { dooRl2: next })}
      />
      <Pot
        x={11}
        y={-34}
        label="DOR RL2"
        value={config.dorRl2}
        onCommit={next => configureCX12Plus(component.id, { dorRl2: next })}
      />

      {/* DIP switch SW1/SW2/SW3 */}
      <g transform="translate(48, -50)">
        <text x="18" y="-3" fill="#57534e" fontSize="4.2" fontWeight="800" fontFamily="sans-serif" textAnchor="middle">OFF · ON</text>
        <rect x="0" y="0" width="36" height="34" rx="1.5" fill="#18181b" stroke="#3f3f46" strokeWidth="0.8" />
        {[0, 1, 2].map(i => (
          <g
            key={i}
            className="device-control cursor-pointer"
            onPointerDown={e => e.stopPropagation()}
            onClick={toggleSwitch(i as 0 | 1 | 2)}
          >
            {/* Full-width hit strip so the whole rocker row is clickable */}
            <rect x="2" y={3 + i * 10} width="32" height="9" fill="transparent" />
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
      <rect x="-128" y="36" width="256" height="50" rx="4" fill="#0d381e" stroke="#051a0d" strokeWidth="1.2" />
      {CX12PLUS_PINS.map(({ id, label, name, x, y }) => (
        <g key={id}>
          <rect x={x - 6.5} y={y - 9} width="13" height="18" rx="1.5" fill="#124525" stroke="#092614" strokeWidth="0.5" />
          <circle cx={x} cy={y} r="4.3" fill="#e2e8f0" stroke="#475569" strokeWidth="0.6" />
          <path d={`M ${x - 2.6} ${y} L ${x + 2.6} ${y}`} stroke="#334155" strokeWidth="1.1" strokeLinecap="round" />
          <path d={`M ${x} ${y - 2.6} L ${x} ${y + 2.6}`} stroke="#334155" strokeWidth="1.1" strokeLinecap="round" />
          {/* High-contrast terminal screw number (1 - 16) */}
          <text x={x} y={y - 12} fill="#ffffff" fontSize="7" fontWeight="900" fontFamily="monospace" textAnchor="middle">{name}</text>
          {/* Pure white terminal function label (PWR, NO, COM, NC, W1, D1...) */}
          <text x={x} y={y + 16} fill="#ffffff" fontSize="6.5" fontWeight="900" fontFamily="sans-serif" textAnchor="middle">{label}</text>
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
