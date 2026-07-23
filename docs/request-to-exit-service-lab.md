# Request-to-Exit & Service Override Lab

This document records the hardware behavior used to design Module 21. The on-screen circuit is an educational 24 V control model, not a permit, installation drawing, or substitute for the applicable electrical, fire, life-safety, and access-control codes.

## Representative hardware basis

| Simulator component | Representative product | Data-sheet behavior used by the lab |
| --- | --- | --- |
| 24 V power supply | [Altronix AL600ULX](https://altronix.com/products/AL600ULX) ([installation instructions](https://www.altronix.com/library/pdf/installation_instructions/AL600ULXseries.pdf)) | Selectable 12/24 VDC output; the lab uses the 24 V setting. |
| DPDT relay | [Omron MY2-GS-R DC24](https://automation.omron.com/en/us/products/family/MY-GS-R/MY2-GS-R%20DC24) ([specifications](https://www.ia.omron.com/products/family/3440/specification.html)) | 24 VDC coil with two changeover contact poles (DPDT). |
| Momentary and maintained switches | [dormakaba RCI 909](https://kb.dormakaba.com/hc/en-us/articles/39668465993243-RCI-909-Surface-and-Flush-Mount-Rocker-Switches-Installation-Instructions) | SPDT C/NO/NC contact arrangement; momentary operation can be converted to maintained operation on the surface model. The simulator uses one of each mode. |
| Red and green pilot lights | [Schneider Harmony XB4 green, 24 V AC/DC](https://www.se.com/us/en/product/XB4BVB35/pilot-light-harmony-xb4-metal-green-22mm-universal-led-plain-lens-24v-ac-dc-compact-push-in-terminals/) and [XB4 red, 24 V AC/DC](https://www.se.com/us/en/product/XB4BVB4/pilot-light-harmony-xb4metal-red-22mm-universal-led-plain-lens-24v-ac-dc/) | 24 V red/green status indication. |
| Fail-safe magnetic lock | [dormakaba RCI F8315/F8325 MultiMag](https://www.dormakaba.com/us-en/offering/products/electronic-access-data/electromagnetic-locks-maglocks/rci-f8315f8325-multimag--dk_81100) | 12–24 VDC, fail-safe: powered to secure and released when power is removed. |

## Control design

The maintained Service switch is an SPDT mode selector. At rest, its COM-to-NC contact passes 24 VDC to the momentary REX switch. When Service is toggled, COM transfers to NO and sends 24 VDC directly to the relay coil, producing a maintained release.

The relay uses both changeover poles:

- Pole 1 transfers status power from red `SECURE` on NC1 to green `RELEASED` on NO1.
- Pole 2 supplies the fail-safe maglock through NC2. Energizing the relay opens that powered lock path by transferring COM2 to the unused NO2 contact.

## Required operating sequence

| Test state | Service switch | REX switch | Relay | Red SECURE | Green RELEASED | Fail-safe maglock power |
| --- | --- | --- | --- | --- | --- | --- |
| Idle | NC / Normal | Released | OFF | ON | OFF | ON — locked |
| Momentary egress | NC / Normal | Held | ON | OFF | ON | OFF — released |
| Return to secure | NC / Normal | Released | OFF | ON | OFF | ON — locked |
| Service override | NO / Service | Released | ON | OFF | ON | OFF — released |

Module 21 requires the learner to demonstrate all four states before completion.
