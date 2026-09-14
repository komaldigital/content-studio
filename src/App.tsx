/**
 * AI SEO Content Studio - Main Application Component
 */

import React, { useState, useEffect } from 'react';
import { Header } from './components/Header.js';
import { GeneratorView } from './components/GeneratorView.js';
import { KeywordResearchView } from './components/KeywordResearchView.js';
import { ArticlesView } from './components/ArticlesView.js';
import { PinterestStudioView } from './components/PinterestStudioView.js';
import { TopicalAuthorityView } from './components/TopicalAuthorityView.js';
import { ContentCalendarView } from './components/ContentCalendarView.js';
import { BulkAndRefreshView } from './components/BulkAndRefreshView.js';
import { SettingsAndBridgeView } from './components/SettingsAndBridgeView.js';
import { JobProgressModal } from './components/JobProgressModal.js';
import { api } from './api.js';
import { Article, AppSettings, Job, ContentCalendarItem, TopicClusterNode } from './types.js';
import {
  FALLBACK_SETTINGS,
  FALLBACK_ARTICLES,
  FALLBACK_CALENDAR,
  FALLBACK_CLUSTERS
} from './data/fallbackData.js';

export default function App() {
  const [currentTab, setCurrentTab] = useState('generator');
  const [articles, setArticles] = useState<Article[]>(FALLBACK_ARTICLES);
  const [selectedArticleId, setSelectedArticleId] = useState<string | null>(FALLBACK_ARTICLES[0]?.id || null);
  const [settings, setSettings] = useState<AppSettings | null>(FALLBACK_SETTINGS);
  const [calendar, setCalendar] = useState<ContentCalendarItem[]>(FALLBACK_CALENDAR);
  const [clusters, setClusters] = useState<TopicClusterNode[]>(FALLBACK_CLUSTERS);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [activeJobModalId, setActiveJobModalId] = useState<string | null>(null);
  const [targetPinterestArticle, setTargetPinterestArticle] = useState<Article | null>(null);
  const [targetGeneratorKeyword, setTargetGeneratorKeyword] = useState<string | undefined>(undefined);
  const [targetSecondaryKeywords, setTargetSecondaryKeywords] = useState<string[] | undefined>(undefined);

  const refreshAllData = async () => {
    try {
      const [arts, sets, cal, clus, jbs] = await Promise.all([
        api.getArticles(),
        api.getSettings(),
        api.getCalendar(),
        api.getClusters(),
        api.getJobs()
      ]);
      if (arts && arts.length > 0) setArticles(arts);
      if (sets) setSettings(sets);
      if (cal && cal.length > 0) setCalendar(cal);
      if (clus && clus.length > 0) setClusters(clus);
      if (jbs) setJobs(jbs);
      if (!selectedArticleId && arts && arts.length > 0) {
        setSelectedArticleId(arts[0].id);
      }
    } catch (err) {
      console.warn('Initial data load notice:', err);
    }
  };

  useEffect(() => {
    refreshAllData();
  }, []);

  const handleToggleTestMode = async () => {
    if (!settings) return;
    const newTestMode = !settings.testMode;
    try {
      const res = await api.updateSettings({ testMode: newTestMode });
      if (res.success) {
        setSettings(prev => prev ? { ...prev, testMode: newTestMode } : null);
      }
    } catch (err) {
      console.error('Failed to toggle test mode:', err);
    }
  };

  const handleJobStarted = (job: Job) => {
    setActiveJobModalId(job.id);
    setJobs(prev => [job, ...prev]);
  };

  const handleViewArticle = (articleId: string) => {
    setSelectedArticleId(articleId);
    setCurrentTab('articles');
    refreshAllData();
  };

  const handleOpenInPinterest = (article: Article) => {
    setTargetPinterestArticle(article);
    setCurrentTab('pinterest');
  };

  const handleGenerateKeyword = (keyword: string, secondaryKeywords?: string[]) => {
    setTargetGeneratorKeyword(keyword);
    setTargetSecondaryKeywords(secondaryKeywords);
    setCurrentTab('generator');
    // Scroll smoothly to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const activeJobsCount = jobs.filter(j => j.status === 'processing' || j.status === 'queued').length;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-emerald-500/30 selection:text-emerald-200">
      <Header
        currentTab={currentTab}
        onTabChange={setCurrentTab}
        settings={settings}
        onToggleTestMode={handleToggleTestMode}
        activeJobsCount={activeJobsCount}
      />

      <main className="flex-1 pb-16">
        {currentTab === 'generator' && (
          <GeneratorView
            onJobStarted={handleJobStarted}
            onViewArticle={handleViewArticle}
            initialKeyword={targetGeneratorKeyword}
            initialSecondaryKeywords={targetSecondaryKeywords}
          />
        )}

        {currentTab === 'keywords' && (
          <KeywordResearchView
            onGenerateKeyword={handleGenerateKeyword}
            onAddToCalendar={async (kw, intent) => {
              try {
                await api.addCalendarItem({
                  topic: `Guide: ${kw}`,
                  keyword: kw,
                  articleType: intent === 'recipe' ? 'recipe' : 'how-to',
                  publishDate: new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0],
                  status: 'planned',
                  priority: 'medium',
                  pinterestStatus: 'not_created'
                });
                await refreshAllData();
                setCurrentTab('calendar');
              } catch (err) {
                console.error('Failed to add calendar item:', err);
              }
            }}
          />
        )}

        {currentTab === 'articles' && (
          <ArticlesView
            articles={articles}
            selectedArticleId={selectedArticleId}
            onSelectArticle={setSelectedArticleId}
            onRefreshArticles={refreshAllData}
            onOpenInPinterest={handleOpenInPinterest}
            onNavigateToGenerator={() => setCurrentTab('generator')}
            settings={settings}
          />
        )}

        {currentTab === 'pinterest' && (
          <PinterestStudioView
            articles={articles}
            initialArticle={targetPinterestArticle}
          />
        )}

        {currentTab === 'authority' && (
          <TopicalAuthorityView
            clusters={clusters}
            onGenerateKeyword={handleGenerateKeyword}
            onRefreshClusters={refreshAllData}
          />
        )}

        {currentTab === 'calendar' && (
          <ContentCalendarView
            calendar={calendar}
            onGenerateKeyword={handleGenerateKeyword}
            onRefreshCalendar={refreshAllData}
          />
        )}

        {currentTab === 'bulk-refresh' && (
          <BulkAndRefreshView
            onRefreshJobs={refreshAllData}
            onNavigateToJobs={() => {
              const active = jobs.find(j => j.status === 'processing' || j.status === 'queued');
              if (active) setActiveJobModalId(active.id);
            }}
          />
        )}

        {currentTab === 'settings' && (
          <SettingsAndBridgeView
            settings={settings}
            onRefreshSettings={refreshAllData}
          />
        )}
      </main>

      {/* Background Job Progress Modal */}
      {activeJobModalId && (
        <JobProgressModal
          jobId={activeJobModalId}
          onClose={() => {
            setActiveJobModalId(null);
            refreshAllData();
          }}
          onViewArticle={handleViewArticle}
        />
      )}
    </div>
  );
}
