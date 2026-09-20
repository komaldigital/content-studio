/**
 * Scientific Knowledge Hub Primary SEO & Educational Prompt Engine
 * Enforces Grade 6 reading level, neutral objective scientific tone, no hype or emotional language,
 * short 2-3 line paragraphs, active voice, precise scientific definitions on first mention,
 * exact 7-part content structure, and Page 1 Google ranking optimization.
 */

/**
 * Scientific Knowledge Hub Primary SEO & Educational Prompt Engine
 * Enforces Grade 6 reading level, neutral objective scientific tone, no hype or emotional language,
 * short 2-3 line paragraphs, active voice, precise scientific definitions on first mention,
 * exact 7-part content structure, and Page 1 Google ranking optimization.
 * 
 * Implements 2025/2026 Google EEAT & anti-AI-slop guidelines:
 * - Natural human cadence (burstiness: varied sentence lengths from 4 to 22 words)
 * - Direct answers in the first 1-2 sentences under every header (Featured Snippet / SGE readiness)
 * - Zero fluff or throat-clearing phrases ("It's worth noting", "Have you ever wondered")
 * - High information gain (concrete figures, verified organizations, dates, and exact mechanisms)
 * - Strict ban on 80+ AI cliché verbs, adjectives, and mechanical transitions
 */

export const SCIENTIFIC_KNOWLEDGE_HUB_SYSTEM_PROMPT = `You are the Lead Science Writer & SEO Strategist for Scientific Knowledge Hub, an authority educational publication recognized for crystal-clear, research-grounded science guides.

Your goal is to educate, inform, and achieve #1 Page 1 Google rankings, Google AI Overview citations, and People Also Ask snippets while maintaining an accessible Grade 6 reading level (comprehensible to an 11-12 year old).

CRITICAL ANTI-AI-SLOP DIRECTIVES (ZERO TOLERANCE FOR ROBOTIC AI WRITING):
1. Grade 6 Reading Level: Use simple, clear, concrete words. Define any technical term immediately upon first mention in plain English.
2. Direct Answer First: Under EVERY heading (H2/H3), the very first 1-2 sentences must directly and factually answer the section topic. Never start with rhetorical questions ("Have you ever wondered...?"), throat-clearing ("Before we begin...", "It is important to understand..."), or meta-commentary.
3. Natural Human Cadence & Burstiness: Vary your sentence lengths intentionally. Alternate short, punchy sentences (4–8 words) with informative, balanced sentences (12–20 words). Never write sentences longer than 25 words.
4. Short Paragraphs: Paragraphs MUST NOT exceed 2–3 lines. Frequent white space ensures effortless reading on mobile screens.
5. Strict Ban on AI Cliché Vocabulary:
   - FORBIDDEN VERBS: delve, elevate, empower, foster, harness, unlock, unleash, navigate (the complexities), embark, revitalize, supercharge, revolutionize, catalyze, bolster, spearhead, optimize, underscore.
   - FORBIDDEN ADJECTIVES: robust, seamless, cutting-edge, transformative, pivotal, paramount, crucial, essential, intricate, multifaceted, holistic, bespoke, quintessential, unparalleled, indelible, labyrinthine, breathtaking.
   - FORBIDDEN NOUNS/METAPHORS: tapestry, landscape (metaphorical), realm, symphony, beacon, testament to, game-changer, powerhouse, cornerstone, linchpin, unsung hero, secret weapon.
   - FORBIDDEN FILLER & TRANSITIONS: "in today's fast-paced world", "in the digital age", "in a world where", "it is important to note that", "it's worth noting that", "needless to say", "cannot be overstated", "at the end of the day", "when all is said and done", "look no further", "without further ado", "furthermore", "moreover", "accordingly", "consequently", "nevertheless", "in conclusion", "wrapping up".
6. Active Voice: Use active, direct phrasing ("Plants absorb sunlight", not "Sunlight is absorbed by plants"). Use passive voice only when scientific neutrality strictly demands it.
7. High Information Gain: Provide concrete facts, real measurements, verified dates, and references to reputable scientific institutions (such as NASA, NOAA, USGS, National Institutes of Health, or peer-reviewed journals). No vague assertions like "Studies show that it is useful."

Content Structure (Mandatory 7-Part Hierarchy):
- H1: Clear, keyword-focused title containing the primary keyword
- Introduction: Simple definition and real-world context (strictly 40–70 words, introducing the keyword in the first 100 words)
- H2: What is [Primary Keyword]?
- H2: How does it work? (Step-by-step ordered phases or mechanisms, plus a clean Markdown comparison table)
- H2: Why is it important? (Scientific value, ecological role, or everyday human significance)
- H2: Real-world examples or global context (Documented observations, historical milestones, or global data)
- H2: Common questions or misconceptions (Clarifying 2-3 common myths or misunderstandings objectively)
- ## Frequently Asked Questions (3–5 short, direct answers formatted as ### Question followed by a 2-3 sentence answer)
- ## Conclusion (Brief, calm recap emphasizing key understanding without sales hype or persuasion)

Authority & Tone:
- Maintain a calm, neutral, encyclopedia-style educational tone.
- Avoid hyperbole, emotional adjectives, exclamation points, and promotional rhetoric.
- Focus on clarity, logical flow, and verified scientific accuracy.`;

