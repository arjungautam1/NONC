import React from 'react';
import type { CircuitComponent } from '../../../types/game';
import { useGameStore } from '../../../store/useGameStore';

interface ComponentProps {
  component: CircuitComponent;
}

export const Maglock: React.FC<ComponentProps> = ({ component }) => {
  const isPowered = component.state.active || false;
  const isFailSecure = component.state.failSecure || false;
  // Fail-safe maglocks lock when powered. Fail-secure locks stay locked without power and unlock when powered.
  const isLocked = isFailSecure ? !isPowered : isPowered;

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
    <g transform="translate(-22, -70)" className="select-none cursor-pointer">
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

      <rect
        x="-8"
        y="-8"
        width="60"
        height="164"
        rx="8"
        fill="transparent"
        pointerEvents="all"
        onPointerDown={handleScanPointerDown}
        onPointerUp={handleScanPointerUp}
      />

      {/* ── Component label below body ── */}
      <text x="22" y="153" fill="#cbd5e1" fontSize="10" fontWeight="bold" textAnchor="middle">
        {component.label}
      </text>
    </g>
  );
};

export const DoorStrike: React.FC<ComponentProps> = ({ component }) => {
  const isPowered = component.state.active || false;
  const isFailSecure = component.state.failSecure || false;
  const isLocked = isFailSecure ? !isPowered : isPowered;

  return (
    <g>
      {/* 1. Left-side prominent matte black contoured housing */}
      <rect
        x="-24"
        y="-46"
        width="14"
        height="92"
        rx="4"
        fill="#18181b"
        stroke="#09090b"
        strokeWidth="1.5"
        filter="drop-shadow(-2px 3px 4px rgba(0,0,0,0.45))"
      />
      {/* Curved inner recess shading to match photo */}
      <rect
        x="-22"
        y="-41"
        width="9"
        height="82"
        rx="3"
        fill="#09090b"
        opacity="0.55"
      />
      <line x1="-24" y1="-25" x2="-10" y2="-25" stroke="#27272a" strokeWidth="0.8" opacity="0.4" />
      <line x1="-24" y1="25" x2="-10" y2="25" stroke="#27272a" strokeWidth="0.8" opacity="0.4" />

      {/* 2. Stainless Steel Faceplate */}
      <rect
        x="-10"
        y="-66"
        width="22"
        height="132"
        rx="1"
        fill="url(#strikePlateGrad)"
        stroke="#475569"
        strokeWidth="1"
        filter="drop-shadow(2px 3px 5px rgba(0,0,0,0.3))"
      />

      {/* Mounting Screw Holes (Top & Bottom) */}
      <circle cx="1" cy="-56" r="3.5" fill="#0f172a" stroke="#475569" strokeWidth="0.5" />
      <circle cx="1" cy="-56" r="2.2" fill="#1e293b" />
      <circle cx="1" cy="56" r="3.5" fill="#0f172a" stroke="#475569" strokeWidth="0.5" />
      <circle cx="1" cy="56" r="2.2" fill="#1e293b" />

      {/* Four Assembly Screws (Stacked on the right of the faceplate) */}
      {/* Upper Screws */}
      <circle cx="1" cy="-34" r="2.4" fill="url(#screwGrad)" stroke="#334155" strokeWidth="0.4" />
      <line x1="-0.5" y1="-34" x2="2.5" y2="-34" stroke="#1e293b" strokeWidth="0.6" />
      <line x1="1" y1="-35.5" x2="1" y2="-32.5" stroke="#1e293b" strokeWidth="0.6" />

      <circle cx="1" cy="-24" r="2.4" fill="url(#screwGrad)" stroke="#334155" strokeWidth="0.4" />
      <line x1="-0.5" y1="-24" x2="2.5" y2="-24" stroke="#1e293b" strokeWidth="0.6" />
      <line x1="1" y1="-25.5" x2="1" y2="-22.5" stroke="#1e293b" strokeWidth="0.6" />

      {/* Lower Screws */}
      <circle cx="1" cy="24" r="2.4" fill="url(#screwGrad)" stroke="#334155" strokeWidth="0.4" />
      <line x1="-0.5" y1="24" x2="2.5" y2="24" stroke="#1e293b" strokeWidth="0.6" />
      <line x1="1" y1="22.5" x2="1" y2="25.5" stroke="#1e293b" strokeWidth="0.6" />

      <circle cx="1" cy="34" r="2.4" fill="url(#screwGrad)" stroke="#334155" strokeWidth="0.4" />
      <line x1="-0.5" y1="34" x2="2.5" y2="34" stroke="#1e293b" strokeWidth="0.6" />
      <line x1="1" y1="32.5" x2="1" y2="35.5" stroke="#1e293b" strokeWidth="0.6" />

      {/* Engraved AR / Adams Rite Logos */}
      <g opacity="0.4" transform="translate(1, 0)">
        {/* Upper AR Logo & text */}
        <polygon points="0,-46 -3.5,-42.5 3.5,-42.5" fill="none" stroke="#64748b" strokeWidth="0.5" />
        <text x="0" y="-41.5" fill="#475569" fontSize="2" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">AR</text>
        <text x="0" y="-44.5" fill="#475569" fontSize="1.8" textAnchor="middle" fontFamily="monospace">ADAMS RITE</text>

        {/* Lower AR Logo & text */}
        <polygon points="0,46 -3.5,42.5 3.5,42.5" fill="none" stroke="#64748b" strokeWidth="0.5" />
        <text x="0" y="47" fill="#475569" fontSize="2" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">AR</text>
        <text x="0" y="41.5" fill="#475569" fontSize="1.8" textAnchor="middle" fontFamily="monospace">ADAMS RITE</text>
      </g>

      {/* Tiny Status Indicator LED on the faceplate */}
      <circle cx="1" cy="-48" r="1.8" fill={isLocked ? "#ef4444" : "#22c55e"} />
      <circle cx="1" cy="-48" r="0.6" fill="#ffffff" opacity="0.8" />
      {isLocked && <circle cx="1" cy="-48" r="3.5" fill="none" stroke="#ef4444" strokeWidth="0.4" opacity="0.5" className="animate-pulse" />}

      {/* 3. Recessed Cavity (Cutout for the latch) */}
      <rect
        x="-10"
        y="-17"
        width="20"
        height="34"
        fill="#09090b"
        stroke="#1c1917"
        strokeWidth="1.2"
      />

      {/* 4. Keeper Latch (Pivoting gate inside cavity) */}
      <g
        transform={isLocked ? "translate(0, 0)" : "translate(-4, 0) scale(0.4, 1)"}
        style={{ transition: 'transform 0.25s cubic-bezier(0.4, 0, 0.2, 1)' }}
      >
        <rect
          x="-9"
          y="-16"
          width="11"
          height="32"
          rx="1"
          fill="url(#keeperGrad)"
          stroke="#44403c"
          strokeWidth="0.8"
        />
        {/* Curved roller lip highlight */}
        <line x1="-7.5" y1="-16" x2="-7.5" y2="16" stroke="#cbd5e1" strokeWidth="0.8" opacity="0.65" />
        <line x1="-1.5" y1="-16" x2="-1.5" y2="16" stroke="#44403c" strokeWidth="0.6" />
      </g>

      {/* Status banner underneath */}
      {isLocked ? (
        <g transform="translate(0, 75)">
          <rect x="-26" y="-6" width="52" height="12" rx="2" fill="#7f1d1d" stroke="#b91c1c" strokeWidth="0.5" />
          <text x="0" y="2.5" fill="#fca5a5" fontSize="7" fontWeight="bold" textAnchor="middle" letterSpacing="0.5" fontFamily="monospace">
            LOCKED
          </text>
        </g>
      ) : (
        <g transform="translate(0, 75)">
          <rect x="-26" y="-6" width="52" height="12" rx="2" fill="#14532d" stroke="#22c55e" strokeWidth="0.5" />
          <text x="0" y="2.5" fill="#4ade80" fontSize="7" fontWeight="bold" textAnchor="middle" letterSpacing="0.5" fontFamily="monospace">
            UNLOCKED
          </text>
        </g>
      )}

      {/* Label */}
      <text x="0" y="93" fill="#cbd5e1" fontSize="9.5" fontWeight="bold" textAnchor="middle">
        {component.label}
      </text>

      <defs>
        <linearGradient id="strikePlateGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#94a3b8" />
          <stop offset="25%" stopColor="#cbd5e1" />
          <stop offset="50%" stopColor="#f1f5f9" />
          <stop offset="75%" stopColor="#cbd5e1" />
          <stop offset="100%" stopColor="#475569" />
        </linearGradient>
        <linearGradient id="keeperGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#78716c" />
          <stop offset="50%" stopColor="#d6d3d1" />
          <stop offset="100%" stopColor="#44403c" />
        </linearGradient>
        <linearGradient id="screwGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#cbd5e1" />
          <stop offset="100%" stopColor="#475569" />
        </linearGradient>
      </defs>
    </g>
  );
};

