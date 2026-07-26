import React from 'react';
import type { CircuitComponent } from '../../../types/game';

interface ComponentProps {
  component: CircuitComponent;
  isEnergized: boolean;
}

const BLADE_PATH = 'M 0 0 C 2 -5, 10 -6, 15 -13 C 19 -19, 18 -26, 12 -27 C 6 -28, 1 -21, 0 -12 C -0.6 -6, -0.3 -2, 0 0 Z';

export const DCCoolingFan: React.FC<ComponentProps> = ({ component, isEnergized }) => {
  return (
    <g transform="translate(0, 0)">
      <style>{`
        @keyframes dcfan-spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes dcfan-vibrate {
          0%, 100% { transform: translate(0, 0); }
          25% { transform: translate(0.35px, -0.3px); }
          50% { transform: translate(-0.3px, 0.35px); }
          75% { transform: translate(0.3px, 0.3px); }
        }
        @keyframes dcfan-airflow {
          0% { transform: scale(0.3); opacity: 0.55; }
          100% { transform: scale(1.9); opacity: 0; }
        }
        @keyframes dcfan-blur-fade {
          from { opacity: 0; }
          to { opacity: 0.55; }
        }
        .dcfan-spinning {
          animation: dcfan-spin 0.28s linear infinite;
        }
        .dcfan-housing-running {
          animation: dcfan-vibrate 0.11s linear infinite;
        }
        .dcfan-ring {
          animation: dcfan-airflow 1.5s ease-out infinite;
          transform-origin: 0px 0px;
        }
        .dcfan-blur {
          animation: dcfan-spin 0.28s linear infinite, dcfan-blur-fade 0.35s ease-out forwards;
        }
      `}</style>

      <defs>
        <radialGradient id="dcfan-housing-grad" cx="35%" cy="30%" r="80%">
          <stop offset="0%" stopColor="#343c4a" />
          <stop offset="55%" stopColor="#20242e" />
          <stop offset="100%" stopColor="#14161d" />
        </radialGradient>
        <radialGradient id="dcfan-well-grad" cx="50%" cy="50%" r="60%">
          <stop offset="0%" stopColor="#05070b" />
          <stop offset="75%" stopColor="#0a0d13" />
          <stop offset="100%" stopColor="#12151c" />
        </radialGradient>
        <linearGradient id="dcfan-blade-grad" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#1c2029" />
          <stop offset="55%" stopColor="#3a4252" />
          <stop offset="100%" stopColor="#5b6577" />
        </linearGradient>
        <radialGradient id="dcfan-hub-grad" cx="35%" cy="30%" r="70%">
          <stop offset="0%" stopColor="#6b7386" />
          <stop offset="45%" stopColor="#333947" />
          <stop offset="100%" stopColor="#181b22" />
        </radialGradient>
        <linearGradient id="fanScrewGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#94a3b8" />
          <stop offset="50%" stopColor="#cbd5e1" />
          <stop offset="100%" stopColor="#475569" />
        </linearGradient>
        <filter id="dcfan-blur-filter" x="-60%" y="-60%" width="220%" height="220%">
          <feGaussianBlur stdDeviation="2.4" />
        </filter>
      </defs>

      <g className={isEnergized ? 'dcfan-housing-running' : ''}>
        {/* Outer square plastic housing, glossy corner-lit plastic */}
        <rect x="-40" y="-40" width="80" height="80" rx="7" fill="url(#dcfan-housing-grad)" stroke="#05070a" strokeWidth="2" filter="drop-shadow(0 5px 9px rgba(0,0,0,0.45))" />
        {/* Top-left specular sheen */}
        <path d="M -34 -34 Q -20 -37 -4 -34" fill="none" stroke="#ffffff" strokeOpacity="0.12" strokeWidth="5" strokeLinecap="round" />

        {/* Corner mounting bosses with screws */}
        {[[-32, -32], [32, -32], [-32, 32], [32, 32]].map(([cx, cy]) => (
          <g key={`${cx}-${cy}`} transform={`translate(${cx}, ${cy})`}>
            <circle r="4.6" fill="#0a0c11" stroke="#3a4150" strokeWidth="0.7" />
            <circle r="2.7" fill="url(#fanScrewGrad)" stroke="#111827" strokeWidth="0.5" />
            <line x1="-1.6" y1="0" x2="1.6" y2="0" stroke="#1f2530" strokeWidth="0.7" />
            <line x1="0" y1="-1.6" x2="0" y2="1.6" stroke="#1f2530" strokeWidth="0.7" />
          </g>
        ))}

        {/* Recessed circular well the impeller sits in */}
        <circle cx="0" cy="0" r="34" fill="url(#dcfan-well-grad)" stroke="#000000" strokeWidth="1" />
        <circle cx="0" cy="0" r="34" fill="none" stroke="#4b5566" strokeWidth="0.7" opacity="0.5" />

        {/* Airflow ripple rings, only while running */}
        {isEnergized && (
          <g pointerEvents="none">
            <circle className="dcfan-ring" r="14" fill="none" stroke="#7dd3fc" strokeWidth="1.4" style={{ animationDelay: '0s' }} />
            <circle className="dcfan-ring" r="14" fill="none" stroke="#7dd3fc" strokeWidth="1.4" style={{ animationDelay: '0.5s' }} />
            <circle className="dcfan-ring" r="14" fill="none" stroke="#7dd3fc" strokeWidth="1.4" style={{ animationDelay: '1s' }} />
          </g>
        )}

        {/* Ghost motion-blur layer: a softly blurred duplicate rotor sells "full speed" */}
        {isEnergized && (
          <g className="dcfan-blur" filter="url(#dcfan-blur-filter)" style={{ transformOrigin: '0px 0px' }}>
            {Array.from({ length: 7 }).map((_, i) => (
              <path key={i} d={BLADE_PATH} fill="#8fb4d9" transform={`rotate(${(i * 360) / 7})`} />
            ))}
          </g>
        )}

        {/* Crisp rotor & blades */}
        <g className={isEnergized ? 'dcfan-spinning' : ''} style={{ transformOrigin: '0px 0px' }}>
          {Array.from({ length: 7 }).map((_, i) => (
            <path
              key={i}
              d={BLADE_PATH}
              fill="url(#dcfan-blade-grad)"
              stroke="#0b0d12"
              strokeWidth="0.6"
              transform={`rotate(${(i * 360) / 7})`}
            />
          ))}
          {/* Hub centerpiece with specular highlight */}
          <circle cx="0" cy="0" r="10.5" fill="url(#dcfan-hub-grad)" stroke="#05070a" strokeWidth="1" />
          <circle cx="-2.6" cy="-2.6" r="2.1" fill="#ffffff" opacity="0.35" />
        </g>

        {/* Stationary finger-guard grille, drawn on top so it always reads as static */}
        <g opacity="0.4" stroke="#0a0c11" strokeWidth="1" fill="none">
          <circle cx="0" cy="0" r="24" />
          <circle cx="0" cy="0" r="17" />
          {[0, 60, 120, 180, 240, 300].map(a => (
            <line key={a} x1="0" y1="0" x2={34 * Math.cos((a * Math.PI) / 180)} y2={34 * Math.sin((a * Math.PI) / 180)} />
          ))}
        </g>

        {/* Spec sticker */}
        <rect x="-16" y="26" width="32" height="9" rx="1.2" fill="#0a0c11" stroke="#2a3040" strokeWidth="0.5" opacity="0.9" />
        <text x="0" y="32.5" fill="#8ea3bd" fontSize="4.4" fontWeight="700" fontFamily="monospace" textAnchor="middle" letterSpacing="0.3">
          DC 12-24V
        </text>
      </g>

      {/* Labeled screw terminal connections at the bottom */}
      {[
        { id: 'pos', x: -20, label: '+', color: '#ef4444' },
        { id: 'neg', x: 20, label: '-', color: '#94a3b8' }
      ].map(term => (
        <g key={term.id} transform={`translate(${term.x}, 40)`}>
          {/* Metal bracket tab */}
          <rect x="-8" y="-4" width="16" height="8" rx="1.5" fill="#334155" stroke="#1e293b" strokeWidth="0.8" />
          {/* Terminal Screw */}
          <circle cx="0" cy="0" r="3" fill="url(#fanScrewGrad)" stroke="#111827" strokeWidth="0.6" />
          <line x1="-1.8" y1="-1.8" x2="1.8" y2="1.8" stroke="#111827" strokeWidth="0.6" />
          {/* Label sign */}
          <text x="0" y="11" fill={term.color} fontSize="7.5" fontWeight="900" textAnchor="middle" fontFamily="sans-serif">
            {term.label}
          </text>
        </g>
      ))}

      {/* Unit label identifier */}
      <text x="0" y="-45" fill="#cbd5e1" fontSize="9.5" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">
        {component.label || 'DC Fan'}
      </text>
    </g>
  );
};
