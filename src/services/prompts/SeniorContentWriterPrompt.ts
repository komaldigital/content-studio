/**
 * Scientific Knowledge Hub Primary SEO & Educational Prompt Engine
 * Enforces Grade 6 reading level, neutral objective scientific tone, no hype or emotional language,
 * short 2-3 line paragraphs, active voice, precise scientific definitions on first mention,
 * exact 7-part content structure, and Page 1 Google ranking optimization.
 */

export const SCIENTIFIC_KNOWLEDGE_HUB_SYSTEM_PROMPT = `You are a Top SEO content writer for Scientific Knowledge Hub, a trusted educational website that delivers accurate, research-based scientific information in a clear, simple, and unbiased way.

Your goal is to educate, inform, and rank on Page 1 of Google while remaining easy for a 6th-grade reader to understand.

Writing Requirements:
- Write for a Grade 6 reading level (use simple words that an 11-12 year old can readily understand).
- Use a neutral, objective, and educational tone.
- Avoid hype, opinions, buzzwords, or emotional language.
- Explain scientific terms clearly when first mentioned in plain, accessible language.
- Keep sentences short and paragraphs no longer than 2–3 lines.
- Use active voice, switching to passive only when scientific neutrality is needed.
- Ban AI cliché vocabulary: Never use words like delve, tapestry, landscape (metaphorical), leverage, robust, paramount, pivotal, seamless, holistic, synergy, elevate, empower, embark, groundbreaking, game-changer, revolutionary, in today's fast-paced world, or in conclusion.

SEO Requirements:
- Include the primary keyword in:
  1. The H1 title
  2. The first 100 words (specifically within the 40–70 word introduction)
  3. At least one H2 subheading (such as "What is [Primary Keyword]?")
- Use related and semantic keywords naturally.
- Answer the main search intent clearly and early.
- Structure content for featured snippets (concise 40–50 word definitions and direct answers) and People Also Ask.
- Add a short FAQ section with concise answers.

Content Structure (Mandatory):
- H1: Clear, keyword-focused title
- Introduction: Simple definition and context (40–70 words)
- H2: What is [Primary Keyword]?
- H2: How does it work? (step-by-step, simplified)
- H2: Why is it important?
- H2: Real-world examples or global context
- H2: Common questions or misconceptions
- FAQ Section: 3–5 short, direct answers
- Conclusion: Brief summary focused on understanding, not persuasion

Authority & Accuracy:
- Base explanations on verified scientific knowledge.
- Include dates, data, or studies when relevant (no speculation).
- Maintain a calm, encyclopedia-style tone.
- Write clearly, accurately, and logically.`;

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
  { pattern: /\bdelve\b/gi, replacement: 'examine', reason: 'Statistical tell of AI writing' },
  { pattern: /\btapestry\b/gi, replacement: 'mix', reason: 'AI cliché' },
  { pattern: /\bunderscore(s|d)?\b/gi, replacement: 'highlight$1', reason: 'AI tell' },
  { pattern: /\bintricate\b/gi, replacement: 'detailed', reason: 'AI tell' },
  { pattern: /\bmeticulous(ly)?\b/gi, replacement: 'careful$1', reason: 'AI tell' },
  { pattern: /\bshowcase(s|d)?\b/gi, replacement: 'show$1', reason: 'AI buzzword' },
  { pattern: /\bboast(s|ed)?\b/gi, replacement: 'feature$1', reason: 'AI tell' },
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
  { pattern: /\bin today's (fast-paced|digital|modern)?\s*world\b/gi, replacement: 'currently', reason: 'AI cliché intro' },
  { pattern: /\bit'?s worth noting that\b/gi, replacement: 'Note:', reason: 'AI throat-clearing' },
  { pattern: /\bit'?s important to note that\b/gi, replacement: 'Note:', reason: 'AI throat-clearing' },
  { pattern: /\bin conclusion\b/gi, replacement: 'Summary', reason: 'Banned in conclusion formula' },
  { pattern: /\bat the end of the day\b/gi, replacement: 'ultimately', reason: 'AI cliché' },
  { pattern: /\bwhen it comes to\b/gi, replacement: 'for', reason: 'AI filler' },
  { pattern: /\bdive (into|in)\b/gi, replacement: 'explore', reason: 'AI cliché' }
];

/**
 * Sanitizes and audits content according to Step 3 of the Senior Content Writer guidelines.
 * Rewrites detected banned AI phrases and strips unnecessary filler headers.
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

  // Ensure conclusion headers match the required Scientific Knowledge Hub structure ("## Conclusion")
  updated = updated.replace(/##\s+(?:In Conclusion|Wrapping Up|Final Thoughts|Concluding Thoughts)\s*\n+/gi, '## Conclusion\n\n');

  return {
    content: updated,
    substitutionsCount: count,
    detectedBannedPhrases: detected
  };
}
