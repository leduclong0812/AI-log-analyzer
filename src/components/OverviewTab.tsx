import React from 'react';
import { BotStat, LogSummary, UrlStat } from '../types/analyzer';
import { Bot, Search, Brain, Users, BarChart3, AlertTriangle, ArrowUpRight, CheckCircle2 } from 'lucide-react';

interface OverviewTabProps {
  summary: LogSummary;
  botStats: BotStat[];
  urlStats: UrlStat[];
  onSelectTab: (tabId: string) => void;
}

export const OverviewTab: React.FC<OverviewTabProps> = ({
  summary,
  botStats,
  urlStats,
  onSelectTab,
}) => {
  const topBots = botStats.slice(0, 5);
  const totalStatusCodes = Object.values(summary.statusCodeBreakdown).reduce((a, b) => a + b, 0) || 1;

  // Status code color helper
  const getStatusColor = (code: number) => {
    if (code >= 200 && code < 300) return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
    if (code >= 300 && code < 400) return 'text-blue-400 bg-blue-500/10 border-blue-500/20';
    if (code === 429) return 'text-amber-400 bg-amber-500/10 border-amber-500/20';
    if (code >= 400 && code < 500) return 'text-orange-400 bg-orange-500/10 border-orange-500/20';
    return 'text-rose-400 bg-rose-500/10 border-rose-500/20';
  };

  // Extract top directory paths
  const sectionCounts: Record<string, number> = {};
  for (const url of urlStats) {
    if (url.aiHits > 0) {
      const parts = url.path.split('/').filter(Boolean);
      const rootFolder = parts.length > 0 ? `/${parts[0]}/` : '/ (Homepage)';
      sectionCounts[rootFolder] = (sectionCounts[rootFolder] || 0) + url.aiHits;
    }
  }
  const topSections = Object.entries(sectionCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Traffic Composition Bar */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
          <div>
            <h3 className="text-sm font-semibold text-slate-200">Traffic Distribution: AI Crawlers vs Other Traffic</h3>
            <p className="text-xs text-slate-400">Proportion of server bandwidth and compute claimed by AI agents</p>
          </div>
          <div className="flex items-center gap-4 text-xs">
            <span className="flex items-center gap-1.5 text-slate-300">
              <span className="w-2.5 h-2.5 rounded-sm bg-cyan-500"></span>
              AI Crawlers ({summary.aiPercentage}%)
            </span>
            <span className="flex items-center gap-1.5 text-slate-400">
              <span className="w-2.5 h-2.5 rounded-sm bg-slate-700"></span>
              Other / Human ({(100 - summary.aiPercentage).toFixed(1)}%)
            </span>
          </div>
        </div>

        {/* Multi-segment bar */}
        <div className="w-full h-3 rounded-full bg-slate-800 overflow-hidden flex">
          <div
            className="bg-cyan-500 h-full transition-all duration-700"
            style={{ width: `${Math.max(summary.aiPercentage, 1)}%` }}
            title={`AI Traffic: ${summary.aiRequests} requests`}
          />
          <div
            className="bg-slate-700 h-full transition-all duration-700"
            style={{ width: `${Math.max(100 - summary.aiPercentage, 0)}%` }}
            title={`Other Traffic: ${summary.nonAiRequests} requests`}
          />
        </div>
      </div>

      {/* Grid: Top Active AI Bots & HTTP Status Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Top AI Crawlers */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold text-slate-200">Top Active AI Crawlers</h3>
              <p className="text-xs text-slate-400">Bots generating the highest volume of index requests</p>
            </div>
            <button
              onClick={() => onSelectTab('crawlers')}
              className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-medium"
            >
              View all {botStats.length} <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3.5">
            {topBots.length === 0 ? (
              <div className="text-xs text-slate-400 py-6 text-center">No AI bots detected in current logs.</div>
            ) : (
              topBots.map((bot) => (
                <div key={bot.botId} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-slate-200">{bot.name}</span>
                      <span className="text-[11px] text-slate-400">({bot.vendor})</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-slate-400 text-[11px]">{bot.totalRequests.toLocaleString()} hits</span>
                      <span className="font-semibold text-cyan-400">{bot.percentageOfAi}%</span>
                    </div>
                  </div>
                  <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-cyan-500 to-blue-500 h-full rounded-full transition-all duration-500"
                      style={{ width: `${Math.min(bot.percentageOfAi, 100)}%` }}
                    />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right: HTTP Response Code Distribution */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold text-slate-200">HTTP Response Code Breakdown</h3>
              <p className="text-xs text-slate-400">Health of responses served to all crawlers</p>
            </div>
            <button
              onClick={() => onSelectTab('issues')}
              className="text-xs text-amber-400 hover:text-amber-300 flex items-center gap-1 font-medium"
            >
              Analyze Issues <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-2.5">
            {Object.entries(summary.statusCodeBreakdown)
              .sort((a, b) => b[1] - a[1])
              .map(([codeStr, count]) => {
                const code = parseInt(codeStr, 10);
                const percent = ((count / totalStatusCodes) * 100).toFixed(1);
                const statusStyle = getStatusColor(code);

                return (
                  <div key={codeStr} className="flex items-center justify-between text-xs p-2 rounded-lg bg-slate-950/40 border border-slate-800/60">
                    <div className="flex items-center gap-2.5">
                      <span className={`px-2 py-0.5 rounded text-[11px] font-mono font-bold border ${statusStyle}`}>
                        {code}
                      </span>
                      <span className="text-slate-300">
                        {code === 200 && 'OK (Success)'}
                        {code === 301 && 'Moved Permanently'}
                        {code === 304 && 'Not Modified (Cache Hit)'}
                        {code === 403 && 'Forbidden (Blocked)'}
                        {code === 404 && 'Not Found (Dead Link)'}
                        {code === 429 && 'Too Many Requests (Rate Limited)'}
                        {code >= 500 && 'Server Gateway / Internal Error'}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-slate-400 font-mono">{count.toLocaleString()}</span>
                      <span className="text-slate-400 text-[11px] w-12 text-right">{percent}%</span>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      </div>

      {/* Grid: AI Bot Classification & Top Crawled Directories */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Crawler Category Breakdown */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5">
          <h3 className="text-sm font-semibold text-slate-200 mb-1">AI Crawler Role Classification</h3>
          <p className="text-xs text-slate-400 mb-4">Breakdown by crawler intent and commercial purpose</p>

          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800">
              <div className="flex items-center gap-1.5 text-xs text-cyan-400 font-medium mb-1">
                <Search className="w-3.5 h-3.5" />
                <span>Search Bots</span>
              </div>
              <div className="text-lg font-bold text-white">
                {(summary.categoryBreakdown.search || 0).toLocaleString()}
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5">ChatGPT Search, Perplexity, Claude-Web</p>
            </div>

            <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800">
              <div className="flex items-center gap-1.5 text-xs text-indigo-400 font-medium mb-1">
                <Brain className="w-3.5 h-3.5" />
                <span>Training Scrapers</span>
              </div>
              <div className="text-lg font-bold text-white">
                {(summary.categoryBreakdown.training || 0).toLocaleString()}
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5">GPTBot, Bytespider, CCBot, DeepSeek</p>
            </div>

            <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800">
              <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-medium mb-1">
                <Users className="w-3.5 h-3.5" />
                <span>User-Prompted</span>
              </div>
              <div className="text-lg font-bold text-white">
                {(summary.categoryBreakdown.user_action || 0).toLocaleString()}
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5">ChatGPT-User, Claude-User live clicks</p>
            </div>

            <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800">
              <div className="flex items-center gap-1.5 text-xs text-amber-400 font-medium mb-1">
                <BarChart3 className="w-3.5 h-3.5" />
                <span>SEO & Aggregators</span>
              </div>
              <div className="text-lg font-bold text-white">
                {((summary.categoryBreakdown.seo_crawler || 0) + (summary.categoryBreakdown.aggregator || 0)).toLocaleString()}
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5">Ahrefs, Semrush, DataForSEO, Diffbot</p>
            </div>
          </div>
        </div>

        {/* Top Crawled Site Sections */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold text-slate-200">Top Crawled Content Sections</h3>
              <p className="text-xs text-slate-400">Path prefixes prioritized by AI discovery agents</p>
            </div>
            <button
              onClick={() => onSelectTab('urls')}
              className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-medium"
            >
              Explore URLs <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-2.5">
            {topSections.length === 0 ? (
              <div className="text-xs text-slate-400 py-6 text-center">No path data available.</div>
            ) : (
              topSections.map(([section, count]) => (
                <div key={section} className="flex items-center justify-between p-2.5 rounded-lg bg-slate-950/50 border border-slate-800">
                  <div className="font-mono text-xs text-slate-200 truncate font-medium">
                    {section}
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-slate-400">{count.toLocaleString()} AI hits</span>
                    <span className="text-[11px] font-semibold text-cyan-400 bg-cyan-950/60 border border-cyan-800/60 px-2 py-0.5 rounded">
                      {((count / Math.max(summary.aiRequests, 1)) * 100).toFixed(0)}%
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
