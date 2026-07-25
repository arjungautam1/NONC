/**
 * Camden CM-700 Series four-screw terminal block, taken from the CM-700 Series
 * Installation Instructions (part 40-82B222, rev 03/16/2018) and the CM-700
 * 'Universal' Blue product specification sheet.
 *
 * The four-screw stations carry TWO ISOLATED switch circuits — the wiring
 * diagram explicitly rejects looping one wire between them ("Must be Separate
 * Wires / Looped Wire Unacceptable"), so there is no shared common:
 *
 *   screws 1-2 : N/C circuit — closed at rest, opens when the plate is pulled
 *   screws 3-4 : N/O circuit — open at rest, closes when the plate is pulled
 *
 * Rated 12-24 VDC. Door release / emergency exit only; not rated for fire alarm.
 */
export const PULL_STATION_PINS = [
  { pin: 1, id: 't1', circuit: 'NC', x: -33, y: 78 },
  { pin: 2, id: 't2', circuit: 'NC', x: -11, y: 78 },
  { pin: 3, id: 't3', circuit: 'NO', x: 11, y: 78 },
  { pin: 4, id: 't4', circuit: 'NO', x: 33, y: 78 }
] as const;

export type PullStationPin = (typeof PULL_STATION_PINS)[number];

/** Terminal definitions shared by the custom lab catalogue and the levels. */
export const pullStationTerminals = () =>
  PULL_STATION_PINS.map(p => ({
    id: p.id,
    name: `${p.pin} (${p.circuit})`,
    type: (p.circuit === 'NC' ? 'nc' : 'no') as 'nc' | 'no',
    x: p.x,
    y: p.y
  }));
