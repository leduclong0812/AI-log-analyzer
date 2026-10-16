import { ParsedLogEntry, LogSummary, BotStat, UrlStat, CrawlIssue, HeatmapCell, BotCategory } from '../types/analyzer';
import { identifyBot } from '../data/aiBotsDatabase';

export interface ParseResult {
  entries: ParsedLogEntry[];
  summary: LogSummary;
  botStats: BotStat[];
  urlStats: UrlStat[];
  issues: CrawlIssue[];
  heatmap: HeatmapCell[];
  formatDetected: string;
}

// Regex for Combined Log Format (Nginx / Apache / Caddy plain)
const COMBINED_LOG_REGEX = /^(\S+)\s+\S+\s+\S+\s+\[([^\]]+)\]\s+"([A-Z]+)\s+([^ "]+)(?:\s+HTTP\/[\d.]+)?(?:")\s+(\d{3})\s+(\d+|-)(?:\s+"([^"]*)")?(?:\s+"([^"]*)")?/;

// Regex for Common Log Format (CLF) without referer / UA
const COMMON_LOG_REGEX = /^(\S+)\s+\S+\s+\S+\s+\[([^\]]+)\]\s+"([A-Z]+)\s+([^ "]+)(?:\s+HTTP\/[\d.]+)?(?:")\s+(\d{3})\s+(\d+|-)/;

export function parseRawLogs(rawText: string): ParseResult {
  if (!rawText || !rawText.trim()) {
    return createEmptyResult('None');
  }

  const lines = rawText.split(/\r?\n/).filter(line => line.trim().length > 0);
  if (lines.length === 0) {
    return createEmptyResult('None');
  }

  let formatDetected = 'Generic Access Log';
  const firstLine = lines[0].trim();

  // 1. Check if NDJSON or JSON array
  if (firstLine.startsWith('{') || firstLine.startsWith('[')) {
    formatDetected = 'Cloudflare / Caddy JSON Log';
    return parseJsonLogs(lines, formatDetected);
  }

  // 2. Check if CSV
  if (firstLine.includes(',') && (firstLine.toLowerCase().includes('agent') || firstLine.toLowerCase().includes('status') || firstLine.toLowerCase().includes('uri'))) {
    formatDetected = 'Cloudflare / Server CSV Log';
    return parseCsvLogs(lines, formatDetected);
  }

  // 3. Check if AWS CloudFront W3C format
  if (firstLine.startsWith('#Version') || firstLine.startsWith('#Fields')) {
    formatDetected = 'AWS CloudFront W3C Log';
    return parseCloudFrontLogs(lines, formatDetected);
  }

  // 4. Standard text lines (Nginx / Apache / combined)
  const entries: ParsedLogEntry[] = [];
  let lineIndex = 0;

  for (const line of lines) {
    if (line.startsWith('#') || line.trim().length === 0) continue;
    lineIndex++;

    const combinedMatch = line.match(COMBINED_LOG_REGEX);
    if (combinedMatch) {
      formatDetected = 'Nginx / Apache Combined';
      const [, ip, rawDate, method, url, statusStr, bytesStr, referer, userAgent] = combinedMatch;
      const statusCode = parseInt(statusStr, 10);
      const bytes = bytesStr === '-' ? 0 : parseInt(bytesStr, 10) || 0;
      const ua = userAgent || '';
      const bot = identifyBot(ua);
      const isAiBot = !!bot;
      const isError = statusCode >= 400;

      entries.push({
        id: `log-${lineIndex}`,
        ip,
        timestamp: parseDateString(rawDate),
        dateObj: new Date(parseDateString(rawDate)),
        method: method || 'GET',
        url: url || '/',
        path: cleanPath(url || '/'),
        statusCode,
        bytes,
        referer,
        userAgent: ua,
        isAiBot,
        bot: bot || undefined,
        isError,
        raw: line,
      });
      continue;
    }

    // Fallback regex attempt: finding IP, method, url, status, user agent
    const entry = parseFallbackLine(line, lineIndex);
    if (entry) {
      entries.push(entry);
    }
  }

  return aggregateLogResults(entries, formatDetected);
}

function parseJsonLogs(lines: string[], formatDetected: string): ParseResult {
  const entries: ParsedLogEntry[] = [];
  let lineIndex = 0;

  // Check if entire text is a JSON array
  const fullText = lines.join('\n').trim();
  if (fullText.startsWith('[') && fullText.endsWith(']')) {
    try {
      const arr = JSON.parse(fullText);
      if (Array.isArray(arr)) {
        for (const item of arr) {
          lineIndex++;
          const entry = normalizeJsonLogItem(item, lineIndex);
          if (entry) entries.push(entry);
        }
        return aggregateLogResults(entries, formatDetected);
      }
    } catch {
      // fallback to line-by-line
    }
  }

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed.startsWith('{')) continue;
    lineIndex++;
    try {
      const item = JSON.parse(trimmed);
      const entry = normalizeJsonLogItem(item, lineIndex);
      if (entry) entries.push(entry);
    } catch {
      // skip corrupted line
    }
  }

  return aggregateLogResults(entries, formatDetected);
}

