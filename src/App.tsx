import React, { useState, useEffect, useCallback } from 'react';
import { useGameStore, Difficulty } from './store/useGameStore';
import Header from './components/Header';
import SudokuBoard from './components/SudokuBoard';
import Controls from './components/Controls';
import SettingsModal from './components/SettingsModal';
import { Play } from 'lucide-react';

const App: React.FC = () => {
  const { 
    theme, 
    status, 
    newGame, 
    actionColor,
    setCellValue,
    eraseCell,
    selectCell,
    selectedCell
  } = useGameStore();
  
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Apply theme to HTML element
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  // Apply action color on load
  useEffect(() => {
    document.documentElement.style.setProperty('--action-color', actionColor);
  }, [actionColor]);

  // Keyboard support
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (status !== 'playing') return;

    if (e.key >= '1' && e.key <= '9') {
      setCellValue(parseInt(e.key));
    } else if (e.key === 'Backspace' || e.key === 'Delete') {
      eraseCell();
    } else if (e.key.startsWith('Arrow')) {
      if (selectedCell === null) {
        selectCell(0);
        return;
      }
      let newIndex = selectedCell;
      if (e.key === 'ArrowUp') newIndex = Math.max(0, selectedCell - 9);
      if (e.key === 'ArrowDown') newIndex = Math.min(80, selectedCell + 9);
      if (e.key === 'ArrowLeft') newIndex = Math.max(0, selectedCell - 1);
      if (e.key === 'ArrowRight') newIndex = Math.min(80, selectedCell + 1);
      selectCell(newIndex);
    }
  }, [status, setCellValue, eraseCell, selectedCell, selectCell]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const difficulties: { label: string; value: Difficulty }[] = [
    { label: 'Easy', value: 'easy' },
    { label: 'Medium', value: 'medium' },
    { label: 'Hard', value: 'hard' },
    { label: 'Extreme', value: 'expert' },
  ];

  if (status === 'idle') {
    return (
      <div className="min-h-screen bg-white dark:bg-slate-900 transition-colors flex flex-col items-center justify-center p-6">
        <div className="w-full max-w-md space-y-12 text-center">
          <div className="space-y-2">
            <h1 className="text-6xl font-black text-slate-900 dark:text-white tracking-tighter">SUDOKU</h1>
            <p className="text-slate-500 dark:text-slate-400 font-medium tracking-widest uppercase text-xs">Distraction Free PWA</p>
          </div>

          <div className="space-y-4">
            <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Select Difficulty</p>
            <div className="grid grid-cols-1 gap-3">
              {difficulties.map((d) => (
                <button
                  key={d.value}
                  onClick={() => newGame(d.value)}
                  className="w-full py-4 rounded-2xl font-black text-xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-3 border-2 border-transparent hover:border-action"
                  style={{ '--tw-border-opacity': '0.3' } as any}
                >
                  <Play size={24} fill="currentColor" />
                  {d.label}
                </button>
              ))}
            </div>
          </div>

          <button 
            onClick={() => setIsSettingsOpen(true)}
            className="text-slate-400 dark:text-slate-500 font-bold hover:text-action transition-colors"
          >
            Appearance Settings
          </button>
        </div>

        <SettingsModal 
          isOpen={isSettingsOpen} 
          onClose={() => setIsSettingsOpen(false)} 
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900 transition-colors flex flex-col items-center p-4">
      <div className="w-full max-w-md flex flex-col gap-6">
        <Header onSettingsOpen={() => setIsSettingsOpen(true)} />
        
        <main className="flex-1 flex flex-col gap-8">
          <SudokuBoard />
          <Controls />
        </main>

        <footer className="py-4 text-center">
          <p className="text-[10px] font-bold text-slate-300 dark:text-slate-700 uppercase tracking-[0.2em]">
            Distraction-Free Sudoku PWA
          </p>
        </footer>
      </div>

      <SettingsModal 
        isOpen={isSettingsOpen} 
        onClose={() => setIsSettingsOpen(false)} 
      />
    </div>
  );
};

export default App;
