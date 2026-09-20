/**
 * Lone Goose Bakery Primary Content & Artisan Recipe Prompt Engine
 * Enforces the authentic Lone Goose Bakery writing style:
 * - Conversational, warm, personal 1st-person artisan baker/coffee craft maker voice ("I", "my lineup", "trust me", "let's get started!")
 * - Relatable seasonal or routine opening hook with natural internal recipe links
 * - Sensory "Flavor & Taste" breakdown (balance, aroma, sweetness, mouthfeel, finish)
 * - Full recipe walkthrough with modular sub-components (homemade syrups/bases) + primary item
 * - Bulleted exact measurements, simmering/steeping times, straining, airtight fridge shelf-life, and "Bonus Tip:"
 * - Itemized "Nutrition Facts" with serving context
 * - Dedicated "Iced [Item] Recipe" variation with cold brew/espresso and ice steps
 * - Warm pairing recommendation section ("Muffins Anyone?" with blueberry muffin interlink)
 * - Category classification & prev/next breadcrumb links
 * - Zero robotic AI clichés or sterile corporate jargon
 */

export const LONE_GOOSE_BAKERY_SYSTEM_PROMPT = `You are the Head Artisan Baker & Content Creator for Lone Goose Bakery (lonegoosebakery.com), a beloved family craft bakery and specialty coffee shop known for delicious homemade recipes, artisanal coffee syrups, and comforting baked goods.

Your goal is to write delightful, approachable, high-ranking, and genuinely helpful articles and recipes that readers love to bake, brew, and share. Every article must follow the exact Lone Goose Bakery tone of voice and multi-part structure.

TONE OF VOICE & WRITING STYLE (LONE GOOSE BAKERY STYLE):
1. Warm, Personal & Encouraging: Write in the 1st person ("I", "my lineup", "trust me—once you try it, you'll wonder why you didn't make this sooner"). Speak like a knowledgeable friend sharing their favorite kitchen creation.
2. Relatable Hooks: Start with a personal, seasonal, or morning-routine hook. Connect with the reader's everyday cravings.
3. Natural Internal Linking: Naturally weave in links to related bakery recipes (e.g., "[Pistachio Latte Recipe]", "[how to add vanilla extract to coffee]", "[Iced Lavender Cream Chai Recipe]", "[Blueberry Muffin Recipe (frozen blueberries)]").
4. Clear & Accessible Instructions: Keep paragraphs short (2–3 sentences). Use bullet points for exact measurements and numbered lists for sequential steps.
5. High Sensory Detail: Describe taste, aroma, temperature, foam texture, sweetness levels, and finish vividly without exaggerated marketing hype.
6. Zero AI Clichés: Strict ban on robotic buzzwords (delve, tapestry, landscape, robust, seamless, elevate, empower, embark, testament to, game-changer, in conclusion, furthermore).

MANDATORY LONE GOOSE BAKERY ARTICLE STRUCTURE (ALL ARTICLES MUST FOLLOW THIS EXACT ANATOMY):

# [Item / Recipe Title]
(e.g., # Lavender Latte)

[Hero Image description or markdown: ![Hero Visual](image_url)]

[Warm Opening Hook]: 2–3 friendly paragraphs. Connect to the season, routine, or kitchen inspiration. Explain why the pairing works, mention that it's easy to make at home (hot or iced), include an internal recipe link, and end with an inviting kickoff like "Let's get started!"

## Flavor & Taste
[Sensory Visual: ![Flavor & Taste](image_url)]
Provide a rich, sensory description of the taste profile: the balance between rich espresso/base, creamy milk, and delicate flavor notes. Describe the aroma, sweetness, and lingering finish.
Include a recommendation link: "If you want a more complex and delicious flavor, check out our [Related Recipe]!"

## [Item Title] Full Recipe
[Prep Visual: ![Full Recipe Preparation](image_url)]
A friendly introductory bridge paragraph explaining that the recipe begins with the homemade syrup/base, followed by the hot preparation, plus an iced version below.

### [Component/Syrup] Ingredients:
Bullet list with exact measurements:
- 1/2 cup Water
- 1/2 cup Granulated Sugar
- 1 tsp Vanilla Extract (learn [how to add vanilla extract to coffee])
- 1 tbsp Dried Culinary Lavender (or key flavor ingredient)

### [Component/Syrup] Instructions:
[Component Visual: ![Component Process](image_url)]
Bulleted step-by-step instructions covering:
- Simmering over medium heat until sugar dissolves
- Steeping off heat for 15 minutes to infuse flavor
- Straining through fine mesh strainer or cheesecloth
- Storing in an airtight container in the fridge for up to 2 weeks
Bonus Tip: "Bonus Tip: The [Component] can be also used in other drinks like tea and lemonade, get creative!"

### [Item Title] Ingredients:
Bullet list with exact measurements:
- 1 shot of espresso or 1/2 cup strong brewed coffee
- 3/4 cup milk (or non-dairy alternative)
- 1 tbsp lavender syrup (from above)
- Dried Lavender for Topping (optional)

### [Item Title] Instructions:
[Brewing/Machine Visual: ![Espresso Machine](image_url)]
Numbered sequential steps:
1. Grab your chosen mug, and add in 1 tbsp of Lavender Syrup (from above). If you like a sweeter latte, add 2 tbsp.
2. Prepare the shot of espresso or brew the strong coffee. Add it to the Chosen Mug.
3. Heat the milk in a small saucepan or froth it using a frother until steaming and slightly foamy, stir gently to mix together.
4. Add a sprinkle of dried lavender as an optional topping, then enjoy your Lavender Latte while it is still warm!

## Nutrition Facts
Intro sentence: "These Hot [Item] nutrition facts assume the use of skim milk, and it is for one serving."
Bullet list:
- Calories: 75
- Total Fat: 0 g
- Saturated Fat: 0 g
- Cholesterol: 2 mg
- Sodium: 65 mg
- Total Carbs: 15 g
- Sugars: 14 g
- Protein: 6 g

## Iced [Item Title] Recipe:
[Iced Visual: ![Iced Variation](image_url)]
### Ingredients:
- 1 shot of espresso or 1/2 cup strong brewed coffee (cooled)
- 3/4 cup milk (or non-dairy alternative i.e. oat, almond, etc.)
- 1 tbsp lavender syrup (from above)
- 3/4 - 1 cup of ice
- Dried Lavender for Topping (optional)

### Instructions:
[Iced Pouring Visual: ![Pouring coffee over ice](image_url)]
Numbered steps:
1. Brew your espresso or 1/2 cup of strong coffee and let it cool in the fridge while you move on to the next step.
2. Add 1 tablespoon of lavender syrup (or 2 tbsp, depending on how sweet you like it).
3. Fill a glass with ice.
4. Pour the cooled espresso or coffee over the ice.
5. Pour in the cold milk and stir gently to combine.
6. Garnish with a pinch of dried lavender for an optional topping. Enjoy your Iced Lavender Latte!

## Muffins Anyone?
[Muffins Visual: ![Warm fresh blueberry muffins broken open](image_url)]
"Now that you've finished your Hot or Iced Lavender Latte, you need something to enjoy it with. You need to see our [Blueberry Muffin Recipe (frozen blueberries)]. It makes muffins that go great with any latte!"

*Posted in Homemade Latte & Espresso Recipes*

[← Valentine's Day M&M Cookies](https://example.com/cookies) | [Protein Latte →](https://example.com/protein-latte)`;

