/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Campaign, SegmentPerformance, PerformanceSummary, PartnerPerformance } from './types';

export const YESTERDAY_PERFORMANCE: PerformanceSummary = {
  date: '2026-02-15',
  totalSent: 124500,
  avgCtr: '2.8%',
  totalConversions: 842,
  totalCost: '₹42,850',
  aiInsight: 'BFL Offers are significantly outperforming generic strategy in the "Reactivation" segment (+12% lift).',
  suggestedFocus: 'BFL Offers'
};

export const YESTERDAY_PARTNER_PERFORMANCE: PartnerPerformance[] = [
  { partner: 'BFL', channel: 'WhatsApp', aipVolume: 1245, cpaip: '₹42', ctr: '18.2%', spend: '₹12.4L', trend: '+4.2%', trendDirection: 'up' },
  { partner: 'HDFC', channel: 'SMS', aipVolume: 892, cpaip: '₹48', ctr: '14.1%', spend: '₹8.2L', trend: '-2.1%', trendDirection: 'down' },
  { partner: 'No Offer', channel: 'WhatsApp', aipVolume: 645, cpaip: '₹35', ctr: '9.8%', spend: '₹4.2L', trend: '+0.5%', trendDirection: 'neutral' },
  { partner: 'Top 5 (avg)', channel: 'RCS', aipVolume: 1023, cpaip: '₹45', ctr: '16.3%', spend: '₹10.1L', trend: '+1.8%', trendDirection: 'up' },
];

export const TOMORROW_CAMPAIGNS: Campaign[] = [
  {
    id: 'T-1',
    name: 'BFL_Urgency_6PM',
    channel: 'WhatsApp',
    users: 8234,
    spend: '₹2,800',
    templateId: 'WA_BFL_001',
    templateName: 'BFL Exclusive Offer',
    status: 'Generated',
    partner: 'BFL',
    isNoOffer: false,
    isReactivation: false
  },
  {
    id: 'T-2',
    name: 'HDFC_Reminder_10AM',
    channel: 'SMS',
    users: 5200,
    spend: '₹2,100',
    templateId: 'SMS_HDFC_001',
    templateName: 'HDFC Personal Loan',
    status: 'Generated',
    partner: 'HDFC',
    isNoOffer: false,
    isReactivation: false
  },
  {
    id: 'T-3',
    name: 'ICICI_Benefit_7PM',
    channel: 'RCS',
    users: 3100,
    spend: '₹1,200',
    templateId: 'RCS_ICICI_001',
    templateName: 'ICICI Benefits',
    status: 'Generated',
    partner: 'ICICI',
    isNoOffer: false,
    isReactivation: false
  },
  {
    id: 'T-4',
    name: 'NoOffer_Reminder_2PM',
    channel: 'WhatsApp',
    users: 2100,
    spend: '₹720',
    templateId: 'WA_NO_001',
    templateName: 'No Offer Service',
    status: 'Generated',
    partner: 'Internal',
    isNoOffer: true,
    isReactivation: false
  },
  {
    id: 'T-5',
    name: 'BFL_SocialProof_8PM',
    channel: 'SMS',
    users: 1800,
    spend: '₹540',
    templateId: 'SMS_BFL_002',
    templateName: 'BFL Social Proof',
    status: 'Generated',
    partner: 'BFL',
    isNoOffer: false,
    isReactivation: true
  },
  {
    id: 'T-6',
    name: 'SBI_Offer_9AM',
    channel: 'WhatsApp',
    users: 4500,
    spend: '₹1,800',
    templateId: 'WA_SBI_001',
    templateName: 'SBI Special',
    status: 'Generated',
    partner: 'SBI',
    isNoOffer: false,
    isReactivation: false
  }
];

export const TODAY_CAMPAIGNS: Campaign[] = TOMORROW_CAMPAIGNS; // Compatibility fallback

export const SEGMENT_PERFORMANCE_DATA: SegmentPerformance[] = [
  {
    segmentId: 22701,
    segmentName: 'Cards_AI_WA_SBI_AIPSTB_FEB16',
    channel: 'WhatsApp',
    totalPublished: 14039,
    totalSent: 13564,
    totalDelivered: 8963,
    avgCtr: '5.31%',
    totalCost: '₹30,451'
  },
  {
    segmentId: 22637,
    segmentName: 'Cards_AI_SMS_SBI_AIPSTB_FEB03',
    channel: 'SMS',
    totalPublished: 48852,
    totalSent: 40050,
    totalDelivered: 39209,
    avgCtr: '0.15%',
    totalCost: '₹8,802'
  },
  {
    segmentId: 22708,
    segmentName: 'LP_SEC_GL_RCS_ETP_ETB_SAL_LIVE_MARATHI_FEB26',
    channel: 'RCS',
    totalPublished: 28527,
    totalSent: 22088,
    totalDelivered: 16604,
    avgCtr: '0.03%',
    totalCost: '₹6,439'
  }
];
