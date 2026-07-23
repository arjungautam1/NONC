import React from 'react';
import { AlertTriangle, ExternalLink, Power, X, Zap } from 'lucide-react';
import type { CircuitComponent } from '../../types/game';
import { useGameStore } from '../../store/useGameStore';
import {
  formatTimer6062Setting,
  getTimer6062Config,
  getTimer6062ModeLabel,
  getTimer6062PhaseLabel,
  isTimer6062RelayActive,
  timer6062HasResetConflict,
  type Timer6062Config
} from '../../simulation/timer6062';

interface Timer6062PanelProps {
  component: CircuitComponent;
  onClose: () => void;
}

const DIP_ROWS: Array<{
  key: keyof Pick<Timer6062Config, 'dip1RelayAtEnd' | 'dip2Seconds' | 'dip3TwelveVolt' | 'dip4TriggerRemoval'>;
  number: number;
  label: string;
  off: string;
  on: string;
}> = [
  { key: 'dip1RelayAtEnd', number: 1, label: 'Relay control', off: 'At cycle start', on: 'At cycle end' },
  { key: 'dip2Seconds', number: 2, label: 'Time range', off: '1-60 minutes', on: '1-60 seconds' },
  { key: 'dip3TwelveVolt', number: 3, label: 'Operating voltage', off: '24VDC', on: '12VDC' },
  { key: 'dip4TriggerRemoval', number: 4, label: 'Trigger control', off: 'Start on input', on: 'Start on removal' }
];

const Toggle: React.FC<{
  active: boolean;
  disabled: boolean;
  onClick: () => void;
  label: string;
}> = ({ active, disabled, onClick, label }) => (
  <button
    type="button"
    role="switch"
    aria-checked={active}
    aria-label={label}
    disabled={disabled}
    onClick={onClick}
    className={`relative h-5 w-10 shrink-0 rounded-sm border transition ${
      active
        ? 'border-sky-300/60 bg-sky-500/30'
        : 'border-slate-600 bg-slate-900'
    } ${disabled ? 'cursor-not-allowed opacity-45' : 'cursor-pointer hover:border-sky-300'}`}
  >
    <span className="absolute left-1 top-1/2 -translate-y-1/2 text-[6px] font-black text-sky-100">ON</span>
    <span className="absolute right-0.5 top-1/2 -translate-y-1/2 text-[6px] font-black text-slate-500">OFF</span>
    <span
      className={`absolute top-[2px] h-[14px] w-[14px] rounded-[2px] bg-white shadow transition-transform ${
        active ? 'translate-x-[3px]' : 'translate-x-[21px]'
      }`}
    />
  </button>
);

