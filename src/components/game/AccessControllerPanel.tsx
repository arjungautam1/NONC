import React, { useState } from 'react';
import { Cable, Settings2, List, X } from 'lucide-react';
import type { CircuitComponent } from '../../types/game';
import { useGameStore } from '../../store/useGameStore';
import { accessDoorStatusLabel, getAccessControllerConfig, type AccessDoorConfig } from './components/accessControllerPinout';

interface AccessControllerPanelProps {
  component: CircuitComponent;
  onClose: () => void;
}

const DurationField: React.FC<{ label: string; value: number; onChange: (next: number) => void }> = ({ label, value, onChange }) => (
  <label className="flex items-center justify-between gap-3 text-[11px] text-slate-300">
    <span>{label}</span>
    <span className="flex items-center gap-1.5">
      <input type="number" min="1" max="120" step="1" value={value}
        onChange={event => { const next = event.target.valueAsNumber; if (Number.isFinite(next)) onChange(Math.min(120, Math.max(1, Math.round(next)))); }}
        aria-label={label} className="h-8 w-16 rounded-md border border-white/10 bg-slate-950 px-2 text-right font-mono text-sky-200 focus:border-sky-300/60 focus:outline-none" />
      <span className="w-3 text-slate-500">s</span>
    </span>
  </label>
);

