import type { CircuitComponent, ComponentType, Terminal } from '../types/game';
import { DEFAULT_6062_CONFIG } from '../simulation/timer6062';
import { pullStationTerminals } from '../components/game/components/pullStationPinout';
import { rb1224Terminals } from '../components/game/components/rb1224Pinout';
import { rbsnttlTerminals } from '../components/game/components/rbsnttlPinout';

export type CustomLabCategory = 'input' | 'control' | 'output';

type ComponentTemplate = {
  type: ComponentType;
  label: string;
  terminals: Terminal[];
  state: CircuitComponent['state'];
};

export interface CustomLabOption {
  id: string;
  category: CustomLabCategory;
  name: string;
  description: string;
  terminalSummary: string;
  template: ComponentTemplate;
}

export const MAX_CUSTOM_COMPONENTS = 8;

export const customLabCategories: Array<{
  id: CustomLabCategory;
  label: string;
  description: string;
}> = [
  {
    id: 'input',
    label: 'Input devices',
    description: 'Buttons, readers, and field switches that create a control signal.'
  },
  {
    id: 'control',
    label: 'Control devices',
    description: 'Relays, timers, and protection components that process or route signals.'
  },
  {
    id: 'output',
    label: 'Output devices',
    description: 'Lights, sounders, motors, and locks that perform the work.'
  }
];

