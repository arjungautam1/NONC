import React from 'react';
import type { CircuitComponent } from '../../../types/game';
import { useGameStore } from '../../../store/useGameStore';

interface ComponentProps {
  component: CircuitComponent;
}

/** NASCOM N282TXG white surface-mount SPDT switch/magnet set. */
export const DoorSensor: React.FC<ComponentProps> = ({ component }) => {
  const toggleSwitch = useGameStore(state => state.toggleSwitch);
  const doorOpen = Boolean(component.state.toggled);

  const toggleDoor = (event: React.PointerEvent) => {
    event.stopPropagation();
    toggleSwitch(component.id);
  };

  const housing = (x: number, width: number) => (
    <g transform={`translate(${x}, 0)`}>
      <rect x={-width / 2} y="-49" width={width} height="98" rx="7" fill="#d8d5c9" stroke="#8f8b80" strokeWidth="1.5" />
      <rect x={-width / 2 + 4} y="-34" width={width - 8} height="68" rx="5" fill="#eeeade" stroke="#b9b5aa" />
      <circle cx="0" cy="-41" r="4.2" fill="#4b5563" stroke="#f5f5f4" strokeWidth="1.3" />
      <circle cx="0" cy="41" r="4.2" fill="#4b5563" stroke="#f5f5f4" strokeWidth="1.3" />
      <rect x={-width / 2 + 7} y="-13" width={width - 14} height="26" rx="2" fill="none" stroke="#c7c2b6" />
      <text x="0" y="4" fill="#9a968b" fontSize="8.5" fontWeight="900" textAnchor="middle" transform="rotate(90 0 0)">nascom</text>
      <path d={`M ${width / 2 - 10} 25 l 5 4 l -5 4 z`} fill="none" stroke="#aaa69b" strokeWidth="1.4" />
    </g>
  );

  return (
    <g className="select-none">
      <g className="device-control cursor-pointer" onPointerDown={event => event.stopPropagation()} onPointerUp={toggleDoor}>
        {housing(-31, 48)}
        <g transform={`translate(${doorOpen ? 74 : 31}, 0)`} style={{ transition: 'transform 260ms ease' }}>
          {housing(0, 38)}
        </g>
        <rect x="-57" y="-50" width={doorOpen ? 154 : 110} height="100" fill="transparent" pointerEvents="all" />
      </g>

      <g fontFamily="monospace" fontWeight="900" fontSize="7" textAnchor="end">
        <text x="-57" y="-22" fill="#fca5a5">NC</text>
        <text x="-57" y="1" fill="#fde68a">COM</text>
        <text x="-57" y="24" fill="#86efac">NO</text>
      </g>
      {[-24, 0, 24].map((y, index) => (
        <g key={y} transform={`translate(-51 ${y})`}>
          <circle r="6" fill="#d1d5db" stroke="#52525b" strokeWidth="1" />
          <path d="M -3 -2 L 3 2" stroke="#52525b" strokeWidth="1.5" />
          <circle r="8.5" fill="transparent" pointerEvents="all" />
          {index === 1 && <circle r="2" fill="#a16207" opacity="0.65" />}
        </g>
      ))}

      <g transform="translate(7, 61)" pointerEvents="none">
        <rect x="-55" y="-9" width="110" height="18" rx="5" fill="#070b13" stroke="#334155" />
        <text x="0" y="3" fill={doorOpen ? '#fca5a5' : '#86efac'} fontSize="8" fontWeight="900" textAnchor="middle">
          {doorOpen ? 'DOOR OPEN' : 'DOOR CLOSED'}
        </text>
      </g>
      <text x="7" y="82" fill="#e2e8f0" fontSize="9" fontWeight="800" textAnchor="middle">{component.label}</text>
    </g>
  );
};

export default DoorSensor;
