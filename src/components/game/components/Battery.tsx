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
  const isActive = component.state.active ?? true;
  const hasACTerminals = component.terminals.some(t => t.id === 'ac1') && component.terminals.some(t => t.id === 'ac2');

  return (
    <g transform="translate(-75, -50)">
      {/* Casing / Cabinet Backplate (Light grey metallic chassis) */}
      <rect
        x="0"
        y="0"
        width="150"
        height="100"
        rx="6"
        fill="#f1f5f9"
        stroke="#cbd5e1"
        strokeWidth="2.5"
        filter="drop-shadow(0 6px 12px rgba(0,0,0,0.3))"
      />
      
      {/* Cabinet inside shadow */}
      <rect x="4" y="4" width="142" height="92" rx="4" fill="#0f172a" opacity="0.95" />

      {/* Green PCB Board */}
      <rect x="8" y="8" width="134" height="84" rx="3" fill="#15803d" stroke="#16a34a" strokeWidth="1" />

      {/* PCB circuit traces (decorative lines) */}
      <g stroke="#22c55e" strokeWidth="0.8" opacity="0.3" fill="none">
        <path d="M 15 20 H 130 V 60 H 15 Z" />
        <path d="M 20 25 L 40 45" />
        <path d="M 120 25 L 100 45" />
        <circle cx="50" cy="30" r="1.5" />
        <circle cx="90" cy="30" r="1.5" />
      </g>

      {/* Large capacitor (cylindrical component) */}
      <rect x="20" y="16" width="16" height="30" rx="2" fill="#1e293b" stroke="#475569" strokeWidth="1" />
      <rect x="20" y="16" width="16" height="5" fill="#94a3b8" />
      <line x1="28" y1="16" x2="28" y2="10" stroke="#e2e8f0" strokeWidth="1.5" />

      {/* Transformer block on PCB (Yellow wrapped coil) */}
      <rect x="50" y="14" width="36" height="36" rx="3" fill="#eab308" stroke="#ca8a04" strokeWidth="1.5" />
      <rect x="56" y="20" width="24" height="24" rx="1" fill="#1e293b" />
      <text x="68" y="34" fill="#ca8a04" fontSize="8" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">T1</text>

      {/* Heatsink element */}
      <rect x="100" y="14" width="24" height="20" fill="#334155" />
      <rect x="102" y="10" width="3" height="4" fill="#cbd5e1" />
      <rect x="109" y="10" width="3" height="4" fill="#cbd5e1" />
      <rect x="116" y="10" width="3" height="4" fill="#cbd5e1" />

      {/* LED indicators */}
      {/* Green DC OK LED */}
      <circle
        cx="35"
        cy="61"
        r="3.5"
        fill={isActive ? '#22c55e' : '#1e293b'}
        stroke={isActive ? '#4ade80' : '#475569'}
        strokeWidth="0.8"
        className={isActive ? 'animate-pulse' : ''}
        style={{ filter: isActive ? 'drop-shadow(0 0 3px #22c55e)' : 'none' }}
      />
      <text x="44" y="64" fill="#e4e4e7" fontSize="7" fontWeight="bold" fontFamily="monospace">DC OK</text>

      {/* Red AC present LED */}
      <circle
        cx="95"
        cy="61"
        r="3.5"
        fill={isActive ? '#ef4444' : '#1e293b'}
        stroke={isActive ? '#f87171' : '#475569'}
        strokeWidth="0.8"
        style={{ filter: isActive ? 'drop-shadow(0 0 3px #ef4444)' : 'none' }}
      />
      <text x="104" y="64" fill="#e4e4e7" fontSize="7" fontWeight="bold" fontFamily="monospace">AC ON</text>

      {/* Cabinet identification */}
      <text x="135" y="76" fill="#facc15" fontSize="6.5" fontWeight="bold" textAnchor="end" fontFamily="sans-serif">
        ALTRONIX AL600
      </text>

      {/* Screw terminal strip at the bottom */}
      <rect x="12" y="78" width="126" height="15" fill="#1e293b" rx="2" stroke="#475569" strokeWidth="1" />
      
      {/* Draw 4 screws */}
      {[-45, -15, 15, 45].map((slotX, idx) => {
        const xPos = 75 + slotX;
        return (
          <g key={idx} transform={`translate(${xPos}, 85.5)`}>
            <circle cx="0" cy="0" r="4.5" fill="url(#silverGrad)" stroke="#64748b" strokeWidth="0.5" />
            <line x1="-3" y1="-1" x2="3" y2="1" stroke="#334155" strokeWidth="0.8" />
            <line x1="-1" y1="-3" x2="1" y2="3" stroke="#334155" strokeWidth="0.8" />
          </g>
        );
      })}

      {/* Text labels for terminals */}
      <g fontSize="6.5" fontWeight="900" fill="#cbd5e1" fontFamily="monospace" textAnchor="middle">
        {hasACTerminals ? (
          <>
            <text x="30" y="75">AC</text>
            <text x="60" y="75">AC</text>
            <text x="90" y="75" fill="#ef4444">(+)</text>
            <text x="120" y="75" fill="#60a5fa">(-)</text>
          </>
        ) : (
          <>
            <text x="35" y="75" fill="#ef4444">(+)</text>
            <text x="115" y="75" fill="#60a5fa">(-)</text>
          </>
        )}
      </g>

      <defs>
        {/* Silver screw gradient */}
        <linearGradient id="silverGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#cbd5e1" />
          <stop offset="50%" stopColor="#f8fafc" />
          <stop offset="100%" stopColor="#64748b" />
        </linearGradient>
      </defs>
    </g>
  );
};
