/**
 * Mock Research Provider
 * For testing and verification without live search calls.
 * Labeled clearly as test research.
 */

import { ResearchProviderInterface } from './ResearchProviderInterface.js';
import { ResearchResult } from '../../types.js';

export class MockResearchProvider implements ResearchProviderInterface {
  public readonly providerName = 'Mock Research Provider (Testing Mode)';

  public isConfigured(): boolean {
    return true;
  }

  public async conductResearch(keyword: string): Promise<ResearchResult> {
    return {
      keyword,
      isLiveResearchAvailable: false,
      providerNotice: 'Testing Mode Active: Mock research provider loaded. No live SERP queries executed.',
      competitors: [
        {
          title: `Top Resource for ${keyword} - Test Reference`,
          url: 'https://example.com/test-resource',
          snippet: `A sample competitor page covering standard advice for ${keyword}.`,
          commonHeadings: ['Preparation', 'Ingredients', 'Cooking Tips'],
          format: 'Recipe'
        }
      ],
      commonQuestions: [
        `What makes ${keyword} so popular?`,
        `How to make ${keyword} in under 30 minutes?`,
        `Can I substitute ingredients in ${keyword}?`
      ],
      entities: [keyword, 'Quick Dinners', 'Family Meals', 'Prep Time'],
      contentFormats: ['Recipe Cards', 'Step-by-step Photos', 'Nutritional Breakdown'],
      serpFeatures: ['Recipe Rich Card', 'People Also Ask'],
      contentGaps: {
        topicsCovered: ['Basic ingredient listing', 'Standard cooking instructions'],
        topicsMissed: ['Proper resting times to preserve juiciness', 'Freezer meal prep instructions', 'Low-sodium seasoning alternatives'],
        questionsMissed: ['How to tell when chicken reaches safe internal temperature without cutting into it'],
        examplesLacked: ['Pantry-staple marinade combinations'],
        tablesNeeded: ['Quick cook-time cheat sheet by cut (breasts vs thighs vs tenders)'],
        visualOpportunities: ['Ingredient flatlay', 'Searing pan closeup', 'Plated family dinner']
      }
    };
  }
}
