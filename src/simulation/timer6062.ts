import type { CircuitComponent } from '../types/game';

export interface Timer6062Config {
  /** DIP 1 ON: relay energizes at the end of the timing cycle. */
  dip1RelayAtEnd: boolean;
  /** DIP 2 ON: trimpot range is 1-60 seconds; OFF is 1-60 minutes. */
  dip2Seconds: boolean;
  /** DIP 3 ON: 12VDC operation; OFF: 24VDC operation. */
  dip3TwelveVolt: boolean;
  /** DIP 4 ON: timing starts when trigger is removed. */
  dip4TriggerRemoval: boolean;
  /** Cutting J1 selects the pulser/flasher repeat mode. */
  j1Cut: boolean;
  /** Cutting J2 selects a one-second relay pulse at the end of the cycle. */
  j2Cut: boolean;
  /** Cutting J3 enables reset-on-power-up and requires a new TRG input. */
  j3Cut: boolean;
  /** Physical trimpot setting, from 1 to 60 on the selected range. */
  adjustment: number;
}

export type Timer6062Phase =
  | 'unpowered'
  | 'voltage-mismatch'
  | 'ready'
  | 'armed'
  | 'timing'
  | 'output'
  | 'pulse'
  | 'repeat'
  | 'configuration-conflict';

export const DEFAULT_6062_CONFIG: Timer6062Config = {
  // This training-friendly default reproduces the previous delayed-operate
  // lesson while using the real 6062 controls: 2 seconds, 24V, TRG application.
  dip1RelayAtEnd: true,
  dip2Seconds: true,
  dip3TwelveVolt: false,
  dip4TriggerRemoval: false,
  j1Cut: false,
  j2Cut: false,
  j3Cut: true,
  adjustment: 2
};

const clampAdjustment = (value: number) => Math.min(60, Math.max(1, value));

export function getTimer6062Config(component: CircuitComponent): Timer6062Config {
  const stored = component.state.timer6062Config as Partial<Timer6062Config> | undefined;
  return {
    ...DEFAULT_6062_CONFIG,
    ...stored,
    adjustment: clampAdjustment(Number(stored?.adjustment ?? DEFAULT_6062_CONFIG.adjustment))
  };
}

export function getTimer6062DurationMs(config: Timer6062Config): number {
  return clampAdjustment(config.adjustment) * (config.dip2Seconds ? 1_000 : 60_000);
}

export function formatTimer6062Remaining(milliseconds: number): string {
  const safeMilliseconds = Math.max(0, milliseconds);
  if (safeMilliseconds >= 60_000) {
    const totalSeconds = Math.ceil(safeMilliseconds / 1_000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }

  return `${(safeMilliseconds / 1_000).toFixed(1)}s`;
}

export function formatTimer6062Setting(config: Timer6062Config): string {
  const unit = config.dip2Seconds ? (config.adjustment === 1 ? 'second' : 'seconds') : (config.adjustment === 1 ? 'minute' : 'minutes');
  return `${config.adjustment} ${unit}`;
}

export function isTimer6062RelayActive(component: CircuitComponent): boolean {
  return Boolean(component.state.relayActive ?? component.state.delayedActive);
}

export function getTimer6062TerminalIds(component: CircuitComponent) {
  const findByName = (names: string[]) => component.terminals.find(terminal =>
    names.includes(terminal.name.trim().toUpperCase())
  )?.id;

  return {
    trigger: findByName(['TRG', 'TRIG']) ?? (component.terminals.some(t => t.id === 'trg') ? 'trg' : 'coil_a'),
    negative: findByName(['-', '−', 'NEG']) ?? (component.terminals.some(t => t.id === 'neg') ? 'neg' : 'coil_b'),
    positive: findByName(['+', 'POS']) ?? (component.terminals.some(t => t.id === 'pos') ? 'pos' : 'pos_dummy'),
    normallyOpen: findByName(['NO', 'N.O.']) ?? 'no',
    common: findByName(['C', 'COM']) ?? 'com',
    normallyClosed: findByName(['NC', 'N.C.']) ?? 'nc'
  };
}

export function timer6062HasResetConflict(config: Timer6062Config): boolean {
  return config.j3Cut && (config.dip4TriggerRemoval || config.j2Cut);
}

export function getTimer6062ModeLabel(config: Timer6062Config): string {
  if (config.j1Cut) return 'Pulser / flasher';
  if (timer6062HasResetConflict(config)) return 'Configuration conflict';
  if (config.j2Cut) return 'Delayed one-second pulse';
  if (config.dip4TriggerRemoval) {
    return config.dip1RelayAtEnd ? 'Delayed operate after release' : 'Timed release after trigger removal';
  }
  return config.dip1RelayAtEnd ? 'Delayed operate' : 'One shot / timed release';
}

export function getTimer6062PhaseLabel(phase: Timer6062Phase | undefined): string {
  switch (phase) {
    case 'voltage-mismatch': return 'VOLTAGE';
    case 'armed': return 'ARMED';
    case 'timing': return 'TIMING';
    case 'output': return 'OUTPUT';
    case 'pulse': return 'PULSE';
    case 'repeat': return 'REPEAT';
    case 'configuration-conflict': return 'CHECK CFG';
    case 'ready': return 'READY';
    default: return 'NO POWER';
  }
}
