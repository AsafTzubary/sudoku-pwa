import React from 'react';
import { useGameStore } from '../store/useGameStore';
import { Pencil, Eraser, CheckCircle } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const Controls: React.FC = () => {
  const { 
    board,
    solution,
    setCellValue, 
    eraseCell, 
    pencilMode, 
    togglePencilMode, 
    status,
    checkTrivialStatus,
    autoComplete
  } = useGameStore();

  const isTrivial = checkTrivialStatus();

  if (status !== 'playing') return null;

  const getNumberCount = (num: number) => {
    return board.filter((v, i) => v === num && v === solution[i]).length;
  };

  return (
    <div className="w-full space-y-6">
      <div className="flex items-center justify-between gap-4">
        <button
          onPointerDown={(e) => {
            e.preventDefault();
            togglePencilMode();
          }}
          className={cn(
            "flex-1 flex items-center justify-center gap-2 py-4 rounded-xl font-semibold transition-all",
            pencilMode 
              ? "bg-blue-600/20 text-blue-400 border border-blue-500/50 shadow-[0_0_15px_rgba(59,130,246,0.1)]" 
              : "bg-slate-900 text-slate-500 border border-slate-800 hover:text-slate-300"
          )}
        >
          <Pencil size={18} />
          <span className="text-sm">Pencil {pencilMode ? 'On' : 'Off'}</span>
        </button>

        <button
          onPointerDown={(e) => {
            e.preventDefault();
            eraseCell();
          }}
          className="flex-1 flex items-center justify-center gap-2 py-4 rounded-xl font-semibold bg-slate-900 text-slate-500 border border-slate-800 active:scale-95 transition-transform hover:text-slate-300"
        >
          <Eraser size={18} />
          <span className="text-sm">Erase</span>
        </button>

        {isTrivial && (
          <button
            onPointerDown={(e) => {
              e.preventDefault();
              autoComplete();
            }}
            className="flex-1 flex items-center justify-center gap-2 py-4 rounded-xl font-semibold bg-green-600/20 text-green-400 border border-green-500/50 shadow-[0_0_15px_rgba(34,197,94,0.1)] animate-pulse active:scale-95 transition-transform"
          >
            <CheckCircle size={18} />
            <span className="text-sm">Finish</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-9 gap-1.5">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => {
          const count = getNumberCount(num);
          const isComplete = count >= 9;
          
          return (
            <button
              key={num}
              onPointerDown={(e) => {
                e.preventDefault();
                if (!isComplete) setCellValue(num);
              }}
              className={cn(
                "aspect-[1/1.8] rounded-lg flex items-center justify-center text-xl font-bold transition-all border",
                isComplete 
                  ? "bg-black text-transparent border-transparent cursor-default pointer-events-none" 
                  : "bg-slate-900 text-slate-300 active:scale-95 hover:bg-slate-800 border-slate-800 hover:text-white"
              )}
              disabled={isComplete}
            >
              {!isComplete && num}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default Controls;
