import React from 'react';
import { Position } from '../types';
import { ZoomIn, RotateCcw, Move, RotateCw } from 'lucide-react';

interface PhotoEditorProps {
  position: Position;
  onChangePosition: (newPos: Position) => void;
}

export const PhotoEditor: React.FC<PhotoEditorProps> = ({ position, onChangePosition }) => {
  const handleZoomChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChangePosition({
      ...position,
      zoom: parseFloat(e.target.value),
    });
  };

  const handleXChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChangePosition({
      ...position,
      x: parseInt(e.target.value, 10),
    });
  };

  const handleYChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChangePosition({
      ...position,
      y: parseInt(e.target.value, 10),
    });
  };

  const handleRotate = (delta: number) => {
    onChangePosition({
      ...position,
      rotation: (position.rotation + delta) % 360,
    });
  };

  const handleReset = () => {
    onChangePosition({
      x: 0,
      y: 0,
      zoom: 1,
      rotation: 0,
    });
  };

  return (
    <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-4 sm:p-5 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs font-mono font-bold text-emerald-400 uppercase">
          <Move className="w-4 h-4 text-emerald-400" />
          <span>Adjust & Position Photo</span>
        </div>
        <button
          onClick={handleReset}
          className="text-xs font-mono text-zinc-400 hover:text-white flex items-center gap-1.5 px-2.5 py-1 rounded bg-zinc-800/80 hover:bg-zinc-800 transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Zoom Slider */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs font-mono text-zinc-300">
            <span className="flex items-center gap-1">
              <ZoomIn className="w-3.5 h-3.5 text-emerald-400" />
              Zoom Scale
            </span>
            <span className="text-emerald-400 font-bold">{position.zoom.toFixed(1)}x</span>
          </div>
          <input
            type="range"
            min="1.0"
            max="3.0"
            step="0.05"
            value={position.zoom}
            onChange={handleZoomChange}
            className="w-full h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-emerald-400"
          />
        </div>

        {/* Rotation Controls */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs font-mono text-zinc-300">
            <span>Rotate Photo</span>
            <span className="text-emerald-400 font-bold">{position.rotation}°</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleRotate(-90)}
              className="flex-1 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-mono flex items-center justify-center gap-1 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>-90°</span>
            </button>
            <button
              onClick={() => handleRotate(90)}
              className="flex-1 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-mono flex items-center justify-center gap-1 transition-colors"
            >
              <RotateCw className="w-3.5 h-3.5" />
              <span>+90°</span>
            </button>
          </div>
        </div>

        {/* Pan X Offset */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs font-mono text-zinc-300">
            <span>Pan Horizontal</span>
            <span className="text-zinc-400">{position.x}px</span>
          </div>
          <input
            type="range"
            min="-200"
            max="200"
            step="2"
            value={position.x}
            onChange={handleXChange}
            className="w-full h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-emerald-400"
          />
        </div>

        {/* Pan Y Offset */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs font-mono text-zinc-300">
            <span>Pan Vertical</span>
            <span className="text-zinc-400">{position.y}px</span>
          </div>
          <input
            type="range"
            min="-200"
            max="200"
            step="2"
            value={position.y}
            onChange={handleYChange}
            className="w-full h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-emerald-400"
          />
        </div>
      </div>
    </div>
  );
};
