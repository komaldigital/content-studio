/**
 * AI SEO Content Studio - Domain Types & Interfaces
 */

export type SearchIntentType = 
  | 'informational'
  | 'commercial'
  | 'transactional'
  | 'navigational'
  | 'local'
  | 'how-to'
  | 'comparison'
  | 'review'
  | 'recipe'
  | 'listicle';

export type AIModelEngine = 
  | 'gemini-3.8-flash'
  | 'gemini-3.1-pro-preview'
  | 'gemini-3.1-flash-lite'
  | 'gpt-4o'
  | 'gpt-4o-mini'
  | 'gpt-4-turbo'
  | 'claude-3-5-sonnet'
  | 'claude-3-5-haiku'
  | 'claude-3-opus'
  | 'openrouter/auto'
  | 'openrouter/anthropic/claude-3.7-sonnet'
  | 'openrouter/anthropic/claude-3.5-sonnet'
  | 'openrouter/deepseek/deepseek-r1'
  | 'openrouter/deepseek/deepseek-chat'
  | 'openrouter/openai/o3-mini'
  | 'openrouter/openai/gpt-4o'
  | 'openrouter/meta-llama/llama-3.3-70b-instruct'
  | 'openrouter/google/gemini-2.0-flash-001'
  | 'openrouter/qwen/qwen-2.5-72b-instruct'
  | 'openrouter/mistralai/mistral-large-2411'
  | 'straico/gpt-4o'
  | 'straico/claude-3-5-sonnet'
  | (string & {});

export interface AIModelDescriptor {
  id: string;
  name: string;
  provider: 'Google' | 'OpenAI' | 'Anthropic' | 'OpenRouter' | 'Straico' | 'google' | 'openai' | 'anthropic' | 'openrouter' | 'straico' | string;
  description?: string;
  contextWindow?: string;
  recommendedFor?: string;
  costPer1kWords?: string;
  bestFor?: string;
}

export type AIResearchProvider = 'gemini-grounding' | 'perplexity' | 'serp-live' | 'hybrid';

export interface ByokKeys {
  geminiApiKey?: string;
  openaiApiKey?: string;
  anthropicApiKey?: string;
  openrouterApiKey?: string;
  straicoApiKey?: string;
  perplexityApiKey?: string;
}

export interface BrandVoice {
  id: string;
  name: string;
  description: string;
  tone: ToneType | 'custom';
  pointOfView: 'first_person_singular' | 'first_person_plural' | 'second_person' | 'third_person';
  readingGradeLevel: 'elementary' | 'middle_school' | 'high_school' | 'college' | 'expert';
  forbiddenPhrases: string[];
  requiredPhrases: string[];
  sentenceStyle: 'punchy_short' | 'balanced' | 'narrative' | 'technical';
  customSystemInstructions: string;
  isDefault?: boolean;
}

export interface SitemapUrlEntry {
  id?: string;
  url: string;
  title: string;
  slug: string;
  category?: string;
  topicKeywords: string[];
  targetKeywords?: string[];
  tier: 'pillar' | 'cluster' | 'supporting';
  priority?: number;
  lastmod?: string;
}

export interface SitemapConfig {
  sitemapUrl: string;
  lastFetched?: string;
  autoExtractUrls: boolean;
  maxLinksPerArticle: number;
  maxInternalLinksPerArticle?: number;
  openLinksInNewTab: boolean;
  addNofollowToExternal: boolean;
  entries: SitemapUrlEntry[];
}

export interface BloggingAutomationConfig {
  enabled: boolean;
  publishingCadence: 'immediate' | 'daily' | 'twice_daily' | 'weekly' | 'custom_cron';
  articlesPerDay: number;
  defaultStatus: 'draft' | 'publish' | 'future';
  autoGenerateImages: boolean;
  generateIntentImages?: boolean;
  enforceBrandVoiceId?: string;
  enforceInternalLinking: boolean;
  timeWindowStart: string;
  timeWindowEnd: string;
  nextScheduledRun?: string;
  recentAutomationLogs: Array<{
    id: string;
    timestamp: string;
    action: string;
    articleTitle: string;
    status: 'success' | 'failed' | 'queued';
    details: string;
  }>;
}

