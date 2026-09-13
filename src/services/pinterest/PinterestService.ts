/**
 * PinterestService
 * Live Pinterest API v5 implementation.
 * Strictly adheres to Rule 30 & Rule 60:
 * Never fakes publication. If not connected, reports "Pinterest is not connected."
 */

import { PinterestProviderInterface, PinterestBoard } from './PinterestProviderInterface.js';
import { PinterestPinData } from '../../types.js';

export class PinterestService implements PinterestProviderInterface {
  public readonly providerName = 'Pinterest API v5';
  private accessToken: string = '';
  private connectedUsername: string = '';

  constructor(token?: string) {
    this.accessToken = token || process.env.PINTEREST_ACCESS_TOKEN || '';
  }

  public isConnected(): boolean {
    return Boolean(this.accessToken && this.accessToken.trim().length > 10);
  }

  public async connect(token: string): Promise<{ success: boolean; message: string; username?: string }> {
    if (!token || token.trim().length < 10) {
      return { success: false, message: 'Invalid or missing Pinterest OAuth Access Token.' };
    }

    this.accessToken = token.trim();

    try {
      const res = await fetch('https://api.pinterest.com/v5/user_account', {
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
          'Content-Type': 'application/json'
        }
      });

      if (!res.ok) {
        const errorBody = await res.text();
        this.accessToken = '';
        if (res.status === 401) {
          return { success: false, message: 'Pinterest authentication failed: Token expired or invalid.' };
        }
        return { success: false, message: `Pinterest API responded with status ${res.status}: ${errorBody}` };
      }

      const userData = await res.json();
      this.connectedUsername = userData.username || userData.business_name || 'Pinterest User';
      return {
        success: true,
        message: `Successfully connected to Pinterest as @${this.connectedUsername}`,
        username: this.connectedUsername
      };
    } catch (err) {
      this.accessToken = '';
      return {
        success: false,
        message: `Network error connecting to Pinterest API: ${err instanceof Error ? err.message : String(err)}`
      };
    }
  }

  public async disconnect(): Promise<void> {
    this.accessToken = '';
    this.connectedUsername = '';
  }

  public async getBoards(): Promise<PinterestBoard[]> {
    if (!this.isConnected()) {
      return [];
    }

    try {
      const res = await fetch('https://api.pinterest.com/v5/boards?page_size=50', {
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
          'Content-Type': 'application/json'
        }
      });

      if (!res.ok) {
        throw new Error(`Failed to fetch Pinterest boards: HTTP ${res.status}`);
      }

      const data = await res.json();
      return (data.items || []).map((b: { id: string; name: string; description?: string; privacy?: string }) => ({
        id: b.id,
        name: b.name,
        description: b.description,
        privacy: b.privacy
      }));
    } catch {
      return [];
    }
  }

  public async createPin(pinData: PinterestPinData): Promise<{ success: boolean; pinId?: string; url?: string; error?: string }> {
    // Rule 30: If Pinterest is not connected: Show "Pinterest is not connected." Never fake publication.
    if (!this.isConnected()) {
      return {
        success: false,
        error: 'Pinterest is not connected. Please connect your Pinterest account in Settings with a valid OAuth token.'
      };
    }

    if (!pinData.boardId) {
      return {
        success: false,
        error: 'Cannot publish pin: No Pinterest board selected. Please select a board first.'
      };
    }

    try {
      // Pinterest API v5 Create Pin
      const payload = {
        title: pinData.title.slice(0, 100),
        description: pinData.description.slice(0, 500),
        link: pinData.destinationUrl,
        board_id: pinData.boardId,
        media_source: {
          source_type: 'image_url',
          url: pinData.imageUrl
        }
      };

      const res = await fetch('https://api.pinterest.com/v5/pins', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        const errorText = await res.text();
        return {
          success: false,
          error: `Pinterest publication failed (HTTP ${res.status}): ${errorText}`
        };
      }

      const result = await res.json();
      return {
        success: true,
        pinId: result.id,
        url: `https://www.pinterest.com/pin/${result.id}/`
      };
    } catch (err) {
      return {
        success: false,
        error: `Failed to create Pin due to network or server error: ${err instanceof Error ? err.message : String(err)}`
      };
    }
  }
}
