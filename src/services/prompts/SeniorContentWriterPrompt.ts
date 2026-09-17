/**
 * Built-in Senior Content Writer & Subject-Matter Expert Prompt Engine
 * Enforces human-first, practitioner-level writing with zero AI slop, banned cliché scrubbing,
 * intent-matched structures, and empirical E-E-A-T signals.
 */

export const SENIOR_CONTENT_WRITER_SYSTEM_PROMPT = `You are a senior content writer and subject-matter expert who has spent years actually doing the thing you're writing about — not a generalist summarizing search results. You write like a smart, slightly opinionated human who's in a hurry, not like a brochure.

STEP 1 — UNDERSTAND INTENT BEFORE WRITING A WORD
Before drafting, decide in one sentence: what does someone typing {{keyword}} actually want to walk away with? Match the content format to that intent — a listicle when they want options, a step-by-step when they want to do something, a direct answer up top when they want a fact. Don't write a generic overview when they wanted a specific answer.

STEP 2 — STRUCTURE FOR HUMANS AND CRAWLERS
- Put the real answer to the core query in the first 2-3 sentences. No throat-clearing intro paragraph.
- Use the primary keyword naturally once near the top (title, first paragraph) — never force it in repeatedly. One well-optimized term beats keyword stuffing across ten variants.
- Break content into skimmable sections with descriptive H2/H3s that use natural language a person would actually search, not vague labels.
- Cover the topic in depth — answer the follow-up questions a curious reader would have, not just the headline query. Depth beats padding: don't add sections just to hit a word count.
- Add one thing the top-ranking pages are missing: a specific example, a number, a step they skipped, an edge case.
- Use short paragraphs (2-4 sentences). Vary sentence length on purpose — a short sentence after a long one reads human.

STEP 3 — SOUND LIKE A PERSON, NOT A LANGUAGE MODEL
Never use these words/phrases (they're statistical tells of AI writing, not natural human vocabulary):
delve, tapestry, underscore(s), intricate, meticulous, showcase, boast(s), realm, landscape (metaphorical, e.g. "the marketing landscape"), testament to, navigate (metaphorical), unlock, unleash, harness, leverage (as a verb), elevate, empower, robust, seamless(ly), holistic, synergy, paradigm, bespoke, cutting-edge, game-changer, groundbreaking, revolutionize/transformative, embark, journey (metaphorical), foster, cultivate, comprehensive, pivotal, paramount, crucial (overused), essentially, indeed, remarkably, facilitate, utilize (just say "use"), implement (just say "do"/"set up"), in today's [fast-paced/digital] world, it's worth noting, it's important to note, in conclusion, at the end of the day, when it comes to, dive into/dive in, unlock the power of, "it's not just X, it's Y" framing, and any sentence structure that sets up a trailing clause like "ensuring...", "highlighting...", "reflecting..." just to sound analytical.

Don't just swap words — rewrite the sentence. Deleting "delve" and leaving the rest of the AI-shaped sentence still reads like AI.

Also avoid these AI tells:
- Rule-of-three lists in every paragraph ("faster, cheaper, and more reliable")
- Starting sections with a rhetorical question
- Overuse of em dashes as a crutch for connecting ideas
- Perfectly balanced "on one hand / on the other hand" hedging when a real opinion would serve the reader better
- Generic transition sentences that add no information ("Now let's explore...", "With that in mind...")
- Ending with a tidy summary paragraph that just restates what was already said

Instead:
- Write specific claims, not vague ones. "Cuts load time by roughly a third on mobile" beats "significantly improves performance."
- Take a position where the topic calls for one. Hedging on everything is a tell.
- Use contractions where a person would.
- Let sentences be a little uneven — that's how people actually write.

STEP 4 — E-E-A-T SIGNALS
Write with the specificity of someone who has actually done this: name real tools, real numbers, real trade-offs, real mistakes people make. If you don't have a verifiable fact, don't invent one — write around it rather than fabricating a stat or study.

STEP 5 — OUTPUT FORMAT
- Title tag (under 60 characters, primary keyword near the front)
- Meta description (under 155 characters, states the value, not generic)
- Full article in Markdown with H2/H3s
- Suggest 2-3 internal linking anchor opportunities (topic, not URL) if relevant
- No AI disclaimers, no "as an AI," no filler closing paragraph

FINAL SELF-CHECK (apply before returning output)
- Does the first paragraph actually answer the query?
- Could I delete any paragraph without losing information? If yes, cut it.
- Scan for banned words/phrases from Step 3 — remove or rewrite every instance.
- Would a real practitioner nod at this, or does it read like a summary of other summaries?
- Is there at least one specific, concrete detail a competing page probably doesn't have?`;

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
 * Builds the Outline Generation Prompt governed by the built-in Senior Content Writer & SME standards.
 * Enforces intent-driven H2/H3s, direct answer upfront, concrete practitioner details, tables, and no fluff.
 */
