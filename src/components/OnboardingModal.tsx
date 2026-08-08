import React, { useState } from 'react';
import { 
  X, 
  User, 
  Sparkles, 
  CheckCircle2, 
  Briefcase, 
  BookOpen, 
  CheckSquare, 
  Square
} from 'lucide-react';

interface OnboardingModalProps {
  userRole: string;
  setUserRole: (role: any) => void;
  userInterests: string[];
  setUserInterests: (interests: string[]) => void;
  onClose: () => void;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({
  userRole,
  setUserRole,
  userInterests,
  setUserInterests,
  onClose
}) => {
  const ALL_ROLES = [
    'AI/ML Engineer',
    'Full Stack Developer',
    'UI/UX Designer',
    'Cybersecurity Specialist',
    'Web3 / Blockchain Dev',
    'Mobile Developer'
  ];

  const ALL_INTERESTS = [
    'AI',
    'Machine Learning',
    'Web Development',
    'Cybersecurity',
    'Blockchain',
    'Open Innovation',
    'AR/VR',
    'Mobile Development'
  ];

  const toggleInterest = (interest: string) => {
    if (userInterests.includes(interest)) {
      setUserInterests(userInterests.filter((i) => i !== interest));
    } else {
      setUserInterests([...userInterests, interest]);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg p-6 space-y-5 shadow-2xl relative text-slate-100">
        
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-indigo-400" />
            <h3 className="font-bold text-lg text-white">Personalize Your HackRadar Feed</h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Role Selection */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">1. Select Your Primary Role</label>
          <div className="grid grid-cols-2 gap-2">
            {ALL_ROLES.map((r) => (
              <button
                key={r}
                onClick={() => setUserRole(r as any)}
                className={`p-2.5 rounded-xl text-xs font-semibold text-left border transition-all ${
                  userRole === r
                    ? 'bg-indigo-600 text-white border-indigo-500 shadow-md shadow-indigo-600/20'
                    : 'bg-slate-950 text-slate-300 border-slate-800 hover:border-slate-700'
                }`}
              >
                {r}
              </button>
            ))}
          </div>
        </div>

        {/* Interest Selection */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">2. Select Your Hackathon Interests</label>
          <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-1">
            {ALL_INTERESTS.map((interest) => {
              const isSelected = userInterests.includes(interest);
              return (
                <button
                  key={interest}
                  onClick={() => toggleInterest(interest)}
                  className={`p-2 rounded-xl text-xs font-medium flex items-center justify-between border transition-all ${
                    isSelected
                      ? 'bg-purple-500/15 text-purple-300 border-purple-500/30'
                      : 'bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <span>{interest}</span>
                  {isSelected ? <CheckCircle2 className="w-4 h-4 text-purple-400" /> : null}
                </button>
              );
            })}
          </div>
        </div>

        <div className="pt-3 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold rounded-xl text-xs shadow-lg transition-all"
          >
            Save Preferences & Personalize
          </button>
        </div>

      </div>
    </div>
  );
};