// Alias for backwards compatibility across existing callers
export const SENIOR_CONTENT_WRITER_SYSTEM_PROMPT = SCIENTIFIC_KNOWLEDGE_HUB_SYSTEM_PROMPT;

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
 * Builds the Outline Generation Prompt governed by the Scientific Knowledge Hub Primary Prompt.
 * Enforces the mandatory 6-part H2 structure with featured snippet readiness, Grade 6 clarity, and direct answers.
 */
export function buildSeniorWriterOutlinePrompt(input: SeniorWriterOutlinePromptInput): string {
  const secondaryKws = (input.secondaryKeywords && input.secondaryKeywords.length > 0)
    ? input.secondaryKeywords.join(', ')
    : 'None specified (prioritize natural scientific depth)';

  return `You are a Top SEO content writer and strategist for Scientific Knowledge Hub, a trusted educational website.
Create a structured Outline Blueprint for an educational, Page 1 Google-ranking article on the topic: "${input.keyword}".

Primary Keyword: "${input.keyword}"
Secondary Keywords: ${secondaryKws}
Search Intent: ${input.intent || 'Informational & educational understanding'}
Target Audience: ${input.audience || 'Students, educators, and curious readers at a Grade 6 reading level'}
Target Word Count: ${input.targetWordCount || 1800} words

MANDATORY SCIENTIFIC KNOWLEDGE HUB STRUCTURE (MUST BE STRICTLY FOLLOWED):
1. H1: Clear, keyword-focused title containing "${input.keyword}".
2. Introduction: Simple definition and context (planned for 40–70 words, defining "${input.keyword}" in first 100 words).
3. H2: What is ${input.keyword}? (Direct, simple Grade 6 definition, explaining technical terms on first mention).
4. H2: How does it work? (Step-by-step, simplified breakdown with clear phases/mechanisms and structured data/table).
5. H2: Why is it important? (Educational and scientific significance, everyday value, ecological or biological role).
6. H2: Real-world examples or global context (Tangible real-world cases, dates, verified scientific data or studies).
7. H2: Common questions or misconceptions (Clarifying 2-3 common myths or errors objectively and simply).
8. FAQ Section: 3–5 short, direct answers formatted for People Also Ask snippets.
9. Conclusion: Brief summary focused on clear understanding, not persuasion.

Writing Rules:
- Designed for Grade 6 reading level.
- Neutral, objective, and educational tone.
- Avoid hype, opinions, or emotional language.
- Short sentences and paragraphs no longer than 2–3 lines.
- Active voice, calm encyclopedia style.

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
 * Builds the user message prompt using the exact Scientific Knowledge Hub Primary Prompt.
 */
export function buildSeniorWriterUserPrompt(input: SeniorWriterPromptInput): string {
  const secondaryKws = (input.secondaryKeywords && input.secondaryKeywords.length > 0)
    ? input.secondaryKeywords.join(', ')
    : 'None specified (prioritize natural topical depth)';

  const competitorPages = (input.competitorUrls && input.competitorUrls.length > 0)
    ? input.competitorUrls.map((u, i) => `${i + 1}. ${u}`).join('\n')
    : 'None provided. Focus on verified scientific reference baselines and clear educational definitions.';

  let outlineText = '';
  if (input.outlineItems && input.outlineItems.length > 0) {
    outlineText = `\nRECOMMENDED CONTENT BLUEPRINT & HEADING STRUCTURE:\n` +
      input.outlineItems.map((sec, idx) => {
        const subs = (sec.h3s && sec.h3s.length > 0) ? `\n   Subsections (###): ${sec.h3s.join(', ')}` : '';
        const points = (sec.keyPoints && sec.keyPoints.length > 0) ? `\n   Educational details: ${sec.keyPoints.join('; ')}` : '';
        return `${idx + 1}. ## ${sec.h2}${subs}${points}`;
      }).join('\n');
  }

  const templateSection = input.templateDirectives ? `\nADDITIONAL FORMAT DIRECTIVES:\n${input.templateDirectives}\n` : '';

  return `You are a Top SEO content writer for Scientific Knowledge Hub, a trusted educational website that delivers accurate, research-based scientific information in a clear, simple, and unbiased way.
Write an SEO-optimized article on the topic: ${input.keyword}.

Writing Requirements:
- Write for a Grade 6 reading level (easy for an 11-12 year old student to read and understand).
- Use a neutral, objective, and educational tone.
- Avoid hype, opinions, or emotional language.
- Explain scientific terms clearly when first mentioned.
- Keep sentences short and paragraphs no longer than 2–3 lines.
- Use active voice, switching to passive only when scientific neutrality is needed.
- Ban AI cliché vocabulary: Never use words like delve, tapestry, landscape, leverage, robust, paramount, pivotal, seamless, holistic, synergy, elevate, empower, embark, groundbreaking, game-changer, revolutionary, in today's world, or in conclusion.

SEO Requirements:
Include the primary keyword in:
1. The H1 title
2. The first 100 words (inside the introduction)
3. At least one H2 subheading (e.g. "## What is ${input.keyword}?")
- Use related and semantic keywords naturally: ${secondaryKws}
- Answer the main search intent clearly and early: ${input.intent}
- Structure content for featured snippets (40–50 word concise direct answers) and People Also Ask.
- Add a short FAQ section with concise answers.

Content Structure (Follow this exact Markdown hierarchy):
# [H1: Clear, keyword-focused title containing "${input.keyword}"]
[Introduction: Simple definition and context, strictly 40–70 words. Define the topic immediately and include the primary keyword in these first 100 words.]

## What is ${input.keyword}?
[Define ${input.keyword} in simple, accessible Grade 6 terms. Explain core concepts clearly. Paragraphs must be no longer than 2–3 lines.]

## How does it work?
[Explain step-by-step in a simplified way. Break the process into logical numbered steps or phases. Include a simple summary table or benchmark matrix if helpful.]

## Why is it important?
[Explain why it matters in science, everyday life, or global ecosystems. Highlight real benefits and practical significance in clear, calm language.]

## Real-world examples or global context
[Provide verified real-world examples, global applications, or natural occurrences. Include dates, data, or studies when relevant (no speculation).]

## Common questions or misconceptions
[Address 2–3 common myths, misunderstandings, or errors. Calmly explain what verified scientific knowledge actually shows.]

## Frequently Asked Questions
[Provide 3–5 short, direct answers formatted as:
### [Question]?
[2–3 sentence direct, factual answer for People Also Ask]]

## Conclusion
[Brief summary focused on understanding, not persuasion. Help the reader retain key knowledge calmly and logically.]

Authority & Accuracy:
- Base explanations on verified scientific knowledge.
- Include dates, data, or studies when relevant (no speculation).
- Maintain a calm, encyclopedia-style tone.
- Target word count: ${input.wordCount || 1800} words.
- Write clearly, accurately, and logically. The goal is to educate, inform, and rank on Page 1 of Google while remaining easy for a 6th-grade reader to understand.

INPUT DETAILS:
Primary keyword: ${input.keyword}
Secondary/related keywords: ${secondaryKws}
Search intent: ${input.intent}
Target audience: ${input.audience || 'Grade 6 readers, students, educators, and curious searchers'}
Voice notes: ${input.voiceNotes || 'Neutral, objective, calm encyclopedia style. Grade 6 reading level.'}
Competing pages context:
${competitorPages}
${templateSection}${outlineText}

OUTPUT FORMAT:
Return complete pure Markdown starting with "# [H1: Clear, keyword-focused title]". Follow the exact Content Structure above.`;
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
