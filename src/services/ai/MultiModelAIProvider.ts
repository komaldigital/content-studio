/**
 * MultiModelAIProvider
 * Supports Gemini, OpenAI (GPT-4), Anthropic (Claude), OpenRouter, and Straico.
 * Implements Bring-Your-Own-API-Key (BYOK) architecture with predictable costs and resilient fallbacks.
 */

import { GoogleGenAI } from '@google/genai';
import { AIProviderInterface, AIGenerateOptions } from './AIProviderInterface.js';
import { ByokKeys } from '../../types.js';

export interface ModelMetadata {
  id: string;
  name: string;
  provider: 'google' | 'openai' | 'anthropic' | 'openrouter' | 'straico';
  contextWindow: string;
  costPer1kWords: string;
  bestFor: string;
  description?: string;
}

export const AVAILABLE_MODELS: ModelMetadata[] = [
  {
    id: 'gemini-3.1-flash-lite',
    name: 'Gemini 3.1 Flash Lite (Google)',
    provider: 'google',
    contextWindow: '1M tokens',
    costPer1kWords: '$0.00015',
    bestFor: 'Ultra-fast production, highest throughput, resilient low latency'
  },
  {
    id: 'gemini-2.5-flash',
    name: 'Gemini 2.5 Flash (Google)',
    provider: 'google',
    contextWindow: '1M tokens',
    costPer1kWords: '$0.0002',
    bestFor: 'High-speed factual generation with established quotas'
  },
  {
    id: 'gemini-3.8-flash',
    name: 'Gemini 3.8 Flash (Google)',
    provider: 'google',
    contextWindow: '1M tokens',
    costPer1kWords: '$0.0003',
    bestFor: 'Next-gen live search grounding and multimodal research'
  },
  {
    id: 'gemini-3.1-pro-preview',
    name: 'Gemini 3.1 Pro (Google)',
    provider: 'google',
    contextWindow: '2M tokens',
    costPer1kWords: '$0.0025',
    bestFor: 'Deep long-form research, ultimate guides, complex topical reasoning'
  },
  {
    id: 'gpt-4o',
    name: 'GPT-4o Omni (OpenAI)',
    provider: 'openai',
    contextWindow: '128K tokens',
    costPer1kWords: '$0.0050',
    bestFor: 'Crisp editorial style, authoritative B2B copy, high conversion rate'
  },
  {
    id: 'gpt-4o-mini',
    name: 'GPT-4o Mini (OpenAI)',
    provider: 'openai',
    contextWindow: '128K tokens',
    costPer1kWords: '$0.0003',
    bestFor: 'Budget-friendly writing with strong instruction adherence'
  },
  {
    id: 'claude-3-5-sonnet',
    name: 'Claude 3.5 Sonnet (Anthropic)',
    provider: 'anthropic',
    contextWindow: '200K tokens',
    costPer1kWords: '$0.0060',
    bestFor: 'Most natural human prose, nuanced storytelling, zero detectable AI cliches'
  },
  {
    id: 'claude-3-5-haiku',
    name: 'Claude 3.5 Haiku (Anthropic)',
    provider: 'anthropic',
    contextWindow: '200K tokens',
    costPer1kWords: '$0.0016',
    bestFor: 'Rapid section refinement, FAQs, and instant social copy'
  },
  {
    id: 'openrouter/anthropic/claude-sonnet-5',
    name: 'Claude Sonnet 5 via OpenRouter',
    provider: 'openrouter',
    contextWindow: '1M tokens',
    costPer1kWords: '$0.0030',
    description: 'Anthropic 5th-generation flagship with adaptive thinking, 1M context, and zero-cliché human prose.',
    bestFor: 'Anthropic 5th-gen flagship: deep adaptive thinking, 1M context, and zero-cliché human prose'
  },
  {
    id: 'openrouter/anthropic/claude-opus-5',
    name: 'Claude Opus 5 via OpenRouter',
    provider: 'openrouter',
    contextWindow: '1M tokens',
    costPer1kWords: '$0.0150',
    description: 'Anthropic supreme intelligence tier for complex multi-step reasoning, novel synthesis, and academic rigor.',
    bestFor: 'Anthropic supreme intelligence: deep reasoning, complex synthesis, and academic-grade prose'
  },
  {
    id: 'openrouter/anthropic/claude-sonnet-4.6',
    name: 'Claude Sonnet 4.6 via OpenRouter',
    provider: 'openrouter',
    contextWindow: '1M tokens',
    costPer1kWords: '$0.0030',
    description: 'Advanced Sonnet-class model with 1M context, 128K output capacity, and exceptional structural planning.',
    bestFor: 'Anthropic Sonnet 4.6: iterative development, technical guides, and 128K output capacity'
  },
  {
    id: 'openrouter/anthropic/claude-sonnet-4.5',
    name: 'Claude Sonnet 4.5 via OpenRouter',
    provider: 'openrouter',
    contextWindow: '1M tokens',
    costPer1kWords: '$0.0030',
    description: 'Anthropic model optimized for real-world agents, technical accuracy, and adherence to strict specifications.',
    bestFor: 'Agentic workflows, rigorous specifications, and clean structured articles'
  },
  {
    id: 'openrouter/anthropic/claude-3.7-sonnet',
    name: 'Claude 3.7 Sonnet via OpenRouter',
    provider: 'openrouter',
    contextWindow: '200K tokens',
    costPer1kWords: '$0.0060',
    bestFor: 'Anthropic flagship: hybrid reasoning & creative prose with zero clichés'
  },
  {
    id: 'openrouter/deepseek/deepseek-r1',
    name: 'DeepSeek R1 via OpenRouter',
    provider: 'openrouter',
    contextWindow: '64K tokens',
    costPer1kWords: '$0.0012',
    bestFor: 'Open-weights reasoning champion, logical structure, comparison tables'
  },
  {
    id: 'openrouter/deepseek/deepseek-chat',
    name: 'DeepSeek V3 via OpenRouter',
    provider: 'openrouter',
    contextWindow: '64K tokens',
    costPer1kWords: '$0.0004',
    bestFor: 'State-of-the-art 671B MoE model: fast, ultra low-cost, comprehensive writing'
  },
  {
    id: 'openrouter/openai/o3-mini',
    name: 'OpenAI o3-mini via OpenRouter',
    provider: 'openrouter',
    contextWindow: '128K tokens',
    costPer1kWords: '$0.0011',
    bestFor: 'High-speed STEM reasoning, structured schemas, deep factual queries'
  },
  {
    id: 'openrouter/openai/gpt-4o',
    name: 'GPT-4o Omni via OpenRouter',
    provider: 'openrouter',
    contextWindow: '128K tokens',
    costPer1kWords: '$0.0050',
    bestFor: 'Pay-as-you-go GPT-4o with strong commercial intent and high readability'
  },
  {
    id: 'openrouter/anthropic/claude-3.5-sonnet',
    name: 'Claude 3.5 Sonnet via OpenRouter',
    provider: 'openrouter',
    contextWindow: '200K tokens',
    costPer1kWords: '$0.0060',
    bestFor: 'Pay-as-you-go access without individual enterprise contracts'
  },
  {
    id: 'openrouter/meta-llama/llama-3.3-70b-instruct',
    name: 'Llama 3.3 70B via OpenRouter',
    provider: 'openrouter',
    contextWindow: '128K tokens',
    costPer1kWords: '$0.0008',
    bestFor: 'Open-weights powerhouse, technical docs, and factual precision'
  },
  {
    id: 'openrouter/google/gemini-2.0-flash-001',
    name: 'Gemini 2.0 Flash via OpenRouter',
    provider: 'openrouter',
    contextWindow: '1M tokens',
    costPer1kWords: '$0.0002',
    bestFor: 'Next-gen lightning throughput, massive context window & schemas'
  },
  {
    id: 'openrouter/qwen/qwen-2.5-72b-instruct',
    name: 'Qwen 2.5 72B via OpenRouter',
    provider: 'openrouter',
    contextWindow: '128K tokens',
    costPer1kWords: '$0.0007',
    bestFor: 'Top multilingual benchmark, rich structured lists and detailed guides'
  },
  {
    id: 'straico/gpt-4o',
    name: 'GPT-4o via Straico',
    provider: 'straico',
    contextWindow: '128K tokens',
    costPer1kWords: '$0.0055',
    bestFor: 'Unified multi-LLM workspace API with centralized coin ledger'
  },
  {
    id: 'straico/claude-3-5-sonnet',
    name: 'Claude 3.5 Sonnet via Straico',
    provider: 'straico',
    contextWindow: '200K tokens',
    costPer1kWords: '$0.0065',
    bestFor: 'All-in-one API subscription for premium models'
  }
];

