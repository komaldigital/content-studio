/**
 * Mock Image Provider
 * Returns fast deterministic test images and ALT text without consuming external quotas.
 */

import { ImageProviderInterface, ImageGenerateOptions } from './ImageProviderInterface.js';
import { ArticleImage } from '../../types.js';
import { KeywordImageService } from './KeywordImageService.js';

export class MockImageProvider implements ImageProviderInterface {
  public readonly providerName = 'Mock Image Provider (Keyword-Matched)';

  public isConfigured(): boolean {
    return true;
  }

  public async generateImage(options: ImageGenerateOptions): Promise<ArticleImage> {
    const isPinterest = options.type === 'pinterest';
    const width = isPinterest ? 1000 : options.aspectRatio === '16:9' ? 1200 : options.aspectRatio === '4:3' ? 800 : 800;
    const height = isPinterest ? 1500 : options.aspectRatio === '16:9' ? 675 : options.aspectRatio === '4:3' ? 600 : 800;

    const matched = await KeywordImageService.getKeywordMatchedImage({
      topic: options.topic,
      sectionHeading: options.sectionHeading,
      searchIntentMatch: options.searchIntentMatch,
      prompt: options.prompt,
      width,
      height
    });

    return {
      id: 'mock_img_' + Math.random().toString(36).substring(2, 9),
      type: options.type,
      url: matched.url,
      altText: matched.altText || (options.prompt.length < 120 ? options.prompt : `High quality visual illustration representing ${options.topic}`),
      caption: options.titleOverlay || options.prompt,
      description: `Visual demonstration for ${options.topic}`,
      placement: options.placement || 'Featured Header',
      prompt: options.prompt,
      searchIntentMatch: options.searchIntentMatch,
      sectionHeading: options.sectionHeading,
      aspectRatio: options.aspectRatio || (options.type === 'featured' ? '16:9' : '4:3')
    };
  }

  public async generateMultipleImages(optionsList: ImageGenerateOptions[]): Promise<ArticleImage[]> {
    return Promise.all(optionsList.map(opt => this.generateImage(opt)));
  }

  private simpleHash(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = ((hash << 5) - hash) + str.charCodeAt(i);
      hash |= 0;
    }
    return hash;
  }

  public async generateAltText(imageDescription: string, _context: string): Promise<string> {
    return `Clean plated view of ${imageDescription || 'dish'} with fresh garnishes`;
  }
}