export const customLabOptions: CustomLabOption[] = [
  {
    id: 'emergency_pull_station',
    category: 'input',
    name: 'Camden CM-700 pull station',
    description: 'Latching door-release pull station, 12-24VDC. Two isolated circuits: 1-2 opens when pulled, 3-4 closes. Reset through the plate hole.',
    terminalSummary: '1-2 N/C · 3-4 N/O (isolated)',
    template: {
      type: 'pull_station',
      label: 'Camden CM-702',
      terminals: pullStationTerminals(),
      state: { toggled: false }
    }
  },
  {
    id: 'momentary_spdt',
    category: 'input',
    name: 'Momentary switch',
    description: 'Spring-return SPDT input with COM, NC, and NO contacts.',
    terminalSummary: 'COM · NC · NO',
    template: {
      type: 'button_no',
      label: 'Momentary Switch',
      terminals: [
        { id: 'com', name: 'C', type: 'com', x: -30, y: 15 },
        { id: 'nc', name: 'NC', type: 'nc', x: 0, y: -25 },
        { id: 'no', name: 'NO', type: 'no', x: 30, y: 15 }
      ],
      state: {}
    }
  },
  {
    id: 'estop_nc',
    category: 'input',
    name: 'Normally-closed E-Stop',
    description: 'Opens a normally-closed safety path while the button is held.',
    terminalSummary: 'IN · OUT (NC)',
    template: {
      type: 'button_nc',
      label: 'E-STOP (NC)',
      terminals: [
        { id: 'in', name: 'IN', type: 'in', x: -30, y: 0 },
        { id: 'out', name: 'OUT', type: 'out', x: 30, y: 0 }
      ],
      state: {}
    }
  },
  {
    id: 'maintained_spdt',
    category: 'input',
    name: 'Maintained SPDT switch',
    description: 'Stays in the selected position and transfers COM between NC and NO.',
    terminalSummary: 'COM · NC · NO',
    template: {
      type: 'rocker_switch_2pos',
      label: 'Maintained Switch',
      terminals: [
        { id: 'com', name: 'C', type: 'in', x: -30, y: 0 },
        { id: 'nc', name: 'NC', type: 'out_a', x: 30, y: -20 },
        { id: 'no', name: 'NO', type: 'out_b', x: 30, y: 20 }
      ],
      state: {}
    }
  },
  {
    id: 'selector_ab',
    category: 'input',
    name: 'A/B selector switch',
    description: 'Routes one input to either output A or output B.',
    terminalSummary: 'IN · A · B',
    template: {
      type: 'switch_selector',
      label: 'A/B Selector',
      terminals: [
        { id: 'in', name: 'IN', type: 'in', x: -30, y: 0 },
        { id: 'out_a', name: 'A', type: 'out_a', x: 30, y: -20 },
        { id: 'out_b', name: 'B', type: 'out_b', x: 30, y: 20 }
      ],
      state: {}
    }
  },
  {
    id: 'card_reader',
    category: 'input',
    name: 'Access-card reader',
    description: 'Powered access input that produces a trigger when a card is scanned.',
    terminalSummary: '12V · GND · TRIG',
    template: {
      type: 'card_reader',
      label: 'Card Reader',
      terminals: [
        { id: 'pos', name: '12V', type: 'pos', x: -18, y: 35 },
        { id: 'neg', name: 'GND', type: 'neg', x: 18, y: 35 },
        { id: 'out', name: 'TRIG', type: 'out', x: 0, y: -35 }
      ],
      state: {}
    }
  },
  {
    id: 'wave_sensor',
    category: 'input',
    name: 'Camden CM-333 wave sensor',
    description: 'Battery-powered touchless switch (2 AA batteries) with a Form C (SPDT) relay output. Requires no external power wiring.',
    terminalSummary: 'C · NC · NO',
    template: {
      type: 'wave_sensor',
      label: 'Camden CM-333',
      terminals: [
        { id: 'com', name: 'C', type: 'com', x: -20, y: -72 },
        { id: 'nc', name: 'NC', type: 'nc', x: 0, y: -72 },
        { id: 'no', name: 'NO', type: 'no', x: 20, y: -72 }
      ],
      state: { active: false }
    }
  },
  {
    id: 'door_sensor',
    category: 'input',
    name: 'Door-position sensor',
    description: 'A normally-closed field contact that opens when toggled.',
    terminalSummary: 'IN · OUT (NC)',
    template: {
      type: 'door_sensor',
      label: 'Door Sensor',
      terminals: [
        { id: 'in', name: 'IN', type: 'in', x: -30, y: 0 },
        { id: 'out', name: 'OUT', type: 'out', x: 30, y: 0 }
      ],
      state: {}
    }
  },
  {
    id: 'limit_switch',
    category: 'input',
    name: 'Mechanical limit switch',
    description: 'Normally-closed travel switch for end-of-motion control.',
    terminalSummary: 'IN · OUT (NC)',
    template: {
      type: 'limit_switch',
      label: 'Limit Switch',
      terminals: [
        { id: 'in', name: 'IN', type: 'in', x: -30, y: 0 },
        { id: 'out', name: 'OUT', type: 'out', x: 30, y: 0 }
      ],
      state: {}
    }
  },
  {
    id: 'relay_spdt',
    category: 'control',
    name: 'SPDT control relay',
    description: 'One changeover contact controlled by a low-voltage coil.',
    terminalSummary: 'A1 · A2 · COM · NC · NO',
    template: {
      type: 'relay',
      label: 'SPDT Relay',
      terminals: [
        { id: 'coil_a', name: 'A1', type: 'coil_a', x: -35, y: -30 },
        { id: 'coil_b', name: 'A2', type: 'coil_b', x: -35, y: 30 },
        { id: 'com', name: 'COM', type: 'com', x: 35, y: -30 },
        { id: 'nc', name: 'NC', type: 'nc', x: 35, y: 0 },
        { id: 'no', name: 'NO', type: 'no', x: 35, y: 30 }
      ],
      state: {}
    }
  },
  {
    id: 'relay_dpdt',
    category: 'control',
    name: 'Altronix RDC12 DPDT relay',
    description: '12VDC plug-in relay and base. Two changeover poles rated 10A/220VAC or 28VDC; coil energises across pins 7 and 8.',
    terminalSummary: '7/8 coil · 5-1-3 pole 1 · 6-2-4 pole 2',
    template: {
      type: 'relay_dpdt',
      label: 'Altronix RDC12',
      // Pin numbers follow the RDC12 datasheet base drawing.
      terminals: [
        { id: 'no1', name: 'NO1 (3)', type: 'no1', x: -40, y: -48 },
        { id: 'nc1', name: 'NC1 (1)', type: 'nc1', x: -21, y: -48 },
        { id: 'coil_a', name: 'Coil (7)', type: 'coil_a', x: 21, y: -48 },
        { id: 'com1', name: 'C1 (5)', type: 'com1', x: 40, y: -48 },
        { id: 'no2', name: 'NO2 (4)', type: 'no2', x: -40, y: 48 },
        { id: 'nc2', name: 'NC2 (2)', type: 'nc2', x: -21, y: 48 },
        { id: 'coil_b', name: 'Coil (8)', type: 'coil_b', x: 21, y: 48 },
        { id: 'com2', name: 'C2 (6)', type: 'com2', x: 40, y: 48 }
      ],
      state: { coilVoltage: 12 }
    }
  },
  {
    id: 'relay_rbsnttl',
    category: 'control',
    name: 'Altronix RBSNTTL trigger relay',
    description: 'Ultra sensitive relay module. 12-24VDC board power on POS+/NEG-, plus a separate opto-isolated 3-24VDC trigger on TRG+/TRG-. Needs both to pull in. DPDT 2A/120VAC/28VDC.',
    terminalSummary: 'POS+/NEG- power · TRG+/TRG- trigger · 2x NO/NC/C',
    template: {
      type: 'relay_rbsnttl',
      label: 'Altronix RBSNTTL',
      terminals: rbsnttlTerminals(),
      state: {}
    }
  },
  {
    id: 'relay_rb1224',
    category: 'control',
    name: 'Altronix RB1224 relay module',
    description: 'Blue PCB relay sub-assembly. 5A/220VAC or 28VDC DPDT contacts, 75mA draw. SW1 selects the coil rail: OFF = 24VDC, ON = 12VDC.',
    terminalSummary: 'POS+ / NEG- coil · 2× NO/NC/C',
    template: {
      type: 'relay_rb1224',
      label: 'Altronix RB1224',
      terminals: rb1224Terminals(),
      state: { dip12v: false }
    }
  },
  {
    id: 'timer_relay',
    category: 'control',
    name: 'Altronix 6062 timer',
    description: 'Configurable 12/24V multi-purpose timer with 1-60 second/minute range, trigger modes, pulse, and repeat.',
    terminalSummary: 'TRG · − · + · NO · C · NC',
    template: {
      type: 'timer_relay',
      label: 'Altronix 6062 Timer',
      terminals: [
        { id: 'coil_a', name: 'TRIG', type: 'coil_a', x: -40, y: 40 },
        { id: 'coil_b', name: '-', type: 'coil_b', x: -24, y: 40 },
        { id: 'pos_dummy', name: '+', type: 'pos', x: -8, y: 40 },
        { id: 'no', name: 'NO', type: 'no', x: 8, y: 40 },
        { id: 'com', name: 'C', type: 'com', x: 24, y: 40 },
        { id: 'nc', name: 'NC', type: 'nc', x: 40, y: 40 }
      ],
      state: { timer6062Config: { ...DEFAULT_6062_CONFIG } }
    }
  },
  {
    id: 'fuse',
    category: 'control',
    name: 'Inline fuse',
    description: 'Protects a branch and opens when the simulator detects a short circuit.',
    terminalSummary: 'IN · OUT',
    template: {
      type: 'fuse',
      label: 'Circuit Fuse',
      terminals: [
        { id: 'in', name: 'IN', type: 'in', x: -30, y: 0 },
        { id: 'out', name: 'OUT', type: 'out', x: 30, y: 0 }
      ],
      state: {}
    }
  },
  {
    id: 'bulb',
    category: 'output',
    name: 'Lightbulb',
    description: 'General lighting load for basic circuit experiments.',
    terminalSummary: '+ IN · − OUT',
    template: {
      type: 'bulb',
      label: 'Lightbulb',
      terminals: [
        { id: 'in', name: 'IN', type: 'in', x: -30, y: 25 },
        { id: 'out', name: 'OUT', type: 'out', x: 30, y: 25 }
      ],
      state: {}
    }
  },
  {
    id: 'pilot_red',
    category: 'output',
    name: 'Red pilot light',
    description: 'Red 24 V status indicator for alarm or secure conditions.',
    terminalSummary: '+ · −',
    template: {
      type: 'lamp_indicator',
      label: 'RED STATUS',
      terminals: [
        { id: 'in', name: '+', type: 'in', x: -30, y: 15 },
        { id: 'out', name: '-', type: 'out', x: 30, y: 15 }
      ],
      state: { color: 'red' }
    }
  },
  {
    id: 'pilot_green',
    category: 'output',
    name: 'Green pilot light',
    description: 'Green 24 V status indicator for active or released conditions.',
    terminalSummary: '+ · −',
    template: {
      type: 'lamp_indicator',
      label: 'GREEN STATUS',
      terminals: [
        { id: 'in', name: '+', type: 'in', x: -30, y: 15 },
        { id: 'out', name: '-', type: 'out', x: 30, y: 15 }
      ],
      state: { color: 'green' }
    }
  },
  {
    id: 'buzzer',
    category: 'output',
    name: 'Alarm sounder',
    description: 'Audible output that sounds while its circuit is powered.',
    terminalSummary: '+ IN · − OUT',
    template: {
      type: 'buzzer',
      label: 'Alarm Sounder',
      terminals: [
        { id: 'in', name: '+', type: 'in', x: -50, y: 15 },
        { id: 'out', name: '-', type: 'out', x: 50, y: 15 }
      ],
      state: {}
    }
  },
  {
    id: 'motor',
    category: 'output',
    name: 'DC motor',
    description: 'Rotating 24 V load for motor-control experiments.',
    terminalSummary: 'IN · OUT',
    template: {
      type: 'motor',
      label: 'DC Motor',
      terminals: [
        { id: 'in', name: 'IN', type: 'in', x: -20, y: 35 },
        { id: 'out', name: 'OUT', type: 'out', x: 20, y: 35 }
      ],
      state: {}
    }
  },
  {
    id: 'maglock_fail_safe',
    category: 'output',
    name: 'Fail-safe maglock',
    description: 'Locks while powered and releases when its power is removed.',
    terminalSummary: '+ · −',
    template: {
      type: 'maglock',
      label: 'Fail-Safe Maglock',
      terminals: [
        { id: 'in', name: '+', type: 'in', x: -70, y: 10 },
        { id: 'out', name: '-', type: 'out', x: 70, y: 10 }
      ],
      state: { failSecure: false }
    }
  },
  {
    id: 'door_strike_fail_secure',
    category: 'output',
    name: 'Fail-secure door strike',
    description: 'Requires power to unlock. Remains locked during power failure.',
    terminalSummary: '+ · −',
    template: {
      type: 'door_strike',
      label: 'Fail-Secure Strike',
      terminals: [
        { id: 'in', name: '+', type: 'in', x: -50, y: 0 },
        { id: 'out', name: '-', type: 'out', x: 50, y: 0 }
      ],
      state: { failSecure: true }
    }
  },
  {
    id: 'door_strike_fail_safe',
    category: 'output',
    name: 'Fail-safe door strike',
    description: 'Requires power to lock. Unlocks during power failure.',
    terminalSummary: '+ · −',
    template: {
      type: 'door_strike',
      label: 'Fail-Safe Strike',
      terminals: [
        { id: 'in', name: '+', type: 'in', x: -50, y: 0 },
        { id: 'out', name: '-', type: 'out', x: 50, y: 0 }
      ],
      state: { failSecure: false }
    }
  },
  {
    id: 'led_strip',
    category: 'output',
    name: 'Green LED',
    description: 'Bright green strip for extended visual status indication.',
    terminalSummary: '+ IN · − OUT',
    template: {
      type: 'led_strip',
      label: 'Green LED',
      terminals: [
        { id: 'in', name: '+', type: 'in', x: -50, y: 0 },
        { id: 'out', name: '-', type: 'out', x: 50, y: 0 }
      ],
      state: { color: 'green' }
    }
  },
  {
    id: 'led_strip_red',
    category: 'output',
    name: 'Red LED',
    description: 'Bright red strip for extended visual status indication.',
    terminalSummary: '+ IN · − OUT',
    template: {
      type: 'led_strip',
      label: 'Red LED',
      terminals: [
        { id: 'in', name: '+', type: 'in', x: -50, y: 0 },
        { id: 'out', name: '-', type: 'out', x: 50, y: 0 }
      ],
      state: { color: 'red' }
    }
  },
  {
    id: 'led_strip_yellow',
    category: 'output',
    name: 'Yellow LED',
    description: 'Bright yellow strip for extended visual status indication.',
    terminalSummary: '+ IN · − OUT',
    template: {
      type: 'led_strip',
      label: 'Yellow LED',
      terminals: [
        { id: 'in', name: '+', type: 'in', x: -50, y: 0 },
        { id: 'out', name: '-', type: 'out', x: 50, y: 0 }
      ],
      state: { color: 'yellow' }
    }
  },
  {
    id: 'led_strip_white',
    category: 'output',
    name: 'White LED',
    description: 'Bright white strip for extended visual status indication.',
    terminalSummary: '+ IN · − OUT',
    template: {
      type: 'led_strip',
      label: 'White LED',
      terminals: [
        { id: 'in', name: '+', type: 'in', x: -50, y: 0 },
        { id: 'out', name: '-', type: 'out', x: 50, y: 0 }
      ],
      state: { color: 'white' }
    }
  },
  {
    id: 'sliding_gate',
    category: 'output',
    name: 'Sliding gate operator',
    description: 'Reversible 24 V gate motor with animated horizontal travel.',
    terminalSummary: 'M+ · M−',
    template: {
      type: 'sliding_gate',
      label: 'Sliding Gate',
      terminals: [
        { id: 'pos', name: 'M+', type: 'pos', x: -112, y: -12 },
        { id: 'neg', name: 'M−', type: 'neg', x: -112, y: 16 }
      ],
      state: { travel: 0 }
    }
  }
];

