import React, { useEffect } from 'react';
import type { CircuitComponent } from '../../../types/game';
import { useGameStore } from '../../../store/useGameStore';
import { getTerminalKey } from '../../../simulation/circuitSolver';
import { soundManager } from '../../../audio/soundManager';

interface ComponentProps {
  component: CircuitComponent;
}

/**
 * Surface-mount request-to-exit button, drawn as the real part: a cream
 * moulded faceplate on a shallow back box seen slightly from the left, two
 * Phillips screws above and below the button, and a big square plunger
 * carrying the key symbol. `pressed` seats the plunger into the plate.
 */
const ExitButtonPlate: React.FC<{
  id: string;
  pressed: boolean;
  pilot?: boolean;
}> = ({ id, pressed, pilot = false }) => {
  const faceGrad = `plateFace-${id}`;
  const capGrad = `plateCap-${id}`;
  const screwGrad = `plateScrew-${id}`;
  // Travel of the plunger into the plate, in local units.
  const drop = pressed ? 2.2 : 0;

  return (
    <g>
      <defs>
        <linearGradient id={faceGrad} x1="12%" y1="0%" x2="88%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="42%" stopColor="#f6f4ee" />
          <stop offset="100%" stopColor="#dedbd1" />
        </linearGradient>
        <linearGradient id={capGrad} x1="18%" y1="0%" x2="82%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="55%" stopColor="#f3f1ea" />
          <stop offset="100%" stopColor="#dcd9cf" />
        </linearGradient>
        <radialGradient id={screwGrad} cx="34%" cy="28%" r="78%">
          <stop offset="0%" stopColor="#fbfaf7" />
          <stop offset="55%" stopColor="#d3d0c7" />
          <stop offset="100%" stopColor="#9d9a91" />
        </radialGradient>
      </defs>

      {/* Contact shadow on the wall */}
      <ellipse cx="44" cy="60" rx="30" ry="4" fill="#000000" opacity="0.32" style={{ filter: 'blur(2px)' }} />

      {/* Back box: right and bottom faces give the plate its depth */}
      <path d="M 68 6 L 73 11 L 73 55 L 68 50 Z" fill="#c8c5ba" />
      <path d="M 13 50 L 68 50 L 73 55 L 18 55 Z" fill="#b3b0a5" />

      {/* Faceplate */}
      <rect x="13" y="4" width="55" height="46" rx="3" fill={`url(#${faceGrad})`} stroke="#bcb9ae" strokeWidth="0.7" />
      {/* Moulded step around the plunger opening */}
      <rect x="19" y="9" width="43" height="36" rx="1.6" fill="none" stroke="#cbc8bd" strokeWidth="0.9" />
      <rect x="19" y="9" width="43" height="36" rx="1.6" fill="none" stroke="#ffffff" strokeWidth="0.5" opacity="0.6" transform="translate(0.6, 0.6)" />

      {/* Phillips screws, directly above and below the plunger */}
      {[11.5, 42.5].map(cy => (
        <g key={cy}>
          <circle cx="40.5" cy={cy} r="3.1" fill={`url(#${screwGrad})`} stroke="#939087" strokeWidth="0.45" />
          <path
            d={`M 38.5 ${cy - 0.6} L 42.5 ${cy + 0.6} M 39.6 ${cy + 1.9} L 41.4 ${cy - 1.9}`}
            stroke="#6f6d66"
            strokeWidth="0.85"
            strokeLinecap="round"
          />
        </g>
      ))}

      {/* Opening the plunger sits in — the dark line under its lower edge */}
      <rect x="21" y="15" width="39" height="24" rx="1.2" fill="#a8a59b" />

      <g style={{ transform: `translateY(${drop}px)`, transition: 'transform 90ms cubic-bezier(0.16, 1, 0.3, 1)' }}>
        {/* Plunger: top face proud of the plate, lower edge dropping into it */}
        <path
          d="M 21.5 16 L 59.5 16 L 57.5 37.5 L 23.5 37.5 Z"
          fill={`url(#${capGrad})`}
          stroke="#c2bfb4"
          strokeWidth="0.7"
          style={{ filter: pressed ? 'none' : 'drop-shadow(0 2.5px 2.5px rgba(0,0,0,0.4))' }}
        />
        {/* Lit top edge and shaded lower lip, the cue that it stands proud */}
        <path d="M 22 17.1 L 59 17.1" stroke="#ffffff" strokeWidth="1.1" opacity={pressed ? 0.3 : 0.95} strokeLinecap="round" />
        <path d="M 23.8 36.6 L 57.2 36.6" stroke="#a6a39a" strokeWidth="0.9" opacity="0.75" strokeLinecap="round" />

        {/* Key symbol */}
        <g stroke="#101216" fill="none" strokeLinecap="round">
          <circle cx="32" cy="26.5" r="4.2" strokeWidth="2.5" />
          <path d="M 36.2 26.5 H 50" strokeWidth="2.5" />
          <path d="M 45.4 26.5 V 31.2" strokeWidth="2.2" />
          <path d="M 49.4 26.5 V 30.2" strokeWidth="2.2" />
        </g>

        {/* Pilot lamp, only on the latching version */}
        {pilot !== undefined && (
          <circle
            cx="25.6"
            cy="19.8"
            r="1.5"
            fill={pilot ? '#22c55e' : '#d7d4ca'}
            stroke={pilot ? '#15803d' : '#b7b4aa'}
            strokeWidth="0.4"
            style={{ filter: pilot ? 'drop-shadow(0 0 2.5px #22c55e)' : 'none' }}
          />
        )}
      </g>

      {/* Whole plate is the hit target */}
      <rect x="13" y="4" width="55" height="46" fill="transparent" />
    </g>
  );
};

