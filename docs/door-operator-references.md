# Door operator and push plate references

## Visionis VIS-7039

The supplied photo matches the square stainless steel Visionis VIS-7039 with black back box, blue wheelchair symbol and PRESS TO OPEN lettering.

Official document index: https://www.visionistech.com/en/exit-devices-document-library/doc-handicap-push-to-exit-buttons/

The manufacturer identifies NC, COM and NO outputs. The simulation uses the existing momentary SPDT contact model: idle COM–NC; pressed COM–NO; pointer release or cancellation releases the plate. The terminals shown below the face are a teaching breakout, not screws on the physical front. No power supply is required for the contact simulation.

## ASSA ABLOY swing operator

The supplied photo shows a silver overhead housing, dark end cap and pull-side sliding arm/track. The rendering follows that reference and opens by swinging rather than translating like a sliding gate.

Official family reference: https://www.assaabloyentrance.com/global/en/solutions/products/automatic-doors/swing-doors

The exact model cannot be established from the supplied photo alone. The simulator deliberately does not assign SW100 or SW200, physical terminal numbers, dimensions or model-specific timing. ACT/COM are a simplified teaching interface; mains power and onboard operator controls are not simulated. A closed activation contact commands opening; releasing it commands closing in this simplified model.

For CX-12 Plus operation, wire relay 2 NO/COM (6/7) across the operator activation pair. A push plate COM/NO pair can drive the CX dry input. The plate itself does not create a timed hold or a voltage output.

## Key switch animation

Camden stainless steel key-switch reference: https://www.camdencontrols.com/pipelines/resource/7450_CM_1200_2200_Manual_R3.pdf

The manual lists CM-1230/CM-2230 as maintained SPDT contacts. This supports the existing COM–NC / COM–NO maintained model, but does not identify the user photo as that exact product. Optional red/green LEDs require separate DC wiring and suitable resistors; current lights are position indicators only. The illustrated 90-degree key turn is a visual approximation, not a datasheet-specified angle. The downward brass key bow has an enlarged clickable area. The outer cylinder remains fixed while the plug and inserted brass key turn together.
