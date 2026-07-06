import React from 'react';
import type { CircuitComponent } from '../../../types/game';
import { useGameStore } from '../../../store/useGameStore';
import { getTerminalKey } from '../../../simulation/circuitSolver';

interface ComponentProps {
  component: CircuitComponent;
}

export const ParkingGate: React.FC<ComponentProps> = ({ component }) => {
  const nodeVoltages = useGameStore(state => state.simulation.nodeVoltages);
  const isRunning = useGameStore(state => state.isRunning);

  const travel = component.state.travel || 0;
  const isOpen = travel >= 100;
  const isClosed = travel <= 0;

  // Calculate terminal voltages
  const posKey = getTerminalKey(component.id, 'pos');
  const negKey = getTerminalKey(component.id, 'neg');
  const vPos = isRunning ? (nodeVoltages[posKey] || 0) : 0;
  const vNeg = isRunning ? (nodeVoltages[negKey] || 0) : 0;

  const isEnergized = vPos > 0 || vNeg > 0;

  // Gate arm rotation angle: 0 degrees (horizontal) to -90 degrees (vertical/up)
  const angle = -(travel / 100) * 90;

  // Stateful animation flag so the car finishes its full drive-through path
  const [isCarDriving, setIsCarDriving] = React.useState(false);

  // Keep references to timeouts so we can manage them across renders safely
  const pressTimeoutRef = React.useRef<any>(null);
  const releaseTimeoutRef = React.useRef<any>(null);
  const animTimeoutRef = React.useRef<any>(null);

  // Trigger the vehicle Loop Detector and car animation when the gate opens (Faster Speeds)
  React.useEffect(() => {
    if (isOpen && !isCarDriving && isRunning) {
      setIsCarDriving(true);

      // Clear any pending timeouts
      if (pressTimeoutRef.current) clearTimeout(pressTimeoutRef.current);
      if (releaseTimeoutRef.current) clearTimeout(releaseTimeoutRef.current);
      if (animTimeoutRef.current) clearTimeout(animTimeoutRef.current);

      // Simulate car driving over the Loop Detector (presses button after 0.5 seconds)
      pressTimeoutRef.current = setTimeout(() => {
        useGameStore.getState().pressButton('btn2', true);
      }, 500);

      // Simulate car clearing the Loop Detector (releases button after 1.0 seconds)
      releaseTimeoutRef.current = setTimeout(() => {
        useGameStore.getState().pressButton('btn2', false);
      }, 1000);

      // Reset the car driving state after the animation finishes (1.5 seconds)
      animTimeoutRef.current = setTimeout(() => {
        setIsCarDriving(false);
      }, 1500);
    }
  }, [isOpen, isRunning, isCarDriving]);

  // Clean up timeouts and ensure the button is released when simulation stops or component unmounts
  React.useEffect(() => {
    if (!isRunning) {
      if (pressTimeoutRef.current) clearTimeout(pressTimeoutRef.current);
      if (releaseTimeoutRef.current) clearTimeout(releaseTimeoutRef.current);
      if (animTimeoutRef.current) clearTimeout(animTimeoutRef.current);
      useGameStore.getState().pressButton('btn2', false);
      setIsCarDriving(false);
    }

    return () => {
      if (pressTimeoutRef.current) clearTimeout(pressTimeoutRef.current);
      if (releaseTimeoutRef.current) clearTimeout(releaseTimeoutRef.current);
      if (animTimeoutRef.current) clearTimeout(animTimeoutRef.current);
    };
  }, [isRunning]);

  return (
    <g transform="translate(0, 0)">
      {/* Dynamic inline styles for the car driving & wheel spin animations (Right to Left) */}
      <style>{`
        @keyframes driveThroughRightToLeft {
          0% { transform: translate(85px, 26px); opacity: 0; }
          15% { transform: translate(75px, 26px); opacity: 1; }
          25% { transform: translate(75px, 26px); opacity: 1; }
          75% { transform: translate(-20px, 26px); opacity: 1; }
          100% { transform: translate(-85px, 26px); opacity: 0; }
        }
        @keyframes wheelSpin {
          from { transform: rotate(0deg); }
          to { transform: rotate(-360deg); }
        }
        .car-animated-rtl {
          animation: driveThroughRightToLeft 1.5s cubic-bezier(0.25, 1, 0.5, 1) forwards;
        }
        .car-waiting-rtl {
          transform: translate(75px, 26px);
          opacity: 1;
        }
        .wheel-spinning {
          animation: wheelSpin 0.15s linear infinite;
        }
      `}</style>

      {/* Premium Outer Card Frame */}
      <rect 
        x="-60" 
        y="-55" 
        width="120" 
        height="110" 
        rx="8" 
        fill="#1e293b" 
        stroke={isEnergized ? '#facc15' : '#334155'} 
        strokeWidth="3" 
        filter="drop-shadow(0 4px 6px rgba(0,0,0,0.35))"
        className="transition-colors duration-300"
      />

      {/* Grid Pattern / Roadway styling */}
      <rect x="-54" y="30" width="108" height="15" fill="#0f172a" rx="2" />
      <line x1="-54" y1="38" x2="54" y2="38" stroke="#cbd5e1" strokeDasharray="4,4" strokeWidth="1" opacity="0.4" />

      {/* Barrier Cabinet Base (Yellow & Black Safety Stripes) */}
      <g transform="translate(-35, 15)">
        <rect x="-16" y="10" width="32" height="8" fill="#eab308" />
        {/* Black warning diagonal stripes */}
        <path d="M-12 18 L-8 10 M-6 18 L-2 10 M0 18 L4 10 M6 18 L10 10" stroke="#1e293b" strokeWidth="2.5" />
      </g>

      {/* Main Cabinet Housing (Premium metallic steel finish) */}
      <rect 
        x="-47" 
        y="-35" 
        width="24" 
        height="60" 
        rx="3" 
        fill="url(#cabinetMetallicGrad)" 
        stroke="#475569" 
        strokeWidth="1.5" 
      />

      {/* LED Display Screen on Cabinet */}
      <rect x="-42" y="-28" width="14" height="10" rx="1" fill="#020617" stroke="#334155" strokeWidth="0.8" />
      <text 
        x="-35" 
        y="-21" 
        fill={isOpen ? '#22c55e' : isClosed ? '#ef4444' : '#eab308'} 
        fontSize="5.5" 
        fontWeight="900" 
        textAnchor="middle" 
        fontFamily="monospace"
        className="animate-pulse"
      >
        {isOpen ? 'OPEN' : isClosed ? 'HOLD' : 'MOVE'}
      </text>

      {/* Connection Terminals Block at bottom */}
      <rect x="-10" y="32" width="56" height="16" rx="3" fill="#0f172a" stroke="#334155" strokeWidth="1" />
      <text x="0" y="43" fill="#64748b" fontSize="7.5" fontWeight="bold" textAnchor="middle">IN</text>
      <text x="32" y="43" fill="#64748b" fontSize="7.5" fontWeight="bold" textAnchor="middle">OUT</text>

      {/* Animated Mini Car (Facing Left, driving Right-to-Left) */}
      <g className={isCarDriving ? 'car-animated-rtl' : 'car-waiting-rtl'}>
        <g transform="scale(-1, 1)">
          {/* Car body */}
          <rect x="-12" y="-8" width="24" height="8" rx="2.5" fill="#3b82f6" stroke="#1d4ed8" strokeWidth="0.8" />
          {/* Cabin */}
          <path d="M-7 -8 L-4 -13 L4 -13 L7 -8 Z" fill="#93c5fd" stroke="#1d4ed8" strokeWidth="0.8" />
          {/* Windows */}
          <path d="M-5 -9 L-3 -12 L0 -12 L0 -9 Z" fill="#e0f2fe" />
          <path d="M1 -9 L1 -12 L3 -12 L5 -9 Z" fill="#e0f2fe" />
          
          {/* Front Wheel with rotating spokes */}
          <g transform="translate(-6, 0)">
            <circle cx="0" cy="0" r="3" fill="#1e293b" stroke="#0f172a" strokeWidth="0.8" />
            <line x1="0" y1="0" x2="2.5" y2="0" stroke="#ffffff" strokeWidth="0.6" className={isCarDriving ? 'wheel-spinning' : ''} style={{ transformOrigin: '0px 0px' }} />
          </g>

          {/* Rear Wheel with rotating spokes */}
          <g transform="translate(6, 0)">
            <circle cx="0" cy="0" r="3" fill="#1e293b" stroke="#0f172a" strokeWidth="0.8" />
            <line x1="0" y1="0" x2="2.5" y2="0" stroke="#ffffff" strokeWidth="0.6" className={isCarDriving ? 'wheel-spinning' : ''} style={{ transformOrigin: '0px 0px' }} />
          </g>

          {/* Headlight */}
          <circle cx="11.2" cy="-4" r="0.8" fill="#fef08a" />
        </g>
      </g>

      {/* Pivot Axis Hub */}
      <circle cx="-35" cy="-5" r="7" fill="#334155" stroke="#1e293b" strokeWidth="1.5" />
      <circle cx="-35" cy="-5" r="3" fill="#64748b" />

      {/* Barrier Gate Arm Group (Rotates based on travel) */}
      <g transform={`translate(-35, -5) rotate(${angle})`}>
        {/* The Gate Arm Visor / Pole */}
        <rect 
          x="0" 
          y="-3.5" 
          width="82" 
          height="7" 
          rx="1" 
          fill="#ffffff" 
          stroke="#cbd5e1" 
          strokeWidth="0.8" 
          filter="drop-shadow(0 2px 3px rgba(0,0,0,0.3))"
        />
        {/* Red warning stripes */}
        <rect x="12" y="-3.1" width="8" height="6.2" fill="#ef4444" />
        <rect x="28" y="-3.1" width="8" height="6.2" fill="#ef4444" />
        <rect x="44" y="-3.1" width="8" height="6.2" fill="#ef4444" />
        <rect x="60" y="-3.1" width="8" height="6.2" fill="#ef4444" />
        
        {/* Tip LED Indicator Light */}
        <circle 
          cx="76" 
          cy="0" 
          r="1.8" 
          fill={isOpen ? '#22c55e' : isClosed ? '#ef4444' : '#eab308'} 
          className="animate-pulse" 
        />
      </g>

      {/* Component Label */}
      <text 
        x="22" 
        y="-20" 
        fill="#cbd5e1" 
        fontSize="9" 
        fontWeight="bold" 
        textAnchor="middle"
      >
        {component.label}
      </text>

      {/* Linear Travel percentage readout */}
      <text 
        x="22" 
        y="-6" 
        fill="#94a3b8" 
        fontSize="7.5" 
        fontWeight="bold" 
        textAnchor="middle" 
        fontFamily="monospace"
      >
        {travel}% OPEN
      </text>

      {/* Definitions for metallic gradient */}
      <defs>
        <linearGradient id="cabinetMetallicGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#475569" />
          <stop offset="30%" stopColor="#94a3b8" />
          <stop offset="70%" stopColor="#64748b" />
          <stop offset="100%" stopColor="#334155" />
        </linearGradient>
      </defs>
    </g>
  );
};