function normalizeJsonLogItem(item: any, index: number): ParsedLogEntry | null {
  if (!item || typeof item !== 'object') return null;

  // Cloudflare Logpush fields: ClientIP, ClientRequestHost, ClientRequestMethod, ClientRequestURI, EdgeResponseStatus, ClientRequestUserAgent, EdgeStartTimestamp
  // Caddy fields: ts, request: { remote_ip, method, uri, headers: { "User-Agent": [...] } }, status, size
  // Generic JSON: ip, timestamp, method, url/path, status, userAgent, bytes
  const ip = item.ClientIP || item.ip || item.remote_addr || item.client_ip || item.request?.remote_ip || '127.0.0.1';
  const timestamp = item.EdgeStartTimestamp || item.timestamp || item.time || (item.ts ? new Date(item.ts * 1000).toISOString() : new Date().toISOString());
  const method = item.ClientRequestMethod || item.method || item.request?.method || 'GET';
  const url = item.ClientRequestURI || item.uri || item.url || item.path || item.request?.uri || '/';
  const statusCode = parseInt(item.EdgeResponseStatus || item.status || item.statusCode || 200, 10);
  const bytes = parseInt(item.EdgeResponseBytes || item.bytes || item.bytes_sent || item.size || 0, 10);
  
  let userAgent = item.ClientRequestUserAgent || item.userAgent || item.user_agent || '';
  if (!userAgent && item.request?.headers?.['User-Agent']) {
    const uaHeader = item.request.headers['User-Agent'];
    userAgent = Array.isArray(uaHeader) ? uaHeader[0] : uaHeader;
  }

  const bot = identifyBot(userAgent);
  const isAiBot = !!bot;
  const isError = statusCode >= 400;

  return {
    id: `json-${index}`,
    ip,
    timestamp: typeof timestamp === 'string' ? timestamp : new Date().toISOString(),
    dateObj: new Date(timestamp),
    method,
    url,
    path: cleanPath(url),
    statusCode,
    bytes,
    userAgent,
    isAiBot,
    bot: bot || undefined,
    isError,
  };
}

