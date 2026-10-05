import React from 'react';
import type { CircuitComponent } from '../../../types/game';
import { useGameStore } from '../../../store/useGameStore';

/** Generic intercom/control-panel model with a switched voltage output. */
export const PoweredSignal: React.FC<{ component: CircuitComponent }> = ({ component }) => {
  const maintained = component.state.signalMode === 'maintained';
  const active = Boolean(component.state.powered && (maintained ? component.state.toggled : component.state.pressed));
  const operate = () => {
    const store = useGameStore.getState();
    if (!component.state.powered) return;
    if (maintained) store.toggleSwitch(component.id);
    else {
      store.pressButton(component.id, true);
      window.setTimeout(() => useGameStore.getState().pressButton(component.id, false), 500);
    }
  };
  return <g className="select-none">
    <rect x="-50" y="-45" width="100" height="90" rx="4" fill="#d4d8dc" stroke="#64748b" strokeWidth="2" />
    <text x="0" y="-32" textAnchor="middle" fontSize="8" fontWeight="800" fill="#1e293b">{maintained ? 'CONTROL PANEL' : 'INTERCOM'}</text>
    {/* Speaker grille on the indoor intercom; panel status LEDs on maintained outputs. */}
    {maintained ? <g pointerEvents="none">
      <circle cx="-20" cy="-22" r="3" fill={component.state.powered ? '#16a34a' : '#475569'} />
      <text x="-13" y="-19" fontSize="6" fill="#334155">DC POWER</text>
    </g> : <g pointerEvents="none" stroke="#64748b" strokeWidth="2" strokeLinecap="round">
      {[-27, -23, -19].map(y => <line key={y} x1="-23" x2="23" y1={y} y2={y} />)}
    </g>}
    <g className="device-control cursor-pointer" role="button" tabIndex={0}
      aria-label={maintained ? `Switch ${component.label} ${component.state.toggled ? 'off' : 'on'}` : `Unlock using ${component.label}`}
      aria-disabled={!component.state.powered}
      onPointerDown={event => event.stopPropagation()}
      onClick={event => { event.stopPropagation(); operate(); }}
      onKeyDown={event => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); event.stopPropagation(); operate(); } }}>
      <rect x="-34" y="-12" width="68" height="32" rx="6" fill={active ? '#059669' : '#253949'} stroke={active ? '#6ee7b7' : '#94a3b8'}/>
      <text x="0" y="9" textAnchor="middle" fontSize="10" fontWeight="800" fill="white">{maintained ? (component.state.toggled ? 'CLEAR' : 'ENABLE') : 'UNLOCK'}</text>
    </g>
    <text x="0" y="34" textAnchor="middle" fontSize="8" fill={active ? '#166534' : '#334155'}>{!component.state.powered ? 'NO DC POWER' : active ? 'OUTPUT ACTIVE' : 'STANDBY'}</text>
    {component.terminals.map(t => <g key={t.id} transform={`translate(${t.x},${t.y})`}>
      <circle r="7" fill="#18232d" stroke="#94a3b8"/><circle r="3" fill={(t.id === 'out' && active) || (t.id === 'pos' && component.state.powered) ? '#ef4444' : '#64748b'}/>
    </g>)}
  </g>;
};