export class MultiModelAIProvider implements AIProviderInterface {
  public readonly providerName = 'Multi-Model Engine (Gemini / OpenAI / Claude / OpenRouter / Straico)';
  private geminiClient: GoogleGenAI | null = null;
  private currentModel: string;
  private byokKeys: ByokKeys;

  constructor(defaultModel = 'gemini-3.8-flash', byokKeys: ByokKeys = {}) {
    this.currentModel = defaultModel;
    this.byokKeys = {
      geminiApiKey: byokKeys.geminiApiKey || process.env.GEMINI_API_KEY || '',
      openaiApiKey: byokKeys.openaiApiKey || process.env.OPENAI_API_KEY || '',
      anthropicApiKey: byokKeys.anthropicApiKey || process.env.ANTHROPIC_API_KEY || '',
      openrouterApiKey: byokKeys.openrouterApiKey || process.env.OPENROUTER_API_KEY || '',
      straicoApiKey: byokKeys.straicoApiKey || process.env.STRAICO_API_KEY || '',
      perplexityApiKey: byokKeys.perplexityApiKey || process.env.PERPLEXITY_API_KEY || ''
    };

    if (this.byokKeys.geminiApiKey) {
      try {
        this.geminiClient = new GoogleGenAI({
          apiKey: this.byokKeys.geminiApiKey,
          httpOptions: { headers: { 'User-Agent': 'aistudio-build' } }
        });
      } catch (e) {
        console.warn('Failed to initialize GoogleGenAI client:', e);
      }
    }
  }

