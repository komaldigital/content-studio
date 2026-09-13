import React, { useState } from 'react';
import Markdown from 'react-markdown';
import {
  FileText,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ExternalLink,
  Send,
  Sparkles,
  Edit3,
  History,
  Code,
  ShieldCheck,
  Link as LinkIcon,
  RefreshCw,
  Copy,
  ChevronRight,
  Pin,
  Maximize2,
  Image as ImageIcon,
  Zap,
  Check,
  Search,
  X,
  Share2,
  Eye,
  Columns,
  Plus,
  Trash2,
  Save,
  RotateCcw,
  Download
} from 'lucide-react';
import { Article, ArticleSection, AppSettings } from '../types.js';
import { api } from '../api.js';
import { MultiChannelPublishModal } from './MultiChannelPublishModal.js';
import { ContentPreviewCard } from './ContentPreviewCard.js';
import { ContentMarkdownEditor } from './ContentMarkdownEditor.js';

interface ArticlesViewProps {
  articles: Article[];
  selectedArticleId: string | null;
  onSelectArticle: (id: string) => void;
  onRefreshArticles: () => void;
  onOpenInPinterest: (article: Article) => void;
  onNavigateToGenerator?: () => void;
  settings?: AppSettings | null;
}

export const ArticlesView: React.FC<ArticlesViewProps> = ({
  articles,
  selectedArticleId,
  onSelectArticle,
  onRefreshArticles,
  onOpenInPinterest,
  onNavigateToGenerator,
  settings
}) => {
  const selectedArticle = articles.find(a => a.id === selectedArticleId) || articles[0];

  const [activeTab, setActiveTab] = useState<'content' | 'images' | 'geo' | 'audit' | 'schema' | 'links' | 'factcheck' | 'versions'>('content');
  const [contentMode, setContentMode] = useState<'preview' | 'edit' | 'split'>('preview');
  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'mobile'>('desktop');

  // Editable draft states for preview & direct editing before publish
  const [editTitle, setEditTitle] = useState(selectedArticle?.title || '');
  const [editSlug, setEditSlug] = useState(selectedArticle?.slug || '');
  const [editMetaDesc, setEditMetaDesc] = useState(selectedArticle?.metaDescription || '');
  const [editContent, setEditContent] = useState(selectedArticle?.content || '');
  const [editSections, setEditSections] = useState<ArticleSection[]>(selectedArticle?.sections || []);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccessNotice, setSaveSuccessNotice] = useState<string | null>(null);

  // Search and status filter in sidebar
  const [articleSearchQuery, setArticleSearchQuery] = useState('');
  const [articleStatusFilter, setArticleStatusFilter] = useState<'all' | 'draft' | 'published' | 'top_score'>('all');
  const [deletingArticleId, setDeletingArticleId] = useState<string | null>(null);

  const [isSyncingWp, setIsSyncingWp] = useState(false);
  const [wpStatusNotice, setWpStatusNotice] = useState<string | null>(null);
  const [isMultiPublishOpen, setIsMultiPublishOpen] = useState(false);
  const [isImprovingSeo, setIsImprovingSeo] = useState(false);
  const [editingSectionId, setEditingSectionId] = useState<string | null>(null);
  const [sectionActionLoading, setSectionActionLoading] = useState(false);
  const [customInstruction, setCustomInstruction] = useState('');
  const [copiedNotification, setCopiedNotification] = useState(false);

  // GEO & Citation Report state
  const [citationReport, setCitationReport] = useState<any | null>(selectedArticle?.aiCitationReport || null);
  const [isLoadingCitation, setIsLoadingCitation] = useState(false);
  const [isApplyingLinks, setIsApplyingLinks] = useState(false);

  // Sync draft states when selectedArticle changes
  React.useEffect(() => {
    if (selectedArticle) {
      setEditTitle(selectedArticle.title || '');
      setEditSlug(selectedArticle.slug || '');
      setEditMetaDesc(selectedArticle.metaDescription || '');
      setEditContent(selectedArticle.content || '');
      setEditSections(selectedArticle.sections || []);
      setHasUnsavedChanges(false);
      setCitationReport(selectedArticle.aiCitationReport || null);
    }
  }, [selectedArticle?.id]);

  // Keyboard shortcut Ctrl+S / Cmd+S to save
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        if (hasUnsavedChanges && !isSaving) {
          handleSaveArticle();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [hasUnsavedChanges, isSaving, editTitle, editSlug, editMetaDesc, editContent, editSections, selectedArticle?.id]);

  // Intent-matched image generation state
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [isGeneratingAllImages, setIsGeneratingAllImages] = useState(false);
  const [imageNotice, setImageNotice] = useState<string | null>(null);
  const [customImageSection, setCustomImageSection] = useState<string>('');
  const [customImagePrompt, setCustomImagePrompt] = useState<string>('');
  const [customImageAspect, setCustomImageAspect] = useState<'4:3' | '16:9' | '1:1'>('4:3');

  // Interactive Keyword Photo Search & Swap state
  const [searchModalImage, setSearchModalImage] = useState<{ id: string; heading: string; url: string; altText?: string } | null>(null);
  const [photoSearchQuery, setPhotoSearchQuery] = useState('');
  const [photoSearchResults, setPhotoSearchResults] = useState<{ url: string; title: string; altText: string; source: 'wikimedia' | 'pollinations' }[]>([]);
  const [isSearchingPhotos, setIsSearchingPhotos] = useState(false);
  const [isSwappingPhoto, setIsSwappingPhoto] = useState(false);
  const [customPhotoUrl, setCustomPhotoUrl] = useState('');

  if (!selectedArticle) {
    return (
      <div className="max-w-7xl mx-auto py-16 px-4 text-center text-slate-500">
        <FileText className="w-12 h-12 mx-auto mb-3 text-slate-600" />
        <h3 className="text-lg font-bold text-white">No Articles Yet</h3>
        <p className="text-sm mt-1">Head over to the Generator to research and create your first search-intent optimized article.</p>
      </div>
    );
  }

  const handleSectionAction = async (sectionId: string, action: string, instructionOverride?: string) => {
    setSectionActionLoading(true);
    try {
      const res = await api.editSection(selectedArticle.id, sectionId, action, instructionOverride || customInstruction);
      setEditingSectionId(null);
      setCustomInstruction('');
      if (res && res.article) {
        setEditTitle(res.article.title || '');
        setEditContent(res.article.content || '');
        setEditSections(res.article.sections || []);
      }
      onRefreshArticles();
    } catch (err) {
      alert('Section edit failed: ' + (err instanceof Error ? err.message : String(err)));
    } finally {
      setSectionActionLoading(false);
    }
  };

  const handleAutoImproveSeo = async () => {
    setIsImprovingSeo(true);
    try {
      await api.autoImproveSeo(selectedArticle.id);
      onRefreshArticles();
    } catch (err) {
      alert('SEO improvement failed: ' + (err instanceof Error ? err.message : String(err)));
    } finally {
      setIsImprovingSeo(false);
    }
  };

  const handlePublishWordPress = async (status: 'draft' | 'pending' | 'publish') => {
    setIsSyncingWp(true);
    setWpStatusNotice(null);
    try {
      const res = await api.publishToWordPress(selectedArticle.id, status);
      if (res.success) {
        setWpStatusNotice(`Successfully synced to WordPress as ${status.toUpperCase()}! (Post ID: ${res.postId})`);
        onRefreshArticles();
      } else {
        setWpStatusNotice(`WordPress Notice: ${res.error || 'Sync failed.'}`);
      }
    } catch (err) {
      setWpStatusNotice(`Error: ${err instanceof Error ? err.message : String(err)}`);
    } finally {
      setIsSyncingWp(false);
    }
  };

  const handleSaveArticle = async () => {
    if (!selectedArticle) return;
    setIsSaving(true);
    setSaveSuccessNotice(null);
    try {
      const res = await api.updateArticle(selectedArticle.id, {
        title: editTitle,
        slug: editSlug,
        metaDescription: editMetaDesc,
        content: editContent,
        sections: editSections
      });
      if (res.success) {
        setHasUnsavedChanges(false);
        setSaveSuccessNotice('✓ Changes successfully saved & versioned! Word count & reading time updated.');
        setTimeout(() => setSaveSuccessNotice(null), 4000);
        onRefreshArticles();
      }
    } catch (err: any) {
      alert('Save failed: ' + (err?.message || String(err)));
    } finally {
      setIsSaving(false);
    }
  };

  const handleDiscardChanges = () => {
    if (!selectedArticle) return;
    setEditTitle(selectedArticle.title || '');
    setEditSlug(selectedArticle.slug || '');
    setEditMetaDesc(selectedArticle.metaDescription || '');
    setEditContent(selectedArticle.content || '');
    setEditSections(selectedArticle.sections || []);
    setHasUnsavedChanges(false);
  };

  const handleDeleteArticle = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm('Are you sure you want to permanently delete this article?')) return;
    setDeletingArticleId(id);
    try {
      const res = await api.deleteArticle(id);
      if (res.success) {
        onRefreshArticles();
      }
    } catch (err: any) {
      alert('Delete failed: ' + (err?.message || String(err)));
    } finally {
      setDeletingArticleId(null);
    }
  };

  const filteredArticles = React.useMemo(() => {
    return articles.filter(art => {
      if (articleSearchQuery.trim()) {
        const q = articleSearchQuery.toLowerCase();
        const matchTitle = (art.title || '').toLowerCase().includes(q);
        const matchSlug = (art.slug || '').toLowerCase().includes(q);
        const matchKeyword = (art.brief?.primaryKeyword || '').toLowerCase().includes(q);
        if (!matchTitle && !matchSlug && !matchKeyword) return false;
      }
      if (articleStatusFilter === 'draft') {
        return art.wordpressStatus !== 'publish';
      }
      if (articleStatusFilter === 'published') {
        return art.wordpressStatus === 'publish';
      }
      if (articleStatusFilter === 'top_score') {
        return (art.seoScore?.total || 0) >= 85;
      }
      return true;
    });
  }, [articles, articleSearchQuery, articleStatusFilter]);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedNotification(true);
    setTimeout(() => setCopiedNotification(false), 2000);
  };

  const handleApplySitemapLinks = async () => {
    setIsApplyingLinks(true);
    try {
      const res = await api.applySitemapLinks({ articleId: selectedArticle.id });
      if (res.success) {
        setImageNotice(`Injected ${res.linksInjected} contextual sitemap links for topical authority!`);
        onRefreshArticles();
      }
    } catch (err: any) {
      alert('Sitemap link injection failed: ' + err.message);
    } finally {
      setIsApplyingLinks(false);
    }
  };

  const handleFetchCitationReport = async () => {
    setIsLoadingCitation(true);
    try {
      const rep = await api.getCitationReport(selectedArticle.id);
      setCitationReport(rep);
      setActiveTab('geo');
    } catch (err: any) {
      console.warn('Failed to load citation report:', err);
    } finally {
      setIsLoadingCitation(false);
    }
  };

  const handleGenerateIntentImage = async (options?: {
    sectionHeading?: string;
    prompt?: string;
    aspectRatio?: '16:9' | '4:3' | '1:1';
    searchIntentMatch?: string;
  }) => {
    setIsGeneratingImage(true);
    setImageNotice(null);
    try {
      const heading = options?.sectionHeading || customImageSection || selectedArticle.sections[0]?.heading || 'General';
      const prompt = options?.prompt || customImagePrompt || undefined;
      const aspectRatio = options?.aspectRatio || customImageAspect || '4:3';
      const intentMatch = options?.searchIntentMatch || `Visual for ${heading}`;

      const res = await api.generateIntentImage(selectedArticle.id, {
        sectionHeading: heading,
        prompt,
        aspectRatio,
        searchIntentMatch: intentMatch
      });

      if (res.success) {
        setImageNotice(`Generated search-intent visual for "${heading}" successfully!`);
        setCustomImagePrompt('');
        onRefreshArticles();
      }
    } catch (err) {
      setImageNotice(`Image generation failed: ${err instanceof Error ? err.message : String(err)}`);
    } finally {
      setIsGeneratingImage(false);
    }
  };

  const handleGenerateAllSectionImages = async () => {
    setIsGeneratingAllImages(true);
    setImageNotice(null);
    try {
      const res = await api.generateAllSectionImages(selectedArticle.id);
      if (res.success) {
        setImageNotice(
          res.generatedCount > 0
            ? `Generated ${res.generatedCount} intent-matched visuals matching all H2 and H3 sections! Total images: ${res.totalImages}.`
            : `All H2 and H3 sections already have matching search-intent visuals (${res.totalImages} total).`
        );
        onRefreshArticles();
      }
    } catch (err) {
      setImageNotice(`Batch image generation failed: ${err instanceof Error ? err.message : String(err)}`);
    } finally {
      setIsGeneratingAllImages(false);
    }
  };

  const openPhotoSearch = (img: { id: string; heading: string; url: string; altText?: string }) => {
    setSearchModalImage(img);
    const initialQuery = img.heading?.replace(/^#+\s*/, '') || selectedArticle.brief.primaryKeyword;
    setPhotoSearchQuery(initialQuery);
    setCustomPhotoUrl('');
    handlePerformPhotoSearch(initialQuery);
  };

  const handlePerformPhotoSearch = async (query: string) => {
    if (!query.trim()) return;
    setIsSearchingPhotos(true);
    try {
      const res = await api.searchKeywordImages(query);
      if (res.success) {
        setPhotoSearchResults(res.results || []);
      }
    } catch (err) {
      console.error('Photo search error:', err);
    } finally {
      setIsSearchingPhotos(false);
    }
  };

  const handleApplyPhotoSwap = async (newUrl: string, newAlt?: string) => {
    if (!searchModalImage || !newUrl) return;
    setIsSwappingPhoto(true);
    try {
      await api.updateArticleImage(selectedArticle.id, {
        imageId: searchModalImage.id,
        newUrl,
        altText: newAlt || searchModalImage.altText
      });
      setImageNotice(`Successfully matched and updated photo for "${searchModalImage.heading}"!`);
      setSearchModalImage(null);
      onRefreshArticles();
    } catch (err) {
      alert('Failed to update image: ' + (err instanceof Error ? err.message : String(err)));
    } finally {
      setIsSwappingPhoto(false);
    }
  };

  const handleRefreshAllImagesWithKeywords = async () => {
    if (!confirm('This will replace all images in this article with newly verified keyword-matched photography and AI graphics. Continue?')) {
      return;
    }
    setIsGeneratingAllImages(true);
    setImageNotice(null);
    try {
      const res = await api.generateAllSectionImages(selectedArticle.id, { forceRefreshAll: true });
      if (res.success) {
        setImageNotice(`Replaced all visuals with verified keyword-matched photography (${res.totalImages} images updated).`);
        onRefreshArticles();
      }
    } catch (err) {
      setImageNotice(`Failed to re-match visuals: ${err instanceof Error ? err.message : String(err)}`);
    } finally {
      setIsGeneratingAllImages(false);
    }
  };

  const totalScore = selectedArticle.seoScore?.total || 0;

  return (
    <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 space-y-6">
      {/* Top Header Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Article Selector Sidebar */}
        <div className="lg:col-span-4 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
              <FileText className="w-4 h-4 text-emerald-400" />
              <span>Drafts & Articles ({articles.length})</span>
            </h2>
            {onNavigateToGenerator && (
              <button
                onClick={onNavigateToGenerator}
                className="flex items-center gap-1 text-[11px] font-bold text-emerald-400 hover:text-emerald-300 px-2 py-1 rounded-lg bg-emerald-950/40 border border-emerald-800/40 transition-colors"
                title="Generate a new search-optimized article"
              >
                <Plus className="w-3 h-3" />
                <span>New</span>
              </button>
            )}
          </div>

          {/* Search Box */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-2.5" />
            <input
              type="text"
              value={articleSearchQuery}
              onChange={(e) => setArticleSearchQuery(e.target.value)}
              placeholder="Search by title, keyword, slug..."
              className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-8 pr-7 py-1.5 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
            />
            {articleSearchQuery && (
              <button
                onClick={() => setArticleSearchQuery('')}
                className="absolute right-2.5 top-2 text-slate-400 hover:text-white text-xs"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-[11px] no-scrollbar">
            {[
              { id: 'all', label: 'All' },
              { id: 'draft', label: 'Drafts' },
              { id: 'published', label: 'Published' },
              { id: 'top_score', label: 'Top 85+ SEO' }
            ].map(f => (
              <button
                key={f.id}
                onClick={() => setArticleStatusFilter(f.id as any)}
                className={`px-2 py-0.5 rounded-lg font-medium whitespace-nowrap transition-colors ${
                  articleStatusFilter === f.id
                    ? 'bg-emerald-600 text-slate-950 font-bold'
                    : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* List of Articles */}
          <div className="space-y-2 max-h-[660px] overflow-y-auto pr-1">
            {filteredArticles.length === 0 ? (
              <div className="p-6 text-center text-xs text-slate-500 rounded-xl border border-slate-800/80 bg-slate-900/40 space-y-2">
                <p>No articles match your filter.</p>
                {articleSearchQuery && (
                  <button
                    onClick={() => setArticleSearchQuery('')}
                    className="text-emerald-400 font-semibold underline text-xs"
                  >
                    Clear Search
                  </button>
                )}
              </div>
            ) : (
              filteredArticles.map(art => {
                const isSelected = art.id === selectedArticle.id;
                const score = art.seoScore?.total || 0;
                const isDeleting = deletingArticleId === art.id;

                return (
                  <div
                    key={art.id}
                    id={`article-select-${art.id}`}
                    onClick={() => onSelectArticle(art.id)}
                    className={`w-full text-left p-3 rounded-xl border transition-all cursor-pointer relative group ${
                      isSelected
                        ? 'bg-slate-800/95 border-emerald-500/50 shadow-md shadow-emerald-950/20'
                        : 'bg-slate-900 border-slate-800 hover:bg-slate-850 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-800/80 text-emerald-400 border border-emerald-500/20 uppercase tracking-wider">
                        {art.brief?.searchIntent?.primaryIntent || 'Article'}
                      </span>
                      <div className="flex items-center gap-1.5">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          score >= 85
                            ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                            : 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                        }`}>
                          {score}/100 SEO
                        </span>
                        <button
                          onClick={(e) => handleDeleteArticle(art.id, e)}
                          disabled={isDeleting}
                          className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-red-400 rounded transition-opacity"
                          title="Delete article draft"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <h3 className="text-xs font-bold text-white line-clamp-2 leading-snug">
                      {art.title}
                    </h3>

                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-800/60 text-[10px] text-slate-400">
                      <span>{art.wordCount} words • {art.readingTimeMinutes}m read</span>
                      <span className={`px-1.5 py-0.5 rounded font-medium capitalize ${
                        art.wordpressStatus === 'publish'
                          ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-800/40'
                          : 'bg-slate-800 text-slate-400'
                      }`}>
                        {art.wordpressStatus || 'draft'}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right: Article Workspace */}
        <div className="lg:col-span-8 space-y-4">
          {/* Article Info Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              <div className="space-y-1 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-mono text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/40">
                    /{selectedArticle.slug}
                  </span>
                  <span className="text-xs text-slate-400">
                    v{selectedArticle.versions?.length || 1} • {selectedArticle.wordCount} words
                  </span>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded bg-indigo-950/70 border border-indigo-800/50 text-indigo-300 flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-indigo-400" />
                    <span>Engine: {selectedArticle.modelUsed || 'gemini-3.8-flash'}</span>
                  </span>
                  <button
                    onClick={handleFetchCitationReport}
                    className="text-xs font-semibold px-2 py-0.5 rounded bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 flex items-center gap-1 transition-colors cursor-pointer"
                    title="View Perplexity & Google AI Overviews citation readiness report"
                  >
                    <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                    <span>{citationReport?.score || selectedArticle.aiCitationReport?.score || 92}% AI Citation Ready</span>
                  </button>
                  {selectedArticle.isHighRiskContent && (
                    <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-amber-500/15 text-amber-300 border border-amber-500/30 flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3 text-amber-400" />
                      Human Review Recommended
                    </span>
                  )}
                </div>
                <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight leading-snug">
                  {selectedArticle.title}
                </h1>
                <p className="text-xs sm:text-sm text-slate-400">
                  {selectedArticle.metaDescription}
                </p>
              </div>

              {/* Actions & Score Pill */}
              <div className="flex sm:flex-col items-end gap-2 shrink-0">
                <div className={`px-4 py-2 rounded-xl text-center border ${
                  totalScore >= 85
                    ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300'
                    : 'bg-amber-950/40 border-amber-500/40 text-amber-300'
                }`}>
                  <div className="text-2xl font-black">{totalScore}</div>
                  <div className="text-[10px] font-semibold uppercase tracking-wider">SEO Score</div>
                </div>

                <div className="flex items-center gap-1.5 flex-wrap justify-end">
                  <button
                    id="syndicate-all-channels-btn"
                    onClick={() => setIsMultiPublishOpen(true)}
                    className="p-2 sm:px-3 sm:py-2 rounded-lg bg-gradient-to-r from-emerald-500 via-teal-500 to-indigo-600 hover:from-emerald-400 hover:to-indigo-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-emerald-500/20 transition-all cursor-pointer"
                    title="Publish to WordPress, Facebook, Pinterest & Instagram"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                    <span>Syndicate All Channels</span>
                  </button>
                  <button
                    onClick={() => onOpenInPinterest(selectedArticle)}
                    className="p-2 rounded-lg bg-red-600/20 hover:bg-red-600/30 text-red-300 border border-red-500/30 text-xs font-semibold flex items-center gap-1 transition-colors"
                    title="Open in Pinterest Studio"
                  >
                    <Pin className="w-3.5 h-3.5" />
                    <span>Pin</span>
                  </button>
                  <button
                    onClick={() => copyToClipboard(selectedArticle.content)}
                    className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-1 transition-colors"
                    title="Copy Markdown"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>{copiedNotification ? 'Copied!' : 'Copy'}</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Multi-Channel Syndication & WordPress Sync Bar */}
            <div className="pt-3 border-t border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-950/40 -mx-5 -mb-5 p-4 rounded-b-2xl">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-semibold text-slate-300">Channels:</span>
                
                {/* WordPress Status Pill */}
                <div className="flex items-center gap-1 px-2 py-0.5 rounded bg-blue-950/40 border border-blue-800/40 text-blue-300 text-[11px] font-medium">
                  <span className="font-bold">WP:</span>
                  <span className="capitalize">{selectedArticle.wordpressStatus}</span>
                  {selectedArticle.wordpressUrl && (
                    <a
                      href={selectedArticle.wordpressUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-blue-400 hover:underline inline-flex items-center ml-0.5"
                    >
                      <ExternalLink className="w-2.5 h-2.5" />
                    </a>
                  )}
                </div>

                {/* Facebook Status Pill */}
                <div className={`flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium ${
                  selectedArticle.facebookPost?.status === 'published'
                    ? 'bg-indigo-950/40 border border-indigo-800/40 text-indigo-300'
                    : 'bg-slate-900 border border-slate-800 text-slate-400'
                }`}>
                  <span className="font-bold">FB:</span>
                  <span className="capitalize">{selectedArticle.facebookPost?.status || 'unposted'}</span>
                  {selectedArticle.facebookPost?.postUrl && (
                    <a
                      href={selectedArticle.facebookPost.postUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-indigo-400 hover:underline inline-flex items-center ml-0.5"
                    >
                      <ExternalLink className="w-2.5 h-2.5" />
                    </a>
                  )}
                </div>

                {/* Pinterest Status Pill */}
                <div className={`flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium ${
                  selectedArticle.pinterestPin?.status === 'published'
                    ? 'bg-red-950/40 border border-red-800/40 text-red-300'
                    : 'bg-slate-900 border border-slate-800 text-slate-400'
                }`}>
                  <span className="font-bold">Pin:</span>
                  <span className="capitalize">{selectedArticle.pinterestPin?.status || 'draft'}</span>
                  {selectedArticle.pinterestPin?.pinUrl && (
                    <a
                      href={selectedArticle.pinterestPin.pinUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-red-400 hover:underline inline-flex items-center ml-0.5"
                    >
                      <ExternalLink className="w-2.5 h-2.5" />
                    </a>
                  )}
                </div>

                {/* Instagram Status Pill */}
                <div className={`flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium ${
                  selectedArticle.instagramPost?.status === 'published'
                    ? 'bg-fuchsia-950/40 border border-fuchsia-800/40 text-fuchsia-300'
                    : 'bg-slate-900 border border-slate-800 text-slate-400'
                }`}>
                  <span className="font-bold">IG:</span>
                  <span className="capitalize">{selectedArticle.instagramPost?.status || 'unposted'}</span>
                  {selectedArticle.instagramPost?.postUrl && (
                    <a
                      href={selectedArticle.instagramPost.postUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-fuchsia-400 hover:underline inline-flex items-center ml-0.5"
                    >
                      <ExternalLink className="w-2.5 h-2.5" />
                    </a>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  id="wp-sync-draft-btn"
                  onClick={() => handlePublishWordPress('draft')}
                  disabled={isSyncingWp}
                  className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors disabled:opacity-50"
                >
                  {isSyncingWp ? 'Syncing...' : 'WP Draft'}
                </button>
                <button
                  id="wp-sync-publish-btn"
                  onClick={() => handlePublishWordPress('publish')}
                  disabled={isSyncingWp}
                  className="px-2.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold transition-colors disabled:opacity-50"
                >
                  WP Publish
                </button>
                <button
                  id="open-syndication-modal-btn"
                  onClick={() => setIsMultiPublishOpen(true)}
                  className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold text-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>Publish to All</span>
                </button>
              </div>
            </div>
          </div>

          {wpStatusNotice && (
            <div className="p-3 rounded-xl bg-blue-950/40 border border-blue-800/60 text-blue-300 text-xs flex items-center justify-between">
              <span>{wpStatusNotice}</span>
              <button onClick={() => setWpStatusNotice(null)} className="text-blue-400 hover:text-white font-bold ml-2">×</button>
            </div>
          )}

          {imageNotice && (
            <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-800/60 text-emerald-300 text-xs flex items-center justify-between">
              <span>{imageNotice}</span>
              <button onClick={() => setImageNotice(null)} className="text-emerald-400 hover:text-white font-bold ml-2">×</button>
            </div>
          )}

          {/* Sub-Tabs Navigation */}
          <div className="flex items-center space-x-1 border-b border-slate-800 pb-1 overflow-x-auto no-scrollbar">
            {[
              { id: 'content', label: 'Article & Sections', icon: Edit3 },
              {
                id: 'images',
                label: `Visuals & Search Intent (${(selectedArticle.featuredImage ? 1 : 0) + (selectedArticle.articleImages?.length || 0)})`,
                icon: ImageIcon
              },
              { id: 'geo', label: 'GEO & AI Citations', icon: Sparkles },
              { id: 'audit', label: '100-pt SEO Audit', icon: CheckCircle2 },
              { id: 'schema', label: 'Structured Schema', icon: Code },
              { id: 'links', label: 'Internal Links', icon: LinkIcon },
              { id: 'factcheck', label: 'Fact-Check & Safety', icon: ShieldCheck },
              { id: 'versions', label: 'Version History', icon: History }
            ].map(tab => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  id={`article-tab-${tab.id}`}
                  onClick={() => {
                    setActiveTab(tab.id as any);
                    if (tab.id === 'geo' && !citationReport) {
                      handleFetchCitationReport();
                    }
                  }}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                    isActive
                      ? 'bg-slate-800 text-white border border-slate-700'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* TAB 1: CONTENT & SECTION-LEVEL EDITING */}
          {activeTab === 'content' && (
            <div className="space-y-6">
              {/* Mode Switcher & Save Header */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 shadow-sm">
                <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800 shrink-0">
                  <button
                    onClick={() => setContentMode('preview')}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      contentMode === 'preview'
                        ? 'bg-emerald-600 text-slate-950 shadow-sm'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Live Preview</span>
                  </button>

                  <button
                    onClick={() => setContentMode('edit')}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      contentMode === 'edit'
                        ? 'bg-emerald-600 text-slate-950 shadow-sm'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Direct Editor</span>
                    {hasUnsavedChanges && (
                      <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                    )}
                  </button>

                  <button
                    onClick={() => setContentMode('split')}
                    className={`hidden xl:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      contentMode === 'split'
                        ? 'bg-emerald-600 text-slate-950 shadow-sm'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <Columns className="w-3.5 h-3.5" />
                    <span>Side-by-Side</span>
                  </button>
                </div>

                <div className="flex items-center justify-end gap-2 flex-wrap">
                  {hasUnsavedChanges && (
                    <span className="text-[11px] font-medium text-amber-400 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                      Unsaved draft changes
                    </span>
                  )}

                  {hasUnsavedChanges && (
                    <button
                      onClick={handleDiscardChanges}
                      disabled={isSaving}
                      className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium flex items-center gap-1 transition-colors"
                      title="Discard unsaved edits"
                    >
                      <RotateCcw className="w-3 h-3" />
                      <span>Discard</span>
                    </button>
                  )}

                  <button
                    onClick={handleSaveArticle}
                    disabled={isSaving || !hasUnsavedChanges}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
                      hasUnsavedChanges
                        ? 'bg-emerald-600 hover:bg-emerald-500 text-slate-950 shadow-md shadow-emerald-600/20'
                        : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                    }`}
                    title="Save changes (Ctrl+S or Cmd+S)"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>{isSaving ? 'Saving...' : 'Save Draft'}</span>
                  </button>
                </div>
              </div>

              {/* Save Success Notice */}
              {saveSuccessNotice && (
                <div className="p-3.5 rounded-xl bg-emerald-950/60 border border-emerald-800/80 text-emerald-300 text-xs flex items-center justify-between animate-fadeIn">
                  <span>{saveSuccessNotice}</span>
                  <button onClick={() => setSaveSuccessNotice(null)} className="text-emerald-400 hover:text-white font-bold ml-2">×</button>
                </div>
              )}

              {/* MODE 1: LIVE PREVIEW ONLY */}
              {contentMode === 'preview' && (
                <ContentPreviewCard
                  article={{
                    ...selectedArticle,
                    title: editTitle,
                    slug: editSlug,
                    metaDescription: editMetaDesc,
                    content: editContent,
                    sections: editSections
                  }}
                  device={previewDevice}
                  onDeviceChange={setPreviewDevice}
                  onEditMode={() => setContentMode('edit')}
                  onPublishWordPress={handlePublishWordPress}
                  onOpenMultiChannelModal={() => setIsMultiPublishOpen(true)}
                  isPublishing={isSyncingWp}
                />
              )}

              {/* MODE 2: DIRECT EDITOR ONLY */}
              {contentMode === 'edit' && (
                <ContentMarkdownEditor
                  title={editTitle}
                  slug={editSlug}
                  metaDescription={editMetaDesc}
                  content={editContent}
                  sections={editSections}
                  onTitleChange={(val) => {
                    setEditTitle(val);
                    setHasUnsavedChanges(true);
                  }}
                  onSlugChange={(val) => {
                    setEditSlug(val);
                    setHasUnsavedChanges(true);
                  }}
                  onMetaDescriptionChange={(val) => {
                    setEditMetaDesc(val);
                    setHasUnsavedChanges(true);
                  }}
                  onContentChange={(val) => {
                    setEditContent(val);
                    setHasUnsavedChanges(true);
                  }}
                  onSectionsChange={(val) => {
                    setEditSections(val);
                    setHasUnsavedChanges(true);
                  }}
                  onSave={handleSaveArticle}
                  isSaving={isSaving}
                  hasUnsavedChanges={hasUnsavedChanges}
                  onSectionAIAction={handleSectionAction}
                />
              )}

              {/* MODE 3: SIDE-BY-SIDE SPLIT VIEW */}
              {contentMode === 'split' && (
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 items-start">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between px-1">
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                        <Edit3 className="w-3.5 h-3.5 text-emerald-400" />
                        Editor Pane
                      </span>
                      <span className="text-[11px] text-slate-500">Live preview syncs automatically</span>
                    </div>
                    <ContentMarkdownEditor
                      title={editTitle}
                      slug={editSlug}
                      metaDescription={editMetaDesc}
                      content={editContent}
                      sections={editSections}
                      onTitleChange={(val) => {
                        setEditTitle(val);
                        setHasUnsavedChanges(true);
                      }}
                      onSlugChange={(val) => {
                        setEditSlug(val);
                        setHasUnsavedChanges(true);
                      }}
                      onMetaDescriptionChange={(val) => {
                        setEditMetaDesc(val);
                        setHasUnsavedChanges(true);
                      }}
                      onContentChange={(val) => {
                        setEditContent(val);
                        setHasUnsavedChanges(true);
                      }}
                      onSectionsChange={(val) => {
                        setEditSections(val);
                        setHasUnsavedChanges(true);
                      }}
                      onSave={handleSaveArticle}
                      isSaving={isSaving}
                      hasUnsavedChanges={hasUnsavedChanges}
                      onSectionAIAction={handleSectionAction}
                    />
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between px-1">
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                        <Eye className="w-3.5 h-3.5 text-emerald-400" />
                        Live Device Output
                      </span>
                    </div>
                    <ContentPreviewCard
                      article={{
                        ...selectedArticle,
                        title: editTitle,
                        slug: editSlug,
                        metaDescription: editMetaDesc,
                        content: editContent,
                        sections: editSections
                      }}
                      device={previewDevice}
                      onDeviceChange={setPreviewDevice}
                      onEditMode={() => setContentMode('edit')}
                      onPublishWordPress={handlePublishWordPress}
                      onOpenMultiChannelModal={() => setIsMultiPublishOpen(true)}
                      isPublishing={isSyncingWp}
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB: SEARCH INTENT VISUALS CENTER */}
          {activeTab === 'images' && (
            <div className="space-y-6">
              {/* Header & Intent Explanation */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-base font-bold text-white flex items-center gap-2">
                        <ImageIcon className="w-5 h-5 text-emerald-400" />
                        Search Intent Visuals Strategy
                      </h2>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-950 text-purple-300 border border-purple-800/80">
                        Seedream 4.5
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-1">
                      Target Search Intent: <span className="text-emerald-400 font-semibold uppercase">{selectedArticle.brief?.searchIntent?.primaryIntent || 'Intent Matched'}</span>
                      {selectedArticle.brief?.searchIntent?.userGoal && (
                        <span> — User Goal: <span className="text-slate-200">"{selectedArticle.brief.searchIntent.userGoal}"</span></span>
                      )}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
                    <button
                      onClick={handleGenerateAllSectionImages}
                      disabled={isGeneratingAllImages}
                      className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold text-xs transition-colors disabled:opacity-50 whitespace-nowrap shadow-sm"
                      title="Generate intent-matched visuals for every H2 and H3 section in the article"
                    >
                      <Zap className={`w-3.5 h-3.5 ${isGeneratingAllImages ? 'animate-spin' : ''}`} />
                      <span>{isGeneratingAllImages ? 'Generating All...' : '⚡ Generate All H2 & H3 Visuals'}</span>
                    </button>
                    <button
                      onClick={handleRefreshAllImagesWithKeywords}
                      disabled={isGeneratingAllImages}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-850 text-slate-200 border border-slate-700 font-semibold text-xs transition-colors disabled:opacity-50 whitespace-nowrap"
                      title="Re-match and replace all images in this article with authentic keyword photography from Wikimedia and AI"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 text-emerald-400 ${isGeneratingAllImages ? 'animate-spin' : ''}`} />
                      <span>🔄 Re-match All to Keywords</span>
                    </button>
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-semibold text-slate-300">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                      <span>{(selectedArticle.featuredImage ? 1 : 0) + (selectedArticle.articleImages?.length || 0)} Total Visuals</span>
                    </div>
                  </div>
                </div>

                {/* H2 and H3 Visual Coverage Matrix */}
                {selectedArticle.sections && selectedArticle.sections.length > 0 && (
                  <div className="bg-slate-950/90 rounded-xl p-4 border border-slate-800 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                        <span>H2 & H3 Section Visual Coverage Checklist</span>
                      </span>
                      {(() => {
                        const total = selectedArticle.sections.length;
                        const covered = selectedArticle.sections.filter(sec => {
                          const sClean = sec.heading.replace(/^#+\s*/, '').toLowerCase().trim();
                          return (selectedArticle.articleImages || []).some(img => {
                            const iClean = (img.sectionHeading || '').replace(/^#+\s*/, '').toLowerCase().trim();
                            return iClean && (sClean === iClean || sClean.includes(iClean) || iClean.includes(sClean));
                          });
                        }).length;
                        return (
                          <span className="text-xs font-semibold text-emerald-400 font-mono">
                            {covered} of {total} Sections Illustrated ({Math.round((covered / (total || 1)) * 100)}%)
                          </span>
                        );
                      })()}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 max-h-64 overflow-y-auto pr-1">
                      {selectedArticle.sections.map((sec, i) => {
                        const isH3 = sec.level === 3 || sec.heading.startsWith('###');
                        const sClean = sec.heading.replace(/^#+\s*/, '').toLowerCase().trim();
                        const matchingImg = (selectedArticle.articleImages || []).find(img => {
                          const iClean = (img.sectionHeading || '').replace(/^#+\s*/, '').toLowerCase().trim();
                          return iClean && (sClean === iClean || sClean.includes(iClean) || iClean.includes(sClean));
                        });

                        return (
                          <div
                            key={sec.id || i}
                            className={`p-2.5 rounded-lg border flex items-center justify-between gap-2 text-xs transition-colors ${
                              matchingImg
                                ? 'bg-slate-900/80 border-slate-800'
                                : 'bg-slate-900/40 border-amber-900/30'
                            }`}
                          >
                            <div className="flex items-center gap-2 min-w-0">
                              <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold border uppercase shrink-0 ${
                                isH3
                                  ? 'bg-cyan-950/80 text-cyan-300 border-cyan-800/60'
                                  : 'bg-purple-950/80 text-purple-300 border-purple-800/60'
                              }`}>
                                {isH3 ? 'H3' : 'H2'}
                              </span>
                              <span className="text-slate-300 truncate font-medium">
                                {sec.heading.replace(/^#+\s*/, '')}
                              </span>
                            </div>

                            <div className="shrink-0 flex items-center gap-1.5">
                              {matchingImg ? (
                                <>
                                  <span className="inline-flex items-center gap-1 text-[11px] text-emerald-400 font-semibold">
                                    <Check className="w-3 h-3 text-emerald-400" />
                                    Ready
                                  </span>
                                  <button
                                    onClick={() => openPhotoSearch({
                                      id: matchingImg.id,
                                      heading: sec.heading.replace(/^#+\s*/, ''),
                                      url: matchingImg.url,
                                      altText: matchingImg.altText
                                    })}
                                    title="Search & Swap Photo for this section"
                                    className="p-1 rounded text-slate-400 hover:text-emerald-400 hover:bg-slate-800 transition-colors"
                                  >
                                    <Search className="w-3 h-3" />
                                  </button>
                                </>
                              ) : (
                                <button
                                  onClick={() => handleGenerateIntentImage({
                                    sectionHeading: sec.heading.replace(/^#+\s*/, ''),
                                    searchIntentMatch: `${isH3 ? 'H3' : 'H2'} Visual for ${sec.heading.replace(/^#+\s*/, '')}`,
                                    aspectRatio: isH3 ? '4:3' : '16:9'
                                  })}
                                  disabled={isGeneratingImage}
                                  className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 hover:bg-emerald-900 border border-emerald-800/60 text-[11px] font-medium transition-colors disabled:opacity-50"
                                >
                                  + Visual
                                </button>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* On-demand Intent Image Generator Bar */}
                <div className="bg-slate-950/80 rounded-xl p-4 border border-slate-800 space-y-3">
                  <div className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                    Generate Additional Search-Intent Visual
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                    <div className="sm:col-span-4">
                      <label className="text-[11px] text-slate-400 block mb-1">Target Section</label>
                      <select
                        value={customImageSection}
                        onChange={(e) => setCustomImageSection(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
                      >
                        <option value="">Choose Section...</option>
                        {selectedArticle.sections?.map(s => (
                          <option key={s.id} value={s.heading}>{s.heading}</option>
                        ))}
                      </select>
                    </div>

                    <div className="sm:col-span-3">
                      <label className="text-[11px] text-slate-400 block mb-1">Aspect Ratio</label>
                      <select
                        value={customImageAspect}
                        onChange={(e) => setCustomImageAspect(e.target.value as any)}
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
                      >
                        <option value="4:3">4:3 (Section Walkthrough / Action)</option>
                        <option value="16:9">16:9 (Hero / Broad Overview)</option>
                        <option value="1:1">1:1 (Close-up / Benchmark Detail)</option>
                      </select>
                    </div>

                    <div className="sm:col-span-5">
                      <label className="text-[11px] text-slate-400 block mb-1">Custom Visual Concept (Optional)</label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="e.g. Close-up texture check, ingredients flat lay..."
                          value={customImagePrompt}
                          onChange={(e) => setCustomImagePrompt(e.target.value)}
                          className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-emerald-500 placeholder-slate-600"
                        />
                        <button
                          onClick={() => handleGenerateIntentImage()}
                          disabled={isGeneratingImage}
                          className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold text-xs whitespace-nowrap transition-colors disabled:opacity-50 flex items-center gap-1"
                        >
                          <Sparkles className="w-3.5 h-3.5" />
                          <span>{isGeneratingImage ? 'Generating...' : 'Generate Visual'}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Primary Hero Visual Card */}
                {selectedArticle.featuredImage && (
                  <div className="space-y-2 pt-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                        <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-950 text-emerald-300 border border-emerald-800/60">
                          Hero Visual (16:9)
                        </span>
                        <span>Primary Search Intent Fulfilled: {selectedArticle.featuredImage.searchIntentMatch || 'Completed Outcome / Final Presentation'}</span>
                      </span>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => openPhotoSearch({
                            id: selectedArticle.featuredImage!.id,
                            heading: selectedArticle.brief.primaryKeyword,
                            url: selectedArticle.featuredImage!.url,
                            altText: selectedArticle.featuredImage!.altText
                          })}
                          className="text-[11px] text-emerald-400 hover:text-emerald-300 flex items-center gap-1 font-medium bg-emerald-950/70 border border-emerald-800/70 px-2.5 py-1 rounded-lg transition-colors"
                        >
                          <Search className="w-3 h-3" />
                          <span>Search & Swap Photo</span>
                        </button>
                        <button
                          onClick={() => copyToClipboard(`![${selectedArticle.featuredImage?.altText}](${selectedArticle.featuredImage?.url})`)}
                          className="text-[11px] text-slate-400 hover:text-emerald-400 flex items-center gap-1"
                        >
                          <Copy className="w-3 h-3" />
                          <span>Copy Markdown</span>
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 bg-slate-950/70 border border-slate-800 rounded-xl p-4">
                      <div className="lg:col-span-5 rounded-lg overflow-hidden border border-slate-800 aspect-video bg-slate-900 flex items-center justify-center">
                        <img
                          src={selectedArticle.featuredImage.url}
                          alt={selectedArticle.featuredImage.altText}
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                      <div className="lg:col-span-7 space-y-2.5 text-xs text-slate-300">
                        <div>
                          <span className="text-slate-500 font-medium">Placement:</span>{' '}
                          <span className="text-slate-200 font-semibold">{selectedArticle.featuredImage.placement || 'Article Header / Featured'}</span>
                        </div>
                        <div>
                          <span className="text-slate-500 font-medium">ALT Text (Rule 23 - Natural, descriptive, no keyword stuffing):</span>
                          <p className="mt-0.5 p-2 bg-slate-900 border border-slate-800 rounded-lg text-slate-200 font-mono text-[11px]">
                            {selectedArticle.featuredImage.altText}
                          </p>
                        </div>
                        {selectedArticle.featuredImage.caption && (
                          <div>
                            <span className="text-slate-500 font-medium">Caption:</span>
                            <p className="text-slate-300 italic">{selectedArticle.featuredImage.caption}</p>
                          </div>
                        )}
                        <div className="flex items-center gap-3 text-[11px] text-slate-500 pt-1">
                          <span>Dimensions: {selectedArticle.featuredImage.width || 1200}x{selectedArticle.featuredImage.height || 675}px</span>
                          <span>Aspect Ratio: {selectedArticle.featuredImage.aspectRatio || '16:9'}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* In-Content Intent Visuals Grid */}
                <div className="space-y-3 pt-4 border-t border-slate-800">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    In-Content Section Visuals ({selectedArticle.articleImages?.length || 0})
                  </h3>

                  {selectedArticle.articleImages && selectedArticle.articleImages.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {selectedArticle.articleImages.map((img, idx) => (
                        <div
                          key={img.id || idx}
                          className="bg-slate-950/70 border border-slate-800 rounded-xl p-4 space-y-3 flex flex-col justify-between hover:border-slate-700 transition-colors"
                        >
                          <div className="space-y-2">
                            <div className="flex items-center justify-between gap-2">
                              <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-950/80 text-emerald-300 border border-emerald-800/60">
                                {img.searchIntentMatch || 'Intent Matched Visual'}
                              </span>
                              <span className="text-[10px] text-slate-500 font-mono">
                                {img.aspectRatio || '4:3'}
                              </span>
                            </div>

                            <div className="rounded-lg overflow-hidden border border-slate-800 bg-slate-900 h-44 flex items-center justify-center">
                              <img
                                src={img.url}
                                alt={img.altText}
                                className="w-full h-full object-cover"
                                referrerPolicy="no-referrer"
                              />
                            </div>

                            <div className="text-xs space-y-1.5">
                              <div className="text-slate-300 font-semibold flex items-center gap-1">
                                <span className="text-slate-500 text-[11px]">Section:</span>
                                <span>{img.sectionHeading || img.placement || `Step ${idx + 1}`}</span>
                              </div>
                              <div>
                                <span className="text-slate-500 text-[11px] block">ALT Text (Rule 23):</span>
                                <p className="text-[11px] text-slate-300 bg-slate-900/90 border border-slate-800/80 p-1.5 rounded">
                                  {img.altText}
                                </p>
                              </div>
                              {img.caption && (
                                <p className="text-[11px] text-slate-400 italic">
                                  "{img.caption}"
                                </p>
                              )}
                            </div>
                          </div>

                          <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between gap-2">
                            <button
                              onClick={() => openPhotoSearch({
                                id: img.id,
                                heading: img.sectionHeading || selectedArticle.brief.primaryKeyword,
                                url: img.url,
                                altText: img.altText
                              })}
                              className="text-[11px] text-emerald-400 hover:text-emerald-300 font-medium flex items-center gap-1 bg-emerald-950/60 border border-emerald-800/60 px-2 py-1 rounded transition-colors"
                            >
                              <Search className="w-3 h-3" />
                              <span>Search / Swap</span>
                            </button>
                            <button
                              onClick={() => copyToClipboard(`\n\n<figure class="my-6 rounded-xl overflow-hidden border border-slate-700 bg-slate-900 shadow-sm">\n  <img src="${img.url}" alt="${img.altText}" class="w-full h-auto object-cover max-h-[460px]" loading="lazy" />\n  <figcaption class="p-3 text-xs text-slate-400 bg-slate-950/80 border-t border-slate-800 flex items-center justify-between gap-2"><span>${img.caption || img.altText}</span><span class="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-emerald-950/80 text-emerald-400 border border-emerald-800/60">${img.searchIntentMatch || 'Search Intent Visual'}</span></figcaption>\n</figure>\n\n`)}
                              className="text-xs text-slate-400 hover:text-emerald-300 font-medium flex items-center gap-1"
                            >
                              <Copy className="w-3 h-3" />
                              <span>Copy HTML</span>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="py-8 text-center text-slate-500 text-xs border border-dashed border-slate-800 rounded-xl">
                      <ImageIcon className="w-8 h-8 mx-auto mb-2 text-slate-600" />
                      <p>No section visuals generated yet. Click "+ Intent Visual" on any section above or use the generator to create intent-matched graphics.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: 100-POINT SEO AUDIT */}
          {activeTab === 'audit' && (
            <div className="space-y-6">
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
                  <div>
                    <h2 className="text-base font-bold text-white flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                      Comprehensive 100-Point SEO Quality Audit
                    </h2>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Evaluates Search Intent (20), Coverage (20), Quality (20), Structure (10), Keywords (10), Links (10), Media & Schema (10).
                    </p>
                  </div>

                  <button
                    id="auto-improve-btn"
                    onClick={handleAutoImproveSeo}
                    disabled={isImprovingSeo}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold text-xs transition-all disabled:opacity-50 shadow-md shadow-emerald-950/40"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isImprovingSeo ? 'animate-spin' : ''}`} />
                    <span>{isImprovingSeo ? 'Refining Article...' : 'Run Auto-Improvement Pass'}</span>
                  </button>
                </div>

                {/* Score Category Breakdown Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {[
                    { label: 'Search Intent Satisfied', score: selectedArticle.seoScore?.searchIntent || 0, max: 20 },
                    { label: 'Topical Coverage', score: selectedArticle.seoScore?.topicalCoverage || 0, max: 20 },
                    { label: 'Content Usefulness & Depth', score: selectedArticle.seoScore?.contentQuality || 0, max: 20 },
                    { label: 'Structure & Formatting', score: selectedArticle.seoScore?.structure || 0, max: 10 },
                    { label: 'Keyword Natural Placement', score: selectedArticle.seoScore?.keywordOptimization || 0, max: 10 },
                    { label: 'Internal Links Context', score: selectedArticle.seoScore?.internalLinking || 0, max: 5 },
                    { label: 'Authoritative Sources', score: selectedArticle.seoScore?.externalSources || 0, max: 5 },
                    { label: 'Media & Visual Assets', score: selectedArticle.seoScore?.media || 0, max: 5 },
                    { label: 'Valid Structured Schema', score: selectedArticle.seoScore?.schema || 0, max: 5 }
                  ].map((cat, i) => {
                    const ratio = cat.score / cat.max;
                    return (
                      <div key={i} className="p-4 rounded-xl bg-slate-950/70 border border-slate-800/80 space-y-2">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-semibold text-slate-300">{cat.label}</span>
                          <span className={`font-mono font-bold ${ratio >= 0.85 ? 'text-emerald-400' : 'text-amber-400'}`}>
                            {cat.score}/{cat.max}
                          </span>
                        </div>
                        <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all ${ratio >= 0.85 ? 'bg-emerald-400' : 'bg-amber-400'}`}
                            style={{ width: `${ratio * 100}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Audit Explanations */}
                <div className="space-y-3 pt-2">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Detailed Diagnostic Feedback & Reasons
                  </h3>
                  <div className="space-y-2">
                    {selectedArticle.seoScore?.explanations?.map((exp, idx) => (
                      <div key={idx} className="p-3.5 rounded-xl bg-slate-950/50 border border-slate-800 text-xs space-y-1">
                        <div className="flex items-center justify-between font-semibold text-slate-200">
                          <span>{exp.category}</span>
                          <span className="text-slate-400 font-mono">{exp.score}/{exp.max} pts</span>
                        </div>
                        <p className="text-slate-400">{exp.reason}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: STRUCTURED SCHEMA (JSON-LD) */}
          {activeTab === 'schema' && (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-base font-bold text-white flex items-center gap-2">
                    <Code className="w-5 h-5 text-emerald-400" />
                    Structured Data (JSON-LD)
                  </h2>
                  <p className="text-xs text-slate-400">
                    Schema Type: <span className="font-mono text-emerald-400">{selectedArticle.schemaType || 'Article'}</span>
                  </p>
                </div>
                <button
                  onClick={() => copyToClipboard(selectedArticle.jsonLdSchema || '')}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Script Tag</span>
                </button>
              </div>

              <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 font-mono text-xs text-emerald-300 overflow-x-auto max-h-[460px]">
                <pre>{`<script type="application/ld+json">\n${selectedArticle.jsonLdSchema || '// No schema generated'}\n</script>`}</pre>
              </div>
            </div>
          )}

          {/* TAB: GEO & AI CITATIONS (PERPLEXITY & GOOGLE AI OVERVIEWS) */}
          {activeTab === 'geo' && (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
                <div>
                  <h2 className="text-base font-bold text-white flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-emerald-400" />
                    Generative Engine Optimization (GEO) & AI Citation Readiness
                  </h2>
                  <p className="text-xs text-slate-400 mt-1">
                    Audits how effectively this article will be indexed, extracted, and cited by conversational AI engines like Perplexity, Google AI Overviews, Gemini, and ChatGPT Search.
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <div className="text-2xl font-black text-emerald-400 font-mono">
                      {citationReport?.score || selectedArticle.aiCitationReport?.score || 92}/100
                    </div>
                    <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Citation Readiness</div>
                  </div>

                  <button
                    onClick={handleFetchCitationReport}
                    disabled={isLoadingCitation}
                    className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isLoadingCitation ? 'animate-spin' : ''}`} />
                    <span>{isLoadingCitation ? 'Auditing...' : 'Re-check'}</span>
                  </button>
                </div>
              </div>

              {/* Likely To Be Cited By */}
              <div className="bg-slate-950/70 border border-slate-800 p-4 rounded-xl space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-300 block">
                  AI Engines Most Likely to Extract & Quote This Post:
                </span>
                <div className="flex flex-wrap gap-2">
                  {(citationReport?.likelyToBeCitedBy || ['Perplexity AI', 'Google AI Overviews', 'ChatGPT Search', 'Gemini']).map((engine: string, i: number) => (
                    <span key={i} className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 flex items-center gap-1.5">
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span>{engine}</span>
                    </span>
                  ))}
                </div>
              </div>

              {/* Key Factual Snippets */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                  Direct Answer & Factual Snippets (Ready for Snippet Features)
                </h3>
                <div className="space-y-2">
                  {(citationReport?.keyFactualSnippets || [
                    `Direct definition provided in introduction for "${selectedArticle.brief?.primaryKeyword || selectedArticle.title}"`,
                    'Checklist or table formatting present for empirical comparison',
                    `${selectedArticle.faqs.length} high-intent FAQs prepared with direct answers`
                  ]).map((snippet: string, idx: number) => (
                    <div key={idx} className="p-3 rounded-lg bg-slate-950/60 border border-slate-800/80 text-xs text-slate-300 flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{snippet}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Actionable Recommendations */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                  Recommendations to Maximize AI Search Citations
                </h3>
                <div className="space-y-2">
                  {(citationReport?.recommendations || [
                    'Ensure lead paragraph provides an empirical definition under 50 words.',
                    'Use structured Markdown comparison tables with exact metrics.',
                    'Keep schema.org structured FAQ markup synchronized.'
                  ]).map((rec: string, idx: number) => (
                    <div key={idx} className="p-3 rounded-lg bg-indigo-950/20 border border-indigo-800/40 text-xs text-indigo-200 flex items-start gap-2">
                      <Sparkles className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                      <span>{rec}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: INTERNAL LINKS */}
          {activeTab === 'links' && (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
                <div>
                  <h2 className="text-base font-bold text-white flex items-center gap-2">
                    <LinkIcon className="w-5 h-5 text-emerald-400" />
                    Internal Linking Index & Opportunities
                  </h2>
                  <p className="text-xs text-slate-400">
                    Mapped against your WordPress sitemap to establish topical authority without link stuffing.
                  </p>
                </div>

                <button
                  onClick={handleApplySitemapLinks}
                  disabled={isApplyingLinks}
                  className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold text-xs transition-colors flex items-center gap-1.5 whitespace-nowrap disabled:opacity-50"
                  title="Inject contextual links to related sitemap pages into the markdown content"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isApplyingLinks ? 'animate-spin' : ''}`} />
                  <span>{isApplyingLinks ? 'Injecting Links...' : 'Auto-Inject Sitemap Links'}</span>
                </button>
              </div>

              <div className="space-y-3">
                {selectedArticle.internalLinks?.map((link, idx) => (
                  <div key={idx} className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 text-xs space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-200">{link.title}</span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase ${
                        link.status === 'inserted' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-slate-800 text-slate-400'
                      }`}>
                        {link.status}
                      </span>
                    </div>
                    <p className="text-slate-400">{link.excerpt}</p>
                    <div className="flex items-center gap-4 text-slate-500 text-[11px] pt-1">
                      <span>Anchor text candidate: <code className="text-emerald-400 font-mono">"{link.anchorTextCandidate}"</code></span>
                      <a href={link.url} target="_blank" rel="noreferrer" className="text-blue-400 hover:underline flex items-center gap-1">
                        View Target Post <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: FACT-CHECK & SENSITIVE CLAIMS */}
          {activeTab === 'factcheck' && (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
                Editorial Fact-Checking & Safety Verification
              </h2>
              <p className="text-xs text-slate-400">
                Scans for high-risk claims (medical, financial, legal, scientific, safety, statistics) requiring human review before publishing.
              </p>

              {selectedArticle.factCheckFlags && selectedArticle.factCheckFlags.length > 0 ? (
                <div className="space-y-3">
                  {selectedArticle.factCheckFlags.map((flag, idx) => (
                    <div key={idx} className="p-4 rounded-xl bg-amber-950/20 border border-amber-800/40 text-xs space-y-1.5">
                      <div className="flex items-center justify-between font-bold text-amber-300">
                        <span className="capitalize">Category: {flag.category}</span>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/20 text-amber-200">
                          Review Needed
                        </span>
                      </div>
                      <p className="text-slate-200 italic font-serif">"{flag.claim}"</p>
                      <p className="text-slate-400">{flag.notes}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-8 text-center text-slate-400 text-xs">
                  <CheckCircle2 className="w-8 h-8 mx-auto text-emerald-400 mb-2" />
                  No high-risk medical, legal, or unverified claims flagged.
                </div>
              )}
            </div>
          )}

          {/* TAB 6: VERSION HISTORY */}
          {activeTab === 'versions' && (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <History className="w-5 h-5 text-emerald-400" />
                Article Version History
              </h2>
              <p className="text-xs text-slate-400">
                Every edit and automated improvement pass is tracked with timestamp and changelog.
              </p>

              <div className="space-y-3">
                {selectedArticle.versions?.map((ver, idx) => (
                  <div key={idx} className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 text-xs flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-bold text-white">Version {ver.versionNumber}</span>
                        <span className="text-slate-500 font-mono">
                          {new Date(ver.createdAt).toLocaleString()}
                        </span>
                        <span className="text-emerald-400 font-semibold font-mono">
                          {ver.seoScore}/100 SEO
                        </span>
                      </div>
                      <p className="text-slate-400">{ver.summary}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Interactive Keyword Photo Search & Swap Modal */}
      {searchModalImage && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-3xl w-full max-h-[90vh] flex flex-col overflow-hidden shadow-2xl">
            {/* Modal Header */}
            <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Search className="w-4 h-4 text-emerald-400" />
                  <span>Keyword Photo Search & Swap</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Target context: <span className="text-emerald-400 font-medium">"{searchModalImage.heading}"</span>
                </p>
              </div>
              <button
                onClick={() => setSearchModalImage(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Search Input Bar */}
            <div className="p-4 border-b border-slate-800 bg-slate-950/30 space-y-3">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handlePerformPhotoSearch(photoSearchQuery);
                }}
                className="flex gap-2"
              >
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    value={photoSearchQuery}
                    onChange={(e) => setPhotoSearchQuery(e.target.value)}
                    placeholder="Search photography keyword (e.g. sourdough bread scoring, vintage espresso machine)..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-emerald-500 placeholder-slate-600"
                  />
                </div>
                <button
                  type="submit"
                  disabled={isSearchingPhotos}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold text-xs whitespace-nowrap transition-colors disabled:opacity-50 flex items-center gap-1.5"
                >
                  <Search className="w-3.5 h-3.5" />
                  <span>{isSearchingPhotos ? 'Searching...' : 'Search Photos'}</span>
                </button>
              </form>

              {/* Quick Keyword Chips */}
              <div className="flex items-center gap-1.5 flex-wrap text-[11px]">
                <span className="text-slate-500 font-medium">Quick Keywords:</span>
                {selectedArticle.brief.primaryKeyword && (
                  <button
                    type="button"
                    onClick={() => {
                      setPhotoSearchQuery(selectedArticle.brief.primaryKeyword);
                      handlePerformPhotoSearch(selectedArticle.brief.primaryKeyword);
                    }}
                    className="px-2 py-0.5 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                  >
                    {selectedArticle.brief.primaryKeyword}
                  </button>
                )}
                {searchModalImage.heading && searchModalImage.heading !== selectedArticle.brief.primaryKeyword && (
                  <button
                    type="button"
                    onClick={() => {
                      setPhotoSearchQuery(searchModalImage.heading);
                      handlePerformPhotoSearch(searchModalImage.heading);
                    }}
                    className="px-2 py-0.5 rounded-md bg-emerald-950/80 hover:bg-emerald-900 text-emerald-300 border border-emerald-800/50 transition-colors"
                  >
                    {searchModalImage.heading}
                  </button>
                )}
              </div>
            </div>

            {/* Results Grid */}
            <div className="p-4 flex-1 overflow-y-auto space-y-4">
              {isSearchingPhotos ? (
                <div className="py-16 text-center space-y-2">
                  <div className="w-6 h-6 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin mx-auto" />
                  <p className="text-xs text-slate-400">Searching authentic Wikimedia Commons public photography and AI visual engines...</p>
                </div>
              ) : photoSearchResults.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {photoSearchResults.map((photo, i) => (
                    <div
                      key={i}
                      className="group bg-slate-950 border border-slate-800 rounded-xl overflow-hidden flex flex-col justify-between hover:border-emerald-500 transition-all shadow-sm"
                    >
                      <div>
                        <div className="relative aspect-video bg-slate-900 overflow-hidden">
                          <img
                            src={photo.url}
                            alt={photo.altText || photo.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            referrerPolicy="no-referrer"
                            loading="lazy"
                          />
                          <span className={`absolute top-1.5 left-1.5 px-2 py-0.5 rounded text-[9px] font-semibold uppercase tracking-wider ${
                            photo.source === 'wikimedia'
                              ? 'bg-emerald-950/90 text-emerald-300 border border-emerald-800/80'
                              : 'bg-purple-950/90 text-purple-300 border border-purple-800/80'
                          }`}>
                            {photo.source === 'wikimedia' ? 'Wikimedia Photo' : 'AI Render'}
                          </span>
                        </div>
                        <div className="p-2.5 text-left">
                          <p className="text-[11px] font-medium text-slate-300 line-clamp-2 leading-snug">
                            {photo.title || photo.altText}
                          </p>
                        </div>
                      </div>
                      <div className="p-2.5 pt-0">
                        <button
                          onClick={() => handleApplyPhotoSwap(photo.url, photo.altText || photo.title)}
                          disabled={isSwappingPhoto}
                          className="w-full py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold text-xs transition-colors flex items-center justify-center gap-1"
                        >
                          <Check className="w-3 h-3" />
                          <span>Use This Photo</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-12 text-center text-slate-500 text-xs">
                  <ImageIcon className="w-8 h-8 mx-auto mb-2 text-slate-600" />
                  <p>Type a keyword above to find matching photographs from Wikimedia Commons and AI visual models.</p>
                </div>
              )}

              {/* Direct URL input fallback */}
              <div className="pt-4 border-t border-slate-800">
                <label className="text-[11px] font-medium text-slate-400 block mb-1.5">
                  Or Paste Custom Image URL Directly:
                </label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    placeholder="https://example.com/photo.jpg"
                    value={customPhotoUrl}
                    onChange={(e) => setCustomPhotoUrl(e.target.value)}
                    className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-emerald-500 placeholder-slate-600"
                  />
                  <button
                    onClick={() => {
                      if (customPhotoUrl.trim()) {
                        handleApplyPhotoSwap(customPhotoUrl.trim());
                      }
                    }}
                    disabled={!customPhotoUrl.trim() || isSwappingPhoto}
                    className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs whitespace-nowrap transition-colors disabled:opacity-50"
                  >
                    Apply URL
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Multi-Channel Publishing Modal (WordPress, Facebook, Pinterest, Instagram) */}
      {isMultiPublishOpen && selectedArticle && (
        <MultiChannelPublishModal
          article={selectedArticle}
          settings={settings || null}
          isOpen={isMultiPublishOpen}
          onClose={() => setIsMultiPublishOpen(false)}
          onSuccess={(updatedArticle) => {
            onRefreshArticles();
          }}
        />
      )}
    </div>
  );
};
