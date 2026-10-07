import type { CircuitComponent, Wire } from '../types/game';
import type { SolverResult } from './circuitSolver';
import { getAccessControllerConfig } from '../components/game/components/accessControllerPinout';

export type AccessDoorStatus = 'closed' | 'open' | 'forced-open' | 'held-open' | 'unmonitored' | 'wiring-fault' | 'unpowered';
export interface AccessEvent { time: number; door: 0 | 1 | 2; event: string }
interface DoorRuntime {
  unlockUntil: number;
  authorizedUntil: number;
  lastRex: boolean;
  openedAt: number | null;
  authorizedOpening: boolean;
  status: AccessDoorStatus;
}
interface ControllerRuntime {
  powered: boolean;
  doors: [DoorRuntime, DoorRuntime];
  scans: Map<string, number>;
}
const runtimes = new Map<string, ControllerRuntime>();
const key = (id: string, pin: string) => `${id}:${pin}`;
const createDoor = (): DoorRuntime => ({ unlockUntil: 0, authorizedUntil: 0, lastRex: false, openedAt: null, authorizedOpening: false, status: 'unpowered' });
export const clearAccessControllerRuntime = (id: string) => { runtimes.delete(id); };
export const clearAllAccessControllerRuntimes = () => { runtimes.clear(); };

/** Only wires, junctions and the board's shared 0V rail belong to this graph.
 * It lets an OPEN sensor still be distinguished from a missing sensor wire. */
const physicalGroups = (components: CircuitComponent[], wires: Wire[]) => {
  const graph = new Map<string, Set<string>>();
  const connect = (a: string, b: string) => {
    if (!graph.has(a)) graph.set(a, new Set());
    if (!graph.has(b)) graph.set(b, new Set());
    graph.get(a)!.add(b); graph.get(b)!.add(a);
  };
  components.forEach(component => {
    component.terminals.forEach(pin => graph.set(key(component.id, pin.id), new Set()));
    if (component.type === 'junction') {
      component.terminals.slice(1).forEach(pin => connect(key(component.id, component.terminals[0].id), key(component.id, pin.id)));
    }
    if (component.type === 'access_controller') {
      for (const pin of ['reader1_gnd', 'reader2_gnd', 'input_gnd1', 'input_gnd2']) connect(key(component.id, 'neg'), key(component.id, pin));
    }
  });
  wires.forEach(wire => connect(key(wire.fromComponentId, wire.fromTerminalId), key(wire.toComponentId, wire.toTerminalId)));
  const groups: Record<string, number> = {};
  let group = 0;
  graph.forEach((_, start) => {
    if (groups[start] !== undefined) return;
    const queue = [start]; groups[start] = group;
    for (let i = 0; i < queue.length; i++) graph.get(queue[i])?.forEach(next => {
      if (groups[next] !== undefined) return;
      groups[next] = group; queue.push(next);
    });
    group++;
  });
  return groups;
};
const same = (groups: Record<string, number>, a: string, b: string) => groups[a] !== undefined && groups[a] === groups[b];
const hasExternalWire = (wires: Wire[], id: string, pin: string) => wires.some(wire =>
  (wire.fromComponentId === id && wire.fromTerminalId === pin) || (wire.toComponentId === id && wire.toTerminalId === pin));

function contactWiring(
  board: CircuitComponent, door: 1 | 2, signal: 'dc' | 'rex', components: CircuitComponent[],
  wires: Wire[], physical: Record<string, number>
): 'wired' | 'missing' | 'partial' {
  const input = key(board.id, `${signal}${door}`);
  const ground = key(board.id, `input_gnd${door}`);
  if (!hasExternalWire(wires, board.id, `${signal}${door}`)) return 'missing';
  // A purposeful jumper is a wired closed input, useful when testing a panel.
  if (same(physical, input, ground)) return 'wired';
  const devices = components.filter(component => signal === 'dc' ? component.type === 'door_sensor'
    : ['button_no', 'button_nc', 'wave_sensor', 'rocker_switch_2pos'].includes(component.type));
  for (const device of devices) {
    const pairs = device.type === 'door_sensor' ? [['com', 'no']]
      : device.terminals.some(pin => pin.id === 'com') ? [['com', 'no'], ['com', 'nc']] : [['in', 'out']];
    for (const [a, b] of pairs) {
      if ((same(physical, input, key(device.id, a)) && same(physical, ground, key(device.id, b))) ||
        (same(physical, input, key(device.id, b)) && same(physical, ground, key(device.id, a)))) return 'wired';
    }
  }
  return 'partial';
}

/** Advance the custom access-panel logic from actual solved terminal groups.
 * Credential decisions are illustrative local permissions, not vendor software. */