export const SwitchNO: React.FC<ComponentProps> = ({ component }) => {
  const pressButton = useGameStore(state => state.pressButton);
  const nodeVoltages = useGameStore(state => state.simulation.nodeVoltages);
  const isRunning = useGameStore(state => state.isRunning);
  
  const isPressed = component.state.pressed || false;

  useEffect(() => {
    if (!isPressed) return;
    const handleGlobalUp = () => {
      pressButton(component.id, false);
    };
    window.addEventListener('pointerup', handleGlobalUp);
    window.addEventListener('pointercancel', handleGlobalUp);
    return () => {
      window.removeEventListener('pointerup', handleGlobalUp);
      window.removeEventListener('pointercancel', handleGlobalUp);
    };
  }, [isPressed, component.id, pressButton]);

  const handlePointerDown = (e: React.PointerEvent) => {
    e.stopPropagation();
    pressButton(component.id, true);
  };

  const hasCom = component.terminals.some(t => t.id === 'com');
  const inKey = hasCom ? getTerminalKey(component.id, 'com') : getTerminalKey(component.id, 'in');
  const outKey = hasCom ? getTerminalKey(component.id, 'no') : getTerminalKey(component.id, 'out');
  const hasVoltage = isRunning && (nodeVoltages[inKey] > 0 || nodeVoltages[outKey] > 0 || (hasCom && nodeVoltages[getTerminalKey(component.id, 'nc')] > 0));

  // Schematic node positions inside the boxed inset (local coords)
  const comNode = { x: 18, y: 85 };
  const ncNode = { x: 66, y: 74 };
  const noNode = { x: 66, y: 96 };
  const spstOut = { x: 66, y: 85 };

  return (
    <g transform="translate(-42, -50)" className="select-none">
      {/* ---------- Housing ---------- */}
      <rect x="2" y="4" width="80" height="116" rx="7" fill="#20242e" stroke="#0f1116" strokeWidth="2" />
      <rect x="18" y="0" width="48" height="5" rx="1.5" fill="#78829a" opacity="0.5" />
      <rect x="18" y="119" width="48" height="5" rx="1.5" fill="#78829a" opacity="0.5" />

      {/* ================= 1. THE PART — surface-mount exit button ================= */}
      <g className="cursor-pointer device-control" onPointerDown={handlePointerDown}>
        <ExitButtonPlate id={`mom-${component.id}`} pressed={isPressed} />
      </g>

      {/* ================= 2. THE SCHEMATIC — its own boxed panel ================= */}
      <rect x="8" y="64" width="68" height="42" rx="4" fill="#080b11" stroke="#28313f" strokeWidth="1" />
      <text x="12" y="70.5" fill="#4b5563" fontSize="4" fontWeight="800" fontFamily="monospace">CONTACTS</text>

      {hasCom ? (
        <g>
          {/* Leads from the screw terminals into the panel */}
          <path d={`M0 75 H10 V${comNode.y} H${comNode.x}`} fill="none" stroke="#5b6473" strokeWidth="1.6" />
          <path d={`M84 64 H72 V${ncNode.y} H${ncNode.x}`} fill="none" stroke="#5b6473" strokeWidth="1.6" />
          <path d={`M84 88 H72 V${noNode.y} H${noNode.x}`} fill="none" stroke="#5b6473" strokeWidth="1.6" />

          {/* The blade transfers from NC to NO while held */}
          <line
            x1={comNode.x}
            y1={comNode.y}
            x2={isPressed ? noNode.x : ncNode.x}
            y2={isPressed ? noNode.y : ncNode.y}
            stroke={hasVoltage ? '#fbbf24' : '#22c55e'}
            strokeWidth="2.6"
            strokeLinecap="round"
            style={{ transition: 'all 90ms ease-out' }}
          />
          <line
            x1={comNode.x}
            y1={comNode.y}
            x2={isPressed ? ncNode.x : noNode.x}
            y2={isPressed ? ncNode.y : noNode.y}
            stroke="#3f4653"
            strokeWidth="1.2"
            strokeDasharray="2,2"
            opacity="0.7"
          />

          <circle cx={comNode.x} cy={comNode.y} r="2.6" fill="#e2e8f0" stroke="#334155" strokeWidth="0.8" />
          <circle cx={ncNode.x} cy={ncNode.y} r="2.6" fill={isPressed ? '#334155' : '#86efac'} stroke="#334155" strokeWidth="0.8" />
          <circle cx={noNode.x} cy={noNode.y} r="2.6" fill={isPressed ? '#86efac' : '#334155'} stroke="#334155" strokeWidth="0.8" />

          <text x={comNode.x - 5} y={comNode.y + 2} fill="#94a3b8" fontSize="5" fontWeight="900" fontFamily="monospace" textAnchor="end">C</text>
          <text x={ncNode.x + 5} y={ncNode.y + 2} fill={isPressed ? '#64748b' : '#86efac'} fontSize="5" fontWeight="900" fontFamily="monospace">NC</text>
          <text x={noNode.x + 5} y={noNode.y + 2} fill={isPressed ? '#86efac' : '#64748b'} fontSize="5" fontWeight="900" fontFamily="monospace">NO</text>
        </g>
      ) : (
        <g>
          {/* Two-wire form: leads drop from the side terminals into the panel */}
          <path d={`M12 50 V${comNode.y} H${comNode.x}`} fill="none" stroke="#5b6473" strokeWidth="1.6" />
          <path d={`M72 50 V${spstOut.y} H${spstOut.x}`} fill="none" stroke="#5b6473" strokeWidth="1.6" />

          {isPressed ? (
            <line x1={comNode.x} y1={comNode.y} x2={spstOut.x} y2={spstOut.y} stroke={hasVoltage ? '#fbbf24' : '#22c55e'} strokeWidth="2.6" strokeLinecap="round" />
          ) : (
            <line x1={comNode.x} y1={comNode.y} x2={spstOut.x - 4} y2={spstOut.y - 11} stroke="#94a3b8" strokeWidth="2.4" strokeLinecap="round" />
          )}

          <circle cx={comNode.x} cy={comNode.y} r="2.6" fill="#e2e8f0" stroke="#334155" strokeWidth="0.8" />
          <circle cx={spstOut.x} cy={spstOut.y} r="2.6" fill={isPressed ? '#86efac' : '#334155'} stroke="#334155" strokeWidth="0.8" />
          <text x={42} y={100} fill={isPressed ? '#86efac' : '#64748b'} fontSize="5" fontWeight="900" fontFamily="monospace" textAnchor="middle">
            {isPressed ? 'CLOSED' : 'OPEN'}
          </text>
        </g>
      )}

      {/* ================= 3. Behaviour caption ================= */}
      <rect
        x="8"
        y="108"
        width="68"
        height="10"
        rx="2.5"
        fill={isPressed ? '#14532d' : '#12151c'}
        stroke={isPressed ? '#22c55e' : '#2b313d'}
        strokeWidth="0.9"
        style={{ transition: 'all 120ms ease-out' }}
      />
      <text
        x="42"
        y="115"
        fill={isPressed ? '#86efac' : '#8b94a4'}
        fontSize="5.4"
        fontWeight="900"
        fontFamily="monospace"
        textAnchor="middle"
        letterSpacing="0.2"
        style={{ pointerEvents: 'none' }}
      >
        {isPressed ? 'HELD — LET GO' : 'HOLD TO CLOSE'}
      </text>

      {/* Device name under the housing */}
      <text x="42" y="134" fill="#cbd5e1" fontSize="9.5" fontWeight="bold" textAnchor="middle">
        {component.label}
      </text>

      <defs>
        <radialGradient id="btnNOGrad" cx="30%" cy="30%" r="70%">
          <stop offset="0%" stopColor="#4ade80" />
          <stop offset="60%" stopColor="#22c55e" />
          <stop offset="100%" stopColor="#15803d" />
        </radialGradient>
        <radialGradient id="btnCharcoalGrad" cx="30%" cy="30%" r="70%">
          <stop offset="0%" stopColor="#4b5563" />
          <stop offset="60%" stopColor="#1f2937" />
          <stop offset="100%" stopColor="#111827" />
        </radialGradient>
      </defs>
    </g>
  );
};