export const Timer6062Panel: React.FC<Timer6062PanelProps> = ({ component, onClose }) => {
  const isRunning = useGameStore(state => state.isRunning);
  const configureTimerRelay = useGameStore(state => state.configureTimerRelay);
  const config = getTimer6062Config(component);
  const relayActive = isTimer6062RelayActive(component);
  const phase = getTimer6062PhaseLabel(component.state.timerPhase);
  const resetConflict = timer6062HasResetConflict(config);
  const pulseConflict = config.j2Cut && !config.dip1RelayAtEnd;

  const update = (patch: Partial<Timer6062Config>) => configureTimerRelay(component.id, patch);

  return (
    <aside
      className="absolute right-3 top-14 z-30 flex max-h-[calc(100%-4.5rem)] w-[min(370px,calc(100%-1.5rem))] flex-col overflow-hidden rounded-xl border border-sky-300/20 bg-[#080e17]/96 shadow-[0_24px_80px_rgba(0,0,0,0.58)] backdrop-blur-xl pointer-events-auto"
      aria-label="Altronix 6062 timer configuration"
      onPointerDown={event => event.stopPropagation()}
      onClick={event => event.stopPropagation()}
    >
      <header className="flex items-start gap-3 border-b border-white/10 bg-gradient-to-r from-sky-500/10 to-transparent px-4 py-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-sky-300/20 bg-sky-400/10 text-sky-300">
          <span className="text-[11px] font-black tracking-tight">6062</span>
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h2 className="truncate text-sm font-bold text-white">Altronix 6062</h2>
            <span className={`rounded-full px-1.5 py-0.5 text-[8px] font-black tracking-[0.12em] ${
              relayActive ? 'bg-red-400/15 text-red-300' : component.state.boardPowered ? 'bg-emerald-400/15 text-emerald-300' : 'bg-slate-700/60 text-slate-400'
            }`}>
              {phase}
            </span>
          </div>
          <p className="mt-0.5 truncate text-[10px] text-slate-400">{getTimer6062ModeLabel(config)} · {formatTimer6062Setting(config)}</p>
        </div>
        <button type="button" onClick={onClose} className="rounded-md p-1 text-slate-500 hover:bg-white/10 hover:text-white" aria-label="Close timer settings">
          <X className="h-4 w-4" />
        </button>
      </header>

      <div className="overflow-y-auto p-3.5">
        <div className="grid grid-cols-3 gap-1.5">
          <div className="rounded-lg border border-white/[0.07] bg-white/[0.025] px-2 py-2">
            <div className="flex items-center gap-1 text-[8px] font-bold uppercase tracking-wider text-slate-500"><Power className="h-3 w-3" /> Input</div>
            <div className={`mt-1 text-xs font-mono font-bold ${component.state.voltageValid ? 'text-emerald-300' : 'text-slate-400'}`}>
              {Number(component.state.inputVoltage || 0).toFixed(0)}V
            </div>
          </div>
          <div className="rounded-lg border border-white/[0.07] bg-white/[0.025] px-2 py-2">
            <div className="flex items-center gap-1 text-[8px] font-bold uppercase tracking-wider text-slate-500"><Zap className="h-3 w-3" /> TRG</div>
            <div className={`mt-1 text-xs font-bold ${component.state.triggerActive ? 'text-amber-300' : 'text-slate-500'}`}>
              {component.state.triggerActive ? 'ACTIVE' : 'OPEN'}
            </div>
          </div>
          <div className="rounded-lg border border-white/[0.07] bg-white/[0.025] px-2 py-2">
            <div className="text-[8px] font-bold uppercase tracking-wider text-slate-500">Contacts</div>
            <div className={`mt-1 text-xs font-bold ${relayActive ? 'text-red-300' : 'text-sky-300'}`}>
              {relayActive ? 'C-NO' : 'C-NC'}
            </div>
          </div>
        </div>

        {isRunning && (
          <div className="mt-2.5 rounded-lg border border-amber-300/15 bg-amber-300/[0.06] px-2.5 py-2 text-[9px] leading-relaxed text-amber-100/75">
            Turn System Power OFF to change the physical DIP switches, jumpers, or trimpot.
          </div>
        )}

        {(component.state.timerPhase === 'voltage-mismatch' || resetConflict || pulseConflict) && (
          <div className="mt-2.5 flex gap-2 rounded-lg border border-red-400/20 bg-red-400/[0.07] px-2.5 py-2 text-[9px] leading-relaxed text-red-200">
            <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
            <span>
              {component.state.timerPhase === 'voltage-mismatch'
                ? `DIP 3 is set for ${config.dip3TwelveVolt ? '12VDC' : '24VDC'}, but the wired supply does not match.`
                : pulseConflict
                  ? 'J2 delayed pulse requires DIP 1 ON (relay at end of cycle).'
                  : 'The manual states closed-trigger (DIP 4 ON) and delayed-pulse (J2 cut) options do not operate when J3 reset is cut.'}
            </span>
          </div>
        )}

        <section className="mt-3">
          <div className="mb-1.5 flex items-center justify-between">
            <h3 className="text-[9px] font-black uppercase tracking-[0.16em] text-slate-400">DIP switch selection</h3>
            <span className="text-[8px] text-slate-600">Official table</span>
          </div>
          <div className="overflow-hidden rounded-lg border border-white/[0.08]">
            {DIP_ROWS.map((row, index) => {
              const active = Boolean(config[row.key]);
              return (
                <div key={row.key} className={`grid grid-cols-[24px_1fr_auto] items-center gap-2 bg-white/[0.02] px-2 py-2 ${index ? 'border-t border-white/[0.07]' : ''}`}>
                  <span className="flex h-5 w-5 items-center justify-center rounded bg-sky-500/10 text-[9px] font-black text-sky-300">{row.number}</span>
                  <div className="min-w-0">
                    <div className="text-[9px] font-semibold text-slate-300">{row.label}</div>
                    <div className="truncate text-[8px] text-slate-500">{active ? `ON · ${row.on}` : `OFF · ${row.off}`}</div>
                  </div>
                  <Toggle
                    active={active}
                    disabled={isRunning}
                    label={`DIP ${row.number}: ${row.label}`}
                    onClick={() => update({ [row.key]: !active })}
                  />
                </div>
              );
            })}
          </div>
        </section>

        <section className="mt-3">
          <h3 className="mb-1.5 text-[9px] font-black uppercase tracking-[0.16em] text-slate-400">Jumper selection</h3>
          <div className="grid grid-cols-3 gap-1.5">
            {([
              ['j1Cut', 'J1', 'Repeat'],
              ['j2Cut', 'J2', '1s pulse'],
              ['j3Cut', 'J3', 'Reset']
            ] as const).map(([key, number, label]) => {
              const cut = config[key];
              return (
                <button
                  key={key}
                  type="button"
                  disabled={isRunning}
                  onClick={() => update({ [key]: !cut })}
                  className={`rounded-lg border px-2 py-2 text-left transition ${
                    cut
                      ? 'border-orange-300/30 bg-orange-400/10 text-orange-200'
                      : 'border-white/[0.08] bg-white/[0.025] text-slate-300'
                  } ${isRunning ? 'cursor-not-allowed opacity-45' : 'hover:border-sky-300/40'}`}
                >
                  <div className="flex items-center justify-between text-[9px] font-black"><span>{number}</span><span className={cut ? 'text-orange-300' : 'text-emerald-400'}>{cut ? 'CUT' : 'INTACT'}</span></div>
                  <div className="mt-1 text-[8px] text-slate-500">{label}</div>
                </button>
              );
            })}
          </div>
        </section>

        <section className="mt-3 rounded-lg border border-white/[0.08] bg-white/[0.02] p-2.5">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-[9px] font-black uppercase tracking-[0.16em] text-slate-400">Time trimpot</h3>
              <p className="mt-0.5 text-[8px] text-slate-600">1-60 on the DIP 2 selected range</p>
            </div>
            <span className="rounded-md bg-sky-400/10 px-2 py-1 text-xs font-mono font-bold text-sky-300">{config.adjustment}</span>
          </div>
          <input
            type="range"
            min="1"
            max="60"
            step="1"
            value={config.adjustment}
            disabled={isRunning}
            onChange={event => update({ adjustment: Number(event.target.value) })}
            className="mt-2 h-1.5 w-full cursor-pointer accent-sky-400 disabled:cursor-not-allowed disabled:opacity-45"
            aria-label="6062 trimpot time setting"
          />
          <div className="mt-1 flex justify-between text-[7px] font-mono text-slate-600"><span>1</span><span>15</span><span>30</span><span>45</span><span>60</span></div>
        </section>

        <footer className="mt-3 flex items-center justify-between border-t border-white/[0.07] pt-2.5 text-[8px] text-slate-600">
          <span>8A @ 120VAC / 28VDC · 3mA standby</span>
          <a
            href="https://www.altronix.com/library/pdf/installation_instructions/6062.pdf"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1 text-sky-400 hover:text-sky-300"
          >
            Manual <ExternalLink className="h-2.5 w-2.5" />
          </a>
        </footer>
      </div>
    </aside>
  );
};

export default Timer6062Panel;
