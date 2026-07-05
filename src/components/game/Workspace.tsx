import React, { useState, useRef } from 'react';
import { useGameStore } from '../../store/useGameStore';
import { ComponentRenderer } from './components/ComponentRenderer';
import type { CircuitComponent, Wire } from '../../types/game';
import { getTerminalKey } from '../../simulation/circuitSolver';
import { Info } from 'lucide-react';

export const Workspace: React.FC = () => {
  const {
    components,
    wires,
    isRunning,
    simulation,
    updateComponentPosition,
    removeComponent,
    addWire,
    removeWire,
    multimeter,
    setProbe,
    probeMode,
    setProbeMode
  } = useGameStore();

  const [activeColor, setActiveColor] = useState<'red' | 'black' | 'green' | 'orange'>('red');
  const [draggedCompId, setDraggedCompId] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  // Wire drawing state
  const [drawingWireStart, setDrawingWireStart] = useState<{ componentId: string; terminalId: string } | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [hoveredTerminal, setHoveredTerminal] = useState<{ componentId: string; terminalId: string } | null>(null);

  // Selected wire state for deletion
  const [selectedWireId, setSelectedWireId] = useState<string | null>(null);

  // Wire size adjust state
  const [wireSize, setWireSize] = useState<'normal' | 'thin'>('normal');

  const svgRef = useRef<SVGSVGElement | null>(null);
  // Probe lead anchor points at bottom-left corner of canvas SVG
  const RED_ANCHOR = { x: 90, y: 498 };
  const BLK_ANCHOR = { x: 150, y: 498 };

  // Convert screen coordinates to SVG coordinates
  const getSVGCoords = (e: React.PointerEvent | MouseEvent) => {
    if (!svgRef.current) return { x: 0, y: 0 };
    const rect = svgRef.current.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
  };

  // Component Dragging — blocked in probe mode
  const handleCompPointerDown = (e: React.PointerEvent, comp: CircuitComponent) => {
    if (probeMode) return;
    const target = e.target as SVGElement;
    if (target.classList.contains('terminal-hitbox')) return;
    e.stopPropagation();
    setDraggedCompId(comp.id);
    const coords = getSVGCoords(e);
    setDragOffset({ x: coords.x - comp.x, y: coords.y - comp.y });
    // @ts-ignore
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handleCompPointerMove = (e: React.PointerEvent) => {
    if (draggedCompId) {
      e.stopPropagation();
      const coords = getSVGCoords(e);
      const gridX = Math.round((coords.x - dragOffset.x) / 10) * 10;
      const gridY = Math.round((coords.y - dragOffset.y) / 10) * 10;
      const clampedX = Math.max(80, Math.min(920, gridX));
      const clampedY = Math.max(80, Math.min(480, gridY));
      updateComponentPosition(draggedCompId, clampedX, clampedY);
    }
  };

  const handleCompPointerUp = (e: React.PointerEvent) => {
    if (draggedCompId) {
      e.stopPropagation();
      setDraggedCompId(null);
    }
  };

  // Wire Drawing — blocked in probe mode
  const handleTerminalPointerDown = (e: React.PointerEvent, componentId: string, terminalId: string) => {
    if (probeMode) return;
    e.stopPropagation();
    const coords = getSVGCoords(e);
    setDrawingWireStart({ componentId, terminalId });
    setMousePos(coords);
  };

  const handleTerminalPointerUp = (e: React.PointerEvent, componentId: string, terminalId: string) => {
    if (probeMode) return;
    e.stopPropagation();
    if (drawingWireStart) {
      const from = drawingWireStart;
      if (from.componentId !== componentId || from.terminalId !== terminalId) {
        addWire(from.componentId, from.terminalId, componentId, terminalId, activeColor);
      }
      setDrawingWireStart(null);
    }
  };

  // === PROBE CLICK HANDLER ===
  // In probe mode, clicking a terminal snaps the selected probe there
  const handleTerminalClick = (e: React.MouseEvent, componentId: string, terminalId: string) => {
    if (!probeMode) return;
    e.stopPropagation();
    setProbe(probeMode, { componentId, terminalId });
    // Auto-flow: after red → ask for black (if not already set)
    if (probeMode === 'red' && !multimeter.blackProbe) {
      setProbeMode('black');
    } else {
      setProbeMode(null);
    }
  };

  const handleWorkspacePointerMove = (e: React.PointerEvent) => {
    if (drawingWireStart) {
      const coords = getSVGCoords(e);
      setMousePos(coords);
    }
  };

  const handleWorkspacePointerUp = () => {
    if (drawingWireStart) {
      if (hoveredTerminal) {
        const from = drawingWireStart;
        if (from.componentId !== hoveredTerminal.componentId || from.terminalId !== hoveredTerminal.terminalId) {
          addWire(from.componentId, from.terminalId, hoveredTerminal.componentId, hoveredTerminal.terminalId, activeColor);
        }
      }
      setDrawingWireStart(null);
    }
  };

  // Local visual adjustment for terminal offsets to align exactly with component graphics
  const getTerminalLocalPos = (compType: string, term: { id: string; x: number; y: number }) => {
    let x = term.x;
    let y = term.y;
    if (compType === 'battery') {
      y = -30; // Move terminal connection points to the top battery caps
    } else if (compType === 'power_supply') {
      y = 43;  // Move terminal connection points to bottom screw strip
    }
    return { x, y };
  };

  // Find absolute coordinates of a terminal
  const getTerminalPos = (componentId: string, terminalId: string) => {
    const comp = components.find(c => c.id === componentId);
    if (!comp) return { x: 0, y: 0 };
    const term = comp.terminals.find(t => t.id === terminalId);
    if (!term) return { x: comp.x, y: comp.y };
    const local = getTerminalLocalPos(comp.type, term);
    return {
      x: comp.x + local.x,
      y: comp.y + local.y
    };
  };

  // Calculate sag path for wire curves
  const getWirePath = (x1: number, y1: number, x2: number, y2: number) => {
    const dx = Math.abs(x2 - x1);
    const dy = Math.abs(y2 - y1);
    const sag = Math.max(30, Math.min(100, (dx + dy) * 0.15));
    // Bezier control points sagging downwards
    return `M ${x1} ${y1} C ${x1} ${y1 + sag}, ${x2} ${y2 + sag}, ${x2} ${y2}`;
  };

  // Determine color coding
  const getWireColorHex = (colorName: string) => {
    switch (colorName) {
      case 'red': return '#ef4444';   // Positive / Hot
      case 'black': return '#526077'; // Negative / Neutral (slate grey-blue for high contrast)
      case 'green': return '#22c55e'; // PE Ground
      case 'orange': return '#f97316'; // Control loops
      default: return '#f59e0b';
    }
  };

  // Check if a wire has current flowing through it
  const isWireAnimating = (wire: Wire) => {
    if (!isRunning || simulation.shortCircuit) return false;
    
    // Check if either terminal has voltage > 0, and there are energized loads
    const fromKey = getTerminalKey(wire.fromComponentId, wire.fromTerminalId);
    const toKey = getTerminalKey(wire.toComponentId, wire.toTerminalId);
    
    const vFrom = simulation.nodeVoltages[fromKey] || 0;
    const vTo = simulation.nodeVoltages[toKey] || 0;

    // Current animates if there's any voltage and any component is active
    return (vFrom > 0 || vTo > 0) && simulation.energizedComponents.size > 0;
  };

  return (
    <div className="flex-1 flex flex-col relative h-[560px] bg-[#15171e] select-none border-b border-[#2a2e39]">
      
      {/* Canvas Toolbars */}
      <div className="h-12 border-b border-[#2a2e39] bg-industrial-gray-900/60 px-4 flex items-center justify-between text-xs font-bold text-industrial-gray-300">
        <div className="flex items-center gap-4">
          <span className="text-industrial-gray-400">WIRE COLOR:</span>
          <div className="flex gap-2">
            {(['red', 'black', 'green', 'orange'] as const).map(color => (
              <button
                key={color}
                onClick={() => setActiveColor(color)}
                className={`w-5 h-5 rounded-full border-2 transition-transform cursor-pointer relative ${
                  activeColor === color ? 'scale-110 ring-2 ring-indigo-500' : 'opacity-70'
                }`}
                style={{
                  backgroundColor: getWireColorHex(color),
                  borderColor: color === 'black' ? '#52525b' : '#18181b'
                }}
                title={`${color.toUpperCase()} Wire`}
              />
            ))}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setWireSize(prev => prev === 'normal' ? 'thin' : 'normal')}
            className="px-2.5 py-1 text-[10px] font-extrabold tracking-wider bg-[#2d303a] hover:bg-[#3c4252] text-slate-300 rounded border border-[#2a2e39] cursor-pointer uppercase transition-colors"
          >
            Size: {wireSize}
          </button>
          <div className="flex items-center gap-1.5 text-xs text-yellow-500 bg-yellow-500/10 px-2.5 py-1 rounded border border-yellow-500/20">
            <Info className="w-3.5 h-3.5" />
            <span>Triple-click component to delete. Click wire to select & delete.</span>
          </div>
        </div>
      </div>

      {/* === PROBE PLACEMENT BANNER === visible when probe mode is active */}
      {probeMode && (
        <div
          className={`absolute top-12 left-0 right-0 z-30 flex items-center justify-between px-5 py-2.5 font-black tracking-wide text-sm pointer-events-auto ${
            probeMode === 'red'
              ? 'bg-red-600 text-white border-b-2 border-red-300'
              : 'bg-slate-600 text-white border-b-2 border-slate-300'
          }`}
        >
          <span>
            {probeMode === 'red'
              ? '🔴 RED PROBE ACTIVE — Click any terminal on the canvas to attach'
              : '⚫ BLACK PROBE ACTIVE — Click any terminal on the canvas to attach'}
          </span>
          <button
            onClick={() => setProbeMode(null)}
            className="bg-black/30 hover:bg-black/50 px-3 py-1 rounded text-xs cursor-pointer transition-colors ml-4 font-bold"
          >
            ✕ Cancel
          </button>
        </div>
      )}

      {/* SVG Canvas Container */}
      <svg
        ref={svgRef}
        className={`workspace-grid w-full flex-grow relative touch-none ${probeMode ? 'cursor-cell' : 'cursor-crosshair'}`}
        onPointerMove={handleWorkspacePointerMove}
        onPointerUp={handleWorkspacePointerUp}
        onClick={() => { if (probeMode) setProbeMode(null); }}
        style={{ touchAction: 'none' }}
      >
        {/* Glow Filters */}
        <defs>
          <filter id="yellow-glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* 1. Wire connections layer */}
        {wires.map(wire => {
          const p1 = getTerminalPos(wire.fromComponentId, wire.fromTerminalId);
          const p2 = getTerminalPos(wire.toComponentId, wire.toTerminalId);
          const pathD = getWirePath(p1.x, p1.y, p2.x, p2.y);
          const isSelected = selectedWireId === wire.id;
          const isAnimating = isWireAnimating(wire);
          const hexColor = getWireColorHex(wire.color);

          const fromKey = getTerminalKey(wire.fromComponentId, wire.fromTerminalId);
          const toKey = getTerminalKey(wire.toComponentId, wire.toTerminalId);
          const vFrom = simulation.nodeVoltages[fromKey] || 0;
          const vTo = simulation.nodeVoltages[toKey] || 0;

          // Wire has voltage but no current flows (load is not active)
          const isBlocked = isRunning && !isAnimating && (vFrom > 0 || vTo > 0);
          
          // Wire is dead (no voltage at all because path is blocked before it)
          const isWireDead = isRunning && vFrom === 0 && vTo === 0;

          return (
            <g key={wire.id} className="group">
              {/* Thick interactive hitbox overlay */}
              <path
                d={pathD}
                fill="none"
                stroke="transparent"
                strokeWidth="15"
                className="cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedWireId(isSelected ? null : wire.id);
                }}
              />

              {/* Selection ring */}
              {isSelected && (
                <path
                  d={pathD}
                  fill="none"
                  stroke="#fbbf24"
                  strokeWidth={wireSize === 'normal' ? 5.5 : 3.5}
                  strokeLinecap="round"
                  opacity="0.8"
                />
              )}

              {/* Core wire body - turns dashed and dim if no voltage is flowing to/through it */}
              <path
                d={pathD}
                fill="none"
                stroke={hexColor}
                strokeWidth={wireSize === 'normal' ? 3 : 1.8}
                strokeLinecap="round"
                strokeDasharray={isWireDead ? "5,5" : "none"}
                opacity={isWireDead ? 0.45 : 1.0}
                filter={isSelected ? 'drop-shadow(0 2px 4px rgba(0,0,0,0.5))' : 'none'}
                style={{ transition: 'opacity 0.25s ease, stroke-dasharray 0.25s ease' }}
              />

              {/* Hot but blocked voltage indicator overlay (static yellow dots) */}
              {isBlocked && (
                <path
                  d={pathD}
                  fill="none"
                  stroke="#facc15"
                  strokeWidth={wireSize === 'normal' ? 2 : 1.2}
                  strokeLinecap="round"
                  strokeDasharray="2,6"
                  opacity="0.75"
                  filter="url(#yellow-glow)"
                />
              )}

              {/* Electron current flow overlay (flowing moving dots) */}
              {isAnimating && (
                <path
                  d={pathD}
                  fill="none"
                  stroke="#fbbf24"
                  strokeWidth={wireSize === 'normal' ? 2 : 1.2}
                  strokeLinecap="round"
                  strokeDasharray="6,10"
                  className="current-flow-dot"
                  filter="url(#yellow-glow)"
                />
              )}

              {/* Delete trigger button in middle of wire */}
              {isSelected && (
                <g 
                  transform={`translate(${(p1.x + p2.x) / 2}, ${(p1.y + p2.y) / 2 + 15})`}
                  className="cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeWire(wire.id);
                    setSelectedWireId(null);
                  }}
                >
                  <circle cx="0" cy="0" r="10" fill="#ef4444" stroke="#7f1d1d" strokeWidth="1" />
                  <line x1="-4" y1="-4" x2="4" y2="4" stroke="#ffffff" strokeWidth="1.5" />
                  <line x1="4" y1="-4" x2="-4" y2="4" stroke="#ffffff" strokeWidth="1.5" />
                </g>
              )}
            </g>
          );
        })}

        {/* 2. Live wire drawing overlay */}
        {drawingWireStart && (
          <path
            d={getWirePath(
              getTerminalPos(drawingWireStart.componentId, drawingWireStart.terminalId).x,
              getTerminalPos(drawingWireStart.componentId, drawingWireStart.terminalId).y,
              mousePos.x,
              mousePos.y
            )}
            fill="none"
            stroke={getWireColorHex(activeColor)}
            strokeWidth="3.5"
            strokeDasharray="4,4"
            opacity="0.8"
          />
        )}

        {/* 3. Placed components layer */}
        {components.map(comp => {
          const isEnergized = simulation.energizedComponents.has(comp.id);
          const isFaulty = simulation.faultLocation?.split(':')[0] === comp.id;

          return (
            <g
              key={comp.id}
              transform={`translate(${comp.x}, ${comp.y})`}
              onPointerDown={(e) => handleCompPointerDown(e, comp)}
              onPointerMove={handleCompPointerMove}
              onPointerUp={handleCompPointerUp}
              onClick={(e) => {
                e.stopPropagation();
                if (e.detail === 3) {
                  const confirmDelete = window.confirm(`Are you sure you want to remove the component: ${comp.label}?`);
                  if (confirmDelete) {
                    removeComponent(comp.id);
                  }
                }
              }}
              className="cursor-grab active:cursor-grabbing group"
            >
              {/* Highlight bounding box if diagnostic fault is here */}
              {isFaulty && (
                <rect
                  x="-55"
                  y="-55"
                  width="110"
                  height="110"
                  fill="none"
                  stroke="#ef4444"
                  strokeWidth="3.5"
                  strokeDasharray="4,4"
                  rx="6"
                  className="animate-pulse"
                />
              )}

              {/* Highlight selection glow */}
              <rect
                x="-52"
                y="-52"
                width="104"
                height="104"
                fill="transparent"
                stroke="rgba(99, 102, 241, 0.25)"
                strokeWidth="1.5"
                rx="6"
                className="opacity-0 group-hover:opacity-100 transition-opacity"
              />

              {/* Specific component graphic */}
              <ComponentRenderer component={comp} isEnergized={isEnergized} />

              {/* Terminals overlay */}
              {comp.terminals.map(term => {
                const termKey = getTerminalKey(comp.id, term.id);
                const hasVoltage = (simulation.nodeVoltages[termKey] || 0) > 0;
                
                // Color coordinate terminals
                let termColor = '#475569'; // neutral gray
                if (term.type === 'pos') termColor = '#ef4444'; // Red (+)
                else if (term.type === 'neg') termColor = '#3b4a5a'; // dark blue-grey (visible)
                else if (term.type === 'gnd') termColor = '#22c55e'; // Green PE

                const isDrawingStart = drawingWireStart?.componentId === comp.id && drawingWireStart?.terminalId === term.id;
                const isHovered = hoveredTerminal?.componentId === comp.id && hoveredTerminal?.terminalId === term.id;
                const isTargeting = !!drawingWireStart;

                // Check if this terminal has a probe badge
                const hasRedProbe = multimeter.redProbe?.componentId === comp.id && multimeter.redProbe?.terminalId === term.id;
                const hasBlackProbe = multimeter.blackProbe?.componentId === comp.id && multimeter.blackProbe?.terminalId === term.id;

                const localPos = getTerminalLocalPos(comp.type, term);

                return (
                  <g 
                    key={term.id} 
                    transform={`translate(${localPos.x}, ${localPos.y})`}
                    onPointerDown={(e) => handleTerminalPointerDown(e, comp.id, term.id)}
                    onPointerUp={(e) => handleTerminalPointerUp(e, comp.id, term.id)}
                    onClick={(e) => handleTerminalClick(e, comp.id, term.id)}
                    onPointerOver={() => setHoveredTerminal({ componentId: comp.id, terminalId: term.id })}
                    onPointerOut={() => setHoveredTerminal(null)}
                    className={probeMode ? 'cursor-cell' : 'cursor-pointer'}
                  >
                    <g 
                      transform={isHovered ? 'scale(1.4)' : 'scale(1)'} 
                      style={{ transition: 'transform 0.15s ease' }}
                    >
                      {/* Glowing aura if terminal has positive voltage */}
                      {hasVoltage && isRunning && (
                        <circle cx="0" cy="0" r="10" fill="#facc15" opacity="0.45" className="animate-pulse" />
                      )}

                      {/* Probe mode: pulsing target ring showing which probe will be placed */}
                      {probeMode && !hasRedProbe && !hasBlackProbe && (
                        <circle
                          cx="0" cy="0" r="17"
                          fill={probeMode === 'red' ? 'rgba(239,68,68,0.18)' : 'rgba(100,116,139,0.18)'}
                          stroke={probeMode === 'red' ? '#ef4444' : '#64748b'}
                          strokeWidth="2"
                          strokeDasharray="4,3"
                          className="animate-pulse"
                        />
                      )}

                      {/* Wire targeting ring */}
                      {isTargeting && !isDrawingStart && !isHovered && (
                        <circle cx="0" cy="0" r="11" fill="none" stroke="#818cf8" strokeWidth="1.5" className="animate-pulse" opacity="0.8" />
                      )}

                      {isDrawingStart && (
                        <circle cx="0" cy="0" r="11" fill="none" stroke="#c084fc" strokeWidth="2" className="animate-pulse" />
                      )}

                      {isHovered && (
                        <g>
                          <circle cx="0" cy="0" r="13" fill="none" stroke="#fbbf24" strokeWidth="2" className="glow-yellow animate-pulse" />
                          <circle cx="0" cy="0" r="8" fill="rgba(250, 204, 21, 0.25)" />
                        </g>
                      )}

                      {/* Snap zone hitbox */}
                      <circle cx="0" cy="0" r="16" fill="transparent" className="terminal-hitbox" />

                      {/* Metal ring */}
                      <circle cx="0" cy="0" r="6" fill="#cbd5e1" stroke="#334155" strokeWidth="1.5" />
                      
                      {/* Connection center stud */}
                      <circle cx="0" cy="0" r="3.5" fill={termColor} />

                      {/* Red probe indicator badge */}
                      {hasRedProbe && (
                        <g>
                          <circle cx="9" cy="-9" r="7" fill="#ef4444" stroke="#7f1d1d" strokeWidth="1.5" />
                          <text x="9" y="-5.5" fill="white" fontSize="8" fontWeight="900" textAnchor="middle">R</text>
                        </g>
                      )}

                      {/* Black probe indicator badge */}
                      {hasBlackProbe && (
                        <g>
                          <circle cx="9" cy="-9" r="7" fill="#334155" stroke="#0f172a" strokeWidth="1.5" />
                          <text x="9" y="-5.5" fill="#94a3b8" fontSize="8" fontWeight="900" textAnchor="middle">B</text>
                        </g>
                      )}

                      {/* Floating label */}
                      {isHovered ? (
                        <text y="-22" fill="#ffffff" fontSize="9" fontWeight="black" textAnchor="middle" filter="drop-shadow(0 1px 2px rgba(0,0,0,0.8))">
                          {probeMode
                            ? (probeMode === 'red' ? `🔴 Attach RED → ${term.name}` : `⚫ Attach BLK → ${term.name}`)
                            : term.name
                          }
                        </text>
                      ) : (
                        <text y="-10" fill="#a4b0cb" fontSize="7" fontWeight="bold" textAnchor="middle" opacity="0.6">
                          {term.name}
                        </text>
                      )}
                    </g>
                  </g>
                );
              })}
            </g>
          );
        })}

        {/* 4. Probe lead wires — draw from anchor dots to connected terminals */}
        {multimeter.redProbe && (() => {
          const pos = getTerminalPos(multimeter.redProbe.componentId, multimeter.redProbe.terminalId);
          return (
            <path
              d={getWirePath(RED_ANCHOR.x, RED_ANCHOR.y, pos.x, pos.y)}
              fill="none"
              stroke="#ef4444"
              strokeWidth="3"
              strokeLinecap="round"
              opacity="0.9"
            />
          );
        })()}

        {multimeter.blackProbe && (() => {
          const pos = getTerminalPos(multimeter.blackProbe.componentId, multimeter.blackProbe.terminalId);
          return (
            <path
              d={getWirePath(BLK_ANCHOR.x, BLK_ANCHOR.y, pos.x, pos.y)}
              fill="none"
              stroke="#475569"
              strokeWidth="3"
              strokeLinecap="round"
              opacity="0.9"
            />
          );
        })()}

        {/* Probe anchor indicator dots at bottom-left */}
        <g>
          <circle cx={RED_ANCHOR.x} cy={RED_ANCHOR.y} r="8" fill={multimeter.redProbe ? '#ef4444' : '#7f1d1d'} stroke="#b91c1c" strokeWidth="1.5" opacity="0.85" />
          <text x={RED_ANCHOR.x} y={RED_ANCHOR.y + 4} fill="white" fontSize="9" fontWeight="900" textAnchor="middle">R</text>
          <circle cx={BLK_ANCHOR.x} cy={BLK_ANCHOR.y} r="8" fill={multimeter.blackProbe ? '#475569' : '#1e293b'} stroke="#334155" strokeWidth="1.5" opacity="0.85" />
          <text x={BLK_ANCHOR.x} y={BLK_ANCHOR.y + 4} fill="#94a3b8" fontSize="9" fontWeight="900" textAnchor="middle">B</text>
        </g>
      </svg>
    </div>
  );
};


