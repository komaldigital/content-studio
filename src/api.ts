/**
 * Client API Client
 * Clean type-safe requests to Express backend
 */

import {
  Article,
  Job,
  ContentCalendarItem,
  TopicClusterNode,
  LogEntry,
  AppSettings,
  GenerationInput,
  SearchIntentResult,
  ResearchResult,
  MultiChannelPublishRequest,
  MultiChannelPublishResult,
  KeywordResearchResult,
  DiscoveredKeyword
} from './types.js';
import {
  FALLBACK_MODELS,
  FALLBACK_BRAND_VOICES,
  FALLBACK_SETTINGS,
  FALLBACK_ARTICLES,
  FALLBACK_CALENDAR,
  FALLBACK_CLUSTERS,
  FALLBACK_SAVED_KEYWORDS
} from './data/fallbackData.js';

async function safeFetchJson<T>(url: string, fallback: T, init?: RequestInit): Promise<T> {
  try {
    const res = await fetch(url, init);
    if (!res.ok) return fallback;
    const contentType = res.headers.get('content-type') || '';
    if (!contentType.includes('application/json')) return fallback;
    return await res.json();
  } catch {
    return fallback;
  }
}

export const api = {
  async getHealth() {
    return safeFetchJson('/api/health', {
      status: 'ok',
      app: 'AI SEO Content Studio (Static Mode)',
      timestamp: new Date().toISOString(),
      models: {
        current: 'gemini-3.8-flash',
        available: ['gemini-3.8-flash', 'gemini-3.1-pro-preview', 'gemini-3.1-flash-lite']
      }
    });
  },

  async researchKeywords(
    seedKeyword: string,
    country = 'United States',
    language = 'English',
    intentFocus = 'all'
  ): Promise<KeywordResearchResult> {
    try {
      const res = await fetch('/api/keywords/research', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ seedKeyword, country, language, intentFocus })
      });
      if (res.ok) {
        return await res.json();
      }
    } catch {
      // Fall through to client-side synthesis below
    }

    // Client-side fallback for static deployments (GitHub Pages)
    const normalized = seedKeyword.trim().toLowerCase();
    return {
      seedKeyword,
      intentSummary: `Strong informational intent for "${seedKeyword}". Readers seek actionable recipes, structured steps, and quick answers.`,
      keywordCount: 6,
      keywords: [
        {
          keyword: normalized,
          searchVolume: '33,100/mo',
          difficulty: 'medium',
          difficultyScore: 42,
          cpc: '$1.20',
          searchIntent: 'informational',
          relevance: 'High',
          topicCluster: 'Core Guide',
          suggestedFormat: 'recipe'
        },
        {
          keyword: `best ${normalized} for beginners`,
          searchVolume: '8,400/mo',
          difficulty: 'low',
          difficultyScore: 24,
          cpc: '$0.85',
          searchIntent: 'informational',
          relevance: 'High',
          topicCluster: 'Beginners',
          suggestedFormat: 'how-to'
        },
        {
          keyword: `quick 30 minute ${normalized}`,
          searchVolume: '14,200/mo',
          difficulty: 'low',
          difficultyScore: 29,
          cpc: '$0.95',
          searchIntent: 'informational',
          relevance: 'High',
          topicCluster: 'Fast Meals',
          suggestedFormat: 'recipe'
        },
        {
          keyword: `${normalized} meal prep ideas`,
          searchVolume: '11,500/mo',
          difficulty: 'medium',
          difficultyScore: 38,
          cpc: '$1.05',
          searchIntent: 'informational',
          relevance: 'Medium',
          topicCluster: 'Meal Prep',
          suggestedFormat: 'listicle'
        }
      ],
      suggestedPillars: [
        `The Definitive Masterclass: ${seedKeyword}`,
        `Fast & Healthy ${seedKeyword} Playbook`
      ],
      questionsPeopleAsk: [
        `How long does it take to prepare ${seedKeyword}?`,
        `Can you make ${seedKeyword} ahead of time?`,
        `What are the best side dishes to serve?`
      ]
    };
  },

  async getSavedKeywords(): Promise<DiscoveredKeyword[]> {
    return safeFetchJson('/api/keywords/saved', FALLBACK_SAVED_KEYWORDS);
  },

  async saveKeyword(keyword: DiscoveredKeyword): Promise<{ success: boolean; savedKeyword: DiscoveredKeyword }> {
    try {
      const res = await fetch('/api/keywords/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ keyword })
      });
      if (res.ok) return await res.json();
    } catch {
      // Fallback
    }
    return { success: true, savedKeyword: keyword };
  },

  async deleteSavedKeyword(id: string): Promise<{ success: boolean }> {
    try {
      const res = await fetch(`/api/keywords/saved/${encodeURIComponent(id)}`, {
        method: 'DELETE'
      });
      if (res.ok) return await res.json();
    } catch {
      // Fallback
    }
    return { success: true };
  },

  async getSettings(): Promise<AppSettings & { geminiApiKeyConfigured: boolean }> {
    return safeFetchJson('/api/settings', FALLBACK_SETTINGS);
  },

  async updateSettings(settings: Partial<AppSettings>) {
    try {
      const res = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings)
      });
      if (res.ok) return await res.json();
    } catch {
      // Fallback
    }
    return { success: true, settings };
  },

  async conductResearch(keyword: string, country?: string, language?: string): Promise<{ research: ResearchResult; intent: SearchIntentResult }> {
    const res = await fetch('/api/pipeline/research', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ keyword, country, language })
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Research failed');
    }
    return res.json();
  },

  async startGeneration(input: GenerationInput): Promise<{ success: boolean; job: Job }> {
    const res = await fetch('/api/pipeline/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input)
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Generation failed to start');
    }
    return res.json();
  },

  async getJobs(): Promise<Job[]> {
    const res = await fetch('/api/jobs');
    return res.json();
  },

  async getJob(id: string): Promise<Job> {
    const res = await fetch(`/api/jobs/${id}`);
    if (!res.ok) throw new Error('Job not found');
    return res.json();
  },

  async cancelJob(id: string): Promise<{ success: boolean }> {
    const res = await fetch(`/api/jobs/${id}/cancel`, { method: 'POST' });
    return res.json();
  },

  async getArticles(): Promise<Article[]> {
    const res = await fetch('/api/articles');
    return res.json();
  },

  async getArticle(id: string): Promise<Article> {
    const res = await fetch(`/api/articles/${id}`);
    if (!res.ok) throw new Error('Article not found');
    return res.json();
  },

  async updateArticle(id: string, updates: Partial<Article>): Promise<{ success: boolean; article: Article }> {
    const res = await fetch(`/api/articles/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates)
    });
    return res.json();
  },

  async deleteArticle(id: string): Promise<{ success: boolean }> {
    const res = await fetch(`/api/articles/${id}`, { method: 'DELETE' });
    return res.json();
  },

  async editSection(articleId: string, sectionId: string, action: string, customInstruction?: string) {
    const res = await fetch(`/api/articles/${articleId}/section-edit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sectionId, action, customInstruction })
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Section edit failed');
    }
    return res.json();
  },

  async autoImproveSeo(articleId: string) {
    const res = await fetch(`/api/articles/${articleId}/improve-seo`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'SEO improvement failed');
    }
    return res.json();
  },

  async generateIntentImage(articleId: string, options: {
    sectionHeading?: string;
    placement?: string;
    searchIntentMatch?: string;
    aspectRatio?: '16:9' | '4:3' | '1:1';
    prompt?: string;
    type?: 'featured' | 'article';
  }): Promise<{ success: boolean; image: any; article: Article }> {
    const res = await fetch(`/api/articles/${articleId}/generate-intent-image`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(options)
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to generate intent visual');
    }
    return res.json();
  },

  async generateAllSectionImages(articleId: string, options?: { forceRefreshAll?: boolean }): Promise<{
    success: boolean;
    article: Article;
    generatedCount: number;
    totalImages: number;
  }> {
    const res = await fetch(`/api/articles/${articleId}/generate-all-section-images`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(options || {})
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to generate all section visuals');
    }
    return res.json();
  },

  async searchKeywordImages(keyword: string): Promise<{
    success: boolean;
    keyword: string;
    results: { url: string; title: string; altText: string; source: 'wikimedia' | 'pollinations' }[];
  }> {
    const res = await fetch(`/api/images/search?keyword=${encodeURIComponent(keyword)}`);
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to search keyword images');
    }
    return res.json();
  },

  async updateArticleImage(articleId: string, payload: {
    imageId: string;
    newUrl: string;
    altText?: string;
    caption?: string;
  }): Promise<{ success: boolean; article: Article }> {
    const res = await fetch(`/api/articles/${articleId}/update-image`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to update article image');
    }
    return res.json();
  },

  async getClusters(): Promise<TopicClusterNode[]> {
    const res = await fetch('/api/clusters');
    return res.json();
  },

  async generateClusterTree(pillarKeyword: string) {
    const res = await fetch('/api/clusters/generate-tree', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pillarKeyword })
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Cluster generation failed');
    }
    return res.json();
  },

  async getCalendar(): Promise<ContentCalendarItem[]> {
    const res = await fetch('/api/calendar');
    return res.json();
  },

  async addCalendarItem(item: Partial<ContentCalendarItem>) {
    const res = await fetch('/api/calendar', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(item)
    });
    return res.json();
  },

  async deleteCalendarItem(id: string) {
    const res = await fetch(`/api/calendar/${id}`, { method: 'DELETE' });
    return res.json();
  },

  async uploadBulk(csvText?: string, rows?: any[], selectedModel?: string) {
    const res = await fetch('/api/bulk/upload', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ csvText, rows, selectedModel })
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Bulk upload failed');
    }
    return res.json();
  },

  async refreshContent(existingContent: string, targetKeyword: string) {
    const res = await fetch('/api/articles/refresh', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ existingContent, targetKeyword })
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Refresh analysis failed');
    }
    return res.json();
  },

  async testWordPress() {
    const res = await fetch('/api/wordpress/test');
    return res.json();
  },

  async publishToWordPress(articleId: string, status: 'draft' | 'pending' | 'publish') {
    const res = await fetch('/api/wordpress/publish', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ articleId, status })
    });
    return res.json();
  },

  async getPinterestStatus() {
    const res = await fetch('/api/pinterest/status');
    return res.json();
  },

  async connectPinterest(accessToken: string) {
    const res = await fetch('/api/pinterest/connect', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ accessToken })
    });
    return res.json();
  },

  async publishPin(articleId: string, pinData?: any) {
    const res = await fetch('/api/pinterest/publish', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ articleId, pinData })
    });
    return res.json();
  },

  async getFacebookStatus() {
    const res = await fetch('/api/facebook/status');
    return res.json();
  },

  async connectFacebook(pageId: string, accessToken: string) {
    const res = await fetch('/api/facebook/connect', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pageId, accessToken })
    });
    return res.json();
  },

  async publishToFacebook(articleId: string, postData?: any) {
    const res = await fetch('/api/facebook/publish', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ articleId, postData })
    });
    return res.json();
  },

  async getInstagramStatus() {
    const res = await fetch('/api/instagram/status');
    return res.json();
  },

  async connectInstagram(instagramAccountId: string, accessToken: string) {
    const res = await fetch('/api/instagram/connect', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ instagramAccountId, accessToken })
    });
    return res.json();
  },

  async publishToInstagram(articleId: string, postData?: any) {
    const res = await fetch('/api/instagram/publish', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ articleId, postData })
    });
    return res.json();
  },

  async publishToAllChannels(request: MultiChannelPublishRequest): Promise<MultiChannelPublishResult> {
    const res = await fetch('/api/social/publish-all', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(request)
    });
    return res.json();
  },

  async getLogs(): Promise<LogEntry[]> {
    const res = await fetch('/api/logs');
    return res.json();
  },

  async runTestSuite() {
    const res = await fetch('/api/test-suite/run', { method: 'POST' });
    return res.json();
  },

  // ----------------------------------------------------
  // MULTI-MODEL & BYOK
  // ----------------------------------------------------
  async getModels() {
    const res = await fetch('/api/models');
    return res.json();
  },

  async testModel(model: string, apiKey?: string) {
    const res = await fetch('/api/models/test', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ model, apiKey })
    });
    return res.json();
  },

  async saveByokKeys(keys: any, activeModel?: string) {
    const res = await fetch('/api/byok/keys', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ keys, activeModel })
    });
    return res.json();
  },

  // ----------------------------------------------------
  // BRAND VOICES
  // ----------------------------------------------------
  async getBrandVoices() {
    const res = await fetch('/api/brand-voices');
    return res.json();
  },

  async saveBrandVoice(voice: any) {
    const res = await fetch('/api/brand-voices', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(voice)
    });
    return res.json();
  },

  async deleteBrandVoice(id: string) {
    const res = await fetch(`/api/brand-voices/${encodeURIComponent(id)}`, {
      method: 'DELETE'
    });
    return res.json();
  },

  // ----------------------------------------------------
  // SITEMAP & TOPICAL INTERNAL LINKING
  // ----------------------------------------------------
  async getSitemap() {
    const res = await fetch('/api/sitemap');
    return res.json();
  },

  async fetchSitemap(sitemapUrl?: string, xmlRaw?: string) {
    const res = await fetch('/api/sitemap/fetch', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sitemapUrl, xmlRaw })
    });
    return res.json();
  },

  async saveSitemapConfig(updates: any) {
    const res = await fetch('/api/sitemap/save', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates)
    });
    return res.json();
  },

  async applySitemapLinks(params: { articleId?: string; content?: string; keyword?: string }) {
    const res = await fetch('/api/sitemap/apply-links', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params)
    });
    return res.json();
  },

  // ----------------------------------------------------
  // AUTOMATIONS
  // ----------------------------------------------------
  async getAutomations() {
    const res = await fetch('/api/automations');
    return res.json();
  },

  async saveAutomations(updates: any) {
    const res = await fetch('/api/automations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates)
    });
    return res.json();
  },

  async triggerAutomation() {
    const res = await fetch('/api/automations/trigger', {
      method: 'POST'
    });
    return res.json();
  },

  // ----------------------------------------------------
  // BULK ONE-CLICK WORDPRESS PUBLISHING
  // ----------------------------------------------------
  async publishAllToWordPress(status: string = 'draft', articleIds?: string[]) {
    const res = await fetch('/api/bulk/publish-all-wordpress', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status, articleIds })
    });
    return res.json();
  },

  // ----------------------------------------------------
  // DEDICATED IMAGE STUDIO & GALLERY
  // ----------------------------------------------------
  async getGalleryImages() {
    const res = await fetch('/api/images/gallery');
    return res.json();
  },

  async generateStandaloneImage(params: {
    prompt: string;
    topic?: string;
    style?: string;
    aspectRatio?: string;
    engine?: string;
  }) {
    const res = await fetch('/api/images/generate-standalone', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params)
    });
    return res.json();
  },

  async testSeedreamImage(params?: { key?: string; prompt?: string }) {
    const res = await fetch('/api/images/test-seedream', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params || {})
    });
    return res.json();
  },

  async attachImageToArticle(articleId: string, params: any) {
    const res = await fetch(`/api/articles/${articleId}/attach-image`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params)
    });
    return res.json();
  },

  // ----------------------------------------------------
  // AI SEARCH CITATION REPORT (GEO)
  // ----------------------------------------------------
  async getCitationReport(articleId: string) {
    const res = await fetch(`/api/articles/${articleId}/citation-report`);
    return res.json();
  }
};
