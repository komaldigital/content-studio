/**
 * Mock Facebook Service
 * Allows testing and verification of Facebook post generation and syndication in sandbox environments.
 */

import { FacebookProviderInterface } from './FacebookProviderInterface.js';
import { FacebookPostData } from '../../types.js';

export class MockFacebookService implements FacebookProviderInterface {
  public readonly providerName = 'Mock Facebook Provider (Testing Mode)';
  private connected: boolean = true;
  private pageName: string = 'Test SEO Publishing Page';
  private pageId: string = 'mock_fb_page_109283';

  public isConnected(): boolean {
    return this.connected;
  }

  public async connect(pageId: string, _token: string): Promise<{ success: boolean; message: string; pageName?: string }> {
    this.connected = true;
    this.pageId = pageId || 'mock_fb_page_109283';
    return {
      success: true,
      message: `Mock Facebook connected for testing environment as "${this.pageName}"`,
      pageName: this.pageName
    };
  }

  public async disconnect(): Promise<void> {
    this.connected = false;
  }

  public async createPost(postData: FacebookPostData): Promise<{ success: boolean; postId?: string; postUrl?: string; error?: string }> {
    if (!this.connected) {
      return { success: false, error: 'Facebook is not connected.' };
    }

    const mockId = 'fb_post_' + Date.now();
    return {
      success: true,
      postId: mockId,
      postUrl: `https://www.facebook.com/${this.pageId}/posts/${mockId}?test_mode=true`
    };
  }
}