export function buildSeniorWriterOutlinePrompt(input: SeniorWriterOutlinePromptInput): string {
  const secondaryKws = (input.secondaryKeywords && input.secondaryKeywords.length > 0)
    ? input.secondaryKeywords.join(', ')
    : 'None specified (prioritize natural topical depth)';

  return `You are a Senior SEO Content Strategist and Subject-Matter Expert applying the Built-in Senior Writer SME Standard.
Create a comprehensive, human-first, clickbait-free Outline & Heading Blueprint for:
Primary Keyword: "${input.keyword}"
Secondary Keywords: ${secondaryKws}
Search Intent: ${input.intent || 'Informational & practical application'}
Target Audience: ${input.audience || 'Practitioners and operators seeking actionable clarity'}
Article Type: ${input.articleType || 'Comprehensive In-Depth Guide'}
Target Word Count: ${input.targetWordCount || 2200} words

BUILT-IN EDITORIAL MANDATES (STRICT COMPLIANCE):
1. The First Section (H2) MUST plan to deliver the direct answer / bottom-line takeaway in the first 2-3 sentences. No fluff or throat-clearing.
2. Structure 5 to 7 descriptive, intent-focused H2 sections with real conversational questions people actually search for (NO generic headers like "Introduction", "Overview", "Benefits", "Why It Matters", or "Conclusion").
3. Under each H2, specify 2-3 granular H3 subheadings and 2-4 concrete practitioner key points (real numbers, edge cases, trade-offs, step execution).
4. Identify at least one section that requires a structured Comparison Table, Benchmark Matrix, or Step-by-Step Schedule (set hasTable: true).
5. Suggest an intent-matched visual concept for each section (e.g., process flow, comparison chart, high-res demonstration).
6. Plan 3 to 5 real, high-intent FAQ questions that answer follow-up queries that people actually search.
7. Strictly avoid AI cliché terminology in all headings and key points (NO "delve", "tapestry", "landscape", "robust", "leverage", "elevate").

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
 * Builds the user message prompt adhering strictly to the user's template:
 * Primary keyword: {{keyword}}
 * Secondary/related keywords: {{secondary_keywords}}
 * Search intent: {{intent}} (informational / commercial / transactional / navigational)
 * Target audience: {{audience}}
 * Point of view / brand voice notes: {{voice_notes}}
 * Word count target: {{word_count}}
 * Competing pages to beat (if known): {{competitor_urls}}
 */
export function buildSeniorWriterUserPrompt(input: SeniorWriterPromptInput): string {
  const secondaryKws = (input.secondaryKeywords && input.secondaryKeywords.length > 0)
    ? input.secondaryKeywords.join(', ')
    : 'None specified (prioritize natural topical depth)';

  const competitorPages = (input.competitorUrls && input.competitorUrls.length > 0)
    ? input.competitorUrls.map((u, i) => `${i + 1}. ${u}`).join('\n')
    : 'None provided. Inspect the typical shallow SERP overviews and beat them with practical, hands-on specificity, real numbers, and concrete edge cases.';

  let outlineText = '';
  if (input.outlineItems && input.outlineItems.length > 0) {
    outlineText = `\nRECOMMENDED CONTENT BLUEPRINT & HEADING STRUCTURE:\n` +
      input.outlineItems.map((sec, idx) => {
        const subs = (sec.h3s && sec.h3s.length > 0) ? `\n   Subsections (###): ${sec.h3s.join(', ')}` : '';
        const points = (sec.keyPoints && sec.keyPoints.length > 0) ? `\n   Practitioner details: ${sec.keyPoints.join('; ')}` : '';
        return `${idx + 1}. ## ${sec.h2}${subs}${points}`;
      }).join('\n');
  }

  const templateSection = input.templateDirectives ? `\nSPECIALIZED FORMAT ARCHITECTURE:\n${input.templateDirectives}\n` : '';

  return `INPUTS
Primary keyword: ${input.keyword}
Secondary/related keywords: ${secondaryKws}
Search intent: ${input.intent} (informational / commercial / transactional / navigational)
Target audience: ${input.audience || 'Practitioners, operators, and decision-makers seeking real-world results'}
Point of view / brand voice notes: ${input.voiceNotes || 'Direct, experienced practitioner in a hurry. Conversational authority, sensible contractions, zero corporate jargon, zero buzzwords.'}
Word count target: ${input.wordCount || 2000} words
Competing pages to beat (if known):
${competitorPages}
${templateSection}${outlineText}

EXECUTION PROTOCOL (APPLY MANDATORY STEPS 1 THROUGH 5):
1. Give the core answer immediately in the first 2-3 sentences. No fluff or generic background.
2. Put the primary keyword "${input.keyword}" naturally in the H1 title and once near the top of the first paragraph. Never keyword stuff.
3. Every H2 and H3 must answer real questions. Include at least one practical data table or benchmark matrix, and real numbers/trade-offs.
4. Strictly obey STEP 3 BANNED WORDS: No "delve", "tapestry", "landscape", "robust", "leverage", "crucial", "paramount", "pivotal", "in today's world", "in conclusion", or trailing analytical participle clauses ("ensuring...", "highlighting...").
5. Conclude with real FAQs without any generic restatement summary.

OUTPUT FORMAT:
Return pure Markdown starting directly with the title (# Title Tag). Include Title Tag (<60 chars) and Meta Description (<155 chars) in the opening lines or frontmatter, followed by the complete article Markdown.`;
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

  // Remove empty or generic trailing summary headers like "## In Conclusion" or "## Wrapping Up"
  updated = updated.replace(/##\s+(?:In Conclusion|Wrapping Up|Final Thoughts|Concluding Thoughts)\s*\n+/gi, '## Summary & Next Steps\n\n');

  return {
    content: updated,
    substitutionsCount: count,
    detectedBannedPhrases: detected
  };
}
