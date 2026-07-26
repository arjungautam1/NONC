/**
 * CDVI SM500 — 500kg (1,100 lb) surface-mount maglock terminal layout, taken
 * from the installation manual (CDVI_SM500_IM_02_EN-FR_A4_B), "Electrical
 * Connections" / "With built-in PCB board" diagram.
 *
 *   NC   COM   NO   -   +
 *
 * "-" / "+" feed the 12/24V DC coil (voltage selected by an internal jumper,
 * default 12V — not modelled here since the simulator has no failure mode
 * for a wrong jumper on this product). NC/COM/NO is the built-in holding
 * force sensor: a dry contact that only switches to NO when the lock is
 * closed and powered at full holding force; it rests on NC otherwise.
 */
export const SM500_PINS = [
  { id: 'nc', label: 'NC', x: -46, y: -44 },
  { id: 'com', label: 'COM', x: -46, y: -22 },
  { id: 'no', label: 'NO', x: -46, y: 0 },
  { id: 'neg', label: '-', x: -46, y: 22 },
  { id: 'pos', label: '+', x: -46, y: 44 }
] as const;

export type SM500Pin = (typeof SM500_PINS)[number];

/** Canonical wiring-point geometry shared by the artwork and the canvas. */
export const SM500_TERMINAL_POSITIONS: Record<string, { x: number; y: number }> =
  Object.fromEntries(SM500_PINS.map(p => [p.id, { x: p.x, y: p.y }]));

const TERMINAL_NAMES: Record<string, string> = {
  nc: 'NC', com: 'COM', no: 'NO', neg: '-', pos: '+'
};

export const sm500Terminals = () =>
  SM500_PINS.map(p => ({
    id: p.id,
    name: TERMINAL_NAMES[p.id],
    type: p.id as 'nc' | 'com' | 'no' | 'neg' | 'pos',
    x: p.x,
    y: p.y
  }));
