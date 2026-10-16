export type BotCategory = 'search' | 'training' | 'user_action' | 'seo_crawler' | 'aggregator';

export type GeoImpact = 'critical' | 'high' | 'medium' | 'low';

export interface BotDefinition {
  id: string;
  name: string;
  vendor: string;
  category: BotCategory;
  description: string;
  patterns: (string | RegExp)[];
  geoImpact: GeoImpact;
  recommendedAction: 'allow' | 'monitor' | 'optional_block' | 'block';
  robotsTxtSnippet: string;
  documentationUrl?: string;
}

export interface ParsedLogEntry {
  id: string;
  ip: string;
  timestamp: string; // ISO or date string
  dateObj?: Date;
  method: string;
  url: string;
  path: string;
  statusCode: number;
  bytes: number;
  referer?: string;
  userAgent: string;
  isAiBot: boolean;
  bot?: BotDefinition;
  isError: boolean;
  raw?: string;
}

export interface BotStat {
  botId: string;
  name: string;
  vendor: string;
  category: BotCategory;
  totalRequests: number;
  percentageOfAi: number;
  statusCodes: Record<number, number>;
  urlsCount: number;
  bytesTotal: number;
  firstSeen: string;
  lastSeen: string;
  sampleUserAgent: string;
  errorCount: number;
  errorRate: number;
  recommendedAction: 'allow' | 'monitor' | 'optional_block' | 'block';
}

export interface UrlStat {
  path: string;
  totalHits: number;
  aiHits: number;
  uniqueBots: string[];
  statusCodes: Record<number, number>;
  avgBytes: number;
  lastCrawled: string;
  hasErrors: boolean;
}

export interface CrawlIssue {
  id: string;
  severity: 'critical' | 'warning' | 'info';
  title: string;
  description: string;
  affectedBot?: string;
  count: number;
  recommendation: string;
  exampleUrl?: string;
  statusCode?: number;
}

export interface GeoScoreBreakdown {
  totalScore: number; // 0-100
  grade: 'A+' | 'A' | 'B' | 'C' | 'D' | 'F';
  searchBotAccessScore: number; // /30
  botDiversityScore: number; // /25
  crawlSuccessScore: number; // /25
  crawlVolumeDepthScore: number; // /10
  crawlEfficiencyScore: number; // /10
  statusMessage: string;
  strengths: string[];
  weaknesses: string[];
}

export interface LogSummary {
  totalRequests: number;
  aiRequests: number;
  nonAiRequests: number;
  aiPercentage: number;
  uniqueBotsCount: number;
  uniqueUrlsCrawled: number;
  aiErrorRate: number;
  totalBytes: number;
  dateRange: {
    start: string;
    end: string;
  };
  statusCodeBreakdown: Record<number, number>;
  categoryBreakdown: Record<BotCategory, number>;
  vendorBreakdown: Record<string, number>;
}

export interface HeatmapCell {
  day: number; // 0 (Sun) - 6 (Sat)
  hour: number; // 0 - 23
  count: number;
}
