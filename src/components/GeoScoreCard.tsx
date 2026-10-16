import React from 'react';
import { GeoScoreBreakdown } from '../types/analyzer';
import { ShieldCheck, AlertTriangle, CheckCircle2, XCircle, Search, Layers, Activity, Database, Zap } from 'lucide-react';

interface GeoScoreCardProps {
  score: GeoScoreBreakdown;
  aiPercentage: number;
  uniqueBotsCount: number;
}

export const GeoScoreCard: React.FC<GeoScoreCardProps> = ({ score, aiPercentage, uniqueBotsCount }) => {
  const getGradeColor = (grade: string) => {
    switch (grade) {
      case 'A+':
      case 'A':
        return {
          bg: 'bg-emerald-950/40',
          border: 'border-emerald-500/40',
          text: 'text-emerald-400',
          ring: 'stroke-emerald-500',
          pill: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30',
        };
      case 'B':
        return {
          bg: 'bg-cyan-950/40',
          border: 'border-cyan-500/40',
          text: 'text-cyan-400',
          ring: 'stroke-cyan-500',
          pill: 'bg-cyan-500/10 text-cyan-300 border-cyan-500/30',
        };
      case 'C':
        return {
          bg: 'bg-amber-950/40',
          border: 'border-amber-500/40',
          text: 'text-amber-400',
          ring: 'stroke-amber-500',
          pill: 'bg-amber-500/10 text-amber-300 border-amber-500/30',
        };
      case 'D':
      case 'F':
      default:
        return {
          bg: 'bg-rose-950/40',
          border: 'border-rose-500/40',
          text: 'text-rose-400',
          ring: 'stroke-rose-500',
          pill: 'bg-rose-500/10 text-rose-300 border-rose-500/30',
        };
    }
  };

  const style = getGradeColor(score.grade);
  const circumference = 2 * Math.PI * 44; // r=44
  const strokeDashoffset = circumference - (score.totalScore / 100) * circumference;

  return (
    <div className={`rounded-2xl border ${style.border} ${style.bg} p-6 shadow-xl relative overflow-hidden backdrop-blur-sm transition-all`}>
      {/* Background ambient glow */}
      <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
        {/* Left: Score Gauge & Grade */}
        <div className="flex items-center gap-5">
          <div className="relative w-28 h-28 flex-shrink-0 flex items-center justify-center">
            {/* SVG Progress Ring */}
            <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="44"
                className="stroke-slate-800"
                strokeWidth="8"
                fill="none"
              />
              <circle
                cx="50"
                cy="50"
                r="44"
                className={`${style.ring} transition-all duration-1000 ease-out`}
                strokeWidth="8"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                fill="none"
              />
            </svg>
            <div className="absolute flex flex-col items-center justify-center text-center">
              <span className="text-3xl font-extrabold text-white tracking-tight">{score.totalScore}</span>
              <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest">/ 100</span>
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className={`text-xl font-black ${style.text}`}>{score.grade}</span>
              <span className="text-slate-400 text-sm font-medium">GEO Score™</span>
              <span className={`text-xs px-2 py-0.5 rounded font-medium border ${style.pill}`}>
                {score.totalScore >= 80 ? 'Optimal' : score.totalScore >= 65 ? 'Moderate' : 'Action Needed'}
              </span>
            </div>
            <h3 className="text-base font-semibold text-slate-100 leading-snug">
              Generative Engine Optimization Health
            </h3>
            <p className="text-xs text-slate-400 mt-1 max-w-lg leading-relaxed">
              {score.statusMessage}
            </p>
          </div>
        </div>

        {/* Right: Quick context indicators */}
        <div className="flex items-center gap-4 text-xs text-slate-400 border-t lg:border-t-0 lg:border-l border-slate-800 pt-4 lg:pt-0 lg:pl-6 w-full lg:w-auto justify-between lg:justify-start">
          <div>
            <div className="text-slate-500 font-medium">AI Traffic Share</div>
            <div className="text-base font-semibold text-slate-200 mt-0.5">{aiPercentage}%</div>
          </div>
          <div className="w-px h-8 bg-slate-800" />
          <div>
            <div className="text-slate-500 font-medium">Detected Bots</div>
            <div className="text-base font-semibold text-slate-200 mt-0.5">{uniqueBotsCount} Crawlers</div>
          </div>
          <div className="w-px h-8 bg-slate-800" />
          <div>
            <div className="text-slate-500 font-medium">Benchmark</div>
            <div className="text-base font-semibold text-slate-200 mt-0.5">Top 15% GEO</div>
          </div>
        </div>
      </div>

      {/* Sub-Score Dimensional Breakdown Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 mt-6 pt-6 border-t border-slate-800/80">
        {/* 1. Search Bot Access */}
        <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-3">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1.5">
            <span className="flex items-center gap-1.5">
              <Search className="w-3.5 h-3.5 text-cyan-400" />
              <span>Search Bots</span>
            </span>
            <span className="font-semibold text-slate-200">{score.searchBotAccessScore}/30</span>
          </div>
          <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-cyan-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${(score.searchBotAccessScore / 30) * 100}%` }}
            />
          </div>
          <p className="text-[11px] text-slate-500 mt-1.5">Perplexity & ChatGPT Search indexation</p>
        </div>

        {/* 2. Bot Diversity */}
        <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-3">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1.5">
            <span className="flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-indigo-400" />
              <span>Diversity</span>
            </span>
            <span className="font-semibold text-slate-200">{score.botDiversityScore}/25</span>
          </div>
          <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-indigo-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${(score.botDiversityScore / 25) * 100}%` }}
            />
          </div>
          <p className="text-[11px] text-slate-500 mt-1.5">Across OpenAI, Anthropic, Google, xAI</p>
        </div>

        {/* 3. Crawl Success Rate */}
        <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-3">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1.5">
            <span className="flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-emerald-400" />
              <span>Success Rate</span>
            </span>
            <span className="font-semibold text-slate-200">{score.crawlSuccessScore}/25</span>
          </div>
          <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-emerald-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${(score.crawlSuccessScore / 25) * 100}%` }}
            />
          </div>
          <p className="text-[11px] text-slate-500 mt-1.5">200 OK responses vs 4xx/5xx drops</p>
        </div>

        {/* 4. Content Depth */}
        <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-3">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1.5">
            <span className="flex items-center gap-1.5">
              <Database className="w-3.5 h-3.5 text-violet-400" />
              <span>Content Depth</span>
            </span>
            <span className="font-semibold text-slate-200">{score.crawlVolumeDepthScore}/10</span>
          </div>
          <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-violet-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${(score.crawlVolumeDepthScore / 10) * 100}%` }}
            />
          </div>
          <p className="text-[11px] text-slate-500 mt-1.5">Breadth of unique documentation & articles</p>
        </div>

        {/* 5. Crawl Efficiency */}
        <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-3">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1.5">
            <span className="flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              <span>Hygiene</span>
            </span>
            <span className="font-semibold text-slate-200">{score.crawlEfficiencyScore}/10</span>
          </div>
          <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-amber-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${(score.crawlEfficiencyScore / 10) * 100}%` }}
            />
          </div>
          <p className="text-[11px] text-slate-500 mt-1.5">Zero 429 throttling & parameter bloat</p>
        </div>
      </div>

      {/* Identified Strengths & Weaknesses */}
      {(score.strengths.length > 0 || score.weaknesses.length > 0) && (
        <div className="mt-4 pt-4 border-t border-slate-800/60 grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
          {score.strengths.length > 0 && (
            <div className="space-y-1.5">
              <div className="text-[11px] font-semibold text-emerald-400 uppercase tracking-wider flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Strengths
              </div>
              {score.strengths.slice(0, 2).map((s, idx) => (
                <div key={idx} className="text-slate-300 flex items-start gap-1.5">
                  <span className="text-emerald-500 mt-0.5">•</span>
                  <span>{s}</span>
                </div>
              ))}
            </div>
          )}

          {score.weaknesses.length > 0 && (
            <div className="space-y-1.5">
              <div className="text-[11px] font-semibold text-amber-400 uppercase tracking-wider flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5" /> Crawl Vulnerabilities
              </div>
              {score.weaknesses.slice(0, 2).map((w, idx) => (
                <div key={idx} className="text-slate-300 flex items-start gap-1.5">
                  <span className="text-amber-500 mt-0.5">•</span>
                  <span>{w}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
