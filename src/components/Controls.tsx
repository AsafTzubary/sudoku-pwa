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

  return (
    <div className="w-full space-y-4">
      <div className="grid grid-cols-9 gap-1.5">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
          <button
            key={num}
            onPointerDown={(e) => {
              e.preventDefault();
              setCellValue(num);
            }}
            className="aspect-[1/1.4] bg-slate-800 rounded-lg flex items-center justify-center text-xl font-bold text-slate-300 active:scale-95 transition-transform hover:bg-slate-700 border border-slate-700"
          >
            {num}
          </button>
        ))}
      </div>

      <div className="flex items-center justify-between gap-4">
        <button
          onPointerDown={(e) => {
            e.preventDefault();
            togglePencilMode();
          }}
          className={cn(
            "flex-1 flex items-center justify-center gap-2 py-4 rounded-xl font-semibold transition-all",
            pencilMode 
              ? "bg-blue-600 text-white shadow-lg shadow-blue-500/30" 
              : "bg-slate-800 text-slate-400 border border-slate-700"
          )}
        >
          <Pencil size={20} />
          <span>Pencil {pencilMode ? 'On' : 'Off'}</span>
        </button>

        <button
          onPointerDown={(e) => {
            e.preventDefault();
            eraseCell();
          }}
          className="flex-1 flex items-center justify-center gap-2 py-4 rounded-xl font-semibold bg-slate-800 text-slate-400 border border-slate-700 active:scale-95 transition-transform"
        >
          <Eraser size={20} />
          <span>Erase</span>
        </button>

        {isTrivial && (
          <button
            onPointerDown={(e) => {
              e.preventDefault();
              autoComplete();
            }}
            className="flex-1 flex items-center justify-center gap-2 py-4 rounded-xl font-semibold bg-green-600 text-white shadow-lg shadow-green-500/30 animate-pulse active:scale-95 transition-transform"
          >
            <CheckCircle size={20} />
            <span>Finish</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default Controls;
