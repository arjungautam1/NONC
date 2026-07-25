/**
 * Altronix RB1224 Relay Module terminal layout, taken from the RB1224 data
 * sheet (Rev. 03032022) and Installation Guide (IIRB1224 Rev. 121205).
 *
 *   top row     NO  NC  C  NEG-      (pole 1 contacts + coil negative)
 *   bottom row  NO  NC  C  POS+      (pole 2 contacts + coil positive)
 *
 * 5A/220VAC or 28VDC DPDT contacts, 75mA coil draw. SW1 selects the coil
 * rating: OFF = 24VDC operation, ON = 12VDC operation.
 */
export const RB1224_PINS = [
  { id: 'no1', label: 'NO', x: -39, y: -35 },
  { id: 'nc1', label: 'NC', x: -13, y: -35 },
  { id: 'com1', label: 'C', x: 13, y: -35 },
  { id: 'coil_b', label: 'NEG-', x: 39, y: -35 },
  { id: 'no2', label: 'NO', x: -39, y: 35 },
  { id: 'nc2', label: 'NC', x: -13, y: 35 },
  { id: 'com2', label: 'C', x: 13, y: 35 },
  { id: 'coil_a', label: 'POS+', x: 39, y: 35 }
] as const;

export type RB1224Pin = (typeof RB1224_PINS)[number];

/** Canonical wiring-point geometry shared by the artwork and the canvas. */
export const RB1224_TERMINAL_POSITIONS: Record<string, { x: number; y: number }> =
  Object.fromEntries(RB1224_PINS.map(p => [p.id, { x: p.x, y: p.y }]));

/**
 * Terminal definitions for the catalogue and levels. The board silkscreens both
 * poles as plain NO/NC/C, so the pole number is carried on the terminal name to
 * keep hover text and wiring unambiguous.
 */
const TERMINAL_NAMES: Record<string, string> = {
  no1: 'NO1', nc1: 'NC1', com1: 'C1', coil_b: 'NEG-',
  no2: 'NO2', nc2: 'NC2', com2: 'C2', coil_a: 'POS+'
};

export const rb1224Terminals = () =>
  RB1224_PINS.map(p => ({
    id: p.id,
    name: TERMINAL_NAMES[p.id],
    type: p.id as
      | 'no1' | 'nc1' | 'com1' | 'coil_b'
      | 'no2' | 'nc2' | 'com2' | 'coil_a',
    x: p.x,
    y: p.y
  }));

/** SW1 OFF = 24VDC operation, SW1 ON = 12VDC operation. */
export const rb1224CoilVoltage = (state: Record<string, unknown>) => (state.dip12v ? 12 : 24);
