/**
 * GoogleGroundingResearchProvider
 * Uses Gemini Search Grounding or SERP API to perform real search analysis.
 * Adheres strictly to Rule 6 & Rule 60:
 * Never fabricates rankings, search volume, or competitor positions if live data is unavailable.
 */

import { GoogleGenAI } from '@google/genai';
import { ResearchProviderInterface } from './ResearchProviderInterface.js';
import { ResearchResult, CompetitorItem } from '../../types.js';
import { SecurityValidator } from '../security/SecurityValidator.js';

export class GoogleGroundingResearchProvider implements ResearchProviderInterface {
  public readonly providerName = 'Google Search Grounding (Live SERP)';
  private apiKey: string;
  private client: GoogleGenAI | null = null;
  private enableLiveSearch: boolean;

  constructor(apiKey?: string, enableLiveSearch = true) {
    this.apiKey = apiKey || process.env.GEMINI_API_KEY || '';
    this.enableLiveSearch = enableLiveSearch;
    if (this.apiKey) {
      this.client = new GoogleGenAI({
        apiKey: this.apiKey,
        httpOptions: {
          headers: { 'User-Agent': 'aistudio-build' },
        },
      });
    }
  }

  public isConfigured(): boolean {
    return Boolean((this.apiKey || process.env.GEMINI_API_KEY) && this.enableLiveSearch);
  }

  public async conductResearch(keyword: string, country = 'US', language = 'en'): Promise<ResearchResult> {
    if (!this.isConfigured()) {
      return {
        keyword,
        isLiveResearchAvailable: false,
        providerNotice: 'Live SERP research is unavailable. Real search grounding is not configured. Competitor rankings and search volumes are not fabricated.',
        competitors: [],
        commonQuestions: [
          `What are the most essential aspects of ${keyword}?`,
          `How can beginners get started with ${keyword}?`,
          `What mistakes should be avoided with ${keyword}?`
        ],
        entities: [keyword],
        contentFormats: ['How-to guide', 'Step-by-step tutorial', 'Summary table'],
        serpFeatures: ['Unavailable without live search provider'],
        contentGaps: {
          topicsCovered: [],
          topicsMissed: ['Comprehensive real-world troubleshooting', 'Step-by-step actionable instructions', 'Comparative summary tables'],
          questionsMissed: ['Common failure points and prevention tips'],
          examplesLacked: ['Specific practical examples with ingredient ratios/concrete parameters'],
          tablesNeeded: ['Reference comparison or quick overview table'],
          visualOpportunities: ['Process walkthrough diagram', 'Final result showcase photo']
        }
      };
    }

    try {
      const ai = this.client || new GoogleGenAI({
        apiKey: this.apiKey || process.env.GEMINI_API_KEY || '',
        httpOptions: { headers: { 'User-Agent': 'aistudio-build' } }
      });

      const prompt = `Perform strategic search research for the target keyword: "${keyword}" (Target region: ${country}, Language: ${language}).
You have access to the Google Search tool. Search for top ranking content and analyze:
1. Top ranking content themes, titles, and typical URL structures
2. Common headings and topics covered by existing resources
3. Key entities and semantic concepts related to "${keyword}"
4. User questions found in SERPs or forums
5. CONTENT GAP ANALYSIS: Identify topics competitors miss, questions they leave unanswered, examples they lack, and visual/table opportunities that would make a genuinely superior, more useful resource for the reader.

CRITICAL RULES:
- Never copy competitor content.
- Do NOT fabricate precise search volumes or pretend to know secret algorithm weights.
- Provide objective, strategic research.
- Return raw valid JSON adhering to the following structure:

{
  "competitors": [
    { "title": "...", "url": "https://...", "snippet": "...", "commonHeadings": ["..."], "format": "..." }
  ],
  "commonQuestions": ["..."],
  "entities": ["..."],
  "contentFormats": ["..."],
  "serpFeatures": ["..."],
  "contentGaps": {
    "topicsCovered": ["..."],
    "topicsMissed": ["..."],
    "questionsMissed": ["..."],
    "examplesLacked": ["..."],
    "tablesNeeded": ["..."],
    "visualOpportunities": ["..."]
  }
}`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          systemInstruction: 'You are an objective SEO research analyst. Extract competitor insights and real content gaps to create the most useful guide on the web. Output pure JSON.',
          responseMimeType: 'application/json',
          temperature: 0.2,
          tools: [{ googleSearch: {} }]
        }
      });

      const text = response.text || '';
      let parsed: Partial<ResearchResult> = {};
      try {
        const clean = text.replace(/^```json\s*/i, '').replace(/```\s*$/i, '').trim();
        parsed = JSON.parse(clean);
      } catch {
        parsed = {};
      }

      // Sanitize any extracted competitor text against prompt injections
      const sanitizedCompetitors: CompetitorItem[] = (parsed.competitors || []).map((c: CompetitorItem) => ({
        title: SecurityValidator.sanitizeExternalResearch(c.title || 'Organic Competitor', 200),
        url: SecurityValidator.isSafeUrl(c.url || '').safe ? c.url : '',
        snippet: SecurityValidator.sanitizeExternalResearch(c.snippet || '', 500),
        commonHeadings: (c.commonHeadings || []).map(h => SecurityValidator.sanitizeExternalResearch(h, 100)),
        format: c.format || 'Article'
      }));

      return {
        keyword,
        isLiveResearchAvailable: true,
        providerNotice: 'Live SERP research active via Google Search Grounding. Competitor insights derived from real search landscape.',
        competitors: sanitizedCompetitors,
        commonQuestions: parsed.commonQuestions || [],
        entities: parsed.entities || [keyword],
        contentFormats: parsed.contentFormats || ['Comprehensive Guide'],
        serpFeatures: parsed.serpFeatures || ['Featured Snippet', 'People Also Ask'],
        contentGaps: {
          topicsCovered: parsed.contentGaps?.topicsCovered || [],
          topicsMissed: parsed.contentGaps?.topicsMissed || ['Practical step-by-step execution details'],
          questionsMissed: parsed.contentGaps?.questionsMissed || ['Specific troubleshooting scenarios'],
          examplesLacked: parsed.contentGaps?.examplesLacked || ['Clear before-and-after case or concrete portions'],
          tablesNeeded: parsed.contentGaps?.tablesNeeded || ['Quick-glance timing and ingredient breakdown'],
          visualOpportunities: parsed.contentGaps?.visualOpportunities || ['Step-by-step progress images']
        }
      };
    } catch (err) {
      return {
        keyword,
        isLiveResearchAvailable: false,
        providerNotice: `Live SERP research could not complete (${err instanceof Error ? err.message : String(err)}). Proceeding with search intent analysis. No fake competitor data was generated.`,
        competitors: [],
        commonQuestions: [
          `How to achieve optimal results with ${keyword}?`,
          `What are the most frequent pitfalls with ${keyword}?`
        ],
        entities: [keyword],
        contentFormats: ['How-to guide', 'Recipe / Checklist'],
        serpFeatures: [],
        contentGaps: {
          topicsCovered: [],
          topicsMissed: ['Actionable hands-on instructions', 'Complete ingredient / tool list'],
          questionsMissed: ['Common failure points and prevention tips'],
          examplesLacked: ['Step-by-step preparation examples'],
          tablesNeeded: ['Prep and cook time summary table'],
          visualOpportunities: ['Process walkthrough diagram', 'Final result showcase photo']
        }
      };
    }
  }
}
