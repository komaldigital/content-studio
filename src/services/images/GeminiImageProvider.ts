/**
 * GeminiImageProvider
 * Generates Featured, Article, and Pinterest images.
 * Uses Gemini image generation or curated high-resolution visual rendering with natural ALT text.
 */

import { GoogleGenAI } from '@google/genai';
import { ImageProviderInterface, ImageGenerateOptions } from './ImageProviderInterface.js';
import { ArticleImage } from '../../types.js';
import { KeywordImageService } from './KeywordImageService.js';

export class GeminiImageProvider implements ImageProviderInterface {
  public readonly providerName = 'Gemini Image & Visual Studio';
  private apiKey: string;
  private client: GoogleGenAI | null = null;

  constructor(apiKey?: string) {
    this.apiKey = apiKey || process.env.GEMINI_API_KEY || '';
    if (this.apiKey) {
      this.client = new GoogleGenAI({
        apiKey: this.apiKey,
        httpOptions: { headers: { 'User-Agent': 'aistudio-build' } }
      });
    }
  }

  public isConfigured(): boolean {
    return Boolean(this.apiKey || process.env.GEMINI_API_KEY);
  }

  public async generateAltText(imageDescription: string, context: string): Promise<string> {
    // Rule 23: Good: "Grilled chicken with roasted vegetables on a dinner plate"
    // Bad: "best chicken dinner recipes easy chicken recipes chicken dinner"
    // Never keyword stuff ALT text.
    if (!this.isConfigured()) {
      return this.fallbackAltText(imageDescription, context);
    }

    try {
      const ai = this.client || new GoogleGenAI({
        apiKey: this.apiKey || process.env.GEMINI_API_KEY || '',
        httpOptions: { headers: { 'User-Agent': 'aistudio-build' } }
      });

      const prompt = `Write a natural, concise, and descriptive ALT text for an image.
Image subject: "${imageDescription}"
Article context: "${context}"

STRICT RULES:
- Under 125 characters.
- Accurately describe the visual elements (e.g. "Golden-brown seared chicken breasts served on a white platter with fresh herbs").
- NEVER keyword-stuff.
- Do NOT say "Image of" or "Picture of".
- Output ONLY the ALT text string and nothing else.`;

      const res = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          temperature: 0.2,
          maxOutputTokens: 60,
        }
      });

      const alt = res.text?.trim() || '';
      return alt.replace(/^["']|["']$/g, '') || this.fallbackAltText(imageDescription, context);
    } catch {
      return this.fallbackAltText(imageDescription, context);
    }
  }

  private fallbackAltText(desc: string, context: string): string {
    return `${desc || context || 'Visual overview and practical context'} in focused presentation`;
  }

  /**
   * Generates multiple search-intent matched images concurrently.
   */
  public async generateMultipleImages(optionsList: ImageGenerateOptions[]): Promise<ArticleImage[]> {
    return Promise.all(optionsList.map(opt => this.generateImage(opt)));
  }

  public async generateImage(options: ImageGenerateOptions): Promise<ArticleImage> {
    const id = 'img_' + Math.random().toString(36).substring(2, 9);
    const altContext = `${options.topic} - ${options.searchIntentMatch || options.placement || 'article context'}`;
    const altText = await this.generateAltText(options.prompt, altContext);

    // Dimensions according to standard ratio rules
    const isPinterest = options.type === 'pinterest';
    let width = 1200;
    let height = 675;

    if (isPinterest || options.aspectRatio === '9:16') {
      width = 1000;
      height = 1500;
    } else if (options.aspectRatio === '4:3') {
      width = 800;
      height = 600;
    } else if (options.aspectRatio === '1:1') {
      width = 800;
      height = 800;
    } else if (options.aspectRatio === '3:4') {
      width = 600;
      height = 800;
    }

    // Fetch keyword-matched image (authentic Wikimedia Commons photo or Pollinations Turbo AI directly prompted with keyword)
    const matched = await KeywordImageService.getKeywordMatchedImage({
      topic: options.topic,
      sectionHeading: options.sectionHeading,
      searchIntentMatch: options.searchIntentMatch,
      prompt: options.prompt,
      width,
      height
    });

    return {
      id,
      type: options.type,
      url: matched.url,
      altText: altText || matched.altText,
      caption: options.titleOverlay || options.prompt,
      description: `Visual demonstrating ${options.searchIntentMatch || options.prompt} for ${options.topic}`,
      placement: options.placement || (options.type === 'featured' ? 'Header' : 'Body Section'),
      prompt: options.prompt,
      searchIntentMatch: options.searchIntentMatch,
      sectionHeading: options.sectionHeading,
      aspectRatio: options.aspectRatio || (options.type === 'featured' ? '16:9' : '4:3')
    };
  }

  private simpleHash(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = ((hash << 5) - hash) + str.charCodeAt(i);
      hash |= 0;
    }
    return hash;
  }
}
