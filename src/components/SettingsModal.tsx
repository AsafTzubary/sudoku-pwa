import React from 'react';
import { useGameStore, Difficulty } from '../store/useGameStore';
import { X, Moon, Sun, Check } from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const actionColors = [
  { name: 'Blue', hex: '#3b82f6' },
  { name: 'Red', hex: '#ef4444' },
  { name: 'Green', hex: '#22c55e' },
  { name: 'Purple', hex: '#a855f7' },
  { name: 'Orange', hex: '#f97316' },
  { name: 'Pink', hex: '#ec4899' },
];

const difficulties: { label: string; value: Difficulty }[] = [
  { label: 'Easy', value: 'easy' },
  { label: 'Medium', value: 'medium' },
  { label: 'Hard', value: 'hard' },
  { label: 'Extreme', value: 'expert' },
];

const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  const { 
    theme, 
    setTheme, 
    actionColor, 
    setActionColor, 
    difficulty, 
    newGame 
  } = useGameStore();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative w-full max-w-sm bg-white dark:bg-slate-900 rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-slate-800">
          <h2 className="text-xl font-black text-slate-800 dark:text-white">Settings</h2>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
            <X size={24} />
          </button>
        </div>

        <div className="p-6 space-y-8">
          {/* Difficulty Section */}
          <section className="space-y-3">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest">New Game Difficulty</h3>
            <div className="grid grid-cols-2 gap-2">
              {difficulties.map((d) => (
                <button
                  key={d.value}
                  onClick={() => {
                    newGame(d.value);
                    onClose();
                  }}
                  className={`py-3 rounded-xl font-bold transition-all ${
                    difficulty === d.value 
                      ? 'bg-action text-white shadow-lg shadow-action/30' 
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  {d.label}
                </button>
              ))}
            </div>
          </section>

          {/* Theme Section */}
          <section className="space-y-3">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Theme</h3>
            <div className="flex gap-2 p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl">
              <button
                onClick={() => setTheme('light')}
                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold transition-all ${
                  theme === 'light' ? 'bg-white dark:bg-slate-700 shadow-sm text-slate-800 dark:text-white' : 'text-slate-500'
                }`}
              >
                <Sun size={18} /> Light
              </button>
              <button
                onClick={() => setTheme('dark')}
                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold transition-all ${
                  theme === 'dark' ? 'bg-white dark:bg-slate-700 shadow-sm text-slate-800 dark:text-white' : 'text-slate-500'
                }`}
              >
                <Moon size={18} /> Dark
              </button>
            </div>
          </section>

          {/* Action Color Section */}
          <section className="space-y-3 pb-4">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Action Color</h3>
            <div className="grid grid-cols-6 gap-3">
              {actionColors.map((color) => (
                <button
                  key={color.hex}
                  onClick={() => setActionColor(color.hex)}
                  className="aspect-square rounded-full relative flex items-center justify-center transition-transform active:scale-90"
                  style={{ backgroundColor: color.hex }}
                >
                  {actionColor === color.hex && (
                    <Check size={18} className="text-white" />
                  )}
                </button>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;
