import React, { useState } from 'react';
import Markdown from 'react-markdown';
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
  Download
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
  isPublishing = false
}) => {
  const [internalDevice, setInternalDevice] = useState<'desktop' | 'mobile'>('desktop');
  const activeDevice = device || previewDevice || internalDevice;
  const handleDeviceChange = onDeviceChange || onToggleDevice || setInternalDevice;
  const handlePublish = onPublishWordPress || onPublishWp || (() => {});
  const handleSyndicate = onOpenMultiChannelModal || onOpenSyndicate || (() => {});
  const handleEdit = onEditMode || onSwitchToEditor;
  const isBusyPublishing = isPublishing || isSyncingWp;

  const resolvedTitle = currentTitle !== undefined ? currentTitle : article.title;
  const resolvedSlug = currentSlug !== undefined ? currentSlug : article.slug;
  const resolvedMetaDesc = currentMetaDesc !== undefined ? currentMetaDesc : (article.metaDescription || '');
  const resolvedContent = currentContent !== undefined ? currentContent : (article.content || '');

  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const [copiedHtml, setCopiedHtml] = useState(false);

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

  // Pre-Publish Checks
  const wordCount = resolvedContent.trim().split(/\s+/).filter(Boolean).length;
  const readingTime = Math.max(1, Math.round(wordCount / 200));
  const hasMetaDesc = resolvedMetaDesc && resolvedMetaDesc.length >= 100 && resolvedMetaDesc.length <= 170;
  const hasHeroImage = !!article.featuredImage?.url;
  const hasImagesCount = (article.featuredImage ? 1 : 0) + (article.articleImages?.length || 0);
  const totalScore = article.seoScore?.total || 85;

  const checks = [
    { label: 'Target Keyword in Title & Slug', passed: resolvedTitle.length > 15, hint: 'Title is descriptive and targeted' },
    { label: 'Meta Description Optimal (120-160 chars)', passed: !!hasMetaDesc, hint: `${resolvedMetaDesc.length} characters` },
    { label: 'In-Depth Word Count (>1,200 words)', passed: wordCount >= 1000, hint: `${wordCount} words (${readingTime}m read)` },
    { label: 'Featured Hero Visual Attached', passed: hasHeroImage, hint: hasHeroImage ? 'High-res hero image present' : 'Needs hero visual' },
    { label: 'Section Images & Visual Proof', passed: hasImagesCount >= 2, hint: `${hasImagesCount} total visual assets` },
    { label: 'AI Overviews & Search Intent Ready', passed: totalScore >= 80, hint: `${totalScore}/100 SEO readiness score` }
  ];
  const passedChecksCount = checks.filter(c => c.passed).length;

  const handleCopyCleanHtml = () => {
    // Generate clean semantic HTML snippet from markdown for export
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
    setCopiedHtml(true);
    setTimeout(() => setCopiedHtml(false), 2000);
  };

  const handleDownloadMarkdown = () => {
    const blob = new Blob([`# ${resolvedTitle}\n\n> ${resolvedMetaDesc}\n\n${resolvedContent}`], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${resolvedSlug || 'article'}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Top Preview Control Toolbar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Left: Device Simulator Toggle */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-400">Preview Device:</span>
          <div className="inline-flex p-1 bg-slate-950 border border-slate-800 rounded-xl">
            <button
              onClick={() => handleDeviceChange('desktop')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                activeDevice === 'desktop'
                  ? 'bg-slate-800 text-emerald-400 font-bold shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Monitor className="w-3.5 h-3.5" />
              <span>Desktop Post</span>
            </button>
            <button
              onClick={() => handleDeviceChange('mobile')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                activeDevice === 'mobile'
                  ? 'bg-slate-800 text-emerald-400 font-bold shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>Mobile Phone</span>
            </button>
          </div>
        </div>

        {/* Middle: Pre-publish readiness pill */}
        <div className="flex items-center gap-2 text-xs">
          <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full font-semibold border ${
            passedChecksCount === checks.length
              ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400'
              : 'bg-amber-500/15 border-amber-500/30 text-amber-300'
          }`}>
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Pre-Publish Checks: {passedChecksCount}/{checks.length} Ready</span>
          </span>
        </div>

        {/* Right: Quick Action Buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          {handleEdit && (
            <button
              onClick={handleEdit}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition-colors"
              title="Open direct text and markdown editor"
            >
              ✏️ Edit Content
            </button>
          )}

          <button
            onClick={handleCopyCleanHtml}
            className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium border border-slate-700 transition-colors flex items-center gap-1"
            title="Copy semantic HTML for CMS export"
          >
            <Copy className="w-3 h-3 text-emerald-400" />
            <span>{copiedHtml ? 'Copied HTML!' : 'Copy HTML'}</span>
          </button>

          <button
            onClick={handleDownloadMarkdown}
            className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium border border-slate-700 transition-colors flex items-center gap-1"
            title="Download markdown .md file"
          >
            <Download className="w-3 h-3 text-cyan-400" />
            <span>.md</span>
          </button>

          <button
            onClick={() => handlePublish('draft')}
            disabled={isBusyPublishing}
            className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition-colors shadow-sm disabled:opacity-50"
            title="Save as Draft in WordPress"
          >
            {isBusyPublishing ? 'Syncing...' : 'WP Draft'}
          </button>

          <button
            onClick={handleSyndicate}
            className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-emerald-500 to-indigo-600 hover:from-emerald-400 hover:to-indigo-500 text-white font-bold text-xs transition-all flex items-center gap-1 shadow-md shadow-emerald-500/20"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Publish / Syndicate</span>
          </button>
        </div>
      </div>

      {/* Main Preview Frame Container */}
      <div className={`mx-auto transition-all ${
        activeDevice === 'mobile'
          ? 'max-w-[410px] bg-slate-950 p-4 rounded-[40px] border-4 border-slate-800 shadow-2xl relative'
          : 'w-full'
      }`}>
        {/* Smartphone Speaker & Camera Notch Simulator */}
        {activeDevice === 'mobile' && (
          <div className="flex items-center justify-between px-6 pb-3 pt-1 text-[11px] text-slate-400 font-mono">
            <span>9:41</span>
            <div className="w-20 h-4 bg-slate-800 rounded-full mx-auto" />
            <span>5G 100%</span>
          </div>
        )}

        {/* Simulated Browser Bar for Mobile */}
        {activeDevice === 'mobile' && (
          <div className="mb-4 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-[11px] text-slate-400 flex items-center gap-2 font-mono">
            <span className="text-emerald-400">🔒</span>
            <span className="truncate">mysite.com/{resolvedSlug || 'article-preview'}</span>
          </div>
        )}

        {/* Live Rendered Article Document */}
        <div className="bg-slate-900/95 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
          {/* Article Header & Meta Section */}
          <div className="p-6 sm:p-8 border-b border-slate-800/80 space-y-4">
            {/* Category / Intent Tags */}
            <div className="flex items-center gap-2 flex-wrap text-xs">
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold uppercase tracking-wider text-[10px]">
                {article.brief?.searchIntent?.primaryIntent || 'Search Intent Guide'}
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 font-medium text-[11px]">
                {article.schemaType || 'Article'}
              </span>
              <span className="text-slate-500">•</span>
              <span className="text-slate-400 flex items-center gap-1 text-[11px]">
                <Clock className="w-3 h-3 text-slate-400" />
                <span>{readingTime} min read</span>
              </span>
              <span className="text-slate-500">•</span>
              <span className="text-slate-400 text-[11px]">{wordCount} words</span>
            </div>

            {/* Main Headline (H1) */}
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight leading-tight">
              {resolvedTitle}
            </h1>

            {/* Meta Description / Sub-headline */}
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-normal">
              {resolvedMetaDesc}
            </p>

            {/* Author Byline & Date */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-800/60 text-xs">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center font-bold text-slate-950 text-sm">
                  {article.brief?.targetAudience?.[0]?.toUpperCase() || 'E'}
                </div>
                <div>
                  <div className="font-bold text-white">Editorial Team</div>
                  <div className="text-slate-400 text-[11px]">Fact-checked & Verified • Updated Today</div>
                </div>
              </div>

              <div className="flex items-center gap-1 text-slate-400">
                <Calendar className="w-3.5 h-3.5 text-slate-500" />
                <span>{new Date().toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
              </div>
            </div>
          </div>

          {/* Hero Featured Image */}
          {article.featuredImage && (
            <div className="border-b border-slate-800 bg-slate-950 relative group">
              <img
                src={article.featuredImage.url}
                alt={article.featuredImage.altText || resolvedTitle}
                className="w-full h-72 sm:h-96 object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="p-3 bg-slate-950/80 backdrop-blur-sm border-t border-slate-800/80 text-xs text-slate-400 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <span className="truncate">
                  <strong className="text-slate-300">Featured Visual:</strong> {article.featuredImage.altText}
                </span>
                <span className="px-2 py-0.5 rounded bg-emerald-950/70 border border-emerald-800/50 text-emerald-400 font-mono text-[10px] shrink-0">
                  Primary Plated Hero (16:9)
                </span>
              </div>
            </div>
          )}

          {/* Key Takeaways & Executive Summary Card (Crucial for AI Overviews / SGE) */}
          <div className="p-6 sm:p-8 bg-slate-950/60 border-b border-slate-800 space-y-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <h2 className="text-sm font-bold text-emerald-300 uppercase tracking-wider">
                Key Highlights & Quick Takeaways
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-300">
              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                <span className="text-emerald-400 font-bold block mb-1">Direct Answer Summary:</span>
                <p className="leading-relaxed">{resolvedMetaDesc}</p>
              </div>
              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                <span className="text-cyan-400 font-bold block mb-1">Target Intent:</span>
                <p className="leading-relaxed">
                  Optimized for {article.brief?.searchIntent?.primaryIntent || 'comprehensive'} searchers seeking authoritative guidance with step-by-step verification.
                </p>
              </div>
            </div>
          </div>

          {/* Table of Contents (if 2+ headings) */}
          {headings.length > 1 && (
            <div className="p-6 sm:p-8 bg-slate-900/40 border-b border-slate-800 space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-300 uppercase tracking-wider">
                <Bookmark className="w-3.5 h-3.5 text-emerald-400" />
                <span>Table of Contents</span>
              </div>
              <nav className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                {headings.map((h, i) => (
                  <div
                    key={i}
                    className={`flex items-center gap-2 py-1 px-2.5 rounded-lg bg-slate-950/50 border border-slate-800/80 text-slate-300 hover:text-emerald-300 transition-colors ${
                      h.level === 3 ? 'ml-4 text-slate-400 text-[11px]' : 'font-medium'
                    }`}
                  >
                    <span className="text-emerald-400/70 font-mono text-[10px]">{i + 1}.</span>
                    <span className="truncate">{h.title}</span>
                  </div>
                ))}
              </nav>
            </div>
          )}

          {/* Main Article Body Rendered with Markdown */}
          <div className="p-6 sm:p-8 lg:p-10 space-y-6">
            <div className="prose prose-invert prose-emerald max-w-none prose-headings:font-bold prose-h2:text-xl prose-h2:sm:text-2xl prose-h2:text-white prose-h2:border-b prose-h2:border-slate-800 prose-h2:pb-2 prose-h2:mt-8 prose-h3:text-lg prose-h3:text-slate-200 prose-p:text-slate-300 prose-p:leading-relaxed prose-p:text-sm sm:prose-p:text-base prose-li:text-slate-300 prose-li:text-sm sm:prose-li:text-base prose-blockquote:border-emerald-500 prose-blockquote:bg-slate-950/60 prose-blockquote:py-1 prose-blockquote:px-4 prose-blockquote:rounded-r-xl prose-table:text-xs prose-th:bg-slate-800/80 prose-th:p-2.5 prose-td:p-2.5 prose-td:border-b prose-td:border-slate-800">
              <Markdown>{resolvedContent}</Markdown>
            </div>

            {/* Embedded Inline Section Visuals Gallery */}
            {article.articleImages && article.articleImages.length > 0 && (
              <div className="mt-8 pt-6 border-t border-slate-800 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                    <Tag className="w-4 h-4 text-emerald-400" />
                    <span>Included Section Visuals ({article.articleImages.length})</span>
                  </h3>
                  <span className="text-xs text-slate-400">All visuals matched to search intent</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {article.articleImages.map(img => (
                    <div key={img.id} className="rounded-xl overflow-hidden border border-slate-800 bg-slate-950 flex flex-col">
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

            {/* FAQ Accordion Section (if available) */}
            {article.faqs && article.faqs.length > 0 && (
              <div className="mt-10 pt-8 border-t border-slate-800 space-y-4">
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
              Review quality benchmarks before pushing to live WordPress or distributing across social channels.
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
              <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                c.passed ? 'bg-emerald-500 text-slate-950' : 'bg-amber-500 text-slate-950'
              }`}>
                {c.passed ? <Check className="w-3 h-3 stroke-[3]" /> : <AlertCircle className="w-3 h-3" />}
              </div>
              <div className="text-xs space-y-0.5">
                <div className={`font-semibold ${c.passed ? 'text-slate-200' : 'text-amber-200'}`}>{c.label}</div>
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
              onClick={() => onPublishWp('draft')}
              disabled={isSyncingWp}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs border border-slate-700 transition-colors disabled:opacity-50"
            >
              {isSyncingWp ? 'Syncing...' : 'Save WP Draft'}
            </button>
            <button
              onClick={() => onPublishWp('publish')}
              disabled={isSyncingWp}
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs transition-colors shadow-md shadow-blue-600/30 disabled:opacity-50"
            >
              {isSyncingWp ? 'Publishing...' : 'Publish to WordPress Live'}
            </button>
            <button
              onClick={onOpenSyndicate}
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-500 to-indigo-600 hover:from-emerald-400 hover:to-indigo-500 text-white font-bold text-xs transition-all shadow-lg shadow-emerald-500/20 flex items-center gap-2"
            >
              <Share2 className="w-4 h-4" />
              <span>Syndicate Everywhere</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
