import React from 'react';
import type { CircuitComponent } from '../../../types/game';
import { useGameStore } from '../../../store/useGameStore';
import { KR2402_PINS } from './kr2402Pinout';

interface KR2402RelayProps {
  component: CircuitComponent;
  isEnergized: boolean;
}

type WirelessMode = 'momentary' | 'toggle' | 'latching';

export const KR2402Relay: React.FC<KR2402RelayProps> = ({ component, isEnergized }) => {
  const setComponentState = useGameStore(state => state.setComponentState);
  const channel1 = Boolean(component.state.channel1Active);
  const channel2 = Boolean(component.state.channel2Active);
  const mode = (component.state.wirelessMode as WirelessMode | undefined) ?? 'toggle';

  const cycleMode = (event: React.PointerEvent<SVGGElement>) => {
    event.stopPropagation();
    if (!isEnergized) return;
    const next: WirelessMode = mode === 'momentary' ? 'toggle' : mode === 'toggle' ? 'latching' : 'momentary';
    setComponentState(component.id, 'wirelessMode', next);
  };

  const relayCan = (x: number, active: boolean, channel: number) => (
    <g transform={`translate(${x}, 5)`}>
      <rect x="-24" y="-17" width="48" height="34" rx="2" fill="#111827" stroke="#020617" strokeWidth="1" />
      <rect x="-21" y="-14" width="42" height="28" rx="1.5" fill="#1f2937" />
      <text x="0" y="-3" fill="#e5e7eb" fontSize="6.3" fontWeight="900" textAnchor="middle" fontFamily="sans-serif">SONGLE</text>
      <text x="0" y="5" fill="#9ca3af" fontSize="4.5" fontWeight="700" textAnchor="middle" fontFamily="monospace">SRD-24VDC-SL-C</text>
      <text x="0" y="12" fill={active ? '#4ade80' : '#64748b'} fontSize="5" fontWeight="900" textAnchor="middle" fontFamily="monospace">CH{channel}</text>
    </g>
  );

  return (
    <g className="select-none">
      <rect x="-68" y="-58" width="136" height="116" rx="3" fill="#166534" stroke="#052e16" strokeWidth="2" filter="drop-shadow(0 4px 8px rgba(0,0,0,0.4))" />
      <rect x="-64" y="-54" width="128" height="108" rx="2" fill="#15803d" stroke="#4ade80" strokeOpacity="0.35" strokeWidth="0.7" />
      {[[-60, -50], [60, -50], [-60, 50], [60, 50]].map(([x, y]) => (
        <g key={`${x}-${y}`}><circle cx={x} cy={y} r="4" fill="#d1d5db" /><circle cx={x} cy={y} r="2.2" fill="#172554" /></g>
      ))}

      <rect x="-60" y="-56" width="120" height="20" rx="1.5" fill="#111827" stroke="#020617" />
      {KR2402_PINS.filter(pin => pin.y < 0).map(pin => (
        <g key={pin.id}>
          <rect x={pin.x - 9} y="-55" width="18" height="18" fill="#1f2937" stroke="#4b5563" strokeWidth="0.5" />
          <circle cx={pin.x} cy="-46" r="5" fill="#cbd5e1" stroke="#64748b" strokeWidth="0.7" />
          <path d={`M ${pin.x - 3.2} -47.8 L ${pin.x + 3.2} -44.2`} stroke="#475569" strokeWidth="1.4" />
          <text x={pin.x} y="-28" fill="#f0fdf4" stroke="#14532d" strokeWidth="1.3" paintOrder="stroke" fontSize={pin.id.startsWith('com') ? 5.4 : 6.4} fontWeight="900" textAnchor="middle" fontFamily="monospace">{pin.label}</text>
        </g>
      ))}

      {relayCan(-30, channel1, 1)}
      {relayCan(30, channel2, 2)}

      <path d="M -57 24 L -45 24 L -45 31 L 45 31 L 45 24 L 57 24" fill="none" stroke="#86efac" strokeWidth="1" opacity="0.7" />
      <path d="M 50 -24 C 58 -20 58 -12 50 -8 C 42 -4 42 4 50 8" fill="none" stroke="#fbbf24" strokeWidth="1.4" />
      <text x="50" y="17" fill="#fef3c7" fontSize="4.4" fontWeight="800" textAnchor="middle">ANT</text>

      <circle cx="-12" cy="35" r="4.5" fill="#111827" stroke="#cbd5e1" strokeWidth="0.7" />
      <circle cx="-12" cy="35" r="2.8" fill={isEnergized ? '#22c55e' : '#374151'} style={{ filter: isEnergized ? 'drop-shadow(0 0 4px #22c55e)' : 'none' }} />
      <circle cx="12" cy="35" r="4.5" fill="#111827" stroke="#cbd5e1" strokeWidth="0.7" />
      <circle cx="12" cy="35" r="2.8" fill={channel1 || channel2 ? '#ef4444' : '#374151'} />

      <g className={isEnergized ? 'device-control cursor-pointer' : 'cursor-not-allowed'} onPointerDown={cycleMode}>
        <circle cx="0" cy="24" r="7" fill="#d1d5db" stroke="#374151" strokeWidth="1" />
        <circle cx="0" cy="24" r="4.2" fill="#ef4444" stroke="#7f1d1d" />
      </g>
      <text x="0" y="16" fill="#dcfce7" fontSize="4.6" fontWeight="900" textAnchor="middle">LEARN</text>
      <text x="0" y="43" fill="#dcfce7" fontSize="5.3" fontWeight="900" textAnchor="middle" fontFamily="monospace">{mode.toUpperCase()}</text>

      <rect x="-25" y="42" width="50" height="15" rx="1.5" fill="#111827" stroke="#020617" />
      {KR2402_PINS.filter(pin => pin.y > 0).map(pin => (
        <g key={pin.id}>
          <circle cx={pin.x} cy="50" r="5" fill="#cbd5e1" stroke="#64748b" strokeWidth="0.7" />
          <path d={`M ${pin.x - 3.2} 48.2 L ${pin.x + 3.2} 51.8`} stroke="#475569" strokeWidth="1.4" />
          <text x={pin.x} y="40" fill="#ffffff" stroke="#14532d" strokeWidth="1.3" paintOrder="stroke" fontSize="6.6" fontWeight="900" textAnchor="middle" fontFamily="monospace">{pin.label}</text>
        </g>
      ))}

      <text x="-52" y="43" fill="#dcfce7" fontSize="7" fontWeight="900" fontFamily="sans-serif">KR2402A</text>
      <text x="48" y="43" fill="#bbf7d0" fontSize="4.8" fontWeight="800" textAnchor="end">433.92 MHz</text>

      <g transform="translate(0, 76)" pointerEvents="none">
        <rect x="-57" y="-9" width="114" height="18" rx="5" fill="#070b13" stroke="#334155" />
        <text x="0" y="3" fill="#f1f5f9" fontSize="8" fontWeight="800" textAnchor="middle" fontFamily="monospace">{component.label}</text>
      </g>
    </g>
  );
};

export default KR2402Relay;
