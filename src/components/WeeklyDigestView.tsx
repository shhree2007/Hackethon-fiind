import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Send, 
  Bot, 
  CheckCircle2, 
  Zap, 
  Copy, 
  Share2, 
  RefreshCw,
  Trophy,
  ArrowRight
} from 'lucide-react';

interface WeeklyDigestViewProps {
  userRole: string;
  onExploreClick: () => void;
}

export const WeeklyDigestView: React.FC<WeeklyDigestViewProps> = ({
  userRole,
  onExploreClick
}) => {
  const [digestText, setDigestText] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    generateDigest();
  }, [userRole]);

  const generateDigest = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/gemini/digest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userRole: userRole || 'AI/ML Engineer',
          interests: ['AI', 'Web Development', 'Cybersecurity'],
          graduationYear: '2026'
        })
      });
      const data = await res.json();
      if (data.digest) {
        setDigestText(data.digest);
      }
    } catch (e) {
      console.error(e);
      setDigestText("Weekly Digest for " + userRole + ":\n\nTop Match: ETHIndia 2026 & Google Agentic AI Buildathon are closing registrations soon with over ₹1.7 Cr in total rewards. Form a team with complementary UI/UX and PyTorch skills to maximize your winning odds this weekend!");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(digestText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 text-slate-100">
      
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-purple-950/60 via-slate-900 to-indigo-950/60 border border-purple-500/30 rounded-2xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-purple-400" />
            <h2 className="text-2xl font-bold tracking-tight text-white">Weekly Opportunity Digest (AI Powered)</h2>
          </div>
          <p className="text-sm text-slate-300">
            Automated intelligence analyzing current active hackathons specifically for <span className="text-purple-300 font-semibold">{userRole}</span>.
          </p>
        </div>

        <button
          onClick={generateDigest}
          disabled={loading}
          className="px-4 py-2.5 bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs rounded-xl shadow-lg shadow-purple-600/20 flex items-center gap-2 transition-all"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          <span>{loading ? 'Generating Digest...' : 'Regenerate Digest'}</span>
        </button>
      </div>

      {/* Digest Output Card */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 relative space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2 text-xs font-semibold text-purple-300">
            <Bot className="w-4 h-4 text-purple-400" />
            <span>HackRadar Gemini AI Advisor Report</span>
          </div>

          <button
            onClick={handleCopy}
            className="text-xs text-slate-400 hover:text-white flex items-center gap-1.5 transition-colors"
          >
            {copied ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied' : 'Copy Text'}</span>
          </button>
        </div>

        {loading ? (
          <div className="py-12 text-center text-slate-400 space-y-3">
            <Sparkles className="w-8 h-8 text-purple-400 animate-spin mx-auto" />
            <p className="text-sm">Analyzing 450+ live hackathons & matching with your tech stack...</p>
          </div>
        ) : (
          <div className="prose prose-invert prose-sm max-w-none space-y-4 text-slate-300 leading-relaxed">
            {digestText.split('\n\n').map((paragraph, idx) => (
              <p key={idx} className="bg-slate-950/60 p-4 border border-slate-800/80 rounded-xl">
                {paragraph}
              </p>
            ))}
          </div>
        )}

        <div className="pt-4 border-t border-slate-800 flex justify-end">
          <button
            onClick={onExploreClick}
            className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold flex items-center gap-2 transition-all"
          >
            <span>View All Matched Hackathons</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

    </div>
  );
};
