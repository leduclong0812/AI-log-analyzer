import React, { useRef } from 'react';
import { Bot, FileText, Upload, Sparkles, Terminal, Trash2, ArrowUpRight } from 'lucide-react';
import { SAMPLE_CLOUDFLARE_LOGS, SAMPLE_NGINX_LOGS } from '../data/sampleLogs';

interface HeaderProps {
  onLoadSample: (sampleText: string, formatName: string) => void;
  onOpenPasteModal: () => void;
  onFileUpload: (file: File) => void;
  onClearLogs: () => void;
  hasLogs: boolean;
  formatDetected: string;
  totalLines: number;
}

export const Header: React.FC<HeaderProps> = ({
  onLoadSample,
  onOpenPasteModal,
  onFileUpload,
  onClearLogs,
  hasLogs,
  formatDetected,
  totalLines,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onFileUpload(file);
    }
    // reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <header className="border-b border-slate-800 bg-slate-950/80 backdrop-blur-md sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Brand */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20 text-white font-bold">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-bold text-white tracking-tight">AI Log Analyzer</h1>
                <span className="text-[11px] font-semibold text-cyan-400 bg-cyan-950/60 border border-cyan-800/60 px-2 py-0.5 rounded">
                  GEO Score™ 2.0
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Crawler Intelligence & Generative Engine Optimization for 116+ AI Bots
              </p>
            </div>
          </div>

          {/* Action Bar */}
          <div className="flex items-center flex-wrap gap-2">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept=".log,.txt,.csv,.json,.jsonl,.tsv"
              className="hidden"
            />

            {/* Quick Demo Samples */}
            <div className="flex items-center bg-slate-900 border border-slate-800 rounded-lg p-0.5 text-xs">
              <button
                type="button"
                onClick={() => onLoadSample(SAMPLE_CLOUDFLARE_LOGS, 'Cloudflare Logpush (JSON)')}
                className="px-2.5 py-1.5 font-medium text-slate-300 hover:text-white hover:bg-slate-800 rounded-md transition-colors"
                title="Load Cloudflare Logpush JSON with Perplexity, OpenAI, and Claude crawlers"
              >
                Sample Cloudflare
              </button>
              <button
                type="button"
                onClick={() => onLoadSample(SAMPLE_NGINX_LOGS, 'Nginx Access Log')}
                className="px-2.5 py-1.5 font-medium text-slate-300 hover:text-white hover:bg-slate-800 rounded-md transition-colors"
                title="Load Nginx Access Log with rate limits & crawl gaps"
              >
                Sample Nginx
              </button>
            </div>

            {/* Paste Raw Logs */}
            <button
              type="button"
              onClick={onOpenPasteModal}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700/80 rounded-lg transition-colors"
            >
              <Terminal className="w-3.5 h-3.5 text-cyan-400" />
              <span>Paste Logs</span>
            </button>

            {/* Upload File */}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg shadow-sm transition-colors cursor-pointer"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Upload Log File</span>
            </button>

            {/* Clear button if logs present */}
            {hasLogs && (
              <button
                type="button"
                onClick={onClearLogs}
                className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-950/30 rounded-lg border border-transparent hover:border-rose-900/40 transition-colors"
                title="Clear current log analysis"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Current dataset status bar if loaded */}
        {hasLogs && (
          <div className="mt-3 pt-3 border-t border-slate-800/60 flex flex-wrap items-center justify-between text-xs text-slate-400">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="text-slate-300 font-medium">Dataset Loaded:</span>
              <span className="text-cyan-300">{formatDetected}</span>
              <span className="text-slate-600">·</span>
              <span>{totalLines.toLocaleString()} records parsed</span>
            </div>
            <div className="text-[11px] text-slate-500 hidden sm:block">
              Privacy Guaranteed: 100% processed locally in browser
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
