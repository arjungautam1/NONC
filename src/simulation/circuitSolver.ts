import type { CircuitComponent, Wire } from '../types/game';

export interface SolverResult {
  nodeVoltages: Record<string, number>; // terminalKey -> voltage (0, 12, or 24)
  energizedComponents: Set<string>; // component IDs
  shortCircuit: boolean;
  shortCircuitNodes: Set<string>; // terminal keys in short
  fuseBlownIds: string[];
  diagnosticLog: string[];
  faultLocation: string | null; // terminal key where connection broke
}

// Helper to get unique key for a terminal
export function getTerminalKey(componentId: string, terminalId: string): string {
  return `${componentId}:${terminalId}`;
}

export function solveCircuit(
  components: CircuitComponent[],
  wires: Wire[]
): SolverResult {
  const diagnosticLog: string[] = [];
  let energizedComponents = new Set<string>();
  let shortCircuit = false;
  let shortCircuitNodes = new Set<string>();
  let fuseBlownIds: string[] = [];
  let faultLocation: string | null = null;

  // Let's create a map of component by ID for fast lookup
  const compMap = new Map<string, CircuitComponent>();
  components.forEach(c => compMap.set(c.id, c));

  // Relay states can change other states, so we run the solver up to 10 times to stabilize.
  // This supports latching circuits and relay feedback loops.
  let iterations = 0;
  let statesChanged = true;

  // Keep track of relay coils energized in this iteration
  let coilStates: Record<string, boolean> = {};
  components.forEach(c => {
    if (c.type === 'relay' || c.type === 'relay_dpdt') {
      coilStates[c.id] = c.state.energized || false;
    }
  });

  let nodeVoltages: Record<string, number> = {};

  while (statesChanged && iterations < 10) {
    iterations++;
    statesChanged = false;

    // 1. Build adjacency list of electrical connections (including wires and internal closed components)
    const adjList: Record<string, Set<string>> = {};

    const addConnection = (t1: string, t2: string) => {
      if (!adjList[t1]) adjList[t1] = new Set();
      if (!adjList[t2]) adjList[t2] = new Set();
      adjList[t1].add(t2);
      adjList[t2].add(t1);
    };

    // Initialize all terminals in adjacency list
    components.forEach(c => {
      c.terminals.forEach(t => {
        const key = getTerminalKey(c.id, t.id);
        if (!adjList[key]) adjList[key] = new Set();
      });
    });

    // Add wire connections
    wires.forEach(w => {
      const t1 = getTerminalKey(w.fromComponentId, w.fromTerminalId);
      const t2 = getTerminalKey(w.toComponentId, w.toTerminalId);
      addConnection(t1, t2);
    });

    // Add internal component connections depending on state
    components.forEach(c => {
      if (c.type === 'button_no') {
        const hasCom = c.terminals.some(t => t.id === 'com');
        if (hasCom) {
          if (c.state.pressed) {
            addConnection(getTerminalKey(c.id, 'com'), getTerminalKey(c.id, 'no'));
          } else {
            addConnection(getTerminalKey(c.id, 'com'), getTerminalKey(c.id, 'nc'));
          }
        } else if (c.state.pressed) {
          addConnection(getTerminalKey(c.id, 'in'), getTerminalKey(c.id, 'out'));
        }
      } else if (c.type === 'button_nc' && !c.state.pressed) {
        addConnection(getTerminalKey(c.id, 'in'), getTerminalKey(c.id, 'out'));
      } else if (c.type === 'door_sensor' && !c.state.toggled) {
        addConnection(getTerminalKey(c.id, 'in'), getTerminalKey(c.id, 'out'));
      } else if (c.type === 'switch_selector') {
        const targetOut = c.state.toggled ? 'out_b' : 'out_a';
        addConnection(getTerminalKey(c.id, 'in'), getTerminalKey(c.id, targetOut));
      } else if (c.type === 'rocker_switch_2pos') {
        const targetOut = c.state.toggled ? 'no' : 'nc';
        addConnection(getTerminalKey(c.id, 'com'), getTerminalKey(c.id, targetOut));
      } else if (c.type === 'relay') {
        const isEnergized = coilStates[c.id];
        if (isEnergized) {
          addConnection(getTerminalKey(c.id, 'com'), getTerminalKey(c.id, 'no'));
        } else {
          addConnection(getTerminalKey(c.id, 'com'), getTerminalKey(c.id, 'nc'));
        }
      } else if (c.type === 'relay_dpdt') {
        const isEnergized = coilStates[c.id];
        if (isEnergized) {
          addConnection(getTerminalKey(c.id, 'com1'), getTerminalKey(c.id, 'no1'));
          addConnection(getTerminalKey(c.id, 'com2'), getTerminalKey(c.id, 'no2'));
        } else {
          addConnection(getTerminalKey(c.id, 'com1'), getTerminalKey(c.id, 'nc1'));
          addConnection(getTerminalKey(c.id, 'com2'), getTerminalKey(c.id, 'nc2'));
        }
      } else if (c.type === 'rocker_switch_3pos') {
        const switchState = c.state.toggled as any;
        if (switchState === 'left') {
          addConnection(getTerminalKey(c.id, 'com1'), getTerminalKey(c.id, 'l1'));
          addConnection(getTerminalKey(c.id, 'com2'), getTerminalKey(c.id, 'l2'));
        } else if (switchState === 'right') {
          addConnection(getTerminalKey(c.id, 'com1'), getTerminalKey(c.id, 'r1'));
          addConnection(getTerminalKey(c.id, 'com2'), getTerminalKey(c.id, 'r2'));
        }
      } else if (c.type === 'timer_relay') {
        const isDelayedActive = c.state.delayedActive || false;
        if (isDelayedActive) {
          addConnection(getTerminalKey(c.id, 'com'), getTerminalKey(c.id, 'no'));
        } else {
          addConnection(getTerminalKey(c.id, 'com'), getTerminalKey(c.id, 'nc'));
        }
      } else if (c.type === 'limit_switch') {
        const isPressed = c.state.pressed || false;
        if (!isPressed) {
          addConnection(getTerminalKey(c.id, 'in'), getTerminalKey(c.id, 'out'));
        }
      } else if (c.type === 'fuse' && !c.state.blown) {
        addConnection(getTerminalKey(c.id, 'in'), getTerminalKey(c.id, 'out'));
      } else if (c.type === 'terminal_block') {
        // terminal blocks connect terminal pairs: t1-t2, t3-t4, etc.
        addConnection(getTerminalKey(c.id, 't1'), getTerminalKey(c.id, 't2'));
        addConnection(getTerminalKey(c.id, 't3'), getTerminalKey(c.id, 't4'));
      } else if (c.type === 'card_reader') {
        const isActive = c.state.active || false;
        if (isActive) {
          addConnection(getTerminalKey(c.id, 'pos'), getTerminalKey(c.id, 'out'));
        }
      } else if (c.type === 'junction') {
        const ports = c.terminals.map(t => getTerminalKey(c.id, t.id));
        for (let i = 0; i < ports.length - 1; i++) {
          addConnection(ports[i], ports[i + 1]);
        }
      }
      // Note: loads (bulb, led, motor, buzzer, coil) are NOT shorted internally. They act as resistance loads.
    });

    // 2. Identify AC sources and find if any transformer input is powered
    const connectedToACL = new Set<string>();
    const connectedToACN = new Set<string>();

    const acLSources = components.filter(c => c.type === 'ac_source').map(c => getTerminalKey(c.id, 'L'));
    const acNSources = components.filter(c => c.type === 'ac_source').map(c => getTerminalKey(c.id, 'N'));

    // Traverse from AC Line (L)
    const aclQueue = [...acLSources];
    aclQueue.forEach(s => connectedToACL.add(s));
    while (aclQueue.length > 0) {
      const curr = aclQueue.shift()!;
      const neighbors = adjList[curr] || new Set();
      neighbors.forEach(n => {
        if (!connectedToACL.has(n)) {
          connectedToACL.add(n);
          aclQueue.push(n);
        }
      });
    }

    // Traverse from AC Neutral (N)
    const acnQueue = [...acNSources];
    acnQueue.forEach(s => connectedToACN.add(s));
    while (acnQueue.length > 0) {
      const curr = acnQueue.shift()!;
      const neighbors = adjList[curr] || new Set();
      neighbors.forEach(n => {
        if (!connectedToACN.has(n)) {
          connectedToACN.add(n);
          acnQueue.push(n);
        }
      });
    }

    // 2b. Identify power sources (positive and negative nodes)
    const posSources: string[] = [];
    const negSources: string[] = [];
    const sourceVoltages: Record<string, number> = {}; // source terminal -> voltage

    // Phase 1: Process and identify active transformers connected to AC outlet
    components.forEach(c => {
      if (c.type === 'transformer') {
        const lKey = getTerminalKey(c.id, 'ac_l');
        const nKey = getTerminalKey(c.id, 'ac_n');
        
        const isACL = connectedToACL.has(lKey) && connectedToACN.has(nKey);
        const isACN = connectedToACL.has(nKey) && connectedToACN.has(lKey);

        c.state.active = isACL || isACN;
      }
    });

    // Phase 2: Configure initial DC sources (Battery, legacy PSU, and active Transformers outputting +/-)
    components.forEach(c => {
      if (c.type === 'battery') {
        const pKey = getTerminalKey(c.id, 'pos');
        const nKey = getTerminalKey(c.id, 'neg');
        posSources.push(pKey);
        negSources.push(nKey);
        sourceVoltages[pKey] = 12; // 12V Battery
        sourceVoltages[nKey] = 0;
      } else if (c.type === 'transformer' && c.state.active) {
        // Active transformer outputs DC + and - (pos and neg terminals)
        const pKey = getTerminalKey(c.id, 'pos');
        const nKey = getTerminalKey(c.id, 'neg');
        posSources.push(pKey);
        negSources.push(nKey);
        sourceVoltages[pKey] = 24; // 24VDC from transformer output
        sourceVoltages[nKey] = 0;
      } else if (c.type === 'power_supply') {
        const hasACTerminals = c.terminals.some(t => t.id === 'ac1') && c.terminals.some(t => t.id === 'ac2');
        if (!hasACTerminals) {
          // Legacy always-on DC power supply
          const pKey = getTerminalKey(c.id, 'pos');
          const nKey = getTerminalKey(c.id, 'neg');
          posSources.push(pKey);
          negSources.push(nKey);
          sourceVoltages[pKey] = 24; // 24V Industrial PSU
          sourceVoltages[nKey] = 0;
          c.state.active = true;
        }
      }
    });

    // Temp propagation phase to determine if power supply boards receive DC on their AC inputs
    const tempConnectedToPos = new Set<string>();
    const tempConnectedToNeg = new Set<string>();

    const tempPosQueue = [...posSources];
    tempPosQueue.forEach(s => tempConnectedToPos.add(s));
    while (tempPosQueue.length > 0) {
      const curr = tempPosQueue.shift()!;
      const neighbors = adjList[curr] || new Set();
      neighbors.forEach(n => {
        if (!tempConnectedToPos.has(n)) {
          tempConnectedToPos.add(n);
          tempPosQueue.push(n);
        }
      });
    }

    const tempNegQueue = [...negSources];
    tempNegQueue.forEach(s => tempConnectedToNeg.add(s));
    while (tempNegQueue.length > 0) {
      const curr = tempNegQueue.shift()!;
      const neighbors = adjList[curr] || new Set();
      neighbors.forEach(n => {
        if (!tempConnectedToNeg.has(n)) {
          tempConnectedToNeg.add(n);
          tempNegQueue.push(n);
        }
      });
    }

    // Phase 3: Evaluate AC-input Power Supply boards
    components.forEach(c => {
      if (c.type === 'power_supply') {
        const hasACTerminals = c.terminals.some(t => t.id === 'ac1') && c.terminals.some(t => t.id === 'ac2');
        if (hasACTerminals) {
          const ac1Key = getTerminalKey(c.id, 'ac1');
          const ac2Key = getTerminalKey(c.id, 'ac2');
          
          const isAC1_Pos = tempConnectedToPos.has(ac1Key);
          const isAC1_Neg = tempConnectedToNeg.has(ac1Key);
          const isAC2_Pos = tempConnectedToPos.has(ac2Key);
          const isAC2_Neg = tempConnectedToNeg.has(ac2Key);

          if ((isAC1_Pos && isAC2_Neg) || (isAC1_Neg && isAC2_Pos)) {
            const pKey = getTerminalKey(c.id, 'pos');
            const nKey = getTerminalKey(c.id, 'neg');
            posSources.push(pKey);
            negSources.push(nKey);
            sourceVoltages[pKey] = 24; // 24VDC output from board
            sourceVoltages[nKey] = 0;
            c.state.active = true;
          } else {
            c.state.active = false;
          }
        }
      }
    });

    // 3. Traverse from Positive sources to find all connected terminals
    const connectedToPos = new Set<string>();
    const posQueue: { key: string; volt: number }[] = [];
    posSources.forEach(s => {
      posQueue.push({ key: s, volt: sourceVoltages[s] });
      connectedToPos.add(s);
    });

    while (posQueue.length > 0) {
      const { key, volt } = posQueue.shift()!;
      const neighbors = adjList[key] || new Set();
      neighbors.forEach(n => {
        if (!connectedToPos.has(n)) {
          connectedToPos.add(n);
          posQueue.push({ key: n, volt });
        }
      });
    }

    // 4. Traverse from Negative sources to find all connected terminals
    const connectedToNeg = new Set<string>();
    const negQueue: string[] = [];
    negSources.forEach(s => {
      negQueue.push(s);
      connectedToNeg.add(s);
    });

    while (negQueue.length > 0) {
      const key = negQueue.shift()!;
      const neighbors = adjList[key] || new Set();
      neighbors.forEach(n => {
        if (!connectedToNeg.has(n)) {
          connectedToNeg.add(n);
          negQueue.push(n);
        }
      });
    }

    // 5. Check for short circuits (direct connection from a Pos source to a Neg source)
    shortCircuit = false;
    shortCircuitNodes.clear();

    for (const pSrc of posSources) {
      if (connectedToNeg.has(pSrc)) {
        // Direct short circuit!
        shortCircuit = true;
        // Collect all nodes in this short-circuit path
        const visited = new Set<string>();
        const queue = [pSrc];
        visited.add(pSrc);

        while (queue.length > 0) {
          const curr = queue.shift()!;
          shortCircuitNodes.add(curr);
          const neighbors = adjList[curr] || new Set();
          neighbors.forEach(n => {
            if (!visited.has(n) && connectedToNeg.has(n)) {
              visited.add(n);
              queue.push(n);
            }
          });
        }
        break;
      }
    }

    // If there is a short circuit, check if there is an active fuse in the short circuit path
    if (shortCircuit) {
      let fuseToBlow: CircuitComponent | null = null;
      for (const key of shortCircuitNodes) {
        const [cId] = key.split(':');
        const comp = compMap.get(cId);
        if (comp && comp.type === 'fuse' && !comp.state.blown) {
          fuseToBlow = comp;
          break;
        }
      }

      if (fuseToBlow) {
        // Blow the fuse!
        fuseToBlow.state.blown = true;
        fuseBlownIds.push(fuseToBlow.id);
        diagnosticLog.push(`Short circuit detected! Fuse [${fuseToBlow.label}] has blown to protect the circuit.`);
        statesChanged = true;
        continue; // Re-evaluate circuit connectivity with the fuse now open
      }
    }

    // 6. Determine load energization
    const newEnergized = new Set<string>();
    components.forEach(c => {
      let isCoil = false;
      let inKey = '';
      let outKey = '';

      if (c.type === 'bulb' || c.type === 'led' || c.type === 'lamp_indicator' || c.type === 'led_strip') {
        inKey = getTerminalKey(c.id, 'in');
        outKey = getTerminalKey(c.id, 'out');
      } else if (c.type === 'motor' || c.type === 'buzzer' || c.type === 'roland_fan') {
        inKey = getTerminalKey(c.id, 'in');
        outKey = getTerminalKey(c.id, 'out');
      } else if (c.type === 'relay' || c.type === 'relay_dpdt') {
        isCoil = true;
        inKey = getTerminalKey(c.id, 'coil_a');
        outKey = getTerminalKey(c.id, 'coil_b');
      } else if (c.type === 'timer_relay') {
        inKey = getTerminalKey(c.id, 'coil_a');
        outKey = getTerminalKey(c.id, 'coil_b');
      } else if (c.type === 'actuator' || c.type === 'elevator_motor' || c.type === 'parking_gate') {
        inKey = getTerminalKey(c.id, 'pos');
        outKey = getTerminalKey(c.id, 'neg');
      } else if (c.type === 'maglock') {
        inKey = getTerminalKey(c.id, 'in');
        outKey = getTerminalKey(c.id, 'out');
      }

      if (inKey && outKey) {
        const inPos = connectedToPos.has(inKey);
        const inNeg = connectedToNeg.has(inKey);
        const outPos = connectedToPos.has(outKey);
        const outNeg = connectedToNeg.has(outKey);

        const isPowered = (inPos && outNeg) || (outPos && inNeg);
        if (isPowered && !shortCircuit) {
          newEnergized.add(c.id);
          if (isCoil && !coilStates[c.id]) {
            coilStates[c.id] = true;
            statesChanged = true;
          }
        } else {
          if (isCoil && coilStates[c.id]) {
            coilStates[c.id] = false;
            statesChanged = true;
          }
        }
      }
    });

    energizedComponents = newEnergized;

    // 7. Calculate final node voltages for multimeter and animations
    nodeVoltages = {};
    components.forEach(c => {
      c.terminals.forEach(t => {
        const key = getTerminalKey(c.id, t.id);
        const isPos = connectedToPos.has(key);
        const isNeg = connectedToNeg.has(key);
        const isACL = connectedToACL.has(key);
        const isACN = connectedToACN.has(key);

        if (isPos && isNeg) {
          nodeVoltages[key] = 0; // Shorted out
        } else if (isPos) {
          // Find source voltage (24V or 12V)
          const is24V = posSources.some(s => {
            const sourceCompId = s.split(':')[0];
            const sourceComp = compMap.get(sourceCompId);
            return sourceComp && (sourceComp.type === 'power_supply' || sourceComp.type === 'transformer');
          });
          nodeVoltages[key] = is24V ? 24 : 12;
        } else if (isNeg) {
          nodeVoltages[key] = 0;
        } else if (isACL && isACN) {
          nodeVoltages[key] = 0;
        } else if (isACL) {
          nodeVoltages[key] = 120; // 120V AC
        } else if (isACN) {
          nodeVoltages[key] = 0;
        } else {
          // Floating
          nodeVoltages[key] = 0;
        }
      });
    });

    if (!statesChanged) {
      break;
    }
  }

  // 8. Find fault locations for diagnostics
  // Let's identify if current stops at an open contact.
  if (!shortCircuit && energizedComponents.size === 0 && components.some(c => ['bulb', 'led', 'led_strip', 'motor', 'buzzer', 'roland_fan'].includes(c.type))) {
    // Look at why the active loads are off.
    for (const c of components) {
      if (['bulb', 'led', 'led_strip', 'motor', 'buzzer', 'roland_fan'].includes(c.type)) {
        const hasPos = Object.keys(nodeVoltages).some(k => nodeVoltages[k] > 0 && k.split(':')[0] === c.id);
        
        if (!hasPos) {
          // Current did not reach the component. Let's trace back where the wire path breaks.
          // Find connected elements to Positive and check components in between.
          const openSwitches = components.filter(sw => 
            (sw.type === 'button_no' && !sw.state.pressed) ||
            (sw.type === 'button_nc' && sw.state.pressed) ||
            (sw.type === 'fuse' && sw.state.blown)
          );
          if (openSwitches.length > 0) {
            faultLocation = getTerminalKey(openSwitches[0].id, 'in');
          }
        }
      }
    }
  }

  return {
    nodeVoltages,
    energizedComponents,
    shortCircuit,
    shortCircuitNodes,
    fuseBlownIds,
    diagnosticLog,
    faultLocation,
  };
}

