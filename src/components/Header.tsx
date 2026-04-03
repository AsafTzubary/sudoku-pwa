import React, { useEffect } from 'react';
import { useGameStore } from '../store/useGameStore';
import { Play, Pause, RefreshCw, Trophy, AlertTriangle } from 'lucide-react';

const Header: React.FC = () => {
  const { 
    status, 
    timer, 
    mistakes, 
    updateTimer, 
    togglePause,
    resetGame
  } = useGameStore();

  useEffect(() => {
    const interval = setInterval(() => {
      updateTimer();
    }, 1000);
    return () => clearInterval(interval);
  }, [updateTimer]);

  const handleReset = () => {
    if (window.confirm('Are you sure you want to restart the game?')) {
      resetGame();
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="w-full pt-8 pb-1 flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <span className="text-2xl font-black tracking-tight text-white">SUDOKU</span>

        <button 
          onClick={handleReset}
          className="p-2 bg-slate-800 rounded-full text-slate-400 active:scale-90 transition-transform"
        >
          <RefreshCw size={20} />
        </button>
      </div>

      <div className="flex items-center justify-between bg-slate-800/50 p-2 px-3 rounded-xl border border-slate-800">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Mistakes</span>
          <div className="flex gap-1">
            {[1, 2, 3].map(i => (
              <div 
                key={i} 
                className={`w-1.5 h-1.5 rounded-full ${i <= mistakes ? 'bg-red-500' : 'bg-slate-700'}`}
              />
            ))}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-sm font-mono font-bold text-slate-300">
            {formatTime(timer)}
          </span>
          <button 
            onClick={togglePause}
            className="p-1 bg-slate-700 shadow-sm rounded-md text-slate-300"
          >
            {status === 'paused' ? <Play size={14} fill="currentColor" /> : <Pause size={14} fill="currentColor" />}
          </button>
        </div>
      </div>

      {status === 'won' && (
        <div className="flex items-center gap-3 bg-green-900/30 p-3 rounded-xl border border-green-800/50 text-green-400 animate-in zoom-in-95 duration-300">
          <Trophy size={20} className="animate-bounce" />
          <div className="flex-1">
            <h3 className="text-sm font-bold">Victory!</h3>
          </div>
          <button 
            onClick={resetGame}
            className="bg-green-500 text-white px-3 py-1.5 rounded-lg text-xs font-bold"
          >
            New Game
          </button>
        </div>
      )}

      {status === 'lost' && (
        <div className="flex items-center gap-3 bg-red-900/30 p-3 rounded-xl border border-red-800/50 text-red-400 animate-in zoom-in-95 duration-300">
          <AlertTriangle size={20} />
          <div className="flex-1">
            <h3 className="text-sm font-bold">Game Over</h3>
          </div>
          <button 
            onClick={resetGame}
            className="bg-red-500 text-white px-3 py-1.5 rounded-lg text-xs font-bold"
          >
            Restart
          </button>
        </div>
      )}
    </div>
  );
};

export default Header;
