import React, { useState, useEffect } from 'react';
import { Search, ArrowDown } from 'lucide-react';

export default function Navbar({ onOpenSearch, appCount }) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 15);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
      scrolled 
        ? 'py-3.5 bg-[#fefefe]/90 backdrop-blur-md border-b border-slate-200/80 shadow-[0_4px_20px_-4px_rgba(99,102,241,0.04)]' 
        : 'py-5 bg-transparent'
    }`}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          
          {/* Identity */}
          <a href="#" className="flex items-center space-x-3 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-600 via-indigo-600 to-violet-600 text-white flex items-center justify-center font-bold text-xs tracking-wide shadow-sm shadow-blue-500/25 group-hover:scale-105 transition-transform">
              VP
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-bold text-slate-900 tracking-tight group-hover:text-blue-600 transition-colors">
                Vaibhav Potdar
              </span>
              <span className="text-xs text-slate-500 font-mono flex items-center gap-1.5">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                {appCount} Applications Online
              </span>
            </div>
          </a>

          {/* Controls */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            <button
              onClick={onOpenSearch}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs transition-all duration-200 cursor-pointer shadow-2xs group hover:border-blue-300"
              title="Search applications (Ctrl+K or /)"
            >
              <Search className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-600 transition-colors" />
              <span className="hidden sm:inline">Search</span>
              <kbd className="px-1.5 py-0.5 bg-slate-100 rounded border border-slate-200 text-[10px] text-slate-500 font-mono">
                ⌘K
              </kbd>
            </button>

            <a
              href="#apps-section"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs font-semibold shadow-sm shadow-blue-500/20 transition-all duration-200 cursor-pointer hover:shadow-md hover:shadow-blue-500/25"
            >
              <span>View Apps</span>
              <ArrowDown className="w-3.5 h-3.5 opacity-80" />
            </a>
          </div>

        </div>
      </div>
    </header>
  );
}
