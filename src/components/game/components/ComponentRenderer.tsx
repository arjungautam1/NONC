import React from 'react';
import type { CircuitComponent } from '../../../types/game';
import { useGameStore } from '../../../store/useGameStore';
import { Battery, PowerSupply } from './Battery';
import { Bulb, LED, IndicatorLamp, LEDStrip } from './Bulb';
import { SwitchNO, SwitchNC, SelectorSwitch, RockerSwitch3Pos, RockerSwitch2Pos } from './Switch';
import { Relay, RelayDPDT } from './Relay';
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
    case 'junction': {
      // Fetch wires to see which ports have active connections
      const wires = useGameStore.getState().wires;
      const isPortConnected = (portId: string) => {
        return wires.some(
          w => (w.fromComponentId === component.id && w.fromTerminalId === portId) ||
               (w.toComponentId === component.id && w.toTerminalId === portId)
        );
      };

      const wagoColor = '#ea580c'; // Wago levers are always classic bright orange!
      const scale = component.state?.scale || 1.0;

      return (
        <g 
          transform={`scale(${scale})`}
          style={{ filter: isEnergized ? 'drop-shadow(0 0 3px rgba(251, 191, 36, 0.9))' : 'none' }}
        >
          {/* Main grey/clear body of Wago inline connector */}
          <rect x="-24" y="-12" width="48" height="24" rx="4" fill="#d1d5db" stroke="#9ca3af" strokeWidth="1.2" />
          {/* Transparent casing top highlight */}
          <rect x="-21" y="-9" width="42" height="7" rx="1.5" fill="#f3f4f6" opacity="0.4" />
          
          {/* 5 connection ports & levers */}
          {[-16, -8, 0, 8, 16].map((slotX, idx) => {
            const portId = `port_${idx}`;
            const connected = isPortConnected(portId);
            return (
              <g key={portId}>
                {/* Internal metal conductor path/slot */}
                <rect x={slotX - 2.5} y="-8" width="5" height="15" rx="0.8" fill="#4b5563" />
                
                {/* Port hole entry at the bottom sleeve */}
                <circle cx={slotX} cy="10" r="1.8" fill="#111827" />

                {connected ? (
                  /* Lever closed (flat down, snapping wire) */
                  <g>
                    <rect x={slotX - 2} y="-4" width="4" height="9" rx="0.6" fill={wagoColor} stroke="#7c2d12" strokeWidth="0.4" />
                    <circle cx={slotX} cy="-2.5" r="0.7" fill="#fed7aa" />
                  </g>
                ) : (
                  /* Lever open (flipped up, waiting for wire insertion) */
                  <g>
                    <rect x={slotX - 2} y="-11" width="4" height="8" rx="0.6" fill={wagoColor} stroke="#7c2d12" strokeWidth="0.4" />
                    {/* Small inner reflection */}
                    <line x1={slotX - 0.8} y1="-10" x2={slotX - 0.8} y2="-5" stroke="#ffedd5" strokeWidth="0.5" opacity="0.8" />
                  </g>
                )}
              </g>
            );
          })}
        </g>
      );
    }
    case 'rocker_switch_3pos':
      return <RockerSwitch3Pos component={component} />;
    case 'rocker_switch_2pos':
      return <RockerSwitch2Pos component={component} />;
    case 'relay_dpdt':
      return <RelayDPDT component={component} />;
    case 'led_strip':
      return <LEDStrip component={component} isEnergized={isEnergized} />;
    default:
      return null;
  }
};
export default ComponentRenderer;