// Backwards compatibility aliases
export const SCIENTIFIC_KNOWLEDGE_HUB_SYSTEM_PROMPT = LONE_GOOSE_BAKERY_SYSTEM_PROMPT;
export const SENIOR_CONTENT_WRITER_SYSTEM_PROMPT = LONE_GOOSE_BAKERY_SYSTEM_PROMPT;

export interface SeniorWriterPromptInput {
  keyword: string;
  secondaryKeywords?: string[];
  intent: string;
  audience?: string;
  voiceNotes?: string;
  wordCount?: number;
  competitorUrls?: string[];
  outlineItems?: Array<{ h2: string; h3s?: string[]; keyPoints?: string[] }>;
  templateDirectives?: string;
}

export interface SeniorWriterOutlinePromptInput {
  keyword: string;
  secondaryKeywords?: string[];
  intent?: string;
  audience?: string;
  tone?: string;
  articleType?: string;
  targetWordCount?: number;
  competitorGaps?: any;
}

/**
 * Builds the Outline Generation Prompt governed by the Lone Goose Bakery Primary Prompt.
 * Enforces the mandatory Lone Goose Bakery structure with flavor & taste sensory breakdown,
 * modular syrup/sub-component recipe, primary item recipe, nutrition facts, iced variation, and muffin pairing.
 */
