/**
 * Mock Pinterest Service
 * Supports dry-run and QA checklist tests without requiring live Pinterest credentials.
 * Explicitly marks test pin creation.
 */

import { PinterestProviderInterface, PinterestBoard } from './PinterestProviderInterface.js';
import { PinterestPinData } from '../../types.js';

export class MockPinterestService implements PinterestProviderInterface {
  public readonly providerName = 'Mock Pinterest Provider (Testing Mode)';
  private connected = true;

  public isConnected(): boolean {
    return this.connected;
  }

  public async connect(_token: string): Promise<{ success: boolean; message: string; username?: string }> {
    this.connected = true;
    return {
      success: true,
      message: 'Mock Pinterest connected for testing environment as @seo_test_account',
      username: 'seo_test_account'
    };
  }

  public async disconnect(): Promise<void> {
    this.connected = false;
  }

  public async getBoards(): Promise<PinterestBoard[]> {
    if (!this.connected) return [];
    return [
      { id: 'mock_b1', name: 'Quick Dinner Recipes', description: 'Weeknight meals & chicken ideas' },
      { id: 'mock_b2', name: 'Healthy Meal Prep', description: 'Make ahead and batch cooking' },
      { id: 'mock_b3', name: 'Easy Family Dinners', description: 'Kid approved recipes' }
    ];
  }

  public async createPin(pinData: PinterestPinData): Promise<{ success: boolean; pinId?: string; url?: string; error?: string }> {
    if (!this.connected) {
      return { success: false, error: 'Pinterest is not connected.' };
    }
    const mockId = 'mock_pin_' + Date.now();
    return {
      success: true,
      pinId: mockId,
      url: `https://www.pinterest.com/pin/${mockId}/?test_mode=true`
    };
  }
}
