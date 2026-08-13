import React from 'react';
import { Sparkles, Terminal } from 'lucide-react';

interface HeaderProps {
  onResetHome?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onResetHome }) => {
  return (
    <header className="w-full border-b border-emerald-950/60 bg-[#070a0f]/90 backdrop-blur-md sticky top-0 z-50 px-4 py-3 sm:px-8">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Brand Logo */}
        <button
          onClick={onResetHome}
          className="flex items-center gap-2.5 group focus:outline-none focus:ring-2 focus:ring-emerald-500/50 rounded-lg p-1 text-left"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-400 via-teal-500 to-amber-500 p-0.5 shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition-transform">
            <div className="w-full h-full bg-[#070a0f] rounded-[10px] flex items-center justify-center">
              <Terminal className="w-4 h-4 text-emerald-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-black text-lg tracking-wider text-white group-hover:text-emerald-400 transition-colors">
                HH GOA <span className="text-emerald-400">2026</span>
              </span>
              <span className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-mono font-bold uppercase bg-emerald-950/80 text-emerald-400 border border-emerald-800/60 rounded-full">
                Goa Edition
              </span>
            </div>
            <p className="text-[11px] font-mono text-zinc-400 -mt-0.5">Frame In Goa</p>
          </div>
        </button>

        {/* Hashtag & Action */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-zinc-900/90 border border-emerald-500/30 text-xs font-mono text-emerald-400 shadow-inner">
            <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
            <span>#FrameInGoa</span>
          </div>

          {onResetHome && (
            <button
              onClick={onResetHome}
              className="text-xs font-mono px-3 py-1.5 rounded-lg border border-zinc-800 text-zinc-300 hover:text-white hover:bg-zinc-900 hover:border-zinc-700 transition-all"
            >
              Start Over
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
