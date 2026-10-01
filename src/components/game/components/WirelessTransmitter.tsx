import React, { useState } from 'react';
import type { CircuitComponent } from '../../../types/game';
import { useGameStore } from '../../../store/useGameStore';

interface WirelessTransmitterProps {
  component: CircuitComponent;
}

/**
 * Two-button 433.92MHz keyfob. A and B operate the matching channels on a
 * powered KR2402A; A also retains compatibility with the CUBE POWER receiver.
 */
export const WirelessTransmitter: React.FC<WirelessTransmitterProps> = ({ component }) => {
  const triggerWirelessTransmitter = useGameStore(state => state.triggerWirelessTransmitter);
  const [pressedChannel, setPressedChannel] = useState<1 | 2 | null>(null);

  const handlePointerDown = (e: React.PointerEvent, channel: 1 | 2) => {
    e.stopPropagation();
    setPressedChannel(channel);
    triggerWirelessTransmitter(component.id, channel, true);
  };

  const handlePointerUp = (e: React.PointerEvent, channel: 1 | 2) => {
    e.stopPropagation();
    setPressedChannel(null);
    triggerWirelessTransmitter(component.id, channel, false);
  };

  const handlePointerLeave = () => {
    if (pressedChannel) triggerWirelessTransmitter(component.id, pressedChannel, false);
    setPressedChannel(null);
  };

  return (
    <g className="select-none">
      {/* Keyring loop + lanyard */}
      <path
        d="M -3 46 C -3 54, -14 56, -14 66 C -14 74, -6 79, 0 79 C 6 79, 14 74, 14 66 C 14 56, 3 54, 3 46"
        fill="none"
        stroke="#1d4ed8"
        strokeWidth="4.5"
        strokeLinecap="round"
      />
      <circle cx="0" cy="66" r="7.5" fill="none" stroke="#8a94a6" strokeWidth="2.4" />

      {/* Fob body */}
      <ellipse cx="0" cy="0" rx="30" ry="42" fill="url(#txBodyGrad)" stroke="#c9cdd6" strokeWidth="1.2" filter="drop-shadow(1px 3px 5px rgba(0,0,0,0.35))" />
      <ellipse cx="0" cy="-2" rx="25" ry="35" fill="#ffffff" opacity="0.12" />

      {([[-12, -8, 1, 'A'], [12, -8, 2, 'B']] as const).map(([cx, cy, channel, label]) => {
        const pressed = pressedChannel === channel;
        return (
          <g key={channel} className="cursor-pointer" onPointerDown={event => handlePointerDown(event, channel)} onPointerUp={event => handlePointerUp(event, channel)} onPointerLeave={handlePointerLeave}>
            <circle cx={cx} cy={cy} r="11" fill="#1e3a8a" stroke="#0f2563" strokeWidth="1.4" />
            <circle cx={cx} cy={pressed ? cy + 1.5 : cy} r="8.3" fill={pressed ? '#1d4ed8' : '#2563eb'} stroke="#0f2563" strokeWidth="1" />
            <text x={cx} y={cy + 2.5} fill="#dbeafe" fontSize="7" fontWeight="900" textAnchor="middle" pointerEvents="none">{label}</text>
            <circle cx={cx} cy={cy} r="11" fill="transparent" pointerEvents="all" />
          </g>
        );
      })}

      {/* RF glyph */}
      <g transform="translate(0, 30)" opacity="0.8" stroke="#64748b" strokeWidth="1.3" fill="none" strokeLinecap="round">
        <path d="M -7 3 A 8 8 0 0 1 7 3" opacity="0.6" />
        <path d="M -4.2 4.6 A 4.6 4.6 0 0 1 4.2 4.6" opacity="0.9" />
        <circle cx="0" cy="5.4" r="1.1" fill="#64748b" stroke="none" />
      </g>

      <defs>
        <linearGradient id="txBodyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#fbfbf8" />
          <stop offset="55%" stopColor="#f0efe9" />
          <stop offset="100%" stopColor="#dcdad0" />
        </linearGradient>
      </defs>

      <g transform="translate(0, 96)" pointerEvents="none">
        <rect x="-42" y="-9" width="84" height="18" rx="5" fill="#070b13" fillOpacity="0.96" stroke="#334155" strokeWidth="1" />
        <text
          x="0"
          y="3"
          fill="#f1f5f9"
          fontSize={component.label.length > 15 ? 7.2 : 8.5}
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

export default WirelessTransmitter;
