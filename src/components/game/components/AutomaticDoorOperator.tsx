import React from 'react';
import type { CircuitComponent } from '../../../types/game';
import { useGameStore } from '../../../store/useGameStore';

export const AutomaticDoorOperator: React.FC<{ component: CircuitComponent }> = ({ component }) => {
  const travel = Math.max(0, Math.min(100, Number(component.state.travel) || 0));
  const width = 130 * Math.cos(travel / 100 * Math.PI * 0.46);
  const id = `operator-metal-${component.id}`;
  const manualExit = () => useGameStore.getState().setComponentState(component.id, 'manualOpen', !component.state.manualOpen);
  return <g className="select-none">
    <defs><linearGradient id={id} x2="0" y2="1"><stop stopColor="#e4e5e5"/><stop offset=".5" stopColor="#aeb1b2"/><stop offset="1" stopColor="#666b6e"/></linearGradient></defs>
    <rect x="-77" y="-32" width="154" height="103" fill="#20272c" stroke="#71797e" strokeWidth="4"/>
    <rect x="-70" y="-25" width="140" height="92" fill="#0b131a"/>
    <g style={{ transition: 'all 120ms linear' }}>
      <path d={`M-65 -21 H${-65 + width} V65 H-65 Z`} fill={`url(#${id})`} stroke="#a5abad" strokeWidth="2"/>
      <path d={`M-57 -6 H${-65 + Math.max(5,width-8)} V49 H-57 Z`} fill="#29434c" opacity=".7"/>
      <g className="device-control cursor-pointer" role="button" tabIndex={0}
        aria-label={component.state.manualOpen ? 'Release manual door opening' : 'Open door manually'}
        onPointerDown={event => event.stopPropagation()}
        onClick={event => { event.stopPropagation(); manualExit(); }}
        onKeyDown={event => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); event.stopPropagation(); manualExit(); } }}>
        <title>Door handle · open / release manually</title>
        <circle cx={-65 + Math.max(7,width-10)} cy="27" r="10" fill="transparent"/>
        <path d={`M${-65 + Math.max(7,width-10)} 27 h-8`} stroke="#dde3e5" strokeWidth="3" strokeLinecap="round"/>
      </g>
    </g>
    <rect x="-89" y="-59" width="178" height="27" rx="3" fill={`url(#${id})`} stroke="#d0d3d4"/>
    <rect x="77" y="-59" width="12" height="27" rx="2" fill="#33383a"/>
    {[0,1,2,3].map(n=><line key={n} x1="81" x2="86" y1={-51+n*4} y2={-51+n*4} stroke="#111"/>)}
    <text x="-82" y="-39" fontSize="5" fontWeight="900" fill="#24282a">ASSA ABLOY</text>
    <rect x="-51" y="-18" width={Math.max(10,width*.68)} height="6" fill={`url(#${id})`} stroke="#555d61"/>
    <path d={`M48 -32 V-25 L${-45 + width*.6} -15`} stroke="#909799" strokeWidth="4" fill="none"/>
    {component.terminals.map(t=><g key={t.id} transform={`translate(${t.x},${t.y})`}><circle r="7" fill="#17212c" stroke="#a6b4c4"/><circle r="3" fill="#64748b"/></g>)}
    <text x="0" y="-67" textAnchor="middle" fontSize="9" fontWeight="800" fill={travel>99?'#4ade80':'#cbd5e1'}>{travel>99?'OPEN':travel>0?(component.state.active?'OPENING':'CLOSING'):'CLOSED'}</text>
  </g>;
};
