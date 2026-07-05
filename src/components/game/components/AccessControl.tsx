import React from 'react';
import type { CircuitComponent } from '../../../types/game';
import { useGameStore } from '../../../store/useGameStore';

interface ComponentProps {
  component: CircuitComponent;
}

export const Maglock: React.FC<ComponentProps> = ({ component }) => {
  // A maglock is active (locked) when energized, and unlocked when de-energized
  const isLocked = component.state.active || false;

  return (
    <g transform="translate(-60, -40)">
      {/* Door frame mounting header */}
      <rect x="0" y="5" width="120" height="20" fill="#3f3f46" stroke="#27272a" strokeWidth="1.5" />
      <line x1="20" y1="5" x2="20" y2="25" stroke="#18181b" strokeWidth="1" />
      <line x1="100" y1="5" x2="100" y2="25" stroke="#18181b" strokeWidth="1" />

      {/* Electromagnetic lock body */}
      <rect
        x="10"
        y="25"
        width="65"
        height="35"
        fill="url(#maglockGrad)"
        stroke="#18181b"
        strokeWidth="2"
        filter="drop-shadow(0 4px 6px rgba(0,0,0,0.3))"
      />

      {/* Dual copper coils core details inside magnet */}
      <rect x="20" y="32" width="12" height="22" fill="#b45309" stroke="#78350f" strokeWidth="1" />
      <rect x="43" y="32" width="12" height="22" fill="#b45309" stroke="#78350f" strokeWidth="1" />

      {/* Armature strike plate (the metal plate attached to door) */}
      {/* If locked: snapped tight. If unlocked: slightly open (moved to right) */}
      <g 
        transform={`translate(${isLocked ? 0 : 12}, 0)`} 
        style={{ transition: 'transform 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)' }}
      >
        <rect
          x="80"
          y="27"
          width="15"
          height="31"
          rx="2"
          fill="url(#metalPlate)"
          stroke="#3f3f46"
          strokeWidth="1.5"
        />
        {/* Rubber washer bolt mount */}
        <circle cx="87.5" cy="42.5" r="3.5" fill="#18181b" />
      </g>

      {/* Magnetic lock bonding lines when active */}
      {isLocked ? (
        <g>
          <line x1="75" y1="32" x2="80" y2="32" stroke="#f97316" strokeWidth="2.5" strokeDasharray="2,2" className="animate-pulse" />
          <line x1="75" y1="42" x2="80" y2="42" stroke="#f97316" strokeWidth="2.5" strokeDasharray="2,2" className="animate-pulse" />
          <line x1="75" y1="52" x2="80" y2="52" stroke="#f97316" strokeWidth="2.5" strokeDasharray="2,2" className="animate-pulse" />
          <rect x="25" y="65" width="70" height="12" rx="2" fill="#7f1d1d" />
          <text x="60" y="74" fill="#fca5a5" fontSize="8" fontWeight="bold" textAnchor="middle" letterSpacing="1">
            DOOR LOCKED
          </text>
        </g>
      ) : (
        <g>
          <rect x="25" y="65" width="70" height="12" rx="2" fill="#14532d" />
          <text x="60" y="74" fill="#4ade80" fontSize="8" fontWeight="bold" textAnchor="middle" letterSpacing="1">
            DOOR UNLOCKED
          </text>
        </g>
      )}

      {/* Tag label */}
      <text x="60" y="93" fill="#cbd5e1" fontSize="10" fontWeight="bold" textAnchor="middle">
        {component.label}
      </text>

      <defs>
        <linearGradient id="maglockGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#52525b" />
          <stop offset="50%" stopColor="#3f3f46" />
          <stop offset="100%" stopColor="#18181b" />
        </linearGradient>
        <linearGradient id="metalPlate" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#94a3b8" />
          <stop offset="50%" stopColor="#cbd5e1" />
          <stop offset="100%" stopColor="#475569" />
        </linearGradient>
      </defs>
    </g>
  );
};

