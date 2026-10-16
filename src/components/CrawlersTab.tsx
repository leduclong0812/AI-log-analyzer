import React, { useState } from 'react';
import { BotStat, BotCategory } from '../types/analyzer';
import { AI_BOTS_DATABASE } from '../data/aiBotsDatabase';
import { Search, Copy, Check, ExternalLink, ShieldCheck, ShieldAlert, Shield, Filter, Globe } from 'lucide-react';

interface CrawlersTabProps {
  botStats: BotStat[];
}

export const CrawlersTab: React.FC<CrawlersTabProps> = ({ botStats }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'active' | 'directory'>('active');
  const [copiedSnippet, setCopiedSnippet] = useState<string | null>(null);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSnippet(id);
    setTimeout(() => setCopiedSnippet(null), 2000);
  };

  // Filter active bots
  const filteredActiveBots = botStats.filter((bot) => {
    const matchesSearch =
      bot.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      bot.vendor.toLowerCase().includes(searchQuery.toLowerCase()) ||
      bot.sampleUserAgent.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = selectedCategory === 'all' || bot.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  // Filter full directory
  const filteredDirectory = AI_BOTS_DATABASE.filter((bot) => {
    const matchesSearch =
      bot.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      bot.vendor.toLowerCase().includes(searchQuery.toLowerCase()) ||
      bot.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = selectedCategory === 'all' || bot.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  const getActionBadge = (action: string) => {
    switch (action) {
      case 'allow':
        return (
          <span className="flex items-center gap-1 text-[11px] font-semibold text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 px-2 py-0.5 rounded">
            <ShieldCheck className="w-3 h-3" /> Allow (Recommended)
          </span>
        );
      case 'monitor':
        return (
          <span className="flex items-center gap-1 text-[11px] font-semibold text-amber-400 bg-amber-950/60 border border-amber-800/60 px-2 py-0.5 rounded">
            <Shield className="w-3 h-3" /> Monitor
          </span>
        );
      case 'optional_block':
      case 'block':
        return (
          <span className="flex items-center gap-1 text-[11px] font-semibold text-rose-400 bg-rose-950/60 border border-rose-800/60 px-2 py-0.5 rounded">
            <ShieldAlert className="w-3 h-3" /> Blockable
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Filter and Switcher Bar */}
      <div className="bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xs dark:shadow-none">
        {/* Toggle between Active Bots and Full 116+ Directory */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg">
          <button
            type="button"
            onClick={() => setViewMode('active')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
              viewMode === 'active'
                ? 'bg-cyan-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            Active in Logs ({botStats.length})
          </button>
          <button
            type="button"
            onClick={() => setViewMode('directory')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
              viewMode === 'directory'
                ? 'bg-cyan-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            All 116+ Bots Directory
          </button>
        </div>

        {/* Search input */}
        <div className="flex items-center gap-3 flex-1 max-w-md">
          <div className="relative w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by bot name, vendor (e.g. OpenAI, Perplexity)..."
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-800 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
            />
          </div>
        </div>

        {/* Category filters */}
        <div className="flex items-center gap-1 text-xs overflow-x-auto pb-1 md:pb-0">
          {[
            { id: 'all', label: 'All Categories' },
            { id: 'search', label: 'AI Search' },
            { id: 'training', label: 'Training' },
            { id: 'user_action', label: 'User Actions' },
            { id: 'seo_crawler', label: 'SEO' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors whitespace-nowrap cursor-pointer ${
                selectedCategory === cat.id
                  ? 'bg-slate-200 dark:bg-slate-800 text-cyan-700 dark:text-cyan-400 border border-slate-300 dark:border-slate-700 font-semibold'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/50'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main View: Active Detected Bots in Logs */}
      {viewMode === 'active' && (
        <div className="space-y-4">
          {filteredActiveBots.length === 0 ? (
            <div className="bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-xl p-12 text-center">
              <Globe className="w-10 h-10 text-slate-400 dark:text-slate-600 mx-auto mb-3" />
              <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-300">No matching AI crawlers found</h4>
              <p className="text-xs text-slate-500 mt-1">
                Try clearing your search query or switch to the 116+ Bots Directory.
              </p>
            </div>
          ) : (
            filteredActiveBots.map((bot) => {
              const botDef = AI_BOTS_DATABASE.find((b) => b.id === bot.botId);
              return (
                <div
                  key={bot.botId}
                  className="bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 rounded-xl p-5 transition-all shadow-xs dark:shadow-none"
                >
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    {/* Bot Title & Metadata */}
                    <div>
                      <div className="flex items-center gap-2.5 flex-wrap">
                        <h4 className="text-base font-bold text-slate-900 dark:text-white tracking-tight">{bot.name}</h4>
                        <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">({bot.vendor})</span>
                        <span className="text-[11px] font-semibold text-cyan-700 dark:text-cyan-300 bg-cyan-100 dark:bg-cyan-950/80 border border-cyan-300 dark:border-cyan-800/80 px-2 py-0.5 rounded uppercase">
                          {bot.category.replace('_', ' ')}
                        </span>
                        {getActionBadge(bot.recommendedAction)}
                      </div>
                      <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 max-w-2xl leading-relaxed">
                        {botDef?.description || 'Detected AI web crawler analyzing site pages.'}
                      </p>
                    </div>

                    {/* Stats metrics */}
                    <div className="flex items-center gap-5 text-xs text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800/80 px-4 py-2 rounded-lg">
                      <div>
                        <div className="text-slate-500 text-[11px]">Requests</div>
                        <div className="text-sm font-bold text-slate-900 dark:text-white">{bot.totalRequests.toLocaleString()}</div>
                      </div>
                      <div className="w-px h-6 bg-slate-200 dark:bg-slate-800" />
                      <div>
                        <div className="text-slate-500 text-[11px]">AI Share</div>
                        <div className="text-sm font-bold text-cyan-600 dark:text-cyan-400">{bot.percentageOfAi}%</div>
                      </div>
                      <div className="w-px h-6 bg-slate-200 dark:bg-slate-800" />
                      <div>
                        <div className="text-slate-500 text-[11px]">Error Rate</div>
                        <div
                          className={`text-sm font-bold ${
                            bot.errorRate > 5 ? 'text-amber-600 dark:text-amber-400' : 'text-emerald-600 dark:text-emerald-400'
                          }`}
                        >
                          {bot.errorRate}%
                        </div>
                      </div>
                      <div className="w-px h-6 bg-slate-200 dark:bg-slate-800" />
                      <div>
                        <div className="text-slate-500 text-[11px]">URLs Hit</div>
                        <div className="text-sm font-bold text-slate-800 dark:text-slate-200">{bot.urlsCount}</div>
                      </div>
                    </div>
                  </div>

                  {/* Status Codes & Sample UA */}
                  <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-800/60 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
                    {/* Status badges */}
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-slate-500 dark:text-slate-400 text-[11px]">HTTP Statuses:</span>
                      {Object.entries(bot.statusCodes).map(([code, cnt]) => (
                        <span
                          key={code}
                          className={`font-mono px-2 py-0.5 rounded text-[11px] font-semibold ${
                            code === '200'
                              ? 'bg-emerald-100 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-500/20'
                              : code === '429'
                              ? 'bg-amber-100 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-300 dark:border-amber-500/20'
                              : code === '403'
                              ? 'bg-rose-100 dark:bg-rose-500/10 text-rose-700 dark:text-rose-400 border border-rose-300 dark:border-rose-500/20'
                              : 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                          }`}
                        >
                          {code}: {cnt}
                        </span>
                      ))}
                    </div>

                    {/* Copy robots.txt directive */}
                    {botDef && (
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleCopy(botDef.robotsTxtSnippet, bot.botId)}
                          className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-100 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:border-slate-400 dark:hover:border-slate-700 transition-colors text-[11px] cursor-pointer"
                        >
                          {copiedSnippet === bot.botId ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-emerald-500 dark:text-emerald-400" />
                              <span className="text-emerald-600 dark:text-emerald-400 font-medium">Copied</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
                              <span>Copy robots.txt Rule</span>
                            </>
                          )}
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Sample User-Agent string */}
                  {bot.sampleUserAgent && (
                    <div className="mt-3 bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800/80 rounded-lg p-2 font-mono text-[11px] text-slate-600 dark:text-slate-400 truncate">
                      <span className="text-slate-400 dark:text-slate-500 select-none">UA: </span>
                      {bot.sampleUserAgent}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      )}

      {/* Directory View: Full 116+ AI Crawler Knowledge Base */}
      {viewMode === 'directory' && (
        <div className="space-y-3">
          <div className="text-xs text-slate-400 mb-2">
            Showing {filteredDirectory.length} AI bot signatures documented in the database.
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredDirectory.map((bot) => (
              <div
                key={bot.id}
                className="bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-xl p-4 flex flex-col justify-between shadow-xs dark:shadow-none"
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <h5 className="font-bold text-sm text-slate-900 dark:text-white tracking-tight">{bot.name}</h5>
                    <span className="text-[10px] font-semibold text-cyan-700 dark:text-cyan-400 bg-cyan-100 dark:bg-cyan-950/60 border border-cyan-300 dark:border-cyan-800/60 px-1.5 py-0.5 rounded uppercase">
                      {bot.category.replace('_', ' ')}
                    </span>
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 font-medium mb-2">{bot.vendor}</div>
                  <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-3 leading-relaxed mb-4">
                    {bot.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
                  {getActionBadge(bot.recommendedAction)}
                  <button
                    type="button"
                    onClick={() => handleCopy(bot.robotsTxtSnippet, bot.id)}
                    className="p-1.5 rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
                    title="Copy robots.txt snippet"
                  >
                    {copiedSnippet === bot.id ? (
                      <Check className="w-4 h-4 text-emerald-500 dark:text-emerald-400" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
