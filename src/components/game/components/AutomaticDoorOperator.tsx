import React from 'react';
import type { CircuitComponent } from '../../../types/game';
import { useGameStore } from '../../../store/useGameStore';

export const AutomaticDoorOperator: React.FC<{ component: CircuitComponent }> = ({ component }) => {
  const lockDevice = useGameStore(state => state.components.find(item => item.id === component.state.lockComponentId));
  const hasStrike = lockDevice?.type === 'door_strike';
  const travel = Math.max(0, Math.min(100, Number(component.state.travel) || 0));
  const angle = travel / 100 * Math.PI * .46;
  const width = 44 * Math.cos(angle);
  const depth = 9 * Math.sin(angle);
  const edge = 66 + width;
  const locked = Boolean(component.state.locked);
  const holding = component.state.active || component.state.manualOpen || Number(component.state.holdUntil) > Date.now();
  const status = travel >= 100 ? 'OPEN' : travel > 0 ? (holding ? 'OPENING' : 'CLOSING') : 'CLOSED';
  const id = `operator-metal-${component.id}`;
  const manualExit = () => useGameStore.getState().setComponentState(component.id, 'manualOpen', !component.state.manualOpen);
  return <g className="select-none">
    <defs>
      <linearGradient id={id} x1="0" y1="0" x2="0" y2="1"><stop stopColor="#f1f3f4"/><stop offset=".13" stopColor="#cdd2d5"/><stop offset=".55" stopColor="#9aa3a9"/><stop offset=".9" stopColor="#c0c7cb"/><stop offset="1" stopColor="#667179"/></linearGradient>
      <linearGradient id={`${id}-door`}><stop stopColor="#dfd8c8"/><stop offset="1" stopColor="#b4aa96"/></linearGradient>
    </defs>
    <title>Swing operator mounted above the preview door with its arm connected to the leaf. A connected electric strike sits in the latch-side jamb. Preview lever allows manual exit.</title>
    {/* The header motor, drive arm and slide track are the device itself. */}
    <rect x="-104" y="-28" width="145" height="44" rx="5" fill="#030712" opacity=".4" transform="translate(2,4)"/>
    <rect x="-104" y="-28" width="145" height="44" rx="4" fill={`url(#${id})`} stroke="#d4dade" strokeWidth="1.1"/>
    <path d="M-100 -23 H25 M-100 11 H25" stroke="#eef2f4" strokeWidth=".8" opacity=".65"/>
    <rect x="26" y="-28" width="15" height="44" rx="3" fill="#30393e"/>
    {[0,1,2,3,4].map(n=><line key={n} x1="31" x2="37" y1={-18+n*5} y2={-18+n*5} stroke="#151b20" strokeWidth="1.3"/>)}
    <text x="-94" y="-5" fontSize="8" fontWeight="900" fill="#28333b">ASSA ABLOY</text>
    <text x="-94" y="5" fontSize="4.5" letterSpacing=".7" fill="#46545f">SWING DOOR OPERATOR</text>
    {[-97,20].map(x=><g key={x}><circle cx={x} cy="-18" r="2" fill="#7a858d"/><path d={`M${x-1} -19 l2 2`} stroke="#d3dade" strokeWidth=".7"/></g>)}
    <rect x="-97" y="53" width="128" height="8" rx="2" fill={`url(#${id})`} stroke="#73818b"/>
    <path d="M-91 57 H25" stroke="#36434d" strokeWidth="2"/>
    <circle cx="-23" cy="17" r="6" fill="#6d7b86" stroke="#d5dde2"/>
    <path d={`M-23 17 L${-4-18*Math.sin(angle)} ${36+5*Math.sin(angle)} L${20-42*Math.sin(angle)} 57`} stroke="#17212a" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
    <path d={`M-23 17 L${-4-18*Math.sin(angle)} ${36+5*Math.sin(angle)} L${20-42*Math.sin(angle)} 57`} stroke="#c4cdd3" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
    <circle cx={-4-18*Math.sin(angle)} cy={36+5*Math.sin(angle)} r="2.4" fill="#7c8a94" stroke="#e1e7eb" strokeWidth=".7"/>
    <text x="-32" y="-40" textAnchor="middle" fontSize="8" fontWeight="700" fill={component.state.active?'#86efac':'#b7c4d0'}>{component.state.active ? 'OPERATOR ACTIVE' : 'DOOR OPERATOR'}</text>
    <path d="M48 -32 V71" stroke="#475569" strokeWidth=".7" strokeDasharray="2 4" opacity=".65"/>
    {/* A secondary preview illustrates the result without turning the device into a door. */}
    <g className="device-control cursor-pointer" role="button" tabIndex={0}
      aria-label={component.state.manualOpen ? 'Release inside lever and let door close' : 'Turn inside lever and open door manually'}
      aria-pressed={Boolean(component.state.manualOpen)}
      onPointerDown={event => event.stopPropagation()}
      onClick={event => { event.stopPropagation(); manualExit(); }}
      onKeyDown={event => { if ((event.key === 'Enter' || event.key === ' ') && !event.repeat) { event.preventDefault(); event.stopPropagation(); manualExit(); } }}>
      <title>Small door preview · click to hold the inside lever, click again to release</title>
      <rect x="57" y="-33" width="64" height="106" rx="6" fill="#111c27" stroke="#334155" strokeWidth=".8"/>
      <text x="89" y="-23" textAnchor="middle" fontSize="5.5" letterSpacing=".4" fill="#94a3b8">DOOR PREVIEW</text>
      <rect x="63" y="-17" width="51" height="70" fill="#081019" stroke="#72808a" strokeWidth="2"/>
      <path d={`M66 -14 L${edge} ${-14+depth} V${50+depth} L66 50 Z`} fill={`url(#${id}-door)`} stroke="#ded6c5" strokeWidth=".8"/>
      <path d={`M${edge} ${-14+depth} l2 -1 v64 l-2 1 Z`} fill="#756d60"/>
      <g transform={`matrix(${width/44} ${depth/44} 0 1 66 -14)`}>
        <rect x="5" y="8" width="34" height="25" fill="#28424b" stroke="#879491"/>
        <path d="M8 11 H36 L8 28 Z" fill="#a8c8d0" opacity=".18"/>
        <rect x="5" y="43" width="34" height="16" fill="none" stroke="#958b76" strokeWidth=".6"/>
      </g>
      {/* The left jamb carries the hinges; the right jamb receives the latch. */}
      {[0, 38].map(y => <rect key={y} x="64" y={y} width="2.5" height="7" rx=".5" fill="#a8b2b9" />)}
      {hasStrike && <g pointerEvents="none">
        <title>Electric strike in the latch-side frame at handle height</title>
        <rect x="110.5" y="19" width="4" height="16" rx=".6" fill={`url(#${id})`} stroke="#64748b" strokeWidth=".5" />
        <circle cx="112.5" cy="21" r=".6" fill="#475569" />
        <circle cx="112.5" cy="33" r=".6" fill="#475569" />
        <rect x="110.5" y="24" width="2.5" height="6" fill={locked ? '#fb7185' : '#6ee7b7'} />
      </g>}
      {/* Header-mounted motor and slide arm, drawn over the moving leaf. */}
      <g pointerEvents="none">
        <title>Automatic operator on the header; arm and slide track attached to the door</title>
        <rect x="63" y="-21" width="51" height="7" rx="1" fill={`url(#${id})`} stroke="#64748b" strokeWidth=".6" />
        <rect x="109" y="-21" width="5" height="7" rx=".7" fill="#30393e" />
        <circle cx="70" cy="-13" r="1.8" fill="#475569" />
        <path d={`M${66 + width * .15} ${-7 + depth * .15} L${66 + width * .85} ${-7 + depth * .85}`} stroke="#64748b" strokeWidth="2" strokeLinecap="round" />
        <path d={`M70 -13 L${72 + width * .22} ${-4 + depth * .2} L${66 + width * .65} ${-7 + depth * .65}`} fill="none" stroke="#dce3e7" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx={72 + width * .22} cy={-4 + depth * .2} r="1.2" fill="#64748b" />
      </g>
      <path d={`M${edge-4} ${28+depth} l-6 ${component.state.manualOpen ? 3 : 0}`} stroke="#e2e8f0" strokeWidth="2" strokeLinecap="round"/>
      <text x="89" y="64" textAnchor="middle" fontSize="6" fontWeight="800" fill={travel>=100?'#86efac':'#cbd5e1'}>{status}</text>
      <rect x="57" y="-33" width="64" height="106" rx="6" fill="transparent" pointerEvents="all"/>
    </g>
    <text x="89" y="-41" textAnchor="middle" fontSize="6.5" fontWeight="800" fill={locked?'#fca5a5':'#86efac'}>{component.state.lockComponentId ? (locked ? (travel === 0 ? 'LOCKED' : 'STRIKE SECURED') : 'UNLOCKED') : ''}</text>
    <text x="89" y="83" textAnchor="middle" fontSize="5.5" fill="#9eacb8">{component.state.manualOpen ? 'CLICK TO RELEASE' : 'CLICK · MANUAL EXIT'}</text>
    {component.terminals.map(t=><g key={t.id} transform={`translate(${t.x},${t.y})`}><circle r="7" fill="#17212c" stroke="#a6b4c4"/><circle r="3" fill="#64748b"/></g>)}
  </g>;
};
