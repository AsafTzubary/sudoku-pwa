import React, { useState, useEffect, useCallback } from 'react';
import { useGameStore } from './store/useGameStore';
import Header from './components/Header';
import SudokuBoard from './components/SudokuBoard';
import Controls from './components/Controls';
import SettingsModal from './components/SettingsModal';

const App: React.FC = () => {
  const { 
    theme, 
    status, 
    newGame, 
    difficulty, 
    actionColor,
    setCellValue,
    eraseCell,
    selectCell,
    selectedCell
  } = useGameStore();
  
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Initialize game
  useEffect(() => {
    if (status === 'idle') {
      newGame(difficulty);
    }
  }, [status, newGame, difficulty]);

  // Apply theme
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
