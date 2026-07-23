import React, { useState, useRef, useEffect } from 'react';
import { useGameStore } from '../../store/useGameStore';
import { ComponentRenderer } from './components/ComponentRenderer';
import type { CircuitComponent, Wire } from '../../types/game';
import { getTerminalKey } from '../../simulation/circuitSolver';
import { levels } from '../../levels/levelData';
import { ArrowRight, CheckCircle2, Download, Info, Star, X, ZoomIn, ZoomOut } from 'lucide-react';
import { soundManager } from '../../audio/soundManager';
import { Timer6062Panel } from './Timer6062Panel';

const SPLICE_CONNECTOR_DEFAULT_SCALE = 1.67;
const SPLICE_CONNECTOR_MAX_SCALE = 2.4;
const TERMINAL_MAGNET_RADIUS_PX = 38;

interface SystemPowerRockerProps {
  isRunning: boolean;
  onToggle: () => void;
}

const SystemPowerRocker: React.FC<SystemPowerRockerProps> = ({ isRunning, onToggle }) => (
  <g
    role="button"
    aria-label={`System Power: ${isRunning ? 'ON' : 'OFF'}`}
    tabIndex={0}
    style={{ cursor: 'pointer', outline: 'none' }}
    onPointerDown={(event) => event.stopPropagation()}
    onClick={(event) => {
      event.stopPropagation();
      onToggle();
    }}
    onKeyDown={(event) => {
      if (event.key !== 'Enter' && event.key !== ' ') return;
      event.preventDefault();
      event.stopPropagation();
      onToggle();
    }}
  >
    <defs>
      <pattern id="system-power-waffle" width="4" height="4" patternUnits="userSpaceOnUse">
        <rect width="3" height="3" fill="#ffffff" opacity="0.12" />
        <rect width="4" height="4" fill="none" stroke="#000000" strokeWidth="0.5" opacity="0.25" />
      </pattern>
      <filter id="system-power-red-glow" x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur stdDeviation="4" result="blur" />
        <feMerge>
          <feMergeNode in="blur" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
      <linearGradient id="system-power-top-tilted" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#5c0d0d" />
        <stop offset="100%" stopColor="#2e0505" />
      </linearGradient>
      <linearGradient id="system-power-bottom-tilted" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#450a0a" />
        <stop offset="100%" stopColor="#240202" />
      </linearGradient>
      <linearGradient id="system-power-top-unlit" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#881337" />
        <stop offset="100%" stopColor="#5c0d0d" />
      </linearGradient>
      <linearGradient id="system-power-bottom-illuminated" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#ff4d4d" />
        <stop offset="35%" stopColor="#ef4444" />
        <stop offset="100%" stopColor="#b91c1c" />
      </linearGradient>
    </defs>

    <rect x="2" y="2" width="60" height="72" rx="6" fill="#18181b" stroke="#09090b" strokeWidth="2.5" />
    <rect x="5" y="5" width="54" height="66" rx="4" fill="#2d2d30" stroke="#121214" strokeWidth="1" />
    <rect x="8" y="8" width="48" height="60" rx="2" fill="#09090b" />

    {isRunning && (
      <path
        d="M 10,38 L 10,18 Q 10,12 13,12 Q 32,9 51,12 Q 54,12 54,18 L 54,58 Q 54,64 51,64 Q 32,67 13,64 Q 10,64 10,58 Z"
        fill="#ef4444"
        opacity="0.35"
        filter="url(#system-power-red-glow)"
      />
    )}

    {isRunning ? (
      <g>
        <path d="M 10,38 L 10,18 Q 10,12 13,12 Q 32,9 51,12 Q 54,12 54,18 L 54,38 Z" fill="url(#system-power-top-tilted)" />
        <path d="M 10,38 L 54,38 L 54,58 Q 54,64 51,64 Q 32,67 13,64 Q 10,64 10,58 Z" fill="url(#system-power-bottom-illuminated)" />
        <path d="M 10,38 L 10,18 Q 10,12 13,12 Q 32,9 51,12 Q 54,12 54,18 L 54,58 Q 54,64 51,64 Q 32,67 13,64 Q 10,64 10,58 Z" fill="url(#system-power-waffle)" />
        <line x1="10" y1="38" x2="54" y2="38" stroke="#7f1d1d" strokeWidth="1.5" />
        <line x1="10" y1="39" x2="54" y2="39" stroke="#f87171" strokeWidth="0.5" opacity="0.5" />
        <text x="32" y="26" fontSize="13" fontWeight="bold" fontFamily="system-ui, sans-serif" fill="#ffffff" textAnchor="middle" opacity="0.15">O</text>
        <text x="32" y="56" fontSize="13" fontWeight="bold" fontFamily="system-ui, sans-serif" fill="#ffe4e6" textAnchor="middle" filter="url(#system-power-red-glow)">I</text>
      </g>
    ) : (
      <g>
        <path d="M 10,38 L 10,18 Q 10,12 13,12 Q 32,9 51,12 Q 54,12 54,18 L 54,38 Z" fill="url(#system-power-top-unlit)" />
        <path d="M 10,38 L 54,38 L 54,58 Q 54,64 51,64 Q 32,67 13,64 Q 10,64 10,58 Z" fill="url(#system-power-bottom-tilted)" />
        <path d="M 10,38 L 10,18 Q 10,12 13,12 Q 32,9 51,12 Q 54,12 54,18 L 54,58 Q 54,64 51,64 Q 32,67 13,64 Q 10,64 10,58 Z" fill="url(#system-power-waffle)" />
        <line x1="10" y1="38" x2="54" y2="38" stroke="#450a0a" strokeWidth="1.5" />
        <line x1="10" y1="39" x2="54" y2="39" stroke="#b91c1c" strokeWidth="0.5" opacity="0.3" />
        <text x="32" y="26" fontSize="13" fontWeight="bold" fontFamily="system-ui, sans-serif" fill="#ffffff" textAnchor="middle" opacity="0.35">O</text>
        <text x="32" y="56" fontSize="13" fontWeight="bold" fontFamily="system-ui, sans-serif" fill="#ffffff" textAnchor="middle" opacity="0.12">I</text>
      </g>
    )}

    <rect x="0" y="0" width="64" height="76" fill="transparent" />
  </g>
);

