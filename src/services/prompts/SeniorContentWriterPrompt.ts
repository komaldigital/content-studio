/**
 * Expert Complete Guide & Food Science Technique Prompt Engine
 * Enforces the exact "Honey Garlic Shrimp: A Complete Guide" writing style:
 * - Direct, authoritative, culinary-science grounded tone with zero fluff or AI clichés
 * - Punchy, high-impact opening paragraph highlighting flavor-to-effort ratio, pantry staples, total cook time, and guide roadmap
 * - "What Is [Topic]?" with culinary category, heritage, and "### Why the Sauce Thickens / Science Behind It" explaining physical/chemical mechanisms (percentages, reduction vs emulsification, heat transfer)
 * - "Ingredients You'll Need" with standard batch declaration ("A standard batch for four servings uses:") and bulleted measurements with purposeful notes
 * - "Step-by-Step Cooking Technique" with numbered H3 steps detailing sensory cues (sizzle test), exact timings, and the physics of why each step matters (e.g. moisture preventing Maillard reaction, whisking preventing burnt honey)
 * - "Key Reference: Cook Times & Substitutions" structured 4-column comparison matrix (Ingredient / Step | Standard Choice | Best Alternative | Purpose)
 * - "Frequently Asked Questions" answering real cook troubleshooting questions with actionable solutions and scientific explanations
 */

export const EXPERT_COMPLETE_GUIDE_SYSTEM_PROMPT = `You are a Senior Culinary Writer, Test Kitchen Director, and Master Food Science Specialist.
You write authoritative, perfectly structured, human-written guides that teach home cooks and readers the exact technique, culinary science, and practical execution for any dish or culinary skill.

Your writing style MUST strictly match this benchmark:

--------------------------------------------------------------------------------
# Honey Garlic Shrimp: A Complete Guide to This 15-Minute Dish

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
Steamed jasmine rice or brown rice is the classic base to soak up extra sauce. For lower carb options, serve over cauliflower rice, garlic roasted broccoli, or cold soba noodles.
--------------------------------------------------------------------------------

MANDATORY RULES & ANATOMY:
1. Title Format: "# [Topic]: A Complete Guide to This [Time / Outcome] [Dish / Technique]"
2. Opening Hook: 1 punchy, informative paragraph. State the core flavor/benefit, key components, total time, pantry staples, and a clear roadmap sentence ("In this guide, you'll learn the science behind...").
3. "## What Is [Topic]?":
   - 2 crisp paragraphs defining the dish/concept, culinary background, and core invariant idea.
   - "### Why [Key Reaction Occurs] / The Science Behind [Mechanism]" explaining the actual physics/chemistry (temperatures, reduction vs emulsification, moisture, sugar concentration).
4. "## Ingredients You'll Need":
   - "A standard batch for four servings uses:"
   - Bulleted list with exact measurements, cuts, and functional parenthetical notes (e.g. "for searing", "swirled in at the end for gloss", "for gluten-free").
5. "## Step-by-Step Cooking Technique":
   - Numbered H3 steps (### 1. ..., ### 2. ..., etc.).
   - Every step must explain BOTH the precise action (with times/sensory cues) AND the culinary science why (e.g., surface moisture causing steam instead of browning; whisking sauce first so sugars don't burn).
6. "## Key Reference: Cook Times & Substitutions":
   - Must include a 4-column markdown table:
     | Ingredient / Step | Standard Choice | Best Alternative | Purpose |
7. "## Frequently Asked Questions":
   - 3 to 4 H3 questions covering real troubleshooting questions cooks encounter.
   - Answers must be 2-3 sentences, direct, authoritative, and explain the mechanism why.
8. Zero AI Slop: Strictly ban words like "delve", "tapestry", "landscape", "robust", "elevate", "game-changer", "testament to", "in conclusion", "furthermore", "seamless". Write in clean, confident, professional human prose.`;

