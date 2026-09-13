/**
 * Research Provider Interface
 * Abstraction for SERP research, competitor extraction, and content gap analysis.
 * Rule 6: If no live research provider is available, clearly state "Live SERP research is unavailable."
 * Never fabricate rankings, volume, or competitor positions.
 */

import { ResearchResult } from '../../types.js';

export interface ResearchProviderInterface {
  readonly providerName: string;
  isConfigured(): boolean;
  conductResearch(keyword: string, country?: string, language?: string): Promise<ResearchResult>;
}
