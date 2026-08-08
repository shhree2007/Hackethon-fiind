import React, { useState } from 'react';
import { 
  Radar, 
  Search, 
  Bookmark, 
  Bell, 
  Users, 
  Compass, 
  BarChart3, 
  Cpu, 
  Sparkles, 
  TrendingUp,
  X,
  CheckCircle2,
  ExternalLink,
  ChevronRight,
  User,
  SlidersHorizontal
} from 'lucide-react';
import { Hackathon, NotificationItem } from '../types';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  savedIds: string[];
  savedHackathons: Hackathon[];
  notifications: NotificationItem[];
  unreadCount: number;
  onMarkNotificationsRead: () => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  onOpenOnboarding: () => void;
  userRole: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  savedIds,
  savedHackathons,
  notifications,
  unreadCount,
  onMarkNotificationsRead,
  searchQuery,
  setSearchQuery,
  onOpenOnboarding,
  userRole
}) => {
  const [showNotifDropdown, setShowNotifDropdown] = useState(false);
  const [showSavedDrawer, setShowSavedDrawer] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-md border-b border-slate-800 text-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Logo */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('feed')}>
            <div className="relative p-2 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl shadow-lg shadow-indigo-500/20 text-white">
              <Radar className="w-6 h-6 animate-pulse" />
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full ring-2 ring-slate-950"></span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-xl tracking-tight bg-gradient-to-r from-white via-slate-200 to-indigo-200 bg-clip-text text-transparent">
                  HackRadar
                </span>
                <span className="px-2 py-0.5 text-[10px] font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded-full tracking-wide uppercase">
                  India Hub
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">Aggregating Unstop, Devfolio, Devpost & More</p>
            </div>
          </div>

          {/* Quick Search Bar */}
          <div className="hidden md:flex flex-1 max-w-md mx-4 relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search AI, Web3, SIH, Unstop, Delhi NCR..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-900/80 border border-slate-800 rounded-full pl-9 pr-8 py-1.5 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1">
            <button
              onClick={() => setActiveTab('feed')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'feed'
                  ? 'bg-slate-800 text-white border border-slate-700'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <Compass className="w-4 h-4 text-indigo-400" />
              <span>Discovery</span>
            </button>

            <button
              onClick={() => setActiveTab('teams')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'teams'
                  ? 'bg-slate-800 text-white border border-slate-700'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <Users className="w-4 h-4 text-cyan-400" />
              <span>Teams</span>
            </button>

            <button
              onClick={() => setActiveTab('dashboard')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'dashboard'
                  ? 'bg-slate-800 text-white border border-slate-700'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <BarChart3 className="w-4 h-4 text-emerald-400" />
              <span>Metrics</span>
            </button>

            <button
              onClick={() => setActiveTab('missed')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'missed'
                  ? 'bg-amber-500/10 text-amber-300 border border-amber-500/30'
                  : 'text-slate-400 hover:text-amber-300 hover:bg-amber-500/5'
              }`}
            >
              <TrendingUp className="w-4 h-4 text-amber-400" />
              <span>Missed Score</span>
            </button>

            <button
              onClick={() => setActiveTab('digest')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'digest'
                  ? 'bg-purple-500/10 text-purple-300 border border-purple-500/30'
                  : 'text-slate-400 hover:text-purple-300 hover:bg-purple-500/5'
              }`}
            >
              <Sparkles className="w-4 h-4 text-purple-400" />
              <span>AI Digest</span>
            </button>

            <button
              onClick={() => setActiveTab('architecture')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'architecture'
                  ? 'bg-slate-800 text-white border border-slate-700'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <Cpu className="w-4 h-4 text-slate-400" />
              <span>Docs & Roadmap</span>
            </button>
          </nav>

          {/* Action Icons */}
          <div className="flex items-center gap-2">
            
            {/* Watchlist Bookmark Drawer Trigger */}
            <button
              onClick={() => setShowSavedDrawer(!showSavedDrawer)}
              className="relative p-2 text-slate-300 hover:text-white hover:bg-slate-800/80 rounded-xl border border-slate-800 transition-colors"
              title="Saved Watchlist"
            >
              <Bookmark className="w-5 h-5 text-amber-400" />
              {savedIds.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-amber-500 text-slate-950 font-bold text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
                  {savedIds.length}
                </span>
              )}
            </button>

            {/* Notification Center */}
            <div className="relative">
              <button
                onClick={() => {
                  setShowNotifDropdown(!showNotifDropdown);
                  if (unreadCount > 0) onMarkNotificationsRead();
                }}
                className="relative p-2 text-slate-300 hover:text-white hover:bg-slate-800/80 rounded-xl border border-slate-800 transition-colors"
                title="Deadline Alerts"
              >
                <Bell className="w-5 h-5 text-indigo-400" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white font-bold text-[10px] w-4 h-4 rounded-full flex items-center justify-center animate-pulse">
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* Notification Dropdown */}
              {showNotifDropdown && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl z-50 overflow-hidden">
                  <div className="p-3 border-b border-slate-800 flex items-center justify-between bg-slate-950">
                    <div className="flex items-center gap-2">
                      <Bell className="w-4 h-4 text-indigo-400" />
                      <span className="font-semibold text-sm text-slate-100">Deadline Alerts</span>
                    </div>
                    <button 
                      onClick={onMarkNotificationsRead}
                      className="text-xs text-indigo-400 hover:underline"
                    >
                      Mark read
                    </button>
                  </div>
                  <div className="max-h-80 overflow-y-auto divide-y divide-slate-800/60">
                    {notifications.map((n) => (
                      <div key={n.id} className={`p-3 text-xs transition-colors ${n.read ? 'bg-slate-900/50' : 'bg-indigo-950/20'}`}>
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <span className="font-semibold text-slate-200">{n.title}</span>
                          <span className="text-[10px] text-slate-500">{n.timestamp}</span>
                        </div>
                        <p className="text-slate-400 leading-relaxed">{n.message}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Profile & Role Onboarding Button */}
            <button
              onClick={onOpenOnboarding}
              className="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-indigo-600/30 to-purple-600/30 hover:from-indigo-600/40 hover:to-purple-600/40 border border-indigo-500/30 text-indigo-200 rounded-xl text-xs font-medium transition-all"
            >
              <User className="w-3.5 h-3.5 text-indigo-400" />
              <span className="hidden sm:inline">{userRole || 'AI Engineer'}</span>
              <SlidersHorizontal className="w-3 h-3 text-slate-400" />
            </button>

          </div>
        </div>

        {/* Mobile Navigation Tabs Bar */}
        <div className="flex lg:hidden overflow-x-auto py-2 gap-2 border-t border-slate-800/60 no-scrollbar">
          <button
            onClick={() => setActiveTab('feed')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium whitespace-nowrap ${
              activeTab === 'feed' ? 'bg-indigo-600 text-white' : 'bg-slate-900 text-slate-400'
            }`}
          >
            <Compass className="w-3.5 h-3.5" /> Discovery
          </button>
          <button
            onClick={() => setActiveTab('teams')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium whitespace-nowrap ${
              activeTab === 'teams' ? 'bg-indigo-600 text-white' : 'bg-slate-900 text-slate-400'
            }`}
          >
            <Users className="w-3.5 h-3.5" /> Teams
          </button>
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium whitespace-nowrap ${
              activeTab === 'dashboard' ? 'bg-indigo-600 text-white' : 'bg-slate-900 text-slate-400'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" /> Metrics
          </button>
          <button
            onClick={() => setActiveTab('missed')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium whitespace-nowrap ${
              activeTab === 'missed' ? 'bg-amber-600 text-white' : 'bg-slate-900 text-slate-400'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5" /> Missed Score
          </button>
          <button
            onClick={() => setActiveTab('digest')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium whitespace-nowrap ${
              activeTab === 'digest' ? 'bg-purple-600 text-white' : 'bg-slate-900 text-slate-400'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" /> AI Digest
          </button>
          <button
            onClick={() => setActiveTab('architecture')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium whitespace-nowrap ${
              activeTab === 'architecture' ? 'bg-indigo-600 text-white' : 'bg-slate-900 text-slate-400'
            }`}
          >
            <Cpu className="w-3.5 h-3.5" /> Roadmap
          </button>
        </div>

      </div>

      {/* Saved Watchlist Slide-out Drawer */}
      {showSavedDrawer && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex justify-end">
          <div className="w-full max-w-md bg-slate-900 border-l border-slate-800 h-full p-6 flex flex-col shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-4">
              <div className="flex items-center gap-2">
                <Bookmark className="w-5 h-5 text-amber-400" />
                <h3 className="font-bold text-lg text-slate-100">Saved Hackathons ({savedHackathons.length})</h3>
              </div>
              <button 
                onClick={() => setShowSavedDrawer(false)}
                className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-3 pr-1">
              {savedHackathons.length === 0 ? (
                <div className="text-center py-12 text-slate-500">
                  <Bookmark className="w-10 h-10 mx-auto mb-2 text-slate-700" />
                  <p className="text-sm">No saved hackathons yet.</p>
                  <p className="text-xs text-slate-600 mt-1">Bookmark opportunities from the feed to track deadlines here!</p>
                </div>
              ) : (
                savedHackathons.map((h) => (
                  <div key={h.id} className="p-3.5 bg-slate-950/60 border border-slate-800 rounded-xl flex flex-col gap-2 hover:border-slate-700 transition-colors">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="text-[10px] font-semibold text-indigo-400 uppercase tracking-wider">{h.source}</span>
                        <h4 className="font-semibold text-sm text-slate-200 line-clamp-1">{h.name}</h4>
                      </div>
                      <span className="px-2 py-0.5 text-[11px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded-md">
                        {h.prizePool}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-xs text-slate-400">
                      <span>{h.location} • {h.mode}</span>
                      <span className="text-rose-400 font-medium">Deadline: {new Date(h.registrationDeadline).toLocaleDateString()}</span>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 mt-1">
                      <a
                        href={h.registrationUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs text-indigo-400 hover:text-indigo-300 font-medium flex items-center gap-1"
                      >
                        Apply Now <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
