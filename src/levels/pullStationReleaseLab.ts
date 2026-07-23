import type { Level } from '../types/game';

/**
 * Reference-based emergency release circuit derived from the supplied
 * pull-station, relay, pilot-light, and fail-safe lock training photos.
 */
export const pullStationReleaseLab: Level = {
  id: 23,
  title: 'Emergency Pull-Station Release',
  description: 'Use an NC pull-station loop to release a fail-safe lock and change status from green to red.',
  instructions: [
    'In the normal state, the pull station NC loop keeps the relay, green indicator, and fail-safe maglock energized.',
    'Board input: Transformer (+) → Altronix AC1; Transformer (-) → Altronix AC2.',
    'Control loop: Altronix (+) → Pull Station C → Pull Station NC → Release Relay A1; Relay A2 → Altronix (-). Leave Pull Station NO unused.',
    'Output pole: Altronix (+) → Release Relay COM. Connect Relay NO to green NORMAL (+) and Maglock (+). Connect Relay NC to red RELEASED (+).',
    'Return green (-), red (-), and Maglock (-) to Altronix (-).',
    'Test: verify green/locked, pull the station for red/released, then reset it and confirm green/locked returns.'
  ],
  goals: [
    'Energize the Altronix board',
    'Hold the relay through the pull station NC contact',
    'Verify green and maglock power in the normal state',
    'Pull for red indication and lock release',
    'Reset and restore the normal state'
  ],
  inventory: [],
  preplacedComponents: [
    {
      id: 'pull_transformer',
      type: 'transformer',
      x: 245,
      y: 120,
      label: '24V Transformer',
      terminals: [
        { id: 'pos', name: '(+)', type: 'pos', x: -20, y: 35 },
        { id: 'neg', name: '(-)', type: 'neg', x: 20, y: 35 }
      ],
      state: {}
    },
    {
      id: 'pull_psu',
      type: 'power_supply',
      x: 400,
      y: 120,
      label: 'Altronix Field Supply',
      terminals: [
        { id: 'ac1', name: 'AC', type: 'in', x: -45, y: 35 },
        { id: 'ac2', name: 'AC', type: 'in', x: -15, y: 35 },
        { id: 'pos', name: '(+)', type: 'pos', x: 15, y: 35 },
        { id: 'neg', name: '(-)', type: 'neg', x: 45, y: 35 }
      ],
      state: { requireAcInput: true }
    },
    {
      id: 'pull_station_1',
      type: 'pull_station',
      x: 340,
      y: 245,
      label: 'Emergency Pull',
      terminals: [
        { id: 'com', name: 'C', type: 'com', x: -55, y: 30 },
        { id: 'no', name: 'NO', type: 'no', x: 55, y: -25 },
        { id: 'nc', name: 'NC', type: 'nc', x: 55, y: 20 }
      ],
      state: { toggled: false }
    },
    {
      id: 'pull_relay',
      type: 'relay',
      x: 555,
      y: 245,
      label: 'Release Relay',
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
      id: 'pull_green',
      type: 'lamp_indicator',
      x: 790,
      y: 100,
      label: 'NORMAL',
      terminals: [
        { id: 'in', name: '+', type: 'in', x: -30, y: 15 },
        { id: 'out', name: '-', type: 'out', x: 30, y: 15 }
      ],
      state: { color: 'green' }
    },
    {
      id: 'pull_red',
      type: 'lamp_indicator',
      x: 790,
      y: 260,
      label: 'RELEASED',
      terminals: [
        { id: 'in', name: '+', type: 'in', x: -30, y: 15 },
        { id: 'out', name: '-', type: 'out', x: 30, y: 15 }
      ],
      state: { color: 'red' }
    },
    {
      id: 'pull_lock',
      type: 'maglock',
      x: 785,
      y: 435,
      label: 'Fail-Safe Lock',
      terminals: [
        { id: 'in', name: '+', type: 'in', x: -70, y: 10 },
        { id: 'out', name: '-', type: 'out', x: 70, y: 10 }
      ],
      state: { failSecure: false }
    }
  ],
  preplacedWires: [],
  hints: [
    'Board input: Transformer (+) → Altronix AC1; Transformer (-) → AC2.',
    'Control: Altronix (+) → Pull Station C → NC → Release Relay A1; Relay A2 → Altronix (-).',
    'Relay supply: Altronix (+) → Release Relay COM.',
    'Normal branch: Relay NO → green NORMAL (+) and Maglock (+).',
    'Released branch: Relay NC → red RELEASED (+). Return both pilots and the maglock to Altronix (-).',
    'Test in order: normal, pulled, then reset.'
  ],
  successCriteria: (components, _wires, _nodeVoltages, isEnergized) => {
    const pullStation = components.find(component => component.id === 'pull_station_1');

    if (!pullStation) {
      return { success: false, feedback: 'Required equipment is missing. Keep the emergency pull station in the project.' };
    }

    const isPulled = Boolean(pullStation.state.toggled);
    const relayOn = isEnergized('pull_relay');
    const greenOn = isEnergized('pull_green');
    const redOn = isEnergized('pull_red');
    const lockPowered = isEnergized('pull_lock');
    const normalState = !isPulled && relayOn && greenOn && !redOn && lockPowered;
    const releaseState = isPulled && !relayOn && !greenOn && redOn && !lockPowered;

    if (normalState) {
      pullStation.state.normalVerified = true;
      if (pullStation.state.releaseVerified) {
        pullStation.state.resetVerified = true;
      }
    }

    if (releaseState && pullStation.state.normalVerified) {
      pullStation.state.releaseVerified = true;
    }

    if (pullStation.state.normalVerified && pullStation.state.releaseVerified && pullStation.state.resetVerified) {
      return { success: true };
    }

    if (!pullStation.state.normalVerified) {
      return {
        success: false,
        feedback: 'Normal state is incorrect. Reset the pull station; relay, green, and maglock power must be ON while red is OFF.'
      };
    }

    if (!pullStation.state.releaseVerified) {
      return {
        success: false,
        feedback: 'Pull-state test failed. Activate the station; the NC loop, relay, and maglock power must drop while red turns ON.'
      };
    }

    return {
      success: false,
      feedback: 'Reset the pull station and confirm the relay, green NORMAL pilot, and maglock power turn ON again.'
    };
  }
};