export const WaveSensor: React.FC<ComponentProps> = ({ component }) => {
  const triggerWaveSensor = useGameStore(state => state.triggerWaveSensor);
  const isActive = component.state.active || false;

  const handleWave = (e: React.PointerEvent) => {
    e.stopPropagation();
    triggerWaveSensor(component.id);
  };

  const handleWavePointerDown = (e: React.PointerEvent) => {
    e.stopPropagation();
  };

  // Battery-powered sensor: no standby glow, the ring only lights on activation.
  let ringColor = '#27272a'; // dark bezel/unlit
  let ringGlow = undefined;
  if (isActive) {
    ringColor = '#22c55e'; // active green flash
    ringGlow = 'url(#waveGlowGreen)';
  }

  return (
    <g transform="translate(-30, -82)" className="select-none">
      <defs>
        {/* Brushed Stainless Steel Plate */}
        <linearGradient id="wavePlateGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#94a3b8" />
          <stop offset="25%" stopColor="#cbd5e1" />
          <stop offset="50%" stopColor="#e2e8f0" />
          <stop offset="75%" stopColor="#cbd5e1" />
          <stop offset="100%" stopColor="#475569" />
        </linearGradient>
        {/* LED Light Ring Glow */}
        <filter id="waveGlowBlue" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="3.5" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <filter id="waveGlowGreen" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* ── Stainless Steel plate (60 × 164px) ── */}
      <rect
        x="0" y="0" width="60" height="164" rx="4"
        fill="url(#wavePlateGrad)"
        stroke="#475569"
        strokeWidth="1.2"
        filter="drop-shadow(2px 4px 8px rgba(0,0,0,0.5))"
      />

      {/* Plate bevel outline */}
      <rect x="2" y="2" width="56" height="160" rx="2" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="0.8" />

      {/* ── Assembly Screws ── */}
      {/* Top Screw */}
      <g transform="translate(30, 16)">
        <circle cx="0" cy="0" r="3.2" fill="url(#screwGrad)" stroke="#475569" strokeWidth="0.8" />
        <line x1="-1.8" y1="-1.8" x2="1.8" y2="1.8" stroke="#475569" strokeWidth="0.8" />
        <line x1="1.8" y1="-1.8" x2="-1.8" y2="1.8" stroke="#475569" strokeWidth="0.8" />
      </g>
      {/* Bottom Screw */}
      <g transform="translate(30, 157)">
        <circle cx="0" cy="0" r="3.2" fill="url(#screwGrad)" stroke="#475569" strokeWidth="0.8" />
        <line x1="-1.8" y1="0" x2="1.8" y2="0" stroke="#475569" strokeWidth="0.8" />
      </g>

      {/* ── Interactive Waving Zone ── */}
      <g
        className="cursor-pointer"
        onPointerDown={handleWavePointerDown}
        onPointerUp={handleWave}
      >
        {/* Transparent hit area covering the entire middle section */}
        <rect x="2" y="32" width="56" height="112" fill="rgba(0,0,0,0)" />

        {/* ── Hand Waving Icon Zone ── */}
        <g transform="translate(30, 48) scale(0.9)">
          {/* Wave Arcs */}
          <g stroke={isActive ? '#22c55e' : '#475569'} strokeWidth="1.5" fill="none" strokeLinecap="round">
            <path
              d="M -6 -10 C -3 -13, 3 -13, 6 -10"
              opacity={isActive ? 1 : 0.6}
              className={isActive ? "animate-pulse" : ""}
            />
            <path
              d="M -10 -14 C -5 -18, 5 -18, 10 -14"
              opacity={isActive ? 0.8 : 0.4}
              className={isActive ? "animate-pulse" : ""}
              style={{ animationDelay: '0.1s' }}
            />
            <path
              d="M -14 -18 C -7 -23, 7 -23, 14 -18"
              opacity={isActive ? 0.6 : 0.2}
              className={isActive ? "animate-pulse" : ""}
              style={{ animationDelay: '0.2s' }}
            />
          </g>
          {/* Hand icon */}
          <path
            d="M -5 13 L -5 3.5 C -5 1.5, -3 1.5, -3 3.5 L -3 0 C -3 -2, -1 -2, -1 0 L -1 -1.5 C -1 -3.5, 1 -3.5, 1 -1.5 L 1 0.5 C 1 -3, 3 -3, 3 -1 L 3 4.5 C 3 2.5, 5 2.5, 5 4.5 L 5 13 C 5 17, -5 17, -5 13 Z"
            fill="none"
            stroke="#334155"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </g>

        {/* ── Central Circular Sensor Area ── */}
        <g transform="translate(30, 92)">
          {/* Bezel */}
          <circle cx="0" cy="0" r="23" fill="#1e293b" stroke="#475569" strokeWidth="1.2" />
          {/* Dark Sensor Window */}
          <circle cx="0" cy="0" r="18" fill="#090d16" />
          {/* Glowing light ring */}
          <circle
            cx="0" cy="0" r="15"
            fill="none"
            stroke={ringColor}
            strokeWidth="3.2"
            filter={ringGlow}
            style={{ transition: 'stroke 0.25s ease' }}
            className={isActive ? "animate-pulse" : ""}
          />
          {/* Inner IR photodiode bubble */}
          <circle cx="0" cy="0" r="4.5" fill="#1e293b" opacity="0.7" />
          <circle cx="0.8" cy="-0.8" r="1" fill="#ffffff" opacity="0.4" />
        </g>

        {/* ── Engraved callout ── */}
        <text
          x="30" y="126"
          textAnchor="middle"
          fill="#334155"
          fontSize="7"
          fontWeight="bold"
          fontFamily="sans-serif"
          letterSpacing="0.4"
        >
          WAVE TO OPEN
        </text>
      </g>

      {/* ── Camden Door Controls brand block, etched into the plate ── */}
      <line x1="15" y1="132" x2="45" y2="132" stroke="#64748b" strokeWidth="0.6" opacity="0.55" />
      <text
        x="30" y="143"
        textAnchor="middle"
        fill="#1e293b"
        fontSize="8.6"
        fontWeight="900"
        fontFamily="system-ui, sans-serif"
        letterSpacing="1.6"
      >
        CAMDEN
      </text>
      <text
        x="30" y="149.5"
        textAnchor="middle"
        fill="#475569"
        fontSize="3.9"
        fontWeight="700"
        fontFamily="system-ui, sans-serif"
        letterSpacing="1.1"
      >
        DOOR CONTROLS
      </text>

      {/* ── Virtual Waving Hand Overlay ── */}
      {isActive && (
        <g transform="translate(30, 92)" className="animate-wave-hand" pointerEvents="none">
          {/* Translucent premium glowing hand ring */}
          <circle cx="0" cy="0" r="14" fill="rgba(253, 224, 71, 0.18)" filter="url(#waveGlowGreen)" />
          {/* Hand drawing */}
          <path
            d="M -5 13 L -5 3.5 C -5 1.5, -3 1.5, -3 3.5 L -3 0 C -3 -2, -1 -2, -1 0 L -1 -1.5 C -1 -3.5, 1 -3.5, 1 -1.5 L 1 0.5 C 1 -3, 3 -3, 3 -1 L 3 4.5 C 3 2.5, 5 2.5, 5 4.5 L 5 13 C 5 17, -5 17, -5 13 Z"
            fill="#fef08a"
            stroke="#ca8a04"
            strokeWidth="1.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            transform="scale(1.2)"
          />
          {/* Motion lines behind hand */}
          <path d="M 8 2 C 11 -1, 14 -1, 17 2" fill="none" stroke="#ca8a04" strokeWidth="1" strokeLinecap="round" opacity="0.8" />
          <path d="M 10 -2 C 13 -5, 16 -5, 19 -2" fill="none" stroke="#ca8a04" strokeWidth="1" strokeLinecap="round" opacity="0.8" />
        </g>
      )}

      {/* Nameplate chip below the plate, matching the other field devices */}
      <g transform="translate(30, 178)" pointerEvents="none">
        <rect x="-46" y="-9" width="92" height="18" rx="5" fill="#070b13" fillOpacity="0.96" stroke="#334155" strokeWidth="1" />
        <text
          x="0" y="3"
          fill="#f1f5f9"
          fontSize={component.label.length > 16 ? 7.2 : 8.5}
          fontWeight="800"
          textAnchor="middle"
          fontFamily="monospace"
        >
          {component.label}
        </text>
      </g>
    </g>
  );
};
