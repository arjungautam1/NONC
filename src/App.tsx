import { useEffect } from 'react';
import { useGameStore } from './store/useGameStore';
import { ControlPanel } from './components/game/ControlPanel';
import { Sidebar } from './components/game/Sidebar';
import { Workspace } from './components/game/Workspace';
import { HelpOverlay } from './components/game/HelpOverlay';
import { LevelDashboard } from './components/game/LevelDashboard';

function App() {
  const initLevel = useGameStore(state => state.initLevel);
  const useHint = useGameStore(state => state.useHint);
  const viewMode = useGameStore(state => state.viewMode);

  // Initialize first level on mount, skipping the view mode change so it starts at the levels screen
  useEffect(() => {
    initLevel(0, true);
  }, [initLevel]);

  // Shortcut key listener: 'h'/'H' for next hint
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable
      ) {
        return;
      }
      if (e.key === 'h' || e.key === 'H') {
        e.preventDefault();
        useHint();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [useHint]);

  if (viewMode === 'levels') {
    return <LevelDashboard />;
  }

  return (
    <div className="h-screen flex flex-col bg-[#080b12] text-slate-200 overflow-hidden font-sans select-none">
      {/* Top Engineering Control Bar */}
      <ControlPanel />

      {/* Main Workspace split */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden relative min-h-0">
        {/* Left Objectives & DMM Sidebar */}
        <Sidebar />

        {/* Center Schematic Canvas & Diagnostics */}
        <div className="flex-1 flex flex-col overflow-hidden relative min-w-0 min-h-0">
          <Workspace />
          <HelpOverlay />
        </div>
      </div>
    </div>
  );
}

export default App;
