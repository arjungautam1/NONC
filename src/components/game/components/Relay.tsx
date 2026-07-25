import React from 'react';
import type { CircuitComponent } from '../../../types/game';
import { DPDT_PINS, type DPDTPin } from './relayPinout';

interface ComponentProps {
  component: CircuitComponent;
}

export const Relay: React.FC<ComponentProps> = ({ component }) => {
  const isEnergized = component.state.energized || false;

  return (
    <g>
      {/* 1. Outer Enclosure (Delmi Slate Blue Glass style) */}
      <rect
        x="-45"
        y="-54"
        width="90"
        height="108"
        rx="5"
        fill="#0f172a"
        fillOpacity="0.88"
        stroke="#1d4ed8"
        strokeWidth="1.6"
        filter="drop-shadow(0 4px 8px rgba(0,0,0,0.35))"
      />

      {/* Internal shine accent line */}
      <rect
        x="-41"
        y="-50"
        width="82"
        height="100"
        rx="3"
        fill="none"
        stroke="#60a5fa"
        strokeWidth="0.6"
        opacity="0.15"
      />

      {/* 2. Silkscreen Connection Traces */}
      {/* Left side coil traces */}
      <line x1="-35" y1="-30" x2="-22" y2="-30" stroke="#ca8a04" strokeWidth="1.2" />
      <line x1="-35" y1="30" x2="-22" y2="30" stroke="#ca8a04" strokeWidth="1.2" />
      <line x1="-22" y1="-30" x2="-22" y2="-18" stroke="#ca8a04" strokeWidth="1.2" />
      <line x1="-22" y1="30" x2="-22" y2="18" stroke="#ca8a04" strokeWidth="1.2" />

      {/* Right side contact traces */}
      <line x1="35" y1="-30" x2="16" y2="-30" stroke="#3b82f6" strokeWidth="1.2" />
      <line x1="35" y1="0" x2="16" y2="0" stroke="#3b82f6" strokeWidth="1.2" />
      <line x1="35" y1="30" x2="16" y2="30" stroke="#3b82f6" strokeWidth="1.2" />

      {/* 3. Electromagnetic Coil (Left Side) */}
      <g transform="translate(-22, 0)">
        {/* Core bar */}
        <rect x="-3.5" y="-18" width="7" height="36" rx="1" fill="#4b5563" />
        
        {/* Coil windings */}
        {[-14, -10, -6, -2, 2, 6, 10, 14].map((yVal) => (
          <path
            key={yVal}
            d={`M -3.5 ${yVal} C 4.5 ${yVal - 1.5}, 4.5 ${yVal + 1.5}, -3.5 ${yVal + 2}`}
            fill="none"
            stroke={isEnergized ? '#fbbf24' : '#b45309'}
            strokeWidth="1.8"
            style={{ transition: 'stroke 0.15s ease' }}
          />
        ))}

        {/* Pulsing magnetic fields when energized */}
        {isEnergized && (
          <g className="animate-pulse-magnetic">
            <ellipse cx="0" cy="0" rx="14" ry="24" fill="none" stroke="#facc15" strokeWidth="1" strokeDasharray="2,2" />
          </g>
        )}
      </g>

      {/* 4. Armature Springs & Contact Mechanism (Right Side) */}
      {/* Contact pads */}
      <circle cx="16" cy="-30" r="1.8" fill="#94a3b8" />
      <circle cx="16" cy="0" r="1.8" fill="#94a3b8" />
      <circle cx="16" cy="30" r="1.8" fill="#94a3b8" />

      {/* Spring Armature blade pivoting from COM (y=-30) down to NC (y=0) or NO (y=30) */}
      <line
        x1="16"
        y1="-30"
        x2="16"
        y2={isEnergized ? 30 : 0}
        stroke={isEnergized ? '#10b981' : '#cbd5e1'}
        strokeWidth="2.4"
        strokeLinecap="round"
        style={{ transition: 'y2 0.08s cubic-bezier(0.25, 1, 0.5, 1), stroke 0.08s ease' }}
      />
      {/* Contact button on tip of armature */}
      <circle
        cx="16"
        cy={isEnergized ? 30 : 0}
        r="2.6"
        fill="#f8fafc"
        stroke="#475569"
        strokeWidth="0.6"
        style={{ transition: 'cy 0.08s cubic-bezier(0.25, 1, 0.5, 1)' }}
      />

      {/* Magnetic pull dashed linkage line */}
      <line
        x1="-22"
        y1="0"
        x2="16"
        y2={isEnergized ? 15 : 0}
        stroke="#71717a"
        strokeWidth="0.8"
        strokeDasharray="2,2"
        opacity="0.4"
        style={{ transition: 'y2 0.08s ease' }}
      />

      {/* 5. Clean Silkscreen Text Labels */}
      {/* Left side coil labels */}
      <text x="-14" y="-28" fill="#64748b" fontSize="5.5" fontWeight="bold" fontFamily="monospace" textAnchor="start">A1</text>
      <text x="-14" y="32" fill="#64748b" fontSize="5.5" fontWeight="bold" fontFamily="monospace" textAnchor="start">A2</text>
      <text x="-22" y="4" fill="#93c5fd" fontSize="5" fontWeight="black" fontFamily="sans-serif" textAnchor="middle" opacity="0.8">COIL</text>

      {/* Right side contact labels */}
      <text x="8" y="-28" fill="#64748b" fontSize="5.5" fontWeight="bold" fontFamily="monospace" textAnchor="end">COM</text>
      <text x="8" y="2" fill="#64748b" fontSize="5.5" fontWeight="bold" fontFamily="monospace" textAnchor="end">NC</text>
      <text x="8" y="32" fill="#64748b" fontSize="5.5" fontWeight="bold" fontFamily="monospace" textAnchor="end">NO</text>

      {/* 6. Active Indicator LED */}
      <circle
        cx="0"
        cy="-42"
        r="2.2"
        fill={isEnergized ? '#10b981' : '#334155'}
        stroke={isEnergized ? '#a7f3d0' : '#1e293b'}
        strokeWidth="0.4"
        style={{ filter: isEnergized ? 'drop-shadow(0 0 3px #10b981)' : 'none' }}
      />
      <text
        x="0"
        y="-34"
        fill={isEnergized ? '#10b981' : '#64748b'}
        fontSize="4.5"
        fontWeight="bold"
        fontFamily="monospace"
        textAnchor="middle"
      >
        {isEnergized ? 'ACTIVE' : 'OFF'}
      </text>

      {/* Outer Label text */}
      <text x="0" y="68" fill="#cbd5e1" fontSize="9" fontWeight="bold" textAnchor="middle" fontFamily="monospace">
        {component.label}
      </text>
    </g>
  );
};

