import React, { useEffect, useRef, useState } from 'react';
import type { CircuitComponent } from '../../../types/game';
import { useGameStore } from '../../../store/useGameStore';
import { PULL_STATION_PINS } from './pullStationPinout';

interface FieldControlProps {
  component: CircuitComponent;
}

/**
 * Camden CM-700 Series 'Universal' Blue pull station (four-screw CM-702 style).
 *
 * The plate latches down when pulled and, exactly as the installation sheet
 * plate activates the station and clicking the opened plate resets it.
 */
export const PullStation: React.FC<FieldControlProps> = ({ component }) => {
  const toggleSwitch = useGameStore(state => state.toggleSwitch);
  const isPulled = Boolean(component.state.toggled);
  const [isResetting, setIsResetting] = useState(false);
  const resetTimer = useRef<number | null>(null);

  useEffect(() => () => {
    if (resetTimer.current !== null) window.clearTimeout(resetTimer.current);
  }, []);

  // Click rather than pointerup: the workspace takes a pointer capture on the
  // component group for dragging, which retargets pointerup away from here.
  const togglePullStation = (event: React.MouseEvent<SVGGElement>) => {
    event.stopPropagation();
    if (!isPulled) {
      toggleSwitch(component.id);
      return;
    }

    if (isResetting) return;
    setIsResetting(true);
    resetTimer.current = window.setTimeout(() => {
      toggleSwitch(component.id);
      setIsResetting(false);
      resetTimer.current = null;
    }, 1100);
  };

  return (
    <g className="select-none">
      {/* ---- Extruded aluminium housing ---- */}
      <rect x="-46" y="-66" width="92" height="130" rx="3" fill="#1e40af" stroke="#172554" strokeWidth="1.6" />
      {/* Raised side rails with their moulded channels */}
      <rect x="-46" y="-66" width="11" height="130" rx="2" fill="#2563eb" />
      <rect x="35" y="-66" width="11" height="130" rx="2" fill="#2563eb" />
      <line x1="-40.5" y1="-62" x2="-40.5" y2="60" stroke="#172554" strokeWidth="1.6" />
      <line x1="40.5" y1="-62" x2="40.5" y2="60" stroke="#172554" strokeWidth="1.6" />
      {/* Rail top notches, as moulded on the real extrusion */}
      <rect x="-43" y="-66" width="5" height="4" fill="#172554" />
      <rect x="38" y="-66" width="5" height="4" fill="#172554" />
      {/* Specular sheen down the face */}
      <rect x="-33" y="-66" width="10" height="130" fill="#3b82f6" opacity="0.28" />

      {/* ---- Upper fascia ---- */}
      <rect x="-35" y="-42" width="70" height="30" rx="1.5" fill="#1d4ed8" stroke="#172554" strokeWidth="0.8" />

      {!isPulled ? (
        /* ---- Closed pull plate ---- */
        <g className="device-control cursor-pointer" onClick={togglePullStation}>
          <rect x="-35" y="-10" width="70" height="46" rx="1.5" fill="#ffffff" stroke="#cbd5e1" strokeWidth="0.8" />
          <path
            d="M0 -6.5 L7 1.5 L3.4 1.5 L3.4 7 L-3.4 7 L-3.4 1.5 L-7 1.5 Z"
            fill="#111827"
            stroke="#9ca3af"
            strokeWidth="0.8"
            strokeLinejoin="round"
          />
          <text x="0" y="17.5" fill="#111827" fontSize="10.5" fontWeight="900" textAnchor="middle" fontFamily="sans-serif">
            PULL
          </text>
          <text x="0" y="25" fill="#111827" fontSize="6.6" fontWeight="900" textAnchor="middle" fontFamily="sans-serif">
            FOR DOOR
          </text>
          <text x="0" y="31.5" fill="#111827" fontSize="6.6" fontWeight="900" textAnchor="middle" fontFamily="sans-serif">
            RELEASE
          </text>
        </g>
      ) : (
        /* ---- Open station: cavity exposed and plate folded around its lower hinge ---- */
        <g className="device-control cursor-pointer" onClick={togglePullStation}>
          {isResetting && (
            <animateTransform
              attributeName="transform"
              type="translate"
              values="0 0; 0 0; 0 -9"
              keyTimes="0; 0.68; 1"
              dur="1100ms"
              fill="freeze"
            />
          )}
          <rect x="-35" y="-10" width="70" height="46" rx="1.5" fill="#090f1c" stroke="#172554" strokeWidth="1" />
          <rect x="-30" y="-5" width="60" height="36" rx="2" fill="#111c31" stroke="#334155" strokeWidth="0.8" />
          <path d="M -30 -5 L -24 1 L -24 28 L -30 31 Z" fill="#1e3a8a" opacity="0.75" />
          <path d="M 30 -5 L 24 1 L 24 28 L 30 31 Z" fill="#0b1220" />
          <rect x="-7" y="0" width="14" height="16" rx="2" fill="#475569" stroke="#94a3b8" strokeWidth="0.8" />
          <path d="M -4 3 L 4 3 L 2 11 L -2 11 Z" fill="#cbd5e1" />
          <circle cx="0" cy="23" r="3.2" fill="#64748b" stroke="#cbd5e1" strokeWidth="0.7" />
          <text x="0" y="30" fill="#4ade80" fontSize="5.8" fontWeight="900" textAnchor="middle" fontFamily="monospace">
            ACTIVATED
          </text>

          {/* Barrel hinge and foreshortened face lying fully open. */}
          <rect x="-37" y="33" width="74" height="6" rx="3" fill="#1e3a8a" stroke="#60a5fa" strokeWidth="0.8" />
          <circle cx="-30" cy="36" r="2" fill="#93c5fd" />
          <circle cx="30" cy="36" r="2" fill="#93c5fd" />
          <path d="M -35 38 L 35 38 L 43 58 L -43 58 Z" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="1" />
          <path d="M -30 41 L 30 41 L 34 54 L -34 54 Z" fill="#ffffff" stroke="#e2e8f0" strokeWidth="0.7" />
          <ellipse cx="0" cy="56" rx="4.8" ry="1.8" fill="#050a13" stroke="#94a3b8" strokeWidth="0.7" />
          <path d="M -43 58 L 43 58 L 38 65 L -38 65 Z" fill="#1d4ed8" stroke="#172554" strokeWidth="1" />
          <path d="M -35 58 L 35 58 L 32 61 L -32 61 Z" fill="#60a5fa" opacity="0.7" />
        </g>
      )}

      {/* ---- Four-screw terminal block (CM-702 wiring diagram) ---- */}
      <rect x="-42" y="68" width="84" height="20" rx="2" fill="#111827" stroke="#334155" strokeWidth="1" />
      {PULL_STATION_PINS.map(({ pin, circuit, label, x, y }) => (
        <g key={pin}>
          <circle cx={x} cy={y} r="4.6" fill="#9aa3b2" stroke="#5b6373" strokeWidth="0.7" />
          <path d={`M ${x - 3} ${y - 1.8} L ${x + 3} ${y + 1.8}`} stroke="#3f4653" strokeWidth="1.5" strokeLinecap="round" />
          <text
            x={x}
            y={y - 6.8}
            fill="#ffffff"
            stroke="#111827"
            strokeWidth="1.8"
            paintOrder="stroke"
            fontSize="7.4"
            fontWeight="900"
            fontFamily="monospace"
            textAnchor="middle"
          >
            {pin}
          </text>
          <text
            x={x}
            y={y + 11.5}
            fill={circuit === 'NC' ? '#86efac' : '#fca5a5'}
            stroke="#111827"
            strokeWidth="1.8"
            paintOrder="stroke"
            fontSize="7.2"
            fontWeight="900"
            fontFamily="monospace"
            textAnchor="middle"
          >
            {label}
          </text>
        </g>
      ))}

      {/* Foreground reset tool: rises through the hole beneath the open plate. */}
      {isPulled && isResetting && (
        <g pointerEvents="none" transform="translate(0 55)">
          <g>
            <animateTransform
              attributeName="transform"
              type="translate"
              values="0 42; 0 20; 0 1; 0 1"
              keyTimes="0; 0.38; 0.7; 1"
              dur="1100ms"
              fill="freeze"
            />
            <path d="M -2.8 3 L 0 -3 L 2.8 3 Z" fill="#ffffff" stroke="#0f172a" strokeWidth="1.2" />
            <rect x="-2.5" y="2" width="5" height="30" rx="1.5" fill="#f1f5f9" stroke="#0f172a" strokeWidth="1.2" />
            <path d="M -1.1 4 L -1.1 29" stroke="#ffffff" strokeWidth="1" opacity="0.9" />
            <rect x="-8" y="28" width="16" height="34" rx="6" fill="#f97316" stroke="#431407" strokeWidth="2" />
            <rect x="-6" y="34" width="12" height="5" rx="1.5" fill="#fbbf24" />
            <rect x="-6" y="47" width="12" height="5" rx="1.5" fill="#c2410c" />
            <path d="M -5 31 Q 0 28 5 31" fill="none" stroke="#fed7aa" strokeWidth="1.2" />
          </g>
        </g>
      )}

      {!isResetting && (
        <g transform="translate(0, 108)" pointerEvents="none">
          <rect x="-51" y="-9" width="102" height="18" rx="5" fill="#070b13" stroke="#334155" />
          <text x="0" y="3" fill="#f1f5f9" fontSize="8.5" fontWeight="800" textAnchor="middle" fontFamily="monospace">
            {component.label}
          </text>
        </g>
      )}
    </g>
  );
};