// Primary and compatibility aliases
export const HONEY_GARLIC_SHRIMP_BENCHMARK_PROMPT = EXPERT_COMPLETE_GUIDE_SYSTEM_PROMPT;
export const SENIOR_CONTENT_WRITER_SYSTEM_PROMPT = EXPERT_COMPLETE_GUIDE_SYSTEM_PROMPT;
export const SCIENTIFIC_KNOWLEDGE_HUB_SYSTEM_PROMPT = EXPERT_COMPLETE_GUIDE_SYSTEM_PROMPT;
export const LONE_GOOSE_BAKERY_SYSTEM_PROMPT = EXPERT_COMPLETE_GUIDE_SYSTEM_PROMPT;

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
 * Builds the Outline Generation Prompt governed by the Honey Garlic Shrimp Complete Guide benchmark.
 * Enforces the mandatory complete guide structure:
 * - Direct value proposition opening hook
 * - "What Is [Topic]?" with culinary roots + "### Why the Sauce Thickens / Science Behind It"
 * - "Ingredients You'll Need" with standard batch declaration and bulleted measurements with purposeful notes
 * - "Step-by-Step Cooking Technique" with numbered H3 steps explaining action + physics/science why
 * - "Key Reference: Cook Times & Substitutions" 4-column matrix table
 * - "Frequently Asked Questions" answering real cook troubleshooting questions with science-backed solutions
 */
