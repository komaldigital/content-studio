/**
 * Mock Instagram Service
 * Enables instant sandbox testing and previewing of Instagram post publishing.
 */

import { InstagramProviderInterface } from './InstagramProviderInterface.js';
import { InstagramPostData } from '../../types.js';

export class MockInstagramService implements InstagramProviderInterface {
  public readonly providerName = 'Mock Instagram Provider (Testing Mode)';
  private connected: boolean = true;
  private username: string = 'seo_content_studio';

  public isConnected(): boolean {
    return this.connected;
  }

  public async connect(_instagramAccountId: string, _token: string): Promise<{ success: boolean; message: string; username?: string }> {
    this.connected = true;
    return {
      success: true,
      message: `Mock Instagram connected for testing environment as @${this.username}`,
      username: this.username
    };
  }

  public async disconnect(): Promise<void> {
    this.connected = false;
  }

  public async createPost(postData: InstagramPostData): Promise<{ success: boolean; mediaId?: string; permalink?: string; error?: string }> {
    if (!this.connected) {
      return { success: false, error: 'Instagram is not connected.' };
    }

    const mockId = 'ig_media_' + Date.now();
    return {
      success: true,
      mediaId: mockId,
      permalink: `https://www.instagram.com/p/${mockId}/?test_mode=true`
    };
  }
}
