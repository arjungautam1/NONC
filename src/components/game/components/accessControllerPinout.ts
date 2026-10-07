import type { CircuitComponent, Terminal } from '../../../types/game';

/** DELMI training board layout. These are custom terminals, not a manufacturer's pinout. */
export const ACCESS_CONTROLLER_PINS = [
  { id: 'pos', label: '+12V', x: -30, y: -180 },
  { id: 'neg', label: '0V', x: 30, y: -180 },
  ...([1, 2] as const).flatMap(door => [
    ...(['pos', 'gnd', 'd0', 'd1', 'led', 'buz'] as const).map((signal, index) => ({
      id: `reader${door}_${signal}`, label: ['+12V', '0V', 'D0', 'D1', 'LED', 'BUZ'][index],
      x: door === 1 ? -180 : 180, y: -100 + index * 25
    })),
    { id: `rex${door}`, label: 'REX', x: door === 1 ? -180 : 180, y: 85 },
    { id: `dc${door}`, label: 'DC', x: door === 1 ? -180 : 180, y: 110 },
    { id: `input_gnd${door}`, label: 'COM', x: door === 1 ? -180 : 180, y: 135 },
    ...(['com', 'no', 'nc'] as const).map((signal, index) => ({
      id: `${signal}${door}`, label: signal.toUpperCase(), x: (door === 1 ? -90 : 30) + index * 30, y: 180
    }))
  ])
];

export const ACCESS_CONTROLLER_TERMINAL_POSITIONS: Record<string, { x: number; y: number }> =
  Object.fromEntries(ACCESS_CONTROLLER_PINS.map(pin => [pin.id, { x: pin.x, y: pin.y }]));

export const accessControllerTerminals = (): Terminal[] => ACCESS_CONTROLLER_PINS.map(pin => ({
  id: pin.id, name: pin.label, type: pin.id === 'pos' ? 'pos' : pin.id === 'neg' ? 'neg'
    : pin.id.startsWith('com') ? (pin.id as 'com1' | 'com2')
    : pin.id.startsWith('no') ? (pin.id as 'no1' | 'no2')
    : pin.id.startsWith('nc') ? (pin.id as 'nc1' | 'nc2') : 'in',
  x: pin.x, y: pin.y
}));

export const ACCESS_READER_PINS = (['pos', 'neg', 'd0', 'd1', 'led', 'buz'] as const).map((id, index) => ({
  id, label: ['+12V', '0V', 'D0', 'D1', 'LED', 'BUZ'][index], x: -65 + index * 26, y: 85
}));
export const ACCESS_READER_TERMINAL_POSITIONS: Record<string, { x: number; y: number }> =
  Object.fromEntries(ACCESS_READER_PINS.map(pin => [pin.id, { x: pin.x, y: pin.y }]));
export const accessReaderTerminals = (): Terminal[] => ACCESS_READER_PINS.map(pin => ({
  id: pin.id, name: pin.label, type: pin.id === 'pos' ? 'pos' : pin.id === 'neg' ? 'neg' : 'in',
  x: pin.x, y: pin.y
}));

export interface AccessDoorConfig {
  unlockSeconds: number;
  heldOpenSeconds: number;
  rexNormallyClosed: boolean;
  rexUnlock: boolean;
}
export interface AccessControllerConfig { door1: AccessDoorConfig; door2: AccessDoorConfig }
export const DEFAULT_ACCESS_CONTROLLER_CONFIG: AccessControllerConfig = {
  door1: { unlockSeconds: 5, heldOpenSeconds: 10, rexNormallyClosed: false, rexUnlock: true },
  door2: { unlockSeconds: 5, heldOpenSeconds: 10, rexNormallyClosed: false, rexUnlock: true }
};
const duration = (value: unknown, fallback: number) => {
  const number = Number(value);
  return Number.isFinite(number) ? Math.min(120, Math.max(1, number)) : fallback;
};
export const getAccessControllerConfig = (component: CircuitComponent): AccessControllerConfig => {
  const saved = component.state.accessConfig as Partial<AccessControllerConfig> | undefined;
  const door = (key: 'door1' | 'door2'): AccessDoorConfig => {
    const config = { ...DEFAULT_ACCESS_CONTROLLER_CONFIG[key], ...saved?.[key] };
    return { ...config, unlockSeconds: duration(config.unlockSeconds, 5), heldOpenSeconds: duration(config.heldOpenSeconds, 10),
      rexNormallyClosed: Boolean(config.rexNormallyClosed), rexUnlock: Boolean(config.rexUnlock) };
  };
  return { door1: door('door1'), door2: door('door2') };
};

export const accessDoorStatusLabel = (status: unknown) => ({
  closed: 'Door closed', open: 'Door open', 'forced-open': 'Forced open', 'held-open': 'Held open',
  unmonitored: 'Contact not wired', 'wiring-fault': 'Input wiring fault', unpowered: 'No power'
} as Record<string, string>)[String(status)] ?? 'Contact not wired';
