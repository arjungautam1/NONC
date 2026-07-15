import React from 'react';
import type { CircuitComponent } from '../../../types/game';
import { useGameStore } from '../../../store/useGameStore';
import { getTerminalKey } from '../../../simulation/circuitSolver';
import { soundManager } from '../../../audio/soundManager';

interface ComponentProps {
  component: CircuitComponent;
}

export const SwitchNO: React.FC<ComponentProps> = ({ component }) => {
  const pressButton = useGameStore(state => state.pressButton);
  const nodeVoltages = useGameStore(state => state.simulation.nodeVoltages);
  const isRunning = useGameStore(state => state.isRunning);
  
  const isPressed = component.state.pressed || false;
  const isMomentaryRef = React.useRef(false);

  const handlePointerDown = (e: React.PointerEvent) => {
    e.stopPropagation();
    if (e.shiftKey) {
      isMomentaryRef.current = false;
      pressButton(component.id, !isPressed);
    } else {
      isMomentaryRef.current = true;
      // @ts-ignore
      e.currentTarget.setPointerCapture(e.pointerId);
      pressButton(component.id, true);
    }
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    e.stopPropagation();
    if (isMomentaryRef.current) {
      pressButton(component.id, false);
      isMomentaryRef.current = false;
    }
  };

  const hasCom = component.terminals.some(t => t.id === 'com');
  const inKey = hasCom ? getTerminalKey(component.id, 'com') : getTerminalKey(component.id, 'in');
  const outKey = hasCom ? getTerminalKey(component.id, 'no') : getTerminalKey(component.id, 'out');
  const hasVoltage = isRunning && (nodeVoltages[inKey] > 0 || nodeVoltages[outKey] > 0 || (hasCom && nodeVoltages[getTerminalKey(component.id, 'nc')] > 0));

  return (
    <g 
      transform="translate(-40, -40)"
      className="cursor-pointer select-none"
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
    >
      {/* DIN Rail mounting plate */}
      <rect x="5" y="5" width="70" height="70" rx="4" fill="#2d303a" stroke="#1f2028" strokeWidth="2" />
      <rect x="15" y="1" width="50" height="4" fill="#78829a" opacity="0.6" />
      <rect x="15" y="75" width="50" height="4" fill="#78829a" opacity="0.6" />

      {/* Button collar */}
      <circle cx="40" cy="40" r="22" fill="#1b1e25" stroke="#3c4252" strokeWidth="2" />

      {/* The actual button plunger */}
      <circle
        cx="40"
        cy="40"
        r={isPressed ? 15 : 18}
        fill={hasCom ? 'url(#btnCharcoalGrad)' : 'url(#btnNOGrad)'}
        stroke={isPressed ? '#166534' : '#22c55e'}
        strokeWidth="2.5"
        filter={isPressed ? 'none' : 'drop-shadow(0 4px 6px rgba(0,0,0,0.4))'}
        style={{ transition: 'all 0.1s ease' }}
      />

      {hasCom ? (
        <g>
          {/* C (COM) lead */}
          <path d="M10 40 L25 40" stroke="#78829a" strokeWidth="2.5" strokeLinecap="round" />
          {/* NC lead */}
          <path d="M55 25 L70 25" stroke="#78829a" strokeWidth="2.5" strokeLinecap="round" />
          {/* NO lead */}
          <path d="M55 55 L70 55" stroke="#78829a" strokeWidth="2.5" strokeLinecap="round" />

          {/* Contact points */}
          <circle cx="25" cy="40" r="2.5" fill="#f8fafc" stroke="#334155" strokeWidth="1" />
          <circle cx="55" cy="25" r="2.5" fill="#f8fafc" stroke="#334155" strokeWidth="1" />
          <circle cx="55" cy="55" r="2.5" fill="#f8fafc" stroke="#334155" strokeWidth="1" />

          {isPressed ? (
            // Connected to NO
            <g>
              <line x1="25" y1="40" x2="55" y2="55" stroke="#22c55e" strokeWidth="3" strokeLinecap="round" />
              <line x1="25" y1="40" x2="55" y2="25" stroke="#4b5563" strokeWidth="1.5" strokeDasharray="2,2" opacity="0.4" />
            </g>
          ) : (
            // Connected to NC
            <g>
              <line x1="25" y1="40" x2="55" y2="25" stroke="#22c55e" strokeWidth="3" strokeLinecap="round" />
              <line x1="25" y1="40" x2="55" y2="55" stroke={hasVoltage ? "#fbbf24" : "#4b5563"} strokeWidth="1.5" strokeDasharray="2,2" opacity="0.4" />
            </g>
          )}
        </g>
      ) : (
        <g>
          {/* Original SPST NO Button visuals */}
          <path d="M10 40 L25 40 M55 40 L70 40" stroke="#78829a" strokeWidth="2.5" strokeLinecap="round" />
          {isPressed ? (
            <path d="M25 40 L55 40" stroke="#22c55e" strokeWidth="3" strokeLinecap="round" />
          ) : (
            <g>
              <line x1="25" y1="40" x2="52" y2="28" stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round" />
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
          )}
          <circle cx="25" cy="40" r="2.5" fill="#f8fafc" stroke="#334155" strokeWidth="1" />
          <circle cx="55" cy="40" r="2.5" fill="#f8fafc" stroke="#334155" strokeWidth="1" />
        </g>
      )}

      {/* Text label */}
      <text x="40" y="93" fill="#cbd5e1" fontSize="10" fontWeight="bold" textAnchor="middle">
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

  const handlePointerDown = (e: React.PointerEvent) => {
    e.stopPropagation();
    pressButton(component.id, !isPressed);
  };

  // Determine voltage presence at switch terminals
  const inKey = getTerminalKey(component.id, 'in');
  const outKey = getTerminalKey(component.id, 'out');
  const hasVoltage = isRunning && (nodeVoltages[inKey] > 0 || nodeVoltages[outKey] > 0);

  return (
    <g 
      transform="translate(-40, -40)"
      className="cursor-pointer select-none"
      onPointerDown={handlePointerDown}
    >
      {/* DIN Rail mounting plate */}
      <rect x="5" y="5" width="70" height="70" rx="4" fill="#2d303a" stroke="#1f2028" strokeWidth="2" />
      <rect x="15" y="1" width="50" height="4" fill="#78829a" opacity="0.6" />
      <rect x="15" y="75" width="50" height="4" fill="#78829a" opacity="0.6" />

      {/* Button collar */}
      <circle cx="40" cy="40" r="22" fill="#1b1e25" stroke="#3c4252" strokeWidth="2" />

      {/* The actual button plunger */}
      <circle
        cx="40"
        cy="40"
        r={isPressed ? 15 : 18}
        fill="url(#btnNCGrad)"
        stroke={isPressed ? '#991b1b' : '#ef4444'}
        strokeWidth="2.5"
        filter={isPressed ? 'none' : 'drop-shadow(0 4px 6px rgba(0,0,0,0.4))'}
        style={{ transition: 'all 0.1s ease' }}
      />

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

  const handleLeftDown = (e: React.PointerEvent) => {
    e.stopPropagation();
    // @ts-ignore
    e.currentTarget.setPointerCapture(e.pointerId);
    setComponentState(component.id, 'toggled', 'left');
    soundManager.playClick();
  };

  const handleRightDown = (e: React.PointerEvent) => {
    e.stopPropagation();
    // @ts-ignore
    e.currentTarget.setPointerCapture(e.pointerId);
    setComponentState(component.id, 'toggled', 'right');
    soundManager.playClick();
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    e.stopPropagation();
    setComponentState(component.id, 'toggled', 'off');
    soundManager.playClick();
  };

  return (
    <g 
      transform="translate(-45, -45)" 
      className="select-none"
    >
      {/* Outer Housing */}
      <rect x="5" y="5" width="80" height="80" rx="8" fill="#18181b" stroke="#3f3f46" strokeWidth="2" />
      <rect x="18" y="1" width="54" height="4" fill="#71717a" opacity="0.6" />
      <rect x="18" y="85" width="54" height="4" fill="#71717a" opacity="0.6" />

      {/* Switch cavity bezel */}
      <rect x="15" y="15" width="60" height="60" rx="4" fill="#09090b" stroke="#27272a" strokeWidth="1.5" />

      {/* Rocker Toggle Mechanism */}
      {toggled === 'left' ? (
        // Pressed Left (Left side is sunken/darker, Right side is raised/lighter casting shadow)
        <g>
          {/* Left sunken side */}
          <rect x="18" y="18" width="27" height="54" fill="#18181b" rx="2" />
          {/* Right raised side */}
          <rect x="45" y="16" width="27" height="58" fill="#3f3f46" rx="2" style={{ filter: 'drop-shadow(-3px 0px 4px rgba(0,0,0,0.6))' }} />
        </g>
      ) : toggled === 'right' ? (
        // Pressed Right (Right side is sunken/darker, Left side is raised/lighter casting shadow)
        <g>
          {/* Right sunken side */}
          <rect x="45" y="18" width="27" height="54" fill="#18181b" rx="2" />
          {/* Left raised side */}
          <rect x="18" y="16" width="27" height="58" fill="#3f3f46" rx="2" style={{ filter: 'drop-shadow(3px 0px 4px rgba(0,0,0,0.6))' }} />
        </g>
      ) : (
        // Balanced (Center OFF - Flat level switch)
        <rect x="18" y="17" width="54" height="56" fill="#27272a" rx="2" style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.4))' }} />
      )}

      {/* Triangle Arrow Markings */}
      {/* Left Arrow */}
      <polygon 
        points="26,45 34,40 34,50" 
        fill={toggled === 'left' ? '#ffffff' : '#a1a1aa'} 
        style={{ pointerEvents: 'none', transition: 'fill 0.1s' }} 
      />
      {/* Center OFF circle */}
      <circle 
        cx="45" 
        cy="45" 
        r="4.5" 
        fill="none" 
        stroke={toggled === 'off' ? '#ffffff' : '#a1a1aa'} 
        strokeWidth="2" 
        style={{ pointerEvents: 'none', transition: 'stroke 0.1s' }} 
      />
      {/* Right Arrow */}
      <polygon 
        points="64,45 56,40 56,50" 
        fill={toggled === 'right' ? '#ffffff' : '#a1a1aa'} 
        style={{ pointerEvents: 'none', transition: 'fill 0.1s' }} 
      />

      {/* Interactive Transparent Hitboxes for pointer clicks */}
      {/* Left side click target */}
      <rect 
        x="15" 
        y="15" 
        width="30" 
        height="60" 
        fill="transparent" 
        className="cursor-pointer" 
        onPointerDown={handleLeftDown}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
      />
      {/* Right side click target */}
      <rect 
        x="45" 
        y="15" 
        width="30" 
        height="60" 
        fill="transparent" 
        className="cursor-pointer" 
        onPointerDown={handleRightDown}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
      />

      {/* Text label underneath */}
      <text x="45" y="102" fill="#cbd5e1" fontSize="9" fontWeight="bold" textAnchor="middle" fontFamily="monospace">
        {component.label}
      </text>
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

  // Determine voltage presence at switch input
  const inKey = getTerminalKey(component.id, 'com');
  const hasVoltage = isRunning && nodeVoltages[inKey] > 0;

  return (
    <g 
      transform="translate(-45, -45)" 
      className="select-none cursor-pointer"
      onPointerDown={handlePointerDown}
    >
      {/* Outer Housing */}
      <rect x="5" y="5" width="80" height="80" rx="8" fill="#18181b" stroke="#3f3f46" strokeWidth="2" />
      <rect x="18" y="1" width="54" height="4" fill="#71717a" opacity="0.6" />
      <rect x="18" y="85" width="54" height="4" fill="#71717a" opacity="0.6" />

      {/* Switch cavity bezel */}
      <rect x="15" y="15" width="60" height="60" rx="4" fill="#09090b" stroke="#27272a" strokeWidth="1.5" />

      {/* Rocker Toggle Mechanism */}
      {!isToggled ? (
        // Position A - Left side raised, Right side sunken (NC active)
        <g>
          {/* Right sunken side */}
          <rect x="45" y="18" width="27" height="54" fill="#18181b" rx="2" />
          {/* Left raised side */}
          <rect x="18" y="16" width="27" height="58" fill="#3f3f46" rx="2" style={{ filter: 'drop-shadow(3px 0px 4px rgba(0,0,0,0.6))' }} />
        </g>
      ) : (
        // Position B - Right side raised, Left side sunken (NO active)
        <g>
          {/* Left sunken side */}
          <rect x="18" y="18" width="27" height="54" fill="#18181b" rx="2" />
          {/* Right raised side */}
          <rect x="45" y="16" width="27" height="58" fill="#3f3f46" rx="2" style={{ filter: 'drop-shadow(-3px 0px 4px rgba(0,0,0,0.6))' }} />
        </g>
      )}

      {/* Schematic overlay inside (X=10 to X=80) */}
      <line x1="10" y1="45" x2="25" y2="45" stroke="#78829a" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="55" y1="30" x2="80" y2="30" stroke="#78829a" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="55" y1="60" x2="80" y2="60" stroke="#78829a" strokeWidth="2.5" strokeLinecap="round" />

      {/* Toggle contact line */}
      {!isToggled ? (
        <g>
          <line x1="25" y1="45" x2="55" y2="30" stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="25" y1="45" x2="55" y2="60" stroke={hasVoltage ? "#fbbf24" : "#4b5563"} strokeWidth="1.5" strokeDasharray="2,2" opacity="0.4" />
        </g>
      ) : (
        <g>
          <line x1="25" y1="45" x2="55" y2="60" stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="25" y1="45" x2="55" y2="30" stroke={hasVoltage ? "#fbbf24" : "#4b5563"} strokeWidth="1.5" strokeDasharray="2,2" opacity="0.4" />
        </g>
      )}

      <circle cx="25" cy="45" r="2.5" fill="#f8fafc" stroke="#334155" strokeWidth="1" />
      <circle cx="55" cy="30" r="2.5" fill="#f8fafc" stroke="#334155" strokeWidth="1" />
      <circle cx="55" cy="60" r="2.5" fill="#f8fafc" stroke="#334155" strokeWidth="1" />

      {/* Label */}
      <text x="45" y="103" fill="#cbd5e1" fontSize="10" fontWeight="bold" textAnchor="middle">
        {component.label}
      </text>
    </g>
  );
};
