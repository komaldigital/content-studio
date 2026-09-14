import {
  Article,
  AppSettings,
  ContentCalendarItem,
  TopicClusterNode,
  AIModelDescriptor,
  BrandVoice,
  BloggingAutomationConfig,
  DiscoveredKeyword,
  SeoScoreBreakdown,
  ArticleImage,
  ContentBrief
} from '../types.js';

export const FALLBACK_MODELS: AIModelDescriptor[] = [
  {
    id: 'openrouter/google/gemini-2.5-flash',
    name: 'Gemini 2.5 Flash (via OpenRouter)',
    provider: 'OpenRouter',
    contextWindow: '1M tokens',
    costPer1kWords: '$0.0003',
    description: 'Blazing fast multimodal reasoning for high-volume content synthesis.',
    bestFor: 'Bulk articles, outlines, and rapid intent analysis'
  },
  {
    id: 'openrouter/anthropic/claude-3.5-sonnet',
    name: 'Claude 3.5 Sonnet (via OpenRouter)',
    provider: 'OpenRouter',
    contextWindow: '200k tokens',
    costPer1kWords: '$0.009',
    description: 'Gold standard editorial prose, nuanced tone control, and zero fluff.',
    bestFor: 'Pillar guides, in-depth reviews, and complex tutorials'
  },
  {
    id: 'openrouter/openai/gpt-4o',
    name: 'GPT-4o (via OpenRouter)',
    provider: 'OpenRouter',
    contextWindow: '128k tokens',
    costPer1kWords: '$0.0075',
    description: 'Omni reasoning model with strong search formatting and concise tables.',
    bestFor: 'Data-dense comparisons, product roundups, and FAQs'
  },
  {
    id: 'gemini-3.8-flash',
    name: 'Google Gemini 3.8 Flash (Direct)',
    provider: 'Google',
    contextWindow: '1M tokens',
    costPer1kWords: 'Free tier / Ultra low',
    description: 'Native Google GenAI SDK integration with built-in Google Grounding.',
    bestFor: 'Real-time Google Grounding search and fact-checked citations'
  }
];

export const FALLBACK_BRAND_VOICES: BrandVoice[] = [
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
  }
];

export const FALLBACK_AUTOMATIONS: BloggingAutomationConfig = {
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
      timestamp: new Date().toISOString(),
      action: 'Automated Draft Generation',
      articleTitle: 'Top 10 High-Protein Meal Prep Recipes',
      status: 'success',
      details: 'Article generated with intent visuals and internal links.'
    }
  ]
};

export const FALLBACK_SETTINGS: AppSettings & { geminiApiKeyConfigured: boolean } = {
  activeModel: 'gemini-3.8-flash',
  geminiApiKeyConfigured: true,
  byok: {
    geminiApiKey: 'configured',
    openaiApiKey: '',
    anthropicApiKey: '',
    openrouterApiKey: 'configured',
    straicoApiKey: '',
    perplexityApiKey: ''
  },
  byokConfigured: {
    gemini: true,
    openai: false,
    anthropic: false,
    openrouter: true,
    straico: false,
    perplexity: false
  },
  byokMasked: {
    geminiApiKey: 'AQ.A••••••••rFkQ',
    openaiApiKey: '',
    anthropicApiKey: '',
    openrouterApiKey: 'sk-o••••••••653a',
    straicoApiKey: '',
    perplexityApiKey: ''
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
  brandVoices: FALLBACK_BRAND_VOICES,
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
        topicKeywords: ['seo strategy', 'topical authority', 'search rankings'],
        tier: 'pillar',
        priority: 1,
        lastmod: '2025-01-15'
      },
      {
        url: 'https://example.com/guides/keyword-research-foundations',
        title: 'Keyword Research Foundations for Modern Search',
        slug: 'keyword-research-foundations',
        category: 'SEO',
        topicKeywords: ['keyword research', 'search intent', 'long tail keywords'],
        tier: 'cluster',
        priority: 0.8,
        lastmod: '2025-02-01'
      }
    ]
  },
  automations: FALLBACK_AUTOMATIONS,
  wordpress: {
    endpoint: '',
    username: '',
    isConnected: false,
    defaultPostStatus: 'draft',
    autoPublish: false,
    detectedSeoPlugin: 'native',
    applicationPassword: ''
  },
  pinterest: {
    isConnected: false,
    boards: [
      { id: 'b_chicken', name: 'Easy Chicken Recipes' },
      { id: 'b_mealprep', name: 'Weekly Meal Prep' },
      { id: 'b_dinner', name: 'Quick 30-Minute Dinners' }
    ],
    accessToken: ''
  },
  facebook: {
    isConnected: false,
    pageId: '',
    pageName: '',
    autoPostOnPublish: false,
    defaultHashtags: ['#recipes', '#foodie', '#homecooking', '#dinnerideas'],
    accessToken: ''
  },
  instagram: {
    isConnected: false,
    instagramAccountId: '',
    accountUsername: '',
    autoPostOnPublish: false,
    defaultHashtags: ['#easyrecipes', '#dinnerinspo', '#cookingathome'],
    accessToken: ''
  },
  testMode: false
};

