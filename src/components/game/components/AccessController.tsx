import React from 'react';
import type { CircuitComponent } from '../../../types/game';
import { useGameStore } from '../../../store/useGameStore';
import { ACCESS_CONTROLLER_PINS, ACCESS_READER_PINS, accessDoorStatusLabel } from './accessControllerPinout';

const alarmStatus = (status: string) => ['forced-open', 'held-open', 'wiring-fault'].includes(status);
/** Terminals remain managed by Workspace; this screw artwork aligns with the shared pinout. */
const Screw: React.FC<{ x: number; y: number; color?: string }> = ({ x, y, color = '#245d3e' }) => (
  <g pointerEvents="none">
    <rect x={x - 11} y={y - 11} width="22" height="22" rx="2" fill={color} stroke="#0d2d1c" strokeWidth="1" />
    <circle cx={x} cy={y} r="6.4" fill="#cbd5d9" stroke="#566877" strokeWidth="0.8" />
    <line x1={x - 3.8} y1={y + 1.1} x2={x + 3.8} y2={y - 1.1} stroke="#354453" strokeWidth="1.6" strokeLinecap="round" />
  </g>
);

export const AccessController: React.FC<{ component: CircuitComponent }> = ({ component }) => {
  const powered = Boolean(component.state.boardPowered);
  const gradientId = `access-controller-${component.id}`;

  return (
    <g className="select-none">
      <defs>
        <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#192a2c" />
          <stop offset="100%" stopColor="#091719" />
        </linearGradient>
      </defs>
      <rect x="-173" y="-168" width="346" height="336" rx="9" fill={`url(#${gradientId})`} stroke="#567077" strokeWidth="1.7" filter="drop-shadow(0 5px 9px rgba(0,0,0,0.6))" />
      <rect x="-165" y="-160" width="330" height="320" rx="5" fill="none" stroke="#294d47" strokeWidth="0.7" />
      {[[-159, -151], [159, -151], [-159, 151], [159, 151]].map(([x, y]) => (
        <g key={`${x}-${y}`} pointerEvents="none">
          <circle cx={x} cy={y} r="4" fill="#778687" />
          <circle cx={x} cy={y} r="2" fill="#101b20" />
        </g>
      ))}

      <g pointerEvents="none" fontFamily="sans-serif">
        <text x="0" y="-131" fill="#a7e0f3" fontSize="13" fontWeight="900" letterSpacing="1.6" textAnchor="middle">DELMI AC-2</text>
        <text x="0" y="-117" fill="#93a9b3" fontSize="6.5" fontWeight="700" letterSpacing="0.5" textAnchor="middle">TWO-DOOR TRAINING CONTROLLER</text>
        <text x="0" y="-195" fill="#a5b9c2" fontSize="7" fontWeight="800" textAnchor="middle">12V DC INPUT</text>
        <text x="-105" y="-116" fill="#73cdb9" fontSize="7.5" fontWeight="900" textAnchor="middle">READER 1</text>
        <text x="105" y="-116" fill="#73cdb9" fontSize="7.5" fontWeight="900" textAnchor="middle">READER 2</text>
        <text x="-110" y="64" fill="#73cdb9" fontSize="7.5" fontWeight="900" textAnchor="middle">DOOR 1 INPUTS</text>
        <text x="110" y="64" fill="#73cdb9" fontSize="7.5" fontWeight="900" textAnchor="middle">DOOR 2 INPUTS</text>
        <text x="-60" y="151" fill="#a5b9c2" fontSize="7" fontWeight="800" textAnchor="middle">LOCK 1 · DRY RELAY</text>
        <text x="60" y="151" fill="#a5b9c2" fontSize="7" fontWeight="800" textAnchor="middle">LOCK 2 · DRY RELAY</text>

        {/* Exposed traces make the connection groups visually distinct from the status display. */}
        {[1, 2].map(door => {
          const side = door === 1 ? -1 : 1;
          return <g key={door} fill="none" stroke="#245c46" strokeWidth="1.1" opacity="0.55">
            <path d={`M ${side * 158} -70 H ${side * 118} L ${side * 99} -51 V -19`} />
            <path d={`M ${side * 158} -20 H ${side * 130} L ${side * 104} 6 V 26`} />
            <path d={`M ${side * 155} 105 H ${side * 130} L ${side * 105} 126 H ${side * 73}`} />
          </g>;
        })}
        <rect x="-47" y="-91" width="94" height="24" rx="4" fill="#0a141a" stroke="#264a53" />
        <circle cx="-30" cy="-79" r="3" fill={powered ? '#34d399' : '#475569'} style={{ filter: powered ? 'drop-shadow(0 0 3px #34d399)' : undefined }} />
        <text x="-21" y="-76" fill={powered ? '#a7f3d0' : '#94a3b8'} fontSize="7.5" fontWeight="800">{powered ? 'POWER / RUN' : 'POWER OFF'}</text>
        {[1, 2].map(door => {
          const active = Boolean(component.state[`relay${door}Active`]);
          const status = String(component.state[`door${door}Status`] ?? (powered ? 'unmonitored' : 'unpowered'));
          const alarm = alarmStatus(status);
          const y = door === 1 ? -51 : 22;
          return <g key={door}>
            <rect x="-73" y={y} width="146" height="61" rx="5" fill={alarm ? '#2d1a19' : '#0a141a'} stroke={alarm ? '#a54b41' : '#264a53'} />
            <text x="-59" y={y + 14} fill="#b9cdd5" fontSize="8" fontWeight="900">DOOR {door}</text>
            <circle cx="43" cy={y + 11} r="3.2" fill={active ? '#fbbf24' : '#475569'} />
            <text x="-59" y={y + 30} fill={active ? '#fcd34d' : '#8296a2'} fontSize="7.5" fontWeight="800">{active ? 'RELAY ENERGIZED' : 'RELAY AT REST'}</text>
            <text x="-59" y={y + 46} fill={alarm ? '#fca5a5' : '#93b9ba'} fontSize="8" fontWeight="700">{accessDoorStatusLabel(status).toUpperCase()}</text>
          </g>;
        })}
        <text x="0" y="111" fill="#83a4ae" fontSize="6.2" fontWeight="700" textAnchor="middle">CUSTOM PINOUT · WIEGAND EVENTS</text>
        <text x="0" y="124" fill="#63818d" fontSize="6.1" textAnchor="middle">Select board to program &amp; inspect events</text>
      </g>

      {ACCESS_CONTROLLER_PINS.map(pin => {
        const sideTerminal = Math.abs(pin.x) === 180;
        const left = pin.x < 0;
        const textX = sideTerminal ? (left ? -160 : 160) : pin.x;
        const textY = sideTerminal ? pin.y + 3 : pin.y < 0 ? pin.y + 27 : pin.y - 16;
        return <g key={pin.id}>
          <Screw x={pin.x} y={pin.y} color={pin.id === 'pos' || pin.id === 'neg' ? '#42525e' : undefined} />
          <text x={textX} y={textY} fill="#e3eef1" fontSize="8.5" fontWeight="800" fontFamily="monospace" textAnchor={sideTerminal ? (left ? 'start' : 'end') : 'middle'} pointerEvents="none">{pin.label}</text>
        </g>;
      })}
      <g pointerEvents="none">
        <rect x="-87" y="206" width="174" height="21" rx="5" fill="#08111a" stroke="#334155" />
        <text x="0" y="220" fill="#d5e4ea" fontSize="9" fontWeight="800" textAnchor="middle">{component.label}</text>
      </g>
    </g>
  );
};

