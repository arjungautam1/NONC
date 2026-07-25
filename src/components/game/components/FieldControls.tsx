import React from 'react';
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
 * describes, only returns by pushing it back in through the reset hole — so the
 * plate activates the station and the reset hole clears it.
 */
export const PullStation: React.FC<FieldControlProps> = ({ component }) => {
  const toggleSwitch = useGameStore(state => state.toggleSwitch);
  const isPulled = Boolean(component.state.toggled);

  // Click rather than pointerup: the workspace takes a pointer capture on the
  // component group for dragging, which retargets pointerup away from here.
  const activate = (event: React.MouseEvent<SVGGElement>) => {
    event.stopPropagation();
    if (!isPulled) toggleSwitch(component.id);
  };

  const reset = (event: React.MouseEvent<SVGGElement>) => {
    event.stopPropagation();
    if (isPulled) toggleSwitch(component.id);
  };

  const plateShift = isPulled ? 13 : 0;

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

      {/* ---- Upper fascia with the reset hole ---- */}
      <rect x="-35" y="-42" width="70" height="30" rx="1.5" fill="#1d4ed8" stroke="#172554" strokeWidth="0.8" />
      <g className="device-control cursor-pointer" onClick={reset}>
        {/* Generous invisible target — the moulded port itself is only a few px across */}
        <circle cx="0" cy="-27" r="12" fill="transparent" />
        {/* Screwdriver reset port */}
        <circle cx="0" cy="-27" r="5.2" fill="#0b1220" stroke="#1e3a8a" strokeWidth="1.2" />
        <circle cx="-1.2" cy="-28.4" r="2" fill="#3b82f6" opacity="0.5" />
        {isPulled && (
          <>
            <circle cx="0" cy="-27" r="8.5" fill="none" stroke="#fbbf24" strokeWidth="1.2" className="animate-pulse" />
            <text x="0" y="-13.5" fill="#fde68a" fontSize="5.4" fontWeight="900" textAnchor="middle" fontFamily="monospace">
              RESET
            </text>
          </>
        )}
      </g>

      {/* ---- Pull plate: drops and latches when operated ---- */}
      <g
        className="device-control cursor-pointer"
        onClick={activate}
        transform={`translate(0, ${plateShift})`}
        style={{ transition: 'transform 150ms cubic-bezier(0.2, 0.9, 0.3, 1)' }}
      >
        {/* Shadow gap revealed above the plate once it has dropped */}
        {isPulled && <rect x="-35" y="-14" width="70" height="13" fill="#0b1220" opacity="0.85" />}
        <rect x="-35" y="-10" width="70" height="46" rx="1.5" fill="#ffffff" stroke="#cbd5e1" strokeWidth="0.8" />
        {/* Direction-of-pull arrow */}
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

      {/* ---- Status band, clear of the plate's travel ---- */}
      <rect x="-35" y="52" width="70" height="10" rx="1.5" fill={isPulled ? '#7f1d1d' : '#172554'} />
      <circle cx="-28" cy="57" r="2.2" fill={isPulled ? '#f87171' : '#22c55e'} className={isPulled ? 'animate-pulse' : ''} />
      <text x="4" y="59.5" fill="#e0e7ff" fontSize="5.8" fontWeight="800" textAnchor="middle" fontFamily="monospace">
        {isPulled ? 'ACTIVATED' : 'NORMAL'}
      </text>

      {/* ---- Four-screw terminal block (CM-702 wiring diagram) ---- */}
      <rect x="-42" y="68" width="84" height="20" rx="2" fill="#111827" stroke="#334155" strokeWidth="1" />
      {PULL_STATION_PINS.map(({ pin, circuit, x, y }) => (
        <g key={pin}>
          <circle cx={x} cy={y} r="4.6" fill="#9aa3b2" stroke="#5b6373" strokeWidth="0.7" />
          <path d={`M ${x - 3} ${y - 1.8} L ${x + 3} ${y + 1.8}`} stroke="#3f4653" strokeWidth="1.5" strokeLinecap="round" />
          <text x={x} y={y - 6.4} fill="#e2e8f0" fontSize="5.8" fontWeight="900" fontFamily="monospace" textAnchor="middle">
            {pin}
          </text>
          <text
            x={x}
            y={y + 10}
            fill={circuit === 'NC' ? '#86efac' : '#fca5a5'}
            fontSize="4.6"
            fontWeight="bold"
            fontFamily="monospace"
            textAnchor="middle"
          >
            {circuit}
          </text>
        </g>
      ))}

      <g transform="translate(0, 102)" pointerEvents="none">
        <rect x="-51" y="-9" width="102" height="18" rx="5" fill="#070b13" stroke="#334155" />
        <text x="0" y="3" fill="#f1f5f9" fontSize="8.5" fontWeight="800" textAnchor="middle" fontFamily="monospace">
          {component.label}
        </text>
      </g>
    </g>
  );
};

export const KeySwitch: React.FC<FieldControlProps> = ({ component }) => {
  const toggleSwitch = useGameStore(state => state.toggleSwitch);
  const isOn = Boolean(component.state.toggled);

  const handleToggle = (event: React.PointerEvent<SVGGElement>) => {
    event.stopPropagation();
    toggleSwitch(component.id);
  };

  return (
    <g className="cursor-pointer select-none" onPointerUp={handleToggle}>
      <rect x="-46" y="-52" width="92" height="104" rx="9" fill="#e5e7eb" stroke="#94a3b8" strokeWidth="2.5" />
      <rect x="-39" y="-45" width="78" height="90" rx="6" fill="#f8fafc" stroke="#cbd5e1" />
      <text x="0" y="-32" fill="#475569" fontSize="6.5" fontWeight="900" textAnchor="middle">MAINTAINED KEY</text>

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
