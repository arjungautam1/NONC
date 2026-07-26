import React from 'react';
import type { CircuitComponent } from '../../../types/game';
import { useGameStore } from '../../../store/useGameStore';

interface ComponentProps {
  component: CircuitComponent;
}

// Amseco / Potter AMS-39 Series standard surface mount contact.
// Two white plastic bars: a plain magnet half mounted on the door leaf and a
// switch half with 6-32 screw terminals mounted on the frame. The reed inside
// the switch half is named for its state with the magnet REMOVED, so a
// "Form A N.O." contact is the one held CLOSED while the door is shut.
const BODY_W = 36;
const BODY_H = 132;
const MAGNET_X = 8;
const SWITCH_X = 50;
const SCREW_X = 90;
const OPEN_SHIFT = -20; // magnet travels away with the door leaf

const PlasticBody: React.FC<{ label: string }> = ({ label }) => (
  <g>
    {/* Moulded ABS bar with the wide mounting wings top and bottom */}
    <rect x="0" y="0" width={BODY_W} height={BODY_H} rx="4" fill="url(#scPlastic)" stroke="#b8c0cc" strokeWidth="1" />
    <rect x="1.2" y="1.2" width={BODY_W - 2.4} height={BODY_H - 2.4} rx="3" fill="none" stroke="rgba(255,255,255,0.85)" strokeWidth="1" />

    {/* Screw holes in the mounting wings */}
    {[14, BODY_H - 14].map(cy => (
      <g key={cy}>
        <circle cx={BODY_W / 2} cy={cy} r="6" fill="#9aa3b0" />
        <circle cx={BODY_W / 2} cy={cy} r="5" fill="#5b6472" />
        <circle cx={BODY_W / 2} cy={cy - 0.6} r="4.6" fill="#2b3240" />
      </g>
    ))}

    {/* Raised centre panel */}
    <rect x="4" y="28" width={BODY_W - 8} height={BODY_H - 56} rx="2.5" fill="url(#scPanel)" stroke="#cdd4de" strokeWidth="0.8" />
    <line x1="5.5" y1="29.5" x2="5.5" y2={BODY_H - 29.5} stroke="rgba(255,255,255,0.9)" strokeWidth="1" />
    <line x1={BODY_W - 5.5} y1="29.5" x2={BODY_W - 5.5} y2={BODY_H - 29.5} stroke="rgba(148,163,184,0.5)" strokeWidth="1" />

    {/* Embossed "amseco" brand, moulded sideways like the real part */}
    <text
      transform={`translate(${BODY_W / 2 + 3}, 78) rotate(-90)`}
      textAnchor="middle"
      fill="#e6eaf0"
      stroke="#c3cad5"
      strokeWidth="0.35"
      fontSize="15"
      fontWeight="700"
      fontFamily="Georgia, serif"
      letterSpacing="0.5"
    >
      amseco
    </text>

    {/* UL listing mark and moulded part number */}
    <g transform={`translate(${BODY_W / 2 - 5}, ${BODY_H - 36})`}>
      <circle cx="0" cy="0" r="5" fill="none" stroke="#c3cad5" strokeWidth="0.9" />
      <text transform="rotate(-90)" textAnchor="middle" y="2" fill="#c3cad5" fontSize="5" fontWeight="700">UL</text>
    </g>
    <text
      transform={`translate(${BODY_W / 2 + 8}, ${BODY_H - 36}) rotate(-90)`}
      textAnchor="middle"
      fill="#ccd3dd"
      fontSize="6"
      fontWeight="700"
      fontFamily="Georgia, serif"
    >
      {label}
    </text>
  </g>
);

const ScrewTerminal: React.FC<{ y: number; slim?: boolean }> = ({ y, slim = false }) => (
  <g transform={`translate(${SCREW_X}, ${y})`}>
    {/* Shank running back into the moulding */}
    <rect x={SWITCH_X + BODY_W - SCREW_X} y="-1.6" width={SCREW_X - SWITCH_X - BODY_W + 2} height="3.2" fill="#94a3b8" />
    {slim ? (
      <>
        <rect x="-5" y="-1.5" width="10" height="3" rx="1" fill="#b9c2cf" stroke="#6b7280" strokeWidth="0.6" />
        <rect x="-5" y="-1.5" width="10" height="1.2" fill="rgba(255,255,255,0.6)" />
      </>
    ) : (
      <>
        <circle cx="0" cy="0" r="5.4" fill="url(#scChrome)" stroke="#5c6672" strokeWidth="0.8" />
        <circle cx="0" cy="0" r="3.4" fill="none" stroke="#6b7280" strokeWidth="0.7" />
        <line x1="-3.6" y1="0" x2="3.6" y2="0" stroke="#4b5563" strokeWidth="1.1" />
      </>
    )}
  </g>
);

