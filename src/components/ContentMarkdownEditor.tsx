import React, { useState } from 'react';
import {
  Bold,
  Italic,
  Heading2,
  Heading3,
  Quote,
  List,
  ListOrdered,
  Link as LinkIcon,
  Table as TableIcon,
  Code,
  Save,
  RotateCcw,
  Sparkles,
  Plus,
  Trash2,
  ArrowUp,
  ArrowDown,
  Layers,
  FileText,
  AlertCircle,
  CheckCircle2
} from 'lucide-react';
import { ArticleSection } from '../types.js';

interface ContentMarkdownEditorProps {
  title: string;
  slug: string;
  metaDescription: string;
  content: string;
  sections: ArticleSection[];
  onTitleChange: (title: string) => void;
  onSlugChange: (slug: string) => void;
  onMetaDescChange?: (metaDesc: string) => void;
  onMetaDescriptionChange?: (metaDesc: string) => void;
  onContentChange: (content: string) => void;
  onSectionsChange: (sections: ArticleSection[]) => void;
  onSave: () => void;
  onDiscard?: () => void;
  hasUnsavedChanges: boolean;
  isSaving: boolean;
  onSectionAiAction?: (sectionId: string, action: string, customInstruction?: string) => Promise<void>;
  onSectionAIAction?: (sectionId: string, action: string, customInstruction?: string) => Promise<void>;
  sectionActionLoading?: boolean;
}

