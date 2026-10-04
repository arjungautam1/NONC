import React, { useState } from 'react';
import { ExternalLink, X, Zap } from 'lucide-react';
import { useGameStore } from '../../store/useGameStore';
import type { CircuitComponent } from '../../types/game';
import { CX12_EXAMPLES, type CX12ExampleId } from '../../customLab/cx12Examples';
import {
  CX12PLUS_MODES,
  getCX12PlusConfig,
  getCX12PlusMode,
  type CX12PlusConfig
} from './components/cx12plusPinout';

interface CX12PlusPanelProps {
  component: CircuitComponent;
  onClose: () => void;
  onLoadExample: (id: CX12ExampleId) => void;
}

type TimingKey = keyof Pick<CX12PlusConfig, 'dorRl1' | 'dooRl2' | 'dorRl2'>;

const CAMDEN_MANUAL_URL = 'https://www.camdencontrols.com/pipelines/resource/7480_9U272ACCBO88H70LML8O.pdf';

const MODE_HELP: Record<string, string> = {
  '1': 'Unlock first, wait, then pulse the door operator.',
  '2': 'A maintained access signal controls the lock; an inside request always unlocks and opens.',
  '3': 'A fire or presence input releases the lock and holds the operator while the input is active.',
  '4': 'Use momentary inputs to latch the operator, or ratchet both relays, on and off.',
  '5': 'Sequence two doors in either direction from momentary inputs.',
  '6': 'Sequence two doors in either direction while an input remains held.',
  '7': 'Barrier-free washroom control with the entrance normally unlocked.',
  '8': 'Barrier-free washroom control with the entrance normally locked.'
};

const PRESETS: Array<{
  label: string;
  detail: string;
  patch: CX12PlusConfig;
}> = [
  {
    label: 'Single door',
    detail: 'Unlock → operator',
    patch: { sw: [false, false, true], dorRl1: 3, dooRl2: 2, dorRl2: 2 }
  },
  {
    label: 'Access control',
    detail: 'Maintained unlock',
    patch: { sw: [true, false, true], dorRl1: 3, dooRl2: 2, dorRl2: 2 }
  },
  {
    label: 'Two-door vestibule',
    detail: 'Momentary sequence',
    patch: { sw: [false, false, false], dorRl1: 3, dooRl2: 3, dorRl2: 3 }
  },
  {
    label: 'Washroom',
    detail: 'Normally unlocked',
    patch: { sw: [false, true, false], dorRl1: 3, dooRl2: 2, dorRl2: 3 }
  }
];

const clampTime = (value: number) => Math.min(30, Math.max(1, Math.round(value)));

const TimingControl: React.FC<{
  label: string;
  boardLabel: string;
  hint: string;
  value: number;
  onChange: (value: number) => void;
}> = ({ label, boardLabel, hint, value, onChange }) => (
  <div className="rounded-lg border border-white/[0.08] bg-white/[0.025] p-2.5">
    <div className="flex items-start justify-between gap-2">
      <div className="min-w-0">
        <div className="text-[10px] font-bold text-slate-200">{label}</div>
        <div className="mt-0.5 text-[8px] leading-snug text-slate-500">{hint}</div>
      </div>
      <div className="shrink-0 text-right">
        <div className="text-sm font-mono font-black text-sky-200">{value}s</div>
        <div className="text-[7px] font-bold uppercase tracking-wider text-slate-600">{boardLabel}</div>
      </div>
    </div>
    <div className="mt-2 flex items-center gap-2">
      <button
        type="button"
        onClick={() => onChange(value - 1)}
        disabled={value <= 1}
        className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md border border-white/10 bg-slate-950 text-sm font-bold text-slate-300 transition hover:border-sky-300/40 hover:text-white disabled:cursor-not-allowed disabled:opacity-35"
        aria-label={`Decrease ${label.toLowerCase()}`}
      >
        −
      </button>
      <input
        type="range"
        min="1"
        max="30"
        step="1"
        value={value}
        onChange={event => onChange(Number(event.target.value))}
        className="h-1.5 min-w-0 flex-1 cursor-pointer accent-sky-400"
        aria-label={`${label}, 1 to 30 seconds`}
      />
      <button
        type="button"
        onClick={() => onChange(value + 1)}
        disabled={value >= 30}
        className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md border border-white/10 bg-slate-950 text-sm font-bold text-slate-300 transition hover:border-sky-300/40 hover:text-white disabled:cursor-not-allowed disabled:opacity-35"
        aria-label={`Increase ${label.toLowerCase()}`}
      >
        +
      </button>
    </div>
    <div className="mt-1 flex justify-between px-9 text-[7px] font-mono text-slate-600">
      <span>1s</span>
      <span>15s</span>
      <span>30s</span>
    </div>
  </div>
);

