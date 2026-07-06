import React from 'react';
import type { CircuitComponent } from '../../../types/game';
import { useGameStore } from '../../../store/useGameStore';
import { getTerminalKey } from '../../../simulation/circuitSolver';

interface ComponentProps {
  component: CircuitComponent;
}

export const DoorSensor: React.FC<ComponentProps> = ({ component }) => {
  const toggleSwitch = useGameStore(state => state.toggleSwitch);
  const nodeVoltages = useGameStore(state => state.simulation.nodeVoltages);
  const isRunning = useGameStore(state => state.isRunning);

  const isOpen = component.state.toggled || false;
  const inKey = getTerminalKey(component.id, 'in');
  const outKey = getTerminalKey(component.id, 'out');
  const hasVoltage = isRunning && ((nodeVoltages[inKey] || 0) > 0 || (nodeVoltages[outKey] || 0) > 0);

  const handlePointerDown = (e: React.PointerEvent) => {
    e.stopPropagation();
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    e.stopPropagation();
    toggleSwitch(component.id);
  };

  return (
    <g transform="translate(-48, -32)" className="select-none cursor-pointer" onPointerDown={handlePointerDown} onPointerUp={handlePointerUp}>
      <rect x="0" y="6" width="96" height="48" rx="4" fill="#1e222b" stroke="#475569" strokeWidth="2" />
      <rect x="8" y="12" width="34" height="34" rx="3" fill="#0f172a" stroke="#334155" strokeWidth="1.5" />
      <rect x="54" y="12" width="34" height="34" rx="3" fill="#111827" stroke="#334155" strokeWidth="1.5" />

      <text x="25" y="25" textAnchor="middle" fill="#cbd5e1" fontSize="7" fontWeight="bold">DOOR</text>
      <text x="25" y="36" textAnchor="middle" fill="#94a3b8" fontSize="6">MAG</text>
      <text x="71" y="25" textAnchor="middle" fill="#cbd5e1" fontSize="7" fontWeight="bold">REED</text>
      <text x="71" y="36" textAnchor="middle" fill={isOpen ? '#f87171' : '#86efac'} fontSize="6" fontWeight="bold">
        {isOpen ? 'OPEN' : 'CLOSED'}
      </text>

      <line x1="12" y1="30" x2="34" y2="30" stroke="#64748b" strokeWidth="2" strokeLinecap="round" />
      <line x1="62" y1="30" x2="84" y2="30" stroke="#64748b" strokeWidth="2" strokeLinecap="round" />
      {isOpen ? (
        <line
          x1="38"
          y1="30"
          x2="58"
          y2="20"
          stroke={hasVoltage ? '#fbbf24' : '#f87171'}
          strokeWidth="2.5"
          strokeLinecap="round"
        />
      ) : (
        <line
          x1="34"
          y1="30"
          x2="62"
          y2="30"
          stroke={hasVoltage ? '#22c55e' : '#94a3b8'}
          strokeWidth="2.5"
          strokeLinecap="round"
        />
      )}

      <circle cx="12" cy="30" r="2.5" fill="#f8fafc" stroke="#334155" strokeWidth="1" />
      <circle cx="84" cy="30" r="2.5" fill="#f8fafc" stroke="#334155" strokeWidth="1" />

      <text x="48" y="68" fill="#cbd5e1" fontSize="10" fontWeight="bold" textAnchor="middle">
        {component.label}
      </text>
    </g>
  );
};

export default DoorSensor;
