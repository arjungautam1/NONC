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

      {/* 2. Connection traces */}
      {/* Left side traces (Pole 1) */}
      <line x1="-45" y1="-30" x2="-32" y2="-30" stroke="#3b82f6" strokeWidth="1.2" />
      <line x1="-45" y1="0" x2="-32" y2="0" stroke="#3b82f6" strokeWidth="1.2" />
      <line x1="-45" y1="30" x2="-32" y2="30" stroke="#3b82f6" strokeWidth="1.2" />

      {/* Right side traces (Pole 2) */}
      <line x1="45" y1="-30" x2="32" y2="-30" stroke="#3b82f6" strokeWidth="1.2" />
      <line x1="45" y1="0" x2="32" y2="0" stroke="#3b82f6" strokeWidth="1.2" />
      <line x1="45" y1="30" x2="32" y2="30" stroke="#3b82f6" strokeWidth="1.2" />

      {/* Coil traces */}
      <line x1="-35" y1="45" x2="-5" y2="20" stroke="#ca8a04" strokeWidth="1.2" />
      <line x1="35" y1="45" x2="5" y2="20" stroke="#ca8a04" strokeWidth="1.2" />

      {/* 3. Central Solenoid Electromagnetic Coil */}
      <g transform="translate(0, 0)">
        {/* Core bar */}
        <rect x="-4.5" y="-18" width="9" height="38" rx="1" fill="#4b5563" />
        
        {/* Coil windings */}
        {[-14, -10, -6, -2, 2, 6, 10, 14].map((yVal) => (
          <path
            key={yVal}
            d={`M -4.5 ${yVal} C 5.5 ${yVal - 1.5}, 5.5 ${yVal + 1.5}, -4.5 ${yVal + 2}`}
            fill="none"
            stroke={isEnergized ? '#fbbf24' : '#b45309'}
            strokeWidth="1.8"
            style={{ transition: 'stroke 0.15s ease' }}
          />
        ))}

        {/* Pulsing magnetic fields when energized */}
        {isEnergized && (
          <g className="animate-pulse-magnetic">
            <ellipse cx="0" cy="0" rx="16" ry="26" fill="none" stroke="#facc15" strokeWidth="1.2" strokeDasharray="3,3" />
          </g>
        )}
      </g>

      {/* 4. Left Armature Spring & Contacts (Pole 1) */}
      <circle cx="-32" cy="-30" r="1.8" fill="#94a3b8" />
      <circle cx="-32" cy="0" r="1.8" fill="#94a3b8" />
      <circle cx="-32" cy="30" r="1.8" fill="#94a3b8" />

      <line
        x1="-32"
        y1="-30"
        x2="-32"
        y2={isEnergized ? 30 : 0}
        stroke={isEnergized ? '#10b981' : '#cbd5e1'}
        strokeWidth="2.4"
        strokeLinecap="round"
        style={{ transition: 'y2 0.08s cubic-bezier(0.25, 1, 0.5, 1), stroke 0.08s ease' }}
      />
      <circle
        cx="-32"
        cy={isEnergized ? 30 : 0}
        r="2.6"
        fill="#f8fafc"
        stroke="#475569"
        strokeWidth="0.6"
        style={{ transition: 'cy 0.08s cubic-bezier(0.25, 1, 0.5, 1)' }}
      />

      {/* 5. Right Armature Spring & Contacts (Pole 2) */}
      <circle cx="32" cy="-30" r="1.8" fill="#94a3b8" />
      <circle cx="32" cy="0" r="1.8" fill="#94a3b8" />
      <circle cx="32" cy="30" r="1.8" fill="#94a3b8" />

      <line
        x1="32"
        y1="-30"
        x2="32"
        y2={isEnergized ? 30 : 0}
        stroke={isEnergized ? '#10b981' : '#cbd5e1'}
        strokeWidth="2.4"
        strokeLinecap="round"
        style={{ transition: 'y2 0.08s cubic-bezier(0.25, 1, 0.5, 1), stroke 0.08s ease' }}
      />
      <circle
        cx="32"
        cy={isEnergized ? 30 : 0}
        r="2.6"
        fill="#f8fafc"
        stroke="#475569"
        strokeWidth="0.6"
        style={{ transition: 'cy 0.08s cubic-bezier(0.25, 1, 0.5, 1)' }}
      />

      {/* 6. Text Labels */}
      {/* Coil +Ve/-Ve */}
      <text x="-26" y="52" fill="#64748b" fontSize="5" fontWeight="bold" fontFamily="monospace" textAnchor="start">+Ve</text>
      <text x="26" y="52" fill="#64748b" fontSize="5" fontWeight="bold" fontFamily="monospace" textAnchor="end">-Ve</text>
      <text x="0" y="27" fill="#93c5fd" fontSize="4.5" fontWeight="black" fontFamily="sans-serif" textAnchor="middle" opacity="0.8">COIL</text>

      {/* Left Pole Labels */}
      <text x="-24" y="-27" fill="#64748b" fontSize="5" fontWeight="bold" fontFamily="monospace" textAnchor="start">C</text>
      <text x="-24" y="3" fill="#64748b" fontSize="5" fontWeight="bold" fontFamily="monospace" textAnchor="start">NC</text>
      <text x="-24" y="33" fill="#64748b" fontSize="5" fontWeight="bold" fontFamily="monospace" textAnchor="start">NO</text>

      {/* Right Pole Labels */}
      <text x="24" y="-27" fill="#64748b" fontSize="5" fontWeight="bold" fontFamily="monospace" textAnchor="end">C</text>
      <text x="24" y="3" fill="#64748b" fontSize="5" fontWeight="bold" fontFamily="monospace" textAnchor="end">NC</text>
      <text x="24" y="33" fill="#64748b" fontSize="5" fontWeight="bold" fontFamily="monospace" textAnchor="end">NO</text>

      {/* Active Indicator LED */}
      <circle
        cx="0"
        cy="-46"
        r="2.2"
        fill={isEnergized ? '#10b981' : '#334155'}
        stroke={isEnergized ? '#a7f3d0' : '#1e293b'}
        strokeWidth="0.4"
        style={{ filter: isEnergized ? 'drop-shadow(0 0 3px #10b981)' : 'none' }}
      />
      <text
        x="0"
        y="-38"
        fill={isEnergized ? '#10b981' : '#64748b'}
        fontSize="4.5"
        fontWeight="bold"
        fontFamily="monospace"
        textAnchor="middle"
      >
        {isEnergized ? 'ACTIVE' : 'OFF'}
      </text>

      {/* Outer Label text */}
      <text x="0" y="74" fill="#cbd5e1" fontSize="9" fontWeight="bold" textAnchor="middle" fontFamily="monospace">
        {component.label}
      </text>
    </g>
  );
};

