import type { CX12ExampleId } from './cx12Examples';

export interface LabPreset {
  id: string;
  title: string;
  badge: string;
  category: string;
  description: string;
  componentsCount: number;
  deviceCatalogIds: string[];
  features: string[];
  iconType: 'fan' | 'lock' | 'timer' | 'blank';
  cx12ExampleId?: CX12ExampleId;
}

export const LAB_PRESETS: LabPreset[] = [
  {
    id: 'cx12_access_control',
    title: 'Camden CX-12 Plus · Access Control',
    badge: 'Pre-Wired · Diagram 7',
    category: 'Access Control',
    description: 'Fully wired Camden CX-12 Plus circuit from Page 7 (DRG-CX-12PLUS-02). Includes maintained access input, fail-secure electric strike, door operator, and interior/exterior switches.',
    componentsCount: 8,
    deviceCatalogIds: ['cx12plus', 'automatic_door_operator', 'door_strike_fail_secure', 'visionis_vis7039', 'visionis_vis7039', 'powered_request_maintained'],
    features: ['Pre-wired exactly per Diagram 2a', 'Maintained WET 1 access unlock signal', 'Interior & exterior dry request switches'],
    iconType: 'lock',
    cx12ExampleId: 'access'
  },
  {
    id: 'blank',
    title: 'Clean Workbench',
    badge: 'Blank Canvas',
    category: 'General',
    description: 'Start with a calibrated 120V/24V Transformer and 24V DC Regulated Power Supply. Ready for complete wiring freedom.',
    componentsCount: 2,
    deviceCatalogIds: [],
    features: ['Transformer + 24V DC PSU', 'Zero wires pre-connected', 'Blank slate for custom circuits'],
    iconType: 'blank'
  },
  {
    id: 'relay_fan',
    title: 'Relay Logic & DC Fan',
    badge: 'Industrial Control',
    category: 'Relay Logic',
    description: 'Explore electromagnetic switching. Use a momentary SPDT push button to energize an industrial relay and drive a Roland high-velocity cooling fan.',
    componentsCount: 5,
    deviceCatalogIds: ['momentary_spdt', 'relay', 'roland_fan'],
    features: ['Momentary push button', 'Industrial Form-C relay', 'High-RPM Roland fan load'],
    iconType: 'fan'
  },
  {
    id: 'access_control',
    title: 'Access Control Door Strike',
    badge: 'Security System',
    category: 'Access Control',
    description: 'Commercial door access circuit with an illuminated exit push plate, electric door strike, SM500 maglock, and status indicator lamp.',
    componentsCount: 6,
    deviceCatalogIds: ['push_plate', 'sm500_maglock', 'door_strike', 'lamp_indicator'],
    features: ['Fail-safe maglock & strike', 'Camden illuminated request-to-exit', 'Visual lock status indicator'],
    iconType: 'lock'
  },
  {
    id: 'timer_flasher',
    title: 'Altronix 6062 Pulse Timer',
    badge: 'Precision Timing',
    category: 'Automation',
    description: 'Precision timing circuit using an Altronix 6062 multi-function timer relay driving dual alternating status bulbs and an audible annunciator.',
    componentsCount: 6,
    deviceCatalogIds: ['timer_relay', 'bulb', 'bulb', 'buzzer'],
    features: ['Altronix 6062 delay module', 'Dual alternating signal lamps', 'Piezo warning buzzer'],
    iconType: 'timer'
  }
];