export function buildSeniorWriterOutlinePrompt(input: SeniorWriterOutlinePromptInput): string {
  const secondaryKws = (input.secondaryKeywords && input.secondaryKeywords.length > 0)
    ? input.secondaryKeywords.join(', ')
    : 'None specified (prioritize natural recipe depth)';

  return `You are the Head Artisan Baker and Content Creator for Lone Goose Bakery (lonegoosebakery.com).
Create a structured Outline Blueprint for a delightful, Page 1 Google-ranking artisanal recipe and guide on the topic: "${input.keyword}".

Primary Keyword: "${input.keyword}"
Secondary Keywords: ${secondaryKws}
Search Intent: ${input.intent || 'Delightful artisan recipe and practical kitchen guide'}
Target Audience: ${input.audience || 'Coffee lovers, home bakers, and food enthusiasts wanting easy gourmet recipes'}
Target Word Count: ${input.targetWordCount || 1600} words

MANDATORY LONE GOOSE BAKERY OUTLINE STRUCTURE (MUST BE STRICTLY FOLLOWED):
1. H1: Clear, inviting title containing "${input.keyword}" (e.g. "${input.keyword}").
2. Hero Visual: Aesthetic presentation image description.
3. Warm Opening Hook: 2–3 personal, welcoming paragraphs connecting to season or daily morning routine with internal recipe links and "Let's get started!".
4. H2: Flavor & Taste (Sensory breakdown of sweetness, richness, aroma, creamy mouthfeel, delicate floral/spice notes, and finish + related recipe link).
5. H2: ${input.keyword} Full Recipe (Overview bridging paragraph).
6. H3: [Sub-component/Syrup] Ingredients: (Exact measurements list with culinary tips).
7. H3: [Sub-component/Syrup] Instructions: (Simmering, steeping 15 mins, fine-mesh straining, fridge storage up to 2 weeks + Bonus Tip).
8. H3: ${input.keyword} Ingredients: (Espresso/coffee, dairy or non-dairy milk, syrup, topping).
9. H3: ${input.keyword} Instructions: (Numbered steps 1-4 for mug, syrup, espresso, steamed milk, and garnish).
10. H2: Nutrition Facts (Serving context sentence + Calories, Fat, Saturated Fat, Cholesterol, Sodium, Carbs, Sugars, Protein).
11. H2: Iced ${input.keyword} Recipe: (Iced ingredients list + 6-step numbered instructions for brewing, cooling, ice, and pouring).
12. H2: Muffins Anyone? (Warm closing pairing recommendation interlinking to Blueberry Muffin Recipe).
13. Category Tag & Prev/Next recipe links.

Writing Rules:
- Conversational, warm, personal 1st-person voice ("I", "my lineup", "trust me").
- Short, mobile-friendly paragraphs (2–3 sentences).
- Zero robotic AI clichés or corporate jargon.
- Exact measurements and clear sequential numbered steps.

Return valid JSON adhering to this schema:
{
  "recommendedTitle": string,
  "metaDescription": string,
  "outline": [
    {
      "h2": string,
      "h3s": string[],
      "keyPoints": string[],
      "suggestedVisual": string,
      "hasTable": boolean
    }
  ],
  "entities": string[],
  "faqs": string[],
  "suggestedWordCount": number
}`;
}

/**
 * Builds the user message prompt using the exact Lone Goose Bakery Primary Prompt.
 */
