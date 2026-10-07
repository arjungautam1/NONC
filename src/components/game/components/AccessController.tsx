import React from 'react';
import type { CircuitComponent } from '../../../types/game';
import { useGameStore } from '../../../store/useGameStore';
import { ACCESS_CONTROLLER_PINS, ACCESS_READER_PINS, accessDoorStatusLabel } from './accessControllerPinout';

const alarmStatus = (status: string) => ['forced-open', 'held-open', 'wiring-fault'].includes(status);

/** Workspace supplies the live terminal hit targets at these same coordinates. */
const Screw: React.FC<{ x: number; y: number; color?: string }> = ({ x, y, color = '#347658' }) => (
  <g pointerEvents="none">
    <rect x={x - 10} y={y - 10} width="20" height="20" rx="2.5" fill={color} stroke="#253941" strokeWidth="0.8" />
    <rect x={x - 8} y={y - 8} width="16" height="3" rx="1" fill="#ffffff" fillOpacity="0.15" />
    <circle cx={x} cy={y} r="6.5" fill="#d7e0e2" stroke="#65767b" strokeWidth="0.8" />
    <circle cx={x} cy={y} r="4.8" fill="#aab9be" />
    <line x1={x - 3.7} y1={y + 1.4} x2={x + 3.7} y2={y - 1.4} stroke="#43515b" strokeWidth="1.7" strokeLinecap="round" />
  </g>
);

