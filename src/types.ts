/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type ChannelType = 'WhatsApp' | 'SMS' | 'RCS';

export type StrategyFocus = 'No Offer' | 'BFL Offers' | 'Top 5 Partners' | 'Reactivation' | 'Efficiency First' | 'AI-Driven';

export interface PartnerPerformance {
  partner: string;
  channel: ChannelType;
  aipVolume: number;
  cpaip: string;
  ctr: string;
  spend: string;
  trend: string;
  trendDirection: 'up' | 'down' | 'neutral';
}

export interface PerformanceSummary {
  date: string;
  totalSent: number;
  avgCtr: string;
  totalConversions: number;
  totalCost: string;
  aiInsight: string;
  suggestedFocus: StrategyFocus;
}

export type CampaignStatus = 'Live' | 'Paused' | 'Completed' | 'Generated';

export interface SelectionState {
  partners: string[];
  campaigns: Campaign[];
}

export interface Campaign {
  id: string;
  name: string;
  channel: ChannelType;
  users: number;
  spend: string;
  templateId: string;
  templateName: string;
  status: CampaignStatus;
  partner: string;
  isNoOffer?: boolean;
  isReactivation?: boolean;
}

export interface SegmentPerformance {
  segmentId: number;
  segmentName: string;
  channel: ChannelType;
  totalPublished: number;
  totalSent: number;
  totalDelivered: number;
  avgCtr: string;
  totalCost: string;
  totalAIP?: string;
}
