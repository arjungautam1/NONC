import React from 'react';
import type { CircuitComponent } from '../../../types/game';
import { useGameStore } from '../../../store/useGameStore';
import { getTerminalKey } from '../../../simulation/circuitSolver';

interface ComponentProps {
  component: CircuitComponent;
}

export const Fuse: React.FC<ComponentProps> = ({ component }) => {
  const nodeVoltages = useGameStore(state => state.simulation.nodeVoltages);
  const isRunning = useGameStore(state => state.isRunning);
  
  const isBlown = component.state.blown || false;

  // Determine if voltage reaches the fuse input/output
  const inKey = getTerminalKey(component.id, 'in');
  const outKey = getTerminalKey(component.id, 'out');
  const hasVoltage = isRunning && (nodeVoltages[inKey] > 0 || nodeVoltages[outKey] > 0);

  return (
    <g transform="translate(-45, -30)">
      {/* Heavy base holder */}
      <rect x="0" y="5" width="90" height="50" rx="4" fill="#2d303a" stroke="#1f2028" strokeWidth="2" />
      
      {/* Lead trace lines connecting exactly to terminal circles X=10 and X=80 */}
      <line x1="10" y1="30" x2="20" y2="30" stroke="#78829a" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="70" y1="30" x2="80" y2="30" stroke="#78829a" strokeWidth="2.5" strokeLinecap="round" />

      {/* Left/Right metallic clips */}
      <rect x="10" y="15" width="12" height="30" fill="url(#metalGrad)" stroke="#475569" strokeWidth="1.5" />
      <rect x="68" y="15" width="12" height="30" fill="url(#metalGrad)" stroke="#475569" strokeWidth="1.5" />

      {/* Fuse glass body */}
      <rect x="20" y="20" width="50" height="20" rx="2" fill="url(#fuseGlass)" stroke="#64748b" strokeWidth="1" />

      {/* Silver end caps of the fuse cylinder */}
      <rect x="20" y="20" width="10" height="20" fill="url(#metalGrad)" stroke="#475569" strokeWidth="1" />
      <rect x="60" y="20" width="10" height="20" fill="url(#metalGrad)" stroke="#475569" strokeWidth="1" />

      {/* Internal fuse wire */}
      {isBlown ? (
        <g>
          {/* Melted open gap wire ends */}
          <line x1="30" y1="30" x2="42" y2="29" stroke="#475569" strokeWidth="1.5" />
          <line x1="48" y1="31" x2="60" y2="30" stroke="#475569" strokeWidth="1.5" />
          
          {/* Glowing dotted path representing the open/blown connection gap */}
          <line 
            x1="30" 
            y1="30" 
            x2="60" 
            y2="30" 
            stroke={hasVoltage ? "#fbbf24" : "#475569"} 
            strokeWidth={hasVoltage ? 2.5 : 1.2} 
            strokeDasharray="2,3" 
            filter={hasVoltage ? "url(#yellow-glow)" : "none"}
            opacity={hasVoltage ? 0.95 : 0.3} 
          />
          
          {/* Burnt mark */}
          <circle cx="45" cy="30" r="6" fill="#000000" opacity="0.75" filter="blur(2px)" />
          {/* Red status light */}
          <circle cx="45" cy="30" r="2.5" fill="#ef4444" className="animate-led-blink" />
        </g>
      ) : (
        // Intact fuse wire (wavy pattern)
        <path d="M30 30 Q37 25 45 30 T60 30" fill="none" stroke={isRunning && hasVoltage ? "#fbbf24" : "#f43f5e"} strokeWidth="1.5" />
      )}

      {/* Glass highlights */}
      <path d="M22 22 L58 22" stroke="#ffffff" strokeWidth="1" opacity="0.3" />

      {/* Blown alert text */}
      {isBlown && (
        <text x="45" y="12" fill="#f87171" fontSize="8" fontWeight="bold" textAnchor="middle" letterSpacing="0.5">
          BLOWN
        </text>
      )}

      {/* Label */}
      <text x="45" y="68" fill="#cbd5e1" fontSize="10" fontWeight="bold" textAnchor="middle">
        {component.label}
      </text>

      <defs>
        <linearGradient id="metalGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#e2e8f0" />
          <stop offset="50%" stopColor="#94a3b8" />
          <stop offset="100%" stopColor="#475569" />
        </linearGradient>
        <linearGradient id="fuseGlass" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0.05" />
        </linearGradient>
      </defs>
    </g>
  );
};
