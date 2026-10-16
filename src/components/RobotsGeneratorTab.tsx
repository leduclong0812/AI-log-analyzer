import React, { useState } from 'react';
import { Copy, Check, Download, ShieldCheck, ShieldAlert, Sparkles, HelpCircle } from 'lucide-react';

export const RobotsGeneratorTab: React.FC = () => {
  const [strategy, setStrategy] = useState<'search_only' | 'allow_all' | 'strict_block' | 'balanced'>('search_only');
  const [copied, setCopied] = useState(false);

  const getRobotsContent = (selectedStrategy: string) => {
    switch (selectedStrategy) {
      case 'search_only':
        return `# ==============================================================================
# GEO OPTIMIZED ROBOTS.TXT: AI SEARCH ONLY (RECOMMENDED BY AI LOG ANALYZER)
# Purpose: Permits AI Search Engines to index & cite your content in answer engines
#          while blocking non-compensating foundation model training scrapers.
# ==============================================================================

# 1. ALLOW AI SEARCH ENGINES & ANSWER CITATIONS
User-agent: OAI-SearchBot
Allow: /

User-agent: PerplexityBot
Allow: /

User-agent: Claude-Web
Allow: /

User-agent: Applebot
Allow: /

User-agent: Bingbot
Allow: /

User-agent: DuckAssistBot
Allow: /

User-agent: YouBot
Allow: /

# 2. ALLOW REAL-TIME USER-DIRECTED BROWSING
User-agent: ChatGPT-User
Allow: /

User-agent: Claude-User
Allow: /

User-agent: Perplexity-User
Allow: /

# 3. DISALLOW FOUNDATION MODEL PRE-TRAINING SCRAPERS
User-agent: GPTBot
Disallow: /

User-agent: ClaudeBot
Disallow: /

User-agent: Bytespider
Disallow: /

User-agent: CCBot
Disallow: /

User-agent: Meta-ExternalAgent
Disallow: /

User-agent: DeepSeekBot
Disallow: /

User-agent: GrokBot
Disallow: /

User-agent: cohere-ai
Disallow: /

User-agent: MistralAI-Crawler
Disallow: /

User-agent: Amazonbot
Disallow: /

User-agent: Google-Extended
Disallow: /

# 4. DEFAULT DIRECTIVES
User-agent: *
Allow: /
Disallow: /admin/
Disallow: /private/
Disallow: /*?*sort=
Disallow: /*?*utm_

Sitemap: https://yourdomain.com/sitemap.xml`;

      case 'allow_all':
        return `# ==============================================================================
# MAXIMAL AI INDEXATION ROBOTS.TXT (MAX GEO VISIBILITY)
# Purpose: Opens access to all AI search engines, citation systems, and training models.
# ==============================================================================

User-agent: *
Allow: /

# Explicitly ensure AI search agents are permitted through any CDN WAF layers
User-agent: OAI-SearchBot
Allow: /

User-agent: PerplexityBot
Allow: /

User-agent: ClaudeBot
Allow: /

User-agent: GPTBot
Allow: /

User-agent: Applebot
Allow: /

User-agent: Google-Extended
Allow: /

Disallow: /admin/
Disallow: /api/private/

Sitemap: https://yourdomain.com/sitemap.xml`;

      case 'balanced':
        return `# ==============================================================================
# BALANCED GEO & BANDWIDTH PRESERVATION POLICY
# Purpose: Allows key search & training crawlers while disallowing high-frequency scrapers.
# ==============================================================================

# High-authority search & reference bots
User-agent: OAI-SearchBot
Allow: /

User-agent: PerplexityBot
Allow: /

User-agent: ClaudeBot
Allow: /

User-agent: GPTBot
Allow: /

# Block aggressive scrapers that consume high crawl budget without citation return
User-agent: Bytespider
Disallow: /

User-agent: CCBot
Disallow: /

User-agent: Webzio-Extended
Disallow: /

User-agent: Scrapy
Disallow: /

User-agent: *
Allow: /

Sitemap: https://yourdomain.com/sitemap.xml`;

      case 'strict_block':
        return `# ==============================================================================
# STRICT AI OPT-OUT ROBOTS.TXT
# Purpose: Expressly prohibits all AI training, search engines, and automated LLM fetchers.
# ==============================================================================

User-agent: GPTBot
Disallow: /

User-agent: OAI-SearchBot
Disallow: /

User-agent: ChatGPT-User
Disallow: /

User-agent: ClaudeBot
Disallow: /

User-agent: Claude-Web
Disallow: /

User-agent: PerplexityBot
Disallow: /

User-agent: Google-Extended
Disallow: /

User-agent: Applebot-Extended
Disallow: /

User-agent: Bytespider
Disallow: /

User-agent: CCBot
Disallow: /

User-agent: Meta-ExternalAgent
Disallow: /

User-agent: DeepSeekBot
Disallow: /

User-agent: GrokBot
Disallow: /

User-agent: cohere-ai
Disallow: /

User-agent: Amazonbot
Disallow: /

User-agent: *
Allow: /`;

      default:
        return '';
    }
  };

  const currentContent = getRobotsContent(strategy);

  const handleCopy = () => {
    navigator.clipboard.writeText(currentContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const element = document.createElement('a');
    const file = new Blob([currentContent], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = 'robots.txt';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="space-y-6">
      {/* Strategy selector */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5">
        <h3 className="text-sm font-semibold text-slate-200 mb-1">
          Select Your AI Crawl Policy Strategy
        </h3>
        <p className="text-xs text-slate-400 mb-4">
          Choose how you want modern Generative AI search engines, training scrapers, and answer bots to treat your site.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <button
            type="button"
            onClick={() => setStrategy('search_only')}
            className={`p-3.5 rounded-xl border text-left transition-all ${
              strategy === 'search_only'
                ? 'bg-cyan-950/60 border-cyan-500 shadow-sm'
                : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
            }`}
          >
            <div className="flex items-center gap-1.5 text-xs font-bold text-cyan-400 mb-1">
              <ShieldCheck className="w-4 h-4" /> Recommended GEO
            </div>
            <div className="text-sm font-bold text-white">AI Search Only</div>
            <p className="text-[11px] text-slate-400 mt-1 leading-normal">
              Permits ChatGPT Search, Perplexity, Claude-Web citations while blocking training bots.
            </p>
          </button>

          <button
            type="button"
            onClick={() => setStrategy('allow_all')}
            className={`p-3.5 rounded-xl border text-left transition-all ${
              strategy === 'allow_all'
                ? 'bg-emerald-950/60 border-emerald-500 shadow-sm'
                : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
            }`}
          >
            <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-400 mb-1">
              <Sparkles className="w-4 h-4" /> Full AI Open
            </div>
            <div className="text-sm font-bold text-white">Maximum Discovery</div>
            <p className="text-[11px] text-slate-400 mt-1 leading-normal">
              Permits all AI crawlers, model training, and search indexing unconditionally.
            </p>
          </button>

          <button
            type="button"
            onClick={() => setStrategy('balanced')}
            className={`p-3.5 rounded-xl border text-left transition-all ${
              strategy === 'balanced'
                ? 'bg-indigo-950/60 border-indigo-500 shadow-sm'
                : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
            }`}
          >
            <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-400 mb-1">
              <ShieldCheck className="w-4 h-4" /> Balanced Bandwidth
            </div>
            <div className="text-sm font-bold text-white">Block Heavy Scrapers</div>
            <p className="text-[11px] text-slate-400 mt-1 leading-normal">
              Allows top search engines while blocking aggressive bandwidth drains like Bytespider & CCBot.
            </p>
          </button>

          <button
            type="button"
            onClick={() => setStrategy('strict_block')}
            className={`p-3.5 rounded-xl border text-left transition-all ${
              strategy === 'strict_block'
                ? 'bg-rose-950/60 border-rose-500 shadow-sm'
                : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
            }`}
          >
            <div className="flex items-center gap-1.5 text-xs font-bold text-rose-400 mb-1">
              <ShieldAlert className="w-4 h-4" /> Full AI Opt-Out
            </div>
            <div className="text-sm font-bold text-white">Strict Disallow</div>
            <p className="text-[11px] text-slate-400 mt-1 leading-normal">
              Blocks all known 116+ AI crawlers, bots, and agents from indexing your content.
            </p>
          </button>
        </div>
      </div>

      {/* Code Editor Preview */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-xl overflow-hidden">
        <div className="bg-slate-950/80 px-4 py-3 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-rose-500/80 inline-block"></span>
            <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block"></span>
            <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block"></span>
            <span className="text-xs font-mono text-slate-400 ml-2">robots.txt</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg transition-colors"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Copied to Clipboard</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Content</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={handleDownload}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download File</span>
            </button>
          </div>
        </div>

        <div className="p-4 bg-slate-950 font-mono text-xs text-slate-300 leading-relaxed overflow-x-auto max-h-[460px]">
          <pre>{currentContent}</pre>
        </div>
      </div>

      {/* Critical Guidance Card */}
      <div className="bg-slate-900/40 border border-slate-800 rounded-xl p-4 text-xs text-slate-400 flex items-start gap-3">
        <HelpCircle className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-0.5" />
        <div className="space-y-1">
          <span className="font-semibold text-slate-200">
            Crucial Distinction: OAI-SearchBot vs GPTBot
          </span>
          <p className="leading-relaxed">
            Many site owners mistakenly block all of OpenAI with <code className="text-cyan-300">User-agent: GPTBot Disallow: /</code> without realizing that <code className="text-cyan-300">OAI-SearchBot</code> is a completely separate crawler used exclusively for ChatGPT Search and live link citations. Blocking GPTBot does NOT affect your ChatGPT Search visibility as long as OAI-SearchBot is explicitly allowed.
          </p>
        </div>
      </div>
    </div>
  );
};
