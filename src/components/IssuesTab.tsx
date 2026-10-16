import React from 'react';
import { CrawlIssue } from '../types/analyzer';
import { AlertCircle, AlertTriangle, Info, CheckCircle2, ShieldCheck, ArrowRight } from 'lucide-react';

interface IssuesTabProps {
  issues: CrawlIssue[];
  onOpenRobotsTab: () => void;
}

export const IssuesTab: React.FC<IssuesTabProps> = ({ issues, onOpenRobotsTab }) => {
  const criticalCount = issues.filter(i => i.severity === 'critical').length;
  const warningCount = issues.filter(i => i.severity === 'warning').length;
  const infoCount = issues.filter(i => i.severity === 'info').length;

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs dark:shadow-none">
        <div>
          <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-200">Crawl Bottlenecks & Audit Issues</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Detected infrastructure, throttling, or robots configuration issues that degrade your GEO Score™
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="px-2.5 py-1 rounded-md bg-rose-50 dark:bg-rose-950/80 border border-rose-200 dark:border-rose-800/80 text-rose-700 dark:text-rose-300 font-medium">
            {criticalCount} Critical
          </span>
          <span className="px-2.5 py-1 rounded-md bg-amber-50 dark:bg-amber-950/80 border border-amber-200 dark:border-amber-800/80 text-amber-700 dark:text-amber-300 font-medium">
            {warningCount} Warnings
          </span>
          <span className="px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-medium">
            {infoCount} Info
          </span>
        </div>
      </div>

      {/* Issues List */}
      {issues.length === 0 ? (
        <div className="bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-500/30 rounded-xl p-8 text-center shadow-xs dark:shadow-none">
          <CheckCircle2 className="w-10 h-10 text-emerald-600 dark:text-emerald-400 mx-auto mb-3" />
          <h4 className="text-base font-bold text-slate-900 dark:text-white">No Critical Crawl Issues Detected</h4>
          <p className="text-xs text-emerald-800/80 dark:text-emerald-300/80 max-w-md mx-auto mt-1">
            All AI crawlers in your access logs were served with clean HTTP 200/304 statuses with zero detected throttling loops.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {issues.map((issue) => {
            const isCritical = issue.severity === 'critical';
            const isWarning = issue.severity === 'warning';

            return (
              <div
                key={issue.id}
                className={`rounded-xl border p-5 transition-all shadow-xs dark:shadow-none ${
                  isCritical
                    ? 'bg-rose-50/60 dark:bg-rose-950/20 border-rose-200 dark:border-rose-500/30'
                    : isWarning
                    ? 'bg-amber-50/60 dark:bg-amber-950/20 border-amber-200 dark:border-amber-500/30'
                    : 'bg-white dark:bg-slate-900/60 border-slate-200 dark:border-slate-800'
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <div
                      className={`p-2 rounded-lg mt-0.5 ${
                        isCritical
                          ? 'bg-rose-100 dark:bg-rose-500/20 text-rose-600 dark:text-rose-400'
                          : isWarning
                          ? 'bg-amber-100 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400'
                          : 'bg-cyan-100 dark:bg-cyan-500/20 text-cyan-600 dark:text-cyan-400'
                      }`}
                    >
                      {isCritical ? (
                        <AlertCircle className="w-5 h-5" />
                      ) : isWarning ? (
                        <AlertTriangle className="w-5 h-5" />
                      ) : (
                        <Info className="w-5 h-5" />
                      )}
                    </div>

                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="text-sm font-bold text-slate-900 dark:text-white tracking-tight">{issue.title}</h4>
                        {issue.statusCode && (
                          <span className="font-mono text-[11px] px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 font-semibold">
                            HTTP {issue.statusCode}
                          </span>
                        )}
                        {issue.affectedBot && (
                          <span className="text-[11px] text-cyan-700 dark:text-cyan-300 font-medium">
                            Bot: {issue.affectedBot}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                        {issue.description}
                      </p>

                      {issue.exampleUrl && (
                        <div className="mt-2 text-[11px] font-mono text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-950/80 px-2.5 py-1 rounded border border-slate-200 dark:border-slate-800/80 truncate max-w-xl">
                          Sample Path: {issue.exampleUrl}
                        </div>
                      )}

                      {/* Actionable Solution */}
                      <div className="mt-3.5 p-3 rounded-lg bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800/80 text-xs">
                        <span className="font-semibold text-slate-800 dark:text-slate-200">Recommended Fix: </span>
                        <span className="text-slate-600 dark:text-slate-300">{issue.recommendation}</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right flex-shrink-0">
                    <div className="text-lg font-bold text-slate-900 dark:text-white font-mono">{issue.count}</div>
                    <div className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-medium">Events</div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Direct Call to Action */}
      <div className="bg-gradient-to-r from-cyan-50 to-blue-50 dark:from-cyan-950/60 dark:to-blue-950/60 border border-cyan-200 dark:border-cyan-800/40 rounded-xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xs dark:shadow-none">
        <div>
          <h4 className="text-sm font-bold text-slate-900 dark:text-white">Need to update your crawler access rules?</h4>
          <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">
            Generate an optimized <code className="text-cyan-700 dark:text-cyan-300 font-mono">robots.txt</code> file to selectively allow AI search bots while controlling training scrapers.
          </p>
        </div>
        <button
          onClick={onOpenRobotsTab}
          className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg shadow-md transition-colors whitespace-nowrap cursor-pointer"
        >
          <span>Open Robots.txt Optimizer</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
