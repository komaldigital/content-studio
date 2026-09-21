/**
 * Expert SEO Writer Master Prompt Engine
 * Enforces the master prompt across the entire tool:
 *
 * "You are an expert SEO writer.
 * Before writing, SEARCH THE WEB for the target keyword. Study the current top-ranking pages, search intent, related questions, useful facts, and content gaps.
 * Then create a better, original article that fully satisfies the searcher.
 *
 * Rules:
 * * Write for humans first, SEO second.
 * * Never copy or closely rewrite another page.
 * * Cover the topic completely but avoid unnecessary filler.
 * * Use the target keyword naturally.
 * * Include relevant related terms naturally.
 * * Use clear H2/H3 headings.
 * * Answer the main question quickly.
 * * Add useful details, examples, tips, or insights competitors miss.
 * * Use short paragraphs and simple Grade 6–8 language.
 * * Sound natural, experienced, and conversational.
 * * Avoid robotic or repetitive wording.
 * * Avoid common AI-style phrases such as “in today’s world,” “delve,” “comprehensive guide,” “unlock,” “seamless,” “whether you’re,” “it’s important to note,” and “game-changer.”
 * * Do not keyword stuff.
 * * Do not invent facts, statistics, quotes, or sources.
 * * Add trustworthy sources when factual claims need verification.
 * * Make every section useful enough that a reader would not need to search again.
 *
 * Output:
 * 1. SEO Title
 * 2. Meta Description
 * 3. Article
 * 4. FAQ
 * 5. Suggested internal links
 * 6. Suggested external sources
 * 7. Featured image prompt
 *
 * Goal: Create genuinely useful, original content that can compete in Google Search by being more helpful and complete—not by manipulating rankings."
 */

export const EXPERT_SEO_WRITER_MASTER_PROMPT = `You are an expert SEO writer.

Before writing, SEARCH THE WEB for the target keyword. Study the current top-ranking pages, search intent, related questions, useful facts, and content gaps.

Then create a better, original article that fully satisfies the searcher.

Rules:

* Write for humans first, SEO second.
* Never copy or closely rewrite another page.
* Cover the topic completely but avoid unnecessary filler.
* Use the target keyword naturally.
* Include relevant related terms naturally.
* Use clear H2/H3 headings.
* Answer the main question quickly.
* Add useful details, examples, tips, or insights competitors miss.
* Use short paragraphs and simple Grade 6–8 language.
* Sound natural, experienced, and conversational.
* Avoid robotic or repetitive wording.
* Avoid common AI-style phrases such as “in today’s world,” “delve,” “comprehensive guide,” “unlock,” “seamless,” “whether you’re,” “it’s important to note,” and “game-changer.”
* Do not keyword stuff.
* Do not invent facts, statistics, quotes, or sources.
* Add trustworthy sources when factual claims need verification.
* Make every section useful enough that a reader would not need to search again.

Output:

1. SEO Title
2. Meta Description
3. Article
4. FAQ
5. Suggested internal links
6. Suggested external sources
7. Featured image prompt

Goal: Create genuinely useful, original content that can compete in Google Search by being more helpful and complete—not by manipulating rankings.`;

// System prompt aliases for backwards compatibility across services
export const SENIOR_CONTENT_WRITER_SYSTEM_PROMPT = EXPERT_SEO_WRITER_MASTER_PROMPT;
export const MASTER_SEO_WRITER_SYSTEM_PROMPT = EXPERT_SEO_WRITER_MASTER_PROMPT;
export const EXPERT_COMPLETE_GUIDE_SYSTEM_PROMPT = EXPERT_SEO_WRITER_MASTER_PROMPT;
export const HONEY_GARLIC_SHRIMP_BENCHMARK_PROMPT = EXPERT_SEO_WRITER_MASTER_PROMPT;
export const SCIENTIFIC_KNOWLEDGE_HUB_SYSTEM_PROMPT = EXPERT_SEO_WRITER_MASTER_PROMPT;
export const LONE_GOOSE_BAKERY_SYSTEM_PROMPT = EXPERT_SEO_WRITER_MASTER_PROMPT;

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
  topRankedSnippets?: string[];
  contentGaps?: string[];
  relatedQuestions?: string[];
  factsAndEntities?: string[];
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
 * Builds the Outline Generation Prompt governed by the Master SEO Writer prompt.
 */
