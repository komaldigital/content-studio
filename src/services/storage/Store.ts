/**
 * Store - Central In-Memory / File backed Data Store
 * Keeps articles, jobs, content calendar, topical clusters, and logs.
 */

import fs from 'fs';
import path from 'path';
import {
  Article,
  Job,
  ContentCalendarItem,
  TopicClusterNode,
  LogEntry,
  AppSettings,
  DiscoveredKeyword,
  GeneratedImageItem
} from '../../types.js';

const DATA_DIR = path.join(process.cwd(), '.data');
const SETTINGS_FILE = path.join(DATA_DIR, 'settings.json');
const ARTICLES_FILE = path.join(DATA_DIR, 'articles.json');

export class DataStore {
  private static instance: DataStore;

  public articles: Map<string, Article> = new Map();
  public jobs: Map<string, Job> = new Map();
  public calendar: Map<string, ContentCalendarItem> = new Map();
  public clusters: Map<string, TopicClusterNode> = new Map();
  public savedKeywords: Map<string, DiscoveredKeyword> = new Map();
  public imageGallery: GeneratedImageItem[] = [];
  public logs: LogEntry[] = [];
  public settings: AppSettings;

  private constructor() {
    this.settings = {
      activeModel: 'gemini-3.8-flash',
      byok: {
        geminiApiKey: process.env.GEMINI_API_KEY || '',
        openaiApiKey: process.env.OPENAI_API_KEY || '',
        anthropicApiKey: process.env.ANTHROPIC_API_KEY || '',
        openrouterApiKey: process.env.OPENROUTER_API_KEY || '',
        straicoApiKey: process.env.STRAICO_API_KEY || '',
        perplexityApiKey: process.env.PERPLEXITY_API_KEY || ''
      },
      gemini: {
        model: 'gemini-3.8-flash',
        maxOutputTokens: 8192,
        temperature: 0.5,
        topP: 0.95,
        thinkingLevel: 'LOW'
      },
      research: {
        provider: 'google-grounding',
        enableLiveSearch: true
      },
      images: {
        provider: 'seedream-4.5',
        primaryModel: 'bytedance-seed/seedream-4.5',
        defaultStyle: 'photorealistic',
        resolution: '2K',
        enableIntentMatching: true
      },
      costControls: {
        maxArticlesPerDay: 50,
        maxImagesPerArticle: 5,
        maxRewritePasses: 3,
        maxBulkJobs: 50
      },
      brand: {
        brandName: 'AI SEO Content Studio',
        websiteUrl: 'https://aiseo-studio.example.com',
        primaryColor: '#059669',
        secondaryColor: '#0f172a',
        font: 'Plus Jakarta Sans',
        defaultCta: 'Save This Guide'
      },
      brandVoices: [
        {
          id: 'voice_expert',
          name: 'Authoritative Industry Leader',
          description: 'Data-grounded, confident, expert analysis without hype or filler. Optimized for Google EEAT and AI citations.',
          tone: 'authoritative',
          pointOfView: 'third_person',
          readingGradeLevel: 'college',
          forbiddenPhrases: [
            "In today's fast-paced digital world",
            "game changer",
            "look no further",
            "delve into",
            "testament to",
            "without further ado"
          ],
          requiredPhrases: [],
          sentenceStyle: 'balanced',
          customSystemInstructions: 'Prioritize empirical evidence, benchmark statistics, clear definitions, and direct answers in the first 2 sentences of each section. Avoid rhetorical filler.',
          isDefault: true
        },
        {
          id: 'voice_conversational',
          name: 'Conversational Practical Mentor',
          description: 'Friendly, encouraging, action-driven tone using "you". Perfect for tutorials, recipes, and beginner guides.',
          tone: 'conversational',
          pointOfView: 'second_person',
          readingGradeLevel: 'middle_school',
          forbiddenPhrases: [
            "furthermore",
            "moreover",
            "in conclusion",
            "it is imperative that"
          ],
          requiredPhrases: [],
          sentenceStyle: 'punchy_short',
          customSystemInstructions: 'Speak directly to the reader as an encouraging senior colleague. Use short, scannable paragraphs and relatable analogies.',
          isDefault: false
        },
        {
          id: 'voice_b2b',
          name: 'Punchy B2B & ROI Strategist',
          description: 'Executive-level brevity with quantified outcomes, tactical frameworks, and commercial viability.',
          tone: 'professional',
          pointOfView: 'third_person',
          readingGradeLevel: 'high_school',
          forbiddenPhrases: [
            "supercharge",
            "unleash",
            "next-level",
            "mind-blowing"
          ],
          requiredPhrases: [],
          sentenceStyle: 'punchy_short',
          customSystemInstructions: 'Focus on business metrics, cost trade-offs, step-by-step implementation frameworks, and concrete case studies.',
          isDefault: false
        },
        {
          id: 'voice_reviewer',
          name: 'Unbiased Hands-On Reviewer',
          description: 'Authentic 1st-person testing perspective highlighting genuine pros, cons, tradeoffs, and edge cases.',
          tone: 'instructional',
          pointOfView: 'first_person_plural',
          readingGradeLevel: 'high_school',
          forbiddenPhrases: [
            "perfect in every way",
            "cannot be beaten"
          ],
          requiredPhrases: [],
          sentenceStyle: 'narrative',
          customSystemInstructions: 'Present balanced comparisons with concrete test benchmarks, measurement numbers, and realistic failure points.',
          isDefault: false
        }
      ],
      activeBrandVoiceId: 'voice_expert',
      sitemap: {
        sitemapUrl: 'https://example.com/sitemap.xml',
        lastFetched: new Date().toISOString(),
        autoExtractUrls: true,
        maxLinksPerArticle: 4,
        openLinksInNewTab: false,
        addNofollowToExternal: true,
        entries: [
          {
            url: 'https://example.com/guides/complete-seo-strategy',
            title: 'Complete SEO Strategy & Topical Authority Guide',
            slug: 'complete-seo-strategy',
            category: 'SEO',
            topicKeywords: ['seo strategy', 'topical authority', 'search rankings', 'content optimization'],
            tier: 'pillar',
            priority: 1.0,
            lastmod: '2025-01-15'
          },
          {
            url: 'https://example.com/guides/keyword-research-foundations',
            title: 'Keyword Research Foundations for Modern Search',
            slug: 'keyword-research-foundations',
            category: 'SEO',
            topicKeywords: ['keyword research', 'search intent', 'long tail keywords', 'serp analysis'],
            tier: 'cluster',
            priority: 0.8,
            lastmod: '2025-02-01'
          },
          {
            url: 'https://example.com/guides/generative-engine-optimization',
            title: 'Generative Engine Optimization (GEO): Getting Cited by AI Search Engines',
            slug: 'generative-engine-optimization',
            category: 'AI SEO',
            topicKeywords: ['generative engine optimization', 'geo', 'ai citations', 'perplexity search', 'chatgpt citations'],
            tier: 'cluster',
            priority: 0.9,
            lastmod: '2025-02-10'
          },
          {
            url: 'https://example.com/guides/internal-linking-mastery',
            title: 'Internal Linking Mastery: How to Build Topic Clusters That Rank',
            slug: 'internal-linking-mastery',
            category: 'SEO',
            topicKeywords: ['internal linking', 'topic clusters', 'site architecture', 'anchor text'],
            tier: 'supporting',
            priority: 0.7,
            lastmod: '2025-02-18'
          },
          {
            url: 'https://example.com/guides/high-converting-featured-images',
            title: 'Creating High-Converting Visuals & Infographics for Articles',
            slug: 'high-converting-featured-images',
            category: 'Content',
            topicKeywords: ['featured images', 'article visuals', 'infographics', 'visual seo'],
            tier: 'supporting',
            priority: 0.6,
            lastmod: '2025-02-22'
          }
        ]
      },
      automations: {
        enabled: false,
        publishingCadence: 'daily',
        articlesPerDay: 2,
        defaultStatus: 'draft',
        autoGenerateImages: true,
        enforceBrandVoiceId: 'voice_expert',
        enforceInternalLinking: true,
        timeWindowStart: '09:00',
        timeWindowEnd: '18:00',
        nextScheduledRun: new Date(Date.now() + 86400000).toISOString(),
        recentAutomationLogs: [
          {
            id: 'log_auto_1',
            timestamp: new Date(Date.now() - 3600000 * 12).toISOString(),
            action: 'Automated Draft Generation',
            articleTitle: 'Top 10 High-Protein Meal Prep Recipes',
            status: 'success',
            details: 'Article generated with 4 intent visuals, 3 internal sitemap links, and published to WordPress as draft.'
          },
          {
            id: 'log_auto_2',
            timestamp: new Date(Date.now() - 3600000 * 36).toISOString(),
            action: 'Automated Draft Generation',
            articleTitle: 'Cast Iron Skillet Restoration Guide',
            status: 'success',
            details: 'SEO score 94/100, verified citations added from live sources.'
          }
        ]
      },
      wordpress: {
        endpoint: '',
        username: '',
        isConnected: false,
        defaultPostStatus: 'draft',
        autoPublish: false,
        detectedSeoPlugin: 'native'
      },
      pinterest: {
        isConnected: false,
        boards: [
          { id: 'b_chicken', name: 'Easy Chicken Recipes' },
          { id: 'b_mealprep', name: 'Weekly Meal Prep' },
          { id: 'b_dinner', name: 'Quick 30-Minute Dinners' }
        ]
      },
      facebook: {
        isConnected: false,
        pageId: '',
        pageName: '',
        autoPostOnPublish: false,
        defaultHashtags: ['#recipes', '#foodie', '#homecooking', '#dinnerideas']
      },
      instagram: {
        isConnected: false,
        instagramAccountId: '',
        accountUsername: '',
        autoPostOnPublish: false,
        defaultHashtags: ['#easyrecipes', '#dinnerinspo', '#cookingathome', '#foodbloggers']
      },
      testMode: false
    };

    this.seedInitialData();
    this.loadPersistedSettings();
    this.loadPersistedArticles();
  }

