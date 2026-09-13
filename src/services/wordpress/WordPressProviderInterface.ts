/**
 * WordPress Provider Interface
 * Supports REST API, Application Passwords, SEO plugins (Yoast, RankMath, AIOSEO),
 * content indexing for internal links, and secure post lifecycle management.
 */

import { Article } from '../../types.js';

export interface WordPressPostPayload {
  title: string;
  content: string;
  slug: string;
  status: 'draft' | 'pending' | 'future' | 'publish';
  excerpt?: string;
  categories?: number[];
  tags?: number[];
  featuredMediaId?: number;
  date?: string; // ISO string for scheduled posts
  meta?: Record<string, unknown>;
}

export interface WordPressPostResponse {
  success: boolean;
  postId?: number;
  postUrl?: string;
  status?: string;
  error?: string;
}

export interface WordPressExistingPost {
  id: number;
  title: string;
  slug: string;
  url: string;
  excerpt: string;
  categoryNames: string[];
  tagNames: string[];
}

export interface WordPressProviderInterface {
  readonly providerName: string;
  isConnected(): boolean;
  testConnection(): Promise<{ success: boolean; message: string; siteName?: string; detectedSeoPlugin?: string }>;
  createOrUpdatePost(article: Article, publishStatus?: 'draft' | 'pending' | 'publish' | 'future'): Promise<WordPressPostResponse>;
  fetchContentIndex(): Promise<WordPressExistingPost[]>;
  uploadMedia(fileBufferOrUrl: string, altText: string, filename: string): Promise<{ success: boolean; mediaId?: number; mediaUrl?: string; error?: string }>;
}