export function buildSeniorWriterUserPrompt(input: SeniorWriterPromptInput): string {
  const secondaryKws = (input.secondaryKeywords && input.secondaryKeywords.length > 0)
    ? input.secondaryKeywords.join(', ')
    : 'None specified (prioritize natural kitchen craft depth)';

  const competitorPages = (input.competitorUrls && input.competitorUrls.length > 0)
    ? input.competitorUrls.map((u, i) => `${i + 1}. ${u}`).join('\n')
    : 'None provided. Focus on authentic craft recipes, clear measurements, and inviting storytelling.';

  let outlineText = '';
  if (input.outlineItems && input.outlineItems.length > 0) {
    outlineText = `\nRECOMMENDED CONTENT BLUEPRINT & HEADING STRUCTURE:\n` +
      input.outlineItems.map((sec, idx) => {
        const subs = (sec.h3s && sec.h3s.length > 0) ? `\n   Subsections (###): ${sec.h3s.join(', ')}` : '';
        const points = (sec.keyPoints && sec.keyPoints.length > 0) ? `\n   Artisan details: ${sec.keyPoints.join('; ')}` : '';
        return `${idx + 1}. ## ${sec.h2}${subs}${points}`;
      }).join('\n');
  }

  const templateSection = input.templateDirectives ? `\nADDITIONAL FORMAT DIRECTIVES:\n${input.templateDirectives}\n` : '';

  return `You are the Head Artisan Baker & Content Creator for Lone Goose Bakery (lonegoosebakery.com).
Write an engaging, SEO-optimized, beautifully structured recipe article on the topic: ${input.keyword}.

Tone of Voice & Writing Style:
- Warm, personal, 1st person artisan craft voice ("I", "my lineup", "trust me—once you try it, you'll wonder why you didn't make this sooner").
- Relatable hook: Start with a personal, seasonal, or morning routine inspiration. Connect with everyday cravings.
- Natural internal linking: Weave in relevant links to sister recipes (e.g. "[Pistachio Latte Recipe]", "[how to add vanilla extract to coffee]", "[Iced Lavender Cream Chai Recipe]", "[Blueberry Muffin Recipe (frozen blueberries)]").
- Short, breezy paragraphs (strictly 2–3 sentences).
- Descriptive sensory language: Highlight aroma, mouthfeel, sweetness balance, and lingering notes.
- Zero AI clichés: Never use delve, tapestry, landscape, robust, paramount, pivotal, seamless, holistic, synergy, elevate, empower, embark, groundbreaking, game-changer, in conclusion.

MANDATORY LONE GOOSE BAKERY CONTENT STRUCTURE (Follow this exact hierarchy):

# ${input.keyword}

![${input.keyword}](https://images.unsplash.com/photo-1541167760496-1628856ab772?w=1200&auto=format&fit=crop&q=80)

[Opening story: 2–3 warm, personal paragraphs. Connect with the season or daily coffee/baking routine. Share why this flavor combination is irresistible. Include an internal link to a sister recipe like [Pistachio Latte Recipe]. Mention whether they prefer it hot or iced, reassure them that it's simple to make at home, and end with "Let's get started!"]

## Flavor & Taste

![Taste](https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=1200&auto=format&fit=crop&q=80)

[Rich sensory description of the flavor profile: the balance of rich espresso or base, creamy milk, and delicate aromatic notes. Describe how gentle sweetness lends a soothing quality to each sip with a gentle, lingering finish.]

If you want a more complex and delicious flavor, check out our [Iced Lavender Cream Chai Recipe]!

## ${input.keyword} Full Recipe

![Preparation](https://images.unsplash.com/photo-1517256064527-09c73fc73e38?w=1200&auto=format&fit=crop&q=80)

This simple method will begin by showing you how to make homemade Syrup / Base (just like our [Homemade Pistachio Syrup Recipe]). Next, I'll show you how to use the syrup to make a delicious Hot ${input.keyword}. Looking for a cooler option? I include a recipe for an Iced ${input.keyword} below as well!

### Syrup Ingredients:
- 1/2 cup Water
- 1/2 cup Granulated Sugar
- 1 tsp Vanilla Extract (learn [how to add vanilla extract to coffee])
- 1 tbsp Key Flavoring / Botanical / Spice

### Syrup Instructions:

![Syrup Process](https://images.unsplash.com/photo-1528183429752-a97d0bf99b5a?w=1200&auto=format&fit=crop&q=80)

- In a small saucepan, combine water, granulated sugar, and flavoring. Bring to a gentle simmer over medium heat, stirring until the sugar fully dissolves.
- Once the mixture reaches a gentle simmer and the sugar dissolves, remove from heat and stir in the vanilla extract. Let steep for 15 minutes to infuse the flavor.
- Pour the syrup through a fine mesh strainer or cheesecloth to remove any botanical pieces.
- Use the syrup for the recipe below, and store the rest in an airtight container in the fridge for up to 2 weeks.

**Bonus Tip:** The syrup can also be used in other drinks like tea and lemonade, get creative!

### ${input.keyword} Ingredients:
- 1 shot of espresso or 1/2 cup strong brewed coffee
- 3/4 cup milk (or non-dairy alternative)
- 1 tbsp syrup (from above)
- Optional topping / garnish

### ${input.keyword} Instructions:

![Brewing](https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?w=1200&auto=format&fit=crop&q=80)

1. Grab your chosen mug, and add in 1 tbsp of syrup (from above). If you like a sweeter drink, add 2 tbsp.
2. Prepare the shot of espresso or brew the strong coffee. Add it to the Chosen Mug.
3. Heat the milk in a small saucepan or froth it using a frother until steaming and slightly foamy, stir gently to mix together.
4. Add a sprinkle of topping as an optional garnish, then enjoy your ${input.keyword} while it is still warm!

## Nutrition Facts

These Hot ${input.keyword} nutrition facts assume the use of skim milk, and it is for one serving.

- Calories: 75
- Total Fat: 0 g
- Saturated Fat: 0 g
- Cholesterol: 2 mg
- Sodium: 65 mg
- Total Carbs: 15 g
- Sugars: 14 g
- Protein: 6 g

## Iced ${input.keyword} Recipe:

![Iced](https://images.unsplash.com/photo-1517701604599-bb29b565090c?w=1200&auto=format&fit=crop&q=80)

### Ingredients:
- 1 shot of espresso or 1/2 cup strong brewed coffee (cooled)
- 3/4 cup milk (or non-dairy alternative i.e. oat, almond, etc.)
- 1 tbsp syrup (from above)
- 3/4 - 1 cup of ice
- Optional topping for garnish

### Instructions:

![Pouring](https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=1200&auto=format&fit=crop&q=80)

1. Brew your espresso or 1/2 cup of strong coffee and let it cool in the fridge while you move on to the next step.
2. Add 1 tablespoon of syrup (or 2 tbsp, depending on how sweet you like it).
3. Fill a glass with ice.
4. Pour the cooled espresso or coffee over the ice.
5. Pour in the cold milk and stir gently to combine.
6. Garnish with a pinch of topping for an optional garnish. Enjoy your Iced ${input.keyword}!

## Muffins Anyone?

![Warm Muffins](https://images.unsplash.com/photo-1586985289688-ca3cf47d3e6e?w=1200&auto=format&fit=crop&q=80)

Now that you've finished your Hot or Iced ${input.keyword}, you need something to enjoy it with. You need to see our [Blueberry Muffin Recipe (frozen blueberries)]. It makes muffins that go great with any latte!

*Posted in Homemade Latte & Espresso Recipes*

[← Valentine's Day M&M Cookies](https://example.com/cookies) | [Protein Latte →](https://example.com/protein-latte)

INPUT DETAILS:
Primary keyword: ${input.keyword}
Secondary/related keywords: ${secondaryKws}
Search intent: ${input.intent}
Target audience: ${input.audience || 'Coffee lovers and home bakers looking for easy artisan recipes'}
Target word count: ${input.wordCount || 1600} words.
${templateSection}${outlineText}

OUTPUT FORMAT:
Return pure Markdown starting with "# ${input.keyword}". Follow the exact Lone Goose Bakery structure above.`;
}

/**
 * Banned AI phrases from Step 3 for deterministic audit & sanitation
 */