  public setByokKeys(keys: Partial<ByokKeys>): void {
    this.byokKeys = { ...this.byokKeys, ...keys };
    if (this.byokKeys.geminiApiKey) {
      this.geminiClient = new GoogleGenAI({
        apiKey: this.byokKeys.geminiApiKey,
        httpOptions: { headers: { 'User-Agent': 'aistudio-build' } }
      });
    }
  }

  public setModel(model: string): void {
    this.currentModel = model;
  }

  public getModel(): string {
    return this.currentModel;
  }

  public getByokKeys(): ByokKeys {
    return { ...this.byokKeys };
  }

  /**
   * Main text generation dispatcher
   */
  public async generate(prompt: string, options?: AIGenerateOptions): Promise<string> {
    const model = options?.model || this.currentModel;
    console.log(`[MultiModelAIProvider] Executing generation with requested model: ${model}`);

    try {
      if (model.startsWith('claude-')) {
        return await this.callAnthropic(prompt, model, options);
      } else if (model.startsWith('gpt-') || model.startsWith('o1') || model.startsWith('o3')) {
        return await this.callOpenAI(prompt, model, options);
      } else if (model.startsWith('openrouter/')) {
        const resolved = this.resolveOpenRouterModel(model);
        return await this.callOpenRouter(prompt, resolved, options);
      } else if (model.startsWith('straico/')) {
        return await this.callStraico(prompt, model.replace('straico/', ''), options);
      } else {
        // Default to Google Gemini
        return await this.callGemini(prompt, model, options);
      }
    } catch (err: any) {
      console.warn(`[MultiModelAIProvider] Primary model ${model} encountered error:`, err?.message || err);

      // Check if it's 429 quota exhaustion, 503 high demand, or transient rate limit
      const isQuotaOrDemandError = err?.message?.includes('429') ||
        err?.message?.includes('503') ||
        err?.message?.includes('RESOURCE_EXHAUSTED') ||
        err?.message?.includes('UNAVAILABLE') ||
        err?.message?.includes('high demand') ||
        err?.status === 429 ||
        err?.status === 503;

      if (isQuotaOrDemandError) {
        console.warn(`[MultiModelAIProvider] Quota or demand spike encountered on ${model}. Attempting cross-provider failover...`);

        // If user has an OpenAI key, failover to GPT-4o Mini
        if (this.byokKeys.openaiApiKey && !model.startsWith('gpt-')) {
          console.info(`[MultiModelAIProvider] Seamless failover to GPT-4o Mini using BYOK OpenAI Key...`);
          return await this.callOpenAI(prompt, 'gpt-4o-mini', options);
        }

        // If user has an OpenRouter key, failover to OpenRouter
        if (this.byokKeys.openrouterApiKey && !model.startsWith('openrouter/')) {
          console.info(`[MultiModelAIProvider] Seamless failover to OpenRouter...`);
          return await this.callOpenRouter(prompt, 'meta-llama/llama-3.3-70b-instruct', options);
        }

        // If Gemini model hit 503 or 429, try Gemini 3.1 Flash Lite
        if (this.byokKeys.geminiApiKey && model !== 'gemini-3.1-flash-lite') {
          console.info(`[MultiModelAIProvider] Seamless failover to Gemini 3.1 Flash Lite...`);
          return await this.callGemini(prompt, 'gemini-3.1-flash-lite', options);
        }
      }

      // Re-throw if no failover available
      throw err;
    }
  }