const sampleSeoScore: SeoScoreBreakdown = {
  searchIntent: 20,
  topicalCoverage: 19,
  contentQuality: 19,
  structure: 10,
  keywordOptimization: 10,
  internalLinking: 4,
  externalSources: 5,
  media: 5,
  schema: 4,
  total: 96,
  explanations: [
    {
      category: 'Search Intent Fit',
      score: 20,
      max: 20,
      reason: 'Direct answer matrix in top viewport satisfying rapid informational search intent.'
    },
    {
      category: 'Topical Coverage & EEAT',
      score: 19,
      max: 20,
      reason: 'Covers temperature thresholds, resting principles, and foolproof techniques.'
    }
  ]
};

const sampleFeaturedImage: ArticleImage = {
  id: 'img_feat_1',
  type: 'featured',
  url: 'https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?w=1200&auto=format&fit=crop&q=80',
  altText: 'Golden seared garlic butter chicken breast in cast iron skillet with fresh rosemary herbs',
  caption: 'A 20-minute weeknight skillet meal made with pantry herbs and garlic.',
  aspectRatio: '16:9'
};

const sampleBrief: ContentBrief = {
  id: 'brief_sample_1',
  primaryKeyword: 'easy chicken dinner recipes',
  secondaryKeywords: ['quick chicken dinners', 'weeknight chicken recipes', 'garlic skillet chicken'],
  searchIntent: {
    primaryIntent: 'recipe',
    userGoal: 'Cook a quick, satisfying family dinner with chicken in under 35 minutes',
    expectedContentType: 'recipe guide with step-by-step cooking steps',
    expectedDepth: 'comprehensive',
    likelyQuestions: ['How long does it take?', 'Can I use chicken thighs?'],
    commercialViability: 'medium'
  },
  targetAudience: 'Busy families and home cooks',
  contentType: 'recipe',
  recommendedTitle: 'Easy Chicken Dinner Recipes: 7 Fast Weeknight Meals for Busy Families',
  alternativeTitles: ['7 Simple Weeknight Chicken Dinners In 35 Minutes Or Less'],
  slug: 'easy-chicken-dinner-recipes',
  metaDescription: 'Discover 7 easy chicken dinner recipes ready in under 35 minutes.',
  alternativeMetaDescriptions: [],
  h1: 'Easy Chicken Dinner Recipes: 7 Fast Weeknight Meals for Busy Families',
  outline: [
    { h2: 'Quick Reference: Cook Time & Flavor Profiles' },
    { h2: '3 Foundational Rules for Juicier Weeknight Chicken' },
    { h2: '1. 20-Minute Garlic Herb Butter Skillet Chicken' }
  ],
  entities: ['Chicken breast', 'Garlic', 'Rosemary', 'Cast iron skillet', 'Internal temperature'],
  relatedConcepts: ['Meal prep', 'Sheet pan cooking', 'Sear and baste technique'],
  questionsToAnswer: ['How to prevent chicken breasts from drying out?'],
  contentGapsToAddress: ['Exact internal temperature guide (165°F)'],
  internalLinkOpportunities: ['/guides/cast-iron-care', '/guides/quick-sides'],
  externalSourceOpportunities: [
    {
      type: 'gov',
      name: 'USDA Food Safety Inspection Service (FSIS)',
      relevance: 'Safe minimum internal temperature recommendation for poultry (165°F / 74°C).'
    }
  ],
  imageRecommendations: [],
  schemaRecommendation: 'Recipe',
  suggestedWordCount: 1650,
  createdAt: new Date().toISOString()
};

