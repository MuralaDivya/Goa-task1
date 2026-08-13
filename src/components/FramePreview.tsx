import React, { useEffect, useRef, useState } from 'react';
import { BuilderFormData, FormatType, FrameOptions, Position } from '../types';
import { renderFrameCanvas } from '../utils/canvasRenderer';
import { Sparkles } from 'lucide-react';

interface FramePreviewProps {
  userImage: HTMLImageElement | null;
  position: Position;
  format: FormatType;
  formData: BuilderFormData;
  options: FrameOptions;
  onCanvasReady?: (canvas: HTMLCanvasElement) => void;
}

export const FramePreview: React.FC<FramePreviewProps> = ({
  userImage,
  position,
  format,
  formData,
  options,
  onCanvasReady,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isRendering, setIsRendering] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    setIsRendering(true);

    // Render asynchronously with requestAnimationFrame for smooth interaction
    const handle = requestAnimationFrame(async () => {
      await renderFrameCanvas(canvas, {
        userImage,
        position,
        format,
        formData,
        options,
      });

      if (onCanvasReady) {
        onCanvasReady(canvas);
      }
      setIsRendering(false);
    });

    return () => cancelAnimationFrame(handle);
  }, [userImage, position, format, formData, options, onCanvasReady]);

  const isPfp = format === 'pfp';

  return (
    <div className="w-full flex flex-col items-center justify-center space-y-3">
      <div className="flex items-center justify-between w-full max-w-md px-1 text-xs font-mono">
        <span className="text-emerald-400 font-bold flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>Live Preview ({isPfp ? '1080×1080 Square PFP' : '1080×1350 Builder Card'})</span>
        </span>
        <span className="text-zinc-500">Auto-Rendering</span>
      </div>

      {/* Frame Preview Container */}
      <div className="relative w-full max-w-md aspect-square sm:aspect-auto rounded-3xl p-3 bg-zinc-900/80 border border-zinc-800 shadow-2xl shadow-emerald-950/40 overflow-hidden flex items-center justify-center">
        {/* Render Canvas */}
        <canvas
          ref={canvasRef}
          className="w-full h-auto rounded-2xl shadow-inner max-h-[520px] object-contain bg-zinc-950"
        />

        {isRendering && (
          <div className="absolute inset-0 bg-zinc-950/40 backdrop-blur-[1px] flex items-center justify-center rounded-2xl">
            <div className="px-3 py-1.5 rounded-full bg-zinc-900/90 text-emerald-400 text-xs font-mono border border-emerald-500/30">
              Rendering...
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
