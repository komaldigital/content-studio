/**
 * InstagramService
 * Live Instagram Graph API Content Publishing implementation.
 * Follows Rule 30/60 pattern: Never fakes publication. If not connected, reports "Instagram is not connected."
 */

import { InstagramProviderInterface } from './InstagramProviderInterface.js';
import { InstagramPostData } from '../../types.js';

export class InstagramService implements InstagramProviderInterface {
  public readonly providerName = 'Instagram Graph Publishing API v21.0';
  private instagramAccountId: string = '';
  private accessToken: string = '';
  private connectedUsername: string = '';

  constructor(instagramAccountId?: string, accessToken?: string) {
    this.instagramAccountId = instagramAccountId || process.env.INSTAGRAM_ACCOUNT_ID || '';
    this.accessToken = accessToken || process.env.INSTAGRAM_ACCESS_TOKEN || '';
  }

  public isConnected(): boolean {
    return Boolean(this.instagramAccountId && this.accessToken && this.accessToken.trim().length > 15);
  }

  public async connect(instagramAccountId: string, accessToken: string): Promise<{ success: boolean; message: string; username?: string }> {
    if (!instagramAccountId || !accessToken || accessToken.trim().length < 15) {
      return { success: false, message: 'Invalid Instagram Account ID or Access Token.' };
    }

    this.instagramAccountId = instagramAccountId.trim();
    this.accessToken = accessToken.trim();

    try {
      const endpoint = `https://graph.facebook.com/v21.0/${encodeURIComponent(this.instagramAccountId)}?fields=id,username,name,profile_picture_url&access_token=${encodeURIComponent(this.accessToken)}`;
      const res = await fetch(endpoint);

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        const errDetail = errorData.error?.message || `HTTP ${res.status}`;
        this.accessToken = '';
        return {
          success: false,
          message: `Instagram connection failed: ${errDetail}`
        };
      }

      const accountData = await res.json();
      this.connectedUsername = accountData.username || 'instagram_creator';

      return {
        success: true,
        message: `Successfully connected to Instagram as @${this.connectedUsername} (ID: ${this.instagramAccountId})`,
        username: this.connectedUsername
      };
    } catch (err) {
      this.accessToken = '';
      return {
        success: false,
        message: `Network error connecting to Instagram Graph API: ${err instanceof Error ? err.message : String(err)}`
      };
    }
  }

  public async disconnect(): Promise<void> {
    this.instagramAccountId = '';
    this.accessToken = '';
    this.connectedUsername = '';
  }

  public async createPost(postData: InstagramPostData): Promise<{ success: boolean; mediaId?: string; permalink?: string; error?: string }> {
    if (!this.isConnected()) {
      return {
        success: false,
        error: 'Instagram is not connected. Please configure your Instagram Business Account ID and Access Token in Settings.'
      };
    }

    if (!postData.imageUrl || !postData.imageUrl.startsWith('http')) {
      return {
        success: false,
        error: 'Cannot publish to Instagram without a publicly accessible image URL.'
      };
    }

    try {
      // Step 1: Create Container
      const createContainerUrl = `https://graph.facebook.com/v21.0/${encodeURIComponent(this.instagramAccountId)}/media`;
      const containerBody = {
        image_url: postData.imageUrl,
        caption: postData.caption || '',
        access_token: this.accessToken
      };

      const containerRes = await fetch(createContainerUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(containerBody)
      });

      if (!containerRes.ok) {
        const errBody = await containerRes.json().catch(() => ({}));
        return {
          success: false,
          error: `Instagram media container creation failed (HTTP ${containerRes.status}): ${errBody.error?.message || JSON.stringify(errBody)}`
        };
      }

      const containerData = await containerRes.json();
      const creationId = containerData.id;

      if (!creationId) {
        return {
          success: false,
          error: 'Instagram did not return a valid container ID.'
        };
      }

      // Step 2: Publish Container
      const publishUrl = `https://graph.facebook.com/v21.0/${encodeURIComponent(this.instagramAccountId)}/media_publish`;
      const publishBody = {
        creation_id: creationId,
        access_token: this.accessToken
      };

      const publishRes = await fetch(publishUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(publishBody)
      });

      if (!publishRes.ok) {
        const errBody = await publishRes.json().catch(() => ({}));
        return {
          success: false,
          error: `Instagram media publish failed (HTTP ${publishRes.status}): ${errBody.error?.message || JSON.stringify(errBody)}`
        };
      }

      const publishData = await publishRes.json();
      const mediaId = publishData.id;

      // Optional: Fetch permalink
      let permalink = `https://www.instagram.com/p/${mediaId}/`;
      try {
        const permalinkRes = await fetch(`https://graph.facebook.com/v21.0/${mediaId}?fields=permalink&access_token=${encodeURIComponent(this.accessToken)}`);
        if (permalinkRes.ok) {
          const pData = await permalinkRes.json();
          if (pData.permalink) permalink = pData.permalink;
        }
      } catch {
        // Fallback permalink is fine
      }

      return {
        success: true,
        mediaId,
        permalink
      };
    } catch (err) {
      return {
        success: false,
        error: `Instagram publish failed due to network or server error: ${err instanceof Error ? err.message : String(err)}`
      };
    }
  }
}
