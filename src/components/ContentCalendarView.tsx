import React, { useState } from 'react';
import {
  Calendar as CalendarIcon,
  Plus,
  Trash2,
  CheckCircle2,
  Clock,
  Pin,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { ContentCalendarItem, ArticleType } from '../types.js';
import { api } from '../api.js';

interface ContentCalendarViewProps {
  calendar: ContentCalendarItem[];
  onGenerateKeyword: (keyword: string) => void;
  onRefreshCalendar: () => void;
}

export const ContentCalendarView: React.FC<ContentCalendarViewProps> = ({
  calendar,
  onGenerateKeyword,
  onRefreshCalendar
}) => {
  const [topic, setTopic] = useState('');
  const [keyword, setKeyword] = useState('');
  const [articleType, setArticleType] = useState<ArticleType>('how-to');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('high');
  const [publishDate, setPublishDate] = useState(new Date().toISOString().split('T')[0]);
  const [isAdding, setIsAdding] = useState(false);

  const handleAddItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!keyword.trim()) return;

    setIsAdding(true);
    try {
      await api.addCalendarItem({
        topic: topic.trim() || keyword.trim(),
        keyword: keyword.trim(),
        articleType,
        priority,
        status: 'planned',
        publishDate,
        pinterestStatus: 'not_created'
      });
      setTopic('');
      setKeyword('');
      onRefreshCalendar();
    } catch (err) {
      alert('Failed to add calendar item: ' + (err instanceof Error ? err.message : String(err)));
    } finally {
      setIsAdding(false);
    }
  };

  const handleDeleteItem = async (id: string) => {
    try {
      await api.deleteCalendarItem(id);
      onRefreshCalendar();
    } catch (err) {
      alert('Failed to delete calendar item: ' + (err instanceof Error ? err.message : String(err)));
    }
  };

  return (
    <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <CalendarIcon className="w-5 h-5 text-emerald-400" />
            SEO Editorial Content Calendar
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Organize publishing deadlines, topical priorities, and track WordPress and Pinterest distribution states.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Form: Add Schedule Item */}
        <div className="lg:col-span-4">
          <form onSubmit={handleAddItem} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2 border-b border-slate-800 pb-3">
              <Plus className="w-4 h-4 text-emerald-400" />
              Schedule New Publication
            </h2>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1">
                Target Keyword *
              </label>
              <input
                type="text"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder="e.g. meal prep chicken recipes"
                required
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1">
                Topic Title / Hook
              </label>
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g. Healthy Batch Cooking"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1">
                  Article Type
                </label>
                <select
                  value={articleType}
                  onChange={(e) => setArticleType(e.target.value as ArticleType)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                >
                  <option value="how-to">How-To</option>
                  <option value="recipe">Recipe</option>
                  <option value="listicle">Listicle</option>
                  <option value="informational">Deep-Dive</option>
                  <option value="review">Review</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1">
                  Priority
                </label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as any)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                >
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1">
                Planned Date
              </label>
              <input
                type="date"
                value={publishDate}
                onChange={(e) => setPublishDate(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <button
              type="submit"
              disabled={isAdding || !keyword.trim()}
              className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold text-xs transition-colors disabled:opacity-50"
            >
              {isAdding ? 'Adding...' : 'Add to Editorial Calendar'}
            </button>
          </form>
        </div>

        {/* Right: Calendar Items List */}
        <div className="lg:col-span-8">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center justify-between border-b border-slate-800 pb-3">
              <span>Planned Publications ({calendar.length})</span>
            </h2>

            <div className="space-y-3">
              {calendar.map(item => (
                <div
                  key={item.id}
                  className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                        item.priority === 'high'
                          ? 'bg-red-500/20 text-red-300'
                          : item.priority === 'medium'
                          ? 'bg-amber-500/20 text-amber-300'
                          : 'bg-slate-800 text-slate-400'
                      }`}>
                        {item.priority} Priority
                      </span>
                      <span className="text-xs text-slate-400 font-mono flex items-center gap-1">
                        <Clock className="w-3 h-3 text-slate-500" />
                        {item.publishDate}
                      </span>
                      <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                        {item.status}
                      </span>
                    </div>

                    <h3 className="text-sm font-bold text-white">{item.topic}</h3>
                    <p className="text-xs text-emerald-400 font-mono">"{item.keyword}"</p>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-center">
                    <button
                      onClick={() => onGenerateKeyword(item.keyword)}
                      className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold text-xs flex items-center gap-1 transition-colors"
                    >
                      <Sparkles className="w-3 h-3" />
                      <span>Write Article</span>
                    </button>
                    <button
                      onClick={() => handleDeleteItem(item.id)}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-red-400 transition-colors"
                      title="Delete Schedule"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
