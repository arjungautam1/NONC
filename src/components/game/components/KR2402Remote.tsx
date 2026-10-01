import React, { useState } from 'react';
import type { CircuitComponent } from '../../../types/game';
import { useGameStore } from '../../../store/useGameStore';

interface KR2402RemoteProps {
  component: CircuitComponent;
}

/** QIACHIP EV1527 two-button 433.92MHz A/B keyfob used with KR2402A. */
export const KR2402Remote: React.FC<KR2402RemoteProps> = ({ component }) => {
  const triggerKR2402Remote = useGameStore(state => state.triggerKR2402Remote);
  const [pressedButton, setPressedButton] = useState<'A' | 'B' | null>(null);

  const press = (event: React.PointerEvent, button: 'A' | 'B') => {
    event.stopPropagation();
    setPressedButton(button);
    triggerKR2402Remote(component.id, button, true);
  };

  const release = (event: React.PointerEvent, button: 'A' | 'B') => {
    event.stopPropagation();
    setPressedButton(null);
    triggerKR2402Remote(component.id, button, false);
  };

  const leave = () => {
    if (pressedButton) triggerKR2402Remote(component.id, pressedButton, false);
    setPressedButton(null);
  };

  return (
    <g className="select-none">
      <path d="M -7 -46 C -7 -59, 7 -59, 7 -46" fill="none" stroke="#a3a3a3" strokeWidth="5" />
      <circle cx="0" cy="-55" r="7" fill="none" stroke="#d4d4d4" strokeWidth="2.5" />
      <ellipse cx="0" cy="3" rx="29" ry="48" fill="#d4d4d4" stroke="#737373" strokeWidth="1.5" filter="drop-shadow(1px 4px 5px rgba(0,0,0,.45))" />
      <ellipse cx="0" cy="3" rx="25" ry="44" fill="#171717" stroke="#404040" strokeWidth="1.2" />
      <path d="M -18 -32 Q 0 -42 18 -32" fill="none" stroke="#737373" strokeWidth="1" />
      <circle cx="0" cy="-28" r="2.6" fill={pressedButton ? '#ef4444' : '#450a0a'} stroke="#7f1d1d" />
      <text x="0" y="-17" fill="#e5e5e5" fontSize="5.5" fontWeight="900" textAnchor="middle">QIACHIP</text>

      {([[-10, 4, 'A'], [10, 4, 'B']] as const).map(([x, y, button]) => {
        const pressed = pressedButton === button;
        return (
          <g key={button} className="device-control cursor-pointer" onPointerDown={event => press(event, button)} onPointerUp={event => release(event, button)} onPointerLeave={leave}>
            <circle cx={x} cy={pressed ? y + 1.5 : y} r="9" fill={pressed ? '#525252' : '#737373'} stroke="#d4d4d4" strokeWidth="1" />
            <text x={x} y={y + 2.7} fill="#fafafa" fontSize="7" fontWeight="900" textAnchor="middle" pointerEvents="none">{button}</text>
            <circle cx={x} cy={y} r="11" fill="transparent" pointerEvents="all" />
          </g>
        );
      })}

      <text x="0" y="29" fill="#a3a3a3" fontSize="5.2" fontWeight="800" textAnchor="middle">433.92 MHz</text>
      <path d="M -8 35 A 9 9 0 0 1 8 35 M -4 38 A 4.5 4.5 0 0 1 4 38" fill="none" stroke="#737373" strokeWidth="1.2" />
      <g transform="translate(0, 67)" pointerEvents="none">
        <rect x="-48" y="-9" width="96" height="18" rx="5" fill="#070b13" stroke="#334155" />
        <text x="0" y="3" fill="#f1f5f9" fontSize="7.2" fontWeight="800" textAnchor="middle" fontFamily="monospace">{component.label}</text>
      </g>
    </g>
  );
};

export default KR2402Remote;
