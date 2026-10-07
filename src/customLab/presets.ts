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
  accessControllerExample?: boolean;
}

export const LAB_PRESETS: LabPreset[] = [
  {
    id: 'delmi_access_training', title: 'DELMI AC-2 · Two-door Access Control', badge: 'Pre-wired training board',
    category: 'Access Control', description: 'Practice the shared Atrium and RBH UNC100 concepts on a custom controller: wired readers, REX, door monitoring and independent lock relays. Door 1 uses a fail-secure strike; Door 2 uses a fail-safe maglock.',
    componentsCount: 11,
    deviceCatalogIds: ['delmi_access_controller', 'delmi_wiegand_reader', 'delmi_wiegand_reader', 'visionis_vis7039', 'visionis_vis7039', 'nascom_n282txg', 'nascom_n282txg', 'door_strike_fail_secure', 'maglock_fail_safe'],
    features: ['Allowed / denied card scans and timed unlocks', 'REX, forced-open and held-open monitoring', 'Custom 12V training pinout with dry lock relays'],
    iconType: 'lock', accessControllerExample: true
  },
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
    deviceCatalogIds: ['momentary_spdt', 'relay_spdt', 'dc_fan'],
    features: ['Momentary push button', 'Industrial Form-C relay', 'High-RPM Roland fan load'],
    iconType: 'fan'
  },
  {
    id: 'access_control',
    title: 'Access Control Door Strike',
    badge: 'Security System',
    category: 'Access Control',
    description: 'Start a door-release circuit with a dry-contact exit push plate, fail-secure strike and SM500 fail-safe maglock. Devices are placed ready to wire.',
    componentsCount: 5,
    deviceCatalogIds: ['visionis_vis7039', 'sm500_maglock', 'door_strike_fail_secure'],
    features: ['Fail-safe maglock & fail-secure strike', 'Voltage-free request-to-exit contacts', 'Ready to wire on the access bench'],
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
