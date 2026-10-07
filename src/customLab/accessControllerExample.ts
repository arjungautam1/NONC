import type { CircuitComponent, Wire } from '../types/game';
import { buildCustomLabComponents, getCustomLabOption } from './componentCatalog';

/** DELMI's own 12V training pinout; no manufacturer terminal numbering is implied. */
export function buildAccessControllerExample() {
  const components = buildCustomLabComponents([]);
  const wires: Wire[] = [];
  const add = (catalogId: string, role: string, label: string, x: number, y: number) => {
    const option = getCustomLabOption(catalogId);
    if (!option) throw new Error(`Missing training device: ${catalogId}`);
    const device: CircuitComponent = { ...structuredClone(option.template), catalogId,
      id: `ac2_${role}`, label, x, y };
    components.push(device);
    return device.id;
  };
  const wire = (from: string, fromPin: string, to: string, toPin: string, color: Wire['color'] = 'green') => {
    wires.push({ id: `ac2_wire_${wires.length}`, fromComponentId: from, fromTerminalId: fromPin,
      toComponentId: to, toTerminalId: toPin, color });
  };
  components.find(c => c.id === 'custom_psu')!.state.outputVoltage = 12;
  wire('custom_transformer', 'pos', 'custom_psu', 'ac1', 'red');
  wire('custom_transformer', 'neg', 'custom_psu', 'ac2', 'black');
  const board = add('delmi_access_controller', 'board', 'DELMI AC-2', 700, 350);
  components.find(c => c.id === board)!.state.accessExampleId = 'delmi-ac2';
  wire('custom_psu', 'pos', board, 'pos', 'red');
  wire('custom_psu', 'neg', board, 'neg', 'black');
  for (const n of [1, 2] as const) {
    const x = n === 1 ? 340 : 1080;
    const reader = add('delmi_wiegand_reader', `reader${n}`, `Door ${n} reader`, x, 165);
    const rex = add('visionis_vis7039', `rex${n}`, `Door ${n} REX`, x, 420);
    const contact = add('nascom_n282txg', `contact${n}`, `Door ${n} contact`, x, 680);
    for (const [readerPin, boardPin, color] of [
      ['pos', 'pos', 'red'], ['neg', 'gnd', 'black'], ['d0', 'd0', 'green'],
      ['d1', 'd1', 'gray'], ['led', 'led', 'orange'], ['buz', 'buz', 'gray']
    ] as const) wire(board, `reader${n}_${boardPin}`, reader, readerPin, color);
    wire(rex, 'com', board, `input_gnd${n}`, 'black');
    wire(rex, 'no', board, `rex${n}`);
    // NASCOM COM/NO is the closed-at-rest magnetic contact circuit.
    wire(contact, 'com', board, `input_gnd${n}`, 'black');
    wire(contact, 'no', board, `dc${n}`);
    const lock = add(n === 1 ? 'door_strike_fail_secure' : 'maglock_fail_safe', `lock${n}`,
      n === 1 ? 'Door 1 fail-secure strike' : 'Door 2 fail-safe maglock', n === 1 ? 600 : 870, 770);
    wire('custom_psu', 'pos', board, `com${n}`, 'red');
    wire(board, n === 1 ? 'no1' : 'nc2', lock, 'in', 'red');
    wire('custom_psu', 'neg', lock, 'out', 'black');
  }
  return { components, wires };
}
