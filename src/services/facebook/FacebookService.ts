/**
 * FacebookService
 * Live Facebook Graph API (v21.0) implementation for Pages publishing.
 * Follows Rule 30/60 pattern: Never fakes publication. If not connected, reports "Facebook is not connected."
 */

import { FacebookProviderInterface } from './FacebookProviderInterface.js';
import { FacebookPostData } from '../../types.js';

export class FacebookService implements FacebookProviderInterface {
  public readonly providerName = 'Facebook Graph API v21.0';
  private pageId: string = '';
  private accessToken: string = '';
  private connectedPageName: string = '';

  constructor(pageId?: string, accessToken?: string) {
    this.pageId = pageId || process.env.FACEBOOK_PAGE_ID || '';
    this.accessToken = accessToken || process.env.FACEBOOK_PAGE_ACCESS_TOKEN || '';
  }

  public isConnected(): boolean {
    return Boolean(this.pageId && this.accessToken && this.accessToken.trim().length > 15);
  }

  public async connect(pageId: string, accessToken: string): Promise<{ success: boolean; message: string; pageName?: string }> {
    if (!pageId || !accessToken || accessToken.trim().length < 15) {
      return { success: false, message: 'Invalid Facebook Page ID or Page Access Token.' };
    }

    this.pageId = pageId.trim();
    this.accessToken = accessToken.trim();

    try {
      const endpoint = `https://graph.facebook.com/v21.0/${encodeURIComponent(this.pageId)}?fields=id,name,link,category&access_token=${encodeURIComponent(this.accessToken)}`;
      const res = await fetch(endpoint);

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        const errDetail = errorData.error?.message || `HTTP ${res.status}`;
        this.accessToken = '';
        return {
          success: false,
          message: `Facebook connection failed: ${errDetail}`
        };
      }

      const pageData = await res.json();
      this.connectedPageName = pageData.name || 'Facebook Page';

      return {
        success: true,
        message: `Successfully connected to Facebook Page: "${this.connectedPageName}" (ID: ${this.pageId})`,
        pageName: this.connectedPageName
      };
    } catch (err) {
      this.accessToken = '';
      return {
        success: false,
        message: `Network error connecting to Facebook Graph API: ${err instanceof Error ? err.message : String(err)}`
      };
    }
  }

  public async disconnect(): Promise<void> {
    this.pageId = '';
    this.accessToken = '';
    this.connectedPageName = '';
  }

  public async createPost(postData: FacebookPostData): Promise<{ success: boolean; postId?: string; postUrl?: string; error?: string }> {
    if (!this.isConnected()) {
      return {
        success: false,
        error: 'Facebook is not connected. Please configure your Facebook Page ID and Page Access Token in Settings.'
      };
    }

    try {
      // Determine endpoint: /photos if image is provided, or /feed for status/link post
      if (postData.imageUrl && postData.imageUrl.startsWith('http')) {
        const url = `https://graph.facebook.com/v21.0/${encodeURIComponent(this.pageId)}/photos`;
        const body: Record<string, string> = {
          url: postData.imageUrl,
          caption: postData.message,
          access_token: this.accessToken
        };

        const res = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body)
        });

        if (!res.ok) {
          const errBody = await res.json().catch(() => ({}));
          return {
            success: false,
            error: `Facebook photo post failed (HTTP ${res.status}): ${errBody.error?.message || JSON.stringify(errBody)}`
          };
        }

        const data = await res.json();
        const postId = data.post_id || data.id;
        const postUrl = `https://www.facebook.com/${encodeURIComponent(this.pageId)}/posts/${encodeURIComponent(postId)}`;

        return {
          success: true,
          postId,
          postUrl
        };
      } else {
        // Standard feed post with optional link
        const url = `https://graph.facebook.com/v21.0/${encodeURIComponent(this.pageId)}/feed`;
        const body: Record<string, string> = {
          message: postData.message,
          access_token: this.accessToken
        };
        if (postData.link) {
          body.link = postData.link;
        }

        const res = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body)
        });

        if (!res.ok) {
          const errBody = await res.json().catch(() => ({}));
          return {
            success: false,
            error: `Facebook feed post failed (HTTP ${res.status}): ${errBody.error?.message || JSON.stringify(errBody)}`
          };
        }

        const data = await res.json();
        const postId = data.id;
        const postUrl = `https://www.facebook.com/${encodeURIComponent(this.pageId)}/posts/${encodeURIComponent(postId)}`;

        return {
          success: true,
          postId,
          postUrl
        };
      }
    } catch (err) {
      return {
        success: false,
        error: `Facebook post failed due to network or server error: ${err instanceof Error ? err.message : String(err)}`
      };
    }
  }
}
