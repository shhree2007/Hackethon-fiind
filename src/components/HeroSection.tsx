import React from 'react';
import { 
  Sparkles, 
  Search, 
  Zap, 
  Trophy, 
  Users, 
  Globe2, 
  ArrowRight, 
  TrendingUp,
  ShieldCheck,
  Building2,
  CheckCircle
} from 'lucide-react';

interface HeroSectionProps {
  totalActiveCount: number;
  totalPrizeFormatted: string;
  totalDevsConnected: number;
  onExploreClick: () => void;
  onQuickSearchTag: (tag: string) => void;
  onMissedScoreClick: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  totalActiveCount,
  totalPrizeFormatted,
  totalDevsConnected,
  onExploreClick,
  onQuickSearchTag,
  onMissedScoreClick
}) => {
  const POPULAR_TAGS = ['AI & ML', 'Web Development', 'Cybersecurity', 'Blockchain', 'Delhi NCR', 'Bengaluru', 'Devfolio', 'Unstop'];

  return (
    <section className="relative overflow-hidden bg-slate-950 border-b border-slate-800/80 pt-8 pb-12 text-slate-100">
      {/* Glow ambient background elements */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-72 bg-gradient-to-tr from-indigo-600/10 via-purple-600/15 to-pink-500/10 blur-3xl pointer-events-none rounded-full" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Top Tagline Pill */}
        <div className="flex justify-center mb-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-semibold shadow-inner">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400 animate-spin" />
            <span>Google Flights for Hackathons • Aggregating Unstop, Devfolio, Devpost & Reskilll</span>
          </div>
        </div>

        {/* Hero Title & Subheading */}
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.15] mb-4">
            Never Miss a <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-indigo-400 via-purple-300 to-amber-300 bg-clip-text text-transparent">
              Hackathon Again.
            </span>
          </h1>
          <p className="text-base sm:text-lg text-slate-300 leading-relaxed font-normal mb-8">
            Discover hackathons from across the internet in one place. Track deadlines, find teammates, and win more opportunities.
          </p>

          {/* Call to Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-10">
            <button
              onClick={onExploreClick}
              className="w-full sm:w-auto px-6 py-3.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold text-sm rounded-xl shadow-lg shadow-indigo-600/25 flex items-center justify-center gap-2 transition-all hover:scale-[1.02]"
            >
              <Zap className="w-4 h-4 fill-white" />
              <span>Explore All Hackathons</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={onMissedScoreClick}
              className="w-full sm:w-auto px-6 py-3.5 bg-slate-900 hover:bg-slate-800 border border-slate-700/80 text-amber-300 font-semibold text-sm rounded-xl flex items-center justify-center gap-2 transition-all"
            >
              <TrendingUp className="w-4 h-4 text-amber-400" />
              <span>Check Missed Prize Money Score</span>
            </button>
          </div>

          {/* Quick Filter Tag Chips */}
          <div className="flex flex-wrap items-center justify-center gap-2">
            <span className="text-xs text-slate-500 font-medium mr-1">Trending Tracks:</span>
            {POPULAR_TAGS.map((tag) => (
              <button
                key={tag}
                onClick={() => onQuickSearchTag(tag)}
                className="px-2.5 py-1 text-xs font-medium bg-slate-900/90 hover:bg-indigo-950/80 text-slate-300 hover:text-indigo-200 border border-slate-800 hover:border-indigo-500/40 rounded-lg transition-all"
              >
                #{tag}
              </button>
            ))}
          </div>
        </div>

        {/* Live Statistics Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12 pt-8 border-t border-slate-800/60">
          
          <div className="p-4 bg-slate-900/60 border border-slate-800/80 rounded-2xl flex items-center gap-3">
            <div className="p-2.5 bg-indigo-500/10 text-indigo-400 rounded-xl border border-indigo-500/20">
              <Globe2 className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xl sm:text-2xl font-bold text-slate-100">{totalActiveCount}+</div>
              <div className="text-xs text-slate-400 font-medium">Active Opportunities</div>
            </div>
          </div>

          <div className="p-4 bg-slate-900/60 border border-slate-800/80 rounded-2xl flex items-center gap-3">
            <div className="p-2.5 bg-amber-500/10 text-amber-400 rounded-xl border border-amber-500/20">
              <Trophy className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xl sm:text-2xl font-bold text-amber-300">{totalPrizeFormatted}</div>
              <div className="text-xs text-slate-400 font-medium">Total Prize Pool</div>
            </div>
          </div>

          <div className="p-4 bg-slate-900/60 border border-slate-800/80 rounded-2xl flex items-center gap-3">
            <div className="p-2.5 bg-cyan-500/10 text-cyan-400 rounded-xl border border-cyan-500/20">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xl sm:text-2xl font-bold text-slate-100">{totalDevsConnected.toLocaleString()}+</div>
              <div className="text-xs text-slate-400 font-medium">Builders Connected</div>
            </div>
          </div>

          <div className="p-4 bg-slate-900/60 border border-slate-800/80 rounded-2xl flex items-center gap-3">
            <div className="p-2.5 bg-emerald-500/10 text-emerald-400 rounded-xl border border-emerald-500/20">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xl sm:text-2xl font-bold text-emerald-300">5 Platforms</div>
              <div className="text-xs text-slate-400 font-medium">Deduplicated Daily</div>
            </div>
          </div>

        </div>

        {/* Aggregated Platform Logos Banner */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-slate-500 text-xs font-semibold opacity-75">
          <span className="text-slate-600 uppercase tracking-widest text-[10px]">Aggregating live events from:</span>
          <span className="hover:text-indigo-400 transition-colors cursor-pointer">Unstop</span>
          <span className="hover:text-cyan-400 transition-colors cursor-pointer">Devfolio</span>
          <span className="hover:text-purple-400 transition-colors cursor-pointer">Devpost</span>
          <span className="hover:text-amber-400 transition-colors cursor-pointer">Reskilll</span>
          <span className="hover:text-emerald-400 transition-colors cursor-pointer">HackerEarth</span>
          <span className="hover:text-rose-400 transition-colors cursor-pointer">College Portals</span>
        </div>

      </div>
    </section>
  );
};
