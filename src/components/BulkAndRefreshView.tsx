import React, { useState, useEffect } from 'react';
import {
  Layers,
  RefreshCw,
  UploadCloud,
  FileSpreadsheet,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Sparkles,
  FileText,
  Send,
  Database,
  Check,
  Bot,
  Cpu
} from 'lucide-react';
import { api } from '../api.js';
import { AIModelDescriptor } from '../types.js';

interface BulkAndRefreshViewProps {
  onRefreshJobs: () => void;
  onNavigateToJobs: () => void;
}

const SAMPLE_20_TOPICS_CSV = `keyword,category,intent
best lightweight running shoes 2026,Fitness,roundup
how to start intermittent fasting for beginners,Health,how-to
top productivity apps for remote teams,Technology,roundup
keto meal plan for fast weight loss,Nutrition,recipe
how to rank on google ai overviews,SEO,guide
best mirrorless cameras for travel vlogging,Photography,review
diy home office acoustic soundproofing,Home Improvement,how-to
sustainable minimalist wardrobe essentials,Fashion,roundup
how to train for your first marathon,Running,how-to
best mechanical keyboards for software engineers,Tech Gear,roundup
indoor plant care guide for low light rooms,Gardening,guide
best high yield savings accounts explained,Finance,informational
how to make sourdough bread from scratch,Baking,recipe
guide to solar panel tax credits 2026,Energy,guide
top project management software compared,Business,roundup
best air purifier for allergies and pets,Appliances,review
how to optimize blog posts for perplexity citations,SEO,guide
beginner strength training routine at home,Fitness,how-to
best cold brew coffee makers tested,Kitchen,roundup
how to start a podcast on a budget,Media,guide
cybersecurity best practices for remote workers,Tech,informational`;

