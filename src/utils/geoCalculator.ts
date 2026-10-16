import { BotStat, GeoScoreBreakdown, LogSummary } from '../types/analyzer';

export function calculateGeoScore(summary: LogSummary, botStats: BotStat[]): GeoScoreBreakdown {
  if (summary.totalRequests === 0 || summary.aiRequests === 0) {
    return {
      totalScore: 0,
      grade: 'F',
      searchBotAccessScore: 0,
      botDiversityScore: 0,
      crawlSuccessScore: 0,
      crawlVolumeDepthScore: 0,
      crawlEfficiencyScore: 0,
      statusMessage: 'No AI bot activity detected in the submitted log data.',
      strengths: [],
      weaknesses: ['No AI crawler logs detected to evaluate.'],
    };
  }

  const strengths: string[] = [];
  const weaknesses: string[] = [];

  // --- 1. AI Search Engine Ingestion (Max 30 pts) ---
  // High-value search engines: OAI-SearchBot, PerplexityBot, Claude-Web, Google-Extended / GoogleOther, Applebot, Bingbot
  const criticalSearchBotIds = ['oai-searchbot', 'perplexitybot', 'claude-web', 'google-extended', 'applebot', 'bingbot-copilot'];
  const activeCriticalBots = botStats.filter(b => criticalSearchBotIds.includes(b.botId));
  
  let searchBotAccessScore = 0;
  if (activeCriticalBots.length > 0) {
    const ratio = Math.min(activeCriticalBots.length / 3, 1);
    searchBotAccessScore = Math.round(ratio * 24); // up to 24 base

    // Check errors on critical search bots
    const searchBotErrors = activeCriticalBots.reduce((sum, b) => {
      const throttles = (b.statusCodes[429] || 0) + (b.statusCodes[403] || 0) + (b.statusCodes[500] || 0);
      return sum + throttles;
    }, 0);

    if (searchBotErrors === 0) {
      searchBotAccessScore += 6; // perfect bonus
      strengths.push('Key AI search crawlers (ChatGPT Search, Perplexity, Claude-Web) crawl with clean HTTP 200 responses.');
    } else {
      const penalty = Math.min(Math.round((searchBotErrors / Math.max(activeCriticalBots.reduce((s, b) => s + b.totalRequests, 0), 1)) * 15), 12);
      searchBotAccessScore = Math.max(searchBotAccessScore - penalty, 4);
      weaknesses.push(`Encountered ${searchBotErrors} access errors or throttling events on key AI search engines.`);
    }
  } else {
    searchBotAccessScore = 5;
    weaknesses.push('No direct AI search engines (OAI-SearchBot, PerplexityBot, Claude-Web) detected in logs.');
  }

  // --- 2. Bot Diversity (Max 25 pts) ---
  // Breadth across vendors: OpenAI, Anthropic, Perplexity, Google, Meta, Mistral, xAI, etc.
  const uniqueVendors = Object.keys(summary.vendorBreakdown).length;
  let botDiversityScore = 0;
  if (uniqueVendors >= 5) {
    botDiversityScore = 25;
    strengths.push(`Exceptional AI vendor diversity (${uniqueVendors} independent AI providers crawling).`);
  } else if (uniqueVendors >= 3) {
    botDiversityScore = 20;
    strengths.push(`Good multi-vendor AI representation across ${uniqueVendors} AI ecosystems.`);
  } else if (uniqueVendors >= 1) {
    botDiversityScore = 12;
    weaknesses.push(`Limited crawler diversity (${uniqueVendors} vendor). Expand reach to more AI models.`);
  }

  // --- 3. Crawl Success Rate (Max 25 pts) ---
  // Based on AI error rate (100 - errorRate)
  let crawlSuccessScore = 0;
  const successRate = 100 - summary.aiErrorRate;
  if (successRate >= 98) {
    crawlSuccessScore = 25;
    strengths.push(`High crawl reliability: ${successRate.toFixed(1)}% of AI requests served successfully.`);
  } else if (successRate >= 90) {
    crawlSuccessScore = 20;
  } else if (successRate >= 80) {
    crawlSuccessScore = 14;
    weaknesses.push(`Elevated AI crawler error rate of ${summary.aiErrorRate}% degrades citation rank.`);
  } else {
    crawlSuccessScore = 6;
    weaknesses.push(`Severe crawl failure rate (${summary.aiErrorRate}%). Bots are experiencing frequent blocks or server errors.`);
  }

  // --- 4. Crawl Volume & Content Depth (Max 10 pts) ---
  let crawlVolumeDepthScore = 0;
  if (summary.uniqueUrlsCrawled >= 50) {
    crawlVolumeDepthScore = 10;
    strengths.push(`Comprehensive content exploration (${summary.uniqueUrlsCrawled} unique URLs crawled by AI).`);
  } else if (summary.uniqueUrlsCrawled >= 15) {
    crawlVolumeDepthScore = 8;
  } else if (summary.uniqueUrlsCrawled >= 5) {
    crawlVolumeDepthScore = 6;
  } else {
    crawlVolumeDepthScore = 4;
    weaknesses.push('AI crawlers are only visiting a shallow subset of site URLs.');
  }

  // --- 5. Crawl Efficiency & Hygiene (Max 10 pts) ---
  let crawlEfficiencyScore = 10;
  const rateLimitTotal = Object.values(botStats).reduce((acc, b) => acc + (b.statusCodes[429] || 0), 0);
  const forbiddenTotal = Object.values(botStats).reduce((acc, b) => acc + (b.statusCodes[403] || 0), 0);
  
  if (rateLimitTotal > 0) {
    crawlEfficiencyScore -= 4;
    weaknesses.push(`HTTP 429 rate limit triggers detected (${rateLimitTotal} times). AI bots back off when throttled.`);
  }
  if (forbiddenTotal > 10) {
    crawlEfficiencyScore -= 3;
  }
  crawlEfficiencyScore = Math.max(crawlEfficiencyScore, 2);

  // Total
  const totalScore = Math.min(
    Math.max(
      searchBotAccessScore + botDiversityScore + crawlSuccessScore + crawlVolumeDepthScore + crawlEfficiencyScore,
      0
    ),
    100
  );

  // Grade Assignment
  let grade: 'A+' | 'A' | 'B' | 'C' | 'D' | 'F' = 'F';
  let statusMessage = '';

  if (totalScore >= 90) {
    grade = 'A+';
    statusMessage = 'Outstanding AI Visibility & GEO Health. Your site is ideally indexed for AI search engines, citations, and LLM answers.';
  } else if (totalScore >= 80) {
    grade = 'A';
    statusMessage = 'Strong Generative Engine Optimization. High bot diversity and healthy crawl completion with minor room for optimization.';
  } else if (totalScore >= 70) {
    grade = 'B';
    statusMessage = 'Good GEO Baseline. AI bots are crawling actively, but some crawl gaps or error status codes need attention.';
  } else if (totalScore >= 60) {
    grade = 'C';
    statusMessage = 'Moderate AI Visibility. Key AI search engines or training bots are facing rate limits, 403 blocks, or dead ends.';
  } else if (totalScore >= 50) {
    grade = 'D';
    statusMessage = 'Suboptimal AI Indexation. Substantial crawl errors or missing key answer engine bots. Immediate fixes recommended.';
  } else {
    grade = 'F';
    statusMessage = 'Critical AI Invisibility. Severe crawl failures or complete blockages preventing modern AI platforms from indexing your content.';
  }

  return {
    totalScore,
    grade,
    searchBotAccessScore,
    botDiversityScore,
    crawlSuccessScore,
    crawlVolumeDepthScore,
    crawlEfficiencyScore,
    statusMessage,
    strengths,
    weaknesses,
  };
}