export const RelayDPDT: React.FC<ComponentProps> = ({ component }) => {
  const isEnergized = component.state.energized || false;
  // RDC12 is a 12VDC part; the MY2-GS-R DC24 used by the access-control labs
  // shares the base but runs a 24V coil, so the rating is per-instance.
  const coilVoltage = Number(component.state.coilVoltage ?? 12);

  // Contacts rest on NC and transfer to NO while the coil is held in.
  const bladeY = (nc: number, no: number) => (isEnergized ? no : nc);
  const contactTransition = 'y2 0.08s cubic-bezier(0.25, 1, 0.5, 1), cy 0.08s cubic-bezier(0.25, 1, 0.5, 1), stroke 0.08s ease';

  // Base terminal screw with the datasheet pin number and contact function.
  const renderTerminal = ({ pin, fn, x, y }: DPDTPin) => {
    const isTop = y < 0;
    return (
      <g key={`pin-${pin}`}>
        {/* Moulded screw pocket */}
        <rect
          x={x - 8.5}
          y={y - 9}
          width="17"
          height="18"
          rx="2"
          fill="#0d1016"
          stroke="#333a47"
          strokeWidth="0.7"
        />
        {/* Plated screw head */}
        <circle cx={x} cy={y} r="5.4" fill="#9aa3b2" stroke="#5b6373" strokeWidth="0.8" />
        <circle cx={x} cy={y} r="5.4" fill="#e2e8f0" fillOpacity="0.25" />
        <path
          d={`M ${x - 3.6} ${y - 2.2} L ${x + 3.6} ${y + 2.2}`}
          stroke="#3f4653"
          strokeWidth="1.7"
          strokeLinecap="round"
        />
        {/* Pin number, printed outboard exactly as on the base */}
        <text
          x={x}
          y={isTop ? y - 7 : y + 12.5}
          fill="#e2e8f0"
          fontSize="7"
          fontWeight="900"
          fontFamily="monospace"
          textAnchor="middle"
        >
          {pin}
        </text>
        {/* Contact function, printed inboard on the base moulding */}
        <text
          x={x}
          y={isTop ? y + 12 : y - 8.5}
          fill="#7c8798"
          fontSize="5.2"
          fontWeight="bold"
          fontFamily="monospace"
          textAnchor="middle"
        >
          {fn}
        </text>
      </g>
    );
  };

  return (
    <g>
      {/* ---- Socket base (DIN-rail relay base, black polycarbonate) ---- */}
      <rect
        x="-56"
        y="-62"
        width="112"
        height="124"
        rx="4"
        fill="#14171d"
        stroke="#39414f"
        strokeWidth="1.4"
        filter="drop-shadow(0 4px 10px rgba(0,0,0,0.45))"
      />

      {/* Upper and lower terminal decks, split into two banks like the real base */}
      <rect x="-54" y="-62" width="108" height="28" rx="3" fill="#1b1f27" stroke="#39414f" strokeWidth="0.9" />
      <rect x="-54" y="34" width="108" height="28" rx="3" fill="#1b1f27" stroke="#39414f" strokeWidth="0.9" />

      {/* Centre channel between the contact bank and the coil bank */}
      <line x1="0" y1="-62" x2="0" y2="-34" stroke="#0b0d12" strokeWidth="2.2" />
      <line x1="0" y1="34" x2="0" y2="62" stroke="#0b0d12" strokeWidth="2.2" />

      {/* DIN rail clip detail on the base skirt */}
      <rect x="-16" y="56" width="32" height="6" rx="2" fill="#0b0d12" stroke="#39414f" strokeWidth="0.7" />

      {/* ---- Plug-in relay, clear polycarbonate housing ---- */}
      <g>
        {/* Housing body: water-clear with the faint teal cast of the real part */}
        <rect
          x="-42"
          y="-33"
          width="84"
          height="66"
          rx="3"
          fill="#7dd3fc"
          fillOpacity="0.09"
          stroke="#67e8f9"
          strokeOpacity="0.55"
          strokeWidth="1.2"
        />
        {/* Moulded flange where the housing meets the base */}
        <rect x="-44" y="27" width="88" height="7" rx="2" fill="#e8ecf2" fillOpacity="0.12" stroke="#67e8f9" strokeOpacity="0.3" strokeWidth="0.7" />
        {/* Specular highlight down the left face of the clear cover */}
        <path d="M -38 -30 L -30 -30 L -34 30 L -40 30 Z" fill="#e0f2fe" fillOpacity="0.10" />

        {/* -- Coil assembly (white bobbin + copper winding) -- */}
        <g transform="translate(-23, 0)">
          {/* Bobbin flanges */}
          <rect x="-11" y="-25" width="22" height="5" rx="1" fill="#e5e7eb" fillOpacity="0.82" />
          <rect x="-11" y="20" width="22" height="5" rx="1" fill="#e5e7eb" fillOpacity="0.82" />
          {/* Winding pack */}
          <rect x="-9.5" y="-20" width="19" height="40" fill={isEnergized ? '#d97706' : '#a16207'} fillOpacity="0.55" style={{ transition: 'fill 0.15s ease' }} />
          {[-17, -13, -9, -5, -1, 3, 7, 11, 15].map(yVal => (
            <line
              key={yVal}
              x1="-9.5"
              y1={yVal}
              x2="9.5"
              y2={yVal + 1.6}
              stroke={isEnergized ? '#fbbf24' : '#b45309'}
              strokeWidth="1.5"
              style={{ transition: 'stroke 0.15s ease' }}
            />
          ))}
          {/* Iron core through the bobbin */}
          <rect x="-2.5" y="-25" width="5" height="50" rx="1" fill="#6b7280" />
          {/* Coil rating, printed on the bobbin as on the real part */}
          <text x="0" y="-27.5" fill="#cbd5e1" fontSize="5.4" fontWeight="bold" fontFamily="monospace" textAnchor="middle">
            {coilVoltage}VDC
          </text>
          {isEnergized && (
            <g className="animate-pulse-magnetic">
              <ellipse cx="0" cy="0" rx="15" ry="27" fill="none" stroke="#facc15" strokeWidth="1" strokeDasharray="2,2" />
            </g>
          )}
        </g>

        {/* -- Armature yoke: pulled down onto the core when the coil is held in -- */}
        <path
          d={`M -23 ${isEnergized ? -26 : -29} L -4 ${isEnergized ? -26 : -29}`}
          stroke="#b45309"
          strokeWidth="3"
          strokeLinecap="round"
          style={{ transition: 'd 0.08s cubic-bezier(0.25, 1, 0.5, 1)' }}
        />

        {/* -- Insulating actuator card that drives both poles together -- */}
        <rect
          x="-6"
          y={isEnergized ? -25 : -28}
          width="6"
          height="53"
          rx="1.5"
          fill="#f1f5f9"
          fillOpacity="0.85"
          stroke="#94a3b8"
          strokeWidth="0.5"
          style={{ transition: 'y 0.08s cubic-bezier(0.25, 1, 0.5, 1)' }}
        />

        {/* -- Pole 1 (upper): C5 rests on NC1, transfers to NO1 -- */}
        <circle cx="30" cy="-24" r="2.2" fill="#cbd5e1" />
        <circle cx="30" cy="-6" r="2.2" fill="#cbd5e1" />
        <circle cx="8" cy="-15" r="2" fill="#94a3b8" />
        <line
          x1="8"
          y1="-15"
          x2="30"
          y2={bladeY(-24, -6)}
          stroke={isEnergized ? '#34d399' : '#e2e8f0'}
          strokeWidth="2.6"
          strokeLinecap="round"
          style={{ transition: contactTransition }}
        />
        <circle
          cx="30"
          cy={bladeY(-24, -6)}
          r="2.8"
          fill="#fef9c3"
          stroke="#a16207"
          strokeWidth="0.7"
          style={{ transition: contactTransition }}
        />

        {/* -- Pole 2 (lower): C6 rests on NC2, transfers to NO2 -- */}
        <circle cx="30" cy="6" r="2.2" fill="#cbd5e1" />
        <circle cx="30" cy="24" r="2.2" fill="#cbd5e1" />
        <circle cx="8" cy="15" r="2" fill="#94a3b8" />
        <line
          x1="8"
          y1="15"
          x2="30"
          y2={bladeY(6, 24)}
          stroke={isEnergized ? '#34d399' : '#e2e8f0'}
          strokeWidth="2.6"
          strokeLinecap="round"
          style={{ transition: contactTransition }}
        />
        <circle
          cx="30"
          cy={bladeY(6, 24)}
          r="2.8"
          fill="#fef9c3"
          stroke="#a16207"
          strokeWidth="0.7"
          style={{ transition: contactTransition }}
        />

        {/* Pole identification inside the cover */}
        <text x="38" y="-13" fill="#7c8798" fontSize="5" fontWeight="bold" fontFamily="monospace" textAnchor="middle" opacity="0.75">P1</text>
        <text x="38" y="17" fill="#7c8798" fontSize="5" fontWeight="bold" fontFamily="monospace" textAnchor="middle" opacity="0.75">P2</text>
      </g>

      {/* Mechanical flag on the cover, mirroring the real indicator */}
      <circle
        cx="-23"
        cy="30"
        r="2.4"
        fill={isEnergized ? '#10b981' : '#334155'}
        stroke={isEnergized ? '#a7f3d0' : '#1e293b'}
        strokeWidth="0.4"
        style={{ filter: isEnergized ? 'drop-shadow(0 0 3px #10b981)' : 'none' }}
      />

      {/* ---- Base terminals: eight screws, numbered per the datasheet ---- */}
      {DPDT_PINS.map(renderTerminal)}

      {/* Nameplate stays clear of the terminal decks and any field wiring. */}
      <g transform="translate(0, 78)" pointerEvents="none">
        <rect
          x="-49"
          y="-10"
          width="98"
          height="18"
          rx="5"
          fill="#070b13"
          fillOpacity="0.96"
          stroke="#334155"
          strokeWidth="1"
        />
        <text
          x="0"
          y="2.5"
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
