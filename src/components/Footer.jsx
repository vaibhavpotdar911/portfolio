import React from 'react';
import { ArrowUp, Lock } from 'lucide-react';

export default function Footer({ onOpenConfig }) {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative border-t border-slate-200/80 bg-[#fefefe] py-10 mt-16 sm:mt-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          
          {/* Brand */}
          <div className="flex items-center space-x-3 text-center sm:text-left">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-600 via-indigo-600 to-violet-600 text-white flex items-center justify-center font-bold text-xs tracking-wide shadow-sm shadow-blue-500/25">
              VP
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-slate-900">
                Vaibhav Potdar
              </span>
              <span className="text-xs text-slate-500">
                Personal Workspace &amp; Applications Hub
              </span>
            </div>
          </div>

          {/* Operational Status Dot */}
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200/80 text-xs font-mono text-emerald-800">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span>All Gateways Active</span>
          </div>

          {/* Actions: Mailto & Back to Top */}
          <div className="flex items-center gap-3">
            <a
              href="mailto:vaibhav.potdar9946@gmail.com"
              className="text-xs text-blue-600 hover:text-indigo-600 transition-colors font-medium hover:underline"
            >
              vaibhav.potdar9946@gmail.com
            </a>
            <button
              onClick={scrollToTop}
              className="p-2 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-500 hover:text-blue-600 transition-colors cursor-pointer shadow-2xs"
              title="Back to top"
            >
              <ArrowUp className="w-4 h-4" />
            </button>
          </div>

        </div>

        {/* Bottom subtle bar: Discreet Config Portal Trigger */}
        <div className="mt-8 pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-500">
          <div className="flex items-center gap-1.5">
            <span>© {new Date().getFullYear()} Vaibhav Potdar. All rights reserved.</span>
            {/* Discreet Admin Lock Trigger */}
            <button
              onClick={onOpenConfig}
              className="opacity-20 hover:opacity-100 text-slate-400 hover:text-blue-600 transition-opacity p-0.5 ml-1 cursor-pointer"
              title="Sys Config"
              aria-label="System Config"
            >
              <Lock className="w-3 h-3" />
            </button>
          </div>
          
          <div className="flex items-center gap-3 text-slate-400">
            <span>Press <kbd className="px-1 py-0.5 bg-slate-100 border border-slate-200 rounded text-[11px] text-slate-600 font-mono">⌘K</kbd> to search</span>
            <span className="hidden sm:inline">·</span>
            <span className="text-[11px] text-slate-400">Daily launchpad</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
