// Run with: node scripts/check-custom-lab.mjs
// Vite loads the real TypeScript store; no browser or extra test dependency is needed.
import assert from 'node:assert/strict';
import { fileURLToPath } from 'node:url';
import { createServer } from 'vite';

const server = await createServer({
  root: fileURLToPath(new URL('..', import.meta.url)),
  configFile: false,
  server: { middlewareMode: true },
  appType: 'custom',
  logLevel: 'error'
});

try {
  const { useGameStore: store } = await server.ssrLoadModule('/src/store/useGameStore.ts');
  const catalog = await server.ssrLoadModule('/src/customLab/componentCatalog.ts');
  const { soundManager } = await server.ssrLoadModule('/src/audio/soundManager.ts');
  soundManager.setMuted(true);
  store.setState({ startTimer: () => {}, stopTimer: () => {} });
  const state = () => store.getState();
  const device = id => state().components.find(component => component.id === id);
  const count = optionId => state().customLabSelection.filter(id => id === optionId).length;

  state().startCustomLab(['bulb', 'bulb', 'timer_relay']);
  assert.equal(state().components.length, 5);
  assert.equal(count('bulb'), 2, 'Setup must preserve repeated catalog entries');
  assert.equal(new Set(state().components.map(component => component.id)).size, 5);
  const bulbs = state().components.filter(component => component.catalogId === 'bulb');
  assert.deepEqual(bulbs.map(component => component.label), ['Lightbulb #1', 'Lightbulb #2']);
  const timer = state().components.find(component => component.catalogId === 'timer_relay');
  state().configureTimerRelay(timer.id, { adjustment: 17 });
  state().setComponentState(timer.id, 'customSettings', { nested: { value: 3 } });
  const timerCopyId = state().duplicateCustomLabComponent(timer.id);
  assert.ok(timerCopyId);
  assert.equal(device(timerCopyId).label, 'Altronix 6062 Timer #2');
  assert.equal(device(timerCopyId).state.timer6062Config.adjustment, 17);
  assert.notEqual(device(timerCopyId).terminals, device(timer.id).terminals);
  assert.notEqual(device(timerCopyId).state.customSettings.nested, device(timer.id).state.customSettings.nested);
  state().configureTimerRelay(timerCopyId, { adjustment: 28 });
  assert.equal(device(timer.id).state.timer6062Config.adjustment, 17, 'Copy configuration must be independent');
  const newTimerId = state().addCustomLabComponent('timer_relay');
  assert.notEqual(device(newTimerId).state.timer6062Config, device(timer.id).state.timer6062Config);

  for (const bulb of bulbs) state().addWire('custom_psu', 'pos', bulb.id, 'in', 'red');
  const wireIds = state().wires.map(wire => wire.id);
  state().setProbe('red', { componentId: bulbs[0].id, terminalId: 'in' });
  state().removeCustomLabComponent(bulbs[0].id);
  assert.equal(count('bulb'), 1);
  assert.ok(device(bulbs[1].id));
  assert.equal(state().multimeter.redProbe, null);
  assert.equal(state().wires.length, 1, 'Removing one instance must preserve the other instance’s wire');
  assert.equal(state().wires[0].id, wireIds[1]);
  state().undo();
  assert.ok(device(bulbs[0].id));
  assert.equal(count('bulb'), 2);
  assert.equal(state().wires.length, 2);
  state().redo();
  assert.equal(count('bulb'), 1);
  assert.equal(state().wires.length, 1);
  state().undo();
  state().removeCustomLabComponent('bulb');
  assert.ok(device(bulbs[0].id));
  assert.equal(device(bulbs[1].id), undefined, 'Legacy catalog removal must remove only the last match');
  assert.equal(catalog.getCustomLabOptionId({ ...bulbs[0], id: 'custom_bulb', catalogId: undefined }), 'bulb');
  assert.equal(catalog.getCustomLabOptionId(device('custom_psu')), undefined);
  console.log('PASS repeated devices, independent configuration, targeted deletion, wires and history');

  const movingId = bulbs[0].id;
  const start = { x: device(movingId).x, y: device(movingId).y };
  const historyBeforeMove = state().history.length;
  state().beginComponentMove(movingId);
  state().updateComponentPosition(movingId, start.x + 10, start.y + 20);
  state().beginComponentMove(movingId);
  state().updateComponentPosition(movingId, start.x + 100, start.y + 120);
  state().finishComponentMove(movingId);
  assert.equal(state().history.length, historyBeforeMove + 1, 'A drag must produce exactly one undo entry');
  state().undo();
  assert.deepEqual({ x: device(movingId).x, y: device(movingId).y }, start);
  state().redo();
  assert.equal(device(movingId).x, start.x + 100);
  const historyAfterMove = state().history.length;
  state().beginComponentMove(movingId);
  state().finishComponentMove(movingId);
  assert.equal(state().history.length, historyAfterMove, 'Clicking without moving must not add history');
  state().beginComponentMove(movingId);
  state().updateComponentPosition(movingId, 1200, 1200);
  state().cancelComponentMove(movingId);
  assert.equal(device(movingId).x, start.x + 100);
  assert.equal(state().history.length, historyAfterMove);
  state().updateComponentPosition(movingId, NaN, 100);
  assert.equal(device(movingId).x, start.x + 100);
  console.log('PASS drag transactions, no-op movement and cancel');

  const beforeReset = structuredClone({ components: state().components, wires: state().wires });
  const selectionBeforeReset = [...state().customLabSelection];
  state().resetLab();
  assert.deepEqual(state().customLabSelection, selectionBeforeReset);
  assert.equal(state().wires.length, 0);
  state().undo();
  assert.deepEqual(state().components.map(component => component.id), beforeReset.components.map(component => component.id));
  assert.deepEqual(state().wires, beforeReset.wires);
  assert.equal(device(timer.id).state.timer6062Config.adjustment, 17);
  state().clearCustomLabBench();
  assert.equal(state().components.length, 2);
  assert.equal(state().wires.length, 0);
  assert.equal(state().customLabSelection.length, 0);
  state().undo();
  assert.deepEqual(state().customLabSelection, selectionBeforeReset);
  assert.deepEqual(state().wires, beforeReset.wires);
  state().redo();
  assert.equal(state().components.length, 2);
  console.log('PASS reversible clear and reset with repeated devices');

  const negativePlacement = catalog.createCustomLabComponent('bulb', [], { x: -500, y: -300 });
  assert.equal(negativePlacement.x, -500, 'Explicit drops honour the panned canvas coordinates');
  assert.equal(negativePlacement.y, -300);
  state().startCustomLab([]);
  const positionedId = state().addCustomLabComponent('bulb', { x: 1000, y: 800 });
  assert.equal(device(positionedId).x, 1000);
  assert.equal(device(positionedId).y, 800);
  const collisionId = state().addCustomLabComponent('bulb', { x: 1000, y: 800 });
  assert.ok(Math.abs(device(collisionId).x - 1000) >= 188 || Math.abs(device(collisionId).y - 800) >= 198);
  for (let i = 2; i < catalog.MAX_CUSTOM_COMPONENTS; i += 1) assert.ok(state().addCustomLabComponent('bulb'));
  assert.equal(count('bulb'), 32);
  assert.equal(new Set(state().components.map(component => component.id)).size, 34);
  const positions = state().components.filter(component => component.catalogId === 'bulb');
  for (let i = 0; i < positions.length; i += 1) {
    for (let j = i + 1; j < positions.length; j += 1) {
      assert.ok(Math.abs(positions[i].x - positions[j].x) >= 188 || Math.abs(positions[i].y - positions[j].y) >= 198,
        'Automatic placement must not reuse occupied space');
    }
  }
  const historyAtCapacity = state().history.length;
  assert.equal(state().addCustomLabComponent('bulb'), null);
  assert.equal(state().duplicateCustomLabComponent(positionedId), null);
  assert.equal(state().history.length, historyAtCapacity);
  state().removeComponent(positionedId);
  assert.equal(count('bulb'), 31);
  assert.ok(state().addCustomLabComponent('bulb'));
  assert.equal(state().addCustomLabComponent('unknown-device'), null);
  state().undo();
  assert.equal(count('bulb'), 31);
  state().redo();
  assert.equal(count('bulb'), 32);
  console.log('PASS requested placement, collision avoidance, 32-device capacity and count recovery');
} finally {
  await server.close();
}
