import React from 'react';
import {
  ChevronLeft,
  ChevronRight,
  CircleDot,
  Cpu,
  Lightbulb,
  MousePointerClick,
  Plus,
  GripVertical,
  LocateFixed,
  PackageOpen,
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
  getCustomLabOptionId,
  MAX_CUSTOM_COMPONENTS,
  type CustomLabCategory
} from '../../customLab/componentCatalog';
import { ComponentRenderer } from './components/ComponentRenderer';

const thumbnailViewBoxes: Partial<Record<ComponentType, string>> = {
  pull_station: '-78 -84 156 212',
  key_switch: '-78 -86 156 172',
  relay: '-60 -60 120 120',
  relay_dpdt: '-76 -80 152 184',
  relay_rb1224: '-72 -76 144 172',
  relay_rbsnttl: '-82 -76 164 178',
  timer_relay: '-100 -100 200 200',
  power_supply: '-88 -66 176 132',
  transformer: '-58 -78 116 156',
  maglock: '-102 -58 204 116',
  door_strike: '-50 -50 100 120',
  led_strip: '-76 -52 152 104',
  sliding_gate: '-148 -86 296 172',
  wave_sensor: '-52 -92 104 200',
  cube_power: '-96 -78 166 168',
  wireless_transmitter: '-40 -50 80 155',
  sm500_maglock: '-66 -112 140 230',
  actuator: '-80 -35 200 70',
  cx12plus: '-135 -72 270 200',
  button_no: '-50 -50 100 100',
  button_nc: '-50 -50 100 100',
  rocker_switch_2pos: '-50 -50 100 100',
  switch_selector: '-50 -50 100 100',
  card_reader: '-40 -60 80 120',
  door_sensor: '-50 -40 100 80',
  limit_switch: '-50 -40 100 80',
  buzzer: '-50 -50 100 100',
  sti_siren_strobe: '-60 -60 120 120',
  battery: '-75 -60 150 120',
  junction: '-30 -30 60 60',
  fuse: '-50 -30 100 60',
  terminal_block: '-60 -50 120 100',
  parking_gate: '-90 -80 180 160',
  elevator_motor: '-65 -100 130 200',
  roland_fan: '-80 -95 160 190'
};

const LibraryThumbnail = React.memo(({ component, selected = false }: {
  component: CircuitComponent;
  selected?: boolean;
}) => (
  <div className={`relative flex h-[52px] w-[56px] shrink-0 items-center justify-center overflow-hidden rounded-lg border transition ${
    selected
      ? 'border-blue-400/40 bg-gradient-to-b from-[#7c8ba5] to-[#55637c] shadow-[0_0_0_1px_rgba(59,130,246,0.25),inset_0_1px_0_rgba(255,255,255,0.22)]'
      : 'border-white/[0.14] bg-gradient-to-b from-[#6b7893] to-[#48546b] shadow-[inset_0_1px_0_rgba(255,255,255,0.18)] group-hover:from-[#7c8ba5] group-hover:to-[#55637c]'
  }`}>
    {/* Soft top-left key light so both dark and light devices separate from the tile */}
    <span className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_30%_22%,rgba(255,255,255,0.28),transparent_65%)]" />
    <svg
      viewBox={thumbnailViewBoxes[component.type] ?? '-76 -72 152 144'}
      preserveAspectRatio="xMidYMid meet"
      aria-hidden="true"
      className="relative h-[44px] w-[48px] overflow-hidden pointer-events-none [filter:drop-shadow(0_1px_2px_rgba(0,0,0,0.45))]"
    >
      <ComponentRenderer
        component={{ ...component, x: 0, y: 0, state: { ...component.state, active: false, energized: false } }}
        isEnergized={false}
      />
    </svg>
    <span className="pointer-events-none absolute inset-x-1.5 bottom-0 h-px bg-gradient-to-r from-transparent via-blue-400/35 to-transparent" />
  </div>
));

// Keep the SVG previews stable while devices move on the canvas.
const libraryPreviews: Record<string, CircuitComponent> = Object.fromEntries(customLabOptions.map(option => [option.id, {
  id: `library_${option.id}`,
  type: option.template.type,
  x: 0,
  y: 0,
  label: option.template.label,
  terminals: option.template.terminals,
  state: option.template.state
}]));

const categoryMeta: Record<CustomLabCategory, {
  icon: typeof MousePointerClick;
  iconClass: string;
}> = {
  input: { icon: MousePointerClick, iconClass: 'text-sky-300' },
  control: { icon: Cpu, iconClass: 'text-violet-300' },
  output: { icon: Lightbulb, iconClass: 'text-amber-300' }
};

