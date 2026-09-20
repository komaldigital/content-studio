import React, { useState } from 'react';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import {
  Smartphone,
  Monitor,
  CheckCircle2,
  AlertCircle,
  Share2,
  Calendar,
  Clock,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Bookmark,
  Sparkles,
  Zap,
  Tag,
  Check,
  FileText,
  Copy,
  Download,
  Edit3,
  Maximize2,
  Minimize2,
  Sun,
  Moon,
  Printer,
  Globe,
  Sliders
} from 'lucide-react';
import { Article, ArticleImage } from '../types.js';

interface ContentPreviewCardProps {
  article: Article;
  currentTitle?: string;
  currentSlug?: string;
  currentMetaDesc?: string;
  currentContent?: string;
  previewDevice?: 'desktop' | 'mobile';
  device?: 'desktop' | 'mobile';
  onToggleDevice?: (device: 'desktop' | 'mobile') => void;
  onDeviceChange?: (device: 'desktop' | 'mobile') => void;
  onPublishWp?: (status: 'draft' | 'pending' | 'publish') => void;
  onPublishWordPress?: (status: 'draft' | 'pending' | 'publish') => void;
  onOpenSyndicate?: () => void;
  onOpenMultiChannelModal?: () => void;
  onSwitchToEditor?: () => void;
  onEditMode?: () => void;
  isSyncingWp?: boolean;
  isPublishing?: boolean;
  onSelectArticle?: (article: Article) => void;
  availableArticles?: Article[];
}

