import React, { useEffect, useState } from 'react';
import {
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  X,
  ArrowRight,
  Terminal,
  Activity
} from 'lucide-react';
import { Job } from '../types.js';
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

  useEffect(() => {
    if (!jobId) return;

    let interval: NodeJS.Timeout;
    const poll = async () => {
      try {
        const j = await api.getJob(jobId);
        setJob(j);
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
  }, [jobId]);

  if (!jobId || !job) return null;

  const isComplete = job.status === 'completed';
  const isFailed = job.status === 'failed' || job.status === 'cancelled';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-xl w-full p-6 shadow-2xl space-y-6 animate-in fade-in zoom-in-95">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${
              isComplete ? 'bg-emerald-400' : isFailed ? 'bg-red-400' : 'bg-emerald-400 animate-ping'
            }`} />
            <h3 className="text-base font-bold text-white">
              {isComplete ? 'Generation Complete' : isFailed ? 'Job Notice' : 'Background Content Pipeline'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Target Keyword and Status */}
        <div>
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Target Topic</div>
          <div className="text-lg font-bold text-white">"{job.keyword}"</div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400 capitalize">Stage: {job.stage.replace(/_/g, ' ')}</span>
            <span className="font-mono font-bold text-emerald-400">{job.progress}%</span>
          </div>
          <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-500 rounded-full ${
                isComplete ? 'bg-emerald-400' : isFailed ? 'bg-red-400' : 'bg-gradient-to-r from-emerald-500 to-teal-400'
              }`}
              style={{ width: `${job.progress}%` }}
            />
          </div>
        </div>

        {/* Live Terminal Log */}
        <div className="bg-slate-950 border border-slate-800 rounded-xl p-3.5 font-mono text-xs text-slate-300 max-h-48 overflow-y-auto space-y-1">
          <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1 mb-2">
            <Terminal className="w-3.5 h-3.5 text-emerald-400" />
            Execution Pipeline Log
          </div>
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

        {/* Modal Actions */}
        <div className="flex items-center justify-between pt-2">
          {!isComplete && !isFailed && (
            <button
              onClick={() => api.cancelJob(job.id)}
              className="text-xs text-red-400 hover:text-red-300 font-medium"
            >
              Cancel Job
            </button>
          )}

          {isComplete && job.articleId && (
            <button
              id="view-generated-article-btn"
              onClick={() => {
                onClose();
                onViewArticle(job.articleId!);
              }}
              className="ml-auto flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold text-xs transition-colors shadow-lg shadow-emerald-950/40"
            >
              <span>Inspect Generated Article</span>
              <ArrowRight className="w-4 h-4" />
            </button>
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
