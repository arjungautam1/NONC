import type { Level } from '../types/game';

/**
 * Reversible sliding-gate operator exercise with independent end-of-travel
 * protection on the OPEN and CLOSE contactor coils.
 */
export const slidingGateOperatorLab: Level = {
  id: 22,
  title: 'Sliding Gate Reversing Control',
  description: 'Build a 24 V OPEN/CLOSE reversing circuit with independent travel-limit protection.',
  instructions: [
    'Two SPDT relays reverse motor polarity: the OPEN relay controls M+, and the CLOSE relay controls M−.',
    'Board input: Transformer (+) → Gate Power Board AC1; Transformer (-) → AC2.',
    'OPEN control: PSU (+) → OPEN Switch IN → OPEN Switch OUT → OPEN Limit IN → Limit OUT → OPEN Relay A1; Relay A2 → PSU (-).',
    'CLOSE control: PSU (+) → CLOSE Switch IN → CLOSE Switch OUT → CLOSE Limit IN → Limit OUT → CLOSE Relay A1; Relay A2 → PSU (-).',
    'Motor reversing: both relay NO contacts → PSU (+); both relay NC contacts → PSU (-); OPEN Relay COM → Gate M+; CLOSE Relay COM → Gate M−.',
    'Test: hold OPEN to 100% and verify the OPEN limit stops travel. Then hold CLOSE to 0% and verify the CLOSE limit stops travel.'
  ],
  goals: [
    'Energize the gate power board',
    'Route OPEN and CLOSE controls through their matching limits',
    'Cross-connect both relays for polarity reversal',
    'Verify the OPEN limit at 100%',
    'Verify the CLOSE limit at 0%'
  ],
  inventory: [],
  preplacedComponents: [
    {
      id: 'slide_transformer',
      type: 'transformer',
      x: 220,
      y: 270,
      label: 'Gate Transformer',
      terminals: [
        { id: 'pos', name: '(+)', type: 'pos', x: -20, y: 35 },
        { id: 'neg', name: '(-)', type: 'neg', x: 20, y: 35 }
      ],
      state: {}
    },
    {
      id: 'slide_psu',
      type: 'power_supply',
      x: 70,
      y: 325,
      label: 'Gate Power Board',
      terminals: [
        { id: 'ac1', name: 'AC', type: 'in', x: -45, y: 35 },
        { id: 'ac2', name: 'AC', type: 'in', x: -15, y: 35 },
        { id: 'pos', name: '(+)', type: 'pos', x: 15, y: 35 },
        { id: 'neg', name: '(-)', type: 'neg', x: 45, y: 35 }
      ],
      state: { requireAcInput: true }
    },
    {
      id: 'slide_open_button',
      type: 'button_no',
      x: 220,
      y: 105,
      label: 'OPEN Button',
      terminals: [
        { id: 'in', name: 'IN', type: 'in', x: -30, y: 0 },
        { id: 'out', name: 'OUT', type: 'out', x: 30, y: 0 }
      ],
      state: {}
    },
    {
      id: 'limit_top',
      type: 'limit_switch',
      x: 350,
      y: 105,
      label: 'OPEN Limit',
      terminals: [
        { id: 'in', name: 'IN', type: 'in', x: -30, y: 0 },
        { id: 'out', name: 'OUT', type: 'out', x: 30, y: 0 }
      ],
      state: { pressed: false }
    },
    {
      id: 'slide_open_relay',
      type: 'relay',
      x: 500,
      y: 145,
      label: 'OPEN Relay',
      terminals: [
        { id: 'coil_a', name: 'A1', type: 'coil_a', x: -35, y: -30 },
        { id: 'coil_b', name: 'A2', type: 'coil_b', x: -35, y: 30 },
        { id: 'com', name: 'COM', type: 'com', x: 35, y: -30 },
        { id: 'nc', name: 'NC', type: 'nc', x: 35, y: 0 },
        { id: 'no', name: 'NO', type: 'no', x: 35, y: 30 }
      ],
      state: {}
    },
    {
      id: 'slide_close_button',
      type: 'button_no',
      x: 220,
      y: 425,
      label: 'CLOSE Button',
      terminals: [
        { id: 'in', name: 'IN', type: 'in', x: -30, y: 0 },
        { id: 'out', name: 'OUT', type: 'out', x: 30, y: 0 }
      ],
      state: {}
    },
    {
      id: 'limit_bottom',
      type: 'limit_switch',
      x: 350,
      y: 425,
      label: 'CLOSE Limit',
      terminals: [
        { id: 'in', name: 'IN', type: 'in', x: -30, y: 0 },
        { id: 'out', name: 'OUT', type: 'out', x: 30, y: 0 }
      ],
      state: { pressed: true }
    },
    {
      id: 'slide_close_relay',
      type: 'relay',
      x: 500,
      y: 385,
      label: 'CLOSE Relay',
      terminals: [
        { id: 'coil_a', name: 'A1', type: 'coil_a', x: -35, y: -30 },
        { id: 'coil_b', name: 'A2', type: 'coil_b', x: -35, y: 30 },
        { id: 'com', name: 'COM', type: 'com', x: 35, y: -30 },
        { id: 'nc', name: 'NC', type: 'nc', x: 35, y: 0 },
        { id: 'no', name: 'NO', type: 'no', x: 35, y: 30 }
      ],
      state: {}
    },
    {
      id: 'sliding_gate_1',
      type: 'sliding_gate',
      x: 700,
      y: 270,
      label: 'Delmi Sliding Gate',
      terminals: [
        { id: 'pos', name: 'M+', type: 'pos', x: -112, y: -12 },
        { id: 'neg', name: 'M−', type: 'neg', x: -112, y: 16 }
      ],
      state: { travel: 0 }
    }
  ],
  preplacedWires: [],
  hints: [
    'Board input: Transformer (+) → Gate Power Board AC1; Transformer (-) → AC2.',
    'OPEN coil: PSU (+) → OPEN IN → OPEN OUT → OPEN Limit IN → Limit OUT → OPEN Relay A1; Relay A2 → PSU (-).',
    'CLOSE coil: PSU (+) → CLOSE IN → CLOSE OUT → CLOSE Limit IN → Limit OUT → CLOSE Relay A1; Relay A2 → PSU (-).',
    'Motor commons: OPEN Relay COM → Gate M+. CLOSE Relay COM → Gate M−.',
    'Reversing supply: both relay NO contacts → PSU (+); both relay NC contacts → PSU (-).',
    'Test one full cycle: OPEN to 100%, release, then CLOSE to 0%.'
  ],
  successCriteria: (components, _wires, _nodeVoltages, _isEnergized) => {
    const gate = components.find(component => component.id === 'sliding_gate_1');
    const openLimit = components.find(component => component.id === 'limit_top');
    const closeLimit = components.find(component => component.id === 'limit_bottom');

    if (!gate || !openLimit || !closeLimit) {
      return {
        success: false,
        feedback: 'Required equipment is missing. Keep the sliding gate and both travel-limit switches in the project.'
      };
    }

    const travel = gate.state.travel || 0;

    if (travel >= 96 && openLimit.state.pressed) {
      gate.state.openLimitVerified = true;
    }

    if (gate.state.openLimitVerified && travel <= 4 && closeLimit.state.pressed) {
      return { success: true };
    }

    if (gate.state.openLimitVerified) {
      return {
        success: false,
        feedback: 'OPEN travel is verified. Release OPEN, then hold CLOSE until the gate reaches 0% and operates the CLOSE limit.'
      };
    }

    return {
      success: false,
      feedback: 'The OPEN test is incomplete. Check the OPEN control branch and reversing contacts, then hold OPEN to 100%.'
    };
  }
};
