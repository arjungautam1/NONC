import type { Level } from '../types/game';
import { cx12plusTerminals, DEFAULT_CX12PLUS_CONFIG } from '../components/game/components/cx12plusPinout';

export const cx12DoorOperatorLab: Level = {
  id: 25,
  title: 'Automatic Door Operator Sequencer',
  description: 'Use a Camden CX-12 PLUS door interface relay to sequence an electric strike and an automatic door operator from a wave-to-open sensor.',
  instructions: [
    'In Mode 1 (Momentary Sequencer), triggering Input 1 (Dry1) immediately activates Relay 1 (electric strike) to unlock the door, and then automatically triggers Relay 2 (door operator) after a brief delay to open the door.',
    'Board power: Wire Transformer (+) to CX-12 Terminal 1 (PWR); wire Transformer (-) to CX-12 Terminal 2 (PWR).',
    'Trigger switch: Wire Wave Sensor C to CX-12 Terminal 11 (Dry1); wire Wave Sensor NO to CX-12 Terminal 12 (Dry1).',
    'Lock circuit: Wire Transformer (+) to CX-12 Terminal 4 (Relay 1 COM); wire CX-12 Terminal 3 (Relay 1 NO) to Fail-Secure Strike (+); wire Strike (-) to Transformer (-).',
    'Operator circuit: Wire Transformer (+) to CX-12 Terminal 7 (Relay 2 COM); wire CX-12 Terminal 6 (Relay 2 NO) to Door Operator (M+); wire Operator (M-) to Transformer (-).',
    'Test: Turn on System Power, then activate the Wave Sensor. The strike should unlock first, followed by the door opening fully.'
  ],
  goals: [
    'Power the CX-12 PLUS board from the transformer',
    'Connect the Wave Sensor to trigger CX-12 Input 1 (Dry1)',
    'Unlock the fail-secure strike via Relay 1',
    'Activate the door operator via Relay 2',
    'Open the door fully (travel to 100%)'
  ],
  inventory: [],
  preplacedComponents: [
    {
      id: 'cx12_transformer',
      type: 'transformer',
      x: 100,
      y: 110,
      label: '24V Transformer',
      terminals: [
        { id: 'pos', name: '(+)', type: 'pos', x: -20, y: 35 },
        { id: 'neg', name: '(-)', type: 'neg', x: 20, y: 35 }
      ],
      state: {}
    },
    {
      id: 'cx12_relay',
      type: 'cx12plus',
      x: 350,
      y: 240,
      label: 'CX-12 PLUS',
      terminals: cx12plusTerminals(),
      state: { cx12Config: { ...DEFAULT_CX12PLUS_CONFIG } }
    },
    {
      id: 'cx12_sensor',
      type: 'wave_sensor',
      x: 100,
      y: 355,
      label: 'Wave Sensor',
      terminals: [
        { id: 'com', name: 'C', type: 'com', x: -20, y: -72 },
        { id: 'nc', name: 'NC', type: 'nc', x: 0, y: -72 },
        { id: 'no', name: 'NO', type: 'no', x: 20, y: -72 }
      ],
      state: { active: false }
    },
    {
      id: 'cx12_strike',
      type: 'door_strike',
      x: 600,
      y: 120,
      label: 'Fail-Secure Strike',
      terminals: [
        { id: 'in', name: '+', type: 'in', x: -50, y: 0 },
        { id: 'out', name: '-', type: 'out', x: 50, y: 0 }
      ],
      state: { failSecure: true }
    },
    {
      id: 'cx12_operator',
      type: 'sliding_gate',
      x: 610,
      y: 340,
      label: 'Door Operator',
      terminals: [
        { id: 'pos', name: 'M+', type: 'pos', x: -112, y: -12 },
        { id: 'neg', name: 'M−', type: 'neg', x: -112, y: 16 }
      ],
      state: { travel: 0 }
    }
  ],
  preplacedWires: [],
  hints: [
    'Wire board power from the Transformer (+/-) to CX-12 PWR terminals 1 and 2.',
    'Connect Wave Sensor C and NO to CX-12 Dry1 terminals 11 and 12 to provide the trigger.',
    'Connect lock power from Transformer (+) through Relay 1 (COM1 to NO1) to the Fail-Secure Strike, and strike (-) back to Transformer (-).',
    'Connect operator power from Transformer (+) through Relay 2 (COM2 to NO2) to the Door Operator (M+), and M- back to Transformer (-).'
  ],
  successCriteria: (components, _wires, _nodeVoltages, isEnergized) => {
    const relay = components.find(c => c.id === 'cx12_relay');
    const strike = components.find(c => c.id === 'cx12_strike');
    const operator = components.find(c => c.id === 'cx12_operator');

    if (!relay || !strike || !operator) {
      return { success: false, feedback: 'Internal error: missing preplaced components.' };
    }

    const isBoardPowered = isEnergized('cx12_relay');
    const strikeActive = Boolean(strike.state.active);
    const operatorTravel = operator.state.travel || 0;

    // Check if the board is powered in the idle state
    if (isBoardPowered && !relay.state.idleVerified) {
      relay.state.idleVerified = true;
    }

    // Step 2: Strike is unlocked
    if (relay.state.idleVerified && strikeActive) {
      relay.state.strikeUnlocked = true;
    }

    // Step 3: Operator runs
    if (relay.state.strikeUnlocked && operatorTravel > 0) {
      relay.state.operatorTriggered = true;
    }

    // Step 4: Door fully opened
    if (relay.state.operatorTriggered && operatorTravel === 100) {
      relay.state.doorFullyOpened = true;
    }

    if (
      relay.state.idleVerified &&
      relay.state.strikeUnlocked &&
      relay.state.operatorTriggered &&
      relay.state.doorFullyOpened
    ) {
      return { success: true };
    }

    if (!relay.state.idleVerified) {
      return {
        success: false,
        feedback: 'First, turn on System Power to energize the CX-12 board.'
      };
    }

    if (!relay.state.strikeUnlocked) {
      return {
        success: false,
        feedback: 'Trigger the Wave Sensor (wave your hand). The fail-secure strike must receive power and unlock.'
      };
    }

    if (!relay.state.operatorTriggered) {
      return {
        success: false,
        feedback: 'The strike unlocked, but the door operator has not run. Check Relay 2 wiring to the Door Operator.'
      };
    }

    return {
      success: false,
      feedback: 'The door operator is running. Wait for the door to open fully (travel to 100%).'
    };
  }
};
