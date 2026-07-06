import React from 'react';
import type { CircuitComponent } from '../../../types/game';
import { Battery, PowerSupply } from './Battery';
import { Bulb, LED, IndicatorLamp } from './Bulb';
import { SwitchNO, SwitchNC, SelectorSwitch } from './Switch';
import { Relay } from './Relay';
import { Fuse } from './Fuse';
import { Motor } from './Motor';
import { Buzzer } from './Buzzer';
import { Maglock, CardReader } from './AccessControl';
import { TerminalBlock } from './TerminalBlock';
import { TimerRelay } from './TimerRelay';
import { Actuator } from './Actuator';
import { ElevatorCabin } from './ElevatorCabin';
import { LimitSwitch } from './LimitSwitch';
import { ACSource } from './ACSource';
import { Transformer } from './Transformer';
import { RolandFan } from './RolandFan';
import { ParkingGate } from './ParkingGate';
import { DoorSensor } from './DoorSensor';

interface ComponentRendererProps {
  component: CircuitComponent;
  isEnergized: boolean;
}

export const ComponentRenderer: React.FC<ComponentRendererProps> = ({ component, isEnergized }) => {
  switch (component.type) {
    case 'battery':
      return <Battery component={component} />;
    case 'power_supply':
      return <PowerSupply component={component} />;
    case 'bulb':
      return <Bulb component={component} isEnergized={isEnergized} />;
    case 'led':
      return <LED component={component} isEnergized={isEnergized} />;
    case 'lamp_indicator':
      return <IndicatorLamp component={component} isEnergized={isEnergized} />;
    case 'button_no':
      return <SwitchNO component={component} />;
    case 'button_nc':
      return <SwitchNC component={component} />;
    case 'switch_selector':
      return <SelectorSwitch component={component} />;
    case 'relay':
      return <Relay component={component} />;
    case 'fuse':
      return <Fuse component={component} />;
    case 'motor':
      return <Motor component={component} isEnergized={isEnergized} />;
    case 'buzzer':
      return <Buzzer component={component} isEnergized={isEnergized} />;
    case 'maglock':
      return <Maglock component={component} />;
    case 'card_reader':
      return <CardReader component={component} />;
    case 'door_sensor':
      return <DoorSensor component={component} />;
    case 'terminal_block':
      return <TerminalBlock component={component} />;
    case 'timer_relay':
      return <TimerRelay component={component} isEnergized={isEnergized} />;
    case 'actuator':
      return <Actuator component={component} isEnergized={isEnergized} />;
    case 'elevator_motor':
      return <ElevatorCabin component={component} isEnergized={isEnergized} />;
    case 'limit_switch':
      return <LimitSwitch component={component} />;
    case 'ac_source':
      return <ACSource component={component} />;
    case 'transformer':
      return <Transformer component={component} isEnergized={isEnergized} />;
    case 'roland_fan':
      return <RolandFan component={component} isEnergized={isEnergized} />;
    case 'parking_gate':
      return <ParkingGate component={component} />;
    default:
      return null;
  }
};
export default ComponentRenderer;