// Check continuity or resistance between two terminals
export function queryMultimeter(
  mode: string,
  tRed: { componentId: string; terminalId: string } | null,
  tBlack: { componentId: string; terminalId: string } | null,
  components: CircuitComponent[],
  wires: Wire[],
  solved: SolverResult
): string {
  if (mode === 'OFF' || !tRed || !tBlack) return '---';

  const redKey = getTerminalKey(tRed.componentId, tRed.terminalId);
  const blackKey = getTerminalKey(tBlack.componentId, tBlack.terminalId);

  // 1. Voltage Mode: returns the difference in potential
  if (mode === 'VOLTAGE') {
    const vRed = solved.nodeVoltages[redKey] || 0;
    const vBlack = solved.nodeVoltages[blackKey] || 0;
    return `${Math.abs(vRed - vBlack).toFixed(1)} V`;
  }

  // 2. Continuity/Resistance Mode: Check if there's a closed path between them
  const pathExists = checkPathBetween(redKey, blackKey, components, wires);

  if (mode === 'CONTINUITY') {
    return pathExists ? '0.0 Ω (Beep)' : 'O.L (Open)';
  }

  if (mode === 'RESISTANCE') {
    if (!pathExists) return 'O.L';
    
    // Simple load resistance logic:
    // If path goes through a load, return its mock resistance.
    // Otherwise, return 0.1 ohm.
    let resistance = 0.1;
    const pathComponents = getComponentsInPath(redKey, blackKey, components, wires);
    
    pathComponents.forEach(c => {
      if (c.type === 'bulb') resistance += 15.0;
      else if (c.type === 'led' || c.type === 'led_strip') resistance += 220.0;
      else if (c.type === 'motor' || c.type === 'actuator' || c.type === 'parking_gate' || c.type === 'roland_fan') resistance += 45.0;
      else if (c.type === 'elevator_motor') resistance += 30.0;
      else if (c.type === 'buzzer') resistance += 150.0;
      else if (c.type === 'relay' || c.type === 'relay_dpdt' || c.type === 'timer_relay') resistance += 80.0;
      else if (c.type === 'maglock') resistance += 120.0;
      else if (c.type === 'card_reader') resistance += 100.0;
    });
    
    return `${resistance.toFixed(1)} Ω`;
  }

  return '---';
}

