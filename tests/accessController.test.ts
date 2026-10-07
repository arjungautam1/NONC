// Run: node_modules/.bin/jiti tests/accessController.test.ts
import assert from 'node:assert/strict';
import type { CircuitComponent, Wire } from '../src/types/game';
import { useGameStore } from '../src/store/useGameStore';
import { soundManager } from '../src/audio/soundManager';
import { accessControllerTerminals, accessReaderTerminals, DEFAULT_ACCESS_CONTROLLER_CONFIG } from '../src/components/game/components/accessControllerPinout';
import { solveCircuit } from '../src/simulation/circuitSolver';
import { ACCESS_CONTROL_CATALOG_IDS, getWorkspaceOptions } from '../src/customLab/componentCatalog';

soundManager.setMuted(true);
const originalNow = Date.now;
const originalSetInterval = globalThis.setInterval;
let now = 1_800_000_000_000;
Date.now = () => now;
globalThis.setInterval = (() => 1) as unknown as typeof setInterval;
const state = () => useGameStore.getState();
const device = (id: string) => state().components.find(component => component.id === id)!;
const terminal = (id: string) => ({ id, name: id, type: 'in' as const, x: 0, y: 0 });
const component = (id: string, type: CircuitComponent['type'], pins: string[], config: CircuitComponent['state'] = {}): CircuitComponent =>
  ({ id, type, label: id, x: 0, y: 0, terminals: pins.map(terminal), state: config });

function fixture() {
  const components: CircuitComponent[] = [
    component('supply', 'power_supply', ['pos', 'neg'], { outputVoltage: 12 }),
    { ...component('board', 'access_controller', [], { accessConfig: structuredClone(DEFAULT_ACCESS_CONTROLLER_CONFIG) }), terminals: accessControllerTerminals() },
    component('strike', 'door_strike', ['in', 'out'], { failSecure: true }),
    component('maglock', 'maglock', ['in', 'out'])
  ];
  const wires: Wire[] = [];
  const connect = (from: string, fromPin: string, to: string, toPin: string) => wires.push({
    id: `${from}_${fromPin}_${to}_${toPin}`, fromComponentId: from, fromTerminalId: fromPin,
    toComponentId: to, toTerminalId: toPin, color: fromPin.includes('pos') ? 'red' : 'green'
  });
  connect('supply', 'pos', 'board', 'pos'); connect('supply', 'neg', 'board', 'neg');
  for (const door of [1, 2]) {
    const reader = { ...component(`reader${door}`, 'access_reader', [], { authorized: true, scanSequence: 0 }), terminals: accessReaderTerminals() };
    components.push(reader, component(`rex${door}`, 'button_no', ['com', 'no', 'nc']), component(`contact${door}`, 'door_sensor', ['com', 'no', 'nc']));
    for (const [panel, pin] of [['pos', 'pos'], ['gnd', 'neg'], ['d0', 'd0'], ['d1', 'd1'], ['led', 'led'], ['buz', 'buz']]) {
      connect('board', `reader${door}_${panel}`, reader.id, pin);
    }
    connect('board', `rex${door}`, `rex${door}`, 'no'); connect('board', `input_gnd${door}`, `rex${door}`, 'com');
    connect('board', `dc${door}`, `contact${door}`, 'no'); connect('board', `input_gnd${door}`, `contact${door}`, 'com');
    connect('supply', 'pos', 'board', `com${door}`);
  }
  connect('board', 'no1', 'strike', 'in'); connect('supply', 'neg', 'strike', 'out');
  connect('board', 'nc2', 'maglock', 'in'); connect('supply', 'neg', 'maglock', 'out');
  return { components, wires };
}
const load = () => {
  state().startCustomLab([]);
  const circuit = fixture();
  state().setViewMode('lab');
  useGameStore.setState({ components: circuit.components, wires: circuit.wires, isRunning: false });
  state().toggleSimulation();
  assert.equal(device('board').state.boardPowered, true);
  assert.equal(device('board').state.door1Status, 'closed');
  assert.equal(device('board').state.door2Status, 'closed');
  assert.equal(state().simulation.shortCircuit, false);
};
const scan = (door: 1 | 2) => state().scanAccessReader(`reader${door}`);
const advance = (seconds: number) => { now += seconds * 1000; state().tickMotion(); };
const remove = (from: string, fromPin: string, to: string, toPin: string) => {
  const wire = state().wires.find(candidate => candidate.fromComponentId === from && candidate.fromTerminalId === fromPin
    && candidate.toComponentId === to && candidate.toTerminalId === toPin)!;
  assert(wire, 'fixture wire exists'); state().removeWire(wire.id); return wire;
};
const restore = (wire: Wire) => state().addWire(wire.fromComponentId, wire.fromTerminalId, wire.toComponentId, wire.toTerminalId, wire.color);
const relays = (first: boolean, second: boolean) => {
  assert.equal(device('board').state.relay1Active, first);
  assert.equal(device('board').state.relay2Active, second);
  assert.equal(device('strike').state.active, first, 'NO relay feeds fail-secure strike');
  assert.equal(device('maglock').state.active, !second, 'NC relay feeds fail-safe maglock');
  for (const [door, active] of [[1, first], [2, second]]) {
    const groups = state().simulation.terminalGroups;
    assert.equal(groups[`board:com${door}`] === groups[`board:no${door}`], active);
    assert.equal(groups[`board:com${door}`] === groups[`board:nc${door}`], !active);
  }
};

