import React from 'react';
import { BuilderFormData, BuilderVibe, FrameOptions, FrameTheme } from '../types';
import { BUILDER_VIBES, getRandomTitleForVibe } from '../utils/builderTitles';
import { RefreshCw, Palette, User, Briefcase, Sparkles } from 'lucide-react';

interface BuilderFormProps {
  formData: BuilderFormData;
  onChangeForm: (newForm: BuilderFormData) => void;
  options: FrameOptions;
  onChangeOptions: (newOpts: FrameOptions) => void;
}

const THEME_OPTIONS: { id: FrameTheme; label: string; bg: string; border: string }[] = [
  { id: 'sunset', label: 'Goa Sunset', bg: 'bg-orange-500', border: 'border-orange-500' },
  { id: 'neon', label: 'Cyber Neon', bg: 'bg-emerald-400', border: 'border-emerald-400' },
  { id: 'ocean', label: 'Ocean Wave', bg: 'bg-cyan-400', border: 'border-cyan-400' },
  { id: 'golden', label: 'Golden Hour', bg: 'bg-amber-400', border: 'border-amber-400' },
  { id: 'terminal', label: 'Matrix Terminal', bg: 'bg-green-500', border: 'border-green-500' },
];

export const BuilderForm: React.FC<BuilderFormProps> = ({
  formData,
  onChangeForm,
  options,
  onChangeOptions,
}) => {
  const handleVibeSelect = (vibe: BuilderVibe) => {
    const newTitle = getRandomTitleForVibe(vibe);
    onChangeForm({
      ...formData,
      vibe,
      title: newTitle,
    });
  };

  const handleRerollTitle = () => {
    const newTitle = getRandomTitleForVibe(formData.vibe, formData.title);
    onChangeForm({
      ...formData,
      title: newTitle,
    });
  };

  return (
    <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-5 space-y-5">
      {/* Name and Stack/Role */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Name input */}
        <div className="space-y-1.5">
          <label className="text-xs font-mono font-bold text-zinc-300 uppercase flex items-center gap-1.5">
            <User className="w-3.5 h-3.5 text-emerald-400" />
            <span>Builder Name</span>
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => onChangeForm({ ...formData, name: e.target.value })}
            placeholder="e.g. Divya"
            maxLength={20}
            className="w-full bg-zinc-950 border border-zinc-800 focus:border-emerald-400 rounded-xl px-3.5 py-2.5 text-sm text-white font-bold placeholder:text-zinc-600 focus:outline-none transition-colors"
          />
        </div>

        {/* Stack / Role input */}
        <div className="space-y-1.5">
          <label className="text-xs font-mono font-bold text-zinc-300 uppercase flex items-center gap-1.5">
            <Briefcase className="w-3.5 h-3.5 text-amber-400" />
            <span>Stack / Role</span>
          </label>
          <input
            type="text"
            value={formData.stack}
            onChange={(e) => onChangeForm({ ...formData, stack: e.target.value })}
            placeholder="e.g. AI/ML Builder"
            maxLength={26}
            className="w-full bg-zinc-950 border border-zinc-800 focus:border-amber-400 rounded-xl px-3.5 py-2.5 text-sm text-white font-semibold placeholder:text-zinc-600 focus:outline-none transition-colors"
          />
        </div>
      </div>

      {/* Builder Vibe Chips */}
      <div className="space-y-2">
        <label className="text-xs font-mono font-bold text-zinc-300 uppercase flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
          <span>Select Your Builder Vibe</span>
        </label>
        <div className="flex flex-wrap gap-2">
          {BUILDER_VIBES.map((v) => (
            <button
              key={v.label}
              type="button"
              onClick={() => handleVibeSelect(v.label)}
              className={`px-3 py-1.5 rounded-xl text-xs font-mono font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                formData.vibe === v.label
                  ? 'bg-emerald-400 text-zinc-950 shadow-md shadow-emerald-500/20 font-bold scale-105'
                  : 'bg-zinc-950 text-zinc-300 border border-zinc-800 hover:border-zinc-700 hover:bg-zinc-800'
              }`}
            >
              <span>{v.emoji}</span>
              <span>{v.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Generated Title & Custom Override */}
      <div className="space-y-1.5 bg-zinc-950 p-4 rounded-xl border border-zinc-800">
        <div className="flex items-center justify-between">
          <label className="text-xs font-mono font-bold text-amber-400 uppercase tracking-wider">
            Generated Builder Title
          </label>
          <button
            type="button"
            onClick={handleRerollTitle}
            className="text-xs font-mono text-emerald-400 hover:text-emerald-300 flex items-center gap-1 px-2.5 py-1 rounded bg-zinc-900 border border-emerald-500/30 hover:border-emerald-400 transition-all cursor-pointer"
          >
            <RefreshCw className="w-3 h-3 animate-spin" style={{ animationDuration: '10s' }} />
            <span>Reroll Title</span>
          </button>
        </div>

        <input
          type="text"
          value={formData.title}
          onChange={(e) => onChangeForm({ ...formData, title: e.target.value })}
          placeholder="e.g. THE AI ALCHEMIST"
          maxLength={30}
          className="w-full bg-zinc-900 border border-amber-500/40 text-amber-300 font-black text-base uppercase px-3.5 py-2 rounded-lg tracking-wider focus:outline-none focus:border-amber-400"
        />
        <p className="text-[11px] font-mono text-zinc-300">
          Auto-generated for your vibe. Feel free to edit or click Reroll Title!
        </p>
      </div>

      {/* Frame Palette Theme Selector */}
      <div className="space-y-2">
        <label className="text-xs font-mono font-bold text-zinc-300 uppercase flex items-center gap-1.5">
          <Palette className="w-3.5 h-3.5 text-teal-400" />
          <span>Aesthetic Color Palette</span>
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
          {THEME_OPTIONS.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => onChangeOptions({ ...options, theme: t.id })}
              className={`p-2 rounded-xl text-xs font-mono text-center border transition-all flex items-center gap-2 cursor-pointer ${
                options.theme === t.id
                  ? 'bg-zinc-800 text-white font-bold border-emerald-400 ring-1 ring-emerald-400'
                  : 'bg-zinc-950 text-zinc-400 border-zinc-800 hover:border-zinc-700'
              }`}
            >
              <div className={`w-3 h-3 rounded-full ${t.bg} shrink-0`} />
              <span className="truncate">{t.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