export const SwitchNC: React.FC<ComponentProps> = ({ component }) => {
  const pressButton = useGameStore(state => state.pressButton);
  const nodeVoltages = useGameStore(state => state.simulation.nodeVoltages);
  const isRunning = useGameStore(state => state.isRunning);
  
  const isPressed = component.state.pressed || false;

  useEffect(() => {
    if (!isPressed) return;
    const handleGlobalUp = () => {
      pressButton(component.id, false);
    };
    window.addEventListener('pointerup', handleGlobalUp);
    window.addEventListener('pointercancel', handleGlobalUp);
    return () => {
      window.removeEventListener('pointerup', handleGlobalUp);
      window.removeEventListener('pointercancel', handleGlobalUp);
    };
  }, [isPressed, component.id, pressButton]);

  const handlePointerDown = (e: React.PointerEvent) => {
    e.stopPropagation();
    pressButton(component.id, true);
  };

  // Determine voltage presence at switch terminals
  const inKey = getTerminalKey(component.id, 'in');
  const outKey = getTerminalKey(component.id, 'out');
  const hasVoltage = isRunning && (nodeVoltages[inKey] > 0 || nodeVoltages[outKey] > 0);

  return (
    <g 
      transform="translate(-40, -40)"
      className="select-none"
    >
      {/* DIN Rail mounting plate */}
      <rect x="5" y="5" width="70" height="70" rx="4" fill="#2d303a" stroke="#1f2028" strokeWidth="2" />
      <rect x="15" y="1" width="50" height="4" fill="#78829a" opacity="0.6" />
      <rect x="15" y="75" width="50" height="4" fill="#78829a" opacity="0.6" />

      {/* Same physical plunger treatment as the N/O button */}
      <g className="cursor-pointer device-control" onPointerDown={handlePointerDown}>
        <circle cx="40" cy="40" r="22" fill="#1b1e25" stroke="#3c4252" strokeWidth="2" />
        <circle cx="40" cy="40" r="19.5" fill="#080a0e" />
        <circle
          cx="40"
          cy="40"
          r={isPressed ? 16.5 : 19}
          fill="none"
          stroke="#2b313d"
          strokeWidth={isPressed ? 3.4 : 1.2}
          style={{ transition: 'all 90ms ease-out' }}
        />
        <g
          style={{
            transform: isPressed ? 'translateY(2.5px)' : 'translateY(0)',
            transition: 'transform 90ms cubic-bezier(0.16, 1, 0.3, 1)'
          }}
        >
          <circle
            cx="40"
            cy="40"
            r={isPressed ? 15.5 : 18}
            fill="url(#btnNCGrad)"
            stroke={isPressed ? '#991b1b' : '#ef4444'}
            strokeWidth="2.5"
            filter={isPressed ? 'none' : 'drop-shadow(0 5px 7px rgba(0,0,0,0.45))'}
            style={{ transition: 'all 90ms ease-out' }}
          />
          <ellipse
            cx="34"
            cy="34"
            rx={isPressed ? 4.5 : 6.5}
            ry={isPressed ? 2.4 : 4}
            fill="#ffffff"
            opacity={isPressed ? 0.09 : 0.2}
            style={{ transition: 'all 90ms ease-out' }}
          />
        </g>
        <circle cx="40" cy="40" r="24" fill="transparent" />
      </g>

      {/* Contact terminal internally schematic overlay - connects exactly to X=10 and X=70 */}
      <path d="M10 40 L25 40 M55 40 L70 40" stroke="#78829a" strokeWidth="2.5" strokeLinecap="round" />
      
      {isPressed ? (
        // Pressed is Open contact for NC switch
        <g>
          {/* Angled open arm */}
          <line x1="25" y1="40" x2="52" y2="52" stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round" />
          
          {/* Dotted bridge path showing current is blocked here */}
          <line 
            x1="25" 
            y1="40" 
            x2="55" 
            y2="40" 
            stroke={hasVoltage ? "#fbbf24" : "#4b5563"} 
            strokeWidth={hasVoltage ? 2.5 : 1.5}
            strokeDasharray="2,3" 
            filter={hasVoltage ? "url(#yellow-glow)" : "none"}
            opacity={hasVoltage ? 0.95 : 0.4} 
          />
        </g>
      ) : (
        // Unpressed is Closed (Default)
        <path d="M25 40 L55 40" stroke="#22c55e" strokeWidth="3" strokeLinecap="round" />
      )}
      
      <circle cx="25" cy="40" r="2.5" fill="#f8fafc" stroke="#334155" strokeWidth="1" />
      <circle cx="55" cy="40" r="2.5" fill="#f8fafc" stroke="#334155" strokeWidth="1" />

      {/* Text label */}
      <text x="40" y="93" fill="#cbd5e1" fontSize="10" fontWeight="bold" textAnchor="middle">
        {component.label}
      </text>

      <g style={{ pointerEvents: 'none' }}>
        <rect
          x="2"
          y="98"
          width="76"
          height="13"
          rx="3"
          fill={isPressed ? '#450a0a' : '#12151c'}
          stroke={isPressed ? '#ef4444' : '#3c4252'}
          strokeWidth="1"
          style={{ transition: 'all 120ms ease-out' }}
        />
        <text
          x="40"
          y="107"
          fill={isPressed ? '#fca5a5' : '#94a3b8'}
          fontSize="6.4"
          fontWeight="900"
          fontFamily="monospace"
          textAnchor="middle"
          letterSpacing="0.3"
        >
          {isPressed ? 'HELD — LET GO TO CLOSE' : 'MOMENTARY · HOLD'}
        </text>
      </g>

      <defs>
        <radialGradient id="btnNCGrad" cx="30%" cy="30%" r="70%">
          <stop offset="0%" stopColor="#fca5a5" />
          <stop offset="60%" stopColor="#ef4444" />
          <stop offset="100%" stopColor="#b91c1c" />
        </radialGradient>
      </defs>
    </g>
  );
};

