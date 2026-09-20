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
    id: 'openrouter/anthropic/claude-sonnet-5',
    name: 'Claude Sonnet 5 via OpenRouter',
    provider: 'OpenRouter',
    contextWindow: '1M tokens',
    costPer1kWords: '$0.0030',
    description: 'Anthropic 5th-generation flagship with adaptive thinking, 1M context, and zero-cliché human prose.',
    bestFor: 'Ultimate pillar guides, expert editorial analysis, and autonomous content workflows'
  },
  {
    id: 'openrouter/anthropic/claude-opus-5',
    name: 'Claude Opus 5 via OpenRouter',
    provider: 'OpenRouter',
    contextWindow: '1M tokens',
    costPer1kWords: '$0.0150',
    description: 'Anthropic supreme intelligence tier for complex multi-step reasoning, novel synthesis, and academic rigor.',
    bestFor: 'High-stakes thought leadership, investigative reviews, and exhaustive research'
  },
  {
    id: 'openrouter/anthropic/claude-sonnet-4.6',
    name: 'Claude Sonnet 4.6 via OpenRouter',
    provider: 'OpenRouter',
    contextWindow: '1M tokens',
    costPer1kWords: '$0.0030',
    description: 'Advanced Sonnet-class model with 1M context, 128K output capacity, and exceptional structural planning.',
    bestFor: 'Iterative long-horizon drafting, complex structural guides, and comparison matrices'
  },
  {
    id: 'openrouter/anthropic/claude-sonnet-4.5',
    name: 'Claude Sonnet 4.5 via OpenRouter',
    provider: 'OpenRouter',
    contextWindow: '1M tokens',
    costPer1kWords: '$0.0030',
    description: 'Anthropic model optimized for real-world agents, technical accuracy, and adherence to strict specifications.',
    bestFor: 'Technical documentation, structured semantic schema articles, and coding tutorials'
  },
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
    id: 'art_lavender_latte',
    title: 'Lavender Latte',
    slug: 'lavender-latte',
    metaDescription: 'Learn how to make this easy, fragrant homemade Lavender Latte hot or iced. Includes homemade lavender syrup, sensory flavor profile, nutrition facts, and muffin pairing.',
    wordCount: 1650,
    readingTimeMinutes: 6,
    content: `# Lavender Latte

![Lavender Latte](https://images.unsplash.com/photo-1541167760496-1628856ab772?w=1200&auto=format&fit=crop&q=80)

With spring just around the corner, I've been adding new caffeinated creations to my lineup. Lavender and coffee might not be the most obvious pairing, but trust me—once you try it, you'll wonder why you didn't make this sooner. This homemade lavender latte recipe brings a subtle floral twist to your usual coffee routine, balancing rich espresso with smooth, aromatic lavender syrup. It's matches the smoothness of our popular [Pistachio Latte Recipe]. Whether you prefer it hot or iced, this latte is easy to make at home, and I'll walk you through every step—including a simple lavender syrup recipe that's perfect for adding a little extra flavor to your drinks. Let's get started!

## Flavor & Taste

![Taste](https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=1200&auto=format&fit=crop&q=80)

A lavender latte offers a unique balance of rich espresso, creamy milk, and delicate floral notes. The subtle sweetness of lavender adds a light, herbal complexity that pairs beautifully with the boldness of the coffee, creating a smooth and aromatic experience. The floral essence is present but not overpowering, lending a slightly sweet and soothing quality to each sip. When combined with a touch of honey or vanilla, the flavors meld into a warm, comforting drink with a gentle, lingering finish.

If you want a more complex and delicious flavor, check out our [Iced Lavender Cream Chai Recipe]!

## Lavender Latte Full Recipe

![Preparation](https://images.unsplash.com/photo-1517256064527-09c73fc73e38?w=1200&auto=format&fit=crop&q=80)

This simple method will begin by showing you how to make homemade Lavender Syrup (just like our [Homemade Pistachio Syrup Recipe]). Next, I'll show you how to use the syrup to make a delicious Hot Lavender Latte. Looking for a cooler option? I include a recipe for an Iced Lavender Latte below as well!

### Lavender Syrup Ingredients:
- 1/2 cup Water
- 1/2 cup Granulated Sugar
- 1 tsp Vanilla Extract (learn [how to add vanilla extract to coffee])
- 1 tbsp Dried Culinary Lavender

### Lavender Syrup Instructions:

![Lavender Syrup](https://images.unsplash.com/photo-1528183429752-a97d0bf99b5a?w=1200&auto=format&fit=crop&q=80)

- In a small saucepan, combine water, granulated sugar, and dried lavender. Bring to a gentle simmer over medium heat, stirring until the sugar fully dissolves.
- Once the mixture reaches a gentle simmer and the sugar dissolves, remove from heat and stir in the vanilla extract. Let the lavender steep for 15 minutes to infuse the flavor.
- Pour the syrup through a fine mesh strainer or cheesecloth to remove the pieces of lavender.
- Use the syrup for the recipe below, and store the rest in an airtight container in the fridge for up to 2 weeks.

**Bonus Tip:** The Lavender Syrup can be also used in other drinks like tea and lemonade, get creative!

### Lavender Latte Ingredients:
- 1 shot of espresso or 1/2 cup strong brewed coffee
- 3/4 cup milk (or non-dairy alternative)
- 1 tbsp lavender syrup (from above)
- Dried Lavender for Topping (optional)

### Lavender Latte Instructions:

![Brewing](https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?w=1200&auto=format&fit=crop&q=80)

1. Grab your chosen mug, and add in 1 tbsp of Lavender Syrup (from above). If you like a sweeter latte, add 2 tbsp.
2. Prepare the shot of espresso or brew the strong coffee. Add it to the Chosen Mug.
3. Heat the milk in a small saucepan or froth it using a frother until steaming and slightly foamy, stir gently to mix together.
4. Add a sprinkle of dried lavender as an optional topping, then enjoy your Lavender Latte while it is still warm!

## Nutrition Facts

These Hot Lavender Latte nutrition facts assume the use of skim milk, and it is for one serving.

- Calories: 75
- Total Fat: 0 g
- Saturated Fat: 0 g
- Cholesterol: 2 mg
- Sodium: 65 mg
- Total Carbs: 15 g
- Sugars: 14 g
- Protein: 6 g

## Iced Lavender Latte Recipe:

![Iced](https://images.unsplash.com/photo-1517701604599-bb29b565090c?w=1200&auto=format&fit=crop&q=80)

### Ingredients:
- 1 shot of espresso or 1/2 cup strong brewed coffee (cooled)
- 3/4 cup milk (or non-dairy alternative i.e. oat, almond, etc.)
- 1 tbsp lavender syrup (from above)
- 3/4 - 1 cup of ice
- Dried Lavender for Topping (optional)

### Instructions:

![Pouring](https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=1200&auto=format&fit=crop&q=80)

1. Brew your espresso or 1/2 cup of strong coffee and let it cool in the fridge while you move on to the next step.
2. Add 1 tablespoon of lavender syrup (or 2 tbsp, depending on how sweet you like it).
3. Fill a glass with ice.
4. Pour the cooled espresso or coffee over the ice.
5. Pour in the cold milk and stir gently to combine.
6. Garnish with a pinch of dried lavender for an optional topping. Enjoy your Iced Lavender Latte!

## Muffins Anyone?

![Warm Muffins](https://images.unsplash.com/photo-1586985289688-ca3cf47d3e6e?w=1200&auto=format&fit=crop&q=80)

Now that you've finished your Hot or Iced Lavender Latte, you need something to enjoy it with. You need to see our [Blueberry Muffin Recipe (frozen blueberries)]. It makes muffins that go great with any latte!

*Posted in Homemade Latte & Espresso Recipes*

[← Valentine's Day M&M Cookies](https://example.com/cookies) | [Protein Latte →](https://example.com/protein-latte)`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    wordpressStatus: 'publish',
    schemaType: 'Recipe',
    jsonLdSchema: JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'Recipe',
      name: 'Lavender Latte',
      author: {
        '@type': 'Person',
        name: 'Lone Goose Bakery'
      },
      prepTime: 'PT15M',
      cookTime: 'PT5M',
      totalTime: 'PT20M',
      recipeYield: '1 serving',
      nutrition: {
        '@type': 'NutritionInformation',
        calories: '75 calories',
        fatContent: '0 g',
        sugarContent: '14 g',
        proteinContent: '6 g'
      }
    }, null, 2),
    seoScore: {
      searchIntent: 20,
      topicalCoverage: 20,
      contentQuality: 20,
      structure: 10,
      keywordOptimization: 10,
      internalLinking: 5,
      externalSources: 5,
      media: 5,
      schema: 5,
      total: 100,
      explanations: [
        { category: 'Search Intent', score: 20, max: 20, reason: 'Authentic 1st-person artisan recipe with step-by-step hot and iced guides.' },
        { category: 'Topical Coverage', score: 20, max: 20, reason: 'Covers homemade lavender syrup, hot latte, iced latte, flavor notes, nutrition facts, and muffin pairing.' },
        { category: 'Content Quality', score: 20, max: 20, reason: 'Zero AI slop. Natural human cadence, exact measurements, and sensory taste breakdown.' },
        { category: 'Structure', score: 10, max: 10, reason: 'Pristine Lone Goose Bakery hierarchy with sub-component and primary recipes.' },
        { category: 'Keyword Optimization', score: 10, max: 10, reason: 'Natural density for Lavender Latte, lavender syrup, and homemade latte recipes.' },
        { category: 'Media & Schema', score: 10, max: 10, reason: 'Includes multiple high-res preparation photos and full Recipe JSON-LD schema.' }
      ]
    },
    sections: [
      {
        id: 'sec_ll_intro',
        heading: 'Introduction',
        level: 2,
        content: 'Personal seasonal hook introducing the floral twist on everyday coffee routines.'
      },
      {
        id: 'sec_ll_flavor',
        heading: 'Flavor & Taste',
        level: 2,
        content: 'Sensory breakdown of the delicate herbal complexity, espresso boldness, and smooth finish.'
      },
      {
        id: 'sec_ll_full_recipe',
        heading: 'Lavender Latte Full Recipe',
        level: 2,
        content: 'Complete method including homemade lavender syrup, hot latte instructions, and iced variation.'
      },
      {
        id: 'sec_ll_nutrition',
        heading: 'Nutrition Facts',
        level: 2,
        content: 'Itemized nutrition facts for one serving with skim milk.'
      },
      {
        id: 'sec_ll_iced',
        heading: 'Iced Lavender Latte Recipe:',
        level: 2,
        content: 'Six-step cooled espresso and ice preparation method.'
      },
      {
        id: 'sec_ll_muffins',
        heading: 'Muffins Anyone?',
        level: 2,
        content: 'Bakery pairing recommendation linking to blueberry muffin recipe.'
      }
    ],
    faqs: [
      {
        question: 'Can I use fresh lavender instead of dried?',
        answer: 'Yes, but ensure it is culinary-grade English lavender (Lavandula angustifolia) free from pesticides. Use double the quantity of fresh flowers as dried.'
      },
      {
        question: 'How long does homemade lavender syrup last in the fridge?',
        answer: 'Stored in an airtight glass container or syrup bottle, homemade lavender syrup stays fresh for up to 2 weeks.'
      },
      {
        question: 'What non-dairy milk works best with lavender latte?',
        answer: 'Oat milk is the top choice because its natural creamy sweetness and neutral grain profile balance the floral lavender without competing.'
      }
    ],
    featuredImage: {
      id: 'img_lavender_latte_hero',
      type: 'featured',
      url: 'https://images.unsplash.com/photo-1541167760496-1628856ab772?w=1200&auto=format&fit=crop&q=80',
      altText: 'Hot lavender latte in a white ceramic mug with delicate latte art and dried lavender flowers',
      caption: 'Lavender Latte crafted with homemade lavender syrup and rich espresso.',
      aspectRatio: '16:9',
      searchIntentMatch: 'Hero Presentation'
    },
    articleImages: [
      {
        id: 'img_ll_1',
        type: 'article',
        url: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=1200&auto=format&fit=crop&q=80',
        altText: 'Coffee beans and culinary lavender on wooden background representing flavor and taste',
        caption: 'Flavor & Taste ingredients',
        aspectRatio: '16:9',
        searchIntentMatch: 'Flavor Profile'
      },
      {
        id: 'img_ll_2',
        type: 'article',
        url: 'https://images.unsplash.com/photo-1528183429752-a97d0bf99b5a?w=1200&auto=format&fit=crop&q=80',
        altText: 'Vibrant blooming purple lavender field used for culinary syrup',
        caption: 'Lavender Syrup Infusion',
        aspectRatio: '16:9',
        searchIntentMatch: 'Syrup Preparation'
      },
      {
        id: 'img_ll_3',
        type: 'article',
        url: 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?w=1200&auto=format&fit=crop&q=80',
        altText: 'Two tall iced lavender latte glasses filled with ice and lavender garnish',
        caption: 'Iced Lavender Latte Recipe',
        aspectRatio: '16:9',
        searchIntentMatch: 'Iced Variation'
      },
      {
        id: 'img_ll_4',
        type: 'article',
        url: 'https://images.unsplash.com/photo-1586985289688-ca3cf47d3e6e?w=1200&auto=format&fit=crop&q=80',
        altText: 'Hands breaking open warm fresh blueberry muffins',
        caption: 'Muffins Anyone? Pairing',
        aspectRatio: '16:9',
        searchIntentMatch: 'Bakery Pairing'
      }
    ],
    internalLinks: [
      { postId: 101, title: 'Pistachio Latte Recipe', url: 'https://example.com/pistachio-latte', anchorTextCandidate: 'Pistachio Latte Recipe', targetSection: 'Introduction', status: 'inserted' },
      { postId: 102, title: 'How to Add Vanilla Extract to Coffee', url: 'https://example.com/vanilla-coffee', anchorTextCandidate: 'how to add vanilla extract to coffee', targetSection: 'Lavender Syrup Ingredients', status: 'inserted' },
      { postId: 103, title: 'Iced Lavender Cream Chai Recipe', url: 'https://example.com/lavender-chai', anchorTextCandidate: 'Iced Lavender Cream Chai Recipe', targetSection: 'Flavor & Taste', status: 'inserted' },
      { postId: 104, title: 'Blueberry Muffin Recipe (Frozen Blueberries)', url: 'https://example.com/blueberry-muffins', anchorTextCandidate: 'Blueberry Muffin Recipe (frozen blueberries)', targetSection: 'Muffins Anyone?', status: 'inserted' }
    ],
    externalSources: [
      {
        name: 'Specialty Coffee Association (SCA)',
        url: 'https://sca.coffee',
        authorityType: 'org',
        context: 'Standard espresso extraction and milk microfoam parameters for specialty latte drinks.',
        status: 'included'
      }
    ],
    improvementPasses: 1,
    factCheckFlags: [],
    isHighRiskContent: false,
    versions: [],
    brief: {
      id: 'brief_lavender_latte',
      primaryKeyword: 'Lavender Latte',
      secondaryKeywords: ['lavender syrup recipe', 'iced lavender latte', 'homemade latte', 'culinary lavender coffee'],
      searchIntent: {
        primaryIntent: 'recipe',
        secondaryIntent: 'how-to',
        userGoal: 'Users searching for "Lavender Latte" seek a clear, delicious homemade recipe with both hot and iced methods, homemade syrup ratios, and flavor notes.',
        expectedContentType: 'Artisan Bakery Recipe & Step-by-Step Guide',
        expectedDepth: 'Complete Walkthrough',
        likelyQuestions: [
          'How do I make lavender syrup for coffee?',
          'Can I make an iced lavender latte?',
          'What does a lavender latte taste like?'
        ],
        commercialViability: 'high'
      },
      targetAudience: 'Home baristas and artisanal coffee lovers',
      contentType: 'recipe',
      recommendedTitle: 'Lavender Latte',
      alternativeTitles: ['Homemade Lavender Latte Recipe (Hot & Iced)'],
      slug: 'lavender-latte',
      metaDescription: 'Learn how to make this easy, fragrant homemade Lavender Latte hot or iced. Includes homemade lavender syrup, sensory flavor profile, nutrition facts, and muffin pairing.',
      alternativeMetaDescriptions: [
        'How to make a Lavender Latte at home: hot & iced recipes, homemade lavender syrup, and sensory flavor breakdown.'
      ],
      h1: 'Lavender Latte',
      outline: [
        { h2: 'Flavor & Taste' },
        { h2: 'Lavender Latte Full Recipe' },
        { h2: 'Nutrition Facts' },
        { h2: 'Iced Lavender Latte Recipe:' },
        { h2: 'Muffins Anyone?' }
      ],
      entities: ['Lavender Latte', 'Culinary Lavender', 'Espresso', 'Simple Syrup', 'Steamed Milk', 'Vanilla Extract'],
      relatedConcepts: ['Flavored lattes', 'Cold brew', 'Herbal syrups', 'Bakery pairings'],
      questionsToAnswer: [
        'How to make homemade lavender syrup?',
        'How to froth milk without a machine?',
        'What are the nutrition facts of a lavender latte?'
      ],
      contentGapsToAddress: ['Exact steeping time for lavender (15 minutes to avoid bitterness)'],
      internalLinkOpportunities: ['/recipes/pistachio-latte', '/recipes/iced-lavender-chai', '/recipes/blueberry-muffins'],
      externalSourceOpportunities: [
        {
          type: 'org',
          name: 'Specialty Coffee Association (SCA)',
          relevance: 'Milk steaming temperature guidelines (140-155°F) for maximum natural sweetness.'
        }
      ],
      imageRecommendations: [
        { placement: 'Hero', concept: 'Hot lavender latte in ceramic mug with latte art', altTextSuggestion: 'Lavender Latte with foam art and dried lavender flowers' },
        { placement: 'Flavor & Taste', concept: 'Wooden scoop, coffee beans, lavender flowers', altTextSuggestion: 'Taste profile ingredients' },
        { placement: 'Full Recipe', concept: 'Espresso extraction', altTextSuggestion: 'Brewing espresso for latte' },
        { placement: 'Syrup Instructions', concept: 'Lavender flower field', altTextSuggestion: 'Lavender syrup' },
        { placement: 'Iced Recipe', concept: 'Two tall glasses of iced latte', altTextSuggestion: 'Iced Lavender Latte' },
        { placement: 'Muffins', concept: 'Hands breaking open warm blueberry muffin', altTextSuggestion: 'Warm blueberry muffins' }
      ],
      schemaRecommendation: 'Recipe',
      suggestedWordCount: 1650,
      createdAt: new Date().toISOString()
    }
  },
  {
    id: 'art_honey_garlic_shrimp',
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
        { h2: 'Ingredients You\'ll Need' },
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
  },
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
