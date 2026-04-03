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
        <span className="text-2xl font-black tracking-tight text-white/90">SUDOKU</span>

        <button 
          onClick={handleReset}
          className="p-2 bg-slate-900 rounded-full text-slate-400 active:scale-90 transition-transform hover:text-slate-200 border border-slate-800"
        >
          <RefreshCw size={18} />
        </button>
      </div>

      <div className="flex items-center justify-between bg-slate-950 p-2 px-3 rounded-xl border border-slate-900">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Mistakes</span>
          <div className="flex gap-1">
            {[1, 2, 3].map(i => (
              <div 
                key={i} 
                className={`w-1.5 h-1.5 rounded-full transition-colors duration-300 ${i <= mistakes ? 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]' : 'bg-slate-800'}`}
              />
            ))}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-sm font-mono font-medium text-slate-400">
            {formatTime(timer)}
          </span>
          <button 
            onClick={togglePause}
            className="p-1 bg-slate-900 shadow-sm rounded-md text-slate-400 border border-slate-800 hover:text-slate-200"
          >
            {status === 'paused' ? <Play size={12} fill="currentColor" /> : <Pause size={12} fill="currentColor" />}
          </button>
        </div>
      </div>

      {status === 'won' && (
        <div className="flex items-center gap-3 bg-green-950/40 p-3 rounded-xl border border-green-900/50 text-green-400 animate-in zoom-in-95 duration-300">
          <Trophy size={18} className="animate-bounce" />
          <div className="flex-1">
            <h3 className="text-sm font-bold">Victory!</h3>
          </div>
          <button 
            onClick={resetGame}
            className="bg-green-600 text-white px-3 py-1.5 rounded-lg text-xs font-bold shadow-lg shadow-green-900/20"
          >
            New Game
          </button>
        </div>
      )}

      {status === 'lost' && (
        <div className="flex items-center gap-3 bg-red-950/40 p-3 rounded-xl border border-red-900/50 text-red-400 animate-in zoom-in-95 duration-300">
          <AlertTriangle size={18} />
          <div className="flex-1">
            <h3 className="text-sm font-bold">Game Over</h3>
          </div>
          <button 
            onClick={resetGame}
            className="bg-red-600 text-white px-3 py-1.5 rounded-lg text-xs font-bold shadow-lg shadow-red-900/20"
          >
            Restart
          </button>
        </div>
      )}
    </div>
  );
};

export default Header;
