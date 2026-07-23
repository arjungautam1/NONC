import React from 'react';
import type { CircuitComponent } from '../../../types/game';
import { useGameStore } from '../../../store/useGameStore';

interface FieldControlProps {
  component: CircuitComponent;
}

export const PullStation: React.FC<FieldControlProps> = ({ component }) => {
  const toggleSwitch = useGameStore(state => state.toggleSwitch);
  const isPulled = Boolean(component.state.toggled);

  const handleToggle = (event: React.PointerEvent<SVGGElement>) => {
    event.stopPropagation();
    toggleSwitch(component.id);
  };

  return (
    <g className="cursor-pointer select-none" onPointerUp={handleToggle}>
      <rect x="-49" y="-62" width="98" height="124" rx="8" fill="#172033" stroke="#334155" strokeWidth="3" />
      <rect x="-43" y="-56" width="86" height="112" rx="6" fill={isPulled ? '#7f1d1d' : '#b91c1c'} stroke="#ef4444" strokeWidth="2" />
      <rect x="-34" y="-44" width="68" height="31" rx="4" fill="#f8fafc" stroke="#cbd5e1" />
      <text x="0" y="-32" fill="#991b1b" fontSize="8" fontWeight="900" textAnchor="middle">EMERGENCY</text>
      <text x="0" y="-21" fill="#111827" fontSize="7.5" fontWeight="900" textAnchor="middle">PULL STATION</text>

      <g
        transform={`translate(0, ${isPulled ? 17 : 4}) rotate(${isPulled ? 8 : 0})`}
        style={{ transition: 'transform 140ms cubic-bezier(0.2, 0.9, 0.3, 1)' }}
      >
        <path d="M-30 -1 L30 -1 L23 39 L-23 39 Z" fill="#e2e8f0" stroke="#94a3b8" strokeWidth="2" />
        <path d="M-17 9 L17 9" stroke="#475569" strokeWidth="2" strokeLinecap="round" />
        <path d="M-12 16 L0 27 L12 16" fill="none" stroke="#b91c1c" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        <text x="0" y="36" fill="#334155" fontSize="6.5" fontWeight="900" textAnchor="middle">PULL DOWN</text>
      </g>

      <rect x="-43" y="47" width="86" height="9" rx="3" fill={isPulled ? '#450a0a' : '#7f1d1d'} />
      <circle cx="-35" cy="51.5" r="2" fill={isPulled ? '#fbbf24' : '#22c55e'} className={isPulled ? 'animate-pulse' : ''} />
      <text x="4" y="54" fill="#fee2e2" fontSize="6" fontWeight="800" textAnchor="middle">
        {isPulled ? 'ACTIVATED' : 'NORMAL'}
      </text>

      {/* Contact legend aligned with the three external terminals. */}
      <text x="-40" y="38" fill="#cbd5e1" fontSize="5.5" fontWeight="800">C</text>
      <text x="34" y="-27" fill="#fecaca" fontSize="5.5" fontWeight="800">NO</text>
      <text x="34" y="17" fill="#dcfce7" fontSize="5.5" fontWeight="800">NC</text>

      <g transform="translate(0, 76)" pointerEvents="none">
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