function checkPathBetween(
  t1: string,
  t2: string,
  components: CircuitComponent[],
  wires: Wire[]
): boolean {
  const adjList: Record<string, Set<string>> = {};
  const addConn = (k1: string, k2: string) => {
    if (!adjList[k1]) adjList[k1] = new Set();
    if (!adjList[k2]) adjList[k2] = new Set();
    adjList[k1].add(k2);
    adjList[k2].add(k1);
  };

  // Add wires
  wires.forEach(w => {
    addConn(getTerminalKey(w.fromComponentId, w.fromTerminalId), getTerminalKey(w.toComponentId, w.toTerminalId));
  });

  // Add internal closed components
  components.forEach(c => {
    if (c.type === 'button_no') {
      const hasCom = c.terminals.some(t => t.id === 'com');
      if (hasCom) {
        if (c.state.pressed) {
          addConn(getTerminalKey(c.id, 'com'), getTerminalKey(c.id, 'no'));
        } else {
          addConn(getTerminalKey(c.id, 'com'), getTerminalKey(c.id, 'nc'));
        }
      } else if (c.state.pressed) {
        addConn(getTerminalKey(c.id, 'in'), getTerminalKey(c.id, 'out'));
      }
    } else if (c.type === 'button_nc' && !c.state.pressed) {
      addConn(getTerminalKey(c.id, 'in'), getTerminalKey(c.id, 'out'));
    } else if (c.type === 'door_sensor' && !c.state.toggled) {
      addConn(getTerminalKey(c.id, 'in'), getTerminalKey(c.id, 'out'));
    } else if (c.type === 'switch_selector') {
      const targetOut = c.state.toggled ? 'out_b' : 'out_a';
      addConn(getTerminalKey(c.id, 'in'), getTerminalKey(c.id, targetOut));
    } else if (c.type === 'rocker_switch_2pos') {
      const targetOut = c.state.toggled ? 'no' : 'nc';
      addConn(getTerminalKey(c.id, 'com'), getTerminalKey(c.id, targetOut));
    } else if (c.type === 'relay') {
      // Connect coil
      addConn(getTerminalKey(c.id, 'coil_a'), getTerminalKey(c.id, 'coil_b'));
      // Connect contacts
      const isEnergized = c.state.energized;
      if (isEnergized) {
        addConn(getTerminalKey(c.id, 'com'), getTerminalKey(c.id, 'no'));
      } else {
        addConn(getTerminalKey(c.id, 'com'), getTerminalKey(c.id, 'nc'));
      }
    } else if (c.type === 'relay_dpdt') {
      addConn(getTerminalKey(c.id, 'coil_a'), getTerminalKey(c.id, 'coil_b'));
      const isEnergized = c.state.energized;
      if (isEnergized) {
        addConn(getTerminalKey(c.id, 'com1'), getTerminalKey(c.id, 'no1'));
        addConn(getTerminalKey(c.id, 'com2'), getTerminalKey(c.id, 'no2'));
      } else {
        addConn(getTerminalKey(c.id, 'com1'), getTerminalKey(c.id, 'nc1'));
        addConn(getTerminalKey(c.id, 'com2'), getTerminalKey(c.id, 'nc2'));
      }
    } else if (c.type === 'rocker_switch_3pos') {
      const switchState = c.state.toggled as any;
      if (switchState === 'left') {
        addConn(getTerminalKey(c.id, 'com1'), getTerminalKey(c.id, 'l1'));
        addConn(getTerminalKey(c.id, 'com2'), getTerminalKey(c.id, 'l2'));
      } else if (switchState === 'right') {
        addConn(getTerminalKey(c.id, 'com1'), getTerminalKey(c.id, 'r1'));
        addConn(getTerminalKey(c.id, 'com2'), getTerminalKey(c.id, 'r2'));
      }
    } else if (c.type === 'timer_relay') {
      addConn(getTerminalKey(c.id, 'coil_a'), getTerminalKey(c.id, 'coil_b'));
      if (c.state.delayedActive) {
        addConn(getTerminalKey(c.id, 'com'), getTerminalKey(c.id, 'no'));
      } else {
        addConn(getTerminalKey(c.id, 'com'), getTerminalKey(c.id, 'nc'));
      }
    } else if (c.type === 'limit_switch' && !c.state.pressed) {
      addConn(getTerminalKey(c.id, 'in'), getTerminalKey(c.id, 'out'));
    } else if (c.type === 'fuse' && !c.state.blown) {
      addConn(getTerminalKey(c.id, 'in'), getTerminalKey(c.id, 'out'));
    } else if (c.type === 'terminal_block') {
      addConn(getTerminalKey(c.id, 't1'), getTerminalKey(c.id, 't2'));
      addConn(getTerminalKey(c.id, 't3'), getTerminalKey(c.id, 't4'));
    } else if (['bulb', 'led', 'led_strip', 'motor', 'buzzer', 'maglock', 'lamp_indicator', 'roland_fan'].includes(c.type)) {
      addConn(getTerminalKey(c.id, 'in'), getTerminalKey(c.id, 'out'));
    } else if (c.type === 'actuator' || c.type === 'elevator_motor' || c.type === 'parking_gate') {
      addConn(getTerminalKey(c.id, 'pos'), getTerminalKey(c.id, 'neg'));
    } else if (c.type === 'card_reader') {
      addConn(getTerminalKey(c.id, 'pos'), getTerminalKey(c.id, 'neg'));
      if (c.state.active) {
        addConn(getTerminalKey(c.id, 'pos'), getTerminalKey(c.id, 'out'));
      }
    } else if (c.type === 'junction') {
      const ports = c.terminals.map(t => getTerminalKey(c.id, t.id));
      for (let i = 0; i < ports.length - 1; i++) {
        addConn(ports[i], ports[i + 1]);
      }
    }
  });

  // BFS
  const visited = new Set<string>();
  const queue = [t1];
  visited.add(t1);

  while (queue.length > 0) {
    const curr = queue.shift()!;
    if (curr === t2) return true;
    const neighbors = adjList[curr] || new Set();
    for (const n of neighbors) {
      if (!visited.has(n)) {
        visited.add(n);
        queue.push(n);
      }
    }
  }

  return false;
}

