import React, { useEffect } from 'react';
import { useGameStore, Difficulty } from '../store/useGameStore';
import { Settings, Play, Pause, RefreshCw, Trophy, AlertTriangle } from 'lucide-react';

const Header: React.FC<{ onSettingsOpen: () => void }> = ({ onSettingsOpen }) => {
  const { 
    status, 
    timer, 
    mistakes, 
    difficulty, 
    newGame, 
    updateTimer, 
    togglePause 
  } = useGameStore();

  useEffect(() => {
    const interval = setInterval(() => {
      updateTimer();
    }, 1000);
    return () => clearInterval(interval);
  }, [updateTimer]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const difficultyLabels: Record<Difficulty, string> = {
    easy: 'Easy',
    medium: 'Medium',
    hard: 'Hard',
    expert: 'Extreme'
  };

  return (
    <div className="w-full py-4 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div className="flex flex-col">
          <span className="text-2xl font-black text-slate-800 dark:text-white tracking-tight">SUDOKU</span>
          <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{difficultyLabels[difficulty]}</span>
        </div>

        <div className="flex items-center gap-4">
          <button 
            onClick={onSettingsOpen}
            className="p-2 bg-slate-100 dark:bg-slate-800 rounded-full text-slate-500 dark:text-slate-400 active:scale-90 transition-transform"
          >
            <Settings size={20} />
          </button>
          
          <button 
            onClick={() => newGame(difficulty)}
            className="p-2 bg-slate-100 dark:bg-slate-800 rounded-full text-slate-500 dark:text-slate-400 active:scale-90 transition-transform"
          >
            <RefreshCw size={20} />
          </button>
        </div>
      </div>

      <div className="flex items-center justify-between bg-slate-50 dark:bg-slate-800/50 p-3 rounded-2xl border border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <span className="text-sm font-bold text-slate-400 uppercase">Mistakes</span>
          <div className="flex gap-1">
            {[1, 2, 3].map(i => (
              <div 
                key={i} 
                className={`w-2 h-2 rounded-full ${i <= mistakes ? 'bg-red-500' : 'bg-slate-200 dark:bg-slate-700'}`}
              />
            ))}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-lg font-mono font-bold text-slate-700 dark:text-slate-300">
            {formatTime(timer)}
          </span>
          <button 
            onClick={togglePause}
            className="p-1.5 bg-white dark:bg-slate-700 shadow-sm rounded-lg text-slate-600 dark:text-slate-300"
          >
            {status === 'paused' ? <Play size={16} fill="currentColor" /> : <Pause size={16} fill="currentColor" />}
          </button>
        </div>
      </div>

      {status === 'won' && (
        <div className="flex items-center gap-3 bg-green-100 dark:bg-green-900/30 p-4 rounded-2xl border border-green-200 dark:border-green-800/50 text-green-700 dark:text-green-400 animate-in zoom-in-95 duration-300">
          <Trophy size={24} className="animate-bounce" />
          <div className="flex-1">
            <h3 className="font-bold">Victory!</h3>
            <p className="text-xs">You solved the puzzle in {formatTime(timer)}.</p>
          </div>
          <button 
            onClick={() => newGame(difficulty)}
            className="bg-green-500 text-white px-4 py-2 rounded-xl text-sm font-bold shadow-lg shadow-green-500/30"
          >
            New Game
          </button>
        </div>
      )}

      {status === 'lost' && (
        <div className="flex items-center gap-3 bg-red-100 dark:bg-red-900/30 p-4 rounded-2xl border border-red-200 dark:border-red-800/50 text-red-700 dark:text-red-400 animate-in zoom-in-95 duration-300">
          <AlertTriangle size={24} />
          <div className="flex-1">
            <h3 className="font-bold">Game Over</h3>
            <p className="text-xs">3 strikes and you're out. Try again!</p>
          </div>
          <button 
            onClick={() => newGame(difficulty)}
            className="bg-red-500 text-white px-4 py-2 rounded-xl text-sm font-bold shadow-lg shadow-red-500/30"
          >
            Restart
          </button>
        </div>
      )}
    </div>
  );
};

export default Header;
