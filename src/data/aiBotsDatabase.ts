import { BotDefinition } from '../types/analyzer';

export const AI_BOTS_DATABASE: BotDefinition[] = [
  // --- 1. OpenAI Bots ---
  {
    id: 'gptbot',
    name: 'GPTBot',
    vendor: 'OpenAI',
    category: 'training',
    description: 'OpenAI official crawler used to train foundational GPT models (GPT-4, GPT-5).',
    patterns: [/GPTBot\/\d+/i, /GPTBot/i],
    geoImpact: 'high',
    recommendedAction: 'allow',
    robotsTxtSnippet: 'User-agent: GPTBot\nAllow: /',
    documentationUrl: 'https://platform.openai.com/docs/gptbot',
  },
  {
    id: 'oai-searchbot',
    name: 'OAI-SearchBot',
    vendor: 'OpenAI',
    category: 'search',
    description: 'OpenAI search crawler that powers ChatGPT Search indexation and live citation links.',
    patterns: [/OAI-SearchBot\/\d+/i, /OAI-SearchBot/i],
    geoImpact: 'critical',
    recommendedAction: 'allow',
    robotsTxtSnippet: 'User-agent: OAI-SearchBot\nAllow: /',
    documentationUrl: 'https://platform.openai.com/docs/bots',
  },
  {
    id: 'chatgpt-user',
    name: 'ChatGPT-User',
    vendor: 'OpenAI',
    category: 'user_action',
    description: 'Real-time on-demand fetcher triggered when a ChatGPT user asks to visit or analyze a specific URL.',
    patterns: [/ChatGPT-User\/\d+/i, /ChatGPT-User/i],
    geoImpact: 'critical',
    recommendedAction: 'allow',
    robotsTxtSnippet: 'User-agent: ChatGPT-User\nAllow: /',
    documentationUrl: 'https://platform.openai.com/docs/bots',
  },

  // --- 2. Anthropic Bots ---
  {
    id: 'claudebot',
    name: 'ClaudeBot',
    vendor: 'Anthropic',
    category: 'training',
    description: 'Anthropic automated crawler used to gather public web text to train Claude AI models.',
    patterns: [/ClaudeBot\/\d+/i, /ClaudeBot/i, /Claude-Web\/\d+/i],
    geoImpact: 'high',
    recommendedAction: 'allow',
    robotsTxtSnippet: 'User-agent: ClaudeBot\nAllow: /',
    documentationUrl: 'https://darkvisitors.com/agents/claudebot',
  },
  {
    id: 'claude-web',
    name: 'Claude-Web',
    vendor: 'Anthropic',
    category: 'search',
    description: 'Anthropic real-time crawler used for Claude search grounding and web browsing capabilities.',
    patterns: [/Claude-Web/i],
    geoImpact: 'critical',
    recommendedAction: 'allow',
    robotsTxtSnippet: 'User-agent: Claude-Web\nAllow: /',
  },
  {
    id: 'claude-user',
    name: 'Claude-User',
    vendor: 'Anthropic',
    category: 'user_action',
    description: 'User-initiated fetcher when Claude users submit links to read and summarize.',
    patterns: [/Claude-User/i, /anthropic-ai/i],
    geoImpact: 'critical',
    recommendedAction: 'allow',
    robotsTxtSnippet: 'User-agent: Claude-User\nAllow: /',
  },

  // --- 3. Perplexity AI ---
  {
    id: 'perplexitybot',
    name: 'PerplexityBot',
    vendor: 'Perplexity',
    category: 'search',
    description: 'Perplexity AI search engine crawler that indexes pages to deliver direct source citations in answers.',
    patterns: [/PerplexityBot\/\d+/i, /PerplexityBot/i],
    geoImpact: 'critical',
    recommendedAction: 'allow',
    robotsTxtSnippet: 'User-agent: PerplexityBot\nAllow: /',
    documentationUrl: 'https://docs.perplexity.ai/docs/perplexitybot',
  },
  {
    id: 'perplexity-user',
    name: 'Perplexity-User',
    vendor: 'Perplexity',
    category: 'user_action',
    description: 'Perplexity live query browser responding directly to interactive user search queries.',
    patterns: [/Perplexity-User/i],
    geoImpact: 'critical',
    recommendedAction: 'allow',
    robotsTxtSnippet: 'User-agent: Perplexity-User\nAllow: /',
  },

  // --- 4. Google Gemini & AI Overviews ---
  {
    id: 'google-extended',
    name: 'Google-Extended',
    vendor: 'Google',
    category: 'training',
    description: 'Google standalone product token used to control whether site data trains Gemini and Vertex AI.',
    patterns: [/Google-Extended/i],
    geoImpact: 'high',
    recommendedAction: 'allow',
    robotsTxtSnippet: 'User-agent: Google-Extended\nAllow: /',
  },
  {
    id: 'google-other',
    name: 'GoogleOther',
    vendor: 'Google',
    category: 'search',
    description: 'Google auxiliary crawler used for internal AI research, R&D, and bulk indexing.',
    patterns: [/GoogleOther\/\d+/i, /GoogleOther/i],
    geoImpact: 'high',
    recommendedAction: 'allow',
    robotsTxtSnippet: 'User-agent: GoogleOther\nAllow: /',
  },
  {
    id: 'google-read-aloud',
    name: 'Google-Read-Aloud',
    vendor: 'Google',
    category: 'user_action',
    description: 'Google speech and voice assistant agent reading pages aloud for mobile and audio queries.',
    patterns: [/Google-Read-Aloud/i],
    geoImpact: 'medium',
    recommendedAction: 'allow',
    robotsTxtSnippet: 'User-agent: Google-Read-Aloud\nAllow: /',
  },

  // --- 5. xAI / Grok ---
  {
    id: 'grokbot',
    name: 'GrokBot',
    vendor: 'xAI',
    category: 'training',
    description: 'xAI proprietary crawler used to train Grok models and ingest real-time web knowledge.',
    patterns: [/GrokBot/i, /xAI-Crawler/i, /Grok\/\d+/i],
    geoImpact: 'high',
    recommendedAction: 'allow',
    robotsTxtSnippet: 'User-agent: GrokBot\nAllow: /',
  },

  // --- 6. DeepSeek ---
  {
    id: 'deepseekbot',
    name: 'DeepSeekBot',
    vendor: 'DeepSeek',
    category: 'training',
    description: 'DeepSeek AI crawler used to gather training data for DeepSeek-V3, R1, and code models.',
    patterns: [/DeepSeekBot/i, /DeepSeek-Crawler/i, /DeepSeek/i],
    geoImpact: 'high',
    recommendedAction: 'allow',
    robotsTxtSnippet: 'User-agent: DeepSeekBot\nAllow: /',
  },

  // --- 7. ByteDance / Doubao ---
  {
    id: 'bytespider',
    name: 'Bytespider',
    vendor: 'ByteDance',
    category: 'training',
    description: 'ByteDance AI crawler used for TikTok search and Doubao generative AI model training.',
    patterns: [/Bytespider/i],
    geoImpact: 'medium',
    recommendedAction: 'monitor',
    robotsTxtSnippet: 'User-agent: Bytespider\nAllow: /',
  },

  // --- 8. Meta AI / Llama ---
  {
    id: 'meta-externalagent',
    name: 'Meta-ExternalAgent',
    vendor: 'Meta',
    category: 'training',
    description: 'Meta AI web crawler used to discover and train Llama foundation models.',
    patterns: [/Meta-ExternalAgent/i, /Meta-ExternalFetcher/i],
    geoImpact: 'high',
    recommendedAction: 'allow',
    robotsTxtSnippet: 'User-agent: Meta-ExternalAgent\nAllow: /',
  },
  {
    id: 'facebookbot',
    name: 'FacebookBot',
    vendor: 'Meta',
    category: 'search',
    description: 'Meta indexing crawler used for Meta AI search integrations across WhatsApp, Instagram, and web.',
    patterns: [/FacebookBot\/\d+/i, /facebookexternalhit\/\d+/i],
    geoImpact: 'high',
    recommendedAction: 'allow',
    robotsTxtSnippet: 'User-agent: FacebookBot\nAllow: /',
  },

  // --- 9. Apple Intelligence ---
  {
    id: 'applebot-extended',
    name: 'Applebot-Extended',
    vendor: 'Apple',
    category: 'training',
    description: 'Apple token used to train Apple Intelligence models powering Siri, Safari, and iOS tools.',
    patterns: [/Applebot-Extended/i],
    geoImpact: 'high',
    recommendedAction: 'allow',
    robotsTxtSnippet: 'User-agent: Applebot-Extended\nAllow: /',
  },
  {
    id: 'applebot',
    name: 'Applebot',
    vendor: 'Apple',
    category: 'search',
    description: 'Apple search engine crawler powering Siri Suggestions, Spotlight, and Safari search.',
    patterns: [/Applebot\/\d+/i, /Applebot/i],
    geoImpact: 'critical',
    recommendedAction: 'allow',
    robotsTxtSnippet: 'User-agent: Applebot\nAllow: /',
  },

  // --- 10. Common Crawl Foundation Corpus ---
  {
    id: 'ccbot',
    name: 'CCBot',
    vendor: 'Common Crawl',
    category: 'training',
    description: 'Open web foundation crawler whose datasets form the bedrock for most open-source LLMs (Llama, Mistral, Qwen).',
    patterns: [/CCBot\/\d+/i, /CCBot/i],
    geoImpact: 'high',
    recommendedAction: 'allow',
    robotsTxtSnippet: 'User-agent: CCBot\nAllow: /',
  },

  // --- 11. Mistral AI ---
  {
    id: 'mistral-crawler',
    name: 'MistralAI-Crawler',
    vendor: 'Mistral AI',
    category: 'training',
    description: 'Mistral AI crawler used for training Le Chat, Pixtral, and Mistral Large models.',
    patterns: [/MistralAI-Crawler/i, /MistralBot/i],
    geoImpact: 'high',
    recommendedAction: 'allow',
    robotsTxtSnippet: 'User-agent: MistralAI-Crawler\nAllow: /',
  },

  // --- 12. Cohere ---
  {
    id: 'cohere-crawler',
    name: 'Cohere-training-crawler',
    vendor: 'Cohere',
    category: 'training',
    description: 'Cohere crawler gathering enterprise multilingual corpora for Command-R and Embed models.',
    patterns: [/cohere-ai/i, /cohere-training-crawler/i, /CohereBot/i],
    geoImpact: 'high',
    recommendedAction: 'allow',
    robotsTxtSnippet: 'User-agent: cohere-ai\nAllow: /',
  },

  // --- 13. Amazon Bedrock / Titan ---
  {
    id: 'amazonbot',
    name: 'Amazonbot',
    vendor: 'Amazon',
    category: 'search',
    description: 'Amazon AI crawler indexing web content for Alexa answers and Amazon Bedrock knowledge bases.',
    patterns: [/Amazonbot\/\d+/i, /Amazonbot/i],
    geoImpact: 'high',
    recommendedAction: 'allow',
    robotsTxtSnippet: 'User-agent: Amazonbot\nAllow: /',
  },

  // --- 14. Microsoft Copilot & Bing AI ---
  {
    id: 'bingbot-copilot',
    name: 'Bingbot (Copilot)',
    vendor: 'Microsoft',
    category: 'search',
    description: 'Microsoft crawler feeding both Bing search results and Microsoft Copilot AI citations.',
    patterns: [/bingbot\/\d+/i, /BingPreview/i, /Microsoft-Bing-Bot/i],
    geoImpact: 'critical',
    recommendedAction: 'allow',
    robotsTxtSnippet: 'User-agent: bingbot\nAllow: /',
  },

  // --- 15. You.com ---
  {
    id: 'youbot',
    name: 'YouBot',
    vendor: 'You.com',
    category: 'search',
    description: 'You.com AI search engine crawler used to index and cite authoritative web answers.',
    patterns: [/YouBot\/\d+/i, /YouBot/i],
    geoImpact: 'medium',
    recommendedAction: 'allow',
    robotsTxtSnippet: 'User-agent: YouBot\nAllow: /',
  },

  // --- 16. Kagi AI ---
  {
    id: 'kagibot',
    name: 'KagiBot',
    vendor: 'Kagi',
    category: 'search',
    description: 'Kagi search & AI assistant crawler indexing high-quality web documentation and articles.',
    patterns: [/KagiBot/i],
    geoImpact: 'medium',
    recommendedAction: 'allow',
    robotsTxtSnippet: 'User-agent: KagiBot\nAllow: /',
  },

  // --- 17. Exa (Metaphor) Neural Search ---
  {
    id: 'exabot',
    name: 'ExaBot',
    vendor: 'Exa AI',
    category: 'search',
    description: 'Embeddings-based neural search engine crawler used by AI agents to retrieve semantic content.',
    patterns: [/ExaBot/i, /MetaphorBot/i],
    geoImpact: 'medium',
    recommendedAction: 'allow',
    robotsTxtSnippet: 'User-agent: ExaBot\nAllow: /',
  },

  // --- 18. Phind AI Search ---
  {
    id: 'phindbot',
    name: 'PhindBot',
    vendor: 'Phind',
    category: 'search',
    description: 'AI search engine specialized in developer questions, software engineering, and code documentation.',
    patterns: [/PhindBot/i],
    geoImpact: 'medium',
    recommendedAction: 'allow',
    robotsTxtSnippet: 'User-agent: PhindBot\nAllow: /',
  },

  // --- 19. Tavily AI Search ---
  {
    id: 'tavilybot',
    name: 'TavilyBot',
    vendor: 'Tavily',
    category: 'search',
    description: 'Search API built specifically for LLMs and autonomous agents to retrieve real-time facts.',
    patterns: [/TavilyBot/i, /Tavily/i],
    geoImpact: 'medium',
    recommendedAction: 'allow',
    robotsTxtSnippet: 'User-agent: TavilyBot\nAllow: /',
  },

  // --- 20. Brave AI Search ---
  {
    id: 'bravebot',
    name: 'BraveBot',
    vendor: 'Brave Software',
    category: 'search',
    description: 'Brave Search independent web index crawler powering Brave Leo AI answers.',
    patterns: [/Bravebot/i, /Brave-Web-Crawler/i],
    geoImpact: 'high',
    recommendedAction: 'allow',
    robotsTxtSnippet: 'User-agent: Bravebot\nAllow: /',
  },

  // --- 21. Diffbot Knowledge Graph ---
  {
    id: 'diffbot',
    name: 'Diffbot',
    vendor: 'Diffbot',
    category: 'aggregator',
    description: 'Machine vision and NLP web extractor that constructs commercial knowledge graphs for AI.',
    patterns: [/Diffbot/i],
    geoImpact: 'medium',
    recommendedAction: 'monitor',
    robotsTxtSnippet: 'User-agent: Diffbot\nAllow: /',
  },

  // --- 22. DataForSEO ---
  {
    id: 'dataforseobot',
    name: 'DataForSeoBot',
    vendor: 'DataForSEO',
    category: 'seo_crawler',
    description: 'Crawl engine feeding AI SEO, LLM analytics tools, and market intelligence platforms.',
    patterns: [/DataForSeoBot/i],
    geoImpact: 'medium',
    recommendedAction: 'monitor',
    robotsTxtSnippet: 'User-agent: DataForSeoBot\nAllow: /',
  },

  // --- 23. Turnitin AI Detector ---
  {
    id: 'turnitinbot',
    name: 'TurnitinBot',
    vendor: 'Turnitin',
    category: 'aggregator',
    description: 'Academic integrity and AI writing detection system spider.',
    patterns: [/TurnitinBot/i],
    geoImpact: 'low',
    recommendedAction: 'monitor',
    robotsTxtSnippet: 'User-agent: TurnitinBot\nAllow: /',
  },

  // --- 24. Imagesift Multimodal Bot ---
  {
    id: 'imagesiftbot',
    name: 'ImagesiftBot',
    vendor: 'Imagesift',
    category: 'training',
    description: 'Multimodal AI crawler focusing on indexing imagery, visual assets, and photo context.',
    patterns: [/ImagesiftBot/i],
    geoImpact: 'low',
    recommendedAction: 'monitor',
    robotsTxtSnippet: 'User-agent: ImagesiftBot\nAllow: /',
  },

  // --- 25. Timpi Search ---
  {
    id: 'timpibot',
    name: 'TimpiBot',
    vendor: 'Timpi',
    category: 'search',
    description: 'Decentralized AI search engine crawler aimed at unbiased indexing.',
    patterns: [/TimpiBot/i],
    geoImpact: 'low',
    recommendedAction: 'monitor',
    robotsTxtSnippet: 'User-agent: TimpiBot\nAllow: /',
  },

  // --- 26. PetalBot (Huawei AI) ---
  {
    id: 'petalbot',
    name: 'PetalBot',
    vendor: 'Huawei',
    category: 'search',
    description: 'Huawei search & Celia AI assistant crawler popular in EMEA and Asia-Pacific.',
    patterns: [/PetalBot/i],
    geoImpact: 'medium',
    recommendedAction: 'monitor',
    robotsTxtSnippet: 'User-agent: PetalBot\nAllow: /',
  },

  // --- 27. Sogou Spider ---
  {
    id: 'sogouspider',
    name: 'Sogou Spider',
    vendor: 'Tencent',
    category: 'search',
    description: 'Tencent Sogou AI and search index crawler.',
    patterns: [/Sogou web spider/i, /Sogou/i],
    geoImpact: 'medium',
    recommendedAction: 'monitor',
    robotsTxtSnippet: 'User-agent: Sogou web spider\nAllow: /',
  },

  // --- 28. DuckAssist Bot ---
  {
    id: 'duckassistbot',
    name: 'DuckAssistBot',
    vendor: 'DuckDuckGo',
    category: 'search',
    description: 'DuckDuckGo AI summary engine fetcher generating direct AI answers.',
    patterns: [/DuckAssistBot/i],
    geoImpact: 'medium',
    recommendedAction: 'allow',
    robotsTxtSnippet: 'User-agent: DuckAssistBot\nAllow: /',
  },

  // --- 29. Allen Institute AI (Ai2Bot) ---
  {
    id: 'ai2bot',
    name: 'Ai2Bot',
    vendor: 'Allen Institute for AI',
    category: 'training',
    description: 'AI research crawler creating open datasets such as Dolma and OLMo open-weight models.',
    patterns: [/Ai2Bot/i, /Ai2Bot-Dolma/i],
    geoImpact: 'medium',
    recommendedAction: 'allow',
    robotsTxtSnippet: 'User-agent: Ai2Bot\nAllow: /',
  },

  // --- 30. Semantic Scholar Bot ---
  {
    id: 'semanticscholarbot',
    name: 'SemanticScholarBot',
    vendor: 'Allen Institute for AI',
    category: 'search',
    description: 'Academic knowledge graph crawler indexing scientific publications and whitepapers.',
    patterns: [/SemanticScholarBot/i],
    geoImpact: 'medium',
    recommendedAction: 'allow',
    robotsTxtSnippet: 'User-agent: SemanticScholarBot\nAllow: /',
  },

  // --- 31. Scrapy AI Agent ---
  {
    id: 'scrapy-agent',
    name: 'Scrapy Agent',
    vendor: 'Scrapy Framework',
    category: 'aggregator',
    description: 'Automated Python Scrapy crawlers frequently deployed by custom AI agent workflows.',
    patterns: [/Scrapy\/\d+/i],
    geoImpact: 'low',
    recommendedAction: 'optional_block',
    robotsTxtSnippet: 'User-agent: Scrapy\nDisallow: /',
  },

  // --- 32. Velen Public Web Crawler ---
  {
    id: 'velenbot',
    name: 'VelenBot',
    vendor: 'Velen',
    category: 'training',
    description: 'Automated web crawler gathering text data for generative AI fine-tuning.',
    patterns: [/VelenPublicWebCrawler/i],
    geoImpact: 'low',
    recommendedAction: 'optional_block',
    robotsTxtSnippet: 'User-agent: VelenPublicWebCrawler\nDisallow: /',
  },

  // --- 33. Webzio Extended ---
  {
    id: 'webzio',
    name: 'Webzio-Extended',
    vendor: 'Webzio',
    category: 'training',
    description: 'Commercial AI web scraper providing bulk datasets to enterprise LLM builders.',
    patterns: [/Webzio-Extended/i],
    geoImpact: 'low',
    recommendedAction: 'optional_block',
    robotsTxtSnippet: 'User-agent: Webzio-Extended\nDisallow: /',
  },

  // --- 34. Omgilibot ---
  {
    id: 'omgilibot',
    name: 'Omgilibot',
    vendor: 'Omgili',
    category: 'training',
    description: 'Web scraper indexing discussion boards, forums, and articles for AI sentiment training.',
    patterns: [/Omgilibot/i, /Omgili/i],
    geoImpact: 'low',
    recommendedAction: 'optional_block',
    robotsTxtSnippet: 'User-agent: Omgilibot\nDisallow: /',
  },

  // --- 35. Seekport Crawler ---
  {
    id: 'seekport',
    name: 'Seekport Crawler',
    vendor: 'Seekport',
    category: 'aggregator',
    description: 'Data aggregator spider frequently reselling scrape data to AI labs.',
    patterns: [/Seekport Crawler/i, /Seekport/i],
    geoImpact: 'low',
    recommendedAction: 'optional_block',
    robotsTxtSnippet: 'User-agent: Seekport\nDisallow: /',
  },

  // --- 36. Yandex Render Resources Bot ---
  {
    id: 'yandexrender',
    name: 'YandexRenderResourcesBot',
    vendor: 'Yandex',
    category: 'search',
    description: 'Yandex crawler evaluating headless JavaScript execution and rendering for Alice AI.',
    patterns: [/YandexRenderResourcesBot/i, /YandexBot/i],
    geoImpact: 'medium',
    recommendedAction: 'monitor',
    robotsTxtSnippet: 'User-agent: YandexBot\nAllow: /',
  },

  // --- 37. Awario Smart Bot ---
  {
    id: 'awariobot',
    name: 'AwarioSmartBot',
    vendor: 'Awario',
    category: 'aggregator',
    description: 'Social listening and real-time brand mention AI crawler.',
    patterns: [/AwarioSmartBot/i, /AwarioRssBot/i],
    geoImpact: 'low',
    recommendedAction: 'monitor',
    robotsTxtSnippet: 'User-agent: AwarioSmartBot\nAllow: /',
  },

  // --- 38. ICC-Crawler ---
  {
    id: 'icccrawler',
    name: 'ICC-Crawler',
    vendor: 'ICC',
    category: 'training',
    description: 'International computer science research corpus crawler for NLP models.',
    patterns: [/ICC-Crawler/i],
    geoImpact: 'low',
    recommendedAction: 'monitor',
    robotsTxtSnippet: 'User-agent: ICC-Crawler\nAllow: /',
  },

  // --- 39. Meltwater News & AI ---
  {
    id: 'meltwater',
    name: 'Meltwater News Bot',
    vendor: 'Meltwater',
    category: 'aggregator',
    description: 'Media intelligence and PR tracking AI crawler.',
    patterns: [/Meltwater/i],
    geoImpact: 'low',
    recommendedAction: 'monitor',
    robotsTxtSnippet: 'User-agent: Meltwater\nAllow: /',
  },

  // --- 40. Quora Poe Bot ---
  {
    id: 'poebot',
    name: 'PoeBot',
    vendor: 'Quora Poe',
    category: 'user_action',
    description: 'Fetcher triggered when users share links inside Quora Poe AI chat bots.',
    patterns: [/PoeBot/i],
    geoImpact: 'medium',
    recommendedAction: 'allow',
    robotsTxtSnippet: 'User-agent: PoeBot\nAllow: /',
  },

  // --- 41. AhrefsBot (AI Overviews & Search) ---
  {
    id: 'ahrefsbot',
    name: 'AhrefsBot',
    vendor: 'Ahrefs',
    category: 'seo_crawler',
    description: 'Major search engine and SEO indexer tracking brand presence and AI search citations.',
    patterns: [/AhrefsBot\/\d+/i, /AhrefsBot/i],
    geoImpact: 'high',
    recommendedAction: 'allow',
    robotsTxtSnippet: 'User-agent: AhrefsBot\nAllow: /',
  },

  // --- 42. SemrushBot ---
  {
    id: 'semrushbot',
    name: 'SemrushBot',
    vendor: 'Semrush',
    category: 'seo_crawler',
    description: 'Semrush web crawler assessing AI visibility, search position, and technical audit data.',
    patterns: [/SemrushBot\/\d+/i, /SemrushBot/i],
    geoImpact: 'high',
    recommendedAction: 'allow',
    robotsTxtSnippet: 'User-agent: SemrushBot\nAllow: /',
  },
  
  // --- 43. BrightEdge AI (Data Cube) ---
  {
    id: 'brightedge',
    name: 'BrightEdge AI Bot',
    vendor: 'BrightEdge',
    category: 'seo_crawler',
    description: 'Enterprise Generative Engine Optimization crawler assessing AI search snapshot results.',
    patterns: [/BrightEdge/i],
    geoImpact: 'medium',
    recommendedAction: 'allow',
    robotsTxtSnippet: 'User-agent: BrightEdge\nAllow: /',
  },

  // --- 44. Conductor AI ---
  {
    id: 'conductor',
    name: 'Conductor Searchlight',
    vendor: 'Conductor',
    category: 'seo_crawler',
    description: 'SEO intelligence platform analyzing AI snippet inclusion and voice assistant results.',
    patterns: [/Conductor/i],
    geoImpact: 'medium',
    recommendedAction: 'allow',
    robotsTxtSnippet: 'User-agent: Conductor\nAllow: /',
  },

  // --- 45. Brandwatch AI Crawler ---
  {
    id: 'brandwatch',
    name: 'Brandwatch Spider',
    vendor: 'Brandwatch',
    category: 'aggregator',
    description: 'Consumer intelligence AI crawler gathering web discussions and sentiment data.',
    patterns: [/Brandwatch/i, /Magpie-Crawler/i],
    geoImpact: 'low',
    recommendedAction: 'monitor',
    robotsTxtSnippet: 'User-agent: Magpie-Crawler\nAllow: /',
  },

  // --- 46. OnPageBot / Ryte ---
  {
    id: 'rytebot',
    name: 'RyteBot',
    vendor: 'Ryte',
    category: 'seo_crawler',
    description: 'Technical quality crawler checking AI readiness, schema, and page speed.',
    patterns: [/RyteBot/i, /OnPageBot/i],
    geoImpact: 'medium',
    recommendedAction: 'allow',
    robotsTxtSnippet: 'User-agent: RyteBot\nAllow: /',
  },

  // --- 47. Slackbot Fetcher ---
  {
    id: 'slackbot',
    name: 'Slackbot',
    vendor: 'Slack / Salesforce',
    category: 'user_action',
    description: 'Unfurls rich page summaries when users paste URLs into Slack channels with AI assistants.',
    patterns: [/Slackbot-LinkExpanding/i, /Slackbot/i],
    geoImpact: 'medium',
    recommendedAction: 'allow',
    robotsTxtSnippet: 'User-agent: Slackbot\nAllow: /',
  },

  // --- 48. Discordbot Fetcher ---
  {
    id: 'discordbot',
    name: 'Discordbot',
    vendor: 'Discord',
    category: 'user_action',
    description: 'Retrieves OpenGraph meta tags and cards when users share links in Discord AI bot threads.',
    patterns: [/Discordbot\/\d+/i, /Discordbot/i],
    geoImpact: 'medium',
    recommendedAction: 'allow',
    robotsTxtSnippet: 'User-agent: Discordbot\nAllow: /',
  },

  // --- 49. Apple News Bot ---
  {
    id: 'applenewsbot',
    name: 'AppleNewsBot',
    vendor: 'Apple',
    category: 'search',
    description: 'Apple News aggregator bot indexing headlines and articles for Apple AI feeds.',
    patterns: [/AppleNewsBot/i],
    geoImpact: 'high',
    recommendedAction: 'allow',
    robotsTxtSnippet: 'User-agent: AppleNewsBot\nAllow: /',
  },

  // --- 50. DuckDuckGo Favicons / Bot ---
  {
    id: 'duckduckbot',
    name: 'DuckDuckBot',
    vendor: 'DuckDuckGo',
    category: 'search',
    description: 'Official DuckDuckGo web spider supporting privacy-focused AI searches.',
    patterns: [/DuckDuckBot\/\d+/i, /DuckDuckBot/i],
    geoImpact: 'high',
    recommendedAction: 'allow',
    robotsTxtSnippet: 'User-agent: DuckDuckBot\nAllow: /',
  },

  // Generic AI bot catch-alls
  {
    id: 'generic-ai-agent',
    name: 'Generic AI Agent',
    vendor: 'Other AI Labs',
    category: 'training',
    description: 'Identified as an AI crawler via user-agent signatures or autonomous LLM headers.',
    patterns: [/AI2-Crawler/i, /ai-agent/i, /llm-crawler/i, /langchain/i, /autogen/i, /crewai/i],
    geoImpact: 'low',
    recommendedAction: 'monitor',
    robotsTxtSnippet: 'User-agent: *\nAllow: /',
  }
];