function getComponentsInPath(
  t1: string,
  t2: string,
  components: CircuitComponent[],
  wires: Wire[]
): CircuitComponent[] {
  const compMap = new Map<string, CircuitComponent>();
  components.forEach(c => compMap.set(c.id, c));

  const pathComps: CircuitComponent[] = [];
  const adjList: Record<string, Set<string>> = {};
  const addConn = (k1: string, k2: string) => {
    if (!adjList[k1]) adjList[k1] = new Set();
    if (!adjList[k2]) adjList[k2] = new Set();
    adjList[k1].add(k2);
    adjList[k2].add(k1);
  };

  wires.forEach(w => {
    addConn(getTerminalKey(w.fromComponentId, w.fromTerminalId), getTerminalKey(w.toComponentId, w.toTerminalId));
  });

  components.forEach(c => {
    if (c.type === 'button_no') {
      const hasCom = c.terminals.some(t => t.id === 'com');
      if (hasCom) {
        if (c.state.pressed) {
          addConn(getTerminalKey(c.id, 'com'), getTerminalKey(c.id, 'no'));
        } else {
          addConn(getTerminalKey(c.id, 'com'), getTerminalKey(c.id, 'nc'));
        }
      } else if (c.state.pressed) {
        addConn(getTerminalKey(c.id, 'in'), getTerminalKey(c.id, 'out'));
      }
    } else if (c.type === 'button_nc' && !c.state.pressed) {
      addConn(getTerminalKey(c.id, 'in'), getTerminalKey(c.id, 'out'));
    } else if (c.type === 'door_sensor' && !c.state.toggled) {
      addConn(getTerminalKey(c.id, 'in'), getTerminalKey(c.id, 'out'));
    } else if (c.type === 'switch_selector') {
      const targetOut = c.state.toggled ? 'out_b' : 'out_a';
      addConn(getTerminalKey(c.id, 'in'), getTerminalKey(c.id, targetOut));
    } else if (c.type === 'rocker_switch_2pos') {
      const targetOut = c.state.toggled ? 'no' : 'nc';
      addConn(getTerminalKey(c.id, 'com'), getTerminalKey(c.id, targetOut));
    } else if (c.type === 'relay') {
      addConn(getTerminalKey(c.id, 'coil_a'), getTerminalKey(c.id, 'coil_b'));
      const isEnergized = c.state.energized;
      if (isEnergized) {
        addConn(getTerminalKey(c.id, 'com'), getTerminalKey(c.id, 'no'));
      } else {
        addConn(getTerminalKey(c.id, 'com'), getTerminalKey(c.id, 'nc'));
      }
    } else if (c.type === 'relay_dpdt') {
      addConn(getTerminalKey(c.id, 'coil_a'), getTerminalKey(c.id, 'coil_b'));
      const isEnergized = c.state.energized;
      if (isEnergized) {
        addConn(getTerminalKey(c.id, 'com1'), getTerminalKey(c.id, 'no1'));
        addConn(getTerminalKey(c.id, 'com2'), getTerminalKey(c.id, 'no2'));
      } else {
        addConn(getTerminalKey(c.id, 'com1'), getTerminalKey(c.id, 'nc1'));
        addConn(getTerminalKey(c.id, 'com2'), getTerminalKey(c.id, 'nc2'));
      }
    } else if (c.type === 'timer_relay') {
      addConn(getTerminalKey(c.id, 'coil_a'), getTerminalKey(c.id, 'coil_b'));
      if (c.state.delayedActive) {
        addConn(getTerminalKey(c.id, 'com'), getTerminalKey(c.id, 'no'));
      } else {
        addConn(getTerminalKey(c.id, 'com'), getTerminalKey(c.id, 'nc'));
      }
    } else if (c.type === 'fuse' && !c.state.blown) {
      addConn(getTerminalKey(c.id, 'in'), getTerminalKey(c.id, 'out'));
    } else if (c.type === 'terminal_block') {
      addConn(getTerminalKey(c.id, 't1'), getTerminalKey(c.id, 't2'));
      addConn(getTerminalKey(c.id, 't3'), getTerminalKey(c.id, 't4'));
    } else if (['bulb', 'led', 'led_strip', 'motor', 'buzzer', 'maglock', 'lamp_indicator', 'roland_fan'].includes(c.type)) {
      addConn(getTerminalKey(c.id, 'in'), getTerminalKey(c.id, 'out'));
    } else if (c.type === 'actuator' || c.type === 'elevator_motor' || c.type === 'parking_gate') {
      addConn(getTerminalKey(c.id, 'pos'), getTerminalKey(c.id, 'neg'));
    } else if (c.type === 'card_reader') {
      addConn(getTerminalKey(c.id, 'pos'), getTerminalKey(c.id, 'neg'));
      if (c.state.active) {
        addConn(getTerminalKey(c.id, 'pos'), getTerminalKey(c.id, 'out'));
      }
    } else if (c.type === 'junction') {
      const ports = c.terminals.map(t => getTerminalKey(c.id, t.id));
      for (let i = 0; i < ports.length - 1; i++) {
        addConn(ports[i], ports[i + 1]);
      }
    }
  });

  // DFS/BFS to find the path and gather component IDs
  const visited = new Set<string>();
  const parentMap: Record<string, string> = {};
  const queue = [t1];
  visited.add(t1);

  let pathFound = false;
  while (queue.length > 0) {
    const curr = queue.shift()!;
    if (curr === t2) {
      pathFound = true;
      break;
    }
    const neighbors = adjList[curr] || new Set();
    for (const n of neighbors) {
      if (!visited.has(n)) {
        visited.add(n);
        parentMap[n] = curr;
        queue.push(n);
      }
    }
  }

  if (pathFound) {
    let curr = t2;
    const pathNodes = [t2];
    while (curr !== t1) {
      curr = parentMap[curr];
      pathNodes.push(curr);
    }
    // Extract component IDs
    const seenCompIds = new Set<string>();
    pathNodes.forEach(nodeKey => {
      const cId = nodeKey.split(':')[0];
      if (cId && !seenCompIds.has(cId)) {
        seenCompIds.add(cId);
        const comp = compMap.get(cId);
        if (comp) pathComps.push(comp);
      }
    });
  }

  return pathComps;
}
