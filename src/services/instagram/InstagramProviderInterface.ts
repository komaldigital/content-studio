/**
 * Instagram Provider Interface
 * Standardized contract for Instagram Graph Content Publishing API.
 */

import { InstagramPostData } from '../../types.js';

export interface InstagramProviderInterface {
  readonly providerName: string;
  isConnected(): boolean;
  connect(instagramAccountId: string, accessToken: string): Promise<{ success: boolean; message: string; username?: string }>;
  disconnect(): Promise<void>;
  createPost(postData: InstagramPostData): Promise<{ success: boolean; mediaId?: string; permalink?: string; error?: string }>;
}
