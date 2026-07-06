import type { Level } from '../types/game';

export const levels: Level[] = [
  {
    id: 1,
    title: 'Complete Circuit Basics',
    description: 'Learn the fundamental rule of electricity: a closed loop path.',
    instructions: [
      'Welcome to DELMI Lab! In this training level, your goal is to power the lightbulb.',
      'A complete circuit requires a continuous path from the Positive (+) terminal to the Negative (-) terminal.',
      'Click and drag from the Battery (+) terminal (red) to the Bulb input terminal.',
      'Click and drag from the Bulb output terminal to the Battery (-) terminal (black).',
      'Once wired, turn on the Simulator power to test your work!'
    ],
    goals: [
      'Connect Battery (+) to Bulb (IN)',
      'Connect Bulb (OUT) to Battery (-)',
      'Make the lightbulb glow'
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
      'Make sure you connect the Positive (+) red terminal on the battery to the Bulb IN terminal.',
      'Connect the Bulb OUT terminal back to the Negative (-) black terminal on the battery.',
      'Turn on circuit power to test your wiring.'
    ],
    successCriteria: (_components, _wires, _nodeVoltages, isEnergized) => {
      if (isEnergized('bulb1')) {
        return { success: true };
      }
      return { 
        success: false, 
        feedback: 'The bulb is not glowing. Verify that a continuous wire loop connects (+) to Bulb IN, and Bulb OUT to (-).' 
      };
    }
  },
  {
    id: 2,
    title: 'Understanding Open Circuits',
    description: 'See what happens when the electrical loop is broken.',
    instructions: [
      'An open circuit is a path that has been broken, preventing electricity from flowing.',
      'Here, the bulb is disconnected. Read the diagnostic overlay to identify the break.',
      'Repair the circuit by connecting the open side back to the battery negative (-) terminal.'
    ],
    goals: [
      'Identify the open circuit path',
      'Complete the connection to the negative terminal',
      'Power the bulb'
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
      'The positive side is already wired to the bulb.',
      'You only need one black wire. Connect the Bulb OUT terminal to the Battery (-) terminal.'
    ],
    successCriteria: (_components, _wires, _nodeVoltages, isEnergized) => {
      if (isEnergized('bulb1')) {
        return { success: true };
      }
      return { 
        success: false, 
        feedback: 'The circuit is still open. Connect Bulb OUT to Battery (-) to let electrons flow.' 
      };
    }
  },
  {
    id: 3,
    title: 'Normally Open (NO) Push Button',
    description: 'Use an SPST normally-open push button to control power flow.',
    instructions: [
      'A Normally Open (NO) push button is an SPST switch: one input, one output, and one controlled path.',
      'It is open at rest. No electricity flows through it.',
      'When you press it, the internal contacts close, completing the circuit.',
      'Wire the push button in series: Battery (+) to Button IN, and Button OUT to Bulb IN.',
      'Don\'t forget to connect Bulb OUT to Battery (-) to complete the return path!',
      'Once wired, turn on simulation and CLICK and HOLD the push button to test.'
    ],
    goals: [
      'Wire the Normally Open Button in series',
      'Press the button to test current flow',
      'Light the bulb while the button is pressed'
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
      'Connect Battery (+) to Button IN.',
      'Connect Button OUT to Bulb IN.',
      'Connect Bulb OUT to Battery (-).',
      'Make sure to CLICK and HOLD the green push button on the workspace to test!'
    ],
    successCriteria: (components, _wires, _nodeVoltages, isEnergized) => {
      const btn = components.find(c => c.id === 'btn1');
      const isPressed = btn?.state.pressed;

      if (isPressed && isEnergized('bulb1')) {
        return { success: true };
      }
      if (!isPressed && isEnergized('bulb1')) {
        return { success: false, feedback: 'The bulb is glowing, but the button is not pressed! Did you bypass the button?' };
      }
      return { 
        success: false, 
        feedback: 'Wire the button in series, turn on power, then press and hold the button!' 
      };
    }
  },
  {
    id: 4,
    title: 'Normally Closed (NC) Push Button',
    description: 'Use an SPST normally-closed push button to break power when pressed.',
    instructions: [
      'A Normally Closed (NC) push button is also an SPST switch: one input, one output, and one controlled path.',
      'It is closed at rest, allowing current to flow.',
      'When you press it, the contacts open, breaking the circuit.',
      'NC contacts are commonly used for Stop buttons and Safety Emergency Stops.',
      'Wire the NC push button in series with the battery and lightbulb.',
      'Observe what happens at rest, and what happens when you press the button!'
    ],
    goals: [
      'Wire the NC Button in series',
      'Observe the bulb is ON at rest',
      'Press the button to turn the bulb OFF'
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
      'Connect Battery (+) to NC Button IN.',
      'Connect NC Button OUT to Bulb IN.',
      'Connect Bulb OUT to Battery (-).',
      'Notice that the bulb turns on immediately when simulator is active. Pressing the red button will break the path.'
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
        feedback: 'Wire the NC button in series. Turn on power (bulb glows), then click and hold the red button to turn the bulb off.' 
      };
    }
  },
  {
    id: 5,
    title: 'Relay Basics & Armature Snap',
    description: 'Explore relay mechanics: electromagnetic coil & mechanical contacts.',
    instructions: [
      'An electromagnetic relay uses a small control current to switch a larger current.',
      'It contains a Coil (Coil A & Coil B) and Contacts (COM, NC, NO).',
      'When you power the Coil, a magnetic field is created, physically pulling the COM armature from NC to NO.',
      'Wire the Battery to the NO button, then to the Relay Coil (coil_a), and coil_b back to Battery (-).',
      'Press the button to watch the armature mechanically snap!'
    ],
    goals: [
      'Wire the control button to the Relay Coil',
      'Energize the coil by pressing the button',
      'Watch the relay armature shift from NC to NO'
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
        label: 'Control Button',
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
      'Wire Battery (+) to Control Button IN.',
      'Wire Control Button OUT to Relay Coil A.',
      'Wire Relay Coil B to Battery (-).',
      'Activate the simulator, click the Control Button, and watch the yellow electromagnetic coil glow!'
    ],
    successCriteria: (components, _wires, _nodeVoltages, _isEnergized) => {
      const relay = components.find(c => c.id === 'relay1');
      if (relay?.state.energized) {
        return { success: true };
      }
      return { 
        success: false, 
        feedback: 'The relay coil is not energized. Wire the control button to the coil, then press it.' 
      };
    }
  },
  {
    id: 6,
    title: 'Relay Normally Open (NO) Control',
    description: 'Use a relay to switch a secondary high-power lightbulb.',
    instructions: [
      'Relays allow isolation between low-power control wiring and high-power load wiring.',
      'Here, we will wire the Control Button to the Relay Coil (Control Circuit).',
      'Then, we will wire the Lightbulb through the Relay COM and NO contacts (Load Circuit).',
      'When the button is pressed, the relay coil energizes, closing the NO contact and turning on the bulb.'
    ],
    goals: [
      'Wire the control button to the Relay Coil',
      'Wire the Bulb in series with the Battery through the COM and NO contacts',
      'Press the button to light up the bulb'
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
        label: 'Control Button',
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
      'Control Loop: Connect Battery (+) to Button IN, Button OUT to Coil A, Coil B to Battery (-).',
      'Load Loop: Connect Battery (+) to COM, Connect NO to Bulb IN, Bulb OUT to Battery (-).',
      'When the button is pressed, the COM armature snaps to NO, delivering positive voltage to the bulb.'
    ],
    successCriteria: (components, _wires, _nodeVoltages, isEnergized) => {
      const btn = components.find(c => c.id === 'btn1');
      const isPressed = btn?.state.pressed;

      if (isPressed && isEnergized('bulb1') && isEnergized('relay1')) {
        return { success: true };
      }
      return { 
        success: false, 
        feedback: 'The bulb is not glowing. Connect the control button to the relay coil, and the bulb through COM and NO.' 
      };
    }
  },
  {
    id: 7,
    title: 'Relay Normally Closed (NC) Control',
    description: 'Control a lightbulb that stays ON until you press the button.',
    instructions: [
      'Sometimes you want a load to remain powered by default, turning OFF only when triggered.',
      'We use Normally Closed (NC) relay contacts for this.',
      'Wire the Control Button to the Relay Coil.',
      'Wire the Bulb in series with the Battery through the COM and NC contacts.',
      'Observe the bulb is ON. Press the button to energize the relay and turn the bulb OFF.'
    ],
    goals: [
      'Wire the control button to the Relay Coil',
      'Wire the Bulb through the COM and NC contacts',
      'Verify bulb is ON at rest and turns OFF when button is pressed'
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
        label: 'Control Button',
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
      'Control Loop: Wire Battery (+) to Button, Button to Coil A, Coil B to Battery (-).',
      'Load Loop: Wire Battery (+) to COM. Wire NC to Bulb IN. Bulb OUT to Battery (-).',
      'At rest, COM and NC are connected. The bulb lights up. Pressing the button breaks this connection.'
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
        feedback: 'Wire the bulb through the NC contact. It should glow at rest and turn off when the button is held.' 
      };
    }
  },
  {
    id: 8,
    title: 'Emergency Stop Safety Loop',
    description: 'Learn why safety stop circuits use Normally Closed (NC) wiring.',
    instructions: [
      'In industrial systems, Emergency Stops (E-Stops) use Normally Closed contacts.',
      'Why? If a wire breaks or cuts, the circuit opens immediately, shutting down the machinery.',
      'Wire the NC Emergency Stop button in series with the Relay Coil.',
      'Wire the Motor through the Relay COM and NO contacts.',
      'Press the green START button to run the motor, then press the E-Stop to cut all power.'
    ],
    goals: [
      'Wire the NC Emergency Stop in series with the start button and relay coil',
      'Wire the Motor to run when the relay is energized',
      'Press E-Stop to immediately shut down the motor'
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
      'Series Control: Wire PSU (+) to E-STOP IN. Wire E-STOP OUT to START IN. Wire START OUT to Relay Coil A. Coil B to PSU (-).',
      'Power Loop: Wire PSU (+) to Relay COM. Wire Relay NO to Motor IN. Motor OUT to PSU (-).',
      'If E-STOP is pressed or the wire cuts, the entire control circuit loses power instantly.'
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
        feedback: 'The motor should spin when START is held, and stop immediately if E-STOP is pressed.'
      };
    }
  },
  {
    id: 9,
    title: 'CDVI Access Control Wiring',
    description: 'Wire a commercial CDVI secure door magnetic lock system.',
    instructions: [
      'A Magnetic Lock (Maglock) requires continuous electricity to stay locked (fail-secure/fail-safe setup).',
      'To unlock the door, we must cut the power. This is fail-safe.',
      'Wire the CDVI Maglock through the Relay COM and NC contacts, so it is locked by default.',
      'Wire the CDVI Card Reader trigger output to the Relay Coil to release the lock when access is granted.',
      'Once wired, turn on simulation and click the CDVI Reader to scan a card and unlock the door!'
    ],
    goals: [
      'Wire the CDVI Maglock through the Relay NC contacts to stay locked',
      'Wire the CDVI Card Reader output to trigger the Relay Coil',
      'Click the CDVI Card Reader to de-energize the Maglock and unlock the door'
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
      'Power the Card Reader: Connect PSU (+) to Reader 12V, and PSU (-) to Reader GND.',
      'Reader Control: Connect Reader TRIG (OUT) to Relay Coil A, and Relay Coil B to PSU (-).',
      'Maglock Power: Connect PSU (+) to Relay COM. Connect Relay NC to Maglock IN. Maglock OUT to PSU (-).',
      'Click the RFID Reader panel to simulate card scanning!'
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
        feedback: 'The door must be locked by default (Maglock energized) and unlock (Maglock off) when reader is scanned.'
      };
    }
  },
  {
    id: 10,
    title: 'Traffic Light Switch Challenge',
    description: 'Wire a selector switch to alternate between Red and Green bulbs.',
    instructions: [
      'A Selector Switch alternates between two output terminals (out_a and out_b).',
      'Wire the PSU (+) to the Selector Switch IN.',
      'Wire Selector Switch out_a to the GREEN bulb, and out_b to the RED bulb.',
      'Wire both bulb outputs back to the PSU (-) to complete their circuits.',
      'Toggle the Selector Switch to verify you can switch between red and green!'
    ],
    goals: [
      'Wire Selector Switch to split positive current',
      'Connect GREEN bulb to selector position A, RED bulb to position B',
      'Toggle the switch to alternate light indicators'
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
        type: 'switch_selector',
        x: 350,
        y: 250,
        label: 'Mode Switch',
        terminals: [
          { id: 'in', name: 'IN', type: 'in', x: -35, y: 0 },
          { id: 'out_a', name: 'OUT A', type: 'out_a', x: 35, y: -15 },
          { id: 'out_b', name: 'OUT B', type: 'out_b', x: 35, y: 15 }
        ],
        state: {}
      },
      {
        id: 'red_lamp',
        type: 'lamp_indicator',
        x: 620,
        y: 150,
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
        x: 620,
        y: 350,
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
      'Connect PSU (+) to Selector IN.',
      'Connect Selector OUT A to GREEN Lamp IN.',
      'Connect Selector OUT B to RED Lamp IN.',
      'Connect both Lamp OUT terminals to PSU (-).',
      'Toggle the Selector Switch in the workspace to test.'
    ],
    successCriteria: (components, _wires, _nodeVoltages, isEnergized) => {
      const sw = components.find(c => c.id === 'sw1');
      const isToggled = sw?.state.toggled;

      if (!isToggled && isEnergized('green_lamp') && !isEnergized('red_lamp')) {
        sw!.state.testPassedA = true;
      }
      if (isToggled && isEnergized('red_lamp') && !isEnergized('green_lamp')) {
        sw!.state.testPassedB = true;
      }

      if (sw?.state.testPassedA && sw?.state.testPassedB) {
        return { success: true };
      }

      return {
        success: false,
        feedback: 'The lights should switch: position A lights GREEN, position B lights RED. Toggle the switch to show both.'
      };
    }
  },
  {
    id: 11,
    title: 'House Lighting & Ground Loop',
    description: 'Wire a standard household lighting loop with hot, neutral, and ground.',
    instructions: [
      'In residential AC wiring, we have: Hot (Current carrier), Neutral (Return path), and Ground (Safety).',
      'Even though this is simulated as DC in our lab, the wiring topology is identical.',
      'Wire the Power Supply (+) as Hot, leading to the Selector Switch (acting as a standard toggle light switch).',
      'Wire the switch output to the lightbulb.',
      'Wire the lightbulb back to Negative (-) as Neutral.',
      'Wire the metallic frame ground terminal on the bulb to the PSU ground terminal (Green wire for safety).'
    ],
    goals: [
      'Wire the Light Switch in series with the Hot line',
      'Wire the return path back to the Neutral line',
      'Connect the safety Ground line using green wires'
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
      'Connect PSU HOT to Wall Switch IN.',
      'Connect Wall Switch LOAD (OUT A) to Room Light L (IN).',
      'Connect Room Light N (OUT) to PSU NEU.',
      'Connect Room Light PE (GND) to PSU GND using a Green wire for safety.'
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
        return { success: false, feedback: 'The light glows, but you forgot to connect the PE safety ground wire!' };
      }

      return {
        success: false,
        feedback: 'Wire the HOT through the switch to the bulb, close the neutral return loop, and connect the ground PE wire.'
      };
    }
  },
  {
    id: 12,
    title: 'Industrial Latching Relay Control',
    description: 'Build a standard 3-wire latching start/stop motor control circuit.',
    instructions: [
      'In factories, motors aren\'t run by holding a button down. We use a latching circuit.',
      'A momentary START button triggers the relay coil. The relay NC/NO contacts close.',
      'A set of relay contacts is wired in PARALLEL with the START button. Once the relay closes, it keeps itself powered (latched) even when you release the START button!',
      'Pressing the NC STOP button cuts power, breaking the latch.',
      'Wire the STOP (NC) button in series from PSU (+).',
      'Wire the START (NO) button in series after the STOP button, leading to the Relay Coil A.',
      'Wire a Relay NO contact (COM to NO) in parallel across the START button (from STOP OUT to Relay Coil A).',
      'Wire another Relay contact or the same path to feed the conveyor Motor.'
    ],
    goals: [
      'Wire STOP button in series, followed by START button',
      'Connect START output to Relay Coil',
      'Wire Relay contacts in parallel with START to latch power',
      'Verify: Press START momentarily -> Motor stays ON. Press STOP -> Motor turns OFF.'
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
      'PSU (+) -> STOP IN. STOP OUT -> START IN. START OUT -> Coil A. Coil B -> PSU (-).',
      'For latching: Connect STOP OUT (which is the input of START) to Relay COM.',
      'Connect Relay NO to START OUT (which is the output of START, connecting to Coil A). Now, Relay contact is in parallel with START.',
      'Connect Motor IN to Relay NO (so it runs when coil is energized) and Motor OUT to PSU (-).',
      'Turn on power, tap START, and release. The motor should remain active!'
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
        feedback: 'Latching failed. When you press and release START, the relay must stay locked ON, keeping the motor active. STOP must break this latch.'
      };
    }
  },
  {
    id: 13,
    title: 'Time-Delay Cooling Fan',
    description: 'Wire a time-delay relay to safely start a cooling fan 2 seconds after the main switch is flipped.',
    instructions: [
      'Industrial systems use Time-Delay Relays to delay switching loads and manage in-rush currents.',
      'Wire the PSU (+) to the Main Switch (switch_selector) IN.',
      'Wire Main Switch out_a to the Delay Timer (timer_relay) trigger terminal TRIG. Wire terminal - to PSU (-).',
      'Wire PSU (+) to the Delay Timer C terminal. Wire Delay Timer NO to the Cooling Fan (motor) IN.',
      'Wire Cooling Fan OUT to PSU (-).',
      'Turn on simulation and flip the Main Switch. Watch the countdown, then see the fan spin!'
    ],
    goals: [
      'Wire Main Switch to trigger the Timer Relay Coil',
      'Wire the Cooling Fan through the Timer Relay COM/NO contacts',
      'Turn on power, flip switch, wait 2 seconds, and see the fan spin'
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
        id: 'switch1',
        type: 'switch_selector',
        x: 120,
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
      'Coil Loop: Connect PSU (+) to Switch IN. Connect Switch out_a to Timer TRIG. Connect Timer - to PSU (-).',
      'Fan Loop: Connect PSU (+) to Timer C. Connect Timer NO to Fan IN. Connect Fan OUT to PSU (-).',
      'Turn on power, flip the Selector Switch, and keep it on for 2 seconds to let the timer trip!'
    ],
    successCriteria: (components, _wires, _nodeVoltages, isEnergized) => {
      const timer = components.find(c => c.id === 'timer1');
      
      if (timer?.state.delayedActive && isEnergized('motor1')) {
        return { success: true };
      }

      if (isEnergized('timer1') && !timer?.state.delayedActive) {
        return {
          success: false,
          feedback: 'Timer Coil is energized! Wait for the countdown (2.0s) to finish and trip the contacts.'
        };
      }

      return {
        success: false,
        feedback: 'Wire the Main Switch to control the Timer Relay Coil, and wire the Cooling Fan through the Timer COM/NO contacts.'
      };
    }
  },
  {
    id: 14,
    title: 'Hoistway Safety Limits',
    description: 'Wire an elevator hoist motor through an NC limit switch so that the cabin automatically cuts power and stops safely when it reaches the top floor.',
    instructions: [
      'Limit switches are critical safety devices that open their contacts (NC) to stop movement when a mechanical part reaches the end of travel.',
      'Wire the PSU (+) to the UP Button (button_no) IN.',
      'Wire UP Button OUT to the Top Limit Switch (limit_switch) IN.',
      'Wire Top Limit Switch OUT to the Elevator Hoist (elevator_motor) POS (pos).',
      'Wire Elevator Hoist NEG (neg) to PSU (-).',
      'Turn on simulation and hold the UP Button. The cabin will climb, hit the limit switch, and stop!'
    ],
    goals: [
      'Wire UP Button through the NC Top Limit Switch for safety cut-off',
      'Wire Elevator Hoist to move upwards',
      'Press UP, watch the cabin reach 2F and cut power automatically'
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
      'Safety loop: Connect PSU (+) to UP Button IN, UP Button OUT to Limit Switch IN, and Limit Switch OUT to Elevator POS.',
      'Return path: Connect Elevator NEG to PSU (-).',
      'Press and hold the UP Button. Once the cabin hits the limit roller at 2F, the NC limit opens and cuts power!'
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
          feedback: 'Hold the UP button down until the elevator cabin fully reaches the top floor and hits the limit switch.'
        };
      }

      return {
        success: false,
        feedback: 'Wire PSU (+) through the UP Button, then through the NC Limit Switch, and finally to the Elevator Motor POS. Connect NEG to PSU (-).'
      };
    }
  },
  {
    id: 15,
    title: 'Actuator Polarity Reversing',
    description: 'Build a DPDT-style reversing circuit that swaps actuator polarity with two relays.',
    instructions: [
      'A DPDT switch reverses a DC motor by swapping the positive and negative leads. In this simulator, two relays recreate that DPDT action for a linear actuator.',
      'Coil Wiring: Connect EXTEND Button to Relay 1 Coil A1. Connect RETRACT Button to Relay 2 Coil A1. Connect both Coil A2 terminals to PSU (-).',
      'Default Negative Path: Connect PSU (-) to Relay 1 NC and Relay 2 NC. Connect Relay 1 COM to Actuator POS (pos), and Relay 2 COM to Actuator NEG (neg). (This keeps both actuator pins grounded when idle).',
      'Positive Path: Connect PSU (+) to Relay 1 NO and Relay 2 NO.',
      'Turn on simulation. Press EXTEND to push the shaft out, and RETRACT to pull it back in!'
    ],
    goals: [
      'Wire buttons to control the two relay coils separately',
      'Wire Relay COM terminals to the Actuator POS/NEG inputs',
      'Connect NC to PSU (-) for active braking, and NO to PSU (+) to supply power',
      'Verify you can extend the actuator to 100% and retract it back to 0%'
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
      'Extend Coil: Connect btn_ext OUT to Relay 1 A1. Relay 1 A2 to PSU (-).',
      'Retract Coil: Connect btn_ret OUT to Relay 2 A1. Relay 2 A2 to PSU (-).',
      'Actuator H-Bridge: Connect Relay 1 COM to Actuator POS. Connect Relay 2 COM to Actuator NEG.',
      'GND Path: Connect both Relay 1 NC and Relay 2 NC to PSU (-).',
      'VCC Path: Connect both Relay 1 NO and Relay 2 NO to PSU (+).',
      'Hold EXTEND to push out to 100%. Once extended, hold RETRACT to pull it back to 0% to complete!'
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
          feedback: 'Actuator extended successfully! Now press and hold the RETRACT button to pull the shaft back to 0% to complete the test.'
        };
      }

      return {
        success: false,
        feedback: 'Wire the H-bridge circuit: Coils to buttons. Relay COMs to Actuator. Connect both NC contacts to PSU (-), and both NO contacts to PSU (+).'
      };
    }
  },
  {
    id: 16,
    title: 'CDVI Transformer Security',
    description: 'Wire AC mains to a Switched-Mode Transformer, then power a secure CDVI card reader and maglock loop.',
    instructions: [
      'In professional security, DC voltages are converted from AC mains using Switched-Mode Power Supplies (SMPS).',
      'Wire the AC Outlet (ac_source) L to the Power Converter (transformer) AC input ac_l.',
      'Wire AC Outlet N to the Power Converter AC input ac_n. (If powered, the Green LED will light up!).',
      'Wire the Power Converter DC (+) output (dc_pos) to CDVI Reader (card_reader) 12V (pos).',
      'Wire the Power Converter DC (-) output (dc_neg) to CDVI Reader GND (neg).',
      'Wire CDVI Reader TRIG (out) to the Isolation Relay (relay) Coil A1 (coil_a). Wire Coil A2 (coil_b) to Converter DC (-).',
      'Power the Maglock: Wire Converter DC (+) to Relay COM (com). Wire Relay NC (nc) to CDVI Maglock (maglock) IN (in). Wire Maglock OUT (out) to Converter DC (-).',
      'Turn on simulation. Tap the CDVI Reader panel to scan a card and unlock the door!'
    ],
    goals: [
      'Wire the 120VAC Outlet to the Power Converter input terminals',
      'Power the CDVI Card Reader and Relay Coil from the Converter 24VDC output',
      'Wire the CDVI Maglock through the Relay NC contacts to stay locked by default',
      'Scan a card and confirm the CDVI Maglock unlocks'
    ],
    inventory: [],
    preplacedComponents: [
      {
        id: 'ac_out',
        type: 'ac_source',
        x: 120,
        y: 80,
        label: '120VAC Outlet',
        terminals: [
          { id: 'L', name: 'L', type: 'pos', x: -15, y: 10 },
          { id: 'N', name: 'N', type: 'neg', x: 15, y: 10 }
        ],
        state: {}
      },
      {
        id: 'smps',
        type: 'transformer',
        x: 120,
        y: 280,
        label: 'Power Converter',
        terminals: [
          { id: 'ac_l', name: 'L', type: 'in', x: -35, y: -15 },
          { id: 'ac_n', name: 'N', type: 'in', x: -35, y: 15 },
          { id: 'dc_pos', name: '(+)', type: 'pos', x: 35, y: -15 },
          { id: 'dc_neg', name: '(-)', type: 'neg', x: 35, y: 15 }
        ],
        state: {}
      },
      {
        id: 'reader1',
        type: 'card_reader',
        x: 420,
        y: 350,
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
        x: 420,
        y: 160,
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
        x: 750,
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
      'AC Wiring: Outlet L -> Converter L (ac_l). Outlet N -> Converter N (ac_n).',
      'DC Power Reader: Converter (+) -> Reader 12V. Converter (-) -> Reader GND.',
      'Control Loop: Reader TRIG -> Relay A1. Relay A2 -> Converter (-).',
      'Lock Loop: Converter (+) -> Relay COM. Relay NC -> Maglock IN. Maglock OUT -> Converter (-).',
      'Click the CDVI Reader panel to scan a card and release the lock!'
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
        feedback: 'The door must be locked by default (CDVI Maglock energized) and unlock (de-energize) when the CDVI card is scanned.'
      };
    }
  },
  {
    id: 17,
    title: 'The Relay Master Challenge',
    description: 'Help Relay Master Roland power his custom cap cooling fan using an isolation relay.',
    instructions: [
      'Welcome to the ultimate challenge! Relay Master Roland has integrated a custom fan directly into his Delmi cap.',
      'Control Loop: Connect PSU (+) to Switch IN. Connect Switch OUT to Relay A1 (coil_a). Connect Relay A2 (coil_b) to PSU (-).',
      'Power Loop: Connect PSU (+) to Relay COM. Connect Relay NO to Roland Cap Fan IN (in). Connect Roland Cap Fan OUT (out) to PSU (-).',
      'Turn on the simulator power and press the Switch to spin Roland\'s cap!'
    ],
    goals: [
      'Connect Switch to Relay Coil A1',
      'Connect Relay NO to Roland Fan IN',
      'Power the circuit and press the switch to spin Roland\'s cap'
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
      'Control Loop: PSU (+) -> Switch IN -> Switch OUT -> Relay A1. Relay A2 -> PSU (-).',
      'Power Loop: PSU (+) -> Relay COM. Relay NO -> Roland Fan IN. Roland Fan OUT -> PSU (-).',
      'Press and hold the push button to make Roland\'s cap rotate!'
    ],
    successCriteria: (components, _wires, _nodeVoltages, isEnergized) => {
      const btn = components.find(c => c.id === 'btn1');
      if (btn?.state.pressed && isEnergized('roland1')) {
        return { success: true };
      }
      if (!btn?.state.pressed && isEnergized('roland1')) {
        return { success: false, feedback: 'Roland\'s cap is rotating, but the switch is not pressed! Did you bypass the switch?' };
      }
      return { success: false, feedback: 'Press the Push Button while the simulation is running to spin Roland\'s cap.' };
    }
  },
  {
    id: 18,
    title: 'Automatic Parking Gate',
    description: 'Design an automatic control circuit for a parking barrier gate using a card reader, 6062 timer relays, and a loop detector.',
    instructions: [
      'Welcome to the parking gate module! Your task is to wire the automatic gate system.',
      'Control Loop (Open): Connect CDVI Reader 12V and GND to PSU (+)/(-). Connect Reader TRIG to Open Relay A1 and Open 6062 Timer TRIG. Connect Open Relay A2 and Open 6062 Timer - to PSU (-).',
      'Latching Open: Connect PSU (+) to Open 6062 Timer C. Connect Open 6062 Timer NC to Open Relay COM. Connect Open Relay NO to Open Relay A1 and Gate POS.',
      'Control Loop (Close): Connect Loop Detector IN to PSU (+), and OUT to Close Relay A1 and Close 6062 Timer TRIG. Connect Close Relay A2 and Close 6062 Timer - to PSU (-).',
      'Latching Close: Connect PSU (+) to Close 6062 Timer C. Connect Close 6062 Timer NC to Close Relay COM. Connect Close Relay NO to Close Relay A1 and Gate NEG.',
      'Scan a card at the CDVI Reader to lift the gate, and then click the Loop Detector to lower the gate back down!'
    ],
    goals: [
      'Connect CDVI Reader to trigger the Open Relay and Open 6062 Timer',
      'Latch the Open Relay through the Open 6062 Timer NC contact',
      'Connect Loop Detector to trigger the Close Relay and Close 6062 Timer',
      'Latch the Close Relay through the Close 6062 Timer NC contact'
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
        state: {}
      },
      {
        id: 'reader1',
        type: 'card_reader',
        x: 260,
        y: 150,
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
        y: 350,
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
      'Open Loop: PSU (+) -> Reader 12V. Reader GND -> PSU (-). Reader TRIG -> Open Relay A1 and Open 6062 Timer TRIG. Open Relay A2 and Timer - -> PSU (-).',
      'Open Latch: PSU (+) -> Open 6062 Timer C. Open 6062 Timer NC -> Open Relay COM. Open Relay NO -> Open Relay A1 and Gate POS.',
      'Close Loop: PSU (+) -> Loop Detector IN. Loop Detector OUT -> Close Relay A1 and Close 6062 Timer TRIG. Close Relay A2 and Timer - -> PSU (-).',
      'Close Latch: PSU (+) -> Close 6062 Timer C. Close 6062 Timer NC -> Close Relay COM. Close Relay NO -> Close Relay A1 and Gate NEG.'
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
        feedback: 'Wire the automatic gate so that scanning the CDVI Reader raises the gate to 100%, and clicking the Loop Detector lowers it back to 0%.'
      };
    }
  },
  {
    id: 19,
    title: 'Smart Parking Barrier',
    description: 'Build a premium automatic parking barrier gate system using a custom Delmi smart cabinet, loop detector, and timer relays.',
    instructions: [
      'Welcome to the Smart Parking Barrier project! We are using our new premium Delmi cabinet.',
      'Control Loop (Open): Connect CDVI Reader 12V and GND to PSU (+)/(-). Connect Reader TRIG to Open Relay A1 and Open Timer TRIG. Connect Open Relay A2 and Open Timer - to PSU (-).',
      'Latching Open: Connect PSU (+) to Open Timer COM. Connect Open Timer NC to Open Relay COM. Connect Open Relay NO to Open Relay A1. Connect Open Relay NO to Gate (+) POS (in).',
      'Control Loop (Close): Connect Loop Detector IN to PSU (+), and OUT to Close Relay A1 and Close Timer TRIG. Connect Close Relay A2 and Close Timer - to PSU (-).',
      'Latching Close: Connect PSU (+) to Close Timer COM. Connect Close Timer NC to Close Relay COM. Connect Close Relay NO to Close Relay A1. Connect Close Relay NO to Gate (-) NEG (out).',
      'Power the circuit and scan the CDVI Reader to watch the barrier arm swing up, and click the Loop Detector to watch it swing down!'
    ],
    goals: [
      'Connect CDVI Reader to trigger Open Relay and Open Timer',
      'Latch Open Relay through the Open Timer Normally Closed (NC) contact',
      'Connect Loop Detector to trigger Close Relay and Close Timer',
      'Latch Close Relay through the Close Timer Normally Closed (NC) contact'
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
        state: {}
      },
      {
        id: 'reader1',
        type: 'card_reader',
        x: 260,
        y: 150,
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
        y: 350,
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
      'Open Loop: PSU (+) -> Reader 12V. Reader GND -> PSU (-). Reader TRIG -> Open Relay A1 and Open Timer TRIG. Open Relay A2 and Open Timer - -> PSU (-).',
      'Open Latch: PSU (+) -> Open Timer COM. Open Timer NC -> Open Relay COM. Open Relay NO -> Open Relay A1 (latch) & Gate POS.',
      'Close Loop: PSU (+) -> Loop Detector IN. Loop Detector OUT -> Close Relay A1 and Close Timer TRIG. Close Relay A2 and Close Timer - -> PSU (-).',
      'Close Latch: PSU (+) -> Close Timer COM. Close Timer NC -> Close Relay COM. Close Relay NO -> Close Relay A1 (latch) & Gate NEG.'
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
        feedback: 'Wire the automatic gate so that scanning the CDVI Reader raises the gate to 100%, and clicking the Loop Detector lowers it back to 0%.'
      };
    }
  }
];
