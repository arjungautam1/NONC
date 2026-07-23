import type { Level } from '../types/game';
import { requestToExitServiceLab } from './requestToExitServiceLab';
import { slidingGateOperatorLab } from './slidingGateOperatorLab';
import { pullStationReleaseLab } from './pullStationReleaseLab';
import { keySwitchActuatorLab } from './keySwitchActuatorLab';

export const levels: Level[] = [
  {
    id: 1,
    title: 'Build a Complete Circuit',
    description: 'Build a closed power-supply-to-lamp loop and verify that current can flow.',
    instructions: [
      'Goal: create one continuous path from Power Supply (+), through the lightbulb, and back to Power Supply (-).',
      'A load works only when the circuit has both a supply path and a return path.',
      'Wire Power Supply (+) → Lightbulb IN.',
      'Wire Lightbulb OUT → Power Supply (-).',
      'Test: turn on System Power. The lightbulb should glow.'
    ],
    goals: [
      'Connect Power Supply (+) to Lightbulb IN',
      'Connect Lightbulb OUT to Power Supply (-)',
      'Turn on power and light the bulb'
    ],
    inventory: [],
    preplacedComponents: [
      {
        id: 'bat1',
        type: 'battery',
        x: 180,
        y: 280,
        label: '12V Battery',
        terminals: [
          { id: 'pos', name: '(+)', type: 'pos', x: -30, y: 0 },
          { id: 'neg', name: '(-)', type: 'neg', x: 30, y: 0 }
        ],
        state: {}
      },
      {
        id: 'bulb1',
        type: 'bulb',
        x: 520,
        y: 280,
        label: 'Lightbulb',
        terminals: [
          { id: 'in', name: 'IN', type: 'in', x: -30, y: 25 },
          { id: 'out', name: 'OUT', type: 'out', x: 30, y: 25 }
        ],
        state: {}
      }
    ],
    preplacedWires: [],
    hints: [
      'Supply path: Power Supply (+) → Lightbulb IN.',
      'Return path: Lightbulb OUT → Power Supply (-).',
      'After both wires are connected, turn on System Power.'
    ],
    successCriteria: (_components, _wires, _nodeVoltages, isEnergized) => {
      if (isEnergized('bulb1')) {
        return { success: true };
      }
      return { 
        success: false, 
        feedback: 'The circuit is incomplete. Check Power Supply (+) → Lightbulb IN and Lightbulb OUT → Power Supply (-), then turn on power.'
      };
    }
  },
  {
    id: 2,
    title: 'Repair an Open Circuit',
    description: 'Find a broken return path, repair it, and restore current flow.',
    instructions: [
      'An open circuit contains a break, so current cannot complete the loop.',
      'Inspect the existing wiring. The supply side is connected, but the return side is open.',
      'Repair the return path: wire Lightbulb OUT → Power Supply (-).',
      'Test: turn on System Power and confirm that the lightbulb glows.'
    ],
    goals: [
      'Identify the missing return connection',
      'Connect Lightbulb OUT to Power Supply (-)',
      'Restore power to the lightbulb'
    ],
    inventory: [],
    preplacedComponents: [
      {
        id: 'bat1',
        type: 'battery',
        x: 180,
        y: 280,
        label: '12V Battery',
        terminals: [
          { id: 'pos', name: '(+)', type: 'pos', x: -30, y: 0 },
          { id: 'neg', name: '(-)', type: 'neg', x: 30, y: 0 }
        ],
        state: {}
      },
      {
        id: 'bulb1',
        type: 'bulb',
        x: 520,
        y: 280,
        label: 'Lightbulb',
        terminals: [
          { id: 'in', name: 'IN', type: 'in', x: -30, y: 25 },
          { id: 'out', name: 'OUT', type: 'out', x: 30, y: 25 }
        ],
        state: {}
      }
    ],
    preplacedWires: [
      {
        id: 'w_init_1',
        fromComponentId: 'bat1',
        fromTerminalId: 'pos',
        toComponentId: 'bulb1',
        toTerminalId: 'in',
        color: 'red'
      }
    ],
    hints: [
      'Power Supply (+) is already connected to Lightbulb IN.',
      'Add one return wire: Lightbulb OUT → Power Supply (-).'
    ],
    successCriteria: (_components, _wires, _nodeVoltages, isEnergized) => {
      if (isEnergized('bulb1')) {
        return { success: true };
      }
      return { 
        success: false, 
        feedback: 'The return path is still open. Connect Lightbulb OUT → Power Supply (-), then test the circuit.'
      };
    }
  },
  {
    id: 3,
    title: 'Momentary Normally Open Switch',
    description: 'Use a momentary NO switch to power a light only while the switch is held.',
    instructions: [
      'A normally open (NO) momentary switch is open at rest and closes only while held.',
      'Wire the control path: Power Supply (+) → NO Switch IN → NO Switch OUT → Lightbulb IN.',
      'Complete the return path: Lightbulb OUT → Power Supply (-).',
      'Test: turn on System Power, then press and hold the green switch. The bulb should light only while held.'
    ],
    goals: [
      'Wire the NO switch in series with the lightbulb',
      'Verify the bulb is OFF while the switch is released',
      'Hold the switch and light the bulb'
    ],
    inventory: [],
    preplacedComponents: [
      {
        id: 'bat1',
        type: 'battery',
        x: 150,
        y: 280,
        label: '12V Battery',
        terminals: [
          { id: 'pos', name: '(+)', type: 'pos', x: -30, y: 0 },
          { id: 'neg', name: '(-)', type: 'neg', x: 30, y: 0 }
        ],
        state: {}
      },
      {
        id: 'btn1',
        type: 'button_no',
        x: 380,
        y: 280,
        label: 'NO Button (Start)',
        terminals: [
          { id: 'in', name: 'IN', type: 'in', x: -30, y: 0 },
          { id: 'out', name: 'OUT', type: 'out', x: 30, y: 0 }
        ],
        state: {}
      },
      {
        id: 'bulb1',
        type: 'bulb',
        x: 600,
        y: 280,
        label: 'Lightbulb',
        terminals: [
          { id: 'in', name: 'IN', type: 'in', x: -30, y: 25 },
          { id: 'out', name: 'OUT', type: 'out', x: 30, y: 25 }
        ],
        state: {}
      }
    ],
    preplacedWires: [],
    hints: [
      'Supply path: Power Supply (+) → NO Switch IN.',
      'Switched path: NO Switch OUT → Lightbulb IN.',
      'Return path: Lightbulb OUT → Power Supply (-).',
      'Turn on power, then press and hold the green momentary switch.'
    ],
    successCriteria: (components, _wires, _nodeVoltages, isEnergized) => {
      const btn = components.find(c => c.id === 'btn1');
      const isPressed = btn?.state.pressed;

      if (isPressed && isEnergized('bulb1')) {
        return { success: true };
      }
      if (!isPressed && isEnergized('bulb1')) {
        return { success: false, feedback: 'The bulb is ON while the switch is released. The switch has been bypassed; place it in series with the bulb.' };
      }
      return { 
        success: false, 
        feedback: 'Wire the NO switch in series, turn on power, then press and hold it to test the circuit.'
      };
    }
  },
  {
    id: 4,
    title: 'Momentary Normally Closed Switch',
    description: 'Use a momentary NC switch to interrupt a powered circuit while it is held.',
    instructions: [
      'A normally closed (NC) momentary switch conducts at rest and opens while held.',
      'NC contacts are commonly used for STOP and emergency-stop circuits.',
      'Wire the series path: Power Supply (+) → NC Switch IN → NC Switch OUT → Lightbulb IN.',
      'Complete the return path: Lightbulb OUT → Power Supply (-).',
      'Test: turn on power. The bulb should be ON at rest and OFF while the red switch is held.'
    ],
    goals: [
      'Wire the NC switch in series with the lightbulb',
      'Verify the bulb is ON while the switch is released',
      'Hold the switch and turn the bulb OFF'
    ],
    inventory: [],
    preplacedComponents: [
      {
        id: 'bat1',
        type: 'battery',
        x: 150,
        y: 280,
        label: '12V Battery',
        terminals: [
          { id: 'pos', name: '(+)', type: 'pos', x: -30, y: 0 },
          { id: 'neg', name: '(-)', type: 'neg', x: 30, y: 0 }
        ],
        state: {}
      },
      {
        id: 'btn1',
        type: 'button_nc',
        x: 380,
        y: 280,
        label: 'NC Button (Stop)',
        terminals: [
          { id: 'in', name: 'IN', type: 'in', x: -30, y: 0 },
          { id: 'out', name: 'OUT', type: 'out', x: 30, y: 0 }
        ],
        state: {}
      },
      {
        id: 'bulb1',
        type: 'bulb',
        x: 600,
        y: 280,
        label: 'Lightbulb',
        terminals: [
          { id: 'in', name: 'IN', type: 'in', x: -30, y: 25 },
          { id: 'out', name: 'OUT', type: 'out', x: 30, y: 25 }
        ],
        state: {}
      }
    ],
    preplacedWires: [],
    hints: [
      'Supply path: Power Supply (+) → NC Switch IN.',
      'Switched path: NC Switch OUT → Lightbulb IN.',
      'Return path: Lightbulb OUT → Power Supply (-).',
      'With power ON, hold the red NC switch to open the circuit.'
    ],
    successCriteria: (components, _wires, _nodeVoltages, isEnergized) => {
      const btn = components.find(c => c.id === 'btn1');
      const isPressed = btn?.state.pressed;

      if (!isPressed && isEnergized('bulb1')) {
        // Now test if pressing it shuts it off
        btn!.state.testPassedNC = true;
      }
      
      if (isPressed && !isEnergized('bulb1') && btn?.state.testPassedNC) {
        return { success: true };
      }

      return { 
        success: false, 
        feedback: 'Wire the NC switch in series. With power ON, the bulb should glow at rest and turn OFF while the switch is held.'
      };
    }
  },
  {
    id: 5,
    title: 'Relay Coil and Contact Basics',
    description: 'Energize a relay coil and observe COM transfer from NC to NO.',
    instructions: [
      'A relay uses a low-current coil to move an isolated set of contacts.',
      'At rest, COM is connected to NC. When the coil is energized, COM transfers to NO.',
      'Wire Power Supply (+) → Momentary Switch IN → Momentary Switch OUT → Relay A1.',
      'Complete the coil return: Relay A2 → Power Supply (-).',
      'Test: turn on power and hold the momentary switch. Watch the coil energize and COM move from NC to NO.'
    ],
    goals: [
      'Wire the momentary switch in series with the relay coil',
      'Energize the relay while the switch is held',
      'Observe COM transfer from NC to NO'
    ],
    inventory: [],
    preplacedComponents: [
      {
        id: 'bat1',
        type: 'battery',
        x: 150,
        y: 200,
        label: '12V Battery',
        terminals: [
          { id: 'pos', name: '(+)', type: 'pos', x: -30, y: 0 },
          { id: 'neg', name: '(-)', type: 'neg', x: 30, y: 0 }
        ],
        state: {}
      },
      {
        id: 'btn1',
        type: 'button_no',
        x: 150,
        y: 380,
        label: 'Momentary Switch',
        terminals: [
          { id: 'in', name: 'IN', type: 'in', x: -30, y: 0 },
          { id: 'out', name: 'OUT', type: 'out', x: 30, y: 0 }
        ],
        state: {}
      },
      {
        id: 'relay1',
        type: 'relay',
        x: 480,
        y: 290,
        label: 'Control Relay',
        terminals: [
          { id: 'coil_a', name: 'Coil A', type: 'coil_a', x: -35, y: -30 },
          { id: 'coil_b', name: 'Coil B', type: 'coil_b', x: -35, y: 30 },
          { id: 'com', name: 'COM', type: 'com', x: 35, y: -30 },
          { id: 'nc', name: 'NC', type: 'nc', x: 35, y: 0 },
          { id: 'no', name: 'NO', type: 'no', x: 35, y: 30 }
        ],
        state: {}
      }
    ],
    preplacedWires: [],
    hints: [
      'Supply path: Power Supply (+) → Momentary Switch IN.',
      'Control path: Momentary Switch OUT → Relay A1.',
      'Coil return: Relay A2 → Power Supply (-).',
      'Turn on power and hold the switch to energize the relay.'
    ],
    successCriteria: (components, _wires, _nodeVoltages, _isEnergized) => {
      const relay = components.find(c => c.id === 'relay1');
      if (relay?.state.energized) {
        return { success: true };
      }
      return { 
        success: false, 
        feedback: 'The relay is not energized. Check Power Supply (+) → Switch → Relay A1 and Relay A2 → Power Supply (-), then hold the switch.'
      };
    }
  },
  {
    id: 6,
    title: 'Relay NO Load Control',
    description: 'Use a relay NO contact to switch a separate lightbulb circuit.',
    instructions: [
      'This lab has two paths: a control circuit for the relay coil and a load circuit for the lightbulb.',
      'Control circuit: Power Supply (+) → Momentary Switch IN → Switch OUT → Relay A1; Relay A2 → Power Supply (-).',
      'Load circuit: Power Supply (+) → Relay COM → Relay NO → Lightbulb IN.',
      'Complete the load return: Lightbulb OUT → Power Supply (-).',
      'Test: hold the momentary switch. The relay should energize and the lightbulb should turn ON.'
    ],
    goals: [
      'Complete the momentary relay-control circuit',
      'Route the lightbulb through Relay COM and NO',
      'Hold the switch and turn the lightbulb ON'
    ],
    inventory: [],
    preplacedComponents: [
      {
        id: 'bat1',
        type: 'battery',
        x: 120,
        y: 200,
        label: '12V Battery',
        terminals: [
          { id: 'pos', name: '(+)', type: 'pos', x: -30, y: 0 },
          { id: 'neg', name: '(-)', type: 'neg', x: 30, y: 0 }
        ],
        state: {}
      },
      {
        id: 'btn1',
        type: 'button_no',
        x: 120,
        y: 380,
        label: 'Momentary Switch',
        terminals: [
          { id: 'in', name: 'IN', type: 'in', x: -30, y: 0 },
          { id: 'out', name: 'OUT', type: 'out', x: 30, y: 0 }
        ],
        state: {}
      },
      {
        id: 'relay1',
        type: 'relay',
        x: 400,
        y: 290,
        label: 'Control Relay',
        terminals: [
          { id: 'coil_a', name: 'Coil A', type: 'coil_a', x: -35, y: -30 },
          { id: 'coil_b', name: 'Coil B', type: 'coil_b', x: -35, y: 30 },
          { id: 'com', name: 'COM', type: 'com', x: 35, y: -30 },
          { id: 'nc', name: 'NC', type: 'nc', x: 35, y: 0 },
          { id: 'no', name: 'NO', type: 'no', x: 35, y: 30 }
        ],
        state: {}
      },
      {
        id: 'bulb1',
        type: 'bulb',
        x: 680,
        y: 290,
        label: 'Lightbulb',
        terminals: [
          { id: 'in', name: 'IN', type: 'in', x: -30, y: 25 },
          { id: 'out', name: 'OUT', type: 'out', x: 30, y: 25 }
        ],
        state: {}
      }
    ],
    preplacedWires: [],
    hints: [
      'Control: Power Supply (+) → Switch IN → Switch OUT → Relay A1; Relay A2 → Power Supply (-).',
      'Load: Power Supply (+) → Relay COM → Relay NO → Lightbulb IN → Lightbulb OUT → Power Supply (-).',
      'Relay NO closes only while the coil is energized.'
    ],
    successCriteria: (components, _wires, _nodeVoltages, isEnergized) => {
      const btn = components.find(c => c.id === 'btn1');
      const isPressed = btn?.state.pressed;

      if (isPressed && isEnergized('bulb1') && isEnergized('relay1')) {
        return { success: true };
      }
      return { 
        success: false, 
        feedback: 'The NO load path is incomplete. Check the coil circuit, then verify Power Supply (+) → COM → NO → Lightbulb → Power Supply (-).'
      };
    }
  },
  {
    id: 7,
    title: 'Relay NC Load Control',
    description: 'Use a relay NC contact to keep a light ON until the relay is energized.',
    instructions: [
      'At rest, Relay COM is connected to NC, so the load can remain powered by default.',
      'Control circuit: Power Supply (+) → Momentary Switch IN → Switch OUT → Relay A1; Relay A2 → Power Supply (-).',
      'Load circuit: Power Supply (+) → Relay COM → Relay NC → Lightbulb IN.',
      'Complete the load return: Lightbulb OUT → Power Supply (-).',
      'Test: the bulb should be ON at rest and turn OFF while the momentary switch is held.'
    ],
    goals: [
      'Complete the momentary relay-control circuit',
      'Route the lightbulb through Relay COM and NC',
      'Verify ON at rest and OFF while the switch is held'
    ],
    inventory: [],
    preplacedComponents: [
      {
        id: 'bat1',
        type: 'battery',
        x: 120,
        y: 200,
        label: '12V Battery',
        terminals: [
          { id: 'pos', name: '(+)', type: 'pos', x: -30, y: 0 },
          { id: 'neg', name: '(-)', type: 'neg', x: 30, y: 0 }
        ],
        state: {}
      },
      {
        id: 'btn1',
        type: 'button_no',
        x: 120,
        y: 380,
        label: 'Momentary Switch',
        terminals: [
          { id: 'in', name: 'IN', type: 'in', x: -30, y: 0 },
          { id: 'out', name: 'OUT', type: 'out', x: 30, y: 0 }
        ],
        state: {}
      },
      {
        id: 'relay1',
        type: 'relay',
        x: 400,
        y: 290,
        label: 'Control Relay',
        terminals: [
          { id: 'coil_a', name: 'Coil A', type: 'coil_a', x: -35, y: -30 },
          { id: 'coil_b', name: 'Coil B', type: 'coil_b', x: -35, y: 30 },
          { id: 'com', name: 'COM', type: 'com', x: 35, y: -30 },
          { id: 'nc', name: 'NC', type: 'nc', x: 35, y: 0 },
          { id: 'no', name: 'NO', type: 'no', x: 35, y: 30 }
        ],
        state: {}
      },
      {
        id: 'bulb1',
        type: 'bulb',
        x: 680,
        y: 290,
        label: 'Lightbulb',
        terminals: [
          { id: 'in', name: 'IN', type: 'in', x: -30, y: 25 },
          { id: 'out', name: 'OUT', type: 'out', x: 30, y: 25 }
        ],
        state: {}
      }
    ],
    preplacedWires: [],
    hints: [
      'Control: Power Supply (+) → Switch IN → Switch OUT → Relay A1; Relay A2 → Power Supply (-).',
      'Load: Power Supply (+) → Relay COM → Relay NC → Lightbulb IN → Lightbulb OUT → Power Supply (-).',
      'When the coil energizes, COM leaves NC and the light turns OFF.'
    ],
    successCriteria: (components, _wires, _nodeVoltages, isEnergized) => {
      const btn = components.find(c => c.id === 'btn1');
      const isPressed = btn?.state.pressed;

      if (!isPressed && isEnergized('bulb1') && !isEnergized('relay1')) {
        btn!.state.testPassedNC = true;
      }
      
      if (isPressed && !isEnergized('bulb1') && isEnergized('relay1') && btn?.state.testPassedNC) {
        return { success: true };
      }

      return { 
        success: false, 
        feedback: 'The NC load path is incomplete. Check Power Supply (+) → COM → NC → Lightbulb → Power Supply (-), then test the switch.'
      };
    }
  },
  {
    id: 8,
    title: 'Emergency-Stop Safety Loop',
    description: 'Build a fail-safe NC control loop that stops a motor immediately.',
    instructions: [
      'Emergency-stop circuits use NC contacts so a pressed switch or broken control wire removes coil power.',
      'Control circuit: PSU (+) → E-STOP IN → E-STOP OUT → START IN → START OUT → Relay A1.',
      'Complete the coil return: Relay A2 → PSU (-).',
      'Motor circuit: PSU (+) → Relay COM → Relay NO → Motor IN → Motor OUT → PSU (-).',
      'Test: hold START to run the motor, then press E-STOP. The motor must stop immediately.'
    ],
    goals: [
      'Place the NC E-STOP in series with START and the relay coil',
      'Route motor power through Relay COM and NO',
      'Verify E-STOP immediately stops the motor'
    ],
    inventory: [],
    preplacedComponents: [
      {
        id: 'ps1',
        type: 'power_supply',
        x: 120,
        y: 120,
        label: '24V PSU',
        terminals: [
          { id: 'pos', name: '(+)', type: 'pos', x: -40, y: 30 },
          { id: 'neg', name: '(-)', type: 'neg', x: 40, y: 30 }
        ],
        state: {}
      },
      {
        id: 'estop',
        type: 'button_nc',
        x: 120,
        y: 350,
        label: 'E-STOP (NC)',
        terminals: [
          { id: 'in', name: 'IN', type: 'in', x: -30, y: 0 },
          { id: 'out', name: 'OUT', type: 'out', x: 30, y: 0 }
        ],
        state: {}
      },
      {
        id: 'start',
        type: 'button_no',
        x: 350,
        y: 350,
        label: 'START (NO)',
        terminals: [
          { id: 'in', name: 'IN', type: 'in', x: -30, y: 0 },
          { id: 'out', name: 'OUT', type: 'out', x: 30, y: 0 }
        ],
        state: {}
      },
      {
        id: 'relay1',
        type: 'relay',
        x: 480,
        y: 180,
        label: 'Motor Relay',
        terminals: [
          { id: 'coil_a', name: 'Coil A', type: 'coil_a', x: -35, y: -30 },
          { id: 'coil_b', name: 'Coil B', type: 'coil_b', x: -35, y: 30 },
          { id: 'com', name: 'COM', type: 'com', x: 35, y: -30 },
          { id: 'nc', name: 'NC', type: 'nc', x: 35, y: 0 },
          { id: 'no', name: 'NO', type: 'no', x: 35, y: 30 }
        ],
        state: {}
      },
      {
        id: 'motor1',
        type: 'motor',
        x: 720,
        y: 250,
        label: 'Conveyor Motor',
        terminals: [
          { id: 'in', name: 'IN', type: 'in', x: -20, y: 35 },
          { id: 'out', name: 'OUT', type: 'out', x: 20, y: 35 }
        ],
        state: {}
      }
    ],
    preplacedWires: [],
    hints: [
      'Control: PSU (+) → E-STOP IN → E-STOP OUT → START IN → START OUT → Relay A1; Relay A2 → PSU (-).',
      'Motor: PSU (+) → Relay COM → Relay NO → Motor IN → Motor OUT → PSU (-).',
      'The E-STOP must remain in series; bypassing it defeats the safety function.'
    ],
    successCriteria: (components, _wires, _nodeVoltages, isEnergized) => {
      const estopBtn = components.find(c => c.id === 'estop');
      const startBtn = components.find(c => c.id === 'start');

      if (!estopBtn?.state.pressed && startBtn?.state.pressed && isEnergized('motor1')) {
        startBtn.state.testPassedMotor = true;
      }

      if (estopBtn?.state.pressed && !isEnergized('motor1') && startBtn?.state.testPassedMotor) {
        return { success: true };
      }

      return {
        success: false,
        feedback: 'Safety test incomplete. Hold START to run the motor, then press E-STOP and confirm the motor stops immediately.'
      };
    }
  },
  {
    id: 9,
    title: 'Fail-Safe Door Access Control',
    description: 'Power a CDVI reader and release a fail-safe maglock through a relay.',
    instructions: [
      'A fail-safe maglock is locked while powered and releases when power is removed.',
      'Reader power: PSU (+) → Reader 12V; Reader GND → PSU (-).',
      'Relay control: Reader TRIG → Relay A1; Relay A2 → PSU (-).',
      'Lock power: PSU (+) → Relay COM → Relay NC → Maglock IN; Maglock OUT → PSU (-).',
      'Test: turn on power, confirm the door is locked, then scan the reader. The relay should remove maglock power and unlock the door.'
    ],
    goals: [
      'Power the CDVI reader from the PSU',
      'Connect Reader TRIG to the relay coil',
      'Keep the maglock powered through Relay COM and NC',
      'Scan a card and release the lock'
    ],
    inventory: [],
    preplacedComponents: [
      {
        id: 'ps1',
        type: 'power_supply',
        x: 120,
        y: 120,
        label: '12V DC PSU',
        terminals: [
          { id: 'pos', name: '(+)', type: 'pos', x: -40, y: 30 },
          { id: 'neg', name: '(-)', type: 'neg', x: 40, y: 30 }
        ],
        state: {}
      },
      {
        id: 'reader1',
        type: 'card_reader',
        x: 150,
        y: 350,
        label: 'CDVI Card Reader',
        terminals: [
          { id: 'pos', name: '12V', type: 'pos', x: -30, y: 25 },
          { id: 'neg', name: 'GND', type: 'neg', x: 30, y: 25 },
          { id: 'out', name: 'TRIG', type: 'out', x: 0, y: -25 }
        ],
        state: {}
      },
      {
        id: 'relay1',
        type: 'relay',
        x: 450,
        y: 250,
        label: 'Lock Relay',
        terminals: [
          { id: 'coil_a', name: 'Coil A', type: 'coil_a', x: -35, y: -30 },
          { id: 'coil_b', name: 'Coil B', type: 'coil_b', x: -35, y: 30 },
          { id: 'com', name: 'COM', type: 'com', x: 35, y: -30 },
          { id: 'nc', name: 'NC', type: 'nc', x: 35, y: 0 },
          { id: 'no', name: 'NO', type: 'no', x: 35, y: 30 }
        ],
        state: {}
      },
      {
        id: 'lock1',
        type: 'maglock',
        x: 720,
        y: 250,
        label: 'CDVI Maglock',
        terminals: [
          { id: 'in', name: 'IN', type: 'in', x: -30, y: 15 },
          { id: 'out', name: 'OUT', type: 'out', x: 30, y: 15 }
        ],
        state: {}
      }
    ],
    preplacedWires: [],
    hints: [
      'Reader power: PSU (+) → Reader 12V; Reader GND → PSU (-).',
      'Control: Reader TRIG → Relay A1; Relay A2 → PSU (-).',
      'Lock: PSU (+) → Relay COM → Relay NC → Maglock IN; Maglock OUT → PSU (-).',
      'Click the reader panel to simulate an authorized card.'
    ],
    successCriteria: (components, _wires, _nodeVoltages, isEnergized) => {
      const reader = components.find(c => c.id === 'reader1');
      const isTriggered = reader?.state.active;

      // Lock should be energized when not triggered
      if (!isTriggered && isEnergized('lock1')) {
        reader!.state.testPassedLock = true;
      }

      // Lock should shut off when triggered
      if (isTriggered && !isEnergized('lock1') && isEnergized('relay1') && reader?.state.testPassedLock) {
        return { success: true };
      }

      return {
        success: false,
        feedback: 'Access sequence incomplete. The maglock must be powered at rest and lose power when the reader is scanned.'
      };
    }
  },
  {
    id: 10,
    title: 'Two-Way Status Light Control',
    description: 'Use a three-position momentary rocker and relay to select green or red indication.',
    instructions: [
      'The center-off rocker provides separate momentary LEFT and RIGHT outputs.',
      'Switch supply: PSU (+) → Rocker COM1.',
      'Green control: Rocker L1 → Relay A1; Relay A2 → PSU (-). Then wire PSU (+) → Relay COM1 → Relay NO1 → Green Lamp IN.',
      'Red control: Rocker R1 → Red Lamp IN.',
      'Complete both returns: Green Lamp OUT and Red Lamp OUT → PSU (-).',
      'Test: hold LEFT for green indication, release to center, then hold RIGHT for red indication.'
    ],
    goals: [
      'Supply Rocker COM1 from PSU (+)',
      'Use LEFT to energize the relay and green lamp',
      'Use RIGHT to power the red lamp directly',
      'Verify each momentary direction independently'
    ],
    inventory: [],
    preplacedComponents: [
      {
        id: 'ps1',
        type: 'power_supply',
        x: 120,
        y: 250,
        label: '24V PSU',
        terminals: [
          { id: 'pos', name: '(+)', type: 'pos', x: -40, y: 30 },
          { id: 'neg', name: '(-)', type: 'neg', x: 40, y: 30 }
        ],
        state: {}
      },
      {
        id: 'sw1',
        type: 'rocker_switch_3pos',
        x: 340,
        y: 180,
        label: '3-Pos Rocker',
        terminals: [
          { id: 'com1', name: 'COM1', type: 'com1', x: -40, y: 0 },
          { id: 'l1', name: 'L1', type: 'l1', x: -40, y: -25 },
          { id: 'r1', name: 'R1', type: 'r1', x: -40, y: 25 },
          { id: 'com2', name: 'COM2', type: 'com2', x: 40, y: 0 },
          { id: 'l2', name: 'L2', type: 'l2', x: 40, y: -25 },
          { id: 'r2', name: 'R2', type: 'r2', x: 40, y: 25 }
        ],
        state: {}
      },
      {
        id: 'relay1',
        type: 'relay_dpdt',
        x: 340,
        y: 380,
        label: 'DPDT Relay',
        terminals: [
          { id: 'coil_b', name: '-', type: 'coil_b', x: 35, y: -55 },
          { id: 'com1', name: 'C', type: 'com1', x: 12, y: -55 },
          { id: 'nc1', name: 'NC', type: 'nc1', x: -12, y: -55 },
          { id: 'no1', name: 'NO', type: 'no1', x: -35, y: -55 },
          { id: 'coil_a', name: '+', type: 'coil_a', x: 35, y: 55 },
          { id: 'com2', name: 'C', type: 'com2', x: 12, y: 55 },
          { id: 'nc2', name: 'NC', type: 'nc2', x: -12, y: 55 },
          { id: 'no2', name: 'NO', type: 'no2', x: -35, y: 55 }
        ],
        state: {}
      },
      {
        id: 'red_lamp',
        type: 'lamp_indicator',
        x: 640,
        y: 180,
        label: 'RED Lamp',
        terminals: [
          { id: 'in', name: 'IN', type: 'in', x: -20, y: 20 },
          { id: 'out', name: 'OUT', type: 'out', x: 20, y: 20 }
        ],
        state: { color: 'red' }
      },
      {
        id: 'green_lamp',
        type: 'lamp_indicator',
        x: 640,
        y: 380,
        label: 'GREEN Lamp',
        terminals: [
          { id: 'in', name: 'IN', type: 'in', x: -20, y: 20 },
          { id: 'out', name: 'OUT', type: 'out', x: 20, y: 20 }
        ],
        state: { color: 'green' }
      }
    ],
    preplacedWires: [],
    hints: [
      'Rocker supply: PSU (+) → COM1.',
      'Green coil: L1 → Relay A1; Relay A2 → PSU (-).',
      'Green load: PSU (+) → Relay COM1 → Relay NO1 → Green Lamp IN.',
      'Red load: Rocker R1 → Red Lamp IN.',
      'Returns: both Lamp OUT terminals → PSU (-).',
      'Test LEFT, release to center, then test RIGHT.'
    ],
    successCriteria: (components, _wires, _nodeVoltages, isEnergized) => {
      const sw = components.find(c => c.id === 'sw1');
      const toggled = sw?.state.toggled as any;

      if (toggled === 'left' && isEnergized('green_lamp') && !isEnergized('red_lamp')) {
        sw!.state.testPassedA = true;
      }
      if (toggled === 'right' && isEnergized('red_lamp') && !isEnergized('green_lamp')) {
        sw!.state.testPassedB = true;
      }

      if (sw?.state.testPassedA && sw?.state.testPassedB) {
        return { success: true };
      }

      return {
        success: false,
        feedback: 'Status test incomplete. LEFT must light green through the relay, and RIGHT must light red directly.'
      };
    }
  },
  {
    id: 11,
    title: 'Hot, Neutral, and Safety Ground',
    description: 'Build a simplified lighting branch with switched hot, neutral return, and protective earth.',
    instructions: [
      'This low-voltage model demonstrates the three paths used in a lighting branch: switched hot, neutral return, and protective earth (PE).',
      'Switched hot: PSU HOT → Wall Switch IN → Wall Switch LOAD → Room Light L.',
      'Neutral return: Room Light N → PSU NEU.',
      'Safety ground: Room Light PE → PSU GND using a green wire.',
      'Test: turn on power and operate the wall switch. The lamp should work only with hot, neutral, and PE correctly connected.'
    ],
    goals: [
      'Route HOT through the wall switch to the lamp',
      'Connect the lamp neutral return',
      'Connect protective earth with a green wire'
    ],
    inventory: [],
    preplacedComponents: [
      {
        id: 'ps1',
        type: 'power_supply',
        x: 120,
        y: 250,
        label: '120V AC Utility',
        terminals: [
          { id: 'pos', name: 'HOT', type: 'pos', x: -40, y: 30 },
          { id: 'neg', name: 'NEU', type: 'neg', x: 40, y: 30 },
          { id: 'gnd', name: 'GND', type: 'gnd', x: 0, y: -30 }
        ],
        state: {}
      },
      {
        id: 'sw1',
        type: 'switch_selector',
        x: 380,
        y: 250,
        label: 'Wall Switch',
        terminals: [
          { id: 'in', name: 'IN', type: 'in', x: -35, y: 0 },
          { id: 'out_a', name: 'LOAD', type: 'out_a', x: 35, y: -15 }
        ],
        state: {}
      },
      {
        id: 'bulb1',
        type: 'bulb',
        x: 650,
        y: 250,
        label: 'Room Light',
        terminals: [
          { id: 'in', name: 'L', type: 'in', x: -30, y: 25 },
          { id: 'out', name: 'N', type: 'out', x: 30, y: 25 },
          { id: 'gnd', name: 'PE', type: 'gnd', x: 0, y: -25 } // Ground terminal
        ],
        state: {}
      }
    ],
    preplacedWires: [],
    hints: [
      'Hot supply: PSU HOT → Wall Switch IN.',
      'Switched hot: Wall Switch LOAD → Room Light L.',
      'Neutral: Room Light N → PSU NEU.',
      'Protective earth: Room Light PE → PSU GND with a green wire.'
    ],
    successCriteria: (components, wires, _nodeVoltages, isEnergized) => {
      const sw = components.find(c => c.id === 'sw1');
      const hasGnd = wires.some(w => 
        (w.fromComponentId === 'bulb1' && w.fromTerminalId === 'gnd' && w.toComponentId === 'ps1' && w.toTerminalId === 'gnd') ||
        (w.fromComponentId === 'ps1' && w.fromTerminalId === 'gnd' && w.toComponentId === 'bulb1' && w.toTerminalId === 'gnd')
      );

      if (sw?.state.toggled && isEnergized('bulb1') && hasGnd) {
        return { success: true };
      }
      if (sw?.state.toggled && isEnergized('bulb1') && !hasGnd) {
        return { success: false, feedback: 'The lamp works, but protective earth is missing. Connect Room Light PE → PSU GND with a green wire.' };
      }

      return {
        success: false,
        feedback: 'Complete all three paths: switched HOT to L, N back to NEU, and PE to GND.'
      };
    }
  },
  {
    id: 12,
    title: 'Latching START/STOP Motor Control',
    description: 'Build a three-wire seal-in circuit that keeps a motor running after START is released.',
    instructions: [
      'A seal-in circuit uses a relay NO contact to keep the coil energized after the momentary START switch is released.',
      'Coil path: PSU (+) → STOP IN → STOP OUT → START IN → START OUT → Relay A1; Relay A2 → PSU (-).',
      'Seal-in branch: connect STOP OUT → Relay COM and Relay NO → Relay A1. This branch is parallel with START.',
      'Motor path: Relay NO → Motor IN; Motor OUT → PSU (-).',
      'Test: tap START and release it—the motor should remain ON. Press STOP to open the control circuit and drop the latch.'
    ],
    goals: [
      'Place NC STOP ahead of NO START in the coil circuit',
      'Connect START output to Relay A1',
      'Add the Relay COM/NO seal-in branch',
      'Verify START latches ON and STOP resets the circuit'
    ],
    inventory: [],
    preplacedComponents: [
      {
        id: 'ps1',
        type: 'power_supply',
        x: 100,
        y: 120,
        label: '24V PSU',
        terminals: [
          { id: 'pos', name: '(+)', type: 'pos', x: -40, y: 30 },
          { id: 'neg', name: '(-)', type: 'neg', x: 40, y: 30 }
        ],
        state: {}
      },
      {
        id: 'stop',
        type: 'button_nc',
        x: 280,
        y: 130,
        label: 'STOP (NC)',
        terminals: [
          { id: 'in', name: 'IN', type: 'in', x: -30, y: 0 },
          { id: 'out', name: 'OUT', type: 'out', x: 30, y: 0 }
        ],
        state: {}
      },
      {
        id: 'start',
        type: 'button_no',
        x: 280,
        y: 350,
        label: 'START (NO)',
        terminals: [
          { id: 'in', name: 'IN', type: 'in', x: -30, y: 0 },
          { id: 'out', name: 'OUT', type: 'out', x: 30, y: 0 }
        ],
        state: {}
      },
      {
        id: 'relay1',
        type: 'relay',
        x: 520,
        y: 250,
        label: 'Latching Relay',
        terminals: [
          { id: 'coil_a', name: 'Coil A', type: 'coil_a', x: -35, y: -30 },
          { id: 'coil_b', name: 'Coil B', type: 'coil_b', x: -35, y: 30 },
          { id: 'com', name: 'COM', type: 'com', x: 35, y: -30 },
          { id: 'nc', name: 'NC', type: 'nc', x: 35, y: 0 },
          { id: 'no', name: 'NO', type: 'no', x: 35, y: 30 }
        ],
        state: {}
      },
      {
        id: 'motor1',
        type: 'motor',
        x: 750,
        y: 250,
        label: 'Latching Motor',
        terminals: [
          { id: 'in', name: 'IN', type: 'in', x: -20, y: 35 },
          { id: 'out', name: 'OUT', type: 'out', x: 20, y: 35 }
        ],
        state: {}
      }
    ],
    preplacedWires: [],
    hints: [
      'Coil: PSU (+) → STOP IN → STOP OUT → START IN → START OUT → Relay A1; Relay A2 → PSU (-).',
      'Seal-in supply: STOP OUT → Relay COM.',
      'Seal-in output: Relay NO → Relay A1, parallel with START.',
      'Motor: Relay NO → Motor IN; Motor OUT → PSU (-).',
      'Turn on power, tap START, release it, then press STOP.'
    ],
    successCriteria: (components, _wires, _nodeVoltages, isEnergized) => {
      const startBtn = components.find(c => c.id === 'start');
      const stopBtn = components.find(c => c.id === 'stop');

      // Detect if latching works:
      // If start is released, but relay is still energized, and motor is running:
      if (!startBtn?.state.pressed && !stopBtn?.state.pressed && isEnergized('motor1') && isEnergized('relay1')) {
        startBtn!.state.testPassedLatch = true;
      }

      // If stop is pressed, and motor turns off:
      if (stopBtn?.state.pressed && !isEnergized('motor1') && startBtn?.state.testPassedLatch) {
        return { success: true };
      }

      return {
        success: false,
        feedback: 'The seal-in test failed. Relay COM/NO must bypass START after pickup, and STOP must remain in series to drop the latch.'
      };
    }
  },
  {
    id: 13,
    title: 'Delayed-Start Cooling Fan',
    description: 'Use a timer relay to start a cooling fan two seconds after the control switch turns ON.',
    instructions: [
      'An on-delay timer waits for its preset time before transferring the output contact.',
      'Power supply input: Transformer (+) → PSU AC1, and Transformer (-) → PSU AC2.',
      'Power the 6062 continuously: PSU (+) → Timer (+), and Timer (-) → PSU (-).',
      'Trigger control: PSU (+) → Main Switch IN → Main Switch A → Timer TRIG.',
      'Fan supply: PSU (+) → Timer C → Timer NO → Cooling Fan IN.',
      'Complete the fan return: Cooling Fan OUT → PSU (-).',
      'Test: turn on power and select A on the Main Switch. After two seconds, the timer should close NO and start the fan.'
    ],
    goals: [
      'Feed the power supply from the transformer',
      'Use the Main Switch to energize Timer TRIG',
      'Route fan power through Timer C and NO',
      'Verify the fan starts after the two-second delay'
    ],
    inventory: [],
    preplacedComponents: [
      {
        id: 'smps',
        type: 'transformer',
        x: 120,
        y: 145,
        label: 'AC/AC Transformer',
        terminals: [
          { id: 'pos', name: '(+)', type: 'pos', x: -20, y: 35 },
          { id: 'neg', name: '(-)', type: 'neg', x: 20, y: 35 }
        ],
        state: { lockedPosition: true }
      },
      {
        id: 'ps1',
        type: 'power_supply',
        x: 120,
        y: 335,
        label: '24V DC PSU',
        terminals: [
          { id: 'pos', name: '(+)', type: 'pos', x: -40, y: 30 },
          { id: 'neg', name: '(-)', type: 'neg', x: 40, y: 30 }
        ],
        state: { requireAcInput: true, outputVoltage: 24, lockedPosition: true }
      },
      {
        id: 'switch1',
        type: 'switch_selector',
        x: 315,
        y: 350,
        label: 'Main Switch',
        terminals: [
          { id: 'in', name: 'IN', type: 'in', x: -30, y: 0 },
          { id: 'out_a', name: 'A', type: 'out_a', x: 30, y: -20 },
          { id: 'out_b', name: 'B', type: 'out_b', x: 30, y: 20 }
        ],
        state: {}
      },
      {
        id: 'timer1',
        type: 'timer_relay',
        x: 450,
        y: 250,
        label: 'Delay Timer',
        terminals: [
          { id: 'coil_a', name: 'TRIG', type: 'coil_a', x: -40, y: 40 },
          { id: 'coil_b', name: '-', type: 'coil_b', x: -24, y: 40 },
          { id: 'pos_dummy', name: '+', type: 'pos', x: -8, y: 40 },
          { id: 'no', name: 'NO', type: 'no', x: 8, y: 40 },
          { id: 'com', name: 'C', type: 'com', x: 24, y: 40 },
          { id: 'nc', name: 'NC', type: 'nc', x: 40, y: 40 }
        ],
        state: {}
      },
      {
        id: 'motor1',
        type: 'motor',
        x: 750,
        y: 250,
        label: 'Cooling Fan',
        terminals: [
          { id: 'in', name: 'IN', type: 'in', x: -20, y: 35 },
          { id: 'out', name: 'OUT', type: 'out', x: 20, y: 35 }
        ],
        state: {}
      }
    ],
    preplacedWires: [],
    hints: [
      'AC input: Transformer (+) → PSU AC1 and Transformer (-) → PSU AC2. Then power the 6062 from PSU (+)/(−).',
      'Trigger: PSU (+) → Switch IN → Switch A → Timer TRIG.',
      'Fan load: PSU (+) → Timer C → Timer NO → Fan IN → Fan OUT → PSU (-).',
      'Keep the switch ON for the full two-second countdown.'
    ],
    successCriteria: (components, _wires, _nodeVoltages, isEnergized) => {
      const timer = components.find(c => c.id === 'timer1');
      
      if (timer?.state.delayedActive && isEnergized('motor1')) {
        return { success: true };
      }

      if (isEnergized('timer1') && !timer?.state.delayedActive) {
        return {
          success: false,
          feedback: 'The 6062 has power. Keep the Main Switch trigger ON until the two-second countdown finishes.'
        };
      }

      return {
        success: false,
        feedback: 'The delayed-start circuit is incomplete. Verify constant power at Timer (+)/(−), then check the TRIG path and C/NO fan load path.'
      };
    }
  },
  {
    id: 14,
    title: 'Elevator Upper-Limit Safety',
    description: 'Place an NC travel limit in series with an elevator motor so upward motion stops automatically.',
    instructions: [
      'The top limit is NC during travel and opens when the cabin reaches the upper endpoint.',
      'Supply path: PSU (+) → UP Switch IN → UP Switch OUT → Top Limit IN.',
      'Motor path: Top Limit OUT → Elevator POS; Elevator NEG → PSU (-).',
      'Test: turn on power and hold UP. The cabin should rise to the second floor, operate the limit, and stop automatically.'
    ],
    goals: [
      'Place the NC Top Limit after the UP switch',
      'Complete the elevator motor supply and return paths',
      'Verify the cabin stops automatically at the upper limit'
    ],
    inventory: [],
    preplacedComponents: [
      {
        id: 'ps1',
        type: 'power_supply',
        x: 120,
        y: 120,
        label: '24V DC PSU',
        terminals: [
          { id: 'pos', name: '(+)', type: 'pos', x: -40, y: 30 },
          { id: 'neg', name: '(-)', type: 'neg', x: 40, y: 30 }
        ],
        state: {}
      },
      {
        id: 'up_btn',
        type: 'button_no',
        x: 120,
        y: 350,
        label: 'UP Button',
        terminals: [
          { id: 'in', name: 'IN', type: 'in', x: -30, y: 0 },
          { id: 'out', name: 'OUT', type: 'out', x: 30, y: 0 }
        ],
        state: {}
      },
      {
        id: 'limit_top',
        type: 'limit_switch',
        x: 480,
        y: 120,
        label: 'Top Limit Switch',
        terminals: [
          { id: 'in', name: 'IN', type: 'in', x: -30, y: 0 },
          { id: 'out', name: 'OUT', type: 'out', x: 30, y: 0 }
        ],
        state: {}
      },
      {
        id: 'elevator',
        type: 'elevator_motor',
        x: 750,
        y: 250,
        label: 'Elevator Hoist',
        terminals: [
          { id: 'pos', name: 'POS', type: 'pos', x: -30, y: 77 },
          { id: 'neg', name: 'NEG', type: 'neg', x: 30, y: 77 }
        ],
        state: {}
      }
    ],
    preplacedWires: [],
    hints: [
      'Safety path: PSU (+) → UP IN → UP OUT → Top Limit IN → Top Limit OUT → Elevator POS.',
      'Return path: Elevator NEG → PSU (-).',
      'Hold UP until the cabin reaches 2F and the NC limit opens.'
    ],
    successCriteria: (components, _wires, _nodeVoltages, isEnergized) => {
      const elevator = components.find(c => c.id === 'elevator');
      const limit = components.find(c => c.id === 'limit_top');
      const upBtn = components.find(c => c.id === 'up_btn');

      if (elevator && elevator.state.travel >= 100 && limit?.state.pressed) {
        if (!isEnergized('elevator')) {
          return { success: true };
        }
      }

      if (elevator && elevator.state.travel > 0 && elevator.state.travel < 100 && !upBtn?.state.pressed) {
        return {
          success: false,
          feedback: 'The motor is running. Continue holding UP until the cabin reaches 2F and operates the top limit.'
        };
      }

      return {
        success: false,
        feedback: 'The safety path is incomplete. Wire PSU (+) → UP → Top Limit → Elevator POS, then Elevator NEG → PSU (-).'
      };
    }
  },
  {
    id: 15,
    title: 'Two-Relay Actuator Reversing',
    description: 'Use two SPDT relays to reverse actuator polarity for extend and retract movement.',
    instructions: [
      'The two relay poles form a reversing circuit: each relay controls one actuator lead.',
      'Coil controls: PSU (+) → both switch IN terminals. EXTEND OUT → Relay 1 A1; RETRACT OUT → Relay 2 A1. Both relay A2 terminals → PSU (-).',
      'Actuator leads: Relay 1 COM → Actuator POS; Relay 2 COM → Actuator NEG.',
      'Idle/negative paths: both relay NC contacts → PSU (-). Positive paths: both relay NO contacts → PSU (+).',
      'Test: hold EXTEND to reach 100%, then hold RETRACT to return to 0%.'
    ],
    goals: [
      'Control each relay coil with its own momentary switch',
      'Connect Relay COM terminals to the two actuator leads',
      'Connect both NC contacts to negative and both NO contacts to positive',
      'Complete one full extend-and-retract cycle'
    ],
    inventory: [],
    preplacedComponents: [
      {
        id: 'ps1',
        type: 'power_supply',
        x: 120,
        y: 80,
        label: '24V DC PSU',
        terminals: [
          { id: 'pos', name: '(+)', type: 'pos', x: -40, y: 30 },
          { id: 'neg', name: '(-)', type: 'neg', x: 40, y: 30 }
        ],
        state: {}
      },
      {
        id: 'btn_ext',
        type: 'button_no',
        x: 120,
        y: 220,
        label: 'EXTEND',
        terminals: [
          { id: 'in', name: 'IN', type: 'in', x: -30, y: 0 },
          { id: 'out', name: 'OUT', type: 'out', x: 30, y: 0 }
        ],
        state: {}
      },
      {
        id: 'btn_ret',
        type: 'button_no',
        x: 120,
        y: 360,
        label: 'RETRACT',
        terminals: [
          { id: 'in', name: 'IN', type: 'in', x: -30, y: 0 },
          { id: 'out', name: 'OUT', type: 'out', x: 30, y: 0 }
        ],
        state: {}
      },
      {
        id: 'relay1',
        type: 'relay',
        x: 420,
        y: 180,
        label: 'Relay 1 (EXT)',
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
        id: 'relay2',
        type: 'relay',
        x: 420,
        y: 340,
        label: 'Relay 2 (RET)',
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
        id: 'actuator1',
        type: 'actuator',
        x: 750,
        y: 260,
        label: 'Linear Actuator',
        terminals: [
          { id: 'pos', name: 'POS', type: 'pos', x: -30, y: 35 },
          { id: 'neg', name: 'NEG', type: 'neg', x: 30, y: 35 }
        ],
        state: {}
      }
    ],
    preplacedWires: [],
    hints: [
      'Switch supply: PSU (+) → EXTEND IN and RETRACT IN.',
      'Coils: EXTEND OUT → Relay 1 A1; RETRACT OUT → Relay 2 A1; both A2 terminals → PSU (-).',
      'Actuator: Relay 1 COM → Actuator POS; Relay 2 COM → Actuator NEG.',
      'Negative paths: Relay 1 NC and Relay 2 NC → PSU (-).',
      'Positive paths: Relay 1 NO and Relay 2 NO → PSU (+).',
      'Test EXTEND to 100%, then RETRACT to 0%.'
    ],
    successCriteria: (components, _wires, _nodeVoltages, _isEnergized) => {
      const actuator = components.find(c => c.id === 'actuator1');

      if (actuator) {
        if (actuator.state.travel >= 95) {
          actuator.state.testPassedExtend = true;
        }
        if (actuator.state.travel <= 5 && actuator.state.testPassedExtend) {
          return { success: true };
        }
      }

      if (actuator?.state.testPassedExtend) {
        return {
          success: false,
          feedback: 'Extension is verified. Hold RETRACT until the actuator returns to 0%.'
        };
      }

      return {
        success: false,
        feedback: 'The reversing circuit is incomplete. Check switch power, both relay coils, COM-to-actuator leads, NC-to-negative, and NO-to-positive.'
      };
    }
  },
  {
    id: 16,
    title: 'Altronix Access-Control Power',
    description: 'Feed an Altronix board from an AC/AC transformer, then power a reader-controlled fail-safe lock.',
    instructions: [
      'The transformer is already connected to wall power and provides low-voltage AC for the Altronix board.',
      'Board input: Transformer (+) → Altronix AC1; Transformer (-) → Altronix AC2.',
      'Reader power: Altronix (+) → CDVI Reader 12V; Reader GND → Altronix (-).',
      'Relay control: Reader TRIG → Isolation Relay A1; Relay A2 → Altronix (-).',
      'Lock power: Altronix (+) → Relay COM → Relay NC → Maglock IN; Maglock OUT → Altronix (-).',
      'Test: turn on System Power, confirm the lock is secure, then scan the reader to release it.'
    ],
    goals: [
      'Connect both transformer outputs to Altronix AC1 and AC2',
      'Power the CDVI reader from the Altronix DC output',
      'Control the relay from Reader TRIG',
      'Keep the maglock powered through Relay COM and NC',
      'Scan a card and release the lock'
    ],
    inventory: [],
    preplacedComponents: [
      {
        id: 'smps',
        type: 'transformer',
        x: 80,
        y: 120,
        label: 'AC/AC Transformer',
        terminals: [
          { id: 'pos', name: '(+)', type: 'pos', x: -20, y: 35 },
          { id: 'neg', name: '(-)', type: 'neg', x: 20, y: 35 }
        ],
        state: {}
      },
      {
        id: 'psu1',
        type: 'power_supply',
        x: 80,
        y: 300,
        label: 'Altronix Board',
        terminals: [
          { id: 'ac1', name: 'AC', type: 'in', x: -45, y: 35 },
          { id: 'ac2', name: 'AC', type: 'in', x: -15, y: 35 },
          { id: 'pos', name: '(+)', type: 'pos', x: 15, y: 35 },
          { id: 'neg', name: '(-)', type: 'neg', x: 45, y: 35 }
        ],
        state: {}
      },
      {
        id: 'reader1',
        type: 'card_reader',
        x: 300,
        y: 300,
        label: 'CDVI Reader',
        terminals: [
          { id: 'pos', name: '12V', type: 'pos', x: -30, y: 25 },
          { id: 'neg', name: 'GND', type: 'neg', x: 30, y: 25 },
          { id: 'out', name: 'TRIG', type: 'out', x: 0, y: -25 }
        ],
        state: {}
      },
      {
        id: 'relay1',
        type: 'relay',
        x: 300,
        y: 120,
        label: 'Isolation Relay',
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
        id: 'lock1',
        type: 'maglock',
        x: 520,
        y: 210,
        label: 'CDVI Maglock',
        terminals: [
          { id: 'in', name: 'IN', type: 'in', x: -30, y: 15 },
          { id: 'out', name: 'OUT', type: 'out', x: 30, y: 15 }
        ],
        state: {}
      }
    ],
    preplacedWires: [],
    hints: [
      'Board input: Transformer (+) → Altronix AC1; Transformer (-) → Altronix AC2.',
      'Reader power: Altronix (+) → Reader 12V; Reader GND → Altronix (-).',
      'Control: Reader TRIG → Relay A1; Relay A2 → Altronix (-).',
      'Lock: Altronix (+) → Relay COM → Relay NC → Maglock IN; Maglock OUT → Altronix (-).',
      'Click the reader panel to simulate an authorized card.'
    ],
    successCriteria: (components, _wires, _nodeVoltages, isEnergized) => {
      const reader = components.find(c => c.id === 'reader1');
      const isTriggered = reader?.state.active;

      if (!isTriggered && isEnergized('lock1')) {
        reader!.state.testPassedLock = true;
      }

      if (isTriggered && !isEnergized('lock1') && isEnergized('relay1') && reader?.state.testPassedLock) {
        return { success: true };
      }

      return {
        success: false,
        feedback: 'The access sequence is incomplete. The maglock must be powered at rest and lose power when the CDVI reader is scanned.'
      };
    }
  },
  {
    id: 17,
    title: 'Relay-Controlled Cooling Fan',
    description: 'Use an isolation relay and momentary switch to run Roland’s cap-mounted fan.',
    instructions: [
      'Use the relay coil to isolate the fan load from the momentary control switch.',
      'Control circuit: PSU (+) → Momentary Switch IN → Switch OUT → Relay A1; Relay A2 → PSU (-).',
      'Fan circuit: PSU (+) → Relay COM → Relay NO → Roland Fan IN; Roland Fan OUT → PSU (-).',
      'Test: turn on power and hold the momentary switch. The relay and cap fan should run only while the switch is held.'
    ],
    goals: [
      'Wire the momentary switch to Relay A1',
      'Route fan power through Relay COM and NO',
      'Hold the switch and run Roland’s fan'
    ],
    inventory: [],
    preplacedComponents: [
      {
        id: 'ps1',
        type: 'power_supply',
        x: 120,
        y: 280,
        label: '24V Power Supply',
        terminals: [
          { id: 'pos', name: '(+)', type: 'pos', x: -25, y: 15 },
          { id: 'neg', name: '(-)', type: 'neg', x: 25, y: 15 }
        ],
        state: {}
      },
      {
        id: 'btn1',
        type: 'button_no',
        x: 300,
        y: 150,
        label: 'Push Button',
        terminals: [
          { id: 'in', name: 'IN', type: 'in', x: -30, y: 0 },
          { id: 'out', name: 'OUT', type: 'out', x: 30, y: 0 }
        ],
        state: {}
      },
      {
        id: 'relay1',
        type: 'relay',
        x: 420,
        y: 350,
        label: 'Isolation Relay',
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
        id: 'roland1',
        type: 'roland_fan',
        x: 720,
        y: 240,
        label: 'Relay Master Roland',
        terminals: [
          { id: 'in', name: 'IN', type: 'in', x: -32, y: 68 },
          { id: 'out', name: 'OUT', type: 'out', x: 32, y: 68 }
        ],
        state: {}
      }
    ],
    preplacedWires: [],
    hints: [
      'Control: PSU (+) → Switch IN → Switch OUT → Relay A1; Relay A2 → PSU (-).',
      'Fan load: PSU (+) → Relay COM → Relay NO → Fan IN → Fan OUT → PSU (-).',
      'Turn on power, then press and hold the momentary switch.'
    ],
    successCriteria: (components, _wires, _nodeVoltages, isEnergized) => {
      const btn = components.find(c => c.id === 'btn1');
      if (btn?.state.pressed && isEnergized('roland1')) {
        return { success: true };
      }
      if (!btn?.state.pressed && isEnergized('roland1')) {
        return { success: false, feedback: 'The fan runs while the switch is released. The relay contact or switch has been bypassed.' };
      }
      return { success: false, feedback: 'Turn on System Power and hold the momentary switch to test the relay-controlled fan.' };
    }
  },
  {
    id: 18,
    title: 'Automatic Parking Gate',
    description: 'Use a card reader, loop detector, and two timed relay branches to raise and lower a barrier.',
    instructions: [
      'The OPEN and CLOSE branches each use a relay and 6062 timer to hold movement for a limited time.',
      'OPEN timer power: connect Open Timer (+) to PSU (+) and Timer (-) to PSU (-). Then power the reader and connect Reader TRIG to Open Relay A1 and Open Timer TRIG; return Open Relay A2 to PSU (-).',
      'OPEN latch: PSU (+) → Open Timer C → Timer NC → Open Relay COM. Connect Open Relay NO to Open Relay A1 and Gate POS.',
      'CLOSE timer power: connect Close Timer (+) to PSU (+) and Timer (-) to PSU (-). Then PSU (+) → Loop Detector IN; Detector OUT → Close Relay A1 and Close Timer TRIG; return Close Relay A2 to PSU (-).',
      'CLOSE latch: PSU (+) → Close Timer C → Timer NC → Close Relay COM. Connect Close Relay NO to Close Relay A1 and Gate NEG.',
      'Test: scan the reader to raise the barrier fully, then activate the loop detector to lower it fully.'
    ],
    goals: [
      'Use Reader TRIG to start the OPEN relay and timer',
      'Hold the OPEN branch through the timer NC contact',
      'Use the loop detector to start the CLOSE relay and timer',
      'Hold the CLOSE branch through the timer NC contact',
      'Complete one raise-and-lower cycle'
    ],
    inventory: [],
    preplacedComponents: [
      {
        id: 'ps1',
        type: 'power_supply',
        x: 100,
        y: 250,
        label: '24V Power Supply',
        terminals: [
          { id: 'pos', name: '(+)', type: 'pos', x: -25, y: 15 },
          { id: 'neg', name: '(-)', type: 'neg', x: 25, y: 15 }
        ],
        state: { transformerPosition: { x: 260, y: 250 } }
      },
      {
        id: 'reader1',
        type: 'card_reader',
        x: 260,
        y: 90,
        label: 'CDVI Reader',
        terminals: [
          { id: 'pos', name: '12V', type: 'pos', x: -30, y: 25 },
          { id: 'neg', name: 'GND', type: 'neg', x: 30, y: 25 },
          { id: 'out', name: 'TRIG', type: 'out', x: 0, y: -25 }
        ],
        state: {}
      },
      {
        id: 'btn2',
        type: 'button_no',
        x: 260,
        y: 380,
        label: 'Loop Detector',
        terminals: [
          { id: 'in', name: 'IN', type: 'in', x: -30, y: 0 },
          { id: 'out', name: 'OUT', type: 'out', x: 30, y: 0 }
        ],
        state: {}
      },
      {
        id: 'timer_open',
        type: 'timer_relay',
        x: 430,
        y: 150,
        label: 'Open 6062 Timer',
        terminals: [
          { id: 'coil_a', name: 'TRIG', type: 'coil_a', x: -40, y: 40 },
          { id: 'coil_b', name: '-', type: 'coil_b', x: -24, y: 40 },
          { id: 'pos_dummy', name: '+', type: 'pos', x: -8, y: 40 },
          { id: 'no', name: 'NO', type: 'no', x: 8, y: 40 },
          { id: 'com', name: 'C', type: 'com', x: 24, y: 40 },
          { id: 'nc', name: 'NC', type: 'nc', x: 40, y: 40 }
        ],
        state: {}
      },
      {
        id: 'timer_close',
        type: 'timer_relay',
        x: 430,
        y: 350,
        label: 'Close 6062 Timer',
        terminals: [
          { id: 'coil_a', name: 'TRIG', type: 'coil_a', x: -40, y: 40 },
          { id: 'coil_b', name: '-', type: 'coil_b', x: -24, y: 40 },
          { id: 'pos_dummy', name: '+', type: 'pos', x: -8, y: 40 },
          { id: 'no', name: 'NO', type: 'no', x: 8, y: 40 },
          { id: 'com', name: 'C', type: 'com', x: 24, y: 40 },
          { id: 'nc', name: 'NC', type: 'nc', x: 40, y: 40 }
        ],
        state: {}
      },
      {
        id: 'relay_open',
        type: 'relay',
        x: 600,
        y: 150,
        label: 'Open Relay',
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
        id: 'relay_close',
        type: 'relay',
        x: 600,
        y: 350,
        label: 'Close Relay',
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
        id: 'act1',
        type: 'parking_gate',
        x: 780,
        y: 250,
        label: 'Parking Gate',
        terminals: [
          { id: 'pos', name: 'POS', type: 'pos', x: -10, y: 40 },
          { id: 'neg', name: 'NEG', type: 'neg', x: 22, y: 40 }
        ],
        state: {}
      }
    ],
    preplacedWires: [],
    hints: [
      'OPEN: PSU (+) → Open Timer (+); Timer (-) → PSU (-). Power the reader; Reader TRIG → Open Relay A1 and Open Timer TRIG; Relay A2 → PSU (-).',
      'OPEN latch: PSU (+) → Open Timer C → Timer NC → Open Relay COM; Relay NO → Relay A1 and Gate POS.',
      'CLOSE: PSU (+) → Close Timer (+) and Detector IN; Timer (-) → PSU (-). Detector OUT → Close Relay A1 and Close Timer TRIG; Relay A2 → PSU (-).',
      'CLOSE latch: PSU (+) → Close Timer C → Timer NC → Close Relay COM; Relay NO → Relay A1 and Gate NEG.'
    ],
    successCriteria: (components, _wires, _nodeVoltages, _isEnergized) => {
      const act = components.find(c => c.id === 'act1');
      const travel = act?.state.travel || 0;
      
      if (travel >= 100) {
        act!.state.reachedTop = true;
      }
      
      if (act?.state.reachedTop && travel <= 0) {
        return { success: true };
      }
      
      return {
        success: false,
        feedback: 'The gate cycle is incomplete. Verify both timed latch branches, then scan to raise and activate the detector to lower.'
      };
    }
  },
  {
    id: 19,
    title: 'Smart Parking Barrier',
    description: 'Wire the Delmi gate cabinet for timed card-entry opening and loop-triggered closing.',
    instructions: [
      'This project applies the same OPEN/CLOSE logic to the integrated Delmi parking cabinet.',
      'OPEN timer power: connect Open Timer (+) to PSU (+) and Timer (-) to PSU (-). Then power the reader, connect Reader TRIG to Open Relay A1 and Open Timer TRIG, and return Open Relay A2 to PSU (-).',
      'OPEN latch: PSU (+) → Open Timer COM → Timer NC → Open Relay COM. Connect Relay NO to Relay A1 and Gate POS.',
      'CLOSE timer power: connect Close Timer (+) to PSU (+) and Timer (-) to PSU (-). Then PSU (+) → Loop Detector IN; Detector OUT → Close Relay A1 and Close Timer TRIG; return Close Relay A2 to PSU (-).',
      'CLOSE latch: PSU (+) → Close Timer COM → Timer NC → Close Relay COM. Connect Relay NO to Relay A1 and Gate NEG.',
      'Test: scan the reader to open the barrier, then activate the loop detector to close it.'
    ],
    goals: [
      'Trigger the OPEN relay and timer from the reader',
      'Latch OPEN through the timer NC contact',
      'Trigger the CLOSE relay and timer from the loop detector',
      'Latch CLOSE through the timer NC contact',
      'Verify a complete open-and-close cycle'
    ],
    inventory: [],
    preplacedComponents: [
      {
        id: 'ps1',
        type: 'power_supply',
        x: 100,
        y: 250,
        label: '24V Power Supply',
        terminals: [
          { id: 'pos', name: '(+)', type: 'pos', x: -25, y: 15 },
          { id: 'neg', name: '(-)', type: 'neg', x: 25, y: 15 }
        ],
        state: { transformerPosition: { x: 260, y: 250 } }
      },
      {
        id: 'reader1',
        type: 'card_reader',
        x: 260,
        y: 90,
        label: 'CDVI Reader',
        terminals: [
          { id: 'pos', name: '12V', type: 'pos', x: -30, y: 25 },
          { id: 'neg', name: 'GND', type: 'neg', x: 30, y: 25 },
          { id: 'out', name: 'TRIG', type: 'out', x: 0, y: -25 }
        ],
        state: {}
      },
      {
        id: 'btn2',
        type: 'button_no',
        x: 260,
        y: 380,
        label: 'Loop Detector',
        terminals: [
          { id: 'in', name: 'IN', type: 'in', x: -30, y: 0 },
          { id: 'out', name: 'OUT', type: 'out', x: 30, y: 0 }
        ],
        state: {}
      },
      {
        id: 'timer_open',
        type: 'timer_relay',
        x: 430,
        y: 150,
        label: 'Open Timer',
        terminals: [
          { id: 'coil_a', name: 'TRIG', type: 'coil_a', x: -40, y: 40 },
          { id: 'coil_b', name: '-', type: 'coil_b', x: -24, y: 40 },
          { id: 'pos_dummy', name: '+', type: 'pos', x: -8, y: 40 },
          { id: 'no', name: 'NO', type: 'no', x: 8, y: 40 },
          { id: 'com', name: 'C', type: 'com', x: 24, y: 40 },
          { id: 'nc', name: 'NC', type: 'nc', x: 40, y: 40 }
        ],
        state: {}
      },
      {
        id: 'timer_close',
        type: 'timer_relay',
        x: 430,
        y: 350,
        label: 'Close Timer',
        terminals: [
          { id: 'coil_a', name: 'TRIG', type: 'coil_a', x: -40, y: 40 },
          { id: 'coil_b', name: '-', type: 'coil_b', x: -24, y: 40 },
          { id: 'pos_dummy', name: '+', type: 'pos', x: -8, y: 40 },
          { id: 'no', name: 'NO', type: 'no', x: 8, y: 40 },
          { id: 'com', name: 'C', type: 'com', x: 24, y: 40 },
          { id: 'nc', name: 'NC', type: 'nc', x: 40, y: 40 }
        ],
        state: {}
      },
      {
        id: 'relay_open',
        type: 'relay',
        x: 600,
        y: 150,
        label: 'Open Relay',
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
        id: 'relay_close',
        type: 'relay',
        x: 600,
        y: 350,
        label: 'Close Relay',
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
        id: 'act1',
        type: 'parking_gate',
        x: 780,
        y: 250,
        label: 'Delmi Smart Gate',
        terminals: [
          { id: 'pos', name: 'POS', type: 'pos', x: -10, y: 40 },
          { id: 'neg', name: 'NEG', type: 'neg', x: 22, y: 40 }
        ],
        state: {}
      }
    ],
    preplacedWires: [],
    hints: [
      'OPEN: PSU (+) → Open Timer (+); Timer (-) → PSU (-). Power the reader; Reader TRIG → Open Relay A1 and Timer TRIG; Relay A2 → PSU (-).',
      'OPEN latch: PSU (+) → Open Timer COM → Timer NC → Open Relay COM; Relay NO → Relay A1 and Gate POS.',
      'CLOSE: PSU (+) → Close Timer (+) and Detector IN; Timer (-) → PSU (-). Detector OUT → Close Relay A1 and Timer TRIG; Relay A2 → PSU (-).',
      'CLOSE latch: PSU (+) → Close Timer COM → Timer NC → Close Relay COM; Relay NO → Relay A1 and Gate NEG.'
    ],
    successCriteria: (components, _wires, _nodeVoltages, _isEnergized) => {
      const act = components.find(c => c.id === 'act1');
      const travel = act?.state.travel || 0;
      
      if (travel >= 100) {
        act!.state.reachedTop = true;
      }
      
      if (act?.state.reachedTop && travel <= 0) {
        return { success: true };
      }
      
      return {
        success: false,
        feedback: 'The barrier cycle is incomplete. Check both trigger and timer-latch branches, then test reader OPEN followed by detector CLOSE.'
      };
    }
  },
  {
    id: 20,
    title: 'Altronix Door and Alarm Logic',
    description: 'Combine momentary release, maintained override, status lights, a fail-secure lock, and an alarm output.',
    instructions: [
      'Board input: Transformer (+) → Altronix AC1; Transformer (-) → Altronix AC2.',
      'Momentary control: Altronix (+) → Momentary COM → Momentary NO → Relay A1; Relay A2 → Altronix (-).',
      'Status pole: Altronix (+) → Relay C1; Relay NC1 → Red LED (+); Relay NO1 → Green LED (+). Return both LED (-) terminals to Altronix (-).',
      'Door pole: Altronix (+) → Relay NO2; Relay C2 → Fail-Secure Lock (+); Lock (-) → Altronix (-). The lock unlocks only while powered.',
      'Override/alarm: Altronix (+) → Maintained COM → Maintained NO → Relay C2. Connect Relay NO2 → Siren (+); Siren (-) → Altronix (-).',
      'Test normal mode: leave the maintained switch at NC and hold the momentary switch. Green should turn ON and the lock should unlock.',
      'Test override mode: toggle the maintained switch to NO and hold the momentary switch. Green and the siren should turn ON while the lock stays secure.'
    ],
    goals: [
      'Energize the Altronix board from the transformer',
      'Trigger the DPDT relay from the momentary switch',
      'Show red at rest and green while the relay is active',
      'Power the fail-secure lock only in normal release mode',
      'Use the maintained override to select the siren path'
    ],
    inventory: [],
    preplacedComponents: [
      {
        id: 'smps',
        type: 'transformer',
        x: 90,
        y: 145,
        label: 'AC/AC Transformer',
        terminals: [
          { id: 'pos', name: '(+)', type: 'pos', x: -20, y: 35 },
          { id: 'neg', name: '(-)', type: 'neg', x: 20, y: 35 }
        ],
        state: {}
      },
      {
        id: 'ps1',
        type: 'power_supply',
        x: -20,
        y: 325,
        label: 'Altronix Board',
        terminals: [
          { id: 'ac1', name: 'AC', type: 'in', x: -45, y: 35 },
          { id: 'ac2', name: 'AC', type: 'in', x: -15, y: 35 },
          { id: 'pos', name: '(+)', type: 'pos', x: 15, y: 35 },
          { id: 'neg', name: '(-)', type: 'neg', x: 45, y: 35 }
        ],
        state: {}
      },
      {
        id: 'btn_momentary',
        type: 'button_no',
        x: 300,
        y: 120,
        label: 'Momentary Switch',
        terminals: [
          { id: 'com', name: 'C', type: 'com', x: -30, y: 15 },
          { id: 'nc', name: 'NC', type: 'nc', x: 0, y: -25 },
          { id: 'no', name: 'NO', type: 'no', x: 30, y: 15 }
        ],
        state: {}
      },
      {
        id: 'sw_maintained',
        type: 'rocker_switch_2pos',
        x: 300,
        y: 280,
        label: 'Maintained Switch',
        terminals: [
          { id: 'com', name: 'C', type: 'in', x: -30, y: 0 },
          { id: 'nc', name: 'NC', type: 'out_a', x: 30, y: -20 },
          { id: 'no', name: 'NO', type: 'out_b', x: 30, y: 20 }
        ],
        state: {}
      },
      {
        id: 'relay1',
        type: 'relay_dpdt',
        x: 300,
        y: 440,
        label: 'Altronix Relay',
        terminals: [
          { id: 'coil_b', name: '-', type: 'coil_b', x: 35, y: -55 },
          { id: 'com1', name: 'C', type: 'com1', x: 12, y: -55 },
          { id: 'nc1', name: 'NC', type: 'nc1', x: -12, y: -55 },
          { id: 'no1', name: 'NO', type: 'no1', x: -35, y: -55 },
          { id: 'coil_a', name: '+', type: 'coil_a', x: 35, y: 55 },
          { id: 'com2', name: 'C', type: 'com2', x: 12, y: 55 },
          { id: 'nc2', name: 'NC', type: 'nc2', x: -12, y: 55 },
          { id: 'no2', name: 'NO', type: 'no2', x: -35, y: 55 }
        ],
        state: {}
      },
      {
        id: 'led_red',
        type: 'led_strip',
        x: 560,
        y: 120,
        label: 'Red Status LED',
        terminals: [
          { id: 'in', name: '+', type: 'in', x: -50, y: 0 },
          { id: 'out', name: '-', type: 'out', x: 50, y: 0 }
        ],
        state: { color: 'red' }
      },
      {
        id: 'led_green',
        type: 'led_strip',
        x: 560,
        y: 220,
        label: 'Green Status LED',
        terminals: [
          { id: 'in', name: '+', type: 'in', x: -50, y: 0 },
          { id: 'out', name: '-', type: 'out', x: 50, y: 0 }
        ],
        state: { color: 'green' }
      },
      {
        id: 'lock1',
        type: 'maglock',
        x: 560,
        y: 340,
        label: 'Fail-Secure Lock',
        terminals: [
          { id: 'in', name: '+', type: 'in', x: -70, y: 10 },
          { id: 'out', name: '-', type: 'out', x: 70, y: 10 }
        ],
        state: { failSecure: true }
      },
      {
        id: 'siren1',
        type: 'buzzer',
        x: 560,
        y: 450,
        label: 'Siren',
        terminals: [
          { id: 'in', name: '+', type: 'in', x: -50, y: 15 },
          { id: 'out', name: '-', type: 'out', x: 50, y: 15 }
        ],
        state: {}
      }
    ],
    preplacedWires: [],
    hints: [
      'Board input: Transformer (+) → Altronix AC1; Transformer (-) → Altronix AC2.',
      'Momentary control: Altronix (+) → Momentary COM → NO → Relay A1; Relay A2 → Altronix (-).',
      'Indicators: Altronix (+) → Relay C1; NC1 → Red (+); NO1 → Green (+); both LED returns → Altronix (-).',
      'Lock: Altronix (+) → Relay NO2; Relay C2 → Lock (+); Lock (-) → Altronix (-).',
      'Override/alarm: Altronix (+) → Maintained COM → NO → Relay C2; Relay NO2 → Siren (+); Siren (-) → Altronix (-).'
    ],
    successCriteria: (components, _wires, _nodeVoltages, isEnergized) => {
      const momentary = components.find(c => c.id === 'btn_momentary');
      const maintained = components.find(c => c.id === 'sw_maintained');
      const isMomPressed = momentary?.state.pressed || false;
      const isMaintActive = maintained?.state.toggled || false;

      const redOn = isEnergized('led_red');
      const greenOn = isEnergized('led_green');
      const lockOn = isEnergized('lock1');
      const sirenOn = isEnergized('siren1');

      // Verify defaults when not pressing anything
      if (!isMomPressed) {
        if (!redOn || greenOn || lockOn || sirenOn) {
          return {
            success: false,
            feedback: 'Idle state is incorrect. With both switches released, red must be ON; green, lock power, and siren must be OFF.'
          };
        }
      }

      // Test State 1: Normal Scenario
      if (!isMaintActive && isMomPressed) {
        if (!redOn && greenOn && lockOn && !sirenOn) {
          maintained!.state.testPassedNormal = true;
        }
      }

      // Test State 2: Maintained Switch Clicked Scenario
      if (isMaintActive && isMomPressed) {
        if (!redOn && greenOn && !lockOn && sirenOn) {
          maintained!.state.testPassedMaintained = true;
        }
      }

      if (maintained?.state.testPassedNormal && maintained?.state.testPassedMaintained) {
        return { success: true };
      }

      if (!maintained?.state.testPassedNormal) {
        return {
          success: false,
          feedback: 'Test normal mode: keep Maintained at NC and hold Momentary. Green must turn ON, red OFF, and the lock must receive power to unlock.'
        };
      }

      return {
        success: false,
        feedback: 'Test override mode: set Maintained to NO and hold Momentary. Green and siren must turn ON while lock power remains OFF.'
      };
    }
  }
];

// Supplemental labs live in separate source files so the original 20-module
// training sequence, including Module 20, remains unchanged.
levels.push(requestToExitServiceLab);
levels.push(slidingGateOperatorLab);
levels.push(pullStationReleaseLab);
levels.push(keySwitchActuatorLab);