function parseCsvLogs(lines: string[], formatDetected: string): ParseResult {
  const entries: ParsedLogEntry[] = [];
  const headerLine = lines[0];
  const headers = headerLine.split(',').map(h => h.trim().replace(/^["']|["']$/g, '').toLowerCase());

  // Find column indexes
  const ipIdx = headers.findIndex(h => h.includes('clientip') || h === 'ip' || h.includes('remote_addr'));
  const timeIdx = headers.findIndex(h => h.includes('timestamp') || h.includes('time') || h.includes('date'));
  const methodIdx = headers.findIndex(h => h.includes('method'));
  const uriIdx = headers.findIndex(h => h.includes('uri') || h.includes('url') || h.includes('path'));
  const statusIdx = headers.findIndex(h => h.includes('status') || h.includes('code'));
  const uaIdx = headers.findIndex(h => h.includes('useragent') || h.includes('user_agent') || h.includes('agent'));
  const bytesIdx = headers.findIndex(h => h.includes('bytes') || h.includes('size'));

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    
    // Simple CSV splitter that respects quotes
    const cols = splitCsvRow(line);
    const ip = ipIdx >= 0 ? cols[ipIdx] || '127.0.0.1' : '127.0.0.1';
    const timestamp = timeIdx >= 0 ? cols[timeIdx] || new Date().toISOString() : new Date().toISOString();
    const method = methodIdx >= 0 ? cols[methodIdx] || 'GET' : 'GET';
    const url = uriIdx >= 0 ? cols[uriIdx] || '/' : '/';
    const statusCode = statusIdx >= 0 ? parseInt(cols[statusIdx], 10) || 200 : 200;
    const userAgent = uaIdx >= 0 ? cols[uaIdx] || '' : '';
    const bytes = bytesIdx >= 0 ? parseInt(cols[bytesIdx], 10) || 0 : 0;

    const bot = identifyBot(userAgent);
    entries.push({
      id: `csv-${i}`,
      ip,
      timestamp,
      dateObj: new Date(timestamp),
      method,
      url,
      path: cleanPath(url),
      statusCode,
      bytes,
      userAgent,
      isAiBot: !!bot,
      bot: bot || undefined,
      isError: statusCode >= 400,
    });
  }

  return aggregateLogResults(entries, formatDetected);
}

function parseCloudFrontLogs(lines: string[], formatDetected: string): ParseResult {
  const entries: ParsedLogEntry[] = [];
  let fields: string[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (line.startsWith('#Version:')) continue;
    if (line.startsWith('#Fields:')) {
      fields = line.replace('#Fields:', '').trim().split(/\s+/).map(f => f.toLowerCase());
      continue;
    }
    if (line.startsWith('#') || !line) continue;

    const parts = line.split(/\t+|\s+/);
    if (fields.length > 0 && parts.length >= 8) {
      const getVal = (name: string) => {
        const idx = fields.indexOf(name);
        return idx !== -1 ? parts[idx] : undefined;
      };

      const dateStr = getVal('date') || '';
      const timeStr = getVal('time') || '';
      const timestamp = dateStr && timeStr ? `${dateStr}T${timeStr}Z` : new Date().toISOString();
      const ip = getVal('c-ip') || '127.0.0.1';
      const method = getVal('cs-method') || 'GET';
      const stem = getVal('cs-uri-stem') || '/';
      const query = getVal('cs-uri-query') && getVal('cs-uri-query') !== '-' ? `?${getVal('cs-uri-query')}` : '';
      const url = stem + query;
      const statusCode = parseInt(getVal('sc-status') || '200', 10);
      const bytes = parseInt(getVal('sc-bytes') || '0', 10);
      const userAgent = decodeURIComponent(getVal('cs(user-agent)') || '');

      const bot = identifyBot(userAgent);
      entries.push({
        id: `cf-${i}`,
        ip,
        timestamp,
        dateObj: new Date(timestamp),
        method,
        url,
        path: cleanPath(url),
        statusCode,
        bytes,
        userAgent,
        isAiBot: !!bot,
        bot: bot || undefined,
        isError: statusCode >= 400,
      });
    }
  }

  return aggregateLogResults(entries, formatDetected);
}

function parseFallbackLine(line: string, index: number): ParsedLogEntry | null {
  // Try to find status code, method, and quotes
  const methodMatch = line.match(/\b(GET|POST|HEAD|PUT|DELETE|OPTIONS)\s+([^\s"]+)/);
  const statusMatch = line.match(/\s([1-5]\d{2})\s/);
  const ipMatch = line.match(/^(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}|[a-fA-F0-9:]+)/);

  if (!methodMatch && !statusMatch) return null;

  // Extract last quoted section for user agent
  const quotes = line.match(/"([^"]*)"/g);
  let userAgent = '';
  if (quotes && quotes.length >= 2) {
    userAgent = quotes[quotes.length - 1].replace(/"/g, '');
  }

  const statusCode = statusMatch ? parseInt(statusMatch[1], 10) : 200;
  const bot = identifyBot(userAgent);

  return {
    id: `fallback-${index}`,
    ip: ipMatch ? ipMatch[1] : '127.0.0.1',
    timestamp: new Date().toISOString(),
    dateObj: new Date(),
    method: methodMatch ? methodMatch[1] : 'GET',
    url: methodMatch ? methodMatch[2] : '/',
    path: cleanPath(methodMatch ? methodMatch[2] : '/'),
    statusCode,
    bytes: 0,
    userAgent,
    isAiBot: !!bot,
    bot: bot || undefined,
    isError: statusCode >= 400,
    raw: line,
  };
}

function splitCsvRow(row: string): string[] {
  const result: string[] = [];
  let current = '';
  let insideQuote = false;

  for (let i = 0; i < row.length; i++) {
    const char = row[i];
    if (char === '"' || char === "'") {
      insideQuote = !insideQuote;
    } else if (char === ',' && !insideQuote) {
      result.push(current.trim().replace(/^["']|["']$/g, ''));
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current.trim().replace(/^["']|["']$/g, ''));
  return result;
}

function parseDateString(rawDate: string): string {
  // e.g. "10/Oct/2026:13:55:36 +0000"
  try {
    const match = rawDate.match(/^(\d{2})\/([A-Za-z]{3})\/(\d{4}):(\d{2}):(\d{2}):(\d{2})/);
    if (match) {
      const [, day, monthStr, year, hour, min, sec] = match;
      const months: Record<string, string> = {
        Jan: '01', Feb: '02', Mar: '03', Apr: '04', May: '05', Jun: '06',
        Jul: '07', Aug: '08', Sep: '09', Oct: '10', Nov: '11', Dec: '12'
      };
      const month = months[monthStr] || '01';
      return `${year}-${month}-${day}T${hour}:${min}:${sec}Z`;
    }
    const d = new Date(rawDate);
    if (!isNaN(d.getTime())) {
      return d.toISOString();
    }
  } catch {
    // fallback
  }
  return new Date().toISOString();
}

function cleanPath(url: string): string {
  try {
    if (url.startsWith('http://') || url.startsWith('https://')) {
      const parsed = new URL(url);
      return parsed.pathname;
    }
    const qIndex = url.indexOf('?');
    return qIndex !== -1 ? url.slice(0, qIndex) : url;
  } catch {
    return url;
  }
}

function aggregateLogResults(entries: ParsedLogEntry[], formatDetected: string): ParseResult {
  const totalRequests = entries.length;
  let aiRequests = 0;
  let totalBytes = 0;
  let aiErrors = 0;

  const statusCodeBreakdown: Record<number, number> = {};
  const categoryBreakdown: Record<BotCategory, number> = {
    search: 0,
    training: 0,
    user_action: 0,
    seo_crawler: 0,
    aggregator: 0,
  };
  const vendorBreakdown: Record<string, number> = {};

  const botMap = new Map<string, {
    bot: any;
    total: number;
    statuses: Record<number, number>;
    urls: Set<string>;
    bytes: number;
    sampleUA: string;
    firstSeen: string;
    lastSeen: string;
    errors: number;
  }>();

  const urlMap = new Map<string, {
    path: string;
    totalHits: number;
    aiHits: number;
    uniqueBots: Set<string>;
    statuses: Record<number, number>;
    bytesTotal: number;
    lastCrawled: string;
    hasErrors: boolean;
  }>();

  // Heatmap: 7 days x 24 hours
  const heatmapCounts: number[][] = Array(7).fill(0).map(() => Array(24).fill(0));

  let earliestTime = '';
  let latestTime = '';

  for (const entry of entries) {
    totalBytes += entry.bytes;
    statusCodeBreakdown[entry.statusCode] = (statusCodeBreakdown[entry.statusCode] || 0) + 1;

    // Track timestamps
    if (!earliestTime || entry.timestamp < earliestTime) earliestTime = entry.timestamp;
    if (!latestTime || entry.timestamp > latestTime) latestTime = entry.timestamp;

    // Track path stats
    let urlData = urlMap.get(entry.path);
    if (!urlData) {
      urlData = {
        path: entry.path,
        totalHits: 0,
        aiHits: 0,
        uniqueBots: new Set(),
        statuses: {},
        bytesTotal: 0,
        lastCrawled: entry.timestamp,
        hasErrors: false,
      };
      urlMap.set(entry.path, urlData);
    }
    urlData.totalHits++;
    urlData.statuses[entry.statusCode] = (urlData.statuses[entry.statusCode] || 0) + 1;
    urlData.bytesTotal += entry.bytes;
    if (entry.statusCode >= 400) urlData.hasErrors = true;
    if (entry.timestamp > urlData.lastCrawled) urlData.lastCrawled = entry.timestamp;

    // If AI Bot
    if (entry.isAiBot && entry.bot) {
      aiRequests++;
      if (entry.isError) aiErrors++;

      urlData.aiHits++;
      urlData.uniqueBots.add(entry.bot.name);

      categoryBreakdown[entry.bot.category] = (categoryBreakdown[entry.bot.category] || 0) + 1;
      vendorBreakdown[entry.bot.vendor] = (vendorBreakdown[entry.bot.vendor] || 0) + 1;

      // Bot stat aggregator
      let bData = botMap.get(entry.bot.id);
      if (!bData) {
        bData = {
          bot: entry.bot,
          total: 0,
          statuses: {},
          urls: new Set(),
          bytes: 0,
          sampleUA: entry.userAgent,
          firstSeen: entry.timestamp,
          lastSeen: entry.timestamp,
          errors: 0,
        };
        botMap.set(entry.bot.id, bData);
      }
      bData.total++;
      bData.statuses[entry.statusCode] = (bData.statuses[entry.statusCode] || 0) + 1;
      bData.urls.add(entry.path);
      bData.bytes += entry.bytes;
      if (entry.isError) bData.errors++;
      if (entry.timestamp < bData.firstSeen) bData.firstSeen = entry.timestamp;
      if (entry.timestamp > bData.lastSeen) bData.lastSeen = entry.timestamp;

      // Heatmap accumulation
      if (entry.dateObj && !isNaN(entry.dateObj.getTime())) {
        const day = entry.dateObj.getDay();
        const hour = entry.dateObj.getHours();
        heatmapCounts[day][hour]++;
      }
    }
  }

  const aiPercentage = totalRequests > 0 ? Number(((aiRequests / totalRequests) * 100).toFixed(1)) : 0;
  const aiErrorRate = aiRequests > 0 ? Number(((aiErrors / aiRequests) * 100).toFixed(1)) : 0;

  // Transform botStats
  const botStats: BotStat[] = Array.from(botMap.values()).map(b => ({
    botId: b.bot.id,
    name: b.bot.name,
    vendor: b.bot.vendor,
    category: b.bot.category,
    totalRequests: b.total,
    percentageOfAi: aiRequests > 0 ? Number(((b.total / aiRequests) * 100).toFixed(1)) : 0,
    statusCodes: b.statuses,
    urlsCount: b.urls.size,
    bytesTotal: b.bytes,
    firstSeen: b.firstSeen,
    lastSeen: b.lastSeen,
    sampleUserAgent: b.sampleUA,
    errorCount: b.errors,
    errorRate: b.total > 0 ? Number(((b.errors / b.total) * 100).toFixed(1)) : 0,
    recommendedAction: b.bot.recommendedAction,
  })).sort((a, b) => b.totalRequests - a.totalRequests);

  // Transform urlStats
  const urlStats: UrlStat[] = Array.from(urlMap.values()).map(u => ({
    path: u.path,
    totalHits: u.totalHits,
    aiHits: u.aiHits,
    uniqueBots: Array.from(u.uniqueBots),
    statusCodes: u.statuses,
    avgBytes: u.totalHits > 0 ? Math.round(u.bytesTotal / u.totalHits) : 0,
    lastCrawled: u.lastCrawled,
    hasErrors: u.hasErrors,
  })).sort((a, b) => b.aiHits - a.aiHits);

  // Compile issues
  const issues = detectCrawlIssues(entries, botStats, urlStats);

  // Compile heatmap cells
  const heatmap: HeatmapCell[] = [];
  for (let d = 0; d < 7; d++) {
    for (let h = 0; h < 24; h++) {
      heatmap.push({
        day: d,
        hour: h,
        count: heatmapCounts[d][h],
      });
    }
  }

  const summary: LogSummary = {
    totalRequests,
    aiRequests,
    nonAiRequests: totalRequests - aiRequests,
    aiPercentage,
    uniqueBotsCount: botStats.length,
    uniqueUrlsCrawled: urlStats.filter(u => u.aiHits > 0).length,
    aiErrorRate,
    totalBytes,
    dateRange: {
      start: earliestTime,
      end: latestTime,
    },
    statusCodeBreakdown,
    categoryBreakdown,
    vendorBreakdown,
  };

  return {
    entries,
    summary,
    botStats,
    urlStats,
    issues,
    heatmap,
    formatDetected,
  };
}

function detectCrawlIssues(entries: ParsedLogEntry[], botStats: BotStat[], urlStats: UrlStat[]): CrawlIssue[] {
  const issues: CrawlIssue[] = [];

  // 1. Check for 429 Rate Limiting on AI bots
  const rateLimitedBots = botStats.filter(b => (b.statusCodes[429] || 0) > 0);
  for (const b of rateLimitedBots) {
    const count = b.statusCodes[429];
    issues.push({
      id: `issue-429-${b.botId}`,
      severity: 'critical',
      title: `429 Too Many Requests Throttling ${b.name}`,
      description: `${b.name} was throttled ${count} times with HTTP 429 status. Aggressive rate limiting causes AI search engines to demote crawl frequency and drop citation depth.`,
      affectedBot: b.name,
      count,
      statusCode: 429,
      recommendation: `Whitelisting ${b.name} IP ranges or raising rate limit tiers for AI search agents in Cloudflare/Nginx.`,
    });
  }

  // 2. Check for 403 Forbidden blocks on AI search engines
  const forbiddenSearchBots = botStats.filter(b => b.category === 'search' && (b.statusCodes[403] || 0) > 0);
  for (const b of forbiddenSearchBots) {
    const count = b.statusCodes[403];
    issues.push({
      id: `issue-403-${b.botId}`,
      severity: 'critical',
      title: `403 Forbidden Blocking AI Search Bot ${b.name}`,
      description: `${b.name} encountered 403 Forbidden errors on ${count} requests. Because this is a high-impact AI search crawler, your site is actively invisible to user answers in this AI engine.`,
      affectedBot: b.name,
      count,
      statusCode: 403,
      recommendation: `Check your WAF rules, Cloudflare Bot Fight Mode, and robots.txt directives to allow ${b.name}.`,
    });
  }

  // 3. High 404 Not Found Dead Ends
  const error404Urls = urlStats.filter(u => (u.statusCodes[404] || 0) > 0 && u.aiHits > 0);
  if (error404Urls.length > 0) {
    const total404s = error404Urls.reduce((acc, u) => acc + (u.statusCodes[404] || 0), 0);
    issues.push({
      id: 'issue-404-urls',
      severity: 'warning',
      title: `404 Dead Ends Crawled by AI Bots (${error404Urls.length} URLs)`,
      description: `AI crawlers attempted to access ${error404Urls.length} broken URLs generating ${total404s} 404 responses. This wastes crawl budget and causes hallucinations or citation drops.`,
      count: total404s,
      statusCode: 404,
      exampleUrl: error404Urls[0].path,
      recommendation: `Implement 301 redirects from obsolete paths to relevant active pages or clean up broken internal links in your sitemap.`,
    });
  }

  // 4. Server 5xx Errors
  const serverErrors = entries.filter(e => e.isAiBot && e.statusCode >= 500);
  if (serverErrors.length > 0) {
    issues.push({
      id: 'issue-500-errors',
      severity: 'critical',
      title: `Server 5xx Errors Encountered During AI Crawls`,
      description: `Detected ${serverErrors.length} server-side failure responses (500, 502, 503, 504) when AI bots requested content. Prolonged 5xx errors signal infrastructure instability to search engines.`,
      count: serverErrors.length,
      statusCode: 500,
      exampleUrl: serverErrors[0].path,
      recommendation: `Inspect server load spikes, upstream gateway timeouts, or memory exhaustion when AI bots trigger intensive SSR or dynamic routes.`,
    });
  }

  // 5. Query Parameter & Crawl Budget Bloat
  const parameterUrls = urlStats.filter(u => u.path.includes('?') && u.aiHits > 5);
  if (parameterUrls.length > 3) {
    const totalParamHits = parameterUrls.reduce((acc, u) => acc + u.aiHits, 0);
    issues.push({
      id: 'issue-param-bloat',
      severity: 'info',
      title: `Crawl Budget Waste on Query Parameter URLs`,
      description: `AI bots are crawling ${parameterUrls.length} parameter-heavy URLs (e.g. ?utm_, ?sort=, session tokens), totaling ${totalParamHits} requests.`,
      count: totalParamHits,
      exampleUrl: parameterUrls[0].path,
      recommendation: `Use canonical tags pointing to root URLs and add Disallow rules for tracking parameters in robots.txt.`,
    });
  }

  // 6. Excessive Training Bot Scraping Bandwidth
  const aggressiveScrapers = botStats.filter(b => b.category === 'training' && b.percentageOfAi > 40);
  for (const b of aggressiveScrapers) {
    issues.push({
      id: `issue-heavy-${b.botId}`,
      severity: 'info',
      title: `Dominant Training Crawler Bandwidth: ${b.name}`,
      description: `${b.name} represents ${b.percentageOfAi}% of all AI crawler requests. If this bot does not provide referral value, it may be consuming disproportionate server resources.`,
      affectedBot: b.name,
      count: b.totalRequests,
      recommendation: `Consider rate-limiting or disallowing ${b.name} in robots.txt if your bandwidth or origin capacity is constrained.`,
    });
  }

  return issues;
}

function createEmptyResult(formatDetected: string): ParseResult {
  return {
    entries: [],
    summary: {
      totalRequests: 0,
      aiRequests: 0,
      nonAiRequests: 0,
      aiPercentage: 0,
      uniqueBotsCount: 0,
      uniqueUrlsCrawled: 0,
      aiErrorRate: 0,
      totalBytes: 0,
      dateRange: { start: '', end: '' },
      statusCodeBreakdown: {},
      categoryBreakdown: { search: 0, training: 0, user_action: 0, seo_crawler: 0, aggregator: 0 },
      vendorBreakdown: {},
    },
    botStats: [],
    urlStats: [],
    issues: [],
    heatmap: [],
    formatDetected,
  };
}