export interface AiSearchCitationReport {
  score?: number;
  aiSearchEngineReadinessScore: number;
  factualityConfidence: 'high' | 'medium' | 'experimental';
  likelyToBeCitedBy?: string[];
  keyFactualSnippets?: string[];
  recommendations?: string[];
  liveSourcesUsed: Array<{
    title: string;
    url: string;
    snippet: string;
    engine: 'Perplexity' | 'Gemini Live' | 'Google SERP';
  }>;
  aiSearchEngineOptimizations: {
    directAnswerParagraphs: string[];
    structuredTablesCount: number;
    numericalClaimsCited: number;
    quoteAttributions: string[];
    schemaCompliant: boolean;
  };
}

export interface GeneratedImageItem {
  id: string;
  prompt: string;
  revisedPrompt?: string;
  url: string;
  aspectRatio: '16:9' | '1:1' | '4:3' | '9:16';
  style: 'photorealistic' | 'illustrative' | 'infographic' | 'watercolor' | '3d-render' | 'minimalist';
  altText: string;
  caption: string;
  targetArticleId?: string;
  createdAt: string;
}

export type ArticleType = 
  | 'all-in-one-seo'
  | 'one-shot-blog'
  | 'how-to'
  | 'review'
  | 'comparison'
  | 'case-study'
  | 'content-refresh'
  | 'ultimate-guide'
  | 'listicle'
  | 'recipe'
  | 'standard-post';

export type ToneType = 
  | 'authoritative'
  | 'conversational'
  | 'instructional'
  | 'professional'
  | 'enthusiastic'
  | 'friendly';

export type LengthType = 'short' | 'medium' | 'long' | 'comprehensive';

export type WordRocketTemplateId =
  | 'all-in-one-seo'
  | 'one-shot-blog'
  | 'product-review'
  | 'how-to-guide'
  | 'case-study'
  | 'content-refresh';

export type JobStatus = 'queued' | 'processing' | 'completed' | 'failed' | 'cancelled';

export type JobStage = 
  | 'idle'
  | 'researching'
  | 'intent_analysis'
  | 'serp_analysis'
  | 'content_gap_analysis'
  | 'brief_creation'
  | 'outline_creation'
  | 'writing_article'
  | 'seo_audit'
  | 'content_improvement'
  | 'image_generation'
  | 'internal_linking'
  | 'schema_generation'
  | 'pinterest_creation'
  | 'completed'
  | 'failed';

export interface GenerationInput {
  targetKeyword: string;
  secondaryKeywords?: string[];
  country?: string;
  language?: string;
  audience?: string;
  articleType?: ArticleType;
  desiredLength?: LengthType;
  targetWordCount?: number;
  templatePreset?: WordRocketTemplateId;
  tone?: ToneType;
  websiteTopic?: string;
  brandName?: string;
  authorProfile?: AuthorProfile;
  autoImprove?: boolean;
  imageQuantity?: 'auto' | 'standard' | 'rich' | 'minimal';
  selectedModel?: string;
  brandVoiceId?: string;
  researchEngine?: 'gemini-grounding' | 'perplexity' | 'hybrid';
  enableAiSearchCitationHooks?: boolean;
  enableSitemapInternalLinks?: boolean;
  includeSerpAnalysis?: boolean;
}

export interface AuthorProfile {
  name: string;
  bio: string;
  credentials: string;
  experience: string;
  website?: string;
  socialLinks?: {
    twitter?: string;
    linkedin?: string;
    website?: string;
  };
}

export interface CompetitorItem {
  title: string;
  url: string;
  snippet: string;
  commonHeadings: string[];
  format: string;
}

export interface ResearchResult {
  keyword: string;
  isLiveResearchAvailable: boolean;
  providerNotice: string;
  competitors: CompetitorItem[];
  commonQuestions: string[];
  entities: string[];
  contentFormats: string[];
  serpFeatures: string[];
  contentGaps: {
    topicsCovered: string[];
    topicsMissed: string[];
    questionsMissed: string[];
    examplesLacked: string[];
    tablesNeeded: string[];
    visualOpportunities: string[];
  };
}

export interface DiscoveredKeyword {
  id: string;
  keyword: string;
  intent: SearchIntentType;
  volumeTier: 'High (>10k)' | 'Medium (1k-10k)' | 'Low (<1k)' | 'Niche';
  difficulty: number; // 0 - 100
  difficultyLevel: 'Easy' | 'Medium' | 'Hard';
  cpcTier: 'Low' | 'Medium' | 'High';
  trend: 'rising' | 'stable' | 'seasonal' | 'declining';
  serpFeatures: string[];
  topQuestions: string[];
  relevanceScore: number; // 0 - 100
  clusterCategory: string;
  isSaved?: boolean;
}

