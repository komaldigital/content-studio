/**
 * WordPressService
 * Interacts with WordPress REST API using Application Passwords.
 * Supports Yoast SEO, Rank Math, AIOSEO, and native metadata.
 * Rule 33: Defaults to Draft. Never fakes publication (Rule 60).
 */

import { WordPressProviderInterface, WordPressPostResponse, WordPressExistingPost } from './WordPressProviderInterface.js';
import { Article } from '../../types.js';
import { SecurityValidator } from '../security/SecurityValidator.js';

export class WordPressService implements WordPressProviderInterface {
  public readonly providerName = 'WordPress REST API';
  private endpoint: string = '';
  private username: string = '';
  private appPassword: string = '';
  private detectedSeoPlugin: 'yoast' | 'rankmath' | 'aioseo' | 'native' = 'native';

  constructor(endpoint?: string, username?: string, appPassword?: string) {
    this.endpoint = (endpoint || process.env.WORDPRESS_URL || '').replace(/\/+$/, '');
    this.username = username || process.env.WORDPRESS_USER || '';
    this.appPassword = (appPassword || process.env.WORDPRESS_APP_PASSWORD || '').replace(/\s+/g, '');
  }

  public isConnected(): boolean {
    return Boolean(this.endpoint && this.username && this.appPassword);
  }

  private getAuthHeader(): string {
    const credentials = Buffer.from(`${this.username}:${this.appPassword}`).toString('base64');
    return `Basic ${credentials}`;
  }

  public async testConnection(): Promise<{ success: boolean; message: string; siteName?: string; detectedSeoPlugin?: string }> {
    if (!this.isConnected()) {
      return {
        success: false,
        message: 'WordPress is not configured. Please enter your Site URL, Username, and Application Password in Settings.'
      };
    }

    const checkUrl = SecurityValidator.isSafeUrl(this.endpoint);
    if (!checkUrl.safe) {
      return { success: false, message: `Security violation: ${checkUrl.reason}` };
    }

    try {
      // 1. Verify credentials and permissions via /wp-json/wp/v2/users/me
      const userRes = await fetch(`${this.endpoint}/wp-json/wp/v2/users/me`, {
        headers: {
          'Authorization': this.getAuthHeader(),
          'Content-Type': 'application/json'
        }
      });

      if (!userRes.ok) {
        if (userRes.status === 401) {
          return { success: false, message: 'WordPress authentication failed: Invalid username or Application Password.' };
        }
        if (userRes.status === 403) {
          return { success: false, message: 'WordPress permission denied: User does not have edit_posts capability.' };
        }
        return { success: false, message: `WordPress connection failed with HTTP status ${userRes.status}` };
      }

      const userData = await userRes.json();

      // 2. Discover root site info & active SEO plugins
      const rootRes = await fetch(`${this.endpoint}/wp-json`);
      let siteName = 'WordPress Site';
      let detectedPlugin: 'yoast' | 'rankmath' | 'aioseo' | 'native' = 'native';

      if (rootRes.ok) {
        const rootData = await rootRes.json();
        siteName = rootData.name || siteName;
        const routes = Object.keys(rootData.routes || {});
        if (routes.some(r => r.includes('yoast'))) {
          detectedPlugin = 'yoast';
        } else if (routes.some(r => r.includes('rankmath'))) {
          detectedPlugin = 'rankmath';
        } else if (routes.some(r => r.includes('aioseo'))) {
          detectedPlugin = 'aioseo';
        }
      }

      this.detectedSeoPlugin = detectedPlugin;

      return {
        success: true,
        message: `Connected successfully to "${siteName}" as user "${userData.name || this.username}". Detected SEO engine: ${detectedPlugin.toUpperCase()}.`,
        siteName,
        detectedSeoPlugin: detectedPlugin
      };
    } catch (err) {
      return {
        success: false,
        message: `Network error connecting to WordPress: ${err instanceof Error ? err.message : String(err)}`
      };
    }
  }

