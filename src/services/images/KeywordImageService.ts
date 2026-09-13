/**
 * KeywordImageService
 * Ensures all generated images are strictly and directly related to the article topic,
 * target keyword, and specific section headings.
 * 
 * Strategy:
 * 1. Primary: Authentic real-world photographs from Wikimedia Commons Public Domain media API matching the keyword.
 * 2. Secondary: High-fidelity AI generative visuals from Pollinations AI (Turbo model) directly prompted with the keyword.
 * 3. Search: Interactive keyword photo search endpoint allowing users to search and swap images instantly.
 */

export interface KeywordImageResult {
  url: string;
  title: string;
  altText: string;
  source: 'wikimedia' | 'pollinations' | 'custom';
}

export class KeywordImageService {
  private static userAgent = 'AISEOStudio/1.0 (https://github.com/google/ai-studio)';

  /**
   * Clean and extract the most relevant search keywords from heading and topic.
   */
  public static extractKeywords(topic: string, sectionHeading?: string): string[] {
    const candidates: string[] = [];

    // Clean text: strip markdown hashes, numbered steps (e.g. "Step 1:"), questions, punctuation
    const cleanHeading = (sectionHeading || '')
      .replace(/^#+\s*/, '')
      .replace(/^(?:step|phase|part|\d+[\.\)]|\#\d+)\s*:?\s*/i, '')
      .replace(/^(?:how to|why|what is|when to|tips for|guide to)\s+/i, '')
      .replace(/[^\w\s-]/g, ' ')
      .trim();

    const cleanTopic = (topic || '')
      .replace(/^(?:how to|why|what is|when to|tips for|guide to)\s+/i, '')
      .replace(/[^\w\s-]/g, ' ')
      .trim();

    // 1. Combined clean heading + topic keywords (e.g. "sourdough starter sourdough bread")
    if (cleanHeading && cleanTopic) {
      candidates.push(`${cleanHeading} ${cleanTopic}`);
      candidates.push(cleanHeading);
    }

    // 2. Just clean topic
    if (cleanTopic) {
      candidates.push(cleanTopic);
    }

    // 3. Fallback: split heading into strong nouns/words
    if (cleanHeading) {
      const meaningfulWords = cleanHeading
        .split(/\s+/)
        .filter(w => w.length > 3 && !['with', 'your', 'from', 'this', 'that', 'make', 'doing', 'into', 'over'].includes(w.toLowerCase()));
      if (meaningfulWords.length > 0) {
        candidates.push(meaningfulWords.join(' '));
      }
    }

    return Array.from(new Set(candidates)).filter(Boolean);
  }

  /**
   * Searches Wikimedia Commons for authentic, high-resolution photographs matching a query.
   */
  public static async searchWikimediaImages(query: string, limit: number = 6): Promise<KeywordImageResult[]> {
    try {
      const endpoint = `https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrnamespace=6&gsrsearch=${encodeURIComponent(
        query
      )}&gsrlimit=${limit * 2}&prop=imageinfo&iiprop=url|size|extmetadata&format=json`;

      const response = await fetch(endpoint, {
        headers: {
          'User-Agent': this.userAgent,
          'Accept': 'application/json'
        },
        signal: AbortSignal.timeout(4000)
      });

      if (!response.ok) return [];

      const data = await response.json();
      const pages = Object.values((data as any).query?.pages || {});
      const results: KeywordImageResult[] = [];

      for (const page of pages as any[]) {
        const info = page.imageinfo?.[0];
        if (!info?.url) continue;

        const url = info.url;
        // Verify valid image format: jpg, jpeg, png, webp
        if (!/\.(jpe?g|png|webp)(\?|$)/i.test(url)) continue;

        // Skip non-photographic icon banners or tiny thumbnails
        if (info.width && info.width < 400) continue;

        const rawTitle = (page.title || '').replace(/^File:\s*/i, '').replace(/\.[^.]+$/, '').replace(/_/g, ' ');
        const desc = info.extmetadata?.ImageDescription?.value?.replace(/<[^>]*>/g, '').trim();

        results.push({
          url,
          title: rawTitle,
          altText: desc && desc.length < 120 ? desc : `${rawTitle} related to ${query}`,
          source: 'wikimedia'
        });

        if (results.length >= limit) break;
      }

      return results;
    } catch {
      return [];
    }
  }

  /**
   * Constructs an AI-generated image URL via Pollinations Turbo that directly represents the exact keyword.
   */
  public static buildPollinationsUrl(keywordPrompt: string, width: number = 1200, height: number = 675): string {
    // Build a crisp photorealistic prompt directly grounded in the keyword
    const clean = keywordPrompt
      .replace(/[^\w\s-]/g, ' ')
      .trim()
      .slice(0, 150);

    const fullPrompt = `${clean}, professional editorial photography, sharp focus, natural lighting, high resolution`;
    return `https://image.pollinations.ai/prompt/${encodeURIComponent(fullPrompt)}?width=${width}&height=${height}&model=turbo&nologo=true`;
  }

  /**
   * Finds the best keyword-matched image for a given topic and section.
   * Tries Wikimedia first for real photographs; falls back to targeted Pollinations Turbo AI.
   */
  public static async getKeywordMatchedImage(options: {
    topic: string;
    sectionHeading?: string;
    searchIntentMatch?: string;
    prompt?: string;
    width?: number;
    height?: number;
  }): Promise<{ url: string; altText: string; source: 'wikimedia' | 'pollinations' }> {
    const width = options.width || 1200;
    const height = options.height || 675;
    const searchTerms = this.extractKeywords(options.topic, options.sectionHeading);

    // 1. Try Wikimedia Commons search for each search term candidate
    for (const term of searchTerms) {
      const wikiImages = await this.searchWikimediaImages(term, 3);
      if (wikiImages.length > 0) {
        const chosen = wikiImages[0];
        return {
          url: chosen.url,
          altText: chosen.altText || `${options.sectionHeading || options.topic} authentic visual illustration`,
          source: 'wikimedia'
        };
      }
    }

    // 2. Fallback: High-resolution Pollinations Turbo AI directly prompted with the keyword
    const promptBase = options.prompt || `${options.sectionHeading || options.topic} ${options.searchIntentMatch || ''}`;
    const url = this.buildPollinationsUrl(promptBase, width, height);

    return {
      url,
      altText: `High-resolution visual representing ${options.sectionHeading || options.topic}`,
      source: 'pollinations'
    };
  }
}