export const AccessReader: React.FC<{ component: CircuitComponent }> = ({ component }) => {
  const scan = useGameStore(state => state.scanAccessReader);
  const setComponentState = useGameStore(state => state.setComponentState);
  const powered = Boolean(component.state.powered);
  const authorized = component.state.authorized !== false;
  const feedback = String(component.state.feedback ?? 'idle');
  const green = powered && Boolean(component.state.ledActive);
  const buzzer = powered && Boolean(component.state.buzzerActive);
  const bodyGradientId = `access-reader-${component.id}`;
  const feedbackLabel = !powered ? 'NO 12V DC POWER'
    : feedback === 'granted' ? 'ACCESS GRANTED'
      : feedback === 'denied' ? 'ACCESS DENIED'
        : feedback === 'wiring-fault' ? 'CHECK D0 / D1'
          : 'READY TO SCAN';
  const operate = () => { if (powered) scan(component.id); };

  return <g className="select-none">
    <defs>
      <linearGradient id={bodyGradientId} x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#111b25" /><stop offset="40%" stopColor="#25303a" /><stop offset="100%" stopColor="#111b25" />
      </linearGradient>
    </defs>
    <rect x="-77" y="-75" width="154" height="149" rx="10" fill={`url(#${bodyGradientId})`} stroke="#586979" strokeWidth="1.8" filter="drop-shadow(0 4px 7px rgba(0,0,0,0.5))" />
    <text x="0" y="-60" fill="#a9d9f1" fontSize="8.5" fontWeight="900" letterSpacing="1" textAnchor="middle" pointerEvents="none">DELMI READER</text>
    <g className="device-control cursor-pointer" role="button" tabIndex={0}
      aria-label={`Use ${authorized ? 'denied' : 'authorized'} credential on ${component.label}`} aria-pressed={authorized}
      onPointerDown={event => event.stopPropagation()}
      onClick={event => { event.stopPropagation(); setComponentState(component.id, 'authorized', !authorized); }}
      onKeyDown={event => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); event.stopPropagation(); setComponentState(component.id, 'authorized', !authorized); } }}>
      <rect x="-62" y="-51" width="124" height="21" rx="4" fill={authorized ? '#153b34' : '#441f23'} stroke={authorized ? '#33645a' : '#7e3c43'} />
      <text x="0" y="-37" fill={authorized ? '#a7f3d0' : '#fda4af'} fontSize="7" fontWeight="800" textAnchor="middle">{authorized ? 'AUTHORIZED CARD' : 'DENIED CARD'} · ⇄</text>
    </g>
    <g className={`device-control ${powered ? 'cursor-pointer' : 'cursor-not-allowed'}`} role="button" tabIndex={0}
      aria-label={`Scan credential at ${component.label}`} aria-disabled={!powered}
      onPointerDown={event => event.stopPropagation()}
      onClick={event => { event.stopPropagation(); operate(); }}
      onKeyDown={event => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); event.stopPropagation(); operate(); } }}>
      <rect x="-62" y="-23" width="124" height="56" rx="6" fill="#0a121a" stroke={powered ? '#3b5568' : '#23313f'} />
      <rect x="-18" y="-11" width="24" height="17" rx="2" fill="none" stroke={powered ? '#9ac4d8' : '#43515c'} strokeWidth="1.6" transform="rotate(-8)" />
      <path d="M 13 -10 Q 21 -3 13 4 M 19 -15 Q 33 -3 19 9" fill="none" stroke={powered ? '#9ac4d8' : '#43515c'} strokeWidth="1.5" strokeLinecap="round" />
      <text x="0" y="24" fill={powered ? '#d6e9f3' : '#637582'} fontSize="9" fontWeight="900" letterSpacing="1.1" textAnchor="middle">SCAN CARD</text>
    </g>
    <g pointerEvents="none">
      <circle cx="-57" cy="46" r="3" fill={!powered ? '#475569' : green ? '#34d399' : '#fb7185'} style={{ filter: green ? 'drop-shadow(0 0 3px #34d399)' : undefined }} />
      <text x="-48" y="49" fill={!powered ? '#8193a1' : feedback === 'denied' || feedback === 'wiring-fault' ? '#fda4af' : '#bed6df'} fontSize="7" fontWeight="800">{feedbackLabel}</text>
      <text x="0" y="63" fill={buzzer ? '#fcd34d' : '#718995'} fontSize="6.3" fontWeight="700" textAnchor="middle">{buzzer ? 'BUZZER ACTIVE' : '6-WIRE WIEGAND TRAINING READER'}</text>
    </g>
    {ACCESS_READER_PINS.map(pin => <g key={pin.id}>
      <Screw x={pin.x} y={pin.y} />
      <text x={pin.x} y="107" fill="#d5e4ea" fontSize="8" fontFamily="monospace" fontWeight="800" textAnchor="middle" pointerEvents="none">{pin.label}</text>
    </g>)}
    <text x="0" y="124" fill="#94a3b8" fontSize="8" fontWeight="700" textAnchor="middle" pointerEvents="none">{component.label}</text>
  </g>;
};
