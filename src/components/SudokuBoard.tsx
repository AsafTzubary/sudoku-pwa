import React from 'react';
import { useGameStore } from '../store/useGameStore';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const SudokuBoard: React.FC = () => {
  const { board, initialBoard, selectedCell, selectCell, status } = useGameStore();

  const isHighlighted = (index: number) => {
    if (selectedCell === null) return false;
    
    const row = Math.floor(index / 9);
    const col = index % 9;
    const sRow = Math.floor(selectedCell / 9);
    const sCol = selectedCell % 9;
    
    // Row or Column
    if (row === sRow || col === sCol) return true;
    
    // 3x3 Block
    const boxRow = Math.floor(row / 3);
    const boxCol = Math.floor(col / 3);
    const sBoxRow = Math.floor(sRow / 3);
    const sBoxCol = Math.floor(sCol / 3);
    if (boxRow === sBoxRow && boxCol === sBoxCol) return true;
    
    return false;
  };

  const isSameNumber = (index: number) => {
    if (selectedCell === null) return false;
    const selectedValue = board[selectedCell];
    return selectedValue !== null && board[index] === selectedValue;
  };

  if (status === 'paused') {
    return (
      <div className="w-full aspect-square bg-slate-100 dark:bg-slate-800 flex items-center justify-center rounded-lg border-2 border-slate-300 dark:border-slate-700">
        <span className="text-xl font-bold text-slate-500">Paused</span>
      </div>
    );
  }

  return (
    <div className="sudoku-grid w-full rounded-sm overflow-hidden">
      {board.map((value, index) => (
        <Cell 
          key={index} 
          index={index} 
          value={value}
          isInitial={initialBoard[index] !== null}
          isSelected={selectedCell === index}
          isHighlighted={isHighlighted(index)}
          isSameNumber={isSameNumber(index)}
          onClick={() => selectCell(index)}
        />
      ))}
    </div>
  );
};

interface CellProps {
  index: number;
  value: number | null;
  isInitial: boolean;
  isSelected: boolean;
  isHighlighted: boolean;
  isSameNumber: boolean;
  onClick: () => void;
}

const Cell: React.FC<CellProps> = ({ index, value, isInitial, isSelected, isHighlighted, isSameNumber, onClick }) => {
  const { pencilMarks, solution } = useGameStore();
  const marks = pencilMarks[index];
  const isError = value !== null && !isInitial && value !== solution[index];

  return (
    <div 
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      className={cn(
        "cell transition-colors flex items-center justify-center",
        isSelected && "selected",
        !isSelected && isSameNumber && "same-number",
        !isSelected && !isSameNumber && isHighlighted && "highlighted",
        isInitial ? "initial" : "user-number",
        isError && "error"
      )}
    >
      {value !== null ? (
        <span className="pointer-events-none">{value}</span>
      ) : (
        <div className="pencil-grid pointer-events-none">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
            <div key={num} className="pencil-note">
              {marks.includes(num) ? num : ''}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SudokuBoard;
