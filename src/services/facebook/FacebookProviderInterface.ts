/**
 * Facebook Provider Interface
 * Standardized contract for Facebook Graph API publishing and testing.
 */

import { FacebookPostData } from '../../types.js';

export interface FacebookProviderInterface {
  readonly providerName: string;
  isConnected(): boolean;
  connect(pageId: string, accessToken: string): Promise<{ success: boolean; message: string; pageName?: string }>;
  disconnect(): Promise<void>;
  createPost(postData: FacebookPostData): Promise<{ success: boolean; postId?: string; postUrl?: string; error?: string }>;
}