  public async createOrUpdatePost(article: Article, publishStatus?: 'draft' | 'pending' | 'publish' | 'future'): Promise<WordPressPostResponse> {
    if (!this.isConnected()) {
      return {
        success: false,
        error: 'WordPress is not connected. Enter your WordPress credentials in Settings to publish drafts.'
      };
    }

    const checkUrl = SecurityValidator.isSafeUrl(this.endpoint);
    if (!checkUrl.safe) {
      return { success: false, error: `Security check blocked URL: ${checkUrl.reason}` };
    }

    const targetStatus = publishStatus || 'draft';

    // Prepare content with schema embedded cleanly
    let finalContent = article.content;
    if (article.jsonLdSchema) {
      finalContent += `\n\n<!-- AI SEO Content Studio JSON-LD Schema -->\n<script type="application/ld+json">\n${article.jsonLdSchema}\n</script>`;
    }

    // Build SEO metadata based on detected plugin
    const meta: Record<string, unknown> = {
      _aiseo_managed: '1',
      _aiseo_score: article.seoScore?.total || 0,
      _aiseo_keyword: article.brief?.primaryKeyword || '',
    };

    if (this.detectedSeoPlugin === 'yoast') {
      meta._yoast_wpseo_title = article.title;
      meta._yoast_wpseo_metadesc = article.metaDescription;
      meta._yoast_wpseo_focuskw = article.brief?.primaryKeyword || '';
    } else if (this.detectedSeoPlugin === 'rankmath') {
      meta.rank_math_title = article.title;
      meta.rank_math_description = article.metaDescription;
      meta.rank_math_focus_keyword = article.brief?.primaryKeyword || '';
    } else {
      meta._meta_description = article.metaDescription;
    }

    const payload: Record<string, unknown> = {
      title: article.title,
      slug: SecurityValidator.sanitizeSlug(article.slug || article.title),
      content: finalContent,
      status: targetStatus,
      excerpt: article.metaDescription,
      meta
    };

    try {
      const url = article.wordpressPostId
        ? `${this.endpoint}/wp-json/wp/v2/posts/${article.wordpressPostId}`
        : `${this.endpoint}/wp-json/wp/v2/posts`;

      const method = article.wordpressPostId ? 'POST' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          'Authorization': this.getAuthHeader(),
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        const errorText = await res.text();
        return {
          success: false,
          error: `WordPress post creation failed (HTTP ${res.status}): ${errorText}`
        };
      }

      const postData = await res.json();
      return {
        success: true,
        postId: postData.id,
        postUrl: postData.link,
        status: postData.status
      };
    } catch (err) {
      return {
        success: false,
        error: `Failed to create WordPress post due to network failure: ${err instanceof Error ? err.message : String(err)}`
      };
    }
  }

  public async fetchContentIndex(): Promise<WordPressExistingPost[]> {
    if (!this.isConnected()) return [];

    try {
      const res = await fetch(`${this.endpoint}/wp-json/wp/v2/posts?per_page=50&_fields=id,title,slug,link,excerpt,categories,tags`, {
        headers: {
          'Authorization': this.getAuthHeader(),
          'Content-Type': 'application/json'
        }
      });

      if (!res.ok) return [];

      const items = await res.json();
      return items.map((item: { id: number; title: { rendered: string }; slug: string; link: string; excerpt: { rendered: string } }) => ({
        id: item.id,
        title: item.title?.rendered?.replace(/<[^>]*>/g, '') || 'Untitled Post',
        slug: item.slug,
        url: item.link,
        excerpt: item.excerpt?.rendered?.replace(/<[^>]*>/g, '').trim() || '',
        categoryNames: [],
        tagNames: []
      }));
    } catch {
      return [];
    }
  }

  public async uploadMedia(fileBufferOrUrl: string, altText: string, filename: string): Promise<{ success: boolean; mediaId?: number; mediaUrl?: string; error?: string }> {
    if (!this.isConnected()) {
      return { success: false, error: 'WordPress is not connected.' };
    }

    try {
      let buffer: Buffer;
      if (fileBufferOrUrl.startsWith('data:')) {
        const base64Data = fileBufferOrUrl.split(',')[1];
        buffer = Buffer.from(base64Data, 'base64');
      } else if (fileBufferOrUrl.startsWith('http')) {
        const check = SecurityValidator.isSafeUrl(fileBufferOrUrl);
        if (!check.safe) return { success: false, error: check.reason };
        const fetched = await fetch(fileBufferOrUrl);
        const arrayBuf = await fetched.arrayBuffer();
        buffer = Buffer.from(arrayBuf);
      } else {
        return { success: false, error: 'Invalid media source.' };
      }

      const uploadRes = await fetch(`${this.endpoint}/wp-json/wp/v2/media`, {
        method: 'POST',
        headers: {
          'Authorization': this.getAuthHeader(),
          'Content-Disposition': `attachment; filename="${filename}"`,
          'Content-Type': 'image/jpeg'
        },
        body: buffer
      });

      if (!uploadRes.ok) {
        return { success: false, error: `Media upload failed (HTTP ${uploadRes.status})` };
      }

      const mediaData = await uploadRes.json();

      // Update alt text
      if (altText && mediaData.id) {
        await fetch(`${this.endpoint}/wp-json/wp/v2/media/${mediaData.id}`, {
          method: 'POST',
          headers: {
            'Authorization': this.getAuthHeader(),
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ alt_text: altText })
        });
      }

      return {
        success: true,
        mediaId: mediaData.id,
        mediaUrl: mediaData.source_url
      };
    } catch (err) {
      return {
        success: false,
        error: `Media upload network error: ${err instanceof Error ? err.message : String(err)}`
      };
    }
  }
}