export function advanceAccessControllers(
  components: CircuitComponent[], wires: Wire[], solved: SolverResult, running: boolean, now = Date.now()
): { components: CircuitComponent[]; contactsChanged: boolean } {
  const boards = components.filter(component => component.type === 'access_controller');
  const readers = components.filter(component => component.type === 'access_reader');
  const liveIds = new Set(boards.map(board => board.id));
  runtimes.forEach((_, id) => { if (!liveIds.has(id)) runtimes.delete(id); });
  if (!boards.length && !readers.length) return { components, contactsChanged: false };
  const physical = physicalGroups(components, wires);
  const groups = solved.terminalGroups;
  const readerPatches = new Map<string, CircuitComponent['state']>();
  const boardPatches = new Map<string, CircuitComponent['state']>();
  const resetFeedbackBoards = new Set<string>();
  let contactsChanged = false;

  const portsFor = (reader: CircuitComponent) => boards.flatMap(board => ([1, 2] as const).map(door => {
    const d0 = key(board.id, `reader${door}_d0`), d1 = key(board.id, `reader${door}_d1`);
    const ownD0 = key(reader.id, 'd0'), ownD1 = key(reader.id, 'd1');
    const data0 = same(groups, d0, ownD0), data1 = same(groups, d1, ownD1);
    const touched = data0 || data1 || same(groups, d0, ownD1) || same(groups, d1, ownD0);
    const valid = data0 && data1 && !same(groups, d0, d1)
      && !solved.groundedTerminals.has(d0) && !solved.groundedTerminals.has(d1)
      && !(solved.nodeVoltages[d0] > 0) && !(solved.nodeVoltages[d1] > 0)
      && same(groups, key(board.id, `reader${door}_gnd`), key(reader.id, 'neg'));
    return { board, door, touched, valid };
  })).filter(port => port.touched);

  for (const board of boards) {
    let runtime = runtimes.get(board.id);
    if (!runtime) {
      runtime = { powered: false, doors: [createDoor(), createDoor()], scans: new Map(readers.map(reader => [reader.id, Number(reader.state.scanSequence) || 0])) };
      runtimes.set(board.id, runtime);
    }
    const powered = running && !solved.shortCircuit && solved.energizedComponents.has(board.id);
    const config = getAccessControllerConfig(board);
    const events: AccessEvent[] = [...(Array.isArray(board.state.accessEvents) ? board.state.accessEvents : [])];
    let lastEvent = String(board.state.lastEvent || 'Ready for wiring');
    const record = (door: 0 | 1 | 2, event: string) => {
      lastEvent = door ? `Door ${door}: ${event}` : event;
      events.push({ time: now, door, event });
    };
    const justPowered = powered && !runtime.powered;
    if (justPowered || !powered) resetFeedbackBoards.add(board.id);
    if (justPowered) record(0, 'Board power restored');
    if (!powered && runtime.powered) record(0, 'Board power lost');

    for (const door of [1, 2] as const) {
      const live = runtime.doors[door - 1];
      const settings = config[`door${door}`];
      const rexWiring = contactWiring(board, door, 'rex', components, wires, physical);
      const rexClosed = same(groups, key(board.id, `rex${door}`), key(board.id, `input_gnd${door}`));
      const rexActive = powered && rexWiring === 'wired' && (settings.rexNormallyClosed ? !rexClosed : rexClosed);
      if (!powered) {
        live.unlockUntil = 0; live.authorizedUntil = 0; live.openedAt = null; live.authorizedOpening = false;
      } else if (!justPowered && rexActive && !live.lastRex) {
        record(door, settings.rexUnlock ? 'REX unlock' : 'REX shunt only');
        if (settings.rexUnlock) live.unlockUntil = now + settings.unlockSeconds * 1000;
        live.authorizedUntil = now + settings.unlockSeconds * 1000;
      }
      live.lastRex = rexActive;
    }

    for (const reader of readers) {
      const sequence = Number(reader.state.scanSequence) || 0;
      const previous = runtime.scans.get(reader.id) ?? sequence;
      runtime.scans.set(reader.id, sequence);
      // Starting/resuming consumes historical scans. Rewiring never replays one.
      if (sequence <= previous || !powered || justPowered) continue;
      const ports = portsFor(reader);
      const boardPorts = ports.filter(port => port.board.id === board.id);
      if (!boardPorts.length) continue;
      const port = boardPorts[0];
      const readerPowered = running && solved.energizedComponents.has(reader.id);
      const valid = ports.length === 1 && port.valid && readerPowered;
      const feedback = !valid ? 'wiring-fault' : reader.state.authorized === false ? 'denied' : 'granted';
      readerPatches.set(reader.id, { ...reader.state, feedback, feedbackUntil: now + 1200 });
      if (!valid) record(port.door, readerPowered ? 'Reader wiring fault' : 'Reader has no valid power');
      else if (feedback === 'denied') record(port.door, 'Access denied');
      else {
        record(port.door, 'Access granted');
        const live = runtime.doors[port.door - 1];
        live.unlockUntil = now + config[`door${port.door}`].unlockSeconds * 1000;
        live.authorizedUntil = live.unlockUntil;
      }
    }

    const next: CircuitComponent['state'] = { ...board.state, boardPowered: powered, accessConfig: config };
    for (const door of [1, 2] as const) {
      const live = runtime.doors[door - 1];
      const relay = powered && live.unlockUntil > now;
      if (!relay) live.unlockUntil = 0;
      if (relay !== Boolean(board.state[`relay${door}Active`])) contactsChanged = true;
      next[`relay${door}Active`] = relay;
      next[`unlockRemaining${door}`] = relay ? Math.ceil((live.unlockUntil - now) / 1000) : 0;
      const wiring = contactWiring(board, door, 'dc', components, wires, physical);
      const closed = same(groups, key(board.id, `dc${door}`), key(board.id, `input_gnd${door}`));
      let status: AccessDoorStatus;
      if (!powered) status = 'unpowered';
      else if (wiring !== 'wired') status = wiring === 'missing' ? 'unmonitored' : 'wiring-fault';
      else if (closed) {
        status = 'closed'; live.openedAt = null;
        live.authorizedOpening = false;
      } else {
        if (live.openedAt === null) {
          live.openedAt = now;
          live.authorizedOpening = relay || live.lastRex || live.authorizedUntil > now;
        }
        if (!live.authorizedOpening) status = 'forced-open';
        else status = now - live.openedAt >= config[`door${door}`].heldOpenSeconds * 1000 ? 'held-open' : 'open';
      }
      if (status !== live.status && status !== 'unpowered') {
        const descriptions: Record<Exclude<AccessDoorStatus, 'unpowered'>, string> = {
          closed: 'Door closed', open: 'Door opened', 'forced-open': 'Door forced open', 'held-open': 'Door held open',
          unmonitored: 'Contact unmonitored', 'wiring-fault': 'Contact wiring fault'
        };
        record(door, descriptions[status]);
      }
      if (wiring !== 'wired') { live.openedAt = null; live.authorizedOpening = false; }
      live.status = status;
      next[`door${door}Status`] = status;
      next[`rex${door}Active`] = live.lastRex;
      next[`rex${door}Wired`] = contactWiring(board, door, 'rex', components, wires, physical) === 'wired';
    }
    runtime.powered = powered;
    next.lastEvent = lastEvent; next.accessEvents = events.slice(-40);
    boardPatches.set(board.id, next);
  }

  for (const reader of readers) {
    const ports = portsFor(reader);
    const port = ports.length === 1 && ports[0].valid ? ports[0] : undefined;
    const powered = running && !solved.shortCircuit && solved.energizedComponents.has(reader.id);
    const state = readerPatches.get(reader.id) ?? { ...reader.state };
    const boardPowered = port && boardPatches.get(port.board.id)?.boardPowered;
    // Feedback belongs to this powered session. Restoring power or replacing a
    // runtime must not flash an old saved grant after relays have been reset.
    if (!powered || !boardPowered || (port && resetFeedbackBoards.has(port.board.id))) {
      state.feedbackUntil = 0;
      if (!readerPatches.has(reader.id)) state.feedback = powered ? 'idle' : 'unpowered';
    }
    const ledWired = Boolean(port && same(groups, key(reader.id, 'led'), key(port.board.id, `reader${port.door}_led`)));
    const buzzerWired = Boolean(port && same(groups, key(reader.id, 'buz'), key(port.board.id, `reader${port.door}_buz`)));
    const feedbackActive = powered && boardPowered && Number(state.feedbackUntil) > now;
    readerPatches.set(reader.id, { ...state, powered, ledWired, buzzerWired,
      ledActive: Boolean(feedbackActive && ledWired && state.feedback === 'granted'),
      buzzerActive: Boolean(feedbackActive && buzzerWired), authorized: state.authorized !== false });
  }
  return { contactsChanged, components: components.map(component => {
    const state = boardPatches.get(component.id) ?? readerPatches.get(component.id);
    return state ? { ...component, state } : component;
  }) };
}

/** Tick only while a deadline can change a displayed state; resting panels stay idle. */
export const accessControllersNeedTick = (components: CircuitComponent[], now = Date.now()) => components.some(component => {
  const live = runtimes.get(component.id);
  if (live?.powered && live.doors.some(door => door.unlockUntil > 0 || door.status === 'open')) return true;
  return component.type === 'access_reader' && component.state.powered &&
    Boolean(component.state.ledActive || component.state.buzzerActive) && Number(component.state.feedbackUntil) <= now;
});
