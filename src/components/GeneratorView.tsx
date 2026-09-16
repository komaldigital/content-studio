import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Search,
  ArrowRight,
  HelpCircle,
  Layers,
  FileCheck,
  Cpu,
  Info,
  Sliders,
  Check,
  AlertTriangle,
  RefreshCw,
  X,
  Bot,
  Key,
  ChevronDown,
  ShieldCheck,
  Camera,
  Zap,
  Rocket,
  Target,
  Link2,
  Globe,
  DollarSign,
  Clock,
  BookOpen,
  Award,
  CheckCircle2
} from 'lucide-react';
import { api } from '../api.js';
import {
  GenerationInput,
  ResearchResult,
  SearchIntentResult,
  Job,
  ToneType,
  ArticleType,
  AIModelDescriptor,
  WordRocketTemplateId
} from '../types.js';

interface GeneratorViewProps {
  onJobStarted: (job: Job) => void;
  onViewArticle: (articleId: string) => void;
  initialKeyword?: string;
  initialSecondaryKeywords?: string[];
}

export const GeneratorView: React.FC<GeneratorViewProps> = ({
  onJobStarted,
  onViewArticle,
  initialKeyword,
  initialSecondaryKeywords
}) => {
  const [keyword, setKeyword] = useState(initialKeyword || 'easy chicken dinner recipes');
  const [secondaryKeywords, setSecondaryKeywords] = useState(
    initialSecondaryKeywords?.join(', ') || 'quick weeknight meals, 30 minute chicken recipes'
  );
  const [country, setCountry] = useState('United States');
  const [language, setLanguage] = useState('English');
  const [audience, setAudience] = useState('Busy home cooks and parents seeking low-stress meals');
  const [tone, setTone] = useState<ToneType>('authoritative');
  const [articleType, setArticleType] = useState<ArticleType>('all-in-one-seo');
  const [brandName, setBrandName] = useState('AI SEO Studio');
  const [autoImprove, setAutoImprove] = useState(true);

  // Senior Subject-Matter Expert Prompt States
  const [voiceNotes, setVoiceNotes] = useState('Senior practitioner who has done this for years. Smart, slightly opinionated, in a hurry. Zero brochure fluff.');
  const [competitorUrls, setCompetitorUrls] = useState('');
  const [showPromptDetails, setShowPromptDetails] = useState(false);

  // WordRocket Template & Core Engine States
  const [selectedTemplate, setSelectedTemplate] = useState<WordRocketTemplateId>('all-in-one-seo');
  const [targetWordCount, setTargetWordCount] = useState<number>(2500);
  const [includeSerpAnalysis, setIncludeSerpAnalysis] = useState<boolean>(true);
  const [enableSitemapLinks, setEnableSitemapLinks] = useState<boolean>(true);
  const [sitemapUrlCount, setSitemapUrlCount] = useState<number>(12);
  const [sitemapDomain, setSitemapDomain] = useState<string>('site.com');

  // Model Selection State
  const [availableModels, setAvailableModels] = useState<AIModelDescriptor[]>([]);
  const [selectedModel, setSelectedModel] = useState<string>('gemini-3.8-flash');
  const [byokConfigured, setByokConfigured] = useState<Record<string, boolean>>({});
  const [openrouterKeyInput, setOpenrouterKeyInput] = useState('');
  const [isSavingKey, setIsSavingKey] = useState(false);
  const [keySaveMessage, setKeySaveMessage] = useState<string | null>(null);
  const [testingModel, setTestingModel] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);

  // Fetch available models and sitemap data on mount
  useEffect(() => {
    const fetchModels = async () => {
      try {
        const res = await api.getModels();
        if (res.availableModels && res.availableModels.length > 0) {
          setAvailableModels(res.availableModels);
        }
        if (res.activeModel) {
          setSelectedModel(res.activeModel);
        }
        if (res.byokConfigured) {
          setByokConfigured(res.byokConfigured);
        }
      } catch (e) {
        console.warn('Failed to load AI models:', e);
      }
    };

    const fetchSitemapInfo = async () => {
      try {
        const sitemap = await api.getSitemap();
        if (sitemap) {
          if (sitemap.entries && sitemap.entries.length > 0) {
            setSitemapUrlCount(sitemap.entries.length);
          }
          if (sitemap.sitemapUrl) {
            try {
              setSitemapDomain(new URL(sitemap.sitemapUrl).hostname);
            } catch {
              setSitemapDomain(sitemap.sitemapUrl.replace(/^https?:\/\//, '').split('/')[0]);
            }
          }
        }
      } catch {}
    };

    fetchModels();
    fetchSitemapInfo();
  }, []);

  // Update if initialKeyword changes
  React.useEffect(() => {
    if (initialKeyword) {
      setKeyword(initialKeyword);
    }
  }, [initialKeyword]);

  React.useEffect(() => {
    if (initialSecondaryKeywords && initialSecondaryKeywords.length > 0) {
      setSecondaryKeywords(initialSecondaryKeywords.join(', '));
    }
  }, [initialSecondaryKeywords]);

  // States
  const [isResearching, setIsResearching] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [researchData, setResearchData] = useState<ResearchResult | null>(null);
  const [intentData, setIntentData] = useState<SearchIntentResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleRunResearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!keyword.trim()) return;

    setIsResearching(true);
    setError(null);

    try {
      const res = await api.conductResearch(keyword, country, language, audience, articleType, selectedModel);
      setResearchData(res.research);
      setIntentData(res.intent);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setIsResearching(false);
    }
  };

  const handleSaveOpenRouterKey = async () => {
    if (!openrouterKeyInput.trim()) return;
    setIsSavingKey(true);
    setKeySaveMessage(null);
    try {
      await api.saveByokKeys({ openrouterApiKey: openrouterKeyInput.trim() }, selectedModel);
      setByokConfigured(prev => ({ ...prev, openrouter: true }));
      setKeySaveMessage('OpenRouter key saved successfully!');
      setOpenrouterKeyInput('');
    } catch (err: any) {
      setKeySaveMessage(`Error: ${err.message}`);
    } finally {
      setIsSavingKey(false);
    }
  };

  const handleTestSelectedModel = async () => {
    setTestingModel(true);
    setTestResult(null);
    try {
      const res = await api.testModel(selectedModel, openrouterKeyInput.trim() || undefined);
      setTestResult({
        success: res.success,
        message: res.message || (res.success ? `Connected! Latency: ${res.latencyMs}ms` : 'Connection failed')
      });
    } catch (err: any) {
      setTestResult({ success: false, message: err.message });
    } finally {
      setTestingModel(false);
    }
  };

  const handleSelectTemplate = (templateId: WordRocketTemplateId) => {
    setSelectedTemplate(templateId);
    if (templateId === 'all-in-one-seo') {
      setArticleType('all-in-one-seo');
      setTargetWordCount(2500);
      setTone('authoritative');
    } else if (templateId === 'one-shot-blog') {
      setArticleType('one-shot-blog');
      setTargetWordCount(3200);
      setTone('authoritative');
    } else if (templateId === 'product-review') {
      setArticleType('review');
      setTargetWordCount(2100);
      setTone('conversational');
    } else if (templateId === 'how-to-guide') {
      setArticleType('how-to');
      setTargetWordCount(1900);
      setTone('instructional');
    } else if (templateId === 'case-study') {
      setArticleType('case-study');
      setTargetWordCount(2200);
      setTone('professional');
    } else if (templateId === 'content-refresh') {
      setArticleType('content-refresh');
      setTargetWordCount(2400);
      setTone('authoritative');
    }
  };

  // Live Token & Cost Calculations (WordRocket Core Engine)
  const estOutputTokens = Math.round(targetWordCount * 1.35);
  const estTotalTokens = estOutputTokens + 1600;
  const getEstimatedCost = () => {
    if (selectedModel.startsWith('gemini')) return '< $0.01';
    if (selectedModel.includes('deepseek-r1')) return '$0.02';
    if (selectedModel.includes('deepseek-chat')) return '$0.01';
    if (selectedModel.includes('claude-3.7')) return '$0.07';
    if (selectedModel.includes('claude-3.5')) return '$0.05';
    if (selectedModel.includes('o3-mini')) return '$0.03';
    if (selectedModel.includes('gpt-4o')) return '$0.06';
    if (selectedModel.includes('llama-3.3')) return '$0.01';
    return '$0.02';
  };

  const handleStartGeneration = async () => {
    if (!keyword.trim()) return;

    setIsGenerating(true);
    setError(null);

    const input: GenerationInput = {
      targetKeyword: keyword.trim(),
      secondaryKeywords: secondaryKeywords.split(',').map(s => s.trim()).filter(Boolean),
      country,
      language,
      audience,
      tone,
      articleType,
      targetWordCount,
      templatePreset: selectedTemplate,
      brandName,
      autoImprove,
      selectedModel,
      voiceNotes: voiceNotes.trim() || undefined,
      competitorUrls: competitorUrls.split('\n').map(u => u.trim()).filter(Boolean),
      enableSitemapInternalLinks: enableSitemapLinks,
      includeSerpAnalysis
    };

    try {
      const res = await api.startGeneration(input);
      setIsGenerating(false);
      if (res.success && res.job) {
        onJobStarted(res.job);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
      setIsGenerating(false);
    }
  };

  // Group models for selection
  const openRouterModels = availableModels.filter(m => m.id.startsWith('openrouter/') || m.provider.toLowerCase() === 'openrouter');
  const googleModels = availableModels.filter(m => m.id.startsWith('gemini') || m.provider.toLowerCase() === 'google');
  const openAiModels = availableModels.filter(m => m.id.startsWith('gpt') && !m.id.startsWith('openrouter/') && !m.id.startsWith('straico/'));
  const anthropicModels = availableModels.filter(m => m.id.startsWith('claude') && !m.id.startsWith('openrouter/') && !m.id.startsWith('straico/'));
  const otherModels = availableModels.filter(m => 
    !m.id.startsWith('openrouter/') && 
    !m.id.startsWith('gemini') && 
    !m.id.startsWith('gpt') && 
    !m.id.startsWith('claude')
  );

  const activeModelDetails = availableModels.find(m => m.id === selectedModel);
  const isOpenRouterModel = selectedModel.startsWith('openrouter/');
  const isOpenRouterKeyMissing = isOpenRouterModel && !byokConfigured.openrouter;

  return (
    <div className="space-y-8 max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      {/* Top Banner Notice */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-emerald-400" />
              SEO Content Generation Engine
            </h1>
            <p className="text-sm text-slate-400 mt-1">
              Human-first editorial architecture: Intent Analysis → Content Gap Scan → Outline → Writing → 100-pt SEO Audit → Schema → Pinterest.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-400 bg-slate-950/60 px-3 py-2 rounded-lg border border-slate-800">
            <Info className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Never promises #1 rankings; focuses purely on depth, search intent, accuracy, and user utility.</span>
          </div>
        </div>
      </div>

      {error && (
        <div id="generator-error-banner" className="p-4 rounded-xl bg-red-950/40 border border-red-800/60 text-red-300 text-sm flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
          <div className="flex-1 space-y-2">
            <div className="flex items-center justify-between">
              <div className="font-semibold text-red-200">Pipeline Notice</div>
              <button
                type="button"
                onClick={() => setError(null)}
                className="text-slate-400 hover:text-white transition-colors p-1"
                aria-label="Dismiss error"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="text-slate-300 text-xs sm:text-sm leading-relaxed">{error}</div>
            <div className="pt-1 flex flex-wrap items-center gap-2.5">
              <button
                type="button"
                id="btn-retry-research"
                onClick={() => handleRunResearch()}
                disabled={isResearching}
                className="px-3 py-1.5 bg-red-800/80 hover:bg-red-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm disabled:opacity-50"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isResearching ? 'animate-spin' : ''}`} />
                {isResearching ? 'Retrying Research...' : 'Retry Intent Research'}
              </button>
              <button
                type="button"
                id="btn-generate-anyway"
                onClick={handleStartGeneration}
                disabled={isGenerating}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 rounded-lg text-xs font-medium transition-colors disabled:opacity-50"
              >
                Start Generation Directly
              </button>
            </div>
          </div>
        </div>
      )}

      {/* WordRocket AI Templates & Target Configuration */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <Rocket className="w-4 h-4" />
              </span>
              <h2 className="text-base font-bold text-white tracking-tight">WordRocket AI Writing Presets</h2>
              <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-purple-950 text-purple-300 border border-purple-800/80">
                app.wordrocket.ai parity
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Select an algorithmic blueprint optimized for SERP rankings, long-form depth, or affiliate conversions.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <span className="text-xs text-slate-400 font-medium">Est. Cost:</span>
            <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-800 px-2.5 py-1 rounded-lg">
              {getEstimatedCost()}
            </span>
          </div>
        </div>

        {/* Template Selector Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {[
            {
              id: 'all-in-one-seo' as WordRocketTemplateId,
              title: 'All-in-One SEO Post',
              badge: 'Flagship',
              badgeColor: 'bg-emerald-950 text-emerald-300 border-emerald-800',
              icon: Rocket,
              description: 'Target keyword density, semantic entities, FAQ schema, snippet hooks & meta descriptions.',
              words: '2,500 words',
              targetCount: 2500
            },
            {
              id: 'one-shot-blog' as WordRocketTemplateId,
              title: 'One Shot Blog Post',
              badge: '3,000+ Words',
              badgeColor: 'bg-purple-950 text-purple-300 border-purple-800',
              icon: Zap,
              description: 'WordRocket signature single-prompt pillar synthesized with deep takeaways, tables & FAQs.',
              words: '3,200 words',
              targetCount: 3200
            },
            {
              id: 'product-review' as WordRocketTemplateId,
              title: 'Product Review & Roundup',
              badge: 'Affiliate Ready',
              badgeColor: 'bg-amber-950 text-amber-300 border-amber-800',
              icon: Target,
              description: 'Affiliate-ready comparison matrix, pros & cons, rating breakdown, verdict badge & CTAs.',
              words: '2,100 words',
              targetCount: 2100
            },
            {
              id: 'how-to-guide' as WordRocketTemplateId,
              title: 'Step-by-Step How-To',
              badge: 'Actionable',
              badgeColor: 'bg-blue-950 text-blue-300 border-blue-800',
              icon: Layers,
              description: 'Actionable chronological steps, prerequisite checklists, expert tips & troubleshooting.',
              words: '1,900 words',
              targetCount: 1900
            },
            {
              id: 'case-study' as WordRocketTemplateId,
              title: 'Case Study & Authority',
              badge: 'Research Citations',
              badgeColor: 'bg-cyan-950 text-cyan-300 border-cyan-800',
              icon: FileCheck,
              description: 'Empirical citations, methodology, key findings, data points & takeaway summary.',
              words: '2,200 words',
              targetCount: 2200
            },
            {
              id: 'content-refresh' as WordRocketTemplateId,
              title: 'Content Refresh / Rewriter',
              badge: 'SERP Reclaim',
              badgeColor: 'bg-rose-950 text-rose-300 border-rose-800',
              icon: RefreshCw,
              description: 'Re-optimizes existing articles with fresh data, missing competitor topics & modern SERP alignment.',
              words: '2,400 words',
              targetCount: 2400
            }
          ].map(t => {
            const isSelected = selectedTemplate === t.id;
            const Icon = t.icon;
            return (
              <div
                key={t.id}
                onClick={() => handleSelectTemplate(t.id)}
                className={`group cursor-pointer text-left p-4 rounded-xl border transition-all relative flex flex-col justify-between ${
                  isSelected
                    ? 'bg-slate-950 border-emerald-500 shadow-sm ring-1 ring-emerald-500/50'
                    : 'bg-slate-950/60 hover:bg-slate-950 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className={`p-1.5 rounded-lg border ${isSelected ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40' : 'bg-slate-900 text-slate-400 border-slate-800'}`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <span className="text-xs font-bold text-white group-hover:text-emerald-300 transition-colors">
                        {t.title}
                      </span>
                    </div>
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${t.badgeColor}`}>
                      {t.badge}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed line-clamp-2">
                    {t.description}
                  </p>
                </div>

                <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
                  <span className="text-slate-500 font-mono">Target: <strong className="text-slate-300">{t.words}</strong></span>
                  {isSelected && (
                    <span className="flex items-center gap-1 text-emerald-400 font-semibold">
                      <Check className="w-3.5 h-3.5" />
                      Active
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* WordRocket Target Length & Live Token/Cost Estimator */}
        <div className="p-4 rounded-xl bg-slate-950 border border-slate-800/90 space-y-3.5">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-slate-200 flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5 text-emerald-400" />
                Target Word Count Target
              </div>
              <div className="text-[11px] text-slate-400">
                WordRocket expands section depth and subtopic synthesis to fulfill your exact length requirements.
              </div>
            </div>

            {/* Word Count Pills */}
            <div className="flex flex-wrap items-center gap-1.5">
              {[
                { words: 1500, label: '1,500w (Standard)' },
                { words: 2500, label: '2,500w (SEO Pillar)' },
                { words: 3200, label: '3,200w (WordRocket Mega)' },
                { words: 4500, label: '4,500w (Masterclass)' }
              ].map(w => (
                <button
                  key={w.words}
                  type="button"
                  onClick={() => setTargetWordCount(w.words)}
                  className={`text-xs px-2.5 py-1.5 rounded-lg font-medium transition-all ${
                    targetWordCount === w.words
                      ? 'bg-emerald-600 text-white font-semibold shadow-sm'
                      : 'bg-slate-900 hover:bg-slate-850 text-slate-300 border border-slate-800'
                  }`}
                >
                  {w.label}
                </button>
              ))}

              <div className="flex items-center gap-1 pl-1">
                <input
                  type="number"
                  min="800"
                  max="10000"
                  step="100"
                  value={targetWordCount}
                  onChange={(e) => setTargetWordCount(Math.max(500, Number(e.target.value)))}
                  className="w-20 bg-slate-900 border border-slate-800 rounded-lg px-2 py-1 text-xs text-white font-mono text-center focus:outline-none focus:border-emerald-500"
                />
                <span className="text-xs text-slate-500">words</span>
              </div>
            </div>
          </div>

          {/* Real-time Token & Live Cost Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-slate-800/80 text-xs">
            <div className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800/80">
              <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Estimated Tokens</span>
              <span className="text-sm font-semibold font-mono text-slate-200">
                ~{estTotalTokens.toLocaleString()}
              </span>
            </div>

            <div className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800/80">
              <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Estimated Cost</span>
              <span className="text-sm font-semibold font-mono text-emerald-400">
                {getEstimatedCost()}
              </span>
            </div>

            <div className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800/80">
              <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Est. Completion</span>
              <span className="text-sm font-semibold font-mono text-slate-200">
                {targetWordCount > 3000 ? '~35-45s' : '~20-30s'}
              </span>
            </div>

            <div className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800/80">
              <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Model Target</span>
              <span className="text-xs font-semibold text-purple-300 truncate block" title={activeModelDetails?.name || selectedModel}>
                {activeModelDetails?.name || selectedModel.split('/').pop()}
              </span>
            </div>
          </div>

          {/* WordRocket Core Integrations (SERP Search & Sitemap Linking) */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2 border-t border-slate-800/80">
            <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-300">
              <input
                type="checkbox"
                checked={includeSerpAnalysis}
                onChange={(e) => setIncludeSerpAnalysis(e.target.checked)}
                className="w-4 h-4 rounded text-emerald-500 bg-slate-900 border-slate-700 focus:ring-emerald-500"
              />
              <span className="flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-blue-400" />
                <span>AI Research Engine (Live Google SERP & Topical Gap Scanner)</span>
              </span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-300">
              <input
                type="checkbox"
                checked={enableSitemapLinks}
                onChange={(e) => setEnableSitemapLinks(e.target.checked)}
                className="w-4 h-4 rounded text-emerald-500 bg-slate-900 border-slate-700 focus:ring-emerald-500"
              />
              <span className="flex items-center gap-1.5">
                <Link2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Auto-Link from Sitemap ({sitemapUrlCount} indexed pages)</span>
              </span>
            </label>
          </div>
        </div>
      </div>

      {/* Main Form Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Form: Inputs */}
        <div className="lg:col-span-6 space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-5">
            <h2 className="text-base font-semibold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
              <Search className="w-4 h-4 text-emerald-400" />
              Keyword & Strategy Inputs
            </h2>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                Primary Target Keyword *
              </label>
              <div className="relative">
                <input
                  id="primary-keyword-input"
                  type="text"
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  placeholder="e.g. easy chicken dinner recipes"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500 transition-colors"
                />
              </div>
              <p className="text-xs text-slate-500 mt-1">Single focal topic for intent satisfaction and organic discovery.</p>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                Secondary Keywords (Comma-separated)
              </label>
              <input
                id="secondary-keywords-input"
                type="text"
                value={secondaryKeywords}
                onChange={(e) => setSecondaryKeywords(e.target.value)}
                placeholder="e.g. quick weeknight meals, 30 minute chicken"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            {/* AI Model Selector Section */}
            <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-200 flex items-center gap-1.5">
                  <Bot className="w-4 h-4 text-purple-400" />
                  AI Generation Engine
                </label>
                <div className="flex items-center gap-1.5">
                  {isOpenRouterModel ? (
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-purple-950/80 border border-purple-800/80 text-purple-300 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse" />
                      OpenRouter Engine
                    </span>
                  ) : (
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-950/80 border border-emerald-800/80 text-emerald-300">
                      {activeModelDetails?.provider || 'Direct'} Engine
                    </span>
                  )}
                </div>
              </div>

              {/* Quick Select Trending OpenRouter & Top Models */}
              <div className="flex flex-wrap gap-1.5 pb-1">
                <span className="text-[10px] text-slate-500 self-center mr-1">Trending:</span>
                {[
                  { id: 'openrouter/anthropic/claude-sonnet-5', label: 'Claude Sonnet 5', tag: 'Flagship' },
                  { id: 'openrouter/anthropic/claude-opus-5', label: 'Claude Opus 5', tag: 'Max IQ' },
                  { id: 'openrouter/anthropic/claude-sonnet-4.6', label: 'Claude 4.6', tag: '1M Ctx' },
                  { id: 'openrouter/anthropic/claude-sonnet-4.5', label: 'Claude 4.5', tag: 'Coding' },
                  { id: 'openrouter/anthropic/claude-3.7-sonnet', label: 'Claude 3.7', tag: 'Hybrid' },
                  { id: 'openrouter/deepseek/deepseek-r1', label: 'DeepSeek R1', tag: 'Reasoning' },
                  { id: 'openrouter/deepseek/deepseek-chat', label: 'DeepSeek V3', tag: 'Fast' },
                  { id: 'openrouter/openai/o3-mini', label: 'o3-mini', tag: 'STEM' },
                  { id: 'gemini-3.8-flash', label: 'Gemini 3.8', tag: 'Search' }
                ].map(pill => (
                  <button
                    key={pill.id}
                    type="button"
                    onClick={() => {
                      setSelectedModel(pill.id);
                      setTestResult(null);
                    }}
                    className={`text-[11px] px-2.5 py-1 rounded-lg font-medium transition-all flex items-center gap-1 ${
                      selectedModel === pill.id
                        ? 'bg-purple-600 text-white font-semibold shadow-sm ring-1 ring-purple-400'
                        : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800'
                    }`}
                  >
                    <span>{pill.label}</span>
                    <span className={`text-[9px] px-1 rounded ${
                      selectedModel === pill.id ? 'bg-purple-800 text-purple-200' : 'bg-slate-800 text-slate-400'
                    }`}>
                      {pill.tag}
                    </span>
                  </button>
                ))}
              </div>

              {/* Main Model Dropdown */}
              <div className="relative">
                <select
                  id="model-selector-dropdown"
                  value={selectedModel}
                  onChange={(e) => {
                    setSelectedModel(e.target.value);
                    setTestResult(null);
                  }}
                  className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-purple-500 transition-colors cursor-pointer font-medium"
                >
                  <optgroup label="OpenRouter AI Models (Latest)">
                    {openRouterModels.map(m => (
                      <option key={m.id} value={m.id}>
                        ⚡ {m.name} — {m.contextWindow} ({m.costPer1kWords || 'Pay-as-you-go'})
                      </option>
                    ))}
                  </optgroup>
                  <optgroup label="Google Gemini">
                    {googleModels.map(m => (
                      <option key={m.id} value={m.id}>
                        🌐 {m.name} — {m.contextWindow} ({m.costPer1kWords})
                      </option>
                    ))}
                  </optgroup>
                  <optgroup label="OpenAI Direct">
                    {openAiModels.map(m => (
                      <option key={m.id} value={m.id}>
                        🤖 {m.name} — {m.contextWindow} ({m.costPer1kWords})
                      </option>
                    ))}
                  </optgroup>
                  <optgroup label="Anthropic Direct">
                    {anthropicModels.map(m => (
                      <option key={m.id} value={m.id}>
                        ✍️ {m.name} — {m.contextWindow} ({m.costPer1kWords})
                      </option>
                    ))}
                  </optgroup>
                  {otherModels.length > 0 && (
                    <optgroup label="Other Providers">
                      {otherModels.map(m => (
                        <option key={m.id} value={m.id}>
                          {m.name}
                        </option>
                      ))}
                    </optgroup>
                  )}
                </select>
              </div>

              {/* Selected Model Highlight Card */}
              {activeModelDetails && (
                <div className="p-3 rounded-lg bg-slate-900/90 border border-slate-800 text-xs space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-slate-200 flex items-center gap-1.5">
                      <Cpu className="w-3.5 h-3.5 text-purple-400" />
                      {activeModelDetails.name}
                    </span>
                    <div className="flex items-center gap-2 text-[11px] text-slate-400">
                      <span>Context: <strong className="text-slate-300">{activeModelDetails.contextWindow}</strong></span>
                      {activeModelDetails.costPer1kWords && (
                        <span>• Cost: <strong className="text-emerald-400">{activeModelDetails.costPer1kWords}/1k</strong></span>
                      )}
                    </div>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    {activeModelDetails.bestFor || activeModelDetails.description || 'Optimized for high-intent SEO content synthesis and structural depth.'}
                  </p>

                  <div className="flex items-center justify-between pt-1 border-t border-slate-800/80">
                    <button
                      type="button"
                      onClick={handleTestSelectedModel}
                      disabled={testingModel}
                      className="text-[11px] font-semibold text-purple-400 hover:text-purple-300 flex items-center gap-1 disabled:opacity-50"
                    >
                      <RefreshCw className={`w-3 h-3 ${testingModel ? 'animate-spin' : ''}`} />
                      {testingModel ? 'Pinging Model...' : 'Test Connection'}
                    </button>
                    {testResult && (
                      <span className={`text-[10px] font-mono px-2 py-0.5 rounded ${
                        testResult.success ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' : 'bg-red-950 text-red-300 border border-red-800'
                      }`}>
                        {testResult.message}
                      </span>
                    )}
                  </div>
                </div>
              )}

              {/* OpenRouter API Key Notice & Inline Entry if missing */}
              {isOpenRouterKeyMissing && (
                <div className="p-3 rounded-lg bg-purple-950/40 border border-purple-800/60 space-y-2">
                  <div className="flex items-center justify-between text-xs text-purple-300">
                    <span className="flex items-center gap-1.5 font-semibold">
                      <Key className="w-3.5 h-3.5 text-purple-400" />
                      OpenRouter API Key Required
                    </span>
                    <span className="text-[10px] text-purple-400">BYOK</span>
                  </div>
                  <p className="text-[11px] text-purple-300/80">
                    To generate with this OpenRouter model, enter your OpenRouter key below (or configure it in Settings):
                  </p>
                  <div className="flex gap-2">
                    <input
                      type="password"
                      value={openrouterKeyInput}
                      onChange={(e) => setOpenrouterKeyInput(e.target.value)}
                      placeholder="sk-or-v1-..."
                      className="flex-1 bg-slate-900 border border-purple-700/60 rounded-lg px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-400"
                    />
                    <button
                      type="button"
                      onClick={handleSaveOpenRouterKey}
                      disabled={isSavingKey || !openrouterKeyInput.trim()}
                      className="px-3 py-1.5 bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white rounded-lg text-xs font-semibold transition-colors"
                    >
                      {isSavingKey ? 'Saving...' : 'Save Key'}
                    </button>
                  </div>
                  {keySaveMessage && (
                    <div className="text-[11px] text-emerald-400 flex items-center gap-1">
                      <Check className="w-3 h-3" />
                      {keySaveMessage}
                    </div>
                  )}
                </div>
              )}

              {isOpenRouterModel && byokConfigured.openrouter && (
                <div className="flex items-center gap-1.5 text-[11px] text-emerald-400/90 pt-0.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>OpenRouter API Key is active & ready for generation.</span>
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                  Country / Market
                </label>
                <select
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                >
                  <option>United States</option>
                  <option>United Kingdom</option>
                  <option>Canada</option>
                  <option>Australia</option>
                  <option>Germany</option>
                  <option>France</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                  Language
                </label>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                >
                  <option>English</option>
                  <option>Spanish</option>
                  <option>French</option>
                  <option>German</option>
                  <option>Italian</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                  Article Type
                </label>
                <select
                  value={articleType}
                  onChange={(e) => {
                    const val = e.target.value as ArticleType;
                    setArticleType(val);
                    if (val === 'all-in-one-seo' || val === 'one-shot-blog' || val === 'case-study' || val === 'content-refresh') {
                      setSelectedTemplate(val as WordRocketTemplateId);
                    } else if (val === 'review') {
                      setSelectedTemplate('product-review');
                    } else if (val === 'how-to') {
                      setSelectedTemplate('how-to-guide');
                    }
                  }}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                >
                  <option value="all-in-one-seo">⚡ All-in-One SEO Post (WordRocket)</option>
                  <option value="one-shot-blog">🚀 One Shot Blog Post (3,000+ words)</option>
                  <option value="review">🛍️ Hands-On Product Review</option>
                  <option value="how-to">📋 Step-by-Step How-To Guide</option>
                  <option value="case-study">📊 Case Study & Authority Paper</option>
                  <option value="content-refresh">🔄 Content Refresh & Rewriter</option>
                  <option value="ultimate-guide">Comprehensive Ultimate Guide</option>
                  <option value="recipe">Recipe & Culinary Guide</option>
                  <option value="listicle">Curated Listicle / Roundup</option>
                  <option value="comparison">Side-by-Side Comparison</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                  Brand Name
                </label>
                <input
                  type="text"
                  value={brandName}
                  onChange={(e) => setBrandName(e.target.value)}
                  placeholder="e.g. AI SEO Studio"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                Target Audience
              </label>
              <input
                type="text"
                value={audience}
                onChange={(e) => setAudience(e.target.value)}
                placeholder="e.g. Busy parents looking for fast, nutritious dinners"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                Editorial Tone
              </label>
              <input
                type="text"
                value={tone}
                onChange={(e) => setTone(e.target.value as ToneType)}
                placeholder="e.g. authoritative, conversational, instructional"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            {/* Senior Content Writer & SME Engine Controls */}
            <div className="p-4 rounded-xl bg-slate-900/60 border border-emerald-900/40 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-emerald-950 border border-emerald-800/80 flex items-center justify-center text-emerald-400">
                    <Award className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-emerald-300 flex items-center gap-1.5">
                      <span>Senior Practitioner & SME Human Engine</span>
                      <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-900/70 text-emerald-200">Active</span>
                    </div>
                    <div className="text-[11px] text-slate-400">
                      Step 1-5 intent satisfaction, 40+ banned AI tells scrubbed, direct 2-3 sentence answer up top.
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setShowPromptDetails(!showPromptDetails)}
                  className="text-[11px] font-medium text-emerald-400 hover:text-emerald-300 underline underline-offset-2 flex items-center gap-1"
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  {showPromptDetails ? 'Hide Rules' : 'Inspect Rules'}
                </button>
              </div>

              {showPromptDetails && (
                <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-[11px] text-slate-300 space-y-2 leading-relaxed">
                  <div className="font-semibold text-emerald-400">Built-in Protocol Standards:</div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-slate-400">
                    <div className="flex items-start gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                      <span><strong>Step 1 (Intent):</strong> Direct answer in first 2-3 sentences. No fluff.</span>
                    </div>
                    <div className="flex items-start gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                      <span><strong>Step 2 (Structure):</strong> Natural keyword placement, short paragraphs (2-4 sentences).</span>
                    </div>
                    <div className="flex items-start gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                      <span><strong>Step 3 (Anti-AI Slop):</strong> Banned: delve, tapestry, landscape, leverage, robust, paramount, etc.</span>
                    </div>
                    <div className="flex items-start gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                      <span><strong>Step 4 (E-E-A-T):</strong> Real trade-offs, benchmarks, and practitioner edge cases.</span>
                    </div>
                  </div>
                </div>
              )}

              <div className="space-y-2 pt-1">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                    Point of View / Brand Voice Notes (Optional)
                  </label>
                  <input
                    type="text"
                    value={voiceNotes}
                    onChange={(e) => setVoiceNotes(e.target.value)}
                    placeholder="e.g. Senior engineer who has done this for years. Smart, slightly opinionated human in a hurry."
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                    Competing Pages to Beat (Optional URLs, one per line)
                  </label>
                  <textarea
                    rows={2}
                    value={competitorUrls}
                    onChange={(e) => setCompetitorUrls(e.target.value)}
                    placeholder="https://competitor.com/article&#10;https://ranking-site.org/guide"
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 font-mono text-[11px]"
                  />
                </div>
              </div>
            </div>

            {/* Primary Visuals Engine (Seedream 4.5) */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-purple-950/20 border border-purple-900/40">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-purple-900/50 border border-purple-700/50 flex items-center justify-center text-purple-300 shrink-0">
                  <Camera className="w-3.5 h-3.5" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-purple-200 flex items-center gap-1.5">
                    <span>Primary Image Engine: Seedream 4.5</span>
                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-purple-900/80 text-purple-300 font-mono">OpenRouter</span>
                  </div>
                  <div className="text-[11px] text-slate-400">Automatic 2K intent-matched visuals for hero & all H2/H3 sections.</div>
                </div>
              </div>
              <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
                byokConfigured.openrouter ? 'bg-emerald-950/80 text-emerald-300 border-emerald-800' : 'bg-slate-900 text-slate-400 border-slate-700'
              }`}>
                {byokConfigured.openrouter ? 'Direct 2K' : 'Ready'}
              </span>
            </div>

            {/* Auto-Improve Toggle */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950/60 border border-slate-800">
              <div>
                <div className="text-xs font-semibold text-slate-200">Automatic SEO Improvement</div>
                <div className="text-xs text-slate-400">Iteratively refines draft (up to 3 passes) if audit score is below 85/100.</div>
              </div>
              <input
                type="checkbox"
                checked={autoImprove}
                onChange={(e) => setAutoImprove(e.target.checked)}
                className="w-4 h-4 rounded text-emerald-500 bg-slate-900 border-slate-700 focus:ring-emerald-500"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                id="research-button"
                type="button"
                onClick={handleRunResearch}
                disabled={isResearching}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-slate-700 bg-slate-800 hover:bg-slate-750 text-white font-medium text-sm transition-all disabled:opacity-50"
              >
                <Search className="w-4 h-4 text-emerald-400" />
                <span>{isResearching ? 'Analyzing Intent & SERP...' : 'Step 1: Research & Intent'}</span>
              </button>

              <button
                id="generate-article-button"
                type="button"
                onClick={handleStartGeneration}
                disabled={isGenerating}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-slate-950 font-bold text-sm shadow-lg shadow-emerald-950/40 transition-all disabled:opacity-50"
              >
                <Sparkles className="w-4 h-4" />
                <span>{isGenerating ? 'Scheduling Job...' : 'Step 2: Generate Full Article'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Form: Research & Intent Intelligence Panel */}
        <div className="lg:col-span-6 space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 min-h-[460px] flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
                <h2 className="text-base font-semibold text-white flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-emerald-400" />
                  Live Research & Search Intent Diagnosis
                </h2>
                {researchData && (
                  <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                    researchData.isLiveResearchAvailable
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                      : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                  }`}>
                    {researchData.isLiveResearchAvailable ? 'Live Grounding Active' : 'Transparent Standby'}
                  </span>
                )}
              </div>

              {!researchData && !isResearching && (
                <div className="py-16 text-center text-slate-500 space-y-3">
                  <Search className="w-10 h-10 mx-auto text-slate-600 stroke-[1.5]" />
                  <p className="text-sm">Click "Step 1: Research & Intent" to inspect search intent, competitor content gaps, and common user questions before generating.</p>
                </div>
              )}

              {isResearching && (
                <div className="py-16 text-center space-y-4">
                  <div className="w-8 h-8 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin mx-auto" />
                  <p className="text-sm text-slate-400">Grounding query with Gemini and analyzing SERP content gaps...</p>
                </div>
              )}

              {researchData && (
                <div className="space-y-4 text-xs">
                  {/* Notice Box */}
                  <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 text-slate-400">
                    <span className="font-semibold text-slate-300">Provider Status:</span> {researchData.providerNotice}
                  </div>

                  {/* Intent Diagnosis */}
                  {intentData && (
                    <div className="p-3 rounded-xl bg-emerald-950/20 border border-emerald-800/40 text-emerald-300">
                      <div className="flex items-center justify-between font-semibold text-sm text-emerald-200 mb-1">
                        <span>Search Intent: {intentData.primaryIntent.toUpperCase()}</span>
                        <span className="text-xs uppercase px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300">
                          {intentData.expectedDepth} Depth
                        </span>
                      </div>
                      <p className="text-emerald-300/80">{intentData.userGoal}</p>
                    </div>
                  )}

                  {/* Content Gaps to Capitalize On */}
                  {researchData.contentGaps && (
                    <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
                      <div className="font-semibold text-slate-200 text-xs uppercase tracking-wider flex items-center gap-1.5">
                        <FileCheck className="w-3.5 h-3.5 text-emerald-400" />
                        Identified Competitor Content Gaps
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-400">
                        <div className="p-2 rounded bg-slate-900/60 border border-slate-800/60">
                          <span className="text-amber-400 font-medium block mb-1">Missed Topics:</span>
                          <ul className="list-disc pl-4 space-y-0.5">
                            {(researchData.contentGaps.topicsMissed || []).slice(0, 3).map((t, i) => (
                              <li key={i}>{t}</li>
                            ))}
                          </ul>
                        </div>
                        <div className="p-2 rounded bg-slate-900/60 border border-slate-800/60">
                          <span className="text-emerald-400 font-medium block mb-1">Required Visuals & Tables:</span>
                          <ul className="list-disc pl-4 space-y-0.5">
                            {(researchData.contentGaps.tablesNeeded || []).slice(0, 2).map((t, i) => (
                              <li key={i}>{t}</li>
                            ))}
                            {(researchData.contentGaps.visualOpportunities || []).slice(0, 2).map((v, i) => (
                              <li key={i}>{v}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Questions to Answer */}
                  {researchData.commonQuestions && researchData.commonQuestions.length > 0 && (
                    <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800">
                      <span className="font-semibold text-slate-200 text-xs uppercase tracking-wider block mb-2">
                        Common User Questions (P.A.A. & Forums)
                      </span>
                      <ul className="space-y-1 text-slate-400">
                        {researchData.commonQuestions.slice(0, 4).map((q, i) => (
                          <li key={i} className="flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                            <span>{q}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Bottom Callout */}
            <div className="pt-4 border-t border-slate-800/60 flex items-center justify-between text-xs text-slate-500">
              <span>Next Stage: Background Asynchronous Generation</span>
              <button
                type="button"
                onClick={() => onViewArticle('art_sample_1')}
                className="text-emerald-400 hover:text-emerald-300 font-medium flex items-center gap-1"
              >
                <span>View Sample Article</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
