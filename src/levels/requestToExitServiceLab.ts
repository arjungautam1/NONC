import type { Level } from '../types/game';

/**
 * Standalone request-to-exit lab based on representative 24 V access-control
 * hardware. See docs/request-to-exit-service-lab.md for the manufacturer data
 * sheets and the control truth table used to design the exercise.
 */
export const requestToExitServiceLab: Level = {
  id: 21,
  title: 'Momentary Exit and Service Override',
  description: 'Build a fail-safe door-release circuit with momentary REX control, maintained service release, and status indication.',
  instructions: [
    'This circuit provides a momentary request-to-exit path and a maintained service-release path through one DPDT relay.',
    'Board input: Transformer (+) → AL600ULX AC1; Transformer (-) → AL600ULX AC2.',
    'Normal REX path: AL600ULX (+) → Service COM → Service NC → REX COM → REX NO → Relay A1; Relay A2 → AL600ULX (-).',
    'Service override: Service NO → Relay A1. When Service is ON, the relay remains energized without holding REX.',
    'Status pole: AL600ULX (+) → Relay C1; NC1 → red SECURE (+); NO1 → green RELEASED (+). Return both pilot (-) terminals to AL600ULX (-).',
    'Lock pole: AL600ULX (+) → Relay C2 → Relay NC2 → Maglock (+); Maglock (-) → AL600ULX (-). The fail-safe maglock releases when relay operation removes power.',
    'Test: verify idle SECURE, hold and release REX, then toggle Service ON and confirm the door remains released.'
  ],
  goals: [
    'Energize the AL600ULX board from the transformer',
    'Verify red SECURE and powered maglock at rest',
    'Hold REX and momentarily release the door',
    'Release REX and restore the secure state',
    'Turn Service ON and maintain the released state'
  ],
  inventory: [],
  preplacedComponents: [
    {
      id: 'lab21_transformer',
      type: 'transformer',
      x: 185,
      y: 145,
      label: '24V Transformer',
      terminals: [
        { id: 'pos', name: '(+)', type: 'pos', x: -20, y: 35 },
        { id: 'neg', name: '(-)', type: 'neg', x: 20, y: 35 }
      ],
      state: {}
    },
    {
      id: 'lab21_psu',
      type: 'power_supply',
      x: 90,
      y: 365,
      label: 'AL600ULX',
      terminals: [
        { id: 'ac1', name: 'AC', type: 'in', x: -45, y: 35 },
        { id: 'ac2', name: 'AC', type: 'in', x: -15, y: 35 },
        { id: 'pos', name: '(+)', type: 'pos', x: 15, y: 35 },
        { id: 'neg', name: '(-)', type: 'neg', x: 45, y: 35 }
      ],
      state: { requireAcInput: true }
    },
    {
      id: 'lab21_service',
      type: 'rocker_switch_2pos',
      x: 315,
      y: 155,
      label: 'RCI 909 Service',
      terminals: [
        { id: 'com', name: 'C', type: 'in', x: -30, y: 0 },
        { id: 'nc', name: 'NC', type: 'out_a', x: 30, y: -20 },
        { id: 'no', name: 'NO', type: 'out_b', x: 30, y: 20 }
      ],
      state: {}
    },
    {
      id: 'lab21_rex',
      type: 'button_no',
      x: 315,
      y: 365,
      label: 'RCI 909 REX',
      terminals: [
        { id: 'com', name: 'C', type: 'com', x: -30, y: 15 },
        { id: 'nc', name: 'NC', type: 'nc', x: 0, y: -25 },
        { id: 'no', name: 'NO', type: 'no', x: 30, y: 15 }
      ],
      state: {}
    },
    {
      id: 'lab21_relay',
      type: 'relay_dpdt',
      x: 520,
      y: 285,
      label: 'MY2 DPDT Relay',
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
      id: 'lab21_red',
      type: 'lamp_indicator',
      x: 760,
      y: 135,
      label: 'SECURE',
      terminals: [
        { id: 'in', name: '+', type: 'in', x: -30, y: 15 },
        { id: 'out', name: '-', type: 'out', x: 30, y: 15 }
      ],
      state: { color: 'red' }
    },
    {
      id: 'lab21_green',
      type: 'lamp_indicator',
      x: 760,
      y: 285,
      label: 'RELEASED',
      terminals: [
        { id: 'in', name: '+', type: 'in', x: -30, y: 15 },
        { id: 'out', name: '-', type: 'out', x: 30, y: 15 }
      ],
      state: { color: 'green' }
    },
    {
      id: 'lab21_lock',
      type: 'maglock',
      x: 765,
      y: 455,
      label: 'F8315 Fail-Safe',
      terminals: [
        { id: 'in', name: '+', type: 'in', x: -70, y: 10 },
        { id: 'out', name: '-', type: 'out', x: 70, y: 10 }
      ],
      state: { failSecure: false }
    }
  ],
  preplacedWires: [],
  hints: [
    'Board input: Transformer (+) → AL600ULX AC1; Transformer (-) → AL600ULX AC2.',
    'REX path: AL600ULX (+) → Service COM → Service NC → REX COM → REX NO → Relay A1; Relay A2 → AL600ULX (-).',
    'Service branch: Service NO → Relay A1. REX NO and Service NO intentionally meet at A1.',
    'Status: AL600ULX (+) → Relay C1; NC1 → SECURE (+); NO1 → RELEASED (+); both returns → AL600ULX (-).',
    'Maglock: AL600ULX (+) → Relay C2 → NC2 → Maglock (+); Maglock (-) → AL600ULX (-). Leave NO2 unused.'
  ],
  successCriteria: (components, _wires, _nodeVoltages, isEnergized) => {
    const service = components.find(component => component.id === 'lab21_service');
    const rex = components.find(component => component.id === 'lab21_rex');

    if (!service || !rex) {
      return {
        success: false,
        feedback: 'Required controls are missing. Keep both the Service and REX switches in the project.'
      };
    }

    const serviceOn = Boolean(service.state.toggled);
    const rexPressed = Boolean(rex.state.pressed);
    const relayOn = isEnergized('lab21_relay');
    const redOn = isEnergized('lab21_red');
    const greenOn = isEnergized('lab21_green');
    const lockPowered = isEnergized('lab21_lock');
    const idleSecure = !relayOn && redOn && !greenOn && lockPowered;
    const released = relayOn && !redOn && greenOn && !lockPowered;

    if (!serviceOn && !rexPressed && idleSecure) {
      service.state.idleVerified = true;
      if (service.state.momentaryVerified) {
        service.state.returnVerified = true;
      }
    }

    if (!serviceOn && rexPressed && released) {
      service.state.momentaryVerified = true;
    }

    if (serviceOn && !rexPressed && released) {
      service.state.maintainedVerified = true;
    }

    if (
      service.state.idleVerified
      && service.state.momentaryVerified
      && service.state.returnVerified
      && service.state.maintainedVerified
    ) {
      return { success: true };
    }

    if (!service.state.idleVerified) {
      return {
        success: false,
        feedback: 'Idle state is incorrect. Set Service to NC and release REX; red and maglock power must be ON while green and the relay are OFF.'
      };
    }

    if (!service.state.momentaryVerified) {
      return {
        success: false,
        feedback: 'REX test failed. Hold REX; the relay and green light must turn ON while red and maglock power turn OFF.'
      };
    }

    if (!service.state.returnVerified) {
      return {
        success: false,
        feedback: 'Release REX and confirm the circuit returns to red SECURE with the maglock powered.'
      };
    }

    return {
      success: false,
      feedback: 'Service test failed. Turn Service ON without holding REX; the relay and green light must stay ON while maglock power stays OFF.'
    };
  }
};