export const AccessControllerPanel: React.FC<AccessControllerPanelProps> = ({ component, onClose }) => {
  const [tab, setTab] = useState<'setup' | 'wiring' | 'events'>('setup');
  const configure = useGameStore(state => state.configureAccessController);
  const config = getAccessControllerConfig(component);
  const powered = Boolean(component.state.boardPowered);
  const events = (component.state.accessEvents ?? []) as Array<{ time: number; door: number; event: string }>;
  const updateDoor = (door: 1 | 2, patch: Partial<AccessDoorConfig>) => {
    const key = door === 1 ? 'door1' : 'door2';
    configure(component.id, { [key]: { ...config[key], ...patch } });
  };

  return <aside
    className="pointer-events-auto absolute right-3 top-14 z-30 flex max-h-[calc(100%-4.5rem)] w-[min(400px,calc(100%-1.5rem))] flex-col overflow-hidden rounded-xl border border-sky-300/20 bg-[#080e17]/95 shadow-[0_24px_80px_rgba(0,0,0,0.58)] backdrop-blur-xl"
    aria-label="DELMI AC-2 programming and wiring"
    onPointerDown={event => event.stopPropagation()} onClick={event => event.stopPropagation()}>
    <header className="flex items-start gap-3 border-b border-white/10 bg-gradient-to-r from-sky-500/10 to-transparent px-4 py-3">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-sky-300/20 bg-sky-400/10 text-xs font-black text-sky-300">AC-2</div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <h2 className="text-sm font-bold text-white">DELMI AC-2</h2>
          <span className={`rounded-full px-1.5 py-0.5 text-[8px] font-black tracking-wider ${powered ? 'bg-emerald-400/15 text-emerald-300' : 'bg-slate-700/60 text-slate-400'}`}>{powered ? 'POWERED' : 'OFF'}</span>
        </div>
        <p className="mt-0.5 text-[10px] text-slate-400">Custom two-door access control training board</p>
      </div>
      <button type="button" onClick={onClose} aria-label="Close access controller settings" className="rounded-md p-1 text-slate-500 transition hover:bg-white/10 hover:text-white"><X className="h-4 w-4" /></button>
    </header>
    <div className="grid grid-cols-3 gap-1 border-b border-white/10 px-3 py-2" role="tablist" aria-label="Access controller views">
      {([{ id: 'setup', label: 'Program', Icon: Settings2 }, { id: 'wiring', label: 'Wiring', Icon: Cable }, { id: 'events', label: 'Events', Icon: List }] as const).map(({ id, label, Icon }) => (
        <button key={id} type="button" role="tab" aria-selected={tab === id} onClick={() => setTab(id)} className={`flex items-center justify-center gap-1.5 rounded-md px-2 py-2 text-[10px] font-bold transition ${tab === id ? 'bg-sky-400/10 text-sky-200' : 'text-slate-500 hover:bg-white/5 hover:text-slate-200'}`}><Icon className="h-3.5 w-3.5" />{label}</button>
      ))}
    </div>
    <div className="overflow-y-auto p-3.5">
      <div className="grid grid-cols-2 gap-2" aria-label="Live door states">
        {([1, 2] as const).map(door => {
          const active = Boolean(component.state[`relay${door}Active`]);
          const status = String(component.state[`door${door}Status`] ?? (powered ? 'unmonitored' : 'unpowered'));
          const alarm = ['forced-open', 'held-open', 'wiring-fault'].includes(status);
          return <div key={door} className={`rounded-lg border p-2.5 ${alarm ? 'border-rose-300/25 bg-rose-400/5' : 'border-white/10 bg-white/[0.025]'}`}>
            <div className="flex items-center justify-between text-[10px] font-black text-slate-200"><span>DOOR {door}</span><span className={`h-1.5 w-1.5 rounded-full ${active ? 'bg-amber-300 shadow-[0_0_8px_#fcd34d]' : 'bg-slate-700'}`} /></div>
            <p className={`mt-1 text-[10px] ${active ? 'text-amber-200' : 'text-slate-500'}`}>{active ? 'Relay energized · COM–NO' : 'Relay at rest · COM–NC'}</p>
            <p className={`mt-1 text-[10px] ${alarm ? 'text-rose-300' : 'text-slate-400'}`}>{accessDoorStatusLabel(status)}</p>
          </div>;
        })}
      </div>

      {tab === 'setup' && <div role="tabpanel" aria-label="Access controller programming">
        <p className="mt-3 text-[11px] leading-relaxed text-slate-400">Wire the reader, lock supply and dry inputs, then scan an authorized card. Each door has its own unlock timer and door monitoring.</p>
        {([1, 2] as const).map(door => {
          const settings = config[door === 1 ? 'door1' : 'door2'];
          return <section key={door} className="mt-3 rounded-lg border border-white/10 bg-white/[0.025] p-3">
            <h3 className="mb-3 text-[11px] font-black text-sky-200">DOOR {door} SETTINGS</h3>
            <div className="space-y-2">
              <DurationField label={`Door ${door} unlock time`} value={settings.unlockSeconds} onChange={unlockSeconds => updateDoor(door, { unlockSeconds })} />
              <DurationField label={`Door ${door} held-open delay`} value={settings.heldOpenSeconds} onChange={heldOpenSeconds => updateDoor(door, { heldOpenSeconds })} />
            </div>
            <label className="mt-3 flex items-center justify-between gap-3 text-[11px] text-slate-300">
              <span>REX contact at rest</span>
              <select aria-label={`Door ${door} REX contact at rest`} value={settings.rexNormallyClosed ? 'nc' : 'no'} onChange={event => updateDoor(door, { rexNormallyClosed: event.target.value === 'nc' })} className="h-8 rounded-md border border-white/10 bg-slate-950 px-2 text-[10px] text-slate-200">
                <option value="no">Normally open</option><option value="nc">Normally closed</option>
              </select>
            </label>
            <label className="mt-3 flex cursor-pointer items-center gap-2 text-[11px] text-slate-300">
              <input type="checkbox" checked={settings.rexUnlock} onChange={event => updateDoor(door, { rexUnlock: event.target.checked })} className="h-3.5 w-3.5 accent-sky-400" />
              REX request releases lock
            </label>
            <p className="mt-1.5 text-[10px] leading-relaxed text-slate-500">{settings.rexUnlock ? 'A valid exit request starts the unlock timer and permits the door to open.' : 'An exit request permits door opening without energizing the lock relay.'} Door contact is normally closed when the door is shut.</p>
          </section>;
        })}
        <section className="mt-3 rounded-lg border border-sky-300/15 bg-sky-400/[0.04] p-3">
          <h3 className="text-[11px] font-bold text-sky-200">Try a door cycle</h3>
          <p className="mt-1.5 text-[10px] leading-relaxed text-slate-400">Power on, then click SCAN CARD on the matching reader. Click the door contact to open it during the unlock. Leave it open past the held-open delay to see an alarm, then click it closed.</p>
          <p className="mt-1.5 text-[10px] leading-relaxed text-slate-400">Open the contact without a valid card or exit request to test forced-open detection. Select a denied card to confirm the relay stays at rest. Use the REX button to test an exit request.</p>
        </section>
      </div>}

      {tab === 'wiring' && <div role="tabpanel" aria-label="Access controller wiring guide" className="mt-3 space-y-3">
        <section className="rounded-lg border border-sky-300/20 bg-sky-400/[0.04] p-3">
          <h3 className="text-xs font-bold text-sky-200">Reader → matching door port</h3>
          <div className="mt-2 grid grid-cols-3 gap-1.5 text-center text-[10px] font-mono text-slate-200">
            {['+12V → +12V', '0V → 0V', 'D0 → D0', 'D1 → D1', 'LED → LED', 'BUZ → BUZ'].map(text => <span key={text} className="rounded bg-slate-950/70 py-1.5">{text}</span>)}
          </div>
          <p className="mt-2 text-[10px] leading-relaxed text-slate-400">Both data wires and power must reach the same reader port. LED and buzzer wires carry simulated controller feedback; they do not supply lock power. Switch the reader between authorized and denied cards to test access decisions.</p>
        </section>
        <section className="rounded-lg border border-white/10 p-3">
          <h3 className="text-xs font-bold text-slate-200">Dry lock relays</h3>
          <p className="mt-2 text-[11px] leading-relaxed text-slate-400">Supply + → COM. Connect NO → fail-secure strike +, or NC → fail-safe maglock +. Lock − returns to its supply −. COM–NC closes at rest; COM–NO closes during an unlock.</p>
          <p className="mt-2 text-[10px] leading-relaxed text-amber-200/80">The relay is a switch. It supplies no voltage on its own. The example uses an external 12V lock supply.</p>
        </section>
        <section className="rounded-lg border border-white/10 p-3">
          <h3 className="text-xs font-bold text-slate-200">REX and door contact</h3>
          <p className="mt-2 text-[11px] leading-relaxed text-slate-400">Wire the exit button contact between REX and input COM. Wire the door contact between DC and input COM; its contact closes when the door is shut. Match the programmed REX setting to the contact used.</p>
          <p className="mt-2 text-[10px] leading-relaxed text-slate-500">These are voltage-free sensing loops. A powered exit sensor needs separate supply wiring plus its dry output contact.</p>
        </section>
      </div>}

      {tab === 'events' && <div role="tabpanel" aria-label="Access controller event log" className="mt-3">
        <p className="mb-2 text-[10px] text-slate-500">Latest access, input and door events for this board.</p>
        {events.length === 0 ? <div className="rounded-lg border border-dashed border-white/10 px-3 py-8 text-center text-[11px] text-slate-500">Power the board and scan a card to begin.</div> : <ol className="space-y-1.5">
          {[...events].reverse().map((entry, index) => <li key={`${entry.time}-${index}`} className="rounded-lg border border-white/[0.07] bg-white/[0.025] px-2.5 py-2">
            <div className="flex items-center justify-between gap-2"><span className="text-[10px] font-bold text-sky-200">{entry.door ? `Door ${entry.door}` : 'Controller'}</span><time dateTime={new Date(entry.time).toISOString()} className="text-[9px] font-mono text-slate-600">{new Date(entry.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</time></div>
            <p className="mt-1 text-[11px] leading-relaxed text-slate-300">{entry.event}</p>
          </li>)}
        </ol>}
      </div>}

      <div className="mt-3 rounded-lg border border-white/[0.07] bg-slate-950/50 p-3 text-[10px] leading-relaxed text-slate-500">
        <p className="font-bold text-slate-400">Training model · custom DELMI pinout</p>
        <p className="mt-1">Uses reader, relay, REX and door monitoring concepts shared by ATRIUM and RBH UNC100. This custom board uses 12V DC; actual A22 and UNC100 power inputs and terminal layouts differ. Card reads and programming are simulated locally. Network setup, vendor software, supervised resistors, current limits and emergency release circuits are outside this model.</p>
        <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1">
          <a href="https://www.cdvi.ca/PDF/ATRIUM_Flyer.pdf" target="_blank" rel="noreferrer" className="text-sky-300 hover:underline">ATRIUM wiring reference ↗</a>
          <a href="https://rbh-access.com/download/2999/" target="_blank" rel="noreferrer" className="text-sky-300 hover:underline">UNC100 specification ↗</a>
        </div>
      </div>
    </div>
  </aside>;
};
