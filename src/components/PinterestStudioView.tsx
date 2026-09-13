import React, { useState, useRef, useEffect } from 'react';
import {
  Pin,
  Download,
  Send,
  Layers,
  Palette,
  Type,
  Image as ImageIcon,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Sparkles
} from 'lucide-react';
import { Article, PinterestPinData, PinterestGraphicConfig } from '../types.js';
import { api } from '../api.js';

interface PinterestStudioViewProps {
  articles: Article[];
  initialArticle?: Article | null;
}

export const PinterestStudioView: React.FC<PinterestStudioViewProps> = ({
  articles,
  initialArticle
}) => {
  const [selectedArticleId, setSelectedArticleId] = useState<string>(
    initialArticle?.id || articles[0]?.id || ''
  );

  const selectedArticle = articles.find(a => a.id === selectedArticleId) || articles[0];

  // Graphic Config State
  const [templateId, setTemplateId] = useState<'template-1' | 'template-2' | 'template-3'>('template-1');
  const [headline, setHeadline] = useState(selectedArticle?.pinterestPin?.graphicConfig?.headline || '7 EASY CHICKEN DINNERS IN 30 MINS');
  const [ctaText, setCtaText] = useState(selectedArticle?.pinterestPin?.graphicConfig?.ctaText || 'Save This Recipe');
  const [brandName, setBrandName] = useState(selectedArticle?.pinterestPin?.graphicConfig?.brandName || 'AI SEO Studio');
  const [primaryColor, setPrimaryColor] = useState(selectedArticle?.pinterestPin?.graphicConfig?.primaryColor || '#059669');
  const [secondaryColor, setSecondaryColor] = useState(selectedArticle?.pinterestPin?.graphicConfig?.secondaryColor || '#0f172a');
  const [imageUrl, setImageUrl] = useState(selectedArticle?.featuredImage?.url || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=1000&h=1500&q=80');

  // Pin Details State
  const [pinTitle, setPinTitle] = useState(selectedArticle?.pinterestPin?.title || '7 Fast Weeknight Chicken Dinners (Ready in 30 Mins!)');
  const [pinDescription, setPinDescription] = useState(selectedArticle?.pinterestPin?.description || 'Looking for quick inspiration? Try these incredible tips and step-by-step instructions. Save this pin for your next meal planning day! #Recipes #DinnerIdeas');
  const [selectedBoardId, setSelectedBoardId] = useState('b_chicken');

  // Pinterest API Status
  const [isConnected, setIsConnected] = useState(false);
  const [boards, setBoards] = useState<Array<{ id: string; name: string }>>([
    { id: 'b_chicken', name: 'Easy Chicken Recipes' },
    { id: 'b_mealprep', name: 'Weekly Meal Prep' },
    { id: 'b_dinner', name: 'Quick 30-Minute Dinners' }
  ]);
  const [isPublishing, setIsPublishing] = useState(false);
  const [publishResult, setPublishResult] = useState<{ success: boolean; message: string; pinUrl?: string } | null>(null);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Sync state when selected article changes
  useEffect(() => {
    if (selectedArticle) {
      setHeadline(selectedArticle.pinterestPin?.graphicConfig?.headline || selectedArticle.title.toUpperCase());
      setPinTitle(selectedArticle.pinterestPin?.title || selectedArticle.title);
      setPinDescription(selectedArticle.pinterestPin?.description || selectedArticle.metaDescription);
      if (selectedArticle.featuredImage?.url) {
        setImageUrl(selectedArticle.featuredImage.url);
      }
    }
  }, [selectedArticleId]);

  // Check Pinterest connection status
  useEffect(() => {
    api.getPinterestStatus().then(res => {
      setIsConnected(res.isConnected);
      if (res.boards && res.boards.length > 0) {
        setBoards(res.boards);
        setSelectedBoardId(res.boards[0].id);
      }
    }).catch(() => {});
  }, []);

  // Draw 1000x1500 canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = imageUrl;

    img.onload = () => {
      ctx.clearRect(0, 0, 1000, 1500);

      if (templateId === 'template-1') {
        // TEMPLATE 1: Full photo background with bottom & top dark gradient, floating center banner
        ctx.drawImage(img, 0, 0, 1000, 1500);

        // Dark gradients
        const grad = ctx.createLinearGradient(0, 0, 0, 1500);
        grad.addColorStop(0, 'rgba(15, 23, 42, 0.7)');
        grad.addColorStop(0.3, 'rgba(15, 23, 42, 0.1)');
        grad.addColorStop(0.7, 'rgba(15, 23, 42, 0.3)');
        grad.addColorStop(1, 'rgba(15, 23, 42, 0.95)');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, 1000, 1500);

        // Center card banner
        ctx.fillStyle = 'rgba(255, 255, 255, 0.96)';
        ctx.shadowColor = 'rgba(0, 0, 0, 0.35)';
        ctx.shadowBlur = 30;
        ctx.shadowOffsetY = 15;
        ctx.beginPath();
        ctx.roundRect(70, 480, 860, 480, 24);
        ctx.fill();
        ctx.shadowColor = 'transparent';

        // Top tag in card
        ctx.fillStyle = primaryColor;
        ctx.font = 'bold 28px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('WEEKEND & WEEKNIGHT FAVORITE', 500, 560);

        // Headline
        ctx.fillStyle = '#0f172a';
        ctx.font = 'bold 54px sans-serif';
        wrapText(ctx, headline, 500, 640, 760, 64);

        // CTA button inside card
        ctx.fillStyle = primaryColor;
        ctx.beginPath();
        ctx.roundRect(300, 840, 400, 75, 38);
        ctx.fill();

        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 30px sans-serif';
        ctx.fillText(ctaText.toUpperCase(), 500, 888);

        // Brand footer
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 28px sans-serif';
        ctx.fillText(brandName.toUpperCase(), 500, 1420);

      } else if (templateId === 'template-2') {
        // TEMPLATE 2: Split 65% photo top, 35% solid brand card bottom
        ctx.drawImage(img, 0, 0, 1000, 950);

        // Bottom solid card
        ctx.fillStyle = secondaryColor;
        ctx.fillRect(0, 950, 1000, 550);

        // Accent divider
        ctx.fillStyle = primaryColor;
        ctx.fillRect(0, 942, 1000, 12);

        // Brand header
        ctx.fillStyle = '#94a3b8';
        ctx.font = 'bold 26px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(brandName.toUpperCase(), 500, 1020);

        // Headline
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 52px sans-serif';
        wrapText(ctx, headline, 500, 1100, 860, 62);

        // CTA Pill
        ctx.fillStyle = primaryColor;
        ctx.beginPath();
        ctx.roundRect(320, 1340, 360, 70, 35);
        ctx.fill();

        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 28px sans-serif';
        ctx.fillText(ctaText.toUpperCase(), 500, 1385);

      } else {
        // TEMPLATE 3: Full-bleed culinary photo with top pill and bold bottom gradient
        ctx.drawImage(img, 0, 0, 1000, 1500);

        const grad = ctx.createLinearGradient(0, 800, 0, 1500);
        grad.addColorStop(0, 'transparent');
        grad.addColorStop(1, 'rgba(15, 23, 42, 0.98)');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 800, 1000, 700);

        // Top pill
        ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
        ctx.beginPath();
        ctx.roundRect(250, 80, 500, 70, 35);
        ctx.fill();

        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 26px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(brandName.toUpperCase(), 500, 124);

        // Bottom Headline
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 56px sans-serif';
        wrapText(ctx, headline, 500, 1120, 860, 66);

        // Bottom CTA
        ctx.fillStyle = primaryColor;
        ctx.beginPath();
        ctx.roundRect(300, 1330, 400, 75, 38);
        ctx.fill();

        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 30px sans-serif';
        ctx.fillText(ctaText.toUpperCase(), 500, 1378);
      }
    };
  }, [templateId, headline, ctaText, brandName, primaryColor, secondaryColor, imageUrl]);

  function wrapText(ctx: CanvasRenderingContext2D, text: string, x: number, y: number, maxWidth: number, lineHeight: number) {
    const words = text.split(' ');
    let line = '';
    let currentY = y;

    for (let n = 0; n < words.length; n++) {
      const testLine = line + words[n] + ' ';
      const metrics = ctx.measureText(testLine);
      const testWidth = metrics.width;
      if (testWidth > maxWidth && n > 0) {
        ctx.fillText(line, x, currentY);
        line = words[n] + ' ';
        currentY += lineHeight;
      } else {
        line = testLine;
      }
    }
    ctx.fillText(line, x, currentY);
  }

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement('a');
    link.download = `pinterest-pin-${selectedArticle?.slug || 'graphic'}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  const handlePublishPin = async () => {
    setIsPublishing(true);
    setPublishResult(null);

    const canvas = canvasRef.current;
    const canvasDataUrl = canvas ? canvas.toDataURL('image/png') : imageUrl;

    const pinPayload: PinterestPinData = {
      id: 'pin_' + Date.now(),
      title: pinTitle,
      description: pinDescription,
      destinationUrl: selectedArticle?.wordpressUrl || `https://example.com/${selectedArticle?.slug || ''}`,
      boardId: selectedBoardId,
      boardName: boards.find(b => b.id === selectedBoardId)?.name,
      keywords: selectedArticle?.tags || ['Recipes', 'Food'],
      cta: ctaText,
      imageUrl: canvasDataUrl,
      status: 'published',
      graphicConfig: {
        templateId,
        headline,
        brandName,
        primaryColor,
        secondaryColor,
        textColor: '#ffffff',
        ctaText,
        imageUrl,
        fontFamily: 'Plus Jakarta Sans'
      }
    };

    try {
      const res = await api.publishPin(selectedArticle?.id || '', pinPayload);
      if (res.success) {
        setPublishResult({
          success: true,
          message: `Pin created successfully on board! (Pin ID: ${res.pinId})`,
          pinUrl: res.url
        });
      } else {
        setPublishResult({
          success: false,
          message: res.error || 'Pinterest is not connected.'
        });
      }
    } catch (err) {
      setPublishResult({
        success: false,
        message: err instanceof Error ? err.message : String(err)
      });
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 space-y-6">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <Pin className="w-5 h-5 text-red-400" />
            Pinterest Vertical Visual Studio (1000 x 1500)
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Standard 2:3 Pinterest format with high-contrast typography, customizable layouts, and direct Pinterest API sync.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleDownload}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs transition-colors"
          >
            <Download className="w-4 h-4 text-emerald-400" />
            <span>Download PNG (1000x1500)</span>
          </button>
        </div>
      </div>

      {publishResult && (
        <div className={`p-4 rounded-xl text-xs flex items-center justify-between border ${
          publishResult.success
            ? 'bg-emerald-950/40 border-emerald-800/60 text-emerald-300'
            : 'bg-red-950/40 border-red-800/60 text-red-300'
        }`}>
          <div>
            <strong>{publishResult.success ? 'Publication Confirmed:' : 'Pinterest Notice:'}</strong> {publishResult.message}
            {publishResult.pinUrl && (
              <a href={publishResult.pinUrl} target="_blank" rel="noreferrer" className="underline ml-2">
                View on Pinterest
              </a>
            )}
          </div>
          <button onClick={() => setPublishResult(null)} className="font-bold ml-2">×</button>
        </div>
      )}

      {/* Main Studio Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Interactive Canvas Live Preview */}
        <div className="lg:col-span-5 flex flex-col items-center">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 w-full flex flex-col items-center">
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3 flex items-center justify-between w-full">
              <span>Canvas Live Rendering (1000x1500)</span>
              <span className="text-emerald-400 font-mono">2:3 Aspect</span>
            </div>

            <div className="relative shadow-2xl shadow-slate-950 rounded-xl overflow-hidden border border-slate-800 max-w-[340px] w-full">
              <canvas
                ref={canvasRef}
                width={1000}
                height={1500}
                className="w-full h-auto block"
              />
            </div>

            <div className="w-full text-center text-xs text-slate-500 mt-4">
              Rendered with clean client-side typography to avoid AI text artifacts.
            </div>
          </div>
        </div>

        {/* Right: Graphic Controls & Publishing Form */}
        <div className="lg:col-span-7 space-y-6">
          {/* Target Article Picker */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Layers className="w-4 h-4 text-emerald-400" />
              Source Article
            </h2>
            <select
              value={selectedArticleId}
              onChange={(e) => setSelectedArticleId(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
            >
              {articles.map(a => (
                <option key={a.id} value={a.id}>
                  {a.title} ({a.brief.primaryKeyword})
                </option>
              ))}
            </select>
          </div>

          {/* Template Picker */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Palette className="w-4 h-4 text-emerald-400" />
              Layout Template (Rule 26)
            </h2>
            <div className="grid grid-cols-3 gap-3">
              {[
                { id: 'template-1', name: 'Center Card Banner' },
                { id: 'template-2', name: 'Split Photo & Card' },
                { id: 'template-3', name: 'Full Bleed Overlay' }
              ].map(tpl => (
                <button
                  key={tpl.id}
                  onClick={() => setTemplateId(tpl.id as any)}
                  className={`p-3 rounded-xl border text-xs font-semibold text-center transition-all ${
                    templateId === tpl.id
                      ? 'bg-emerald-500/15 border-emerald-500/50 text-emerald-400 shadow-md'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:bg-slate-850'
                  }`}
                >
                  {tpl.name}
                </button>
              ))}
            </div>

            <div className="space-y-3 pt-2">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                  Card Headline
                </label>
                <input
                  type="text"
                  value={headline}
                  onChange={(e) => setHeadline(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                    Call To Action
                  </label>
                  <input
                    type="text"
                    value={ctaText}
                    onChange={(e) => setCtaText(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                    Brand Name
                  </label>
                  <input
                    type="text"
                    value={brandName}
                    onChange={(e) => setBrandName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                    Primary Accent Color
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={primaryColor}
                      onChange={(e) => setPrimaryColor(e.target.value)}
                      className="w-8 h-8 rounded border-0 bg-transparent cursor-pointer"
                    />
                    <span className="text-xs font-mono text-slate-300">{primaryColor}</span>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                    Secondary Card Color
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={secondaryColor}
                      onChange={(e) => setSecondaryColor(e.target.value)}
                      className="w-8 h-8 rounded border-0 bg-transparent cursor-pointer"
                    />
                    <span className="text-xs font-mono text-slate-300">{secondaryColor}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Pinterest Publishing Widget (Rule 28, 29, 30) */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Send className="w-4 h-4 text-red-400" />
                Pinterest API Publication (v5)
              </h2>
              <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                isConnected
                  ? 'bg-red-500/10 text-red-400 border border-red-500/20'
                  : 'bg-slate-800 text-slate-400'
              }`}>
                {isConnected ? 'API Connected' : 'Not Connected'}
              </span>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                Pinterest Board
              </label>
              <select
                value={selectedBoardId}
                onChange={(e) => setSelectedBoardId(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
              >
                {boards.map(b => (
                  <option key={b.id} value={b.id}>{b.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                Pin Title (Max 100 characters)
              </label>
              <input
                type="text"
                value={pinTitle}
                onChange={(e) => setPinTitle(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                Pin Description & Hashtags (Rule 29)
              </label>
              <textarea
                value={pinDescription}
                onChange={(e) => setPinDescription(e.target.value)}
                rows={3}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <button
              id="publish-pin-button"
              onClick={handlePublishPin}
              disabled={isPublishing}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-bold text-sm shadow-lg shadow-red-950/40 transition-all disabled:opacity-50"
            >
              <Pin className="w-4 h-4" />
              <span>{isPublishing ? 'Publishing to Pinterest...' : 'Publish Pin to Selected Board'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
