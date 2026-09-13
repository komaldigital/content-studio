/**
 * DedicatedImageGeneratorService
 * Built-in AI image generator for creating original visuals to accompany articles.
 * Supports custom prompts, aspect ratios, artistic styles, SEO alt text, and 1-click article attachment.
 */

import { GoogleGenAI } from '@google/genai';
import { GeneratedImageItem, ArticleImage } from '../../types.js';
import { KeywordImageService } from './KeywordImageService.js';

export interface StandaloneImageRequest {
  prompt: string;
  topic?: string;
  aspectRatio: '16:9' | '1:1' | '4:3' | '9:16';
  style: 'photorealistic' | 'illustrative' | 'infographic' | 'watercolor' | '3d-render' | 'minimalist';
  targetArticleId?: string;
  engine?: string;
}

export class DedicatedImageGeneratorService {
  private openrouterKey: string;
  private geminiKey: string;

  constructor(openrouterKey?: string, geminiKey?: string) {
    this.openrouterKey = openrouterKey || process.env.OPENROUTER_API_KEY || '';
    this.geminiKey = geminiKey || process.env.GEMINI_API_KEY || '';
  }

  public setOpenrouterKey(key: string): void {
    this.openrouterKey = key;
  }

  public setGeminiKey(key: string): void {
    this.geminiKey = key;
  }

  /**
   * Generates a new original image item
   */
  public async generateVisual(request: StandaloneImageRequest): Promise<GeneratedImageItem> {
    const id = 'img_gen_' + Math.random().toString(36).substring(2, 9);
    const styleModifiers = {
      photorealistic: 'hyper-detailed editorial photograph, natural diffuse studio lighting, 85mm f/1.8 lens, high dynamic range',
      illustrative: 'modern clean editorial illustration, balanced color palette, elegant visual clarity',
      infographic: 'technical infographic visual diagram, structured key components, clean UI accents, crisp typography',
      watercolor: 'delicate artistic watercolor painting, soft textures, authentic paper grain, aesthetic tones',
      '3d-render': 'clean 3D render, ambient occlusion, subtle raytracing, modern matte materials, smooth studio lighting',
      minimalist: 'minimalist visual composition, abundant negative space, bold focal subject, clean geometric harmony'
    };

    const stylePrompt = styleModifiers[request.style] || styleModifiers.photorealistic;
    const fullPrompt = `${request.prompt}. Style: ${stylePrompt}. High resolution, pristine composition, no unwanted watermarks.`;

    const dimensions = {
      '16:9': { width: 1280, height: 720 },
      '1:1': { width: 1024, height: 1024 },
      '4:3': { width: 1024, height: 768 },
      '9:16': { width: 720, height: 1280 }
    }[request.aspectRatio] || { width: 1280, height: 720 };

    let finalUrl = '';
    let engineUsed = 'bytedance-seed/seedream-4.5 (OpenRouter)';

    // 1. Primary: Seedream 4.5 via OpenRouter
    const effectiveOpenRouterKey = this.openrouterKey || process.env.OPENROUTER_API_KEY || '';
    if (effectiveOpenRouterKey) {
      try {
        console.info(`[DedicatedImageGeneratorService] Generating visual with ByteDance Seedream 4.5 via OpenRouter...`);
        const response = await fetch('https://openrouter.ai/api/v1/images', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${effectiveOpenRouterKey}`,
            'Content-Type': 'application/json',
            'HTTP-Referer': process.env.APP_URL || 'https://ai.studio/build',
            'X-Title': 'AI SEO Content Studio - Seedream 4.5'
          },
          body: JSON.stringify({
            model: 'bytedance-seed/seedream-4.5',
            prompt: fullPrompt,
            aspect_ratio: request.aspectRatio || '16:9',
            resolution: '2K',
            output_format: 'jpeg',
            n: 1
          }),
          signal: AbortSignal.timeout(45000)
        });

        if (response.ok) {
          const data = await response.json();
          const firstImg = data?.data?.[0];
          if (firstImg?.b64_json) {
            finalUrl = `data:image/jpeg;base64,${firstImg.b64_json}`;
          } else if (firstImg?.url) {
            finalUrl = firstImg.url;
          }
        } else {
          const errText = await response.text();
          console.warn(`[DedicatedImageGeneratorService] OpenRouter Seedream 4.5 status ${response.status}: ${errText.slice(0, 150)}`);
        }
      } catch (err: any) {
        console.warn(`[DedicatedImageGeneratorService] Seedream 4.5 call error: ${err.message}`);
      }
    }

    // 2. Secondary fallback: Imagen 3 if Gemini key is configured
    if (!finalUrl && this.geminiKey) {
      try {
        const ai = new GoogleGenAI({ apiKey: this.geminiKey });
        const imagenResponse = await ai.models.generateImages({
          model: 'imagen-3.0-generate-002',
          prompt: fullPrompt,
          config: {
            numberOfImages: 1,
            aspectRatio: request.aspectRatio === '16:9' ? '16:9' : request.aspectRatio === '1:1' ? '1:1' : request.aspectRatio === '4:3' ? '4:3' : '9:16',
            outputMimeType: 'image/jpeg'
          }
        });

        if (imagenResponse.generatedImages && imagenResponse.generatedImages[0]?.image?.imageBytes) {
          finalUrl = `data:image/jpeg;base64,${imagenResponse.generatedImages[0].image.imageBytes}`;
          engineUsed = 'Imagen 3 (Fallback)';
        }
      } catch (err: any) {
        console.info(`[DedicatedImageGeneratorService] Imagen direct API fallback: ${err.message}.`);
      }
    }

    // 3. High-fidelity fallback to Pollinations AI Turbo
    if (!finalUrl) {
      const sanitized = encodeURIComponent(fullPrompt.slice(0, 200).replace(/[^a-zA-Z0-9\s]/g, ''));
      finalUrl = `https://image.pollinations.ai/prompt/${sanitized}?width=${dimensions.width}&height=${dimensions.height}&nologo=true&enhance=true&seed=${Math.floor(Math.random() * 999999)}`;
      engineUsed = 'Pollinations Turbo (Seedream Fallback)';
    }

    // Generate descriptive SEO Alt Text and Caption
    const altText = `${request.topic || request.prompt} - ${request.style} visual asset`;
    const caption = `Editorial visual: ${request.prompt.slice(0, 90)}`;

    const imageItem: GeneratedImageItem = {
      id,
      prompt: request.prompt,
      revisedPrompt: fullPrompt,
      url: finalUrl,
      aspectRatio: request.aspectRatio,
      style: request.style,
      altText,
      caption,
      targetArticleId: request.targetArticleId,
      createdAt: new Date().toISOString()
    };

    return imageItem;
  }

  /**
   * Convert GeneratedImageItem to ArticleImage format for insertion into an article
   */
  public toArticleImage(item: GeneratedImageItem, type: 'featured' | 'article' = 'article', sectionHeading?: string): ArticleImage {
    return {
      id: item.id,
      url: item.url,
      altText: item.altText,
      caption: item.caption,
      type,
      placement: type === 'featured' ? 'Article Header / Featured' : 'Contextual Section Visual',
      aspectRatio: item.aspectRatio,
      searchIntentMatch: `AI-Generated Visual (${item.style})`,
      sectionHeading
    };
  }
}
