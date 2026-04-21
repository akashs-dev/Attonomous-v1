import { UseCase } from '../types/use-case';

export const mockUseCases: UseCase[] = [
  {
    id: '1',
    name: 'Increase PL AIP',
    status: 'Active',
    product: 'Personal Loan',
    primaryGoal: 'AIP Optimization',
    kpiTarget: 15,
    kpiProgress: 12.4,
    budgetTotal: 5000000,
    budgetSpent: 1240000,
    audienceSize: 4567890,
    dailyDecisions: 125000,
    endDate: '2026-06-30'
  },
  {
    id: '2',
    name: 'CC Acquisition Drive',
    status: 'Paused',
    product: 'Credit Card',
    primaryGoal: 'Lead Generation',
    kpiTarget: 20,
    kpiProgress: 8.5,
    budgetTotal: 10000000,
    budgetSpent: 4500000,
    audienceSize: 12000000,
    dailyDecisions: 0,
    endDate: '2026-05-15'
  },
  {
    id: '3',
    name: 'HL Balance Transfer',
    status: 'Draft',
    product: 'Home Loan',
    primaryGoal: 'Form Fill',
    kpiTarget: 10,
    kpiProgress: 0,
    budgetTotal: 3000000,
    budgetSpent: 0,
    audienceSize: 850000,
    dailyDecisions: 0,
    endDate: '2026-07-01'
  },
  {
    id: '4',
    name: 'Dormant User Reactivation',
    status: 'Completed',
    product: 'Savings Account',
    primaryGoal: 'Engagement',
    kpiTarget: 5,
    kpiProgress: 5.2,
    budgetTotal: 1500000,
    budgetSpent: 1480000,
    audienceSize: 2200000,
    dailyDecisions: 0,
    endDate: '2026-03-30'
  }
];