const focusRing = 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0b1220]';

export const CustomLabSidebar: React.FC = () => {
  const {
    components, isRunning, simulation, wires, sidebarOpen, toggleSidebar,
    toggleSimulation, addCustomLabComponent, removeCustomLabComponent
  } = useGameStore();
  const [searchQuery, setSearchQuery] = React.useState('');
  const [activeCategory, setActiveCategory] = React.useState<CustomLabCategory | 'all'>('all');
  const [activeTab, setActiveTab] = React.useState<'library' | 'bench'>('library');
  const [feedback, setFeedback] = React.useState('');

  const benchComponents = components.filter(component => !!getCustomLabOptionId(component));
  const normalizedQuery = searchQuery.trim().toLowerCase();
  const atCapacity = benchComponents.length >= MAX_CUSTOM_COMPONENTS;
  const counts = React.useMemo(() => {
    const result = new Map<string, number>();
    for (const component of components) {
      const optionId = getCustomLabOptionId(component);
      if (optionId) result.set(optionId, (result.get(optionId) ?? 0) + 1);
    }
    return result;
  }, [components]);
  const matchingOptions = customLabOptions.filter(option =>
    (activeCategory === 'all' || option.category === activeCategory) &&
    (!normalizedQuery || [option.name, option.description, option.terminalSummary]
      .some(value => value.toLowerCase().includes(normalizedQuery)))
  );
  const matchingComponents = benchComponents.filter(component => {
    const option = customLabOptions.find(item => item.id === getCustomLabOptionId(component));
    return !normalizedQuery || [component.label, option?.name ?? '', option?.description ?? '']
      .some(value => value.toLowerCase().includes(normalizedQuery));
  });
  const fixedPowerSources = components.filter(component =>
    component.id === 'custom_transformer' || component.id === 'custom_psu'
  );
  const energizedCount = components.filter(component => simulation.energizedComponents.has(component.id)).length;

  const addDevice = (optionId: string, name: string) => {
    const componentId = addCustomLabComponent(optionId);
    if (componentId) {
      const count = (counts.get(optionId) ?? 0) + 1;
      setFeedback(`${name} added. ${count} on your bench.`);
      window.dispatchEvent(new CustomEvent('nonc:component-added', { detail: { componentId } }));
    } else {
      setFeedback(`Your bench is full. Remove a device to add another.`);
    }
  };
  const focusDevice = (componentId: string) => {
    window.dispatchEvent(new CustomEvent('nonc:focus-component', { detail: { componentId } }));
  };
  const navigateTabs = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
    event.preventDefault();
    const nextTab = event.key === 'Home' ? 'library' : event.key === 'End' ? 'bench' : activeTab === 'library' ? 'bench' : 'library';
    setActiveTab(nextTab);
    document.getElementById(`custom-${nextTab}-tab`)?.focus();
  };

  return (
    <div className={`relative flex shrink-0 overflow-hidden transition-all duration-200 ease-out ${
      sidebarOpen
        ? 'h-[390px] max-h-[48vh] w-full md:h-full md:max-h-none md:w-[380px]'
        : 'h-12 w-full md:h-full md:w-[48px]'
    }`}>
      <p className="sr-only" role="status" aria-live="polite" aria-atomic="true">{feedback}</p>
      {!sidebarOpen ? (
        <button
          type="button"
          onClick={toggleSidebar}
          aria-label="Show device library"
          className={`group flex h-12 w-full items-center justify-center gap-2 border-b border-white/10 bg-[#0b1220] text-slate-300 transition hover:bg-sky-400/10 hover:text-white md:h-full md:w-12 md:flex-col md:border-b-0 md:border-r ${focusRing}`}
        >
          <ChevronRight className="h-4 w-4" />
          <span className="text-xs font-semibold md:[writing-mode:vertical-rl] md:rotate-180">Device library</span>
          <span className="rounded-full bg-sky-400/10 px-1.5 py-0.5 text-[10px] text-sky-300">{benchComponents.length}</span>
        </button>
      ) : (
        <aside aria-label="Custom lab device library" className="flex h-full w-full flex-col overflow-hidden border-b border-white/10 bg-[#0b1220] md:w-[380px] md:border-b-0 md:border-r">
          <div className="shrink-0 border-b border-white/10 px-3 py-2 md:px-4 md:pb-3 md:pt-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="hidden items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.15em] text-sky-300 md:flex">
                  <Wrench className="h-3.5 w-3.5" /> Your custom lab
                </div>
                <h2 className="mt-1 text-sm font-semibold tracking-tight text-white md:text-lg">Build your circuit</h2>
              </div>
              <button type="button" onClick={toggleSimulation} aria-pressed={isRunning} aria-label={isRunning ? 'Turn circuit power off' : 'Turn circuit power on'} className={`ml-auto flex h-8 items-center gap-1.5 rounded-lg px-2 text-[11px] font-medium md:hidden ${isRunning ? 'bg-emerald-400/10 text-emerald-300' : 'bg-white/5 text-slate-300'} ${focusRing}`}><Zap className="h-3.5 w-3.5" /> Power {isRunning ? 'on' : 'off'}</button>
              <button type="button" onClick={toggleSidebar} aria-label="Hide device library" title="Hide device library" className={`flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-white/10 hover:text-white ${focusRing}`}>
                <ChevronLeft className="h-4 w-4" />
              </button>
            </div>
            <div className="mt-3 hidden items-center gap-3 md:flex">
              <button
                type="button"
                onClick={toggleSimulation}
                aria-pressed={isRunning}
                aria-label={isRunning ? 'Turn circuit power off' : 'Turn circuit power on'}
                className={`flex h-10 shrink-0 items-center justify-center gap-2 rounded-xl border px-3 text-xs font-semibold transition ${focusRing} ${isRunning ? 'border-emerald-400/30 bg-emerald-400/10 text-emerald-200 hover:bg-emerald-400/20' : 'border-white/15 bg-white/5 text-slate-200 hover:bg-white/10'}`}
              >
                <Zap className="h-4 w-4" /> Power {isRunning ? 'on' : 'off'}
                <span className={`h-1.5 w-1.5 rounded-full ${isRunning ? 'bg-emerald-400' : 'bg-slate-500'}`} />
              </button>
              <div className="min-w-0 text-xs">
                <p className={`flex items-center gap-1.5 font-medium ${simulation.shortCircuit ? 'text-red-300' : 'text-slate-300'}`}>
                  <CircleDot className="h-3 w-3 shrink-0" />
                  {simulation.shortCircuit ? 'Short circuit detected' : isRunning ? `${energizedCount} devices energized` : 'Ready when you are'}
                </p>
                <p className="mt-1 text-[11px] text-slate-500">{wires.length} wire{wires.length === 1 ? '' : 's'} connected</p>
              </div>
            </div>
            <div role="tablist" aria-label="Device panels" onKeyDown={navigateTabs} className="mt-2 grid grid-cols-2 gap-1 rounded-xl bg-black/20 p-1 md:mt-4">
              <button id="custom-library-tab" type="button" role="tab" tabIndex={activeTab === 'library' ? 0 : -1} aria-selected={activeTab === 'library'} aria-controls="custom-device-panel" onClick={() => setActiveTab('library')} className={`rounded-lg px-3 py-2 text-xs font-semibold transition ${focusRing} ${activeTab === 'library' ? 'bg-slate-700/60 text-white shadow-sm' : 'text-slate-400 hover:text-white'}`}>Device library</button>
              <button id="custom-bench-tab" type="button" role="tab" tabIndex={activeTab === 'bench' ? 0 : -1} aria-selected={activeTab === 'bench'} aria-controls="custom-device-panel" onClick={() => setActiveTab('bench')} className={`flex items-center justify-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold transition ${focusRing} ${activeTab === 'bench' ? 'bg-slate-700/60 text-white shadow-sm' : 'text-slate-400 hover:text-white'}`}>
                On bench <span className="rounded-md bg-white/10 px-1.5 py-0.5 text-[10px] tabular-nums">{benchComponents.length}</span>
              </button>
            </div>
            <label className="relative mt-2 block md:mt-3">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input type="search" value={searchQuery} onChange={event => setSearchQuery(event.target.value)} placeholder={activeTab === 'library' ? 'Find a device…' : 'Find a device on your bench…'} aria-label={activeTab === 'library' ? 'Search device library' : 'Search bench devices'} className="h-10 w-full rounded-xl border border-white/10 bg-black/15 pl-10 pr-3 text-xs text-slate-100 outline-none transition placeholder:text-slate-500 focus:border-sky-400/60 focus:ring-2 focus:ring-sky-400/10" />
            </label>
            {activeTab === 'library' && (
              <div aria-label="Device categories" className="mt-2 flex flex-wrap gap-1.5 md:mt-2.5">
                {(['all', ...customLabCategories.map(category => category.id)] as const).map(category => (
                  <button key={category} type="button" aria-pressed={activeCategory === category} onClick={() => setActiveCategory(category)} className={`rounded-full border px-3 py-1.5 text-[11px] font-medium transition ${focusRing} ${activeCategory === category ? 'border-sky-400/30 bg-sky-400/15 text-sky-200' : 'border-white/10 text-slate-400 hover:border-white/20 hover:text-white'}`}>
                    {category === 'all' ? 'All devices' : category === 'input' ? 'Inputs' : category === 'control' ? 'Controls' : 'Outputs'}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div id="custom-device-panel" role="tabpanel" aria-labelledby={activeTab === 'library' ? 'custom-library-tab' : 'custom-bench-tab'} className="custom-scrollbar min-h-0 flex-1 overflow-y-auto px-4 py-3">
            {activeTab === 'library' ? (
              <>
                <div className="mb-3 flex items-center justify-between gap-2 text-[11px]">
                  <p className="text-slate-400">Click <span className="font-semibold text-slate-200">Add</span> for each copy you need.</p>
                  <span className="hidden shrink-0 items-center gap-1 text-slate-500 md:flex"><GripVertical className="h-3 w-3" /> Or drag in</span>
                </div>
                {customLabCategories.map(category => {
                  const options = matchingOptions.filter(option => option.category === category.id);
                  if (!options.length) return null;
                  const { icon: Icon, iconClass } = categoryMeta[category.id];
                  return (
                    <section key={category.id} className="mb-5 last:mb-0">
                      <div className="mb-2 flex items-center gap-2">
                        <Icon className={`h-3.5 w-3.5 ${iconClass}`} />
                        <h3 className="text-[11px] font-semibold text-slate-300">{category.label}</h3>
                        <span className="text-[10px] text-slate-500">{options.length}</span>
                      </div>
                      <div className="space-y-2">
                        {options.map(option => {
                          const count = counts.get(option.id) ?? 0;
                          return (
                            <div key={option.id} draggable={!atCapacity} onDragStart={event => {
                              event.dataTransfer.setData('application/x-nonc-component', option.id);
                              event.dataTransfer.effectAllowed = 'copy';
                            }} className={`group rounded-xl border p-3 transition ${atCapacity ? 'border-white/[0.07] bg-white/[0.015]' : 'cursor-grab border-white/10 bg-white/[0.025] hover:border-sky-300/30 hover:bg-sky-300/[0.04] active:cursor-grabbing'}`}>
                              <div className="flex items-start gap-3">
                                <LibraryThumbnail selected={count > 0} component={libraryPreviews[option.id]} />
                                <div className="min-w-0 flex-1">
                                  <p className="text-xs font-semibold leading-4 text-slate-100">{option.name}</p>
                                  <p className="mt-1 text-[10px] leading-4 text-slate-400">{option.terminalSummary}</p>
                                </div>
                              </div>
                              <p title={option.description} className="mt-2 line-clamp-2 text-[11px] leading-[1.55] text-slate-400">{option.description}</p>
                              <div className="mt-2.5 flex items-center justify-between gap-2">
                                <span className={`text-[10px] ${count ? 'text-sky-300' : 'text-slate-500'}`}>{count ? `${count} on bench` : 'Add as many as you need'}</span>
                                <button type="button" onClick={() => addDevice(option.id, option.name)} disabled={atCapacity} aria-label={`Add ${option.name}${count ? ' again' : ''}`} title={atCapacity ? `Your bench holds ${MAX_CUSTOM_COMPONENTS} devices` : `Add ${option.name} to your bench`} className={`flex h-8 items-center justify-center gap-1.5 rounded-lg border border-sky-400/25 bg-sky-400/10 px-3 text-[11px] font-semibold text-sky-200 transition hover:border-sky-300/50 hover:bg-sky-400/20 disabled:cursor-not-allowed disabled:border-white/5 disabled:bg-white/5 disabled:text-slate-600 ${focusRing}`}>
                                  <Plus className="h-3.5 w-3.5" /> Add
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </section>
                  );
                })}
                {matchingOptions.length === 0 && <div className="rounded-xl border border-dashed border-white/10 px-4 py-8 text-center"><Search className="mx-auto h-5 w-5 text-slate-500" /><p className="mt-2 text-xs font-medium text-slate-300">No matching devices</p><p className="mt-1 text-[11px] text-slate-500">Try another name or category.</p><button type="button" onClick={() => { setSearchQuery(''); setActiveCategory('all'); }} className={`mt-3 rounded-lg px-3 py-2 text-xs text-sky-300 hover:bg-sky-400/10 ${focusRing}`}>Show all devices</button></div>}
              </>
            ) : (
              <>
                <p className="mb-3 text-[11px] leading-4 text-slate-400">Select a device to find it on the canvas. Each copy can be wired and removed independently.</p>
                <div className="space-y-2">
                  {matchingComponents.map(component => {
                    const connectedWireCount = wires.filter(wire => wire.fromComponentId === component.id || wire.toComponentId === component.id).length;
                    return (
                      <div key={component.id} className="group flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.025] p-2">
                        <button type="button" onClick={() => focusDevice(component.id)} aria-label={`Find ${component.label} on canvas`} className={`flex min-w-0 flex-1 items-center gap-3 rounded-lg text-left ${focusRing}`}>
                          <LibraryThumbnail component={component} />
                          <span className="min-w-0 flex-1"><span className="block text-xs font-semibold leading-4 text-slate-100">{component.label}</span><span className="mt-1 flex items-center gap-1 text-[10px] text-slate-400"><LocateFixed className="h-3 w-3" /> {connectedWireCount} wire{connectedWireCount === 1 ? '' : 's'} · Find on canvas</span></span>
                        </button>
                        <button type="button" onClick={() => { removeCustomLabComponent(component.id); setFeedback(`${component.label} removed from your bench.`); }} aria-label={`Remove ${component.label}`} title={`Remove ${component.label} and its connected wires`} className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-slate-500 transition hover:bg-red-400/10 hover:text-red-300 ${focusRing}`}><Trash2 className="h-4 w-4" /></button>
                      </div>
                    );
                  })}
                </div>
                {matchingComponents.length === 0 && <div className="rounded-xl border border-dashed border-white/10 px-4 py-6 text-center"><PackageOpen className="mx-auto h-6 w-6 text-slate-500" /><p className="mt-2 text-xs font-medium text-slate-300">{benchComponents.length ? 'No matching devices' : 'Make this bench your own'}</p><p className="mt-1 text-[11px] leading-4 text-slate-500">{benchComponents.length ? 'Try another device name.' : 'Your power sources are ready. Add your first device from the library.'}</p><button type="button" onClick={() => { setSearchQuery(''); setActiveTab('library'); }} className={`mt-3 rounded-lg bg-sky-400/10 px-3 py-2 text-xs font-medium text-sky-300 hover:bg-sky-400/20 ${focusRing}`}>Browse devices</button></div>}
                <section className="mt-5 rounded-xl border border-white/[0.07] bg-black/10 p-3">
                  <div className="mb-2 flex items-center justify-between gap-2"><h3 className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-300"><Zap className="h-3.5 w-3.5 text-sky-300" /> Power sources</h3><span className="text-[10px] text-slate-500">Included · always on bench</span></div>
                  {fixedPowerSources.map(component => <button key={component.id} type="button" onClick={() => focusDevice(component.id)} className={`flex w-full items-center justify-between gap-2 rounded-lg px-2 py-2 text-left text-[11px] text-slate-400 hover:bg-white/5 hover:text-slate-200 ${focusRing}`}><span>{component.label}</span><LocateFixed className="h-3.5 w-3.5" /></button>)}
                </section>
              </>
            )}
          </div>

          <div className="shrink-0 border-t border-white/10 bg-black/10 px-3 py-2 md:px-4 md:py-3">
            <div className="flex items-center justify-between text-[11px]"><span className={atCapacity ? 'text-amber-300' : 'text-slate-400'}>{atCapacity ? 'Bench full — remove a device to add more' : 'Room to experiment'}</span><span className="shrink-0 pl-2 font-medium tabular-nums text-slate-300">{benchComponents.length} / {MAX_CUSTOM_COMPONENTS}</span></div>
            <div className="mt-2 h-1 overflow-hidden rounded-full bg-white/[0.07]"><div className={`h-full rounded-full transition-all ${atCapacity ? 'bg-amber-400' : 'bg-sky-400/70'}`} style={{ width: `${benchComponents.length / MAX_CUSTOM_COMPONENTS * 100}%` }} /></div>
            <p className="mt-2 hidden items-center gap-1.5 text-[10px] text-slate-500 md:flex"><ShieldCheck className="h-3 w-3 shrink-0" /> Add, connect, experiment. Undo is always close by.</p>
          </div>
        </aside>
      )}
    </div>
  );
};

export default CustomLabSidebar;
