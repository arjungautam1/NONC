import type { CircuitComponent } from '../../../types/game';

/**
 * Camden CX-12 PLUS Door Interface Relay — terminal layout taken from the
 * installation manual's "CX-12 Electrical and Mechanical" CAD drawing.
 *
 *   1  Power Input        9  Wet1 Input (powered)
 *   2  Power Input       10  Wet1 Input
 *   3  Relay1 - NO       11  Dry1 Input (non-powered)
 *   4  Relay1 - COM      12  Dry1 Input
 *   5  Relay1 - NC       13  Wet2 Input (powered)
 *   6  Relay2 - NO       14  Wet2 Input
 *   7  Relay2 - COM      15  Dry2 Input (non-powered)
 *   8  Relay2 - NC       16  Dry2 Input
 *
 * Per spec all four inputs (2 wet, 2 dry) are "3-30V AC/DC, optically
 * isolated, non-polarity sensitive" — electrically identical at the
 * terminals, the wet/dry naming only describes whether the field device
 * supplies its own power. The simulator treats every pair the same way:
 * either leg going high triggers that input.
 */
const SPACING = 15;
const START_X = -(15 * SPACING) / 2;
const Y = 62;

export const CX12PLUS_PINS = [
  { id: 'pos', label: 'PWR', name: '1', x: START_X + 0 * SPACING, y: Y },
  { id: 'neg', label: 'PWR', name: '2', x: START_X + 1 * SPACING, y: Y },
  { id: 'no1', label: 'NO', name: '3', x: START_X + 2 * SPACING, y: Y },
  { id: 'com1', label: 'COM', name: '4', x: START_X + 3 * SPACING, y: Y },
  { id: 'nc1', label: 'NC', name: '5', x: START_X + 4 * SPACING, y: Y },
  { id: 'no2', label: 'NO', name: '6', x: START_X + 5 * SPACING, y: Y },
  { id: 'com2', label: 'COM', name: '7', x: START_X + 6 * SPACING, y: Y },
  { id: 'nc2', label: 'NC', name: '8', x: START_X + 7 * SPACING, y: Y },
  { id: 'wet1_a', label: 'W1', name: '9', x: START_X + 8 * SPACING, y: Y },
  { id: 'wet1_b', label: 'W1', name: '10', x: START_X + 9 * SPACING, y: Y },
  { id: 'dry1_a', label: 'D1', name: '11', x: START_X + 10 * SPACING, y: Y },
  { id: 'dry1_b', label: 'D1', name: '12', x: START_X + 11 * SPACING, y: Y },
  { id: 'wet2_a', label: 'W2', name: '13', x: START_X + 12 * SPACING, y: Y },
  { id: 'wet2_b', label: 'W2', name: '14', x: START_X + 13 * SPACING, y: Y },
  { id: 'dry2_a', label: 'D2', name: '15', x: START_X + 14 * SPACING, y: Y },
  { id: 'dry2_b', label: 'D2', name: '16', x: START_X + 15 * SPACING, y: Y }
] as const;

export type CX12PlusPin = (typeof CX12PLUS_PINS)[number];

export const CX12PLUS_TERMINAL_POSITIONS: Record<string, { x: number; y: number }> =
  Object.fromEntries(CX12PLUS_PINS.map(p => [p.id, { x: p.x, y: p.y }]));

export const cx12plusTerminals = () =>
  CX12PLUS_PINS.map(p => ({
    id: p.id,
    name: p.name,
    type: p.id as
      | 'pos' | 'neg'
      | 'no1' | 'com1' | 'nc1'
      | 'no2' | 'com2' | 'nc2'
      | 'wet_a' | 'wet_b' | 'dry_a' | 'dry_b',
    x: p.x,
    y: p.y
  }));

/** The 8 operating modes, selectable via SW1/SW2/SW3 (installation manual, Section 3). */
export const CX12PLUS_MODES: { mode: string; sw: [boolean, boolean, boolean]; label: string }[] = [
  { mode: '1', sw: [false, false, true], label: 'Momentary & Momentary Apartment' },
  { mode: '2', sw: [true, false, true], label: 'Access Control (Maintained)' },
  { mode: '3', sw: [true, true, true], label: 'Smoke Evac.' },
  { mode: '4', sw: [false, true, true], label: 'Latching / Ratchet Mode' },
  { mode: '5', sw: [false, false, false], label: 'Bi-Directional Sequencer - Momentary' },
  { mode: '6', sw: [true, false, false], label: 'Bi-Directional Sequencer - Maintained' },
  { mode: '7', sw: [false, true, false], label: 'Restroom Control - Normally Unlocked' },
  { mode: '8', sw: [true, true, false], label: 'Restroom Control - Normally Locked' }
];

export const getCX12PlusMode = (sw: [boolean, boolean, boolean]) =>
  CX12PLUS_MODES.find(m => m.sw[0] === sw[0] && m.sw[1] === sw[1] && m.sw[2] === sw[2]) ?? CX12PLUS_MODES[0];

export interface CX12PlusConfig {
  sw: [boolean, boolean, boolean];
  /** D.O.R. RL1 — Relay 1 (lock) pulse duration, 1-30s. */
  dorRl1: number;
  /** D.O.O. RL2 — delay from Relay 1 firing to the chained Relay 2 pulse, 1-30s. */
  dooRl2: number;
  /** D.O.R. RL2 — Relay 2 (operator) pulse duration, 1-30s. */
  dorRl2: number;
}

export const DEFAULT_CX12PLUS_CONFIG: CX12PlusConfig = {
  sw: [false, false, true],
  dorRl1: 3,
  dooRl2: 2,
  dorRl2: 3
};

export const getCX12PlusConfig = (component: CircuitComponent): CX12PlusConfig => ({
  ...DEFAULT_CX12PLUS_CONFIG,
  ...(component.state.cx12Config as Partial<CX12PlusConfig> | undefined)
});
