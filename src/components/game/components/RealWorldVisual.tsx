import React from 'react';

interface VisualProps {
  levelId: number;
  isActive: boolean; // can use active simulation states to trigger animations
}

export const RealWorldVisual: React.FC<VisualProps> = ({ levelId, isActive }) => {
  // 70x70 viewBox scaled to parent container width/height
  switch (levelId) {
    case 1: // Flashlight
      return (
        <svg width="100%" height="100%" viewBox="0 0 70 70" className="bg-[#18181b] rounded border border-[#2a2e39]/60 shadow-inner">
          <defs>
            <radialGradient id="beam" cx="0%" cy="50%" r="100%">
              <stop offset="0%" stopColor="#fef08a" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#fde047" stopOpacity="0" />
            </radialGradient>
          </defs>
          {/* Torch body */}
          <rect x="5" y="30" width="22" height="10" rx="1.5" fill="#4b5563" />
          <path d="M27 26 L36 22 L36 48 L27 44 Z" fill="#374151" stroke="#1f2937" strokeWidth="1" />
          <circle cx="8" cy="35" r="2" fill="#ef4444" />
          {/* Light beam */}
          {isActive ? (
            <polygon points="36,25 65,10 65,60 36,45" fill="url(#beam)" className="animate-pulse" />
          ) : (
            <polygon points="36,25 65,10 65,60 36,45" fill="#fef08a" opacity="0.08" />
          )}
        </svg>
      );

    case 2: // Home Switch
      return (
        <svg width="100%" height="100%" viewBox="0 0 70 70" className="bg-[#18181b] rounded border border-[#2a2e39]/60 shadow-inner">
          <circle cx="35" cy="25" r="14" fill={isActive ? '#fde047' : '#27272a'} stroke="#4b5563" strokeWidth="1.5" />
          <path d="M35 11 L35 5" stroke="#71717a" strokeWidth="1.5" />
          {/* Switch plate */}
          <rect x="25" y="44" width="20" height="22" rx="2" fill="#e4e4e7" stroke="#a1a1aa" />
          {/* Toggle lever */}
          {isActive ? (
            <rect x="33" y="47" width="4" height="8" fill="#18181b" rx="1" />
          ) : (
            <rect x="33" y="53" width="4" height="8" fill="#18181b" rx="1" />
          )}
          {isActive && (
            <circle cx="35" cy="25" r="22" fill="#fef08a" opacity="0.15" className="animate-pulse" />
          )}
        </svg>
      );

    case 3: // Doorbell System
      return (
        <svg width="100%" height="100%" viewBox="0 0 70 70" className="bg-[#18181b] rounded border border-[#2a2e39]/60 shadow-inner">
          {/* Chime Box */}
          <rect x="12" y="32" width="22" height="26" rx="2" fill="#854d0e" stroke="#451a03" strokeWidth="1.5" />
          <rect x="16" y="36" width="3" height="18" fill="#e4e4e7" />
          <rect x="23" y="36" width="3" height="18" fill="#e4e4e7" />
          
          {/* Doorbell push button */}
          <rect x="44" y="24" width="16" height="28" rx="3" fill="#e4e4e7" stroke="#a1a1aa" />
          <circle cx="52" cy="38" r="5" fill={isActive ? '#f59e0b' : '#ef4444'} className={isActive ? 'animate-pulse' : ''} />
          
          {/* Chime sound waves when active */}
          {isActive && (
            <g className="stroke-yellow-400 fill-none" strokeWidth="1.5" strokeLinecap="round">
              <path d="M 12 25 Q 18 15 24 25" className="animate-pulse" />
              <path d="M 8 20 Q 18 5 28 20" className="animate-pulse" style={{ animationDelay: '0.15s' }} />
            </g>
          )}
        </svg>
      );

    case 4: // Refrigerator Door Light
      return (
        <svg width="100%" height="100%" viewBox="0 0 70 70" className="bg-[#18181b] rounded border border-[#2a2e39]/60 shadow-inner">
          {/* Fridge interior outline */}
          <rect x="15" y="10" width="40" height="50" fill="#27272a" stroke="#4b5563" strokeWidth="1.5" />
          {/* Fridge shelves */}
          <line x1="15" y1="28" x2="55" y2="28" stroke="#3f3f46" strokeWidth="1" />
          <line x1="15" y1="46" x2="55" y2="46" stroke="#3f3f46" strokeWidth="1" />
          {/* Bulb - glows when NOT active (normally closed switch at rest) */}
          <circle cx="35" cy="18" r="6" fill={!isActive ? '#fde047' : '#18181b'} stroke="#71717a" strokeWidth="1" />
          {!isActive && (
            <circle cx="35" cy="18" r="14" fill="#fef08a" opacity="0.15" className="animate-pulse" />
          )}
          {/* Door block closing onto the switch */}
          {isActive && (
            <rect x="52" y="10" width="5" height="50" fill="#71717a" opacity="0.8" />
          )}
        </svg>
      );

    case 5: // Low-Voltage Lighting Relay
      return (
        <svg width="100%" height="100%" viewBox="0 0 70 70" className="bg-[#18181b] rounded border border-[#2a2e39]/60 shadow-inner">
          {/* Relay casing */}
          <rect x="12" y="12" width="46" height="46" rx="3" fill="none" stroke="#4b5563" strokeWidth="1.5" />
          {/* Coil windings */}
          <rect x="18" y="24" width="14" height="22" rx="1" fill="#b45309" stroke="#78350f" />
          <line x1="20" y1="28" x2="30" y2="28" stroke="#f59e0b" strokeWidth="1" />
          <line x1="20" y1="32" x2="30" y2="32" stroke="#f59e0b" strokeWidth="1" />
          <line x1="20" y1="36" x2="30" y2="36" stroke="#f59e0b" strokeWidth="1" />
          <line x1="20" y1="40" x2="30" y2="40" stroke="#f59e0b" strokeWidth="1" />
          {/* Armature switch contact */}
          {isActive ? (
            <path d="M 46 22 L 34 32 L 34 44" fill="none" stroke="#22c55e" strokeWidth="2.5" />
          ) : (
            <path d="M 46 16 L 38 28 L 38 44" fill="none" stroke="#ef4444" strokeWidth="1.5" />
          )}
          {/* Status lamp */}
          <circle cx="50" cy="50" r="3" fill={isActive ? '#22c55e' : '#3f3f46'} />
        </svg>
      );

    case 6: // Car Horn Relay Control
      return (
        <svg width="100%" height="100%" viewBox="0 0 70 70" className="bg-[#18181b] rounded border border-[#2a2e39]/60 shadow-inner">
          {/* Horn Speaker shape */}
          <path d="M 15 28 L 30 28 L 45 15 L 45 55 L 30 42 L 15 42 Z" fill="#4b5563" stroke="#1f2937" strokeWidth="1.5" />
          <rect x="8" y="32" width="7" height="6" fill="#374151" />
          {/* Sound waves */}
          {isActive && (
            <g className="stroke-yellow-400 fill-none" strokeWidth="2" strokeLinecap="round">
              <path d="M 52 25 A 15 15 0 0 1 52 45" className="animate-pulse" />
              <path d="M 59 18 A 25 25 0 0 1 59 52" className="animate-pulse" style={{ animationDelay: '0.15s' }} />
            </g>
          )}
        </svg>
      );

    case 7: // Security Alarm Cut-Off
      return (
        <svg width="100%" height="100%" viewBox="0 0 70 70" className="bg-[#18181b] rounded border border-[#2a2e39]/60 shadow-inner">
          {/* Rotating siren light base */}
          <rect x="20" y="44" width="30" height="14" fill="#3f3f46" rx="2" stroke="#18181b" />
          {/* Siren glass dome */}
          <path d="M 23 44 C 23 20, 47 20, 47 44 Z" fill={isActive ? '#ef4444' : '#7f1d1d'} opacity="0.8" stroke="#18181b" />
          {/* Siren light flash */}
          {isActive && (
            <g>
              <polygon points="35,32 5,10 15,5" fill="#f87171" opacity="0.3" className="animate-pulse" />
              <polygon points="35,32 65,10 55,5" fill="#f87171" opacity="0.3" className="animate-pulse" style={{ animationDelay: '0.2s' }} />
            </g>
          )}
        </svg>
      );

    case 8: // Industrial E-Stop Safety Loop
      return (
        <svg width="100%" height="100%" viewBox="0 0 70 70" className="bg-[#18181b] rounded border border-[#2a2e39]/60 shadow-inner">
          {/* Industrial emergency stop button */}
          <rect x="18" y="32" width="34" height="26" fill="#fbbf24" rx="2" stroke="#d97706" />
          {/* Large red mushroom head */}
          <path d="M 22 32 C 22 15, 48 15, 48 32 Z" fill="#dc2626" stroke="#991b1b" strokeWidth="1" />
          {/* Pull direction arrow */}
          <path d="M 35 15 L 35 5 M 32 8 L 35 5 L 38 8" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" />
          {/* Status border */}
          <circle cx="35" cy="45" r="4" fill={isActive ? '#22c55e' : '#ef4444'} />
        </svg>
      );

    case 9: // Secure Office Badge Entry (swinging door)
      return (
        <svg width="100%" height="100%" viewBox="0 0 70 70" className="bg-[#18181b] rounded border border-[#2a2e39]/60 shadow-inner">
          {/* Door Frame */}
          <rect x="18" y="10" width="34" height="52" fill="none" stroke="#4b5563" strokeWidth="2.5" />
          {/* Door panel - swinging open if isActive, locked shut if not */}
          <rect 
            x="19.5" 
            y="11.5" 
            width="31" 
            height="49" 
            fill="#374151" 
            stroke="#1f2937"
            style={{
              transform: isActive ? 'skewY(-10deg) scaleX(0.8)' : 'none',
              transformOrigin: '20px 35px',
              transition: 'transform 0.5s ease-in-out'
            }}
          />
          {/* Mini Maglock magnet representation */}
          <rect x="40" y="11" width="10" height="5" fill={isActive ? '#22c55e' : '#ef4444'} />
        </svg>
      );

    case 10: // Traffic Lights
      return (
        <svg width="100%" height="100%" viewBox="0 0 70 70" className="bg-[#18181b] rounded border border-[#2a2e39]/60 shadow-inner">
          {/* Traffic light enclosure */}
          <rect x="23" y="10" width="24" height="50" rx="5" fill="#27272a" stroke="#18181b" strokeWidth="2.5" />
          {/* Red light */}
          <circle cx="35" cy="22" r="7" fill={!isActive ? '#ef4444' : '#7f1d1d'} filter={!isActive ? 'drop-shadow(0 0 4px #ef4444)' : 'none'} />
          {/* Green light */}
          <circle cx="35" cy="48" r="7" fill={isActive ? '#22c55e' : '#14532d'} filter={isActive ? 'drop-shadow(0 0 4px #22c55e)' : 'none'} />
        </svg>
      );

    case 11: // Bathroom GFCI Ground Protection
      return (
        <svg width="100%" height="100%" viewBox="0 0 70 70" className="bg-[#18181b] rounded border border-[#2a2e39]/60 shadow-inner">
          {/* Wall plate */}
          <rect x="20" y="12" width="30" height="46" rx="4" fill="#f4f4f5" stroke="#cbd5e1" strokeWidth="1" />
          {/* Receptacles holes */}
          <rect x="26" y="18" width="18" height="12" rx="2" fill="#e4e4e7" />
          <circle cx="30" cy="23" r="1.5" fill="#18181b" />
          <circle cx="40" cy="23" r="1.5" fill="#18181b" />
          <path d="M35 27 L35 29 A 2 2 0 0 1 33 31" fill="none" stroke="#18181b" strokeWidth="1" />

          {/* Test / Reset button slots */}
          <rect x="28" y="34" width="6" height="3" fill="#18181b" />
          <rect x="36" y="34" width="6" height="3" fill="#ef4444" />

          {/* GFCI Indicator LED */}
          <circle cx="35" cy="42" r="2.5" fill={isActive ? '#22c55e' : '#ef4444'} />
        </svg>
      );

    case 12: // Machinery Start/Stop Station
      return (
        <svg width="100%" height="100%" viewBox="0 0 70 70" className="bg-[#18181b] rounded border border-[#2a2e39]/60 shadow-inner">
          {/* Operator station panel */}
          <rect x="18" y="10" width="34" height="50" rx="3" fill="#3f3f46" stroke="#27272a" strokeWidth="2" />
          {/* Start green button */}
          <circle cx="35" cy="24" r="8" fill={isActive ? '#22c55e' : '#15803d'} stroke="#166534" strokeWidth="1.5" />
          <circle cx="35" cy="24" r="4" fill="#a7f3d0" opacity={isActive ? 0.7 : 0.2} />
          {/* Stop red button */}
          <circle cx="35" cy="46" r="8" fill="#ef4444" stroke="#b91c1c" strokeWidth="1.5" />
          <circle cx="35" cy="46" r="3" fill="#18181b" />
        </svg>
      );

    case 13: // HVAC Fan Time-Delay
      return (
        <svg width="100%" height="100%" viewBox="0 0 70 70" className="bg-[#18181b] rounded border border-[#2a2e39]/60 shadow-inner">
          {/* Fan housing circle */}
          <circle cx="35" cy="35" r="24" fill="none" stroke="#4b5563" strokeWidth="2.5" />
          {/* Clock timer symbol inside */}
          <circle cx="35" cy="35" r="8" fill="#27272a" stroke="#71717a" strokeWidth="1" />
          <line x1="35" y1="35" x2="35" y2="31" stroke="#fbbf24" strokeWidth="1" />
          <line x1="35" y1="35" x2="38" y2="35" stroke="#fbbf24" strokeWidth="1" />

          {/* Fan blades */}
          <g className={isActive ? 'animate-spin' : ''} style={{ transformOrigin: '35px 35px', animationDuration: '0.8s' }}>
            <path d="M 35 11 L 32 27 L 38 27 Z" fill="#94a3b8" stroke="#475569" strokeWidth="0.5" />
            <path d="M 35 59 L 32 43 L 38 43 Z" fill="#94a3b8" stroke="#475569" strokeWidth="0.5" />
            <path d="M 11 35 L 27 32 L 27 38 Z" fill="#94a3b8" stroke="#475569" strokeWidth="0.5" />
            <path d="M 59 35 L 43 32 L 43 38 Z" fill="#94a3b8" stroke="#475569" strokeWidth="0.5" />
          </g>
        </svg>
      );

    case 14: // Elevator Safety Limit Switch
      return (
        <svg width="100%" height="100%" viewBox="0 0 70 70" className="bg-[#18181b] rounded border border-[#2a2e39]/60 shadow-inner">
          {/* Elevator hoist frame */}
          <line x1="18" y1="5" x2="18" y2="65" stroke="#3f3f46" strokeWidth="2" />
          <line x1="52" y1="5" x2="52" y2="65" stroke="#3f3f46" strokeWidth="2" />
          {/* Moving cabin elevator platform */}
          <rect
            x="22"
            y={isActive ? 16 : 46}
            width="26"
            height="18"
            rx="1"
            fill="#52525b"
            stroke="#a1a1aa"
            strokeWidth="1.5"
            style={{ transition: 'all 1.5s ease-in-out' }}
          />
          {/* Limit Switch visual bumper */}
          <circle cx="18" cy="18" r="3" fill="#ef4444" className={isActive ? 'animate-ping' : ''} />
        </svg>
      );

    case 15: // Reversing Actuator (driveway gate / window)
      return (
        <svg width="100%" height="100%" viewBox="0 0 70 70" className="bg-[#18181b] rounded border border-[#2a2e39]/60 shadow-inner">
          {/* Driveway gate posts */}
          <rect x="5" y="15" width="10" height="40" fill="#3f3f46" rx="1" />
          <rect x="55" y="15" width="10" height="40" fill="#3f3f46" rx="1" />
          {/* Linear actuator body */}
          <rect x="15" y="32" width="22" height="6" fill="#18181b" stroke="#4b5563" />
          
          {/* Slide gate panel extending / retracting */}
          <rect 
            x={isActive ? 35 : 15} 
            y="20" 
            width="20" 
            height="30" 
            fill="#27272a" 
            stroke="#71717a" 
            strokeWidth="1.5"
            style={{ transition: 'x 1.2s cubic-bezier(0.25, 0.8, 0.25, 1)' }}
          />
          {/* Direction indicator arrows */}
          {isActive && (
            <text x="35" y="60" fill="#22c55e" fontSize="7" fontWeight="black" textAnchor="middle" className="animate-pulse">
              ◀ OPEN ▶
            </text>
          )}
        </svg>
      );

    case 16: // CDVI Transformer Security
      return (
        <svg width="100%" height="100%" viewBox="0 0 70 70" className="bg-[#18181b] rounded border border-[#2a2e39]/60 shadow-inner">
          {/* Transformer iron core */}
          <rect x="15" y="20" width="40" height="30" rx="3" fill="#4b5563" stroke="#1f2937" strokeWidth="2" />
          {/* Coil windings primary */}
          <rect x="20" y="22" width="10" height="26" fill="#b45309" stroke="#78350f" />
          <line x1="20" y1="26" x2="30" y2="26" stroke="#f59e0b" />
          <line x1="20" y1="30" x2="30" y2="30" stroke="#f59e0b" />
          <line x1="20" y1="34" x2="30" y2="34" stroke="#f59e0b" />
          <line x1="20" y1="38" x2="30" y2="38" stroke="#f59e0b" />
          
          {/* Coil windings secondary */}
          <rect x="40" y="22" width="10" height="26" fill="#047857" stroke="#064e3b" />
          <line x1="40" y1="26" x2="50" y2="26" stroke="#34d399" />
          <line x1="40" y1="30" x2="50" y2="30" stroke="#34d399" />
          <line x1="40" y1="34" x2="50" y2="34" stroke="#34d399" />
          <line x1="40" y1="38" x2="50" y2="38" stroke="#34d399" />

          {/* Electric sparks when active */}
          {isActive && (
            <path d="M 32 15 L 35 8 L 38 15" stroke="#fbbf24" strokeWidth="2" fill="none" className="animate-bounce" />
          )}
        </svg>
      );
      
    case 17: // CDVI Reader Access Control
      return (
        <svg width="100%" height="100%" viewBox="0 0 70 70" className="bg-[#18181b] rounded border border-[#2a2e39]/60 shadow-inner">
          {/* Wall / Door frame */}
          <rect x="10" y="10" width="36" height="50" fill="none" stroke="#4b5563" strokeWidth="2.5" />
          {/* Door panel */}
          <rect 
            x="12" 
            y="12" 
            width="32" 
            height="46" 
            fill="#27272a" 
            stroke="#3f3f46" 
            strokeWidth="1"
            style={{ 
              transform: isActive ? 'skewY(-12deg) scaleX(0.75)' : 'none',
              transformOrigin: '12px 12px',
              transition: 'transform 0.8s ease-in-out'
            }}
          />
          {/* Door handle */}
          <circle cx="38" cy="35" r="2" fill="#d4d4d8" />

          {/* Wall-mounted card reader */}
          <rect x="52" y="24" width="10" height="18" rx="1.5" fill="#0f172a" stroke="#334155" strokeWidth="1" />
          <rect x="54" y="27" width="6" height="4" fill={isActive ? '#22c55e' : '#ef4444'} className="animate-pulse" />
          
          {/* Card shape approaching reader */}
          <rect x="56" y="35" width="7" height="5" rx="0.5" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="0.5" opacity="0.8" />
        </svg>
      );

    case 18: // Automatic Parking Gate
      return (
        <svg width="100%" height="100%" viewBox="0 0 70 70" className="bg-[#18181b] rounded border border-[#2a2e39]/60 shadow-inner">
          {/* Ground floor line */}
          <line x1="5" y1="58" x2="65" y2="58" stroke="#3f3f46" strokeWidth="2" />
          
          {/* Gate barrier post/cabinet */}
          <rect x="15" y="30" width="14" height="28" rx="1.5" fill="#f8fafc" stroke="#64748b" strokeWidth="1.5" />
          {/* Accent red stripe on cabinet */}
          <rect x="15" y="36" width="14" height="4" fill="#ef4444" />
          {/* Pivot cap */}
          <circle cx="22" cy="38" r="3.5" fill="#334155" />

          {/* Barrier arm (yellow and black striped) */}
          <g 
            style={{ 
              transform: isActive ? 'rotate(-75deg)' : 'rotate(0deg)',
              transformOrigin: '22px 38px',
              transition: 'transform 1s ease-in-out' 
            }}
          >
            {/* The arm body */}
            <rect x="22" y="36" width="40" height="4" rx="1" fill="#fbbf24" stroke="#d97706" strokeWidth="0.5" />
            {/* Black stripes */}
            <path d="M29 36 L33 40 M39 36 L43 40 M49 36 L53 40 M59 36 L63 40" stroke="#1e293b" strokeWidth="3" />
          </g>

          {/* Status light */}
          <circle cx="22" cy="48" r="2" fill={isActive ? '#22c55e' : '#ef4444'} className={isActive ? 'animate-pulse' : ''} />
        </svg>
      );

    case 19: // Smart Parking Barrier
      return (
        <svg width="100%" height="100%" viewBox="0 0 70 70" className="bg-[#18181b] rounded border border-[#2a2e39]/60 shadow-inner">
          {/* Ground floor line */}
          <line x1="5" y1="58" x2="65" y2="58" stroke="#3f3f46" strokeWidth="2" />
          
          {/* Premium Delmi Smart Cabinet (Dark, blue glow) */}
          <rect x="14" y="24" width="16" height="34" rx="2.5" fill="#0b1329" stroke="#1b75d0" strokeWidth="1.5" />
          {/* Inner blue status LED screen */}
          <rect x="18" y="29" width="8" height="6" rx="0.5" fill={isActive ? '#1e1b4b' : '#030712'} stroke={isActive ? '#60a5fa' : '#1e293b'} strokeWidth="0.5" />
          {isActive && (
            <circle cx="22" cy="32" r="1.5" fill="#60a5fa" className="animate-ping" />
          )}
          {/* Pivot cap */}
          <circle cx="22" cy="42" r="4" fill="#1e293b" stroke="#1b75d0" strokeWidth="1" />

          {/* Barrier arm (Premium blue & white striped) */}
          <g 
            style={{ 
              transform: isActive ? 'rotate(-75deg)' : 'rotate(0deg)',
              transformOrigin: '22px 42px',
              transition: 'transform 0.8s cubic-bezier(0.4, 0, 0.2, 1)' 
            }}
          >
            {/* The arm body */}
            <rect x="22" y="40" width="42" height="4" rx="1" fill="#1b75d0" stroke="#1d4ed8" strokeWidth="0.5" />
            {/* White stripes */}
            <path d="M28 40 L31 44 M36 40 L39 44 M44 40 L47 44 M52 40 L55 44 M60 40 L63 44" stroke="#ffffff" strokeWidth="2.5" />
          </g>

          {/* Glowing bottom indicator */}
          <rect x="17" y="52" width="10" height="1.5" rx="0.5" fill={isActive ? '#22c55e' : '#ef4444'} className="animate-pulse" />
        </svg>
      );

    case 21: // Request-to-exit door control
      return (
        <svg width="100%" height="100%" viewBox="0 0 70 70" className="bg-[#18181b] rounded border border-[#2a2e39]/60 shadow-inner">
          {/* Door and frame */}
          <rect x="8" y="7" width="38" height="56" rx="1.5" fill="none" stroke="#64748b" strokeWidth="2" />
          <rect
            x="11"
            y="10"
            width="32"
            height="50"
            rx="1"
            fill="#273244"
            stroke="#475569"
            style={{
              transform: isActive ? 'skewY(-9deg) scaleX(0.86)' : 'none',
              transformOrigin: '11px 35px',
              transition: 'transform 0.45s ease-in-out'
            }}
          />
          <circle cx="37" cy="35" r="1.8" fill="#e2e8f0" />

          {/* Fail-safe maglock at the head of the door */}
          <rect x="27" y="8" width="16" height="4" rx="1" fill={isActive ? '#22c55e' : '#ef4444'} />
          <path d="M29 12 L41 12" stroke={isActive ? '#86efac' : '#fca5a5'} strokeWidth="1.2" />

          {/* REX station with secure/released pilot lamps */}
          <rect x="51" y="18" width="13" height="34" rx="2" fill="#202938" stroke="#475569" />
          <circle cx="57.5" cy="26" r="3" fill={isActive ? '#14532d' : '#ef4444'} />
          <circle cx="57.5" cy="35" r="3" fill={isActive ? '#22c55e' : '#14532d'} className={isActive ? 'animate-pulse' : ''} />
          <rect x="54" y="42" width="7" height="5" rx="1" fill="#e2e8f0" />
          <path d="M55.5 44.5 L59.5 44.5" stroke="#475569" strokeWidth="1" />
        </svg>
      );

    case 22: // Automatic sliding gate operator
      return (
        <svg width="100%" height="100%" viewBox="0 0 70 70" className="bg-[#18181b] rounded border border-[#2a2e39]/60 shadow-inner">
          <line x1="4" y1="57" x2="66" y2="57" stroke="#475569" strokeWidth="2" />
          <line x1="8" y1="60" x2="62" y2="60" stroke="#64748b" strokeWidth="1" strokeDasharray="3 2" />
          <rect x="5" y="18" width="7" height="40" rx="1" fill="#64748b" stroke="#94a3b8" />
          <rect x="58" y="18" width="7" height="40" rx="1" fill="#64748b" stroke="#94a3b8" />
          <g
            style={{
              transform: isActive ? 'translateX(-31px)' : 'translateX(0)',
              transition: 'transform 0.8s cubic-bezier(0.4, 0, 0.2, 1)'
            }}
          >
            <rect x="28" y="23" width="31" height="31" rx="1" fill="#172554" stroke="#60a5fa" strokeWidth="1.5" />
            {[34, 41, 48, 55].map(x => (
              <line key={x} x1={x} y1="26" x2={x} y2="51" stroke="#93c5fd" strokeWidth="1" opacity="0.65" />
            ))}
          </g>
          <rect x="8" y="39" width="12" height="18" rx="2" fill="#0b1329" stroke="#1b75d0" />
          <circle cx="14" cy="44" r="2" fill={isActive ? '#22c55e' : '#ef4444'} className={isActive ? 'animate-pulse' : ''} />
          <path d="M11 52 L17 52" stroke="#60a5fa" strokeWidth="1.5" />
        </svg>
      );

    case 23: // Emergency pull-station release
      return (
        <svg width="100%" height="100%" viewBox="0 0 70 70" className="bg-[#18181b] rounded border border-[#2a2e39]/60 shadow-inner">
          <rect x="6" y="14" width="22" height="42" rx="3" fill="#991b1b" stroke="#ef4444" strokeWidth="1.5" />
          <rect x="9" y="18" width="16" height="10" rx="1" fill="#f8fafc" />
          <text x="17" y="24.5" fill="#991b1b" fontSize="4" fontWeight="900" textAnchor="middle">PULL</text>
          <path
            d={isActive ? 'M10 33 L24 33 L21 49 L13 49 Z' : 'M10 31 L24 31 L22 43 L12 43 Z'}
            fill="#e2e8f0"
            stroke="#94a3b8"
            style={{ transition: 'd 0.25s ease-in-out' }}
          />
          <circle cx="39" cy="22" r="5" fill={isActive ? '#3f3f46' : '#22c55e'} />
          <circle cx="39" cy="38" r="5" fill={isActive ? '#ef4444' : '#3f3f46'} className={isActive ? 'animate-pulse' : ''} />
          <rect x="49" y="18" width="14" height="31" rx="2" fill="#263244" stroke="#64748b" />
          <rect x="51" y="20" width="10" height="5" rx="1" fill={isActive ? '#22c55e' : '#ef4444'} />
          <path d="M52 32 L60 32 M52 36 L60 36 M52 40 L60 40" stroke="#94a3b8" strokeWidth="1.5" />
          <text x="56" y="56" fill={isActive ? '#86efac' : '#fca5a5'} fontSize="4.5" fontWeight="800" textAnchor="middle">
            {isActive ? 'RELEASED' : 'LOCKED'}
          </text>
        </svg>
      );

    case 24: // Key-switch DPDT actuator control
      return (
        <svg width="100%" height="100%" viewBox="0 0 70 70" className="bg-[#18181b] rounded border border-[#2a2e39]/60 shadow-inner">
          <rect x="5" y="20" width="19" height="29" rx="3" fill="#e5e7eb" stroke="#94a3b8" />
          <circle cx="14.5" cy="34.5" r="6" fill="#1e293b" stroke={isActive ? '#22c55e' : '#94a3b8'} />
          <g
            style={{
              transform: isActive ? 'rotate(38deg)' : 'rotate(-38deg)',
              transformOrigin: '14.5px 34.5px',
              transition: 'transform 0.3s ease-in-out'
            }}
          >
            <rect x="13" y="32.5" width="12" height="4" rx="2" fill="#cbd5e1" />
          </g>
          <rect x="31" y="27" width="20" height="15" rx="3" fill="#334155" stroke="#64748b" />
          <rect x="48" y="30" width="15" height="9" rx="2" fill="#cbd5e1" stroke="#94a3b8" />
          <rect
            x="61"
            y="32"
            width={isActive ? 7 : 2}
            height="5"
            rx="1"
            fill="#f8fafc"
            style={{ transition: 'width 0.7s ease-in-out' }}
          />
          <path d="M27 34.5 L31 34.5 M51 34.5 L48 34.5" stroke="#60a5fa" strokeWidth="1.5" />
          <text x="38" y="52" fill={isActive ? '#86efac' : '#93c5fd'} fontSize="4.5" fontWeight="800" textAnchor="middle">
            {isActive ? 'EXTEND' : 'RETRACT'}
          </text>
        </svg>
      );

    default:
      return (
        <svg width="100%" height="100%" viewBox="0 0 70 70" className="bg-[#18181b] rounded border border-[#2a2e39]/60 shadow-inner">
          <circle cx="35" cy="35" r="15" fill="none" stroke="#64748b" strokeWidth="2.5" strokeDasharray="4,4" className="animate-spin" style={{ transformOrigin: '35px 35px', animationDuration: '4s' }} />
          <path d="M25 35 L32 42 L47 27" fill="none" stroke="#22c55e" strokeWidth="3" strokeLinecap="round" />
        </svg>
      );
  }
};