export interface KeywordCluster {
  name: string;
  description: string;
  keywordCount: number;
  primaryIntent: SearchIntentType;
  keywords: DiscoveredKeyword[];
}

export interface KeywordResearchResult {
  seedKeyword: string;
  targetCountry: string;
  targetLanguage: string;
  primaryIntent: SearchIntentType;
  overviewSummary: string;
  totalResults: number;
  averageDifficulty: number;
  topOpportunities: string[];
  intentBreakdown: {
    informational: number;
    howTo: number;
    commercial: number;
    transactional: number;
    comparison: number;
  };
  clusters: KeywordCluster[];
  keywords: DiscoveredKeyword[];
  questions: {
    question: string;
    parentKeyword: string;
    intent: SearchIntentType;
  }[];
  contentGapsFound: string[];
  suggestedPillars: string[];
  providerNotice?: string;
  createdAt: string;
}

export interface SearchIntentResult {
  primaryIntent: SearchIntentType;
  secondaryIntent?: SearchIntentType;
  userGoal: string;
  expectedContentType: string;
  expectedDepth: string;
  likelyQuestions: string[];
  commercialViability: 'low' | 'medium' | 'high';
}

export interface ContentBrief {
  id: string;
  primaryKeyword: string;
  secondaryKeywords: string[];
  searchIntent: SearchIntentResult;
  targetAudience: string;
  contentType: string;
  recommendedTitle: string;
  alternativeTitles: string[];
  slug: string;
  metaDescription: string;
  alternativeMetaDescriptions: string[];
  h1: string;
  outline: {
    h2: string;
    h3s?: string[];
    keyPoints?: string[];
    suggestedVisual?: string;
  }[];
  entities: string[];
  relatedConcepts: string[];
  questionsToAnswer: string[];
  contentGapsToAddress: string[];
  internalLinkOpportunities: string[];
  externalSourceOpportunities: {
    type: 'gov' | 'edu' | 'org' | 'documentation' | 'industry';
    name: string;
    relevance: string;
  }[];
  imageRecommendations: {
    placement: string;
    concept: string;
    altTextSuggestion: string;
    searchIntentMatch?: string;
    sectionHeading?: string;
    aspectRatio?: '16:9' | '4:3' | '1:1' | '9:16' | '3:4';
  }[];
  schemaRecommendation: 'Article' | 'BlogPosting' | 'FAQPage' | 'HowTo' | 'Recipe';
  suggestedWordCount: number;
  createdAt: string;
}

export interface SeoScoreBreakdown {
  searchIntent: number;     // max 20
  topicalCoverage: number;  // max 20
  contentQuality: number;   // max 20
  structure: number;        // max 10
  keywordOptimization: number; // max 10
  internalLinking: number;  // max 5
  externalSources: number;  // max 5
  media: number;            // max 5
  schema: number;           // max 5
  total: number;            // max 100
  explanations: {
    category: string;
    score: number;
    max: number;
    reason: string;
    suggestions?: string[];
  }[];
}

export interface FactCheckFinding {
  claim: string;
  category: 'medical' | 'financial' | 'legal' | 'scientific' | 'safety' | 'statistics' | 'prices';
  flaggedForHumanReview: boolean;
  notes: string;
}

export interface ArticleSection {
  id: string;
  heading: string;
  level: 2 | 3;
  content: string; // Markdown / HTML
}

export interface FAQItem {
  question: string;
  answer: string;
}

export interface ArticleImage {
  id: string;
  type: 'featured' | 'article' | 'pinterest';
  url: string;
  altText: string;
  caption?: string;
  description?: string;
  placement?: string;
  prompt?: string;
  attachmentId?: number;
  searchIntentMatch?: string; // e.g. "Primary Plated Hero", "Step-by-Step Cooking Technique", "Ingredient Mise en Place", "Side-by-Side Comparison"
  sectionHeading?: string;    // specific H2/H3 section this visual illustrates
  aspectRatio?: '16:9' | '4:3' | '1:1' | '9:16' | '3:4';
  width?: number;
  height?: number;
}

export interface InternalLinkItem {
  postId: number | string;
  title: string;
  url: string;
  excerpt?: string;
  category?: string;
  anchorTextCandidate: string;
  targetSection: string;
  status: 'suggested' | 'inserted' | 'ignored';
}