export const getCustomLabOption = (id: string) => customLabOptions.find(option => option.id === id);

const createPowerStack = (): CircuitComponent[] => [
  {
    id: 'custom_transformer',
    type: 'transformer',
    x: 135,
    y: 155,
    label: '24V Transformer',
    terminals: [
      { id: 'pos', name: '(+)', type: 'pos', x: -20, y: 35 },
      { id: 'neg', name: '(-)', type: 'neg', x: 20, y: 35 }
    ],
    state: { lockedPosition: true }
  },
  {
    id: 'custom_psu',
    type: 'power_supply',
    x: 135,
    y: 405,
    label: '24V Power Supply',
    terminals: [
      { id: 'ac1', name: 'AC', type: 'in', x: -45, y: 35 },
      { id: 'ac2', name: 'AC', type: 'in', x: -15, y: 35 },
      { id: 'pos', name: '(+)', type: 'pos', x: 15, y: 35 },
      { id: 'neg', name: '(-)', type: 'neg', x: 45, y: 35 }
    ],
    state: { requireAcInput: true, lockedPosition: true }
  }
];

const placementSlots = [
  { x: 365, y: 145 },
  { x: 585, y: 145 },
  { x: 805, y: 145 },
  { x: 365, y: 315 },
  { x: 585, y: 315 },
  { x: 805, y: 315 },
  { x: 365, y: 485 },
  { x: 585, y: 485 },
  { x: 805, y: 485 }
];

export const createCustomLabComponent = (
  optionId: string,
  existingComponents: CircuitComponent[] = []
): CircuitComponent | null => {
  const option = getCustomLabOption(optionId);
  if (!option) return null;

  const availableSlot = placementSlots.find(slot =>
    existingComponents.every(component =>
      Math.abs(component.x - slot.x) > 90 || Math.abs(component.y - slot.y) > 75
    )
  );
  const fallbackIndex = Math.max(0, existingComponents.filter(component => component.id.startsWith('custom_')).length - 2);
  const slot = availableSlot ?? placementSlots[fallbackIndex % placementSlots.length];

  return {
    id: `custom_${option.id}`,
    type: option.template.type,
    x: slot.x,
    y: slot.y,
    label: option.template.label,
    terminals: option.template.terminals.map(terminal => ({ ...terminal })),
    state: { ...option.template.state }
  };
};

export const buildCustomLabComponents = (selectedIds: string[]): CircuitComponent[] => {
  const components = createPowerStack();

  selectedIds.forEach(optionId => {
    const component = createCustomLabComponent(optionId, components);
    if (component) components.push(component);
  });

  return components;
};
