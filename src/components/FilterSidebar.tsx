import React from 'react';
import { 
  Filter, 
  RotateCcw, 
  Sparkles, 
  Globe2, 
  MapPin, 
  Trophy, 
  CheckSquare, 
  Square,
  Sliders,
  X
} from 'lucide-react';
import { HackathonFilterOptions } from '../types';

interface FilterSidebarProps {
  filters: HackathonFilterOptions;
  setFilters: React.Dispatch<React.SetStateAction<HackathonFilterOptions>>;
  onReset: () => void;
  isOpenMobile?: boolean;
  onCloseMobile?: () => void;
}

export const FilterSidebar: React.FC<FilterSidebarProps> = ({
  filters,
  setFilters,
  onReset,
  isOpenMobile,
  onCloseMobile
}) => {
  const THEMES_LIST = [
    'AI',
    'Machine Learning',
    'Web Development',
    'Cybersecurity',
    'Blockchain',
    'Open Innovation',
    'AR/VR',
    'Mobile Development'
  ];

  const SOURCES_LIST = ['All', 'Devfolio', 'Unstop', 'Devpost', 'Reskilll', 'HackerEarth'];
  const LOCATIONS_LIST = ['All', 'Delhi NCR', 'Bengaluru', 'Mumbai', 'Online'];

  const toggleTheme = (theme: string) => {
    setFilters((prev) => {
      const exists = prev.themes.includes(theme);
      const newThemes = exists
        ? prev.themes.filter((t) => t !== theme)
        : [...prev.themes, theme];
      return { ...prev, themes: newThemes };
    });
  };

  return (
    <aside className={`bg-slate-900/90 border border-slate-800 rounded-2xl p-5 text-slate-200 flex flex-col gap-6 ${isOpenMobile ? 'block' : 'hidden md:block'}`}>
      
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2 font-bold text-sm text-slate-100">
          <Filter className="w-4 h-4 text-indigo-400" />
          <span>Smart Filters</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={onReset}
            className="text-xs text-slate-400 hover:text-indigo-300 flex items-center gap-1 transition-colors"
          >
            <RotateCcw className="w-3 h-3" /> Reset
          </button>
          {onCloseMobile && (
            <button onClick={onCloseMobile} className="md:hidden text-slate-400 hover:text-white">
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* Mode Filter (Online / Offline / Hybrid) */}
      <div>
        <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2">Event Format</label>
        <div className="grid grid-cols-2 gap-1.5 p-1 bg-slate-950 border border-slate-800 rounded-xl">
          {['All', 'Online', 'Offline', 'Hybrid'].map((m) => (
            <button
              key={m}
              onClick={() => setFilters({ ...filters, mode: m as any })}
              className={`py-1.5 px-2 text-xs font-medium rounded-lg transition-all ${
                filters.mode === m
                  ? 'bg-indigo-600 text-white font-semibold shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              {m}
            </button>
          ))}
        </div>
      </div>

      {/* Themes & Tracks Checklist */}
      <div>
        <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2">Themes & Tracks</label>
        <div className="space-y-1.5 max-h-52 overflow-y-auto pr-1">
          {THEMES_LIST.map((theme) => {
            const isChecked = filters.themes.includes(theme);
            return (
              <button
                key={theme}
                onClick={() => toggleTheme(theme)}
                className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  isChecked
                    ? 'bg-indigo-500/15 text-indigo-300 border border-indigo-500/30'
                    : 'bg-slate-950/60 text-slate-400 hover:text-slate-200 border border-slate-800'
                }`}
              >
                <span>{theme}</span>
                {isChecked ? (
                  <CheckSquare className="w-3.5 h-3.5 text-indigo-400" />
                ) : (
                  <Square className="w-3.5 h-3.5 text-slate-600" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Location Filter */}
      <div>
        <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2">Location / Region</label>
        <select
          value={filters.location}
          onChange={(e) => setFilters({ ...filters, location: e.target.value })}
          className="w-full bg-slate-950 border border-slate-800 text-slate-200 text-xs rounded-xl p-2.5 focus:outline-none focus:border-indigo-500"
        >
          {LOCATIONS_LIST.map((loc) => (
            <option key={loc} value={loc}>
              {loc === 'All' ? 'All Locations (Pan-India & Global)' : loc}
            </option>
          ))}
        </select>
      </div>

      {/* Platform Source Filter */}
      <div>
        <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2">Aggregator Platform</label>
        <div className="flex flex-wrap gap-1.5">
          {SOURCES_LIST.map((src) => (
            <button
              key={src}
              onClick={() => setFilters({ ...filters, source: src })}
              className={`px-2.5 py-1 text-xs rounded-lg font-medium border transition-all ${
                filters.source === src
                  ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
                  : 'bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-700'
              }`}
            >
              {src}
            </button>
          ))}
        </div>
      </div>

      {/* Minimum Prize Pool */}
      <div>
        <div className="flex justify-between items-center mb-1.5">
          <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Min Prize Pool</label>
          <span className="text-xs font-bold text-amber-300">
            {filters.minPrizePool === 0 ? 'Any' : `≥ ₹${(filters.minPrizePool / 100000).toFixed(1)} Lakh`}
          </span>
        </div>
        <input
          type="range"
          min="0"
          max="5000000"
          step="500000"
          value={filters.minPrizePool}
          onChange={(e) => setFilters({ ...filters, minPrizePool: Number(e.target.value) })}
          className="w-full accent-indigo-500 bg-slate-950 cursor-pointer"
        />
      </div>

      {/* Special Toggle Options */}
      <div className="space-y-2 pt-2 border-t border-slate-800">
        <label className="flex items-center justify-between text-xs text-slate-300 cursor-pointer">
          <span>Student Only Events</span>
          <input
            type="checkbox"
            checked={filters.isStudentOnly}
            onChange={(e) => setFilters({ ...filters, isStudentOnly: e.target.checked })}
            className="rounded bg-slate-950 border-slate-800 text-indigo-500 focus:ring-0"
          />
        </label>

        <label className="flex items-center justify-between text-xs text-slate-300 cursor-pointer">
          <span>Solo Participation Allowed</span>
          <input
            type="checkbox"
            checked={filters.allowsSolo}
            onChange={(e) => setFilters({ ...filters, allowsSolo: e.target.checked })}
            className="rounded bg-slate-950 border-slate-800 text-indigo-500 focus:ring-0"
          />
        </label>

        <label className="flex items-center justify-between text-xs text-rose-300 cursor-pointer font-medium">
          <span>Closing Soon (&lt; 7 Days)</span>
          <input
            type="checkbox"
            checked={filters.isClosingSoon}
            onChange={(e) => setFilters({ ...filters, isClosingSoon: e.target.checked })}
            className="rounded bg-slate-950 border-slate-800 text-rose-500 focus:ring-0"
          />
        </label>
      </div>

    </aside>
  );
};