export const SelectorSwitch: React.FC<ComponentProps> = ({ component }) => {
  const toggleSwitch = useGameStore(state => state.toggleSwitch);
  const nodeVoltages = useGameStore(state => state.simulation.nodeVoltages);
  const isRunning = useGameStore(state => state.isRunning);
  
  const isToggled = component.state.toggled || false;

  const handleTogglePointerDown = (e: React.PointerEvent) => {
    e.stopPropagation();
  };

  const handleTogglePointerUp = (e: React.PointerEvent) => {
    e.stopPropagation();
    toggleSwitch(component.id);
  };

  // Determine voltage presence at selector input
  const inKey = getTerminalKey(component.id, 'in');
  const hasVoltage = isRunning && nodeVoltages[inKey] > 0;

  return (
    <g 
      transform="translate(-45, -45)"
      className="select-none"
    >
      {/* Industrial case */}
      <rect x="5" y="5" width="80" height="80" rx="6" fill="#2d303a" stroke="#1f2028" strokeWidth="2" />
      <rect x="20" y="1" width="50" height="4" fill="#78829a" opacity="0.6" />
      <rect x="20" y="85" width="50" height="4" fill="#78829a" opacity="0.6" />

      {/* Mode tick indicators */}
      <line x1="26" y1="26" x2="31" y2="31" stroke="#cbd5e1" strokeWidth="2.5" />
      <line x1="64" y1="26" x2="59" y2="31" stroke="#cbd5e1" strokeWidth="2.5" />
      <text x="22" y="20" fill="#a4b0cb" fontSize="8" fontWeight="bold" textAnchor="middle">A</text>
      <text x="68" y="20" fill="#a4b0cb" fontSize="8" fontWeight="bold" textAnchor="middle">B</text>

      {/* Interactive toggle knob zone */}
      <g 
        className="cursor-pointer"
        onPointerDown={handleTogglePointerDown}
        onPointerUp={handleTogglePointerUp}
      >
        {/* Rotary switch bezel */}
        <circle cx="45" cy="45" r="25" fill="#1b1e25" stroke="#3c4252" strokeWidth="2.5" />

        {/* Rotary Knob Switch Handle */}
        <g transform={`rotate(${isToggled ? 45 : -45}, 45, 45)`} style={{ transition: 'transform 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275)' }}>
          {/* Knob shaft */}
          <rect x="37" y="23" width="16" height="44" rx="3" fill="url(#knobGrad)" stroke="#111827" strokeWidth="1.5" />
          {/* Colored pointer strip */}
          <rect x="43" y="25" width="4" height="15" rx="1" fill="#ef4444" />
        </g>
      </g>

      {/* Internal Schematic visual overlay linking exactly to terminals X=10 and X=80 */}
      {/* Input lead trace */}
      <line x1="10" y1="45" x2="25" y2="45" stroke="#78829a" strokeWidth="2.5" strokeLinecap="round" />
      
      {/* Output A lead trace */}
      <line x1="55" y1="30" x2="80" y2="30" stroke="#78829a" strokeWidth="2.5" strokeLinecap="round" />
      
      {/* Output B lead trace */}
      {component.terminals.some(t => t.id === 'out_b') && (
        <line x1="55" y1="60" x2="80" y2="60" stroke="#78829a" strokeWidth="2.5" strokeLinecap="round" />
      )}

      {/* Dynamic arm path connecting to selected channel */}
      {!isToggled ? (
        // Connected to A, B is open/blocked
        <g>
          {/* Arm closed to A */}
          <line x1="25" y1="45" x2="55" y2="30" stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round" />
          
          {/* Dotted path to B showing it is open */}
          {component.terminals.some(t => t.id === 'out_b') && (
            <line 
              x1="25" 
              y1="45" 
              x2="55" 
              y2="60" 
              stroke={hasVoltage ? "#fbbf24" : "#4b5563"} 
              strokeWidth={hasVoltage ? 2 : 1.2}
              strokeDasharray="2,3" 
              filter={hasVoltage ? "url(#yellow-glow)" : "none"}
              opacity={hasVoltage ? 0.95 : 0.4} 
            />
          )}
        </g>
      ) : (
        // Connected to B, A is open/blocked
        <g>
          {/* Arm closed to B */}
          {component.terminals.some(t => t.id === 'out_b') && (
            <line x1="25" y1="45" x2="55" y2="60" stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round" />
          )}
          
          {/* Dotted path to A showing it is open */}
          <line 
            x1="25" 
            y1="45" 
            x2="55" 
            y2="30" 
            stroke={hasVoltage ? "#fbbf24" : "#4b5563"} 
            strokeWidth={hasVoltage ? 2 : 1.2}
            strokeDasharray="2,3" 
            filter={hasVoltage ? "url(#yellow-glow)" : "none"}
            opacity={hasVoltage ? 0.95 : 0.4} 
          />
        </g>
      )}

      {/* Terminal circles on schematic */}
      <circle cx="25" cy="45" r="2.5" fill="#f8fafc" stroke="#334155" strokeWidth="1" />
      <circle cx="55" cy="30" r="2.5" fill="#f8fafc" stroke="#334155" strokeWidth="1" />
      {component.terminals.some(t => t.id === 'out_b') && (
        <circle cx="55" cy="60" r="2.5" fill="#f8fafc" stroke="#334155" strokeWidth="1" />
      )}

      {/* Schematic details inside */}
      <text x="45" y="103" fill="#cbd5e1" fontSize="10" fontWeight="bold" textAnchor="middle">
        {component.label}
      </text>

      <defs>
        <linearGradient id="knobGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#374151" />
          <stop offset="50%" stopColor="#1f2937" />
          <stop offset="100%" stopColor="#111827" />
        </linearGradient>
      </defs>
    </g>
  );
};

