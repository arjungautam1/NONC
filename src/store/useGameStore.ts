import { create } from 'zustand';
import type { 
  CircuitComponent, 
  Wire, 
  MultimeterState, 
  MultimeterMode, 
  ProbeConnection, 
  Achievement, 
  GameScore 
} from '../types/game';
import { levels } from '../levels/levelData';
import { solveCircuit, queryMultimeter, type SolverResult } from '../simulation/circuitSolver';
import {
  formatTimer6062Remaining,
  getTimer6062Config,
  getTimer6062DurationMs,
  getTimer6062TerminalIds,
  isTimer6062RelayActive,
  timer6062HasResetConflict,
  type Timer6062Config,
  type Timer6062Phase
} from '../simulation/timer6062';
import { soundManager } from '../audio/soundManager';
import {
  buildCustomLabComponents,
  createCustomLabComponent,
  getCustomLabOption,
  MAX_CUSTOM_COMPONENTS
} from '../customLab/componentCatalog';
import confetti from 'canvas-confetti';

let circuitEntitySequence = 0;
const createCircuitEntityId = (prefix: 'wire' | 'junction') =>
  `${prefix}_${Date.now()}_${circuitEntitySequence++}`;

interface GameState {
  currentLevelIndex: number;
  components: CircuitComponent[];
  wires: Wire[];
  history: { components: CircuitComponent[]; wires: Wire[] }[];
  redoHistory: { components: CircuitComponent[]; wires: Wire[] }[];
  
  multimeter: MultimeterState;
  probeMode: 'red' | 'black' | null;  // which probe is being placed (click-to-attach mode)
  isRunning: boolean;
  simulation: SolverResult;
  levelCompleted: boolean;
  successFeedback: string;
  
  score: GameScore;
  achievements: Achievement[];
  recentAchievement: Achievement | null;
  timeElapsed: number;
  timerIntervalId: any | null;
  shortCircuitPopup: { show: boolean; quote: string } | null;
  dismissShortCircuitPopup: () => void;
  shortCircuitSmoke: { active: boolean; x: number; y: number } | null;
  
  // Actions
  initLevel: (index: number, skipViewTransition?: boolean) => void;
  resetLevel: () => void;
  nextLevel: () => void;
  
  addComponent: (component: CircuitComponent) => void;
  removeComponent: (id: string) => void;
  updateComponentPosition: (id: string, x: number, y: number) => void;
  setComponentState: (id: string, key: string, value: any) => void;
  configureTimerRelay: (id: string, patch: Partial<Timer6062Config>) => void;
  pressButton: (id: string, pressed: boolean) => void;
  toggleSwitch: (id: string) => void;
  triggerCardReader: (id: string) => void;
  
  addWire: (
    fromCId: string, 
    fromTId: string, 
    toCId: string, 
    toTId: string, 
    color: 'red' | 'black' | 'green' | 'orange', 
    waypoints?: { x: number; y: number }[]
  ) => void;
  removeWire: (id: string) => void;
  updateWireWaypoints: (id: string, waypoints: { x: number; y: number }[]) => void;
  reconnectWire: (
    id: string,
    endpoint: 'from' | 'to',
    componentId: string,
    terminalId: string
  ) => void;
  spliceWire: (
    wireId: string,
    x: number,
    y: number,
    waypoints1?: { x: number; y: number }[],
    waypoints2?: { x: number; y: number }[]
  ) => string | null;
  spliceAndConnectWire: (
    wireId: string,
    x: number,
    y: number,
    fromCId: string,
    fromTId: string,
    color: 'red' | 'black' | 'green' | 'orange',
    waypoints?: { x: number; y: number }[],
    waypoints1?: { x: number; y: number }[],
    waypoints2?: { x: number; y: number }[]
  ) => void;
  
  undo: () => void;
  redo: () => void;
  
  setMultimeterMode: (mode: MultimeterMode) => void;
  setProbe: (color: 'red' | 'black', probe: ProbeConnection | null) => void;
  setProbeMode: (mode: 'red' | 'black' | null) => void;
  toggleSimulation: () => void;
  
  useHint: () => void;
  hintRevealedAt: number;
  startTimer: () => void;
  stopTimer: () => void;
  tickTimer: () => void;
  tickMotion: () => void;
  checkAchievements: () => void;
  dismissAchievement: () => void;
  unlockAchievement: (id: string) => void;
  sidebarOpen: boolean;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  bottomPanelOpen: boolean;
  toggleBottomPanel: () => void;
  setBottomPanelOpen: (open: boolean) => void;
  viewMode: 'levels' | 'lab';
  setViewMode: (mode: 'levels' | 'lab') => void;
  isCustomLab: boolean;
  customLabSelection: string[];
  setCustomLabSelection: (selection: string[]) => void;
  startCustomLab: (selection?: string[]) => void;
  addCustomLabComponent: (optionId: string) => void;
  removeCustomLabComponent: (optionId: string) => void;
}

const initialAchievements: Achievement[] = [
  { id: 'first_circuit', title: 'First Circuit', description: 'Power up your first lightbulb!', icon: 'Zap', unlocked: false },
  { id: 'relay_master', title: 'Relay Master', description: 'Complete a control circuit using a relay.', icon: 'Cpu', unlocked: false },
  { id: 'safety_first', title: 'Safety First', description: 'Wire an Emergency Stop safety loop.', icon: 'ShieldAlert', unlocked: false },
  { id: 'door_unlocked', title: 'Access Granted', description: 'Wire a magnetic door lock card access system.', icon: 'KeySquare', unlocked: false },
  { id: 'latch_expert', title: 'Latching Expert', description: 'Implement self-latching feedback relay control.', icon: 'Repeat', unlocked: false },
  { id: 'multimeter_pro', title: 'Multimeter Pro', description: 'Probe a live circuit terminal to diagnose voltage.', icon: 'Gauge', unlocked: false }
];

interface Timer6062Runtime {
  lastPowered: boolean;
  lastTrigger: boolean;
  mode: 'idle' | 'cycle' | 'repeat' | 'pulse';
  generation: number;
  deadline: number;
  eventTimeout: ReturnType<typeof setTimeout> | null;
  ticker: ReturnType<typeof setInterval> | null;
}

const timer6062Runtimes = new Map<string, Timer6062Runtime>();

const createTimer6062Runtime = (): Timer6062Runtime => ({
  lastPowered: false,
  lastTrigger: false,
  mode: 'idle',
  generation: 0,
  deadline: 0,
  eventTimeout: null,
  ticker: null
});