export const SurfaceContact: React.FC<ComponentProps> = ({ component }) => {
  const toggleSwitch = useGameStore(state => state.toggleSwitch);

  // `toggled` means the door is OPEN, i.e. the magnet has moved off the switch.
  const doorOpen = component.state.toggled || false;
  const isFormC = component.terminals.some(t => t.id === 'com');
  const model = isFormC ? 'AMS-39B' : 'AMS-39';

  const handlePointerDown = (e: React.PointerEvent) => {
    e.stopPropagation();
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    e.stopPropagation();
    toggleSwitch(component.id);
  };

  // Form A closes only while the magnet is present; Form C changes over,
  // resting on NC with the magnet removed and pulling to NO with it present.
  const madeLine = isFormC
    ? (doorOpen ? 'C–NC MADE' : 'C–NO MADE')
    : (doorOpen ? 'LOOP OPEN' : 'LOOP CLOSED');
  const stateColor = doorOpen ? '#f87171' : '#4ade80';

  return (
    <g transform="translate(-42, -99)" className="select-none">
      <defs>
        <linearGradient id="scPlastic" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="45%" stopColor="#f4f6f9" />
          <stop offset="100%" stopColor="#d7dce4" />
        </linearGradient>
        <linearGradient id="scPanel" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#fbfcfe" />
          <stop offset="60%" stopColor="#eef1f6" />
          <stop offset="100%" stopColor="#dfe4ec" />
        </linearGradient>
        <linearGradient id="scChrome" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#f1f5f9" />
          <stop offset="45%" stopColor="#c4ccd6" />
          <stop offset="100%" stopColor="#7c8794" />
        </linearGradient>
      </defs>

      {/* ── Magnet half: mounted on the door leaf, drag/click it to swing the door ── */}
      <g
        transform={`translate(${MAGNET_X + (doorOpen ? OPEN_SHIFT : 0)}, 0)`}
        style={{ transition: 'transform 0.22s ease-out' }}
        className="cursor-pointer"
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
      >
        <title>Click to {doorOpen ? 'close' : 'open'} the door</title>
        <PlasticBody label="8321" />
        {/* Hit area so the whole magnet bar is clickable, holes included */}
        <rect x="0" y="0" width={BODY_W} height={BODY_H} fill="transparent" />
      </g>

      {/* ── Switch half: mounted on the frame, carries the reed and the terminals ── */}
      <g transform={`translate(${SWITCH_X}, 0)`}>
        <PlasticBody label="8321" />
      </g>

      {/* Terminal hardware sits under the Workspace terminal studs */}
      {isFormC ? (
        <>
          <ScrewTerminal y={36} />
          <ScrewTerminal y={66} slim />
          <ScrewTerminal y={96} />
        </>
      ) : (
        <>
          <ScrewTerminal y={46} />
          <ScrewTerminal y={86} />
        </>
      )}

      {/* ── Magnetic coupling across the gap ── */}
      {doorOpen ? (
        <g>
          <line
            x1={MAGNET_X + OPEN_SHIFT + BODY_W + 2}
            y1="66"
            x2={SWITCH_X - 2}
            y2="66"
            stroke="#f87171"
            strokeWidth="1.2"
            strokeDasharray="3 3"
          />
          <text x={(MAGNET_X + OPEN_SHIFT + BODY_W + SWITCH_X) / 2} y="60" textAnchor="middle" fill="#fca5a5" fontSize="6.5" fontWeight="800">
            &gt; ¾&quot;
          </text>
        </g>
      ) : (
        <g stroke="#4ade80" strokeWidth="1.1" fill="none" opacity="0.85">
          <path d={`M ${MAGNET_X + BODY_W} 54 Q ${SWITCH_X - 3} 66 ${MAGNET_X + BODY_W} 78`} />
          <path d={`M ${SWITCH_X} 54 Q ${MAGNET_X + BODY_W + 3} 66 ${SWITCH_X} 78`} />
        </g>
      )}

      {/* ── Live contact state readout ── */}
      <g>
        <rect x="0" y="146" width="96" height="30" rx="5" fill="#070b13" fillOpacity="0.94" stroke="#1e293b" strokeWidth="1" />
        <text x="48" y="158" textAnchor="middle" fill={stateColor} fontSize="8" fontWeight="900" fontFamily="monospace">
          {doorOpen ? 'DOOR OPEN' : 'DOOR CLOSED'}
        </text>
        <text x="48" y="169" textAnchor="middle" fill="#94a3b8" fontSize="7" fontWeight="700" fontFamily="monospace">
          {madeLine}
        </text>
      </g>

      {/* ── Nameplate ── */}
      <g transform="translate(48, 189)" pointerEvents="none">
        <rect x="-46" y="-9" width="92" height="18" rx="5" fill="#070b13" fillOpacity="0.96" stroke="#334155" strokeWidth="1" />
        <text
          x="0" y="3"
          fill="#f1f5f9"
          fontSize={component.label.length > 16 ? 7.2 : 8.5}
          fontWeight="800"
          textAnchor="middle"
          fontFamily="monospace"
        >
          {component.label || model}
        </text>
      </g>
    </g>
  );
};

export default SurfaceContact;