export const RockerSwitch3Pos: React.FC<ComponentProps> = ({ component }) => {
  const setComponentState = useGameStore(state => state.setComponentState);

  const toggled = (component.state.toggled as any) || 'off';
  const isLeft = toggled === 'left';
  const isRight = toggled === 'right';

  const press = (side: 'left' | 'right') => (e: React.PointerEvent) => {
    e.stopPropagation();
    // Throw the contact first: capture is only there to keep the release
    // event, and a capture failure must never swallow the actuation.
    setComponentState(component.id, 'toggled', side);
    soundManager.playClick();
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {
      /* pointer already gone */
    }
  };

  const release = (e: React.PointerEvent) => {
    e.stopPropagation();
    setComponentState(component.id, 'toggled', 'off');
    soundManager.playClick();
  };

  // Two poles, each drawn as a pivot with an upper (L) and lower (R) contact.
  const poles = [
    { com: { x: 18, y: 66 }, l: { x: 60, y: 60 }, r: { x: 60, y: 72 }, rest: { x: 56, y: 66 }, labels: ['L1', 'R1'] },
    { com: { x: 18, y: 90 }, l: { x: 60, y: 84 }, r: { x: 60, y: 96 }, rest: { x: 56, y: 90 }, labels: ['L2', 'R2'] }
  ];

  return (
    <g transform="translate(-42, -50)" className="select-none">
      {/* ---------- Housing ---------- */}
      <rect x="2" y="4" width="80" height="118" rx="7" fill="#20242e" stroke="#0f1116" strokeWidth="2" />
      <rect x="18" y="0" width="48" height="5" rx="1.5" fill="#78829a" opacity="0.5" />
      <rect x="18" y="121" width="48" height="5" rx="1.5" fill="#78829a" opacity="0.5" />

      {/* ================= 1. THE PART — nothing drawn across it ================= */}
      <text x="42" y="16" fill="#7b8496" fontSize="5.2" fontWeight="900" fontFamily="monospace" textAnchor="middle" letterSpacing="0.8">
        3-POSITION
      </text>

      <g className="device-control">
        {/* Panel bezel */}
        <rect x="12" y="20" width="60" height="30" rx="4" fill="url(#rocker3BezelGrad)" stroke="#0d0f13" strokeWidth="1.3" />
        <rect x="15" y="23" width="54" height="24" rx="3" fill="#05070a" />

        {/* Position marks on the bezel floor */}
        <polygon points="21,35 27,31 27,39" fill={isLeft ? '#22c55e' : '#4b5563'} style={{ pointerEvents: 'none' }} />
        <circle cx="42" cy="35" r="3.4" fill="none" stroke={toggled === 'off' ? '#e2e8f0' : '#4b5563'} strokeWidth="1.6" style={{ pointerEvents: 'none' }} />
        <polygon points="63,35 57,31 57,39" fill={isRight ? '#22c55e' : '#4b5563'} style={{ pointerEvents: 'none' }} />

        {/* One paddle that tips to the side being held and springs back to centre */}
        <g
          style={{
            transform: isLeft ? 'rotate(-13deg)' : isRight ? 'rotate(13deg)' : 'rotate(0deg)',
            transformOrigin: '42px 35px',
            transformBox: 'view-box',
            transition: 'transform 120ms cubic-bezier(0.34, 1.56, 0.64, 1)',
            pointerEvents: 'none'
          }}
        >
          <rect
            x="18"
            y="26"
            width="48"
            height="18"
            rx="2.5"
            fill="url(#rocker3PaddleGrad)"
            stroke="#5b6473"
            strokeWidth="0.9"
            style={{ filter: 'drop-shadow(0 3px 5px rgba(0,0,0,0.7))' }}
          />
          {[31, 35, 39].map(y => (
            <line key={y} x1="28" y1={y} x2="56" y2={y} stroke="#22262e" strokeWidth="0.8" opacity="0.6" />
          ))}
        </g>

        {/* Hit targets — device-control keeps the canvas drag handler off them */}
        <rect
          x="12"
          y="20"
          width="30"
          height="30"
          fill="transparent"
          className="cursor-pointer device-control"
          onPointerDown={press('left')}
          onPointerUp={release}
          onPointerLeave={release}
          onPointerCancel={release}
        />
        <rect
          x="42"
          y="20"
          width="30"
          height="30"
          fill="transparent"
          className="cursor-pointer device-control"
          onPointerDown={press('right')}
          onPointerUp={release}
          onPointerLeave={release}
          onPointerCancel={release}
        />
      </g>

      {/* ================= 2. THE SCHEMATIC — its own boxed panel ================= */}
      <rect x="8" y="54" width="68" height="48" rx="4" fill="#080b11" stroke="#28313f" strokeWidth="1" />
      <text x="12" y="59.5" fill="#4b5563" fontSize="3.8" fontWeight="800" fontFamily="monospace">CONTACTS · 2 POLE</text>

      {poles.map((pole, idx) => {
        const target = isLeft ? pole.l : isRight ? pole.r : pole.rest;
        return (
          <g key={idx}>
            {/* Leads out to the screw terminals on each edge */}
            <path d={`M0 ${pole.com.y} H${pole.com.x}`} fill="none" stroke="#5b6473" strokeWidth="1.5" />
            <path d={`M84 ${pole.l.y} H${pole.l.x}`} fill="none" stroke="#5b6473" strokeWidth="1.5" />
            <path d={`M84 ${pole.r.y} H${pole.r.x}`} fill="none" stroke="#5b6473" strokeWidth="1.5" />

            {/* Blade: rests between both contacts at centre-off, touching neither */}
            <line
              x1={pole.com.x}
              y1={pole.com.y}
              x2={target.x}
              y2={target.y}
              stroke={toggled === 'off' ? '#64748b' : '#22c55e'}
              strokeWidth="2.4"
              strokeLinecap="round"
              style={{ transition: 'all 120ms ease-out' }}
            />

            <circle cx={pole.com.x} cy={pole.com.y} r="2.4" fill="#e2e8f0" stroke="#334155" strokeWidth="0.7" />
            <circle cx={pole.l.x} cy={pole.l.y} r="2.4" fill={isLeft ? '#86efac' : '#334155'} stroke="#334155" strokeWidth="0.7" />
            <circle cx={pole.r.x} cy={pole.r.y} r="2.4" fill={isRight ? '#86efac' : '#334155'} stroke="#334155" strokeWidth="0.7" />

            <text x={pole.com.x - 4} y={pole.com.y + 1.8} fill="#94a3b8" fontSize="4.4" fontWeight="900" fontFamily="monospace" textAnchor="end">
              C{idx + 1}
            </text>
            <text x={pole.l.x + 4} y={pole.l.y + 1.8} fill={isLeft ? '#86efac' : '#64748b'} fontSize="4.4" fontWeight="900" fontFamily="monospace">
              {pole.labels[0]}
            </text>
            <text x={pole.r.x + 4} y={pole.r.y + 1.8} fill={isRight ? '#86efac' : '#64748b'} fontSize="4.4" fontWeight="900" fontFamily="monospace">
              {pole.labels[1]}
            </text>
          </g>
        );
      })}

      {/* ================= 3. Behaviour caption ================= */}
      <rect
        x="8"
        y="106"
        width="68"
        height="10"
        rx="2.5"
        fill={toggled === 'off' ? '#12151c' : '#14532d'}
        stroke={toggled === 'off' ? '#2b313d' : '#22c55e'}
        strokeWidth="0.9"
        style={{ transition: 'all 120ms ease-out' }}
      />
      <text
        x="42"
        y="113"
        fill={toggled === 'off' ? '#8b94a4' : '#86efac'}
        fontSize="5.2"
        fontWeight="900"
        fontFamily="monospace"
        textAnchor="middle"
        letterSpacing="0.2"
        style={{ pointerEvents: 'none' }}
      >
        {isLeft ? 'HELD LEFT' : isRight ? 'HELD RIGHT' : 'HOLD L OR R'}
      </text>

      <text x="42" y="136" fill="#cbd5e1" fontSize="9.5" fontWeight="bold" textAnchor="middle">
        {component.label}
      </text>

      <defs>
        <linearGradient id="rocker3PaddleGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#5b6473" />
          <stop offset="55%" stopColor="#434a57" />
          <stop offset="100%" stopColor="#2b313d" />
        </linearGradient>
        <linearGradient id="rocker3BezelGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#3a414e" />
          <stop offset="100%" stopColor="#1d222b" />
        </linearGradient>
      </defs>
    </g>
  );
};