export const KeySwitch: React.FC<FieldControlProps> = ({ component }) => {
  const toggleSwitch = useGameStore(state => state.toggleSwitch);
  const isOn = Boolean(component.state.toggled);

  const handleToggle = (event: React.MouseEvent<SVGGElement>) => {
    event.stopPropagation();
    toggleSwitch(component.id);
  };

  return (
    <g className="select-none">
      <rect x="-46" y="-52" width="92" height="104" rx="9" fill="#e5e7eb" stroke="#94a3b8" strokeWidth="2.5" />
      <rect x="-39" y="-45" width="78" height="90" rx="6" fill="#f8fafc" stroke="#cbd5e1" />
      <text x="0" y="-32" fill="#475569" fontSize="6.5" fontWeight="900" textAnchor="middle">MAINTAINED KEY</text>

      <g className="device-control cursor-pointer" role="button" tabIndex={0} aria-label={`Turn ${component.label} ${isOn ? 'off' : 'on'}`}
        onPointerDown={event => event.stopPropagation()} onClick={handleToggle}
        onKeyDown={event => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); event.stopPropagation(); toggleSwitch(component.id); } }}>
      <circle cx="0" cy="0" r="24" fill="#1e293b" stroke="#64748b" strokeWidth="3" />
      <circle cx="0" cy="0" r="15" fill="#0f172a" stroke={isOn ? '#22c55e' : '#94a3b8'} strokeWidth="2" />
      <g
        transform={`rotate(${isOn ? 42 : -42})`}
        style={{ transition: 'transform 160ms cubic-bezier(0.2, 0.9, 0.3, 1)' }}
      >
        <rect x="-4" y="-7" width="29" height="14" rx="5" fill="#d1d5db" stroke="#64748b" strokeWidth="1.5" />
        <circle cx="-1" cy="0" r="4" fill="#475569" />
        <circle cx="20" cy="0" r="2.5" fill="#0f172a" />
      </g>
      </g>

      <text x="-24" y="32" fill={!isOn ? '#0f172a' : '#94a3b8'} fontSize="7" fontWeight="900">OFF</text>
      <text x="15" y="32" fill={isOn ? '#15803d' : '#94a3b8'} fontSize="7" fontWeight="900">ON</text>
      <circle cx="0" cy="39" r="3" fill={isOn ? '#22c55e' : '#64748b'} className={isOn ? 'animate-pulse' : ''} />

      <g transform="translate(0, 67)" pointerEvents="none">
        <rect x="-50" y="-9" width="100" height="18" rx="5" fill="#070b13" stroke="#334155" />
        <text x="0" y="3" fill="#f1f5f9" fontSize="8.2" fontWeight="800" textAnchor="middle" fontFamily="monospace">
          {component.label}
        </text>
      </g>
    </g>
  );
};
