import type { Level } from '../types/game';

/**
 * Reference-based maintained key-switch and DPDT actuator reversing circuit.
 */
export const keySwitchActuatorLab: Level = {
  id: 24,
  title: 'Maintained Key-Switch Actuator',
  description: 'Use a maintained key switch and DPDT relay to reverse a linear actuator through a full cycle.',
  instructions: [
    'The maintained key controls the DPDT relay coil; the two relay poles reverse polarity at the actuator.',
    'Board input: Transformer (+) → Altronix AC1; Transformer (-) → Altronix AC2.',
    'Coil control: Altronix (+) → Key C → Key NO → DPDT A1; DPDT A2 → Altronix (-). Leave Key NC unused.',
    'Actuator leads: DPDT C1 → Actuator (+); DPDT C2 → Actuator (-).',
    'Cross-reversing supply: Altronix (+) → DPDT NO1 and NC2; Altronix (-) → DPDT NC1 and NO2.',
    'Test: turn the key ON and extend to 100%, then turn it OFF and retract to 0%.'
  ],
  goals: [
    'Energize the Altronix board',
    'Control the DPDT coil from the maintained key switch',
    'Cross-connect both DPDT poles for polarity reversal',
    'Extend fully with the key ON',
    'Retract fully with the key OFF'
  ],
  inventory: [],
  preplacedComponents: [
    {
      id: 'act_transformer',
      type: 'transformer',
      x: 325,
      y: -45,
      label: '24V Transformer',
      terminals: [
        { id: 'pos', name: '(+)', type: 'pos', x: -20, y: 35 },
        { id: 'neg', name: '(-)', type: 'neg', x: 20, y: 35 }
      ],
      state: {}
    },
    {
      id: 'act_psu',
      type: 'power_supply',
      x: 500,
      y: -45,
      label: 'Actuator Power Board',
      terminals: [
        { id: 'ac1', name: 'AC', type: 'in', x: -45, y: 35 },
        { id: 'ac2', name: 'AC', type: 'in', x: -15, y: 35 },
        { id: 'pos', name: '(+)', type: 'pos', x: 15, y: 35 },
        { id: 'neg', name: '(-)', type: 'neg', x: 45, y: 35 }
      ],
      state: { requireAcInput: true }
    },
    {
      id: 'act_key',
      type: 'key_switch',
      x: 330,
      y: 240,
      label: 'Actuator Key',
      terminals: [
        { id: 'com', name: 'C', type: 'com', x: -52, y: 0 },
        { id: 'nc', name: 'NC', type: 'nc', x: 52, y: -25 },
        { id: 'no', name: 'NO', type: 'no', x: 52, y: 25 }
      ],
      state: { toggled: false }
    },
    {
      id: 'act_relay',
      type: 'relay_dpdt',
      x: 540,
      y: 240,
      label: 'RB1224 DPDT',
      terminals: [
        { id: 'coil_b', name: 'A2', type: 'coil_b', x: 35, y: -55 },
        { id: 'com1', name: 'C1', type: 'com1', x: 12, y: -55 },
        { id: 'nc1', name: 'NC1', type: 'nc1', x: -12, y: -55 },
        { id: 'no1', name: 'NO1', type: 'no1', x: -35, y: -55 },
        { id: 'coil_a', name: 'A1', type: 'coil_a', x: 35, y: 55 },
        { id: 'com2', name: 'C2', type: 'com2', x: 12, y: 55 },
        { id: 'nc2', name: 'NC2', type: 'nc2', x: -12, y: 55 },
        { id: 'no2', name: 'NO2', type: 'no2', x: -35, y: 55 }
      ],
      state: {}
    },
    {
      id: 'reference_actuator',
      type: 'actuator',
      x: 760,
      y: 250,
      label: 'Gate Actuator',
      terminals: [
        { id: 'pos', name: '(+)', type: 'pos', x: -30, y: 35 },
        { id: 'neg', name: '(-)', type: 'neg', x: 30, y: 35 }
      ],
      state: { travel: 0 }
    }
  ],
  preplacedWires: [],
  hints: [
    'Board input: Transformer (+) → Altronix AC1; Transformer (-) → AC2.',
    'Coil: Altronix (+) → Key C → Key NO → DPDT A1; DPDT A2 → Altronix (-).',
    'Actuator: DPDT C1 → Actuator (+); DPDT C2 → Actuator (-).',
    'Positive cross: Altronix (+) → DPDT NO1 and NC2.',
    'Negative cross: Altronix (-) → DPDT NC1 and NO2.',
    'Test one full cycle: key ON to 100%, then key OFF to 0%.'
  ],
  successCriteria: (components, _wires, _nodeVoltages, _isEnergized) => {
    const keySwitch = components.find(component => component.id === 'act_key');
    const actuator = components.find(component => component.id === 'reference_actuator');

    if (!keySwitch || !actuator) {
      return { success: false, feedback: 'Required equipment is missing. Keep the maintained key switch and actuator in the project.' };
    }

    const travel = actuator.state.travel || 0;
    const keyOn = Boolean(keySwitch.state.toggled);

    if (keyOn && travel >= 96) {
      keySwitch.state.extendVerified = true;
    }

    if (!keyOn && keySwitch.state.extendVerified && travel <= 4) {
      return { success: true };
    }

    if (keySwitch.state.extendVerified) {
      return {
        success: false,
        feedback: 'Extension is verified. Turn the maintained key OFF and allow the actuator to retract to 0%.'
      };
    }

    return {
      success: false,
      feedback: 'The extension test is incomplete. Check the DPDT cross-wiring, turn on power, and set the key ON until the actuator reaches 100%.'
    };
  }
};
