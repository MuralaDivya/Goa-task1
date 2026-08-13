import React, { useRef, useState } from 'react';
import { Upload, Image as ImageIcon, AlertCircle, Loader2, Sparkles } from 'lucide-react';
import { ImageProcessResult, processUploadedFile } from '../utils/imageProcessing';

interface UploadZoneProps {
  onPhotoLoaded: (result: ImageProcessResult, file?: File) => void;
  currentImageLoaded?: boolean;
}

export const UploadZone: React.FC<UploadZoneProps> = ({ onPhotoLoaded, currentImageLoaded }) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleFile = async (file: File) => {
    setErrorMessage(null);

    // Size check (max 25MB)
    if (file.size > 25 * 1024 * 1024) {
      setErrorMessage('That photo is too large. Please select an image under 25MB.');
      return;
    }

    setIsProcessing(true);
    try {
      const result = await processUploadedFile(file);
      onPhotoLoaded(result, file);
    } catch (err: any) {
      console.error('File processing error:', err);
      setErrorMessage(
        err.message || "That image format isn't supported. Try a JPG, PNG, or HEIC photo."
      );
    } finally {
      setIsProcessing(false);
    }
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const onDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFile(e.target.files[0]);
    }
  };

  return (
    <div className="w-full space-y-4">
      <div
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`relative group rounded-3xl p-8 sm:p-12 text-center transition-all cursor-pointer border-2 border-dashed ${
          isDragging
            ? 'border-emerald-400 bg-emerald-950/40 scale-[1.01]'
            : currentImageLoaded
            ? 'border-emerald-500/40 bg-zinc-900/60 hover:border-emerald-400 hover:bg-zinc-900/90'
            : 'border-zinc-800 bg-zinc-900/40 hover:border-emerald-500/50 hover:bg-zinc-900/80'
        } shadow-2xl backdrop-blur-sm`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/heic,image/heif,image/webp"
          onChange={onInputChange}
          className="hidden"
        />

        {isProcessing ? (
          <div className="py-8 space-y-4 flex flex-col items-center justify-center">
            <Loader2 className="w-12 h-12 text-emerald-400 animate-spin" />
            <p className="text-sm font-mono text-emerald-300 font-semibold">
              Processing photo & converting HEIC if needed...
            </p>
          </div>
        ) : (
          <div className="space-y-4 max-w-sm mx-auto">
            {/* Upload Icon Badge */}
            <div className="w-20 h-20 mx-auto rounded-3xl bg-gradient-to-br from-emerald-500/20 via-teal-500/10 to-amber-500/20 border border-emerald-500/30 flex items-center justify-center group-hover:scale-110 group-hover:border-emerald-400 transition-all shadow-lg shadow-emerald-950/50">
              {currentImageLoaded ? (
                <ImageIcon className="w-10 h-10 text-emerald-400" />
              ) : (
                <Upload className="w-10 h-10 text-emerald-400 group-hover:animate-bounce" />
              )}
            </div>

            <div>
              <h3 className="text-xl font-black text-white uppercase tracking-wide">
                {currentImageLoaded ? 'CHANGE YOUR PHOTO' : 'DROP YOUR PHOTO HERE'}
              </h3>
              <p className="text-xs font-mono text-zinc-400 mt-1">
                JPG • PNG • HEIC • WEBP (Auto-cropped & centered)
              </p>
            </div>

            {/* Choose Photo Button */}
            <div className="pt-2">
              <button
                type="button"
                className="px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-black text-sm tracking-wider uppercase transition-all shadow-lg shadow-emerald-500/20 group-hover:shadow-emerald-500/40 flex items-center justify-center gap-2 mx-auto cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-zinc-950" />
                <span>{currentImageLoaded ? 'Select New Image' : 'Choose Photo'}</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Error alert message */}
      {errorMessage && (
        <div className="p-4 rounded-xl bg-red-950/80 border border-red-500/50 text-red-300 text-xs font-mono flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}
    </div>
  );
};
