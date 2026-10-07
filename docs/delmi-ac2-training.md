# DELMI AC-2 access-control training board

The AC-2 is a custom simulator device combining the shared installation concepts shown in the supplied Atrium A22 flyer and RBH UNC100 reference. Its terminal layout is DELMI's own. It is not a firmware emulator or a wiring replacement for either product.

## Launch and operate

Open **Access control lab** from its separate section on the home page, or load the **DELMI AC-2 · Two-door Access Control** preset there. The access workspace has its own device library, wiring and Undo history; switching back to electronics restores that bench. The supplied AL600 is set to 12V. Turn on System Power. Each reader lets you select an allowed or denied credential and scan it. Click the controller for its per-door programming and event log.

Door 1 controls a fail-secure strike through COM/NO. Door 2 controls a fail-safe maglock through COM/NC. Both REX plates are normally open in this example. Click a door contact to simulate moving the magnet away (door open), then click again to close it. Opening during a grant or REX gives an authorized opening; opening while secured gives a forced-open alert. Leaving an authorized door open past its configured limit gives a held-open alert.

## Training terminal groups

| Group | Connections | Behavior |
|---|---|---|
| Power | +12V, 0V | Custom board accepts positive 11–15V DC across both rails. Reversed polarity, missing return or 24V do not power it. |
| Reader 1 / 2 | +12V, 0V, D0, D1, LED, BUZ | Reader gets supply and data ground. Both data lines must reach the same matching port; a swapped, shorted or missing line cannot grant access. LED and buzzer feedback require their respective wires. |
| Inputs 1 / 2 | REX, DC, COM | Voltage-free contact loops to the shared 0V common. REX NO/NC and unlock/shunt behavior are configurable. DC is a closed-at-rest door-contact loop. |
| Lock 1 / 2 | COM, NO, NC | Isolated changeover contacts. They do not supply voltage. Wire external lock supply to COM, then NO for a fail-secure strike or NC for a fail-safe maglock, with the lock return to its supply negative. |

The preset uses NASCOM's COM/NO reed contact pair, which is closed with the magnet present. This terminal marking differs from a controller's description of a normally closed door loop: always check the specific contact documentation.

## What is modeled

Two independent credential decisions, timed relay release, wired REX inputs, closed/open/forced/held door monitoring, reader status outputs and a bounded event log. Unlock and held-open durations are configurable from 1 to 120 seconds. Removing power clears pending unlocks and restores the relays' COM/NC rest position. Old scans do not replay after restarting.

Reader events stand in for Wiegand pulses; LED and buzzer indications are logical feedback. Network and RS485 expansion, PoE, backup charging, vendor databases, OSDP encryption, tamper and resistor/EOL supervision are not simulated. The simulator can identify a removed virtual wire, but this is not a claim that an unsupervised real input can distinguish a cut wire from an open contact. This is a wiring lesson, not a complete real-world maglock egress design.

## Reference differences

The Atrium A22 flyer shows a 24V board input, reader supply/data/indicators, per-door REX/contact groups, and lock outputs with configurable power options. The UNC100 specification describes a nominal 13.8V board supply, two reader ports and dry SPDT relay outputs. The AC-2 deliberately uses its own 12V supply and external dry-relay lock wiring to keep those lessons clear.

- [CDVI Atrium A22 flyer](https://www.cdvi.ca/PDF/ATRIUM_Flyer.pdf) — also supplied locally as ATRIUM_Flyer-2.pdf.
- [RBH UNC100 specification](https://rbh-access.com/download/2999/).
- [CDVI controller input documentation](https://www.cdvi.ca/PDF/CDVI_A22K_IM.pdf) — door status and request-to-exit concepts.