export const AccessController: React.FC<{ component: CircuitComponent }> = ({ component }) => {
  const powered = Boolean(component.state.boardPowered);
  const faceId = `access-controller-face-${component.id}`;
  const metalId = `access-controller-metal-${component.id}`;

  return <g className="select-none">
    <defs>
      <linearGradient id={faceId} x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#fafbf7" /><stop offset="55%" stopColor="#eef1eb" /><stop offset="100%" stopColor="#d7dfd9" />
      </linearGradient>
      <linearGradient id={metalId} x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#7d8d94" /><stop offset="20%" stopColor="#c7d2d5" /><stop offset="55%" stopColor="#edf1f2" /><stop offset="100%" stopColor="#86989e" />
      </linearGradient>
    </defs>

    {/* Folded mounting plate and removable, light-colored controller cover. */}
    <rect x="-173" y="-168" width="346" height="374" rx="10" fill={`url(#${metalId})`} stroke="#6e8189" strokeWidth="1.5" filter="drop-shadow(0 6px 10px rgba(0,0,0,0.5))" />
    <rect x="-168" y="-163" width="336" height="363" rx="7" fill={`url(#${faceId})`} stroke="#d5ded9" />
    <path d="M -159 -158 H 159 M -158 198 H 158" stroke="#ffffff" strokeWidth="1.2" opacity="0.8" pointerEvents="none" />
    {[[-158, -151], [158, -151], [-158, 186], [158, 186]].map(([x, y]) => <g key={`${x}-${y}`} pointerEvents="none">
      <circle cx={x} cy={y} r="4.4" fill="#9caeb2" stroke="#657980" strokeWidth="0.7" />
      <line x1={x - 2.4} y1={y} x2={x + 2.4} y2={y} stroke="#43565d" strokeWidth="1.2" />
    </g>)}

    <g pointerEvents="none" fontFamily="sans-serif">
      <text x="0" y="-134" fill="#142e3d" fontSize="24" fontWeight="900" letterSpacing="0.5" textAnchor="middle">DELMI AC-2</text>
      <text x="0" y="-119" fill="#556974" fontSize="8.7" fontWeight="700" letterSpacing="0.6" textAnchor="middle">TWO-DOOR TRAINING CONTROLLER</text>
      <rect x="-103" y="-108" width="206" height="31" rx="5" fill={powered ? '#e2eee5' : '#e6e9e7'} stroke={powered ? '#96b9a0' : '#bdc9c6'} />
      <circle cx="-85" cy="-92" r="4.2" fill={powered ? '#168a51' : '#80908f'} style={{ filter: powered ? 'drop-shadow(0 0 3px #55b57f)' : undefined }} />
      <text x="-73" y="-88" fill={powered ? '#185336' : '#596e74'} fontSize="11" fontWeight="900">{powered ? '12V DC · POWER ON' : 'NO BOARD POWER'}</text>

      {/* Consistent color banks separate reader power/data, dry sensing loops and lock relays. */}
      {([1, 2] as const).map(door => {
        const x = door === 1 ? -190 : 112;
        const center = door === 1 ? -151 : 151;
        return <g key={door}>
          <rect x={x} y="-112" width="78" height="150" rx="4" fill="#e0ede3" stroke="#9dbda8" />
          <text x={center} y="-119" fill="#285a42" fontSize="9.5" fontWeight="900" textAnchor="middle">READER {door}</text>
          <rect x={x} y="72" width="78" height="77" rx="4" fill="#e2edf5" stroke="#9ab7ca" />
          <text x={center} y="62" fill="#325f7b" fontSize="9.5" fontWeight="900" textAnchor="middle">INPUTS {door} · DRY</text>
          <rect x={door === 1 ? -107 : 13} y="163" width="94" height="38" rx="4" fill="#f0e3c8" stroke="#c9ae73" />
          <text x={door === 1 ? -60 : 60} y="154" fill="#6d5223" fontSize="9.2" fontWeight="900" textAnchor="middle">LOCK {door} · DRY</text>
        </g>;
      })}
      <rect x="-48" y="-191" width="96" height="40" rx="4" fill="#e1e6e9" stroke="#93a5ad" />

      {([1, 2] as const).map(door => {
        const active = Boolean(component.state[`relay${door}Active`]);
        const status = String(component.state[`door${door}Status`] ?? (powered ? 'unmonitored' : 'unpowered'));
        const alarm = alarmStatus(status);
        const remaining = Number(component.state[`unlockRemaining${door}`]);
        const hasCountdown = active && Number.isFinite(remaining) && remaining >= 0;
        const y = door === 1 ? -58 : 35;
        return <g key={door}>
          <rect x="-103" y={y} width="206" height="84" rx="6" fill="#172b36" stroke={alarm ? '#dc8274' : '#93a8ab'} strokeWidth={alarm ? '1.8' : '1'} />
          <path d={`M -96 ${y + 27} H 96`} stroke="#334c59" strokeWidth="0.7" />
          <text x="-87" y={y + 18} fill="#c1d6df" fontSize="11" fontWeight="900" letterSpacing="0.7">DOOR {door}</text>
          <circle cx="86" cy={y + 14} r="3.5" fill={alarm ? '#fb8c80' : active ? '#fbbf24' : '#647d88'} />
          <text x="-87" y={y + 44} fill={active ? '#fcd34d' : '#c7d5db'} fontSize="10.5" fontWeight="900">{active ? 'UNLOCK COMMAND' : 'RELAY AT REST'}</text>
          {hasCountdown && <text x="87" y={y + 46} fill="#fcd34d" fontSize="18" fontWeight="900" fontFamily="monospace" textAnchor="end">{remaining}s</text>}
          <text x="-87" y={y + 57} fill="#94b3c1" fontSize="9" fontWeight="700">{active ? 'COM–NO closed' : 'COM–NC closed'}</text>
          <text x="-87" y={y + 75} fill={alarm ? '#fda99b' : '#a9d6c7'} fontSize="10" fontWeight="800">{accessDoorStatusLabel(status).toUpperCase()}</text>
        </g>;
      })}
      <text x="0" y="139" fill="#4a6471" fontSize="8.2" fontWeight="700" textAnchor="middle">SELECT BOARD TO PROGRAM</text>
    </g>

    {ACCESS_CONTROLLER_PINS.map(pin => {
      const sideTerminal = Math.abs(pin.x) === 180;
      const left = pin.x < 0;
      const readerPin = pin.id.startsWith('reader');
      const powerPin = pin.id === 'pos' || pin.id === 'neg';
      const color = powerPin ? '#536b79' : readerPin ? '#347658' : sideTerminal ? '#427da3' : '#b58b3f';
      const textX = sideTerminal ? (left ? -160 : 160) : pin.x;
      const textY = sideTerminal ? pin.y + 3.8 : powerPin ? -156 : 198;
      return <g key={pin.id}>
        <Screw x={pin.x} y={pin.y} color={color} />
        <text x={textX} y={textY} fill={readerPin ? '#214d37' : powerPin ? '#263e4b' : sideTerminal ? '#284e68' : '#60491f'} fontSize={sideTerminal ? '10.5' : '9'} fontWeight="900" fontFamily="monospace" textAnchor={sideTerminal ? (left ? 'start' : 'end') : 'middle'} pointerEvents="none">{pin.label}</text>
      </g>;
    })}
    <g pointerEvents="none">
      <rect x="-112" y="211" width="224" height="18" rx="4" fill="#102330" stroke="#78909c" />
      <text x="0" y="224" fill="#dce9ef" fontSize={component.label.length > 28 ? '8' : '9'} fontWeight="800" textAnchor="middle">{component.label}</text>
    </g>
  </g>;
};