export const BANNED_AI_WORDS_REGEX: Array<{ pattern: RegExp; replacement: string; reason: string }> = [
  // Inflated AI verbs
  { pattern: /\bdelve(s|d|ing)?\b/gi, replacement: 'examine$1', reason: 'Statistical tell of AI writing' },
  { pattern: /\btapestry\b/gi, replacement: 'mix', reason: 'AI cliché metaphor' },
  { pattern: /\bunderscore(s|d|ing)?\b/gi, replacement: 'highlight$1', reason: 'AI tell' },
  { pattern: /\bintricate\b/gi, replacement: 'detailed', reason: 'AI tell' },
  { pattern: /\bmeticulous(ly)?\b/gi, replacement: 'careful$1', reason: 'AI tell' },
  { pattern: /\bshowcase(s|d|ing)?\b/gi, replacement: 'show$1', reason: 'AI buzzword' },
  { pattern: /\bboast(s|ed|ing)?\b/gi, replacement: 'feature$1', reason: 'AI tell' },
  { pattern: /\brealm\b/gi, replacement: 'field', reason: 'AI cliché' },
  { pattern: /\btestament to\b/gi, replacement: 'proof of', reason: 'AI cliché' },
  { pattern: /\bunlock the power of\b/gi, replacement: 'use', reason: 'AI cliché' },
  { pattern: /\bunlock(s|ed|ing)?\b/gi, replacement: 'access', reason: 'AI marketing buzzword' },
  { pattern: /\bunleash(es|ed|ing)?\b/gi, replacement: 'release', reason: 'AI buzzword' },
  { pattern: /\bharness(es|ed|ing)?\b/gi, replacement: 'use', reason: 'AI buzzword' },
  { pattern: /\bleverage(s|d|ing)?\b/gi, replacement: 'use', reason: 'Banned verb leverage' },
  { pattern: /\belevate(s|d|ing)?\b/gi, replacement: 'improve', reason: 'AI buzzword' },
  { pattern: /\bempower(s|ed|ing)?\b/gi, replacement: 'help', reason: 'AI buzzword' },
  { pattern: /\brobust(ly)?\b/gi, replacement: 'reliable', reason: 'AI cliché' },
  { pattern: /\bseamless(ly)?\b/gi, replacement: 'smooth$1', reason: 'AI cliché' },
  { pattern: /\bholistic(ally)?\b/gi, replacement: 'complete', reason: 'AI buzzword' },
  { pattern: /\bsynergy\b/gi, replacement: 'coordination', reason: 'Corporate buzzword' },
  { pattern: /\bparadigm\b/gi, replacement: 'model', reason: 'Corporate buzzword' },
  { pattern: /\bbespoke\b/gi, replacement: 'custom', reason: 'AI tell' },
  { pattern: /\bcutting-edge\b/gi, replacement: 'modern', reason: 'AI cliché' },
  { pattern: /\bgame-changer\b/gi, replacement: 'major shift', reason: 'AI marketing hype' },
  { pattern: /\bgroundbreaking\b/gi, replacement: 'innovative', reason: 'AI hype' },
  { pattern: /\brevolutionize(s|d|ing)?\b/gi, replacement: 'change', reason: 'AI hype' },
  { pattern: /\btransformative\b/gi, replacement: 'significant', reason: 'AI tell' },
  { pattern: /\bembark(s|ed|ing)?\b/gi, replacement: 'start', reason: 'AI tell' },
  { pattern: /\bfoster(s|ed|ing)?\b/gi, replacement: 'support', reason: 'AI tell' },
  { pattern: /\bcultivate(s|d|ing)?\b/gi, replacement: 'develop', reason: 'AI tell' },
  { pattern: /\bcomprehensive\b/gi, replacement: 'complete', reason: 'AI tell' },
  { pattern: /\bpivotal\b/gi, replacement: 'key', reason: 'AI tell' },
  { pattern: /\bparamount\b/gi, replacement: 'vital', reason: 'AI tell' },
  { pattern: /\bcrucial\b/gi, replacement: 'essential', reason: 'Overused AI tell' },
  { pattern: /\bessentially\b/gi, replacement: 'basically', reason: 'AI filler' },
  { pattern: /\bindeed\b/gi, replacement: 'in fact', reason: 'AI filler' },
  { pattern: /\bremarkably\b/gi, replacement: 'notably', reason: 'AI filler' },
  { pattern: /\bfacilitate(s|d|ing)?\b/gi, replacement: 'ease', reason: 'AI tell' },
  { pattern: /\butilize(s|d|ing)?\b/gi, replacement: 'use', reason: 'Say use, not utilize' },
  { pattern: /\bbolster(s|ed|ing)?\b/gi, replacement: 'support$1', reason: 'AI overused verb' },
  { pattern: /\bspearhead(s|ed|ing)?\b/gi, replacement: 'lead$1', reason: 'AI buzzword' },
  { pattern: /\bpropel(s|ed|ing)?\b/gi, replacement: 'drive$1', reason: 'AI cliché' },
  { pattern: /\btranscend(s|ed|ing)?\b/gi, replacement: 'exceed$1', reason: 'AI hyperbole' },
  { pattern: /\bsupercharge(s|d|ing)?\b/gi, replacement: 'boost$1', reason: 'AI marketing hype' },
  { pattern: /\bcatalyze(s|d|ing)?\b/gi, replacement: 'trigger$1', reason: 'AI science jargon' },

  // Metaphors & stock filler nouns
  { pattern: /\bbeacon of\b/gi, replacement: 'guide for', reason: 'AI metaphor cliché' },
  { pattern: /\bsymphony of\b/gi, replacement: 'combination of', reason: 'AI music analogy' },
  { pattern: /\bharmonious (dance|balance)\b/gi, replacement: 'balance', reason: 'AI poetic cliché' },
  { pattern: /\bcornerstone\b/gi, replacement: 'foundation', reason: 'AI structural cliché' },
  { pattern: /\blinchpin\b/gi, replacement: 'core element', reason: 'AI cliché' },
  { pattern: /\bpowerhouse\b/gi, replacement: 'strong system', reason: 'AI hyperbole' },
  { pattern: /\bunsung hero\b/gi, replacement: 'vital element', reason: 'AI cliché' },
  { pattern: /\bsecret weapon\b/gi, replacement: 'effective tool', reason: 'AI cliché' },
  { pattern: /\bplethora of\b/gi, replacement: 'many', reason: 'AI inflated quantifier' },
  { pattern: /\bmyriad of\b/gi, replacement: 'wide variety of', reason: 'AI inflated quantifier' },
  { pattern: /\bquintessential\b/gi, replacement: 'typical', reason: 'AI inflated adjective' },
  { pattern: /\bunparalleled\b/gi, replacement: 'unique', reason: 'AI hyperbole' },
  { pattern: /\bindelible\b/gi, replacement: 'lasting', reason: 'AI cliché' },
  { pattern: /\blabyrinthine\b/gi, replacement: 'complex', reason: 'AI cliché' },
  { pattern: /\bbreathtaking\b/gi, replacement: 'impressive', reason: 'AI emotional hype' },
  { pattern: /\bstaggering\b/gi, replacement: 'large', reason: 'AI emotional hype' },

  // Cliché time & throat-clearing intros
  { pattern: /\bin today's (fast-paced|digital|modern)?\s*world\b/gi, replacement: 'currently', reason: 'AI cliché intro' },
  { pattern: /\bin the digital (landscape|era|age)\b/gi, replacement: 'today', reason: 'AI cliché intro' },
  { pattern: /\bin an era (where|of)\b/gi, replacement: 'today', reason: 'AI cliché intro' },
  { pattern: /\bin a world where\b/gi, replacement: 'when', reason: 'AI cliché intro' },
  { pattern: /\bnavigating the complexities of\b/gi, replacement: 'understanding', reason: 'AI throat-clearing' },
  { pattern: /\bnavigating the landscape of\b/gi, replacement: 'exploring', reason: 'AI throat-clearing' },
  { pattern: /\bit'?s worth noting that\b/gi, replacement: 'Note:', reason: 'AI throat-clearing' },
  { pattern: /\bit'?s important to note that\b/gi, replacement: 'Note:', reason: 'AI throat-clearing' },
  { pattern: /\bit should be noted that\b/gi, replacement: 'Note:', reason: 'AI throat-clearing' },
  { pattern: /\bneedless to say\b/gi, replacement: 'clearly', reason: 'AI filler' },
  { pattern: /\bit goes without saying\b/gi, replacement: 'clearly', reason: 'AI filler' },
  { pattern: /\bcannot be overstated\b/gi, replacement: 'is vital', reason: 'AI cliché' },
  { pattern: /\bat the end of the day\b/gi, replacement: 'ultimately', reason: 'AI conversational cliché' },
  { pattern: /\bwhen all is said and done\b/gi, replacement: 'ultimately', reason: 'AI conversational cliché' },
  { pattern: /\bwhen it comes to\b/gi, replacement: 'for', reason: 'AI conversational filler' },
  { pattern: /\blook no further\b/gi, replacement: '', reason: 'AI sales cliché' },
  { pattern: /\bwithout further ado\b/gi, replacement: '', reason: 'AI throat-clearing' },
  { pattern: /\bdive (into|in)\b/gi, replacement: 'explore', reason: 'AI cliché' },
  { pattern: /\bbreak barriers\b/gi, replacement: 'make progress', reason: 'AI cliché' },
  { pattern: /\bhave you ever wondered\b/gi, replacement: '', reason: 'Formulaic rhetorical AI hook' },

  // Mechanical transitional crutches
  { pattern: /\b(?:Furthermore|Moreover),\s*/gi, replacement: 'In addition, ', reason: 'Mechanical AI transition' },
  { pattern: /\bConsequently,\s*/gi, replacement: 'As a result, ', reason: 'Formal AI transition' },
  { pattern: /\bAccordingly,\s*/gi, replacement: 'Therefore, ', reason: 'Formal AI transition' },
  { pattern: /\bNevertheless,\s*/gi, replacement: 'Still, ', reason: 'Formal AI transition' },
  { pattern: /\bNotwithstanding,\s*/gi, replacement: 'Despite this, ', reason: 'Formal AI transition' },
  { pattern: /\bConversely,\s*/gi, replacement: 'In contrast, ', reason: 'Formal AI transition' },
  { pattern: /\bin conclusion\b/gi, replacement: 'Summary', reason: 'Banned in conclusion formula' }
];

/**
 * Sanitizes and audits content according to Step 3 of the Senior Content Writer guidelines.
 * Rewrites detected banned AI phrases, strips robotic throat-clearing, and enforces Grade 6 simplicity.
 */
export function sanitizeAndEnforceHumanWriting(content: string): {
  content: string;
  substitutionsCount: number;
  detectedBannedPhrases: string[];
} {
  let updated = content;
  let count = 0;
  const detected: string[] = [];

  for (const { pattern, replacement, reason } of BANNED_AI_WORDS_REGEX) {
    if (pattern.test(updated)) {
      detected.push(`${pattern.source} (${reason})`);
      updated = updated.replace(pattern, (match) => {
        count++;
        // Match capitalization of original word if possible
        if (match[0] === match[0].toUpperCase() && replacement.length > 0) {
          return replacement.charAt(0).toUpperCase() + replacement.slice(1);
        }
        return replacement;
      });
    }
  }

  // Clean trailing participle fluff: e.g. ", ensuring that..." -> ". This ensures that..."
  updated = updated.replace(/,\s+(?:thereby\s+)?ensuring\s+(that\s+)?/gi, '. This ensures that ');
  updated = updated.replace(/,\s+(?:thereby\s+)?allowing\s+(?:users|readers|people|researchers)\s+to\s+/gi, '. This helps people ');
  updated = updated.replace(/,\s+highlighting\s+the\s+(?:importance|need)\s+of\s+/gi, '. This highlights the role of ');
  updated = updated.replace(/,\s+paving\s+the\s+way\s+for\s+/gi, '. This enables ');

  // Clean conversational fluff openers
  updated = updated.replace(/^(?:Let's explore|Let's take a look at|Let's dive into|In this section, we will discuss)\s+/gim, '');

  // Ensure conclusion headers match the required Scientific Knowledge Hub structure ("## Conclusion")
  updated = updated.replace(/##\s+(?:In Conclusion|Wrapping Up|Final Thoughts|Concluding Thoughts)\s*\n+/gi, '## Conclusion\n\n');

  // Clean double spaces or broken punctuation
  updated = updated.replace(/\s{2,}/g, ' ');
  updated = updated.replace(/\s+([,\.\?\!])/g, '$1');

  return {
    content: updated,
    substitutionsCount: count,
    detectedBannedPhrases: detected
  };
}

export interface HumanQualityAuditResult {
  humanScore: number; // 0 - 100
  readingLevelGrade: number; // e.g. 6.2
  readingLevelLabel: string; // e.g. "Grade 6.2 (Ideal for Scientific Knowledge Hub)"
  burstinessScore: number; // standard deviation of sentence lengths
  burstinessRating: 'High (Natural Cadence)' | 'Medium (Balanced)' | 'Low (Robotic Cadence)';
  detectedSlopCount: number;
  detectedSlopList: string[];
  directAnswerScore: number; // percentage of H2/H3s having direct answer in first 2 sentences
  paragraphLengthAvgLines: number;
  suggestions: string[];
}

/**
 * Calculates Flesch-Kincaid Grade Level, sentence burstiness, and detects AI slop density.
 */
export function auditContentHumanQuality(content: string): HumanQualityAuditResult {
  if (!content || content.trim().length === 0) {
    return {
      humanScore: 100,
      readingLevelGrade: 6.0,
      readingLevelLabel: 'Grade 6.0 (Clear)',
      burstinessScore: 7.5,
      burstinessRating: 'High (Natural Cadence)',
      detectedSlopCount: 0,
      detectedSlopList: [],
      directAnswerScore: 100,
      paragraphLengthAvgLines: 2.2,
      suggestions: []
    };
  }

  // Strip Markdown headings, tables, links, and code for linguistic evaluation
  const cleanText = content
    .replace(/^#+\s+.+$/gm, '')
    .replace(/\|.+?\|/g, '')
    .replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1')
    .replace(/[`*_~>]/g, '')
    .trim();

  // Split into sentences
  const sentences = cleanText
    .split(/(?<=[.?!])\s+(?=[A-Z0-9])/)
    .map(s => s.trim())
    .filter(s => s.length > 5);

  const words = cleanText.split(/\s+/).filter(w => w.length > 0);
  const wordCount = Math.max(1, words.length);
  const sentenceCount = Math.max(1, sentences.length);

  // Approximate syllable counter
  let totalSyllables = 0;
  for (const w of words) {
    const cleanWord = w.toLowerCase().replace(/[^a-z]/g, '');
    if (cleanWord.length <= 3) {
      totalSyllables += 1;
    } else {
      const syl = cleanWord.replace(/(?:[^laeiouy]|ed|es|e)$/, '')
        .replace(/^y/, '')
        .match(/[aeiouy]{1,2}/g);
      totalSyllables += syl ? Math.max(1, syl.length) : 1;
    }
  }

  // Flesch-Kincaid Grade Level formula: 0.39 * (words/sentences) + 11.8 * (syllables/words) - 15.59
  const avgSentenceLength = wordCount / sentenceCount;
  const avgSyllablesPerWord = totalSyllables / wordCount;
  let fkGrade = 0.39 * avgSentenceLength + 11.8 * avgSyllablesPerWord - 15.59;
  fkGrade = Math.max(3.0, Math.min(14.0, Math.round(fkGrade * 10) / 10));

  let readingLevelLabel = `Grade ${fkGrade.toFixed(1)}`;
  if (fkGrade <= 7.0) {
    readingLevelLabel += ' (Grade 6 Target - Highly Accessible & Clear)';
  } else if (fkGrade <= 9.0) {
    readingLevelLabel += ' (Moderate - Consider shorter words)';
  } else {
    readingLevelLabel += ' (Advanced - Simplify vocabulary for Grade 6)';
  }

  // Calculate burstiness (Standard deviation of sentence word counts)
  const sentenceLengths = sentences.map(s => s.split(/\s+/).length);
  const meanLength = avgSentenceLength;
  const variance = sentenceLengths.reduce((acc, len) => acc + Math.pow(len - meanLength, 2), 0) / Math.max(1, sentenceLengths.length);
  const burstinessScore = Math.round(Math.sqrt(variance) * 10) / 10;

  let burstinessRating: 'High (Natural Cadence)' | 'Medium (Balanced)' | 'Low (Robotic Cadence)';
  if (burstinessScore >= 6.0) {
    burstinessRating = 'High (Natural Cadence)';
  } else if (burstinessScore >= 3.5) {
    burstinessRating = 'Medium (Balanced)';
  } else {
    burstinessRating = 'Low (Robotic Cadence)';
  }

  // Detect AI slop instances
  const detectedSlopList: string[] = [];
  let detectedSlopCount = 0;
  for (const { pattern, reason } of BANNED_AI_WORDS_REGEX) {
    const matches = content.match(pattern);
    if (matches) {
      detectedSlopCount += matches.length;
      detectedSlopList.push(`${matches[0]} (${reason})`);
    }
  }

  // Check direct answers under headings
  const h2Matches = content.match(/##\s+[^\n]+\n+([^\n#]+)/g) || [];
  let directAnswerPasses = 0;
  for (const block of h2Matches) {
    const lines = block.split('\n').filter(l => l.trim().length > 0);
    if (lines.length >= 2) {
      const firstBodyLine = lines[1].trim();
      // Check if it starts with direct factual phrasing (no rhetorical question, no throat-clearing)
      if (!/^(have you ever|let's|in this section|before we|it is worth|it is important)/i.test(firstBodyLine)) {
        directAnswerPasses++;
      }
    }
  }
  const directAnswerScore = h2Matches.length > 0 ? Math.round((directAnswerPasses / h2Matches.length) * 100) : 100;

  // Estimate average paragraph length
  const paragraphs = content
    .split(/\n{2,}/)
    .filter(p => !p.trim().startsWith('#') && !p.trim().startsWith('|') && p.trim().length > 20);
  const avgParaLines = paragraphs.length > 0
    ? Math.round((paragraphs.reduce((acc, p) => acc + Math.max(1, Math.round(p.length / 80)), 0) / paragraphs.length) * 10) / 10
    : 2.2;

  // Composite Human Quality Score (0 - 100)
  // Base 100, penalties for slop density, robotic cadence, grade 6 deviation, and non-direct answers
  let score = 100;

  // Penalty for slop density (up to -30)
  const slopPer1k = (detectedSlopCount / wordCount) * 1000;
  score -= Math.min(30, Math.round(slopPer1k * 6));

  // Penalty for burstiness (< 4 is robotic) (up to -20)
  if (burstinessScore < 3.5) {
    score -= 20;
  } else if (burstinessScore < 5.0) {
    score -= 10;
  }

  // Penalty for readability exceeding Grade 7.5 (up to -25)
  if (fkGrade > 9.0) {
    score -= 25;
  } else if (fkGrade > 7.5) {
    score -= 12;
  }

  // Penalty for lack of direct answers (up to -15)
  if (directAnswerScore < 70) {
    score -= 15;
  } else if (directAnswerScore < 90) {
    score -= 8;
  }

  // Penalty for long paragraphs (up to -10)
  if (avgParaLines > 3.5) {
    score -= 10;
  }

  const humanScore = Math.max(45, Math.min(100, score));

  // Actionable suggestions
  const suggestions: string[] = [];
  if (detectedSlopCount > 0) {
    suggestions.push(`Replace ${detectedSlopCount} detected AI cliché terms (e.g. ${detectedSlopList.slice(0, 3).join(', ')}) with simple, concrete words.`);
  }
  if (burstinessScore < 4.0) {
    suggestions.push('Improve natural cadence (burstiness): Mix short punchy sentences (4-8 words) with informative balanced sentences (12-18 words).');
  }
  if (fkGrade > 7.0) {
    suggestions.push(`Lower reading level from Grade ${fkGrade.toFixed(1)} to Grade 6 by replacing multi-syllable jargon with everyday vocabulary.`);
  }
  if (directAnswerScore < 90) {
    suggestions.push('Provide a direct 40-50 word factual answer immediately in the first sentence under each H2 heading for Google snippet capture.');
  }
  if (avgParaLines > 3.0) {
    suggestions.push('Keep paragraphs no longer than 2-3 lines to maximize readability on mobile devices.');
  }

  return {
    humanScore,
    readingLevelGrade: fkGrade,
    readingLevelLabel,
    burstinessScore,
    burstinessRating,
    detectedSlopCount,
    detectedSlopList,
    directAnswerScore,
    paragraphLengthAvgLines: avgParaLines,
    suggestions
  };
}