try {
  assert.equal(state().workspaceKind, 'electronics'); assert.equal(state().isCustomLab, true);
  assert(state().components.every(item => ['ac_source', 'transformer', 'power_supply'].includes(item.type)), 'electronics starts with clean power stack');
  assert.equal(state().wires.length, 0);
  assert(getWorkspaceOptions('electronics').every(option => !ACCESS_CONTROL_CATALOG_IDS.has(option.id)), 'electronics library excludes every access-control device');
  load(); relays(false, false); assert.equal(device('reader1').state.powered, true);
  scan(1); relays(true, false); assert.equal(device('reader1').state.feedback, 'granted');
  assert.equal(device('reader1').state.ledActive, true); assert.equal(device('reader1').state.buzzerActive, true);
  advance(2); assert.equal(device('reader1').state.ledActive, false);
  scan(2); relays(true, true); advance(3); relays(false, true); advance(2); relays(false, false);
  state().setComponentState('reader1', 'authorized', false); scan(1); relays(false, false);
  assert.equal(device('reader1').state.feedback, 'denied');
  assert(device('board').state.accessEvents.some((event: { event: string }) => event.event === 'Access denied'));

  // Scans require both matching signal wires and a working reader power return.
  for (const pin of ['d0', 'd1', 'gnd', 'pos']) {
    load(); const wire = remove('board', `reader1_${pin}`, 'reader1', pin === 'gnd' ? 'neg' : pin);
    scan(1); relays(false, false);
    assert.notEqual(device('reader1').state.feedback, 'granted');
    restore(wire); relays(false, false); scan(1); relays(true, false);
  }
  load(); remove('board', 'reader1_d0', 'reader1', 'd0'); remove('board', 'reader1_d1', 'reader1', 'd1');
  state().addWire('board', 'reader1_d0', 'reader1', 'd1', 'green');
  state().addWire('board', 'reader1_d1', 'reader1', 'd0', 'green'); scan(1); relays(false, false);
  load(); state().addWire('reader1', 'd0', 'reader1', 'd1', 'green'); scan(1); relays(false, false);
  load(); remove('board', 'reader1_led', 'reader1', 'led'); scan(1); relays(true, false);
  assert.equal(device('reader1').state.ledActive, false, 'LED wire does not gate permission');

  // A dry lock contact provides no power unless COM is supplied externally.
  load(); remove('supply', 'pos', 'board', 'com1'); scan(1);
  assert.equal(device('board').state.relay1Active, true); assert.equal(device('strike').state.active, false);
  load(); scan(1); const powerWire = remove('supply', 'pos', 'board', 'pos');
  assert.equal(device('board').state.boardPowered, false); assert.equal(device('board').state.relay1Active, false);
  assert.equal(device('reader1').state.powered, false); assert.equal(state().simulation.nodeVoltages['board:reader1_pos'], 0);
  restore(powerWire); relays(false, false); advance(10); relays(false, false); scan(1); relays(true, false);
  state().toggleSimulation(); state().toggleSimulation(); relays(false, false);
  assert.equal(device('reader1').state.ledActive, false, 'power restoration cannot replay saved feedback');
  assert.equal(device('reader1').state.buzzerActive, false);
  scan(1); relays(true, false);
  state().toggleSimulation(); scan(1); advance(10); state().toggleSimulation(); relays(false, false);

  // Unknown/missing contact wiring must not be silently treated as closed.
  load(); state().toggleSwitch('contact1'); assert.equal(device('board').state.door1Status, 'forced-open');
  state().toggleSwitch('contact1'); assert.equal(device('board').state.door1Status, 'closed');
  scan(1); advance(1); state().toggleSwitch('contact1'); assert.equal(device('board').state.door1Status, 'open');
  advance(4); relays(false, false); assert.equal(device('board').state.door1Status, 'open');
  advance(6); assert.equal(device('board').state.door1Status, 'held-open');
  state().toggleSwitch('contact1'); assert.equal(device('board').state.door1Status, 'closed');
  remove('board', 'input_gnd1', 'contact1', 'com'); assert.equal(device('board').state.door1Status, 'wiring-fault');
  remove('board', 'dc1', 'contact1', 'no'); assert.equal(device('board').state.door1Status, 'unmonitored');

  // NO and NC REX work as edges and expire even if the input remains held.
  load(); state().pressButton('rex1', true); relays(true, false); advance(5); relays(false, false);
  state().pressButton('rex1', false); state().pressButton('rex1', true); relays(true, false);
  load(); remove('board', 'rex1', 'rex1', 'no'); state().addWire('board', 'rex1', 'rex1', 'nc', 'green');
  state().configureAccessController('board', { door1: { ...DEFAULT_ACCESS_CONTROLLER_CONFIG.door1, rexNormallyClosed: true } });
  relays(false, false); state().pressButton('rex1', true); relays(true, false); advance(5); relays(false, false);
  state().pressButton('rex1', false); remove('board', 'input_gnd1', 'rex1', 'com');
  state().pressButton('rex1', true); relays(false, false); assert.equal(device('board').state.rex1Wired, false);
  load(); state().configureAccessController('board', { door1: { ...DEFAULT_ACCESS_CONTROLLER_CONFIG.door1, rexUnlock: false } });
  state().pressButton('rex1', true); relays(false, false); state().pressButton('rex1', false);
  advance(1); state().toggleSwitch('contact1');
  assert.equal(device('board').state.door1Status, 'open', 'REX shunt permits monitored exit without relay unlock');
  load(); state().configureAccessController('board', { door1: { ...DEFAULT_ACCESS_CONTROLLER_CONFIG.door1, rexUnlock: false } });
  state().pressButton('rex1', true); state().pressButton('rex1', false); advance(5); state().toggleSwitch('contact1');
  assert.equal(device('board').state.door1Status, 'forced-open', 'REX shunt expires without door passage');

  // The custom board is a polarity-sensitive 12V DC device, not an Atrium clone.
  for (const voltage of [5, 10, 11, 12, 15, 16, 24]) {
    const circuit = fixture(); circuit.components[0].state.outputVoltage = voltage;
    const solved = solveCircuit(circuit.components, circuit.wires, true);
    assert.equal(solved.energizedComponents.has('board'), voltage >= 11 && voltage <= 15);
  }
  const reversed = fixture(); reversed.wires[0].toTerminalId = 'neg'; reversed.wires[1].toTerminalId = 'pos';
  assert.equal(solveCircuit(reversed.components, reversed.wires, true).energizedComponents.has('board'), false);
  const rawAc = fixture(); rawAc.components[0].type = 'transformer'; rawAc.components[0].state.outputVoltage = 12;
  assert.equal(solveCircuit(rawAc.components, rawAc.wires, true).energizedComponents.has('board'), false);

  // Each Home workspace preserves its own components, wiring and Undo stack.
  load(); remove('board', 'reader1_led', 'reader1', 'led');
  state().beginComponentMove('board'); state().updateComponentPosition('board', 125, 250); state().finishComponentMove('board');
  const electronicsWireIds = state().wires.map(wire => wire.id);
  const electronicsHistoryLength = state().history.length;
  state().setViewMode('home'); state().openAccessWorkspace();
  assert.equal(state().workspaceKind, 'access'); assert(device('ac2_board'));
  assert.equal(state().history.length, 0, 'first access bench does not inherit electronics Undo');
  state().beginComponentMove('ac2_board'); state().updateComponentPosition('ac2_board', 740, 380); state().finishComponentMove('ac2_board');
  const accessWireIds = state().wires.map(wire => wire.id);
  const accessHistoryLength = state().history.length;
  state().openElectronicsWorkspace(); assert.equal(state().workspaceKind, 'electronics');
  assert.equal(device('board').x, 125); assert.deepEqual(state().wires.map(wire => wire.id), electronicsWireIds);
  assert.equal(state().history.length, electronicsHistoryLength);
  state().openAccessWorkspace(); assert.equal(device('ac2_board').x, 740);
  assert.deepEqual(state().wires.map(wire => wire.id), accessWireIds); assert.equal(state().history.length, accessHistoryLength);
  state().toggleSimulation(); assert.equal(device('ac2_board').state.boardPowered, true, 'prewired default board runs');
  state().scanAccessReader('ac2_reader1'); assert.equal(device('ac2_board').state.relay1Active, true);
  state().openElectronicsWorkspace(); state().openAccessWorkspace();
  assert.equal(state().isRunning, false); assert.equal(device('ac2_board').state.relay1Active, false, 'workspace switch cancels pulses');
  state().loadCX12Example('standard', 'access'); assert.equal(state().workspaceKind, 'access');
  state().undo(); assert(device('ac2_board'), 'access legacy examples Undo remains in access bench');
  state().openElectronicsWorkspace(); assert(device('board')); assert.equal(device('board').x, 125);
  for (const id of ACCESS_CONTROL_CATALOG_IDS) assert.equal(state().addCustomLabComponent(id), null, `${id} stays in access workspace`);
  const preservedElectronicsHistoryLength = state().history.length;
  state().loadCX12Example('standard'); assert.equal(state().workspaceKind, 'access', 'door installation examples default to access workspace');
  state().openElectronicsWorkspace(); assert.equal(device('board').x, 125);
  assert.deepEqual(state().wires.map(wire => wire.id), electronicsWireIds);
  assert.equal(state().history.length, preservedElectronicsHistoryLength, 'default CX12 launch preserves independent electronics history');
  state().startCustomLab(['delmi_access_controller', 'bulb'], 'access');
  assert.equal(state().workspaceKind, 'access');
  assert(state().components.some(item => item.type === 'access_controller'));
  assert(!state().components.some(item => item.type === 'bulb'), 'stale selection cannot add electronics-only device');
  assert.equal(state().addCustomLabComponent('bulb'), null);
  console.log('PASS: wired two-door access, independent pulses, grant/deny, reader signal/power faults, optional feedback wires, dry locks, power loss/resume, DC alarms, NO/NC REX, 12V polarity/range.');
} finally {
  state().stopTimer(); Date.now = originalNow; globalThis.setInterval = originalSetInterval;
}
