import React, { useState, useMemo } from 'react';
import { Search, Layers, RefreshCcw, Sparkles } from 'lucide-react';
import AppCard from './AppCard';
import { CATEGORIES } from '../data/initialApps';

export default function AppBentoGrid({ apps, onEditApp, isAuthenticated }) {
  const [selectedCategory, setSelectedCategory] = useState('All Apps');
  const [searchQuery, setSearchQuery] = useState('');

  const allCategories = useMemo(() => {
    const set = new Set(CATEGORIES);
    apps.forEach((a) => {
      if (a.category) set.add(a.category);
    });
    return Array.from(set);
  }, [apps]);

  const filteredApps = useMemo(() => {
    return apps
      .filter((app) => {
        const matchesCategory =
          selectedCategory === 'All Apps' || app.category === selectedCategory;
        const matchesSearch =
          searchQuery.trim() === '' ||
          app.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          app.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (app.category && app.category.toLowerCase().includes(searchQuery.toLowerCase())) ||
          (app.metrics && app.metrics.toLowerCase().includes(searchQuery.toLowerCase()));
        return matchesCategory && matchesSearch;
      })
      .sort((a, b) => {
        if (a.pinned && !b.pinned) return -1;
        if (!a.pinned && b.pinned) return 1;
        return 0;
      });
  }, [apps, selectedCategory, searchQuery]);

  return (
    <section id="apps-section" className="relative py-14 sm:py-20 scroll-mt-20 bg-[#fefefe]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8 sm:mb-10">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200/80 text-indigo-700 text-xs mb-3 font-semibold shadow-2xs">
              <Layers className="w-3.5 h-3.5 text-indigo-600" />
              <span>APPLICATIONS</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">
              Hosted Applications &amp; Tools
            </h2>
            <p className="text-slate-600 text-sm sm:text-base mt-2 max-w-xl">
              Direct access to everything I have built and deployed. Click any card to launch immediately in production.
            </p>
          </div>
        </div>

        {/* Filter Bar & Search Input with colorful accents */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-2 rounded-2xl bg-white border border-slate-200 shadow-2xs mb-8">
          
          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
            {allCategories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all duration-200 cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-sm shadow-blue-500/25 font-semibold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="relative min-w-[240px] sm:w-72">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search apps by keyword..."
              className="w-full pl-9 pr-8 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-blue-500 transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 text-xs cursor-pointer p-0.5"
              >
                ×
              </button>
            )}
          </div>

        </div>

        {/* Counter Bar */}
        <div className="flex items-center justify-between text-xs text-slate-500 mb-6 px-1">
          <span>
            Showing <strong className="text-slate-800 font-semibold">{filteredApps.length}</strong> of{' '}
            <strong className="text-slate-800 font-semibold">{apps.length}</strong> applications
          </span>
          {searchQuery && (
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('All Apps');
              }}
              className="text-blue-600 hover:text-indigo-600 hover:underline flex items-center gap-1 cursor-pointer font-medium"
            >
              <RefreshCcw className="w-3 h-3" />
              Reset filters
            </button>
          )}
        </div>

        {/* Bento Grid */}
        {filteredApps.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            {filteredApps.map((app, index) => {
              const isHeroCard = app.pinned && index === 0;
              return (
                <AppCard
                  key={app.id || index}
                  app={app}
                  isHeroCard={isHeroCard}
                  onEdit={onEditApp}
                  isAuthenticated={isAuthenticated}
                />
              );
            })}
          </div>
        ) : (
          <div className="p-12 text-center rounded-2xl bg-white border border-dashed border-slate-300">
            <Sparkles className="w-10 h-10 text-slate-400 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-800 mb-1">No applications found</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto mb-5">
              No deployed applications match your search query "{searchQuery}".
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('All Apps');
              }}
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold cursor-pointer shadow-sm shadow-blue-500/20"
            >
              Clear Search
            </button>
          </div>
        )}

      </div>
    </section>
  );
}