export const AccessReader: React.FC<{ component: CircuitComponent }> = ({ component }) => {
  const scan = useGameStore(state => state.scanAccessReader);
  const setComponentState = useGameStore(state => state.setComponentState);
  const powered = Boolean(component.state.powered);
  const authorized = component.state.authorized !== false;
  const feedback = String(component.state.feedback ?? 'idle');
  const green = powered && Boolean(component.state.ledActive);
  const buzzer = powered && Boolean(component.state.buzzerActive);
  const faceId = `access-reader-face-${component.id}`;
  const edgeId = `access-reader-edge-${component.id}`;
  const feedbackLabel = !powered ? 'NO READER POWER'
    : feedback === 'granted' ? 'LAST: GRANTED'
      : feedback === 'denied' ? 'LAST: DENIED'
        : feedback === 'wiring-fault' ? 'WIRING FAULT'
          : 'TAP TO TEST';
  const operate = () => { if (powered) scan(component.id); };
  const selectCredential = (allow: boolean) => setComponentState(component.id, 'authorized', allow);

  return <g className="select-none">
    <defs>
      <style>{`.access-reader-control:focus-visible { outline: none; } .access-reader-control:focus-visible .access-reader-control-outline { stroke: #bae6fd; stroke-width: 2.4px; }`}</style>
      <linearGradient id={faceId} x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#303b48" /><stop offset="42%" stopColor="#1b2632" /><stop offset="100%" stopColor="#0c1722" />
      </linearGradient>
      <linearGradient id={edgeId} x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#778b98" /><stop offset="12%" stopColor="#293c4b" /><stop offset="90%" stopColor="#233442" /><stop offset="100%" stopColor="#071119" />
      </linearGradient>
    </defs>

    {/* Slim wall enclosure with a protected scan face; the surround remains draggable. */}
    <rect x="-65" y="-130" width="130" height="204" rx="13" fill={`url(#${edgeId})`} stroke="#748996" strokeWidth="1.2" filter="drop-shadow(3px 5px 8px rgba(0,0,0,0.6))" />
    <rect x="-60" y="-127" width="120" height="197" rx="10" fill={`url(#${faceId})`} stroke="#304858" strokeWidth="0.7" />
    <path d="M -51 -117 Q -51 -121 -47 -121 H 46" fill="none" stroke="#8295a5" strokeWidth="0.6" opacity="0.5" pointerEvents="none" />
    <g pointerEvents="none">
      <text x="0" y="-108" fill="#ddebf1" fontSize="13" fontWeight="900" letterSpacing="2.2" textAnchor="middle">DELMI</text>
      <rect x="-43" y="-98" width="86" height="6" rx="3" fill="#071018" />
      <rect x="-41" y="-97" width="82" height="4" rx="2" fill={!powered ? '#465764' : green ? '#38df91' : '#e55b65'} style={{ filter: green ? 'drop-shadow(0 0 3px #38df91)' : undefined }} />
      <text x="0" y="-81" fill={powered ? '#96b8cc' : '#6f8595'} fontSize="7.8" fontWeight="800" letterSpacing="0.8" textAnchor="middle">{powered ? 'POWER ON' : 'POWER OFF'}</text>
    </g>

    <g className={`device-control access-reader-control ${powered ? 'cursor-pointer' : 'cursor-not-allowed'}`} role="button" tabIndex={0}
      aria-label={`Scan credential at ${component.label}`} aria-disabled={!powered}
      onPointerDown={event => event.stopPropagation()}
      onClick={event => { event.stopPropagation(); operate(); }}
      onKeyDown={event => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); event.stopPropagation(); operate(); } }}>
      <rect className="access-reader-control-outline" x="-49" y="-73" width="98" height="79" rx="8" fill="#0d1a26" stroke={powered ? '#536e81' : '#344758'} strokeWidth="1.1" />
      <circle cx="0" cy="-40" r="24" fill="#172b3b" stroke={powered ? '#638fa9' : '#405d70'} />
      <rect x="-15" y="-50" width="24" height="18" rx="2.2" fill="none" stroke={powered ? '#d0e5f0' : '#697f8f'} strokeWidth="1.8" transform="rotate(-10 0 -40)" />
      <line x1="-12" y1="-43" x2="0" y2="-45" stroke={powered ? '#d0e5f0' : '#697f8f'} strokeWidth="1.4" />
      <path d="M 13 -49 Q 21 -41 13 -33 M 18 -54 Q 31 -41 18 -28" fill="none" stroke={powered ? '#a8d6ef' : '#526e83'} strokeWidth="1.5" strokeLinecap="round" />
      <text x="0" y="-6" fill={powered ? '#d7eaf3' : '#718796'} fontSize="11" fontWeight="900" letterSpacing="0.5" textAnchor="middle">SCAN CARD</text>
    </g>

    <text x="0" y="18" fill="#8ea5b5" fontSize="7.2" fontWeight="800" letterSpacing="0.6" textAnchor="middle" pointerEvents="none">TEST CREDENTIAL</text>
    {([true, false] as const).map(allow => {
      const selected = authorized === allow;
      return <g key={String(allow)} className="device-control access-reader-control cursor-pointer" role="button" tabIndex={0}
        aria-label={`Use ${allow ? 'authorized' : 'denied'} credential on ${component.label}`} aria-pressed={selected}
        onPointerDown={event => event.stopPropagation()}
        onClick={event => { event.stopPropagation(); selectCredential(allow); }}
        onKeyDown={event => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); event.stopPropagation(); selectCredential(allow); } }}>
        <rect className="access-reader-control-outline" x={allow ? -51 : 1} y="23" width="50" height="22" rx="4" fill={selected ? (allow ? '#226749' : '#863744') : '#091521'} stroke={selected ? (allow ? '#4b9272' : '#b56877') : '#385264'} />
        <text x={allow ? -26 : 26} y="37" fill={selected ? '#f0faf7' : '#6e8494'} fontSize="8.8" fontWeight="900" textAnchor="middle">{allow ? 'ALLOW' : 'DENY'}</text>
      </g>;
    })}
    <g pointerEvents="none">
      <text x="0" y="59" fill={!powered ? '#7f929e' : feedback === 'denied' || feedback === 'wiring-fault' ? '#f2a0a9' : '#adc8d8'} fontSize="8.9" fontWeight="900" textAnchor="middle">{feedbackLabel}</text>
      {[-12, -6, 0, 6, 12].map(x => <circle key={x} cx={x} cy="66" r="0.9" fill={buzzer ? '#fbbf24' : '#4a6071'} />)}
      {buzzer && <text x="39" y="68" fill="#fbbf24" fontSize="6.3" fontWeight="900" textAnchor="middle">BEEP</text>}
      <rect x="-76" y="74" width="152" height="24" rx="3" fill="#263e4c" stroke="#486371" />
    </g>
    {ACCESS_READER_PINS.map(pin => <g key={pin.id}>
      <Screw x={pin.x} y={pin.y} color="#36765b" />
      <text x={pin.x} y="108" fill="#dce9ef" fontSize="8.6" fontFamily="monospace" fontWeight="900" textAnchor="middle" pointerEvents="none">{pin.label}</text>
    </g>)}
    <text x="0" y="124" fill="#bacbd5" fontSize="8.5" fontWeight="800" textAnchor="middle" pointerEvents="none">{component.label}</text>
  </g>;
};
