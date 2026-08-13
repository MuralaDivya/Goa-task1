export type FormatType = 'pfp' | 'builder';

export type BuilderVibe =
  | 'AI Explorer'
  | 'Full-Stack Builder'
  | 'ML Engineer'
  | 'Product Hacker'
  | 'Creative Coder'
  | 'Data Wizard'
  | 'Open Source Builder'
  | 'Startup Hacker';

export type FrameTheme = 'sunset' | 'neon' | 'ocean' | 'golden' | 'terminal';

export interface Position {
  x: number;
  y: number;
  zoom: number;
  rotation: number;
}

export interface BuilderFormData {
  name: string;
  stack: string;
  vibe: BuilderVibe;
  title: string;
}

export interface FrameOptions {
  theme: FrameTheme;
  showCoordinates: boolean;
  showGrid: boolean;
  customBadgeText?: string;
}

export interface ShareData {
  id: string;
  shareUrl: string;
  imageUrl: string;
  name?: string;
  title?: string;
  stack?: string;
  format: FormatType;
  dataUrl?: string;
}
