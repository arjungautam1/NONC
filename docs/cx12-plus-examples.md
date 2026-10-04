# CX-12 Plus application examples

Reference: supplied Camden `a7475_CX_12_Plus_Manual_R3.pdf`, Rev. March 26, 2020, 40-82B241. The uploaded manual is technical reference material, not permission to operate physical equipment.

Open the CX-12 settings, choose **Manual examples**, and **Load wired example**. Loading replaces the bench with power OFF and can be undone. Turn system power ON, then operate the labeled inputs. All examples retain the transformer and AL600. Starting times are RL1 5s, sequence delay 2s, RL2 4s; these are teaching defaults rather than manufacturer presets.

| Example | Mode | Manual reference | Inputs / expected result |
| --- | --- | --- | --- |
| Single door | 1 | Diagram 1, p6 | DRY1 or WET2 releases lock, then pulses operator |
| Apartment, powered interphone | 1 | Diagram 2b, p8 | WET1 releases lock only; DRY2 courtesy requires active lock relay; DRY1 always sequences |
| Apartment, dry interphone + key | 1 | Diagram 2c, p9 | Dry interphone/key switches supply into WET1; same courtesy interlock |
| Two doors, one direction | 1 | p3 | DRY1 sequences RL1 door then RL2 door |
| Maintained access control | 2 | Diagram 2a, p7 | WET1 maintains release; DRY2 exterior gated; DRY1 interior overrides |
| Smoke / maintained operator | 3 | Diagram 3, p10 | WET2 fire or DRY1 presence pulses lock, holds operator while request remains |
| Latching operator | 4 | Diagram 4a, p11 | DRY1/WET1 pulses lock and latches operator; second edge releases operator |
| Ratchet two doors | 4 | Diagram 4b, p12 | DRY2/WET2 latches both in sequence; second edge releases both |
| Two doors, momentary | 5 | Diagram 5, p13 | Side 1 sequences RL1→RL2; Side 2 reverses; stuck input times out |
| Two doors, maintained | 6 | Diagram 5, p13 + p2 | Request holds its respective relay; far relay receives timed sequence pulse |
| Normally unlocked washroom | 7 | Diagram 6, p14 | WET1 outside, DRY1 lock, WET2 inside, DRY2 door contact; outside disabled while occupied |
| Normally locked washroom | 8 | Diagram 7, p15 | Same inputs; brief double-click acknowledges lockout; automatic/manual exit resets occupancy |

## Dry versus wet

The Visionis plate, key switch, maintained SPDT switch, and NASCOM contact have **dry outputs**. The simulated key switch additionally requires 12/24VDC on +/− to operate its contacts, per the user-requested teaching interlock; a purely mechanical key switch does not normally require this power. They do not generate voltage. Plate COM/NO can bridge DRY1 11/12 directly. To use a dry plate on a WET input, route supply + through COM/NO to one WET terminal and supply − to the other. Do not connect this powered circuit across a DRY input.

The generic **Powered signal · momentary** and **Powered signal · maintained** devices model panel outputs; they are not branded hardware replicas. Supply +V/0V first, then connect OUT/COM across a WET pair. SEND produces a 0.5s request; maintained ON stays asserted. Output voltage follows the wired supply and disappears when supply is lost. These devices do not provide isolated relay contacts. The wave sensor requires power, but its relay output is still dry.

## Contact and operator model

Washroom examples link the NASCOM magnet state to the simulated door. COM–NO on this SPDT reed contact is closed with the magnet present; that satisfies Camden's required closed-at-rest door-contact circuit. Opening the simulated handle demonstrates manual exit; clicking again releases it to close. Independent contact devices remain manually operated.

The ASSA ABLOY artwork represents a generic dry-activation swing operator. Its actual model and built-in hold-open timing were not identified from the supplied image. Simulation travels in 80ms steps and closes after the controller request ends; it does not reproduce a specific ASSA motor controller, safety system, or installation. MOVs and optional CM-9600/CM-AF500 annunciators in the drawings are not modeled as separate products. Occupancy is shown in the settings panel.

The manual's Smoke Evac paragraph misprints DRY1 as 13/14. The pinout drawing and Diagram 3 identify DRY1 as 11/12; the simulator follows those. Potentiometer labels distinguish DOO RL2 delay from DOR RL2 hold even where prose contains a pot-number typo.

CX-12 supply is nominal 12/24V AC/DC; 3–30V applies to wet inputs only. The solver uses ±2V acceptance around the nominal board rails as a simulation approximation, not a Camden-specified tolerance. The specified 0.3s response time is not separately emulated. Maintained sequencer behavior follows the manual's statement that a held switch holds its respective relay; release retains any outstanding timed pulse.

## Verification

Run `npx tsx tests/cx12Examples.test.ts`. The deterministic clock covers all 12 example endpoint maps, 8 modes, both output NO/NC paths, delay and expiry, stuck input isolation, courtesy gating, maintained access, maintained operator release, latching cancellation, reversed sequencing, occupancy lockout, double-click acknowledgement, automatic contact updates/manual exit, power loss, invalid board supply, and bench Undo. Generic powered inputs are also checked for missing supply/return and matching output voltage. Run `npm run build` and `npm run lint` for integration checks.
