import { lazy, Suspense, useEffect } from 'react';
import { useGameStore } from './store/useGameStore';
import { LabHome } from './components/game/LabHome';
import { BetaBanner } from './components/game/BetaBanner';

const CustomLab = lazy(() => import('./components/game/CustomLab'));

function App() {
  const undo = useGameStore(state => state.undo);
  const redo = useGameStore(state => state.redo);
  const viewMode = useGameStore(state => state.viewMode);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (viewMode !== 'lab' || event.defaultPrevented) return;
      const target = event.target;
      if (target instanceof Element && target.closest('input, textarea, select, [contenteditable="true"], [role="textbox"]')) return;
      const key = event.key.toLowerCase();
      if ((event.ctrlKey || event.metaKey) && !event.altKey && (key === 'z' || key === 'y')) {
        event.preventDefault();
        if (key === 'y' || event.shiftKey) redo();
        else undo();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [undo, redo, viewMode]);

  return viewMode === 'home' ? <><BetaBanner /><LabHome /></> : (
    <Suspense fallback={<div className="grid min-h-screen place-items-center bg-[#080b12] text-slate-300" role="status">Opening your lab…</div>}>
      <CustomLab />
    </Suspense>
  );
}

export default App;
