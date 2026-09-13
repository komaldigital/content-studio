/**
 * Mock WordPress Service
 * Enables full end-to-end testing of draft creation, media association, and index retrieval.
 */

import { WordPressProviderInterface, WordPressPostResponse, WordPressExistingPost } from './WordPressProviderInterface.js';
import { Article } from '../../types.js';

export class MockWordPressService implements WordPressProviderInterface {
  public readonly providerName = 'Mock WordPress Provider (Testing Mode)';
  private isConn = true;

  public isConnected(): boolean {
    return this.isConn;
  }

  public async testConnection(): Promise<{ success: boolean; message: string; siteName?: string; detectedSeoPlugin?: string }> {
    return {
      success: true,
      message: 'Mock WordPress environment connected for testing. Site: "Culinary Journal Demo". Detected: YOAST.',
      siteName: 'Culinary Journal Demo',
      detectedSeoPlugin: 'yoast'
    };
  }

  public async createOrUpdatePost(article: Article, publishStatus?: 'draft' | 'pending' | 'publish' | 'future'): Promise<WordPressPostResponse> {
    const status = publishStatus || 'draft';
    const mockPostId = article.wordpressPostId || Math.floor(1000 + Math.random() * 9000);
    return {
      success: true,
      postId: mockPostId,
      postUrl: `https://example-wp.com/?p=${mockPostId}&preview=true`,
      status
    };
  }

  public async fetchContentIndex(): Promise<WordPressExistingPost[]> {
    return [
      {
        id: 101,
        title: 'Top 10 Weeknight Dinner Hacks Every Cook Should Know',
        slug: 'weeknight-dinner-hacks',
        url: 'https://example-wp.com/weeknight-dinner-hacks/',
        excerpt: 'Time-saving kitchen techniques, quick pan preparations, and essential pantry substitutions.',
        categoryNames: ['Cooking Tips'],
        tagNames: ['Dinner', 'Kitchen Hacks']
      },
      {
        id: 102,
        title: 'The Ultimate Guide to Kitchen Knives & Meat Prep',
        slug: 'guide-to-kitchen-knives',
        url: 'https://example-wp.com/guide-to-kitchen-knives/',
        excerpt: 'Learn which knife to use for slicing poultry, dicing aromatics, and carving roasts.',
        categoryNames: ['Equipment'],
        tagNames: ['Knives', 'Prep Work']
      },
      {
        id: 103,
        title: 'Sheet Pan Dinners: 15 Zero-Mess Family Meals',
        slug: 'sheet-pan-dinners-collection',
        url: 'https://example-wp.com/sheet-pan-dinners-collection/',
        excerpt: 'One baking sheet is all you need for these healthy, balanced family favorites.',
        categoryNames: ['Recipes'],
        tagNames: ['Sheet Pan', 'Chicken']
      }
    ];
  }

  public async uploadMedia(_file: string, _altText: string, filename: string): Promise<{ success: boolean; mediaId?: number; mediaUrl?: string }> {
    return {
      success: true,
      mediaId: Math.floor(500 + Math.random() * 500),
      mediaUrl: `https://example-wp.com/wp-content/uploads/2026/09/${filename}`
    };
  }
}
