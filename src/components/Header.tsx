import React from 'react';
import {
  Sparkles,
  FileText,
  Pin,
  GitBranch,
  Calendar,
  Layers,
  Settings,
  Activity,
  CheckCircle2,
  AlertCircle,
  FlaskConical,
  Share2,
  KeyRound
} from 'lucide-react';
import { AppSettings } from '../types.js';

interface HeaderProps {
  currentTab: string;
  onTabChange: (tab: string) => void;
  settings: AppSettings | null;
  onToggleTestMode: () => void;
  activeJobsCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onTabChange,
  settings,
  onToggleTestMode,
  activeJobsCount
}) => {
  const tabs = [
    { id: 'generator', label: 'Generator', icon: Sparkles },
    { id: 'keywords', label: 'Keyword Research', icon: KeyRound },
    { id: 'articles', label: 'Preview & Edit Hub', icon: FileText },
    { id: 'pinterest', label: 'Social & Syndication', icon: Share2 },
    { id: 'authority', label: 'Topical Authority', icon: GitBranch },
    { id: 'calendar', label: 'Content Calendar', icon: Calendar },
    { id: 'bulk-refresh', label: 'Bulk & Refresh', icon: Layers },
    { id: 'settings', label: 'Settings & Bridge', icon: Settings }
  ];

  const wpConnected = settings?.wordpress?.isConnected;
  const pinConnected = settings?.pinterest?.isConnected;
  const fbConnected = settings?.facebook?.isConnected;
  const igConnected = settings?.instagram?.isConnected;
  const isTestMode = settings?.testMode;

  return (
    <header className="bg-slate-900 border-b border-slate-800 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo & Name */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center shadow-lg shadow-emerald-500/20 text-slate-950 font-black text-xl">
              SEO
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold tracking-tight text-white">AI SEO Content Studio</span>
                <span className="text-[11px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  Production
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">
                Search Intent • WordPress • Facebook • Pinterest • Instagram
              </p>
            </div>
          </div>

          {/* Right Status Controls */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Active Jobs Pill */}
            {activeJobsCount > 0 && (
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-xs font-medium animate-pulse">
                <Activity className="w-3.5 h-3.5" />
                <span>{activeJobsCount} Active Job{activeJobsCount > 1 ? 's' : ''}</span>
              </div>
            )}

            {/* Test Mode Toggle */}
            <button
              id="test-mode-toggle-btn"
              onClick={onToggleTestMode}
              title="Toggle Testing Mode (Mock AI & SERP data)"
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border transition-colors ${
                isTestMode
                  ? 'bg-amber-500/20 border-amber-500/50 text-amber-300'
                  : 'bg-slate-800/80 border-slate-700 text-slate-400 hover:text-slate-200'
              }`}
            >
              <FlaskConical className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Test Mode:</span>
              <span className="font-semibold">{isTestMode ? 'ON' : 'OFF'}</span>
            </button>

            {/* Channels Status Group */}
            <div className="hidden xl:flex items-center gap-1.5">
              {/* WordPress Status */}
              <div
                className={`flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-medium border ${
                  wpConnected
                    ? 'bg-blue-500/10 border-blue-500/30 text-blue-400'
                    : 'bg-slate-800/60 border-slate-700/60 text-slate-400'
                }`}
                title={wpConnected ? 'WordPress Connected' : 'WordPress Not Connected'}
              >
                <div className={`w-1.5 h-1.5 rounded-full ${wpConnected ? 'bg-blue-400' : 'bg-slate-500'}`} />
                <span>WP</span>
              </div>

              {/* Facebook Status */}
              <div
                className={`flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-medium border ${
                  fbConnected
                    ? 'bg-indigo-500/10 border-indigo-500/30 text-indigo-400'
                    : 'bg-slate-800/60 border-slate-700/60 text-slate-400'
                }`}
                title={fbConnected ? 'Facebook Connected' : 'Facebook Not Connected'}
              >
                <div className={`w-1.5 h-1.5 rounded-full ${fbConnected ? 'bg-indigo-400' : 'bg-slate-500'}`} />
                <span>FB</span>
              </div>

              {/* Pinterest Status */}
              <div
                className={`flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-medium border ${
                  pinConnected
                    ? 'bg-red-500/10 border-red-500/30 text-red-400'
                    : 'bg-slate-800/60 border-slate-700/60 text-slate-400'
                }`}
                title={pinConnected ? 'Pinterest Connected' : 'Pinterest Not Connected'}
              >
                <div className={`w-1.5 h-1.5 rounded-full ${pinConnected ? 'bg-red-400' : 'bg-slate-500'}`} />
                <span>Pin</span>
              </div>

              {/* Instagram Status */}
              <div
                className={`flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-medium border ${
                  igConnected
                    ? 'bg-fuchsia-500/10 border-fuchsia-500/30 text-fuchsia-400'
                    : 'bg-slate-800/60 border-slate-700/60 text-slate-400'
                }`}
                title={igConnected ? 'Instagram Connected' : 'Instagram Not Connected'}
              >
                <div className={`w-1.5 h-1.5 rounded-full ${igConnected ? 'bg-fuchsia-400' : 'bg-slate-500'}`} />
                <span>IG</span>
              </div>
            </div>

            {/* Model Badge & BYOK Indicator */}
            <button
              onClick={() => onTabChange('settings')}
              className="hidden lg:flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800/90 hover:bg-slate-700/90 border border-slate-700 hover:border-emerald-500/50 text-slate-300 text-xs transition-colors"
              title="Click to configure Bring-Your-Own-Key (BYOK) & Multi-Model selection"
            >
              <KeyRound className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-emerald-400 font-semibold">{settings?.activeModel || settings?.gemini?.model || 'gemini-3.8-flash'}</span>
              <span className="text-[10px] uppercase font-bold text-slate-400 px-1 py-0.2 rounded bg-slate-900">BYOK</span>
            </button>
          </div>
        </div>

        {/* Workspace Navigation Bar */}
        <nav className="flex space-x-1 sm:space-x-2 overflow-x-auto no-scrollbar py-2 border-t border-slate-800/60">
          {tabs.map(tab => {
            const Icon = tab.icon;
            const isActive = currentTab === tab.id;
            return (
              <button
                key={tab.id}
                id={`nav-tab-${tab.id}`}
                onClick={() => onTabChange(tab.id)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-400' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