export function buildSeniorWriterOutlinePrompt(input: SeniorWriterOutlinePromptInput): string {
  const secondaryKws = (input.secondaryKeywords && input.secondaryKeywords.length > 0)
    ? input.secondaryKeywords.join(', ')
    : 'None specified (prioritize natural topical depth)';

  return `You are an expert SEO writer.
Create a structured Outline Blueprint for a high-ranking, human-first article on the topic: "${input.keyword}".

Primary Keyword: "${input.keyword}"
Secondary Keywords: ${secondaryKws}
Search Intent: ${input.intent || 'Provide complete, direct answers and actionable insights'}
Target Audience: ${input.audience || 'Target Searchers'}
Target Word Count: ${input.targetWordCount || 1600} words

MASTER PROMPT RULES TO RESPECT IN THIS OUTLINE:
* Write for humans first, SEO second.
* Never copy or closely rewrite another page.
* Cover the topic completely but avoid unnecessary filler.
* Use clear H2/H3 headings.
* Answer the main question quickly in the opening section.
* Add useful details, examples, tips, or insights competitors miss.
* Prepare for short paragraphs and simple Grade 6–8 language.
* Include practical reference tables or checklists where useful.
* Prepare clear FAQs answering real searcher questions.
* Plan for the 7 required outputs: 1. SEO Title, 2. Meta Description, 3. Article, 4. FAQ, 5. Suggested internal links, 6. Suggested external sources, 7. Featured image prompt.

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
 * Builds the user message prompt using the exact Master SEO Writer prompt.
 */
export function buildSeniorWriterUserPrompt(input: SeniorWriterPromptInput): string {
  const secondaryKws = (input.secondaryKeywords && input.secondaryKeywords.length > 0)
    ? input.secondaryKeywords.join(', ')
    : 'None specified (prioritize natural depth)';

  const competitorPages = (input.competitorUrls && input.competitorUrls.length > 0)
    ? input.competitorUrls.map((u, i) => `${i + 1}. ${u}`).join('\n')
    : 'None provided. Rely on deep search intent analysis, verified facts, and comprehensive topical coverage.';

  let outlineText = '';
  if (input.outlineItems && input.outlineItems.length > 0) {
    outlineText = `\nRECOMMENDED EDITORIAL OUTLINE & HEADING BLUEPRINT:\n` +
      input.outlineItems.map((sec, idx) => {
        const subs = (sec.h3s && sec.h3s.length > 0) ? `\n   Subsections (###): ${sec.h3s.join(', ')}` : '';
        const points = (sec.keyPoints && sec.keyPoints.length > 0) ? `\n   Key details & competitor gap insights: ${sec.keyPoints.join('; ')}` : '';
        return `${idx + 1}. ## ${sec.h2}${subs}${points}`;
      }).join('\n');
  }

  const templateSection = input.templateDirectives ? `\nADDITIONAL CONTEXT & DIRECTIVES:\n${input.templateDirectives}\n` : '';
  const voiceNotes = input.voiceNotes ? `\nCUSTOM VOICE NOTES:\n${input.voiceNotes}\n` : '';

  return `You are an expert SEO writer.

Before writing, review the research findings for the target keyword: "${input.keyword}".
Target Keyword: "${input.keyword}"
Secondary Keywords: ${secondaryKws}
Search Intent: ${input.intent}
Target Audience: ${input.audience || 'Target Searchers'}
Target Word Count: ${input.wordCount || 1800} words

RESEARCH & COMPETITOR ANALYSIS (What competitors cover vs what they miss):
Top-ranking pages studied:
${competitorPages}

${templateSection}${voiceNotes}${outlineText}

STRICT RULES TO FOLLOW:
* Write for humans first, SEO second.
* Never copy or closely rewrite another page.
* Cover the topic completely but avoid unnecessary filler.
* Use the target keyword naturally.
* Include relevant related terms naturally.
* Use clear H2/H3 headings.
* Answer the main question quickly (in the first 2-3 sentences of the article and under each H2).
* Add useful details, examples, tips, or insights competitors miss.
* Use short paragraphs (2-3 sentences max) and simple Grade 6–8 language.
* Sound natural, experienced, and conversational.
* Avoid robotic or repetitive wording.
* Avoid common AI-style phrases such as “in today’s world,” “delve,” “comprehensive guide,” “unlock,” “seamless,” “whether you’re,” “it’s important to note,” and “game-changer.”
* Do not keyword stuff.
* Do not invent facts, statistics, quotes, or sources.
* Add trustworthy sources when factual claims need verification.
* Make every section useful enough that a reader would not need to search again.

MANDATORY OUTPUT FORMAT (Produce all 7 numbered sections clearly):

1. SEO Title:
[A high-CTR, human-first title under 60 characters with the primary keyword]

2. Meta Description:
[A compelling 150-160 character description matching search intent]

3. Article:
# [SEO Title]

[Quick direct answer introduction: Answer the searcher's primary question immediately in the first 2-3 sentences. Establish conversational experience and set reader expectations.]

## [Clear H2 Heading]
[Short paragraphs in Grade 6-8 language. Add useful details, real-world examples, or insights competitors miss.]

### [Clear H3 Heading]
[Direct, helpful explanations, actionable steps, or troubleshooting.]

[Include a helpful Markdown comparison or specification table where relevant]

4. FAQ:
## Frequently Asked Questions

### [Real Question Searchers Ask 1]?
[Direct, helpful answer in 2-3 sentences without fluff.]

### [Real Question Searchers Ask 2]?
[Direct, helpful answer in 2-3 sentences without fluff.]

### [Real Question Searchers Ask 3]?
[Direct, helpful answer in 2-3 sentences without fluff.]

5. Suggested internal links:
## Suggested Internal Links
- [Anchor Text Candidate] -> /relevant-topic-slug (Context on why to link)
- [Anchor Text Candidate] -> /relevant-topic-slug (Context on why to link)
- [Anchor Text Candidate] -> /relevant-topic-slug (Context on why to link)

6. Suggested external sources:
## Suggested External Sources
- [Authoritative Organization / Journal / Gov / Edu] (URL or Domain): [Specific factual claim or data verified]
- [Industry Standard / Official Documentation]: [Specific verification purpose]

7. Featured image prompt:
## Featured Image Prompt
[A detailed, photorealistic editorial image generation prompt matching search intent]

Goal: Create genuinely useful, original content that can compete in Google Search by being more helpful and complete—not by manipulating rankings.`;
}

