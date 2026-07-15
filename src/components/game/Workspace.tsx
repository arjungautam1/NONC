import React, { useState, useRef, useEffect } from 'react';
import { useGameStore } from '../../store/useGameStore';
import { ComponentRenderer } from './components/ComponentRenderer';
import type { CircuitComponent, Wire } from '../../types/game';
import { getTerminalKey } from '../../simulation/circuitSolver';
import { Info, Download, ZoomIn, ZoomOut } from 'lucide-react';
import { soundManager } from '../../audio/soundManager';

export const Workspace: React.FC = () => {
  const {
    components,
    wires,
    isRunning,
    toggleSimulation,
    simulation,
    updateComponentPosition,
    addWire,
    removeWire,
    spliceWire,
    spliceAndConnectWire,
    multimeter,
    setProbe,
    probeMode,
    setProbeMode,
    currentLevelIndex,
    sidebarOpen,
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

  // Selected wire state for deletion
  const [selectedWireId, setSelectedWireId] = useState<string | null>(null);

  // Wire size adjust state
  const [wireSize, setWireSize] = useState<'normal' | 'thin'>('thin');

  const svgRef = useRef<SVGSVGElement | null>(null);

  // Listen to window resize to recalculate dynamic DMM anchor positions
  const [resizeToggle, setResizeToggle] = useState(0);
  useEffect(() => {
    const handleResize = () => setResizeToggle(prev => prev + 1);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const [offsets, setOffsets] = useState({ shiftX: 0, shiftY: 0 });

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

    components.forEach(c => {
      const w = 110;
      const h = 110;
      minX = Math.min(minX, c.x);
      maxX = Math.max(maxX, c.x + w);
      minY = Math.min(minY, c.y);
      maxY = Math.max(maxY, c.y + h);
    });

    const compWidth = maxX - minX;
    const compHeight = maxY - minY;
    const targetCenterX = svgWidth / 2;
    const targetCenterY = svgHeight / 2;
    const compCenterX = minX + compWidth / 2;
    const compCenterY = minY + compHeight / 2;

    setOffsets({
      shiftX: targetCenterX - compCenterX * zoomScale,
      shiftY: targetCenterY - compCenterY * zoomScale
    });
  }, [components, zoomScale, sidebarOpen, resizeToggle]);

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
    
    setDrawingWireStart({ componentId, terminalId });
    setMousePos(coords);
    setPointerDownCoords(coords);
  };

  const handleTerminalPointerUp = (e: React.PointerEvent, componentId: string, terminalId: string) => {
    if (probeMode) return;
    e.stopPropagation();
    if (drawingWireStart) {
      const from = drawingWireStart;
      if (from.componentId !== componentId || from.terminalId !== terminalId) {
        addWire(from.componentId, from.terminalId, componentId, terminalId, activeColor, tempWaypoints);
      }
      setDrawingWireStart(null);
      setTempWaypoints([]);
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

      const elem = document.elementFromPoint(e.clientX, e.clientY);
      const terminalHitbox = elem?.closest('.terminal-hitbox');
      if (terminalHitbox) {
        const compId = terminalHitbox.getAttribute('data-component-id');
        const termId = terminalHitbox.getAttribute('data-terminal-id');
        if (compId && termId) {
          if (hoveredTerminal?.componentId !== compId || hoveredTerminal?.terminalId !== termId) {
            setHoveredTerminal({ componentId: compId, terminalId: termId });
          }
          return;
        }
      }
      if (hoveredTerminal) {
        setHoveredTerminal(null);
      }
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
      if (hoveredTerminal) {
        const from = drawingWireStart;
        if (from.componentId !== hoveredTerminal.componentId || from.terminalId !== hoveredTerminal.terminalId) {
          addWire(from.componentId, from.terminalId, hoveredTerminal.componentId, hoveredTerminal.terminalId, activeColor, tempWaypoints);
        }
        setDrawingWireStart(null);
        setTempWaypoints([]);
      } else {
        // Drag release on empty space: check if it's a click to add waypoint
        const coords = getSVGCoords(e);
        if (pointerDownCoords) {
          const dist = Math.sqrt(Math.pow(coords.x - pointerDownCoords.x, 2) + Math.pow(coords.y - pointerDownCoords.y, 2));
          if (dist < 6) {
            setTempWaypoints(prev => [...prev, coords]);
            soundManager.playClick();
          }
        }
      }
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

  const getTerminalExtOffset = (compId: string, termId: string) => {
    const comp = components.find(c => c.id === compId);
    if (!comp) return { x: 0, y: 0 };
    const term = comp.terminals.find(t => t.id === termId);
    if (!term) return { x: 0, y: 0 };
    const local = getTerminalLocalPos(comp.type, term);

    if (comp.type === 'battery') {
      // Battery terminals are on top, exit upwards
      return { x: 0, y: -22 };
    }
    if (comp.type === 'power_supply' || comp.type === 'timer_relay') {
      // Power supply and timer relay terminals are on bottom, exit downwards
      return { x: 0, y: 22 };
    }

    // Default left/right horizontal exits for other components
    if (local.x > 5) return { x: 22, y: 0 };
    if (local.x < -5) return { x: -22, y: 0 };
    return { x: 0, y: 0 };
  };

  // Helper to extract relative terminal offsets and compute exit guide path points
  const getWireSegmentsPoints = (wire: Wire) => {
    const isLiveDrawing = !wire.toComponentId;

    const p1 = getTerminalPos(wire.fromComponentId, wire.fromTerminalId);
    const p2 = isLiveDrawing
      ? (wire.waypoints && wire.waypoints.length > 0 ? wire.waypoints[wire.waypoints.length - 1] : { x: 0, y: 0 })
      : getTerminalPos(wire.toComponentId, wire.toTerminalId);

    const ext1 = getTerminalExtOffset(wire.fromComponentId, wire.fromTerminalId);
    const ext2 = isLiveDrawing
      ? { x: 0, y: 0 }
      : getTerminalExtOffset(wire.toComponentId, wire.toTerminalId);

    const p1_ext = { x: p1.x + ext1.x, y: p1.y + ext1.y };
    const p2_ext = { x: p2.x + ext2.x, y: p2.y + ext2.y };

    const R = 8; // Fillet radius
    const STEPS = 20;
    const points: { x: number; y: number }[] = [];

    // Push starting point
    points.push(p1);

    const activeWaypoints = isLiveDrawing
      ? (wire.waypoints ? wire.waypoints.slice(0, -1) : [])
      : (wire.waypoints || []);

    // 1. First fillet / exit segment from p1
    let A0 = p1_ext;
    let ext1IsStraight = false;

    if (ext1.x !== 0 || ext1.y !== 0) {
      const target = activeWaypoints.length > 0 
        ? activeWaypoints[0] 
        : p2_ext;

      if (ext1.x !== 0) {
        // If target is in the same horizontal direction and vertical distance is small, go straight
        if (Math.sign(target.x - p1.x) === Math.sign(ext1.x) && Math.abs(target.y - p1.y) < 30) {
          ext1IsStraight = true;
          A0 = p1_ext;
        } else {
          const dirX = Math.sign(ext1.x);
          const dirY = target.y >= p1.y ? 1 : -1;
          const filletStart = { x: p1_ext.x - dirX * R, y: p1.y };
          const filletEnd = { x: p1_ext.x, y: p1.y + dirY * R };

          points.push(filletStart);
          for (let i = 1; i < 5; i++) {
            const t = i / 5;
            const mt = 1 - t;
            points.push({
              x: mt * mt * filletStart.x + 2 * mt * t * p1_ext.x + t * t * filletEnd.x,
              y: mt * mt * filletStart.y + 2 * mt * t * p1_ext.y + t * t * filletEnd.y
            });
          }
          A0 = filletEnd;
        }
      } else {
        // If target is in the same vertical direction and horizontal distance is small, go straight
        if (Math.sign(target.y - p1.y) === Math.sign(ext1.y) && Math.abs(target.x - p1.x) < 30) {
          ext1IsStraight = true;
          A0 = p1_ext;
        } else {
          const dirY = Math.sign(ext1.y);
          const dirX = target.x >= p1.x ? 1 : -1;
          const filletStart = { x: p1.x, y: p1_ext.y - dirY * R };
          const filletEnd = { x: p1.x + dirX * R, y: p1_ext.y };

          points.push(filletStart);
          for (let i = 1; i < 5; i++) {
            const t = i / 5;
            const mt = 1 - t;
            points.push({
              x: mt * mt * filletStart.x + 2 * mt * t * p1_ext.x + t * t * filletEnd.x,
              y: mt * mt * filletStart.y + 2 * mt * t * p1_ext.y + t * t * filletEnd.y
            });
          }
          A0 = filletEnd;
        }
      }
    }

    // 2. Second fillet / entry segment into p2
    let AN = p2_ext;
    let ext2IsStraight = false;
    const filletPoints2: { x: number; y: number }[] = [];

    if (ext2.x !== 0 || ext2.y !== 0) {
      const source = activeWaypoints.length > 0
        ? activeWaypoints[activeWaypoints.length - 1]
        : A0;

      if (ext2.x !== 0) {
        if (Math.sign(source.x - p2.x) === Math.sign(ext2.x) && Math.abs(source.y - p2.y) < 30) {
          ext2IsStraight = true;
          AN = p2_ext;
        } else {
          const dirX = Math.sign(ext2.x);
          const dirY = source.y >= p2.y ? 1 : -1;
          const filletStart = { x: p2_ext.x, y: p2.y + dirY * R };
          const filletEnd = { x: p2_ext.x - dirX * R, y: p2.y };

          for (let i = 1; i < 5; i++) {
            const t = i / 5;
            const mt = 1 - t;
            filletPoints2.push({
              x: mt * mt * filletStart.x + 2 * mt * t * p2_ext.x + t * t * filletEnd.x,
              y: mt * mt * filletStart.y + 2 * mt * t * p2_ext.y + t * t * filletEnd.y
            });
          }
          filletPoints2.push(filletEnd);
          AN = filletStart;
        }
      } else {
        if (Math.sign(source.y - p2.y) === Math.sign(ext2.y) && Math.abs(source.x - p2.x) < 30) {
          ext2IsStraight = true;
          AN = p2_ext;
        } else {
          const dirY = Math.sign(ext2.y);
          const dirX = source.x >= p2.x ? 1 : -1;
          const filletStart = { x: p2.x + dirX * R, y: p2_ext.y };
          const filletEnd = { x: p2.x, y: p2_ext.y - dirY * R };

          for (let i = 1; i < 5; i++) {
            const t = i / 5;
            const mt = 1 - t;
            filletPoints2.push({
              x: mt * mt * filletStart.x + 2 * mt * t * p2_ext.x + t * t * filletEnd.x,
              y: mt * mt * filletStart.y + 2 * mt * t * p2_ext.y + t * t * filletEnd.y
            });
          }
          filletPoints2.push(filletEnd);
          AN = filletStart;
        }
      }
    }

    // 3. Waypoint path or direct path
    if (activeWaypoints.length > 0) {
      const nodes = [A0, ...activeWaypoints, AN];
      
      for (let j = 1; j < nodes.length - 1; j++) {
        const W = nodes[j];
        const prev = nodes[j-1];
        const next = nodes[j+1];

        const vIn = { x: W.x - prev.x, y: W.y - prev.y };
        const lIn = Math.sqrt(vIn.x * vIn.x + vIn.y * vIn.y) || 1;
        const uIn = { x: vIn.x / lIn, y: vIn.y / lIn };

        const vOut = { x: next.x - W.x, y: next.y - W.y };
        const lOut = Math.sqrt(vOut.x * vOut.x + vOut.y * vOut.y) || 1;
        const uOut = { x: vOut.x / lOut, y: vOut.y / lOut };

        const r = Math.min(15, lIn / 2.1, lOut / 2.1);
        const pStart = { x: W.x - r * uIn.x, y: W.y - r * uIn.y };
        const pEnd = { x: W.x + r * uOut.x, y: W.y + r * uOut.y };

        points.push(pStart);

        for (let i = 1; i <= 5; i++) {
          const t = i / 5;
          const mt = 1 - t;
          points.push({
            x: mt * mt * pStart.x + 2 * mt * t * W.x + t * t * pEnd.x,
            y: mt * mt * pStart.y + 2 * mt * t * W.y + t * t * pEnd.y
          });
        }
      }

      points.push(AN);
      points.push(...filletPoints2);
      points.push(p2);
    } else {
      const dx = Math.abs(AN.x - A0.x);
      const dy = Math.abs(AN.y - A0.y);
      const sag = Math.max(30, Math.min(100, (dx + dy) * 0.15));

      let cp1x = A0.x;
      let cp1y = A0.y;
      const dirX = AN.x >= A0.x ? 1 : -1;
      const dirY = AN.y >= A0.y ? 1 : -1;

      if (ext1.x !== 0) {
        if (ext1IsStraight) {
          cp1x = A0.x + Math.sign(ext1.x) * sag;
        } else {
          cp1y = A0.y + dirY * sag;
        }
      } else if (ext1.y !== 0) {
        if (ext1IsStraight) {
          cp1y = A0.y + Math.sign(ext1.y) * sag;
        } else {
          cp1x = A0.x + dirX * sag;
        }
      } else {
        cp1y = A0.y + sag;
      }

      let cp2x = AN.x;
      let cp2y = AN.y;
      const sDirX = A0.x >= AN.x ? 1 : -1;
      const sDirY = A0.y >= AN.y ? 1 : -1;

      if (ext2.x !== 0) {
        if (ext2IsStraight) {
          cp2x = AN.x + Math.sign(ext2.x) * sag;
        } else {
          cp2y = AN.y + sDirY * sag;
        }
      } else if (ext2.y !== 0) {
        if (ext2IsStraight) {
          cp2y = AN.y + Math.sign(ext2.y) * sag;
        } else {
          cp2x = AN.x + sDirX * sag;
        }
      } else {
        cp2y = AN.y + sag;
      }

      for (let i = 0; i <= STEPS; i++) {
        const t = i / STEPS;
        const mt = 1 - t;
        const w1 = mt * mt * mt;
        const w2 = 3 * mt * mt * t;
        const w3 = 3 * mt * t * t;
        const w4 = t * t * t;
        points.push({
          x: w1 * A0.x + w2 * cp1x + w3 * cp2x + w4 * AN.x,
          y: w1 * A0.y + w2 * cp1y + w3 * cp2y + w4 * AN.y
        });
      }

      points.push(...filletPoints2);
      points.push(p2);
    }

    return points;
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
    return spliceWire(wire.id, x, y);
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
    <div className="flex-1 flex flex-col relative min-h-0 bg-[#090e15] select-none">
      
      {/* Canvas Toolbars */}
      <div className="h-10 border-b border-white/10 bg-[#090d14]/88 px-4 flex items-center justify-between text-xs font-medium text-slate-300 shrink-0 backdrop-blur">
        <div className="flex items-center gap-3.5">
          <span className="text-slate-500 uppercase tracking-wide text-[10px]">Wire</span>
          <div className="flex gap-2">
            {(['red', 'black', 'green', 'orange'] as const).map(color => (
              <button
                key={color}
                onClick={() => setActiveColor(color)}
                className={`w-5 h-5 rounded-md border transition-transform cursor-pointer relative ${
                  activeColor === color ? 'scale-105 ring-2 ring-white/60' : 'opacity-75 hover:opacity-100'
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

        <div className="flex items-center gap-2">
          {/* Zoom controls */}
          <div className="flex items-center gap-0.5 bg-white/[0.04] p-0.5 rounded-md border border-white/10">
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
            className="px-2.5 py-1 text-[10px] font-semibold tracking-wide bg-white/[0.06] hover:bg-white/[0.11] text-slate-300 rounded-md border border-white/10 cursor-pointer transition-all flex items-center gap-1.5"
            title="Download Schematic SVG File"
          >
            <Download className="w-3.5 h-3.5" strokeWidth={2.5} />
            <span>Schematic</span>
          </button>
          <button
            onClick={() => setWireSize(prev => prev === 'normal' ? 'thin' : 'normal')}
            className="px-2.5 py-1 text-[10px] font-semibold tracking-wide bg-white/[0.06] hover:bg-white/[0.11] text-slate-300 rounded-md border border-white/10 cursor-pointer transition-colors"
          >
            Size: {wireSize}
          </button>
          <div className="hidden lg:flex items-center gap-1.5 text-xs text-slate-400 bg-white/[0.03] px-2.5 py-1 rounded-md border border-white/10">
            <Info className="w-3.5 h-3.5" />
            <span>Select a wire to delete.</span>
          </div>
        </div>
      </div>

      {/* === PROBE / WIRE DRAWING BANNER === */}
      {(probeMode || drawingWireStart) && (
        <div
            className={`absolute top-10 left-0 right-0 z-30 flex items-center justify-between px-5 py-2 font-semibold tracking-wide text-sm pointer-events-auto ${
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
              : `🔌 ROUTING WIRE (${tempWaypoints.length} waypoints) — Click empty canvas to route / bend, click destination terminal to complete`}
          </span>
          <button
            onClick={() => {
              setProbeMode(null);
              setDrawingWireStart(null);
              setTempWaypoints([]);
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
        onClick={() => { if (probeMode) setProbeMode(null); }}
        onContextMenu={(e) => {
          e.preventDefault();
          setDrawingWireStart(null);
          setProbeMode(null);
          setTempWaypoints([]);
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
          


          {/* 1. Placed components casing layer */}
          {components.map(comp => {
          const isEnergized = isRunning && simulation.energizedComponents.has(comp.id);
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
            </g>
          );
        })}

        {/* 2. Wire connections layer */}
        {wires.map((wire, index) => {
          const p1 = getTerminalPos(wire.fromComponentId, wire.fromTerminalId);
          const p2 = getTerminalPos(wire.toComponentId, wire.toTerminalId);
          const pathD = getWirePathWithCrossings(index, wires);
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
                  if (drawingWireStart) {
                    // SPLICING: Create a junction at the click point, and connect the currently drawn wire to it atomically!
                    const coords = getSVGCoords(e as any);
                    spliceAndConnectWire(
                      wire.id,
                      coords.x,
                      coords.y,
                      drawingWireStart.componentId,
                      drawingWireStart.terminalId,
                      activeColor,
                      tempWaypoints
                    );
                    setDrawingWireStart(null);
                    setTempWaypoints([]);
                  } else {
                    // Regular selection
                    setSelectedWireId(isSelected ? null : wire.id);
                  }
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
                  className="glow-yellow animate-pulse"
                />
              )}

              {/* Main colored wire body */}
              <path
                d={pathD}
                fill="none"
                stroke={hexColor}
                strokeWidth={wireSize === 'normal' ? 3.5 : 1.8}
                strokeLinecap="round"
                className={`transition-all duration-300 ${
                  isWireDead ? 'opacity-40 brightness-[0.4] saturate-[0.2]' :
                  isBlocked ? 'brightness-[0.9] saturate-[0.8]' :
                  'brightness-110'
                }`}
              />

              {/* Voltage presence pulsing ring under glowing wires */}
              {isRunning && !isWireDead && !drawingWireStart && (
                <path
                  d={pathD}
                  fill="none"
                  stroke={hexColor}
                  strokeWidth={wireSize === 'normal' ? 5.5 : 2.5}
                  strokeLinecap="round"
                  strokeDasharray="2,6"
                  opacity="0.75"
                  filter="url(#yellow-glow)"
                />
              )}

              {/* Electron current flow overlay (flowing moving dots) */}
              {isAnimating && !drawingWireStart && (
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
                  transform={`translate(${(p1.x + p2.x) / 2 + 12}, ${(p1.y + p2.y) / 2 + 15})`}
                  className="cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeWire(wire.id);
                    setSelectedWireId(null);
                  }}
                >
                  <title>Delete Wire</title>
                  <circle cx="0" cy="0" r="10" fill="#ef4444" stroke="#7f1d1d" strokeWidth="1" />
                  <line x1="-4" y1="-4" x2="4" y2="4" stroke="#ffffff" strokeWidth="1.5" />
                  <line x1="4" y1="-4" x2="-4" y2="4" stroke="#ffffff" strokeWidth="1.5" />
                </g>
              )}

              {/* Splice / Extend button next to Delete button */}
              {isSelected && (
                <g 
                  transform={`translate(${(p1.x + p2.x) / 2 - 12}, ${(p1.y + p2.y) / 2 + 15})`}
                  className="cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    const midX = (p1.x + p2.x) / 2;
                    const midY = (p1.y + p2.y) / 2;
                    const junctionId = spliceWireAtCoords(wire, midX, midY);
                    if (junctionId) {
                      // Immediately start drawing a wire from this new junction!
                      setDrawingWireStart({ componentId: junctionId, terminalId: 'port' });
                      setActiveColor(wire.color);
                      setMousePos({ x: midX, y: midY });
                      setPointerDownCoords({ x: midX, y: midY });
                      setSelectedWireId(null);
                    }
                  }}
                >
                  <title>Splice Wire / Extend Joint</title>
                  <circle cx="0" cy="0" r="10" fill="#2563eb" stroke="#1e3a8a" strokeWidth="1" />
                  <line x1="-5" y1="0" x2="5" y2="0" stroke="#ffffff" strokeWidth="1.8" />
                  <line x1="0" y1="-5" x2="0" y2="5" stroke="#ffffff" strokeWidth="1.8" />
                </g>
              )}

              {/* Waypoint markers for selected wire */}
              {isSelected && wire.waypoints && wire.waypoints.map((wp, idx) => (
                <circle
                  key={`wp-${wire.id}-${idx}`}
                  cx={wp.x}
                  cy={wp.y}
                  r="3.5"
                  fill="#ffffff"
                  stroke="#6366f1"
                  strokeWidth="1.5"
                  opacity="0.8"
                  pointerEvents="none"
                />
              ))}
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
          
          return (
            <g>
              <path
                d={path}
                fill="none"
                stroke={getWireColorHex(activeColor)}
                strokeWidth="3.5"
                strokeDasharray="4,4"
                opacity="0.8"
              />
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
          return (
            <g
              key={`terminals-${comp.id}`}
              transform={`translate(${comp.x}, ${comp.y})`}
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
                      <circle 
                        cx="0" 
                        cy="0" 
                        r="16" 
                        fill="transparent" 
                        className="terminal-hitbox" 
                        data-component-id={comp.id}
                        data-terminal-id={term.id}
                      />

                      {/* Metal ring & Connection stud (Only for non-junction terminals) */}
                      {comp.type !== 'junction' && (
                        <>
                          <circle cx="0" cy="0" r="6" fill="#cbd5e1" stroke="#334155" strokeWidth="1.5" />
                          <circle cx="0" cy="0" r="3.5" fill={termColor} />
                        </>
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

                      {/* Floating label */}
                      {isHovered ? (
                        comp.type !== 'junction' && (
                          <text y="-22" fill="#ffffff" fontSize="9" fontWeight="black" textAnchor="middle" filter="drop-shadow(0 1px 2px rgba(0,0,0,0.8))">
                            {probeMode
                              ? (probeMode === 'red' ? `🔴 Attach RED → ${term.name}` : `⚫ Attach BLK → ${term.name}`)
                              : term.name
                            }
                          </text>
                        )
                      ) : (
                        // Don't show static label for timer_relay – board SVG already prints labels on the PCB
                        comp.type !== 'timer_relay' && comp.type !== 'junction' && (() => {
                          let labelX = 0;
                          let labelY = -10;
                          let anchor: 'middle' | 'start' | 'end' = 'middle';

                          if (comp.type === 'relay_dpdt') {
                            if (term.id === 'com1' || term.id === 'nc1' || term.id === 'no1' || term.id === 'coil_a') {
                              labelX = -13;
                              labelY = 3;
                              anchor = 'end';
                            } else if (term.id === 'com2' || term.id === 'nc2' || term.id === 'no2' || term.id === 'coil_b') {
                              labelX = 13;
                              labelY = 3;
                              anchor = 'start';
                            }
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

      {/* ── Main Power Toggle Switch Overlay (Fixed at top-left of workspace area) ── */}
      {components.length > 0 && (
        <div className="absolute top-14 left-4 z-20 pointer-events-auto bg-[#0b0f16]/90 border border-white/10 rounded-lg p-2.5 shadow-2xl flex flex-col items-center gap-1.5 backdrop-blur-md">
          <div className="text-[9px] font-black tracking-wider text-slate-500 uppercase select-none">System Power</div>
          <svg width="64" height="76" viewBox="0 0 64 76" style={{ cursor: 'pointer' }}>
            <defs>
              {/* Textured waffle pattern */}
              <pattern id="wafflePattern" width="4" height="4" patternUnits="userSpaceOnUse">
                <rect width="3" height="3" fill="#ffffff" opacity="0.12" />
                <rect x="0" y="0" width="4" height="4" fill="none" stroke="#000000" strokeWidth="0.5" opacity="0.25" />
              </pattern>
              
              {/* Glowing red filter */}
              <filter id="red-glow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="4" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>

              {/* Tilted Away (Shadow / Unlit) */}
              <linearGradient id="topTiltedGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#5c0d0d" />
                <stop offset="100%" stopColor="#2e0505" />
              </linearGradient>
              <linearGradient id="bottomTiltedGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#450a0a" />
                <stop offset="100%" stopColor="#240202" />
              </linearGradient>

              {/* OFF State - Pressed but Unlit */}
              <linearGradient id="topUnlitGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#881337" />
                <stop offset="100%" stopColor="#5c0d0d" />
              </linearGradient>

              {/* ON State - Pressed and Illuminated */}
              <linearGradient id="bottomIllumGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#ff4d4d" />
                <stop offset="35%" stopColor="#ef4444" />
                <stop offset="100%" stopColor="#b91c1c" />
              </linearGradient>
            </defs>

            {/* Black bezel casing */}
            <rect x="2" y="2" width="60" height="72" rx="6" fill="#18181b" stroke="#09090b" strokeWidth="2.5" />
            
            {/* Inner bevel frame */}
            <rect x="5" y="5" width="54" height="66" rx="4" fill="#2d2d30" stroke="#121214" strokeWidth="1" />
            
            {/* Rocker cavity depth */}
            <rect x="8" y="8" width="48" height="60" rx="2" fill="#09090b" />

            {/* Glowing neon active backlight */}
            {isRunning && (
              <path d="M 10,38 L 10,18 Q 10,12 13,12 Q 32,9 51,12 Q 54,12 54,18 L 54,58 Q 54,64 51,64 Q 32,67 13,64 Q 10,64 10,58 Z" fill="#ef4444" opacity="0.35" filter="url(#red-glow)" />
            )}

            {/* Rocker Key Body */}
            {isRunning ? (
              // ON state: bottom half "I" is pressed down, top half "O" is tilted up (shadowed)
              <g>
                {/* Top tilted-away half "O" */}
                <path d="M 10,38 L 10,18 Q 10,12 13,12 Q 32,9 51,12 Q 54,12 54,18 L 54,38 Z" fill="url(#topTiltedGrad)" />
                
                {/* Bottom pressed-in half "I" (brightly illuminated) */}
                <path d="M 10,38 L 54,38 L 54,58 Q 54,64 51,64 Q 32,67 13,64 Q 10,64 10,58 Z" fill="url(#bottomIllumGrad)" />

                {/* Textured Grid overlay */}
                <path d="M 10,38 L 10,18 Q 10,12 13,12 Q 32,9 51,12 Q 54,12 54,18 L 54,58 Q 54,64 51,64 Q 32,67 13,64 Q 10,64 10,58 Z" fill="url(#wafflePattern)" />

                {/* High contrast line in middle pivot */}
                <line x1="10" y1="38" x2="54" y2="38" stroke="#7f1d1d" strokeWidth="1.5" />
                <line x1="10" y1="39" x2="54" y2="39" stroke="#f87171" strokeWidth="0.5" opacity="0.5" />

                {/* Symbols */}
                <text x="32" y="26" fontSize="13" fontWeight="bold" fontFamily="system-ui, sans-serif" fill="#ffffff" textAnchor="middle" opacity="0.15">O</text>
                <text x="32" y="56" fontSize="13" fontWeight="bold" fontFamily="system-ui, sans-serif" fill="#ffe4e6" textAnchor="middle" filter="url(#red-glow)">I</text>
              </g>
            ) : (
              // OFF state: top half "O" is pressed down, bottom half "I" is tilted up (shadowed)
              <g>
                {/* Top pressed-in half "O" (unlit) */}
                <path d="M 10,38 L 10,18 Q 10,12 13,12 Q 32,9 51,12 Q 54,12 54,18 L 54,38 Z" fill="url(#topUnlitGrad)" />
                
                {/* Bottom tilted-away half "I" (shadowed) */}
                <path d="M 10,38 L 54,38 L 54,58 Q 54,64 51,64 Q 32,67 13,64 Q 10,64 10,58 Z" fill="url(#bottomTiltedGrad)" />

                {/* Textured Grid overlay */}
                <path d="M 10,38 L 10,18 Q 10,12 13,12 Q 32,9 51,12 Q 54,12 54,18 L 54,58 Q 54,64 51,64 Q 32,67 13,64 Q 10,64 10,58 Z" fill="url(#wafflePattern)" />

                {/* High contrast line in middle pivot */}
                <line x1="10" y1="38" x2="54" y2="38" stroke="#450a0a" strokeWidth="1.5" />
                <line x1="10" y1="39" x2="54" y2="39" stroke="#b91c1c" strokeWidth="0.5" opacity="0.3" />

                {/* Symbols (totally matte, unlit) */}
                <text x="32" y="26" fontSize="13" fontWeight="bold" fontFamily="system-ui, sans-serif" fill="#ffffff" textAnchor="middle" opacity="0.35">O</text>
                <text x="32" y="56" fontSize="13" fontWeight="bold" fontFamily="system-ui, sans-serif" fill="#ffffff" textAnchor="middle" opacity="0.12">I</text>
              </g>
            )}

            {/* Click target overlay */}
            <rect x="0" y="0" width="64" height="76" fill="transparent" onClick={(e) => { e.stopPropagation(); toggleSimulation(); }} />
          </svg>
        </div>
      )}
    </div>
  );
};