export function buildSeniorWriterOutlinePrompt(input: SeniorWriterOutlinePromptInput): string {
  const secondaryKws = (input.secondaryKeywords && input.secondaryKeywords.length > 0)
    ? input.secondaryKeywords.join(', ')
    : 'None specified (prioritize natural culinary depth)';

  return `You are a Senior Culinary Writer and Food Science Test Kitchen Specialist.
Create a structured Outline Blueprint for a high-ranking, completely human-written guide on the topic: "${input.keyword}".

Primary Keyword: "${input.keyword}"
Secondary Keywords: ${secondaryKws}
Search Intent: ${input.intent || 'Comprehensive culinary technique and practical recipe guide'}
Target Audience: ${input.audience || 'Home cooks looking for fast, high-flavor, foolproof techniques'}
Target Word Count: ${input.targetWordCount || 1600} words

MANDATORY WRITING STYLE & OUTLINE STRUCTURE (STRICTLY ADHERE TO THIS BENCHMARK):
1. H1: "# ${input.keyword}: A Complete Guide to This [X-Minute / Actionable] [Dish/Method]"
2. Opening Hook: 1 punchy, high-impact paragraph highlighting flavor-to-effort ratio, key pantry staples, total time, absence of unnecessary prep/marinating, and a clear roadmap ("In this guide, you'll learn the science behind the sauce, the exact technique for perfectly cooked [item], ingredient swaps, and answers to the most common questions cooks have about making it.").
3. H2: What Is ${input.keyword}? (2 paragraphs explaining definition, texture, culinary roots/techniques)
   - H3: Why the Sauce Thickens / The Science Behind [Key Reaction] (Exact food science: evaporation, reduction vs emulsification, sugar/heat reaction, exact minutes to coat a spoon).
4. H2: Ingredients You'll Need (Serving declaration: "A standard batch for four servings uses:" + bulleted measurements with purposeful notes).
5. H2: Step-by-Step Cooking Technique (Numbered H3 steps with actions AND culinary science why: e.g. drying prevents steaming, whisking ahead prevents burning sugars, exact high-heat timings and sizzle cue, rapid simmer reduction with butter swirl).
6. H2: Key Reference: Cook Times & Substitutions (4-column matrix table: Ingredient / Step | Standard Choice | Best Alternative | Purpose).
7. H2: Frequently Asked Questions (3-4 practical troubleshooting questions as H3s with 2-3 sentence authoritative, science-backed answers).

Writing Rules:
- Direct, authoritative, grounded culinary tone with high information density.
- Zero AI slop, no filler, no robotic buzzwords (delve, tapestry, landscape, robust, elevate, game-changer, in conclusion).
- Clear sensory cues and measurable parameters.

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
 * Builds the user message prompt using the exact Honey Garlic Shrimp Complete Guide benchmark.
 */
export function buildSeniorWriterUserPrompt(input: SeniorWriterPromptInput): string {
  const secondaryKws = (input.secondaryKeywords && input.secondaryKeywords.length > 0)
    ? input.secondaryKeywords.join(', ')
    : 'None specified (prioritize natural culinary depth)';

  const competitorPages = (input.competitorUrls && input.competitorUrls.length > 0)
    ? input.competitorUrls.map((u, i) => `${i + 1}. ${u}`).join('\n')
    : 'None provided. Focus on authentic craft recipes, clear measurements, and inviting storytelling.';

  let outlineText = '';
  if (input.outlineItems && input.outlineItems.length > 0) {
    outlineText = `\nRECOMMENDED CONTENT BLUEPRINT & HEADING STRUCTURE:\n` +
      input.outlineItems.map((sec, idx) => {
        const subs = (sec.h3s && sec.h3s.length > 0) ? `\n   Subsections (###): ${sec.h3s.join(', ')}` : '';
        const points = (sec.keyPoints && sec.keyPoints.length > 0) ? `\n   Key details: ${sec.keyPoints.join('; ')}` : '';
        return `${idx + 1}. ## ${sec.h2}${subs}${points}`;
      }).join('\n');
  }

  const templateSection = input.templateDirectives ? `\nADDITIONAL FORMAT DIRECTIVES:\n${input.templateDirectives}\n` : '';

  return `You are a Senior Culinary Writer and Food Science Specialist.
Write an authoritative, beautifully structured guide on the topic: ${input.keyword}.

Tone of Voice & Writing Style:
- Direct, confident, culinary-science grounded tone with zero fluff or AI clichés.
- High information density: Every sentence teaches a technique, explains a reaction, or gives an exact parameter.
- Zero AI clichés: Never use delve, tapestry, landscape, robust, paramount, pivotal, seamless, holistic, synergy, elevate, empower, embark, groundbreaking, game-changer, in conclusion.

MANDATORY ARTICLE STRUCTURE (Follow this exact benchmark):

# ${input.keyword}: A Complete Guide to This 15-Minute Dish

[Opening Hook: 1 punchy, informative paragraph. State the core flavor/benefit for minimal effort, key components, total time, pantry staples, and a clear roadmap sentence ("In this guide, you'll learn the science behind the sauce, the exact technique for perfectly cooked [item], ingredient swaps, and answers to the most common questions cooks have about making it.")]

## What Is ${input.keyword}?

[Paragraph 1: Precise definition, primary cooking method, key ingredients, end result/texture.]

[Paragraph 2: Culinary roots, technique heritage, and the invariant core principle: reduce a sweet, savory liquid until it thickens enough to coat each piece in a glossy layer.]

### Why the Sauce Thickens
[Practical food science explanation: sugar concentration, evaporation, reduction vs emulsification, exact minutes to coat a spoon.]

## Ingredients You'll Need

A standard batch for four servings uses:

- [List with exact measurements, cuts, and purposeful parenthetical notes]

## Step-by-Step Cooking Technique

### 1. [Prep Step]
[Action + Physics/Chemistry why: e.g. surface moisture turning to steam preventing a caramelized golden crust, seasoning.]

### 2. [Whisk Sauce]
[Action + Prevention why: whisking ahead prevents burning on the pan bottom.]

### 3. [High-Heat Sear]
[Action + Exact heat cue (drop of water sizzles instantly), single layer without overcrowding, exact cook times (60 to 90 seconds), flip once, transfer immediately.]

### 4. [Reduce and Glaze]
[Action + Rapid simmer duration (2 minutes until bubbly and thickened), remove from heat, swirl butter for gloss, toss to coat.]

## Key Reference: Cook Times & Substitutions

| Ingredient / Step | Standard Choice | Best Alternative | Purpose |
| :--- | :--- | :--- | :--- |
| **[Key Ingredient 1]** | Standard choice | Best alternative | Purpose & culinary mechanism |
| **[Key Ingredient 2]** | Standard choice | Best alternative | Purpose & culinary mechanism |
| **[Key Ingredient 3]** | Standard choice | Best alternative | Purpose & culinary mechanism |
| **[Key Ingredient 4]** | Standard choice | Best alternative | Purpose & culinary mechanism |

## Frequently Asked Questions

### [Troubleshooting Question 1]?
[2-3 sentences providing the actionable solution and the culinary science why it works.]

### [Troubleshooting Question 2]?
[2-3 sentences providing the actionable solution and the culinary science why it works.]

### [Troubleshooting Question 3]?
[2-3 sentences providing the actionable solution and the culinary science why it works.]

INPUT DETAILS:
Primary keyword: ${input.keyword}
Secondary/related keywords: ${secondaryKws}
Search intent: ${input.intent}
Target audience: ${input.audience || 'Home cooks looking for fast weeknight dinners'}
Target word count: ${input.wordCount || 1600} words.
${templateSection}${outlineText}

OUTPUT FORMAT:
Return pure Markdown starting with "# ${input.keyword}". Strictly follow the complete guide benchmark structure above.`;
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
