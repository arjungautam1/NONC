import type { CircuitComponent, ComponentType, Terminal } from '../types/game';
import { DEFAULT_6062_CONFIG } from '../simulation/timer6062';
import { pullStationTerminals } from '../components/game/components/pullStationPinout';
import { rb1224Terminals } from '../components/game/components/rb1224Pinout';
import { rbsnttlTerminals } from '../components/game/components/rbsnttlPinout';
import { cubePowerTerminals } from '../components/game/components/cubePowerPinout';
import { sm500Terminals } from '../components/game/components/sm500Pinout';
import { kr2402Terminals } from '../components/game/components/kr2402Pinout';
import { cx12plusTerminals, DEFAULT_CX12PLUS_CONFIG } from '../components/game/components/cx12plusPinout';

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
  signalKind?: 'dry' | 'wet';
  template: ComponentTemplate;
}

export const MAX_CUSTOM_COMPONENTS = 32;

export const customLabCategories: Array<{
  id: CustomLabCategory;
  label: string;
  description: string;
}> = [
  {
    id: 'input',
    label: 'Inputs',
    description: 'Buttons, readers, and field switches that create a control signal.'
  },
  {
    id: 'control',
    label: 'Relays',
    description: 'Relays, timers, and protection components that process or route signals.'
  },
  {
    id: 'output',
    label: 'Outputs',
    description: 'Lights, sounders, motors, and locks that perform the work.'
  }
];

