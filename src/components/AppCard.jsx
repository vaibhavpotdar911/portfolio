import React from 'react';
import { ExternalLink, Sparkles, Pin, CheckCircle2, ArrowUpRight, Edit3 } from 'lucide-react';
import confetti from 'canvas-confetti';
import { COLOR_VARIANTS } from '../data/initialApps';

function GitHubIcon({ className = "w-4 h-4" }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
    </svg>
  );
}

export default function AppCard({ app, isHeroCard = false, onEdit, isAuthenticated }) {
  const colorScheme = COLOR_VARIANTS[app.accentColor] || COLOR_VARIANTS.blue;

  const handleLaunch = (e) => {
    try {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = (rect.left + rect.width / 2) / window.innerWidth;
      const y = (rect.top + rect.height / 2) / window.innerHeight;
      confetti({
        particleCount: 22,
        spread: 50,
        origin: { x, y },
        colors: ['#2563eb', '#4f46e5', '#059669', '#0891b2', '#e11d48'],
        ticks: 160,
        gravity: 1.2,
        scalar: 0.8
      });
    } catch (err) {
      // non-blocking
    }
  };

  return (
    <div
      className={`group relative rounded-2xl overflow-hidden light-card ${colorScheme.border} flex flex-col justify-between ${
        isHeroCard ? 'lg:col-span-2 p-6 sm:p-8 min-h-[270px]' : 'p-5 sm:p-6 min-h-[240px]'
      }`}
    >
      {/* Subtle colorful background radial wash on card hover */}
      <div
        className={`absolute inset-0 bg-gradient-to-br ${colorScheme.bgGlow} opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none`}
      />

      {/* Top Meta Header */}
      <div className="relative z-10">
        <div className="flex items-start justify-between gap-3 mb-4">
          
          {/* Status & Category Chips */}
          <div className="flex flex-wrap items-center gap-2">
            <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-mono font-semibold border ${colorScheme.badge}`}>
              <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
              {app.status || 'Live'}
            </span>

            <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200 text-[11px] font-mono">
              {app.category || 'General'}
            </span>

            {app.pinned && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-medium text-amber-800 bg-amber-50 border border-amber-200/80">
                <Pin className="w-2.5 h-2.5 text-amber-600" />
                Featured
              </span>
            )}
          </div>

          {/* Discreet Edit button for authenticated admin */}
          {isAuthenticated && (
            <button
              onClick={() => onEdit(app)}
              className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 border border-slate-200 transition-colors cursor-pointer"
              title="Edit in Config Portal"
            >
              <Edit3 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Title */}
        <h3 className={`font-bold text-slate-900 tracking-tight group-hover:text-blue-600 transition-colors ${
          isHeroCard ? 'text-2xl sm:text-3xl mb-3' : 'text-xl mb-2'
        }`}>
          {app.title}
        </h3>

        {/* Description */}
        <p className={`text-slate-600 font-normal leading-relaxed line-clamp-3 mb-4 ${
          isHeroCard ? 'text-base sm:text-lg max-w-2xl' : 'text-sm'
        }`}>
          {app.description}
        </p>
      </div>

      {/* Card Footer */}
      <div className="relative z-10 pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 mt-auto">
        
        {/* Metrics Chip */}
        <div className="flex items-center gap-2 text-xs font-mono text-slate-500">
          {app.metrics ? (
            <span className="text-slate-700 font-medium flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              {app.metrics}
            </span>
          ) : (
            <span>Deployed {app.launchedAt || '2026'}</span>
          )}
        </div>

        {/* Action Controls - Unified, UI-Friendly & Refined */}
        <div className="flex items-center gap-2">
          {app.githubUrl && (
            <a
              href={app.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-500 hover:text-slate-900 border border-slate-200 transition-colors cursor-pointer shadow-2xs"
              title="View GitHub Repository"
            >
              <GitHubIcon className="w-3.5 h-3.5" />
            </a>
          )}

          <a
            href={app.url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={handleLaunch}
            className="group/btn inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-slate-50 hover:bg-blue-600 text-slate-700 hover:text-white border border-slate-200 hover:border-blue-600 text-xs font-semibold tracking-wide transition-all duration-200 cursor-pointer shadow-2xs hover:shadow-md hover:shadow-blue-500/20"
          >
            <span>Launch App</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-slate-400 group-hover/btn:text-white group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
          </a>
        </div>

      </div>
    </div>
  );
}