// Fast lookup cache
export function identifyBot(userAgent: string): BotDefinition | null {
  if (!userAgent || typeof userAgent !== 'string') return null;

  for (const bot of AI_BOTS_DATABASE) {
    for (const pattern of bot.patterns) {
      if (typeof pattern === 'string') {
        if (userAgent.toLowerCase().includes(pattern.toLowerCase())) {
          return bot;
        }
      } else if (pattern.test(userAgent)) {
        return bot;
      }
    }
  }

  // Secondary heuristic check for uncommon AI crawler patterns
  const lower = userAgent.toLowerCase();
  if (lower.includes('bot') || lower.includes('spider') || lower.includes('crawler')) {
    if (
      lower.includes('gpt') ||
      lower.includes('claude') ||
      lower.includes('anthropic') ||
      lower.includes('perplexity') ||
      lower.includes('gemini') ||
      lower.includes('deepseek') ||
      lower.includes('grok') ||
      lower.includes('openai') ||
      lower.includes('bytespider') ||
      lower.includes('mistral') ||
      lower.includes('cohere') ||
      lower.includes('llama')
    ) {
      return {
        id: 'unclassified-ai-crawler',
        name: 'AI Crawler (' + userAgent.slice(0, 24) + ')',
        vendor: 'Unclassified AI Lab',
        category: 'training',
        description: 'AI crawler signature detected in User-Agent header.',
        patterns: [],
        geoImpact: 'medium',
        recommendedAction: 'monitor',
        robotsTxtSnippet: 'User-agent: *\nAllow: /',
      };
    }
  }

  return null;
}
