/**
 * SecurityValidator
 * Protects against Prompt Injection, SSRF, XSS, and Credential Exposure in logs.
 */

export class SecurityValidator {
  /**
   * Masks sensitive credentials like API keys, Passwords, and Tokens
   */
  public static maskCredentials(input: string): string {
    if (!input) return '';
    return input
      .replace(/(AIzaSy[A-Za-z0-9_-]{33})/g, 'AIzaSy****************')
      .replace(/(Bearer\s+)[A-Za-z0-9_.-]+/gi, '$1[MASKED_TOKEN]')
      .replace(/(["']?(?:apiKey|api_key|password|secret|access_token|authorization)["']?\s*[:=]\s*["']?)([^"'&\s]+)(["']?)/gi, '$1[REDACTED]$3');
  }

  /**
   * SSRF Protection: Validates if a URL is safe to fetch.
   * Blocks localhost, private IP ranges (RFC 1918), link-local, cloud metadata services.
   */
  public static isSafeUrl(rawUrl: string): { safe: boolean; reason?: string } {
    try {
      const parsed = new URL(rawUrl);
      if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
        return { safe: false, reason: `Disallowed protocol: ${parsed.protocol}. Only http/https supported.` };
      }

      const hostname = parsed.hostname.toLowerCase();

      // Check loopback & internal hostnames
      if (
        hostname === 'localhost' ||
        hostname === '127.0.0.1' ||
        hostname === '::1' ||
        hostname === '0.0.0.0' ||
        hostname.endsWith('.internal') ||
        hostname.endsWith('.local')
      ) {
        return { safe: false, reason: 'Localhost and internal domain lookups are blocked to prevent SSRF.' };
      }

      // Check GCP/AWS/Azure metadata IP
      if (hostname === '169.254.169.254' || hostname === 'metadata.google.internal') {
        return { safe: false, reason: 'Cloud instance metadata access is strictly blocked.' };
      }

      // IPv4 private ranges check
      const ipv4Regex = /^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/;
      const match = hostname.match(ipv4Regex);
      if (match) {
        const [ , b1, b2 ] = match.map(Number);
        if (b1 === 10) return { safe: false, reason: '10.0.0.0/8 private network address blocked.' };
        if (b1 === 172 && b2 >= 16 && b2 <= 31) return { safe: false, reason: '172.16.0.0/12 private network address blocked.' };
        if (b1 === 192 && b2 === 168) return { safe: false, reason: '192.168.0.0/16 private network address blocked.' };
        if (b1 === 127) return { safe: false, reason: '127.0.0.0/8 loopback address blocked.' };
        if (b1 === 169 && b2 === 254) return { safe: false, reason: '169.254.0.0/16 link-local address blocked.' };
      }

      return { safe: true };
    } catch {
      return { safe: false, reason: 'Invalid URL format.' };
    }
  }

  /**
   * Sanitizes external research input to mitigate prompt injection.
   * Treats external text as passive data, removes injection attempts.
   */
  public static sanitizeExternalResearch(text: string, maxLength = 8000): string {
    if (!text) return '';
    let truncated = text.slice(0, maxLength);

    // Neutralize common injection triggers
    const injectionPatterns = [
      /ignore\s+(all\s+)?(previous|prior|above)\s+(instructions|prompts)/gi,
      /reveal\s+(the\s+)?(api\s+key|password|secret|credentials|token)/gi,
      /you\s+are\s+now\s+(in\s+developer\s+mode|unrestricted)/gi,
      /system\s*:\s*override/gi,
      /<\/?system>/gi,
      /<\/?admin>/gi
    ];

    for (const pattern of injectionPatterns) {
      truncated = truncated.replace(pattern, '[REMOVED_SUSPICIOUS_PHRASE]');
    }

    return truncated;
  }

  /**
   * Sanitizes HTML for preview and storage, stripping dangerous tags
   */
  public static sanitizeHtml(html: string): string {
    if (!html) return '';
    return html
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
      .replace(/on\w+\s*=\s*(["'][^"']*["']|[^\s>]+)/gi, '')
      .replace(/javascript:/gi, '');
  }

  /**
   * Validates slug according to SEO rules
   */
  public static sanitizeSlug(slug: string): string {
    return slug
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9-]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
  }
}
