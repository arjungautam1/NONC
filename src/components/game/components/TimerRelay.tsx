import React from 'react';
import type { CircuitComponent } from '../../../types/game';
import {
  getTimer6062Config,
  getTimer6062DurationMs,
  getTimer6062PhaseLabel,
  isTimer6062RelayActive
} from '../../../simulation/timer6062';

interface TimerRelayProps {
  component: CircuitComponent;
  isEnergized: boolean;
}

// Coordinates are scaled from the supplied 2.5000 × 3.0118 inch 6062 DWG.
const CAD_TERMINAL_X = [-36, -22, -7, 7, 22, 36];

export const TimerRelay: React.FC<TimerRelayProps> = ({ component, isEnergized }) => {
  const config = getTimer6062Config(component);
  const timeLeft = component.state.timeLeft || '2.0s';
  const relayActive = isTimer6062RelayActive(component);
  const boardPowered = Boolean(component.state.boardPowered ?? isEnergized);
  const phaseLabel = getTimer6062PhaseLabel(component.state.timerPhase);
  const duration = getTimer6062DurationMs(config);
  const remaining = Number(component.state.timeLeftMs ?? duration);
  const progress = duration > 0 ? Math.min(1, Math.max(0, 1 - remaining / duration)) : 0;
  const dialAngle = 45 + ((config.adjustment - 1) / 59) * 270;
  const dipValues = [
    config.dip4TriggerRemoval,
    config.dip3TwelveVolt,
    config.dip2Seconds,
    config.dip1RelayAtEnd
  ];
  const runtimeLabel =
    component.state.timerPhase === 'timing' ||
    component.state.timerPhase === 'repeat' ||
    component.state.timerPhase === 'pulse'
      ? timeLeft
      : phaseLabel;

  return (
    <g>
      <defs>
        <linearGradient id="timer6062-board" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#246fa2" />
          <stop offset="55%" stopColor="#1e6091" />
          <stop offset="100%" stopColor="#174c73" />
        </linearGradient>
        <linearGradient id="timer6062-screw" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#f8fafc" />
          <stop offset="48%" stopColor="#a8b1bb" />
          <stop offset="100%" stopColor="#4b5563" />
        </linearGradient>
        <filter id="timer6062-led-glow" x="-200%" y="-200%" width="500%" height="500%">
          <feGaussianBlur stdDeviation="2" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* The DWG outline is 2.5000 × 3.0118 inches, scaled to 100 × 120. */}
      <rect
        x="-50"
        y="-60"
        width="100"
        height="120"
        rx="1.5"
        fill="url(#timer6062-board)"
        stroke="#0d3f62"
        strokeWidth="2"
        filter="drop-shadow(0 4px 7px rgba(0,0,0,0.38))"
      />
      <rect x="-47.5" y="-57.5" width="95" height="115" fill="none" stroke="#7fb3d5" strokeWidth="0.45" opacity="0.5" />

      {/* Four mounting holes at the CAD centers (0.118 and 2.382 inches). */}
      {[
        [-45.3, -55.3],
        [45.3, -55.3],
        [-45.3, 55.3],
        [45.3, 55.3]
      ].map(([x, y]) => (
        <g key={`${x}-${y}`} transform={`translate(${x}, ${y})`}>
          <circle r="3" fill="#d9a70c" stroke="#facc15" strokeWidth="0.6" />
          <circle r="1.45" fill="#102b3c" stroke="#071821" strokeWidth="0.35" />
        </g>
      ))}

      {/* Red indicator from the DWG's led_red block. */}
      <g transform="translate(40.2, -29)">
        <circle r="3.4" fill="#111827" stroke="#020617" strokeWidth="0.7" />
        <circle
          r="2.45"
          fill={relayActive ? '#ef4444' : boardPowered ? '#991b1b' : '#551111'}
          stroke={relayActive ? '#fecaca' : '#7f1d1d'}
          strokeWidth="0.55"
          filter={relayActive ? 'url(#timer6062-led-glow)' : undefined}
        />
        <circle cx="-0.75" cy="-0.8" r="0.65" fill="#fff" opacity={relayActive ? 0.85 : 0.28} />
      </g>

      {/* 1–60 trimmer and legends, positioned from the CAD text coordinates. */}
      <g fill="#f8fafc" fontFamily="Arial, sans-serif" fontWeight="700" fontSize="3.7">
        <text x="-44" y="-38.6">45</text>
        <text x="-24.2" y="-31.2">60</text>
        <text x="-43.5" y="5.2">15</text>
        <text x="-23.8" y="-2.4">1</text>
      </g>
      <g transform="translate(-38.2, -4.5)">
        <circle r="10.2" fill="#e5e7eb" stroke="#cbd5e1" strokeWidth="0.8" />
        {Array.from({ length: 22 }).map((_, index) => (
          <rect
            key={index}
            x="-0.6"
            y="-11.1"
            width="1.2"
            height="2.1"
            rx="0.2"
            fill="#d1d5db"
            transform={`rotate(${index * (360 / 22)})`}
          />
        ))}
        <circle r="6.4" fill="#f8fafc" stroke="#aeb8c2" strokeWidth="0.7" />
        <line x1="-4.4" y1="0" x2="4.4" y2="0" stroke="#7b8794" strokeWidth="1.15" />
        <line
          x1="0"
          y1="0"
          x2="0"
          y2="-6"
          stroke="#17577f"
          strokeWidth="1.7"
          strokeLinecap="round"
          transform={`rotate(${dialAngle})`}
        />
      </g>

      {/* Four-position switch block at the exact upper-right DWG location. */}
      <g transform="translate(17, -33)">
        <rect x="0" y="0" width="12" height="19" fill="#111827" stroke="#dbeafe" strokeWidth="0.65" />
        {dipValues.map((isOn, index) => {
          const rowY = 1.6 + index * 4.2;
          return (
            <g key={index}>
              <rect x="1.2" y={rowY} width="9.6" height="3" fill="#020617" stroke="#64748b" strokeWidth="0.35" />
              <rect
                x={isOn ? 1.8 : 6.1}
                y={rowY + 0.35}
                width="4"
                height="2.3"
                fill="#f8fafc"
                stroke="#94a3b8"
                strokeWidth="0.3"
              />
              <text x="-2" y={rowY + 2.5} fill="#f8fafc" fontSize="3" fontFamily="monospace" textAnchor="middle">
                {4 - index}
              </text>
            </g>
          );
        })}
        <text x="-6.4" y="23" fill="#f8fafc" fontSize="3.1" fontFamily="Arial, sans-serif" fontWeight="700">ON</text>
        <path d="M -1.6 21.8 H -5.1 M -5.1 21.8 l 1.6 -1.2 M -5.1 21.8 l 1.6 1.2" fill="none" stroke="#f8fafc" strokeWidth="0.6" />
        <text x="11.1" y="23" fill="#f8fafc" fontSize="3.1" fontFamily="Arial, sans-serif" fontWeight="700">OFF</text>
        <path d="M 12.8 21.8 H 16.3 M 16.3 21.8 l -1.6 -1.2 M 16.3 21.8 l -1.6 1.2" fill="none" stroke="#f8fafc" strokeWidth="0.6" />
      </g>

      {/* CAD branding location. */}
      <text x="-45.3" y="15" fill="#ffffff" fontSize="7" fontWeight="800" fontFamily="Arial, sans-serif">6062</text>
      <text x="-45.3" y="24" fill="#ffffff" fontSize="6" fontWeight="800" fontFamily="Arial, sans-serif">TIMER</text>

      {/* Compact live training status in the otherwise blank lower-right CAD area. */}
      <g transform="translate(20, 19)">
        <rect x="-12" y="-5" width="28" height="10" rx="1.4" fill="#082f49" stroke="#7dd3fc" strokeWidth="0.45" opacity="0.95" />
        <text
          x="2"
          y="1"
          fill={relayActive ? '#fda4af' : boardPowered ? '#fde047' : '#94a3b8'}
          fontSize="3.7"
          fontWeight="800"
          fontFamily="monospace"
          textAnchor="middle"
        >
          {runtimeLabel}
        </text>
        <rect x="-10" y="3" width="24" height="1" rx="0.5" fill="#0c4a6e" />
        <rect x="-10" y="3" width={24 * progress} height="1" rx="0.5" fill={relayActive ? '#fb7185' : '#facc15'} />
      </g>

      {/* Six CAD-spaced terminal cells: TRG, −, +, NO, C, NC. */}
      <g transform="translate(0, 40)">
        <rect x="-44" y="-7" width="88" height="14" rx="0.7" fill="#171717" stroke="#050505" strokeWidth="0.9" />
        {CAD_TERMINAL_X.map((xOffset, index) => (
          <g key={xOffset} transform={`translate(${xOffset}, 0)`}>
            {index > 0 && <line x1="-7.25" y1="-7" x2="-7.25" y2="7" stroke="#525252" strokeWidth="0.7" />}
            <rect x="-5.7" y="-5.7" width="11.4" height="11.4" rx="0.8" fill="#292524" stroke="#57534e" strokeWidth="0.45" />
            <circle r="3.65" fill="url(#timer6062-screw)" stroke="#64748b" strokeWidth="0.55" />
            <line x1="-2.6" y1="-1" x2="2.6" y2="1" stroke="#334155" strokeWidth="0.95" />
            <line x1="-1" y1="2.6" x2="1" y2="-2.6" stroke="#334155" strokeWidth="0.7" />
          </g>
        ))}
        <g fill="#ffffff" fontSize="4.6" fontWeight="800" textAnchor="middle" fontFamily="Arial, sans-serif" transform="translate(0, 14)">
          <text x="-36" y="0">TRG</text>
          <text x="-22" y="0">−</text>
          <text x="-7" y="0">+</text>
          <text x="7" y="0">NO</text>
          <text x="22" y="0">C</text>
          <text x="36" y="0">NC</text>
        </g>
      </g>
    </g>
  );
};

export default TimerRelay;
