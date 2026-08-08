import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { HackathonCard } from './components/HackathonCard';
import { FilterSidebar } from './components/FilterSidebar';
import { HackathonModal } from './components/HackathonModal';
import { TeamFormationView } from './components/TeamFormationView';
import { OpportunityDashboard } from './components/OpportunityDashboard';
import { MissedOpportunityWidget } from './components/MissedOpportunityWidget';
import { WeeklyDigestView } from './components/WeeklyDigestView';
import { ScraperArchitectureModal } from './components/ScraperArchitectureModal';
import { OnboardingModal } from './components/OnboardingModal';

import { Hackathon, TeamPosting, HackathonFilterOptions, ScraperSourceStatus, NotificationItem } from './types';

export default function App() {
  const [activeTab, setActiveTab] = useState<'feed' | 'teams' | 'dashboard' | 'missed' | 'digest' | 'architecture'>('feed');

  // State
  const [hackathons, setHackathons] = useState<Hackathon[]>([]);
  const [savedIds, setSavedIds] = useState<string[]>([]);
  const [teamPostings, setTeamPostings] = useState<TeamPosting[]>([]);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [unreadNotifCount, setUnreadNotifCount] = useState(2);
  const [scraperStatuses, setScraperStatuses] = useState<ScraperSourceStatus[]>([]);
  const [isSyncingScraper, setIsSyncingScraper] = useState(false);

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<HackathonFilterOptions>({
    searchQuery: '',
    themes: [],
    mode: 'All',
    location: 'All',
    minPrizePool: 0,
    difficulty: 'All',
    isStudentOnly: false,
    allowsSolo: false,
    isClosingSoon: false,
    source: 'All',
    sortBy: 'recommended'
  });

  // User Profile / Onboarding State
  const [userRole, setUserRole] = useState<'AI/ML Engineer' | 'Full Stack Developer' | 'UI/UX Designer' | 'Cybersecurity Specialist' | 'Web3 / Blockchain Dev' | 'Mobile Developer'>('AI/ML Engineer');
  const [userInterests, setUserInterests] = useState<string[]>(['AI', 'Web Development', 'Cybersecurity']);
  const [showOnboarding, setShowOnboarding] = useState(false);

  // Selected Modal State
  const [selectedHackathon, setSelectedHackathon] = useState<Hackathon | null>(null);

  // Metrics State
  const [metrics, setMetrics] = useState({
    totalActiveHackathons: 450,
    totalPrizeMoneyINR: 38000000,
    formattedPrizeMoney: '₹3.80 Crore',
    closingThisWeekCount: 3,
    totalDevelopersConnected: 12500
  });

  // Fetch initial data
  useEffect(() => {
    fetchHackathons();
    fetchTeams();
    fetchAnalytics();
    fetchNotifications();
  }, [searchQuery, filters]);

  const fetchHackathons = async () => {
    try {
      const queryParams = new URLSearchParams();
      if (searchQuery) queryParams.append('search', searchQuery);
      if (filters.themes.length > 0) queryParams.append('theme', filters.themes.join(','));
      if (filters.mode !== 'All') queryParams.append('mode', filters.mode);
      if (filters.location !== 'All') queryParams.append('location', filters.location);
      if (filters.minPrizePool > 0) queryParams.append('minPrize', filters.minPrizePool.toString());
      if (filters.isStudentOnly) queryParams.append('studentOnly', 'true');
      if (filters.allowsSolo) queryParams.append('allowsSolo', 'true');
      if (filters.isClosingSoon) queryParams.append('closingSoon', 'true');
      if (filters.source !== 'All') queryParams.append('source', filters.source);
      queryParams.append('sortBy', filters.sortBy);

      const res = await fetch(`/api/hackathons?${queryParams.toString()}`);
      const data = await res.json();
      if (data.success) {
        setHackathons(data.hackathons);
        if (data.savedIds) setSavedIds(data.savedIds);
      }
    } catch (err) {
      console.error("Failed to fetch hackathons:", err);
    }
  };

  const fetchTeams = async () => {
    try {
      const res = await fetch('/api/teams');
      const data = await res.json();
      if (data.success) {
        setTeamPostings(data.teams);
      }
    } catch (err) {
      console.error("Failed to fetch teams:", err);
    }
  };

  const fetchAnalytics = async () => {
    try {
      const res = await fetch('/api/analytics');
      const data = await res.json();
      if (data.success) {
        setMetrics(data.metrics);
        setScraperStatuses(data.scraperStatuses);
      }
    } catch (err) {
      console.error("Failed to fetch analytics:", err);
    }
  };

  const fetchNotifications = async () => {
    try {
      const res = await fetch('/api/notifications');
      const data = await res.json();
      if (data.success) {
        setNotifications(data.notifications);
        setUnreadNotifCount(data.notifications.filter((n: NotificationItem) => !n.read).length);
      }
    } catch (err) {
      console.error("Failed to fetch notifications:", err);
    }
  };

  const handleToggleSave = async (hackathonId: string) => {
    try {
      const res = await fetch('/api/hackathons/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ hackathonId })
      });
      const data = await res.json();
      if (data.success) {
        setSavedIds(data.savedIds);
        setHackathons((prev) =>
          prev.map((h) => (h.id === hackathonId ? { ...h, savesCount: data.savesCount } : h))
        );
      }
    } catch (err) {
      console.error("Failed to toggle save:", err);
    }
  };

  const handleTriggerScrape = async (sourceName?: string) => {
    setIsSyncingScraper(true);
    try {
      const res = await fetch('/api/scraper/trigger', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sourceName })
      });
      const data = await res.json();
      if (data.success) {
        setScraperStatuses(data.sources);
        fetchHackathons();
      }
    } catch (err) {
      console.error("Failed to trigger scraper:", err);
    } finally {
      setIsSyncingScraper(false);
    }
  };

  const handleCreateTeamPosting = async (postingData: any) => {
    try {
      const res = await fetch('/api/teams', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(postingData)
      });
      const data = await res.json();
      if (data.success) {
        setTeamPostings((prev) => [data.team, ...prev]);
        setActiveTab('teams');
      }
    } catch (err) {
      console.error("Failed to create team posting:", err);
    }
  };

  const handleJoinTeam = async (teamId: string, applicantName: string, role: string) => {
    try {
      await fetch(`/api/teams/${teamId}/join`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ applicantName, role })
      });
      fetchTeams();
    } catch (err) {
      console.error("Failed to join team:", err);
    }
  };

  const handleMarkNotificationsRead = async () => {
    try {
      await fetch('/api/notifications/mark-read', { method: 'POST' });
      setUnreadNotifCount(0);
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    } catch (err) {
      console.error("Failed to mark read:", err);
    }
  };

  const resetFilters = () => {
    setFilters({
      searchQuery: '',
      themes: [],
      mode: 'All',
      location: 'All',
      minPrizePool: 0,
      difficulty: 'All',
      isStudentOnly: false,
      allowsSolo: false,
      isClosingSoon: false,
      source: 'All',
      sortBy: 'recommended'
    });
    setSearchQuery('');
  };

  const savedHackathons = hackathons.filter((h) => savedIds.includes(h.id));

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-indigo-500 selection:text-white flex flex-col">
      
      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        savedIds={savedIds}
        savedHackathons={savedHackathons}
        notifications={notifications}
        unreadCount={unreadNotifCount}
        onMarkNotificationsRead={handleMarkNotificationsRead}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onOpenOnboarding={() => setShowOnboarding(true)}
        userRole={userRole}
      />

      {/* Hero Header Section (Visible on Discovery Feed tab) */}
      {activeTab === 'feed' && (
        <HeroSection
          totalActiveCount={metrics.totalActiveHackathons}
          totalPrizeFormatted={metrics.formattedPrizeMoney}
          totalDevsConnected={metrics.totalDevelopersConnected}
          onExploreClick={() => {
            const feedElement = document.getElementById('hackathon-feed-anchor');
            if (feedElement) feedElement.scrollIntoView({ behavior: 'smooth' });
          }}
          onQuickSearchTag={(tag) => setSearchQuery(tag)}
          onMissedScoreClick={() => setActiveTab('missed')}
        />
      )}

      {/* Main Container Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* TAB 1: DISCOVERY HACKATHON FEED */}
        {activeTab === 'feed' && (
          <div id="hackathon-feed-anchor" className="grid grid-cols-1 md:grid-cols-4 gap-6 items-start">
            
            {/* Left Column: Smart Filter Sidebar */}
            <div className="md:col-span-1 sticky top-20">
              <FilterSidebar
                filters={filters}
                setFilters={setFilters}
                onReset={resetFilters}
              />
            </div>

            {/* Right Column: Hackathons Feed & Sorting Header */}
            <div className="md:col-span-3 space-y-4">
              
              {/* Sort & Results Bar */}
              <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-200">{hackathons.length} Active Opportunities Found</span>
                  {searchQuery && (
                    <span className="px-2 py-0.5 bg-indigo-500/20 text-indigo-300 rounded-md font-medium">
                      Matching "{searchQuery}"
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <span className="text-slate-400 font-medium whitespace-nowrap">Sort by:</span>
                  <select
                    value={filters.sortBy}
                    onChange={(e) => setFilters({ ...filters, sortBy: e.target.value as any })}
                    className="bg-slate-950 border border-slate-800 text-slate-200 rounded-xl px-3 py-1.5 focus:outline-none focus:border-indigo-500 text-xs w-full sm:w-auto font-medium"
                  >
                    <option value="recommended">⭐ Top Recommended Match</option>
                    <option value="deadline">⏰ Closing Soonest</option>
                    <option value="prize_high">🏆 Prize Pool: High to Low</option>
                    <option value="trending">🔥 Most Saves & Trending</option>
                    <option value="newest">✨ Recently Scraped</option>
                  </select>
                </div>
              </div>

              {/* Cards Grid */}
              {hackathons.length === 0 ? (
                <div className="p-12 text-center bg-slate-900/60 border border-slate-800 rounded-2xl space-y-3">
                  <div className="text-2xl">🔍</div>
                  <h3 className="font-bold text-lg text-slate-200">No hackathons match your current filter selection</h3>
                  <p className="text-xs text-slate-400 max-w-sm mx-auto">Try clearing search terms or resetting theme filters to view all 450+ opportunities across Unstop, Devfolio, and Devpost.</p>
                  <button
                    onClick={resetFilters}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs rounded-xl transition-all"
                  >
                    Reset All Filters
                  </button>
                </div>
              ) : (
                <div className="grid sm:grid-cols-2 gap-4">
                  {hackathons.map((hack) => (
                    <HackathonCard
                      key={hack.id}
                      hackathon={hack}
                      isSaved={savedIds.includes(hack.id)}
                      onToggleSave={handleToggleSave}
                      onSelect={(h) => setSelectedHackathon(h)}
                      onFindTeam={(h) => {
                        setSelectedHackathon(h);
                      }}
                    />
                  ))}
                </div>
              )}

            </div>

          </div>
        )}

        {/* TAB 2: TEAM FORMATION */}
        {activeTab === 'teams' && (
          <TeamFormationView
            teamPostings={teamPostings}
            hackathons={hackathons}
            onCreateTeamPosting={handleCreateTeamPosting}
            onJoinTeam={handleJoinTeam}
          />
        )}

        {/* TAB 3: OPPORTUNITY DASHBOARD & METRICS */}
        {activeTab === 'dashboard' && (
          <OpportunityDashboard
            metrics={metrics}
            scraperStatuses={scraperStatuses}
            onTriggerScrape={handleTriggerScrape}
            isSyncing={isSyncingScraper}
          />
        )}

        {/* TAB 4: MISSED OPPORTUNITY SCORE */}
        {activeTab === 'missed' && (
          <MissedOpportunityWidget
            userRole={userRole}
            setUserRole={setUserRole}
            onExploreClick={() => setActiveTab('feed')}
          />
        )}

        {/* TAB 5: WEEKLY AI DIGEST */}
        {activeTab === 'digest' && (
          <WeeklyDigestView
            userRole={userRole}
            onExploreClick={() => setActiveTab('feed')}
          />
        )}

        {/* TAB 6: DOCS & ROADMAP */}
        {activeTab === 'architecture' && (
          <ScraperArchitectureModal />
        )}

      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-800/80 bg-slate-950 py-8 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-300">HackRadar</span>
            <span>— Unified Hackathon Discovery Engine for Developers & Students across India.</span>
          </div>

          <div className="flex items-center gap-4 text-slate-400">
            <button onClick={() => setActiveTab('feed')} className="hover:text-white">Discovery</button>
            <button onClick={() => setActiveTab('teams')} className="hover:text-white">Teams</button>
            <button onClick={() => setActiveTab('dashboard')} className="hover:text-white">Analytics</button>
            <button onClick={() => setActiveTab('architecture')} className="hover:text-white">Docs & Roadmap</button>
          </div>
        </div>
      </footer>

      {/* Hackathon Details Modal */}
      {selectedHackathon && (
        <HackathonModal
          hackathon={selectedHackathon}
          onClose={() => setSelectedHackathon(null)}
          isSaved={savedIds.includes(selectedHackathon.id)}
          onToggleSave={handleToggleSave}
          teamPostings={teamPostings}
          onCreateTeamPosting={(hackathonId) => {
            setActiveTab('teams');
          }}
        />
      )}

      {/* Onboarding Preference Customizer Modal */}
      {showOnboarding && (
        <OnboardingModal
          userRole={userRole}
          setUserRole={setUserRole}
          userInterests={userInterests}
          setUserInterests={setUserInterests}
          onClose={() => setShowOnboarding(false)}
        />
      )}

    </div>
  );
}
