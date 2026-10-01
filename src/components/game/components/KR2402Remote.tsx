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
      {/* Chrome bezel and tapered shell from the QIACHIP product remote. */}
      <path d="M -19 -47 Q -25 -39 -25 -22 L -22 24 Q -20 39 -12 49 L -8 57 L 8 57 L 12 49 Q 20 39 22 24 L 25 -22 Q 25 -39 19 -47 Z" fill="#d6d3d1" stroke="#737373" strokeWidth="1.4" filter="drop-shadow(1px 4px 5px rgba(0,0,0,.45))" />
      <path d="M -15 -45 Q -21 -35 -21 -20 L -18 23 Q -17 35 -10 45 L -7 50 L 7 50 L 10 45 Q 17 35 18 23 L 21 -20 Q 21 -35 15 -45 Z" fill="#101114" stroke="#3f3f46" strokeWidth="1" />
      <path d="M -18 -38 Q -22 -20 -18 19 M 18 -38 Q 22 -20 18 19" fill="none" stroke="#f5f5f4" strokeOpacity="0.5" strokeWidth="1.2" />
      <rect x="-5.5" y="-40" width="11" height="4.8" rx="2.4" fill={pressedButton ? '#ef4444' : '#24262b'} stroke="#52525b" />

      {([[0, -18, 'A'], [0, 10, 'B']] as const).map(([x, y, button]) => {
        const pressed = pressedButton === button;
        return (
          <g key={button} className="device-control cursor-pointer" onPointerDown={event => press(event, button)} onPointerUp={event => release(event, button)} onPointerLeave={leave}>
            <rect x={x - 10} y={(pressed ? y + 1.2 : y) - 12} width="20" height="24" rx="5" fill={pressed ? '#26272b' : '#0a0b0e'} stroke="#52525b" strokeWidth="1.3" />
            <path d={`M ${x - 7} ${y - 8} Q ${x} ${y - 11} ${x + 7} ${y - 8}`} fill="none" stroke="#737373" strokeWidth="1" opacity="0.7" />
            <text x={x} y={y + 5} fill="#e7e5e4" fontSize="13" fontWeight="500" textAnchor="middle" pointerEvents="none">{button}</text>
            <rect x={x - 12} y={y - 13} width="24" height="26" rx="6" fill="transparent" pointerEvents="all" />
          </g>
        );
      })}

      {/* Lower chrome eyelet, split ring, and snap-hook style keychain. */}
      <rect x="-7" y="48" width="14" height="7" rx="3.5" fill="#171717" stroke="#a3a3a3" strokeWidth="1.5" />
      <circle cx="0" cy="63" r="9" fill="none" stroke="#d4d4d4" strokeWidth="2.2" />
      <path d="M 8 65 C 17 58, 27 59, 30 67 C 32 74, 25 81, 17 78 L 9 73" fill="none" stroke="#b8b8b8" strokeWidth="3" strokeLinecap="round" />
      <path d="M 28 66 l 7 5 l -7 5" fill="none" stroke="#737373" strokeWidth="1.5" />

      <g transform="translate(0, 98)" pointerEvents="none">
        <rect x="-48" y="-9" width="96" height="18" rx="5" fill="#070b13" stroke="#334155" />
        <text x="0" y="3" fill="#f1f5f9" fontSize="7.2" fontWeight="800" textAnchor="middle" fontFamily="monospace">{component.label}</text>
      </g>
    </g>
  );
};

export default KR2402Remote;