  public static getInstance(): DataStore {
    if (!DataStore.instance) {
      DataStore.instance = new DataStore();
    }
    return DataStore.instance;
  }

  public loadPersistedSettings(): void {
    try {
      if (fs.existsSync(SETTINGS_FILE)) {
        const raw = fs.readFileSync(SETTINGS_FILE, 'utf8');
        const parsed = JSON.parse(raw);
        if (parsed && typeof parsed === 'object') {
          this.settings = {
            ...this.settings,
            ...parsed,
            byok: {
              ...this.settings.byok,
              ...(parsed.byok || {})
            },
            gemini: {
              ...this.settings.gemini,
              ...(parsed.gemini || {})
            },
            research: {
              ...this.settings.research,
              ...(parsed.research || {})
            },
            images: {
              ...this.settings.images,
              ...(parsed.images || {})
            },
            wordpress: {
              ...this.settings.wordpress,
              ...(parsed.wordpress || {})
            },
            pinterest: {
              ...this.settings.pinterest,
              ...(parsed.pinterest || {})
            },
            facebook: {
              ...this.settings.facebook,
              ...(parsed.facebook || {})
            },
            instagram: {
              ...this.settings.instagram,
              ...(parsed.instagram || {})
            }
          };
          console.log('[DataStore] Loaded persisted settings & API keys from disk.');
        }
      }
    } catch (e) {
      console.warn('[DataStore] Could not load persisted settings:', e);
    }

    // Ensure environment variables serve as active fallbacks if not explicitly set in byok
    if (!this.settings.byok.geminiApiKey && process.env.GEMINI_API_KEY) {
      this.settings.byok.geminiApiKey = process.env.GEMINI_API_KEY;
    }
    if (!this.settings.byok.openrouterApiKey && process.env.OPENROUTER_API_KEY) {
      this.settings.byok.openrouterApiKey = process.env.OPENROUTER_API_KEY;
    }
    if (!this.settings.byok.openaiApiKey && process.env.OPENAI_API_KEY) {
      this.settings.byok.openaiApiKey = process.env.OPENAI_API_KEY;
    }
    if (!this.settings.byok.anthropicApiKey && process.env.ANTHROPIC_API_KEY) {
      this.settings.byok.anthropicApiKey = process.env.ANTHROPIC_API_KEY;
    }
    if (!this.settings.byok.straicoApiKey && process.env.STRAICO_API_KEY) {
      this.settings.byok.straicoApiKey = process.env.STRAICO_API_KEY;
    }
    if (!this.settings.byok.perplexityApiKey && process.env.PERPLEXITY_API_KEY) {
      this.settings.byok.perplexityApiKey = process.env.PERPLEXITY_API_KEY;
    }
  }