export const CardReader: React.FC<ComponentProps> = ({ component }) => {
  const triggerCardReader = useGameStore(state => state.triggerCardReader);
  const isActive = component.state.active || false;

  const handleScanPointerDown = (e: React.PointerEvent) => {
    e.stopPropagation();
  };

  const handleScanPointerUp = (e: React.PointerEvent) => {
    e.stopPropagation();
    triggerCardReader(component.id);
  };

  return (
    <g 
      transform="translate(-40, -50)"
      className="select-none"
    >
      {/* Modern mullion reader casing */}
      <rect
        x="0"
        y="0"
        width="80"
        height="100"
        rx="8"
        fill="#18181b"
        stroke="#27272a"
        strokeWidth="2.5"
        filter="drop-shadow(0 4px 8px rgba(0,0,0,0.5))"
      />

      {/* Interactive scanning zone */}
      <g
        className="cursor-pointer"
        onPointerDown={handleScanPointerDown}
        onPointerUp={handleScanPointerUp}
      >
        {/* Dark glass sensor panel */}
        <rect x="8" y="8" width="64" height="84" rx="4" fill="#09090b" />

        {/* CDVI branding label */}
        <text x="40" y="16" textAnchor="middle" fill="#0255a5" fontSize="6.5" fontWeight="black" letterSpacing="0.05em" fontFamily="sans-serif">
          CDVI
        </text>

        {/* LED light bar */}
        {/* Red when idle, green when scanning/active */}
        <rect
          x="20"
          y="22"
          width="40"
          height="6"
          rx="3"
          fill={isActive ? '#22c55e' : '#ef4444'}
          filter={isActive ? 'drop-shadow(0 0 6px #22c55e)' : 'drop-shadow(0 0 4px #ef4444)'}
          style={{ transition: 'all 0.2s ease' }}
        />

        {/* Stylized RF antenna emblem */}
        <circle cx="40" cy="56" r="14" fill="none" stroke="#27272a" strokeWidth="2" />
        <path d="M32 56 A8 8 0 0 1 48 56" fill="none" stroke="#3f3f46" strokeWidth="2" strokeLinecap="round" />
        <path d="M36 56 A4 4 0 0 1 44 56" fill="none" stroke="#71717a" strokeWidth="2" strokeLinecap="round" />
        <circle cx="40" cy="56" r="2" fill="#a1a1aa" />

        {/* Instruction hint */}
        <text x="40" y="86" fill="#52525b" fontSize="6.5" fontWeight="bold" textAnchor="middle">
          TAP TO SCAN
        </text>
      </g>

      {/* CDVI PVC Credential Card sliding overlay */}
      {isActive && (
        <g className="animate-pulse" transform="translate(10, 30)">
          {/* Card Body */}
          <rect
            x="-10"
            y="-5"
            width="60"
            height="40"
            rx="3"
            fill="#ffffff"
            stroke="#0255a5"
            strokeWidth="1.5"
            filter="drop-shadow(0 4px 10px rgba(0,0,0,0.5))"
          />
          {/* Blue Accent Header */}
          <rect x="-10" y="-5" width="60" height="8" fill="#0255a5" rx="1.5" />
          <text x="20" y="1" fill="#ffffff" fontSize="5" fontWeight="black" textAnchor="middle" fontFamily="sans-serif">
            CDVI SECURE ACCESS
          </text>
          {/* Contactless symbol */}
          <circle cx="2" cy="18" r="4.5" fill="none" stroke="#0255a5" strokeWidth="1" />
          <circle cx="2" cy="18" r="1.5" fill="#0255a5" />
          {/* Brand logo */}
          <text x="45" y="18" fill="#0255a5" fontSize="7.5" fontWeight="black" textAnchor="end" fontFamily="sans-serif">
            CDVI
          </text>
          {/* Serial number */}
          <text x="-5" y="30" fill="#94a3b8" fontSize="4.5" fontFamily="monospace">ID: 4892A-C</text>
        </g>
      )}

      {/* Tag label */}
      <text x="40" y="113" fill="#cbd5e1" fontSize="10" fontWeight="bold" textAnchor="middle">
        {component.label}
      </text>
    </g>
  );
};
