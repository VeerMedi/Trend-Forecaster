import React from 'react';
import { VIEWS } from '../constants';
import type { View } from '../types';

interface BottomNavProps {
  activeView: View;
  setActiveView: (view: View) => void;
}

const BottomNav: React.FC<BottomNavProps> = ({ activeView, setActiveView }) => {
  return (
    <footer className="fixed bottom-4 left-1/2 -translate-x-1/2 z-20">
      <div className="flex items-center space-x-2 bg-stone-900/80 backdrop-blur-xl border border-stone-700/50 rounded-full shadow-2xl shadow-stone-950/50 px-4 py-2">
        {VIEWS.map((view) => (
          <button
            key={view.id}
            onClick={() => setActiveView(view.id)}
            className={`flex flex-col items-center justify-center w-20 h-14 rounded-full transition-all duration-300 ease-in-out group ${activeView === view.id ? 'bg-amber-600/90' : 'hover:bg-stone-800'
              }`}
            aria-label={view.label}
          >
            <view.icon
              className={`w-5 h-5 mb-1 transition-colors ${activeView === view.id ? 'text-stone-950' : 'text-stone-400 group-hover:text-stone-200'
                }`}
            />
            <span
              className={`text-xs font-light tracking-wide transition-colors ${activeView === view.id ? 'text-stone-950' : 'text-stone-400 group-hover:text-stone-200'
                }`}
            >
              {view.label}
            </span>
          </button>
        ))}
      </div>
    </footer>
  );
};

export default BottomNav;