export interface ExternalSourceItem {
  name: string;
  url: string;
  authorityType: 'gov' | 'edu' | 'org' | 'publication' | 'documentation';
  context: string;
  status: 'suggested' | 'included' | 'ignored';
}

export interface PinterestGraphicConfig {
  templateId: 'template-1' | 'template-2' | 'template-3';
  headline: string;
  brandName: string;
  brandLogoUrl?: string;
  primaryColor: string;
  secondaryColor: string;
  textColor: string;
  ctaText: string;
  imageUrl: string;
  fontFamily: string;
}

export interface PinterestPinData {
  id: string;
  title: string;
  description: string;
  destinationUrl: string;
  boardId?: string;
  boardName?: string;
  keywords: string[];
  cta: string;
  imageUrl: string;
  status: 'draft' | 'ready' | 'published' | 'failed';
  publishedAt?: string;
  pinId?: string;
  pinUrl?: string;
  error?: string;
  graphicConfig: PinterestGraphicConfig;
}

export interface FacebookPostData {
  id?: string;
  postId?: string;
  pageId?: string;
  message: string;
  link?: string;
  imageUrl?: string;
  status: 'draft' | 'ready' | 'published' | 'failed';
  publishedAt?: string;
  postUrl?: string;
  error?: string;
}

export interface InstagramPostData {
  id?: string;
  mediaId?: string;
  instagramAccountId?: string;
  caption: string;
  imageUrl: string;
  aspectRatio: '1:1' | '4:5';
  status: 'draft' | 'ready' | 'published' | 'failed';
  publishedAt?: string;
  permalink?: string;
  postUrl?: string;
  error?: string;
}

export interface ArticleVersion {
  versionNumber: number;
  createdAt: string;
  summary: string;
  title: string;
  content: string;
  seoScore: number;
}

export interface Article {
  id: string;
  title: string;
  slug: string;
  metaDescription: string;
  content: string; // Full markdown / HTML
  sections: ArticleSection[];
  faqs: FAQItem[];
  jsonLdSchema: string;
  schemaType: 'Article' | 'BlogPosting' | 'FAQPage' | 'HowTo' | 'Recipe';
  seoScore: SeoScoreBreakdown;
  improvementPasses: number;
  wordCount: number;
  readingTimeMinutes: number;
  featuredImage?: ArticleImage;
  articleImages: ArticleImage[];
  internalLinks: InternalLinkItem[];
  externalSources: ExternalSourceItem[];
  factCheckFlags: FactCheckFinding[];
  isHighRiskContent: boolean;
  pinterestPin?: PinterestPinData;
  facebookPost?: FacebookPostData;
  instagramPost?: InstagramPostData;
  wordpressStatus: 'none' | 'draft' | 'pending' | 'scheduled' | 'publish';
  wordpressPostId?: number;
  wordpressUrl?: string;
  category?: string;
  tags?: string[];
  status?: 'draft' | 'published' | 'queued' | 'review' | 'none';
  modelUsed?: string;
  brandVoiceId?: string;
  aiCitationReport?: AiSearchCitationReport;
  versions: ArticleVersion[];
  brief: ContentBrief;
  createdAt: string;
  updatedAt: string;
}

export interface Job {
  id: string;
  keyword: string;
  status: JobStatus;
  stage: JobStage;
  progress: number; // 0 to 100
  articleId?: string;
  error?: string;
  log: string[];
  createdAt: string;
  updatedAt: string;
}

export interface BrandSettings {
  brandName: string;
  websiteUrl: string;
  logoUrl?: string;
  primaryColor: string;
  secondaryColor: string;
  font: string;
  defaultCta: string;
}

export interface WordPressConnectionSettings {
  endpoint: string; // e.g., https://example.com/wp-json
  username: string;
  applicationPassword?: string;
  isConnected: boolean;
  defaultPostStatus: 'draft' | 'pending' | 'publish' | 'future';
  autoPublish: boolean;
  detectedSeoPlugin: 'yoast' | 'rankmath' | 'aioseo' | 'native';
  lastChecked?: string;
}

export interface PinterestConnectionSettings {
  accessToken?: string;
  refreshToken?: string;
  isConnected: boolean;
  username?: string;
  selectedBoardId?: string;
  boards: { id: string; name: string }[];
  lastChecked?: string;
}

export interface FacebookConnectionSettings {
  pageId?: string;
  pageName?: string;
  accessToken?: string;
  appId?: string;
  isConnected: boolean;
  autoPostOnPublish: boolean;
  autoPublish?: boolean;
  defaultHashtags: string[];
  lastChecked?: string;
}

