import React, { useRef, useState } from 'react';
import { Header } from '../components/Header';
import { Hero } from '../components/Hero';
import { UploadZone } from '../components/UploadZone';
import { FormatSelector } from '../components/FormatSelector';
import { PhotoEditor } from '../components/PhotoEditor';
import { BuilderForm } from '../components/BuilderForm';
import { FramePreview } from '../components/FramePreview';
import { ResultScreen } from '../components/ResultScreen';
import { BuilderFormData, FormatType, FrameOptions, Position } from '../types';
import { DEFAULT_BUILDER_FORM, DEFAULT_POSITION, DEMO_SAMPLES } from '../utils/demoData';
import { ImageProcessResult, loadImageFromUrl } from '../utils/imageProcessing';
import { generateBuilderTitle } from '../utils/builderTitles';
import { Sparkles, ArrowRight, CheckCircle2, RotateCcw } from 'lucide-react';

export const Home: React.FC = () => {
  // Navigation & Flow state
  const [currentStep, setCurrentStep] = useState<'landing' | 'editor' | 'result'>('landing');

  // Image & Position state
  const [userImage, setUserImage] = useState<HTMLImageElement | null>(null);
  const [position, setPosition] = useState<Position>(DEFAULT_POSITION);

  // Format state
  const [format, setFormat] = useState<FormatType>('builder');

  // Form Data state
  const [formData, setFormData] = useState<BuilderFormData>(DEFAULT_BUILDER_FORM);

  // Options state
  const [options, setOptions] = useState<FrameOptions>({
    theme: 'sunset',
    showCoordinates: true,
    showGrid: true,
  });

  // Rendered Canvas ref for result screen
  const [currentCanvas, setCurrentCanvas] = useState<HTMLCanvasElement | null>(null);

  const editorSectionRef = useRef<HTMLDivElement | null>(null);

  const scrollToEditor = () => {
    setTimeout(() => {
      editorSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  const handleStartFromHero = () => {
    setCurrentStep('editor');
    scrollToEditor();
  };

  // User selects a sample from hero grid
  const handleSelectDemoSample = async (sample: (typeof DEMO_SAMPLES)[0]) => {
    try {
      const img = await loadImageFromUrl(sample.avatarUrl);
      setUserImage(img);
      setFormData({
        name: sample.name,
        stack: sample.role,
        vibe: sample.vibe,
        title: sample.title,
      });
      setPosition(DEFAULT_POSITION);
      setCurrentStep('editor');
      scrollToEditor();
    } catch (err) {
      console.error('Failed to load demo image:', err);
    }
  };

  // User uploads a photo
  const handlePhotoLoaded = (result: ImageProcessResult) => {
    setUserImage(result.image);
    setPosition(DEFAULT_POSITION);
    setCurrentStep('editor');
    scrollToEditor();
  };

  // Auto-generate title if name/stack/vibe changes
  const handleFormChange = (newForm: BuilderFormData) => {
    setFormData(newForm);
  };

  const handleGenerateClick = () => {
    if (!formData.name) {
      setFormData({ ...formData, name: 'Divya' });
    }
    setCurrentStep('result');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleReset = () => {
    setUserImage(null);
    setPosition(DEFAULT_POSITION);
    setFormData(DEFAULT_BUILDER_FORM);
    setCurrentStep('landing');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#070a0f] text-white flex flex-col font-sans selection:bg-emerald-500 selection:text-zinc-950">
      <Header onResetHome={currentStep !== 'landing' ? handleReset : undefined} />

      <main className="flex-1 w-full pb-20">
        {/* LANDING & EDITOR FLOW */}
        {currentStep === 'landing' && (
          <Hero
            onStartClick={handleStartFromHero}
            onSelectDemoSample={handleSelectDemoSample}
          />
        )}

        {/* WORKSPACE & EDITOR */}
        <div ref={editorSectionRef} className="max-w-6xl mx-auto px-4 pt-4 sm:pt-8 space-y-8">
          {currentStep === 'result' ? (
            <ResultScreen
              canvas={currentCanvas}
              formData={formData}
              format={format}
              onMakeAnother={() => setCurrentStep('editor')}
            />
          ) : (
            <div className="space-y-8">
              {/* Step indicator header */}
              <div className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-emerald-500 text-zinc-950 font-black flex items-center justify-center text-sm shadow-md">
                    1
                  </div>
                  <div>
                    <h2 className="text-sm font-black text-white uppercase tracking-wider">
                      Upload & Customize
                    </h2>
                    <p className="text-xs font-mono text-zinc-400">
                      Upload photo • Choose format • Fine-tune details
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs font-mono">
                  <span className="text-emerald-400 font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    Live Canvas Engine Ready
                  </span>
                </div>
              </div>

              {/* Main Grid: Left Controls | Right Live Canvas Preview */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                {/* LEFT COLUMN: Upload, Format, Inputs */}
                <div className="lg:col-span-7 space-y-6">
                  {/* Step A: Upload Zone */}
                  <UploadZone
                    onPhotoLoaded={handlePhotoLoaded}
                    currentImageLoaded={!!userImage}
                  />

                  {/* Step B: Format Selector */}
                  <FormatSelector
                    selectedFormat={format}
                    onSelectFormat={(f) => setFormat(f)}
                  />

                  {/* Step C: Photo Repositioning Controls */}
                  {userImage && (
                    <PhotoEditor
                      position={position}
                      onChangePosition={(p) => setPosition(p)}
                    />
                  )}

                  {/* Step D: Builder Details (if Builder ID card format) */}
                  {format === 'builder' && (
                    <BuilderForm
                      formData={formData}
                      onChangeForm={handleFormChange}
                      options={options}
                      onChangeOptions={(o) => setOptions(o)}
                    />
                  )}

                  {/* Generate Button CTA */}
                  <div className="pt-2">
                    <button
                      onClick={handleGenerateClick}
                      className="w-full py-4 px-8 rounded-2xl bg-gradient-to-r from-emerald-400 via-teal-400 to-amber-400 hover:from-emerald-300 hover:to-amber-300 text-zinc-950 font-black text-lg uppercase tracking-wider shadow-2xl shadow-emerald-500/30 hover:shadow-emerald-500/50 transition-all transform hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-3 cursor-pointer"
                    >
                      <Sparkles className="w-5 h-5 text-zinc-950 fill-zinc-950" />
                      <span>Generate My HH Goa 2026 Graphic</span>
                      <ArrowRight className="w-5 h-5 stroke-[3]" />
                    </button>
                  </div>
                </div>

                {/* RIGHT COLUMN: Sticky Live Frame Preview */}
                <div className="lg:col-span-5 lg:sticky lg:top-20 space-y-4">
                  <FramePreview
                    userImage={userImage}
                    position={position}
                    format={format}
                    formData={formData}
                    options={options}
                    onCanvasReady={(c) => setCurrentCanvas(c)}
                  />

                  {/* Quick Tip note */}
                  <div className="p-3.5 rounded-xl bg-zinc-950/80 border border-zinc-800 text-center space-y-1">
                    <p className="text-xs font-mono text-zinc-400">
                      ✨ Tip: Your photo is auto-centered with smart cropping. Use the Zoom & Pan sliders to adjust your face framing.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Minimal Footer */}
      <footer className="border-t border-zinc-900 bg-zinc-950/80 py-6 px-4 text-center text-xs font-mono text-zinc-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>HH GOA 2026 — Frame In Goa • Official Builder Badge Experience</p>
          <div className="flex items-center gap-3 text-zinc-400">
            <span>#FrameInGoa</span>
            <span>•</span>
            <span>Goa, India</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
