import React from 'react';
import type { CircuitComponent } from '../../../types/game';

interface ComponentProps {
  component: CircuitComponent;
}

export const Battery: React.FC<ComponentProps> = () => {
  return (
    <g transform="translate(-60, -40)">
      {/* Battery body */}
      <rect
        x="0"
        y="15"
        width="120"
        height="60"
        rx="6"
        fill="url(#batteryGrad)"
        stroke="#1e293b"
        strokeWidth="3"
        filter="drop-shadow(0 4px 6px rgba(0,0,0,0.3))"
      />
      {/* Top terminals bases */}
      <rect x="20" y="5" width="20" height="10" rx="2" fill="#ef4444" stroke="#1e293b" strokeWidth="2" />
      <rect x="80" y="5" width="20" height="10" rx="2" fill="#1e293b" stroke="#0f172a" strokeWidth="2" />

      {/* Label and polarity marks */}
      <text x="30" y="32" fill="#f8fafc" fontSize="12" fontWeight="bold" textAnchor="middle">+</text>
      <text x="90" y="32" fill="#f8fafc" fontSize="12" fontWeight="bold" textAnchor="middle">-</text>
      
      <text x="60" y="55" fill="#94a3b8" fontSize="10" fontWeight="bold" textAnchor="middle" letterSpacing="1">
        12V BATTERY
      </text>

      {/* Industrial Gradients Definition (should be declared once in Workspace SVG defs, but we will reference them) */}
      <defs>
        <linearGradient id="batteryGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#1e293b" />
          <stop offset="50%" stopColor="#334155" />
          <stop offset="100%" stopColor="#0f172a" />
        </linearGradient>
      </defs>
    </g>
  );
};

export const PowerSupply: React.FC<ComponentProps> = ({ component }) => {
  return (
    <g transform="translate(-75, -50)">
      {/* Heavy industrial metal case */}
      <rect
        x="0"
        y="0"
        width="150"
        height="100"
        rx="8"
        fill="url(#psuGrad)"
        stroke="#27272a"
        strokeWidth="3"
        filter="drop-shadow(0 6px 10px rgba(0,0,0,0.4))"
      />

      {/* Vent grills */}
      <line x1="20" y1="20" x2="130" y2="20" stroke="#09090b" strokeWidth="3" strokeDasharray="4,4" />
      <line x1="20" y1="30" x2="130" y2="30" stroke="#09090b" strokeWidth="3" strokeDasharray="4,4" />

      {/* Details: LED status indicator */}
      <circle cx="20" cy="50" r="4" fill="#22c55e" className="animate-led-blink" filter="drop-shadow(0 0 4px #22c55e)" />
      <text x="30" y="53" fill="#a1a1aa" fontSize="8" fontWeight="bold">DC OK</text>

      <text x="75" y="70" fill="#f4f4f5" fontSize="11" fontWeight="bold" textAnchor="middle" letterSpacing="1">
        24V DC POWER SUPPLY
      </text>

      <text x="35" y="93" fill="#ef4444" fontSize="10" fontWeight="bold" textAnchor="middle">+</text>
      <text x="115" y="93" fill="#3b82f6" fontSize="10" fontWeight="bold" textAnchor="middle">-</text>
      
      {/* Check if AC ground is present */}
      {component.terminals.some(t => t.id === 'gnd') && (
        <text x="75" y="93" fill="#22c55e" fontSize="9" fontWeight="bold" textAnchor="middle">PE</text>
      )}

      <defs>
        <linearGradient id="psuGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#3f3f46" />
          <stop offset="60%" stopColor="#27272a" />
          <stop offset="100%" stopColor="#18181b" />
        </linearGradient>
      </defs>
    </g>
  );
};
