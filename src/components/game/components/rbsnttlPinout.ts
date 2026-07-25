/**
 * Altronix RBSNTTL "Ultra Sensitive Relay Module" terminal layout, taken from
 * the RBSNTTL installation sheet (IIRBSNTTL Rev. 020106) and the product photos.
 *
 *   top row     TRG-  POS+  C  NC  NO      (pole 1)
 *   bottom row  TRG+  NEG-  C  NC  NO      (pole 2)
 *
 * - 12VDC to 24VDC board power across POS+ / NEG-.
 * - 3VDC to 24VDC, 2mA-16mA OPTO-ISOLATED trigger across TRG+ / TRG-. The
 *   trigger side shares no internal connection with the supply side, which is
 *   why the datasheet note says a common power source must be jumpered.
 * - DPDT contacts rated 2A / 120VAC / 28VDC.
 *
 * The module only pulls in when it has BOTH board power and trigger voltage.
 */
export const RBSNTTL_PINS = [
  { id: 'trg_neg', label: 'TRG-', x: -48, y: -38 },
  { id: 'coil_a', label: 'POS+', x: -24, y: -38 },
  { id: 'com1', label: 'C', x: 0, y: -38 },
  { id: 'nc1', label: 'NC', x: 24, y: -38 },
  { id: 'no1', label: 'NO', x: 48, y: -38 },
  { id: 'trg_pos', label: 'TRG+', x: -48, y: 38 },
  { id: 'coil_b', label: 'NEG-', x: -24, y: 38 },
  { id: 'com2', label: 'C', x: 0, y: 38 },
  { id: 'nc2', label: 'NC', x: 24, y: 38 },
  { id: 'no2', label: 'NO', x: 48, y: 38 }
] as const;

export type RBSNTTLPin = (typeof RBSNTTL_PINS)[number];

/** Canonical wiring-point geometry shared by the artwork and the canvas. */
export const RBSNTTL_TERMINAL_POSITIONS: Record<string, { x: number; y: number }> =
  Object.fromEntries(RBSNTTL_PINS.map(p => [p.id, { x: p.x, y: p.y }]));

/** Pole number is carried on the name so hover text stays unambiguous. */
const TERMINAL_NAMES: Record<string, string> = {
  trg_neg: 'TRG-', coil_a: 'POS+', com1: 'C1', nc1: 'NC1', no1: 'NO1',
  trg_pos: 'TRG+', coil_b: 'NEG-', com2: 'C2', nc2: 'NC2', no2: 'NO2'
};

export const rbsnttlTerminals = () =>
  RBSNTTL_PINS.map(p => ({
    id: p.id,
    name: TERMINAL_NAMES[p.id],
    type: p.id as
      | 'trg_neg' | 'coil_a' | 'com1' | 'nc1' | 'no1'
      | 'trg_pos' | 'coil_b' | 'com2' | 'nc2' | 'no2',
    x: p.x,
    y: p.y
  }));
