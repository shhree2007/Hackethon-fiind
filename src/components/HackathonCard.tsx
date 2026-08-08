import React from 'react';
import { 
  Trophy, 
  Clock, 
  MapPin, 
  Users, 
  Bookmark, 
  ExternalLink, 
  Sparkles, 
  ShieldCheck, 
  Building, 
  CheckCircle, 
  UserCheck,
  Zap,
  ArrowUpRight
} from 'lucide-react';
import { Hackathon } from '../types';

interface HackathonCardProps {
  hackathon: Hackathon;
  isSaved: boolean;
  onToggleSave: (id: string) => void;
  onSelect: (h: Hackathon) => void;
  onFindTeam: (h: Hackathon) => void;
}

export const HackathonCard: React.FC<HackathonCardProps> = ({
  hackathon,
  isSaved,
  onToggleSave,
  onSelect,
  onFindTeam
}) => {
  // Calculate remaining days
  const now = Date.now();
  const deadlineMs = new Date(hackathon.registrationDeadline).getTime();
  const diffHours = Math.floor((deadlineMs - now) / (1000 * 60 * 60));
  const diffDays = Math.floor(diffHours / 24);

  let deadlineLabel = '';
  let isUrgent = false;

  if (diffHours <= 0) {
    deadlineLabel = 'Registration Closed';
  } else if (diffHours < 48) {
    deadlineLabel = `Closes in ${diffHours}h!`;
    isUrgent = true;
  } else {
    deadlineLabel = `${diffDays} days left`;
  }

  // Get source badge colors
  const getSourceBadgeClass = (source: string) => {
    switch (source) {
      case 'Devfolio': return 'bg-cyan-500/10 text-cyan-300 border-cyan-500/30';
      case 'Unstop': return 'bg-indigo-500/10 text-indigo-300 border-indigo-500/30';
      case 'Devpost': return 'bg-purple-500/10 text-purple-300 border-purple-500/30';
      case 'Reskilll': return 'bg-amber-500/10 text-amber-300 border-amber-500/30';
      case 'HackerEarth': return 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30';
      default: return 'bg-slate-800 text-slate-300 border-slate-700';
    }
  };

  // Get difficulty badge colors (green for beginner, yellow for intermediate, red for advanced)
  const getDifficultyBadgeClass = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner Friendly':
        return 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30';
      case 'Intermediate':
        return 'bg-amber-500/15 text-amber-300 border-amber-500/30';
      case 'Advanced':
        return 'bg-rose-500/15 text-rose-400 border-rose-500/30';
      case 'All Levels':
      default:
        return 'bg-blue-500/15 text-blue-300 border-blue-500/30';
    }
  };

  return (
    <div className="group bg-slate-900/90 border border-slate-800 hover:border-indigo-500/80 rounded-2xl p-5 flex flex-col justify-between transform transition-all duration-300 ease-out hover:-translate-y-1 hover:scale-[1.015] hover:shadow-xl hover:shadow-indigo-500/20 hover:ring-1 hover:ring-indigo-500/40 relative">
      
      <div>
        {/* Top Header: Source, Mode, Difficulty & Bookmark */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2 flex-wrap">
            <span className={`px-2.5 py-0.5 text-[11px] font-semibold border rounded-md uppercase tracking-wider ${getSourceBadgeClass(hackathon.source)}`}>
              {hackathon.source}
            </span>

            <span className={`px-2 py-0.5 text-[11px] font-medium rounded-md ${
              hackathon.mode === 'Online' 
                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                : hackathon.mode === 'Offline'
                ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                : 'bg-purple-500/10 text-purple-400 border border-purple-500/20'
            }`}>
              {hackathon.mode}
            </span>

            {hackathon.difficulty && (
              <span className={`px-2 py-0.5 text-[10px] font-semibold border rounded-md ${getDifficultyBadgeClass(hackathon.difficulty)}`}>
                {hackathon.difficulty}
              </span>
            )}

            {hackathon.isStudentOnly && (
              <span className="px-2 py-0.5 text-[10px] font-semibold bg-amber-500/10 text-amber-300 border border-amber-500/20 rounded-md">
                Student Only
              </span>
            )}
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleSave(hackathon.id);
            }}
            className={`p-2 rounded-xl transition-all ${
              isSaved
                ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                : 'bg-slate-800/60 text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
            title={isSaved ? "Remove from watchlist" : "Save hackathon"}
          >
            <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-amber-400' : ''}`} />
          </button>
        </div>

        {/* Hackathon Name & Organizer */}
        <div className="cursor-pointer mb-3" onClick={() => onSelect(hackathon)}>
          <div className="flex items-center gap-1.5 mb-1">
            <h3 className="font-bold text-lg text-slate-100 group-hover:text-indigo-300 transition-colors line-clamp-1">
              {hackathon.name}
            </h3>
            {hackathon.verified && (
              <ShieldCheck className="w-4 h-4 text-indigo-400 shrink-0" title="Verified Organizer" />
            )}
          </div>
          <p className="text-xs text-slate-400 flex items-center gap-1 font-medium">
            <Building className="w-3.5 h-3.5 text-slate-500" />
            <span className="truncate">{hackathon.organizer}</span>
          </p>
        </div>

        {/* Key Metrics: Prize Pool & Deadline */}
        <div className="grid grid-cols-2 gap-2 my-3 p-3 bg-slate-950/70 border border-slate-800/80 rounded-xl">
          <div>
            <span className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold block">Prize Pool</span>
            <div className="text-sm font-bold text-amber-300 flex items-center gap-1">
              <Trophy className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span>{hackathon.prizePool}</span>
            </div>
          </div>

          <div>
            <span className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold block">Registration</span>
            <div className={`text-xs font-bold flex items-center gap-1 ${isUrgent ? 'text-rose-400 animate-pulse' : 'text-slate-300'}`}>
              <Clock className="w-3.5 h-3.5 shrink-0" />
              <span>{deadlineLabel}</span>
            </div>
          </div>
        </div>

        {/* Location & Team Size Details */}
        <div className="flex items-center justify-between text-xs text-slate-400 mb-3 px-1">
          <div className="flex items-center gap-1 truncate">
            <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0" />
            <span className="truncate">{hackathon.location}</span>
          </div>
          <div className="flex items-center gap-1 shrink-0 font-medium">
            <Users className="w-3.5 h-3.5 text-slate-500" />
            <span>{hackathon.teamSizeMin === hackathon.teamSizeMax ? `${hackathon.teamSizeMax} Members` : `${hackathon.teamSizeMin}-${hackathon.teamSizeMax} Team`}</span>
          </div>
        </div>

        {/* Themes / Tracks Tags */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {hackathon.themes.slice(0, 3).map((theme) => (
            <span
              key={theme}
              className="px-2 py-0.5 text-[11px] bg-slate-800/80 text-slate-300 border border-slate-700/60 rounded-md font-medium"
            >
              {theme}
            </span>
          ))}
          {hackathon.themes.length > 3 && (
            <span className="px-1.5 py-0.5 text-[10px] bg-slate-800 text-slate-500 rounded-md">
              +{hackathon.themes.length - 3}
            </span>
          )}
        </div>
      </div>

      {/* Footer Actions */}
      <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2 mt-auto">
        
        <button
          onClick={() => onFindTeam(hackathon)}
          className="px-3 py-1.5 bg-slate-800/90 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700/80 rounded-xl text-xs font-medium flex items-center gap-1.5 transition-colors"
        >
          <Users className="w-3.5 h-3.5 text-cyan-400" />
          <span>Find Team</span>
        </button>

        <a
          href={hackathon.registrationUrl}
          target="_blank"
          rel="noreferrer"
          className="px-3.5 py-1.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-xl text-xs font-semibold flex items-center gap-1 transition-all shadow-md shadow-indigo-600/20"
        >
          <span>Apply</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </a>

      </div>

    </div>
  );
};
