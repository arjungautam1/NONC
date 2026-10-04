// Run: npx tsx tests/cx12Examples.test.ts
import assert from 'node:assert/strict';
import { useGameStore } from '../src/store/useGameStore';
import { soundManager } from '../src/audio/soundManager';
import { CX12_EXAMPLES, buildCX12Example, type CX12ExampleId } from '../src/customLab/cx12Examples';
import { solveCircuit } from '../src/simulation/circuitSolver';

soundManager.setMuted(true);
const realSetTimeout = globalThis.setTimeout;
const realSetInterval = globalThis.setInterval;
let time = 0;
let sequence = 0;
let jobs: { time: number; order: number; callback: () => void }[] = [];
globalThis.setTimeout = ((callback: () => void, delay = 0) => {
  jobs.push({ time: time + delay, order: ++sequence, callback });
  return sequence;
}) as unknown as typeof setTimeout;
globalThis.setInterval = (() => ++sequence) as unknown as typeof setInterval;
const advance = (ms: number) => {
  const end = time + ms;
  for (;;) {
    jobs.sort((a, b) => a.time - b.time || a.order - b.order);
    if (!jobs.length || jobs[0].time > end) break;
    const job = jobs.shift()!;
    time = job.time;
    job.callback();
  }
  time = end;
};
const state = () => useGameStore.getState();
const component = (role: string) => state().components.find(c => c.id === `cx12_example_${role}`)!;
const relays = (a: boolean, b: boolean) => {
  assert.equal(component('board').state.relay1Active, a, 'Relay 1');
  assert.equal(component('board').state.relay2Active, b, 'Relay 2');
  const groups = state().simulation.terminalGroups;
  for (const [n, active] of [[1, a], [2, b]] as const) {
    assert.equal(groups[`cx12_example_board:com${n}`] === groups[`cx12_example_board:no${n}`], active, `NO${n} continuity`);
    assert.equal(groups[`cx12_example_board:com${n}`] === groups[`cx12_example_board:nc${n}`], !active, `NC${n} continuity`);
  }
};
const press = (role: string) => {
  state().pressButton(component(role).id, true);
  state().pressButton(component(role).id, false);
};
const toggle = (role: string) => state().toggleSwitch(component(role).id);
const load = (id: CX12ExampleId) => {
  jobs = []; time = 0;
  state().loadCX12Example(id);
  assert.equal(state().isRunning, false);
  state().toggleSimulation();
  assert.equal(component('board').state.boardPowered, true, `${id} powered`);
  assert.equal(state().simulation.shortCircuit, false, `${id} no short`);
  relays(false, false);
};
try {
  // Every supplied example has valid endpoints, unique IDs, and no initial short.
  for (const example of CX12_EXAMPLES) {
    const circuit = buildCX12Example(example.id);
    assert.equal(new Set(circuit.components.map(c => c.id)).size, circuit.components.length);
    for (const wire of circuit.wires) for (const [id, pin] of [[wire.fromComponentId, wire.fromTerminalId], [wire.toComponentId, wire.toTerminalId]]) {
      assert(circuit.components.find(c => c.id === id)?.terminals.some(t => t.id === pin));
    }
    load(example.id);
  }
  for (const id of ['standard', 'one-way'] as const) {
    load(id); press('start'); relays(true, false);
    advance(1999); relays(true, false); advance(1); relays(true, true);
    advance(3000); relays(false, true); advance(1000); relays(false, false);
  }
  load('standard'); press('powered'); relays(true, false); advance(2000); relays(true, true);
  // A stuck momentary input expires; another isolated input still operates.
  load('standard'); state().pressButton(component('start').id, true); advance(7000); relays(false, false);
  press('powered'); relays(true, false);
  for (const id of ['apartment', 'apartment-key'] as const) {
    load(id); press('courtesy'); relays(false, false);
    press('interphone'); relays(true, false); advance(2000); relays(true, false);
    press('courtesy'); relays(true, true); advance(5000); relays(false, false);
    press('inside'); relays(true, false); advance(2000); relays(true, true);
    if (id === 'apartment-key') { advance(7000); toggle('key'); relays(true, false); }
  }
  load('access'); press('outside'); relays(false, false);
  toggle('access'); relays(true, false); advance(8000); relays(true, false);
  press('outside'); relays(true, true); advance(4000); relays(true, false);
  toggle('access'); relays(false, false); press('inside'); relays(true, false); advance(2000); relays(true, true);
  for (const role of ['fire', 'presence']) {
    load('smoke'); toggle(role); relays(true, false); advance(2000); relays(true, true);
    advance(10000); relays(false, true); toggle(role); relays(false, false);
  }
  load('smoke'); toggle('fire'); advance(500); toggle('fire'); advance(3000); relays(true, false);
  load('latch'); press('start'); relays(true, false); advance(2000); relays(true, true);
  advance(10000); relays(false, true); press('start'); relays(false, false);
  load('latch'); press('start'); advance(500); press('start'); advance(3000); relays(true, false);
  load('ratchet'); press('start'); relays(true, false); advance(2000); relays(true, true);
  advance(10000); relays(true, true); press('start'); relays(false, false);
  load('ratchet'); press('start'); advance(500); press('start'); advance(3000); relays(false, false);
  load('bidirectional'); press('side1'); relays(true, false); advance(2000); relays(true, true);
  advance(7000); relays(false, false); press('side2'); relays(false, true); advance(2000); relays(true, true);
  load('maintained'); toggle('side1'); relays(true, false); advance(2000); relays(true, true);
  advance(7000); relays(true, false); toggle('side1'); relays(false, false);
  toggle('side2'); relays(false, true); advance(2000); relays(true, true); advance(7000); relays(false, true);
  toggle('side2'); relays(false, false);
  load('maintained'); toggle('side1'); advance(100); toggle('side1'); advance(1900); relays(true, true);
  for (const id of ['washroom-unlocked', 'washroom-locked'] as const) {
    load(id); assert.equal(component('board').state.dry2Active, true);
    press('outside'); advance(2000); assert.equal(component('door').state.active, true);
    // Travel drives the real contact circuit, rather than bypassing the controller.
    state().tickMotion(); assert.equal(component('contact').state.toggled, true);
    advance(8000); for (let i = 0; i < 25; i++) state().tickMotion();
    assert.equal(component('contact').state.toggled, false);
    press('lock'); assert.equal(component('board').state.occupied, true);
    if (id === 'washroom-locked') {
      relays(true, false); advance(150); relays(false, false); advance(150); relays(true, false); advance(150); relays(false, false);
    } else relays(true, false);
    press('outside'); assert.equal(component('board').state.relay2Active, false);
    press('inside'); assert.equal(component('board').state.occupied, false); advance(2000); assert.equal(component('door').state.active, true);
    advance(8000); for (let i = 0; i < 25; i++) state().tickMotion();
    press('lock'); advance(500); state().setComponentState(component('door').id, 'manualOpen', true);
    assert.equal(component('board').state.occupied, false);
  }
  // The user-requested key power interlock must work in both UI action and solver.
  for (const pin of ['pos', 'neg']) {
    load('apartment-key');
    const supply = state().wires.find(w => w.toComponentId === component('key').id && w.toTerminalId === pin)!;
    state().removeWire(supply.id);
    assert.equal(component('key').state.powered, false);
    toggle('key'); assert.equal(component('key').state.toggled, false);
    relays(false, false);
    // A stale saved ON position must not bypass loss of power.
    state().setComponentState(component('key').id, 'toggled', true);
    assert.equal(component('board').state.wet1Active, false);
    relays(false, false);
    state().addWire(supply.fromComponentId, supply.fromTerminalId, supply.toComponentId, supply.toTerminalId, supply.color);
    assert.equal(component('key').state.powered, true);
    relays(true, false);
  }
  // A powered output needs both supply rails; dry contacts need no supply.
  load('standard');
  const powered = component('powered');
  state().pressButton(powered.id, true);
  assert.equal(powered.type, 'powered_signal');
  assert.equal(component('board').state.wet2Active, true);
  assert.equal(state().simulation.nodeVoltages[`${powered.id}:out`], 24);
  state().pressButton(powered.id, false); advance(8000);
  const supplyWire = state().wires.find(w => w.toComponentId === powered.id && w.toTerminalId === 'neg')!;
  state().removeWire(supplyWire.id); state().pressButton(powered.id, true);
  assert.equal(component('powered').state.powered, false);
  assert.equal(component('board').state.wet2Active, false);
  relays(false, false);
  press('start'); relays(true, false);
  load('access'); toggle('access');
  state().toggleSimulation();
  assert.equal(component('access').state.powered, false);
  assert.equal(component('board').state.wet1Active, false);

  // Power loss cancels queued opening; a new runtime cannot inherit an old timeout.
  load('standard'); press('start'); advance(500); state().toggleSimulation(); advance(3000); relays(false, false);
  state().toggleSimulation(); relays(false, false); advance(5000); relays(false, false);
  load('standard'); press('start'); advance(500); state().resetLab(); advance(3000);
  assert(state().components.every(c => c.type !== 'cx12plus' || !c.state.relay2Active));
  // Board supply is 12/24V, whereas only wet triggers have the broader 3-30V range.
  for (const voltage of [12, 24, 5, 30]) {
    const circuit = buildCX12Example('standard');
    const source = circuit.components.find(c => c.id === 'custom_psu')!;
    source.state.outputVoltage = voltage;
    assert.equal(solveCircuit(circuit.components, circuit.wires, true).energizedComponents.has('cx12_example_board'), voltage === 12 || voltage === 24);
  }
  load('standard'); const before = state().wires.map(w => w.id); state().loadCX12Example('ratchet'); state().undo();
  assert.deepEqual(state().wires.map(w => w.id), before, 'Undo restores replaced bench');
  console.log('PASS: 12 wired examples, all 8 modes, timing, contact outputs, stuck inputs, occupancy, power loss, and Undo.');
} finally {
  state().stopTimer();
  globalThis.setTimeout = realSetTimeout;
  globalThis.setInterval = realSetInterval;
}
