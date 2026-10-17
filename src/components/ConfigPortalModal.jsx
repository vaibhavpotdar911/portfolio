import React, { useState, useEffect } from 'react';
import {
  X, Lock, Unlock, Key, Plus, Trash2, Edit3, Download, Upload,
  CheckCircle2, AlertCircle, RefreshCw, Pin, ExternalLink, Sparkles
} from 'lucide-react';
import {
  verifyPasscode,
  setAdminPasscode,
  saveApps,
  exportAppsToJson,
  importAppsFromJson,
  resetAppsToDefault,
  publishAppsToGitHub,
  getGitHubConfig,
  saveGitHubConfig
} from '../utils/storage';
import { CATEGORIES } from '../data/initialApps';

export default function ConfigPortalModal({
  isOpen,
  onClose,
  apps,
  onUpdateApps,
  isAuthenticated,
  onSetAuthenticated,
  editingApp,
  onClearEditingApp
}) {
  const [passcode, setPasscode] = useState('');
  const [authError, setAuthError] = useState('');
  const [activeTab, setActiveTab] = useState('list');
  const [newPassInput, setNewPassInput] = useState('');
  const [passChangeSuccess, setPassChangeSuccess] = useState(false);
  const [statusMessage, setStatusMessage] = useState(null);

  // GitHub Sync State
  const [ghConfig, setGhConfig] = useState(() => getGitHubConfig());
  const [isPublishing, setIsPublishing] = useState(false);
  const [publishResult, setPublishResult] = useState(null);

  const [formData, setFormData] = useState({
    id: '',
    title: '',
    description: '',
    url: '',
    githubUrl: '',
    category: 'AI & Agents',
    status: 'Live',
    accentColor: 'blue',
    pinned: false,
    metrics: ''
  });

  useEffect(() => {
    if (editingApp) {
      setFormData({
        id: editingApp.id || '',
        title: editingApp.title || '',
        description: editingApp.description || '',
        url: editingApp.url || '',
        githubUrl: editingApp.githubUrl || '',
        category: editingApp.category || 'AI & Agents',
        status: editingApp.status || 'Live',
        accentColor: editingApp.accentColor || 'blue',
        pinned: !!editingApp.pinned,
        metrics: editingApp.metrics || ''
      });
      setActiveTab('form');
    }
  }, [editingApp]);

  if (!isOpen) return null;

  const handleLogin = async (e) => {
    e.preventDefault();
    const isValid = await verifyPasscode(passcode);
    if (isValid) {
      onSetAuthenticated(true);
      setAuthError('');
      setPasscode('');
    } else {
      setAuthError('Incorrect credential. Please check and try again.');
    }
  };

  const handleLogout = () => {
    onSetAuthenticated(false);
    setActiveTab('list');
    if (onClearEditingApp) onClearEditingApp();
  };

  const handleOpenAddForm = () => {
    setFormData({
      id: 'app-' + Date.now(),
      title: '',
      description: '',
      url: '',
      githubUrl: '',
      category: 'AI & Agents',
      status: 'Live',
      accentColor: 'blue',
      pinned: false,
      metrics: ''
    });
    if (onClearEditingApp) onClearEditingApp();
    setActiveTab('form');
  };

  const handleSaveApp = (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.url.trim()) {
      setStatusMessage({ type: 'error', text: 'App Title and Hosted URL are required.' });
      return;
    }

    let updatedList;
    const exists = apps.some((a) => a.id === formData.id);

    if (exists) {
      updatedList = apps.map((a) => (a.id === formData.id ? { ...formData } : a));
    } else {
      const newApp = {
        ...formData,
        id: formData.id || 'app-' + Date.now(),
        launchedAt: new Date().getFullYear().toString()
      };
      updatedList = [newApp, ...apps];
    }

    saveApps(updatedList);
    onUpdateApps(updatedList);
    setStatusMessage({ type: 'success', text: `Application "${formData.title}" saved successfully!` });
    setActiveTab('list');
    if (onClearEditingApp) onClearEditingApp();

    setTimeout(() => setStatusMessage(null), 3000);
  };

  const handleDeleteApp = (id, title) => {
    if (window.confirm(`Are you sure you want to remove "${title}" from your launchpad?`)) {
      const updatedList = apps.filter((a) => a.id !== id);
      saveApps(updatedList);
      onUpdateApps(updatedList);
      setStatusMessage({ type: 'success', text: `Removed "${title}".` });
      setTimeout(() => setStatusMessage(null), 3000);
    }
  };

  const handleTogglePinned = (id) => {
    const updatedList = apps.map((a) => (a.id === id ? { ...a, pinned: !a.pinned } : a));
    saveApps(updatedList);
    onUpdateApps(updatedList);
  };

  const handleChangePasscode = async (e) => {
    e.preventDefault();
    if (newPassInput.trim().length < 4) {
      alert('Passcode must be at least 4 characters.');
      return;
    }
    await setAdminPasscode(newPassInput.trim());
    setPassChangeSuccess(true);
    setNewPassInput('');
    setTimeout(() => setPassChangeSuccess(false), 3000);
  };

  const handleExport = () => {
    exportAppsToJson(apps);
  };

  const handlePublishToGitHub = async (e) => {
    e.preventDefault();
    if (!ghConfig.owner || !ghConfig.repo || !ghConfig.token) {
      setPublishResult({ type: 'error', text: 'Please fill in Owner, Repository name, and Token.' });
      return;
    }
    saveGitHubConfig(ghConfig);
    setIsPublishing(true);
    setPublishResult(null);

    const res = await publishAppsToGitHub({
      owner: ghConfig.owner.trim(),
      repo: ghConfig.repo.trim(),
      branch: ghConfig.branch.trim() || 'main',
      token: ghConfig.token.trim(),
      apps
    });

    setIsPublishing(false);
    if (res.success) {
      setPublishResult({
        type: 'success',
        text: 'Published to GitHub! GitHub Pages is now auto-deploying your updates to everyone.'
      });
    } else {
      setPublishResult({
        type: 'error',
        text: 'Publish failed: ' + res.error
      });
    }
  };

  const handleImportFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result;
      if (typeof content === 'string') {
        const res = importAppsFromJson(content);
        if (res.success) {
          onUpdateApps(res.data);
          setStatusMessage({ type: 'success', text: 'Applications successfully imported from JSON!' });
          setActiveTab('list');
        } else {
          setStatusMessage({ type: 'error', text: 'Import failed: ' + res.error });
        }
        setTimeout(() => setStatusMessage(null), 4000);
      }
    };
    reader.readAsText(file);
  };

  const handleReset = () => {
    if (window.confirm('Reset all applications to the default starter configuration? Any customized apps will be replaced.')) {
      const defaults = resetAppsToDefault();
      onUpdateApps(defaults);
      setStatusMessage({ type: 'success', text: 'Reset to default apps.' });
      setTimeout(() => setStatusMessage(null), 3000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-900/60 backdrop-blur-sm">
      <div className="relative w-full max-w-3xl max-h-[90vh] bg-white border border-zinc-200 rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-200 bg-zinc-50">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-blue-100 text-blue-700">
              <Lock className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-zinc-900 tracking-tight flex items-center gap-2">
                Launchpad Configuration Portal
                {isAuthenticated && (
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-100 text-emerald-800 font-semibold">
                    AUTHENTICATED
                  </span>
                )}
              </h3>
              <p className="text-xs text-zinc-500 font-mono">
                Embedded Zero-DB Management System · Single Credential Access
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-700 hover:bg-zinc-200 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Status Toast */}
        {statusMessage && (
          <div className={`px-6 py-2.5 text-xs font-mono flex items-center gap-2 border-b ${
            statusMessage.type === 'success'
              ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
              : 'bg-red-50 border-red-200 text-red-800'
          }`}>
            {statusMessage.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
            <span>{statusMessage.text}</span>
          </div>
        )}

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6">
          {!isAuthenticated ? (
            /* Authentication Screen */
            <div className="max-w-md mx-auto py-8 text-center">
              <div className="w-12 h-12 rounded-2xl bg-zinc-100 border border-zinc-200 flex items-center justify-center mx-auto mb-4">
                <Key className="w-6 h-6 text-blue-600" />
              </div>
              
              <h4 className="text-lg font-bold text-zinc-900 mb-1">Admin Passcode Required</h4>
              <p className="text-xs text-zinc-500 mb-6">
                Enter your single credential to configure your hosted applications.
              </p>

              <form onSubmit={handleLogin} className="space-y-3">
                <div>
                  <input
                    type="password"
                    value={passcode}
                    onChange={(e) => {
                      setPasscode(e.target.value);
                      setAuthError('');
                    }}
                    placeholder="Enter admin passcode..."
                    className="w-full px-4 py-2.5 rounded-xl bg-zinc-50 border border-zinc-200 text-zinc-900 text-sm placeholder-zinc-400 focus:outline-none focus:bg-white focus:border-blue-500 font-mono transition-colors text-center"
                    autoFocus
                  />
                  {authError && (
                    <p className="text-xs text-red-600 mt-2 font-mono flex items-center justify-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" />
                      {authError}
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white font-medium text-xs shadow-sm transition-all cursor-pointer"
                >
                  Unlock Portal
                </button>
              </form>

              <div className="mt-8 p-3 rounded-xl bg-zinc-50 border border-zinc-200 text-[11px] font-mono text-zinc-500">
                <span>Default single credential: </span>
                <code className="text-blue-700 font-semibold bg-white px-1.5 py-0.5 rounded border border-zinc-200">vaibhav2026</code>
                <p className="text-zinc-400 text-[10px] mt-1">(Changeable inside under Security)</p>
              </div>
            </div>
          ) : (
            /* Management Dashboard */
            <div>
              <div className="flex flex-wrap items-center justify-between gap-2 pb-4 mb-6 border-b border-zinc-200">
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setActiveTab('list')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-colors cursor-pointer ${
                      activeTab === 'list' ? 'bg-zinc-900 text-white' : 'text-zinc-600 hover:bg-zinc-100'
                    }`}
                  >
                    All Apps ({apps.length})
                  </button>
                  <button
                    onClick={handleOpenAddForm}
                    className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium flex items-center gap-1 transition-colors cursor-pointer ${
                      activeTab === 'form' ? 'bg-zinc-900 text-white' : 'text-zinc-600 hover:bg-zinc-100'
                    }`}
                  >
                    <Plus className="w-3.5 h-3.5" />
                    {formData.id && editingApp ? 'Edit App' : 'Add App'}
                  </button>
                  <button
                    onClick={() => setActiveTab('backup')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-colors cursor-pointer ${
                      activeTab === 'backup' ? 'bg-zinc-900 text-white' : 'text-zinc-600 hover:bg-zinc-100'
                    }`}
                  >
                    Sync / JSON
                  </button>
                  <button
                    onClick={() => setActiveTab('security')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-colors cursor-pointer ${
                      activeTab === 'security' ? 'bg-zinc-900 text-white' : 'text-zinc-600 hover:bg-zinc-100'
                    }`}
                  >
                    Security
                  </button>
                </div>

                <button
                  onClick={handleLogout}
                  className="px-2.5 py-1 rounded text-xs font-mono text-zinc-500 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                >
                  Lock Portal (Logout)
                </button>
              </div>

              {/* LIST APPS */}
              {activeTab === 'list' && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-mono text-zinc-500">Configured Applications</span>
                    <button
                      onClick={handleOpenAddForm}
                      className="text-xs font-mono text-blue-600 hover:underline flex items-center gap-1 cursor-pointer font-medium"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      Add new app
                    </button>
                  </div>

                  {apps.map((app) => (
                    <div
                      key={app.id}
                      className="p-3.5 rounded-xl bg-zinc-50 border border-zinc-200 hover:border-zinc-300 flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-colors"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h5 className="font-semibold text-zinc-900 text-sm truncate">{app.title}</h5>
                          <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-white text-zinc-600 border border-zinc-200">
                            {app.category}
                          </span>
                          <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-blue-50 text-blue-700">
                            {app.status}
                          </span>
                          {app.pinned && (
                            <span className="text-[10px] font-mono text-amber-700 flex items-center gap-0.5">
                              <Pin className="w-2.5 h-2.5" /> Pinned
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-zinc-500 truncate mb-1">{app.description}</p>
                        <a
                          href={app.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[11px] font-mono text-blue-600 hover:underline flex items-center gap-1"
                        >
                          {app.url} <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0 self-end sm:self-center">
                        <button
                          onClick={() => handleTogglePinned(app.id)}
                          className={`p-2 rounded-lg border text-xs cursor-pointer transition-colors ${
                            app.pinned
                              ? 'bg-amber-100 border-amber-300 text-amber-800'
                              : 'bg-white border-zinc-200 text-zinc-500 hover:text-zinc-800'
                          }`}
                          title={app.pinned ? 'Unpin from Hero Bento' : 'Pin to Hero Bento'}
                        >
                          <Pin className="w-3.5 h-3.5" />
                        </button>
                        
                        <button
                          onClick={() => {
                            setFormData({ ...app });
                            setActiveTab('form');
                          }}
                          className="p-2 rounded-lg bg-white hover:bg-zinc-100 border border-zinc-200 text-zinc-700 transition-colors cursor-pointer"
                          title="Edit details"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => handleDeleteApp(app.id, app.title)}
                          className="p-2 rounded-lg bg-white hover:bg-red-50 border border-zinc-200 text-zinc-400 hover:text-red-600 transition-colors cursor-pointer"
                          title="Delete application"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* ADD / EDIT FORM */}
              {activeTab === 'form' && (
                <form onSubmit={handleSaveApp} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-mono text-zinc-600 mb-1">
                        Application Title *
                      </label>
                      <input
                        type="text"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        placeholder="e.g. Nexus AI Workflow"
                        required
                        className="w-full px-3.5 py-2 rounded-xl bg-zinc-50 border border-zinc-200 text-zinc-900 text-xs placeholder-zinc-400 focus:outline-none focus:bg-white focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-mono text-zinc-600 mb-1">Category</label>
                      <select
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        className="w-full px-3.5 py-2 rounded-xl bg-zinc-50 border border-zinc-200 text-zinc-900 text-xs focus:outline-none focus:bg-white focus:border-blue-500 cursor-pointer"
                      >
                        {CATEGORIES.filter((c) => c !== 'All Apps').map((cat) => (
                          <option key={cat} value={cat}>
                            {cat}
                          </option>
                        ))}
                        <option value="Custom">Custom Tool</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-mono text-zinc-600 mb-1">
                        Hosted Application URL *
                      </label>
                      <input
                        type="url"
                        value={formData.url}
                        onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                        placeholder="https://your-hosted-app.com"
                        required
                        className="w-full px-3.5 py-2 rounded-xl bg-zinc-50 border border-zinc-200 text-zinc-900 text-xs placeholder-zinc-400 focus:outline-none focus:bg-white focus:border-blue-500 font-mono"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-mono text-zinc-600 mb-1">
                        GitHub / Source Code URL (Optional)
                      </label>
                      <input
                        type="url"
                        value={formData.githubUrl}
                        onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
                        placeholder="https://github.com/..."
                        className="w-full px-3.5 py-2 rounded-xl bg-zinc-50 border border-zinc-200 text-zinc-900 text-xs placeholder-zinc-400 focus:outline-none focus:bg-white focus:border-blue-500 font-mono"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-mono text-zinc-600 mb-1">Status Badge</label>
                      <select
                        value={formData.status}
                        onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                        className="w-full px-3.5 py-2 rounded-xl bg-zinc-50 border border-zinc-200 text-zinc-900 text-xs focus:outline-none focus:bg-white focus:border-blue-500 cursor-pointer"
                      >
                        <option value="Live">Live (Production)</option>
                        <option value="Active">Active (Operational)</option>
                        <option value="Beta">Beta (Testing)</option>
                        <option value="Internal">Internal Tool</option>
                        <option value="WIP">Work in Progress</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-mono text-zinc-600 mb-1">Accent Theme</label>
                      <select
                        value={formData.accentColor}
                        onChange={(e) => setFormData({ ...formData, accentColor: e.target.value })}
                        className="w-full px-3.5 py-2 rounded-xl bg-zinc-50 border border-zinc-200 text-zinc-900 text-xs focus:outline-none focus:bg-white focus:border-blue-500 cursor-pointer"
                      >
                        <option value="blue">Electric Blue</option>
                        <option value="purple">Vibrant Purple</option>
                        <option value="emerald">Emerald Green</option>
                        <option value="cyan">Cyan Aqua</option>
                        <option value="rose">Rose</option>
                        <option value="amber">Amber</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-zinc-600 mb-1">
                      Short Description / What It Does
                    </label>
                    <textarea
                      rows={3}
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Brief summary of architecture, functionality, or workflow solved..."
                      className="w-full px-3.5 py-2 rounded-xl bg-zinc-50 border border-zinc-200 text-zinc-900 text-xs placeholder-zinc-400 focus:outline-none focus:bg-white focus:border-blue-500"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
                    <div>
                      <label className="block text-xs font-mono text-zinc-600 mb-1">
                        Metrics Tag / Highlights (Optional)
                      </label>
                      <input
                        type="text"
                        value={formData.metrics}
                        onChange={(e) => setFormData({ ...formData, metrics: e.target.value })}
                        placeholder="e.g. 99.9% Uptime · Multi-tenant"
                        className="w-full px-3.5 py-2 rounded-xl bg-zinc-50 border border-zinc-200 text-zinc-900 text-xs placeholder-zinc-400 focus:outline-none focus:bg-white focus:border-blue-500"
                      />
                    </div>

                    <div className="pt-4 flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="pinned-checkbox"
                        checked={formData.pinned}
                        onChange={(e) => setFormData({ ...formData, pinned: e.target.checked })}
                        className="w-4 h-4 rounded border-zinc-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                      />
                      <label htmlFor="pinned-checkbox" className="text-xs text-zinc-700 font-mono cursor-pointer">
                        Pin to Featured Hero Card
                      </label>
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-3 pt-4 border-t border-zinc-200">
                    <button
                      type="button"
                      onClick={() => {
                        setActiveTab('list');
                        if (onClearEditingApp) onClearEditingApp();
                      }}
                      className="px-4 py-2 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-xs font-medium text-zinc-700 transition-colors cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-semibold shadow-xs transition-all cursor-pointer"
                    >
                      Save Application
                    </button>
                  </div>
                </form>
              )}

              {/* BACKUP / SYNC */}
              {activeTab === 'backup' && (
                <div className="space-y-6">
                  {/* Global Live Sync via GitHub */}
                  <div className="p-4 rounded-xl bg-blue-50/60 border border-blue-200">
                    <div className="mb-3">
                      <h5 className="text-sm font-bold text-blue-950 flex items-center gap-1.5 mb-0.5">
                        <Sparkles className="w-4 h-4 text-blue-600" />
                        Publish Changes Live to Everyone Worldwide
                      </h5>
                      <p className="text-xs text-blue-800/80">
                        Pushes your updated <code className="bg-blue-100/80 px-1 py-0.5 rounded text-blue-900 font-mono">public/apps.json</code> directly to your GitHub repository using GitHub's free API. GitHub Pages will automatically deploy it so all visitors see your changes globally!
                      </p>
                    </div>

                    <form onSubmit={handlePublishToGitHub} className="space-y-3">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[11px] font-mono text-zinc-600 mb-1">
                            GitHub Username / Owner
                          </label>
                          <input
                            type="text"
                            value={ghConfig.owner}
                            onChange={(e) => setGhConfig({ ...ghConfig, owner: e.target.value })}
                            placeholder="e.g. vaibhavpotdar"
                            className="w-full px-3 py-1.5 rounded-lg bg-white border border-zinc-200 text-xs text-zinc-900 focus:outline-none focus:border-blue-500 font-mono"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-mono text-zinc-600 mb-1">
                            Repository Name
                          </label>
                          <input
                            type="text"
                            value={ghConfig.repo}
                            onChange={(e) => setGhConfig({ ...ghConfig, repo: e.target.value })}
                            placeholder="e.g. portfolio or vaibhavpotdar.github.io"
                            className="w-full px-3 py-1.5 rounded-lg bg-white border border-zinc-200 text-xs text-zinc-900 focus:outline-none focus:border-blue-500 font-mono"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[11px] font-mono text-zinc-600 mb-1">
                          GitHub Personal Access Token (PAT)
                        </label>
                        <input
                          type="password"
                          value={ghConfig.token}
                          onChange={(e) => setGhConfig({ ...ghConfig, token: e.target.value })}
                          placeholder="github_pat_... (Needs repo contents write access)"
                          className="w-full px-3 py-1.5 rounded-lg bg-white border border-zinc-200 text-xs text-zinc-900 focus:outline-none focus:border-blue-500 font-mono"
                        />
                        <span className="text-[10px] text-zinc-400 font-mono">
                          Saved locally only in your browser storage. Never exposed publicly.
                        </span>
                      </div>

                      <div className="flex items-center justify-between pt-1">
                        <button
                          type="submit"
                          disabled={isPublishing}
                          className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs transition-all cursor-pointer disabled:opacity-50"
                        >
                          {isPublishing ? 'Publishing to GitHub...' : 'Publish Live to Everyone (GitHub Sync)'}
                        </button>
                      </div>

                      {publishResult && (
                        <div className={`p-2.5 rounded-lg text-xs font-mono flex items-center gap-2 border ${
                          publishResult.type === 'success'
                            ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                            : 'bg-red-50 border-red-200 text-red-800'
                        }`}>
                          {publishResult.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                          <span>{publishResult.text}</span>
                        </div>
                      )}
                    </form>
                  </div>

                  {/* Offline Export / Import */}
                  <div>
                    <h5 className="text-sm font-bold text-zinc-900 mb-1">Offline File Backup &amp; Migration</h5>
                    <p className="text-xs text-zinc-500">
                      Download a JSON file of your apps or restore from a previously downloaded backup.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-4 rounded-xl bg-zinc-50 border border-zinc-200 flex flex-col justify-between">
                      <div>
                        <h6 className="text-xs font-bold text-zinc-900 font-mono flex items-center gap-1.5 mb-1">
                          <Download className="w-3.5 h-3.5 text-blue-600" />
                          Export to JSON
                        </h6>
                        <p className="text-[11px] text-zinc-500 mb-4">
                          Download a timestamped <code className="text-zinc-800">.json</code> file.
                        </p>
                      </div>
                      <button
                        onClick={handleExport}
                        className="w-full py-2 rounded-lg bg-white hover:bg-zinc-100 border border-zinc-300 text-zinc-800 text-xs font-mono font-medium transition-colors cursor-pointer shadow-2xs"
                      >
                        Download Backup JSON
                      </button>
                    </div>

                    <div className="p-4 rounded-xl bg-zinc-50 border border-zinc-200 flex flex-col justify-between">
                      <div>
                        <h6 className="text-xs font-bold text-zinc-900 font-mono flex items-center gap-1.5 mb-1">
                          <Upload className="w-3.5 h-3.5 text-emerald-600" />
                          Import from JSON
                        </h6>
                        <p className="text-[11px] text-zinc-500 mb-4">
                          Restore apps from a previously saved JSON backup.
                        </p>
                      </div>
                      <label className="w-full py-2 rounded-lg bg-white hover:bg-zinc-100 border border-zinc-300 text-zinc-800 text-xs font-mono font-medium transition-colors cursor-pointer text-center block shadow-2xs">
                        <span>Select JSON File</span>
                        <input
                          type="file"
                          accept=".json,application/json"
                          onChange={handleImportFile}
                          className="hidden"
                        />
                      </label>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-red-50 border border-red-200 flex items-center justify-between">
                    <div>
                      <h6 className="text-xs font-bold text-red-900 font-mono flex items-center gap-1 mb-0.5">
                        <RefreshCw className="w-3.5 h-3.5" />
                        Reset Starter Templates
                      </h6>
                      <p className="text-[11px] text-red-700">
                        Replace your current list with the clean default starter templates.
                      </p>
                    </div>
                    <button
                      onClick={handleReset}
                      className="px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-mono cursor-pointer transition-colors"
                    >
                      Reset Apps
                    </button>
                  </div>
                </div>
              )}

              {/* SECURITY */}
              {activeTab === 'security' && (
                <div className="max-w-md space-y-6">
                  <div>
                    <h5 className="text-sm font-bold text-zinc-900 mb-1">Single Credential Security</h5>
                    <p className="text-xs text-zinc-500">
                      Your configuration portal is locked behind one credential. Change it anytime below.
                    </p>
                  </div>

                  <form onSubmit={handleChangePasscode} className="space-y-3">
                    <div>
                      <label className="block text-xs font-mono text-zinc-600 mb-1">
                        New Admin Passcode
                      </label>
                      <input
                        type="text"
                        value={newPassInput}
                        onChange={(e) => setNewPassInput(e.target.value)}
                        placeholder="Enter new custom passcode..."
                        className="w-full px-3.5 py-2 rounded-xl bg-zinc-50 border border-zinc-200 text-zinc-900 text-xs placeholder-zinc-400 focus:outline-none focus:bg-white focus:border-blue-500 font-mono"
                        required
                      />
                    </div>

                    <button
                      type="submit"
                      className="px-4 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-medium transition-colors cursor-pointer"
                    >
                      Update Passcode
                    </button>

                    {passChangeSuccess && (
                      <p className="text-xs text-emerald-700 font-mono flex items-center gap-1 mt-2">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Passcode successfully updated!
                      </p>
                    )}
                  </form>
                </div>
              )}

            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-zinc-200 bg-zinc-50 flex items-center justify-between text-[11px] font-mono text-zinc-500">
          <span>Vaibhav Potdar Launchpad System</span>
          <span>Zero Server / DB Overhead</span>
        </div>

      </div>
    </div>
  );
}