export interface InstagramConnectionSettings {
  instagramAccountId?: string;
  accountUsername?: string;
  accessToken?: string;
  isConnected: boolean;
  autoPostOnPublish: boolean;
  autoPublish?: boolean;
  defaultHashtags: string[];
  lastChecked?: string;
}

export interface MultiChannelPublishRequest {
  articleId: string;
  channels: {
    wordpress: boolean;
    facebook: boolean;
    pinterest: boolean;
    instagram: boolean;
  };
  customizations?: {
    wordpress?: {
      status?: 'draft' | 'publish';
      category?: string;
      tags?: string[];
    };
    facebook?: {
      message?: string;
      link?: string;
      imageUrl?: string;
    };
    pinterest?: {
      boardId?: string;
      title?: string;
      description?: string;
      destinationUrl?: string;
      imageUrl?: string;
    };
    instagram?: {
      caption?: string;
      imageUrl?: string;
      aspectRatio?: '1:1' | '4:5';
    };
  };
}

export interface MultiChannelPublishResult {
  success: boolean;
  articleId: string;
  publishedCount: number;
  channels: {
    wordpress?: {
      attempted: boolean;
      success: boolean;
      status?: string;
      postId?: number;
      url?: string;
      error?: string;
    };
    facebook?: {
      attempted: boolean;
      success: boolean;
      postId?: string;
      url?: string;
      error?: string;
    };
    pinterest?: {
      attempted: boolean;
      success: boolean;
      pinId?: string;
      url?: string;
      error?: string;
    };
    instagram?: {
      attempted: boolean;
      success: boolean;
      mediaId?: string;
      url?: string;
      error?: string;
    };
  };
  article?: Article;
}

export interface AppSettings {
  activeModel: string;
  byok: ByokKeys;
  byokConfigured?: Record<string, boolean>;
  byokMasked?: Record<string, string>;
  gemini: {
    model: string;
    maxOutputTokens: number;
    temperature: number;
    topP: number;
    thinkingLevel?: 'HIGH' | 'LOW' | 'MINIMAL';
  };
  research: {
    provider: 'google-grounding' | 'perplexity' | 'custom-serp' | 'mock';
    serpApiKey?: string;
    perplexityApiKey?: string;
    enableLiveSearch: boolean;
  };
  images: {
    provider: 'seedream-4.5' | 'gemini' | 'canvas-svg' | 'mock';
    primaryModel?: string;
    defaultStyle: string;
    resolution?: string;
    enableIntentMatching?: boolean;
  };
  costControls: {
    maxArticlesPerDay: number;
    maxImagesPerArticle: number;
    maxRewritePasses: number;
    maxBulkJobs: number;
  };
  brand: BrandSettings;
  brandVoices: BrandVoice[];
  activeBrandVoiceId?: string;
  sitemap: SitemapConfig;
  automations: BloggingAutomationConfig;
  wordpress: WordPressConnectionSettings;
  pinterest: PinterestConnectionSettings;
  facebook: FacebookConnectionSettings;
  instagram: InstagramConnectionSettings;
  testMode: boolean;
}

export interface TopicClusterNode {
  id: string;
  title: string;
  keyword: string;
  intent: SearchIntentType;
  level: 'pillar' | 'cluster' | 'supporting';
  parentId?: string;
  children?: TopicClusterNode[];
  status: 'planned' | 'in_calendar' | 'generated' | 'published';
  articleId?: string;
}

export interface ContentCalendarItem {
  id: string;
  topic: string;
  keyword: string;
  articleType: ArticleType;
  priority: 'high' | 'medium' | 'low';
  status: 'idea' | 'planned' | 'drafted' | 'published';
  publishDate: string;
  pinterestStatus: 'not_created' | 'ready' | 'scheduled' | 'published';
  articleId?: string;
}

export interface LogEntry {
  id: string;
  timestamp: string;
  level: 'info' | 'warn' | 'error';
  category: 'gemini' | 'research' | 'article' | 'seo' | 'image' | 'wordpress' | 'pinterest' | 'facebook' | 'instagram' | 'multi_publish' | 'security';
  message: string;
  metadata?: Record<string, unknown>;
}

export interface BulkUploadRow {
  keyword: string;
  category?: string;
  intent?: string;
  country?: string;
  article_type?: string;
}
