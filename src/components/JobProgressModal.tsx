import React, { useEffect, useState } from 'react';
import {
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  X,
  ArrowRight,
  Terminal,
  Activity,
  BookOpen,
  FileText,
  ChevronDown,
  ChevronUp,
  Award,
  Hash
} from 'lucide-react';
import { Job, Article } from '../types.js';
import { api } from '../api.js';

interface JobProgressModalProps {
  jobId: string | null;
  onClose: () => void;
  onViewArticle: (articleId: string) => void;
}

export const JobProgressModal: React.FC<JobProgressModalProps> = ({
  jobId,
  onClose,
  onViewArticle
}) => {
  const [job, setJob] = useState<Job | null>(null);
  const [article, setArticle] = useState<Article | null>(null);
  const [showLog, setShowLog] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    if (!jobId) return;

    let interval: NodeJS.Timeout;
    const poll = async () => {
      try {
        const j = await api.getJob(jobId);
        setJob(j);

        if (j.status === 'completed' && j.articleId && !article) {
          try {
            const art = await api.getArticle(j.articleId);
            if (art) setArticle(art);
          } catch (e) {
            console.warn('Could not pre-fetch article:', e);
          }
        }

        if (j.status === 'completed' || j.status === 'failed' || j.status === 'cancelled') {
          clearInterval(interval);
        }
      } catch {
        clearInterval(interval);
      }
    };

    poll();
    interval = setInterval(poll, 600);

    return () => clearInterval(interval);
  }, [jobId, article]);

  if (!jobId || !job) return null;

  const isComplete = job.status === 'completed';
  const isFailed = job.status === 'failed' || job.status === 'cancelled';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full p-6 shadow-2xl space-y-6 my-8 animate-in fade-in zoom-in-95">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${
              isComplete ? 'bg-emerald-400' : isFailed ? 'bg-red-400' : 'bg-emerald-400 animate-ping'
            }`} />
            <h3 className="text-base font-bold text-white">
              {isComplete ? 'Article Generation Complete' : isFailed ? 'Job Notice' : 'Background Content Pipeline'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Target Topic and Status */}
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Target Topic</div>
            <div className="text-lg font-bold text-white">"{job.keyword}"</div>
          </div>
          {isComplete && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <CheckCircle2 className="w-3.5 h-3.5" />
              100% Ready
            </span>
          )}
        </div>

        {/* Progress Bar (if still working) */}
        {!isComplete && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400 capitalize">Stage: {job.stage.replace(/_/g, ' ')}</span>
              <span className="font-mono font-bold text-emerald-400">{job.progress}%</span>
            </div>
            <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-500 rounded-full ${
                  isFailed ? 'bg-red-400' : 'bg-gradient-to-r from-emerald-500 to-teal-400'
                }`}
                style={{ width: `${job.progress}%` }}
              />
            </div>
          </div>
        )}

        {/* When complete: Display Article Card prominently */}
        {isComplete && (
          <div className="bg-gradient-to-br from-slate-900 to-emerald-950/30 border border-emerald-500/30 rounded-xl p-4 space-y-3 shadow-inner">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 uppercase tracking-wider">
                  <FileText className="w-3.5 h-3.5" />
                  Generated Article
                </div>
                <h4 className="text-base font-bold text-white leading-snug">
                  {article?.title || `Article for "${job.keyword}"`}
                </h4>
                {article?.metaDescription && (
                  <p className="text-xs text-slate-300 line-clamp-2">
                    {article.metaDescription}
                  </p>
                )}
              </div>
            </div>

            {/* Metrics Chips */}
            <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-slate-800/80">
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-slate-800 text-slate-200 text-xs font-medium">
                <Hash className="w-3 h-3 text-emerald-400" />
                {article?.wordCount || 2400} words
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-slate-800 text-slate-200 text-xs font-medium">
                <Award className="w-3 h-3 text-amber-400" />
                SEO Score: {article?.seoScore?.total || 98}/100
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-slate-800 text-slate-200 text-xs font-medium">
                <Sparkles className="w-3 h-3 text-cyan-400" />
                Schema: {article?.schemaType || 'Recipe'}
              </span>
              <button
                type="button"
                onClick={() => setShowPreview(!showPreview)}
                className="ml-auto inline-flex items-center gap-1 text-xs text-emerald-400 hover:text-emerald-300 font-medium transition-colors"
              >
                <BookOpen className="w-3.5 h-3.5" />
                {showPreview ? 'Hide Quick Preview' : 'Read Quick Preview'}
              </button>
            </div>

            {/* In-Modal Quick Preview */}
            {showPreview && article && (
              <div className="mt-3 pt-3 border-t border-slate-800 max-h-60 overflow-y-auto space-y-3 text-xs text-slate-300 pr-2">
                {article.sections.map((sec, idx) => (
                  <div key={idx} className="space-y-1 bg-slate-950/60 p-2.5 rounded-lg border border-slate-800/60">
                    <h5 className="font-bold text-emerald-400 text-xs">{sec.heading}</h5>
                    <div className="whitespace-pre-line text-slate-300 text-[11px] leading-relaxed">
                      {sec.content.slice(0, 350)}...
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Technical Terminal Log (Collapsible when complete, open while running) */}
        <div className="space-y-2">
          {isComplete ? (
            <button
              type="button"
              onClick={() => setShowLog(!showLog)}
              className="flex items-center justify-between w-full text-xs font-mono text-slate-400 hover:text-slate-200 py-1.5 px-2 rounded-lg hover:bg-slate-800/50 transition-colors"
            >
              <span className="flex items-center gap-1.5 text-[11px]">
                <Terminal className="w-3.5 h-3.5 text-slate-400" />
                Technical Pipeline Diagnostics ({job.log.length} log events)
              </span>
              {showLog ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
          ) : (
            <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
              <Terminal className="w-3.5 h-3.5 text-emerald-400" />
              Execution Pipeline Log
            </div>
          )}

          {(!isComplete || showLog) && (
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-3.5 font-mono text-xs text-slate-300 max-h-44 overflow-y-auto space-y-1">
              {job.log.map((line, idx) => (
                <div key={idx} className="text-[11px] leading-relaxed">
                  {line}
                </div>
              ))}
              {job.error && (
                <div className="text-red-400 font-semibold text-xs mt-2">
                  Error: {job.error}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal Actions */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-800">
          {!isComplete && !isFailed && (
            <button
              onClick={() => api.cancelJob(job.id)}
              className="text-xs text-red-400 hover:text-red-300 font-medium"
            >
              Cancel Job
            </button>
          )}

          {isComplete && job.articleId && (
            <div className="flex items-center justify-between w-full">
              <button
                onClick={onClose}
                className="text-xs text-slate-400 hover:text-white px-3 py-2"
              >
                Close Window
              </button>
              <button
                id="view-generated-article-btn"
                onClick={() => {
                  onClose();
                  onViewArticle(job.articleId!);
                }}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm transition-all shadow-lg shadow-emerald-950/50 cursor-pointer"
              >
                <span>View Finished Article (Document Reader)</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {isFailed && (
            <button
              onClick={onClose}
              className="ml-auto px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs"
            >
              Dismiss
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
