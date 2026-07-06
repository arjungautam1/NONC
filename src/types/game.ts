export type ComponentType =
  | 'battery'
  | 'power_supply'
  | 'bulb'
  | 'led'
  | 'button_no'
  | 'button_nc'
  | 'switch_selector'
  | 'relay'
  | 'fuse'
  | 'terminal_block'
  | 'motor'
  | 'buzzer'
  | 'door_sensor'
  | 'maglock'
  | 'card_reader'
  | 'lamp_indicator'
  | 'timer_relay'
  | 'actuator'
  | 'elevator_motor'
  | 'limit_switch'
  | 'ac_source'
  | 'transformer'
  | 'roland_fan';

export type TerminalType =
  | 'pos'
  | 'neg'
  | 'gnd'
  | 'in'
  | 'out'
  | 'com'
  | 'no'
  | 'nc'
  | 'coil_a'
  | 'coil_b'
  | 'out_a'
  | 'out_b';

export interface Terminal {
  id: string;
  name: string;
  type: TerminalType;
  x: number; // offset X relative to component center
  y: number; // offset Y relative to component center
}

export interface CircuitComponent {
  id: string;
  type: ComponentType;
  x: number;
  y: number;
  label: string;
  terminals: Terminal[];
  state: {
    pressed?: boolean;
    toggled?: boolean;
    energized?: boolean;
    blown?: boolean;
    active?: boolean;
    [key: string]: any;
  };
}

export interface Wire {
  id: string;
  fromComponentId: string;
  fromTerminalId: string;
  toComponentId: string;
  toTerminalId: string;
  color: 'red' | 'black' | 'green' | 'orange';
  waypoints?: { x: number; y: number }[];
}

export type MultimeterMode = 'OFF' | 'VOLTAGE' | 'CONTINUITY' | 'RESISTANCE';

export interface ProbeConnection {
  componentId: string;
  terminalId: string;
}

export interface MultimeterState {
  mode: MultimeterMode;
  redProbe: ProbeConnection | null;
  blackProbe: ProbeConnection | null;
  reading: string;
}

export interface Level {
  id: number;
  title: string;
  description: string;
  instructions: string[];
  goals: string[];
  inventory: ComponentType[];
  preplacedComponents: CircuitComponent[];
  preplacedWires: Wire[];
  hints: string[];
  successCriteria: (
    components: CircuitComponent[],
    wires: Wire[],
    nodeVoltages: Record<string, number>,
    isEnergized: (cid: string) => boolean
  ) => { success: boolean; feedback?: string };
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: string;
}

export interface GameScore {
  stars: number;
  score: number;
  timeElapsed: number;
  hintsUsed: number;
  errorsMade: number;
}