export const BulkAndRefreshView: React.FC<BulkAndRefreshViewProps> = ({
  onRefreshJobs,
  onNavigateToJobs
}) => {
  const [activeTab, setActiveTab] = useState<'bulk' | 'refresh' | 'bulk_wp'>('bulk');

  // Bulk State
  const [csvText, setCsvText] = useState(SAMPLE_20_TOPICS_CSV);
  const [isUploadingBulk, setIsUploadingBulk] = useState(false);
  const [bulkResult, setBulkResult] = useState<{ totalQueued: number; notice?: string } | null>(null);
  const [availableModels, setAvailableModels] = useState<AIModelDescriptor[]>([]);
  const [selectedBulkModel, setSelectedBulkModel] = useState<string>('gemini-3.8-flash');

  useEffect(() => {
    const fetchModels = async () => {
      try {
        const res = await api.getModels();
        if (res.availableModels && res.availableModels.length > 0) {
          setAvailableModels(res.availableModels);
        }
        if (res.activeModel) {
          setSelectedBulkModel(res.activeModel);
        }
      } catch (err) {
        console.warn('Failed to load models for bulk view:', err);
      }
    };
    fetchModels();
  }, []);

  // Bulk WordPress State
  const [wpSyncStatus, setWpSyncStatus] = useState<'draft' | 'publish'>('draft');
  const [isSyncingWp, setIsSyncingWp] = useState(false);
  const [wpSyncResult, setWpSyncResult] = useState<any | null>(null);

  // Refresh State
  const [refreshKeyword, setRefreshKeyword] = useState('easy weeknight chicken recipes');
  const [existingContent, setExistingContent] = useState(
    `# Quick Weeknight Chicken Meals\n\nChicken is great for dinner. Cook chicken in a pan for 10 minutes until done. Serve with vegetables or potatoes. Make sure it's cooked through so it's safe to eat. Enjoy your quick dinner!`
  );
  const [isAnalyzingRefresh, setIsAnalyzingRefresh] = useState(false);
  const [refreshAnalysis, setRefreshAnalysis] = useState<any | null>(null);

  const handleBulkUpload = async () => {
    setIsUploadingBulk(true);
    setBulkResult(null);
    try {
      const res = await api.uploadBulk(csvText, undefined, selectedBulkModel);
      setBulkResult({
        totalQueued: res.totalQueued,
        notice: res.notice
      });
      onRefreshJobs();
    } catch (err) {
      alert('Bulk upload failed: ' + (err instanceof Error ? err.message : String(err)));
    } finally {
      setIsUploadingBulk(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) setCsvText(content);
    };
    reader.readAsText(file);
  };

  const handleBulkPublishWp = async () => {
    setIsSyncingWp(true);
    setWpSyncResult(null);
    try {
      const res = await api.publishAllToWordPress(wpSyncStatus);
      setWpSyncResult(res);
      onRefreshJobs();
    } catch (err: any) {
      setWpSyncResult({ error: err.message });
    } finally {
      setIsSyncingWp(false);
    }
  };

  const handleRunRefresh = async () => {
    setIsAnalyzingRefresh(true);
    setRefreshAnalysis(null);
    try {
      const res = await api.refreshContent(existingContent, refreshKeyword);
      setRefreshAnalysis(res.analysis);
    } catch (err) {
      alert('Refresh analysis failed: ' + (err instanceof Error ? err.message : String(err)));
    } finally {
      setIsAnalyzingRefresh(false);
    }
  };

  const lineCount = csvText.split('\n').filter(l => l.trim() && !l.startsWith('keyword')).length;

  return (
    <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 space-y-6">
      {/* Header & Sub-Tabs */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-xl font-bold text-white flex items-center gap-2">
              <Layers className="w-5 h-5 text-emerald-400" />
              Scale & Workflow Engine
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              20+ Article Bulk Pipeline
            </span>
          </div>
          <p className="text-sm text-slate-400">
            Generate 20+ articles at once via CSV, push bulk articles to WordPress in one click, and refresh legacy content for AI search engines.
          </p>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto">
          <button
            onClick={() => setActiveTab('bulk')}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
              activeTab === 'bulk'
                ? 'bg-emerald-600 text-slate-950 font-bold'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            Bulk 20+ CSV Generator
          </button>
          <button
            onClick={() => setActiveTab('bulk_wp')}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors flex items-center gap-1.5 ${
              activeTab === 'bulk_wp'
                ? 'bg-emerald-600 text-slate-950 font-bold'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <Database className="w-3.5 h-3.5" />
            <span>1-Click WP Sync</span>
          </button>
          <button
            onClick={() => setActiveTab('refresh')}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
              activeTab === 'refresh'
                ? 'bg-emerald-600 text-slate-950 font-bold'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            Content Refresh
          </button>
        </div>
      </div>

      {/* MODULE 1: BULK GENERATOR */}
      {activeTab === 'bulk' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <FileSpreadsheet className="w-5 h-5 text-emerald-400" />
                Bulk Article Queue ({lineCount} articles ready)
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Upload or paste a CSV list of keywords to synthesize comprehensive articles asynchronously.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <label className="cursor-pointer px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors flex items-center gap-1.5">
                <UploadCloud className="w-3.5 h-3.5 text-emerald-400" />
                <span>Upload .CSV File</span>
                <input type="file" accept=".csv" onChange={handleFileUpload} className="hidden" />
              </label>

              <button
                type="button"
                onClick={() => setCsvText(SAMPLE_20_TOPICS_CSV)}
                className="px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
              >
                Reset 20 Topics Sample
              </button>
            </div>
          </div>

          <div className="space-y-4">
            <textarea
              value={csvText}
              onChange={(e) => setCsvText(e.target.value)}
              rows={12}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 font-mono text-xs text-white focus:outline-none focus:border-emerald-500"
            />

            {/* Model Selector for Bulk Pipeline */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-xl bg-slate-950/80 border border-slate-800">
              <div className="flex items-center gap-2">
                <Bot className="w-4 h-4 text-purple-400" />
                <span className="text-xs font-semibold text-slate-200">AI Model for Batch:</span>
              </div>
              <div className="flex-1 max-w-md">
                <select
                  value={selectedBulkModel}
                  onChange={(e) => setSelectedBulkModel(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-purple-500 font-medium"
                >
                  <optgroup label="OpenRouter AI Models (Latest)">
                    {availableModels.filter(m => m.id.startsWith('openrouter/')).map(m => (
                      <option key={m.id} value={m.id}>
                        ⚡ {m.name} ({m.costPer1kWords || 'BYOK'})
                      </option>
                    ))}
                  </optgroup>
                  <optgroup label="Google Gemini">
                    {availableModels.filter(m => m.id.startsWith('gemini')).map(m => (
                      <option key={m.id} value={m.id}>
                        🌐 {m.name}
                      </option>
                    ))}
                  </optgroup>
                  <optgroup label="Direct Providers (OpenAI / Anthropic)">
                    {availableModels.filter(m => !m.id.startsWith('openrouter/') && !m.id.startsWith('gemini')).map(m => (
                      <option key={m.id} value={m.id}>
                        {m.name}
                      </option>
                    ))}
                  </optgroup>
                </select>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-950/70 p-3.5 rounded-xl border border-slate-800">
              <div className="text-xs text-slate-400 space-y-0.5">
                <div><strong className="text-slate-200">Scale Control:</strong> Enqueues {lineCount} articles with rate-limiting backoff.</div>
                <div className="text-slate-500 text-[11px]">Each article conducts live research, structures headings, synthesizes FAQs, and prepares metadata.</div>
              </div>

              <button
                onClick={handleBulkUpload}
                disabled={isUploadingBulk || lineCount === 0}
                className="flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold text-xs transition-colors disabled:opacity-50 whitespace-nowrap"
              >
                <UploadCloud className="w-4 h-4" />
                <span>{isUploadingBulk ? 'Enqueuing Articles...' : `Enqueue ${lineCount} Articles Now`}</span>
              </button>
            </div>
          </div>

          {bulkResult && (
            <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-800/60 text-emerald-300 text-xs flex items-center justify-between">
              <div>
                <strong>Batch Enqueued Successfully:</strong> {bulkResult.totalQueued} jobs queued in background worker.
                {bulkResult.notice && <span className="ml-2 text-amber-300">({bulkResult.notice})</span>}
              </div>
              <button
                onClick={onNavigateToJobs}
                className="text-emerald-400 underline font-semibold ml-3"
              >
                Inspect Queue Modal
              </button>
            </div>
          )}
        </div>
      )}

      {/* MODULE 2: ONE-CLICK BULK WORDPRESS PUBLISHING */}
      {activeTab === 'bulk_wp' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
          <div className="border-b border-slate-800 pb-4">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Database className="w-5 h-5 text-emerald-400" />
              One-Click Bulk WordPress Sync
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Synchronize all completed articles to your connected WordPress site in one batch, with Yoast/RankMath SEO titles, descriptions, schema, and featured images intact.
            </p>
          </div>

          <div className="bg-slate-950/80 border border-slate-800 p-5 rounded-xl space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Target WordPress Post Status</label>
                <select
                  value={wpSyncStatus}
                  onChange={(e) => setWpSyncStatus(e.target.value as any)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                >
                  <option value="draft">Draft (Safe - Requires human approval in WP Admin)</option>
                  <option value="publish">Publish (Direct Live on Blog)</option>
                </select>
              </div>

              <div className="flex items-end">
                <button
                  type="button"
                  onClick={handleBulkPublishWp}
                  disabled={isSyncingWp}
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold text-xs transition-colors disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                  <span>{isSyncingWp ? 'Publishing All to WordPress...' : `Publish All Articles as ${wpSyncStatus.toUpperCase()}`}</span>
                </button>
              </div>
            </div>

            {wpSyncResult && (
              <div className="mt-4 p-4 rounded-xl bg-slate-900 border border-slate-800 text-xs space-y-2">
                {wpSyncResult.error ? (
                  <div className="text-red-400">Notice: {wpSyncResult.error}</div>
                ) : (
                  <div>
                    <div className="font-bold text-emerald-400 flex items-center gap-1.5 mb-2">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Processed {wpSyncResult.totalProcessed} articles ({wpSyncResult.successful} successful)</span>
                    </div>
                    <div className="space-y-1.5 max-h-48 overflow-y-auto">
                      {(wpSyncResult.results || []).map((r: any, idx: number) => (
                        <div key={idx} className="flex items-center justify-between p-2 rounded bg-slate-950 border border-slate-800/80 text-[11px]">
                          <span className="text-slate-200 truncate max-w-sm">{r.title}</span>
                          <span className={r.success ? 'text-emerald-400' : 'text-red-400'}>
                            {r.success ? `Synced (ID: ${r.postId || 'OK'})` : r.error || 'Failed'}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* MODULE 3: CONTENT REFRESH */}
      {activeTab === 'refresh' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
          <div className="border-b border-slate-800 pb-4">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <RefreshCw className="w-5 h-5 text-emerald-400" />
              Existing Content Refresh & Gap Diagnosis
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Analyze legacy WordPress articles: spot outdated facts, weak hooks, shallow paragraphs, and missing FAQs to reclaim lost search rankings.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1">
                  Target Focal Keyword
                </label>
                <input
                  type="text"
                  value={refreshKeyword}
                  onChange={(e) => setRefreshKeyword(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1">
                  Existing Article Content (Markdown or Raw Text)
                </label>
                <textarea
                  value={existingContent}
                  onChange={(e) => setExistingContent(e.target.value)}
                  rows={10}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 font-mono text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <button
                onClick={handleRunRefresh}
                disabled={isAnalyzingRefresh || !existingContent.trim()}
                className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold text-xs transition-colors disabled:opacity-50"
              >
                {isAnalyzingRefresh ? 'Auditing Content...' : 'Run Content Refresh Audit'}
              </button>
            </div>

            {/* Refresh Diagnostics Result */}
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-5 space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 border-b border-slate-800 pb-2">
                Refresh Audit Recommendations
              </h3>

              {!refreshAnalysis && !isAnalyzingRefresh && (
                <div className="py-16 text-center text-slate-500 text-xs">
                  Run audit to identify outdated sections, weak subheadings, and missing FAQs.
                </div>
              )}

              {isAnalyzingRefresh && (
                <div className="py-16 text-center text-slate-400 text-xs">
                  Analyzing semantic gaps and structural weaknesses...
                </div>
              )}

              {refreshAnalysis && (
                <div className="space-y-3 text-xs">
                  <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 text-slate-300">
                    <span className="font-semibold text-emerald-400 block mb-1">Summary:</span>
                    {refreshAnalysis.auditSummary}
                  </div>

                  {refreshAnalysis.missingSections && (
                    <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 text-slate-300">
                      <span className="font-semibold text-amber-400 block mb-1">Missing Crucial Sections:</span>
                      <ul className="list-disc pl-4 space-y-0.5 text-slate-400">
                        {refreshAnalysis.missingSections.map((s: string, i: number) => (
                          <li key={i}>{s}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {refreshAnalysis.recommendedFaqs && (
                    <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 text-slate-300">
                      <span className="font-semibold text-blue-400 block mb-1">Recommended FAQs to Add:</span>
                      <ul className="list-disc pl-4 space-y-0.5 text-slate-400">
                        {refreshAnalysis.recommendedFaqs.map((f: string, i: number) => (
                          <li key={i}>{f}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
