import React, { useState } from 'react';
import { HeatmapCell, LogSummary } from '../types/analyzer';
import { Calendar, Clock, AlertCircle, Info, Zap } from 'lucide-react';

interface HeatmapTabProps {
  heatmap: HeatmapCell[];
  summary: LogSummary;
}

export const HeatmapTab: React.FC<HeatmapTabProps> = ({ heatmap, summary }) => {
  const [hoveredCell, setHoveredCell] = useState<{ day: number; hour: number; count: number } | null>(null);

  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const hours = Array.from({ length: 24 }, (_, i) => i);

  // Find max count for color scaling
  const maxCount = Math.max(...heatmap.map(h => h.count), 1);

  const getCellColor = (count: number) => {
    if (count === 0) return 'bg-slate-900/80 border-slate-800/60 hover:border-slate-600';
    const ratio = count / maxCount;
    if (ratio < 0.15) return 'bg-cyan-950/60 border-cyan-900/60 text-cyan-400 hover:border-cyan-500';
    if (ratio < 0.4) return 'bg-cyan-800/80 border-cyan-700/80 text-white hover:border-cyan-400';
    if (ratio < 0.75) return 'bg-cyan-600 border-cyan-500 text-white hover:border-cyan-300';
    return 'bg-emerald-500 border-emerald-400 text-slate-950 font-bold hover:border-white shadow-sm shadow-emerald-500/20';
  };

  // Find cell
  const getCell = (d: number, h: number) => {
    return heatmap.find(c => c.day === d && c.hour === h) || { day: d, hour: h, count: 0 };
  };

  // Identify peak hour and quiet hours
  let peakHour = 0;
  let peakHourTotal = 0;
  const hourTotals = Array(24).fill(0);
  for (const c of heatmap) {
    hourTotals[c.hour] += c.count;
  }
  for (let h = 0; h < 24; h++) {
    if (hourTotals[h] > peakHourTotal) {
      peakHourTotal = hourTotals[h];
      peakHour = h;
    }
  }

  // Crawl gaps: hours with 0 hits across all days
  const gapHours = hours.filter(h => hourTotals[h] === 0);

  return (
    <div className="space-y-6">
      {/* Intro & Insights */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-sm font-semibold text-slate-200">AI Crawler 24x7 Activity Heatmap</h3>
            <p className="text-xs text-slate-400">
              Visual representation of crawl cadence by day of week and hour of day (UTC)
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-400 text-[11px]">Intensity:</span>
            <div className="flex items-center gap-1 text-[10px]">
              <span className="w-3.5 h-3.5 rounded bg-slate-900 border border-slate-800" title="0 hits"></span>
              <span className="w-3.5 h-3.5 rounded bg-cyan-950/60 border border-cyan-900/60" title="Low"></span>
              <span className="w-3.5 h-3.5 rounded bg-cyan-800/80 border border-cyan-700/80" title="Moderate"></span>
              <span className="w-3.5 h-3.5 rounded bg-cyan-600 border border-cyan-500" title="High"></span>
              <span className="w-3.5 h-3.5 rounded bg-emerald-500 border border-emerald-400" title="Peak"></span>
            </div>
          </div>
        </div>

        {/* Heatmap Grid */}
        <div className="mt-6 overflow-x-auto pb-2">
          <div className="min-w-[700px]">
            {/* Hour header */}
            <div className="grid grid-cols-[80px_repeat(24,1fr)] gap-1 mb-1 text-[10px] text-slate-500 font-mono text-center">
              <div></div>
              {hours.map(h => (
                <div key={h} className="truncate">
                  {h % 3 === 0 ? `${h}h` : ''}
                </div>
              ))}
            </div>

            {/* Days rows */}
            {days.map((dayName, dayIndex) => (
              <div key={dayName} className="grid grid-cols-[80px_repeat(24,1fr)] gap-1 mb-1 items-center">
                <div className="text-xs font-medium text-slate-400 truncate pr-2">
                  {dayName.slice(0, 3)}
                </div>
                {hours.map(h => {
                  const cell = getCell(dayIndex, h);
                  return (
                    <div
                      key={h}
                      onMouseEnter={() => setHoveredCell(cell)}
                      onMouseLeave={() => setHoveredCell(null)}
                      className={`h-7 rounded border transition-colors cursor-pointer flex items-center justify-center text-[10px] ${getCellColor(
                        cell.count
                      )}`}
                    >
                      {cell.count > 0 && cell.count === maxCount ? '★' : ''}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>

        {/* Hovered cell info callout */}
        <div className="mt-3 text-xs text-slate-400 flex items-center justify-between min-h-[22px]">
          {hoveredCell ? (
            <div className="flex items-center gap-2">
              <Clock className="w-3.5 h-3.5 text-cyan-400" />
              <span className="text-slate-200 font-medium">
                {days[hoveredCell.day]}, {hoveredCell.hour.toString().padStart(2, '0')}:00 UTC
              </span>
              <span className="text-slate-500">·</span>
              <span className="text-cyan-300 font-semibold">{hoveredCell.count.toLocaleString()} AI requests</span>
            </div>
          ) : (
            <span className="text-slate-500 text-[11px]">Hover over any slot to inspect exact crawl volume.</span>
          )}
        </div>
      </div>

      {/* Crawl Gaps & Timing Analytics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Peak Window */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5">
          <div className="flex items-center gap-2 text-cyan-400 text-xs font-semibold uppercase tracking-wider mb-2">
            <Zap className="w-4 h-4" /> Peak Crawl Velocity
          </div>
          <div className="text-xl font-bold text-white mb-1">
            {peakHour.toString().padStart(2, '0')}:00 - {(peakHour + 1).toString().padStart(2, '0')}:00 UTC
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            AI search agents (Perplexity, ChatGPT Search, Applebot) concentrate highest index refresh activity during this window ({peakHourTotal.toLocaleString()} requests recorded). Ensure caching or CDN edge rules are optimized to prevent origin CPU spikes.
          </p>
        </div>

        {/* Crawl Gaps */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5">
          <div className="flex items-center gap-2 text-amber-400 text-xs font-semibold uppercase tracking-wider mb-2">
            <AlertCircle className="w-4 h-4" /> Crawl Gaps Analysis
          </div>
          <div className="text-xl font-bold text-white mb-1">
            {gapHours.length > 0 ? `${gapHours.length} Inactive Hours Detected` : 'Continuous 24h Crawl Coverage'}
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            {gapHours.length > 0
              ? `Zero AI crawler activity was logged during hours: ${gapHours.slice(0, 6).map(h => `${h}:00`).join(', ')}. If your content updates during these hours, AI models experience latency before indexing new publications.`
              : 'AI discovery engines maintain balanced around-the-clock crawl presence without prolonged gaps.'}
          </p>
        </div>
      </div>
    </div>
  );
};
