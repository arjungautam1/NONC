import type { CircuitComponent, Wire } from '../types/game';
import { buildCustomLabComponents, getCustomLabOption } from './componentCatalog';
import { CX12PLUS_MODES } from '../components/game/components/cx12plusPinout';

export const CX12_EXAMPLES = [
  { id: 'standard', mode: '1', title: 'Single door', page: 6, steps: 'Press Inside or Outside: their COM/NO contacts connect to DRY1 in parallel. The strike releases, then the operator opens. Both outputs time out.' },
  { id: 'apartment', mode: '1', title: 'Apartment · powered interphone', page: 8, steps: 'Press Interphone to release the strike only. Courtesy opens the door while the strike is released. Inside always unlocks and opens.' },
  { id: 'apartment-key', mode: '1', title: 'Apartment · dry interphone + key', page: 9, steps: 'Interphone or the key supplies a switched powered signal to WET1. Courtesy opens only during the unlock window. Turn the maintained key back OFF to re-arm.' },
  { id: 'one-way', mode: '1', title: 'Two doors · one direction', page: 3, steps: 'Press Start: Door 1 opens first; Door 2 opens after the sequence delay.' },
  { id: 'access', mode: '2', title: 'Maintained access control', page: 7, steps: 'Turn Access ON to keep the strike released. Outside works only while access is granted. Inside always unlocks and opens.' },
  { id: 'smoke', mode: '3', title: 'Maintained operator / smoke evacuation', page: 10, steps: 'Turn Fire signal or Presence ON: the strike releases briefly, then the operator stays activated until both signals are OFF.' },
  { id: 'latch', mode: '4', title: 'Latching operator', page: 11, steps: 'Press Start once to release the strike and latch the operator after the delay. Press again to release the operator.' },
  { id: 'ratchet', mode: '4', title: 'Ratchet · two doors', page: 12, steps: 'Press Start to latch Door 1, then Door 2. Press again to release both.' },
  { id: 'bidirectional', mode: '5', title: 'Two doors · momentary', page: 13, steps: 'Press Side 1 or Side 2: the near door opens first, then the far door. A held input times out; the other input still works.' },
  { id: 'maintained', mode: '6', title: 'Two doors · maintained', page: 13, steps: 'Turn Side 1 or Side 2 ON to hold its door activated. The other door receives a timed activation after the delay. Turn OFF to let the near door time out.' },
  { id: 'washroom-unlocked', mode: '7', title: 'Washroom · normally unlocked', page: 14, steps: 'Outside opens when available. Once the door closes, press Push to lock: outside is disabled. Inside opens and resets occupancy. The door handle demonstrates manual exit.' },
  { id: 'washroom-locked', mode: '8', title: 'Washroom · normally locked', page: 15, steps: 'Press Access granted to unlock and open. After closing, Push to lock disables outside access and double-clicks the strike. Inside or manual exit resets occupancy; the strike re-locks.' }
] as const;

export type CX12ExampleId = (typeof CX12_EXAMPLES)[number]['id'];

