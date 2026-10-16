import React from 'react';
import { LogSummary } from '../types/analyzer';
import { Bot, FileText, Globe, AlertOctagon, HardDrive, Compass } from 'lucide-react';

interface MetricCardsProps {
  summary: LogSummary;
}

export const MetricCards: React.FC<MetricCardsProps> = ({ summary }) => {
  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const cards = [
    {
      title: 'Total Requests',
      value: summary.totalRequests.toLocaleString(),
      subtext: 'Combined server traffic',
      icon: Compass,
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/10',
      borderColor: 'border-blue-500/20',
    },
    {
      title: 'AI Crawler Requests',
      value: summary.aiRequests.toLocaleString(),
      subtext: `${summary.aiPercentage}% of total traffic`,
      icon: Bot,
      color: 'text-cyan-400',
      bgColor: 'bg-cyan-500/10',
      borderColor: 'border-cyan-500/20',
      highlight: true,
    },
    {
      title: 'AI Bots Detected',
      value: `${summary.uniqueBotsCount} Bots`,
      subtext: `${Object.keys(summary.vendorBreakdown).length} distinct AI providers`,
      icon: Globe,
      color: 'text-indigo-400',
      bgColor: 'bg-indigo-500/10',
      borderColor: 'border-indigo-500/20',
    },
    {
      title: 'Unique Pages Crawled',
      value: summary.uniqueUrlsCrawled.toLocaleString(),
      subtext: 'Indexed paths by AI',
      icon: FileText,
      color: 'text-violet-400',
      bgColor: 'bg-violet-500/10',
      borderColor: 'border-violet-500/20',
    },
    {
      title: 'AI Crawl Error Rate',
      value: `${summary.aiErrorRate}%`,
      subtext: summary.aiErrorRate > 5 ? 'Elevated throttling or 404s' : 'Healthy crawl response',
      icon: AlertOctagon,
      color: summary.aiErrorRate > 5 ? 'text-amber-400' : 'text-emerald-400',
      bgColor: summary.aiErrorRate > 5 ? 'bg-amber-500/10' : 'bg-emerald-500/10',
      borderColor: summary.aiErrorRate > 5 ? 'border-amber-500/20' : 'border-emerald-500/20',
    },
    {
      title: 'Bandwidth Ingested',
      value: formatBytes(summary.totalBytes),
      subtext: 'Data served to crawlers',
      icon: HardDrive,
      color: 'text-slate-300',
      bgColor: 'bg-slate-500/10',
      borderColor: 'border-slate-500/20',
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
      {cards.map((c, i) => {
        const Icon = c.icon;
        return (
          <div
            key={i}
            className={`rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 p-4 transition-all duration-200 hover:border-slate-300 dark:hover:border-slate-700 shadow-xs dark:shadow-none`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 truncate">{c.title}</span>
              <div className={`p-1.5 rounded-lg ${c.bgColor} ${c.color}`}>
                <Icon className="w-3.5 h-3.5" />
              </div>
            </div>
            <div className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">{c.value}</div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 truncate">{c.subtext}</div>
          </div>
        );
      })}
    </div>
  );
};
