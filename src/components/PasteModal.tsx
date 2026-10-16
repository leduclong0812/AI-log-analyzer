import React, { useState } from 'react';
import { X, Terminal, Check } from 'lucide-react';
import { SAMPLE_CLOUDFLARE_LOGS, SAMPLE_NGINX_LOGS } from '../data/sampleLogs';

interface PasteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onParseLogs: (text: string, formatHint: string) => void;
}

export const PasteModal: React.FC<PasteModalProps> = ({ isOpen, onClose, onParseLogs }) => {
  const [text, setText] = useState('');

  if (!isOpen) return null;

  const handleParse = () => {
    if (!text.trim()) return;
    onParseLogs(text.trim(), 'Pasted Raw Logs');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/80 dark:bg-slate-950/50">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-cyan-100 dark:bg-cyan-500/10 text-cyan-600 dark:text-cyan-400">
              <Terminal className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Paste Raw Access Logs</h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Supports Nginx, Apache, Cloudflare JSON, CSV, AWS CloudFront, and Caddy
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-4">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-600 dark:text-slate-400">Insert 10 to 5,000+ log lines below:</span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setText(SAMPLE_CLOUDFLARE_LOGS)}
                className="text-[11px] text-cyan-600 dark:text-cyan-400 hover:underline font-medium"
              >
                Insert Sample Cloudflare
              </button>
              <span className="text-slate-400 dark:text-slate-600">·</span>
              <button
                type="button"
                onClick={() => setText(SAMPLE_NGINX_LOGS)}
                className="text-[11px] text-cyan-600 dark:text-cyan-400 hover:underline font-medium"
              >
                Insert Sample Nginx
              </button>
            </div>
          </div>

          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={`127.0.0.1 - - [15/Oct/2026:10:00:00 +0000] "GET /docs HTTP/1.1" 200 12400 "-" "PerplexityBot/1.0"
{"ClientIP":"...","EdgeResponseStatus":200,"ClientRequestUserAgent":"GPTBot/1.2"}...`}
            rows={10}
            className="w-full p-3 font-mono text-xs bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl text-slate-900 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none focus:border-cyan-500 transition-colors resize-y leading-relaxed"
          />

          <div className="text-[11px] text-slate-500 flex items-center justify-between">
            <span>Lines detected: {text ? text.split('\n').filter(l => l.trim()).length : 0}</span>
            <span>All parsing executed client-side. No log data transmitted off-device.</span>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 bg-slate-50 dark:bg-slate-950/60 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleParse}
            disabled={!text.trim()}
            className="px-4 py-2 text-xs font-semibold bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg shadow-md transition-colors disabled:opacity-50 cursor-pointer flex items-center gap-1.5"
          >
            <Check className="w-3.5 h-3.5" />
            <span>Analyze Logs</span>
          </button>
        </div>
      </div>
    </div>
  );
};
