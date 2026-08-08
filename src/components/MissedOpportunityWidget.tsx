import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle2, 
  Sparkles, 
  ArrowRight, 
  Trophy, 
  Clock, 
  ShieldAlert,
  BellRing
} from 'lucide-react';
import { MissedOpportunityData } from '../types';

interface MissedOpportunityWidgetProps {
  userRole: string;
  setUserRole: (role: any) => void;
  onExploreClick: () => void;
}

export const MissedOpportunityWidget: React.FC<MissedOpportunityWidgetProps> = ({
  userRole,
  setUserRole,
  onExploreClick
}) => {
  const [data, setData] = useState<MissedOpportunityData | null>(null);
  const [loading, setLoading] = useState(false);
  const [gradYear, setGradYear] = useState('2026');

  useEffect(() => {
    fetchMissedData();
  }, [userRole, gradYear]);

  const fetchMissedData = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/missed-opportunities?role=${encodeURIComponent(userRole)}`);
      const json = await res.json();
      if (json.success) {
        setData(json.missedData);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 text-slate-100">
      
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-amber-950/40 via-slate-900 to-slate-900 border border-amber-500/30 rounded-2xl p-6 relative overflow-hidden">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2.5 bg-amber-500/20 text-amber-400 rounded-xl border border-amber-500/30">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-2xl font-extrabold text-white">Missed Opportunity Score</h2>
            <p className="text-xs text-amber-300/80 font-medium">Calculated based on developer demographics & tech stack in India</p>
          </div>
        </div>

        {/* Dynamic Big Stat */}
        <div className="my-6 p-6 bg-slate-950/80 border border-amber-500/20 rounded-2xl text-center max-w-2xl mx-auto shadow-2xl">
          <span className="text-xs font-bold text-amber-400 uppercase tracking-widest block mb-2">
            Last Month's Opportunity Gap
          </span>
          
          <div className="text-3xl sm:text-5xl font-extrabold text-amber-300 leading-tight">
            You missed <span className="text-white underline decoration-amber-400">{data?.missedCount || 12} hackathons</span> worth{' '}
            <span className="text-emerald-400">{data?.formattedValue || '₹4.2 Lakh'}</span> in prizes.
          </div>

          <p className="text-xs text-slate-400 mt-3 max-w-lg mx-auto">
            Without a unified aggregator, Indian developers visit 8+ separate sites and miss 60%+ of active registrations.
          </p>
        </div>

        {/* Recalculate Inputs */}
        <div className="grid sm:grid-cols-2 gap-4 max-w-xl mx-auto pt-4 border-t border-slate-800 text-xs">
          <div>
            <label className="text-slate-400 font-semibold block mb-1">Your Developer Role</label>
            <select
              value={userRole}
              onChange={(e) => setUserRole(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 text-slate-200 rounded-xl p-2.5 focus:outline-none focus:border-amber-500"
            >
              <option value="AI/ML Engineer">AI / ML Engineer</option>
              <option value="Full Stack Developer">Full Stack Developer</option>
              <option value="UI/UX Designer">UI / UX Designer</option>
              <option value="Cybersecurity Specialist">Cybersecurity Specialist</option>
              <option value="Web3 / Blockchain Dev">Web3 / Blockchain Developer</option>
            </select>
          </div>

          <div>
            <label className="text-slate-400 font-semibold block mb-1">Graduation / Target Year</label>
            <select
              value={gradYear}
              onChange={(e) => setGradYear(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 text-slate-200 rounded-xl p-2.5 focus:outline-none focus:border-amber-500"
            >
              <option value="2025">2025 (Fresher / Job Seeker)</option>
              <option value="2026">2026 (Final Year)</option>
              <option value="2027">2027 (Pre-Final Year)</option>
              <option value="2028">2028 (Sophomore / Beginner)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Recovery Action Plan */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 space-y-4">
        <h3 className="font-bold text-base text-slate-100 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-indigo-400" />
          <span>Zero-Miss Opportunity Checklist</span>
        </h3>

        <div className="space-y-3 text-xs">
          <div className="p-3.5 bg-slate-950 border border-slate-800 rounded-xl flex items-start gap-3">
            <BellRing className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
            <div>
              <div className="font-bold text-slate-200">Enable Deadline Alerts in Top Bar</div>
              <div className="text-slate-400">Get 48-hour & 24-hour warning badges before registrations close on Unstop & Devfolio.</div>
            </div>
          </div>

          <div className="p-3.5 bg-slate-950 border border-slate-800 rounded-xl flex items-start gap-3">
            <Trophy className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <div className="font-bold text-slate-200">Save Top 3 Recommended Opportunities Today</div>
              <div className="text-slate-400">Bookmarked hackathons sync directly into your personal watchlist drawer.</div>
            </div>
          </div>
        </div>

        <button
          onClick={onExploreClick}
          className="w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/20 transition-all"
        >
          <span>Explore Live Hackathons Now</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

    </div>
  );
};
