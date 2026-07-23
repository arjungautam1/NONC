import React from 'react';
import {
  Check,
  ChevronLeft,
  ChevronRight,
  CircleDot,
  Cpu,
  Lightbulb,
  MousePointerClick,
  Plus,
  RotateCcw,
  Search,
  ShieldCheck,
  Trash2,
  Wrench,
  Zap
} from 'lucide-react';
import { useGameStore } from '../../store/useGameStore';
import type { CircuitComponent, ComponentType } from '../../types/game';
import {
  customLabCategories,
  customLabOptions,
  MAX_CUSTOM_COMPONENTS,
  type CustomLabCategory
} from '../../customLab/componentCatalog';
import { ComponentRenderer } from './components/ComponentRenderer';

const thumbnailViewBoxes: Partial<Record<ComponentType, string>> = {
  pull_station: '-82 -112 164 214',
  key_switch: '-78 -86 156 172',
  relay_dpdt: '-72 -92 144 184',
  timer_relay: '-72 -72 144 144',
  power_supply: '-88 -66 176 132',
  transformer: '-58 -78 116 156',
  maglock: '-102 -58 204 116',
  led_strip: '-76 -52 152 104',
  sliding_gate: '-148 -86 296 172'
};

const LibraryThumbnail: React.FC<{
  component: CircuitComponent;
  selected?: boolean;
}> = ({ component, selected = false }) => (
  <div className={`relative flex h-12 w-14 shrink-0 items-center justify-center overflow-hidden rounded-lg border transition ${
    selected
      ? 'border-blue-400/25 bg-blue-400/[0.08] shadow-[inset_0_0_18px_rgba(59,130,246,0.08)]'
      : 'border-white/[0.07] bg-[#0a101c] group-hover:border-white/[0.13]'
  }`}>
    <svg
      viewBox={thumbnailViewBoxes[component.type] ?? '-76 -72 152 144'}
      preserveAspectRatio="xMidYMid meet"
      aria-hidden="true"
      className="h-[44px] w-[52px] overflow-visible pointer-events-none"
    >
      <ComponentRenderer
        component={{ ...component, x: 0, y: 0, state: { ...component.state, active: false, energized: false } }}
        isEnergized={false}
      />
    </svg>
    <span className="pointer-events-none absolute inset-x-2 bottom-0 h-px bg-gradient-to-r from-transparent via-blue-400/35 to-transparent" />
  </div>
);

const categoryMeta: Record<CustomLabCategory, {
  icon: typeof MousePointerClick;
  iconClass: string;
  panelClass: string;
}> = {
  input: {
    icon: MousePointerClick,
    iconClass: 'text-sky-300',
    panelClass: 'border-sky-400/10 bg-sky-400/[0.025]'
  },
  control: {
    icon: Cpu,
    iconClass: 'text-violet-300',
    panelClass: 'border-violet-400/10 bg-violet-400/[0.025]'
  },
  output: {
    icon: Lightbulb,
    iconClass: 'text-amber-300',
    panelClass: 'border-amber-400/10 bg-amber-400/[0.025]'
  }
};

