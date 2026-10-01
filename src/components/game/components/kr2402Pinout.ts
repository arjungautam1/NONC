import type { Terminal } from '../../../types/game';

/**
 * QIACHIP KR2402A terminal order from the receiver manual. The photographed
 * sheet reverses NO/NC in one translated legend; the numbered wiring diagrams
 * and the manufacturer's current documentation confirm this standard order.
 */
export const KR2402_PINS = [
  { id: 'no1', label: 'NO1', x: -50, y: -50, type: 'no1' },
  { id: 'com1', label: 'COM1', x: -30, y: -50, type: 'com1' },
  { id: 'nc1', label: 'NC1', x: -10, y: -50, type: 'nc1' },
  { id: 'no2', label: 'NO2', x: 10, y: -50, type: 'no2' },
  { id: 'com2', label: 'COM2', x: 30, y: -50, type: 'com2' },
  { id: 'nc2', label: 'NC2', x: 50, y: -50, type: 'nc2' },
  { id: 'pos', label: '+V', x: -12, y: 50, type: 'pos' },
  { id: 'neg', label: '−V', x: 12, y: 50, type: 'neg' }
] as const;

export const kr2402Terminals = (): Terminal[] => KR2402_PINS.map(pin => ({
  id: pin.id,
  name: pin.label,
  type: pin.type,
  x: pin.x,
  y: pin.y
}));
