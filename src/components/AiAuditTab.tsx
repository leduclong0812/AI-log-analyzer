import React, { useState } from 'react';
import { BotStat, CrawlIssue, GeoScoreBreakdown, LogSummary, UrlStat } from '../types/analyzer';
import { Sparkles, Send, Loader2, Bot, AlertTriangle, ShieldCheck, CheckCircle2 } from 'lucide-react';

interface AiAuditTabProps {
  score: GeoScoreBreakdown;
  summary: LogSummary;
  botStats: BotStat[];
  urlStats: UrlStat[];
  issues: CrawlIssue[];
}

export const AiAuditTab: React.FC<AiAuditTabProps> = ({
  score,
  summary,
  botStats,
  urlStats,
  issues,
}) => {
  const [report, setReport] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [customQuestion, setCustomQuestion] = useState('');
  const [error, setError] = useState<string | null>(null);

  const runAudit = async (question?: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/ai-analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          geoScore: score.totalScore,
          botStats: botStats.slice(0, 10),
          topErrors: issues.slice(0, 8),
          topUrls: urlStats.slice(0, 10),
          logSummary: summary,
          customQuestion: question || undefined,
        }),
      });

      if (!response.ok) {
        throw new Error(`Audit request failed with status ${response.status}`);
      }

      const data = await response.json();
      setReport(data.report || 'No analysis generated.');
    } catch (err: any) {
      console.error(err);
      setError(err?.message || 'Failed to generate AI Audit. Check server connection.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-cyan-50 via-slate-50 to-blue-50 dark:from-cyan-950/60 dark:via-slate-900/60 dark:to-indigo-950/60 border border-cyan-200 dark:border-cyan-800/40 rounded-xl p-5 shadow-xs dark:shadow-none">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-cyan-100 dark:bg-cyan-500/20 text-cyan-700 dark:text-cyan-300 border border-cyan-200 dark:border-cyan-500/30">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold text-cyan-700 dark:text-cyan-400 uppercase tracking-wider bg-cyan-100 dark:bg-cyan-950 px-1.5 py-0.2 rounded border border-cyan-300 dark:border-cyan-800">
                  TEEJAY ENGINE
                </span>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white tracking-tight">
                  Teejay GEO Copilot & Strategic AI Audit
                </h3>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">
                Synthesize crawl telemetry into prioritized executive recommendations and citation optimization strategies.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => runAudit()}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 text-xs font-semibold bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white rounded-lg shadow-lg shadow-cyan-500/20 transition-all disabled:opacity-50 whitespace-nowrap cursor-pointer"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Analyzing Log Signals...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Generate Gemini AI Audit</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Custom Inquiry Bar */}
      <div className="bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-xs dark:shadow-none">
        <label className="text-xs font-medium text-slate-700 dark:text-slate-300 block mb-2">
          Ask Gemini a specific question about your crawl patterns:
        </label>
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={customQuestion}
            onChange={(e) => setCustomQuestion(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && customQuestion.trim() && !loading) {
                runAudit(customQuestion.trim());
              }
            }}
            placeholder="e.g. 'Why is PerplexityBot getting 429 errors and how do I fix it in Cloudflare?'"
            className="flex-1 px-3.5 py-2 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-800 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
          />
          <button
            type="button"
            onClick={() => runAudit(customQuestion.trim())}
            disabled={loading || !customQuestion.trim()}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-cyan-700 dark:text-cyan-400 rounded-lg border border-slate-300 dark:border-slate-700 transition-colors disabled:opacity-50 cursor-pointer"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Ask</span>
          </button>
        </div>
      </div>

      {/* Error state */}
      {error && (
        <div className="bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-500/30 rounded-xl p-4 text-xs text-rose-700 dark:text-rose-300 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* AI Report Card */}
      {report ? (
        <div className="bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-md dark:shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
            <div className="flex items-center gap-2 text-xs font-semibold text-cyan-700 dark:text-cyan-400">
              <Bot className="w-4 h-4" />
              <span>Executive GEO Audit Report</span>
            </div>
            <span className="text-[11px] text-slate-500">
              Generated by Gemini 3.8 Flash · Heuristic Grounding
            </span>
          </div>

          <div className="prose prose-xs max-w-none text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-sans space-y-3">
            <div className="whitespace-pre-wrap font-sans">{report}</div>
          </div>
        </div>
      ) : (
        !loading && (
          <div className="bg-white dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 rounded-xl p-10 text-center shadow-xs dark:shadow-none">
            <Sparkles className="w-8 h-8 text-cyan-500 mx-auto mb-2" />
            <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-300">Ready to Audit Your Log Telemetry</h4>
            <p className="text-xs text-slate-500 max-w-md mx-auto mt-1">
              Click &quot;Generate Gemini AI Audit&quot; above to receive instant, customized recommendations for your exact bot traffic and error profile.
            </p>
          </div>
        )
      )}
    </div>
  );
};
