import React, { useState, useEffect } from 'react';
import { 
  X, 
  Trophy, 
  Clock, 
  MapPin, 
  Users, 
  ExternalLink, 
  Building, 
  ShieldCheck, 
  Calendar, 
  Tag, 
  Bookmark, 
  MessageSquare,
  PlusCircle,
  Share2,
  CheckCircle2
} from 'lucide-react';
import { Hackathon, TeamPosting } from '../types';

interface HackathonModalProps {
  hackathon: Hackathon | null;
  onClose: () => void;
  isSaved: boolean;
  onToggleSave: (id: string) => void;
  teamPostings: TeamPosting[];
  onCreateTeamPosting: (hackathonId: string) => void;
}

export const HackathonModal: React.FC<HackathonModalProps> = ({
  hackathon,
  onClose,
  isSaved,
  onToggleSave,
  teamPostings,
  onCreateTeamPosting
}) => {
  const [copied, setCopied] = useState(false);

  if (!hackathon) return null;

  const eventTeams = teamPostings.filter(t => t.hackathonId === hackathon.id);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-3xl overflow-hidden shadow-2xl my-8 relative flex flex-col max-h-[90vh]">
        
        {/* Banner Image Header */}
        <div className="relative h-48 sm:h-56 w-full overflow-hidden bg-slate-950">
          <img
            src={hackathon.bannerImage}
            alt={hackathon.name}
            className="w-full h-full object-cover opacity-80"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent" />
          
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 bg-slate-950/80 text-slate-300 hover:text-white rounded-full border border-slate-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Badges on Banner */}
          <div className="absolute bottom-4 left-6 right-6 flex items-end justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2.5 py-0.5 text-xs font-bold bg-indigo-600 text-white rounded-md uppercase tracking-wider shadow">
                  {hackathon.source}
                </span>
                <span className="px-2.5 py-0.5 text-xs font-semibold bg-slate-900/80 text-emerald-400 border border-emerald-500/30 rounded-md">
                  {hackathon.mode}
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-tight">
                {hackathon.name}
              </h2>
            </div>

            <button
              onClick={() => onToggleSave(hackathon.id)}
              className={`p-2.5 rounded-xl border transition-all ${
                isSaved
                  ? 'bg-amber-500/20 text-amber-400 border-amber-500/40'
                  : 'bg-slate-950/80 text-slate-300 border-slate-700 hover:text-white'
              }`}
            >
              <Bookmark className={`w-5 h-5 ${isSaved ? 'fill-amber-400' : ''}`} />
            </button>
          </div>
        </div>

        {/* Modal Body Content */}
        <div className="p-6 overflow-y-auto space-y-6 text-slate-200">
          
          {/* Key Facts Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 bg-slate-950 border border-slate-800 rounded-2xl text-xs">
            <div>
              <span className="text-slate-500 font-semibold block uppercase">Prize Pool</span>
              <span className="text-base font-bold text-amber-300 flex items-center gap-1 mt-0.5">
                <Trophy className="w-4 h-4 text-amber-400" />
                {hackathon.prizePool}
              </span>
            </div>

            <div>
              <span className="text-slate-500 font-semibold block uppercase">Deadline</span>
              <span className="text-sm font-semibold text-rose-400 flex items-center gap-1 mt-0.5">
                <Clock className="w-4 h-4" />
                {new Date(hackathon.registrationDeadline).toLocaleDateString()}
              </span>
            </div>

            <div>
              <span className="text-slate-500 font-semibold block uppercase">Location</span>
              <span className="text-sm font-semibold text-slate-200 flex items-center gap-1 mt-0.5 truncate">
                <MapPin className="w-4 h-4 text-slate-400" />
                {hackathon.location}
              </span>
            </div>

            <div>
              <span className="text-slate-500 font-semibold block uppercase">Team Size</span>
              <span className="text-sm font-semibold text-slate-200 flex items-center gap-1 mt-0.5">
                <Users className="w-4 h-4 text-slate-400" />
                {hackathon.teamSizeMin === hackathon.teamSizeMax ? `${hackathon.teamSizeMax}` : `${hackathon.teamSizeMin}-${hackathon.teamSizeMax}`}
              </span>
            </div>
          </div>

          {/* Description */}
          <div>
            <h4 className="text-sm font-bold text-slate-100 uppercase tracking-wider mb-2">About Hackathon</h4>
            <p className="text-sm text-slate-300 leading-relaxed font-normal bg-slate-900/50 p-4 border border-slate-800/80 rounded-xl">
              {hackathon.description}
            </p>
          </div>

          {/* Eligibility & Details */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="p-4 bg-slate-950/60 border border-slate-800 rounded-xl">
              <h5 className="text-xs font-bold text-indigo-400 uppercase tracking-wider mb-1">Eligibility Criteria</h5>
              <p className="text-xs text-slate-300 leading-relaxed">{hackathon.eligibility}</p>
            </div>

            <div className="p-4 bg-slate-950/60 border border-slate-800 rounded-xl">
              <h5 className="text-xs font-bold text-cyan-400 uppercase tracking-wider mb-1">Schedule & Timeline</h5>
              <p className="text-xs text-slate-300">
                <strong>Starts:</strong> {new Date(hackathon.startDate).toLocaleDateString()}<br />
                <strong>Ends:</strong> {new Date(hackathon.endDate).toLocaleDateString()}
              </p>
            </div>
          </div>

          {/* Tags */}
          <div>
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Tech Stack & Tags</h4>
            <div className="flex flex-wrap gap-2">
              {hackathon.tags.map((t) => (
                <span key={t} className="px-2.5 py-1 bg-slate-800 border border-slate-700 text-xs font-medium text-slate-300 rounded-lg">
                  #{t}
                </span>
              ))}
            </div>
          </div>

          {/* Team Formation Section inside Modal */}
          <div className="pt-4 border-t border-slate-800">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-cyan-400" />
                <h4 className="font-bold text-sm text-slate-100">Teams Looking for Members ({eventTeams.length})</h4>
              </div>
              <button
                onClick={() => {
                  onClose();
                  onCreateTeamPosting(hackathon.id);
                }}
                className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1"
              >
                <PlusCircle className="w-3.5 h-3.5" /> Post Team Request
              </button>
            </div>

            {eventTeams.length === 0 ? (
              <p className="text-xs text-slate-500 italic bg-slate-950 p-3 rounded-xl">
                No active team listings for this hackathon yet. Be the first to post a team request!
              </p>
            ) : (
              <div className="space-y-2">
                {eventTeams.map((t) => (
                  <div key={t.id} className="p-3 bg-slate-950 border border-slate-800 rounded-xl flex items-center justify-between text-xs">
                    <div>
                      <div className="font-semibold text-slate-200">{t.title}</div>
                      <div className="text-slate-400 text-[11px]">Leader: {t.leaderName} ({t.leaderCollege})</div>
                    </div>
                    <span className="px-2 py-1 bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 rounded-md font-medium">
                      Needs: {t.rolesNeeded.join(', ')}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

        {/* Modal Footer Actions */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between gap-3">
          <button
            onClick={handleShare}
            className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            {copied ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
            <span>{copied ? "Link Copied!" : "Share Link"}</span>
          </button>

          <a
            href={hackathon.registrationUrl}
            target="_blank"
            rel="noreferrer"
            className="px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-xl text-sm font-bold flex items-center gap-2 shadow-lg shadow-indigo-600/25 transition-all"
          >
            <span>Apply Official Page ({hackathon.source})</span>
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>

      </div>
    </div>
  );
};
