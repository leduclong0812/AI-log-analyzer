import React, { useState } from 'react';
import { UrlStat } from '../types/analyzer';
import { Search, Filter, AlertTriangle, ExternalLink, FileText, CheckCircle2 } from 'lucide-react';

interface UrlsTabProps {
  urlStats: UrlStat[];
}

export const UrlsTab: React.FC<UrlsTabProps> = ({ urlStats }) => {
  const [searchPath, setSearchPath] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'errors' | 'success'>('all');

  const filteredUrls = urlStats.filter((u) => {
    const matchesSearch = u.path.toLowerCase().includes(searchPath.toLowerCase());
    if (statusFilter === 'errors') return matchesSearch && u.hasErrors;
    if (statusFilter === 'success') return matchesSearch && !u.hasErrors;
    return matchesSearch;
  });

  const formatBytes = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    return `${(bytes / 1024).toFixed(1)} KB`;
  };

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xs dark:shadow-none">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchPath}
            onChange={(e) => setSearchPath(e.target.value)}
            placeholder="Filter by path (e.g. /blog, /docs, /pricing)..."
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-800 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors font-mono"
          />
        </div>

        <div className="flex items-center gap-1 text-xs">
          <button
            onClick={() => setStatusFilter('all')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
              statusFilter === 'all'
                ? 'bg-slate-100 dark:bg-slate-800 text-cyan-700 dark:text-cyan-400 border border-slate-300 dark:border-slate-700 font-semibold'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            All URLs ({urlStats.length})
          </button>
          <button
            onClick={() => setStatusFilter('errors')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
              statusFilter === 'errors'
                ? 'bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-800/80 font-semibold'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            With Errors / Throttles
          </button>
          <button
            onClick={() => setStatusFilter('success')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
              statusFilter === 'success'
                ? 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800/80 font-semibold'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            Clean 200s Only
          </button>
        </div>
      </div>

      {/* URLs Table */}
      <div className="bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-xs dark:shadow-none">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-950/80 border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3 px-4">URL Path</th>
                <th className="py-3 px-4 text-right">AI Hits</th>
                <th className="py-3 px-4">Crawling Bots</th>
                <th className="py-3 px-4">Status Codes</th>
                <th className="py-3 px-4 text-right">Payload Size</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800/60 font-mono">
              {filteredUrls.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-slate-400 dark:text-slate-500 font-sans text-xs">
                    No URLs match the specified search or filter criteria.
                  </td>
                </tr>
              ) : (
                filteredUrls.map((u, i) => (
                  <tr key={i} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                    {/* Path */}
                    <td className="py-3 px-4 text-slate-800 dark:text-slate-200 max-w-sm truncate font-medium">
                      <span className="text-cyan-600 dark:text-cyan-400/80 mr-1.5 font-bold">/</span>
                      {u.path.replace(/^\//, '')}
                    </td>

                    {/* AI Hits */}
                    <td className="py-3 px-4 text-right font-bold text-slate-900 dark:text-white">
                      {u.aiHits.toLocaleString()}
                    </td>

                    {/* Bots List */}
                    <td className="py-3 px-4 font-sans">
                      <div className="flex items-center gap-1.5 flex-wrap max-w-xs">
                        {u.uniqueBots.length > 0 ? (
                          u.uniqueBots.map((b) => (
                            <span
                              key={b}
                              className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 font-medium"
                            >
                              {b}
                            </span>
                          ))
                        ) : (
                          <span className="text-slate-400 dark:text-slate-500 text-[11px] font-sans">Non-AI only</span>
                        )}
                      </div>
                    </td>

                    {/* Status Code Pills */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {Object.entries(u.statusCodes).map(([code, count]) => {
                          const isErr = parseInt(code, 10) >= 400;
                          return (
                            <span
                              key={code}
                              className={`text-[10px] px-1.5 py-0.5 rounded font-mono font-bold ${
                                isErr
                                  ? 'bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-300 border border-rose-300 dark:border-rose-800'
                                  : 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800'
                              }`}
                            >
                              {code}: {count}
                            </span>
                          );
                        })}
                      </div>
                    </td>

                    {/* Average Size */}
                    <td className="py-3 px-4 text-right text-slate-500 dark:text-slate-400 text-xs">
                      {formatBytes(u.avgBytes)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