export const RockerSwitch2Pos: React.FC<ComponentProps> = ({ component }) => {
  const toggleSwitch = useGameStore(state => state.toggleSwitch);
  const nodeVoltages = useGameStore(state => state.simulation.nodeVoltages);
  const isRunning = useGameStore(state => state.isRunning);

  const isToggled = component.state.toggled || false;

  const handlePointerDown = (e: React.PointerEvent) => {
    e.stopPropagation();
    toggleSwitch(component.id);
    soundManager.playClick();
  };

  const inKey = getTerminalKey(component.id, 'com');
  const hasVoltage = isRunning && nodeVoltages[inKey] > 0;

  // Schematic node positions inside the boxed inset (local coords)
  const comNode = { x: 18, y: 85 };
  const ncNode = { x: 66, y: 74 };
  const noNode = { x: 66, y: 96 };

  return (
    <g transform="translate(-42, -50)" className="select-none">
      {/* ---------- Housing ---------- */}
      <rect x="2" y="4" width="80" height="116" rx="7" fill="#20242e" stroke="#0f1116" strokeWidth="2" />
      <rect x="18" y="0" width="48" height="5" rx="1.5" fill="#78829a" opacity="0.5" />
      <rect x="18" y="119" width="48" height="5" rx="1.5" fill="#78829a" opacity="0.5" />

      {/* ================= 1. THE PART — surface-mount exit button ================= */}
      <g className="cursor-pointer device-control" onPointerDown={handlePointerDown}>
        <ExitButtonPlate id={`main-${component.id}`} pressed={Boolean(isToggled)} pilot={Boolean(isToggled)} />

        {/* State chip below the plate */}
        <rect x="30" y="60" width="24" height="8.5" rx="2" fill={isToggled ? '#14532d' : '#2b313d'} stroke={isToggled ? '#22c55e' : '#4b5563'} strokeWidth="0.8" />
        <text x="42" y="66.3" fill={isToggled ? '#dcfce7' : '#cbd5e1'} fontSize="5.4" fontWeight="900" fontFamily="monospace" textAnchor="middle" style={{ pointerEvents: 'none' }}>
          {isToggled ? 'ON' : 'OFF'}
        </text>
      </g>

      {/* ================= 2. THE SCHEMATIC — its own boxed panel ================= */}
      <rect x="8" y="70" width="68" height="36" rx="4" fill="#080b11" stroke="#28313f" strokeWidth="1" />
      <text x="12" y="76.5" fill="#4b5563" fontSize="4" fontWeight="800" fontFamily="monospace">CONTACTS</text>

      {/* Leads from the screw terminals into the panel */}
      <path d={`M0 75 H10 V${comNode.y} H${comNode.x}`} fill="none" stroke="#5b6473" strokeWidth="1.6" />
      <path d={`M84 64 H72 V${ncNode.y} H${ncNode.x}`} fill="none" stroke="#5b6473" strokeWidth="1.6" />
      <path d={`M84 88 H72 V${noNode.y} H${noNode.x}`} fill="none" stroke="#5b6473" strokeWidth="1.6" />

      {/* Blade sits on whichever contact the paddle selected — and stays there */}
      <line
        x1={comNode.x}
        y1={comNode.y}
        x2={isToggled ? noNode.x : ncNode.x}
        y2={isToggled ? noNode.y : ncNode.y}
        stroke={hasVoltage ? '#fbbf24' : '#22c55e'}
        strokeWidth="2.6"
        strokeLinecap="round"
        style={{ transition: 'all 150ms ease-out' }}
      />
      <line
        x1={comNode.x}
        y1={comNode.y}
        x2={isToggled ? ncNode.x : noNode.x}
        y2={isToggled ? ncNode.y : noNode.y}
        stroke="#3f4653"
        strokeWidth="1.2"
        strokeDasharray="2,2"
        opacity="0.7"
      />

      <circle cx={comNode.x} cy={comNode.y} r="2.6" fill="#e2e8f0" stroke="#334155" strokeWidth="0.8" />
      <circle cx={ncNode.x} cy={ncNode.y} r="2.6" fill={isToggled ? '#334155' : '#86efac'} stroke="#334155" strokeWidth="0.8" />
      <circle cx={noNode.x} cy={noNode.y} r="2.6" fill={isToggled ? '#86efac' : '#334155'} stroke="#334155" strokeWidth="0.8" />

      <text x={comNode.x - 5} y={comNode.y + 2} fill="#94a3b8" fontSize="5" fontWeight="900" fontFamily="monospace" textAnchor="end">C</text>
      <text x={ncNode.x + 5} y={ncNode.y + 2} fill={isToggled ? '#64748b' : '#86efac'} fontSize="5" fontWeight="900" fontFamily="monospace">NC</text>
      <text x={noNode.x + 5} y={noNode.y + 2} fill={isToggled ? '#86efac' : '#64748b'} fontSize="5" fontWeight="900" fontFamily="monospace">NO</text>

      {/* ================= 3. Behaviour caption ================= */}
      <rect
        x="8"
        y="108"
        width="68"
        height="10"
        rx="2.5"
        fill={isToggled ? '#14532d' : '#12151c'}
        stroke={isToggled ? '#22c55e' : '#2b313d'}
        strokeWidth="0.9"
        style={{ transition: 'all 120ms ease-out' }}
      />
      <text
        x="42"
        y="115"
        fill={isToggled ? '#86efac' : '#8b94a4'}
        fontSize="5.4"
        fontWeight="900"
        fontFamily="monospace"
        textAnchor="middle"
        letterSpacing="0.2"
        style={{ pointerEvents: 'none' }}
      >
        {isToggled ? 'LATCHED ON' : 'CLICK TO LATCH'}
      </text>

      <text x="42" y="134" fill="#cbd5e1" fontSize="9.5" fontWeight="bold" textAnchor="middle">
        {component.label}
      </text>

      <defs>
      </defs>
    </g>
  );
};
