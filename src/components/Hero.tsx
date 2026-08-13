import React from 'react';
import { ArrowRight, Sparkles, Compass, ShieldCheck } from 'lucide-react';
import { DEMO_SAMPLES } from '../utils/demoData';

interface HeroProps {
  onStartClick: () => void;
  onSelectDemoSample: (sample: (typeof DEMO_SAMPLES)[0]) => void;
}

export const Hero: React.FC<HeroProps> = ({ onStartClick, onSelectDemoSample }) => {
  return (
    <section className="relative overflow-hidden pt-8 pb-16 px-4 sm:px-8 max-w-7xl mx-auto">
      {/* Background Tropical Glow Orbs */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-gradient-to-tr from-emerald-600/20 via-amber-500/15 to-transparent blur-3xl pointer-events-none rounded-full" />
      <div className="absolute top-1/3 right-10 w-72 h-72 bg-teal-500/10 blur-3xl pointer-events-none rounded-full" />

      {/* Hero Header Text */}
      <div className="text-center max-w-3xl mx-auto space-y-6 relative z-10">
        {/* Top Tag Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-emerald-400 text-xs font-mono tracking-wide shadow-lg shadow-emerald-950/50">
          <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-spin" style={{ animationDuration: '6s' }} />
          <span>OFFICIAL HH GOA 2026 COMMUNITY BADGE GENERATOR</span>
        </div>

        {/* Main Display Headline */}
        <div className="space-y-2">
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight text-white uppercase leading-[0.95]">
            HH GOA <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-amber-400">2026</span>
          </h1>
          <h2 className="text-2xl sm:text-4xl md:text-5xl font-black tracking-tight text-zinc-100 uppercase">
            FRAME YOUR BUILDER ERA.
          </h2>
        </div>

        {/* Supporting Copy */}
        <p className="text-base sm:text-xl text-zinc-300 max-w-2xl mx-auto font-medium leading-relaxed">
          Drop in a photo. Get your HH Goa 2026 builder identity. Download it. Share it on X.
        </p>

        {/* CTAs */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={onStartClick}
            className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-500 to-amber-500 hover:from-emerald-400 hover:to-amber-400 text-zinc-950 font-black text-lg tracking-wide shadow-xl shadow-emerald-500/25 hover:shadow-emerald-500/40 transition-all transform hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-3 cursor-pointer"
          >
            <span>Create My Frame</span>
            <ArrowRight className="w-5 h-5 stroke-[3]" />
          </button>

          <a
            href="#examples"
            className="w-full sm:w-auto px-6 py-4 rounded-xl bg-zinc-900/90 hover:bg-zinc-800 text-zinc-200 border border-zinc-800 hover:border-emerald-500/40 font-semibold text-base transition-all flex items-center justify-center gap-2"
          >
            <Compass className="w-4 h-4 text-emerald-400" />
            <span>See Examples</span>
          </a>
        </div>

        {/* Features micro highlights */}
        <div className="pt-4 flex items-center justify-center gap-6 text-xs font-mono text-zinc-400">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>No Login Required</span>
          </div>
          <div className="w-1 h-1 rounded-full bg-zinc-700" />
          <span>100% Client-Side Privacy</span>
          <div className="w-1 h-1 rounded-full bg-zinc-700 hidden sm:block" />
          <span className="hidden sm:inline">Instant HD PNG Export</span>
        </div>
      </div>

      {/* Examples Showcase Grid */}
      <div id="examples" className="mt-16 relative z-10 pt-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <span>Sample Builder Frames</span>
              <span className="text-xs font-mono text-emerald-400 font-normal px-2 py-0.5 bg-emerald-950/60 border border-emerald-800/60 rounded-full">
                Click to customize
              </span>
            </h3>
            <p className="text-xs text-zinc-400 font-mono">
              Pick a sample to preview how your frame or builder ID card will look
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {DEMO_SAMPLES.map((sample) => (
            <div
              key={sample.id}
              onClick={() => onSelectDemoSample(sample)}
              className="group relative bg-zinc-900/80 border border-zinc-800 hover:border-emerald-500/60 rounded-2xl p-3 transition-all cursor-pointer hover:shadow-xl hover:shadow-emerald-950/40 transform hover:-translate-y-1"
            >
              {/* Sample Card Thumbnail */}
              <div className="aspect-[4/5] rounded-xl overflow-hidden relative bg-zinc-950 mb-3 border border-zinc-800">
                <img
                  src={sample.avatarUrl}
                  alt={sample.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/30 to-transparent opacity-90" />
                
                {/* Overlay details */}
                <div className="absolute top-2 left-2 right-2 flex justify-between items-center text-[10px] font-mono font-bold text-emerald-400 bg-zinc-950/80 backdrop-blur-sm px-2 py-1 rounded-md border border-emerald-500/30">
                  <span>HH GOA 2026</span>
                  <span className="text-amber-400">#FrameInGoa</span>
                </div>

                <div className="absolute bottom-2 left-2 right-2 text-left space-y-0.5">
                  <p className="text-xs font-black text-white truncate">{sample.name}</p>
                  <p className="text-[10px] font-mono text-emerald-400 truncate">{sample.role}</p>
                  <p className="text-[9px] font-black tracking-wider text-amber-300 uppercase truncate bg-zinc-900/90 px-1.5 py-0.5 rounded border border-amber-500/30 inline-block">
                    {sample.title}
                  </p>
                </div>
              </div>

              <div className="text-center">
                <span className="text-xs font-mono font-semibold text-zinc-400 group-hover:text-emerald-400 transition-colors flex items-center justify-center gap-1">
                  <span>Use This Demo</span>
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