export const customLabOptions: CustomLabOption[] = [
  {
    id: 'emergency_pull_station',
    category: 'input',
    name: 'Camden CM-700 pull station',
    description: 'Latching door-release pull station, 12-24VDC. Two isolated circuits, each with its own common: NC-C opens when pulled, NO-C closes. The two C screws are not tied together inside the station. Reset through the plate hole.',
    terminalSummary: 'NC · C · NO · C (two isolated circuits)',
    template: {
      type: 'pull_station',
      label: 'Camden CM-702',
      terminals: pullStationTerminals(),
      state: { toggled: false }
    }
  },
  {
    id: 'visionis_vis7039', category: 'input', name: 'Visionis VIS-7039 push plate',
    signalKind: 'dry',
    description: 'Square stainless steel momentary push plate with voltage-free SPDT contacts. Press connects COM to NO; release connects COM to NC.',
    terminalSummary: 'COM · NO · NC',
    template: {
      type: 'button_no', label: 'Visionis VIS-7039',
      terminals: [
        { id: 'com', name: 'COM', type: 'com', x: -32, y: 62 },
        { id: 'no', name: 'NO', type: 'no', x: 0, y: 62 },
        { id: 'nc', name: 'NC', type: 'nc', x: 32, y: 62 }
      ],
      state: { appearance: 'vis7039' }
    }
  },
  {
    id: 'powered_request_momentary', category: 'input', name: 'Intercom · powered unlock output', signalKind: 'wet',
    description: 'Generic powered-output intercom model. Connect +V/0V to its DC supply and OUT/COM to a CX-12 WET input. Press the door-release key to send an unlock request. For an intercom with a dry relay, use COM/NO contacts instead.',
    terminalSummary: '+V · 0V supply / OUT · COM powered output',
    template: {
      type: 'powered_signal', label: 'Powered-output intercom',
      terminals: [
        { id: 'pos', name: '+V', type: 'pos', x: -30, y: -58 },
        { id: 'neg', name: '0V', type: 'neg', x: 30, y: -58 },
        { id: 'out', name: 'OUT', type: 'out', x: -30, y: 58 },
        { id: 'com', name: 'COM', type: 'com', x: 30, y: 58 }
      ], state: { signalMode: 'momentary', pressed: false, powered: false }
    }
  },
  {
    id: 'powered_request_maintained', category: 'input', name: 'Control panel · maintained voltage output', signalKind: 'wet',
    description: 'Generic control-panel model with a maintained voltage output. Connect +V/0V to the DC supply and OUT/COM to the controller WET input. Enable or clear the simulated panel request. This models a voltage output, not a dry relay or reader data connection.',
    terminalSummary: '+V · 0V supply / OUT · COM powered output',
    template: {
      type: 'powered_signal', label: 'Control panel voltage output',
      terminals: [
        { id: 'pos', name: '+V', type: 'pos', x: -30, y: -58 },
        { id: 'neg', name: '0V', type: 'neg', x: 30, y: -58 },
        { id: 'out', name: 'OUT', type: 'out', x: -30, y: 58 },
        { id: 'com', name: 'COM', type: 'com', x: 30, y: 58 }
      ], state: { signalMode: 'maintained', toggled: false, powered: false }
    }
  },
  {
    id: 'momentary_spdt',
    signalKind: 'dry',
    category: 'input',
    name: 'Momentary switch',
    description: 'Spring-return SPDT input with COM, NC, and NO contacts.',
    terminalSummary: 'COM · NC · NO',
    template: {
      type: 'button_no',
      label: 'Momentary Switch',
      terminals: [
        { id: 'com', name: 'C', type: 'com', x: -42, y: 25 },
        { id: 'nc', name: 'NC', type: 'nc', x: 42, y: 14 },
        { id: 'no', name: 'NO', type: 'no', x: 42, y: 38 }
      ],
      state: {}
    }
  },
  {
    id: 'maintained_key_switch', category: 'input', name: 'Key switch',
    signalKind: 'dry',
    description: 'Simulator powered key switch. Requires 12/24VDC on +/− before turning activates its isolated SPDT contacts. This power interlock is a teaching feature, not a claim about a mechanical Camden key switch.',
    terminalSummary: '+ · − power / COM · NO · NC contacts',
    template: {
      type: 'key_switch', label: 'Key switch',
      terminals: [
        { id: 'pos', name: '+', type: 'pos', x: -28, y: -78 },
        { id: 'neg', name: '−', type: 'neg', x: 28, y: -78 },
        { id: 'com', name: 'COM', type: 'com', x: -32, y: 78 },
        { id: 'no', name: 'NO', type: 'no', x: 0, y: 78 },
        { id: 'nc', name: 'NC', type: 'nc', x: 32, y: 78 }
      ], state: { toggled: false, powered: false }
    }
  },
  {
    id: 'maintained_spdt',
    signalKind: 'dry',
    category: 'input',
    name: 'Maintained SPDT switch',
    description: 'Stays in the selected position and transfers COM between NC and NO.',
    terminalSummary: 'COM · NC · NO',
    template: {
      type: 'rocker_switch_2pos',
      label: 'Maintained Switch',
      terminals: [
        { id: 'com', name: 'C', type: 'in', x: -42, y: 25 },
        { id: 'nc', name: 'NC', type: 'out_a', x: 42, y: 14 },
        { id: 'no', name: 'NO', type: 'out_b', x: 42, y: 38 }
      ],
      state: {}
    }
  },
  {
    id: 'wave_sensor',
    signalKind: 'dry',
    category: 'input',
    name: 'Wave sensor',
    description: '12/24VDC powered touchless switch with a Form C (SPDT) relay output.',
    terminalSummary: '+ · − · C · NC · NO',
    template: {
      type: 'wave_sensor',
      label: 'Wave Sensor',
      terminals: [
        { id: 'com', name: 'C', type: 'com', x: -20, y: -72 },
        { id: 'nc', name: 'NC', type: 'nc', x: 0, y: -72 },
        { id: 'no', name: 'NO', type: 'no', x: 20, y: -72 },
        { id: 'pos', name: '+', type: 'pos', x: -12, y: 72 },
        { id: 'neg', name: '−', type: 'neg', x: 12, y: 72 }
      ],
      state: { active: false, powered: false }
    }
  },
  {
    id: 'wireless_transmitter',
    category: 'input',
    name: 'CDVI wireless transmitter',
    description: 'Dedicated wireless transmitter for the CDVI CUBE POWER receiver.',
    terminalSummary: 'Wireless — no terminals',
    template: {
      type: 'wireless_transmitter',
      label: 'RF Transmitter',
      terminals: [],
      state: {}
    }
  },
  {
    id: 'kr2402_remote',
    category: 'input',
    name: 'QIACHIP KR2402A remote',
    description: 'Dedicated 433.92MHz EV1527 keyfob for the KR2402A. Its documented A and B buttons operate the receiver’s matching A and B relay outputs.',
    terminalSummary: 'Wireless A/B buttons — no terminals',
    template: {
      type: 'kr2402_remote',
      label: 'QIACHIP A/B Remote',
      terminals: [],
      state: {}
    }
  },
  {
    id: 'nascom_n282txg',
    signalKind: 'dry',
    category: 'input',
    name: 'NASCOM N282TXG SPDT door contact',
    description: 'N282TXGW/STSD white extra-wide-gap surface-mount magnetic contact. Click the set to open or close the door; its SPDT dry contact transfers COM between NC and NO.',
    terminalSummary: 'NC · COM · NO',
    template: {
      type: 'door_sensor',
      label: 'NASCOM N282TXG',
      terminals: [
        { id: 'nc', name: 'NC', type: 'nc', x: -51, y: -24 },
        { id: 'com', name: 'COM', type: 'com', x: -51, y: 0 },
        { id: 'no', name: 'NO', type: 'no', x: -51, y: 24 }
      ],
      state: { toggled: false }
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
    id: 'cube_power',
    category: 'control',
    name: 'CDVI CUBE POWER',
    description: 'Bluetooth stand-alone 1-relay wireless receiver. Powered on 0V/12-24V AC/DC (autodetect); the Form C relay is switched wirelessly by a paired transmitter or the UserCUBE app, not by a wired trigger — tap the device once powered to simulate that.',
    terminalSummary: '0V / 12-24V power · NC / C / NO relay (wireless trigger)',
    template: {
      type: 'cube_power',
      label: 'CUBE POWER',
      terminals: cubePowerTerminals(),
      state: { relayTriggered: false }
    }
  },
  {
    id: 'wireless_relay_kr2402',
    category: 'control',
    name: 'QIACHIP KR2402A wireless relay',
    description: 'Green 433.92MHz two-channel receiver. Powered by 5-60VDC with two independent Form-C relay outputs and momentary, toggle, or latching RF modes.',
    terminalSummary: '+V · −V · NO1/COM1/NC1 · NO2/COM2/NC2',
    template: {
      type: 'wireless_relay_kr2402',
      label: 'KR2402A Wireless Relay',
      terminals: kr2402Terminals(),
      state: { channel1Active: false, channel2Active: false, wirelessMode: 'toggle' }
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
    id: 'cx12plus',
    category: 'control',
    name: 'Camden CX-12 Plus',
    description: '12/24V AC/DC door interface relay with two Form-C outputs, two powered inputs, two dry-contact inputs, eight operating modes, and three adjustable 1-30 second delays.',
    terminalSummary: '1-2 power · 3-5 lock relay · 6-8 operator relay · Wet 1/2 · Dry 1/2',
    template: {
      type: 'cx12plus',
      label: 'Camden CX-12 Plus',
      terminals: cx12plusTerminals(),
      state: {
        cx12Config: { ...DEFAULT_CX12PLUS_CONFIG, sw: [...DEFAULT_CX12PLUS_CONFIG.sw] },
        boardPowered: false,
        relay1Active: false,
        relay2Active: false
      }
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
    id: 'buzzer',
    category: 'output',
    name: 'Alarm',
    description: 'Audible output that sounds while its circuit is powered.',
    terminalSummary: '+ IN · − OUT',
    template: {
      type: 'buzzer',
      label: 'Alarm',
      terminals: [
        { id: 'in', name: '+', type: 'in', x: -50, y: 15 },
        { id: 'out', name: '-', type: 'out', x: 50, y: 15 }
      ],
      state: {}
    }
  },
  {
    id: 'actuator',
    category: 'output',
    name: 'Linear actuator',
    description: '24VDC linear actuator, 150mm stroke. Extends on POS-high polarity and retracts when reversed — pair with a DPDT relay or two SPDT relays to drive both directions.',
    terminalSummary: 'POS · NEG',
    template: {
      type: 'actuator',
      label: 'Linear Actuator',
      terminals: [
        { id: 'pos', name: 'POS', type: 'pos', x: -30, y: 35 },
        { id: 'neg', name: 'NEG', type: 'neg', x: 30, y: 35 }
      ],
      state: { travel: 0 }
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
    id: 'sm500_maglock',
    category: 'output',
    name: 'CDVI SM500 maglock',
    description: 'Surface-mount 500kg (1,100 lb) electromagnetic lock. Fail-safe only — locks while powered on +/-, unlocks on power loss. Built-in PCB adds a holding-force sensor: a dry contact (NC/COM/NO) that reports NO once the lock is closed and driven at full force.',
    terminalSummary: '+ / − power · NC/COM/NO holding-force sensor',
    template: {
      type: 'sm500_maglock',
      label: 'CDVI SM500',
      terminals: sm500Terminals(),
      state: {}
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
  },
  {
    id: 'automatic_door_operator',
    category: 'output',
    name: 'ASSA ABLOY swing operator',
    description: 'Door operator activation input. Close ACT to COM from a relay dry contact to open the door.',
    terminalSummary: 'ACT · COM dry input',
    template: {
      type: 'automatic_door_operator',
      label: 'ASSA ABLOY swing operator',
      terminals: [
        { id: 'act', name: 'ACT', type: 'in', x: -32, y: 94 },
        { id: 'com', name: 'COM', type: 'com', x: 32, y: 94 }
      ],
      state: { active: false, travel: 0 }
    }
  },
  {
    id: 'sti_sa5500_b',
    category: 'output',
    name: 'Blue Strobe',
    description: 'Round, blue strobe light (flashing indicator). Operates on 12-24 VDC (+ / -).',
    terminalSummary: '+ · −',
    template: {
      type: 'sti_siren_strobe',
      label: 'Blue Strobe',
      terminals: [
        { id: 'pos', name: '+', type: 'pos', x: -20, y: 44 },
        { id: 'neg', name: '−', type: 'neg', x: 20, y: 44 }
      ],
      state: { lensColor: 'blue' }
    }
  },
  {
    id: 'sti_sa5500_r',
    category: 'output',
    name: 'Red Strobe',
    description: 'Round, red strobe light (flashing indicator). Operates on 12-24 VDC (+ / -).',
    terminalSummary: '+ · −',
    template: {
      type: 'sti_siren_strobe',
      label: 'Red Strobe',
      terminals: [
        { id: 'pos', name: '+', type: 'pos', x: -20, y: 44 },
        { id: 'neg', name: '−', type: 'neg', x: 20, y: 44 }
      ],
      state: { lensColor: 'red' }
    }
  },
  {
    id: 'seco_larm_sl1312_r',
    category: 'output',
    name: 'Siren/ Strobe',
    description: 'Compact mini strobe/siren alarm unit. 12VDC, 60mA low current draw, 100dB piezo siren with 4-LED strobe. Red: Siren only (+), Green: Strobe only (+), Black: Negative (-). Each input works on its own and both need Black back to the supply — wire Red and Green together for sound and light at once.',
    terminalSummary: 'RED (Siren) · GRN (Strobe) · BLK (−)',
    template: {
      type: 'seco_larm_strobe_siren',
      label: 'Siren/ Strobe',
      terminals: [
        { id: 'red', name: 'RED', type: 'pos', x: -22, y: 62.5 },
        { id: 'green', name: 'GRN', type: 'pos', x: 0, y: 62.5 },
        { id: 'black', name: 'BLK', type: 'neg', x: 22, y: 62.5 }
      ],
      state: { lensColor: 'red' }
    }
  },
  {
    id: 'dc_fan',
    category: 'output',
    name: 'DC Fan',
    description: '12-24VDC square cooling fan with rotating impeller blades. Spins and hums when powered.',
    terminalSummary: '+ · −',
    template: {
      type: 'dc_fan',
      label: 'DC Fan',
      terminals: [
        { id: 'pos', name: '+', type: 'pos', x: -20, y: 40 },
        { id: 'neg', name: '-', type: 'neg', x: 20, y: 40 }
      ],
      state: {}
    }
  }
];

export const getCustomLabOption = (id: string) => customLabOptions.find(option => option.id === id);

/** Older benches used the catalog ID as their instance ID. */
export const getCustomLabOptionId = (component: CircuitComponent): string | undefined => {
  if (component.catalogId && getCustomLabOption(component.catalogId)) return component.catalogId;
  return customLabOptions.find(option => component.id === `custom_${option.id}`)?.id;
};

export const CUSTOM_POWER_STACK_POSITIONS = {
  custom_transformer: { x: 135, y: 155 },
  custom_psu: { x: 135, y: 405 }
} as const;

const createPowerStack = (): CircuitComponent[] => [
  {
    id: 'custom_transformer',
    type: 'transformer',
    ...CUSTOM_POWER_STACK_POSITIONS.custom_transformer,
    label: '24V Transformer',
    terminals: [
      { id: 'pos', name: '(+)', type: 'pos', x: -20, y: 35 },
      { id: 'neg', name: '(-)', type: 'neg', x: 20, y: 35 }
    ],
    state: {}
  },
  {
    id: 'custom_psu',
    type: 'power_supply',
    ...CUSTOM_POWER_STACK_POSITIONS.custom_psu,
    label: 'AL600 Power Supply',
    terminals: [
      { id: 'ac1', name: 'AC', type: 'in', x: -45, y: 35 },
      { id: 'ac2', name: 'AC', type: 'in', x: -15, y: 35 },
      { id: 'pos', name: '(+)', type: 'pos', x: 15, y: 35 },
      { id: 'neg', name: '(-)', type: 'neg', x: 45, y: 35 }
    ],
    state: { requireAcInput: true, outputVoltage: 24 }
  }
];

let customInstanceSequence = 0;

// Include labels and terminals in the footprint so new devices remain easy to grab.
const getPlacementSize = (component: Pick<CircuitComponent, 'type' | 'terminals' | 'state'>) => {
  const sizes: Partial<Record<ComponentType, [number, number]>> = {
    transformer: [160, 100], power_supply: [100, 90], timer_relay: [95, 120],
    relay: [70, 95], relay_dpdt: [85, 120], relay_rb1224: [85, 115],
    relay_rbsnttl: [95, 120], pull_station: [85, 145], key_switch: [80, 105],
    card_reader: [60, 110], wave_sensor: [75, 140], powered_signal: [100, 150], maglock: [90, 80],
    door_strike: [70, 80], actuator: [180, 80], sliding_gate: [145, 100], automatic_door_operator: [145, 120],
    cube_power: [120, 105], sm500_maglock: [90, 135], cx12plus: [185, 165],
    wireless_transmitter: [65, 110], kr2402_remote: [58, 135], wireless_relay_kr2402: [105, 105], seco_larm_strobe_siren: [80, 115]
  };
  const [width, height] = sizes[component.type] ?? [80, 85];
  // These baseline sizes include the standard display scale; honour enlarged devices too.
  const scale = Math.max(1, Number(component.state.scale) || 1);
  return {
    x: Math.max(width, ...component.terminals.map(terminal => Math.abs(terminal.x) + 25)) * scale,
    y: Math.max(height, ...component.terminals.map(terminal => Math.abs(terminal.y) + 30)) * scale
  };
};

export const findCustomLabPlacement = (
  template: Pick<CircuitComponent, 'type' | 'terminals' | 'state'>,
  existingComponents: CircuitComponent[],
  position?: { x: number; y: number }
) => {
  const size = getPlacementSize(template);
  const requestedPosition = position && Number.isFinite(position.x) && Number.isFinite(position.y);
  const origin = requestedPosition
    ? { x: position.x, y: position.y }
    : { x: 400, y: Math.max(170, size.y + 24) };
  const hasSpace = (point: { x: number; y: number }) =>
    (requestedPosition || (point.x >= size.x + 24 && point.y >= size.y + 24)) && existingComponents.every(component => {
      const other = getPlacementSize(component);
      return Math.abs(component.x - point.x) >= size.x + other.x + 28 ||
        Math.abs(component.y - point.y) >= size.y + other.y + 28;
    });

  if (hasSpace(origin)) return origin;

  // Library additions stay in the upper work area and grow from left to right.
  // This keeps new devices visible instead of sending them toward the limited
  // space at the bottom of the canvas.
  if (!requestedPosition) {
    const candidate = { ...origin };
    while (!hasSpace(candidate)) {
      const blockers = existingComponents.filter(component => {
        const other = getPlacementSize(component);
        return Math.abs(component.x - candidate.x) < size.x + other.x + 28 &&
          Math.abs(component.y - candidate.y) < size.y + other.y + 28;
      });
      candidate.x = Math.max(
        candidate.x + 100,
        ...blockers.map(component => component.x + size.x + getPlacementSize(component).x + 28)
      );
    }
    return candidate;
  }

  // Expanding rings have no reused fallback slot, even after the original bench fills up.
  for (let ring = 1; ; ring += 1) {
    const candidates: { x: number; y: number }[] = [];
    for (let offset = -ring; offset <= ring; offset += 1) {
      candidates.push(
        { x: origin.x + offset * 100, y: origin.y + ring * 100 },
        { x: origin.x + offset * 100, y: origin.y - ring * 100 }
      );
      if (Math.abs(offset) !== ring) candidates.push(
        { x: origin.x + ring * 100, y: origin.y + offset * 100 },
        { x: origin.x - ring * 100, y: origin.y + offset * 100 }
      );
    }
    candidates.sort((a, b) =>
      Math.hypot(a.x - origin.x, a.y - origin.y) - Math.hypot(b.x - origin.x, b.y - origin.y) ||
      a.y - b.y || a.x - b.x
    );
    const available = candidates.find(hasSpace);
    if (available) return available;
  }
};

export const createCustomLabComponent = (
  optionId: string,
  existingComponents: CircuitComponent[] = [],
  position?: { x: number; y: number }
): CircuitComponent | null => {
  const option = getCustomLabOption(optionId);
  if (!option) return null;

  const slot = findCustomLabPlacement(option.template, existingComponents, position);
  let id: string;
  do {
    id = `custom_${option.id}_${Date.now().toString(36)}_${customInstanceSequence++}`;
  } while (existingComponents.some(component => component.id === id));
  const instanceNumber = existingComponents
    .filter(component => getCustomLabOptionId(component) === optionId)
    .reduce((highest, component) => Math.max(highest, Number(component.label.match(/#(\d+)$/)?.[1]) || 1), 0) + 1;

  return {
    id,
    catalogId: option.id,
    type: option.template.type,
    x: slot.x,
    y: slot.y,
    label: `${option.template.label} #${instanceNumber}`,
    terminals: option.template.terminals.map(terminal => ({ ...terminal })),
    state: structuredClone(option.template.state)
  };
};

export const buildCustomLabComponents = (selectedIds: string[]): CircuitComponent[] => {
  const components = createPowerStack();

  selectedIds.filter(optionId => getCustomLabOption(optionId)).slice(0, MAX_CUSTOM_COMPONENTS).forEach(optionId => {
    const component = createCustomLabComponent(optionId, components);
    if (component) components.push(component);
  });

  return components;
};
