/**
 * Camden CM-700 Series four-screw terminal block, taken from the CM-700 Series
 * Installation Instructions (part 40-82B222, rev 03/16/2018) and the CM-700
 * 'Universal' Blue product specification sheet.
 *
 * The four-screw stations carry TWO ISOLATED switch circuits — the wiring
 * diagram explicitly rejects looping one wire between them ("Must be Separate
 * Wires / Looped Wire Unacceptable"), so there is no shared common:
 *
 *   screws 1-2 : N/C circuit — NC and its own C. Closed at rest, opens when pulled.
 *   screws 3-4 : N/O circuit — NO and its own C. Open at rest, closes when pulled.
 *
 * Each circuit carries its own common, so there are two C screws and they are
 * NOT tied together inside the station.
 *
 * Rated 12-24 VDC. Door release / emergency exit only; not rated for fire alarm.
 */
export const PULL_STATION_PINS = [
  { pin: 1, id: 't1', circuit: 'NC', label: 'NC', x: -33, y: 78 },
  { pin: 2, id: 't2', circuit: 'NC', label: 'C', x: -11, y: 78 },
  { pin: 3, id: 't3', circuit: 'NO', label: 'NO', x: 11, y: 78 },
  { pin: 4, id: 't4', circuit: 'NO', label: 'C', x: 33, y: 78 }
] as const;

export type PullStationPin = (typeof PULL_STATION_PINS)[number];

/** Terminal definitions shared by the custom lab catalogue and the levels. */
export const pullStationTerminals = () =>
  PULL_STATION_PINS.map(p => ({
    id: p.id,
    name: p.label,
    type: (p.label === 'C' ? 'com' : p.label === 'NC' ? 'nc' : 'no') as 'com' | 'nc' | 'no',
    x: p.x,
    y: p.y
  }));
