import React, { useEffect, useCallback } from 'react';
import { useGameStore, Difficulty } from './store/useGameStore';
import Header from './components/Header';
import SudokuBoard from './components/SudokuBoard';
import Controls from './components/Controls';

const App: React.FC = () => {
  const { 
    status, 
    newGame, 
    setCellValue,
    eraseCell,
    selectCell,
    selectedCell
  } = useGameStore();
  
  // Force dark mode
  useEffect(() => {
    document.documentElement.classList.add('dark');
  }, []);

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
      <div className="min-h-screen bg-black transition-colors flex flex-col items-center justify-center p-6">
        <div className="w-full max-w-md space-y-12 text-center">
          <div className="space-y-2">
            <h1 className="text-6xl font-black text-white/90 tracking-tighter">SUDOKU</h1>
            <p className="text-slate-600 font-medium tracking-[0.3em] uppercase text-[10px]">Distraction Free</p>
          </div>

          <div className="space-y-6">
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Select Difficulty</p>
            <div className="grid grid-cols-1 gap-4">
              {difficulties.map((d) => (
                <button
                  key={d.value}
                  onClick={() => newGame(d.value)}
                  className="w-full py-5 rounded-2xl font-black text-xl bg-slate-900/50 text-slate-300 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3 border-2 border-slate-900 hover:border-blue-600/50 hover:text-white hover:bg-slate-900"
                >
                  {d.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black transition-colors flex flex-col items-center p-4">
      <div className="w-full max-w-md flex flex-col gap-6">
        <Header />
        
        <main className="flex-1 flex flex-col gap-8">
          <SudokuBoard />
          <Controls />
        </main>

        <footer className="py-4 text-center">
          <p className="text-[10px] font-bold text-slate-800 uppercase tracking-[0.2em]">
            Distraction-Free Sudoku
          </p>
        </footer>
      </div>
    </div>
  );
};

export default App;
