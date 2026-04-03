import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { getSudoku } from 'sudoku-gen';

export type Difficulty = 'easy' | 'medium' | 'hard' | 'expert';

interface GameState {
  difficulty: Difficulty;
  board: (number | null)[];
  initialBoard: (number | null)[];
  solution: number[];
  pencilMarks: number[][]; // Array of sets of numbers (using arrays for JSON serialization)
  selectedCell: number | null;
  mistakes: number;
  timer: number;
  status: 'playing' | 'won' | 'lost' | 'paused' | 'idle';
  pencilMode: boolean;
  theme: 'light' | 'dark';
  actionColor: string;

  // Actions
  newGame: (difficulty: Difficulty) => void;
  selectCell: (index: number | null) => void;
  setCellValue: (value: number) => void;
  eraseCell: () => void;
  togglePencilMode: () => void;
  togglePause: () => void;
  updateTimer: () => void;
  setTheme: (theme: 'light' | 'dark') => void;
  setActionColor: (color: string) => void;
  autoComplete: () => void;
  checkTrivialStatus: () => boolean;
}

const parseBoard = (str: string): (number | null)[] => {
  return str.split('').map(c => c === '-' ? null : parseInt(c));
};

const parseSolution = (str: string): number[] => {
  return str.split('').map(c => parseInt(c));
};

export const useGameStore = create<GameState>()(
  persist(
    (set, get) => ({
      difficulty: 'medium',
      board: Array(81).fill(null),
      initialBoard: Array(81).fill(null),
      solution: Array(81).fill(0),
      pencilMarks: Array(81).fill([]),
      selectedCell: null,
      mistakes: 0,
      timer: 0,
      status: 'idle',
      pencilMode: false,
      theme: 'light',
      actionColor: '#3b82f6',

      newGame: (difficulty: Difficulty) => {
        const { puzzle, solution } = getSudoku(difficulty); 
        
        set({
          difficulty,
          board: parseBoard(puzzle),
          initialBoard: parseBoard(puzzle),
          solution: parseSolution(solution),
          pencilMarks: Array(81).fill([]),
          selectedCell: null,
          mistakes: 0,
          timer: 0,
          status: 'playing',
          pencilMode: false
        });
      },

      selectCell: (index: number | null) => set({ selectedCell: index }),

      setCellValue: (value: number) => {
        const { selectedCell, board, initialBoard, solution, pencilMode, pencilMarks, mistakes, status } = get();
        if (selectedCell === null || status !== 'playing') return;
        if (initialBoard[selectedCell] !== null) return;

        if (pencilMode) {
          const marks = [...pencilMarks[selectedCell]];
          const newMarks = marks.includes(value) 
            ? marks.filter(m => m !== value) 
            : [...marks, value].sort();
          
          const newPencilMarks = [...pencilMarks];
          newPencilMarks[selectedCell] = newMarks;
          set({ pencilMarks: newPencilMarks });
        } else {
          if (board[selectedCell] === value) return; // Already there

          if (value !== solution[selectedCell]) {
            const newMistakes = mistakes + 1;
            set({ 
              mistakes: newMistakes,
              status: newMistakes >= 3 ? 'lost' : 'playing'
            });
            // Brief visual feedback handled in component? 
            // We'll still update board to show the wrong number briefly or just count mistake
            return;
          }

          const newBoard = [...board];
          newBoard[selectedCell] = value;
          
          // Auto-erase pencil marks
          const newPencilMarks = [...pencilMarks];
          const row = Math.floor(selectedCell / 9);
          const col = selectedCell % 9;
          const boxRow = Math.floor(row / 3) * 3;
          const boxCol = Math.floor(col / 3) * 3;

          for (let i = 0; i < 81; i++) {
            const r = Math.floor(i / 9);
            const c = i % 9;
            const br = Math.floor(r / 3) * 3;
            const bc = Math.floor(c / 3) * 3;

            if (r === row || c === col || (br === boxRow && bc === boxCol)) {
              newPencilMarks[i] = newPencilMarks[i].filter(m => m !== value);
            }
          }

          const isWon = newBoard.every((cell, idx) => cell === solution[idx]);

          set({ 
            board: newBoard, 
            pencilMarks: newPencilMarks,
            status: isWon ? 'won' : 'playing'
          });
        }
      },

      eraseCell: () => {
        const { selectedCell, board, initialBoard, status, pencilMarks } = get();
        if (selectedCell === null || status !== 'playing' || initialBoard[selectedCell] !== null) return;
        
        const newBoard = [...board];
        newBoard[selectedCell] = null;
        
        const newPencilMarks = [...pencilMarks];
        newPencilMarks[selectedCell] = [];

        set({ board: newBoard, pencilMarks: newPencilMarks });
      },

      togglePencilMode: () => set(state => ({ pencilMode: !state.pencilMode })),

      togglePause: () => set(state => {
        if (state.status === 'playing') return { status: 'paused' };
        if (state.status === 'paused') return { status: 'playing' };
        return state;
      }),

      updateTimer: () => set(state => {
        if (state.status === 'playing') return { timer: state.timer + 1 };
        return state;
      }),

      setTheme: (theme: 'light' | 'dark') => set({ theme }),
      
      setActionColor: (color: string) => {
        document.documentElement.style.setProperty('--action-color', color);
        set({ actionColor: color });
      },

      checkTrivialStatus: () => {
        const { board, status } = get();
        if (status !== 'playing') return false;
        const emptyCells = board.filter(c => c === null).length;
        // User definition: "trivial" (e.g. 15 or less free cells & all cells are either last in row/col/square or depend on cells that are last...)
        // Simplified heuristic: if 15 or fewer cells remain, we'll allow auto-complete button.
        return emptyCells > 0 && emptyCells <= 15;
      },

      autoComplete: () => {
        const { solution, status } = get();
        if (status !== 'playing') return;
        set({ board: [...solution], status: 'won' });
      }
    }),
    {
      name: 'sudoku-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
