/**
 * CDVI CUBE POWER terminal layout, taken from the Bluetooth Stand-Alone
 * 1-Relay Wireless Receiver installation manual (CDVI_CUBE X_IM_01_EN_A4_C).
 *
 *   0V        - relay board power negative
 *   12-24V~   - relay board power positive, 12/24V AC/DC autodetect
 *   NC / C / NO - Form C relay output, 1A@30VDC (NO) / 6A@30VDC (NC)
 *
 * The relay is not triggered by a wired input: it is switched wirelessly by a
 * paired Radium/Erone transmitter button or a UserCUBE smartphone over
 * Bluetooth, which the simulator represents as a manual trigger on the
 * device face (see CubePower.tsx / triggerCubePower). Board power must be
 * present for that trigger to take effect.
 */
export const CUBE_POWER_PINS = [
  { id: 'neg', label: '0V', x: -46, y: -44 },
  { id: 'pos', label: '12-24V', x: -46, y: -22 },
  { id: 'nc', label: 'NC', x: -46, y: 0 },
  { id: 'com', label: 'C', x: -46, y: 22 },
  { id: 'no', label: 'NO', x: -46, y: 44 }
] as const;

export type CubePowerPin = (typeof CUBE_POWER_PINS)[number];

/** Canonical wiring-point geometry shared by the artwork and the canvas. */
export const CUBE_POWER_TERMINAL_POSITIONS: Record<string, { x: number; y: number }> =
  Object.fromEntries(CUBE_POWER_PINS.map(p => [p.id, { x: p.x, y: p.y }]));

const TERMINAL_NAMES: Record<string, string> = {
  neg: '0V', pos: '12-24V~', nc: 'NC', com: 'C', no: 'NO'
};

export const cubePowerTerminals = () =>
  CUBE_POWER_PINS.map(p => ({
    id: p.id,
    name: TERMINAL_NAMES[p.id],
    type: p.id as 'neg' | 'pos' | 'nc' | 'com' | 'no',
    x: p.x,
    y: p.y
  }));
