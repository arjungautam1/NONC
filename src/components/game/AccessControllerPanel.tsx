import React, { useEffect, useId, useRef, useState } from 'react';
import { Activity, ArrowRight, Cable, Check, ChevronRight, Clock3, Cpu, DoorOpen, History, RotateCcw, Save, Settings2, ShieldAlert, X } from 'lucide-react';
import type { CircuitComponent } from '../../types/game';
import { useGameStore } from '../../store/useGameStore';
import { accessDoorStatusLabel, getAccessControllerConfig, type AccessControllerConfig, type AccessDoorConfig } from './components/accessControllerPinout';

interface AccessControllerPanelProps {
  component: CircuitComponent;
  onClose: () => void;
}

type PanelTab = 'overview' | 'program' | 'wiring' | 'events';
const tabs = [
  { id: 'overview', label: 'Overview', Icon: Activity },
  { id: 'program', label: 'Program', Icon: Settings2 },
  { id: 'wiring', label: 'Wiring', Icon: Cable },
  { id: 'events', label: 'Events', Icon: History }
] as const;
const focusStyle = 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-300 focus-visible:ring-offset-2 focus-visible:ring-offset-[#101c24]';
const validSeconds = (seconds: number) => Number.isInteger(seconds) && seconds >= 1 && seconds <= 120;

function DurationField({ label, description, value, onChange }: {
  label: string; description: string; value: number; onChange: (value: number) => void;
}) {
  const id = useId();
  const valid = validSeconds(value);
  return <div>
    <label htmlFor={id} className="block text-sm font-semibold text-slate-100">{label}</label>
    <p id={`${id}-help`} className="mt-1 text-xs leading-5 text-slate-400">{description}</p>
    <div className={`mt-2 flex items-center overflow-hidden rounded-xl border bg-[#0b151c] ${valid ? 'border-white/15 focus-within:border-teal-300/60' : 'border-rose-400/60'} focus-within:ring-2 focus-within:ring-teal-300/30`}>
      <input id={id} type="number" min={1} max={120} step={1} inputMode="numeric" value={Number.isFinite(value) ? value : ''}
        onChange={event => onChange(event.currentTarget.valueAsNumber)} aria-invalid={!valid} aria-describedby={`${id}-help ${id}-range`}
        className="min-w-0 flex-1 bg-transparent px-3 py-2.5 text-base font-semibold tabular-nums text-white outline-none" />
      <span aria-hidden="true" className="px-3 text-xs font-medium text-slate-400">seconds</span>
    </div>
    <p id={`${id}-range`} className={`mt-1.5 text-[11px] ${valid ? 'text-slate-500' : 'text-rose-300'}`}>{valid ? '1–120 seconds' : 'Enter a whole number from 1 to 120.'}</p>
  </div>;
}

function WiringRow({ color, from, to }: { color: string; from: string; to: string }) {
  return <div className="flex items-center gap-2.5 py-1.5 text-xs">
    <span aria-hidden="true" className={`h-1.5 w-5 shrink-0 rounded-full ${color}`} />
    <span className="min-w-0 flex-1 font-medium text-slate-200">{from}</span>
    <ArrowRight aria-hidden="true" className="h-3.5 w-3.5 shrink-0 text-slate-600" />
    <span className="min-w-0 flex-1 text-right font-mono text-slate-300">{to}</span>
  </div>;
}

export const AccessControllerPanel: React.FC<AccessControllerPanelProps> = ({ component, onClose }) => {
  const [tab, setTab] = useState<PanelTab>('overview');
  const [selectedDoor, setSelectedDoor] = useState<1 | 2>(1);
  const config = getAccessControllerConfig(component);
  const signature = JSON.stringify(config);
  const [draft, setDraft] = useState<AccessControllerConfig>(() => structuredClone(config));
  const configure = useGameStore(state => state.configureAccessController);
  const isRunning = useGameStore(state => state.isRunning);
  const powered = Boolean(component.state.boardPowered);
  const events = (Array.isArray(component.state.accessEvents) ? component.state.accessEvents : []) as Array<{ time: number; door: number; event: string }>;
  const id = useId();
  const closeRef = useRef<HTMLButtonElement>(null);
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const previousFocus = useRef<HTMLElement | SVGElement | null>(null);
  const changed = JSON.stringify(draft) !== signature;
  const validDraft = [draft.door1, draft.door2].every(door => validSeconds(door.unlockSeconds) && validSeconds(door.heldOpenSeconds));
  const settings = draft[`door${selectedDoor}`];
  const powerLabel = powered ? '12V DC present' : isRunning ? 'No valid 12V DC' : 'Simulation stopped';

  useEffect(() => { setDraft(JSON.parse(signature) as AccessControllerConfig); }, [component.id, signature]);
  useEffect(() => {
    previousFocus.current = document.activeElement instanceof HTMLElement || document.activeElement instanceof SVGElement
      ? document.activeElement : null;
    closeRef.current?.focus({ preventScroll: true });
    return () => {
      const element = previousFocus.current;
      if (element?.isConnected && 'focus' in element && typeof element.focus === 'function') element.focus({ preventScroll: true });
    };
  }, []);

  const updateDraft = (patch: Partial<AccessDoorConfig>) => setDraft(current => ({
    ...current, [`door${selectedDoor}`]: { ...current[`door${selectedDoor}`], ...patch }
  }));
  const handleTabKey = (event: React.KeyboardEvent<HTMLButtonElement>, index: number) => {
    let next: number;
    if (event.key === 'ArrowRight') next = (index + 1) % tabs.length;
    else if (event.key === 'ArrowLeft') next = (index + tabs.length - 1) % tabs.length;
    else if (event.key === 'Home') next = 0;
    else if (event.key === 'End') next = tabs.length - 1;
    else return;
    event.preventDefault(); event.stopPropagation();
    setTab(tabs[next].id); tabRefs.current[next]?.focus();
  };
  const close = () => onClose();

  return <aside
    aria-label="DELMI AC-2 programming and wiring"
    className="pointer-events-auto absolute right-3 top-14 z-30 flex max-h-[calc(100%_-_4.5rem)] w-[420px] max-w-[calc(100%_-_1.5rem)] flex-col overflow-hidden rounded-2xl border border-teal-200/20 bg-[#101c24] shadow-[0_20px_70px_rgba(0,0,0,0.6)]"
    onPointerDown={event => event.stopPropagation()} onClick={event => event.stopPropagation()}
    onKeyDown={event => { event.stopPropagation(); if (event.key === 'Escape') { event.preventDefault(); close(); } }}
    onKeyUp={event => event.stopPropagation()}>
    <header className="relative shrink-0 border-b border-white/10 bg-gradient-to-br from-teal-400/[0.12] via-transparent to-transparent p-3">
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-teal-200/20 bg-teal-300/10 text-teal-200"><Cpu aria-hidden="true" className="h-6 w-6" /></div>
        <div className="min-w-0 flex-1">
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-teal-300/80">Access controller</p>
          <h2 className="mt-0.5 text-lg font-bold tracking-tight text-white">DELMI AC-2</h2>
          <p className="mt-0.5 text-xs text-slate-400">Two doors · custom training controller</p>
        </div>
        <button ref={closeRef} type="button" onClick={close} aria-label="Close access controller settings"
          className={`-mr-1 -mt-1 rounded-lg p-2 text-slate-400 transition hover:bg-white/10 hover:text-white ${focusStyle}`}><X aria-hidden="true" className="h-4 w-4" /></button>
      </div>
      <div className={`mt-2 inline-flex items-center gap-2 rounded-full border px-2.5 py-1 text-xs font-medium ${powered ? 'border-teal-300/20 bg-teal-300/10 text-teal-200' : 'border-white/10 bg-white/[0.04] text-slate-400'}`}>
        <span aria-hidden="true" className={`h-1.5 w-1.5 rounded-full ${powered ? 'bg-teal-300' : 'bg-slate-500'}`} />{powerLabel}
      </div>
    </header>

    <div role="tablist" aria-label="Access controller views" className="grid shrink-0 grid-cols-4 gap-1 border-b border-white/10 px-3 py-2">
      {tabs.map(({ id: tabId, label, Icon }, index) => <button key={tabId} ref={element => { tabRefs.current[index] = element; }} type="button"
        id={`${id}-tab-${tabId}`} role="tab" aria-selected={tab === tabId} aria-controls={`${id}-panel-${tabId}`} tabIndex={tab === tabId ? 0 : -1}
        onClick={() => setTab(tabId)} onKeyDown={event => handleTabKey(event, index)}
        className={`flex min-h-9 items-center justify-center gap-1.5 rounded-lg px-1.5 text-xs font-semibold transition ${tab === tabId ? 'bg-teal-300/10 text-teal-200' : 'text-slate-400 hover:bg-white/5 hover:text-white'} ${focusStyle}`}>
        <Icon aria-hidden="true" className="h-3.5 w-3.5 shrink-0" />{label}
        {tabId === 'program' && changed && <span aria-hidden="true" title="Unsaved changes" className="h-1.5 w-1.5 shrink-0 rounded-full bg-amber-300" />}
      </button>)}
    </div>

    <div className="min-h-0 overflow-y-auto overscroll-contain p-3">
      <section id={`${id}-panel-overview`} role="tabpanel" aria-labelledby={`${id}-tab-overview`} hidden={tab !== 'overview'} tabIndex={0} className={`rounded-lg ${focusStyle}`}>
        <div className="mb-2 flex items-center justify-between gap-2"><h3 className="text-sm font-semibold text-white">Door activity</h3><span className="text-[11px] text-slate-500">Live terminal state</span></div>
        <div className="space-y-2" aria-label="Live door states">
          {([1, 2] as const).map(door => {
            const active = powered && Boolean(component.state[`relay${door}Active`]);
            const status = powered ? String(component.state[`door${door}Status`] ?? 'unmonitored') : 'unpowered';
            const alarm = ['forced-open', 'held-open', 'wiring-fault'].includes(status);
            const remaining = Number(component.state[`unlockRemaining${door}`]);
            const rexWired = Boolean(component.state[`rex${door}Wired`]);
            const rexActive = powered && Boolean(component.state[`rex${door}Active`]);
            return <article key={door} className={`overflow-hidden rounded-xl border ${alarm ? 'border-rose-300/25' : active ? 'border-teal-300/25' : 'border-white/10'} bg-[#0b151c]`}>
              <div className="flex items-start justify-between gap-3 px-4 pt-2.5">
                <div><h4 className="flex items-center gap-2 text-sm font-bold text-white"><DoorOpen aria-hidden="true" className="h-4 w-4 text-slate-400" />Door {door}</h4>
                  <p className={`mt-2 text-xs font-semibold ${active ? 'text-teal-200' : 'text-slate-400'}`}>{active ? 'Unlock command' : 'Relay at rest'}</p></div>
                <div className="text-right"><p className={`font-mono text-2xl font-semibold leading-7 tabular-nums ${active ? 'text-teal-200' : 'text-slate-600'}`}>{active && Number.isFinite(remaining) && remaining > 0 ? `${remaining}s` : '—'}</p><p className="mt-0.5 text-[10px] text-slate-500">{active ? 'command remaining' : 'no active timer'}</p></div>
              </div>
              <dl className="mt-2 space-y-1.5 border-t border-white/[0.07] px-4 py-2 text-xs">
                <div className="flex items-center justify-between gap-3"><dt className="text-slate-500">Relay contact</dt><dd className={`font-mono font-medium ${active ? 'text-teal-200' : 'text-slate-300'}`}>{active ? 'COM–NO closed' : 'COM–NC closed'}</dd></div>
                <div className="flex items-center justify-between gap-3"><dt className="text-slate-500">Door contact · DC</dt><dd className={`flex items-center gap-1.5 text-right font-medium ${alarm ? 'text-rose-300' : status === 'closed' ? 'text-slate-200' : 'text-slate-400'}`}>{alarm && <ShieldAlert aria-hidden="true" className="h-3.5 w-3.5 shrink-0" />}{accessDoorStatusLabel(status)}</dd></div>
                <div className="flex items-center justify-between gap-3"><dt className="text-slate-500">Exit input · REX</dt><dd className={`text-right font-medium ${rexActive ? 'text-teal-200' : rexWired ? 'text-slate-300' : 'text-amber-200/80'}`}>{!rexWired ? 'Not wired' : !powered ? 'Connected · monitoring off' : rexActive ? 'Exit request' : 'Connected · ready'}</dd></div>
              </dl>
            </article>;
          })}
        </div>
        <p className="mt-3 text-[11px] leading-5 text-slate-500">Relay commands show electrical contact position. Door contact inputs report door position.</p>
        {component.state.lastEvent && <div className="mt-4 rounded-xl border border-white/[0.07] bg-white/[0.025] p-3"><p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">Latest event</p><p className="mt-1 text-xs leading-5 text-slate-300">{String(component.state.lastEvent)}</p></div>}
      </section>

      <section id={`${id}-panel-program`} role="tabpanel" aria-labelledby={`${id}-tab-program`} hidden={tab !== 'program'} tabIndex={0} className={`rounded-lg ${focusStyle}`}>
        <h3 className="text-sm font-semibold text-white">Door programming</h3>
        <p className="mt-1 text-xs leading-5 text-slate-400">Prepare settings, then apply them to the controller.</p>
        <div role="group" aria-label="Door to program" className="mt-4 grid grid-cols-2 gap-1 rounded-xl border border-white/10 bg-[#0b151c] p-1">
          {([1, 2] as const).map(door => <button key={door} type="button" aria-pressed={selectedDoor === door} onClick={() => setSelectedDoor(door)}
            className={`rounded-lg px-3 py-2.5 text-xs font-semibold transition ${selectedDoor === door ? 'bg-teal-300/10 text-teal-200' : 'text-slate-400 hover:text-white'} ${focusStyle}`}>Door {door}</button>)}
        </div>
        <div className="mt-5 space-y-4">
          <DurationField label={`Door ${selectedDoor} unlock time`} description="How long the unlock relay command stays active." value={settings.unlockSeconds} onChange={unlockSeconds => updateDraft({ unlockSeconds })} />
          <DurationField label={`Door ${selectedDoor} held-open delay`} description="Allowed open time before a held-open event is recorded." value={settings.heldOpenSeconds} onChange={heldOpenSeconds => updateDraft({ heldOpenSeconds })} />
          <label className="block"><span className="text-sm font-semibold text-slate-100">REX contact at rest</span><span className="mt-1 block text-xs leading-5 text-slate-400">Match the exit contact wired between REX and COM.</span>
            <select aria-label={`Door ${selectedDoor} REX contact at rest`} value={settings.rexNormallyClosed ? 'nc' : 'no'} onChange={event => updateDraft({ rexNormallyClosed: event.target.value === 'nc' })}
              className={`mt-2 w-full rounded-xl border border-white/15 bg-[#0b151c] px-3 py-2.5 text-sm text-slate-200 ${focusStyle}`}><option value="no">Normally open · NO</option><option value="nc">Normally closed · NC</option></select>
          </label>
          <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-white/10 bg-[#0b151c] p-3.5">
            <input type="checkbox" checked={settings.rexUnlock} onChange={event => updateDraft({ rexUnlock: event.target.checked })} className={`mt-0.5 h-4 w-4 shrink-0 rounded accent-teal-300 ${focusStyle}`} />
            <span><span className="block text-sm font-semibold text-slate-100">REX starts unlock command</span><span className="mt-1 block text-xs leading-5 text-slate-400">{settings.rexUnlock ? 'An exit request starts the relay timer and permits door opening.' : 'An exit request shunts door monitoring for the unlock time. The relay stays at rest.'}</span></span>
          </label>
        </div>
        <div className="mt-5 border-t border-white/10 pt-4">
          <p className="flex items-start gap-2 text-[11px] leading-5 text-slate-400"><Clock3 aria-hidden="true" className="mt-0.5 h-3.5 w-3.5 shrink-0 text-amber-200/80" />Applying settings clears active unlock timers for both doors.</p>
          <div className="mt-3 flex gap-2">
            <button type="button" disabled={!changed || !validDraft} onClick={() => { if (changed && validDraft) configure(component.id, structuredClone(draft)); }}
              className={`inline-flex min-h-10 flex-1 items-center justify-center gap-2 rounded-xl bg-teal-300 px-3 py-2.5 text-xs font-bold text-[#062720] transition hover:bg-teal-200 disabled:cursor-default disabled:bg-white/[0.06] disabled:text-slate-500 ${focusStyle}`}><Save aria-hidden="true" className="h-3.5 w-3.5" />Apply settings</button>
            <button type="button" disabled={!changed} onClick={() => setDraft(structuredClone(config))} className={`inline-flex min-h-10 items-center justify-center gap-1.5 rounded-xl border border-white/15 px-3 py-2.5 text-xs font-semibold text-slate-300 transition hover:bg-white/5 disabled:cursor-default disabled:text-slate-600 ${focusStyle}`}><RotateCcw aria-hidden="true" className="h-3.5 w-3.5" />Revert</button>
          </div>
          <p aria-live="polite" className={`mt-2 text-[11px] ${changed ? 'text-amber-200/80' : 'text-slate-500'}`}>{changed ? 'Changes have not been applied.' : 'Settings match the controller.'}</p>
        </div>
      </section>

      <section id={`${id}-panel-wiring`} role="tabpanel" aria-labelledby={`${id}-tab-wiring`} hidden={tab !== 'wiring'} tabIndex={0} className={`space-y-3 rounded-lg ${focusStyle}`}>
        <div><h3 className="text-sm font-semibold text-white">Terminal wiring guide</h3><p className="mt-1 text-xs leading-5 text-slate-400">Use the matching door number for each reader and input.</p></div>
        <section className="rounded-xl border border-red-300/15 bg-[#0b151c] p-3.5"><h4 className="text-xs font-bold text-slate-100">01 <span className="ml-1.5">Controller power</span></h4>
          <div className="mt-2"><WiringRow color="bg-red-400" from="Regulated supply +" to="+12V" /><WiringRow color="bg-slate-500" from="Supply −" to="0V" /></div><p className="mt-2 text-[11px] leading-5 text-slate-400">12V DC input, 11–15V range. Respect polarity.</p></section>
        <section className="rounded-xl border border-teal-300/15 bg-[#0b151c] p-3.5"><h4 className="text-xs font-bold text-slate-100">02 <span className="ml-1.5">Reader power and data</span></h4>
          <div className="mt-2"><WiringRow color="bg-red-400" from="Reader +12V" to="Reader port +12V" /><WiringRow color="bg-slate-500" from="Reader 0V" to="Reader port 0V" /><WiringRow color="bg-emerald-400" from="Reader D0" to="D0" /><WiringRow color="bg-slate-200" from="Reader D1" to="D1" /><WiringRow color="bg-orange-400" from="Reader LED / BUZ" to="LED / BUZ" /></div><p className="mt-2 text-[11px] leading-5 text-slate-400">Power, common ground and both matching data wires are required. LED and BUZ are optional feedback signals.</p></section>
        <section className="rounded-xl border border-sky-300/15 bg-[#0b151c] p-3.5"><h4 className="text-xs font-bold text-slate-100">03 <span className="ml-1.5">Dry input loops</span></h4>
          <div className="mt-2"><WiringRow color="bg-emerald-400" from="Exit contact" to="REX ↔ COM" /><WiringRow color="bg-sky-300" from="Door contact" to="DC ↔ COM" /></div><p className="mt-2 text-[11px] leading-5 text-slate-400">The door contact closes when the door is shut. Program REX as NO or NC to match its contact. Powered exit sensors need separate supply wires and a dry contact output.</p></section>
        <section className="rounded-xl border border-amber-300/15 bg-[#0b151c] p-3.5"><h4 className="text-xs font-bold text-slate-100">04 <span className="ml-1.5">External lock supply</span></h4>
          <div className="mt-2"><WiringRow color="bg-red-400" from="Lock supply +" to="Relay COM" /><WiringRow color="bg-orange-400" from="Fail-secure strike +" to="Relay NO" /><WiringRow color="bg-orange-400" from="Fail-safe maglock +" to="Relay NC" /><WiringRow color="bg-slate-500" from="Lock −" to="Lock supply −" /></div><p className="mt-2 text-[11px] leading-5 text-amber-200/80">Dry relays switch external power. The relay supplies no voltage. COM–NC closes at rest; COM–NO closes during an unlock command.</p></section>
        <div className="rounded-xl border border-white/[0.07] bg-white/[0.025] p-3.5 text-[11px] leading-5 text-slate-500"><h4 className="font-semibold text-slate-300">Custom DELMI training pinout</h4><p className="mt-1.5">Shared ATRIUM and RBH UNC100 concepts, with a custom 12V DC layout. Actual manufacturer power inputs and terminals differ. Card reads and programming are local simulations; network setup, vendor software, supervised resistors, current limits and emergency release circuits are outside this model.</p><div className="mt-3 flex flex-wrap gap-x-4 gap-y-2"><a href="https://www.cdvi.ca/PDF/ATRIUM_Flyer.pdf" target="_blank" rel="noreferrer" className={`inline-flex items-center gap-1 rounded text-teal-200 hover:underline ${focusStyle}`}>ATRIUM wiring reference<ChevronRight aria-hidden="true" className="h-3 w-3" /></a><a href="https://rbh-access.com/download/2999/" target="_blank" rel="noreferrer" className={`inline-flex items-center gap-1 rounded text-teal-200 hover:underline ${focusStyle}`}>UNC100 specification<ChevronRight aria-hidden="true" className="h-3 w-3" /></a></div></div>
      </section>

      <section id={`${id}-panel-events`} role="tabpanel" aria-labelledby={`${id}-tab-events`} hidden={tab !== 'events'} tabIndex={0} className={`rounded-lg ${focusStyle}`}>
        <div className="flex items-start justify-between gap-3"><div><h3 className="text-sm font-semibold text-white">Controller events</h3><p className="mt-1 text-xs leading-5 text-slate-400">Newest first · up to 40 recorded events</p></div><span className="rounded-lg border border-white/10 bg-white/[0.03] px-2 py-1 text-xs tabular-nums text-slate-400">{events.length}</span></div>
        {events.length === 0 ? <div className="mt-4 rounded-xl border border-dashed border-white/15 px-5 py-8 text-center"><History aria-hidden="true" className="mx-auto h-6 w-6 text-slate-600" /><p className="mt-3 text-sm font-medium text-slate-300">No events recorded</p><p className="mt-1 text-xs leading-5 text-slate-500">Events appear while the simulation is running.</p></div> : <ol className="mt-4 space-y-2.5">
          {[...events].reverse().map((entry, index) => {
            const date = new Date(entry.time);
            const validDate = Number.isFinite(date.getTime());
            const alarm = /forced|held|fault|denied|lost/i.test(entry.event);
            return <li key={`${entry.time}-${index}`} className={`rounded-xl border bg-[#0b151c] p-3.5 ${alarm ? 'border-amber-300/15' : 'border-white/[0.08]'}`}>
              <div className="flex items-center justify-between gap-2"><span className={`inline-flex items-center gap-1.5 text-[11px] font-semibold ${alarm ? 'text-amber-200/80' : 'text-teal-200'}`}>{alarm ? <ShieldAlert aria-hidden="true" className="h-3.5 w-3.5" /> : <Check aria-hidden="true" className="h-3.5 w-3.5" />}{entry.door ? `Door ${entry.door}` : 'Controller'}</span><time dateTime={validDate ? date.toISOString() : undefined} className="text-[10px] tabular-nums text-slate-500">{validDate ? `${date.toLocaleDateString([], { month: 'short', day: 'numeric' })} · ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}` : 'Time unavailable'}</time></div>
              <p className="mt-2 text-xs leading-5 text-slate-200">{entry.event}</p>
            </li>;
          })}
        </ol>}
      </section>
    </div>
  </aside>;
};
