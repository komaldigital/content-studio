/**
 * MultiChannelPublisherService
 * Coordinates multi-channel syndication across WordPress, Facebook, Pinterest, and Instagram.
 * Provides automated caption optimization, hashtag generation, and resilient execution.
 */

import {
  Article,
  MultiChannelPublishRequest,
  MultiChannelPublishResult,
  FacebookPostData,
  InstagramPostData,
  PinterestPinData
} from '../../types.js';
import { DataStore } from '../storage/Store.js';
import { WordPressProviderInterface } from '../wordpress/WordPressProviderInterface.js';
import { FacebookProviderInterface } from '../facebook/FacebookProviderInterface.js';
import { PinterestProviderInterface } from '../pinterest/PinterestProviderInterface.js';
import { InstagramProviderInterface } from '../instagram/InstagramProviderInterface.js';

export class MultiChannelPublisherService {
  constructor(
    private store: DataStore,
    private wpProvider: WordPressProviderInterface,
    private fbProvider: FacebookProviderInterface,
    private pinProvider: PinterestProviderInterface,
    private igProvider: InstagramProviderInterface
  ) {}

  public async publishToAll(req: MultiChannelPublishRequest): Promise<MultiChannelPublishResult> {
    const article = this.store.articles.get(req.articleId);
    if (!article) {
      throw new Error(`Article with ID "${req.articleId}" not found.`);
    }

    const result: MultiChannelPublishResult = {
      success: true,
      articleId: article.id,
      publishedCount: 0,
      channels: {}
    };

    const primaryImage = article.featuredImage?.url || (article.articleImages && article.articleImages[0]?.url) || 'https://upload.wikimedia.org/wikipedia/commons/0/0a/Sourdough.jpg';
    let liveArticleUrl = article.wordpressUrl || `${this.store.settings.brand.websiteUrl}/${article.slug}`;

    // ----------------------------------------------------
    // 1. WORDPRESS PUBLISHING
    // ----------------------------------------------------
    if (req.channels.wordpress) {
      result.channels.wordpress = { attempted: true, success: false };
      try {
        const wpCustom = req.customizations?.wordpress || {};
        const targetStatus = wpCustom.status || this.store.settings.wordpress.defaultPostStatus || 'draft';

        const wpRes = await this.wpProvider.createOrUpdatePost(article, targetStatus);

        if (wpRes.success && wpRes.postId) {
          result.channels.wordpress.success = true;
          result.channels.wordpress.status = targetStatus;
          result.channels.wordpress.postId = wpRes.postId;
          result.channels.wordpress.url = wpRes.postUrl;
          result.publishedCount++;

          if (wpRes.postUrl) {
            liveArticleUrl = wpRes.postUrl;
          }

          article.wordpressStatus = targetStatus === 'publish' ? 'publish' : 'draft';
          article.wordpressPostId = wpRes.postId;
          if (wpRes.postUrl) article.wordpressUrl = wpRes.postUrl;

          this.store.addLog('info', 'wordpress', `WordPress publish success for "${article.title}" (Status: ${targetStatus}, ID: ${wpRes.postId})`, {
            postId: wpRes.postId,
            url: wpRes.postUrl
          });
        } else {
          result.channels.wordpress.error = wpRes.error || 'WordPress publication failed.';
          this.store.addLog('warn', 'wordpress', `WordPress publish failed for "${article.title}": ${result.channels.wordpress.error}`);
        }
      } catch (err) {
        result.channels.wordpress.error = err instanceof Error ? err.message : String(err);
        this.store.addLog('error', 'wordpress', `WordPress error: ${result.channels.wordpress.error}`);
      }
    }

    // ----------------------------------------------------
    // 2. FACEBOOK PAGE PUBLISHING
    // ----------------------------------------------------
    if (req.channels.facebook) {
      result.channels.facebook = { attempted: true, success: false };
      try {
        const fbCustom = req.customizations?.facebook || {};
        const fbHashtags = (this.store.settings.facebook.defaultHashtags || ['#seo', '#content']).join(' ');
        
        // Build optimized Facebook copy if not custom
        const defaultFbMessage = fbCustom.message || [
          `📖 ${article.title}`,
          '',
          article.metaDescription || (article.sections && article.sections[0]?.content.slice(0, 160) + '...'),
          '',
          `👉 Read the full step-by-step guide: ${liveArticleUrl}`,
          '',
          fbHashtags
        ].join('\n');

        const fbPostData: FacebookPostData = {
          message: defaultFbMessage,
          link: liveArticleUrl,
          imageUrl: fbCustom.imageUrl || primaryImage,
          status: 'draft'
        };

        const fbRes = await this.fbProvider.createPost(fbPostData);

        if (fbRes.success) {
          result.channels.facebook.success = true;
          result.channels.facebook.postId = fbRes.postId;
          result.channels.facebook.url = fbRes.postUrl;
          result.publishedCount++;

          fbPostData.status = 'published';
          fbPostData.publishedAt = new Date().toISOString();
          fbPostData.postId = fbRes.postId;
          fbPostData.postUrl = fbRes.postUrl;
          article.facebookPost = fbPostData;

          this.store.addLog('info', 'facebook', `Facebook post published for "${article.title}"`, {
            postId: fbRes.postId,
            url: fbRes.postUrl
          });
        } else {
          result.channels.facebook.error = fbRes.error || 'Facebook post failed.';
          fbPostData.status = 'failed';
          fbPostData.error = fbRes.error;
          article.facebookPost = fbPostData;

          this.store.addLog('warn', 'facebook', `Facebook post failed for "${article.title}": ${fbRes.error}`);
        }
      } catch (err) {
        result.channels.facebook.error = err instanceof Error ? err.message : String(err);
        this.store.addLog('error', 'facebook', `Facebook error: ${result.channels.facebook.error}`);
      }
    }

    // ----------------------------------------------------
    // 3. PINTEREST PIN PUBLISHING
    // ----------------------------------------------------
    if (req.channels.pinterest) {
      result.channels.pinterest = { attempted: true, success: false };
      try {
        const pinCustom = req.customizations?.pinterest || {};
        const boardId = pinCustom.boardId || this.store.settings.pinterest.selectedBoardId || (this.store.settings.pinterest.boards[0]?.id || '');

        const pinData: PinterestPinData = {
          id: 'pin_' + Date.now(),
          title: (pinCustom.title || article.title).slice(0, 100),
          description: (pinCustom.description || `${article.metaDescription} Read the complete tutorial and tips now.`).slice(0, 500),
          destinationUrl: pinCustom.destinationUrl || liveArticleUrl,
          boardId,
          keywords: article.tags || [article.brief.primaryKeyword],
          cta: this.store.settings.brand.defaultCta || 'Save This Guide',
          imageUrl: pinCustom.imageUrl || primaryImage,
          status: 'draft',
          graphicConfig: article.pinterestPin?.graphicConfig || {
            templateId: 'template-1',
            headline: article.title,
            brandName: this.store.settings.brand.brandName || 'AI Content Studio',
            primaryColor: this.store.settings.brand.primaryColor || '#059669',
            secondaryColor: '#0f172a',
            textColor: '#ffffff',
            ctaText: this.store.settings.brand.defaultCta || 'Save This Guide',
            imageUrl: pinCustom.imageUrl || primaryImage,
            fontFamily: 'Plus Jakarta Sans'
          }
        };

        const pinRes = await this.pinProvider.createPin(pinData);

        if (pinRes.success) {
          result.channels.pinterest.success = true;
          result.channels.pinterest.pinId = pinRes.pinId;
          result.channels.pinterest.url = pinRes.url;
          result.publishedCount++;

          pinData.status = 'published';
          pinData.publishedAt = new Date().toISOString();
          pinData.pinId = pinRes.pinId;
          article.pinterestPin = pinData;

          this.store.addLog('info', 'pinterest', `Pinterest pin created for "${article.title}"`, {
            pinId: pinRes.pinId,
            url: pinRes.url
          });
        } else {
          result.channels.pinterest.error = pinRes.error || 'Pinterest pin creation failed.';
          pinData.status = 'failed';
          pinData.error = pinRes.error;
          article.pinterestPin = pinData;

          this.store.addLog('warn', 'pinterest', `Pinterest failed for "${article.title}": ${pinRes.error}`);
        }
      } catch (err) {
        result.channels.pinterest.error = err instanceof Error ? err.message : String(err);
        this.store.addLog('error', 'pinterest', `Pinterest error: ${result.channels.pinterest.error}`);
      }
    }

    // ----------------------------------------------------
    // 4. INSTAGRAM BUSINESS PUBLISHING
    // ----------------------------------------------------
    if (req.channels.instagram) {
      result.channels.instagram = { attempted: true, success: false };
      try {
        const igCustom = req.customizations?.instagram || {};
        const igHashtags = (this.store.settings.instagram.defaultHashtags || ['#lifestyle', '#inspo', '#learn']).join(' ');

        const defaultIgCaption = igCustom.caption || [
          `✨ ${article.title.toUpperCase()}`,
          '',
          article.metaDescription || (article.sections && article.sections[0]?.content.slice(0, 160) + '...'),
          '',
          `💡 Key takeaway: Explore expert methods, actionable frameworks, and essential answers in our new feature.`,
          '',
          `🔗 Tap the link in our bio for the complete deep dive: ${liveArticleUrl}`,
          '',
          `---`,
          igHashtags
        ].join('\n');

        const igPostData: InstagramPostData = {
          caption: defaultIgCaption,
          imageUrl: igCustom.imageUrl || primaryImage,
          aspectRatio: igCustom.aspectRatio || '1:1',
          status: 'draft'
        };

        const igRes = await this.igProvider.createPost(igPostData);

        if (igRes.success) {
          result.channels.instagram.success = true;
          result.channels.instagram.mediaId = igRes.mediaId;
          result.channels.instagram.url = igRes.permalink;
          result.publishedCount++;

          igPostData.status = 'published';
          igPostData.publishedAt = new Date().toISOString();
          igPostData.mediaId = igRes.mediaId;
          igPostData.permalink = igRes.permalink;
          article.instagramPost = igPostData;

          this.store.addLog('info', 'instagram', `Instagram post published for "${article.title}"`, {
            mediaId: igRes.mediaId,
            url: igRes.permalink
          });
        } else {
          result.channels.instagram.error = igRes.error || 'Instagram publish failed.';
          igPostData.status = 'failed';
          igPostData.error = igRes.error;
          article.instagramPost = igPostData;

          this.store.addLog('warn', 'instagram', `Instagram failed for "${article.title}": ${igRes.error}`);
        }
      } catch (err) {
        result.channels.instagram.error = err instanceof Error ? err.message : String(err);
        this.store.addLog('error', 'instagram', `Instagram error: ${result.channels.instagram.error}`);
      }
    }

    // Update article in memory store
    article.updatedAt = new Date().toISOString();
    this.store.articles.set(article.id, article);

    // Check overall outcome: if any requested channel failed, report false on overall success flag but return all channel details
    const requestedChannels = Object.entries(req.channels).filter(([, enabled]) => enabled);
    const hasFailures = requestedChannels.some(([ch]) => {
      const chResult = result.channels[ch as keyof typeof result.channels];
      return chResult?.attempted && !chResult.success;
    });

    result.success = !hasFailures;
    result.article = article;

    this.store.addLog(
      result.success ? 'info' : 'warn',
      'multi_publish',
      `Multi-channel syndication completed for "${article.title}": ${result.publishedCount}/${requestedChannels.length} channels published.`,
      { result }
    );

    return result;
  }
}
