import React from 'react';
import { FormatType } from '../types';
import { User, CreditCard, Check, Sparkles } from 'lucide-react';

interface FormatSelectorProps {
  selectedFormat: FormatType;
  onSelectFormat: (format: FormatType) => void;
}

export const FormatSelector: React.FC<FormatSelectorProps> = ({
  selectedFormat,
  onSelectFormat,
}) => {
  return (
    <div className="w-full space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>Select Format</span>
        </label>
        <span className="text-[11px] font-mono text-zinc-400">1080×1080 or 1080×1350</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* FORMAT A: PFP FRAME */}
        <div
          onClick={() => onSelectFormat('pfp')}
          className={`relative p-5 rounded-2xl border-2 transition-all cursor-pointer ${
            selectedFormat === 'pfp'
              ? 'border-emerald-400 bg-emerald-950/30 shadow-xl shadow-emerald-950/50'
              : 'border-zinc-800 bg-zinc-900/50 hover:border-zinc-700 hover:bg-zinc-900'
          }`}
        >
          {selectedFormat === 'pfp' && (
            <div className="absolute top-3 right-3 w-6 h-6 rounded-full bg-emerald-400 text-zinc-950 flex items-center justify-center">
              <Check className="w-4 h-4 stroke-[3]" />
            </div>
          )}

          <div className="flex items-start gap-4">
            {/* Square Icon preview */}
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500/20 to-teal-500/10 border border-emerald-500/30 flex items-center justify-center shrink-0">
              <User className="w-6 h-6 text-emerald-400" />
            </div>

            <div className="space-y-1 text-left">
              <div className="flex items-center gap-2">
                <span className="font-black text-white text-base tracking-wide">PFP FRAME</span>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-zinc-800 text-emerald-400">
                  1:1
                </span>
              </div>
              <p className="text-xs text-zinc-300">
                Turn your photo into an HH Goa 2026 profile picture for X and social channels.
              </p>
              <button
                type="button"
                className={`mt-2 text-xs font-mono font-bold px-3 py-1.5 rounded-lg border transition-all ${
                  selectedFormat === 'pfp'
                    ? 'bg-emerald-400 text-zinc-950 border-emerald-400'
                    : 'bg-zinc-800 text-zinc-300 border-zinc-700 hover:bg-zinc-700'
                }`}
              >
                {selectedFormat === 'pfp' ? 'Selected PFP' : 'Choose PFP'}
              </button>
            </div>
          </div>
        </div>

        {/* FORMAT B: BUILDER ID */}
        <div
          onClick={() => onSelectFormat('builder')}
          className={`relative p-5 rounded-2xl border-2 transition-all cursor-pointer ${
            selectedFormat === 'builder'
              ? 'border-emerald-400 bg-emerald-950/30 shadow-xl shadow-emerald-950/50'
              : 'border-zinc-800 bg-zinc-900/50 hover:border-zinc-700 hover:bg-zinc-900'
          }`}
        >
          {selectedFormat === 'builder' && (
            <div className="absolute top-3 right-3 w-6 h-6 rounded-full bg-emerald-400 text-zinc-950 flex items-center justify-center">
              <Check className="w-4 h-4 stroke-[3]" />
            </div>
          )}

          <div className="flex items-start gap-4">
            {/* Card Icon preview */}
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500/20 to-emerald-500/10 border border-amber-500/30 flex items-center justify-center shrink-0">
              <CreditCard className="w-6 h-6 text-amber-400" />
            </div>

            <div className="space-y-1 text-left">
              <div className="flex items-center gap-2">
                <span className="font-black text-white text-base tracking-wide">BUILDER ID</span>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-zinc-800 text-amber-400">
                  4:5
                </span>
              </div>
              <p className="text-xs text-zinc-300">
                Show the builder behind the build. Features your name, role, and custom title.
              </p>
              <button
                type="button"
                className={`mt-2 text-xs font-mono font-bold px-3 py-1.5 rounded-lg border transition-all ${
                  selectedFormat === 'builder'
                    ? 'bg-amber-400 text-zinc-950 border-amber-400'
                    : 'bg-zinc-800 text-zinc-300 border-zinc-700 hover:bg-zinc-700'
                }`}
              >
                {selectedFormat === 'builder' ? 'Selected Builder ID' : 'Choose Builder ID'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
