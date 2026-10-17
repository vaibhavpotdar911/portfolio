import React, { useState, useEffect, useRef } from 'react';
import { Search, ArrowUpRight, X, CornerDownLeft } from 'lucide-react';

export default function CommandPaletteModal({ isOpen, onClose, apps }) {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  const filtered = apps.filter((app) => {
    if (!query.trim()) return true;
    const q = query.toLowerCase();
    return (
      app.title.toLowerCase().includes(q) ||
      app.description.toLowerCase().includes(q) ||
      (app.category && app.category.toLowerCase().includes(q))
    );
  });

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % (filtered.length || 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + filtered.length) % (filtered.length || 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filtered[selectedIndex]) {
        window.open(filtered[selectedIndex].url, '_blank', 'noopener,noreferrer');
        onClose();
      }
    } else if (e.key === 'Escape') {
      e.preventDefault();
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-24 px-4 bg-zinc-900/50 backdrop-blur-sm">
      <div
        className="relative w-full max-w-xl bg-white border border-zinc-200 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150"
        onKeyDown={handleKeyDown}
      >
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-zinc-200 bg-white">
          <Search className="w-5 h-5 text-zinc-400 mr-3" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type to search apps... (↑↓ to select, Enter to launch)"
            className="w-full bg-transparent text-zinc-900 text-sm placeholder-zinc-400 focus:outline-none font-sans"
          />
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-zinc-400 hover:text-zinc-700 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results List */}
        <div className="max-h-80 overflow-y-auto p-2 divide-y divide-zinc-100">
          {filtered.length > 0 ? (
            filtered.map((app, index) => {
              const isSelected = index === selectedIndex;
              return (
                <div
                  key={app.id || index}
                  onClick={() => {
                    window.open(app.url, '_blank', 'noopener,noreferrer');
                    onClose();
                  }}
                  onMouseEnter={() => setSelectedIndex(index)}
                  className={`p-3 rounded-xl flex items-center justify-between gap-3 cursor-pointer transition-colors ${
                    isSelected ? 'bg-blue-50 border border-blue-200' : 'hover:bg-zinc-50'
                  }`}
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className={`text-sm font-semibold truncate ${isSelected ? 'text-blue-900' : 'text-zinc-900'}`}>
                        {app.title}
                      </span>
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-zinc-100 text-zinc-600">
                        {app.category}
                      </span>
                      <span className="text-[10px] font-mono text-emerald-600">
                        ● {app.status}
                      </span>
                    </div>
                    <p className="text-xs text-zinc-500 truncate">{app.description}</p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {isSelected && (
                      <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-mono text-blue-700 bg-blue-100 px-2 py-0.5 rounded">
                        Launch <CornerDownLeft className="w-2.5 h-2.5" />
                      </span>
                    )}
                    <ArrowUpRight className="w-4 h-4 text-zinc-400" />
                  </div>
                </div>
              );
            })
          ) : (
            <div className="py-8 text-center text-xs text-zinc-400 font-mono">
              No matching applications found for "{query}"
            </div>
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="px-4 py-2.5 bg-zinc-50 border-t border-zinc-200 flex items-center justify-between text-[11px] font-mono text-zinc-500">
          <div className="flex items-center gap-3">
            <span><kbd className="px-1 py-0.5 bg-white border border-zinc-200 rounded text-zinc-700">↑</kbd> <kbd className="px-1 py-0.5 bg-white border border-zinc-200 rounded text-zinc-700">↓</kbd> Select</span>
            <span><kbd className="px-1 py-0.5 bg-white border border-zinc-200 rounded text-zinc-700">Enter</kbd> Launch</span>
            <span><kbd className="px-1 py-0.5 bg-white border border-zinc-200 rounded text-zinc-700">Esc</kbd> Close</span>
          </div>
          <span>{filtered.length} apps</span>
        </div>

      </div>
    </div>
  );
}