const LiveStatus: React.FC<{
  label: string;
  detail: string;
  active: boolean;
  tone: 'green' | 'amber' | 'sky';
}> = ({ label, detail, active, tone }) => {
  const activeClass = tone === 'green'
    ? 'border-emerald-300/20 bg-emerald-400/[0.07] text-emerald-300'
    : tone === 'amber'
      ? 'border-amber-300/20 bg-amber-400/[0.07] text-amber-300'
      : 'border-sky-300/20 bg-sky-400/[0.07] text-sky-300';

  return (
    <div className={`rounded-lg border px-2 py-2 ${active ? activeClass : 'border-white/[0.07] bg-white/[0.025] text-slate-500'}`}>
      <div className="flex items-center gap-1.5">
        <span className={`h-1.5 w-1.5 rounded-full ${active ? 'bg-current shadow-[0_0_7px_currentColor]' : 'bg-slate-700'}`} />
        <span className="text-[8px] font-black uppercase tracking-wider">{label}</span>
      </div>
      <div className="mt-1 truncate text-[9px] font-bold text-current">{active ? detail : 'OFF'}</div>
    </div>
  );
};

export const CX12PlusPanel: React.FC<CX12PlusPanelProps> = ({ component, onClose, onLoadExample }) => {
  const [exampleId, setExampleId] = useState<CX12ExampleId>(component.state.cx12ExampleId ?? 'standard');
  const example = CX12_EXAMPLES.find(item => item.id === exampleId)!;
  const configureCX12Plus = useGameStore(state => state.configureCX12Plus);
  const config = getCX12PlusConfig(component);
  const activeMode = getCX12PlusMode(config.sw);
  const boardPowered = Boolean(component.state.boardPowered);
  const relay1Active = Boolean(component.state.relay1Active);
  const relay2Active = Boolean(component.state.relay2Active);

  const update = (patch: Partial<CX12PlusConfig>) => configureCX12Plus(component.id, patch);

  const updateTiming = (key: TimingKey, value: number) => {
    update({ [key]: clampTime(value) } as Partial<CX12PlusConfig>);
  };

  const selectMode = (modeNumber: string) => {
    const mode = CX12PLUS_MODES.find(option => option.mode === modeNumber);
    if (mode) update({ sw: [...mode.sw] as [boolean, boolean, boolean] });
  };

  return (
    <aside
      className="pointer-events-auto absolute right-3 top-14 z-30 flex max-h-[calc(100%-4.5rem)] w-[min(390px,calc(100%-1.5rem))] flex-col overflow-hidden rounded-xl border border-sky-300/20 bg-[#080e17]/96 shadow-[0_24px_80px_rgba(0,0,0,0.58)] backdrop-blur-xl"
      aria-label="Camden CX-12 Plus configuration"
      onPointerDown={event => event.stopPropagation()}
      onClick={event => event.stopPropagation()}
    >
      <header className="flex items-start gap-3 border-b border-white/10 bg-gradient-to-r from-sky-500/10 to-transparent px-4 py-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-sky-300/20 bg-sky-400/10 text-[10px] font-black tracking-tight text-sky-300">
          CX-12+
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h2 className="truncate text-sm font-bold text-white">Camden CX-12 Plus</h2>
            <span className={`rounded-full px-1.5 py-0.5 text-[8px] font-black tracking-[0.12em] ${boardPowered ? 'bg-emerald-400/15 text-emerald-300' : 'bg-slate-700/60 text-slate-400'}`}>
              {boardPowered ? 'POWERED' : 'OFF'}
            </span>
          </div>
          <p className="mt-0.5 truncate text-[10px] text-slate-400">Mode {activeMode.mode} · {activeMode.label}</p>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="rounded-md p-1 text-slate-500 transition hover:bg-white/10 hover:text-white"
          aria-label="Close CX-12 Plus settings"
        >
          <X className="h-4 w-4" />
        </button>
      </header>

      <div className="overflow-y-auto p-3.5">
        <div className="grid grid-cols-3 gap-1.5" aria-label="Live CX-12 Plus status">
          <LiveStatus label="Power" detail="12/24V LIVE" active={boardPowered} tone="green" />
          <LiveStatus label="RL1 · Lock" detail="ENERGIZED" active={relay1Active} tone="amber" />
          <LiveStatus label="RL2 · Operator" detail="6–7 CLOSED" active={relay2Active} tone="sky" />
        </div>
        <section className="mt-3 rounded-lg border border-sky-300/20 bg-sky-400/[0.04] p-3">
          <h3 className="text-xs font-bold text-sky-200">Manual examples</h3>
          <select aria-label="CX-12 Plus wired example" value={exampleId}
            onChange={event => setExampleId(event.target.value as CX12ExampleId)}
            className="mt-2 h-10 w-full rounded-lg border border-white/10 bg-slate-950 px-2 text-xs text-slate-200">
            {CX12_EXAMPLES.map(item => <option key={item.id} value={item.id}>{item.title}</option>)}
          </select>
          <p className="mt-2 text-xs leading-relaxed text-slate-300">{example.steps}</p>
          <div className="mt-2 flex items-center justify-between gap-2">
            <span className="text-[10px] text-slate-500">Manual p. {example.page} · Mode {example.mode}</span>
            <button type="button" onClick={() => onLoadExample(exampleId)}
              className="rounded-lg border border-sky-300/30 bg-sky-400/10 px-3 py-2 text-xs font-bold text-sky-200">Load wired example</button>
          </div>
          <p className="mt-2 text-[10px] text-slate-500">Replaces this bench. Undo restores it. Switch power on to test.</p>
        </section>
        {(activeMode.mode === '7' || activeMode.mode === '8') && <div className="mt-2 text-xs font-bold text-emerald-300">
          {component.state.occupied ? 'Occupied · outside disabled' : 'Available'}
        </div>}

        <section className="mt-3 rounded-lg border border-sky-300/15 bg-sky-400/[0.04] p-2.5">
          <div className="flex items-center justify-between gap-2">
            <h3 className="text-[9px] font-black uppercase tracking-[0.16em] text-sky-200">Quick setup</h3>
            <span className="text-[8px] text-slate-500">Sets mode + useful starting times</span>
          </div>
          <div className="mt-2 grid grid-cols-2 gap-1.5">
            {PRESETS.map(preset => {
              const selected = activeMode.mode === getCX12PlusMode(preset.patch.sw).mode
                && config.dorRl1 === preset.patch.dorRl1
                && config.dooRl2 === preset.patch.dooRl2
                && config.dorRl2 === preset.patch.dorRl2;
              return (
                <button
                  key={preset.label}
                  type="button"
                  aria-pressed={selected}
                  disabled={boardPowered}
                  onClick={() => update({ ...preset.patch, sw: [...preset.patch.sw] as [boolean, boolean, boolean] })}
                  className={`rounded-lg border px-2 py-2 text-left transition disabled:cursor-not-allowed disabled:opacity-45 ${selected ? 'border-sky-300/35 bg-sky-400/10 text-white' : 'border-white/[0.08] bg-slate-950/45 text-slate-300 hover:border-sky-300/30 hover:bg-sky-400/[0.07]'}`}
                >
                  <span className="block text-[9px] font-bold">{preset.label}</span>
                  <span className="mt-0.5 block text-[8px] text-slate-500">{preset.detail}</span>
                </button>
              );
            })}
          </div>
        </section>

        <section className="mt-3">
          <div className="mb-1.5 flex items-center justify-between">
            <h3 className="text-[9px] font-black uppercase tracking-[0.16em] text-slate-400">Operating mode</h3>
            <span className="text-[8px] text-slate-600">All 8 modes</span>
          </div>
          <select
            value={activeMode.mode}
            disabled={boardPowered}
            onChange={event => selectMode(event.target.value)}
            className="h-9 w-full rounded-lg border border-white/10 bg-slate-950/80 px-2.5 text-[10px] font-semibold text-slate-200 outline-none transition focus:border-sky-300/50 disabled:cursor-not-allowed disabled:opacity-45"
            aria-label="CX-12 Plus operating mode"
          >
            {CX12PLUS_MODES.map(mode => (
              <option key={mode.mode} value={mode.mode}>Mode {mode.mode} — {mode.label}</option>
            ))}
          </select>
          <p className="mt-1.5 text-[9px] leading-relaxed text-slate-500">{MODE_HELP[activeMode.mode]}</p>
          {boardPowered && (
            <p className="mt-1.5 rounded-md border border-amber-300/15 bg-amber-300/[0.05] px-2 py-1.5 text-[8px] leading-relaxed text-amber-100/70">
              Turn board power off before changing the DIP mode. Timing controls remain available for setup.
            </p>
          )}

          <div className="mt-2 flex items-center gap-2 rounded-lg border border-white/[0.08] bg-white/[0.025] px-2.5 py-2">
            <span className="text-[8px] font-black uppercase tracking-wider text-slate-500">DIP</span>
            <div className="flex flex-1 justify-center gap-1.5">
              {config.sw.map((on, index) => (
                <div key={index} className="flex items-center gap-1 rounded-md border border-white/[0.08] bg-slate-950/70 px-2 py-1">
                  <span className="text-[8px] font-bold text-slate-500">SW{index + 1}</span>
                  <span className={`text-[8px] font-black ${on ? 'text-emerald-300' : 'text-slate-400'}`}>{on ? 'ON' : 'OFF'}</span>
                </div>
              ))}
            </div>
            <span className="text-[8px] font-mono text-slate-600">{config.sw.map(on => on ? '1' : '0').join('')}</span>
          </div>
        </section>

        <section className="mt-3">
          <div className="mb-1.5 flex items-end justify-between gap-3">
            <div>
              <h3 className="text-[9px] font-black uppercase tracking-[0.16em] text-slate-400">Door timing</h3>
              <p className="mt-0.5 text-[8px] text-slate-600">Adjust each control from 1–30 seconds.</p>
            </div>
            <span className="shrink-0 text-[8px] font-mono text-sky-300">{config.dorRl1}s → {config.dooRl2}s → {config.dorRl2}s</span>
          </div>
          <div className="space-y-1.5">
            <TimingControl
              label="Lock time"
              boardLabel="D.O.R. RL1"
              hint="How long Relay 1 releases or powers the lock."
              value={config.dorRl1}
              onChange={value => updateTiming('dorRl1', value)}
            />
            <TimingControl
              label="Wait before operator"
              boardLabel="D.O.O. RL2"
              hint="Pause after the lock starts, before Relay 2 closes."
              value={config.dooRl2}
              onChange={value => updateTiming('dooRl2', value)}
            />
            <TimingControl
              label="Operator time"
              boardLabel="D.O.R. RL2"
              hint="How long Relay 2 holds the operator activation input."
              value={config.dorRl2}
              onChange={value => updateTiming('dorRl2', value)}
            />
          </div>
        </section>

        <section className="mt-3 rounded-lg border border-emerald-300/15 bg-emerald-400/[0.035] p-2.5">
          <div className="flex items-center gap-1.5">
            <Zap className="h-3 w-3 text-emerald-300" />
            <h3 className="text-[9px] font-black uppercase tracking-[0.16em] text-emerald-200">Essential wiring</h3>
          </div>

          <div className="mt-2 space-y-2 text-xs text-slate-300">
            <p><strong className="text-white">Power · 1–2:</strong> Continuous 12/24V AC/DC. Buttons trigger inputs, not board power.</p>
            <p><strong className="text-white">Relay 1 · 3 NO / 4 COM / 5 NC:</strong> {(activeMode.mode === '5' || activeMode.mode === '6') ? 'Door 1 dry activation on 3–4.' : 'Lock output. Use 3–4 for a standard fail-secure strike, or 4–5 for a maglock. Normally unlocked washroom examples use a fail-safe strike on 3–4.'}</p>
            <p><strong className="text-white">Relay 2 · 6 NO / 7 COM / 8 NC:</strong> Door operator ACT–COM across 6–7. This output is a dry contact.</p>
            {(activeMode.mode === '7' || activeMode.mode === '8') ? <>
              <p><strong className="text-white">WET1 · 9–10:</strong> {activeMode.mode === '8' ? 'Powered access-granted input.' : 'Powered outside wall switch.'}</p>
              <p><strong className="text-white">DRY1 · 11–12:</strong> Push-to-lock momentary contact.</p>
              <p><strong className="text-white">WET2 · 13–14:</strong> Powered inside wall switch.</p>
              <p><strong className="text-white">DRY2 · 15–16:</strong> Door contact circuit closed with the door shut. For NASCOM use COM–NO (closed with magnet present).</p>
            </> : activeMode.mode === '1' || activeMode.mode === '2' ? <>
              <p><strong className="text-white">DRY1 · 11–12 / WET2 · 13–14:</strong> Inside unlock-and-open request.</p>
              <p><strong className="text-white">WET1 · 9–10:</strong> {activeMode.mode === '1' ? 'Interphone: timed lock release only.' : 'Maintained access signal: holds lock released.'}</p>
              <p><strong className="text-white">DRY2 · 15–16:</strong> Outside/courtesy contact. Opens only while Relay 1 is active.</p>
            </> : activeMode.mode === '3' ? <>
              <p><strong className="text-white">WET2 · 13–14 / DRY1 · 11–12:</strong> Maintained fire-panel signal / presence contact.</p>
              <p>Relay 1 pulses; Relay 2 follows after the delay and remains active until the request clears.</p>
            </> : <>
              <p><strong className="text-white">Input 1 · WET1 9–10 / DRY1 11–12:</strong> {activeMode.mode === '4' ? 'Latch Relay 2; press again to release it.' : 'Sequence Door 1 → Door 2.'}</p>
              <p><strong className="text-white">Input 2 · WET2 13–14 / DRY2 15–16:</strong> {activeMode.mode === '4' ? 'Ratchet both relays; press again to release both.' : 'Sequence Door 2 → Door 1.'}</p>
            </>}
            <p className="text-slate-500">Dry inputs need voltage-free contact closure. Wet inputs need 3–30V AC/DC across the pair.</p>
          </div>

          <p className="mt-2 rounded-md border border-amber-300/15 bg-amber-300/[0.05] px-2 py-1.5 text-[8px] leading-relaxed text-amber-100/70">
            Input assignments vary by mode. Wire safety devices directly to the operator control box.
          </p>
        </section>

        <footer className="mt-3 flex items-center justify-between border-t border-white/[0.07] pt-2.5 text-[8px] text-slate-600">
          <span>2 Form C outputs · 3A @ 30VDC</span>
          <a
            href={CAMDEN_MANUAL_URL}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1 text-sky-400 transition hover:text-sky-300"
          >
            Official manual <ExternalLink className="h-2.5 w-2.5" />
          </a>
        </footer>
      </div>
    </aside>
  );
};

export default CX12PlusPanel;
