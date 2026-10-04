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
  const powered = Boolean(component.state.powered);
  const isOn = Boolean(component.state.toggled);

  const handleToggle = (event: React.MouseEvent<SVGGElement>) => {
    event.stopPropagation();
    if (powered) toggleSwitch(component.id);
  };

  const metalId = `key-plate-${component.id}`;
  return (
    <g className="select-none">
      <defs>
        <linearGradient id={metalId} x1="0" y1="0" x2="1" y2=".15">
          <stop stopColor="#909598" /><stop offset=".28" stopColor="#d8dcdd" />
          <stop offset=".6" stopColor="#b8bdc0" /><stop offset="1" stopColor="#e0e2e2" />
        </linearGradient>
        <linearGradient id={`${metalId}-edge`} x1="0" y1="0" x2="0" y2="1"><stop stopColor="#666a6c"/><stop offset=".08" stopColor="#f0f1f1"/><stop offset=".2" stopColor="#929698"/><stop offset=".85" stopColor="#a2a6a7"/><stop offset=".95" stopColor="#e3e6e6"/><stop offset="1" stopColor="#4a4e50"/></linearGradient>
        <linearGradient id={`${metalId}-brass`}><stop stopColor="#8b6522"/><stop offset=".35" stopColor="#eed586"/><stop offset=".7" stopColor="#b18c36"/><stop offset="1" stopColor="#e6c66c"/></linearGradient>
      </defs>
      <title>Requires 12/24VDC on + and −. COM/NO/NC are isolated contacts.</title>
      {component.terminals.filter(t => t.id === 'pos' || t.id === 'neg').map(t => <g key={t.id} transform={`translate(${t.x},${t.y})`}>
        <circle r="7" fill="#17212c" stroke="#94a3b8"/><circle r="3" fill={powered && t.id === 'pos' ? '#ef4444' : '#64748b'}/>
      </g>)}
      <rect x="-36" y="-60" width="72" height="120" rx="5" fill={`url(#${metalId}-edge)`} stroke="#92999c" strokeWidth="1.5" />
      <rect x="-32" y="-54" width="64" height="108" rx="5" fill={`url(#${metalId})`} stroke="#eceeee" strokeWidth=".6" />
      {[-45, 44].map(y => <g key={y}><circle cx="0" cy={y} r="3.6" fill="#6b7479" stroke="#edf0f0" /><circle cx="0" cy={y} r="2.2" fill="#252e35" /><path d={`M-1.8 ${y} H1.8`} stroke="#c7cdd0" strokeWidth=".7" /></g>)}
      <g className="device-control cursor-pointer" role="button" tabIndex={0} aria-disabled={!powered} aria-label={`Turn ${component.label} ${isOn ? 'off' : 'on'}`}
        onPointerDown={event => event.stopPropagation()} onClick={handleToggle}
        onKeyDown={event => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); event.stopPropagation(); if (powered) toggleSwitch(component.id); } }}>
        <circle cy="-17" r="18.5" fill="#252b2e" stroke="#d9dcdc" strokeWidth=".8" />
        <circle cy="-17" r="17.5" fill="#81878a" stroke="#b9bfc0" />
        <circle cy="-11" r="8" fill={`url(#${metalId})`} stroke="#424a4f" strokeWidth="1.2" />
        <circle cy="-11" r="7" fill="none" stroke="#dde1e2" strokeWidth=".6" />
        <g transform="translate(0,-11)">
          <g transform={`rotate(${isOn ? -90 : 0})`} style={{ transition: 'transform 420ms cubic-bezier(.25,.65,.3,1)' }}>
            <circle r="7" fill={`url(#${metalId})`} stroke="#d8dddf" strokeWidth=".6" />
            <path d="M-.5 -5 L1 -5 V-2 L-1 0 L1 2 V5 H-1 V2 L-2 0 L-.5 -2 Z" fill="#171a1d" />
            {/* A generous hit area makes the lower key bow easy to turn. */}
            <rect x="-13" y="-3" width="26" height="39" rx="10" fill="transparent" pointerEvents="all" />
            <g transform={`scale(${isOn ? .62 : 1}, 1)`} style={{ transition: 'transform 420ms cubic-bezier(.25,.65,.3,1)' }}>
              <g transform="translate(1.5, 1)" opacity=".65" pointerEvents="none">
                <path d="M-2 0 V21 H2 V0 Z M-3 18 Q-10 19 -10 26 Q-10 33 0 34 Q10 33 10 26 Q10 19 3 18 Z" fill="#73501d" stroke="#4c3515" strokeWidth="1.2" />
              </g>
            <path d="M-2 0 V14 H-4 V17 H-2 V21 H2 V0 Z" fill={`url(#${metalId}-brass)`} stroke="#846024" strokeWidth=".6" />
            <path d="M-3 18 Q-10 19 -10 26 Q-10 33 0 34 Q10 33 10 26 Q10 19 3 18 Z" fill={`url(#${metalId}-brass)`} stroke="#79551e" strokeWidth=".9" />
            <path d="M-6 23 Q0 19 6 23" fill="none" stroke="#f5e0a0" strokeWidth="1" />
            <ellipse cy="28" rx="3.4" ry="2.2" fill="#667075" stroke="#e5c979" strokeWidth=".8" />
            <path d="M-5 25 H5" stroke="#b29247" strokeWidth=".6" />
              <path d="M8 24 Q10 28 6 31" fill="none" stroke="#f8e9ba" strokeWidth="1" opacity={isOn ? .9 : .45} style={{transition:'opacity 420ms ease'}} />
            </g>
          </g>
        </g>
      </g>
      <circle cx="-15" cy="27" r="3.8" fill="#101b19" stroke="#555f5f" />
      <circle cx="-15" cy="27" r="2.7" fill={powered && isOn ? '#22c55e' : '#14532d'} />
      <circle cx="15" cy="27" r="3.8" fill="#201516" stroke="#555f5f" />
      <circle cx="15" cy="27" r="2.7" fill={powered && !isOn ? '#ef4444' : '#7f1d1d'} />
      <text x="-15" y="38" textAnchor="middle" fontSize="5" fontWeight="800" fill="#26363b">ON</text>
      <text x="15" y="38" textAnchor="middle" fontSize="5" fontWeight="800" fill="#26363b">OFF</text>
    </g>
  );
};