  public saveSettings(): void {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }
      fs.writeFileSync(SETTINGS_FILE, JSON.stringify(this.settings, null, 2), 'utf8');
      console.log('[DataStore] Successfully persisted settings & API keys to disk.');
    } catch (e) {
      console.error('[DataStore] Failed to persist settings to disk:', e);
    }
  }

  public loadPersistedArticles(): void {
    try {
      if (fs.existsSync(ARTICLES_FILE)) {
        const raw = fs.readFileSync(ARTICLES_FILE, 'utf8');
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          for (const item of parsed) {
            if (item && item.id) {
              this.articles.set(item.id, item);
            }
          }
          console.log(`[DataStore] Loaded ${parsed.length} persisted articles from disk.`);
        }
      }
    } catch (e) {
      console.warn('[DataStore] Could not load persisted articles:', e);
    }
  }

  public saveArticles(): void {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }
      const allArticles = Array.from(this.articles.values());
      fs.writeFileSync(ARTICLES_FILE, JSON.stringify(allArticles, null, 2), 'utf8');
    } catch (e) {
      console.error('[DataStore] Failed to persist articles to disk:', e);
    }
  }

  public addLog(level: 'info' | 'warn' | 'error', category: LogEntry['category'], message: string, metadata?: Record<string, unknown>) {
    const entry: LogEntry = {
      id: 'log_' + Math.random().toString(36).substring(2, 9),
      timestamp: new Date().toISOString(),
      level,
      category,
      message,
      metadata
    };
    this.logs.unshift(entry);
    if (this.logs.length > 500) this.logs.pop();
  }

  private seedInitialData() {
    // Seed an initial rich article for "easy chicken dinner recipes"
    const sampleArticleId = 'art_sample_1';
    const sampleArticle: Article = {
      id: sampleArticleId,
      title: 'Easy Chicken Dinner Recipes: 7 Fast Weeknight Meals for Busy Families',
      slug: 'easy-chicken-dinner-recipes',
      metaDescription: 'Discover 7 easy chicken dinner recipes ready in under 35 minutes. Includes foolproof searing tips, one-pan cleanup, and healthy side pairings.',
      wordCount: 1650,
      readingTimeMinutes: 7,
      content: `# Easy Chicken Dinner Recipes: 7 Fast Weeknight Meals for Busy Families

When 6:00 PM rolls around on a busy weeknight, having a dependable roster of chicken dinner recipes can transform dinnertime stress into a satisfying, flavorful meal. Chicken breast and boneless thighs are culinary blank canvases—lean, quick-cooking, and readily absorbing bold spices and pan sauces.

In this practical guide, we cover seven tested chicken dinners that take 35 minutes or less from cutting board to table, requiring standard kitchen tools and everyday pantry staples.

---

## Quick Reference: Cook Time & Flavor Profiles

| Recipe Name | Cook Time | Primary Method | Flavor Profile | Best Side Pairing |
| :--- | :--- | :--- | :--- | :--- |
| **Garlic Herb Butter Skillet** | 20 mins | Stovetop Sear | Savory & herbaceous | Steamed asparagus or rice |
| **Sheet Pan Lemon Rosemary** | 30 mins | Oven Roast | Bright & aromatic | Roasted baby potatoes |
| **Crispy Parmesan Crusted** | 25 mins | Shallow Fry / Bake | Rich & golden | Garden side salad |
| **Honey Mustard Glazed Tenders** | 15 mins | Stovetop Glaze | Tangy & sweet | Roasted broccoli |
| **Creamy Sun-Dried Tomato** | 25 mins | One-Skillet Simmer | Velvet garlic cream | Fettuccine or zucchini noodles |
| **20-Minute Chicken Fajitas** | 20 mins | High-Heat Sauté | Smoky & zesty | Warm corn tortillas |
| **Teriyaki Ginger Stir-Fry** | 18 mins | Wok / Skillet | Umami & gingery | Jasmine rice |

---

## 3 Foundational Rules for Juicier Weeknight Chicken

Before diving into individual recipes, mastering three basic culinary principles will guarantee your poultry never turns out dry or rubbery:

1. **Even Out Thickness**: Place boneless chicken breasts between two sheets of parchment paper and gently pound the thicker end with a rolling pin or meat mallet to an even 3/4-inch thickness. This prevents the tapered end from drying out while the thickest portion reaches safe internal temperature.
2. **Pat Thoroughly Dry**: Moisture is the enemy of browning. Use a paper towel to dry chicken thoroughly before seasoning; this triggers the Maillard reaction for a golden, flavor-packed crust.
3. **Verify Internal Temp, Don't Guess**: Remove chicken from heat the moment an instant-read meat thermometer registers **165°F (74°C)** in the thickest part. Allow 5 minutes of resting time on a cutting board so juices redistribute rather than pooling onto the plate.

---

## 1. 20-Minute Garlic Herb Butter Skillet Chicken

This one-skillet favorite delivers golden browned exterior and a rich, pan-deglazed butter sauce infused with fresh thyme and rosemary.

### Ingredients Checklist
- 1.5 lbs boneless skinless chicken breasts (halved horizontally into cutlets)
- 2 tablespoons extra virgin olive oil
- 3 tablespoons unsalted butter
- 4 cloves garlic, minced
- 1 tablespoon fresh rosemary and thyme, finely chopped
- Salt and freshly cracked black pepper to taste

### Preparation Steps
1. Season chicken cutlets generously on both sides with salt, pepper, and garlic powder.
2. Heat olive oil in a large cast-iron skillet over medium-high heat until shimmering.
3. Cook chicken without moving for 5–6 minutes until a rich golden crust forms. Flip and cook for another 4–5 minutes.
4. Reduce heat to low, add butter, minced garlic, and fresh herbs into the pan. Spoon the foaming herb butter over the chicken continuously for 60 seconds.
5. Transfer chicken to plates, pour remaining pan sauce over the top, and serve immediately.

---

## 2. 30-Minute Sheet Pan Lemon Herb Chicken & Veggies

Sheet pan meals are the gold standard for minimal dishwashing. Tossing protein and vegetables together with citrus and olive oil yields caramelized edges and zero stove splatter.

> **Chef's Tip**: Cut your vegetables (zucchini, bell peppers, baby potatoes) into uniform 1-inch chunks so they roast at the exact same pace as the chicken thighs.

---

## Frequently Asked Questions

### What cut of chicken is best for quick dinners?
Boneless, skinless chicken tenders or thinly sliced chicken breasts cook in 8 to 12 minutes. Boneless chicken thighs take slightly longer (15 to 18 minutes) but are more forgiving and remain remarkably juicy under high heat.

### Can I prep these chicken recipes ahead of time?
Yes. You can marinate chicken in airtight containers up to 24 hours in advance. For cooked leftovers, store in an airtight glass container in the refrigerator for up to 4 days.

### How do I store and reheat cooked chicken without making it tough?
Reheat gently in a covered skillet over medium-low heat with 2 tablespoons of water or broth, or microwave in 30-second bursts covered with a damp paper towel to retain steam.

---

## Summary & Next Steps
Quick weeknight chicken dinners do not require complicated techniques or specialty ingredients. By keeping high-smoke-point oil, garlic, and dried herbs on hand, you can prepare a nutritious, restaurant-quality meal in less time than ordering takeout.`,
      sections: [
        { id: 'sec_1', heading: 'Quick Reference: Cook Time & Flavor Profiles', level: 2, content: 'Quick reference table comparing 7 meals by cook time and flavor.' },
        { id: 'sec_2', heading: '3 Foundational Rules for Juicier Weeknight Chicken', level: 2, content: 'Culinary tips: uniform thickness, dry exterior, thermometer reading.' },
        { id: 'sec_3', heading: '20-Minute Garlic Herb Butter Skillet Chicken', level: 2, content: 'Ingredients and cooking steps for skillet chicken.' },
        { id: 'sec_4', heading: 'Frequently Asked Questions', level: 2, content: 'User FAQs regarding storage, cuts, and reheating.' }
      ],
      faqs: [
        { question: 'What cut of chicken is best for quick dinners?', answer: 'Boneless, skinless chicken tenders or sliced breasts cook in under 12 minutes. Boneless thighs offer richer flavor and forgiveness.' },
        { question: 'Can I prep these chicken recipes ahead of time?', answer: 'Yes. Marinate in airtight containers up to 24 hours ahead, or store cooked portions in the fridge for up to 4 days.' },
        { question: 'How do I store and reheat cooked chicken without making it tough?', answer: 'Reheat gently in a skillet with 2 tablespoons of broth or covered in the microwave with a damp paper towel.' }
      ],
      jsonLdSchema: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'Recipe',
        'name': 'Easy Chicken Dinner Recipes: 7 Fast Weeknight Meals',
        'description': 'Discover 7 easy chicken dinner recipes ready in under 35 minutes.',
        'recipeCategory': 'Dinner',
        'recipeYield': '4 servings',
        'prepTime': 'PT10M',
        'cookTime': 'PT20M',
        'totalTime': 'PT30M'
      }, null, 2),
      schemaType: 'Recipe',
      seoScore: {
        searchIntent: 19,
        topicalCoverage: 19,
        contentQuality: 19,
        structure: 10,
        keywordOptimization: 9,
        internalLinking: 5,
        externalSources: 5,
        media: 5,
        schema: 5,
        total: 96,
        explanations: [
          { category: 'Search Intent', score: 19, max: 20, reason: 'Thoroughly satisfies how-to and quick recipe discovery intent.' },
          { category: 'Topical Coverage', score: 19, max: 20, reason: 'Includes preparation, cut comparison, cook times, and reheating.' },
          { category: 'Content Quality', score: 19, max: 20, reason: 'Actionable steps, zero keyword stuffing or generic filler.' },
          { category: 'Structure', score: 10, max: 10, reason: 'Scannable comparison table, bulleted checklists, and clear H2/H3s.' },
          { category: 'Keyword Optimization', score: 9, max: 10, reason: 'Primary keyword placed naturally in H1, intro, and metadata.' }
        ]
      },
      improvementPasses: 0,
      featuredImage: {
        id: 'img_featured_sample',
        type: 'featured',
        url: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=1200&h=675&q=80',
        altText: 'Golden skillet-seared chicken cutlets served with fresh rosemary and herbs on a white plate',
        caption: 'Garlic Herb Butter Skillet Chicken',
        placement: 'Header'
      },
      articleImages: [
        {
          id: 'img_article_sample',
          type: 'article',
          url: 'https://images.unsplash.com/photo-1532550907401-a500c9a57435?auto=format&fit=crop&w=800&h=533&q=80',
          altText: 'Sheet pan chicken thighs with roasted baby potatoes and asparagus fresh from the oven',
          caption: 'Sheet pan chicken dinners simplify weeknight cleanup',
          placement: 'Section 2'
        }
      ],
      internalLinks: [
        {
          postId: 101,
          title: 'Top 10 Weeknight Dinner Hacks Every Cook Should Know',
          url: 'https://example.com/weeknight-dinner-hacks',
          anchorTextCandidate: 'Weeknight Dinner Hacks',
          targetSection: 'Foundational Rules',
          status: 'suggested'
        },
        {
          postId: 103,
          title: 'Sheet Pan Dinners: 15 Zero-Mess Family Meals',
          url: 'https://example.com/sheet-pan-dinners-collection',
          anchorTextCandidate: 'Sheet pan meals',
          targetSection: 'Recipe 2',
          status: 'inserted'
        }
      ],
      externalSources: [
        {
          name: 'USDA Food Safety & Inspection Service - Safe Minimum Internal Temperatures',
          url: 'https://www.fsis.usda.gov/food-safety/safe-food-handling-and-preparation/food-safety-basics/safe-temperature-chart',
          authorityType: 'gov',
          context: 'Safe internal cooking temperature of poultry (165°F / 74°C)',
          status: 'included'
        }
      ],
      factCheckFlags: [
        {
          claim: 'Internal cooking temperature of poultry reaches 165°F (74°C)',
          category: 'safety',
          flaggedForHumanReview: false,
          notes: 'Standard verified guideline from USDA food safety guidelines.'
        }
      ],
      isHighRiskContent: false,
      pinterestPin: {
        id: 'pin_sample_1',
        title: '7 Fast Weeknight Chicken Dinners (Ready in 30 Mins!)',
        description: 'Tired of boring chicken? These 7 quick and juicy chicken recipes are family-tested and ready in under 35 minutes! Save this pin for easy meal planning tonight. #ChickenRecipes #EasyDinner #WeeknightMeals',
        destinationUrl: 'https://example.com/easy-chicken-dinner-recipes',
        boardId: 'b_chicken',
        boardName: 'Easy Chicken Recipes',
        keywords: ['easy chicken dinner recipes', 'quick meals', 'weeknight dinners'],
        cta: 'Save This Recipe',
        imageUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=1000&h=1500&q=80',
        status: 'ready',
        graphicConfig: {
          templateId: 'template-1',
          headline: '7 EASY CHICKEN DINNERS READY IN 30 MINS',
          brandName: 'AI SEO Content Studio',
          primaryColor: '#059669',
          secondaryColor: '#0f172a',
          textColor: '#ffffff',
          ctaText: 'Save For Tonight',
          imageUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=1000&h=1500&q=80',
          fontFamily: 'Plus Jakarta Sans'
        }
      },
      wordpressStatus: 'draft',
      category: 'Recipes',
      tags: ['Chicken', 'Dinner', 'Easy Recipes', 'Weeknight'],
      versions: [
        {
          versionNumber: 1,
          createdAt: new Date(Date.now() - 3600000).toISOString(),
          summary: 'Initial complete draft generation based on SERP research and intent brief.',
          title: 'Easy Chicken Dinner Recipes: 7 Fast Weeknight Meals for Busy Families',
          content: 'Initial generated content...',
          seoScore: 92
        },
        {
          versionNumber: 2,
          createdAt: new Date().toISOString(),
          summary: 'Added cook time reference table, USDA temperature guidelines, and 3 new FAQs.',
          title: 'Easy Chicken Dinner Recipes: 7 Fast Weeknight Meals for Busy Families',
          content: 'Updated content with comparison table and FAQs...',
          seoScore: 96
        }
      ],
      brief: {
        id: 'brief_sample_1',
        primaryKeyword: 'easy chicken dinner recipes',
        secondaryKeywords: ['quick chicken meals', '30 minute chicken recipes', 'healthy weeknight chicken'],
        searchIntent: {
          primaryIntent: 'how-to',
          secondaryIntent: 'informational',
          userGoal: 'Find fast, practical, low-mess chicken recipes for weeknight family cooking.',
          expectedContentType: 'Recipe Guide & Reference',
          expectedDepth: 'Comprehensive',
          likelyQuestions: [
            'What cut of chicken cooks fastest?',
            'How to avoid dry chicken breasts without spending hours marinating?',
            'Can these recipes be made in one pan?'
          ],
          commercialViability: 'medium'
        },
        targetAudience: 'Home cooks seeking quick, stress-free weeknight family dinners',
        contentType: 'Recipe Guide',
        recommendedTitle: 'Easy Chicken Dinner Recipes: 7 Fast Weeknight Meals for Busy Families',
        alternativeTitles: [
          '7 Easy Chicken Dinner Recipes You Can Make in 30 Minutes',
          'Fast Weeknight Chicken Dinners: Quick & Juicy Recipes for Tonight',
          'The Busy Cook’s Guide to Easy Chicken Dinners (35 Mins or Less)',
          'One-Pan & Skillet Easy Chicken Dinners Your Family Will Love'
        ],
        slug: 'easy-chicken-dinner-recipes',
        metaDescription: 'Discover 7 easy chicken dinner recipes ready in under 35 minutes. Includes foolproof searing tips, one-pan cleanup, and healthy side pairings.',
        alternativeMetaDescriptions: [
          'Looking for easy chicken dinner recipes? Here are 7 foolproof, 30-minute meals with simple ingredients and minimal cleanup.',
          'Cook delicious, juicy chicken tonight with these 7 easy dinner recipes. Complete with prep times and side dish pairings.',
          'Fast, flavorful, and kid-approved: 7 easy chicken dinner recipes designed for hectic weeknights. Ready in 35 minutes.',
          'Simplify dinner with 7 easy chicken recipes. Learn how to sear, roast, and glaze chicken without drying it out.'
        ],
        h1: 'Easy Chicken Dinner Recipes: 7 Fast Weeknight Meals for Busy Families',
        outline: [
          { h2: 'Quick Reference: Cook Time & Flavor Profiles', keyPoints: ['Cook times', 'Pan methods', 'Best sides'] },
          { h2: '3 Foundational Rules for Juicier Weeknight Chicken', keyPoints: ['Pounding thickness', 'Drying surface', '165°F thermometer test'] },
          { h2: '20-Minute Garlic Herb Butter Skillet Chicken', keyPoints: ['Cutlets', 'Herbs', 'Garlic butter baste'] },
          { h2: '30-Minute Sheet Pan Lemon Herb Chicken & Veggies', keyPoints: ['Even cuts', 'Roasting temps'] },
          { h2: 'Frequently Asked Questions', keyPoints: ['Storage', 'Best cuts', 'Reheating'] }
        ],
        entities: ['Chicken breast', 'Boneless chicken thighs', 'Maillard reaction', 'Cast iron skillet', 'Internal temperature 165°F'],
        relatedConcepts: ['Meal prep', 'Sheet pan cooking', 'Skillet searing', 'Side pairings'],
        questionsToAnswer: [
          'What cut of chicken cooks fastest?',
          'How do you keep chicken breast juicy?',
          'How to store and reheat cooked chicken safely?'
        ],
        contentGapsToAddress: [
          'Include exact pan-searing temperature and time',
          'Provide clear table of cuts vs cook times',
          'Add USDA food safety guidance'
        ],
        internalLinkOpportunities: ['Weeknight Dinner Hacks', 'Sheet Pan Dinners Collection'],
        externalSourceOpportunities: [
          { type: 'gov', name: 'USDA Food Safety Guidelines', relevance: 'Safe internal temperature verification' }
        ],
        imageRecommendations: [
          { placement: 'Featured', concept: 'Golden skillet chicken', altTextSuggestion: 'Seared chicken cutlets in skillet with fresh herbs' },
          { placement: 'Section 2', concept: 'Sheet pan chicken and roasted vegetables', altTextSuggestion: 'Sheet pan chicken thighs with roasted potatoes' }
        ],
        schemaRecommendation: 'Recipe',
        suggestedWordCount: 1600,
        createdAt: new Date().toISOString()
      },
      createdAt: new Date(Date.now() - 3600000).toISOString(),
      updatedAt: new Date().toISOString()
    };

    this.articles.set(sampleArticleId, sampleArticle);

    const shrimpArticleId = 'art_honey_garlic_shrimp';
    const shrimpArticle: Article = {
      id: shrimpArticleId,
      title: 'Honey Garlic Shrimp: A Complete Guide to This 15-Minute Dish',
      slug: 'honey-garlic-shrimp-guide',
      metaDescription: 'Learn how to make honey garlic shrimp in 15 minutes with a glossy pan sauce. Includes cooking science, exact technique, and foolproof ingredient ratios.',
      wordCount: 1850,
      readingTimeMinutes: 7,
      content: `# Honey Garlic Shrimp: A Complete Guide to This 15-Minute Dish

Few weeknight dinners deliver as much flavor for as little effort as honey garlic shrimp. This dish pairs plump, seared shrimp with a glossy sauce built from just a handful of pantry staples — honey, garlic, soy sauce, and a splash of acid to balance the sweetness. It's ready in about 15 minutes, requires no marinating time, and works over rice, noodles, or a bed of greens. In this guide, you'll learn the science behind the sauce, the exact technique for perfectly cooked shrimp, ingredient swaps, and answers to the most common questions cooks have about making it.

## What Is Honey Garlic Shrimp?

Honey garlic shrimp is a stir-fry-style dish where shrimp are cooked quickly in a hot pan, then coated in a sauce made primarily of honey and garlic, often rounded out with soy sauce, butter, or a squeeze of lemon or lime. The result is a sticky, caramelized glaze that clings to each shrimp.

The dish draws on techniques common to Asian-American stir-fries and American pan-sauce cooking, which is why you'll see versions ranging from soy-and-ginger-forward to butter-and-lemon-forward. Despite the variations, the core idea stays the same: reduce a sweet, savory liquid until it thickens enough to coat the shrimp in a glossy layer.

### Why the Sauce Thickens

Honey is roughly 80% sugar. When it hits a hot pan alongside garlic and soy sauce, the water content evaporates and the sugars begin to concentrate and lightly caramelize. This is a straightforward reduction, not an emulsification, which is why the sauce needs only 2–3 minutes of simmering to go from thin and watery to thick enough to coat a spoon.

## Ingredients You'll Need

A standard batch for four servings uses:

- 1 to 1.5 lbs large shrimp, peeled and deveined (tail-on or off)
- 4–5 cloves garlic, minced
- 1/3 cup raw or clover honey
- 3 tablespoons low-sodium soy sauce (or tamari for gluten-free)
- 1 tablespoon fresh lemon juice or rice vinegar
- 1 tablespoon olive oil or avocado oil for searing
- 1 tablespoon unsalted butter (swirled in at the end for gloss)
- Optional garnishes: sliced green onions, toasted sesame seeds, crushed red pepper flakes

## Step-by-Step Cooking Technique

### 1. Prep and Dry the Shrimp
Pat the peeled shrimp completely dry with paper towels. Any excess surface moisture turns to steam in the pan, preventing the shrimp from developing a caramelized golden crust. Season lightly with salt and freshly cracked black pepper.

### 2. Whisk the Pan Sauce
In a small bowl, combine honey, soy sauce, lemon juice, and minced garlic. Whisking ahead of time prevents the honey from burning on the pan bottom before it incorporates.

### 3. High-Heat Sear (1 Minute Per Side)
Heat your skillet over medium-high heat until a drop of water sizzles instantly. Add oil, then add shrimp in a single layer without overcrowding. Cook undisturbed for 60 to 90 seconds until pink on the bottom edge, flip once, and cook for 1 more minute. Transfer immediately to a clean plate.

### 4. Reduce and Glaze
Pour the whisked honey garlic sauce into the hot skillet. Bring to a rapid simmer for 2 minutes until bubbly and thickened. Remove from heat, stir in the butter, and toss the cooked shrimp back in to coat thoroughly.

## Key Reference: Cook Times & Substitutions

| Ingredient / Step | Standard Choice | Best Alternative | Purpose |
| :--- | :--- | :--- | :--- |
| **Shrimp Size** | 21/25 Large count | 16/20 Jumbo count | Plump bite, stays juicy during sear |
| **Sweetener** | Clover honey | Hot honey or maple syrup | Sugar reduction and glossy cling |
| **Umami Base** | Low-sodium soy sauce | Tamari or coconut aminos | Savory balance to cut sweetness |
| **Acid Element** | Fresh lemon juice | Rice vinegar or apple cider | Brightness that cuts rich honey |

## Frequently Asked Questions

### Can I use frozen shrimp?
Yes. Thaw frozen shrimp completely in a bowl of cold water for 15 minutes, peel, and thoroughly pat dry with paper towels before searing. Never cook shrimp directly from frozen, as excess ice dilutes the sauce and makes the shrimp rubbery.

### How do I keep the garlic from burning?
Minced garlic burns quickly over high heat. In this technique, the garlic is whisked directly into the liquid honey-soy mixture rather than sautéed dry in the pan first. The liquid buffers the garlic, cooking it gently while the sauce reduces.

### What should I serve with honey garlic shrimp?
Steamed jasmine rice or brown rice is the classic base to soak up extra sauce. For lower carb options, serve over cauliflower rice, garlic roasted broccoli, or cold soba noodles.`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      wordpressStatus: 'draft',
      schemaType: 'Recipe',
      jsonLdSchema: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'Recipe',
        name: 'Honey Garlic Shrimp: A Complete Guide to This 15-Minute Dish',
        prepTime: 'PT5M',
        cookTime: 'PT10M',
        totalTime: 'PT15M',
        recipeYield: '4 servings'
      }, null, 2),
      seoScore: {
        searchIntent: 20,
        topicalCoverage: 20,
        contentQuality: 20,
        structure: 10,
        keywordOptimization: 10,
        internalLinking: 5,
        externalSources: 5,
        media: 4,
        schema: 5,
        total: 99,
        explanations: [
          { category: 'Search Intent', score: 20, max: 20, reason: 'Direct answer in opening paragraph with full culinary science context.' },
          { category: 'Topical Coverage', score: 20, max: 20, reason: 'Covers technique, ingredients, science of reduction, and substitutions.' },
          { category: 'Content Quality', score: 20, max: 20, reason: 'Zero AI clichés, authentic culinary instructions, crisp formatting.' }
        ]
      },
      improvementPasses: 1,
      sections: [
        { id: 'sec_1', heading: 'What Is Honey Garlic Shrimp?', level: 2, content: 'Definition and culinary origins of honey garlic glaze reduction.' },
        { id: 'sec_2', heading: 'Why the Sauce Thickens', level: 3, content: 'Science of honey sugar evaporation and pan reduction.' },
        { id: 'sec_3', heading: "Ingredients You'll Need", level: 2, content: 'Mise en place list with metric and imperial quantities.' },
        { id: 'sec_4', heading: 'Step-by-Step Cooking Technique', level: 2, content: 'Four distinct cooking stages with timing constraints.' },
        { id: 'sec_5', heading: 'Key Reference: Cook Times & Substitutions', level: 2, content: 'Ingredient and substitution comparison matrix.' },
        { id: 'sec_6', heading: 'Frequently Asked Questions', level: 2, content: 'Common culinary questions and troubleshooting tips.' }
      ],
      faqs: [
        { question: 'Can I use frozen shrimp?', answer: 'Yes. Thaw frozen shrimp completely in a bowl of cold water for 15 minutes, peel, and thoroughly pat dry with paper towels before searing.' },
        { question: 'How do I keep the garlic from burning?', answer: 'Whisk minced garlic directly into the honey-soy sauce mixture rather than sautéing it dry in the pan first.' },
        { question: 'What should I serve with honey garlic shrimp?', answer: 'Steamed jasmine rice, brown rice, cauliflower rice, garlic roasted broccoli, or cold soba noodles.' }
      ],
      articleImages: [],
      internalLinks: [],
      externalSources: [],
      factCheckFlags: [],
      isHighRiskContent: false,
      versions: [],
      brief: {
        id: 'brief_shrimp',
        primaryKeyword: 'honey garlic shrimp',
        secondaryKeywords: ['15 minute shrimp recipe', 'honey garlic sauce for shrimp', 'easy weeknight shrimp'],
        searchIntent: {
          primaryIntent: 'recipe',
          userGoal: 'Cook a fast weeknight honey garlic shrimp dinner in 15 minutes',
          expectedContentType: 'recipe guide with step-by-step technique',
          expectedDepth: 'comprehensive',
          likelyQuestions: ['How long does it take?', 'How to keep garlic from burning?'],
          commercialViability: 'medium'
        },
        targetAudience: 'Home cooks looking for fast weeknight dinners',
        contentType: 'recipe',
        recommendedTitle: 'Honey Garlic Shrimp: A Complete Guide to This 15-Minute Dish',
        alternativeTitles: ['Easy 15-Minute Honey Garlic Shrimp Recipe'],
        slug: 'honey-garlic-shrimp-guide',
        metaDescription: 'Learn how to make honey garlic shrimp in 15 minutes with a glossy pan sauce. Includes cooking science, exact technique, and foolproof ingredient ratios.',
        alternativeMetaDescriptions: [],
        h1: 'Honey Garlic Shrimp: A Complete Guide to This 15-Minute Dish',
        outline: [
          { h2: 'What Is Honey Garlic Shrimp?' },
          { h2: "Ingredients You'll Need" },
          { h2: 'Step-by-Step Cooking Technique' },
          { h2: 'Key Reference: Cook Times & Substitutions' },
          { h2: 'Frequently Asked Questions' }
        ],
        entities: ['Shrimp', 'Honey', 'Garlic', 'Soy sauce', 'Skillet glaze'],
        relatedConcepts: ['Pan reduction', 'Maillard reaction', 'Weeknight dinner'],
        questionsToAnswer: ['Can I use frozen shrimp?', 'How do I keep garlic from burning?'],
        contentGapsToAddress: ['Why the honey sauce thickens without cornstarch'],
        internalLinkOpportunities: [],
        externalSourceOpportunities: [],
        imageRecommendations: [],
        schemaRecommendation: 'Recipe',
        suggestedWordCount: 1850,
        createdAt: new Date().toISOString()
      }
    };
    this.articles.set(shrimpArticleId, shrimpArticle);

    // Seed Calendar
    this.calendar.set('cal_1', {
      id: 'cal_1',
      topic: 'Weeknight Dinner Recipes',
      keyword: 'easy chicken dinner recipes',
      articleType: 'recipe',
      priority: 'high',
      status: 'drafted',
      publishDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
      pinterestStatus: 'ready',
      articleId: sampleArticleId
    });

    this.calendar.set('cal_2', {
      id: 'cal_2',
      topic: 'Meal Prep Ideas',
      keyword: 'healthy meal prep bowls for work',
      articleType: 'how-to',
      priority: 'medium',
      status: 'planned',
      publishDate: new Date(Date.now() + 172800000).toISOString().split('T')[0],
      pinterestStatus: 'not_created'
    });

    // Seed Topical Cluster Tree (Healthy Recipes)
    const pillar: TopicClusterNode = {
      id: 'cluster_root',
      title: 'Healthy Recipes Guide',
      keyword: 'healthy recipes',
      intent: 'informational',
      level: 'pillar',
      status: 'planned',
      children: [
        {
          id: 'node_breakfast',
          title: 'Healthy Breakfast Recipes',
          keyword: 'healthy breakfast recipes',
          intent: 'recipe',
          level: 'cluster',
          parentId: 'cluster_root',
          status: 'planned',
          children: [
            { id: 'node_b1', title: 'High-Protein Overnight Oats', keyword: 'protein overnight oats recipe', intent: 'recipe', level: 'supporting', parentId: 'node_breakfast', status: 'planned' },
            { id: 'node_b2', title: 'Low-Sugar Green Smoothies', keyword: 'low sugar green smoothie recipe', intent: 'recipe', level: 'supporting', parentId: 'node_breakfast', status: 'planned' }
          ]
        },
        {
          id: 'node_dinner',
          title: 'Healthy Dinner Recipes',
          keyword: 'easy chicken dinner recipes',
          intent: 'how-to',
          level: 'cluster',
          parentId: 'cluster_root',
          status: 'generated',
          articleId: sampleArticleId,
          children: [
            { id: 'node_d1', title: '30-Minute Sheet Pan Dinners', keyword: 'sheet pan dinner ideas', intent: 'listicle', level: 'supporting', parentId: 'node_dinner', status: 'in_calendar' },
            { id: 'node_d2', title: 'Low-Carb Chicken Skillet Dinners', keyword: 'low carb chicken skillet', intent: 'recipe', level: 'supporting', parentId: 'node_dinner', status: 'planned' }
          ]
        },
        {
          id: 'node_mealprep',
          title: 'Healthy Meal Prep',
          keyword: 'healthy meal prep for beginners',
          intent: 'how-to',
          level: 'cluster',
          parentId: 'cluster_root',
          status: 'planned'
        }
      ]
    };
    this.clusters.set('cluster_root', pillar);

    // Seed sample saved target keywords
    const initialSavedKeywords: DiscoveredKeyword[] = [
      {
        id: 'kw_seed_1',
        keyword: 'quick chicken meals',
        intent: 'recipe',
        volumeTier: 'Medium (1k-10k)',
        difficulty: 35,
        difficultyLevel: 'Medium',
        cpcTier: 'Medium',
        trend: 'rising',
        serpFeatures: ['Featured Snippet', 'People Also Ask'],
        topQuestions: ['What is the fastest way to cook raw chicken?'],
        relevanceScore: 96,
        clusterCategory: 'Quick Weeknight Meals',
        isSaved: true
      },
      {
        id: 'kw_seed_2',
        keyword: 'healthy chicken dinner recipes',
        intent: 'how-to',
        volumeTier: 'High (>10k)',
        difficulty: 42,
        difficultyLevel: 'Medium',
        cpcTier: 'High',
        trend: 'rising',
        serpFeatures: ['Featured Snippet', 'People Also Ask', 'Image Carousel'],
        topQuestions: ['How can I make healthy chicken flavorful?'],
        relevanceScore: 94,
        clusterCategory: 'Healthy Options',
        isSaved: true
      },
      {
        id: 'kw_seed_3',
        keyword: '30 minute chicken recipes',
        intent: 'recipe',
        volumeTier: 'High (>10k)',
        difficulty: 38,
        difficultyLevel: 'Medium',
        cpcTier: 'Medium',
        trend: 'stable',
        serpFeatures: ['Featured Snippet', 'People Also Ask'],
        topQuestions: ['Can you cook chicken breast in 20 minutes?'],
        relevanceScore: 92,
        clusterCategory: 'Quick Weeknight Meals',
        isSaved: true
      }
    ];

    for (const kw of initialSavedKeywords) {
      this.savedKeywords.set(kw.id, kw);
    }

    this.addLog('info', 'article', 'Platform initialized with sample verified workflow for "easy chicken dinner recipes".');
  }
}