export const Workspace: React.FC = () => {
  const {
    components,
    wires,
    isRunning,
    toggleSimulation,
    simulation,
    updateComponentPosition,
    setComponentState,
    addComponent,
    removeComponent,
    addWire,
    removeWire,
    updateWireWaypoints,
    reconnectWire,
    spliceWire,
    spliceAndConnectWire,
    multimeter,
    setProbe,
    probeMode,
    setProbeMode,
    currentLevelIndex,
    levelCompleted,
    timeElapsed,
    score,
    nextLevel,
    setViewMode,
    sidebarOpen,
    setSidebarOpen,
    bottomPanelOpen,
    setBottomPanelOpen,
    shortCircuitSmoke
  } = useGameStore();

  const [activeColor, setActiveColor] = useState<'red' | 'black' | 'green' | 'orange'>('red');
  const [zoomScale, setZoomScale] = useState<number>(1.0);
  const [draggedCompId, setDraggedCompId] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  // Wire drawing state
  const [drawingWireStart, setDrawingWireStart] = useState<{ componentId: string; terminalId: string } | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [hoveredTerminal, setHoveredTerminal] = useState<{ componentId: string; terminalId: string } | null>(null);
  const [tempWaypoints, setTempWaypoints] = useState<{ x: number; y: number }[]>([]);
  const [pointerDownCoords, setPointerDownCoords] = useState<{ x: number; y: number } | null>(null);
  const [draggingWireEndpoint, setDraggingWireEndpoint] = useState<{
    wireId: string;
    endpoint: 'from' | 'to';
  } | null>(null);

  // Selected wire state for deletion
  const [selectedWireId, setSelectedWireId] = useState<string | null>(null);
  const [draggingWireRoute, setDraggingWireRoute] = useState<{
    wireId: string;
    waypointIndex: number | null;
    start: { x: number; y: number };
    originalWaypoints: { x: number; y: number }[];
  } | null>(null);

  // Hovered component state for controls overlay
  const [hoveredCompId, setHoveredCompId] = useState<string | null>(null);
  const [selectedTimerId, setSelectedTimerId] = useState<string | null>(null);

  // Wire size adjust state
  const [wireSize, setWireSize] = useState<'normal' | 'thin'>('thin');
  const [completionBarDismissed, setCompletionBarDismissed] = useState(false);

  const svgRef = useRef<SVGSVGElement | null>(null);
  const wireDragMovedRef = useRef(false);

  useEffect(() => {
    if (!levelCompleted) setCompletionBarDismissed(false);
  }, [currentLevelIndex, levelCompleted]);

  useEffect(() => {
    if (selectedTimerId && !components.some(component => component.id === selectedTimerId && component.type === 'timer_relay')) {
      setSelectedTimerId(null);
    }
  }, [components, selectedTimerId]);

  const startFocusedWireDrawing = (start: { componentId: string; terminalId: string }) => {
    setDrawingWireStart(start);
    setSidebarOpen(false);
    setBottomPanelOpen(false);
  };

  const cancelWireDrawing = () => {
    setDrawingWireStart(null);
    setDraggingWireEndpoint(null);
    setHoveredTerminal(null);
    setTempWaypoints([]);
    setPointerDownCoords(null);
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      setProbeMode(null);
      setDrawingWireStart(null);
      setDraggingWireEndpoint(null);
      setHoveredTerminal(null);
      setTempWaypoints([]);
      setPointerDownCoords(null);
      setDraggingWireRoute(null);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setProbeMode]);

  // Listen to window resize to recalculate dynamic DMM anchor positions
  const [resizeToggle, setResizeToggle] = useState(0);
  useEffect(() => {
    const handleResize = () => setResizeToggle(prev => prev + 1);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const svgEl = svgRef.current;
    if (!svgEl) return;

    const observer = new ResizeObserver(() => {
      setResizeToggle(prev => prev + 1);
    });
    observer.observe(svgEl);

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const timers = [80, 180, 320].map(delay =>
      window.setTimeout(() => setResizeToggle(prev => prev + 1), delay)
    );
    return () => timers.forEach(window.clearTimeout);
  }, [sidebarOpen, bottomPanelOpen]);

  const [offsets, setOffsets] = useState({ shiftX: 0, shiftY: 0 });

  const primaryTransformerId = components.find(component => component.type === 'transformer')?.id;
  const primaryPowerSupplyId = components.find(component => component.type === 'power_supply')?.id;

  // The project power station is a fixed part of the connection page rather
  // than part of the circuit that is dynamically centered. Coordinates are
  // converted back into the scaled SVG space so its terminals and wires still
  // behave exactly like every other circuit component.
  const getComponentCanvasPosition = (component: CircuitComponent) => {
    const sourceLeft = (20 - offsets.shiftX) / zoomScale;
    const sourceTop = (20 - offsets.shiftY) / zoomScale;

    if (component.id === primaryTransformerId) {
      return { x: sourceLeft + 151, y: sourceTop + 85 };
    }

    if (component.id === primaryPowerSupplyId) {
      return { x: sourceLeft + 151, y: sourceTop + 295 };
    }

    // Keep project devices out of the fixed source column. This is especially
    // important in compact projects whose original first control was placed at
    // the same coordinates now occupied by the Altronix supply.
    const screenX = offsets.shiftX + component.x * zoomScale;
    const screenY = offsets.shiftY + component.y * zoomScale;
    const sourceStationRight = 20 + 259 * zoomScale;
    const sourceStationBottom = 20 + 360 * zoomScale;
    const overlapsSourceColumn =
      screenX < sourceStationRight + 80 * zoomScale &&
      screenY < sourceStationBottom + 30 * zoomScale;

    if (overlapsSourceColumn) {
      return {
        x: (sourceStationRight + 90 * zoomScale - offsets.shiftX) / zoomScale,
        y: component.y
      };
    }

    return { x: component.x, y: component.y };
  };

  // Center components dynamically
  useEffect(() => {
    if (!svgRef.current || components.length === 0) return;
    const rect = svgRef.current.getBoundingClientRect();
    const svgWidth = rect.width;
    const svgHeight = rect.height;

    let minX = Infinity;
    let maxX = -Infinity;
    let minY = Infinity;
    let maxY = -Infinity;

    const projectComponents = components.filter(component =>
      component.type !== 'transformer' && component.type !== 'power_supply'
    );
    const componentsToCenter = projectComponents.length > 0 ? projectComponents : components;

    componentsToCenter.forEach(c => {
      const halfWidth = c.type === 'actuator'
        ? 170
        : c.type === 'sliding_gate'
        ? 125
        : c.type === 'parking_gate'
        ? 105
        : c.type === 'power_supply'
          ? 85
          : 70;
      const halfHeight = c.type === 'pull_station'
        ? 94
        : c.type === 'key_switch'
        ? 82
        : c.type === 'relay_dpdt'
        ? 92
        : c.type === 'transformer' || c.type === 'power_supply'
        ? 85
        : 70;
      minX = Math.min(minX, c.x - halfWidth);
      maxX = Math.max(maxX, c.x + halfWidth);
      minY = Math.min(minY, c.y - halfHeight);
      maxY = Math.max(maxY, c.y + halfHeight);
    });

    const compWidth = maxX - minX;
    const compHeight = maxY - minY;
    const bottomOverlayHeight = bottomPanelOpen ? (window.innerWidth >= 768 ? 160 : 176) : 0;
    const usableHeight = Math.max(240, svgHeight - bottomOverlayHeight);
    const targetCenterX = svgWidth / 2;
    const targetCenterY = usableHeight / 2;
    const compCenterX = minX + compWidth / 2;
    const compCenterY = minY + compHeight / 2;

    setOffsets({
      shiftX: targetCenterX - compCenterX * zoomScale,
      shiftY: targetCenterY - compCenterY * zoomScale
    });
  }, [components, zoomScale, sidebarOpen, bottomPanelOpen, resizeToggle]);

  // Convert screen coordinates of DMM ports to SVG coordinates relative to the SVG container
  const getPortCoords = (portId: string) => {
    const portEl = document.getElementById(portId);
    const svgEl = svgRef.current;
    if (!portEl || !svgEl) {
      if (svgEl) {
        const rect = svgEl.getBoundingClientRect();
        return portId === 'dmm-red-port' 
          ? { x: rect.width / 2 - 20, y: rect.height - 5 } 
          : { x: rect.width / 2 + 20, y: rect.height - 5 };
      }
      return portId === 'dmm-red-port' ? { x: 405, y: 500 } : { x: 441, y: 500 };
    }
    const portRect = portEl.getBoundingClientRect();
    const svgRect = svgEl.getBoundingClientRect();
    return {
      x: portRect.left + portRect.width / 2 - svgRect.left,
      y: portRect.top + portRect.height / 2 - svgRect.top
    };
  };

  // Convert screen coordinates to SVG coordinates
  const getSVGCoords = (e: React.PointerEvent | MouseEvent) => {
    if (!svgRef.current) return { x: 0, y: 0 };
    const rect = svgRef.current.getBoundingClientRect();
    return {
      x: (e.clientX - rect.left - offsets.shiftX) / zoomScale,
      y: (e.clientY - rect.top - offsets.shiftY) / zoomScale
    };
  };

  const handleDownloadSchematic = () => {
    if (!svgRef.current) return;
    const serializer = new XMLSerializer();
    let source = serializer.serializeToString(svgRef.current);
    if (!source.match(/^<svg[^>]+xmlns="http:\/\/www\.w3\.org\/2000\/svg"/)) {
      source = source.replace(/^<svg/, '<svg xmlns="http://www.w3.org/2000/svg"');
    }
    if (!source.match(/^<svg[^>]+xmlns:xlink="http:\/\/www\.w3\.org\/1999\/xlink"/)) {
      source = source.replace(/^<svg/, '<svg xmlns:xlink="http://www.w3.org/1999/xlink"');
    }
    
    // Inject a solid dark background rect as the first element inside <svg ...>
    const svgTagMatch = source.match(/^<svg[^>]*>/);
    if (svgTagMatch) {
      const svgTag = svgTagMatch[0];
      const bgRect = '<rect width="100%" height="100%" fill="#15171e" />';
      const styleNode = '<style>text { font-family: monospace, sans-serif; }</style>';
      source = source.replace(svgTag, `${svgTag}\n${bgRect}\n${styleNode}`);
    }

    source = '<?xml version="1.0" encoding="utf-8"?>\n' + source;
    const url = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(source);
    const link = document.createElement('a');
    link.href = url;
    link.download = `schematic_level_${currentLevelIndex + 1}.svg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Component Dragging — blocked in probe mode
  const handleCompPointerDown = (e: React.PointerEvent, comp: CircuitComponent) => {
    if (probeMode) return;
    const target = e.target as SVGElement;
    if (target.closest('.connector-control')) return;
    if (target.classList.contains('terminal-hitbox')) return;
    if (comp.state.lockedPosition) {
      e.stopPropagation();
      return;
    }
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
      const clampedX = Math.max(-120, Math.min(920, gridX));
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
    const target = e.target as SVGElement;
    if (target.closest('.terminal-branch-control')) return;
    e.stopPropagation();
    if (drawingWireStart) {
      // Already routing, let pointerup on the terminal complete it
      return;
    }
    const coords = getSVGCoords(e);
    
    // Auto-select color based on terminal type by default:
    const comp = components.find(c => c.id === componentId);
    const term = comp?.terminals.find(t => t.id === terminalId);
    if (term) {
      if (term.type === 'pos') {
        setActiveColor('red');
      } else if (term.type === 'neg') {
        setActiveColor('black');
      } else if (term.type === 'gnd') {
        setActiveColor('green');
      }
    }
    
    startFocusedWireDrawing({ componentId, terminalId });
    setMousePos(coords);
    setPointerDownCoords(coords);
  };

  const getTerminalWireCount = (componentId: string, terminalId: string) => {
    return wires.filter(w =>
      (w.fromComponentId === componentId && w.fromTerminalId === terminalId) ||
      (w.toComponentId === componentId && w.toTerminalId === terminalId)
    ).length;
  };

  const getTerminalBranchColor = (componentId: string, terminalId: string) => {
    const existingWire = wires.find(w =>
      (w.fromComponentId === componentId && w.fromTerminalId === terminalId) ||
      (w.toComponentId === componentId && w.toTerminalId === terminalId)
    );
    return existingWire?.color || activeColor;
  };

  const startBranchFromTerminal = (componentId: string, terminalId: string) => {
    const branchColor = getTerminalBranchColor(componentId, terminalId);
    setActiveColor(branchColor);
    startFocusedWireDrawing({ componentId, terminalId });
    setMousePos(getTerminalPos(componentId, terminalId));
    setPointerDownCoords(getTerminalPos(componentId, terminalId));
    setTempWaypoints([]);
    setSelectedWireId(null);
    soundManager.playClick();
  };

  const finishWireAtTerminal = (target: { componentId: string; terminalId: string }) => {
    if (!drawingWireStart) return;
    const isStartTerminal =
      drawingWireStart.componentId === target.componentId &&
      drawingWireStart.terminalId === target.terminalId;

    if (!isStartTerminal) {
      if (draggingWireEndpoint) {
        reconnectWire(
          draggingWireEndpoint.wireId,
          draggingWireEndpoint.endpoint,
          target.componentId,
          target.terminalId
        );
      } else {
        addWire(
          drawingWireStart.componentId,
          drawingWireStart.terminalId,
          target.componentId,
          target.terminalId,
          activeColor,
          tempWaypoints
        );
      }
    }

    cancelWireDrawing();
  };

  const handleTerminalPointerUp = (e: React.PointerEvent, componentId: string, terminalId: string) => {
    if (probeMode) return;
    e.stopPropagation();
    if (drawingWireStart) {
      finishWireAtTerminal({ componentId, terminalId });
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
      const snapTarget = getPointerTerminal(e, coords);
      setMousePos(snapTarget ? getTerminalPos(snapTarget.componentId, snapTarget.terminalId) : coords);
      setHoveredTerminal(previous => {
        if (
          previous?.componentId === snapTarget?.componentId &&
          previous?.terminalId === snapTarget?.terminalId
        ) return previous;
        return snapTarget;
      });
    }
  };

  const handleWorkspacePointerDown = (e: React.PointerEvent) => {
    const target = e.target as SVGElement;
    if (target.closest('.cursor-grab') || probeMode) return;
    const coords = getSVGCoords(e);
    setPointerDownCoords(coords);
  };

  const handleWorkspacePointerUp = (e: React.PointerEvent) => {
    setPointerDownCoords(null);
    if (drawingWireStart) {
      const coords = getSVGCoords(e);
      const snapTarget = getPointerTerminal(e, coords) || hoveredTerminal;
      if (snapTarget) {
        finishWireAtTerminal(snapTarget);
      } else {
        // Drag release on empty space: check if it's a click to add waypoint
        if (pointerDownCoords) {
          const dist = Math.sqrt(Math.pow(coords.x - pointerDownCoords.x, 2) + Math.pow(coords.y - pointerDownCoords.y, 2));
          if (dist < 6) {
            setTempWaypoints(prev => [...prev, nudgePointOutsideDevices({
              x: snapWireCoord(coords.x),
              y: snapWireCoord(coords.y)
            })]);
            soundManager.playClick();
          }
        }
      }
    }
  };

  // Local visual adjustment for terminal offsets to align exactly with component graphics
  const getTerminalLocalPos = (comp: CircuitComponent, term: { id: string; x: number; y: number }) => {
    let x = term.x;
    let y = term.y;
    if (comp.type === 'battery') {
      y = -30; // Move terminal connection points to the top battery caps
    } else if (comp.type === 'power_supply') {
      y = 43;  // Move terminal connection points to bottom screw strip
    } else if (comp.type === 'relay_dpdt') {
      const sidePorts: Record<string, { x: number; y: number }> = {
        no1: { x: -52, y: -39 },
        nc1: { x: -52, y: -13 },
        com1: { x: -52, y: 13 },
        coil_b: { x: -52, y: 39 },
        no2: { x: 52, y: -39 },
        nc2: { x: 52, y: -13 },
        com2: { x: 52, y: 13 },
        coil_a: { x: 52, y: 39 }
      };
      const sidePort = sidePorts[term.id];
      if (sidePort) {
        x = sidePort.x;
        y = sidePort.y;
      }
    } else if (comp.type === 'junction') {
      const scale = comp.state?.scale || SPLICE_CONNECTOR_DEFAULT_SCALE;
      x = term.x * scale;
      y = term.y * scale;
    }
    return { x, y };
  };

  // Find absolute coordinates of a terminal
  const getTerminalPos = (componentId: string, terminalId: string) => {
    const comp = components.find(c => c.id === componentId);
    if (!comp) return { x: 0, y: 0 };
    const position = getComponentCanvasPosition(comp);
    const term = comp.terminals.find(t => t.id === terminalId);
    if (!term) return position;
    const local = getTerminalLocalPos(comp, term);
    return {
      x: position.x + local.x,
      y: position.y + local.y
    };
  };

  const getNearestTerminal = (
    point: { x: number; y: number },
    excluded = drawingWireStart
  ) => {
    const magnetRadius = TERMINAL_MAGNET_RADIUS_PX / zoomScale;
    let nearest: { componentId: string; terminalId: string; distance: number } | null = null;

    for (const component of components) {
      for (const terminal of component.terminals) {
        if (
          excluded?.componentId === component.id &&
          excluded?.terminalId === terminal.id
        ) continue;
        const terminalPosition = getTerminalPos(component.id, terminal.id);
        const distance = Math.hypot(point.x - terminalPosition.x, point.y - terminalPosition.y);
        if (distance <= magnetRadius && (!nearest || distance < nearest.distance)) {
          nearest = { componentId: component.id, terminalId: terminal.id, distance };
        }
      }
    }

    return nearest
      ? { componentId: nearest.componentId, terminalId: nearest.terminalId }
      : null;
  };

  const getPointerTerminal = (
    event: React.PointerEvent,
    coords = getSVGCoords(event)
  ) => {
    const element = document.elementFromPoint(event.clientX, event.clientY);
    const hitbox = element?.closest('.terminal-hitbox');
    const componentId = hitbox?.getAttribute('data-component-id');
    const terminalId = hitbox?.getAttribute('data-terminal-id');
    if (
      componentId &&
      terminalId &&
      !(
        drawingWireStart?.componentId === componentId &&
        drawingWireStart?.terminalId === terminalId
      )
    ) {
      return { componentId, terminalId };
    }
    return getNearestTerminal(coords);
  };

  type WirePoint = { x: number; y: number };
  type WireDirection = { x: -1 | 0 | 1; y: -1 | 0 | 1 };

  const WIRE_GRID = 16;
  const WIRE_TERMINAL_STEM = 10;
  const WIRE_TERMINAL_LEAD = 32;
  const WIRE_FAN_SPACING = 9;
  const WIRE_ROUTE_CLEARANCE = 14;
  const wireRouteCache = new Map<string, WirePoint[]>();
  const snapWireCoord = (value: number) => Math.round(value / WIRE_GRID) * WIRE_GRID;

  const sameWirePoint = (a: WirePoint, b: WirePoint) =>
    Math.abs(a.x - b.x) < 0.5 && Math.abs(a.y - b.y) < 0.5;

  const simplifyWirePoints = (source: WirePoint[]) => {
    const deduped = source.filter((point, index) => index === 0 || !sameWirePoint(point, source[index - 1]));
    if (deduped.length < 3) return deduped;

    const simplified: WirePoint[] = [deduped[0]];
    for (let index = 1; index < deduped.length - 1; index++) {
      const previous = simplified[simplified.length - 1];
      const current = deduped[index];
      const next = deduped[index + 1];
      const isVertical = Math.abs(previous.x - current.x) < 0.5 && Math.abs(current.x - next.x) < 0.5;
      const isHorizontal = Math.abs(previous.y - current.y) < 0.5 && Math.abs(current.y - next.y) < 0.5;
      if (!isVertical && !isHorizontal) simplified.push(current);
    }
    simplified.push(deduped[deduped.length - 1]);
    return simplified;
  };

  // Calculate a straight, traceable fallback path for probe leads and simple wires
  const getWirePath = (x1: number, y1: number, x2: number, y2: number) => {
    if (Math.abs(x2 - x1) < 6 || Math.abs(y2 - y1) < 6) {
      return `M ${x1} ${y1} L ${x2} ${y2}`;
    }
    const midX = snapWireCoord((x1 + x2) / 2);
    return `M ${x1} ${y1} L ${midX} ${y1} L ${midX} ${y2} L ${x2} ${y2}`;
  };

  // Find the visual half-way point along the rendered route, not the straight endpoint average.
  const getWireCenterPos = (wire: Wire) => {
    const points = getWireSegmentsPoints(wire);
    if (points.length < 2) return points[0] || { x: 0, y: 0 };

    const segmentLengths = points.slice(0, -1).map((point, index) =>
      Math.hypot(points[index + 1].x - point.x, points[index + 1].y - point.y)
    );
    const target = segmentLengths.reduce((sum, length) => sum + length, 0) / 2;
    let travelled = 0;

    for (let index = 0; index < segmentLengths.length; index++) {
      const length = segmentLengths[index];
      if (travelled + length >= target) {
        const ratio = length === 0 ? 0 : (target - travelled) / length;
        return {
          x: points[index].x + (points[index + 1].x - points[index].x) * ratio,
          y: points[index].y + (points[index + 1].y - points[index].y) * ratio
        };
      }
      travelled += length;
    }

    return points[points.length - 1];
  };

  const getEditableWaypointsForWire = (wire: Wire) => {
    if (wire.waypoints && wire.waypoints.length > 0) return wire.waypoints;
    return [getWireCenterPos(wire)];
  };

  const beginWireRouteDrag = (
    e: React.PointerEvent,
    wire: Wire,
    waypointIndex: number | null
  ) => {
    e.stopPropagation();
    wireDragMovedRef.current = false;
    const coords = getSVGCoords(e);
    const originalWaypoints = getEditableWaypointsForWire(wire);
    setDraggingWireRoute({
      wireId: wire.id,
      waypointIndex,
      start: coords,
      originalWaypoints
    });
    // @ts-ignore
    e.currentTarget.setPointerCapture?.(e.pointerId);
  };

  const beginWireEndpointReconnect = (
    e: React.PointerEvent,
    wire: Wire,
    endpoint: 'from' | 'to'
  ) => {
    e.stopPropagation();
    const fixedTerminal = endpoint === 'from'
      ? { componentId: wire.toComponentId, terminalId: wire.toTerminalId }
      : { componentId: wire.fromComponentId, terminalId: wire.fromTerminalId };
    const movingTerminal = endpoint === 'from'
      ? { componentId: wire.fromComponentId, terminalId: wire.fromTerminalId }
      : { componentId: wire.toComponentId, terminalId: wire.toTerminalId };

    setDraggingWireEndpoint({ wireId: wire.id, endpoint });
    setSelectedWireId(wire.id);
    setActiveColor(wire.color);
    setTempWaypoints([]);
    startFocusedWireDrawing(fixedTerminal);
    setHoveredTerminal(movingTerminal);
    setMousePos(getTerminalPos(movingTerminal.componentId, movingTerminal.terminalId));
    setPointerDownCoords(getTerminalPos(movingTerminal.componentId, movingTerminal.terminalId));
    soundManager.playClick();
    // @ts-ignore
    e.currentTarget.setPointerCapture?.(e.pointerId);
  };

  const handleWireRouteDragMove = (e: React.PointerEvent) => {
    if (!draggingWireRoute) return;
    e.stopPropagation();
    const wire = wires.find(w => w.id === draggingWireRoute.wireId);
    if (!wire) return;

    const coords = getSVGCoords(e);
    const dx = coords.x - draggingWireRoute.start.x;
    const dy = coords.y - draggingWireRoute.start.y;
    if (Math.abs(dx) > 2 || Math.abs(dy) > 2) {
      wireDragMovedRef.current = true;
    }

    const nextWaypoints = draggingWireRoute.originalWaypoints.map((wp, idx) => {
      if (draggingWireRoute.waypointIndex !== null && idx !== draggingWireRoute.waypointIndex) {
        return wp;
      }
      return nudgePointOutsideDevices({
        x: snapWireCoord(wp.x + dx),
        y: snapWireCoord(wp.y + dy)
      }, wire);
    });

    updateWireWaypoints(wire.id, nextWaypoints);
  };

  const handleWireRouteDragEnd = (e: React.PointerEvent) => {
    if (!draggingWireRoute) return;
    e.stopPropagation();
    if (wireDragMovedRef.current) {
      setSelectedWireId(draggingWireRoute.wireId);
    }
    setDraggingWireRoute(null);
  };

  const getSplitWaypoints = (wire: Wire, x: number, y: number) => {
    const points = getWireSegmentsPoints(wire);
    let minDistance = Infinity;
    let splitPoint = points[0] || { x, y };
    let splitSegment = { start: points[0] || splitPoint, end: points[1] || splitPoint };
    const routeCandidates: Array<{
      point: WirePoint;
      segment: { start: WirePoint; end: WirePoint };
      distance: number;
    }> = [];
    
    for (let i = 0; i < points.length - 1; i++) {
      const p1 = points[i];
      const p2 = points[i + 1];
      
      const A = x - p1.x;
      const B = y - p1.y;
      const C = p2.x - p1.x;
      const D = p2.y - p1.y;
      
      const dot = A * C + B * D;
      const lenSq = C * C + D * D;
      let param = -1;
      if (lenSq !== 0) param = dot / lenSq;
      
      let xx, yy;
      if (param < 0) {
        xx = p1.x;
        yy = p1.y;
      } else if (param > 1) {
        xx = p2.x;
        yy = p2.y;
      } else {
        xx = p1.x + param * C;
        yy = p1.y + param * D;
      }
      
      const dx = x - xx;
      const dy = y - yy;
      const dist = Math.sqrt(dx * dx + dy * dy);
      routeCandidates.push({
        point: { x: xx, y: yy },
        segment: { start: p1, end: p2 },
        distance: dist
      });

      const segmentLength = Math.hypot(C, D);
      for (let travelled = WIRE_GRID; travelled < segmentLength; travelled += WIRE_GRID) {
        const ratio = travelled / segmentLength;
        const candidate = { x: p1.x + C * ratio, y: p1.y + D * ratio };
        routeCandidates.push({
          point: candidate,
          segment: { start: p1, end: p2 },
          distance: Math.hypot(x - candidate.x, y - candidate.y)
        });
      }
      
      if (dist < minDistance) {
        minDistance = dist;
        splitPoint = { x: xx, y: yy };
        splitSegment = { start: p1, end: p2 };
      }
    }

    const terminalStart = points[0] || splitPoint;
    const terminalEnd = points[points.length - 1] || splitPoint;
    const connectorClearance = components.map(component => getComponentBounds(component, 38));
    const safeCandidate = routeCandidates
      .filter(candidate =>
        Math.hypot(candidate.point.x - terminalStart.x, candidate.point.y - terminalStart.y) > 46 &&
        Math.hypot(candidate.point.x - terminalEnd.x, candidate.point.y - terminalEnd.y) > 46 &&
        !connectorClearance.some(bounds =>
          candidate.point.x > bounds.left &&
          candidate.point.x < bounds.right &&
          candidate.point.y > bounds.top &&
          candidate.point.y < bounds.bottom
        )
      )
      .sort((a, b) => a.distance - b.distance)[0];
    if (safeCandidate) {
      splitPoint = safeCandidate.point;
      splitSegment = safeCandidate.segment;
    }

    let connectorNudged = false;
    for (let pass = 0; pass < 3; pass++) {
      const blockedBy = components
        .map(component => getComponentBounds(component, 46))
        .find(bounds =>
          splitPoint.x > bounds.left &&
          splitPoint.x < bounds.right &&
          splitPoint.y > bounds.top &&
          splitPoint.y < bounds.bottom
        );
      if (!blockedBy) break;

      const clearOptions = [
        { x: blockedBy.left - 8, y: splitPoint.y },
        { x: blockedBy.right + 8, y: splitPoint.y },
        { x: splitPoint.x, y: blockedBy.top - 8 },
        { x: splitPoint.x, y: blockedBy.bottom + 8 }
      ].sort((a, b) =>
        Math.hypot(a.x - splitPoint.x, a.y - splitPoint.y) -
        Math.hypot(b.x - splitPoint.x, b.y - splitPoint.y)
      );
      splitPoint = clearOptions[0];
      connectorNudged = true;
    }

    const waypoints = wire.waypoints || [];
    const waypoints1 = waypoints.length > 0
      ? waypoints.filter(point => {
          const start = getTerminalPos(wire.fromComponentId, wire.fromTerminalId);
          return Math.hypot(point.x - start.x, point.y - start.y) < Math.hypot(splitPoint.x - start.x, splitPoint.y - start.y);
        })
      : [];
    const waypoints2 = waypoints.length > 0
      ? waypoints.filter(point => !waypoints1.includes(point))
      : [];

    return {
      x: connectorNudged
        ? snapWireCoord(splitPoint.x)
        : Math.abs(splitSegment.start.y - splitSegment.end.y) < 0.5
        ? snapWireCoord(splitPoint.x)
        : splitPoint.x,
      y: connectorNudged
        ? snapWireCoord(splitPoint.y)
        : Math.abs(splitSegment.start.x - splitSegment.end.x) < 0.5
        ? snapWireCoord(splitPoint.y)
        : splitPoint.y,
      waypoints1,
      waypoints2
    };
  };

  const getTerminalExitDirection = (compId: string, termId: string): WireDirection => {
    const comp = components.find(c => c.id === compId);
    if (!comp) return { x: 0, y: 1 };
    const term = comp.terminals.find(t => t.id === termId);
    if (!term) return { x: 0, y: 1 };
    const local = getTerminalLocalPos(comp, term);

    // Top-edge wiring is visually ambiguous because it can look like the route is
    // passing through the device. Send those terminals toward the nearest side;
    // bottom and side terminals keep their natural outward direction.
    const sideExit = (): WireDirection => {
      if (local.x < -4) return { x: -1, y: 0 };
      if (local.x > 4) return { x: 1, y: 0 };
      const terminalIndex = comp.terminals.findIndex(candidate => candidate.id === termId);
      return { x: terminalIndex % 2 === 0 ? -1 : 1, y: 0 };
    };

    if (local.y < -4) return sideExit();
    if (comp.type === 'power_supply' || comp.type === 'timer_relay') return { x: 0, y: 1 };
    if (comp.type === 'transformer') return { x: 0, y: 1 };
    if (comp.type === 'junction') {
      return { x: 0, y: 1 };
    }

    if (Math.abs(local.x) >= Math.abs(local.y) && Math.abs(local.x) > 4) {
      return { x: local.x > 0 ? 1 : -1, y: 0 };
    }
    if (Math.abs(local.y) > 4) return { x: 0, y: local.y > 0 ? 1 : -1 };
    return { x: 0, y: 1 };
  };

  const getTerminalWireSlot = (wire: Wire, componentId: string, terminalId: string) => {
    const connected = wires
      .filter(candidate =>
        (candidate.fromComponentId === componentId && candidate.fromTerminalId === terminalId) ||
        (candidate.toComponentId === componentId && candidate.toTerminalId === terminalId)
      )
      .sort((a, b) => a.id.localeCompare(b.id));
    const index = connected.findIndex(candidate => candidate.id === wire.id);
    if (index < 0 || connected.length < 2) return 0;
    return index - (connected.length - 1) / 2;
  };

  const getTerminalLeadPoints = (wire: Wire, componentId: string, terminalId: string) => {
    const terminal = getTerminalPos(componentId, terminalId);
    const direction = getTerminalExitDirection(componentId, terminalId);
    const component = components.find(candidate => candidate.id === componentId);
    const slot = getTerminalWireSlot(wire, componentId, terminalId);
    const fanOffset = slot * WIRE_FAN_SPACING;
    const perpendicular = { x: -direction.y, y: direction.x };
    const stem = {
      x: terminal.x + direction.x * WIRE_TERMINAL_STEM,
      y: terminal.y + direction.y * WIRE_TERMINAL_STEM
    };
    const fan = {
      x: stem.x + perpendicular.x * fanOffset,
      y: stem.y + perpendicular.y * fanOffset
    };
    let exit = {
      x: fan.x + direction.x * (WIRE_TERMINAL_LEAD + Math.abs(fanOffset) * 0.35),
      y: fan.y + direction.y * (WIRE_TERMINAL_LEAD + Math.abs(fanOffset) * 0.35)
    };

    // Extend every lead fully past its component enclosure. This matters for the
    // transformer because its protected bounds include the outlet strip behind it;
    // beginning a route inside those bounds forces an unnecessary trip sideways.
    if (component && direction.y === 0) {
      const bounds = getComponentBounds(component);
      const sideClearance = 8 + Math.abs(fanOffset) * 0.35;
      exit = {
        x: direction.x < 0
          ? Math.min(exit.x, bounds.left - sideClearance)
          : Math.max(exit.x, bounds.right + sideClearance),
        y: exit.y
      };
    } else if (component && direction.x === 0) {
      const bounds = getComponentBounds(component);
      const verticalClearance = 8 + Math.abs(fanOffset) * 0.35;
      exit = {
        x: exit.x,
        y: direction.y < 0
          ? Math.min(exit.y, bounds.top - verticalClearance)
          : Math.max(exit.y, bounds.bottom + verticalClearance)
      };
    }

    return {
      direction,
      points: simplifyWirePoints([terminal, stem, fan, exit])
    };
  };

  const getComponentBounds = (comp: CircuitComponent, padding = 12) => {
    const position = getComponentCanvasPosition(comp);
    if (comp.type === 'transformer') {
      // Include the corded System Power outlet behind the adapter. Without this
      // larger footprint, unrelated wires can be routed across the station.
      return {
        left: position.x - 159 - padding,
        right: position.x + 112 + padding,
        top: position.y - 78 - padding,
        bottom: position.y + 78 + padding
      };
    }
    if (comp.type === 'junction') {
      const scale = comp.state?.scale || SPLICE_CONNECTOR_DEFAULT_SCALE;
      return {
        left: position.x - 26 * scale - padding,
        right: position.x + 26 * scale + padding,
        top: position.y - 14 * scale - padding,
        bottom: position.y + 26 * scale + padding
      };
    }

    const halfSizeByType: Partial<Record<CircuitComponent['type'], [number, number]>> = {
      battery: [64, 46],
      power_supply: [77, 54],
      timer_relay: [54, 68],
      relay: [50, 60],
      relay_dpdt: [56, 90],
      pull_station: [60, 90],
      key_switch: [56, 78],
      card_reader: [30, 82],
      maglock: [66, 50],
      actuator: [165, 50],
      elevator_motor: [52, 90],
      roland_fan: [66, 84],
      parking_gate: [76, 68],
      sliding_gate: [120, 70],
      led_strip: [58, 34],
      door_sensor: [54, 38],
      terminal_block: [56, 44]
    };
    const [halfWidth, halfHeight] = halfSizeByType[comp.type] || [54, 54];

    return {
      left: position.x - halfWidth - padding,
      right: position.x + halfWidth + padding,
      top: position.y - halfHeight - padding,
      bottom: position.y + halfHeight + padding
    };
  };

  const getWireObstacles = (wire?: Wire | null, includeEndpoints = false) => {
    return components
      .filter(comp =>
        includeEndpoints ||
        (comp.id !== wire?.fromComponentId && comp.id !== wire?.toComponentId)
      )
      .map(comp => getComponentBounds(comp));
  };

  const nudgePointOutsideDevices = (point: WirePoint, wire?: Wire | null) => {
    const hit = getWireObstacles(wire).find(bounds =>
      point.x >= bounds.left &&
      point.x <= bounds.right &&
      point.y >= bounds.top &&
      point.y <= bounds.bottom
    );

    if (!hit) return point;

    const options = [
      { x: point.x, y: hit.top - 12, d: Math.abs(point.y - hit.top) },
      { x: point.x, y: hit.bottom + 12, d: Math.abs(point.y - hit.bottom) },
      { x: hit.left - 12, y: point.y, d: Math.abs(point.x - hit.left) },
      { x: hit.right + 12, y: point.y, d: Math.abs(point.x - hit.right) }
    ];
    options.sort((a, b) => a.d - b.d);
    return { x: snapWireCoord(options[0].x), y: snapWireCoord(options[0].y) };
  };

  const getStableLaneOffset = (wire: Wire) => {
    const wireIndex = wires.findIndex(candidate => candidate.id === wire.id);
    if (wireIndex >= 0) {
      if (wireIndex === 0) return 0;
      const lane = Math.ceil(wireIndex / 2) * (wireIndex % 2 === 1 ? 1 : -1);
      return lane * WIRE_GRID;
    }

    const key = `${wire.fromComponentId}:${wire.fromTerminalId}:${wire.toComponentId}:${wire.toTerminalId}`;
    let hash = 0;
    for (let i = 0; i < key.length; i++) {
      hash = (hash + key.charCodeAt(i) * (i + 1)) % 997;
    }
    return ((hash % 7) - 3) * 8;
  };

  const getWireRouteInteractionPenalty = (
    start: WirePoint,
    end: WirePoint,
    occupiedRoutes: WirePoint[][]
  ) => {
    const horizontal = Math.abs(start.y - end.y) < 0.5;
    const vertical = Math.abs(start.x - end.x) < 0.5;
    if (!horizontal && !vertical) return 100000;

    let penalty = 0;
    occupiedRoutes.forEach(route => {
      for (let index = 0; index < route.length - 1; index++) {
        const otherStart = route[index];
        const otherEnd = route[index + 1];
        const otherHorizontal = Math.abs(otherStart.y - otherEnd.y) < 0.5;
        const otherVertical = Math.abs(otherStart.x - otherEnd.x) < 0.5;

        if (horizontal && otherHorizontal) {
          const overlap = Math.min(Math.max(start.x, end.x), Math.max(otherStart.x, otherEnd.x)) -
            Math.max(Math.min(start.x, end.x), Math.min(otherStart.x, otherEnd.x));
          if (overlap <= 1) continue;
          const gap = Math.abs(start.y - otherStart.y);
          if (gap < 0.5) penalty += 60000 + overlap * 80;
          else if (gap < WIRE_ROUTE_CLEARANCE) {
            penalty += 9000 * (1 - gap / WIRE_ROUTE_CLEARANCE) + overlap * 24;
          }
          continue;
        }

        if (vertical && otherVertical) {
          const overlap = Math.min(Math.max(start.y, end.y), Math.max(otherStart.y, otherEnd.y)) -
            Math.max(Math.min(start.y, end.y), Math.min(otherStart.y, otherEnd.y));
          if (overlap <= 1) continue;
          const gap = Math.abs(start.x - otherStart.x);
          if (gap < 0.5) penalty += 60000 + overlap * 80;
          else if (gap < WIRE_ROUTE_CLEARANCE) {
            penalty += 9000 * (1 - gap / WIRE_ROUTE_CLEARANCE) + overlap * 24;
          }
          continue;
        }

        const horizontalStart = horizontal ? start : otherStart;
        const horizontalEnd = horizontal ? end : otherEnd;
        const verticalStart = vertical ? start : otherStart;
        const verticalEnd = vertical ? end : otherEnd;
        const crossingX = verticalStart.x;
        const crossingY = horizontalStart.y;
        const crosses =
          crossingX > Math.min(horizontalStart.x, horizontalEnd.x) + 2 &&
          crossingX < Math.max(horizontalStart.x, horizontalEnd.x) - 2 &&
          crossingY > Math.min(verticalStart.y, verticalEnd.y) + 2 &&
          crossingY < Math.max(verticalStart.y, verticalEnd.y) - 2;
        if (crosses) penalty += 1400;
      }
    });
    return penalty;
  };

  const segmentCrossesBounds = (
    start: WirePoint,
    end: WirePoint,
    bounds: ReturnType<typeof getComponentBounds>,
    expansion = 0
  ) => {
    const left = bounds.left - expansion;
    const right = bounds.right + expansion;
    const top = bounds.top - expansion;
    const bottom = bounds.bottom + expansion;
    if (Math.abs(start.y - end.y) < 0.5) {
      const minX = Math.min(start.x, end.x);
      const maxX = Math.max(start.x, end.x);
      return start.y > top && start.y < bottom && maxX > left && minX < right;
    }
    if (Math.abs(start.x - end.x) < 0.5) {
      const minY = Math.min(start.y, end.y);
      const maxY = Math.max(start.y, end.y);
      return start.x > left && start.x < right && maxY > top && minY < bottom;
    }
    return true;
  };

  const scoreOrthogonalRoute = (
    points: WirePoint[],
    wire: Wire,
    startDirection: WireDirection,
    endDirection: WireDirection | null,
    occupiedRoutes: WirePoint[][]
  ) => {
    const obstacles = getWireObstacles(wire, true);
    let score = Math.max(0, points.length - 2) * 14;
    const routeStart = points[0];
    const routeEnd = points[points.length - 1];
    const localLeft = Math.min(routeStart.x, routeEnd.x) - 96;
    const localRight = Math.max(routeStart.x, routeEnd.x) + 96;
    const localTop = Math.min(routeStart.y, routeEnd.y) - 96;
    const localBottom = Math.max(routeStart.y, routeEnd.y) + 96;

    // Prefer a compact route near its two terminals. A path may leave this
    // corridor to avoid equipment, but large trips to the canvas edge are costly.
    points.forEach(point => {
      const horizontalExcursion = Math.max(localLeft - point.x, point.x - localRight, 0);
      const verticalExcursion = Math.max(localTop - point.y, point.y - localBottom, 0);
      score += (horizontalExcursion + verticalExcursion) * 12;
    });

    for (let index = 0; index < points.length - 1; index++) {
      const start = points[index];
      const end = points[index + 1];
      score += Math.abs(end.x - start.x) + Math.abs(end.y - start.y);
      obstacles.forEach(bounds => {
        if (segmentCrossesBounds(start, end, bounds)) score += 100000;
        else if (segmentCrossesBounds(start, end, bounds, 8)) score += 1800;
      });
      score += getWireRouteInteractionPenalty(start, end, occupiedRoutes);
    }

    if (points.length > 1) {
      const firstDelta = {
        x: points[1].x - points[0].x,
        y: points[1].y - points[0].y
      };
      if (firstDelta.x * startDirection.x + firstDelta.y * startDirection.y < -0.5) score += 50000;
    }
    if (endDirection && points.length > 1) {
      const last = points[points.length - 1];
      const previous = points[points.length - 2];
      const endDelta = { x: last.x - previous.x, y: last.y - previous.y };
      if (endDelta.x * endDirection.x + endDelta.y * endDirection.y > 0.5) score += 50000;
    }
    return score;
  };

  const getBestOrthogonalRoute = (
    wire: Wire,
    start: WirePoint,
    end: WirePoint,
    startDirection: WireDirection,
    endDirection: WireDirection | null
  ) => {
    if (sameWirePoint(start, end)) return [start];
    const obstacles = getWireObstacles(wire, true);
    const stableOffset = getStableLaneOffset(wire);
    const wireIndex = wires.findIndex(candidate => candidate.id === wire.id);
    const previousWires = wireIndex >= 0 ? wires.slice(0, wireIndex) : wires;
    const occupiedRoutes = previousWires.map(candidate => getWireSegmentsPoints(candidate));
    const candidates: WirePoint[][] = [];
    const addCandidate = (candidate: WirePoint[]) => candidates.push(simplifyWirePoints(candidate));

    if (Math.abs(start.x - end.x) < 0.5 || Math.abs(start.y - end.y) < 0.5) {
      addCandidate([start, end]);
    }
    addCandidate([start, { x: end.x, y: start.y }, end]);
    addCandidate([start, { x: start.x, y: end.y }, end]);

    const laneVariants = [stableOffset, stableOffset + WIRE_GRID, stableOffset - WIRE_GRID];
    const edgeClearances = [16, 32].map(clearance => clearance + Math.abs(stableOffset) * 0.2);
    const obstacleXLanes = obstacles.flatMap(bounds => edgeClearances.flatMap(clearance => [
      snapWireCoord(bounds.left - clearance),
      snapWireCoord(bounds.right + clearance)
    ]));
    const obstacleYLanes = obstacles.flatMap(bounds => edgeClearances.flatMap(clearance => [
      snapWireCoord(bounds.top - clearance),
      snapWireCoord(bounds.bottom + clearance)
    ]));
    const xLanes = Array.from(new Set([
      ...laneVariants.map(offset => snapWireCoord((start.x + end.x) / 2 + offset)),
      ...obstacleXLanes
    ]));
    const yLanes = Array.from(new Set([
      ...laneVariants.map(offset => snapWireCoord((start.y + end.y) / 2 + offset)),
      ...obstacleYLanes
    ]));

    xLanes.forEach(laneX => addCandidate([
      start,
      { x: laneX, y: start.y },
      { x: laneX, y: end.y },
      end
    ]));
    yLanes.forEach(laneY => addCandidate([
      start,
      { x: start.x, y: laneY },
      { x: end.x, y: laneY },
      end
    ]));

    return candidates
      .map((points, index) => ({
        points,
        score:
          scoreOrthogonalRoute(points, wire, startDirection, endDirection, occupiedRoutes) +
          (
            Math.abs(end.x - start.x) > 80 &&
            Math.abs(end.y - start.y) > 60 &&
            points.length === 3
              ? 18
              : 0
          ) +
          index * 0.01
      }))
      .sort((a, b) => a.score - b.score)[0].points;
  };

  // Build a clean Manhattan route with a short lead-out and fan separation at every terminal.
  const getWireSegmentsPoints = (wire: Wire) => {
    const cachedRoute = wireRouteCache.get(wire.id);
    if (cachedRoute) return cachedRoute;
    const isLiveDrawing = !wire.toComponentId;
    const startLead = getTerminalLeadPoints(wire, wire.fromComponentId, wire.fromTerminalId);
    const rawEnd = isLiveDrawing
      ? (wire.waypoints?.[wire.waypoints.length - 1] || { x: 0, y: 0 })
      : getTerminalPos(wire.toComponentId, wire.toTerminalId);
    const endLead = isLiveDrawing
      ? { direction: null, points: [{ x: snapWireCoord(rawEnd.x), y: snapWireCoord(rawEnd.y) }] }
      : getTerminalLeadPoints(wire, wire.toComponentId, wire.toTerminalId);
    const startExit = startLead.points[startLead.points.length - 1];
    const endExit = endLead.points[endLead.points.length - 1];
    const activeWaypoints = (isLiveDrawing ? wire.waypoints?.slice(0, -1) : wire.waypoints) || [];
    const anchors = [
      startExit,
      ...activeWaypoints.map(point => nudgePointOutsideDevices({
        x: snapWireCoord(point.x),
        y: snapWireCoord(point.y)
      }, wire)),
      endExit
    ];

    const routed: WirePoint[] = [...startLead.points];
    for (let index = 0; index < anchors.length - 1; index++) {
      const route = getBestOrthogonalRoute(
        wire,
        anchors[index],
        anchors[index + 1],
        index === 0 ? startLead.direction : { x: 0, y: 0 },
        index === anchors.length - 2 ? endLead.direction : null
      );
      routed.push(...route.slice(1));
    }
    if (!isLiveDrawing) routed.push(...endLead.points.slice(0, -1).reverse());
    const simplifiedRoute = simplifyWirePoints(routed);
    wireRouteCache.set(wire.id, simplifiedRoute);
    return simplifiedRoute;
  };

  // Compute detailed path with arches/bridges for intersecting wires
  const getWirePathWithCrossings = (wireIndex: number, currentWires: Wire[]) => {
    const wire = currentWires[wireIndex];
    const p1 = getTerminalPos(wire.fromComponentId, wire.fromTerminalId);
    const myPoints = getWireSegmentsPoints(wire);

    const myMinX = Math.min(...myPoints.map(p => p.x));
    const myMaxX = Math.max(...myPoints.map(p => p.x));
    const myMinY = Math.min(...myPoints.map(p => p.y));
    const myMaxY = Math.max(...myPoints.map(p => p.y));

    const getLineIntersection = (
      x1: number, y1: number, x2: number, y2: number,
      x3: number, y3: number, x4: number, y4: number
    ) => {
      const denom = (x2 - x1) * (y4 - y3) - (y2 - y1) * (x4 - x3);
      if (denom === 0) return null;
      const ua = ((x4 - x3) * (y1 - y3) - (y4 - y3) * (x1 - x3)) / denom;
      const ub = ((x2 - x1) * (y1 - y3) - (y2 - y1) * (x1 - x3)) / denom;
      if (ua >= 0 && ua <= 1 && ub >= 0 && ub <= 1) {
        return {
          x: x1 + ua * (x2 - x1),
          y: y1 + ua * (y2 - y1),
          ratio: ua
        };
      }
      return null;
    };

    interface IntersectionPoint {
      x: number;
      y: number;
      segmentIndex: number;
      ratio: number;
    }
    const intersections: IntersectionPoint[] = [];

    for (let j = 0; j < wireIndex; j++) {
      const otherWire = currentWires[j];
      const otherPoints = getWireSegmentsPoints(otherWire);

      const oMinX = Math.min(...otherPoints.map(p => p.x));
      const oMaxX = Math.max(...otherPoints.map(p => p.x));
      const oMinY = Math.min(...otherPoints.map(p => p.y));
      const oMaxY = Math.max(...otherPoints.map(p => p.y));

      const overlap = !(myMaxX < oMinX || myMinX > oMaxX || myMaxY < oMinY || myMinY > oMaxY);
      if (!overlap) continue;

      for (let k = 0; k < myPoints.length - 1; k++) {
        const ax = myPoints[k].x;
        const ay = myPoints[k].y;
        const bx = myPoints[k+1].x;
        const by = myPoints[k+1].y;

        for (let l = 0; l < otherPoints.length - 1; l++) {
          const cx = otherPoints[l].x;
          const cy = otherPoints[l].y;
          const dx = otherPoints[l+1].x;
          const dy = otherPoints[l+1].y;

          const inter = getLineIntersection(ax, ay, bx, by, cx, cy, dx, dy);
          if (inter) {
            const op1 = getTerminalPos(otherWire.fromComponentId, otherWire.fromTerminalId);
            const op2 = otherWire.toComponentId ? getTerminalPos(otherWire.toComponentId, otherWire.toTerminalId) : null;
            const p2 = wire.toComponentId ? getTerminalPos(wire.toComponentId, wire.toTerminalId) : null;

            const distToP1 = Math.hypot(inter.x - p1.x, inter.y - p1.y);
            const distToP2 = p2 ? Math.hypot(inter.x - p2.x, inter.y - p2.y) : Infinity;
            const distToOp1 = Math.hypot(inter.x - op1.x, inter.y - op1.y);
            const distToOp2 = op2 ? Math.hypot(inter.x - op2.x, inter.y - op2.y) : Infinity;

            // Only add bridge if the crossing is far enough from all terminal ports
            if (distToP1 > 28 && distToP2 > 28 && distToOp1 > 28 && distToOp2 > 28) {
              intersections.push({
                x: inter.x,
                y: inter.y,
                segmentIndex: k,
                ratio: inter.ratio
              });
            }
          }
        }
      }
    }

    intersections.sort((a, b) => {
      if (a.segmentIndex !== b.segmentIndex) return a.segmentIndex - b.segmentIndex;
      return a.ratio - b.ratio;
    });

    let path = `M ${p1.x} ${p1.y}`;
    const BRIDGE_R = 4.5; // radius of bridge arc

    for (let k = 0; k < myPoints.length - 1; k++) {
      const A = myPoints[k];
      const B = myPoints[k+1];
      const segInters = intersections.filter(inter => inter.segmentIndex === k);

      if (segInters.length === 0) {
        path += ` L ${B.x} ${B.y}`;
      } else {
        const sDx = B.x - A.x;
        const sDy = B.y - A.y;
        const len = Math.sqrt(sDx * sDx + sDy * sDy);
        const ux = sDx / (len || 1);
        const uy = sDy / (len || 1);

        segInters.forEach(inter => {
          const sx = inter.x - BRIDGE_R * ux;
          const sy = inter.y - BRIDGE_R * uy;
          const ex = inter.x + BRIDGE_R * ux;
          const ey = inter.y + BRIDGE_R * uy;
          path += ` L ${sx} ${sy} A ${BRIDGE_R} ${BRIDGE_R} 0 0 1 ${ex} ${ey}`;
        });

        path += ` L ${B.x} ${B.y}`;
      }
    }

    return path;
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

  const spliceWireAtCoords = (wire: Wire, x: number, y: number) => {
    const split = getSplitWaypoints(wire, x, y);
    return spliceWire(wire.id, split.x, split.y, split.waypoints1, split.waypoints2);
  };

  const resizeSpliceConnector = (componentId: string, currentScale: number | undefined, delta: number) => {
    const baseScale = Math.max(currentScale || SPLICE_CONNECTOR_DEFAULT_SCALE, SPLICE_CONNECTOR_DEFAULT_SCALE);
    const nextScale = Math.max(
      SPLICE_CONNECTOR_DEFAULT_SCALE,
      Math.min(SPLICE_CONNECTOR_MAX_SCALE, parseFloat((baseScale + delta).toFixed(1)))
    );
    if (nextScale === baseScale) return;
    setComponentState(componentId, 'scale', nextScale);
    setHoveredCompId(componentId);
    soundManager.playClick();
  };

  const handleAddSpliceConnector = () => {
    let connectorX = 680;
    let connectorY = 280;
    if (components.length > 0) {
      const rightMostX = Math.max(...components.map(c => c.x));
      const minY = Math.min(...components.map(c => c.y));
      const maxY = Math.max(...components.map(c => c.y));
      connectorX = Math.min(920, rightMostX + 140);
      connectorY = Math.max(90, Math.min(470, minY + (maxY - minY) / 2));
    }

    const junctionId = `junction_${Date.now()}`;
    const newJunction: CircuitComponent = {
      id: junctionId,
      type: 'junction',
      x: connectorX,
      y: connectorY,
      label: '',
      terminals: [
        { id: 'port_0', name: 'Port 1', type: 'in', x: -16, y: 12 },
        { id: 'port_1', name: 'Port 2', type: 'in', x: -8, y: 12 },
        { id: 'port_2', name: 'Port 3', type: 'in', x: 0, y: 12 },
        { id: 'port_3', name: 'Port 4', type: 'in', x: 8, y: 12 },
        { id: 'port_4', name: 'Port 5', type: 'in', x: 16, y: 12 }
      ],
      state: { color: activeColor, scale: SPLICE_CONNECTOR_DEFAULT_SCALE }
    };
    addComponent(newJunction);
    soundManager.playClick();
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

  const activeLevel = levels[currentLevelIndex];
  const completionStars = score.hintsUsed === 0 && timeElapsed < 90
    ? 3
    : score.hintsUsed <= 2 && timeElapsed < 180
      ? 2
      : 1;
  const formattedCompletionTime = `${Math.floor(timeElapsed / 60).toString().padStart(2, '0')}:${(timeElapsed % 60).toString().padStart(2, '0')}`;

  return (
    <div className="flex-1 flex flex-col relative min-h-0 bg-[#090e15] select-none">
      
      {/* Canvas Toolbars */}
      <div className="h-12 border-b border-white/10 bg-[#090d14]/92 px-2 flex items-center justify-center text-xs font-medium text-slate-300 shrink-0 backdrop-blur overflow-x-auto">
        <div className="mx-auto flex min-w-max items-center gap-1.5 rounded-xl border border-white/[0.08] bg-white/[0.025] p-1 shadow-[0_8px_24px_rgba(0,0,0,0.16)]">
        <div className="flex items-center gap-2 px-1.5">
          <span className="text-slate-500 uppercase tracking-[0.14em] text-[9px] font-bold">Wiring</span>
          <div className="flex gap-1.5">
            {(['red', 'black', 'green', 'orange'] as const).map(color => (
              <button
                key={color}
                onClick={() => setActiveColor(color)}
                className={`w-6 h-6 rounded-md border transition-all cursor-pointer relative ${
                  activeColor === color ? 'ring-2 ring-blue-300/70 ring-offset-1 ring-offset-[#111827]' : 'opacity-70 hover:opacity-100'
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

        <div className="h-5 w-px bg-white/10" />

        <div className="flex items-center gap-1.5">
          {/* Add Splice Connector button */}
          <button
            onClick={handleAddSpliceConnector}
            className="h-7 px-2.5 text-[10px] font-bold bg-orange-500/[0.08] hover:bg-orange-500/[0.14] text-orange-300 rounded-md cursor-pointer transition-colors border border-orange-400/15 flex items-center gap-1.5 hover:border-orange-400/35"
            title="Place Splice Connector on the right side of the circuit"
          >
            <svg
              viewBox="0 0 48 24"
              className="w-7 h-4 shrink-0"
              aria-hidden="true"
            >
              <rect x="2" y="4" width="44" height="16" rx="4" fill="#d1d5db" stroke="#94a3b8" strokeWidth="1.5" />
              <rect x="5" y="6" width="38" height="5" rx="2" fill="#f8fafc" opacity="0.65" />
              {[10, 17, 24, 31, 38].map(x => (
                <g key={x}>
                  <rect x={x - 2} y="5" width="4" height="11" rx="1" fill="#ea580c" />
                  <circle cx={x} cy="17" r="1.6" fill="#111827" />
                </g>
              ))}
            </svg>
            <span>+ Splice Connector</span>
          </button>

          {/* Zoom controls */}
          <div className="flex h-7 items-center gap-0.5 bg-black/20 p-0.5 rounded-md border border-white/[0.08]">
            <button
              onClick={() => setZoomScale(prev => Math.max(0.6, parseFloat((prev - 0.1).toFixed(1))))}
              className="w-6 h-6 flex items-center justify-center text-slate-300 hover:text-white hover:bg-white/[0.08] rounded cursor-pointer transition-colors"
              title="Zoom Out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="px-1 text-[10px] font-mono font-semibold text-slate-400 select-none min-w-[32px] text-center">
              {Math.round(zoomScale * 100)}%
            </span>
            <button
              onClick={() => setZoomScale(prev => Math.min(2.0, parseFloat((prev + 0.1).toFixed(1))))}
              className="w-6 h-6 flex items-center justify-center text-slate-300 hover:text-white hover:bg-white/[0.08] rounded cursor-pointer transition-colors"
              title="Zoom In"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            {zoomScale !== 1.0 && (
              <button
                onClick={() => setZoomScale(1.0)}
                className="px-1.5 h-5 flex items-center justify-center text-[9px] font-semibold text-indigo-400 hover:text-indigo-300 hover:bg-indigo-500/10 rounded cursor-pointer transition-colors border-l border-white/10 ml-0.5"
                title="Reset Zoom to 100%"
              >
                Reset
              </button>
            )}
          </div>

          <button
            onClick={handleDownloadSchematic}
            className="h-7 px-2.5 text-[10px] font-semibold tracking-wide bg-white/[0.04] hover:bg-white/[0.09] text-slate-300 rounded-md border border-white/[0.08] cursor-pointer transition-all flex items-center gap-1.5"
            title="Download Schematic SVG File"
          >
            <Download className="w-3.5 h-3.5" strokeWidth={2.5} />
            <span>Schematic</span>
          </button>
          <button
            onClick={() => setWireSize(prev => prev === 'normal' ? 'thin' : 'normal')}
            className="h-7 px-2.5 text-[10px] font-semibold tracking-wide bg-white/[0.04] hover:bg-white/[0.09] text-slate-300 rounded-md border border-white/[0.08] cursor-pointer transition-colors"
            title="Toggle wire thickness"
          >
            Size: {wireSize}
          </button>
          <div className="hidden 2xl:flex h-7 items-center gap-1.5 text-[10px] text-slate-500 px-2.5 rounded-md border border-white/[0.06]">
            <Info className="w-3.5 h-3.5" />
            <span>Drag to route · select to edit</span>
          </div>
        </div>
        </div>
      </div>

      {levelCompleted && !completionBarDismissed && (
        <div className="min-h-12 shrink-0 border-b border-emerald-400/20 bg-emerald-400/[0.07] px-3 py-2 flex flex-wrap items-center justify-between gap-2 pointer-events-auto shadow-[0_8px_24px_rgba(0,0,0,0.14)]">
          <div className="flex min-w-0 items-center gap-2.5">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-emerald-400/25 bg-emerald-400/10 text-emerald-300">
              <CheckCircle2 className="h-4.5 w-4.5" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-[9px] font-bold uppercase tracking-[0.16em] text-emerald-300">Module complete</span>
                <span className="hidden text-[10px] text-slate-600 sm:inline">•</span>
                <span className="hidden truncate text-[11px] font-semibold text-slate-200 sm:inline">{activeLevel.title}</span>
              </div>
              <p className="text-[10px] text-slate-500">Circuit verified. Review your work or continue when ready.</p>
            </div>
          </div>

          <div className="ml-auto flex items-center gap-2">
            <div className="hidden items-center gap-1 rounded-md border border-white/[0.07] bg-black/15 px-2 py-1 md:flex">
              {[1, 2, 3].map(num => (
                <Star
                  key={num}
                  className={`h-3.5 w-3.5 ${num <= completionStars ? 'fill-amber-300 text-amber-300' : 'text-slate-700'}`}
                />
              ))}
            </div>
            <div className="hidden items-center gap-3 px-2 text-[10px] text-slate-500 lg:flex">
              <span><strong className="font-semibold text-slate-300">{formattedCompletionTime}</strong> time</span>
              <span><strong className="font-semibold text-slate-300">{score.hintsUsed}</strong> hints</span>
            </div>
            <button
              type="button"
              onClick={() => setCompletionBarDismissed(true)}
              className="flex h-8 items-center gap-1.5 rounded-lg border border-white/[0.08] bg-white/[0.035] px-2.5 text-[10px] font-semibold text-slate-400 transition hover:bg-white/[0.08] hover:text-white"
              title="Dismiss and keep reviewing the circuit"
            >
              <X className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Review circuit</span>
            </button>
            <button
              type="button"
              onClick={() => {
                soundManager.playButton();
                if (currentLevelIndex === levels.length - 1) setViewMode('levels');
                else nextLevel();
              }}
              className="flex h-8 items-center gap-1.5 rounded-lg bg-emerald-400 px-3 text-[10px] font-bold text-emerald-950 transition hover:bg-emerald-300"
            >
              <span>{currentLevelIndex === levels.length - 1 ? 'Finish course' : 'Next module'}</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* === PROBE / WIRE DRAWING BANNER === */}
      {(probeMode || drawingWireStart) && (
        <div
            className={`absolute top-12 left-0 right-0 z-30 flex items-center justify-between px-5 py-2 font-semibold tracking-wide text-sm pointer-events-auto ${
            probeMode === 'red'
              ? 'bg-red-600 text-white border-b-2 border-red-300'
              : probeMode === 'black'
              ? 'bg-slate-600 text-white border-b-2 border-slate-300'
              : 'bg-indigo-600 text-white border-b-2 border-indigo-400'
          }`}
        >
          <span>
            {probeMode === 'red'
              ? '🔴 RED PROBE ACTIVE — Click any terminal on the canvas to attach'
              : probeMode === 'black'
              ? '⚫ BLACK PROBE ACTIVE — Click any terminal on the canvas to attach'
              : draggingWireEndpoint
                ? '🔁 RECONNECTING WIRE END — Drag near a new terminal and release; it will snap automatically'
                : `🔌 ROUTING WIRE (${tempWaypoints.length} bends) — Drag near a terminal to snap, or click empty space to add a bend`}
          </span>
          <button
            onClick={() => {
              setProbeMode(null);
              cancelWireDrawing();
            }}
            className="bg-black/30 hover:bg-black/50 px-3 py-1 rounded text-xs cursor-pointer transition-colors ml-4 font-bold"
          >
            ✕ Cancel
          </button>
        </div>
      )}

      {/* SVG Canvas Container */}
      <svg
        ref={svgRef}
        className={`workspace-grid w-full flex-1 relative touch-none ${probeMode ? 'cursor-cell' : 'cursor-crosshair'}`}
        onPointerDown={handleWorkspacePointerDown}
        onPointerMove={handleWorkspacePointerMove}
        onPointerUp={handleWorkspacePointerUp}
        onClick={() => {
          if (probeMode) setProbeMode(null);
          setSelectedTimerId(null);
        }}
        onContextMenu={(e) => {
          e.preventDefault();
          cancelWireDrawing();
          setProbeMode(null);
        }}
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

        <g transform={`translate(${offsets.shiftX}, ${offsets.shiftY}) scale(${zoomScale})`} style={{ transformOrigin: 'top left', transition: 'transform 0.15s ease-out' }}>
          {/* Compact corded outlet strip behind the transformer, so the adapter reads as plugged in. */}
          {(() => {
            const transformer = components.find(c => c.type === 'transformer');
            const transformerPosition = transformer ? getComponentCanvasPosition(transformer) : null;
            return transformer ? (
            <g transform={`translate(${transformerPosition!.x}, ${transformerPosition!.y - 18})`}>
              <defs>
                <linearGradient id="corded-strip-top" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#4b5563" />
                  <stop offset="55%" stopColor="#252a31" />
                  <stop offset="100%" stopColor="#111418" />
                </linearGradient>
                <linearGradient id="corded-strip-front" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#353b43" />
                  <stop offset="100%" stopColor="#171a1f" />
                </linearGradient>
              </defs>

              {/* Short molded cord entering from the left side of the outlet strip. */}
              <path
                d="M -104 -2 C -116 -2 -119 5 -130 5 C -139 5 -145 1 -151 1"
                fill="none"
                stroke="#121417"
                strokeWidth="7"
                strokeLinecap="round"
                filter="drop-shadow(0 2px 2px rgba(0,0,0,0.45))"
              />
              <path d="M -104 -2 H -114" stroke="#47505a" strokeWidth="9" strokeLinecap="round" />

              {/* Low-profile black metal body. */}
              <path
                d="M -108 -27 Q -106 -33 -99 -35 H 99 Q 106 -34 108 -27 L 104 18 Q 103 24 96 25 H -96 Q -104 24 -105 17 Z"
                fill="url(#corded-strip-front)"
                stroke="#0b0d10"
                strokeWidth="1.5"
                filter="drop-shadow(0 6px 8px rgba(0,0,0,0.38))"
              />
              <rect
                x="-103"
                y="-31"
                width="206"
                height="40"
                rx="7"
                fill="url(#corded-strip-top)"
                stroke="#66707b"
                strokeWidth="1.2"
              />
              <path d="M -99 8 H 99" stroke="#0c0f13" strokeWidth="1.3" opacity="0.8" />
              <path
                d="M -98 7 H 98"
                stroke={isRunning ? '#34d399' : '#64748b'}
                strokeWidth="0.8"
                opacity={isRunning ? 0.8 : 0.35}
              />

              {/* Three NEMA 5-15 receptacles; the transformer covers the center one. */}
              {[-55, 0, 55].map(outletX => (
                <g key={outletX} transform={`translate(${outletX}, -11)`}>
                  <rect x="-17" y="-12" width="34" height="24" rx="4" fill="#15191e" stroke="#69727d" strokeWidth="1" />
                  <rect x="-8" y="-6" width="4" height="9" rx="1" fill="#050607" />
                  <rect x="4" y="-6" width="4" height="9" rx="1" fill="#050607" />
                  <path d="M -3 6 Q 0 3 3 6 V 9 H -3 Z" fill="#050607" />
                  <path d="M -13 -8 H 12" stroke="#8b949e" strokeWidth="0.7" opacity="0.35" />
                </g>
              ))}

              {/* The outlet-strip rocker is the real System Power control. */}
              <g transform="translate(-102, -27) scale(0.42)">
                <SystemPowerRocker isRunning={isRunning} onToggle={toggleSimulation} />
              </g>

              {/* Dedicated label plates remain readable and are never covered by the adapter. */}
              <g>
                <rect x="-101" y="8" width="43" height="15" rx="3" fill="#10141a" stroke="#59636f" strokeWidth="0.7" />
                <text x="-79.5" y="14.5" fill="#f1f5f9" fontSize="4.1" fontWeight="900" fontFamily="system-ui, sans-serif" textAnchor="middle" letterSpacing="0.25">
                  SYSTEM POWER
                </text>
                <circle cx="-91" cy="19.2" r="1.7" fill={isRunning ? '#34d399' : '#ef4444'} />
                <text x="-79" y="21" fill={isRunning ? '#a7f3d0' : '#cbd5e1'} fontSize="4" fontWeight="900" fontFamily="monospace" textAnchor="middle">
                  {isRunning ? 'ON' : 'OFF'}
                </text>
              </g>

              <g>
                <rect x="60" y="8" width="41" height="15" rx="3" fill="#10141a" stroke="#59636f" strokeWidth="0.7" />
                <text x="80.5" y="14.5" fill="#e2e8f0" fontSize="4.3" fontWeight="900" fontFamily="monospace" textAnchor="middle">120V AC</text>
                <text x="80.5" y="20.5" fill="#94a3b8" fontSize="3.6" fontWeight="800" fontFamily="monospace" textAnchor="middle">3 OUTLETS</text>
              </g>

              <circle cx="-104" cy="18" r="1.7" fill="#111827" stroke="#7c8794" strokeWidth="0.7" />
              <circle cx="104" cy="18" r="1.7" fill="#111827" stroke="#7c8794" strokeWidth="0.7" />
            </g>
            ) : null;
          })()}


          {/* 1. Placed components casing layer */}
          {components.map(comp => {
          const isEnergized = isRunning && simulation.energizedComponents.has(comp.id);
          const isFaulty = isRunning && simulation.faultLocation?.split(':')[0] === comp.id;
          const componentPosition = getComponentCanvasPosition(comp);
          const connectorScale = Math.max(comp.state.scale || SPLICE_CONNECTOR_DEFAULT_SCALE, SPLICE_CONNECTOR_DEFAULT_SCALE);
          const connectorAtMinScale = connectorScale <= SPLICE_CONNECTOR_DEFAULT_SCALE;

          return (
            <g
              key={comp.id}
              transform={`translate(${componentPosition.x}, ${componentPosition.y})`}
              onPointerDown={(e) => handleCompPointerDown(e, comp)}
              onPointerMove={handleCompPointerMove}
              onPointerUp={handleCompPointerUp}
              onPointerOver={() => setHoveredCompId(comp.id)}
              onPointerOut={() => setHoveredCompId(null)}
              onClick={(e) => {
                e.stopPropagation();
                if (comp.type === 'timer_relay') setSelectedTimerId(comp.id);
              }}
              onKeyDown={(e) => {
                if (comp.type === 'timer_relay' && (e.key === 'Enter' || e.key === ' ')) {
                  e.preventDefault();
                  setSelectedTimerId(comp.id);
                }
              }}
              role={comp.type === 'timer_relay' ? 'button' : undefined}
              aria-label={comp.type === 'timer_relay' ? `Configure ${comp.label}` : undefined}
              tabIndex={comp.type === 'timer_relay' ? 0 : undefined}
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

              {comp.type === 'timer_relay' && selectedTimerId === comp.id && (
                <g pointerEvents="none">
                  <rect x="-55" y="-65" width="110" height="130" rx="7" fill="none" stroke="#38bdf8" strokeWidth="1.4" strokeDasharray="4 3" />
                  <g transform="translate(0, -71)">
                    <rect x="-32" y="-7" width="64" height="14" rx="7" fill="#082f49" stroke="#38bdf8" strokeWidth="0.8" />
                    <text x="0" y="2.5" fill="#bae6fd" fontSize="7" fontWeight="900" textAnchor="middle">6062 SETTINGS</text>
                  </g>
                </g>
              )}

               {/* Specific component graphic */}
              <ComponentRenderer component={comp} isEnergized={isEnergized} />

              {/* Sleek, stable control tray (Zoom-Out, Zoom-In, Delete) for custom splice connectors when hovered */}
              {hoveredCompId === comp.id && comp.type === 'junction' && (
                <g 
                  transform="translate(0, -22)"
                  className="connector-control cursor-default"
                  onPointerDown={(e) => e.stopPropagation()}
                  onPointerMove={(e) => e.stopPropagation()}
                  onPointerUp={(e) => e.stopPropagation()}
                  onClick={(e) => e.stopPropagation()}
                >
                  {/* Background container pill */}
                  <rect x="-33" y="-10" width="66" height="20" rx="10" fill="#1e293b" stroke="#334155" strokeWidth="1.2" />
                  
                  {/* Zoom Out Button (-) */}
                  <g 
                    className={`connector-control transition-all ${
                      connectorAtMinScale ? 'cursor-not-allowed opacity-35' : 'cursor-pointer hover:brightness-125'
                    }`}
                    transform="translate(-20, 0)"
                    onPointerDown={(e) => e.stopPropagation()}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (!connectorAtMinScale) {
                        resizeSpliceConnector(comp.id, connectorScale, -0.1);
                      }
                    }}
                  >
                    <title>{connectorAtMinScale ? 'Connector is at minimum size' : 'Zoom Out Connector'}</title>
                    <circle cx="0" cy="0" r="7" fill="#334155" />
                    <line x1="-3" y1="0" x2="3" y2="0" stroke="#ffffff" strokeWidth="1.2" />
                  </g>

                  {/* Zoom In Button (+) */}
                  <g 
                    className="connector-control cursor-pointer hover:brightness-125 transition-all"
                    transform="translate(0, 0)"
                    onPointerDown={(e) => e.stopPropagation()}
                    onClick={(e) => {
                      e.stopPropagation();
                      resizeSpliceConnector(comp.id, connectorScale, 0.1);
                    }}
                  >
                    <title>Zoom In Connector</title>
                    <circle cx="0" cy="0" r="7" fill="#334155" />
                    <line x1="-3" y1="0" x2="3" y2="0" stroke="#ffffff" strokeWidth="1.2" />
                    <line x1="0" y1="-3" x2="0" y2="3" stroke="#ffffff" strokeWidth="1.2" />
                  </g>

                  {/* Delete Button (x) */}
                  <g 
                    className="connector-control cursor-pointer hover:brightness-125 transition-all"
                    transform="translate(20, 0)"
                    onPointerDown={(e) => e.stopPropagation()}
                    onClick={(e) => {
                      e.stopPropagation();
                      removeComponent(comp.id);
                      setHoveredCompId(null);
                    }}
                  >
                    <title>Delete Connector</title>
                    <circle cx="0" cy="0" r="7" fill="#ef4444" stroke="#7f1d1d" strokeWidth="0.8" />
                    <line x1="-2.5" y1="-2.5" x2="2.5" y2="2.5" stroke="#ffffff" strokeWidth="1.2" />
                    <line x1="2.5" y1="-2.5" x2="-2.5" y2="2.5" stroke="#ffffff" strokeWidth="1.2" />
                  </g>
                </g>
              )}
            </g>
          );
        })}

        {/* 2. Wire connections layer */}
        {wires.map((wire, index) => {
          const pathD = getWirePathWithCrossings(index, wires);
          const isSelected = selectedWireId === wire.id;
          const isEndpointBeingDragged = draggingWireEndpoint?.wireId === wire.id;
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
                data-wire-id={wire.id}
                aria-label="Select or drag wire route"
                className="cursor-grab active:cursor-grabbing"
                onPointerDown={(e) => {
                  if (!drawingWireStart && !e.shiftKey) {
                    beginWireRouteDrag(e, wire, null);
                  }
                }}
                onPointerMove={handleWireRouteDragMove}
                onPointerUp={handleWireRouteDragEnd}
                onClick={(e) => {
                  e.stopPropagation();
                  if (wireDragMovedRef.current) {
                    wireDragMovedRef.current = false;
                    return;
                  }
                  const coords = getSVGCoords(e as any);
                  const split = getSplitWaypoints(wire, coords.x, coords.y);

                  if (drawingWireStart) {
                    // SPLICING: Create a junction at the click point, and connect the currently drawn wire to it atomically!
                    spliceAndConnectWire(
                      wire.id,
                      split.x,
                      split.y,
                      drawingWireStart.componentId,
                      drawingWireStart.terminalId,
                      activeColor,
                      tempWaypoints,
                      split.waypoints1,
                      split.waypoints2
                    );
                    setDrawingWireStart(null);
                    setTempWaypoints([]);
                  } else if (e.shiftKey) {
                    // EXTENDING: Shift-click on any wire to immediately splice and start drawing a connection from it!
                    const newJunctionId = spliceWire(
                      wire.id,
                      split.x,
                      split.y,
                      split.waypoints1,
                      split.waypoints2
                    );
                    if (newJunctionId) {
                      startFocusedWireDrawing({
                        componentId: newJunctionId,
                        terminalId: 'port_2'
                      });
                      setMousePos({ x: split.x, y: split.y });
                      setPointerDownCoords({ x: split.x, y: split.y });
                      setSelectedWireId(null);
                    }
                  } else {
                    // Regular selection
                    setSelectedWireId(isSelected ? null : wire.id);
                  }
                }}
              />

              {/* Dark diagram casing keeps wire colors legible over the grid and at crossings. */}
              <path
                d={pathD}
                fill="none"
                stroke="#020611"
                strokeWidth={wireSize === 'normal' ? 6.2 : 4.4}
                strokeLinecap="round"
                strokeLinejoin="round"
                opacity={isEndpointBeingDragged ? 0.16 : 0.92}
                pointerEvents="none"
              />

              {/* Calm selection outline without obscuring nearby terminals. */}
              {isSelected && !isEndpointBeingDragged && (
                <path
                  d={pathD}
                  fill="none"
                  stroke="#60a5fa"
                  strokeWidth={wireSize === 'normal' ? 6.8 : 5.2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  opacity="0.68"
                  pointerEvents="none"
                />
              )}

              {/* Main colored wire body */}
              <path
                d={pathD}
                fill="none"
                stroke={hexColor}
                strokeWidth={wireSize === 'normal' ? 3.6 : 2.35}
                strokeLinecap="round"
                strokeLinejoin="round"
                pointerEvents="none"
                className={`transition-all duration-300 ${
                  isEndpointBeingDragged ? 'opacity-15' :
                  isWireDead ? 'opacity-40 brightness-[0.4] saturate-[0.2]' :
                  isBlocked ? 'brightness-[0.9] saturate-[0.8]' :
                  'brightness-110'
                }`}
              />

              {/* Voltage presence pulsing ring under glowing wires */}
              {isRunning && !isWireDead && !drawingWireStart && !isEndpointBeingDragged && (
                <path
                  d={pathD}
                  fill="none"
                  stroke={hexColor}
                  strokeWidth={wireSize === 'normal' ? 4.8 : 3.2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeDasharray="2,8"
                  opacity="0.34"
                  pointerEvents="none"
                />
              )}

              {/* Electron current flow overlay (flowing moving dots) */}
              {isAnimating && !drawingWireStart && !isEndpointBeingDragged && (
                <path
                  d={pathD}
                  fill="none"
                  stroke="#fde68a"
                  strokeWidth={wireSize === 'normal' ? 1.8 : 1.25}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeDasharray="4,10"
                  className="current-flow-dot"
                  opacity="0.82"
                  pointerEvents="none"
                />
              )}

              {/* Compact wire toolbar keeps route, splice, and delete controls together. */}
              {isSelected && !isEndpointBeingDragged && (() => {
                const center = getWireCenterPos(wire);
                return (
                  <g
                    transform={`translate(${center.x}, ${center.y - 34})`}
                    className="selected-wire-toolbar"
                    onPointerDown={(event) => event.stopPropagation()}
                  >
                    <rect x="-39" y="-13" width="78" height="26" rx="13" fill="#07101f" stroke="#334155" strokeWidth="1" opacity="0.96" />

                    <g
                      transform="translate(-25, 0)"
                      className="cursor-pointer"
                      onClick={(event) => {
                        event.stopPropagation();
                        const junctionId = spliceWireAtCoords(wire, center.x, center.y);
                        if (junctionId) {
                          startFocusedWireDrawing({ componentId: junctionId, terminalId: 'port_2' });
                          setActiveColor(wire.color);
                          setMousePos({ x: center.x, y: center.y });
                          setPointerDownCoords({ x: center.x, y: center.y });
                          setSelectedWireId(null);
                        }
                      }}
                    >
                      <title>Splice Wire / Extend Joint</title>
                      <circle cx="0" cy="0" r="8.5" fill="#2563eb" stroke="#93c5fd" strokeWidth="1" />
                      <line x1="-4" y1="0" x2="4" y2="0" stroke="#ffffff" strokeWidth="1.5" />
                      <line x1="0" y1="-4" x2="0" y2="4" stroke="#ffffff" strokeWidth="1.5" />
                    </g>

                    <g
                      className="cursor-grab active:cursor-grabbing"
                      onPointerDown={(event) => beginWireRouteDrag(event, wire, null)}
                      onPointerMove={handleWireRouteDragMove}
                      onPointerUp={handleWireRouteDragEnd}
                    >
                      <title>Drag to move wire route</title>
                      <circle cx="0" cy="0" r="8.5" fill="#7c3aed" stroke="#ddd6fe" strokeWidth="1" />
                      <path
                        d="M -4 0 L 4 0 M 0 -4 L 0 4 M -4 0 L -2 -2 M -4 0 L -2 2 M 4 0 L 2 -2 M 4 0 L 2 2 M 0 -4 L -2 -2 M 0 -4 L 2 -2 M 0 4 L -2 2 M 0 4 L 2 2"
                        stroke="#ffffff"
                        strokeWidth="1.15"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </g>

                    <g
                      transform="translate(25, 0)"
                      className="cursor-pointer"
                      onClick={(event) => {
                        event.stopPropagation();
                        removeWire(wire.id);
                        setSelectedWireId(null);
                      }}
                    >
                      <title>Delete Wire</title>
                      <circle cx="0" cy="0" r="8.5" fill="#dc2626" stroke="#fca5a5" strokeWidth="1" />
                      <line x1="-3.5" y1="-3.5" x2="3.5" y2="3.5" stroke="#ffffff" strokeWidth="1.4" />
                      <line x1="3.5" y1="-3.5" x2="-3.5" y2="3.5" stroke="#ffffff" strokeWidth="1.4" />
                    </g>
                  </g>
                );
              })()}

              {/* Waypoint markers for selected wire */}
              {isSelected && !isEndpointBeingDragged && getEditableWaypointsForWire(wire).map((wp, idx) => (
                <circle
                  key={`wp-${wire.id}-${idx}`}
                  cx={wp.x}
                  cy={wp.y}
                  r="4.5"
                  fill="#ffffff"
                  stroke="#6366f1"
                  strokeWidth="1.5"
                  opacity="0.9"
                  className="cursor-grab active:cursor-grabbing"
                  onPointerDown={(e) => beginWireRouteDrag(e, wire, idx)}
                  onPointerMove={handleWireRouteDragMove}
                  onPointerUp={handleWireRouteDragEnd}
                />
              ))}

              {/* Endpoint grips let an existing wire be moved to a different terminal. */}
              {isSelected && !draggingWireEndpoint && (['from', 'to'] as const).map(endpoint => {
                const componentId = endpoint === 'from' ? wire.fromComponentId : wire.toComponentId;
                const terminalId = endpoint === 'from' ? wire.fromTerminalId : wire.toTerminalId;
                const terminal = getTerminalPos(componentId, terminalId);
                const direction = getTerminalExitDirection(componentId, terminalId);
                const grip = {
                  x: terminal.x + direction.x * 32,
                  y: terminal.y + direction.y * 32
                };
                return (
                  <g
                    key={`${wire.id}-${endpoint}-grip`}
                    transform={`translate(${grip.x}, ${grip.y})`}
                    data-wire-id={wire.id}
                    data-wire-endpoint={endpoint}
                    role="button"
                    aria-label={`Reconnect ${endpoint} wire end`}
                    className="cursor-grab active:cursor-grabbing"
                    onPointerDown={(event) => beginWireEndpointReconnect(event, wire, endpoint)}
                  >
                    <title>Drag to reconnect this wire end</title>
                    <circle cx="0" cy="0" r="9" fill="#0f172a" stroke="#67e8f9" strokeWidth="1.6" />
                    <circle cx="0" cy="0" r="3.2" fill={hexColor} stroke="#f8fafc" strokeWidth="1" />
                    <path d="M -5 -5 L -2 -2 M 5 5 L 2 2" stroke="#a5f3fc" strokeWidth="1.2" strokeLinecap="round" />
                  </g>
                );
              })}
            </g>
          );
        })}

        {/* 3. Live wire drawing overlay */}
        {drawingWireStart && (() => {
          let finalColor = activeColor;
          if (activeColor === 'red') {
            const isNeg = (compId: string, termId: string) => {
              const comp = components.find(c => c.id === compId);
              if (!comp) return false;
              const term = comp.terminals.find(t => t.id === termId);
              if (!term) return false;
              const name = term.name.toLowerCase();
              const id = term.id.toLowerCase();
              const type = term.type.toLowerCase();
              return name === '-' || name === '-ve' || type === 'neg' || id === 'neg' || id === 'coil_b' || id === 'out';
            };

            const isStartNeg = isNeg(drawingWireStart.componentId, drawingWireStart.terminalId);
            const isEndNeg = hoveredTerminal ? isNeg(hoveredTerminal.componentId, hoveredTerminal.terminalId) : false;

            if (isStartNeg || isEndNeg) {
              finalColor = 'black';
            }
          }

          const mockWire: Wire = {
            id: 'temp-live-wire',
            fromComponentId: drawingWireStart.componentId,
            fromTerminalId: drawingWireStart.terminalId,
            toComponentId: hoveredTerminal ? hoveredTerminal.componentId : '',
            toTerminalId: hoveredTerminal ? hoveredTerminal.terminalId : '',
            color: finalColor,
            waypoints: tempWaypoints
          };
          
          let pts: { x: number; y: number }[];
          if (!hoveredTerminal) {
            const tempWire: Wire = {
              ...mockWire,
              waypoints: [...tempWaypoints, mousePos]
            };
            pts = getWireSegmentsPoints(tempWire);
          } else {
            pts = getWireSegmentsPoints(mockWire);
          }
          
          const path = `M ${pts[0].x} ${pts[0].y} ` + pts.slice(1).map(p => `L ${p.x} ${p.y}`).join(' ');
          const previewEnd = pts[pts.length - 1];
          
          return (
            <g>
              <path
                d={path}
                fill="none"
                stroke="#020611"
                strokeWidth="5.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                opacity="0.9"
              />
              <path
                d={path}
                fill="none"
                stroke={getWireColorHex(finalColor)}
                strokeWidth={hoveredTerminal ? 3.3 : 2.8}
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeDasharray={hoveredTerminal ? undefined : '6,5'}
                opacity={hoveredTerminal ? 1 : 0.92}
              />
              {hoveredTerminal ? (
                <g transform={`translate(${previewEnd.x}, ${previewEnd.y})`} pointerEvents="none">
                  <circle cx="0" cy="0" r="12" fill="rgba(16, 185, 129, 0.16)" stroke="#34d399" strokeWidth="2" className="animate-pulse" />
                  <circle cx="0" cy="0" r="4" fill="#d1fae5" />
                </g>
              ) : (
                <g transform={`translate(${previewEnd.x}, ${previewEnd.y})`} pointerEvents="none">
                  <circle cx="0" cy="0" r="6" fill="#0f172a" stroke={getWireColorHex(finalColor)} strokeWidth="2" />
                  <circle cx="0" cy="0" r="2" fill="#f8fafc" />
                </g>
              )}
              {/* Waypoint markers for drawing wire */}
              {tempWaypoints.map((wp, idx) => (
                <circle
                  key={`temp-wp-${idx}`}
                  cx={wp.x}
                  cy={wp.y}
                  r="4"
                  fill="#ffffff"
                  stroke={getWireColorHex(activeColor)}
                  strokeWidth="2"
                  opacity="0.9"
                  pointerEvents="none"
                />
              ))}
            </g>
          );
        })()}

        {/* 4. Terminals and Interactive Overlay Layer */}
        {components.map(comp => {
          const componentPosition = getComponentCanvasPosition(comp);
          return (
            <g
              key={`terminals-${comp.id}`}
              transform={`translate(${componentPosition.x}, ${componentPosition.y})`}
              onClick={(e) => e.stopPropagation()}
            >
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
                const isMagnetTarget = isTargeting && isHovered && !isDrawingStart;
                const terminalWireCount = getTerminalWireCount(comp.id, term.id);
                const canBranchFromTerminal = terminalWireCount > 0 && isHovered && !isTargeting && !probeMode;
                const terminalExitDirection = getTerminalExitDirection(comp.id, term.id);

                // Check if this terminal has a probe badge
                const hasRedProbe = multimeter.redProbe?.componentId === comp.id && multimeter.redProbe?.terminalId === term.id;
                const hasBlackProbe = multimeter.blackProbe?.componentId === comp.id && multimeter.blackProbe?.terminalId === term.id;

                const localPos = getTerminalLocalPos(comp, term);
                const terminalDisplayName = comp.type === 'power_supply'
                  ? term.id === 'ac1'
                    ? 'AC1'
                    : term.id === 'ac2'
                      ? 'AC2'
                      : term.id === 'pos' || term.id === 'dc_pos'
                        ? '+'
                        : term.id === 'neg' || term.id === 'dc_neg'
                          ? '−'
                          : term.name
                  : term.name;

                return (
                  <g 
                    key={term.id} 
                    transform={`translate(${localPos.x}, ${localPos.y})`}
                    onPointerDown={(e) => handleTerminalPointerDown(e, comp.id, term.id)}
                    onPointerUp={(e) => handleTerminalPointerUp(e, comp.id, term.id)}
                    onClick={(e) => handleTerminalClick(e, comp.id, term.id)}
                    onPointerOver={() => setHoveredTerminal({ componentId: comp.id, terminalId: term.id })}
                    onPointerOut={() => {
                      if (!drawingWireStart) setHoveredTerminal(null);
                    }}
                    className={probeMode ? 'cursor-cell' : 'cursor-pointer'}
                    role="button"
                    aria-label={`${comp.label} ${terminalDisplayName} terminal`}
                  >
                    <g 
                      transform={isHovered ? (comp.type === 'junction' ? 'scale(1.1)' : 'scale(1.32)') : 'scale(1)'}
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
                        <circle cx="0" cy="0" r="13" fill="none" stroke="#818cf8" strokeWidth="1.4" strokeDasharray="3 3" opacity="0.72" />
                      )}

                      {isDrawingStart && (
                        <circle cx="0" cy="0" r="11" fill="none" stroke="#c084fc" strokeWidth="2" className="animate-pulse" />
                      )}

                      {isHovered && !isMagnetTarget && (
                        <g>
                          <circle cx="0" cy="0" r="13" fill="none" stroke="#60a5fa" strokeWidth="1.8" />
                          <circle cx="0" cy="0" r="8" fill="rgba(96, 165, 250, 0.16)" />
                        </g>
                      )}

                      {isMagnetTarget && (
                        <g pointerEvents="none">
                          <circle cx="0" cy="0" r="18" fill="rgba(16, 185, 129, 0.18)" stroke="#34d399" strokeWidth="2.2" className="animate-pulse" />
                          <circle cx="0" cy="0" r="10" fill="rgba(52, 211, 153, 0.18)" stroke="#a7f3d0" strokeWidth="1.4" />
                          <g transform="translate(0, -29)">
                            <rect x="-31" y="-8" width="62" height="15" rx="7.5" fill="#052e2b" stroke="#34d399" strokeWidth="1" />
                            <text x="0" y="2.5" fill="#a7f3d0" fontSize="7" fontWeight="900" textAnchor="middle">
                              SNAP · {terminalDisplayName}
                            </text>
                          </g>
                        </g>
                      )}

                      {/* Snap zone hitbox */}
                      <circle 
                        cx="0" 
                        cy="0" 
                        r={comp.type === 'timer_relay' ? 7.5 : 22}
                        fill="transparent" 
                        className="terminal-hitbox" 
                        data-component-id={comp.id}
                        data-terminal-id={term.id}
                      />

                      {/* Metal ring & Connection stud */}
                      {comp.type === 'junction' ? (
                        (isHovered || isTargeting) && (
                          <circle cx="0" cy="0" r="5" fill="#f59e0b" opacity="0.8" stroke="#ffffff" strokeWidth="1" className="animate-pulse" />
                        )
                      ) : (
                        <>
                          <circle cx="0" cy="0" r="6" fill="#cbd5e1" stroke="#334155" strokeWidth="1.5" />
                          <circle cx="0" cy="0" r="3.5" fill={termColor} />
                        </>
                      )}

                      {/* A single compact hub marks a deliberate branch without adding another floating badge. */}
                      {terminalWireCount > 1 && !probeMode && (
                        <circle
                          cx={terminalExitDirection.x * WIRE_TERMINAL_STEM}
                          cy={terminalExitDirection.y * WIRE_TERMINAL_STEM}
                          r="3.2"
                          fill="#dbeafe"
                          stroke="#2563eb"
                          strokeWidth="1.2"
                          pointerEvents="none"
                        />
                      )}

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

                      {/* Direct terminal branching control */}
                      {canBranchFromTerminal && (
                        <g
                          className="terminal-branch-control cursor-pointer"
                          transform="translate(17, -17)"
                          onPointerDown={(e) => e.stopPropagation()}
                          onPointerUp={(e) => e.stopPropagation()}
                          onClick={(e) => {
                            e.stopPropagation();
                            startBranchFromTerminal(comp.id, term.id);
                          }}
                        >
                          <title>Extend another wire from this terminal</title>
                          <circle cx="0" cy="0" r="7.5" fill="#2563eb" stroke="#bfdbfe" strokeWidth="1.3" />
                          <line x1="-3.5" y1="0" x2="3.5" y2="0" stroke="#ffffff" strokeWidth="1.6" strokeLinecap="round" />
                          <line x1="0" y1="-3.5" x2="0" y2="3.5" stroke="#ffffff" strokeWidth="1.6" strokeLinecap="round" />
                        </g>
                      )}

                      {terminalWireCount > 1 && isHovered && !probeMode && (
                        <g transform="translate(-10, 10)" pointerEvents="none">
                          <circle cx="0" cy="0" r="6" fill="#0f172a" stroke="#94a3b8" strokeWidth="1" />
                          <text x="0" y="3" fill="#e2e8f0" fontSize="7" fontWeight="900" textAnchor="middle">
                            {terminalWireCount}
                          </text>
                        </g>
                      )}

                      {/* Floating label */}
                      {isHovered ? (
                        comp.type !== 'junction' && comp.type !== 'transformer' && comp.type !== 'power_supply' && comp.type !== 'timer_relay' && (
                          <text y="-22" fill="#ffffff" fontSize="9" fontWeight="black" textAnchor="middle" filter="drop-shadow(0 1px 2px rgba(0,0,0,0.8))">
                            {probeMode
                              ? (probeMode === 'red' ? `🔴 Attach RED → ${terminalDisplayName}` : `⚫ Attach BLK → ${terminalDisplayName}`)
                              : terminalDisplayName
                            }
                          </text>
                        )
                      ) : (
                        // Board components print their own aligned terminal legends.
                        comp.type !== 'timer_relay' && comp.type !== 'power_supply' && comp.type !== 'transformer' && comp.type !== 'junction' && (() => {
                          let labelX = 0;
                          let labelY = -10;
                          let anchor: 'middle' | 'start' | 'end' = 'middle';

                          if (comp.type === 'relay_dpdt') {
                            labelX = localPos.x < 0 ? 11 : -11;
                            labelY = 3;
                            anchor = localPos.x < 0 ? 'start' : 'end';
                          }

                          return (
                            <g transform={`translate(${labelX}, ${labelY})`}>
                              {/* High contrast dark stroke background outline */}
                              <text
                                x="0"
                                y="0"
                                fill="none"
                                stroke="#09090b"
                                strokeWidth="3.5"
                                strokeLinejoin="round"
                                strokeLinecap="round"
                                fontSize="8.5"
                                fontWeight="900"
                                textAnchor={anchor}
                              >
                                {term.name}
                              </text>
                              <text
                                x="0"
                                y="0"
                                fill={term.name === '+' ? '#fb7185' : term.name === '-' ? '#38bdf8' : '#f8fafc'}
                                fontSize="8.5"
                                fontWeight="900"
                                textAnchor={anchor}
                              >
                                {term.name}
                              </text>
                            </g>
                          );
                        })()
                      )}
                    </g>
                  </g>
                );
              })}
              </g>
            );
          })}
        {/* 4.5. Funny Electrical POP & Smoke Sizzle Animation Overlay */}
        {shortCircuitSmoke?.active && (
          <g transform={`translate(${shortCircuitSmoke.x}, ${shortCircuitSmoke.y})`} pointerEvents="none" className="select-none z-40">
            <style>{`
              @keyframes billow-wispy-1 {
                0% { transform: translate(0, 5px) scale(0.4) rotate(0deg); opacity: 0; }
                10% { opacity: 0.55; }
                45% { opacity: 0.35; }
                100% { transform: translate(-18px, -180px) scale(3.8) rotate(-70deg); opacity: 0; }
              }
              @keyframes billow-wispy-2 {
                0% { transform: translate(0, 5px) scale(0.3) rotate(0deg); opacity: 0; }
                12% { opacity: 0.6; }
                50% { opacity: 0.4; }
                100% { transform: translate(18px, -200px) scale(4.4) rotate(90deg); opacity: 0; }
              }
              @keyframes billow-wispy-3 {
                0% { transform: translate(0, 5px) scale(0.5) rotate(0deg); opacity: 0; }
                8% { opacity: 0.5; }
                40% { opacity: 0.3; }
                100% { transform: translate(-3px, -160px) scale(3.2) rotate(40deg); opacity: 0; }
              }
              @keyframes spark-shoot {
                0% {
                  stroke-dasharray: 0, 80;
                  stroke-dashoffset: 0;
                  opacity: 1;
                  stroke: #ffffff;
                }
                15% {
                  stroke-dasharray: 12, 80;
                  stroke-dashoffset: -3;
                  stroke: #fef08a;
                }
                45% {
                  stroke-dasharray: 10, 80;
                  stroke: #fbbf24;
                }
                100% {
                  stroke-dasharray: 1, 80;
                  stroke-dashoffset: -70;
                  opacity: 0;
                  stroke: #f59e0b;
                }
              }
              @keyframes core-flicker {
                0% { transform: scale(1); opacity: 1; }
                20% { transform: scale(0.85); opacity: 0.8; }
                40% { transform: scale(1.1); opacity: 0.95; }
                60% { transform: scale(0.75); opacity: 0.6; }
                80% { transform: scale(0.9); opacity: 0.85; }
                95% { transform: scale(0.5); opacity: 0.4; }
                100% { transform: scale(0); opacity: 0; }
              }
              .smoke-w1 { animation: billow-wispy-1 2.5s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
              .smoke-w2 { animation: billow-wispy-2 2.7s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
              .smoke-w3 { animation: billow-wispy-3 2.3s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
              .core-active { animation: core-flicker 2.4s ease-out forwards; }
            `}</style>
            
            <defs>
              {/* Volumetric smoke filter */}
              <filter id="volumetric-blur" x="-100%" y="-100%" width="300%" height="300%">
                <feGaussianBlur stdDeviation="7" />
              </filter>
            </defs>
            
            {/* 1. Wispy White Volumetric Smoke Column */}
            <g filter="url(#volumetric-blur)">
              {/* Faint base wisps */}
              <circle cx="-5" cy="0" r="14" fill="#f8fafc" className="smoke-w1" opacity="0.15" />
              <circle cx="5" cy="-5" r="12" fill="#f1f5f9" className="smoke-w2" opacity="0.15" />
              <circle cx="0" cy="5" r="13" fill="#e2e8f0" className="smoke-w3" opacity="0.12" />

              {/* Main rising wispy columns */}
              <circle cx="-8" cy="-10" r="16" fill="#f8fafc" className="smoke-w1" style={{ animationDelay: '0.08s' }} opacity="0.22" />
              <circle cx="6" cy="-15" r="15" fill="#f1f5f9" className="smoke-w2" style={{ animationDelay: '0.14s' }} opacity="0.2" />
              <circle cx="-2" cy="-25" r="18" fill="#e2e8f0" className="smoke-w3" style={{ animationDelay: '0.22s' }} opacity="0.18" />
              
              <circle cx="8" cy="-35" r="22" fill="#f8fafc" className="smoke-w1" style={{ animationDelay: '0.3s' }} opacity="0.18" />
              <circle cx="-6" cy="-45" r="20" fill="#f1f5f9" className="smoke-w2" style={{ animationDelay: '0.38s' }} opacity="0.15" />
              
              {/* Dissipating top wisps */}
              <circle cx="2" cy="-60" r="24" fill="#f8fafc" className="smoke-w3" style={{ animationDelay: '0.48s' }} opacity="0.12" />
              <circle cx="-4" cy="-80" r="26" fill="#f1f5f9" className="smoke-w1" style={{ animationDelay: '0.62s' }} opacity="0.15" />
              <circle cx="4" cy="-100" r="28" fill="#e2e8f0" className="smoke-w2" style={{ animationDelay: '0.78s' }} opacity="0.1" />
            </g>

            {/* 2. Spark lines (Deterministic generation over a long timeline up to 2.2s) */}
            {Array.from({ length: 64 }).map((_, i) => {
              const angle = i * 5.625 + (i % 5) * 3.5; // 64 sparks around 360 degrees
              const length = 20 + (i % 6) * 7; // Tight lengths: 20px to 55px
              const delay = (i % 24) * 0.09; // Staggered delays: 0s up to 2.16s!
              const duration = 0.3 + (i % 3) * 0.07; // Varying speed: 0.3s to 0.44s
              return (
                <line
                  key={i}
                  x1="0"
                  y1="0"
                  x2={length}
                  y2="0"
                  stroke="#fbbf24"
                  strokeWidth="1.0"
                  strokeLinecap="round"
                  style={{
                    transform: `rotate(${angle}deg)`,
                    transformOrigin: '0px 0px',
                    animation: `spark-shoot ${duration}s cubic-bezier(0.25, 1, 0.5, 1) ${delay}s forwards`,
                  }}
                />
              );
            })}

            {/* 3. White-Hot Core (Flickers and shrinks over 2.4s) */}
            <g className="core-active" style={{ transformOrigin: 'center' }}>
              <circle r="8" fill="#f59e0b" opacity="0.75" filter="url(#volumetric-blur)" />
              <circle r="3" fill="#ffffff" />
            </g>
          </g>
        )}
      </g>

      {/* 5. Probe lead wires — draw from anchor dots to connected terminals (outside zoom scale group) */}
        {multimeter.redProbe && (() => {
          const pos = getTerminalPos(multimeter.redProbe.componentId, multimeter.redProbe.terminalId);
          const anchor = getPortCoords('dmm-red-port');
          return (
            <path
              d={getWirePath(anchor.x, anchor.y, pos.x * zoomScale + offsets.shiftX, pos.y * zoomScale + offsets.shiftY)}
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
          const anchor = getPortCoords('dmm-black-port');
          return (
            <path
              d={getWirePath(anchor.x, anchor.y, pos.x * zoomScale + offsets.shiftX, pos.y * zoomScale + offsets.shiftY)}
              fill="none"
              stroke="#475569"
              strokeWidth="3"
              strokeLinecap="round"
              opacity="0.9"
            />
          );
        })()}
      </svg>

      {selectedTimerId && (() => {
        const timer = components.find(component => component.id === selectedTimerId && component.type === 'timer_relay');
        return timer ? <Timer6062Panel component={timer} onClose={() => setSelectedTimerId(null)} /> : null;
      })()}
    </div>
  );
};