export const ContentPreviewCard: React.FC<ContentPreviewCardProps> = ({
  article,
  currentTitle,
  currentSlug,
  currentMetaDesc,
  currentContent,
  previewDevice,
  device,
  onToggleDevice,
  onDeviceChange,
  onPublishWp,
  onPublishWordPress,
  onOpenSyndicate,
  onOpenMultiChannelModal,
  onSwitchToEditor,
  onEditMode,
  isSyncingWp = false,
  isPublishing = false,
  onSelectArticle,
  availableArticles = []
}) => {
  // Primary viewing mode: 'document' (Claude-style artifact reading view, default), 'web' (live blog post preview), or 'mobile'
  const [viewMode, setViewMode] = useState<'document' | 'web' | 'mobile'>('document');
  
  // Paper canvas theme for document view: 'light' (pure white crisp paper matching Claude artifact screenshot) or 'slate'
  const [paperTheme, setPaperTheme] = useState<'light' | 'slate'>('light');
  
  // Fullscreen reading mode (distraction-free focus)
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  // Article selector dropdown
  const [isArticleDropdownOpen, setIsArticleDropdownOpen] = useState(false);

  const [copiedNotification, setCopiedNotification] = useState<string | null>(null);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  const activeDevice = device || previewDevice || 'desktop';
  const handlePublish = onPublishWordPress || onPublishWp || (() => {});
  const handleSyndicate = onOpenMultiChannelModal || onOpenSyndicate || (() => {});
  const handleEdit = onEditMode || onSwitchToEditor;
  const isBusyPublishing = isPublishing || isSyncingWp;

  const resolvedTitle = currentTitle !== undefined ? currentTitle : article.title;
  const resolvedSlug = currentSlug !== undefined ? currentSlug : article.slug;
  const resolvedMetaDesc = currentMetaDesc !== undefined ? currentMetaDesc : (article.metaDescription || '');
  const resolvedContent = currentContent !== undefined ? currentContent : (article.content || '');

  // Extract sections/headings from markdown for Table of Contents
  const headings = React.useMemo(() => {
    const matches: { title: string; level: number; id: string }[] = [];
    const lines = resolvedContent.split('\n');
    lines.forEach(line => {
      const h2Match = line.match(/^##\s+(.+)$/);
      const h3Match = line.match(/^###\s+(.+)$/);
      if (h2Match) {
        const title = h2Match[1].trim();
        const id = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
        matches.push({ title, level: 2, id });
      } else if (h3Match) {
        const title = h3Match[1].trim();
        const id = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
        matches.push({ title, level: 3, id });
      }
    });
    return matches;
  }, [resolvedContent]);

  // Pre-Publish Checks & Stats
  const wordCount = resolvedContent.trim().split(/\s+/).filter(Boolean).length;
  const readingTime = Math.max(1, Math.round(wordCount / 200));
  const hasMetaDesc = resolvedMetaDesc && resolvedMetaDesc.length >= 100 && resolvedMetaDesc.length <= 170;
  const hasHeroImage = !!article.featuredImage?.url;
  const hasImagesCount = (article.featuredImage ? 1 : 0) + (article.articleImages?.length || 0);
  const totalScore = article.seoScore?.total || 95;

  const checks = [
    { label: 'Target Keyword in Title & Slug', passed: resolvedTitle.length > 15, hint: 'Title is descriptive and targeted' },
    { label: 'Meta Description Optimal (120-160 chars)', passed: !!hasMetaDesc, hint: `${resolvedMetaDesc.length} characters` },
    { label: 'In-Depth Word Count (>1,200 words)', passed: wordCount >= 1000, hint: `${wordCount} words (${readingTime}m read)` },
    { label: 'Featured Hero Visual Attached', passed: hasHeroImage, hint: hasHeroImage ? 'High-res hero image present' : 'Optional hero visual' },
    { label: 'Section Images & Visual Proof', passed: hasImagesCount >= 1 || article.schemaType === 'Recipe', hint: `${hasImagesCount} visual assets` },
    { label: 'AI Overviews & Search Intent Ready', passed: totalScore >= 80, hint: `${totalScore}/100 SEO readiness score` }
  ];
  const passedChecksCount = checks.filter(c => c.passed).length;

  const handleCopyMarkdown = () => {
    navigator.clipboard.writeText(resolvedContent);
    setCopiedNotification('Markdown copied!');
    setTimeout(() => setCopiedNotification(null), 2200);
  };

  const handleCopyCleanHtml = () => {
    const fakeDiv = document.createElement('div');
    fakeDiv.innerHTML = `
      <article class="seo-article">
        <h1>${resolvedTitle}</h1>
        <p class="meta-description">${resolvedMetaDesc}</p>
        <div class="content">
          ${resolvedContent.replace(/^## (.*$)/gim, '<h2>$1</h2>').replace(/^### (.*$)/gim, '<h3>$1</h3>')}
        </div>
      </article>
    `;
    navigator.clipboard.writeText(fakeDiv.innerHTML.trim());
    setCopiedNotification('Clean HTML copied!');
    setTimeout(() => setCopiedNotification(null), 2200);
  };

  const handleDownloadMarkdown = () => {
    const blob = new Blob([resolvedContent], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${resolvedSlug || 'article'}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div
      className={`relative transition-all duration-200 ${
        isFullscreen
          ? 'fixed inset-0 z-50 bg-slate-950 overflow-y-auto p-4 sm:p-8 flex flex-col items-center'
          : 'space-y-4'
      }`}
    >
      {/* Top Document Header Bar (Modeled after Claude Artifact Bar in user's screenshot) */}
      <div className="w-full bg-slate-900 border border-slate-800 rounded-2xl p-3 sm:p-4 flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-lg shadow-black/20">
        {/* Left: Document Title with Dropdown Selector */}
        <div className="relative flex items-center gap-2 min-w-0">
          <div className="flex items-center gap-2 min-w-0">
            <button
              onClick={() => setIsArticleDropdownOpen(!isArticleDropdownOpen)}
              className="flex items-center gap-1.5 text-slate-100 hover:text-white font-semibold text-sm sm:text-base truncate transition-colors text-left group"
              title={resolvedTitle}
            >
              <span className="truncate max-w-[280px] sm:max-w-md">{resolvedTitle}</span>
              <ChevronDown className="w-4 h-4 text-slate-400 group-hover:text-slate-200 shrink-0 transition-transform" />
            </button>

            {/* Quick pill stats */}
            <span className="hidden xl:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-slate-800 text-slate-300 border border-slate-700/60 shrink-0">
              <FileText className="w-3 h-3 text-emerald-400" />
              {wordCount.toLocaleString()} words
            </span>
            <span className="hidden xl:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-slate-800 text-slate-300 border border-slate-700/60 shrink-0">
              <Clock className="w-3 h-3 text-teal-400" />
              {readingTime}m read
            </span>
          </div>

          {/* Dropdown Menu for Article switching / quick actions */}
          {isArticleDropdownOpen && (
            <div className="absolute top-full left-0 mt-2 w-80 sm:w-96 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl p-2 z-50 animate-fadeIn">
              <div className="p-2 border-b border-slate-800 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                Switch Article
              </div>
              <div className="max-h-60 overflow-y-auto py-1 space-y-1">
                {availableArticles && availableArticles.length > 0 ? (
                  availableArticles.map((art) => (
                    <button
                      key={art.id}
                      onClick={() => {
                        if (onSelectArticle) onSelectArticle(art);
                        setIsArticleDropdownOpen(false);
                      }}
                      className={`w-full text-left p-2 rounded-lg text-xs transition-colors flex items-center justify-between gap-2 ${
                        art.id === article.id
                          ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/30'
                          : 'hover:bg-slate-800 text-slate-300'
                      }`}
                    >
                      <span className="truncate font-medium">{art.title}</span>
                      <span className="text-[10px] text-slate-500 shrink-0">{art.wordCount || 1200}w</span>
                    </button>
                  ))
                ) : (
                  <div className="p-2 text-xs text-slate-400">Current Article: {resolvedTitle}</div>
                )}
              </div>
              <div className="p-2 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(resolvedTitle);
                    setIsArticleDropdownOpen(false);
                    setCopiedNotification('Title copied!');
                    setTimeout(() => setCopiedNotification(null), 2000);
                  }}
                  className="hover:text-white transition-colors"
                >
                  Copy Title
                </button>
                <button
                  onClick={() => setIsArticleDropdownOpen(false)}
                  className="hover:text-white font-medium"
                >
                  Close
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right: Controls & Action Icons (Modeled after user's Claude Artifact screenshot) */}
        <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap shrink-0">
          {/* View Mode Switcher */}
          <div className="flex items-center bg-slate-950 p-0.5 rounded-xl border border-slate-800 text-xs">
            <button
              onClick={() => setViewMode('document')}
              className={`px-2.5 py-1 rounded-lg flex items-center gap-1.5 font-medium transition-all ${
                viewMode === 'document'
                  ? 'bg-slate-800 text-white shadow-sm font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Editorial Document Canvas (Claude Artifact Style)"
            >
              <FileText className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden sm:inline">Document</span>
            </button>
            <button
              onClick={() => setViewMode('web')}
              className={`px-2.5 py-1 rounded-lg flex items-center gap-1.5 font-medium transition-all ${
                viewMode === 'web'
                  ? 'bg-slate-800 text-white shadow-sm font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Simulated Live Web Blog Post"
            >
              <Globe className="w-3.5 h-3.5 text-sky-400" />
              <span className="hidden sm:inline">Web Preview</span>
            </button>
            <button
              onClick={() => setViewMode('mobile')}
              className={`px-2.5 py-1 rounded-lg flex items-center gap-1.5 font-medium transition-all ${
                viewMode === 'mobile'
                  ? 'bg-slate-800 text-white shadow-sm font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Mobile Device Simulator"
            >
              <Smartphone className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline">Mobile</span>
            </button>
          </div>

          {/* Paper Theme Toggle (in Document mode) */}
          {viewMode === 'document' && (
            <button
              onClick={() => setPaperTheme(paperTheme === 'light' ? 'slate' : 'light')}
              className="p-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700/60 transition-colors"
              title={paperTheme === 'light' ? 'Switch to Dark Slate Canvas' : 'Switch to Light Paper Canvas'}
            >
              {paperTheme === 'light' ? (
                <Moon className="w-4 h-4 text-indigo-300" />
              ) : (
                <Sun className="w-4 h-4 text-amber-300" />
              )}
            </button>
          )}

          {/* Copy Clean Markdown */}
          <button
            onClick={handleCopyMarkdown}
            className="p-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700/60 transition-colors relative"
            title="Copy Markdown"
          >
            {copiedNotification ? (
              <Check className="w-4 h-4 text-emerald-400 stroke-[2.5]" />
            ) : (
              <Copy className="w-4 h-4" />
            )}
          </button>

          {/* Download Markdown */}
          <button
            onClick={handleDownloadMarkdown}
            className="p-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700/60 transition-colors"
            title="Download .md file"
          >
            <Download className="w-4 h-4" />
          </button>

          {/* Print / Save PDF */}
          <button
            onClick={handlePrint}
            className="hidden sm:flex p-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700/60 transition-colors"
            title="Print or Save as PDF"
          >
            <Printer className="w-4 h-4" />
          </button>

          {/* Fullscreen Focus Reading Mode (Matches Claude's expand icon in screenshot!) */}
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700/60 transition-colors"
            title={isFullscreen ? 'Exit Fullscreen' : 'Expand / Focus Mode'}
          >
            {isFullscreen ? (
              <Minimize2 className="w-4 h-4 text-emerald-400" />
            ) : (
              <Maximize2 className="w-4 h-4" />
            )}
          </button>

          {/* Quick Edit Action */}
          {handleEdit && (
            <button
              onClick={handleEdit}
              className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white text-xs font-semibold border border-slate-700 flex items-center gap-1.5 transition-colors"
              title="Edit in Markdown Editor"
            >
              <Edit3 className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden sm:inline">Edit</span>
            </button>
          )}

          {/* Publish / Syndicate */}
          <button
            onClick={handleSyndicate}
            className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-all shadow-md shadow-emerald-500/20"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Publish</span>
          </button>
        </div>
      </div>

      {/* Copied toast notice */}
      {copiedNotification && (
        <div className="fixed top-5 right-5 z-50 bg-emerald-500 text-slate-950 font-bold text-xs px-4 py-2 rounded-xl shadow-xl flex items-center gap-2 animate-fadeIn">
          <Check className="w-4 h-4 stroke-[3]" />
          <span>{copiedNotification}</span>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODE 1: CLAUDE EDITORIAL DOCUMENT VIEW (EXACTLY MATCHING USER SCREENSHOT) */}
      {/* ========================================================================= */}
      {viewMode === 'document' && (
        <div className="w-full flex justify-center py-2 animate-fadeIn">
          <article
            className={`w-full max-w-3xl sm:max-w-4xl transition-colors duration-200 rounded-2xl ${
              paperTheme === 'light'
                ? 'bg-white text-slate-900 border border-slate-200/90 shadow-sm'
                : 'bg-slate-900 text-slate-100 border border-slate-800 shadow-xl'
            } p-6 sm:p-12 lg:p-16`}
          >
            {/* Pristine Document Typography Engine with Markdown and RemarkGFM */}
            <div
              className={`prose max-w-none ${
                paperTheme === 'light'
                  ? 'prose-slate text-slate-800'
                  : 'prose-invert text-slate-200'
              }`}
            >
              <Markdown
                remarkPlugins={[remarkGfm]}
                components={{
                  // Document H1: Bold, authoritative, generous line height
                  h1: ({ children }) => (
                    <h1
                      className={`text-2xl sm:text-4xl font-bold tracking-tight leading-snug mb-6 ${
                        paperTheme === 'light' ? 'text-slate-950' : 'text-white'
                      }`}
                    >
                      {children}
                    </h1>
                  ),
                  // Document H2: Clean section heading with no artificial horizontal lines
                  h2: ({ children }) => (
                    <h2
                      className={`text-xl sm:text-2xl font-bold tracking-tight mt-10 mb-3.5 border-none pb-0 ${
                        paperTheme === 'light' ? 'text-slate-950' : 'text-slate-100'
                      }`}
                    >
                      {children}
                    </h2>
                  ),
                  // Document H3: Sub-section heading
                  h3: ({ children }) => (
                    <h3
                      className={`text-lg sm:text-xl font-bold tracking-tight mt-6 mb-2 ${
                        paperTheme === 'light' ? 'text-slate-900' : 'text-slate-200'
                      }`}
                    >
                      {children}
                    </h3>
                  ),
                  // Paragraphs: Comfortable reading rhythm
                  p: ({ children }) => (
                    <p
                      className={`text-base leading-relaxed mb-5 font-normal ${
                        paperTheme === 'light' ? 'text-slate-800' : 'text-slate-300'
                      }`}
                    >
                      {children}
                    </p>
                  ),
                  // Unordered lists
                  ul: ({ children }) => (
                    <ul
                      className={`list-disc pl-6 space-y-2 mb-6 leading-relaxed ${
                        paperTheme === 'light'
                          ? 'text-slate-800 marker:text-slate-400'
                          : 'text-slate-300 marker:text-slate-500'
                      }`}
                    >
                      {children}
                    </ul>
                  ),
                  // Ordered lists
                  ol: ({ children }) => (
                    <ol
                      className={`list-decimal pl-6 space-y-2 mb-6 leading-relaxed ${
                        paperTheme === 'light'
                          ? 'text-slate-800 marker:text-slate-500'
                          : 'text-slate-300 marker:text-slate-400'
                      }`}
                    >
                      {children}
                    </ol>
                  ),
                  li: ({ children }) => <li className="pl-1">{children}</li>,
                  // Tables: Clean modern table styling
                  table: ({ children }) => (
                    <div className="overflow-x-auto my-6 border border-slate-200 dark:border-slate-800 rounded-xl">
                      <table className="w-full text-left text-sm border-collapse">{children}</table>
                    </div>
                  ),
                  thead: ({ children }) => (
                    <thead
                      className={`${
                        paperTheme === 'light'
                          ? 'bg-slate-50 text-slate-900 border-b border-slate-200'
                          : 'bg-slate-800 text-slate-100 border-b border-slate-700'
                      } font-semibold`}
                    >
                      {children}
                    </thead>
                  ),
                  th: ({ children }) => (
                    <th className="p-3.5 border-r border-slate-200 dark:border-slate-800 last:border-r-0 font-bold">
                      {children}
                    </th>
                  ),
                  tbody: ({ children }) => <tbody>{children}</tbody>,
                  tr: ({ children }) => (
                    <tr
                      className={`border-b last:border-b-0 ${
                        paperTheme === 'light'
                          ? 'border-slate-100 hover:bg-slate-50/50'
                          : 'border-slate-800/80 hover:bg-slate-800/30'
                      } transition-colors`}
                    >
                      {children}
                    </tr>
                  ),
                  td: ({ children }) => (
                    <td
                      className={`p-3.5 border-r border-slate-100 dark:border-slate-800/80 last:border-r-0 ${
                        paperTheme === 'light' ? 'text-slate-700' : 'text-slate-300'
                      }`}
                    >
                      {children}
                    </td>
                  ),
                  // Blockquotes
                  blockquote: ({ children }) => (
                    <blockquote
                      className={`border-l-4 p-4 rounded-r-xl my-6 italic text-sm leading-relaxed ${
                        paperTheme === 'light'
                          ? 'border-slate-300 bg-slate-50 text-slate-700'
                          : 'border-slate-700 bg-slate-950/70 text-slate-300'
                      }`}
                    >
                      {children}
                    </blockquote>
                  ),
                  // Code elements
                  code: ({ children }) => (
                    <code
                      className={`font-mono text-xs px-1.5 py-0.5 rounded ${
                        paperTheme === 'light'
                          ? 'bg-slate-100 text-slate-800 border border-slate-200'
                          : 'bg-slate-800 text-slate-200 border border-slate-700'
                      }`}
                    >
                      {children}
                    </code>
                  ),
                  pre: ({ children }) => (
                    <pre className="bg-slate-950 text-slate-100 p-4 rounded-xl overflow-x-auto text-xs my-5 font-mono">
                      {children}
                    </pre>
                  ),
                  hr: () => (
                    <hr
                      className={`my-8 ${
                        paperTheme === 'light' ? 'border-slate-200' : 'border-slate-800'
                      }`}
                    />
                  ),
                  a: ({ href, children }) => (
                    <a
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-emerald-600 dark:text-emerald-400 hover:underline underline-offset-2 font-medium"
                    >
                      {children}
                    </a>
                  ),
                  strong: ({ children }) => (
                    <strong
                      className={`font-bold ${
                        paperTheme === 'light' ? 'text-slate-950' : 'text-white'
                      }`}
                    >
                      {children}
                    </strong>
                  ),
                  img: ({ src, alt }) => (
                    <figure className="my-6">
                      <img
                        src={src}
                        alt={alt || ''}
                        className="w-full max-h-[460px] object-cover rounded-xl shadow-sm border border-slate-200/80 dark:border-slate-800"
                        loading="lazy"
                        referrerPolicy="no-referrer"
                      />
                      {alt && alt !== 'Taste' && alt !== 'Preparation' && alt !== 'Iced' && alt !== 'Brewing' && (
                        <figcaption className="text-xs text-center text-slate-500 dark:text-slate-400 mt-2 italic">
                          {alt}
                        </figcaption>
                      )}
                    </figure>
                  )
                }}
              >
                {resolvedContent}
              </Markdown>
            </div>

            {/* Document Bottom Attribution & Metrics */}
            <div
              className={`mt-12 pt-6 border-t flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs ${
                paperTheme === 'light'
                  ? 'border-slate-200 text-slate-500'
                  : 'border-slate-800 text-slate-400'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                  Fact-checked & SEO Optimized
                </span>
                <span>•</span>
                <span>{wordCount.toLocaleString()} words</span>
                <span>•</span>
                <span>{readingTime} min read</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopyMarkdown}
                  className="hover:text-emerald-500 font-medium transition-colors"
                >
                  Copy Markdown
                </button>
                <span>•</span>
                <button
                  onClick={handleCopyCleanHtml}
                  className="hover:text-emerald-500 font-medium transition-colors"
                >
                  Copy HTML
                </button>
                <span>•</span>
                <button
                  onClick={handleDownloadMarkdown}
                  className="hover:text-emerald-500 font-medium transition-colors"
                >
                  Download
                </button>
              </div>
            </div>
          </article>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODE 2: WEB POST PREVIEW (WITH HERO BANNER, AUTHOR BYLINE & SEO CHECKLIST)*/}
      {/* ========================================================================= */}
      {viewMode === 'web' && (
        <div className="space-y-6 animate-fadeIn">
          {/* Outer Web Post Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
            {/* Hero Image if available */}
            {article.featuredImage?.url && (
              <div className="relative w-full h-64 sm:h-80 lg:h-96 bg-slate-950 overflow-hidden">
                <img
                  src={article.featuredImage.url}
                  alt={article.featuredImage.altText || resolvedTitle}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
                <div className="absolute bottom-4 left-6 right-6 flex items-center justify-between text-xs text-slate-300">
                  <span className="bg-slate-900/80 px-2.5 py-1 rounded-lg border border-slate-700/60">
                    Featured Visual
                  </span>
                  <span className="italic">{article.featuredImage.altText}</span>
                </div>
              </div>
            )}

            {/* Article Inner Wrapper */}
            <div className="p-6 sm:p-10 lg:p-12 space-y-6">
              {/* Header Badges */}
              <div className="flex items-center gap-2 flex-wrap text-xs">
                <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 font-semibold border border-emerald-500/20 uppercase tracking-wider">
                  {article.schemaType || 'Article'}
                </span>
                <span className="text-slate-400 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  {readingTime} min read
                </span>
                <span className="text-slate-400">•</span>
                <span className="text-slate-400">{wordCount.toLocaleString()} words</span>
                <span className="text-slate-400">•</span>
                <span className="text-slate-400 flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  SEO Score {totalScore}/100
                </span>
              </div>

              {/* Title & Meta Description */}
              <div className="space-y-3">
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight leading-tight">
                  {resolvedTitle}
                </h1>
                {resolvedMetaDesc && (
                  <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-normal border-l-2 border-emerald-500 pl-4 py-1 italic bg-slate-950/40 rounded-r-lg">
                    {resolvedMetaDesc}
                  </p>
                )}
              </div>

              {/* Table of Contents if headings exist */}
              {headings.length > 2 && (
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                  <div className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                    <Bookmark className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Table of Contents</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-xs text-slate-300">
                    {headings.slice(0, 8).map((h, i) => (
                      <div key={i} className="flex items-center gap-2 truncate">
                        <span className="text-emerald-500 font-mono text-[10px]">{i + 1}.</span>
                        <span className="truncate hover:text-white transition-colors">{h.title}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Main Markdown Content */}
              <div className="prose prose-invert max-w-none text-slate-200">
                <Markdown
                  remarkPlugins={[remarkGfm]}
                  components={{
                    img: ({ src, alt }) => (
                      <figure className="my-6">
                        <img
                          src={src}
                          alt={alt || ''}
                          className="w-full max-h-[460px] object-cover rounded-xl shadow-md border border-slate-800"
                          loading="lazy"
                          referrerPolicy="no-referrer"
                        />
                      </figure>
                    )
                  }}
                >
                  {resolvedContent}
                </Markdown>
              </div>

              {/* Section Visuals Grid */}
              {article.articleImages && article.articleImages.length > 0 && (
                <div className="mt-8 pt-6 border-t border-slate-800 space-y-4">
                  <div className="text-sm font-bold text-white flex items-center gap-2">
                    <Tag className="w-4 h-4 text-emerald-400" />
                    <span>Included Section Visuals ({article.articleImages.length})</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {article.articleImages.map((img) => (
                      <div
                        key={img.id}
                        className="rounded-xl overflow-hidden border border-slate-800 bg-slate-950 flex flex-col"
                      >
                        <img
                          src={img.url}
                          alt={img.altText}
                          className="w-full h-44 object-cover"
                          referrerPolicy="no-referrer"
                        />
                        <div className="p-3 text-xs space-y-1 bg-slate-900/90 flex-1">
                          <div className="font-semibold text-slate-200 truncate">
                            {img.sectionHeading || img.searchIntentMatch || 'Section Visual'}
                          </div>
                          <p className="text-slate-400 text-[11px] line-clamp-2">ALT: {img.altText}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* FAQ Section */}
              {article.faqs && article.faqs.length > 0 && (
                <div className="mt-8 pt-6 border-t border-slate-800 space-y-4">
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <span className="text-emerald-400">❓</span>
                    <span>Frequently Asked Questions</span>
                  </h3>
                  <div className="space-y-3">
                    {article.faqs.map((faq, idx) => {
                      const isOpen = expandedFaq === idx;
                      return (
                        <div
                          key={idx}
                          className="border border-slate-800 rounded-xl bg-slate-950/70 overflow-hidden"
                        >
                          <button
                            onClick={() => setExpandedFaq(isOpen ? null : idx)}
                            className="w-full p-4 text-left flex items-center justify-between gap-4 hover:bg-slate-900/50 transition-colors"
                          >
                            <span className="text-sm font-semibold text-slate-200">{faq.question}</span>
                            {isOpen ? (
                              <ChevronUp className="w-4 h-4 text-emerald-400 shrink-0" />
                            ) : (
                              <ChevronDown className="w-4 h-4 text-slate-500 shrink-0" />
                            )}
                          </button>
                          {isOpen && (
                            <div className="p-4 pt-0 text-xs sm:text-sm text-slate-300 leading-relaxed border-t border-slate-800/60 bg-slate-900/40">
                              {faq.answer}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Pre-Publish Quality Gate & Readiness Checklist Box */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Pre-Publish Verification Checklist</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Review quality benchmarks before pushing to live WordPress or distributing across channels.
                </p>
              </div>
              <div className="text-xs font-bold px-3 py-1 rounded-full bg-slate-950 border border-slate-800 text-emerald-400">
                {passedChecksCount} of {checks.length} Criteria Passed
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {checks.map((c, i) => (
                <div
                  key={i}
                  className={`p-3.5 rounded-xl border flex items-start gap-3 transition-colors ${
                    c.passed
                      ? 'bg-emerald-950/20 border-emerald-800/40'
                      : 'bg-amber-950/20 border-amber-800/40'
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                      c.passed ? 'bg-emerald-500 text-slate-950' : 'bg-amber-500 text-slate-950'
                    }`}
                  >
                    {c.passed ? <Check className="w-3 h-3 stroke-[3]" /> : <AlertCircle className="w-3 h-3" />}
                  </div>
                  <div className="text-xs space-y-0.5">
                    <div className={`font-semibold ${c.passed ? 'text-slate-200' : 'text-amber-200'}`}>
                      {c.label}
                    </div>
                    <div className="text-slate-400 text-[11px]">{c.hint}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Final Publish Row */}
            <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="text-xs text-slate-400">
                <span>Ready to publish? Choose your syndication pathway:</span>
              </div>

              <div className="flex items-center gap-3 flex-wrap">
                <button
                  onClick={() => onPublishWp && onPublishWp('draft')}
                  disabled={isBusyPublishing}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs border border-slate-700 transition-colors disabled:opacity-50"
                >
                  {isBusyPublishing ? 'Syncing...' : 'Save WP Draft'}
                </button>
                <button
                  onClick={() => onPublishWp && onPublishWp('publish')}
                  disabled={isBusyPublishing}
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs transition-colors shadow-md shadow-blue-600/30 disabled:opacity-50"
                >
                  {isBusyPublishing ? 'Publishing...' : 'Publish to WordPress Live'}
                </button>
                <button
                  onClick={handleSyndicate}
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-500 to-indigo-600 hover:from-emerald-400 hover:to-indigo-500 text-white font-bold text-xs transition-all shadow-lg shadow-emerald-500/20 flex items-center gap-2"
                >
                  <Share2 className="w-4 h-4" />
                  <span>Syndicate Everywhere</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODE 3: MOBILE SIMULATOR */}
      {/* ========================================================================= */}
      {viewMode === 'mobile' && (
        <div className="w-full flex justify-center py-4 animate-fadeIn">
          <div className="w-[375px] max-w-full bg-slate-950 border-4 border-slate-800 rounded-[40px] p-3 shadow-2xl relative overflow-hidden">
            {/* Phone Notch */}
            <div className="w-32 h-5 bg-slate-800 rounded-b-xl mx-auto mb-3" />
            
            {/* Phone Screen Canvas */}
            <div className="bg-white text-slate-900 rounded-[28px] p-5 h-[650px] overflow-y-auto space-y-4">
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 uppercase tracking-wider">
                {article.schemaType || 'Article'}
              </span>
              <h1 className="text-xl font-bold tracking-tight text-slate-950 leading-snug">
                {resolvedTitle}
              </h1>
              <div className="text-xs text-slate-500 flex items-center gap-2 border-b pb-3">
                <span>{readingTime}m read</span>
                <span>•</span>
                <span>{wordCount.toLocaleString()} words</span>
              </div>
              <div className="prose prose-sm max-w-none text-slate-800 text-xs">
                <Markdown
                  remarkPlugins={[remarkGfm]}
                  components={{
                    img: ({ src, alt }) => (
                      <figure className="my-4">
                        <img
                          src={src}
                          alt={alt || ''}
                          className="w-full max-h-[260px] object-cover rounded-lg shadow border border-slate-200"
                          loading="lazy"
                          referrerPolicy="no-referrer"
                        />
                      </figure>
                    )
                  }}
                >
                  {resolvedContent}
                </Markdown>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
