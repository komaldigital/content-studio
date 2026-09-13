/**
 * AI Provider Interface
 * Abstraction layer to support Gemini, Anthropic, OpenAI or Test Mocks
 */

export interface AIGenerateOptions {
  model?: string;
  systemInstruction?: string;
  temperature?: number;
  maxOutputTokens?: number;
  topP?: number;
  responseMimeType?: 'text/plain' | 'application/json';
  responseSchema?: Record<string, unknown>;
  useGoogleSearchGrounding?: boolean;
}

export interface AIProviderInterface {
  readonly providerName: string;
  
  generate(prompt: string, options?: AIGenerateOptions): Promise<string>;
  
  generateJson<T = unknown>(prompt: string, schemaDesc?: string, options?: AIGenerateOptions): Promise<T>;
  
  stream(prompt: string, onChunk: (chunk: string) => void, options?: AIGenerateOptions): Promise<string>;
  
  analyze(content: string, instructions: string, options?: AIGenerateOptions): Promise<string>;
  
  rewrite(content: string, instruction: string, options?: AIGenerateOptions): Promise<string>;
  
  testConnection(): Promise<{ success: boolean; message: string; model: string }>;
}