export const ContentMarkdownEditor: React.FC<ContentMarkdownEditorProps> = ({
  title,
  slug,
  metaDescription,
  content,
  sections,
  onTitleChange,
  onSlugChange,
  onMetaDescChange,
  onMetaDescriptionChange,
  onContentChange,
  onSectionsChange,
  onSave,
  onDiscard,
  hasUnsavedChanges,
  isSaving,
  onSectionAiAction,
  onSectionAIAction,
  sectionActionLoading = false
}) => {
  const handleMetaChange = onMetaDescChange || onMetaDescriptionChange || (() => {});
  const handleSectionAi = onSectionAiAction || onSectionAIAction;
  const [editorMode, setEditorMode] = useState<'full' | 'sections'>('full');
  const [activeSectionId, setActiveSectionId] = useState<string | null>(null);
  const [sectionAiCustomPrompt, setSectionAiCustomPrompt] = useState<string>('');

  // Character lengths
  const titleLen = title.length;
  const metaLen = metaDescription.length;
  const wordCount = content.trim().split(/\s+/).filter(Boolean).length;

  // Insert markdown snippet into the full content editor textarea
  const insertMarkdownSnippet = (prefix: string, suffix: string = '', defaultText: string = '') => {
    const textarea = document.getElementById('markdown-main-editor') as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selected = content.substring(start, end) || defaultText;
    const replacement = `${prefix}${selected}${suffix}`;
    const newContent = content.substring(0, start) + replacement + content.substring(end);

    onContentChange(newContent);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + prefix.length, start + prefix.length + selected.length);
    }, 10);
  };

  // Synchronize section edits back to full content
  const handleSectionTextChange = (id: string, newText: string) => {
    const updated = sections.map(s => s.id === id ? { ...s, content: newText } : s);
    onSectionsChange(updated);
    // Re-synthesize markdown content
    const reassembled = updated.map(s => `${s.level === 3 ? '###' : '##'} ${s.heading}\n\n${s.content}`).join('\n\n');
    onContentChange(reassembled);
  };

  const handleSectionHeadingChange = (id: string, newHeading: string) => {
    const updated = sections.map(s => s.id === id ? { ...s, heading: newHeading } : s);
    onSectionsChange(updated);
    const reassembled = updated.map(s => `${s.level === 3 ? '###' : '##'} ${s.heading}\n\n${s.content}`).join('\n\n');
    onContentChange(reassembled);
  };

  const handleToggleSectionLevel = (id: string) => {
    const updated = sections.map(s => s.id === id ? { ...s, level: (s.level === 3 ? 2 : 3) as 2 | 3 } : s);
    onSectionsChange(updated);
    const reassembled = updated.map(s => `${s.level === 3 ? '###' : '##'} ${s.heading}\n\n${s.content}`).join('\n\n');
    onContentChange(reassembled);
  };

  const handleMoveSection = (index: number, direction: 'up' | 'down') => {
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= sections.length) return;
    const updated = [...sections];
    const [moved] = updated.splice(index, 1);
    updated.splice(newIndex, 0, moved);
    onSectionsChange(updated);
    const reassembled = updated.map(s => `${s.level === 3 ? '###' : '##'} ${s.heading}\n\n${s.content}`).join('\n\n');
    onContentChange(reassembled);
  };

  const handleDeleteSection = (id: string) => {
    if (!confirm('Are you sure you want to delete this section?')) return;
    const updated = sections.filter(s => s.id !== id);
    onSectionsChange(updated);
    const reassembled = updated.map(s => `${s.level === 3 ? '###' : '##'} ${s.heading}\n\n${s.content}`).join('\n\n');
    onContentChange(reassembled);
  };

  const handleAddNewSection = () => {
    const newSec: ArticleSection = {
      id: `sec_${Date.now()}`,
      heading: 'New Topic Section',
      level: 2,
      content: 'Write your comprehensive section notes, explanations, and key takeaways here...'
    };
    const updated = [...sections, newSec];
    onSectionsChange(updated);
    const reassembled = updated.map(s => `${s.level === 3 ? '###' : '##'} ${s.heading}\n\n${s.content}`).join('\n\n');
    onContentChange(reassembled);
    setActiveSectionId(newSec.id);
  };

  return (
    <div className="space-y-6">
      {/* Top Meta Fields Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-emerald-400" />
            <span className="text-xs font-bold text-white uppercase tracking-wider">
              Article Meta & Search Optimization
            </span>
          </div>

          {/* Unsaved changes & Save Bar */}
          <div className="flex items-center gap-2">
            {hasUnsavedChanges && (
              <span className="flex items-center gap-1.5 text-xs text-amber-400 font-semibold px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20 animate-pulse">
                <span className="w-2 h-2 rounded-full bg-amber-400" />
                <span>Unsaved Edits</span>
              </span>
            )}
            <button
              onClick={onDiscard}
              disabled={!hasUnsavedChanges || isSaving}
              className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold disabled:opacity-40 transition-colors flex items-center gap-1"
              title="Revert edits to original"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Discard</span>
            </button>
            <button
              id="save-article-changes-btn"
              onClick={onSave}
              disabled={isSaving}
              className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold text-xs shadow-md shadow-emerald-950/40 disabled:opacity-50 transition-colors flex items-center gap-1.5 cursor-pointer"
              title="Persist edits to database"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{isSaving ? 'Saving...' : 'Save Changes'}</span>
            </button>
          </div>
        </div>

        {/* Title Input */}
        <div className="space-y-1">
          <div className="flex items-center justify-between text-xs">
            <label className="font-semibold text-slate-300">Article Title (H1)</label>
            <span className={`font-mono text-[11px] ${
              titleLen >= 40 && titleLen <= 65 ? 'text-emerald-400' : 'text-slate-400'
            }`}>
              {titleLen}/65 characters {titleLen > 65 && '(May truncate in SERP)'}
            </span>
          </div>
          <input
            type="text"
            value={title}
            onChange={(e) => onTitleChange(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm font-bold text-white focus:outline-none focus:border-emerald-500 transition-colors"
            placeholder="Enter search-optimized article title..."
          />
        </div>

        {/* Slug and Meta Description Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          {/* URL Slug */}
          <div className="md:col-span-5 space-y-1">
            <label className="text-xs font-semibold text-slate-300 block">URL Permaslug</label>
            <div className="flex items-center bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs focus-within:border-emerald-500">
              <span className="text-slate-500 font-mono">/</span>
              <input
                type="text"
                value={slug}
                onChange={(e) => onSlugChange(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-'))}
                className="w-full bg-transparent border-none text-emerald-400 font-mono focus:outline-none ml-1 text-xs"
                placeholder="url-slug-example"
              />
            </div>
          </div>

          {/* Meta Description */}
          <div className="md:col-span-7 space-y-1">
            <div className="flex items-center justify-between text-xs">
              <label className="font-semibold text-slate-300">Meta Description (Snippet)</label>
              <span className={`font-mono text-[11px] ${
                metaLen >= 120 && metaLen <= 160 ? 'text-emerald-400 font-bold' : 'text-slate-400'
              }`}>
                {metaLen}/160 chars {metaLen >= 120 && metaLen <= 160 && '✓ Optimal'}
              </span>
            </div>
            <textarea
              rows={2}
              value={metaDescription}
              onChange={(e) => handleMetaChange(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-200 focus:outline-none focus:border-emerald-500 transition-colors resize-none leading-relaxed"
              placeholder="Crisp, high-CTR meta description summarizing the post..."
            />
          </div>
        </div>
      </div>

      {/* Editor Mode Bar & Formatting Controls */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
          {/* Editor Switcher: Full Markdown vs Section Editor */}
          <div className="inline-flex p-1 bg-slate-950 border border-slate-800 rounded-xl">
            <button
              onClick={() => setEditorMode('full')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                editorMode === 'full'
                  ? 'bg-slate-800 text-emerald-400 font-bold shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Full Markdown Editor</span>
            </button>
            <button
              onClick={() => setEditorMode('sections')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                editorMode === 'sections'
                  ? 'bg-slate-800 text-emerald-400 font-bold shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Section-by-Section ({sections.length})</span>
            </button>
          </div>

          {/* Quick Word Count & Reading Time Telemetry */}
          <div className="flex items-center gap-3 text-xs text-slate-400 font-mono">
            <span>{wordCount} words</span>
            <span>•</span>
            <span>{Math.max(1, Math.round(wordCount / 200))} min read</span>
          </div>
        </div>

        {/* Formatting Toolbar (Only in Full Markdown mode) */}
        {editorMode === 'full' && (
          <div className="flex items-center gap-1 flex-wrap bg-slate-950 p-2 rounded-xl border border-slate-800/80 text-slate-300">
            <button
              type="button"
              onClick={() => insertMarkdownSnippet('**', '**', 'bold text')}
              className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-300 hover:text-white"
              title="Bold (**text**)"
            >
              <Bold className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => insertMarkdownSnippet('*', '*', 'italic text')}
              className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-300 hover:text-white"
              title="Italic (*text*)"
            >
              <Italic className="w-4 h-4" />
            </button>
            <div className="h-4 w-px bg-slate-800 mx-1" />
            <button
              type="button"
              onClick={() => insertMarkdownSnippet('\n## ', '\n', 'H2 Section Heading')}
              className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-300 hover:text-white"
              title="Heading 2 (##)"
            >
              <Heading2 className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => insertMarkdownSnippet('\n### ', '\n', 'H3 Subsection Heading')}
              className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-300 hover:text-white"
              title="Heading 3 (###)"
            >
              <Heading3 className="w-4 h-4" />
            </button>
            <div className="h-4 w-px bg-slate-800 mx-1" />
            <button
              type="button"
              onClick={() => insertMarkdownSnippet('\n> ', '\n', 'Key quote or important takeaway...')}
              className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-300 hover:text-white"
              title="Blockquote (>)"
            >
              <Quote className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => insertMarkdownSnippet('\n- ', '\n', 'Bullet list item')}
              className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-300 hover:text-white"
              title="Bullet List (-)"
            >
              <List className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => insertMarkdownSnippet('\n1. ', '\n', 'Numbered step item')}
              className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-300 hover:text-white"
              title="Numbered List (1.)"
            >
              <ListOrdered className="w-4 h-4" />
            </button>
            <div className="h-4 w-px bg-slate-800 mx-1" />
            <button
              type="button"
              onClick={() => insertMarkdownSnippet('[', '](https://example.com)', 'Anchor text')}
              className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-300 hover:text-white"
              title="Hyperlink"
            >
              <LinkIcon className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => insertMarkdownSnippet('\n\n| Column 1 | Column 2 | Column 3 |\n| --- | --- | --- |\n| Feature A | High | Optimal |\n| Feature B | Medium | Recommended |\n\n')}
              className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-300 hover:text-white"
              title="Insert Comparison Table"
            >
              <TableIcon className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => insertMarkdownSnippet('```\n', '\n```', 'code or data example')}
              className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-300 hover:text-white"
              title="Code Block"
            >
              <Code className="w-4 h-4" />
            </button>

            <div className="ml-auto flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => insertMarkdownSnippet('\n> **💡 Pro Tip:** ', '\n', 'Key practical nuance based on real-world testing.')}
                className="px-2 py-1 rounded bg-slate-900 hover:bg-slate-800 text-[11px] text-emerald-400 font-medium"
              >
                + Callout Box
              </button>
              <button
                type="button"
                onClick={() => insertMarkdownSnippet('\n### Frequently Asked Questions\n\n**Q: What is the primary benefit?**\nA: Immediate practical results with minimal overhead.\n\n')}
                className="px-2 py-1 rounded bg-slate-900 hover:bg-slate-800 text-[11px] text-cyan-400 font-medium"
              >
                + FAQ Block
              </button>
            </div>
          </div>
        )}

        {/* 1. Full Markdown Textarea Mode */}
        {editorMode === 'full' && (
          <div className="relative">
            <textarea
              id="markdown-main-editor"
              rows={26}
              value={content}
              onChange={(e) => onContentChange(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-5 font-mono text-xs text-slate-200 leading-relaxed focus:outline-none focus:border-emerald-500 transition-colors selection:bg-emerald-500/30 resize-y"
              placeholder="Write or edit full article markdown here..."
              spellCheck={true}
            />
            <div className="absolute bottom-4 right-4 text-[10px] text-slate-500 font-mono pointer-events-none bg-slate-900/80 px-2 py-1 rounded border border-slate-800">
              Markdown Mode • Live Sync
            </div>
          </div>
        )}

        {/* 2. Section-by-Section Mode */}
        {editorMode === 'sections' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-1">
              <span className="text-xs text-slate-400">
                Directly tune and rearrange individual sections without breaking formatting:
              </span>
              <button
                onClick={handleAddNewSection}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold text-xs transition-colors shadow-sm"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add New Section</span>
              </button>
            </div>

            {sections.map((sec, idx) => {
              const isH3 = sec.level === 3;
              const isAiDrawerOpen = activeSectionId === sec.id;

              return (
                <div
                  key={sec.id}
                  className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-3 transition-all hover:border-slate-700"
                >
                  {/* Section Controls Bar */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
                    <div className="flex items-center gap-2 flex-1">
                      <span className="text-xs font-mono text-slate-500 font-bold">#{idx + 1}</span>
                      <button
                        onClick={() => handleToggleSectionLevel(sec.id)}
                        className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase transition-colors ${
                          isH3
                            ? 'bg-cyan-950 text-cyan-300 border-cyan-800'
                            : 'bg-purple-950 text-purple-300 border-purple-800'
                        }`}
                        title="Click to toggle H2 vs H3 level"
                      >
                        {isH3 ? 'H3' : 'H2'}
                      </button>
                      <input
                        type="text"
                        value={sec.heading}
                        onChange={(e) => handleSectionHeadingChange(sec.id, e.target.value)}
                        className="flex-1 bg-slate-900 border border-slate-800 rounded-lg px-3 py-1 text-xs font-bold text-white focus:outline-none focus:border-emerald-500"
                        placeholder="Section Heading..."
                      />
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleMoveSection(idx, 'up')}
                        disabled={idx === 0}
                        className="p-1 rounded bg-slate-900 hover:bg-slate-850 text-slate-400 hover:text-white disabled:opacity-30"
                        title="Move Up"
                      >
                        <ArrowUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleMoveSection(idx, 'down')}
                        disabled={idx === sections.length - 1}
                        className="p-1 rounded bg-slate-900 hover:bg-slate-850 text-slate-400 hover:text-white disabled:opacity-30"
                        title="Move Down"
                      >
                        <ArrowDown className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => setActiveSectionId(isAiDrawerOpen ? null : sec.id)}
                        className="px-2 py-1 rounded bg-slate-900 hover:bg-slate-800 text-xs text-purple-300 flex items-center gap-1 border border-purple-800/40"
                        title="AI Rewrite, Expand, or Enhance"
                      >
                        <Sparkles className="w-3 h-3 text-purple-400" />
                        <span>AI Tweak</span>
                      </button>
                      <button
                        onClick={() => handleDeleteSection(sec.id)}
                        className="p-1 rounded bg-slate-900 hover:bg-red-950 text-slate-400 hover:text-red-400 transition-colors"
                        title="Delete Section"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* AI Assistant Quick Actions Drawer */}
                  {isAiDrawerOpen && onSectionAiAction && (
                    <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 space-y-2.5">
                      <div className="text-[11px] font-semibold text-slate-300 uppercase tracking-wider">
                        AI Enhancement Assistant
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {[
                          { id: 'rewrite', label: 'Rewrite' },
                          { id: 'expand', label: 'Expand In-Depth' },
                          { id: 'shorten', label: 'Condense' },
                          { id: 'add-examples', label: '+ Real Examples' },
                          { id: 'add-table', label: '+ Table' },
                          { id: 'improve-seo', label: 'Boost SEO Coverage' }
                        ].map(act => (
                          <button
                            key={act.id}
                            disabled={sectionActionLoading || !handleSectionAi}
                            onClick={() => handleSectionAi && handleSectionAi(sec.id, act.id)}
                            className="px-2.5 py-1 rounded bg-slate-850 hover:bg-purple-600 hover:text-white text-slate-300 text-xs font-medium border border-slate-700 transition-colors disabled:opacity-50"
                          >
                            {act.label}
                          </button>
                        ))}
                      </div>
                      <div className="flex gap-2 pt-1">
                        <input
                          type="text"
                          value={sectionAiCustomPrompt}
                          onChange={(e) => setSectionAiCustomPrompt(e.target.value)}
                          placeholder="Custom instruction (e.g. emphasize safety gear, add checklist)..."
                          className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-3 py-1 text-xs text-white focus:outline-none focus:border-purple-500"
                        />
                        <button
                          disabled={sectionActionLoading || !sectionAiCustomPrompt.trim() || !handleSectionAi}
                          onClick={() => {
                            if (handleSectionAi) {
                              handleSectionAi(sec.id, 'custom', sectionAiCustomPrompt);
                              setSectionAiCustomPrompt('');
                            }
                          }}
                          className="px-3 py-1 rounded-lg bg-purple-600 text-white font-bold text-xs hover:bg-purple-500 disabled:opacity-50"
                        >
                          Apply
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Textarea for Section Content */}
                  <textarea
                    rows={6}
                    value={sec.content}
                    onChange={(e) => handleSectionTextChange(sec.id, e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800/80 rounded-xl p-3 text-xs text-slate-200 leading-relaxed focus:outline-none focus:border-emerald-500 font-mono resize-y"
                    placeholder="Section text in markdown..."
                  />
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
