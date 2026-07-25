/**
 * 8-pin "ice cube" relay socket pinout, taken directly from the Altronix RDC12
 * datasheet base drawing (IIRDC12 Rev. 011812). The same socket standard is
 * shared by the Omron MY2 / IDEC RH2B parts the access-control labs model.
 *
 *   top row     3 = NO1   1 = NC1  |  7 = Coil   5 = C1
 *   bottom row  4 = NO2   2 = NC2  |  8 = Coil   6 = C2
 *
 * The coil pulls in when rated DC is applied across pins 7 and 8; each pole
 * then transfers its common from the NC contact to the NO contact.
 */
export const DPDT_PINS = [
  { pin: 3, id: 'no1', fn: 'NO', x: -40, y: -48 },
  { pin: 1, id: 'nc1', fn: 'NC', x: -21, y: -48 },
  { pin: 7, id: 'coil_a', fn: 'COIL', x: 21, y: -48 },
  { pin: 5, id: 'com1', fn: 'C', x: 40, y: -48 },
  { pin: 4, id: 'no2', fn: 'NO', x: -40, y: 48 },
  { pin: 2, id: 'nc2', fn: 'NC', x: -21, y: 48 },
  { pin: 8, id: 'coil_b', fn: 'COIL', x: 21, y: 48 },
  { pin: 6, id: 'com2', fn: 'C', x: 40, y: 48 }
] as const;

export type DPDTPin = (typeof DPDT_PINS)[number];

/** Canonical wiring-point geometry shared by the artwork and the canvas. */
export const DPDT_TERMINAL_POSITIONS: Record<string, { x: number; y: number }> =
  Object.fromEntries(DPDT_PINS.map(p => [p.id, { x: p.x, y: p.y }]));
