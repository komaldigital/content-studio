import React, { useState, useEffect } from 'react';
import {
  X,
  Share2,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Globe,
  Pin,
  Send,
  Sparkles,
  Loader2,
  Layers,
  Heart,
  MessageCircle,
  Bookmark,
  ThumbsUp,
  Share,
  MessageSquare
} from 'lucide-react';
import {
  Article,
  AppSettings,
  MultiChannelPublishRequest,
  MultiChannelPublishResult
} from '../types.js';
import { api } from '../api.js';

interface MultiChannelPublishModalProps {
  article: Article;
  settings: AppSettings | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (updatedArticle: Article) => void;
}

export const MultiChannelPublishModal: React.FC<MultiChannelPublishModalProps> = ({
  article,
  settings,
  isOpen,
  onClose,
  onSuccess
}) => {
  if (!isOpen) return null;

  const defaultImageUrl =
    article.featuredImage?.url ||
    (article.articleImages && article.articleImages[0]?.url) ||
    'https://upload.wikimedia.org/wikipedia/commons/0/0a/Sourdough.jpg';

  const liveArticleUrl =
    article.wordpressUrl || `${settings?.brand?.websiteUrl || 'https://example.com'}/${article.slug}`;

  // Channel selections
  const [selectedChannels, setSelectedChannels] = useState({
    wordpress: true,
    facebook: true,
    pinterest: true,
    instagram: true
  });

  // Active preview tab
  const [activePreviewTab, setActivePreviewTab] = useState<'facebook' | 'instagram' | 'pinterest' | 'wordpress'>('facebook');

  // Channel customizations
  const [wpStatus, setWpStatus] = useState<'draft' | 'publish'>(settings?.wordpress?.defaultPostStatus === 'publish' ? 'publish' : 'draft');
  const [wpCategory, setWpCategory] = useState<string>(article.category || 'Guides & Tutorials');

  const [fbMessage, setFbMessage] = useState<string>(
    `📖 ${article.title}\n\n${article.metaDescription}\n\n👉 Read the full step-by-step guide: ${liveArticleUrl}\n\n${(settings?.facebook?.defaultHashtags || ['#recipes', '#content', '#guide']).join(' ')}`
  );

  const [pinTitle, setPinTitle] = useState<string>(article.title.slice(0, 100));
  const [pinDescription, setPinDescription] = useState<string>(
    `${article.metaDescription} Discover actionable steps, essential tips, and complete breakdown. Read now!`
  );
  const [pinBoardId, setPinBoardId] = useState<string>(
    settings?.pinterest?.selectedBoardId || (settings?.pinterest?.boards && settings.pinterest.boards[0]?.id) || ''
  );

  const [igCaption, setIgCaption] = useState<string>(
    `✨ ${article.title.toUpperCase()}\n\n${article.metaDescription}\n\n💡 Key takeaway: Master the proven framework with actionable steps and pro advice.\n\n🔗 Tap the link in our bio for the complete guide!\n\n---\n${(settings?.instagram?.defaultHashtags || ['#lifestyle', '#inspo', '#learn']).join(' ')}`
  );
  const [igAspectRatio, setIgAspectRatio] = useState<'1:1' | '4:5'>('1:1');

  // Execution state
  const [isPublishing, setIsPublishing] = useState(false);
  const [publishResult, setPublishResult] = useState<MultiChannelPublishResult | null>(null);
  const [generalError, setGeneralError] = useState<string | null>(null);

  const toggleChannel = (channel: keyof typeof selectedChannels) => {
    setSelectedChannels(prev => ({ ...prev, [channel]: !prev[channel] }));
  };

  const selectedCount = Object.values(selectedChannels).filter(Boolean).length;

  const handlePublishAll = async () => {
    if (selectedCount === 0) {
      setGeneralError('Please select at least one channel to publish to.');
      return;
    }

    setIsPublishing(true);
    setGeneralError(null);
    setPublishResult(null);

    const payload: MultiChannelPublishRequest = {
      articleId: article.id,
      channels: selectedChannels,
      customizations: {
        wordpress: {
          status: wpStatus,
          category: wpCategory,
          tags: article.tags || [article.brief.primaryKeyword]
        },
        facebook: {
          message: fbMessage,
          link: liveArticleUrl,
          imageUrl: defaultImageUrl
        },
        pinterest: {
          boardId: pinBoardId,
          title: pinTitle,
          description: pinDescription,
          destinationUrl: liveArticleUrl,
          imageUrl: defaultImageUrl
        },
        instagram: {
          caption: igCaption,
          imageUrl: defaultImageUrl,
          aspectRatio: igAspectRatio
        }
      }
    };

    try {
      const res = await api.publishToAllChannels(payload);
      setPublishResult(res);
      if (res.article) {
        onSuccess(res.article);
      }
    } catch (err) {
      setGeneralError(err instanceof Error ? err.message : String(err));
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-5xl overflow-hidden shadow-2xl my-auto flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/60 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-indigo-500 flex items-center justify-center text-white shadow-lg shadow-emerald-500/20">
              <Share2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
                  Multi-Channel Syndication Studio
                </h2>
                <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  4 Channels
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Publish simultaneously to WordPress, Facebook, Pinterest, and Instagram with platform-optimized copy.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body: Split into Setup & Preview */}
        <div className="p-5 overflow-y-auto flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Channels & Customization */}
          <div className="lg:col-span-6 space-y-5">
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 block">
                1. Select Target Publishing Channels
              </label>

              <div className="grid grid-cols-2 gap-2.5">
                {/* WordPress Card */}
                <div
                  onClick={() => toggleChannel('wordpress')}
                  className={`p-3 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                    selectedChannels.wordpress
                      ? 'bg-blue-950/30 border-blue-500/60 shadow-sm shadow-blue-950/40'
                      : 'bg-slate-900 border-slate-800 opacity-60 hover:opacity-100'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold text-xs">
                      WP
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white">WordPress</div>
                      <div className="text-[10px] text-slate-400">
                        {settings?.wordpress?.isConnected ? '● Connected' : 'Draft / REST'}
                      </div>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={selectedChannels.wordpress}
                    onChange={() => {}}
                    className="rounded border-slate-700 text-blue-600 focus:ring-blue-500"
                  />
                </div>

                {/* Facebook Card */}
                <div
                  onClick={() => toggleChannel('facebook')}
                  className={`p-3 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                    selectedChannels.facebook
                      ? 'bg-indigo-950/30 border-indigo-500/60 shadow-sm shadow-indigo-950/40'
                      : 'bg-slate-900 border-slate-800 opacity-60 hover:opacity-100'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold text-xs">
                      FB
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white">Facebook Page</div>
                      <div className="text-[10px] text-slate-400">
                        {settings?.facebook?.isConnected ? `● ${settings.facebook.pageName || 'Connected'}` : 'Page Feed / Photo'}
                      </div>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={selectedChannels.facebook}
                    onChange={() => {}}
                    className="rounded border-slate-700 text-indigo-600 focus:ring-indigo-500"
                  />
                </div>

                {/* Pinterest Card */}
                <div
                  onClick={() => toggleChannel('pinterest')}
                  className={`p-3 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                    selectedChannels.pinterest
                      ? 'bg-red-950/30 border-red-500/60 shadow-sm shadow-red-950/40'
                      : 'bg-slate-900 border-slate-800 opacity-60 hover:opacity-100'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-red-500/20 text-red-400 flex items-center justify-center font-bold text-xs">
                      PIN
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white">Pinterest</div>
                      <div className="text-[10px] text-slate-400">
                        {settings?.pinterest?.isConnected ? '● Connected' : 'Vertical Pin v5'}
                      </div>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={selectedChannels.pinterest}
                    onChange={() => {}}
                    className="rounded border-slate-700 text-red-600 focus:ring-red-500"
                  />
                </div>

                {/* Instagram Card */}
                <div
                  onClick={() => toggleChannel('instagram')}
                  className={`p-3 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                    selectedChannels.instagram
                      ? 'bg-fuchsia-950/30 border-fuchsia-500/60 shadow-sm shadow-fuchsia-950/40'
                      : 'bg-slate-900 border-slate-800 opacity-60 hover:opacity-100'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-fuchsia-500/20 text-fuchsia-400 flex items-center justify-center font-bold text-xs">
                      IG
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white">Instagram</div>
                      <div className="text-[10px] text-slate-400">
                        {settings?.instagram?.isConnected ? `● @${settings.instagram.accountUsername || 'creator'}` : 'Creator / Feed'}
                      </div>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={selectedChannels.instagram}
                    onChange={() => {}}
                    className="rounded border-slate-700 text-fuchsia-600 focus:ring-fuchsia-500"
                  />
                </div>
              </div>
            </div>

            {/* Customization Accordion based on selected channel */}
            <div className="space-y-4">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
                2. Customize Channel Messages & Media
              </label>

              {/* WordPress Options */}
              {selectedChannels.wordpress && (
                <div className="p-3.5 rounded-xl bg-slate-950/40 border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-blue-400 flex items-center gap-1.5">
                      <Globe className="w-3.5 h-3.5" /> WordPress Settings
                    </span>
                    <div className="flex items-center gap-1 bg-slate-900 p-0.5 rounded-lg border border-slate-800 text-[11px]">
                      <button
                        type="button"
                        onClick={() => setWpStatus('draft')}
                        className={`px-2 py-0.5 rounded font-semibold transition-colors ${
                          wpStatus === 'draft' ? 'bg-slate-700 text-white' : 'text-slate-400'
                        }`}
                      >
                        Draft
                      </button>
                      <button
                        type="button"
                        onClick={() => setWpStatus('publish')}
                        className={`px-2 py-0.5 rounded font-semibold transition-colors ${
                          wpStatus === 'publish' ? 'bg-blue-600 text-white' : 'text-slate-400'
                        }`}
                      >
                        Live Publish
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] text-slate-400 block mb-1">Category</label>
                    <input
                      type="text"
                      value={wpCategory}
                      onChange={e => setWpCategory(e.target.value)}
                      className="w-full text-xs px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-200 focus:outline-none focus:border-blue-500"
                      placeholder="e.g. Recipes, SEO Guides"
                    />
                  </div>
                </div>
              )}

              {/* Facebook Message */}
              {selectedChannels.facebook && (
                <div className="p-3.5 rounded-xl bg-slate-950/40 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-indigo-400 flex items-center gap-1.5">
                      <MessageSquare className="w-3.5 h-3.5" /> Facebook Post Message
                    </span>
                    <button
                      type="button"
                      onClick={() => setActivePreviewTab('facebook')}
                      className="text-[11px] text-indigo-400 hover:underline"
                    >
                      Preview Post
                    </button>
                  </div>
                  <textarea
                    rows={3}
                    value={fbMessage}
                    onChange={e => setFbMessage(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-200 focus:outline-none focus:border-indigo-500 font-sans"
                    placeholder="Engaging caption, link, and hashtags..."
                  />
                </div>
              )}

              {/* Pinterest Pin Details */}
              {selectedChannels.pinterest && (
                <div className="p-3.5 rounded-xl bg-slate-950/40 border border-slate-800 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-red-400 flex items-center gap-1.5">
                      <Pin className="w-3.5 h-3.5" /> Pinterest Pin Details
                    </span>
                    <button
                      type="button"
                      onClick={() => setActivePreviewTab('pinterest')}
                      className="text-[11px] text-red-400 hover:underline"
                    >
                      Preview Pin
                    </button>
                  </div>

                  <div className="space-y-2">
                    <input
                      type="text"
                      value={pinTitle}
                      onChange={e => setPinTitle(e.target.value)}
                      maxLength={100}
                      className="w-full text-xs px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-200 focus:outline-none focus:border-red-500"
                      placeholder="Pin Title (max 100 chars)"
                    />
                    <textarea
                      rows={2}
                      value={pinDescription}
                      onChange={e => setPinDescription(e.target.value)}
                      maxLength={500}
                      className="w-full text-xs p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-200 focus:outline-none focus:border-red-500 font-sans"
                      placeholder="Pin Description (max 500 chars)"
                    />
                    {settings?.pinterest?.boards && settings.pinterest.boards.length > 0 && (
                      <select
                        value={pinBoardId}
                        onChange={e => setPinBoardId(e.target.value)}
                        className="w-full text-xs px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-200 focus:outline-none focus:border-red-500"
                      >
                        {settings.pinterest.boards.map(b => (
                          <option key={b.id} value={b.id}>
                            Board: {b.name}
                          </option>
                        ))}
                      </select>
                    )}
                  </div>
                </div>
              )}

              {/* Instagram Caption & Aspect Ratio */}
              {selectedChannels.instagram && (
                <div className="p-3.5 rounded-xl bg-slate-950/40 border border-slate-800 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-fuchsia-400 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5" /> Instagram Feed Caption
                    </span>
                    <div className="flex items-center gap-1 bg-slate-900 p-0.5 rounded-lg border border-slate-800 text-[11px]">
                      <button
                        type="button"
                        onClick={() => setIgAspectRatio('1:1')}
                        className={`px-2 py-0.5 rounded font-semibold transition-colors ${
                          igAspectRatio === '1:1' ? 'bg-fuchsia-600 text-white' : 'text-slate-400'
                        }`}
                      >
                        1:1 Square
                      </button>
                      <button
                        type="button"
                        onClick={() => setIgAspectRatio('4:5')}
                        className={`px-2 py-0.5 rounded font-semibold transition-colors ${
                          igAspectRatio === '4:5' ? 'bg-fuchsia-600 text-white' : 'text-slate-400'
                        }`}
                      >
                        4:5 Portrait
                      </button>
                    </div>
                  </div>

                  <textarea
                    rows={3}
                    value={igCaption}
                    onChange={e => setIgCaption(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-200 focus:outline-none focus:border-fuchsia-500 font-sans"
                    placeholder="Storytelling caption with hashtags..."
                  />
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Live Mockup & Preview */}
          <div className="lg:col-span-6 flex flex-col space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Live Feed Mockup
              </label>

              {/* Preview Tab Selector */}
              <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
                <button
                  type="button"
                  onClick={() => setActivePreviewTab('facebook')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                    activePreviewTab === 'facebook'
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Facebook
                </button>
                <button
                  type="button"
                  onClick={() => setActivePreviewTab('instagram')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                    activePreviewTab === 'instagram'
                      ? 'bg-fuchsia-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Instagram
                </button>
                <button
                  type="button"
                  onClick={() => setActivePreviewTab('pinterest')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                    activePreviewTab === 'pinterest'
                      ? 'bg-red-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Pinterest
                </button>
                <button
                  type="button"
                  onClick={() => setActivePreviewTab('wordpress')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                    activePreviewTab === 'wordpress'
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  WordPress
                </button>
              </div>
            </div>

            {/* Preview Display Container */}
            <div className="flex-1 bg-slate-950 border border-slate-800 rounded-2xl p-4 flex items-center justify-center min-h-[380px]">
              {/* FACEBOOK PREVIEW */}
              {activePreviewTab === 'facebook' && (
                <div className="w-full max-w-sm bg-white rounded-xl shadow-lg text-slate-900 overflow-hidden font-sans border border-slate-200">
                  {/* FB Header */}
                  <div className="p-3 flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm">
                      {settings?.facebook?.pageName ? settings.facebook.pageName.charAt(0) : 'P'}
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-900 leading-tight">
                        {settings?.facebook?.pageName || settings?.brand?.brandName || 'Content Studio Page'}
                      </div>
                      <div className="text-[10px] text-slate-500 flex items-center gap-1">
                        Just now • 🌐 Public
                      </div>
                    </div>
                  </div>

                  {/* FB Message */}
                  <div className="px-3 pb-2 text-xs text-slate-800 whitespace-pre-line line-clamp-3">
                    {fbMessage}
                  </div>

                  {/* FB Link Card */}
                  <div className="border-t border-slate-100 bg-slate-50 cursor-pointer">
                    <img
                      src={defaultImageUrl}
                      alt={article.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-44 object-cover"
                    />
                    <div className="p-2.5">
                      <div className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">
                        {settings?.brand?.websiteUrl ? settings.brand.websiteUrl.replace(/https?:\/\//, '') : 'example.com'}
                      </div>
                      <div className="text-xs font-bold text-slate-900 line-clamp-1 mt-0.5">
                        {article.title}
                      </div>
                      <div className="text-[11px] text-slate-600 line-clamp-1 mt-0.5">
                        {article.metaDescription}
                      </div>
                    </div>
                  </div>

                  {/* FB Actions */}
                  <div className="px-3 py-2 border-t border-slate-100 flex items-center justify-between text-slate-500 text-xs font-medium">
                    <div className="flex items-center gap-1 hover:text-blue-600 cursor-pointer">
                      <ThumbsUp className="w-3.5 h-3.5" /> Like
                    </div>
                    <div className="flex items-center gap-1 hover:text-blue-600 cursor-pointer">
                      <MessageSquare className="w-3.5 h-3.5" /> Comment
                    </div>
                    <div className="flex items-center gap-1 hover:text-blue-600 cursor-pointer">
                      <Share className="w-3.5 h-3.5" /> Share
                    </div>
                  </div>
                </div>
              )}

              {/* INSTAGRAM PREVIEW */}
              {activePreviewTab === 'instagram' && (
                <div className="w-full max-w-xs bg-slate-900 rounded-2xl shadow-xl border border-slate-800 overflow-hidden font-sans text-white">
                  {/* IG Top Bar */}
                  <div className="p-2.5 flex items-center justify-between border-b border-slate-800">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-amber-400 via-rose-500 to-purple-600 p-[2px]">
                        <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center text-[10px] font-bold">
                          {settings?.instagram?.accountUsername ? settings.instagram.accountUsername.charAt(0).toUpperCase() : 'I'}
                        </div>
                      </div>
                      <span className="text-xs font-bold">
                        {settings?.instagram?.accountUsername || 'content_creator'}
                      </span>
                    </div>
                    <span className="text-slate-500 font-bold">•••</span>
                  </div>

                  {/* IG Media Photo */}
                  <div className={`relative overflow-hidden bg-slate-950 ${igAspectRatio === '4:5' ? 'aspect-[4/5]' : 'aspect-square'}`}>
                    <img
                      src={defaultImageUrl}
                      alt={article.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* IG Action Icons */}
                  <div className="p-2.5 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 text-white">
                        <Heart className="w-4 h-4 cursor-pointer hover:text-rose-500" />
                        <MessageCircle className="w-4 h-4 cursor-pointer" />
                        <Send className="w-4 h-4 cursor-pointer" />
                      </div>
                      <Bookmark className="w-4 h-4 cursor-pointer" />
                    </div>

                    {/* IG Caption snippet */}
                    <div className="text-[11px] leading-relaxed text-slate-300">
                      <span className="font-bold text-white mr-1.5">
                        {settings?.instagram?.accountUsername || 'content_creator'}
                      </span>
                      <span className="whitespace-pre-line line-clamp-3">
                        {igCaption}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* PINTEREST PREVIEW */}
              {activePreviewTab === 'pinterest' && (
                <div className="w-full max-w-[220px] aspect-[2/3] relative rounded-2xl overflow-hidden shadow-2xl border border-slate-800 bg-slate-900 group">
                  <img
                    src={defaultImageUrl}
                    alt={article.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                  {/* Pin Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-slate-950/40 to-transparent p-3.5 flex flex-col justify-between">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500 text-slate-950">
                        {article.category || 'Article'}
                      </span>
                      <button className="px-2.5 py-1 rounded-full bg-red-600 text-white font-bold text-xs shadow-md">
                        Save
                      </button>
                    </div>

                    <div className="space-y-1">
                      <h4 className="text-sm font-black text-white leading-tight line-clamp-3">
                        {pinTitle}
                      </h4>
                      <p className="text-[10px] text-slate-300 line-clamp-2">
                        {pinDescription}
                      </p>
                      <div className="pt-1 text-[9px] text-slate-400 font-mono">
                        {settings?.brand?.websiteUrl?.replace(/https?:\/\//, '') || 'example.com'}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* WORDPRESS PREVIEW */}
              {activePreviewTab === 'wordpress' && (
                <div className="w-full max-w-sm bg-white rounded-xl shadow-lg text-slate-900 overflow-hidden font-sans border border-slate-200 p-4 space-y-3">
                  <div className="flex items-center justify-between text-xs text-slate-500 border-b pb-2">
                    <span className="font-semibold text-blue-600">{wpCategory}</span>
                    <span className="capitalize px-2 py-0.5 rounded bg-slate-100 text-[10px] font-bold">
                      Status: {wpStatus}
                    </span>
                  </div>

                  <img
                    src={defaultImageUrl}
                    alt={article.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-36 object-cover rounded-lg"
                  />

                  <div className="space-y-1">
                    <h3 className="text-sm font-black text-slate-900 leading-snug">
                      {article.title}
                    </h3>
                    <p className="text-xs text-slate-600 line-clamp-2">
                      {article.metaDescription}
                    </p>
                  </div>

                  <div className="text-[10px] text-slate-400 flex items-center justify-between pt-2 border-t">
                    <span>By {settings?.brand?.brandName || 'Admin'}</span>
                    <span>{article.readingTimeMinutes} min read</span>
                  </div>
                </div>
              )}
            </div>

            {/* Results / Error Display */}
            {generalError && (
              <div className="p-3 rounded-xl bg-red-950/40 border border-red-800/60 text-red-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                <span>{generalError}</span>
              </div>
            )}

            {publishResult && (
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    Publication Summary: {publishResult.publishedCount} Channels Published
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  {/* WP Result */}
                  {publishResult.channels.wordpress?.attempted && (
                    <div className={`p-2 rounded-lg border ${
                      publishResult.channels.wordpress.success
                        ? 'bg-blue-950/30 border-blue-500/40 text-blue-300'
                        : 'bg-red-950/30 border-red-500/40 text-red-300'
                    }`}>
                      <div className="font-bold flex items-center justify-between">
                        <span>WordPress:</span>
                        <span>{publishResult.channels.wordpress.success ? '✓ Synced' : '✗ Failed'}</span>
                      </div>
                      {publishResult.channels.wordpress.url && (
                        <a
                          href={publishResult.channels.wordpress.url}
                          target="_blank"
                          rel="noreferrer"
                          className="text-[11px] underline flex items-center gap-1 mt-1 text-blue-400"
                        >
                          View Post <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                      {publishResult.channels.wordpress.error && (
                        <p className="text-[10px] text-red-400 mt-1 line-clamp-1">
                          {publishResult.channels.wordpress.error}
                        </p>
                      )}
                    </div>
                  )}

                  {/* Facebook Result */}
                  {publishResult.channels.facebook?.attempted && (
                    <div className={`p-2 rounded-lg border ${
                      publishResult.channels.facebook.success
                        ? 'bg-indigo-950/30 border-indigo-500/40 text-indigo-300'
                        : 'bg-red-950/30 border-red-500/40 text-red-300'
                    }`}>
                      <div className="font-bold flex items-center justify-between">
                        <span>Facebook:</span>
                        <span>{publishResult.channels.facebook.success ? '✓ Posted' : '✗ Failed'}</span>
                      </div>
                      {publishResult.channels.facebook.url && (
                        <a
                          href={publishResult.channels.facebook.url}
                          target="_blank"
                          rel="noreferrer"
                          className="text-[11px] underline flex items-center gap-1 mt-1 text-indigo-400"
                        >
                          View on FB <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                      {publishResult.channels.facebook.error && (
                        <p className="text-[10px] text-red-400 mt-1 line-clamp-1">
                          {publishResult.channels.facebook.error}
                        </p>
                      )}
                    </div>
                  )}

                  {/* Pinterest Result */}
                  {publishResult.channels.pinterest?.attempted && (
                    <div className={`p-2 rounded-lg border ${
                      publishResult.channels.pinterest.success
                        ? 'bg-red-950/30 border-red-500/40 text-red-300'
                        : 'bg-red-950/30 border-red-500/40 text-red-300'
                    }`}>
                      <div className="font-bold flex items-center justify-between">
                        <span>Pinterest:</span>
                        <span>{publishResult.channels.pinterest.success ? '✓ Pinned' : '✗ Failed'}</span>
                      </div>
                      {publishResult.channels.pinterest.url && (
                        <a
                          href={publishResult.channels.pinterest.url}
                          target="_blank"
                          rel="noreferrer"
                          className="text-[11px] underline flex items-center gap-1 mt-1 text-red-400"
                        >
                          View Pin <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                      {publishResult.channels.pinterest.error && (
                        <p className="text-[10px] text-red-400 mt-1 line-clamp-1">
                          {publishResult.channels.pinterest.error}
                        </p>
                      )}
                    </div>
                  )}

                  {/* Instagram Result */}
                  {publishResult.channels.instagram?.attempted && (
                    <div className={`p-2 rounded-lg border ${
                      publishResult.channels.instagram.success
                        ? 'bg-fuchsia-950/30 border-fuchsia-500/40 text-fuchsia-300'
                        : 'bg-red-950/30 border-red-500/40 text-red-300'
                    }`}>
                      <div className="font-bold flex items-center justify-between">
                        <span>Instagram:</span>
                        <span>{publishResult.channels.instagram.success ? '✓ Published' : '✗ Failed'}</span>
                      </div>
                      {publishResult.channels.instagram.url && (
                        <a
                          href={publishResult.channels.instagram.url}
                          target="_blank"
                          rel="noreferrer"
                          className="text-[11px] underline flex items-center gap-1 mt-1 text-fuchsia-400"
                        >
                          View on IG <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                      {publishResult.channels.instagram.error && (
                        <p className="text-[10px] text-red-400 mt-1 line-clamp-1">
                          {publishResult.channels.instagram.error}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-slate-800 flex items-center justify-between bg-slate-950/60 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            Cancel
          </button>

          <button
            id="multi-channel-publish-trigger-btn"
            type="button"
            onClick={handlePublishAll}
            disabled={isPublishing || selectedCount === 0}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-500 to-indigo-600 hover:from-emerald-400 hover:to-indigo-500 text-white text-xs sm:text-sm font-bold shadow-lg shadow-emerald-500/20 flex items-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            {isPublishing ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Syndicating across {selectedCount} Channels...</span>
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                <span>Publish to All Selected Channels ({selectedCount})</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
