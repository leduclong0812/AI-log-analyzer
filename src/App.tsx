import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { GeoScoreCard } from './components/GeoScoreCard';
import { MetricCards } from './components/MetricCards';
import { OverviewTab } from './components/OverviewTab';
import { CrawlersTab } from './components/CrawlersTab';
import { HeatmapTab } from './components/HeatmapTab';
import { UrlsTab } from './components/UrlsTab';
import { IssuesTab } from './components/IssuesTab';
import { RobotsGeneratorTab } from './components/RobotsGeneratorTab';
import { AiAuditTab } from './components/AiAuditTab';
import { PasteModal } from './components/PasteModal';
import { parseRawLogs, ParseResult } from './utils/logParser';
import { calculateGeoScore } from './utils/geoCalculator';
import { SAMPLE_CLOUDFLARE_LOGS } from './data/sampleLogs';
import {
  BarChart3,
  Bot,
  Calendar,
  FileText,
  AlertTriangle,
  Code2,
  Sparkles,
  Download,
  Upload,
  Terminal,
  ShieldCheck,
  CheckCircle,
} from 'lucide-react';

export default function App() {
  const [parseResult, setParseResult] = useState<ParseResult | null>(null);
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [isPasteModalOpen, setIsPasteModalOpen] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  // Theme State: 'dark' | 'light'
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('teejay_theme');
      if (saved === 'light' || saved === 'dark') return saved;
      return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
    }
    return 'dark';
  });

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
      root.classList.remove('light');
    } else {
      root.classList.add('light');
      root.classList.remove('dark');
    }
    localStorage.setItem('teejay_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  // Initialize with sample logs on first mount
  useEffect(() => {
    loadLogs(SAMPLE_CLOUDFLARE_LOGS, 'Cloudflare Logpush (JSON)');
  }, []);

  const showToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  const loadLogs = (rawText: string, formatHint: string) => {
    setIsProcessing(true);
    // Use setTimeout so UI updates loader cleanly
    setTimeout(() => {
      try {
        const result = parseRawLogs(rawText);
        setParseResult(result);
        showToast(`Parsed ${result.entries.length} requests (${result.summary.aiRequests} AI crawler hits)`);
      } catch (err) {
        console.error(err);
        showToast('Failed to parse logs. Check file format.');
      } finally {
        setIsProcessing(false);
      }
    }, 50);
  };

  const handleFileUpload = (file: File) => {
    if (!file) return;
    setIsProcessing(true);
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      if (text) {
        loadLogs(text, file.name);
      }
    };
    reader.readAsText(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const handleClearLogs = () => {
    setParseResult(null);
    showToast('Logs cleared');
  };

  const handleExportJson = () => {
    if (!parseResult) return;
    const exportData = {
      brand: 'Teejay AI Log Analyzer',
      engine: 'Teejay GEO Score™ 2.0',
      exportDate: new Date().toISOString(),
      geoScore,
      summary: parseResult.summary,
      botStats: parseResult.botStats,
      urlStats: parseResult.urlStats.slice(0, 100),
      issues: parseResult.issues,
    };
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `teejay-geo-audit-report-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Exported Teejay GEO audit JSON report');
  };

  const geoScore = parseResult
    ? calculateGeoScore(parseResult.summary, parseResult.botStats)
    : null;

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    {
      id: 'crawlers',
      label: 'AI Crawlers',
      icon: Bot,
      count: parseResult?.botStats.length || 0,
    },
    { id: 'heatmap', label: 'Crawl Heatmap', icon: Calendar },
    {
      id: 'urls',
      label: 'URLs Crawled',
      icon: FileText,
      count: parseResult?.urlStats.filter((u) => u.aiHits > 0).length || 0,
    },
    {
      id: 'issues',
      label: 'Crawl Issues',
      icon: AlertTriangle,
      count: parseResult?.issues.length || 0,
      badgeColor:
        parseResult && parseResult.issues.length > 0 ? 'text-amber-400 bg-amber-950/80' : undefined,
    },
    { id: 'robots', label: 'Robots.txt Optimizer', icon: Code2 },
    { id: 'ai_audit', label: 'Gemini AI Audit', icon: Sparkles, highlight: true },
  ];

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`min-h-screen ${
        theme === 'dark' ? 'dark bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-800'
      } flex flex-col relative transition-colors selection:bg-cyan-500/30 selection:text-cyan-700 dark:selection:text-cyan-200`}
    >
      {/* Toast Notification */}
      {notification && (
        <div className="fixed bottom-5 right-5 z-50 bg-white dark:bg-slate-900 border border-slate-300 dark:border-cyan-500/40 text-slate-800 dark:text-slate-200 px-4 py-2.5 rounded-xl shadow-2xl text-xs flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2">
          <CheckCircle className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
          <span>{notification}</span>
        </div>
      )}

      {/* Drag & drop overlay indicator */}
      {isDragging && (
        <div className="fixed inset-0 z-50 bg-cyan-950/80 border-4 border-dashed border-cyan-400 backdrop-blur-sm flex flex-col items-center justify-center pointer-events-none">
          <Upload className="w-16 h-16 text-cyan-300 animate-bounce mb-3" />
          <h3 className="text-xl font-bold text-white">Drop access log file here</h3>
          <p className="text-sm text-cyan-200 mt-1">Supports .log, .txt, .csv, .json, .tsv</p>
        </div>
      )}

      {/* Header */}
      <Header
        onLoadSample={loadLogs}
        onOpenPasteModal={() => setIsPasteModalOpen(true)}
        onFileUpload={handleFileUpload}
        onClearLogs={handleClearLogs}
        theme={theme}
        onSetTheme={setTheme}
        onToggleTheme={toggleTheme}
        hasLogs={!!parseResult && parseResult.entries.length > 0}
        formatDetected={parseResult?.formatDetected || 'Unknown'}
        totalLines={parseResult?.entries.length || 0}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Processing Indicator */}
        {isProcessing && (
          <div className="bg-cyan-50 dark:bg-cyan-950/40 border border-cyan-200 dark:border-cyan-800/40 rounded-xl p-4 text-center text-xs text-cyan-800 dark:text-cyan-300 flex items-center justify-center gap-2 shadow-xs">
            <span className="w-4 h-4 border-2 border-cyan-600 dark:border-cyan-400 border-t-transparent rounded-full animate-spin"></span>
            <span>Parsing server log telemetry & detecting 116+ AI crawler signatures...</span>
          </div>
        )}

        {/* If no logs loaded yet */}
        {!parseResult || parseResult.entries.length === 0 ? (
          <div className="bg-white dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 rounded-2xl p-12 text-center max-w-2xl mx-auto my-12 shadow-sm dark:shadow-none">
            <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-600 dark:text-cyan-400 flex items-center justify-center mx-auto mb-4">
              <Bot className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">No Server Logs Loaded</h2>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-6">
              Drop any server access log file, upload an export from Cloudflare Logpush, Nginx, Apache, or AWS CloudFront, or load a preset sample to view your site&apos;s GEO Score™ and 116+ AI bot crawl analysis.
            </p>
            <div className="flex items-center justify-center gap-3 flex-wrap">
              <button
                type="button"
                onClick={() => loadLogs(SAMPLE_CLOUDFLARE_LOGS, 'Cloudflare Logpush (JSON)')}
                className="px-4 py-2 text-xs font-semibold bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg shadow-md transition-colors cursor-pointer"
              >
                Load Cloudflare Sample
              </button>
              <button
                type="button"
                onClick={() => setIsPasteModalOpen(true)}
                className="px-4 py-2 text-xs font-semibold bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-700 rounded-lg transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer"
              >
                <Terminal className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
                <span>Paste Raw Logs</span>
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Top Row: GEO Score Card */}
            {geoScore && (
              <GeoScoreCard
                score={geoScore}
                aiPercentage={parseResult.summary.aiPercentage}
                uniqueBotsCount={parseResult.summary.uniqueBotsCount}
              />
            )}

            {/* Middle Row: Quick Metric Cards */}
            <MetricCards summary={parseResult.summary} />

            {/* Navigation Tabs Bar */}
            <div className="border-b border-slate-200 dark:border-slate-800 flex items-center justify-between gap-4 overflow-x-auto pb-px">
              <div className="flex items-center gap-1 min-w-max">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center gap-2 px-3.5 py-2.5 text-xs font-medium border-b-2 transition-all whitespace-nowrap cursor-pointer ${
                        isActive
                          ? 'border-cyan-600 text-cyan-600 dark:border-cyan-400 dark:text-cyan-400 font-semibold'
                          : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:border-slate-300 dark:hover:border-slate-700'
                      }`}
                    >
                      <Icon className={`w-3.5 h-3.5 ${tab.highlight ? 'text-cyan-600 dark:text-cyan-400' : ''}`} />
                      <span>{tab.label}</span>
                      {tab.count !== undefined && tab.count > 0 && (
                        <span
                          className={`text-[10px] px-1.5 py-0.2 rounded font-mono ${
                            tab.badgeColor || 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-400'
                          }`}
                        >
                          {tab.count}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Export Button */}
              <div className="flex items-center gap-2 flex-shrink-0 py-1">
                <button
                  type="button"
                  onClick={handleExportJson}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-300 dark:border-slate-800 rounded-lg transition-colors shadow-xs cursor-pointer"
                  title="Export full log analytics and score to JSON"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Export JSON</span>
                </button>
              </div>
            </div>

            {/* Tab Panes */}
            <div className="pt-2">
              {activeTab === 'overview' && (
                <OverviewTab
                  summary={parseResult.summary}
                  botStats={parseResult.botStats}
                  urlStats={parseResult.urlStats}
                  onSelectTab={setActiveTab}
                />
              )}

              {activeTab === 'crawlers' && <CrawlersTab botStats={parseResult.botStats} />}

              {activeTab === 'heatmap' && (
                <HeatmapTab heatmap={parseResult.heatmap} summary={parseResult.summary} />
              )}

              {activeTab === 'urls' && <UrlsTab urlStats={parseResult.urlStats} />}

              {activeTab === 'issues' && (
                <IssuesTab
                  issues={parseResult.issues}
                  onOpenRobotsTab={() => setActiveTab('robots')}
                />
              )}

              {activeTab === 'robots' && <RobotsGeneratorTab />}

              {activeTab === 'ai_audit' && geoScore && (
                <AiAuditTab
                  score={geoScore}
                  summary={parseResult.summary}
                  botStats={parseResult.botStats}
                  urlStats={parseResult.urlStats}
                  issues={parseResult.issues}
                />
              )}
            </div>
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-900 bg-white dark:bg-slate-950 mt-12 py-6 text-xs text-slate-500 dark:text-slate-400 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-800 dark:text-slate-300">Teejay · AI Log Analyzer</span>
            <span>·</span>
            <span>Generative Engine Optimization (GEO) & Crawler Intelligence</span>
          </div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-4">
            <span>Detects 116+ AI Crawlers</span>
            <span>·</span>
            <span>Client-Side Processing</span>
            <span>·</span>
            <span className="text-cyan-600 dark:text-cyan-400 font-semibold">Built with precision by Teejay</span>
          </div>
        </div>
      </footer>

      {/* Paste Modal */}
      <PasteModal
        isOpen={isPasteModalOpen}
        onClose={() => setIsPasteModalOpen(false)}
        onParseLogs={loadLogs}
      />
    </div>
  );
}