/** Teaching circuits follow the manual pinout; generic switches stand in for panel outputs. */
export function buildCX12Example(id: CX12ExampleId) {
  const example = CX12_EXAMPLES.find(item => item.id === id);
  if (!example) throw new Error(`Unknown CX-12 example: ${id}`);
  const components = buildCustomLabComponents([]);
  const wires: Wire[] = [];
  const add = (optionId: string, role: string, label: string, x: number, y: number) => {
    const option = getCustomLabOption(optionId);
    if (!option) throw new Error(`Missing catalog device: ${optionId}`);
    const component: CircuitComponent = {
      ...structuredClone(option.template), id: `cx12_example_${role}`, catalogId: optionId, label, x, y
    };
    components.push(component);
    return component.id;
  };
  const wire = (a: string, at: string, b: string, bt: string, color: Wire['color'] = 'green') => {
    wires.push({ id: `cx12_example_wire_${wires.length}`, fromComponentId: a, fromTerminalId: at,
      toComponentId: b, toTerminalId: bt, color });
  };
  wire('custom_transformer', 'pos', 'custom_psu', 'ac1', 'red');
  wire('custom_transformer', 'neg', 'custom_psu', 'ac2', 'black');
  const board = add('cx12plus', 'board', 'Camden CX-12 Plus', 650, 185);
  components.find(c => c.id === board)!.state.cx12Config = {
    sw: [...CX12PLUS_MODES.find(mode => mode.mode === example.mode)!.sw], dorRl1: 5, dooRl2: 2, dorRl2: 4
  };
  wire('custom_psu', 'pos', board, 'pos', 'red');
  wire('custom_psu', 'neg', board, 'neg', 'black');
  const dry = (role: string, label: string, input: 'dry1' | 'dry2', x: number, y: number, maintained = false) => {
    const sw = add(maintained ? 'maintained_spdt' : 'visionis_vis7039', role, label, x, y);
    wire(sw, 'com', board, `${input}_a`);
    wire(sw, 'no', board, `${input}_b`);
  };
  const wet = (role: string, label: string, input: 'wet1' | 'wet2', x: number, y: number, maintained = false) => {
    if ((id === 'apartment-key' && role === 'interphone') || (id.startsWith('washroom') && !(id === 'washroom-locked' && role === 'outside'))) {
      // Diagram 2c converts a dry interphone contact into a wet request by
      // switching the supply through it; the contact itself stays voltage-free.
      const sw = add('visionis_vis7039', role, label, x, y);
      wire('custom_psu', 'pos', sw, 'com', 'red');
      wire(sw, 'no', board, `${input}_a`, 'red');
      wire('custom_psu', 'neg', board, `${input}_b`, 'black');
      return sw;
    }
    const sw = add(maintained ? 'powered_request_maintained' : 'powered_request_momentary', role, label, x, y);
    wire('custom_psu', 'pos', sw, 'pos', 'red');
    wire('custom_psu', 'neg', sw, 'neg', 'black');
    wire(sw, 'out', board, `${input}_a`, 'red');
    wire(sw, 'com', board, `${input}_b`, 'black');
    return sw;
  };
  const door = (role: string, label: string, relay: '1' | '2', x: number, y: number) => {
    const operator = add('automatic_door_operator', role, label, x, y);
    wire(board, `no${relay}`, operator, 'act');
    wire(board, `com${relay}`, operator, 'com');
    return operator;
  };
  const twoDoors = ['one-way', 'ratchet', 'bidirectional', 'maintained'].includes(id);
  const washroom = id.startsWith('washroom');
  const operator = door('door', twoDoors ? 'Door 2' : 'Door operator', '2', 1040, 180);
  if (twoDoors) {
    door('door1', 'Door 1', '1', 1040, 435);
  } else {
    const normallyUnlocked = id === 'washroom-unlocked';
    // Diagram 6: fail-safe strike on 3/4; Diagram 7: fail-secure on 3/4.
    const strike = add(normallyUnlocked ? 'door_strike_fail_safe' : 'door_strike_fail_secure', 'strike', normallyUnlocked ? 'Fail-safe strike' : 'Fail-secure strike', 1040, 440);
    wire('custom_psu', 'pos', board, 'com1', 'red');
    wire(board, 'no1', strike, 'in', 'red');
    wire('custom_psu', 'neg', strike, 'out', 'black');
    components.find(c => c.id === operator)!.state.lockComponentId = strike;
    components.find(c => c.id === operator)!.state.locked = !normallyUnlocked;
  }
  if (washroom) {
    components.find(c => c.id === operator)!.state.doorLabel = 'WASHROOM';
    wet('outside', id === 'washroom-locked' ? 'Access granted' : 'Outside', 'wet1', 345, 155);
    wet('inside', 'Inside', 'wet2', 345, 375);
    dry('lock', 'Push to lock', 'dry1', 600, 435);
    components.find(c => c.id === 'cx12_example_lock')!.state.controlRole = 'lock';
    const contact = add('nascom_n282txg', 'contact', 'Door contact · follows door', 820, 445);
    components.find(c => c.id === contact)!.state.doorOperatorId = operator;
    // NASCOM marks reed-rest contacts: COM-NO is closed with the magnet present.
    // This supplies the manual's required closed-at-rest circuit to DRY2.
    wire(contact, 'com', board, 'dry2_a');
    wire(contact, 'no', board, 'dry2_b');
  } else if (id === 'access') {
    wet('access', 'Access ON / OFF', 'wet1', 345, 155, true);
    dry('inside', 'Inside', 'dry1', 345, 375);
    dry('outside', 'Outside', 'dry2', 345, 600);
  } else if (id === 'smoke') {
    wet('fire', 'Fire signal ON / OFF', 'wet2', 345, 155, true);
    dry('presence', 'Presence ON / OFF', 'dry1', 345, 375, true);
  } else if (id === 'apartment' || id === 'apartment-key') {
    wet('interphone', 'Interphone', 'wet1', 345, 155);
    dry('inside', 'Inside', 'dry1', 345, 375);
    dry('courtesy', 'Courtesy', 'dry2', 600, 435);
    if (id === 'apartment-key') {
      const key = add('maintained_key_switch', 'key', 'Vestibule key', 810, 440);
      wire('custom_psu', 'pos', key, 'pos', 'red');
      wire('custom_psu', 'neg', key, 'neg', 'black');
      wire('custom_psu', 'pos', key, 'com', 'red');
      wire(key, 'no', board, 'wet1_a', 'red');
    }
  } else if (id === 'bidirectional' || id === 'maintained') {
    dry('side1', 'Side 1', 'dry1', 345, 155, id === 'maintained');
    dry('side2', 'Side 2', 'dry2', 345, 375, id === 'maintained');
  } else {
    dry('start', id === 'standard' ? 'Inside' : 'Start', id === 'ratchet' ? 'dry2' : 'dry1', 345, 155);
    // Real wall buttons use isolated COM/NO contacts in parallel on DRY1.
    if (id === 'standard' || id === 'latch') dry('outside', 'Outside', 'dry1', 345, 375);
  }
  components.find(c => c.id === board)!.state.cx12ExampleId = id;
  return { components, wires };
}
