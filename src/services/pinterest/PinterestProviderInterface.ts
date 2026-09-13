/**
 * Pinterest Provider Interface
 * Rule 30: Never fake publication. If not connected, show "Pinterest is not connected."
 */

import { PinterestPinData } from '../../types.js';

export interface PinterestBoard {
  id: string;
  name: string;
  description?: string;
  privacy?: string;
}

export interface PinterestProviderInterface {
  readonly providerName: string;
  isConnected(): boolean;
  connect(accessToken: string): Promise<{ success: boolean; message: string; username?: string }>;
  disconnect(): Promise<void>;
  getBoards(): Promise<PinterestBoard[]>;
  createPin(pinData: PinterestPinData): Promise<{ success: boolean; pinId?: string; url?: string; error?: string }>;
}
