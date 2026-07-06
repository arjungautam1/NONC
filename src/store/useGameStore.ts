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
import { soundManager } from '../audio/soundManager';
import confetti from 'canvas-confetti';

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
  
  // Actions
  initLevel: (index: number, skipViewTransition?: boolean) => void;
  resetLevel: () => void;
  nextLevel: () => void;
  
  addComponent: (component: CircuitComponent) => void;
  removeComponent: (id: string) => void;
  updateComponentPosition: (id: string, x: number, y: number) => void;
  setComponentState: (id: string, key: string, value: any) => void;
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
  bottomPanelOpen: boolean;
  toggleBottomPanel: () => void;
  viewMode: 'levels' | 'lab';
  setViewMode: (mode: 'levels' | 'lab') => void;
}

const initialAchievements: Achievement[] = [
  { id: 'first_circuit', title: 'First Circuit', description: 'Power up your first lightbulb!', icon: 'Zap', unlocked: false },
  { id: 'relay_master', title: 'Relay Master', description: 'Complete a control circuit using a relay.', icon: 'Cpu', unlocked: false },
  { id: 'safety_first', title: 'Safety First', description: 'Wire an Emergency Stop safety loop.', icon: 'ShieldAlert', unlocked: false },
  { id: 'door_unlocked', title: 'Access Granted', description: 'Wire a magnetic door lock card access system.', icon: 'KeySquare', unlocked: false },
  { id: 'latch_expert', title: 'Latching Expert', description: 'Implement self-latching feedback relay control.', icon: 'Repeat', unlocked: false },
  { id: 'multimeter_pro', title: 'Multimeter Pro', description: 'Probe a live circuit terminal to diagnose voltage.', icon: 'Gauge', unlocked: false }
];

const timerRelayIntervals = new Map<string, any>();
const timerRelayTimeouts = new Map<string, any>();
let motionIntervalId: any = null;

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

  const runSimulation = (currentComponents: CircuitComponent[], currentWires: Wire[], currentIsRunning: boolean) => {
    // Solve circuit
    const solverResult = solveCircuit(currentComponents, currentWires);

    // Synchronize sounds (continuous hums)
    if (currentIsRunning && !solverResult.shortCircuit) {
      currentComponents.forEach(c => {
        const isEnergized = solverResult.energizedComponents.has(c.id);
        if (isEnergized) {
          if (c.type === 'motor' || c.type === 'roland_fan') soundManager.startHum(c.id, 'motor');
          else if (c.type === 'buzzer') soundManager.startHum(c.id, 'buzzer');
          else if (c.type === 'bulb' || c.type === 'led' || c.type === 'lamp_indicator') {
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

    // Update relay mechanical energized status and timer relay countdowns in component state so visuals update
    const updatedComponents = currentComponents.map(c => {
      if (c.type === 'relay') {
        const isEnergized = solverResult.energizedComponents.has(c.id);
        if (isEnergized !== c.state.energized) {
          if (isEnergized) soundManager.playClick();
          return { ...c, state: { ...c.state, energized: isEnergized } };
        }
      }
      if (c.type === 'timer_relay') {
        const isEnergized = solverResult.energizedComponents.has(c.id);
        if (isEnergized && currentIsRunning) {
          if (!timerRelayTimeouts.has(c.id)) {
            // Start the delay timer
            c.state.timeLeft = '2.0s';
            const startTime = Date.now();

            const timeoutId = setTimeout(() => {
              const comps = get().components.map(comp => 
                comp.id === c.id ? { ...comp, state: { ...comp.state, delayedActive: true, timeLeft: '0.0s' } } : comp
              );
              set({ components: comps });
              soundManager.playClick();
              runSimulation(comps, get().wires, get().isRunning);
            }, 2000);

            const intervalId = setInterval(() => {
              const elapsed = Date.now() - startTime;
              const remaining = Math.max(0, (2000 - elapsed) / 1000).toFixed(1);
              
              if (timerRelayTimeouts.has(c.id)) {
                set(state => ({
                  components: state.components.map(comp => 
                    comp.id === c.id ? { ...comp, state: { ...comp.state, timeLeft: `${remaining}s` } } : comp
                  )
                }));
              }
            }, 100);

            timerRelayTimeouts.set(c.id, timeoutId);
            timerRelayIntervals.set(c.id, intervalId);
          }
        } else {
          // De-energized or simulation stopped: reset timer instantly
          if (timerRelayTimeouts.has(c.id)) {
            clearTimeout(timerRelayTimeouts.get(c.id));
            clearInterval(timerRelayIntervals.get(c.id));
            timerRelayTimeouts.delete(c.id);
            timerRelayIntervals.delete(c.id);
            
            return { ...c, state: { ...c.state, delayedActive: false, timeLeft: '2.0s' } };
          }
        }
      }
      if (c.type === 'maglock') {
        const isEnergized = solverResult.energizedComponents.has(c.id);
        return { ...c, state: { ...c.state, active: isEnergized } };
      }
      return c;
    });

    // Update multimeter reading if active
    let multimeterReading = '---';
    if (get().multimeter.mode !== 'OFF') {
      multimeterReading = queryMultimeter(
        get().multimeter.mode,
        get().multimeter.redProbe,
        get().multimeter.blackProbe,
        updatedComponents,
        currentWires,
        solverResult
      );
    }

    // Trigger success criteria check if simulation is running
    let completed = false;
    let feedback = '';

    if (currentIsRunning && !solverResult.shortCircuit) {
      const level = levels[get().currentLevelIndex];
      const isEnergizedFn = (cid: string) => solverResult.energizedComponents.has(cid);
      const testResult = level.successCriteria(
        updatedComponents,
        currentWires,
        solverResult.nodeVoltages,
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
    } else if (solverResult.shortCircuit) {
      feedback = '🚨 Short Circuit Detected! Current is flowing directly from Positive to Negative without passing through a load. Check your wiring loops.';
    }

    set({
      components: updatedComponents,
      simulation: solverResult,
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
    bottomPanelOpen: true,
    toggleBottomPanel: () => set(state => ({ bottomPanelOpen: !state.bottomPanelOpen })),
    hintRevealedAt: 0,
    viewMode: 'levels',
    setViewMode: (mode) => set({ viewMode: mode }),

    initLevel: (index, skipViewTransition = false) => {
      const level = levels[index];
      if (!level) return;

      // Stop previous timer and hums
      get().stopTimer();
      soundManager.stopAllHums();

      // Deep copy level components
      const newComps = JSON.parse(JSON.stringify(level.preplacedComponents));
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
        ...(skipViewTransition ? {} : { viewMode: 'lab' })
      });

      // Solve initial states
      runSimulation(newComps, newWires, false);
      get().startTimer();
    },

    resetLevel: () => {
      const { initLevel, currentLevelIndex } = get();
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

      saveToHistory(get().components, get().wires);
      soundManager.playWire();

      const newWire: Wire = {
        id: `wire_${Date.now()}`,
        fromComponentId: fromCId,
        fromTerminalId: fromTId,
        toComponentId: toCId,
        toTerminalId: toTId,
        color,
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
        if (c.type === 'actuator' || c.type === 'elevator_motor' || c.type === 'parking_gate') {
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
        const elevator = updatedComponents.find(c => c.type === 'elevator_motor' || c.type === 'actuator' || c.type === 'parking_gate');
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
