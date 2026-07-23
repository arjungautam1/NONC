import React from 'react';
import type { CircuitComponent } from '../../../types/game';
import { useGameStore } from '../../../store/useGameStore';

interface SlidingGateProps {
  component: CircuitComponent;
}

export const SlidingGate: React.FC<SlidingGateProps> = ({ component }) => {
  const nodeVoltages = useGameStore(state => state.simulation.nodeVoltages);
  const isRunning = useGameStore(state => state.isRunning);
  const travel = Math.max(0, Math.min(100, component.state.travel || 0));
  const vPos = isRunning ? (nodeVoltages[`${component.id}:pos`] || 0) : 0;
  const vNeg = isRunning ? (nodeVoltages[`${component.id}:neg`] || 0) : 0;
  const direction = vPos > vNeg ? 'opening' : vNeg > vPos ? 'closing' : 'stopped';
  const gateOffset = -(travel / 100) * 70;
  const stateLabel = travel >= 96 ? 'OPEN' : travel <= 4 ? 'CLOSED' : direction.toUpperCase();
  const stateColor = travel >= 96 ? '#34d399' : travel <= 4 ? '#fb7185' : '#fbbf24';
  const steelGradientId = `sliding-gate-steel-${component.id}`;
  const panelGradientId = `sliding-gate-panel-${component.id}`;

  return (
    <g>
      <defs>
        <linearGradient id={steelGradientId} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#64748b" />
          <stop offset="45%" stopColor="#cbd5e1" />
          <stop offset="100%" stopColor="#334155" />
        </linearGradient>
        <linearGradient id={panelGradientId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#172554" />
          <stop offset="55%" stopColor="#1d4ed8" />
          <stop offset="100%" stopColor="#0f172a" />
        </linearGradient>
      </defs>

      {/* Ground rail and end posts */}
      <rect x="-103" y="39" width="206" height="7" rx="3.5" fill="#0f172a" stroke="#475569" strokeWidth="1.5" />
      <line x1="-96" y1="42.5" x2="96" y2="42.5" stroke="#94a3b8" strokeWidth="1" strokeDasharray="3 3" />
      <rect x="-101" y="-47" width="13" height="90" rx="3" fill={`url(#${steelGradientId})`} stroke="#334155" strokeWidth="1.5" />
      <rect x="88" y="-47" width="13" height="90" rx="3" fill={`url(#${steelGradientId})`} stroke="#334155" strokeWidth="1.5" />

      {/* Sliding gate panel: closed on the right, parked into the left pocket when open */}
      <g transform={`translate(${gateOffset}, 0)`} style={{ transition: 'transform 80ms linear' }}>
        <rect x="-13" y="-36" width="101" height="72" rx="2" fill={`url(#${panelGradientId})`} stroke="#60a5fa" strokeWidth="2" />
        {[-1, 17, 35, 53, 71].map(x => (
          <line key={x} x1={x} y1="-31" x2={x} y2="31" stroke="#93c5fd" strokeWidth="1.2" opacity="0.55" />
        ))}
        <line x1="-9" y1="-20" x2="84" y2="-20" stroke="#bfdbfe" strokeWidth="1" opacity="0.6" />
        <line x1="-9" y1="20" x2="84" y2="20" stroke="#bfdbfe" strokeWidth="1" opacity="0.6" />
        <circle cx="2" cy="38" r="4" fill="#020617" stroke="#94a3b8" />
        <circle cx="73" cy="38" r="4" fill="#020617" stroke="#94a3b8" />
      </g>

      {/* Operator cabinet with local status */}
      <rect x="-110" y="-29" width="31" height="61" rx="5" fill="#0b1220" stroke="#2563eb" strokeWidth="2" />
      <rect x="-105" y="-22" width="21" height="14" rx="2" fill="#020617" stroke="#334155" />
      <circle cx="-98" cy="-15" r="2" fill={stateColor} className={direction !== 'stopped' ? 'animate-pulse' : ''} />
      <text x="-89" y="-13" textAnchor="middle" fill="#93c5fd" fontSize="4.2" fontWeight="800">24V</text>
      <text x="-94.5" y="25" textAnchor="middle" fill="#60a5fa" fontSize="5" fontWeight="800">DELMI</text>

      <rect x="-31" y="-57" width="62" height="15" rx="7.5" fill="#08111f" stroke="#334155" />
      <circle cx="-21" cy="-49.5" r="3" fill={stateColor} />
      <text x="6" y="-47" textAnchor="middle" fill="#cbd5e1" fontSize="6" fontWeight="800">{stateLabel}</text>
      <text x="0" y="57" textAnchor="middle" fill="#64748b" fontSize="5.5" fontWeight="700">SLIDING GATE OPERATOR · {travel.toFixed(0)}%</text>

      {direction !== 'stopped' && (
        <g fill={direction === 'opening' ? '#34d399' : '#fbbf24'} className="animate-pulse">
          {direction === 'opening' ? (
            <path d="M-48 -53 L-40 -58 L-40 -55 L-30 -55 L-30 -51 L-40 -51 L-40 -48 Z" />
          ) : (
            <path d="M48 -53 L40 -58 L40 -55 L30 -55 L30 -51 L40 -51 L40 -48 Z" />
          )}
        </g>
      )}
    </g>
  );
};
