import { useEffect } from 'react';
import { useGameStore } from './store/useGameStore';
import { ControlPanel } from './components/game/ControlPanel';
import { Sidebar } from './components/game/Sidebar';
import { Workspace } from './components/game/Workspace';
import { HelpOverlay } from './components/game/HelpOverlay';

function App() {
  const initLevel = useGameStore(state => state.initLevel);

  // Initialize first level on mount
  useEffect(() => {
    initLevel(0);
  }, [initLevel]);

  return (
    <div className="min-h-screen flex flex-col bg-industrial-gray-900 text-slate-200 overflow-hidden font-sans select-none">
      {/* Top Engineering Control Bar */}
      <ControlPanel />

      {/* Main Workspace split */}
      <div className="flex-grow flex overflow-hidden relative">
        {/* Left Objectives & DMM Sidebar */}
        <Sidebar />

        {/* Center Schematic Canvas & Diagnostics */}
        <div className="flex-grow flex flex-col overflow-hidden relative">
          <Workspace />
          <HelpOverlay />
        </div>
      </div>
    </div>
  );
}

export default App;
