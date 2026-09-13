import React, { useState } from 'react';
import {
  GitBranch,
  Sparkles,
  Layers,
  CheckCircle2,
  Calendar,
  ArrowRight,
  Plus,
  Compass,
  FolderTree
} from 'lucide-react';
import { TopicClusterNode } from '../types.js';
import { api } from '../api.js';

interface TopicalAuthorityViewProps {
  clusters: TopicClusterNode[];
  onGenerateKeyword: (keyword: string) => void;
  onRefreshClusters: () => void;
}

export const TopicalAuthorityView: React.FC<TopicalAuthorityViewProps> = ({
  clusters,
  onGenerateKeyword,
  onRefreshClusters
}) => {
  const [pillarInput, setPillarInput] = useState('healthy recipes');
  const [isGeneratingTree, setIsGeneratingTree] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerateTree = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pillarInput.trim()) return;

    setIsGeneratingTree(true);
    setError(null);
    try {
      await api.generateClusterTree(pillarInput.trim());
      setPillarInput('');
      onRefreshClusters();
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setIsGeneratingTree(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <GitBranch className="w-5 h-5 text-emerald-400" />
            Topical Authority & Content Cluster Architect
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Build systematic semantic depth: map Pillar Guides → Sub-topic Clusters → Supporting Long-tail Articles.
          </p>
        </div>

        <form onSubmit={handleGenerateTree} className="flex items-center gap-2 w-full md:w-auto">
          <input
            type="text"
            value={pillarInput}
            onChange={(e) => setPillarInput(e.target.value)}
            placeholder="New Pillar Topic..."
            className="bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 w-full md:w-64"
          />
          <button
            type="submit"
            disabled={isGeneratingTree || !pillarInput.trim()}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold text-xs transition-colors whitespace-nowrap disabled:opacity-50"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{isGeneratingTree ? 'Building Tree...' : 'Generate Cluster Tree'}</span>
          </button>
        </form>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-950/40 border border-red-800/60 text-red-300 text-xs">
          {error}
        </div>
      )}

      {/* Cluster Trees */}
      <div className="space-y-8">
        {clusters.map(pillar => (
          <div key={pillar.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
            {/* Pillar Header Card */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-gradient-to-r from-emerald-950/40 to-slate-950 p-4 rounded-xl border border-emerald-800/30">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center font-bold">
                  P
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400">Pillar Node</span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 uppercase">{pillar.intent}</span>
                  </div>
                  <h2 className="text-lg font-bold text-white">{pillar.title}</h2>
                </div>
              </div>

              <button
                onClick={() => onGenerateKeyword(pillar.keyword)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold text-xs transition-colors self-start sm:self-auto"
              >
                <span>Write Pillar Article</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            {/* Sub-Clusters Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {pillar.children?.map(subCluster => (
                <div
                  key={subCluster.id}
                  className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-3 flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-blue-400 bg-blue-950/60 px-2 py-0.5 rounded border border-blue-800/30">
                        Sub-Cluster
                      </span>
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                        subCluster.status === 'generated'
                          ? 'bg-emerald-500/20 text-emerald-300'
                          : 'bg-slate-800 text-slate-400'
                      }`}>
                        {subCluster.status}
                      </span>
                    </div>

                    <h3 className="text-sm font-bold text-white">{subCluster.title}</h3>
                    <p className="text-xs text-slate-400 font-mono">"{subCluster.keyword}"</p>

                    {/* Supporting Subtopics */}
                    {subCluster.children && subCluster.children.length > 0 && (
                      <div className="pt-2 border-t border-slate-800/80 space-y-1.5">
                        <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider block">
                          Supporting Long-Tail Articles:
                        </span>
                        {subCluster.children.map(child => (
                          <div key={child.id} className="flex items-center justify-between text-xs py-1 px-2 rounded bg-slate-900/60 border border-slate-800/60">
                            <span className="text-slate-300 truncate mr-2">{child.title}</span>
                            <button
                              onClick={() => onGenerateKeyword(child.keyword)}
                              title="Generate this supporting article"
                              className="text-emerald-400 hover:text-emerald-300 font-bold shrink-0"
                            >
                              +
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <button
                    onClick={() => onGenerateKeyword(subCluster.keyword)}
                    className="w-full mt-2 py-2 rounded-lg bg-slate-900 hover:bg-slate-850 border border-slate-800 text-slate-200 text-xs font-semibold flex items-center justify-center gap-1 transition-colors"
                  >
                    <span>Generate Cluster Article</span>
                    <ArrowRight className="w-3 h-3 text-emerald-400" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