const clearTimer6062Schedule = (runtime: Timer6062Runtime) => {
  if (runtime.eventTimeout) clearTimeout(runtime.eventTimeout);
  if (runtime.ticker) clearInterval(runtime.ticker);
  runtime.eventTimeout = null;
  runtime.ticker = null;
  runtime.deadline = 0;
  runtime.mode = 'idle';
  runtime.generation += 1;
};

const clearTimer6062Runtime = (componentId: string) => {
  const runtime = timer6062Runtimes.get(componentId);
  if (runtime) clearTimer6062Schedule(runtime);
  timer6062Runtimes.delete(componentId);
};

const clearAllTimer6062Runtimes = () => {
  timer6062Runtimes.forEach(clearTimer6062Schedule);
  timer6062Runtimes.clear();
};
let motionIntervalId: any = null;

const getAltronixTerminals = (component: CircuitComponent) => {
  const posName = component.terminals.find(t => t.id === 'pos')?.name || '(+)';
  const negName = component.terminals.find(t => t.id === 'neg')?.name || '(-)';
  const groundTerminal = component.terminals.find(t => t.id === 'gnd');

  return [
    { id: 'ac1', name: 'AC', type: 'in' as const, x: -45, y: 35 },
    { id: 'ac2', name: 'AC', type: 'in' as const, x: -15, y: 35 },
    { id: 'pos', name: posName, type: 'pos' as const, x: 15, y: 35 },
    { id: 'neg', name: negName, type: 'neg' as const, x: 45, y: 35 },
    ...(groundTerminal ? [{ id: 'gnd', name: groundTerminal.name, type: 'gnd' as const, x: 0, y: -35 }] : [])
  ];
};

const getTransformerForPowerSupply = (component: CircuitComponent, id: string): CircuitComponent => {
  const placeAbove = component.y >= 270;
  const preferredPosition = component.state.transformerPosition as { x: number; y: number } | undefined;
  return {
    id,
    type: 'transformer',
    x: preferredPosition?.x ?? (placeAbove ? component.x : component.x + 170),
    y: preferredPosition?.y ?? (placeAbove ? Math.max(170, component.y - 150) : component.y),
    label: 'AC/AC Transformer',
    terminals: [
      { id: 'pos', name: '(+)', type: 'pos', x: -20, y: 35 },
      { id: 'neg', name: '(-)', type: 'neg', x: 20, y: 35 }
    ],
    state: { lockedPosition: true }
  };
};

const normalizePowerStack = (components: CircuitComponent[]) => {
  const hasTransformer = components.some(c => c.type === 'transformer');
  let addedTransformer = false;

  const normalizedComponents = components.flatMap(component => {
    const isSource = component.type === 'power_supply' || component.type === 'battery';
    if (!isSource) return [component];

    const alreadyHasAcInputs = component.terminals.some(t => t.id === 'ac1') && component.terminals.some(t => t.id === 'ac2');
    const labeledVoltage = /(^|\s)12\s*V/i.test(component.label) ? 12 : 24;
    const normalizedPowerSupply: CircuitComponent = {
      ...component,
      type: 'power_supply',
      label: 'Altronix Board',
      terminals: getAltronixTerminals(component),
      state: {
        ...component.state,
        lockedPosition: true,
        requireAcInput: component.state.requireAcInput ?? (component.type === 'power_supply' && alreadyHasAcInputs),
        outputVoltage: Number(component.state.outputVoltage ?? (component.type === 'battery' ? 12 : labeledVoltage))
      }
    };

    if (hasTransformer || addedTransformer) {
      return [normalizedPowerSupply];
    }

    addedTransformer = true;
    return [
      getTransformerForPowerSupply(component, 'smps'),
      normalizedPowerSupply
    ];
  });

  return normalizedComponents.map(component => {
    if (component.type === 'transformer') {
      return {
        ...component,
        state: { ...component.state, lockedPosition: true }
      };
    }
    if (component.type !== 'timer_relay') return component;
    const config = getTimer6062Config(component);
    const duration = getTimer6062DurationMs(config);
    const terminalIds = getTimer6062TerminalIds(component);
    const cadTerminalLayout = new Map([
      [terminalIds.trigger, { name: 'TRG', x: -36 }],
      [terminalIds.negative, { name: '−', x: -22 }],
      [terminalIds.positive, { name: '+', x: -7 }],
      [terminalIds.normallyOpen, { name: 'NO', x: 7 }],
      [terminalIds.common, { name: 'C', x: 22 }],
      [terminalIds.normallyClosed, { name: 'NC', x: 36 }]
    ]);
    return {
      ...component,
      label: component.label || 'Altronix 6062 Timer',
      terminals: component.terminals.map(terminal => {
        const cadPosition = cadTerminalLayout.get(terminal.id);
        return cadPosition
          ? { ...terminal, name: cadPosition.name, x: cadPosition.x, y: 40 }
          : terminal;
      }),
      state: {
        ...component.state,
        timer6062Config: config,
        relayActive: false,
        delayedActive: false,
        timerPhase: 'unpowered' as Timer6062Phase,
        timeLeftMs: duration,
        timeLeft: formatTimer6062Remaining(duration),
        boardPowered: false,
        triggerActive: false,
        voltageValid: false
      }
    };
  });
};

