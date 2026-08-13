import { BuilderFormData, Position } from '../types';

export interface DemoSample {
  id: string;
  name: string;
  role: string;
  title: string;
  vibe: any;
  avatarUrl: string;
}

// Crisp, high quality Unsplash portraits for demo previews
export const DEMO_SAMPLES: DemoSample[] = [
  {
    id: 'demo-1',
    name: 'Divya',
    role: 'AI / ML Builder',
    title: 'THE AI ALCHEMIST',
    vibe: 'AI Explorer',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: 'demo-2',
    name: 'Arjun Mehta',
    role: 'Full-Stack Developer',
    title: 'THE CODE SHIPPER',
    vibe: 'Full-Stack Builder',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: 'demo-3',
    name: 'Zara Chen',
    role: 'Creative Technologist',
    title: 'THE PIXEL HACKER',
    vibe: 'Creative Coder',
    avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: 'demo-4',
    name: 'Kabir Verma',
    role: 'Open Source Contributor',
    title: 'THE OPEN SOURCE NOMAD',
    vibe: 'Open Source Builder',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=800&auto=format&fit=crop',
  },
];

export const DEFAULT_BUILDER_FORM: BuilderFormData = {
  name: 'Divya',
  stack: 'AI / ML Builder',
  vibe: 'AI Explorer',
  title: 'THE AI ALCHEMIST',
};

export const DEFAULT_POSITION: Position = {
  x: 0,
  y: 0,
  zoom: 1,
  rotation: 0,
};