  /**
   * JSON generation dispatcher
   */
  public async generateJson<T = unknown>(prompt: string, schemaDesc?: string, options?: AIGenerateOptions): Promise<T> {
    const systemInst = (options?.systemInstruction || '') + '\nYou MUST respond ONLY with valid JSON. No markdown codeblock quotes (no ```json). Raw parsable JSON object only.';
    const enhancedOptions = {
      ...options,
      systemInstruction: systemInst,
      responseMimeType: 'application/json' as const
    };

    const text = await this.generate(prompt, enhancedOptions);
    try {
      // Clean potential code fences
      const cleaned = text.trim().replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/```\s*$/i, '').trim();
      return JSON.parse(cleaned) as T;
    } catch (e) {
      console.error('[MultiModelAIProvider] JSON parse failure on output:', text.slice(0, 300));
      throw new Error(`Failed to parse AI output as JSON: ${(e as Error).message}`);
    }
  }

  public async stream(prompt: string, onChunk: (chunk: string) => void, options?: AIGenerateOptions): Promise<string> {
    const full = await this.generate(prompt, options);
    // Simulate natural stream chunking for non-streaming providers
    const chunks = full.match(/.{1,80}/g) || [full];
    for (const chunk of chunks) {
      onChunk(chunk);
      await new Promise(r => setTimeout(r, 15));
    }
    return full;
  }

  public async analyze(content: string, instructions: string, options?: AIGenerateOptions): Promise<string> {
    const prompt = `${instructions}\n\nCONTENT TO ANALYZE:\n${content}`;
    return this.generate(prompt, options);
  }

  public async rewrite(content: string, instruction: string, options?: AIGenerateOptions): Promise<string> {
    const prompt = `Rewrite the following content strictly adhering to this instruction: ${instruction}\n\nORIGINAL CONTENT:\n${content}`;
    return this.generate(prompt, options);
  }

  /**
   * Test Connection for any model
   */
  public async testConnection(targetModel?: string, tempApiKey?: string): Promise<{ success: boolean; message: string; model: string; latencyMs?: number }> {
    const modelToTest = targetModel || this.currentModel;
    const start = Date.now();

    try {
      if (modelToTest.startsWith('gpt-')) {
        const key = tempApiKey || this.byokKeys.openaiApiKey;
        if (!key) return { success: false, message: 'OpenAI API key is not configured. Please enter your OpenAI key.', model: modelToTest };
        const res = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${key}` },
          body: JSON.stringify({ model: modelToTest, messages: [{ role: 'user', content: 'Ping' }], max_tokens: 5 })
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error?.message || `HTTP ${res.status}`);
        return { success: true, message: `Connected to OpenAI (${modelToTest}) successfully!`, model: modelToTest, latencyMs: Date.now() - start };
      }

      if (modelToTest.startsWith('claude-')) {
        const key = tempApiKey || this.byokKeys.anthropicApiKey;
        if (!key) return { success: false, message: 'Anthropic API key is not configured. Please enter your Claude key.', model: modelToTest };
        const res = await fetch('https://api.anthropic.com/v1/messages', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'x-api-key': key, 'anthropic-version': '2023-06-01' },
          body: JSON.stringify({ model: modelToTest, max_tokens: 5, messages: [{ role: 'user', content: 'Ping' }] })
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error?.message || `HTTP ${res.status}`);
        return { success: true, message: `Connected to Anthropic Claude (${modelToTest}) successfully!`, model: modelToTest, latencyMs: Date.now() - start };
      }

      if (modelToTest.startsWith('openrouter/')) {
        const rawKey = tempApiKey || this.byokKeys.openrouterApiKey;
        if (!rawKey) return { success: false, message: 'OpenRouter API key is not configured. Please enter your OpenRouter key.', model: modelToTest };
        const key = rawKey.trim().replace(/^["'`]|["'`]$/g, '').replace(/^Bearer\s+/i, '');
        const actualModel = this.resolveOpenRouterModel(modelToTest);
        const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${key}`,
            'HTTP-Referer': 'https://ai.studio/build',
            'X-Title': 'AI SEO Content Studio'
          },
          body: JSON.stringify({ model: actualModel, messages: [{ role: 'user', content: 'Ping' }], max_tokens: 5 })
        });
        const data = await res.json();
        if (!res.ok) {
          const rawErr = data.error?.message || `HTTP ${res.status}`;
          if (rawErr.toLowerCase().includes('user not found') || res.status === 401) {
            throw new Error(`OpenRouter returned 'User not found'. This API key is invalid, expired, or revoked. Please generate a new key at openrouter.ai/keys (format sk-or-v1-...).`);
          }
          throw new Error(rawErr);
        }
        return { success: true, message: `Connected to OpenRouter (${actualModel}) successfully!`, model: modelToTest, latencyMs: Date.now() - start };
      }

      if (modelToTest.startsWith('straico/')) {
        const key = tempApiKey || this.byokKeys.straicoApiKey;
        if (!key) return { success: false, message: 'Straico API key is not configured.', model: modelToTest };
        const actualModel = modelToTest.replace('straico/', '');
        const res = await fetch('https://api.straico.com/v1/prompt/completion', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${key}` },
          body: JSON.stringify({ models: [actualModel], message: 'Ping' })
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || `HTTP ${res.status}`);
        return { success: true, message: `Connected to Straico (${actualModel}) successfully!`, model: modelToTest, latencyMs: Date.now() - start };
      }

      // Test Gemini
      const geminiKey = tempApiKey || this.byokKeys.geminiApiKey;
      if (!geminiKey) return { success: false, message: 'Google Gemini API key is not configured.', model: modelToTest };
      const client = new GoogleGenAI({ apiKey: geminiKey });
      try {
        const resp = await client.models.generateContent({
          model: modelToTest,
          contents: 'Ping',
          config: { maxOutputTokens: 5 }
        });
        return { success: true, message: `Connected to Gemini (${modelToTest}) successfully!`, model: modelToTest, latencyMs: Date.now() - start };
      } catch (gemErr: any) {
        if (gemErr?.message?.includes('429') || gemErr?.message?.includes('RESOURCE_EXHAUSTED')) {
          return {
            success: false,
            message: `Free quota limit reached on ${modelToTest}. Configure an OpenRouter/OpenAI key in Settings & Bridge, or try another model.`,
            model: modelToTest,
            latencyMs: Date.now() - start
          };
        }
        throw gemErr;
      }

    } catch (e: any) {
      return { success: false, message: `Connection failed: ${e.message}`, model: modelToTest, latencyMs: Date.now() - start };
    }
  }

  // --- PRIVATE LLM CLIENT HANDLERS ---

  private async callGemini(prompt: string, model: string, options?: AIGenerateOptions): Promise<string> {
    if (!this.byokKeys.geminiApiKey) {
      throw new Error('Gemini API key is not configured. Please supply a key in BYOK Settings.');
    }
    const client = this.geminiClient || new GoogleGenAI({ apiKey: this.byokKeys.geminiApiKey });

    const config: Record<string, any> = {
      temperature: options?.temperature ?? 0.5,
      maxOutputTokens: options?.maxOutputTokens ?? 8192
    };

    if (options?.systemInstruction) {
      config.systemInstruction = options.systemInstruction;
    }
    if (options?.responseMimeType === 'application/json') {
      config.responseMimeType = 'application/json';
    } else if (options?.useGoogleSearchGrounding) {
      // Note: Gemini API does not allow combining tools with responseMimeType: 'application/json'
      config.tools = [{ googleSearch: {} }];
    }

    const requestedModel = model || 'gemini-3.1-flash-lite';
    const fallbackModels = [
      requestedModel,
      'gemini-3.1-flash-lite',
      'gemini-2.5-flash',
      'gemini-flash-latest',
      'gemini-3.8-flash'
    ].filter((m, i, arr) => arr.indexOf(m) === i);

    let lastError: any = null;
    const timeoutMs = (options?.maxOutputTokens && options.maxOutputTokens > 4000) ? 45000 : 20000;

    for (const modelCandidate of fallbackModels) {
      try {
        console.log(`[MultiModelAIProvider] Attempting generation with Gemini candidate: ${modelCandidate}`);
        const timeoutPromise = new Promise<null>((_, reject) =>
          setTimeout(() => reject(new Error(`Model ${modelCandidate} request timed out after ${timeoutMs / 1000}s`)), timeoutMs)
        );
        const callPromise = client.models.generateContent({
          model: modelCandidate,
          contents: prompt,
          config
        });
        const response: any = await Promise.race([callPromise, timeoutPromise]);
        if (response?.text) {
          return response.text;
        }
      } catch (err: any) {
        lastError = err;
        console.warn(`[MultiModelAIProvider] Gemini candidate ${modelCandidate} failed: ${err.message}. Trying next candidate if available...`);
      }
    }

    throw lastError || new Error(`All Gemini models failed for request.`);
  }

  private async callOpenAI(prompt: string, model: string, options?: AIGenerateOptions): Promise<string> {
    const key = this.byokKeys.openaiApiKey;
    if (!key) throw new Error('OpenAI API key is not configured. Please provide your OpenAI API key in BYOK Settings.');

    const messages: Array<{ role: string; content: string }> = [];
    if (options?.systemInstruction) {
      messages.push({ role: 'system', content: options.systemInstruction });
    }
    messages.push({ role: 'user', content: prompt });

    const payload: Record<string, any> = {
      model,
      messages,
      temperature: options?.temperature ?? 0.5,
      max_tokens: options?.maxOutputTokens ?? 4096
    };

    if (options?.responseMimeType === 'application/json') {
      payload.response_format = { type: 'json_object' };
    }

    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${key}`
      },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(60000)
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error?.message || `OpenAI request failed with status ${res.status}`);
    }

    return data.choices?.[0]?.message?.content || '';
  }

  private async callAnthropic(prompt: string, model: string, options?: AIGenerateOptions): Promise<string> {
    const key = this.byokKeys.anthropicApiKey;
    if (!key) throw new Error('Anthropic API key is not configured. Please provide your Anthropic key in BYOK Settings.');

    const payload: Record<string, any> = {
      model,
      max_tokens: options?.maxOutputTokens ?? 4096,
      temperature: options?.temperature ?? 0.5,
      messages: [{ role: 'user', content: prompt }]
    };

    if (options?.systemInstruction) {
      payload.system = options.systemInstruction;
    }

    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': key,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(60000)
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error?.message || `Anthropic request failed with status ${res.status}`);
    }

    return data.content?.[0]?.text || '';
  }

  public resolveOpenRouterModel(rawModel: string): string {
    const clean = rawModel.replace(/^openrouter\//, '').trim();
    const aliasMap: Record<string, string> = {
      'anthropic/claude-5-sonnet': 'anthropic/claude-sonnet-5',
      'claude-5-sonnet': 'anthropic/claude-sonnet-5',
      'claude-sonnet-5': 'anthropic/claude-sonnet-5',
      'anthropic/claude-5-opus': 'anthropic/claude-opus-5',
      'claude-5-opus': 'anthropic/claude-opus-5',
      'claude-opus-5': 'anthropic/claude-opus-5',
      'anthropic/claude-4.6-sonnet': 'anthropic/claude-sonnet-4.6',
      'claude-4.6-sonnet': 'anthropic/claude-sonnet-4.6',
      'claude-sonnet-4.6': 'anthropic/claude-sonnet-4.6',
      'anthropic/claude-4.5-sonnet': 'anthropic/claude-sonnet-4.5',
      'claude-4.5-sonnet': 'anthropic/claude-sonnet-4.5',
      'claude-sonnet-4.5': 'anthropic/claude-sonnet-4.5',
    };
    return aliasMap[clean] || clean;
  }

  private async callOpenRouter(prompt: string, model: string, options?: AIGenerateOptions): Promise<string> {
    const key = this.byokKeys.openrouterApiKey;
    if (!key) throw new Error('OpenRouter API key is not configured. Please enter your OpenRouter key in BYOK Settings.');

    const messages: Array<{ role: string; content: string }> = [];
    if (options?.systemInstruction) {
      messages.push({ role: 'system', content: options.systemInstruction });
    }
    messages.push({ role: 'user', content: prompt });

    const payload: Record<string, any> = {
      model,
      messages,
      temperature: options?.temperature ?? 0.5,
      max_tokens: options?.maxOutputTokens ?? 4096
    };

    const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${key}`,
        'HTTP-Referer': 'https://aiseo-studio.example.com',
        'X-Title': 'AI SEO Content Studio'
      },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(60000)
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error?.message || `OpenRouter request failed with status ${res.status}`);
    }

    const message = data.choices?.[0]?.message;
    let output = message?.content || message?.reasoning || '';

    // If response includes DeepSeek R1 <think> tags, remove them to present the final article cleanly
    if (output.includes('</think>')) {
      output = output.replace(/<think>[\s\S]*?<\/think>\s*/gi, '').trim();
    }

    return output || '';
  }

  private async callStraico(prompt: string, model: string, options?: AIGenerateOptions): Promise<string> {
    const key = this.byokKeys.straicoApiKey;
    if (!key) throw new Error('Straico API key is not configured. Please enter your Straico key in BYOK Settings.');

    const res = await fetch('https://api.straico.com/v1/prompt/completion', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${key}`
      },
      body: JSON.stringify({
        models: [model],
        message: prompt
      }),
      signal: AbortSignal.timeout(60000)
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || `Straico request failed with status ${res.status}`);
    }

    const completion = data.data?.completions?.[model]?.completion;
    return completion || JSON.stringify(data);
  }
}
