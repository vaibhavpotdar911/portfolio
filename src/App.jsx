import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import AppBentoGrid from './components/AppBentoGrid';
import ConfigPortalModal from './components/ConfigPortalModal';
import CommandPaletteModal from './components/CommandPaletteModal';
import Footer from './components/Footer';
import { loadApps, fetchLiveApps, checkIsAuthenticated, setAuthenticated } from './utils/storage';

export default function App() {
  const [apps, setApps] = useState([]);
  const [isConfigOpen, setIsConfigOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticatedState] = useState(false);
  const [editingApp, setEditingApp] = useState(null);

  useEffect(() => {
    async function init() {
      // 1. Instant load from local storage
      const initial = loadApps();
      setApps(initial);
      setIsAuthenticatedState(checkIsAuthenticated());
      // 2. Fetch authoritative live apps from public /apps.json so all visitors see the latest apps
      const live = await fetchLiveApps();
      if (live && live.length > 0) {
        setApps(live);
      }
    }
    init();
  }, []);

  const handleSetAuthenticated = (status) => {
    setAuthenticated(status);
    setIsAuthenticatedState(status);
  };

  // Keyboard shortcut listener:
  // - Cmd/Ctrl + K or /: Quick App Search
  // - Cmd/Ctrl + Shift + P: Secret shortcut to open Config Portal
  useEffect(() => {
    const handleKeyDown = (e) => {
      const targetTag = e.target.tagName.toLowerCase();
      const isInput = targetTag === 'input' || targetTag === 'textarea';

      // Secret Admin shortcut: Ctrl/Cmd + Shift + P
      if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key.toLowerCase() === 'p') {
        e.preventDefault();
        setIsConfigOpen((prev) => !prev);
      }
      // Quick search: Ctrl/Cmd + K
      else if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      }
      // Quick search: /
      else if (e.key === '/' && !isInput && !isConfigOpen && !isSearchOpen) {
        e.preventDefault();
        setIsSearchOpen(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isConfigOpen, isSearchOpen]);

  const handleEditApp = (app) => {
    setEditingApp(app);
    setIsConfigOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#fefefe] text-zinc-900 flex flex-col selection:bg-blue-600/15 selection:text-blue-900">
      
      {/* Navbar (Clean, no public config button) */}
      <Navbar
        onOpenSearch={() => setIsSearchOpen(true)}
        appCount={apps.length}
      />

      {/* Main Content */}
      <main className="flex-1">
        {/* Hero Section with seamless background-matched portrait */}
        <Hero
          onOpenSearch={() => setIsSearchOpen(true)}
          appCount={apps.length}
        />

        {/* Bento Grid Apps Showcase */}
        <AppBentoGrid
          apps={apps}
          onEditApp={handleEditApp}
          isAuthenticated={isAuthenticated}
        />
      </main>

      {/* Footer with subtle hidden portal trigger */}
      <Footer onOpenConfig={() => setIsConfigOpen(true)} />

      {/* Embedded Config Portal (Protected by single credential) */}
      <ConfigPortalModal
        isOpen={isConfigOpen}
        onClose={() => {
          setIsConfigOpen(false);
          setEditingApp(null);
        }}
        apps={apps}
        onUpdateApps={(newApps) => setApps(newApps)}
        isAuthenticated={isAuthenticated}
        onSetAuthenticated={handleSetAuthenticated}
        editingApp={editingApp}
        onClearEditingApp={() => setEditingApp(null)}
      />

      {/* Command Palette Modal (Ctrl+K or / quick launch) */}
      <CommandPaletteModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        apps={apps}
      />

    </div>
  );
}
