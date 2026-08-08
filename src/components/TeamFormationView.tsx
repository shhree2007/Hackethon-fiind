import React, { useState } from 'react';
import { 
  Users, 
  PlusCircle, 
  Search, 
  CheckCircle2, 
  Send, 
  MessageSquare, 
  Building2, 
  Code2, 
  UserPlus, 
  Briefcase, 
  X,
  ExternalLink
} from 'lucide-react';
import { TeamPosting, Hackathon } from '../types';

interface TeamFormationViewProps {
  teamPostings: TeamPosting[];
  hackathons: Hackathon[];
  onCreateTeamPosting: (postingData: any) => void;
  onJoinTeam: (teamId: string, applicantName: string, role: string) => void;
}

export const TeamFormationView: React.FC<TeamFormationViewProps> = ({
  teamPostings,
  hackathons,
  onCreateTeamPosting,
  onJoinTeam
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSkill, setSelectedSkill] = useState('All');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedTeamForContact, setSelectedTeamForContact] = useState<TeamPosting | null>(null);

  // Form state
  const [formHackathonId, setFormHackathonId] = useState(hackathons[0]?.id || '');
  const [formTitle, setFormTitle] = useState('');
  const [formDesc, setFormDesc] = useState('');
  const [formRolesNeeded, setFormRolesNeeded] = useState('');
  const [formContact, setFormContact] = useState('');

  // Join modal state
  const [joinModalTeam, setJoinModalTeam] = useState<TeamPosting | null>(null);
  const [applicantName, setApplicantName] = useState('Anish K.');
  const [applicantRole, setApplicantRole] = useState('AI/ML Specialist');
  const [joinSuccess, setJoinSuccess] = useState(false);

  const SKILL_TAGS = ['All', 'AI/ML Engineer', 'Full Stack Dev', 'Solidity Developer', 'UI/UX Designer', 'Flutter Developer', 'Backend Specialist'];

  const filteredTeams = teamPostings.filter((t) => {
    const matchesSearch =
      t.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.hackathonName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.leaderName.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesSkill =
      selectedSkill === 'All' ||
      t.rolesNeeded.some((r) => r.toLowerCase().includes(selectedSkill.toLowerCase()));

    return matchesSearch && matchesSkill;
  });

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formHackathonId) return;

    onCreateTeamPosting({
      hackathonId: formHackathonId,
      title: formTitle || 'Looking for talented teammates',
      description: formDesc || 'Building a high-impact prototype. Let\'s win together!',
      rolesNeeded: formRolesNeeded ? formRolesNeeded.split(',').map(s => s.trim()) : ['Fullstack Dev', 'UI/UX'],
      contactEmailOrDiscord: formContact || 'builder@hackradar.dev'
    });

    setShowCreateModal(false);
    setFormTitle('');
    setFormDesc('');
    setFormRolesNeeded('');
    setFormContact('');
  };

  const handleJoinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!joinModalTeam) return;

    onJoinTeam(joinModalTeam.id, applicantName, applicantRole);
    setJoinSuccess(true);
    setTimeout(() => {
      setJoinSuccess(false);
      setJoinModalTeam(null);
    }, 1500);
  };

  return (
    <div className="space-y-6 text-slate-100">
      
      {/* Top Banner */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Users className="w-6 h-6 text-cyan-400" />
            <h2 className="text-2xl font-bold tracking-tight text-white">Find Teammates & Join Squads</h2>
          </div>
          <p className="text-sm text-slate-400">
            Never hack alone. Connect with developers, UI/UX designers, and AI creators across India.
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="px-5 py-2.5 bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white font-semibold text-xs sm:text-sm rounded-xl shadow-lg shadow-cyan-600/20 flex items-center gap-2 transition-all"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Post Team Request</span>
        </button>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search teams by hackathon, role needed, or leader..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          {SKILL_TAGS.map((skill) => (
            <button
              key={skill}
              onClick={() => setSelectedSkill(skill)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap border transition-all ${
                selectedSkill === skill
                  ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
                  : 'bg-slate-900 text-slate-400 border-slate-800 hover:border-slate-700'
              }`}
            >
              {skill}
            </button>
          ))}
        </div>
      </div>

      {/* Team Cards Grid */}
      <div className="grid md:grid-cols-2 gap-4">
        {filteredTeams.map((team) => (
          <div key={team.id} className="bg-slate-900/90 border border-slate-800 hover:border-slate-700 rounded-2xl p-5 flex flex-col justify-between space-y-4">
            
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider">{team.hackathonSource} • {team.hackathonName}</span>
                  <h3 className="font-bold text-base text-slate-100 mt-0.5">{team.title}</h3>
                </div>
                <span className={`px-2.5 py-0.5 text-[11px] font-semibold rounded-full border ${
                  team.status === 'Open' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-slate-800 text-slate-500 border-slate-700'
                }`}>
                  {team.status}
                </span>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">{team.description}</p>

              {/* Roles Needed */}
              <div>
                <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider block mb-1">Looking For:</span>
                <div className="flex flex-wrap gap-1.5">
                  {team.rolesNeeded.map((r) => (
                    <span key={r} className="px-2.5 py-0.5 text-xs bg-indigo-500/15 text-indigo-300 border border-indigo-500/30 rounded-md font-medium">
                      + {r}
                    </span>
                  ))}
                </div>
              </div>

              {/* Leader & Members */}
              <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                <div className="flex items-center gap-2">
                  <img
                    src={team.leaderAvatar}
                    alt={team.leaderName}
                    className="w-7 h-7 rounded-full object-cover border border-slate-700"
                  />
                  <div>
                    <div className="font-semibold text-slate-200">{team.leaderName}</div>
                    <div className="text-[10px] text-slate-500">{team.leaderCollege}</div>
                  </div>
                </div>

                <div className="text-slate-400 font-medium">
                  {team.currentMembers.length}/{team.maxTeamSize} Members
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-3 border-t border-slate-800 flex items-center justify-between gap-2">
              <button
                onClick={() => setSelectedTeamForContact(team)}
                className="text-xs text-slate-400 hover:text-slate-200 underline"
              >
                View Contact Info
              </button>

              <button
                onClick={() => setJoinModalTeam(team)}
                disabled={team.status !== 'Open'}
                className={`px-4 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
                  team.status === 'Open'
                    ? 'bg-cyan-600 hover:bg-cyan-500 text-white shadow-md shadow-cyan-600/20'
                    : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                }`}
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>Join Squad</span>
              </button>
            </div>

          </div>
        ))}
      </div>

      {/* Create Team Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg p-6 space-y-4 shadow-2xl relative">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-bold text-lg text-slate-100 flex items-center gap-2">
                <Users className="w-5 h-5 text-cyan-400" />
                <span>Post Team Request</span>
              </h3>
              <button onClick={() => setShowCreateModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-4 text-xs">
              <div>
                <label className="text-slate-400 font-medium block mb-1">Select Target Hackathon</label>
                <select
                  value={formHackathonId}
                  onChange={(e) => setFormHackathonId(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 text-slate-200 rounded-xl p-2.5 focus:outline-none focus:border-cyan-500"
                >
                  {hackathons.map((h) => (
                    <option key={h.id} value={h.id}>
                      {h.name} ({h.source})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-slate-400 font-medium block mb-1">Posting Headline</label>
                <input
                  type="text"
                  placeholder="e.g. Seeking 1 PyTorch Dev for Google AI Buildathon"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 text-slate-200 rounded-xl p-2.5 focus:outline-none focus:border-cyan-500"
                  required
                />
              </div>

              <div>
                <label className="text-slate-400 font-medium block mb-1">Project Idea & Description</label>
                <textarea
                  placeholder="Describe your vision, team background, or project goal..."
                  value={formDesc}
                  onChange={(e) => setFormDesc(e.target.value)}
                  rows={3}
                  className="w-full bg-slate-950 border border-slate-800 text-slate-200 rounded-xl p-2.5 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="text-slate-400 font-medium block mb-1">Roles Needed (comma-separated)</label>
                <input
                  type="text"
                  placeholder="e.g. Frontend Dev, UI/UX Designer, Solidity Specialist"
                  value={formRolesNeeded}
                  onChange={(e) => setFormRolesNeeded(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 text-slate-200 rounded-xl p-2.5 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="text-slate-400 font-medium block mb-1">Contact Email / Discord Tag</label>
                <input
                  type="text"
                  placeholder="e.g. aarav.eth#4921 or aarav@college.edu"
                  value={formContact}
                  onChange={(e) => setFormContact(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 text-slate-200 rounded-xl p-2.5 focus:outline-none focus:border-cyan-500"
                  required
                />
              </div>

              <div className="pt-3 border-t border-slate-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-cyan-600 hover:bg-cyan-500 text-white font-semibold rounded-xl"
                >
                  Publish Team Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Request to Join Modal */}
      {joinModalTeam && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-6 space-y-4 shadow-2xl relative">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-bold text-base text-slate-100">Send Join Request to {joinModalTeam.leaderName}</h3>
              <button onClick={() => setJoinModalTeam(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            {joinSuccess ? (
              <div className="py-8 text-center text-emerald-400 space-y-2">
                <CheckCircle2 className="w-12 h-12 mx-auto" />
                <h4 className="font-bold text-lg text-slate-100">Request Sent!</h4>
                <p className="text-xs text-slate-400">The team leader has been notified. Contact details: {joinModalTeam.contactEmailOrDiscord}</p>
              </div>
            ) : (
              <form onSubmit={handleJoinSubmit} className="space-y-4 text-xs">
                <div>
                  <label className="text-slate-400 font-medium block mb-1">Your Name</label>
                  <input
                    type="text"
                    value={applicantName}
                    onChange={(e) => setApplicantName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 text-slate-200 rounded-xl p-2.5"
                    required
                  />
                </div>

                <div>
                  <label className="text-slate-400 font-medium block mb-1">Primary Role / Skill</label>
                  <input
                    type="text"
                    value={applicantRole}
                    onChange={(e) => setApplicantRole(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 text-slate-200 rounded-xl p-2.5"
                    required
                  />
                </div>

                <div className="pt-3 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setJoinModalTeam(null)}
                    className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-cyan-600 text-white font-semibold rounded-xl"
                  >
                    Confirm Join Request
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* View Contact Info Modal */}
      {selectedTeamForContact && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-6 space-y-4 shadow-2xl relative">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-bold text-base text-slate-100">Contact Team Leader</h3>
              <button onClick={() => setSelectedTeamForContact(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl">
                <span className="text-slate-500 block uppercase font-semibold text-[10px]">Team Leader</span>
                <span className="font-bold text-sm text-slate-200">{selectedTeamForContact.leaderName} ({selectedTeamForContact.leaderCollege})</span>
              </div>

              <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl">
                <span className="text-slate-500 block uppercase font-semibold text-[10px]">Contact Handle / Email</span>
                <span className="font-mono font-bold text-cyan-300 select-all">{selectedTeamForContact.contactEmailOrDiscord}</span>
              </div>
            </div>

            <button
              onClick={() => setSelectedTeamForContact(null)}
              className="w-full py-2 bg-slate-800 text-slate-300 font-semibold rounded-xl text-xs"
            >
              Close
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
