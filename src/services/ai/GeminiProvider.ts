/**
 * Gemini Provider
 * Implements AIProviderInterface using the modern @google/genai SDK.
 * Handles HTTP error codes (400, 401, 403, 408, 429, 500, 502, 503) gracefully.
 * Never exposes the API key to the client.
 */

import { GoogleGenAI } from '@google/genai';
import { AIProviderInterface, AIGenerateOptions } from './AIProviderInterface.js';

export class GeminiProvider implements AIProviderInterface {
  public readonly providerName = 'Google Gemini';
  private defaultModel = 'gemini-3.8-flash';
  private apiKey: string;
  private client: GoogleGenAI | null = null;

  constructor(apiKey?: string, defaultModel = 'gemini-3.8-flash') {
    this.apiKey = apiKey || process.env.GEMINI_API_KEY || '';
    this.defaultModel = defaultModel;
    if (this.apiKey) {
      this.client = new GoogleGenAI({
        apiKey: this.apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          },
        },
      });
    }
  }

  private getClient(): GoogleGenAI {
    const key = this.apiKey || process.env.GEMINI_API_KEY;
    if (!key) {
      throw new Error('Gemini API key is not configured. Please set GEMINI_API_KEY in the environment or Settings.');
    }
    if (!this.client || this.apiKey !== key) {
      this.apiKey = key;
      this.client = new GoogleGenAI({
        apiKey: this.apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          },
        },
      });
    }
    return this.client;
  }

  private isTransientError(err: unknown): boolean {
    const message = err instanceof Error ? err.message : String(err);
    return /\b(408|429|500|502|503|504)\b/i.test(message) ||
      /temporarily overloaded|high demand|try again later|unavailable|rate limit|quota exceeded|resource exhausted/i.test(message);
  }

  private handleGeminiError(err: unknown, context: string): Error {
    const message = err instanceof Error ? err.message : String(err);
    const statusMatch = message.match(/\b(400|401|403|408|429|500|502|503)\b/);
    const code = statusMatch ? parseInt(statusMatch[1], 10) : 0;

    let userFacingMessage = `Gemini API Error during ${context}: `;
    switch (code) {
      case 400:
        userFacingMessage += 'Bad Request. The prompt parameters or model configuration were invalid.';
        break;
      case 401:
        userFacingMessage += 'Authentication Failed. The Gemini API key is missing or invalid. Please check your credentials in Settings.';
        break;
      case 403:
        userFacingMessage += 'Access Forbidden. Your API key does not have permission for the requested model or quota.';
        break;
      case 408:
        userFacingMessage += 'Request Timeout. The model took too long to respond. Try reducing output tokens or splitting the prompt.';
        break;
      case 429:
        userFacingMessage += 'Rate Limit Exceeded. Quota has been reached. Please wait a moment before sending more requests.';
        break;
      case 500:
        userFacingMessage += 'Internal Server Error at Gemini. Google servers encountered a temporary issue. Please retry.';
        break;
      case 502:
      case 503:
        userFacingMessage += 'Service Unavailable. Gemini service is temporarily overloaded or undergoing maintenance. Please retry.';
        break;
      default:
        userFacingMessage += message;
    }

    const error = new Error(userFacingMessage);
    (error as unknown as { statusCode: number }).statusCode = code || 500;
    return error;
  }

  private async executeWithRetry<T>(
    operation: (model: string, attempt: number) => Promise<T>,
    context: string,
    preferredModel?: string,
    maxRetries = 3
  ): Promise<T> {
    const modelsToTry = [
      preferredModel || this.defaultModel,
      'gemini-flash-latest',
      'gemini-3.1-flash-lite'
    ];
    let lastError: unknown = null;

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      const model = modelsToTry[Math.min(attempt, modelsToTry.length - 1)];
      try {
        return await operation(model, attempt);
      } catch (err) {
        lastError = err;
        if (!this.isTransientError(err) || attempt === maxRetries) {
          throw this.handleGeminiError(err, context);
        }
        // Exponential backoff with jitter (e.g. 1.2s, 2.5s, 4.5s)
        const delayMs = Math.min(5000, 1000 * Math.pow(1.6, attempt) + Math.random() * 400);
        console.warn(`[GeminiProvider] Transient error on attempt ${attempt + 1}/${maxRetries + 1} (${context}) with ${model}. Retrying in ${Math.round(delayMs)}ms...`);
        await new Promise(resolve => setTimeout(resolve, delayMs));
      }
    }
    throw this.handleGeminiError(lastError, context);
  }

  public async generate(prompt: string, options?: AIGenerateOptions): Promise<string> {
    const ai = this.getClient();
    const preferredModel = options?.model || this.defaultModel;

    return this.executeWithRetry<string>(
      async (model: string) => {
        const config: Record<string, unknown> = {};
        if (options?.systemInstruction) config.systemInstruction = options.systemInstruction;
        if (options?.temperature !== undefined) config.temperature = options.temperature;
        if (options?.maxOutputTokens) config.maxOutputTokens = options.maxOutputTokens;
        if (options?.topP !== undefined) config.topP = options.topP;
        if (options?.responseMimeType) config.responseMimeType = options.responseMimeType;

        const tools: Array<Record<string, unknown>> = [];
        if (options?.useGoogleSearchGrounding) {
          tools.push({ googleSearch: {} });
        }

        const response = await ai.models.generateContent({
          model,
          contents: prompt,
          config: Object.keys(config).length > 0 ? config : undefined,
          ...(tools.length > 0 ? { tools } : {})
        });

        const text = response.text;
        if (!text) {
          throw new Error('Gemini returned an empty response. Verify prompt constraints.');
        }
        return text;
      },
      'text generation',
      preferredModel
    );
  }

  public async generateJson<T = unknown>(prompt: string, schemaDesc?: string, options?: AIGenerateOptions): Promise<T> {
    const ai = this.getClient();
    const preferredModel = options?.model || this.defaultModel;

    const systemInstruction = (options?.systemInstruction ? options.systemInstruction + '\n' : '') +
      'You are a strict structured data generator. Return ONLY raw valid JSON adhering to the requirements. Do NOT wrap in markdown codeblocks (no ```json). Do NOT add extra conversational commentary.';

    const fullPrompt = schemaDesc ? `${prompt}\n\nRequired JSON Format/Schema:\n${schemaDesc}` : prompt;

    return this.executeWithRetry<T>(
      async (model: string, attempt: number) => {
        // In later retry attempts, relax responseMimeType if it encounters decoding congestion
        const useJsonMime = attempt < 2;

        const response = await ai.models.generateContent({
          model,
          contents: fullPrompt,
          config: {
            systemInstruction,
            ...(useJsonMime ? { responseMimeType: 'application/json' } : {}),
            temperature: options?.temperature ?? 0.3,
            maxOutputTokens: options?.maxOutputTokens ?? 4096,
          }
        });

        const text = response.text || '';
        return this.parseAndRepairJson<T>(text, fullPrompt, model);
      },
      'structured JSON generation',
      preferredModel
    );
  }

  private async parseAndRepairJson<T>(rawText: string, originalPrompt: string, model: string): Promise<T> {
    let clean = rawText.trim();
    if (clean.startsWith('```json')) clean = clean.slice(7);
    if (clean.startsWith('```')) clean = clean.slice(3);
    if (clean.endsWith('```')) clean = clean.slice(0, -3);
    clean = clean.trim();

    try {
      return JSON.parse(clean) as T;
    } catch {
      // Single repair attempt as specified in Rule 59
      try {
        const ai = this.getClient();
        const repairResponse = await ai.models.generateContent({
          model,
          contents: `The following text was supposed to be strictly valid JSON but has a syntax error. Fix the syntax and return ONLY the valid JSON with no comments or wrappers:\n\n${clean}`,
          config: {
            responseMimeType: 'application/json',
            temperature: 0.1,
          }
        });
        const repairedText = (repairResponse.text || '').replace(/^```json/g, '').replace(/```$/g, '').trim();
        return JSON.parse(repairedText) as T;
      } catch (repairErr) {
        throw new Error(`Failed to parse structured JSON after repair attempt. Raw snippet: ${clean.slice(0, 150)}...`);
      }
    }
  }

  public async stream(prompt: string, onChunk: (chunk: string) => void, options?: AIGenerateOptions): Promise<string> {
    const ai = this.getClient();
    const model = options?.model || this.defaultModel;

    try {
      const responseStream = await ai.models.generateContentStream({
        model,
        contents: prompt,
        config: {
          systemInstruction: options?.systemInstruction,
          temperature: options?.temperature ?? 0.7,
        }
      });

      let fullText = '';
      for await (const chunk of responseStream) {
        const textChunk = chunk.text || '';
        fullText += textChunk;
        onChunk(textChunk);
      }
      return fullText;
    } catch (err) {
      throw this.handleGeminiError(err, 'streaming');
    }
  }

  public async analyze(content: string, instructions: string, options?: AIGenerateOptions): Promise<string> {
    const prompt = `INSTRUCTIONS:\n${instructions}\n\nCONTENT TO ANALYZE:\n${content}`;
    return this.generate(prompt, options);
  }

  public async rewrite(content: string, instruction: string, options?: AIGenerateOptions): Promise<string> {
    const prompt = `You are an expert editorial writer and SEO copywriter.
Task: ${instruction}

CRITICAL RULES:
- Only rewrite the specified content.
- Never add keyword stuffing, filler, fake statistics, or fake reviews.
- Maintain human-first clarity, usefulness, and proper headings or lists where appropriate.

ORIGINAL CONTENT:
${content}

REWRITTEN VERSION:`;

    return this.generate(prompt, options);
  }

  public async testConnection(): Promise<{ success: boolean; message: string; model: string }> {
    try {
      const result = await this.generate('Ping. Reply with "pong" and nothing else.', {
        maxOutputTokens: 10,
        temperature: 0.1,
      });
      return {
        success: true,
        message: `Gemini API connected successfully. Response: "${result.trim()}"`,
        model: this.defaultModel,
      };
    } catch (err) {
      return {
        success: false,
        message: err instanceof Error ? err.message : String(err),
        model: this.defaultModel,
      };
    }
  }
}
