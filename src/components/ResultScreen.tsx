import React, { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import { BuilderFormData, FormatType } from '../types';
import { copyToClipboard, downloadCanvasImage, shareToX, uploadShareImage } from '../utils/share';
import { Download, Share2, Copy, Check, RotateCcw, Sparkles, Loader2 } from 'lucide-react';

interface ResultScreenProps {
  canvas: HTMLCanvasElement | null;
  formData: BuilderFormData;
  format: FormatType;
  onMakeAnother: () => void;
}

export const ResultScreen: React.FC<ResultScreenProps> = ({
  canvas,
  formData,
  format,
  onMakeAnother,
}) => {
  const [dataUrl, setDataUrl] = useState<string | null>(null);
  const [shareUrl, setShareUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // Fire confetti celebration on result screen mount
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#00ff88', '#ff5722', '#ffc107', '#00e5ff', '#ffffff'],
    });

    if (canvas) {
      setDataUrl(canvas.toDataURL('image/png', 0.95));
      // Trigger background upload for share link
      handlePrepareShare(canvas);
    }
  }, [canvas]);

  const handlePrepareShare = async (c: HTMLCanvasElement) => {
    setIsUploading(true);
    try {
      const res = await uploadShareImage(c, formData, format);
      setShareUrl(res.shareUrl);
    } catch (err) {
      console.warn('Share URL generation error:', err);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDownload = () => {
    if (!canvas) return;
    const cleanName = (formData.name || 'builder').toLowerCase().replace(/[^a-z0-9]/g, '-');
    const filename =
      format === 'pfp' ? `hh-goa-2026-pfp.png` : `hh-goa-2026-${cleanName}.png`;
    downloadCanvasImage(canvas, filename);
  };

  const handleShareToX = () => {
    shareToX(shareUrl || undefined);
  };

  const handleCopyLink = async () => {
    let urlToCopy = shareUrl;
    if (!urlToCopy && canvas) {
      setIsUploading(true);
      try {
        const res = await uploadShareImage(canvas, formData, format);
        urlToCopy = res.shareUrl;
        setShareUrl(res.shareUrl);
      } catch (err) {
        console.error(err);
      } finally {
        setIsUploading(false);
      }
    }

    if (urlToCopy) {
      const success = await copyToClipboard(urlToCopy);
      if (success) {
        setCopied(true);
        setTimeout(() => setCopied(false), 3000);
      }
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto space-y-8 animate-in fade-in duration-500">
      {/* Header Badge */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-emerald-400 text-xs font-mono font-bold tracking-wide shadow-lg">
          <Sparkles className="w-4 h-4 text-amber-400 animate-spin" style={{ animationDuration: '4s' }} />
          <span>#FrameInGoa VERIFIED BADGE</span>
        </div>
        <h2 className="text-3xl sm:text-5xl font-black text-white uppercase tracking-tight">
          YOUR BUILDER FRAME IS READY!
        </h2>
        <p className="text-sm font-mono text-zinc-300 max-w-md mx-auto">
          Download your high-resolution PNG or share directly to X to flex your HH Goa 2026 era.
        </p>
      </div>

      {/* Generated Graphic Display */}
      <div className="relative mx-auto max-w-md bg-zinc-950 p-4 rounded-3xl border-2 border-emerald-500/40 shadow-2xl shadow-emerald-950/60 flex flex-col items-center">
        {dataUrl ? (
          <img
            src={dataUrl}
            alt="HH Goa 2026 Generated Frame"
            className="w-full h-auto rounded-2xl shadow-lg border border-zinc-800"
          />
        ) : (
          <div className="w-full aspect-square bg-zinc-900 rounded-2xl flex items-center justify-center">
            <Loader2 className="w-8 h-8 text-emerald-400 animate-spin" />
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="max-w-md mx-auto space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Download PNG Button */}
          <button
            onClick={handleDownload}
            className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-emerald-400 via-teal-400 to-emerald-500 hover:from-emerald-300 hover:to-teal-300 text-zinc-950 font-black text-base uppercase tracking-wider transition-all shadow-xl shadow-emerald-500/25 hover:shadow-emerald-500/40 flex items-center justify-center gap-2.5 cursor-pointer transform hover:-translate-y-0.5 active:translate-y-0"
          >
            <Download className="w-5 h-5 stroke-[2.5]" />
            <span>Download PNG</span>
          </button>

          {/* Share to X Button */}
          <button
            onClick={handleShareToX}
            className="w-full py-4 px-6 rounded-2xl bg-black hover:bg-zinc-900 border-2 border-zinc-700 hover:border-emerald-400 text-white font-black text-base tracking-wider transition-all shadow-xl flex items-center justify-center gap-2.5 cursor-pointer transform hover:-translate-y-0.5 active:translate-y-0"
          >
            <Share2 className="w-5 h-5 text-emerald-400" />
            <span>Share to 𝕏</span>
          </button>
        </div>

        {/* Copy Share Link Button */}
        <button
          onClick={handleCopyLink}
          disabled={isUploading}
          className="w-full py-3.5 px-6 rounded-xl bg-zinc-900/90 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 text-zinc-200 font-mono text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          {isUploading ? (
            <>
              <Loader2 className="w-4 h-4 text-emerald-400 animate-spin" />
              <span>Generating Share Link...</span>
            </>
          ) : copied ? (
            <>
              <Check className="w-4 h-4 text-emerald-400 stroke-[3]" />
              <span className="text-emerald-400">Share Link Copied to Clipboard!</span>
            </>
          ) : (
            <>
              <Copy className="w-4 h-4 text-zinc-400" />
              <span>Copy Public Share Link</span>
            </>
          )}
        </button>

        {/* Start Over / Make Another Button */}
        <div className="pt-2 text-center">
          <button
            onClick={onMakeAnother}
            className="text-xs font-mono text-zinc-400 hover:text-white inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Make Another Graphic</span>
          </button>
        </div>
      </div>
    </div>
  );
};