export const CustomLabSidebar: React.FC = () => {
  const {
    components,
    customLabSelection,
    isRunning,
    simulation,
    wires,
    sidebarOpen,
    toggleSidebar,
    toggleSimulation,
    resetLevel,
    addCustomLabComponent,
    removeCustomLabComponent
  } = useGameStore();
  const [searchQuery, setSearchQuery] = React.useState('');

  const selectedIds = React.useMemo(() => new Set(customLabSelection), [customLabSelection]);
  const normalizedQuery = searchQuery.trim().toLowerCase();
  const atCapacity = customLabSelection.length >= MAX_CUSTOM_COMPONENTS;
  const energizedLabels = components
    .filter(component => simulation.energizedComponents.has(component.id))
    .map(component => component.label);
  const fixedPowerSources = components.filter(component =>
    component.id === 'custom_transformer' || component.id === 'custom_psu'
  );

  return (
    <div className={`relative flex shrink-0 transition-all duration-300 ease-in-out ${
      sidebarOpen
        ? 'h-[380px] max-h-[48vh] w-full md:h-full md:max-h-none md:w-[340px]'
        : 'h-10 w-full md:h-full md:w-[28px]'
    }`}>
      {!sidebarOpen && (
        <button
          type="button"
          onClick={toggleSidebar}
          title="Open component library"
          className="group flex h-10 w-full shrink-0 items-center justify-center gap-2 border-b border-white/10 bg-[#080d19] transition hover:bg-white/[0.04] md:h-full md:w-[28px] md:flex-col md:border-b-0 md:border-r"
        >
          <span className="h-1 w-10 rounded-full bg-blue-500/50 shadow-[0_0_8px_rgba(59,130,246,0.45)] transition group-hover:bg-blue-300 md:h-10 md:w-1" />
          <ChevronRight className="h-3.5 w-3.5 text-slate-500 transition group-hover:text-white" />
          <span className="text-[9px] font-black tracking-[0.18em] text-slate-500 transition group-hover:text-white md:[writing-mode:vertical-rl]">COMPONENTS</span>
        </button>
      )}

      {sidebarOpen && (
        <aside className="flex h-full w-full shrink-0 flex-col overflow-hidden border-b border-white/10 bg-[#070b13] md:w-[340px] md:border-b-0 md:border-r">
          <div className="shrink-0 border-b border-white/10 bg-white/[0.015] p-3">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="flex items-center gap-1.5 text-blue-300">
                  <Wrench className="h-3.5 w-3.5" />
                  <span className="text-[9px] font-bold uppercase tracking-[0.16em]">Custom wiring lab</span>
                </div>
                <h2 className="mt-1.5 text-sm font-semibold text-white">Component library</h2>
                <p className="mt-1 text-[10px] text-slate-500">
                  Add devices directly to the canvas · {customLabSelection.length}/{MAX_CUSTOM_COMPONENTS} placed
                </p>
              </div>
              <button
                type="button"
                onClick={toggleSidebar}
                title="Collapse component library"
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-white/[0.07] bg-white/[0.025] text-slate-500 transition hover:bg-white/[0.08] hover:text-white"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-3 grid grid-cols-[1fr_auto] gap-2">
              <button
                type="button"
                onClick={toggleSimulation}
                className={`flex min-h-10 items-center justify-center gap-2 rounded-lg border text-[11px] font-bold uppercase tracking-wide transition ${
                  isRunning
                    ? 'border-emerald-400/30 bg-emerald-400/10 text-emerald-300'
                    : 'border-white/10 bg-white/[0.025] text-slate-400 hover:bg-white/[0.06] hover:text-white'
                }`}
              >
                <span className={`h-2 w-2 rounded-full ${isRunning ? 'bg-emerald-400 shadow-[0_0_8px_#34d399]' : 'bg-slate-600'}`} />
                Power {isRunning ? 'ON' : 'OFF'}
              </button>
              <button
                type="button"
                onClick={resetLevel}
                title="Reset custom circuit"
                className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 bg-white/[0.025] text-slate-500 transition hover:border-red-400/20 hover:bg-red-400/[0.06] hover:text-red-300"
              >
                <RotateCcw className="h-4 w-4" />
              </button>
            </div>

            <label className="relative mt-2.5 block">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-600" />
              <input
                type="search"
                value={searchQuery}
                onChange={event => setSearchQuery(event.target.value)}
                placeholder="Search components"
                aria-label="Search components"
                className="h-9 w-full rounded-lg border border-white/[0.08] bg-black/20 pl-9 pr-3 text-[11px] text-slate-200 outline-none transition placeholder:text-slate-600 focus:border-blue-400/35 focus:bg-blue-400/[0.035]"
              />
            </label>
          </div>

          <div className="flex-1 overflow-y-auto p-3 custom-scrollbar">
            <div className={`mb-3 rounded-xl border p-2.5 ${
              simulation.shortCircuit
                ? 'border-red-400/25 bg-red-400/[0.07]'
                : isRunning
                  ? 'border-emerald-400/18 bg-emerald-400/[0.045]'
                  : 'border-white/[0.06] bg-white/[0.02]'
            }`}>
              <div className="flex items-center gap-2">
                <CircleDot className={`h-3.5 w-3.5 ${simulation.shortCircuit ? 'text-red-300' : isRunning ? 'text-emerald-300' : 'text-slate-600'}`} />
                <p className={`min-w-0 flex-1 truncate text-[10px] font-semibold ${
                  simulation.shortCircuit ? 'text-red-300' : isRunning ? 'text-emerald-300' : 'text-slate-500'
                }`}>
                  {simulation.shortCircuit
                    ? 'Short circuit detected'
                    : isRunning
                      ? `${energizedLabels.length} component${energizedLabels.length === 1 ? '' : 's'} energized`
                      : 'Ready to build and test'}
                </p>
                <span className="font-mono text-[9px] text-slate-600">{wires.length} wires</span>
              </div>
            </div>

            {!normalizedQuery && (
              <section className="mb-3 rounded-xl border border-blue-400/10 bg-blue-400/[0.025] p-2.5">
                <div className="mb-2 flex items-center gap-2">
                  <Zap className="h-3.5 w-3.5 text-blue-300" />
                  <div className="min-w-0 flex-1">
                    <h3 className="text-[10px] font-bold text-slate-300">Power sources</h3>
                    <p className="text-[8.5px] text-slate-600">Fixed starting equipment</p>
                  </div>
                  <span className="rounded-full border border-blue-400/15 bg-blue-400/[0.06] px-2 py-0.5 text-[8px] font-bold uppercase tracking-wide text-blue-300">Included</span>
                </div>
                <div className="space-y-1.5">
                  {fixedPowerSources.map(component => (
                    <div key={component.id} className="group flex min-w-0 items-center gap-2 rounded-lg border border-white/[0.05] bg-black/15 p-1.5">
                      <LibraryThumbnail component={component} />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-[9.5px] font-semibold text-slate-300">
                          {component.id === 'custom_psu' ? 'Altronix power supply' : component.label}
                        </p>
                        <p className="mt-0.5 truncate text-[8px] uppercase tracking-wide text-slate-600">
                          {component.type === 'transformer' ? 'AC/AC source' : 'AC input · DC output'}
                        </p>
                      </div>
                      <Check className="mr-1 h-3.5 w-3.5 shrink-0 text-emerald-400" />
                    </div>
                  ))}
                </div>
              </section>
            )}

            <div className="space-y-3">
              {customLabCategories.map(category => {
                const options = customLabOptions.filter(option => {
                  if (option.category !== category.id) return false;
                  if (!normalizedQuery) return true;
                  return [option.name, option.description, option.terminalSummary]
                    .some(value => value.toLowerCase().includes(normalizedQuery));
                });
                if (options.length === 0) return null;

                const meta = categoryMeta[category.id];
                const Icon = meta.icon;

                return (
                  <section key={category.id} className={`rounded-xl border p-2.5 ${meta.panelClass}`}>
                    <div className="mb-2.5 flex items-start gap-2">
                      <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md border border-white/[0.06] bg-black/20">
                        <Icon className={`h-3.5 w-3.5 ${meta.iconClass}`} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-2">
                          <h3 className="text-[10px] font-bold text-slate-300">{category.label}</h3>
                          <span className="font-mono text-[8px] text-slate-600">{options.length}</span>
                        </div>
                        <p className="mt-0.5 line-clamp-2 text-[8.5px] leading-3.5 text-slate-600">{category.description}</p>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      {options.map(option => {
                        const selected = selectedIds.has(option.id);
                        const disabled = !selected && atCapacity;

                        return (
                          <div
                            key={option.id}
                            className={`group flex min-h-[60px] items-center gap-2 rounded-lg border p-1.5 transition ${
                              selected
                                ? 'border-blue-400/20 bg-blue-400/[0.07]'
                                : 'border-white/[0.05] bg-black/15 hover:border-white/10 hover:bg-white/[0.035]'
                            }`}
                          >
                            <LibraryThumbnail
                              selected={selected}
                              component={{
                                id: `library_${option.id}`,
                                type: option.template.type,
                                x: 0,
                                y: 0,
                                label: option.template.label,
                                terminals: option.template.terminals,
                                state: option.template.state
                              }}
                            />
                            <div className="min-w-0 flex-1">
                              <p className={`truncate text-[9.5px] font-semibold ${selected ? 'text-blue-200' : 'text-slate-400'}`}>{option.name}</p>
                              <p className="mt-0.5 truncate text-[8px] uppercase tracking-wide text-slate-600">{option.terminalSummary}</p>
                            </div>
                            <button
                              type="button"
                              onClick={() => selected ? removeCustomLabComponent(option.id) : addCustomLabComponent(option.id)}
                              disabled={disabled}
                              aria-label={`${selected ? 'Remove' : 'Add'} ${option.name}`}
                              title={selected ? 'Remove component and its connected wires' : disabled ? `Maximum ${MAX_CUSTOM_COMPONENTS} devices` : 'Add component to canvas'}
                              className={`flex h-7 shrink-0 items-center justify-center gap-1 rounded-md border px-2 text-[8.5px] font-bold transition ${
                                selected
                                  ? 'border-red-400/15 bg-red-400/[0.04] text-slate-500 hover:border-red-400/25 hover:bg-red-400/[0.09] hover:text-red-300'
                                  : 'border-blue-400/18 bg-blue-400/[0.07] text-blue-300 hover:bg-blue-400/[0.14] disabled:cursor-not-allowed disabled:border-white/[0.05] disabled:bg-white/[0.02] disabled:text-slate-700'
                              }`}
                            >
                              {selected ? <Trash2 className="h-3 w-3" /> : <Plus className="h-3 w-3" />}
                              {selected ? 'Remove' : 'Add'}
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </section>
                );
              })}
            </div>

            {normalizedQuery && customLabOptions.every(option =>
              ![option.name, option.description, option.terminalSummary]
                .some(value => value.toLowerCase().includes(normalizedQuery))
            ) && (
              <div className="rounded-xl border border-dashed border-white/10 px-4 py-8 text-center">
                <Search className="mx-auto h-5 w-5 text-slate-700" />
                <p className="mt-2 text-[10px] font-medium text-slate-500">No matching components</p>
              </div>
            )}
          </div>

          <div className="shrink-0 border-t border-white/[0.07] bg-black/10 px-3 py-2.5">
            <div className="flex items-center gap-2 text-[9px] leading-4 text-slate-600">
              <ShieldCheck className="h-3.5 w-3.5 shrink-0 text-blue-400" />
              Your free-build circuit does not change training progress.
            </div>
          </div>
        </aside>
      )}
    </div>
  );
};

export default CustomLabSidebar;
