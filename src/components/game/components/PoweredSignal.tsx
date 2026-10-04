import React from 'react';
import type { CircuitComponent } from '../../../types/game';
import { useGameStore } from '../../../store/useGameStore';

/** Generic panel-output teaching device; OUT is switched supply voltage, not a dry relay. */
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
    <rect x="-50" y="-45" width="100" height="90" rx="9" fill="#102d3a" stroke="#638fa0" strokeWidth="2" />
    <text x="0" y="-24" textAnchor="middle" fontSize="10" fontWeight="800" fill="#a5e5ff">WET OUTPUT</text>
    <g className="device-control cursor-pointer" role="button" tabIndex={0}
      aria-label={maintained ? `Switch ${component.label} ${component.state.toggled ? 'off' : 'on'}` : `Send ${component.label}`}
      aria-disabled={!component.state.powered}
      onPointerDown={event => event.stopPropagation()}
      onClick={event => { event.stopPropagation(); operate(); }}
      onKeyDown={event => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); event.stopPropagation(); operate(); } }}>
      <rect x="-34" y="-12" width="68" height="32" rx="6" fill={active ? '#059669' : '#253949'} stroke={active ? '#6ee7b7' : '#94a3b8'}/>
      <text x="0" y="9" textAnchor="middle" fontSize="13" fontWeight="800" fill="white">{maintained ? (component.state.toggled ? 'ON' : 'OFF') : 'SEND'}</text>
    </g>
    <text x="0" y="34" textAnchor="middle" fontSize="8" fill={component.state.powered ? '#6ee7b7' : '#cbd5e1'}>{component.state.powered ? 'POWER READY' : 'CONNECT +V / 0V'}</text>
    {component.terminals.map(t => <g key={t.id} transform={`translate(${t.x},${t.y})`}>
      <circle r="7" fill="#18232d" stroke="#94a3b8"/><circle r="3" fill={(t.id === 'out' && active) || (t.id === 'pos' && component.state.powered) ? '#ef4444' : '#64748b'}/>
    </g>)}
  </g>;
};
