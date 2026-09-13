import React, { useState, useEffect, useMemo } from 'react';
import {
  Search,
  KeyRound,
  TrendingUp,
  Sparkles,
  Bookmark,
  BookmarkCheck,
  ArrowRight,
  Filter,
  Download,
  Layers,
  HelpCircle,
  AlertCircle,
  CheckCircle2,
  RefreshCw,
  Globe,
  SlidersHorizontal,
  ChevronDown,
  Trash2,
  ExternalLink,
  Target,
  BarChart3,
  Calendar,
  Share2
} from 'lucide-react';
import { api } from '../api.js';
import {
  KeywordResearchResult,
  DiscoveredKeyword,
  SearchIntentType,
  Job
} from '../types.js';

interface KeywordResearchViewProps {
  onGenerateKeyword: (keyword: string, secondaryKeywords?: string[]) => void;
  onAddToCalendar?: (keyword: string, intent: SearchIntentType) => void;
}

export const KeywordResearchView: React.FC<KeywordResearchViewProps> = ({
  onGenerateKeyword,
  onAddToCalendar
}) => {
  const [seedKeyword, setSeedKeyword] = useState('easy chicken dinner recipes');
  const [country, setCountry] = useState('United States');
  const [language, setLanguage] = useState('English');
  const [intentFocus, setIntentFocus] = useState<'all' | 'informational' | 'how-to' | 'commercial' | 'questions'>('all');

  const [isLoading, setIsLoading] = useState(false);
  const [researchData, setResearchData] = useState<KeywordResearchResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Saved keywords state
  const [savedKeywords, setSavedKeywords] = useState<DiscoveredKeyword[]>([]);
  const [activeTab, setActiveTab] = useState<'all-keywords' | 'clusters' | 'questions' | 'gaps' | 'saved'>('all-keywords');

  // Filters for keyword table
  const [tableSearch, setTableSearch] = useState('');
  const [selectedIntent, setSelectedIntent] = useState<string>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [selectedVolume, setSelectedVolume] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'relevance' | 'difficulty-asc' | 'difficulty-desc' | 'alphabetical'>('relevance');

  // Load saved keywords on mount and initial research
  useEffect(() => {
    loadSavedKeywords();
    handleSearchKeywords('easy chicken dinner recipes');
  }, []);

  const loadSavedKeywords = async () => {
    try {
      const data = await api.getSavedKeywords();
      setSavedKeywords(data);
    } catch (err) {
      console.error('Failed to load saved keywords:', err);
    }
  };

  const handleSearchKeywords = async (keywordToRun?: string) => {
    const query = keywordToRun || seedKeyword;
    if (!query.trim()) return;

    setIsLoading(true);
    setError(null);

    try {
      const result = await api.researchKeywords(query.trim(), country, language, intentFocus);
      setResearchData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Keyword research failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleSaveKeyword = async (keyword: DiscoveredKeyword) => {
    const isAlreadySaved = savedKeywords.some(k => k.keyword.toLowerCase() === keyword.keyword.toLowerCase());

    if (isAlreadySaved) {
      try {
        await api.deleteSavedKeyword(keyword.id);
        setSavedKeywords(prev => prev.filter(k => k.keyword.toLowerCase() !== keyword.keyword.toLowerCase()));
        if (researchData) {
          setResearchData({
            ...researchData,
            keywords: researchData.keywords.map(k =>
              k.keyword.toLowerCase() === keyword.keyword.toLowerCase() ? { ...k, isSaved: false } : k
            )
          });
        }
      } catch (err) {
        console.error('Failed to remove saved keyword:', err);
      }
    } else {
      try {
        const res = await api.saveKeyword(keyword);
        setSavedKeywords(prev => [res.savedKeyword, ...prev]);
        if (researchData) {
          setResearchData({
            ...researchData,
            keywords: researchData.keywords.map(k =>
              k.keyword.toLowerCase() === keyword.keyword.toLowerCase() ? { ...k, isSaved: true } : k
            )
          });
        }
      } catch (err) {
        console.error('Failed to save keyword:', err);
      }
    }
  };

  const handleExportCsv = (keywordsToExport: DiscoveredKeyword[], filename = 'seo-keyword-research.csv') => {
    if (!keywordsToExport || keywordsToExport.length === 0) return;

    const headers = ['Keyword', 'Intent', 'Volume Tier', 'Difficulty (0-100)', 'Difficulty Level', 'CPC Tier', 'Trend', 'Cluster Category'];
    const rows = keywordsToExport.map(k => [
      `"${k.keyword.replace(/"/g, '""')}"`,
      k.intent,
      k.volumeTier,
      k.difficulty,
      k.difficultyLevel,
      k.cpcTier,
      k.trend,
      `"${(k.clusterCategory || '').replace(/"/g, '""')}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Filtered and sorted keywords
  const filteredKeywords = useMemo(() => {
    const sourceKeywords = activeTab === 'saved' ? savedKeywords : (researchData?.keywords || []);

    return sourceKeywords
      .filter(k => {
        // Text search filter
        if (tableSearch.trim()) {
          const matchKw = k.keyword.toLowerCase().includes(tableSearch.toLowerCase());
          const matchCat = (k.clusterCategory || '').toLowerCase().includes(tableSearch.toLowerCase());
          if (!matchKw && !matchCat) return false;
        }
        // Intent filter
        if (selectedIntent !== 'all' && k.intent !== selectedIntent) {
          return false;
        }
        // Difficulty filter
        if (selectedDifficulty !== 'all') {
          if (selectedDifficulty === 'easy' && k.difficulty >= 35) return false;
          if (selectedDifficulty === 'medium' && (k.difficulty < 35 || k.difficulty > 65)) return false;
          if (selectedDifficulty === 'hard' && k.difficulty <= 65) return false;
        }
        // Volume filter
        if (selectedVolume !== 'all') {
          if (selectedVolume === 'high' && !k.volumeTier.includes('High')) return false;
          if (selectedVolume === 'medium' && !k.volumeTier.includes('Medium')) return false;
          if (selectedVolume === 'low' && !k.volumeTier.includes('Low')) return false;
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'difficulty-asc') return a.difficulty - b.difficulty;
        if (sortBy === 'difficulty-desc') return b.difficulty - a.difficulty;
        if (sortBy === 'alphabetical') return a.keyword.localeCompare(b.keyword);
        return b.relevanceScore - a.relevanceScore;
      });
  }, [researchData, savedKeywords, activeTab, tableSearch, selectedIntent, selectedDifficulty, selectedVolume, sortBy]);

  const quickSeeds = [
    'easy chicken dinner recipes',
    'intermittent fasting guide',
    'sustainable living habits',
    'b2b content marketing',
    'high protein vegan meal prep'
  ];

  const getIntentBadge = (intent: SearchIntentType) => {
    switch (intent) {
      case 'how-to':
      case 'recipe':
        return 'bg-emerald-950/70 text-emerald-300 border-emerald-800/60';
      case 'commercial':
      case 'review':
      case 'comparison':
        return 'bg-amber-950/70 text-amber-300 border-amber-800/60';
      case 'transactional':
        return 'bg-purple-950/70 text-purple-300 border-purple-800/60';
      default:
        return 'bg-sky-950/70 text-sky-300 border-sky-800/60';
    }
  };

  const getDifficultyColor = (diff: number) => {
    if (diff < 35) return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30';
    if (diff <= 65) return 'text-amber-400 bg-amber-500/10 border-amber-500/30';
    return 'text-rose-400 bg-rose-500/10 border-rose-500/30';
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* 1. Header & Search Stage */}
      <div className="bg-slate-900/80 border border-slate-800/90 rounded-2xl p-6 sm:p-8 backdrop-blur shadow-xl relative overflow-hidden">
        <div className="absolute -right-20 -top-20 w-80 h-80 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2.5 mb-2">
              <span className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <KeyRound className="w-5 h-5" />
              </span>
              <h1 className="text-2xl font-bold tracking-tight text-white">
                Intelligent Keyword & SERP Research
              </h1>
            </div>
            <p className="text-sm text-slate-400 max-w-2xl leading-relaxed">
              Discover verified search intent, competitive keyword difficulty, semantic topic clusters, and real user questions grounded in Google Search data.
            </p>
          </div>

          {/* Quick Stats Pill */}
          <div className="flex items-center gap-2 text-xs">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-300">
              <Bookmark className="w-3.5 h-3.5 text-emerald-400" />
              <span>Target Backlog: <strong className="text-white">{savedKeywords.length}</strong></span>
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-300">
              <Globe className="w-3.5 h-3.5 text-sky-400" />
              <span>Market: <strong className="text-white">{country}</strong></span>
            </span>
          </div>
        </div>

        {/* Search Bar Form */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSearchKeywords();
          }}
          className="space-y-4"
        >
          <div className="flex flex-col sm:flex-row items-stretch gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                id="keyword-search-seed-input"
                type="text"
                value={seedKeyword}
                onChange={(e) => setSeedKeyword(e.target.value)}
                placeholder="Enter seed topic (e.g. easy chicken dinner recipes, vegan meal prep)..."
                className="w-full pl-12 pr-4 py-3.5 bg-slate-950/90 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition text-sm font-medium"
              />
            </div>

            <button
              id="btn-run-keyword-research"
              type="submit"
              disabled={isLoading || !seedKeyword.trim()}
              className="px-6 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-800 disabled:text-slate-500 text-white font-semibold transition flex items-center justify-center gap-2 text-sm shadow-lg shadow-emerald-950/50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Analyzing SERP...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Explore Keywords</span>
                </>
              )}
            </button>
          </div>

          {/* Quick seed suggestions */}
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <span className="text-xs text-slate-500 font-medium mr-1">Trending seeds:</span>
            {quickSeeds.map((seed) => (
              <button
                key={seed}
                type="button"
                onClick={() => {
                  setSeedKeyword(seed);
                  handleSearchKeywords(seed);
                }}
                className={`text-xs px-2.5 py-1 rounded-lg border transition ${
                  seedKeyword === seed
                    ? 'bg-emerald-950/50 border-emerald-500/40 text-emerald-300'
                    : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 text-slate-400 hover:text-slate-200'
                }`}
              >
                {seed}
              </button>
            ))}
          </div>

          {/* Advanced Targeting Options (Country, Language, Focus) */}
          <div className="pt-3 border-t border-slate-800/60 flex flex-wrap items-center gap-4 text-xs text-slate-400">
            <div className="flex items-center gap-2">
              <Globe className="w-3.5 h-3.5 text-slate-400" />
              <label htmlFor="select-research-country" className="text-slate-400">Region:</label>
              <select
                id="select-research-country"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1 text-slate-200 focus:outline-none focus:border-emerald-500"
              >
                <option value="United States">United States</option>
                <option value="United Kingdom">United Kingdom</option>
                <option value="Canada">Canada</option>
                <option value="Australia">Australia</option>
                <option value="Germany">Germany</option>
                <option value="France">France</option>
                <option value="Global">Global</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <label htmlFor="select-research-language" className="text-slate-400">Language:</label>
              <select
                id="select-research-language"
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1 text-slate-200 focus:outline-none focus:border-emerald-500"
              >
                <option value="English">English</option>
                <option value="Spanish">Spanish</option>
                <option value="French">French</option>
                <option value="German">German</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <Filter className="w-3.5 h-3.5 text-slate-400" />
              <label htmlFor="select-intent-focus" className="text-slate-400">Focus:</label>
              <select
                id="select-intent-focus"
                value={intentFocus}
                onChange={(e) => setIntentFocus(e.target.value as any)}
                className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1 text-slate-200 focus:outline-none focus:border-emerald-500"
              >
                <option value="all">All Intent Types</option>
                <option value="how-to">How-To & Practical</option>
                <option value="informational">Informational</option>
                <option value="commercial">Commercial / Best</option>
                <option value="questions">Questions / PAA</option>
              </select>
            </div>

            {researchData?.providerNotice && (
              <span className="ml-auto text-[11px] text-slate-500 italic">
                {researchData.providerNotice}
              </span>
            )}
          </div>
        </form>

        {error && (
          <div className="mt-4 p-4 rounded-xl bg-rose-950/40 border border-rose-800/60 text-rose-300 text-sm flex items-center gap-3">
            <AlertCircle className="w-5 h-5 shrink-0 text-rose-400" />
            <p className="flex-1">{error}</p>
            <button
              type="button"
              onClick={() => handleSearchKeywords()}
              className="text-xs px-3 py-1 bg-rose-900/60 hover:bg-rose-900 rounded-lg text-white font-medium"
            >
              Retry
            </button>
          </div>
        )}
      </div>

      {/* 2. Executive Metrics & Intent Summary */}
      {researchData && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-5">
            <span className="text-xs uppercase tracking-wider text-slate-400 font-semibold block mb-1">
              Discovered Phrases
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-white">{researchData.totalResults}</span>
              <span className="text-xs text-slate-400">targeted queries</span>
            </div>
            <p className="text-xs text-slate-500 mt-2">
              Spanning long-tail, how-to, and buyer intents.
            </p>
          </div>

          <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-5">
            <span className="text-xs uppercase tracking-wider text-slate-400 font-semibold block mb-1">
              Average Difficulty
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-emerald-400">{researchData.averageDifficulty}</span>
              <span className="text-xs text-slate-400">/ 100 KD</span>
            </div>
            <div className="w-full bg-slate-950 rounded-full h-1.5 mt-3 overflow-hidden border border-slate-800">
              <div
                className={`h-full rounded-full ${
                  researchData.averageDifficulty < 35
                    ? 'bg-emerald-500'
                    : researchData.averageDifficulty <= 65
                    ? 'bg-amber-500'
                    : 'bg-rose-500'
                }`}
                style={{ width: `${Math.min(100, Math.max(5, researchData.averageDifficulty))}%` }}
              />
            </div>
          </div>

          <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-5">
            <span className="text-xs uppercase tracking-wider text-slate-400 font-semibold block mb-1">
              Topical Clusters
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-sky-400">{researchData.clusters.length}</span>
              <span className="text-xs text-slate-400">thematic sub-groups</span>
            </div>
            <p className="text-xs text-slate-500 mt-2">
              Structured for authority hub-and-spoke mapping.
            </p>
          </div>

          <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-5">
            <span className="text-xs uppercase tracking-wider text-slate-400 font-semibold block mb-1">
              PAA Questions
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-amber-400">{researchData.questions.length}</span>
              <span className="text-xs text-slate-400">user queries</span>
            </div>
            <p className="text-xs text-slate-500 mt-2">
              Ready for FAQ blocks & rich snippet schemas.
            </p>
          </div>
        </div>
      )}

      {/* 3. Main Content Navigation Tabs */}
      <div className="flex items-center justify-between border-b border-slate-800">
        <div className="flex items-center gap-1 overflow-x-auto pb-px">
          <button
            id="tab-all-keywords"
            type="button"
            onClick={() => setActiveTab('all-keywords')}
            className={`px-4 py-2.5 text-sm font-medium border-b-2 transition whitespace-nowrap flex items-center gap-2 ${
              activeTab === 'all-keywords'
                ? 'border-emerald-500 text-emerald-400 bg-emerald-500/5'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <KeyRound className="w-4 h-4" />
            <span>All Keywords ({researchData?.keywords.length || 0})</span>
          </button>

          <button
            id="tab-clusters"
            type="button"
            onClick={() => setActiveTab('clusters')}
            className={`px-4 py-2.5 text-sm font-medium border-b-2 transition whitespace-nowrap flex items-center gap-2 ${
              activeTab === 'clusters'
                ? 'border-emerald-500 text-emerald-400 bg-emerald-500/5'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Topical Clusters ({researchData?.clusters.length || 0})</span>
          </button>

          <button
            id="tab-questions"
            type="button"
            onClick={() => setActiveTab('questions')}
            className={`px-4 py-2.5 text-sm font-medium border-b-2 transition whitespace-nowrap flex items-center gap-2 ${
              activeTab === 'questions'
                ? 'border-emerald-500 text-emerald-400 bg-emerald-500/5'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <HelpCircle className="w-4 h-4" />
            <span>Search Questions ({researchData?.questions.length || 0})</span>
          </button>

          <button
            id="tab-gaps"
            type="button"
            onClick={() => setActiveTab('gaps')}
            className={`px-4 py-2.5 text-sm font-medium border-b-2 transition whitespace-nowrap flex items-center gap-2 ${
              activeTab === 'gaps'
                ? 'border-emerald-500 text-emerald-400 bg-emerald-500/5'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Target className="w-4 h-4" />
            <span>Content Opportunities</span>
          </button>

          <button
            id="tab-saved-keywords"
            type="button"
            onClick={() => setActiveTab('saved')}
            className={`px-4 py-2.5 text-sm font-medium border-b-2 transition whitespace-nowrap flex items-center gap-2 ${
              activeTab === 'saved'
                ? 'border-emerald-500 text-emerald-400 bg-emerald-500/5'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <BookmarkCheck className="w-4 h-4" />
            <span>Saved Targets ({savedKeywords.length})</span>
          </button>
        </div>

        {/* Global Export Button */}
        {filteredKeywords.length > 0 && (
          <button
            type="button"
            onClick={() => handleExportCsv(filteredKeywords, `${activeTab}-keywords.csv`)}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white text-xs font-medium transition"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV ({filteredKeywords.length})</span>
          </button>
        )}
      </div>

      {/* 4. Tab 1 & Tab 5: Keyword Data Table (All Keywords or Saved Backlog) */}
      {(activeTab === 'all-keywords' || activeTab === 'saved') && (
        <div className="space-y-4">
          {/* Table Filters & Search Bar */}
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type="text"
                value={tableSearch}
                onChange={(e) => setTableSearch(e.target.value)}
                placeholder="Filter keywords by text or category..."
                className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2 text-xs">
              {/* Intent Filter */}
              <select
                value={selectedIntent}
                onChange={(e) => setSelectedIntent(e.target.value)}
                className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-2 text-slate-300 focus:outline-none focus:border-emerald-500"
              >
                <option value="all">All Intents</option>
                <option value="how-to">How-To</option>
                <option value="recipe">Recipe</option>
                <option value="informational">Informational</option>
                <option value="commercial">Commercial</option>
                <option value="comparison">Comparison</option>
                <option value="listicle">Listicle</option>
              </select>

              {/* Difficulty Filter */}
              <select
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value)}
                className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-2 text-slate-300 focus:outline-none focus:border-emerald-500"
              >
                <option value="all">All Difficulties</option>
                <option value="easy">Easy (&lt; 35 KD)</option>
                <option value="medium">Medium (35-65 KD)</option>
                <option value="hard">Hard (&gt; 65 KD)</option>
              </select>

              {/* Volume Tier Filter */}
              <select
                value={selectedVolume}
                onChange={(e) => setSelectedVolume(e.target.value)}
                className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-2 text-slate-300 focus:outline-none focus:border-emerald-500"
              >
                <option value="all">All Volume Tiers</option>
                <option value="high">High (&gt;10k)</option>
                <option value="medium">Medium (1k-10k)</option>
                <option value="low">Low (&lt;1k)</option>
              </select>

              {/* Sorting */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-2 text-slate-300 focus:outline-none focus:border-emerald-500"
              >
                <option value="relevance">Sort: Relevance</option>
                <option value="difficulty-asc">Difficulty: Lowest First</option>
                <option value="difficulty-desc">Difficulty: Highest First</option>
                <option value="alphabetical">Alphabetical (A-Z)</option>
              </select>
            </div>
          </div>

          {/* Keyword Table */}
          <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl overflow-hidden shadow-lg">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-950/80 text-slate-400 font-semibold border-b border-slate-800 uppercase tracking-wider">
                  <tr>
                    <th className="py-3 px-4 w-12 text-center">Save</th>
                    <th className="py-3 px-4">Target Keyword</th>
                    <th className="py-3 px-3">Intent</th>
                    <th className="py-3 px-3">Volume Tier</th>
                    <th className="py-3 px-4">Difficulty</th>
                    <th className="py-3 px-3">Commercial</th>
                    <th className="py-3 px-3">Cluster</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {filteredKeywords.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="py-12 text-center text-slate-500">
                        {isLoading ? (
                          <div className="flex flex-col items-center gap-2">
                            <RefreshCw className="w-5 h-5 animate-spin text-emerald-400" />
                            <span>Discovering keywords across search index...</span>
                          </div>
                        ) : (
                          <div className="space-y-2">
                            <KeyRound className="w-8 h-8 text-slate-600 mx-auto" />
                            <p className="text-slate-400">No keywords match your selected criteria.</p>
                            <button
                              type="button"
                              onClick={() => {
                                setTableSearch('');
                                setSelectedIntent('all');
                                setSelectedDifficulty('all');
                                setSelectedVolume('all');
                              }}
                              className="text-emerald-400 hover:underline text-xs"
                            >
                              Reset filters
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ) : (
                    filteredKeywords.map((kw) => {
                      const isSaved = savedKeywords.some(
                        k => k.keyword.toLowerCase() === kw.keyword.toLowerCase()
                      );

                      return (
                        <tr
                          key={kw.id}
                          className="hover:bg-slate-800/40 transition group"
                        >
                          {/* Bookmark Toggle */}
                          <td className="py-3 px-4 text-center">
                            <button
                              type="button"
                              onClick={() => handleToggleSaveKeyword(kw)}
                              title={isSaved ? 'Remove from saved' : 'Save to target backlog'}
                              className="p-1 rounded hover:bg-slate-800 transition"
                            >
                              {isSaved ? (
                                <BookmarkCheck className="w-4 h-4 text-emerald-400 fill-emerald-400/20" />
                              ) : (
                                <Bookmark className="w-4 h-4 text-slate-500 hover:text-slate-300" />
                              )}
                            </button>
                          </td>

                          {/* Keyword Name & Features */}
                          <td className="py-3 px-4">
                            <div className="font-medium text-slate-100 group-hover:text-emerald-300 transition flex items-center gap-2">
                              <span>{kw.keyword}</span>
                              {kw.trend === 'rising' && (
                                <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-950/60 text-emerald-400 border border-emerald-800/40 flex items-center gap-0.5">
                                  <TrendingUp className="w-2.5 h-2.5" />
                                  <span>Rising</span>
                                </span>
                              )}
                            </div>
                            {kw.serpFeatures && kw.serpFeatures.length > 0 && (
                              <div className="flex flex-wrap gap-1 mt-1 text-[10px] text-slate-500">
                                {kw.serpFeatures.slice(0, 3).map((feat, idx) => (
                                  <span key={idx} className="bg-slate-950 px-1.5 py-0.5 rounded border border-slate-800">
                                    {feat}
                                  </span>
                                ))}
                              </div>
                            )}
                          </td>

                          {/* Search Intent */}
                          <td className="py-3 px-3">
                            <span
                              className={`inline-block px-2 py-0.5 rounded-full border text-[11px] capitalize ${getIntentBadge(
                                kw.intent
                              )}`}
                            >
                              {kw.intent}
                            </span>
                          </td>

                          {/* Volume Tier */}
                          <td className="py-3 px-3 text-slate-300 whitespace-nowrap">
                            <span className="font-medium">{kw.volumeTier}</span>
                          </td>

                          {/* Difficulty (0-100) */}
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-2">
                              <span
                                className={`px-2 py-0.5 rounded font-mono text-xs border ${getDifficultyColor(
                                  kw.difficulty
                                )}`}
                              >
                                {kw.difficulty}
                              </span>
                              <div className="w-16 bg-slate-950 rounded-full h-1.5 border border-slate-800 hidden sm:block">
                                <div
                                  className={`h-full rounded-full ${
                                    kw.difficulty < 35
                                      ? 'bg-emerald-500'
                                      : kw.difficulty <= 65
                                      ? 'bg-amber-500'
                                      : 'bg-rose-500'
                                  }`}
                                  style={{ width: `${Math.min(100, Math.max(5, kw.difficulty))}%` }}
                                />
                              </div>
                            </div>
                          </td>

                          {/* CPC Tier */}
                          <td className="py-3 px-3">
                            <span
                              className={`text-[11px] font-medium px-2 py-0.5 rounded ${
                                kw.cpcTier === 'High'
                                  ? 'text-emerald-400 bg-emerald-950/40'
                                  : kw.cpcTier === 'Medium'
                                  ? 'text-sky-400 bg-sky-950/40'
                                  : 'text-slate-400 bg-slate-950'
                              }`}
                            >
                              {kw.cpcTier} CPC
                            </span>
                          </td>

                          {/* Cluster Category */}
                          <td className="py-3 px-3 text-slate-400">
                            <span className="truncate max-w-[120px] block" title={kw.clusterCategory}>
                              {kw.clusterCategory || 'General'}
                            </span>
                          </td>

                          {/* Actions */}
                          <td className="py-3 px-4 text-right whitespace-nowrap">
                            <div className="flex items-center justify-end gap-1.5">
                              {onAddToCalendar && (
                                <button
                                  type="button"
                                  onClick={() => onAddToCalendar(kw.keyword, kw.intent)}
                                  title="Add to Content Calendar"
                                  className="p-1.5 rounded-lg bg-slate-950 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 transition"
                                >
                                  <Calendar className="w-3.5 h-3.5" />
                                </button>
                              )}

                              <button
                                type="button"
                                onClick={() => onGenerateKeyword(kw.keyword, kw.topQuestions)}
                                className="px-2.5 py-1.5 rounded-lg bg-emerald-600/90 hover:bg-emerald-500 text-white font-medium text-xs flex items-center gap-1 transition shadow-sm"
                              >
                                <span>Generate</span>
                                <ArrowRight className="w-3 h-3" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 5. Tab 2: Topical Semantic Clusters */}
      {activeTab === 'clusters' && researchData && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {researchData.clusters.map((cluster, idx) => (
            <div
              key={idx}
              className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80 hover:border-slate-700 transition flex flex-col justify-between space-y-4"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-2">
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <Layers className="w-4 h-4 text-emerald-400" />
                    <span>{cluster.name}</span>
                  </h3>
                  <span
                    className={`px-2 py-0.5 rounded-full border text-[11px] capitalize ${getIntentBadge(
                      cluster.primaryIntent
                    )}`}
                  >
                    {cluster.primaryIntent}
                  </span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed mb-4">
                  {cluster.description}
                </p>

                {/* Sub-keywords list */}
                <div className="space-y-2">
                  <span className="text-[11px] font-semibold text-slate-300 uppercase tracking-wider block">
                    Associated Query Targets:
                  </span>
                  {cluster.keywords && cluster.keywords.length > 0 ? (
                    <div className="flex flex-wrap gap-1.5">
                      {cluster.keywords.map((kw, kIdx) => (
                        <button
                          key={kIdx}
                          type="button"
                          onClick={() => onGenerateKeyword(kw.keyword)}
                          className="text-xs px-2.5 py-1 rounded-lg bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-emerald-300 transition flex items-center gap-1.5"
                        >
                          <span>{kw.keyword}</span>
                          <span className="text-[10px] text-slate-500 font-mono">({kw.difficulty} KD)</span>
                        </button>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-slate-500 italic">Keywords linked dynamically to this cluster.</p>
                  )}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800/60 flex items-center justify-between text-xs">
                <span className="text-slate-500">
                  {cluster.keywords?.length || cluster.keywordCount} target keywords
                </span>
                <button
                  type="button"
                  onClick={() => {
                    if (cluster.keywords && cluster.keywords[0]) {
                      onGenerateKeyword(cluster.keywords[0].keyword);
                    } else {
                      onGenerateKeyword(cluster.name);
                    }
                  }}
                  className="text-emerald-400 hover:text-emerald-300 font-medium flex items-center gap-1"
                >
                  <span>Build Pillar Content</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 6. Tab 3: People Also Ask & Forum Questions */}
      {activeTab === 'questions' && researchData && (
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-white">Search Intent Questions (PAA & Forums)</h3>
              <p className="text-xs text-slate-400">
                Incorporate these verified user inquiries into H2 subheadings, FAQs, and schema markup to capture Google answer boxes.
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                const text = researchData.questions.map(q => `- ${q.question}`).join('\n');
                navigator.clipboard.writeText(text);
              }}
              className="px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-300 hover:text-white text-xs font-medium transition"
            >
              Copy All Questions
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {researchData.questions.map((q, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl bg-slate-900/40 border border-slate-800/80 hover:border-slate-700 transition flex items-start justify-between gap-3 group"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    <span className="text-xs font-medium text-slate-200 group-hover:text-emerald-300 transition">
                      {q.question}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-[10px] text-slate-500 pl-3.5">
                    <span>Target: {q.parentKeyword}</span>
                    <span>•</span>
                    <span className="capitalize">{q.intent}</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => onGenerateKeyword(q.question)}
                  className="shrink-0 text-xs px-2.5 py-1 rounded bg-slate-950 hover:bg-emerald-600 hover:text-white border border-slate-800 text-slate-400 transition"
                  title="Generate Article for this Question"
                >
                  Write Post
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 7. Tab 4: Content Gaps & Opportunities */}
      {activeTab === 'gaps' && researchData && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Competitive Weaknesses */}
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80 space-y-4">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-amber-400" />
              <h3 className="text-base font-bold text-white">Competitor SERP Content Gaps</h3>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Top ranking pages on Google currently lack these high-value angles. Covering them will give your content immediate competitive advantage:
            </p>
            <ul className="space-y-2.5 text-xs text-slate-300">
              {researchData.contentGapsFound.map((gap, i) => (
                <li key={i} className="flex items-start gap-2 p-3 rounded-lg bg-slate-950/60 border border-slate-800/60">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 shrink-0" />
                  <span>{gap}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Suggested Pillar Frameworks */}
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80 space-y-4">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-emerald-400" />
              <h3 className="text-base font-bold text-white">High-Authority Pillar Titles</h3>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Formulated for maximum CTR and deep topical authority coverage:
            </p>
            <div className="space-y-3">
              {researchData.suggestedPillars.map((pillar, i) => (
                <div
                  key={i}
                  className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-between gap-3 group"
                >
                  <span className="text-xs font-medium text-slate-200 group-hover:text-emerald-300 transition">
                    {pillar}
                  </span>
                  <button
                    type="button"
                    onClick={() => onGenerateKeyword(pillar)}
                    className="shrink-0 px-2.5 py-1 rounded bg-emerald-600/90 hover:bg-emerald-500 text-white text-xs font-medium transition flex items-center gap-1"
                  >
                    <span>Create</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
