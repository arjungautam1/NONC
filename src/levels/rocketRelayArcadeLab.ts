import type { Level } from '../types/game';

/**
 * A compact arcade-style lab that makes the relay contact transfer visible:
 * NC owns the standby lamp, while NO owns the launch loads. The player must
 * prove each operating state in order, including a live emergency-stop test.
 */
export const rocketRelayArcadeLab: Level = {
  id: 26,
  title: 'Rocket Relay: Launch Sequence',
  description: 'Play mission control: wire a protected relay circuit, launch the thruster, then prove the emergency stop brings the launch loads back to standby.',
  instructions: [
    'Mission rules: score three states in order — STANDBY, LAUNCH, then E-STOP. The mission panel records each verified state.',
    'Control branch: Battery (+) → E-Stop IN → E-Stop OUT → LAUNCH IN → LAUNCH OUT → Relay A1; Relay A2 → Battery (-).',
    'Standby branch: Battery (+) → Relay COM → Relay NC → STANDBY (+); STANDBY (-) → Battery (-).',
    'Launch branch: Relay NO → GO (+), THRUSTER (+), and CHIRP (+). Return each launch load (-) terminal to Battery (-).',
    'Play it: turn System Power ON. Verify the red STANDBY lamp, tap LAUNCH to run the green GO lamp, thruster, and chirp, then tap E-STOP to cancel launch and restore standby.'
  ],
  goals: [
    'Build the protected relay control branch',
    'Verify the red STANDBY state before launch',
    'Tap LAUNCH and transfer power to all launch loads',
    'Tap E-STOP and return safely to STANDBY'
  ],
  inventory: [],
  preplacedComponents: [
    {
      id: 'rocket_battery',
      type: 'battery',
      x: 115,
      y: 300,
      label: '12V Mission Pack',
      terminals: [
        { id: 'pos', name: '(+)', type: 'pos', x: -30, y: 0 },
        { id: 'neg', name: '(-)', type: 'neg', x: 30, y: 0 }
      ],
      state: {}
    },
    {
      id: 'rocket_estop',
      type: 'button_nc',
      x: 300,
      y: 150,
      label: 'E-STOP',
      terminals: [
        { id: 'in', name: 'IN', type: 'in', x: -30, y: 0 },
        { id: 'out', name: 'OUT', type: 'out', x: 30, y: 0 }
      ],
      state: {}
    },
    {
      id: 'rocket_launch',
      type: 'button_no',
      x: 300,
      y: 360,
      label: 'LAUNCH',
      terminals: [
        { id: 'in', name: 'IN', type: 'in', x: -30, y: 0 },
        { id: 'out', name: 'OUT', type: 'out', x: 30, y: 0 }
      ],
      state: {}
    },
    {
      id: 'rocket_relay',
      type: 'relay',
      x: 500,
      y: 255,
      label: 'MISSION RELAY',
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
      id: 'rocket_standby',
      type: 'lamp_indicator',
      x: 710,
      y: 115,
      label: 'STANDBY',
      terminals: [
        { id: 'in', name: '+', type: 'in', x: -30, y: 15 },
        { id: 'out', name: '-', type: 'out', x: 30, y: 15 }
      ],
      state: { color: 'red' }
    },
    {
      id: 'rocket_go',
      type: 'lamp_indicator',
      x: 710,
      y: 255,
      label: 'GO',
      terminals: [
        { id: 'in', name: '+', type: 'in', x: -30, y: 15 },
        { id: 'out', name: '-', type: 'out', x: 30, y: 15 }
      ],
      state: { color: 'green' }
    },
    {
      id: 'rocket_thruster',
      type: 'dc_fan',
      x: 710,
      y: 410,
      label: 'THRUSTER',
      terminals: [
        { id: 'pos', name: '+', type: 'pos', x: -20, y: 40 },
        { id: 'neg', name: '-', type: 'neg', x: 20, y: 40 }
      ],
      state: {}
    },
    {
      id: 'rocket_chirp',
      type: 'buzzer',
      x: 875,
      y: 255,
      label: 'CHIRP',
      terminals: [
        { id: 'in', name: '+', type: 'in', x: -50, y: 15 },
        { id: 'out', name: '-', type: 'out', x: 50, y: 15 }
      ],
      state: {}
    }
  ],
  preplacedWires: [],
  hints: [
    'Start with the control branch. An NC E-STOP conducts while released; the NO LAUNCH button conducts only after you tap it.',
    'The relay COM contact has one supply wire. At rest it connects to NC, so wire the red STANDBY lamp on NC.',
    'The relay NO terminal can feed more than one wire. Branch it to GO, THRUSTER, and CHIRP.',
    'When E-STOP opens, the relay de-energizes. That turns off the launch loads and reconnects the red standby lamp through NC.'
  ],
  successCriteria: (components, _wires, _nodeVoltages, isEnergized) => {
    const relay = components.find(component => component.id === 'rocket_relay');
    const launch = components.find(component => component.id === 'rocket_launch');
    const eStop = components.find(component => component.id === 'rocket_estop');

    if (!relay || !launch || !eStop) {
      return { success: false, feedback: 'Mission hardware is missing. Reset the launch lab and try again.' };
    }

    const relayOn = isEnergized('rocket_relay');
    const standbyOn = isEnergized('rocket_standby');
    const goOn = isEnergized('rocket_go');
    const thrusterOn = isEnergized('rocket_thruster');
    const chirpOn = isEnergized('rocket_chirp');
    const launchPressed = Boolean(launch.state.pressed);
    const eStopPressed = Boolean(eStop.state.pressed);

    const standbyReady = !launchPressed && !eStopPressed && !relayOn && standbyOn && !goOn && !thrusterOn && !chirpOn;
    const launchLive = launchPressed && !eStopPressed && relayOn && !standbyOn && goOn && thrusterOn && chirpOn;
    const emergencySafe = eStopPressed && !relayOn && standbyOn && !goOn && !thrusterOn && !chirpOn;

    if (standbyReady) relay.state.standbyVerified = true;
    if (relay.state.standbyVerified && launchLive) relay.state.launchVerified = true;
    if (relay.state.launchVerified && emergencySafe) relay.state.emergencyVerified = true;

    if (relay.state.standbyVerified && relay.state.launchVerified && relay.state.emergencyVerified) {
      return { success: true };
    }

    if (!relay.state.standbyVerified) {
      return { success: false, feedback: 'First earn STANDBY: release both buttons. Red must be ON while GO, THRUSTER, and CHIRP are OFF.' };
    }

    if (!relay.state.launchVerified) {
      return { success: false, feedback: 'Launch state missing: tap LAUNCH with E-STOP released. Relay, GO, THRUSTER, and CHIRP must all turn ON while red turns OFF.' };
    }

    return { success: false, feedback: 'Final safety check: tap E-STOP. The launch loads must turn OFF and the red STANDBY lamp must return.' };
  }
};
