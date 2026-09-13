/**
 * Image Provider Interface
 * Supports generating Featured Images, Article Images, and Pinterest graphics.
 * Rule 23: Natural ALT text generation without keyword stuffing.
 */

import { ArticleImage } from '../../types.js';

export interface ImageGenerateOptions {
  type: 'featured' | 'article' | 'pinterest';
  prompt: string;
  topic: string;
  aspectRatio?: '1:1' | '16:9' | '4:3' | '9:16' | '3:4';
  titleOverlay?: string;
  placement?: string;
  searchIntentMatch?: string;
  sectionHeading?: string;
}

export interface ImageProviderInterface {
  readonly providerName: string;
  isConfigured(): boolean;
  generateImage(options: ImageGenerateOptions): Promise<ArticleImage>;
  generateMultipleImages(optionsList: ImageGenerateOptions[]): Promise<ArticleImage[]>;
  generateAltText(imageDescription: string, context: string): Promise<string>;
}
