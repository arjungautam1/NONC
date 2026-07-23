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

      {/* Blue PCB Board */}
      <rect x="8" y="8" width="134" height="84" rx="3" fill="#1e3a8a" stroke="#2563eb" strokeWidth="1.2" />

      {/* PCB circuit traces (decorative blue lines) */}
      <g stroke="#3b82f6" strokeWidth="0.8" opacity="0.35" fill="none">
        <path d="M 15 20 H 130 V 60 H 15 Z" />
        <path d="M 20 25 L 40 45" />
        <path d="M 120 25 L 100 45" />
        <circle cx="50" cy="30" r="1.5" />
        <circle cx="90" cy="30" r="1.5" />
      </g>

      {/* Cylindrical Capacitor */}
      <rect x="18" y="14" width="14" height="26" rx="2" fill="#1e293b" stroke="#475569" strokeWidth="1" />
      <rect x="18" y="14" width="14" height="4" fill="#64748b" />
      <line x1="25" y1="14" x2="25" y2="8" stroke="#cbd5e1" strokeWidth="1.5" />

      {/* Orange Ceramic Disc Capacitor */}
      <circle cx="38" cy="20" r="3.5" fill="#ea580c" stroke="#c2410c" strokeWidth="0.8" />
      <line x1="38" y1="23.5" x2="38" y2="28" stroke="#cbd5e1" strokeWidth="1" />

      {/* Resistor 1 */}
      <g transform="translate(102, 38)">
        <line x1="-10" y1="0" x2="10" y2="0" stroke="#94a3b8" strokeWidth="0.8" />
        <rect x="-5" y="-1.8" width="10" height="3.6" rx="1" fill="#fed7aa" stroke="#ea580c" strokeWidth="0.5" />
        <line x1="-2" y1="-1.8" x2="-2" y2="1.8" stroke="#b91c1c" strokeWidth="0.8" />
        <line x1="0" y1="-1.8" x2="0" y2="1.8" stroke="#b91c1c" strokeWidth="0.8" />
        <line x1="2" y1="-1.8" x2="2" y2="1.8" stroke="#ca8a04" strokeWidth="0.8" />
      </g>

      {/* Resistor 2 */}
      <g transform="translate(108, 48)">
        <line x1="-10" y1="0" x2="10" y2="0" stroke="#94a3b8" strokeWidth="0.8" />
        <rect x="-5" y="-1.8" width="10" height="3.6" rx="1" fill="#fed7aa" stroke="#ea580c" strokeWidth="0.5" />
        <line x1="-2" y1="-1.8" x2="-2" y2="1.8" stroke="#059669" strokeWidth="0.8" />
        <line x1="0" y1="-1.8" x2="0" y2="1.8" stroke="#d97706" strokeWidth="0.8" />
        <line x1="2" y1="-1.8" x2="2" y2="1.8" stroke="#ca8a04" strokeWidth="0.8" />
      </g>

      {/* Cylindrical Power Capacitor replacing T1 */}
      <g transform="translate(68, 30)">
        <rect x="-8" y="-14" width="16" height="28" rx="2" fill="#020617" opacity="0.4" />
        <rect x="-8" y="-14" width="16" height="28" rx="2" fill="#1e293b" stroke="#475569" strokeWidth="1" />
        <rect x="-3" y="-14" width="4" height="28" fill="#eab308" opacity="0.9" />
        <rect x="-8" y="-14" width="16" height="4" fill="#94a3b8" />
        <text x="12" y="4" fill="#cbd5e1" fontSize="6" fontWeight="bold" fontFamily="monospace">C1</text>
      </g>

      {/* Heatsink element */}
      <rect x="100" y="14" width="22" height="18" fill="#334155" />
      <rect x="102" y="10" width="2" height="4" fill="#cbd5e1" />
      <rect x="109" y="10" width="2" height="4" fill="#cbd5e1" />
      <rect x="116" y="10" width="2" height="4" fill="#cbd5e1" />

      {/* LED indicators */}
      {/* Green DC OK LED */}
      <circle
        cx="35"
        cy="58"
        r="3.5"
        fill={isActive ? '#22c55e' : '#1e293b'}
        stroke={isActive ? '#4ade80' : '#475569'}
        strokeWidth="0.8"
        className={isActive ? 'animate-pulse' : ''}
        style={{ filter: isActive ? 'drop-shadow(0 0 3px #22c55e)' : 'none' }}
      />
      <text x="44" y="61" fill="#e4e4e7" fontSize="7" fontWeight="bold" fontFamily="monospace">DC OK</text>

      {/* Red AC present LED */}
      <circle
        cx="95"
        cy="58"
        r="3.5"
        fill={isActive ? '#ef4444' : '#1e293b'}
        stroke={isActive ? '#f87171' : '#475569'}
        strokeWidth="0.8"
        style={{ filter: isActive ? 'drop-shadow(0 0 3px #ef4444)' : 'none' }}
      />
      <text x="104" y="61" fill="#e4e4e7" fontSize="7" fontWeight="bold" fontFamily="monospace">AC ON</text>

      {/* Cabinet identification, kept clear of the terminal legends. */}
      <text x="75" y="70" fill="#facc15" fontSize="6.5" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif" letterSpacing="0.4">
        ALTRONIX AL600
      </text>

      {/*
        One aligned terminal strip. The interactive terminal rings rendered by
        Workspace sit directly over these screws, so there is no doubled contact
        or repeated label at normal lab zoom.
      */}
      {component.terminals.map((term) => {
        const xPos = 75 + term.x;
        const terminalCenterY = 93;
        
        let labelColor = '#cbd5e1';
        if (term.id === 'pos' || term.id === 'dc_pos') labelColor = '#f87171';
        else if (term.id === 'neg' || term.id === 'dc_neg') labelColor = '#60a5fa';
        else if (term.id === 'gnd') labelColor = '#4ade80';
        else if (term.id.startsWith('ac')) labelColor = '#facc15';

        const terminalLegend =
          term.id === 'ac1' ? 'AC1' :
          term.id === 'ac2' ? 'AC2' :
          term.id === 'pos' || term.id === 'dc_pos' ? '+' :
          term.id === 'neg' || term.id === 'dc_neg' ? '−' :
          term.name;

        return (
          <g key={term.id}>
            <text
              x={xPos}
              y="80"
              fill={labelColor}
              fontSize="7.5"
              fontWeight="900"
              fontFamily="monospace"
              textAnchor="middle"
            >
              {terminalLegend}
            </text>

            {/* Pocket behind the terminal screw */}
            <rect x={xPos - 10} y="83" width="20" height="17" fill="#111827" rx="2" stroke="#64748b" strokeWidth="0.8" />

            {/* Terminal screw */}
            <g transform={`translate(${xPos}, ${terminalCenterY})`}>
              <circle cx="0" cy="0" r="4.5" fill="url(#silverGrad)" stroke="#64748b" strokeWidth="0.5" />
              <line x1="-3" y1="-1" x2="3" y2="1" stroke="#334155" strokeWidth="0.8" />
              <line x1="-1" y1="-3" x2="1" y2="3" stroke="#334155" strokeWidth="0.8" />
            </g>
          </g>
        );
      })}

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
