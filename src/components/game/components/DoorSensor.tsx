import React from 'react';
import type { CircuitComponent } from '../../../types/game';
import { useGameStore } from '../../../store/useGameStore';

/** White surface contact and matching magnet; terminal breakout is a teaching aid. */
export const DoorSensor: React.FC<{ component: CircuitComponent }> = ({ component }) => {
  const toggleSwitch = useGameStore(state => state.toggleSwitch);
  const linked = Boolean(component.state.doorOperatorId);
  const travel = useGameStore(state => state.components.find(item => item.id === component.state.doorOperatorId)?.state.travel);
  const doorOpen = Boolean(component.state.toggled);
  const separation = linked ? Math.max(0, Math.min(100, Number(travel) || 0)) / 100 * 43 : doorOpen ? 43 : 0;
  const id = `contact-${component.id}`;
  const operate = () => { if (!linked) toggleSwitch(component.id); };

  const housing = (x: number, width: number, sensor: boolean) => (
    <g transform={`translate(${x},0)`}>
      <rect x={-width/2+3} y="-43" width={width} height="94" rx="6" fill="#020617" opacity=".45"/>
      <rect x={-width/2} y="-47" width={width} height="94" rx="6" fill={`url(#${id}-edge)`} stroke="#89949c" strokeWidth=".9"/>
      <rect x={-width/2+2} y="-46" width={width-4} height="90" rx="5" fill={`url(#${id}-plastic)`} stroke="#fff" strokeWidth=".7"/>
      <path d={`M${-width/2+4} -34 H${width/2-4} M${-width/2+4} 33 H${width/2-4}`} stroke="#bac3c9" strokeWidth=".8"/>
      <rect x={-width/2+5} y="-31" width={width-10} height="62" rx="4" fill={`url(#${id}-plastic)`} stroke="#c7ced2" strokeWidth=".6"/>
      <path d={`M${-width/2+7} -25 V25`} stroke="#fff" strokeWidth="1.2" opacity=".9"/>
      {[-39,39].map(y => <g key={y} transform={`translate(0,${y})`}>
        <ellipse cy="1" rx="4.7" ry="5" fill="#aeb8bd"/>
        <circle r="3.4" fill={`url(#${id}-screw)`} stroke="#7d8991" strokeWidth=".7"/>
        <path d="M-2 -1.3 L2 1.3" stroke="#475569" strokeWidth="1.1" strokeLinecap="round"/>
      </g>)}
      <text x="0" y="3" textAnchor="middle" transform="rotate(-90)" fill="#718089" fontSize="6.5" fontWeight="800" letterSpacing="1">{sensor ? 'NASCOM' : 'MAGNET'}</text>
      {/* Alignment marks on the facing edges. */}
      <path d={sensor ? `M${width/2-4} -3 l-3 3 l3 3` : `M${-width/2+4} -3 l3 3 l-3 3`} fill="none" stroke="#6f808b" strokeWidth="1.1"/>
    </g>
  );

  return <g className="select-none">
    <defs>
      <linearGradient id={`${id}-plastic`} x1="0" y1="0" x2="1" y2=".25"><stop stopColor="#fff"/><stop offset=".45" stopColor="#f0f3f4"/><stop offset="1" stopColor="#d3dbdf"/></linearGradient>
      <linearGradient id={`${id}-edge`}><stop stopColor="#d9e0e3"/><stop offset="1" stopColor="#8b989f"/></linearGradient>
      <linearGradient id={`${id}-screw`} x2=".8" y2="1"><stop stopColor="#f8fafc"/><stop offset=".5" stopColor="#c1cbd1"/><stop offset="1" stopColor="#77868f"/></linearGradient>
    </defs>
    <title>{linked ? 'Sensor on frame · magnet on door. Follows the door movement.' : 'Click the magnet to open or close the door contact.'}</title>
    {/* Separate mounting surfaces make the fixed frame and moving door clear. */}
    <rect x="-49" y="-53" width="46" height="106" rx="3" fill="#26333e" stroke="#465766" strokeWidth=".7"/>
    <g transform={`translate(${separation},0)`} style={{ transition: linked ? 'transform 80ms linear' : 'transform 300ms ease' }}
      className={linked ? undefined : 'device-control cursor-pointer'}
      onPointerDown={event => { if (!linked) event.stopPropagation(); }}
      onClick={event => { if (!linked) { event.stopPropagation(); operate(); } }}>
      <rect x="3" y="-53" width="36" height="106" rx="3" fill="#34414a" stroke="#52636e" strokeWidth=".7"/>
      {housing(21, 30, false)}
    </g>
    {housing(-25, 42, true)}
    <text x="-25" y="-60" textAnchor="middle" fill="#9eacb8" fontSize="6.5" fontWeight="700" letterSpacing=".7">FRAME</text>
    <text x={21+separation} y="-60" textAnchor="middle" fill="#9eacb8" fontSize="6.5" fontWeight="700" letterSpacing=".7">DOOR</text>
    {/* Keep the existing wire anchors; these are not screws on the contact face. */}
    <rect x="-60" y="-34" width="18" height="68" rx="3" fill="#18232d" stroke="#64748b" strokeWidth=".7"/>
    {component.terminals.map(t => <g key={t.id} transform={`translate(${t.x},${t.y})`}>
      <circle r="5" fill={`url(#${id}-screw)`} stroke="#7d8991"/>
      <path d="M-2 -1.5 L2 1.5" stroke="#475569" strokeWidth="1.2"/>
      <text x="-11" y="2.5" textAnchor="end" fill={t.id==='com'?'#fde68a':t.id==='no'?'#86efac':'#fca5a5'} fontSize="7" fontWeight="800" fontFamily="monospace">{t.name}</text>
    </g>)}
    <g className={linked ? '' : 'device-control cursor-pointer'} role={linked ? undefined : 'button'} tabIndex={linked ? undefined : 0}
      aria-label={linked ? undefined : `${doorOpen ? 'Close' : 'Open'} ${component.label}`}
      aria-pressed={linked ? undefined : doorOpen}
      onPointerDown={event => event.stopPropagation()}
      onClick={event => { event.stopPropagation(); operate(); }}
      onKeyDown={event => { if ((event.key === 'Enter' || event.key === ' ') && !event.repeat) { event.preventDefault(); event.stopPropagation(); operate(); } }}>
      <rect x="-39" y="57" width="121" height="18" rx="5" fill="#101923" stroke={doorOpen?'#7f454b':'#376052'} strokeWidth=".8"/>
      <circle cx="-28" cy="66" r="2.5" fill={doorOpen?'#fb7185':'#6ee7b7'}/>
      <text x="24" y="69" textAnchor="middle" fill={doorOpen?'#fda4af':'#a7f3d0'} fontSize="7.5" fontWeight="800">{doorOpen ? 'DOOR OPEN' : 'DOOR CLOSED'}</text>
    </g>
    <text x="21" y="86" textAnchor="middle" fill="#a9b8c5" fontSize="7">{linked ? 'CONTACT FOLLOWS DOOR' : 'CLICK STATUS TO OPERATE'}</text>
  </g>;
};

export default DoorSensor;
