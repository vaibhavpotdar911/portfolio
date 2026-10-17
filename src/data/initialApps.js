export const INITIAL_APPS = [
  {
    id: 'app-1',
    title: 'Nexus Workflow AI',
    description: 'Autonomous multi-agent orchestration platform for automated system telemetry and prompt workflows.',
    url: 'https://nexus-ai.dev',
    githubUrl: 'https://github.com/vaibhavpotdar',
    category: 'AI & Agents',
    status: 'Live',
    accentColor: 'blue',
    pinned: true,
    launchedAt: '2026',
    metrics: '99.9% Uptime · Multi-tenant'
  },
  {
    id: 'app-2',
    title: 'Pulse Telemetry Engine',
    description: 'High-throughput real-time metrics aggregator and visual dashboard for distributed microservices.',
    url: 'https://pulse-telemetry.io',
    githubUrl: 'https://github.com/vaibhavpotdar',
    category: 'SaaS & Web',
    status: 'Live',
    accentColor: 'purple',
    pinned: true,
    launchedAt: '2025',
    metrics: 'Sub-millisecond latency'
  },
  {
    id: 'app-3',
    title: 'OmniFlow CLI & API Hub',
    description: 'Developer workspace assistant with instant scaffolding, hot-reloading hooks, and API mock servers.',
    url: 'https://omniflow.dev',
    githubUrl: 'https://github.com/vaibhavpotdar',
    category: 'Dev Tools & APIs',
    status: 'Active',
    accentColor: 'cyan',
    pinned: false,
    launchedAt: '2026',
    metrics: 'CLI + Web GUI'
  },
  {
    id: 'app-4',
    title: 'CloudVault Cryptography Tool',
    description: 'Zero-knowledge browser-based file encryption utility with ephemeral sharing keys.',
    url: 'https://cloudvault.run',
    githubUrl: 'https://github.com/vaibhavpotdar',
    category: 'Utilities',
    status: 'Live',
    accentColor: 'emerald',
    pinned: false,
    launchedAt: '2025',
    metrics: 'Client-side AES-256'
  },
  {
    id: 'app-5',
    title: 'Aura Design System Explorer',
    description: 'Interactive component token laboratory and animated layout playground for modern web interfaces.',
    url: 'https://aura-design.studio',
    githubUrl: 'https://github.com/vaibhavpotdar',
    category: 'SaaS & Web',
    status: 'Beta',
    accentColor: 'rose',
    pinned: false,
    launchedAt: '2026',
    metrics: 'Figma to Code token sync'
  },
  {
    id: 'app-6',
    title: 'Synapse Knowledge Graph',
    description: 'Visual vector database explorer and relational concept mapper with semantic search.',
    url: 'https://synapse-graph.tech',
    githubUrl: 'https://github.com/vaibhavpotdar',
    category: 'AI & Agents',
    status: 'Active',
    accentColor: 'amber',
    pinned: false,
    launchedAt: '2026',
    metrics: 'Vector Search · RAG'
  }
];

export const CATEGORIES = [
  'All Apps',
  'AI & Agents',
  'SaaS & Web',
  'Dev Tools & APIs',
  'Utilities'
];

export const COLOR_VARIANTS = {
  blue: {
    bgGlow: 'from-blue-500/5 via-blue-500/2 to-transparent',
    badge: 'bg-blue-50 text-blue-700 border-blue-200/80',
    border: 'hover:border-blue-400/80',
    btn: 'bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-600/20',
    accent: '#2563eb'
  },
  purple: {
    bgGlow: 'from-purple-500/5 via-purple-500/2 to-transparent',
    badge: 'bg-purple-50 text-purple-700 border-purple-200/80',
    border: 'hover:border-purple-400/80',
    btn: 'bg-purple-600 hover:bg-purple-700 text-white shadow-md shadow-purple-600/20',
    accent: '#9333ea'
  },
  emerald: {
    bgGlow: 'from-emerald-500/5 via-emerald-500/2 to-transparent',
    badge: 'bg-emerald-50 text-emerald-700 border-emerald-200/80',
    border: 'hover:border-emerald-400/80',
    btn: 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-600/20',
    accent: '#059669'
  },
  cyan: {
    bgGlow: 'from-cyan-500/5 via-cyan-500/2 to-transparent',
    badge: 'bg-cyan-50 text-cyan-700 border-cyan-200/80',
    border: 'hover:border-cyan-400/80',
    btn: 'bg-cyan-600 hover:bg-cyan-700 text-white shadow-md shadow-cyan-600/20',
    accent: '#0891b2'
  },
  rose: {
    bgGlow: 'from-rose-500/5 via-rose-500/2 to-transparent',
    badge: 'bg-rose-50 text-rose-700 border-rose-200/80',
    border: 'hover:border-rose-400/80',
    btn: 'bg-rose-600 hover:bg-rose-700 text-white shadow-md shadow-rose-600/20',
    accent: '#e11d48'
  },
  amber: {
    bgGlow: 'from-amber-500/5 via-amber-500/2 to-transparent',
    badge: 'bg-amber-50 text-amber-700 border-amber-200/80',
    border: 'hover:border-amber-400/80',
    btn: 'bg-amber-600 hover:bg-amber-700 text-white shadow-md shadow-amber-600/20',
    accent: '#d97706'
  }
};
