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

  // K1 real proportions: 140mm tall × 44mm wide. Scale: 44px wide × 140px tall
  // Center the group so terminals land correctly
  return (
    <g transform="translate(-22, -70)" className="select-none">
      <defs>
        {/* Gloss black polycarbonate body */}
        <linearGradient id="k1Body" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#141414" />
          <stop offset="35%" stopColor="#1e1e1e" />
          <stop offset="60%" stopColor="#282828" />
          <stop offset="100%" stopColor="#0a0a0a" />
        </linearGradient>
        {/* Gloss highlight along left edge */}
        <linearGradient id="k1Gloss" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="rgba(255,255,255,0.07)" />
          <stop offset="15%" stopColor="rgba(255,255,255,0.02)" />
          <stop offset="100%" stopColor="rgba(0,0,0,0)" />
        </linearGradient>
        {/* LED glow when green (access) */}
        <filter id="k1GlowGreen" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
        <filter id="k1GlowBlue" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="2.5" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>

      {/* ── Main housing body (44 × 140px) ── */}
      <rect
        x="0" y="0" width="44" height="140" rx="5"
        fill="url(#k1Body)"
        stroke="#0a0a0a"
        strokeWidth="1.5"
        filter="drop-shadow(2px 4px 10px rgba(0,0,0,0.7))"
      />

      {/* Gloss sheen overlay left edge */}
      <rect x="0" y="0" width="44" height="140" rx="5" fill="url(#k1Gloss)" />

      {/* Subtle top bevel line */}
      <line x1="4" y1="1" x2="40" y2="1" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
      {/* Subtle bottom shadow line */}
      <line x1="4" y1="139" x2="40" y2="139" stroke="rgba(0,0,0,0.4)" strokeWidth="1" />

      {/* ── CDVI logo area (top 28px) ── */}
      <rect x="4" y="6" width="36" height="20" rx="3" fill="rgba(0,0,0,0.35)" />
      {/* CDVI text logo in brand blue */}
      <text
        x="22" y="19"
        textAnchor="middle"
        fill="#0255a5"
        fontSize="8.5"
        fontWeight="900"
        fontFamily="'Arial Black', sans-serif"
        letterSpacing="1.5"
      >
        CDVI
      </text>

      {/* ── LED STATUS INDICATOR (single pill below logo) ── */}
      {/* LED housing recession */}
      <rect x="14" y="30" width="16" height="5" rx="2.5" fill="#050505" />
      {/* LED light pill */}
      <rect
        x="15" y="30.5" width="14" height="4" rx="2"
        fill={isActive ? '#22c55e' : '#2563eb'}
        filter={isActive ? 'url(#k1GlowGreen)' : 'url(#k1GlowBlue)'}
        style={{ transition: 'fill 0.3s ease' }}
        className={isActive ? '' : 'animate-pulse'}
      />

      {/* ── KRYPTO series label ── */}
      <text
        x="22" y="44"
        textAnchor="middle"
        fill="#3a3a3a"
        fontSize="5"
        fontWeight="700"
        fontFamily="monospace"
        letterSpacing="0.5"
      >
        KRYPTO K1
      </text>

      {/* ── Scan / RF zone — interactive area (center of reader) ── */}
      <g
        className="cursor-pointer"
        onPointerDown={handleScanPointerDown}
        onPointerUp={handleScanPointerUp}
      >
        {/* Recessed dark scan panel */}
        <rect x="5" y="48" width="34" height="58" rx="4" fill="#080808" stroke="#1a1a1a" strokeWidth="0.5" />

        {/* MIFARE / contactless symbol — 3 concentric arcs */}
        {/* Outer arc */}
        <path
          d="M 10 77 A 12 12 0 0 1 34 77"
          fill="none"
          stroke={isActive ? '#22c55e' : '#2a2a2a'}
          strokeWidth="2"
          strokeLinecap="round"
          style={{ transition: 'stroke 0.3s ease' }}
        />
        {/* Middle arc */}
        <path
          d="M 13 77 A 9 9 0 0 1 31 77"
          fill="none"
          stroke={isActive ? '#16a34a' : '#222222'}
          strokeWidth="2"
          strokeLinecap="round"
          style={{ transition: 'stroke 0.3s ease' }}
        />
        {/* Inner arc */}
        <path
          d="M 16 77 A 6 6 0 0 1 28 77"
          fill="none"
          stroke={isActive ? '#15803d' : '#1c1c1c'}
          strokeWidth="2"
          strokeLinecap="round"
          style={{ transition: 'stroke 0.3s ease' }}
        />
        {/* Center dot */}
        <circle
          cx="22" cy="77" r="2.5"
          fill={isActive ? '#22c55e' : '#2a2a2a'}
          style={{ transition: 'fill 0.3s ease' }}
        />

        {/* Tap hint text */}
        <text
          x="22" y="97"
          textAnchor="middle"
          fill={isActive ? '#22c55e' : '#2a2a2a'}
          fontSize="5"
          fontWeight="700"
          fontFamily="monospace"
          letterSpacing="0.5"
          style={{ transition: 'fill 0.3s ease' }}
        >
          {isActive ? '✓ ACCESS' : 'TAP CARD'}
        </text>
      </g>

      {/* ── IP65 / IK10 rating badge (bottom of body) ── */}
      <rect x="5" y="110" width="34" height="14" rx="2" fill="#060606" />
      <text x="22" y="116" textAnchor="middle" fill="#1e3a5f" fontSize="4.5" fontWeight="700" fontFamily="monospace" letterSpacing="0.3">IP65 · IK10</text>
      <text x="22" y="122" textAnchor="middle" fill="#1e3a5f" fontSize="4" fontFamily="monospace">13.56 MHz</text>

      {/* ── Bottom mount screw detail ── */}
      <circle cx="22" cy="133" r="3.5" fill="#0a0a0a" stroke="#1a1a1a" strokeWidth="1" />
      <line x1="19.5" y1="133" x2="24.5" y2="133" stroke="#222" strokeWidth="0.8" />
      <line x1="22" y1="130.5" x2="22" y2="135.5" stroke="#222" strokeWidth="0.8" />

      {/* ── Animated card swipe overlay when active ── */}
      {isActive && (
        <g className="animate-pulse" transform="translate(-12, 52)">
          {/* CDVI credential card */}
          <rect x="0" y="0" width="54" height="36" rx="3"
            fill="#ffffff"
            stroke="#0255a5"
            strokeWidth="1.5"
            filter="drop-shadow(0 4px 12px rgba(0,0,0,0.6))"
          />
          {/* Blue header bar */}
          <rect x="0" y="0" width="54" height="9" rx="2" fill="#0255a5" />
          <text x="27" y="7" fill="white" fontSize="4.5" fontWeight="900" textAnchor="middle" fontFamily="sans-serif">CDVI SECURE ACCESS</text>
          {/* Contactless chip icon */}
          <rect x="6" y="14" width="9" height="7" rx="1" fill="#e2c97a" stroke="#c9a84c" strokeWidth="0.5" />
          <line x1="7" y1="15.5" x2="14" y2="15.5" stroke="#a07830" strokeWidth="0.4"/>
          <line x1="7" y1="17" x2="14" y2="17" stroke="#a07830" strokeWidth="0.4"/>
          <line x1="7" y1="18.5" x2="14" y2="18.5" stroke="#a07830" strokeWidth="0.4"/>
          <line x1="7" y1="20" x2="14" y2="20" stroke="#a07830" strokeWidth="0.4"/>
          {/* Card number */}
          <text x="22" y="19" fill="#0a0a0a" fontSize="4" fontFamily="monospace">4892 A7C3</text>
          {/* Cardholder name */}
          <text x="6" y="29" fill="#374151" fontSize="4.5" fontFamily="sans-serif" fontWeight="700">AUTHORIZED</text>
          {/* CDVI brand */}
          <text x="48" y="29" fill="#0255a5" fontSize="6.5" fontWeight="900" textAnchor="end" fontFamily="sans-serif">CDVI</text>
        </g>
      )}

      {/* ── Component label below body ── */}
      <text x="22" y="153" fill="#cbd5e1" fontSize="10" fontWeight="bold" textAnchor="middle">
        {component.label}
      </text>
    </g>
  );
};