export const FALLBACK_ARTICLES: Article[] = [
  {
    id: 'art_sample_1',
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
2. **Pat Thoroughly Dry**: Surface moisture produces steam, preventing the coveted Maillard browning. Use paper towels to dry the chicken surfaces completely before seasoning.
3. **Rest Before Slicing**: Allow cooked poultry to rest on a clean cutting board for 5 to 7 minutes. Slicing immediately causes cellular juices to pool onto the board rather than redistribute through the meat fibers.

---

## 1. 20-Minute Garlic Herb Butter Skillet Chicken

Golden seared chicken breasts bathed in garlic, fresh rosemary, and a splash of chicken broth with melted grass-fed butter.

- **Prep Time**: 5 minutes
- **Cook Time**: 15 minutes
- **Key Ingredients**: Boneless chicken breasts, unsalted butter, minced garlic cloves, fresh rosemary, chicken broth, lemon juice.

### Instructions
1. Season chicken breasts with coarse salt, black pepper, and garlic powder.
2. Heat 1 tablespoon olive oil in a heavy stainless steel or cast iron skillet over medium-high heat.
3. Sear chicken for 6-7 minutes on the first side until deeply golden. Flip and cook 4-5 minutes more.
4. Reduce heat to low, drop in 2 tablespoons of butter, minced garlic, and rosemary sprigs. Spoon the foaming butter over the chicken for 90 seconds until the internal temperature registers 165°F (74°C).
`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    wordpressStatus: 'draft',
    schemaType: 'Recipe',
    jsonLdSchema: JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'Recipe',
      name: 'Easy Garlic Herb Butter Skillet Chicken',
      prepTime: 'PT5M',
      cookTime: 'PT15M',
      totalTime: 'PT20M',
      recipeYield: '4 servings'
    }, null, 2),
    seoScore: sampleSeoScore,
    improvementPasses: 1,
    sections: [
      {
        id: 'sec_1',
        heading: 'Quick Reference: Cook Time & Flavor Profiles',
        level: 2,
        content: 'Summary comparison table of seven fast weeknight recipes.'
      },
      {
        id: 'sec_2',
        heading: '3 Foundational Rules for Juicier Weeknight Chicken',
        level: 2,
        content: 'Culinary principles covering thickness pounding, moisture drying, and meat resting.'
      },
      {
        id: 'sec_3',
        heading: '1. 20-Minute Garlic Herb Butter Skillet Chicken',
        level: 2,
        content: 'Step by step skillet recipe with ingredient quantities and internal temperature targets.'
      }
    ],
    featuredImage: sampleFeaturedImage,
    articleImages: [
      sampleFeaturedImage,
      {
        id: 'img_sec_1',
        type: 'article',
        url: 'https://images.unsplash.com/photo-1532550907401-a500c9a57435?w=1200&auto=format&fit=crop&q=80',
        altText: 'Plated chicken dinner with roasted vegetables and fresh herbs',
        caption: 'Properly rested chicken preserves flavorful juices.',
        sectionHeading: '3 Foundational Rules for Juicier Weeknight Chicken',
        aspectRatio: '16:9'
      }
    ],
    internalLinks: [],
    externalSources: [
      {
        name: 'USDA Food Safety Inspection Service (FSIS)',
        url: 'https://www.fsis.usda.gov/food-safety/safe-food-handling-and-preparation/poultry/chicken-from-farm-to-table',
        authorityType: 'gov',
        context: '165°F safe internal cooking temperature for poultry.',
        status: 'included'
      }
    ],
    factCheckFlags: [],
    isHighRiskContent: false,
    faqs: [
      {
        question: 'How do I know when chicken breasts are fully cooked without drying them out?',
        answer: 'Insert an instant-read digital meat thermometer into the thickest part of the breast. Remove the chicken when it hits 162°F (72°C); carryover cooking during the 5-minute rest will safely bring it to the USDA recommended 165°F (74°C).'
      },
      {
        question: 'Can I use boneless chicken thighs instead of chicken breasts?',
        answer: 'Yes! Boneless chicken thighs are more forgiving and naturally juicier due to higher myoglobin and fat content. Cook them to an internal temperature of 175°F for optimal tenderness.'
      }
    ],
    versions: [],
    brief: sampleBrief
  }
];

export const FALLBACK_CALENDAR: ContentCalendarItem[] = [
  {
    id: 'cal_1',
    topic: 'Easy Chicken Dinner Recipes',
    keyword: 'easy chicken dinner recipes',
    articleType: 'recipe',
    publishDate: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0],
    status: 'drafted',
    priority: 'high',
    articleId: 'art_sample_1',
    pinterestStatus: 'ready'
  },
  {
    id: 'cal_2',
    topic: 'Cast Iron Skillet Restoration Guide',
    keyword: 'how to restore cast iron skillet',
    articleType: 'how-to',
    publishDate: new Date(Date.now() + 86400000 * 4).toISOString().split('T')[0],
    status: 'planned',
    priority: 'medium',
    pinterestStatus: 'not_created'
  }
];

export const FALLBACK_CLUSTERS: TopicClusterNode[] = [
  {
    id: 'cluster_root_1',
    title: 'Easy Weeknight Dinners',
    level: 'pillar',
    keyword: 'easy weeknight dinners',
    intent: 'informational',
    status: 'planned',
    children: [
      {
        id: 'cluster_sub_1',
        title: 'Easy Chicken Dinner Recipes',
        level: 'cluster',
        keyword: 'easy chicken dinner recipes',
        intent: 'recipe',
        status: 'generated',
        articleId: 'art_sample_1',
        children: [
          {
            id: 'cluster_sub_1_1',
            title: '20-Minute Garlic Herb Chicken Skillet',
            level: 'supporting',
            keyword: 'garlic herb chicken skillet',
            intent: 'recipe',
            status: 'planned'
          }
        ]
      }
    ]
  }
];

export const FALLBACK_SAVED_KEYWORDS: DiscoveredKeyword[] = [
  {
    id: 'kw_1',
    keyword: 'easy chicken dinner recipes',
    intent: 'recipe',
    volumeTier: 'High (>10k)',
    difficulty: 42,
    difficultyLevel: 'Medium',
    cpcTier: 'Medium',
    trend: 'stable',
    serpFeatures: ['Recipe Rich Card', 'People Also Ask', 'Images'],
    topQuestions: ['How long does it take?', 'Can I use frozen chicken?'],
    relevanceScore: 98,
    clusterCategory: 'Quick Dinners',
    isSaved: true
  },
  {
    id: 'kw_2',
    keyword: 'sheet pan chicken thighs and potatoes',
    intent: 'recipe',
    volumeTier: 'High (>10k)',
    difficulty: 28,
    difficultyLevel: 'Easy',
    cpcTier: 'Low',
    trend: 'rising',
    serpFeatures: ['Recipe Rich Card', 'Video Snippets'],
    topQuestions: ['What temperature to roast at?'],
    relevanceScore: 94,
    clusterCategory: 'Sheet Pan Dinners',
    isSaved: true
  }
];
