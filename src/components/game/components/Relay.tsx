import React from 'react';
import type { CircuitComponent } from '../../../types/game';

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

  // Helper for terminal screw graphics
  const renderScrew = (x: number, y: number) => (
    <g key={`screw-${x}-${y}`}>
      <circle cx={x} cy={y} r="3.2" fill="#475569" stroke="#64748b" strokeWidth="0.8" />
      <line x1={x - 2} y1={y - 1} x2={x + 2} y2={y + 1} stroke="#1e293b" strokeWidth="0.8" />
    </g>
  );

  return (
    <g>
      {/* Outer Enclosure (Delmi Slate Blue Glass style) */}
      <rect
        x="-50"
        y="-60"
        width="100"
        height="120"
        rx="6"
        fill="#0f172a"
        fillOpacity="0.88"
        stroke="#2563eb"
        strokeWidth="1.8"
        filter="drop-shadow(0 4px 10px rgba(0,0,0,0.4))"
      />

      {/* Internal shine accent line */}
      <rect
        x="-46"
        y="-56"
        width="92"
        height="112"
        rx="4"
        fill="none"
        stroke="#60a5fa"
        strokeWidth="0.6"
        opacity="0.15"
      />

      {/* Terminal block headers */}
      <rect x="-45" y="-58" width="90" height="12" rx="2" fill="#1e293b" stroke="#334155" strokeWidth="1" />
      <rect x="-45" y="46" width="90" height="12" rx="2" fill="#1e293b" stroke="#334155" strokeWidth="1" />

      {/* Connection traces */}
      {/* Pole 1 (Top Left Switch) Traces */}
      <path d="M 12 -46 L 12 -34 L -25 -34 L -25 -25" fill="none" stroke="#3b82f6" strokeWidth="1.2" />
      <path d="M -12 -46 L -12 -30 L -25 -30" fill="none" stroke="#3b82f6" strokeWidth="1.2" />
      <path d="M -35 -46 L -35 25 L -25 25" fill="none" stroke="#3b82f6" strokeWidth="1.2" />

      {/* Pole 2 (Bottom Left Switch) Traces */}
      <path d="M 12 46 L 12 34 L -5 34 L -5 25" fill="none" stroke="#3b82f6" strokeWidth="1.2" />
      <path d="M -12 46 L -12 30 L -5 30" fill="none" stroke="#3b82f6" strokeWidth="1.2" />
      <path d="M -35 46 L -35 -25 L -5 -25" fill="none" stroke="#3b82f6" strokeWidth="1.2" />

      {/* Coil Traces */}
      <path d="M 35 -46 L 35 -25 L 22 -25 L 22 -18" fill="none" stroke="#ca8a04" strokeWidth="1.2" />
      <path d="M 35 46 L 35 25 L 22 25 L 22 18" fill="none" stroke="#ca8a04" strokeWidth="1.2" />

      {/* 3. Electromagnetic Coil (Right Side) */}
      <g transform="translate(22, 0)">
        {/* Core bar */}
        <rect x="-3" y="-18" width="6" height="36" rx="1" fill="#4b5563" />
        
        {/* Coil windings */}
        {[-14, -10, -6, -2, 2, 6, 10, 14].map((yVal) => (
          <path
            key={yVal}
            d={`M -3 ${yVal} C 5 ${yVal - 1.5}, 5 ${yVal + 1.5}, -3 ${yVal + 2}`}
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

      {/* 4. Left Armature Spring & Contacts (Pole 1) */}
      <circle cx="-25" cy="-25" r="1.5" fill="#94a3b8" />
      <circle cx="-25" cy="0" r="1.5" fill="#94a3b8" />
      <circle cx="-25" cy="25" r="1.5" fill="#94a3b8" />

      <line
        x1="-25"
        y1="-25"
        x2="-25"
        y2={isEnergized ? 25 : 0}
        stroke={isEnergized ? '#10b981' : '#cbd5e1'}
        strokeWidth="2.4"
        strokeLinecap="round"
        style={{ transition: 'y2 0.08s cubic-bezier(0.25, 1, 0.5, 1), stroke 0.08s ease' }}
      />
      <circle
        cx="-25"
        cy={isEnergized ? 25 : 0}
        r="2.2"
        fill="#f8fafc"
        stroke="#475569"
        strokeWidth="0.6"
        style={{ transition: 'cy 0.08s cubic-bezier(0.25, 1, 0.5, 1)' }}
      />

      {/* 5. Right Armature Spring & Contacts (Pole 2) */}
      <circle cx="-5" cy="25" r="1.5" fill="#94a3b8" />
      <circle cx="-5" cy="0" r="1.5" fill="#94a3b8" />
      <circle cx="-5" cy="-25" r="1.5" fill="#94a3b8" />

      <line
        x1="-5"
        y1="25"
        x2="-5"
        y2={isEnergized ? -25 : 0}
        stroke={isEnergized ? '#10b981' : '#cbd5e1'}
        strokeWidth="2.4"
        strokeLinecap="round"
        style={{ transition: 'y2 0.08s cubic-bezier(0.25, 1, 0.5, 1), stroke 0.08s ease' }}
      />
      <circle
        cx="-5"
        cy={isEnergized ? -25 : 0}
        r="2.2"
        fill="#f8fafc"
        stroke="#475569"
        strokeWidth="0.6"
        style={{ transition: 'cy 0.08s cubic-bezier(0.25, 1, 0.5, 1)' }}
      />

      {/* Silkscreen text markings inside */}
      <text x="-35" y="-38" fill="#64748b" fontSize="5" fontWeight="bold" fontFamily="monospace" textAnchor="middle">NO</text>
      <text x="-12" y="-38" fill="#64748b" fontSize="5" fontWeight="bold" fontFamily="monospace" textAnchor="middle">NC</text>
      <text x="12" y="-38" fill="#64748b" fontSize="5" fontWeight="bold" fontFamily="monospace" textAnchor="middle">C</text>
      <text x="35" y="-38" fill="#64748b" fontSize="5" fontWeight="bold" fontFamily="monospace" textAnchor="middle">NEG-</text>

      <text x="-35" y="42" fill="#64748b" fontSize="5" fontWeight="bold" fontFamily="monospace" textAnchor="middle">NO</text>
      <text x="-12" y="42" fill="#64748b" fontSize="5" fontWeight="bold" fontFamily="monospace" textAnchor="middle">NC</text>
      <text x="12" y="42" fill="#64748b" fontSize="5" fontWeight="bold" fontFamily="monospace" textAnchor="middle">C</text>
      <text x="35" y="42" fill="#64748b" fontSize="5" fontWeight="bold" fontFamily="monospace" textAnchor="middle">POS+</text>

      {/* Decorative silkscreen labels */}
      <text x="22" y="27" fill="#93c5fd" fontSize="4.5" fontWeight="black" fontFamily="sans-serif" textAnchor="middle" opacity="0.8">COIL</text>
      <text x="-20" y="30" fill="#94a3b8" fontSize="12" fontWeight="900" fontFamily="sans-serif" textAnchor="middle" opacity="0.15">RB1224</text>
      <text x="-20" y="-30" fill="#94a3b8" fontSize="6.5" fontWeight="black" fontFamily="sans-serif" textAnchor="middle" opacity="0.15">ALTRONIX</text>

      {/* Active Indicator LED */}
      <circle
        cx="22"
        cy="-32"
        r="2.2"
        fill={isEnergized ? '#10b981' : '#334155'}
        stroke={isEnergized ? '#a7f3d0' : '#1e293b'}
        strokeWidth="0.4"
        style={{ filter: isEnergized ? 'drop-shadow(0 0 3px #10b981)' : 'none' }}
      />
      <text
        x="22"
        y="-26"
        fill={isEnergized ? '#10b981' : '#64748b'}
        fontSize="4.5"
        fontWeight="bold"
        fontFamily="monospace"
        textAnchor="middle"
      >
        {isEnergized ? 'ON' : 'OFF'}
      </text>

      {/* Screw graphics */}
      {[-35, -12, 12, 35].map(x => renderScrew(x, -52))}
      {[-35, -12, 12, 35].map(x => renderScrew(x, 52))}

      {/* Outer Label text */}
      <text x="0" y="74" fill="#cbd5e1" fontSize="9" fontWeight="bold" textAnchor="middle" fontFamily="monospace">
        {component.label}
      </text>
    </g>
  );
};

