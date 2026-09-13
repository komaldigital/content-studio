import React, { useState, useEffect } from 'react';
import {
  Settings,
  Shield,
  Download,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Cpu,
  Layers,
  Sparkles,
  Lock,
  ExternalLink,
  FlaskConical,
  Database,
  Key,
  Globe,
  Link2,
  Clock,
  Volume2,
  Plus,
  Trash2,
  Eye,
  EyeOff,
  Check,
  X,
  Bot,
  FileText,
  ImageIcon,
  Camera
} from 'lucide-react';
import { AppSettings, AIModelDescriptor, BrandVoice, SitemapConfig, BloggingAutomationConfig } from '../types.js';
import { api } from '../api.js';

interface SettingsAndBridgeViewProps {
  settings: AppSettings | null;
  onRefreshSettings: () => void;
}

export const SettingsAndBridgeView: React.FC<SettingsAndBridgeViewProps> = ({
  settings,
  onRefreshSettings
}) => {
  const [activeTab, setActiveTab] = useState<'byok' | 'voices' | 'sitemap' | 'automation' | 'wordpress' | 'qa'>('byok');

  // BYOK States
  const [activeModel, setActiveModel] = useState<string>(settings?.activeModel || 'gemini-3.8-flash');
  const [availableModels, setAvailableModels] = useState<AIModelDescriptor[]>([]);
  const [byokKeys, setByokKeys] = useState({
    geminiApiKey: '',
    openaiApiKey: '',
    anthropicApiKey: '',
    openrouterApiKey: '',
    straicoApiKey: '',
    perplexityApiKey: ''
  });
  const [byokConfigured, setByokConfigured] = useState<Record<string, boolean>>(settings?.byokConfigured || {});
  const [byokMasked, setByokMasked] = useState<Record<string, string>>(settings?.byokMasked || {});
  const [showKeys, setShowKeys] = useState<Record<string, boolean>>({});
  const [modelTestStatus, setModelTestStatus] = useState<Record<string, { loading: boolean; success?: boolean; message?: string }>>({});
  const [isSavingByok, setIsSavingByok] = useState(false);
  const [byokSaveMessage, setByokSaveMessage] = useState<string | null>(null);

  // WordPress & Social Save State
  const [isSavingWpSocial, setIsSavingWpSocial] = useState(false);
  const [wpSocialSaveMessage, setWpSocialSaveMessage] = useState<{ success: boolean; text: string } | null>(null);

  // Brand Voices States
  const [brandVoices, setBrandVoices] = useState<BrandVoice[]>([]);
  const [activeVoiceId, setActiveVoiceId] = useState<string>(settings?.activeBrandVoiceId || 'voice_expert');
  const [editingVoice, setEditingVoice] = useState<Partial<BrandVoice> | null>(null);
  const [isSavingVoice, setIsSavingVoice] = useState(false);

  // Sitemap States
  const [sitemapConfig, setSitemapConfig] = useState<SitemapConfig | null>(null);
  const [sitemapInputUrl, setSitemapInputUrl] = useState('');
  const [isFetchingSitemap, setIsFetchingSitemap] = useState(false);
  const [sitemapMessage, setSitemapMessage] = useState<string | null>(null);

  // Automation States
  const [automationConfig, setAutomationConfig] = useState<BloggingAutomationConfig | null>(null);
  const [isTriggeringAuto, setIsTriggeringAuto] = useState(false);
  const [autoTriggerMsg, setAutoTriggerMsg] = useState<string | null>(null);

  // WordPress & Social States
  const [wpEndpoint, setWpEndpoint] = useState(settings?.wordpress?.endpoint || '');
  const [wpUser, setWpUser] = useState(settings?.wordpress?.username || '');
  const [wpAppPassword, setWpAppPassword] = useState('');
  const [isTestingWp, setIsTestingWp] = useState(false);
  const [wpTestResult, setWpTestResult] = useState<{ success: boolean; message: string; detectedSeoPlugin?: string } | null>(null);

  const [pinterestToken, setPinterestToken] = useState('');
  const [facebookPageId, setFacebookPageId] = useState(settings?.facebook?.pageId || '');
  const [facebookToken, setFacebookToken] = useState('');
  const [isTestingFb, setIsTestingFb] = useState(false);
  const [fbTestResult, setFbTestResult] = useState<{ success: boolean; message: string } | null>(null);

  const [instagramAccountId, setInstagramAccountId] = useState(settings?.instagram?.instagramAccountId || '');
  const [instagramToken, setInstagramToken] = useState('');
  const [isTestingIg, setIsTestingIg] = useState(false);
  const [igTestResult, setIgTestResult] = useState<{ success: boolean; message: string } | null>(null);

  // QA Suite state
  const [isRunningQA, setIsRunningQA] = useState(false);
  const [qaResults, setQaResults] = useState<{ status: string; passed: number; total: number; tests: any[] } | null>(null);

  // Seedream 4.5 Image Test state
  const [testSeedreamLoading, setTestSeedreamLoading] = useState(false);
  const [testSeedreamResult, setTestSeedreamResult] = useState<{
    success: boolean;
    isDirectOpenRouter?: boolean;
    durationMs?: number;
    image?: any;
    error?: string;
  } | null>(null);

  const handleTestSeedream = async () => {
    setTestSeedreamLoading(true);
    setTestSeedreamResult(null);
    try {
      const res = await api.testSeedreamImage({ key: byokKeys.openrouterApiKey });
      setTestSeedreamResult(res);
    } catch (err: any) {
      setTestSeedreamResult({ success: false, error: err.message });
    } finally {
      setTestSeedreamLoading(false);
    }
  };

  // Keep state synced when settings prop refreshes
  useEffect(() => {
    if (settings) {
      if (settings.byokConfigured) setByokConfigured(settings.byokConfigured);
      if (settings.byokMasked) setByokMasked(settings.byokMasked);
      if (settings.activeModel) setActiveModel(settings.activeModel);
      if (settings.wordpress?.endpoint) setWpEndpoint(settings.wordpress.endpoint);
      if (settings.wordpress?.username) setWpUser(settings.wordpress.username);
      if (settings.facebook?.pageId) setFacebookPageId(settings.facebook.pageId);
      if (settings.instagram?.instagramAccountId) setInstagramAccountId(settings.instagram.instagramAccountId);
    }
  }, [settings]);

  // Initial Data Fetching
  useEffect(() => {
    const loadData = async () => {
      try {
        const [modelsRes, voicesRes, sitemapRes, autoRes, settingsRes] = await Promise.all([
          api.getModels(),
          api.getBrandVoices(),
          api.getSitemap(),
          api.getAutomations(),
          api.getSettings()
        ]);
        if (modelsRes.availableModels) setAvailableModels(modelsRes.availableModels);
        if (modelsRes.activeModel) setActiveModel(modelsRes.activeModel);
        if (modelsRes.byokConfigured || settingsRes.byokConfigured) {
          setByokConfigured(modelsRes.byokConfigured || settingsRes.byokConfigured || {});
        }
        if (settingsRes.byokMasked || modelsRes.byokMasked) {
          setByokMasked(settingsRes.byokMasked || modelsRes.byokMasked || {});
        }
        if (voicesRes.voices) {
          setBrandVoices(voicesRes.voices);
          setActiveVoiceId(voicesRes.activeVoiceId);
        }
        if (sitemapRes) {
          setSitemapConfig(sitemapRes);
          setSitemapInputUrl(sitemapRes.sitemapUrl || '');
        }
        if (autoRes) setAutomationConfig(autoRes);
        if (settingsRes.wordpress) {
          if (settingsRes.wordpress.endpoint) setWpEndpoint(settingsRes.wordpress.endpoint);
          if (settingsRes.wordpress.username) setWpUser(settingsRes.wordpress.username);
        }
        if (settingsRes.facebook?.pageId) setFacebookPageId(settingsRes.facebook.pageId);
        if (settingsRes.instagram?.instagramAccountId) setInstagramAccountId(settingsRes.instagram.instagramAccountId);
      } catch (err) {
        console.warn('Settings auxiliary data load error:', err);
      }
    };
    loadData();
  }, []);

  // Handlers for BYOK
  const handleSaveByok = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingByok(true);
    setByokSaveMessage(null);
    try {
      const res = await api.saveByokKeys(byokKeys, activeModel);
      if (res.success) {
        setByokSaveMessage('API keys and active engine successfully saved to persistent disk storage.');
        if (res.byokConfigured) setByokConfigured(res.byokConfigured);
        if (res.byokMasked) setByokMasked(res.byokMasked);
        // Clear plaintext inputs so masked placeholders take over
        setByokKeys({
          geminiApiKey: '',
          openaiApiKey: '',
          anthropicApiKey: '',
          openrouterApiKey: '',
          straicoApiKey: '',
          perplexityApiKey: ''
        });
        onRefreshSettings();
      } else {
        setByokSaveMessage(`Notice: ${res.message || 'Update completed.'}`);
      }
    } catch (err: any) {
      setByokSaveMessage(`Error: ${err.message}`);
    } finally {
      setIsSavingByok(false);
    }
  };

  const handleClearKey = async (keyName: keyof typeof byokKeys) => {
    if (!window.confirm('Are you sure you want to remove this saved API key?')) return;
    setIsSavingByok(true);
    try {
      const res = await api.saveByokKeys({ [keyName]: '__CLEAR__' }, activeModel);
      if (res.success) {
        if (res.byokConfigured) setByokConfigured(res.byokConfigured);
        if (res.byokMasked) setByokMasked(res.byokMasked);
        setByokKeys(prev => ({ ...prev, [keyName]: '' }));
        setByokSaveMessage('Key successfully cleared from persistent storage.');
        onRefreshSettings();
      }
    } catch (err: any) {
      setByokSaveMessage(`Error clearing key: ${err.message}`);
    } finally {
      setIsSavingByok(false);
    }
  };

  const handleSaveWordPressAndSocial = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingWpSocial(true);
    setWpSocialSaveMessage(null);
    try {
      const updates: any = {
        wordpress: {
          endpoint: wpEndpoint,
          username: wpUser,
          ...(wpAppPassword && wpAppPassword !== '********' ? { applicationPassword: wpAppPassword } : {})
        },
        pinterest: {
          ...(pinterestToken && pinterestToken !== '********' ? { accessToken: pinterestToken } : {})
        },
        facebook: {
          pageId: facebookPageId,
          ...(facebookToken && facebookToken !== '********' ? { accessToken: facebookToken } : {})
        },
        instagram: {
          instagramAccountId: instagramAccountId,
          ...(instagramToken && instagramToken !== '********' ? { accessToken: instagramToken } : {})
        }
      };
      const res = await api.updateSettings(updates);
      if (res.success) {
        setWpSocialSaveMessage({
          success: true,
          text: 'WordPress and Social credentials saved to persistent storage.'
        });
        setWpAppPassword('');
        setFacebookToken('');
        setInstagramToken('');
        setPinterestToken('');
        onRefreshSettings();
      } else {
        setWpSocialSaveMessage({
          success: false,
          text: res.error || 'Failed to save settings.'
        });
      }
    } catch (err: any) {
      setWpSocialSaveMessage({
        success: false,
        text: `Error saving credentials: ${err.message}`
      });
    } finally {
      setIsSavingWpSocial(false);
    }
  };

  const handleTestModel = async (modelId: string) => {
    setModelTestStatus(prev => ({ ...prev, [modelId]: { loading: true } }));
    try {
      let keyToTest: string | undefined = undefined;
      if (modelId.startsWith('gemini')) keyToTest = byokKeys.geminiApiKey;
      else if (modelId.startsWith('gpt')) keyToTest = byokKeys.openaiApiKey;
      else if (modelId.startsWith('claude')) keyToTest = byokKeys.anthropicApiKey;
      else if (modelId.startsWith('openrouter')) keyToTest = byokKeys.openrouterApiKey;
      else if (modelId.startsWith('straico')) keyToTest = byokKeys.straicoApiKey;

      const res = await api.testModel(modelId, keyToTest);
      setModelTestStatus(prev => ({
        ...prev,
        [modelId]: {
          loading: false,
          success: res.success,
          message: res.message || (res.success ? `Connected! Latency: ${res.latencyMs}ms` : res.error)
        }
      }));
    } catch (err: any) {
      setModelTestStatus(prev => ({
        ...prev,
        [modelId]: { loading: false, success: false, message: err.message }
      }));
    }
  };

  // Handlers for Brand Voice
  const handleSaveBrandVoice = async () => {
    if (!editingVoice || !editingVoice.name) return;
    setIsSavingVoice(true);
    try {
      const res = await api.saveBrandVoice(editingVoice);
      if (res.success) {
        setBrandVoices(res.voices);
        setEditingVoice(null);
      }
    } catch (err) {
      alert('Failed to save brand voice');
    } finally {
      setIsSavingVoice(false);
    }
  };

  const handleDeleteVoice = async (id: string) => {
    if (!confirm('Are you sure you want to delete this brand voice profile?')) return;
    try {
      const res = await api.deleteBrandVoice(id);
      if (res.success) setBrandVoices(res.voices);
    } catch (err) {
      alert('Failed to delete brand voice');
    }
  };

  // Handlers for Sitemap
  const handleFetchSitemap = async () => {
    setIsFetchingSitemap(true);
    setSitemapMessage(null);
    try {
      const res = await api.fetchSitemap(sitemapInputUrl);
      if (res.success) {
        setSitemapConfig(prev => prev ? { ...prev, entries: res.entries, sitemapUrl: res.sitemapUrl } : null);
        setSitemapMessage(`Successfully indexed ${res.count} URLs from sitemap.`);
      } else {
        setSitemapMessage(`Notice: ${res.error || 'Could not fetch sitemap'}`);
      }
    } catch (err: any) {
      setSitemapMessage(`Fetch error: ${err.message}`);
    } finally {
      setIsFetchingSitemap(false);
    }
  };

  // Handlers for Automation
  const handleToggleAutomation = async (enabled: boolean) => {
    if (!automationConfig) return;
    const updated = { ...automationConfig, enabled };
    setAutomationConfig(updated);
    await api.saveAutomations({ enabled });
  };

  const handleTriggerAutomation = async () => {
    setIsTriggeringAuto(true);
    setAutoTriggerMsg(null);
    try {
      const res = await api.triggerAutomation();
      setAutoTriggerMsg(res.message || 'Background automation worker initiated.');
    } catch (err: any) {
      setAutoTriggerMsg(`Trigger error: ${err.message}`);
    } finally {
      setIsTriggeringAuto(false);
    }
  };

  // Handlers for WordPress & Social
  const handleTestWordPress = async () => {
    setIsTestingWp(true);
    setWpTestResult(null);
    try {
      const res = await api.testWordPress();
      setWpTestResult(res);
    } catch (err: any) {
      setWpTestResult({ success: false, message: err.message });
    } finally {
      setIsTestingWp(false);
    }
  };

  const handleTestFacebook = async () => {
    setIsTestingFb(true);
    setFbTestResult(null);
    try {
      if (facebookToken && facebookPageId) {
        await api.connectFacebook(facebookPageId, facebookToken);
      }
      const res = await api.getFacebookStatus();
      setFbTestResult({
        success: res.isConnected,
        message: res.isConnected ? `Connected to Facebook Page "${res.pageName || res.pageId}".` : 'Facebook is not connected.'
      });
      onRefreshSettings();
    } catch (err: any) {
      setFbTestResult({ success: false, message: err.message });
    } finally {
      setIsTestingFb(false);
    }
  };

  const handleTestInstagram = async () => {
    setIsTestingIg(true);
    setIgTestResult(null);
    try {
      if (instagramToken && instagramAccountId) {
        await api.connectInstagram(instagramAccountId, instagramToken);
      }
      const res = await api.getInstagramStatus();
      setIgTestResult({
        success: res.isConnected,
        message: res.isConnected ? `Connected to Instagram Account "@${res.accountUsername || res.instagramAccountId}".` : 'Instagram is not connected.'
      });
      onRefreshSettings();
    } catch (err: any) {
      setIgTestResult({ success: false, message: err.message });
    } finally {
      setIsTestingIg(false);
    }
  };

  const handleRunQASuite = async () => {
    setIsRunningQA(true);
    try {
      const res = await api.runTestSuite();
      setQaResults(res);
    } catch (err: any) {
      alert('QA Test run failed: ' + err.message);
    } finally {
      setIsRunningQA(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-xl font-bold text-white flex items-center gap-2">
              <Settings className="w-5 h-5 text-emerald-400" />
              Engine Settings & Integrations
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              BYOK Enabled
            </span>
          </div>
          <p className="text-xs text-slate-400 max-w-2xl">
            Generates SEO-optimized articles in minutes that aim to rank on Google and get cited by AI search engines. Keep costs predictable through Bring-Your-Own-API-Key (BYOK) with multi-model freedom across GPT-4, Claude, and Gemini.
          </p>
        </div>

        <button
          onClick={handleRunQASuite}
          disabled={isRunningQA}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-xs font-bold transition-colors disabled:opacity-50"
        >
          <FlaskConical className="w-4 h-4" />
          <span>{isRunningQA ? 'Running Verification...' : 'Run Automated QA Suite'}</span>
        </button>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-3 overflow-x-auto">
        {[
          { id: 'byok', label: 'AI Models & BYO Keys', icon: Key },
          { id: 'voices', label: 'Brand Voice & GEO', icon: Volume2 },
          { id: 'sitemap', label: 'Sitemap & Internal Linking', icon: Globe },
          { id: 'automation', label: 'Blogging Automation', icon: Clock },
          { id: 'wordpress', label: 'WordPress & Channels', icon: Layers },
          { id: 'qa', label: 'QA Checklist', icon: CheckCircle2 }
        ].map(t => {
          const Icon = t.icon;
          const isActive = activeTab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id as any)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900 border border-transparent'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{t.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: AI MODELS & BYO KEYS */}
      {activeTab === 'byok' && (
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-5">
              <div>
                <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <Key className="w-4 h-4 text-emerald-400" />
                  Bring Your Own API Keys (BYOK)
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Keep costs 100% predictable by plugging in direct keys for OpenAI, Anthropic, Gemini, OpenRouter, Straico, or Perplexity.
                </p>
              </div>
              <div className="text-right">
                <span className="text-[11px] font-semibold text-slate-400">Current Default Engine:</span>
                <div className="text-xs font-bold text-emerald-400 uppercase tracking-wide">
                  {availableModels.find(m => m.id === activeModel)?.name || activeModel}
                </div>
              </div>
            </div>

            {byokSaveMessage && (
              <div className="p-3 mb-5 rounded-xl bg-emerald-950/40 border border-emerald-800/60 text-emerald-300 text-xs flex items-center gap-2">
                <Check className="w-4 h-4" />
                <span>{byokSaveMessage}</span>
              </div>
            )}

            <form onSubmit={handleSaveByok} className="space-y-6">
              {/* Default Engine Selection */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                  Primary AI Generation Engine
                </label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {availableModels.map(m => {
                    const isSelected = activeModel === m.id;
                    const testState = modelTestStatus[m.id];
                    return (
                      <div
                        key={m.id}
                        onClick={() => setActiveModel(m.id)}
                        className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                          isSelected
                            ? 'bg-emerald-950/30 border-emerald-500 shadow-md ring-1 ring-emerald-500/20'
                            : 'bg-slate-950/70 border-slate-800 hover:border-slate-700'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-bold text-white">{m.name}</span>
                          <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">
                            {m.provider}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400 line-clamp-2 mb-2">{m.description}</p>
                        <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 text-[10px]">
                          <span className="text-slate-500">Context: {m.contextWindow}</span>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleTestModel(m.id);
                            }}
                            disabled={testState?.loading}
                            className="text-emerald-400 hover:text-emerald-300 font-semibold"
                          >
                            {testState?.loading ? 'Pinging...' : 'Test Connection'}
                          </button>
                        </div>
                        {testState && (
                          <div className={`mt-2 p-1.5 rounded text-[10px] font-mono ${
                            testState.success ? 'bg-emerald-900/30 text-emerald-300' : 'bg-red-900/30 text-red-300'
                          }`}>
                            {testState.message}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* API Key Inputs */}
              <div className="border-t border-slate-800 pt-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                    <Shield className="w-3.5 h-3.5 text-emerald-400" />
                    Provider Credentials (BYOK)
                  </h3>
                  <span className="text-[11px] text-slate-400">
                    Keys are securely stored in persistent storage. To keep an existing key, simply leave its field blank.
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Gemini Key */}
                  <div className="bg-slate-950/70 border border-slate-800 p-3.5 rounded-xl space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-semibold text-slate-300">Google Gemini API Key</label>
                      {byokConfigured.gemini ? (
                        <div className="flex items-center gap-2">
                          <span className="inline-flex items-center gap-1 text-[10px] text-emerald-400 font-semibold bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-800/60">
                            <Check className="w-2.5 h-2.5" /> Saved & Active
                          </span>
                          <button
                            type="button"
                            onClick={() => handleClearKey('geminiApiKey')}
                            className="text-[10px] text-red-400 hover:text-red-300 underline font-medium"
                          >
                            Remove
                          </button>
                        </div>
                      ) : (
                        <span className="text-[10px] text-slate-500">Not configured</span>
                      )}
                    </div>
                    {byokMasked.geminiApiKey && (
                      <div className="text-[10px] font-mono text-slate-400 flex items-center justify-between">
                        <span>Current: <strong className="text-emerald-400">{byokMasked.geminiApiKey}</strong></span>
                      </div>
                    )}
                    <div className="relative">
                      <input
                        type={showKeys.gemini ? 'text' : 'password'}
                        value={byokKeys.geminiApiKey}
                        onChange={(e) => setByokKeys({ ...byokKeys, geminiApiKey: e.target.value })}
                        placeholder={byokMasked.geminiApiKey ? `${byokMasked.geminiApiKey} (Leave blank to keep saved key)` : "AIzaSy... (leave blank to keep current)"}
                        className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 pr-9 text-xs text-white focus:outline-none focus:border-emerald-500 font-mono"
                      />
                      <button
                        type="button"
                        onClick={() => setShowKeys({ ...showKeys, gemini: !showKeys.gemini })}
                        className="absolute right-2.5 top-2.5 text-slate-500 hover:text-slate-300"
                      >
                        {showKeys.gemini ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                    <span className="text-[10px] text-slate-500 block">Powers Gemini 2.5/3.8 Flash, Pro, and Imagen 3</span>
                  </div>

                  {/* OpenAI Key */}
                  <div className="bg-slate-950/70 border border-slate-800 p-3.5 rounded-xl space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-semibold text-slate-300">OpenAI API Key</label>
                      {byokConfigured.openai ? (
                        <div className="flex items-center gap-2">
                          <span className="inline-flex items-center gap-1 text-[10px] text-emerald-400 font-semibold bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-800/60">
                            <Check className="w-2.5 h-2.5" /> Saved & Active
                          </span>
                          <button
                            type="button"
                            onClick={() => handleClearKey('openaiApiKey')}
                            className="text-[10px] text-red-400 hover:text-red-300 underline font-medium"
                          >
                            Remove
                          </button>
                        </div>
                      ) : (
                        <span className="text-[10px] text-slate-500">Not configured</span>
                      )}
                    </div>
                    {byokMasked.openaiApiKey && (
                      <div className="text-[10px] font-mono text-slate-400 flex items-center justify-between">
                        <span>Current: <strong className="text-emerald-400">{byokMasked.openaiApiKey}</strong></span>
                      </div>
                    )}
                    <div className="relative">
                      <input
                        type={showKeys.openai ? 'text' : 'password'}
                        value={byokKeys.openaiApiKey}
                        onChange={(e) => setByokKeys({ ...byokKeys, openaiApiKey: e.target.value })}
                        placeholder={byokMasked.openaiApiKey ? `${byokMasked.openaiApiKey} (Leave blank to keep saved key)` : "sk-proj-... (leave blank to keep current)"}
                        className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 pr-9 text-xs text-white focus:outline-none focus:border-emerald-500 font-mono"
                      />
                      <button
                        type="button"
                        onClick={() => setShowKeys({ ...showKeys, openai: !showKeys.openai })}
                        className="absolute right-2.5 top-2.5 text-slate-500 hover:text-slate-300"
                      >
                        {showKeys.openai ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                    <span className="text-[10px] text-slate-500 block">Powers GPT-4o and GPT-4o-mini generation</span>
                  </div>

                  {/* Anthropic Key */}
                  <div className="bg-slate-950/70 border border-slate-800 p-3.5 rounded-xl space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-semibold text-slate-300">Anthropic Claude Key</label>
                      {byokConfigured.anthropic ? (
                        <div className="flex items-center gap-2">
                          <span className="inline-flex items-center gap-1 text-[10px] text-emerald-400 font-semibold bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-800/60">
                            <Check className="w-2.5 h-2.5" /> Saved & Active
                          </span>
                          <button
                            type="button"
                            onClick={() => handleClearKey('anthropicApiKey')}
                            className="text-[10px] text-red-400 hover:text-red-300 underline font-medium"
                          >
                            Remove
                          </button>
                        </div>
                      ) : (
                        <span className="text-[10px] text-slate-500">Not configured</span>
                      )}
                    </div>
                    {byokMasked.anthropicApiKey && (
                      <div className="text-[10px] font-mono text-slate-400 flex items-center justify-between">
                        <span>Current: <strong className="text-emerald-400">{byokMasked.anthropicApiKey}</strong></span>
                      </div>
                    )}
                    <div className="relative">
                      <input
                        type={showKeys.anthropic ? 'text' : 'password'}
                        value={byokKeys.anthropicApiKey}
                        onChange={(e) => setByokKeys({ ...byokKeys, anthropicApiKey: e.target.value })}
                        placeholder={byokMasked.anthropicApiKey ? `${byokMasked.anthropicApiKey} (Leave blank to keep saved key)` : "sk-ant-... (leave blank to keep current)"}
                        className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 pr-9 text-xs text-white focus:outline-none focus:border-emerald-500 font-mono"
                      />
                      <button
                        type="button"
                        onClick={() => setShowKeys({ ...showKeys, anthropic: !showKeys.anthropic })}
                        className="absolute right-2.5 top-2.5 text-slate-500 hover:text-slate-300"
                      >
                        {showKeys.anthropic ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                    <span className="text-[10px] text-slate-500 block">Powers Claude 3.5 Sonnet long-form writing</span>
                  </div>

                  {/* OpenRouter Key */}
                  <div className="bg-slate-950/70 border border-purple-800/60 p-3.5 rounded-xl space-y-2 ring-1 ring-purple-900/30">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <label className="text-xs font-semibold text-purple-200">OpenRouter API Key</label>
                        <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-purple-900/80 text-purple-300 border border-purple-700/60 uppercase">
                          Seedream 4.5 Primary
                        </span>
                      </div>
                      {byokConfigured.openrouter ? (
                        <div className="flex items-center gap-2">
                          <span className="inline-flex items-center gap-1 text-[10px] text-purple-300 font-semibold bg-purple-950/80 px-2 py-0.5 rounded-full border border-purple-700/60">
                            <Check className="w-2.5 h-2.5 text-purple-400" /> Saved & Active
                          </span>
                          <button
                            type="button"
                            onClick={() => handleClearKey('openrouterApiKey')}
                            className="text-[10px] text-red-400 hover:text-red-300 underline font-medium"
                          >
                            Remove
                          </button>
                        </div>
                      ) : (
                        <span className="text-[10px] text-slate-500">Not configured</span>
                      )}
                    </div>
                    {byokMasked.openrouterApiKey && (
                      <div className="text-[10px] font-mono text-purple-300 flex items-center justify-between">
                        <span>Current: <strong className="text-purple-300">{byokMasked.openrouterApiKey}</strong></span>
                      </div>
                    )}
                    <div className="relative">
                      <input
                        type={showKeys.openrouter ? 'text' : 'password'}
                        value={byokKeys.openrouterApiKey}
                        onChange={(e) => setByokKeys({ ...byokKeys, openrouterApiKey: e.target.value })}
                        placeholder={byokMasked.openrouterApiKey ? `${byokMasked.openrouterApiKey} (Leave blank to keep saved key)` : "sk-or-v1-... (leave blank to keep current)"}
                        className="w-full bg-slate-900 border border-purple-800/70 rounded-xl px-3 py-2 pr-9 text-xs text-white focus:outline-none focus:border-purple-400 font-mono"
                      />
                      <button
                        type="button"
                        onClick={() => setShowKeys({ ...showKeys, openrouter: !showKeys.openrouter })}
                        className="absolute right-2.5 top-2.5 text-slate-500 hover:text-slate-300"
                      >
                        {showKeys.openrouter ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                    <p className="text-[10px] text-purple-300/80">Powers ByteDance Seedream 4.5 for high-resolution featured & in-article imagery, plus OpenRouter text models.</p>
                  </div>

                  {/* Straico Key */}
                  <div className="bg-slate-950/70 border border-slate-800 p-3.5 rounded-xl space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-semibold text-slate-300">Straico API Key</label>
                      {byokConfigured.straico ? (
                        <div className="flex items-center gap-2">
                          <span className="inline-flex items-center gap-1 text-[10px] text-emerald-400 font-semibold bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-800/60">
                            <Check className="w-2.5 h-2.5" /> Saved & Active
                          </span>
                          <button
                            type="button"
                            onClick={() => handleClearKey('straicoApiKey')}
                            className="text-[10px] text-red-400 hover:text-red-300 underline font-medium"
                          >
                            Remove
                          </button>
                        </div>
                      ) : (
                        <span className="text-[10px] text-slate-500">Not configured</span>
                      )}
                    </div>
                    {byokMasked.straicoApiKey && (
                      <div className="text-[10px] font-mono text-slate-400 flex items-center justify-between">
                        <span>Current: <strong className="text-emerald-400">{byokMasked.straicoApiKey}</strong></span>
                      </div>
                    )}
                    <div className="relative">
                      <input
                        type={showKeys.straico ? 'text' : 'password'}
                        value={byokKeys.straicoApiKey}
                        onChange={(e) => setByokKeys({ ...byokKeys, straicoApiKey: e.target.value })}
                        placeholder={byokMasked.straicoApiKey ? `${byokMasked.straicoApiKey} (Leave blank to keep saved key)` : "straico_... (leave blank to keep current)"}
                        className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 pr-9 text-xs text-white focus:outline-none focus:border-emerald-500 font-mono"
                      />
                      <button
                        type="button"
                        onClick={() => setShowKeys({ ...showKeys, straico: !showKeys.straico })}
                        className="absolute right-2.5 top-2.5 text-slate-500 hover:text-slate-300"
                      >
                        {showKeys.straico ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                    <span className="text-[10px] text-slate-500 block">All-in-One multi-model gateway</span>
                  </div>

                  {/* Perplexity Key */}
                  <div className="bg-slate-950/70 border border-slate-800 p-3.5 rounded-xl space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-semibold text-slate-300">Perplexity API Key</label>
                      {byokConfigured.perplexity ? (
                        <div className="flex items-center gap-2">
                          <span className="inline-flex items-center gap-1 text-[10px] text-emerald-400 font-semibold bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-800/60">
                            <Check className="w-2.5 h-2.5" /> Saved & Active
                          </span>
                          <button
                            type="button"
                            onClick={() => handleClearKey('perplexityApiKey')}
                            className="text-[10px] text-red-400 hover:text-red-300 underline font-medium"
                          >
                            Remove
                          </button>
                        </div>
                      ) : (
                        <span className="text-[10px] text-slate-500">Not configured</span>
                      )}
                    </div>
                    {byokMasked.perplexityApiKey && (
                      <div className="text-[10px] font-mono text-slate-400 flex items-center justify-between">
                        <span>Current: <strong className="text-emerald-400">{byokMasked.perplexityApiKey}</strong></span>
                      </div>
                    )}
                    <div className="relative">
                      <input
                        type={showKeys.perplexity ? 'text' : 'password'}
                        value={byokKeys.perplexityApiKey}
                        onChange={(e) => setByokKeys({ ...byokKeys, perplexityApiKey: e.target.value })}
                        placeholder={byokMasked.perplexityApiKey ? `${byokMasked.perplexityApiKey} (Leave blank to keep saved key)` : "pplx-... (leave blank to keep current)"}
                        className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 pr-9 text-xs text-white focus:outline-none focus:border-emerald-500 font-mono"
                      />
                      <button
                        type="button"
                        onClick={() => setShowKeys({ ...showKeys, perplexity: !showKeys.perplexity })}
                        className="absolute right-2.5 top-2.5 text-slate-500 hover:text-slate-300"
                      >
                        {showKeys.perplexity ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                    <span className="text-[10px] text-slate-500 block">Live web research and citation queries</span>
                  </div>
                </div>
              </div>

              {/* PRIMARY IMAGE GENERATOR: SEEDREAM 4.5 */}
                <div className="mt-5 p-5 rounded-2xl bg-gradient-to-b from-slate-900/90 to-slate-950 border border-purple-800/40 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl bg-purple-950/80 border border-purple-700/60 flex items-center justify-center text-purple-300">
                        <Camera className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-sm font-bold text-white">Primary Image Generator</h3>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-950 border border-purple-800 text-purple-300">
                            ByteDance Seedream 4.5
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 mt-0.5">
                          Model ID: <code className="text-purple-300 font-mono">bytedance-seed/seedream-4.5</code> via OpenRouter Images API
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {byokKeys.openrouterApiKey ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-950/80 text-emerald-300 border border-emerald-800/80">
                          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                          OpenRouter Key Active
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-950/80 text-amber-300 border border-amber-800/80">
                          <span className="w-2 h-2 rounded-full bg-amber-400" />
                          Fallback Engine Active
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Capabilities Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
                    <div className="bg-slate-950/80 border border-slate-800/80 p-3 rounded-xl space-y-1">
                      <span className="text-slate-500 text-[10px] uppercase font-bold tracking-wider">Resolution</span>
                      <p className="font-semibold text-slate-200">2K High Definition</p>
                      <p className="text-[10px] text-slate-400">Pristine commercial-grade clarity & textures</p>
                    </div>

                    <div className="bg-slate-950/80 border border-slate-800/80 p-3 rounded-xl space-y-1">
                      <span className="text-slate-500 text-[10px] uppercase font-bold tracking-wider">H2 & H3 Matching</span>
                      <p className="font-semibold text-slate-200">Intent-Driven</p>
                      <p className="text-[10px] text-slate-400">Illustrates every core section with relevant context</p>
                    </div>

                    <div className="bg-slate-950/80 border border-slate-800/80 p-3 rounded-xl space-y-1">
                      <span className="text-slate-500 text-[10px] uppercase font-bold tracking-wider">Ratios Supported</span>
                      <p className="font-semibold text-slate-200">16:9, 4:3, 9:16, 1:1</p>
                      <p className="text-[10px] text-slate-400">Hero, section, and Pinterest pin dimensions</p>
                    </div>

                    <div className="bg-slate-950/80 border border-slate-800/80 p-3 rounded-xl space-y-1">
                      <span className="text-slate-500 text-[10px] uppercase font-bold tracking-wider">SEO Compliance</span>
                      <p className="font-semibold text-slate-200">Rule 23 ALT Text</p>
                      <p className="text-[10px] text-slate-400">Descriptive, accessible, no keyword stuffing</p>
                    </div>
                  </div>

                  {/* Test Generator Action */}
                  <div className="pt-2 border-t border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <p className="text-xs text-slate-400">
                      Verify your connection and test Seedream 4.5 visual synthesis right now:
                    </p>
                    <button
                      type="button"
                      onClick={handleTestSeedream}
                      disabled={testSeedreamLoading}
                      className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-semibold transition-colors disabled:opacity-50 flex items-center justify-center gap-2 shadow-sm"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${testSeedreamLoading ? 'animate-spin' : ''}`} />
                      <span>{testSeedreamLoading ? 'Generating with Seedream 4.5...' : 'Test Seedream 4.5 Generation'}</span>
                    </button>
                  </div>

                  {/* Test Result Display */}
                  {testSeedreamResult && (
                    <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {testSeedreamResult.success ? (
                            <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                              Visual Successfully Generated
                            </span>
                          ) : (
                            <span className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                              <AlertTriangle className="w-4 h-4 text-amber-400" />
                              Notice
                            </span>
                          )}
                          {testSeedreamResult.durationMs && (
                            <span className="text-[10px] text-slate-400 font-mono">
                              ({(testSeedreamResult.durationMs / 1000).toFixed(2)}s)
                            </span>
                          )}
                        </div>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 text-purple-300 border border-purple-800/60">
                          {testSeedreamResult.isDirectOpenRouter ? 'Seedream 4.5 Direct (OpenRouter)' : 'Fallback Visual Mode'}
                        </span>
                      </div>

                      {testSeedreamResult.image && (
                        <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
                          <div className="sm:col-span-4 rounded-lg overflow-hidden border border-slate-800 bg-slate-900 aspect-video">
                            <img
                              src={testSeedreamResult.image.url}
                              alt={testSeedreamResult.image.altText || 'Seedream 4.5 Test'}
                              className="w-full h-full object-cover"
                              referrerPolicy="no-referrer"
                            />
                          </div>
                          <div className="sm:col-span-8 space-y-1.5 text-xs">
                            <div>
                              <span className="text-slate-500 font-medium">Prompt:</span>{' '}
                              <span className="text-slate-300">{testSeedreamResult.image.prompt}</span>
                            </div>
                            <div>
                              <span className="text-slate-500 font-medium">ALT Text:</span>{' '}
                              <span className="text-slate-300">{testSeedreamResult.image.altText}</span>
                            </div>
                            <div>
                              <span className="text-slate-500 font-medium">Resolution:</span>{' '}
                              <span className="text-emerald-400 font-semibold">2K / {testSeedreamResult.image.aspectRatio}</span>
                            </div>
                          </div>
                        </div>
                      )}

                      {testSeedreamResult.error && (
                        <p className="text-xs text-red-400 font-mono bg-red-950/40 p-2 rounded border border-red-900/50">
                          {testSeedreamResult.error}
                        </p>
                      )}
                    </div>
                  )}
                </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  disabled={isSavingByok}
                  className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold text-xs transition-colors disabled:opacity-50 flex items-center gap-2"
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span>{isSavingByok ? 'Saving...' : 'Save Keys & Engine Configuration'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* TAB 2: BRAND VOICE & GEO */}
      {activeTab === 'voices' && (
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-5">
              <div>
                <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <Volume2 className="w-4 h-4 text-emerald-400" />
                  Brand Voice & Generative Engine Optimization (GEO)
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Ensure every generated article reflects your unique perspective, avoids generic AI clichés, and answers queries directly to get cited by AI search engines.
                </p>
              </div>
              <button
                onClick={() => setEditingVoice({
                  name: '',
                  description: '',
                  tone: 'authoritative',
                  pointOfView: 'third_person',
                  readingGradeLevel: 'college',
                  forbiddenPhrases: ['In today\'s fast-paced world', 'delve into', 'game changer'],
                  requiredPhrases: [],
                  sentenceStyle: 'balanced',
                  customSystemInstructions: 'Give direct, factual answers in the first two sentences so search engines and Perplexity can quote this article.',
                  isDefault: false
                })}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 text-xs font-bold"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Create Brand Voice</span>
              </button>
            </div>

            {/* Voices Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {brandVoices.map(voice => {
                const isActive = activeVoiceId === voice.id;
                return (
                  <div
                    key={voice.id}
                    className={`p-4 rounded-xl border space-y-3 transition-all ${
                      isActive
                        ? 'bg-emerald-950/20 border-emerald-500/60'
                        : 'bg-slate-950/70 border-slate-800'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-sm font-bold text-white">{voice.name}</h3>
                          {isActive && (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                              Active
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-400 mt-0.5">{voice.description}</p>
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => setEditingVoice(voice)}
                          className="px-2 py-1 rounded text-[11px] font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300"
                        >
                          Edit
                        </button>
                        {!voice.isDefault && (
                          <button
                            onClick={() => handleDeleteVoice(voice.id)}
                            className="p-1 rounded text-red-400 hover:bg-red-950/40"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-2 text-[11px] bg-slate-900/60 p-2.5 rounded-lg border border-slate-800/80">
                      <div>
                        <span className="text-slate-500 block">Perspective:</span>
                        <span className="text-slate-300 font-semibold">{voice.pointOfView.replace('_', ' ')}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block">Grade Level:</span>
                        <span className="text-slate-300 font-semibold uppercase">{voice.readingGradeLevel}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block">Sentence Style:</span>
                        <span className="text-slate-300 font-semibold">{voice.sentenceStyle}</span>
                      </div>
                    </div>

                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-1">
                        Forbidden AI Clichés ({voice.forbiddenPhrases.length}):
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {voice.forbiddenPhrases.slice(0, 4).map((p, i) => (
                          <span key={i} className="text-[10px] px-2 py-0.5 rounded bg-red-950/30 border border-red-900/40 text-red-300">
                            "{p}"
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Voice Editor Modal */}
          {editingVoice && (
            <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
              <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                    {editingVoice.id ? 'Edit Brand Voice' : 'New Brand Voice'}
                  </h3>
                  <button onClick={() => setEditingVoice(null)} className="text-slate-400 hover:text-white">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Voice Profile Name</label>
                    <input
                      type="text"
                      value={editingVoice.name || ''}
                      onChange={(e) => setEditingVoice({ ...editingVoice, name: e.target.value })}
                      placeholder="e.g. Senior Tech Authority, Friendly Chef, Executive Brief"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Description</label>
                    <input
                      type="text"
                      value={editingVoice.description || ''}
                      onChange={(e) => setEditingVoice({ ...editingVoice, description: e.target.value })}
                      placeholder="Target audience and goal of this persona"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Point of View</label>
                      <select
                        value={editingVoice.pointOfView || 'third_person'}
                        onChange={(e) => setEditingVoice({ ...editingVoice, pointOfView: e.target.value as any })}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                      >
                        <option value="first_person_singular">First Person ("I tested...")</option>
                        <option value="first_person_plural">First Person Plural ("We evaluated...")</option>
                        <option value="second_person">Second Person ("When you configure...")</option>
                        <option value="third_person">Third Person ("Engineers and practitioners...")</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Reading Grade Level</label>
                      <select
                        value={editingVoice.readingGradeLevel || 'college'}
                        onChange={(e) => setEditingVoice({ ...editingVoice, readingGradeLevel: e.target.value as any })}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                      >
                        <option value="middle_school">Middle School (6th - 8th grade, ultra-accessible)</option>
                        <option value="high_school">High School (9th - 12th grade, general web audience)</option>
                        <option value="college">College / Professional (Technical precision)</option>
                        <option value="postgrad">Postgraduate / Academic</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Forbidden Phrases (Comma-separated)</label>
                    <input
                      type="text"
                      value={(editingVoice.forbiddenPhrases || []).join(', ')}
                      onChange={(e) => setEditingVoice({
                        ...editingVoice,
                        forbiddenPhrases: e.target.value.split(',').map(s => s.trim()).filter(Boolean)
                      })}
                      placeholder="e.g. in today's fast-paced world, delve into, look no further"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Custom Voice System Prompt (GEO & Citations Guidance)
                    </label>
                    <textarea
                      rows={3}
                      value={editingVoice.customSystemInstructions || ''}
                      onChange={(e) => setEditingVoice({ ...editingVoice, customSystemInstructions: e.target.value })}
                      placeholder="Instructions for direct factual answers, tone nuances, or specific formatting quirks."
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 font-mono"
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="isDef"
                      checked={Boolean(editingVoice.isDefault)}
                      onChange={(e) => setEditingVoice({ ...editingVoice, isDefault: e.target.checked })}
                      className="rounded border-slate-700 text-emerald-500 focus:ring-emerald-500 bg-slate-950"
                    />
                    <label htmlFor="isDef" className="text-xs text-slate-300">Set as active default voice</label>
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
                  <button
                    type="button"
                    onClick={() => setEditingVoice(null)}
                    className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleSaveBrandVoice}
                    disabled={isSavingVoice}
                    className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-slate-950 text-xs font-bold transition-colors disabled:opacity-50"
                  >
                    {isSavingVoice ? 'Saving...' : 'Save Voice Profile'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: SITEMAP & TOPICAL INTERNAL LINKING */}
      {activeTab === 'sitemap' && (
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
            <div className="border-b border-slate-800 pb-4">
              <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Globe className="w-4 h-4 text-emerald-400" />
                Sitemap Indexer & Contextual Internal Linking
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Establish topical authority by automatically injecting relevant internal links into newly generated articles based on your website's indexed sitemap.
              </p>
            </div>

            {/* Sitemap Input */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-slate-300 mb-1">Your Website Sitemap URL</label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    value={sitemapInputUrl}
                    onChange={(e) => setSitemapInputUrl(e.target.value)}
                    placeholder="https://yourwebsite.com/sitemap.xml or /sitemap_index.xml"
                    className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                  <button
                    type="button"
                    onClick={handleFetchSitemap}
                    disabled={isFetchingSitemap || !sitemapInputUrl}
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-slate-950 text-xs font-bold transition-colors disabled:opacity-50 flex items-center gap-1.5"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isFetchingSitemap ? 'animate-spin' : ''}`} />
                    <span>{isFetchingSitemap ? 'Indexing...' : 'Fetch & Index'}</span>
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Max Internal Links Per Article</label>
                <input
                  type="number"
                  min={1}
                  max={10}
                  value={sitemapConfig?.maxLinksPerArticle || sitemapConfig?.maxInternalLinksPerArticle || 4}
                  onChange={(e) => setSitemapConfig(prev => prev ? { ...prev, maxLinksPerArticle: parseInt(e.target.value) || 4 } : null)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            {sitemapMessage && (
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300">
                {sitemapMessage}
              </div>
            )}

            {/* Indexed URLs Table */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
                  Indexed Site Pages ({sitemapConfig?.entries?.length || 0})
                </span>
                <span className="text-[11px] text-slate-500">
                  Last indexed: {sitemapConfig?.lastFetched ? new Date(sitemapConfig.lastFetched).toLocaleDateString() : 'Never'}
                </span>
              </div>

              <div className="border border-slate-800 rounded-xl overflow-hidden max-h-72 overflow-y-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-950 text-slate-400 border-b border-slate-800 sticky top-0">
                    <tr>
                      <th className="p-2.5 font-semibold">Title / Topic</th>
                      <th className="p-2.5 font-semibold">URL Path</th>
                      <th className="p-2.5 font-semibold">Keywords</th>
                      <th className="p-2.5 font-semibold text-right">Priority</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 bg-slate-950/40">
                    {(sitemapConfig?.entries || []).map((entry, idx) => (
                      <tr key={entry.id || entry.slug || idx} className="hover:bg-slate-900/60">
                        <td className="p-2.5 font-medium text-slate-200">{entry.title}</td>
                        <td className="p-2.5 font-mono text-[11px] text-slate-400 truncate max-w-xs">{entry.url}</td>
                        <td className="p-2.5">
                          <div className="flex flex-wrap gap-1">
                            {(entry.topicKeywords || entry.targetKeywords || []).slice(0, 3).map((kw, i) => (
                              <span key={i} className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">
                                {kw}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="p-2.5 text-right font-mono text-emerald-400">{entry.priority?.toFixed(1) || '0.8'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: BLOGGING AUTOMATION */}
      {activeTab === 'automation' && (
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <Clock className="w-4 h-4 text-emerald-400" />
                  Autonomous Blogging Schedule
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Run scheduled content pipelines that pick upcoming topics from your Content Calendar, synthesize research, create intent-matched visuals, inject internal links, and prepare drafts.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={handleTriggerAutomation}
                  disabled={isTriggeringAuto}
                  className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-slate-950 text-xs font-bold transition-colors disabled:opacity-50 flex items-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{isTriggeringAuto ? 'Processing...' : 'Run Pipeline Now'}</span>
                </button>
              </div>
            </div>

            {autoTriggerMsg && (
              <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-800/60 text-emerald-300 text-xs">
                {autoTriggerMsg}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Settings Controls */}
              <div className="space-y-4 bg-slate-950/70 p-4 rounded-xl border border-slate-800">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-200">Enable Automated Content Engine</span>
                  <input
                    type="checkbox"
                    checked={Boolean(automationConfig?.enabled)}
                    onChange={(e) => handleToggleAutomation(e.target.checked)}
                    className="w-4 h-4 rounded text-emerald-500 bg-slate-900 border-slate-700"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Publishing Cadence</label>
                  <select
                    value={automationConfig?.publishingCadence || 'daily'}
                    onChange={(e) => {
                      const val = e.target.value as any;
                      setAutomationConfig(prev => prev ? { ...prev, publishingCadence: val } : null);
                      api.saveAutomations({ publishingCadence: val });
                    }}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="hourly">Hourly (Aggressive Publishing)</option>
                    <option value="daily">Daily (Recommended for Topical Authority)</option>
                    <option value="3_per_week">3 Times Per Week (Steady Cadence)</option>
                    <option value="weekly">Weekly</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Default Post Status</label>
                  <select
                    value={automationConfig?.defaultStatus || 'draft'}
                    onChange={(e) => {
                      const val = e.target.value as any;
                      setAutomationConfig(prev => prev ? { ...prev, defaultStatus: val } : null);
                      api.saveAutomations({ defaultStatus: val });
                    }}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="draft">Draft (Requires Human Review Before Publish)</option>
                    <option value="publish">Publish (Direct Live Publish)</option>
                  </select>
                </div>

                <div className="space-y-2 pt-2 border-t border-slate-800">
                  <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={automationConfig?.autoGenerateImages ?? true}
                      onChange={(e) => {
                        const val = e.target.checked;
                        setAutomationConfig(prev => prev ? { ...prev, autoGenerateImages: val, generateIntentImages: val } : null);
                        api.saveAutomations({ autoGenerateImages: val });
                      }}
                      className="rounded text-emerald-500 bg-slate-900 border-slate-700"
                    />
                    <span>Automatically generate intent-matched featured & in-article images</span>
                  </label>

                  <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={automationConfig?.enforceInternalLinking ?? true}
                      onChange={(e) => {
                        const val = e.target.checked;
                        setAutomationConfig(prev => prev ? { ...prev, enforceInternalLinking: val } : null);
                        api.saveAutomations({ enforceInternalLinking: val });
                      }}
                      className="rounded text-emerald-500 bg-slate-900 border-slate-700"
                    />
                    <span>Automatically inject contextual internal links from sitemap</span>
                  </label>
                </div>
              </div>

              {/* Automation Activity Log */}
              <div className="space-y-3 bg-slate-950/70 p-4 rounded-xl border border-slate-800">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                  Recent Automation Activity
                </h3>

                <div className="space-y-2 max-h-56 overflow-y-auto">
                  {(automationConfig?.recentAutomationLogs || []).map(log => (
                    <div key={log.id} className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800/80 text-xs space-y-1">
                      <div className="flex items-center justify-between font-semibold">
                        <span className="text-slate-200">{log.action}: {log.articleTitle}</span>
                        <span className="text-[10px] text-emerald-400 font-mono">{log.status}</span>
                      </div>
                      <p className="text-[11px] text-slate-400">{log.details}</p>
                      <span className="text-[10px] text-slate-500">{new Date(log.timestamp).toLocaleTimeString()}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: WORDPRESS & SOCIAL */}
      {activeTab === 'wordpress' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* WordPress Configuration */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <Database className="w-4 h-4 text-emerald-400" />
                  WordPress REST Bridge
                </h2>
                <button
                  type="button"
                  onClick={handleTestWordPress}
                  disabled={isTestingWp}
                  className="px-2.5 py-1 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 text-xs font-semibold transition-colors disabled:opacity-50"
                >
                  {isTestingWp ? 'Testing...' : 'Test Connection'}
                </button>
              </div>

              {wpTestResult && (
                <div className={`p-3 rounded-xl text-xs ${
                  wpTestResult.success
                    ? 'bg-emerald-950/40 border border-emerald-800/60 text-emerald-300'
                    : 'bg-red-950/40 border border-red-800/60 text-red-300'
                }`}>
                  <strong>{wpTestResult.success ? 'Success:' : 'Notice:'}</strong> {wpTestResult.message}
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1">
                  WordPress Site REST API URL
                </label>
                <input
                  type="url"
                  value={wpEndpoint}
                  onChange={(e) => setWpEndpoint(e.target.value)}
                  placeholder="https://yourblog.com/wp-json/wp/v2"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1">
                    WP Username
                  </label>
                  <input
                    type="text"
                    value={wpUser}
                    onChange={(e) => setWpUser(e.target.value)}
                    placeholder="admin"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1">
                    Application Password
                  </label>
                  <input
                    type="password"
                    value={wpAppPassword}
                    onChange={(e) => setWpAppPassword(e.target.value)}
                    placeholder="•••• •••• •••• •••• (leave blank to keep saved password)"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 font-mono"
                  />
                </div>
              </div>

              <div className="pt-2">
                <a
                  href="/api/wordpress/download-plugin"
                  download="wp-aiseo-content-studio.php"
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Companion WordPress PHP Bridge Plugin</span>
                </a>
              </div>
            </div>

            {/* Social Channels Configuration */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
              <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2 border-b border-slate-800 pb-3">
                <Layers className="w-4 h-4 text-emerald-400" />
                Multi-Channel Social Channels
              </h2>

              {/* Facebook */}
              <div className="space-y-2 pt-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-200">Facebook Pages API</span>
                  <button
                    type="button"
                    onClick={handleTestFacebook}
                    disabled={isTestingFb}
                    className="text-[11px] text-blue-400 hover:text-blue-300 font-semibold"
                  >
                    {isTestingFb ? 'Testing...' : 'Test Facebook'}
                  </button>
                </div>
                {fbTestResult && (
                  <div className={`p-2 rounded text-[11px] ${fbTestResult.success ? 'text-emerald-400' : 'text-red-400'}`}>
                    {fbTestResult.message}
                  </div>
                )}
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    value={facebookPageId}
                    onChange={(e) => setFacebookPageId(e.target.value)}
                    placeholder="Facebook Page ID"
                    className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white"
                  />
                  <input
                    type="password"
                    value={facebookToken}
                    onChange={(e) => setFacebookToken(e.target.value)}
                    placeholder="Page Access Token (leave blank to keep current)"
                    className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white"
                  />
                </div>
              </div>

              {/* Instagram */}
              <div className="space-y-2 pt-3 border-t border-slate-800">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-200">Instagram Graph API</span>
                  <button
                    type="button"
                    onClick={handleTestInstagram}
                    disabled={isTestingIg}
                    className="text-[11px] text-fuchsia-400 hover:text-fuchsia-300 font-semibold"
                  >
                    {isTestingIg ? 'Testing...' : 'Test Instagram'}
                  </button>
                </div>
                {igTestResult && (
                  <div className={`p-2 rounded text-[11px] ${igTestResult.success ? 'text-emerald-400' : 'text-red-400'}`}>
                    {igTestResult.message}
                  </div>
                )}
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    value={instagramAccountId}
                    onChange={(e) => setInstagramAccountId(e.target.value)}
                    placeholder="Instagram Account ID"
                    className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white"
                  />
                  <input
                    type="password"
                    value={instagramToken}
                    onChange={(e) => setInstagramToken(e.target.value)}
                    placeholder="Access Token (leave blank to keep current)"
                    className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white"
                  />
                </div>
              </div>

              {/* Save WordPress & Social Credentials Action */}
              <div className="pt-4 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div>
                  {wpSocialSaveMessage && (
                    <div className={`text-xs flex items-center gap-1.5 ${wpSocialSaveMessage.success ? 'text-emerald-400 font-semibold' : 'text-red-400'}`}>
                      {wpSocialSaveMessage.success ? <CheckCircle2 className="w-3.5 h-3.5" /> : <AlertTriangle className="w-3.5 h-3.5" />}
                      <span>{wpSocialSaveMessage.text}</span>
                    </div>
                  )}
                  {!wpSocialSaveMessage && (
                    <span className="text-xs text-slate-400">
                      Credentials are encrypted and persisted to local server storage.
                    </span>
                  )}
                </div>

                <button
                  type="button"
                  onClick={handleSaveWordPressAndSocial}
                  disabled={isSavingWpSocial}
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold text-xs transition-colors disabled:opacity-50 flex items-center gap-2"
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span>{isSavingWpSocial ? 'Saving...' : 'Save WordPress & Social Bridge Settings'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 6: QA CHECKLIST */}
      {activeTab === 'qa' && (
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  System Architectural Verification Checklist
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Executes 12+ real verification tests across Prompt Injection Defense, SSRF Loopback Protection, BYOK Multi-Model engines, and WordPress schema integrity.
                </p>
              </div>

              <button
                onClick={handleRunQASuite}
                disabled={isRunningQA}
                className="px-4 py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-xs font-bold"
              >
                {isRunningQA ? 'Running QA Tests...' : 'Run QA Suite Now'}
              </button>
            </div>

            {qaResults ? (
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-xs font-semibold text-slate-300">Overall Suite Result</span>
                  <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                    qaResults.status === 'PASS'
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                      : 'bg-red-500/20 text-red-300 border border-red-500/40'
                  }`}>
                    {qaResults.passed}/{qaResults.total} TESTS PASSED ({qaResults.status})
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {qaResults.tests.map((t, idx) => (
                    <div key={idx} className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 text-xs space-y-1">
                      <div className="flex items-center justify-between font-semibold">
                        <span className="text-slate-200">{t.name}</span>
                        <span className={`text-[10px] font-bold uppercase px-1.5 py-0.5 rounded ${
                          t.passed ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'
                        }`}>
                          {t.passed ? 'PASS' : 'FAIL'}
                        </span>
                      </div>
                      <p className="text-slate-400 text-[11px]">{t.details}</p>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-slate-500 text-xs">
                Click "Run QA Suite Now" to verify the entire system.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