export const useGameStore = create<GameState>((set, get) => {
  
  const saveToHistory = (components: CircuitComponent[], wires: Wire[]) => {
    const { history } = get();
    // Keep history size to 30 elements
    const newHistory = [...history, { 
      components: JSON.parse(JSON.stringify(components)), 
      wires: [...wires] 
    }].slice(-30);
    
    set({ history: newHistory, redoHistory: [] });
  };

  const hasTimer6062ConfigurationConflict = (config: Timer6062Config) =>
    timer6062HasResetConflict(config) || (config.j2Cut && !config.dip1RelayAtEnd);

  const commitTimer6062State = (componentId: string, statePatch: Record<string, unknown>) => {
    const current = get();
    const components = current.components.map(component => component.id === componentId
      ? { ...component, state: { ...component.state, ...statePatch } }
      : component
    );
    runSimulation(components, current.wires, current.isRunning);
  };

  const startTimer6062Ticker = (componentId: string, runtime: Timer6062Runtime, generation: number) => {
    runtime.ticker = setInterval(() => {
      const liveRuntime = timer6062Runtimes.get(componentId);
      if (!liveRuntime || liveRuntime.generation !== generation || liveRuntime.deadline <= 0) return;
      const remaining = Math.max(0, liveRuntime.deadline - Date.now());
      set(state => ({
        components: state.components.map(component => component.id === componentId
          ? {
              ...component,
              state: {
                ...component.state,
                timeLeftMs: remaining,
                timeLeft: formatTimer6062Remaining(remaining)
              }
            }
          : component
        )
      }));
    }, 100);
  };

  const finishTimer6062Cycle = (componentId: string, config: Timer6062Config, generation: number) => {
    const runtime = timer6062Runtimes.get(componentId);
    if (!runtime || runtime.generation !== generation || runtime.mode !== 'cycle') return;
    clearTimer6062Schedule(runtime);

    if (!config.dip1RelayAtEnd) {
      soundManager.playClick();
      commitTimer6062State(componentId, {
        relayActive: false,
        delayedActive: false,
        timerPhase: 'ready' as Timer6062Phase,
        timeLeftMs: 0,
        timeLeft: '0.0s'
      });
      return;
    }

    soundManager.playClick();
    if (config.j2Cut) {
      runtime.mode = 'pulse';
      const pulseGeneration = runtime.generation;
      runtime.deadline = Date.now() + 1_000;
      startTimer6062Ticker(componentId, runtime, pulseGeneration);
      runtime.eventTimeout = setTimeout(() => {
        const pulseRuntime = timer6062Runtimes.get(componentId);
        if (!pulseRuntime || pulseRuntime.generation !== pulseGeneration || pulseRuntime.mode !== 'pulse') return;
        clearTimer6062Schedule(pulseRuntime);
        soundManager.playClick();
        commitTimer6062State(componentId, {
          relayActive: false,
          delayedActive: false,
          timerPhase: 'ready' as Timer6062Phase,
          timeLeftMs: 0,
          timeLeft: '0.0s'
        });
      }, 1_000);
      commitTimer6062State(componentId, {
        relayActive: true,
        delayedActive: true,
        timerPhase: 'pulse' as Timer6062Phase,
        timeLeftMs: 1_000,
        timeLeft: '1.0s'
      });
      return;
    }

    commitTimer6062State(componentId, {
      relayActive: true,
      delayedActive: true,
      timerPhase: 'output' as Timer6062Phase,
      timeLeftMs: 0,
      timeLeft: '0.0s'
    });
  };

  const beginTimer6062Cycle = (
    componentId: string,
    sourceState: CircuitComponent['state'],
    config: Timer6062Config
  ) => {
    const runtime = timer6062Runtimes.get(componentId) ?? createTimer6062Runtime();
    timer6062Runtimes.set(componentId, runtime);
    clearTimer6062Schedule(runtime);

    const duration = getTimer6062DurationMs(config);
    const relayActive = !config.dip1RelayAtEnd;
    runtime.mode = 'cycle';
    runtime.deadline = Date.now() + duration;
    const generation = runtime.generation;
    startTimer6062Ticker(componentId, runtime, generation);
    runtime.eventTimeout = setTimeout(
      () => finishTimer6062Cycle(componentId, config, generation),
      duration
    );

    if (relayActive !== Boolean(sourceState.relayActive ?? sourceState.delayedActive)) {
      soundManager.playClick();
    }

    return {
      ...sourceState,
      relayActive,
      delayedActive: relayActive,
      timerPhase: 'timing' as Timer6062Phase,
      timeLeftMs: duration,
      timeLeft: formatTimer6062Remaining(duration)
    };
  };

  const scheduleTimer6062RepeatEdge = (
    componentId: string,
    config: Timer6062Config,
    runtime: Timer6062Runtime,
    generation: number
  ) => {
    const duration = getTimer6062DurationMs(config);
    runtime.eventTimeout = setTimeout(() => {
      const liveRuntime = timer6062Runtimes.get(componentId);
      const component = get().components.find(candidate => candidate.id === componentId);
      if (!liveRuntime || !component || liveRuntime.generation !== generation || liveRuntime.mode !== 'repeat') return;

      const relayActive = !isTimer6062RelayActive(component);
      liveRuntime.deadline = Date.now() + duration;
      soundManager.playClick();
      scheduleTimer6062RepeatEdge(componentId, config, liveRuntime, generation);
      commitTimer6062State(componentId, {
        relayActive,
        delayedActive: relayActive,
        timerPhase: 'repeat' as Timer6062Phase,
        timeLeftMs: duration,
        timeLeft: formatTimer6062Remaining(duration)
      });
    }, duration);
  };

  const beginTimer6062Repeat = (
    componentId: string,
    sourceState: CircuitComponent['state'],
    config: Timer6062Config
  ) => {
    const runtime = timer6062Runtimes.get(componentId) ?? createTimer6062Runtime();
    timer6062Runtimes.set(componentId, runtime);
    clearTimer6062Schedule(runtime);
    const duration = getTimer6062DurationMs(config);
    runtime.mode = 'repeat';
    runtime.deadline = Date.now() + duration;
    const generation = runtime.generation;
    startTimer6062Ticker(componentId, runtime, generation);
    scheduleTimer6062RepeatEdge(componentId, config, runtime, generation);

    return {
      ...sourceState,
      relayActive: false,
      delayedActive: false,
      timerPhase: 'repeat' as Timer6062Phase,
      timeLeftMs: duration,
      timeLeft: formatTimer6062Remaining(duration)
    };
  };

  const runSimulation = (currentComponents: CircuitComponent[], currentWires: Wire[], currentIsRunning: boolean) => {
    // Solve circuit
    const solverResult = solveCircuit(currentComponents, currentWires, currentIsRunning);



    // Synchronize sounds (continuous hums)
    if (currentIsRunning && !solverResult.shortCircuit) {
      currentComponents.forEach(c => {
        const isEnergized = solverResult.energizedComponents.has(c.id);
        if (isEnergized) {
          if (c.type === 'motor' || c.type === 'roland_fan') soundManager.startHum(c.id, 'motor');
          else if (c.type === 'buzzer') soundManager.startHum(c.id, 'buzzer');
          else if (c.type === 'bulb' || c.type === 'led' || c.type === 'lamp_indicator' || c.type === 'led_strip') {
            soundManager.startHum(c.id, 'bulb');
          }
        } else {
          soundManager.stopHum(c.id);
        }
      });
      // Handle fuses blowing sound if newly blown
      if (solverResult.fuseBlownIds.length > 0) {
        soundManager.playSpark();
      }
    } else {
      // Stop all hums if simulator is off or in short circuit
      soundManager.stopAllHums();
      if (solverResult.shortCircuit) {
        soundManager.playSpark();
      }
    }

    // Update relay mechanics and advance each 6062 from real terminal voltages,
    // trigger edges, DIP selections, jumper cuts, and trimpot setting.
    let timerContactChanged = false;
    const updatedComponents = currentComponents.map(c => {
      if (c.type === 'relay' || c.type === 'relay_dpdt') {
        const isEnergized = solverResult.energizedComponents.has(c.id);
        if (isEnergized !== c.state.energized) {
          if (isEnergized) soundManager.playClick();
          return { ...c, state: { ...c.state, energized: isEnergized } };
        }
      }
      if (c.type === 'timer_relay') {
        const config = getTimer6062Config(c);
        const terminals = getTimer6062TerminalIds(c);
        const duration = getTimer6062DurationMs(config);
        const supplyVoltage = solverResult.nodeVoltages[`${c.id}:${terminals.positive}`] || 0;
        const hasPowerPath = solverResult.energizedComponents.has(c.id);
        const expectedVoltage = config.dip3TwelveVolt ? 12 : 24;
        const voltageValid = hasPowerPath && Math.abs(supplyVoltage - expectedVoltage) <= 2;
        const boardPowered = currentIsRunning && !solverResult.shortCircuit && voltageValid;
        const triggerVoltage = solverResult.nodeVoltages[`${c.id}:${terminals.trigger}`] || 0;
        const triggerThreshold = config.dip3TwelveVolt ? 7 : 15;
        const triggerActive = boardPowered && triggerVoltage >= triggerThreshold;
        const runtime = timer6062Runtimes.get(c.id) ?? createTimer6062Runtime();
        timer6062Runtimes.set(c.id, runtime);

        let nextState: CircuitComponent['state'] = {
          ...c.state,
          timer6062Config: config,
          boardPowered,
          inputVoltage: supplyVoltage,
          voltageValid,
          triggerActive
        };
        const relayWasActive = isTimer6062RelayActive(c);

        if (!boardPowered) {
          if (runtime.mode !== 'idle') clearTimer6062Schedule(runtime);
          runtime.lastPowered = false;
          runtime.lastTrigger = false;
          nextState = {
            ...nextState,
            relayActive: false,
            delayedActive: false,
            timerPhase: currentIsRunning && hasPowerPath && supplyVoltage > 0
              ? 'voltage-mismatch' as Timer6062Phase
              : 'unpowered' as Timer6062Phase,
            timeLeftMs: duration,
            timeLeft: formatTimer6062Remaining(duration)
          };
        } else {
          const risingTrigger = !runtime.lastTrigger && triggerActive;
          const fallingTrigger = runtime.lastTrigger && !triggerActive;
          const newlyPowered = !runtime.lastPowered;
          runtime.lastPowered = true;

          if (config.j1Cut) {
            if (runtime.mode !== 'repeat') {
              nextState = beginTimer6062Repeat(c.id, nextState, config);
            }
          } else if (hasTimer6062ConfigurationConflict(config)) {
            if (runtime.mode !== 'idle') clearTimer6062Schedule(runtime);
            nextState = {
              ...nextState,
              relayActive: false,
              delayedActive: false,
              timerPhase: 'configuration-conflict' as Timer6062Phase,
              timeLeftMs: duration,
              timeLeft: formatTimer6062Remaining(duration)
            };
          } else if (newlyPowered) {
            if (!config.j3Cut || (!config.dip4TriggerRemoval && triggerActive)) {
              nextState = beginTimer6062Cycle(c.id, nextState, config);
            } else {
              nextState = {
                ...nextState,
                relayActive: false,
                delayedActive: false,
                timerPhase: config.dip4TriggerRemoval && triggerActive
                  ? 'armed' as Timer6062Phase
                  : 'ready' as Timer6062Phase,
                timeLeftMs: duration,
                timeLeft: formatTimer6062Remaining(duration)
              };
            }
          } else if (config.dip4TriggerRemoval) {
            if (risingTrigger) {
              if (runtime.mode !== 'idle') clearTimer6062Schedule(runtime);
              nextState = {
                ...nextState,
                relayActive: false,
                delayedActive: false,
                timerPhase: 'armed' as Timer6062Phase,
                timeLeftMs: duration,
                timeLeft: formatTimer6062Remaining(duration)
              };
            } else if (fallingTrigger) {
              nextState = beginTimer6062Cycle(c.id, nextState, config);
            }
          } else if (risingTrigger) {
            nextState = beginTimer6062Cycle(c.id, nextState, config);
          } else if (fallingTrigger && isTimer6062RelayActive(c) && c.state.timerPhase === 'output') {
            soundManager.playClick();
            nextState = {
              ...nextState,
              relayActive: false,
              delayedActive: false,
              timerPhase: 'ready' as Timer6062Phase,
              timeLeftMs: duration,
              timeLeft: formatTimer6062Remaining(duration)
            };
          }

          runtime.lastTrigger = triggerActive;
        }

        if (relayWasActive !== Boolean(nextState.relayActive ?? nextState.delayedActive)) {
          timerContactChanged = true;
        }
        return { ...c, state: nextState };
      }
      if (c.type === 'maglock') {
        const isEnergized = solverResult.energizedComponents.has(c.id);
        return { ...c, state: { ...c.state, active: isEnergized } };
      }
      return c;
    });

    const effectiveSolverResult = timerContactChanged
      ? solveCircuit(updatedComponents, currentWires, currentIsRunning)
      : solverResult;
    effectiveSolverResult.energizedComponents = new Set(
      [...effectiveSolverResult.energizedComponents].filter(componentId => {
        const component = updatedComponents.find(candidate => candidate.id === componentId);
        return component?.type !== 'timer_relay' || component.state.boardPowered;
      })
    );

    // Update multimeter reading if active
    let multimeterReading = '---';
    if (get().multimeter.mode !== 'OFF') {
      multimeterReading = queryMultimeter(
        get().multimeter.mode,
        get().multimeter.redProbe,
        get().multimeter.blackProbe,
        updatedComponents,
        currentWires,
        effectiveSolverResult
      );
    }

    // Trigger success criteria check if simulation is running
    let completed = false;
    let feedback = '';

    if (currentIsRunning && !effectiveSolverResult.shortCircuit && !get().isCustomLab) {
      const level = levels[get().currentLevelIndex];
      const isEnergizedFn = (cid: string) => effectiveSolverResult.energizedComponents.has(cid);
      const testResult = level.successCriteria(
        updatedComponents,
        currentWires,
        effectiveSolverResult.nodeVoltages,
        isEnergizedFn
      );
      
      if (testResult.success) {
        completed = true;
        // Trigger win effects
        if (!get().levelCompleted) {
          soundManager.playSuccess();
          confetti({
            particleCount: 80,
            spread: 60,
            origin: { y: 0.6 }
          });
          get().stopTimer();
          // Unlock any achievements
          get().checkAchievements();
        }
      } else {
        feedback = testResult.feedback || '';
      }
    } else if (effectiveSolverResult.shortCircuit) {
      feedback = '🚨 Short Circuit Detected! Current is flowing directly from Positive to Negative without passing through a load. Check your wiring loops.';
      
      if (currentIsRunning) {
        soundManager.playShortCircuit();
        currentIsRunning = false;

        // Calculate center coordinate of components
        let sumX = 0;
        let sumY = 0;
        if (updatedComponents.length > 0) {
          updatedComponents.forEach(c => {
            sumX += c.x;
            sumY += c.y;
          });
          sumX /= updatedComponents.length;
          sumY /= updatedComponents.length;
        } else {
          sumX = 400;
          sumY = 300;
        }

        const FUNNY_SHORT_QUOTES = [
          "💥 POP! You just let the magic smoke out of the wires!",
          "🔥 ZAP! Quick, blow on the components before they melt!",
          "⚡ OUCH! That was a short circuit. Component eyebrows have been singed.",
          "💥 Boom! Congratulations, you successfully turned your circuit into a heater!",
          "🔥 Tripped! Delmi's insurance policy does not cover virtual fire damage."
        ];
        const randomQuote = FUNNY_SHORT_QUOTES[Math.floor(Math.random() * FUNNY_SHORT_QUOTES.length)];

        // Set smoke active and turn off simulation power instantly
        set({
          shortCircuitSmoke: { active: true, x: sumX + 50, y: sumY + 30 },
          isRunning: false
        });

        // Delay the pop-up modal until the smoke animation completes
        setTimeout(() => {
          set({
            shortCircuitSmoke: null,
            shortCircuitPopup: { show: true, quote: randomQuote }
          });
        }, 3000);
      }
    }

    // Trigger continuity beep sound if mode is CONTINUITY and reading indicates path
    if (get().multimeter.mode === 'CONTINUITY' && multimeterReading.includes('Beep')) {
      soundManager.startBeep();
    } else {
      soundManager.stopBeep();
    }

    set({
      components: updatedComponents,
      simulation: effectiveSolverResult,
      multimeter: {
        ...get().multimeter,
        reading: multimeterReading
      },
      levelCompleted: completed,
      successFeedback: feedback
    });
  };

  return {
    currentLevelIndex: 0,
    components: [],
    wires: [],
    history: [],
    redoHistory: [],
    
    multimeter: {
      mode: 'OFF',
      redProbe: null,
      blackProbe: null,
      reading: '---'
    },
    probeMode: null,
    isRunning: false,
    simulation: {
      nodeVoltages: {},
      energizedComponents: new Set(),
      shortCircuit: false,
      shortCircuitNodes: new Set(),
      fuseBlownIds: [],
      diagnosticLog: [],
      faultLocation: null
    },
    levelCompleted: false,
    successFeedback: '',
    
    score: {
      stars: 0,
      score: 0,
      timeElapsed: 0,
      hintsUsed: 0,
      errorsMade: 0
    },
    achievements: initialAchievements,
    recentAchievement: null,
    timeElapsed: 0,
    timerIntervalId: null,
    sidebarOpen: true,
    toggleSidebar: () => set(state => ({ sidebarOpen: !state.sidebarOpen })),
    setSidebarOpen: (open) => set({ sidebarOpen: open }),
    bottomPanelOpen: true,
    toggleBottomPanel: () => set(state => ({ bottomPanelOpen: !state.bottomPanelOpen })),
    setBottomPanelOpen: (open) => set({ bottomPanelOpen: open }),
    hintRevealedAt: 0,
    viewMode: 'levels',
    setViewMode: (mode) => set({ viewMode: mode }),
    isCustomLab: false,
    customLabSelection: [],
    setCustomLabSelection: (selection) => set({ customLabSelection: [...selection] }),
    startCustomLab: (selection) => {
      const selectedIds = [...new Set(selection ?? get().customLabSelection)]
        .filter(optionId => Boolean(getCustomLabOption(optionId)))
        .slice(0, MAX_CUSTOM_COMPONENTS);
      const customComponents = normalizePowerStack(buildCustomLabComponents(selectedIds));

      get().stopTimer();
      soundManager.stopAllHums();
      clearAllTimer6062Runtimes();

      set({
        components: customComponents,
        wires: [],
        history: [],
        redoHistory: [],
        isRunning: false,
        levelCompleted: false,
        successFeedback: '',
        shortCircuitPopup: null,
        shortCircuitSmoke: null,
        timeElapsed: 0,
        multimeter: {
          mode: 'OFF',
          redProbe: null,
          blackProbe: null,
          reading: '---'
        },
        score: {
          stars: 0,
          score: 0,
          timeElapsed: 0,
          hintsUsed: 0,
          errorsMade: 0
        },
        sidebarOpen: true,
        bottomPanelOpen: false,
        isCustomLab: true,
        customLabSelection: [...selectedIds],
        viewMode: 'lab'
      });

      runSimulation(customComponents, [], false);
      get().startTimer();
    },
    addCustomLabComponent: (optionId) => {
      const state = get();
      if (
        !state.isCustomLab ||
        !getCustomLabOption(optionId) ||
        state.customLabSelection.includes(optionId) ||
        state.customLabSelection.length >= MAX_CUSTOM_COMPONENTS
      ) return;

      const component = createCustomLabComponent(optionId, state.components);
      if (!component) return;

      const newComponents = [...state.components, component];
      saveToHistory(state.components, state.wires);
      set({
        components: newComponents,
        customLabSelection: [...state.customLabSelection, optionId]
      });
      runSimulation(newComponents, state.wires, state.isRunning);
      soundManager.playClick();
    },
    removeCustomLabComponent: (optionId) => {
      const state = get();
      if (!state.isCustomLab || !state.customLabSelection.includes(optionId)) return;

      const componentId = `custom_${optionId}`;
      const newComponents = state.components.filter(component => component.id !== componentId);
      const newWires = state.wires.filter(wire =>
        wire.fromComponentId !== componentId && wire.toComponentId !== componentId
      );
      const redProbe = state.multimeter.redProbe?.componentId === componentId ? null : state.multimeter.redProbe;
      const blackProbe = state.multimeter.blackProbe?.componentId === componentId ? null : state.multimeter.blackProbe;

      clearTimer6062Runtime(componentId);

      saveToHistory(state.components, state.wires);
      set({
        components: newComponents,
        wires: newWires,
        customLabSelection: state.customLabSelection.filter(id => id !== optionId),
        multimeter: { ...state.multimeter, redProbe, blackProbe }
      });
      runSimulation(newComponents, newWires, state.isRunning);
      soundManager.playClick();
    },
    shortCircuitPopup: null,
    dismissShortCircuitPopup: () => set({ shortCircuitPopup: null }),
    shortCircuitSmoke: null,

    initLevel: (index, skipViewTransition = false) => {
      const level = levels[index];
      if (!level) return;

      // Stop previous timer and hums
      get().stopTimer();
      soundManager.stopAllHums();
      clearAllTimer6062Runtimes();

      // Deep copy level components
      const newComps = normalizePowerStack(JSON.parse(JSON.stringify(level.preplacedComponents)));
      const newWires = [...level.preplacedWires];

      set({
        currentLevelIndex: index,
        components: newComps,
        wires: newWires,
        history: [],
        redoHistory: [],
        isRunning: false,
        levelCompleted: false,
        successFeedback: '',
        shortCircuitPopup: null,
        shortCircuitSmoke: null,
        timeElapsed: 0,
        multimeter: {
          mode: 'OFF',
          redProbe: null,
          blackProbe: null,
          reading: '---'
        },
        score: {
          stars: 0,
          score: 0,
          timeElapsed: 0,
          hintsUsed: 0,
          errorsMade: 0
        },
        sidebarOpen: true,
        bottomPanelOpen: true,
        isCustomLab: false,
        ...(skipViewTransition ? {} : { viewMode: 'lab' })
      });

      // Solve initial states
      runSimulation(newComps, newWires, false);
      get().startTimer();
    },

    resetLevel: () => {
      const { initLevel, currentLevelIndex, isCustomLab, startCustomLab, customLabSelection } = get();
      if (isCustomLab) {
        startCustomLab(customLabSelection);
        soundManager.playButton();
        return;
      }
      initLevel(currentLevelIndex);
      soundManager.playButton();
    },

    nextLevel: () => {
      const { currentLevelIndex, initLevel } = get();
      if (currentLevelIndex < levels.length - 1) {
        initLevel(currentLevelIndex + 1);
      }
    },

    addComponent: (comp) => {
      const newComponents = [...get().components, comp];
      saveToHistory(get().components, get().wires);
      set({ components: newComponents });
      runSimulation(newComponents, get().wires, get().isRunning);
    },

    removeComponent: (id) => {
      saveToHistory(get().components, get().wires);
      clearTimer6062Runtime(id);
      // Remove component and any wires snapped to it
      const newComponents = get().components.filter(c => c.id !== id);
      const newWires = get().wires.filter(w => w.fromComponentId !== id && w.toComponentId !== id);
      
      // Clear multimeter probes if they were connected to it
      const redProbe = get().multimeter.redProbe?.componentId === id ? null : get().multimeter.redProbe;
      const blackProbe = get().multimeter.blackProbe?.componentId === id ? null : get().multimeter.blackProbe;

      set({ 
        components: newComponents, 
        wires: newWires,
        multimeter: { ...get().multimeter, redProbe, blackProbe }
      });
      runSimulation(newComponents, newWires, get().isRunning);
    },

    updateComponentPosition: (id, x, y) => {
      const newComponents = get().components.map(c => 
        c.id === id ? { ...c, x, y } : c
      );
      set({ components: newComponents });
    },

    setComponentState: (id, key, value) => {
      const newComponents = get().components.map(c => 
        c.id === id ? { ...c, state: { ...c.state, [key]: value } } : c
      );
      runSimulation(newComponents, get().wires, get().isRunning);
    },

    configureTimerRelay: (id, patch) => {
      const current = get();
      if (current.isRunning) return;
      const timer = current.components.find(component => component.id === id && component.type === 'timer_relay');
      if (!timer) return;

      const config: Timer6062Config = {
        ...getTimer6062Config(timer),
        ...patch,
        adjustment: Math.min(60, Math.max(1, Number(patch.adjustment ?? getTimer6062Config(timer).adjustment)))
      };
      const duration = getTimer6062DurationMs(config);
      const components = current.components.map(component => component.id === id
        ? {
            ...component,
            state: {
              ...component.state,
              timer6062Config: config,
              relayActive: false,
              delayedActive: false,
              timerPhase: 'unpowered' as Timer6062Phase,
              timeLeftMs: duration,
              timeLeft: formatTimer6062Remaining(duration),
              boardPowered: false,
              triggerActive: false,
              voltageValid: false
            }
          }
        : component
      );

      clearTimer6062Runtime(id);
      saveToHistory(current.components, current.wires);
      soundManager.playClick();
      runSimulation(components, current.wires, false);
    },

    pressButton: (id, pressed) => {
      const comp = get().components.find(c => c.id === id);
      if (!comp) return;

      if (pressed && !comp.state.pressed) {
        soundManager.playButton();
      } else if (!pressed && comp.state.pressed) {
        soundManager.playClick();
      }

      const newComponents = get().components.map(c => 
        c.id === id ? { ...c, state: { ...c.state, pressed } } : c
      );
      
      runSimulation(newComponents, get().wires, get().isRunning);
    },

    toggleSwitch: (id) => {
      soundManager.playClick();
      const newComponents = get().components.map(c => 
        c.id === id ? { ...c, state: { ...c.state, toggled: !c.state.toggled } } : c
      );
      runSimulation(newComponents, get().wires, get().isRunning);
    },

    triggerCardReader: (id) => {
      soundManager.playCardScan(); // trigger scan chirp
      
      // Reader goes active for 3 seconds, then resets
      const newComponents = get().components.map(c => 
        c.id === id ? { ...c, state: { ...c.state, active: true } } : c
      );
      runSimulation(newComponents, get().wires, get().isRunning);

      setTimeout(() => {
        // Reset card reader
        const resetComps = get().components.map(c => 
          c.id === id ? { ...c, state: { ...c.state, active: false } } : c
        );
        runSimulation(resetComps, get().wires, get().isRunning);
      }, 3000);
    },

    addWire: (fromCId, fromTId, toCId, toTId, color, waypoints) => {
      // Prevent duplicates or connecting to the same terminal
      if (fromCId === toCId && fromTId === toTId) return;

      const duplicate = get().wires.find(w => 
        (w.fromComponentId === fromCId && w.fromTerminalId === fromTId && w.toComponentId === toCId && w.toTerminalId === toTId) ||
        (w.fromComponentId === toCId && w.fromTerminalId === toTId && w.toComponentId === fromCId && w.toTerminalId === fromTId)
      );
      if (duplicate) return;

      let finalColor = color;
      if (color === 'red') {
        const isNeg = (compId: string, termId: string) => {
          const comp = get().components.find(c => c.id === compId);
          if (!comp) return false;
          const term = comp.terminals.find(t => t.id === termId);
          if (!term) return false;
          const name = term.name.toLowerCase();
          const id = term.id.toLowerCase();
          const type = term.type.toLowerCase();
          return name === '-' || name === '-ve' || type === 'neg' || id === 'neg' || id === 'coil_b' || id === 'out';
        };

        if (isNeg(fromCId, fromTId) || isNeg(toCId, toTId)) {
          finalColor = 'black';
        }
      }

      saveToHistory(get().components, get().wires);
      soundManager.playWire();

      const newWire: Wire = {
        id: createCircuitEntityId('wire'),
        fromComponentId: fromCId,
        fromTerminalId: fromTId,
        toComponentId: toCId,
        toTerminalId: toTId,
        color: finalColor,
        waypoints
      };

      const newWires = [...get().wires, newWire];
      set({ wires: newWires });
      runSimulation(get().components, newWires, get().isRunning);
    },

    removeWire: (id) => {
      saveToHistory(get().components, get().wires);
      soundManager.playClick();
      const newWires = get().wires.filter(w => w.id !== id);
      set({ wires: newWires });
      runSimulation(get().components, newWires, get().isRunning);
    },

    updateWireWaypoints: (id, waypoints) => {
      const newWires = get().wires.map(w =>
        w.id === id ? { ...w, waypoints } : w
      );
      set({ wires: newWires });
      runSimulation(get().components, newWires, get().isRunning);
    },

    reconnectWire: (id, endpoint, componentId, terminalId) => {
      const state = get();
      const wire = state.wires.find(candidate => candidate.id === id);
      if (!wire) return;

      const fixedComponentId = endpoint === 'from' ? wire.toComponentId : wire.fromComponentId;
      const fixedTerminalId = endpoint === 'from' ? wire.toTerminalId : wire.fromTerminalId;
      if (fixedComponentId === componentId && fixedTerminalId === terminalId) return;

      const nextFromComponentId = endpoint === 'from' ? componentId : wire.fromComponentId;
      const nextFromTerminalId = endpoint === 'from' ? terminalId : wire.fromTerminalId;
      const nextToComponentId = endpoint === 'to' ? componentId : wire.toComponentId;
      const nextToTerminalId = endpoint === 'to' ? terminalId : wire.toTerminalId;
      const duplicate = state.wires.some(candidate =>
        candidate.id !== id && (
          (
            candidate.fromComponentId === nextFromComponentId &&
            candidate.fromTerminalId === nextFromTerminalId &&
            candidate.toComponentId === nextToComponentId &&
            candidate.toTerminalId === nextToTerminalId
          ) || (
            candidate.fromComponentId === nextToComponentId &&
            candidate.fromTerminalId === nextToTerminalId &&
            candidate.toComponentId === nextFromComponentId &&
            candidate.toTerminalId === nextFromTerminalId
          )
        )
      );
      if (duplicate) return;

      saveToHistory(state.components, state.wires);
      soundManager.playWire();
      const newWires = state.wires.map(candidate => candidate.id === id
        ? {
            ...candidate,
            fromComponentId: nextFromComponentId,
            fromTerminalId: nextFromTerminalId,
            toComponentId: nextToComponentId,
            toTerminalId: nextToTerminalId,
            waypoints: []
          }
        : candidate
      );
      set({ wires: newWires });
      runSimulation(state.components, newWires, state.isRunning);
    },

    spliceWire: (wireId, x, y, waypoints1 = [], waypoints2 = []) => {
      const wire = get().wires.find(w => w.id === wireId);
      if (!wire) return null;

      saveToHistory(get().components, get().wires);
      soundManager.playClick();

      const junctionId = createCircuitEntityId('junction');
      const junctionComponent: CircuitComponent = {
        id: junctionId,
        type: 'junction',
        x,
        y,
        label: '',
        terminals: [
          { id: 'port_0', name: 'Port 1', type: 'in', x: -16, y: 12 },
          { id: 'port_1', name: 'Port 2', type: 'in', x: -8, y: 12 },
          { id: 'port_2', name: 'Port 3', type: 'in', x: 0, y: 12 },
          { id: 'port_3', name: 'Port 4', type: 'in', x: 8, y: 12 },
          { id: 'port_4', name: 'Port 5', type: 'in', x: 16, y: 12 }
        ],
        state: { color: wire.color, scale: 1.67 }
      };

      const newComponents = [...get().components, junctionComponent];
      const filteredWires = get().wires.filter(w => w.id !== wireId);

      const splitWire1: Wire = {
        id: createCircuitEntityId('wire'),
        fromComponentId: wire.fromComponentId,
        fromTerminalId: wire.fromTerminalId,
        toComponentId: junctionId,
        toTerminalId: 'port_0',
        color: wire.color,
        waypoints: waypoints1
      };

      const splitWire2: Wire = {
        id: createCircuitEntityId('wire'),
        fromComponentId: junctionId,
        fromTerminalId: 'port_1',
        toComponentId: wire.toComponentId,
        toTerminalId: wire.toTerminalId,
        color: wire.color,
        waypoints: waypoints2
      };

      const updatedWires = [...filteredWires, splitWire1, splitWire2];

      set({
        components: newComponents,
        wires: updatedWires
      });

      runSimulation(newComponents, updatedWires, get().isRunning);
      return junctionId;
    },

    spliceAndConnectWire: (wireId, x, y, fromCId, fromTId, color, waypoints = [], waypoints1 = [], waypoints2 = []) => {
      const wire = get().wires.find(w => w.id === wireId);
      if (!wire) return;

      saveToHistory(get().components, get().wires);
      soundManager.playWire();

      const junctionId = createCircuitEntityId('junction');
      const junctionComponent: CircuitComponent = {
        id: junctionId,
        type: 'junction',
        x,
        y,
        label: '',
        terminals: [
          { id: 'port_0', name: 'Port 1', type: 'in', x: -16, y: 12 },
          { id: 'port_1', name: 'Port 2', type: 'in', x: -8, y: 12 },
          { id: 'port_2', name: 'Port 3', type: 'in', x: 0, y: 12 },
          { id: 'port_3', name: 'Port 4', type: 'in', x: 8, y: 12 },
          { id: 'port_4', name: 'Port 5', type: 'in', x: 16, y: 12 }
        ],
        state: { color: wire.color, scale: 1.67 }
      };

      const newComponents = [...get().components, junctionComponent];
      const filteredWires = get().wires.filter(w => w.id !== wireId);

      const splitWire1: Wire = {
        id: createCircuitEntityId('wire'),
        fromComponentId: wire.fromComponentId,
        fromTerminalId: wire.fromTerminalId,
        toComponentId: junctionId,
        toTerminalId: 'port_0',
        color: wire.color,
        waypoints: waypoints1
      };

      const splitWire2: Wire = {
        id: createCircuitEntityId('wire'),
        fromComponentId: junctionId,
        fromTerminalId: 'port_1',
        toComponentId: wire.toComponentId,
        toTerminalId: wire.toTerminalId,
        color: wire.color,
        waypoints: waypoints2
      };

      const connectionWire: Wire = {
        id: createCircuitEntityId('wire'),
        fromComponentId: fromCId,
        fromTerminalId: fromTId,
        toComponentId: junctionId,
        toTerminalId: 'port_2',
        color,
        waypoints
      };

      const updatedWires = [...filteredWires, splitWire1, splitWire2, connectionWire];

      set({
        components: newComponents,
        wires: updatedWires
      });

      runSimulation(newComponents, updatedWires, get().isRunning);
    },

    undo: () => {
      const { history, redoHistory, components, wires } = get();
      if (history.length === 0) return;

      const prev = history[history.length - 1];
      const newHistory = history.slice(0, -1);

      set({
        history: newHistory,
        redoHistory: [...redoHistory, { components: JSON.parse(JSON.stringify(components)), wires: [...wires] }],
        components: prev.components,
        wires: prev.wires
      });

      soundManager.playClick();
      runSimulation(prev.components, prev.wires, get().isRunning);
    },

    redo: () => {
      const { history, redoHistory, components, wires } = get();
      if (redoHistory.length === 0) return;

      const next = redoHistory[redoHistory.length - 1];
      const newRedoHistory = redoHistory.slice(0, -1);

      set({
        history: [...history, { components: JSON.parse(JSON.stringify(components)), wires: [...wires] }],
        redoHistory: newRedoHistory,
        components: next.components,
        wires: next.wires
      });

      soundManager.playClick();
      runSimulation(next.components, next.wires, get().isRunning);
    },

    setMultimeterMode: (mode) => {
      soundManager.playClick();
      set({
        multimeter: {
          ...get().multimeter,
          mode
        }
      });
      runSimulation(get().components, get().wires, get().isRunning);
    },

    setProbe: (color, probe) => {
      const isRed = color === 'red';
      const key = isRed ? 'redProbe' : 'blackProbe';
      
      if (probe) {
        soundManager.playClick(); // probe contact snap
      }

      set({
        multimeter: {
          ...get().multimeter,
          [key]: probe
        }
      });

      // Trigger achievement if user probes a live terminal
      if (probe && get().isRunning) {
        const solved = get().simulation;
        const termKey = `${probe.componentId}:${probe.terminalId}`;
        if (solved.nodeVoltages[termKey] > 0) {
          setTimeout(() => get().unlockAchievement('multimeter_pro'), 500);
        }
      }

      runSimulation(get().components, get().wires, get().isRunning);
    },

    setProbeMode: (mode) => set({ probeMode: mode }),


    toggleSimulation: () => {
      const nextRunning = !get().isRunning;
      soundManager.playButton();
      
      set({ isRunning: nextRunning });
      runSimulation(get().components, get().wires, nextRunning);
    },

    useHint: () => {
      const score = { ...get().score, hintsUsed: get().score.hintsUsed + 1 };
      set({ score, hintRevealedAt: Date.now() });
    },

    startTimer: () => {
      if (get().timerIntervalId) return;
      const interval = setInterval(() => {
        get().tickTimer();
      }, 1000);
      set({ timerIntervalId: interval });

      if (!motionIntervalId) {
        motionIntervalId = setInterval(() => {
          get().tickMotion();
        }, 80);
      }
    },

    stopTimer: () => {
      const { timerIntervalId } = get();
      if (timerIntervalId) {
        clearInterval(timerIntervalId);
        set({ timerIntervalId: null });
      }
    },

    tickTimer: () => {
      const nextTime = get().timeElapsed + 1;
      set({ timeElapsed: nextTime });
    },

    tickMotion: () => {
      const { components, isRunning, simulation } = get();
      if (!isRunning || simulation.shortCircuit) return;

      let hasChanges = false;
      const updatedComponents = components.map(c => {
        if (c.type === 'actuator' || c.type === 'elevator_motor' || c.type === 'parking_gate' || c.type === 'sliding_gate') {
          const vPos = simulation.nodeVoltages[`${c.id}:pos`] || 0;
          const vNeg = simulation.nodeVoltages[`${c.id}:neg`] || 0;
          const currentTravel = c.state.travel || 0;

          let direction = 0;
          if (vPos > vNeg) direction = 1;
          else if (vNeg > vPos) direction = -1;

          let newTravel = currentTravel;
          if (direction === 1) {
            newTravel = Math.min(100, currentTravel + 4);
          } else if (direction === -1) {
            newTravel = Math.max(0, currentTravel - 4);
          }

          if (newTravel !== currentTravel) {
            hasChanges = true;
            soundManager.startHum(c.id, 'motor');
            return {
              ...c,
              state: { ...c.state, travel: newTravel }
            };
          } else {
            soundManager.stopHum(c.id);
          }
        }
        return c;
      });

      if (hasChanges) {
        const elevator = updatedComponents.find(c => c.type === 'elevator_motor' || c.type === 'actuator' || c.type === 'parking_gate' || c.type === 'sliding_gate');
        const elevatorTravel = elevator?.state.travel ?? 0;

        const finalComponents = updatedComponents.map(c => {
          if (c.type === 'limit_switch') {
            const id = c.id;
            let pressed = false;
            if (id === 'limit_top') {
              pressed = elevatorTravel >= 100;
            } else if (id === 'limit_bottom') {
              pressed = elevatorTravel <= 0;
            }
            if (pressed !== c.state.pressed) {
              return { ...c, state: { ...c.state, pressed } };
            }
          }
          return c;
        });

        set({ components: finalComponents });
        runSimulation(finalComponents, get().wires, isRunning);
      }
    },

    checkAchievements: () => {
      const { currentLevelIndex, achievements } = get();
      
      const unlock = (id: string) => {
        const ach = achievements.find(a => a.id === id);
        if (ach && !ach.unlocked) {
          const updated = achievements.map(a => 
            a.id === id ? { ...a, unlocked: true, unlockedAt: new Date().toLocaleTimeString() } : a
          );
          set({ 
            achievements: updated,
            recentAchievement: { ...ach, unlocked: true }
          });
          soundManager.playSuccess();
        }
      };

      // Achievement triggers
      if (currentLevelIndex === 0) unlock('first_circuit');
      if (currentLevelIndex >= 5) unlock('relay_master');
      if (currentLevelIndex === 7) unlock('safety_first');
      if (currentLevelIndex === 8) unlock('door_unlocked');
      if (currentLevelIndex === 11) unlock('latch_expert');
    },

    dismissAchievement: () => {
      set({ recentAchievement: null });
    },

    unlockAchievement: (id: string) => {
      const { achievements } = get();
      const ach = achievements.find(a => a.id === id);
      if (ach && !ach.unlocked) {
        const updated = achievements.map(a => 
          a.id === id ? { ...a, unlocked: true, unlockedAt: new Date().toLocaleTimeString() } : a
        );
        set({ 
          achievements: updated,
          recentAchievement: { ...ach, unlocked: true }
        });
        soundManager.playSuccess();
      }
    }
  };
});
