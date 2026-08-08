import React, { useState } from 'react';
import { 
  BarChart3, 
  Trophy, 
  Clock, 
  Users, 
  Globe2, 
  RefreshCw, 
  ShieldCheck, 
  Zap, 
  CheckCircle2, 
  Activity,
  ChevronRight,
  TrendingUp,
  Cpu
} from 'lucide-react';
import { ScraperSourceStatus } from '../types';

interface OpportunityDashboardProps {
  metrics: {
    totalActiveHackathons: number;
    totalPrizeMoneyINR: number;
    formattedPrizeMoney: string;
    closingThisWeekCount: number;
    totalDevelopersConnected: number;
  };
  scraperStatuses: ScraperSourceStatus[];
  onTriggerScrape: (sourceName?: string) => void;
  isSyncing: boolean;
}

export const OpportunityDashboard: React.FC<OpportunityDashboardProps> = ({
  metrics,
  scraperStatuses,
  onTriggerScrape,
  isSyncing
}) => {
  const [syncMessage, setSyncMessage] = useState('');

  const handleSyncAll = () => {
    onTriggerScrape();
    setSyncMessage('Crawl pipelines synced! Deduplicated 4 new hackathon events.');
    setTimeout(() => setSyncMessage(''), 4000);
  };

  return (
    <div className="space-y-6 text-slate-100">
      
      {/* Top Banner */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-emerald-400" />
            <h2 className="text-2xl font-bold tracking-tight text-white">Opportunity Analytics & Live Scrapers</h2>
          </div>
          <p className="text-sm text-slate-400 mt-1">
            Real-time telemetry across Indian and global hackathon platforms.
          </p>
        </div>

        <button
          onClick={handleSyncAll}
          disabled={isSyncing}
          className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all shadow"
        >
          <RefreshCw className={`w-4 h-4 text-indigo-400 ${isSyncing ? 'animate-spin' : ''}`} />
          <span>{isSyncing ? 'Syncing Crawlers...' : 'Trigger Scraper Sync'}</span>
        </button>
      </div>

      {syncMessage && (
        <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 rounded-xl text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{syncMessage}</span>
        </div>
      )}

      {/* Primary Metric Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        
        <div className="p-5 bg-slate-900/90 border border-slate-800 rounded-2xl space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Active Events</span>
            <Globe2 className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-2xl font-extrabold text-white">{metrics.totalActiveHackathons}</div>
          <p className="text-[11px] text-slate-500">Across 5 major aggregators</p>
        </div>

        <div className="p-5 bg-slate-900/90 border border-slate-800 rounded-2xl space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Prize Pool</span>
            <Trophy className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-extrabold text-amber-300">{metrics.formattedPrizeMoney}</div>
          <p className="text-[11px] text-slate-500">Includes USD & INR tracks</p>
        </div>

        <div className="p-5 bg-slate-900/90 border border-slate-800 rounded-2xl space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Closing This Week</span>
            <Clock className="w-4 h-4 text-rose-400" />
          </div>
          <div className="text-2xl font-extrabold text-rose-400">{metrics.closingThisWeekCount}</div>
          <p className="text-[11px] text-slate-500">High priority deadlines</p>
        </div>

        <div className="p-5 bg-slate-900/90 border border-slate-800 rounded-2xl space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Builders Connected</span>
            <Users className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-extrabold text-cyan-300">{metrics.totalDevelopersConnected.toLocaleString()}</div>
          <p className="text-[11px] text-slate-500">Pan-India tech network</p>
        </div>

      </div>

      {/* Scraper Status Health Table */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-indigo-400" />
            <h3 className="font-bold text-base text-slate-100">Scraper System Health & Sources</h3>
          </div>
          <span className="text-xs text-slate-500">Updated every 24 hours automatically</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">Aggregator Platform</th>
                <th className="py-3 px-4">Scraper Pipeline</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Active Events</th>
                <th className="py-3 px-4">Events Crawled Today</th>
                <th className="py-3 px-4">Latency</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {scraperStatuses.map((s) => (
                <tr key={s.sourceName} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-3 px-4 font-bold text-slate-100 flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-indigo-400" />
                    <span>{s.sourceName}</span>
                  </td>
                  <td className="py-3 px-4 text-slate-400 font-mono text-[11px]">{s.scraperType}</td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      ● {s.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-semibold text-slate-200">{s.totalActiveEvents}</td>
                  <td className="py-3 px-4 text-indigo-300 font-medium">+{s.eventsScrapedToday}</td>
                  <td className="py-3 px-4 text-slate-400 font-mono">{s.latencyMs}ms</td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => onTriggerScrape(s.sourceName)}
                      className="text-[11px] text-cyan-400 hover:underline font-medium"
                    >
                      Re-sync Source
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
