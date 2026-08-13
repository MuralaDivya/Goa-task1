import React, { useEffect, useState } from 'react';
import { Header } from '../components/Header';
import { copyToClipboard, shareToX } from '../utils/share';
import { Download, Share2, Copy, Check, ArrowRight, Loader2, Sparkles } from 'lucide-react';

interface SharePageProps {
  shareId: string;
  onNavigateHome: () => void;
}

interface ShareDetails {
  id: string;
  name: string;
  title: string;
  stack: string;
  format: 'pfp' | 'builder';
  imageUrl: string;
  dataUrl?: string;
}

export const SharePage: React.FC<SharePageProps> = ({ shareId, onNavigateHome }) => {
  const [data, setData] = useState<ShareDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    async function loadShareData() {
      try {
        setLoading(true);
        const res = await fetch(`/api/share-data/${shareId}`);
        if (!res.ok) {
          throw new Error('Share link not found or expired.');
        }
        const json = await res.json();
        setData(json);
      } catch (err: any) {
        setError(err.message || 'Failed to load share graphic.');
      } finally {
        setLoading(false);
      }
    }
    loadShareData();
  }, [shareId]);

  const handleDownload = () => {
    if (!data?.dataUrl && !data?.imageUrl) return;
    const link = document.createElement('a');
    link.download = `hh-goa-2026-${shareId}.png`;
    link.href = data.dataUrl || data.imageUrl;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCopyLink = async () => {
    const success = await copyToClipboard(window.location.href);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    }
  };

  return (
    <div className="min-h-screen bg-[#070a0f] text-white flex flex-col font-sans">
      <Header onResetHome={onNavigateHome} />

      <main className="flex-1 max-w-4xl mx-auto px-4 py-10 w-full flex flex-col items-center justify-center space-y-8">
        {loading ? (
          <div className="py-20 text-center space-y-4">
            <Loader2 className="w-12 h-12 text-emerald-400 animate-spin mx-auto" />
            <p className="text-sm font-mono text-zinc-400">Loading HH Goa 2026 Builder Frame...</p>
          </div>
        ) : error ? (
          <div className="py-16 text-center space-y-6 max-w-md mx-auto">
            <div className="p-6 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-3">
              <p className="text-sm font-mono text-amber-400">{error}</p>
              <p className="text-xs text-zinc-400">
                You can easily generate your own custom HH Goa 2026 builder graphic in seconds!
              </p>
            </div>
            <button
              onClick={onNavigateHome}
              className="px-8 py-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-black text-base uppercase tracking-wider flex items-center justify-center gap-2 mx-auto shadow-xl shadow-emerald-500/20"
            >
              <span>Create Your Own Frame</span>
              <ArrowRight className="w-5 h-5 stroke-[3]" />
            </button>
          </div>
        ) : data ? (
          <div className="w-full max-w-2xl mx-auto space-y-8 text-center animate-in fade-in duration-500">
            {/* Header Tag */}
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-emerald-400 text-xs font-mono font-bold">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>VERIFIED HH GOA 2026 BADGE</span>
              </div>
              <h1 className="text-3xl sm:text-5xl font-black text-white uppercase tracking-tight">
                {data.name}'s Builder Frame
              </h1>
              <p className="text-sm font-mono text-emerald-400">{data.title}</p>
            </div>

            {/* Graphic Image */}
            <div className="max-w-md mx-auto p-4 rounded-3xl bg-zinc-950 border-2 border-emerald-500/40 shadow-2xl">
              <img
                src={data.dataUrl || data.imageUrl}
                alt={`${data.name} HH Goa 2026`}
                className="w-full h-auto rounded-2xl shadow-lg border border-zinc-800"
              />
            </div>

            {/* Actions */}
            <div className="max-w-md mx-auto space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  onClick={handleDownload}
                  className="py-3.5 px-6 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-zinc-950 font-black text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg cursor-pointer"
                >
                  <Download className="w-4 h-4 stroke-[2.5]" />
                  <span>Download PNG</span>
                </button>

                <button
                  onClick={() => shareToX(window.location.href)}
                  className="py-3.5 px-6 rounded-xl bg-black hover:bg-zinc-900 border border-zinc-700 text-white font-black text-sm tracking-wider flex items-center justify-center gap-2 shadow-lg cursor-pointer"
                >
                  <Share2 className="w-4 h-4 text-emerald-400" />
                  <span>Share to 𝕏</span>
                </button>
              </div>

              <button
                onClick={handleCopyLink}
                className="w-full py-3 px-6 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 font-mono text-xs flex items-center justify-center gap-2 cursor-pointer"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span className="text-emerald-400">Link Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 text-zinc-400" />
                    <span>Copy Share Link</span>
                  </>
                )}
              </button>

              {/* CTA to make own */}
              <div className="pt-6">
                <button
                  onClick={onNavigateHome}
                  className="w-full py-4 px-8 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-amber-500 hover:from-emerald-400 hover:to-amber-400 text-zinc-950 font-black text-base uppercase tracking-wider shadow-xl shadow-emerald-500/25 flex items-center justify-center gap-3 cursor-pointer"
                >
                  <span>Frame Your Own Builder Era</span>
                  <ArrowRight className="w-5 h-5 stroke-[3]" />
                </button>
              </div>
            </div>
          </div>
        ) : null}
      </main>
    </div>
  );
};
