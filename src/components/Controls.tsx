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
    autoComplete,
    actionColor
  } = useGameStore();

  const isTrivial = checkTrivialStatus();

  if (status !== 'playing') return null;

  return (
    <div className="w-full space-y-4">
      <div className="grid grid-cols-9 gap-2">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
          <button
            key={num}
            onPointerDown={(e) => {
              e.preventDefault();
              setCellValue(num);
            }}
            className="aspect-square bg-slate-100 dark:bg-slate-800 rounded-lg flex items-center justify-center text-xl font-bold text-slate-700 dark:text-slate-300 active:scale-95 transition-transform hover:bg-slate-200 dark:hover:bg-slate-700"
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
            "flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-semibold transition-all",
            pencilMode 
              ? "text-white shadow-lg" 
              : "bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400"
          )}
          style={pencilMode ? { backgroundColor: actionColor, boxShadow: `0 10px 15px -3px ${actionColor}4D` } : {}}
        >
          <Pencil size={20} />
          <span>Pencil {pencilMode ? 'On' : 'Off'}</span>
        </button>

        <button
          onPointerDown={(e) => {
            e.preventDefault();
            eraseCell();
          }}
          className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-semibold bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 active:scale-95 transition-transform"
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
            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-semibold bg-green-500 text-white shadow-lg shadow-green-200 dark:shadow-green-900/20 animate-bounce active:scale-95 transition-transform"
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
