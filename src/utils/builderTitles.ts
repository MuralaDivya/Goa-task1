import { BuilderVibe } from '../types';

export const BUILDER_VIBES: { label: BuilderVibe; emoji: string; description: string }[] = [
  { label: 'AI Explorer', emoji: '🤖', description: 'Agentic AI & Neural Systems' },
  { label: 'Full-Stack Builder', emoji: '⚡', description: 'End-to-End Systems & APIs' },
  { label: 'ML Engineer', emoji: '🧠', description: 'Models, Data & Pipelines' },
  { label: 'Product Hacker', emoji: '🎯', description: '0 to 1 Products & UX' },
  { label: 'Creative Coder', emoji: '🎨', description: 'Shaders, WebGL & Generative Art' },
  { label: 'Data Wizard', emoji: '📊', description: 'Vectors, Analytics & Insights' },
  { label: 'Open Source Builder', emoji: '🌐', description: 'Public Repos & Community Code' },
  { label: 'Startup Hacker', emoji: '🚀', description: 'Rapid Prototypes & Pitch Decks' },
];

export const TITLES_BY_VIBE: Record<BuilderVibe, string[]> = {
  'AI Explorer': [
    'The AI Alchemist',
    'Neural Navigator',
    'Prompt Whisperer',
    'Agentic Architect',
    'LLM Sorcerer',
    'Context Window Wizard',
    'Transformer Tinkerer',
    'Silicon Mind Sculptor',
  ],
  'Full-Stack Builder': [
    'The Full-Stack Wizard',
    'The Code Shipper',
    'API Acrobat',
    'Stack Overflow Slayer',
    'Monolith Dismantler',
    'Deploy-on-Friday Hero',
    'Async Architect',
    'Zero-Downtime Ninja',
  ],
  'ML Engineer': [
    'The Data Whisperer',
    'Tensor Titan',
    'Loss Function Luminary',
    'Model Shaper',
    'Gradient Descent Guru',
    'Hyperparameter Hunter',
    'Embedding Explorer',
    'Inference Accelerator',
  ],
  'Product Hacker': [
    'The Product Hacker',
    'Feature Foundry',
    'User Delight Architect',
    'Minimum Viable Monarch',
    'UX Catalyst',
    'Feedback Loop Specialist',
    'Metric Overlord',
    'Figma to Production Sprinter',
  ],
  'Creative Coder': [
    'The Pixel Hacker',
    'Shader Sorcerer',
    'Canvas Craftsman',
    'Generative Genius',
    'Vector Visionary',
    'Frame Rate Fundamentalist',
    'WebGL Whisperer',
    'Interactive Illuminator',
  ],
  'Data Wizard': [
    'The Data Whisperer',
    'Pipeline Prophet',
    'Vector Voyager',
    'SQL Spellcaster',
    'Latency Obliterator',
    'ETL Evangelist',
    'Query Queen',
    'Database Dynamo',
  ],
  'Open Source Builder': [
    'The Open Source Nomad',
    'PR Powerhouse',
    'Git Mastermind',
    'Bounty Hunter',
    'License Liberator',
    'Fork & Disrupt Specialist',
    'Maintainer Supreme',
    'Community Catalyst',
  ],
  'Startup Hacker': [
    'The Prototype Pirate',
    'The Build & Break Specialist',
    'Blitzscaling Baron',
    'Growth Engine',
    'Hackathon Heavyweight',
    'Weekend MVP Warrior',
    'Pivot Pioneer',
    'Venture Catalyst',
  ],
};

export const UNIVERSAL_TITLES = [
  'The AI Alchemist',
  'The Pixel Hacker',
  'The Data Whisperer',
  'The Code Shipper',
  'The Product Hacker',
  'The Machine Tinkerer',
  'The Full-Stack Wizard',
  'The Open Source Nomad',
  'The Prototype Pirate',
  'The Build & Break Specialist',
  'Goa Build Leader',
  'Hack Era Legend',
];

/**
 * Generate title deterministically or pick a random one for a given vibe
 */
export function generateBuilderTitle(name: string, stack: string, vibe: BuilderVibe): string {
  const pool = TITLES_BY_VIBE[vibe] || UNIVERSAL_TITLES;
  
  // Use a simple hash of name + stack to pick consistent title, or pick first
  if (!name && !stack) {
    return pool[0];
  }

  let hash = 0;
  const str = `${name.trim().toLowerCase()}-${stack.trim().toLowerCase()}-${vibe}`;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  const index = Math.abs(hash) % pool.length;
  return pool[index];
}

/**
 * Get a random title for a vibe different from current
 */
export function getRandomTitleForVibe(vibe: BuilderVibe, currentTitle?: string): string {
  const pool = TITLES_BY_VIBE[vibe] || UNIVERSAL_TITLES;
  const available = pool.filter((t) => t !== currentTitle);
  if (available.length === 0) return pool[0];
  const randomIndex = Math.floor(Math.random() * available.length);
  return available[randomIndex];
}