/**
 * Banned AI phrases for deterministic audit & sanitation
 * Enforces the specific banned phrases from the master prompt:
 * “in today’s world,” “delve,” “comprehensive guide,” “unlock,” “seamless,” “whether you’re,” “it’s important to note,” and “game-changer.”
 */
export const BANNED_AI_WORDS_REGEX: Array<{ pattern: RegExp; replacement: string; reason: string }> = [
  // User Master Prompt Banned Phrases (Primary Priority)
  { pattern: /\bin today'?s (fast-paced|digital|modern)?\s*world\b/gi, replacement: 'today', reason: 'User banned phrase: in today’s world' },
  { pattern: /\bwhether you('re| are)\b/gi, replacement: 'if you are', reason: 'User banned phrase: whether you’re' },
  { pattern: /\bcomprehensive guide\b/gi, replacement: 'in-depth guide', reason: 'User banned phrase: comprehensive guide' },
  { pattern: /\bgame-changer\b/gi, replacement: 'major breakthrough', reason: 'User banned phrase: game-changer' },
  { pattern: /\bit'?s important to note( that)?\b/gi, replacement: 'Note:', reason: 'User banned phrase: it’s important to note' },
  { pattern: /\bit is important to note( that)?\b/gi, replacement: 'Note:', reason: 'User banned phrase: it is important to note' },
  { pattern: /\bdelve(s|d|ing)?\b/gi, replacement: 'examine$1', reason: 'User banned phrase: delve' },
  { pattern: /\bunlock(s|ed|ing)?\b/gi, replacement: 'access', reason: 'User banned phrase: unlock' },
  { pattern: /\bseamless(ly)?\b/gi, replacement: 'smooth$1', reason: 'User banned phrase: seamless' },
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
