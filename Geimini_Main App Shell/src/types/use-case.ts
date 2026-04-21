export type UseCaseStatus = 'Active' | 'Draft' | 'Completed' | 'Paused';

export interface UseCaseAudience {
  description: string;
  count: number;
  treatment: number;
  control: number;
  holdout: number;
}

export interface DecisionDimension {
  id: string;
  name: string;
  description: string;
  sendTo: string;
  enabled: boolean;
}

export interface ActionBank {
  channels: string[];
  partners: string[];
  frequencies: FrequencyOption[];
  times: string[];
  creatives: string[];
}

export interface FrequencyOption {
  id: string;
  name: string;
  count: number;
  period: string;
}

export interface Guardrails {
  dailyBudget: number;
  totalBudget: number;
  dailyCap: number;
  weeklyCap: number;
  monthlyCap: number;
  channelCaps: Record<string, number>;
  traiBlockout: boolean;
  minGap: number;
  dndEnforcement: boolean;
  blacklistEnforcement: boolean;
  rejectionCoolingEnabled: boolean;
  rejectionCoolingDuration: number;
}

export interface ConversionMetrics {
  event: string;
  timestampField: string;
  optimizeFor: 'Number' | 'Value';
  valueColumn?: string;
  successMetricName: string;
}

export interface UseCaseConfig {
  goal: {
    name: string;
    product: string;
    primaryKpi: string;
    targetLift: number;
    secondaryKpi?: string;
  };
  audience: UseCaseAudience;
  dimensions: DecisionDimension[];
  actionBanks: ActionBank;
  guardrails: Guardrails;
  conversion: ConversionMetrics;
}

export interface UseCase {
  id: string;
  name: string;
  status: UseCaseStatus;
  product: string;
  primaryGoal: string;
  kpiProgress: number;
  kpiTarget: number;
  budgetSpent: number;
  budgetTotal: number;
  audienceSize: number;
  dailyDecisions: number;
  endDate: string;
  config?: UseCaseConfig;
}
